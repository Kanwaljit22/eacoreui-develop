import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-add-case-id-pa',
  templateUrl: './add-case-id-pa.component.html',
  styleUrls: ['./add-case-id-pa.component.scss']
})
export class AddCaseIdPaComponent implements OnInit {

  caseId = '';
  type = '';
  isUpdate = false;

  constructor(public renderer: Renderer2, public activeModal: NgbActiveModal,public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('add-case-id-pa');
  }

    // method to validate entered value
    isCaseIdValueChanged($event) {
      if (!this.caseId.trim()) {
        this.isUpdate = false;
        return;
      }
      this.isUpdate = true;
    }
  
    focusInput(value) { }
  
    focusDescription() {
      const element = this.renderer.selectRootElement('#caseIdNumber');
      element.focus();
    }
  
    // This method will be called when close the modal
    close() {
      this.activeModal.close();
    }
  
    // method to close modal and send entered value
    update() {
      this.activeModal.close({
        caseNumber: this.caseId
      });
    }

}
