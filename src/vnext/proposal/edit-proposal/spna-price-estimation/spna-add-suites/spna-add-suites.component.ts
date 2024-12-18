
import { Router } from '@angular/router';
import { Component, OnInit,Input, Output, EventEmitter, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService, IEnrollmentsInfo, IBill, IAtoTier } from 'vnext/proposal/proposal-store.service';

import { EaService } from 'ea/ea.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';

import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { EaStoreService, IPhoneNumber } from 'ea/ea-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { IQuestion, PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
import { QuestionnaireService } from '../../price-estimation/questionnaire/questionnaire.service';
import { QuestionnaireStoreService } from '../../price-estimation/questionnaire/questionnaire-store.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-add-suites',
  templateUrl: './spna-add-suites.component.html',
  styleUrls: ['./spna-add-suites.component.scss']
})
export class SpnaAddSuitesComponent implements OnInit, OnDestroy {
  @Output() closeAddSuitesEvent = new EventEmitter();
  @Input()enrollment: IEnrollmentsInfo;
  @ViewChild('phoneNumberField', {
    static: false
  }) phoneNumberField: ElementRef;
   serviceInfo = false;
  swEnrollmentData: IEnrollmentsInfo;
  numberofSelectedSuite = 0;
  updatedSuitesArray = []
  selectedBill: IBill
  searchBillId: FormControl = new FormControl();
  questionsArray:Array<IQuestion>;displayQnaWindow = false;
  isPartnerLoggedIn = false;
  isBilltoIDChanged = false;
  showSelectionOptions = false;
  billDataArray = [];
  isCxREquired = true;
  showMoreDetails = false;
cxEnrollmentData: IEnrollmentsInfo;
allowServices = true;
isUserClickedOnDateSelection = false; // set when user clicks on calendar selection
expectedMaxDate: Date;
todaysDate: Date;
eaStartDate: Date;
showWarningMessage =  false;
  showErrorMessage =  false;
  isAllAttachRateAdded =  false;
  showTierDrop= false;
  isRsdUpdated = false;
  isBillToIdUpdated = false;
  datesDisabled = [];
  public subscribers: any = {};
  @Input() deeplinkForSw = false;
  @Input() deeplinkForCx = false;
  isDataLoaded = false;
  apiCount = 0
  isRsdDue = false; // set if rsd is past date 
  isCxRowPresent = false; // set if any of selected SW suite has CX present
  isRoMode = false; // set if Ro Mode
  isRsdMax90Days = false; // to set if RSD is greater than 90 days
  searchArray = ['name', 'siteUseId'];
  selectedMerakiSuitesArray = []; // add meraki suites if selected
  isEamsEligibile :boolean;
  selectedCiscoEams = true;
  invalidEmail = false;
  disableForMapping = false;
  billToTab = false;
  //localSeptRelFlag = false;

  notAllowedHybridSuiteSelection = false;

  //variables for partner contacts
  partnerContactName = '';
  partnerEmail = '';
  primaryPartner = '';
  partnerCcoId = '';
  partnerPhoneNumber = '';
  invalidBilltoID = false;
  orgIdsArr = []; // to store orgIds if present
  billToIdLookup$ = new Subject();
  displayNoBillIdMsg = false;
  selectedDistiBill: IBill;
  searchDistiBillTo = '';
  distiBillDataArray = [];
  showDistiBillToOptions = false;
  displayNoDistiBillIdMsg = false;
  showDistiAddDetails = false;
  displayNoResellerBillIdMsg = false;
  selectedResellerBill: IBill;
  searchResellerBillTo = '';
  resellerBillDataArray = [];
  showResellerBillToOptions = false;
  showResellerAddDetails = false;
  distiBillLookUp = new Subject();
  resellerBillLookUp = new Subject();
  distiLookupUrl: any;
  resellerLookupUrl: any;
  suitePurchasesInfo = false;
  learnMoreUrl = 'https://salesconnect.cisco.com/c/r/salesconnect/index.html#/program/PAGE-18166';
  @Input() isChangeSubFlow = false;
  @Input() isUpgradeFlow = false;

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
	phoneForm: FormGroup;
  phoneNumber: IPhoneNumber = {};
  billToIdRequired = false;
  totalSuites = [];
  showUpgradeTierDrop = false;
  upgradedSuitesTier = [];
  showCxUpgradeTierDrop = false;
  upgradedCxSuitesTier = [];

  isBillToIdPresent = false; // set if billtoId not present from api for change sub flow
  constructor(private vnextService: VnextService, public proposalStoreService: ProposalStoreService, public priceEstimateService: PriceEstimateService,private router: Router, public dataIdConstantsService: DataIdConstantsService,
     public questionnaireService: QuestionnaireService, public questionnaireStoreService: QuestionnaireStoreService,public renderer: Renderer2, public proposalRestService: ProposalRestService, private constantsService: ConstantsService,
    public priceEstimateStoreService : PriceEstimateStoreService, public eaService: EaService, public vnextStoreService: VnextStoreService, public utilitiesService:  UtilitiesService, public localizationService:LocalizationService, private eaUtilitiesService: EaUtilitiesService,   private blockUiService: BlockUiService, public eaStoreService:EaStoreService) { }
 
  ngOnInit(): void {
    this.checkRoMode(); 
    // if(this.proposalStoreService.proposalData.dealInfo?.subscriptionUpgradeDeal){
    //   this.isUpgradeFlow = true;
    // }
    this.priceEstimateService.getOrdIds(); // to get orgids 
    this.eamsDeliveryEligibilityCheck();  
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    }
    if(this.priceEstimateService.displayQuestionnaire){
      //this.displayQnaWindow = true;
      this.openQnAFlyout()
    } else {
      this.getSuiteDetails();
    }
    setTimeout(() => {
      this.getCxSuiteDetails();
    }, 500);
    this.resetDates(); // Set today for start date calendar 
    // after values updated subscibe to subject and set the updated 
    this.subscribers.rsdSubject = this.vnextStoreService.rsdSubject.subscribe((rsdData: any) => {
      this.expectedMaxDate = rsdData.expectedMaxDate;
      this.todaysDate = rsdData.todaysDate;
      this.eaStartDate = rsdData.eaStartDate;
      this.datesDisabled = rsdData.datesDisabled;
      // this.checkRsdForServices();
    });
    try{
   
    }catch(error){
      console.log(error);
    }

