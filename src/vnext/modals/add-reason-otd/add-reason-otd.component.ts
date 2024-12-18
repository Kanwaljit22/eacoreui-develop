import { Component, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-add-reason-otd',
  templateUrl: './add-reason-otd.component.html',
  styleUrls: ['./add-reason-otd.component.scss']
})
export class AddReasonOtdComponent {

  pidReason = ''; // set pid reason added
  isUpdate = false; // set to true when any changes made
  constructor(public renderer: Renderer2, public activeModal: NgbActiveModal,public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }


  ngOnInit() {
    
  }

  // method to validate entered value
  isReasonChanged($event) {
    if (!this.pidReason.trim()) {
      this.isUpdate = false;
      return;
    }
    if(this.pidReason.trim().length < 15){
      this.isUpdate = false;
      return;
    }
    this.isUpdate = true;
  }

  focusInput(value) { }

  focusDescription() {
    const element = this.renderer.selectRootElement('#reasonValue');
    element.focus();
  }

  // This method will be called when close the modal
  close() {
    this.activeModal.close();
  }

  // method to close modal and send entered value
  update() {
    this.activeModal.close({
      pidReason: this.pidReason.trim()
    });
  }
}
