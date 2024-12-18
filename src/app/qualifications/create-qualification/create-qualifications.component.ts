import { CreateProposalService } from './../../proposal/create-proposal/create-proposal.service';
import { ProposalDataService } from './../../proposal/proposal.data.service';
import { Component, OnInit, Renderer2, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { QualificationsService } from '../qualifications.service';
import { Router, RouterModule, NavigationStart } from '@angular/router';
import { IbSummaryService } from '../../ib-summary/ib-summary.service';
import { AppDataService, SessionData } from '../../shared/services/app.data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageService } from '../../shared/services/message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ListProposalService } from '../../proposal/list-proposal/list-proposal.service';
import { DocumentCenterService } from '../../document-center/document-center.service';
import { DeleteQualificationComponent } from '@app/modal/delete-qualification/delete-qualification.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BreadcrumbsService } from '../../../app/core';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { ConstantsService, QualProposalListObj } from '../../shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { PermissionService } from '@app/permission.service';
import { Subscription } from 'rxjs';
import { PurchaseOptionsComponent } from '@app/modal/purchase-options/purchase-options.component';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { UploadFileComponent } from '@app/modal/upload-file/upload-file.component';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { GridOptions } from 'ag-grid-community';
import { ManageTeamMembersComponent } from '@app/modal/manage-team-members/manage-team-members.component';
import { SubscriptionAccessComponent } from '@app/modal/subscription-access/subscription-access.component';

@Component({
  selector: 'app-create-qualifications',
  templateUrl: './create-qualifications.component.html',
  styleUrls: ['./create-qualifications.component.scss']
})
export class CreateQualificationsComponent implements OnInit, OnDestroy {
  createQualification = false;
  errorDealID = false;
  qualEADealId: string;
  qualEAQualificationName: string;
  resultMatch = false;
  resultFound = false;
  newQualData: any = [];
  prospectDetails: any = {};
  eaQualDescription: string;
  archName: any;
  customerName: any;
  customerId: any;
  errorMessage: string;
  showCreateQual = false;
  showQualList = false;
  qualList;
  navigateToSummary = false;
  isQualNameInvalid = false;
  globalView: any;
  qualData: QualProposalListObj;
  searchQualBy: string;
  partnerLedFlow = false;
  subscription: Subscription;
  agreementEmitter: Subscription;
  displayHTML = false;
  partnerCreateFlow = false;
  partnerLandingFlow = false;
  // enableDealForPartner = false;
  state: string;
  isCustomerMatching: boolean;
  isSwitched = false;
  isPartnerDeal = false;
  isDisableCreate = false;
  showLoccMsg = false;
  isProspectFound = false;
  isSubUiFlow = false;
  subUiUrl = '';
  isSubUiLandingDataLoaded = false; // set if api call done afte subUiLanding

  // Variables for grid view
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  displayGridView = false;
  isGreenfiled = false;
  isBrownField = false;
  openQualDrop = false;
  selectedQualView = 'Created by Me';
  QualViewoptions = ['Created by Me', 'Shared with Me'];
  isChangeSubSelected = true; // to set when user selected change subscription
  subscriptionList = []; // to load subscriptions data from api
  referenceSubscriptionId = ''; // to store subRefId selected 
  isSubIdSelected = false; // to set if subRefId is selected
  isSubscriptiosDataPresent: boolean; // to set if subscriptions data present or not
  issubscriptionDataLoaded = false; // to set if subscriptions api loaded or not

  public subscribers: any = {};
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;

  constructor(public localeService: LocaleService,
    private renderer: Renderer2, private createProposalService: CreateProposalService,
    public qualService: QualificationsService,
    private messageService: MessageService,
    private router: Router,
    public appDataService: AppDataService,
    private route: ActivatedRoute,
    private blockUiService: BlockUiService,
    private involvedService: WhoInvolvedService,
    private utilitiesService: UtilitiesService,
    private listProposalService: ListProposalService,
    public documentCenter: DocumentCenterService,
    private modalVar: NgbModal,
    private breadcrumbsService: BreadcrumbsService,
    public dashboardService: DashboardService,
    public constantsService: ConstantsService,
    public productSummaryService: ProductSummaryService,
    private permissionService: PermissionService,
    private dealListService: DealListService,
    public partnerDealCreationService: PartnerDealCreationService,
    private proposalDataService: ProposalDataService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 21;
  }

  ngOnInit() {
    if (!this.appDataService.isPatnerLedFlow && !this.appDataService.createQualfrom360) {
      this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
      this.appDataService.subHeaderData.moduleName = '';
    }
    if (this.qualService.isCreatedByMe) {
      this.selectedQualView = this.QualViewoptions[0];
    } else {
      this.selectedQualView = this.QualViewoptions[1];
    }
    this.appDataService.quoteIdForDeal = undefined;
    this.route.params.forEach((params: Params) => {
      if (Object.keys(params).length !== 0) {
        this.appDataService.userDashboardFLow = '';
        this.appDataService.customerID = params['custId'];
        this.appDataService.dealID = params['dId'];
        this.appDataService.quoteIdForDeal = params['qId'];
        if (params.variable === 'landing') {
          this.qualService.flowSet = false;
        } else {
          this.qualService.flowSet = true;
        }
      }
    });
    this.state = 'createQual';
    if (this.appDataService.dealID && this.appDataService.quoteIdForDeal) {
      this.partnerCreateFlow = false;
    }
    this.subscribers.emptyList = this.qualService.emptyListEmitter.subscribe(() => {
      this.isDisableCreate = true;
      this.showCreateQual = true;
      this.showQualList = false;
    });

    // subsctribe to emitter and call qual list afte clone/change deal success
    this.subscribers.updatedQualList = this.qualService.loadUpdatedQualListEmitter.subscribe(() => {
      if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
        this.globalView = !this.qualService.isCreatedbyQualView;
        this.globalSwitchChange(!this.qualService.isCreatedbyQualView);
      } else {
        if (!this.partnerCreateFlow && !this.appDataService.createQualfrom360) {
          this.goToCustomerOverview();
        }
      }
    });
    // const sessionObj: SessionData = this.appDataService.getSessionObject();
    // if (sessionObj){
    //   this.appDataService.isPatnerLedFlow = sessionObj.isPatnerLedFlow;
    // }
    // if(this.appDataService.isPatnerLedFlow && this.appDataService.dealID && this.appDataService.quoteIdForDeal){
    //   this.qualService.loccLandingApiCall(this.appDataService.dealID,this.appDataService.quoteIdForDeal).subscribe((response: any) =>{
    //     if(response && response.data && !response.error){
    //       this.qualService.loaData.loaSigned = response.data.loaSigned;
    //       if(this.qualService.loaData.loaSigned){
    //         this.appDataService.loccValidTill = response.data.SignatureValidDate;
    //       }

