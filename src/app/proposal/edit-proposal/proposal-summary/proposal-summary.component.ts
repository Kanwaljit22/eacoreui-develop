import { EaService } from 'ea/ea.service';
import { ProposalPollerService } from './../../../shared/services/proposal-poller.service';
import { CxPriceEstimationService } from './../cx-price-estimation/cx-price-estimation.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { GridOptions, ColDef, ColGroupDef, CellValueChangedEvent, CellDoubleClickedEvent, GridReadyEvent } from 'ag-grid-community';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ReviewAcceptComponent } from '@app/modal/review-accept/review-accept.component';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProposalDataService } from '../../proposal.data.service';
import { CreateProposalService } from '../../create-proposal/create-proposal.service';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { AppDataService, SessionData } from '../../../shared/services/app.data.service';
import { QualificationsService } from '../../../qualifications/qualifications.service';
import { ProposalSummaryService } from './proposal-summary.service';
import { ListProposalService } from '../../list-proposal/list-proposal.service';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { MessageService } from '../../../shared/services/message.service';
import { TcoConfigurationService } from '@app/proposal/edit-proposal/tco-configuration/tco-configuration.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageType } from '../../../shared/services/message';
import { ReOpenComponent } from '@app/modal/re-open/re-open.component';
import { BreadcrumbsService } from '@app/core/breadcrumbs/breadcrumbs.service';
import { ApproveExceptionComponent } from '../price-estimation/approve-exception/approve-exception.component';
import { ApproveExceptionService } from '../price-estimation/approve-exception/approve-exception.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { CreateTcoComponent } from '@app/modal/create-tco/create-tco.component';
import { TcoDataService } from '@app/tco/tco.data.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { Subscription } from 'rxjs';
import { SelectExceptionComponent } from '../../../modal/select-exception/select-exception.component';
import { WithdrawExceptionRequestComponent } from '@app/modal/withdraw-exception-request/withdraw-exception-request.component';
import { ColumnGridCellComponent } from '../../../shared/ag-grid/column-grid-cell/column-grid-cell.component';
import { ManageServiceSpecialistComponent } from '@app/modal/manage-service-specialist/manage-service-specialist.component';
import { EaStoreService } from 'ea/ea-store.service';


const MONTH = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04',
  May: '05', Jun: '06', Jul: '07', Aug: '08',
  Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

@Component({
  selector: 'app-proposal-summary',
  templateUrl: './proposal-summary.component.html',
  styleUrls: ['./proposal-summary.component.scss']
})

export class ProposalSummaryComponent implements OnInit, OnDestroy {


