import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Injectable()
export class ConstantsService implements OnInit {

    constructor() { }

    // proposal standard duration values
    static readonly PROPOSAL_STANDARD_DURATION_MIN_VALUE = 36;
    static readonly PROPOSAL_STANDARD_DURATION_MAX_VALUE = 60;
    public readonly ZERO_VALUE = 0;
    // DC suite ID's
    public readonly ACI_SUITE_ID = 17;
    public readonly CC_SUITE_ID = 18;

    readonly YES_RADIO_BUTTON = 'yes';
    readonly NO_RADIO_BUTTON = 'no';
    
    static readonly FILE_SIZE_LIMIT = 10000000;

    static readonly PENDING_STATUS = 'sent';
    
    static readonly EARLY_FOLLOWON = 'EARLY_FOLLOWON';
    static readonly ON_TIME_FOLLOWON = 'ON_TIME_FOLLOWON';

    static readonly TYPE_CX = 'CX';
    readonly LOCC_NOT_SIGNED = 'LOCC_NOT_SIGNED';


    // public CURRENCY : CurrencyObj;
    static readonly PARTNER = 'Partner';
    static readonly EMPLOYEE = 'Employee';

    static readonly SALESCONNECT_DNA = 'EA_DNA';
    static readonly SALESCONNECT_DC = 'EA_DC';
    static readonly SALESCONNECT_SECURITY = 'EA_Security';
    static readonly SALESCONNECT_GENERAL = 'EA_General';

    static readonly QUARTERLY = 'Quarterly';
    static readonly MONTHLY = 'Monthly';

    static readonly QUARTERLY_VALUE = 'Monthly Billing';
    static readonly MONTHLY_VALUE = 'Quarterly Billing';


    static readonly USER_READ_ONLY_ACCESS = 'Read-Only';
    static readonly USER_READ_WRITE_ACCESS = 'Read-Write';
    public readonly RO = 'ro';
    public readonly RW = 'rw';
    static readonly ANNUAL_BILLING = 'Annual Billing';
    static readonly PREPAID_TERM = 'Prepaid Term';
    static readonly PREPAID_TERM_ID = 'Prepaid';
    public readonly UNITED_STATES = 'UNITED STATES';
    public readonly US = 'US';
    public readonly USD = 'USD';
    public readonly RECALCULATE_ALL = 'RECALCULATE_ALL';
    public readonly HEADER_LEVEL_SUITE_ERROR = 'HEADER_LEVEL_SUITE_ERROR';
    public readonly SUITE_SELECTION_RULE = 'SUITE_SELECTION_RULE';
    public readonly MANDATORY_CUST_REP_FIELDS = 'MANDATORY_CUST_REP_FIELDS';
    public readonly REQUIRED = 'REQUIRED';
    public readonly SSS_MANDATORY_CHECK = 'SSS';
    public readonly DNA_LIMIT_ERROR_CODE = 'EA038';
    public readonly DATA_CENTER_LIMIT_ERROR_CODE = 'EA053';
    public readonly DATA_CENTER_LIMIT_ALL_SUIT_ERROR_CODE = 'EA054';
    public readonly DATA_CENTER_MINIMUM_SUIT_ERROR_CODE = 'EA055';


    readonly DISTI_REASON_CODE = 'DISTI_LED';
    readonly listedAffiliates = 'Listed Affiliates';
    readonly NONE = 'None';
    readonly DNA = 'C1_DNA';
    readonly DC = 'C1_DC';
    readonly SECURITY = 'SEC';
    readonly CX = 'CX';
    readonly SWSS_EMAIL = 'swssEmail';
    readonly SWSS_WEBEX = 'swssWebex';
    readonly EST_EMAIL = 'estEmail';
    readonly EST_WEBEX = 'estWebex';
    readonly SWSS_WALKME = 'swssWalkme';
    readonly EST_WALKME = 'estWalkme';
    readonly CX_EMAIL = 'cxSpEmail';
    readonly CX_WEBEX = 'cxSpWebex';
    readonly CX_WALKME = 'cxSpWalkme';

    readonly CREATE_QUAL = 'createQual';
    readonly CHANGE_SUB_DETAIL_URL = 'https://ccrc.cisco.com/subscriptions/detail/';


    

    public IB_SUMM_ASSESSMENT_REPORT = 'The IBA Assessment Report will be delivered to you via email shortly';
    public IB_ASSESSMENT_PROPOSAL = 'The IBA Assessment Report for this proposal will be delivered to you via email shortly';

