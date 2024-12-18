import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-unenroll-confirmation',
  templateUrl: './unenroll-confirmation.component.html',
  styleUrls: ['./unenroll-confirmation.component.scss']
})
export class UnenrollConfirmationComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }
  enrollmentName = ''
  ngOnInit(): void {
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
