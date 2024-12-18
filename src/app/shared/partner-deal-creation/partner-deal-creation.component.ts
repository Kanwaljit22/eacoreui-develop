import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { LocaleService } from '../services/locale.service';
import { FileUploader } from 'ng2-file-upload';
import { AppDataService } from '../services/app.data.service';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
import { EditWhoInvolvedComponent } from '../../modal/edit-who-involved/edit-who-involved.component';
import { NgbModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { InitiateDocusignWarningComponent } from '../../modal/initiate-docusign-warning/initiate-docusign-warning.component';
import { Router } from '@angular/router';
import { SubHeaderComponent } from '../sub-header/sub-header.component';
import { LoccConfirmationComponent } from '@app/modal/locc-confirmation/locc-confirmation.component';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BlockUiService } from '../services/block.ui.service';

const MONTH = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
@Component({
  selector: 'app-partner-deal-creation',
  templateUrl: './partner-deal-creation.component.html',
  styleUrls: ['./partner-deal-creation.component.scss']
})
export class PartnerDealCreationComponent implements OnInit, OnDestroy {
  initiateStep1: boolean;
  initiateStep2: boolean;
  initiateStep3: boolean;
  uploadDocument: boolean;
  deferDocument: boolean;
  filesUploadedData = [];
  disableContinue = true;
  uploadType = '';
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  fileFormatError = false;
  file: any;
  hasBaseDropZoneOver = false;
  fileDetail: any = {};
  fileName = '';
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  signaturePending = false;
  signatureSigned = false;
  isShowContinue = false;
  isShowSendAgain = false;
  showLOCCView = false;
  todaysDate: Date;
  signedDate: Date;
  validMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  selectedMonths = 'Select Months';
  isSelectedValidMonths = false;
  signedDateStr = '';
  isGreenfiled = false;
  isBrownField = false;
  isLoaCustomerContactPresent = false;
  public subscribers: any = {};

  constructor(public localeService: LocaleService, public appDataService: AppDataService,
    public partnerDealCreationService: PartnerDealCreationService, private modalVar: NgbModal,
    public qualService: QualificationsService, private utilitiesService: UtilitiesService,
    public messageService: MessageService, public _router: Router, private blockUiService: BlockUiService) { }