    public CURRENCY: string;
    public readonly GU = 'G';
    public readonly HQ = 'H';
    public readonly QUALIFICATION_COMPLETE = 'Complete';
    public readonly QUALIFIED = 'Qualified';
    public readonly COMPLETE_STATUS = 'Complete';
    public readonly IN_PROGRESS_STATUS = 'In Progress';
    public readonly PENDING_APPROVAL = 'Pending Approval';
    public readonly PA_APPROVAL_IN_PROGRESS = 'PA Approval In Progress';
    public readonly PA_IN_PROGRESS = 'PA In Progress';
    public readonly PA_APPROVAL_SUBMISSION_PENDING = 'PA Approval Submission Pending';
    public readonly DELISTING_CX_EXCEPTION = 'BU_PM_EXCEPTIONS';

    readonly VIEW_ALL = 'VIEW ALL';
    readonly QUALIFICATIONS = 'QUALIFICATIONS';
    readonly SHARED = 'SHARED';
    readonly MY_PROSPECT = 'My Prospects';
    readonly MY_FAV_PROSPECT = 'My Favorite Prospects';
    readonly MY_QUAL = 'My Qualifications';
    readonly SHARED_QUAL = 'Shared Qualifications';
    readonly MY_PROPOSAL = 'My Proposals';
    readonly SHARED_PROPOSAL = 'Shared Proposals';
    readonly PROPOSALS = 'PROPOSALS';
    readonly MY_DEAL = 'MY DEAL'
    readonly USER_READ_WRITE_ACCESS = 'Read-Write';
    readonly CISCO_EMAIL = '@cisco.com'
    readonly CISCO_DOMIN = 'cisco.com';

    readonly CUSTOM_DURATION_WARNING = "Custom duration is considered as non standard for Cisco's Enterprise Agreement and will require an approval";
    readonly CUSTOM_DNA_DURATION_WARNING = "Term greater than 60 months is non standard and it will require the approval from Cisco EA Program team.";
    readonly ANNUAL_DURATION_WARNING = 'EA Term Duration is restricted to multiples of 12 months when Annual Billing Model is selected.'
    readonly REQUEST_ACCESS = 'The request for access has been emailed.';

    readonly QUALIFICATION = 'qualification';
    readonly PROPOSAL = 'proposal';
    readonly MONTHS = 'Months'
    readonly BOM = 'bom';
    readonly SALES_READINESS = 'salesReadiness';
    readonly DOC_CENTER = 'document';
    readonly YES = 'Yes';
    readonly NO = 'No';
    readonly USER_ID = 'scc@totalcomm.com';//rkatkam
    readonly DASHBOARDPAGECONTEXT = 'UserDashboard';
    readonly FALSE = 'false';
    readonly KEY_SHOWMESSAGE = 'showMessage';
    readonly VALID_STATUS = 'VALID';
    readonly INVALID_STATUS = 'INVALID';
    readonly ALREARDY_SSO_LOGIN = 'alreadySSOLogin';
    readonly PROPOSAL_SUMMARY_STEP = 'ProposalSummaryStep';
    readonly PRICE_ESTIMATION_STEP = 'ProposalPriceEstimateStep';
    readonly PRICE_ESTIMATION_CX_STEP = 'ProposalCXPriceEstimateStep';
    readonly PROPOSAL_SUCCESS_STEP = 'ProposalSuccess'

    readonly APPROVED = 'Approved';
    readonly NOT_SUBMITTED = 'Not Submitted';
    readonly SUBMITTED = 'Submitted';
    readonly REOPENED = 'Re-Opened';
    readonly QUALIFICATION_IN_PROGRESS = 'Qualification in Progress';
    readonly REJECTED = 'Rejected';
    readonly MORE_INFO_REQUIRED = 'More Information Required';
    readonly DEAL_QUALIFIED = 'Qualified';
    readonly ORDERED = 'Ordered';
    readonly CLOSED = 'Closed';
    readonly EXPIRED = 'Expired';
    readonly LOST = 'Lost';
    readonly MORE_INFO_REQUIRED_BOM = 'More Information Required - BOM';
    readonly APPROVAL_IN_PROGRESS = 'Approval In Progress';
    readonly APPROVAL_NOT_READY_TO_ORDER = 'Approved Not Ready To Order';
    readonly CANCELLED = 'Cancelled';
    readonly REPRICING = 'Repricing';







