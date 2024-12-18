import { Component, OnInit, Renderer2, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppDataService, SessionData } from '../services/app.data.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '../services/locale.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { ConstantsService } from '../services/constants.service';
import { MessageService } from '../services/message.service';
import { PartnerDealCreationService } from '../partner-deal-creation/partner-deal-creation.service';
import { QualSummaryService } from '@app/qualifications/edit-qualifications/qual-summary/qual-summary.service';
import { BlockUiService } from '../services/block.ui.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { EditWhoInvolvedComponent } from '@app/modal/edit-who-involved/edit-who-involved.component';
import { InitiateDocusignWarningComponent } from '@app/modal/initiate-docusign-warning/initiate-docusign-warning.component';
import { UtilitiesService } from '../services/utilities.service';

@Component({
  selector: 'app-locc-flyout',
  templateUrl: './locc-flyout.component.html',
  styleUrls: ['./locc-flyout.component.scss']
})
export class LoccFlyoutComponent implements OnInit, OnDestroy {

  initiateStep1: boolean;
  initiateStep2: boolean;
  initiateStep3: boolean;
  disableContinue = true;
  signaturePending = false;
  signatureSigned = false;
  isShowContinue = false;
  isShowSendAgain = false;
  todaysDate: Date;
  loaCustomerContact: any;
  isLoaCustomerContactPresent = false;
  @Input() loccView: boolean;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  public subscribers: any = {};
  constructor(public renderer: Renderer2, public appDataService: AppDataService, private copyLinkService: CopyLinkService,
    public localeService: LocaleService, public qualSummaryService: QualSummaryService, public blockUiService: BlockUiService,
    public constantsService: ConstantsService, private messageService: MessageService, private modalVar: NgbModal,
    public partnerDealCreationService: PartnerDealCreationService, public qualService: QualificationsService,
    public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    if (this.qualService.loccSignaturePending()) {
      this.signaturePending = true;
      this.isShowSendAgain = true;
    } else {
      this.initiateStep1 = true;
    }
    this.blockUiService.spinnerConfig.customBlocker = false;
    this.getCustomerInfoData(); // call getQual api for customer rep and legal info details

    this.subscribers.loaCustomerContactUpdateEmitter = this.qualService.loaCustomerContactUpdateEmitter.subscribe((data: any) => {
      this.isLoaCustomerContactPresent = true;
      this.loaCustomerContact = data;
      this.setCustomerContactPreferredLegalAddress(data);
    });
  }

