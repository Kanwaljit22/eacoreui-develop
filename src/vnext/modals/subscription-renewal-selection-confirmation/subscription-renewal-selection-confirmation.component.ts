import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-subscription-renewal-selection-confirmation',
  templateUrl: './subscription-renewal-selection-confirmation.component.html',
  styleUrls: ['./subscription-renewal-selection-confirmation.component.scss']
})
export class SubscriptionRenewalSelectionConfirmationComponent implements OnInit {

  constructor(public ngbActiveModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
  }

  close() {
    this.ngbActiveModal.close({
      continue: false
    });
  }

  confirm() {
    this.ngbActiveModal.close({
      continue: true
    });
  }

}
