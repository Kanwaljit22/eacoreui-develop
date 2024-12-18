import { Injectable } from '@angular/core';
import { GridOptions, GridApi } from 'ag-grid-community';


@Injectable()
export class GridInitializationService {
  public gridOptions: GridOptions;

  constructor() {
  }

  initGrid(gridOptions) {
    gridOptions.api = <GridApi>{};

    gridOptions.rowSelection = 'multiple';
    gridOptions.enableColResize = true;
    gridOptions.pagination = false;
    gridOptions.paginationPageSize = 50;
    gridOptions.suppressLoadingOverlay = true;
    gridOptions.headerHeight = 41;
    gridOptions.sortingOrder = ['desc', 'asc'];
    gridOptions.enableServerSideSorting = true;
    gridOptions.suppressHorizontalScroll = false;
    gridOptions.showToolPanel = false;
    gridOptions.toolPanelSuppressRowGroups = true;
    gridOptions.toolPanelSuppressValues = true;
    gridOptions.enableFilter = true;
    /* suppressDragLeaveHidesColumns property will stop columns getting removed from the grid*/
    gridOptions.suppressDragLeaveHidesColumns = true;
    gridOptions.suppressCopyRowsToClipboard = true;

    gridOptions.defaultColDef = {
      // headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };
  }


}
