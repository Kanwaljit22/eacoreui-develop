import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { Router } from '@angular/router';
import { Component, OnInit,Input, Output, EventEmitter, OnDestroy, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService, IEnrollmentsInfo, IBill, IAtoTier, ICxCoverageTypes } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateStoreService, IQuestion } from '../price-estimate-store.service';
import { EaService } from 'ea/ea.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { PriceEstimateService } from '../price-estimate.service';
import { QuestionnaireStoreService } from '../questionnaire/questionnaire-store.service';
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
import { ProjectService } from 'vnext/project/project.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { MessageService } from 'vnext/commons/message/message.service';

@Component({
  selector: 'app-add-suites',
  templateUrl: './add-suites.component.html',
  styleUrls: ['./add-suites.component.scss']
})
export class AddSuitesComponent implements OnInit, OnDestroy {
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
  noDataForMigration = true;
  suiteNameArray = []// to get name of all suites in the enrollment;
  cxUpgradeRowPresent = false
  allCxSuitesMantatory = false;
  mantatoryCxSuitesSelected = false;
  indeterminateCxState = false;

  notAllowedHybridSuiteSelection = false;
  embeddedHwSupportNotAllowedForPartner = false//to disable dnx tiser selection in case of partner login and locc not signed

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
  showCxUpgradeTierDrop = false;
  upgradedCxSuitesTier = [];
  isDnxSelected = false;
  isUnxSelected = false; // set when UNX is selected
  selectedCoverageType: ICxCoverageTypes = {};
  selectedCoverageTypeForUnx: ICxCoverageTypes = {}; // set when user selects coverage type
  showCoverageTierDrop = false;
  isCXCommitSuite = false;
  isCxCommitSuiteForUnx = false; // set when user selects coverage type
  isDnxServiceMandatory = false; 
  isUnxServiceMandatory = false; // set when UNX is mandatory
  migrationData = [];
  showUpgradeSuitesTab = true;
  displayMigrateCxGrid = false

  isBillToIdPresent = false; // set if billtoId not present from api for change sub flow
  isFlooringBid: boolean = false;
  isSecurityPortfolio = false; // set if security portfolio
  isShowEduTierSelectionMsg = false; // set to show error message 
  legacyMerakiSuiteCount = 0; // set if legacy meraki suites are purchased
  legacyMerakiAlreadyPurchased = false; // set if any legacy meraki already purchased
  displayTierUpgradeTable = true;
  displaySwTierUpgradeTable = false;
  showSplunkMessage = true; 
  selectedSplunkSuitesArray = []; // add splunk suites if selected
  localFlag = true; // remove this flag and update code once MW provide feature flag...

  bonfireSuitesSelected = 0; // set when only bonfire + UNX suites selected
  bonfireMandatorySuitesCount = 0; // set for mandatory (ibFound) bonfire suites in api
  bonfireMandatorySelectedSuiteCount = 0; // set when only mandatory (ibFound) bonfire suites selected
  showMerakiErrorMessage = false; // set bonfire error message when ibfound but suite not selected

  bonfireMandatoryUnselectedSuites = []; // set when only unselected mandatory (ibFound) bonfire suites 
  showUnxMandatoryMessage = false; // set to show unxmandatory message
  showUnxMandatoryFailureMessage = false; // set to show unxmandatory message old flow
  showDnxMandatoryMessage = false; // set to show dnxmandatory message
  showDnxMandatoryFailureMessage = false; // set to show dnxmandatory message message old flow
  showUnxCxNotAvailableMessage = false; // set to show info message when unx cx has no ib found upfront
  cxIbCoverageLookupStatus: string = ''; // set the status from cx api which has upfront ib call status
  isAnyBonfirePurchasedinRc = false; // set if any of bonfore/UNX suites purchased in RC flow
  isAnyLegacyMerakiPurchasedInRc = false; // set if any of legacy meraki suites purchased in RC flow

  constructor(private vnextService: VnextService, public proposalStoreService: ProposalStoreService, public priceEstimateService: PriceEstimateService,private router: Router, public dataIdConstantsService: DataIdConstantsService, private eaStoreService: EaStoreService, private eaRestService: EaRestService,
     public questionnaireService: QuestionnaireService, public questionnaireStoreService: QuestionnaireStoreService,public renderer: Renderer2, public proposalRestService: ProposalRestService, public constantsService: ConstantsService, public projectService: ProjectService,public elementIdConstantsService: ElementIdConstantsService,
    public priceEstimateStoreService : PriceEstimateStoreService,private messageService: MessageService, public eaService: EaService, public vnextStoreService: VnextStoreService, public utilitiesService:  UtilitiesService, public localizationService:LocalizationService, private eaUtilitiesService: EaUtilitiesService, private blockUiService: BlockUiService) { }
 
  ngOnInit(): void {
    if(this.eaService.features?.CROSS_SUITE_MIGRATION_REL && this.proposalStoreService.proposalData?.dealInfo?.subscriptionUpgradeDeal){
      // set showUpgradeSuitesTab when only tier upgrade link selected from PE grid
      if(this.priceEstimateStoreService.showUpgradeSwSuitesTabSection){
        this.showUpgradeSuitesTab = true;
        this.priceEstimateStoreService.showUpgradeSwSuitesTabSection = false;
      } else {
        this.showUpgradeSuitesTab = false;
      }
    }
    if(!this.isUpgradeFlow || !this.eaService.features.CROSS_SUITE_MIGRATION_REL){
      this.displaySwTierUpgradeTable = true;
    }
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
   if(!this.eaService.features?.WIFI7_REL){
    setTimeout(() => {
      this.getCxSuiteDetails();
    }, 500);
   }
    // this.resetDates(); // Set today for start date calendar 
    // after values updated subscibe to subject and set the updated 
    // this.subscribers.rsdSubject = this.vnextStoreService.rsdSubject.subscribe((rsdData: any) => {
    //   this.expectedMaxDate = rsdData.expectedMaxDate;
    //   this.todaysDate = rsdData.todaysDate;
    //   this.eaStartDate = rsdData.eaStartDate;
    //   this.datesDisabled = rsdData.datesDisabled;
    //   // this.checkRsdForServices();
    // });
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

    if(this.eaStoreService.isValidationUI)
    {
      this.enableLegacyMerakiSuites();
    }

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
    // if (this.subscribers.rsdSubject){ 
    //   this.subscribers.rsdSubject.unsubscribe();
    // }
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
    this.priceEstimateService.isMigrateSuiteError = false;
    this.priceEstimateService.displayErrorForBlockingRules = false;
    // this.priceEstimateService.isPendingMigration = false;
  }

