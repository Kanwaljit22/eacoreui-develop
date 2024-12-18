import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { FileUploader } from 'ng2-file-upload';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DeferLoccComponent } from 'vnext/modals/defer-locc/defer-locc.component';
import { DocusignInitiationWarningComponent } from 'vnext/modals/docusign-initiation-warning/docusign-initiation-warning.component';
import { EditCustomerRepresentativeComponent } from 'vnext/modals/edit-customer-representative/edit-customer-representative.component';
import { EditPreferredLegalComponent } from 'vnext/modals/edit-preferred-legal/edit-preferred-legal.component';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';
const MONTH = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

@Component({
  selector: 'app-locc',
  templateUrl: './locc.component.html',
  styleUrls: ['./locc.component.scss'],
  providers: [MessageService]
})
export class LoccComponent implements OnInit {
  selectedConsent = this.localizationService.getLocalizedString('common.locc.INTITIATE_SIG');
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  file: any;
  showValidDrop = false;
  valid = this.localizationService.getLocalizedString('common.SELECT');
  validArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  customerReadyStep: boolean;
  customerRepInfoStep: boolean;
  reviewLoccStep: boolean;
  filesUploadedData = [];
  disableContinue = false;
  fileFormatError = false;
  hasBaseDropZoneOver = false;
  fileDetail: any = {};
  fileName = '';
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  signaturePending = false;
  signatureSigned = false;
  isShowContinue = false;
  isShowSendAgain = false;
  todaysDate: Date;
  signedDate: Date;
  minDate: Date; // to set minimum date of todaysDate - 5 years
  isSelectedValidMonths = false;
  signedDateStr = '';
  isGreenfiled = false;
  isBrownField = false;
  isLoccCustomerContactPresent = false; // set if loccCustomerContactPresent
  supportedLanguages = [{displayName: 'English', localeCode: 'en_US'}, {displayName: 'Canadian - French', localeCode: 'fr_CA'}]; // to store supported Languages for locc document
  selectedDocLanguage = {}; // to store selected language from drodown
  displayLanguages = false; // to show dropdown when selected
  isPartnerLoggedIn = false;

  constructor(public projectService: ProjectService, private modalVar: NgbModal, public projectStoreService: ProjectStoreService, public utiliteService: UtilitiesService, public messageService: MessageService, private vnextService: VnextService, public dataIdConstantsService: DataIdConstantsService,
     public proposalStoreService: ProposalStoreService, public elementIdConstantsService: ElementIdConstantsService, public vnextStoreService: VnextStoreService, private eaRestService: EaRestService, public localizationService: LocalizationService, private eaService: EaService, private constantsService: ConstantsService) { }

