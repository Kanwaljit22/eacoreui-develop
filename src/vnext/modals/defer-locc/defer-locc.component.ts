import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-defer-locc',
  templateUrl: './defer-locc.component.html',
  styleUrls: ['./defer-locc.component.scss']
})
export class DeferLoccComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService ) { }

  ngOnInit() {
    this.eaService.getLocalizedString('defer-locc');
  }

  close() {
    this.activeModal.close({
        continue: false
      });
  }

  defer(){
    this.activeModal.close({
      continue: true
    });
  }
}
