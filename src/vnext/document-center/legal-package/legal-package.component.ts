import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EditCustomerRepresentativeComponent } from 'vnext/modals/edit-customer-representative/edit-customer-representative.component';
import { EditPreferredLegalComponent } from 'vnext/modals/edit-preferred-legal/edit-preferred-legal.component';
import { ICustomerReps, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { FileUploader } from 'ng2-file-upload';
import { UploadDocumentComponent } from 'vnext/modals/upload-document/upload-document.component';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-legal-package',
  templateUrl: './legal-package.component.html',
  styleUrls: ['./legal-package.component.scss']
})
export class LegalPackageComponent implements OnInit, OnDestroy {
  @Input() editLegalPackage = true;
  step = 1;
  displayLanguages = false;
  supportedLanguages = []
  selectedLanguage : any = {}
  eSignInitiated = false;
  eDocSigned = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  filesUploadedData = [];
  fileFormatError = false;
  hasBaseDropZoneOver = false;
  fileDetail: any = {};
  fileName = '';
  file: any;
  loaFilesUploadedData = [];
  loaFileFormatError = false;
  loaFileDetail: any = {};
  loaFile: any;
  loaFileName = '';
  programTermsSignedDate: ''; //  for EA Program Terms signed date
  isContainsLOA = 'no';
  isContainsLOAAnswered = false;
  programTermUpload = []; // to store uploaded/intitated/signde programterm data
  loaFileUploaded = []; // to store uploaded loa data
  programTermEsignData: any = {}; // to store if programterm esign initiated/signed
  customerRepData: Array<ICustomerReps> = [];
  eSignRejected = false;
  invalidCustomerRepData = false; // set if any of the mandatory customer rep fields are not added/missing
  constructor(public proposalStoreService: ProposalStoreService, private modalVar: NgbModal, private eaRestService: EaRestService, 
    private vnextService: VnextService,private utilitiesService: UtilitiesService, public vnextStoreService: VnextStoreService, public localizationService: LocalizationService,
    public eaStoreService: EaStoreService, public eaService: EaService, public constantsService:ConstantsService, public dataIdConstantsService: DataIdConstantsService) { }

  selectedConsent = 'intitateSig';
  page = 'customerRep';
  signerName:string;
  signerEmail:string;
  ngOnInit(): void {
    this.checkProposalDocs(); // to get documents intitated or uplaoded
    this.getLOAData(); // to get loa documents uplaoded
    this.setCustomerRepData(); // to set customer rep data to show on UI
    this.supportedLanguages = [{displayName: 'English', localeCode: 'en'}, {displayName: 'Canadian - French', localeCode: 'fr_CA'}];
    this.setSupportedLanguageForDoc()
  }


  selectCustomerConsent(event) {
    if (event.target.id === 'locc1') {
      this.selectedConsent = 'intitateSig';
    } else if (event.target.id === 'locc2') {
      this.selectedConsent = 'uploadDoc';
    }
  }

  editCustomerRep(type, customerRepDetails?: ICustomerReps) {
    const modalRef = this.modalVar.open(EditCustomerRepresentativeComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if(result){
        this.validateCustomerRepData();
      }
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.page = this.page;
    if (customerRepDetails) {
      // send slected customer rep details
      modalRef.componentInstance.customerRepDetails = customerRepDetails;
    }
  }

  editPreferredLegal() {
    const modalRef = this.modalVar.open(EditPreferredLegalComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
    });
    modalRef.componentInstance.page = this.page;
    if (this.proposalStoreService.proposalData.customer && this.proposalStoreService.proposalData.customer.preferredLegalAddress) {
      modalRef.componentInstance.preferredLegal = this.proposalStoreService.proposalData.customer.preferredLegalAddress;
    }
  }
  
