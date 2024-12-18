import { MessageType } from '@app/shared/services/message';
import { CustomerInfo } from './../../shared/services/app.data.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CustomerLegalWarningComponent } from '@app/modal/customer-legal-warning/customer-legal-warning.component';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { AddAffiliatesNameComponent } from '@app/modal/add-affiliates-name/add-affiliates-name.component';
import { Subscription } from 'rxjs';
import { CreateTcoComponent } from '@app/modal/create-tco/create-tco.component';
import { TcoDataService } from '@app/tco/tco.data.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { BreadcrumbsService } from '@app/core';
import { QualSummaryService } from '@app/qualifications/edit-qualifications/qual-summary/qual-summary.service';
import { MessageService } from '@app/shared/services/message.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { EditWhoInvolvedComponent } from '@app/modal/edit-who-involved/edit-who-involved.component';
import { InitiateDocusignWarningComponent } from '@app/modal/initiate-docusign-warning/initiate-docusign-warning.component';
import _ from "lodash";
import { UploadDocumentConfirmationComponent } from '@app/modal/upload-document-confirmation/upload-document-confirmation.component';
import { EditPartnerComponent } from "@app/modal/edit-partner/edit-partner.component";
@Component({
  selector: 'app-document-center-proposal-documents',
  templateUrl: './document-center-proposal-documents.component.html',
  styleUrls: ['./document-center-proposal-documents.component.scss']
})
export class DocumentCenterProposalDocumentsComponent implements OnInit, OnDestroy {

  data = {
    'editIcon': true,
    'changeTermName': true
  };
  newDocumentData: any = {};
  fileName = '';
  loaFileName = '';
  documentCenterData: any;
  fileNameInQueue: any = '';
  filesContainer = [];
  docuSignInfo = [];

  @ViewChild('file', { static: false }) fileRef: ElementRef;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  @ViewChild('downloadSignedCustPackageLink', { static: false }) private downloadSignedCustPackageLink: ElementRef;

