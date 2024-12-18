import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-missing-id',
  templateUrl: './missing-id.component.html',
  styleUrls: ['./missing-id.component.scss']
})
export class MissingIdComponent {
  missingPartyIds = [];
  displayData = []
  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService) { }

  ngOnInit(){
    let rowData = []
    for(let id of this.missingPartyIds){
      rowData.push(id);
      if(rowData.length === 5){
        this.displayData.push(rowData);
        rowData = []
      }
    }
    if(rowData.length){
      this.displayData.push(rowData);
    }
  }

  close() {
    this.activeModal.close();
  }
}
