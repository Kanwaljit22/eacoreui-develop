import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { IEamsDelivery, IProposalInfo } from '../../proposal-store.service';

import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

import { SpnaSuitesCellComponent } from './spna-suites-cell/spna-suites-cell.component';
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import {  NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalStoreService, IEnrollmentsInfo } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextService } from 'vnext/vnext.service';
import { ApplyDiscountComponent } from 'vnext/modals/apply-discount/apply-discount.component';
import { UpgradeSummaryComponent } from 'vnext/modals/upgrade-summary/upgrade-summary.component';
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { Router, ActivatedRoute } from '@angular/router';
import { EligibilityStatusComponent } from 'vnext/modals/eligibility-status/eligibility-status.component';
import { UnenrollConfirmationComponent } from 'vnext/modals/unenroll-confirmation/unenroll-confirmation.component';
import { FutureConsumableItemsComponent } from 'vnext/modals/future-consumable-items/future-consumable-items.component';
import { ManageTeamComponent } from 'vnext/modals/manage-team/manage-team.component';
import { AddSecurityServiceEnrollComponent } from 'vnext/modals/add-security-service-enroll/add-security-service-enroll.component';
import { MessageService } from 'vnext/commons/message/message.service';
import { EnagageSupportTeamComponent } from 'vnext/modals/enagage-support-team/enagage-support-team.component';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaStoreService } from 'ea/ea-store.service';
import { RequestDocumentsComponent } from 'vnext/modals/request-documents/request-documents.component';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { EamsDeliveryComponent } from "vnext/modals/eams-delivery/eams-delivery.component";
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { SpnaSuitesHeaderRenderComponent } from './spna-suites-header-render/spna-suites-header-render.component';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { SpnaTcvCellRendererComponent } from './spna-tcv-cell-renderer/spna-tcv-cell-renderer.component';
import { PriceEstimateService } from '../price-estimation/price-estimate.service';
import { QuestionnaireService } from '../price-estimation/questionnaire/questionnaire.service';
import { PriceEstimationPollerService } from '../price-estimation/price-estimation-poller.service';
@Component({
  selector: 'app-spna-price-estimation',
  templateUrl: './spna-price-estimation.component.html',
  styleUrls: ['./spna-price-estimation.component.scss']
})
export class SpnaPriceEstimationComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  breakupColumn: string;
  updateEnrollemntBillingDetails:IEnrollmentsInfo
  selectedEnrollemnt: IEnrollmentsInfo = {}
  upgradeSummaryData: any;
  poolArray = [];
  selectedAto = ''
  selectedPool = ''
  selectedEnrollmentArray = [];
  showSelectedEnrollmentsDropDown = false;
  displayPAMsg = false;
  externalConfigReq: any = {}
  showEAMS =  true; 
  addServicesForOtherEnrollment =  false;
  
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  public subscribers: any = {};
  showBenefitsMsg = true;
  numberofSelectedSuite = 0;
  redirectOWB:any;
  showMoreActions =  false;
  fullCommitTcv = '0';
  programEligibilty = '0';
  enableContinue =  false; //This flag will use to enable/disable continue button.
  isProgramEligible = false; //This flag is use to changes the class for program elibility.
  expandedArr = [];
  showConfirmationMessage = false;
  primaryFcSuite = false; // set if any of primary enrolments already have fcSuiteCount
  displayAutoSuggestionPopForSecurity = false; // to dispaly auto suggestion window
  isSecurityEnrollmentPresent = false; // set if security enrollment present in enrollments
  securityEnrollmentObj: any; // set security enrollment obj
  requestPa = false;
  showSupportButton  = false;
  isSecurityEnrolled = false;
  errorMessage =  false; 
  punchInEnrollmentId:any;
  enableCascadeDiscount = false;
  isCascadeApplied = false;
  readonly CONST_SERVICE_ENROLLMENT =  5;
  readonly CONST_SECURITY_ENROLLMENT =  3;
  readonly CONST_HYBRID_ENROLLMENT =  6;
  showServiceHardwareWarning = false;
  showServiceSuccessMessage = false;
  pollerSubscibers : any;
  togglePortfolio = false;
  enrollmentForAddSuite: IEnrollmentsInfo;
  deeplinkForServices = false;
  deeplinkForSw = false;
  isShowCopiedPropMsg = true; // set to false after 5 sec
  cxPresentInProposal = false; // set if any of the enrollment already has cx present
  displayCxManageTeamMsg = false; // set to display cxManageTeamMsg
  showChangeSubMsg = true;
  isChangeSubFlow = false;
  reloadDataAfterDelink = false;
  isUpgradeFlow = false;
  upgradedEnrollmentsArray = []; // set selected enrollments
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  subscriptionUrl = 'proposal/sub-ui-url';
  constructor(public priceEstimateService: PriceEstimateService, private utilitiesService: UtilitiesService, public vnextService: VnextService, public renderer: Renderer2, public proposalService: ProposalService,
    private proposalRestService: ProposalRestService, public proposalStoreService: ProposalStoreService, private modalVar: NgbModal, public dataIdConstantsService: DataIdConstantsService,
    public priceEstimateStoreService: PriceEstimateStoreService, private router: Router,private questionnaireService :QuestionnaireService, private messageService: MessageService,private route: ActivatedRoute,
    private vnextStoreService: VnextStoreService, public eaStoreService: EaStoreService, private activatedRoute: ActivatedRoute, private priceEstimationPollerService: PriceEstimationPollerService,
    private blockUiService: BlockUiService, private constantsService: ConstantsService,public localizationService:LocalizationService, public eaService: EaService, public projectStoreService: ProjectStoreService,
    private eaRestService: EaRestService
) {

    // this.vnextService.isRoadmapShown = false;
    // this.eaStoreService.isPePageLoad = true;
    // this.blockUiService.spinnerConfig.noProgressBar();
    this.proposalService.customPEProgressBar();
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 60;
    this.gridOptions.frameworkComponents = {
      suitesRender: <{ new(): SpnaSuitesCellComponent }>(
        SpnaSuitesCellComponent
      ),
      tcvRender: <{ new(): SpnaTcvCellRendererComponent }>(
        SpnaTcvCellRendererComponent
      ),
    };
    this.gridOptions.context = {
      parentChildIstance: this
    };
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.domLayout = 'autoHeight';
  }

  ngOnInit() {
    this.proposalService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalStoreService.proposalData); 
    this.punchInEnrollmentId = this.activatedRoute.snapshot.queryParamMap.get('pId');
    if(this.eaStoreService.isValidationUI){
      this.redirectOWB = this.activatedRoute.snapshot.queryParamMap.get('redirectOWB');
    }
    this.eaStoreService.editName = false;
    if(this.punchInEnrollmentId || this.redirectOWB) {
      const url = this.router.url.split('?');
      //window.history.replaceState({}, document.title, "/#" + url[0]);
      
      window.history.replaceState({}, document.title,  url[0]);
      console.log(url)
      
    } else if(sessionStorage.getItem('enrollmentId') && this.eaStoreService.pePunchInLanding) {
      this.punchInEnrollmentId = sessionStorage.getItem('enrollmentId');
    } else if(sessionStorage.getItem('redirectOWB') && this.eaStoreService.isValidationUI){
      this.redirectOWB = sessionStorage.getItem('redirectOWB');
    }
    sessionStorage.removeItem('enrollmentId');
    sessionStorage.removeItem('redirectOWB');
    this.eaStoreService.pePunchInLanding = false;
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.PRICE_ESTIMATION_PAGE;
    this.eaStoreService.showOpenCaseSubject.next(true);
    this.eaService.showCaseManagementSubject.next(true);
    this.getEnrollmentData(true);

    if (this.proposalStoreService.proposalData?.renewalInfo && this.proposalStoreService.proposalData.renewalInfo.id){
      this.getRenewalSubscriptionDataForSuites();
    }
     
    this.subscribers.applyDiscountForSuiteSubj = this.priceEstimateService.applyDiscountForSuiteSubj.subscribe((data: any) => {
      this.applyDiscountApiCall(data.request, data.enrollmentId);
    })

    this.priceEstimateService.updateQtySubject.subscribe((response: any) => {
      if(response) {
        this.setErrorMessage(response.data.proposal);
        this.setTotalValues(response.data.proposal);
        this.setGridData(response.data);
      } else {
        this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id, true);
      }
    });
    this.priceEstimateService.updateTierForAtoSubject.subscribe((response: any) => {  
      this.priceEstimateService.updateTireMap(response);
      this.gridOptions.api.redrawRows();
    });
    this.priceEstimateService.refreshPeGridData.subscribe(() => {
      if(this.priceEstimateService.showUpdatePA){
        this.displayPAMsg = true;
        this.priceEstimateService.showUpdatePA = false;
      }
      this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id)
    })

    // to show services or suites in add suites pop
    this.subscribers.addMoreSuitesFromGrid = this.priceEstimateService.addMoreSuitesFromGrid.subscribe((services) => {
      this.addMoreSuites(services);
    });

   this.subscribers.addSuiteEmitter = this.priceEstimateService.addSuiteEmitter.subscribe((request) => {
      this.onEnrollmentSelection(this.enrollmentForAddSuite, request); 
      this.closeAddSuitesEventUpdated();
    });

    this.subscribers.delinkHwCxSubject = this.priceEstimateService.delinkHwCxSubject.subscribe((request) => {
      this.reloadDataAfterDelink = true;
      this.delinkHwCx();
    });

    this.subscribers.updateProposalDataForCx = this.priceEstimateService.updateProposalDataForCx.subscribe((proposalData) => {
      this.setErrorMessage(proposalData, true);
      this.setTotalValues(proposalData);
    });
    this.subscribers.openDesriredQtySubject = this.priceEstimateService.openDesriredQtySubject.subscribe((data) => {
      this.openDesriredQty(data);
    });

    //this.vnextService.isRoadmapShown = true;
    this.vnextService.roadmapStep = 3;
    this.vnextService.hideProposalDetail = true;
    if (this.eaStoreService.changeSubFlow){
      this.vnextService.hideRenewalSubPage = true;
      this.isChangeSubFlow = true;
    } else {
      this.isChangeSubFlow = false;
      this.vnextService.hideRenewalSubPage = false;
    }
    if(this.isChangeSubFlow && this.eaService.isUpgradeFlow){
      this.isUpgradeFlow = true;
    } else {
      this.isUpgradeFlow = false;
    }
    this.vnextService.roadmapSubject.subscribe((value:any) => {
      if (this.proposalStoreService.proposalData.status === 'COMPLETE') {
        this.vnextService.redirectTo(value, 'priceEstimate');
      }  else if (value.id === 3) {
          return;
      } else {
        this.vnextService.redirectTo(value);
      }
    })

    this.vnextService.withdrawProposalSubject.subscribe((value: string) => {
      if (value === 'withdraw') {
        this.withdrawFromDistributor();
      } else {
          this.shareWithDistributor();
      }
    })
  }


  selectEnrollment(enrollment) {
    if (enrollment.enrolled) { 
      this.onEnrollmentDeselection(enrollment);    //if not enrolled

    // } 
    // else if (enrollment.id === this.CONST_SERVICE_ENROLLMENT) {
    //   this.addService();
    } else {
      if (enrollment.displayQnA) {   
        this.priceEstimateService.displayQuestionnaire = true;   
      }
     this.priceEstimateStoreService.openAddSuites = true;
     this.enrollmentForAddSuite = enrollment;
      // this.onEnrollmentSelection(enrollment);     //if enrolled
    }
  }


    // addService() {

    //   const modal =  this.modalVar.open(AddServicesComponent, { windowClass: 'lg' });
    //   modal.result.then((result) => {
    //     if (result.continue) {
    //       this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id);
    //     }
    //   });

    // }


    //This method is used to enroll
  //   public openQnAFlyout(enrollment) {      
  //   const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + enrollment.id + '&a=QNA';
  //   this.proposalRestService.getApiCall(url).subscribe((response: any) => {
  //     if(this.vnextService.isValidResponseWithData(response)) { 
  //       this.questionsArray = response.data;
  //       this.priceEstimateService.displayQuestionnaire = true;   
  //       this.questionnaireService.selectedEnrollment = enrollment;
  //       this.renderer.addClass(document.body, 'position-fixed')
  //       this.renderer.addClass(document.body, 'w-100')

  //     }
  //   });
  // }

  openQnAFlyout(enrollment) {
    this.deeplinkForServices = false;
    this.deeplinkForSw = false;
    this.enrollmentForAddSuite = enrollment;
    this.priceEstimateService.displayQuestionnaire = true;
    this.priceEstimateStoreService.openAddSuites = true;
  }
  
  openEAMS() {

    const modal = this.modalVar.open(EamsDeliveryComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modal.componentInstance.eamsPartnerInfo = this.priceEstimateStoreService.eamsDeliveryObj;

    modal.result.then((result) => {
      if (result.continue === true) {
        this.showEAMS = false;
        if (this.priceEstimateStoreService.displayCxGrid){
          this.priceEstimateService.refreshCxGrid.next(true);
        }
      }
    });
  }

  //This method is used to enroll
  onEnrollmentSelection(enrollment:IEnrollmentsInfo,requestJson = {},reQuestForQna?) {  
    const action =   '?a=ENROLLMENT-SELECT';
     const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment/' + enrollment.id + action;
     this.proposalRestService.postApiCall(url,requestJson).subscribe((response: any) => {
       if(this.vnextService.isValidResponseWithData(response)) { 
         if(!enrollment.enrolled){
          enrollment.enrolled = true;
          enrollment.priceInfo = response.data.enrollments[0].priceInfo;
          this.selectedEnrollmentArray.push(enrollment);
          this.priceEstimateService.enrollArr = this.selectedEnrollmentArray;
          if(enrollment.id !== 6){
            this.checkForDisablingHybrid();
          } else {
            enrollment.isHybridSelected = true;
            this.priceEstimateStoreService.isHybridEnrollmentSelected = true;
            this.checkForDisablingCollab();
          }
         }
         else if(this.priceEstimateStoreService.hybridSuiteUpdated){
          this.checkForDisablingHybrid();
         }
         if(this.eaService.isUpgradeFlow){
          this.selectedEnrollmentArray.forEach(enrollmentData => {
            if(enrollmentData.id == response.data.enrollments[0].id){
              enrollmentData.enrolled = response.data.enrollments[0].enrolled ? true : false;
            }
           });
           this.priceEstimateService.enrollArr = this.selectedEnrollmentArray;
           // update selected enrollment data here 
           this.upgradedEnrollmentsArray.forEach(enrollmentData => {
            if(enrollmentData.id == response.data.enrollments[0].id){
              enrollmentData.enrolled = response.data.enrollments[0].enrolled ? true : false;
              enrollmentData.cxAttached = response.data.enrollments[0].cxAttached ? true : false;
            }
           });
         }
         this.togglePortfolio = false;
         this.priceEstimateStoreService.viewAllSelected = false;
         if (!enrollment.primary && enrollment.id === this.CONST_SECURITY_ENROLLMENT) {
          this.isSecurityEnrolled = response.data.enrollments[0].enrolled;
        }
        //  this.selectedEnrollmentArray.push(enrollment);
         this.utilitiesService.sortArrayByDisplaySeq(this.selectedEnrollmentArray);
         this.setErrorMessage(response.data.proposal);
         this.setTotalValues(response.data.proposal);
         this.setGridData(response.data);
        
       }
     });
   }

  // getServiceData() {

  //  const url =  "assets/vnext/servicePriceEstimateData.json";
  //   this.vnextRestService.getApiCallJson(url).subscribe((response: any) => {
  //     if (this.vnextService.isValidResponseWithData(response, true)) {
  //        this.setTotalValues(response.data.proposal);
  //        this.setGridData(response.data);
  //     }
  //   });
  // } 
   
  // enrollmentSelectionAfterQnA(){

  //   if(this.questionnaireService.selectedAnswerMap.size){
  //       const qnaArray = new Array();
  //       this.questionnaireService.selectedAnswerMap.forEach((value: IQuestion, key: string) => {
  //         qnaArray.push(value);
  //     });
    
  //     const request = {
  //         'data':{
  //             'enrollments':[
  //               {"qnas":qnaArray}
  //             ]
  //         }
  //     };
  //     this.onEnrollmentSelection(this.questionnaireService.selectedEnrollment,request,true);
  //   }  
  //   this.priceEstimateService.displayQuestionnaire = false; 
  // }

  //This method is used to deselect enroll
  onEnrollmentDeselection(enrollment:IEnrollmentsInfo) {

    const modal = this.modalVar.open(UnenrollConfirmationComponent, { windowClass: '', backdropClass: 'modal-backdrop-vNext' });
    modal.componentInstance.enrollmentName = enrollment.name;
    modal.result.then((result) => {
      if (result.continue) {
        const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment/' + enrollment.id;
        this.proposalRestService.deleteApiCall(url).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithoutData(response)) {
            enrollment.enrolled = !enrollment.enrolled;
            enrollment.commitInfo.fcSuiteCount = 0;
            enrollment.commitInfo.pcSuiteCount = 0;
            enrollment.cxAttached = false;
            
            if(enrollment.id === 6){
              this.priceEstimateStoreService.isHybridEnrollmentSelected = false;
              enrollment.isHybridSelected = false;
              this.checkForDisablingCollab();
            } else {
              this.checkForDisablingHybrid();
            }
            this.setErrorMessage(response.data.proposal);
            this.setTotalValues(response.data.proposal);
            
            this.selectedEnrollmentArray = this.selectedEnrollmentArray.filter(item => item.id !== enrollment.id);
            this.priceEstimateService.enrollArr = this.selectedEnrollmentArray;
            // check and set totalNetToDisplay empty if enrollment deselection
            if (enrollment.priceInfo && enrollment.priceInfo['totalNetToDisplay']) {
              enrollment.priceInfo['totalNetToDisplay'] = 0;
            }
            if (!enrollment.primary && enrollment.id === this.CONST_SECURITY_ENROLLMENT){
              this.isSecurityEnrolled = false;
              this.securityEnrollmentObj = enrollment;
            }
            if (this.priceEstimateStoreService.viewAllSelected && this.selectedEnrollmentArray.length > 1) {
              this.displayGridForAllEnrollment();
            } else if (this.priceEstimateStoreService.selectedEnrollment.id === enrollment.id && this.selectedEnrollmentArray.length) {
              this.displayGridForEnrollment(this.selectedEnrollmentArray[0].id);
            } else if (!this.selectedEnrollmentArray.length){
              this.primaryFcSuite = false;
              this.isSecurityEnrolled = false;
              this.cxPresentInProposal = false;
              this.displayCxManageTeamMsg = false;
            }
          }
        });
      }

    });
  }

  //This method is used to display grid for individual enrollment selected
  displayGridForEnrollment(enrollmentId, onEnrollmentUpdate = false){
    // call api to get ordIds for network portfolio
    // if ((enrollmentId === this.constantsService.number_1 || enrollmentId === this.constantsService.number_6)  && !this.priceEstimateStoreService.orgIdsArr.length){
    //   this.priceEstimateService.getOrdIds();
    // }

    this.showSelectedEnrollmentsDropDown = false;
    this.togglePortfolio = false;
    this.priceEstimateStoreService.viewAllSelected =  false;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + enrollmentId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {

        // if (this.showServiceData) {
        //     this.getServiceData();
        // }else {
          // check and refresh error messgaes if enrollment data updated from enrollment tile
          if (onEnrollmentUpdate){
            this.setErrorMessage(response.data.proposal);
          }
            this.setTotalValues(response.data.proposal);
            this.setGridData(response.data)
            if ( this.proposalStoreService.isProposalCreated) {
              this.proposalStoreService.isProposalCreated = false;
            }
        // }
        // call api to get ordIds for network portfolio
        // if (enrollmentId === this.constantsService.number_1 && !this.priceEstimateStoreService.orgIdsArr.length){
        //     this.priceEstimateService.getOrdIds();
        // }
        if (!this.priceEstimateStoreService.displayCxGrid) {
          if (this.eaService.customProgressBarMsg.requestOverride) {
            this.eaService.customProgressBarMsg.requestOverride = false;
          } else if (this.eaService.customProgressBarMsg.witdrawReqOverride) {
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          } else {
            this.eaService.customProgressBarMsg.requestOverride = false;
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          }
        }
      }
    });
  }

  //This method is used to display grid for all enrollment selected
  displayGridForAllEnrollment() {
    this.showSelectedEnrollmentsDropDown = false;
    this.priceEstimateStoreService.viewAllSelected =  true;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) 
    {   
        this.setGridData(response.data)
      }
    });
  }


  // recalculateAll() {
  //   if(this.priceEstimateService.updatedTiresMap.size){
  //     this.priceEstimateService.mergeTireIntoSuiteForRecall(this.priceEstimateStoreService.selectedEnrollment.id);
  //   }
  //   const requestJson = {'data': {"enrollments": this.priceEstimateService.suiteSelectionDelectionRequest}};
  //   const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=ATO-INCLUSION-UPDATE';
  //   this.proposalRestService.postApiCall(url, requestJson).subscribe((response: any) => {
  //     if (this.vnextService.isValidResponseWithData(response)) {   

  //       this.showConfirmationMessage = true;  
  //       setTimeout( ()=>{this.showConfirmationMessage = false;  }, 5000); // Hide recalculate success message for 5 sec only    
  //       const enrollment = response.data.enrollments.filter(enrollment => enrollment.id === this.priceEstimateStoreService.selectedEnrollment.id);
  //       const data = {'enrollments': enrollment}

  //       this.setErrorMessage(response.data.proposal);
  //       this.setTotalValues(response.data.proposal);
  //       this.setGridData(data)
  //     }
  //   });
  // }

  setGridData(data) { 
    this.displayCxManageTeamMsg = false;
    this.priceEstimateStoreService.returnCustomerMsg = false;
    this.displayAutoSuggestionPopForSecurity = false;
    this.numberofSelectedSuite = 0;
    this.priceEstimateService.suiteSelectionDelectionMap.clear();
    this.priceEstimateService.suiteSelectionDelectionRequest = [];
    this.priceEstimateService.updatedTiresMap.clear();
    this.priceEstimateStoreService.discountLovs = []; // empty discountLovs array if switching from one enrolmment to other
    this.priceEstimateStoreService.selectedEnrollment.cxAttached = false;
    // this.priceEstimateService.isMerakiSuitesPresent = false;
    if(!this.priceEstimateStoreService.viewAllSelected){
      this.priceEstimateStoreService.selectedEnrollment = data.enrollments[0];
      // check for security portfolio and security tier - convert it from 'TIER_0' to 'Tier 0'
      if (this.priceEstimateStoreService.selectedEnrollment.id === 3 && this.priceEstimateStoreService.selectedEnrollment.securityTier){
        this.priceEstimateStoreService.selectedEnrollment.securityTier = this.priceEstimateService.converAndCapitalizeFirstLetterOfTier(this.priceEstimateStoreService.selectedEnrollment.securityTier)
      }
    } else { // while all seletced , filter out enrollement 5 (services)
      data.enrollments = data.enrollments.filter(enrollment => enrollment.id !==5)
    }
    
    this.priceEstimateService.enableSuiteInclusionExclusion = false;
    this.priceEstimateStoreService.enableRecalculateAll = false;
    this.priceEstimateStoreService.totalDesiredQtyForEnrollment = 0;
    this.priceEstimateStoreService.displayExternalConfiguration = false;
    this.priceEstimateStoreService.displayIbPullMsg = false;
    this.priceEstimateStoreService.externalConfigReq = {}

      this.rowData = this.priceEstimateService.prepareGridData(data.enrollments, this.eaStoreService.changeSubFlow);
    
    // check if no secondary enrollment enrolled and primary has new fcSuiteCount
    if (!this.isSecurityEnrolled && this.isSecurityEnrollmentPresent && !this.primaryFcSuite && this.priceEstimateStoreService.selectedEnrollment.primary && this.priceEstimateStoreService.selectedEnrollment?.commitInfo.fcSuiteCount) {
      this.displayAutoSuggestionPopForSecurity = true;
    }
    if(this.priceEstimateService.showDesriredQty || this.priceEstimateService.showPurchaseAdj){
      this.poolArray = this.utilitiesService.cloneObj(this.rowData)
    }
   // this.onGridReady('');
    if (this.enableCascadeDiscount && this.isCascadeApplied){
      this.enableCascadeDiscount = false;
    }
    if (data.enrollments[0].awaitingResponse) {
      this.priceEstimationPollerService.stopPollerService();
      this.invokePollerService();
    }  
    setTimeout(() => {
      this.gridOptions.api?.forEachNode(node => {

        if (node.level === 1) {
          if (node.data && node.data.inclusion) {
            node.setSelected(true); 
            if(!node.data.disabled){
              this.numberofSelectedSuite++;  
            }            
          }
       
        }else {
          node.setExpanded(true);
        }
        for (let i = 0; i < this.expandedArr.length; i++) {
          if (node.data.poolSuiteLineName === this.expandedArr[i].data.poolSuiteLineName) {
            node.setExpanded(true);
          }
        }
      });
    }, 200);
    setTimeout(() => {
      //  this.disableLastSelectedSuite();  
      // if no messages present if api and meraki conditions then set meraki warning message to show on UI
      // if (!data.proposal.message && this.priceEstimateService.isMerakiSuitesPresent && !this.priceEstimateStoreService.orgIdsArr.length) {
      //   data.proposal.message = this.setMerakiMsg();
      //   this.proposalStoreService.proposalData.message = data.proposal.message;
      // }
    }, 350);   
    this.gridOptions.suppressContextMenu = true;
    if(!this.priceEstimateStoreService.viewAllSelected){
      this.updateEnrollmentTile(data.enrollments[0]);
    }
    // if approver coming from summary open update PA
    if (this.proposalStoreService.isPaApproverComingFromSummary){
      this.openUpdatePurchaseA();
      this.proposalStoreService.isPaApproverComingFromSummary = false;
    }
    if (this.priceEstimateStoreService.displayCxGrid){
      if (!this.cxPresentInProposal){ // if first time adding cx, show message to add deal assurer in teams 
        this.cxPresentInProposal = true;
        this.displayCxManageTeamMsg = true;
      }
      this.priceEstimateService.refreshCxGrid.next(true);
    }
    this.gridOptions.getRowClass = (params) => {
      if(params.node.level === 1) {
        let key = 'ATO-' + params.data.ato;
        if (this.priceEstimateService.messageMap.has(key)) {
          return 'suite-level-error';
        }
      }
    }
    if(this.gridOptions.api){
      this.gridOptions.api.redrawRows();
    }
  }

  //This method is used for getting enrollment data 
  getEnrollmentData(pageload=false) {

    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+this.proposalStoreService.proposalData.objId+'?a=ENROLLMENT-SUMMARY';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
        if(this.vnextService.isValidResponseWithData(response)){
          this.setEnrollmentData(response);
          if(response.data.proposal?.mspInfo) {
            this.proposalStoreService.mspInfo = response.data.proposal?.mspInfo;
            this.priceEstimateService.mspSelectedValue = response.data.proposal?.mspInfo?.mspProposal;
            if (this.eaService.features.MSEA_REL) {
              this.proposalStoreService.mspInfo.managedServicesEaPartner = (response.data.proposal?.buyingProgramTransactionType == this.constantsService.MSEA) ? true : false;
            }
          }
          if(pageload){
            setTimeout(() => {
              this.vnextService.isRoadmapShown = true;
              this.eaStoreService.isPePageLoad = false;
              this.blockUiService.spinnerConfig.displayProgressBar();
            }, 500);
            
          }
        }
    });
  }

  checkForDisablingHybrid() {
    // const hybridEnrollment = this.proposalStoreService.proposalData.enrollments.find(enrollment => enrollment.id === 6);
    // if(hybridEnrollment?.alreadyPurchased){
    //   return;
    // }
    // this.priceEstimateStoreService.hybridSuiteUpdated = false;
    // this.priceEstimateStoreService.disableHybridEnrollment = false;
    // this.priceEstimateStoreService.hasBfRelatedMigratedAtoForHybrid = false;
    // const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment?e=6&a=DEFINE-SUITE';
    // this.eaRestService.getApiCall(url).subscribe((response: any) => {
    //   if (this.vnextService.isValidResponseWithData(response)) {
    //     const pools = response.data.enrollments[0].pools;
    //     pools.forEach((pool) => {
    //       const suites = pool.suites;
    //       for (let i = 0; i < suites.length; i++) {
    //         if (suites[i].notAllowedHybridRelated) {
    //           this.priceEstimateStoreService.disableHybridEnrollment = true;
              
    //           // if any migrted non-hybrid suits purchased, set to disable hybrid portfolio
    //           if(suites[i].hasBfRelatedMigratedAto){
    //             this.priceEstimateStoreService.hasBfRelatedMigratedAtoForHybrid = true;
    //           }
    //           break;
    //         }
    //       }
    //     });
    //     this.proposalStoreService.proposalData.enrollments.forEach((data: IEnrollmentsInfo) => {
    //       if (data.id === 6) {
    //         data.disabled = (this.priceEstimateStoreService.disableHybridEnrollment) ? true : false;
    //         data.isHybridSelected =  data.disabled;
    //         if(data.enrolled){
    //           this.priceEstimateStoreService.isHybridEnrollmentSelected = true;
    //         } else {
    //           this.priceEstimateStoreService.isHybridEnrollmentSelected = false;
    //           //data.isHybridSelected =  false;
    //         }
    //         this.checkForDisablingCollab();
    //       }
    //     })
    //   }
    // });

  }
  checkForDisablingCollab(){
    // if(!this.eaService.isFeatureEnbled){
    //   return;
    // }
    this.proposalStoreService.proposalData.enrollments.forEach((data: IEnrollmentsInfo) => {
      if (data.id === 4) {
        if(!data.alreadyPurchased){
          if(this.priceEstimateStoreService.isHybridEnrollmentSelected){
            data.disabled = true;
            data.isHybridSelected =  true;
          } else {
            data.disabled = false;
            data.isHybridSelected =  false;
          }
        }
      }
    })
  }

  setEnrollmentData(response) {
    this.upgradedEnrollmentsArray = [];
    this.proposalStoreService.proposalData = response.data.proposal;
    this.proposalStoreService.proposalData.enrollments = response.data.enrollments;

      this.eaStoreService.changeSubFlow = this.proposalStoreService.proposalData?.changeSubDeal ? true : false;
    if(this.eaStoreService.changeSubFlow){
      this.isChangeSubFlow = true;
      //check and set included in change sub if already purchased and change sub flow
      this.proposalStoreService.proposalData.enrollments.forEach((enrollment) => {
        if(enrollment?.includedInSubscription && !enrollment.disabled && !(enrollment.id === 4 || enrollment.id === 6)){
          enrollment.includedInChangeSub = true;
        }
      });
    } else{
      this.isChangeSubFlow = false
    }
    if(this.proposalStoreService.proposalData.dealInfo?.subscriptionUpgradeDeal){
      this.upgradedEnrollmentsArray = this.proposalStoreService.proposalData.enrollments;
    }
    if(this.isChangeSubFlow && this.eaService.isUpgradeFlow){
      this.isUpgradeFlow = true;
    } else {
      this.isUpgradeFlow = false;
    }
    // if(!this.eaService.isFeatureEnbled){
    //   this.proposalStoreService.proposalData.enrollments = this.proposalStoreService.proposalData.enrollments.filter(enrollment => enrollment.id !== 6);
    // }
    this.utilitiesService.sortArrayByDisplaySeq(this.proposalStoreService.proposalData.enrollments);
    //this.proposalStoreService.proposalData.enrollments[0]['disabled'] = true;
    this.setErrorMessage(response.data.proposal);
    this.setTotalValues(response.data.proposal); 
    this.setSelectedEnrollmentData();
    this.checkForDisablingHybrid();
    this.checkPaInitStatus();
    setTimeout(() => {
      this.isShowCopiedPropMsg = false;
    }, 5000);
  }


  //This method is used to load grid data as per selected enrollment 
  setSelectedEnrollmentData() { 
    this.cxPresentInProposal = false;
    this.proposalStoreService.proposalData.enrollments.forEach((enrollment) => {
    //To show View Document Center Lable on the sub header components
      if(enrollment.porConsentNeeded){
        this.proposalStoreService.porConsentNeeded = true;
      } 
      

      if (!enrollment.disabled && (enrollment.enrolled || (!enrollment.enrolled && enrollment?.includedInChangeSub && this.isChangeSubFlow && !(enrollment.id === 4 || enrollment.id === 6)))){
        if(enrollment.id === 6){
          this.priceEstimateStoreService.isHybridEnrollmentSelected = true;
        }
        this.selectedEnrollmentArray.push(enrollment);
        this.priceEstimateService.enrollArr = this.selectedEnrollmentArray;
        // check if any primary enrollments enrolled and fcSuite count already present
         if (!enrollment.primary && enrollment.id === this.CONST_SECURITY_ENROLLMENT){
          this.isSecurityEnrolled = true;
          this.setSecurityEnrollmentObj(enrollment);
        }
        // check and set totalNetToDisplay for selected enrollment
        if (enrollment.priceInfo){
          // check for totalNetForRelatedServiceAtos(tcv for cx)
          const totalNet = enrollment.priceInfo.totalNet ? enrollment.priceInfo.totalNet : 0;
          if (enrollment.priceInfo.totalNetForRelatedServiceAtos) {
            enrollment.priceInfo['totalNetToDisplay'] = totalNet + enrollment.priceInfo.totalNetForRelatedServiceAtos;
          } else {
            enrollment.priceInfo['totalNetToDisplay'] = totalNet;
          }
        }
        if (enrollment.commitInfo.fcSuiteCount && enrollment.id !== this.CONST_SERVICE_ENROLLMENT){
          if(enrollment.primary){
            this.primaryFcSuite = true;
          }
        }
        if(this.punchInEnrollmentId && this.punchInEnrollmentId == enrollment.id){
          this.priceEstimateStoreService.selectedEnrollment = enrollment;
        }
        if (enrollment.cxAttached){
          this.cxPresentInProposal = true;
        }
      } else if (!enrollment.primary && enrollment.id === this.CONST_SECURITY_ENROLLMENT){
        this.isSecurityEnrolled = false;
        this.setSecurityEnrollmentObj(enrollment);
      } else if(enrollment.disabled){
        enrollment.alreadyPurchased = true;
      }
    });
  
     if(this.selectedEnrollmentArray.length){
      /*if(!this.priceEstimateStoreService.isHybridEnrollmentSelected){
        this.checkForDisablingHybrid();
      } else {
        this.checkForDisablingCollab();
      }*/
      if(this.proposalStoreService.editProposalParamter){
        this.onGridReady(event); // to recall grid after recalculation and currency code change
        if(this.priceEstimateStoreService.viewAllSelected){
          this.displayGridForAllEnrollment()
        } else {
          this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id);
        }
        
      } else if (this.punchInEnrollmentId || this.reloadDataAfterDelink){
        this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id);
      } else {
        this.displayGridForEnrollment(this.selectedEnrollmentArray[0].id);
      }
     } 
  
     this.proposalStoreService.editProposalParamter = false;
     this.reloadDataAfterDelink = false;
    }

  // set security enrollmnt obj 
  setSecurityEnrollmentObj(enrollment) {
    this.isSecurityEnrolled = enrollment.enrolled;
    this.isSecurityEnrollmentPresent = enrollment.disabled ? false :  true;
    this.securityEnrollmentObj = enrollment;
  }

  setTotalValues(proposalData:IProposalInfo){
    if(proposalData){     
      if(proposalData.priceInfo && proposalData.priceInfo.totalNet){
          if(!this.proposalStoreService.proposalData.priceInfo){
            this.proposalStoreService.proposalData.priceInfo = {};
          }
          this.proposalStoreService.proposalData.priceInfo.totalNet = proposalData.priceInfo.totalNet;
      } else if(this.proposalStoreService.proposalData && this.proposalStoreService.proposalData.priceInfo){
        this.proposalStoreService.proposalData.priceInfo.totalNet = 0;
      }
      if(proposalData.commitInfo){
        this.fullCommitTcv =  proposalData.commitInfo.fullCommitTcv?this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(proposalData.commitInfo.fullCommitTcv +'')) : '0';               
        this.programEligibilty =  proposalData.commitInfo.threshold ? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(proposalData.commitInfo.threshold +'')) : '0'                 
        if(proposalData.programEligibility && proposalData.programEligibility.eligible){
          this.isProgramEligible = true;
        }else {
          this.isProgramEligible = false;
        }
      } else {
        this.fullCommitTcv  = '0';
        this.programEligibilty = '0';
        this.isProgramEligible = false;  
      }
      this.enableContinue = proposalData.allowCompletion; 
        if(this.proposalStoreService.proposalData.status !== 'COMPLETE' && (this.eaService.isResellerLoggedIn || (this.eaService.isDistiLoggedIn && this.eaService.isResellerOpty && this.proposalStoreService.proposalData && !this.proposalStoreService.proposalData.sharedWithDistributor))){
          this.enableContinue = false;
        }
        this.proposalService.isReadOnlyProposal(proposalData.sharedWithDistributor);
    } 
  }

  invokePollerService(){
  //  this.blockUiService.spinnerConfig.noProgressBar();
    this.pollerSubscibers = this.priceEstimationPollerService.invokeGetPollerservice(this.getPollerServiceUrl()).subscribe((res: any) => {
      if (res.data && res.data.enrollments && res.data.enrollments[0]) {
        if (!res.data.enrollments[0].awaitingResponse){
          this.priceEstimationPollerService.stopPollerService();
        }
        this.setErrorMessage(res.data.proposal);
        this.setTotalValues(res.data.proposal);
        this.setGridData(res.data);
      }
    });
  }

  getPollerServiceUrl(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.priceEstimateStoreService.selectedEnrollment.id + '&a=SYNC-PRICES';
    return url;
  }

  setErrorMessage(proposalData, isSyncPrice = false) { 
    this.proposalStoreService.isSyncPrice = isSyncPrice;
    this.proposalStoreService.proposalData.message = proposalData.message;
    if(proposalData?.message) {
      this.priceEstimateService.prepareMessageMapForGrid(proposalData.message);
      // check and set error icon for portfolio if error present in proposal
      if (proposalData?.message.hasError){
        this.priceEstimateService.setErrorIconForPortFolios();
      } else {
        this.priceEstimateService.resetErrorIconForPortFolios();
      }
    } else {
      this.priceEstimateService.resetErrorIconForPortFolios();
      this.priceEstimateService.messageMap.clear();
      this.priceEstimateStoreService.hasRSDError = false;
      this.priceEstimateStoreService.rsdErrorMsg = '';
    }
    // Disable continue button when error is coming from service 
    if (this.proposalStoreService.proposalData.message && this.proposalStoreService.proposalData.message.hasError) {
      this.errorMessage = true;
    }else {
      this.errorMessage = false;
      // this.priceEstimateService.messageMap.clear();
    }
  }

  onGridReady(event) {

    // if (this.priceEstimateStoreService.selectedEnrollment.id === this.CONST_SERVICE_ENROLLMENT) {
    //    this.onServiceGridReady(event);
    //    return;
    // }

    this.columnDefs = [
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.SOLUTIONS_SUITES_LABEL'),
        "field": "poolSuiteLineName",
        "cellRenderer": "agGroupCellRenderer",
        "width": 680,
        "headerComponentFramework": <{ new(): SpnaSuitesHeaderRenderComponent }>(
          SpnaSuitesHeaderRenderComponent),
        "cellRendererParams": {
              innerRenderer: 'suitesRender'
            },
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      // {
      //   "headerName": "Suites",
      //   "field": "suites",
      //   "checkboxSelection": true,
      //   "headerCheckboxSelection": true,
      //   "cellRenderer": 'agGroupCellRenderer',
      //   "cellRendererParams": {
      //     innerRenderer: 'suitesRender'
      //   },
      //   "pinned": true,
      //   "width": 270,
      //   "lockPosition": true,
      //   "minWidth": 60,
      //   "suppressMenu": true
      // },
      // {
      //   "headerName": "Quantity Found in Customer Install Base",
      //   "field": "installBase",
      //   "width": 120,
      //   "lockPosition": true,
      //   "minWidth": 60,
      //   "suppressMenu": true
      // },
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.DESIRED_QUANTITY'),
        "field": "desiredQty",
        "width": 90,
        "headerClass": "text-right",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.PROGRAMMATIC_DISCOUNT_LABEL'),
        "field": "multiPrgDiscount",
        "width": 95,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true,
        "cellRenderer":'suitesRender'
      },
      {
        "headerName": this.localizationService.getLocalizedString('common.TOTAL_LIST_PRICE') + " (" + this.getCurrencyCode()+")",
        "field": "listPrice",
        "headerClass": "text-right",
        "width": 120,
        "cellClass": "num-value",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('common.DISCOUNT_PERCENTAGE'),
        "field": "subscriptionDiscount",
        "width": 110,
        "cellClass": "num-value",
        "lockPosition": true,
        "headerClass": "text-right",
        "minWidth": 60,
        "suppressMenu": true,
        "cellRenderer":'suitesRender'

      },
      // {
      //   "headerName": "Service Discount (%)",
      //   "field": "serviceDiscount",
      //   "width": 110,
      //   "cellClass": "num-value",
      //   "lockPosition": true,
      //   "minWidth": 60,
      //   "headerClass": "text-right",
      //   "suppressMenu": true
      // },
      {
        "headerName": this.localizationService.getLocalizedString('common.OTD') + " (" + this.getCurrencyCode()+")" ,
        "field": "purchaseAdjustment",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow"><span class="path1"></span><span class="path2"></span><span class="path3 softwarePaBreakup"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "width": 125,
        "lockPosition": true,
        "minWidth": 60,
        "cellClass": "num-value",
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('common.TOTAL_CONTRACT_VALUE') + " (" + this.getCurrencyCode()+")",
        "field": "totalContractValue",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow" ><span class="path1"></span><span class="path2"></span><span class="path3 tcvBreakup"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "width": 120,
        "cellClass": "num-value",
        "cellRenderer": 'tcvRender',
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      }
    ];
    for (let i = 0; i < this.columnDefs.length; i++) {
      const column = this.columnDefs[i];
      if (column['field'] === 'poolSuiteLineName') {
        column.checkboxSelection = false;
      } else if (column['field'] === 'suites') {
        column['cellClass'] = (params) => {
          return this.suiteCell(params);
        }
      } else if (column['field'] === 'desiredQty') {
        column['cellRenderer'] = (params) => {
          return this.desiredQtyRender(params);
        },
        column['cellClass'] = (params) => {
          return this.desiredCellClass(params);
        }
      }
      if (this.priceEstimateStoreService.viewAllSelected  && (column['field'] === 'purchaseAdjustment' || column['field'] === 'totalContractValue') && column["headerComponentParams"]){
        delete column["headerComponentParams"]
      }
      //<!--Start Disti flow for sept release-->
      if (this.eaService.isResellerLoggedIn  &&  column['field'] === 'totalContractValue' && column["headerComponentParams"]){
        delete column["headerComponentParams"]
      }
      //<!--End Disti flow for sept release-->
    }
    //this.gridOptions.api.setColumnDefs(this.columnDefs);
    if(this.gridOptions.api) {
      this.gridOptions.api.setColumnDefs(this.columnDefs);
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 1000);
    }
    //this.gridOptions.api.setRowData(this.rowData); 
  }


    onServiceGridReady(event) {
    this.columnDefs = [
      {
        "headerName": "Solutions & Suites",
        "field": "poolSuiteLineName",
        "cellRenderer": "agGroupCellRenderer",
        "width": 630,
        "suppressSizeToFit": true,
        "cellRendererParams": {
              innerRenderer: 'suitesRender'
            },
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": "Quantity Found in Install Base",
        "field": "total",
        "width": 130,
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow"><span class="path1"></span><span class="path2"></span><span class="path3 serviceInstallBase"></span><span class="installBase"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
        {
        "headerName": this.localizationService.getLocalizedString('price-estimation.BILLING_SKU_QTY_LABEL'),
        "field": "desiredQty",
        "width": 95,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true,
        "cellRenderer":'suitesRender'
      },
      {
        "headerName": "List Price (" + this.getCurrencyCode()+")",
        "field": "listPrice",
        "headerClass": "text-right",
        "width": 130,
        "cellClass": "num-value",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": "Service Discount (%)",
        "field": "serviceDiscount",
        "width": 110,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": "One Time Discount (" + this.getCurrencyCode()+")" ,
        "field": "purchaseAdjustment",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow"><span class="path1"></span><span class="path2"></span><span class="path3 servicePaBreakup"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "width": 145,
        "lockPosition": true,
        "minWidth": 60,
        "cellClass": "num-value",
        "suppressMenu": true
      },
      {
        "headerName": "Total Contract Value (" + this.getCurrencyCode()+")",
        "field": "totalContractValue",
        "headerClass": "text-right",
        "width": 120,
        "cellClass": "num-value",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      }
    ];
    for (let i = 0; i < this.columnDefs.length; i++) {
      const column = this.columnDefs[i];
    
      if (column['field'] === 'suites') {
        column['cellClass'] = (params) => {
          return this.suiteCell(params);
        }
      } else if (column['field'] === 'desiredQty') {
        column['cellRenderer'] = (params) => {
          return this.desiredQtyRender(params);
        },
        column['cellClass'] = (params) => {
          return this.desiredCellClass(params);
        }
      }
      if (this.priceEstimateStoreService.viewAllSelected  && (column['field'] === 'purchaseAdjustment' || column['field'] === 'total') && column["headerComponentParams"]){
        delete column["headerComponentParams"]
      }
    }
    if(this.gridOptions.api) {
       this.gridOptions.api.setColumnDefs(this.columnDefs);
       this.gridOptions.api.sizeColumnsToFit();
    }
    //this.gridOptions.api.setRowData(this.rowData); 
  }

  getNodeChildDetails(rowItem) {
    if (rowItem.childs && rowItem.childs.length) {
      return {
        group: true,
        children: rowItem.childs,
        key: rowItem.group
      };
    } else {
      return null;
    }
  }

  onCellClicked($event) {

    // if ($event.colDef.field === 'desiredQty') {
    //   const editClass = $event.event.target.classList.value;
    //   const isIconClick = editClass.search('i-vNext-edit-filled');
    //   if (isIconClick > -1) {
    //      this.poolArray = this.utilitiesService.cloneObj(this.rowData)
    //      this.selectedAto = $event.data.ato;
    //      this.selectedPool = $event.data.poolName;
    //      this.priceEstimateService.showDesriredQty = true;
    //       this.gridOptions.api.forEachNode(node => {
    //         if (node.level === 1 && node.expanded) {
    //           this.expandedArr.push(node)
    //         }
    //       });
    //      this.renderer.addClass(document.body, 'position-fixed')
    //      this.renderer.addClass(document.body, 'w-100')
    //   }
    // }
  }


    onHeaderClick($event) {
      const headerClass = $event.target.classList.value;
      const isDiscountIcon = headerClass.search('average-discount');
      const isPurchaseIcon = headerClass.search('softwarePaBreakup');
      const isTCVIcon = headerClass.search('tcvBreakup');

      if (isDiscountIcon > -1) {
         this.priceEstimateService.showPurchaseAdjustmentBreakUp = true;
         this.breakupColumn = this.localizationService.getLocalizedString('price-estimation.AVERAGE_DISCOUNT_BREAK_UP_LABEL');
      } else if (isPurchaseIcon > -1) {
        this.priceEstimateService.showPurchaseAdjustmentBreakUp = true;
        this.breakupColumn = this.localizationService.getLocalizedString('price-estimation.OTD_BREAK_UP_LABEL');
     } else if (isTCVIcon > -1) {
      this.priceEstimateService.showTcvBreakUp = true;
   }
  }

  displaySuiteCheckbox(params) {
    if(params.node.level === 1 && !this.priceEstimateStoreService.displayExternalConfiguration) {
      return true;
    }
  }

  suiteCell(params) { 
    if(params.node.level === 0) {
      return 'hideExpand'
    }
  }

  desiredCellClass(params) {
    if (params.node.level > 1 && !this.priceEstimateStoreService.viewAllSelected && !this.proposalStoreService.isReadOnly && !this.priceEstimateStoreService.enableRecalculateAll && (!params.data.supportPid || params.data.enrollmentId === 5) && !this.priceEstimateStoreService.displayExternalConfiguration) {
      if (params.value || params.value === 0)
        return 'num-value';
    } else {
      return 'num-value no-edit';
    }
  }

  desiredQtyRender(params) {
    if (params.data.supportPid && params.data.enrollmentId !== 5) {
      if (params.data.desiredQty) {
        return '<span class="selected-cell-with-tick"><span class="icon-tick-01 mr-2"></span><span>Selected</span></span>'
      }
      return ''
    }
    else if (params.node.level > 1 && !this.priceEstimateStoreService.viewAllSelected && !this.priceEstimateStoreService.enableRecalculateAll && !this.proposalStoreService.isReadOnly && !this.priceEstimateStoreService.displayExternalConfiguration) {
      if (params.value || params.value === 0)
        return '<span></span><span class="value">' + params.value + '</span>'
    } else {
      if(params.data.disabled){
        return '--';
      }
      const value = (params.value === undefined) ? '' : params.value;

      return value;
    }
  }

  openEditEnrollment(enrollment) {

    this.updateEnrollemntBillingDetails = enrollment;

    // if (enrollment.id === this.CONST_SERVICE_ENROLLMENT) {
    //   this.addService();
    // }else {
      this.priceEstimateService.showEnrollments = true;
      this.renderer.addClass(document.body, 'position-fixed')
      this.renderer.addClass(document.body, 'w-100')
   // }
  }


  applyDiscount() {
    const reqObj = this.priceEstimateService.setReqjsonForLovs(this.priceEstimateStoreService.selectedEnrollment.id, this.selectedEnrollmentArray); // set request obj to get discounLovs for selected enrollment
    // check for discount lov's present and call api
    if (this.eaService.features.NPI_AUTOMATION_REL) {
      const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/discount-lovs';
      this.proposalRestService.postApiCall(url, reqObj).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.priceEstimateStoreService.discountLovs = response.data;
          this.openApplyDiscountModal(); // open apply discount modal if data present and set
        }
      });
    } else {
      if (!this.priceEstimateStoreService.discountLovs.length) {
        const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/discount-lovs';
        this.proposalRestService.postApiCall(url, reqObj).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithData(response)) {
            this.priceEstimateStoreService.discountLovs = response.data;
            this.openApplyDiscountModal(); // open apply discount modal if data present and set
          }
        });
      } else {
        this.openApplyDiscountModal(); // open apply discount modal if data present and set
      }
    }
  }

  // method to open discount modal
  openApplyDiscountModal() {
    const modal = this.modalVar.open(ApplyDiscountComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modal.result.then((result) => {
      if (result.continue) {
        const requestObj = this.priceEstimateService.setReqObjForDisocunts(result.discount, this.priceEstimateStoreService.selectedEnrollment.id);
        this.applyDiscountApiCall(requestObj, this.priceEstimateStoreService.selectedEnrollment.id);
      }
    });
    modal.componentInstance.discountArr = this.priceEstimateService.setEnrollmentsDiscLovs();
    modal.componentInstance.isFromHeaderLevel = true;
  }
 
  applyDiscountApiCall(requestObj, enrollmentId){
    // call api to send applied discounts obj
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=UPDATE_DISC'
    this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // call recalculate here
        if (response.data.enrollments) {
          const enrollment = response.data.enrollments.filter(enrollment => enrollment.id === enrollmentId);
        const data = {'enrollments': enrollment}
        for (let i = 0; i < this.proposalStoreService.proposalData.enrollments.length; i++) {
          if (this.proposalStoreService.proposalData.enrollments[i].id === response.data.enrollments[0].id) {
             this.proposalStoreService.proposalData.enrollments[i].priceInfo = response.data.enrollments[0].priceInfo;
          }
        }
        this.setErrorMessage(response.data.proposal);
        this.setTotalValues(response.data.proposal);
        if (enrollmentId === 5){
          this.enableCascadeDiscount = true;
          this.isCascadeApplied = false;
          this.priceEstimationPollerService.stopPollerService();
        }
        this.setGridData(data)
        } else {
          this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id)

        }
      }
    });
  }

  // dialDown() {
  //   const modal = this.modalVar.open(DialDownRampComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
  //   modal.result.then((result) => {
  //   });
  // }

  public onRowSelected($event) {
    if ($event.node.level === 1 && this.priceEstimateService.enableSuiteInclusionExclusion) {
      if (!$event.node.selected) {
        this.numberofSelectedSuite--;
      } else {
        this.numberofSelectedSuite++;
        this.gridOptions.getRowClass = (params) => {
          if ($event.node.data.poolSuiteLineName !== params.data.poolSuiteLineName) {
            return 'enableCheck';
          }
        }

      }
      this.priceEstimateService.prepareRecalculateAllRequst($event.data.enrollmentId, $event.data.ato, $event.node.selected);
      //this.updateSuitesCount($event.node.data.enrollmentId); //Update suite count in enrollment 
     // this.disableLastSelectedSuite();
    }
  }

  closeDesiredQtyPopup(event){
    this.priceEstimateService.showDesriredQty = false;
    this.poolArray = [];
    this.renderer.removeClass(document.body, 'position-fixed')
    this.renderer.removeClass(document.body, 'w-100')
    if (this.displayAutoSuggestionPopForSecurity && (this.proposalStoreService.proposalData.scopeInfo && (!this.proposalStoreService.proposalData.scopeInfo.returningCustomer || (this.proposalStoreService.proposalData.scopeInfo?.returningCustomer && this.proposalStoreService.proposalData.scopeInfo?.newEaidCreated)) )){
      // open modal for selecting secondary enrollment 
      // commented out for future use if needed
      // this.showAutoSuggestSecondaryEnrollment(); 
    }
  }

 //Update suite count in enrollment 
  updateSuitesCount(enrollmentId) {
     for (let i = 0; i < this.proposalStoreService.proposalData.enrollments.length; i++) {
      const enrollment = this.proposalStoreService.proposalData.enrollments[i];
      if(enrollment.id === enrollmentId && enrollment.commitInfo) {
          enrollment.commitInfo.fcSuiteCount =  enrollment.commitInfo.fcSuiteCount - 1;
          enrollment.commitInfo.pcSuiteCount =  enrollment.commitInfo.pcSuiteCount - 1;
         break;
      }
     } 
  }  

  updateEnrollmentTile(updatedEnrollment) {
    for (let i = 0; i < this.proposalStoreService.proposalData.enrollments.length; i++) {
      if (this.proposalStoreService.proposalData.enrollments[i].id === updatedEnrollment.id) {
        this.proposalStoreService.proposalData.enrollments[i].billingTerm = updatedEnrollment.billingTerm;
        this.proposalStoreService.proposalData.enrollments[i].commitInfo = updatedEnrollment.commitInfo;
        this.proposalStoreService.proposalData.enrollments[i].cxAttached = updatedEnrollment.cxAttached;
        //check and set totalNetToDisplay for updated portfolio
        if (this.proposalStoreService.proposalData.enrollments[i].priceInfo){
          this.proposalStoreService.proposalData.enrollments[i].priceInfo['totalNetToDisplay'] = updatedEnrollment?.priceInfo?.totalNet;
        } else {
          this.proposalStoreService.proposalData.enrollments[i]['priceInfo'] = {
            'totalNetToDisplay': updatedEnrollment?.priceInfo?.totalNet
          }
        }
        break;
      }
    }
  }


  inItGrid(){
    this.priceEstimateService.enableSuiteInclusionExclusion = true;
  }
  enrollmentDetailsUpdated(event) {
    if (event) {
      if(this.priceEstimateStoreService.viewAllSelected){
        this.displayGridForAllEnrollment();
        this.updateEnrollmentTile(event[0]);
      } else if (event[0].id === this.priceEstimateStoreService.selectedEnrollment.id) {
        this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id, true)
      }
    }

    this.priceEstimateService.showEnrollments = false;
    this.renderer.removeClass(document.body, 'position-fixed')
    this.renderer.removeClass(document.body, 'w-100')
  }
  
  closeAddSuitesEventUpdated() {
    this.deeplinkForServices = false;
    this.deeplinkForSw = false;
    // this.priceEstimateStoreService.hybridSuiteUpdated = false;
    this.priceEstimateStoreService.openAddSuites = false;
  }

  ngOnDestroy(){
    this.priceEstimateStoreService.hasRSDError = false;
    this.priceEstimateStoreService.rsdErrorMsg = '';
    this.priceEstimateStoreService.hybridSuiteUpdated = false;
    this.priceEstimateStoreService.hasBfRelatedMigratedAtoForHybrid = false;
    this.priceEstimateStoreService.disableHybridEnrollment = false;
    this.priceEstimateStoreService.isHybridEnrollmentSelected = false;
    this.priceEstimateStoreService.errorMessagesPresentForCx = false;
    this.priceEstimateStoreService.displayIbPullMsg = false;
    this.priceEstimateStoreService.eamsDeliveryObj = {};
    this.priceEstimationPollerService.stopPollerService();
    this.priceEstimateStoreService.selectedEnrollment = {};
    this.isCascadeApplied = false;
    this.enableCascadeDiscount = false;
    this.priceEstimateStoreService.isCxPresent = false;
    this.priceEstimateStoreService.totalDesiredQtyForEnrollment = 0;
    this.priceEstimateStoreService.displayExternalConfiguration = false;
    this.eaStoreService.showOpenCaseSubject.next(false);
    this.priceEstimateService.showDesriredQty = false;
    this.renderer.removeClass(document.body, 'position-fixed')
    this.renderer.removeClass(document.body, 'w-100')
    this.priceEstimateStoreService.viewAllSelected =  false;
    this.priceEstimateStoreService.discountLovs = [];
    this.priceEstimateStoreService.enableRecalculateAll = false;
    // this.priceEstimateService.isMerakiSuitesPresent = false;
    this.priceEstimateService.suiteSelectionDelectionMap.clear();
    this.priceEstimateService.suiteSelectionDelectionRequest = [];
    this.priceEstimateService.updatedTiresMap.clear();
    this.eaService.showCaseManagementSubject.next(false);
    this.priceEstimateService.updateProposalSubject.next(false);
    this.proposalService.clearWorkspaceCaseInputInfo();
    if (this.subscribers.applyDiscountForSuiteSubj){
      this.subscribers.applyDiscountForSuiteSubj.unsubscribe();
    }
    this.eaStoreService.pageContext = '';
    this.priceEstimateStoreService.openAddSuites = false;
    if (this.subscribers.addMoreSuitesFromGrid){
      this.subscribers.addMoreSuitesFromGrid.unsubscribe();
    }
    if (this.subscribers.updateProposalDataForCx){
      this.subscribers.updateProposalDataForCx.unsubscribe();
    }
    if (this.subscribers.addSuiteEmitter){
      this.subscribers.addSuiteEmitter.unsubscribe();
    }

    if (this.subscribers.delinkHwCxSubject){
      this.subscribers.delinkHwCxSubject.unsubscribe();
    }

    if (this.subscribers.openDesriredQtySubject){
      this.subscribers.openDesriredQtySubject.unsubscribe();
    }
    this.vnextService.isRoadmapShown = false;
    this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.clear();
    this.priceEstimateStoreService.renewalSubscriptionDataForSuite = {};
    this.eaStoreService.editName = false;
    this.proposalStoreService.porConsentNeeded = false;
    this.projectStoreService.projectData.selectedQuote = undefined;
    if(this.eaStoreService.isValidationUI){
      sessionStorage.setItem(
        'redirectOWB',
        JSON.stringify(this.redirectOWB));
    }
  }

  viewEligibilityDetails() {
    // filter out only enrolled portfolios
    let selectedEnrollmentArray = this.selectedEnrollmentArray.filter(enrollment => enrollment.enrolled);
    if (selectedEnrollmentArray.length) {
      const modal = this.modalVar.open(EligibilityStatusComponent, { windowClass: 'lg cust-elig' });
    }

  }
  
  hideBenifitsMsg(){
    this.showBenefitsMsg = false;
  }


  //This method is use to check and disable if there is only one suite selected in the grid
   disableLastSelectedSuite(){  
    if(this.numberofSelectedSuite === 1){
      this.gridOptions.api?.forEachNode(node => {       
        if (node.level === 1) {
          if (node.isSelected()) {              
            this.gridOptions.getRowClass = (params) => {
              if(params.data.poolSuiteLineName === node.data.poolSuiteLineName || params.data.disabled) {
                return 'checkboxDisable';
              }
            }
          }
        } 
      });
    } else{
      this.gridOptions.api.forEachNode(node => {
        if (node.level === 1) {
          this.gridOptions.getRowClass = (params) => {
            if(this.proposalStoreService.isReadOnly || this.priceEstimateStoreService.viewAllSelected ||  params.data.disabled  ){
                return 'checkboxDisable';
          }
          }

          
        }
      });
    }   
    this.gridOptions.api?.redrawRows();
  }

  // disableGridCheckbox() {
  //   this.gridOptions.api.forEachNode(node => {
  //     if (node.level === 1) {
  //       this.gridOptions.getRowClass = (params) => {
  //           return 'checkboxDisable';
  //       }
  //     }
  //   });
  //   this.gridOptions.api.redrawRows();
  // }

  continue() {
    if(this.proposalStoreService.isReadOnly && (!this.proposalStoreService.proposalData.exception || !this.proposalStoreService.proposalData.exception.allowWithdrawl)){
      if (this.proposalStoreService.proposalData.status === 'COMPLETE'){
        this.proposalStoreService.showProposalDashboard = true;
      } else {
        this.proposalStoreService.showProposalSummary = true;
      }
      this.proposalStoreService.showPriceEstimate = false;
    } else {
      this.proposalService.checkisRsdDue('pe'); // method to check RSD past system date and allow continue or throw message
    }
    
  }

  checkForFutureConsumableItems() {
    //const url =  "assets/vnext/future-consumable.json";
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.setOptInForPools(response.data.enrollments);
      }
    });
  }

  setOptInForPools(enrollments) {
    let displayFutureConsumablePopup = false;
    for (let enrollmentData of enrollments) {
      for (let poolData of enrollmentData.pools) {
        for (let suiteData of poolData.suites) {
          if (suiteData.optIn && suiteData.optIn.optIn) {
            poolData.optIn = true;
          }
          if (!this.proposalStoreService.proposalData.partnerInfo) {
            suiteData.partner = false;
          } else {
            suiteData.partner = suiteData.optIn && (suiteData.optIn.fulfillmentType !== "CISCO");
          }
        }
        if (poolData.optIn) {
          enrollmentData.optIn = true;
        }
      }
      if (enrollmentData.optIn) {
        displayFutureConsumablePopup = true;
      }
    }

    if(displayFutureConsumablePopup){
      this.displayConsumablePopup(enrollments);
    } else {
      this.proposalStoreService.showProposalSummary = true;
      this.proposalStoreService.showPriceEstimate = false;
    }
  }

  displayConsumablePopup(enrollments) {
    const modal = this.modalVar.open(FutureConsumableItemsComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modal.componentInstance.enrollmentData = enrollments;
    modal.result.then((result) => {
      if(result.continue){
        this.proposalStoreService.showPriceEstimate = false;
        this.proposalStoreService.showProposalSummary = true;
      }  
    });
    
  }

  onResize(event) {
    if(this.gridOptions && this.gridOptions.api){
    this.gridOptions.api.sizeColumnsToFit();
    }
  }

  getCurrencyCode(){
    if(this.proposalStoreService.proposalData && this.proposalStoreService.proposalData.currencyCode){
    return this.proposalStoreService.proposalData.currencyCode;
    } else {
      return 'USD'
    }
  }

  openPurchaseAdj() {
    this.poolArray = this.utilitiesService.cloneObj(this.rowData)
    this.priceEstimateService.showPurchaseAdj = true;
    this.renderer.addClass(document.body, 'position-fixed');
    if(this.priceEstimateStoreService.displayExternalConfiguration || this.priceEstimateStoreService.selectedEnrollment.id === 6){
      this.priceEstimateService.paForCollab = true;
    } else {
      this.priceEstimateService.paForCollab = false;
    }
  }

  closeEditProposalParam(event){
    if(event){
      this.getEnrollmentData();//reset all data on PE page;
      if(this.priceEstimateStoreService.displayCxGrid) {
        this.priceEstimateService.updateProposalSubject.next(true); // to update grid header on update proposal
      }
      // if(this.priceEstimateStoreService.viewAllSelected){
      //   const data  = this.proposalStoreService.proposalData.enrollments.filter(enrollment => enrollment.enrolled)
      //   this.setGridData({'enrollments': data});
      // }
      // else if(this.priceEstimateStoreService.selectedEnrollment.id){
      //   const enrollmentForGrid = this.proposalStoreService.proposalData.enrollments.find(enrollment => enrollment.id === this.priceEstimateStoreService.selectedEnrollment.id);
      //   this.setGridData({'enrollments': [enrollmentForGrid]});
      // }
    } else {
      this.proposalStoreService.editProposalParamter = false;
    }
  }

  // Open manage team modal
  openManageTeam() {
    if(!this.proposalStoreService.proposalEditAccess && !this.projectStoreService.projectEditAccess){
      return;
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modal = this.modalVar.open(ManageTeamComponent, ngbModalOptions);

  }

  // to select secondary enrollment
  showAutoSuggestSecondaryEnrollment(){
    this.primaryFcSuite = true;
    // open pop
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'md',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modal = this.modalVar.open(AddSecurityServiceEnrollComponent, ngbModalOptions);
    modal.result.then((result) => {
      if (this.displayAutoSuggestionPopForSecurity){
        this.displayAutoSuggestionPopForSecurity = false;
      }
      if (result.continue) {
        this.priceEstimateService.displayQuestionnaire = true;
        this.priceEstimateStoreService.openAddSuites = true;
        this.enrollmentForAddSuite = result.enrollment;
      }
    });
    modal.componentInstance.isSecurityEnrollmentPresent = this.isSecurityEnrollmentPresent;
    modal.componentInstance.securityEnrollmentObj = this.securityEnrollmentObj;
    modal.componentInstance.selectedEnrollemntName = this.priceEstimateStoreService.selectedEnrollment.name;
    modal.componentInstance.showSecurity = this.displayAutoSuggestionPopForSecurity;
  }

  // View proposal List
  viewProposalList() {

    this.router.navigate(['ea/project/proposal/list']);
    this.proposalStoreService.proposalData = {};
  }

  engageSupportTeam(){
    if (this.proposalStoreService.proposalData.subscriptionInfo && this.proposalStoreService.proposalData.subscriptionInfo.existingCustomer && !this.requestPa) {
      this.checkPaInitStatus(true);
    } else {
      this.getEngageSupportTeamReasons();
    }
    
  }

  getEngageSupportTeamReasons(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +  '/initiate-exception-request?exceptionType=PURCHASE_ADJUSTMENT_REQUEST';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.requestExceptionOption.exceptions){
          this.openSupportModel(response.data.requestExceptionOption);
        } else {
          // show no data message
        }
      }
    });
  }

  openSupportModel(data) {
    const modal = this.modalVar.open(EnagageSupportTeamComponent, { windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modal.componentInstance.exceptionDataObj = data;
    modal.componentInstance.isRequestedEnageSupport = this.requestPa;
    modal.result.then((result) => {
      if (result.continue) {
        if (result.engage){
          if(this.requestPa){
            this.updateEngageSupport(result.requestData);
          } else {
            this.requestEngageSupport(result.requestData);
          }
        } else {
          this.withdrawSupport();
        }
        
      }
    });
  }

  updateEngageSupport(data){
    const requestObj = {};
    requestObj["data"] = {
      "proposalObjId" :this.proposalStoreService.proposalData.objId,
      "exceptionType" : "PURCHASE_ADJUSTMENT_REQUEST",
      'selectedReasons': data.exceptions[0].selectedReasons,
      'justification': data.comment,
    }
    const url = this.vnextService.getAppDomainWithContext + 'proposal/submit-pa-exception-exst-cust';
    this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
          this.vnextStoreService.toastMsgObject.paExceptionRequested = true;
          if (this.proposalStoreService.proposalData.subscriptionInfo && this.proposalStoreService.proposalData.subscriptionInfo.justification){
            this.proposalStoreService.proposalData.subscriptionInfo.justification = response.data.justification;
          }
          setTimeout(() => {
            this.vnextStoreService.cleanToastMsgObject();
          }, 1500);
      }
    });
  }

  checkPaInitStatus(openModel?){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/pa-init-status?p=' + this.proposalStoreService.proposalData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      //Once data is loaded then show support button 
      this.showSupportButton = true;
      if (this.vnextService.isValidResponseWithoutData(response)){
        this.requestPa = response.data;
        if(openModel){
          this.getEngageSupportTeamReasons();
        }
      }
    });
  }

  requestEngageSupport(data) {

    const requestObj = {};
    requestObj["data"] = {
      'reasons': data.exceptions[0].selectedReasons,
      'justification': data.comment,
    }
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/initiate-pa-request'
    this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
          this.requestPa = !this.requestPa;
          this.vnextStoreService.toastMsgObject.paExceptionRequested = true;
          setTimeout(() => {
            this.vnextStoreService.cleanToastMsgObject();
          }, 2000);
      }
    });
  }

  withdrawSupport() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/pa-request/CANCEL'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
          this.requestPa = !this.requestPa;
          this.vnextStoreService.toastMsgObject.paExceptionWithdrawn = true;
          setTimeout(() => {
            this.vnextStoreService.cleanToastMsgObject();
          }, 2000);
      }
    });
  }

  openUpdatePurchaseA(){
    this.priceEstimateService.showUpdatePA = true;
  }

  requestDocuments() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'lg';
    ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';
    const modalRef = this.modalVar.open(RequestDocumentsComponent, ngbModalOptionsLocal);
  }

  // Navigate to original proposal
  openOriginalProposal() {
    this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.originalProposalObjId]);
  }

  cascadeDiscount(){
    // const ngbModalOptionsLocal = this.ngbModalOptions;
    // ngbModalOptionsLocal.windowClass = 'md';
    // ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';
    // const modalRef = this.modalVar.open(ServicesCascadeDiscountConfirmationComponent, ngbModalOptionsLocal);
    // modalRef.result.then((result) => {
    //   if (result.continue) {
    //    // call api for cascade discount
        
    //   }
    // });
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=CASCADE-DISCOUNT';
    this.proposalRestService.postApiCall(url, {}).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // call recalculate here
        if (response.data.enrollments) {
          const enrollment = response.data.enrollments.filter(enrollment => enrollment.id === this.priceEstimateStoreService.selectedEnrollment.id);
        const data = {'enrollments': enrollment}
        this.isCascadeApplied = true;
        this.setErrorMessage(response.data.proposal);
        this.setTotalValues(response.data.proposal);
        this.setGridData(data)
        } else {
          this.isCascadeApplied = false;
        this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id)
        }
      }
    });
  }

  viewAndEditHardwareSupport() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=VIEW-HARDWARE-ITEMS'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response) && response.data.redirectionUrl) {
        window.open(response.data.redirectionUrl, '_self');
      }
    });
  }

  toggleAllPortfolio()  {
    this.togglePortfolio = !this.togglePortfolio;
    if(this.togglePortfolio){
      this.displayGridForAllEnrollment();
    } else {
      this.displayGridForEnrollment(this.priceEstimateStoreService.selectedEnrollment.id);
    }

  }

  addMoreSuites(forServices?) {
    if (forServices){
      this.deeplinkForServices = true;
      this.deeplinkForSw = false;
    } else {
      this.deeplinkForServices = false;
      this.deeplinkForSw = true;
    }
    if (!forServices && !this.priceEstimateStoreService.selectedEnrollment.enrolled && this.priceEstimateStoreService.selectedEnrollment.displayQnA){
      this.openQnAFlyout(this.priceEstimateStoreService.selectedEnrollment)
    } else {
      if (this.priceEstimateStoreService.selectedEnrollment.displayQnA){
        this.priceEstimateService.displayQuestionnaire = true;
      }  
      this.priceEstimateStoreService.openAddSuites = true;
      this.enrollmentForAddSuite = this.priceEstimateStoreService.selectedEnrollment;
    }
  }

  // method to Upgrade Summary Modal popup
  openUpgradeSummary(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment';
      this.proposalRestService.getApiCall(url).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {   
        //  this.upgradeSummaryData = response.data.enrollments;
          this.upgradeSummaryData = this.priceEstimateService.prepareUpgradeSummaryData(response.data);
          if (response.data.enrollments){
            const modal = this.modalVar.open(UpgradeSummaryComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
            modal.componentInstance.viewUpgradeSummaryData =  this.upgradeSummaryData;
          }
        }
      }); 
  }

  openDesriredQty(event) {
    this.poolArray = this.utilitiesService.cloneObj(this.rowData)
    this.selectedAto = event.data.ato;
    this.selectedPool = event.data.poolName;
    this.priceEstimateService.showDesriredQty = true;
    if(this.gridOptions.api){
      this.gridOptions.api.forEachNode(node => {
        if (node.level === 1 && node.expanded) {
          this.expandedArr.push(node)
        }
      });
    }
    this.renderer.addClass(document.body, 'position-fixed')
    this.renderer.addClass(document.body, 'w-100')
  }

  onCellMouseOver($event) {
    if ($event.node.level === 1 && !this.priceEstimateStoreService.displayExternalConfiguration && $event.node?.allLeafChildren?.length) {
      const editClass = $event.event.target.classList.value;
      const isIconClick = editClass.search('configure-link');
      if (isIconClick > -1 && $event.node.allLeafChildren) {
        this.gridOptions.getRowStyle = (params) => {
          return { background: '#E5F2FF' };
        }
      }
      this.gridOptions.api?.redrawRows({ rowNodes: $event.node.allLeafChildren });
    }
  }
  onCellMouseOut($event) {
    if ($event.node.level === 1 && !this.priceEstimateStoreService.displayExternalConfiguration && $event.node?.allLeafChildren?.length) {
      const editClass = $event.event.target.classList.value;
      const isIconClick = editClass.search('configure-link');
      if (isIconClick > -1 && $event.node.allLeafChildren) {
        this.gridOptions.getRowStyle = (params) => {
          if (params.node.level === 2) {
            return { background: '#fff' };
          }
        }
      }
      this.gridOptions.api?.redrawRows({ rowNodes: $event.node.allLeafChildren });
    }
  }

  // to download poposal summary excel
  downloadExcel() {
    this.showMoreActions = false;
    this.proposalService.downloadProposalSummaryExcel(this.downloadZipLink, this.proposalStoreService.proposalData.objId);
  }

  // set to show meraki message if meraki suites present and no orgids added
  setMerakiMsg() {
    let messageObjData = {
      hasError: false,
      messages: []
    };
    // set meraki warning message 
    messageObjData.messages.push({ severity: "WARN", text: "Please enter org id on project page as you have selected Meraki suites on this proposal.", code: this.constantsService.ORGID_EXCEPTION })
    return messageObjData;
  }

  reProcessIb() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+this.proposalStoreService.proposalData.objId+'?a=FORCE-REBASELINE';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
        if(this.vnextService.isValidResponseWithData(response)){
        //  this.setEnrollmentData(response)
        this.getEnrollmentData();
        }
    });
  }

  // to get SubsriptionData for renewal
  getRenewalSubscriptionDataForSuites() {
    this.priceEstimateStoreService.renewalSubscriptionDataForSuite = {};
    this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.clear();
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/renewal?renewalId=' + this.proposalStoreService.proposalData.renewalInfo.id;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.priceEstimateStoreService.renewalSubscriptionDataForSuite = response.data;
        this.setMapForRenewalSubscriptionDataSuite(response.data)
      }
    });
  }

  // to set map of subrefId and subscriptionData of renewal data
  setMapForRenewalSubscriptionDataSuite(renewalData) {
    if (renewalData.subscriptions && renewalData.subscriptions.length) {
      for (let subData of renewalData.subscriptions){
        if (!this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.has(subData.subRefId)){
          this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.set(subData.subRefId, subData);
        }
      }
    }
  }

  withdrawFromDistributor() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/status-with-distributor/WITHDRAW';
    this.proposalRestService.postApiCall(url,{}).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithoutData(response)) { 
        this.getEnrollmentData();
        this.proposalStoreService.proposalData.sharedWithDistributor = false; 
        this.proposalStoreService.isReadOnly = false;
        this.proposalService.isReadOnlyProposal(this.proposalStoreService.proposalData?.sharedWithDistributor);
        this.getProposalData();
      }
    })
  }

  shareWithDistributor() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/status-with-distributor/SHARED';
    this.proposalRestService.postApiCall(url,{}).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithoutData(response)) { 
        this.getEnrollmentData();
        this.proposalService.isReadOnlyProposal(this.proposalStoreService.proposalData?.sharedWithDistributor);
        this.getProposalData();
      }
    })
  }

  getProposalData() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.proposalService.setProposalPermissions(response.data.permissions);
      }
      
    });
  }

  hideChangeSubMsg() {
    this.showChangeSubMsg = false;
  }
  
  // check for enrolled portfolios
  enableEngageSupportTeam(){
    let selectedEnrollmentArray = this.selectedEnrollmentArray.filter(enrollment => enrollment.enrolled);
    return selectedEnrollmentArray.length;
  }

  // method to check for selected enrollmets which are enrolled or cx attached to show upgrade summary
  showUpgradeSummary(){
    let selectedEnrollmentArray = this.upgradedEnrollmentsArray.filter(enrollment => enrollment.enrolled || enrollment.cxAttached);
    return selectedEnrollmentArray.length;
  }

  delinkHwCx(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=CX-HW-DELINK';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.getEnrollmentData();
      }
    });
  }

  routeToUrl(subRefId) {
    let url = this.subscriptionUrl;
    this.eaRestService.getEampApiCall(url).subscribe((res: any) => {
      if(res && !res.error && res.data){
        if(res.data){
          window.open(res.data + subRefId);
        }
      }
    });
  }

  howItWorks () {
    const url = this.vnextService.getAppDomainWithContext + 'service-registry/url?track=SALES_CONNECT&service=SPNA_PROGRAM_DETAILS'
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)) { 
        window.open(response.data);
      }
    });
  }

  navigateToOWB(){
    window.open(this.redirectOWB, '_self');
   }
  
   @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {       
    if(this.eaStoreService.isValidationUI){
      sessionStorage.setItem(
        'redirectOWB',
        JSON.stringify(this.redirectOWB));
    }
   }
}
