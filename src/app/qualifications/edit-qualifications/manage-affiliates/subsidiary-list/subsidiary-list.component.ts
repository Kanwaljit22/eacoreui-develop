import { Component, OnInit, Input } from '@angular/core';
import { GridInitializationService } from '@app/shared/ag-grid/grid-initialization.service';
import { GridOptions } from 'ag-grid-community';
import { ManageAffiliatesService } from '../manage-affiliates.service';
import { ColumnGridCellComponent } from '@app/shared/ag-grid/column-grid-cell/column-grid-cell.component';

@Component({
  selector: 'app-subsidiary-list',
  templateUrl: './subsidiary-list.component.html',
  styleUrls: ['./subsidiary-list.component.scss']
})
export class SubsidiaryListComponent implements OnInit {
  @Input() rows: any[] = [];
  @Input() columns: any[] = [
    {
      headerName: 'Party Name',
      field: 'partyName',
      suppressMenu: true,
      cellRenderer: 'gridCell',
      width: 176
    },
    {
      headerName: 'Node Type',
      field: 'nodeType',
      suppressMenu: true,
      width: 80
    },
    {
      headerName: 'Party ID',
      field: 'partyId',
      suppressMenu: true,
      width: 120
    },
    {
      headerName: 'Address',
      'children': [
        {
          headerName: 'Street Name',
          field: 'streetName',
        //  cellClass: 'dollar-align',
          suppressMenu: true,
          cellRenderer: 'gridCell',
          width: 169
        },
        {
          headerName: 'City',
          field: 'city',
        //  cellClass: 'dollar-align',
          cellRenderer: 'gridCell',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'Postal Code',
          field: 'postalCode',
         // cellClass: 'dollar-align',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'State',
          field: 'state',
         // cellClass: 'dollar-align',
          cellRenderer: 'gridCell',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'Country/Region',
          field: 'country',
         // cellClass: 'dollar-align',
          cellRenderer: 'gridCell',
          suppressMenu: true,
          width: 129
        }
      ]
    }
  ];
  gridOptions: any;
  showGrid = false;
  constructor(private gridInitialization: GridInitializationService,public affiliatesService: ManageAffiliatesService) {
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);
    this.showGrid = true;
    this.gridOptions.frameworkComponents = {
     
      gridCell: <{ new(): ColumnGridCellComponent }>(
        ColumnGridCellComponent
      )
  }
}

  ngOnInit() {
  }


  onGridReady(params) {
    params.api.setRowData(this.rows || []);
    this.gridOptions.api.sizeColumnsToFit();
  }

}
