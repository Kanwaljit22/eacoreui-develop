import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-delete-smart-account-confirmation',
  templateUrl: './delete-smart-account-confirmation.component.html',
  styleUrls: ['./delete-smart-account-confirmation.component.scss']
})
export class DeleteSmartAccountConfirmationComponent implements OnInit {

  constructor(public ngbActiveModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('delete-smart-account');
  }

  close() {
    this.ngbActiveModal.close({
      continue: false
    });
  }

  confirm() {
    this.ngbActiveModal.close({
      continue: true
    });
  }
}
