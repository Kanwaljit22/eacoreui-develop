import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { SubHeaderComponent } from '../shared/sub-header/sub-header.component';
import { MessageService } from '../shared/services/message.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ConstantsService, QualProposalListObj } from '../shared/services/constants.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { GridOptions } from 'ag-grid-community';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReOpenComponent } from '@app/modal/re-open/re-open.component';
import { PermissionEnum } from '@app/permissions';
import { PermissionService } from '@app/permission.service';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { map } from 'rxjs/operators';


@Injectable()
export class QualificationsService {

  static readonly IN_PROGRESS_STATUS = 'In Progress';
  isQualCreated = false;
  dealIdUpdateEmitter = new EventEmitter();
  partnerDealLookUpEmitter = new EventEmitter();
  myDealQualCreateLoccEmitter = new EventEmitter();
  createQualFlow = false;
  archName: any;
  customerName: any;
  customerId: any;
  requestObj: any;
  eaQualDescription: string;
  emailID: string;
  displayName: string;
  resultMatch = false;
  readOnlyState = false;
  isShowDealLookUp = false;
  myDealQualCreateFlow = false;
  qualification = {
    dealId: '',
    title: '',
    qualID: '',
    prevChangeSubQualId: '',
    status: '',
    dealInfoObj: {},
    name: '',
    accountManager: { 'firstName': '', 'lastName': '', 'emailId': '', 'userId': '' },
    customerInfo: {
      'accountName': '',
      'address': '',
      'smartAccount': '',
      'preferredLegalName': '',
      'scope': '',
      'affiliateNames': '',
      'repName': '',
      'repTitle': '',
      'repEmail': '',
      'filename': '',
      'repFirstName': '',
      'repLastName': '',
      'phoneCountryCode': '',
      'phoneNumber': '',
      'dialFlagCode': ''
    },
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
    subscription: {},
    salesTeamList: [],
    permissions: {},
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
    createdBy: '',
    partnerDeal: false,
    loaSigned: false,
    distiInitiated:false,
    federal: 'no'
  };
  additionalCustomerContacts: [{
    'accountName': '',
    'address': '',
    'smartAccount': '',
    'preferredLegalName': '',
    'scope': '',
    'affiliateNames': '',
    'repName': '',
    'repTitle': '',
    'repEmail': '',
    'filename': '',
    'repFirstName': '',
    'repLastName': '',
    'id':'',
    'phoneNumber': '',
    'phoneCountryCode': '',
    'dialFlagCode': ''
  }];
  comingFromDocCenter = false;
  toProposalSummary = false;
  isCreatedbyQualView = true;
  isCreatedByMe = true;
  isCustomerScopeVisible = true;
  fileFormatError = false;
  isFederalCustomer = false;
  public gridOptions: GridOptions;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  roadMapEmitter = new EventEmitter<any>();
  subscribers: any = {};
  qualListData: QualProposalListObj;
  emptyListEmitter = new EventEmitter();
  loaData: any = {};
  showDealIDInHeader = false;
  camEmitter = new EventEmitter();
  flowSet = false;
  dealData = {
    dealId: '',
    dealStatus: '',
    dealName: ''
  };
  loadUpdatedQualListEmitter = new EventEmitter<any>(); // emitter for loading qual list after clone/change deal success
  loadQualSummaryEmitter = new EventEmitter<any>();
  subRefID = '';
  changeSubscriptionDeal = false;
  loaCustomerContactUpdateEmitter = new EventEmitter<any>();
  renewalResponseData: any; // set to store renewal response data after saving selected subsbs in renewals page
  changSubAccessErrorMsg ='';
  changSubAccess = false;
  disabledContinueButton = false;
  isLoadSubheader = true; // set to false and stop subheader until data present if user routes from followon to qual summary 
  buyMethodDisti = false; // set buyMethodDisti flag from qualification
  twoTUserUsingDistiDeal = false;
  isDistiWithTC = false;
  displaySmartAccountInHeader = false;

  constructor(private http: HttpClient, public appDataService: AppDataService, public blockUiService: BlockUiService,
    private messageservice: MessageService, private router: Router, public messageService: MessageService, private modalVar: NgbModal, private proposalDataService: ProposalDataService, private utilitiesService: UtilitiesService,
    public constantsService: ConstantsService,
    private permissionService: PermissionService) { }

