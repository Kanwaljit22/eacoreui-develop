import { Component, OnInit } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Component({
  selector: 'app-customer-legal-warning',
  templateUrl: './customer-legal-warning.component.html',
  styleUrls: ['./customer-legal-warning.component.scss']
})
export class CustomerLegalWarningComponent implements OnInit {
  isLinkedCxInProgress = false; // check if linked CX in progress

  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal, public proposalDataService: ProposalDataService) { }
  ngOnInit() {
  }
  close() {
    this.activeModal.close();
  }

}
