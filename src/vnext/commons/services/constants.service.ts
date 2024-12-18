import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  readonly USER_ID = 'rbinwani'; // This constant is use for local environment user id pass for calling user details service.
  readonly USERDETAILS_SESSION_STORAGE = 'userDetailsObj';
  readonly SESSION_OBJECT = 'sessionObject'; // This varible we'll use store the object in session

  readonly PARTNER_TYPE = 'PARTNER_TEAM'; // This variable is used for sending team type in api 
  readonly DISTI_TYPE = 'DISTI'; // This variable is used for sending team type in api 

  readonly PARTNER_CONTACT = 'partnerContacts'; // This variable is used for dynamically setting team property 
  readonly DISTI_CONTACT = 'distiContacts'; // This variable is used for dynamically setting team property 
  readonly TEAM = 'Team'; // This variable is used for displaying team   

  readonly PARTNER_TEAM = 'Partner'; // This variable is used for displaying team dropdown values  
  readonly DISTI_TEAM = 'Distributor'; // This variable is used for displaying team dropdown values
  public readonly PROJECT_IN_PROGRESS_STATUS = 'IN_PROGRESS'; // This variable is used to check if project is in progress
  public readonly PROJECT_COMPLETE = 'COMPLETE'; // This variable is to check if project is complete
  public readonly PURCHASE_ADJUSTMENT_REQUEST = 'PURCHASE_ADJUSTMENT_REQUEST';
  public readonly BUYING_PROGRAM_EXCEPTION = 'BUYING_PROGRAM_REDIRECTION_EXCEPTION_CHECK';
  public readonly SYNC_PRICES = 'SYNC-PRICES';
  public readonly DELISTING_CX_EXCEPTION = 'BU_PM_EXCEPTIONS'; 
  public readonly EARLY_FOLLOW_ON_CHECK = 'EARLY_RENEWAL_CHECK';
  public readonly CX_EMBEDDED_SUPPORT_EXCLUSION_THRESHOLD_CHECK = 'CX_EMBEDDED_SUPPORT_EXCLUSION_THRESHOLD_CHECK';

  public readonly GLOBAL_MENU_BAR_URL = 'GLOBAL_MENU_BAR_URL';
  public readonly GET_MENU_HTML = 'getMenuHTML';

  public readonly number_1 = 1;
  public readonly number_4 = 4;
  public readonly number_6 = 6;
  public readonly number_38 = 38;

  public readonly MERAKI_1 = 'E3-N-MRNI';
  public readonly MERAKI_2 = 'E3-N-MRSM';
  public readonly MERAKI_3 = 'E3-N-MRCS';
  public readonly MERAKI_HYBRID = 'E3-H-MRSM';
  public readonly MERAKI_DNA = 'E3-N-DNAS-M';

  readonly ORGID_EXCEPTION = "ORGID_EXCEPTION"; // set this as type for orgId message

  readonly APPROVED = 'Approved';
  readonly NOT_SUBMITTED = 'Not Submitted';
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
  readonly MERAKI_CAMERA_SYSTEM_PA = "MERAKI_CAMERA_SYSTEM_PA";
  readonly MERAKI_SYSTEM_MANAGER_PA =  "MERAKI_SYSTEM_MANAGER_PA";
  readonly MERAKI_INFRA_PA =  "MERAKI_INFRA_PA";

  public readonly CISCO = "CISCO";
  public readonly PARTNER = "PARTNER";

  public readonly EDUCATION_INSTITUTE_QUESTION = "edu_institute";

  public readonly NETWORK_PORTFOLIO_ID = 1;
  public readonly APPLICATION_PORTFOLIO_ID = 2;
  public readonly SECURITY_PORTFOLIO_ID = 3;
  public readonly COLLAB_PORTFOLIO_ID = 4;
  public readonly SERIVICE_PORTFOLIO_ID = 5;
  
  public readonly SECURE_FIREWALL = 'E3-SEC-SFW';
  public readonly SUITE_TYPE_COLLAB = 'COLLAB';
  public readonly SUITE_TYPE_HYBRID = 'HYBRID';
  public readonly COPY_ALL_MY_PROPOSAL = 'copyAllMyProposals';
  public readonly SCU_COUNT = 'scu_count';
  public readonly EMAIL = 'Email';
  public readonly QC ='qc';
  public readonly QUEBEC = 'quebec';
  public readonly FR_LANG_CODE = 'fr_CA';
  public readonly PROPOSAL_STATUS_PA_IN_PROGRESS = 'PENDING_PA';
  public readonly INVALID_BILL_TO_ID = 'INVALID_BILL_TO_ID';
  public readonly INVALID_RESELLER_BILL_TO_ID = 'INVALID_RESELLER_BILL_TO_ID';
  public readonly INVALID_DISTI_BILL_TO_ID = 'INVALID_DISTI_BILL_TO_ID';
  public readonly INVALID_DISTI_RESELLER_BILL_TO_ID = 'INVALID_DISTI_RESELLER_BILL_TO_ID';
  public readonly CCWR_ACCESS_ISSUE = 'CCWR_ACCESS_ISSUE';
  public readonly EA = 'ea';
  public readonly TERMS_CONDITIONS_PAGE_URL = "https://www.cisco.com/c/en/us/about/legal/terms-conditions.html";
  public readonly PRIVACY_PAGE_URL = "https://www.cisco.com/c/en/us/about/legal/privacy.html";
  public readonly COOKIES_PAGE_URL = "https://www.cisco.com/c/en/us/about/legal/privacy.html#cookies";
  public readonly TRADEMARK_PAGE_URL ="https://www.cisco.com/c/en/us/about/legal/trademarks.html";
  public readonly BUYINGPROGRAM = "BUYINGPROGRAM";
  public readonly SPNA = "spna";
  public readonly LIMITED_TIME_OFFERS = "Limited Time Offers";
  public readonly PROPOSAL = 'PROPOSAL';
  public readonly PROJECT = 'PROJECT';
  public readonly QUALIFICATION = 'QUALIFICATION';
  public readonly ACTION_DELETE = 'DELETE';
  public readonly ACTION_UPSERT = 'UPSERT';
  public readonly URL_PROJECT_CAV = 'project/cav/';
  public readonly URL_BU = '/bu/';
  public readonly URL_PARTIES = '/parties?';
  public readonly URL_PARTIES_SELECTALL = '/parties?a=SELECT-ALL&';
  public readonly URL_EAID = 'eaid=';
  public readonly PARTY_SELECTION = 'Party Selection';
  public readonly BU_REMOVED = 'BU Removed';
  public readonly NEW_SELECTION = 'New Selection';
  public readonly FULL_BU_TO_PARTIAL_BU = 'Full BU to Partial BU';
  public readonly PARTIAL_BU_TO_FULL_BU = 'Partial BU to Full BU';
  public readonly MERAKI = 'MERAKI';
  public readonly BONFIRE = 'BONFIRE';
  public readonly CISCO_NETWORKING_SOLUTION = 'CISCO_NETWORKING_SOLUTION'; // for WIFI7/UNX suite
  public readonly NO_CHANGE = 'No Change';
  public readonly Y = 'Y';
  public readonly INITIAL  = 'initial';
  public readonly PID_Key = 'PID-'
  public readonly SALES_CONNECT_URL = 'service-registry/url?service=SALES_CONNECT_SUBSCRIPTION_TF&track=EAMP';
  public readonly EAID_TF_DATE_URL = 'project/eaid-tf-details?eaid=';
  public readonly CX_TIER_OPTIONS = 'cxTierOptions';
  public readonly CX_UPDATED_TIER = 'cxUpdatedTier';
  public readonly CX_TIER_DROPDOWN = 'cxTierDropdown'; 
  public readonly FULL = 'Full';
  public readonly PARTIAL = 'Partial';
  public readonly MANAGED_SERVICES = 'ENDUSER_ENTITLED';
  public readonly PROVIDER_ENTITLED = 'PROVIDER_ENTITLED';
  public readonly PROVIDER = 'provider';
  public readonly MSP_EA = 'EA';
  public readonly MSEA = 'MSEA';
  public readonly BP_TRANSACTION_TYPE = 'buyingProgramTransactionType';
  public readonly PARTNER_RO_SUPER_USER = 'SUPER_USER_RO';
  public readonly PARTNER_RW_SUPER_USER = 'SUPER_USER_RW';
  public readonly SPLUNK = 'Splunk';
  public readonly ATR_URL = 'project/atr-redirect-url/';
  public readonly EARLY_FOLLOWON = 'EARLY_FOLLOWON';
  public readonly URL_PROPOSAL_RENEWAL = 'proposal/renewal/';
  public readonly URL_DOWNLOAD_SUBSCRIPTION_CREDIT = '/download-subscription-credit-details';
  public readonly SHARED_BY_CISCO = 'sharedByCisco';
  public readonly URL_PROJECT = 'project/';
  public readonly URL_MULTIPLE_EAID = '/master-agreement-detail?a=MULTIPLE_EAIDS';
  public readonly EAIDS = 'eaids';
  public readonly YES = 'yes';
  public readonly URL_EAID_SUBSCRIPTION = '/eaid-subscriptions?eaid=';
  public readonly URL_EAID_SUBSCRIPTION_PROJECT = 'subscription?a=EAID-SUBSCRIPTIONS&p='
  public readonly URL_WITH_EAID = '&eaid=';
  public readonly EAIDSSYSTEM = 'eaIdsSystem';
  //public readonly OWB_URL = 'https://ccw-cstg.cisco.com/Commerce/home';
  public readonly COTERM_END_DATE_MIN = 12;
  public readonly COTERM_END_DATE_MAX = 84;
  public readonly PREPAID = 'Prepaid';
  public readonly CUSTOMER_REP = 'customerRep';
  public readonly LOGOUT_CLICKED = 'Logout clicked';
  public readonly SW_PRODUCTS = 'SW PRODUCTS';
  public readonly HW_PRODUCTS = 'HW PRODUCTS';
  public readonly ALL_PRODUCTS = 'ALL PRODUCTS';
  public readonly SPECIAL = 'SPECIAL';
  public readonly SUCCESS = 'SUCCESS';
  public readonly FAILURE = 'FAILURE';
  public readonly INFLATION = 'inflation';
  public readonly PARTNER_MARKUP = 'partnerMarkup';
  public readonly GROWTH_EXP = 'growthExpenses';
  public readonly ADDITIONAL_COST = 'additionalCosts';
  public readonly PRICING = 'pricing';
  public readonly ALC = 'alc';
  public readonly SW_PERCENTAGE = 'swPercent';
  public readonly CX_PERCENTAGE = 'cxPercent';
  public readonly SW_CX_PERCENTAGE = 'swCxPercent';
  public readonly HW_CX_PERCENTAGE = 'hwCxPercent';
  public readonly SW = 'sw';
  public readonly CX = 'cx';
  public readonly GROWTH_EXPENSE = 'growthExpense';
  public readonly INCREMENTAL = 'Incremental';
  public readonly SAME_TO_ALL = 'Same to all';
  public readonly YEARLY = 'YEARLY';
  public readonly QUARTERLY = 'QUARTERLY';
  constructor() { }
}
