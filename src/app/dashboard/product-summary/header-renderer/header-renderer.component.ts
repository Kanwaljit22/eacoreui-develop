import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ProductSummaryService } from '../product-summary.service';

@Component({
  selector: 'app-header-renderer',
  templateUrl: './header-renderer.component.html',
  styleUrls: ['./header-renderer.component.scss']
})
export class HeaderRendererComponent implements IHeaderAngularComp {
  public params: any;
  sortIcon: string;
  unSortIcon = true;
  columnName = '';

  constructor(public productSummaryService: ProductSummaryService) { }

  agInit(params: any): void {
    this.params = params;
    this.columnName = this.productSummaryService.sortColumnname;
    if (this.columnName === params.column.colId) {
      this.unSortIcon = false;
      this.sortIcon = this.productSummaryService.sortOrder;
    }
  }

  setSorting(sort, params) {
    this.unSortIcon = false;
    this.sortIcon = sort;
    this.params.context.parentChildIstance.updateRowDataOnSort({sortType: sort,colId: params.column.colId});
  }

}
