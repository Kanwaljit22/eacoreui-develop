
import {of as observableOf,  Observable ,  Subscription } from 'rxjs';

import {debounceTime, mergeMap} from 'rxjs/operators';
import { ProposalArchitectureService } from './../../shared/proposal-architecture/proposal-architecture.service';
import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { IonRangeSliderComponent, IonRangeSliderCallback } from '@app/shared/ion-range-slider/ion-range-slider.component';
import * as _ from 'lodash';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ITitleWithButtons } from '../../shared/title-with-buttons/title-with-buttons.model';
import { IPartner } from '../../../app/shared/models/partner.model';
import { CreateProposalService } from './create-proposal.service';
import { QualificationsService } from '../../qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalDataService, PartnerInfo } from '@app/proposal/proposal.data.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPartnerContactComponent } from '../../modal/add-partner-contact/add-partner-contact.component';
import { ListProposalService } from '../list-proposal/list-proposal.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { LocaleService } from "@app/shared/services/locale.service";
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { ProposalSummaryService } from '../edit-proposal/proposal-summary/proposal-summary.service';
import { LookupSubscriptionComponent } from '@app/modal/lookup-subscription/lookup-subscription.component';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { DatePipe } from '@angular/common';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';

const DURATION_TYPES = {
  MONTHS36: 'MONTHS36',
  MONTHS60: 'MONTHS60',
  MONTHSCUSTOM: 'MONTHSCUSTOM',
  MONTHSCOTERM: 'MONTHSCOTERM'
};

const MONTH = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss']
})

export class CreateProposalComponent implements AfterViewInit {


  isBillingAnnual: boolean;
  // -- for partner search
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;
  priceListArray: any;
  dateSelected: any;
  isPartnerDeal: boolean = false;
  allowDebounce = false;

  //----
  //public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  reqJSON: any = {};
  myForm: FormGroup;
  titleWithButton: ITitleWithButtons = this.getTitleWithButton();
  @ViewChild('sliderElement', { static: true }) sliderElement: IonRangeSliderComponent;
  @ViewChild('myDropsearch', { static: false }) myDropsearch;
  @ViewChild('myDropBillingsearch', { static: true }) myDropBillingsearch;
  @ViewChild('myDropCountrysearch', { static: true }) myDropCountrysearch
  @ViewChild('myDropPricesearch', { static: false }) myDropPricesearch
  @ViewChild('myDropArchitecture', { static: false }) myDropArchitecture
  simpleSlider = this.getSlider();
  proposalName: FormControl;
  eaStartDate: FormControl;
  eaTerm: FormControl;
  countryOfTransaction: FormControl;
  billingModel: FormControl;
  priceList: FormControl;
  description: FormControl;
  partnerName: FormControl;
  partnerList: FormControl;
  ciscoOne: FormControl;
  security: FormControl;
  collabration: FormControl;
  addPrimaryPartner: FormControl;
  countryOfTransactions: Array<any>;
  billingModels: Array<any>;
  primaryPartners: Array<any>;
  durationTypes: any;
  selectedPartners: Array<IPartner>
  allUsers: Array<IPartner>;
  todaysDate: Date;
  expectedEAStartDate: Date; // max start dtae
  expectedEADefaultStartDate: Date; // default start date
  resetExpectedStartDate: Date; // reset max start date
  resetExpectedDefaultStartDate: Date; // reset default start date
  json: any;
  duration: any = '';
  partnerNames = [];
  errorProposalName = false;
  errorPriceList = false;
  errorCountry = false;
  errorDateSelection = false;
  errorDuration = false;
  errorMessageProposalName: any;
  errorMessagePriceList: any;
  errorMessagePartnerName = '';   
  errorMessageCountry: any;
  errorMessageDuration: any;
  errorDateSelectionMessage: any;
  isChangeSubFlow = false;
  pratners = [];
  isPartnerDataLoaded = false;
  displayDurationMsg = false;
  selectedPartner: PartnerInfo = { name: "", partnerId: 0 };

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  createNewProposal = false;
  createProposalTable: any = [];
  selectPartnerDisabled = true;
  displayCustomDurationWarning = false;
  displayCustomDurationWarningForDC = false; // set if DC arch and term selected > 84 months
  // displayCustomDNADurationWarning = false;
  selectedPriceList = this.localeService.getLocalizedString('proposal.create.SELECT_PRICE_LIST');
  selectedCountryTranscation = this.constantsService.UNITED_STATES;
  defaultCountryName = this.constantsService.UNITED_STATES;
  defaultCountryCode = this.constantsService.US;
  selectedBillingModel = ConstantsService.PREPAID_TERM
  selectedPartnerName = this.localeService.getLocalizedString('proposal.create.PRIMARY_PARTNER_DEFAULT');
  selectedPrimaryPartnerName = '';
  selectedCountryCode = this.constantsService.US ;
  selectedPriceListName = "" ;
  architectureShow = true;
  subscription: Subscription;
  showBillingError = false;
  showMSPBillingError = false;
  mspQuestionSelected = false;

  partnerLedFlow = true;
  type: string;
  billingModelInfo = false;
  approvalWarning = false;
  archName : string
  billingDisplayname : string;
  showMspError = true;
  public showEndDate = false;
  customDate = false;
  subscriptionList = [];
  isSubscriptionListLoaded = false;
  eaEndDate: Date;
  referenceSubscriptionId = '';
  eaEndDateStr = '';
  eaEndDateInString = '';
  displayEndDateErrorMsg = false;
  durationInMonths: any;
  isShowCoTerm = false;
  demoProposalPermission:any;
  demoProposal = true;
  showCiscoEaAuth = false;
  is2tPartner = false;

