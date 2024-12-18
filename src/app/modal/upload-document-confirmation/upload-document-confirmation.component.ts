import { Component, OnInit } from '@angular/core';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { FileUploader } from 'ng2-file-upload';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { NgbActiveModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
const MONTH = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};
@Component({
  selector: 'app-upload-document-confirmation',
  templateUrl: './upload-document-confirmation.component.html',
  styleUrls: ['./upload-document-confirmation.component.scss']
})
export class UploadDocumentConfirmationComponent implements OnInit {

  isEnableProceed = false;
  todaysDate: Date;
  signedDate: any = '';
  validMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedMonths = 'Select Months';
  isSelectedValidMonths = false;
  signedDateStr = ''; // set for EUIF/Legal Package
  loaSignedDateStr = ''; // set for LOA
  docData: any = {}; // set doc data with legal, EUIf & loa present flags
  loaSignedDate: any = '';
  disableCheckBox = true; // to disable checkbox
  disableConfirm = true; // to disable confirm button

  constructor(public qualService: QualificationsService, public localeService: LocaleService, public appDataService: AppDataService,
    public messageService: MessageService, public utilitiesService: UtilitiesService, public activeModal: NgbActiveModal,
    public partnerDealCreationService: PartnerDealCreationService, public blockUiService: BlockUiService,
    public proposalDataService: ProposalDataService, public documentCenter: DocumentCenterService) { }

  ngOnInit() {
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    // this.signedDate = new Date();
    // this.loaSignedDate = new Date();
  }

  // sent dates if selected and clicked confirm
  confirm() {
    this.activeModal.close({ continue: true, signedDateStr: this.signedDateStr, loaSignedDateStr: this.loaSignedDateStr, loaSignedDate: this.loaSignedDate });
  }

  // This method will be called when close the modal
  close() {
    this.activeModal.close({ continue: false });
  }



  // method to select date from date picker in calendar for EUIF/ Legal Package
  onDateSelection($event) {
    if ($event !== null) {
      this.signedDate = $event;
      let x = this.signedDate;
      let a = (x.toString().substring(4, 7));
      this.utilitiesService.changeMessage(false);
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      if(this.docData.isEuifLoaPresent && !this.loaSignedDateStr){ // make the loaSigned date to Euif signed date if not selected 
        this.loaSignedDate = this.signedDate;
        this.signedDateStr = this.loaSignedDateStr = date_ea;
      } else {
        this.signedDateStr = date_ea;
      }
      if ((this.docData.isLegalPackagePresent || this.docData.isEuifPresent) && !this.docData.isEuifLoaPresent && this.signedDateStr || (this.docData.isEuifLoaPresent && this.signedDateStr && this.loaSignedDateStr)) {
        this.disableCheckBox = false;
      } else {
        this.disableCheckBox = true;
      }
    }
  }

  // method to select date from date picker in calendar for LOA
  onDateSelectionForLoa($event) {
    if ($event !== null) {
      this.loaSignedDate = $event;
      let x = this.loaSignedDate;
      let a = (x.toString().substring(4, 7));
      this.utilitiesService.changeMessage(false);
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      this.loaSignedDateStr = date_ea;
      if ((this.docData.isEuifLoaPresent && this.signedDateStr && this.loaSignedDateStr) || (this.docData.isLoaPresent && this.loaSignedDateStr && !this.docData.isEuifLoaPresent)) {
        this.disableCheckBox = false;
      } else {
        this.disableCheckBox = true;
      }
    }
  }

  review() {
    this.disableConfirm = !this.disableConfirm;
  }
}
