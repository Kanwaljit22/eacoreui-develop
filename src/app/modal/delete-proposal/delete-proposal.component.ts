import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';


@Component({
  selector: 'app-delete-proposal',
  templateUrl: './delete-proposal.component.html',
  styleUrls: ['./delete-proposal.component.scss']
})
export class DeleteProposalComponent implements OnInit {

  message: any;
  proposals = '';
  constructor(public localeService: LocaleService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  continue() {
    this.activeModal.close({
      continue: true
    });
  }

  cancel() {
    this.activeModal.close({
      continue: false
    });
  }

}
