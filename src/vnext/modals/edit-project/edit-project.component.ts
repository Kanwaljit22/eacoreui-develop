import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  disableButton = false;
  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  edit() {
    this.activeModal.close({
      continue : true
    });
  }

  // method to check/uncheck checkbox
  acceptEdit(){
    this.disableButton = !this.disableButton
  }
}
