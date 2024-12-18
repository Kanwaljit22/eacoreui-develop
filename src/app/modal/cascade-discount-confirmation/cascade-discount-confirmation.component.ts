import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Component({
  selector: 'app-cascade-discount-confirmation',
  templateUrl: './cascade-discount-confirmation.component.html',
  styleUrls: ['./cascade-discount-confirmation.component.scss']
})
export class CascadeDiscountConfirmationComponent implements OnInit,OnDestroy {

  constructor(public activeModal: NgbActiveModal, public proposalDataService: ProposalDataService) { }

  message: any;
  caseId = '';

  ngOnInit() {
  }

  continue(){
    this.activeModal.close({
      continue: true
    });
  }

  close(){
    this.activeModal.close({});
  }
  ngOnDestroy() {
    this.proposalDataService.caseCreatedForCxProposal = false;
  }

}
