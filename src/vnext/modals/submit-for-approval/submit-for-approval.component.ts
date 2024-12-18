import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { FileUploader } from 'ng2-file-upload';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';


const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-submit-for-approval',
  templateUrl: './submit-for-approval.component.html',
  styleUrls: ['./submit-for-approval.component.scss']
})
export class SubmitForApprovalComponent implements OnInit {
 exceptionData : IExceptionApproval = {};
 reasonsSelectedCount = 0; // increase when reasons selected for each exception
 exceptionComment = ''; // set exceptionComment
 isCommentWritten = false;// set if comment added
 enableSubmit = false; // to enable submit button
 checkboxValue = false; // to set checkedbox
 enableAccept = false; // set if accepted the checkbox
 selectedReasonsForPA = [];
 hasBaseDropZoneOver = false;
  oldFileName = '';
  fileName = '';
  fileDetail: any = {};
  fileFormatError = false;
  fileType = '';
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  deafultedPaReasonString= '';

  constructor(private activeModal: NgbActiveModal, public proposalRestService: ProposalRestService, private vnextService: VnextService,
    private proposalStoreService: ProposalStoreService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('submit-for-approval');
    this.getData();
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  getData(){
    const url =  this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/initiate-exception-request';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        
        this.exceptionData = response.data.requestExceptionOption;
        // this.exceptionData.showUpload = true;
        this.setExceptionsData()
      }
    });
    // this.exceptionData = this.res
    

  }

  setExceptionsData(){
    if(this.exceptionData.comment){
      this.exceptionComment = this.exceptionData.comment;
      this.isCommentWritten = true;
    }

        // check and allow user to submit excpetion
        for (const d of this.exceptionData.exceptions) {

          // check if any exception has only 1 reason present and no selected reasons present -- set it as selected reasons
          if (d.reasons && d.reasons.length === 1 && !d.selectedReasons){
            d.selectedReasons = d.reasons;
          }

          if(d.exceptionType === 'PURCHASE_ADJUSTMENT_REQUEST' && d["selectedReasons"]){
            this.selectedReasonsForPA = d["selectedReasons"];
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
    this.checkAllReasonsSelected(this.exceptionData.exceptions);
  }

  // method to check/uncheck checkbox
  submit(){
    this.activeModal.close();
    //this.proposalRestService.proposalApproval(this.disableButton);
  }


  selectReason(val, exceptionType, exception) {
    if(val === this.deafultedPaReasonString){
      return;
    }
    // check if one reason present and selected reason is same as the already selected reason don't do any action
    if (exception.reasons.length === 1 && exception.selectedReason && val === exception.selectedReason){
      return;
    }
    // check for request PA exception
    if(exceptionType === 'PURCHASE_ADJUSTMENT_REQUEST'){
      if(!exception["selectedReasons"]){
        exception["selectedReasons"] = [val];
        this.reasonsSelectedCount++;
      } else {
        const array = exception["selectedReasons"];
        if(array.length === 0){
          array.push(val);
          this.reasonsSelectedCount++;
        } else if(array.includes(val)){
          exception["selectedReasons"] = array.filter(a => a !== val);
          if(exception["selectedReasons"].length === 0){
            this.reasonsSelectedCount--;
          }
        } else {
          array.push(val)
        }
      }
      this.selectedReasonsForPA = exception["selectedReasons"];
    } else {
      for (let i = 0; i < this.exceptionData.exceptions.length; i++) {
        if (this.exceptionData.exceptions[i].exceptionType === exceptionType) {
          if (!this.exceptionData.exceptions[i]['selectedReasons']) {
            this.reasonsSelectedCount++;
          }
          this.exceptionData.exceptions[i]['selectedReasons'] = [val];
          break;
        }
      }
    }
    
    exception.showDropdown = false;
    this.checkAllReasonsSelected(this.exceptionData.exceptions);
  }

  isExceptionCommentChanged(event) {
    if (!this.exceptionComment.trim()) {
      this.enableSubmit = false;
      this.enableAccept = false;
      this.checkboxValue = false;
      this.isCommentWritten = false;
      return;
    }
    this.isCommentWritten = true;
    this.exceptionData['comment'] = this.exceptionComment
    this.checkAllReasonsSelected(this.exceptionData.exceptions)
  }

  checkAllReasonsSelected(data) {
    let isReasonSelected = false;
    if (this.reasonsSelectedCount === data.length) {
      isReasonSelected = true;
    } else {
      isReasonSelected = false;
    }

    if (isReasonSelected && this.isCommentWritten) {
      this.enableSubmit = true;
    } else {
      this.enableSubmit = false;
    }
  }

  review(){
    this.enableAccept = !this.enableAccept;
  }

  submitApprovalReasons(){
    const requestObj = {
      data: {
        proposalObjId : this.proposalStoreService.proposalData.objId,
        exceptions: this.exceptionData.exceptions,
        comment: this.exceptionComment
      }
    }

    if (this.exceptionData.showUpload && this.fileDetail && this.fileDetail.name) {
      this.proceed(requestObj);
    } else {
      this.activeModal.close({
        continue : true,
        requestObj: requestObj
      });
    }

  }

  // method to check selected reasons and set the checkbox selection
  checkSelectedReasons(reason) {
    if (this.selectedReasonsForPA.includes(reason)) {
      return true;
    } else {
      return false;
    }
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
    this.fileFormatError = false;
    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.fileFormatError = true;
      // return;
    } else { // If uploaded file is pdf file then need to make ajax call and upload the file.
      // const formData = new FormData();
      // formData.append(fileName, file);

    }
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
    this.fileFormatError = false;
    this.fileName = '';
    this.oldFileName = '';

  }

  clearFile() {

    this.fileName = '';
    this.fileFormatError = false;
  }

  proceed(requestObj) {
    this.fileName = this.fileDetail.name;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/upload/doc/pa-exception'
    const formdata: FormData = new FormData();

    if (this.fileDetail && this.fileDetail.name && this.fileDetail.name.length > 0) {
      formdata.append('file', this.fileDetail);
    }
    this.proposalRestService.postApiCall(url, formdata).subscribe((response: any) => {
      if (!response.error && !response.messages) { // no errors or messages close modal and call submit for approval api
        this.activeModal.close({
          continue : true,
          requestObj: requestObj
        });
      }
    });
  }

}


export interface IExceptionApproval {
  comment?: string;
  showUpload?: boolean;
  exceptions?: IExceptionReasons[];
}

export interface IExceptionReasons{
  autoApprovalCandidate?: boolean;
  exceptionType?: string ;
  label?: string ;
  reasonSelectionOptional?: boolean ;
  reasons?: string[] ;
  selectedReasons?: string[];
}