  public subscribers: any = {};
  constructor(public localeService: LocaleService, private router: Router, private route: ActivatedRoute, public createProposalService: CreateProposalService, public constantsService: ConstantsService,
    public qualService: QualificationsService, public appDataService: AppDataService, public messageService: MessageService, public permissionService: PermissionService,
    private utilitiesService: UtilitiesService, public proposalDataService: ProposalDataService, public listProposalService: ListProposalService,
    private modalVar: NgbModal, private renderer: Renderer2, private proposalArchitectureService: ProposalArchitectureService, private proposalSummaryService: ProposalSummaryService,
   private blockUiService: BlockUiService, private datepipe : DatePipe, private eastoreService: EaStoreService, private eaService: EaService) {
    this.allUsers = this.getUsers();
    this.durationTypes = DURATION_TYPES;
    // this.billingModels = [{
    //   "id" : 1,
    //   "displayName" : ConstantsService.PREPAID_TERM
    // },
    // {
    //   "id" : 2,
    //   "displayName" : ConstantsService.ANNUAL_BILLING
    // }];
    this.priceListArray = [];
    this.primaryPartners = [];
    this.pratners = [];
    this.selectedPartners = [];
    this.proposalName = new FormControl('', [Validators.required]);
    this.dateSelected = this.eaStartDate = new FormControl(new Date(), [Validators.required]);
    this.eaTerm = new FormControl(36, [Validators.required]);
    this.countryOfTransaction = new FormControl('');
    this.billingModel = new FormControl('');
    this.priceList = new FormControl('');
    this.description = new FormControl('');
    this.partnerName = new FormControl('', [Validators.required]);
    this.addPrimaryPartner = new FormControl('yes', [Validators.required]);
    this.partnerList = new FormControl([]);
    this.ciscoOne = new FormControl(false);
    this.security = new FormControl(false);
    this.collabration = new FormControl(false);
    this.myForm = new FormGroup({
      proposalName: this.proposalName,
      eaStartDate: this.eaStartDate,
      eaTerm: this.eaTerm,
      countryOfTransaction: this.countryOfTransaction,
      billingModel: this.billingModel,
      priceList: this.priceList,
      description: this.description,
      addPrimaryPartner: this.addPrimaryPartner,
      architecture: new FormGroup({
        ciscoOne: this.ciscoOne,
        security: this.security,
        collabration: this.collabration
      }),
      partnerName: this.partnerName,
      partnerList: this.partnerList,
    });

    // -- for partner search 
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    }).pipe(mergeMap((token: string) => this.getUserAsObservable(token)));
    // ----

  }

  ngOnInit() {
    // if(sessionStorage.getItem('projectId')){
    //   this.qualService.qualification.qualID = sessionStorage.getItem('projectId');
    // }

    if (this.appDataService.isPatnerLedFlow) {
      this.appDataService.userDashboardFLow = '';
    }
    this.type = "create";
    //Reset invalid billing model 
    this.resetBilling();

    this.expectedEAStartDate = new Date();
    this.expectedEADefaultStartDate = new Date();
    this.resetExpectedStartDate = new Date();
    this.resetExpectedDefaultStartDate = new Date();
    //this.getEaStartDate();
    this.getEaMaxStartDate(); // to get max and default start dates
    this.getBillingModelDetails();
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    //this.expectedEAStartDate = new Date();
    this.todaysDate.setDate(this.todaysDate.getDate());
    // for showing activity log icon
    this.appDataService.showActivityLogIcon(true);
    //Get create proposal start date time limit 
    //this.appDataService.getProposalStartDateTimeLimit();

    // if(this.appDataService.startDateTimeLimit > 0) {
    //   this.expectedEAStartDate.setDate(this.todaysDate.getDate() + this.appDataService.startDateTimeLimit);
    //   this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEAStartDate);
    // }
    this.proposalDataService.cxProposalFlow = false; // reset cxproposalFlow flag if set to true
    this.demoProposalPermission = this.permissionService.permissions.get(PermissionEnum.DEMO_PROPOSAL);

    this.subscription = this.proposalDataService.billingErrorEmitter.subscribe((isError) => {
      this.showBillingError = isError;
    });

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.CreateProposal;
    this.partnerLedFlow = this.isPartnerDeal = this.createProposalService.isPartnerDeal;
    if (this.qualService.qualification.qualID === "") {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      this.qualService.qualification = sessionObject.qualificationData;
      this.proposalDataService.proposalDataObject.newProposalFlag = true;
      //this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;
    }
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
      const qualName = this.qualService.qualification.name.toUpperCase();
      this.appDataService.custNameEmitter.emit({ 'context': AppDataService.PAGE_CONTEXT.userProposals, qualId: this.qualService.qualification.qualID, 'text': qualName });
    }
    this.createProposalService.partnerAPI(this.qualService.qualification.qualID).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        this.pratners = res.data;

        //Automatically select partner if count is 1 only
        if (this.pratners.length === 1) {
          
          this.selectedPartnerName = this.pratners[0].name;
          this.selectedPartner.name = this.pratners[0].name;
          this.selectedPartner.partnerId = this.pratners[0].partnerId;
          this.selectedPrimaryPartnerName = this.pratners[0].name;
          this.createProposalService.partnerID = this.selectedPartner.partnerId; 		
          this.isPartnerDataLoaded = true;
          if(this.pratners[0]?.partnerIdSystem && this.pratners[0]?.dealIdSystem){
            this.selectedPartner.dealIdSystem = this.pratners[0]?.dealIdSystem;
            this.selectedPartner.partnerIdSystem = this.pratners[0]?.partnerIdSystem;
          }
          this.checkIfMSPPartner(false);
          if(!this.partnerLedFlow){
          this.showCiscoEaAuth = true;
          this.proposalSummaryService.getPurchaseOptionsDataForSelectedPartner(this.selectedPartner.partnerId);
          }    
        }
      } else {
        this.isPartnerDataLoaded = true;
      }
    });

    this.blockUiService.spinnerConfig.startChain();
    this.qualService.getQualHeader().subscribe((res: any) => {
      
      this.blockUiService.spinnerConfig.unBlockUI();
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();

      if (res && res.data && !res.error) {
        if (res.data.changeSubscriptionDeal) {
          this.qualService.changeSubscriptionDeal = res.data.changeSubscriptionDeal;
        } else {
          this.qualService.changeSubscriptionDeal = false;
        }

        if (res.data.subscription && this.appDataService.displayChangeSub) {
          this.qualService.qualification.subscription = res.data.subscription;
          this.qualService.subRefID = res.data.subRefId;
        } else {
          this.qualService.qualification.subscription = {};
          this.qualService.subRefID = '';
        }

        if (res.data.distiDetail) {
          this.createProposalService.distiName = res.data.distiDetail.name;
        }else {
          this.createProposalService.distiName = '';
        }

        this.qualService.buyMethodDisti = res.data.buyMethodDisti ? true : false;
        this.is2tPartner = this.qualService.buyMethodDisti; // set 2tpartner flag to hide distributor team 
        this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(this.is2tPartner , res.data.distiDeal)
        if (this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub) {
          this.isShowCoTerm = true;
          this.showEndDate = true;
          this.isChangeSubFlow = true;

          if(this.qualService.qualification.subscription['billingModel']){
            this.selectedBillingModel = this.billingDisplayname = this.qualService.qualification.subscription['billingModel'];
          }

          this.selectSubscription({ 'endDate': this.qualService.qualification.subscription['endDate'], 'subscriptionId': this.qualService.qualification.subscription['subRefId'] });
        } else {
          this.checkCotermAllowedOrNot();// check coterm allowed or not and show
        }
        this.isPartnerDeal = this.partnerLedFlow = res.data.partnerDeal;
        this.createProposalService.isPartnerDeal = this.isPartnerDeal;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    if (sessionObject) {
      this.appDataService.isPatnerLedFlow = sessionObject.isPatnerLedFlow;
      if (sessionObject.partnerDeal) {
        this.isPartnerDeal = this.partnerLedFlow = sessionObject.partnerDeal
      }
    }
    this.createProposalService.isPartnerDeal = this.isPartnerDeal;
    // load purchseoptions api and set data if it's partnerLedFlow and api is not loaded
    if (this.partnerLedFlow && !this.appDataService.isPurchaseOptionsLoaded) {
      this.proposalSummaryService.getPurchaseOptionsData();
    }
    this.getPriceList();
    this.getCountryOfTransactions();
    // this.setChangeSubFlow();
    this.appDataService.subHeaderData.moduleName = 'LIST_PROPOSAL';
    this.qualService.prepareSubHeaderObject(this.appDataService.subHeaderData.moduleName, true);
    if (this.proposalDataService.proposalDataObject.newProposalFlag) {
      this.proposalDataService.proposalDataObject.proposalData.name = '';
      this.proposalDataService.proposalDataObject.proposalData.desc = '';
      this.proposalDataService.proposalDataObject.proposalId = null;
      this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = 36;
      this.createProposalService.oldvalue = new Date(); // this.myForm.get('eaStartDate').value;      
      this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction = "US";
      this.createProposalService.oldCountryValue = this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction;
      this.proposalDataService.proposalDataObject.proposalData.billingModel = this.localeService.getLocalizedString('proposal.create.PREPAID');
      this.proposalDataService.proposalDataObject.proposalData.priceList = "";
      this.proposalDataService.proposalDataObject.proposalData.partner = { 'name': "", "partnerId": 0 };
      //     this.expectedEAStartDate = new Date();
      //     this.expectedEAStartDate.setDate(this.expectedEAStartDate.getDate() + this.appDataService.startDateTimeLimit);
      //    this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEAStartDate);
    }
    //    console.log(this.proposalDataService.proposalDataObject.proposalData)
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);

    this.subscribers.changeSubPermissionEmitter = this.appDataService.changeSubPermissionEmitter.subscribe((allowChangSub: any) => {
      this.appDataService.allowChangSub = allowChangSub;
      // this.setChangeSubFlow();
    });
  }
  
  /* create handler to for user story US391064*/
  architectureNameChangedHandler(archName : string) {
    this.archName = archName;
    this.errorDuration = false;
    //debugger
    if (!this.mspQuestionSelected && archName === 'C1_DNA' && this.selectedBillingModel === 'Annual Billing' ) {        
        this.approvalWarning = true;
        this.billingModelInfo = true;
    } else  if(this.selectedBillingModel === 'Annual Billing') {
      this.approvalWarning = false;
      this.billingModelInfo = true;
    } else  {
      this.approvalWarning = false;
      this.billingModelInfo = false;      
    }	

    this.resetNonMSPBillingModel(this.mspQuestionSelected);
    this.displayCustomDurationWarningForDC = this.check84MonthsDurationForDC(this.eaTerm.value);

  }
  
   checkIfMSPPartner(isDifferentPartnerSelected) {		
    let dealId = this.qualService.qualification.dealId;
    let partnerId = this.selectedPartner.partnerId;
    if(this.eaService.features?.PARAMETER_ENCRYPTION && this.selectedPartner?.partnerIdSystem && this.selectedPartner?.dealIdSystem){
      dealId = this.selectedPartner.dealIdSystem;
      partnerId = this.selectedPartner.partnerIdSystem;
    }
     this.createProposalService.checkIfMSPPartner(dealId,partnerId).subscribe((res:any) =>{		
      if (res && !res.error && res.data) {		
        
         if(res.data.eligibleArchs) {	
          this.createProposalService.eligibleArchs =  res.data.eligibleArchs;
         this.createProposalService.mspPartner = res.data.eligibleArchs.includes(this.proposalDataService.selectedArchForQna);		
         }
        else {
          this.createProposalService.eligibleArchs = [];		
          this.createProposalService.mspPartner = false;	
          if (isDifferentPartnerSelected) {	
            this.manageNonMSPPartner();	
          }	
        }		
      }		
     } 		
   );		
  }

   /* update code for user story US391064*/
  billingChanged(billing) {
    this.showMSPBillingError = false;
    this.proposalDataService.invalidBillingModel = false;
    this.billingDisplayname = billing.displayName;

    if (!this.mspQuestionSelected && this.archName === 'C1_DNA' && billing.displayName === 'Annual Billing' ) {
      this.approvalWarning = true;
      this.billingModelInfo = true;
    } else  if(billing.displayName === 'Annual Billing') {
      this.approvalWarning = false;
      this.billingModelInfo = true;
    } else  {
      this.approvalWarning = false;
      this.billingModelInfo = false;      
    }	
    this.selectedBillingModel = billing.displayName;

    this.proposalDataService.invalidBillingModel = false;

    this.proposalDataService.proposalDataObject.proposalData.billingModel = this.selectedBillingModel;
    this.proposalDataService.proposalDataObject.proposalData.billingModelID = billing.identifier;
    this.proposalDataService.validateBillingModel();
    setTimeout(() => {
      this.myDropBillingsearch.close();
    });
    this.simpleSlider.step = 1;
    // commented out for stopping annual billing 
    // this.isBillingAnnual = (this.selectedBillingModel === ConstantsService.ANNUAL_BILLING) ? true: false;
    // if(this.isBillingAnnual){
    //   this.simpleSlider.step = 12;
    //   this.roundSliderValueToYear(this.myForm.get('eaTerm').value);
    // }
    // else{
    //   this.simpleSlider.step = 1;
    // }
    this.changeValueForSlider(this.sliderElement, this.myForm.get('eaTerm').value);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
    }, 0);
  }

