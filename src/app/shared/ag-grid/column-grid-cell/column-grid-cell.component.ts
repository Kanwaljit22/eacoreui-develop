import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-column-grid-cell',
  templateUrl: './column-grid-cell.component.html',
  styleUrls: ['./column-grid-cell.component.scss']
})
export class ColumnGridCellComponent implements ICellRendererAngularComp, OnChanges {
  @ViewChild('cellValue', { static: false }) private valueContainer: ElementRef;
  @Input() value: string = null;
  public params: any;
  createdBy = '';

  constructor(private utilitiesService: UtilitiesService, private appDataService: AppDataService, private el: ElementRef) { }

  agInit(params) {
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep) {
      if (params.value === undefined || params.value === "") {
        params.value = '--';
      } else if (params.value === 'Y') {
        params.value = 'Yes';
      } else if (params.value === 'N') {
        params.value = 'No';
      } else if (typeof (params.value) === 'number' && params.colDef.isQuantity) {
        params.value = this.utilitiesService.formatValue(params.value);
      }
    }
    this.params = params;
    if (params.colDef.field === 'submittedBy') {
      if(params.data && params.data.proposalExceptionDetails){
        this.createdBy = params.data.proposalExceptionDetails[0].createdBy;
    }
    }
    

  }
  ngOnChanges(changes) {
    if (changes.value) {
      this.params = {value : this.value };
    }
  }

  refresh(): boolean {
    return false;
  }

  showTooltip(tooltip) {
    const e = this.valueContainer.nativeElement;
    const element = this.el.nativeElement.closest('.ag-cell-value');
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }

}
