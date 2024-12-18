import { ProposalDataService } from './../../proposal/proposal.data.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownConfig, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { FileUploader } from 'ng2-file-upload';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';


@Component({
  selector: 'app-engage-support',
  templateUrl: './engage-support.component.html',
  styleUrls: ['./engage-support.component.scss']
})
export class EngageSupportComponent implements OnInit {
  isBillingAnnual: boolean;
  @ViewChild('selectReasonDiscount', { static: false }) selectReasonDiscount: NgbDropdown;
  @ViewChild('myDropReasonselect', { static: false }) myDropReasonselect;
  exceptionReason = [];
  exceptionDiscount = [];
  // exceptionReason = ['Student Count Exclusion', 'IB Mismatch', 'Other'];
  selectedReason = 'Select a Reason';
  // exceptionDiscount = ['Student Count Exclusion', 'IB Mismatch', 'Other'];
  selectedDiscount = 'Select Reason';
  public exceptionDataObj: any;
  pendingExceptions = [];
  isReasonSelected = false;
  isDiscountSelected = false;
  isCommentWritten = false;
  enablecomment = true;
  enableSubmit = false;
  checkboxValue = false;
  exceptionComment = '';
  exceptionsData: any;
  requestObj = { 'exceptions': [] };
  reasonsSelectedCount = 0;
  hasBaseDropZoneOver = false;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  oldFileName = '';
  fileName = '';
  fileDetail: any = {};
  fileFormatError = false;
  isEnableProceed = false;
  fileType = '';
  selectedReasons = [];

  constructor(public activeModal: NgbActiveModal, public appDataService: AppDataService, public localeService: LocaleService,
    private blockUiService: BlockUiService, public qualService: QualificationsService, private messageService: MessageService,
    public proposalDataService : ProposalDataService) { }

  ngOnInit() {
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
      for (const d of this.exceptionsData) {
        if (d.selectedReason) {
          this.enableSubmit = true;
          this.reasonsSelectedCount++;
        } else {
          // this.reasonsSelectedCount--;
          this.enableSubmit = false;
        }
      }
      // method to check reasons and enable submit button
      this.checkAllReasonsSelected(this.exceptionsData);
    } else {
      this.enableSubmit = false;
    }
    // console.log(this.exceptionsData)
  }

  // // method to select exception reasons and set in the data
  // selectExceptionsReason(e, type) {
  //   for (let i = 0; i < this.exceptionsData.length; i++) {
  //     if (this.exceptionsData[i].exceptionType === type) {
  //       if (!this.exceptionsData[i]['selectedReason']) {
  //         this.reasonsSelectedCount++;
  //       }
  //       this.exceptionsData[i]['selectedReason'] = e;
  //     }
  //   }
  //   // console.log(this.reasonsSelectedCount);
  //   // method to check reasons and enable submit button
  //   this.checkAllReasonsSelected(this.exceptionsData);
  //   if (this.isReasonSelected && this.isCommentWritten) {
  //     this.enableSubmit = true;
  //   }
  // }

  selectExceptionsReason(e, type, data) {
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

    // console.log(this.reasonsSelectedCount);
    // method to check reasons and enable submit button
    this.checkAllReasonsSelected(this.exceptionsData);
    if (this.selectedReasons.length > 0 && this.isCommentWritten) {
      this.enableSubmit = true;
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
    if (this.selectedReasons.length > 0  || this.proposalDataService.cxProposalFlow) {
      this.enableSubmit = true;
    }
  }

  // method to submit updated dataobj from modal
  submit(flag) {

    this.blockUiService.spinnerConfig.blockUI();

    this.activeModal.close({
      requestData: this.exceptionDataObj,
      continue: true,
      goTopriceEst :flag
    });
  }

  cancel() {
    this.activeModal.close({
    });
  }



  proceed() {
    this.fileName = this.fileDetail.name;
    this.qualService.uploadFile(this.fileDetail, this.exceptionDataObj.proposalId).subscribe((response: any) => {
      if (!response.error && !response.messages) { // no errors or messages close modal and call submit for approval api
        this.activeModal.close({
          requestData: this.exceptionDataObj,
          continue: true
        });
      } else { // if error stop the loader and show message on UI
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.messageService.displayMessagesFromResponse(response);
      }
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


  // This method will be called when close the modal
  close() {

    this.activeModal.close();
    this.qualService.fileFormatError = false;
  }


  focusInput(name) {

  }



}