// method to check coterm allowed or not and show/hide
checkCotermAllowedOrNot(){
  this.createProposalService.getCotermAllowed().subscribe((res: any) => {
    if(res && !res.error){
      this.isShowCoTerm = res.data;
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  });
}


  onDateSelection($event) {
    this.eaStartDate.setValue($event);
    this.createProposalService.oldvalue = this.myForm.get('eaStartDate').value;

    if ($event > this.expectedEAStartDate) {
      this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_EXCEED_LIMIT_MESSAGE');
      this.errorDateSelection = true;
    } else if ($event < this.todaysDate) {
      this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_CANNOT_BE_LESS_MESSAGE');
      this.errorDateSelection = true;
    } else if (this.eaStartDate.status === 'INVALID') {
      this.errorDateSelectionMessage = 'Invalid Date';
      this.errorDateSelection = true;
    } else {
      this.errorDateSelection = false;
    }
    if (this.showEndDate && this.referenceSubscriptionId) {
      let rsdInStr = this.formartDateToStr(this.myForm.get('eaStartDate').value);
      this.getDurationInMonths(rsdInStr, this.eaEndDateInString);
    }
    //this.createProposalService.oldCountryValue = this.myForm.get('countryOfTransaction').value;
  }

  //Reset invalid billing model 
  resetBilling() {
    this.archName = '';
    this.mspQuestionSelected = false;
    this.approvalWarning = false;
    this.showBillingError = false;
    this.showMSPBillingError = false;
    this.proposalDataService.invalidBillingModel = false;
    this.proposalDataService.proposalDataObject.proposalData.billingModelID = ConstantsService.PREPAID_TERM_ID;
    this.proposalDataService.selectedArchForQna = "";
    this.mspQuestionSelected = false;
    this.createProposalService.isMSPSelected = false;
    this.billingModelInfo = false;
    this.displayCustomDurationWarningForDC = false;
    // Reset billing deafult to prepaid and annual
    if(this.billingModels) {
        const arrWithoutQuarterly = this.billingModels.filter(item => item.identifier !== ConstantsService.QUARTERLY);		
        const arrWithoutMonthly = arrWithoutQuarterly.filter(item => item.identifier !== ConstantsService.MONTHLY);		
        this.billingModels =  arrWithoutMonthly;
    }
  }

  resetNonMSPBillingModel(isMSPSelected) {	
   // debugger;
     this.mspQuestionSelected = isMSPSelected;  
   if ((this.archName !== this.constantsService.DNA  || !this.mspQuestionSelected)&& (this.proposalDataService.proposalDataObject.proposalData.billingModelID === ConstantsService.QUARTERLY || this.proposalDataService.proposalDataObject.proposalData.billingModelID === ConstantsService.MONTHLY || this.proposalDataService.proposalDataObject.proposalData.billingModelID === '')  ) {        	

       this.resetMSPBilling();
    }	
  }	


  resetMSPBilling() {

    this.showMSPBillingError = true;	
    this.proposalDataService.invalidBillingModel = true;	
    this.selectedBillingModel = 'Select';	
    this.proposalDataService.proposalDataObject.proposalData.billingModel = '';	
    this.proposalDataService.proposalDataObject.proposalData.billingModelID = '';	
  }


selectedMSP (val:boolean) {

  if (val && this.showMspError) {
      this.resetMSPBilling(); 
  }else {
     this.showMspError = false;
  }
}

	//Reset billing if Non MSP Partner selected and billing is quarterly  or monthly	
manageNonMSPPartner() {	
  if (this.proposalDataService.proposalDataObject.proposalData.billingModelID === ConstantsService.QUARTERLY || this.proposalDataService.proposalDataObject.proposalData.billingModelID === ConstantsService.MONTHLY) {	
    this.resetMSPBilling();	
  }	
}


  checkDurationsSelected(event) {
    switch (event.target.value) {
     
      case this.durationTypes.MONTHS60:
        this.eaTerm.setValue(60);
       this.customDate = false;
        this.resetSubData();
        break;
      case this.durationTypes.MONTHS36:
        this.eaTerm.setValue(36);
      this.customDate = false;
        this.resetSubData();
        break;
      case this.durationTypes.MONTHSCUSTOM:
        this.customDate = true;
        this.resetSubData();
        //this.eaTerm.setValue(12);
        break;
      
        case this.durationTypes.MONTHSCOTERM:
          //this.eaTerm.setValue(36);
          this.customDate = false;
          this.showEndDate = true;
          if(!this.isSubscriptionListLoaded){
            this.getSubscriptionsList();
          }
      default:
        setTimeout(() => {
          this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
        }, 0);
        break;
    }
    if(!this.showEndDate){
      this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
    }
    //this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(this.eaTerm.value);
    if (event.target.value === this.durationTypes.MONTHSCUSTOM) {
      // if(this.eaTerm.value > 60) {
      //   this.displayCustomDNADurationWarning = true;
      // } else 
      if(this.eaTerm.value !== 36 && this.eaTerm.value !== 60) {
        this.displayCustomDurationWarning = true;
      }
      
    }
  }
  resetSubData(){
    this.showEndDate = false;
    this.referenceSubscriptionId = '';
    this.eaEndDateStr = '';
    this.eaEndDateInString = '';
    this.displayDurationMsg = false;
    this.displayEndDateErrorMsg = false;
     //this.eaTerm.enable();
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
 

getSubscriptionsList(){
  this.createProposalService.getSubscriptionList().subscribe((res: any) => {
    this.isSubscriptionListLoaded = true;
    if (res && !res.error && res.data) {
      this.subscriptionList = res.data;
      // this.isSubscriptionListLoaded = true;
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  });
}

  changeValueForSlider(element: IonRangeSliderComponent, value: number) {
    this.errorDuration = false;
    this.eaTerm.setValue(value);
    element.update({ from: value });
    
    this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(Number(this.eaTerm.value));
    this.displayCustomDurationWarningForDC = this.check84MonthsDurationForDC(this.eaTerm.value);
    // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(Number(this.eaTerm.value));    
  }

  getSlider() {
    return {
      name: "Simple Slider",
      min: 12,
      max: 84,
      grid: true,
      grid_num: 4,
      step: 1,
      onStart: (event: IonRangeSliderCallback) => {
        // console.log(event)
      },
      onChange: (event: IonRangeSliderCallback) => {
        // console.log(event)
      },
      onUpdate: (event: IonRangeSliderCallback) => {

        this.errorDuration = false;
        this.eaTerm.setValue(event.from);
        this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = event.from;
        this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(this.eaTerm.value);
        this.displayCustomDurationWarningForDC = this.check84MonthsDurationForDC(this.eaTerm.value);
        // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(Number(this.eaTerm.value));
      },
      onFinish: (event: IonRangeSliderCallback) => {
        // console.log(event)
      }
    }
  }

  // mehtod to check if DC arch selected and term > 60 months to show warning message
  check84MonthsDurationForDC(val) {
    if (this.archName === 'C1_DC' && val > ConstantsService.PROPOSAL_STANDARD_DURATION_MAX_VALUE) {
      return true;
    }
    else {
      return false;
    }
  }

  onCOTChange(val) {
    this.selectedCountryTranscation = val.countryName;
    this.selectedCountryCode = val.isoCountryAlpha2;
    setTimeout(() => {
      this.myDropCountrysearch.close();
    });
  }


  onPriceListChange(val) {
    this.selectedPriceList = val.description;
    this.selectedPriceListName = val.name;
    setTimeout(() => {
      this.myDropPricesearch.close();
    });
    this.proposalDataService.proposalDataObject.proposalData.priceListId = val.priceListId;
    this.proposalDataService.proposalDataObject.proposalData.currencyCode = val.currencyCode;
    if (this.selectedPriceListName) {
      this.errorPriceList = false;
    }
  }

  selectSubscription(sub){
    if (sub === 'deselect') {
      this.referenceSubscriptionId = '';
      this.eaEndDateStr = '';
      this.eaEndDateInString = '';
      this.displayDurationMsg = false;
      this.displayEndDateErrorMsg = false;
      return;
    }
   //add code for end date as well;
   this.displayEndDateErrorMsg = false;
   this.displayDurationMsg = false;
   this.referenceSubscriptionId = sub.subscriptionId;
   this.eaEndDate = new Date(sub.endDate);
   this.eaEndDateStr = this.datepipe.transform(this.eaEndDate, 'dd-MMM-YYYY');
  
   // to send in req json
    // let a = (this.eaEndDate.toString().substring(4, 7));
    // let endDate_ea: string = this.eaEndDate.toString().substring(11, 15) + MONTH[a] + this.eaEndDate.toString().substring(8, 10);
    this.eaEndDateInString = this.formartDateToStr(this.eaEndDate);
    //this.eaEndDateInString = this.formartDateToStr(this.eaEndDate);
    let rsdInStr = this.formartDateToStr(this.myForm.get('eaStartDate').value);
    this.getDurationInMonths(rsdInStr, this.eaEndDateInString);
  }
   // to formart date into 8 digit
   formartDateToStr(date){
    let a = (date.toString().substring(4, 7));
    let date_ea: string = date.toString().substring(11, 15) + MONTH[a] + date.toString().substring(8, 10);
    return date_ea;
  }

  // method to get duration in months if selected co-terms and subId
  getDurationInMonths(rsd, endDate){
    //console.log(rsd, endDate);
    this.durationInMonths = '';
    this.displayDurationMsg = false;
    this.createProposalService.durationMonths(rsd, endDate).subscribe((res: any) => {
      if(res && !res.error){
        this.durationInMonths = this.utilitiesService.checkDecimalOrIntegerValue(res.data);
        this.eaTerm.setValue(this.durationInMonths);
        if(this.durationInMonths < 12){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
   roundSliderValueToYear(yearSelected) {
    let num = yearSelected;
    if (num > 12 && num <= 60) {
      num = Math.round(num / 12);
      num = num * 12;
    }
    this.eaTerm.setValue(num);
    this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = num;
    // this.eaTerm.setValue(num);

  }

  getTitleWithButton(): ITitleWithButtons {
    return {
      baseClass: '',
      parentClass: 'col-md-5',
      rootClass: 'row',
      buttonParentClass: 'qualify-btn',
      buttonDivisionClass: 'col-md-7',
      title: '<h2>Create Proposal<h2>',
      buttons: [
        {
          name: this.localeService.getLocalizedString('common.RESET'),
          buttonClass: 'btn btn-secondary',
          attr: false,
          parentClass: 'viewIbsummary',
          click: () => {
            // // this.isBillingAnnual = false;

            // this.selectedCountryCode = this.constantsService.US;
            // this.selectedCountryTranscation = this.constantsService.UNITED_STATES;
            // // this.referenceSubscriptionId = '';
            // if (!this.partnerLedFlow) {
            //   this.selectedPriceList = this.localeService.getLocalizedString('proposal.create.SELECT_PRICE_LIST');
            // } else {
            //   this.selectedPriceList = this.priceListArray[0].description;
            // }
            // this.selectedBillingModel = ConstantsService.PREPAID_TERM;
            // this.billingDisplayname = ConstantsService.PREPAID_TERM; 
            // this.customDate = false;
            // // this.referenceSubscriptionId = '';
            // this.myForm.reset({
            //   proposalName: '',
            //   eaStartDate: this.expectedEADefaultStartDate, // reset to expectedEADefaultstartDate
            //   eaTerm: this.isChangeSubFlow? this.durationInMonths: 36,
            //   billingModel: ConstantsService.PREPAID_TERM,
            //   description: '',
            //   partnerName: '0',
            //   partnerList: [],
            //   partner: {}
            // });
            // if(!this.isChangeSubFlow){
            //   this.showEndDate = false;
            //   this.eaEndDateStr = '';
            //   this.eaEndDateInString = '';
            // } else {
            //   this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
            // }
            // this.selectedPartners = [];
            // this.asyncSelected = '';
            // if (this.partnerLedFlow) {
            //   this.selectedPriceListName = this.priceListArray[0].name;
            // } else {
            //   this.selectedPriceListName = '';
            // }
            // this.errorPriceList = false;
            // this.errorDateSelection = false;
            // this.showMspError = true;

            // //Reset invalid billing model 
            // this.resetBilling();
            // // this.proposalDataService.proposalDataObject.proposalData.eaStartDate.setDate(this.expectedEAStartDate);   
            // this.todaysDate = new Date();
            // this.todaysDate.setHours(0, 0, 0, 0);
            // this.expectedEAStartDate = new Date();
            // this.expectedEADefaultStartDate = new Date();
            // this.todaysDate.setDate(this.todaysDate.getDate());
            // this.expectedEADefaultStartDate = new Date(this.resetExpectedDefaultStartDate); // reset default date
            // this.expectedEAStartDate = new Date(this.resetExpectedStartDate);

            // if (this.proposalArchitectureService.createPageResetEmitter) {
            //   //To reset questionnaire
            //   this.proposalArchitectureService.createPageResetEmitter.emit();
            // }

          }
        },
        {
          name: this.localeService.getLocalizedString('common.CREATE'),
          buttonClass: 'btn btn-primary',
          parentClass: 'viewProspect',
          attr: false,
          click: () => {
            if (!this.myForm.get('proposalName').value.trim()) {
              this.proposalName.setValue("");
              //return;
            }
            let x = this.myForm.get('eaStartDate').value;
            let a = (x.toString().substring(4, 7));
            this.utilitiesService.changeMessage(false);
            let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);

            this.countryOfTransaction.setValue(this.myForm.get('countryOfTransaction').value);
            //console.log(this.myForm.get('countryOfTransaction').value); 
            this.proposalDataService.proposalDataObject.proposalData.name = this.myForm.get('proposalName').value;
            this.proposalDataService.proposalDataObject.proposalData.desc = this.myForm.get('description').value;
            this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = this.myForm.get('eaTerm').value;
            this.proposalDataService.proposalDataObject.proposalData.billingModel = this.selectedBillingModel;
            if (this.partnerLedFlow) {
              this.selectedPriceListName = this.priceListArray[0].name;
            }
            this.showMspError = true;
            this.proposalDataService.proposalDataObject.proposalData.priceList = this.selectedPriceListName;
            this.proposalDataService.proposalDataObject.proposalData.eaStartDate = this.myForm.get('eaStartDate').value;
            this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction = this.selectedCountryCode;
            this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr = date_ea;
            this.constantsService.CURRENCY = this.proposalDataService.proposalDataObject.proposalData.currencyCode;
            if (this.proposalDataService.proposalDataObject.proposalId === null) {
              this.json = {
                "data": {
                  //"userId": this.appDataService.userId,
                  "qualId": this.qualService.qualification.qualID,
                  "name": this.myForm.get('proposalName').value,
                  "desc": this.myForm.get('description').value,
                  "countryOfTransaction": this.selectedCountryCode,
                  "primaryPartnerName": "",
                  "eaStartDateStr": date_ea,
                  "eaTermInMonths": this.myForm.get('eaTerm').value,
                  "billingModel": this.selectedBillingModel,
                  "priceList": this.selectedPriceListName,
                  //"partnerContacts": [],
                  "partner": this.selectedPartner,
                  "currencyCode": this.proposalDataService.proposalDataObject.proposalData.currencyCode,
                  "priceListId": this.proposalDataService.proposalDataObject.proposalData.priceListId,
                  "referenceSubscriptionId" : this.referenceSubscriptionId,
                  "eaEndDateStr": this.eaEndDateInString
                }
              }
            }

            try {
              // commented out for annual billing 
              // this.isBillingAnnual = (this.proposalDataService.proposalDataObject.proposalData.billingModel === ConstantsService.ANNUAL_BILLING)? true:false;
              // if(this.isBillingAnnual){
              //   this.roundSliderValueToYear(this.myForm.get('eaTerm').value);
              // }
              const p_name = this.myForm.get('proposalName').value;
              const b_model = this.selectedBillingModel;
              const p_list = this.selectedPriceListName;

              const partner_name = !this.pratners.length?'NOT_REQUIRED':this.selectedPrimaryPartnerName;
              const c_transaction = this.selectedCountryCode;
              this.proposalArchitectureService.showError = true;
              this.proposalArchitectureService.isAllMandatoryAnswered = true;
              let noDurationError = true;
              if(this.eaTerm.value > 60 && this.archName === 'SEC') {
                noDurationError = false;
              }
              let IsAllAnswered = this.proposalArchitectureService.checkIsAllMandatoryQuestionnaireAreAnsweredForCreate();
              // if any of the mandatory questionnarie are not answered, scroll down to bottom of the component
              if (!IsAllAnswered) {
                window.scrollTo(0, document.body.scrollHeight);
              }
              if(this.showEndDate && !this.referenceSubscriptionId){
                this.displayEndDateErrorMsg = true;
              } else {
                this.displayEndDateErrorMsg = false;
                x.setDate(x.getDate() + 365);
                if(this.showEndDate && this.eaEndDate <= x){
                  this.displayDurationMsg = true;
                } else {
                  this.displayDurationMsg = false;
                }
              }
              
              if (p_name && b_model && p_list && partner_name && c_transaction && noDurationError && IsAllAnswered && !this.proposalDataService.invalidBillingModel  && !this.displayEndDateErrorMsg && !this.displayDurationMsg) {

                this.proposalArchitectureService._finalQuestionnaireRequest = {};
                this.proposalArchitectureService.setFinalQuestionnaireRequest();

                this.json.data.questionnaire = this.proposalArchitectureService._finalQuestionnaireRequest;
                this.json.data.questionnaireUpdate = true;

                	
                //Only if partner is MSP and Cisco DNA selected		
                if(this.createProposalService.mspPartner) {		
                    this.json.data.mspPartner =  this.createProposalService.isMSPSelected;		
                }	


                this.createProposalService.createProposal(this.json).subscribe((res: any) => {
                  if (res && !res.error && res.data) {
                   
                    // if proposal data has permissions and not empty assign to the value else set to empty array
                    if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
                      this.permissionService.proposalPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
                    } else {
                      this.permissionService.proposalPermissions.clear();
                    }
                    //Set local permission for debugger
                    this.permissionService.isProposalPermissionPage(true);

                    // console.log(this.permissionService.proposalPermissions, this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit), this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen));
                    //this.permissionService.proposalReOpen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
                    this.permissionService.proposalEdit = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit);
                    this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.proposalPermissions.has(PermissionEnum.PurchaseAdjustmentPermit);

                    this.listProposalService.navigateToSummary = false;
                    //this.proposalDataService.proposalData.proposalId = res.data.id;
                    this.proposalDataService.crateProposalFlow = true;
                    this.proposalDataService.proposalDataObject.proposalId = res.data.id;
                    this.proposalDataService.proposalDataObject.proposalData = res.data;
                    if (!this.permissionService.proposalEdit) {
                      this.qualService.qualification.userEditAccess = false;
                      this.proposalDataService.proposalDataObject.userEditAccess = false;
                      this.appDataService.isReadWriteAccess = false;
                    } else {
                      this.appDataService.isReadWriteAccess = true;
                      this.proposalDataService.proposalDataObject.userEditAccess = true;
                    }
                    this.appDataService.archName = res.data.archName;
                    if (res.data.partnerDeal) {
                      this.createProposalService.isPartnerDeal = res.data.partnerDeal;
                    } else {
                      this.createProposalService.isPartnerDeal = false;
                    }
                    this.appDataService.roadMapPath = false;
                    this.appDataService.isProposalPending = false;
                    this.appDataService.isPendingAdjustmentStatus = false;
                    //this.appDataService.isReadWriteAccess = true;
                    const sessionObject: SessionData = this.appDataService.getSessionObject();
                    this.createProposalService.proposalCreated = true;
                    sessionObject.isUserReadWriteAccess = this.appDataService.isReadWriteAccess;
                    sessionObject.createAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
                    this.appDataService.setSessionObject(sessionObject);
                    this.proposalDataService.updateSessionProposal();
                    this.router.navigate(['../' + this.proposalDataService.proposalDataObject.proposalId], { relativeTo: this.route });
                  } else {
                    this.messageService.displayMessagesFromResponse(res);
                  }
                });
              }
              else {
                if (!p_name) {
                  this.proposalName.markAsDirty();
                  //this.errorMessageProposalName = "Please enter a valid Proposal name."
                }
                //if (!b_model) {
                //this.billingModel.markAsDirty();
                //this.errorMessageBillingModel = "Please select a billing model."
                //}
                if (!p_list) {
                  this.errorMessagePriceList = this.localeService.getLocalizedMessage('proposal.create.pricelisterror');
                  this.errorPriceList = true;
                }
                
                if (!partner_name) {
                  this.errorMessagePartnerName = this.localeService.getLocalizedMessage('proposal.create.partner_name_error');
                }
                //if (!c_transaction) {
                //this.countryOfTransaction.markAsDirty();
                //this.errorMessageCountry = "Please select a country."
                //}
                if(!noDurationError) {
                  this.errorMessageDuration = this.localeService.getLocalizedMessage('proposal.create.duration');
                  this.errorDuration = true;
                }
              }
            }
            catch (error) {
              //console.error(error.ERROR_MESSAGE);
              this.messageService.displayUiTechnicalError(error);
            }
          }
        }
      ]
    }
  }


  // method to reset the proposal parameters
  reset() {
    // this.isBillingAnnual = false;
    this.simpleSlider.step = 1;
    // this.referenceSubscriptionId = '';
    this.customDate = false;
    // this.referenceSubscriptionId = '';
    this.myForm.reset({
      proposalName: '',
      eaStartDate: this.expectedEADefaultStartDate, // reset to expectedEADefaultstartDate
      eaTerm: this.isChangeSubFlow? this.durationInMonths: 36,
      billingModel: ConstantsService.PREPAID_TERM,
      description: '',
      partnerName: '0',
      partnerList: [],
      partner: {}
    });

    if(!this.isChangeSubFlow){
    this.selectedCountryCode = this.defaultCountryCode;
    this.selectedCountryTranscation = this.defaultCountryName;
      this.showEndDate = false;
      this.eaEndDateStr = '';
      this.eaEndDateInString = '';
      this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
      if (!this.partnerLedFlow) {
        this.selectedPriceList = this.localeService.getLocalizedString('proposal.create.SELECT_PRICE_LIST');
      } else {
        this.selectedPriceList = this.priceListArray[0].description;
      }
      this.selectedBillingModel = ConstantsService.PREPAID_TERM;
      this.billingDisplayname = ConstantsService.PREPAID_TERM;
    } 
    
    this.selectedPartners = [];
    this.asyncSelected = '';
    if (this.partnerLedFlow) {
      this.selectedPriceListName = this.priceListArray[0].name;
    } else {
      this.selectedPriceListName = '';
    }

    if (this.pratners.length === 1) {
      this.selectedPrimaryPartnerName = this.selectedPartnerName;
    } else {
      this.showCiscoEaAuth = false;
      this.selectedPrimaryPartnerName = '';
      this.selectedPartnerName = this.localeService.getLocalizedString('proposal.create.PRIMARY_PARTNER_DEFAULT');
    }
    
    this.errorPriceList = false;
    this.errorMessagePartnerName = '';
    this.errorDateSelection = false;
    this.showMspError = true;
    
    //Reset invalid billing model 
    this.resetBilling();
    // this.proposalDataService.proposalDataObject.proposalData.eaStartDate.setDate(this.expectedEAStartDate);   
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.expectedEAStartDate = new Date();
    this.expectedEADefaultStartDate = new Date();
    this.todaysDate.setDate(this.todaysDate.getDate());
    this.expectedEADefaultStartDate = new Date(this.resetExpectedDefaultStartDate); // reset default date
    this.expectedEAStartDate = new Date(this.resetExpectedStartDate);

    if (this.proposalArchitectureService.createPageResetEmitter) {
      //To reset questionnaire
      this.proposalArchitectureService.createPageResetEmitter.emit();
    }

  }

  // method to create a proposal
  create() {
    if (!this.myForm.get('proposalName').value.trim()) {
      this.proposalName.setValue("");
      //return;
    }
    let x = this.myForm.get('eaStartDate').value;
    let a = (x.toString().substring(4, 7));
    this.utilitiesService.changeMessage(false);
    let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);

    this.countryOfTransaction.setValue(this.myForm.get('countryOfTransaction').value);
    //console.log(this.myForm.get('countryOfTransaction').value); 
    this.proposalDataService.proposalDataObject.proposalData.name = this.myForm.get('proposalName').value;
    this.proposalDataService.proposalDataObject.proposalData.desc = this.myForm.get('description').value;
    this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = this.myForm.get('eaTerm').value;
    this.proposalDataService.proposalDataObject.proposalData.billingModel = this.selectedBillingModel;
    if (this.partnerLedFlow) {
      this.selectedPriceListName = this.priceListArray[0].name;
    }
    this.showMspError = true;
    this.proposalDataService.proposalDataObject.proposalData.priceList = this.selectedPriceListName;
    this.proposalDataService.proposalDataObject.proposalData.eaStartDate = this.myForm.get('eaStartDate').value;
    this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction = this.selectedCountryCode;
    this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr = date_ea;
    this.constantsService.CURRENCY = this.proposalDataService.proposalDataObject.proposalData.currencyCode;
    if (this.proposalDataService.proposalDataObject.proposalId === null) {
      this.json = {
        "data": {
          //"userId": this.appDataService.userId,
          "qualId": this.qualService.qualification.qualID,
          "name": this.myForm.get('proposalName').value,
          "desc": this.myForm.get('description').value,
          "countryOfTransaction": this.selectedCountryCode,
          "primaryPartnerName": "",
          "eaStartDateStr": date_ea,
          "eaTermInMonths": this.myForm.get('eaTerm').value,
          "billingModel": this.selectedBillingModel,
          "priceList": this.selectedPriceListName,
          //"partnerContacts": [],
          "partner": this.selectedPartner,
          "currencyCode": this.proposalDataService.proposalDataObject.proposalData.currencyCode,
          "priceListId": this.proposalDataService.proposalDataObject.proposalData.priceListId,
          "referenceSubscriptionId": this.referenceSubscriptionId,
          "eaEndDateStr": this.eaEndDateInString
        }
      }
    }

    try {
      // commented out for annual billing 
      // this.isBillingAnnual = (this.proposalDataService.proposalDataObject.proposalData.billingModel === ConstantsService.ANNUAL_BILLING)? true:false;
      // if(this.isBillingAnnual){
      //   this.roundSliderValueToYear(this.myForm.get('eaTerm').value);
      // }
      const p_name = this.myForm.get('proposalName').value;
      const b_model = this.selectedBillingModel;
      const p_list = this.selectedPriceListName;
      const partner_name = !this.pratners.length?'NOT_REQUIRED':this.selectedPrimaryPartnerName;
      const c_transaction = this.selectedCountryCode;
      this.proposalArchitectureService.showError = true;
      this.proposalArchitectureService.isAllMandatoryAnswered = true;
      let IsAllAnswered = this.proposalArchitectureService.checkIsAllMandatoryQuestionnaireAreAnsweredForCreate();
      let noDurationError = true;
      if(this.eaTerm.value > 60 && this.archName === 'SEC') {
        noDurationError = false;
      }
      // if any of the mandatory questionnarie are not answered, scroll down to bottom of the component
      if (!IsAllAnswered) {
        window.scrollTo(0, document.body.scrollHeight);
      }
      if (this.showEndDate && !this.referenceSubscriptionId) {
        this.displayEndDateErrorMsg = true;
      } else {
        this.displayEndDateErrorMsg = false;
        if(this.durationInMonths < 12){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
        // x.setDate(x.getDate() + 365);
        // if (this.showEndDate && this.eaEndDate <= x) {
        //   this.displayDurationMsg = true;
        // } else {
        //   this.displayDurationMsg = false;
        // }
      }

      if (p_name && b_model && p_list && partner_name && c_transaction && noDurationError && IsAllAnswered && !this.proposalDataService.invalidBillingModel && !this.displayEndDateErrorMsg && !this.displayDurationMsg) {

        this.proposalArchitectureService._finalQuestionnaireRequest = {};
        this.proposalArchitectureService.setFinalQuestionnaireRequest();

        this.json.data.questionnaire = this.proposalArchitectureService._finalQuestionnaireRequest;
        this.json.data.questionnaireUpdate = true;


        //Only if partner is MSP and Cisco DNA selected		
        if (this.createProposalService.mspPartner) {
          this.json.data.mspPartner = this.createProposalService.isMSPSelected;
        }

        // set demoProposal if user has permissiona and checked
        if(this.demoProposal && this.demoProposalPermission){
          this.json.data['demoProposal'] = true;
        }
        
        this.createProposalService.createProposal(this.json).subscribe((res: any) => {
          if (res && !res.error && res.data) {
            if (res.data.cxEligible) {
              this.proposalDataService.cxEligible = res.data.cxEligible;
            } else {
              this.proposalDataService.cxEligible  = false;
            }
            this.createProposalService.checkCxReasonCode(res.data.cxNotAllowedReasonCode)

            // if proposal data has permissions and not empty assign to the value else set to empty array
            if (res.data.permissions && res.data.permissions.featureAccess && res.data.permissions.featureAccess.length > 0) {
              this.permissionService.proposalPermissions = new Map(res.data.permissions.featureAccess.map(i => [i.name, i]));
            } else {
              this.permissionService.proposalPermissions.clear();
            }
            //Set local permission for debugger
            this.permissionService.isProposalPermissionPage(true);

            // console.log(this.permissionService.proposalPermissions, this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit), this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen));
            //this.permissionService.proposalReOpen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
            this.permissionService.proposalEdit = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalEdit);
            this.appDataService.userInfo.purchaseAdjustmentUser = this.permissionService.proposalPermissions.has(PermissionEnum.PurchaseAdjustmentPermit);

            this.listProposalService.navigateToSummary = false;
            //this.proposalDataService.proposalData.proposalId = res.data.id;
            this.proposalDataService.crateProposalFlow = true;
            this.proposalDataService.proposalDataObject.proposalId = res.data.id;
            this.proposalDataService.proposalDataObject.proposalData = res.data;
            if (!this.permissionService.proposalEdit) {
              this.qualService.qualification.userEditAccess = false;
              this.proposalDataService.proposalDataObject.userEditAccess = false;
              this.appDataService.isReadWriteAccess = false;
            } else {
              this.appDataService.isReadWriteAccess = true;
              this.proposalDataService.proposalDataObject.userEditAccess = true;
            }
            this.appDataService.archName = res.data.archName;
            if (res.data.partnerDeal) {
              this.createProposalService.isPartnerDeal = res.data.partnerDeal;
            } else {
              this.createProposalService.isPartnerDeal = false;
            }
            
            // check and set partnerBeGeoId to filter partner in manage teams
            this.proposalDataService.checkAndSetPartnerId(res.data.partner);

            this.appDataService.roadMapPath = false;
            this.appDataService.isProposalPending = false;
            this.appDataService.isPendingAdjustmentStatus = false;
            //this.appDataService.isReadWriteAccess = true;
            const sessionObject: SessionData = this.appDataService.getSessionObject();
            this.createProposalService.proposalCreated = true;
            sessionObject.isUserReadWriteAccess = this.appDataService.isReadWriteAccess;
            sessionObject.createAccess = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalDelete) || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalCreate) ? true : false;
            this.appDataService.setSessionObject(sessionObject);
            this.proposalDataService.updateSessionProposal();
            this.eaService.updateUserEvent(res.data, this.constantsService.PROPOSAL_FS, this.constantsService.ACTION_UPSERT);
            this.router.navigate(['../' + this.proposalDataService.proposalDataObject.proposalId], { relativeTo: this.route });
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
      else {
        if (!p_name) {
          this.proposalName.markAsDirty();
          //this.errorMessageProposalName = "Please enter a valid Proposal name."
        }
        //if (!b_model) {
        //this.billingModel.markAsDirty();
        //this.errorMessageBillingModel = "Please select a billing model."
        //}
        if (!p_list) {
          this.errorMessagePriceList = this.localeService.getLocalizedMessage('proposal.create.pricelisterror');
          this.errorPriceList = true;
        }

        if (!partner_name) {
          this.errorMessagePartnerName = this.localeService.getLocalizedMessage('proposal.create.partner_name_error');
        }
        //if (!c_transaction) {
        //this.countryOfTransaction.markAsDirty();
        //this.errorMessageCountry = "Please select a country."
        //}
        if(!noDurationError) {
          this.errorMessageDuration = this.localeService.getLocalizedMessage('proposal.create.duration');
          this.errorDuration = true;
        }
      }
    }
    catch (error) {
      //console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  addContacts() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = '';
    // tslint:disable-next-line:max-line-length
    const modalRef = this.modalVar.open(AddPartnerContactComponent, { windowClass: 'addPartnerContact' });
    modalRef.result.then((result) => {
      this.createProposalTable = result.setData;
    });
    // let partners = this.partnerList.value;
    // partners = partners.concat(this.selectedPartners);
    // this.partnerList.setValue(partners);
    // this.selectedPartners = [];
  }


  deleteUser(partner: IPartner) {
    const partners = this.partnerList.value;
    const index = _.findIndex(partners, (element: IPartner) => partner.cecId === element.cecId);
    if (index >= 0) {
      partners.splice(index, 1);
    }
    this.partnerList.setValue(partners);
  }

  deleteSelectedPatner(partner: IPartner) {
    const index = _.findIndex(this.selectedPartners, (element: IPartner) => partner.cecId === element.cecId);
    if (index >= 0) {
      this.selectedPartners.splice(index, 1);
    }
  }

  clearAllSelectedPartner() {
    this.selectedPartners = [];
  }


  getUsers(): Array<IPartner> {
    return [
      {
        name: 'Test 1',
        email: 'test1@test1.com',
        cecId: '1'
      },
      {
        name: 'Test 2',
        email: 'test2@test2.com',
        cecId: '2'
      },
      {
        name: 'Test 3',
        email: 'test3@test3.com',
        cecId: '3'
      },
      {
        name: 'Test 4',
        email: 'test4@test4.com',
        cecId: '4'
      },
      {
        name: 'Test 5',
        email: 'test5@test5.com',
        cecId: '5'
      },
      {
        name: 'Test 6',
        email: 'test6@test6.com',
        cecId: '6'
      }
    ]
  }


  /// for typoo ----
  getUserAsObservable(token: string): Observable<any> {
    let query = new RegExp(token, 'ig');
    return observableOf(
      this.allUsers.filter((user: IPartner) => {
        return (query.test(user.name) || query.test(user.cecId) || query.test(user.email)) && _.findIndex(this.selectedPartners, (elem: IPartner) => elem.cecId === user.cecId) <= -1 && _.findIndex(this.partnerList.value, (element: IPartner) => user.cecId === element.cecId) <= -1;
      })
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
    this.selectedPartners.push(e.item);
    this.asyncSelected = '';
  }

  addPatner(value: IPartner) {
  }

  addPartner(val) {
    this.selectedPartnerName = val.name;
    this.selectedPartner.name = val.name;
    this.selectedPartner.partnerId = val.partnerId;
    this.errorMessagePartnerName = '';
    this.showCiscoEaAuth = true;
    this.selectedPrimaryPartnerName = val.name;
    if(val?.partnerIdSystem && val?.dealIdSystem){
      this.selectedPartner.dealIdSystem = val.dealIdSystem;
      this.selectedPartner.partnerIdSystem = val.partnerIdSystem;
    }
    this.proposalSummaryService.getPurchaseOptionsDataForSelectedPartner(val.partnerId);

    this.checkIfMSPPartner(true);		
    setTimeout(() => {
      this.myDropsearch.close();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.appDataService.showActivityLogIcon(false);
    // unsubscribe changeSubPermissionEmitter
    if(this.subscribers.changeSubPermissionEmitter){
      this.subscribers.changeSubPermissionEmitter.unsubscribe();
    }
  }

  getPriceList() {
    //console.log(this.qualService.qualification.qualID)
    this.priceListArray = [];
    this.createProposalService.getPriceList(this.qualService.qualification.qualID).subscribe(
      (response: any) => {
        let flag = false;
        if (response && !response.error) {
          try {
            this.priceListArray = response.data;
            if (this.priceListArray.length === 1) {
              this.selectedPriceList = this.priceListArray[0].description;
              this.selectedPriceListName = this.priceListArray[0].name;
              this.proposalDataService.proposalDataObject.proposalData.currencyCode = this.priceListArray[0].currencyCode;
              this.proposalDataService.proposalDataObject.proposalData.priceList = this.priceListArray[0].name;
              this.proposalDataService.proposalDataObject.proposalData.priceListId = this.priceListArray[0].priceListId;
              this.proposalDataService.proposalDataObject.proposalData.defaultPriceList = this.priceListArray[0].name;
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        }
        else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }


  getEaStartDate() {
    this.priceListArray = [];
    this.createProposalService.getEaStartDate().subscribe(
      (response: any) => {
        if (response && !response.error && response.data) {
          try {
            this.expectedEAStartDate = new Date(response.data);
            this.resetExpectedStartDate = new Date(response.data);
            this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEAStartDate);
          } catch (error) {
            this.expectedEAStartDate = new Date();
            this.resetExpectedStartDate = new Date();
            this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEAStartDate);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  // method to get EaMaxStartDate and default max start date
  getEaMaxStartDate() {
    this.createProposalService.maxAndDefaultStartDate().subscribe((res: any) => {
      if (res && !res.error && res.data) {
        //console.log(res.data);
        try {
          this.expectedEAStartDate = new Date(res.data[0]); // max start date -- 270 days
          this.resetExpectedStartDate = new Date(res.data[0]); // max start date -- 270 days
          this.expectedEADefaultStartDate = new Date(res.data[1]); // default start date --- 180 days
          this.resetExpectedDefaultStartDate = new Date(res.data[1]); // default start date --- 180 days
          this.myForm.value.eaStartDate = this.expectedEADefaultStartDate; // make eaStartDate to default start date
          this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEADefaultStartDate); // make eaStartDate to default start date
        } catch (error) {
          this.expectedEAStartDate = new Date();
          this.expectedEADefaultStartDate = new Date();
          this.resetExpectedDefaultStartDate = new Date();
          this.resetExpectedStartDate = new Date();
          this.proposalDataService.proposalDataObject.proposalData.eaStartDate = (this.expectedEADefaultStartDate);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


    billingOpen() {		
    if (this.createProposalService.mspPartner && this.createProposalService.selectedArchitecture === this.constantsService.DNA && this.createProposalService.isMSPSelected) {		
        this.billingModels = this.proposalDataService.billingModelMetaData.billingModellov;		
     		
    }else {		
         const arrWithoutQuarterly = this.billingModels.filter(item => item.identifier !== ConstantsService.QUARTERLY);		
         const arrWithoutMonthly = arrWithoutQuarterly.filter(item => item.identifier !== ConstantsService.MONTHLY);		
         this.billingModels =  arrWithoutMonthly;		
    }		
  }	

  getBillingModelDetails() {
    this.createProposalService.getBillingModelDetails().subscribe(
      (response: any) => {
        if (response && !response.error && response.data) {
          try {
            this.billingModels = response.data.billingModellov;


            this.proposalDataService.billingModelMetaData = response.data;
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      }
    )
  }

  getCountryOfTransactions() {
    this.countryOfTransactions = [];
    this.createProposalService.getCountryOfTransactions(this.qualService.qualification.qualID).subscribe(
      (response: any) => {
        if (response && !response.error) {
          try {
            this.countryOfTransactions = response.countries;

           for(let i = 0;i<this.countryOfTransactions.length; i++){
           
            if(this.countryOfTransactions[i].isoCountryAlpha2 === response.defaultCountry)
            {
             this.selectedCountryTranscation = this.countryOfTransactions[i].countryName;
             this.defaultCountryName = this.countryOfTransactions[i].countryName ;
             this.selectedCountryCode = this.countryOfTransactions[i].isoCountryAlpha2;
             this.defaultCountryCode = this.countryOfTransactions[i].isoCountryAlpha2
             break;
            }
            
           }
             
            let flag = false;
            this.proposalDataService.proposalDataObject.proposalData.defaultPriceList = '';
            this.proposalDataService.proposalDataObject.proposalData.partner = { 'name': "", "partnerId": 0 };
            if (!this.partnerLedFlow) {
              this.priceListArray.forEach(element => {
                // console.log(element);
                if (element.defaultPriceList === true) {
                  this.proposalDataService.proposalDataObject.proposalData.currencyCode = element.currencyCode;
                  this.proposalDataService.proposalDataObject.proposalData.priceList = element.name;
                  this.proposalDataService.proposalDataObject.proposalData.priceListId = element.priceListId;
                  this.proposalDataService.proposalDataObject.proposalData.defaultPriceList = element.name;
                  //flag = true;
                }
              });
            }
            //  else {
            //   this.proposalDataService.proposalDataObject.proposalData.currencyCode = this.priceListArray[0].currencyCode;
            //   this.proposalDataService.proposalDataObject.proposalData.priceList = this.priceListArray[0].name;
            //   this.proposalDataService.proposalDataObject.proposalData.priceListId = this.priceListArray[0].priceListId;
            //   this.proposalDataService.proposalDataObject.proposalData.defaultPriceList = this.priceListArray[0].name;
            // }

            // if (!flag) {

            //   this.proposalDataService.proposalDataObject.proposalData.currencyCode = this.priceListArray[0].currencyCode;
            //   this.proposalDataService.proposalDataObject.proposalData.priceList = this.priceListArray[0].name;
            //   this.proposalDataService.proposalDataObject.proposalData.priceListId = this.priceListArray[0].priceListId;
            //   this.proposalDataService.proposalDataObject.proposalData.defaultPriceList = this.priceListArray[0].name;
            // }
          } catch (error) {
            console.error(error);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  /* --To enable select partner button when user selects World Wide Technology else disable btn-- */
  onChangeSelectPartner($event) {
    if ($event.target.value == 'World Wide Technology') {
      this.selectPartnerDisabled = false;
    } else if ($event.target.value == 'None') {
      this.selectPartnerDisabled = true;
    }
  }

  keyUp($event) {
    if ($event.keyCode === 13) {
      this.myDropCountrysearch.close();
      $event.stopPropagation();
    }
  }

  keyDown($event) {
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode == 8)) {
      event.preventDefault();
    }
    this.allowDebounce = true;
    this.eaTerm.valueChanges.pipe(debounceTime(1500)).subscribe((res) => {
      if(this.allowDebounce){//this is to stop the call, else it will be triggered after every 1.5 second;
        if (res < 12) {
          res = 12;
        }
        else if (res > 84) {
          res = 84;
        }
        this.changeValueForSlider(this.sliderElement, res);
        this.allowDebounce = false;
      }
      
      // commented out for stopping annual billing functionality
      // if(this.isBillingAnnual){
      //   let num = res;
      //   if (num > 12 && num <= 60) {
      //     num = Math.round(num / 12);
      //     num = num * 12;
      //   }
      //   this.changeValueForSlider(this.sliderElement, num);
      // }
      // else{
      //   this.changeValueForSlider(this.sliderElement, res);
      // }
    });

    this.errorDuration = false;
    this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(Number(this.eaTerm.value));
    this.displayCustomDurationWarningForDC = this.check84MonthsDurationForDC(this.eaTerm.value);
    // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(Number(this.eaTerm.value));
  }

  focusProposalInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  lookupSubscriptionModal() {
    const modalRef = this.modalVar.open(LookupSubscriptionComponent, { windowClass: 'lookup-subscription' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.selectSubscription(result.dataObj);
      }
    });
  }

  setChangeSubFlow(){
    if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
      this.isShowCoTerm = true;
      this.showEndDate = true;
      this.isChangeSubFlow = true;
      if(this.qualService.qualification.subscription['billingModel']){
        this.selectedBillingModel = this.billingDisplayname = this.qualService.qualification.subscription['billingModel'];
      }
      this.selectSubscription({'endDate': this.qualService.qualification.subscription['endDate'], 'subscriptionId': this.qualService.qualification.subscription['subRefId']});
    } else {
      this.checkCotermAllowedOrNot();// check coterm allowed or not and show
    }
  }

  // reset() {
  //   this.createProposalService.callCreateOrResetProposalParamsEmitter.emit({'reset': true});
  // }
    
  // create() {
  //   this.createProposalService.callCreateOrResetProposalParamsEmitter.emit({'create': true});
  // }

  /* -- codes end -- */
}

