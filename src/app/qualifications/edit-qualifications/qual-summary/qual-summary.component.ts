import { WhoInvolvedService } from './../who-involved/who-involved.service';
import { Component, OnInit, OnDestroy ,ViewChild, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QualSummaryService } from './qual-summary.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { ReviewAcceptComponent } from '@app/modal/review-accept/review-accept.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { IRoadMap } from '@app/shared';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { ProposalDataService } from '../../../proposal/proposal.data.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageType } from '../../../shared/services/message';
import { BreadcrumbsService } from '@app/core/breadcrumbs/breadcrumbs.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { Subscription } from 'rxjs';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ChangeDealIdComponent } from '@app/modal/change-deal-id/change-deal-id.component';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { EaService } from 'ea/ea.service';


@Component({
    selector: 'app-qual-summary',
    templateUrl: './qual-summary.component.html',
    styleUrls: ['./qual-summary.component.scss']
})
export class QualSummaryComponent implements OnInit, OnDestroy {
    roadMap: IRoadMap;
    involvedSpecialist = [];
    involvedMembers = [];
    involvedCxteam = []
    involvedDealAssurer = [];
    involvedDistributorMembers = [];
    partnerTeamMembers = [];
    selectedGeography = [];
    selectedAffiliates = [];
    excludedAffiliates = [];
    excludedGeography = [];
    excludedSubsidiaries = [];
    excludedGus = [];
    excludedGuIds = []; // to store selected/included GUs
    qualificationSuccess = false;
    isCreatedbyQualView = true;
    disableSaveButton = false;
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };
    showInfo = true;
    deletedQual = false;
    qualOrProposal = 'qualification';
    subscribers: any = {};
    is2tPartner = false;
    twoTUserUsingDistiDeal = false;

    loadManageAffiliates: any;
    summaryDataLoaded = false;
    partnerFlow = false; // this flag to use for partner Deal
    private paramsSubscription: Subscription;
    camData: any;
    ciscoDealForPartner = false;
    isChangeSubFlow = false;
    guIdMap = new Map<number,any>();
    popStyle = {};
    showOnTop = false;
    arrowStyles: any = {};
    @ViewChild('downloadZipLink', {static: false}) private downloadZipLink: ElementRef;
    opened = false;
    selectedNodeBranches = [];
    selectedRow = {};
    selectedType = '';
    guIdArray = [];
    columns: any[] = [// this will be passed to subsidiary-list comp.
        {
          headerName: 'Party Name',
          field: 'name',
          suppressMenu: true,
          cellRenderer: 'gridCell',
          width: 176
        },
        {
          headerName: 'Node Type',
          field: 'type',
          suppressMenu: true,
          width: 80
        },
        {
          headerName: 'Party ID',
          field: 'id',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'Address',
          'children': [
           
            {
              headerName: 'City',
              field: 'city',
            //  cellClass: 'dollar-align',
              cellRenderer: 'gridCell',
              suppressMenu: true,
              width: 120
            },
            {
              headerName: 'Postal Code',
              field: 'postalCode',
             // cellClass: 'dollar-align',
              suppressMenu: true,
              width: 120
            },
            {
              headerName: 'State',
              field: 'state',
             // cellClass: 'dollar-align',
              cellRenderer: 'gridCell',
              suppressMenu: true,
              width: 120
            },
            {
              headerName: 'Country/Region',
              field: 'country',
             // cellClass: 'dollar-align',
              cellRenderer: 'gridCell',
              suppressMenu: true,
              width: 129
            }
          ]
        }
      ];


    constructor(public localeService: LocaleService, private router: Router, public qualService: QualificationsService,
        public proposalDataService: ProposalDataService, private qualSummaryService: QualSummaryService, private eaService: EaService,
        public utilitiesService: UtilitiesService, public blockUiService: BlockUiService, public messageService: MessageService,
        public appDataService: AppDataService, public permissionService: PermissionService,private elementRef: ElementRef,
        private createProposalService: CreateProposalService, private involvedService: WhoInvolvedService, private modalVar: NgbModal,
        public constantsService: ConstantsService, private breadcrumbsService: BreadcrumbsService, private route: ActivatedRoute) { }



    ngOnInit() {

        this.appDataService.showEngageCPS = false;
        this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
        // Deep link and url change handelled
        let isDataAlreadyLoaded = false;
        // this.partnerFlow = this.appDataService.isPatnerLedFlow;
        // hide edit icon for summary page
        this.appDataService.isProposalIconEditable = false;
        this.paramsSubscription = this.route.paramMap.subscribe(params => {
            isDataAlreadyLoaded = true;
            this.loadData();
        });

        if (!isDataAlreadyLoaded) {
            this.loadData();
        }

        
        // after cloning/change deal, go To New Qual and show summary page if success page is there
        this.subscribers.loadQualSummary = this.qualService.loadQualSummaryEmitter.subscribe(() => {
            this.qualificationSuccess = false;
            this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationSummaryStep;
            this.utilitiesService.sendMessage(true);// to show roadmap
            this.qualService.qualification.qualStatus = this.constantsService.IN_PROGRESS_STATUS
            this.permissionService.qualReOpen = false;
            this.permissionService.qualEdit = true;
        });
    }

    loadData() {

        // this.appDataService.userInfo.rwSuperUser = false
        let url = this.router.url;
        let index = url.lastIndexOf('/');
        if (url.substring(index + 1) === 'manage-affiliates') {
            this.loadManageAffiliates = true;
            this.appDataService.isSuperUserMsgDisplayed = true;
        }

        // loadManageAffiliates will we true only if we add /manage-affiliates after qualification id in the URL. user will be redirected to affiliates page in this case.
        if (this.loadManageAffiliates) {
            this.backToAffiliates();
        }

        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationSummaryStep;
        this.appDataService.showActivityLogIcon(true);
        // this.involvedSpecialist = this.qualService.qualification.softwareSalesSpecialist;
        // this.customerInfo = this.qualService.qualification.customerInfo.
        if (this.appDataService.userInfo.accessLevel === 0 || this.appDataService.customerName === '') {
            this.appDataService.getSessionDataForSummaryPage('q', this.qualService.qualification.qualID).subscribe((res: any) => {
                if (res && !res.error) {
                    try {
                        sessionStorage.setItem(
                            AppDataService.SESSION_OBJECT,
                            JSON.stringify(this.appDataService.sessionObject)
                        );
                        const sessionObject: SessionData = this.appDataService.getSessionObject();
                        sessionObject.architectureMetaDataObject = res.data.architectureMetaDataObject;

                        // this.appDataService.setSessionObject(sessionObject);

                        const userInfo = res.data.user;
                        if (this.appDataService.isAutorizedUser(userInfo)) {
                            this.appDataService.setUserInfoPermissions(userInfo);

                            // this.appDataService.userInfo.isProxy = false;
                            // this.appDataService.userInfo.loggedInUser = userInfo.userId;
                            // this.appDataService.userInfo.emailId = userInfo.emailId;
                            // this.appDataService.userInfo.accessLevel = userInfo.accessLevel;
                            // this.appDataService.userInfo.isPartner = userInfo.partner;

                            // // if user info has permissions and not empty assign to the value else set to empty array
                            // if (userInfo.permissions && userInfo.permissions.featureAccess &&
                            //     userInfo.permissions.featureAccess.length > 0) {
                            //     // var permissions = [];
                            //     // permissions = userInfo.permissions.featureAccess.map(a => a.name);
                            //     this.permissionService.permissions = new Map(userInfo.permissions.featureAccess.map(i => [i.name, i]));
                            //     this.appDataService.userInfo.permissions = this.permissionService.permissions;
                            //     // this.appDataService.userInfo.permissions = Array.from(this.permissionService.permissions.values());
                            // }

                            // // added for getting adminUser from permissions
                            // this.appDataService.userInfo.adminUser = this.permissionService.permissions.has(PermissionEnum.Admin);
                            // if (this.appDataService.userInfo.adminUser) {
                            //     localStorage.setItem('isAdmin', 'TRUE');
                            // } else {
                            //     localStorage.setItem('isAdmin', this.constantsService.FALSE);
                            // }

                            // // check for RoSuerUser message and set the Ro Super user 
                            // if (this.permissionService.permissions.has(PermissionEnum.RoMessage)) {
                            //     this.appDataService.userInfo.roSuperUser = true;
                            // } else {
                            //     this.appDataService.userInfo.roSuperUser = false;
                            // }

                            // // To show debugger
                            // this.appDataService.showDebugger = this.permissionService.permissions.has(PermissionEnum.Debug);

                            // // to show Change Subscription radio button
                            // this.appDataService.allowChangSub = this.permissionService.permissions.has(PermissionEnum.Change_Subscription);

                            // // flag to allow smart Subsidiaries view access
                            // this.appDataService.allowSmartSubsidiariesView = this.permissionService.permissions.has(PermissionEnum.Smart_Subsidiary);

                            // // To show activity log
                            // this.appDataService.showActivityLog = this.permissionService.permissions.has(PermissionEnum.ActivityLog);

                            // // flag to allow dna exception approval for user
                            // this.appDataService.userInfo.thresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaThreshold);

                            // // flag to allow dc exception approval for user
                            // this.appDataService.userInfo.dcThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DcThreshold);

                            // // flag to allow security exception approval for user
                            // this.appDataService.userInfo.secThresholdExceptionApprover = this.permissionService.permissions.has(PermissionEnum.SecThreshold);

                            // // flag to allow adjustment approval for user
                            // this.appDataService.userInfo.adjustmentApprover = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentApprover);

                            // // flag to allow dna exception approval for user 
                            // this.appDataService.userInfo.dnaDiscountExceptionApprover = this.permissionService.permissions.has(PermissionEnum.DnaDiscountApprover);

                            // // flag to allow user to perform purchase adjustment
                            // // this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.permissions.has(PermissionEnum.PurchaseAdjustmentPermit);

                            // if (this.permissionService.permissions.has(PermissionEnum.RwMessage)) {
                            //     this.appDataService.userInfo.rwSuperUser = true;
                            // } else {
                            //     this.appDataService.userInfo.rwSuperUser = false;
                            // }

                            // if (this.appDataService.userInfo.isPartner) {
                            //     this.appDataService.isPatnerLedFlow = true;
                            //     this.appDataService.setDataForPartnerFlow();
                            //     // this.partnerFlow = this.appDataService.isPatnerLedFlow;
                            // }

                            sessionStorage.setItem(
                                AppDataService.USERINFO_SESSION_STORAGE,
                                JSON.stringify(this.appDataService.userInfo)
                            );
                            // const sessionObj = this.appDataService.getSessionObject();
                            sessionObject.userInfo = this.appDataService.userInfo;
                            sessionObject.isPatnerLedFlow = this.appDataService.isPatnerLedFlow;
                            // Set customer info 
                            if (res.data.qualification) {
                                if (!res.data.qualification.partnerDeal && this.appDataService.isPatnerLedFlow) {
                                    this.ciscoDealForPartner = true;
                                    this.messageService.displayCustomUIMessage(this.localeService.getLocalizedMessage(
                                        'qual.summary.CISCO_DEAL_FOR_PARTNER'), '');
                                } else {
                                    this.appDataService.customerName = res.data.qualification.customerName;

                                    //custNameEmitter is to prepare breadcrumb.
                                    this.appDataService.custNameEmitter.emit({ 'text': res.data.qualification.customerName,
                                    'context': AppDataService.PAGE_CONTEXT.qualificationSummaryStep });

                                    sessionObject.custInfo.custName = res.data.qualification.customerName;
                                    sessionObject.customerId = res.data.qualification.customerId;
                                    sessionObject.custInfo.archName = res.data.qualification.archName;
                                }
                            } else {
                                this.deletedQual = true;
                                this.appDataService.persistErrorOnUi = true;
                                this.blockUiService.spinnerConfig.unBlockUI();
                                this.blockUiService.spinnerConfig.stopChainAfterThisCall();
                                this.messageService.displayCustomUIMessage(this.localeService.getLocalizedMessage(
                                    'qual.summary.DELETED_QUAL'), '');
                            }
                            // this.appDataService.userInfoObjectEmitter.emit(this.appDataService.userInfo);
                            // this.appDataService.updateWalkMeUser();
                            if (this.deletedQual || this.ciscoDealForPartner) {
                                this.breadcrumbsService.showOrHideBreadCrumbs(false);
                                this.appDataService.showGuidemeAndSupport = false;
                                this.appDataService.isReadWriteAccess = false;
                            } else {
                                this.loadSummaryData();
                            }
                        }
                        this.appDataService.setSessionObject(sessionObject);
                    } catch (error) {
                        console.error(error);
                        this.messageService.displayUiTechnicalError(error);
                    }
                } else {
                    this.messageService.displayMessagesFromResponse(res);
                }
            });
        } else {
            this.appDataService.custNameEmitter.emit({ 'text': this.appDataService.customerName,
                                    'context': AppDataService.PAGE_CONTEXT.qualificationSummaryStep });
            this.loadSummaryData();
        }
    }

    ngOnDestroy() {
        this.appDataService.showActivityLogIcon(false);
        if (this.deletedQual || this.ciscoDealForPartner) {
            this.appDataService.showGuidemeAndSupport = true;
        }
        // unsubscribe to roadmap emitter after reopening
        this.qualService.unSubscribe();

        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
    }

    loadSummaryData() {
        this.qualSummaryService.getCustomerInfo().subscribe((res: any) => {
            if (res) {
                if (res.messages && res.messages.length > 0) {
                    this.messageService.displayMessagesFromResponse(res);
                }

                if (!res.error) {
                    try {
                        const sessionObject: SessionData = this.appDataService.getSessionObject();
                        if (res.data) {

                            if (res.data.permissions && res.data.permissions.featureAccess &&
                                res.data.permissions.featureAccess.length > 0) {
                                this.permissionService.qualPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
                            } else {
                                this.permissionService.qualPermissions.clear();
                            }

                            // Set local permission for debugger
                            this.permissionService.isProposalPermissionPage(false);

                            this.qualService.setQualPermissions();

                            this.appDataService.userInfo = sessionObject.userInfo;
                            // disable the save and confirm button if roSupeUser = true
                            if (!this.permissionService.qualEdit) {
                                this.disableSaveButton = false;
                            }
                            // check if user is RW or RO Super User and super user message is not displayed 
                            // update this as we are updating service flages for super user.
                            this.utilitiesService.showSuperUserMessage(this.permissionService.permissions.has(PermissionEnum.RwMessage),
                            this.permissionService.permissions.has(PermissionEnum.RoMessage), this.qualOrProposal);

                            const data = res.data;
                            this.qualService.qualification.name = data.qualName;
                            this.qualService.qualification.qualID = data.qualId;
                            this.qualService.qualification.status = data.status;
                            this.qualService.qualification.prevChangeSubQualId = data.prevChangeSubQualId;
                            this.qualService.qualification.eaQualDescription = data.description;
                            this.qualService.qualification.createdBy = data.createdBy;
                            this.appDataService.archName = data.archName;
                            this.appDataService.customerID = data.customerId;
                            this.qualService.qualification.qualStatus = data.status;
                            this.qualService.qualification.dealInfoObj = data.deal;
                            this.qualService.qualification.partnerDeal = data.partnerDeal;
                            this.qualService.qualification.loaSigned = data.loaSigned;
                            this.partnerFlow = data.partnerDeal;
                            if (this.partnerFlow) {
                                this.qualService.qualification['partnerBEGeoId'] = data.partnerBEGeoId;
                            }
                            this.qualService.buyMethodDisti = data.buyMethodDisti ? true : false; // set buyMethodDisti flag
                            this.is2tPartner = this.qualService.buyMethodDisti; // set 2tpartner flag to hide distributor team 

                            this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(this.is2tPartner , data.distiDeal)//(this.is2tPartner && data.distiDeal) ? true : true;
                            this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(res.data.buyMethodDisti,res.data.distiInitiated);
         
                            if (data.changeSubscriptionDeal) {
                                this.qualService.changeSubscriptionDeal = data.changeSubscriptionDeal;
                            } else {
                                this.qualService.changeSubscriptionDeal = false;
                            }
                            if (data.subscription && this.appDataService.displayChangeSub) {
                                this.qualService.qualification.subscription = data.subscription;
                                this.qualService.subRefID = data.subRefId;
                            } else {
                                this.qualService.qualification.subscription = {};
                                this.qualService.subRefID ='';
                            }

                            // set change sub flow
                            if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
                                this.isChangeSubFlow = true;
                              } else {
                                this.isChangeSubFlow = false;
                              }
                            this.summaryDataLoaded = true;
                            // to set isProposalIconEditable as false if qual status is Complete
                            // this.appDataService.isProposalIconEditable = this.qualService.qualification.qualStatus !== this.constantsService.COMPLETE_STATUS ? true : false;

                            //this.appDataService.custNameEmitter.emit({ 'text': this.appDataService.customerName,
                            //'qualId': this.qualService.qualification.qualID, 'context': AppDataService.PAGE_CONTEXT.qualificationSummaryStep });

                            if (data.federalCustomer) {
                                this.qualService.qualification.federal = data.federalCustomer === 'Y' ? 'yes' : 'no';
                            } else {
                                this.qualService.qualification.federal = 'no';
                            }

                            if (data.saleSpecialist) {
                                this.involvedSpecialist = data.saleSpecialist;
                                this.qualService.qualification.softwareSalesSpecialist = data.saleSpecialist;
                                // adding extendedsalesTeam value in session
                                sessionObject.qualificationData.softwareSalesSpecialist = this.involvedSpecialist;
                                for (let i = 0; i < data.saleSpecialist.length; i++) {
                                    data.saleSpecialist[i].previouslyAdded = true;//add this property to check if specialist has been previously added so that we can disable checkbox when adding contacts again 
                                }
                                this.involvedService.previouslySelectedSpecialist = data.saleSpecialist;//Set previously selected speciualist to show them on add  Pop up
                            }
                            if (data.extendedSalesTeam) {
                                this.involvedMembers = data.extendedSalesTeam;
                                this.qualService.qualification.extendedsalesTeam = data.extendedSalesTeam;
                                // adding extendedsalesTeam value in session
                                sessionObject.qualificationData.extendedsalesTeam = this.involvedMembers;

                            }
                            if (data.cxTeams) {
                                this.involvedCxteam = data.cxTeams;
                                this.qualService.qualification.cxTeams = data.cxTeams;
                                // adding extendedsalesTeam value in session
                                sessionObject.qualificationData.cxTeams = this.involvedCxteam;

                            }
                            if (data.assurersTeams) {
                                this.involvedDealAssurer = data.assurersTeams;
                                this.qualService.qualification.cxDealAssurerTeams = data.assurersTeams;
                                // adding extendedsalesTeam value in session
                                sessionObject.qualificationData.cxDealAssurerTeams = this.involvedDealAssurer;

                            }

                            if (data.distiTeams) {
                                this.involvedDistributorMembers = data.distiTeams;
                                this.qualService.qualification.distributorTeam = data.distiTeams;
                                // adding extendedsalesTeam value in session
                                sessionObject.qualificationData.distributorTeam = this.involvedDistributorMembers;
                            }

                            if (data.distiInitiated) {
                                this.qualService.qualification.distiInitiated = true;
                            }else {
                                this.qualService.qualification.distiInitiated = false;                     
                            }

                            if (data.partnerTeams) {
                                this.partnerTeamMembers = data.partnerTeams;
                                this.qualService.qualification.partnerTeam = data.partnerTeams;
                            }
                            if (data.cam) {
                                this.camData = data.cam;
                                this.qualService.qualification.cam = data.cam;
                            }
                            if (data.customerContact) {
                                // If legal name is not inputed by user assign default value as accountName
                                if (data.customerContact.preferredLegalName) {
                                    this.qualService.qualification.customerInfo.preferredLegalName = data.customerContact.preferredLegalName;
                                }  else {
                                    this.qualService.qualification.customerInfo.preferredLegalName = data.deal.accountName;
                                }

                                if (data.customerContact.fileName) {
                                    this.qualService.qualification.customerInfo.filename = data.customerContact.fileName;
                                } else {
                                    this.qualService.qualification.customerInfo.filename = '';
                                }

                                this.qualService.qualification.customerInfo.affiliateNames = data.customerContact.affiliateNames;
                                
                                if (!data.customerContact.scope || (data.customerContact.scope === '1' ||
                                data.customerContact.scope === this.constantsService.NONE)) {
                                    this.qualService.qualification.customerInfo.scope = this.constantsService.NONE;
                                } else {
                                    this.qualService.qualification.customerInfo.scope = this.constantsService.listedAffiliates;
                                }
                                // this.qualService.qualification.customerInfo.scope = data.customerContact.scope ? data.customerContact.scope : 'Listed Affiliates';
                                this.qualService.qualification.customerInfo.repEmail = data.customerContact.repEmail;
                                this.qualService.qualification.customerInfo.repName = data.customerContact.repName;
                                this.qualService.qualification.customerInfo.repTitle = data.customerContact.repTitle;
                                this.qualService.qualification.customerInfo.phoneNumber = data.customerContact.phoneNumber;
                                this.qualService.qualification.customerInfo.phoneCountryCode = data.customerContact.phoneCountryCode;
                                this.qualService.qualification.customerInfo.dialFlagCode = data.customerContact.dialFlagCode;
                            }
                            if (data.deal) {
                                this.qualService.qualification.dealInfoObj = data.deal;
                                this.qualService.qualification.dealId = data.dealId;
                                if (data.deal.quotes && data.deal.quotes.length > 0) {
                                    this.appDataService.quoteIdForDeal = data.deal.quotes[0].quoteId;
                                }
                                this.qualService.dealData.dealId = this.qualService.qualification.dealId;
                                this.qualService.dealData.dealStatus = data.deal.dealStatusDesc;
                                this.qualService.dealData.dealName = data.deal.optyName;
                                this.qualService.qualification.accountName = data.deal.accountName;
                                this.qualService.qualification.accountAddress = data.deal.accountAddress;
                                if (data.deal.accountManager) {
                                    this.qualService.qualification.accountManager.firstName = data.deal.accountManager.firstName;
                                    this.qualService.qualification.accountManager.lastName = data.deal.accountManager.lastName;
                                    this.qualService.qualification.accountManager.emailId = data.deal.accountManager.emailId;
                                    // added for getting userId of account Manager
                                    this.qualService.qualification.accountManager.userId = data.deal.accountManager.userId;
                                    this.qualService.qualification.accountManagerName = data.am;
                                }

                                this.qualService.qualification.address.addressLine1 = data.deal.accountAddressDetail.addressLine1;
                                this.qualService.qualification.address.addressLine2 = data.deal.accountAddressDetail.addressLine2;
                                this.qualService.qualification.address.city = data.deal.accountAddressDetail.city;
                                this.qualService.qualification.address.country = data.deal.accountAddressDetail.country;
                                this.qualService.qualification.address.state = data.deal.accountAddressDetail.state;
                                this.qualService.qualification.address.zip = data.deal.accountAddressDetail.zip;
                            }
                            if (data.customerContact && data.customerContact.preferredLegalAddress) {
                                this.qualService.qualification.primaryPartnerName = data.customerContact.preferredLegalAddress.primaryPartnerName;
                                this.qualService.qualification.legalInfo.addressLine1 = data.customerContact.preferredLegalAddress.addressLine1;
                                this.qualService.qualification.legalInfo.addressLine2 = data.customerContact.preferredLegalAddress.addressLine2;
                                this.qualService.qualification.legalInfo.city = data.customerContact.preferredLegalAddress.city;
                                this.qualService.qualification.legalInfo.country = data.customerContact.preferredLegalAddress.country;
                                this.qualService.qualification.legalInfo.state = data.customerContact.preferredLegalAddress.state;
                                this.qualService.qualification.legalInfo.zip = data.customerContact.preferredLegalAddress.zip;
                            }
                            // Setting user access to read/write 
                            if (!this.permissionService.qualEdit && !this.permissionService.qualPermissions.has(PermissionEnum.QualEditName) && !this.permissionService.qualPermissions.has(PermissionEnum.QualViewOnly)) {
                                this.qualService.qualification.userEditAccess = false;
                                this.appDataService.isReadWriteAccess = false;
                                sessionObject.isUserReadWriteAccess = false;
                            } else {
                                this.qualService.qualification.userEditAccess = true;
                                this.appDataService.isReadWriteAccess = true;
                                sessionObject.isUserReadWriteAccess = true;
                            }

                            // check for edit deal id on who-involved page - only if its your own qualification
                            if (this.permissionService.qualPermissions.has(PermissionEnum.EditDealId)) {
                                this.appDataService.isEditDealIdAllowed = true;
                                sessionObject.isEditDealIdAllowed = true;
                            } else {
                                this.appDataService.isEditDealIdAllowed = false;
                                sessionObject.isEditDealIdAllowed = false;
                            }
                            // to check if part of sales team but with read-only access
                            if (!this.permissionService.qualPermissions.has(PermissionEnum.QualEditName)) {
                                if (!this.appDataService.userInfo.isPartner) {
                                    for (let i = 0; i < data.extendedSalesTeam.length; i++) {
                                        if (data.extendedSalesTeam[i].ccoId === this.appDataService.userInfo.userId) {
                                            this.appDataService.roSalesTeam = true;
                                            break;
                                        } else {
                                            this.appDataService.roSalesTeam = false;
                                        }
                                    }
                                } else {
                                    for (let i = 0; i < data.partnerTeams.length; i++) {
                                        if (data.partnerTeams[i].ccoId === this.appDataService.userInfo.userId) {
                                            this.appDataService.roSalesTeam = true;
                                            break;
                                        } else {
                                            this.appDataService.roSalesTeam = false;
                                        }
                                    }
                                }
                            } else {
                                this.appDataService.roSalesTeam = false;
                            }

                            sessionObject.customerId = this.appDataService.customerID;
                            sessionObject.custInfo.custName = this.appDataService.customerName;
                            sessionObject.qualificationData = this.qualService.qualification;
                            sessionObject.createAccess = this.permissionService.qualPermissions.has(PermissionEnum.ProposalCreate);
                            sessionObject.partnerDeal = this.qualService.qualification.partnerDeal;
                            this.appDataService.setSessionObject(sessionObject);
                            //this.eaService.updateUserEvent(this.qualService.qualification, this.constantsService.QUALIFICATION_FS, this.constantsService.ACTION_UPSERT);
                            //this.eaService.updateUserEvent(data, this.constantsService.QUALIFICATION_FS, this.constantsService.ACTION_UPSERT);
                        }
                        if(sessionStorage.getItem('loadCreateProposal')){
                            sessionStorage.removeItem('loadCreateProposal');
                            if (this.appDataService.isReadWriteAccess){
                                this.createProposal();
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        this.messageService.displayUiTechnicalError(error);
                    }
                }
            }
            this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
        });
        
        this.loadGuAndHqDetails();

        this.qualService.listGeography().subscribe((res: any) => { 
            if (res) {
                if (!res.error && res.data) {
                    this.excludedGeography = [];
                    try {
                        const gridData = res.data;
                        for (let i = 0; i < gridData.length; i++) {
                            const countries = gridData[i].countries;
                            let countriesExcluded = [];
                            for (let j = 0; j < countries.length; j++) {
                                // push countries which have not been excluded in list of countries
                                if (countries[j].exclusion === false) {
                                    countriesExcluded.push(countries[j].name);
                                }
                            }
                            // push hq which have not been excluded in  Affiliates
                            if (countriesExcluded.length !== 0) {
                                const hqObj = {
                                    theater: gridData[i].name,
                                    countries: countriesExcluded
                                }
                                this.excludedGeography.push(hqObj);
                            }
                            // }
                        }
                        if (this.excludedGeography.length === 0) {
                            this.disableSaveButton = true;
                        }
                    } catch (error) {
                        console.error(error);
                        this.messageService.displayUiTechnicalError(error);
                    }
                } else if (res.error) {
                    this.messageService.displayMessagesFromResponse(res);
                } else {
                    this.messageService.displayUiTechnicalError();
                }
            } else {
                this.messageService.displayUiTechnicalError();
            }
        });
    }

    backToAffiliates() {
        // this.messageService.clear();
        this.roadMap.eventWithHandlers.back();
    }

    // Method to open modal and set changeDeal/cloneQual(true/false)
    cloneQualOrChangeDealId(event) {
        this.messageService.hideParentErrorMsg = true;
        const modalRef = this.modalVar.open(ChangeDealIdComponent, { windowClass: 'editDeal' });
        modalRef.componentInstance.qualId = this.qualService.qualification.qualID;
        modalRef.componentInstance.qualEAQualificationName = 'Copy of ' + this.qualService.qualification.name;
        modalRef.componentInstance.eaQualDescription = this.qualService.qualification.eaQualDescription;
        modalRef.componentInstance.qualObj = this.qualService.qualification;
        modalRef.componentInstance.isFromQualList = false;
        modalRef.componentInstance.changeDealid = event;
    }

    loadGuAndHqDetails(){
        this.qualSummaryService.loadGuAndHqDetails().subscribe((response: any) => {
            if (response && !response.error && response.data) {
                try {
                    this.excludedAffiliates = response.data;
                 } catch (error) {
                    this.messageService.displayUiTechnicalError(error);
                  }
                } else {
                  this.messageService.displayMessagesFromResponse(response);
                }
        });
    }


      setPosition(event) {
        this.showOnTop = false;
        setTimeout(() => {
          setTimeout(() => { this.opened = true; }, 300);
          const ele = this.elementRef.nativeElement.querySelector('.new-pop');
          if (ele === null) {
            return;
          }
          const offset: any = ele.getBoundingClientRect();
          let left = event.x - 40;
          this.arrowStyles = { top: '-4px', left: '22px' };
          if (window.innerWidth < offset.width + event.x) {
            left -= offset.width - 60;
            this.arrowStyles.left = 'auto';
            this.arrowStyles.right = '22px';
          }
        //  let top = event.y + 20;
          let diff = window.innerHeight - (offset.height + event.y);
          if (window.innerHeight < offset.height + event.y) {
            this.showOnTop = true;
            this.arrowStyles.top = 'auto';
            this.arrowStyles.bottom = '-13px';
          //  top = -(event.y- (offset.height + diff));
          }
          if (left < 0) {
            left = event.clientX - (offset.width / 2);
            left = left < 5 ? 5 : left - 5;
            this.arrowStyles.right = undefined;
            this.arrowStyles.left = (offset.width / 2) + 'px';
          }
          this.popStyle = { opacity: 1, left: `${left}px` };
        }, 100);
      }
    
    hide(){
        this.selectedNodeBranches = [];
        this.selectedRow = {};
        this.selectedType = '';
    }
    getBranches(hqObj, $event, type) {
        this.qualSummaryService.getBranches(hqObj).subscribe((response: any) => {
            if (response && !response.error) {
                if (response.data) {
                    try {
                        // this.excludedAffiliates = response.data;
                        this.selectedNodeBranches = response.data;
                    } catch (error) {
                        this.messageService.displayUiTechnicalError(error);
                    }
                }
                    hqObj.showGU = true;
                hqObj.selectedType = type;
                this.selectedRow = hqObj;
                this.setPosition($event);
            } else {
                this.messageService.displayMessagesFromResponse(response);
            }
        });
    }

    getBranchesHQ(hqObj, $event, type) {
        this.qualSummaryService.getBranches(hqObj).subscribe((response: any) => {
            if (response && !response.error) {
                if (response.data) {
                    try {
                        // this.excludedAffiliates = response.data;
                        this.selectedNodeBranches = response.data;
                    } catch (error) {
                        this.messageService.displayUiTechnicalError(error);
                    }
                }
                    hqObj.showHQ = true;
                hqObj.selectedType = type;
                this.selectedRow = hqObj;
                this.setPosition($event);
            } else {
                this.messageService.displayMessagesFromResponse(response);
            }
        });
    }
    

    getGuObject(hqRowItem, i) {
        let hideRow = false;
        if (hqRowItem.selectedHQ === hqRowItem.guId) {
            this.guIdMap.set(hqRowItem.guId, hqRowItem);
            hideRow = true;
        } else {
            if (!this.guIdMap.has(hqRowItem.guId)) {
                const obj = { 'expandableYorN': 'N', 'guId': hqRowItem.guId, 'guName': hqRowItem.guName, 'selectedHQ': hqRowItem.selectedHQ };
                this.guIdMap.set(hqRowItem.guId, obj);
            }
        }
        if ((i + 1) === this.excludedAffiliates.length) {
            this.guIdArray = Array.from(this.guIdMap.values());
        }
        return hideRow;
    }

    saveQual() {

        if (this.qualService.qualification.softwareSalesSpecialist.length !== 0 || this.appDataService.isPatnerLedFlow || this.isChangeSubFlow) {
            if (this.checkLegalInfoObj()) {
                // check for cam selection else show message and throw error
                if ((this.partnerFlow && this.qualService.qualification.cam !== undefined &&
                    this.qualService.qualification.cam.firstName !== '') || !this.partnerFlow || this.isChangeSubFlow) {
                    if (this.qualService.qualification.status === this.constantsService.QUALIFICATION_COMPLETE) {
                        this.qualificationSuccess = true;
                    } else {
                        const ngbModalOptionsLocal = this.ngbModalOptions;
                        const modalRef = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'review-accept' });
                        modalRef.componentInstance.showQualification = true;
                        modalRef.result.then((result) => {
                            // this.qualificationSuccess = true;
                            // this.qualService.qualification.qualStatus = 'validate';
                            // this.qualService.qualification.status = 'Validated';
                            let reqObj = this.qualService.getQualInfo();
                            reqObj['qualStatus'] = this.constantsService.QUALIFICATION_COMPLETE;
                            this.qualService.updateQual(reqObj).subscribe((response: any) => {
                                if (response) {
                                    if (response.messages && response.messages.length > 0) { // If any message present in response need to display.
                                        this.messageService.displayMessagesFromResponse(response);
                                    }
                                    if (!response.error) {
                                        if (response.permissions && response.permissions.featureAccess && response.permissions.featureAccess.length > 0) {
                                            this.permissionService.qualPermissions = new Map(response.permissions.featureAccess.map(i => [i.name, i]));
                                        }
                                        this.qualService.setQualPermissions();
                                        this.qualificationSuccess = true;
                                        this.qualService.qualification.status = this.constantsService.QUALIFICATION_COMPLETE;
                                        this.qualService.qualification.qualStatus = this.constantsService.QUALIFICATION_COMPLETE;
                                        this.appDataService.subHeaderData.subHeaderVal[2] = this.constantsService.QUALIFICATION_COMPLETE;
                                        // updating qualification object in session
                                        const sessionObject: SessionData = this.appDataService.getSessionObject();
                                        sessionObject.qualificationData = this.qualService.qualification;
                                        sessionObject.createAccess = this.permissionService.qualPermissions.has(PermissionEnum.ProposalCreate);
                                        sessionObject.partnerDeal = this.qualService.qualification.partnerDeal;
                                        this.appDataService.setSessionObject(sessionObject);
                                        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.QualificationSuccess;
                                        this.appDataService.isProposalIconEditable = false;
                                    }
                                }
                            });
                        });
                    }
                } else if (this.partnerFlow) {
                    this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
                        'qual.whoinvolved.CAM_SELECTION'), MessageType.Error));
                }
            } else {
                // this.messageService.displayUiTechnicalError('MANDATORY_CUST_REP_FIELDS');
                this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
                    'qual.whoinvolved.MANDATORY_CUST_REP_FIELDS'), MessageType.Error));
            }
        } else if (!this.appDataService.isPatnerLedFlow) {
            this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
                'qual.whoinvolved.SW_SALES_SPEC'), MessageType.Error));
        }
    }

    createProposal() {
        this.createProposalService.isPartnerDeal = this.qualService.qualification.partnerDeal;
        this.proposalDataService.proposalDataObject.newProposalFlag = true;
        this.router.navigate(['qualifications/proposal/createProposal']);
    }

    viewProposal() {
        // set userdashboardflow to empty store in session data for loading proposal list for this qualification
        const sessionObject: SessionData = this.appDataService.getSessionObject();
        this.appDataService.userDashboardFLow = '';
        sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
        this.appDataService.setSessionObject(sessionObject);
        this.router.navigate(['qualifications/proposal']);
    }

    initiateRenewal() {
        this.router.navigate(['follow-on/select-subscription'], { relativeTo: this.route });
    }

    viewQualification() {
        if (this.appDataService.isPatnerLedFlow) {
            this.appDataService.qualListForDeal = true;
        }
        this.qualSummaryService.goToQualification();
    }

    goToQualification2() {
        this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
        const sessionObject: SessionData = this.appDataService.getSessionObject();
        sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
        this.qualService.isCreatedbyQualView = this.isCreatedbyQualView;
        this.appDataService.setSessionObject(sessionObject);
        this.appDataService.showEngageCPS = false;
        this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
        this.appDataService.createQualfrom360 = false;
        this.router.navigate(['/qualifications']);
    }

    backToInvolved() {
        // this.messageService.clear();
        this.roadMap.eventWithHandlers.backToInvolved();
    }

    backToGeography() {
        // this.router.navigate(['/qualification-header/manage-geography']);
        // this.messageService.clear();
        this.roadMap.eventWithHandlers.backToGeography();
    }

    closeInfo() {
        this.showInfo = false;
    }

    checkLegalInfoObj() {
        if (this.qualService.qualification.legalInfo.addressLine1 !== undefined &&
            this.qualService.qualification.legalInfo.city !== undefined &&
            this.qualService.qualification.legalInfo.country !== undefined &&
            this.qualService.qualification.legalInfo.state !== undefined &&
            this.qualService.qualification.legalInfo.zip !== undefined &&
            this.qualService.qualification.customerInfo.preferredLegalName !== undefined) {
            return true;
        }
        return false;
    }

    // reopen qual at page level
    reopenQual() {
        this.qualService.reopenQual();
        // subscibe to emitter to get value of roadmappath 
        this.subscribers.roadMapEmitter = this.qualService.roadMapEmitter.subscribe((roadMapPath: any) => {
            // if roadmappath is false reopen and back to  whoinvolved page 
            if (!roadMapPath) {
                this.roadMap.eventWithHandlers.backToInvolved();
            }
        });
    }
}
