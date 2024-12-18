import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EaStoreService {
  smartaccountReqObj: any = {}; // to set reqObj with deal, quoteId & selected smartAccountInfo
  isPePageLoad = false;
  displayProgressBar = false
  userInfo: IUserDetails = {}
  menubarUrl:string;
  authToken:string;
  isEa2 = false; // set if ea2.0 flow
  isFromDashboard = false; // set if page/comp loads from dashboard
  docObjData: any = {};
  isUserApprover = false;
  showProposalsFromDeal = false; // set to show proposals of selected deal
  isShowGuideMe = false; // set to show guide me flyout
  selectedDealData: any = {}; // to set selected deal data 
  showOpenCase = false; // set to show opena case
  showOpenCaseSubject = new Subject();
  pageContext: string;
  pageContextObj = {
    'CREATE_PROJECT': 'ngCreateProjectPage',
    'CREATE_PROPOSAL': 'ngCreateProposalPage',
    'PRICE_ESTIMATION_PAGE': 'ngPriceEstimationPage',
    'PROPOSAL_DASHBOARD': 'ngProposalDashboard',
    'DOCUMENT_CENTER_PAGE': 'ngDocumentCenterPage',
    'RENEWAL_SUBSCRIPTION_PAGE': 'ngRenewalSubPage'
    }
    
  pePunchInLanding = false;
  proxyUser = false;
  proxyUserId = '';
  showHideFilterMenu = false;
  isUserRwSuperUser = false;
  isUserRoSuperUser = false;
  projectId = '';
  isExceptionApprover = false;
  isAllRecordsSelected = false;
  // maintainanceMessage = '';
  // underMaintainance = false;
  // underMaintainanceMessage = '';
  maintainanceObj: IMaintainanceObj = {};
  //localizationApiCallRequired = false;
  ibRepullFeatureFlag = false;
  readonly emptyString = '';
  changeSubFlow = false;
  editName = false;
  //cxOptOut = false;
  landingSid = '';
  landingQid = '';
  landingDid = '';
  isValidationUI = false;
  menubarHtml:any; //This variable only use for session and local storage.
  isLogoutClicked = false;
  dashboardCreatorFilter: any; // set slected creator filter from filters 
  constructor() { }
}

export interface ISessionObject {
  userInfo?: IUserDetails;
  projectObject?:any;
  menubarHtml?: any;
  //localizationApiCallRequired?: boolean;
}


export interface IMaintainanceObj {
  underMaintainance?: boolean;
  maintainanceAnnoucement?:boolean;
  underMaintainanceMessage?: string;
  maintainanceAnnouncementMessage?: string;
}

export interface IUserDetails {
  firstName?: string;
  lastName?: string;
  userId?: string;
  accessLevel?: number;
  emailId?: string;
  comments?: string;
  isProxy?: boolean;
  loggedInUser?: string;
  authorized?: boolean;
  partnerAuthorized?: boolean;
  rwSuperUser?: boolean;
  roSuperUser?: boolean;
  adminUser?: boolean;
  thresholdExceptionApprover?: boolean;
  adjustmentApprover?: boolean;
  purchaseAdjustmentUser?: boolean;
  dcThresholdExceptionApprover?: boolean;
  secThresholdExceptionApprover?: boolean;
  dnaDiscountExceptionApprover?: boolean;
  permissions?: Map<string, PermissionObj>;
  active?: boolean;
  createQuoteAndDealEnabled?: boolean;
  ipcAccess?: string;
  partner?: boolean;
  userType?: string;
  userRole?:string;
  salesAccountView?: boolean;
  distiUser?: boolean;
  maintainace?: MaintainaceObj;
  beoGeoId? : number;
  beId?: number;
  superUser?: string; // for parterSuperUser
}

export interface PermissionObj {
  name: string;
  description: string;
  disabled: boolean;
}

export interface MaintainaceObj {
  maintainanceAnnoucement?: boolean;
  underMaintainance?: boolean;
  maintainanceAnnouncementMessage?: string;
  underMaintainanceMessage?:string;
}
export interface IPhoneNumber {
  number?: string;
  internationalNumber?: string;
  nationalNumber?: string;
  e164Number?:string;
  countryCode?: string,
  dialCode?: string
}