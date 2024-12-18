import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { IAtoTier, IBill, ICxCoverageTypes, IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateService } from '../price-estimate.service';
import { Router } from '@angular/router';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaStoreService, IPhoneNumber } from 'ea/ea-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { QuestionnaireStoreService } from '../questionnaire/questionnaire-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { IQuestion, PriceEstimateStoreService } from '../price-estimate-store.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { Subject, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-define-suites',
  templateUrl: './define-suite.component.html',
  styleUrls: ['./define-suite.component.scss']
})
export class DefineSuiteComponent {

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
  selectedDistiBill:IBill;
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
  defineSuitesData:any = {}

  constructor(
private vnextService: VnextService, public proposalStoreService: ProposalStoreService, public priceEstimateService: PriceEstimateService,private router: Router, public dataIdConstantsService: DataIdConstantsService, private eaStoreService: EaStoreService, private eaRestService: EaRestService,
public questionnaireService: QuestionnaireService, public questionnaireStoreService: QuestionnaireStoreService,public renderer: Renderer2, public proposalRestService: ProposalRestService, public constantsService: ConstantsService, public projectService: ProjectService,public elementIdConstantsService: ElementIdConstantsService,
public priceEstimateStoreService : PriceEstimateStoreService,private messageService: MessageService, public eaService: EaService, public vnextStoreService: VnextStoreService, public utilitiesService:  UtilitiesService, public localizationService:LocalizationService, private eaUtilitiesService: EaUtilitiesService, private blockUiService: BlockUiService){}


ngOnInit(): void {
 this.checkRoMode(); 
 this.priceEstimateService.getOrdIds(); // to get orgids  
 if (this.eaService.isPartnerUserLoggedIn()){
   this.isPartnerLoggedIn = true;
 }
 if(this.priceEstimateService.displayQuestionnaire){
  // this.openQnAFlyout()
 } else {
   this.getSuiteDetails();
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

get contact(){
  return this.phoneForm.get('phone');
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


ngOnDestroy() {
this.renderer.removeClass(document.body, 'position-fixed')
this.questionnaireStoreService.questionsArray = [];
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

getSuiteDetails(){

this.apiCount++;
// const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.enrollment.id + '&a=DEFINE-SUITE';
// this.proposalRestService.getApiCall(url).subscribe((response: any) => {
const url =  "assets/data/define-suites/define-suites.json";//remove this json call with real API
this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
 if(this.vnextService.isValidResponseWithData(response)) { 
   this.apiCount--

   if(!this.apiCount){
     this.isDataLoaded = true;
   }
   this.utilitiesService.sortArrayByDisplaySeq(response.data.enrollments[0].pools);  
   this.swEnrollmentData = response.data.enrollments[0];
   this.defineSuitesData = response.data;
  
   if(this.swEnrollmentData.id === 3){
     this.isSecurityPortfolio = true;
   } else {
     this.isSecurityPortfolio = false;
   }
   this.getAllSuitesName()
    this.getIncludedSuitesCount();
    this.setRenewalSubDataForSuite();
    if(this.eaService.features?.WIFI7_REL && this.deeplinkForCx){
     //this.getSelectedCxSuiteDetails()
    } else if (!this.eaService.features?.WIFI7_REL && this.deeplinkForCx && this.cxEnrollmentData.id){
     //this.goToServiceInfo()
    }
 }
});
}

getAllSuitesName(){
  this.swEnrollmentData.pools.forEach(pool => {
    pool.suites.forEach(suite => {
      this.suiteNameArray.push(suite.desc)
    })
  })
}

updateSuiteInclusion(suite){
suite.swSelected = !suite.swSelected;
if(suite.swSelected){
  suite.cxSelected = true;
} else {
  if(!suite.onlyCxAllowed){
    suite.cxSelected = false;
  }
}
// to check and set suite message on eache suite selection by checking incompatibleAtos / incompatibleSuites
if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI))){
// this.setIncompatibleAtoMessage(suite, true, true);
 if(this.isSecurityPortfolio){
   if(suite.swSelected){
     this.numberofSelectedSuite++;
   } else {
     this.numberofSelectedSuite--;
   }
 } else {
   if( this.enrollment.id !== 6 && suite.hasOwnProperty('notAllowedHybridRelated')){
     this.priceEstimateStoreService.hybridSuiteUpdated = true;
   }
   if(suite.swSelected){
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
            // this.enableBonfireMerakiSuites();
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
if(suite.swSelected){
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
       //  this.enableBonfireMerakiSuites();
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
 if(suite.swSelected){
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
if(suite?.swSelected){
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

updateAllSuite(event){
if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI))){
 this.updateAllSuiteForSecurity(event); // call this method to update all suite if feature flag if on and security portfolio
}
}

isEducationInstitueSelected(tier: IAtoTier){
if (tier.hasOwnProperty("educationInstituteOnly")) {
let qna = this.questionnaireService.selectedAnswerMap.get("edu_institute");
if (qna) {
 let answer = qna.answers[0];
 if (answer.value === 'true' && tier.educationInstituteOnly) {
   return true;
 } else {
   return false;
 }
} else if (this.questionnaireStoreService.questionsArray) {
 if (!this.questionnaireStoreService.isEducationInstituteSelected) {
   for (let i = 0; i < this.questionnaireStoreService.questionsArray.length; i++) {
     if (this.questionnaireStoreService.questionsArray[i].id === this.constantsService.EDUCATION_INSTITUTE_QUESTION) {
       let answers = this.questionnaireStoreService.questionsArray[i].answers;
       if (answers[0].selected) {
         this.questionnaireStoreService.isEducationInstituteSelected = true;
         break;
       }

     }
   }
 }
 if (this.questionnaireStoreService.isEducationInstituteSelected && tier.educationInstituteOnly) {
   return true;
 } else {
   return false;
 }
}
}
return true;
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

backToQna(){
  this.displayQnaWindow = true;
  this.deeplinkForSw = false;
  this.deeplinkForCx = false;
  this.serviceInfo = false;
  this.updatedSuitesArray = [];
  // this.resetDates();
  this.checkAndSetAnsweredQna(); // check and set selected answers for qna when coming back
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
  this.billToIdRequired = false;
 
}

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

howItWorks(){
  const url = this.vnextService.getAppDomainWithContext + 'service-registry/url?track=SALES_CONNECT&service=PROGRAM_DETAILS'
  this.proposalRestService.getApiCall(url).subscribe((response: any) => {
    if(this.vnextService.isValidResponseWithData(response)) { 
      window.open(response.data);
    }
  });
}

clearSearchBillTo() {
  this.searchBillId.setValue('');
  this.showSelectionOptions = false;
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

selectBill(bill) {
  this.isBillToIdUpdated = true;
  this.searchBillId.setValue('');
  this.showSelectionOptions =  false;
  this.selectedBill =  bill;
  this.isBilltoIDChanged =  true;
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

clearSearchDistiBillTo() {
  this.searchDistiBillTo = '';
  this.showDistiBillToOptions = false;
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

goToBillToTab(){
  this.billToTab = true;
  this.serviceInfo = false;
}
backToCxPage(){
  this.billToTab = false;
  this.serviceInfo = true;
}

eamsDeliveryEligibilityCheck() {
  const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=EAMS-PARTNER-DELIVERY-ELIGIBILITY';
  this.proposalRestService.getApiCall(url).subscribe((response: any) => {
    if (this.vnextService.isValidResponseWithData(response)) {
      this.isEamsEligibile = response.data.partnerDeliveryEligible;
    }
  });
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


  loadServiceInfo() {
    this.cxEnrollmentData = {};
    this.isRsdUpdated = false;
    this.isBillToIdUpdated = false;
    this.showDnxMandatoryFailureMessage = false;
    this.showUnxMandatoryFailureMessage = false;
    this.showUnxCxNotAvailableMessage = false;
    this.showUnxMandatoryMessage = false;
    this.showDnxMandatoryMessage = false;
    this.primaryPartner = (this.proposalStoreService.proposalData.partnerInfo && this.proposalStoreService.proposalData.partnerInfo.beGeoName) ? this.proposalStoreService.proposalData.partnerInfo.beGeoName : '';

    this.cxEnrollmentData = JSON.parse(JSON.stringify(this.swEnrollmentData))
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
    if (this.defineSuitesData?.ibCoverageLookupStatus) {
      this.cxIbCoverageLookupStatus = this.defineSuitesData?.ibCoverageLookupStatus;
    }
    // check and set unx dnx mandatory flag old flow
    if (this.eaService.features?.WIFI7_REL && this.eaService.features?.UPFRONT_IBC) {
      // set to show unx cx not available due to HW coverage not found
      if (this.cxEnrollmentData?.someCxSuitesAreNotAvailableToSelect) {
        this.showUnxCxNotAvailableMessage = true;
      }
      // check when upfront ib call fails and set to show message
      if (this.cxIbCoverageLookupStatus === this.constantsService.FAILURE) {
        this.showDnxMandatoryFailureMessage = true;
        this.showUnxMandatoryFailureMessage = true;
      }
      // check when upfront ib call fails and set to show message
      if (this.cxIbCoverageLookupStatus === this.constantsService.SUCCESS) {
        this.showUnxMandatoryMessage = true;
        this.showDnxMandatoryMessage = true;
      }
    }

    this.phoneForm = new FormGroup({
      phone: new FormControl(this.phoneNumber, [Validators.required])
    });
    if (this.defineSuitesData?.billToInfo) {

      if (this.eaService.isDistiOpty || this.eaService.isResellerOpty) {
        this.selectedResellerBill = this.defineSuitesData?.billToInfo;
        this.selectedDistiBill = this.defineSuitesData?.distiBillToInfo;
        this.priceEstimateStoreService.distiBID = this.selectedDistiBill?.siteUseId;
        this.priceEstimateStoreService.resellerBID = this.selectedResellerBill?.siteUseId;
        this.isBillToIdPresent = this.selectedResellerBill && this.selectedDistiBill ? true : false;
      } else {
        this.selectedBill = this.defineSuitesData?.billToInfo;
        this.isBillToIdPresent = true;
      }
    } else {
      this.isBillToIdPresent = false;
    }

    this.goToServiceInfo();
  }

  goToServiceInfo() {
    this.deeplinkForSw = false;
    this.deeplinkForCx = false;
    this.displayQnaWindow = false;
    this.updatedSuitesArray = [];

    this.serviceInfo = true;
    if (!this.swEnrollmentData.cxOptInAllowed) {
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
      return
    }
    if (!this.enrollment.enrolled && this.isPartnerLoggedIn && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal && !this.vnextStoreService.loccDetail?.loccSigned) {
      this.allowServices = false;
      this.isCxREquired = false;
      this.billToIdRequired = false;
      return
    }
    if (this.cxEnrollmentData.pools) {
      for (let pool of this.cxEnrollmentData.pools) {
        pool['expand'] = true;
        
        for (let suite of pool.suites) {
          this.setTierFromData(suite);
          if (!(this.isPartnerLoggedIn && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal && !this.vnextStoreService.loccDetail?.loccSigned)) {// to deselect cx of newly added sw of an already enrolled portfolio
            suite.cxOptIn = true;
          }

        }
      }
      this.getCxSuitesIncluded();
      this.eaStartDate = new Date(this.utilitiesService.formateDate(this.cxEnrollmentData.billingTerm.rsd));
      if (this.priceEstimateService.displayQuestionnaire) {
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

    if (this.cxEnrollmentData.enrolled && !this.cxEnrollmentData.cxAttached && (this.eaService.features.FIRESTORM_REL && !this.isDnxSelected) && (this.eaService.features.WIFI7_REL && !this.isUnxSelected)) {
      this.isCxREquired = false;
      this.billToIdRequired = false;
    }
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

saveData() {
  const atos = [];
  let request;

  if (this.isCxREquired) {
    for (let pool of this.cxEnrollmentData.pools) {
      for (let suite of pool.suites) {
        if (!suite.disabled || suite.allowHwSupportOnlyPurchase){
          let atoObj: any = {};
          if(suite?.swSelectedTier && !suite.cxSelected && suite.swSelected){
            atoObj = {
              name: suite.ato,
              inclusion: true,
              selectedTier: suite['swSelectedTier'].name,
              additionalInfo: (suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
            }
          } else {
            atoObj = {
              name: suite.ato,
              selectedTier: (suite['swSelectedTier'] && suite.cxSelected) ? suite['swSelectedTier'].name: undefined,
              inclusion: suite.cxSelected ? true : false,
              additionalInfo: (suite.cxSelected && suite.cxOptIn) ? { "relatedCxAto": suite['cxUpdatedTier'] ? suite['cxUpdatedTier']['name'] : undefined } : undefined
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
             if(suite.cxSelected && suite?.tiers) {
              for (let tier of suite.tiers) {
                   if (tier.name === suite.swSelectedTier.name && tier?.coverageTypes && atoObj.additionalInfo) {
                    atoObj.additionalInfo["cxCoverageType"] = this.selectedCoverageType.name;
                  }
              }
             }
          }

          // check and set selected coveragetype for unx
          if (this.eaService.features.WIFI7_REL) {
            if(suite.cxSelected && suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
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
            inclusion: suite.swSelected ? true : false,
            selectedTier: (suite['swSelectedTier'] && suite.swSelected)? suite['swSelectedTier'].name: undefined
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
    } else {
      //if enrolled is false send billToInfo and billingTerm
      request = {
        data: {
         // billToInfo: this.selectedBill,
          enrollments: [
            {
              
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
        if (!suite.disabled){
          atos.push({
            name: suite.ato,
            inclusion: suite.swSelected ? true : false,
            selectedTier: (suite['swSelectedTier'] && suite.swSelected)? suite['swSelectedTier'].name: undefined
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
  //this.priceEstimateService.addSuiteEmitter.next(request);
}

getIncludedSuitesCount(){
  this.numberofSelectedSuite = 0;
  this.selectedMerakiSuitesArray = [];
  this.selectedSplunkSuitesArray = [];
  this.totalSuites = [];

  this.swEnrollmentData.pools.forEach(pool => {
    //let displayPoolForTierUpgrade = false
    this.utilitiesService.sortArrayByDisplaySeq(pool.suites); 
    pool.suites.forEach(suite => {
    
      if(!(suite.disabled || suite.notAllowedHybridRelated || suite.notAvailable)) {
        if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed && !suite.includedInEAID)) {
          this.totalSuites.push(suite)
        }
      }

      if(suite?.changeSubConfig?.noMidTermPurchaseAllowed && this.isChangeSubFlow && !this.isUpgradeFlow){
        suite.swSelected = false;
      } else if(this.eaService.features.SEC_SUITE_REL && (this.isSecurityPortfolio || (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI)) && !this.swEnrollmentData.enrolled && !suite.disabled && !suite.notAllowedHybridRelated){
        // if suite was already disabled due to related suite, make swSelected false by default
        if (suite['disabledFromOtherSuite'] || suite.disabledFromOtherEnrollmentSuite) {//check
          suite.swSelected = false;
        } else if (this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI) {
          suite.swSelected = suite?.autoSelected ? true : false;
        } else {
          suite.swSelected = suite?.isAtoOptedOut ? !suite?.isAtoOptedOut : suite.autoSelected;
        }
      } else if((!this.enrollment.enrolled || suite.disabled) && !suite.notAllowedHybridRelated){
        if(this.isChangeSubFlow || this.isUpgradeFlow) {
          suite.swSelected = suite?.includedInSubscription ? true : suite.autoSelected;
        } else if(this.projectService.isReturningCustomer(this.proposalStoreService.proposalData.scopeInfo)){
          suite.swSelected = suite?.includedInEAID ? true : suite.autoSelected;
        } else {
          suite.swSelected = suite.autoSelected;
        }

        // set swSelected false for the suites which are having orgidoverlap or notavailable
        if(this.eaService.features.BONFIRE_REL && suite?.swSelected && (suite?.notAvailable || suite?.isOrgIdOverlapping)){
          suite.swSelected = false;
        }
      }

      if(this.eaService.features.BONFIRE_REL && suite.swSelected && 
        (suite?.type === this.constantsService.MERAKI && ((!suite?.eaSuiteType || suite?.eaSuiteType === this.constantsService.MERAKI) && suite?.isMerakiDisabled) || ((suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) && suite?.isBonfireDisabled)) ){
        suite.swSelected = false; // if suite is isMerakiDisabled or isBonfireDisabled, then make it false
      }

      if(suite.swSelected && !this.enrollment.enrolled){
        suite.cxSelected = true;
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

      if (suite.swSelected && !suite.disabled) {
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



        suite['swSelectedTier']= tier ? tier : (suiteAtoForSameTier ? suiteAtoForSameTier : suite.tiers[0]);
        if(this.eaService.features.FIRESTORM_REL && suite['swSelectedTier']?.hasEmbeddedHwSupport && this.isPartnerLoggedIn && !this.vnextStoreService.loccDetail?.loccSigned){//to disable dnx tiser selection in case of partner login and locc not signed
          this.embeddedHwSupportNotAllowedForPartner = true
        }
        suite['swSelectedTier'].selected = true;

        if (this.eaService.features.FIRESTORM_REL) {
          suite.tiers.forEach((tier) => {
            suite['hasEmbeddedHwSupport'] = tier?.hasEmbeddedHwSupport ? tier.hasEmbeddedHwSupport : false;
            suite['cxAttachMandatory'] = tier?.serviceAttachMandatory ? tier.serviceAttachMandatory : false;
          })
        }
      }
      // check and set showMerakiErrorMessage if any bonfire suite with ibfound was not selected
      if (this.eaService.features?.WIFI7_REL) {
        if(suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION){
          if (suite.swSelected) {
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
            if (suite.swSelected) {
              this.bonfireSuitesSelected++;
            }
            if (suite?.ibFound) {
              this.bonfireMandatorySuitesCount++;
              if (suite?.swSelected) {
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
    });//end
    // if(displayPoolForTierUpgrade){
    //   pool['displayPoolForTierUpgrade'] = true
    //   this.displaySwTierUpgradeTable = true;
    // }
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
    if((this.swEnrollmentData.enrolled && !suite?.notAllowedHybridRelated && !suite?.disabled && !this.isChangeSubFlow) || (suite?.notAllowedHybridRelated || suite?.disabled) || (this.swEnrollmentData.enrolled && suite?.swSelected)){
      this.setIncompatibleAtoMessage(suite, userUpdate);
    }
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
      if(suite.swSelected){
        suite.swSelected = false
      }
      suite.disabledFromOtherEnrollmentSuite = true;
    }
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
                if (userUpdate && suiteData.swSelected && manualFlip) {
                  this.numberofSelectedSuite--;
                }
                if(updatedSuite.swSelected && (suiteData?.disabled || suiteData?.notAllowedHybridRelated)){
                  updatedSuite.swSelected = false;
                  // this.numberofSelectedSuite--;
                }
                  if (updatedSuite.swSelected || updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) {
  
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
                    if (suiteData.suiteMessage && suiteData.swSelected) {
                      suitesRemoved.push(suiteData.desc);
                    }
  
                    suiteData.swSelected = (updatedSuite.swSelected || updatedSuite?.notAllowedHybridRelated  || updatedSuite?.disabled) ? false : suiteData.swSelected;
  
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
                // if suites are not present in incompatibleSuites of updatedSuite but !swSelected and suitemessage present with userupdate  -- remove suite message and make suitesremoved empty
                if (!updatedSuite?.incompatibleSuites.includes(suiteData.name) && suiteData?.incompatibleSuites && !suiteData.swSelected && suiteData?.suiteMessage && userUpdate) {
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
                if (userUpdate && suiteData.swSelected && manualFlip) {
                  this.numberofSelectedSuite--;
                }
                if(updatedSuite.swSelected && (suiteData?.disabled || suiteData?.notAllowedHybridRelated)){
                  updatedSuite.swSelected = false;
                  // this.numberofSelectedSuite--;
                }
                  if (updatedSuite.swSelected || updatedSuite?.notAllowedHybridRelated || updatedSuite?.disabled) {
  
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
                    if (suiteData.suiteMessage && suiteData.swSelected) {
                      suitesRemoved.push(suiteData.desc);
                    }
  
                    suiteData.swSelected = (updatedSuite.swSelected || updatedSuite?.notAllowedHybridRelated  || updatedSuite?.disabled) ? false : suiteData.swSelected;
  
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
                // if suites are not present in incompatibleAtos of updatedSuite but !swSelected and suitemessage present with userupdate  -- remove suite message and make suitesremoved empty
                if (!updatedSuite?.incompatibleAtos.includes(suiteData.ato) && suiteData?.incompatibleAtos && !suiteData.swSelected && suiteData?.suiteMessage && userUpdate) {
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
    if((suite.serviceAttachMandatory || suite.swSelectedTier?.serviceAttachMandatory) && !suite.cxSelected){
      suite.cxSelected = true;
    }
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
     // call this method for sec suite release flow
  updateAllSuiteForSecurity(event){
    if (this.numberofSelectedSuite > 0 && this.numberofSelectedSuite !== this.totalSuites.length) {
      this.swEnrollmentData.pools.forEach(pool => {
        pool.suites.forEach((suite) => {
          event.preventDefault();
          this.totalSuites.forEach((atos) => {
              if (suite.ato === atos.ato) {
                setTimeout(() => {
                  suite.swSelected = false;
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
                  // if suite was already disabled due to related suite, make swSelected false by default
                  if(suite['disabledFromOtherSuite'] || suite.disabledFromOtherEnrollmentSuite){
                    suite.swSelected = false;
                  } else {
                    suite.swSelected = suite?.autoSelected ? true : false;
                  }
                } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                  suite.swSelected = (suite['disabledFromOtherSuite']  || suite.disabledFromOtherEnrollmentSuite) ? false : true;
                }
                // check and set suitemessages/suites selection if portfolio is enrolled or chagesub flow or any of suites already selected under hybrid
                this.checkAndSetIncompatibleAtoMessage(suite, true);
  
              } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                suite.swSelected = true;
              }
            } else {
              if(this.eaService.features.SEC_SUITE_REL && this.isSecurityPortfolio && suite?.incompatibleAtos && suite?.incompatibleAtos.length){
                if(!this.swEnrollmentData.enrolled && !suite.disabled && !suite.notAllowedHybridRelated){
                  // if suite was already disabled due to related suite, make swSelected false by default
                  if(suite['disabledFromOtherSuite']){
                    suite.swSelected = false;
                  } else {
                    suite.swSelected = suite?.isAtoOptedOut ? !suite?.isAtoOptedOut: suite.autoSelected;
                  }
                } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                  suite.swSelected = suite['disabledFromOtherSuite'] ? false : true;
                }
                // check and set suitemessages/suites selection if portfolio is enrolled or chagesub flow or any of suites already selected under hybrid
                this.checkAndSetIncompatibleAtoMessage(suite, true);
  
              } else if (!(suite.disabled || suite.notAllowedHybridRelated)) {
                suite.swSelected = true;
              }
            }
            
            // this.numberofSelectedSuite = this.totalSuites.length;
            // set swSelected false for kegacy merkai or bonfire meraki
            if(this.eaService.features.BONFIRE_REL){
              if(suite?.type === this.constantsService.MERAKI && 
                (!suite?.eaSuiteType && suite.swSelected && (!this.legacyMerakiAlreadyPurchased || suite?.isMerakiDisabled)) ||
                ((suite?.eaSuiteType === this.constantsService.BONFIRE || (suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION && this.eaService.features?.WIFI7_REL)) && this.legacyMerakiAlreadyPurchased && suite.isBonfireDisabled)){
                suite.swSelected = false;
              }


              // make bonfire suites swSelected to false when any legacy meraki was already purchased
              // if(suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType === this.constantsService.BONFIRE && this.legacyMerakiAlreadyPurchased){
              //   suite.swSelected = false;
              // }
              if (suite?.type === this.constantsService.MERAKI && suite.swSelected && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                  this.selectedMerakiSuitesArray.push(suite.ato);
                } else {
                  suite.swSelected = false;
                }
              } 
            } else {
              if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_DNA) && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION){
                if (!(this.isChangeSubFlow && suite?.changeSubConfig?.noMidTermPurchaseAllowed)) {
                  this.selectedMerakiSuitesArray.push(suite.ato);
                } else {
                  suite.swSelected = false;
                }
              } 
            }

            if(this.eaService.features.SPLUNK_SUITE_REL && (suite?.eaSuiteType === this.constantsService.SPLUNK)){
              this.selectedSplunkSuitesArray.push(suite.ato)
            }

            // check and set bonfire meraki suites count 
            if(this.eaService.features?.WIFI7_REL){
              if(!suite.disabled && (suite?.eaSuiteType === this.constantsService.BONFIRE || suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION)){
                if(suite.swSelected){
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
              if(suite.swSelected && !suite.disabled){
                this.numberofSelectedSuite++;
              }
              }, 200);
          } else {
            if (!suite.includedInEAID) {
              suite.swSelected = false;
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
     
  updateCxInclusion(suite) {
    if (suite.cxSelected || (!suite.cxSelected && (suite.swSelected || suite.onlyCxAllowed))) {
      suite.cxSelected = !suite.cxSelected;
    }

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
  // set the phone number from customer contact
  preparePhoneValue(customerContact) {
    this.phoneNumber.number = customerContact.contactNumber
    this.phoneNumber.dialCode = customerContact.phoneCountryCode
    this.phoneNumber.e164Number = this.phoneNumber.dialCode + this.phoneNumber.number;
    this.phoneNumber.countryCode = customerContact.dialFlagCode;
  }

  getCxSuitesIncluded() {
    this.disableForMapping = false;
    this.isCxRowPresent = false;
    this.isDnxSelected = false;
    this.isUnxSelected = false;
    this.isUnxServiceMandatory = false;
    this.isDnxServiceMandatory = false;
    let allCxSuitesMantatory = true;
    if (!this.eaService.features.CX_MANDATORY_SEPT_REL) {
      allCxSuitesMantatory = false;
    }
    for (let pool of this.cxEnrollmentData.pools) {
      let cxSuitesIncludedInPool = false; // set if any of the suites in the pool included
      //let cxPoolEligibleForMigration = false;
      for (let cxSuite of pool.suites) {
        if (cxSuite.allowHwSupportOnlyPurchase) {//if make disable as true in case of already purchased SW only to allow HW cx purchase.
          cxSuite.disabled = true;
        }
        //cxSuite.cxSelected = false;
        if (cxSuite.cxSelected && !cxSuite.notAvailable && !cxSuite.consentRequired) {
          if (!cxSuite.disabled || (cxSuite.disabled && this.enrollment?.includedInChangeSub)) {
            if (cxSuite.tiers) {

              cxSuite.cxSelectedTier = '';
              cxSuite['cxTierDropdown'] = [];

              for (let tier of cxSuite.tiers) {
                // set cxoptin from tier
                if (tier['cxOptIn']) {
                  cxSuite.cxOptIn = tier['cxOptIn'];
                }
                if (cxSuite.swSelectedTier) {
                  if (tier.name === cxSuite.swSelectedTier.name) {
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
            cxSuite.cxSelected = true;
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
              cxSuite.cxSelected = true;
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

          if (cxSuite.cxSelected && !cxSuite.disabled && this.eaService.features.CX_MANDATORY_SEPT_REL) {
            if (cxSuite.serviceAttachMandatory) {
              this.mantatoryCxSuitesSelected = true
            } else {
              allCxSuitesMantatory = false
            }
          }
          else if (cxSuite.cxSelected && cxSuite.disabled && this.eaService.features.CX_MANDATORY_SEPT_REL) {
            allCxSuitesMantatory = false
          }




          if (cxSuite['cxTierDropdown']?.length) {
            this.utilitiesService.sortArrayByDisplaySeq(cxSuite['cxTierDropdown']);
          }
        }
        // check and set isDnxSelected, isDnxServiceMandatory, isUnxSelected, isUnxServiceMandatory
        if (this.eaService.features.WIFI7_REL && cxSuite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
          if (cxSuite.swSelected && !cxSuite.disabled) {
            this.isUnxSelected = true;
          }
          if (cxSuite['cxAttachMandatory'] && !cxSuite.disabled) {
            this.isUnxServiceMandatory = true;
          }
        } else {
          if (this.eaService.features.FIRESTORM_REL) {
            if (cxSuite['hasEmbeddedHwSupport'] && cxSuite.swSelected && !cxSuite.disabled) {
              this.isDnxSelected = true;
            }
            // check and set cxAttachMandatory for DNX from suite level serviceAttachMandatory
            if (this.isDnxSelected && !cxSuite['cxAttachMandatory'] && cxSuite?.serviceAttachMandatory && this.eaService.features?.WIFI7_REL) {
              cxSuite['cxAttachMandatory'] = cxSuite?.serviceAttachMandatory;
            }
            if (cxSuite['cxAttachMandatory'] && !cxSuite.disabled) {
              this.isDnxServiceMandatory = true;
            }
          }
        }
      }
      pool.cxSuitesIncludedInPool = cxSuitesIncludedInPool;
      //pool.eligibleForMigration = cxPoolEligibleForMigration
    }
    if (this.eaService.features.CX_MANDATORY_SEPT_REL) {
      this.allCxSuitesMantatory = allCxSuitesMantatory;
    }

    // if no CXsuite selected, disable switch and hide services data
    if ((this.eaService.features.FIRESTORM_REL && this.isDnxSelected) || (this.eaService.features.WIFI7_REL && this.isUnxSelected)) {
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

  // Method to check if all attach rate provided 
  checkIfAllAttachRateFilled(userUpdate?) {

    this.isAllAttachRateAdded = true
    let cxCount = 0;
    let isBillToRequired = false;
    let allcxSuiteSelected = true;
    for (let pool of this.cxEnrollmentData.pools) {
      for (let suite of pool.suites) {
        if (this.eaService.features.WIFI7_REL && suite['hasEmbeddedHwSupport'] && suite.swSelected && !suite.disabled) {
          this.isDnxSelected = suite.cxOptIn;
        }

        if (this.eaService.features.WIFI7_REL && !suite.disabled && suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION) {
          this.isUnxSelected = suite.cxOptIn;
        }
        if (suite.cxSelected && (!suite.disabled || suite.allowHwSupportOnlyPurchase)) {
          if (suite.cxOptIn) {
            cxCount++;
            if (!suite.cxAttachRate && (suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut) && !this.isUpgradeFlow) {
              suite.cxAttachRate = undefined;
              this.isAllAttachRateAdded = false
            }


            if ((!this.isUpgradeFlow && suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut) || (suite.includedInSubscription && this.isUpgradeFlow && suite.cxHwSupportAvailable && !suite.cxHwSupportOptedOut)) {
              isBillToRequired = true
            }

          } else if (!suite.cxOptIn && this.eaService.features.CX_MANDATORY_SEPT_REL) {
            allcxSuiteSelected = false;
          }

        }
      }
    }
    if (this.eaService.features.CX_MANDATORY_SEPT_REL && allcxSuiteSelected) {
      this.indeterminateCxState = false
    }
    this.billToIdRequired = isBillToRequired;

    if (!cxCount && !this.isUpgradeFlow) {
      this.isAllAttachRateAdded = false
    }
    if ((this.eaService.features.FIRESTORM_REL && this.isDnxSelected) || (this.eaService.features.WIFI7_REL && this.isUnxSelected)) {
      this.billToIdRequired = true;
      this.isCxREquired = true;
      this.allowServices = true;
      if (!cxCount && (this.selectedCoverageType.desc !== undefined || this.selectedCoverageTypeForUnx?.desc !== undefined)) {
        this.isAllAttachRateAdded = true
      }
    }
    return this.isAllAttachRateAdded
  }
  openCxTierDropdown(event, enrollment) {
    enrollment.showDropdown = true;
    if (enrollment.expanded || event.clientY + 100 < window.innerHeight) {
      enrollment.placement = 'bottom';
    } else {
      enrollment.placement = 'top';
    }
  }
  changeCxTierSelection(tierObj: IAtoTier, suite) {
    suite.cxTierDropdown.forEach(tier =>
      tier.selected = false
    );
    if (suite.cxUpdatedTier.name !== tierObj.name) {//remvoe desc and use name
      tierObj.selected = true;
      suite.cxUpdatedTier = tierObj;
      suite.cxSelectedTier = tierObj.name;
    }
  }

  checkValue(event, value) {
    // method to check key event and set cx rate

    if (!this.utilitiesService.isNumberKey(event)) {
      event.target.value = '';
    }
    if (event.target.value) {
      if (event.target.value > 100) {
        event.target.value = 100.00;
        value = 100.00;
      } else if (event.target.value <= 0) {
        event.target.value = undefined;
        value = undefined;
      } else {
        value = +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)));
      }
    }

  }
  // check if Eams eligible and partner selected with all the details needed
  isPartnerEamsAdded() {
    return (this.isEamsEligibile && !this.selectedCiscoEams && (this.invalidEmail || !(this.primaryPartner && this.partnerContactName && this.partnerEmail) || this.phoneForm.invalid))
  }
  checkAllAttachRate(suit,event) {
    if(+event.target.value > 100){
      suit.cxAttachRate = 100;
    } else {
      suit.cxAttachRate = (+event.target.value === 0 || event.target.value === undefined) ? undefined : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)))
    }
    this.checkIfAllAttachRateFilled(true);
  }
    // method to allow coveragetype selection
    coverageTierDropClose(suite) {
      if(this.eaService.features?.WIFI7_REL){
        suite['showCoverageTierDrop'] = true;
      } else {
        this.showCoverageTierDrop = true;
      }
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

}
