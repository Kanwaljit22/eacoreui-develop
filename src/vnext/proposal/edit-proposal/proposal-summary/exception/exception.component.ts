import { EaStoreService } from 'ea/ea-store.service';
import { ProposalStoreService } from './../../../proposal-store.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddCaseIdPaComponent } from 'vnext/modals/add-case-id-pa/add-case-id-pa.component';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ExceptionApprovalSuccessComponent } from 'vnext/modals/exception-approval-success/exception-approval-success.component';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent implements OnInit {
   @Input() isApprovalFlow = false; // set if approval flow 
   showSubmitDecision = false; // set if user become reviewer 
   @Input() exceptionActivities : any = []
   @Input() groupExceptionApproverHistory : any = []
   @Input() displayApprovalHistory = false;
   @Output() isSummaryReloadEmitter = new EventEmitter();
   @Input() isExceptionStatusNew = false;
   disableApprover = true; //disable become reviewer button
   approverReqObj = { data: { exceptionId: [] } }; // to set exception approver reqObj
   exceptionDecisionData = []; // to store exceptions decision data
   approvalDecision = []; // to store approval decisions
   selectedDecision = '';
   giveReason = []; // to store approval reasons
   reasonsSelectedCount = 0; // set when resons are selected
   isDecisionSelected = false; // set when all decisions are selected
   isReasonSelected = false; // set when all reasons are selected
   selectedReason = '';
   isEnableSubmit = false; // set to enable submit button
   type = '';
   callBecomeApprover = false; //  to set and call becomeapprover api directly
   isRequestPaPresent = false; //  set if request PA Exception is present
   justificationMandatory = false;
   decisionSelected = 'APPROVED';
   isApproverDecisionSubmitted = false;
   @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
   @Output() isBecomeApprover = new EventEmitter();
   ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
   showSYD: boolean = false; // set to show subscription/ follow on related columns
  constructor(public proposalStoreService: ProposalStoreService, private vnextStoreService: VnextStoreService, private messageService: MessageService, public utilitiesService: UtilitiesService, private modalVar: NgbModal, private vnextService: VnextService, private proposalRestService: ProposalRestService, private constantsService: ConstantsService
   , public localizationService: LocalizationService, private eaStoreService: EaStoreService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
   this.selectedDecision = this.localizationService.getLocalizedString('exception.SELECT_DECISION');
   this.selectedReason = this.localizationService.getLocalizedString('common.SELECT_REASON');
   this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === LocalizationEnum.exception || key === LocalizationEnum.all){
        this.selectedDecision = this.localizationService.getLocalizedString('exception.SELECT_DECISION');
      }
    });
     if (this.isApprovalFlow){
      this.prepareExceptionData();
     }
  }

  //  method to call pre-become-approver to check case number and call appropiate api's
  callPreBecomeApporover() {
   const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId +'/pre-become-approver'
   this.proposalRestService.getApiCall(url).subscribe((res: any) => {
     if (this.vnextService.isValidResponseWithData(res)) {
       const preBecomeApprover = res.data.preBecomeApprover
       //  if paFlow is not present or paFlow present and case Number is also there call become approver api else open modal to enter case number
       if (!preBecomeApprover.paFlow || (preBecomeApprover.paFlow && preBecomeApprover.caseNumber)) {
         this.becomeApprover();
       } else if (preBecomeApprover.paFlow && !preBecomeApprover.caseNumber) {
         //  open addcaseid modal to enter case number
         this.addCaseNumber('becomeApprover');
       }
     }
   });
 }

   //  method to call becomeApprover Api Default
   callBecomeApproverDefault() {
      //  if disabled and called again then call beocome approver api direclty
      if (this.disableApprover && this.callBecomeApprover) {
        this.type = 'becomeApproverAgain';
        const url = this.vnextService.getAppDomainWithContext +  'proposal/approval-decision-options'
        this.becomeReviewer(url);
      }
    }

   convertRegionToString(regionArray) {
      if (regionArray) {
         return regionArray.join(', ');
      }
   }

   // prepare exception data for approver flow
   prepareExceptionData(from?) {
      this.approverReqObj.data.exceptionId = [];
      this.isApproverDecisionSubmitted = false;
      for (let i = 0; i < this.exceptionActivities.length; i++) {
         
         //  check for PA request and set isRequestPaPresent
      if (this.exceptionActivities[i].exceptionType === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
         this.isRequestPaPresent = true;
       }

         //  check if user allowed to beocome approver and actionedBy is same as loggedinuser, set the data and call become approver api directly
         if (this.exceptionActivities[i].allowedToBecomeApprover &&
            this.exceptionActivities[i].actionedBy === this.eaStoreService.userInfo.userId) {
            this.setSelectedExceptions(this.exceptionActivities[i]);
            this.callBecomeApprover = true;
         } else if (this.exceptionActivities[i].allowedToBecomeApprover && this.exceptionActivities[i].decision === 'Pending') { //  check user is approver and exception decision is pending , set the data to call become approver
            this.setSelectedExceptions(this.exceptionActivities[i]);
            this.disableApprover = false;
         }
      }
      if (!from){
         //  if disabled and called again then call beocome approver api direclty
         this.callBecomeApproverDefault();
      } else {
         return;
      }
   }

   // method to check and set approval flow
   setApprovalFlow(exception) {
      for (const data of exception) {
        if (data.allowedToBecomeApprover && data.status !== 'NEW') { // check for allowed action and if status in not new
            this.isApprovalFlow = true;
            return;
         }
      }
   }

    becomeApprover() {
      this.type = 'becomeApprover';
      const url = this.vnextService.getAppDomainWithContext + 'proposal/become-approver';
      this.prepareExceptionData(true);
      this.becomeReviewer(url);
    }

   // method to become approver and get decisions data
   becomeReviewer(url) {
      // call api to get decisions
      this.proposalRestService.postApiCall(url, this.approverReqObj).subscribe((response: any) => {
         this.checkBecomeApproverApiResponse(response, this.type);
         setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
         }, 200);
      });
      this.showSubmitDecision = true;
   }

     //  method to store response and set submit decision data
   checkBecomeApproverApiResponse(response, type) {
      try {
         if (response && !response.error) {
            if (response.data) {
               this.subscriptionCreditDetails(response.data.approverDecisionOptions);
               this.exceptionDecisionData = response.data.approverDecisionOptions;
            } else {
               this.exceptionDecisionData = [];
            }
            if (type === 'becomeApprover') {
               //  to show message in summary page
            }
            this.setApproverCec(this.approverReqObj.data.exceptionId, this.exceptionActivities);
            //  show submit decision table and data only if decision data form api is present and data is present
            this.showSubmitDecision = true;
         } else {
            this.messageService.displayMessagesFromResponse(response);
         }
      } catch (error) {
         this.messageService.displayUiTechnicalError(error);
      }
   }

   //  method to set approverCeC to pending exceptions after becoming approver
   setApproverCec(exceptions, data) {
      for (const d of data) {
         if (exceptions.includes(d.exceptionType)) {
            d.approverName = this.eaStoreService.userInfo.firstName + ' ' + this.eaStoreService.userInfo.lastName;
            d.actionedBy = this.eaStoreService.userInfo.userId;
         }
      }
      if (exceptions.includes(this.constantsService.PURCHASE_ADJUSTMENT_REQUEST)){
         this.isBecomeApprover.emit({ 'hasActioned': true, 'isSelectedPaRequestException': true  }); //  to show message in summary page
         this.vnextStoreService.toastMsgObject.isBecameReviewerForPA = true;
      } else {
         this.vnextStoreService.toastMsgObject.isBecameReviewer = true;
      }

      if (this.vnextStoreService.toastMsgObject.isBecameReviewer || this.vnextStoreService.toastMsgObject.isBecameReviewerForPA){
         setTimeout(() => {
            this.vnextStoreService.cleanToastMsgObject();
         }, 2500);
      }

   }

   // method to check and set exceptions data default for which user is approver for 
   setSelectedExceptions(data) {
      this.approverReqObj.data['proposalObjId'] = this.proposalStoreService.proposalData.objId;
      if (this.approverReqObj.data.exceptionId.includes(data.exceptionType)) {
         this.approverReqObj.data.exceptionId = arrayRemove(this.approverReqObj.data.exceptionId, data.exceptionType);
      } else {
         this.approverReqObj.data.exceptionId.push(data.exceptionType);
      }
   }

   // method to set decisions data and show dropdown
   dropDecision(data) {
      this.approvalDecision = [];
      for (const d of data.decisions) {
         if (!this.approvalDecision.includes(d.decisionType)) {
            this.approvalDecision.push(d.decisionType);
         }
      }
      this.showSubmitDecision = true;
      data.decisionDrop = true;
   }

   // method to select decisions for selected exception
   selectDecision(e, data) {
      //  check for selected decision - decision present and not same as old one
      if (data.selectedDecision && data.selectedDecision.decisionType && data.selectedDecision.decisionType !== e) {
         if (data.selectedReason) { //  if reason selected, remove the selected if decision is diff
            delete data.selectedReason;
            this.reasonsSelectedCount--; //  decrease reason count and disable submit button
            this.isReasonSelected = false;
            this.isEnableSubmit = false;
         }
      }
      data['selectedDecision'] = {};
	  data['proposalObjId'] = this.proposalStoreService.proposalData.objId;
      data.selectedDecision['decisionType'] = e;
      this.isDecisionSelected = true;
      if (data.exceptionId === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST && data.selectedDecision.decisionType === 'REJECTED') {
         this.justificationMandatory = true;
      } else {
         this.justificationMandatory = false;
      }
      data.decisionDrop = false;
   }

   // method to set reasons data and show dropdown
   dropReason(data) {
      if (data.selectedDecision && data.selectedDecision.decisionType) {
         for (const d of data.decisions) {
            if (d.decisionType === data.selectedDecision.decisionType) {
               this.giveReason = d.reasons;
            }
         }
         data.reasonDrop = true;
      }
   }

   // method to select reasons for selected exception
   selectReason(e, data) {
      for (const d of data.decisions) {
         if (d.decisionType === data.selectedDecision.decisionType) {
            if (!data['selectedReason']) {
               this.reasonsSelectedCount++;
            }
            data['selectedReason'] = e;
         }
      }
      data.reasonDrop = false;
      if (this.reasonsSelectedCount === this.exceptionDecisionData.length &&
         data.exceptionId !== this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
         this.isReasonSelected = true;
         this.isEnableSubmit = true;
       }
       this.checkRequestPurchaseAdjustment(data);
      data.reasonDrop = false;
   }

   checkRequestPurchaseAdjustment(data) {
      if (data.exceptionId === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
         this.isEnableSubmit = true;
         if (data.selectedDecision.decisionType === 'REJECTED' && !data['comment']) {
            this.isEnableSubmit = false;
         }
      }
   }

   // method to store comment
   approverCommentAdded(event, data) {
      data['comment'] = event.target.value;
      if (data && data.selectedDecision && data['comment'].trim() !== '' && data.selectedDecision.decisionType === 'REJECTED'
         && data['selectedReason'] && data.exceptionId === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
         this.isEnableSubmit = true;
      } else if (data && data.selectedDecision && (data['comment'].trim() === '' || !data['selectedReason'])
         && data.selectedDecision.decisionType === 'REJECTED' && data.exceptionId === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
         this.isEnableSubmit = false;
      }
   }

   submitDecision() {
      const requestObj = {};
      const arr = [];
      arr.push(this.exceptionDecisionData);
      requestObj['data'] = {
         requestData : this.exceptionDecisionData
      };
      const url = this.vnextService.getAppDomainWithContext + 'proposal/submit-decision';
      // api to submit decisions for approver flow
      this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
         if (this.vnextService.isValidResponseWithData(response)) {
            this.checkApproverDecisionType(response.data.proposalExceptionActivities);
            // reset flags after approval decision
            this.resetDecisionSubmissionInfo();
            setTimeout(() => {
               this.vnextStoreService.cleanToastMsgObject();
            }, 2000);
            if (this.vnextStoreService.toastMsgObject.isExceptionRejected){
               this.isSummaryReloadEmitter.emit();
            } else {
               this.exceptionApprovalSuccess();
            }
         }
      });
   }

   // reset flags after approval decision
   resetDecisionSubmissionInfo(){
      this.showSubmitDecision = false;
      this.isEnableSubmit = false;
      this.callBecomeApprover = false;
      this.isDecisionSelected = false;
      this.isReasonSelected = false;
      this.reasonsSelectedCount = 0;
   }
   checkApproverDecisionType(data) {
      for (let d of data) {
        if (d.decision === 'Rejected' || d.decision === 'Declined') {
          this.decisionSelected = d.status;
          this.vnextStoreService.toastMsgObject.isExceptionRejected = true;
          return;
        }
      }
    }

   addCaseNumber(type) {
      // open modal and call api to submit case number and then become approver
      let reqObj = {
         data: ''
      };
      const modalRef = this.modalVar.open(AddCaseIdPaComponent, { windowClass: 'sm', backdropClass: 'modal-backdrop-vNext' });
      modalRef.componentInstance.type = type;
      modalRef.result.then((result) => {
         //  check result and case number present and call api to save
         if (result && result.caseNumber) {
            reqObj.data = result.caseNumber;
            const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/saveCaseNo';
            this.proposalRestService.postApiCall(url, reqObj).subscribe((res: any) => {
               if (this.vnextService.isValidResponseWithoutData(res)) {
                  this.setCaseNumber(result.caseNumber); //  method to assign case number after success
                  this.becomeApprover();
               }
            });
         }
      });
   }

   // method to set case number in data after api success
  setCaseNumber(caseNumber) {
   for (let data of this.exceptionActivities) {
     if (data.exceptionType === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) {
       data['sourceRefId'] = caseNumber;
     }
   }
   return;
 }

 downloadPADocument(data) {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/purchase-adjustment-document/download?a=' + data.documents[0].documentMappingId
   this.proposalRestService.downloadDocApiCall(url).subscribe((response:any) => {
     if(this.vnextService.isValidResponseWithoutData(response)) {
       this.utilitiesService.saveFile(response, this.downloadZipLink);
     }
   });
 }

 // to download excel for renewal subscription
 downloadSubscriptionDocument(){
   const url = this.vnextService.getAppDomainWithContext + 'proposal/renewal/' + this.proposalStoreService.proposalData.objId + '/download-subscription-credit-details';
   this.proposalRestService.downloadDocApiCall(url).subscribe((response:any) => {
     if(this.vnextService.isValidResponseWithoutData(response)) {
       this.utilitiesService.saveFile(response, this.downloadZipLink);
     }
   });
 }

 // to get subscription details relayed to renewal to show on UI 
 subscriptionCreditDetails(exceptionDecisionData) {
   if (exceptionDecisionData.length) {
     exceptionDecisionData.forEach(item => {
       if (item.exceptionId === this.constantsService.EARLY_FOLLOW_ON_CHECK) {
         const url = this.vnextService.getAppDomainWithContext + 'proposal/renewal/' + this.proposalStoreService.proposalData.objId + '/subscription-credit-details';
         this.proposalRestService.getApiCall(url).subscribe((res: any) => {
            if (this.vnextService.isValidResponseWithData(res)){
               try {
                  this.createSubscriptionCreditDetailsData(res, item);
                }
                catch (error) {
                  this.messageService.displayUiTechnicalError(error);
                }
            }
         })

       }
     });
   }
 }

 // creating 3 columns if Early follow on 
