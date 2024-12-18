import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from "@app/shared/services/locale.service";

@Component({
  selector: 'app-tco-warning',
  templateUrl: './tco-warning.component.html',
  styleUrls: ['./tco-warning.component.scss']
})
export class TcoWarningComponent implements OnInit {
  @Input() showRestoreWarning: boolean;

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
