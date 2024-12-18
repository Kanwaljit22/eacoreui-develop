import { LocalizationEnum } from './commons/enums/localizationEnum';
import { Injectable, Renderer2, RendererFactory2  } from '@angular/core';
import { EaStoreService, IUserDetails } from './ea-store.service';
import { EaPermissionsService } from './ea-permissions/ea-permissions.service';
import { EaPermissionEnum } from './ea-permissions/ea-permissions';
import { EaRestService } from "ea/ea-rest.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { IDealInfo } from 'vnext/proposal/proposal-store.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EaService {

  constructor(rendererFactory: RendererFactory2,private router: Router, private eaStoreService: EaStoreService, private eaPermissionsService: EaPermissionsService,private eaRestService: EaRestService, private localizationService: LocalizationService, private constantsService: ConstantsService ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }
   renderer: Renderer2;
  alreadyLoggedIn = false;
  anchorValue = '';
  onFilterSelection = new Subject(); // set if filter applied
  clearFilterSelection = new Subject();
  showCaseManagementSubject = new BehaviorSubject(false);
  // showCaseManagement = false;
  customProgressBarMsg = {
    requestOverride:false,
    witdrawReqOverride:false
  }
  localizationMapUpdated = new BehaviorSubject('');
  isFeatureEnbled = true;
  features:any = {}
  isDistiOpty = false;
  isResellerOpty = false;
  isDistiLoggedIn = false;
  isResellerLoggedIn = false;
  readonly featureArray = ["SEP_REL", "SPNA_REL", "STO_REL","NPI_AUTOMATION_REL","SPNA_FRENCH_DOCUMENT_REL", "SEC_SUITE_REL","SPNA_BP_ENABLEMENT_REL", "PARAMETER_ENCRYPTION", "EAID_REL", "EDIT_EAID_REL", "FIRESTORM_REL", "BONFIRE_REL", "CROSS_SUITE_MIGRATION_REL", "IB_OPTIMIZATION","PROVIDER_CONNECTIVITY_REL", "MSEA_REL","PARTNER_SUPER_USER_REL", "SPLUNK_SUITE_REL", "RENEWAL_SEPT_REL","IRONCLAD_C2A","ENABLE_MANUAL_RESIDUAL_CREDIT_UPDATE", "COTERM_SEPT_REL", "CX_MANDATORY_SEPT_REL", "WIFI7_REL", "SPA_PID_TYPE" , "CLO_OTD_NOV_REL", "UPFRONT_IBC", "TCO_REL", "SERVICE_LED"];
  isUpgradeFlow = false;
  isSpnaFlow = false;
  isManageBpScope = false;
  updateProxySubject = new Subject();
  checkForSuperUser(){
    this.eaStoreService.isUserRwSuperUser = this.eaPermissionsService.userPermissionsMap.has(EaPermissionEnum.RwMessage)
    if(!this.eaStoreService.isUserRwSuperUser){
      this.eaStoreService.isUserRoSuperUser = this.eaPermissionsService.userPermissionsMap.has(EaPermissionEnum.RoMessage)
    }
  }

  // method to check partner login
  isPartnerUserLoggedIn() {
    let userInfo : any
    userInfo = this.eaStoreService.userInfo;
    if (userInfo.accessLevel === 3) {
      return true;
    } else {
      return false;
    }
  }

  // check for proxy permission
  showProxy() {
    if (this.eaPermissionsService.userPermissionsMap.has(EaPermissionEnum.ProxyUser)) {
      return true;
    } else {
      return false;
    }
  }

  get getAppDomainWithContext(){
    if(this.eaStoreService.isValidationUI){
      return '../../vuingapi/';
    } else {
      return '../../ngapi/';
    }
  }

  navigateToVui(){
    this.router.navigate(['ea/project/proposal/vui'], { queryParams: { bp: 'BUYING_PGRM_3' } });
  }

  public isValidResponseWithData(response, displayMsgForSection = false){
    if(response && response.data && !response.error){
        return true;
    }else if(!displayMsgForSection){      
      // this.messageService.displayMessagesFromResponse(response);
    }
    return false;
  }
  public isValidResponseWithoutData(response, displayMsgForSection = false){
    if(response && !response.error){
        return true;
    }else if(!displayMsgForSection){      
      // this.messageService.displayMessagesFromResponse(response);
    }
    return false;
  }

  // Redirect to new smart account
  redirect(url){
    window.open(url);
  }


  // Get redirect url for new smart account
  redirectToNewSmartAccount () {

    const url = 'project/create-smart-account-url';

    this.eaRestService.getApiCall(url).subscribe((response: any) => {
    if (this.isValidResponseWithData(response, true)) {
      this.redirect(response.data);
    }
    });
  }

  // set localized string from API 
  getLocalizedString(localizationKey, isMultipleKeys?:boolean){
    localizationKey = isMultipleKeys ? localizationKey : [localizationKey];

    if(!this.localizationService.localizedkeySet.has(localizationKey) ){
      const url = 'locale/getlocalization';
      const reqObj = {
        "langCode":"en_US",
        "moduleName":localizationKey
     }
      this.eaRestService.postApiCall(url,reqObj).subscribe((response: any) => {
        if (response && !response.error && response.data && response.data.localizedList){
            for (const localeString of response.data.localizedList){
              this.localizationService.localizedString.set(localeString.contentKey, localeString.contentValue)
            }
            this.localizationService.localizedkeySet.add(localizationKey);
            this.localizationMapUpdated.next(localizationKey)
          } else {
            this.getCachedLocalizedString(localizationKey);
          }
      });
    }
  }

  // set localized string from JSON
  getCachedLocalizedString(localizationKey?) {
    const url = 'assets/data/localization.json';
    if (localizationKey) {
      this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
        if (response && !response.error && response.result && response.result.length) {
          let data = response.result.filter(item => item.key.includes(localizationKey));
          for (const localeString of data) {
            this.localizationService.localizedString.set(localeString.key, localeString.value)
          }
          this.localizationMapUpdated.next(localizationKey)
        }
      });
    } else {
      this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
        if (response && !response.error && response.result && response.result.length) {
          for (const localeString of response.result) {
            this.localizationService.localizedString.set(localeString.key, localeString.value)
          }
          this.localizationService.localizedkeySet.add(LocalizationEnum.all);
          this.localizationMapUpdated.next(LocalizationEnum.all)
        }
      });
    }
  }


  loadAdrumScript() {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = "https://www.cisco.com/c/dam/cdc/t/ctm-core.js";
    const element = document.getElementsByClassName('adrum-script-core')[0];
    this.renderer.appendChild(element, script);
    console.log('check for local adrum');
    setTimeout(() => {
      const script_ctm = this.renderer.createElement('script');
      script_ctm.type = 'text/javascript';
      script_ctm.src = "https://www.cisco.com/c/dam/cdc/t/ctm.js";
      const element = document.getElementsByClassName('adrum-script')[0];
      this.renderer.appendChild(element, script_ctm);
    }, 500);
  }



  visibleManualIbPull(){
    const url = 'resource/SHOW_MANUAL_IB_PULL_BUTTON';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (response && !response.error && response.value) {
        if(response.value === 'Y'){
          this.eaStoreService.ibRepullFeatureFlag =  true;
        }else {
          this.eaStoreService.ibRepullFeatureFlag =  false;
        }
      }
    });
  }


  getActiveFeature() {
    if( Object.keys(this.features).length){
      return;
    }
    const feature = sessionStorage.getItem('featuresArray')
    if(feature){
      const fetureObj = JSON.parse(feature);
      this.features = fetureObj.featureEnbled;
      sessionStorage.removeItem('featuresArray');
    } else {
      const request = {
        "data": {
          "featureNames": this.featureArray
        }
      }
      const url = 'feature/status';
      this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
        if (this.isValidResponseWithData(response)) {
          if(response.data.features){
            this.features = response.data.features;
          } else {
            this.features = {};
          }
        }
      });
    }
  }
  