  deleteCustomerRep(customerId){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/customer-reps/' + customerId;
    this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)){
        // set customerdata from api
        this.proposalStoreService.proposalData.customer.customerReps.splice(1,1);
        this.validateCustomerRepData();
      }
    });
  }

  moveToNextStep(){
    this.step++
  }
  
  moveToPreviousStep(){
    this.step--
  }

  downloadDoc() {
    if (this.eDocSigned){
      this.downloadSignedDoc();
    } else {
      this.downloadUnsignedDocument();
    }
  }

  downloadUnsignedDocument(){
    const url = this.vnextService.getAppDomainWithContext + 'document/download/programTerm?p=' + this.proposalStoreService.proposalData.objId + this.sendLangcodeInUrl();
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  // download Signed Doc
  downloadSignedDoc(){
    const url = this.vnextService.getAppDomainWithContext + 'document/download/docusign/programTerm?p=' + this.proposalStoreService.proposalData.objId + this.sendLangcodeInUrl();
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      }
    });
  }

  downloadLoaDoc(file){
    const url =  this.vnextService.getAppDomainWithContext + 'document/partner/download?p='+ this.proposalStoreService.proposalData.objId +'&documentId=' + file.documentId;
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  initiateESignature(){
    const url = this.vnextService.getAppDomainWithContext + 'document/sign/programTerm?p=' + this.proposalStoreService.proposalData.objId + '&f=1&fcg=1' + this.sendLangcodeInUrl();
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)){
        this.eSignInitiated = true;
        this.checkProposalDocs();
      }
    });
  }

  restart(){
    this.step = 1;
    this.eSignInitiated = false;
    if(this.eaService.features.IRONCLAD_C2A){
      this.eSignRejected = false;
      this.eSignInitiated = false;
      this.proposalStoreService.inflightDocusign = false
    }
  }

  showAddCustomerRep(){
    if (this.proposalStoreService.proposalData.customer && (!this.proposalStoreService.proposalData.customer.customerReps || (this.proposalStoreService.proposalData.customer.customerReps && this.proposalStoreService.proposalData.customer.customerReps.length < 2))){
      return true;
    }
    return false;
  }

  checkProposalDocs(){
    const url = this.vnextService.getAppDomainWithContext + 'document/proposal-documents-data?p=' + this.proposalStoreService.proposalData.objId;//add type as param
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      // check for arleady signed/ intitated legal package 
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.documents && response.data.documents.length){
          for (const document of response.data.documents){
            if (document.type === 'PROGRAM_TERMS'){
              this.setProgramTermsDoc(document)
            }
          }
        }
      }
      
    })
  }

  setProgramTermsDoc(document){
    this.eSignRejected = false;
    this.programTermEsignData.status = document.status;
    this.signerName = '';
    this.signerEmail = '';
    if (document.manualLegalPackageSignedDate) { // check and set manualLegalPackageSignedDate
      this.programTermEsignData.manualLegalPackageSignedDate = document.manualLegalPackageSignedDate;
    }
    // check and set signedAt for e-signature
    if(((document.status === 'completed' && document.statusUpdatedAt) || (this.eaService.features.IRONCLAD_C2A && document.status === 'Accepted'))){
      this.step = 2;
      this.eSignInitiated = true;
      this.eDocSigned = true;
      this.programTermsSignedDate = document.statusUpdatedAt;
      // to set e-signed doc signerName and signerEmail
      if(document?.signers && document?.signers.length){
        this.signerName = document?.signers[0]?.name ? document?.signers[0].name : '';
        this.signerEmail = document?.signers[0]?.email ? document?.signers[0].email : '';
        if(this.signerName && this.signerEmail){
          this.customerRepData = [{id: 0, name: this.signerName, email: this.signerEmail}];
        }
      }
    }else if(this.eaService.features.IRONCLAD_C2A && document.status === 'Rejected'){
      this.step = 2;
      this.eSignInitiated = true;
      this.eDocSigned = false;
      this.eSignRejected = true;
    } else {
      if ((document.status === 'sent' || (document.status === 'delivered' && this.eaService.features.IRONCLAD_C2A)) || (document.status === 'Sign' && this.eaService.features.IRONCLAD_C2A)){
        this.step = 2;
        this.eSignInitiated = true;
      }
      this.eDocSigned = false;
      this.programTermsSignedDate = document.createdAt;
      this.proposalStoreService.inflightDocusign = document.inflightDocusign
    }
    if (document.uploads) {
      if (document.uploads['SIGNED_CUSTOMER_PACKAGE']) {
        document.uploads['SIGNED_CUSTOMER_PACKAGE'].forEach(eachSCP => {
          if (!eachSCP.deleted) {
            this.step = 2;
            this.eSignInitiated = true;
            this.eDocSigned = true;
            this.programTermUpload.push({
              'badgeInfo': 'Program Term',
              'fileLabel': eachSCP.name,
              'signedStatus': eachSCP.documentSigned,
              'uploadedBy': eachSCP.createdByName,
              'createdOn': eachSCP.createdAtStr,
              'documentId': eachSCP.documentId
            });
          }
        });
      }
    }
  }

  // method to remove all the uplaoded docs when switched radio button selections
  removeUploadedDocs(filesUploadedData) {
    if (filesUploadedData && filesUploadedData.length > 0) {
      filesUploadedData = [];
    }
  }

  removeDocsUploaded(loa) {
    if (loa){
      this.removeUploadedDocs(this.loaFilesUploadedData);
    } else {
      this.removeUploadedDocs(this.filesUploadedData);
    }
  }


  checkUploadeDocFormat(evt: any, loa){
    if (loa){
      this.loaFileDetail = evt[0];
      this.allowOnlyPDF(this.loaFile, this.loaFileDetail);
    } else {
      this.fileDetail = evt[0];
      this.allowOnlyPDF(this.fileName, this.fileDetail);
    }
  }

  allowOnlyPDF(fileName, fileDetail) {

    fileName = fileDetail.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();


    if (['pdf'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
    }

  }

  processFile(file, evt, target, loa) {
    if (loa){
      const fileName = file.name;
      const idxDot = fileName.lastIndexOf('.') + 1;
      const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
      this.fileFormatError = false;
      if (['pdf'].indexOf(extFile) === -1) {
        this.uploader.queue.length = 0;
        this.fileFormatError = true;
        this.loaFileName = fileName;
        return;
      } else {
        this.loaFile = target.files[0];
        if (target.files[0] !== undefined) {
          const formData = new FormData();
          formData.append(fileName, file);
          //  object.fileNameInQueue = target.files[0].name;
          this.loaFilesUploadedData.pop();
          this.loaFilesUploadedData.push(target.files[0].name);
          
          if ( (document.getElementById('loaFile'))){
            (<HTMLInputElement>document.getElementById('loaFile')).value = '';
          }
          if (evt.srcElement) {
            evt.srcElement.value = '';
          }
        }
      }
    } else {
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
  
          if(document.getElementById('file')){
            (<HTMLInputElement>document.getElementById('file')).value = '';
          }
          if (evt.srcElement) {
            evt.srcElement.value = '';
          }
        }
      }
    }
  }

  removeFile(file, filesUploadedData) {
    let index = filesUploadedData.indexOf(file);
    if (index > -1) {
      filesUploadedData.splice(index, 1);
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any, loa) {
    this.checkUploadeDocFormat(evt, loa);
    if (this.uploader.queue.length > 0) {
      evt.target = {};
      evt.target.files = [evt[0]];
      this.onFileChange(evt, loa);
    }

    if (loa && (<HTMLInputElement>document.getElementById('loaFile')).value){
      (<HTMLInputElement>document.getElementById('loaFile')).value = '';
    } else if (!loa && (<HTMLInputElement>document.getElementById('file')).value) {
      (<HTMLInputElement>document.getElementById('file')).value = '';
    }
  }

  onFileChange(evt: any, loa) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.processFile(target.files[0], evt, target, loa);
    if (loa && (<HTMLInputElement>document.getElementById('loaFile')).value){
      (<HTMLInputElement>document.getElementById('loaFile')).value = '';
    } else if (!loa && (<HTMLInputElement>document.getElementById('file')).value) {
      (<HTMLInputElement>document.getElementById('file')).value = '';
    }
  }

  setRadioValue($event) {
    this.isContainsLOA = $event.target.value;
    if (this.loaFilesUploadedData.length && this.isContainsLOA === 'no'){
      this.removeFile(this.loaFilesUploadedData[0], this.loaFilesUploadedData);
    }
  }

  getLOAData() {
    const url = this.vnextService.getAppDomainWithContext + 'document/proposal-loa-documents?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      // check and set documents uploaded
      if (this.vnextService.isValidResponseWithData(response)){ 
        response.data.loaDocuments?.forEach(element => {
          if (!element.deleted && !element.electronicallySigned) {
            this.isContainsLOA= 'yes';
            this.loaFileUploaded.push({
              'badgeInfo': this.localizationService.getLocalizedString('common.LETTER_OF_AGREEMENT'),
              'fileLabel': element.name,
              'signedStatus': element.documentSigned,
              'uploadedBy': element.createdByName,
              'createdOn': element.createdAtStr,
              'documentId': element.documentId
            });
          }
        });
      }
    });
  }


  uploadDocs() {
    let isLoaPresent = false;
    let isProgramTermPresent = false;
    if (this.filesUploadedData.length && !this.programTermUpload.length){
      isProgramTermPresent = true;
    }
    if (this.loaFilesUploadedData.length && !this.loaFileUploaded.length){
      isLoaPresent = true;
    }
    // logic to add and 
    const modalRef = this.modalVar.open(UploadDocumentComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.componentInstance.docData = {'isProgramtermsPresent': isProgramTermPresent, 'isLoaPresent': isLoaPresent, 'isPrgrmTermLoaPresent': (isProgramTermPresent && isLoaPresent) ? true: false };
    modalRef.result.then((result) => {
      if (result.continue){
        if (isProgramTermPresent) {
          const formdata: FormData = new FormData();
          formdata.append('file', this.file);
          formdata.append('isSigned', 'true');
          formdata.append('proposalObjId', this.proposalStoreService.proposalData.objId);
          formdata.append('type', 'programTerm');
          formdata.append('uploadType', 'scp');
          formdata.append('userName', this.eaStoreService.userInfo.firstName + ' ' + this.eaStoreService.userInfo.lastName);
          formdata.append('loaIncluded', this.isContainsLOA === 'yes' ? 'true' : 'false');
          formdata.append('uploadLegalPackage', this.isContainsLOA === 'yes' ? 'false' : 'true');
          formdata.append('manualLoaSignedDateStr', result.signedDateStr);
          const url = 'document/upload/additional'
          this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
            if (response && !response.error) {
              this.filesUploadedData = [];
              this.checkProposalDocs();
              // this.newDocumentData.manualLoaSignedDate = result.loaSignedDate; // set manualLoaSignedDate
              isProgramTermPresent = false; // reset after uploaded
            } else {
              // this.messageService.displayMessagesFromResponse(response);
            }
          })
        }
        if (isLoaPresent) {
          const formdata: FormData = new FormData();
          formdata.append('file', this.loaFile);
          formdata.append('isSigned', 'true');
          formdata.append('proposalObjId', this.proposalStoreService.proposalData.objId);
          formdata.append('type', 'customerPackage');
          formdata.append('uploadType', 'loa');
          formdata.append('userName', this.eaStoreService.userInfo.firstName + ' ' + this.eaStoreService.userInfo.lastName);
          formdata.append('manualLoaSignedDateStr', result.loaSignedDateStr);
          const url = 'document/upload/loa'
          this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
            if (response && !response.error) {
              this.loaFilesUploadedData = [];
              response.data.loaDocuments.forEach(element => {
                if (!element.deleted && !element.electronicallySigned) {
                  this.loaFileUploaded.push({
                    'badgeInfo': this.localizationService.getLocalizedString('common.LETTER_OF_AGREEMENT'),
                    'fileLabel': element.name,
                    'signedStatus': element.documentSigned,
                    'uploadedBy': element.createdByName,
                    'createdOn': element.createdAtStr,
                    'documentId': element.documentId
                  });
                }
              });
              // this.newDocumentData.manualLoaSignedDate = result.loaSignedDate; // set manualLoaSignedDate
              isLoaPresent = false; // reset after uploaded
            } else {
              // this.messageService.displayMessagesFromResponse(response);
            }
          })
        }
      }
    });
  }

  removeFiles(file, loa?){
    if (loa){
      const url = this.vnextService.getAppDomainWithContext + 'document/partner/delete?p='+ this.proposalStoreService.proposalData.objId+'&documentId=' + file.documentId;
      this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithoutData(response)){
          this.loaFileUploaded = [];
        }
      });
    } else {
      const url = this.vnextService.getAppDomainWithContext + 'document/additional/programTerm?u=' +
      this.eaStoreService.userInfo.userId + '&p=' + this.proposalStoreService.proposalData.objId + '&dt=scp&did=' + file.documentId
      this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithoutData(response)){
          this.programTermUpload = [];
          if(this.eaService.features.IRONCLAD_C2A){
            this.eDocSigned = false;
          }
        }
      });
    }
  }

  // method to set customer repdata from proposal data
  setCustomerRepData() {
    this.customerRepData = [];
    if (!this.proposalStoreService.proposalData.customer.customerReps){
      this.proposalStoreService.proposalData.customer.customerReps = [];
    }
    if (this.proposalStoreService.proposalData.customer.customerReps && this.proposalStoreService.proposalData.customer.customerReps.length){
      this.customerRepData = this.proposalStoreService.proposalData.customer.customerReps
    } else if(this.signerName && this.signerEmail){
      this.customerRepData.push({id: 0, name: this.signerName, email: this.signerEmail })
    } else {
      this.customerRepData.push({id: 0, name: this.eaStoreService.userInfo.firstName + ' ' + this.eaStoreService.userInfo.lastName, email: this.eaStoreService.userInfo.emailId })
    }
    this.validateCustomerRepData();
  }

  // check and set flag if any of the mandatory customer rep fields are not added/missing
  validateCustomerRepData(){
    this.invalidCustomerRepData = false;
    if(this.proposalStoreService.proposalData.customer.customerReps.length){
      for(let customer of this.proposalStoreService.proposalData.customer.customerReps){
        if((!customer.title || !customer.email || !customer.name )){
          this.invalidCustomerRepData = true;
          customer.mandatoryFieldsMissing = true;
        } else {
          customer.mandatoryFieldsMissing = false;
        }
      }
      if(!this.customerRepData?.length && this.proposalStoreService.proposalData.customer?.customerReps?.length && this.eaService.features?.IRONCLAD_C2A){
        this.customerRepData = this.proposalStoreService.proposalData.customer.customerReps
      }
    }
  }
  downloadBlankCopy(){
    const url = this.vnextService.getAppDomainWithContext + 'document/download/programTerm?p=' + this.proposalStoreService.proposalData.objId + '&bc=true'+ this.sendLangcodeInUrl();
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  updateLanguage(language){
    this.selectedLanguage = language;
    this.displayLanguages = false;
  }

    // to check and set language based on state from legaladdress
    setSupportedLanguageForDoc(){
      if(this.eaService.isSpnaFlow && !this.eaService.features.SPNA_FRENCH_DOCUMENT_REL){
        this.selectedLanguage = this.supportedLanguages[0];
        this.supportedLanguages.pop();
      }
       else if(this.proposalStoreService.proposalData.customer?.preferredLegalAddress){
        if(this.eaService.validateStateForLanguage(this.proposalStoreService.proposalData.customer.preferredLegalAddress.state)){
          this.selectedLanguage = this.supportedLanguages[1];
        } else {
          this.selectedLanguage = this.supportedLanguages[0];
        }
      } else {
        this.selectedLanguage = this.supportedLanguages[0];
      }
    }

    hideLanguages(){
      this.displayLanguages = false;
    }

    sendLangcodeInUrl(){
      let code = '';
      if(this.selectedLanguage['localeCode'] === this.constantsService.FR_LANG_CODE){
        code = '&localeCode=fr_CA'
      } 
      return code;
    }
    ngOnDestroy() {
      //this.proposalStoreService.inflightDocusign = false
    }
}
