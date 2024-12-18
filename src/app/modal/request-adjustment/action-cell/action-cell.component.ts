import { RequestAdjustmentService } from './../request-adjustment.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';
import { TcoWarningComponent } from '@app/modal/tco-warning/tco-warning.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class ActionCellComponent implements OnInit {
  isAdjusted = false;
  params: any;

  constructor(public messageService: MessageService, public requestAdjustmentService: RequestAdjustmentService,
    private modalVar: NgbModal) { }

  ngOnInit() {
  }

  agInit(params) {
    this.params = params;
    if (!params.data.rowPinned) {
      let isAdjusted = false;
      // if (params.data.credits) {
      // for (let i = 0; i < params.data.credits.length; i++) {
      if (params.data.adjusted) {
        isAdjusted = true;
      }
      // }
      // }
      if (isAdjusted) {
        this.isAdjusted = true;
      }
    }
  }

  onRestore(params) {
    const modalRef = this.modalVar.open(TcoWarningComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.showRestoreWarning = true;
    modalRef.result.then((result) => {
      if (result.continue) {
        // Clears the status messages if any
        this.messageService.clear();
        // isAdjustmentUpdated should be true as we have new changes in the cell value
        this.requestAdjustmentService.isAdjustmentUpdated = true;
        let fieldName = params.colDef.field;
        // if (params.data.credits) {
        // for (let i = 0; i < params.data.credits.length; i++) {
        for (let key in params.data) {
          const computedKey = key + '_computedValue';
          if ((params.data[key] || +params.data[key] === 0) && (params.data[computedKey] || +params.data[computedKey] === 0)) {
            params.data[key] = params.data[computedKey];
          }
        }
        if (this.requestAdjustmentService.reasonCounter > 0 && !params.data.reasonCode) {
          this.requestAdjustmentService.reasonCounter--;
        }
        params.data.adjusted = false;
        params.data.lineUpdated = false;
        params.data.restore = true;
        params.data.reasonCode = '';
        params.data.comment = '';
        // params.data.credits[i].adjustedValue = params.data.credits[i].computedValue;
        // params.data.credits[i].restore = true;
        // params.data.credits[i].lineUpdated = true;
        // for (let key in params.data) {
        //   if (params.data.credits[i].fieldName === key) {
        //     params.data[key] = params.data.credits[i].computedValue;
        //   }
        // }
        // }
        // }
        this.isAdjusted = false;
        // for re-printing the grid on UI
        this.params.context.parentChildIstance.rePrintGrid();
      }
    });
  }

}
