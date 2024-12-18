import { CreateProposalStoreService } from './create-proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectStoreService,IBilling, ICapitalFinancing } from 'vnext/project/project-store.service';
import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalRestService } from '../proposal-rest.service';
import { ProposalStoreService, ISubscription, ICotermEndDateRangeObj } from '../proposal-store.service';
import { IPartnerInfo, VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { EaStoreService } from 'ea/ea-store.service';
import { MessageService } from "vnext/commons/message/message.service";
import { LookupSubscriptionComponent } from "vnext/modals/lookup-subscription/lookup-subscription.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SubscriptionRenewalSelectionConfirmationComponent } from 'vnext/modals/subscription-renewal-selection-confirmation/subscription-renewal-selection-confirmation.component';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const DURATION_TYPES = {
  MONTHS36: 'MONTHS36',
  MONTHS60: 'MONTHS60',
  MONTHSCUSTOM: 'MONTHSCUSTOM',
  MONTHSCOTERM: 'MONTHSCOTERM'
};

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss']
})
export class CreateProposalComponent implements OnInit, OnDestroy {
  isCoOpen = false;
  showBillingModalDrop = false;
  showPriceListDrop = false;
  showCountryDrop = false;
  simpleSlider: any = {};
  displayInformationMsg = true;
  options: Options = {
    floor: 12,
    ceil: 84,
    showTicksValues: true,
    ticksArray: [12, 24, 36, 48, 60, 72, 84]
  };
  durationTypes: any;
  selectedDuration:number;
  customDate = false;
  coTerm = false;
  countryOfTranscation: any = {};
  priceList = '';
  vNext = true;
  public priceListArray = [];
  public countryOfTransactionArray = [];
  selectedPriceList: any = {}; // to store pricelistName/description to show on UI
  expectedMaxDate: Date;
  eaStartDate: Date;
  todaysDate: Date;
  showPartnerDropdown = false;
  partnersArray = [];
  selectedPartner: IPartnerInfo = {};
  distiName = ''; // to store distributor name
  proposalName = ''
  billingData: IBilling[];
  selectedBillingModel:IBilling; 
  partnerApiCalled = false; // set if partner data api is called
  disableContinueButton = false;
  public subscribers: any = {};
  subscriptionList:ISubscription[];
  selectedSubscription:ISubscription;
  durationInMonths: any;
  displayDurationMsg = false;
  subscriptionSelectionMessage =  false
  durationOriginalValueForCoterm:number;
  countrySearch = ''; 
  searchArray = ['countryName'];
  isCustomerScope = false;
  renewalDetails = '';
  displayJustificationWarning = true;
  displayJustificationPartnerWarning = true;
  showCreateProposal = true; // to show create proposal page
  maxSubscriptionCoverageDate: Date;
  bsConfig:Partial<BsDatepickerConfig> = {
    dateInputFormat: 'DD-MMM-YYYY', 
    showWeekNumbers: false,
    containerClass:'theme-vNext'
  };
  isOpen = false;
  backToRenewal = false;
  isMspAuth = false;
  subSearchApiCalled = false;
  isChangeSubFlow = false;
  distWithSidApiCalled = false; // set if api called for disti with sid
  showCapitalFinancingDrop = false;
  capitalFinancingData = [];
  selectedCapitalFinancing:ICapitalFinancing;
  frequencyModelDisplayName = '';
  isFreqSelected = false;
  isCapitalFreqSelected = false;
  isBillingTermUpdatedForCapital = false;
  intendedUse: string;
  isMsea: boolean = true;
  showEntitledError = false;
  cotermEndDateMin: Date; // to set min date for coterm
  cotermEndDateMax: Date; // to set max date for coterm
  cotermEndDate: Date; // to set selected coterm end date
  cotermEndDateRangeObj: ICotermEndDateRangeObj;
  showCotermSelection = false; // set to show coterm selection
  isCotermAdded = false; // set when coterm is added
  isUserClickedOnEndDateSelection = false; // set when user clicks on calendar selection 
  constructor(private router: Router, private vnextService: VnextService, public utilitiesService: UtilitiesService, public eaService: EaService, public elementIdConstantsService: ElementIdConstantsService,
    private proposalRestService: ProposalRestService, public projectStoreService: ProjectStoreService, private proposalStoreService: ProposalStoreService, private projectService: ProjectService, private vnextStoreService: VnextStoreService, private eaStoreService: EaStoreService,private messageService: MessageService,private eaRestService: EaRestService, private modalVar: NgbModal,public eaUtilitiesService: EaUtilitiesService,public localizationService:LocalizationService, public renderer: Renderer2, private proposalService: ProposalService, public createProposalStoreService: CreateProposalStoreService, public dataIdConstantsService: DataIdConstantsService, public constantsService: ConstantsService) { }

