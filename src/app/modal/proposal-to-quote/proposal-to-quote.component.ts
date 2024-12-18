import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-proposal-to-quote',
  templateUrl: './proposal-to-quote.component.html',
  styleUrls: ['./proposal-to-quote.component.scss']
})
export class ProposalToQuoteComponent implements OnInit {

  radioSelected: any;
  radioSel: any;
  public quoteData: any;
  public quotesList = [];
  public type: any;
  invalidPartner = false;
  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService) { }

  ngOnInit() {
    // console.log(this.type)
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
}
