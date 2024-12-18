
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { Injectable } from '@angular/core';
import { IAtoTier,IChangeSubInfo,IEamsDelivery,IEnrollmentsInfo, IMigratedFrom, IMigratedTo, IMultiProgramDiscout, IRenewalInfo } from 'vnext/proposal/proposal-store.service';
import { INameIdObject } from 'vnext/commons/services/vnext-store.service';

@Injectable({
  providedIn: VnextResolversModule
})
export class PriceEstimateStoreService {

  hasRSDError = false;
  rsdErrorMsg = '';
  enableRecalculateAll =  false;  //This attribute is used to disable button in price estimate
  discountLovs = []; // to store discountLovs for selected enrollment
  totalDesiredQtyForEnrollment = 0;
  viewAllSelected = false;
  displayExternalConfiguration = false;
  externalConfigReq: any = {};
  returnCustomerMsg = false;
  selectedEnrollment: IEnrollmentsInfo = {} // store selected Enrollment data from PE page
  selectedCxEnrollment: IEnrollmentsInfo = {} // store selected CxEnrollment data from PE page
  openAddSuites = false;
  displayCxGrid = false; // set to display cx grid if cxattached
  eamsDeliveryObj: IEamsDelivery = {}; // to store eamsDelivery obj from cx data
  orgIdsArr = []; // to store orgids from api
  isCxPresent = false; // set if cx present in proposal
  errorMessagesPresentForCx = false;
  displayIbPullMsg = false; // set to show IbpullMessage
  renewalSubscriptionDataForSuite: any = {}; // to store renewal subsriptions data 
  renewalSubscriptionDataForSuiteMap = new Map<string,Array<any>>(); // to map subrefId and subsription data for renewal
  distiBID = '';
  resellerBID = '';
  //hybridAssociatedSuiteCount = 0;
  isHybridEnrollmentSelected = false;
  disableHybridEnrollment = false;
  hybridSuiteUpdated = false;
  hasBfRelatedMigratedAtoForHybrid = false;
  showStrategicOffers = false;
  //hardwareIbInprogressWarning = false;
  displayReprocessIB = false;
  hardwareIbSuccess = false;
  showServiceHardwareWarning = false;
  displaySuccessMsgForPrices = false; // set to show success message after ccwr pricing received
  troubleshootingUrl = 'https://salesconnect.cisco.com/#/content-detail/7baa3606-6d22-453f-bbaf-a8a5dab84666';
  diffInDaysForSystematicIbRepull: number = 0;
  showUpgradeSwSuitesTabSection = false;
  constructor() { }
}




export interface IPoolForGrid{
  poolSuiteLineName?:String;
  childs?:Array<ISuiteAndLineInfoForGrid>;
  enrollmentId?: number;
  expand?: boolean;
}


export interface ISuiteAndLineInfoForGrid{
  id?:number;
  poolSuiteLineName?:String;
  installBase?:string;
  desiredQty?:number;
  listPrice?:string; 
  subscriptionDiscount?:string; 
  serviceDiscount?:any; 
  purchaseAdjustment?:string; 
  totalContractValue?:string; 
  ato?:string;
  poolName?:string;
  childs?:Array<ISuiteAndLineInfoForGrid>;
  inclusion?:boolean;
  duration?:string; 
  committed?:boolean; 
  enrollmentId?:number;
  discount?: IDiscountsObj;  
  commitInfo?:ICommitInfo;
  groupId?:number;
  hasPids? : boolean;
  pidType?: string;
  supportPid?: boolean;
  pidName?: string;
  commitNetPrice?: string;
  multiProgramDesc?:IMultiProgramDiscout;
  tiers?: Array<IAtoTier>;
  ibQty?: number;
  disabled?:boolean;
  credit?: ICredit;
  minDiscount?: number;
  maxDiscount?: number;
  weightedDisc?:number;
  cxIbQty?:ICXIbQty;
  total?: number;
  atoTierDesc?:string; 
  cxTierOptions?: Array<IAtoTierOptions>;
  swSelectedTier?:IAtoTier;
  cxUpdatedTier?:IAtoTier;
  discountDirty?: boolean;
  expand?: boolean;
  totalConsumedQty?: number;
  migration?: boolean;
  renewalInfo?: IRenewalInfo;
  hybridParam?: IHybridParams;
  type?: string;
  typeDesc?: string;
  hideDiscount?: boolean;
  changeSubConfig?: IChangeSubInfo;
  qualifiesForHigherScuRange?: boolean;
  cxHwSupportOptedOut?: boolean;
  lowerTierAto?: IAtoTier;
  netChangeInTotalNet?: string;
  upsell?: boolean;
  lowerTierPidTotalQty?: number;
  minQty?: number;
  cxUpgradeType?: string;
  includedInEAID?: boolean;
  disableForRTU?: boolean;
  cxAlacarteCoverageFound?: boolean;
  eligibleForMigration?: boolean;
  eligibleForUpgrade?: boolean;
  migrated?: boolean;
  upgraded?: boolean;
  migratedTo?: IMigratedTo;
  migratedFrom?: Array<IMigratedFrom>;
  subscriptionSourceAtoTcv?: number;
  hasSwRelatedCxUpgraded?: boolean;
  eaSuiteType?: string;
  drpFlag?: boolean;
}

