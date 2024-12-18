import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MessageService } from 'vnext/commons/message/message.service'
import { VnextResolversModule } from './vnext-resolvers.module';
import { ProjectStoreService } from './project/project-store.service';
import { UtilitiesService } from './commons/services/utilities.service';
import { EaRestService } from 'ea/ea-rest.service';
import { Subject } from 'rxjs';
import { ProposalStoreService } from './proposal/proposal-store.service';
import { ConstantsService } from './commons/services/constants.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';


@Injectable({
  providedIn: VnextResolversModule
})
export class VnextService {


  roadmapSubject = new Subject();
  isRoadmapShown = false;
  roadmapStep: any;
  hideProposalDetail = false;
  hideRenewalSubPage = false; // to hide renewal section
  isRouteAllow = false;
  withdrawProposalSubject = new Subject();
  isDecFeatureEnable = false;
  refreshProposalData  = new Subject()

  constructor(private router: Router, public constantsService: ConstantsService,private eaStoreService: EaStoreService, private eaService: EaService,
    private vnextStoreService:VnextStoreService,private messageService:MessageService, private projectStoreService: ProjectStoreService, private utilitiesService: UtilitiesService,private eaRestService: EaRestService, private proposalStoreService: ProposalStoreService) { }

  get getAppDomain() {
      return '../../';
  }


  get getAppDomainWithContext(){
    if(this.eaStoreService.isValidationUI){
      return '../../vuingapi/';
    } else {
      return '../../ngapi/';
    }
  }

  public getUserDetails(response) {
        if (this.isValidResponseWithoutData(response)) {         
          this.prepareUserInfoObject(response.data) ;
        } else {
          this.messageService.displayMessagesFromResponse(response);          
        }   
  }


  public prepareUserInfoObject(userInfo: any):void {
    //let autorizedUser = true;
    // if (userInfo.accessLevel === 4) {
    // this.vnextStoreService.userInfo.firstName = userInfo.firstName;
    // this.vnextStoreService.userInfo.lastName = userInfo.lastName;
    // this.vnextStoreService.userInfo.userId = userInfo.userId;
    // this.vnextStoreService.userInfo.accessLevel = userInfo.accessLevel;
    // this.vnextStoreService.userInfo.partner = userInfo.partner;
    // this.vnextStoreService.userInfo.emailId = userInfo.emailId
    // this.vnextStoreService.userInfo.permissions = userInfo.permissions;
    // if (!userInfo.authorized || !userInfo.partnerAuthorized) {
    //  // this.authMessage = userInfo.message;
    //   this.router.navigate(['project/vNextAuthenication']);
    //   autorizedUser = false;
    // } 
   // return autorizedUser;

  }

  public isValidResponseWithData(response, displayMsgForSection = false, isProposalData?:boolean){
    if(response && response.data && !response.error){
        return true;
    }else if(!displayMsgForSection){      
      this.messageService.displayMessagesFromResponse(response,false, isProposalData);
    }
    return false;
  }
  public isValidResponseWithoutData(response, displayMsgForSection = false){
    if(response && !response.error){
        return true;
    }else if(!displayMsgForSection){      
      this.messageService.displayMessagesFromResponse(response);
    }
    return false;
  }


  public getCompleteAddress(addressObject){
    let completeAddress = '';
     let COMMA_WITH_SPACE = ', '
    if(addressObject.addressLine1){
      completeAddress = completeAddress + addressObject.addressLine1+COMMA_WITH_SPACE;
    }
    if(addressObject.addressLine2){
      completeAddress = completeAddress+addressObject.addressLine2+COMMA_WITH_SPACE;
    }
    if(addressObject.addressLine3){
      completeAddress = completeAddress+addressObject.addressLine3+COMMA_WITH_SPACE;
    }
    if(addressObject.city){
      completeAddress = completeAddress+addressObject.city+COMMA_WITH_SPACE;
    }
    if(addressObject.state){
      completeAddress = completeAddress+addressObject.state+COMMA_WITH_SPACE;
    }
    if(addressObject.countryCode){
      completeAddress = completeAddress+addressObject.countryCode;
    }    
    return completeAddress;
    
  }

  

