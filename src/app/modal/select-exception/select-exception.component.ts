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
  selector: 'app-select-exception',
  templateUrl: './select-exception.component.html',
  styleUrls: ['./select-exception.component.scss']
})
export class SelectExceptionComponent implements OnInit {
  isBillingAnnual: boolean;
  @ViewChild('selectReasonDiscount', { static: false }) selectReasonDiscount: NgbDropdown;
  @ViewChild('myDropReasonselect', { static: false }) myDropReasonselect;
  exceptionReason = [];
  exceptionDiscount = [];
  // exceptionReason = ['Student Count Exclusion', 'IB Mismatch', 'Other'];
  selectedReason = 'Select Reason';
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
  enableAccept = false;
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
    private blockUiService: BlockUiService, public qualService: QualificationsService, private messageService: MessageService) { }

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
    // check and allow user to submit excpetion
    for (const d of this.exceptionsData) {
      if(d.exceptionType === 'PURCHASE_ADJUSTMENT_REQUEST' && d["selectedReasons"]){
        this.selectedReasons = d["selectedReasons"];
        this.reasonsSelectedCount++;

      } else {
        if (d.selectedReasons) {
          this.enableSubmit = true;
          this.reasonsSelectedCount++;
        } else {
          this.enableSubmit = false;
        }
      }
    }
    

    // method to check reasons and enable submit button
    this.checkAllReasonsSelected(this.exceptionsData);
    // console.log(this.exceptionsData)
  }

  // method to check selected reasons and set the checkbox selection
  checkSelectedReasons(reason){
    if(this.selectedReasons.includes(reason)){
      return true;
    } else {
      return false;
    }
  }

  // method to select exception reasons and set in the data
  selectExceptionsReason(e, type, data) {
    // check for request PA exception
    if(type === 'PURCHASE_ADJUSTMENT_REQUEST'){
      if(!data["selectedReasons"]){
        data["selectedReasons"] = [e];
        this.reasonsSelectedCount++;
      } else {
        const array = data["selectedReasons"];
        if(array.length === 0){
          array.push(e);
          this.reasonsSelectedCount++;
        } else if(array.includes(e)){
          data["selectedReasons"] = array.filter(a => a !== e);
          if(data["selectedReasons"].length === 0){
            this.reasonsSelectedCount--;
          }
        } else {
          array.push(e)
        }
      }
      this.selectedReasons = data["selectedReasons"];
    } else {
      for (let i = 0; i < this.exceptionsData.length; i++) {
        if (this.exceptionsData[i].exceptionType === type) {
          if (!this.exceptionsData[i]['selectedReasons']) {
            this.reasonsSelectedCount++;
          }
          this.exceptionsData[i]['selectedReasons'] = [e];
        }
      }
    }
    // console.log(this.reasonsSelectedCount);
    // method to check reasons and enable submit button
    this.checkAllReasonsSelected(this.exceptionsData);
  }

  // mehtod to check reasonsSelectedCount with that of exceptions length
  checkAllReasonsSelected(data) {
    if (this.reasonsSelectedCount === data.length) {
      this.isReasonSelected = true;
    } else {
      this.isReasonSelected = false;
    }

    if (this.isReasonSelected && this.isCommentWritten) {
      this.enableSubmit = true;
    } else {
      this.enableSubmit = false;
    }
  }

  // method to set comments, check all reasons are selected and enable submit button
  isExceptionCommentChanged(event) {
    if (!this.exceptionComment.trim()) {
      this.enableSubmit = false;
      this.enableAccept = false;
      this.checkboxValue = false;
      return;
    }
    this.isCommentWritten = true;
    this.exceptionDataObj['comment'] = this.exceptionComment;
    this.checkAllReasonsSelected(this.exceptionsData);
  }

  // method to submit updated dataobj from modal
  submit() {
    // this.exceptionDataObj.exceptions = this.exceptionsData;
    // console.log(this.selectedReason ,this.selectedDiscount, this.exceptionComment, this.exceptionDataObj);
    this.blockUiService.spinnerConfig.blockUI();
    // check if upload is shown and file is uploaded call upload api else close modal and submit for approval
    if (this.exceptionDataObj.showUpload && this.fileDetail && this.fileDetail.name) {
      this.proceed();
    } else {
      this.activeModal.close({
        requestData: this.exceptionDataObj,
        continue: true
      });
    }
  }

  cancel() {
    this.activeModal.close({
    });
  }

  reviewChange() {
    this.enableAccept = !this.enableAccept;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any) {

    this.fileDetail = evt[0];
    this.allowOnlyPDF();

    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  onFileChange(evt: any) {

    const target: DataTransfer = <DataTransfer>(evt.target);
    this.fileDetail = target.files[0];
    this.allowOnlyPDF();

    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  processFile(file) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    this.qualService.fileFormatError = false;
    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.qualService.fileFormatError = true;
      this.qualService.qualification.customerInfo.filename = file.name;
      // return;
    } else { // If uploaded file is pdf file then need to make ajax call and upload the file.
      // const formData = new FormData();
      // formData.append(fileName, file);

    }
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



  allowOnlyPDF() {

    this.fileName = this.fileDetail.name;
    const idxDot = this.fileName.lastIndexOf('.') + 1;
    const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();

    this.fileType = extFile;

    // if (['pdf'].indexOf(extFile) === -1) {
    //   this.uploader.queue.length = 0;
    //   this.qualService.fileFormatError = true;
    //   //return;
    // }else {
    //     this.isEnableProceed = true;
    // }
  }


  removeItem() {

    this.uploader.queue.length = 0;
    this.qualService.fileFormatError = false;
    this.qualService.qualification.customerInfo.filename = '';
    this.fileName = '';
    this.oldFileName = '';

  }

  clearFile() {

    this.fileName = this.qualService.qualification.customerInfo.filename;
    this.qualService.fileFormatError = false;
    //    this.qualService.qualification.customerInfo.filename = this.oldFileName;
  }

  // This method will be called when close the modal
  close() {

    this.activeModal.close();
    this.qualService.fileFormatError = false;
  }


  focusInput(name) {

  }



}

