
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-initiate-docusign-warning',
  templateUrl: './initiate-docusign-warning.component.html',
  styleUrls: ['./initiate-docusign-warning.component.scss']
})



export class InitiateDocusignWarningComponent implements OnInit {

  isLOA = false;

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

}
