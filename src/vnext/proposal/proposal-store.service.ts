
import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { INameIdObject, IPartnerInfo, IPreferredLegalAddress, IScopeInfo } from 'vnext/commons/services/vnext-store.service';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: VnextResolversModule
})
export class ProposalStoreService {
    projectStatus = ''
    proposalData: IProposalInfo = {}; //store all proposal details 
    public isReadOnly: boolean = false;
    allowCompletion = false;
    showFinancialSummary = false;
    showPriceEstimate = false;
    loadCusConsentPage = false;
    showProposalSummary = false;
    showProposalDashboard = false;
    editProposalParamter = false;
    rsdDueCurrDate = false; // set if rsd less than system date from api
    exceptionsSubj = new Subject();
    allowUpdatePA = false; // set to show update PA for PA reviewer
    proposalEditAccess = true;
    proposalViewAccess = false;
    proposalReopenAccess = false; // set to show proposal Reopen button
    allowProposalEditName = false;// set to show editicon for peoposal name change
    isPaApproverComingFromSummary = false; // set if pa approver coming from summary to PE 
    readonly emailValidationRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    loadLegalPackage = false;
    isApproverAccessingProposal = false;
    isSyncPrice = false;
    mspInfo: IMspInfo = {};
    isProposalCreated = false;
    porConsentNeeded = false;
    masterAgreementInfo: IMasterAgreement = {};
    isPartnerAccessingSfdcDeal = false; // set if partner/disti accessing sfdc deal proposal
    isSellerAllowUpdateOTA = false;
    proposalCloneAccess = false; // set to show proposal clone action
    proposalConverToQuoteAccess = false; // set to show proposal convert to quote action
    inflightDocusign = false;
    openLookupSubscriptionSubj = new Subject();
    cxbillToWipeOffMsgPresent = false;
    tcoCreateFlow = false;
    constructor() { }
}



export interface IProposalInfo{
    objId?:string;
    scopeIdMismatch?:boolean;
    scopeChanged?:boolean;
    id?: number;
    projectObjId?:string;
    name?:string;
    status?:String;
    statusDesc?:String;
    dealInfo?:IDealInfo;
    countryOfTransaction?:string
    priceList?:INameIdObject;
    partnerInfo?:IPartnerInfo;
    currencyCode?:string;
    tcv?:number;
    offerType?:string;
    billingTerm?:IBillingTerm;
    enrollments?:Array<IEnrollmentsInfo>
    commitInfo?: ICommitInfo;
    priceInfo?:IPriceInfo;
    credit?:ICreditInfo;
    allowCompletion?:boolean
    tiers?: Array<IAtoTier>;
    scopeInfo?: IScopeInfo;
    requestStartDateCurrDate?: boolean;
    message?:IMessage;
    exception?: IException;
    customer?: ICustomerContact;
    originalProposalId?: number;
    originalProposalObjId?:string
    quoteInfo?: IQuoteInfo
    awaitingResponse?: boolean;
    programEligibility?:IProgramEligibility;
    subscriptionInfo?: ISubscriptionInfo;
    renewalInfo?: IRenewalInfo;
    sharedWithDistributor?:boolean;
    subRefId?: string;
    changeSubDeal?: boolean;
    buyingProgram?:string;
    agreementContractNumber?: string;
    hasAgreementContract?: boolean;
    hideCollabPartnerNetPriceInfo?: boolean;
    scopeChangeInProgress?: boolean;
    allUpgradeMigrationRestored?:boolean;
    syncStatus?: ISyncStatus;
    buyingProgramTransactionType?:string
    isSplunkSuitesAdded?: boolean;
    cloned?: boolean;
    permissions?: any;
    cxBillToWipedOff?: boolean;
    gtcChinaQuestionnaireNeeded?:boolean;
    nonStandardTermDetails?:any;
    tcoEligible?:boolean;
    tcoObjId?:any;
    createdBeforeTco?: boolean;
    }
    export interface ISubscriptionInfo {
        existingCustomer?: boolean;
        justification?: string;
    }
export interface IDealInfo extends INameIdObject {
    partnerLed?: boolean;
    buyMethodDisti?: boolean;
    distiDeal?: boolean;
    distiDetail? : IDistiDeal;
    referrerQuoteId?: string;
    subscriptionUpgradeDeal?:boolean;
    partnerDeal?:boolean;
}

export interface IDistiDeal extends INameIdObject{
    distiOpportunityOwner?: boolean;
    dealId?: string;
    partnerCountry?: string;
}



export interface IProgramEligibility{
    eligible?:boolean;
}

