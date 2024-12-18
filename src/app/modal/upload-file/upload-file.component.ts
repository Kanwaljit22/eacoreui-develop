import { Component, OnInit, ViewChild } from '@angular/core';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FileUploader } from 'ng2-file-upload';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { MessageType } from '@app/shared/services/message';
import { ManageAffiliatesService } from '@app/qualifications/edit-qualifications/manage-affiliates/manage-affiliates.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';


const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
const MONTH = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {


  hasBaseDropZoneOver = false;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  enterAffiliateName = '';
  fileDetail: any = {};
  isEnableProceed = false;
  oldFileName = '';
  fileName = '';
  disableImport = true;
  isLoccUpload = true;
  todaysDate: Date;
  signedDate: Date;
  validMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedMonths = 'Select Months';
  isSelectedValidMonths = false;
  signedDateStr = '';

  constructor(public qualService: QualificationsService, public localeService: LocaleService, public appDataService: AppDataService,
    public messageService: MessageService, public utilitiesService: UtilitiesService, public activeModal: NgbActiveModal,
    public partnerDealCreationService: PartnerDealCreationService, public blockUiService: BlockUiService,
    public proposalDataService: ProposalDataService, public documentCenter: DocumentCenterService) { }

  ngOnInit() {

    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.signedDate = new Date();
    this.qualService.fileFormatError = false;

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

  import() {
    this.blockUiService.spinnerConfig.customBlocker = false;

    if (this.isLoccUpload) {

      let url = 'api/document/partner/upload?type=partnerLoa&partnerLoa&u=' + this.appDataService.userId + '&partnerBeGeoId=' +
      this.qualService.loaData.partnerBeGeoId + '&customerGuId=' + this.qualService.loaData.customerGuId + '&dealId=' + this.qualService.qualification.dealId +
      '&uploadType=partnerLoa&userName=' + this.appDataService.userId + '&noOfMonths=' + this.selectedMonths +
      '&signedDate=' + this.signedDateStr;

      this.partnerDealCreationService.uploadAdditionalDoc(this.fileDetail, url).subscribe((response: any) => {

        if (response && !response.error) {
          this.qualService.loaData.loaSigned = true;
          this.close();
          if (response.data.signatureValidDate) {
            this.appDataService.signatureValidDate = response.data.signatureValidDate;
          }
          if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep || this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep) {
            this.appDataService.loccImport.emit();
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });

    } else {

      let req = {
        // 'file': object.fileNameInQueue,
        'userId': this.appDataService.userId,
        'userName': (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName), // 'Rajeev Kedia',
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'type': 'customerPackage',
        'uploadType': 'loa',
        'isSigned': true
      };
      this.documentCenter.uploadLOADoc(this.fileDetail, req).subscribe((res: any) => {

        if (res && !res.error) {
          this.documentCenter.isLOAUploaded = true;
          this.close(true);
          // this.documentCenter.getProposalDocsData().subscribe((res: any) => {
          //     if (res && !res.error) {
          //       this.flag = ConstantsService.UPLOAD;
          //       this.updateDocCenterData(res, false);
          //     } else {
          //       this.messageService.displayMessagesFromResponse(res);
          //     }
          //   });
        }
      });

    }



  }

  reviewImport() {
    this.disableImport = !this.disableImport;
  }

  removeItem() {

    this.fileName = ''
    this.oldFileName = '';
    this.uploader.queue.length = 0;
    this.qualService.fileFormatError = false;
    this.isEnableProceed = false;
    // if locc file is removed reset the flags
    if (this.isLoccUpload) {
      this.selectedMonths = 'Select Months';
      this.isSelectedValidMonths = false;
    }

  }

  clearFile() {

    this.fileName = this.qualService.qualification.customerInfo.filename;
    this.qualService.fileFormatError = false;
    this.isEnableProceed = false;

    //    this.qualService.qualification.customerInfo.filename = this.oldFileName;
  }

  // This method will be called when close the modal
  close(isImport = false) {

    this.activeModal.close({ import: isImport });
    this.qualService.fileFormatError = false;
  }



  onChange() {

    if (this.qualService.qualification.customerInfo.affiliateNames !== this.enterAffiliateName) {
      this.isEnableProceed = true;
    } else {
      this.isEnableProceed = false;
    }
  }

  focusInput(name) {

  }

  // method to open he dropdown
  // dropMonths() {
  //   this.selectValidMonths.open();
  // }

  // method to select valid months from dropdown
  selectValidMonth(e) {
    this.selectedMonths = e;
    // console.log(e)
    this.isSelectedValidMonths = true;
  }

  // method to select date from date picker in calendar
  onDateSelection($event) {
    if ($event !== null) {
      this.signedDate = $event;
      let x = this.signedDate;
      let a = (x.toString().substring(4, 7));
      this.utilitiesService.changeMessage(false);
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      this.signedDateStr = date_ea;
      // console.log($event, this.signedDateStr);
    }
  }
}
