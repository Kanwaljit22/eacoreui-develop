import { Component, OnInit, Renderer2 } from '@angular/core';
import { CpsService } from './cps.service';
import { QualificationsService } from '../../qualifications/qualifications.service';
import { MessageService } from '../services/message.service';
import { ProposalDataService } from '../../proposal/proposal.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '../services/app.data.service';
import { GuideMeService } from '@app/shared/guide-me/guide-me.service';
import { ConstantsService } from '../services/constants.service';
import { FileUploader } from 'ng2-file-upload';
import { CreditOverviewService } from '../credits-overview/credit-overview.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EngageSupportComponent } from '@app/modal/engage-support/engage-support.component';
import { CascadeDiscountConfirmationComponent } from '@app/modal/cascade-discount-confirmation/cascade-discount-confirmation.component';

  const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-cps',
  templateUrl: './cps.component.html',
  styleUrls: ['./cps.component.scss']
})
export class CpsComponent implements OnInit {
  subject = '';
  description = '';
  cpsData: any;
  successMessage = false;
  alreadyCreated = false;
  showQuote = false;
  buyMethod = '';
  justification = '';
  ccwQuoteId = '';
  additionalEmails = [];
  emailId: string;
  invalidEmail = false;
  disableAdd = false;
  invalidDoamin = false;
  showDetails = false;
  generalEnquiry = false;
  showAllContent = false
  fileDetail: any = {};
  fileName = '';
  caseList = [];
  hasBaseDropZoneOver = false;
  isEnableProceed = false;
  fileType = '';
  isCreateNew =  false;
  allCaseClosed = false;
  isDataLoaded = false;
  oldUCRMCase = false;
  fileTypeError  = false;
  fileSizeError = false;
  fileErrorMessage = '';
  isDefineSubPage = false;
  caseId = ''
  

  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['xlsx'] });

  constructor(public cpsService: CpsService, private qualService: QualificationsService, private messageService: MessageService,
    public guideMeService: GuideMeService, public proposalDataService: ProposalDataService, public localeService: LocaleService,
    public appDataService: AppDataService, private renderer: Renderer2, public constantsService: ConstantsService,
    private creditOverviewService : CreditOverviewService, private modalVar : NgbModal) { 

 
    }

  ngOnInit() {
    if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep){
      this.isDefineSubPage = true;
    }

  }

