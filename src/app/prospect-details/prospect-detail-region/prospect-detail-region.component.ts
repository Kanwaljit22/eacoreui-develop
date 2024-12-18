import {
  Component,
  OnInit,
  ViewEncapsulation,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule } from '@angular/router';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HeaderService } from '../../header/header.service';
import { ProspectDetailRegionService } from './prospect-detail-region.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProspectDetailsService } from '../prospect-details.service';

import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageType } from '@app/shared/services/message';
import { Subscription } from 'rxjs';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ArchitectureMetaDataFactory, ArchitectureMetaDataJson } from '@app/all-architecture-view/all-architecture-view.service';


@Component({
  selector: 'app-prospect-detail-region',
  templateUrl: './prospect-detail-region.component.html',
  styleUrls: ['./prospect-detail-region.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProspectDetailRegionComponent implements OnInit, OnDestroy {
  @Input() allArchitectureView: boolean;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  isDataLoaded = false;
  public rowData: any[];
  public regionColumnDefs: ArchitectureMetaDataJson[];
  public rowCount: string;
  public domLayout;
  viewdata: string;
  columnHeaderList: any[];
  dropdownsize = 30;
  summaryData: any = [];
  archName: any;
  customername: any;
  regionsRowData = new Array<{}>();
  regionData: Array<any>;
  sortingObject: any;
  public fullScreen = false;
  theaterNames: Array<string>;
  response: any;
  theaterNamesSet: any = new Set();
  subscription: Subscription;
  errorMsg = 'No data found  for Geography';

  constructor(
    public prospectdetailRegionService: ProspectDetailRegionService,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private router: Router,
    public headerService: HeaderService,
    public prospectDetailsService: ProspectDetailsService,
    public appDataService: AppDataService,
    private messageService: MessageService,
    private gridInitialization: GridInitializationService,
    private blockUiService: BlockUiService,
    public localeService: LocaleService,
    public constantsService: ConstantsService
  ) {
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);
    if (this.appDataService.archName !== this.constantsService.SECURITY)
      this.createRegionColumnDefs();
    this.showGrid = true;

    this.gridOptions.defaultColDef = {
      // headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };

    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }

    };
    this.domLayout = 'autoHeight';
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.prospectDetailsByGeography;
    this.theaterNames = [];

    this.getGeography();

    // On dropdown change 
    this.subscription = this.prospectDetailsService.reloadSuites.subscribe((path: any) => {
      if (this.appDataService.archName !== this.constantsService.SECURITY)
        this.createRegionColumnDefs();
      this.getGeography();
    });
  }

  getGeography() {

    try {
      this.getRegionData();
      this.gridOptions.onSortChanged = () => {
        this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
      };
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      // this.messageService.displayUiTechnicalError(error);
    }
  }

  getRegionData() {
    this.regionData = new Array<any>();
    this.prospectDetailsService.getTabData('regions').subscribe(
      (this.response = response => {
        if (response && !response.error && response.data) {
          try {
            const regionData = response.data;
            for (let i = 0; i < regionData.length; i++) {
              const regionRow = regionData[i];
              const colData = regionRow.column;
              const record = { THEATER: regionRow.name, children: [] };
              this.prospectDetailsService.updateRowData(colData, record);
              const childrenRow = regionRow.data;
              if (childrenRow) {
                record.children = new Array<any>();
                for (let j = 0; j < childrenRow.length; j++) {
                  const regionChildrenData = childrenRow[j];
                  const childrenRowCol = regionChildrenData.column;
                  const childRecord = { THEATER: regionChildrenData.name };
                  this.prospectDetailsService.updateRowData(
                    childrenRowCol,
                    childRecord
                  );
                  record.children.push(childRecord);
                }
              }
              this.regionData.push(record);
            }
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.regionData);
            }
          } catch (error) {
            // console.error(error.ERROR_MESSAGE);
            // this.messageService.displayUiTechnicalError(error);
          }
        } else {
          if (response.error && response.messages) {
            this.errorMsg = response.messages[0].text;
          }
          this.isDataLoaded = true;
          this.showGrid = false;
          // }
          this.blockUiService.spinnerConfig.unBlockUI();
          // this.appDataService.persistErrorOnUi = true;
          // this.messageService.displayMessagesFromResponse(response);
          // this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Info));
        }
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      }),
      error => {
        this.appDataService.persistErrorOnUi = true;
        this.messageService.displayUiTechnicalError(error);
      }
    );

    setTimeout(() => {
      this.utilitiesService.setTableHeight();
    });
  }

  ngOnDestroy() {
    this.appDataService.persistErrorOnUi = false;
    this.subscription.unsubscribe();
  }


  private createRegionColumnDefs() {
    const thisInstance = this;
    this.regionColumnDefs = [];
    let data = this.prospectdetailRegionService.getRegionColumnsData();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;
    // this.regionColumnDefs.push(firstColumn); this is commented as we don't need empty row in the grid.
    this.columnHeaderList = [];
    const columnData = data.columns;
    for (let i = 0; i < columnData.length; i++) {
      // to show only columns with hidecolumn = 'N' -- for STATUS column value
      if (columnData[i].hideColumn !== 'Y') {
        if (columnData[i].displayName) {
          const columnDef = ArchitectureMetaDataFactory.getDataColoumn();
          columnDef.headerName = columnData[i].displayName;
          columnDef.field = columnData[i].persistanceColumn;
          if (
            columnDef.headerName == 'THEATER' ||
            columnData[i].dataType === 'String'
          ) {
            columnDef.cellRenderer = 'group';
            columnDef.cellClass = 'expandable-header';
            columnDef.pinned = true;
          } else if (columnData[i].dataType === 'Number') {
            columnDef.cellRenderer = 'currencyFormat';
            columnDef.cellClass = 'dollar-align';
            if (columnDef.cellRenderer === 'currencyFormat') {
              columnDef.cellRenderer = function (params) {
                return thisInstance.currencyFormat(params, thisInstance);
              };
            }
          }
          else if (columnData[i].persistanceColumn === 'EA_QTY') {
            columnDef.cellClass = 'dollar-align';
            columnDef.cellRenderer = 'currencyFormat';
          }
          this.regionColumnDefs.push(columnDef);
          this.columnHeaderList.push(columnDef.headerName);
        }
      }
    }
  }

  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '';
  }

  getNodeChildDetails(rowItem) {
    if (rowItem.children) {
      return {
        group: true,
        children: rowItem.children,
        key: rowItem.THEATER
      };
    } else {
      return null;
    }
  }

  currencyFormat(params, thisInstance) {
    // return thisInstance.utilitiesService.formatValue(params.value);
    return thisInstance.utilitiesService.formatWithNoDecimal(params.value);
  }

  gotoSuites() {
    this.router.navigate(['/prospect-details-suites']);
  }

  gotoSubsidiary() {
    this.router.navigate(['/prospect-details-subsidiary']);
  }

  public onModelUpdated() {
    // console.log('onModelUpdated');
    this.calculateRowCount();
  }

  public onReady() {
    // console.log('onReady');
    this.calculateRowCount();
    this.gridOptions.api.sizeColumnsToFit();
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount =
        processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  updateRowDataOnSort(sortColObj: any) {
    if (sortColObj && sortColObj.length === 0) {
      sortColObj = this.sortingObject;
      if (sortColObj[0].sort === 'asc') {
        sortColObj[0].sort = 'desc';
      } else {
        sortColObj[0].sort = 'asc';
      }
    } else {
      this.sortingObject = sortColObj;
    }
    const sortingType = this.sortingObject[0].sort;
    const sortingField = this.sortingObject[0].colId;
    try {
      this.utilitiesService.getSortedData(
        this.regionData,
        sortingType,
        sortingField
      );
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      this.appDataService.persistErrorOnUi = true;
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.regionData);
      this.gridOptions.api.forEachNode(node => {
        if (this.isExpandedRow(node.data.THEATER)) {
          node.setExpanded(true);
        }
      });
    }
  }

  private isExpandedRow(selectedTheaterName: string) {
    let expandedRow = false;
    for (let i = 0; i < this.theaterNames.length; i++) {
      if (this.theaterNames[i] === selectedTheaterName) {
        expandedRow = true;
        break;
      }
    }
    return expandedRow;
  }

  public onCellClicked($event) {
    this.theaterNames.push($event.data.THEATER);
    if ($event.colDef.field === 'THEATER') {
      if (!this.theaterNamesSet.has($event.data.THEATER)) {
        // set checks if the node was collapsed or expanded
        this.theaterNames.push($event.data.THEATER);
        this.theaterNamesSet.add($event.data.THEATER);
      } else {
        this.theaterNamesSet.delete($event.data.THEATER);
        this.theaterNames = [];
        this.theaterNamesSet.forEach(theaterName => {
          this.theaterNames.push(theaterName);
        });
      }
    }
  }

  public onCellValueChanged($event) {
    // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  public onCellDoubleClicked($event) {
    // console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellContextMenu($event) {
    // console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellFocused($event) {
    // console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  public onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // console.log('onRowSelected: ' + $event.node.data.name);
  }

  public onSelectionChanged() {
    // console.log('selectionChanged');
  }

  public onBeforeFilterChanged() {
    // console.log('beforeFilterChanged');
  }

  public onAfterFilterChanged() {
    // console.log('afterFilterChanged');
  }

  public onFilterModified() {
    // console.log('onFilterModified');
  }

  public onBeforeSortChanged() {
    //  console.log('onBeforeSortChanged');
  }

  public onAfterSortChanged() {
    // console.log('onAfterSortChanged');
  }

  public onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  public onRowClicked($event) {
    //  console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  public onColumnEvent($event) {
    console.log('onColumnEvent: ' + $event);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }
}
