import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const MONTH = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {

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

  constructor(private activeModal: NgbActiveModal, public vnextStoreService: VnextStoreService, public localizationService:LocalizationService,public elementIdConstantsService: ElementIdConstantsService,
    public eaStoreService: EaStoreService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('upload-document');
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
  }

  close() {
    this.activeModal.close({
      continue: false
    });
  }

  // method to select date from date picker in calendar for EUIF/ Legal Package
  onDateSelection($event) {
    if ($event !== null) {
      this.signedDate = $event;
      let x = this.signedDate;
      let a = (x.toString().substring(4, 7));
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      if (this.docData.isPrgrmTermLoaPresent && !this.loaSignedDateStr) { // make the loaSigned date to Euif signed date if not selected 
        this.loaSignedDate = this.signedDate;
        this.signedDateStr = this.loaSignedDateStr = date_ea;
      } else {
        this.signedDateStr = date_ea;
      }
      if (this.docData.isProgramtermsPresent && !this.docData.isPrgrmTermLoaPresent && this.signedDateStr || (this.docData.isPrgrmTermLoaPresent && this.signedDateStr && this.loaSignedDateStr)) {
        this.disableCheckBox = false;
      } else {
        this.disableCheckBox = true;
      }
    }
  }

  custConsentDateSelection($event){
    if ($event !== null) {
      this.signedDate = $event;
      let x = this.signedDate;
      let a = (x.toString().substring(4, 7));
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      this.signedDateStr = date_ea;
      this.disableCheckBox = false;
    }
  }

  // method to select date from date picker in calendar for LOA
  onDateSelectionForLoa($event) {
    if ($event !== null) {
      this.loaSignedDate = $event;
      let x = this.loaSignedDate;
      let a = (x.toString().substring(4, 7));
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      this.loaSignedDateStr = date_ea;
      if ((this.docData.isPrgrmTermLoaPresent && this.signedDateStr && this.loaSignedDateStr) || (this.docData.isLoaPresent && this.loaSignedDateStr && !this.docData.isPrgrmTermLoaPresent)) {
        this.disableCheckBox = false;
      } else {
        this.disableCheckBox = true;
      }
    }
  }

  review() {
    this.disableConfirm = !this.disableConfirm;
  }

  confirmUpload() {
    this.activeModal.close({
      continue: true,
      signedDateStr: this.signedDateStr,
      loaSignedDateStr: this.loaSignedDateStr,
      loaSignedDate: this.loaSignedDate
    });
  }
}
