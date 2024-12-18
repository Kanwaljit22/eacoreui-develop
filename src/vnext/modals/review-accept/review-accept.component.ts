import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-review-accept',
  templateUrl: './review-accept.component.html',
  styleUrls: ['./review-accept.component.scss']
})
export class ReviewAcceptComponent implements OnInit {
  disableButton = false;

  constructor(public activeModal: NgbActiveModal, public vNextStoreService: VnextStoreService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('review-accept');
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

  // method to check/uncheck checkbox
  reviewAccept(){
    this.disableButton = !this.disableButton
  }
}
