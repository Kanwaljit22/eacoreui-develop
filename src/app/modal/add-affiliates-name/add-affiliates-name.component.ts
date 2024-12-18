import { Component, OnInit, Input } from '@angular/core';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FileUploader } from 'ng2-file-upload';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { MessageType } from '@app/shared/services/message';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { ManageAffiliatesService } from '@app/qualifications/edit-qualifications/manage-affiliates/manage-affiliates.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-add-affiliates-name',
  templateUrl: './add-affiliates-name.component.html',
  styleUrls: ['./add-affiliates-name.component.scss']
})
export class AddAffiliatesNameComponent implements OnInit {


  hasBaseDropZoneOver = false;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  enterAffiliateName = '';
  fileDetail: any = {};
  isEnableProceed = false;
  oldFileName = '';
  fileName = '';
  displayLimitMsg = false;
  @Input() showChangeAffiliateOnUI: boolean;

  constructor(public qualService: QualificationsService, public localeService: LocaleService,
    public appDataService: AppDataService, public messageService: MessageService, public involvedService: WhoInvolvedService,
    public manageAffiliatesService: ManageAffiliatesService,
    public utilitiesService: UtilitiesService, public activeModal: NgbActiveModal) { }

  ngOnInit() {

    if (this.qualService.qualification.customerInfo.affiliateNames &&
      this.qualService.qualification.customerInfo.affiliateNames.length > 0) {
      this.enterAffiliateName = this.qualService.qualification.customerInfo.affiliateNames;
    }
    this.qualService.fileFormatError = false;
    this.fileName = this.qualService.qualification.customerInfo.filename;
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


  allowOnlyPDF() {

    this.fileName = this.fileDetail.name;
    const idxDot = this.fileName.lastIndexOf('.') + 1;
    const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();

    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.qualService.fileFormatError = true;
      // return;
    } else {
      this.isEnableProceed = true;
    }
  }

  proceed() {

    this.fileName = this.fileDetail.name;
    const qualId = this.qualService.qualification.qualID;
    this.involvedService.uploadPdfFile(this.fileDetail, qualId, this.enterAffiliateName).subscribe((response: any) => {
      if (!response.error && !response.messages) {
        // TODO : need to put success message.
        if (this.fileName && this.fileName.length > 0) {
          this.qualService.qualification.customerInfo.filename = this.fileName;
        }
        this.qualService.qualification.customerInfo.affiliateNames = this.enterAffiliateName;
        this.activeModal.close();
      }
    });
  }

  removeItem() {
    // item.remove();
    this.involvedService.removeFile().subscribe((res: any) => {
      if (!res.error) {
        this.uploader.queue.length = 0;
        this.qualService.fileFormatError = false;
        this.qualService.qualification.customerInfo.filename = '';
        this.fileName = '';
        this.oldFileName = '';

        if (this.enterAffiliateName.length > 0 &&
          (this.qualService.qualification.customerInfo.affiliateNames === this.enterAffiliateName)) {

          this.isEnableProceed = false;
        } else if (this.enterAffiliateName.length === 0) {
          this.isEnableProceed = false;
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }

    });
    // this.colHeaders = [];
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



  onChange() {
    if (this.enterAffiliateName.length > 200) {
      this.isEnableProceed = false;
      this.displayLimitMsg = true;
      return;
    } else {
      this.displayLimitMsg = false;
    }

    if (this.qualService.qualification.customerInfo.affiliateNames !== this.enterAffiliateName) {
      this.isEnableProceed = true;
    } else {
      this.isEnableProceed = false;
    }
  }

  focusInput(name) {

  }

}