export interface IException {
    allowSubmission?: boolean;
    allowWithdrawl?: boolean;
    exceptionActivities?: Array<any>;
}
export interface ICreditInfo {
    residual?: string;
    ramp?: string;
    migration?: string;
    competitve?: string;
    swss?: string;
}

    //This interface is a prototype of enrollment.
    export interface IEnrollmentsInfo extends INameIdObject {
    primary?:boolean;
    forthcoming?: boolean;
    enrolled?:boolean;
    billingTerm?:IBillingTerm;
    commitInfo?: ICommitInfo;
    pools?: Array<IPoolInfo>;
    displayQnA?:boolean;
    disabled?:boolean;
    isHybridSelected?:boolean;
    externalConfiguration?: boolean;
    cxAttached?: boolean;
    priceInfo?:any;
    cxOptInAllowed?:boolean;
    hardwareLinePricesInSync?: boolean;
    hwDeLinkEligibility?: boolean;
    discountCascadePending?: boolean;
    eamsDelivery?: IEamsDelivery;
    lineInError?: boolean;
    cxSoftwareSupportOnly?: boolean;
    awaitingResponse?: boolean;
    hasError?: boolean;
    securityTier?: string;
    migration?: boolean;
    disableRsdAndTermUpdate?: boolean;
    userCount?: number;
    suggestedUserCount?:boolean;
    alreadyPurchased?: boolean;
    hwSupportLinesState? : string;
    changeSubConfig?: IChangeSubInfo;
    includedInEAID?: boolean;
    includedInChangeSub?: boolean;
    includedInSubscription?: boolean;
    relatedServicesIncludedInEAID?: boolean;
    selectedTierScuRange?: IScuRange;
    locked?: boolean;
    prePurchaseInfo?: IPrePurchaseInfo;
    porConsentNeeded?: boolean;
    billToMandatory?: boolean;
    notEligibleForUpgrade?: boolean;
    ibAssementRequiredForCxUpgradeType?: boolean;
    hwSupportReqFailedReason?: string;
    hwLastIbPulledAtDate?: number;
    embeddedHwSupportAttached?: boolean;
    eligibleForMigration?: boolean;
    eligibleForUpgrade?: boolean;
    suitesNotAvailableForMigration?: boolean;
    noRenewalBillToAttachRate?: boolean;
    ibCoverageLookupStatus?: string;
    someCxSuitesAreNotAvailableToSelect?: boolean;
    }
    export interface IPoolInfo{
    name?:string;
    display?:boolean;
    suites?:Array<ISuites>;
    desc?: string;
    priceInfo?:any;
    cxSuitesIncludedInPool?: boolean;
    eligibleForMigration?: boolean
    }
    export interface ISuites{
    cxTierOptions?:any;
    upgradedTier?:any;
    inclusion?:boolean 
    ato?:string;
    discount?:IDiscountInfo;
    lines?:Array<ILineInfo>;
    disabled?:boolean;
    pids?: any;
    atoTier?:string;
    cxAttachRate?:number;
    tiers?:Array<IAtoTier>;
    cxSelectedTier?: string;
    autoSelected?: boolean;
    cxIbQty?:ICXIbQty;
    cxOptIn?: boolean;
    orgInfoRequired?: boolean;
    serviceAttachMandatory?: boolean;
    migration?: boolean;
    renewalInfo?: IRenewalInfo;
    notAllowedHybridRelated?:boolean;
    hasBfRelatedMigratedAto?: boolean;
    type?: string; 
    cxUpgradeType?: string;
    displayDiscount?: boolean;
    changeSubConfig?: IChangeSubInfo;
    qualifiesForHigherScuRange?: boolean;
    consentRequired?: boolean;
    notAvailable?: boolean;
    prePurchaseInfo?: IPrePurchaseInfo;
    cxHwSupportAvailable?: boolean;
    cxHwSupportOptional?: boolean;
    cxHwSupportOptedOut?: boolean;
    allowHwSupportOnlyPurchase?: boolean;
    lowerTierAto?:IAtoTier;
    netChangeInTotalNet?: string;
    includedInSubscription?: boolean;
    isRestored?: boolean;
    cxUpgradeTierMappingMissing?: boolean;
    cxUpgradeDefaultTierMissing?: boolean;
    includedInEAID?: boolean;
    incompatibleAtos?: Array<any>;
    incompatibleSuites?: Array<any>;
    incompatibleAtoMessage?: string;
    suiteMessage?: string;
    isAtoOptedOut?: boolean;
    swSelectedTier?: IAtoTier;
    alreadyPurchasedInDiffEaId?: boolean;
    alreadyPurchasedInDiffSubscription?: boolean;
    suitesRemovedFor?: Array<any>;
    desc?: string;
    name?: string;
    alreadySelectedIncompatibleSuites?: Array<any>;
    disabledFromOtherEnrollmentSuite?: boolean;
    swSuiteInclusion?: boolean;
    isOnlyEduTierPresentForUpgrade?: boolean;
    isBonfireDisabled?: boolean;
    isMerakiDisabled?: boolean;
    eaSuiteType?: string;
    isOrgIdOverlapping?: boolean;
    eligibleForMigration?: boolean;
    eligibleForUpgrade?: boolean;
    migrated?: boolean;
    migrationType?: string;
    migratedTo?: IMigratedTo;
    isSwTierUpgraded?: boolean;
    upgraded?:boolean;
    migrateToSuites?: Array<IMigrateToSuites>;
    migrationSourceAtos?: Array<any>;
    pendingMigration?:boolean;
    hasSwRelatedCxUpgraded?:boolean;
    suiteModified?: boolean;
    notEligibleForMigrationReasons?: Array<any>;
    fullMigrationNotEligible?: boolean;
    ibFound?: boolean;
    coverageTypes?: Array<ICxCoverageTypes>;
    hasEmbeddedHwSupport?: boolean;
    cxAlacarteCoverageFound?: boolean;
    cxSelected?: boolean;
    swSelected?: boolean;
    onlyCxAllowed?: boolean;
    }
    export interface IMigratedTo{
        name?: string;
        desc?: string;
        ato?: string;
        selectedTierDesc?: string;
        mappingType?: Array<string>;
        migrationType?: string;
        selectedTier?:string;
        incompatibleSuites?: Array<string>;
        tiers?: Array<IAtoTier>;
        fullMigrationNotEligible?: boolean;
    }

    export interface IMigratedFrom{
        name?: string;
        desc?: string;
        migrationType?: string;
    }
    export interface IMigrateToSuites{
        name?: string;
        desc?: string;
        ato?: string;
        mappingType?: Array<string>;
        displaySeq?: number;
        tiers?: Array<IAtoTier>;
        incompatibleSuites?: Array<string>;
        notEligibleForMigrationReasons?: Array<any>;
        fullMigrationNotEligible?: boolean;
    }
    export interface ILineInfo extends INameIdObject{
    qty?:number;
    priceInfo?:number;
    pids:Map<string,IPidInfo>;
    migration?: boolean;
    credit?:ICreditInfo;
    }
    export interface IDiscountInfo{
    servDisc?:number;
    subsDisc?:number;
    multiProgramDesc?:IMultiProgramDiscout;
    }

    export interface IMultiProgramDiscout{
        msd?:number;
        mpd?:number;
        med?:number;
        bundleDiscount?:number;
        strategicOfferDiscount?:number;
        strategicOfferDetails?:Array<IStrategicOfferDiscountDetails>;
      }
    export interface IBillingTerm{
    billingModel?:string;
    billingModelName?:string;
    term?:number;
    rsd?:string;
    coterm?:ICoTerm;
    capitalFinancingFrequency?:string;
    capitalFrequencyName?: string;
    }

    export interface ICoTerm{
    billDayInMonth?:number;
    endDate?:string;
    subRefId?:string;
    }


    export interface ICommitInfo{
    status?:boolean;
    fcSuiteCount?:number;
    pcSuiteCount?:number;
    threshold?:number;
    fullCommitTcv?:number;
    partialCommitTcv?:number;
    committed?:boolean;
    }
    export interface IPidInfo{
    discount:IDiscountInfo;
    priceInfo?:number;
    qty?:number;
    }


    export interface IFinancial {

    extendedList?:string;
    discountedAmount?:string;
    totalNetBeforeCredit?:string;
    totalSwNet?:string;
    totalSrvcNet?:string;
    totalNet?:string;
    enrollments?:[IFinancial];
    purchaseAdjustment?:string;
    }

    export interface IPriceInfo {        
    extendedList?:number;
    discountAmt?:number;
    postPaNetPrice?:number;
    postPaSwNetPrice?:number;
    postPaSrNetPrice?:number;
    purchaseAdjustment?:number;
    totalNet?:number;
    }

