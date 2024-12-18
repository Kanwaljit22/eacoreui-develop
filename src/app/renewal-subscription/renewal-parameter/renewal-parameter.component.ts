import { ProposalArchitectureService } from '@app/shared/proposal-architecture/proposal-architecture.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IRoadMap } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { RenewalSubscriptionService } from '../renewal-subscription.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageType } from '@app/shared/services/message';

@Component({
  selector: 'app-renewal-parameter',
  templateUrl: './renewal-parameter.component.html',
  styleUrls: ['./renewal-parameter.component.scss']
})
export class RenewalParameterComponent implements OnInit, OnDestroy {

  roadMap: IRoadMap;
  renewalId = '';
  flow = 'renewal';
  selectedPriceList = this.localeService.getLocalizedString('proposal.create.SELECT_PRICE_LIST');
  defaultCountryName = this.constantsService.UNITED_STATES;
  defaultCountryCode = this.constantsService.US;
  selectedBillingModel = ConstantsService.PREPAID_TERM;
  selectedPartnerName = '';
  selectedCountryCode = this.constantsService.US;
  selectedPriceListName = "";
  eaTermInMonths = 0;
  eaStartDateStr = '';
  eaEndDateInString = '';
  referenceSubscriptionId = '';
  questionnaires = new Array();
  displayQuestionnaires = false;
  architectureShow = true;

  constructor(public localeService: LocaleService, public appDataService: AppDataService, public renewalSubscriptionService: RenewalSubscriptionService, public messageService: MessageService, 

    public constantsService: ConstantsService, public qualService: QualificationsService,private proposalArchitectureService:ProposalArchitectureService) { }


  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.renewalParameter;
    // this.setMockRenewalResponse(); // to set mock data for test purpose
    // check and set renewal id from selectSubscriptionResponse
    if (this.renewalSubscriptionService.selectSubsriptionReponse && this.renewalSubscriptionService.selectSubsriptionReponse.renewalId) {
      this.renewalId = this.renewalSubscriptionService.selectSubsriptionReponse.renewalId;
    }    
    if (this.renewalSubscriptionService.selectSubsriptionReponse && this.renewalSubscriptionService.selectSubsriptionReponse.type === ConstantsService.ON_TIME_FOLLOWON) {
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('renewal.ON_TIME_FOLLOWON'), MessageType.Info), true);     
      this.appDataService.persistErrorOnUi = true; 
    }
    this.getQnASection();
  }

  ngOnDestroy(): void {
    this.appDataService.persistErrorOnUi = false; 
  }

  setMockRenewalResponse() {
    this.renewalSubscriptionService.selectSubsriptionReponse = {
      "renewalId": 30,
      "subscriptionRefIds": [
        "Sub254488"
      ],
      "subscriptions": [
        {
          "subRefId": "Sub254488",
          "prospectKey": 21337,
          "customerGuId": 6166437,
          "customerName": "IGUS GMBH",
          "customerCrPartyId": 6166437,
          "pgtmvBeGeoId": "90664977",
          "pgtmvBeId": "90664568",
          "pgtmvBeCountryID": "5300",
          "beGeoSiteID": "3969943",
          "smartAccountId": "188487",
          "smartAccountName": "IGUS GMBH",
          "smartAccount": {
            "domainIdentifier": "igus.de",
            "accountId": "188487",
            "accountName": "IGUS GMBH",
            "accountType": "customer",
            "virtualAccountId": "264069",
            "virtualAccountName": "CiscoEA-Cisco DNA"
          },
          "status": "ACTIVE",
          "startDate": "2019-05-07T04:00:00.000+0000",
          "endDate": "2024-05-06T04:00:00.000+0000",
          "startDateStr": "05/07/2019",
          "endDateStr": "05/06/2024",
          "billingModel": "Annual Billing",
          "currencyCode": "USD",
          "countryCode": "DE",
          "partnerName": "AXIANS NETWORKS & SOLUTIONS GMBH",
          "remainingEaDuration": 46.2333333333333,
          "totalEaDuration": 60
        }
      ],
      "customerName": "IGUS GMBH",
      "dealId": "47995276",
      "qualId": 14573,
      "requestedStartDate": "2020-12-26T14:46:22.720+0000",
      "billingModel": "Annual Billing",
      "eaTermInMonths": 40.39,
      "countryOfTransaction": "GERMANY",
      "partnerName": "AXIANS NETWORKS & SOLUTIONS GMBH",
      "renwalType": "Early Renewal",
      "currencyCode": "USD",
      "priceListId": 1110,
      "priceList": {
        "id": "Global Price List - EMEA",
        "name": "Global Price List - EMEA",
        "description": "Global EMEA Price List in US Dollars",
        "currencyCode": "USD",
        "priceListId": "1110",
        "defaultPriceList": false,
        "multiplier": 1,
        "erpPriceListId": 1110,
        "legacyPriceListId": 958,
        "active": true
      },
      "eaStartDateStr": "20201226"

    };
  }

  continueToReview() {
    this.renewalSubscriptionService.saveRenewalParametersEmitter.emit(); // emit to call save renewal params api's and continue if no error
    const reqObj = {
      'renewalId': this.renewalId,
      "countryOfTransaction": this.selectedCountryCode,
      "billingModel": this.selectedBillingModel,
      "priceList": this.selectedPriceListName,
      "partnerName": this.selectedPartnerName,
      "requestedStartDate": this.eaStartDateStr,
      "eaStartDateStr": this.eaStartDateStr,
      "eaTermInMonths": this.eaTermInMonths,
      "customerName": this.appDataService.customerName,
      'dealId': this.qualService.qualification.dealId + '',
      "referenceSubscriptionId": this.referenceSubscriptionId,
      "eaEndDateStr": this.eaEndDateInString
    }

    // check if necessary fields are selected and call api to save filled parameters
    // if (this.selectedPriceListName && this.selectedBillingModel && this.selectedCountryCode && this.eaTermInMonths >= 12) {
    //   this.renewalSubscriptionService.saveRenewalParameters(reqObj).subscribe((res: any) => {
    //     if (res && !res.error) {
    //       if (res.data) {
    //         this.renewalSubscriptionService.selectSubsriptionReponse = res.data;
    //         this.roadMap.eventWithHandlers.continue();
    //       }
    //     } else {
    //       this.messageService.displayMessagesFromResponse(res);
    //     }
    //   });
    // }
    // this.roadMap.eventWithHandlers.continue();
  }

  // method to continue to next page
  continue($event){
    this.roadMap.eventWithHandlers.continue();
  }

  backToSubscription() {
    // this.renewalSubscriptionService.fetchRenewals(this.renewalId).subscribe((res: any) => {
    //   if (res && !res.error && res.data) { // check if no error and data present then continue to next page
    //     this.renewalSubscriptionService.selectSubsriptionReponse = res.data;
    //     this.renewalSubscriptionService.selectedSubscriptions = res.data.subscriptionRefIds;
    //     this.roadMap.eventWithHandlers.back();
    //   } else {
    //     // this.renewalSubscriptionService.selectSubsriptionReponse = {};
    //     this.messageService.displayMessagesFromResponse(res);
    //   }
    // });
     this.roadMap.eventWithHandlers.back();
  }


  getQnASection(){
    this.proposalArchitectureService.questions = []; 
    this.renewalSubscriptionService.getQnAForRenewalParameter(this.renewalId).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          try {
             if(response.data.SEC){
                  this.questionnaires = response.data.SEC;
                  this.displayQuestionnaires = true;
                  this.proposalArchitectureService.questions = response.data.SEC;
             }              
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
    });
  }

}
