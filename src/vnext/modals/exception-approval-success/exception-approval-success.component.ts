import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-exception-approval-success',
  templateUrl: './exception-approval-success.component.html',
  styleUrls: ['./exception-approval-success.component.scss']
})
export class ExceptionApprovalSuccessComponent implements OnInit {

  constructor(public ngbActiveModal: NgbActiveModal, private proposalStoreService: ProposalStoreService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('exception-approval-success');
  }

  close() {
    this.ngbActiveModal.close({
      continue: true
    });
  }
}