    readonly TOKEY_COLOUMN_MAPPING = {
        'C1_ADVANTAGE': 'advantageEaQty',
        'C1_ESSENTIALS': 'essentialsEaQty',
        'C1_ECS': 'ecsEaQtyEditable',
        'C1_FOUNDATION': 'foundationEaQty',
        'C1_ADVANCED': 'advancedEaQty',
        'DNA_ADVANTAGE': 'dnaAdvantageEaQty',
        'DNA_PREMIER': 'dnaPremierEaQty',
        'DNA_ADDON': 'advancedAddonEaQty',
        'GREENFIELD_PREMIER': 'premierGfEaQty',
        'GREENFIELD_ADVANTAGE': 'advantageGfEaQty',
        'SUBSCRIPTION': 'dcSubscriptionEaQty',
        'advantageGfEaQty': 'advantageGfEaQty',
        'premierGfEaQty': 'premierGfEaQty',
        'BROWNFIELD_C1_ADVANTAGE': 'advantageBfC1EaQty',
        'BROWNFIELD_LB_ADVANTAGE': 'advantageBfLbEaQty',
        'BROWNFIELD_ADVANTAGE': 'advantageBfEaQty',
        'BROWNFIELD_4_ADVANTAGE': 'advantageBf4Qty',
        'BROWNFIELD_5_ADVANTAGE': 'advantageBf5Qty',
        'BROWNFIELD_6_ADVANTAGE': 'advantageBf6Qty',
        'BROWNFIELD_C1_PREMIER': 'premierBfC1EaQty',
        'BROWNFIELD_LB_PREMIER': 'premierBfLbEaQty',
        'BROWNFIELD_PREMIER': 'premierBfEaQty',
        'BROWNFIELD_4_PREMIER': 'premierBf4Qty',
        'BROWNFIELD_5_PREMIER': 'premierBf5Qty',
        'BROWNFIELD_6_PREMIER': 'premierBf6Qty',
        'ADDON': 'advancedAddonEaQty',

    };

    readonly TCO_METADATA_IDS = {
        'Pricing': 'Pricing',
        'avgMultiSuiteDiscount':'avgMultiSuiteDiscount',
        'productListPrice': 'productListPrice',
        'serviceListPrice': 'serviceListPrice',
        'averageDiscount': 'averageDiscount',
        'rampPurchaseAdjustment': 'rampPurchaseAdjustment',
        'purchaseAdjustment': 'purchaseAdjustment',
        // 'markupMargin' : 'markupMargin',
        'netPrice': 'netPrice',
        'netPriceWithPA': 'netPriceWithPA',
        'netPriceWithoutPA': 'netPriceWithoutPA',

        'partnerMarkupMargin': 'partnerMarkupMargin',
        'markupMargin': 'markupMargin',

        'trueForwardBenefits': 'trueForwardBenefits',
        'trueFroward': 'trueFroward',

        'GrowthBenefits': 'GrowthBenefits',
        'growth': 'growth',
        'timeValueMoney': 'timeValueMoney',
        'alaCarte1yrSku': 'alaCarte1yrSku',

        'operationalEfficiency': 'operationalEfficiency',
        'operationalEffieciency': 'operationalEffieciency',
        'roperationalEffieciencyName': 'roperationalEffieciencyName',
        'rOperations': 'rOperations',
        'FLEX_COST': 'FLEX_COST',
        'flexCost': 'flexCost',

        'PromotionCost': 'PromotionCost',
        'promotionCost': 'promotionCost',
        'ramp': 'ramp',
        'dnac': 'dnac',
        'dcnFreeAppliance':'dcnFreeAppliance',
        'starterKit': 'starterKit'
    };

    readonly TCO_METADATA_NAMES = {
        'Pricing': 'Pricing',
        'productListPrice': 'Product List Price',
        'serviceListPrice': 'Service List Price',
        'averageDiscount': 'Average Discount (in %)',
        'rampPurchaseAdjustment': 'Ramp Promo',
        'purchaseAdjustment': 'Purchase Adjustment',
        'markupMargin': 'Markup/Margin',
        'netPrice': 'Net Price',
        'netPriceWithPA': 'Partner Net Price With PA',
        'netPriceWithoutPA': 'Net Price',
        // 'netPriceWithoutPA': 'Partner Net Price Without PA',

        'trueForwardBenefits': 'True Forward benefits',
        'trueFroward': 'True Forward',

        'GrowthBenefits': 'Growth benefits',
        'growth': 'Growth',
        'timeValueMoney': 'Time Value of Money',
        'alaCarte1yrSku': 'A La Carte 1yr SKU',

        'operationalEfficiency': 'Operational Efficiencies',
        'operationalEffieciency': 'Operational Efficiency',
        'rOperations': 'Rationalization of Operations',
        'flexCost': 'Miscellaneous Cost',

        'PromotionCost': 'Promotional Benefits',
        'ramp': 'Ramp Promotion',
        'dnac': 'DNA-C Free Appliance',
        'dcnFreeAppliance': 'DCN Free Appliance',
        'starterKit': 'Solution Starter entitlement'
    }

