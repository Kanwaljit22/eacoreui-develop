import { Component, OnInit } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-reload-ea-consumption',
  templateUrl: './confirm-reload-ea-consumption.component.html',
  styleUrls: ['./confirm-reload-ea-consumption.component.scss']
})
export class ConfirmReloadEaConsumptionComponent implements OnInit {

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