  ngOnInit() {
    // debugger;
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.signedDate = this.todaysDate;
    this.uploadDocument = false;
    this.deferDocument = false;
    this.qualService.qualification.customerInfo = {
      'accountName': '',
      'address': '',
      'smartAccount': '',
      'preferredLegalName': '',
      'scope': '',
      'affiliateNames': '',
      'repName': '',
      'repTitle': '',
      'repEmail': '',
      'filename': '',
      'repFirstName': '',
      'repLastName': '',
      'phoneCountryCode':'',
      'dialFlagCode': '',
      'phoneNumber':''
    };
    this.qualService.qualification.legalInfo = {
      'addressLine1': '',
      'addressLine2': '',
      'city': '',
      'country': '',
      'state': '',
      'zip': ''
    };

    this.blockUiService.spinnerConfig.unBlockUI();
    // var hashValue  = this.appDataService.partnerParam;
    this.partnerDealCreationService.getLOCCData().subscribe((response: any) => {

      if (response && !response.error && response.data) {
        // If we have redirect url then redirect from LOCC page
        if (response.data.redirect) {
          //    window.open('http://localhost:4200/#/qualifications/proposal/4619','_self')
          window.open(response.data.redirectUrl, '_self');
          return;
        }
        // To not show LOCC page when redirecting this flag is set false
        this.showLOCCView = true;// set if data is loaded and present
        this.qualService.loaData = response.data;
        if (!this.qualService.loaData.partnerDeal) {
          this._router.navigate(['']);
          return;
        }

        // set subRef Id
        if (response.data.subRefId) {
          this.qualService.subRefID = response.data.subRefId
        }

        this.qualService.qualification.dealId = response.data.loaDetail.deal.dealId;
        this.qualService.dealData.dealId = this.qualService.qualification.dealId;
        this.qualService.dealData.dealStatus = this.qualService.loaData.loaDetail.deal.dealStatusDesc;
        this.qualService.dealData.dealName = this.qualService.loaData.loaDetail.deal.optyName;
        this.appDataService.qualListForDeal = true;
        this.qualService.prepareSubHeaderObject(SubHeaderComponent.QUALIFICATION, true);
        this.qualService.showDealIDInHeader = true;
        this.isGreenfiled = this.qualService.loaData.greenfield;
        this.isBrownField = this.qualService.loaData.brownfieldPartner;
        if (this.qualService.loaData.loaSigned || (this.qualService.loaData.document &&
          this.qualService.loaData.document.status === ConstantsService.PENDING_STATUS)) { // set showdeallookup if loa signed
          this.appDataService.signatureValidDate = response.data.loaDetail.signatureValidDate;
          this.qualService.isShowDealLookUp = true;
          this.signatureSigned = true;
          this.signaturePending = false;
        } else if (this.isGreenfiled || this.isBrownField) { // if customer is greenfield show deal lookup
          this.qualService.isShowDealLookUp = true;
        } else {
          this.qualService.isShowDealLookUp = false;
        }

        this.isShowSendAgain = false;
        if (this.qualService.loaData.document && this.qualService.loaData.document.status === ConstantsService.PENDING_STATUS) {

          this.signatureSigned = false;
          this.signaturePending = true;
          this.isShowSendAgain = true;
        }

        // check for loacustomer contact, set it to empty and set legal info, preferred legal name if not present
        if ((!this.qualService.loaData.loaDetail.loaCustomerContact || (this.qualService.loaData.loaDetail.loaCustomerContact && Object.keys(this.qualService.loaData.loaDetail.loaCustomerContact).length === 0))) {
          this.qualService.loaData.loaDetail['loaCustomerContact'] = {};
          this.isLoaCustomerContactPresent = false;
          this.qualService.qualification.legalInfo = this.qualService.loaData.loaDetail.deal.accountAddressDetail;
          this.qualService.qualification.customerInfo.preferredLegalName = this.qualService.loaData.loaDetail.deal.accountName;
        } else {
          this.qualService.qualification.legalInfo = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalAddress;
          this.qualService.qualification.customerInfo.preferredLegalName = this.qualService.loaData.loaDetail.loaCustomerContact.preferredLegalName;
          if(!this.qualService.loaData.loaDetail.loaCustomerContact.repName || !this.qualService.loaData.loaDetail.loaCustomerContact.repTitle || !this.qualService.loaData.loaDetail.loaCustomerContact.repEmail){
            this.isLoaCustomerContactPresent = false
          } else {
            this.isLoaCustomerContactPresent = true;
            this.qualService.qualification.customerInfo.repName = this.qualService.loaData.loaDetail.loaCustomerContact.repName;
            this.qualService.qualification.customerInfo.repTitle = this.qualService.loaData.loaDetail.loaCustomerContact.repTitle;
            this.qualService.qualification.customerInfo.repEmail = this.qualService.loaData.loaDetail.loaCustomerContact.repEmail;
            this.qualService.qualification.customerInfo.repFirstName = this.qualService.loaData.loaDetail.loaCustomerContact.repFirstName;
            this.qualService.qualification.customerInfo.repLastName = this.qualService.loaData.loaDetail.loaCustomerContact.repLastName;
            this.qualService.qualification.customerInfo.phoneNumber = this.qualService.loaData.loaDetail.loaCustomerContact.phoneNumber;
            this.qualService.qualification.customerInfo.phoneCountryCode = this.qualService.loaData.loaDetail.loaCustomerContact.phoneCountryCode;
            this.qualService.qualification.customerInfo.dialFlagCode = this.qualService.loaData.loaDetail.loaCustomerContact.dialFlagCode;
          }
        }
        if (this.qualService.isShowDealLookUp) {
          // emit after the api is loaded to show deal details and create qual
          this.qualService.partnerDealLookUpEmitter.emit();
        }

      } else {
        this.showLOCCView = false;// set if no data or error present to hide locc landing page
        this.appDataService.persistErrorOnUi = true;
        this.messageService.displayMessagesFromResponse(response);
      }
      //     console.log('loa response',response);
    });

    this.subscribers.loaCustomerContactUpdateEmitter = this.qualService.loaCustomerContactUpdateEmitter.subscribe((data: any) => {
      this.isLoaCustomerContactPresent = true;
    });
  }

  ngOnDestroy() {
    this.appDataService.persistErrorOnUi = false;
    if(this.subscribers.loaCustomerContactUpdateEmitter){
      this.subscribers.loaCustomerContactUpdateEmitter.unsubscribe();
    }
  }

  selectAuthorization(event) {
    if (event.target.value === 'defer') {
      this.deferDocument = true;
      this.removeUploadedDocs(); // to remove all the uploaded docs
    } else if (event.target.value === 'signature') {
      if (!(this.initiateStep2 || this.initiateStep3 || this.isShowSendAgain)) {
        this.initiateStep1 = true;
      }
      this.deferDocument = false;
      this.uploadDocument = false;
      this.removeUploadedDocs(); // to remove all the uploaded docs
    } else {
      this.deferDocument = false;
      this.uploadDocument = true;
    }
  }

  // method to remove all the uplaoded docs when switched radio button selections
  removeUploadedDocs() {
    if (this.filesUploadedData && this.filesUploadedData.length > 0) {
      this.filesUploadedData = [];
    }
  }
  goToWhoInvolved() {
    const modalRef = this.modalVar.open(EditWhoInvolvedComponent, { windowClass: 'editCustInfo' });
    modalRef.componentInstance.isPartnerLed = true;
    modalRef.componentInstance.isForLocc = true;
    modalRef.componentInstance.isFromPartnerLanding = true;
    // this.qualService.comingFromDocCenter = true;
  }

