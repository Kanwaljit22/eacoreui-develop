import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-percentage-cell',
  templateUrl: './percentage-cell.component.html',
  styleUrls: ['./percentage-cell.component.scss']
})
export class PercentageCellComponent implements OnInit, ICellRendererAngularComp {
  options = {
    height: 16,
    offsetWidth: 20
  };
  params: any;
  agInit(params) {
    this.params = params;
  }

  constructor() { }

  ngOnInit() {
  }

  refresh(): boolean {
    return false;
  }

}