  addSpecialistData = [];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };


  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  selectedOptions: IMultiSelectOption[];
  viewValue = [];
  selectedDropVal: any;
  @ViewChild('No', { static: false }) No: ElementRef;

  toggleTabsContainer: boolean[];
  toggleDocumentCenterTab: boolean[];
  toggleDocuSignTab: boolean[];
  toggleUploadingProgress: boolean[];
  toggleConfirmedUpload: boolean[];
  toggleBrowseTab: boolean[];

  docuSignContinueBtn: boolean[];
  docuSignInitiateBtn: boolean[];
  docuSignBackBtn: boolean[];
  docuSignSendAgainBtn: boolean[];
  docuSignWhoesInvolvedTag: boolean[];
  loaRequired = 'No';

  isAlreadyObtained = 'no';
  isNonStandard = false;
  isStandard = false;
  isContainsLOA = '';
  isContainsLOAAnswered = false;
  isDraftAgreement = 'yes';

  docuSignConfirmContainer: boolean[];
  docuSignConfirmLoaContainer: boolean[]; //  to show loaCutomerQuestion container
  docuSignPreviewContainer: boolean[];
  docuSignStatusPendingContainer: boolean[];
  docuSignStatusCompletedContainer: boolean[];
  docuSignCustomerReadyContainer: boolean[];

  sendAgainBtnDisable: boolean[];
  continueBtnDisable: boolean[];

  disableContinueForCustRep = true;
  uploadType = '';
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  fileFormatError = false;
  file: any;
  loaFile: any;
  signature = '';
  flag = 'Docusign';
  showCustomerTab = false;
  showProposalTab = true;

  //  check/uncheck signature on upload additional document
  uncheckSign = true;
  loaSigned = true;
  disableAffiliates = false;
  disableTcoCreate = false;
  subscription: Subscription;
  tcoCount = 0;
  proposalStatus = '';
  uploadedFileHasLoa = false;
  hasBaseDropZoneOver = false;
  fileDetail: any;
  loaFileDetail: any;
  isEnableProceed = false;
  oldFileName = '';
  showSalesConnect = false; //  make it true when to show document central for salesconnect
  signatureSigned = false;
  partnerLedFlow = false;
  partnerDeal = false;
  isCutomerAnsweredForLoa = false; //  set if loacustomerquestion answered
  clarificationsSelected = '';
  modificationsSelected = '';
  alreadyObtained = '';
  displayDraftCopymsg = false;
  showCustomerLoaMessage = true; //  to show messages for loaCustomer tab
  displayModificationProceedMsg = false;
  clarificationMode = '';
  standardcationsSelectedCount = 0;
  standardClarificationsArray = [];
  modificationsSelectedCount = 0;
  modificationsArray = [];
  isEuifUploaded = false;
  isEuifPresent = false;
  isLegalPackagePresent = false;
  isLoaPresent = false;
  isEuifLoaPresent = false;
  showWelcomeMessage = true;


  private includedPartialIbSubscription: Subscription;

  mspPartnerQuestion = {
    question: 'Is MSP partner signing for a customer?',
    answers: [{ 'selected': false, 'value': 'Yes' }, { 'selected': 'true', 'value': 'No' }]
  };
  
  partnerRepresentativeContainer = []; 
  isMSPPartnerSigning = false;
  isCustomerReady = false;

  invalidEmail = false;
  invalidDoamin = false;
  disableAdd = true;
  isShowProgramTerms = false; //  to show/hide EA ProgramTerms panel
  programTermsSignedDate: ''; //  for EA Program Terms signed date
  isLoadLoA = false; // set it to load loa after header is loaded

  openClarifications = false;
  clarificationsList = [];

  isShowBackButton = false; // set to show/hide back button
  isShowInitiateButton = false; // set to show/hide initiate e-signature button
  isShowContinueButton = true; // set to show/hide continue button
  isShowSendAgainButton = false; // set to show/hide Send Again button
  isDisableContinueButton = false; // set to disable continue button
  isDisableSendAgainButton = false; // set to disable send again button
  isShowDownloadLegalPackage = false; 

  isCustomerRepresentativeSelected = true;
  isFileContainLOA = '';
  disableInitiateSignature = false;

  isProgrammTermIncluded = false;
  showProgramTermQuestion = false;

  @Output() showCustomerSuccessMsg = new EventEmitter<boolean>();
  messageObject: any;
  isShowLoaRequired = false;  // to show loa Required on loa panel if EUI is inititated or signed
  partnerTeamsArray = []; // to set partner team data from qual api

  isCXProposal = false;
  isLinkedCxInProgress = false; // set if realtedServices proposal is inProgress
  allowPartnerToSign = true;

  constructor(public localeService: LocaleService, public documentCenter: DocumentCenterService,
    public createProposalService: CreateProposalService, public qualService: QualificationsService,
    private tcoApiCallservice: TcoApiCallService, public permissionService: PermissionService,
    public appDataService: AppDataService, public proposalDataService: ProposalDataService,
    public _sanitizer: DomSanitizer, private router: Router,
    private breadcrumbsService: BreadcrumbsService,
    public qualSummaryService: QualSummaryService, private modalVar: NgbModal,
    public renderer: Renderer2, public messageService: MessageService,
    public constantsService: ConstantsService, private route: ActivatedRoute,
    public blockUiService: BlockUiService, private tcoDataService: TcoDataService) { }


  ngOnInit() {

    this.isCXProposal = this.proposalDataService.cxProposalFlow;
    //this.proposalDataService.proposalDataObject.proposalData.partner = undefined;
    this.partnerRepresentativeContainer =[{
      'heading': 'PREFERRED LEGAL NAME',
      'data': this.proposalDataService.proposalDataObject.proposalData.partner ? this.proposalDataService.proposalDataObject.proposalData.partner.name : '',
      'readonly': true
    }, { 'heading': 'NAME', 'data': '', 'readonly': false ,'display': true},
    { 'heading': 'TITLE', 'data': '', 'readonly': false ,'display': true},
    { 'heading': 'EMAIL', 'data': '', 'readonly': false, 'display': true },
    { 'heading': 'phoneNumber', 'data': '', 'readonly': false, 'display': false },
    { 'heading': 'phoneCountryCode', 'data': '', 'readonly': false , 'display': false},
    { 'heading': 'dialFlagCode', 'data': '', 'readonly': false ,'display': false}]
    //  Get invalid email domain
    this.appDataService.getInvalidEmail();

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.documentCenter;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    //  check the session and session has proposal status then set it to show/hide tco tab
    //if (sessionObject && sessionObject.proposalDataObj && JSON.stringify(sessionObject.proposalDataObj) !== '{}') {
    //  this.proposalStatus = sessionObject.proposalDataObj.proposalData.status;
    //}
    if (sessionObject) {
      this.appDataService.isPatnerLedFlow = sessionObject.isPatnerLedFlow;
      // check if subrefId is empty and subscription data is present in session -- set the data and changeSubFlow
      if (!this.qualService.subRefID && sessionObject.qualificationData && sessionObject.qualificationData.subscription && sessionObject.qualificationData.subscription.subRefId) {
        this.qualService.qualification.subscription = sessionObject.qualificationData.subscription;
        this.qualService.subRefID = sessionObject.qualificationData.subscription.subRefId;
      }
    }

    this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    this.appDataService.isProposalIconEditable = false;
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);

    if (this.router.url.includes('/group')) {
      this.appDataService.isGroupSelected = true;
    } else {
      this.appDataService.isGroupSelected = false; 
    }

    this.subscription = this.appDataService.headerDataLoaded.subscribe(() => {
      this.isLoadLoA = true; // set it to load loa after header loaded
      
        this.proposalStatus = this.proposalDataService.proposalDataObject.proposalData.status;
        this.loaRequired = this.appDataService.loaQuestionSeletedValue ? 'Yes': 'No';
        
        if(this.proposalDataService.cxProposalFlow && !this.isCXProposal){
          this.isCXProposal = this.proposalDataService.cxProposalFlow;
          this.documentCenter.documentCenterData = this.prepareDocumentObjectArray(false);
        }
        // if cx proposal call to set and show financial summary page
        if (this.proposalDataService.cxProposalFlow){
          this.proposalDataService.getCxFinancialSummaryData();
        } else if (!this.appDataService.isGroupSelected) { //  call summary api to get financial sumamry data for single archs only
          this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
        }
        this.standardcationsSelectedCount = this.proposalDataService.proposalDataObject.proposalData.loaLanguageClarificationIds.length;
        this.modificationsSelectedCount = this.proposalDataService.proposalDataObject.proposalData.loaNonStdModificationIds.length;

      // uncomment below code if code if commented/removed includedPartialIB subscriber
      // if includedPartialIB then filter the documentCenterData to show TCO, partner practice and set customer package data 
      // if(this.appDataService.includedPartialIb){
      //   this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => (h.type === this.constantsService.CUSTOMER_PACKAGE) || (h.type === this.constantsService.TCO_MODELING) || (h.type === ConstantsService.PARTNER_REQUIREMENTS));
      // }
      this.appDataService.isReadWriteAccess = (this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEditName) 
                    || this.proposalDataService.is2TUsingDistiSharedPrposal)  || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalViewOnly) ? true : false;
      if(this.partnerTeamsArray.length && this.qualService.twoTUserUsingDistiDeal && this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS){
        this.distiPrposalSharedWith2T()
      }
      this.hideFullCustomerBookings();

      // get linked services and software proposals if relatedCxproposalId and linkId present
      if (this.proposalDataService.relatedCxProposalId && this.proposalDataService.proposalDataObject.proposalData.linkId) {
        this.getCxLinkedProposalListData(this.proposalDataService.proposalDataObject.proposalData.linkId);
      }
    // commented out for future use
      // if(this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)){
      //   this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !== this.constantsService.TCO_MODELING);
      // }
      this.blockUiService.spinnerConfig.unBlockUI();
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();

      this.isProgrammTermIncluded = this.createProposalService.forceAttachProgramTerm;
      if(this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList.length){
        let mspPartnerCount = 0;
        this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList.forEach(element => {
          if(element['mspPartner']){
            mspPartnerCount++;
          }
        });
        if(mspPartnerCount > 0 && mspPartnerCount !== this.proposalDataService.proposalDataObject.proposalData.linkedProposalsList.length){
          this.allowPartnerToSign = false;
        }
      }
    });

    if (!this.proposalDataService.proposalDataObject.proposalId || !this.qualService.qualification.qualID) {

      //  Get proposal id from request parameter
      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          const proposalId = params.get('proposalId');
          if (proposalId) {
            this.proposalDataService.proposalDataObject.proposalId = parseInt(proposalId);
          }
        }
      });

      if (!sessionObject || this.proposalDataService.proposalDataObject.proposalId !== sessionObject.proposalDataObj.proposalId) {
        //  Redirect to proposal summary incase of new tab or proposal id updated in the url
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
        return; //  Return so that next code will not be executed incase of navigate
      }
      const customerContact = (sessionObject.qualificationData.customerContact) ? sessionObject.qualificationData.customerContact : sessionObject.qualificationData.customerInfo;
      this.resetQualCustObject(customerContact);
      //to check if this code is required or not ****
      this.qualService.qualification.qualID = sessionObject.qualificationData.qualID ?
        sessionObject.qualificationData.qualID : sessionObject.qualificationData.id;
      this.qualService.qualification.name = sessionObject.qualificationData.name ?
        sessionObject.qualificationData.name : sessionObject.qualificationData.qualName;
      this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;
      this.appDataService.userInfo.roSuperUser = sessionObject.userInfo.roSuperUser;
      this.appDataService.userInfo.rwSuperUser = sessionObject.userInfo.rwSuperUser;
      //**** */
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
    }

    //  Only show document center when status complete and user has read write access
    if (!(this.appDataService.isReadWriteAccess || this.appDataService.userInfo.roSuperUser || this.proposalDataService.is2TUsingDistiSharedPrposal)) {

      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
      return; //  Return so that next code will not be executed incase of navigate
    }

    this.appDataService.isReadWriteAccess = true;

    this.documentCenter.editCustRepEdit$.subscribe((response: boolean) => {
      this.disableContinueForCustRep = !response;
      // this.continueBtnDisable[0] = !response;
      this.isDisableContinueButton = !response;
    });

    this.selectedOptions = [{
      'id': 1,
      'name': ConstantsService.SCP
    },
    {
      'id': 2,
      'name': ConstantsService.SUPP_TERMS
    },
    {
      'id': 3,
      'name': ConstantsService.LETTER_AGREEMENT
    }
    ];
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true,
      showCheckAll: false
    };
    this.myTexts = {
      defaultTitle: ConstantsService.SCP
    };

    const json = {
      'data': {
        'id': this.proposalDataService.proposalDataObject.proposalId,
        'qualId': this.qualService.qualification.qualID
      }
    };
    this.blockUiService.spinnerConfig.startChain();
    //  call this method to get tco count
    this.getTcoCountNumber();
    //  call header API from start of the page to call parallel with doc api
    this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, json);
    // if (!this.appDataService.isGroupSelected) { //  call summary api to get financial sumamry data for single archs only
    //   this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
    // }
    this.documentCenter.getProposalDocsData().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          //  if(res.data){
          this.documentCenter.documentCenterData = this.prepareDocumentObjectArray(false);
          //  this.hideFullCustomerBookings();
          this.getProgramTermsSigned(); //  to check program terms signed or not and show the panel
          this.updateMSPPartnerDetails(res);
          this.updateDocCenterData(res, true);
          if (!this.appDataService.isPatnerLedFlow) {
            this.getLOADocument();
          }
          //  }
        } catch (error) {
          console.error(error);
          //  this.messageService.displayUiTechnicalError(error);
        }
      } else {
        //  this.messageService.displayMessagesFromResponse(res);
      }
    });
    this.includedPartialIbSubscription = this.appDataService.includedPartialIbEmitter.subscribe((includedPartialIb) => {
      // this.documentCenter.documentCenterData = this.prepareDocumentObjectArray(includedPartialIb);
      // if included partial ib, filter doc data to show tco,partner practice and store EUIF
      if (includedPartialIb) {
        this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => (h.type === this.constantsService.CUSTOMER_PACKAGE) || (h.type === this.constantsService.TCO_MODELING) || (h.type === ConstantsService.PARTNER_REQUIREMENTS));
      }
      this.managePartnerDocument();// method to hide/show some document tabs if partner led flow or cross arch related
      this.appDataService.includedPartialIb = includedPartialIb;
    });

        //  Get LOA Document

  this.checkProgrammTermStatus();  
  }

  checkProgrammTermStatus(){
    this.documentCenter.getCheckProgrammTermStatus().subscribe((res: any) => {
      if (res && !res.error) {
        this.showProgramTermQuestion = res.data ? true : false;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    })
  }

   resetQualCustObject(customerContact){
    this.qualService.qualification.customerInfo = {
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
      'phoneCountryCode':'',
      'dialFlagCode': '',
      'phoneNumber':''
    };
    this.qualService.qualification.legalInfo = {
      'addressLine1': '',
      'addressLine2': '',
      'city': '',
      'country': '',
      'state': '',
      'zip': ''
    };

    this.qualService.qualification.legalInfo = customerContact.preferredLegalAddress;
    this.qualService.qualification.customerInfo.preferredLegalName = customerContact.preferredLegalName;
    this.qualService.qualification.customerInfo.repName = customerContact.repName;
    this.qualService.qualification.customerInfo.repEmail = customerContact.repEmail;
    this.qualService.qualification.customerInfo.repTitle = customerContact.repTitle;
    this.qualService.qualification.customerInfo.affiliateNames = customerContact.affiliateNames;

  }

  prepareDocumentObjectArray(includedPartialIb) {
    let docuementArrayObj = [];
    if (!includedPartialIb) {
      docuementArrayObj = [
        {
          'id': '0',
          'type': this.constantsService.CUSTOMER_PACKAGE,
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_EA_LEGAL_CUSTOMER_WIZARD'),
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_LEGAL_CUSTOMER'),
          'documentLabelDate': '',
          'signedDate': '',
          'manualCustomerPackageUploaded': false,
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          //  'isCutomerLoaReady': true,
          'isInstallBase': false,
          'docSignStepsComp': '1',
          'filesContainer': [],
          'loafilesContainer': [],
          'status': '',
          'representativeContainer': [
            [
            {
              'heading': 'NAME',
              'data': '',
              'display': true
            },
            {
              'heading': 'TITLE',
              'data': '',
              'display': true
            },
            {
              'heading': 'EMAIL',
              'data': '',
              'display': true
            },{
              'heading': 'phoneNumber',
              'data': '',
              'display': false
            },{
              'heading': 'phoneCountryCode',
              'data': '',
              'display': false
            },{
              'heading': 'dialFlagCode',
              'data': '',
              'display': false
            }],
            [/*{
              'heading': 'PREFERRED LEGAL NAME',
              'data': ''
            },*/
            {
              'heading': 'NAME',
              'data': '',
              'display': true
            },
            {
              'heading': 'TITLE',
              'data': '',
              'display': true
            },
            {
              'heading': 'EMAIL',
              'data': '',
              'display': true
            },{
              'heading': 'phoneNumber',
              'data': '',
              'display': false
            },{
              'heading': 'phoneCountryCode',
              'data': '',
              'display': false
            },{
              'heading': 'dialFlagCode',
              'data': '',
              'display': false
            }]
          ],
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': false,
          'docCenterContainerClass': 'icon-legal-package',
          'disable': false

        },
        {
          'id': '1',
          'type': 'LOCC',
          'documentLabel': 'Letter of Customer Consent',
          'disable': false

       },
        //  {
        //    'id': '1',
        //    'documentLabel': 'End User Information Form',
        //    'type': ConstantsService.EUIF,
        //    'documentLabelDate': '',
        //    'documentLabelInfo': '',
        //    'totalDocuSignSteps': '3',
        //    'isCustomerReady': true,
        //    'docSignStepsComp': '1',

        //    'downloadOption': true,
        //    'fileNameInQueue': '',
        //    'shareOption': false,
        //    'docCenterContainerClass': 'icon-pdf1'
        //  },
        {
          'id': '4',
          'type': this.constantsService.TCO_MODELING,
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_TCO_MODELING'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_TCO_MODELING'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': false,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': true,
          'shareOption': false,
          'docCenterContainerClass': 'icon-tco',
          'disable': false
        },
        // {
        //   'id': '4',
        //   'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_PARTNER_REQUIREMENT'),
        //   'documentLabelDate': '',
        //   'type': ConstantsService.PARTNER_REQUIREMENTS,
        //   'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_PARTNER_REQUIREMENT'),
        //   'totalDocuSignSteps': '3',
        //   'isCustomerReady': true,
        //   'isInstallBase': false,
        //   'docSignStepsComp': '1',

        //   'fileNameInQueue': '',
        //   'downloadOption': true,
        //   'shareOption': false,
        //   'docCenterContainerClass': 'icon-pdf1'
        // },
        {
          'id': '5',
          'type': 'CUSTOMER_PROPOSAL',
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_CUSTOMER_PROPOSAL'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_CUSTOMER_PROPOSAL'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': false,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': true,
          'docCenterContainerClass': 'icon-ppt1',
          'disable': this.isCXProposal

        },
        {
          'id': '6',
          'type': 'PROPOSAL_IB_REPORT',
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_PROPOSAL_INSTALL_BASE'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_PROPOSAL_INSTALL_BASE'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': true,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': true,
          'docCenterContainerClass': 'icon-xls1',
          'disable': this.isCXProposal

        },
        {
          'id': '7',
          'type': 'CUSTOMER_IB_REPORT',
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_FULL_CUSTOMER_INSTALL'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_FULL_CUSTOMER_INSTALL'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': true,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': true,
          'docCenterContainerClass': 'icon-xls1',
          'disable': this.isCXProposal

        },
        {
          'id': '8',
          'type': 'TCO_COMPARISON_REPORT',
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_TCS_TCO'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_TCS_TCO'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': false,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': true,
          'docCenterContainerClass': 'icon-xls1',
          'disable': this.isCXProposal

        },
        {
          'id': '9',
          'type': 'FULL_CUSTOMER_BOOKING_REPORT',
          'documentLabel': this.localeService.getLocalizedString('docusign.LABEL_FULL_CUSTOMER_BOOKING_REPORT'),
          'documentLabelDate': '',
          'documentLabelInfo': this.localeService.getLocalizedString('docusign.DESCRIPTION_FULL_CUSTOMER_BOOKING_REPORT'),
          'totalDocuSignSteps': '3',
          'isCustomerReady': true,
          'isInstallBase': false,
          'docSignStepsComp': '1',
          'fileNameInQueue': '',
          'downloadOption': false,
          'shareOption': true,
          'docCenterContainerClass': 'icon-xls1',
          'disable': false

        }];
    }
    
    return docuementArrayObj;
  }

  updateMSPPartnerDetails(response) {


    if (response.mspPartner) {
      //Partner respresentative selected
      this.isCustomerRepresentativeSelected = false;
      this.partnerRepresentativeContainer[1].data = response.mspPartner.partnerName;
      this.partnerRepresentativeContainer[2].data = response.mspPartner.partnerTitle;
      this.partnerRepresentativeContainer[3].data = response.mspPartner.partnerEmail;
      this.partnerRepresentativeContainer[4].data = response.mspPartner.phoneNumber;
      this.partnerRepresentativeContainer[5].data = response.mspPartner.phoneCountryCode;
      this.partnerRepresentativeContainer[6].data = response.mspPartner.dialFlagCode;
    }else {
      //Customer respresentative selected
      this.isCustomerRepresentativeSelected = true;
    }
  }
  //  Validation check for new feature row
  mspPartnerDetail() {
    let isDisableContinue = false;
    let allValueEntered = false;
    if (this.createProposalService.isMSPSelected) {
        for (const partner of this.partnerRepresentativeContainer) {
          if (partner.data.trim().length === 0) {
            allValueEntered = false;
            break;
          } else {
            allValueEntered = true;
          }
        }

    } else {
      isDisableContinue = false;
    }
    if (allValueEntered) {
      isDisableContinue = false;
    } else {
      isDisableContinue = true;
    }
    if (this.isDisableContinueButton) {
      return isDisableContinue;
    } else {
      return true;
    }
  }

  partnerDetailsFilled() {

    if (this.partnerRepresentativeContainer[3].data) {
      this.emailValidation(this.partnerRepresentativeContainer[3].data);
      if (this.invalidDoamin || this.invalidEmail) {
        return false;
      }
    }

    let allValueEntered = false;
    for (const partner of this.partnerRepresentativeContainer) {

      if (!partner.data) {
        return false;
      }
      if (partner.data.trim().length === 0) {
        allValueEntered = false;
        break;
      } else {
        allValueEntered = true;
      }
    }
    return allValueEntered;
  }


  mspPartnerSigning(answers, answer) {
    this.isMSPPartnerSigning = false;
    for (const _answer of answers) {
      _answer.selected = false;
    }
    answer.selected = true;
    if (answer.value === 'Yes') {
      this.isMSPPartnerSigning = true;
      this.partnerDetail();
    } else {
      // this.continueBtnDisable[0] = false;
      this.isDisableContinueButton = false;
    }
  }
  partnerDetail() {

    const isDetailEntered = this.partnerDetailsFilled();
    if (isDetailEntered) {

      if (this.invalidDoamin || this.invalidDoamin) {
        // this.continueBtnDisable[0] = true;
        this.isDisableContinueButton = true;
      } else {
        // this.continueBtnDisable[0] = false;
        this.isDisableContinueButton = false;
      }
    } else {
      // this.continueBtnDisable[0] = true;
      this.isDisableContinueButton = true;
    }
  }

  emailValidation(emailId) {
    this.invalidDoamin = false;
    if (!emailId) {
      this.invalidEmail = false;
      return;
    }
    if (this.appDataService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
      this.disableAdd = true;
    } else {
      this.invalidEmail = false;
      this.domainValidation(emailId);
    }
  }
  //  for validating domain
  domainValidation(emailId) {


    const domain = emailId.substring(emailId.indexOf('@') + 1, emailId.indexOf('.')); //  get the domain name from the emailId.
    const isDomainValid = this.appDataService.invalidDomains.indexOf(domain) !== -1 ? false : true;

    if (isDomainValid) {
      this.invalidDoamin = false;
    } else {
      this.invalidDoamin = true;
    }

    //  const domain = emailId.substring(emailId.indexOf('@') + 1);//  get the domain name from the emailId.
    //  if(domain !== this.constantsService.CISCO_DOMIN){
    //    this.invalidDoamin = true;
    //    this.disableAdd = true;
    //  } else{
    //    this.invalidDoamin = false;
    //    this.disableAdd = false;
    //  }
  }


  getLOADocument() {

    this.documentCenter.getLOAData().subscribe((response: any) => {
      this.documentCenter.isLOAUploaded = false;
      this.documentCenter.loaData = [];
      

      if (response && response.data && !response.error) {

        this.documentCenter.documentCenterData[0].loafilesContainer = [];
        //this.isContainsLOA = 'no';
        this.isContainsLOAAnswered = true;
        

        response.data.loaDocuments.forEach(element => {
          if (!element.deleted && !element.electronicallySigned) {
            this.documentCenter.documentCenterData[0].loafilesContainer.push({
              'badgeInfo': ConstantsService.LETTER_AGREEMENT,
              'fileLabel': element.name,
              'signedStatus': element.documentSigned,
              'uploadedBy': element.createdByName,
              'createdOn': element.createdAtStr,
              'documentId': element.documentId,
              'signedOn': element.manualLoaSignedDate
            });

            if(!this.uploadedFileHasLoa){
              this.isContainsLOA = 'no';
            }
            this.isContainsLOAAnswered = true;
            this.newDocumentData.toggleConfirmedUpload = true;
            this.newDocumentData.toggleBrowseTab = true;
            this.newDocumentData.docuSignStatusCompletedContainer = true;
            this.newDocumentData.manualLoaSignedDate = element.manualLoaSignedDate; // set manualLoaSignedDate
            //  Set LOA document parameter
            this.documentCenter.setLOAParam(element);
          }
        });
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  //  method to check and hide full customer bookings report if not security architecture & not partner deal
  hideFullCustomerBookings() {
    //if (this.appDataService.subHeaderData.subHeaderVal && this.appDataService.subHeaderData.subHeaderVal[7]) {

      //  check for partner and hide full customer bookings any arch and if cisco user show in sec arch & cross arch if security is present
    //  if (this.partnerLedFlow) {
    //    this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !==
    //      ConstantsService.FULL_CUSTOMER_BOOKING_REPORT);
    //  } else {
    //    if (!(this.appDataService.isGroupSelected && this.proposalDataService.isSecurityIncludedinCrossArch ||
    //      (this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.SECURITY))) {
    //      this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !==
    //        ConstantsService.FULL_CUSTOMER_BOOKING_REPORT);
    //    }
    //  }
    //}
    if (this.partnerLedFlow || 
      (this.appDataService.archName !== this.constantsService.SECURITY && !this.proposalDataService.isSecurityIncludedinCrossArch)) {

      this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !==
        ConstantsService.FULL_CUSTOMER_BOOKING_REPORT);
    }
  }
  //  method to hide pricing reports and customer ib reports if partner deal
  hidePricingAndCutomerIbReports() {

    this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => (h.type !==
      ConstantsService.TCO_COMPARISON_REPORT) && (h.type !== ConstantsService.CUSTOMER_IB_REPORT));

  }
  //  method to check and set locc signed flag
  loCCSignedCheck(response) {
    if (response.data && response.data.loaSigned) {
      this.signatureSigned = true;
    } else {
      this.signatureSigned = false;
    }
    this.qualService.loaData.loaSigned = this.signatureSigned;
    if (this.qualService.loaData.loaSigned) {
      this.appDataService.signatureValidDate = response.data.signatureValidDate;
    }
  }

  //  method to set customer guid and partner begeoid
  setCustomerPartnerGEOID(response) {
    this.qualService.loaData.partnerBeGeoId = response.data.partnerBEGeoId;
    this.qualService.loaData.customerGuId = response.data.customerGuId;
  }

  //  method to hide documents for partner
  managePartnerDocument() {

    this.hideFullCustomerBookings();

    if (this.partnerLedFlow) {

      this.hidePricingAndCutomerIbReports();
    }
  }

  //  method to check if it's partner deal
  isPartnerDeal(response) {

    if (response.data.partnerDeal) {

      this.partnerDeal = true;
    } else {
      this.partnerDeal = false;
    }
  }

  loccContent() {
    if (this.appDataService.dealID && this.appDataService.quoteIdForDeal && !this.appDataService.isLoccContentCalled) {
      this.qualService.loccLandingApiCall(this.appDataService.dealID, this.appDataService.quoteIdForDeal).subscribe((response: any) => {
        if (response && response.data && !response.error) {
          this.appDataService.isLoccContentCalled = true;
          this.qualService.loaData.partnerBeGeoId = response.data.partnerBeGeoId;
          this.qualService.loaData.customerGuId = response.data.customerGuId;
          this.qualService.loaData.loaSigned = response.data.loaSigned;
          if (this.qualService.loaData.loaSigned) {
            this.appDataService.loccValidTill = response.data.signatureValidDate;
            this.appDataService.signatureValidDate = response.data.loaDetail.signatureValidDate;
          }
          if (response.data.loaDetail) {
            this.qualService.loaData.loaDetail = response.data.loaDetail;
            if (response.data.loaDetail.deal) {
              const deal = response.data.loaDetail.deal;
              this.qualService.dealData.dealName = deal.optyName;
              this.qualService.dealData.dealStatus = deal.dealStatusDesc;
            }
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    }
  }
  ngOnDestroy() {
    this.createProposalService.forceAttachProgramTerm = false;
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.showFinancialSummary = false;
    this.appDataService.isLoccContentCalled = false;
    this.subscription.unsubscribe();
    if (this.includedPartialIbSubscription) {
      this.includedPartialIbSubscription.unsubscribe();
    }

  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any, object, index, isLegalPackage, isEuif?) { 
    if(isLegalPackage) {
      this.fileDetail = evt[0];
      this.isEuifUploaded = true;
      this.isLegalPackagePresent = isLegalPackage && !isEuif; // set legalPackage present and euif
      this.isEuifPresent = isEuif;
    } else {
      this.isLoaPresent = true; // set if loapreset
      this.loaFileDetail = evt[0];
    }
    
    this.allowOnlyPDF(object, index, isLegalPackage);

    if(isLegalPackage) {
      (<HTMLInputElement>document.getElementById('file')).value = '';      
    } else {
      (<HTMLInputElement>document.getElementById('loaFile')).value = '';
    }
  }

  allowOnlyPDF(object, index, isLegalPackage) {

    if(isLegalPackage) {
      this.fileName = this.fileDetail['name'];
      const idxDot = this.fileName.lastIndexOf('.') + 1;
      const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();


      if (['pdf'].indexOf(extFile) === -1) {
        this.uploader.queue.length = 0;
        this.qualService.fileFormatError = true;
        //  return;
      } else {
        this.file = this.fileDetail;
        if (this.fileDetail !== undefined) {
          const formData = new FormData();
          formData.append(this.fileName, this.fileDetail);
          object.fileNameInQueue = this.fileDetail['name'];
          this.toggleBrowseTab[index] = true;
          this.toggleUploadingProgress[index] = false;
          
          setTimeout(() => {    //  <<<---    using ()=> syntax
            this.toggleUploadingProgress[index] = true; //  hide upload loader after few sec
            this.toggleConfirmedUpload[index] = false; //  show conform tab for upload file
            object.toggleConfirmedUpload = true;
          }, 1500);
          
          (<HTMLInputElement>document.getElementById('file')).value = '';  
        }
      }
    } else {
      this.loaFileName = this.loaFileDetail['name'];
      const idxDot = this.loaFileName.lastIndexOf('.') + 1;
      const extFile = this.loaFileName.substr(idxDot, this.loaFileName.length).toLowerCase();
      this.isCutomerAnsweredForLoa = true;


      if (['pdf'].indexOf(extFile) === -1) {
        this.uploader.queue.length = 0;
        this.qualService.fileFormatError = true;
        //  return;
      } else {
        this.loaFile = this.loaFileDetail;
        if (this.loaFileDetail !== undefined) {
          const formData = new FormData();
          formData.append(this.loaFileName, this.loaFileDetail);
          object.fileNameInQueue = this.loaFileDetail['name'];
          object.toggleUploadingProgress = true;
          
          setTimeout(() => {    //  <<<---    using ()=> syntax
            object.toggleUploadingProgress = false;
          }, 1500);
          
          (<HTMLInputElement>document.getElementById('loaFile')).value = '';
        }
      }
    }  
  }

  checkRepresentative(isChecked) {

    this.isCustomerRepresentativeSelected = !isChecked;
   // this.isMSPPartnerSigning = isChecked;

    // if (!this.isCustomerRepresentativeSelected) {
    //       this.partnerDetail()
    // }else {
    //   this.isDisableContinueButton = false;

    // }

  }

  isLOAIncluded() {
    this.isFileContainLOA = this.constantsService.YES_RADIO_BUTTON;
    if (this.isEuifPresent) {
      this.isLegalPackagePresent = true;
      this.isEuifPresent = false;
    }
  }

  isLOANotIncluded() {
    this.isFileContainLOA = this.constantsService.NO_RADIO_BUTTON;
    if (this.isEuifPresent || this.isLegalPackagePresent) {
      this.isEuifPresent = true;
      this.isLegalPackagePresent = false;
    }
  }

  clearDragFile() {

    this.fileName = this.qualService.qualification.customerInfo.filename;
    this.qualService.fileFormatError = false;
    //     this.qualService.qualification.customerInfo.filename = this.oldFileName;
  }

  removeItem() {
    this.uploader.queue.length = 0;
    this.qualService.fileFormatError = false;
    this.qualService.qualification.customerInfo.filename = '';
    this.fileName = '';
    this.oldFileName = '';
  }

  //  this method will call api to get tco count
  getTcoCountNumber() {
    this.tcoApiCallservice.getTcoCount(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error) {
        this.tcoCount = res.data;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  //  setSessionObj() {
  //    this.qualService.getCustomerInfo().subscribe((response: any) => {
  //      if (response && !response.error && response.data) {
  //        try {
  //          this.qualService.qualification.customerInfo = response.data.customerContact;
  //          this.qualService.qualification.dealInfoObj = response.data.deal;
  //          this.qualService.qualification.qualID = response.data.qualId;
  //          this.appDataService.customerID = response.data.customerId;

  //        } catch (error) {
  //          this.messageService.displayUiTechnicalError(error);
  //        }
  //      }
  //      else {
  //        this.messageService.displayMessagesFromResponse(response);
  //      }
  //    });
  //  }

  //  To show change or add affiliates
  showChangeAffiliates() {

    if (this.qualService.qualification.customerInfo && ((this.qualService.qualification.customerInfo.affiliateNames &&
      this.qualService.qualification.customerInfo.affiliateNames.length > 0) ||
      (this.qualService.qualification.customerInfo.filename && this.qualService.qualification.customerInfo.filename.length > 0))) {
      return true;
    } else {
      return false;
    }
  }

  salesReadiness() {
    const screenName = 'salesReadiness';
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/' + screenName]);
  }

  updateDocCenterData(res, getHeaderData) {
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    this.qualSummaryService.getCustomerInfo().subscribe((response: any) => {
      // check if loadLoa and unblockUI&stopchain
      if (this.isLoadLoA) {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }
      if (response && !response.error) {
        try {

          sessionObject.qualificationData = response.data; //  this.qualification;

          if (response.data.permissions && response.data.permissions.featureAccess && response.data.permissions.featureAccess.length > 0) {
            this.permissionService.qualPermissions = new Map(response.data.permissions.featureAccess.map(i => [i.name, i]));
          } else {
            this.permissionService.qualPermissions.clear();
          }
          this.permissionService.isProposalPermissionPage(false);
          //  set userReadWriteAccess and createAccess to sessionObj
          sessionObject.isUserReadWriteAccess = (this.permissionService.qualPermissions.has(PermissionEnum.QualEditName) ||  this.permissionService.qualPermissions.has(PermissionEnum.QualViewOnly));
          sessionObject.createAccess = this.permissionService.qualPermissions.has(PermissionEnum.ProposalCreate);
          //  set tco create access for tco
          this.tcoDataService.tcoCreateAccess = sessionObject.createAccess;
          if (sessionObject) {
            this.qualService.qualification.dealInfoObj = sessionObject.qualificationData.deal;
            this.qualService.qualification.qualID = sessionObject.qualificationData.qualId ?
              sessionObject.qualificationData.qualId : sessionObject.qualificationData.qualID;
            this.qualService.qualification.name = sessionObject.qualificationData.qualName ?
              sessionObject.qualificationData.qualName : sessionObject.qualificationData.name;
          }

          //  setting qual status from API response
          this.qualService.qualification.qualStatus = response.data.qualStatus;

          this.qualService.qualification.createdBy = response.data.qualificationCreatedByName;

          if (response.data.federalCustomer) {
            this.qualService.qualification.federal = response.data.federalCustomer === 'Y' ? 'yes' : 'no';
          } else {
            this.qualService.qualification.federal = 'no';
          }

          if (response.data.customerContact) {
            this.resetQualCustObject(response.data.customerContact);
            this.qualService.qualification.customerInfo.scope = response.data.customerContact.scope ?
              response.data.customerContact.scope : 'None';
            this.qualService.qualification.customerInfo = response.data.customerContact;
            this.qualService.qualification.qualID = response.data.qualId;
            this.qualService.qualification.name = response.data.qualName;
            this.appDataService.customerID = response.data.customerId;
            //  sessionObject.qualificationData = this.qualService.qualification;
          }
          
          if (response.data.additionalCustomerContacts){
              this.qualService.additionalCustomerContacts = response.data.additionalCustomerContacts;
          }
          if (response.data.deal) {
            const deal = response.data.deal;
            this.qualService.dealData.dealName = deal.optyName;
            this.qualService.dealData.dealStatus = deal.dealStatusDesc;
            this.qualService.qualification.dealId = deal.dealId;
            this.qualService.qualification.dealInfoObj = deal;
            if (deal.quotes && deal.quotes.length > 0) {
              this.appDataService.quoteIdForDeal = deal.quotes[0].quoteId;
            }
          }
          if (response.data.extendedSalesTeam) {
            this.qualService.qualification.extendedsalesTeam = response.data.extendedSalesTeam;
            //  adding extendedsalesTeam value in session
            sessionObject.qualificationData.extendedsalesTeam = response.data.extendedSalesTeam;

          }

          if (response.data.cxTeams) {
            this.qualService.qualification.cxTeams = response.data.cxTeams;
            //  adding cxTeams value in session
            sessionObject.qualificationData.cxTeams = response.data.cxTeams;

          }
          if (response.data.assurersTeams) {
            this.qualService.qualification.cxDealAssurerTeams = response.data.assurersTeams;
            //  adding cxTeams value in session
            sessionObject.qualificationData.cxDealAssurerTeams = response.data.assurersTeams;

          }

          this.qualService.buyMethodDisti = response.data.buyMethodDisti ? true : false; // set buyMethodDisti flag
          this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(this.qualService.buyMethodDisti , response.data.distiDeal)//(this.is2tPartner && data.distiDeal) ? true : true;
          this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(this.qualService.buyMethodDisti,response.data.distiInitiated);
          if(response.data.partnerTeams && response.data.partnerTeams.length){ 
            this.partnerTeamsArray = response.data.partnerTeams;
          }

          if(this.partnerTeamsArray.length && this.qualService.twoTUserUsingDistiDeal && this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS){
            this.distiPrposalSharedWith2T()
          }

          this.appDataService.setSessionObject(sessionObject);
          this.loCCSignedCheck(response); //  to chcek loaSined or not
          this.setCustomerPartnerGEOID(response); //  to check and set parner begeoid and customerguid
          this.managePartnerDocument(); //  method to hide documents for partner
          this.isPartnerDeal(response); //  method to check if it's partner deal
       // commented out for future use
          // if(this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)){
          //   this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !== this.constantsService.TCO_MODELING);
          // }
          //  for setting 'isReadWriteAccess' from API
          // this.appDataService.isReadWriteAccess = this.permissionService.qualPermissions.has(PermissionEnum.QualEditName) ? true : false;
          this.appDataService.showEngageCPS = this.appDataService.isReadWriteAccess;
          this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
          //  to check if part of sales team but with read-only access

          if (!this.permissionService.qualPermissions.has(PermissionEnum.QualDelete)) {

            if (response.data.extendedSalesTeam) {

              for (let i = 0; i < response.data.extendedSalesTeam.length; i++) {
                if (response.data.extendedSalesTeam[i].ccoId === this.appDataService.userInfo.userId) {
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
          //  Disable add affiliates if it's ro user & doesn't have access to the proposal
          if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
            this.disableAffiliates = true;
            this.disableTcoCreate = true;
          } else if (this.appDataService.isReadWriteAccess && !this.permissionService.qualPermissions.has(PermissionEnum.QualDelete) && !this.appDataService.userInfo.distiUser) {
            //  this.disableAffiliates = true;
            this.disableTcoCreate = true;
          }
          //  for breadcrumb
          this.appDataService.custNameEmitter.emit({
            'text': this.proposalDataService.proposalDataObject.proposalData.name,
            qualName: this.qualService.qualification.name.toUpperCase(),
            qualId: this.qualService.qualification.qualID,
            proposalId: this.proposalDataService.proposalDataObject.proposalId,
            'context': AppDataService.PAGE_CONTEXT.documentCenter
          });
          if (!this.appDataService.includedPartialIb) {
            this.documentCenter.documentCenterData[0].representativeContainer[0].forEach(elem => { 
              this.setRepresentativeContainerData(elem,response.data.customerContact,this.qualService.qualification.customerInfo);         
              if (response.data.customerContact.fileName) {
                this.qualService.qualification.customerInfo.filename = response.data.customerContact.fileName;
              } else {
                this.qualService.qualification.customerInfo.filename = '';
              }
              this.qualService.qualification.customerInfo.affiliateNames = response.data.customerContact.affiliateNames;

            });
              //for additionalCustomerContacts
              if(response.data.additionalCustomerContacts){
                this.documentCenter.documentCenterData[0].representativeContainer[1].forEach(elem => { 
                    this.setRepresentativeContainerData(elem,response.data.additionalCustomerContacts[0],this.qualService.additionalCustomerContacts[0]);  
                });    
              }
            //)};
            this.documentCenter.documentCenterData[0].representativeContainer[0].forEach(elem => {
              if (elem.data === undefined || elem.data === '') {
                this.disableContinueForCustRep = true;
              } else {
                this.disableContinueForCustRep = false;
              }
            });
          }
        } catch (error) {


          //  to unblock UI and show no data found if there's error
          this.blockUiService.spinnerConfig.unBlockUI();

          console.error(error);
          this.messageService.displayUiTechnicalError(error);
        }

      } else {

        //  to unblock UI and show no data found if there's no data coming from service
        this.blockUiService.spinnerConfig.unBlockUI();

        this.messageService.displayMessagesFromResponse(response);
      }
    });

    if (res.data) {
      res.data.forEach(element => {
        if (element.type === ConstantsService.EUIF) {
          //  this.documentCenter.documentCenterData[1].documentLabelDate = element.createdAtStr;
        } else if (element.type === this.constantsService.CUSTOMER_PACKAGE) {
          this.isShowLoaRequired = true; // to show loa Required on loa panel if EUI is inititated or signed
          this.documentCenter.documentCenterData[0].status = element.status;
          this.documentCenter.documentCenterData[0].filesContainer = [];    
          
          if(element.manualLegalPackageSignedDate){ // check and set manualLegalPackageSignedDate
            this.documentCenter.documentCenterData[0].manualLegalPackageSignedDate = element.manualLegalPackageSignedDate;
          }

          // check and set signedAt for e-signature
          if(element.status === 'completed' && element.statusUpdatedAt){
            this.documentCenter.documentCenterData[0].signedAt = element.statusUpdatedAt;
          } else {
            this.documentCenter.documentCenterData[0].signedAt = element.createdAt;
          }
          
          if (element.uploadLegalPackage) {
            this.isFileContainLOA = this.constantsService.YES_RADIO_BUTTON;
          }else {
            this.isFileContainLOA = this.constantsService.NO_RADIO_BUTTON;
          }

          if (element.uploads) {
            if (element.uploads['SIGNED_CUSTOMER_PACKAGE']) {
              element.uploads['SIGNED_CUSTOMER_PACKAGE'].forEach(eachSCP => {
                if (!eachSCP.deleted) {
                  this.documentCenter.documentCenterData[0].status = element.status;
                  this.documentCenter.documentCenterData[0].documentLabelDate = element.createdAtStr;
                  this.documentCenter.documentCenterData[0].signedDate = element.signedAtStr;
                  this.documentCenter.documentCenterData[0].manualCustomerPackageUploaded = element.manualCustomerPackageUploaded;
                  if(element.loaIncluded) {
                    this.uploadedFileHasLoa = element.uploadLegalPackage ? true: false;
                    this.isContainsLOA = 'yes';

                  } else {
                    this.uploadedFileHasLoa = false;
                    this.isContainsLOA = 'no';
                    this.isContainsLOAAnswered = true;
                  }
                  this.documentCenter.documentCenterData[0].filesContainer.push({
                    'badgeInfo': ConstantsService.SCP,
                    'fileLabel': eachSCP.name,
                    'signedStatus': eachSCP.documentSigned,
                    'uploadedBy': eachSCP.createdByName,
                    'createdOn': eachSCP.createdAtStr,
                    'documentId': eachSCP.documentId
                  });
                }
              });
            }
            if (element.uploads['SUPPLEMENTAL_TERMS']) {
              element.uploads['SUPPLEMENTAL_TERMS'].forEach(eachST => {
                if (!eachST.deleted) {
                  this.documentCenter.documentCenterData[0].filesContainer.push({
                    'badgeInfo': ConstantsService.SUPP_TERMS,
                    'fileLabel': eachST.name,
                    'signedStatus': eachST.documentSigned,
                    'uploadedBy': eachST.createdByName,
                    'createdOn': eachST.createdAtStr,
                    'documentId': eachST.documentId
                  });
                }
              });
            }
          } else if(!element.deleted){
            //this is will be exicuted in case of e-sign
            this.uploadedFileHasLoa = element.loaIncluded ? true : false;
          }
        } else if (element.type === ConstantsService.PROGRAM_TERMS) {
          this.documentCenter.documentCenterData[2].documentLabelDate = element.createdAtStr;
        } else if (element.type === ConstantsService.PARTNER_PACKAGE) {
          this.documentCenter.documentCenterData[3].documentLabelDate = element.createdAtStr;
        }
      });

      if(this.documentCenter.documentCenterData[0].filesContainer.length > 0) {
        this.documentCenter.documentCenterData[0].toggleConfirmedUpload = true;       
      }

    }

    this.tabsContainer();
    this.documentCenterTab();
    this.docuSignTab();
    this.uploadFileProgess();
    this.uploadCofirmFile();
    this.browseLinkDocSign();
    this.whoesInvolvedDocSign();

    this.confirmStatusDocSign();
    this.previewContainerDocSign();
    this.pendingStatusDocSign();
    this.completeStatusDocSign();
    this.customerReadyContainer();
    this.customerLoaContainer(); //  to set loacusotmercontainer data

    if (this.documentCenter.documentCenterData[0].status &&
      this.documentCenter.documentCenterData[0].status.toLowerCase() === 'completed') {
      //  this.documentCenter.documentCenterData[0].docSignStepsComp = '2';
      this.docuSignStatusPendingContainer[0] = true;
      this.docuSignStatusCompletedContainer[0] = false;
      this.docuSignCustomerReadyContainer[0] = true;
      // this.sendAgainBtnDisable[0] = false;
      // this.docuSignSendAgainBtn[0] = true;
      // this.docuSignContinueBtn[0] = false;
      this.isShowContinueButton = false;
      this.isShowSendAgainButton = true;
      this.showWelcomeMessage = false;
      this.isDisableSendAgainButton = false;
    } else if (this.documentCenter.documentCenterData[0].status &&
      (this.documentCenter.documentCenterData[0].status.toLowerCase() === 'sent' ||
        this.documentCenter.documentCenterData[0].status.toLowerCase() === 'delivered')) {
      this.docuSignStatusPendingContainer[0] = false;
      this.docuSignStatusCompletedContainer[0] = true;
      this.docuSignCustomerReadyContainer[0] = true;
      // this.sendAgainBtnDisable[0] = false;
      // this.docuSignSendAgainBtn[0] = true;
      // this.docuSignContinueBtn[0] = false;
      this.isShowSendAgainButton = true;
      this.showWelcomeMessage = false;
      this.isShowContinueButton = false;
      this.isDisableSendAgainButton = false;

      this.toggleDocumentCenterTab[0] = true;
      this.toggleDocuSignTab[0] = false;
    }
    this.toggleTabs(0, this.flag, this.documentCenter.documentCenterData);
  }

  // method to check 2tpartners in the disti created qualification and set access for proposal 
  distiPrposalSharedWith2T(){
    for(let i = 0; i < this.partnerTeamsArray.length; i++ ){
      if(this.partnerTeamsArray[i].ccoId === this.appDataService.userId){
        this.proposalDataService.is2TUsingDistiSharedPrposal = true;
        this.appDataService.isReadWriteAccess = true;
        break;
      }
    }
  }

  downloadDoc(documentCenterData) {
    if (this.isStatusNotCompleteToAllowDownload() || this.isStatusNotConsistentToAllowDownload() || this.isLinkedCxInProgress) {
      const modalRef = this.modalVar.open(CustomerLegalWarningComponent, {
        windowClass: 'customer-legal-warning'
      });
      modalRef.componentInstance.isLinkedCxInProgress = this.isLinkedCxInProgress;
    } else {
      let url = '';
      if (documentCenterData === ConstantsService.EUIF) {
        url = 'api/document/download/euif?u=' + this.appDataService.userId + '&p=' +
          this.proposalDataService.proposalDataObject.proposalId + '&f=0&fcg=0';
      } else if (documentCenterData === this.constantsService.CUSTOMER_PACKAGE) {
        if (this.appDataService.isGroupSelected) {
          url = 'api/document/download/customerPackage?p=' + this.proposalDataService.proposalDataObject.proposalId
            + '&f=0&fcg=0&ctx=group';
        } else {
          url = 'api/document/download/customerPackage?p=' + this.proposalDataService.proposalDataObject.proposalId
            + '&f=0&fcg=0&ctx=single';
        }
      } else if (documentCenterData === ConstantsService.PARTNER_REQUIREMENTS) {
        url = 'api/document/download/partnerPackage?u=' + this.appDataService.userId + '&p=' +
          this.proposalDataService.proposalDataObject.proposalId + '&f=1&fcg=0&ctx=single';
      } else if (documentCenterData === ConstantsService.PROGRAM_TERMS) {
        url = 'api/document/download/programTerm?u=' + this.appDataService.userId + '&p=' +
          this.proposalDataService.proposalDataObject.proposalId + '&f=0&fcg=0';
      } else if (documentCenterData === this.constantsService.EA_PROGRAM_TERMS) {
        url = 'api/document/download-program-term-2?proposalId=' +
          this.proposalDataService.proposalDataObject.proposalId;
      }

      this.documentCenter.downloadDoc(url).subscribe((res: any) => {
        this.generateFileName(res);
      });
    }
  }

  downloadUploadedDoc(files, loa?) {
    if(loa) {
      let url = 'api/document/partner/download?proposalId=' + this.proposalDataService.proposalDataObject.proposalId + '&documentId=' + files.documentId;

      this.documentCenter.downloadDoc(url).subscribe((res: any) => {
        this.generateFileName(res);
      });
    } else {
      let url = 'api/document/download/additional/customerPackage?u=' + this.appDataService.userId +
      '&p=' + this.proposalDataService.proposalDataObject.proposalId + '&dt=';
      if (files.badgeInfo === ConstantsService.SCP) {
        url += ConstantsService.SIGNED_CUSTOMER_PACKAGE;
      } else if (files.badgeInfo === ConstantsService.LETTER_AGREEMENT) {
        url += ConstantsService.LOA;
      } else if (files.badgeInfo === ConstantsService.SUPP_TERMS) {
        url += ConstantsService.SUPPLEMENTAL_TERMS;
      }

      url += '&did=' + files.documentId;
      

      this.documentCenter.downloadDoc(url).subscribe((res: any) => {
        this.generateFileName(res);
      });
    }
    
  }

  generateFileName(res) {
    const x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; //  res.headers.get('content-disposition').substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) {
      //  IE & Edge
      //  msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }



  isStatusNotCompleteToAllowDownload() {

    let allowDownload = false;
    if (this.proposalDataService.proposalDataObject.proposalData.status !== this.constantsService.COMPLETE_STATUS ||
      (this.appDataService.isGroupSelected && this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch)) {
      allowDownload = true;
    }
    return allowDownload;
  }

  isStatusNotConsistentToAllowDownload() {

    let allowDownload = false;
    if (this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch) {
      allowDownload = true;
    }
    return allowDownload;
  }



  downloadSignedCustomerPackage() {
    const url = 'api/document/download/docusign/customerPackage?u=' + this.appDataService.userId + '&p=' +
      this.proposalDataService.proposalDataObject.proposalId + '&f=0';
    this.documentCenter.downloadSignedCustomerPackage(url).subscribe((res: any) => {
      this.generateFileName(res);
    });
  }

  openCustomerInfoEditModal(index) {
    const modalRef = this.modalVar.open(EditWhoInvolvedComponent, { windowClass: 'editCustInfo' });
    modalRef.componentInstance.CustomerInfoIdx = index;
    //  this.qualService.comingFromDocCenter = true;
  }


  openPartnerInfoModal(index) {

    const modalRef = this.modalVar.open(EditPartnerComponent, { windowClass: 'editCustInfo' });
    modalRef.componentInstance.CustomerInfoIdx = index;
    modalRef.componentInstance.custRepersentativeName = this.partnerRepresentativeContainer[1].data;
    modalRef.componentInstance.custRepersentativeTitle = this.partnerRepresentativeContainer[2].data;
    modalRef.componentInstance.custRepersentativeEmailId = this.partnerRepresentativeContainer[3].data;
    if (this.partnerRepresentativeContainer[4].data) {
      modalRef.componentInstance.contactDetails = {
        number: this.partnerRepresentativeContainer[4].data,
        dialCode: this.partnerRepresentativeContainer[5].data,
        e164Number: this.partnerRepresentativeContainer[5].data + this.partnerRepresentativeContainer[4].data,
        countryCode: this.partnerRepresentativeContainer[6].data
      }
    } else {
      modalRef.componentInstance.contactDetails = {}
    }

      modalRef.result.then((result) => {
      if (result.continue === true) {
          this.partnerRepresentativeContainer[1].data = result.name;
          this.partnerRepresentativeContainer[2].data = result.title;
          this.partnerRepresentativeContainer[3].data = result.email;
          this.partnerRepresentativeContainer[4].data = result.phoneNumber;
          this.partnerRepresentativeContainer[5].data = result.phoneCountryCode;
          this.partnerRepresentativeContainer[6].data = result.dialFlagCode;
      }})
  }

  deletePartnerContact() {

    this.partnerRepresentativeContainer[1].data = '';
    this.partnerRepresentativeContainer[2].data = '';
    this.partnerRepresentativeContainer[3].data = '';
    this.partnerRepresentativeContainer[4].data = '';
    this.partnerRepresentativeContainer[5].data = '';
    this.partnerRepresentativeContainer[6].data = '';
    this.documentCenter.resetPartnerDetail().subscribe((resp: any) => {
    })
  }

 deleteCustomerContact(){

    const json = {
        // 'userId': this.appDataService.userId,
        'qualId': this.qualService.qualification.qualID,
        'customerContact': {
          'accountName': this.qualService.qualification.customerInfo.preferredLegalName,
          'repName': this.qualService.qualification.customerInfo.repName,
          'preferredLegalName': this.qualService.qualification.customerInfo.preferredLegalName,
          'preferredLegalAddress': {
            'addressLine1': this.qualService.qualification.legalInfo.addressLine1,
            'addressLine2': this.qualService.qualification.legalInfo.addressLine2,
            'city': this.qualService.qualification.legalInfo.city,
            'state': this.qualService.qualification.legalInfo.state,
            'zip': this.qualService.qualification.legalInfo.zip,
            'country': this.qualService.qualification.legalInfo.country
          },
          'repTitle': this.qualService.qualification.customerInfo.repTitle,
          'repEmail': this.qualService.qualification.customerInfo.repEmail ? this.qualService.qualification.customerInfo.repEmail : ""
        }
      };
     this.documentCenter.deleteCustomerContactInfo(json).subscribe((res: any) => {
      if (res && !res.error) {

        this.qualService.qualification.customerInfo.repName  = null;
        this.qualService.qualification.customerInfo.repTitle  = null;
        this.qualService.qualification.customerInfo.repEmail  = null;

        this.documentCenter.documentCenterData[0].representativeContainer[0][0].data = '';
        this.documentCenter.documentCenterData[0].representativeContainer[0][1].data = '';
        this.documentCenter.documentCenterData[0].representativeContainer[0][2].data = '';
        this.documentCenter.documentCenterData[0].representativeContainer[0][3].data = '';
        this.documentCenter.documentCenterData[0].representativeContainer[0][4].data = '';
        this.documentCenter.documentCenterData[0].representativeContainer[0][5].data = '';

        this.messageService.displayMessages(this.appDataService.setMessageObject('Customer Representative has deleted successfully', MessageType.Success));       
     } else {
       this.messageService.displayMessagesFromResponse(res);
     }
   });

 }

  deleteAdditionalCustomerContact(){
    const json = {
      "data": {
        'id': this.qualService.additionalCustomerContacts[0].id,
        'repName': this.qualService.additionalCustomerContacts[0].repName,       
        'repTitle': this.qualService.additionalCustomerContacts[0].repTitle,
        'repEmail': this.qualService.additionalCustomerContacts[0].repEmail,
        'phoneNumber': this.qualService.additionalCustomerContacts[0].phoneNumber,
        'phoneCountryCode':this.qualService.additionalCustomerContacts[0].phoneCountryCode,
        'dialFlagCode':this.qualService.additionalCustomerContacts[0].dialFlagCode
      }      
     };
     this.documentCenter.deleteCustomerContact(json).subscribe((res: any) => {
      if (res && !res.error) {
        this.qualService.additionalCustomerContacts = null;
        this.documentCenter.documentCenterData[0].representativeContainer[1] = null;
        this.messageService.displayMessages(this.appDataService.setMessageObject('Additional Customer Representative has deleted successfully', MessageType.Success));       
     } else {
       this.messageService.displayMessagesFromResponse(res);
     }
   });
  }
  customerReadyContainer() {
    this.docuSignCustomerReadyContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignCustomerReadyContainer.length; i++) {
      this.docuSignCustomerReadyContainer[i] = false;
    }
  }

  //  method to set confirmloacontainer data
  customerLoaContainer() {
    this.docuSignConfirmLoaContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignConfirmLoaContainer.length; i++) {
      this.docuSignConfirmLoaContainer[i] = true;
    }
  }

  completeStatusDocSign() {
    this.docuSignStatusCompletedContainer = new Array(this.documentCenter.documentCenterData.length);

    for (let i = 0; i < this.docuSignStatusCompletedContainer.length; i++) {
      this.docuSignStatusCompletedContainer[i] = true;
    }
    //  console.log(this.docuSignStatusCompletedContainer);
  }

  pendingStatusDocSign() {
    this.docuSignStatusPendingContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignStatusPendingContainer.length; i++) {
      this.docuSignStatusPendingContainer[i] = true;
    }
  }

  previewContainerDocSign() {
    this.docuSignPreviewContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignPreviewContainer.length; i++) {
      this.docuSignPreviewContainer[i] = true;
    }
  }

  confirmStatusDocSign() {
    this.docuSignConfirmContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignConfirmContainer.length; i++) {
      this.docuSignConfirmContainer[i] = true;
    }
  }

  whoesInvolvedDocSign() {
    this.docuSignWhoesInvolvedTag = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.docuSignWhoesInvolvedTag.length; i++) {
      this.docuSignWhoesInvolvedTag[i] = false;
    }
  }

  browseLinkDocSign() {
    this.toggleBrowseTab = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.toggleBrowseTab.length; i++) {
      if (i === 0 && this.documentCenter.documentCenterData[0].filesContainer.length == 0) {
        this.toggleBrowseTab[i] = false;
      } else {
        this.toggleBrowseTab[i] = true; //  on load hide all upload confirm tab
      }
    }
  }


  uploadCofirmFile() {
    this.toggleConfirmedUpload = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.toggleUploadingProgress.length; i++) {

      this.toggleConfirmedUpload[i] = true; //  on load hide all upload confirm tab
    }
  }


  uploadFileProgess() {
    this.toggleUploadingProgress = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.toggleUploadingProgress.length; i++) {

      this.toggleUploadingProgress[i] = true; //  on load hide all upload progress tab
    }
  }


  docuSignTab() {
    this.toggleDocuSignTab = new Array(this.documentCenter.documentCenterData.length);

    for (let i = 0; i < this.toggleDocuSignTab.length; i++) {
      this.toggleDocuSignTab[i] = true; //  on load hide all docu Sign tab
    }
  }

  documentCenterTab() {
    this.toggleDocumentCenterTab = new Array(this.documentCenter.documentCenterData.length);
    for (let i = 0; i < this.toggleDocumentCenterTab.length; i++) {
      if (i === 0) {
        this.toggleDocumentCenterTab[i] = false;
      } else {
        this.toggleDocumentCenterTab[i] = true;
      }

    }
  }


  tabsContainer() {
    this.toggleTabsContainer = new Array(this.documentCenter.documentCenterData.length);
    for (let j = 0; j < this.toggleTabsContainer.length; j++) {
      if (j === 0) {
        this.toggleTabsContainer[j] = false;
      } else {
        this.toggleTabsContainer[j] = true;
      }
    }
  }


  //  To send download links
  openSpecialist(documentData) {

    if (this.isStatusNotCompleteToAllowDownload() || this.isStatusNotConsistentToAllowDownload() || this.isLinkedCxInProgress) {
      const modalRef = this.modalVar.open(CustomerLegalWarningComponent, {
        windowClass: 'customer-legal-warning'
      });
      modalRef.componentInstance.isLinkedCxInProgress = this.isLinkedCxInProgress;
    } else {

      const reqJSON_1 = {
        //  'userId': this.appDataService.userId,
        'archName': this.appDataService.archName,
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'customerGuName': this.appDataService.customerName,
        'ctx': this.appDataService.isGroupSelected ? 'group' : 'single'
      };

      const reqJSON_2 = {
        //  'userId': this.appDataService.userId,
        'archName': this.appDataService.archName,
        'customerId': this.appDataService.customerID,
        'customerGuName': this.appDataService.customerName,
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'ctx': this.appDataService.isGroupSelected ? 'group' : 'single'
      };

      if (documentData.type === ConstantsService.TCO_COMPARISON_REPORT) {
        this.documentCenter.getTCOComparisonReport(reqJSON_1).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.messageObject = {
                'note': true,
                'msg': this.localeService.getLocalizedMessage('docusign.TCO_COMPARISON_REPORT')
              };
              this.showCustomerSuccessMsg.emit(this.messageObject);
            } catch (error) {
              console.error(error);
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }

      if (documentData.type === ConstantsService.CUSTOMER_PROPOSAL) {
        this.documentCenter.getCustomerProposalReport(reqJSON_1).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.messageObject = {
                'note': true,
                'msg': this.localeService.getLocalizedMessage('docusign.CUSTOMER_PROPOSAL')
              };
              this.showCustomerSuccessMsg.emit(this.messageObject);
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }

      if (documentData.type === ConstantsService.CUSTOMER_IB_REPORT) {
        this.documentCenter.getCustomerIBReport(reqJSON_2).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.messageObject = {
                'note': true,
                'msg': this.localeService.getLocalizedMessage('docusign.CUSTOMER_IB_REPORT')
              };
              this.showCustomerSuccessMsg.emit(this.messageObject);
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
      if (documentData.type === ConstantsService.FULL_CUSTOMER_BOOKING_REPORT) {
        this.documentCenter.getCustomerBookingPackage(reqJSON_2).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.messageObject = {
                'note': true,
                'msg': this.localeService.getLocalizedMessage('docusign.CUSTOMER_BOOKING_REPORT')
              };
              this.showCustomerSuccessMsg.emit(this.messageObject);
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }

      if (documentData.type === ConstantsService.PROPOSAL_IB_REPORT) {
        this.documentCenter.getProposalIBReport(reqJSON_1).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.messageObject = {
                'note': true,
                'msg': this.localeService.getLocalizedMessage('docusign.PROPOSAL_IB_REPORT')
              };
              this.showCustomerSuccessMsg.emit(this.messageObject);
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
      setTimeout(() => {
        this.messageObject = {
          'note': false,
          'msg': ''
        };
        this.showCustomerSuccessMsg.emit(this.messageObject);
      }, 10000);
    }
  }

  toggleTabs(index, text, documentData) {
    //  cons
    //   if(documentData.length > 0){
    if (text === 'upload') {
      this.toggleDocumentCenterTab[index] = false;
      this.toggleDocuSignTab[index] = true;
    } else if (text === 'Docusign') {
      this.toggleDocumentCenterTab[index] = true;
      this.toggleDocuSignTab[index] = false;
    }
    //  }
  }

  signIncludedChange(loa?) {
    if(loa) {
      this.loaSigned = !this.loaSigned;
    } else {
      this.uncheckSign = !this.uncheckSign;
    }
  }

  confirmUploadFiles(index, fileNames, object) {//click on file

    if (object.filesContainer === undefined) {
      object.filesContainer = [];
    }

    if (object.viewValue === undefined) {
      this.selectedDropVal = this.myTexts.defaultTitle;
      this.uploadType = 'scp';
    } else {
      for (let i = 0; i < this.selectedOptions.length; i++) {
        if (this.selectedOptions[i].id === object.viewValue) {
          this.selectedDropVal = this.selectedOptions[i].name;
        }
      }

      if (this.selectedDropVal === ConstantsService.SCP) {
        this.uploadType = 'scp';
      } else if (this.selectedDropVal === ConstantsService.LETTER_AGREEMENT) {
        this.uploadType = 'loa';
      } else if (this.selectedDropVal === ConstantsService.SUPP_TERMS) {
        this.uploadType = 'st';
      }
    }

    const modalRef = this.modalVar.open(UploadDocumentConfirmationComponent, { windowClass: '' });
    modalRef.componentInstance.docData = {'isLegalPackagePresent': this.isLegalPackagePresent, 'isEuifPresent': this.isEuifPresent,'isLoaPresent': this.isLoaPresent, 'isEuifLoaPresent': this.isEuifLoaPresent};
    modalRef.result.then((result) => {
      if (result.continue === true) {
 
    if(this.file && this.isEuifUploaded) {

      const req = {
        //  'file': object.fileNameInQueue,
        'userId': this.appDataService.userId,
        'userName': (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName), //  'Rajeev Kedia',
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'type': 'customerPackage',
        'uploadType': this.uploadType,
        'isSigned': true,
        'loaIncluded': this.isContainsLOA === 'yes'? true : false,
        'uploadLegalPackage' : this.isFileContainLOA === this.constantsService.YES_RADIO_BUTTON ? true : false,
        'manualLegalPackageSignedDateStr': result.signedDateStr
      };


      this.documentCenter.uploadAdditionalDoc(this.file, req).subscribe((res: any) => {
      //  console.log(res);
      if (res && !res.error) {
        this.toggleDocumentCenterTab[0] = false;
        this.toggleDocuSignTab[0] = true;
        //  this.updateDocCenterData(res);
        if (this.uncheckSign) {
          object.filesContainer.push({
            'fileLabel': fileNames,
            'badgeInfo': this.selectedDropVal,
            'signedStatus': true,
            'uploadedBy': object.createdByName,
            'createdOn': object.createdAtStr
          });
          this.file = null;
          this.documentCenter.getProposalDocsData().subscribe((res: any) => {
            this.flag = ConstantsService.UPLOAD;
            this.updateDocCenterData(res, false);
          });
        } else {
          object.filesContainer.push({
            'fileLabel': fileNames,
            'badgeInfo': this.selectedDropVal,
            'signedStatus': false,
            'uploadedBy': object.createdByName,
            'createdOn': object.createdAtStr
          });
          this.documentCenter.getProposalDocsData().subscribe((res: any) => {
            if (res && !res.error) {
              this.flag = ConstantsService.UPLOAD;
              this.updateDocCenterData(res, false);
            } else {
              this.messageService.displayMessagesFromResponse(res);
            }
          });
        }
        this.isEuifUploaded = false;
        this.uncheckSign = false;
        this.isEuifPresent = false; // reset after uploaded
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    }
    

    if(this.isContainsLOA=='no' && this.isContainsLOAAnswered && this.newDocumentData.fileNameInQueue) {

      let req = {
        // 'file': object.fileNameInQueue,
        'userId': this.appDataService.userId,
        'userName': (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName), // 'Rajeev Kedia',
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'type': 'customerPackage',
        'uploadType': 'loa',
        'isSigned': true,
        'manualLoaSignedDateStr': result.loaSignedDateStr
      };

      this.documentCenter.uploadLOADoc(this.loaFile, req).subscribe((response: any) => {
        if (response && !response.error) {
          //  this.updateDocCenterData(res);
          response.data.loaDocuments.forEach(element => {
            if (!element.deleted && !element.electronicallySigned) {
              object.loafilesContainer.push({
                'badgeInfo': ConstantsService.LETTER_AGREEMENT,
                'fileLabel': element.name,
                'signedStatus': element.documentSigned,
                'uploadedBy': element.createdByName,
                'createdOn': element.createdAtStr,
                'documentId': element.documentId
              });
            }
          });
          this.loaSigned = false;
          this.newDocumentData.toggleConfirmedUpload = true;
          this.newDocumentData.fileNameInQueue = '';
          this.newDocumentData.docuSignStatusCompletedContainer = true;
          this.newDocumentData.manualLoaSignedDate = result.loaSignedDate; // set manualLoaSignedDate
          this.isLoaPresent = false; // reset after uploaded
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      })
    }

    // check and set euif & loa both are uploaded

    if(!this.isEuifPresent || !this.isLoaPresent){
      this.isEuifLoaPresent = false
    }

    this.toggleConfirmedUpload[index] = true; //  hide conform upload tab
    this.toggleBrowseTab[index] = false; //  show browe link when file uploaded

    object.fileNameInQueue = '';  //  when upload file then empty the file variable

  }
  });
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  processFile(file, index, object, target, evt, isLegalPackage) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    this.fileFormatError = false;

    if(isLegalPackage) {
      if (['pdf'].indexOf(extFile) === -1) {
        this.uploader.queue.length = 0;
        this.fileFormatError = true;
        this.fileName = fileName;
        return;
      } else {
        this.file = target.files[0];
        if (target.files[0] !== undefined) {
          const formData = new FormData();
          formData.append(fileName, file);
          object.fileNameInQueue = target.files[0].name;
          this.toggleBrowseTab[index] = true; //  hide browse link;
          this.toggleUploadingProgress[index] = false; //  show progress bar
          object.toggleUploadingProgress = true;
          object.toggleConfirmedUpload = false;
          setTimeout(() => {    //  <<<---    using ()=> syntax
  
            this.toggleUploadingProgress[index] = true; //  hide upload loader after few sec
            this.toggleConfirmedUpload[index] = false; //  show conform tab for upload file
            object.toggleUploadingProgress = false;
            object.toggleConfirmedUpload = true;
  
          }, 1500);
  
          (<HTMLInputElement>document.getElementById('file')).value = '';
          evt.srcElement.value = '';
        }
  
      }
    } else {
      if (['pdf'].indexOf(extFile) === -1) {
        this.uploader.queue.length = 0;
        this.fileFormatError = true;
        this.loaFileName = fileName;
        return;
      } else {
        this.isCutomerAnsweredForLoa = true;
        this.loaFile = target.files[0];
        if (target.files[0] !== undefined) {
          const formData = new FormData();
          formData.append(fileName, file);
          object.fileNameInQueue = target.files[0].name;
          object.toggleUploadingProgress = true;
          object.toggleConfirmedUpload = false;
          setTimeout(() => {    //  <<<---    using ()=> syntax
            object.toggleUploadingProgress = false;
          }, 1500);
          (<HTMLInputElement>document.getElementById('loaFile')).value = '';
          evt.srcElement.value = '';
        }
      }
    }
    
    

  }

  cancelUpload(index, object) {
    // this.isCutomerAnsweredForLoa = false;
    this.showCustomerLoaMessage = true;
    object.checkSignatureIncluded = false; //  uncheck signature checkbox when cancel
    this.uncheckSign = false; //  uncheck signature checkbox when clicked on cancel
    object.fileNameInQueue = '';
    this.toggleConfirmedUpload[index] = true; //  hide conform upload tab
    this.toggleBrowseTab[index] = false; //  show browe link when file uploaded
    this.newDocumentData= {};
    //this.isContainsLOA='yes';
    object.toggleConfirmedUpload = false;
    
    // reset the flags if cancelled upload
    this.isEuifUploaded = false;
    this.isEuifLoaPresent = false;
    this.isEuifPresent = false;
    this.isLegalPackagePresent = false;
    this.isLoaPresent = false;

    (<HTMLInputElement>document.getElementById('file')).value = '';
    if(this.isLoaPresent){
      (<HTMLInputElement>document.getElementById('loaFile')).value = '';
    }
    this.fileRef.nativeElement.value = '';
  }

  removeFiles(file, index, loa?, euif?) {
    if(loa) {
      this.isLoaPresent = false;
      this.documentCenter.deleteLOA(file.documentId).subscribe((response:any) => {
        this.documentCenter.documentCenterData[0].loafilesContainer = [];
        this.newDocumentData = {};
      })
    } else {
      this.isLegalPackagePresent = false;
      if(euif){
        this.isEuifPresent = false;
      }
      let dt = '';
      if (file.badgeInfo === ConstantsService.SCP) {
        dt = 'scp';
      } else if (file.badgeInfo === ConstantsService.LETTER_AGREEMENT) {
        dt = 'loa';
      } else if (file.badgeInfo === ConstantsService.SUPP_TERMS) {
        dt = 'st';
      }
      this.documentCenter.deleteDoc(file.documentId, dt).subscribe((res: any) => {
        //  console.log(res);
        this.documentCenter.getProposalDocsData().subscribe((res: any) => {
          if (res && !res.error) {
            this.flag = ConstantsService.UPLOAD;
            this.documentCenter.documentCenterData[0].status = '';
            this.documentCenter.documentCenterData[0].filesContainer = [];
            this.isShowContinueButton = true;
            this.isShowSendAgainButton = false;
            this.updateDocCenterData(res, false);
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      });
      this.fileRef.nativeElement.value = '';
    }
    
  }

  onFileChange(evt: any, index, object, isLegalPackage?, isEuif?) {
  
    const target: DataTransfer = <DataTransfer>(evt.target);
    
    this.processFile(target.files[0], index, object, target, evt, isLegalPackage);
    // this.isCutomerAnsweredForLoa = false;
    this.showCustomerLoaMessage = true;

    if(isLegalPackage) {
      this.uncheckSign = false;
      (<HTMLInputElement>document.getElementById('file')).value = '';
      this.isEuifUploaded = true; 
      this.isLegalPackagePresent = isLegalPackage && !isEuif; // legalPackage and eiuf present
      this.isEuifPresent = isEuif;
    } else {
      this.isLoaPresent = true; // set loa present
      (<HTMLInputElement>document.getElementById('loaFile')).value = '';
      
    }

    // check and set if euif and loa are present
    if(this.isEuifPresent && this.isLoaPresent){
      this.isEuifLoaPresent = true;
    } else {
      this.isEuifLoaPresent = false;
    }
    
  }

  onhFileChange(evt: any, index, object) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files[0] !== undefined) {
      const fileName = target.files[0].name;
      const idxDot = fileName.lastIndexOf('.') + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      if (['pdf'].indexOf(extFile) === -1) {
        object.fileNameInQueue = '';
        return;
      }
    }

    if (target.files[0] !== undefined) {
      object.fileNameInQueue = target.files[0].name;
      this.toggleBrowseTab[index] = true; //  hide browse link;
      this.toggleUploadingProgress[index] = false; //  show progress bar

      setTimeout(() => {    //  <<<---    using ()=> syntax

        this.toggleUploadingProgress[index] = true; //  hide upload loader after few sec
        this.toggleConfirmedUpload[index] = false; //  show conform tab for upload file

      }, 1500);

      (<HTMLInputElement>document.getElementById('file')).value = '';
      evt.srcElement.value = '';
    }

    //  this.processFile(target.files[0]);

  }

  changeDocSign($event, documentData, index, questionNum?) {
    if (documentData.docSignStepsComp === '1') {   //  check for steps
      if ($event.target.value === 'Yes') {
        
        this.isDisableContinueButton = false;
        documentData.isCustomerReady = false;
        this.isCustomerReady = true;

      } else if ($event.target.value === 'No') {
        documentData.isCustomerReady = true;
        this.isDisableContinueButton = true;
        this.isCustomerReady = false;
      }
    } else if (documentData.docSignStepsComp === '2') { //  check for step 2 and set answered flag
      if(questionNum == 1) {
        if ($event.target.value === 'yes') {
          this.isCutomerAnsweredForLoa = true;
          this.isDisableContinueButton = true;
        } else if ($event.target.value === 'no') {
          this.noDocumentChangeNeeded();
        }
      } else if(questionNum == 2) {
        if ($event.target.value === 'yes') {
          this.clarificationsSelected = 'yes';
          this.displayModificationProceedMsg = false;
          this.controlFlyout('clarificationsTab', true);
        } else if ($event.target.value === 'no') {
          this.clarificationsSelected = 'no';
          this.controlFlyout('clarificationsTab', false);
        }
      } else if(questionNum == 3) {
        if ($event.target.value === 'yes') {
          this.modificationsSelected = 'yes';
          this.callCustomerLoaQuestion(true, 'docCenter');
        } else if ($event.target.value === 'no') {
          this.modificationsSelected = 'no';
          this.alreadyObtained = '';
          this.displayDraftCopymsg = false;
          this.callCustomerLoaQuestion(false, 'docCenter');
          this.controlFlyout('modificationsTab', false);
        }
      } else if(questionNum == 4) {
        if ($event.target.value === 'yes') {
          this.alreadyObtainedLOA();
        } else if ($event.target.value === 'no') {
          this.alreadyObtained = 'no';
          this.displayDraftCopymsg = false;
          this.controlFlyout('modificationsTab', true);
        }
      }

      //this method is user to disable/enable continue button or to display msg acc. to the user selections 
      this.setpTwoQuestionsCheck();
    }
  }

  //this method is user to disable/enable continue button or to display msg acc. to the user selections 
  setpTwoQuestionsCheck(){
    if(this.isCutomerAnsweredForLoa){
      if(this.clarificationsSelected && this.modificationsSelected){
        if(this.clarificationsSelected === 'no' && this.modificationsSelected === 'no'){
          //if 2nd and 3rd question are no disable continue
          this.isDisableContinueButton = true;
          this.displayModificationProceedMsg = true;
          return;
        }

        if(this.modificationsSelected === 'yes'){
          if(!this.alreadyObtained){
            this.isDisableContinueButton = true;
          } else if (this.alreadyObtained === 'no' && !this.modificationsSelectedCount){
            this.isDisableContinueButton = true;
            this.displayModificationProceedMsg = true;
          } else if(this.alreadyObtained === 'yes'){
            this.isDisableContinueButton = false;
          } else if(this.modificationsSelectedCount){
            this.isDisableContinueButton = false;
            this.displayModificationProceedMsg = false;
          }
          return;
        } 

        if(this.clarificationsSelected === 'yes'){
          if(this.standardcationsSelectedCount){
            this.isDisableContinueButton = false;
            this.displayModificationProceedMsg = false;
          } else{
            this.isDisableContinueButton = true;
          }
          
          
        }

      } else {
        this.isDisableContinueButton = true;
      }
    }
  }

  receivedNotification(object) {
    if (object.docSignStepsComp === '1') {
      object.isCustomerReady = false;
    } else if (object.docSignStepsComp === '2') { //  for step 2, set show message false
      //  object.isCutomerLoaReady = true;
      this.showCustomerLoaMessage = false;
    }
  }


  continueWelcome(){
    this.showWelcomeMessage = false;
  }



  //  method to call link/delink API
  callCustomerLoaLinkDeLink() {
    if (this.isCutomerAnsweredForLoa) { //  if answered Loa and continue call api to link/delink
      this.callCustomerLoaQuestion(true, 'docCenter');
    } else {
      this.callCustomerLoaQuestion(false, 'docCenter');
    }
  }
  continueDoc(object, index) {
    //  console.log(index);
    if (this.isStatusNotCompleteToAllowDownload() || 
      this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch || this.isLinkedCxInProgress) {
      const modalRef = this.modalVar.open(CustomerLegalWarningComponent, {
        windowClass: 'customer-legal-warning'
      });
      modalRef.componentInstance.isLinkedCxInProgress = this.isLinkedCxInProgress;
    } else {
      // this.continueBtnDisable[index] = this.disableContinueForCustRep;
      // this.isDisableContinueButton = true; // check the questionnarie and set this flag
      if (object.docSignStepsComp === '1') {

        this.manageMSPPartner();
        this.updateNegotiationQuestions();
        this.showLoaCustomerQuestion(object, index); //  method to set loaCutomer data and hide other tabs

        // console.log('test');
        //  this.isCutomerAnsweredForLoa = false; //  set answered to false initially 
      } else if (object.docSignStepsComp === '2') {
        this.isDisableContinueButton = this.disableContinueForCustRep;
        //  console.log('test2');
        //this.callCustomerLoaLinkDeLink();
        this.showConfirmRepresentativeInfo(object, index);
      } else if (object.docSignStepsComp === '3') {

        this.showPreviewDocument(object, index);
      }
    }
  }

  manageMSPPartner() {

       //Manage msp changes  
       if (this.createProposalService.isMSPSelected) {

         if (!this.isCustomerRepresentativeSelected) {
                    
          this.documentCenter.savePartnerDetail(this.partnerRepresentativeContainer).subscribe((resp: any) => {
          })
         }else {
            this.documentCenter.resetPartnerDetail().subscribe((resp: any) => {
            })
         }
        }else {

          //Reset partner details if MSP is set NO and customer representative selected 
          if (!this.isCustomerRepresentativeSelected) {
            this.documentCenter.resetPartnerDetail().subscribe((resp: any) => {
              this.isCustomerRepresentativeSelected = true;
            })
          }
        }
  }

  //  method to show loaCutomerQuestion step and hide other steps
  showLoaCustomerQuestion(object, index) {
    this.docuSignWhoesInvolvedTag[index] = true; //  show recipt info msg
    // this.docuSignBackBtn[index] = true; //  enable back btn
    this.isShowBackButton = true //  enable back btn
    this.docuSignCustomerReadyContainer[index] = true; //  hide customer ready tab
    this.docuSignConfirmContainer[index] = true; //  show conform tab
    this.docuSignPreviewContainer[index] = true; //  show preview tab
    this.docuSignConfirmLoaContainer[index] = false; //  show loa tab
    object.docSignStepsComp = '2';
    this.showCustomerLoaMessage = true; //  show message if entered step 2
  }

  showConfirmRepresentativeInfo(object, index) {

    this.docuSignWhoesInvolvedTag[index] = true; //  show recipt info msg
    // this.docuSignBackBtn[index] = true; //  enable back btn
    this.isShowBackButton = true //  enable back btn
    this.docuSignCustomerReadyContainer[index] = true; //  hide customer ready tab
    this.docuSignConfirmContainer[index] = false; //  show conform tab
    this.docuSignConfirmLoaContainer[index] = true; //  hide loa tab
    object.docSignStepsComp = '3';

    this.isShowContinueButton = false; //  hide continue btn

    this.isShowDownloadLegalPackage = true;
    this.isShowInitiateButton = true;

    //disable initiate signature if email not provided
    this.validateInitiateSignature();
  }

  validateInitiateSignature() {

    this.disableInitiateSignature = false;

    if (!this.isCustomerRepresentativeSelected) {

      if (this.partnerRepresentativeContainer[3].data && this.partnerRepresentativeContainer[3].data.length > 0) {
            this.disableInitiateSignature = false;
      }else {
            this.disableInitiateSignature = true;
      }
    }else {

    if (this.documentCenter.documentCenterData[0].representativeContainer[0] && this.documentCenter.documentCenterData[0].representativeContainer[0][2].data && this.documentCenter.documentCenterData[0].representativeContainer[0][2].data.length > 0) {

      if (this.documentCenter.documentCenterData[0].representativeContainer[1] && this.documentCenter.documentCenterData[0].representativeContainer[1][0].data && this.documentCenter.documentCenterData[0].representativeContainer[1][0].data.length > 0) {

        if (this.documentCenter.documentCenterData[0].representativeContainer[1] && this.documentCenter.documentCenterData[0].representativeContainer[1][2].data && this.documentCenter.documentCenterData[0].representativeContainer[1][2].data.length > 0) {
              this.disableInitiateSignature = false;
        }else {
            this.disableInitiateSignature = true;
        }
       }
      }
       else {
        this.disableInitiateSignature = true;
      }
    }
  }

  showPreviewDocument(object, index) {
    this.docuSignWhoesInvolvedTag[index] = false; //  hide recipt info msg
    this.docuSignConfirmContainer[index] = true; //  hide conform tab
    this.docuSignPreviewContainer[index] = false; //  show preview tab
    // this.docuSignContinueBtn[index] = false; //  hide continue btn
    // this.docuSignInitiateBtn[index] = true; //  show initiate btn
    this.isShowContinueButton = false; //  hide continue btn
    this.isShowInitiateButton = true; //  show initiate btn

    object.docSignStepsComp = '4';
  }


  requestDocSign(object, index) {

    if (this.isStatusNotCompleteToAllowDownload() ||
      this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch || this.isLinkedCxInProgress) {
      const modalRef = this.modalVar.open(CustomerLegalWarningComponent, {
        windowClass: 'customer-legal-warning'
      });
      modalRef.componentInstance.isLinkedCxInProgress = this.isLinkedCxInProgress;
    } else {

      this.documentCenter.initiateDocusign().subscribe((res: any) => {

        if (res && !res.error) {
          this.showPendingInfo(object, index);
          this.documentCenter.getProposalDocsData().subscribe((response: any) => {
            if (response && !response.error) {

              this.updateMSPPartnerDetails(response);

              response.data.forEach(element => {
                if (element.type === this.constantsService.CUSTOMER_PACKAGE) {
                  if (element.status && element.status === ConstantsService.COMPLETED) {
                    this.signature = ConstantsService.SIGNED;
                    this.docuSignStatusPendingContainer[index] = true;
                    this.docuSignStatusCompletedContainer[index] = false;
                    // this.sendAgainBtnDisable[index] = false;
                    this.isDisableSendAgainButton = false;
                  } else {
                    this.signature = ConstantsService.PENDING_SIGN;
                  }
                  this.uploadedFileHasLoa = element.loaIncluded ? true : false;
                }
              });
            } else {
              this.messageService.displayMessagesFromResponse(response);
            }
          });
        }
      });
    }
  }

  showPendingInfo(object, index) {
    // this.docuSignBackBtn[index] = false; //  hide back btn
    this.isShowBackButton = false; //  hide back btn
    // this.docuSignInitiateBtn[index] = false; //  hide initiate btn
    this.isShowInitiateButton = false; //  hide initiate btn

    this.isShowDownloadLegalPackage = false; //  hide initiate btn

    // this.docuSignSendAgainBtn[index] = true; //  show sendAgain btn
    this.isShowSendAgainButton = true; //  show sendAgain btn
    this.showWelcomeMessage = false;
    this.docuSignPreviewContainer[index] = true; //  hide preview container tab
    this.docuSignStatusPendingContainer[index] = false; //  show pending container tab
    // this.sendAgainBtnDisable[index] = false;
    this.isDisableSendAgainButton = false;

    object.toggleStepsCount = true; //  hide steps container
    setTimeout(() => {

      //  this.docuSignStatusPendingContainer[index] = true;
      //  this.docuSignStatusCompletedContainer[index] = false;
      //  this.sendAgainBtnDisable[index] = false;

    }, 3500);
  }

  showCustomerReadiness(object, index, isEnableContinue) {

    this.docuSignStatusCompletedContainer[index] = true; //  hide complete status tab
    this.docuSignCustomerReadyContainer[index] = false; //  show first customer ready
    // this.docuSignSendAgainBtn[index] = false; //  hide send Again btn
    this.isShowSendAgainButton = false; //  hide send Again btn
    // this.docuSignContinueBtn[index] = true; //  show continue btn
    this.isShowContinueButton = true; //  show continue btn
    if (isEnableContinue) {
      if (this.createProposalService.isMSPSelected) {
        // this.continueBtnDisable[index] = false; //  disable  continue button
        this.isDisableContinueButton = false; //  disable  continue button
      } else {
        // this.continueBtnDisable[index] = true; //  disable  continue button
        this.isDisableContinueButton = true; //  disable  continue button
        this.isCustomerReady = false;
      }
    } else {
      // this.continueBtnDisable[index] = true; //  disable  continue button
      // this.isDisableContinueButton = true; //  disable  continue button
      this.isCustomerReady = false;
    }
    this.docuSignStatusPendingContainer[index] = true; //  hide Pending Status Tab
    object.toggleStepsCount = false; //  show steps container
    object.docSignStepsComp = '1';
    object.totalDocuSignSteps = '3';
    // this.renderer.setProperty(this.No.nativeElement, 'checked', 'true');
    object.isCustomerReady = true;
    // object.isCutomerLoaReady = true;
  }

  //  method to call link/delink if seleted the loaCustomerQuestion and continued to next step
  callCustomerLoaQuestion(selected, type) {
    // console.log(selected, 'test3');
    this.documentCenter.loaCusotmerQuestion(selected).subscribe((res: any) => {
      if (res && !res.error) {
        //  for further use
        this.appDataService.loaQuestionSeletedValue = selected;
        this.loaRequired = selected? 'Yes': 'No';
        // this.isCutomerAnsweredForLoa = selected;
        if (type === 'docCenter') { // check type is doccenter and emit to update the value in loa component
          this.appDataService.loaQuestionSelectionEmitter.emit();
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  //  docSignSendAgain(object, index) {
  //    this.showCustomerReadiness(object, index);
  //  }

  docSignSendAgain(object, index) {

    const modalRef = this.modalVar.open(InitiateDocusignWarningComponent, { windowClass: 'info-esignature' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        if(this.appDataService.userInfo.isPartner){
          this.noDocumentChangeNeeded(object,index);
        }else {
          this.showCustomerReadiness(object, index, false);
        }
        this.confirmStatusDocSign();
      }
    });

  }

  openAddModal() {
    const modalRef = this.modalVar.open(AddAffiliatesNameComponent, { windowClass: 'add-affiliates' });
    modalRef.componentInstance.showChangeAffiliateOnUI = this.showChangeAffiliates();
  }


  backDocuSign(object, index) {
    if ((object.docSignStepsComp - 1) === 1) {
      this.showCustomerReadiness(object, index, true);
      this.docuSignConfirmLoaContainer[index] = true;
      this.docuSignConfirmContainer[index] = true; //  hide confirm tab
      // this.docuSignBackBtn[index] = false; //  hide back btn
      this.isShowBackButton = false; //  hide back btn
      this.docuSignWhoesInvolvedTag[index] = false; //  hide whoes involved info
      // this.continueBtnDisable[0] = false;
      this.isDisableContinueButton = false;
    } else if ((object.docSignStepsComp - 1) === 2) { //  if backed and step 2 call loaCustomer step and set data
      this.showLoaCustomerQuestion(object, index);
      this.docuSignPreviewContainer[index] = true; //  hide preview container
      // this.docuSignContinueBtn[index] = true; //  show continue
      this.isShowContinueButton = true; //  show continue btn
      // this.docuSignInitiateBtn[index] = false; //  hide initiate btn
      this.isShowInitiateButton = false; //  hide initiate btn
      this.isShowDownloadLegalPackage = false; //  hide download btn

    } else if ((object.docSignStepsComp - 1) === 3) {
      this.showConfirmRepresentativeInfo(object, index);
      this.docuSignPreviewContainer[index] = true; //  hide preview container
      // this.docuSignContinueBtn[index] = true; //  show continue
      this.isShowContinueButton = true;
      // this.docuSignInitiateBtn[index] = false; //  hide initiate btn
      this.isShowInitiateButton = false; //  hide initiate btn
      this.isShowDownloadLegalPackage = false; //  hide download btn

    }
  }

  showCustomerInstall() {
    this.showCustomerTab = true;
    this.showProposalTab = false;
  }

  showProposalInstall() {
    this.showCustomerTab = false;
    this.showProposalTab = true;
  }

  goToTCOList() {
    this.breadcrumbsService.showFullBreadcrumb = true;
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco/tcoList']);
  }

  initiateTCOModel() {
    const modalRef = this.modalVar.open(CreateTcoComponent, { windowClass: 'create-tco' });
    modalRef.componentInstance.isUpdateTCO = false;
    modalRef.componentInstance.headerMessage = this.localeService.getLocalizedString('tco.list.edit.CREATE_NEW_TCO');
    modalRef.result.then((result) => {
      if (result && result.tcoCreated === true) {
        this.breadcrumbsService.showFullBreadcrumb = true;
        this.tcoDataService.isHeaderLoaded = true;
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId +
          '/tco/' + this.tcoDataService.tcoId]);
      }
    });
    //  this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco/editTco']);
  }

  goToPreviewquotePage() {

    if (this.appDataService.isGroupSelected === true) {
      this.router.navigate(['qualifications/proposal/' +
        this.proposalDataService.proposalDataObject.proposalData.groupId + '/bom' + '/group']);
    } else {
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
    }
  }

  //  method to call api and set to show EA program terms if signed else remove the panel
  getProgramTermsSigned() {
    this.documentCenter.getProgramTermsSignedOrNot().subscribe((res: any) => {
      if (res && !res.error) {
        if (res.data) {
          this.isShowProgramTerms = res.data.signed;
          if (res.data.signedDateStr) {
            this.programTermsSignedDate = res.data.signedDateStr;
          }
        } else {
          this.isShowProgramTerms = false;
        }
      } else {
        this.isShowProgramTerms = false;
        this.messageService.displayMessagesFromResponse(res);
      }
      //  if program terms is not signed, remove the obj from documentCenterData
      if (!this.isShowProgramTerms) {
        this.documentCenter.documentCenterData = this.documentCenter.documentCenterData.filter(h => h.type !== this.constantsService.EA_PROGRAM_TERMS);
      }
    });
  }

  setRadioValue(event, key, index?, object?) {
    this[key] = event.target.value;

    if (event.target.value  === this.constantsService.YES_RADIO_BUTTON) {
      this.isFileContainLOA =  '';
    }
    if((object && object.toggleConfirmedUpload) || this.isLoaPresent ){// cancel upload if switched  to qna
      this.cancelUpload(index, object);
    }
  }
  controlFlyout(mode, checked) {
    this.openClarifications = checked;
    this.clarificationMode = mode;
    if (mode === 'clarificationsTab') {
      if(checked) {
        if(!this.standardClarificationsArray.length){
          this.getClarificationsData();
        } else {
          this.clarificationsList = _.cloneDeep(this.standardClarificationsArray);
        }
      } else {
        if(this.standardcationsSelectedCount != 0) {
          this.documentCenter.saveClarification(mode,[]).subscribe((response: any) => {});
          this.standardClarificationsArray.forEach( element => {
            element.selected  = false;
          });
          this.standardcationsSelectedCount = 0;
        }
      }
      
    } else {
      if(checked) {
        if(!this.modificationsArray.length){
          this.getClarificationsData();
        } else {
          this.clarificationsList = _.cloneDeep(this.modificationsArray);
        }
        
      } else {
        if(this.modificationsSelectedCount != 0) {
          this.documentCenter.saveClarification(mode,[]).subscribe((response: any) => {});
          this.modificationsArray.forEach( element => {
            element.selected  = false;
          });
          this.modificationsSelectedCount = 0;
        }
        
      }
    }
  }

  getClarificationsData(){
    this.documentCenter.getClarificationsData(this.clarificationMode).subscribe((response: any) => {
      if(response && !response.error && response.data){
        if (this.clarificationMode === 'clarificationsTab') {
          this.standardClarificationsArray = response.data;
          this.clarificationsList = _.cloneDeep(this.standardClarificationsArray);
        } else {
          this.modificationsArray = response.data;
          this.clarificationsList = _.cloneDeep(this.modificationsArray);
        }
      } else {
        if(response.error){
          this.messageService.displayMessagesFromResponse(response)
        } else {
          this.messageService.displayUiTechnicalError();
        }
      }
    });
  }

  handleClarificationClose(event) {
    this.openClarifications = false;
    if (event) {
      const selectedIds = event.filter(x => x.selected).map(x => x.id);//filter will give selected objects and map will give id of those objects;

      this.documentCenter.saveClarification(this.clarificationMode,selectedIds).subscribe((response: any) => {
        if(response && !response.error){
          if (this.clarificationMode === 'clarificationsTab') {
            this.standardClarificationsArray = event; 
            this.standardcationsSelectedCount = selectedIds.length;
          } else {
            this.modificationsArray = event;
            this.modificationsSelectedCount = selectedIds.length;
          }
          this.setpTwoQuestionsCheck();
        } else if(response.error){
          this.messageService.displayMessagesFromResponse(response);
        } else {
          this.messageService.displayUiTechnicalError();
        }
      });
    } 
    this.clarificationsList = [];
  }

  //when user click continue from step one check  -> 1) is loa required. 2) any language clarification required. 3) any modifications requested.
  updateNegotiationQuestions(){

    //if some modifications are already selected.
    if(this.modificationsSelectedCount){
      this.modificationsSelected = 'yes';
      this.isCutomerAnsweredForLoa = true;
      this.alreadyObtained = 'no';
      if(!this.standardcationsSelectedCount){
        this.clarificationsSelected = 'no';
      } else {
        this.clarificationsSelected = 'yes';  
      }
    } else if(this.standardcationsSelectedCount){
      this.clarificationsSelected = 'yes';
      this.isCutomerAnsweredForLoa = true;
      this.isDisableContinueButton = true;
      this.modificationsSelected = this.appDataService.loaQuestionSeletedValue ? 'yes': ''
    } else if(this.appDataService.loaQuestionSeletedValue){
      this.isCutomerAnsweredForLoa = true;
      this.clarificationsSelected = 'no';
      this.modificationsSelected = 'yes';
      this.isDisableContinueButton = true;
    }
  }

  noDocumentChangeNeeded(object=null,index=0){
    this.documentCenter.noDocumentChangeNeeded().subscribe((response: any) => {
      if(response && !response.error){
        //reset all questions and selections when user select no for the 1st question.
        this.isCutomerAnsweredForLoa = false;
        this.isDisableContinueButton = false;
        this.displayModificationProceedMsg = false;
        this.modificationsSelected = '';
        this.clarificationsSelected = '';
        this.standardcationsSelectedCount = 0;
        this.standardClarificationsArray = [];
        this.modificationsArray = [];
        this.modificationsSelectedCount = 0;
        this.alreadyObtained = '';
        this.loaRequired = 'No'; // toggle loa required to no;
        this.appDataService.loaQuestionSeletedValue = false;
        if(this.appDataService.userInfo.isPartner){
          this.showCustomerReadiness(object, index, false);
        }
      } else {
        if(response.error){
          this.messageService.displayMessagesFromResponse(response);
        } else {
          this.messageService.displayUiTechnicalError();
        }
      }
    });
  }

  alreadyObtainedLOA(){
    this.documentCenter.alreadyObtainedLOA().subscribe((response: any) => {
      if(response && !response.error){
        this.alreadyObtained = 'yes';
        this.displayDraftCopymsg = true;
        this.isDisableContinueButton = false;
        this.displayModificationProceedMsg = false;
      } else {
        if(response.error){
          this.messageService.displayMessagesFromResponse(response);
        } else {
          this.messageService.displayUiTechnicalError();
        }
      }
    });
  }

  checkLOA() {
    if(this.isContainsLOA === 'no' && this.newDocumentData.fileNameInQueue) {
      return true;
    } else {
      return false;
    }
  }

  downloadDraftDoc(){//generateFileName
    const url = 'api/document/download/loa?p='+ 
    this.proposalDataService.proposalDataObject.proposalId +'&fcg=1&f=1&ctx=single'
    this.documentCenter.downloadDoc(url).subscribe((res: any) => {
      this.generateFileName(res);
    })
  }

  downloadSignedLOA() {
    if(this.documentCenter.documentCenterData[0].loafilesContainer && this.documentCenter.documentCenterData[0].loafilesContainer[0]) {
      const docId = this.documentCenter.documentCenterData[0].loafilesContainer[0].documentId
      
      let url = 'api/document/partner/download?proposalId=' + this.proposalDataService.proposalDataObject.proposalId + '&documentId=' + docId;

      this.documentCenter.downloadDoc(url).subscribe((res: any) => {
        this.generateFileName(res);
      });
    }    
  }

  setRepresentativeContainerData(elem,responseData,qualServiceData){
    if (elem.heading === 'NAME') {
      elem.data = responseData.repName;
      this.documentCenter.fullName = elem.data;
      qualServiceData.repName = responseData.repName;
    }
    /*if (elem.heading === 'PREFERRED LEGAL NAME') {
      elem.data = response.data.customerContact.preferredLegalName;
      this.documentCenter.fullName = elem.data;
      qualServiceData.preferredLegalName = response.data.customerContact.preferredLegalName;
    }*/
    if (elem.heading === 'TITLE') {
      elem.data = responseData.repTitle;
      qualServiceData.repTitle = responseData.repTitle;
    }
    if (elem.heading === 'EMAIL') {
      this.documentCenter.emailId = elem.data;
      elem.data = responseData.repEmail;
      qualServiceData.repEmail = responseData.repEmail;
    }
    if(elem.heading === 'phoneCountryCode'){
      elem.data = responseData.phoneCountryCode;
      qualServiceData.phoneCountryCode = responseData.phoneCountryCode;
    }
    if(elem.heading === 'dialFlagCode'){
      elem.data = responseData.dialFlagCode;
      qualServiceData.phoneCountryCode = responseData.dialFlagCode;
    }
    if(elem.heading === 'phoneNumber'){
      elem.data = responseData.phoneNumber;
      qualServiceData.phoneCountryCode = responseData.phoneNumber;
    }
  }

  programmTermIncluded(condition){
    this.documentCenter.getProgrammTermIncluded(condition).subscribe((res: any) => {
      if (res && !res.error) {
        this.isProgrammTermIncluded = condition ? true : false;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to get linked SW and services proposals
  getCxLinkedProposalListData(linkId){
    let cxSwProposalsLinkedData = []
    this.documentCenter.getCxLinkedProposalList(this.proposalDataService.proposalDataObject.proposalId, linkId).subscribe((res: any) => {
      if (res && res.data && !res.error){
        if (res.data.matching && res.data.matching.length){
          cxSwProposalsLinkedData = res.data.matching;
          this.showCxInprogressForSw(cxSwProposalsLinkedData); // method to check if linkedCXproposal is InProgress
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to check if linkedCXproposal is InProgress
  showCxInprogressForSw(proposals){
    for (const data of proposals){
      if (data.architecture_code === ConstantsService.TYPE_CX && data.status === this.constantsService.IN_PROGRESS_STATUS){
        this.isLinkedCxInProgress = true;
      }
    }
  }

  // valid mandatory customer rep fields and show error message
  validateMandtoryFields(){
    if(this.qualService.qualification.customerInfo && Object.keys(this.qualService.qualification.customerInfo).length && (this.qualService.qualification.customerInfo.repName && (!this.qualService.qualification.customerInfo.repTitle || !this.qualService.qualification.customerInfo.phoneNumber))){
      return true;
    }
    if(this.qualService.additionalCustomerContacts && this.qualService.additionalCustomerContacts.length && (!this.qualService.additionalCustomerContacts[0].repName || !this.qualService.additionalCustomerContacts[0].repTitle || !this.qualService.additionalCustomerContacts[0].phoneNumber)){
      return true;
    }
    if(this.createProposalService.isMSPSelected && this.partnerRepresentativeContainer[1].data && !this.partnerRepresentativeContainer[4].data){
      return true;
    }
  }
}