    //     } else {
    //       this.messageService.displayMessagesFromResponse(response);
    //     }
    //   });
    // }
    if (this.appDataService.isPatnerLedFlow) {
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
    }
    this.qualService.disabledContinueButton = false;
    this.qualData = { data: '' };
    this.qualData.editIcon = true;
    this.qualData.isToggleVisible = true;
    if (this.permissionService.permissions.size === 0) {
      if (!this.qualService.flowSet) {
        this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
      }
      if (!this.appDataService.isReload) {
        this.appDataService.isReload = true;
        this.appDataService.findUserInfo();
      }
    } else {
      this.loadCreateQual();
    }
    if (this.appDataService.qualListForDeal) {
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
      this.breadcrumbsService.breadCrumbStatus.next(true);
      this.appDataService.movebreadcrumbUp.next(true);
    }

    this.subscription = this.appDataService.createQualEmitter.subscribe((res) => {
      if (!this.appDataService.isPatnerLedFlow) {
        this.isExternalLanding();
      }
      this.loadCreateQual();
    });

    if (this.appDataService.createQualfrom360) {
      this.loadCreateQual();
      this.createNew();
      this.loadEASubscribtion();
    } else {
      this.isChangeSubSelected = false;
    }

    this.agreementEmitter = this.appDataService.agreementDataEmitter.subscribe((smartAccountobj) => {
      this.changeLindSmartAccount(smartAccountobj);
    })
  }  

  isExternalLanding() {

    const sessionObj: SessionData = this.appDataService.getSessionObject();
    let url = '';
    if (sessionObj.partnerUrl) {
      this.appDataService.partnerUrl = sessionObj.partnerUrl;
      url = this.appDataService.partnerUrl;
    } else if(sessionObj.subUiUrl){
      this.blockUiService.spinnerConfig.startChain();
      this.appDataService.subUiUrl = sessionObj.subUiUrl;
      url = this.appDataService.subUiUrl
    }
    let index = url.lastIndexOf('/');

    if (url.search(ConstantsService.EXTERNAL) > 0 && url.substring(index + 1) !== ConstantsService.EXTERNAL) {
      if(url.includes('sub-ui')){
        this.isSubUiFlow = true;
        this.subUiUrl = url.substring(index);
        this.externalSubUiLanding(this.subUiUrl);
      } else {
      this.appDataService.partnerParam = url.substring(index);
      this.partnerLedFlow = true;
      this.appDataService.myDealQualCreateFlow = false;
      this.partnerLandingFlow = true; // to indicate partner is coming from deeplink url
      this.qualService.isShowDealLookUp = false;
      this.partnerCreateFlow = true;
      this.appDataService.userDashboardFLow = '';
      }
    }
  }

  loadCreateQual() {
    this.displayHTML = true;
    if (this.appDataService.isPatnerLedFlow) {
      let url = '';
      const sessionObj: SessionData = this.appDataService.getSessionObject();
      if (sessionObj.partnerUrl) {
        this.appDataService.partnerUrl = sessionObj.partnerUrl;
        url = this.appDataService.partnerUrl;
      } else if(sessionObj.subUiUrl){
        this.appDataService.subUiUrl = sessionObj.subUiUrl;
        url = this.appDataService.subUiUrl
      }
      // let url = this.appDataService.partnerUrl;
      let index = url.lastIndexOf('/');
      if (url.search(ConstantsService.EXTERNAL) > 0 && url.substring(index + 1) !== ConstantsService.EXTERNAL) {
        this.blockUiService.spinnerConfig.blockUI();
        if(url.includes('sub-ui')){
          // this.isSubUiFlow = true;
          this.appDataService.isSubUiFlow = true; // set subui flow
          this.subUiUrl = url.substring(index);
          this.appDataService.partnerParam  = this.subUiUrl; // set subui landing url in parterparam
          this.appDataService.userDashboardFLow = '';
          this.partnerCreateFlow = true;
          // this.externalSubUiLanding(this.subUiUrl);
        } else {
          this.appDataService.partnerParam = url.substring(index);
        // this.isDisableCreate = true;
        if (this.appDataService.dealID && this.appDataService.quoteIdForDeal) {
          this.partnerCreateFlow = false;
        } else {
          this.appDataService.userDashboardFLow = '';
          this.partnerCreateFlow = true;

        }
        this.appDataService.myDealQualCreateFlow = false;
        this.partnerLandingFlow = true; // to indicate partner is coming from deeplink url
      }
    }
      // if(this.appDataService.partnerParam && this.appDataService.partnerParam.search('#')){
      //   this.appDataService.partnerParam.replace('#','');
      // }
      this.loccLandingData();
    } else {
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
    }
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.prospectQualificaitons;
      this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
    } else {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userQualifications;
      this.appDataService.isGroupSelected = true;
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.MY_QUAL');
    }

    // const sessionObj: SessionData = this.appDataService.getSessionObject();
    // this.appDataService.userDashboardFLow = sessionObj.userDashboardFlow;


    // Reset qualification object to default value
    this.qualService.qualification = {
      dealId: '',
      title: '',
      qualID: '',
      status: '',
      prevChangeSubQualId: '',
      dealInfoObj: {},
      name: '',
      accountManager: { 'firstName': '', 'lastName': '', 'emailId': '', 'userId': '' },
      customerInfo: { 'accountName': '', 'address': '', 'smartAccount': '', 'preferredLegalName': '', 'scope': '', 'affiliateNames': '', 'repName': '', 'repTitle': '', 'repEmail': '', 'filename': '', 'repFirstName': '', 'repLastName': '','phoneCountryCode':'','dialFlagCode': '','phoneNumber':'' },
      legalInfo: {
        'addressLine1': '',
        'addressLine2': '', 
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      },
      address: {
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      },
      cam:
      {
        'firstName': '',
        'lastName': '',
        'camEmail': '',
        'beGeoId': 0,
        'cecId': '',
        'role': ''
      },
      softwareSalesSpecialist: [],
      salesTeamList: [],
      permissions: {},
      subscription: {},
      extendedsalesTeam: [],
      cxTeams: [],
      cxDealAssurerTeams: [],
      distributorTeam: [],
      partnerTeam: [],
      eaQualDescription: '',
      accountAddress: '',
      accountName: '',
      accountManagerName: '',
      excludedSubidiaryHqInfo: [],
      qualStatus: '',
      primaryPartnerName: '',
      userEditAccess: true,
      federal: 'no',
      partnerDeal: false,
      loaSigned: false,
      distiInitiated:false,
      createdBy: ''
    };
    this.involvedService.previouslySelectedSpecialist = [];
    if (this.appDataService.isPatnerLedFlow) {
      this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    }
    // emitter to subscribe after the loa is signed and get the required data 
    this.subscribers.partnerDealLookUpEmitter = this.qualService.partnerDealLookUpEmitter.subscribe(() => {
      if (this.partnerLedFlow && this.partnerCreateFlow && this.qualService.isShowDealLookUp) {
        this.isChangeSubSelected = false;
        this.setPartnerDealDetails(this.qualService.loaData); // set partnerdetails with loaData 
        if(this.appDataService.isSubUiFlow){
          this.isSubUiLandingDataLoaded = true;
          this.isSubUiFlow = true;
          this.matchDealId();
          if(this.qualService.loaData.subscriptionDeal && this.qualService.loaData.subscriptionDeal.subscriptionSearch){
            this.subscriptionList = this.qualService.loaData.subscriptionDeal.subscriptionSearch.subscriptions ? this.qualService.loaData.subscriptionDeal.subscriptionSearch.subscriptions: [];
          } else {
            this.subscriptionList = [];
          }
        }
        // call create new method after loa signed
        this.createNew();
        this.qualService.showDealIDInHeader = true;
      }
    });
    if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
      this.appDataService.isGroupSelected = true;
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.MY_QUAL');
      this.globalView = !this.qualService.isCreatedbyQualView;
      this.globalSwitchChange(!this.qualService.isCreatedbyQualView);
    } else {
      if (this.appDataService.customerID === -1) {
        const sessionObj: SessionData = this.appDataService.getSessionObject();
        this.appDataService.customerID = sessionObj.customerId;
      }
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if (!this.partnerCreateFlow && !this.appDataService.createQualfrom360 && !this.isSubUiFlow) {
        this.goToCustomerOverview();
      }
    }
    if (this.partnerLedFlow && this.partnerCreateFlow && !this.qualService.isShowDealLookUp) {
      this.isDisableCreate = true;
    }
  }

  // method to call locc landing api and set header data as well
  loccLandingData() {
    if (this.appDataService.dealID && this.appDataService.quoteIdForDeal) {
      this.appDataService.qualListForDeal = true;
      this.qualService.dealData.dealId = this.appDataService.dealID;
      this.qualService.loccLandingApiCall(this.appDataService.dealID, this.appDataService.quoteIdForDeal).subscribe((response: any) => {
        if (response && response.data && !response.error) {
          this.qualService.loaData = response.data;
          if (this.qualService.loaData.loaSigned) {
            this.appDataService.loccValidTill = response.data.SignatureValidDate;
            this.appDataService.signatureValidDate = response.data.loaDetail.signatureValidDate;
          }
          if (response.data.loaDetail && response.data.loaDetail.deal) {
            const deal = response.data.loaDetail.deal;
            this.qualService.dealData.dealName = deal.optyName;
            this.qualService.dealData.dealStatus = deal.dealStatusDesc;
          }
          this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, true);
          this.qualService.showDealIDInHeader = true;
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    }
  }

  ngOnDestroy() {
    this.appDataService.qualListForDeal = false;
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.proposalDataObject.proposalData.groupName = '';
    if (this.appDataService.partnerUrl) {
      this.appDataService.partnerUrl = '';
      const sessionObj: SessionData = this.appDataService.getSessionObject();
      sessionObj.partnerUrl = '';
      this.appDataService.setSessionObject(sessionObj);
    }
    if (!this.appDataService.isReload) {
      this.subscription.unsubscribe();
    }
    if (this.subscribers.partnerDealLookUpEmitter) {
      this.subscribers.partnerDealLookUpEmitter.unsubscribe();
    }
    if (this.subscribers.emptyList) {
      this.subscribers.emptyList.unsubscribe();
    }
    if (this.subscribers.updatedQualList) {
      this.subscribers.updatedQualList.unsubscribe();
    }
    if(this.agreementEmitter){
      this.agreementEmitter.unsubscribe();
    }
    this.appDataService.isReload = false;
    this.dealListService.showFullList = true;
    this.appDataService.smartAccountData = null;
    this.appDataService.linkedSmartAccountObj = { name: 'Not Assigned', id: '' };
    this.qualService.displaySmartAccountInHeader = false;
  }

  federalCustomerSelected() {

    this.qualService.isFederalCustomer = !this.qualService.isFederalCustomer;

  }

  // method to set all the required fields to create and show on who involved page
  setPartnerDealDetails(dataObj: any) {
    this.isProspectFound = true;
    this.qualService.qualification.partnerDeal = dataObj.partnerDeal;
    this.qualService.qualification.loaSigned = dataObj.loaSigned;
    this.qualService.qualification.dealId = dataObj.loaDetail.deal.dealId;
    this.newQualData = dataObj.loaDetail.deal;
    this.qualService.qualification.dealInfoObj = this.newQualData;
    this.qualService.qualification.dealId = this.newQualData.dealId;
    this.appDataService.customerID = dataObj.customerId;
    this.appDataService.customerName = dataObj.customerName;
    this.appDataService.archName = this.constantsService.DNA;
    this.qualService.qualification.dealInfoObj = this.newQualData;
    this.qualService.qualification.dealId = this.newQualData.dealId;
    this.isGreenfiled = this.qualService.loaData.greenfield;
    this.isBrownField = this.qualService.loaData.brownfieldPartner;
    this.qualService.buyMethodDisti = dataObj.buyMethodDisti ? true : false; // set buyMethodDisti flag
    // this.qualService.qualification.status = response.data.dealStatus;
    if (this.newQualData.accountManager) {
      this.qualService.qualification.accountManager = this.newQualData.accountManager;
      this.qualService.qualification.accountManagerName = this.newQualData.accountManager.firstName + ' ' +
      this.newQualData.accountManager.lastName;
      this.qualService.emailID = this.newQualData.accountManager.emailId;
    }
    this.qualService.qualification.name = this.qualEAQualificationName = this.newQualData.optyName;
    this.isQualNameInvalid = false;
    this.qualService.qualification.eaQualDescription = this.eaQualDescription;
    this.qualService.qualification.accountAddress = this.newQualData.accountAddress;
    this.qualService.qualification.accountName = this.newQualData.accountName;
    this.qualService.qualification.primaryPartnerName = dataObj.partnerInfo.beGeoName;

    // check for loacustomercontact and set the legal info and preferred legal name
    if((!this.qualService.loaData.loaDetail.loaCustomerContact || Object.keys(this.qualService.loaData.loaDetail.loaCustomerContact).length === 0)){
    this.qualService.qualification.legalInfo = this.newQualData.accountAddressDetail;
    this.qualService.qualification.customerInfo.preferredLegalName = this.qualService.loaData.loaDetail.deal.accountName;
    } else {
      this.qualService.qualification.legalInfo = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalAddress;
      this.qualService.qualification.customerInfo.preferredLegalName = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalName;
    }
    // this.qualService.qualification.legalInfo = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalAddress;
    // this.qualService.qualification.customerInfo.preferredLegalName = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalName;
    this.qualService.qualification.customerInfo.repName = '';
    this.qualService.qualification.customerInfo.repTitle = '';
    this.qualService.qualification.customerInfo.repEmail = '';
    this.qualService.qualification.customerInfo.repFirstName = '';
    this.qualService.qualification.customerInfo.repLastName = '';

    this.qualService.qualification.address.addressLine1 = this.qualService.qualification.legalInfo.addressLine1 = this.newQualData.accountAddressDetail.addressLine1;
    this.qualService.qualification.address.addressLine2 = this.qualService.qualification.legalInfo.addressLine2 = this.newQualData.accountAddressDetail.addressLine2;
    this.qualService.qualification.address.city = this.qualService.qualification.legalInfo.city = this.newQualData.accountAddressDetail.city;
    this.qualService.qualification.address.country = this.qualService.qualification.legalInfo.country = this.newQualData.accountAddressDetail.country;
    this.qualService.qualification.address.state = this.qualService.qualification.legalInfo.state = this.newQualData.accountAddressDetail.state;
    this.qualService.qualification.address.zip = this.qualService.qualification.legalInfo.zip = this.newQualData.accountAddressDetail.zip;
    this.qualService.qualification.customerInfo.scope = this.constantsService.NONE;
    this.qualService.qualification.federal = 'no';
    this.qualEADealId = this.newQualData.dealId;
    this.resultFound = true;
  }

  getQualData() {
    this.qualData.isCreatedByMe = this.qualService.isCreatedByMe;

    this.qualService.getQualListForDashboard().subscribe((res: any) => {

      if (!res.error && res.data) {

        this.qualData.data = res.data;

        this.rowData = this.qualData.data;
        if (this.gridOptions.api) {
          this.gridOptions.api.setRowData(this.rowData);
          this.gridOptions.api.redrawRows();
        } else {
          // this.gridOptions = <GridOptions>{
          // onGridReady: () => {
          this.gridOptions.rowData = this.rowData;
          // }
          // };
        }
        // this.appendId();
        this.qualService.qualListData = res;
        this.qualData.isCreatedByMe = true;
        this.qualService.isCreatedByMe = true;
      } else {
        this.qualData.data = [];
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  deleteQual(qual, index: number) {
    const modalRef = this.modalVar.open(DeleteQualificationComponent, { windowClass: 'infoDealID' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.qualService.deleteQual(qual.qualId).subscribe((res: any) => {
          if (res && !res.error) {
            (<Array<any>>this.rowData).splice(index, 1);
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.rowData);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }


  createNew() {

    // Reset error message
    this.errorDealID = false;

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationCreate;
    this.createQualification = true;
    this.showQualList = false;
    this.showCreateQual = true;
    this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    this.qualService.isShowDealLookUp = true;

    if (!this.partnerLedFlow) {
      this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
    } else {
      this.appDataService.userDashboardFLow = '';
    }
    // if (this.partnerLedFlow){
    //   this.partnerCreateFlow = true;
    //   this.appDataService.userDashboardFLow = '';
    //   if(this.appDataService.quoteIdForDeal){
    //      this.loccLandingAPI(this.appDataService.quoteIdForDeal,this.appDataService.dealID);
    //   }
    // } else {
    //   if(this.appDataService.qualListForDeal){
    //     this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, true);
    //     this.qualService.showDealIDInHeader = true;
    //   } else {
    //     this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
    //   }
    // }
  }

  createNewMyDeals() {

    this.createQualification = true;
    this.showQualList = false;
    this.appDataService.myDealQualCreateFlow = true;
    this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    this.qualService.isShowDealLookUp = false;
    this.partnerCreateFlow = true;
  }

  matchDealId() {
    this.resultMatch = !this.resultMatch;
    this.qualService.resultMatch = this.resultMatch;
  }

  updateDealLookUpID() {
    this.errorDealID = false;
    this.resultFound = false;
    this.resultMatch = false;
    this.isPartnerDeal = false;
    this.showLoccMsg = false;
  }

  createQual() {
    this.qualService.qualification.name = this.qualEAQualificationName;
    this.qualService.qualification.eaQualDescription = this.eaQualDescription;

    this.blockUiService.spinnerConfig.stopChainAfterThisCall(); // Stop chain after below ajax call,to remove progress bar.
    this.qualService.createQual().subscribe(
      (res: any) => {
        if (!res.error) {
          try {
            this.qualService.createQualFlow = true;
            this.qualService.qualification.qualID = res.qualId;
            this.qualService.isQualCreated = true;

            if (res.permissions && res.permissions.featureAccess && res.permissions.featureAccess.length > 0) {
              this.permissionService.qualPermissions = new Map(res.permissions.featureAccess.map(i => [i.name, i]));
            } else {
              this.permissionService.qualPermissions.clear();
            }

            // Set local permission for debugger
            this.permissionService.isProposalPermissionPage(false);
            // this.qualService.qualification.status = res.qualStatus;
            this.qualService.qualification.qualStatus = res.qualStatus;
            // Setting user access to read-write as user has created his own qualification
            // qualification.userEditAccess and readOnlyState are not used anywhere.
            // if (res.userAccessType !== ConstantsService.USER_READ_WRITE_ACCESS && !this.appDataService.userInfo.rwSuperUser) {
            //   this.qualService.qualification.userEditAccess = false;
            //   this.qualService.readOnlyState = true;
            // }
            // else {
            //   this.qualService.qualification.userEditAccess = true;
            //   this.qualService.readOnlyState = false;
            // }
            this.utilitiesService.changeMessage(false);
            this.documentCenter.comingFromDocCenter = false;
            const sessionObject: SessionData = this.appDataService.getSessionObject();
            sessionObject.qualificationData = this.qualService.qualification;
            sessionObject.comingFromDocCenter = this.qualService.comingFromDocCenter;
            // checking permissoins and setting it inside who-invloved component.
            // this.appDataService.isReadWriteAccess = true;
            // sessionObject.isUserReadWriteAccess = true;
            this.appDataService.setSessionObject(sessionObject);
            // Below changes are the part of edit qual routing changes.
            this.router.navigate(['qualifications/' + res.qualId]);
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      },
      error => {
        this.messageService.displayUiTechnicalError(error);
      }
    );

  }

  goToProspect() {
    // console.log(this.appDataService.isFavorite);
    this.productSummaryService
      .loadArchitecturesData(this.appDataService.archName)
      .subscribe((response: any) => {
        if (response && !response.error) {
          this.appDataService.architectureMetaDataObject = response.data;
          const sessionObj = this.appDataService.getSessionObject();
          sessionObj.architectureMetaDataObject = response.data;
          this.appDataService.setSessionObject(sessionObj);
          this.router.navigate(['/prospect-details',
            {
              architecture: this.appDataService.archName,
              customername: encodeURIComponent(this.appDataService.customerName),
              favorite: this.appDataService.isFavorite
            }]);
        }
      });
  }

  // this method is not used anywhare in the code
  // goToProposalListing(qualObj) {
  //   this.qualEADealId = qualObj.dealId;
  //   if (qualObj.qualId) {
  //     this.qualService.qualification.qualID = qualObj.qualId;
  //   } else if (qualObj.id) {
  //     this.qualService.qualification.qualID = qualObj.id;
  //   }
  //   if (qualObj.prospectKey) {
  //     this.appDataService.customerID = qualObj.prospectKey;
  //   } else if (qualObj.customerId) {
  //     this.appDataService.customerID = qualObj.customerId;
  //   }
  //   this.qualService.qualification.qualStatus = qualObj.status;
  //   this.qualService.qualification.dealId = qualObj.dealId;
  //   this.qualService.qualification.accountManagerName = qualObj.am;
  //   this.qualService.qualification.name = qualObj.qualName;
  //   this.appDataService.userDashboardFLow = '';
  //   if (qualObj.customerName) {
  //     this.appDataService.customerName = qualObj.customerName;
  //   }
  //   this.qualService.updateSessionQualData();
  //   const sessionData: SessionData = this.appDataService.getSessionObject();
  //   sessionData.userDashboardFlow = '';
  //   sessionData.customerId = this.appDataService.customerID;
  //   sessionData.custInfo.custName = this.appDataService.customerName;
  //   if (qualObj.userAccessType !== ConstantsService.USER_READ_WRITE_ACCESS && !this.appDataService.userInfo.rwSuperUser) {
  //     this.appDataService.isReadWriteAccess = false;
  //     sessionData.isUserReadWriteAccess = false;
  //   } else {
  //     this.appDataService.isReadWriteAccess = true;
  //     sessionData.isUserReadWriteAccess = true;
  //   }
  //   this.appDataService.setSessionObject(sessionData);
  //   this.listProposalService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
  //   this.router.navigate(['qualifications/proposal']);
  // }

  goToSummary() {
    // this.router.navigateByUrl('/ib-summary');
    this.productSummaryService
      .loadArchitecturesData(this.constantsService.DNA)
      .subscribe((response: any) => {
        if (response && !response.error) {
          this.appDataService.architectureMetaDataObject = response.data;
          const sessionObj = this.appDataService.getSessionObject();
          sessionObj.architectureMetaDataObject = response.data;
          this.appDataService.setSessionObject(sessionObj);
          this.router.navigate(['/ib-summary',
            {
              architecture: this.constantsService.DNA,
              customername: encodeURIComponent(this.appDataService.customerName),
              favorite: this.appDataService.isFavorite,
              relativeTo: this.route,
              skipLocationChange: false
            }
          ]);
        }
      });

  }

  goToBookingSummary() {
    this.productSummaryService
      .loadArchitecturesData(this.constantsService.SECURITY)
      .subscribe((response: any) => {
        if (response && !response.error) {
          this.appDataService.architectureMetaDataObject = response.data;
          const sessionObj = this.appDataService.getSessionObject();
          sessionObj.architectureMetaDataObject = response.data;
          this.appDataService.setSessionObject(sessionObj);
          this.router.navigate(['/ib-summary',
            {
              architecture: this.constantsService.SECURITY,
              customername: encodeURIComponent(this.appDataService.customerName),
              favorite: this.appDataService.isFavorite,
              relativeTo: this.route,
              skipLocationChange: false
            }
          ]);
        }
      });
  }

  showLookup() {
    const dealLookUpRequest = {
      userId: this.appDataService.userId,
      dealId: this.utilitiesService.removeWhiteSpace(this.qualEADealId),
      customerId: this.appDataService.customerID
    };
    this.productSummaryService.showProspectDealLookUp(dealLookUpRequest).subscribe(
      (response: any) => {
        if (!response.error && !response.messages && response.data) {
          this.setDealAndSubData(response.data); // set the deal details in the method
          // this.newQualData = response.data.dealDetails;
          // if (response.data.prospectDetails) {
          //   this.isProspectFound = true;
          //   this.prospectDetails = response.data.prospectDetails[0];
          // } else {
          //   this.prospectDetails = {};
          //   this.isProspectFound = false;
          // }
          // this.qualService.qualification.partnerDeal = response.data.partnerDeal;
          // this.qualService.qualification.loaSigned = response.data.loccSigned;
          // this.isPartnerDeal = response.data.partnerDeal;
          // if (this.partnerLedFlow && this.partnerCreateFlow) {
          //   this.appDataService.customerID = this.prospectDetails.prospectKey;
          //   this.appDataService.customerName = this.prospectDetails.prospectName;
          // }
          // // else{
          // //   this.newQualData = response;
          // // }
          // this.isCustomerMatching = response.data.matching;
          // this.qualService.qualification.dealInfoObj = this.newQualData;
          // this.qualService.qualification.dealId = this.newQualData.dealId;
          // // this.qualService.qualification.status = response.data.dealStatus; 
          // if (this.newQualData.accountManager) {
          //   this.qualService.qualification.accountManager = this.newQualData.accountManager;
          //   this.qualService.qualification.accountManagerName = this.newQualData.accountManager.firstName + ' ' + this.newQualData.accountManager.lastName;
          //   this.qualService.emailID = this.newQualData.accountManager.emailId;
          // }
          // this.qualService.qualification.name = this.qualEAQualificationName = this.newQualData.optyName;
          // this.isQualNameInvalid = false;
          // this.qualService.qualification.eaQualDescription = this.eaQualDescription;
          // this.qualService.qualification.accountAddress = this.newQualData.accountAddress;
          // this.qualService.qualification.accountName = this.newQualData.accountName;
          // if (this.isPartnerDeal) {
          //   this.qualService.qualification.primaryPartnerName = response.data.partnerInfo.beGeoName;
          //   if (response.data.loaCustomerContact) {
          //     this.qualService.qualification.customerInfo.repName = response.data.loaCustomerContact.repName;
          //     this.qualService.qualification.customerInfo.repTitle = response.data.loaCustomerContact.repTitle;
          //     this.qualService.qualification.customerInfo.repEmail = response.data.loaCustomerContact.repEmail;
          //     this.qualService.qualification.customerInfo.repFirstName = response.data.loaCustomerContact.repFirstName;
          //     this.qualService.qualification.customerInfo.repLastName = response.data.loaCustomerContact.repLastName;
          //   }
          // } else {
          //   this.qualService.qualification.primaryPartnerName = this.newQualData.primaryPartnerName;
          // }
          // this.qualService.qualification.address.addressLine1 = this.qualService.qualification.legalInfo.addressLine1 = this.newQualData.accountAddressDetail.addressLine1;
          // this.qualService.qualification.address.addressLine2 = this.qualService.qualification.legalInfo.addressLine2 = this.newQualData.accountAddressDetail.addressLine2;
          // this.qualService.qualification.address.city = this.qualService.qualification.legalInfo.city = this.newQualData.accountAddressDetail.city;
          // this.qualService.qualification.address.country = this.qualService.qualification.legalInfo.country = this.newQualData.accountAddressDetail.country;
          // this.qualService.qualification.address.state = this.qualService.qualification.legalInfo.state = this.newQualData.accountAddressDetail.state;
          // this.qualService.qualification.address.zip = this.qualService.qualification.legalInfo.zip = this.newQualData.accountAddressDetail.zip;
          // this.qualService.qualification.customerInfo.scope = this.constantsService.NONE;
          // this.qualService.qualification.federal = 'no';

          // this.resultFound = true;
          // this.errorDealID = false;
          // this.isSwitched = false;
          // if (this.navigateToSummary) {
          //   this.qualService.comingFromDocCenter = false;
          //   // setting qualification data in session 
          //   const sessionObject: SessionData = this.appDataService.getSessionObject();
          //   sessionObject.qualificationData = this.qualService.qualification;
          //   sessionObject.comingFromDocCenter = this.qualService.comingFromDocCenter;
          //   this.appDataService.setSessionObject(sessionObject);

          //   this.router.navigate(['qualifications/editQual']);
          // }
          // // to check and show message if cisco led uses partner deal for which locc not signed or initiated while deal look up to create qualification
          // if (!this.appDataService.isPatnerLedFlow && this.qualService.qualification.partnerDeal && !this.qualService.qualification.loaSigned && !response.data.loccInitiated && !response.data.loccOptional) {
          //   this.showLoccMsg = true;
          // }
        } else { // In this scenario we need to display message below the text box.
          this.messageService.displayMessagesFromResponse(response);
          this.blockUiService.spinnerConfig.unBlockUI();
          this.errorMessage = this.localeService.getLocalizedMessage('qual.create.NO_ASSOCIATED_DEAL');
          this.errorDealID = true;
        }
      });
    //  console.log(this.qualService.qualification);
  }


  // If Qualification Name is blank then disable create button.
  isQualNameBlank() {
    this.isQualNameInvalid = (this.qualEAQualificationName === '') ? true : false;
  }
  /*
  * This method is use to get the class for qualification status on the 
  * basis of status from the API.
  */
  getStatusClass(status: string) {
    let statusClass = this.localeService.getLocalizedString('qual.badge.IN_PROGRESS')
    switch (status) {
      case this.constantsService.IN_PROGRESS_STATUS:
        statusClass = this.localeService.getLocalizedString('qual.badge.IN_PROGRESS');
        break;
      case this.constantsService.QUALIFICATION_COMPLETE:
        statusClass = this.localeService.getLocalizedString('qual.badge.VALID');
        break;
      case 'Active':
        statusClass = this.localeService.getLocalizedString('qual.badge.ACTIVE');
        break;
      case 'In Valid':
        statusClass = this.localeService.getLocalizedString('qual.badge.INVALID');
        break;
      case 'Closed':
        statusClass = this.localeService.getLocalizedString('qual.badge.CLOSED');
        break;

      default:
        statusClass = this.localeService.getLocalizedString('qual.badge.IN_PROGRESS');
    }
    return statusClass;
  }


  // Open VNext project
  openVnext() {

    const dealID = this.appDataService.partnerParam.split("did=").pop();
    const index = window.location.href.lastIndexOf('qualifications')
    const url = window.location.href.substring(0, index)
    window.open(url +'ea/project/create?did='+dealID,'_self');

  }


  cancel() {
    this.qualService.buyMethodDisti = false; // reset the flag if cancels create qual
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.accountHealth;

    this.router.navigate([
      '/allArchitectureView',
      {
        architecture: encodeURIComponent(this.appDataService.archName),
        customername: encodeURIComponent(this.appDataService.customerName),
        customerId: encodeURIComponent(this.appDataService.customerID),
      }
    ]);

  }

  // route to overview page and load respective customer data if not matching
  goToOverview() {
    this.cancel();
    if (!this.isCustomerMatching) {
      this.qualService.qualification.accountName = this.appDataService.customerName = this.prospectDetails.prospectName;
      this.appDataService.customerID = this.prospectDetails.prospectKey;
      this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
      this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
      this.goToCustomerOverview();
    }
  }

  // if switched set the values from this method
  customerSwitched() {
    this.isSwitched = true;
    this.isCustomerMatching = true;
  }

  // this method will call qual list of the customer
  goToCustomerOverview() {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.qualService.listQualification().subscribe((response: any) => {
      if (response) {
        if (response.messages && response.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
         
          try {
            if (response.data == null) {
              // No qualifications created before, show create qual UI
              this.isDisableCreate = true;
              this.showCreateQual = true;
              this.showQualList = false;
              return;
            }
            if (response.data.length > 0) {
              // Qualifications were creted before, show them
              this.showCreateQual = false;
              this.showQualList = true;
              this.isDisableCreate = false;
              this.qualData.data = response.data;
              this.rowData = this.qualData.data;
              // this.appendId();
              this.qualService.qualListData = response;
            }
            // if(response.favorite){
            this.appDataService.isFavorite = response.favorite === true ? 1 : 0;
            // }
          } catch (error) {
            this.isDisableCreate = true;
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.isDisableCreate = true;
          this.messageService.displayMessagesFromResponse(response);
        }
      }
    });

    if (this.appDataService.qualListForDeal) {
      this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, true);
      this.qualService.showDealIDInHeader = true;
    } else {
      this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, false);
    }
  }

  globalSwitchChange(event) {
    if (event) {
      this.qualService.qualsSharedWithMe().subscribe((response: any) => {
        // console.log(response);
        if (!response.error && response.data) {
          response.data.forEach(element => {
            this.qualData.data = response.data;
            this.qualService.qualListData = response;
            this.qualData.isCreatedByMe = false;
            this.qualService.isCreatedByMe = false;
            this.rowData = this.qualData.data;
            this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(this.appDataService.isTwoTierUser(element.buyMethodDisti) , element.distiDeal)//(this.is2tPartner && data.distiDeal) ? true : true;
            this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(element.buyMethodDisti,element.distiInitiated);
         
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.rowData);
              this.gridOptions.api.redrawRows();
            } else {
              // this.gridOptions = <GridOptions>{
              // onGridReady: () => {
              this.gridOptions.rowData = this.rowData;
              // }
              // };
            }
            // this.appendId();
          });
        } else {
          this.qualData.data = [];
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    } else {
      this.getQualData();
    }
  }

  focusDealIdInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }


  onGridReady(event) {
    this.getTableColumnsData();
    this.getTableData();

  }

  getTableColumnsData() {
    this.qualService.getColumnsData().subscribe((response) => {
      if (response) {
        this.columnDefs = response;
        for (let i = 0; i < this.columnDefs.length; i++) {
          const column = this.columnDefs[i];
          if (column['field'] === 'qualName') {
            column.cellRenderer = this.getQualName;
            column.cellClass = 'more-dropdown';
          }
          if (column['field'] === 'status') {
            column.cellRenderer = this.getStatusStyle;
          }
          if (column['field'] === 'partnerDeal') {
            column.cellRenderer = this.getDealType;
          }
          if (column['field'] === 'customerName') {
            column.cellRenderer = this.getCustName;
          }
        }
      }
    });
  }

  getDealType(params) {
    return (params.value ? 'Partner Led' : 'Cisco Led')
  }

  getQualName(params) {
    const actionDrop =
      "<div class='shareDiv'><span class='icon-more-link'></span><div class='dropdown-menu' aria-labelledby='mainDropdown'><ul><li><a class='dropdown-item deleteQualification' href='javascript:void(0)'>Delete</a></li><li><a class='dropdown-item manageTeamQual' href='javascript:void(0)'>Manage Team</a></ul></div></div>";
    return '<span class="text-link">' + params.value + actionDrop + '</span>';
  }

  onCellClicked($event) {
    const dropdownClass = $event.event.target.classList.value;
    const isDeleteQual = dropdownClass.search('deleteQualification');
    if (isDeleteQual > -1) {
      this.deleteQual($event.data, $event.id);
    } else {
      const isManageTeam = dropdownClass.search('manageTeamQual');
      if (isManageTeam > -1) {
        this.openManageModal($event.data);
      } else if ($event.colDef.field === 'qualName') {
        this.viewQualSummary($event.data);
      }
    }
  }
  viewQualSummary(qualObj) {
    this.qualService.toProposalSummary = false;
    this.qualService.viewQualSummary(qualObj);
  }

  getStatusStyle(params) {
    if (params.value.trim() === 'In Progress'.trim()) {
      return '<span style="color:#f49138">' + params.value + '</span>';
    } else {
      return '<span style="color:#6cc04a">' + params.value + '</span>';
    }
  }

  getCustName(params) {
    return '<span style="color:black">' + params.value + '</span>';
  }

  toggleView() {
    this.displayGridView = !this.displayGridView;
  }

  getTableData() {
    // this.qualService.getData().subscribe((res) => {
    //   this.rowData = res;
    //   this.gridOptions.api.setRowData(this.rowData);
    //   this.gridOptions.api.sizeColumnsToFit();
    // });
    // this.rowData = this.qualData.data;
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  // appendId(){
  //   for(let i =0; i < this.rowData.length; i++){
  //     this.rowData[i].qualName = this.rowData[i].qualName + ' - (' + this.rowData[i].id + ')';
  //   }
  // }

  openManageModal(qualObj) {
    this.qualService.getCustomerInfo(qualObj.qualId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          try {
            if (res.data) {
              const data = res.data;
              this.qualService.qualification.name = data.qualName;
              this.qualService.qualification.qualID = data.id;
              this.qualService.qualification.extendedsalesTeam = res.data.extendedSalesTeam;
              this.qualService.qualification.cxTeams = res.data.cxTeams;
              this.qualService.qualification.cxDealAssurerTeams = res.data.assurersTeams;
              this.qualService.qualification.distributorTeam = res.data.distiTeams;

              if (res.data.distiInitiated)  {
                   this.qualService.qualification.distiInitiated = res.data.distiInitiated;
              }else {
                   this.qualService.qualification.distiInitiated = false;
              }
              this.qualService.qualification.softwareSalesSpecialist = res.data.saleSpecialist;
              this.qualService.qualification.partnerTeam = res.data.partnerTeams;
              this.qualService.qualification.createdBy = res.data.createdBy;
              this.qualService.qualification.partnerDeal = res.data.partnerDeal;
              this.qualService.qualification.dealId = res.data.dealId;
              if (data.deal.accountManager) {
                this.qualService.qualification.accountManager.firstName = data.deal.accountManager.firstName;
                this.qualService.qualification.accountManager.lastName = data.deal.accountManager.lastName;
                this.qualService.qualification.accountManager.emailId = data.deal.accountManager.emailId;
                // added for getting userId of account Manager
                this.qualService.qualification.accountManager.userId = data.deal.accountManager.userId;
                this.qualService.qualification.accountManagerName = data.am;
              }
              if (data.cam) {
                this.qualService.qualification.cam = data.cam;
              }
              const modalRef = this.modalVar.open(ManageTeamMembersComponent, { windowClass: 'manage-team' });
              // modalRef.componentInstance.extentedSalesTeam = res.data.extendedSalesTeam;
              // modalRef.componentInstance.dedicatedSalesTeam = res.data.saleSpecialist;
              modalRef.result.then((result) => {
                qualObj.salesTeam = result.ciscoTeam.join(', ');
                qualObj.salesTeamList = result.ciscoTeam;
              });
            }
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        }
      }
    });
  }
  selectQual(value) {
    this.selectedQualView = value;
    this.openQualDrop = false;
    if (this.selectedQualView === 'Created by Me') {
      this.qualService.isCreatedByMe = true;
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.MY_QUAL');
      this.getQualData();
    } else if (this.selectedQualView === 'Shared with Me') {
      this.qualService.isCreatedByMe = false;
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.qual.SHARED_QUAL');
      this.globalSwitchChange(true);
    }
  }

  onViewDrop(event) {
    this.openQualDrop = false;
  }
  onClickedOutside($event) {
    
  }

  // method to reset Subscriptions data if swithched to look up deal
  resetSubData(){
    this.subscriptionList = [];
    this.isSubIdSelected = false;
    this.isSubscriptiosDataPresent = false;
    this.issubscriptionDataLoaded = false;
    this.referenceSubscriptionId = '';
  }
  
  // method to select dealLookup or change sub
  selectDealLookUp(event){
    this.subscriptionList = [];
    this.messageService.clear();
    if(event.target.value === 'lookup'){
      this.resetSubData();
      this.qualService.displaySmartAccountInHeader = false;
      this.isChangeSubSelected = false;
    } else {
      this.loadEASubscribtion();
    }
  }

  loadEASubscribtion(){
    this.qualEADealId = '';
    this.qualService.displaySmartAccountInHeader = true;
    this.updateDealLookUpID(); // to reset look up deal data
    this.isChangeSubSelected = true;
    this.setSubData(); // method to call api and set subdata
    this.qualService.disabledContinueButton = false;
    this.qualService.validateChangeSubAccess();
  }
  // method to get subdata from api
  setSubData() {
    this.qualService.getSubscriptions().subscribe((res: any) => {
      if(res && !res.error) {
        this.issubscriptionDataLoaded = true;
        if(res.data){
          this.isSubscriptiosDataPresent = true;
          this.subscriptionList = res.data;
        } else {
          this.subscriptionList = [];
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });

  }

  // method after subscription selected form subscriptions list or lookup subscription modal
  selectSubscription(sub){
    if(sub === 'deselect'){
      this.isSubIdSelected = false;
      this.referenceSubscriptionId = '';
      return;
    }
    this.isSubIdSelected = true;
    this.referenceSubscriptionId = sub.subscriptionId;
  }

  
  // methdod to call api and get punch out url to subUi page after selecting subId and clicked continue 
  continueWithSubId(){
    if (this.qualService.changSubAccess) {
      this.qualService.goToCcwWithSubId(this.referenceSubscriptionId).subscribe((res:any) => {
        if(res && res.data && !res.error) {
          if(res.data){
            window.open(res.data, '_self');
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      const modalRef = this.modalVar.open(SubscriptionAccessComponent, { windowClass: 'subscriptionaccess-modal'});
      modalRef.result.then((result) => {
        this.qualService.disabledContinueButton = true;
        return;
      });
    }  
  }

  externalSubUiLanding(hashValue) {
    this.qualService.SubUiExternalAPiCall(hashValue).subscribe((response: any) => {
      this.blockUiService.spinnerConfig.unBlockUI();
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if (response && !response.error && response.data) {
        this.isSubUiLandingDataLoaded = true;
        // if redirect, open the redirect url
        if (response.data.redirect) {
          window.open(response.data.redirectUrl, '_self');
          return;
        }
        this.appDataService.customerID = response.data.customerId;
        this.appDataService.customerName = response.data.customerName;
        this.qualEADealId = response.data.dealId;
        this.referenceSubscriptionId = response.data.subRefId;
        this.createNew()
        this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
        this.setDealAndSubData(response.data); // enable and use this method to set deal data after we get dealProspecct from api
        this.matchDealId();
        if (this.appDataService.isPatnerLedFlow) {
          this.appDataService.qualListForDeal = true;
          this.qualService.dealData.dealId = this.qualService.qualification.dealId;
          this.qualService.dealData.dealStatus  = this.newQualData.dealStatusDesc;
          this.qualService.dealData.dealName = this.newQualData.optyName;
          this.qualService.loaData.loaSigned = this.qualService.qualification.loaSigned;
          if (this.qualService.loaData.loaSigned) {
            this.appDataService.loccValidTill = response.data.dealProspect.signatureValidDate ? response.data.dealProspect.signatureValidDate : '--';
            this.appDataService.signatureValidDate = this.appDataService.loccValidTill;
          }
          this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, true);
          this.qualService.showDealIDInHeader = true;
        }
        if( response.data.subscriptionDeal && response.data.subscriptionDeal.subscriptionSearch){
          this.subscriptionList = response.data.subscriptionDeal.subscriptionSearch.subscriptions ? response.data.subscriptionDeal.subscriptionSearch.subscriptions: [];
        } else {
          this.subscriptionList = [];
        }
        // this.lookupSelectedSub();
      } else {
        this.isSubUiLandingDataLoaded = false;
        this.isDisableCreate = true;
        this.messageService.displayMessagesFromResponse(response);
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
    });
    //   const response = {
    //     "rid": "9b87af5a-ed03-4b36-892a-2ecc522a27dc",
    //     "user": "nekedia",
    //     "error": false,
    //     "data": {
    //         "dealId": "19627545",
    //         "prospectKey": 128,
    //         "customerGuId": 4460740,
    //         "customerName": "GOOGLE INC",
    //         "partnerBeGeoId": 639324,
    //         "partnerName": "ConvergeOne, Inc.",
    //         "subRefId": "Sub429426"
    //     },
    //     "currentDate": "2020-05-19T20:45:06.119+0000"
    // }
    // this.appDataService.customerID = response.data.prospectKey;
    // this.appDataService.customerName = response.data.customerName;
    // this.qualEADealId = response.data.dealId;
    // this.referenceSubscriptionId = response.data.subRefId;
    // this.createNew()
    // this.appDataService.custNameEmitter.emit(this.appDataService.customerName);
    // this.showLookup();
    // this.matchDealId();
    // this.lookupSelectedSub();
  }

  lookupSelectedSub(){
    this.createProposalService.subscriptionLookup(this.referenceSubscriptionId, true).subscribe((res: any) => {
      if(res && !res.error) {
        this.issubscriptionDataLoaded = true;
        if(res.data){
          this.isSubscriptiosDataPresent = true;
          this.subscriptionList = res.data.subscriptions ? res.data.subscriptions : [];
        } else {
          this.subscriptionList = [];
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    })
  }

  // method to set selected subid from lookup modal and call redirect url for punching out to subUi
  conntiueWithSubFromLookUp(selectedSubId){
    if(selectedSubId){
      this.referenceSubscriptionId = selectedSubId;
      this.continueWithSubId();
    }
  }

  // method to set deal details after deal lookup and sub ui landing
  setDealAndSubData(data) {

    if (this.isSubUiFlow) { // set the deal data for subuiflow
      this.newQualData = data.deal;
      this.qualService.qualification.loaSigned = data.loaSigned;
    } else {
      this.newQualData = data.dealDetails;
      if (data.prospectDetails) {
        this.isProspectFound = true;
        this.prospectDetails = data.prospectDetails[0];
      } else {
        this.prospectDetails = {};
        this.isProspectFound = false;
      }
      this.isCustomerMatching = data.matching;
      this.qualService.qualification.loaSigned = data.loccSigned;
    }
    this.qualService.qualification.partnerDeal = data.partnerDeal;
    this.isPartnerDeal = data.partnerDeal;
    if (this.partnerLedFlow && this.partnerCreateFlow) {
      this.appDataService.customerID = this.prospectDetails.prospectKey;
      this.appDataService.customerName = this.prospectDetails.prospectName;
    }

    this.qualService.qualification.dealInfoObj = this.newQualData;
    this.qualService.qualification.dealId = this.newQualData.dealId;
    if (this.newQualData.accountManager) {
      this.qualService.qualification.accountManager = this.newQualData.accountManager;
      this.qualService.qualification.accountManagerName = this.newQualData.accountManager.firstName + ' ' + this.newQualData.accountManager.lastName;
      this.qualService.emailID = this.newQualData.accountManager.emailId;
    }
    this.qualService.qualification.name = this.qualEAQualificationName = this.newQualData.optyName;
    this.isQualNameInvalid = false;
    this.qualService.qualification.eaQualDescription = this.eaQualDescription;
    this.qualService.qualification.accountAddress = this.newQualData.accountAddress;
    this.qualService.qualification.accountName = this.newQualData.accountName;
    if (this.isPartnerDeal) {
      this.qualService.qualification.primaryPartnerName = data.partnerInfo.beGeoName;
      // if (data.loaCustomerContact) {
      //   this.qualService.qualification.customerInfo.repName = data.loaCustomerContact.repName;
      //   this.qualService.qualification.customerInfo.repTitle = data.loaCustomerContact.repTitle;
      //   this.qualService.qualification.customerInfo.repEmail = data.loaCustomerContact.repEmail;
      //   this.qualService.qualification.customerInfo.repFirstName = data.loaCustomerContact.repFirstName;
      //   this.qualService.qualification.customerInfo.repLastName = data.loaCustomerContact.repLastName;
      // }
    } else {
      this.qualService.qualification.primaryPartnerName = this.newQualData.primaryPartnerName;
    }
    this.qualService.qualification.address.addressLine1 = this.qualService.qualification.legalInfo.addressLine1 = this.newQualData.accountAddressDetail.addressLine1;
    this.qualService.qualification.address.addressLine2 = this.qualService.qualification.legalInfo.addressLine2 = this.newQualData.accountAddressDetail.addressLine2;
    this.qualService.qualification.address.city = this.qualService.qualification.legalInfo.city = this.newQualData.accountAddressDetail.city;
    this.qualService.qualification.address.country = this.qualService.qualification.legalInfo.country = this.newQualData.accountAddressDetail.country;
    this.qualService.qualification.address.state = this.qualService.qualification.legalInfo.state = this.newQualData.accountAddressDetail.state;
    this.qualService.qualification.address.zip = this.qualService.qualification.legalInfo.zip = this.newQualData.accountAddressDetail.zip;
    this.qualService.qualification.customerInfo.scope = this.constantsService.NONE;
    this.qualService.qualification.federal = 'no';

    this.resultFound = true;
    this.errorDealID = false;
    this.isSwitched = false;
    if (this.navigateToSummary) {
      this.qualService.comingFromDocCenter = false;
      // setting qualification data in session
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      sessionObject.qualificationData = this.qualService.qualification;
      sessionObject.comingFromDocCenter = this.qualService.comingFromDocCenter;
      this.appDataService.setSessionObject(sessionObject);

      this.router.navigate(['qualifications/editQual']);
    }
    // to check and show message if cisco led uses partner deal for which locc not signed or initiated while deal look up to create qualification
    if (!this.appDataService.isPatnerLedFlow && this.qualService.qualification.partnerDeal && !this.qualService.qualification.loaSigned && !data.loccInitiated && !data.loccOptional) {
      this.showLoccMsg = true;
    }

  }

  changeLindSmartAccount(smartAccountobj) {
    this.appDataService.changeSmartAccountLink(smartAccountobj).subscribe((response: any) => {
      try {
        if (response && !response.error) {
          this.appDataService.linkedSmartAccountObj.id = smartAccountobj.smartAccountId;
          this.appDataService.linkedSmartAccountObj.name = smartAccountobj.smartAccountName;
          if(this.isChangeSubSelected){
            this.loadEASubscribtion();
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      } catch (error) {
        this.messageService.displayUiTechnicalError(error);
      }
    });
  }
}
// this.qualService.qualification.dealInfoObj = response.data;
