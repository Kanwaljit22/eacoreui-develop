
import {debounceTime} from 'rxjs/operators';
import { ProposalArchitectureService } from './../../shared/proposal-architecture/proposal-architecture.service';
import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable ,  Subscription } from 'rxjs';

import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ProposalDataService, PartnerInfo } from '@app/proposal/proposal.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { PriceEstimationService, RecalculateAllEmitterObj } from '../../proposal/edit-proposal/price-estimation/price-estimation.service';
import { ConstantsService } from '../../shared/services/constants.service';
import { LocaleService } from "@app/shared/services/locale.service";
import { ManageSuitesService } from '@app/proposal/edit-proposal/manage-suites/manage-suites.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { IonRangeSliderComponent, IonRangeSliderCallback } from '@app/shared/ion-range-slider/ion-range-slider.component';
import { MessageType } from '@app/shared/services/message';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { DatePipe } from '@angular/common';
import { EaService } from 'ea/ea.service';

const DURATION_TYPES = {
  MONTHS36: 'MONTHS36',
  MONTHS60: 'MONTHS60',
  MONTHSCUSTOM: 'MONTHSCUSTOM',
  MONTHSCOTERM: 'MONTHSCOTERM'
};

@Component({
  selector: 'app-edit-proposal-header',
  templateUrl: './edit-proposal-header.component.html',
  styleUrls: ['./edit-proposal-header.component.scss']
})
export class EditProposalHeaderComponent implements AfterViewInit {
  isBillingAnnual: boolean;
  myForm: FormGroup;
  @ViewChild('sliderElement', { static: true }) sliderElement: IonRangeSliderComponent;
  @ViewChild('myDropBillingsearch', { static: false }) myDropBillingsearch;
  @ViewChild('myDropCountrysearch', { static: false }) myDropCountrysearch;
  @ViewChild('myDropPricesearch', { static: false }) myDropPricesearch;
  @ViewChild('myDropsearch', { static: false }) myDropsearch;
  simpleSlider: any;
  eaTerm: FormControl;
  proposalName: FormControl;
  eaStartDate: FormControl;
  billingModel: FormControl;
  description: FormControl;
  priceList: FormControl;
  countryOfTransaction: FormControl;
  durationTypes: any;
  showEndDate = false;
  displayEndDateErrorMsg = false;
  partnerInfo = false;
  changeVal = true;
  billingModels: Array<any>;
  isPartnerDataLoaded = false;
  // billingModels = [{
  //   "id": 1,
  //   "val": ConstantsService.PREPAID_TERM
  // },
  // {
  //   "id": 2,
  //   "val": ConstantsService.ANNUAL_BILLING
  // }];
  addcontact: FormControl;
  primaryName: FormControl;
  priceListArray: any;
  countryOfTransactions: Array<any>;
  json: any;
  oldValues: ProposalHeaderObj;
  updatedValues: ProposalHeaderObj;
  disableUpdate = true;
  todaysDate: Date;
  referenceSubscriptionId = '';
  eaEndDateStr = ''
  eaEndDateInString = '';
  eaEndDate: Date;
  displayDurationMsg = false;
  expectedEAStartDate: Date;
  pratners = [];
  selectedPartner: PartnerInfo = { 'name': "", 'partnerId': 0 };
  readonly MONTH = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  enableRecalculate: boolean = true;
  displayCustomDurationWarning = false;
  // displayCustomDNADurationWarning = false;
  proposalStatus: string;
  selectedPriceList: string;
  selectedCountryTranscation: string;
  selectedBillingModel: string;
  selectedPartnerName: string;
  errorDateSelectionMessage: any;
  errorDateSelection = false;
  initialProposalName: string;
  initialProposalDescription: string;
  priceListId: any;
  currencyCode: any;
  architectureInfo = false;
  showProposalParameter = true;
  architectureShow = false;
  isToShowMinimumTwoSuitesError = false;
  minimumSuitesMeassagaeStr = '';
  subscription: Subscription;
  showBillingError = false;
  type: string;
  partnerLedFlow = false;
  public readOnlyMode: boolean = false;
  billingModelInfo = false;
  archName : string;
  approvalWarning = false;
  isSubscriptionListLoaded = false;
  showMSPBillingError = false;
  selectedMSPAnswer = false;
  isPurchaseAdjustmentChanged = false;
  showPurchaseAdjustmentWarning = false;
  coTermDuration = -1;
  isSubscriptionUpdated = false;
  subscriptionList = [];
  isShowCoTerm = false;
  demoProposalPermission:any;
  demoProposal = false;
  isChangeSubFlow = false;
  showPriceListError = false;
  allowDebounce = false;
  public isOnTimeRenewal: boolean = false;
  updated = false;
  errorDuration = false; // set if duration > 60 months for other than DNA arch
  errorMessageDuration: any; // set message if duration > 60 months for other than DNA arch
  linkedSubIds = []; // set subIds from the linkedRewnewalSubscriptions
  subscriptionIdList = []; // set sibscription id's from existed subscriptions List
  isUserClickedRsd = false; // set when user clicks on RSD box
  eaRsd: Date; // set the selected RSD 
  isRsdChangedByUser = false; // set when user changes the RSD
  datesDisabled = []; // to set dates to be disabled on calendar
  
  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public createProposalService: CreateProposalService, public priceEstimationService: PriceEstimationService, public permissionService: PermissionService,
    public proposalDataService: ProposalDataService, private utiliteService: UtilitiesService, public messageService: MessageService, public qualService: QualificationsService, public manageSuitesService: ManageSuitesService,private datepipe : DatePipe,
    public appDataService: AppDataService, private router: Router, private route: ActivatedRoute, public constantsService: ConstantsService, public renderer: Renderer2, public proposalArchitectureService: ProposalArchitectureService,public proposalSummaryService: ProposalSummaryService, private eaService: EaService) {
    this.eaTerm = new FormControl(36, [Validators.required]);
    this.durationTypes = DURATION_TYPES;
    // tslint:disable-next-line:max-line-length
    let dateFormate = this.formateDate(proposalDataService.proposalDataObject.proposalData.eaStartDateStr);


    if (!proposalDataService.proposalDataObject.proposalData.partner) {
      proposalDataService.proposalDataObject.proposalData.partner = { 'name': "", 'partnerId': 0 };
    }
    this.initialProposalName = proposalDataService.proposalDataObject.proposalData.name;
    this.proposalName = new FormControl(proposalDataService.proposalDataObject.proposalData.name, [Validators.required]);
    if (proposalDataService.proposalDataObject.proposalData.desc) {
      this.initialProposalDescription = proposalDataService.proposalDataObject.proposalData.desc;
    } else {
      this.initialProposalDescription = '';
    }
    this.eaStartDate = new FormControl(new Date(dateFormate), [Validators.required]);
    this.eaRsd = new Date(dateFormate)
    this.eaTerm = new FormControl(proposalDataService.proposalDataObject.proposalData.eaTermInMonths);
    this.billingModel = new FormControl(proposalDataService.proposalDataObject.proposalData.billingModel, [Validators.required]);
    this.primaryName = new FormControl(proposalDataService.proposalDataObject.proposalData.partner.partnerId, [Validators.required]);
    this.priceList = new FormControl(proposalDataService.proposalDataObject.proposalData.priceList, [Validators.required]);
    this.description = new FormControl(proposalDataService.proposalDataObject.proposalData.desc);
    this.countryOfTransaction = new FormControl(proposalDataService.proposalDataObject.proposalData.countryOfTransaction, [Validators.required]);
    this.addcontact = new FormControl('');
    this.demoProposalPermission = this.permissionService.permissions.get(PermissionEnum.DEMO_PROPOSAL);   
    if(proposalDataService.proposalDataObject.proposalData.coTerm && proposalDataService.proposalDataObject.proposalData.coTerm.coTerm){
      this.coTermDuration = proposalDataService.proposalDataObject.proposalData.eaTermInMonths;
      this.referenceSubscriptionId = proposalDataService.proposalDataObject.proposalData.coTerm.subscriptionId;
      this.eaEndDateInString = proposalDataService.proposalDataObject.proposalData.coTerm.eaEndDate;
      this.eaEndDate = new Date(this.formateDate(this.eaEndDateInString));
      this.eaEndDateStr = this.datepipe.transform(this.eaEndDate, 'dd-MMM-YYYY'); // to show on UI
      this.showEndDate = true;
      this.getSubscriptionsList();
    }
    this.selectedPartner.partnerId = proposalDataService.proposalDataObject.proposalData.partner.partnerId;
    this.selectedPartner.name = proposalDataService.proposalDataObject.proposalData.partner.partnerId <= 0 ? this.localeService.getLocalizedString('proposal.create.PRIMARY_PARTNER_DEFAULT') : proposalDataService.proposalDataObject.proposalData.partner.name;
	
    //this.selectedPriceList = proposalDataService.proposalDataObject.proposalData.priceList;
    //this.selectedCountryTranscation = proposalDataService.proposalDataObject.proposalData.countryOfTransaction;
    this.selectedBillingModel = proposalDataService.proposalDataObject.proposalData.billingModel;
    if(this.selectedBillingModel === 'Annual Billing') {
      this.billingModelInfo = true;
    }
    
    this.archName = proposalDataService.proposalDataObject.proposalData.architecture;
   
    if(this.archName === 'Cisco DNA' &&  this.selectedBillingModel === 'Annual Billing') {
      this.approvalWarning = true;
    }
    this.selectedPartnerName = this.selectedPartner.name;
    this.currencyCode = proposalDataService.proposalDataObject.proposalData.currencyCode;
    this.priceListId = proposalDataService.proposalDataObject.proposalData.priceListId;

    //If description is null or undefined then change it to "" in oldValues object
    this.oldValues = {
      proposalName: proposalDataService.proposalDataObject.proposalData.name.trim(),
      eaStartDate: new Date(dateFormate),
      eaTerm: proposalDataService.proposalDataObject.proposalData.eaTermInMonths,
      billingModel: proposalDataService.proposalDataObject.proposalData.billingModel,
      priceList: proposalDataService.proposalDataObject.proposalData.priceList,
      description: (proposalDataService.proposalDataObject.proposalData.desc === undefined) ? "" : proposalDataService.proposalDataObject.proposalData.desc,
      countryOfTransaction: proposalDataService.proposalDataObject.proposalData.countryOfTransaction,
      primaryPartnerId: proposalDataService.proposalDataObject.proposalData.partner.partnerId,
      subscriptionId: this.referenceSubscriptionId,
      eaEndDate: this.eaEndDateStr,
      priceListId: proposalDataService.proposalDataObject.proposalData.priceListId
    }

    this.updatedValues = {
      proposalName: proposalDataService.proposalDataObject.proposalData.name.trim(),
      eaStartDate: new Date(dateFormate),
      eaTerm: proposalDataService.proposalDataObject.proposalData.eaTermInMonths,
      billingModel: proposalDataService.proposalDataObject.proposalData.billingModel,
      priceList: proposalDataService.proposalDataObject.proposalData.priceList,
      description: (proposalDataService.proposalDataObject.proposalData.desc === undefined) ? "" : proposalDataService.proposalDataObject.proposalData.desc,
      countryOfTransaction: proposalDataService.proposalDataObject.proposalData.countryOfTransaction,
      primaryPartnerId: proposalDataService.proposalDataObject.proposalData.partner.partnerId,
      subscriptionId: this.referenceSubscriptionId,
      eaEndDate: this.eaEndDateStr,
      priceListId: proposalDataService.proposalDataObject.proposalData.priceListId
    }

    this.proposalStatus = proposalDataService.proposalDataObject.proposalData.status;
    // commented out for stopping annual billing 
    // this.isBillingAnnual = (this.oldValues["billingModel"] === ConstantsService.ANNUAL_BILLING) ? true : false;


    this.myForm = new FormGroup({
      proposalName: this.proposalName,
      eaStartDate: new FormControl(new Date(dateFormate), [Validators.required]),
      eaTerm: this.eaTerm,
      billingModel: this.billingModel,
      priceList: this.priceList,
      description: this.description,
      addcontact: this.addcontact,
      primaryName: this.primaryName,
      countryOfTransaction: this.countryOfTransaction
    });

    this.simpleSlider = this.getSlider();
  }

  ngOnInit() {

    this.selectedMSPAnswer = this.createProposalService.isMSPSelected;

    this.type = "edit";
    this.partnerLedFlow = this.createProposalService.isPartnerDeal;

    //Check if purchase adjustment changed
    this.getPurchaseAdjustmentChangeStatus();

    //Get billing details
    this.getBillingModelDetails(); 
    
    // check for demoproposal permission and set the updated values and oldvalues to compare if changed
    if(this.demoProposalPermission){
      this.demoProposal = this.proposalDataService.proposalDataObject.proposalData.demoProposal;
      this.oldValues["demoProposal"] = this.proposalDataService.proposalDataObject.proposalData.demoProposal;
      this.updatedValues["demoProposal"] = this.demoProposal;
    }

    // check and set is ontime Renewal
    if(this.appDataService.isRenewal && (this.appDataService.followonType === ConstantsService.ON_TIME_FOLLOWON)){
      this.isOnTimeRenewal  = true;
    } else {
      this.isOnTimeRenewal = false;
    }


    this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = false;
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.expectedEAStartDate = new Date();
    this.todaysDate.setDate(this.todaysDate.getDate());

    //Get create proposal start date time limit 
    // this.appDataService.getProposalStartDateTimeLimit();

    if (this.appDataService.startDateTimeLimit > 0) {
      this.expectedEAStartDate.setDate(this.todaysDate.getDate() + this.appDataService.startDateTimeLimit);
    }
    this.subscription = this.appDataService.startDateTimeLimitEmitter.subscribe(() => {
      this.expectedEAStartDate.setDate(this.todaysDate.getDate() + this.appDataService.startDateTimeLimit);
    });
    this.getEaMaxStartDate(); // to set maxExpectedstartdate
    this.setReadOnlyMode();// check and set readonly mode
    this.getPriceList();
    this.getCountryOfTransactions();
    if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
      this.isShowCoTerm = true;
      this.showEndDate = true;
      this.isChangeSubFlow = true;
      this.selectSubscription({'endDate': this.qualService.qualification.subscription['endDate'], 'subscriptionId': this.qualService.qualification.subscription['subRefId']});
    } else {
      this.checkCotermAllowedOrNot();// check coterm allowed or not and show
    }
    this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(this.eaTerm.value);
    // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(this.eaTerm.value);
    // set the linkedSubids if renewal proposal and linkedrenewalsubs present
    if(this.proposalDataService.linkedRenewalSubscriptions && this.proposalDataService.linkedRenewalSubscriptions.length > 0){
      this.linkedSubIds = this.proposalDataService.linkedRenewalSubscriptions.map(data => data.subRefId);
    }
    if(this.eaService.features?.PARAMETER_ENCRYPTION){
      this.checkAndSetProposalPartner(); // to get selected partner details for proposal
    } else {
      this.checkIfMSPPartner(false);
    }
    this.proposalSummaryService.getPurchaseOptionsDataForSelectedPartner(this.selectedPartner.partnerId);		
  }

  // to get and set selected partner details for proposal
  checkAndSetProposalPartner(){
    this.createProposalService.getPartnerForProposal(this.proposalDataService.proposalDataObject.proposalId).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        if(Object.keys(response.data).length){
          this.selectedPartner = response.data[0];
          this.checkIfMSPPartner(false);
        }
      }
    })
  }

  selectedMSP (val:boolean) {

  this.selectedMSPAnswer = val;

  if (!this.selectedMSPAnswer) {
    this.resetNonMSPBillingModel();
  }
}