//Reset values
  resetValue() {

      this.showDetails = false;
      this.generalEnquiry = false;
      this.showAllContent = false
      this.isCreateNew =  false;
      this.allCaseClosed = false;
      this.showQuote = false;
      this.fileDetail = {};
      this.fileName = '';
      this.fileType = '';
      this.successMessage = false;
      this.alreadyCreated = false;

      this.fileTypeError  = false;
      this.fileSizeError = false;
      this.fileErrorMessage = '';
  }

  showContent(type) {

     this.isDataLoaded = false;
     this.resetValue();

     this.isCreateNew = false;

    // to know the type of case and show additional fields for quoting
    if (type === 'quote') {
      this.showQuote = true;
      this.generalEnquiry =  false;
      this.showAllContent =  true;
      this.showDetails = false;
    } else {
      this.showQuote = false;
      this.generalEnquiry =  true;
      this.showAllContent =  true;
    }
    // adding empty field for form
    this.buyMethod = '';
    this.justification = '';
    this.ccwQuoteId = '';
    this.description = '';
    this.additionalEmails = [];
    let id = this.qualService.qualification.qualID;
    let isProsalFlow = false;
    this.guideMeService.retainGuideMeOnPageChange = true;
    if (this.proposalDataService.proposalDataObject.proposalId !== null && !this.appDataService.enableQualFlag) {
      id = this.proposalDataService.proposalDataObject.proposalId;
      isProsalFlow = true;
    }
    this.cpsService.getCpsData(id, isProsalFlow, type).subscribe((res: any) => {
      if (res) {
        try {
          this.cpsService.showCPSContent = true;
          this.guideMeService.retainGuideMeOnPageChange = false;

          this.oldUCRMCase = false;
          if(this.proposalDataService.cxProposalFlow){
            this.engageSupport()
          }
          if (!res.pegaRequestId && !this.showQuote) {
            this.oldUCRMCase = true;
          }
          
          // If IB Assesment and case is closed 
          if (res.caseClosed && !this.showQuote) {
                this.oldUCRMCase = false;
          }


          if (!res.id || this.oldUCRMCase) {
            this.cpsData = res;
            this.subject = res.subject;
            this.alreadyCreated = false;
            this.showAllContent = true;
            this.isDataLoaded = true
                        
          } else {

            this.cpsData = res;
            this.subject = res.subject;

            this.showAllContent = false;
            if(type === 'quote')  {
              this.showDetails = false;
              this.alreadyCreated = true;
              this.successMessage = false;
              this.isDataLoaded = true

            }else {
              this.alreadyCreated = false;
              this.showDetails = true;
              this.successMessage = false;
              this.getAllCaseList();
            }
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  hideContent() {
    this.cpsService.showCPSContent = !this.cpsService.showCPSContent;
  }

  // adding input data in the text area for emails
  onChange(data: any) {
    this.disableAdd = false;
    //
    data = data.replace(/\s/g, '');
    this.additionalEmails = data.split(',');
    this.additionalEmails.forEach(element => {
      if (!this.disableAdd) {
        this.emailValidation(element);
      }
    });
  }

  // validating email id
  emailValidation(emailId) {
    this.invalidDoamin = false;
    if (!emailId) {
      this.invalidEmail = false;
      return;
    }
    if (this.appDataService.emailValidationRegx.test(emailId) === false) {
      this.invalidEmail = true;
      this.disableAdd = true;
    } else {
      this.invalidEmail = false;
      this.domainValidation(emailId);
    }
  }

  // for validating domain
  domainValidation(emailId) {
    const domain = emailId.substring(emailId.indexOf('@') + 1); // get the domain name from the emailId.
    if (domain !== this.constantsService.CISCO_DOMIN) {
      this.invalidDoamin = true;
      this.disableAdd = true;
    } else {
      this.invalidDoamin = false;
      this.disableAdd = false;
    }
  }

  
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any) {
    this.fileDetail = evt[0];
    this.getFiletype();
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

   onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.fileDetail = target.files[0];
    this.fileName = this.fileDetail.name;
    this.getFiletype();

    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  removeItem() {
    this.fileName = "";
    this.fileDetail= {};
    this.fileType = "";
  }

  getFiletype() {

    this.fileName = this.fileDetail.name;
    const idxDot = this.fileName.lastIndexOf('.') + 1;
    const extFile = this.fileName.substr(idxDot, this.fileName.length).toLowerCase();
    this.fileType = extFile.toLowerCase();

    this.validateFile(this.fileType )


  }

  //Check file type
  validateFile(fileType) {
    if (fileType.toLowerCase() == 'doc' || fileType.toLowerCase() == 'docx' || fileType.toLowerCase() == 'ppt' ||fileType.toLowerCase() == 'xlsx' ||fileType.toLowerCase() == 'xls' ||fileType.toLowerCase() == 'pdf'
    || fileType.toLowerCase() == 'png' || fileType.toLowerCase() == 'txt' || fileType.toLowerCase() == 'text' || fileType.toLowerCase() == 'jpg' || fileType.toLowerCase() == 'jpeg'

    ) {
          this.validateFileSize();
    }else {
        this.fileTypeError  = true;
        this.fileSizeError = false;
        this.fileErrorMessage = this.localeService.getLocalizedString('cps.FILE_TYPE_ERROR');
        this.removeItem();
    }

}

//Check file size

validateFileSize() {

  if (this.fileDetail.size > ConstantsService.FILE_SIZE_LIMIT) {
        this.fileSizeError = true;
        this.fileTypeError  = false;
        this.fileErrorMessage = this.localeService.getLocalizedString('cps.FILE_SIZE_ERROR');
        this.removeItem();

  }else {
        this.fileSizeError = false;
        this.fileTypeError  = false;
        this.fileErrorMessage = '';
  }

}

  submitQuoteCase() {

    // add only for Quote
    this.cpsData.fields['BUY_METHOD'] = this.buyMethod;
    this.cpsData.fields['NON_STANDARD_JUSTIFICATION'] = this.justification;
    this.cpsData.fields['CCW_QUOTE_ID'] = this.ccwQuoteId;
      // removing empty values from array using filter
    this.cpsData['additionalEmails'] = this.additionalEmails.filter(Boolean);
    
    this.cpsData['desc'] = this.description;
    this.guideMeService.retainGuideMeOnPageChange = true;
    this.cpsService.submitCase(this.cpsData).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.cpsService.showCPSContent = true;
          this.cpsData = res;
          this.subject = res.subject;
          this.successMessage = true;
          this.guideMeService.retainGuideMeOnPageChange = false;

          this.showAllContent = false
          this.showDetails = false;    

        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  submitPricingCase(data?) { 
    if(this.proposalDataService.cxProposalFlow && data){
      this.cpsData['desc'] = data.comment;
    } else {
      this.cpsData['desc'] = this.description;
    }
    
    this.guideMeService.retainGuideMeOnPageChange = true;

    //Set id null if we create new pega case for old ucrm flow 
    if (this.oldUCRMCase) {
       this.cpsData.id = null;
    }
    //Always send case status as closed  
    this.cpsData.caseClosed = false;
    this.cpsService.submitPricingCase(this.fileDetail,this.cpsData).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          if (this.proposalDataService.cxProposalFlow) {
            this.proposalDataService.caseCreatedForCxProposal = true;
            const modalRef = this.modalVar.open(CascadeDiscountConfirmationComponent, { windowClass: 'infoDealID cascadeDiscount' });
            modalRef.componentInstance.caseId = this.caseId;
          } else {
            this.showDetails = false
            this.showAllContent = false
            this.alreadyCreated = false;
            this.cpsService.showCPSContent = true;
            this.cpsData = res;
            this.subject = res.subject;
            this.successMessage = true;
            this.guideMeService.retainGuideMeOnPageChange = false;
          }
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  getAllCaseList() {

    this.guideMeService.retainGuideMeOnPageChange = true;

     this.cpsService.getCaseList(this.qualService.qualification.qualID).subscribe((res: any) => {

        this.isDataLoaded = true

      if (res && !res.error) {

        try {
          this.caseList =  res.data;
          this.checkIfAllCaseClosed(this.caseList);

          if (this.caseList.length === 0) {

              this.alreadyCreated = false;
              this.successMessage = true;
              this.showDetails = false;
              this.guideMeService.retainGuideMeOnPageChange = false;

          }

        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    })
  }

  checkIfAllCaseClosed(caseList){

    if (caseList) {

         var arrOpenCase = caseList.filter(h => h.caseClosed ===
            false);
         if (arrOpenCase.length > 0) {

             this.allCaseClosed = false;
             if(arrOpenCase[0].pegaCaseDetails){
              this.caseId =  arrOpenCase[0].pegaCaseDetails.CaseNumber;
             }
         }else {
             this.allCaseClosed = true;
      }   
    }
  }
  
  openCasePortal(url) {

    window.open(url, '_blank');
  }

  createNewCase() {

      this.showAllContent =  true;
      this.showDetails = false;
      this.isCreateNew = true;
  }

  cancelEngage() {
    this.cpsService.showCPSContent = false;

    if (this.isCreateNew) {

      this.showAllContent =  false;
      this.showDetails = true;

      //Reset field on cancel button
      this.description = '';
      this.fileDetail = {};
      this.fileName = '';
      this.fileType = '';

    }else {
      this.resetValue();
    }
    // console.log(this.additionalEmails.filter(Boolean))
  }

  focusDescription() {
    const element = this.renderer.selectRootElement('#description');
    element.focus();
  }

  autosize(event) {
    const el = this.renderer.selectRootElement('#description');
    if (event) {
      el.style.scssText = 'height:' + el.scrollHeight + 'px';
    } else {
      el.style.scssText = 'height:' + 40 + 'px';
    }
  }
  engageSupport() {
    // method to get reason code for exception
    this.creditOverviewService.initiateExceptionRequest().subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.openSupportModel(res.data); // set exception data from api to modal
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  openSupportModel(data) {
    const modalRef = this.modalVar.open(EngageSupportComponent, { windowClass: 'engage-modal-wrapper' });
    modalRef.componentInstance.exceptionDataObj = data;
    modalRef.result.then((result) => {
      // after result set the request obj     
      if (result.continue === true) {
        this.submitPricingCase(result.requestData);
      }

    });
  }

}