export interface IProposalSummary {

    enrollments: [IEnrollment];
    proposal: IProposalInfo;

}

   export interface IEnrollment {

    id?:number;
    name?:string;
    primary?:boolean;
    displaySeq?:number;
    preTCValue?:number;
    tpAdjustment?:number;
    postTCValue?:number;

    }


    export interface IAtoTier{
        name?:string;
        desc?:string;
        selected?:boolean;
        cxSelectedTier?: string;
        educationInstituteOnly?:boolean;
        cxOptIn?:boolean;
        cxTierOptions?:any;
        priceInfo?:any;
        ccwrEntitlementFailure?: boolean;
        coverageTypes?: Array<ICxCoverageTypes>;
        hasEmbeddedHwSupport?: boolean;
        serviceAttachMandatory?: boolean;
        cxAlacarteCoverageFound?: boolean;
        displaySeq?: number;
        defaultSel?: boolean
    }


    export interface ICustomerContact {
        customerGuId?: string;
        customerGuName?: string
        accountName?: string;
        preferredLegalName?: string;
        customerReps?: Array<ICustomerReps>;
        preferredLegalAddress?: IPreferredLegalAddress;
      }
      
      export interface ICustomerReps {
        id?: number;
        name?: string;
        email?: string;
        title?: string;
        phoneCountryCode?: string;
        phoneNumber?: string;
        dialFlagCode? : string;
        mandatoryFieldsMissing?: boolean;
      }

    export interface IMessage{

        hasError?:boolean;
        messages?:[IMessages];
    }

     export interface IMessages{

        code?:string;
        text?:string;
        severity?:string;
        createdAt?:string;
        createdBy?:string;
        identifier?:string;
        type?:string;
        key?:string;
        groupIdentifier?: string;
    }