    readonly HASH = '#';

    readonly CUSTOMER_PACKAGE = 'CUSTOMER_PACKAGE';
    static readonly PARTNER_REQUIREMENTS = 'PARTNER_REQUIREMENTS';
    static readonly EUIF = 'EUIF';
    static readonly PROGRAM_TERMS = 'PROGRAM_TERMS';
    readonly EA_PROGRAM_TERMS = 'EA_PROGRAM_TERMS';
    static readonly SIGNED_CUSTOMER_PACKAGE = 'SIGNED_CUSTOMER_PACKAGE';
    static readonly SUPPLEMENTAL_TERMS = 'SUPPLEMENTAL_TERMS';
    static readonly LOA = 'LOA';
    static readonly PARTNER_PACKAGE = 'PARTNER_PACKAGE';

    static readonly TCO_COMPARISON_REPORT = 'TCO_COMPARISON_REPORT';
    static readonly CUSTOMER_PROPOSAL = 'CUSTOMER_PROPOSAL';
    static readonly CUSTOMER_IB_REPORT = 'CUSTOMER_IB_REPORT';
    static readonly FULL_CUSTOMER_BOOKING_REPORT = 'FULL_CUSTOMER_BOOKING_REPORT';

    static readonly PROPOSAL_IB_REPORT = 'PROPOSAL_IB_REPORT';
    static readonly SCP = 'Signed Legal Customer Package';
    static readonly LETTER_AGREEMENT = 'Letter of Agreement';
    static readonly SUPP_TERMS = 'Supplemental Terms';
    static readonly COMPLETED = 'completed';
    static readonly SIGNED = 'Signed';
    static readonly PENDING_SIGN = 'Pending Signature';
    static readonly UPLOAD = 'upload';
    readonly LEGAL_CUST_PACKAGE = 'Legal Customer Package';
    readonly SW_SERVICE_DISC = 'software Service Discount';
    readonly PREPAID_TERM = 'Prepaid Term';

    readonly CISCO_SECURITY_CHOICE = 'Cisco Security Choice';
    readonly CISCO_DNA_DATACENTER = 'Cisco DNA and Data Center';
    readonly CISCO_DNA = 'Cisco DNA';
    readonly CISCO_DATA_CENTER = 'Cisco Data Center';
    readonly ALL_ARCHITECTURE = 'All';
    readonly CISCO_SERVICES_SUPPORT = 'Cisco Services Support'

    public readonly COMPLETED = 'completed';

    static readonly PDF = 'PDF';
    static readonly PPT = 'PPT';
    static readonly VIDEO = 'VIDEO';
    static readonly DOC = 'DOC';
    static readonly XLS = 'XLS';
    static readonly AUDIO = 'AUDIO';
    static readonly HTML = 'HTML';


    static readonly ICON_PDF = 'icon-pdf1';
    static readonly ICON_PPT = 'icon-ppt1';
    static readonly ICON_VIDEO = 'icon-video';
    static readonly ICON_DOC = 'icon-doc1';
    static readonly ICON_XLS = 'icon-xls1';
    static readonly ICON_AUDIO = 'AUDIO';
    static readonly ICON_HTML = 'icon-html1 ';

    static readonly TCO_MARGIN = 'MARGIN';
    static readonly TCO_MARKUP = 'MARKUP';
    static readonly TCO_SAVE_MARKUP = 'Markup';
    static readonly EXTERNAL = 'external';


    readonly TCO_MODELING = 'TCO_MODELING';
    readonly SECURITY_TETRATION = 'SECURITY TETRATION';
    readonly TCO_MODELLING = 'TCO Modeling';
    readonly HYPHEN_VALUE = '-';
    public readonly QUALIFICATION_FS = 'QUALIFICATION';
    public readonly PROPOSAL_FS = 'PROPOSAL';
    public readonly ACTION_DELETE = 'DELETE';
    public readonly ACTION_UPSERT = 'UPSERT';

    ngOnInit() {

    }


}

export interface CurrencyObj {
    currency?: string;
    archName?: string;
}


// This interface is use for passing the data into qualification listing or proposal listing component.

export interface QualProposalListObj {
    data: any;
    isCreatedByMe?: boolean;
    isProposalOnDashboard?: boolean;
    isProposalInsideQualification?: boolean;
    isToggleVisible?: boolean;
    editIcon?: boolean;
}