  getSuiteDetails(){

    this.apiCount++;
     const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.enrollment.id + '&a=DEFINE-SUITE';
     this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      //const url =  "assets/vnext/cross-suite-sw-data.json";//remove this json call with real API
   // this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        this.apiCount--

        if(!this.apiCount){
          this.isDataLoaded = true;
        }
        this.utilitiesService.sortArrayByDisplaySeq(response.data.enrollments[0].pools);  
        this.swEnrollmentData = response.data.enrollments[0];
        
       
        if(this.swEnrollmentData.id === 3){
          this.isSecurityPortfolio = true;
        } else {
          this.isSecurityPortfolio = false;
        }
        this.getAllSuitesName()
         this.getIncludedSuitesCount();
         this.setRenewalSubDataForSuite();
         if(this.eaService.features?.WIFI7_REL && this.deeplinkForCx){
          this.getSelectedCxSuiteDetails()
         } else if (!this.eaService.features?.WIFI7_REL && this.deeplinkForCx && this.cxEnrollmentData.id){
          this.goToServiceInfo()
         }
      }
    });
    // this.swEnrollmentData = this.values.data.enrollments[0];
    // this.getIncludedSuitesCount()
  }

  // to set incompatible suites on selection or onload
  setIncompatibleAtoMessage(updatedSuite, userUpdate?, manualFlip?) {
    if (userUpdate) {
      updatedSuite.suiteMessage = '';
    }
    if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
      if (updatedSuite?.incompatibleSuites) {
        let suitesRemoved = []; // push suites which are removed from selection
        this.swEnrollmentData.pools.forEach(pool => {
          pool.suites.forEach(suiteData => {
            if (updatedSuite.ato !== suiteData.ato) {
              if (updatedSuite?.incompatibleSuites.includes(suiteData.name)) {
                if (userUpdate && suiteData.inclusion && manualFlip) {
                  this.numberofSelectedSuite--;
                }
                if(updatedSuite.inclusion && (suiteData?.disabled || suiteData?.notAllowedHybridRelated)){
                  updatedSuite.inclusion = false;
                  // this.numberofSelectedSuite--;
                }
                  if (updatedSuite.inclusion || updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) {
  
                    // set suitesRemovedFor -- for which updatedSuite this suiteData was removed
                    if (!suiteData?.suitesRemovedFor) {
                      suiteData.suitesRemovedFor = [updatedSuite.desc];
                    } else if (!suiteData.suitesRemovedFor.includes(updatedSuite.desc)) {
                      suiteData.suitesRemovedFor.push(updatedSuite.desc);
                    }
                    // if (!suiteData.suiteMessage) {
                    //   suiteData.suiteMessage = updatedSuite.desc;
                    // } else {
                    //   suiteData.suiteMessage = suiteData.suiteMessage + ',' + updatedSuite.desc;
                    // }
                    if(suiteData?.suitesRemovedFor?.length){
                      suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
                    }
  
                    // push suites which are removed to suitesRemoved
                    if (suiteData.suiteMessage && suiteData.inclusion) {
                      suitesRemoved.push(suiteData.desc);
                    }
  
                    suiteData.inclusion = (updatedSuite.inclusion || updatedSuite?.notAllowedHybridRelated  || updatedSuite?.disabled) ? false : suiteData.inclusion;
  
                    // set disabledFromOtherSuite for suites which updated suite has notAllowedHybridRelated or disabled
                    if(!suiteData['disabledFromOtherSuite']){
                      suiteData['disabledFromOtherSuite'] = (updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) ? true : false;
                    }
                  } else {
                    // if updatedsuite removed -- remove from list of suites and message for removed suites
                    if (suiteData?.suiteMessage && suiteData?.suitesRemovedFor?.length) {
                      if (suiteData?.suitesRemovedFor?.length > 1) {
                        const index = suiteData?.suitesRemovedFor.indexOf(updatedSuite?.desc)
                        if (index > -1) {
                          suiteData?.suitesRemovedFor.splice(index, 1)
                        }
                        if (suiteData?.suiteMessage) {
                          suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
                        }
                      } else {
                        if(suiteData?.suitesRemovedFor?.length && suiteData?.suitesRemovedFor.includes(updatedSuite?.desc)){
                          suiteData.suiteMessage = '';
                          suiteData.suitesRemovedFor = [];
                        }
                      }
                    } else {
                      suiteData.suiteMessage = '';
                      suiteData.suitesRemovedFor = [];
                    }
                  }
              } else {
                // if suites are not present in incompatibleSuites of updatedSuite but !inclusion and suitemessage present with userupdate  -- remove suite message and make suitesremoved empty
                if (!updatedSuite?.incompatibleSuites.includes(suiteData.name) && suiteData?.incompatibleSuites && !suiteData.inclusion && suiteData?.suiteMessage && userUpdate) {
                  if (JSON.stringify(updatedSuite?.incompatibleSuites) === JSON.stringify(suiteData?.incompatibleSuites)) {
                    suiteData.suiteMessage = '';
                    suiteData.suitesRemovedFor = [];
                  }
                }
              }
            }
          });
        });
  
        // check for suites removed andconvert into string
        this.swEnrollmentData.pools.forEach(pool => {
          pool.suites.forEach(suiteData => {
            if (suitesRemoved.length && suiteData?.suitesRemovedFor?.length) {
              for (let suite of suitesRemoved) {
                // suiteData?.suitesRemovedFor.forEach(ele => {
                //   if (ele === suite) {
                //     suiteData?.suitesRemovedFor.splice(ele, 1)
                //   }
                // });
                const index = suiteData?.suitesRemovedFor.indexOf(suite);
                if(index > -1){
                  suiteData?.suitesRemovedFor.splice(index, 1)
                }
              }
              if (suiteData?.suiteMessage) {
                suiteData.suiteMessage = suiteData?.suitesRemovedFor?.length ? suiteData.suitesRemovedFor.toString() : '';
              }
            }
            if(!suiteData?.suiteMessage && suiteData['disabledFromOtherSuite'] && suiteData?.suitesRemovedFor?.length && userUpdate){
              suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
            }
            if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
              this.IncompatibleSuitesFromOtherEnrollemnt(suiteData)
            }
          });
        });
      }
    } else {
      if (updatedSuite?.incompatibleAtos) {
        let suitesRemoved = []; // push suites which are removed from selection
        this.swEnrollmentData.pools.forEach(pool => {
          pool.suites.forEach(suiteData => {
            if (updatedSuite.ato !== suiteData.ato) {
              if (updatedSuite?.incompatibleAtos.includes(suiteData.ato)) {
                if (userUpdate && suiteData.inclusion && manualFlip) {
                  this.numberofSelectedSuite--;
                }
                if(updatedSuite.inclusion && (suiteData?.disabled || suiteData?.notAllowedHybridRelated)){
                  updatedSuite.inclusion = false;
                  // this.numberofSelectedSuite--;
                }
                  if (updatedSuite.inclusion || updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) {
  
                    // set suitesRemovedFor -- for which updatedSuite this suiteData was removed
                    if (!suiteData?.suitesRemovedFor) {
                      suiteData.suitesRemovedFor = [updatedSuite.desc];
                    } else if (!suiteData.suitesRemovedFor.includes(updatedSuite.desc)) {
                      suiteData.suitesRemovedFor.push(updatedSuite.desc);
                    }
                    // if (!suiteData.suiteMessage) {
                    //   suiteData.suiteMessage = updatedSuite.desc;
                    // } else {
                    //   suiteData.suiteMessage = suiteData.suiteMessage + ',' + updatedSuite.desc;
                    // }
                    if(suiteData?.suitesRemovedFor?.length){
                      suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
                    }
  
                    // push suites which are removed to suitesRemoved
                    if (suiteData.suiteMessage && suiteData.inclusion) {
                      suitesRemoved.push(suiteData.desc);
                    }
  
                    suiteData.inclusion = (updatedSuite.inclusion || updatedSuite?.notAllowedHybridRelated  || updatedSuite?.disabled) ? false : suiteData.inclusion;
  
                    // set disabledFromOtherSuite for suites which updated suite has notAllowedHybridRelated or disabled
                    if(!suiteData['disabledFromOtherSuite']){
                      suiteData['disabledFromOtherSuite'] = (updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) ? true : false;
                    }
                  } else {
                    // if updatedsuite removed -- remove from list of suites and message for removed suites
                    if (suiteData?.suiteMessage && suiteData?.suitesRemovedFor?.length) {
                      if (suiteData?.suitesRemovedFor?.length > 1) {
                        const index = suiteData?.suitesRemovedFor.indexOf(updatedSuite?.desc)
                        if (index > -1) {
                          suiteData?.suitesRemovedFor.splice(index, 1)
                        }
                        if (suiteData?.suiteMessage) {
                          suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
                        }
                      } else {
                        if(suiteData?.suitesRemovedFor?.length && suiteData?.suitesRemovedFor.includes(updatedSuite?.desc)){
                          suiteData.suiteMessage = '';
                          suiteData.suitesRemovedFor = [];
                        }
                      }
                    } else {
                      suiteData.suiteMessage = '';
                      suiteData.suitesRemovedFor = [];
                    }
                  }
              } else {
                // if suites are not present in incompatibleAtos of updatedSuite but !inclusion and suitemessage present with userupdate  -- remove suite message and make suitesremoved empty
                if (!updatedSuite?.incompatibleAtos.includes(suiteData.ato) && suiteData?.incompatibleAtos && !suiteData.inclusion && suiteData?.suiteMessage && userUpdate) {
                  if (JSON.stringify(updatedSuite?.incompatibleAtos) === JSON.stringify(suiteData?.incompatibleAtos)) {
                    suiteData.suiteMessage = '';
                    suiteData.suitesRemovedFor = [];
                  }
                }
              }
            }
          });
        });
  
        // check for suites removed and convert into string
        this.swEnrollmentData.pools.forEach(pool => {
          pool.suites.forEach(suiteData => {
            if (suitesRemoved.length && suiteData?.suitesRemovedFor?.length) {
              for (let suite of suitesRemoved) {
                // suiteData?.suitesRemovedFor.forEach(ele => {
                //   if (ele === suite) {
                //     suiteData?.suitesRemovedFor.splice(ele, 1)
                //   }
                // });
                const index = suiteData?.suitesRemovedFor.indexOf(suite);
                if(index > -1){
                  suiteData?.suitesRemovedFor.splice(index, 1)
                }
              }
              if (suiteData?.suiteMessage) {
                suiteData.suiteMessage = suiteData?.suitesRemovedFor?.length ? suiteData.suitesRemovedFor.toString() : '';
              }
            }
            if(!suiteData?.suiteMessage && suiteData['disabledFromOtherSuite'] && suiteData?.suitesRemovedFor?.length && userUpdate){
              suiteData.suiteMessage = suiteData.suitesRemovedFor.toString();
            }
          });
        });
      }
    }
  }

  updateSuiteInclusion(suite){
    suite.inclusion = !suite.inclusion;
    // to check and set suite message on eache suite selection by checking incompatibleAtos / incompatibleSuites
    if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI))){
      this.setIncompatibleAtoMessage(suite, true, true);
      if(this.isSecurityPortfolio){
        if(suite.inclusion){
          this.numberofSelectedSuite++;
        } else {
          this.numberofSelectedSuite--;
        }
      } else {
        if( this.enrollment.id !== 6 && suite.hasOwnProperty('notAllowedHybridRelated')){
          this.priceEstimateStoreService.hybridSuiteUpdated = true;
        }
        if(suite.inclusion){
          this.numberofSelectedSuite++;
          // check for meraki atos and not present in selectedArray
          if (this.eaService.features.BONFIRE_REL) {
            if (suite?.type === this.constantsService.MERAKI && !this.selectedMerakiSuitesArray.includes(suite.ato) && suite?.type !== this.constantsService.CISCO_NETWORKING_SOLUTION) {
              this.selectedMerakiSuitesArray.push(suite.ato);
              if((!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI)){
                this.legacyMerakiSuiteCount++;
              }
            }
          } else {
            if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION && !this.selectedMerakiSuitesArray.includes(suite.ato)){
              this.selectedMerakiSuitesArray.push(suite.ato);
            }
          }

          if(this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK) && !this.selectedSplunkSuitesArray.includes(suite.ato)){
            this.selectedSplunkSuitesArray.push(suite.ato);
          }
        } else {
          this.numberofSelectedSuite--;
          // if unselection check for meraki atos and remove suite from array
          if (this.eaService.features.BONFIRE_REL) {
            if (suite?.type === this.constantsService.MERAKI && this.selectedMerakiSuitesArray.includes(suite.ato)){
              const index = this.selectedMerakiSuitesArray.indexOf(suite.ato)
              if(this.selectedMerakiSuitesArray.length){
                this.selectedMerakiSuitesArray.splice(index, 1);
                if(!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI){
                  this.legacyMerakiSuiteCount--;
                } 
                if(!this.legacyMerakiSuiteCount){
                  this.enableBonfireMerakiSuites();
                }
              }
            } 
          } else {
            if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && this.selectedMerakiSuitesArray.includes(suite.ato)){
              const index = this.selectedMerakiSuitesArray.indexOf(suite.ato)
              if(this.selectedMerakiSuitesArray.length){
                this.selectedMerakiSuitesArray.splice(index, 1);
              }
            }  
          }

          // check and remove splunk suites when deselected manually
          if (this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK) && this.selectedSplunkSuitesArray.includes(suite.ato)){
            const index = this.selectedSplunkSuitesArray.indexOf(suite.ato)
            if(this.selectedSplunkSuitesArray.length){
              this.selectedSplunkSuitesArray.splice(index, 1);
            }
          }
          
        }
      }
    } else {

    if( this.enrollment.id !== 6 && suite.hasOwnProperty('notAllowedHybridRelated')){
      this.priceEstimateStoreService.hybridSuiteUpdated = true;
    }
    if(suite.inclusion){
      this.numberofSelectedSuite++;
      // check for meraki atos and not present in selectedArray
      if (this.eaService.features.BONFIRE_REL) {
        if (suite?.type === this.constantsService.MERAKI && !this.selectedMerakiSuitesArray.includes(suite.ato) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION) {
          this.selectedMerakiSuitesArray.push(suite.ato);
          if(!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI){
            this.legacyMerakiSuiteCount++;
          }
        }
      } else {
        if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && !this.selectedMerakiSuitesArray.includes(suite.ato) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
          this.selectedMerakiSuitesArray.push(suite.ato);
        }
      }
    } else {
      this.numberofSelectedSuite--;
      // if unselection check for meraki atos and remove suite from array
      if (this.eaService.features.BONFIRE_REL) {
        if (suite?.type === this.constantsService.MERAKI && this.selectedMerakiSuitesArray.includes(suite.ato)){
          const index = this.selectedMerakiSuitesArray.indexOf(suite.ato)
          if(this.selectedMerakiSuitesArray.length){
            this.selectedMerakiSuitesArray.splice(index, 1);
            if(!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI){
              this.legacyMerakiSuiteCount--;
            } 
            if(!this.legacyMerakiSuiteCount){
              this.enableBonfireMerakiSuites();
            }
          }
        } 
      } else {
        if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID || suite.ato === this.constantsService.MERAKI_DNA) && this.selectedMerakiSuitesArray.includes(suite.ato)){
          const index = this.selectedMerakiSuitesArray.indexOf(suite.ato)
          if(this.selectedMerakiSuitesArray.length){
            this.selectedMerakiSuitesArray.splice(index, 1);
          }
        }  
      }
      
      // check and remove splunk suites when deselected manually
      if (this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK) && this.selectedSplunkSuitesArray.includes(suite.ato)){
        const index = this.selectedSplunkSuitesArray.indexOf(suite.ato)
        if(this.selectedSplunkSuitesArray.length){
          this.selectedSplunkSuitesArray.splice(index, 1);
        }
      }
    }
    }

    // check and set showMerakiErrorMessage if any bonfire suite with ibfound was not selected
    if(this.eaService.features?.WIFI7_REL && (suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION)){
      if(suite.inclusion){
        this.bonfireSuitesSelected++;
        if(suite?.ibFound && suite?.eaSuiteType === this.constantsService.BONFIRE){
          // check and remove the mandatory suites which are selected
          this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
        }
      } else {
        if(this.bonfireSuitesSelected > 0){
          this.bonfireSuitesSelected--;
        }
        if(suite?.ibFound && suite?.eaSuiteType === this.constantsService.BONFIRE && this.bonfireMandatorySelectedSuiteCount){
          this.bonfireMandatorySelectedSuiteCount--;
          // check and set the mandatory suites which are unselected
          this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
        }
      }

      if(this.bonfireSuitesSelected && (this.bonfireMandatorySelectedSuiteCount < this.bonfireMandatorySuitesCount)){
        this.showMerakiErrorMessage = true;
      } else {
        this.showMerakiErrorMessage = false;
      }
    }
  }

  checkAndSetBonfireMandatoryUnselectedSuites(suite){
    if(suite?.inclusion){
      this.bonfireMandatorySelectedSuiteCount++; // increase mandatory selcted suite count
      // check and remove the mandatory suites which are selected
      if (this.bonfireMandatoryUnselectedSuites.includes(suite.desc)){
        const index = this.bonfireMandatoryUnselectedSuites.indexOf(suite.desc)
        if(this.bonfireMandatoryUnselectedSuites.length){
          this.bonfireMandatoryUnselectedSuites.splice(index, 1);
        }
      }
    } else {
      // check and set the mandatory suites which are unselected
      if (!this.bonfireMandatoryUnselectedSuites.includes(suite.desc)){
        this.bonfireMandatoryUnselectedSuites.push(suite.desc);
      }
    }
  }

  // method to enable all bofire meraki suites if all legacy suites are unselected/ 0
  enableBonfireMerakiSuites() {
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        if(suite?.type === this.constantsService.MERAKI){
          if((suite?.eaSuiteType === this.constantsService.BONFIRE) || (suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION && this.eaService.features?.WIFI7_REL)){
            suite.isBonfireDisabled = false;
          } else if (!this.eaStoreService.isValidationUI){
            suite.isMerakiDisabled = true;
          }
        }
      })
    })
  }

  // method to enable legacy meraki suites
  enableLegacyMerakiSuites() {
    this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach(suite => {
            if(suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType === this.constantsService.MERAKI){
              suite.isMerakiDisabled = false;
            }
        })
    })
  }


  getIncludedSuitesCount(){
    this.numberofSelectedSuite = 0;
    this.selectedMerakiSuitesArray = [];
    this.selectedSplunkSuitesArray = [];
    this.totalSuites = [];

    this.swEnrollmentData.pools.forEach(pool => {
      let displayPoolForTierUpgrade = false
      this.utilitiesService.sortArrayByDisplaySeq(pool.suites); 
      pool.suites.forEach(suite => {
        if(this.eaService.features?.CROSS_SUITE_MIGRATION_REL){
          if(this.isUpgradeFlow && (suite.eligibleForUpgrade)){
            displayPoolForTierUpgrade = true
          }
          if(suite.eligibleForMigration){
            pool.eligibleForMigration = true;
            this.noDataForMigration = false;
          }
          // if(suite.pendingMigration){
          //   this.priceEstimateService.isPendingMigration = true
          // }
        }
        if(!(suite.disabled || suite.notAllowedHybridRelated || suite.notAvailable)) {
          if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed && !suite.includedInEAID)) {
            this.totalSuites.push(suite)
          }
        }
        // if(suite['desc'] === "Cisco DNA SD-WAN & Routing"){
        //     suite.notAllowedHybridRelated = true;
        // }
        if(suite?.changeSubConfig?.noMidTermPurchaseAllowed && this.isChangeSubFlow && !this.isUpgradeFlow){
          suite.inclusion = false;
        } else if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI)) && !this.swEnrollmentData.enrolled && !suite.disabled && !suite.notAllowedHybridRelated){
          // if suite was already disabled due to related suite, make inclusion false by default
          if (suite['disabledFromOtherSuite'] || suite.disabledFromOtherEnrollmentSuite) {//check
            suite.inclusion = false;
          } else if (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI) {
            suite.inclusion = suite?.autoSelected ? true : false;
          } else {
            suite.inclusion = suite?.isAtoOptedOut ? !suite?.isAtoOptedOut : suite.autoSelected;
          }
        } else if((!this.enrollment.enrolled || suite.disabled) && !suite.notAllowedHybridRelated){
          if(this.isChangeSubFlow || this.isUpgradeFlow) {
            suite.inclusion = suite?.includedInSubscription ? true : suite.autoSelected;
          } else if(this.projectService.isReturningCustomer(this.proposalStoreService.proposalData.scopeInfo)){
            suite.inclusion = suite?.includedInEAID ? true : suite.autoSelected;
          } else {
            suite.inclusion = suite.autoSelected;
          }

          // set inclusion false for the suites which are having orgidoverlap or notavailable
          if(this.eaService.features.BONFIRE_REL && suite?.inclusion && (suite?.notAvailable || suite?.isOrgIdOverlapping)){
            suite.inclusion = false;
          }
        }

        if(this.eaService.features.BONFIRE_REL && suite.inclusion && 
          (suite?.type === this.constantsService.MERAKI && ((!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI) && suite?.isMerakiDisabled) || ((suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) && suite?.isBonfireDisabled)) ){
          suite.inclusion = false; // if suite is isMerakiDisabled or isBonfireDisabled, then make it false
        }

        // check and set suitemessages/suites selection if portfolio is enrolled or changesub flow or any of suites already selected under hybrid
        if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
          if(this.eaService.features.SEC_SUITE_REL  && suite?.incompatibleSuites && suite?.incompatibleSuites.length){
            this.checkAndSetIncompatibleAtoMessage(suite, false); 
            this.IncompatibleSuitesFromOtherEnrollemnt(suite)
          }
        } else {
          if(this.eaService.features.SEC_SUITE_REL && this.isSecurityPortfolio && suite?.incompatibleAtos && suite?.incompatibleAtos.length){
            this.checkAndSetIncompatibleAtoMessage(suite, false); 
          }
        }

        if(this.swEnrollmentData.id === 6 && suite.notAllowedHybridRelated){
            this.notAllowedHybridSuiteSelection = true;
        } 

        if (suite.inclusion && !suite.disabled) {
          if (this.eaService.features.BONFIRE_REL) {
            if (suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION) {
              this.selectedMerakiSuitesArray.push(suite.ato);
              if(!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI){
                this.legacyMerakiSuiteCount++;
              }
            }
          } else {
            if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION) {
              this.selectedMerakiSuitesArray.push(suite.ato);
            }
          }

          if(this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK)){
            this.selectedSplunkSuitesArray.push(suite.ato);
          }
          this.numberofSelectedSuite++
        }

        // set legacyMerakiAlreadyPurchased and legacyMerakiSuiteCount if any of legacy meraki suites are purchased
        if(this.eaService.features.BONFIRE_REL && suite.disabled && suite?.type === this.constantsService.MERAKI && (!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI)){
          this.legacyMerakiSuiteCount++;
          this.legacyMerakiAlreadyPurchased = true;
        }

        if(!suite.ato && suite?.lowerTierAto){
          suite.ato = suite.lowerTierAto.name;
        }
        if (suite?.tiers?.length) {// check if this can be used for valid SW tier  for display 
          let tier: IAtoTier;
           let suiteAtoForSameTier:IAtoTier;
           this.utilitiesService.sortArrayByDisplaySeq(suite.tiers);
          suite.tiers.forEach(atoTier => {            
            if(atoTier.selected){
              tier = atoTier;
            }
            if(atoTier.name === suite.ato){
              suiteAtoForSameTier = atoTier;
            }
          });

          if(this.isUpgradeFlow && !suiteAtoForSameTier && suite?.lowerTierAto && (suite?.lowerTierAto.name === suite.ato) && suite.tiers.length === 1){
            suiteAtoForSameTier = suite.lowerTierAto;
          }

          suite['swSelectedTier']= tier ? tier : (suiteAtoForSameTier ? suiteAtoForSameTier : suite.tiers[0]);
          if(this.eaService.features.FIRESTORM_REL && suite['swSelectedTier']?.hasEmbeddedHwSupport && this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail?.loccSigned){//to disable dnx tiser selection in case of partner login and locc not signed
            this.embeddedHwSupportNotAllowedForPartner = true
          }
          suite['swSelectedTier'].selected = true;
          if(this.isUpgradeFlow && suite?.lowerTierAto){
            suite.tiers.forEach((tier) => {
              if(suite.ato === tier.name){ 
                suite['isSwTierUpgraded'] = true;
                suite['upgradedTier'] = tier;
              }
            })
           
          }
          if (this.eaService.features.FIRESTORM_REL) {
            suite.tiers.forEach((tier) => {
              suite['hasEmbeddedHwSupport'] = tier?.hasEmbeddedHwSupport ? tier.hasEmbeddedHwSupport : false;
              suite['cxAttachMandatory'] = tier?.serviceAttachMandatory ? tier.serviceAttachMandatory : false;
            })
          }

          // check if only edu tier present for upgrade for each suite
          if(this.isUpgradeFlow && suite.tiers.length === 1 && this.priceEstimateService.displayQuestionnaire){
            suite.isOnlyEduTierPresentForUpgrade = this.isOnlyEduTierPresentForUpgrade(suite);
          }
        }
        // check and set showMerakiErrorMessage if any bonfire suite with ibfound was not selected
        if (this.eaService.features?.WIFI7_REL) {
          if(suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION){
            if (suite.inclusion) {
              this.bonfireSuitesSelected++;
            }
            suite['cxAttachMandatory'] = suite?.serviceAttachMandatory ? suite.serviceAttachMandatory : false;
            //to disable dnx tiser selection in case of partner login and locc not 
            if(suite?.hasEmbeddedHwSupport && this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail?.loccSigned){
              this.embeddedHwSupportNotAllowedForPartner = true;
            }
          }
          if(suite?.eaSuiteType === this.constantsService.BONFIRE){
            if (!suite.disabled) {
              if (suite.inclusion) {
                this.bonfireSuitesSelected++;
              }
              if (suite?.ibFound) {
                this.bonfireMandatorySuitesCount++;
                if (suite?.inclusion) {
                  // check and remove the mandatory suites which are selected
                  this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
                } else {
                  // check and set the mandatory suites which are unselected
                  this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
                }
              }
            }
          }
          if (this.bonfireSuitesSelected && (this.bonfireMandatorySelectedSuiteCount < this.bonfireMandatorySuitesCount)) {
            this.showMerakiErrorMessage = true;
          } else {
            this.showMerakiErrorMessage = false;
          }

          // check and set if any bonfire/unx/legacy meraki suites are purchased/includedineaid in RC flow
          if(suite?.includedInEAID && suite?.disabled && !this.isChangeSubFlow && this.projectService.isReturningCustomer(this.proposalStoreService.proposalData.scopeInfo)){
            if(suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION){
              this.isAnyBonfirePurchasedinRc = true;
            } else if (suite?.type === this.constantsService.MERAKI && (!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI)){
              this.isAnyLegacyMerakiPurchasedInRc = true;
            }
          }
        }
      });
      if(displayPoolForTierUpgrade){
        pool['displayPoolForTierUpgrade'] = true
        this.displaySwTierUpgradeTable = true;
      }
    });

    // filter out suites which are disabled due to other suites (change sub or returning customer flow)
    if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI)) && this.totalSuites.length){
      this.totalSuites = this.totalSuites.filter(suite => !suite['disabledFromOtherSuite'] );
    }

    if(this.swEnrollmentData.id !==6){
        this.notAllowedHybridSuiteSelection = false;
    }

  }

  // check and set suitemessages/suites selection if portfolio is enrolled or chagesub flow or any of suites already selected under hybrid
  checkAndSetIncompatibleAtoMessage(suite, userUpdate){
    if((this.swEnrollmentData.enrolled && !suite?.notAllowedHybridRelated && !suite?.disabled && !this.isChangeSubFlow) || (suite?.notAllowedHybridRelated || suite?.disabled) || (this.swEnrollmentData.enrolled && suite?.inclusion)){
      this.setIncompatibleAtoMessage(suite, userUpdate);
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

  setEduQna(){
    let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
    if(qna){
      return qna;
    } else if (this.questionnaireStoreService.questionsArray) {
      let qnaEdu = this.questionnaireStoreService.questionsArray.find((question) => question.id === this.constantsService.EDUCATION_INSTITUTE_QUESTION);
      if(qnaEdu){
        return qnaEdu;
      }
    }
  }

  // method to check if only edu tier persent for upgrade
  checkIsOnlyEduTierPresentForUpgrade() {
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        if (suite?.tiers?.length === 1 && this.priceEstimateService.displayQuestionnaire) {// check if this can be used for valid SW tier  for display 
          // check if only edu tier present for upgrade for each suite
          suite.isOnlyEduTierPresentForUpgrade = this.isOnlyEduTierPresentForUpgrade(suite);
        }
      });
    });
  }

  // method to check and set if only edu tier persent for upgrade
  isOnlyEduTierPresentForUpgrade(suite){
    let eduQna = this.setEduQna();
    if(eduQna){
      // let answer = eduQna.answers[0];
      for(let answer of eduQna.answers){
        if(answer?.id === "edu_institute_qna_n" && (answer?.selected || answer?.defaultSel)){
          if (suite?.tiers) { // check if this can be used for valid SW tier  for display 
            let suiteTiers = suite?.tiers;
            // check if only 1 tier present in suit,  selected and educationInstituteOnly is false;
            if(suite.swSelectedTier && suiteTiers[0]?.hasOwnProperty("educationInstituteOnly")){
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  // method to check and set to show error message on qna and suites page if edu tiers selected but eduqna if false;
  checkForSelectedEduTiers(){
    let isShowEduTierSelectionMsg = false;
    let eduQna;
    let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
    if(qna){
      eduQna = qna;
    } else if (this.questionnaireStoreService.questionsArray) {
      let qnaEdu = this.questionnaireStoreService.questionsArray.find((question) => question.id === this.constantsService.EDUCATION_INSTITUTE_QUESTION);
      if(qnaEdu){
        eduQna = qnaEdu
      }
    }
    if(eduQna){
      let answer = eduQna.answers[0];
      if(answer.id === "edu_institute_qna_n" && (answer.selected || answer?.defaultSel)){
        this.swEnrollmentData.pools.forEach(pool => {
          pool.suites.forEach(suite => {
            if (suite?.tiers) {// check if this can be used for valid SW tier  for display 
              let suiteTiers = suite?.tiers;
              // check if only 1 tier present in suit,  selected and educationInstituteOnly is false;
              if((suiteTiers.length === 1) && suite.swSelectedTier && suite.swSelectedTier.hasOwnProperty("educationInstituteOnly") && suiteTiers[0].selected){
                isShowEduTierSelectionMsg = true;
              }
            }
          });
        });
      }
    }
    this.isShowEduTierSelectionMsg = isShowEduTierSelectionMsg;
    return isShowEduTierSelectionMsg;
  }

  isSelectedTierValid(suite){
    if(suite.swSelectedTier && suite.swSelectedTier.hasOwnProperty("educationInstituteOnly")){
      let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
      if(qna){
          let answer = qna.answers[0];
          if(answer.id === "edu_institute_qna_n" && (answer.selected || answer?.defaultSel) && suite.swSelectedTier.educationInstituteOnly){
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
                  if(answers[0].id === "edu_institute_qna_n" && (answers[0].selected || answers[0]?.defaultSel)){
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
  
  loadServiceInfo(){
    if(this.eaService.features?.WIFI7_REL){
      this.getSelectedCxSuiteDetails(); // add new API call 
    } else {
      this.goToServiceInfo()
    }

  }
  getSelectedCxSuiteDetails() {
    const atosArr = []
    if (this.isUpgradeFlow) {
      this.swEnrollmentData.pools.forEach(pool => {

        pool.suites.forEach(suite => { // request for to upgrade/migrate flow 
          if (suite.migrated && suite.migratedTo?.ato) {//migrate flow
            const data = {
              name: suite.ato,
              migratedTo: {
                ato: suite.migratedTo.ato,
                migrationType: suite.migratedTo.migrationType,
                selectedTier: suite.migratedTo.selectedTier
              },
              
            }
            atosArr.push(data);
          } else if(suite.isSwTierUpgraded && suite.upgradedTier?.name){//upgrade flow
            const data = {
              name: suite.ato,
              selectedTier: (suite.upgradedTier.name) 
            }
            atosArr.push(data);
          }
        });
      });
    } else {
      this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach(suite => {
          if (suite.inclusion) {
            const data = {
              name: suite.ato,
              //inclusion: true,
              selectedTier: (suite['swSelectedTier']?.name) ? suite['swSelectedTier'].name : undefined
            }
            atosArr.push(data);
          }
        });
      });
    }
    //create request end 
    const request = {data: {atos:atosArr}}
    this.apiCount++
    this.cxEnrollmentData = {};
    this.isRsdUpdated = false;
    this.isBillToIdUpdated = false;
    this.showDnxMandatoryFailureMessage = false;
    this.showUnxMandatoryFailureMessage = false;
    this.showUnxCxNotAvailableMessage = false;
    this.showUnxMandatoryMessage = false;
    this.showDnxMandatoryMessage = false;
    this.primaryPartner = (this.proposalStoreService.proposalData.partnerInfo && this.proposalStoreService.proposalData.partnerInfo.beGeoName) ? this.proposalStoreService.proposalData.partnerInfo.beGeoName : '';
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollments/' + this.enrollment.id + '/select-cx';
    this.proposalRestService.postApiCall(url,request).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.apiCount--
        if (!this.apiCount) {
          this.isDataLoaded = true;
        }
        if (response.data.enrollments[0]) {
          this.utilitiesService.sortArrayByDisplaySeq(response.data.enrollments[0].pools);
          this.cxEnrollmentData = response.data.enrollments[0];
          if (this.cxEnrollmentData.eamsDelivery) {
            this.selectedCiscoEams = !this.cxEnrollmentData.eamsDelivery.partnerDeliverySelected;
            if (this.cxEnrollmentData.eamsDelivery.partnerInfo) {
              this.partnerCcoId = this.cxEnrollmentData.eamsDelivery.partnerInfo.ccoId;
              this.partnerContactName = this.cxEnrollmentData.eamsDelivery.partnerInfo.partnerContactName;
              this.partnerEmail = this.cxEnrollmentData.eamsDelivery.partnerInfo.emailId;
              if (this.cxEnrollmentData.eamsDelivery.partnerInfo.contactNumber) {

                this.preparePhoneValue(this.cxEnrollmentData.eamsDelivery.partnerInfo);
              }
            }
          }
          if(response.data?.ibCoverageLookupStatus){
            this.cxIbCoverageLookupStatus = response.data.ibCoverageLookupStatus;
          }
          // check and set unx dnx mandatory flag old flow
          if(this.eaService.features?.WIFI7_REL && this.eaService.features?.UPFRONT_IBC){
            // set to show unx cx not available due to HW coverage not found
            if(this.cxEnrollmentData?.someCxSuitesAreNotAvailableToSelect){
              this.showUnxCxNotAvailableMessage = true;
            }
            // check when upfront ib call fails and set to show message
            if(this.cxIbCoverageLookupStatus === this.constantsService.FAILURE){
              this.showDnxMandatoryFailureMessage = true;
              this.showUnxMandatoryFailureMessage = true;
            }
            // check when upfront ib call fails and set to show message
            if(this.cxIbCoverageLookupStatus === this.constantsService.SUCCESS){
              this.showUnxMandatoryMessage = true;
              this.showDnxMandatoryMessage = true;
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
            this.priceEstimateStoreService.distiBID = this.selectedDistiBill?.siteUseId;
            this.priceEstimateStoreService.resellerBID = this.selectedResellerBill?.siteUseId;
            this.isBillToIdPresent = this.selectedResellerBill && this.selectedDistiBill ? true : false;
          } else {
            this.selectedBill = response.data.billToInfo;
            this.isBillToIdPresent = true;
          }
        } else {
          this.isBillToIdPresent = false;
        }
        //if (this.deeplinkForCx && this.swEnrollmentData && this.swEnrollmentData.id) {
        this.goToServiceInfo()
        //}
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  goToServiceInfo() {
    this.priceEstimateService.suitesMigratedToMap.clear()
    // if coming to services, allow cxrequitred initially
    if (!this.isCxRowPresent){
      this.isCxREquired = true;
      this.allowServices = true;
    }

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
    if(!this.enrollment.enrolled && this.isPartnerLoggedIn && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal && !this.vnextStoreService.loccDetail?.loccSigned ){
      //this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
      return
    }
    if (this.cxEnrollmentData.pools) {
      for (let pool of this.cxEnrollmentData.pools) {
        pool['expand'] = true;
        this.utilitiesService.sortArrayByDisplaySeq(pool.suites); 
        for (let suite of pool.suites) {
          if(!this.isUpgradeFlow)
          this.setTierFromData(suite); 
            if(!(this.isPartnerLoggedIn && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal && !this.vnextStoreService.loccDetail?.loccSigned)){// to deselect cx of newly added sw of an already enrolled portfolio
              suite.cxOptIn = true;
            }
          
        }
      }
      this.getCxSuitesIncluded();
      this.eaStartDate = new Date(this.utilitiesService.formateDate(this.cxEnrollmentData.billingTerm.rsd));
      // this.checkRsdDue();
      // this.vnextService.getMaxStartDate(this.expectedMaxDate, this.todaysDate, this.eaStartDate, this.datesDisabled, this.cxEnrollmentData.billingTerm.rsd, null ,this.enrollment.id, this.proposalStoreService.proposalData?.renewalInfo?.id, this.proposalStoreService.proposalData.id); // to get max and default start dates
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
      if (this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail.loccSigned && this.proposalStoreService.proposalData.dealInfo?.partnerDeal) {
        this.billToIdRequired = false;
        this.allowServices = false;
        this.isCxREquired = false;
      }
    
    if (this.cxEnrollmentData.enrolled && !this.cxEnrollmentData.cxAttached && !this.isUpgradeFlow && (this.eaService.features.FIRESTORM_REL && !this.isDnxSelected) && (this.eaService.features.WIFI7_REL && !this.isUnxSelected)){
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
  }

  updateCxInclusion(suite){
    suite.cxOptIn = !suite.cxOptIn;
    if(!suite.cxOptIn){
      if(this.localFlag){
        suite.cxAttachRate = undefined;
      } else {
        suite.cxAttachRate = 0;
      }
      if(this.mantatoryCxSuitesSelected && this.eaService.features.CX_MANDATORY_SEPT_REL){
        this.indeterminateCxState = true
      }
    }
    this.checkIfAllAttachRateFilled(true);
  }

  goToSuites(type) {
    this.allCxSuitesMantatory = false;
    this.mantatoryCxSuitesSelected = false;
    this.indeterminateCxState = false;
    if (type === 'button') {
      this.serviceInfo = false;
      this.displayQnaWindow = false;
      // recall the method when coming to the sw suites tab
      if(this.isUpgradeFlow){
        this.checkIsOnlyEduTierPresentForUpgrade();
      }
    } else if (type === 'roadMap' && (this.serviceInfo || this.billToTab)) {
      this.billToTab = false
      this.serviceInfo = false;
      this.displayQnaWindow = false;
    }


    this.updatedSuitesArray = [];
    // this.resetDates();
    
    this.billToIdRequired = false;
   
  }

  backToQna(){
    this.displayQnaWindow = true;
    this.deeplinkForSw = false;
    this.deeplinkForCx = false;
    this.serviceInfo = false;
    this.updatedSuitesArray = [];
    // this.resetDates();
    this.checkAndSetAnsweredQna(); // check and set selected answers for qna when coming back
  }

  // public onDateSelection($event,enrollment) {
  //   let date: Date;
  //   date = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd));
  //   date.setHours(0,0,0,0);
  //   if (!$event) {
  //     this.eaStartDate = date;
  //   } else if (this.isUserClickedOnDateSelection && $event) {
  //     this.eaStartDate = $event;
  //     this.isRsdUpdated = true;
  //     this.isRsdDue = false;
  //     this.isRsdMax90Days = false;
  //   }
  // }

  howItWorks(){
    //window.open('https://salesconnect.cisco.com/#/program/PAGE-18166');
    const url = this.vnextService.getAppDomainWithContext + 'service-registry/url?track=SALES_CONNECT&service=PROGRAM_DETAILS'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        window.open(response.data);
      }
    });
  }

  // Set today for start date calendar  
  // resetDates() {
  //   this.todaysDate = new Date();
  //   this.todaysDate.setHours(0, 0, 0, 0);
  //   this.todaysDate.setDate(this.todaysDate.getDate());
  //   this.expectedMaxDate = new Date();
  //   this.eaStartDate = new Date();;
  //   this.eaStartDate.setHours(0, 0, 0, 0);
  //   this.datesDisabled = [];
  //   this.isUserClickedOnDateSelection = false;
  //   this.isRsdDue = false;
  // }

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
        this.isFlooringBid = false;
    }});
  }

  selectBill(bill) {
    this.isBillToIdUpdated = true;
    this.searchBillId.setValue('');
    this.showSelectionOptions =  false;
    this.selectedBill =  bill;
    this.isBilltoIDChanged =  true;
  }

  checkMandatoryCx() {
    let indeterminateCxState = this.indeterminateCxState;
    if(!this.isCxREquired && this.mantatoryCxSuitesSelected){
      this.isCxREquired = true
    } else if(this.mantatoryCxSuitesSelected){ // if mantatory Cx Suites is Selected
      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          if (suite.inclusion && (!suite.disabled || suite.allowHwSupportOnlyPurchase)) {
          if(!this.indeterminateCxState && suite.cxOptIn){
            if (!suite.serviceAttachMandatory) {
              suite.cxOptIn = false;
              if(this.localFlag){
                suite.cxAttachRate = undefined;
              } else {
                suite.cxAttachRate = 0;
              }
            }
            indeterminateCxState = true
            
          } else if(!suite.cxOptIn && this.indeterminateCxState){
            suite.cxOptIn = true;
            indeterminateCxState = false
          }
        }
        }
      } // for loop end
      this.indeterminateCxState = indeterminateCxState;
    } else {
      this.isCxREquired = !this.isCxREquired;
    }
  }

  showCxInfo(){
    if(this.eaService.features.CX_MANDATORY_SEPT_REL){
      this.checkMandatoryCx()
    } else {
      this.isCxREquired = !this.isCxREquired;
    }
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
    //const url =  "assets/vnext/cross-suite-cx-data.json";//remove this json call with real API 
    //this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        this.apiCount--
        if(!this.apiCount){
          this.isDataLoaded = true;
        }
        if (response.data.enrollments[0]){
          this.utilitiesService.sortArrayByDisplaySeq(response.data.enrollments[0].pools); 
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
           /*Flooring BID restriction Error message Changes start*/
          //  let billToData = response.data.billToInfo;
          //  if(billToData?.isFlooringBid){
          //    this.isFlooringBid = billToData.isFlooringBid;
          //  }else{
          //    this.isFlooringBid = false;
          //  }
           /*Flooring BID restriction Error message Changes ends*/
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
  checkToDisableContinueforFlooringBid(){
      if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
        if (this.selectedDistiBill || this.selectedResellerBill) {
          if((this.selectedDistiBill?.isFlooringBid || this.selectedResellerBill?.isFlooringBid) && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)){
            return true;
          }
          return false;
        } else if(this.selectedBill){
          if(this.selectedBill?.isFlooringBid && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)){
            return true;
          } 
          return false;
        } else {
          return false;
        }
      } else if (this.selectedBill) {
        if(this.selectedBill?.isFlooringBid && (this.swEnrollmentData.billingTerm.billingModel !== 'Prepaid' || this.swEnrollmentData.billingTerm?.capitalFinancingFrequency)){
          return true;
        }
        return false;
      } else {
        return false;
      }
    }

  // check and set cx suites that were opted in from add suites
  getCxSuitesIncluded() {
    let displayMigrateCxGrid = false
    this.disableForMapping = false;
    this.isCxRowPresent = false;
    this.isDnxSelected = false;
    this.isUnxSelected = false;
    this.isUnxServiceMandatory = false;
    this.isDnxServiceMandatory = false;
    let allCxSuitesMantatory = true;
    if(!this.eaService.features.CX_MANDATORY_SEPT_REL){
      allCxSuitesMantatory = false;
    }
    for (let pool of this.cxEnrollmentData.pools) {
      let cxSuitesIncludedInPool = false; // set if any of the suites in the pool included
      //let cxPoolEligibleForMigration = false;
      for (let cxSuite of pool.suites) {
        if(cxSuite.allowHwSupportOnlyPurchase){//if make disable as true in case of already purchased SW only to allow HW cx purchase.
          cxSuite.disabled  = true;
        }
        cxSuite.migrated = false;
        cxSuite.migratedTo = undefined;
        cxSuite.migrationSourceAtos = undefined
        cxSuite.inclusion = false;
        this.updatedSuitesArray.forEach((swSuite) => {
          if (this.eaService.features.CROSS_SUITE_MIGRATION_REL && swSuite.ato === cxSuite.ato && swSuite.migratedTo && swSuite.migratedTo.desc) {
            if(swSuite.migratedTo?.migrationSourceAtos){
              swSuite.migratedTo.migrationSourceAtos = undefined
            }
            cxSuite.migrated = true;
            cxSuite.migratedTo = swSuite.migratedTo
            displayMigrateCxGrid = true
            cxSuite.inclusion = true;
            this.isCxRowPresent = true;
            //cxPoolEligibleForMigration = true
            this.upgradedCxSuitesTier.push(cxSuite)
            if(cxSuite.migratedTo){
              this.priceEstimateService.suitesMigratedToMap.set(cxSuite.migratedTo.desc, cxSuite.migratedTo)
            }
 
          } else {
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
                          if(swSuite.cxOptIn){
                            cxSuite.cxUpgradeTierMappingMissing = true;
                            this.disableForMapping = true;
                          }
                          cxSuite['isHwTierUpgraded'] = false
                          cxSuite['upgradedTier'] = undefined
                        }
  
  
                        displayCx = true;
                        this.upgradedCxSuitesTier.push(cxSuite)
                        break;
                      }
                    } 
                  } else {
                    // cxSuite['isSwTierUpgraded'] = true;
                    // cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                    // cxSuite['swSelectedTier'] = swSuite['upgradedTier'];
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
                        if (tier['cxTierOptions']?.length) {
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
                if (swSuite.ato === cxSuite.ato) {
                  displayCx = true;
                  // if(!swSuite.cxOptIn){
                  //   displayCx = false;
                  // }
                  if (!cxSuite['isSwTierUpgraded'] && swSuite.includedInSubscription && !cxSuite.includedInSubscription) {//if SW upgraded but cx not purchased 
                    if (swSuite.isSwTierUpgraded) {
                      cxSuite['swLowerTierAto'] = swSuite.lowerTierAto
                      cxSuite['swSelectedTier'] = swSuite['upgradedTier'];
                      this.upgradedCxSuitesTier.push(cxSuite)
                    } else if (swSuite.isRestored) {
                      this.restoreHwTier(cxSuite)
                      cxSuite['isSwTierUpgraded'] = false;
                      cxSuite['swSelectedTier'] = undefined
                    }
                  }
                } 
  
                if (swSuite.includedInSubscription &&  displayCx) {
                
                  cxSuite.inclusion = true;
                  if ( ((!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) && !this.eaService.features.CROSS_SUITE_MIGRATION_REL)
                    || (this.eaService.features.CROSS_SUITE_MIGRATION_REL && cxSuite.eligibleForUpgrade)
                  ) {
                    cxSuitesIncludedInPool = true;
                    this.cxUpgradeRowPresent = true
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
                //if cxSelectedTier then only make inclusion as true before this else closing 
                //then if inclusion is true then check below condition and if true set cxSuitesIncludedInPool and isCxRowPresent as true
                //(!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub))
                if (swSuite.ato === cxSuite.ato) { 
                  cxSuite.swSuiteInclusion = swSuite.inclusion
                  
                  // set serviceAttachMandatory from swSuite when eaService.features?.WIFI7_REL is off
                  if(!this.eaService.features?.WIFI7_REL){
                    cxSuite.serviceAttachMandatory = swSuite.serviceAttachMandatory;
                  }
   
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
                            if (this.eaService.features.FIRESTORM_REL) {
                              cxSuite['coverageTypes'] = tier?.coverageTypes ? tier.coverageTypes : [];
                              cxSuite['hasEmbeddedHwSupport'] = tier?.hasEmbeddedHwSupport ? tier.hasEmbeddedHwSupport : false;
                              cxSuite['cxAttachMandatory'] = tier?.serviceAttachMandatory ? tier.serviceAttachMandatory : false;
                              cxSuite['alaCartCoverageFound'] = tier?.cxAlacarteCoverageFound ? tier.cxAlacarteCoverageFound : false;
                              if (tier?.coverageTypes && tier?.coverageTypes.length) {
                                cxSuite['showCoverageTierDrop'] = false;
                                let selectedCoverege = tier?.coverageTypes.find(type => type.selected);
                                this.selectedCoverageType = selectedCoverege ? selectedCoverege : {};
                                this.isCXCommitSuite = selectedCoverege ? true : false;
                              }
                              // don't allow cx purchase of dnx if DNX SW suite already purchased in subscription and coming using buy more
                              // below if block should be removed after May release
                              // if(cxSuite['hasEmbeddedHwSupport'] && swSuite.includedInSubscription && this.isChangeSubFlow){
                              //   cxSuite.cxOptIn = false;
                              //   cxSuite['cxAttachMandatory'] = false;
                              //   cxSuite['DnxCxNotRequired'] = true; // set to not allow dnx cx purchase
                              // }
                            }
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
                  
                  if (cxSuite.cxSelectedTier) {
                    cxSuite.inclusion = true;
                    if (!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) {
                      cxSuitesIncludedInPool = true;
                      this.isCxRowPresent = true;
                    }
                  }

                  // check and set cxSelectedTier, alaCartCoverageFound, cxAttachMandatory for UNX
                  if (this.eaService.features.WIFI7_REL && cxSuite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
                     if (!cxSuite.cxSelectedTier && cxSuite?.cxTierOptions?.length) {
                      cxSuite['cxSelectedTier'] = cxSuite['cxTierOptions'][0];
                    }
                    if (cxSuite.cxSelectedTier) {
                      cxSuite.inclusion = true;
                      if (!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) {
                        cxSuitesIncludedInPool = true;
                        this.isCxRowPresent = true;
                      }
                    }
                    cxSuite['cxAttachMandatory'] = cxSuite?.serviceAttachMandatory ? cxSuite.serviceAttachMandatory : false;
                    cxSuite['alaCartCoverageFound'] = cxSuite?.cxAlacarteCoverageFound ? cxSuite.cxAlacarteCoverageFound : false;
                    if (cxSuite?.coverageTypes && cxSuite?.coverageTypes.length) {
                      cxSuite['showCoverageTierDrop'] = false;
                      let selectedCoveregeForUnx = cxSuite?.coverageTypes.find(type => type.selected);
                      this.selectedCoverageTypeForUnx = selectedCoveregeForUnx ? selectedCoveregeForUnx : {};
                      this.isCxCommitSuiteForUnx = selectedCoveregeForUnx ? true : false;
                    }
                  }

                  if (cxSuite.inclusion && !cxSuite.disabled && this.eaService.features.CX_MANDATORY_SEPT_REL) {
                    if (cxSuite.serviceAttachMandatory) {
                      this.mantatoryCxSuitesSelected = true
                    } else {
                      allCxSuitesMantatory = false
                    }
                  }
                  else if (cxSuite.inclusion && cxSuite.disabled && this.eaService.features.CX_MANDATORY_SEPT_REL) {
                    allCxSuitesMantatory = false
                  }
                   
               }
               
                //else condition end.
              }
              if(cxSuite['cxTierDropdown']?.length){
                this.utilitiesService.sortArrayByDisplaySeq(cxSuite['cxTierDropdown']);
              }
            } else {
              // cxSuite['swSelectedTier'] = undefined;
              if (swSuite.ato === cxSuite.ato && !swSuite.notAvailable && !swSuite.consentRequired) { 
                cxSuite.swSuiteInclusion = swSuite.inclusion
              }
            }
          }
        })

        // check and set isDnxSelected, isDnxServiceMandatory, isUnxSelected, isUnxServiceMandatory
        if (this.eaService.features.WIFI7_REL && cxSuite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
          if(cxSuite.swSuiteInclusion && !cxSuite.disabled) {
            this.isUnxSelected = true;
          }
          if(cxSuite['cxAttachMandatory'] && !cxSuite.disabled) {
            this.isUnxServiceMandatory = true;
          }
        } else {
          if (this.eaService.features.FIRESTORM_REL) {
            if(cxSuite['hasEmbeddedHwSupport'] && cxSuite.swSuiteInclusion && !cxSuite.disabled) {
              this.isDnxSelected = true;
            }
            // check and set cxAttachMandatory for DNX from suite level serviceAttachMandatory
            if(this.isDnxSelected && !cxSuite['cxAttachMandatory'] && cxSuite?.serviceAttachMandatory && this.eaService.features?.WIFI7_REL){
              cxSuite['cxAttachMandatory'] = cxSuite?.serviceAttachMandatory;
            }
            if(cxSuite['cxAttachMandatory'] && !cxSuite.disabled) {
              this.isDnxServiceMandatory = true;
            }
          }
        }
      }
      pool.cxSuitesIncludedInPool = cxSuitesIncludedInPool;
      //pool.eligibleForMigration = cxPoolEligibleForMigration
    }
    if(this.eaService.features.CX_MANDATORY_SEPT_REL){
      this.allCxSuitesMantatory = allCxSuitesMantatory;
    }
    this.displayMigrateCxGrid = displayMigrateCxGrid

    // if no CXsuite selected, disable switch and hide services data
    if((this.eaService.features.FIRESTORM_REL && this.isDnxSelected) || (this.eaService.features.WIFI7_REL && this.isUnxSelected)) {
      this.billToIdRequired = true;
      this.isCxREquired = true;
      this.allowServices = true;
    } else {
      if (!this.isCxRowPresent) {
        this.isCxREquired = false;
        this.allowServices = false;
        this.billToIdRequired = false;
      }
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


  // setDisabledDates(enrollment){
  //   enrollment.billingTerm['datesDisabled'] = [];
  //   if (enrollment.billingTerm.rsdDate < enrollment.todaysDate) {
  //     // check and push dates from rsd to todaysDate - 1 for disabling in calendar
  //     for (let i = enrollment.billingTerm.rsdDate; i < enrollment.todaysDate; i = new Date(i.setDate(i.getDate() + 1))) {
  //       enrollment.billingTerm['datesDisabled'].push(i.setHours(0, 0, 0, 0));
  //     }
  //     enrollment.todaysDate = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd)); // set to selected date
  //   }
  //   enrollment.billingTerm.rsdDate = new Date(this.utilitiesService.formateDate(enrollment.billingTerm.rsd));
  //   enrollment.billingTerm.rsdDate.setHours(0, 0, 0, 0);
  // }

  checkAllAttachRate(suit,event) {
    if(+event.target.value > 100){
      suit.cxAttachRate = 100;
    } else {
      if(this.localFlag){
        suit.cxAttachRate = (+event.target.value === 0 || event.target.value === undefined) ? undefined : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)))
      } else {
        suit.cxAttachRate = (+event.target.value === 0) ? 0.00 : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)))
      }
      
    }
    this.checkIfAllAttachRateFilled(true);
  }

    // Method to check if all attach rate provided 
    checkIfAllAttachRateFilled(userUpdate?) {

      this.isAllAttachRateAdded =  true
      let cxCount = 0;
      let isBillToRequired = false;
      let allcxSuiteSelected = true;
      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          if (this.eaService.features.WIFI7_REL && suite['hasEmbeddedHwSupport'] && suite.swSuiteInclusion && !suite.disabled) {
            this.isDnxSelected = suite.cxOptIn;
          }

          if (this.eaService.features.WIFI7_REL && !suite.disabled &&  suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
            this.isUnxSelected = suite.cxOptIn;
          }
          if (suite.inclusion && (!suite.disabled || suite.allowHwSupportOnlyPurchase)) {
            if(suite.cxOptIn){
              cxCount++;
              if(!suite.cxAttachRate && (suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut)  && !this.isUpgradeFlow){
                if(this.localFlag){
                  suite.cxAttachRate = undefined;
                } else {
                  suite.cxAttachRate = 0;
                }
                this.isAllAttachRateAdded = false
               
              }
        

              if ((!this.isUpgradeFlow && suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut) || (suite.includedInSubscription && this.isUpgradeFlow && suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut)){
                isBillToRequired = true
              }
              
            } else if (!suite.cxOptIn && this.eaService.features.CX_MANDATORY_SEPT_REL){
              allcxSuiteSelected = false;
            }
            
          }
        }
      }
      if(this.eaService.features.CX_MANDATORY_SEPT_REL && allcxSuiteSelected){
        this.indeterminateCxState = false
      }
      this.billToIdRequired = isBillToRequired;

      if(!cxCount && !this.isUpgradeFlow){
        this.isAllAttachRateAdded = false
      }
      if((this.eaService.features.FIRESTORM_REL && this.isDnxSelected) || (this.eaService.features.WIFI7_REL && this.isUnxSelected)) {
        this.billToIdRequired = true;
        this.isCxREquired = true;
        this.allowServices = true;
        if(!cxCount && (this.selectedCoverageType.desc !== undefined || this.selectedCoverageTypeForUnx?.desc !== undefined)){
          this.isAllAttachRateAdded = true
        }
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
            } else if(this.localFlag && event.target.value <= 0){
              event.target.value = undefined;
              value = undefined;
            } else if (event.target.value < 0) {
                event.target.value = 0.00;
                value = 0.00;
            } else {
               value = +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)));
            }
        }
    
    }

  saveUpgradeData() {

    const atos = [];

    let request;
    if (this.upgradedCxSuitesTier.length) {

      for (let pool of this.cxEnrollmentData.pools) {
        for (let suite of pool.suites) {
          let atoObj
          let migrateSourceAtos;

          if (suite.migrationSourceAtos && this.eaService.features.CROSS_SUITE_MIGRATION_REL) {// change migrationSourceAtos -> migratedSourceAtos....
            const migrateAtos = []
            for (let migrateAto of suite.migrationSourceAtos) {
              migrateSourceAtos = {
                atoName: migrateAto.atoName,
                migrationType: migrateAto.migrationType
              }
              migrateAtos.push(migrateSourceAtos)
            }
            atoObj = {
              name: suite.ato,
              selectedTier: (suite.migrationSourceAtos[0]?.targetAto) ? suite.migrationSourceAtos[0].targetAto : undefined,
              inclusion: suite.inclusion ? true : false,
              migrationSourceAtos: migrateAtos,
              additionalInfo: (suite.inclusion && suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
            }
            atos.push(atoObj);
          }
          else if (suite['upgradedTier'] || suite['isSwTierUpgraded'] || suite['swSelectedTier']) {
            atoObj = {
              name: (suite['swSelectedTier']?.name) ? suite['swSelectedTier'].name : suite['swLowerTierAto']?.name,   //suite.ato
              selectedTier: (suite['swSelectedTier'] && suite.inclusion) ? suite['swSelectedTier'].name : undefined,
              inclusion: suite.inclusion ? true : false,
              additionalInfo: (suite.inclusion && suite['upgradedTier']) ? { "relatedCxAto": suite['upgradedTier'] ? suite['upgradedTier']['name'] : undefined } : undefined
            }

            if (atoObj.additionalInfo && suite.cxHwSupportAvailable) {
              if (suite.cxHwSupportOptional) {
                atoObj.additionalInfo["cxHwSupportOptedOut"] = suite.cxHwSupportOptedOut;

              }

            }
            atos.push(atoObj);

          }
        }
      }

      if (atos.length !== this.updatedSuitesArray.length && this.eaService.features.CROSS_SUITE_MIGRATION_REL) {
        const atosId = atos.map(ato => ato.name)
        this.updatedSuitesArray.forEach((suite) => {
          if (suite.migratedTo && !atosId.includes(suite.migratedTo.ato)) {
            let atoObj
            let migrateSourceAtos;
            let tier;
            const migratedSuite = suite.migratedTo;
            if (migratedSuite?.migrationSourceAtos) {
              const migrateAtos = []
              for (let migrateAto of migratedSuite.migrationSourceAtos) {
                migrateSourceAtos = {
                  atoName: migrateAto.atoName,
                  migrationType: migrateAto.migrationType
                }
                tier = migrateAto.targetAto
                migrateAtos.push(migrateSourceAtos)
              }
              atoObj = {
                name: suite.migratedTo.ato,
                selectedTier: tier ? tier : undefined,
                inclusion: true,
                migrationSourceAtos: migrateAtos,
              }
              atos.push(atoObj);
            }
          }
        })
      }

      if (this.swEnrollmentData.enrolled) {
        //send billToInfo and billingTerm only if they are updated
        request = {
          data: {
            enrollments: [{
              atos: atos
            }]
          }
        }
        if (!this.cxEnrollmentData.cxAttached && !this.isBillToIdUpdated) {//when enrollemnt is already added & adding CX later 
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
        // if (this.isRsdUpdated) {
        //   let billingTerm = {
        //     rsd: ''
        //   }
        //   billingTerm.rsd = this.utilitiesService.formartDateIntoString(this.eaStartDate);
        //   request.data.enrollments[0]['billingTerm'] = billingTerm
        // }
      } else {
        //if enrolled is false send billToInfo and billingTerm
        request = {
          data: {
            // billToInfo: this.selectedBill,
            enrollments: [
              {

                // billingTerm: {
                //   rsd: this.utilitiesService.formartDateIntoString(this.eaStartDate)
                // },
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
      if (this.isEamsEligibile) {
        let eamsDelivery = {
          "partnerDeliverySelected": !this.selectedCiscoEams
        };
        if (!this.selectedCiscoEams) {
          eamsDelivery['partnerInfo'] = {
            "ccoId": this.partnerCcoId,
            "contactNumber": this.eaService.getPhoneNumber(this.contact.value.e164Number, this.contact.value.dialCode),
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
        if (suite['upgradedTier'] && suite.inclusion) {
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

    if (this.priceEstimateService.displayQuestionnaire) {
      const qnaArray = [];
      if (this.questionnaireService.selectedAnswerMap.size) {
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
            let atoObj: any = {};
            if(suite?.swSelectedTier && !suite.inclusion && suite.swSuiteInclusion){
              atoObj = {
                name: suite.ato,
                inclusion: true,
                selectedTier: suite['swSelectedTier'].name,
                additionalInfo: (suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
              }
            } else {
              atoObj = {
                name: suite.ato,
                selectedTier: (suite['swSelectedTier'] && suite.inclusion) ? suite['swSelectedTier'].name: undefined,
                inclusion: suite.inclusion ? true : false,
                additionalInfo: (suite.inclusion && suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
              }
            }
            if(atoObj.additionalInfo && suite.cxHwSupportAvailable){
              if(suite.cxHwSupportOptional){
                atoObj.additionalInfo["cxHwSupportOptedOut"] =  suite.cxHwSupportOptedOut;
                if(!suite.cxHwSupportOptedOut){
                  atoObj.additionalInfo["attachRate"] =  (suite.cxAttachRate) ? suite.cxAttachRate : 0
                } else if(suite.allowHwSupportOnlyPurchase){//remove additionalInfo if sw cx is already purchased and user removes HW cx
                  atoObj.additionalInfo = undefined;
                }
              } else {
                atoObj.additionalInfo["attachRate"] =  (suite.cxAttachRate) ? suite.cxAttachRate : 0
              }
            }
            if (this.eaService.features.FIRESTORM_REL) {
               if(suite.inclusion && suite?.tiers) {
                for (let tier of suite.tiers) {
                     if (tier.name === suite.swSelectedTier.name && tier?.coverageTypes && atoObj.additionalInfo) {
                      atoObj.additionalInfo["cxCoverageType"] = this.selectedCoverageType.name;
                    }
                }
               }
            }

            // check and set selected coveragetype for unx
            if (this.eaService.features.WIFI7_REL) {
              if(suite.inclusion && suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
                if (suite?.coverageTypes && atoObj.additionalInfo) {
                  atoObj.additionalInfo["cxCoverageType"] = this.selectedCoverageTypeForUnx.name;
                }
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
        // if (this.isRsdUpdated){
        //   let billingTerm = {
        //     rsd: ''
        //   }
        //   billingTerm.rsd = this.utilitiesService.formartDateIntoString(this.eaStartDate);
        //   request.data.enrollments[0]['billingTerm'] = billingTerm
        // }
      } else {
        //if enrolled is false send billToInfo and billingTerm
        request = {
          data: {
           // billToInfo: this.selectedBill,
            enrollments: [
              {
                
            // billingTerm: {
            //   rsd: this.utilitiesService.formartDateIntoString(this.eaStartDate)
            // },
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
    if(suite['swSelectedTier']?.hasEmbeddedHwSupport && this.embeddedHwSupportNotAllowedForPartner && this.eaService.features.FIRESTORM_REL){
      this.embeddedHwSupportNotAllowedForPartner = false;
    }
    suite['swSelectedTier'] = tierObj;
    tierObj.selected = true;
    if(tierObj.hasEmbeddedHwSupport && this.eaService.features.FIRESTORM_REL){
      if(this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail?.loccSigned){
        this.embeddedHwSupportNotAllowedForPartner = true;
      } else {
        this.embeddedHwSupportNotAllowedForPartner = false;
      }
      
    }
  }

  // to check if rsd due 
  // checkRsdDue(){
  //   this.isRsdDue = false;
  //   if (this.eaStartDate < this.todaysDate){
  //     this.isRsdDue = true;
  //   }
  // }


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
      if(this.localFlag){
        suite.cxAttachRate = undefined;
      } else {
        suite.cxAttachRate = 0;
      }
    }
    this.checkIfAllAttachRateFilled(true);
  }

  deselectAllSwSuites(){
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => suite.inclusion =false)
    })
  }

  updateAllSuite(event){
    if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI))){
      this.updateAllSuiteForSecurity(event); // call this method to update all suite if feature flag if on and security portfolio
    } else {
      this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach((suite) => {
          if (this.numberofSelectedSuite > 0 && this.numberofSelectedSuite !== this.totalSuites.length) {
            event.preventDefault();
            this.totalSuites.forEach((atos) => {
                if (suite.ato === atos.ato) {
                  setTimeout(() => {
                    suite.inclusion = false;
                    this.numberofSelectedSuite = 0;
                    this.selectedMerakiSuitesArray = [];
                    this.selectedSplunkSuitesArray = [];
                    // reset counts for bonfire
                    if (this.eaService.features?.WIFI7_REL) {
                      this.bonfireMandatorySelectedSuiteCount = 0;
                      this.bonfireSuitesSelected = 0;
                      this.showMerakiErrorMessage = false;
                    }
                    }, 200);
                }
            })
           
          } else {
              if (event.target.checked) {
                if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                  suite.inclusion = true;
                }
                
                this.numberofSelectedSuite = this.totalSuites.length;
                if (this.eaService.features.BONFIRE_REL) {
                  if (suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                    if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                      this.selectedMerakiSuitesArray.push(suite.ato);
                    } else {
                      suite.inclusion = false;
                    }
                  } 
                } else {
                  if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                    if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                      this.selectedMerakiSuitesArray.push(suite.ato);
                    } else {
                      suite.inclusion = false;
                    }
                  } 
                }

                if(this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK)){
                  this.selectedSplunkSuitesArray.push(suite.ato);
                }

                // check and set bonfire meraki suites count 
                if(this.eaService.features?.WIFI7_REL){
                  if(!suite.disabled && (suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION)){
                    if(suite.inclusion){
                      this.bonfireSuitesSelected++;
                      if(suite?.ibFound && suite?.eaSuiteType === this.constantsService.BONFIRE) {
                        // check and remove the mandatory suites which are selected
                        this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
                      }
                    }
                  }
                  this.showMerakiErrorMessage = false;
                }
              } else {
                if (!suite.includedInEAID) {
                  suite.inclusion = false;
                  suite.suiteMessage = '';
                  this.numberofSelectedSuite = 0;
                  this.selectedMerakiSuitesArray = [];
                  this.selectedSplunkSuitesArray = [];
                  // reset counts for bonfire
                  if(this.eaService.features?.WIFI7_REL){
                    this.bonfireMandatorySelectedSuiteCount = 0;
                    this.bonfireSuitesSelected = 0;
                    this.showMerakiErrorMessage = false;
                  }
                }
              }
          }
          
        })
      })
    }
  } 
  
  // call this method for sec suite release flow
  updateAllSuiteForSecurity(event){
    if (this.numberofSelectedSuite > 0 && this.numberofSelectedSuite !== this.totalSuites.length) {
      this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach((suite) => {
          event.preventDefault();
          this.totalSuites.forEach((atos) => {
              if (suite.ato === atos.ato) {
                setTimeout(() => {
                  suite.inclusion = false;
                  if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
                    if(this.eaService.features.SEC_SUITE_REL  && suite?.incompatibleSuites && suite?.incompatibleSuites.length){ // set atos optout which has incompatibleatos
                      suite.suiteMessage = '';
                      if(suite.disabledFromOtherEnrollmentSuite){
                        suite.suiteMessage = suite.alreadySelectedIncompatibleSuites.toString();
                      }
                      suite.suitesRemovedFor = [];
                    }
                  } else {
                    if(this.eaService.features.SEC_SUITE_REL && this.isSecurityPortfolio && suite?.incompatibleAtos && suite?.incompatibleAtos.length){ // set atos optout which has incompatibleatos
                      suite.suiteMessage = '';
                      suite.suitesRemovedFor = [];
                    }
                  }
                  this.numberofSelectedSuite = 0;
                  this.selectedMerakiSuitesArray = [];
                  this.selectedSplunkSuitesArray = [];
                  // if legacyMerakiAlreadyPurchased is true, then set legacyMerakiSuiteCount to 0
                  if(!this.legacyMerakiAlreadyPurchased && this.eaService.features.BONFIRE_REL){
                    this.legacyMerakiSuiteCount = 0;
                  }
                  // reset counts for bonfire
                  if(this.eaService.features?.WIFI7_REL){
                    this.bonfireMandatorySelectedSuiteCount = 0;
                    this.bonfireSuitesSelected = 0;
                    this.showMerakiErrorMessage = false;
                  }
                  }, 200);
              }
          })
        })
      })

      // legacyMerakiSuiteCount is 0 allow bonfire meraki selection
      setTimeout(() => {
        if(!this.legacyMerakiSuiteCount && this.eaService.features.BONFIRE_REL){
          this.enableBonfireMerakiSuites();
        }
      }, 300);
    } else {
      this.numberofSelectedSuite = 0;
      this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach((suite) => {
          if (event.target.checked) {

            if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
              if(this.eaService.features.SEC_SUITE_REL  && suite?.incompatibleSuites && suite?.incompatibleSuites.length){
                if(!this.swEnrollmentData.enrolled && !suite.disabled && !suite.notAllowedHybridRelated){
                  // if suite was already disabled due to related suite, make inclusion false by default
                  if(suite['disabledFromOtherSuite'] || suite.disabledFromOtherEnrollmentSuite){
                    suite.inclusion = false;
                  } else {
                    suite.inclusion = suite?.autoSelected ? true : false;
                  }
                } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                  suite.inclusion = (suite['disabledFromOtherSuite']  || suite.disabledFromOtherEnrollmentSuite) ? false : true;
                }
                // check and set suitemessages/suites selection if portfolio is enrolled or chagesub flow or any of suites already selected under hybrid
                this.checkAndSetIncompatibleAtoMessage(suite, true);
  
              } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                suite.inclusion = true;
              }
            } else {
              if(this.eaService.features.SEC_SUITE_REL && this.isSecurityPortfolio && suite?.incompatibleAtos && suite?.incompatibleAtos.length){
                if(!this.swEnrollmentData.enrolled && !suite.disabled && !suite.notAllowedHybridRelated){
                  // if suite was already disabled due to related suite, make inclusion false by default
                  if(suite['disabledFromOtherSuite']){
                    suite.inclusion = false;
                  } else {
                    suite.inclusion = suite?.isAtoOptedOut ? !suite?.isAtoOptedOut: suite.autoSelected;
                  }
                } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                  suite.inclusion = suite['disabledFromOtherSuite'] ? false : true;
                }
                // check and set suitemessages/suites selection if portfolio is enrolled or chagesub flow or any of suites already selected under hybrid
                this.checkAndSetIncompatibleAtoMessage(suite, true);
  
              } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                suite.inclusion = true;
              }
            }
            
            // this.numberofSelectedSuite = this.totalSuites.length;
            // set inclusion false for kegacy merkai or bonfire meraki
            if(this.eaService.features.BONFIRE_REL){
              if(suite?.type === this.constantsService.MERAKI && 
                (!suite?.eaSuiteType && suite.inclusion && (!this.legacyMerakiAlreadyPurchased || suite?.isMerakiDisabled)) ||
                ((suite?.eaSuiteType === this.constantsService.BONFIRE || (suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION && this.eaService.features?.WIFI7_REL)) && this.legacyMerakiAlreadyPurchased && suite.isBonfireDisabled)){
                suite.inclusion = false;
              }


              // make bonfire suites inclusion to false when any legacy meraki was already purchased
              // if(suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType === this.constantsService.BONFIRE && this.legacyMerakiAlreadyPurchased){
              //   suite.inclusion = false;
              // }
              if (suite?.type === this.constantsService.MERAKI && suite.inclusion && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                  this.selectedMerakiSuitesArray.push(suite.ato);
                } else {
                  suite.inclusion = false;
                }
              } 
            } else {
              if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                  this.selectedMerakiSuitesArray.push(suite.ato);
                } else {
                  suite.inclusion = false;
                }
              } 
            }

            if(this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK)){
              this.selectedSplunkSuitesArray.push(suite.ato)
            }

            // check and set bonfire meraki suites count 
            if(this.eaService.features?.WIFI7_REL){
              if(!suite.disabled && (suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION)){
                if(suite.inclusion){
                  this.bonfireSuitesSelected++;
                  if(suite?.ibFound && suite?.eaSuiteType === this.constantsService.BONFIRE) {
                    // check and remove the mandatory suites which are selected
                    this.checkAndSetBonfireMandatoryUnselectedSuites(suite);
                  }
                }
              }
              this.showMerakiErrorMessage = false;
            }

            // set numberofSelectedSuite
            setTimeout(() => {
              if(suite.inclusion && !suite.disabled){
                this.numberofSelectedSuite++;
              }
              }, 200);
          } else {
            if (!suite.includedInEAID) {
              suite.inclusion = false;
              suite.suiteMessage = '';
              this.numberofSelectedSuite = 0;
              this.selectedMerakiSuitesArray = [];
              this.selectedSplunkSuitesArray = [];
              // if legacyMerakiAlreadyPurchased is true, then set legacyMerakiSuiteCount to 0
              if(!this.legacyMerakiAlreadyPurchased && this.eaService.features.BONFIRE_REL){
                this.legacyMerakiSuiteCount = 0;
              }
              // reset counts for bonfire
              if(this.eaService.features?.WIFI7_REL){
                this.bonfireMandatorySelectedSuiteCount = 0;
                this.bonfireSuitesSelected = 0;
                this.showMerakiErrorMessage = false;
              }
            }
          }
        })
      })

      // legacyMerakiSuiteCount is 0 allow bonfire meraki selection
      if(!this.legacyMerakiSuiteCount && this.eaService.features.BONFIRE_REL){
        this.enableBonfireMerakiSuites();
      }
    }
  } 

  selectSwHigherTier(tier, suite) {
    suite.tiers.forEach(element => {
      element.selected = false;
    });
    suite['upgradedTier'] = tier;
    tier.selected = true;
    suite.isRestored = false;
    suite.isSwTierUpgraded = true;
    let swSuite = this.priceEstimateService.upgradedSuitesTier.find(swSuite => swSuite.name === suite.name);
    if(swSuite){
      swSuite['upgradedTier'] = tier;
    } else {
      this.priceEstimateService.upgradedSuitesTier.push(suite);
    }
  }

  restoreSwTier(suite) {
    suite['upgradedTier'] = undefined;
    suite.isSwTierUpgraded = false;
    suite.isRestored = true;
    suite.tiers.forEach(element => {
      element.selected = false;
    });
    if(this.priceEstimateService.upgradedSuitesTier.length){
      let tierFound = false;
      this.priceEstimateService.upgradedSuitesTier.forEach((tier) => {

        if(tier.name === suite.name) {
          this.priceEstimateService.upgradedSuitesTier.splice(suite, 1);
          tierFound = true;
        }
      })
      if(!tierFound){
        this.priceEstimateService.upgradedSuitesTier.push(suite);
        
      }
    } else {
      this.priceEstimateService.upgradedSuitesTier.push(suite);
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

  showTooltip(tooltip) {
    const e = tooltip._elementRef.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      setTimeout(() => {
        tooltip.open();
      }, 200);
    }
  }

  hideTooltip(tooltip) {
    tooltip.close();
  }

  IncompatibleSuitesFromOtherEnrollemnt(suite){//to set msg for Incompatible Suites From Other Enrollemnt
    if(suite.alreadySelectedIncompatibleSuites?.length && this.suiteNameArray?.length){
      suite.alreadySelectedIncompatibleSuites = suite.alreadySelectedIncompatibleSuites.filter((val) => !this.suiteNameArray.includes(val));
    }
    if(suite.alreadySelectedIncompatibleSuites?.length){
      if(suite.suiteMessage){
        const alreadySelectedIncompatibleSuites = suite.alreadySelectedIncompatibleSuites.toString();
        if(!suite.suiteMessage.includes(alreadySelectedIncompatibleSuites)){
          suite.suiteMessage = suite.suiteMessage + ',' + suite.alreadySelectedIncompatibleSuites.toString();
        }     
      } else {
        suite.suiteMessage = suite.alreadySelectedIncompatibleSuites.toString();
      }
      if(suite.inclusion){
        suite.inclusion = false
      }
      suite.disabledFromOtherEnrollmentSuite = true;
    }
  }
  getAllSuitesName(){
    this.swEnrollmentData.pools.forEach(pool => {
      pool.suites.forEach(suite => {
        this.suiteNameArray.push(suite.desc)
      })
    })
  }

  cxCoverageTypeSelect(suite, type) {
    suite.coverageTypes.forEach((coverage) => {
    coverage.selected = (type.desc === coverage.desc) ? true : false
    })
    // check and set selected coverage type for unx/dnx
    if(this.eaService.features?.WIFI7_REL && suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION){
      this.isCxCommitSuiteForUnx = true;
      this.selectedCoverageTypeForUnx = type;
    } else {
      this.isCXCommitSuite = true;
      this.selectedCoverageType = type;
    }
    type.selected = true;
    suite['showCoverageTierDrop'] = false;
  }
  
  displaySWTierUpgrade(){
    this.showUpgradeSuitesTab = true;
  }

  // method to allow coveragetype selection
  coverageTierDropClose(suite) {
    if(this.eaService.features?.WIFI7_REL){
      suite['showCoverageTierDrop'] = true;
    } else {
      this.showCoverageTierDrop = true;
    }
  }
}