  ngOnInit() {
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.CREATE_PROPOSAL;
    if(sessionStorage.getItem('projectId')){
      this.showCreateProposal = false;
      this.eaStoreService.projectId = sessionStorage.getItem('projectId');
      sessionStorage.removeItem('projectId')
    }

    if(sessionStorage.getItem('renewalId')) {
      this.createProposalStoreService.renewalId = parseInt(sessionStorage.getItem('renewalId'));
      sessionStorage.removeItem('renewalId');
    } 
    
    if (sessionStorage.getItem('renewalJustification')) {
      this.createProposalStoreService.renewalJustification = sessionStorage.getItem('renewalJustification');
      sessionStorage.removeItem('renewalJustification');
    }

    if(sessionStorage.getItem('hybridSelected')) {
      const hybridSelected = sessionStorage.getItem('hybridSelected');
      this.createProposalStoreService.hybridSelected = (hybridSelected && hybridSelected === 'true') ? true : false;
      sessionStorage.removeItem('hybridSelected');
    }

    if(this.eaStoreService.projectId && !this.projectStoreService.projectData?.objId) {
      this.getProjectData(this.eaStoreService.projectId);
    } else if(this.projectStoreService.projectData.objId){
      this.loadData();
    } else {
      const projectData = JSON.parse(sessionStorage.getItem('projectData'));
      if(projectData){
        this.projectStoreService.projectData = projectData;
        this.projectService.setProjectPermissions(projectData.permissions);
      //  if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = projectData?.changeSubscriptionDeal ? true : false;
          this.isChangeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
       // }
          this.loadData();
          sessionStorage.removeItem('projectData');
      }
    }

    if(!this.eaStoreService.changeSubFlow){
      this.isChangeSubFlow = false;
      this.vnextService.hideProposalDetail = false;
      this.vnextService.roadmapStep = 2;
      this.vnextService.isRoadmapShown = true;
      this.vnextService.roadmapSubject.subscribe((value:any) => {
        if(value.id === 1){
          this.backToRenewal = true;
        }
          this.vnextService.redirectTo(value)
      })
    } else {
      this.isChangeSubFlow = true;
      this.vnextService.hideProposalDetail = true;
      this.vnextService.isRoadmapShown = false;
      this.vnextService.hideRenewalSubPage = true;
    }
    this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
    this.eaService.isSpnaFlow = (this.projectStoreService.projectData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
    // this.getSubscriptionList();
  }

  getProjectData(objId) {
    const url  =  'project/' + objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.projectStoreService.projectData = response.data;
      //  if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
          this.isChangeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
       // }
        if (this.projectStoreService.projectData.loccDetail) {
          this.vnextStoreService.loccDetail = this.projectStoreService.projectData.loccDetail
        }
        this.projectService.setProjectPermissions(response.data.permissions);
        this.loadData();
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // to load data
  loadData(){
    // check if not projectedit access or project inProgress, route to Project page
    if (!this.projectStoreService.projectEditAccess || this.projectStoreService.projectData.status !== 'COMPLETE'){
      this.showCreateProposal = false;
      this.router.navigate(['ea/project/' + this.projectStoreService.projectData.objId]);
    } else {
      this.showCreateProposal = true;
      this.loadCreateProposalData();
    }
  }

  loadCreateProposalData(){
    this.simpleSlider = {
      min: 12,
      max: 84,
      value: 36,
      grid_num: 6,
      step: 12
    };
    // Set today for start date calendar  
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.todaysDate.setDate(this.todaysDate.getDate());
    this.eaStartDate = new Date();
    this.expectedMaxDate = new Date();
    // this.cotermEndDate = new Date();
    this.cotermEndDateMin = new Date();
    this.cotermEndDateMin = new Date();
    this.getPriceList();
    this.getCountryOfTransaction();
    this.getBillingModel();
   // if (this.projectStoreService.projectData?.partnerInfo?.beGeoId) {
    //  this.checkMspAuth();
   // }
    this.vnextService.getMaxStartDate(this.expectedMaxDate, this.todaysDate, this.eaStartDate, [], this.eaStartDate, 'create', null, this.createProposalStoreService.renewalId); // to get max and default start dates with renewalId
    this.getPartners();

    this.durationTypes = DURATION_TYPES;
    
    // check and store disti name from distidetail
    // get disti for cisco led with sid 
    if (!this.projectStoreService.projectData.dealInfo?.partnerDeal && this.projectStoreService.projectData.selectedQuote 
      && this.projectStoreService.projectData.selectedQuote.quoteId && this.projectStoreService.projectData.selectedQuote.distiDetail?.sourceProfileId){ // need to add condition for sid and did 
      this.getDistiName();
    } else if (this.projectStoreService.projectData.dealInfo && this.projectStoreService.projectData.dealInfo.distiDetail) {
      this.distiName = this.projectStoreService.projectData.dealInfo.distiDetail.name
    }

    // after values updated subscibe to subject and set the updated 
    this.subscribers.rsdSubject = this.vnextStoreService.rsdSubject.subscribe((rsdData: any) => {
      this.expectedMaxDate = rsdData.expectedMaxDate;
      this.todaysDate = rsdData.todaysDate;
      this.eaStartDate = rsdData.eaStartDate;
    });

    // Coterm setting 
    if(this.projectStoreService.projectData?.subRefId && this.eaStoreService.changeSubFlow) {
      this.getAndSetChangeSubDetails(this.projectStoreService.projectData.subRefId);
      this.coTerm =  true;
    } else {
      this.selectedDuration = this.simpleSlider.value;
    }

    if (this.eaService.features.MSEA_REL) {
      this.isMspAuth = true;
    }

  }

  // method to get disti for cisco led with sid 
  getDistiName(){
    this.distWithSidApiCalled = true;
    let url =  this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/disti-details?sid=' + this.projectStoreService.projectData.selectedQuote.distiDetail.sourceProfileId+ '&qid=' + this.projectStoreService.projectData.selectedQuote.quoteId;// need to add sid
    // if(this.projectStoreService.projectData.selectedQuote){
    //   url = url + '&qid=' + this.projectStoreService.projectData.selectedQuote.quoteId;
    // } 
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        if(response.data && response.data.distiDetail){
          this.distiName = response.data.distiDetail.name; 
        }
      } else if(response.error){
        this.disableContinueButton = true;
      }
    });
  }
  // to get and set subrefid details for change sub
  getAndSetChangeSubDetails(subRefId){
    this.subSearchApiCalled = false;
    const url = this.vnextService.getAppDomainWithContext + 'subscription/search/'+ subRefId + '?p=' + this.projectStoreService.projectData.objId + '&type=co-term';

    this.eaRestService.getApiCall(url).subscribe((response: any) =>{
      this.subSearchApiCalled = true;
      if (this.vnextService.isValidResponseWithData(response, true)){
        this.selectedSubscription = {subscriptionId:response.data.subscriptionId ,subscriptionStart : response.data.subscriptionStartDate,subscriptionEnd : response.data.subscriptionEndDate, statusDesc : response.data.statusDesc, subRefId : response.data.subscriptionRefId, enrollments: response.data.enrollments ? response.data.enrollments : []}
        this.getDuration();
          this.frequencyModelDisplayName = response.data?.capitalBillingFrequency ? response.data.capitalBillingFrequency : '';
          if (this.frequencyModelDisplayName) {
            this.isFreqSelected = true;
            if(this.selectedBillingModel?.id !== this.constantsService.PREPAID){
              this.selectedBillingModel = this.billingData[0]; 
            }
          }
        
      }
    });
  }

  sliderChange(value) {
    this.selectedDuration = value;
  }

  updateDuration() {
    if(this.eaService.features?.COTERM_SEPT_REL && this.coTerm){
      return;
    }
    if (this.selectedDuration > this.options.maxLimit) {
      this.selectedDuration = this.options.maxLimit;
    } else if (this.selectedDuration < 12) {
      this.selectedDuration = 12
    }
    this.customDate = (this.selectedDuration === 36 || this.selectedDuration === 60 ) ? false : true;
    this.simpleSlider.value = this.selectedDuration
  }

  checkDurationsSelected(event) {
    this.subscriptionSelectionMessage = false;
    switch (event.target.value) {

      case this.durationTypes.MONTHS60:
        this.selectedDuration = 60;
        this.simpleSlider.value = this.selectedDuration;
        this.customDate = false;
        this.displayDurationMsg = false;
        this.coTerm = false;
        break;
      case this.durationTypes.MONTHS36:
        this.selectedDuration = 36;
        this.simpleSlider.value = this.selectedDuration;
        this.customDate = false;
        this.displayDurationMsg = false;
        this.coTerm = false;
        break;
      case this.durationTypes.MONTHSCUSTOM:
        this.customDate = true;
        this.selectedDuration = null;
        this.simpleSlider.value = this.selectedDuration;
        this.displayDurationMsg = false;
        this.coTerm = false;
        break;

      case this.durationTypes.MONTHSCOTERM:
        this.coTerm = true;
        this.customDate = false;
        // set duration to null when selected coterm 
        if(this.eaService.features?.COTERM_SEPT_REL){
          this.selectedDuration = null;
          if(this.selectedSubscription){
            this.selectedSubscription = undefined;
          }
          this.resetCotermSelection();
        }
      default:
        setTimeout(() => {
          this.sliderChange(this.selectedDuration);
        }, 0);
        break;
    }
      }


  getPriceList() { // This method is use to fetch price list.
    let url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/price-list';
    // if(this.eaStoreService.landingQid){
    //   url = url + '?qid=' + this.eaStoreService.landingQid;
      
    // }
    url = this.appendQuoteId(url);
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.priceListArray = response.data;
        this.selectedPriceList = this.priceListArray.find(priceList => priceList.defaultPriceList);
        if(!this.selectedPriceList){//if no defaultPriceList, assign first PL from array
          this.selectedPriceList = this.priceListArray[0];
        }
      } else {
        this.disableContinueButton = true;
      }
    });
  }

