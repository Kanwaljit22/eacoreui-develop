import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { LocaleService } from '../services/locale.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { PartnerDealCreationService } from '../partner-deal-creation/partner-deal-creation.service';
import { UtilitiesService } from '../services/utilities.service';
import { MessageService } from '../services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadFileComponent } from '@app/modal/upload-file/upload-file.component';
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { DocumentCenterService } from "@app/document-center/document-center.service";
import { ConstantsService } from '../services/constants.service';
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { LOAFileComponent } from "@app/shared/loa-file/loa-file.component";

@Component({
  selector: 'app-letter-of-cc',
  templateUrl: './letter-of-cc.component.html',
  styleUrls: ['./letter-of-cc.component.scss']
})
export class LetterOfCcComponent implements OnInit, OnDestroy {
  status = 'badge-not-submitted';
  signatureValidDate = '-';
  @Input() showLocc = true;
  options: string[] = ['Yes', 'No'];
  selectedOption: string;
  @Output() loaQuestionEmitter = new EventEmitter();
  public subscribers: any = {};
  @Input() showLoaRequired: any;
  answers: any[] = [{ ans: 'No' }, { ans: 'Yes' }];
  subAnswers: any = { 1: [{ ans: 'No' }] };
  currentStep = 1;

  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  constructor(public localeService: LocaleService, public qualService: QualificationsService,
    public partnerDealCreationService: PartnerDealCreationService, public utilitiesService: UtilitiesService,
    public messageService: MessageService, private modalVar: NgbModal, public blockUiService: BlockUiService,
    public appDataService: AppDataService, public documentCenter: DocumentCenterService,
    private proposalDataService: ProposalDataService) { }

  ngOnInit() {
    if (this.qualService && this.qualService.loaData &&
      this.qualService.loaData.loaDetail && this.qualService.loaData.loaDetail.signatureValidDate) {
      this.appDataService.signatureValidDate = this.qualService.loaData.loaDetail.signatureValidDate;
    }
    this.setLoaSelection(); // method to set yes or no for LOA
    this.subscribers.loaQuestionSelection = this.appDataService.loaQuestionSelectionEmitter.subscribe(() => {
      this.setLoaSelection();// method to set yes or no for LOA
    });
  }

  ngOnDestroy() {
    if (this.subscribers.loaQuestionSelection) {
      this.subscribers.loaQuestionSelection.unsubscribe();
    }
  }

  // download signed LOA document
  downloadAuthorizationLetter() {
    this.blockUiService.spinnerConfig.customBlocker = false;
    let url = "";

    if (this.qualService.loaData.loaSigned) {
      url = 'api/document/partner/download/docusign/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId +'&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';
    } else {
      url = 'api/document/partner/download/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId +'&dealId=' + this.qualService.qualification.dealId + '&customerGuId=' + this.qualService.loaData.customerGuId + "&f=0&fcg=0";
    }

    this.partnerDealCreationService.downloadUnsignedDoc(url).subscribe((response: any) => {

      if (response && !response.error) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }



  openDownloadModal() {

    const modalRef = this.modalVar.open(LOAFileComponent, {
      windowClass: "editLOAInfo"
    });
  }


  uploadAuthorizationLetter() {

    const modalRef = this.modalVar.open(UploadFileComponent, { windowClass: 'upload-file' });
    modalRef.componentInstance.isLoccUpload = this.showLocc;
    modalRef.result.then((result) => {
      if (this.documentCenter.isLOAUploaded && result.import) {
        this.documentCenter.getLOAData().subscribe((response: any) => {
          this.documentCenter.isLOAUploaded = false;
          this.documentCenter.loaData = [];

          if (response.data && !response.error) {
            response.data.loaDocuments.forEach(element => {

              if (!element.deleted) {
                // Set LOA document parameter
                this.documentCenter.setLOAParam(element);
              }
            });
          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        });
      }
    });
  }


  checkLoccSignaturePending() {

    return this.qualService.loccSignaturePending();
  }

  inititateSignature() {
    this.partnerDealCreationService.showLoccFlyout = true;
  }
  // method to set yes or no for LOA depending on loaQuestionSeletedValue
  setLoaSelection() {
    if (this.appDataService.loaQuestionSeletedValue !== undefined) {
      this.selectedOption = this.appDataService.loaQuestionSeletedValue ? this.options[0] : this.options[1];
    }
  }

  // method to set selected option and emit the value to call api
  setUploadOpotion(option) {
    this.selectedOption = option;
    let selection = (this.selectedOption === 'Yes') ? true : false;
    // api call
    this.loaQuestionEmitter.emit(selection);
  }

  continue() {
    if (this.currentStep === 1) {
      this.currentStep++;
    } else {
      console.log('Initiate')
    }
  }
}
