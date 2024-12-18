import { Component, OnInit } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-delete-smart-account',
  templateUrl: './delete-smart-account.component.html',
  styleUrls: ['./delete-smart-account.component.scss']
})
export class DeleteSmartAccountComponent implements OnInit {
  userAdmin = false;

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
