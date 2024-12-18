import { Component, OnInit, Input, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { ApproverTeamService } from './approver-team.service';
import { MessageService } from '@app/shared/services/message.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AddCaseIdComponent } from '@app/modal/add-case-id/add-case-id.component';

@Component({
  selector: 'app-approver-team',
  templateUrl: './approver-team.component.html',
  styleUrls: ['./approver-team.component.scss']
})
export class ApproverTeamComponent implements OnInit {

  @Input() exceptionStatusData: any = [];
  pendingExceptions = [];
  approvedExceptions = [];
  @Input() displayApproverHistory = false;
  hasAccessToApprove = true;
  showSubmitDecision = false;
  @Output() isBecomeApprover = new EventEmitter();
  @Output() isApproverSubmitted = new EventEmitter();
  @Output() isApproverSubmittedBulk = new EventEmitter();
  @Output() isSummaryReloadEmitter = new EventEmitter();
  @Input() exceptionApprovalHistory: any = [];
  @Input() groupExceptionApproverHistory: any = [];

  @ViewChild('selectDecisionDropsearch', { static: false }) selectDecisionDropsearch: NgbDropdown;
  @ViewChild('selectDecisionReason', { static: false }) selectDecisionReason: NgbDropdown;

  approvalDecision = [];
  selectedDecision = 'Select Decision';
  giveReason = [];
  selectedReason = 'Select Reason';
  isDecisionSelected = false;
  isReasonSelected = false;
  isCommentWritten = false;
  exceptionDecisionObj: any = {};
  isEnableSubmit = false;
  aprroverComment = '';
  @Input() isApproverDecisionSubmitted = false;
  type = '';
  isChecked = false;
  approverReqObj = { data: { exceptionId: [] } };
  exceptionDecisionData = [];
  reasonsSelectedCount = 0;
  // justificationCount = 0;
  pendingExceptionsLength = 0;
  decisionSelected = 'APPROVED';
  disableApprover = true;
  callBecomeApprover = false; //  to set and call becomeapprover api directly
  @Input() showApproverButton = false; //  to show become approver button
  public subscribers: any = {};
  isRequestPaPresent = false; //  set if request PA Exception is present
  path = ''; //  to set where addCase method is called
  justificationMandatory = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  showSYD: boolean = false;
  
  constructor(private approverTeamService: ApproverTeamService, public messageService: MessageService,
    private proposalDataService: ProposalDataService, private appDataService: AppDataService,
    private blockUiService: BlockUiService, public utilitiesService: UtilitiesService,
    public localeService: LocaleService, private modalVar: NgbModal) { }

  ngOnInit() {
    // console.log(this.exceptionApprovalHistory);
    this.prepareExceptionData();
    //  this.subscribers.modifyPAEmitter = this.approverTeamService.modifyPAEmitter.subscribe(()=> {
    //    console.log('modifyPA');
    //    this.approverReqObj.data['proposalId'] = this.proposalDataService.proposalDataObject.proposalId;
    //    this.approverReqObj.data.exceptionId.push('PURCHASE_ADJUSTMENT_REQUEST');
    //    this.becomeApproverBulk();
    //  });
  }

  //  method to call pre-become-approver to check case number and call appropiate api's
  callPreBecomeApporover() {
    // console.log(this.proposalDataService.proposalDataObject.proposalId);
    this.approverTeamService.preBecomeApprover(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        //  console.log(res.data);
        //  if paFlow is not present or paFlow present and case Number is also there call become approver api else open modal to enter case number
        if (!res.data.paFlow || (res.data.paFlow && res.data.caseNumber)) {
          this.becomeApproverBulk();
        } else if (res.data.paFlow && !res.data.caseNumber) {
          // console.log('44');
          //  open addcaseid modal to enter case number
          this.addCaseNumber('becomeApprover');
        }
      }
    });
  }

  becomeApprover(exception) {
    const requestObj = { data: {} };
    // requestObj.data['proposalExceptionActivityId'] = exception.id;
    requestObj.data['proposalId'] = exception.proposalId;
    requestObj.data['exceptionId'] = [exception.exceptionType];
    this.type = 'becomeApprover';
    this.approverTeamService.becomeApprover(requestObj, this.type).subscribe((response: any) => {
      //  this.type = 'becomeApprover';
      this.checkBecomeApproverApiResponse(response, exception, this.type);
    });
  }

  prepareExceptionData() {
    for (let i = 0; i < this.exceptionStatusData.length; i++) {
      if (this.exceptionStatusData[i].decision === 'Pending') {
        this.pendingExceptions.push(this.exceptionStatusData[i]);
      } else {
        this.approvedExceptions.push(this.exceptionStatusData[i]);
      }

      //  check for PA request and set isRequestPaPresent
      if (this.exceptionStatusData[i].exceptionType === 'PURCHASE_ADJUSTMENT_REQUEST') {
        this.isRequestPaPresent = true;
      }

      //  check if user allowed to beocome approver and actionedBy is same as loggedinuser, set the data and call become approver api directly
      if (this.exceptionStatusData[i].allowedToBecomeApprover &&
        this.exceptionStatusData[i].actionedBy === this.appDataService.userInfo.userId) {
        this.setSelectedExceptions(this.exceptionStatusData[i]);
        // this.disableApprover = true;
        this.callBecomeApprover = true;
      } else if (this.exceptionStatusData[i].allowedToBecomeApprover && this.exceptionStatusData[i].decision === 'Pending') { //  check user is approver and exception decision is pending , set the data to call become approver
        this.setSelectedExceptions(this.exceptionStatusData[i]);
        this.disableApprover = false;
      }
    }

    //  if disabled and called again then call beocome approver api direclty
    this.callBecomeApproverDefault();
    // console.log(this.exceptionStatusData);
    //  if(!this.isApproverDecisionSubmitted){
    //  this.checkBecomeApproverAction(this.pendingExceptions);
    //  } else
    //  if(this.isApproverDecisionSubmitted){
    //    console.log(this.pendingExceptions);
    //  this.isApproverSubmittedBulk.emit({ data: this.exceptionStatusData, submittedDecision: true, decisionType: this.selectedDecision, pendingExceptions: this.pendingExceptions });
    //  }
    //  check if there are no pending exceptions, show approver history
    //  if (this.pendingExceptions.length === 0){
    //    this.displayApproverHistory = true;
    //  } else {
    //    this.checkBecomeApproverAction(this.pendingExceptions);
    //  }
  }

  // OTB 5188 - US 2891/3352/3353 - Upsell, Downsell flag & credit estimation for Early Follow on.
  subscriptionCreditDetails(exceptionDecisionData) {
    if (exceptionDecisionData.length) {
      exceptionDecisionData.forEach(item => {
        if (item.exceptionId === 'EARLY_RENEWAL_REQUEST') {
          this.approverTeamService.subscriptionCreditDetails(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
            try {
              this.createSubscriptionCreditDetailsData(res, item);
            }
            catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          })

        }
      });
    }
  }

  // creating 3 columns if Early follow on 
  private createSubscriptionCreditDetailsData(res: any, item: any) {
    if (res && res.data && !res.error) {
      let data: any = res.data;
      item['opportunityType'] = data.opportunityType ? data.opportunityType : '--';
      item['tcvOfEarlyFollowOn'] = data.tcvOfEarlyFollowOn;
      item['estimatedCredit'] = data.estimatedCredit ? data.estimatedCredit : '--';
      this.showSYD = true;
    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
  }

  // Download Excel method
  downloadSubscriptionDetails(){
    // Changed the response type o Service to BLOB for download functionality
    this.approverTeamService.downloadSubscriptionDetails(this.proposalDataService.proposalDataObject.proposalId)
    .subscribe((res: any) => {
      try{
        if(res){
          // Download functionality 
          this.generateFileName(res);
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      }
      catch(error){
        this.messageService.displayUiTechnicalError(error);
      }
    })
  }

  //  method to call becomeApprover Api Default
  callBecomeApproverDefault() {
    //  if disabled and called again then call beocome approver api direclty
    if (this.disableApprover && this.callBecomeApprover) {
      this.blockUiService.spinnerConfig.blockUI();
      this.type = 'becomeApproverAgain';
      this.approverTeamService.becomeApprover(this.approverReqObj, this.type).subscribe((response: any) => {
        this.checkBecomeApproverApiResponse(response, '', this.type);
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 200);
      });
    }
  }
  //  method to check and set exceptions data default for which user is approver for 
  setSelectedExceptions(data) {
    this.approverReqObj.data['proposalId'] = data.proposalId;
    if (this.approverReqObj.data.exceptionId.includes(data.exceptionType)) {
      this.approverReqObj.data.exceptionId = arrayRemove(this.approverReqObj.data.exceptionId, data.exceptionType);
    } else {
      this.approverReqObj.data.exceptionId.push(data.exceptionType);
    }
  }

  //  method to check if approver assigned but not took any action
  checkBecomeApproverAction(data) {
    for (const e of data) {
      if ((e.actionedBy === this.appDataService.userInfo.loggedInUser) && e.approverAssigned && !e.actioned) {
        this.showDecisionData(e); //  method to call decision data
        return;
      }
    }
  }

  //  method to call exception decision data for approver if become approver and not submitted descision
  showDecisionData(data) {
    this.approverTeamService.becomeApproverDecision(data.proposalId, data.exceptionType).subscribe((response: any) => {
      this.type = 'approverBack';
      this.checkBecomeApproverApiResponse(response, data, this.type);
    });
  }

  //  method to store response and set submit decision data
  checkBecomeApproverApiResponse(response, exception, type) {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.blockUiService.spinnerConfig.unBlockUI();
    try {
      if (response && !response.error) {
        // code...
        //  if(this.type === 'approverBack'){
        //    this.exceptionDecisionObj = response.data;
        //  } else if(response.data.length > 0 && this.type === 'becomeApprover'){
        //    this.exceptionDecisionObj = response.data[0];
        //  }
        //  if data present store else make to empty array
        if (response.data) {
          this.subscriptionCreditDetails(response.data);
          this.exceptionDecisionData = response.data;
        } else {
          this.exceptionDecisionData = [];
        }
        // for(const d of this.pendingExceptions){
        //  commented out for further use
        // if(d.exceptionType === exception.exceptionType){
        //  d.allowedToBecomeApprover = false;
        // }
        // }
        //  console.log(this.exceptionDecisionObj);
        //  for(const d of this.exceptionDecisionObj.decisions){
        //    if(!this.approvalDecision.includes(d.decisionType)){
        //      this.approvalDecision.push(d.decisionType);
        //    }
        //  }
        //  console.log(this.approvalDecision);
        this.pendingExceptionsLength = (this.pendingExceptions.length - this.approverReqObj.data.exceptionId.length);
        if (type === 'becomeApprover') {
          this.isBecomeApprover.emit({ 'hasActioned': true, 'exceptionsSelected': this.approverReqObj.data.exceptionId }); //  to show message in summary page
        }
        this.setApproverCec(this.approverReqObj.data.exceptionId, this.exceptionStatusData);
        //  show submit decision table and data only if decision data form api is present and data is present
        this.showSubmitDecision = true;
        //  if(this.exceptionDecisionData.length === 0){ //  if there is no exceptions data present make purchase adjustment user = true to make PA 
        //    this.appDataService.userInfo.purchaseAdjustmentUser = true;
        //  }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
  }

  // toggle view of exception
  changeView(value) {
    this.displayApproverHistory = value;
  }

  //  method to select decision and store reasons
  selectDecision(e) {
    this.exceptionDecisionObj['selectedDecision'] = {};
    this.selectedDecision = e;

    this.exceptionDecisionObj.selectedDecision['decisionType'] = this.selectedDecision;
    // console.log(this.exceptionDecisionObj);
    for (const d of this.exceptionDecisionObj.decisions) {
      if (d.decisionType === this.selectedDecision) {
        this.giveReason = d.reasons;
      }
    }
    this.isDecisionSelected = true;
    this.selectDecisionDropsearch.close();
  }

  //  method to select and set reason for selected decision
  selectReason(e) {
    this.selectedReason = e;
    for (const d of this.exceptionDecisionObj.decisions) {
      if (d.decisionType === this.selectedDecision) {
        d['selectedReason'] = this.selectedReason;
      }
    }
    // console.log(this.exceptionDecisionObj)
    this.isReasonSelected = true;
    if (this.isDecisionSelected && this.isReasonSelected) {
      this.isEnableSubmit = true;
    }
    this.selectDecisionReason.close();
  }

  //  method to store comment
  approverCommentAdded(event, data) {
    data['comment'] = event.target.value;
    if (data && data.selectedDecision && data['comment'].trim() !== '' && data.selectedDecision.decisionType === 'REJECTED'
      && data['selectedReason'] && data.exceptionName === 'Request One Time Discount') {
      this.isEnableSubmit = true;
    } else if (data && data.selectedDecision && (data['comment'].trim() === '' || !data['selectedReason'])
      && data.selectedDecision.decisionType === 'REJECTED' && data.exceptionName === 'Request One Time Discount') {
      this.isEnableSubmit = false;
    }
  }

  //  method to submit decision and reason selected
  submitDecision() {
    const requestObj = {};
    const arr = [];
    arr.push(this.exceptionDecisionObj);
    requestObj['data'] = arr;
    // console.log(this.exceptionDecisionObj, requestObj)
    this.approverTeamService.submitApproverDecision(requestObj).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.exceptionStatusData = res.data;
        //  console.log(this.exceptionStatusData);
        //  this.prepareExceptionData();
        this.isApproverDecisionSubmitted = true;
        // this.displayApproverHistory = true; //  show approver history after submission
        this.isApproverSubmitted.emit({ data: this.exceptionStatusData, submittedDecision: true,
          decisionType: this.selectedDecision, pendingExceptions: this.pendingExceptions }); //  to show message in summary page
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  selectApprover(data) {
    this.isChecked = !this.isChecked;
    data['selected'] = this.isChecked;
    // console.log(data, this.isChecked);
    this.approverReqObj.data['proposalId'] = data.proposalId;
    if (this.approverReqObj.data.exceptionId.includes(data.exceptionType)) {
      this.approverReqObj.data.exceptionId = arrayRemove(this.approverReqObj.data.exceptionId, data.exceptionType);
    } else {
      this.approverReqObj.data.exceptionId.push(data.exceptionType);
    }
    if (this.approverReqObj.data.exceptionId.length > 0) {
      this.isChecked = true;
    }
    //  console.log(this.approverReqObj);
  }

  becomeApproverBulk() {
    // console.log(this.approverReqObj);
    this.blockUiService.spinnerConfig.blockUI();
    this.type = 'becomeApprover';
    this.approverTeamService.becomeApprover(this.approverReqObj, this.type).subscribe((response: any) => {
      //  this.type = 'becomeApprover';
      this.checkBecomeApproverApiResponse(response, '', this.type);
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 200);
    });
  }

  dropDecision(data) {
    this.approvalDecision = [];
    for (const d of data.decisions) {
      if (!this.approvalDecision.includes(d.decisionType)) {
        this.approvalDecision.push(d.decisionType);
      }
    }
    this.showSubmitDecision = true;
    // console.log(data.decisions, this.approvalDecision)
    data.selectDecisionDropsearch = true;
  }

  selectDecisionBulk(e, data) {
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

    data.selectedDecision['decisionType'] = e;
    this.isDecisionSelected = true;

    if (data.exceptionName === 'Request One Time Discount' && data.selectedDecision.decisionType === 'REJECTED') {
      this.justificationMandatory = true;
    } else {
      this.justificationMandatory = false;
    }
    data.selectDecisionDropsearch = false;
  }
  dropReason(data) {
    if (data.selectedDecision && data.selectedDecision.decisionType) {
      for (const d of data.decisions) {
        if (d.decisionType === data.selectedDecision.decisionType) {
          this.giveReason = d.reasons;
        }
      }
      //  console.log(this.giveReason);
      data.selectDecisionReason = true;
    }
  }

  selectReasonBulk(e, data) {
    for (const d of data.decisions) {
      if (d.decisionType === data.selectedDecision.decisionType) {
        if (!data['selectedReason']) {
          this.reasonsSelectedCount++;
        }
        data['selectedReason'] = e;
      }
    }
    if (this.reasonsSelectedCount === this.exceptionDecisionData.length &&
      data.exceptionName !== 'Request One Time Discount') {
      this.isReasonSelected = true;
      this.isEnableSubmit = true;
    }
    this.checkRequestPurchaseAdjustment(data);
    data.selectDecisionReason = false;
  }
  checkRequestPurchaseAdjustment(data) {
    if (data.exceptionName === 'Request One Time Discount' && data.selectedDecision.decisionType === 'REJECTED' && !data['comment']) {
      this.isEnableSubmit = false;
    } else if (data.exceptionName === 'Request One Time Discount') {
      this.isEnableSubmit = true;
    }
  }
  //  method to store comment
  approverCommentBulkAdded(event, data, index) {
    data['comment'] = event.target.value;
    /*if(data['comment']!='' && data.selectedDecision.decisionType === 'REJECTED'
       && data['selectedReason'] && data.exceptionName === 'Request Purchase Adjustment'){
          this.justificationCount++
    }else if((data['comment'] ==='' || !data['selectedReason']) && data.selectedDecision.decisionType === 'REJECTED'
       && data.exceptionName === 'Request Purchase Adjustment'){
          this.justificationCount--
    }

    let rejectedDecisionCnt = 0;
    for(const ed of this.exceptionDecisionData){
        if(ed.selectedDecision.decisionType === 'REJECTED'){
          rejectedDecisionCnt++
        }
    }
    if(this.justificationCount >= rejectedDecisionCnt ){
      this.isEnableSubmit = true;
    }else{
      this.isEnableSubmit = false;
    }*/

  }

  submitDecisionBulk() {
    const requestObj = {};
    const arr = [];
    arr.push(this.exceptionDecisionData);
    requestObj['data'] = this.exceptionDecisionData;
    // console.log(this.exceptionDecisionData, requestObj); 
    this.blockUiService.spinnerConfig.blockUI();
    this.approverTeamService.submitApproverDecision(requestObj).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.exceptionStatusData = res.data;
        //  console.log(this.exceptionStatusData);
        this.checkApproverDecisionType(this.exceptionStatusData);
        this.isApproverDecisionSubmitted = true;
        this.isApproverSubmittedBulk.emit({ data: this.exceptionStatusData, submittedDecision: true,
          decisionType: this.decisionSelected, pendingExceptions: this.pendingExceptionsLength });
      } else {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  checkApproverDecisionType(data) {
    for (let d of data) {
      if (d.decision === 'Rejected' || d.decision === 'Declined') {
        this.decisionSelected = d.status;
        return;
      }
    }
  }

  //  method to set approverCeC to pending exceptions after becoming approver
  setApproverCec(exceptions, data) {
    //  console.log(exceptions, data)
    for (const d of data) {
      if (exceptions.includes(d.exceptionType)) {
        d.approverName = this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName;
        d.actionedBy = this.appDataService.userInfo.userId;
      }
    }
  }

  downloadPADocument(data) {
    this.approverTeamService.requestDocument(data.proposalId, data.documents[0].documentMappingId).subscribe((response: any) => {
      if (response && !response.error) {
        this.generateFileName(response);
      }
    });
  }

  generateFileName(res) {
    const x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; //  res.headers.get('content-disposition').substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) {
      //  IE & Edge
      //  msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }

  //  method to open modal, enter case number/id and api call to save
  addCaseNumber(type) {
    let reqObj = {
      data: ''
    };
    this.path = type; //  set path where this method is called
    const modalRef = this.modalVar.open(AddCaseIdComponent, { windowClass: 'searchLocate-modal' });
    modalRef.componentInstance.type = this.path;
    modalRef.result.then((result) => {
      // console.log(result)
      //  check result and case number present and call api to save
      if (result && result.caseNumber) {
        reqObj.data = result.caseNumber;
        // console.log(reqObj);
        this.blockUiService.spinnerConfig.blockUI();
        this.approverTeamService.submitCaseNumber(this.proposalDataService.proposalDataObject.proposalId, reqObj).subscribe((res: any) => {
          if (res && !res.error) {
            // console.log(res);
            //  check path is becomeApprover and call become approver api else reload proposal summary page to update case number
            if (this.path === 'becomeApprover') {
              this.setCaseNumber(result.caseNumber); //  method to assign case number after success
              this.becomeApproverBulk();
            } else {
              //  emit if path is not becomeApprover
              this.isSummaryReloadEmitter.emit();
            }
          } else {
            this.blockUiService.spinnerConfig.stopChainAfterThisCall();
            this.blockUiService.spinnerConfig.unBlockUI();
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }

  // method to set case number in data after api success
  setCaseNumber(caseNumber) {
    for (let data of this.exceptionStatusData) {
      if (data.exceptionType === 'PURCHASE_ADJUSTMENT_REQUEST') {
        data['sourceRefId'] = caseNumber;
      }
    }
    return;
  }
    
  convertRegionToString(regionArray){
    return regionArray.join(', ');
  }
}

function arrayRemove(arr, value) {

  return arr.filter(function (ele) {
    return ele !== value;
  });

}
