import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-withdraw-exception',
  templateUrl: './withdraw-exception.component.html',
  styleUrls: ['./withdraw-exception.component.scss']
})
export class WithdrawExceptionComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }
  ngOnInit(): void {
    this.eaService.getLocalizedString('withdraw-exception');
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
