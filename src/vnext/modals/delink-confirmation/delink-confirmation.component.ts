import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';

@Component({
  selector: 'app-delink-confirmation',
  templateUrl: './delink-confirmation.component.html',
  styleUrls: ['./delink-confirmation.component.scss']
})
export class DelinkConfirmationComponent {
  constructor(public localizationService:LocalizationService, public activeModal: NgbActiveModal, private priceEstimateService: PriceEstimateService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  close(){
    this.activeModal.close();
  }
  delink(){//API call
    this.priceEstimateService.delinkHwCxSubject.next(true);
    this.close();
  }
}
