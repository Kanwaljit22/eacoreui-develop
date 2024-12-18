import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from './../../shared/copy-link/copy-link.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PriceEstimationService } from './../../proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-download-request',
  templateUrl: './download-request.component.html',
  styleUrls: ['./download-request.component.scss']
})
export class DownloadRequestComponent implements OnInit {

  constructor(public appDataService: AppDataService, private proposalDataService: ProposalDataService,
    private copyLinkService: CopyLinkService, public constantsService: ConstantsService,
    private priceEstimationService: PriceEstimationService, public localeService: LocaleService,
    public messageService: MessageService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  sendTcvReport() {
    let reqJSON = {
      // 'userId': this.appDataService.userId,
      'archName': this.appDataService.archName,
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
      'customerGuName': this.appDataService.customerName
    };
    this.priceEstimationService.sendTcvReport(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          //     this.activeModal.close();
          this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('docusign.TCO_COMPARISON_REPORT'));
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  sendIbaReport() {
    let reqJSON = {
      // 'userId': this.appDataService.userId,
      'archName': this.appDataService.archName,
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
      'customerGuName': this.appDataService.customerName
    };

    this.priceEstimationService.sendIbaReport(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          //     this.activeModal.close();
          this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('docusign.PROPOSAL_IB_REPORT'));
          // this.customerSuccessMsg = this.constantsService.IB_ASSESSMENT_MESSAGE;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  sendCustomerIbReport() {
    let reqJSON = {
      // 'userId': this.appDataService.userId,
      'archName': this.appDataService.archName,
      'customerId': this.appDataService.customerID,
      'customerGuName': this.appDataService.customerName,
      'proposalId': this.proposalDataService.proposalDataObject.proposalId
    };
    this.priceEstimationService.getCustomerIBReport(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          //     this.activeModal.close();
          if (this.appDataService.archName === this.constantsService.SECURITY) {
            this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('docusign.CUSTOMER_BOOKING_REPORT'));
          } else {
            this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('docusign.CUSTOMER_IB_REPORT'));
          }

        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });

  }


}
