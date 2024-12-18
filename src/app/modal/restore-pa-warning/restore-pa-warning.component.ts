import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from "@app/shared/services/locale.service";

@Component({
  selector: 'app-restore-pa-warning',
  templateUrl: './restore-pa-warning.component.html',
  styleUrls: ['./restore-pa-warning.component.scss']
})
export class RestorePaWarningComponent implements OnInit {

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