selectSubscription(subscription) {

  if(subscription){  
   this.selectedSubscription = subscription;
   this.getDuration();
      this.subscriptionSelectionMessage =  true; 
  } else {
      this.subscriptionSelectionMessage =  false;
      if(this.eaService.features?.COTERM_SEPT_REL){
        this.selectedSubscription = undefined;
      } else {
        this.selectedSubscription = {};
      }
  }

  if(this.eaService.features?.COTERM_SEPT_REL){
    if(this.selectedSubscription){
      this.cotermEndDate = new Date(this.selectedSubscription.subscriptionEnd);
      this.showCotermSelection = true;
    } else {
      this.selectedDuration = null;
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

  const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.eaUtilitiesService.formatDateWithMonthToString(this.eaStartDate)  + '/' + endDate + '/duration?p='+this.projectStoreService.projectData.objId;

   this.eaRestService.getApiCall(url).subscribe((res: any) => {
    
    if (this.vnextService.isValidResponseWithData(res)) {

      this.durationOriginalValueForCoterm =  res.data;
      this.selectedDuration = this.eaUtilitiesService.convertFloatValueByDecimalCount(res.data,2) ;

      if(this.eaService.features.COTERM_SEPT_REL) {
        if(this.selectedDuration < 12 || this.selectedDuration > 84){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
      } else {
        if(this.selectedDuration < 12){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }
      }

    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
   });
}


  selectPriceList(priceList) {
    this.selectedPriceList = priceList;
    this.showPriceListDrop = false;
  }

  // This method is use to fetch billing model values.
  getBillingModel() { 
    this.proposalRestService.getApiCall(this.vnextService.getBillingModelAndMaxStartUrl(this.vnextService.getAppDomainWithContext + 'proposal/billing-term-lovs',null, this.createProposalStoreService.renewalId, null, this.projectStoreService.projectData?.buyingProgram)).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.billingData = response.data.billingModels;
        this.options = this.proposalService.changeOptions(response.data.term, this.options);
          if(response.data.capitalFinancingFrequency){
            this.utilitiesService.sortArrayByDisplaySeq(response.data.capitalFinancingFrequency);
            this.capitalFinancingData = response.data.capitalFinancingFrequency;
          }
          if(this.eaService.features?.COTERM_SEPT_REL && response.data?.coTerm){
            this.cotermEndDateRangeObj = response.data.coTerm;
          }
        
      }else {
        this.disableContinueButton = true;
      }
    });
  }



  selectBillingModal(billingModel) {
    this.selectedBillingModel = billingModel;
    this.showBillingModalDrop = false;
  }

  
getCountryOfTransaction() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/country?p=' + this.projectStoreService.projectData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.countryOfTransactionArray = response.data.countries;
        this.countryOfTranscation = this.countryOfTransactionArray.find(country => country.isoCountryAlpha2 === response.data.defaultCountry);
        if (!response.data.defaultCountry) {
          this.countryOfTranscation = this.countryOfTransactionArray.find(country => country.isoCountryAlpha2 === 'US');
        }
        this.countrySearch = this.countryOfTranscation?.countryName;
      }else {
        this.disableContinueButton = true;
      }
    });
   
  }

  public selectCountryOfTransaction(selectedCountry) {
    this.countryOfTranscation = selectedCountry;
    this.showCountryDrop = false;
    this.countrySearch = this.countryOfTranscation.countryName;
  }


  public onDateSelection($event) {
    this.eaStartDate = $event;

    // set coterm min/max dates on RSD change
    if(this.eaService.features?.COTERM_SEPT_REL && !this.isChangeSubFlow){
      if(this.coTerm){
        // set cotermEndDate to subscription end date
        if(this.selectedSubscription){
          this.cotermEndDate = new Date(this.selectedSubscription.subscriptionEnd);
          this.getDuration();
        } else {
          if(this.eaStartDate && this.isCotermAdded && this.cotermEndDate){
            this.setCotermMinMaxDates(this.eaStartDate);
            this.getDuration();
          }
        }
      }
    } else {
      if (this.coTerm && this.selectedSubscription) {
        this.getDuration();
   }
    }
  }

  // method to set coterm end date on selection
  onEndDateSelection($event) {
    if(this.isUserClickedOnEndDateSelection && $event && !this.selectedSubscription){
      this.cotermEndDate = $event;
      this.isCotermAdded = true;
      this.getDuration();
    }
  }

  getPartners() { // This method is use to fetch Partners details.
    // const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/partners';
    let url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/partners';
    // if(this.eaStoreService.landingQid){
    //   url = url + '?qidEnc=' + this.eaStoreService.landingQid;
      
    // }
    url = this.appendQuoteId(url);
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      this.partnerApiCalled = true;
      if (this.vnextService.isValidResponseWithoutData(response)) {
        if (response.data){
          this.partnersArray = response.data;
          this.selectedPartner = this.partnersArray[0];
          if (this.selectedPartner.beGeoId) {
            this.checkMspAuth();
          } else {
            this.isMsea = false;
          }
        } else {
          this.isMsea = false;
          this.partnersArray = [];
        }
      }else {
        this.disableContinueButton = true;
      }
    });
  }
  setSelectedPartner(partner) {
    this.selectedPartner = partner;
    this.showPartnerDropdown = false;
    this.checkMspAuth();
  }

  createProposal() {

    if (!this.proposalName.trim()) {
      this.proposalName = '';
      return
    }

    // check if renwal id present and show confirmation modal to create proposal
    if (this.createProposalStoreService.renewalId) {
      const modalRef = this.modalVar.open(SubscriptionRenewalSelectionConfirmationComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
      modalRef.result.then((result) => {
        if (result.continue){
          this.continueToCreateProposal();
        }
      });
    } else {
      this.continueToCreateProposal();
    }
  }

  
  continueToCreateProposal() {
    if (this.isMspAuth && this.eaService.features.MSEA_REL && this.proposalStoreService.mspInfo?.managedServicesEaPartner && !this.proposalStoreService.mspInfo?.entitlementType) {
      this.showEntitledError = true;
    } else {
      this.showEntitledError = false;
      const date_ea: string = this.eaUtilitiesService.formatDateWithMonthToString(this.eaStartDate);
    
      this.isCustomerScope = (this.renewalDetails.length) ? true : false;
      const requestObject = {
        "data": {
          "projectObjId": this.projectStoreService.projectData.objId,
          "name": this.proposalName,
          "countryOfTransaction": this.countryOfTranscation.isoCountryAlpha2,
          "billingTerm" : {
            "billingModel" : this.selectedBillingModel?.id,
            "term" : this.selectedDuration,
            "rsd" : date_ea
          },
          "priceList": {
            "id" : this.selectedPriceList.priceListId,
            "name" : this.selectedPriceList.description,
          },
          "partnerInfo": {
            "beGeoName": this.selectedPartner.beGeoName,
            "beGeoId": this.selectedPartner.beGeoId
          },
          "offerType": "vNext" 
        }
      }
      if(this.eaService.features?.COTERM_SEPT_REL && this.coTerm){
        requestObject.data.billingTerm.term =  this.durationOriginalValueForCoterm ;
        if (this.selectedSubscription){
          requestObject.data.billingTerm["coterm"]  =  {endDate :this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd),subRefId:this.selectedSubscription.subRefId};
        } else { // send only cotermenddate when subscription is not selected
          requestObject.data.billingTerm["coterm"]  =  {endDate :this.eaUtilitiesService.formatDateWithMonthToString(this.cotermEndDate)};
        }
      } else {
        if (this.coTerm && this.selectedSubscription){
          requestObject.data.billingTerm.term =  this.durationOriginalValueForCoterm ;
          requestObject.data.billingTerm["coterm"]  =  {endDate :this.eaUtilitiesService.formartDateToStr(this.selectedSubscription.subscriptionEnd),subRefId:this.selectedSubscription.subRefId};
        }
      }
  
      if (this.createProposalStoreService.renewalId && this.createProposalStoreService.renewalId > 0){
        requestObject.data["renewalId"] = this.createProposalStoreService.renewalId
      } 
      
      if (this.createProposalStoreService.renewalJustification) {
        requestObject.data["subscriptionInfo"] = {
        "existingCustomer" : this.createProposalStoreService.renewalJustification ? true: false ,
        "justification" : this.createProposalStoreService.renewalJustification
        }
      }
  
      if(this.isMspAuth) {
        if (this.eaService.features.MSEA_REL) {
          requestObject.data[this.constantsService.BP_TRANSACTION_TYPE] = this.proposalStoreService.mspInfo?.managedServicesEaPartner ? this.constantsService.MSEA : this.constantsService.MSP_EA;
          if (this.proposalStoreService.mspInfo?.managedServicesEaPartner) {
            requestObject.data['mspInfo'] = {
              entitlementType: this.proposalStoreService.mspInfo.entitlementType
            }
          }
        } else {
          requestObject.data['mspInfo'] = {
            mspAuthorizedQualcodes: this.proposalStoreService.mspInfo.mspAuthorizedQualcodes,
            mspProposal: this.proposalStoreService.mspInfo.mspProposal
          }
        }
      }
  
      //if (this.eaService.isFeatureEnbled){
        requestObject.data['hybrid'] = this.createProposalStoreService.hybridSelected ? true : false;
      //}
  
      // if(this.eaStoreService.landingQid){
      //   requestObject.data['qidEnc'] =  this.eaStoreService.landingQid
        
      // } 
      // if(this.eaStoreService.landingSid){
      //   requestObject.data['sidEnc'] =  this.eaStoreService.landingSid;
       
      // }
      if(this.projectStoreService.projectData.selectedQuote){
        requestObject.data['qid'] =  this.projectStoreService.projectData.selectedQuote.quoteId;
        if(this.projectStoreService.projectData.selectedQuote.distiDetail){
          requestObject.data['sid'] =  this.projectStoreService.projectData.selectedQuote.distiDetail.sourceProfileId;
        }
      }
    
      if(this.frequencyModelDisplayName){
        requestObject.data.billingTerm['capitalFinancingFrequency'] = this.frequencyModelDisplayName;
      }
  
      if(this.eaService.features.SPNA_REL && this.eaService.isSpnaFlow && this.proposalStoreService.masterAgreementInfo?.masterAgreement && this.proposalStoreService.masterAgreementInfo?.contractNumber){
        requestObject.data['agreementContractNumber'] = this.proposalStoreService.masterAgreementInfo.contractNumber;
        // requestObject.data['hasAgreementContract'] = this.proposalStoreService.masterAgreementInfo?.masterAgreement ? true : false;
        // if(this.proposalStoreService.masterAgreementInfo?.masterAgreement && this.proposalStoreService.masterAgreementInfo?.contractNumber){
        //   requestObject.data['agreementContractNumber'] = this.proposalStoreService.masterAgreementInfo.contractNumber;
        // }
      }
      const url = this.vnextService.getAppDomainWithContext + 'proposal';
      this.proposalRestService.postApiCall(url,requestObject).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          // this.vnextService.isRoadmapShown = false;
          //   this.eaStoreService.isPePageLoad = true;
          //   this.blockUiService.spinnerConfig.noProgressBar();
          this.proposalService.customPEProgressBar();
          this.proposalStoreService.proposalData = response.data;
         // if (this.eaService.features.CHANGE_SUB_FLOW){
            this.eaStoreService.changeSubFlow = this.proposalStoreService.proposalData?.changeSubDeal ? true : false;
         // }
          this.vnextService.setDealDetailsFromProposalData(response.data); // to set dealinfo, customerInfo, partnerInfo and loccDetail from proposal data
          this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
          this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
          this.proposalStoreService.isProposalCreated = true;
        }
        
      });
    }

    
  }

  @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {       
    sessionStorage.setItem(
     'projectData',
     JSON.stringify(this.projectStoreService.projectData));
     
     if(this.createProposalStoreService.renewalId) {
       sessionStorage.setItem('renewalId', this.createProposalStoreService.renewalId.toString())
     }
     
     if(this.createProposalStoreService.renewalJustification) {
       sessionStorage.setItem('renewalJustification', this.createProposalStoreService.renewalJustification)
     }

     if(this.createProposalStoreService.hybridSelected){
      sessionStorage.setItem('hybridSelected', JSON.stringify(this.createProposalStoreService.hybridSelected));
      }
   }

   ngOnDestroy(){
     if (this.subscribers.rsdSubject){
      this.subscribers.rsdSubject.unsubscribe();
     }
    this.eaStoreService.pageContext = '';
     if(!this.backToRenewal){
      this.createProposalStoreService.renewalId = 0;
      this.createProposalStoreService.renewalJustification = '';
      this.createProposalStoreService.hybridSelected = undefined;
     }
     this.eaStoreService.editName = false;
     this.messageService.pessistErrorOnUi = false;
     this.proposalStoreService.masterAgreementInfo = {};
   }

  
   checkCountry() {
    setTimeout(() => {
      if(this.countrySearch !== this.countryOfTranscation.countryName) {
        this.countrySearch = this.countryOfTranscation.countryName;
      }
      this.showCountryDrop = false;
    }, 200)
  }

  search() {
    this.focusInput('searchCountry');
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  checkMspAuth() {
    this.isMspAuth = false;
    this.proposalStoreService.mspInfo = {};
    let url = this.vnextService.getAppDomainWithContext +'partner/' + this.selectedPartner.beGeoId +
    '/purchase-authorization?d=' + this.projectStoreService.projectData.dealInfo?.id+ '&buyingProgram=' + this.projectStoreService.projectData?.buyingProgram;
    if(this.projectStoreService.projectData.selectedQuote){
      url = url + '&qid=' + this.projectStoreService.projectData.selectedQuote.quoteId;
    } 
    if (this.isChangeSubFlow && this.projectStoreService.projectData?.subRefId) {
      url = url + '&s=' + this.projectStoreService.projectData?.subRefId;
    }
    this.eaRestService.getApiCall(url).subscribe((response:any) => {
      if(this.vnextService.isValidResponseWithData(response)) {
        this.intendedUse = response.data.intendedUseFromDeal ? response.data.intendedUseFromDeal : '';
        if (response.data?.mspInfo?.mspPartner || this.eaService.features.MSEA_REL){
          this.isMspAuth = true;
          this.proposalStoreService.mspInfo = response.data.mspInfo;
          this.isMsea = response.data.mspInfo?.managedServicesEaPartner ? true : false;
          if (this.isChangeSubFlow && this.eaService.features.MSEA_REL) {
            this.proposalStoreService.mspInfo.managedServicesEaPartner = (response.data?.subBuyingProgramTransactionType === this.constantsService.MSEA) ? true : false;
            if (response.data?.subBuyingProgramTransactionType === this.constantsService.MSEA && response.data?.subEntitlementType) {
              this.proposalStoreService.mspInfo.entitlementType = response.data?.subEntitlementType;
            }
          }
        } 
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  appendQuoteId(url:string){
   if(this.projectStoreService.projectData.selectedQuote){
      url = url + '?qid=' + this.projectStoreService.projectData.selectedQuote.quoteId;
    } 
    return url;
  }

  selectCapitalFinance(option) {
    this.selectedCapitalFinancing = option;
    this.showCapitalFinancingDrop = false;
  }
  selectOpted(){
    if(this.isChangeSubFlow){
      return;
    }
    this.showCapitalFinancingDrop = false;
    this.isFreqSelected = false;
    this.frequencyModelDisplayName = '';
  }

  capitalFrequencySelected(capitalFinance){
    if(this.isChangeSubFlow && !this.frequencyModelDisplayName){
      return;
    }
    if(capitalFinance?.id !== this.frequencyModelDisplayName){
      this.frequencyModelDisplayName = capitalFinance.id;
      this.isFreqSelected = true;
      if(this.selectedBillingModel?.id !== 'Prepaid' && !this.eaStoreService.changeSubFlow){
        this.selectedBillingModel = this.billingData[0]; 
        this.isBillingTermUpdatedForCapital = true;
      } else {
        this.isBillingTermUpdatedForCapital = false;
      }
    }
    this.showCapitalFinancingDrop = false;
  }

  getSelectedFrequencyModal() {
    if (Array.isArray(this.capitalFinancingData)) {
      this.frequencyModelDisplayName =  this.capitalFinancingData.find(capitalFinance => capitalFinance.id === this.selectedCapitalFinancing.id).id;
      this.isFreqSelected = true;
    }
    if(this.selectedBillingModel?.id !== 'Prepaid'){
      this.selectedBillingModel = this.billingData[0]; 
    }
  }

  lookUpSubscription(){
    this.proposalStoreService.openLookupSubscriptionSubj.next(true);
  }

  // set coterm dates from RSD 
  setCotermMinMaxDates(eaStartDate){
    let startDate = new Date(eaStartDate);
    startDate.setHours(0, 0, 0, 0);
    this.cotermEndDateMax = this.eaUtilitiesService.addMonthsToDate(startDate, this.cotermEndDateRangeObj?.max ? this.cotermEndDateRangeObj.max : this.constantsService.COTERM_END_DATE_MAX);
    this.cotermEndDateMin = this.eaUtilitiesService.addMonthsToDate(startDate, this.cotermEndDateRangeObj?.min ? this.cotermEndDateRangeObj.min : this.constantsService.COTERM_END_DATE_MIN);
  }

  // method to check and set if user clicks to change date
  onUserClickEndDateSelection(){
    this.isUserClickedOnEndDateSelection = true;
  }

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
    if(this.eaStartDate && this.eaService.features?.COTERM_SEPT_REL){
      this.setCotermMinMaxDates(this.eaStartDate);
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
