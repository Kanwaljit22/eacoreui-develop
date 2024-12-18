import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-price-validation',
  templateUrl: './price-validation.component.html',
  styleUrls: ['./price-validation.component.scss']
})
export class PriceValidationComponent {

  constructor(public activeModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService, private eaRestService: EaRestService, private vNextService: VnextService) { }
  ngOnInit() {
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  continueToReprocessIb () {
    this.activeModal.close({
      continue : true
    });
  }
  

}
