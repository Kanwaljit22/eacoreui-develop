import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from "@app/shared/services/locale.service";
@Component({
  selector: 'app-suite-switch-warning',
  templateUrl: './suite-switch-warning.component.html',
  styleUrls: ['./suite-switch-warning.component.scss']
})
export class SuiteSwitchWarningComponent implements OnInit {

  @Input() showSuiteChangeWarning: boolean;

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
