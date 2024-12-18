import { ReviewFinalizeService } from './../../tco/edit-tco/review-finalize/review-finalize.service';
import { PaginationObject } from './../../dashboard/product-summary/product-summary.component';
import { AppRestService } from './app.rest.service';
import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config';
import { UserInfoJson } from '../../header/header.component';
import { Message, MessageType } from './message';
import { log } from 'util';
import {
  SelectedFilterJson,
  FiltersService
} from '../../dashboard/filters/filters.service';
import { ProductSummaryService } from '../../dashboard/product-summary/product-summary.service';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubHeaderData } from '../../../app/shared/sub-header/sub-header.component';
import { Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { CopyLinkService } from '../../shared/copy-link/copy-link.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { isString, isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { map } from 'rxjs/operators';

@Injectable()
export class AppDataService implements OnInit {
  static readonly CASOUSEL_SLIDE_SIZE = 3;
  static readonly USERINFO_SESSION_STORAGE = 'userInfo';
  static readonly ARCHITECTURE_METADATA_OBJECT = 'architectureMetaDataObject';
  static readonly PROSPECT_INFO_OBJECT = 'prospectInfoObject';
  hideReleaseNote = false;
  showAnnounceBanneer = false;
  showDebugger = false;
  showActivityLog = false;
  activityLogPermission = false;
  openActivityLog = false;
  isUserDataLoaded = false;
  subSummaryUrl ='';
  reloadSmartAccountEmitter = new EventEmitter();
  static readonly architecture_IMAGE_MAP = {
    C1_DNA: 'icon-dna-indigo',
    C1_DC: 'icon-data-center-indigo',
    security: 'icon-Security-indigo',
    Collabration: 'icon-Security-indigo'
  };
  static readonly DEFAULT_IMAGE = 'icon-Security-indigo';
  static readonly GREATER_THAN_OPERATOR = 'gt';
  static readonly LESS_THAN_OPERATOR = 'lt';
  static readonly SESSION_OBJECT = 'sessionObject';
  static readonly PROSPECT_HERADER = 'PROSPECT_HEADER';
  static readonly HEADER_DISPLAY_NAME = 'displayName';
  static readonly ERROR_MESSAGE = 'Technical Server error. Please try later.';
  static readonly DUPLICATE_QUAL_NAME =
    'This qualification name already exists. Please try a different qualification name.';

  static readonly PAGE_CONTEXT = {
    'userDashboard': 'UserDashboard', 'prospectDashboard': 'ProspectDashboard', 'proposalList': 'ProposalList',
    'userFavorites': 'UserFavorites', 'prospectDetailsByGeography': 'ProspectDetailsByGeography', 'qualList': 'QualificationList',
    'prospectDetailsBySubsidiary': 'ProspectDetailsBySubsidiary', 'prospectDetailsBySuite': 'ProspectDetailsBySuite',
    'iBSummarySalesOrder': 'IBSummarySalesOrder', 'iBSummaryContractNumber': 'IBSummaryContractNumber', 'iBSummaryInstallSite': 'IBSummaryInstallSite',
    'iBSummarySerialNumber': 'IBSummarySerialNumber', 'userQualifications': 'UserQualifications',
    'prospectQualificaitons': 'ProspectQualificaitons', 'qualificationCreate': 'QualificationCreate',
    'qualificationWhosInvolvedStep': 'QualificationWhosInvolvedStep', 'qualificationDefineGeographyStep': 'QualificationDefineGeographyStep' ,
    'qualificationDefineSubsidiaryStep': 'QualificationDefineSubsidiaryStep', 'qualificationSummaryStep': 'QualificationSummaryStep',
    'qualificationValidateAcceptStep': 'QualificationValidateAcceptStep', 'QualificationSuccess': 'QualificationSuccess',
    'userProposals': 'UserProposals', 'proposalDefineSuiteStep': 'ProposalDefineSuiteStep', 'proposalPriceEstimateStep': 'ProposalPriceEstimateStep',
    'proposalTCOComparisonStep': 'ProposalTCOComparisonStep', 'proposalSummaryStep': 'ProposalSummaryStep', 'proposalValidateAcceptStep': 'ProposalValidateAcceptStep',
    'previewQuote': 'PreviewQuote', 'documentCenter': 'DocumentCenter', 'salesReadiness': 'SalesReadiness', 'priceEstimateQtyChange': 'PriceEstimateQtyChange', 'proposalSuccess': 'ProposalSuccess', 'bookingSummarySalesOrder': 'BookingSummarySalesOrder',
    'manageUserAdmin': 'ManageUserAdmin', 'manageUserRoles': 'ManageUserRoles', 'manageServiceRegistry': 'ManageServiceRegistry', 'manageResource': 'ManageResource', 'tcoReview': 'TCOReviewFinalize', 'tcoModeling': 'TCOModeling',
    'tcoListing': 'TCOListing', 'tcoOutcomes': 'TCOOutcomes', 'salesConnect': 'SALESCONNECT', 'CreateProposal': 'CreateProposal', 'myDeal': 'MyDeal', 'adminOperations': 'adminOperations', 'adminPlatform': 'adminPlatform',
    'reportingCenter': 'ReportingCenter', 'exceptionRule': 'ExceptionRule', 'routingTeam': 'RoutingTeam', 'accountHealth': 'AccountHealth', 'manageCompHold': 'ManageComplianceHold',
    'renewalSelectSubscription': 'FollowOnSubscriptions','renewalParameter': 'FollowOnParameters','renewalReviewConfirm':'FollowOnReviewConfirm', 'proposalCXPriceEstimateStep': 'ProposalCXPriceEstimateStep'
  };

  environmentVar: any;
  openCaseViewVisible = new EventEmitter();
  envMap = {
    'wdv': 'wdv', 'cdv': 'cdv',
    'stage': 'stage', 'wstg': 'wstg', 'cstg': 'cstg',
    'cloudapps': 'production', 'stg': 'stg',
    'local': 'local'
  };

  static readonly ARCH_NAME = 'C1_DNA';

  static readonly USER_DASHBOARD_FLOW = 'userFlow';

  readonly CONSTANT_USER_DASHBOARD_FLOW = 'userFlow';

  readonly emailValidationRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;

  appDomain: string;
  userInfo: UserInfoJson;
  architectureMetaDataObject: any;
  headerDataEmitter = new EventEmitter<Map<string, any>>();
  defaultPageObject = { pageSize: 50, currentPage: 1 };
  blockUI = false;
  CISCO_READYEA_URL = 'CISCO_READYEA_URL';
  EA_CALLBACK_URL = 'EA_CALLBACK_URL';
  REDIRECT_FOR_CREATE_QUAL = 'REDIRECT_FOR_CREATE_QUAL';
  CLEAN_CORE_AUTHORIZED_USERS = 'CLEAN_CORE_AUTHORIZED_USERS';
  CLEAN_CORE_REDIRECTION_URL_HANDLER = 'CLEAN_CORE_REDIRECTION_URL_HANDLER';
  CLEAN_CORE_CALLBACK_URL = 'CLEAN_CORE_CALLBACK_URL'
  SFDC_PUNCH_OUT = 'SFDC_URL';
  archName: string;
  customerName: string;
  isFavorite: any;
  customerID: any;
  dealID: any;
  tcoFlow = false;
  userInfoObjectEmitter = new EventEmitter<any>();
  subHeaderData: SubHeaderData = {
    moduleName: '',
    custName: '',
    subHeaderVal: null
  };
  isReadWriteAccess = true;
  flow = '';
  customerStrForRedirection = '';
  sessionObject: SessionData = { architectureMetaDataObject: {}, userInfo: {}, qualificationData: {}, comingFromDocCenter: false, custInfo: { archName: '', custName: '', custId: '' }, proposalDataObj: {}, customerId: -1, isUserReadWriteAccess: true, createAccess: false, isPatnerLedFlow: false, isFavoriteUpdated: false, partnerDeal: false, isGroupSelected: false, tcoDataObj: {} };
  custInfo: CustomerInfo = { archName: '', custName: '', custId: '' };
  pageContext = '';
  headerContext = '';
  userDashboardFLow = '';
  isProposalIconEditable = true;
  custNameEmitter = new EventEmitter<any>();
  messageObject = { text: '', severity: '', code: '' };
  messageArray: any = [];
  // This flag is used to display CPS section in guide me panel.
  showEngageCPS = false;
  engageCPSsubject = new BehaviorSubject(this.showEngageCPS);
  hideHelpAndSupportSuject = new BehaviorSubject(false);
  showGuidemeAndSupport = true;
  isShowFeedback = true;

  // in qual summary for context engage CPS API q=<qual-id> should be passed 
  enableQualFlag = false;
  persistErrorOnUi = false;
  proposalIdToClone = '';
  isSuperUserMsgDisplayed = false;
  ciscoTeamMembers: any;
  editModal = '';
  maintainanceMessage = '';
  showSoftwareSpecialistMessage = true;
  underMaintainance = false;
  underMaintainanceMessage = '';
  noOfMandatorySuiteSelected = 0;
  noOfMandatorySuitesrequired = 3;
  noOfExceptionSuitesRequired = 0;
  headerDataLoaded = new EventEmitter();
  tcoData = new EventEmitter<any>();
  partnerUrl = '';
  subUiUrl = ''; // to set subUiUrl
  isSubUiFlow = false; // to set in its subUi landing
  // partnerParam must be removed from the appdata service
  partnerParam = '';

  // road-map flag
  roadMapPath = false;
  // flag to set if proposal status is in pending aproval
  isProposalPending = false;
  isPendingAdjustmentStatus = false;

  // for edit deal id - allow ONLY if its your proposal - no RW super user allowed to edit deal id
  isEditDealIdAllowed = false;

  roSalesTeam = false;
  invalidDomains = []
  startDateTimeLimit = 0;
  startDateTimeLimitEmitter = new EventEmitter();
  isGroupSelected = false;
  logoutEmitter = new EventEmitter();
  customLoaderEmitter = new EventEmitter<any>();
  loadGraphDataEmitter = new EventEmitter<any>();
  tcoReadOnlyUser = new EventEmitter<any>();
  menubarUserInfoEmitter = new EventEmitter<any>();
  salesAccountCountEmitter = new EventEmitter<boolean>();
  contentTraceID = [];
  auth_Id: string;
  isPatnerLedFlow = false; // This flag is use to know whether is partner login or internal user.
  createQualEmitter = new EventEmitter<any>(); // this emitter is to load qual list in case of partner deeplink.
  createProposalEmitter = new EventEmitter<any>(); // this emitter is to load proposal list in case of partner deeplink.
  changeSubPermissionEmitter = new EventEmitter<any>(); // this emitter is to show/hide change subscription permission.

  // set for handling custom blocker on PE page
  avoidCustomBlocker = new Set(['guide', 'save', 'report', 'cases', 'purchase-adjustment', 'configPunchOut', 'partners', 'qna', 'priceList']);

  // object takes care of green ticks on the custom laoder
  peRecalculateMsg = { 'isConfigurationDone': false, 'isValidationDone': false, 'isComputingDone': false };

  isReload = false;
  displayMenuBarToPartner = true;
  public movebreadcrumbUp = new BehaviorSubject(false);
  currentBreadCrumbMovingStatus = this.movebreadcrumbUp.asObservable();
  isPurchaseOptionsLoaded = false;
  purchaseOptiponsData: any;
  qualListForDeal = false;
  quoteIdForDeal: any;
  myDealQualCreateFlow = false;
  loccSigned = false;
  loccValidTill: any;
  loccImport = new EventEmitter();
  signatureValidDate = '-';
  isLoccContentCalled = false;
  menubarUrl: string;
  authMessage: any;
  showUserRolePopup = false;
  userRoles: any = [];
  //WalkMeInputInfo = { FirstName:'', LastName: '', Id: '', Locale: '', AccessLevel: '', Type: '', BEGEOID: '', BE: '', Country: '', USERID: '' };
  showGuideMeEmitter = new EventEmitter();
  proxyUser = false;
  proxyUserId = '';
  proxyUserEmitter = new EventEmitter<any>();
  proxyEmitterForHeader = new EventEmitter<any>();
  disableProposalRoadmap = false; // to disable roadmap for proposal
  createQualfrom360 = false;
  pendingForMyApproval = false;
  pendingForTeamApproval = false;
  whereIAmApprover = false;
  smartAccountData = null;
  agreementDataEmitter = new EventEmitter<any>();
  deleteAgreementDataEmitter = new EventEmitter<any>();
  agreementCntEmitter = new EventEmitter<any>();
  insideAllArchView = false;

  linkedSmartAccountObj = { 'name': 'Not Assigned', 'id': '' };
  isDashboardVisited = false;
  ldosCoverageTooltip: string;
  serviceCoverageTooltip: string;
  loaQuestionSelectionEmitter = new EventEmitter(); // to emit after loa question is selected from doc center to update in loa comp
  loaQuestionSeletedValue: any; // store selected value after loa questionnaire selection api call
  overrideMsd: any = {}; // store overriseMSDsuiteCounts from PE page
  includedPartialIb = false; //This flag is use to check whether LOCC is signed or not if LOCC is not signed.
  includedPartialIbEmitter = new EventEmitter(); 
  displayChangeSub = false; // set to show or hide change subcription
  displayRenewal = true; // set to show or hide initiate renewal
  allowChangSub = false; // set to show change subscription
  allowSmartSubsidiariesView = false; // set permission for smar subsidiaries view
  limitedModeForSmartSubs = false; // set to enable limited user access for smart subsidiaries
  changeSubInLimitedMode = false; // Enable Change SUb in limited mode
  isQualOrPropListFrom360Page = false; // set if qual/proposal list calling form account health of 360 page
  isRenewal = false;
  followonType = '';
  allowInitiateFollowOn = false; // set if user has permission to initiate followon
  limitedFollowOn = false; // This property is use for limited follow on access.
  openCaseManagementSubject = new BehaviorSubject(false); // to emit if landed to PE or summary pages 
  proposalDataForWorkspace: any = {}


  ngOnInit() {
    sessionStorage.setItem(
      AppDataService.SESSION_OBJECT,
      JSON.stringify(this.sessionObject)
    );
  }

  setMessageObject(text, severity) {
    this.messageObject.text = text;
    this.messageObject.severity = severity;
    this.messageObject.code = '';
    let addInArray = true;
    this.messageArray.forEach(element => {
      if (element.text === text) {
        addInArray = false;
        return;
      }
    });
    if (addInArray) {
      this.messageArray.push(this.messageObject);
    }
    return this.messageArray;
  }

  // Get create proposal start date time limit
  getProposalStartDateTimeLimit() {
    if (this.startDateTimeLimit === 0) {

      this.getProposalStartDateTime().subscribe((response: any) => {
        if (response.value) {
          this.startDateTimeLimit = +response.value;
          this.startDateTimeLimitEmitter.emit();
        }
      });
    }
  }

  getProposalStartDateTime() {

    return this.http
      .get(this.getAppDomain + 'api/resource/ALLOWED_CCW_REQUESTED_START_DATE_RANGE')
      .pipe(map(res => res));
  }


  // Get invalid email domain
  getInvalidEmail() {

    if (this.invalidDomains && this.invalidDomains.length > 0) {
      return this.invalidDomains;
    } else {
      this.getInvalidEmailDomain().subscribe((response: any) => {
        if (response.value) {

          response.value = response.value.replace(/\s/g, '');
          this.invalidDomains = response.value.split(',');
        }
      });
    }
  }


  getInvalidEmailDomain() {

    return this.http
      .get(this.getAppDomain + 'api/resource/INVALID_EMAIL_DOMAINS')
      .pipe(map(res => res));
  }


  getContentTraceID(proposalID) {
    return this.http.get(this.getAppDomain + 'api/sales-connect/setup/' + proposalID)
      .pipe(map(res => res));
  }

  redirectForCreateQualification() {
    return this.http
      .get(this.getAppDomain + 'api/resource/' + this.REDIRECT_FOR_CREATE_QUAL)
      .pipe(map(res => res));
  }



  cleanCoreAuthorizationCheck(): Observable<any> {
    let params = new HttpParams().set('u', this.userInfo.userId);
    return this.http
      .get(this.getAppDomain + 'api/prospect/clean-core/eligible-check')
      .pipe(map(res => res));
  }

  cleanCoreRedirect(qualID) {
    // let params = new HttpParams().set('u', this.userInfo.userId).set('cn', this.customerName);

    // this.CLEAN_CORE_CALLBACK_URL = this._router.url;
    this.CLEAN_CORE_CALLBACK_URL = window.location.href; // +'/manage-affiliates';
    let params = new HttpParams()
      .set('u', this.userInfo.userId)
      .set('cn', this.customerName)
      .set('q', qualID)
      .set('cbp', this.CLEAN_CORE_CALLBACK_URL);
    this.http
      .get(this.getAppDomain + 'api/prospect/clean-core/integration-context', {
        params
      }).subscribe((response: any) => {
        if (response) {
          // const headers = new Headers({ 'Content-Type': 'application/json' });
          // const options = new RequestOptions({ headers: headers, withCredentials: true });
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            }),
            withCredentials: true
          };
          this.http.post(response.data.punhoutUrl, response.data.cleanCoreRequest, httpOptions)
            .subscribe((response: any) => {
              if (response) {
                window.open(response.redirectUrl, '_self');
              }
            });
        }
      });

    // return this.http.get(this.getAppDomain + 'api/resource/'+ this.EA_CALLBACK_URL).map((callBackResponse: any) => {
    //   // if (callBackResponse && callBackResponse.value) {
    //   //   punchbackUrl = callBackResponse.value;
    //   // }
    //   console.log(callBackResponse);
    //   let redirectRequestObj = {
    //                             'userID': this.userInfo.userId,
    //                             'guID' : guId,
    //                             'appName': 'EA',
    //                             'punchBackURL': callBackResponse.value
    //                           };
    //   console.log(JSON.stringify(redirectRequestObj));
    //   return this.http.post(this.getAppDomain + 'api/resource/'+ this.CLEAN_CORE_REDIRECTION_URL_HANDLER, redirectRequestObj).pipe(map(res => res));
    // });
  }

  getSFDCUrl() {
    return this.http
      .get(this.getAppDomain + 'api/resource/' + this.SFDC_PUNCH_OUT)
      .pipe(map(res => res));
    // return this.http.get(this.appDataService.getAppDomain + this.appDataService.SFDC_PUNCH_OUT + '&EAReqId=' + payloadId).map(res => res)
  }

  constructor(public localeService: LocaleService,
    public appRestService: AppRestService,
    private messageService: MessageService,
    private http: HttpClient,
    public _router: Router,
    private copyLinkService: CopyLinkService,
    public constantsService: ConstantsService,
    private permissionService: PermissionService
  ) {
    this.userInfo = {
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
    };
  }

  set appDomainName(domain: string) {
    this.appDomain = domain;
  }

  get getAppDomain() {
    // return this.appDomain + this.appPath;
    return '../../';
    // return '/';
  }

  findUserInfo() {
    this.appRestService.getUserDetails().subscribe(
      (response: any) => {
        if (!this.isReload) {
          this.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
        }
        if (response && !response.error) {
          try {
            const userInfo = response.data;
            // if (response.maintainace) {
            //   this.showMentanceMessage(response.maintainace);
            // }
            if (response.releaseNoteData) {
              this.showAnnounceBanneer = !response.releaseNoteData.hideReleaseNote;
            }

            this.isUserDataLoaded = true;

            if (this.isAutorizedUser(userInfo)) {
              this.setUserInfoPermissions(userInfo)


              sessionStorage.setItem(
                AppDataService.USERINFO_SESSION_STORAGE,
                JSON.stringify(this.userInfo)
              );
              let sessionObj = this.getSessionObject();
              if (!sessionObj) {
                this.setSessionObject(this.sessionObject);
                sessionObj = this.sessionObject;
              }
              sessionObj.userInfo = this.userInfo;
              sessionObj.isPatnerLedFlow = this.isPatnerLedFlow;
              this.setSessionObject(sessionObj);
              this.createProposalEmitter.emit(sessionObj);
              this.changeSubPermissionEmitter.emit(this.allowChangSub);
            }
            // this.getShowOrHideChangeSubscription(); // method to call api to check and show/hide change sub
            // to load create qual page in case of partner led flow
            if (this.isReload) {
              this.createQualEmitter.emit();
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
          if (this.proxyUser) {
            this.proxyUser = false;
            this.userInfoObjectEmitter.emit(this.userInfo);
          }
        }
      },
      error => {
        this.messageService.displayUiTechnicalError(error);
      }
    );
  }

  // updateWalkMeUser(){
  //   this.appRestService.executeWalkMe().subscribe((response: any) => {
  //     if(response && response.value !== 'Y'){
  //       return;
  //     } else {
  //       const WalkMeInputObj: {[k: string]: any} = {};
  //       WalkMeInputObj.FirstName = this.userInfo.firstName;
  //       WalkMeInputObj.LastName = this.userInfo.lastName;
  //       WalkMeInputObj.Id = this.userInfo.userId;
  //       WalkMeInputObj.Locale = null;
  //       WalkMeInputObj.AccessLevel = ''+this.userInfo.accessLevel;
  //       WalkMeInputObj.Type = null;
  //       WalkMeInputObj.BEGEOID = null;
  //       WalkMeInputObj.BE = null;
  //       WalkMeInputObj.Country = null;
  //       WalkMeInputObj.USERID = this.userInfo.userId;
  //       (<any>window).WalkMeInputInfo.User = WalkMeInputObj;
  //       if(this.environmentVar !== this.envMap.cloudapps){
  //         (<any>window).walkmeForNonProd();
  //       } else {
  //         (<any>window).walkMeScriptProd();
  //       }
  //     }
  //   });
  // }

  setUserInfoPermissions(userInfo) {
    this.userInfo.firstName = userInfo.firstName;
    this.userInfo.lastName = userInfo.lastName;
    this.userInfo.userId = userInfo.userId;
    this.userInfo.emailId = userInfo.emailId;
    this.userInfo.isProxy = false;
    this.userInfo.loggedInUser = userInfo.userId;
    this.userInfo.authorized = userInfo.authorized;
    this.userInfo.partnerAuthorized = userInfo.partnerAuthorized;
    this.userInfo.accessLevel = userInfo.accessLevel;
    this.userInfo.isPartner = userInfo.partner;
    this.userInfo.userType = userInfo.userType;
    this.userInfo.distiUser =  userInfo.distiUser;
    if (userInfo.salesAccountsCount && userInfo.salesAccountsCount > 0) {
      this.userInfo.salesAccountView = true;
    } else {
      this.userInfo.salesAccountView = false;
    }
    if (!userInfo.userRole) {
    //  this.showUserRolePopup = true;
      this.appRestService.getUserRoleDetails().subscribe(
        (res: any) => {
          if (res) {
            this.userRoles = res.data.roles;
          }
        });
    }
    if (this.userInfo.isPartner) {
      this.userInfo.ipcAccess = userInfo.ipcAccess;
      this.userInfo.createQuoteAndDealEnabled = userInfo.createQuoteAndDealEnabled;
      this.setDataForPartnerFlow();
    }
    // this.userInfo.permissions =  userInfo.permissions;

    // if user info has permissions and not empty assign to the value else set to empty array
    if (userInfo.permissions && userInfo.permissions.featureAccess && userInfo.permissions.featureAccess.length > 0) {
      // var permissions = [];
      // permissions = userInfo.permissions.featureAccess.map(a => a.name);
      this.permissionService.permissions = new Map(userInfo.permissions.featureAccess.map(i => [i.name, i]));
      // this.userInfo.permissions = permissions;
      this.userInfo.permissions = this.permissionService.permissions;
    }

    this.userInfoObjectEmitter.emit(this.userInfo);
    // this.updateWalkMeUser();
    // To show debugger
    this.showDebugger = this.permissionService.permissions.has(PermissionEnum.Debug);

    // to show Change Subscription radio button
    this.allowChangSub = this.permissionService.permissions.has(PermissionEnum.Change_Subscription);

    // flag to allow smart Subsidiaries view access
    this.allowSmartSubsidiariesView = this.permissionService.permissions.has(PermissionEnum.Smart_Subsidiary);

    // To show Activity Log
    this.activityLogPermission = this.permissionService.permissions.has(PermissionEnum.ActivityLog);

    // flag to allow dna exception approval for user
    this.userInfo.thresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaThreshold);

    // flag to allow dc exception approval for user
    this.userInfo.dcThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DcThreshold);

    // flag to allow security exception approval for user
    this.userInfo.secThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.SecThreshold);

    // flag to allow adjustment approval for user
    this.userInfo.adjustmentApprover = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentApprover);

    // flag to allow dna exception approval for user
    this.userInfo.dnaDiscountExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaDiscountApprover);

    // flag to allow user to perform purchase adjustment
    // this.userInfo.purchaseAdjustmentUser = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentPermit);

    // added for getting adminUser from permissions
    this.userInfo.adminUser = this.permissionService.permissions.has(PermissionEnum.Admin);
    if (this.userInfo.adminUser) {
      localStorage.setItem('isAdmin', 'TRUE');
    } else {
      localStorage.setItem('isAdmin', this.constantsService.FALSE);
    }

    // check for RoSuerUser message and set the Ro Super user
    if (this.permissionService.permissions.has(PermissionEnum.RoMessage)) {
      this.userInfo.roSuperUser = true;
    } else {
      this.userInfo.roSuperUser = false;
    }
    if (this.proxyUser) {
      this.proxyEmitterForHeader.emit();
    }

    // to save the userInfo from local staorage
    localStorage.setItem('userIdOfLoggedinUser', userInfo.userId);

    // Set user info property if user is RW super user
    if (this.permissionService.permissions.has(PermissionEnum.RwMessage)) {
      this.userInfo.rwSuperUser = true;
    } else {
      this.userInfo.rwSuperUser = false;
    }
  }
  get userId() {
    return this.userInfo.userId;
  }

  getUserInfo() {
    return this.userInfo;
  }


  private checkDecimalValue(value) {
    value = value.toFixed(2);
    const decimalValue = value - Math.floor(value);
    if (decimalValue !== 0.00) {
      return value;
    } else {
      return Math.floor(value);
    }
  }

  prettifyNumber(value) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    let sign = 1;
    let val: number;
    if (!value) {
      return 0;
    }
    // to check if value is -ve; convert it to +ve and after calculation add sign
    if (value < 0) {
      value = -1 * value;
      sign = -1;
    }
    if (value < thousand) {
      return String(sign * value);
    }

    if (value >= thousand && value <= 1000000) {
      val = (sign * (value / thousand));
      return this.checkDecimalValue(val) + 'K';
    }

    if (value >= million && value <= billion) {
      val = (sign * (value / million));
      return this.checkDecimalValue(val) + 'M';
    }

    if (value >= billion && value <= trillion) {
      val = (sign * (value / billion));
      return this.checkDecimalValue(val) + 'B';
    } else {
      val = (sign * (value / trillion));
      return this.checkDecimalValue(val) + 'T';
    }
  }

  removeSpecialCharacters(str) {
    return str.replace(/[^a-zA-Z0-9]+/, '');
  }
  showActivityLogIcon(showFlag) {
    if (showFlag && this.activityLogPermission) {
      this.showActivityLog = true;
    } else {
      this.showActivityLog = false;
    }
  }
  getDetailsMetaData(tabName) {
    let metaDataObject;
    try {
      if (!this.architectureMetaDataObject) {
        const sessionObject: SessionData = this.getSessionObject();
        this.architectureMetaDataObject = sessionObject.architectureMetaDataObject;

        if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
          const userInfoJson = JSON.parse(
            sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)
          );
          this.userInfo.userId = userInfoJson.userId;
        }
        // if architectureMetaDataObject is not avilable in session, make a API call.
        if (!this.architectureMetaDataObject.length || this.architectureMetaDataObject.length === 0) {
          this.setMetaData().subscribe((res: any) => {
            if (res && !res.error) {
              if (res.data) {
                this.architectureMetaDataObject = res.data;
                sessionObject.architectureMetaDataObject = res.data;
                this.setSessionObject(sessionObject);
                for (let i = 0; i < this.architectureMetaDataObject.length; i++) {
                  let architecture = this.architectureMetaDataObject[i];
                  // architecture = undefined;
                  if (architecture.name === 'ALL') {
                    const modules = this.architectureMetaDataObject[i].modules;
                    for (let j = 0; j < modules.length; j++) {
                      const module = modules[j];
                      if (module.name === tabName) {
                        metaDataObject = module;
                        break;
                      }
                    }
                  }
                }
                return metaDataObject;
              }
            } else {
              // error msg
            }
          });
        } else {
          for (let i = 0; i < this.architectureMetaDataObject.length; i++) {
            let architecture = this.architectureMetaDataObject[i];
            // architecture = undefined;
            if (architecture.name === 'ALL') {
              const modules = this.architectureMetaDataObject[i].modules;
              for (let j = 0; j < modules.length; j++) {
                const module = modules[j];
                if (module.name === tabName) {
                  metaDataObject = module;
                  break;
                }
              }
            }
          }
          return metaDataObject;
        }
      }
      for (let i = 0; i < this.architectureMetaDataObject.length; i++) {
        let architecture = this.architectureMetaDataObject[i];
        // architecture = undefined;
        if (architecture.name === 'ALL') {
          const modules = this.architectureMetaDataObject[i].modules;
          for (let j = 0; j < modules.length; j++) {
            const module = modules[j];
            if (module.name === tabName) {
              metaDataObject = module;
              break;
            }
          }
        }
      }
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
    return metaDataObject;
  }

  getHeaderData(summaryJSON) {
    this.headerDataEmitter.emit(new Map<string, any>());
    this.subHeaderData.subHeaderVal = [];
    const headerDetailsDataMap = new Map<string, any>();
    const archMetaData = this.getDetailsMetaData(
      AppDataService.PROSPECT_HERADER
    );
    headerDetailsDataMap.set(
      AppDataService.HEADER_DISPLAY_NAME,
      archMetaData.displayName
    );
    if (this.archName !== this.constantsService.SECURITY) {
      if (archMetaData && archMetaData.columns) {
        const noOfCol = archMetaData.columns.length;
        for (let i = 0; i < noOfCol; i++) {
          // to show only columns with hidecolumn = 'N'
          if (archMetaData.columns[i].hideColumn !== 'Y') {
            const column = archMetaData.columns[i];
            const dataObj = {
              displayName: column.displayName,
              displayOrder: column.displayOrder
            };
            headerDetailsDataMap.set(column.persistanceColumn, dataObj);
          }
        }
      }

      // this.spinnerConfig.stopChainAfterThisCall();
      this.appRestService.getHeaderDetails(summaryJSON, this.appDomain).subscribe(
        (response: any) => {
          try {
            if (
              response &&
              !response.error && response.data &&
              response.data[0] &&
              response.data[0].column
            ) {
              const headerData = response.data[0].column;
              const headerDataSize = headerData.length;
              for (let i = 0; i < headerDataSize; i++) {
                if (headerData[i].name === 'CUSTOMER_ID') {
                  headerDetailsDataMap.set(
                    headerData[i].name,
                    headerData[i].value
                  );
                } else {
                  const dataObj = headerDetailsDataMap.get(headerData[i].name);
                  if (dataObj) {
                    dataObj['value'] = headerData[i].value;
                  }
                }
              }
            } else {
              this.messageService.displayMessagesFromResponse(response);
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
          this.headerDataEmitter.emit(headerDetailsDataMap);
        },
        error => {
          this.messageService.displayUiTechnicalError(error);
        }
      );
    }
  }

  isPageConextCorrect(pageConext) {

    let correctPageConext = false;
    if (this.pageContext === pageConext) {
      correctPageConext = true;
    }
    return correctPageConext;
  }


  assignColumnWidth(columnSize) {
    let columnWidth;
    switch (columnSize) {
      case 'XL':
        columnWidth = 500;
        break;
      case 'L':
        columnWidth = 400;
        break;
      case 'M':
        columnWidth = 200;
        break;
      case 'S':
        columnWidth = 140;
        break;
      case 'XS':
        columnWidth = 100;
        break;
    }
    return columnWidth;
  }

  getUserDetailsFromSession() {
    if (!this.userInfo || !this.userId || !this.userInfo.firstName) {
      if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
        const userInfo = JSON.parse(
          sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)
        );
        this.userInfo.firstName = userInfo.firstName;
        this.userInfo.lastName = userInfo.lastName;
        this.userInfo.userId = userInfo.userId;
      }
    }
  }

  getSessionObject() {
    let localSessionObj: SessionData;
    localSessionObj = this.sessionObject;
    if (sessionStorage.getItem(AppDataService.SESSION_OBJECT)) {
      localSessionObj = JSON.parse(
        sessionStorage.getItem(AppDataService.SESSION_OBJECT)
      );
      // to set metadata for qualification flow when going from dashboard directly
      // if (!localSessionObj.architectureMetaDataObject.size) {
      //   this.setMetaData().subscribe((response:any) =>{
      //     for (let i = 0; i < response.data.length; i++) {
      //       this.architectureMetaDataObject = response.data;
      //       localSessionObj.architectureMetaDataObject = response.data;
      //       this.setSessionObject(localSessionObj);
      //     }
      //   });
      //   return localSessionObj;
      // }

    }
    return localSessionObj;

  }

  setMetaData() {
    return this.http.get(this.getAppDomain + 'api/dashboard/getArchitecture?archName=ALL').pipe(map(res => res));
  }

  setSessionObject(sessionObject: SessionData) {
    sessionStorage.setItem(
      AppDataService.SESSION_OBJECT,
      JSON.stringify(sessionObject)
    );
  }

  // requestAccessForQual(qualId){
  //   this.http.get(this.getAppDomain + 'api/qualification/authorization/read-write?q='+ qualId + '&u=' + this.userId).map(res=>res).subscribe((res:any) =>{
  //     if (res && !res.error) {
  //       try {
  //         this.copyLinkService.showMessage(
  //           this.constantsService.REQUEST_ACCESS
  //         );
  //       } catch (error) {
  //         console.error(error.ERROR_MESSAGE);
  //         this.messageService.displayUiTechnicalError(error);
  //       }
  //     } else {
  //       this.messageService.displayMessagesFromResponse(res);
  //     }
  //   });
  // }

  requestAccessForProposalOrQual(qualOrProposal, id) {
    let url = '';
    if (qualOrProposal === this.constantsService.QUALIFICATION) {
      url = 'api/' + qualOrProposal + '/authorization/read-write?q=' + id + '&u=' + this.userId;
    } else if (qualOrProposal === this.constantsService.PROPOSAL) {
      url = 'api/' + qualOrProposal + '/authorization/read-write?p=' + id + '&u=' + this.userId;
    }

    this.http.get(this.getAppDomain + url).pipe(map(res => res)).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.copyLinkService.showMessage(
            this.constantsService.REQUEST_ACCESS
          );
        } catch (error) {
          console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  requestUserAccess() {
    this.http.get(this.getAppDomain + 'api/home/users/authorization?u=' + this.userId).pipe(map(res => res)).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.copyLinkService.showMessage(
            this.constantsService.REQUEST_ACCESS
          );
        } catch (error) {
          console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  getSessionDataForSummaryPage(type?, id?: any) {
    return this.http.get(this.getAppDomain + 'api/session/info?' + type + '=' + id);
  }


  setDataForPartnerFlow() {
    this.isPatnerLedFlow = true;
    // this.updateWalkMeUser();
    this.menubarUserInfoEmitter.emit(this.userInfo);
  }

  isAutorizedUser(userInfo: any) {
    let autorizedUser = true;
    // if (userInfo.accessLevel === 4) {
    this.userInfo.firstName = userInfo.firstName;
    this.userInfo.lastName = userInfo.lastName;
    this.userInfo.userId = userInfo.userId;
    this.userInfo.accessLevel = userInfo.accessLevel;
    this.userInfo.isPartner = userInfo.partner;

    if (!userInfo.authorized || !userInfo.partnerAuthorized ) {
      this.authMessage = userInfo.message;
      this._router.navigate(['authenication']);

      autorizedUser = false;
    } else {
      autorizedUser = true;
    }
    // } else {
    //   this._router.navigate(['loginError']);
    // autorizedUser = false;
    // }
    return autorizedUser;

  }


  // showMentanceMessage(maintainance) {

  //   if (maintainance.underMaintainance) {

  //     this.underMaintainance = maintainance.underMaintainance;
  //     this.underMaintainanceMessage = maintainance.underMaintainanceMessage;

  //   } else if (maintainance.maintainanceAnnoucement) {
  //     if (maintainance.maintainanceAnnouncementMessage) {
  //       this.maintainanceMessage = maintainance.maintainanceAnnouncementMessage;
  //     }
  //   }
  // }

  getTeamMembers(type?): Observable<any> {
    if(!type){
      type = 'SSP'
    }
    if (this.ciscoTeamMembers) {
      return new Observable<any>((subscribe: Subscriber<any>) => { subscribe.next(this.ciscoTeamMembers); });
    } else {
      return this.http.get(this.getAppDomain + 'api/lookup/contacts?t='+type).pipe(map(res => res));
    }
  }

  // create unique id for automation testing
  createUniqueId(arg, pageContext) {
    let page_context = '';
    if (!pageContext) {
      page_context = 'dashboard';
    } else {
      page_context = pageContext;
    }
    let id = '';
    if (typeof (arg) === 'number') {
      arg = arg.toString();
    }
    id = arg !== undefined ? arg.replace(/ /g, '_') : '';
    id = arg !== undefined ? (page_context + '_' + id) : page_context;
    return id;
  }

  updateCrossArchitectureProposalStatusforHeader(proposalCurrentStatus) {

    if (this.subHeaderData.subHeaderVal) {
      let isLinkedProposal = this.subHeaderData.subHeaderVal[6];
      if (isLinkedProposal && this.subHeaderData.subHeaderVal[8]) {
        // this.archName - current selected propsoal's archname
        for (let proposalObject of this.subHeaderData.subHeaderVal[8]) {
          if (proposalObject.architecture_code && proposalObject.architecture_code === this.archName) {
            proposalObject.status = proposalCurrentStatus;
          }
        }
      }
    }
  }

  setActiveClassValue() {
    // set all ticks to false - default
    this.peRecalculateMsg.isConfigurationDone = false;
    this.peRecalculateMsg.isValidationDone = false;
    this.peRecalculateMsg.isComputingDone = false;
  }



  // Need to remove this code in Feb 2020 release.
  /*getSalesAccountCount(){
    if(this.displaySalesAccount === null){
    this.appRestService.getSalesAccountCount(this.getAppDomain).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        try {
          const salesAccountCount  = res.data.totalAccounts;
          if(salesAccountCount > 0){
            this.displaySalesAccount = true;
          }else{
            this.displaySalesAccount = false;
          }
          this.salesAccountCountEmitter.emit(this.displaySalesAccount);
        } catch (error) {
          //console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  }*/
  validateResponse(response) {
    let responseObject;
    try {
      if (response && !response.error && response.data) {
        responseObject = response.data;
      } else {
        if (response.error) {
          this.messageService.displayMessagesFromResponse(response);
        }
      }
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }


    return responseObject;
  }

  // method to call api to check and show/hide change sub
  getShowOrHideChangeSubscription(){
    this.showOrHideChangeSubscription().subscribe((res: any) => {
      if(res && res.value && !res.error){
        this.displayChangeSub = (res.value === 'Y') ? true : false;
      } else {
        this.messageService.displayMessagesFromResponse(res) ;
      }
    });
  }

  // api to check and show/hide change sub
  showOrHideChangeSubscription(){
    return this.http.get(this.getAppDomain + 'api/resource/SHOW_CHANGE_SUBSCRIPTION').pipe(map(res => res));
  }


  isTwoTierUser(buyDistiMethod=false){
    if(buyDistiMethod && this.userInfo.accessLevel === 3 && !this.userInfo.distiUser){
          return true;
      }
      return false;
  }

  isTwoTUserUsingDistiDeal(is2tPartner=false , distiDeal=false){
    if(is2tPartner && distiDeal){
      return true;
  }
  return false;
  }
  isDistiWithTransfferedControl(buyDistiMethod=false, distiInitiated=false){
    if(this.userInfo.distiUser && buyDistiMethod && !distiInitiated){
      return true;
    }
    return false;
  }

    isDistiNotIntiated(distiInitiated=false){
    if(this.userInfo.distiUser && !distiInitiated){
      return true;
    }
    return false;
  }
  changeSmartAccountLink(smartAccountObj) {
    const requestObj = {
      'data': {
        'smartAccountId': smartAccountObj.smartAccountId,
        'active': smartAccountObj.active,
        'prospectKey': this.customerID
      }
    };
    return this.http.post(this.getAppDomain + `api/prospect/agreement/smartAccountActive`, requestObj)
      .pipe(map(res => res));
  }  
}

export interface SessionData {
  userInfo?: any;
  architectureMetaDataObject?: any;
  qualificationData?: any;
  comingFromDocCenter?: any;
  custInfo?: CustomerInfo;
  proposalDataObj?: any;
  flow?: string;
  userDashboardFlow?: string;
  customerId?: number;
  currency?: string;
  isUserReadWriteAccess?: boolean;
  createAccess?: boolean;
  isPatnerLedFlow?: boolean;
  isFavoriteUpdated?: boolean;
  isEditDealIdAllowed?: boolean;
  isGroupSelected?: boolean;
  tcoDataObj?: any;
  partnerUrl?: string;
  subUiUrl?: string;
  partnerDeal?: boolean;
  isNewReleaseDisplayed?: boolean;
  reportCenterAccess?: boolean;
  manageCompHoldAccess?: boolean;
  propExceptionAccess?: boolean;
  renewalId?: string;
  pendingForMyApproval?: boolean;
  pendingForTeamApproval?: boolean;
  whereIAmApprover?:boolean;
}

export interface CustomerInfo {
  archName: string;
  custName: string;
  custId: string;
}
