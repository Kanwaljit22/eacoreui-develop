import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';


@Component({
  selector: 'app-delete-qualification',
  templateUrl: './delete-qualification.component.html',
  styleUrls: ['./delete-qualification.component.scss']
})
export class DeleteQualificationComponent implements OnInit {

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
