import { Injectable } from '@angular/core';
import { IProposalInfo } from 'vnext/proposal/proposal-store.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { EaStoreService, IUserDetails } from 'ea/ea-store.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: VnextResolversModule
})
export class VnextStoreService {

  constructor(private eaStoreService: EaStoreService) { }

  userInfo :IUserDetails = {
    firstName: '',
    lastName: '',
    userId: '',
    accessLevel: 0,
    emailId: '',
    distiUser: false,
    authorized: false,
    partnerAuthorized: false,
    thresholdExceptionApprover: false,
    dcThresholdExceptionApprover: false,
    dnaDiscountExceptionApprover: false,
    adjustmentApprover: false
  };   // This is the user object and we'll store all user details in this object.

  applicationPageContextObject = {
      'PROJECT_CONTEXT':'projectContext',
      'PROPOSAL_LIST_CONTEXT':'proposalListContext',
      'PROPPSAL_CONTEXT':'proposalContext',
      'DASHBOARD': 'dashboard'
  }

  currentPageContext:string;

  toastMsgObject:IToastMessage =  {
    programEligible:false,
    suiteDeselected:false,
    loccSuccess: false,
    copyProposal: false,
    lockProject: false,
    ibReportReequested: false,
    paExceptionRequested: false,
    paExceptionWithdrawn: false,
    exceptionsSubmitted: false,
    exceptionsWithdrawn: false,
    isBecameReviewer: false,
    isBecameReviewerForPA: false,
    isExceptionRejected: false,
    isBuExcelRequested: false,
    isSelectedBuSaved: false,
    isCommitOverrideRequested: false,
    isCommitOverrideRequestWithdrawn: false,
    isIbFetchCompleted: false
  };


  toastMsgValueObject:Array<string> = [];
  toastMsgCopiedProposalData: IProposalInfo = {}

  loccDetail: ILoccDetail = {}; // to set loccDetail from projectData/proposalData
  rsdSubject = new Subject(); // to emit updated rsd value for create, edit proposal pages

  invalidDomains = []; // to store invalid domains list
  systemDate:any ;
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

  public cleanToastMsgObject(){
    this.toastMsgObject.programEligible = false;
    this.toastMsgObject.suiteDeselected = false;
    this.toastMsgObject.loccSuccess = false;
    this.toastMsgObject.copyProposal = false;
    this.toastMsgObject.lockProject = false;
    this.toastMsgObject.ibReportReequested = false;
    this.toastMsgObject.paExceptionRequested = false;
    this.toastMsgObject.paExceptionWithdrawn = false;
    this.toastMsgObject.exceptionsSubmitted = false;
    this.toastMsgObject.exceptionsWithdrawn = false;
    this.toastMsgObject.isBecameReviewer = false;
    this.toastMsgObject.isBecameReviewerForPA = false;
    this.toastMsgObject.isExceptionRejected = false;
    this.toastMsgObject.isBuExcelRequested = false;
    this.toastMsgObject.isSelectedBuSaved = false;
    this.toastMsgObject.isCommitOverrideRequestWithdrawn = false;
    this.toastMsgObject.isCommitOverrideRequested = false;
    this.toastMsgValueObject =  new Array<string>();
    this.toastMsgCopiedProposalData = {};
    this.toastMsgObject.isIbFetchCompleted = false;
  }
}

export interface CustomerInfo {
  archName: string;
  custName: string;
  custId: string;
}


export interface INameIdObject {
  id?: number | string;
  name?: string;
  description?: string;
}
export interface IPartnerInfo{
  beGeoName?: string; 
  beGeoId?: number;
}


export interface IToastMessage {
      programEligible?:boolean,
      suiteDeselected?:boolean,
      loccSuccess?: boolean,
      copyProposal?: boolean,
      lockProject?: boolean,
      ibReportReequested?: boolean,
      paExceptionRequested?: boolean,
      paExceptionWithdrawn?: boolean,
      exceptionsSubmitted?: boolean,
      exceptionsWithdrawn?: boolean,
      isBecameReviewerForPA?: boolean,
      isBecameReviewer?: boolean,
      isExceptionRejected?: boolean;
      isBuExcelRequested?: boolean;
      isSelectedBuSaved?: boolean;
      isCommitOverrideRequested?: boolean;
      isCommitOverrideRequestWithdrawn?: boolean;
      isIbFetchCompleted?: boolean
}

export interface ILoccDetail {

  deferred?: boolean;
  loccExpiredDate?: string;
  loccInitiated?: boolean;
  loccNotRequired?: boolean;
  loccOptional?: boolean;
  loccSigned?: boolean;
  customerContact?: ICustomerContact;
}

export interface ICustomerContact {
  id: string;
  preferredLegalName?: string;
  repEmail?: string;
  repFirstName?: string;
  repLastName?: string;
  repName?: string;
  repTitle?: string;
  preferredLegalAddress?: IPreferredLegalAddress;
  phoneCountryCode?: string;
  phoneNumber?: string;
  dialFlagCode? : string;
}

export interface IPreferredLegalAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  state?: string;
  zip?: string;
} 

export interface IScopeInfo {
  masterAgreementId? : string,
  returningCustomer?: boolean,
  scopeId?: number,
  eaidSelectionComplete?: boolean,
  newEaidCreated?: boolean,
  eaidSelectionLocked?: boolean
}