  ngOnInit() {
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    }
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);
    this.signedDate = this.todaysDate;
    this.minDate = new Date(this.minDate.setFullYear(this.minDate.getFullYear() - 5));
    this.customerReadyStep = true;
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === LocalizationEnum.common || key === LocalizationEnum.all ){
        this.selectedConsent = this.localizationService.getLocalizedString('common.locc.INTITIATE_SIG');
      }
    });
    // to check and set language based on state from legaladdress
    this.setSupportedLanguageForDoc();
  }

  // to check and set language based on state from legaladdress
  setSupportedLanguageForDoc() {
    if (this.eaService.isSpnaFlow && !this.eaService.features.SPNA_FRENCH_DOCUMENT_REL) {
      this.selectedDocLanguage = this.supportedLanguages[0];
      this.supportedLanguages.pop();
    }
    else if (this.vnextStoreService.loccDetail?.customerContact?.preferredLegalAddress?.state) {
      if (this.eaService.validateStateForLanguage(this.vnextStoreService.loccDetail.customerContact.preferredLegalAddress.state)) {
        this.selectedDocLanguage = this.supportedLanguages[1];
      } else {
        this.selectedDocLanguage = this.supportedLanguages[0];
      }
    } else {
      this.selectedDocLanguage = this.supportedLanguages[0];
    }
  }

  // to select language from dropdown
  selectLanguage(lang){
    this.selectedDocLanguage = lang;
    this.displayLanguages = false;
  }

  // check and addlanguage code to locc download and initiate locc
  sendLangcodeInUrl(){
    let code = '';
    if(this.selectedDocLanguage['localeCode'] === this.constantsService.FR_LANG_CODE){
      code = '&localeCode=fr_CA'
    } 
    return code;
  }

  editInfo() {
    const modalRef = this.modalVar.open(EditCustomerRepresentativeComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if(result){
        this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
      }
    });
  }

  chooseCusConsent(event) {
    if (event.target.id === this.localizationService.getLocalizedString('common.locc.LOCC1')) {
      this.selectedConsent = this.localizationService.getLocalizedString('common.locc.INTITIATE_SIG');
      if (!(this.customerRepInfoStep || this.reviewLoccStep || this.isShowSendAgain)) {
        this.customerReadyStep = true;
      }
      this.removeUploadedDocs(); // to remove all the uploaded docs
    } else if (event.target.id === this.localizationService.getLocalizedString('common.locc.LOCC2')) {
      this.selectedConsent = this.localizationService.getLocalizedString('common.locc.UPLOAD_LOCC');
    } else {
      this.selectedConsent =  this.localizationService.getLocalizedString('common.locc.DEFER_LOCC_ID');
      this.removeUploadedDocs(); // to remove all the uploaded docs
      const modalRef = this.modalVar.open(DeferLoccComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
      modalRef.result.then((result) => {
        if (result.continue) {
          const req = {
            "data": true
        }
        const url = 'project/' + this.projectStoreService.projectData.objId + '/defer-locc';
          this.eaRestService.putApiCall(url, req).subscribe((response: any) => {
            this.messageService.clear();
            if (this.vnextService.isValidResponseWithoutData(response, true)) {
              this.projectService.showLocc = false;
              this.projectStoreService.nextBestActionsStatusObj.isLoccDone = true;
              this.projectService.updateNextBestOptionsSubject.next({key: 'isLoccDone', value: true});
              this.continueToProject();
            } else {
              this.messageService.displayMessagesFromResponse(response);
            }
          });
        }
        this.resetLocc(); // show e-sign selection
      });
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

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.processFile(target.files[0], evt, target);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  editPreferred() {
    const modalRef = this.modalVar.open(EditPreferredLegalComponent, { windowClass: 'md' });
    modalRef.result.then((result) => {
    });
  }

  selectValid(val) {
    this.valid = val;
    this.showValidDrop = false;
    this.isSelectedValidMonths = true;
  }

  // method to remove all the uplaoded docs when switched radio button selections
  removeUploadedDocs() {
    if (this.filesUploadedData && this.filesUploadedData.length > 0) {
      this.filesUploadedData = [];
    }
  }

  // method to continue to next step 
  continue() {
    if (this.customerReadyStep) {
      this.customerRepInfoStep = true;
      this.customerReadyStep = false;
    } else if (this.customerRepInfoStep) {
      this.reviewLoccStep = true;
      this.customerRepInfoStep = false;
    }
  }

  // check and set if customer is ready to start e-signature process
  isCustomerReady(event) {
    if (event.target.value === 'yes') {
      this.disableContinue = false;
    } else {
      this.disableContinue = true;
    }
  }

  back() {
    if (this.customerRepInfoStep) {
      this.customerRepInfoStep = false;
      this.customerReadyStep = true;
    } else if (this.reviewLoccStep) {
      this.reviewLoccStep = false;
      this.customerRepInfoStep = true;
    }
  }

  // method to download signed/unsigned locc
  downloadLoccFile() {
    let url = '';

      let partnerBeGeoId;
      if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
        partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
      } else{
        partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
      }
      if (this.vnextStoreService.loccDetail.loccSigned) {
        url = 'locc/download/signed/partnerLoa?partnerBeGeoId=' + partnerBeGeoId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&customerGuId=' + this.projectStoreService.projectData.customerInfo?.customerGuId + '&f=0&fcg=0';
      } else {
        let code = '';
        if (!this.vnextStoreService.loccDetail.loccInitiated) {
          code = '&localeCode=' + this.selectedDocLanguage['localeCode'];
        }
        url = 'locc/download/unsigned/partnerLoa?partnerBeGeoId=' + partnerBeGeoId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&customerGuId=' + this.projectStoreService.projectData.customerInfo?.customerGuId + '&f=0&fcg=0' + code;
      }
    
    const buyingProgram = (this.proposalStoreService.proposalData?.buyingProgram) ? this.proposalStoreService.proposalData.buyingProgram : this.projectStoreService.projectData?.buyingProgram;
    if(buyingProgram){
      url = url + '&buyingProgram=' + buyingProgram
    }

    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.utiliteService.saveFile(response, this.downloadZipLink);
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // method to initiate locc docusign
  initiate() {
    let url = ''
      let partnerBeGeoId;
      if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
        partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
      } else{
        partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
      } 
      url = 'locc/sign/partnerLoa?partnerBeGeoId=' + partnerBeGeoId + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&f=0&fcg=0' + this.sendLangcodeInUrl();
    
    const buyingProgram = (this.proposalStoreService.proposalData?.buyingProgram) ? this.proposalStoreService.proposalData.buyingProgram : this.projectStoreService.projectData?.buyingProgram;
    if(buyingProgram){
      url = url + '&buyingProgram=' + buyingProgram
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.vnextStoreService.toastMsgObject.loccSuccess = true;
        this.vnextStoreService.loccDetail.loccInitiated = true;
        this.projectStoreService.nextBestActionsStatusObj.isLoccDone = true;
        this.projectService.updateNextBestOptionsSubject.next({key: 'isLoccDone', value: true});
        this.projectService.showLocc = false;
        // if proposal flow emit to close modal
        if (this.proposalStoreService.proposalData.objId){
          this.projectService.closeLoccModalSubject.next(true);
        }
        this.projectService.closeLoccModalSubject.next(true);
        this.projectStoreService.isShowProject = true;
        this.signaturePending = true;
        this.reviewLoccStep = false;
        this.isShowSendAgain = true;
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject();
        }, 5000);
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // method to send again
  sendAgain() {
    // open a modal for confirmation and initiate docusign for Locc
    const modalRef = this.modalVar.open(DocusignInitiationWarningComponent, { windowClass: 'md' });
    modalRef.result.then((result) => {
      if (result.continue){
        this.resetLocc();// show e-sign selection
      }
    });
  }


  // to import locc with signedDate and selected months till document is valid
  importLocc() {
    let url = ''
      let partnerBeGeoId;
      if (this.proposalStoreService.proposalData?.objId && !this.proposalStoreService.proposalData.dealInfo?.partnerDeal){
        partnerBeGeoId = this.proposalStoreService.proposalData.partnerInfo?.beGeoId;
      } else{
        partnerBeGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
      } 
       url = 'locc/upload?type=partnerLoa&partnerLoa&u=' + 'mariar' + '&partnerBeGeoId=' + partnerBeGeoId + '&dealId=' + this.projectStoreService.projectData.dealInfo.id + '&customerGuId=' + this.projectStoreService.projectData.customerInfo.customerGuId + '&uploadType=partnerLoa&userName=' + 'mariar' + '&noOfMonths=' + this.valid + '&signedDate=' + this.signedDateStr;
    
    const buyingProgram = (this.proposalStoreService.proposalData?.buyingProgram) ? this.proposalStoreService.proposalData.buyingProgram : this.projectStoreService.projectData?.buyingProgram;
    if(buyingProgram){
      url = url + '&buyingProgram=' + buyingProgram
    }
    const formdata: FormData = new FormData();
    formdata.append('file', this.file);
    this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)){
        if (response.data) {
          this.vnextStoreService.loccDetail.loccExpiredDate = response.data.expiredDateInString;
        }
        this.projectService.showLocc = false;
        // if proposal flow emit to close modal
        if (this.proposalStoreService.proposalData.objId){
          this.projectService.closeLoccModalSubject.next(true);
        }
        this.vnextStoreService.toastMsgObject.loccSuccess = true;
        this.vnextStoreService.loccDetail.loccSigned = true;
        this.projectStoreService.isShowProject = true;
        this.signatureSigned = true;
        this.signaturePending = false;
        this.isShowContinue = true;
        this.projectStoreService.nextBestActionsStatusObj.isLoccDone = true;
        this.projectService.updateNextBestOptionsSubject.next({key: 'isLoccDone', value: true});
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject();
        }, 5000);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }


  // method to select date from date picker in calendar
  onDateSelection($event) {
    if ($event && $event !== null) {
      this.signedDate = $event;
      let x = this.signedDate;
      let a = (x.toString().substring(4, 7));
      let date_ea: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      this.signedDateStr = date_ea;
    }
  }

  allowOnlyPDF() {

    this.fileName = this.fileDetail.name;
    const idxDot = this.fileName.lastIndexOf('.') + 1;
    const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();


    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
    }

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

  removeFile(file) {
    let index = this.filesUploadedData.indexOf(file);
    if (index > -1) {
      this.filesUploadedData.splice(index, 1);
      this.projectStoreService.nextBestActionsStatusObj.isLoccDone = false;
      this.projectService.updateNextBestOptionsSubject.next({key: 'isLoccDone', value: false});
    }
  }

  continueToProject() {
    // to show project on UI 
    this.projectStoreService.isShowProject = true;
    this.projectService.showLocc = false;
    // if proposal flow emit to close modal
    if (this.proposalStoreService.proposalData.objId){
      this.projectService.closeLoccModalSubject.next(true);
    }
  }

  // method to reset all local variables and to show initiate e-sign radio button selected
  resetLocc() {
    this.selectedConsent = this.localizationService.getLocalizedString('common.locc.INTITIATE_SIG');
    this.customerReadyStep = true;
    this.customerRepInfoStep = false;
    this.reviewLoccStep = false;
    this.signaturePending = false;
    this.signatureSigned = false;
    this.isShowSendAgain = false;
    this.vnextStoreService.loccDetail.loccInitiated = false;
  }

}