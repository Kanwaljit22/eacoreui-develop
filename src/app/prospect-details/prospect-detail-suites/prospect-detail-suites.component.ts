import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule } from '@angular/router';
import { HeaderGroupComponent } from '../../shared/ag-grid/header-group-component/header-group.component';
import { DateComponent } from '../../shared/ag-grid/date-component/date.component';
import { ProspectdetailSuitesService } from './prospect-detail-suites.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HeaderService } from '../../header/header.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProductSummaryService } from '../../dashboard/product-summary/product-summary.service';
import { ProspectDetailsService } from '../prospect-details.service';
import {
  ArchitectureMetaDataFactory,
  ArchitectureMetaDataJson
} from '../../dashboard/product-summary/product-summary.component';
import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageType } from '@app/shared/services/message';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prospect-detail-suites',
  templateUrl: './prospect-detail-suites.component.html',
  styleUrls: ['./prospect-detail-suites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProspectdetailSuitesComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  public HeaderGroupComponent = HeaderGroupComponent;
  viewdata: string;
  columnHeaderList: any[];
  dropdownsize = 30;
  coloumnObject = new Map<string, ArchitectureMetaDataJson>();
  columnDefsData;
  sortingObject: any;
  suitesRowData: Array<any>;
  suiteNames: Array<string>;
  suiteNameSet: any = new Set();
  subscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(
    public suitesViewService: ProspectdetailSuitesService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    public headerService: HeaderService,
    private appDataService: AppDataService,
    private productSummaryService: ProductSummaryService,
    private prospectDetailsService: ProspectDetailsService,
    private messageService: MessageService,
    private gridInitialization: GridInitializationService,
    private blockUiService: BlockUiService,
    public localeService: LocaleService
  ) {
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);
    this.createColumnDefs();
    this.showGrid = true;

    this.gridOptions.defaultColDef = {
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };

    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }
    };
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.prospectDetailsBySuite;
    this.suiteNames = [];

    this.getSuitesDetail();

    this.subscription = this.prospectDetailsService.reloadSuites.subscribe((path: any) => {
      this.createColumnDefs();
      this.getSuitesDetail();
    })
  }


  getSuitesDetail() {

    try {
      this.getSuitesData();
      this.gridOptions.onSortChanged = () => {
        this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
      };
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      // this.messageService.displayUiTechnicalError(error);
    }
  }


  getSuitesData() {
    let suitesJSON = {};
    this.prospectDetailsService
      .getTabData('suites')
      .subscribe((response: any) => {
        if (response && !response.error) {
          try {
            this.blockUiService.spinnerConfig.unBlockUI();
            this.blockUiService.spinnerConfig.stopChainAfterThisCall();

            this.suitesRowData = new Array<{}>();
            let suitesData = response.data;
            if (suitesData) {
              for (let i = 0; i < suitesData.length; i++) {
                let children = [];
                let prospect = suitesData[i];
                let columns = prospect.column;
                const record = { prospectid: i, name: prospect.name };
                for (let j = 0; j < columns.length; j++) {
                  let column = columns[j];
                  record[column.name] = column.value;
                }

                if (prospect.data) {
                  let childrenData = prospect.data;
                  if (childrenData) {
                    for (let k = 0; k < childrenData.length; k++) {
                      let childProspect = childrenData[k];
                      let columns = childProspect.column;
                      const childRecord = { name: childProspect.name };
                      childRecord['name'] = childProspect.name;

                      for (let l = 0; l < columns.length; l++) {
                        let column = columns[l];
                        childRecord[column.name] = column.value;
                      }
                      children.push(childRecord);
                      record['children'] = children;
                    }
                  }
                }
                this.suitesRowData.push(record);
              }
              this.rowData = this.suitesRowData;
              if (this.gridOptions.api) {
                this.gridOptions.api.setRowData(this.suitesRowData);
                setTimeout(() => {
                  this.gridOptions.api.sizeColumnsToFit();
                }, 0);
              }
            } else {
              // to show no data found if there's no data coming from service
              this.appDataService.persistErrorOnUi = true;
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
                'admin.NO_DATA_FOUND'), MessageType.Info));
            }

          } catch (error) {
            // console.error(error.ERROR_MESSAGE);
            // this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.appDataService.persistErrorOnUi = true;
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    setTimeout(() => {
      this.utilitiesService.setTableHeight();
    });
  }

  private isExpandedRow(selectedSuiteName: string) {
    let expandedRow = false;
    for (let i = 0; i < this.suiteNames.length; i++) {
      if (this.suiteNames[i] === selectedSuiteName) {
        expandedRow = true;
        break;
      }
    }
    return expandedRow;
  }

  nodeRenderer($event) {
    return '' + (parseInt($event.rowIndex) + 1);
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatWithNoDecimal(params.value);
  }

  prepareSuitesMetaData(architectureMetaData: any) {
    this.columnDefs = [];
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;
    firstColumn.getQuickFilterText = function (params) {
      return null;
    };
    // this.columnDefs.push(firstColumn); this is commented as we don't need empty row in the grid.
    this.columnHeaderList = [];
    const thisInstance = this;
    for (let i = 0; i < architectureMetaData.length; i++) {
      const coloumnData = architectureMetaData[i];

      this.productSummaryService.namePersistanceColumnMap.set(
        coloumnData.persistanceColumn,
        coloumnData.name
      );
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.columnSize) {
        /*Get column width from meta data and assign it to respective column*/
        coloumnDef.width = this.appDataService.assignColumnWidth(
          coloumnData.columnSize
        );
      }
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.persistanceColumn;
        coloumnDef.cellRenderer = 'group';
        coloumnDef.cellClass = 'dollar-align';
        this.coloumnObject.set(coloumnData.name, coloumnDef);
        this.columnHeaderList.push(coloumnDef.headerName);
        if (coloumnData.name === 'suiteName') {
          coloumnDef.pinned = true;
          coloumnDef.field = 'name';
          coloumnDef.cellClass = 'expandable-header';
          this.columnDefs.push(coloumnDef);
        } else if (coloumnData.hideColumn !== 'Y') {
          coloumnDef.cellClass = 'dollar-align';
          coloumnDef.cellRenderer = 'currencyFormat';
          coloumnDef.getQuickFilterText = 'filterText';
          coloumnDef.field = coloumnData.persistanceColumn;
          // if(sortObj.name === coloumnData.name)
          // {
          //     coloumnDef.sort = sortObj.type;
          // }
          if (coloumnDef.cellRenderer === 'currencyFormat') {
            coloumnDef.cellRenderer = function (params) {
              return thisInstance.currencyFormat(params, thisInstance);
            };
          }
          if (coloumnData.groupName) {
            // this condition is for column grouping.
            this.gridOptions.headerHeight = 45;
            if (headerGroupMap.has(coloumnData.groupName)) {
              let headerGroupObject = headerGroupMap.get(coloumnData.groupName);
              headerGroupObject.children.push(coloumnDef);
            } else {
              const headerObject: ArchitectureMetaDataJson = {
                headerName: coloumnData.groupName
              };
              coloumnDef.headerClass = 'child-header';
              headerObject.children = new Array<any>();
              headerGroupMap.set(coloumnData.groupName, headerObject);
              headerObject.children.push(coloumnDef);
              this.columnDefs.push(headerObject);
            }
          } else {
            this.columnDefs.push(coloumnDef);
          }
        }
      }
      if (coloumnDef.getQuickFilterText === 'filterText') {
        coloumnDef.getQuickFilterText = function (params) {
          return null;
        };
      }
    }
  }

  updateRowDataOnSort(sortColObj: any) {
    if (sortColObj && sortColObj.length == 0) {
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
        this.suitesRowData,
        sortingType,
        sortingField
      );
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      this.appDataService.persistErrorOnUi = true;
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.suitesRowData);
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 0);
    }
    // this.gridOptions.api.setRowData(this.suitesRowData);
    this.gridOptions.api.forEachNode(node => {
      if (this.isExpandedRow(node.data.name)) {
        node.setExpanded(true);
      }
    });
  }


  ngOnDestroy() {
    this.appDataService.persistErrorOnUi = false;
    this.subscription.unsubscribe();
  }


  private createColumnDefs() {
    const thisInstance = this;
    let data = this.appDataService.getDetailsMetaData('PROSPECT_SUITE');
    this.columnDefsData = data.columns;
    this.columnHeaderList = [];
    this.prepareSuitesMetaData(this.columnDefsData);
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

  getNodeChildDetails(rowItem) {
    if (rowItem.children) {
      return {
        group: true,
        children: rowItem.children,
        key: rowItem.group
      };
    } else {
      return null;
    }
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

  public onCellClicked($event) {
    this.suiteNames.push($event.data.name);

    if ($event.colDef.field === 'name') {
      if (!this.suiteNameSet.has($event.data.name)) {
        // set checks if the node was collapsed or expanded
        this.suiteNames.push($event.data.name);
        this.suiteNameSet.add($event.data.name);
      } else {
        this.suiteNameSet.delete($event.data.name);
        this.suiteNames = [];
        this.suiteNameSet.forEach(suiteName => {
          this.suiteNames.push(suiteName);
        });
      }
    }
    // console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
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
    // console.log('onColumnEvent: ' + $event);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  exportToCsv() {
    const selectedRows = this.gridOptions.api.getSelectedRows();
    const params = {
      fileName: 'summary-view',
      onlySelected: selectedRows.length > 0,
      columnSeparator: ';'
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  // export table data to Excel
  exportToExcel() {
    const selectedRows = this.gridOptions.api.getSelectedRows();
    const params = {
      fileName: 'summary-view',
      onlySelected: selectedRows.length > 0,
      columnGroups: true
    };
    this.gridOptions.api.exportDataAsExcel(params);
  }
}
