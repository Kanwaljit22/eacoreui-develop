import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-convert-quote',
  templateUrl: './convert-quote.component.html',
  styleUrls: ['./convert-quote.component.scss'],
  providers: [MessageService]
})
export class ConvertQuoteComponent implements OnInit,OnDestroy {

  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, private proposalStoreService: ProposalStoreService, private eaRestService: EaRestService, private vNextService: VnextService, private messageService: MessageService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }
  ngOnDestroy() {
    this.messageService.disaplyModalMsg = false;
  }

  radioSelected: any;
  radioSel: any;
  quotesList = [];
  isquoteUrlClicked = false;

  ngOnInit(): void {
    this.messageService.disaplyModalMsg = true;
    this.eaService.getLocalizedString('convert-quote');
  }

  close() {
    this.activeModal.close({continue : false});
  }

    // Get row item from array
  getSelecteditem() {
    this.radioSel = this.quotesList.find(Item => Item['quoteId'] === this.radioSelected);
  }
  // Radio Change Event
  onItemChange(item) {
    this.getSelecteditem();
  }

  createNewQuote() {
    this.activeModal.close(null);
  }

  updateQuote() {
    this.activeModal.close(this.radioSelected);
  }

  // to open quote url
  openQuoteUrl(quoteId) {
    let url = 'proposal/ccw-quote-link?q=' + quoteId;
    this.isquoteUrlClicked = true
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if (this.vNextService.isValidResponseWithData(response,true)) {
        window.open(response.data); // open redirect url from response
      } else {     
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }
}
