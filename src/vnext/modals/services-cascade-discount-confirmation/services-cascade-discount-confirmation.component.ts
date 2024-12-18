import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-services-cascade-discount-confirmation',
  templateUrl: './services-cascade-discount-confirmation.component.html',
  styleUrls: ['./services-cascade-discount-confirmation.component.scss']
})
export class ServicesCascadeDiscountConfirmationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('services-cascade-discount-confirmation');
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  accept() {
    this.activeModal.close({
      continue : true
    });
  }
}
