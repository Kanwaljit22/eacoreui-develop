import { MessageType } from './../../../../commons/message/message.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Component, OnInit,Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { Options } from '@angular-slider/ngx-slider';
import { PriceEstimateService } from '../price-estimate.service';
import { ProposalStoreService, IEnrollmentsInfo, ISubscription, ICotermEndDateRangeObj } from "vnext/proposal/proposal-store.service";
import { IBilling,ProjectStoreService } from "vnext/project/project-store.service";
import { MessageService } from 'vnext/commons/message/message.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

const DURATION_TYPES = {
  MONTHS36: 'MONTHS36',
  MONTHS60: 'MONTHS60',
  MONTHSCUSTOM: 'MONTHSCUSTOM',
  MONTHSCOTERM: 'MONTHSCOTERM'
};

@Component({
  selector: 'app-edit-enrollment',
  templateUrl: './edit-enrollment.component.html',
  styleUrls: ['./edit-enrollment.component.scss'],
  providers: [MessageService]
})
export class EditEnrollmentComponent implements OnInit, OnDestroy {

  simpleSlider: any;
  options: Options = {
    floor: 12,
    ceil: 84,
    showTicksValues: true,
    ticksArray: [12, 24, 36, 48, 60, 72, 84],
  };
  selectedDuration:number;
  disableButton =  true;
  durationTypes: any;
  customDate = false;
  expectedMaxDate: Date;
  eaStartDate: Date;
  todaysDate: Date;
  selectedBillingModel = '';
  //public billingDetail: any = {};

  billingData: IBilling[];