  // Get invalid email domain
  getInvalidEmailDomains() {
    if (this.vnextStoreService.invalidDomains && this.vnextStoreService.invalidDomains.length > 0) {
      return this.vnextStoreService.invalidDomains;
    } else {
      const url = 'resource/INVALID_EMAIL_DOMAINS'
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
        if (response?.value) {
          response.value = response.value.replace(/\s/g, '');
          this.vnextStoreService.invalidDomains = response.value.split(',');
        }
      });
    }
  }

  // to set dealinfo, customerInfo, partnerInfo and loccDetail from proposal data
  setDealDetailsFromProposalData(data) {
    this.projectStoreService.projectData.objId = data.projectObjId;
    if (data.dealInfo) {
      this.projectStoreService.projectData.dealInfo = data.dealInfo;
    }
    if (data.loccDetail) {
      this.vnextStoreService.loccDetail = data.loccDetail;
    } else {
      this.vnextStoreService.loccDetail = {};
    }
    if (data.customer) {
      this.projectStoreService.projectData.customerInfo = data.customer;
    }
    // if (data.partnerInfo) {
    //   this.projectStoreService.projectData.partnerInfo = data.partnerInfo;
    // }
    if (data.smartAccount){
      this.projectStoreService.projectData.smartAccount = data.smartAccount;
    } else {
      this.projectStoreService.projectData.smartAccount = undefined;
    }
    if(data.referrerQuotes){
      this.projectStoreService.projectData.referrerQuotes = data.referrerQuotes;
    }
  }

  // method to check partner login
  isPartnerUserLoggedIn() {
    if (this.vnextStoreService.userInfo.accessLevel === 3) {
      return true;
    } else {
      return false;
    }
  }

  // method to get max and start date
  getMaxStartDate(expectedMaxDate, todaysDate, eaStartDate, datesDisabled, alreadySelectedRsd, type?, enrollmentId?, renewalId?, proposalId?) {
    datesDisabled = [];
    const buyingProgram = (this.proposalStoreService.proposalData?.buyingProgram) ? this.proposalStoreService.proposalData?.buyingProgram : this.projectStoreService.projectData?.buyingProgram;
    let url = this.getBillingModelAndMaxStartUrl(this.getAppDomainWithContext + 'proposal/max-and-default-start-date', enrollmentId, renewalId, proposalId,buyingProgram);
    if(!proposalId && !renewalId){
      let partOfUrl = ''
      if(buyingProgram){
        partOfUrl = '&projectObjId='
      } else {
        partOfUrl = '?projectObjId='
      }
      url = url + partOfUrl +  this.projectStoreService.projectData?.objId;
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.isValidResponseWithData(response, true)) {
        if (response.data.defaultStartDate === response.data.minStartDate && response.data.minStartDate === response.data.maxStartDate) {
          expectedMaxDate = new Date(response.data.defaultStartDate); 
          eaStartDate = new Date(response.data.defaultStartDate);
          todaysDate = new Date(response.data.defaultStartDate);
          this.vnextStoreService.rsdSubject.next({"expectedMaxDate" : expectedMaxDate, "todaysDate" : todaysDate, "eaStartDate" : eaStartDate, "datesDisabled" :datesDisabled})
        } else {
        expectedMaxDate = new Date(response.data.maxStartDate); // set max date
        // if services, set system date + 90 days 
        if (type ==='services'){
          var cxServicesDate = new Date();
          cxServicesDate.setHours(0, 0, 0, 0);
          todaysDate.setHours(0, 0, 0, 0);
          cxServicesDate.setDate(todaysDate.getDate() + 90)
          expectedMaxDate = cxServicesDate;
        }
        // check if RSD is less than todaysDate, set datesDisabled from RSD date to todaysDate - 1
        if (!type || type ==='services'){
          if (eaStartDate < todaysDate) {
            // check and push dates from rsd to todaysDate - 1 for disabling in calendar
            for (let i = eaStartDate; i < todaysDate; i = new Date(i.setDate(i.getDate() + 1))) {
            datesDisabled.push(i.setHours(0, 0, 0, 0));
            }
            todaysDate = new Date(this.utilitiesService.formateDate(alreadySelectedRsd)); // set to selected date
          }
          eaStartDate = new Date(this.utilitiesService.formateDate(alreadySelectedRsd));
          eaStartDate.setHours(0, 0, 0, 0);
        } else {
          if(this.eaService.features.CROSS_SUITE_MIGRATION_REL){
            if(this.projectStoreService.projectData?.changeSubscriptionDeal && response.data.defaultStartDate){
              eaStartDate = new Date(response.data.defaultStartDate); // set start date
            } else {
              // for renewal flow set start date to defaultStartDate
              if(this.eaService.features?.RENEWAL_SEPT_REL && renewalId && type === 'create'){
                eaStartDate = new Date(response.data.defaultStartDate); // set start date to defaultStartDate
              } else {
                eaStartDate = new Date(response.data.minStartDate); // set start date to minStartDate
              }
            }
          } else {
            eaStartDate = new Date(response.data.minStartDate); // set start date
          }
        }
        // emit updated values to update in create propsal, edit proposal and edit enrollment pages
        this.vnextStoreService.rsdSubject.next({"expectedMaxDate" : expectedMaxDate, "todaysDate" : todaysDate, "eaStartDate" : eaStartDate, "datesDisabled" :datesDisabled})
      }
    } else {
        if(type && (type === 'create')){
          this.messageService.pessistErrorOnUi = true;
        }
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  downloadLocc(downloadZipLink) {
    let url = '';
      let partnerBeGeoId;
      if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
        partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
      } else{
        partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
      }
      if (this.vnextStoreService.loccDetail.loccSigned) {
        url = this.getAppDomainWithContext + 'locc/download/signed/partnerLoa?partnerBeGeoId=' + partnerBeGeoId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&f=0&fcg=0';
      } else {
        url = this.getAppDomainWithContext + 'locc/download/unsigned/partnerLoa?partnerBeGeoId=' + partnerBeGeoId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&f=0&fcg=0';
      }

    const buyingProgram = (this.proposalStoreService.proposalData?.buyingProgram) ? this.proposalStoreService.proposalData?.buyingProgram : this.projectStoreService.projectData?.buyingProgram;
    if (buyingProgram) {
      url = url + '&buyingProgram=' + buyingProgram
    }
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.isValidResponseWithoutData(response, true)) {
        this.utilitiesService.saveFile(response, downloadZipLink);
      }
    });
  }

  redirectTo(map, routerFrom?) {
    if (this.proposalStoreService.proposalData.status === 'COMPLETE' || (this.proposalStoreService.proposalData.objId && map.id === 3)) {
      this.goTo(map, routerFrom)
    } else if (this.roadmapStep > map.id) {
      this.goTo(map)
    }
  }

  goTo(map, routerFrom?) {
    if (map.id === 0) {
      this.router.navigate(['ea/project/' + this.projectStoreService.projectData.objId]);
    } else if (map.id === 1) {
      this.router.navigate(['ea/project/renewal']);
    } else if (map.id === 2) {
      this.router.navigate(['ea/project/proposal/createproposal']);
    } else if (map.id === 3) {
      if (routerFrom) {
        this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
        this.isRouteAllow = true;
      } else {
        if(this.proposalStoreService.proposalData.status === this.constantsService.PROPOSAL_STATUS_PA_IN_PROGRESS && this.roadmapStep < map.id){
          this.proposalStoreService.showProposalSummary = true;
          this.proposalStoreService.showPriceEstimate = false;
        } else {
          this.proposalStoreService.showProposalSummary = false;
          this.proposalStoreService.showPriceEstimate = true;
        }
      }
    } else if (map.id === 4) {
      if (this.proposalStoreService.proposalData.status === 'COMPLETE') {
        this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
        this.isRouteAllow = false;
        this.proposalStoreService.showProposalDashboard = true;
        this.proposalStoreService.showPriceEstimate = false;
      } 
    }

  }

  getBillingModelAndMaxStartUrl(url, enrollmentId?, renewalId?, proposalId?, buyingProgram?) {
    let isParamAdded = false;
    if (enrollmentId) {
      url = url + '?e=' + enrollmentId;
      isParamAdded = true;
    }
    if (renewalId && renewalId > 0) {
      url = (isParamAdded) ? (url + '&renewalId=' + renewalId) : (url + '?renewalId=' + renewalId);
      isParamAdded = true;
    }
    if (proposalId) {
      url = (isParamAdded) ? (url + '&p=' + proposalId) : (url + '?p=' + proposalId);
      isParamAdded = true;
    }
    if (buyingProgram) {
      url = (isParamAdded) ? (url + '&buyingProgram=' + buyingProgram) : (url + '?buyingProgram=' + buyingProgram);
    }
    return url;
  }


  getFormatedDate(date):string{
    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
  }

}

export interface PaginationObject {
  noOfRecords?: number;
  currentPage: number;
  pageSize: number;
  noOfPages?: number
}