export interface IAtoTierOptions {
  name?:string; 
  desc?:string; 
  displaySeq?:number; 
  defaultTier?:boolean; 
}

export interface ICredit {
  perpetual?: number;
  residual?: number;
  subscription?: number;
  rampDetail?: any;
  credits?: Array<any>;
  strategicOffer?: number;
  collabStrategicOffer?: number;
  crossSuiteMigration?: number;
}


export interface ICXHwSupport {
  residual?: number;
  uncovered?: number;
}

export interface ICXIbQty {
  productFamilyCount?: number;
  total?: number;
  owned?: number;
  uncovered?: number;
  takeover?: number;
}

export interface ICreditsArray {
  code?: string;
  nonL2NCreditType?: string;
  rampCredit?: boolean;
  totalCredit?: number;
  monthlyCredit?: string;
  yearlyCredit?: string;
  rampDetail?: IRampDetails;
}

export interface IRampDetails{
  name?:string;
  term?:number;
  discount?:number
}

export interface ICommitInfo {
  committed?: boolean;
  threshold?: number;
  qtyThreshold?: IQtyThreshold;
  ibQtyThreshold?:IQtyThreshold;
  overrideEligible?: boolean;
  overrideAllowed?: boolean;
  overrideRequested?: boolean;
  overrideJustification?: string;
  overrideReason?: string;
  overrideState?: string;
  achievedInPercent? : any;
}
export interface IQtyThreshold {
  achieved?: number;
  calculated?: number;
  required?: number;
}

export interface IDiscountsObj {
  subsDisc?: number;
  subsDiscMin?: number;
  subsDiscMax?: number;
  servDiscMin?: number;
  serservDiscMax?: number;
  servDisc?: number;
  minDiscount?: number;
  maxDiscount?: number;
  weightedDisc?: number;
}

export interface ISuiteRecalculateAllReq{
  enrollments:Array<IEnrollmentApiRequest>;
}


export interface IEnrollmentApiRequest{
  enrollmentId?:number;
  atos?:Array<IATOsApiRequest>
  displayQnA?:boolean;
}

export interface IATOsApiRequest{
  name?:string;
  inclusion?:boolean;
}


export interface IQuestion{
    id?:string;
    format?:string;
    desc?:string;
    answers?:Array<IAnswer>;
    mandatory?:boolean;
    parentAId?:string;
    parentQId?:string;    
    questions?:Array<IQuestion>;  
    displayType?:string;
    additionalInfo?:any;
    min?:number;
    scuCountInfo?:any;
}

export interface IAnswer extends INameIdObject{
  desc?:string;
  value?:string;
  selected?:boolean;
  questions?:Array<IQuestion>;
  defaultSel?: boolean;
  disabled?:boolean;
  min?:number;
  max?:number
}

export interface IHybridParams extends IQtyRange{
  qtyRange?:IQtyRange; 
  suggestedUserCount?:number; 
}
export interface IQtyRange {
  max?:number; 
  min?:number; 
}

export interface IUpgradeSummary {
  enrollmentName?: string;
  cxAttached?: boolean;
  enrolled?: boolean;
  upgradeType?: string;
  commitStatus?: string;
  existingTcv?: number;
  upgradeTcv?: number;
  netChange?: number;
  suites?:Array<IUpgradeSuites>
}

export interface IUpgradeSuites {
  name?: string;
  ato?:string;
  disabled?:boolean;
  upgradeType?: string;
  commitStatus?: string;
  existingTcv?: number;
  upgradeTcv?: number;
  netChange?: number;
  upSell?:boolean;
  migratedFrom?: string;
  migrated?: boolean,
  upgraded?: boolean,
  upgradedFrom?: string;
  migrationUpgradeType?: string;
  relatedSwAto?: any
}
