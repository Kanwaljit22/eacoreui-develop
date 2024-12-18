import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-consumption-cell',
  templateUrl: './consumption-cell.component.html',
  styleUrls: ['./consumption-cell.component.scss']
})
export class ConsumptionCellComponent implements ICellRendererAngularComp {
  params: any;
  val: any;

  constructor(private currencyPipe: CurrencyPipe) { }

  agInit(params) {
    this.params = params;
    const value = params.value;
    if (value === '--') {
      this.val = value;
      return this.val;
    }
    if (value !== undefined || value !== null) {
      this.val = this.currencyPipe.transform(value, 'USD', 'symbol');
      if (this.val !== null) {
        this.val = this.val.replace(/\$/gi, ''); /*Remove $ from formatted text */
        this.val = this.val.replace(/(\.[0-9]*?)0+/g, ''); // Removes decimal values
      }
      return this.val;
    }
  }

  refresh(): boolean {
    return false;
  }

}
