import { EaService } from 'ea/ea.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewAcceptComponent } from 'vnext/modals/review-accept/review-accept.component';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { IProposalSummary } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { SubmitForApprovalComponent } from 'vnext/modals/submit-for-approval/submit-for-approval.component';
import { WithdrawExceptionComponent } from 'vnext/modals/withdraw-exception/withdraw-exception.component';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaStoreService } from 'ea/ea-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { BusinessJustificationComponent } from 'vnext/modals/business-justification/business-justification.component';
@Component({
  selector: 'app-proposal-summary',
  templateUrl: './proposal-summary.component.html',
  styleUrls: ['./proposal-summary.component.scss']
})
export class ProposalSummaryComponent implements OnInit, OnDestroy {

  proposalSummaryData: IProposalSummary;
  displayException = false;
  isApproverFlow = false; // set if approver flow
  exceptionApprovalHistory: any = []; // to store approval history
  displayApprovalHistory = false; // to show approval history for seller
  isApprovalHistoryCalled = false;
  public subscribers: any = {};
  allowExceptionSubmission = false;
  isSelectedPaRequestException = false; // to set and show message after becoming approver for PA req
  isShowPaMsg = true;
  isExceptionStatusNew = false;
  isOnlyPaExceptionPresent = false; // set only of PA exception present
  isPilotPartnerExceptionPresent = false;
  delistingCxException = false; // set to show message if delisting HW exception present
  isMerakiPaExceptionPresent = false; // set to show info message for meraki PA excepton
  defaultedPaReasons = [];
  showExclusionExceptionWarningMessage = false;
  isJustificationAdded = false
  constructor(private router: Router, public modalVar: NgbModal,
    public projectStoreService: ProjectStoreService, public proposalStoreService: ProposalStoreService, private eaRestService: EaRestService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService,
    private vnextService: VnextService,private proposalRestService: ProposalRestService, private utilitiesService: UtilitiesService, public propsoalService: ProposalService, private vnextStoreService: VnextStoreService, private constantsService: ConstantsService, private eaStoreService: EaStoreService,public localizationService:LocalizationService, public eaService: EaService) { }

  ngOnInit() {
    this.eaStoreService.editName = false;
    this.getProposalSummary();

    this.propsoalService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalStoreService.proposalData); // for testing should be removed 
    
