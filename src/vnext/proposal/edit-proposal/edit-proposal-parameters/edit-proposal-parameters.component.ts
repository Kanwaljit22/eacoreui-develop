import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit, Renderer2, EventEmitter, Output, Input } from '@angular/core';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { IPartnerInfo, VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { IBilling, ICapitalFinancing, ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService, ISubscription, ISubscriptionInfo, ICotermEndDateRangeObj } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { PriceEstimateStoreService } from '../price-estimation/price-estimate-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { PriceEstimateService } from '../price-estimation/price-estimate.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
//import { ProposalStoreService, ISubscription, ISubscriptionInfo } from 'vnext/proposal/proposal-store.service';

const DURATION_TYPES = {
  MONTHS36: 'MONTHS36',
  MONTHS60: 'MONTHS60',
  MONTHSCUSTOM: 'MONTHSCUSTOM',
  MONTHSCOTERM: 'MONTHSCOTERM'
};
@Component({
  selector: 'app-edit-proposal-parameters',
  templateUrl: './edit-proposal-parameters.component.html',
  styleUrls: ['./edit-proposal-parameters.component.scss'],
  providers:[MessageService]
})
export class EditProposalParametersComponent implements OnInit, OnDestroy {
  simpleSlider: any;
  options: Options = {
    floor: 12,
    ceil: 84,
    showTicksValues: true,
    ticksArray: [12, 24, 36, 48, 60, 72, 84]
  };
  durationTypes: any;
  public priceListArray:any = [];
  public countryOfTransactionArray = [];
  partnersArray = [];
  billingData: IBilling[];
  capitalFrequencyData: ICapitalFinancing[];

  customDate = false;
  coTerm = false;
  expectedMaxDate: Date;
  todaysDate: Date;
  showProposalParameter = true;
  partnerApiCalled = false; // set if partner data api is called
  isUserClickedOnDateSelection = false; // set when user clicks on calendar selection
  updatedProposalparamsMap = new Map<any, any>(); // set updated proposal params map
  showModalDropObj: ShowModalDropObj = {}
  selectedProposalParamsObj: SelectedPropsoalParamsObj = {};
  datesDisabled = []; // to set dates to be disabled on calendar
  @Output() onClose = new EventEmitter();
  public subscribers: any = {};
  billingModelDisplayName = '';
  frequencyModelDisplayName = '';
  isFreqSelected: boolean = false;
  durationInMonths: any;
  displayDurationMsg = false;
  selectedSubscription:ISubscription;
  selectedDuration:number;
  subscriptionSelectionMessage =  false
  durationOriginalValueForCoterm:number;
  isUserUpdatingPartner = false;
  searchArray = ['countryName'];
  renewalDetails = '';
  countrySearch = '';
  displayJustificationWarning = true;
  displayJustificationPartnerWarning = true;
  maxSubscriptionCoverageDate: Date;
  bsConfig:Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY', 
    showWeekNumbers: false,
    containerClass:'theme-vNext'
  };
  isOpen = false;
  updateMsp = false;
  showMspQues = false;
  subSearchApiCalled = false;
  @Input() isChangeSubFlow = false;
  isBillingTermUpdatedForCapital = false;
  msaQnaUpdated = false;
  disabledForMsa = false;
  isPartnerUserLoggedIn = false;
  intendedUse: string;
  isMsea: boolean;
  showEntitledError = false;
  cotermEndDateMin: Date; // to set min date for coterm
  cotermEndDateMax: Date; // to set max date for coterm
  cotermEndDate: Date; // to set selected coterm end date
  isUserClickedOnEndDateSelection = false; // set when user clicks on calendar selection
  cotermEndDateRangeObj: ICotermEndDateRangeObj;
  cotermEndDatesDisabled = []; // to set dates to be disabled on calendar
  selectedEntitled: string;
  showCotermSelection = false; // set to show coterm selection
  isCotermAdded = false; // set when coterm is added
  isCoOpen = false;
  constructor(public proposalStoreService: ProposalStoreService, public utilitiesService: UtilitiesService, public renderer: Renderer2, private vnextService: VnextService, public dataIdConstantsService: DataIdConstantsService,
     private proposalRestService: ProposalRestService, private projectStoreService: ProjectStoreService, private messageService: MessageService, private vnextStoreService: VnextStoreService,public eaUtilitiesService: EaUtilitiesService,
     public localizationService:LocalizationService, public priceEstimateStoreService: PriceEstimateStoreService,private eaRestService: EaRestService, private priceEstimateService: PriceEstimateService, private proposalService: ProposalService,
     public eaService: EaService, private constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'position-fixed');
    this.durationTypes = DURATION_TYPES;

    this.selectedProposalParamsObj.selectedBillingModel = this.proposalStoreService.proposalData.billingTerm?.billingModel;
    this.selectedProposalParamsObj.subscriptionInfo = {
      existingCustomer: this.proposalStoreService.proposalData?.subscriptionInfo?.existingCustomer,
      justification: this.proposalStoreService.proposalData?.subscriptionInfo?.justification
      };
    this.selectedProposalParamsObj.proposalName = this.proposalStoreService.proposalData.name;
    this.selectedProposalParamsObj.selectedCapitalFrequencyModel = this.proposalStoreService.proposalData.billingTerm?.capitalFinancingFrequency;
      
    
    // Term slider configuration set
    this.simpleSlider = {
      min: 12,
      max: 84,
      value: this.proposalStoreService.proposalData.billingTerm?.term,
      grid_num: 6,
      step: 12
    };
    this.selectedProposalParamsObj.selectedDuration = this.proposalStoreService.proposalData.billingTerm?.term;
    this.selectedProposalParamsObj.rsd = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm?.rsd));
    this.selectedProposalParamsObj.rsd.setHours(0, 0, 0, 0);
    // this.cotermEndDate = new Date();
    this.cotermEndDateMin = new Date();
    this.cotermEndDateMin = new Date();
    this.cotermEndDatesDisabled = [];

    // Coterm setting 
    if(this.proposalStoreService.proposalData.billingTerm?.coterm) {
          this.durationOriginalValueForCoterm =  this.proposalStoreService.proposalData.billingTerm?.term;
          this.selectedProposalParamsObj.selectedDuration =  this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2);
          if(this.eaService.features?.COTERM_SEPT_REL && !this.isChangeSubFlow){
            if(this.proposalStoreService.proposalData.billingTerm.coterm?.subRefId){
              this.selectedSubscription =  {subRefId:this.proposalStoreService.proposalData.billingTerm.coterm?.subRefId , subscriptionEnd:this.proposalStoreService.proposalData.billingTerm.coterm?.endDate};
            }
            this.cotermEndDate = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm.coterm.endDate));
            if(this.proposalStoreService.proposalData.billingTerm?.rsd){
              let startDate = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm.rsd))
              this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(startDate, this.constantsService.COTERM_END_DATE_MAX);
              this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(startDate, this.constantsService.COTERM_END_DATE_MIN);
              this.checkForCotermEndDatesDisabled(this.cotermEndDateMin, this.cotermEndDate);
            }
            // set to show coterm selection if already cotermend date present
            if(this.cotermEndDate){
              this.showCotermSelection = true;
              if(!this.selectedSubscription){
                this.isCotermAdded = true;
              }
            }
          } else {
            this.selectedSubscription =  {subRefId:this.proposalStoreService.proposalData.billingTerm.coterm?.subRefId , subscriptionEnd:this.proposalStoreService.proposalData.billingTerm.coterm?.endDate};
          }
          this.coTerm =  true;
    }

    // Set today for start date calendar  
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.todaysDate.setDate(this.todaysDate.getDate());
    this.expectedMaxDate = new Date();
    this.getPriceList();
    this.getCountryOfTransaction();
    this.getBillingModel();
    this.vnextService.getMaxStartDate(this.expectedMaxDate, this.todaysDate, this.selectedProposalParamsObj.rsd, this.datesDisabled, this.proposalStoreService.proposalData.billingTerm?.rsd, null, null, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id); // to get max and default start dates
    this.getPartners();
    if(!this.eaService.isSpnaFlow){
      this.priceEstimateService.checkCxPresent(); // check and set if cxPresent
    }


    // check and store disti name from distidetail
    if(this.proposalStoreService.proposalData?.dealInfo?.distiDetail){
      this.selectedProposalParamsObj.distiName = this.proposalStoreService.proposalData.dealInfo.distiDetail.name;
    } else if (this.projectStoreService.projectData.dealInfo?.distiDetail) {
      this.selectedProposalParamsObj.distiName = this.projectStoreService.projectData.dealInfo.distiDetail.name;
    }

    // after values updated subscibe to subject and set the updated 
    this.subscribers.rsdSubject = this.vnextStoreService.rsdSubject.subscribe((rsdData: any) => {
      this.expectedMaxDate = rsdData.expectedMaxDate;
      this.todaysDate = rsdData.todaysDate;
      this.selectedProposalParamsObj.rsd = rsdData.eaStartDate;
      this.datesDisabled = rsdData.datesDisabled;
    });
    if (this.eaService.features.MSEA_REL) {
      if ((this.proposalStoreService.mspInfo?.mspPartner && !this.proposalStoreService.proposalData.buyingProgramTransactionType) || this.proposalStoreService.proposalData.buyingProgramTransactionType) {
        this.showMspQues = true;
      } else {
        this.showMspQues = false;
      }
    } else {
      if (this.proposalStoreService.mspInfo?.mspPartner) {
        this.showMspQues = true;
      } else {
        this.showMspQues = false;
      }
    }

    // Coterm setting
    if(this.proposalStoreService.proposalData?.subRefId && this.isChangeSubFlow) {
      this.getAndSetChangeSubDetails(this.proposalStoreService.proposalData.subRefId);
      this.coTerm =  true;
    }

    // this.proposalStoreService.proposalData.hasAgreementContract = true;
    if(this.proposalStoreService.proposalData?.agreementContractNumber){
      this.proposalStoreService.masterAgreementInfo.masterAgreement = true;
      this.proposalStoreService.masterAgreementInfo.contractNumber = this.proposalStoreService.proposalData.agreementContractNumber;
      this.selectedProposalParamsObj.agreementContractNumber = this.proposalStoreService.proposalData.agreementContractNumber;
      // this.selectedProposalParamsObj.hasAgreementContract = true;
    } 
    // else if(this.proposalStoreService.proposalData.hasAgreementContract){
    //   this.proposalStoreService.masterAgreementInfo.masterAgreement = true;
    //   this.proposalStoreService.masterAgreementInfo.contractNumber = undefined;
    //   this.selectedProposalParamsObj.hasAgreementContract = true;
    //   this.selectedProposalParamsObj.agreementContractNumber = undefined;
    // } 
    else {
      this.proposalStoreService.masterAgreementInfo.masterAgreement = false;
      this.proposalStoreService.masterAgreementInfo.contractNumber = undefined;
      this.selectedProposalParamsObj.agreementContractNumber = undefined;
    }
    if(this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerUserLoggedIn = true;
    }
  }

  checkForCotermEndDatesDisabled(endDateMin, selectedEndDate){
    this.cotermEndDatesDisabled = [];
    if (selectedEndDate < endDateMin) {
      // check and push dates from rsd to todaysDate - 1 for disabling in calendar
      for (let i = selectedEndDate; i < endDateMin; i = new Date(i.setDate(i.getDate() + 1))) {
        this.cotermEndDatesDisabled.push(i.setHours(0, 0, 0, 0));
      }
      this.cotermEndDateMin = new Date(selectedEndDate);
      this.cotermEndDateMin.setHours(0, 0, 0, 0);
    }
  }

  // method to check and set if user clicks to change date
  onUserClickEndDateSelection(){
    this.isUserClickedOnEndDateSelection = true;
  }

  // method to set coterm end date on selection
  onEndDateSelection($event) {
    if(this.isUserClickedOnEndDateSelection && $event && !this.selectedSubscription){
      this.cotermEndDate = $event;
      this.isCotermAdded = true;
      this.getDuration();
    }
  }

  lookUpSubscription(){
    this.proposalStoreService.openLookupSubscriptionSubj.next(true);
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

  updateProposalName($event){
    if (!$event.target.value.trim()) {
      this.selectedProposalParamsObj.proposalName = '';
      return
    }
    if ($event.target.value.trim() !== this.selectedProposalParamsObj.proposalName){
      this.selectedProposalParamsObj.proposalName = $event.target.value.trim();
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.proposalName, this.proposalStoreService.proposalData.name, 'name')
    }
  }

  selectCountryOfTransaction(country) {
    if (country.isoCountryAlpha2 !== this.selectedProposalParamsObj.countryOfTransaction.isoCountryAlpha2){
      this.selectedProposalParamsObj.countryOfTransaction = country;
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.countryOfTransaction.isoCountryAlpha2, this.proposalStoreService.proposalData.countryOfTransaction, 'countryOfTransaction');
      this.countrySearch = this.selectedProposalParamsObj.countryOfTransaction?.countryName;
    }
    this.showModalDropObj.showCountryDrop = false;
  }

  selectPriceList(priceList) {
    if (priceList.priceListId !== this.selectedProposalParamsObj.selectedPriceList?.priceListId){
      this.selectedProposalParamsObj.selectedPriceList = priceList;
      const priceListInfo = {
        id: this.selectedProposalParamsObj.selectedPriceList.priceListId,
        name: this.selectedProposalParamsObj.selectedPriceList.description
      }
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedPriceList.priceListId, this.proposalStoreService.proposalData.priceList.id, 'priceList', priceListInfo);
    }
    this.showModalDropObj.showPriceListDrop = false;
  }

  selectBillingModal(billingModel) {
    if (billingModel.id !== this.selectedProposalParamsObj.selectedBillingModel){
      this.selectedProposalParamsObj.selectedBillingModel = billingModel.id;
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedBillingModel, this.proposalStoreService.proposalData.billingTerm.billingModel, 'billingModel');
      this.getSelectedBillingModal();

    }
    this.showModalDropObj.showBillingModalDrop = false;
  }

  selectFrequencyModal(capitalFrequencyModel) {
    if(this.proposalStoreService.isReadOnly || (this.isChangeSubFlow && !this.frequencyModelDisplayName)){
      return;
    }
    let selectedCapFreq = this.selectedProposalParamsObj?.selectedCapitalFrequencyModel;
    if (capitalFrequencyModel?.id !== selectedCapFreq){
      this.selectedProposalParamsObj.selectedCapitalFrequencyModel = capitalFrequencyModel.id;
      this.frequencyModelDisplayName = capitalFrequencyModel.id;
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedCapitalFrequencyModel, this.proposalStoreService.proposalData.billingTerm?.capitalFinancingFrequency, 'capitalFinancingFrequency');
      this.isFreqSelected = true;
      this.getSelectedCapitalFrequencyModal();
    }
    this.showModalDropObj.showFrequencyDrop = false;
  }

  selectOpted(){
    if(this.proposalStoreService.isReadOnly || this.isChangeSubFlow){
      return;
    }
    this.showModalDropObj.showFrequencyDrop = false;
    this.isFreqSelected = false;
    this.frequencyModelDisplayName = '';
    this.selectedProposalParamsObj.selectedCapitalFrequencyModel = undefined;
    this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedCapitalFrequencyModel, this.proposalStoreService.proposalData.billingTerm?.capitalFinancingFrequency, 'capitalFinancingFrequency');
  }
  
  getSelectedBillingModal() {
    if (Array.isArray(this.billingData)) {
      this.billingModelDisplayName =  this.billingData.find(billing => billing.id === this.selectedProposalParamsObj.selectedBillingModel).uiOption.displayName;
    }
  }

  getSelectedCapitalFrequencyModal() {
    if(this.isFreqSelected && this.selectedProposalParamsObj.selectedBillingModel !== 'Prepaid'){
      this.billingModelDisplayName = 'Prepaid Term';
      this.selectedProposalParamsObj.selectedBillingModel = 'Prepaid'; 
      this.isBillingTermUpdatedForCapital = true;
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedBillingModel, this.proposalStoreService.proposalData.billingTerm.billingModel, 'billingModel');
    } else {
      this.isBillingTermUpdatedForCapital = false;
    }
  }

  public onDateSelection($event) {
    let date: Date;
    date = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm.rsd));
    date.setHours(0,0,0,0);
    if (!$event) {
      this.selectedProposalParamsObj.rsd = date;
    } else if (this.isUserClickedOnDateSelection && $event) {
      this.selectedProposalParamsObj.rsd = $event;
      const rsdStr = this.utilitiesService.formartDateIntoString($event)
      this.isproposalParamsUpdated(rsdStr, this.proposalStoreService.proposalData.billingTerm.rsd, 'rsd');

      if (this.isUserClickedOnDateSelection && $event && this.coTerm && this.selectedSubscription) {
         this.getDuration();
      } else {
        // set coterm min/max dates on RSD change
        if(this.isUserClickedOnDateSelection && $event && this.selectedProposalParamsObj.rsd && this.coTerm && !this.selectedSubscription && this.eaService.features?.COTERM_SEPT_REL && !this.isChangeSubFlow && this.isCotermAdded && this.cotermEndDate){
          this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(this.selectedProposalParamsObj.rsd, this.cotermEndDateRangeObj?.max ? this.cotermEndDateRangeObj.max : this.constantsService.COTERM_END_DATE_MAX);
          this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(this.selectedProposalParamsObj.rsd, this.cotermEndDateRangeObj?.min ? this.cotermEndDateRangeObj.min : this.constantsService.COTERM_END_DATE_MIN);
          this.checkForCotermEndDatesDisabled(this.cotermEndDateMin, this.cotermEndDate);
          this.getDuration();
        }
      }
    }
  }

  // method to check and set if user clicks to change date
  onUserClickDateSelection(){
    this.isUserClickedOnDateSelection = true;
  }

  sliderChange(value, type) {
    if (type == 'slider'){
      if (value !== this.selectedProposalParamsObj.selectedDuration){
        this.selectedProposalParamsObj.selectedDuration = value;
        this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedDuration, this.proposalStoreService.proposalData.billingTerm.term, 'term');
      }
    } else {
      this.selectedProposalParamsObj.selectedDuration = value;
    }
  }

  updateDuration() {
    if(this.eaService.features?.COTERM_SEPT_REL && this.coTerm){
      return;
    }
    if (this.simpleSlider.value !== this.selectedProposalParamsObj.selectedDuration){
      if (this.selectedProposalParamsObj.selectedDuration > this.options.maxLimit) {
        this.selectedProposalParamsObj.selectedDuration = this.options.maxLimit;
      } else if (this.selectedProposalParamsObj.selectedDuration < 12) {
        this.selectedProposalParamsObj.selectedDuration = 12
      }
      this.customDate = (this.selectedProposalParamsObj.selectedDuration === 36 || this.selectedProposalParamsObj.selectedDuration === 60) ? false : true;
      this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedDuration, this.proposalStoreService.proposalData.billingTerm.term, 'term')
    }
  }

  checkDurationsSelected(event) {
    if (event.target.value !== this.selectedProposalParamsObj.selectedDuration){
      switch (event.target.value) {

        case this.durationTypes.MONTHS60:
          this.selectedProposalParamsObj.selectedDuration = 60;
          this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
          this.customDate = false;
          this.displayDurationMsg = false;
          this.coTerm = false;
          break;
        case this.durationTypes.MONTHS36:
          this.selectedProposalParamsObj.selectedDuration = 36;
          this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
          this.customDate = false;
          this.displayDurationMsg = false;
          this.coTerm = false;
          break;
        case this.durationTypes.MONTHSCUSTOM:
          this.customDate = true;
          this.displayDurationMsg = false;
          this.coTerm = false;
          this.selectedProposalParamsObj.selectedDuration = null;
          this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
          break;
  
        case this.durationTypes.MONTHSCOTERM:
          this.coTerm = true;
          this.customDate = false;
          if(this.eaService.features?.COTERM_SEPT_REL){
            if (this.selectedSubscription) {
              this.selectedProposalParamsObj.selectedDuration = this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2);
              this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
              this.cotermEndDate = new Date(this.utilitiesService.formateDate(this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd)));
              this.cotermEndDatesDisabled = [];
              this.showCotermSelection = true;
              this.getDuration(); // call duration api when user switches from different duration
            } else {
              // set cotermend dates when coterm is selected 
              if(this.eaService.features?.COTERM_SEPT_REL){
                this.selectedProposalParamsObj.selectedDuration = null;
                this.resetCotermSelection();
              }
            }
          } else {
            if (this.selectedSubscription) {
              this.selectedProposalParamsObj.selectedDuration = this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2);
              this.simpleSlider.value = this.selectedProposalParamsObj.selectedDuration;
            }
          }
        default:
          setTimeout(() => {
            this.sliderChange(this.selectedProposalParamsObj.selectedDuration , 'selection');
          }, 0);
          break;
      }
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedDuration, this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2), 'term');
    }
  }

  // This meethod is used to get billing details
  getBillingModel() {
    this.eaRestService.getApiCall(this.vnextService.getBillingModelAndMaxStartUrl(this.vnextService.getAppDomainWithContext + 'proposal/billing-term-lovs',null, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id,this.proposalStoreService.proposalData?.buyingProgram)).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.billingData = response.data.billingModels;
        this.getSelectedBillingModal();
        if(response.data.capitalFinancingFrequency){
          this.utilitiesService.sortArrayByDisplaySeq(response.data.capitalFinancingFrequency);
          this.capitalFrequencyData = response.data.capitalFinancingFrequency;
          if(this.selectedProposalParamsObj.selectedCapitalFrequencyModel){
            this.frequencyModelDisplayName = this.selectedProposalParamsObj.selectedCapitalFrequencyModel;
            this.isFreqSelected = true;
            // this.getSelectedCapitalFrequencyModal();
          }
        }
        if(response.data.term){
          this.options = this.proposalService.changeOptions(response.data.term, this.options);
        }
        if(response.data?.coTerm && this.eaService.features?.COTERM_SEPT_REL){
          this.cotermEndDateRangeObj = response.data.coTerm;
          if(this.proposalStoreService.proposalData.billingTerm?.rsd && this.cotermEndDate){
            let startDate = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm.rsd))
            this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(startDate, response.data.coTerm?.max ? response.data.coTerm.max :this.constantsService.COTERM_END_DATE_MAX);
            this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(startDate, response.data.coTerm?.min ? response.data.coTerm.min :this.constantsService.COTERM_END_DATE_MIN);
            this.checkForCotermEndDatesDisabled(this.cotermEndDateMin, this.cotermEndDate);
          }
        }
        
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

   // This method is use to fetch price list
  getPriceList() {
    let url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/price-list';
    if(this.proposalStoreService.proposalData.dealInfo?.referrerQuoteId){
      url = url + '?qid=' + this.proposalStoreService.proposalData.dealInfo.referrerQuoteId;
      
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        if (response.data){
          this.priceListArray = response.data;
          if(Array.isArray(this.priceListArray)){
            this.selectedProposalParamsObj.selectedPriceList = this.priceListArray.find(priceList => priceList.priceListId === this.proposalStoreService.proposalData.priceList.id);
          }
        } else {
          this.priceListArray = [];
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  private getCountryOfTransaction() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/country?p=' + this.projectStoreService.projectData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.countryOfTransactionArray = response.data.countries;
        if (Array.isArray(this.countryOfTransactionArray)) {
          this.selectedProposalParamsObj.countryOfTransaction = this.countryOfTransactionArray.find(country => country.isoCountryAlpha2 === this.proposalStoreService.proposalData.countryOfTransaction);
        }
        this.countrySearch = this.selectedProposalParamsObj.countryOfTransaction?.countryName;
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  getPartners() { // This method is use to fetch Partners details.
    let url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/partners';
    if(this.proposalStoreService.proposalData.dealInfo?.referrerQuoteId){
      url = url + '?qid=' + this.proposalStoreService.proposalData.dealInfo.referrerQuoteId;
      
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      this.partnerApiCalled = true;
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        if (response.data){
          this.partnersArray = response.data;
          if (Array.isArray(this.partnersArray)) {
          this.selectedProposalParamsObj.selectedPartner = this.partnersArray.find(partner => partner.beGeoId === this.proposalStoreService.proposalData.partnerInfo.beGeoId);
            if (this.eaService.features.MSEA_REL && this.selectedProposalParamsObj.selectedPartner.beGeoId) {
              this.checkMspAuth()
            } else {
              this.isMsea = false;
            }
          }
        } else {
          this.isMsea = false;
          this.partnersArray = [];
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  setSelectedPartner(partner: IPartnerInfo){
    // check if partnerInfo empty from api or partner present and not same as previous one allowchange partner selection
    if (!this.selectedProposalParamsObj.selectedPartner || (this.selectedProposalParamsObj.selectedPartner && (partner.beGeoName !== this.selectedProposalParamsObj.selectedPartner.beGeoName))){
      this.selectedProposalParamsObj.selectedPartner = partner;
      const partnerInfo = {
        beGeoName: this.selectedProposalParamsObj.selectedPartner.beGeoName,
        beGeoId: this.selectedProposalParamsObj.selectedPartner.beGeoId
      };
      this.checkMspAuth();
      this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedPartner.beGeoId, this.proposalStoreService.proposalData.partnerInfo.beGeoId, 'partnerInfo', partnerInfo);
    }
    this.showModalDropObj.showPartnerDropdown = false;
  }

  checkMspAuth() {
    let url = this.vnextService.getAppDomainWithContext +'partner/' + this.selectedProposalParamsObj.selectedPartner.beGeoId +
    '/purchase-authorization?d=' + this.projectStoreService.projectData.dealInfo.id + '&buyingProgram=' + this.proposalStoreService.proposalData?.buyingProgram;
    if(this.proposalStoreService.proposalData.dealInfo?.referrerQuoteId){
      url = url + '&qid=' + this.proposalStoreService.proposalData.dealInfo.referrerQuoteId;
      
    }
    this.eaRestService.getApiCall(url).subscribe((response:any) => {
      if(this.vnextService.isValidResponseWithData(response)) {
        this.intendedUse = response.data.intendedUseFromDeal ? response.data.intendedUseFromDeal : '';
        if (response.data?.mspInfo?.mspPartner || (this.eaService.features.MSEA_REL && (this.proposalStoreService.proposalData.buyingProgramTransactionType) || (this.proposalStoreService.mspInfo?.mspPartner && !this.proposalStoreService.proposalData.buyingProgramTransactionType))){
          this.showMspQues = true;
          if(response.data.mspInfo) {
            this.priceEstimateService.mspSelectedValue = response.data.mspInfo?.mspProposal;
          } else {
            this.priceEstimateService.mspSelectedValue = this.proposalStoreService.mspInfo?.mspProposal;
          }
          this.isMsea = response.data?.mspInfo?.managedServicesEaPartner ? true : false;
          this.selectedEntitled = response.data?.mspInfo?.entitlementType;

        } else {
          this.showMspQues = false;
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  selectSubscription(subscription) {

  if(subscription){    
   
    this.subscriptionSelectionMessage =  true 
    this.selectedSubscription = subscription;
    this.getDuration();

    let oldSubscriptionID = '';
    if(this.proposalStoreService.proposalData.billingTerm.coterm) {
      oldSubscriptionID =  this.proposalStoreService.proposalData.billingTerm.coterm.subRefId;
    }else {
      oldSubscriptionID =  '';
    }
    this.isproposalParamsUpdated(this.selectedSubscription.subRefId,oldSubscriptionID, 'subscription');

  } else {
    this.subscriptionSelectionMessage =  false; 
    this.selectedSubscription = this.eaService.features?.COTERM_SEPT_REL ? undefined : {};
  }

  // set coterm dates on subscripiton selection/deselection
  if(this.eaService.features?.COTERM_SEPT_REL){
    if(this.selectedSubscription){
      this.cotermEndDate = new Date(this.selectedSubscription.subscriptionEnd);
      this.cotermEndDatesDisabled = [];
      this.showCotermSelection = true;
    } else {
      this.selectedProposalParamsObj.selectedDuration = null;
      this.resetCotermSelection();
    }
  }
}

getDuration() {

  this.durationInMonths = '';
  this.displayDurationMsg = false;
  let endDate = '';

   // check and set end date for getting duration
  if(this.eaService.features?.COTERM_SEPT_REL){
    endDate = this.selectedSubscription ? this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd) : this.eaUtilitiesService.formatDateWithMonthToString(this.cotermEndDate)
  } else {
    endDate = this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd)
  }

  const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.eaUtilitiesService.formatDateWithMonthToString(this.selectedProposalParamsObj.rsd)  + '/' + endDate + '/duration?p='+this.projectStoreService.projectData.objId;

   this.eaRestService.getApiCall(url).subscribe((res: any) => {
    this.messageService.clear();
    if (this.vnextService.isValidResponseWithData(res, true)) {
      this.durationOriginalValueForCoterm =  res.data;
      this.selectedProposalParamsObj.selectedDuration  = this.eaUtilitiesService.convertFloatValueByDecimalCount(res.data,2);
      if(this.eaService.features.COTERM_SEPT_REL) {
        if(this.selectedProposalParamsObj.selectedDuration < 12 || this.selectedProposalParamsObj.selectedDuration > 84){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
      } else {
        if(this.selectedProposalParamsObj.selectedDuration < 12){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
      }
      if(this.eaService.features?.COTERM_SEPT_REL && !this.selectedSubscription && (this.isUserClickedOnEndDateSelection || this.isUserClickedOnDateSelection)){
        this.isproposalParamsUpdated(this.selectedProposalParamsObj.selectedDuration, this.eaUtilitiesService.convertFloatValueByDecimalCount(this.proposalStoreService.proposalData.billingTerm.term,2), 'term');
      }
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
   });
}

  close(isProposalUpdated?) {
    this.onClose.emit(isProposalUpdated);
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
    if (this.subscribers.rsdSubject){ 
      this.subscribers.rsdSubject.unsubscribe();
    }
    this.proposalStoreService.masterAgreementInfo = {};
  }

  // method to check proposal params updated or not and update the updatedProposalparamsMap
  isproposalParamsUpdated(newValue, oldValue, key, mapValue?){
    
    if ((newValue !== oldValue) || (!this.coTerm && this.selectedSubscription)){  // If coterm change to non coterm and duration is same then update
  
      if (!mapValue){ // check for mapValue
        mapValue = newValue;
      }
      // check if aggreementcontractnumber and value is undefined set the value to null 
      if(key === 'agreementContractNumber' && mapValue === undefined){
        mapValue = null;
      }
      this.updatedProposalparamsMap.set(key, mapValue)
      if (key === 'partnerInfo'){
        this.isUserUpdatingPartner = true;
      }
      // if (!oldValue && !newValue && key === 'existingCustomer') {
      //   this.updatedProposalparamsMap.delete(key);
      //   this.updatedProposalparamsMap.delete('justification');
      // }
    } else if(newValue === oldValue && this.updatedProposalparamsMap.has(key)) {
      this.updatedProposalparamsMap.delete(key);
      // if (key === 'existingCustomer' && this.updatedProposalparamsMap.has('justification')) {
      //   this.updatedProposalparamsMap.delete('justification');
      // }
      if (key === 'partnerInfo'){
        this.isUserUpdatingPartner = false;
      }
    }
  }

  updateProposal() {
    if (this.showMspQues && this.eaService.features.MSEA_REL && this.proposalStoreService.mspInfo?.managedServicesEaPartner && this.proposalStoreService.proposalData?.buyingProgramTransactionType && !this.proposalStoreService.mspInfo?.entitlementType ) {
      this.showEntitledError = true;
    } else {
      this.showEntitledError = false;
      const requestObj = {
        "data": {
        }
      }
  
      const billingTerm = {};
      let addBillingTermInReq = false; // set if billingmodal/rsd/term updated
  
      // Delete subsciption value change which is used to enable update button
       this.updatedProposalparamsMap.delete('subscription');
  
      this.updatedProposalparamsMap.forEach((value: any, key: string) => {
        if (key === 'billingModel' || key === 'rsd' || key === 'term' || (key === 'capitalFinancingFrequency' && this.eaService.features.SEP_REL)){
          if(key === 'capitalFinancingFrequency' && this.eaService.features.SEP_REL){
            if((this.proposalStoreService.proposalData.billingTerm?.capitalFinancingFrequency && !this.frequencyModelDisplayName) || this.frequencyModelDisplayName){
              billingTerm[key] = this.frequencyModelDisplayName ? value : null;
              billingTerm['isCapitalFrequencyUpdated'] = true;
              addBillingTermInReq = true;
            }
          } else {
            billingTerm[key] = value;
            addBillingTermInReq = true;
          }
        }
        // else if (key === 'existingCustomer') {
        //   // if only existingCustomer Change update the value -> Yes/ No, justification will be added in next step
        //   requestObj.data['subscriptionInfo'] = {
        //     existingCustomer: value,
        //     justification: null
        //   };
        // } 
        else if (key === 'justification') {
          requestObj.data['subscriptionInfo']= {
            existingCustomer: value ? true : false,
            justification: value
          };
        }
        else {
          requestObj.data[key] = value;
          if(key === 'agreementContractNumber'){
            requestObj.data['updateAgreementContractNumber'] = true;
          }
          // if(key === 'agreementContractNumber' || key === 'hasAgreementContract'){
          //   requestObj.data['updateAgreementContractNumber'] = true;
          // }
        }
      });
      // set if billingmodal/rsd/term updated
      if (addBillingTermInReq){
        requestObj.data['billingTerm'] = billingTerm;
      }
  
      if(this.eaService.features?.COTERM_SEPT_REL && this.coTerm){
          requestObj.data['billingTerm'] = billingTerm;
          requestObj.data['billingTerm']['term'] =  this.durationOriginalValueForCoterm;
        if (this.selectedSubscription){
          requestObj.data['billingTerm']["coterm"]  =  {endDate :this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd),subRefId:this.selectedSubscription.subRefId};
        } else { // send enddate only when subscription is not selected
          requestObj.data['billingTerm']["coterm"]  =  {endDate :this.eaUtilitiesService.formatDateWithMonthToString(this.cotermEndDate)};
        }
      } else {
        if (this.coTerm && this.selectedSubscription){
  
          requestObj.data['billingTerm'] = billingTerm;
          requestObj.data['billingTerm']['term'] =  this.durationOriginalValueForCoterm;
          requestObj.data['billingTerm']["coterm"]  =  {endDate :this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd),subRefId:this.selectedSubscription.subRefId};
        }
      }
  
      if(this.updateMsp) {
        if (this.eaService.features.MSEA_REL) {
          if ((!this.proposalStoreService.proposalData?.buyingProgramTransactionType || this.proposalStoreService.proposalData?.buyingProgramTransactionType === null ) && this.proposalStoreService.mspInfo.mspPartner) {
            requestObj.data['mspInfo'] = {
              mspAuthorizedQualcodes: this.proposalStoreService.mspInfo.mspAuthorizedQualcodes,
              mspProposal: this.proposalStoreService.mspInfo.mspProposal
            }
          } else {
            requestObj.data[this.constantsService.BP_TRANSACTION_TYPE] = this.proposalStoreService.mspInfo?.managedServicesEaPartner ? this.constantsService.MSEA : this.constantsService.MSP_EA;
            if (this.proposalStoreService.mspInfo?.managedServicesEaPartner) {
              requestObj.data['mspInfo'] = {
                entitlementType: this.proposalStoreService.mspInfo.entitlementType
              }
            }
          }
        } else {
          requestObj.data['mspInfo'] = {
            mspAuthorizedQualcodes: this.proposalStoreService.mspInfo.mspAuthorizedQualcodes,
            mspProposal: this.proposalStoreService.mspInfo.mspProposal
          }
        }
      }
  
      // add changes for proposal params update api
      const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId;
      this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
        this.messageService.clear();
        if (this.vnextService.isValidResponseWithData(response, true)) {
          const isRsdDue = this.proposalStoreService.rsdDueCurrDate;
          // if(this.proposalStoreService.proposalData.enrollments){
          //   if(response.data.enrollments){
  
              
          //     this.proposalStoreService.proposalData.enrollments.forEach(value => {
  
          //       const isEnrollmentPresent = response.data.enrollments.find(enrollment => value.id === enrollment.id)
          //       if(!isEnrollmentPresent){
          //         value['detailInfo'] = false;
          //         response.data.enrollments.push(value)
          //       }
          //     });
          //   }
          //   else {
          //     response.data.enrollments = this.proposalStoreService.proposalData.enrollments;
          //   }
            
          // }
          //this.proposalStoreService.proposalData = response.data.proposal;
         // this.proposalStoreService.proposalData.enrollments = response.data.enrollments;
          if(this.updatedProposalparamsMap.has('rsd')){
            this.proposalStoreService.rsdDueCurrDate = false;
          } else if(isRsdDue){
            this.proposalStoreService.rsdDueCurrDate = true;
          }
          if (response.data.proposal.partnerInfo) {
            this.projectStoreService.projectData.partnerInfo = response.data.proposal.partnerInfo;
          }
          this.proposalStoreService.proposalData.currencyCode = response.data.proposal.currencyCode;
          if( Object.keys(requestObj.data).length >  1 || !requestObj.data['name']){
            this.close(true);
          } else {
            this.proposalStoreService.proposalData.name = response.data.proposal.name;
            this.proposalStoreService.editProposalParamter = false;
          }
  
          if (response.data.proposal?.mspInfo) {
            this.proposalStoreService.mspInfo = response.data.proposal.mspInfo;
          }
          
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    }
    

  }

  // check and show EAMS info message
  checkToShowEamsInfoMsg(){
    return !this.showProposalParameter && !this.proposalStoreService.isReadOnly && this.priceEstimateStoreService.eamsDeliveryObj.partnerDeliverySelected && this.isUserUpdatingPartner;
  }

  
checkCountry() {
  setTimeout(() => {
    if(this.countrySearch !== this.selectedProposalParamsObj.countryOfTransaction?.countryName) {
      this.countrySearch = this.selectedProposalParamsObj.countryOfTransaction.countryName;
    }
    this.showModalDropObj.showCountryDrop = false;
  }, 200);
 }

 search() {
    this.focusInput('searchCountry');
 }
 

 focusInput(val) {
  const element = this.renderer.selectRootElement('#' + val);
  element.focus();
}
  // updateScopeParams($event) {
  //   if ($event.target.value !== this.selectedProposalParamsObj.subscriptionInfo.existingCustomer) {
  //     this.selectedProposalParamsObj.subscriptionInfo.existingCustomer = $event.target.value === 'Yes' ? true : false;
  //     // for intial NO condition when toggling need to clear the justification to disable update
  //     if ($event.target.value === 'No' && !this.proposalStoreService.proposalData ?.subscriptionInfo ?.existingCustomer) {
  //       this.selectedProposalParamsObj.subscriptionInfo.justification = null;
  //     }
  //     this.isproposalParamsUpdated(this.selectedProposalParamsObj.subscriptionInfo.existingCustomer, this.proposalStoreService.proposalData ?.subscriptionInfo ?.existingCustomer, 'existingCustomer')
  //   }
  // }
  updateJustification($event) {
    this.selectedProposalParamsObj.subscriptionInfo.justification = $event.trim();
    this.isproposalParamsUpdated(this.selectedProposalParamsObj.subscriptionInfo.justification, this.proposalStoreService.proposalData?.subscriptionInfo?.justification, 'justification');
  }

  updateMspSelection($event) {
    this.showEntitledError = false;
    if (this.proposalStoreService.proposalData?.buyingProgramTransactionType) {
      if ((this.selectedEntitled !== this.proposalStoreService.mspInfo.entitlementType) || $event) {
        this.updateMsp = true;
      } else {
        this.updateMsp = false;
      }
     } else {
      if(this.priceEstimateService.mspSelectedValue !== this.proposalStoreService.mspInfo.mspProposal) {
        this.updateMsp = true;
      } else {
        this.updateMsp = false;
      }
    }
  }
  
  updateMsaSelection(contractNumberUpdated) {
    this.disabledForMsa = false;
    if(this.proposalStoreService.proposalData?.agreementContractNumber){// contract number from api present
      if(!contractNumberUpdated){// radio button selection updated
        if(!this.proposalStoreService.masterAgreementInfo?.masterAgreement){// radio selected NO
          this.msaQnaUpdated = true;
          // this.selectedProposalParamsObj.agreementContractNumber = '';
        } else { // radio selected Yes
          if(!this.proposalStoreService.masterAgreementInfo?.contractNumber){ // if selected yes but contract number empty disable continue
            this.disabledForMsa = true;
          } else {
            this.msaQnaUpdated = false;
          }
          // this.selectedProposalParamsObj.agreementContractNumber = this.proposalStoreService.proposalData.agreementContractNumber;
        }
      } else { // contract number changed
        
        if(this.proposalStoreService.masterAgreementInfo?.contractNumber) {//if contract number present
          if((this.proposalStoreService.masterAgreementInfo?.contractNumber !== this.proposalStoreService.proposalData.agreementContractNumber)){ //if contract number not equal to api value
            this.msaQnaUpdated = true;
          } else {
            this.msaQnaUpdated = false;
          }
        } else {//if contract number is empty
          this.disabledForMsa = true;
        }
      }
    } else {// if no value from api 
      if(this.proposalStoreService.masterAgreementInfo?.masterAgreement){// if radio selcted Yes
        if(contractNumberUpdated && this.proposalStoreService.masterAgreementInfo?.contractNumber){ // if contract updated and contract number present
          this.msaQnaUpdated = true
        } else { // if contract number empty or qna is no
          this.disabledForMsa = true;
        }
      } else {
        this.msaQnaUpdated = false;
      }
    }

    this.selectedProposalParamsObj.agreementContractNumber = (this.proposalStoreService.masterAgreementInfo?.masterAgreement && this.proposalStoreService.masterAgreementInfo?.contractNumber) ? this.proposalStoreService.masterAgreementInfo.contractNumber : undefined;
    if(!this.disabledForMsa){
      this.isproposalParamsUpdated(this.selectedProposalParamsObj?.agreementContractNumber, this.proposalStoreService.proposalData?.agreementContractNumber, 'agreementContractNumber');
    }
  }

  // updateMsa(contractNumberUpdated){
  //   this.selectedProposalParamsObj.hasAgreementContract = this.proposalStoreService.masterAgreementInfo?.masterAgreement ? true : false;
  //     if(!contractNumberUpdated){
  //       this.isproposalParamsUpdated(this.selectedProposalParamsObj?.hasAgreementContract, this.proposalStoreService.proposalData?.hasAgreementContract, 'hasAgreementContract');
  //     }
  //     this.selectedProposalParamsObj.agreementContractNumber = (this.proposalStoreService.masterAgreementInfo?.masterAgreement && this.proposalStoreService.masterAgreementInfo?.contractNumber) ? this.proposalStoreService.masterAgreementInfo.contractNumber : undefined;
  //     this.isproposalParamsUpdated(this.selectedProposalParamsObj?.agreementContractNumber, this.proposalStoreService.proposalData?.agreementContractNumber, 'agreementContractNumber');
  // }

  // method to reset coterm selection
  resetCotermSelection() {
    this.isCotermAdded = false;
    this.showCotermSelection = false;
    this.isCoOpen = false;
    this.displayDurationMsg = false;
    if(this.cotermEndDate){
      let emptyDate: Date;
      this.cotermEndDate = emptyDate
    }
  }

  // method to showcoterm selection
  allowCotermSelection(){
    this.showCotermSelection = true;
    if(this.selectedProposalParamsObj.rsd && this.eaService.features?.COTERM_SEPT_REL){
      this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(this.selectedProposalParamsObj.rsd, this.cotermEndDateRangeObj?.max ? this.cotermEndDateRangeObj.max : this.constantsService.COTERM_END_DATE_MAX);
      this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(this.selectedProposalParamsObj.rsd, this.cotermEndDateRangeObj?.min ? this.cotermEndDateRangeObj.min : this.constantsService.COTERM_END_DATE_MIN);
    }
    if(!this.isCoOpen) {
      this.isCoOpen = true;
    }
  }

  
  cotermCalendarOpen(){
    this.isCoOpen = !this.isCoOpen
    if(!this.showCotermSelection){
      this.allowCotermSelection();
    }
  }
}



export interface ShowModalDropObj {
  showBillingModalDrop?: boolean,
  showFrequencyDrop?: boolean,
  showPriceListDrop?: boolean,
  showCountryDrop?: boolean,
  showPartnerDropdown?: boolean
}

export interface SelectedPropsoalParamsObj {
  proposalName?: string,
  distiName?: string,
  rsd?: Date,
  selectedDuration?: number,
  selectedPriceList?: PriceListInfo,
  countryOfTransaction?: CountryOfTransaction,
  selectedPartner?: IPartnerInfo,
  selectedBillingModel?: string,
  selectedCapitalFrequencyModel?: string,
  subscriptionInfo?: ISubscriptionInfo,
  agreementContractNumber?: string,
  // hasAgreementContract?: boolean
}

export interface PriceListInfo {
  priceListId?: string,
  description?: string,
  name?: string
}

export interface CountryOfTransaction {
  isoCountryAlpha2?: string,
  countryName?: string
}
