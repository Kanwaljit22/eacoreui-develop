import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-enagage-support-team',
  templateUrl: './enagage-support-team.component.html',
  styleUrls: ['./enagage-support-team.component.scss']
})
export class EnagageSupportTeamComponent implements OnInit {

  public exceptionDataObj: any;
  exceptionsData: any;
  exceptionComment = '';
  isCommentWritten = false;
  enablecomment = true;
  enableSubmit = false;
  checkboxValue = false;
  reasonsSelectedCount = 0;
  isReasonSelected = false;
  selectedReasons = [];
  showDropDown = false;
  selectedReason = 'Select a Reason';
  isRequestedEnageSupport = false;
  defaultedPaReasons = [];
  submissionInfo = true;
  constructor(public ngbActiveModal: NgbActiveModal, private vnextService: VnextService, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService,
    public proposalStoreService: ProposalStoreService,private eaRestService: EaRestService, public eaService: EaService, private constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('enagage-support-team');
    this.setExceptionsData();
  }

  // method to set exceptions data from service on modal
  setExceptionsData() {
    this.exceptionsData = this.exceptionDataObj.exceptions;

    // check and set comments if present
    if (this.exceptionDataObj.comment) {
      this.exceptionComment = this.exceptionDataObj.comment;
      this.isCommentWritten = true;
    }
    if (this.exceptionsData) {
      // check and allow user to submit excpetion
      for (const data of this.exceptionsData) {
        if (data.selectedReasons) {
          this.enableSubmit = true;
          this.reasonsSelectedCount++;
        } else {
          this.enableSubmit = false;
        }
        // if pa request and renewalid is not present, remove first reason
        if((data.exceptionType === this.constantsService.PURCHASE_ADJUSTMENT_REQUEST) && !this.proposalStoreService.proposalData.renewalInfo?.id && !this.isRequestedEnageSupport){
          data.reasons.shift()
        }
      }
      // method to check reasons and enable submit button
      this.checkAllReasonsSelected(this.exceptionsData);
    } else {
      this.enableSubmit = false;
    }
  }

  // mehtod to check reasonsSelectedCount with that of exceptions length
  checkAllReasonsSelected(data) {
    if (data === undefined) {
      return;
    }
    if (this.reasonsSelectedCount === data.length) {
      this.isReasonSelected = true;
    }
  }

  selectExceptionsReason(e, type, data) {
    if(this.defaultedPaReasons.includes(e)){
      return;
    }
    // check for request PA exception
    if (!data['selectedReasons']) {
      data['selectedReasons'] = [e];
      this.reasonsSelectedCount++;
    } else {
      const array = data['selectedReasons'];
      if (array.length === 0) {
        array.push(e);
        this.reasonsSelectedCount++;
      } else if (array.includes(e)) {
        data['selectedReasons'] = array.filter(a => a !== e);
        if (array.length === 0) {
          this.reasonsSelectedCount--;
        }
      } else {
        array.push(e);
      }
    }
    this.selectedReasons = data['selectedReasons'];

    // method to check reasons and enable submit button
    this.checkAllReasonsSelected(this.exceptionsData);
    if (this.selectedReasons.length > 0 && this.isCommentWritten) {
      this.enableSubmit = true;
    } else {
      this.enableSubmit = false;
    }
  }

  // method to set comments, check all reasons are selected and enable submit button
  isExceptionCommentChanged() {
    if (!this.exceptionComment.trim()) {
      this.enableSubmit = false;
      this.checkboxValue = false;
      return;
    }
    this.isCommentWritten = true;
    this.exceptionDataObj['comment'] = this.exceptionComment;
    this.checkAllReasonsSelected(this.exceptionsData);
    if (this.selectedReasons.length > 0) {
      this.enableSubmit = true;
    }
  }

  close() {
    this.ngbActiveModal.close({
      continue: false
    });
  }
  
    // method to submit updated dataobj from modal
    submit() {
  
      this.ngbActiveModal.close({
        engage: true,
        requestData: this.exceptionDataObj,
        continue: true
      });
    }

    // method to check selected reasons and set the checkbox selection
  checkSelectedReasons(reason) {
    if (this.selectedReasons.includes(reason)) {
      return true;
    } else {
      return false;
    }
  }

  withdrawSupport(){
    this.ngbActiveModal.close({
      engage: false,
      continue: true
    });
  }

  edit(){
    
    const url = "proposal/"+ this.proposalStoreService.proposalData.objId +"/ext-cust-request-pa-reasons";
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        if (response.data.paReasons && response.data.paReasons.length) {
          this.defaultedPaReasons = response.data.paReasons;
          this.isRequestedEnageSupport = false;
        }
      }
    });
  }

  prepareSelectedReasons(exception){
    if(!this.selectedReasons.length){
      this.selectedReasons = exception.selectedReasons ? exception.selectedReasons : [];
    }
    this.showDropDown = true; 
  }

  //  textAreaAdjust(element) {
  //   element.style.height = "1px";
  //   element.style.height = (25+element.scrollHeight)+"px";
  // }
  
}
