import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { ConstantsService, QualProposalListObj } from '@app/shared/services/constants.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { Router } from '@angular/router';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { PermissionService } from '@app/permission.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { SubscriptionAccessComponent } from '@app/modal/subscription-access/subscription-access.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deal-id-lookup',
  templateUrl: './deal-id-lookup.component.html',
  styleUrls: ['./deal-id-lookup.component.scss']
})
export class DealIdLookupComponent implements OnInit, OnDestroy {
  @ViewChild('optyName', { static: false }) private valueContainer: ElementRef;
  showDealSummary = false;
  searchDealId = true;
  invalidDealId = false;
  dealInput: string;
  state: string;
  isPartnerDeal = false;
  isChangeSubSelected = false;
  subscriptionId = ''
  errorDealID = false;
  errorSubID = false;
  isSubIdValid = false;
  qualEADealId: string;
  qualEAQualificationName: string;
  resultMatch = false;
  isCustomerMatching: boolean;
  newQualData: any = [];
  prospectDetails: any = {};
  eaQualDescription: string;
  errorMessage: string;
  isQualNameInvalid = false;
  showLoccMsg = false;
  isProspectFound = false;
  subscriptionList = [];
  selectedSubId = '';
  sfdcPunchInDeal: any;

  constructor(
    public appDataService: AppDataService,
    public constantsService: ConstantsService,
    public qualService: QualificationsService,
    public messageService: MessageService,
    private productSummaryService: ProductSummaryService,
    public localeService: LocaleService,
    public renderer: Renderer2,
    private blockUiService: BlockUiService,
    public utilitiesService: UtilitiesService,
    public documentCenter: DocumentCenterService,
    private router: Router, private createProposalService: CreateProposalService,
    private permissionService: PermissionService,
    private modalVar: NgbModal,
    public activeModal: NgbActiveModal) { }

  ngOnInit() {
    // console.log(this.appDataService.customerID)
    this.messageService.clear();
    this.state = 'prospect';
    this.resetQualData(); // Reset qualification object to default value
    this.qualService.disabledContinueButton = false;
    this.checkForSfdcDeal();
  }

  checkForSfdcDeal(){
    this.sfdcPunchInDeal = sessionStorage.getItem('sfdcPunchInDeal');
    if(this.sfdcPunchInDeal){
      this.qualEADealId = atob(this.sfdcPunchInDeal);
    }
    sessionStorage.removeItem('sfdcPunchInDeal');
  }


