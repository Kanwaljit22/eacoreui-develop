import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-consumption-header',
  templateUrl: './consumption-header.component.html',
  styleUrls: ['./consumption-header.component.scss']
})
export class ConsumptionHeaderComponent implements IHeaderAngularComp {
  params: any;

  constructor() { }

  agInit(params) {
    this.params = params;
  }

}