createSubscriptionCreditDetailsData(res: any, item: any) {
     let data: any = res.data;
     item['opportunityType'] = data.opportunityType ? data.opportunityType : '--';
     item['tcvOfEarlyFollowOn'] = data.tcvOfEarlyFollowOn;
     item['estimatedCredit'] = data.estimatedCredit ? data.estimatedCredit : '--';
     this.showSYD = true;
 }
 // method to switch status of requested exceptions and approval history
 switchShowStatus(value){
   this.displayApprovalHistory = value;
 }

 backToPe() {
   this.proposalStoreService.showProposalSummary = false
   this.proposalStoreService.showPriceEstimate = true;
   this.proposalStoreService.isPaApproverComingFromSummary = true;
 }

 // method to open modal to show success message
 exceptionApprovalSuccess(){
   const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'md';
    ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';
    const modalRef = this.modalVar.open(ExceptionApprovalSuccessComponent, ngbModalOptionsLocal);
    modalRef.result.then((result) => {
       if (result.continue){
         this.isSummaryReloadEmitter.emit(); // reload summary page after approval
       }
    });
 }

 copy(team) {
   let ids = [];
   team.forEach(element => {
      ids.push(element.cecId)
   });
  const val = ids.toString().replace(/,/g, '; ');
  let selBox = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
 }
}

// to remove value from array
function arrayRemove(arr, value) {

   return arr.filter(function (ele) {
      return ele !== value;
   });

}