  // method to call api to get and set customer rep and legal info details
  getCustomerInfoData() {
    // const sessionObject: SessionData = this.appDataService.getSessionObject();
    // console.log(sessionObject)
    // if (sessionObject && sessionObject.qualificationData && Object.keys(sessionObject.qualificationData).length > 0) {
    //   if (sessionObject.qualificationData.loaCustomerContact) {
    //     this.qualService.qualification.customerInfo.affiliateNames = sessionObject.qualificationData.loaCustomerContact.affiliateNames;
    //     this.qualService.qualification.customerInfo.scope = sessionObject.qualificationData.loaCustomerContact.scope ? sessionObject.qualificationData.loaCustomerContact.scope : 'None';
    //     this.qualService.qualification.customerInfo = sessionObject.qualificationData.loaCustomerContact;
    //     this.qualService.qualification.qualID = sessionObject.qualificationData.qualId;
    //     this.qualService.qualification.name = sessionObject.qualificationData.qualName;
    //     this.appDataService.customerID = sessionObject.qualificationData.customerId;
    //     this.qualService.qualification.legalInfo = sessionObject.qualificationData.loaCustomerContact.preferredLegalAddress;
    //     this.qualService.qualification.customerInfo.preferredLegalName = sessionObject.qualificationData.loaCustomerContact.preferredLegalName;
    //     this.qualService.qualification.customerInfo.repName = sessionObject.qualificationData.loaCustomerContact.repName;
    //     this.qualService.qualification.customerInfo.repEmail = sessionObject.qualificationData.loaCustomerContact.repEmail;
    //     this.qualService.qualification.customerInfo.repTitle = sessionObject.qualificationData.loaCustomerContact.repTitle;
    //   }
    //   this.qualService.qualification.dealId = sessionObject.qualificationData.dealId;
    //   this.qualService.loaData.partnerBeGeoId = sessionObject.qualificationData.partnerBEGeoId;
    //   this.qualService.loaData.customerGuId = sessionObject.qualificationData.customerGuId;
    // } else {
    this.qualSummaryService.getCustomerInfo().subscribe((response: any) => {
      // this.blockUiService.spinnerConfig.unBlockUI();
      // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if (response && !response.error) {
        try {
            this.qualService.qualification.qualID = response.data.qualId;
            this.qualService.qualification.name = response.data.qualName;
            this.appDataService.customerID = response.data.customerId;
          // sessionObject.qualificationData = response.data; // this.qualification;
          if (response.data.loaCustomerContact && Object.keys(response.data.loaCustomerContact).length) {
            this.isLoaCustomerContactPresent = true;
            this.loaCustomerContact = response.data.loaCustomerContact;
            this.setCustomerContactPreferredLegalAddress(response.data.loaCustomerContact);
            // sessionObject.qualificationData = this.qualService.qualification;
          } else {
            if(response.data.customerContact){
              this.setCustomerContactPreferredLegalAddress(response.data.customerContact);
            }
            this.isLoaCustomerContactPresent = false;
          }
          this.qualService.qualification.dealId = this.qualService.dealData.dealId = response.data.dealId;
          this.qualService.loaData.partnerBEGeoId = response.data.partnerBEGeoId;
          this.qualService.loaData.customerGuId = response.data.customerGuId;
        } catch (error) {
          // to unblock UI and show no data found if there's error
          // this.blockUiService.spinnerConfig.unBlockUI();
          console.error(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {

        // to unblock UI and show no data found if there's no data coming from service
        // this.blockUiService.spinnerConfig.unBlockUI();

        this.messageService.displayMessagesFromResponse(response);
      }
    });
    // }

  }

  setCustomerContactPreferredLegalAddress(data){
    this.qualService.qualification.legalInfo = data.preferredLegalAddress;
    this.qualService.qualification.customerInfo.preferredLegalName = data.preferredLegalName;
  }
  ngOnDestroy() {
    this.partnerDealCreationService.showLoccFlyout = false;
    if(this.subscribers.loaCustomerContactUpdateEmitter){
      this.subscribers.loaCustomerContactUpdateEmitter.unsubscribe();
    }
  }

  // method to open modal for editing customer rep details
  goToWhoInvolved() {
    this.blockUiService.spinnerConfig.customBlocker = false;
    const modalRef = this.modalVar.open(EditWhoInvolvedComponent, { windowClass: 'editCustInfo' });
    modalRef.componentInstance.isPartnerLed = true;
    modalRef.componentInstance.loaCustomerContact = this.loaCustomerContact;
    modalRef.componentInstance.isForLocc = true; // set if modal opens from locc flyout
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

  downloadAuthorizationLetter() {
    this.blockUiService.spinnerConfig.customBlocker = false;
    let url = '';
    url = 'api/document/partner/download/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId +'&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';
    this.partnerDealCreationService.downloadUnsignedDoc(url).subscribe((response: any) => {
      if (response && !response.error) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  docusign() {
    this.blockUiService.spinnerConfig.customBlocker = false;
    let url = 'api/document/partner/sign/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&customerGuId=' + this.qualService.loaData.customerGuId +'&dealId=' + this.qualService.qualification.dealId + '&f=0&fcg=0';

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

  close() {
    if (this.signaturePending) {
      this.qualService.loaData.document.status = ConstantsService.PENDING_STATUS;
    }
    this.partnerDealCreationService.showLoccFlyout = false;
  }
}