  // Reset qualification object to default value
  resetQualData() {
    this.qualService.qualification = {
      dealId: '',
      title: '',
      qualID: '',
      status: '',
      prevChangeSubQualId: '',
      dealInfoObj: {},
      name: '',
      accountManager: { 'firstName': '', 'lastName': '', 'emailId': '', 'userId': '' },
      customerInfo: { 'accountName': '', 'address': '', 'smartAccount': '', 'preferredLegalName': '', 'scope': '', 'affiliateNames': '',
      'repName': '', 'repTitle': '', 'repEmail': '', 'filename': '', 'repFirstName': '', 'repLastName': '','phoneCountryCode':'',
      'dialFlagCode': '','phoneNumber':'' },
      legalInfo: {
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      },
      address: {
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      },
      cam:
      {
        'firstName': '',
        'lastName': '',
        'camEmail': '',
        'beGeoId': 0,
        'cecId': '',
        'role': ''
      },
      softwareSalesSpecialist: [],
      salesTeamList: [],
      permissions: {},
      extendedsalesTeam: [],
      cxTeams: [],
      cxDealAssurerTeams: [],
      distributorTeam: [],
      subscription: {},
      partnerTeam: [],
      eaQualDescription: '',
      accountAddress: '',
      accountName: '',
      accountManagerName: '',
      excludedSubidiaryHqInfo: [],
      qualStatus: '',
      primaryPartnerName: '',
      userEditAccess: true,
      federal: 'no',
      partnerDeal: false,
      loaSigned: false,
      distiInitiated:false,
      createdBy: ''
    };
  }
  ngOnDestroy() {
    this.messageService.clear();
  }
  // method to call search deal api and set the value in qual service
  searchDeal() {
    const dealLookUpRequest = {
      userId: this.appDataService.userId,
      dealId: this.utilitiesService.removeWhiteSpace(this.qualEADealId),
      customerId: ''
    };

    this.productSummaryService.showProspectDealLookUp(dealLookUpRequest).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.isCustomerMatching = res.data.matching;
        this.isPartnerDeal = res.data.partnerDeal;
        this.newQualData = res.data.dealDetails;
        if (res.data.prospectDetails) {
          this.isProspectFound = true;
          this.prospectDetails = res.data.prospectDetails[0];
        } else {
          this.prospectDetails = {};
          this.isProspectFound = false;
        }
        this.qualService.qualification.partnerDeal = res.data.partnerDeal;
        this.qualService.qualification.loaSigned = res.data.loccSigned;
        this.qualService.qualification.dealInfoObj = this.newQualData;
        this.qualService.qualification.dealId = this.newQualData.dealId;
        this.appDataService.customerID = this.prospectDetails.prospectKey;
        this.appDataService.customerName = this.prospectDetails.prospectName;
        this.appDataService.archName = this.constantsService.DNA;
        if (this.newQualData.accountManager) {
          this.qualService.qualification.accountManager = this.newQualData.accountManager;
          this.qualService.qualification.accountManagerName = this.newQualData.accountManager.firstName + ' ' +
          this.newQualData.accountManager.lastName;
          this.qualService.emailID = this.newQualData.accountManager.emailId;
        }
        this.qualService.qualification.name = this.qualEAQualificationName = this.newQualData.optyName;
        this.isQualNameInvalid = false;
        this.qualService.qualification.eaQualDescription = this.eaQualDescription;
        this.qualService.qualification.accountAddress = this.newQualData.accountAddress;
        this.qualService.qualification.accountName = this.newQualData.accountName;
        if (this.isPartnerDeal) {
          this.qualService.qualification.primaryPartnerName = res.data.partnerInfo.beGeoName;
          // if (res.data.loaCustomerContact) {
          //   this.qualService.qualification.customerInfo.repName = res.data.loaCustomerContact.repName;
          //   this.qualService.qualification.customerInfo.repTitle = res.data.loaCustomerContact.repTitle;
          //   this.qualService.qualification.customerInfo.repEmail = res.data.loaCustomerContact.repEmail;
          //   this.qualService.qualification.customerInfo.repFirstName = res.data.loaCustomerContact.repFirstName;
          //   this.qualService.qualification.customerInfo.repLastName = res.data.loaCustomerContact.repLastName;
          // }
        } else {
          this.qualService.qualification.primaryPartnerName = this.newQualData.primaryPartnerName;
        }
        this.qualService.qualification.legalInfo = this.newQualData.accountAddressDetail;
        this.qualService.qualification.address.addressLine1 = this.qualService.qualification.legalInfo.addressLine1;
        this.qualService.qualification.address.addressLine2 = this.qualService.qualification.legalInfo.addressLine2;
        this.qualService.qualification.address.city = this.qualService.qualification.legalInfo.city;
        this.qualService.qualification.address.country = this.qualService.qualification.legalInfo.country;
        this.qualService.qualification.address.state = this.qualService.qualification.legalInfo.state;
        this.qualService.qualification.address.zip = this.qualService.qualification.legalInfo.zip;
        this.qualService.qualification.customerInfo.scope = this.constantsService.NONE;
        this.qualService.qualification.federal = 'no';
        this.errorDealID = false;

        this.showDealSummary = true;
        this.searchDealId = false;
        // to check and show message if cisco led uses partner deal for which locc not signed or initiated while deal look up to create qualification
        if (this.qualService.qualification.partnerDeal && !this.qualService.qualification.loaSigned &&
          !res.data.loccInitiated && !res.data.loccOptional) {
          this.showLoccMsg = true;
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
        this.errorMessage = this.localeService.getLocalizedMessage('qual.create.NO_ASSOCIATED_DEAL');
        this.searchDealId = false;
        this.errorDealID = true;
        this.invalidDealId = true;
      }
    });
  }

  matchDealId() {
    this.resultMatch = !this.resultMatch;
    this.qualService.resultMatch = this.resultMatch;
  }

  // If Qualification Name is blank then disable create button.
  isQualNameBlank() {
    this.isQualNameInvalid = (this.qualEAQualificationName === '') ? true : false;
  }

  // method to create qual, close the modal and route to who involved page
  createQual() {
    this.qualService.qualification.name = this.qualEAQualificationName;
    this.qualService.qualification.eaQualDescription = this.eaQualDescription;

    this.blockUiService.spinnerConfig.stopChainAfterThisCall(); // Stop chain after below ajax call,to remove progress bar.
    this.qualService.createQual().subscribe(
      (res: any) => {
        if (!res.error) {
          try {
            this.qualService.createQualFlow = true;
            this.qualService.qualification.qualID = res.qualId;
            this.qualService.isQualCreated = true;

            if (res.permissions && res.permissions.featureAccess && res.permissions.featureAccess.length > 0) {
              this.permissionService.qualPermissions = new Map(res.permissions.featureAccess.map(i => [i.name, i]));
            } else {
              this.permissionService.qualPermissions.clear();
            }

            // Set local permission for debugger
            this.permissionService.isProposalPermissionPage(false);
            this.qualService.qualification.qualStatus = res.qualStatus;
            this.utilitiesService.changeMessage(false);
            this.documentCenter.comingFromDocCenter = false;
            const sessionObject: SessionData = this.appDataService.getSessionObject();
            sessionObject.qualificationData = this.qualService.qualification;
            sessionObject.comingFromDocCenter = this.qualService.comingFromDocCenter;
            this.appDataService.setSessionObject(sessionObject);
            // Below changes are the part of edit qual routing changes.
            this.router.navigate(['qualifications/' + res.qualId]);
            this.activeModal.close({
              continue: false
            });
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      },
      error => {
        this.messageService.displayUiTechnicalError(error);
      }
    );

  }

  // method to close the modal and reset all the values
  cancel() {
    this.messageService.clear();
    this.showLoccMsg = false;
    this.activeModal.close({
      continue: false
    });
  }

  // method to reset all the values if user changes the deal id
  updateDealLookUpID() {
    this.showDealSummary = false;
    this.searchDealId = true;
    this.invalidDealId = false;
    this.errorDealID = false;
    this.resultMatch = false;
    this.isPartnerDeal = false;
    this.showLoccMsg = false;
    this.messageService.clear();
  }

  focusDealIdInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  open(tooltip) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }

  selectDealLookUp(event) {
    if (event.target.value === 'lookup') {
      this.isChangeSubSelected = false;
      //reset subscription id related stuff
      this.subscriptionId = '';
      this.updateSubId();
    } else {
      this.isChangeSubSelected = true;
      //reset deal id related stuff
      this.updateDealLookUpID();
      if (!this.sfdcPunchInDeal){
        this.qualEADealId = '';
      }
      this.qualService.disabledContinueButton = false;
      this.qualService.validateChangeSubAccess();
    }
  }

  subLookup() {
    this.subscriptionId = this.utilitiesService.removeWhiteSpace(this.subscriptionId),
    // API call to lookup subscription
    this.qualService.subscriptionLookup(this.subscriptionId).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          if(response.data && response.data.subscriptions){
            this.subscriptionList = response.data.subscriptions;
            this.isSubIdValid = true;
          } else {
            this.errorSubID = true;
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else if (response.error) {
        this.messageService.displayMessagesFromResponse(response);
      } else {
        this.messageService.displayUiTechnicalError();
      }
    });
    //   this.isSubIdValid = true;
    //   const res = {
    //     "rid": "1730faf4-d9d4-4621-95fb-b311f459dc08",
    //     "user": "nekedia",
    //     "error": false,
    //     "data": {
    //         "subRefId": "Sub429426",
    //         "customerMatched": false,
    //         "subProspectKey": 11,
    //         "subCustomerGuId": 10492,
    //         "subCustomerName": "INTERNATIONAL BUSINESS MACHINES CORPORATION",
    //         "subscriptions": [
    //             {
    //                 "subscriptionId": "Sub429426",
    //                 "startDate": "04/05/2020",
    //                 "endDate": "03/25/2023",
    //                 "virtualAccountName": "DEFAULT",
    //                 "virtualAccountId": "134452",
    //                 "smartAccountName": "google.com",
    //                 "smartAccountId": "105844",
    //                 "crPartyId": 11916610,
    //                 "partnerBeGeoId": 111130138,
    //                 "status": "ACTIVE",
    //                 "smartAccounts": {
    //                     "134452": {
    //                         "domainIdentifier": "google.com",
    //                         "accountId": "105844",
    //                         "accountName": "google.com",
    //                         "accountType": "customer",
    //                         "virtualAccountId": "134452",
    //                         "virtualAccountName": "DEFAULT"
    //                     }
    //                 }
    //             }
    //         ]
    //     },
    //     "currentDate": "2020-05-19T23:24:09.599+0000"
    // }
    
    //   this.subscriptionList = res.data.subscriptions;
    }

    updateSubId(){
      this.errorSubID = false;
      this.isSubIdValid = false;
      this.selectedSubId = '';
    }

    selectSubscription(sub){
      this.selectedSubId = sub.subscriptionId;    
    }
    deselectSubscription() {
      this.selectedSubId = '';
    } 
    
    continue(){
      if (this.qualService.changSubAccess) {
        this.qualService.goToCcwWithSubId(this.selectedSubId).subscribe((res:any) => {
          if(res && res.data && !res.error) {
            if(res.data){
              window.open(res.data, '_self');
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      } else {
        const modalRef = this.modalVar.open(SubscriptionAccessComponent, { windowClass: 'subscriptionaccess-modal'});
          modalRef.result.then((result) => {
            this.qualService.disabledContinueButton = true;
             return;
        });
      }
    }
}
