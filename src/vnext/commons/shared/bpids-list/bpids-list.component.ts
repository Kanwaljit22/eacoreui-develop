import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-bpids-list',
  templateUrl: './bpids-list.component.html',
  styleUrls: ['./bpids-list.component.scss']
})
export class BpidsListComponent implements OnInit{
  @Input() allBpIDs = [];
  @Input() isCreateNewBpFlyout: boolean;
  @Input() selectedBpID:any;
  @Output() selectedId = new EventEmitter();
  @Output() openBpIdDetail = new EventEmitter();
  start = 0;
  start_max = 0;
  viewIndex = 0; show = 3;
  bpIDList = [];
  selectedRadioBpId: any;

  constructor(public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService){}

  ngOnInit(): void {
    this.show = this.show < this.allBpIDs.length ? this.show : this.allBpIDs.length;
    this.bpIDList = this.allBpIDs;
    if (this.allBpIDs.length < this.show || this.allBpIDs.length === this.show) {
      this.start_max = 0;
    } else {
      const floor = Math.floor(this.allBpIDs.length / 3);
      this.start_max = ((this.allBpIDs.length % this.show) === 0) ? floor - 1 : floor;
    }
    this.selectedRadioBpId = this.selectedBpID;
    
  }

  checkBoxSelectBpid(bpId) {
    bpId.selected = !bpId.selected;
    this.selectedId.emit(bpId)
  }

  selectBpId($event,id) {
    if ($event.target.value === this.selectedRadioBpId?.eaId) {
      $event.target.checked = false;
      this.selectedRadioBpId = {};
    } else {
      this.selectedRadioBpId = id;
    }
    this.selectedId.emit(this.selectedRadioBpId)
  }

  openBpIdDetails(id) {
    this.openBpIdDetail.emit(id);
  }

  moveRight() {
    if (this.start === this.start_max) {
      return;
    }
    this.start++;
    this.viewIndex =  this.viewIndex + 2
    this.setPosition();
  }

  moveLeft() {
    if (this.start === 0) {
      return;
    }
    this.start--;
    this.viewIndex =  this.viewIndex - 2
    this.setPosition();
  }

  setPosition() {
   let showOffers = this.allBpIDs;
   showOffers = showOffers.slice(this.viewIndex, this.viewIndex+3);
   this.bpIDList = showOffers;
  }

}