  proposalID = '';
  @Input() selectedEnrollemnt:IEnrollmentsInfo;
  @Output() closeEditEnrollment = new EventEmitter();
  isUserClickedOnDateSelection = false; // set when user clicks on calendar selection
  datesDisabled = []; // to set dates to be disabled on calendar
  public subscribers: any = {};
  coTerm = false;
  isRsdMax90Days = false;
  durationOriginalValueForCoterm:number; // to store unrounded term from enrollment 
  selectedSubscription:ISubscription; // to store selected subscription from enrollment
  maxSubscriptionCoverageDate: Date;
  bsConfig:Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY', 
    showWeekNumbers: false,
    containerClass:'theme-vNext'
  };
  isOpen = false;
  isOverdue = false;
  isProposalEarlyFollowOn = false;
  @Input() isChangeSubFlow = false;
  capitalFinancingData: IBilling[];
  frequencyModelDisplayName = '';
  isFreqSelected: boolean = false;
  showFrequencyDrop: boolean = false;
  isBillingTermUpdatedForCapital = false;
  subSearchApiCalled = false;
  isEnrollmentSub : boolean;
  cotermEndDateMin: Date; // to set min date for coterm
  cotermEndDateMax: Date; // to set max date for coterm
  cotermEndDate: Date; // to set selected coterm end date
  cotermEndDatesDisabled = []; // to set dates to be disabled on calendar
  cotermEndDateRangeObj: ICotermEndDateRangeObj;
  isUserClickedOnEndDateSelection = false; // set when user clicks on calendar selection
  constructor(private proposalRestService: ProposalRestService,public elementIdConstantsService: ElementIdConstantsService,
     private vnextService:VnextService, public dataIdConstantsService: DataIdConstantsService, private constantsService: ConstantsService,
    public utilitiesService: UtilitiesService, public priceEstimateService: PriceEstimateService, public proposalStoreService: ProposalStoreService, private messageService: MessageService, private eaRestService: EaRestService, private vnextStoreService: VnextStoreService, private proposalService: ProposalService,public eaUtilitiesService: EaUtilitiesService,
    public localizationService:LocalizationService, public priceEstimateStoreService: PriceEstimateStoreService, public eaService: EaService, private projectStoreService: ProjectStoreService) { }

  ngOnInit() {

    this.durationTypes = DURATION_TYPES;
    if(this.eaService.features.SPNA_REL){
      this.isEnrollmentSub = true;
    }else{
      this.isEnrollmentSub = false;
    }
    this.selectedBillingModel = this.selectedEnrollemnt.billingTerm.billingModel;
    if(this.selectedEnrollemnt.billingTerm?.capitalFinancingFrequency){
      this.frequencyModelDisplayName = this.selectedEnrollemnt.billingTerm.capitalFinancingFrequency;
    } else {
      this.selectedEnrollemnt.billingTerm.capitalFinancingFrequency = '';
    }

    // Term slider configuration set
    this.simpleSlider = {
      min: 12,
      max: 84,
      value: this.selectedEnrollemnt.billingTerm.term,
      grid_num: 6,
      step: 12
    };
    this.selectedDuration = this.simpleSlider.value;
    //this.eaStartDate = new Date(this.selectedEnrollemnt.billingTerm.rsd); // set selected start date
    this.eaStartDate = new Date(this.utilitiesService.formateDate(this.selectedEnrollemnt.billingTerm.rsd));
    this.eaStartDate.setHours(0, 0, 0, 0);
    // Set today for start date calendar  
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.todaysDate.setDate(this.todaysDate.getDate());
    this.expectedMaxDate = new Date();
    // this.cotermEndDate = new Date();
    this.cotermEndDateMin = new Date();
    this.cotermEndDateMin = new Date();
    this.getBillingModel();
    this.vnextService.getMaxStartDate(this.expectedMaxDate, this.todaysDate, this.eaStartDate, this.datesDisabled, this.selectedEnrollemnt.billingTerm.rsd, null, this.selectedEnrollemnt?.id, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id); // to get max and default start dates

    // after values updated subscibe to subject and set the updated 
    this.subscribers.rsdSubject = this.vnextStoreService.rsdSubject.subscribe((rsdData: any) => {
      this.expectedMaxDate = rsdData.expectedMaxDate;
      this.todaysDate = rsdData.todaysDate;
      this.eaStartDate = rsdData.eaStartDate;
      this.datesDisabled = rsdData.datesDisabled;
      // if cx attched for selected enrollment, check if slected date is greater than 90 days
      // if (this.selectedEnrollemnt.cxAttached) {
      //   this.checkRsdForServices();
      // }
    });
    // Coterm setting 
    if (this.selectedEnrollemnt.billingTerm.coterm) {
      this.durationOriginalValueForCoterm = this.selectedEnrollemnt.billingTerm.term;
      this.selectedDuration = this.utilitiesService.convertFloatValueByDecimalCount(this.selectedEnrollemnt.billingTerm.term, 2);
      this.simpleSlider.value = this.selectedDuration;
      if(this.eaService.features?.COTERM_SEPT_REL && this.selectedEnrollemnt.billingTerm.coterm?.endDate){
        this.cotermEndDate = new Date(this.utilitiesService.formateDate(this.selectedEnrollemnt.billingTerm.coterm.endDate));
        if(this.selectedEnrollemnt.billingTerm.coterm?.subRefId){
          this.selectedSubscription = { subRefId: this.selectedEnrollemnt.billingTerm.coterm.subRefId, subscriptionEnd: this.selectedEnrollemnt.billingTerm.coterm.endDate };
        } else {
          // set coterm dates 
          if(this.selectedEnrollemnt.billingTerm?.rsd){
            let startDate = new Date(this.utilitiesService.formateDate(this.selectedEnrollemnt.billingTerm.rsd))
            this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(startDate, this.constantsService.COTERM_END_DATE_MAX);
            this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(startDate, this.constantsService.COTERM_END_DATE_MIN);
            this.checkForCotermEndDatesDisabled(this.cotermEndDateMin, this.cotermEndDate)
          }
        }
      } else {
        this.selectedSubscription = { subRefId: this.proposalStoreService.proposalData.billingTerm.coterm.subRefId, subscriptionEnd: this.proposalStoreService.proposalData.billingTerm.coterm.endDate };
      }
      this.coTerm = true;
    }
    this.options.disabled = this.selectedEnrollemnt?.disableRsdAndTermUpdate;
    if (this.proposalStoreService.proposalData.renewalInfo && this.proposalStoreService.proposalData.renewalInfo.type === 'EARLY_FOLLOWON') {
      this.isProposalEarlyFollowOn = true;
    } else {
      this.isProposalEarlyFollowOn = false;
    }
    this.checkForOverdue();

     // Coterm setting
     if(this.proposalStoreService.proposalData?.subRefId && this.isChangeSubFlow && this.eaService.features.SPNA_REL) {
      this.getAndSetChangeSubDetails(this.proposalStoreService.proposalData.subRefId);
        this.coTerm = true;
    }
  }

  getAndSetChangeSubDetails(subRefId){
    this.subSearchApiCalled = false;
    const url = this.vnextService.getAppDomainWithContext + 'subscription/search/'+subRefId+ '?p=' + this.projectStoreService.projectData.objId + '&type=co-term';

    this.eaRestService.getApiCall(url).subscribe((response: any) =>{
      this.subSearchApiCalled = true;
      if (this.vnextService.isValidResponseWithData(response, true)){
         
        this.selectedSubscription = {subscriptionId:response.data.subscriptionId ,subscriptionStart : response.data.subscriptionStartDate,subscriptionEnd : response.data.subscriptionEndDate, statusDesc : response.data.statusDesc, subRefId : response.data.subscriptionRefId, enrollments: response.data.enrollments ? response.data.enrollments : []}
        this.getDuration();
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  checkForOverdue(){
    if(this.priceEstimateStoreService.renewalSubscriptionDataForSuite?.subscriptions?.length){
      for(let i = 0; i < this.priceEstimateStoreService.renewalSubscriptionDataForSuite.subscriptions.length; i++){
        if(this.priceEstimateStoreService.renewalSubscriptionDataForSuite.subscriptions[i].overdue){
          this.isOverdue = true;
          break;
        }
      }
    }
  }

// check if enrollments RSD is greater than max date set it to add in api request
checkRsdForServices(){
  this.isRsdMax90Days = false;
  let todaysDate: Date;
  todaysDate = new Date();
  todaysDate.setHours(0,0,0,0);
  let expectedCxDate: Date;
  expectedCxDate = new Date();
  expectedCxDate.setHours(0, 0, 0, 0);
  expectedCxDate.setDate(todaysDate.getDate() + 90);
  let date: Date;
  date = new Date(this.utilitiesService.formateDate(this.selectedEnrollemnt.billingTerm.rsd));
  date.setHours(0,0,0,0);
  if (date > expectedCxDate){
    this.isRsdMax90Days = true;
  }
  // disable dates from systemDate+90 days to max date
  for (let i = expectedCxDate; i < this.expectedMaxDate; i = new Date(i.setDate(i.getDate() + 1))) {
    this.datesDisabled.push(i.setHours(0, 0, 0, 0));
  }
}

  // This meethod is used to get billing details
   getBillingModel() { 
    const url = this.vnextService.getBillingModelAndMaxStartUrl(this.vnextService.getAppDomainWithContext + 'proposal/billing-term-lovs',this.selectedEnrollemnt?.id, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id,this.proposalStoreService.proposalData?.buyingProgram);
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.utilitiesService.sortArrayByDisplaySeq(response.data.billingModels);
        this.billingData = response.data.billingModels;
        // this.setNewCeil(response.data.term.max);
        this.options = this.proposalService.changeOptions(response.data.term, this.options);
        if ( response.data.capitalFinancingFrequency) {
          this.utilitiesService.sortArrayByDisplaySeq(response.data.capitalFinancingFrequency);
          this.capitalFinancingData = response.data.capitalFinancingFrequency;
          if (this.selectedEnrollemnt.billingTerm?.capitalFinancingFrequency) {
            this.frequencyModelDisplayName = this.selectedEnrollemnt.billingTerm.capitalFinancingFrequency;
            this.isFreqSelected = true;
          }
        }
        if(this.eaService.features?.COTERM_SEPT_REL && response.data?.coterm){
          this.cotermEndDateRangeObj = response.data.coterm;
        }
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }



 
   sliderChange(value) {
    this.selectedDuration = value;
    this.coTerm = false;
    this.isUpdateEnable();
  }

    updateDuration() {
    if (this.selectedDuration > this.options.maxLimit) {
      this.selectedDuration = this.options.maxLimit;
    } else if (this.selectedDuration < 12) {
      this.selectedDuration = 12
    }
    // if coterm, set duration to integer if entered
    if (this.coTerm){
      this.selectedDuration  = this.utilitiesService.convertFloatValueByDecimalCount(this.selectedDuration,0);
    } else {
      this.coTerm = false;
    }
    this.customDate = (this.selectedDuration === 36 || this.selectedDuration === 60 ) ? false : true;
    this.simpleSlider.value = this.selectedDuration
    this.isUpdateEnable();

  }

    // This method is used for managing term
    checkDurationsSelected(event) {
    switch (event.target.value) {

      case this.durationTypes.MONTHS60:
        this.selectedDuration = 60;
        this.simpleSlider.value = this.selectedDuration;
        this.customDate = false;
        this.coTerm = false;
        break;
      case this.durationTypes.MONTHS36:
        this.selectedDuration = 36;
        this.simpleSlider.value = this.selectedDuration;
        this.customDate = false;
        this.coTerm = false;
        break;
      case this.durationTypes.MONTHSCUSTOM:
        this.customDate = true;
        this.coTerm = false;
        this.selectedDuration = null;
        this.simpleSlider.value = this.selectedDuration;
        break;
      case this.durationTypes.MONTHSCOTERM:
        if(this.eaService.features.SPNA_REL){
          this.customDate = false;
          this.coTerm = true;
          if (this.selectedSubscription) {
            this.selectedDuration = this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2);
            this.simpleSlider.value = this.selectedDuration;
          }
        }
        break;
      default:
        setTimeout(() => {
          this.sliderChange(this.selectedDuration);
        }, 0);
        break;
    }
    if(!this.coTerm){
      if(this.isUserClickedOnEndDateSelection){
        this.isUserClickedOnEndDateSelection = false;
      }
      if(this.selectedSubscription){
        this.selectedSubscription = this.eaService.features?.COTERM_SEPT_REL ? undefined : {};
      }
    }
      this.isUpdateEnable();
  }

  // This method is used for selected billing
  billingSelected(event) {
     this.selectedBillingModel = event.target.value;   
     this.isUpdateEnable();
  }

  selectOpted(){
    if(this.proposalStoreService.isReadOnly || this.isChangeSubFlow){
      return;
    }
    this.showFrequencyDrop = false;
    this.isFreqSelected = false;
    this.frequencyModelDisplayName = '';
    this.isUpdateEnable();
  }

  capitalFrequencySelected(capitalFinance){
    if(this.proposalStoreService.isReadOnly || this.selectedEnrollemnt?.includedInChangeSub || (this.isChangeSubFlow && !this.frequencyModelDisplayName)){
      return;
    }
    if(capitalFinance?.id !== this.frequencyModelDisplayName){
      this.frequencyModelDisplayName = capitalFinance.id;
      this.isFreqSelected = true;
      if(this.selectedBillingModel !== 'Prepaid'){
        this.isBillingTermUpdatedForCapital = true;
        this.selectedBillingModel = 'Prepaid'; 
      } else {
        this.isBillingTermUpdatedForCapital = false;
      }
      this.isUpdateEnable();
    }
    this.showFrequencyDrop = false;
  }

  getSelectedFrequencyModal() {
    if (Array.isArray(this.capitalFinancingData) && this.capitalFinancingData.length) {
      this.frequencyModelDisplayName =  this.capitalFinancingData.find(capitalFinance => capitalFinance.uiOption.displayName === this.selectedEnrollemnt.billingTerm.capitalFinancingFrequency).id;
      this.isFreqSelected = true;
    }
    if(this.frequencyModelDisplayName && this.selectedBillingModel !== 'Prepaid'){
      this.selectedBillingModel = 'Prepaid'; 
    }
  }

  // This method is used for enable update button
  isUpdateEnable() {
    if(this.proposalStoreService.isReadOnly){
      return;
    }

    this.disableButton =  true;
    if (this.selectedEnrollemnt.billingTerm.term !== this.selectedDuration || this.selectedEnrollemnt.billingTerm.billingModel !== this.selectedBillingModel || this.selectedEnrollemnt.billingTerm.rsd !== this.utilitiesService.formartDateIntoString(this.eaStartDate) || ( (this.selectedEnrollemnt.billingTerm?.capitalFinancingFrequency !== this.frequencyModelDisplayName) )){
       this.disableButton =  false;
       if(this.selectedDuration == null){
        this.disableButton = true
      }
    }
  }

  public onDateSelection($event) {
    let date: Date;
    date = new Date(this.utilitiesService.formateDate(this.selectedEnrollemnt.billingTerm.rsd));
    date.setHours(0,0,0,0);
    if (!$event) {
      this.eaStartDate = date;
    } else if (this.isUserClickedOnDateSelection && $event) {
      this.eaStartDate = $event;
      this.isRsdMax90Days = false;
      if (this.coTerm && this.selectedSubscription) {
        this.getDuration(); // if coterm, get duration from api
     } else {
      // set cotermdates on rsd change
      if(this.eaService.features?.COTERM_SEPT_REL && this.coTerm && !this.selectedSubscription){
          this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(this.eaStartDate, this.constantsService.COTERM_END_DATE_MAX);
          this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(this.eaStartDate, this.constantsService.COTERM_END_DATE_MIN);
          this.checkForCotermEndDatesDisabled(this.cotermEndDateMin, this.cotermEndDate)
          this.getDuration();
      }
     }
      this.isUpdateEnable();
    }
  }

  // method to check and set if user clicks to change date
  onUserClickDateSelection(){
    this.isUserClickedOnDateSelection = true;
  }

  // This method is used for close edit enrollment
  close(enrollments?) {
    this.closeEditEnrollment.emit(enrollments);
  }

  // This method is used for update edit enrollment
  Update() {
    if(this.proposalStoreService.isReadOnly){
      return;
    }

    let isTermUpdated = false;
    if(this.coTerm){
      if(this.utilitiesService.convertFloatValueByDecimalCount(this.selectedEnrollemnt.billingTerm.term,2) !== this.selectedDuration){
        isTermUpdated = true;
      }
    }else if (this.selectedEnrollemnt.billingTerm.term !== this.selectedDuration){
      isTermUpdated = true;
    }
    const requestJson = {
      "data": {
        "enrollments": [
          {
            "enrollmentId": this.selectedEnrollemnt.id,
            "billingTerm": {term:this.selectedDuration,billingModel:this.selectedBillingModel, rsd: this.utilitiesService.formartDateIntoString(this.eaStartDate)},
          }
        ]
      }
    }

    // send coterm if duration not changed
    if (this.coTerm){
      requestJson.data.enrollments[0].billingTerm['term'] = this.durationOriginalValueForCoterm;
      
      if(this.eaService.features?.COTERM_SEPT_REL && !this.isChangeSubFlow){
        if(this.selectedSubscription){
          requestJson.data.enrollments[0].billingTerm['coterm'] = this.selectedEnrollemnt.billingTerm.coterm;
        } else {
          // send only end date when subscription not selected
          this.selectedEnrollemnt.billingTerm.coterm.endDate =  this.utilitiesService.formartDateIntoString(this.cotermEndDate);
          requestJson.data.enrollments[0].billingTerm['coterm'] = this.selectedEnrollemnt.billingTerm.coterm;
        }
      } else {
        requestJson.data.enrollments[0].billingTerm['coterm'] = this.selectedEnrollemnt.billingTerm.coterm;
      }
    }
     // if (!this.coTerm){
    //   requestJson.data.enrollments[0].billingTerm['term'] = this.selectedDuration;
    // }

    if( ((this.selectedEnrollemnt.billingTerm?.capitalFinancingFrequency && !this.frequencyModelDisplayName) || this.frequencyModelDisplayName)){
      requestJson.data.enrollments[0].billingTerm['capitalFinancingFrequency'] = this.frequencyModelDisplayName ? this.frequencyModelDisplayName : null;
      requestJson.data.enrollments[0].billingTerm['isCapitalFrequencyUpdated'] = true;
    }

    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment/' + this.selectedEnrollemnt.id + '?a=BILLING-TERM-UPDATE'
    this.proposalRestService.postApiCall(url,requestJson).subscribe((response: any) => {
      this.messageService.clear();
      if(this.vnextService.isValidResponseWithData(response, true)) { 

        // Setting error message 
          this.proposalStoreService.isSyncPrice = false;
          // this.proposalStoreService.proposalData.message = response.data.proposal.message;  
          // if(response.data.proposal?.message) {
          //   this.priceEstimateService.prepareMessageMapForGrid(response.data.proposal.message);
          // } else {
          //   this.priceEstimateService.messageMap.clear();
          //   this.priceEstimateStoreService.hasRSDError = false;
          //   this.priceEstimateStoreService.rsdErrorMsg = '';
          // }

         // Setting updated value 
          this.selectedEnrollemnt.billingTerm.billingModelName = response.data.enrollments[0].billingTerm.billingModelName;
          this.selectedEnrollemnt.billingTerm.billingModel = response.data.enrollments[0].billingTerm.billingModel;
          this.selectedEnrollemnt.billingTerm.term = response.data.enrollments[0].billingTerm.term;
          this.selectedEnrollemnt.billingTerm.rsd = response.data.enrollments[0].billingTerm.rsd;
          this.close(response.data.enrollments);
          // check RSD due if rsd due already present
          if (this.proposalStoreService.rsdDueCurrDate){
            this.proposalService.checkisRsdDue();
          }
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  setNewCeil(newCeil: number): void {
    // Due to change detection rules in Angular, we need to re-create the options object to apply the change
    const newOptions: Options = Object.assign({}, this.options);
    newOptions.ceil = newCeil;
    if(newCeil === 84){
      newOptions.ticksArray = [12, 24, 36, 48, 60, 72, 84];
    }else if(newCeil === 60){
      newOptions.ticksArray = [12, 24, 36, 48, 60];
    }
    newOptions.showTicksValues = true;
    this.options = newOptions;
  }

  ngOnDestroy() {
    if (this.subscribers.rsdSubject){ 
      this.subscribers.rsdSubject.unsubscribe();
    }
    this.isProposalEarlyFollowOn = false;
  }

  // api to get duration from RSD and selected subscription
  getDuration() {
    let endDate = '';

    // check and set end date for getting duration
    if(this.eaService.features?.COTERM_SEPT_REL){
      endDate = this.selectedSubscription ? this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd) : this.eaUtilitiesService.formatDateWithMonthToString(this.cotermEndDate)
    } else {
      endDate = this.eaUtilitiesService.formartDateToStr(this.selectedSubscription?.subscriptionEnd)
    }
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.eaUtilitiesService.formatDateWithMonthToString(this.eaStartDate) + '/' + endDate + '/duration?p='+this.proposalStoreService.proposalData.projectObjId;
    this.proposalRestService.getApiCall(url).subscribe((res: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(res, true)) {
        this.durationOriginalValueForCoterm = res.data;
        this.selectedDuration = this.eaUtilitiesService.convertFloatValueByDecimalCount(res.data, 2);
        this.simpleSlider.value = this.selectedDuration;
        if(this.eaService.features?.COTERM_SEPT_REL && !this.selectedSubscription && (this.isUserClickedOnDateSelection || this.isUserClickedOnEndDateSelection)){
          this.isUpdateEnable();
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to check and set if user clicks to change date
  onUserClickEndDateSelection(){
    this.isUserClickedOnEndDateSelection = true;
  }

  onEndDateSelection($event) {
    if($event && !this.selectedSubscription){
      this.cotermEndDate = new Date($event);
      this.getDuration();
    }
  }

  checkForCotermEndDatesDisabled(endDateMin, selectedEndDate){
    this.cotermEndDatesDisabled = [];
    if (selectedEndDate < endDateMin) {
      // check and push dates from endDateMin to selectedEndDate for disabling in calendar
      for (let i = selectedEndDate; i < endDateMin; i = new Date(i.setDate(i.getDate() + 1))) {
      this.cotermEndDatesDisabled.push(i.setHours(0, 0, 0, 0));
      }
    }
  }
}