  continue() {
    if (this.initiateStep1) {
      this.initiateStep2 = true;
      this.initiateStep1 = false;
    } else if (this.initiateStep2) {
      this.initiateStep3 = true;
      this.initiateStep2 = false;
    }
  }

  isCustomerReady(event) {
    if (event.target.value === 'yes') {
      this.disableContinue = false;
    } else {
      this.disableContinue = true;
    }
  }

  back() {
    if (this.initiateStep2) {
      this.initiateStep2 = false;
      this.initiateStep1 = true;
    } else if (this.initiateStep3) {
      this.initiateStep3 = false;
      this.initiateStep2 = true;
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any) {
    this.fileDetail = evt[0];
    this.allowOnlyPDF();
    if (this.uploader.queue.length > 0) {
      evt.target = {};
      evt.target.files = [evt[0]];
      this.onFileChange(evt);
    }

    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  allowOnlyPDF() {

    this.fileName = this.fileDetail.name;
    const idxDot = this.fileName.lastIndexOf('.') + 1;
    const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();


    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
    }

  }


  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.processFile(target.files[0], evt, target);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  processFile(file, evt, target) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    this.fileFormatError = false;
    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.fileFormatError = true;
      this.fileName = fileName;
      return;
    } else {
      this.file = target.files[0];
      if (target.files[0] !== undefined) {
        const formData = new FormData();
        formData.append(fileName, file);
        //  object.fileNameInQueue = target.files[0].name;
        this.filesUploadedData.pop();
        this.filesUploadedData.push(target.files[0].name);

        (<HTMLInputElement>document.getElementById('file')).value = '';
        if (evt.srcElement) {
          evt.srcElement.value = '';
      }
    }
    }

  }


  downloadAuthorizationLetter() {

    let url = '';

    if (this.signatureSigned) {
      url = 'api/document/partner/download/docusign/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId +'&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';
    } else {
      url = 'api/document/partner/download/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId +'&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';
    }

    this.partnerDealCreationService.downloadUnsignedDoc(url).subscribe((response: any) => {

      if (response && !response.error) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  removeFile(file) {
    let index = this.filesUploadedData.indexOf(file);
    if (index > -1) {
      this.filesUploadedData.splice(index, 1);
    }
  }

  docusign() {

    let url = 'api/document/partner/sign/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId  + '&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';

    this.partnerDealCreationService.initiateDocusign(url).subscribe((response: any) => {

      if (response && !response.error) {
        this.signaturePending = true;
        this.initiateStep3 = false;
        this.isShowSendAgain = true;

      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });

  }

  import() {

    let url = 'api/document/partner/upload?type=partnerLoa&partnerLoa&u=' + this.appDataService.userId + '&partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId +'&dealId=' + this.qualService.qualification.dealId +  '&customerGuId=' + this.qualService.loaData.customerGuId + '&uploadType=partnerLoa&userName=' + this.appDataService.userId + '&noOfMonths=' + this.selectedMonths + '&signedDate=' + this.signedDateStr;

    this.partnerDealCreationService.uploadAdditionalDoc(this.file, url).subscribe((response: any) => {

      if (response && !response.error) {
        if (response.data) {
          this.appDataService.signatureValidDate = response.data.signatureValidDate;
        }
        this.signatureSigned = true;
        this.signaturePending = false;
        this.isShowContinue = true;
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });

  }

  continueDealLookup() {

    if (this.signaturePending) {
      this.qualService.loaData.loaSigned = false;
      this.qualService.loaData.document = {};
      this.qualService.loaData.document.status = ConstantsService.PENDING_STATUS;
    } else {
      this.qualService.loaData.loaSigned = true;
    }
    this.qualService.isShowDealLookUp = true;
    // emit after the api is loaded to show deal details and create qual
    this.qualService.partnerDealLookUpEmitter.emit();
  }

  downloadFile(file) {

  }

  skip() {

    const modalRef = this.modalVar.open(LoccConfirmationComponent, { windowClass: 'admin-modal' });

    modalRef.result.then((result) => {
      if (result.continue) {
        this.qualService.isShowDealLookUp = true;
        // emit after the api is loaded to show deal details and create qual
        this.qualService.partnerDealLookUpEmitter.emit();
      }
    }).catch(error => { });

  }


  sendAgain() {
    const modalRef = this.modalVar.open(InitiateDocusignWarningComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.isLOA = true;

    modalRef.result.then((result) => {
      if (result.continue) {
        this.initiateStep1 = true;
        this.initiateStep2 = false;
        this.initiateStep3 = false;
        this.signaturePending = false;
        this.signatureSigned = false;
        this.isShowSendAgain = false;
      }
    });
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