// to convert map to json
  check(){
    const data = [];
    for (const [key, value] of this.localizationService.localizedString.entries()) {
      data.push({'key': key, 'value': value})
    }
    console.log(data);
  }


  getFlowDetails(userInfo:IUserDetails,distiInfoObj:IDealInfo){
        if(this.features.PARTNER_SUPER_USER_REL){//this is to reset service flag
          this.isDistiOpty = false;
          this.isResellerOpty = false;
          this.isResellerLoggedIn = false;
          this.isDistiLoggedIn = false;
        }
        if(distiInfoObj && distiInfoObj.distiDeal){
            if(distiInfoObj.distiDetail && distiInfoObj.distiDetail.distiOpportunityOwner ){
                 this.isDistiOpty = true;
                 this.isResellerOpty = false;
            } else {
                this.isResellerOpty = true;
                this.isDistiOpty = false;
            }
            if(userInfo && userInfo.partner){
                if(userInfo.distiUser){
                    this.isDistiLoggedIn = true;
                    this.isResellerLoggedIn = false;
                }else {
                    this.isResellerLoggedIn = true;
                    this.isDistiLoggedIn = false;
                }
            }
         } 
        //  else {
        //   this.isDistiOpty = false;
        //   this.isResellerOpty = false;
        //   this.isResellerLoggedIn = false;
        //   this.isDistiLoggedIn = false;
        //  }
        
  }

  getPhoneNumber(e164Number, dialCode){
    return e164Number?.slice(dialCode?.length, e164Number?.length);
  }
  updateDetailsForNewTab(){
    const eaSessionObject = {
      userInfo: this.eaStoreService.userInfo,
      features: this.features,
      localizationString:  Object.fromEntries(this.localizationService.localizedString),
      localizedkeySet: Array.from(this.localizationService.localizedkeySet),
      maintainanceObj: this.eaStoreService.maintainanceObj
    }
    localStorage.setItem(
      'eaStorageObject',
       JSON.stringify(eaSessionObject)); 
  }

  // to validate state of customer is of quebec/qc
  validateStateForLanguage(state){
    if(state){
      const value = state.toLowerCase();
      if(value === this.constantsService.QC || value === this.constantsService.QUEBEC){
        return true;
      }
    }
    return false;
  }

  updateUserEvent(data, type, action) {// 
    const request = {
      'eid': '',
      'ename': '',
      'prtnrName': '',
      'action': '',
      'etype': '',
      'custName': [],
      'crByUsrId': '',
      'crOn': '',
      'addlDtls': {'dealId': '', 'proposalObjId':'','proposalBuyPrg': ''}
    }
    if (type === this.constantsService.PROPOSAL) {
      if (this.eaStoreService.isEa2) {//2.0 proposal load / delete
        request.eid = data.id
        request.ename = data.name
        request.prtnrName = (data.partner?.name) ? data.partner.name : undefined
        request.custName = [data.customerName]
        request.crByUsrId = data.createdBy
        request.crOn = data.createdAt
        //request.addlDtls = (data.dealId) ? {dealId: data.dealId}  : undefined;
        request.addlDtls.dealId = (data.dealId) ?  data.dealId  : undefined;
        request.addlDtls.proposalBuyPrg = '2.0';
        request.addlDtls.proposalObjId = undefined;
      } else { // 3.0 proposal
        if(action === this.constantsService.ACTION_UPSERT){
          request.eid = data.id
          request.ename = data.name
          request.prtnrName = (data.partnerInfo?.beGeoName) ? data.partnerInfo.beGeoName : undefined
          request.custName = (data.customer?.accountName) ? [data.customer.accountName] : undefined
          request.crByUsrId = (data.audit?.createdBy) ? data.audit.createdBy : undefined
          request.crOn = (data.audit?.createdAt) ? data.audit.createdAt : undefined
          //request.addlDtls = (data.dealInfo?.id) ? {dealId: data.dealInfo.id} : undefined
          request.addlDtls.dealId = (data.dealInfo?.id) ?  data.dealInfo.id : undefined
          request.addlDtls.proposalBuyPrg = '3.0';
          request.addlDtls.proposalObjId = data.objId;
        } else { // 3.0 proposal delete
          request.eid = data.id
          request.ename = data.name
          request.prtnrName = (data.partnerInfo?.beGeoName) ? data.partnerInfo.beGeoName : undefined
          request.custName = (data.customer?.accountName) ? [data.customer.accountName] : undefined
          request.crByUsrId = data.crBy
          request.crOn = data.crAt;
          request.addlDtls.dealId = (data.dealId) ?  data.dealId  : undefined;
          request.addlDtls.proposalBuyPrg = '3.0';
          request.addlDtls.proposalObjId = data.objId;
        }
      }
    } 
    
    request.action = action;
    request.etype = type;

    const url = 'home/updateuserevent';
    this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
      if (this.isValidResponseWithoutData(response)) {
        if (response.error) {// code if API returns ERROR 
        }
      }
    });

  }

  validateUserProxyAccess(cecId?){
    const url = 'home/user-proxy';
    const request = {
      data:{
        proxyUserId: (cecId) ? cecId : undefined,
        resetToOriginalUser: (cecId) ? false : true
      }
    }
    this.eaRestService.postApiCall(url,request).subscribe((response: any) => {
      this.updateProxySubject.next(response);
    });
  }
  locationUpdateRequired(key){
    let valueFound = false;
      if(key instanceof Array && (key.includes(LocalizationEnum.common) || key.includes(LocalizationEnum.all))){
        valueFound = true;
      } else if(key === LocalizationEnum.common || key === LocalizationEnum.all){
        valueFound = true;
      }
      return valueFound;
  }
}




export interface PaginationObject {
  noOfRecords?: number;
  currentPage?: number;
  pageSize?: number;
  noOfPages?: number
}