    if (this.enrollment.id === 6) {
      this.suitePurchasesInfo = true;
    }
    if (!this.isPartnerLoggedIn) {
      this.searchBillId.valueChanges.subscribe(() => {
        this.displayNoBillIdMsg = false;
        if (this.searchBillId.value.length > 2) {
          this.billToIdLookup$.next(true);
        } else {
          this.billDataArray = [];
          this.showSelectionOptions = false;
        }
      });
      this.billToIdLookup$
        .pipe(switchMap(() => {
          const url = this.eaService.getAppDomainWithContext + 'proposal/bill-to-addresses?billToId=' + this.searchBillId.value + '&wildcard=true';
          this.blockUiService.spinnerConfig.noProgressBar();
          return this.proposalRestService.getApiCall(url);
        }))
        .subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithData(response, true)) {
            this.billDataArray = response.data;
            this.showSelectionOptions = true;
          } else {
            this.billDataArray = [];
            this.showSelectionOptions = false;
            this.displayNoBillIdMsg = true;
          }
        });
    }

    this.distiBillLookUp
    .pipe(switchMap(() => {
      this.blockUiService.spinnerConfig.noProgressBar();
      return this.proposalRestService.getApiCall(this.distiLookupUrl);
    })).subscribe((response: any) => {
        if (this.eaService.isValidResponseWithData(response, true)) {
          this.distiBillDataArray = response.data;
          this.showDistiBillToOptions = true ;
        } else {
          this.distiBillDataArray = [];
          this.showDistiBillToOptions = false;
          this.displayNoDistiBillIdMsg = true;
        }

        if(this.searchDistiBillTo.length < 2) {
          this.distiBillDataArray = [];
          this.displayNoDistiBillIdMsg = false;
        }
     });

     this.resellerBillLookUp
     .pipe(switchMap(() => {
       this.blockUiService.spinnerConfig.noProgressBar();
       return this.proposalRestService.getApiCall(this.resellerLookupUrl);
     })).subscribe((response: any) => {
        if (this.eaService.isValidResponseWithData(response, true)) {
          this.resellerBillDataArray = response.data;
          this.showResellerBillToOptions = true ;
        } else {
          this.resellerBillDataArray = [];
          this.showResellerBillToOptions = false;
          this.displayNoResellerBillIdMsg = true;
        }

        if(this.searchResellerBillTo.length < 2) {
          this.resellerBillDataArray = [];
          this.displayNoResellerBillIdMsg = false;
        }
      });

    this.renderer.addClass(document.body, 'position-fixed')
  }

  close() {
    this.closeAddSuitesEvent.emit(false);
  }

  // check if proposal id readonly or view all selected
  checkRoMode(){
    this.isRoMode = false;
    if (this.proposalStoreService.isReadOnly){
      this.isRoMode = true;
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
    date = new Date(this.utilitiesService.formateDate(this.swEnrollmentData.billingTerm.rsd));
    date.setHours(0,0,0,0);
    if (date > expectedCxDate){
      this.isRsdMax90Days = true;
    }
    // disable dates from systemDate+90 days to max date
    for (let i = expectedCxDate; i < this.expectedMaxDate; i = new Date(i.setDate(i.getDate() + 1))) {
      this.datesDisabled.push(i.setHours(0, 0, 0, 0));
    }
  }
  openDropdown(suite){
    suite.showDropdown =  !suite.showDropdown;
  }

  openQnAFlyout() {
    this.apiCount++
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.enrollment.id + '&a=QNA';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.apiCount--
        if(!this.apiCount){
          this.isDataLoaded = true;
        }
          this.questionsArray = this.setQnaQuestions(response.data);
          this.questionnaireStoreService.questionsArray = this.questionsArray;
        if(!this.deeplinkForSw && !this.deeplinkForCx){
          this.displayQnaWindow = true;
        }
        this.getSuiteDetails();
      }
    });
  }

  openDrop(event, enrollment) {
    enrollment.showDropdown = true;
      if (enrollment.expanded || event.clientY + 100 <  window.innerHeight) {
        enrollment.placement = 'bottom';
      } else {
        enrollment.placement = 'top';
      }
  }

  public changeCxTierSelection(tierObj: IAtoTier, suite) {
    suite.cxTierDropdown.forEach(tier =>
      tier.selected = false
    );
    if (suite.cxUpdatedTier.name !== tierObj.name) {//remvoe desc and use name
      tierObj.selected = true;
      suite.cxUpdatedTier = tierObj;
      suite.cxSelectedTier = tierObj.name;
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed')
    this.questionnaireStoreService.questionsArray = [];
    if (this.subscribers.rsdSubject){ 
      this.subscribers.rsdSubject.unsubscribe();
    }
    if(this.priceEstimateService.displayQuestionnaire){
      this.questionnaireService.mandatoryQuestCount = 0;
      this.questionnaireService.selectedAnswerMap.clear(); 
      if(this.questionnaireService.nextLevelQuestionsMap){
        this.questionnaireService.nextLevelQuestionsMap.clear();
      }
      this.questionnaireStoreService.tierTooltipMap.clear();
      this.priceEstimateService.displayQuestionnaire = false
      this.questionnaireService.selectedScuCount = 0;
    }
    this.renderer.removeClass(document.body, 'modal-open');
  }

  getSuiteDetails(){
    this.apiCount++;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.enrollment.id + '&a=DEFINE-SUITE';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        this.apiCount--
        if(!this.apiCount){
          this.isDataLoaded = true;
        }
        this.swEnrollmentData = response.data.enrollments[0];
        
         this.getIncludedSuitesCount();
         this.setRenewalSubDataForSuite();
         if (this.deeplinkForCx && this.cxEnrollmentData.id){
          this.goToServiceInfo()
         }
      }
    });
    // this.swEnrollmentData = this.values.data.enrollments[0];
    // this.getIncludedSuitesCount()
  }

  updateSuiteInclusion(suite){
    suite.inclusion = !suite.inclusion
    if( this.enrollment.id !== 6 && suite.hasOwnProperty('notAllowedHybridRelated')){
      this.priceEstimateStoreService.hybridSuiteUpdated = true;
    }
    if(suite.inclusion){
      this.numberofSelectedSuite++;
      // check for meraki atos and not present in selectedArray
      if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && !this.selectedMerakiSuitesArray.includes(suite.ato)){
        this.selectedMerakiSuitesArray.push(suite.ato);
      }
    } else {
      this.numberofSelectedSuite--;
      // if unselection check for meraki atos and remove suite from array
      if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && this.selectedMerakiSuitesArray.includes(suite.ato)){
        const index = this.selectedMerakiSuitesArray.indexOf(suite.ato)
        if(this.selectedMerakiSuitesArray.length){
          this.selectedMerakiSuitesArray.splice(index, 1);
        }
      }
    }
  }



  getIncludedSuitesCount(){
    this.numberofSelectedSuite = 0;
    this.selectedMerakiSuitesArray = [];
    this.totalSuites = [];
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        if(!(suite.disabled || suite.notAllowedHybridRelated || suite.notAvailable)) {
          if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
            this.totalSuites.push(suite)
          }
        }
        // if(suite['desc'] === "Cisco DNA SD-WAN & Routing"){
        //     suite.notAllowedHybridRelated = true;
        // }
        if(suite?.changeSubConfig?.noMidTermPurchaseAllowed && this.isChangeSubFlow && !this.isUpgradeFlow){
          suite.inclusion = false;
        } else if((!this.enrollment.enrolled || suite.disabled) && !suite.notAllowedHybridRelated){
          suite.inclusion = suite.autoSelected
        }
        if(this.swEnrollmentData.id === 6 && suite.notAllowedHybridRelated){
            this.notAllowedHybridSuiteSelection = true;
        } 
        if(suite.inclusion && !suite.disabled){
        if (suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA){
          this.selectedMerakiSuitesArray.push(suite.ato);
        }
          this.numberofSelectedSuite++
        }
        if(!suite.ato && suite?.lowerTierAto){
          suite.ato = suite.lowerTierAto.name;
        }
        if (suite?.tiers?.length) {// check if this can be used for valid SW tier  for display 
          let tier: IAtoTier;
           let suiteAtoForSameTier:IAtoTier;;
          suite.tiers.forEach(atoTier => {            
            if(atoTier.selected){
              tier = atoTier;
            }
            if(atoTier.name === suite.ato){
              suiteAtoForSameTier = atoTier;
            }
          });
          suite['swSelectedTier']= tier ? tier : (suiteAtoForSameTier?suiteAtoForSameTier:suite.tiers[0]);
          suite['swSelectedTier'].selected = true;
          if(this.isUpgradeFlow && suite?.lowerTierAto){
            suite.tiers.forEach((tier) => {
              if(suite.ato === tier.name){ 
                suite['isSwTierUpgraded'] = true;
                suite['upgradedTier'] = tier;
              }
            })
           
          }
        }
      });
    });
    if(this.swEnrollmentData.id !==6){
        this.notAllowedHybridSuiteSelection = false;
    }
  }


  // check and set renewal subdata for suite 
  setRenewalSubDataForSuite(){
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        if (suite.renewalInfo && this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.size){
          if (!suite.renewalInfo.subscriptions){
            suite.renewalInfo.subscriptions = [];
           }
           if (suite.renewalInfo.subRefIds){
            for (let subRefId of suite.renewalInfo.subRefIds){
              if (this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.has(subRefId) && !suite.renewalInfo.subscriptions.find(data => data.subRefId === subRefId)){
                suite.renewalInfo.subscriptions.push(this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.get(subRefId));
              }
            }
           }
        }
      })
    })
  }

  isEducationInstitueSelected(tier: IAtoTier){
    if(tier.hasOwnProperty("educationInstituteOnly")){
    let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
    if(qna){
        let answer = qna.answers[0];
        if(answer.value === 'true' && tier.educationInstituteOnly){
            return true;
        } else {
           return false;
        }
    } else if(this.questionnaireStoreService.questionsArray){
      if(!this.questionnaireStoreService.isEducationInstituteSelected){
        for(let i=0;i<this.questionnaireStoreService.questionsArray.length;i++){
            if(this.questionnaireStoreService.questionsArray[i].id === this.constantsService.EDUCATION_INSTITUTE_QUESTION){
                let answers = this.questionnaireStoreService.questionsArray[i].answers;
                if(answers[0].selected){
                    this.questionnaireStoreService.isEducationInstituteSelected = true;
                    break;
                }

            }
        }
    }
    if(this.questionnaireStoreService.isEducationInstituteSelected && tier.educationInstituteOnly){
      return true;
    } else{
      return false;
    }
  }
}
    return true;
  }



  isSelectedTierValid(suite){
    if(suite.swSelectedTier && suite.swSelectedTier.hasOwnProperty("educationInstituteOnly")){
      let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
      if(qna){
          let answer = qna.answers[0];
          if(answer.id === "edu_institute_qna_n" && answer.selected && suite.swSelectedTier.educationInstituteOnly){
            let suiteTiers = suite.tiers;
            for(let i=0;i<suiteTiers.length;i++){
                if(suiteTiers[i] && !suiteTiers.hasOwnProperty("educationInstituteOnly")){
                  suite.swSelectedTier.selected = false;
                  suite.swSelectedTier = suiteTiers[i];
                  suiteTiers[i].selected = true;
                  break;
                }
            }
          } 
      } else if(this.questionnaireStoreService.questionsArray){
          for(let i=0;i<this.questionnaireStoreService.questionsArray.length;i++){
              if(this.questionnaireStoreService.questionsArray[i].id === this.constantsService.EDUCATION_INSTITUTE_QUESTION){
                  let answers = this.questionnaireStoreService.questionsArray[i].answers;
                  if(answers[0].id === "edu_institute_qna_n" && (answers[0].selected || answers[0].defaultSel)){
                    let suiteTiers = suite.tiers;
                    for(let i=0;i<suiteTiers.length;i++){
                        if(suiteTiers[i] && !suiteTiers.hasOwnProperty("educationInstituteOnly")){
                          suite.swSelectedTier.selected = false;
                          suite.swSelectedTier = suiteTiers[i];
                          suiteTiers[i].selected = true;
                          break;
                        }
                    }
                  }
                  break;
              }
          }
      }
    }
    return true;
  }
  

  goToServiceInfo() {
    // if coming to services, allow cxrequitred initially
    if (!this.isCxRowPresent){
      this.isCxREquired = true;
      this.allowServices = true;
    }
    // if(this.eaStoreService.isValidationUI){
    //   this.isCxREquired = false;
    //   this.allowServices = false;
    // }

    this.deeplinkForSw = false;
    this.deeplinkForCx = false;
    this.displayQnaWindow = false;
    this.updatedSuitesArray = [];
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        this.updatedSuitesArray.push(suite)
      });
    });
    this.serviceInfo = true;
    if (!this.swEnrollmentData.cxOptInAllowed) {
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
      return
    }
    if (this.cxEnrollmentData.pools) {
      for (let pool of this.cxEnrollmentData.pools) {
        pool['expand'] = true;
        for (let suite of pool.suites) {
          if(!this.isUpgradeFlow)
          this.setTierFromData(suite); 
          suite.cxOptIn = true;
        }
      }
      this.getCxSuitesIncluded();
      this.eaStartDate = new Date(this.utilitiesService.formateDate(this.cxEnrollmentData.billingTerm.rsd));
      this.checkRsdDue();
      this.vnextService.getMaxStartDate(this.expectedMaxDate, this.todaysDate, this.eaStartDate, this.datesDisabled, this.cxEnrollmentData.billingTerm.rsd, null ,this.enrollment.id, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id); // to get max and default start dates
      if(this.priceEstimateService.displayQuestionnaire){
        const qnaArray = [];
          this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
            qnaArray.push(value);
        });
      }
    } else {
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
    // if partnerloggedin and locc not signed don't allow services
    if (this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail.loccSigned){
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
    if (this.cxEnrollmentData.enrolled && !this.cxEnrollmentData.cxAttached && !this.isUpgradeFlow){
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
  }

  updateCxInclusion(suite){
    suite.cxOptIn = !suite.cxOptIn;
    if(!suite.cxOptIn){
      suite.cxAttachRate = 0;
    }
    this.checkIfAllAttachRateFilled(true);
  }

  goToSuites(type) {
    if (type === 'button') {
      this.serviceInfo = false;
      this.displayQnaWindow = false;
    } else if (type === 'roadMap' && (this.serviceInfo || this.billToTab)) {
      this.billToTab = false
      this.serviceInfo = false;
      this.displayQnaWindow = false;
    }


    this.updatedSuitesArray = [];
    this.resetDates();
    
    this.billToIdRequired = false;
    
  }

  backToQna(){
    this.displayQnaWindow = true;
    this.deeplinkForSw = false;
    this.deeplinkForCx = false;
    this.serviceInfo = false;
    this.updatedSuitesArray = [];
    this.resetDates();
    this.checkAndSetAnsweredQna(); // check and set selected answers for qna when coming back
  }

  public onDateSelection($event,enrollment) {
    let date: Date;
    date = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd));
    date.setHours(0,0,0,0);
    if (!$event) {
      this.eaStartDate = date;
    } else if (this.isUserClickedOnDateSelection && $event) {
      this.eaStartDate = $event;
      this.isRsdUpdated = true;
      this.isRsdDue = false;
      this.isRsdMax90Days = false;
    }
  }

  howItWorks(){
    //window.open('https://salesconnect.cisco.com/#/program/PAGE-18166');
    const url = this.vnextService.getAppDomainWithContext + 'service-registry/url?track=SALES_CONNECT&service=SPNA_PROGRAM_DETAILS'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        window.open(response.data);
      }
    });
  }

  // Set today for start date calendar  
  resetDates() {
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.todaysDate.setDate(this.todaysDate.getDate());
    this.expectedMaxDate = new Date();
    this.eaStartDate = new Date();;
    this.eaStartDate.setHours(0, 0, 0, 0);
    this.datesDisabled = [];
    this.isUserClickedOnDateSelection = false;
    this.isRsdDue = false;
  }

    // method to check and set if user clicks to change date
    onUserClickDateSelection(){
      this.isUserClickedOnDateSelection = true;
    }


  eamsDeliveryEligibilityCheck() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=EAMS-PARTNER-DELIVERY-ELIGIBILITY';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.isEamsEligibile = response.data.partnerDeliveryEligible;
      }
    });
  }


  allowNumberWithPlus(event: any) {
    return this.eaUtilitiesService.allowNumberWithPlus(event)
  }

  // check if Eams eligible and partner selected with all the details needed
  isPartnerEamsAdded() {
    return (this.isEamsEligibile && !this.selectedCiscoEams && (this.invalidEmail || !(this.primaryPartner && this.partnerContactName && this.partnerEmail) || this.phoneForm.invalid))
  }

  
  goToDocCenter(){
    this.proposalStoreService.loadCusConsentPage = true;
    this.router.navigate(['ea/project/proposal/'+ this.proposalStoreService.proposalData.objId  + '/documents']);
  }

  