    // subscribe to subject for getting exceptions data to set on UI
    this.subscribers.exceptionsSubj = this.proposalStoreService.exceptionsSubj.subscribe((data: any) => {
      this.displayException = data.displayException;
      this.proposalStoreService.proposalData.exception.exceptionActivities = data.exceptionActivities;
      this.exceptionApprovalHistory = data.exceptionApprovalHistory;
      this.displayApprovalHistory = data.displayApprovalHistory;
      this.allowExceptionSubmission =  data.allowExceptionSubmission;

      if (this.proposalStoreService.proposalData.exception.exceptionActivities.length){
        this.setExceptionsData();
      }
    });
    if (this.proposalStoreService.proposalData?.subscriptionInfo?.existingCustomer) {
      this.getDefaultedReasonForPA();
    }
    this.eaService.showCaseManagementSubject.next(true);
    this.vnextService.isRoadmapShown = true;
    this.vnextService.roadmapStep = 4;
    this.vnextService.hideProposalDetail = true;
    if (this.eaStoreService.changeSubFlow){
      this.vnextService.hideRenewalSubPage = true;
    }  else {
      this.vnextService.hideRenewalSubPage = false;
    }
    this.vnextService.roadmapSubject.subscribe((value:any) => {
        this.vnextService.redirectTo(value)
    })
  }


  //This method is used to get proposal summary details
  getProposalSummary() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.proposalSummaryData = response.data;
        this.proposalStoreService.proposalData = response.data.proposal;
        if(response.data.proposal.permissions){
          this.propsoalService.setProposalPermissions(response.data.proposal.permissions);
        }
        this.getExceptionsData(response.data.proposal);
      }
    });
  }


  setExceptionsData(){
    this.displayException = true;
    this.isExceptionStatusNew = false;
    this.isApproverFlow = false;
    this.isPilotPartnerExceptionPresent = false;
    this.isMerakiPaExceptionPresent = false;
    this.showExclusionExceptionWarningMessage = false;
    this.delistingCxException = false;
    this.setApprovalFlow(this.proposalStoreService.proposalData.exception.exceptionActivities)
    for (const d of this.proposalStoreService.proposalData.exception.exceptionActivities) {
      if (d.status === "NEW" || d.status === "new") {
        this.displayApprovalHistory = false; // to show approval history if new exceptions are present
        this.isExceptionStatusNew = true;
        this.checkPilotPartneException(d);
        break;
      }
    }
    this.checkExceptionToShowMessages(); // check and show meraki PA and delisting Hw exception messages;
    this.checkOnlyPaExceptionPresent(this.proposalStoreService.proposalData.exception.exceptionActivities);
    if(this.proposalStoreService.proposalData.exception.allowWithdrawl){
      this.proposalStoreService.isReadOnly = true;
    }
  }

  // check and show meraki PA and delisting Hw exception messages, exclusion excepiton warning message;
  checkExceptionToShowMessages() {
    for (const d of this.proposalStoreService.proposalData.exception.exceptionActivities) {
      if (d.status === "NEW" || d.status === "new") {
        if (d.exceptionType === this.constantsService.MERAKI_CAMERA_SYSTEM_PA || d.exceptionType === this.constantsService.MERAKI_INFRA_PA || d.exceptionType === this.constantsService.MERAKI_SYSTEM_MANAGER_PA) {
          this.isMerakiPaExceptionPresent = true;
        } else if (d.exceptionType === this.constantsService.DELISTING_CX_EXCEPTION) {
          this.delistingCxException = true;
        }

        if (d.exceptionType === this.constantsService.CX_EMBEDDED_SUPPORT_EXCLUSION_THRESHOLD_CHECK) {
          this.showExclusionExceptionWarningMessage = true;
        }
      }
    }
  }

  // check for pilot exception and show info message
  checkPilotPartneException(exception) {
    if (exception.exceptionType === this.constantsService.BUYING_PROGRAM_EXCEPTION) {
      this.isPilotPartnerExceptionPresent = true;
    }
  }

  // method to check and set approval flow
  setApprovalFlow(exception) {
    for (const data of exception) {
      if (data.allowedToBecomeApprover && data.status !== 'NEW') { // check for allowed action and if status in not new
        this.isApproverFlow = true;
        this.eaStoreService.isUserApprover = this.isApproverFlow;
        return;
      }
    }
  }

  submit() {
    const modal = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modal.componentInstance.isProposalSummary = true;
    modal.result.then((result) => {
      if (result.continue) {
        this.updateProposalStatus();
      }

    });
  }

  updateProposalStatus() {
    const url = this.vnextService.getAppDomainWithContext + "proposal/" + this.proposalStoreService.proposalData.objId + "/status";
    const request = {
      "data": {
        "status": "COMPLETE"
      }
    }
    this.proposalRestService.putApiCall(url, request).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.proposalStoreService.proposalData = response.data;
        if(response.data.permissions){
          this.propsoalService.setProposalPermissions(response.data.permissions);
        }
        this.proposalStoreService.showProposalSummary= false;
        this.proposalStoreService.showProposalDashboard = true;
        this.proposalStoreService.isReadOnly = true;
        this.vnextService.refreshProposalData.next({isPermissionRefresh: true});
      }
    });
  }

  ngOnDestroy() {
    this.proposalStoreService.showProposalSummary = false;
    if (this.subscribers.exceptionsSubj){
      this.subscribers.exceptionsSubj.unsubscribe();
    }
    this.eaService.showCaseManagementSubject.next(false);
   this.propsoalService.clearWorkspaceCaseInputInfo();
   this.vnextService.isRoadmapShown = false;
   this.eaStoreService.editName = false;
  }

  getTCVPrePurchaseAdjustment(obj) {
    return (!obj.priceInfo?.totalNetBeforeCredit || this.eaService.isResellerLoggedIn) ?  '--' : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(obj.priceInfo.totalNetBeforeCredit));
  }

  getTCV(obj, proposal) {
    if(proposal){
      return (obj.priceInfo?.proposalPurchaseAdjustment) ?  '-' + this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(obj.priceInfo.proposalPurchaseAdjustment))  : '--';
    }

      return (obj.priceInfo?.purchaseAdjustment) ?  '-' + this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(obj.priceInfo.purchaseAdjustment))  : '--';
  }

  getTCVPostPurchaseAdjustment(obj) {
    return (!obj.priceInfo?.totalNet || this.eaService.isResellerLoggedIn) ?  '--' : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(obj.priceInfo.totalNet));
  }

  submitForApproval(){
    const modalRef = this.modalVar.open(SubmitForApprovalComponent, { windowClass: 'md' });
    if (this.defaultedPaReasons.length === 1){
      modalRef.componentInstance.deafultedPaReasonString = this.defaultedPaReasons.toString();
    }
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.submitExceptionForApproval(result.requestObj)
      }
    });
  }

  getDefaultedReasonForPA() {
    const url = "proposal/"+ this.proposalStoreService.proposalData.objId +"/ext-cust-request-pa-reasons";  
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        if (response.data.paReasons && response.data.paReasons.length) {
          this.defaultedPaReasons = response.data.paReasons;
        }
      }
    });
  }

  submitExceptionForApproval(reqObj){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/submit-exception-request';
    this.proposalRestService.postApiCall(url, reqObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
        this.proposalStoreService.proposalData.exception = {exceptionActivities: response.data.proposalExceptionActivities, allowWithdrawl : true } 
        this.proposalStoreService.isReadOnly = true;
        this.vnextStoreService.toastMsgObject.exceptionsSubmitted = true;
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject();
        }, 3000);
        this.getProposalSummary();
      }
    });
  }

  withdrawApproval(){
    const modal = this.modalVar.open(WithdrawExceptionComponent, { windowClass: 'x-sm d-flex align-items-center', backdropClass: 'modal-backdrop-vNext' });
    modal.result.then((result) => {
      if (result.continue) {
        const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/withdrawRequest';
        this.proposalRestService.getApiCall(url).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithoutData(response)) {
            this.proposalStoreService.isReadOnly = false;
            this.proposalStoreService.proposalData.exception.allowWithdrawl = false;
            this.vnextStoreService.toastMsgObject.exceptionsWithdrawn = true;
            setTimeout(() => {
              this.vnextStoreService.cleanToastMsgObject();
            }, 3000);
            this.getProposalSummary();
          }
        });
        // this.proposalStoreService.isReadOnly = false;
        // this.proposalStoreService.proposalData.exception.allowWithdrawl = false;
      }

    });
  }

  // reload summary page if submit/withdraw exception or submit decisions
  reloadSummaryForExceptions($event) {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.proposalStoreService.proposalData = response.data;
        this.isApproverFlow = false;
        this.isSelectedPaRequestException = false;
        if (response.data.status === 'COMPLETE'){
          this.proposalStoreService.showProposalSummary= false;
          this.proposalStoreService.showProposalDashboard = true;
          this.proposalStoreService.isReadOnly = true;
          this.propsoalService.setProposalPermissions(response.data.permissions);
        } else { // reload summary page to get updated exceptions data
          this.getProposalSummary();
        }
      }
    });
    // window.location.reload();
  }

  // method to set and show message if user becomes approver
  becomeApprover(event){
    this.isSelectedPaRequestException = event.isSelectedPaRequestException;
    this.proposalStoreService.allowUpdatePA = event.isSelectedPaRequestException ? true : false;
  }

  getExceptionsData(proposal){
    if (proposal.status === 'COMPLETE'){
      this.proposalStoreService.showProposalSummary= false;
      this.proposalStoreService.showProposalDashboard = true;
      this.proposalStoreService.isReadOnly = true;
    } else {
      this.proposalStoreService.proposalData.exception = { exceptionActivities: [] };
      this.propsoalService.getExceptionSummaryData(this.displayException, this.exceptionApprovalHistory, this.displayApprovalHistory, this.allowExceptionSubmission);
    }
  }

  backToPe() {
    this.proposalStoreService.showProposalSummary = false
    this.proposalStoreService.showPriceEstimate = true;
    this.proposalStoreService.isPaApproverComingFromSummary = true;
  }

  // to check and show submit button
  showSubmitButton(){
    if (!this.proposalStoreService.isReadOnly && !this.isApproverFlow && !this.proposalStoreService.proposalData?.exception?.allowWithdrawl && !this.allowExceptionSubmission){
      return true;
    }
    return false;
  }

  // to check and show submitForApproval button
  showSubmitForApproval(){
    if (!this.proposalStoreService.isReadOnly && this.displayException && !this.isApproverFlow && !this.proposalStoreService.proposalData?.exception?.allowWithdrawl && this.allowExceptionSubmission){
      return true;
    }
    return false;
  }

  checkOnlyPaExceptionPresent(exceptionActivities){
    this.isOnlyPaExceptionPresent = false;
    if (exceptionActivities.length === 1 && exceptionActivities[0].exceptionType === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST ){
      this.isOnlyPaExceptionPresent = true;
    }
  }
  gtcJustification(){
    const modal = this.modalVar.open(BusinessJustificationComponent, { windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modal.componentInstance.isJustificationAdded = this.isJustificationAdded
    modal.result.then(result => {
      if(result.percentage || result.percentage === 0){
        const requestObj = {
          "data": {
            "chinaQuestionnaireJustValue": result.percentage
          }
        }
        const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/status';
        this.eaRestService.putApiCall(url, requestObj).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithData(response)) {
            this.isJustificationAdded = true;
            this.proposalStoreService.proposalData.nonStandardTermDetails.ruleBusinessJustification = result.percentage
          }
        });
      }
    });
  }
}