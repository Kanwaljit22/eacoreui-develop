import { RequestAdjustmentService } from './../request-adjustment.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-comment-cell',
  templateUrl: './comment-cell.component.html',
  styleUrls: ['./comment-cell.component.scss']
})
export class CommentCellComponent implements ICellRendererAngularComp {
  @ViewChild('value', { static: false }) private valueContainer: ElementRef;
  editable = false;
  params: any;
  data = '';
  constructor(public requestAdjustmentService: RequestAdjustmentService) { }

  agInit(params: any): void {
    this.params = params;
    if (params.value) {
      this.data = params.value;
  }
}

  edit(params: any) {
    this.editable = true;
    if (this.data) {
      // this.requestAdjustmentService.isAdjustmentUpdated = true;
      params.data.comment = this.data;
    }
    // to update only if computed and adjusted value are different
    if (params.data.adjusted) {
      params.data.lineUpdated = true;
      this.requestAdjustmentService.isAdjustmentUpdated = true;
    }
  }

  onClickedOutside(event, params) {
    this.editable = false;
    if (this.data) {
      params.data.comment = this.data;
    }
  }

  refresh(): boolean {
    return false;
  }

  open(tooltip) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }

}
