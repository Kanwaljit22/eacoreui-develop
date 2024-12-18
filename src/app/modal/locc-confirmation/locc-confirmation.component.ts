import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-admin-delete',
  templateUrl: './locc-confirmation.component.html',
  styleUrls: ['./locc-confirmation.component.scss']
})
export class LoccConfirmationComponent implements OnInit {

  message: any;

  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService) { }

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
  // This method will be called when close the modal
  close(isImport = false) {

    this.activeModal.close({
      continue: false
    });
  }
}
