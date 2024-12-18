import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-withdraw-exception-request',
  templateUrl: './withdraw-exception-request.component.html',
  styleUrls: ['./withdraw-exception-request.component.scss']
})
export class WithdrawExceptionRequestComponent implements OnInit {

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
