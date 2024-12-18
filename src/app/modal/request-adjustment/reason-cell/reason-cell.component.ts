import { RequestAdjustmentService } from './../request-adjustment.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UtilitiesService } from '@app/shared/services/utilities.service';

@Component({
  selector: 'app-reason-cell',
  templateUrl: './reason-cell.component.html',
  styleUrls: ['./reason-cell.component.scss']
})
export class ReasonCellComponent implements ICellRendererAngularComp {
  @ViewChild('cellValue', { static: false }) private valueContainer: ElementRef;
  dropValue: any;
  public params: any;
  selectedReason = 'Select Reason';
  arrayOfReasons = [];
  show = false;
  constructor(public utilitiesService: UtilitiesService, public requestAdjustmentService: RequestAdjustmentService) { }

  agInit(params: any): void {
    this.params = params;
    this.arrayOfReasons = this.requestAdjustmentService.reasonsArray;
    this.arrayOfReasons.forEach(element => {
      if (element.code == params.data.reasonCode) {
        this.selectedReason = element.description;
      }
    });

    // this.arrayOfReasons = [{ val: 'Remove Adjustment' }, { val: 'Reduce Adjustment' }, { val: 'Add Cross-Arch adjustment (C1 and Security EA)' }, { val: 'Add Adjustment for Acquisition IB' }, { val: 'Add Short Term Promo' }];
  }

  refresh(): boolean {
    return false;
  }

  changeReason(a, params) {

    this.selectedReason = a.description;
    params.data.reasonCode = a.code;
    // this.requestAdjustmentService.isAdjustmentUpdated = true;
    // to update only if computed and adjusted value are different
    if (params.data.adjusted) {
      params.data.lineUpdated = true;
      this.requestAdjustmentService.isAdjustmentUpdated = true;
    }
    if (this.requestAdjustmentService.reasonCounter > 0 && params.data.adjusted) {
      this.requestAdjustmentService.reasonCounter--;
    }

    this.show = false;
  }

  myDropsearch() {
    // console.log(122);
    this.show = !this.show;
  }

  onClickedOutside(event) {
    this.show = false;
  }

}