  chartData: any;
  public gridOptions: GridOptions;
  private gridApi;
  private gridColumnApi;
  public showGrid: boolean;
  public rowData: any;
  public columnDefs: any;
  public columnDefsTop: any;
  public check = true;
  public domLayout;
  Proposalsuccess = false;
  selectedOptions: IMultiSelectOption[];
  columnHeaderList = [];
  showBreakdown = false;
  isProposalDeleted = false;
  hasMultipleOffer = false;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false

  };
  json: any = {};
  roadMap: IRoadMap;
  isEditDisabled = false;
  isLoccSigned = true;
  showInfo = true;
  proposalStatus = '';
  purchaseAdjustmentException = false;
  thresholdException = false;
  isEnableContinue = false;
  qualInProgress = false;
  suiteData = [];
  cxSuiteData = []; // to cx suites data 
  completeProposalData: {};
  completeCxProposalData: {}; // set to show cx proposal success data
  status = 'complete';
  isDataLoaded = false;
  qualOrProposal = 'proposal';
  public subscribers: any = {};
  loadPE = false;
  showReqApproval = false;
  securityArchitecture = false;
  dnaArchitecture = false;
  suitesArray = [];
  summaryData: any = [];
  pinnedResult = {};
  tcoCount = 0;
  requiredSuitesSelected = false;
  reqJSON: any = {};
  suitesData: any = [];
  suiteNameArr: any = [];
  suiteIdArr: any = [];
  allowClone = false;
  allowDocCenter = false;
  allowQuote = false;
  allowReopen = false;
  disableReopen = false;
  private paramsSubscription: Subscription;
  dnaMaxSubscriptionDiscountException = false;
  partnerLedFlow = false;
  ciscoDealForPartner=false;
  showAuthMessage = false;
  selectedSuites = [];
  loccOptional = false;
  enableGTCComplianceQnA = false;
  gtcComplianceThreshold: any;
  // isloccRequired = false;
  isApprovalFlow = false; // set if approval flow 
  isExceptionStatusPresent = false; // to show status of yout exceptions and approval history
  isExceptionSubmitted = false; // to set if exception reasons are selected and submitted from modal
  exceptionStatusData: any = []; // to store exceptionStatusData after submit for approval
  isShowWithDraw = false; // to show withdraw req button
  exceptionsData: any = []; // to set exception activities coming from response
  isShowSelectReason = false; // set to show submit for req approval button if any exceptions present
  submitRequestObj = {}; // set to store request obj from submit modal
  isExceptionWithdrawn = false; // set if withdraw requ button clicked
  isShowStatus = true; // to show status tab default
  isSwitched = false; // set if switched the status tab
  isBecomeApprover = false; // set if user becomes approver
  isSubmittedDecision = false;// set if decison and reason are submitted by approver
  decisionSelected = ''; // set the decision type from selected
  displayApproverHistory = false; // to show approver history for approver
  displayApprovalHistory = false; // to show approval history for seller
  pendingExceptionData = []; // to store pending exceptions data
  exceptionApprovalHistory: any = []; // to store approval history
  groupExceptionApproverHistory: any = [];
  allowExceptionSubmission = false;
  pendingExceptions = 0 ;
  allowCompletion = false;
  showApproverButton = false; // to show become approver button for approve flow;
  isApproverDecisionSubmitted = false; // to show cycle time for actioned exceptions 
  isSelectedPaRequestException = false; // to set and show message after becoming approver for PA req
  isRequestStartDateDue = false;  // Flag to show error and stop user for moving forward to submit proposal if request start date is due.
  gtcComplianceObj = {};// to set GTC Compliance obj if present
  orginalProposalID =  '';
  allowShareWtihDisti = false; // to show transfer to disti button
  allowWithdrawSharingWithDisti = false; // to show withdraw proposal button
  partnerTeamsArray = []
  cxPricingData = [];
  isTypeCX = false;
  proposalCxParams: any = {};
  proposalCxPriceInfo: any = {};
  pollerSubscibers : any;
  cxSummaryData: any = []; // set to show data for financial summary page
  cxPinnedResult = {}; // set to show grant total for financial summary page
  delistingCxException = false; // set to show cx delisting exception message
  displayIbPullMsg = false;

  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService, private http: HttpClient, private modalVar: NgbModal,
    private utilitiesService: UtilitiesService, private router: Router, private route: ActivatedRoute,
    public proposalDataService: ProposalDataService, public messageService: MessageService,
    public createProposalService: CreateProposalService, public qualService: QualificationsService, public blockUiService: BlockUiService,
    private copyLinkService: CopyLinkService, public tcoApiCallService: TcoApiCallService,
    public appDataService: AppDataService, public proposalSummaryService: ProposalSummaryService,
    public listProposalService: ListProposalService, public approveExceptionService: ApproveExceptionService,
    private permissionService: PermissionService, private tcoConfigurationService: TcoConfigurationService,
    public constantsService: ConstantsService, private breadcrumbsService: BreadcrumbsService, 
    private tcoDataService: TcoDataService ,private cxPriceEstimationService : CxPriceEstimationService ,
    private proposalPollerService : ProposalPollerService, private eaService: EaService, public eaStoreService: EaStoreService) {
    // this.columnDefsTop = this.getColumnDefs();
    // createColumnDefs not required now as it was for TCO page.
    this.columnDefs = this.createColumnDefs();
    this.gridOptions = <GridOptions>{};
    this.domLayout = 'autoHeight';
    this.gridOptions.frameworkComponents = {
      suiteCellRenderer: <{ new(): ColumnGridCellComponent }>(
        ColumnGridCellComponent
      )
    }
  }




  ngOnInit() {
   // this.gridOptions = <GridOptions>{};
    // Sample method to hide breadcrumb
    // this.breadcrumbsService.breadCrumbStatus.next(true);
    // this.appDataService.movebreadcrumbUp.next(true);
    // Deep link and url change handelled
    this.eaService.visibleManualIbPull();
    let isDataAlreadyLoaded = false;
    this.proposalDataService.displayBellIcon = false;
    this.proposalDataService.is2TUsingDistiSharedPrposal = false;
    this.showApproverButton = true;    
    this.appDataService.isReadWriteAccess = true;
    this.appDataService.openCaseManagementSubject.next(true);
    this.paramsSubscription = this.route.paramMap.subscribe(params => {
      isDataAlreadyLoaded = true;
      this.proposalDataService.isProposalHeaderLoaded = false;
      this.proposalDataService.proposalDataObject.billToId = params.get('billToId');
      this.loadData();
    });

    if (!isDataAlreadyLoaded) {
      this.loadData();
    }
  }


  loadData() {
    // console.log(this.allowReopen, this.permissionService.proposalEdit, this.appDataService.isReadWriteAccess);
    // to check if URL has /pe after the proposal id.
    this.proposalDataService.showFinancialSummary = false; // set to false when route to other pages
    const url = this.router.url;
    
    if (url.indexOf("priceestimate") >= 10) {
      this.loadPE = true;
      if(this.proposalDataService.proposalDataObject.billToId){
        this.proposalSummaryService.sendBillToId(this.proposalDataService.proposalDataObject.billToId).subscribe((response: any) => {
          if (!response.error) {
            this.proposalDataService.isCxAttachedToSoftware = true;
            this.proposalDataService.punchoutFromConfig = true;
            this.appDataService.isSuperUserMsgDisplayed = true;
            this.proposalDataService.proposalDataObject.billToId = '';
          }
        });
      } else {       
        this.proposalDataService.punchoutFromConfig = true;
        this.appDataService.isSuperUserMsgDisplayed = true;
      }
      
    }

    // this.appDataService.userInfo.rwSuperUser = false

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSummaryStep;
    this.appDataService.showActivityLogIcon(true);
    this.appDataService.isProposalIconEditable = false;
    let sessionObj: SessionData = this.appDataService.getSessionObject();
    if (sessionObj) {
      this.appDataService.isPatnerLedFlow = sessionObj.isPatnerLedFlow;
     // this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    }
    // set readwrite access from proposal edit permission
    // this.appDataService.isReadWriteAccess = this.permissionService.proposalEdit;
    if (!this.loadPE) {
      this.blockUiService.spinnerConfig.startChain();
    }
    if (this.qualService.qualification.qualID) { // if qual id present load header api first
      this.json = {
        'data': {
          'id': this.proposalDataService.proposalDataObject.proposalId,
          // "userId": this.appDataService.userId,
          'qualId': this.qualService.qualification.qualID
        }
      };
      if (!this.proposalDataService.isProposalHeaderLoaded) {
        this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
        this.proposalDataService.isProposalHeaderLoaded = true;
      }
    }

    // after purchaseoptions loaded, call the method to check purchse auth and show message on UI
    this.subscribers.purchseOptionsEmitter = this.proposalSummaryService.purchaseOptionsEmitter.subscribe((response: any) => {
      if (!this.appDataService.roadMapPath && !this.proposalDataService.cxProposalFlow) {
        this.checkPurchaseAuthorization(this.appDataService.purchaseOptiponsData, this.selectedSuites);
      }
    });

    // after header loaded, check the status and don't show withdraw button if completed
    this.subscribers.headerDataLoaded = this.appDataService.headerDataLoaded.subscribe(() => {
      if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS) {
        this.isShowWithDraw = false;
        if(this.isExceptionSubmitted){ // if exception submitted and proposal status is complete call tcocount method
          this.getTcoCountNumber();
        }
      }
      this.proposalDataService.isAnnualBillingMsgRequired();

    });
      
    //Reset original proposal id
    this.orginalProposalID = '';

    this.appDataService.getSessionDataForSummaryPage('p', this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          const userInfo = res.data.user;
          if (this.appDataService.isAutorizedUser(userInfo)) {
            this.appDataService.userInfo.isProxy = false;
            this.appDataService.userInfo.loggedInUser = userInfo.userId;
            this.appDataService.userInfo.firstName = userInfo.firstName;
            this.appDataService.userInfo.lastName = userInfo.lastName;
            this.appDataService.userInfo.emailId = userInfo.emailId;
            this.appDataService.userInfo.accessLevel = userInfo.accessLevel;
            this.appDataService.userInfo.isPartner = userInfo.partner;
            this.appDataService.userInfo.distiUser = userInfo.distiUser;

            // if user info has permissions and not empty assign to the value else set to empty array
            if (userInfo.permissions && userInfo.permissions.featureAccess && userInfo.permissions.featureAccess.length > 0) {
              // var permissions = [];
              // permissions = userInfo.permissions.featureAccess.map(a => a.name);
              this.permissionService.permissions = new Map(userInfo.permissions.featureAccess.map(i => [i.name, i]));
              this.appDataService.userInfo.permissions = this.permissionService.permissions;

              // this.appDataService.userInfo.permissions = permissions;
            }

            // added for getting adminUser from permissions
            this.appDataService.userInfo.adminUser = this.permissionService.permissions.has(PermissionEnum.Admin);
            if (this.appDataService.userInfo.adminUser) {
              localStorage.setItem('isAdmin', 'TRUE');
            } else {
              localStorage.setItem('isAdmin', this.constantsService.FALSE);
            }

            // check for RoSuerUser message and set the Ro Super user
            if (this.permissionService.permissions.has(PermissionEnum.RoMessage)) {
              this.appDataService.userInfo.roSuperUser = true;
            } else {
              this.appDataService.userInfo.roSuperUser = false;
            }

            // To show debugger
            this.appDataService.showDebugger = this.permissionService.permissions.has(PermissionEnum.Debug);

            // to show Change Subscription radio button
            this.appDataService.allowChangSub = this.permissionService.permissions.has(PermissionEnum.Change_Subscription);

            // flag to allow smart Subsidiaries view access
            this.appDataService.allowSmartSubsidiariesView = this.permissionService.permissions.has(PermissionEnum.Smart_Subsidiary);

            //To show activity log
            this.appDataService.showActivityLog = this.permissionService.permissions.has(PermissionEnum.ActivityLog);
                            
            // flag to allow dna exception approval for user
            this.appDataService.userInfo.thresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaThreshold);

            // flag to allow dc exception approval for user
            this.appDataService.userInfo.dcThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DcThreshold);

            // flag to allow security exception approval for user
            this.appDataService.userInfo.secThresholdExceptionApprover = this.permissionService.permissions.has(
              PermissionEnum.SecThreshold);

            // flag to allow adjustment approval for user
            this.appDataService.userInfo.adjustmentApprover = this.permissionService.permissions.has(
              PermissionEnum.PurchaseAdjustmentApprover);

            // flag to allow dna exception approval for user 
            this.appDataService.userInfo.dnaDiscountExceptionApprover =  this.permissionService.permissions.has(PermissionEnum.DnaDiscountApprover);

            // flag to allow user to perform purchase adjustment
            // this.appDataService.userInfo.purchaseAdjustmentUser =
            // this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentPermit);

            if (this.permissionService.permissions.has(PermissionEnum.RwMessage)) {
              this.appDataService.userInfo.rwSuperUser = true;
            } else {
              this.appDataService.userInfo.rwSuperUser = false;
            }

            if (this.appDataService.userInfo.isPartner) {
              this.appDataService.isPatnerLedFlow = true;
              //this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
              this.appDataService.setDataForPartnerFlow();
            }

            this.appDataService.userInfoObjectEmitter.emit(this.appDataService.userInfo);
            // this.appDataService.updateWalkMeUser();
            if (sessionObj === undefined) {
              sessionObj = this.appDataService.sessionObject;
            }

            // check for rosalesteam and qual permisions and set them in qual service
            if (res.data.qualification) {
              this.qualService.qualification.dealId = res.data.qualification.dealId;
              this.qualService.qualification.qualStatus = res.data.qualification.qualStatus;
              this.qualService.setRoSalesTeamAndQualPermissions(res.data.qualification);
              if (res.data.qualification.changeSubscriptionDeal) {
                this.qualService.changeSubscriptionDeal = res.data.qualification.changeSubscriptionDeal;
              } else {
                this.qualService.changeSubscriptionDeal = false;
              }
              if (res.data.qualification.subscription && this.appDataService.displayChangeSub) {
                this.qualService.qualification.subscription = res.data.qualification.subscription;
                this.qualService.subRefID = res.data.qualification.subRefId;
              } else {
                this.qualService.qualification.subscription = {};
                this.qualService.subRefID = '';
              }
              if(res.data.qualification.partnerTeams && res.data.qualification.partnerTeams.length){ 
                this.partnerTeamsArray = res.data.qualification.partnerTeams;
              }
              if(res.data.qualification.cxTeams && res.data.qualification.cxTeams.length){
                this.qualService.qualification.cxTeams = res.data.qualification.cxTeams;
              }
              if(res.data.qualification.assurersTeams && res.data.qualification.assurersTeams.length){
                this.qualService.qualification.cxDealAssurerTeams = res.data.qualification.assurersTeams;
              }
              this.qualService.qualification.accountManagerName = res.data.qualification.am;
            }

            if (res.data.propsoal) {
              this.proposalDataService.proposalDataObject.proposalData.dealId = res.data.propsoal.dealId;
              if (res.data.propsoal.relatedSoftwareArchName) {
                this.proposalDataService.relatedSoftwareProposalArchName = res.data.propsoal.relatedSoftwareArchName;
              } else {
                this.proposalDataService.relatedSoftwareProposalArchName = null;
              }

              //Hide clone button from proposal summary incase of CX proposal
                  this.isTypeCX = false;
              if (res.data.propsoal.type ===  ConstantsService.TYPE_CX) {
                  this.isTypeCX =  true;
              }
              if (res.data.propsoal.relatedCxProposalId) {
                this.proposalDataService.relatedCxProposalId = res.data.propsoal.relatedCxProposalId;
                } else {
                this.proposalDataService.relatedCxProposalId = null; // setting to true for now
              }
              this.proposalDataService.cxProposalFlow = (res.data.propsoal.cxProposal) ? true: false;
              if(!res.data.propsoal.partnerDeal && this.appDataService.userInfo.isPartner){
                this.ciscoDealForPartner = true;
                this.messageService.displayCustomUIMessage(this.localeService.getLocalizedMessage('qual.summary.CISCO_DEAL_FOR_PARTNER_PROPOSAL'), "");
              }
              else{
              // qual name and Id are required to load list page if arch name is invalid
              this.qualService.qualification.qualID = res.data.propsoal.qualId;
              this.qualService.qualification.name = res.data.propsoal.qualificationName;
              //Commenting this code as it's unused and causing crash
           //   this.proposalDataService.proposalDataObject.noOfSuites = res.data.propsoal.suites.split(',').length;
              this.proposalDataService.proposalDataObject.existingEaDcSuiteCount = res.data.propsoal.existingEaDcSuiteCount;
              if (res.data.propsoal.archName === 'INVALID') {
                // if archName is invalid then proposal has multiple offer hence force user to split the proposal.
                this.hasMultipleOffer = true;
                this.breadcrumbsService.showOrHideBreadCrumbs(false);
                this.appDataService.showGuidemeAndSupport = false;
                this.appDataService.isReadWriteAccess = false;
              } else {
                // get and set the proposal permissions
                if (res.data.propsoal.permissions && res.data.propsoal.permissions.featureAccess &&
                  res.data.propsoal.permissions.featureAccess.length > 0) {
                  this.permissionService.proposalPermissions = new Map(res.data.propsoal.permissions.featureAccess.map(i => [i.name, i]));
                } else {
                  this.permissionService.proposalPermissions.clear();
                }
                // Set local permission for debugger
                this.permissionService.isProposalPermissionPage(true);

                // check for proposal reopen permission
                this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
               
                // check for proposal edit permission
                this.permissionService.proposalEdit = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit);
                // check for proposal adjustment user permission
                this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.proposalPermissions.has(
                  PermissionEnum.PurchaseAdjustmentPermit);
                // check for proposal edit and edit name permission and set to readwrite access
                this.appDataService.isReadWriteAccess = (this.permissionService.proposalEdit ||
                  this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName) ||
                   this.permissionService.proposalPermissions.has(PermissionEnum.ProposalViewOnly)  ) ? true : false;
                  // Based on ReadWriteAccess we are directly setting showEngageCPS
                  this.appDataService.showEngageCPS = this.appDataService.isReadWriteAccess;
                  this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS); 
                // check for showing clone button permission
                this.allowClone = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalClone);
                // check for showing doc center button permission
                this.allowDocCenter = this.permissionService.proposalPermissions.has(PermissionEnum.DocCenter);
                // check for showing previewquote button permission
                this.allowQuote = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalQuote);
                // flag to allow initiate followon
                this.appDataService.allowInitiateFollowOn = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalInitiateFollowon);

                // this.appDataService.isReadWriteAccess = (res.data.propsoal.userAccessType ===
                // ConstantsService.USER_READ_WRITE_ACCESS) ? true : false;
                sessionObj.custInfo.custName = res.data.propsoal.customerName;
                sessionObj.customerId = res.data.propsoal.prospectKey;
                sessionObj.custInfo.archName = res.data.propsoal.archName;
                this.appDataService.customerName = res.data.propsoal.customerName;
                this.appDataService.archName = res.data.propsoal.archName;
                // setting archName if security arch, set the columdefs again
                if (this.appDataService.archName === this.constantsService.SECURITY) {
                  this.securityArchitecture = true;
                } else if (this.appDataService.archName === this.constantsService.DNA) {
                  this.dnaArchitecture = true;
                }

                this.columnDefsTop = this.getColumnDefs();

                //Set original proposal id for cloned proposal
                if (res.data.propsoal.originalProposalId) {
                  this.orginalProposalID = res.data.propsoal.originalProposalId;
                }else {
                  this.orginalProposalID = '';
                }

				this.proposalDataService.proposalDataObject.proposalData.partner = res.data.propsoal.partner;
                this.proposalDataService.proposalDataObject.proposalData.archName = res.data.propsoal.archName;
                // assigning architectrue name
                this.proposalDataService.proposalDataObject.proposalData.architecture = res.data.propsoal.architecture;
                this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
                // this.appDataService.subHeaderData.moduleName = SubHeaderComponent.PROPOSAL_CREATION;
                // assigning proposal name in subHeaderData.custName bcoz
                // subHeaderData.custName is used to display proposal name in subHeader.
                this.appDataService.subHeaderData.custName = res.data.propsoal.name;
                this.proposalStatus = res.data.propsoal.status;
                // assign the status of the proposal from summary service
                this.proposalDataService.proposalDataObject.proposalData.status = res.data.propsoal.status;
               //assigning co term
               if(res.data.propsoal.coTerm && res.data.propsoal.coTerm.coTerm){
               this.proposalDataService.proposalDataObject.proposalData.coTerm = res.data.propsoal.coTerm;
                }
                this.proposalDataService.proposalDataObject.proposalData.linkId = res.data.propsoal.linkId ? res.data.propsoal.linkId : 0;
                //  set roadMapPath if proposal is complete and if proposal reopen permission is present
                if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS) {
                  this.appDataService.roadMapPath = true;
                  this.appDataService.isProposalPending = false;
                  this.appDataService.isPendingAdjustmentStatus = false;
                } else if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PENDING_APPROVAL) {
                  // set roadMapPath & withdraw request if proposal is in pending approval or pending adjustment approval status
                  this.appDataService.roadMapPath = true;
                  this.appDataService.isProposalPending = true;
                  this.appDataService.isPendingAdjustmentStatus = false;
                } else if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_IN_PROGRESS || this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_APPROVAL_SUBMISSION_PENDING || this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.PA_APPROVAL_IN_PROGRESS) {
                  this.appDataService.roadMapPath = true;
                  this.appDataService.isProposalPending = false;
                  this.appDataService.isPendingAdjustmentStatus = true;
                }
                if (this.appDataService.roadMapPath && !this.appDataService.isProposalPending && !this.appDataService.isPendingAdjustmentStatus && !this.appDataService.isReadWriteAccess && this.appDataService.userInfo.roSuperUser) {
                  this.disableReopen = true;
                }
                if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
                  this.appDataService.custNameEmitter.emit({
                    context: AppDataService.PAGE_CONTEXT.proposalSummaryStep,
                    qualId: this.qualService.qualification.qualID,
                    proposalId: this.proposalDataService.proposalDataObject.proposalId,
                    text: (this.qualService.qualification.name).toUpperCase()
                  });
                }
              }
              }
              if (!Object.keys(this.appDataService.proposalDataForWorkspace).length){
                this.proposalDataService.setProposalParamsForWorkspaceCaseInputInfo(res.data.propsoal, this.qualService.qualification.accountManagerName ,this.appDataService.customerName, true)
              }
             // this.eaService.updateUserEvent(this.proposalDataService.proposalDataObject.proposalData, this.constantsService.PROPOSAL_FS, this.constantsService.ACTION_UPSERT);
              this.eaService.updateUserEvent(res.data.propsoal, this.constantsService.PROPOSAL_FS, this.constantsService.ACTION_UPSERT);
            } else {
              this.isProposalDeleted = true;
              this.appDataService.persistErrorOnUi = true;
              //progress bar is not stoping on stage if proposal is deleted.
              this.blockUiService.spinnerConfig.unBlockUI();
              this.blockUiService.spinnerConfig.stopChainAfterThisCall();
              this.messageService.displayCustomUIMessage(this.localeService.getLocalizedMessage('proposal.summary.DELETED_PROPOSAL'), '');
            }
            if(this.isProposalDeleted || this.ciscoDealForPartner){
              this.breadcrumbsService.showOrHideBreadCrumbs(false);
               // hide guide me
              this.appDataService.showGuidemeAndSupport = false;
              this.appDataService.isReadWriteAccess = false;
            }
            // else{
            //  this.loadProposalSummary(sessionObj);
            // }
            // Set customer info
            sessionObj.userInfo = this.appDataService.userInfo;
            sessionObj.isPatnerLedFlow = this.appDataService.isPatnerLedFlow;
            sessionObj.architectureMetaDataObject = res.data.architectureMetaDataObject;

            sessionObj.isUserReadWriteAccess = this.appDataService.isReadWriteAccess;
            // check for proposal create or delete permissiona and set proposal create access in session data
            sessionObj.createAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) ||
              this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
              // set tco create access for tco 
            this.tcoDataService.tcoCreateAccess = sessionObj.createAccess;
            //this.qualService.qualification.qualStatus = res.data.qualification.qualStatus; // to set qual status from info api
            //  for future use to get and set qualification data from Info api
            // this.qualService.qualification = res.data.qualification;
            this.appDataService.setSessionObject(sessionObj);

            if (!this.isProposalDeleted && !this.hasMultipleOffer && !this.loadPE && !this.ciscoDealForPartner) {
              // when proposal is not deleted and dose not have miltiple offer then only load the proposal summary page and if it is not a cisco deal.
              this.json = {
                'data': {
                  'id': this.proposalDataService.proposalDataObject.proposalId,
                  // "userId": this.appDataService.userId,
                  'qualId': this.qualService.qualification.qualID
                }
              };
              if (!this.proposalDataService.isProposalHeaderLoaded) {
                this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
                this.proposalDataService.isProposalHeaderLoaded = true;
              }
              this.loadProposalSummary(sessionObj);
            }
			this.proposalSummaryService.getShowCiscoEaAuth();
          }
          // loadPE will we true only if we add /pe after proposal id in the URL. user will be redirected to PE page in this case.
    if (this.loadPE) {
      this.json = {
        'data': {
          'id': this.proposalDataService.proposalDataObject.proposalId,
          // "userId": this.appDataService.userId,
          'qualId': this.qualService.qualification.qualID
        }
      };
      // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if(!this.proposalDataService.isProposalHeaderLoaded){
        this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
        this.proposalDataService.isProposalHeaderLoaded = true;
      }
      
      this.backToPriceEstimate();
    }
        } catch (error) {
          //console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // this.appDataService.isReadWriteAccess is been replaced by the conditions on which we are setting 'ReadWriteAccess'.
    if (!(this.permissionService.proposalEdit ||
      this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName))) {
      this.appDataService.showEngageCPS = false;
      this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS); 
    }
    // if(this.proposalDataService.pageName === this.localeService.getLocalizedString('roadmap.proposal.PAGE_NAME')){
    //   this.messageService.clear();
    //   let index = this.localeService.getLocalizedString('roadmap.proposal.INDEX_PE');
    //   let element : HTMLElement = document.getElementById(index) as HTMLElement;
    //   element.click();
    // }

    
  }

