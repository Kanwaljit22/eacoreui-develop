import { Component, OnInit } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-expired-suite-warning',
  templateUrl: './expired-suite-warning.component.html',
  styleUrls: ['./expired-suite-warning.component.scss']
})
export class ExpiredSuiteWarningComponent implements OnInit {

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