  getdealIdData(dealLookUpRequest: any) {
    return this.http.get(this.appDataService.getAppDomain + 'api/lookup/deal?d=' + dealLookUpRequest.dealId)
      .pipe(map(res => res));
  }

  loccLandingApiCall(dealId, quoteId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/locc-landing?did=' + dealId + '&qid=' + quoteId)
      .pipe(map(res => res));
  }
  // api to call locc details
  loccDetailApi(dealId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/locc-detail?did=' + dealId)
      .pipe(map(res => res));
  }

  // unsubscribe after repopenoing qualification
  unSubscribe() {
    if (this.subscribers.roadMapEmitter) {
      this.subscribers.roadMapEmitter.unsubscribe();
    }
  }
  // for re-open qualification on every page
  reopenQual() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    const modalRef = this.modalVar.open(ReOpenComponent, { windowClass: 're-open' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        const reqObj = this.getQualInfo();
        reqObj['qualStatus'] = QualificationsService.IN_PROGRESS_STATUS;
        this.updateQualStatus(reqObj).subscribe((response: any) => {
          if (response) {
            if (!response.error) {
              if (response.permissions && response.permissions.featureAccess && response.permissions.featureAccess.length > 0) {
                this.permissionService.qualPermissions = new Map(response.permissions.featureAccess.map(i => [i.name, i]));
              } else {
                this.permissionService.qualPermissions.clear();
              }

              // Set local permission for debugger
              this.permissionService.isProposalPermissionPage(false);

              this.setQualPermissions();
              this.appDataService.roadMapPath = false;
              this.qualification.qualStatus = response.qualStatus;
              this.appDataService.subHeaderData.subHeaderVal[2] = QualificationsService.IN_PROGRESS_STATUS;
              this.updateSessionQualData();
              this.appDataService.isProposalIconEditable = true;
              // set the value of roadMap in emitter for all other pages using subscribe
              this.roadMapEmitter.emit(this.appDataService.roadMapPath);
            }
          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        });
      }
    });
  }

  setQualPermissions() {
    // check edit access for the qualification from the permission
    this.permissionService.qualEdit = this.permissionService.qualPermissions.has(PermissionEnum.QualEdit);

    // check reopen access for the qualification from the permission
    this.permissionService.qualReOpen = this.permissionService.qualPermissions.has(PermissionEnum.QualReOpen);

    // check manage team access for the qualification from the permission
    this.permissionService.qualManageTeam = this.permissionService.qualPermissions.has(PermissionEnum.QualManageTeam);

    this.appDataService.isEditDealIdAllowed = this.permissionService.qualPermissions.has(PermissionEnum.EditDealId);

    this.permissionService.qualFederalCustomer = this.permissionService.qualPermissions.has(PermissionEnum.QualFederalCustomer);

    // flag to allow initiate followon
    this.appDataService.allowInitiateFollowOn = this.permissionService.qualPermissions.has(PermissionEnum.ProposalInitiateFollowon);
  }

  // method to check and set qual permissions and roSalesTeam
  setRoSalesTeamAndQualPermissions(data) {
    // check and set qual permissions
    if (data.permissions && data.permissions.featureAccess && data.permissions.featureAccess.length > 0) {
      this.qualification.permissions = data.permissions;
      this.permissionService.qualPermissions = new Map(data.permissions.featureAccess.map(i => [i.name, i]));
    } else {
      this.permissionService.qualPermissions.clear();
    }
    this.setQualPermissions();
    // check and set salesTeamList
    if (data.salesTeamList) {
      this.qualification.salesTeamList = data.salesTeamList;
    } else {
      return;
    }
    // check for rosales team person if he doesn't have delete access and from the salesTeamlist with the full name
    if (!this.permissionService.qualPermissions.has(PermissionEnum.QualDelete)) {
      const salesTeam = data.salesTeamList.map(item => item.trim());
      for (let i = 0; i < salesTeam.length; i++) {
        if (salesTeam[i] === (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName)) {
          this.appDataService.roSalesTeam = true;
          break;
        } else {
          this.appDataService.roSalesTeam = false;
        }
      }
    } else {
      this.appDataService.roSalesTeam = false;
    }

  }

  validateQualName() {
    let requestObj = {};
    requestObj['userId'] = this.appDataService.userId;
    requestObj['archName'] = this.appDataService.archName;
    requestObj['customerId'] = this.appDataService.customerID;
    requestObj['qualName'] = this.qualification.name;
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/validateName', requestObj)
      .pipe(map(res => res));
  }

  createQual() {
    let requestObj = {};
    // requestObj['userId'] = this.appDataService.userId;
    requestObj['archName'] = this.appDataService.archName;
    requestObj['customerId'] = this.appDataService.customerID;
    requestObj['customerName'] = this.appDataService.customerName;
    requestObj['dealId'] = this.qualification.dealId;
    requestObj['qualName'] = this.qualification.name;
    requestObj['description'] = this.qualification.eaQualDescription;

    // Add federal flag
    if (this.isFederalCustomer) {
      requestObj['federalCustomer'] = 'Y';
    } else {
      requestObj['federalCustomer'] = 'N';
    }

    // requestObj['Partner'] = '';
    requestObj['am'] = this.qualification.accountManager;
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/create', requestObj)
      .pipe(map(res => res));
  }

  deleteQual(qualId: number) {
    if (qualId && qualId > 0 && this.appDataService.userId) {
      return this.http.delete(this.appDataService.getAppDomain + 'api/qualification?u=' + this.appDataService.userId + '&q=' + qualId);
    }
  }

  updateQual(requestObj) {
    if (!requestObj) {
      requestObj = this.getQualInfo(); // Todo : This code should be removed once all callers pass me this request
    }

    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/update', requestObj)
      .pipe(map(res => res));
  }

  getQualInfo() {
    const requestObj = {};

    // requestObj['userId'] = this.appDataService.userId;
    requestObj['archName'] = this.appDataService.archName === '' ? AppDataService.ARCH_NAME : this.appDataService.archName;
    requestObj['customerId'] = this.appDataService.customerID;
    requestObj['dealId'] = this.qualification.dealId;
    requestObj['qualName'] = this.qualification.name;
    requestObj['description'] = this.qualification.eaQualDescription;
    requestObj['am'] = this.qualification.accountManager;
    requestObj['qualId'] = this.qualification.qualID;
    requestObj['qualStatus'] = this.qualification.qualStatus;
    requestObj['customerContact'] = this.qualification.customerInfo;
    // requestObj['customerContact']['fileName'] = this.qualification.customerInfo.filename;
    // requestObj['scope'] = this.qualification.customerInfo.scope;
    requestObj['customerContact']['preferredLegalAddress'] = this.qualification.legalInfo;
    requestObj['cam'] = this.qualification.cam;

    // Add federal flag
    if (this.qualification.federal === 'yes') {
      requestObj['federalCustomer'] = 'Y';
    } else {
      requestObj['federalCustomer'] = 'N';
    }

    // requestObj['legalInfo'] = this.qualification.legalInfo;
    return requestObj;
  }

  getQualGeographyColumn() {
    const data = this.appDataService.getDetailsMetaData('QUAL_GEOGRAPHY');
    this.displayName = data.displayName;
    return data;
  }

  listGeography() {
    const requestObj = {};
    // requestObj['userId'] = this.appDataService.userId;
    requestObj['qualId'] = this.qualification.qualID;
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/listGeography', requestObj)
      .pipe(map(res => res));
  }

  listQualification() {
    const requestObj = {};
    // requestObj['userId'] = this.appDataService.userId;
    //  requestObj['archName'] = this.appDataService.archName;
    requestObj['customerId'] = this.appDataService.customerID;
    if (this.appDataService.isPatnerLedFlow) {
      requestObj['dealId'] = this.appDataService.dealID;
    }
    if(this.appDataService.isQualOrPropListFrom360Page){
      requestObj['limit'] = 3;
    }
    // requestObj['customerId'] =2;
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/list', requestObj)
      .pipe(map(res => res));
  }

  prepareSubHeaderObject(screenName, isEditQualification: boolean) {
    this.appDataService.subHeaderData.custName = this.appDataService.customerName;
    this.appDataService.subHeaderData.favFlag = false;
    this.appDataService.subHeaderData.moduleName = screenName;
    if (isEditQualification) {
      const subHeaderAry = new Array<any>();

      if (this.appDataService.qualListForDeal) {
        this.appDataService.subHeaderData.custName = this.dealData.dealName;
        subHeaderAry.push(this.dealData.dealId);
        subHeaderAry.push(this.dealData.dealStatus);
      } else {
        this.appDataService.subHeaderData.custName = this.qualification.name;
        subHeaderAry.push(this.qualification.dealId);
        subHeaderAry.push(this.qualification.accountManagerName);
        subHeaderAry.push(this.qualification.qualStatus);
      }
      this.appDataService.subHeaderData.subHeaderVal = subHeaderAry;
    } else {
      this.appDataService.subHeaderData.subHeaderVal = null;
    }
    this.isLoadSubheader = true; // set to true after subheader data is prepared
  }
  // change qualification status value to In Progress
  updateQualStatus(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/reopen', requestObj)
      .pipe(map(res => res));
  }

  updateSessionQualData(filterPartnersTeam?, partnerBeGeoId?) {
    this.getCustomerInfo().subscribe((response: any) => {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      sessionObject.qualificationData = response.data; // this.qualification;
      this.qualification.customerInfo = {
        'accountName': '',
        'address': '',
        'smartAccount': '',
        'preferredLegalName': '',
        'scope': '',
        'affiliateNames': '',
        'repName': '',
        'repTitle': '',
        'repEmail': '',
        'filename': '',
        'repFirstName': '',
        'repLastName': '',
        'phoneNumber': '',
        'phoneCountryCode': '',
        'dialFlagCode':''
      };
      this.qualification.legalInfo = {
        'addressLine1': '',
        'addressLine2': '',
        'city': '',
        'country': '',
        'state': '',
        'zip': ''
      };

      // setting qual status from API response
      this.qualification.qualStatus = response.data.qualStatus;
      this.qualification.partnerDeal = response.data.partnerDeal;
      this.qualification.loaSigned = response.data.loaSigned;
      this.qualification.createdBy = response.data.qualificationCreatedByName;
      this.qualification.prevChangeSubQualId =  response.data.prevChangeSubQualId;
      this.qualification.name = response.data.qualName;

      if (response.data.federalCustomer) {
        this.qualification.federal = response.data.federalCustomer === 'Y' ? 'yes' : 'no';
      } else {
        this.qualification.federal = 'no';
      }
      if (response.data.customerContact.preferredLegalAddress) {
        this.qualification.legalInfo = response.data.customerContact.preferredLegalAddress;
      }
      if (response.data.customerContact) {
        this.qualification.customerInfo.affiliateNames = response.data.customerContact.affiliateNames;
        this.qualification.customerInfo.preferredLegalName = response.data.customerContact.preferredLegalName;
        this.qualification.customerInfo.repName = response.data.customerContact.repName;
        this.qualification.customerInfo.repEmail = response.data.customerContact.repEmail;
        this.qualification.customerInfo.repTitle = response.data.customerContact.repTitle;
        this.qualification.customerInfo.phoneCountryCode = response.data.customerContact.phoneCountryCode;
        this.qualification.customerInfo.phoneNumber = response.data.customerContact.phoneNumber;
        this.qualification.customerInfo.dialFlagCode = response.data.customerContact.dialFlagCode;
        this.qualification.customerInfo.scope = response.data.customerContact.scope ? response.data.customerContact.scope : 'None';
        this.qualification.customerInfo.filename = (response.data.customerContact.fileName !== undefined) ?
        response.data.customerContact.fileName : '';
      }
      if (response.data.customerId) {
        this.appDataService.customerID = response.data.customerId;
      }
      if (response.data.deal.quotes && response.data.deal.quotes.length > 0) {
        this.appDataService.quoteIdForDeal = response.data.deal.quotes[0].quoteId;
      }
      if (response.data.deal) {
        this.qualification.dealInfoObj = response.data.deal;
        this.dealData.dealId = response.data.deal.dealId;
        this.dealData.dealStatus = response.data.deal.dealStatusDesc;
        this.dealData.dealName = response.data.deal.optyName;
      }
      // to get cam and partner teams data
      if (response.data.partnerTeams) {
        this.qualification.partnerTeam = response.data.partnerTeams;
        if(filterPartnersTeam){
          this.qualification.partnerTeam = this.qualification.partnerTeam.filter(data => data.beGeoId == partnerBeGeoId);
        }
      }

      // check and set dedicated software salesSpecialist data
      if (response.data.saleSpecialist) {
        this.qualification.softwareSalesSpecialist = response.data.saleSpecialist;
      }

      // check and set extended sales team data if present
      if (response.data.extendedSalesTeam) {
        this.qualification.extendedsalesTeam = response.data.extendedSalesTeam;
      }

      // check and set CX team data if present
      if (response.data.cxTeams) {
        this.qualification.cxTeams = response.data.cxTeams;
      }
      if(response.data.assurersTeams){
        this.qualification.cxDealAssurerTeams = response.data.assurersTeams;
      }

      // check and set distributor team data if present
      if (response.data.distiTeams) {
        this.qualification.distributorTeam = response.data.distiTeams;
      }

      // check and set distributor team data if present
      if (response.data.distiInitiated) {
        this.qualification.distiInitiated = response.data.distiInitiated;
      }else {
        this.qualification.distiInitiated = false;
      }

      if (response.data.cam) {
        this.qualification.cam = response.data.cam;
      }

      if(response.data.changeSubscriptionDeal){
        this.changeSubscriptionDeal = response.data.changeSubscriptionDeal;
      } else {
        this.changeSubscriptionDeal = false;
      }
      
      if(response.data.subscription && this.appDataService.displayChangeSub){
        this.qualification.subscription = response.data.subscription;
        this.subRefID = response.data.subRefId;
      } else {
        this.qualification.subscription = {};
        this.subRefID = '';
      }

      this.buyMethodDisti = response.data.buyMethodDisti ? true : false; // set buyMethodDisti flag
      this.camEmitter.emit();
      this.appDataService.setSessionObject(sessionObject);
    });

  }

  goToQualification() {
    if (!this.appDataService.isPatnerLedFlow) {
      // this.router.navigate(['/qualifications', {
      //   architecture: this.appDataService.archName
      //   , customername: this.appDataService.customerName
      //   , customerId: this.appDataService.customerID
      // }]);

      // Navigate to 360 qualification tab
      this.router.navigate([
        '/allArchitectureView',
        {
          architecture: encodeURIComponent(this.appDataService.archName),
          customername: encodeURIComponent(this.appDataService.customerName),
          customerId: encodeURIComponent(this.appDataService.customerID),
          selected: encodeURIComponent(this.constantsService.QUALIFICATION),
        }
      ]);

    } else {
      // this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
      // const sessionObject: SessionData = this.appDataService.getSessionObject();
      // sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
      // //this.qualService.isCreatedbyQualView = 'My Qual';
      // this.appDataService.setSessionObject(sessionObject);
      // this.appDataService.showEngageCPS = false;
      // this.router.navigate(['/qualifications']);

      const customerId = null;
      const dealId = this.qualification.dealId;
      // assigning deal data so that we can use it for header; not getting deal related data on the qual list page
      // this.qualService.dealData = dealData;
      // this flag is to manage header if partner is landing on qual lsit page for a deal.
      this.appDataService.qualListForDeal = true;
      this.router.navigate([
        'qualifications/create-qualifications',
        {
          custId: customerId,
          dId: dealId,
          qId: this.appDataService.quoteIdForDeal
        }
      ]);

    }
  }

  getQualListForDashboard() {
    return this.http.get(this.appDataService.getAppDomain + 'api/qualification/users/created-by-me'
    ).pipe(map(res => res));
  }

  qualsSharedWithMe() {
    return this.http.get(this.appDataService.getAppDomain + 'api/qualification/users/shared-with-me'
    ).pipe(map(res => res));
  }

  getQualHeader() {
    const requestObj = {};
    // requestObj['userId'] = this.appDataService.userId;
    requestObj['qualId'] = this.qualification.qualID;
    requestObj['customerId'] = this.appDataService.customerID;
    if (this.appDataService.customerID > 0) {
      return this.http.post(this.appDataService.getAppDomain + 'api/qualification/header', requestObj)
        .pipe(map(res => res));
    } else {
      return this.getCustomerInfo(this.qualification.qualID);
    }
  }

  getCustomerInfo(qualId?) {
    if (!qualId) {
      qualId = this.qualification.qualID;
    }
    const url = this.appDataService.getAppDomain + 'api/qualification/get?q=' + qualId;
    return this.http.get(url)
      .pipe(map(res => res));
  }


  // Below method added as a part of qualification view merge.

  viewQualSummary(qulaObj) {
    this.utilitiesService.changeMessage(true);
    this.qualification.qualID = qulaObj.id;
    this.qualification.name = qulaObj.qualName;
    if (qulaObj.status !== undefined) {
      this.qualification.qualStatus = qulaObj.status;
    }
    this.appDataService.customerName = qulaObj.customerName;
    // this.breadcrumbsService.showOrHideBreadCrumbs(true);
    this.qualification.qualID = qulaObj.id;
    this.appDataService.userDashboardFLow = '';
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
    // Below code is use to set read write access for a logged in User
    if (qulaObj.permissions && qulaObj.permissions.featureAccess && qulaObj.permissions.featureAccess.length > 0) {
      // check proposal/qual permissions and set the readWriteAccess
      if ((!this.toProposalSummary && qulaObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.QualEditName)) ||
      (this.toProposalSummary && qulaObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalEditName))) {
        this.appDataService.isReadWriteAccess = true;
        sessionObject.isUserReadWriteAccess = true;
      } else {
        this.appDataService.isReadWriteAccess = false;
        sessionObject.isUserReadWriteAccess = false;
      }
    } else {
      this.appDataService.isReadWriteAccess = false;
      sessionObject.isUserReadWriteAccess = false;
    }
    this.appDataService.setSessionObject(sessionObject);
    if (!this.toProposalSummary) {
      this.router.navigate(['qualifications/' + qulaObj.id]);
    } else {
      this.blockUiService.spinnerConfig.startChain();
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
    }

    // removing deal look up call from revisiting existing Qualification/Proposal
    // this.showLookup(qulaObj);
  }


  showLookup(qulaObj) {
    const dealLookUpRequest = {
      userId: this.appDataService.userId,
      dealId: qulaObj.dealId
    };
    // this.blockUiService.spinnerConfig.startChain();
    this.getdealIdData(dealLookUpRequest).subscribe(
      (response: any) => {
        if (!response.error && !response.messages) {
          // this.newQualData = response;
          this.appDataService.userDashboardFLow = '';
          this.qualification.dealInfoObj = response.data;
          this.qualification.dealId = response.data.dealId;
          if (response.data.accountManager) {
            this.qualification.accountManager = response.data.accountManager;
            this.qualification.accountManagerName = response.data.accountManager.firstName + ' ' + response.data.accountManager.lastName;
            this.emailID = response.data.accountManager.emailId;
          }
          this.qualification.name = qulaObj.qualName;
          // this.qualService.qualification.eaQualDescription = this.eaQualDescription;
          this.qualification.accountAddress = response.data.accountAddress;
          this.qualification.accountName = response.data.accountName;
          this.qualification.primaryPartnerName = response.data.primaryPartnerName;
          this.comingFromDocCenter = false;

          this.qualification.legalInfo = response.data.accountAddressDetail;
          // this.qualification.legalInfo.addressLine2 = response.data.accountAddressDetail.addressLine2;
          // this.qualification.legalInfo.city = response.data.accountAddressDetail.city;
          // this.qualification.legalInfo.state = response.data.accountAddressDetail.state;
          // this.qualification.legalInfo.country = response.data.accountAddressDetail.country;
          // this.qualification.legalInfo.zip = response.data.accountAddressDetail.zip;
          // setting qualification data in session
          const sessionObject: SessionData = this.appDataService.getSessionObject();
          sessionObject.qualificationData = this.qualification;
          sessionObject.comingFromDocCenter = this.comingFromDocCenter;
          sessionObject.custInfo.custName = qulaObj.customerName;
          sessionObject.customerId = qulaObj.prospectKey;
          sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
          sessionObject.custInfo.archName = AppDataService.ARCH_NAME;
          // Below code is use to set read write access for a logged in User
          if (qulaObj.permissions && qulaObj.permissions.featureAccess && qulaObj.permissions.featureAccess.some(
            permission => permission.name === PermissionEnum.QualEditName)) {
            this.appDataService.isReadWriteAccess = true;
            sessionObject.isUserReadWriteAccess = true;
          } else {
            this.appDataService.isReadWriteAccess = false;
            sessionObject.isUserReadWriteAccess = false;
          }
          if (this.toProposalSummary) {
            sessionObject.proposalDataObj = this.proposalDataService.proposalDataObject;
          }
          this.appDataService.setSessionObject(sessionObject);
          if (!this.toProposalSummary) {
            this.router.navigate(['qualifications/' + qulaObj.id]);
          } else {
            this.blockUiService.spinnerConfig.startChain();
            this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
          }
        } else { // In this scenario we need to display message below the text box.
          /*this.blockUiService.spinnerConfig.unBlockUI();
          this.errorMessage = 'No details found associated with the Deal Id. Please enter a valid Deal Id.';
          this.errorDealID = true;*/
          // to show error repsonse if api fails
          window.scrollTo(0, 0);
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }


  goToProposalSummary(proposalObj) {
    this.toProposalSummary = true;
    const qualObj = {};
    qualObj['id'] = proposalObj.qualId;
    qualObj['customerName'] = proposalObj.customerName;
    qualObj['dealId'] = proposalObj.dealId;
    qualObj['prospectKey'] = proposalObj.prospectKey;
    // setting the user access type.
    qualObj['userAccessType'] = proposalObj.userAccessType;
    qualObj['qualName'] = proposalObj.qualificationName;
    qualObj['permissions'] = proposalObj.permissions;
    this.proposalDataService.proposalDataObject.proposalId = proposalObj.id;
    this.appDataService.archName = AppDataService.ARCH_NAME;
    this.viewQualSummary(qualObj);
  }

  updateQualFromModal(json) {
    return this.http.put(this.appDataService.getAppDomain + 'api/qualification/' + this.qualification.qualID + '/workflow-immutable-parameter', json)
      .pipe(map(res => res));
  }

  // Below method is use to display grid view on proposal list page.

  getColumnsData() {
    return this.http.get('assets/data/qualifications-list-columns.json');
  }

  getData() {
    return this.http.get('assets/data/qual-list-data.json');
  }
  // Check if locc signature pending or unsigned
  loccSignaturePending() {

    let loccPending = false;
    if (this.loaData.document && this.loaData.document.status == ConstantsService.PENDING_STATUS) {
      loccPending = true;
    }
    return loccPending;
  }

  uploadFile(file, proposalId) {

    const formdata: FormData = new FormData();

    if (file && file.name && file.name.length > 0) {
      formdata.append('file', file);
    }

    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/upload/doc/pa-exception', formdata)
      .pipe(map(res => res));
  }

  // api to call qual clone with/without deal
  qualClone(changeDeal, reqObj) {
    if (changeDeal) {
      return this.http.post(this.appDataService.getAppDomain + 'api/qualification/clone-with-new-deal', reqObj).pipe(map(res => res));
    } else {
      return this.http.post(this.appDataService.getAppDomain + 'api/qualification/clone', reqObj).pipe(map(res => res));
    }
  }

  // api to call and getsubscriptions list for the customer
  getSubscriptions(){
    return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/?cid=' + this.appDataService.customerID).pipe(map(res => res));
  }

  // api to get redirect url to subUi after selecting SubId and continue
  goToCcwWithSubId(subId){
    return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/sub-ui-redirect-url/' + subId).pipe(map(res => res));
  }

  // api to call landin api for subui
  SubUiExternalAPiCall(hashValue) {
    return this.http.get(this.appDataService.getAppDomain + 'api/external/landing' + hashValue).pipe(map(res => res));
  }

  subscriptionLookup(subId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/search/' + subId).pipe(map(res => res));
  }

  // api to send selected subscription for renewal
  renewalSubscription(reqObj){
    return this.http.post(this.appDataService.getAppDomain + 'api/subscriptions/renewal/parameters', reqObj).pipe(map(res => res));
  }

  validateChangeSubAccess(){  
    if(this.appDataService.isPatnerLedFlow) {
      this.changSubAccess = true;
    } else {
      this.changeSubscriptionAccess().subscribe((response: any) => {
        if (response && !response.error) {
              if(response.data) {
                if(response.data.changeSubscriptionAccess){
                  this.changSubAccess = true;                
                }  else {
                  this.changSubAccessErrorMsg = response.data.message;
                  this.changSubAccess = false;
                }             
              } 
        } else if (response.error) {
            this.messageService.displayMessagesFromResponse(response);
        } else {
             this.messageService.displayUiTechnicalError();
        }
      });
    }
  }

  // api to get change sub access	
  changeSubscriptionAccess(){
    return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/user-role-permission?type=change_subscription').pipe(map(res => res));
  }
  
}

export interface ICam {
  firstName: string;
  lastName: string;
  camEmail: string;
  beGeoId: number;
  cecId: string;
  role: string;
}