getPurchaseAdjustmentChangeStatus () {
  

    this.createProposalService.isPurchaseAdjustmentChanged(this.proposalDataService.proposalDataObject.proposalId).subscribe(
      (response: any) => {

        if (response.data) {
          this.isPurchaseAdjustmentChanged = true;

        }else {
          this.isPurchaseAdjustmentChanged = false;
        }
      });
}

 resetNonMSPBillingModel() {

  if (this.selectedBillingModel  === ConstantsService.QUARTERLY_VALUE || this.selectedBillingModel === ConstantsService.MONTHLY_VALUE || this.selectedBillingModel === '') {        

    this.showMSPBillingError = true;
    this.proposalDataService.invalidBillingModel = true;
    this.selectedBillingModel = 'Select';
   
    this.disableUpdate = true;
    this.proposalArchitectureService.isToEnableUpdateBtnForEditQuestionnaire = false;

    }
  }

  // method to get EaMaxStartDate and default max start date
  getEaMaxStartDate() {   
    this.datesDisabled = [];
    this.createProposalService.maxAndDefaultStartDate(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        try {
          this.expectedEAStartDate = new Date(res.data[0]); // max start date -- 270 days

          // check and set todays date to make it as min date for selection
          if (res.data[2] && (this.proposalDataService.relatedCxProposalId || this.proposalDataService.relatedSoftwareProposalId)){
            this.todaysDate = new Date(res.data[2]); // to set min date as the current + 45 days 
            this.todaysDate.setHours(0, 0, 0, 0);
          }
          // check if RSD is less than todaysDate, set datesDisabled from RSD date to todaysDate - 1
          if (this.eaRsd < this.todaysDate){
            // check and push dates from rsd to todaysDate - 1 for disabling in calendar
            for (let i = this.eaRsd; i < this.todaysDate; i = new Date(i.setDate(i.getDate() + 1))){
              this.datesDisabled.push(i.setHours(0, 0, 0, 0));
            }
            this.todaysDate = new Date(this.formateDate(this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr)); // set to selected date
          }
          this.eaRsd = new Date(this.formateDate(this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr));
        } catch (error) {
          this.expectedEAStartDate = new Date();
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
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
    this.isSubscriptionUpdated = true;
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
    this.isProposalUpdated();
  }

 // to formart date into 8 digit
 formartDateToStr(date){
  let a = (date.toString().substring(4, 7));
  let date_ea: string = date.toString().substring(11, 15) + this.MONTH[a] + date.toString().substring(8, 10);
  return date_ea;
}

// method to get duration in months if selected co-terms and subId
getDurationInMonths(rsd, endDate){
  //console.log(rsd, endDate);
  let durationInMonths: any = '';
  this.createProposalService.durationMonths(rsd, endDate).subscribe((res: any) => {
    if(res && !res.error){
      durationInMonths = this.utiliteService.checkDecimalOrIntegerValue(res.data);
      this.coTermDuration = durationInMonths;
      if(durationInMonths >= 12){
        this.eaTerm.setValue(this.coTermDuration);
         this.displayDurationMsg = false;
         if(durationInMonths > 60 && ((this.archName !== 'Cisco DNA' && !this.proposalDataService.relatedSoftwareProposalArchName) || (this.proposalDataService.relatedSoftwareProposalArchName && this.proposalDataService.relatedSoftwareProposalArchName !== this.constantsService.DNA))){ // check for other than DNA Arch and duration > 60 month then throw error message 
          this.errorMessageDuration = this.localeService.getLocalizedMessage('proposal.edit-proposal-header.duration');
          this.errorDuration = true;
         } else {
           this.errorDuration = false;
         }
      } else {
        this.displayDurationMsg = true;
        this.errorDuration = false;
      }
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  });
}

  // method to check and set readonly mode
  setReadOnlyMode() {
    // if not have edit accees disable update button 
    if (!this.permissionService.proposalEdit || this.appDataService.roadMapPath) {
      this.disableUpdate = true;
      this.readOnlyMode = true;
      // disable editable text
      this.proposalName.disable();
      this.description.disable();
      this.eaTerm.disable();
      this.eaStartDate.disable();
    }
  }
  updateStatus() {
    this.oldValues.description = "";
    this.oldValues.proposalName = "";
    this.updatedValues.proposalName = "";
    this.updatedValues.description = "";
    if ((JSON.stringify(this.oldValues) !== JSON.stringify(this.updatedValues))) {
      this.proposalStatus = this.constantsService.IN_PROGRESS_STATUS;
    }
  }

  updateProposal() {
    // if (this.proposalStatus === this.constantsService.COMPLETE_STATUS) {
    //   this.updateStatus();
    // }
    let x = this.eaRsd;
    let a = (x.toString().substring(4, 7));
    // this.utilitiesService.changeMessage(false);
    let date_ea: string = x.toString().substring(11, 15) + this.MONTH[a] + x.toString().substring(8, 10);
    this.json = {
      "data": {
        "id": this.proposalDataService.proposalDataObject.proposalId,
        //"userId": this.appDataService.userId,
        "qualId": this.qualService.qualification.qualID,
        "name": this.initialProposalName.trim(),
        "desc": this.initialProposalDescription,
        "countryOfTransaction": this.updatedValues.countryOfTransaction,
        "primaryPartnerName": "",
        "eaStartDateStr": date_ea,
        "eaTermInMonths": this.myForm.get('eaTerm').value,
        "billingModel": this.selectedBillingModel,
        "priceList": this.updatedValues.priceList,
        "partner": this.selectedPartner,
        "currencyCode": this.currencyCode,
        "priceListId": this.updatedValues.priceListId,
        "status": this.proposalStatus,
        "referenceSubscriptionId" : this.referenceSubscriptionId,
        "eaEndDateStr": this.eaEndDateInString,
        "demoProposal": this.demoProposal
      }
    }

    this.createProposalService.isMSPSelected = this.selectedMSPAnswer; 
     //Only if partner is MSP and Cisco DNA selected		
    if(this.createProposalService.mspPartner) {		
              this.json.data.mspPartner =  this.createProposalService.isMSPSelected;		
    }

    try {
      //      console.log(this.proposalDataService.proposalDataObject.proposalData);
      const p_name = this.initialProposalName;
      const b_model = this.selectedBillingModel;
      const p_list = this.updatedValues.priceList;
      const c_transaction = this.updatedValues.countryOfTransaction;

      this.proposalArchitectureService.showError = true;
      this.proposalArchitectureService.isAllMandatoryAnswered = true;
      let IsAllAnswered = true;
      //if (this.appDataService.subHeaderData.subHeaderVal[7] !== this.constantsService.DNA) {
      this.proposalArchitectureService.isAllMandatoryAnswered = true;
      IsAllAnswered = this.proposalArchitectureService.checkIsAllMandatoryQuestionnaireAreAnswered(this.proposalArchitectureService.questions);
      //}

      this.isToShowMinimumTwoSuitesError = false;
      this.minimumSuitesMeassagaeStr = '';
      if(this.showEndDate && !this.referenceSubscriptionId){
        this.displayEndDateErrorMsg = true;
      } else {
        this.displayEndDateErrorMsg = false;
        // x.setDate(x.getDate() + 365);
        // if(this.eaEndDate <= x){
          //this.displayDurationMsg = true;
        // } else {
        //   this.displayDurationMsg = false;
        // }  
      }
      this.displayDurationMsg = false;
      if (p_name && b_model && p_list && c_transaction && IsAllAnswered  && !this.displayEndDateErrorMsg && !this.displayDurationMsg) {

        // if (this.appDataService.subHeaderData.subHeaderVal[7] !== this.constantsService.DNA) {
        this.proposalArchitectureService._finalQuestionnaireRequest = {};
        this.proposalArchitectureService.getFinalSelectionOfEditQuestionnaire(this.proposalArchitectureService.questions);
        this.json.data.questionnaire = this.proposalArchitectureService._finalQuestionnaireRequest;
        this.json.data.questionnaireUpdate = true;

        //}


        this.createProposalService.createProposal(this.json).subscribe((res: any) => {
          if (res && !res.error && res.data) {

            // to check the mandatory suites count and assign to appdata service after the questionnaire update from edit modal
            if (res.data.noOfMandatorySuitesRequired !== undefined && res.data.noOfMandatorySuitesRequired > -1) {
              this.appDataService.noOfMandatorySuitesrequired = res.data.noOfMandatorySuitesRequired;
            }
            // to check exception suite count and emit the value
            if (res.data.noOfExceptionSuitesRequired) {
              this.appDataService.noOfExceptionSuitesRequired = res.data.noOfExceptionSuitesRequired;
            } else {
              this.appDataService.noOfExceptionSuitesRequired = 0;
            }
            this.proposalDataService.cxEligible = (res.data.cxEligible) ? true : false ;
          
            this.createProposalService.checkCxReasonCode(res.data.cxNotAllowedReasonCode);
            
            // emit the suites count
            this.manageSuitesService.noOfSuitesCount.emit({ "mandatory": this.appDataService.noOfMandatorySuitesrequired, "exception": this.appDataService.noOfExceptionSuitesRequired });
            this.constantsService.CURRENCY = this.currencyCode;

            let isStatusIncomplete = this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch;

            this.proposalDataService.proposalDataObject.proposalId = res.data.id;
            this.proposalDataService.proposalDataObject.proposalData = res.data;
            this.proposalDataService.proposalDataObject.existingEaDcSuiteCount = res.data.existingEaDcSuiteCount;
            this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch = isStatusIncomplete;
            //Incase status incosistence
            if (res.data.linkParamChanged) {
              this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch = true;
            } else {
              this.proposalDataService.proposalDataObject.proposalData.isStatusInconsistentCrossArch = false;
            }

            //to update cross-arch popup data in proposal header.
            if (this.appDataService.subHeaderData.subHeaderVal[8] && this.appDataService.subHeaderData.subHeaderVal[8].length > 0) {
              for (let i = 0; i < this.appDataService.subHeaderData.subHeaderVal[8].length; i++) {
                if (this.appDataService.subHeaderData.subHeaderVal[8][i].id === this.proposalDataService.proposalDataObject.proposalId) {
                  this.appDataService.subHeaderData.subHeaderVal[8][i].eaStartDate = res.data.eaStartDateDdMmmYyyyStr;
                  this.appDataService.subHeaderData.subHeaderVal[8][i].eaTermInMonths = res.data.eaTermInMonths;
                  this.appDataService.subHeaderData.subHeaderVal[8][i].priceList = res.data.priceList;
                  this.appDataService.subHeaderData.subHeaderVal[8][i].billingModel = res.data.billingModel;
                }
              }
            }

            // check and set partnerBeGeoId to filter partner in manage teams
            this.proposalDataService.checkAndSetPartnerId(res.data.partner);

            // this.myForm.value.eaStartDate = this.formateDate(date_ea);
            if ((this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalCXPriceEstimateStep) && this.enableRecalculate)  {
              const recalculateAllEmitterObj: RecalculateAllEmitterObj = {
                recalculateButtonEnable: true,
                recalculateAllApiCall: true
              };
              //this.appDataService.setActiveClassValue();
              this.appDataService.peRecalculateMsg.isConfigurationDone = true;
              this.priceEstimationService.isEmitterSubscribe = true;
              this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllEmitterObj);
              this.priceEstimationService.isContinue = true;
            } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep && this.enableRecalculate) {
              this.priceEstimationService.eaQtyList = [];
              this.priceEstimationService.recalculateAll(true).subscribe((res: any) => {
                if (res) {
                  if (res.messages && res.messages.length > 0) {
                    this.messageService.displayMessagesFromResponse(res);
                  }
                }
              });
            }
            this.updated = true;
            this.activeModal.close({
              updateData: res.data
            });
          } else {
            this.isToShowMinimumTwoSuitesError = false;
            this.minimumSuitesMeassagaeStr = '';
            let isToShowSuiteserror = false;
            if (res.messages) {
              for (let messageObject of res.messages) {
                if (messageObject.code === this.constantsService.DATA_CENTER_MINIMUM_SUIT_ERROR_CODE) {
                  //Handling minimum two suites error
                  this.isToShowMinimumTwoSuitesError = true;
                  this.minimumSuitesMeassagaeStr = messageObject.text;
                  isToShowSuiteserror = true;
                  break;
                }
              }
            }
            if (isToShowSuiteserror === false) {
              this.messageService.displayMessagesFromResponse(res);
            }
          }
        });
      }
    }
    catch (error) {
      //console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  getBillingModelDetails() {
    this.createProposalService.getBillingModelDetails(this.proposalDataService.proposalDataObject.proposalId).subscribe(
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

  ngAfterViewInit() {
    // setTimeout(() => {
    this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
    // }, 0);
  }
  resetSubData(){
    this.showEndDate = false;
    this.referenceSubscriptionId = '';
    this.eaEndDateStr = '';
    this.eaEndDateInString = '';
    this.displayDurationMsg = false;
    this.displayEndDateErrorMsg = false;
    // this.eaTerm.enable();
  }

  checkDurationsSelected(event) {
    switch (event.target.value) {
      case this.durationTypes.MONTHS36:
        this.eaTerm.setValue(36);
        this.resetSubData();
        break;
      case this.durationTypes.MONTHS60:
        this.eaTerm.setValue(60);
        this.resetSubData();
        break;
      case this.durationTypes.MONTHSCUSTOM:
        // this.eaTerm.setValue(12);
        if((this.proposalDataService.proposalDataObject.proposalData.coTerm && this.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm) || this.errorDuration){
          this.eaTerm.setValue(36);
        }
        this.resetSubData();
        break;
        case this.durationTypes.MONTHSCOTERM:
          //this.eaTerm.setValue(36);
          // this.customDate = false;
          this.showEndDate = true;
          // if(!this.isSubscriptionListLoaded){
          //   this.getSubscriptionsList();
          // }
          this.getSubscriptionsList();
          this.isProposalUpdated();
      default:
        // setTimeout(() => {
        this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
        // }, 0);
        break;
    }
    if(!this.showEndDate){
      this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
    }
    this.isProposalUpdated();
    if (event.target.value === this.durationTypes.MONTHSCUSTOM && this.eaTerm.value !== 36 && this.eaTerm.value !== 60) {
      this.displayCustomDurationWarning = true;
    } else {
      this.displayCustomDurationWarning = false;
    }
  }

  getSubscriptionsList(){
    if(this.isSubscriptionListLoaded){
      if(this.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm){
        this.eaTerm.setValue(this.coTermDuration);
        this.referenceSubscriptionId = this.proposalDataService.proposalDataObject.proposalData.coTerm.subscriptionId;
        this.eaEndDateInString = this.proposalDataService.proposalDataObject.proposalData.coTerm.eaEndDate;
        this.eaEndDate = new Date(this.formateDate(this.eaEndDateInString));
        this.eaEndDateStr = this.datepipe.transform(this.eaEndDate, 'dd-MMM-YYYY');
        this.showEndDate = true;
      }
    } else {
      this.createProposalService.getSubscriptionList().subscribe((res: any) => {
        this.isSubscriptionListLoaded = true;
        if (res && !res.error && res.data) {
          this.subscriptionList = res.data;
          //this.isSubscriptionListLoaded = true;
          this.subscriptionIdList = this.subscriptionList.map(a => a.subscriptionId); // set subscription Id's form list
         // check for renewal flow and linkedSubids present, filter the subscription list with selected subs from linkedSubids
          if(this.appDataService.isRenewal && this.linkedSubIds.length > 0){
            this.setSubscriptionListForRenewal(this.subscriptionList, this.linkedSubIds)
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    }
  }
  changeValueForSlider(element: IonRangeSliderComponent, value: number) {
    this.errorDuration = false;
    this.eaTerm.setValue(value);
    if(typeof element.update === 'function'){
      element.update({ from: value });
    }
    this.isProposalUpdated();
  }

  getSlider() {

    let max = 60;
    if(this.archName === 'Cisco DNA' ||  this.proposalDataService.allow84Term) {
      max = 84;
    }

    return {
      name: 'Simple Slider',
      min: 12,
      max: max,
      grid: true,
      grid_num: 4,
      step: 12,
      prefix: "Year: ",
      onStart: (event: IonRangeSliderCallback) => {
        // console.log(event)
      },
      onChange: (event: IonRangeSliderCallback) => {
        // console.log(event)
      },
      onUpdate: (event: IonRangeSliderCallback) => {
        this.simpleSlider.step = 1;
        // commented out for annual billing
        // if(this.isBillingAnnual){
        //   this.simpleSlider.step = 12;
        // }
        // else{
        //   this.simpleSlider.step = 1;
        // }
        this.errorDuration = false;
        this.eaTerm.setValue(event.from);
        this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(this.eaTerm.value);
        // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(this.eaTerm.value);
        this.isProposalUpdated();
      },
      onFinish: (event: IonRangeSliderCallback) => {
      }
    };
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

  proposalParameter() {
    this.showProposalParameter = true;
    this.partnerInfo = false;
    this.architectureInfo = false;
    //to set slider value as after view partner value slider is taking min value
    this.changeValueForSlider(this.sliderElement, this.eaTerm.value);
  }

  viewPartnerInfo() {
    this.showProposalParameter = false;
    this.partnerInfo = true;
    this.architectureInfo = false;
    this.pratners = [];
    // if(this.pratners.length === 0){
    this.createProposalService.partnerAPI(this.qualService.qualification.qualID).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        this.pratners = res.data;
        this.isPartnerDataLoaded = true;
      } else {
        this.isPartnerDataLoaded = true;
      }
    });
    //}
  }

  viewArchitecture() {
    this.architectureInfo = true;
    this.partnerInfo = false;
    this.showProposalParameter = false;
  }

  addPartner(val) {
    this.selectedPartnerName = val.name;
    this.selectedPartner.name = val.name;
    if(val?.partnerIdSystem && val?.dealIdSystem){
      this.selectedPartner.dealIdSystem = val.dealIdSystem;
      this.selectedPartner.partnerIdSystem = val.partnerIdSystem;
    }
    if (!isNaN(val.partnerId)) {
      this.selectedPartner.partnerId = Number(val.partnerId);
      if (!this.proposalDataService.cxProposalFlow){
        this.proposalSummaryService.getPurchaseOptionsDataForSelectedPartner(val.partnerId);
      }
    } else {
      return;
    }
    this.checkIfMSPPartner(true);		
    setTimeout(() => {
      this.myDropsearch.close();
    });
    this.isProposalUpdated();
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

         if(this.proposalDataService.relatedSoftwareProposalArchName) {
              this.createProposalService.mspPartner = res.data.eligibleArchs.includes(this.proposalDataService.relatedSoftwareProposalArchName);		
         }else {
              this.createProposalService.mspPartner = res.data.eligibleArchs.includes(this.proposalDataService.selectedArchForQna);		
         }
       }else {	
         this.createProposalService.eligibleArchs = [];		
         this.createProposalService.mspPartner = false;	
         if (isDifferentPartnerSelected) {	
           this.resetNonMSPBillingModel();	
         }	
       }		
     }		
    } 		
  );		
 }
  ngOnDestroy() {
    if(!this.updated) {
      let inPriceList = false;
      this.priceListArray.forEach(element => {
        if (element.name === this.oldValues.priceList) {
          inPriceList = true;
        }
      });
      if(!inPriceList && this.proposalDataService.proposalDataObject.proposalData.status !== this.constantsService.COMPLETE_STATUS) {
        this.priceEstimationService.showPriceListError = true;
      }
    }
    
    this.subscription.unsubscribe();
    this.proposalDataService.isAnnualBillingMsgRequired();
  }
  getPriceList() {
    this.priceListArray = [];
    this.createProposalService.getPriceList(this.qualService.qualification.qualID).subscribe(
      (response: any) => {
        if (response && !response.error) {
          try {
            this.priceListArray = response.data;
            if (this.partnerLedFlow) {
              this.selectedPriceList = this.priceListArray[0].description;
              this.updatedValues.priceList = this.priceListArray[0].name;
              this.currencyCode = this.priceListArray[0].currencyCode;
            } else {
              let inPriceList = false;
              const proposalPriceListId = +this.proposalDataService.proposalDataObject.proposalData.priceListId;
              this.priceListArray.forEach(element => {
                if (element.erpPriceListId === proposalPriceListId) {
                  inPriceList = true;
                  this.selectedPriceList = element.description;
                }
              });
              if(!inPriceList && this.proposalDataService.proposalDataObject.proposalData.status !== this.constantsService.COMPLETE_STATUS) {
                this.showPriceListError = true;
                this.selectedPriceList = this.localeService.getLocalizedString('proposal.create.SELECT_PRICE_LIST');
              }
              if(this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS && !this.selectedPriceList){
                this.selectedPriceList = this.proposalDataService.proposalDataObject.proposalData.priceList;
              }
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

  getCountryOfTransactions() {
    this.countryOfTransactions = [];
    this.createProposalService.getCountryOfTransactions(this.qualService.qualification.qualID).subscribe(
      (response: any) => {
        if (response && !response.error) {
          try {
            this.countryOfTransactions = response.countries;
            this.countryOfTransactions.forEach(element => {
              if (element.isoCountryAlpha2 === this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction) {
                this.selectedCountryTranscation = element.countryName;
              }
            });
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        }
        else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }
  //To check if values are updated or not
  //If description value is null or undefined then change it to ""
  isProposalUpdated() {
    // this.selectedCountryTranscation = val;
    if (!this.initialProposalName.trim() || !this.myForm.get('priceList').value) {
      // this.unableRecalculate = false;
      this.disableUpdate = true;
      return;
    }

    if (this.selectedPartner.partnerId === 0) {
      this.selectedPartner.name = this.proposalDataService.proposalDataObject.proposalData.partner.name;
      this.selectedPartner.partnerId = this.proposalDataService.proposalDataObject.proposalData.partner.partnerId;
    }

    //this condition should be removed when we start getting countryOfTransaction from api
    if (!this.selectedCountryTranscation) {
      this.disableUpdate = true;
      return;
    }

    if (this.showBillingError) {
      this.disableUpdate = true;
      return;
    }

    // check for demoproposal permission and set the updated values
    if(this.demoProposalPermission){
      this.updatedValues["demoProposal"] =  this.demoProposal;
    }
    this.updatedValues.proposalName = this.initialProposalName.trim();
    this.updatedValues.eaStartDate = this.myForm.value.eaStartDate;
    this.updatedValues.eaTerm = this.myForm.get('eaTerm').value;
    this.updatedValues.billingModel = this.selectedBillingModel;
    this.updatedValues.description = (this.initialProposalDescription === undefined || this.initialProposalDescription === null) ? "" : this.initialProposalDescription;
    this.updatedValues.primaryPartnerId = this.selectedPartner.partnerId;
    this.updatedValues.subscriptionId = this.referenceSubscriptionId;
    this.updatedValues.eaEndDate = this.eaEndDateStr;
    this.disableUpdate = (JSON.stringify(this.oldValues) === JSON.stringify(this.updatedValues)) ? true : false;
    this.enableRecalculate = (JSON.stringify(this.oldValues["proposalName"]) === JSON.stringify(this.updatedValues["proposalName"])
      && JSON.stringify(this.oldValues["description"]) === JSON.stringify(this.updatedValues["description"])
      && JSON.stringify(this.oldValues["primaryPartnerId"]) === JSON.stringify(this.updatedValues["primaryPartnerId"])
    ) ? true : false;

    this.enableRecalculate = (JSON.stringify(this.oldValues["eaStartDate"]) === JSON.stringify(this.updatedValues["eaStartDate"])
      && JSON.stringify(this.oldValues["eaTerm"]) === JSON.stringify(this.updatedValues["eaTerm"])
      && JSON.stringify(this.oldValues["billingModel"]) === JSON.stringify(this.updatedValues["billingModel"])
      && JSON.stringify(this.oldValues["priceList"]) === JSON.stringify(this.updatedValues["priceList"])
      && JSON.stringify(this.oldValues["countryOfTransaction"]) === JSON.stringify(this.updatedValues["countryOfTransaction"])
      && JSON.stringify(this.oldValues["subscriptionId"]) === JSON.stringify(this.updatedValues["subscriptionId"])
    ) ? false : true;
    if(this.proposalDataService.relatedSoftwareProposalId && !this.enableRecalculate){
      // check changes made for RSD or Partner name and enable recalculate
      this.enableRecalculate = (JSON.stringify(this.oldValues["primaryPartnerId"]) === JSON.stringify(this.updatedValues["primaryPartnerId"]))? false : true
      }
    this.simpleSlider.step = 1;      
  //Show purchase adjustment warning if start date get changed
    this.showPurchaseAdjustmentWarning = false;
    var isDateUpdated =  (JSON.stringify(this.oldValues["eaStartDate"]) === JSON.stringify(this.updatedValues["eaStartDate"])) ? true : false;
    if (!isDateUpdated && this.isPurchaseAdjustmentChanged) {
      this.showPurchaseAdjustmentWarning = true;
    }
    // if not have edit acees disable update button 
    if (!this.permissionService.proposalEdit) {
      this.disableUpdate = true;
    } else if (this.appDataService.roadMapPath) {
      this.disableUpdate = this.appDataService.roadMapPath;
    }
    
  }

  roundSliderValueToYear(yearSelected) {
    let num = yearSelected;
    if (num > 12 && num <= 60) {
      num = Math.round(num / 12);
      num = num * 12;
    }
    this.eaTerm.setValue(num);
    if(typeof this.sliderElement.update === 'function'){
      this.sliderElement.update({ from: num });
    }
    
  }
  onPriceListChange(val) {
    this.showPriceListError = false;
    this.priceEstimationService.showPriceListError = false;
    this.selectedPriceList = val.description;
    this.updatedValues.priceList = val.name;
    this.updatedValues.priceListId = +val.priceListId;
    //this.proposalDataService.proposalDataObject.proposalData.currencyCode = val.currencyCode;
    setTimeout(() => {
      this.myDropPricesearch.close();
    });
    this.currencyCode = val.currencyCode;
    this.isProposalUpdated();
  }

  //change the date string in the required formate for showing date in header
  formateDate(dateStr: string) {
    let dateToFormat = dateStr;
    const year = dateToFormat.substring(0, 4);
    const month = dateToFormat.substring(4, 6);
    const day = dateToFormat.substring(6);
    //return this.createProposalService.MONTH[month] + " " + day + ", " + year;
    return day + " " + this.createProposalService.MONTH[month].substring(0, 3) + " " + year;
  }

  onDateSelection($event){
    if (this.isUserClickedRsd) { 
    if ($event > this.expectedEAStartDate) {
      this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_EXCEED_LIMIT_MESSAGE');
      this.errorDateSelection = true;
    } else if ($event < this.todaysDate) {
      this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_CANNOT_BE_LESS_MESSAGE');
      this.errorDateSelection = true;
    } else {
      this.isRsdChangedByUser = true;
      this.errorDateSelection = false;
    }
    if (this.showEndDate && this.referenceSubscriptionId  && this.isSubscriptionUpdated) {
      let rsdInStr = this.formartDateToStr(this.myForm.get('eaStartDate').value);
      this.getDurationInMonths(rsdInStr, this.eaEndDateInString);
    }
    this.isProposalUpdated();
    }
  }

  // method to set flag when user clicks on RSD box
  userclicked(){
    this.isUserClickedRsd = true;
  }

  // onDateSelection($event) {
  //   this.myForm.value.eaStartDate = $event;
  //   this.eaStartDate.setValue($event);
  //   if ($event > this.expectedEAStartDate) {
  //     this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_EXCEED_LIMIT_MESSAGE');
  //     this.errorDateSelection = true;
  //   } else if ($event < this.todaysDate) {
  //     this.errorDateSelectionMessage = this.localeService.getLocalizedMessage('proposal.create.DATE_CANNOT_BE_LESS_MESSAGE');
  //     this.errorDateSelection = true;
  //   } else {
  //     this.errorDateSelection = false;
  //   }
  //   if (this.showEndDate && this.referenceSubscriptionId  && this.isSubscriptionUpdated) {
  //     let rsdInStr = this.formartDateToStr(this.myForm.get('eaStartDate').value);
  //     this.getDurationInMonths(rsdInStr, this.eaEndDateInString);
  //   }
  //   this.isProposalUpdated();
  // }

  updateCot(cot) {
    this.selectedCountryTranscation = cot.countryName;
    setTimeout(() => {
      this.myDropCountrysearch.close();
    });
    this.updatedValues.countryOfTransaction = cot.isoCountryAlpha2;
    this.isProposalUpdated();
  }

  updateBillingModel(billingModel) {

     this.showMSPBillingError = false;

    if(this.archName === 'Cisco DNA' && billingModel.displayName == 'Annual Billing') {
      this.approvalWarning = true;
      this.billingModelInfo = true;
    } else if(billingModel.displayName == 'Annual Billing') {
      this.approvalWarning = false;
      this.billingModelInfo = true;
    } else {
      this.billingModelInfo = false;
      this.approvalWarning = false;
    }
    this.selectedBillingModel = billingModel.displayName;
    this.proposalDataService.proposalDataObject.proposalData.billingModelID = billingModel.identifier;
    this.proposalDataService.selectedArchForQna = this.appDataService.subHeaderData.subHeaderVal[7];
    this.proposalDataService.validateBillingModel();
    this.showBillingError = this.proposalDataService.invalidBillingModel;
    setTimeout(() => {
      this.myDropBillingsearch.close();
    });
    this.isProposalUpdated();
  }

  keyDown($event) {
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode == 8)) {
      event.preventDefault();
    }
    this.allowDebounce = true;
    this.eaTerm.valueChanges.pipe(debounceTime(1500)).subscribe((res) => {
      if(this.allowDebounce){
        if (res < 12) {
          res = 12;
        }
        else {
          let max = 60;
          if(this.archName === 'Cisco DNA' ||  this.proposalDataService.allow84Term) {
            max = 84;
          }
          if(res > max) {
            res = max;
          }
        }
        this.changeValueForSlider(this.sliderElement, res);
        // this.errorDuration = false;
        this.displayCustomDurationWarning = this.createProposalService.checkCustomDurationWarning(Number(this.eaTerm.value));
        // this.displayCustomDNADurationWarning = this.createProposalService.checkDNACustomDurationWarning(this.eaTerm.value);
        this.allowDebounce = false;
      } 
    });
  }

  billingOpen() {		
    if (this.createProposalService.mspPartner && this.appDataService.subHeaderData.subHeaderVal[7] === this.constantsService.DNA && this.selectedMSPAnswer) {		
        this.billingModels = this.proposalDataService.billingModelMetaData.billingModellov;		
     		
    }else {		
         const arrWithoutQuarterly = this.billingModels.filter(item => item.identifier !== ConstantsService.QUARTERLY);		
         const arrWithoutMonthly = arrWithoutQuarterly.filter(item => item.identifier !== ConstantsService.MONTHLY);		
         this.billingModels =  arrWithoutMonthly;		
    }		
  }

  // method to show price list dropdown if not readonly mode
  priceListDrop($event) {
    if (!this.readOnlyMode) {
      $event.stopPropagation();
      this.myDropPricesearch.open();
      this.myDropBillingsearch.close();
      this.myDropCountrysearch.close();
    }
  }

  // method to show billingmodel dropdown if not readonly mode
  billingDrop($event) {

    this.billingOpen();	
    if (!this.readOnlyMode) {
      $event.stopPropagation();
      this.myDropBillingsearch.open();
      this.myDropCountrysearch.close();
      this.myDropPricesearch.close();
    }
  }

  // method to show countryOfTransaction list dropdown if not readonly mode
  countryOfTransactionDrop($event) {
    if (!this.readOnlyMode) {
      $event.stopPropagation();
      this.myDropCountrysearch.open();
      this.myDropBillingsearch.close();
      this.myDropPricesearch.close();
    }
  }

  // method to show partner list dropdown if not readonly mode
  partnerSelectDrop($event) {
    if (!this.readOnlyMode) {
      $event.stopPropagation();
      this.myDropsearch.open();
    }
  }

  focusDescription(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }


  // method to filter the subscription list with selected subs from renewal paramas 
  setSubscriptionListForRenewal(subsList, renwalSubIds){
    for(const data of subsList){
      if(renwalSubIds.includes(data.subscriptionId)){// check if subId's are present in the renewal params set selected true
        data.selected = true;
      }
    }
    this.subscriptionList = subsList.filter(data => !data.selected); // filter with the unselected subs
  }
}

export interface ProposalHeaderObj {
  proposalName: string;
  eaStartDate: Date;
  eaTerm: number;
  billingModel: string;
  priceList: string;
  description: string;
  countryOfTransaction: string;
  primaryPartnerId: number;
  eaEndDate: string;
  subscriptionId: string;
  priceListId: number
}