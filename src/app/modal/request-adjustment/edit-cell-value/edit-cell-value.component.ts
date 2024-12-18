import { RequestAdjustmentService } from './../request-adjustment.service';
import { Component, OnInit } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-edit-cell-value',
  templateUrl: './edit-cell-value.component.html',
  styleUrls: ['./edit-cell-value.component.scss']
})
export class EditCellValueComponent implements OnInit {
  params: any;
  data: any;
  showRestore = true;
  editing = false;
  oldValue: any;
  computedValue: any;

  constructor(public messageService: MessageService, public requestAdjustmentService: RequestAdjustmentService) { }

  agInit(params) {
    let fieldName = params.colDef.field;
    this.params = params;
    if (params.value || params.value === 0) {
      this.data = params.value.toLocaleString();
    }

    // if (params.data.credits) {
    //   for (let i = 0; i < params.data.credits.length; i++) {
    //     if (params.data.credits[i].hasOwnProperty(fieldName)) {
    //       if (params.data.credits[i].adjusted) {
    //         //params.node['adjusted'] = true;
    //         params.colDef.cellClass = 'dollar-align';
    //       }
    //     }
    //   }
    // }
  }

  ngOnInit() {
  }

  onClick(params) {
    if (params.node.rowPinned !== 'top') {
      // set cell editable only value is present 
      this.editing = ((params.value !== undefined) ? true : false);
      this.showRestore = false;
      this.oldValue = params.value;
    }
  }

  keyDown($event) {
    // updated for allowing (.) to add decimals
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 ||
      $event.ctrlKey && $event.keyCode === 86 || $event.keyCode === 8 || $event.keyCode === 190 || $event.keyCode === 110)) {
      event.preventDefault();
    }
  }

  onClickedOutside(params, val) {
    if (this.editing) {
      this.data = (val + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
      this.editing = false;
      const val1 = this.data.replace(/,/g, '');
      // this.params.context.parentChildIstance.updateEQtyList(this.params);
      // this.isAdvancedChanged
      if (this.oldValue !== +val1) {
        this.params.context.parentChildIstance.cellClassValue(params);
        this.params.context.parentChildIstance.rowClass(params, val);
      }
    }
  }

  onChange(params) {
    this.editing = true;
    // if data is empty make it 0 else it will make cell disable on UI.
    if (!this.data) {
      this.data = 0;
    }

    // convert number in negative
    if (this.data > 0) {
      this.data = this.data * -1;
    }
    // Clears the status messages if any
    this.messageService.clear();
    let fieldName = params.colDef.field;
    if (this.data !== params.data[fieldName + '_computedValue']) {
      // isAdjustmentUpdated should be true as we have new changes in the cell value
      this.requestAdjustmentService.isAdjustmentUpdated = true;
      params.data.lineUpdated = true;
      params.data[fieldName] = this.data;
      // increse counter for reason code if no reason is selected.
      if (!params.data.adjusted && !params.data.reasonCode) {
        this.requestAdjustmentService.reasonCounter++;
      }
      params.data.adjusted = true;
    }
    // if (params.data.credits) {
    //   for (let i = 0; i < params.data.credits.length; i++) {
    //     if (params.data.credits[i].hasOwnProperty(fieldName)) {
    //       if (params.data.credits[i].adjusted) {
    //         if (this.data !== params.data.credits[i].adjustedValue) {
    //           params.data.credits[i].adjustedValue = this.data;
    //           params.data.credits[i].lineUpdated = true;
    //         }
    //       } else {
    //         if (this.data !== params.data.credits[i].computedValue) {
    //           params.data.credits[i].adjustedValue = this.data;
    //           params.data.credits[i].adjusted = true;
    //           params.data.credits[i].lineUpdated = true;
    //         }
    //       }
    //     }
    //   }
    // }
  }

  onRestore(params) {
    // isAdjustmentUpdated should be true as we have new changes in the cell value
    this.requestAdjustmentService.isAdjustmentUpdated = true;
    // this.showRestore = false;
    this.editing = true;
    // Set css style for the cell that restored
    // params.colDef.cellClass = 'text-right';
    // Clears the status messages if any
    this.messageService.clear();
    let fieldName = params.colDef.field;
    let computedFieldName = fieldName + '_computedValue'
    params.data[fieldName] = params.data[computedFieldName];
    params.data.adjusted = false;
    params.data.lineUpdated = false;
    params.data.restore = true;
    for (let key in params.data) {
      // to check if other values are updated.
      const computedKey = key + '_computedValue';
      if ((params.data[computedKey] || params.data[computedKey] === 0) && params.data[key] !== params.data[computedKey]) {
        params.data.adjusted = true;
        params.data.lineUpdated = true;
        params.data.restore = false;
      }
    }
    // if no cell is updated in the row reason and comment should be empty.
    if (!params.data.adjusted) {
      params.data.reasonCode = '';
      params.data.comment = '';
      if (this.requestAdjustmentService.reasonCounter) {
        this.requestAdjustmentService.reasonCounter--
      }
    }
    this.params.context.parentChildIstance.rePrintGrid();
    // if (params.data.credits) {
    //   for (let i = 0; i < params.data.credits.length; i++) {
    //     if (params.data.credits[i].hasOwnProperty(fieldName)) {
    //       params.data.credits[i].adjusted = false;
    //       params.data.credits[i].adjustedValue = params.data.credits[i].computedValue;
    //       params.data.credits[i].restore = true;
    //       this.params.value = params.data.credits[i].computedValue;
    //       this.data = params.data.credits[i].computedValue;
    //       params.data.credits[i].lineUpdated = true;
    //     }
    //   }
    // }
  }

  refresh(): boolean {
    return false;
  }

}