export interface ISubscription{

        masterAgreementId?:string;
        statusDesc?:string;
        subscriptionStart?:string;
        subscriptionEnd?:string;
        subscriptionId?:string;
        subRefId?:string;
        subscriptionName?:string;
        smartAccount?:string;
        enrollments?: Array<any>;
        capitalBillingFrequency?: string;
    }

    export interface IBill {

        address1?:string;
        city?:string;
        countryName?:string;
        customerNumber?:string;
        orgId?:number;
        orgName?:string;
        postalCode?:string;
        siteUseId?:string;
        isFlooringBid?: boolean;
    }
     
    export interface IQuoteInfo {
       payloadId?:string;
       quoteId?:string;
       redirectUrl?:string;
    }

export interface IEamsDelivery {

    partnerDeliveryEligible?:boolean;
    partnerDeliverySelected?:boolean;
    partnerInfo?:IEAMSPartnerInfo;
}

export interface IEAMSPartnerInfo {

    partnerContactName?:string;
    ccoId?:string;
    emailId?:string;
    contactNumber?:string;
    contactCountryCode?:string;
    primartyPartner?:string;
    phoneCountryCode?: string;
    dialFlagCode? : string;
}

export interface ICXIbQty {
    productFamilyCount?: number;
    total?: number;
    owned?: number;
    uncovered?: number;
    takeover?: number;
  }

  export interface IRenewalSubscription {
    subRefId?: string,
       startDateStr?: string,
        endDateStr?: string,
        ea2Suites?: [string],
        offerType?: string,
        distiName?: string,
        ea2ArchName?: string,
        billingModel?: string,
        smartAccountName?: string,
        smartAccountId?: string,
        type?: string,
        typeDesc?: string;
        partnerName?: string,
        status?: string,
        hasCollab?: boolean,
        dealPartnerMismatch?: boolean
        selected?: boolean,
        statusDesc?: string,
        partnerDifferentThanDeal?: boolean,
        overdue?: boolean,
        renewalRule?: IRenewalRule
  }

  export interface IRenewalInfo {
      id?: number;
      type?: string;
      typeDesc?: string;
      subRefIds?: Array<any>;
      subscriptions?: Array<any>;
      hybrid?: boolean;
  }

  export interface IRenewalRule {
    allCriteriaMatched?: boolean,
    allCriteriaMatchedExceptPartnerCheck?: boolean,
    allowEarlyBFMigrationSubscription?: boolean,
    allowOnTimeBFMigrationnSubscription?: boolean,
    customerGuidStrictMatch?: boolean,
    partnerDifferentThanDeal?: boolean,
    hasUnsupportedATO?: boolean
  }

  export interface IMspInfo {
    mspAuthorizedQualcodes?:any; 
    mspPartner?:boolean;
    mspProposal?:boolean; 
    managedServicesEaPartner?:boolean;
    entitlementType?:string;
    mspFlag?: boolean;
  } 

  export interface IChangeSubInfo {
    noMidTermPurchaseAllowed?: boolean;
  }
  export interface IScuRange {
    max?:number; 
    min?:number; 
  }

  export interface IPrePurchaseInfo {
    begeoName?: string;
    subRefId?: string;
 }

 export interface IMasterAgreement {
    masterAgreement?: boolean;
    contractNumber?: string;
 }

 export interface IStrategicOfferDiscountDetails {
    strategicOfferName?: string;
    strategicOfferDiscountPercentage?: number;
 } 

 export interface ICxCoverageTypes {
    name?: string;
    desc?: string;
    selected?: boolean;
 }

 export interface ISyncStatus {
    cxEditFlag?: boolean;
    cxCcwrRipFlag?: boolean;
    ibAssessmentLastState?: string;
    showIbAssessmentButton?: boolean;
    tcoIbReAssessmentRequired?: boolean;
 }

 export interface ICotermEndDateRangeObj {
    max?:number; 
    min?:number; 
  }