// check purchseoptions data with the suites data and show authorization message 
checkPurchaseAuthorization(data, selectedIds) {
  if(Object.keys(data).length > 0 && data.archs){
  var purchaseAuthSuites = data.archs.filter(a => a.code === this.appDataService.archName);
  let AuthSuitesIds = [];
  //if (purchaseAuthSuites.length > 0) {
    for (const d of purchaseAuthSuites) {
      for (const s of d.suites) {
        AuthSuitesIds.push(s.suiteId);
      }
    }
    for (const id of selectedIds) {
      if (!AuthSuitesIds.includes(id)) {
        this.showAuthMessage = true;
        if(this.partnerLedFlow) {
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
        } else if(this.proposalDataService.proposalDataObject.proposalData.partner.partnerId) {
          this.appDataService.persistErrorOnUi = true;  
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.CISCO_LEAD_PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
        }

        return;
      }
    }
  //}
  } else {
    this.showAuthMessage = true;
    if(this.partnerLedFlow) {
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
    } else if(this.proposalDataService.proposalDataObject.proposalData.partner.partnerId) {
      this.appDataService.persistErrorOnUi = true;
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.CISCO_LEAD_PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
    }
  }
}

  ngOnDestroy() {
    this.blockUiService.isPollerServiceCall = false;
    this.appDataService.disableProposalRoadmap = false; 
    this.appDataService.showActivityLogIcon(false);
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.qualificationData = this.qualService.qualification;
    sessionObj.proposalDataObj = this.proposalDataService.proposalDataObject;
    this.appDataService.setSessionObject(sessionObj);
    
    if (this.isProposalDeleted || this.hasMultipleOffer) {
      this.appDataService.showGuidemeAndSupport = true;
    }
    this.appDataService.isShowFeedback = true;
    this.appDataService.persistErrorOnUi = false;
    // unsubscribe to roadmap emitter after reopening
    this.proposalSummaryService.unSubscribe();
    if(this.pollerSubscibers){
      this.pollerSubscibers.unsubscribe();
         
    }
    this.proposalPollerService.stopPollerService();  

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    // unsubscribe purchseOptionsEmitter
    if(this.subscribers.purchseOptionsEmitter){
      this.subscribers.purchseOptionsEmitter.unsubscribe();
    }

    // unsubscribe headerdataloaded
    if(this.subscribers.headerDataLoaded){
      this.subscribers.headerDataLoaded.unsubscribe();
    }
    this.proposalDataService.displayBellIcon = false;
    this.appDataService.openCaseManagementSubject.next(false);
    this.proposalDataService.clearWorkspaceCaseInputInfo();
    this.appDataService.proposalDataForWorkspace = {};
  }

  // Navigate to original proposal
  openOriginalProposal() {

      this.router.navigate(['qualifications/proposal/' + this.orginalProposalID]);

  }

  // this method will call api to get tco count
  getTcoCountNumber() {
    this.tcoApiCallService.getTcoCount(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error) {
        this.tcoCount = res.data;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // for request approval api
  requestApprovalException() {
    this.proposalSummaryService.requestApproval().subscribe((response: any) => {
      if (response && !response.error) {
        this.showReqApproval = false;
        this.copyLinkService.showMessage(this.localeService.getLocalizedString('proposal.summary.REQUEST_APPROVAL_SUCCESS'));
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }
  // to approve purchase adjustmet
  adjustmentApprove() {
    // assign approvetype to 'pa'
    this.approveExceptionService.approveType = 'pa';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {

      this.messageService.clear();
      this.ngOnInit();
    });
  }

  // to approve dc thresold exception
  dcExceptionModal() {

    this.approveExceptionService.approveType = 'dc';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });

    modalRef.result.then((result) => {

      this.messageService.clear();
      // Reload data on exception approve
      this.ngOnInit();
    });

  }

  // to approve security thresold exception
  secExceptionModal() {
    this.approveExceptionService.approveType = 'sec';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      // Reload data on exception approve
      this.messageService.clear();
      this.ngOnInit();
    });
  }

  // to approve dna thresold exception
  dnaExceptionModal() {

    this.approveExceptionService.approveType = 'dna';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });

    modalRef.result.then((result) => {

      this.messageService.clear();
      // Reload data on exception approve
      this.ngOnInit();
    });
  }

  // to approve dna thresold exception
  dnaDiscountExceptionModal() {

    this.approveExceptionService.approveType = 'dnaDiscount';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      //Reload data on exception approve
      this.messageService.clear();
      this.ngOnInit();
    });
  }


  loadProposalSummary(sessionObj?) {
    if (!this.proposalDataService.proposalDataObject.proposalId) {
      this.proposalDataService.proposalDataObject = sessionObj.proposalDataObj;
      this.qualService.qualification = sessionObj.qualificationData;
    }
    this.json = {
      'data': {
        'id': this.proposalDataService.proposalDataObject.proposalId,
        'userId': this.appDataService.userId,
        'qualId': this.qualService.qualification.qualID
      }
    };
    // if (this.securityArchitecture && !this.appDataService.roadMapPath) {
    //   this.getSuitesData();
    // }
    //this.approvalHistoryData(); // call this for approvalhistory
    this.groupApproveHistory();
    this.getSummary();
    if (this.proposalDataService.cxProposalFlow || this.proposalDataService.relatedCxProposalId){
      // call cx proposal summary APi
      this.getCxProposalSummaryData();
      
    }
    this.selectedOptions = [
      // required only for TCO page
      // {
      //   'id': 1,
      //   'name': 'Total Price Comparison'
      // },
      // {
      //   'id': 2,
      //   'name': ' Price Comparison By Suite'
      // },
      // {
      //   'id': 3,
      //   'name': 'Cumulative Cost Comparison'
      // },
      // {
      //   'id': 4,
      //   'name': ' Yearly Cost Comparison'
      // }
    ];

    if (!this.appDataService.customerID) {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      this.appDataService.customerID = sessionObject.customerId;
    }

    // this.router.events.subscribe((evt) => {
    //   if (!(evt instanceof NavigationEnd)) {
    //     return;
    //   }
    //   window.scrollTo(0,0)
    // });
    //this.proposalSummaryService.getShowCiscoEaAuth();
  }
  // this method used to call suites api and set the suites data
  getSuitesData() {
    this.reqJSON['proposalId'] = this.proposalDataService.proposalDataObject.proposalId;
    this.reqJSON['archName'] = this.appDataService.archName;
    this.suitesData = [];
    this.suiteNameArr = [];
    this.suiteIdArr = [];
    this.http.post(this.appDataService.getAppDomain + 'api/proposal/suites', this.reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          res.archs.forEach(lineItem => {
            this.suitesData = lineItem.suites.filter(isMandatory);
          });
          // console.log(this.suitesData);
          this.suiteNameArr = this.suitesData.map(a => a.name);
          this.suiteIdArr = this.suitesData.map(a => a.id); // map the mandatory suite id's from the data 

          // check the mandatory suites from response and set it to appdataservice
          if (this.securityArchitecture) {
            if (res.noOfMandatorySuitesRequired !== undefined && res.noOfMandatorySuitesRequired > -1) {
              this.appDataService.noOfMandatorySuitesrequired = res.noOfMandatorySuitesRequired;
            }
            if (res.noOfExceptionSuitesRequired) {
              this.appDataService.noOfExceptionSuitesRequired = res.noOfExceptionSuitesRequired;
            }
          }

          // to show suites message after getting the mandatory suite id's array from suites api
          this.getSuitesMessage(this.suiteIdArr);
          // console.log(this.suiteNameArr);
        } catch (error) {
          console.log(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // to check for mandatory flag and filter the data
    function isMandatory(element) {
      return (element.mandatory === true);
    }
  }

  checkBricCountryThreshold(value){
    this.blockUiService.spinnerConfig.startChain();
    const selected = (value === 'yes') ? true : false;
    this.proposalSummaryService.checkBricCountryThreshold(selected).subscribe((res: any) => {
      if(res && !res.error){
        this.loadProposalSummary();
      } else {
        this.messageService.displayMessagesFromResponse(res);
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
    });
  }

  getSummary() {

    this.proposalSummaryService.getSummary(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      this.proposalSummaryService.suitesData = '';
      this.proposalSummaryService.tcvSummaryData = [];
      this.suiteData = [];
      this.suitesArray = [];

      
      if (res && !res.error) {
        try {

            // Set flag true if request start is due and false if request start date is not due.
         // Stop user to submit proposal
         // Suite page --> Price estimation --> Summary page !!--> Submit proposal 
         this.isRequestStartDateDue = res.data.requestStartDateCurrDate;

          this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          //   if(!this.proposalDataService.isProposalHeaderLoaded){
          //     this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
          //     this.proposalDataService.isProposalHeaderLoaded = true;
          //  }
          // this.appDataService.isReadWriteAccess = (res.data.userAccessType === ConstantsService.USER_READ_WRITE_ACCESS ||
          //  this.appDataService.userInfo.rwSuperUser) ? true : false;

            // Set partner and customer gu id 
            this.qualService.loaData.partnerBeGeoId = res.data.partnerBeGeoId;
            this.qualService.loaData.customerGuId = res.data.customerGuId;
            

          if ((res.data && res.data.archsSuites && Object.keys(res.data.archsSuites).length > 0) ||
            !this.appDataService.isReadWriteAccess || this.proposalDataService.cxProposalFlow) {
            // removed hard coding for C1
            // check if user is RW or RO Super User and super user message is not displayed
            this.utilitiesService.showSuperUserMessage(this.appDataService.userInfo.rwSuperUser,
              this.appDataService.userInfo.roSuperUser, this.qualOrProposal);

            // Show error message
            if (res.data.messages && res.data.messages.length > 0) {// If any message present in response need to display.
              this.appDataService.persistErrorOnUi = true;
              this.messageService.displayMessagesFromResponse(res.data, true);
            }
            // console.log("get summary is called"+res.data.loccSigned);

            //to check and display GTC QNA
            if(res.data.gtcCompliance){
              this.gtcComplianceObj = res.data.gtcCompliance;
              this.gtcComplianceThreshold = res.data.gtcCompliance.umbrellaBricCountryThreshold;
            } else {
              this.gtcComplianceObj = {};
            }

            // to check and set loccoptional to hide locc tab 
            if (res.data.loccOptional) {
              this.loccOptional = true;
            } else {
              this.loccOptional = false;
            }

            if (!res.data.loccNotRequired) {
              this.proposalDataService.isLoccRequired = true;
            } else {
              this.proposalDataService.isLoccRequired = false;
            }

            if (res.data.brownfieldPartner) {
              this.proposalDataService.isBrownfieldPartner = true;
            } else {
              this.proposalDataService.isBrownfieldPartner = false;
            }

            //if partnerDeal is true, then only check locSignned 
            if(res.data.partnerDeal){
              this.partnerLedFlow = res.data.partnerDeal;
              if(!this.loccOptional){
                this.isLoccSigned = res.data.loccSigned;
              }
            }
            this.createProposalService.isPartnerDeal = this.partnerLedFlow;

            // disable save and continue in case the qual is IN PROGRESS
            if (res.data.qualStatus === this.constantsService.IN_PROGRESS_STATUS) {
              this.qualInProgress = false;
            } else {
              this.qualInProgress = true;
            }
            this.isDataLoaded = true;

            // setting qual status from API in case of going to proposal list
            this.qualService.qualification.qualStatus = res.data.qualStatus;

            this.qualService.buyMethodDisti = res.data.buyMethodDisti ? true : false; //set buymethod disti flag
            const is2tPartner = this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti); // set 2tpartner flag to hide distributor team 
            this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(is2tPartner , res.data.distiDeal)
            this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(res.data.buyMethodDisti,res.data.distiInitiated);
         
            // default value as false for threshhold exception
            this.thresholdException = false;

            // disable continue incase we have exception
            if (res.data.hasException && !this.proposalDataService.cxProposalFlow) {  // ordering rule exception message show from localized constant
              this.isEnableContinue = false;
              this.appDataService.persistErrorOnUi = true;
              // to stop this message for security architecure and allow other warning or error messages to be displayed if any
              if (!this.securityArchitecture && !this.appDataService.roadMapPath) {
                this.messageService.displayMessages(
                  this.appDataService.setMessageObject(
                    this.localeService.getLocalizedMessage('proposal.summary.C1_EXCEPTION_ON_SUMMARY'), MessageType.Error), true);
              }
            } else if (res.data.hasDnaWarning || res.data.hasDcWarning ||
              res.data.hasSecurityWarning) {  // DNA + DC + Security warning message show automatically from service
              this.isEnableContinue = false;
              this.thresholdException = true;
            } else if (res.data.hasPurchaseAdjusmentException) {
              this.isEnableContinue = false;
            } else if(res.data.hasDnaMaxSubscriptionDiscountException) {
              this.isEnableContinue = false;
            } else {
              this.isEnableContinue = true;
            }

            // to hide request approval button for readOnly mode, not their proposal and approver
            const secReqAccess = this.appDataService.userInfo.secThresholdExceptionApprover ||
              (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath;
            this.showReqApproval = this.thresholdException && this.securityArchitecture &&
              !secReqAccess && this.appDataService.isReadWriteAccess;


            // get the hasPurchaseAdjusmentException flag and set to purchaseAdjustmentException
            if (res.data.hasPurchaseAdjusmentException) {
              this.purchaseAdjustmentException = res.data.hasPurchaseAdjusmentException;
              if (res.data.hasPurchaseAdjusmentException === true) {
                this.appDataService.persistErrorOnUi = true; // persist error to show on UI 
                // displaying Exception Message
                this.appDataService.persistErrorOnUi = true;
                this.messageService.displayMessages(
                  this.appDataService.setMessageObject(
                    this.localeService.getLocalizedMessage('proposal.summary.PURCHASE_ADJUSTMENT_EXCEPTION'), MessageType.Warning), true);
              }
            } else {
              this.purchaseAdjustmentException = false;
            }

            if (res.data.hasDnaMaxSubscriptionDiscountException) {
              this.dnaMaxSubscriptionDiscountException = true;
            } else{
              this.dnaMaxSubscriptionDiscountException = false;
            }
            
            // check for noOfmandatory suites required and set it to use for securiry arch
            if (res.data.noOfMandatorySuitesRequired !== undefined && res.data.noOfMandatorySuitesRequired > -1) {
              this.appDataService.noOfMandatorySuitesrequired = res.data.noOfMandatorySuitesRequired;
            }
            // to check exception suite count and set the value and message
            if (res.data.noOfExceptionSuitesRequired) {
              this.appDataService.noOfExceptionSuitesRequired = res.data.noOfExceptionSuitesRequired;
            } else {
              this.appDataService.noOfExceptionSuitesRequired = 0;
            }

            // check and set selected suites form response
            if(res.data.selectedSuites) {
              this.selectedSuites = res.data.selectedSuites;
              if(this.selectedSuites.includes(51) && !this.appDataService.roadMapPath){
                this.appDataService.persistErrorOnUi = true;
                this.messageService.displayMessages(this.appDataService.setMessageObject(
                  this.localeService.getLocalizedMessage('proposal.managesuites.DC_APPD_SELECTED'), MessageType.Info), true);
              }
              if(this.selectedSuites.includes(52) && !this.appDataService.roadMapPath){
                this.appDataService.persistErrorOnUi = true;
                this.messageService.displayMessages(this.appDataService.setMessageObject(
                  this.localeService.getLocalizedMessage('proposal.managesuites.DC_THOUSANDEYE_SELECTED'), MessageType.Info), true);
              }
            }
            // load purchase options if partnerflow and purchse options api not loaded
            if (this.partnerLedFlow && !this.proposalDataService.cxProposalFlow) {
              if (!this.appDataService.isPurchaseOptionsLoaded) {
                this.proposalSummaryService.getPurchaseOptionsData();
              } else if (this.appDataService.isPurchaseOptionsLoaded && !this.appDataService.roadMapPath) { // if already loaded call the method to check and set purchse auth messahe 
                this.checkPurchaseAuthorization(this.appDataService.purchaseOptiponsData, this.selectedSuites);
              }
            }

            // to check and show save and confirm button
            if(res.data.allowCompletion){
              this.allowCompletion = true;
            } else {
              this.allowCompletion = false;
            }
            // to show submit approval button for seller flow
            if(res.data.allowExceptionSubmission){
              this.allowExceptionSubmission = true;
            } else {
              this.allowExceptionSubmission = false;
            }
            
            // check and set to show withdraw button
            if(res.data.allowExceptionWithdrawl){
              this.isShowWithDraw = true;
            } else {
              this.isShowWithDraw = false;
            }

            // check and set to show transfter disti button
            if(res.data.allowShareWtihDisti){
              this.allowShareWtihDisti = true;
            } else { 
              this.allowShareWtihDisti = false;
            }

            // check and set to show withdraw proposal button
            if(res.data.allowWithdrawSharingWithDisti){
              this.allowWithdrawSharingWithDisti = true;
            } else {
              this.allowWithdrawSharingWithDisti = false;
            }

            // if roSuperUser = true, disable Save & Confirm button for roSuperUser
            // if(this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess){
            //   this.isEnableContinue = !this.appDataService.userInfo.roSuperUser;
            // }
            // method to check and set exceptions data from response
            this.setExceptionsData(res.data);
            if(this.proposalDataService.hasLegacySuites){
              this.allowExceptionSubmission = false;
            }
            this.proposalSummaryService.suitesData = '';
            const suitesDataArray = [];
            const archs = [];
            const archsSuites = res.data.archsSuites;
            // tslint:disable-next-line:forin
            for (const archSuite in archsSuites) {
              archs.push(archSuite);
              archsSuites[archSuite].forEach(element => {
                // push each suite name into suitesArray
                this.suitesArray.push(element);
                this.proposalSummaryService.suitesData += element + ', ';
              });
              this.proposalSummaryService.suitesData = this.proposalSummaryService.suitesData.toString().substring(0,
                this.proposalSummaryService.suitesData.toString().lastIndexOf(','));
              suitesDataArray.push(this.proposalSummaryService.suitesData);
            }
            this.suiteData.push({ 'arch': archs, 'suite': suitesDataArray });
            this.proposalSummaryService.tcvSummaryData = [];
            this.summaryData = [];
            if(!this.proposalDataService.cxProposalFlow){
              res.data.tcvSummaries.forEach(element => {
                element.netTcvBeforeAdjustment = (this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)) ? '--': (element.netTcvBeforeAdjustment === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netTcvBeforeAdjustment));
                element.postPurchaseAdjustmentNetTotalPrice = (this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)) ? '--': (element.postPurchaseAdjustmentNetTotalPrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetTotalPrice));
                element.postPurchaseAdjustmentNetSoftwarePrice =(this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)) ? '--':  (element.postPurchaseAdjustmentNetSoftwarePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetSoftwarePrice));
                element.postPurchaseAdjustmentNetServicePrice = (this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)) ? '--':  (element.postPurchaseAdjustmentNetServicePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetServicePrice));
                element.purchaseAdjustmentNetSoftwarePrice = (element.purchaseAdjustmentNetSoftwarePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetSoftwarePrice));
                element.purchaseAdjustmentNetTotalAmount = (element.purchaseAdjustmentNetTotalAmount === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetTotalAmount));
                element.purchaseAdjustmentNetServicePrice = (element.purchaseAdjustmentNetServicePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetServicePrice));
                element.rampPurchaseAdjustment = (element.rampPurchaseAdjustment === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.rampPurchaseAdjustment));
                element.netSoftwarePrice = (element.netSoftwarePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netSoftwarePrice));
                element.netServicePrice = (element.netServicePrice === 0) ? '0.00'
                  : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netServicePrice));
                  element.competitivePurchaseAdjustment = (element.competitivePurchaseAdjustment === 0) ? '0.00'
                : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.competitivePurchaseAdjustment));
                element.priorPurchaseSubscription = (element.priorPurchaseSubscription === 0) ? '0.00'
                : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.priorPurchaseSubscription));
                element.priorPurchaseService = (element.priorPurchaseService === 0) ? '0.00'
                : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.priorPurchaseService));
                element.totalPurchaseAdjustment = (element.totalPurchaseAdjustment === 0) ? '0.00'
                : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.totalPurchaseAdjustment));
                // if security arch , check, format the PA value and assign it to Purchase adjustment to show the value of UI
                if (this.securityArchitecture && element.purchaseAdjustment) {
                  element.purchaseAdjustment = (element.purchaseAdjustment === 0) ? '0.00'
                    : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustment));
                } else {
                  element.purchaseAdjustment = '0.00'; // assign to "0.00" if other than security arch
                }
                if (element.name === 'Grand Total') {
                  this.proposalDataService.proposalDataObject.proposalData.netTCV = element.postPurchaseAdjustmentNetTotalPrice;
                  this.completeProposalData = element;
                }
                this.proposalSummaryService.tcvSummaryData.push({
                  'suite': element.name, 'nettcv': element.postPurchaseAdjustmentNetTotalPrice,
                  'software': element.postPurchaseAdjustmentNetSoftwarePrice, 'purchaseadj': element.totalPurchaseAdjustment,
                  'prepurchaseadj': element.netTcvBeforeAdjustment, 'service': element.postPurchaseAdjustmentNetServicePrice,
                  'csw': element.priorPurchaseSubscription, 'alc': element.purchaseAdjustmentNetTotalAmount,
                  'swss': element.priorPurchaseService, 'ramp': element.rampPurchaseAdjustment, 'comp': element.competitivePurchaseAdjustment
                });
                // set the summary data to show in financial summary page
                this.summaryData.push({
                  'name': element.name, 'postPurchaseAdjustmentNetTotalPrice': element.postPurchaseAdjustmentNetTotalPrice,
                  'postPurchaseAdjustmentNetSoftwarePrice': element.postPurchaseAdjustmentNetSoftwarePrice,
                  'purchaseAdjustment': element.totalPurchaseAdjustment, 'netTcvBeforeAdjustment': element.netTcvBeforeAdjustment,
                  'postPurchaseAdjustmentNetServicePrice': element.postPurchaseAdjustmentNetServicePrice,
                  'purchaseAdjustmentNetSoftwarePrice': element.priorPurchaseSubscription,
                  'purchaseAdjustmentNetTotalAmount': element.purchaseAdjustmentNetTotalAmount,
                  'purchaseAdjustmentNetServicePrice': element.priorPurchaseService,
                  'rampPurchaseAdjustment': element.rampPurchaseAdjustment,
                  'competitivePurchaseAdjustment': element.competitivePurchaseAdjustment
                }); 
              });
              if (this.securityArchitecture && !this.appDataService.roadMapPath && this.appDataService.noOfMandatorySuitesrequired > 0) {
                this.getSuitesData();
              }
              const removedData = this.summaryData.shift(); // to remove first element of array i.e, grandTotal
                if(this.gridApi) {
                  this.gridApi.setRowData(this.proposalSummaryService.tcvSummaryData);
                setTimeout(() => {
                //  this.gridApi.sizeColumnsToFit();
                }, 200);
              }
              this.pinnedResult = removedData; // set the pinnedresult to removeddata
            }
            // if(this.appDataService.isPatnerLedFlow && !this.appDataService.roadMapPath) {
            //   this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED'), MessageType.Warning), true);
            // }
            // to check suites count and show the error message only if security architecture and
            //  inprogress proposal with mandatorysuitesrequired count is > 0
            
          //  this.setTopPinedData(); // set the pinnedresult to show financial summary data after the summary page is loaded
              if(this.partnerTeamsArray.length && this.qualService.twoTUserUsingDistiDeal && this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS){
                this.distiPrposalSharedWith2T()
              }
              if (this.allowWithdrawSharingWithDisti || this.proposalDataService.is2TUsingDistiSharedPrposal) {
                this.appDataService.userInfo.roSuperUser = true;
                this.permissionService.proposalEdit = false;
                this.appDataService.isReadWriteAccess = false
              }
          
          } else { 
            if (!this.proposalDataService.cxProposalFlow){
              this.backToManageSuites();
            }          
          }
          // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        } catch (error) {
          console.error(error);
          this.messageService.displayUiTechnicalError(error);
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        }
      } else {
        //set all permissions to empty
        this.resetProposalPermissions();
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  // set the pinnedresult to show financial summary data after the summary page is loaded
  setTopPinedData() {
    const result = {
      name: 'Grand Total',
      netServicePrice: 0,
      netSoftwarePrice: 0,
      netTcvBeforeAdjustment: 0,
      postPurchaseAdjustmentNetServicePrice: 0,
      postPurchaseAdjustmentNetSoftwarePrice: 0,
      postPurchaseAdjustmentNetTotalPrice: 56223,
      purchaseAdjustment: 0,
      purchaseAdjustmentNetServicePrice: 0,
      purchaseAdjustmentNetSoftwarePrice: 0,
      rampPurchaseAdjustment: 0,
      competitivePurchaseAdjustment: 0
    };
    if (Object.keys(this.pinnedResult).length > 0) { // see if the data has grandTotal,set the pinned result else set the default result
      this.pinnedResult['name'] = 'Grand Total';
      this.gridApi.setPinnedTopRowData([this.pinnedResult]);
    } else {
      this.gridApi.setPinnedTopRowData([result]);
    }
  }
  // to check fro mandatory suites count and show suites count message if less and hide continue
  getSuitesMessage(mandatorySuiteArr) {
    const mandatorySelectedSuites = [];
    // compare the suites id's from summary api with that of data from suites api
    for (let i = 0; i < this.selectedSuites.length; i++) {
      // store if the array has the respective suites
      if (mandatorySuiteArr.includes(this.selectedSuites[i])) {
        mandatorySelectedSuites.push(this.selectedSuites[i]);
      }
    }
    // console.log(mandatorySelectedSuites, mandatorySelectedSuites.length);
    if (mandatorySelectedSuites.length < this.appDataService.noOfMandatorySuitesrequired) {
      if (this.appDataService.noOfExceptionSuitesRequired > 0 && this.selectedSuites.includes(38)) { // check for security tetration suite
        this.requiredSuitesSelected = true;       
      } else {
        this.isEnableContinue = false;
        this.messageService.displayMessages(this.appDataService.setMessageObject(
          this.localeService.getLocalizedString('proposal.managesuites.SUITES_MANDATORY') + this.appDataService.noOfMandatorySuitesrequired
          + this.localeService.getLocalizedString('proposal.managesuites.SUITES_SELECTION'), MessageType.Error), true);
      }
    }
    if(this.proposalDataService.hasLegacySuites){
      this.isEnableContinue = false;
      this.allowExceptionSubmission = false;
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if(this.gridApi) {
      this.gridApi.setRowData(this.getRowData());
    }
    if (!this.securityArchitecture) {
      setTimeout(() => {
      //  this.gridApi.sizeColumnsToFit();
      this.gridOptions.api.setHeaderHeight(35);
      }, 200);
    } else {
      this.gridOptions.api.setHeaderHeight(36);
    }
  }

  private createColumnDefs() {
    // related to TCO page
    // const thisInstance = this;
    // this.http.get('assets/data/tco-configuration/cisco-one/table.json').subscribe((res) => {
    //   this.columnDefs = res;
    //   this.columnHeaderList = [];
    //   for (let i = 0; i < this.columnDefs.length; i++) {
    //     if (this.columnDefs[i].children) {
    //       for (let j = 0; j < this.columnDefs[i].children.length; j++) {
    //         this.columnDefs[i].children[j].headerClass = 'child-header';
    //         if (this.columnDefs[i].children[j].headerName) {
    //           this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
    //         }
    //         if (this.columnDefs[i].children[j].valueGetter === 'totalValue') {
    //           this.columnDefs[i].children[j].valueGetter = function aPlusBValueGetter(params) {
    //             const val = params.data.hw + params.data.sw + params.data.hwService + params.data.swService;
    //             return val;
    //           };
    //         }
    //       }
    //     } else {
    //       if (this.columnDefs[i].headerName) {
    //         this.columnHeaderList.push(this.columnDefs[i].headerName);
    //       }
    //     }
    //   }

    // });
  }

  resetProposalPermissions(){
    this.allowReopen = false;
    this.permissionService.proposalEdit = false;
    this.appDataService.userInfo.purchaseAdjustmentUser = false;
    this.appDataService.isReadWriteAccess = false;
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS); 
    this.allowClone = false;
    this.allowDocCenter = false;
    this.allowQuote = false;
    this.appDataService.disableProposalRoadmap = true; // to disable roadmap for proposal in this scenario
}

// method to call api and get cx proposal summary data and if software proposal having linked CX proposal 
getCxProposalSummaryData(){
  this.proposalDataService.getCxProposalSummary().subscribe((res: any) => {
    if (res && res.data && !res.error){
      if (res.data.cxParam){ 
        this.proposalCxParams = res.data.cxParam;
        this.proposalCxPriceInfo = res.data.priceInfo;
        if(this.eaStoreService.ibRepullFeatureFlag && this.proposalDataService.cxProposalFlow){
          this.displayIbPullMsg = (res.data.cxParam.systematicIbRepullRequired) ? true : false;
        }  
        if (this.proposalCxParams.awaitingResponse) {
          if (this.proposalDataService.cxProposalFlow){          
              this.invokePollerService();
          } else {
              this.proposalDataService.invokePollerServiceForBellIcon(this.cxPriceEstimationService.getPollerServiceUrl(),this.proposalCxParams, this.proposalCxPriceInfo);
          }        
        } 
        
      }      
      if (this.proposalDataService.cxProposalFlow){
        this.setCxProposalSummaryData(res.data); // to set cx proposal summary data on grid
      }
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  });
}


invokePollerService(){
  this.pollerSubscibers = this.proposalPollerService.invokeGetPollerservice(this.cxPriceEstimationService.getPollerServiceUrl()).subscribe((res: any) => {
    this.blockUiService.isPollerServiceCall = false;
    if (res.data && res.data.cxParam ) {
      if (!res.data.cxParam.awaitingResponse){
        this.proposalPollerService.stopPollerService();
        this.setCxProposalSummaryData(res.data);
      } else if (this.proposalDataService.cxProposalFlow && this.proposalDataService.checkForCxGridRefresh(res.data, this.proposalCxParams, this.proposalCxPriceInfo)){
        this.setCxProposalSummaryData(res.data); // call the method when data present 
      }
      if(this.eaStoreService.ibRepullFeatureFlag && this.proposalDataService.cxProposalFlow){
        this.displayIbPullMsg = (res.data.cxParam.systematicIbRepullRequired) ? true : false;
      }  
    }
    if(res.data && res.data.eaStartDateUpdated){
          this.createProposalService.updateHeaderStartDate();
    }
  });
}

  // method to cx proposal summary data for grid
  setCxProposalSummaryData(data) {
    this.cxSuiteData = [];
    this.suitesArray = [];
    this.cxPricingData = [];
    this.proposalCxParams = data.cxParam;
    this.proposalCxPriceInfo = data.priceInfo;
    // to set Services Summary data for showing in summary page and financial summary page
    this.proposalDataService.setCxFinancialSummaryData(data, this.suitesArray, this.cxPricingData);
    this.completeCxProposalData = this.cxPricingData[0];
    this.cxPinnedResult = this.cxPricingData[0];
    const suitesDataArray = [];
    // check and remove the last comma
    this.proposalDataService.suitesData = this.proposalDataService.suitesData.toString().substring(0,
      this.proposalDataService.suitesData.toString().lastIndexOf(','));
    suitesDataArray.push(this.proposalDataService.suitesData);
    // set to show related Proposal Arch Name (DNA or DC) and suites on UI 
    this.cxSuiteData.push({ 'arch': ((this.proposalDataService.relatedSoftwareProposalArchName === this.constantsService.DNA) ? this.constantsService.CISCO_DNA : this.constantsService.CISCO_DATA_CENTER), 'suite': suitesDataArray });
    this.cxSummaryData = this.cxPricingData.filter(a => a.name !== 'Grand Total');
    // this.proposalDataService.cxFinancialSummaryData = this.cxSuiteData;
    if (this.gridApi) {
      this.gridApi.setRowData(this.cxPricingData);
    }
    // console.log(data, grandTotal,this.cxPricingData);
  }
  getColumnDefs() {
    // column changes for security architecture
    if (this.securityArchitecture) {
      return [
        { headerName: 'Suite', field: 'suite', suppressMenu: true, width: 330 }, // added pre adj column and chnaged the width to allign
        {
          headerName: 'Total Contract Value (Pre-One Time Discount)', field: 'prepurchaseadj',
          cellClass: 'dollar-align', suppressMenu: true, width: 278
        },
        // {
        //   headerName: 'Purchase Adjustment', field: 'purchaseadj', cellClass: 'dollar-align', suppressMenu: true, width: 262
        // },
        {
          headerName: 'One Time Discount',
          children: [
            { headerName: 'Total One Time Discount', field: 'purchaseadj', cellClass: 'dollar-align', suppressMenu: true,width: 216 },
            { headerName: 'Prior Purchase Subscription', field: 'csw', cellClass: 'dollar-align', suppressMenu: true,width: 213 },
            { headerName: 'Prior Purchase Service', field: 'swss', cellClass: 'dollar-align', suppressMenu: true,width: 204},
            { headerName: 'Net Competitive Adjustment', field: 'comp', cellClass: 'dollar-align', suppressMenu: true,width: 250 },
          ]
        },
        // {
        //   headerName: 'Net Competitive Adjustment', field: 'comp', cellClass: 'dollar-align', suppressMenu: true,width: 250
        // },
        {
          headerName: 'Total Contract Value (Post-One Time Discount)', field: 'nettcv',
          cellClass: 'dollar-align', suppressMenu: true, width: 282
        },
      ];
    } else if (this.dnaArchitecture) {
      return [
        { headerName: 'Suite', field: 'suite', suppressMenu: true, width: 276, pinned: true  },
        {
          headerName: 'Total Contract Value(Post-One Time Discount)',
          children: [
            { headerName: 'Net Total Amount', field: 'nettcv', cellClass: 'dollar-align', suppressMenu: true,width: 169 },
            { headerName: 'Net Software Amount', field: 'software', cellClass: 'dollar-align', suppressMenu: true,width: 207 },
            { headerName: 'Net Service Amount', field: 'service', cellClass: 'dollar-align', suppressMenu: true,width: 200 },
          ]
        },
        {
          headerName: 'One Time Discount',
          children: [
            { headerName: 'Total One Time Discount', field: 'alc', cellClass: 'dollar-align', suppressMenu: true,width: 194 },
            { headerName: 'Prior Purchase Subscription', field: 'csw', cellClass: 'dollar-align', suppressMenu: true,width: 188 },
            { headerName: 'Prior Purchase Service', field: 'swss', cellClass: 'dollar-align', suppressMenu: true,width: 185 },
            { headerName: 'Ramp One Time Discount', field: 'ramp', cellClass: 'dollar-align', suppressMenu: true,width: 220 },
            { headerName: 'Net Competitive Adjustment', field: 'comp', cellClass: 'dollar-align', suppressMenu: true,width: 250 },
          ]
        },
      ];
    } else if((this.appDataService.archName === this.constantsService.DC)){
      return [
        { headerName: 'Suite', field: 'suite', suppressMenu: true, width: 314, pinned: true },
        {
          headerName: 'Total Contract Value(Post-One Time Discount)',
          children: [
            { headerName: 'Net Total Amount', field: 'nettcv', cellClass: 'dollar-align', suppressMenu: true,width: 223 },
            { headerName: 'Net Software Amount', field: 'software', cellClass: 'dollar-align', suppressMenu: true,width: 219 },
            { headerName: 'Net Service Amount', field: 'service', cellClass: 'dollar-align', suppressMenu: true,width: 221 },
          ]
        },
        {
          headerName: 'One Time Discount',
          children: [
            { headerName: 'Total One Time Discount', field: 'alc', cellClass: 'dollar-align', suppressMenu: true,width: 216 },
            { headerName: 'Prior Purchase Subscription', field: 'csw', cellClass: 'dollar-align', suppressMenu: true,width: 213 },
            { headerName: 'Prior Purchase Service', field: 'swss', cellClass: 'dollar-align', suppressMenu: true,width: 204},
            { headerName: 'Ramp One Time Discount', field: 'ramp', cellClass: 'dollar-align', suppressMenu: true,width: 220 },
            { headerName: 'Net Competitive Adjustment', field: 'comp', cellClass: 'dollar-align', suppressMenu: true,width: 250 },
          ]
        },
      ];
    } else { // update metdata for CX 
      return [
        { headerName: 'Suite', field: 'name', suppressMenu: true, width: 276, pinned: true, cellRenderer: 'suiteCellRenderer'   },
        {
          headerName: 'Total Contract Value(Post-One Time Discount)',
          children: [
            { headerName: 'Net Total Amount', field: 'netTotalServiceAmount', cellClass: 'dollar-align', suppressMenu: true,width: 169 },
            { headerName: 'Net Hardware Solution Support Amount', field: 'hwServiceAmount', cellClass: 'dollar-align', suppressMenu: true,width: 207 },
            { headerName: 'Net Software Solution Support Amount', field: 'swServiceAmount', cellClass: 'dollar-align', suppressMenu: true,width: 200 },
          ]
        },
        {
          headerName: 'One Time Discount',
          children: [
            { headerName: 'Total One Time Discount', field: 'totalPA', cellClass: 'dollar-align', suppressMenu: true,width: 194 },
            { headerName: 'Program Migration Incentive', field: 'suiteResidualCredit', cellClass: 'dollar-align', suppressMenu: true,width: 188 },
            { headerName: 'Uncovered Asset Credit', field: 'suiteUncoveredAssetCredit', cellClass: 'dollar-align', suppressMenu: true,width: 185 },
          ]
        },
      ];
    }
  }

  getRowData() {
    return this.proposalSummaryService.tcvSummaryData;
  }

  // getbarData() {
  //   this.http.get('assets/data/tco-configuration/cisco-one/barChart.json').subscribe((res) => {
  //     this.chartData = res;
  //   });
  // }
  // ciscoOneData() {
  //   this.http.get('assets/data/tco-configuration/cisco-one/tableData.json').subscribe((res) => {
  //     this.rowData = res;
  //     this.gridOptions.api.setRowData(this.rowData);
  //     this.gridOptions.api.sizeColumnsToFit();
  //   });
  // }

  // setTopPinedData() {
  //   const result = {
  //     suite: 'Grand Total',
  //     nettcv: 0,
  //     software: 0,
  //     service: 0,
  //     csw: 0,
  //     alc: 0,
  //     swss: 0,
  //   };
  //   this.gridApi.forEachNode((node) => {
  //     if (!node.group) {
  //       totalNode(node, result);
  //     }
  //   });
  //   this.gridApi.setPinnedTopRowData([result]);
  // }

  saveProposal() {

    // questionnaire changes and commmented for further use
    // if (this.appDataService.archName === 'C1_DC')//Becuase for DNA there should  no be any condition for number of suites selected
    // {
    //   if (this.proposalDataService.proposalDataObject.noOfSuites < 2 &&
    // this.proposalDataService.proposalDataObject.existingEaDcSuiteCount === 0) {
    //     this.messageService.displayMessages(
    // this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('proposal.managesuites.MIN_DC_SUITES_ERROR'),
    //  MessageType.Error));
    //     return;
    //   }
    // }


    // Allow continue if there is no exception in proposal summary service
    if (this.allowCompletion && this.isEnableContinue) {

      const ngbModalOptionsLocal = this.ngbModalOptions;
      const modalRef = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'review-accept' });
      modalRef.componentInstance.showQualification = false;
      modalRef.result.then((result) => {
        this.proposalPollerService.stopPollerService();
        // Updated for save and confirm proposal api
        this.blockUiService.spinnerConfig.blockUI();
        this.proposalSummaryService.saveAndConfirmProposal(this.status).subscribe((response: any) => {
          try{
          if (response) {
            if (response.messages && response.messages.length > 0) {// If any message present in response need to display.
              this.appDataService.persistErrorOnUi = true;
              this.utilitiesService.sendMessage(true);// to show roadmap
              this.messageService.displayMessagesFromResponse(response);
            }
            if (!response.error) {
              
              // get and set the proposal permissions after saving proposal
              if (response.data.permissions && response.data.permissions.featureAccess &&
                response.data.permissions.featureAccess.length > 0) {
                this.permissionService.proposalPermissions = new Map(response.data.permissions.featureAccess.map(i => [i.name, i]));
              } else {
                this.permissionService.proposalPermissions.clear();
              }

              // Set local permission for debugger
              this.permissionService.isProposalPermissionPage(true);

              // console.log(this.permissionService.proposalPermissions, this.permissionService.proposalPermissions.has(
              //  PermissionEnum.ProposalEdit),this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen));
              this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
              this.permissionService.proposalEdit = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit);
              this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.proposalPermissions.has(
                PermissionEnum.PurchaseAdjustmentPermit);

              // check for showing clone button permission
              this.allowClone = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalClone);
              // check for showing doc center button permission
              this.allowDocCenter = this.permissionService.proposalPermissions.has(PermissionEnum.DocCenter);
              // check for showing previewquote button permission
              this.allowQuote = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalQuote);
              // set tco create access for tco 
              this.tcoDataService.tcoCreateAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
              this.appDataService.roadMapPath = true;
              this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSuccess;
              // Show proposal success message when we get success from service
              this.Proposalsuccess = true;
              // call this method after the proposal saved
              this.getTcoCountNumber();
              this.proposalDataService.proposalDataObject.proposalData.status = this.constantsService.QUALIFICATION_COMPLETE;
              this.appDataService.subHeaderData.subHeaderVal[4] = this.constantsService.QUALIFICATION_COMPLETE;
              this.proposalDataService.proposalDataObject.proposalData.eaStartDateFormed = response.data.eaStartDateDdMmmYyyyStr;

              // fix to update the status of the proposal to Complete after save n confirm for cross architecture scenario
              if (this.appDataService.subHeaderData.subHeaderVal[6]) {// halinkedProposals
                this.appDataService.updateCrossArchitectureProposalStatusforHeader(this.constantsService.QUALIFICATION_COMPLETE);
              }
            }
            // this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
          }
          this.blockUiService.spinnerConfig.unBlockUI();
        } catch(error){
          this.messageService.displayUiTechnicalError(error);
          this.blockUiService.spinnerConfig.unBlockUI();
        }
        });
      });
    }
  }


  deepLinktoQualification() {

    this.router.navigate(['./qualifications/' + this.qualService.qualification.qualID]);
  }

  viewProposal() {
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS); 
    this.proposalDataService.listProposalData.isToggleVisible = true;
    this.router.navigate(['qualifications/proposal']);
  }

  generateQuote() {

    this.router.navigate(['bom'], { relativeTo: this.route });
  }

  tcoList() {
    this.router.navigate(['tco'], { relativeTo: this.route });
  }

  tcoModelling() {
    // this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    const modalRef = this.modalVar.open(CreateTcoComponent, { windowClass: 'create-tco' });
    modalRef.componentInstance.isUpdateTCO = false;
    modalRef.componentInstance.headerMessage = this.localeService.getLocalizedString('tco.list.edit.CREATE_NEW_TCO');
    modalRef.result.then((result) => {
      if (result && result.tcoCreated === true) {
        this.tcoDataService.isHeaderLoaded = true;
        this.router.navigate(['qualifications/proposal/' +
          this.proposalDataService.proposalDataObject.proposalId + '/tco/' + this.tcoDataService.tcoId]);
      }
    });
  }

  backToManageSuites() {
    this.roadMap.eventWithHandlers.backToManageSuites();
  }

  backToPriceEstimate() {
    this.roadMap.eventWithHandlers.backToPriceEstimate();
  }

  // backToTCO() {
  //   this.roadMap.eventWithHandlers.backToTCO();
  // }

  back() {
    this.roadMap.eventWithHandlers.backToPriceEstimate();
  }


  getTotalPriceGraphData() {
    // related to TCO page
    // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.rowData = new Array<any>();
    this.tcoConfigurationService.getTotalPriceGraphData().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.chartData = this.prepareTotalPriceGraphData(res.data);
        } catch (error) {
          console.error(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  prepareTotalPriceGraphData(data: any) {
    // related to TCO page
    const totalPriceGrapaArray = new Array<any>();
    if (data && data.length > 0) {
      const size = data.length;
      for (let i = 0; i < size; i++) {
        const totalPriceData = data[i];
        if (totalPriceData.prices) {
          const pricesObj = totalPriceData.prices;
          /*
          *   This object is for display below table
          */
          const totalPriceTableData = {
            'buyingModel': totalPriceData.description,
            'hw': this.utilitiesService.formatValue(pricesObj.hardwarePrice),
            'hwService': this.utilitiesService.formatValue(pricesObj.hardwareServicePrice),
            'sw': this.utilitiesService.formatValue(pricesObj.softwarePrice),
            'swService': this.utilitiesService.formatValue(pricesObj.softwareServicePrice),
            'totalValue': this.utilitiesService.formatValue(pricesObj.totalPrice)
          };
          this.rowData.push(totalPriceTableData);
          /*
           *   This object is for display total price comparison graph.
          */
          const totalPriceGraphData = {
            'quarter': totalPriceData.description,
            'areas': [{
              'freq': {
                'Attach': this.utilitiesService.getFloatValue(pricesObj.totalPrice),
              }
            }]
          };
          totalPriceGrapaArray.push(totalPriceGraphData);
        }
      }
    }
    if(this.gridApi) {
      this.gridApi.setRowData(this.rowData);
    }
    setTimeout(() => {
     // this.gridOptions.api.sizeColumnsToFit();
    }, 200);
    return totalPriceGrapaArray;
  }

  documentCenter() {
    this.proposalDataService.updateSessionProposal();
    // this.qualService.updateSessionQualData();
    this.router.navigate(['document'], { relativeTo: this.route });
  }

  closeInfo() {
    this.showInfo = false;
  }

  copyProposal() {

    this.appDataService.proposalIdToClone = this.proposalDataService.proposalDataObject.proposalId;
    this.viewProposal();

    // const proposalId = this.proposalDataService.proposalDataObject.proposalId;

    // this.listProposalService.copyProposal(proposalId).subscribe((res: any) => {
    //   if (res && !res.error) {
    //     if(res.messages && res.messages.length > 0){
    //       this.messageService.displayMessages(res);
    //     }
    //     try {
    //          this.viewProposal();
    //     } catch (error) {
    //       console.error(error);
    //       this.messageService.displayUiTechnicalError(error);
    //     }
    //   }
    // });
  }

  // addFlotValue(num1, num2){
  //  if(num1 === "0.00" && num2 === "0.00"){
  //     return "0.00";
  //  } else if(num1 === "0.00"){
  //     return num2.replace('-',"");
  //   } else if(num2 === "0.00"){
  //     return num1;
  //   } else{
  //     return this.utilitiesService.formatValue(
  // this.utilitiesService.getFloatValue(""+(parseFloat(num1.replace(/,/g,''))-parseFloat(num2.replace(/,/g,''))))) ;
  //   }

  // }

  slpitProposal() {
    this.proposalSummaryService.splitProposal(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        } else if (res.data && res.data.groupId) {
          this.proposalDataService.recentlySplitGroupId = res.data.groupId;
          // after split redirect user to proposal List page.
          this.viewProposal();
        }
      }
    });
  }

  reopenProposal() {
    this.proposalSummaryService.reopenProposal();
    // subscibe to emitter to get value of roadmappath
    this.subscribers.roadMapEmitter = this.proposalSummaryService.roadMapEmitter.subscribe((roadMapPath: any) => {
      // if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        // enable the form to be editable
        this.roadMap.eventWithHandlers.backToManageSuites();
      }
    });
  }


  // method to call and set approvalhistory if present
  approvalHistoryData() {
    this.proposalSummaryService.approverHistory().subscribe((res: any) => {
      if (res && !res.error) {
        if (res.data) {
          this.exceptionApprovalHistory = res.data;
        } else {
          this.exceptionApprovalHistory = [];
          this.displayApprovalHistory = false;
          this.displayApproverHistory = false;
        }
        //console.log(res, this.exceptionApprovalHistory);
      } else {
        this.exceptionApprovalHistory = []
        this.displayApprovalHistory = false;
        this.displayApproverHistory = false;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to get and set approver history data 
  groupApproveHistory() {
    this.proposalSummaryService.groupLevelApproverHistory().subscribe((res: any) => {
      if (res && !res.error) {
        if (res.data) {
          this.groupExceptionApproverHistory = res.data;
          //console.log(this.groupExceptionApproverHistory);
        } else {
          this.groupExceptionApproverHistory = [];
          this.displayApprovalHistory = false;
          this.displayApproverHistory = false;
        }
      } else {
        this.groupExceptionApproverHistory = []
        this.displayApprovalHistory = false;
        this.displayApproverHistory = false;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  // method to set and show message if user becomes approver
  becomeApprover(event){
    this.isBecomeApprover = event.hasActioned;
    const data = event.exceptionsSelected;
    if(data.includes("PURCHASE_ADJUSTMENT_REQUEST")){ // check for PA req and show respective message
      this.appDataService.userInfo.purchaseAdjustmentUser = true; // give PA access to approver
      this.isSelectedPaRequestException = true;
    }
    //console.log(event, data, this.isSelectedPaRequestException)
  }

  // method to show success page, messages and update proposal status
  submitApprover(event) {
    // console.log(event);
    this.pendingExceptionData = event.pendingExceptions; // store pending exceptions
    this.exceptionStatusData = event.data; // store the data from submitted
    this.isSubmittedDecision = event.submittedDecision; // to show submission message
    this.decisionSelected = event.decisionType; // to set decision type
    this.utilitiesService.sendMessage(false);
    this.appDataService.roadMapPath = true;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSuccess;
    // Show proposal success message when we get success from service
    this.Proposalsuccess = true;
    //this.displayApproverHistory = true; // show approver history
    // check for lenght fo pending exceptions present , decision type and change status respectively
    if (this.pendingExceptionData.length === 1) {
      if(this.decisionSelected === 'APPROVED'){
        this.setproposalStatus(this.constantsService.QUALIFICATION_COMPLETE);
      } else {
        this.setproposalStatus(this.constantsService.IN_PROGRESS_STATUS);
      }
    } else if (this.pendingExceptionData.length > 1) {
      if(this.decisionSelected === 'APPROVED'){
        this.setproposalStatus(this.constantsService.PENDING_APPROVAL);
      } else {
        this.setproposalStatus(this.constantsService.IN_PROGRESS_STATUS);
      }
    }
  }


  submitApproverBulk(event) {
    //console.log(event);
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.blockUiService.spinnerConfig.unBlockUI();
    this.pendingExceptions = event.pendingExceptions;
    //this.pendingExceptionData = event.pendingExceptions; // store pending exceptions
    this.exceptionStatusData = event.data; // store the data from submitted
    this.isSubmittedDecision = event.submittedDecision; // to show submission message
    this.decisionSelected = event.decisionType; // to set decision type
    this.utilitiesService.sendMessage(false);
    this.appDataService.roadMapPath = true;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSuccess;
    // Show proposal success message when we get success from service
    this.Proposalsuccess = true;
    this.showApproverButton = false; // to hide become approver button after submitting decision
    //this.displayApproverHistory = true; // show approver history
    this.isApproverDecisionSubmitted = true;
    this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
    this.proposalDataService.isProposalHeaderLoaded = true;
  }

  // method to update the status of propsoal in the header 
  setproposalStatus(status){
    this.proposalDataService.proposalDataObject.proposalData.status = status;
    this.appDataService.subHeaderData.subHeaderVal[4] = status;
    if (this.appDataService.subHeaderData.subHeaderVal[6]) {// haslinkedProposals
      this.appDataService.updateCrossArchitectureProposalStatusforHeader(status);
    }
  }

  // method to set exceptonsdata coming from service
  setExceptionsData(data) { 
    if (data.exceptionActivities && data.exceptionActivities.length > 0) {
      this.setApprovalFlow(data.exceptionActivities); // check and set approval flow
      //console.log(this.isApprovalFlow);
      this.exceptionStatusData = data.exceptionActivities;
      this.isExceptionStatusPresent = true;
      this.delistingCxException = false;
      if (!this.isShowWithDraw) {
        for (const d of this.exceptionStatusData) {
          if (d.status === "NEW" || d.status === "new") {
            this.displayApprovalHistory = false; // to show approval history if new exceptions are present
            this.isShowSelectReason = true;
            // console.log('test', d)
            break;
          }
        }
      } else {
        this.permissionService.proposalEdit = false;
      }
      this.setDelistingExceptionMessage(); // check for delisting exception
    } else { // id no data present set to empty and show approval history if present
      this.exceptionStatusData = [];
      this.displayApprovalHistory = true;
      this.isExceptionStatusPresent = false;
    }
  }
  
  // method to check and set approval flow
  setApprovalFlow(exception) {
    for (const data of exception) {
      //console.log(data, data.allowedToBecomeApprover && data.status !=='NEW')
      if (data.allowedToBecomeApprover && data.status !=='NEW') { // check for allowed action and if status in not new
        this.isApprovalFlow = true
       // console.log('test');
        return;
      }
    }
  }

  // to check and set delisting exception message before submitting for approval
  setDelistingExceptionMessage() {
    for (const d of this.exceptionStatusData) {
      if ((d.status === "NEW" || d.status === "new") && (d.exceptionType === this.constantsService.DELISTING_CX_EXCEPTION) ) {
        this.delistingCxException = true;
      }
    }
  }

  pendingForMyApproval(){
    this.appDataService.pendingForTeamApproval = true;
    this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
    sessionObject.pendingForMyApproval = this.appDataService.pendingForMyApproval;
    sessionObject.pendingForTeamApproval = this.appDataService.pendingForTeamApproval;
    sessionObject.whereIAmApprover = this.appDataService.whereIAmApprover;
    this.proposalDataService.listProposalData = { data: [], isCreatedByMe: true, isToggleVisible: true }
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.subHeaderData.moduleName = ''
    this.appDataService.pageContext = ''
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.router.navigate(['/proposal']);
  }
  // method to call initiate exception request and set data 
  initiateExceptionRequestData(){
    this.proposalSummaryService.initiateExceptionRequest().subscribe((res:any) => {
      if(res && res.data && !res.error){
          this.selectException(res.data); // set exception data from api to modal
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  // method to switch status of requested exceptions and approval history
  switchShowStatus(event){
    this.isShowStatus = !this.isShowStatus;
    this.isSwitched = true;
  }

  // method to reload summary page after case number is submitted
  reloadSummary($event){
    this.messageService.clear();
    this.ngOnInit();
  }
  // method set set exception data and show in modal to select reasons & comment for exceptions
  selectException(data) {
    const modalRef = this.modalVar.open(SelectExceptionComponent, { windowClass: 'submit-approval-modal' });
    modalRef.componentInstance.exceptionDataObj = data;
    modalRef.result.then((result) => {
      //console.log(result)
      // after result set the request obj
      const requestObj = {data:{}};
      if(result.continue === true){
        // if submit , set the request obj to local obj and show submit for approval button
        requestObj.data = result.requestData;
        this.submitRequestObj = requestObj;
        //this.isExceptionSubmitted = false;
        this.isExceptionWithdrawn = false;
        this.submitException();
      }
    });
  }

  
  distiPrposalSharedWith2T(){
    for(let i = 0; i < this.partnerTeamsArray.length; i++ ){
      if(this.partnerTeamsArray[i].ccoId === this.appDataService.userId){
        this.proposalDataService.is2TUsingDistiSharedPrposal = true;
        this.allowDocCenter = true;
        this.allowQuote = true;
        break;
      }
    }
  }
  withdrawFromDistributor(){
    this.proposalSummaryService.shareWithDistributor(false).subscribe((response: any) => {
      if (response && !response.error) {
        this.allowWithdrawSharingWithDisti = !this.allowWithdrawSharingWithDisti;
        this.allowShareWtihDisti = !this.allowShareWtihDisti;
        this.appDataService.isReadWriteAccess = true;
        this.permissionService.proposalEdit = true;
        
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  shareWithDistributor() {
    const modalRef = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'review-accept' });
    modalRef.componentInstance.showQualification = false;
    modalRef.componentInstance.shareWithDisti = true;
    modalRef.result.then((result) => {
      this.proposalSummaryService.shareWithDistributor(true).subscribe((response: any) => {
        if (response && !response.error) {
          this.allowWithdrawSharingWithDisti = !this.allowWithdrawSharingWithDisti;
          this.allowShareWtihDisti = !this.allowShareWtihDisti;
          this.appDataService.userInfo.roSuperUser = true;
          this.permissionService.proposalEdit = false;
          this.appDataService.isReadWriteAccess = false;
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    });
}
  // method to submit for approval api
  submitException() {
    //this.isEnableContinue = true;
    this.status = 'Pending Approval';
      // call submit exception request api and send the selected reasons for exception
      this.proposalSummaryService.submitExceptionRequest(this.submitRequestObj).subscribe((response: any) => {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
        if (response && response.data && !response.error) {
          this.utilitiesService.sendMessage(false);
          // show withdraw button, show success page and show status of requested exceptions
          this.isExceptionSubmitted = true;
          this.isShowWithDraw = true;
          this.exceptionStatusData = response.data;
          this.displayApprovalHistory = false;
          this.isExceptionStatusPresent = true;
          this.appDataService.roadMapPath = true;
          this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSuccess;
          // Show proposal success message when we get success from service
          this.Proposalsuccess = true;
        // call header api again to load the proposal status
        this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
        this.proposalDataService.isProposalHeaderLoaded = true;
        } else {
          this.exceptionStatusData = [];
          this.displayApprovalHistory = true;
          this.messageService.displayMessagesFromResponse(response);
        }
      });
   // });
  }

  // method to submit PA Exception , for further use
  submitPurchaseAdjException() {
    this.status = 'Pending Approval';
    const ngbModalOptionsLocal = this.ngbModalOptions;
    // open review and accept modal to submit exception for proposal
    const modalRef = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'review-accept' });
    modalRef.componentInstance.showQualification = false;
    modalRef.result.then((result) => {
      this.isExceptionSubmitted = false;
      this.isShowWithDraw = true;
      this.isExceptionStatusPresent = true;
      this.appDataService.roadMapPath = true;
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSuccess;
      // Show proposal success message when we get success from service
      this.Proposalsuccess = true;
      this.proposalDataService.proposalDataObject.proposalData.status = this.constantsService.PENDING_APPROVAL;
      this.appDataService.subHeaderData.subHeaderVal[4] = this.constantsService.PENDING_APPROVAL;

      // fix to update the status of the proposal to Complete after save n confirm for cross architecture scenario
      if (this.appDataService.subHeaderData.subHeaderVal[6]) {// halinkedProposals
        this.appDataService.updateCrossArchitectureProposalStatusforHeader(this.constantsService.PENDING_APPROVAL);
      }
    });
  }
  // method to call withdraw request api
  withDrawRequest(type) {
    const modalRef = this.modalVar.open(WithdrawExceptionRequestComponent, { windowClass: 'withdraw-request-modal' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.blockUiService.spinnerConfig.blockUI();
        this.proposalSummaryService.withDrawException().subscribe((res: any) => {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
         if (res && !res.error) {
          // show select request button 
          this.isShowWithDraw = false;
          this.isExceptionSubmitted = false;
          this.isExceptionWithdrawn = true;
          this.isShowSelectReason = true;
          this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalSummaryStep;
          this.Proposalsuccess = false;
          // this.appDataService.roadMapPath = false;
          // this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
          // this.proposalDataService.isProposalHeaderLoaded = true;
          // if success page show roadmap again
          if (type === 'successPage') {
            this.utilitiesService.sendMessage(true);
          }
          this.ngOnInit(); // recall the page
          // // call summary api to get updated exception activities
          // this.getSummary();
          // });
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    }).catch(error => {
      // console.log("Error:", error);
    });
  }

  //Switch to SW/CX-Proposal
  openCXProposal(proposalId) {
    const index = window.location.href.lastIndexOf('/')
    const url = window.location.href.substring(0, index + 1)
    window.open(url + proposalId , '_self');
    window.location.reload()
  }

  // showServiceModal(){
  //   const modalRef = this.modalVar.open(ManageServiceSpecialistComponent, {
  //     windowClass: "manage-service-specialist"
  //   });
  // }
}

// function sumOfNodes(nodes) {
//   const result = {
//     suite: 'Grand Total',
//     nettcv: 0,
//     software: 0,
//     service: 0,
//     csw: 0,
//     alc: 0,
//     swss: 0,
//   };
//   nodes.forEach(function (node) {
//     totalNode(node, result);
//   });
//   return result;

// }

// function totalNode(node, result) {
//   const data = node.group ? node.aggData : node.data;
//   if (typeof data.nettcv === 'number') {
//     result.nettcv += data.nettcv;
//   }
//   if (typeof data.software === 'number') {
//     result.software += data.software;
//   }
//   if (typeof data.service === 'number') {
//     result.service += data.service;
//   }
//   if (typeof data.csw === 'number') {
//     result.csw += data.csw;
//   }
//   if (typeof data.alc === 'number') {
//     result.alc += data.alc;
//   }
//   if (typeof data.swss === 'number') {
//     result.swss += data.swss;
//   }
// }

