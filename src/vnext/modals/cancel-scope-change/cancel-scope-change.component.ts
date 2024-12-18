import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-cancel-scope-change',
  templateUrl: './cancel-scope-change.component.html',
  styleUrls: ['./cancel-scope-change.component.scss']
})
export class CancelScopeChangeComponent {
  @Input() isCancelScope: boolean;

  constructor(public ngbActiveModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) {

  }

  close() {
    this.ngbActiveModal.close({
    });
  }

  confirm() {
    this.ngbActiveModal.close({
      continue: true
    });
  }

}
