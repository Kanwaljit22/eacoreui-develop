import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { ILoccDetail, INameIdObject, IPartnerInfo, IPreferredLegalAddress, IScopeInfo } from 'vnext/commons/services/vnext-store.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: VnextResolversModule
})
export class ProjectStoreService {

  projectData: IProjectInfo = {} //store all project details 
  nextBestActionsStatusObj: nextBestActionsStatusObj = {
    isLoccDone: false,
    isCavAdded: false,
    isCiscoTeamMemberAdded: false,
    isPartnerAdded: false
  };
  lockProject = false;
  isShowProject = false; // set to show project if locc is signed
  isClickedEditProject = false; // set if clicked editproject after locked
  isLoccCustomerContactDetailInconsistent = false; // set if any of the mandatory locc customer details are empty
  selectedSmartAccount:ISmartAccountInfo;
  blurSubsidiaries = false;
  projectReadOnlyMode = false;
  isEMSMsgDisplayed = false;
  showHideFilterMenu = false;
  projectEditAccess = true;
  projectReopenAccess = false;
  projectManageTeamAccess = false;
  projectSmartAccountEditAccess = false;
  projectOrgIdEditAccess = false;
  proposalCreateAccess = false;
  currentBpId: IBpIdDetails;
  refreshSubsidiariesSubject = new Subject(); // call if user switched to existing or creating a new bpid
  projectCreateBpIdAccess = false;
  showHideAdvanceSearch = false;
  constructor() { }
}


export interface IProjectInfo extends INameIdObject {
  objId?: string;
  status?: String;
  deleted?: boolean;
  locked?: boolean;
  ordered?: boolean;
  deferLocc?: boolean;
  ciscoTeam?: ICiscoTeam;
  customerInfo?: ICustomerInfo;
  dealInfo?: IDealInfo;
  loccDetail?: ILoccDetail;
  partnerInfo?: IPartnerInfo;
  partnerTeam?: IPartnerTeam;
  initiatedBy?: IInitiatedBy;
  scopeInfo?: IScopeInfo; 
  smartAccount?: ISmartAccountInfo;
  subRefId?: string;
  changeSubscriptionDeal?: boolean;
  referrerQuotes?: Array<IReferrerQuotes>;
  selectedQuote?:IReferrerQuotes;
  buyingProgram?: string;
  scopeChangeInProgress?: boolean;
  noUpgradeMigrateOptionsAvailable?:boolean;
  cloneProposalEligible?: boolean;
}

export interface IReferrerQuotes {
  distiDetail?: IDistiDetail;
  quoteId?: string;
  quoteName?: string;
  partnerInfo?: IPartnerInfo
}
export interface IInitiatedBy {
  distiInitiated?: boolean;
  initiatedBy?: string;
}
export interface IPartnerTeam {
  distiContacts?: Array<IContacts>;
  partnerContacts?: Array<IContacts>;
}
export interface IDealInfo {
  buyMethodDisti?: boolean;
  crPartyId?: number;
  id?: string;
  statusDesc?: string;
  dealType?: string;
  distiDeal?: boolean;
  optyOwner?: string; 
  partnerDeal?: boolean;
  distiDetail?:IDistiDetail;
  subscriptionUpgradeDeal?: boolean;
  directRTM?:boolean;
  globalDealScope?: boolean;
}

export interface ICustomerInfo {
  accountName?: string;
  customerGuId?: number;
  federalCustomer?: false;
  preferredLegalName?: string;
  customerReps?: Array<ICustomerReps>;
  preferredLegalAddress?: IPreferredLegalAddress;
  customerGuName?: string;
}

export interface ICustomerReps {
  email?: string;
  name?: string;
  repId?: number;
  id?: Number
}
export interface ICiscoTeam {
  cam?: ICam;
  contacts?: Array<IContacts>;
}

export interface IContacts {
  email?: string;
  firstName?: string;
  lastName?: string;
  notification?: boolean;
  notifyByWelcomeKit?: boolean;
  userId?: string;
  webexNotification?: boolean;
  role?: string;
  name?: string;
  beGeoId?: number;
  beGeoName?: string;
  beId?: string;
  beName?: string;
  userIdSystem?: string;
}
export interface ICam {
  beGeoId?: string;
  camEmail?: string;
  cecId?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

// for nextBestActions
export interface nextBestActionsStatusObj {
  isLoccDone?: boolean;
  isCavAdded?: boolean;
  isCiscoTeamMemberAdded?: boolean;
  isPartnerAdded?: boolean;
}

export interface IPartnerObject {

  header: string;
  team: string;
  memeberType: string;
  searchType: string;
}

export interface ISearchTeam {

  userId: string;
  webexNotification: boolean;
  notifyByWelcomeKit: boolean;
  beGeoId?: number;
}

export interface IBilling {

  id?: string;
  defaultSelection?: string;
  uiOption?:IUiOption
}

export interface IUiOption {

  displaySequence?: number;
  displaySeq?: number;
  displayName?: string;
}

export interface IDistiDetail {
  disti?: boolean,
  id?: string,
  name?: string,
  sourceProfileId?: number,
  beId?: string,
  email?: string
}

export interface IMasterAggreementDetails {
  eaId?: string,
  enrollmentCount? : number,
  suiteCount? : number
}

export interface IProposalList {
  proposalName?: string;
  active?: boolean;
  objId?: string;
  id?: number;
  userId?: string;
  partnerType?: string;
  proposalStatus?: string;
  enrollment?: string;
  eaTotalValue?: number;
  showDropdown?: boolean;

}

export interface ISmartAccountInfo {
  smrtAccntId?: string;
  smrtAccntName?: string;
  domain?: string;
  accountType?: string;
  defaultVAId?: string;
  defaultVAName?: string;
  defaultVAStatus?: string;
  programName?: string;
  virtualAccount?:INameIdObject;
}

export interface ITheater {
 name?:String;
 countries?: Array<ICountry>;
 selected?:boolean;
 totalCountriesCount?:number;
 selectedCountriesCount?:number;
 defaultCountryPresent?:boolean
}

export interface ICountry {
  code?:string;
  name?:string;
  theatre?:string;
  selected?:boolean;
}

export interface ICapitalFinancing {
  id?: string;
  defaultSelection?: string;
  uiOption?:IUiOption
}

export interface IBpIdDetails {
  eaId?: string;
  eaIdSystem?: string;
  enrollmentCount?: number;
  suiteCount?: number;
  portfolioSuites?:any;
}

export interface IAssociatedQuotes {
  quoteId?: string;
  quoteName?: string;
  partnerName?: string;
  quoteStatus?: string;
  buyMethod?: string;
  disabled?: boolean
}