showBillToData() {
  if(this.isPartnerLoggedIn) {
    this.invalidBilltoID = false;
  let url = '';
    url = this.eaService.getAppDomainWithContext + 'proposal/bill-to-addresses';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response, true)) {
        this.billDataArray = response.data;
        this.showSelectionOptions = true ;
      }
    });
  }
}

clearSearchBillTo() {
  this.searchBillId.setValue('');
  this.showSelectionOptions = false;
}
  removeBillToId(){
  
    const url = this.eaService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +  '/bill-to-info';
    this.proposalRestService.deleteApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithoutData(response, true)) {
        this.isBilltoIDChanged =  false;
        this.selectedBill =  undefined;
        this.showMoreDetails =  false;
        this.isBillToIdUpdated = false;
    }});
  }

  selectBill(bill) {
    this.isBillToIdUpdated = true;
    this.searchBillId.setValue('');
    this.showSelectionOptions =  false;
    this.selectedBill =  bill;
    this.isBilltoIDChanged =  true;
  }

  showCxInfo(){
    this.isCxREquired = !this.isCxREquired;
    this.isRsdUpdated = false;
    this.isBillToIdUpdated = false;
      if(!this.isCxREquired ){
        this.billToIdRequired = false;
      } else {
        this.checkIfAllAttachRateFilled()
      }
    
  }

  checkLocc(){
    this.allowServices = true;
    if (!this.vnextStoreService.loccDetail.loccSigned){
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
  }

  getCxSuiteDetails(){
    this.apiCount++
    this.cxEnrollmentData = {};
    this.isRsdUpdated = false;
    this.isBillToIdUpdated = false;
    this.primaryPartner = (this.proposalStoreService.proposalData.partnerInfo && this.proposalStoreService.proposalData.partnerInfo.beGeoName) ? this.proposalStoreService.proposalData.partnerInfo.beGeoName : ''; 
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.enrollment.id + '&a=DEFINE-SUITE-CX';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        this.apiCount--
        if(!this.apiCount){
          this.isDataLoaded = true;
        }
        if (response.data.enrollments[0]){
          this.cxEnrollmentData = response.data.enrollments[0];
          if(this.cxEnrollmentData.eamsDelivery){
            this.selectedCiscoEams = !this.cxEnrollmentData.eamsDelivery.partnerDeliverySelected;
            if(this.cxEnrollmentData.eamsDelivery.partnerInfo){
                this.partnerCcoId = this.cxEnrollmentData.eamsDelivery.partnerInfo.ccoId;
                this.partnerContactName = this.cxEnrollmentData.eamsDelivery.partnerInfo.partnerContactName;
                this.partnerEmail = this.cxEnrollmentData.eamsDelivery.partnerInfo.emailId;
               // this.primaryPartner = this.cxEnrollmentData.eamsDelivery.partnerInfo.primartyPartner; 
              if (this.cxEnrollmentData.eamsDelivery.partnerInfo.contactNumber) {
                // this.partnerPhoneNumber = this.cxEnrollmentData.eamsDelivery.partnerInfo.contactNumber;
                // set the phone number from customer contact
                this.preparePhoneValue(this.cxEnrollmentData.eamsDelivery.partnerInfo);
              }      
            }
        }
        }
        this.phoneForm = new FormGroup({
          phone: new FormControl(this.phoneNumber, [Validators.required])
        });
        if (response.data.billToInfo) {
          if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
            this.selectedResellerBill = response.data?.billToInfo;
            this.selectedDistiBill = response.data?.distiBillToInfo;
            this.priceEstimateStoreService.distiBID =  this.selectedDistiBill?.siteUseId;
            this.priceEstimateStoreService.resellerBID = this.selectedResellerBill?.siteUseId;
            this.isBillToIdPresent = this.selectedResellerBill && this.selectedDistiBill ? true : false;
          } else {
            this.selectedBill = response.data.billToInfo;
            this.isBillToIdPresent = true;
          }
        } else {
          this.isBillToIdPresent = false;
        }
        // this.cxEnrollmentData.billingTerm['rsdDate'] = this.getFormattedDate(this.cxEnrollmentData);
        // this.cxEnrollmentData['todaysDate'] = this.todaysDate;
        // this.setDisabledDates(this.cxEnrollmentData);
      
        if (this.deeplinkForCx && this.swEnrollmentData && this.swEnrollmentData.id) {
          this.goToServiceInfo()
        }
      }
    });
  }

  //method to check and disable continue if flooring bid conditions siffices
  checkToDisableContinueforFlooringBid() {
    if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
      if (this.selectedDistiBill || this.selectedResellerBill) {
        if ((this.selectedDistiBill?.isFlooringBid || this.selectedResellerBill?.isFlooringBid) && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)) {
          return true;
        }
        return false;
      } else if (this.selectedBill) {
        if (this.selectedBill?.isFlooringBid && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    } else if (this.selectedBill) {
      if (this.selectedBill?.isFlooringBid && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
  
  // check and set cx suites that were opted in from add suites
  getCxSuitesIncluded() {
    this.disableForMapping = false;
    this.isCxRowPresent = false;
    for (let pool of this.cxEnrollmentData.pools) {
      let cxSuitesIncludedInPool = false; // set if any of the suites in the pool included

      for (let cxSuite of pool.suites) {
        if(cxSuite.allowHwSupportOnlyPurchase){//if make disable as true in case of already purchased SW only to allow HW cx purchase.
          cxSuite.disabled  = true;
        }

        cxSuite.inclusion = false;
        this.updatedSuitesArray.forEach((swSuite) => {
          if (swSuite.inclusion && !swSuite.notAvailable && !swSuite.consentRequired) {


            if (this.isUpgradeFlow) {
              let displayCx = false;
              if(swSuite.isSwTierUpgraded){//sw upgrade start      
                if(cxSuite.tiers && cxSuite.tiers.length){//&& cxSuite.tiers.length
                  for (let tier of cxSuite.tiers) {
                    
                    if(tier.name === swSuite['upgradedTier'].name){
                      cxSuite['isSwTierUpgraded'] = true;
                      cxSuite.cxUpgradeTierMappingMissing = false;
                      cxSuite.cxUpgradeDefaultTierMissing = false;
                      cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                      cxSuite['swSelectedTier'] = swSuite['upgradedTier'];
                      if (tier['cxTierOptions']?.length) { // if no cxTierOptions -> no mapping from API hence show mapping error
                        //tier['cxTierOptions'][0]['cxUpgradeDefaultTier'] = true// remove this line 
                        let searchedTier = tier['cxTierOptions'].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier) || (cxTier.name === tier.cxSelectedTier)); 
                        if (!searchedTier) {//if no cxSelectedTier in suite from API then search for default tier
                          searchedTier = tier['cxTierOptions'].find(cxTier => (cxTier.cxUpgradeDefaultTier));
                        }
                        if (searchedTier) {
                          cxSuite['cxUpdatedTier'] = searchedTier;
                          cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(tier['cxTierOptions'])
                          cxSuite['upgradedTier'] = searchedTier
                          cxSuite['isHwTierUpgraded'] = true
                        } else {//if no default tier in API then diplay error for default tier
                          cxSuite.cxUpgradeDefaultTierMissing = true;
                          this.disableForMapping = true
                          cxSuite['cxTierDropdown'] = []
                          cxSuite['isHwTierUpgraded'] = false
                          cxSuite['upgradedTier'] = undefined
                        }
                      } else {
                        cxSuite['cxTierDropdown'] = []
                        cxSuite.cxUpgradeTierMappingMissing = true;
                        this.disableForMapping = true;
                        cxSuite['isHwTierUpgraded'] = false
                        cxSuite['upgradedTier'] = undefined
                      }
                      

                      displayCx = true;
                      this.upgradedCxSuitesTier.push(cxSuite)
                      break;
                    }
                  }
                }
                
              } else {//sw upgrade end 
                if(cxSuite.tiers){//cx upgrade with  tiers array
                  for (let tier of cxSuite.tiers) {
                    
                    if(tier.name === swSuite.lowerTierAto?.name){
                      cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                      if(swSuite.isRestored){
                        this.restoreHwTier(cxSuite)
                        cxSuite['isSwTierUpgraded'] = false;
                        cxSuite['swSelectedTier'] = undefined
                      }
                      if (tier['cxTierOptions'].length) {
                        let searchedTier = tier['cxTierOptions'].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier) || (cxTier.name === tier.cxSelectedTier));//to update for disaply if valid 
                        if (cxSuite.cxSelectedTier !== cxSuite.lowerTierAto?.name && searchedTier && !swSuite.isRestored) {
                          cxSuite['cxUpdatedTier'] = searchedTier;
                          cxSuite['upgradedTier'] = searchedTier;
                          cxSuite['isHwTierUpgraded'] = true
                        }
                        cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(tier['cxTierOptions'])
                      }
                      displayCx = true;
                      break;
                    }
                  }
                } else if (cxSuite['cxTierOptions']?.length && cxSuite.ato === swSuite.lowerTierAto?.name) { // cx upgrade with  cxTierOptions array
                  cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                  if (swSuite.isRestored) {
                    this.restoreHwTier(cxSuite)
                    cxSuite['isSwTierUpgraded'] = false;
                    cxSuite['swSelectedTier'] = undefined
                  }
                  if (cxSuite['cxTierOptions'].length) {
                    let searchedTier = cxSuite['cxTierOptions'].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier));//to update for disaply if valid 
                    if (cxSuite.cxSelectedTier !== cxSuite.lowerTierAto?.name && searchedTier && !swSuite.isRestored) {
                      cxSuite['cxUpdatedTier'] = searchedTier;
                      cxSuite['upgradedTier'] = searchedTier;
                      cxSuite['isHwTierUpgraded'] = true
                    }

                    cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(cxSuite['cxTierOptions'])
                  }
                  displayCx = true;
                }
              }
              if(swSuite.ato === cxSuite.ato){
                displayCx = true;
                if(!cxSuite['isSwTierUpgraded'] && swSuite.includedInSubscription && !cxSuite.includedInSubscription){//if SW upgraded but cx not purchased 
                  if(swSuite.isSwTierUpgraded){
                    cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                    cxSuite['swSelectedTier'] = swSuite['upgradedTier'];
                    this.upgradedCxSuitesTier.push(cxSuite)
                  } else if(swSuite.isRestored){
                    this.restoreHwTier(cxSuite)
                    cxSuite['isSwTierUpgraded'] = false;
                    cxSuite['swSelectedTier'] = undefined
                  }
                  
                }
              } 

              if (swSuite.includedInSubscription &&  displayCx) {
              
                cxSuite.inclusion = true;
                if (!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) {
                  cxSuitesIncludedInPool = true;
                  this.isCxRowPresent = true;
                  if (cxSuite.tiers) {

                    for (let tier of cxSuite.tiers) {
                      // set cxoptin from tier
                      if (tier['cxOptIn']) {
                        cxSuite.cxOptIn = tier['cxOptIn'];
                      }
                      
                    }
                  }
                }
              }
           // } // upgrade flow end
            } else {
              if (swSuite.ato === cxSuite.ato) { 
                
                cxSuite.serviceAttachMandatory = swSuite.serviceAttachMandatory;
 
                if (!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) {
                  
                  if (cxSuite.tiers) {
                    
                      cxSuite.cxSelectedTier = '';
                      cxSuite['cxTierDropdown'] = [];
                      cxSuite['cxUpdatedTier'] = undefined;
                    
                    for (let tier of cxSuite.tiers) {
                      // set cxoptin from tier
                      if (tier['cxOptIn']) {
                        cxSuite.cxOptIn = tier['cxOptIn'];
                      }
                      if (swSuite.swSelectedTier) {
                        cxSuite['swSelectedTier'] = swSuite.swSelectedTier;
                        if (tier.name === swSuite.swSelectedTier.name) {
                          if (tier['cxTierOptions'] && tier['cxTierOptions'].length) {
                            let cxSelectedTier = tier['cxTierOptions'].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier) || (cxTier.name === tier.cxSelectedTier));
                            if (!cxSelectedTier) {
                              cxSelectedTier = tier['cxTierOptions'][0];
                            }
                            cxSuite['cxUpdatedTier'] = cxSelectedTier;
                            cxSuite.cxSelectedTier = cxSelectedTier.name;
                            cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(tier['cxTierOptions'])
                          }
                          break;
                        }
                      }
 
                      else if (tier.name === cxSuite.ato) {
                        let cxSelectedTier = tier['cxTierOptions'].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier) || (cxTier.name === tier.cxSelectedTier));
                        if (!cxSelectedTier) {
                          cxSelectedTier = tier['cxTierOptions'][0];
                        }
                        cxSuite['cxUpdatedTier'] = cxSelectedTier;
                        cxSuite.cxSelectedTier = cxSelectedTier.name;
                        cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(tier['cxTierOptions'])
                        break;
                      }
                    }
                  }
                }
              
                  if(cxSuite.cxSelectedTier){
                    cxSuite.inclusion = true;
                    if(!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)){
                      cxSuitesIncludedInPool = true;
                      this.isCxRowPresent = true;
                    }
                  }
                 
             }
            }
          }
        })
      }
      pool.cxSuitesIncludedInPool = cxSuitesIncludedInPool;
    }
    // if no CXsuite selected, disable switch and hide services data
    if (!this.isCxRowPresent) {
      this.isCxREquired = false;
      this.allowServices = false;
      this.billToIdRequired = false;
    }
    //if(!this.isUpgradeFlow){
      this.checkIfAllAttachRateFilled();
    //}
  }

  setTierFromData(suite) {
    if (suite.cxTierOptions && suite.cxTierOptions.length) {
      let tier: IAtoTier;
      tier = suite.cxTierOptions.find(tier => tier.name === suite.cxSelectedTier);

      if (!tier) {
        tier = suite.cxTierOptions.find(tier => tier.name === suite.name); 
        if (!tier) {
          tier = suite.cxTierOptions[0];
        }
      }
      suite.cxUpdatedTier = tier;
      suite.cxSelectedTier = tier.name;
      suite.cxTierDropdown = this.utilitiesService.cloneObj(suite.cxTierOptions) 
    }
  }


  setDisabledDates(enrollment){
    enrollment.billingTerm['datesDisabled'] = [];
    if (enrollment.billingTerm.rsdDate < enrollment.todaysDate) {
      // check and push dates from rsd to todaysDate - 1 for disabling in calendar
      for (let i = enrollment.billingTerm.rsdDate; i < enrollment.todaysDate; i = new Date(i.setDate(i.getDate() + 1))) {
        enrollment.billingTerm['datesDisabled'].push(i.setHours(0, 0, 0, 0));
      }
      enrollment.todaysDate = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd)); // set to selected date
    }
    enrollment.billingTerm.rsdDate = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd));
    enrollment.billingTerm.rsdDate.setHours(0, 0, 0, 0);
  }

  checkAllAttachRate(suit,event) {
    if(+event.target.value > 100){
      suit.cxAttachRate = 100;
    } else {
      suit.cxAttachRate = (+event.target.value === 0) ? 0.00 : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)))
    }
    this.checkIfAllAttachRateFilled(true);
  }

    // Method to check if all attach rate provided 
    checkIfAllAttachRateFilled(userUpdate?) {

      this.isAllAttachRateAdded =  true
      let cxCount = 0;
      let isBillToRequired = false;
      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          if (suite.inclusion && (!suite.disabled || suite.allowHwSupportOnlyPurchase) && suite.cxOptIn) {
            cxCount++;
              if(!suite.cxAttachRate && (suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut) && !this.isUpgradeFlow ){
                suite.cxAttachRate = 0;
                this.isAllAttachRateAdded = false
                
              }
                if ((!this.isUpgradeFlow && suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut) || (suite.includedInSubscription && this.isUpgradeFlow)) {
                  isBillToRequired = true
                }
              
            
          }
        }
      }
      this.billToIdRequired = isBillToRequired;    
      if(!cxCount && !this.isUpgradeFlow){
        this.isAllAttachRateAdded = false
      }
        return this.isAllAttachRateAdded
    }

    getFormattedDate(enrollment) {
      let date =  new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd))
      date.setHours(0,0,0,0);
      return  date;
    }

    checkValue(event,value){
      // method to check key event and set cx rate
      
        if (!this.utilitiesService.isNumberKey(event)) {
            event.target.value = '';
        }
        if (event.target.value) {
            if (event.target.value > 100) {
                event.target.value = 100.00;
                value = 100.00;
            } else if (event.target.value < 0) {
                event.target.value = 0.00;
                value = 0.00;
            } else {
               value = +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)));
            }
        }
    
    }

  saveUpgradeData(){

    const atos = [];
    let request;

    if (this.upgradedCxSuitesTier.length) {
      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          if (suite['upgradedTier'] || suite['isSwTierUpgraded'] || suite['swSelectedTier'] ){
          let atoObj = {
            name: (suite['swSelectedTier']?.name) ? suite['swSelectedTier'].name : suite['swLowerTierAto']?.name,   //suite.ato
            selectedTier: (suite['swSelectedTier'] && suite.inclusion) ? suite['swSelectedTier'].name: undefined,
            inclusion: suite.inclusion ? true : false,
            additionalInfo: (suite.inclusion && suite['upgradedTier']) ? { "relatedCxAto": suite['upgradedTier'] ? suite['upgradedTier']['name'] : undefined } : undefined
          }
          
          if(atoObj.additionalInfo && suite.cxHwSupportAvailable){
            if(suite.cxHwSupportOptional){
              atoObj.additionalInfo["cxHwSupportOptedOut"] =  suite.cxHwSupportOptedOut;
  
            } 
 
          }
          atos.push(atoObj);
        
        }
        }
      }

      if(this.swEnrollmentData.enrolled){
        //send billToInfo and billingTerm only if they are updated
        request = {
          data: {
          enrollments: [{
            atos: atos
          }]
        }
      }
      if(!this.cxEnrollmentData.cxAttached && !this.isBillToIdUpdated){//when enrollemnt is already added & adding CX later 
        this.isBillToIdUpdated = true
      }  

        if (this.isBillToIdUpdated && this.enrollment.id !== 6) {
          if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
            request.data['billToInfo'] = this.selectedResellerBill;
            request.data['distiBillToInfo'] = this.selectedDistiBill;
          } else {
            request.data['billToInfo'] = this.selectedBill;
          }
        } 
        if (this.isRsdUpdated){
          let billingTerm = {
            rsd: ''
          }
          billingTerm.rsd = this.utilitiesService.formartDateIntoString(this.eaStartDate);
          request.data.enrollments[0]['billingTerm'] = billingTerm
        }
      } else {
        //if enrolled is false send billToInfo and billingTerm
        request = {
          data: {
           // billToInfo: this.selectedBill,
            enrollments: [
              {
                
            billingTerm: {
              rsd: this.utilitiesService.formartDateIntoString(this.eaStartDate)
            },
            atos: atos
              }
            ]
          }
        }
        if (this.enrollment.id !== 6) {
          if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
            request.data['billToInfo'] = this.selectedResellerBill;
            request.data['distiBillToInfo'] = this.selectedDistiBill;
          } else {
            request.data['billToInfo'] = this.selectedBill;
          }
        }
      }
      if(this.isEamsEligibile){
          let eamsDelivery = {
            "partnerDeliverySelected": !this.selectedCiscoEams
          };
            if(!this.selectedCiscoEams){
              eamsDelivery['partnerInfo'] = {
                  "ccoId":this.partnerCcoId,
                  "contactNumber": this.eaService.getPhoneNumber(this.contact.value.e164Number,this.contact.value.dialCode),
                  "phoneCountryCode": this.contact.value.dialCode,
                  "dialFlagCode": this.contact.value.countryCode,
                  "emailId": this.partnerEmail,
                  "partnerContactName": this.partnerContactName
              }; 
            } 
             request.data.enrollments[0]['eamsDelivery'] = eamsDelivery;         
          }
    } else {
        this.updatedSuitesArray.forEach(suite => {
          if (suite['upgradedTier'] && suite.inclusion){
            atos.push({
              name: suite['upgradedTier'].name,
              inclusion: suite.inclusion ? true : false,
              selectedTier: suite['upgradedTier'].name
            })
          }
        });
        request = {
          data: {
            enrollments: [{
              atos: atos
            }]
          }
        }
      
    }

    if(this.priceEstimateService.displayQuestionnaire){
      const qnaArray = [];
      if (this.questionnaireService.selectedAnswerMap.size){
        this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
          qnaArray.push(value);
      });
        request.data.enrollments[0]['qnas'] = qnaArray
      }
    }
    console.log(request)
    this.priceEstimateService.addSuiteEmitter.next(request);
    
  }

  saveData() {
    
    const atos = [];
    let request;

    if (this.isCxREquired) {
      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          if (!suite.disabled || suite.allowHwSupportOnlyPurchase){
          let atoObj = {
            name: suite.ato,
            selectedTier: (suite['swSelectedTier'] && suite.inclusion) ? suite['swSelectedTier'].name: undefined,
            inclusion: suite.inclusion ? true : false,
            additionalInfo: (suite.inclusion && suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
          }
          
          if(atoObj.additionalInfo && suite.cxHwSupportAvailable){
            if(suite.cxHwSupportOptional){
              atoObj.additionalInfo["cxHwSupportOptedOut"] =  suite.cxHwSupportOptedOut;
              if(!suite.cxHwSupportOptedOut){
                atoObj.additionalInfo["attachRate"] =  suite.cxAttachRate
              } else if(suite.allowHwSupportOnlyPurchase){//remove additionalInfo if sw cx is already purchased and user removes HW cx
                atoObj.additionalInfo = undefined;
              }
            } else {
              atoObj.additionalInfo["attachRate"] =  suite.cxAttachRate
            }
          }
          atos.push(atoObj);
        }
        }
      }
      if(atos.length !== this.updatedSuitesArray.length) {
        const atosId = atos.map(ato => ato.name)
         this.updatedSuitesArray.forEach((suite) =>{
           if (!suite.disabled && !atosId.includes(suite.ato)) {
            atos.push({
              name: suite.ato,
              inclusion: suite.inclusion ? true : false,
              selectedTier: (suite['swSelectedTier'] && suite.inclusion)? suite['swSelectedTier'].name: undefined
            })
           }
         })
      }
      if(this.swEnrollmentData.enrolled){
        //send billToInfo and billingTerm only if they are updated
        request = {
          data: {
          enrollments: [{
            atos: atos
          }]
        }
      }
      if(!this.cxEnrollmentData.cxAttached && !this.isBillToIdUpdated){//when enrollemnt is already added & adding CX later 
        this.isBillToIdUpdated = true
      }  

        if (this.isBillToIdUpdated && this.enrollment.id !== 6) {
          if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
            request.data['billToInfo'] = this.selectedResellerBill;
            request.data['distiBillToInfo'] = this.selectedDistiBill;
          } else {
            request.data['billToInfo'] = this.selectedBill;
          }
        } 
        if (this.isRsdUpdated){
          let billingTerm = {
            rsd: ''
          }
          billingTerm.rsd = this.utilitiesService.formartDateIntoString(this.eaStartDate);
          request.data.enrollments[0]['billingTerm'] = billingTerm
        }
      } else {
        //if enrolled is false send billToInfo and billingTerm
        request = {
          data: {
           // billToInfo: this.selectedBill,
            enrollments: [
              {
                
            billingTerm: {
              rsd: this.utilitiesService.formartDateIntoString(this.eaStartDate)
            },
            atos: atos
              }
            ]
          }
        }
        if (this.enrollment.id !== 6) {
          if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
            request.data['billToInfo'] = this.selectedResellerBill;
            request.data['distiBillToInfo'] = this.selectedDistiBill;
          } else {
            request.data['billToInfo'] = this.selectedBill;
          }
        }
      }
      if(this.isEamsEligibile){
          let eamsDelivery = {
            "partnerDeliverySelected": !this.selectedCiscoEams
          };
            if(!this.selectedCiscoEams){
              eamsDelivery['partnerInfo'] = {
                  "ccoId":this.partnerCcoId,
                  "contactNumber": this.eaService.getPhoneNumber(this.contact.value.e164Number,this.contact.value.dialCode),
                  "phoneCountryCode": this.contact.value.dialCode,
                  "dialFlagCode": this.contact.value.countryCode,
                  "emailId": this.partnerEmail,
                  "partnerContactName": this.partnerContactName
              }; 
            } 
             request.data.enrollments[0]['eamsDelivery'] = eamsDelivery;         
          }
    } else {
    //  if(!this.isUpgradeFlow){
        this.updatedSuitesArray.forEach(suite => {
          if (!suite.disabled){
            atos.push({
              name: suite.ato,
              inclusion: suite.inclusion ? true : false,
              selectedTier: (suite['swSelectedTier'] && suite.inclusion)? suite['swSelectedTier'].name: undefined
            })
          }
        });
        request = {
          data: {
            enrollments: [{
              atos: atos
            }]
            
          }
        }

    }

    if(this.priceEstimateService.displayQuestionnaire){
      const qnaArray = [];
      if (this.questionnaireService.selectedAnswerMap.size){
        this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
          qnaArray.push(value);
      });
        request.data.enrollments[0]['qnas'] = qnaArray
      }
    }
    console.log(request)
    this.priceEstimateService.addSuiteEmitter.next(request);
    // this.close();
    
  }

  suiteAtoSelection(tierObj: IAtoTier, suite) {
    suite.tiers.forEach(tier =>
      tier.selected = false
    );
    //suite.ato = tierObj.name;
    suite['swSelectedTier'] = tierObj;
    tierObj.selected = true;
  }

  // to check if rsd due 
  checkRsdDue(){
    this.isRsdDue = false;
    if (this.eaStartDate < this.todaysDate){
      this.isRsdDue = true;
    }
  }


  selectEamsDeliveryOption(deliveryOption:string){
    if(deliveryOption === 'cisco'){
        this.selectedCiscoEams = true;
    }else{
      this.selectedCiscoEams = false;
    }
  }

  emailValidation(emailId) {
    if (!emailId) {
      this.invalidEmail = false;
      return;
    }
    if (this.proposalStoreService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
    } else {
      this.invalidEmail = false;
    }
  }


  checkPhoneNumbers(event){
    
    if(event.target.value){
      let str = this.phoneNumberField.nativeElement.value.split("");
      str.forEach((item,index)=>{
        if(index!==0){
          if(item === "+"){
            str.splice(index,1);
            this.phoneNumberField.nativeElement.value =  str.join('');
          }
        }
      })
    }
  }

  // check and set selected answers into questions
  checkAndSetAnsweredQna() {
    if (this.questionnaireService.selectedAnswerMap.size) {
      this.questionnaireStoreService.questionsArray.forEach(question => {
        const value = this.questionnaireService.selectedAnswerMap.get(question.id);
        if (value) {
          let selectedAnswer = value.answers[0];
          for (let answer of question.answers) {
            answer.selected = false;
            if (question.displayType === "number") {
              answer.value = selectedAnswer.value;
              answer.selected = true;
            } else if (answer.id === selectedAnswer.id) {
              answer.selected = true;
            }
          }
        }
      });
    }
  }

 //Start Disti flow for sept release
  getDistiBillTo(text) {
    if (text.length > 2) {
      if (this.eaService.isDistiOpty) {
        this.distiLookupUrl = this.eaService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/bill-to-addresses-disti?billToId=' + text + '&wildcard=true';
      } else {
        this.distiLookupUrl = this.eaService.getAppDomainWithContext + 'proposal/' +this.proposalStoreService.proposalData.objId + '/bill-to-addresses-disti?billToId=' + text + '&wildcard=true&partnerBillToId=' + this.priceEstimateStoreService.resellerBID;
      }
      this.distiBillLookUp.next(true);
    } else {
      this.distiBillDataArray = [];
      this.showDistiBillToOptions = false;
      this.displayNoDistiBillIdMsg = false;
    }

  }

  clearSearchDistiBillTo() {
    this.searchDistiBillTo = '';
    this.showDistiBillToOptions = false;
  }

  selectDistiBill(bill) {
    this.selectedDistiBill = bill;
    this.isBillToIdUpdated = true;
    this.searchDistiBillTo = '';
    this.showDistiBillToOptions = false;
    if (this.eaService.isDistiOpty) {
      this.priceEstimateStoreService.distiBID = bill.siteUseId;
    } else {
      this.priceEstimateStoreService.distiBID = '';
    }
  }

  removeDistiBid() {
    if (this.eaService.isDistiOpty) {
      this.selectedDistiBill = undefined;
      this.selectedResellerBill = undefined;
    } else {
      this.selectedDistiBill = undefined;
    }
  }

  getResellerBillTo(text) {
    if (text.length > 2) {
      if (this.eaService.isResellerOpty) {
        this.resellerLookupUrl = this.eaService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/bill-to-addresses-reseller?billToId=' + text + '&wildcard=true';
      } else {
        this.resellerLookupUrl = this.eaService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/bill-to-addresses-reseller?billToId=' + text + '&wildcard=true&distiBillToId=' + this.priceEstimateStoreService.distiBID;
      }
      this.resellerBillLookUp.next(true);
    } else {
      this.resellerBillDataArray = [];
      this.showResellerBillToOptions = false;
      this.displayNoResellerBillIdMsg = false;
    }

  }

  clearSearchResellerBillTo() {
    this.searchResellerBillTo = '';
    this.showResellerBillToOptions = false;
  }

  selectResellerBill(bill) {
    this.selectedResellerBill = bill;
    this.isBillToIdUpdated = true;
    this.searchResellerBillTo = '';
    this.showResellerBillToOptions = false;
    if (this.eaService.isResellerOpty) {
      this.priceEstimateStoreService.resellerBID = bill.siteUseId;
    } else {
      this.priceEstimateStoreService.resellerBID = '';
    }
  }

  removeResellerBid() {
    if (this.eaService.isResellerOpty) {
      this.selectedResellerBill = undefined;
      this.selectedDistiBill = undefined;
    } else {
      this.selectedResellerBill = undefined;
    }
  }

  isBillToAdded() {
    if(!this.billToIdRequired){
      return false
    }
    if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
      if (this.selectedDistiBill && this.selectedResellerBill) {
        return false;
      } else if(this.selectedBill){
        return false;
      } else {
        return true;
      }
    } else if (this.selectedBill) {
      return false;
    } else { 
      return true;
    }
  }
  
  learnMore() {
    const url = this.learnMoreUrl;
    window.open(url);
  }

  // method to set scu count question from api
  setQnaQuestions(questions) { 
    let que;
    let fromIndex
    const toIndex = 0;
    const id = 'scuRange'
    questions.forEach(element => {
      if (element.id === 'scu_count') {
         fromIndex = questions.indexOf(element);
         element['parentId'] = id;
         element.mandatory = false;
      } 
      if (element.id === 'tier') {
        fromIndex = questions.indexOf(element);
        element['parentId'] = id
     }
    });
    que = questions.splice(fromIndex, 1)
    questions.splice(toIndex, 0, que[0])
    return questions;
  }

  // set the phone number from customer contact
  preparePhoneValue(customerContact){
    this.phoneNumber.number = customerContact.contactNumber
    this.phoneNumber.dialCode = customerContact.phoneCountryCode
    this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
    this.phoneNumber.countryCode = customerContact.dialFlagCode;
  }

  get contact(){
    return this.phoneForm.get('phone');
  }

  optionalcxHwSelected(suite){
    suite.cxHwSupportOptedOut = !suite.cxHwSupportOptedOut;
    if(suite.cxHwSupportOptedOut){
      suite.cxAttachRate = 0;
    }
    this.checkIfAllAttachRateFilled(true);
  }

  deselectAllSwSuites(){
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => suite.inclusion =false)
    })
  }

  updateAllSuite(event){
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach((suite) => {
        if (this.numberofSelectedSuite > 0 && this.numberofSelectedSuite !== this.totalSuites.length && !suite.includedInEAID) {
          event.preventDefault();
          setTimeout(() => {
          suite.inclusion = false;
          this.numberofSelectedSuite = 0;
          this.selectedMerakiSuitesArray = [];
          }, 200);
        } else {
            if (event.target.checked) {
              if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                suite.inclusion = true;
              }
              this.numberofSelectedSuite = this.totalSuites.length;
              if (suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA){
                if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                  this.selectedMerakiSuitesArray.push(suite.ato);
                } else {
                  suite.inclusion = false;
                }
              } 
            } else {
              if (!suite.includedInEAID) {
                suite.inclusion = false;
                this.numberofSelectedSuite = 0;
                this.selectedMerakiSuitesArray = [];
              }
            }
        }
        
      })
    })
  } 
  
  selectSwHigherTier(tier, suite) {
    suite.tiers.forEach(element => {
      element.selected = false;
    });
    suite['upgradedTier'] = tier;
    tier.selected = true;
    suite.isRestored = false;
    suite.isSwTierUpgraded = true;
    let swSuite = this.upgradedSuitesTier.find(swSuite => swSuite.name === suite.name);
    if(swSuite){
      swSuite['upgradedTier'] = tier;
    } else {
      this.upgradedSuitesTier.push(suite);
    }
  }

  restoreSwTier(suite) {
    suite['upgradedTier'] = undefined;
    suite.isSwTierUpgraded = false;
    suite.isRestored = true;
    suite.tiers.forEach(element => {
      element.selected = false;
    });
    if(this.upgradedSuitesTier.length){
      let tierFound = false;
      this.upgradedSuitesTier.forEach((tier) => {

        if(tier.name === suite.name) {
          this.upgradedSuitesTier.splice(suite, 1);
          tierFound = true;
        }
      })
      if(!tierFound){
        this.upgradedSuitesTier.push(suite);
        
      }
    } else {
      this.upgradedSuitesTier.push(suite);
    }

    //need to add changes to remove cx upgrade from SW  and rmove from upgradedCxSuitesTier
  }

  selectHwHigherTier(tier, suite) {
    suite.cxTierDropdown.forEach(element => {
      element.selected = false;
    });
    suite['upgradedTier'] = tier;
    tier.selected = true;
    suite.isHwTierUpgraded = true;
    let cxSuite = this.upgradedCxSuitesTier.find(cxSuite => cxSuite.name === suite.name);
    if(cxSuite){
      cxSuite['upgradedTier'] = tier;
    } else {
      this.upgradedCxSuitesTier.push(suite);
    }
  }

  restoreHwTier(suite, userAction?) {
    suite['upgradedTier'] = undefined;
    suite.cxUpgradeTierMappingMissing = false;
    suite.cxUpgradeDefaultTierMissing = false;
    if(userAction){
      this.resetLowerTierdropdown(suite);
    } else {
      suite['cxTierDropdown'] = []
    }
    suite.isHwTierUpgraded = false;
    if(suite.cxTierDropdown?.length){
      suite.cxTierDropdown.forEach(element => {
        element.selected = false;
      });
    }

    if(this.upgradedCxSuitesTier.length){
      let tierFound = false;
      this.upgradedCxSuitesTier.forEach((tier) => {

        if(tier.name === suite.name) {
          this.upgradedCxSuitesTier.splice(suite, 1);
          tierFound = true;
        }
      })
      if(!tierFound){
        this.upgradedCxSuitesTier.push(suite);
      }
    } else {
      this.upgradedCxSuitesTier.push(suite);
    }
  }

  resetLowerTierdropdown(cxSuite) {
    if (cxSuite.tiers) {//cx restore with  tiers array
      for (let tier of cxSuite.tiers) {
        if (tier.name === cxSuite['swLowerTierAto']?.name) {
          if (tier['cxTierOptions']?.length) {
            cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(tier['cxTierOptions'])
          } else {
            cxSuite['cxTierDropdown'] = []
          }
          break;
        }
      }
    } else if (cxSuite['cxTierOptions']?.length && cxSuite.ato === cxSuite['swLowerTierAto']?.name) { // cx restore with  cxTierOptions array
      cxSuite['cxTierDropdown'] = this.utilitiesService.cloneObj(cxSuite['cxTierOptions'])
    } else {
      cxSuite['cxTierDropdown'] = []
    }
  }

  openCxUpgradeDrop(event, suite) {
    this.showCxUpgradeTierDrop = true; 
    if (event.clientY + 100 <  window.innerHeight) {
      suite.placement = 'bottom';
    } else {
      suite.placement = 'top';
    }
  }

  goToBillToTab(){
    this.billToTab = true;
    this.serviceInfo = false;
  }
  backToCxPage(){
    this.billToTab = false;
    this.serviceInfo = true;
  }
}
