import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EditCustomerRepresentativeComponent } from 'vnext/modals/edit-customer-representative/edit-customer-representative.component';
import { EditPreferredLegalComponent } from 'vnext/modals/edit-preferred-legal/edit-preferred-legal.component';
import { ICustomerReps, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { FileUploader } from 'ng2-file-upload';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { UploadDocumentComponent } from 'vnext/modals/upload-document/upload-document.component';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
const URL = 'https:// evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-multi-partner-concent',
  templateUrl: './multi-partner-concent.component.html',
  styleUrls: ['./multi-partner-concent.component.scss']
})
export class MultiPartnerConcentComponent implements OnInit {
  @Input() editLegalPackage = true;
  step = 1;
  eSignInitiated = false;
  eDocSigned = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['pdf'] });
  filesUploadedData = [];
  fileFormatError = false;
  hasBaseDropZoneOver = false;
  fileDetail: any = {};
  fileName = '';
  displayLanguages = false;
  selectedLanguage : any = {}
  file: any;
  loaFilesUploadedData = [];
  loaFileFormatError = false;
  loaFileDetail: any = {};
  loaFile: any;
  loaFileName = '';
  programTermsSignedDate: ''; //  for EA Program Terms signed date
  isContainsLOA = 'no';
  isContainsLOAAnswered = false;
  customerConsentUploaded:any = {}; // to store uploaded/intitated/signde cust consent data
  loaFileUploaded = []; // to store uploaded loa data
  programTermEsignData: any = {}; // to store if programterm esign initiated/signed
  isCustConsentUploaded = false;
  customerRepData: Array<ICustomerReps> = [];
  displaySuccessMsg = false;
  multiPartnerCustRep: Array<ICustomerReps> = [];
  supportedLanguages = [{displayName: 'English', localeCode: 'en'}, {displayName: 'Canadian - French', localeCode: 'fr_CA'}];
  invalidCustomerRepData = false; // set if any of the mandatory customer rep fields are not added/missing
  constructor(public proposalStoreService: ProposalStoreService, private modalVar: NgbModal, private eaRestService: EaRestService, public elementIdConstantsService: ElementIdConstantsService,
    private vnextService: VnextService,private utilitiesService: UtilitiesService, private vnextStoreService: VnextStoreService, public localizationService: LocalizationService,
    public eaStoreService: EaStoreService, public eaService: EaService, private constantsService: ConstantsService, public dataIdConstantsService: DataIdConstantsService) { }

  selectedConsent = 'intitateSig';
  page = 'customerRep';
  ngOnInit(): void {
      this.getCustomerRepData(); //to get cust. rep data for multi partner customer consent
      this.checkProposalDocs(); // to get documents intitated or uplaoded
      this.setSupportedLanguageForDoc()
  }

  selectCustomerConsent(event) {
    if (event.target.id === 'locc1') {
      this.selectedConsent = 'intitateSig';
    } else if (event.target.id === 'locc2') {
      this.selectedConsent = 'uploadDoc';
    }
    this.displaySuccessMsg = false;
  }

  editCustomerRep(type, customerRepDetails?: ICustomerReps) {
    const modalRef = this.modalVar.open(EditCustomerRepresentativeComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if(result.continue && result.reqJson){
       this.saveCustomerRepData(result.reqJson, customerRepDetails)
      }
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.page = 'multiPartner';
    if (customerRepDetails) {
      // send slected customer rep details
      modalRef.componentInstance.customerRepDetails = customerRepDetails;
    }
  }

  saveCustomerRepData(reqJson, customerRepDetails){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/customer-consent/customer-reps';
    if(!customerRepDetails){ 
      this.eaRestService.postApiCall(url,reqJson).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)){
          this.multiPartnerCustRep.push(response.data[0]);
          this.validateCustomerRepData();
        }
      });
    } else {
      reqJson.data[0]['id'] = customerRepDetails.id;
      this.eaRestService.putApiCall(url,reqJson).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)){
          for(let i = 0; i < this.multiPartnerCustRep?.length; i++) {
            if (response.data[0].id === this.multiPartnerCustRep[i].id){
              this.multiPartnerCustRep[i] = response.data[0];
              break;
            }
          }
          this.validateCustomerRepData();
        }
      });
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
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/customer-consent/customer-reps/' + customerId;
    this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)){
        // set customerdata from api
        this.multiPartnerCustRep.splice(1,1);
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
      this.signedCustomerConsent();
    } else {
      this.unsignedCustomerConsent();
    }
  }

  initiateESignature(){
    this.eSignInitiated = true;
    const url = this.vnextService.getAppDomainWithContext + 'document/sign/CUSTOMER_CONSENT?p=' + this.proposalStoreService.proposalData.objId + '&f=true&fcg=true' + this.sendLangcodeInUrl();
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
  }

  showAddCustomerRep(){
    if (!this.multiPartnerCustRep || (this.multiPartnerCustRep && this.multiPartnerCustRep.length < 2)){
      return true;
    }
    return false;
  }

  checkProposalDocs(){
    const url = this.vnextService.getAppDomainWithContext + 'document/proposal-documents-data?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      // check for arleady signed/ intitated legal package 
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.documents && response.data.documents.length){
          for (const document of response.data.documents){
         //   if (document.type === 'PROGRAM_TERMS'){
         if (document.type === 'CUSTOMER_CONSENT'){  
              this.setCustConsentDoc(document)
            }
          }
        }
      }
      
    })
  }

  setCustConsentDoc(document){
    this.programTermEsignData.status = document.status;

    if (document.manualLegalPackageSignedDate) { // check and set manualLegalPackageSignedDate
      this.programTermEsignData.manualLegalPackageSignedDate = document.manualLegalPackageSignedDate;
    }
    // check and set signedAt for e-signature
    if(document.status === 'completed' && document.statusUpdatedAt){
      this.step = 2;
      this.eSignInitiated = true;
      this.eDocSigned = true;
      this.programTermsSignedDate = document.statusUpdatedAt;
      this.customerConsentUploaded = {
        'fileLabel': document.name,
        'signedStatus': document.documentSigned,
        'uploadedBy': document.createdByName,
        'createdOn': document.createdAtStr,
        'expiryDateStr': document.expiryDateStr,
        'expired': document.expired
      };
      this.customerConsentUploaded.createdOn=document.manualSignedOnDateStr ? document.manualSignedOnDateStr : document.createdAtStr
    } else {
      if (document.status === 'sent'){
        this.step = 2;
        this.eSignInitiated = true;
      }
      this.customerConsentUploaded = {
        'fileLabel': document.name,
        'signedStatus': document.documentSigned,
        'uploadedBy': document.createdByName,
        'createdOn': document.createdAtStr,
        'expiryDateStr': document.expiryDateStr,
        'expired': document.expired
      };
      this.customerConsentUploaded.createdOn=document.manualSignedOnDateStr?document.manualSignedOnDateStr:document.createdAtStr
      this.eDocSigned = false;
      this.programTermsSignedDate = document.createdAt;
    }
    if (document.manuallySigned) {
      this.eSignInitiated = true;
      this.eDocSigned = true;
      this.customerConsentUploaded = {
      'fileLabel': document.name,
      'signedStatus': document.documentSigned,
      'uploadedBy': document.createdByName,
      'createdOn': document.createdAtStr,
      'documentId': document.documentId,
      'expiryDateStr': document.expiryDateStr,
      'expired': document.expired
      };
      this.customerConsentUploaded.createdOn=document.manualSignedOnDateStr ? document.manualSignedOnDateStr : document.createdAtStr
      this.isCustConsentUploaded = true;
     }
  }

  // method to remove all the uplaoded docs when switched radio button selections
  removeUploadedDocs() {
    this.filesUploadedData = [];
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
  
          (<HTMLInputElement>document.getElementById('loaFile')).value = '';
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
  
          (<HTMLInputElement>document.getElementById('file')).value = '';
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

  uploadDocs() {
    
    const modalRef = this.modalVar.open(UploadDocumentComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modalRef.componentInstance.docData = { 'multiPartnerTab': true };
    modalRef.result.then((result) => {
      if (result.continue) {
    //     this.filesUploadedData = [];
    // this.isCustConsentUploaded = true
    //  this.displaySuccessMsg = true;
        const formdata: FormData = new FormData();
        formdata.append('file', this.file);
        const url = 'document/upload?surrogateKey=' + this.proposalStoreService.proposalData.objId + '&type=CUSTOMER_CONSENT&category=PARTNER&processingType=STATIC&signedDate=' + result.signedDateStr;

        this.eaRestService.postApiCall(url, formdata).subscribe((response: any) => {
          if (response && !response.error) {
            this.filesUploadedData = [];
            this.checkProposalDocs();
            this.displaySuccessMsg = true;
          }
        })
      }
    })
  }
  
  // method to set customer repdata from proposal data
  setCustomerRepData() {
    this.customerRepData = [];
    if (this.multiPartnerCustRep && this.multiPartnerCustRep.length){
      this.customerRepData = this.multiPartnerCustRep
    } else {
      this.customerRepData.push({id: 0, name: this.eaStoreService.userInfo.firstName + ' ' + this.eaStoreService.userInfo.lastName, email: this.eaStoreService.userInfo.emailId })
    }
    this.validateCustomerRepData();
  }

  // check and set flag if any of the mandatory customer rep fields are not added/missing
  validateCustomerRepData(){
    this.invalidCustomerRepData = false;
    if(this.multiPartnerCustRep.length){
      for(let customer of this.multiPartnerCustRep){
        if((!customer.title || !customer.email || !customer.name || !customer.phoneNumber)){
          this.invalidCustomerRepData = true;
          customer.mandatoryFieldsMissing = true;
        } else {
          customer.mandatoryFieldsMissing = false;
        }
      }
    }
  }
  getCustomerRepData(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/customer-consent?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        if(response.data.customerReps){
          this.multiPartnerCustRep = response.data.customerReps;
        }
       this.setCustomerRepData(); // to set customer rep data to show on UI
      }
    });
  }

  unsignedCustomerConsent(){
    const url = this.vnextService.getAppDomainWithContext + 'document/download/CUSTOMER_CONSENT?p=' + this.proposalStoreService.proposalData.objId + this.sendLangcodeInUrl();
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  signedCustomerConsent(){
    const url = this.vnextService.getAppDomainWithContext + 'document/download/docusign/CUSTOMER_CONSENT?p=' + this.proposalStoreService.proposalData.objId + '&type=CUSTOMER_CONSENT' + this.sendLangcodeInUrl();
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }
  
  restartUpload(){
    this.isCustConsentUploaded = false;
    this.displaySuccessMsg = false;
  }
  hideLanguages(){
    this.displayLanguages = false;
  }
  updateLanguage(language){
    this.selectedLanguage = language;
    this.displayLanguages = false;
  }
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
 sendLangcodeInUrl(){
  let code = '';
  if(this.selectedLanguage['localeCode'] === this.constantsService.FR_LANG_CODE){
    code = '&localeCode=fr_CA'
  } 
  return code;
}
}
