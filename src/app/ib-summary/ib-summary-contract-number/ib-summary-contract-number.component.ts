import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { ContractNumberService } from './contract-number.service';

import {
  NgbPaginationConfig,
  NgbModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HeaderService } from '../../header/header.service';
import { IbSummaryService } from '../ib-summary.service';
import { AppDataService } from '../../shared/services/app.data.service';

import {
  ArchitectureMetaDataFactory,
  ArchitectureMetaDataJson,
  PaginationObject
} from '../../dashboard/product-summary/product-summary.component';
import { SearchLocateService } from '../../modal/search-locate/search-locate.service';
import { SearchLocateComponent } from '../../modal/search-locate/search-locate.component';
import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';

@Component({
  selector: 'app-ib-summary-contract-number',
  templateUrl: './ib-summary-contract-number.component.html',
  styleUrls: ['./ib-summary-contract-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IbSummaryContractNumberComponent implements OnInit {
  readonly CONTRACT_NUMBER = 'CONTRACT_NUMBER';
  public gridOptions: GridOptions;
  public showGrid: boolean;
  isDataLoaded = false;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  viewdata: string;
  contractNumberData: any[];
  columnHeaderList: any[];
  dropdownsize = 30;
  page = 1;
  paginationObject: PaginationObject;
  columnDefsData;
  coloumnObject = new Map<string, ArchitectureMetaDataJson>();
  sortSearchLocate: boolean = false;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  locateData = [];
  contractInside = [];
  resultFoundInside: number;
  contractOutside: any;
  showInside = false;
  noMatch: any;
  showResults = false;
  navigationSubscription;
  subscribers :any={};
  public domLayout;

  // tslint:disable-next-line:max-line-length
  constructor(
    public contractNumberService: ContractNumberService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    public headerService: HeaderService,
    private ibSummaryService: IbSummaryService,
    private appDataService: AppDataService,
    private messageService: MessageService,
    private modalVar: NgbModal,
    public searchLocateService: SearchLocateService,
    private gridInitialization: GridInitializationService,
    private blockUiService: BlockUiService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridInitialization.initGrid(this.gridOptions);
    this.paginationObject = this.ibSummaryService.defaultPaginationObject;
    // this.createColumnDefs();
    //    this.showGrid = true;
    this.createColumnDefs();

    this.gridOptions.headerHeight = 42;
    this.gridOptions.enableServerSideSorting = true;
    this.ibSummaryService.initSearchAndLocate();
    this.domLayout = 'autoHeight';
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.ngOnInit();
    //   }
    // });
  }

  /*
  * This method will be called in case of search and locate and it will perform client side sorting.
  */
  updateDataOnSearchAndLocateSort(sortColObj: any) {
    this.ibSummaryService.setSortObject(sortColObj);
    const sortingType = this.ibSummaryService.sortingObject[0].sort;
    const sortingField = this.ibSummaryService.sortingObject[0].colId;

    try {
      this.utilitiesService.getSortedData(
        this.ibSummaryService.contractNumberData,
        sortingType,
        sortingField
      );
    } catch (error) {
      console.error(error);
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.ibSummaryService.contractNumberData);
    }
  }

  getContractNumberData() {
    // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.ibSummaryService.ibSummaryDataEmitter.subscribe(data => {
      this.ibSummaryService.contractNumberData = data;
      // hide grid if no data found
      if (this.ibSummaryService.contractNumberData && this.ibSummaryService.contractNumberData.length > 0) {
        this.showGrid = true;
        // this.ibSummaryService.disableRequestIba = false;
      } else {
        this.showGrid = false;
        // this.ibSummaryService.disableRequestIba = true;
      }
      this.isDataLoaded = true;
      //  this.gridOptions.api.setRowData(this.contractNumberData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      setTimeout(() => {
        //  this.utilitiesService.setTableHeight();
      });
    });

    this.ibSummaryService.searchAndLocateDataEmitter.subscribe(data => {
      this.ibSummaryService.contractNumberData = data;
      // check if length > 0 , then show grid incase of 0 results from search n locate modal within a customer
      if (this.ibSummaryService.contractNumberData.length > 0) {
        this.showGrid = true;
      } else {
        this.showGrid = false;
      }
      // this.ibSummaryService.contractNumberData = data;
      this.isDataLoaded = true;
      //  this.gridOptions.api.setRowData(this.contractNumberData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      setTimeout(() => {
        // this.utilitiesService.setTableHeight();
      });
      this.ibSummaryService.searchAndLocate = [];
      this.ibSummaryService.isSearchAndLocate = true;
    });
    setTimeout(() => {
      // this.utilitiesService.setTableHeight();
    });
  }

  ngOnInit() {
    if (this.appDataService.archName === 'SEC') {
      this.showGrid = false;
      this.isDataLoaded = true;
    }
    try {
      this.getContractNumberData();
      // this.ibSummaryService.loadIbSummaryData(IbSummaryService.CONTRACT_NUMBER,null);
      this.gridOptions.onSortChanged = () => {
        /*
      * Below if condition is for to apply server side sorting or client side sorting.
      * In case of search and locate we need to perform sorting on client side.
      */
        if (this.ibSummaryService.isSearchAndLocate) {
          this.updateDataOnSearchAndLocateSort(
            this.gridOptions.api.getSortModel()
          );
        } else {
          this.ibSummaryService.updateRowDataOnSort(
            this.gridOptions.api.getSortModel(),
            IbSummaryService.CONTRACT_NUMBER
          );
        }
      };
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
    this.subscribers.paginationEmitter = this.utilitiesService.paginationEmitter.subscribe((pagination: any) => {
      this.paginationObject= pagination;
      this.pageChange();
      });
  }

  private createColumnDefs() {
    const thisInstance = this;
    const data = this.appDataService.getDetailsMetaData(this.CONTRACT_NUMBER);
    this.columnDefsData = data.columns;
    this.ibSummaryService.ibSummaryRequestObj.page = this.appDataService.defaultPageObject;
    this.ibSummaryService.ibSummaryRequestObj.sort = data.sort;
    this.columnHeaderList = [];
    this.columnDefs = this.ibSummaryService.prepareColumnMetaData(data);
    this.columnDefs.forEach(col => {
      if (col.field === 'TOTAL_NET_PRICE') {
        col.width = 114;
      } else if (col.field === 'PARTNER_NAME') {
        col.width = 306;
      } else if (col.field === 'END_CUSTOMER_CR_PARTY_NAME') {
        col.width = 309;
      } else if (col.field === 'STATUS') {
        col.width = 115;
      } else if (col.field === 'BILL_TO') {
        col.width = 106;
      } else if (col.field === 'END_CUSTOMER_CR_PARTY_ID') {
        col.width = 109;
      }
    });
    try {
      this.ibSummaryService.loadIbSummaryData(
        IbSummaryService.CONTRACT_NUMBER,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  pageChange() {
    this.ibSummaryService.ibSummaryRequestObj.page.currentPage = this.paginationObject.page;
    this.ibSummaryService.ibSummaryRequestObj.page.pageSize = this.paginationObject.pageSize;
    try {
      this.ibSummaryService.loadIbSummaryData(
        IbSummaryService.CONTRACT_NUMBER,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    // this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
    this.ibSummaryService.ibSummaryRequestObj.page.pageSize = newPageSize;
    this.ibSummaryService.ibSummaryRequestObj.page.currentPage = 1;
    try {
      this.ibSummaryService.loadIbSummaryData(
        IbSummaryService.CONTRACT_NUMBER,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  public onModelUpdated() {
    // console.log('onModelUpdated');
    this.calculateRowCount();
  }

  public onReady() {
    // console.log('onReady');
    this.calculateRowCount();
    // this.gridOptions.api.sizeColumnsToFit();
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
  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '' + (parseInt($event.rowIndex) + 1);
  }

  getContractOutsideData() {
    this.contractNumberService.getContractOutsideData().subscribe(data => {
      this.contractOutside = data;
    });
  }

  getContractNoMatchData() {
    this.contractNumberService.getContractNoMatchData().subscribe(data => {
      this.noMatch = data;
    });
  }

  public onCellClicked($event) {
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

  openSearchLocate() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'searchLocate-modal';
    this.searchLocateService.searchSalesOrder = false;
    this.searchLocateService.searchContract = true;
    this.searchLocateService.searchInstall = false;
    this.searchLocateService.searchSerial = false;
    const modalRef = this.modalVar.open(
      SearchLocateComponent,
      ngbModalOptionsLocal
    );
    modalRef.componentInstance.modelArr = this.locateData;
    modalRef.result.then(result => {
      this.showResults = true;
      this.locateData = result.locateData;
      const salesFilterComponent = this.gridOptions.api.getFilterInstance(
        'contractNumber'
      );
      this.contractInside = this.locateData;
      salesFilterComponent.setModel(this.contractInside);
      this.gridOptions.api.onFilterChanged();
      this.showInside = true;
      this.resultFoundInside = this.gridOptions.api.getDisplayedRowCount();
      this.getContractOutsideData();

      setTimeout(() => {
        //  this.utilitiesService.setTableHeight();
      });
    });
  }

  showOutsideResults() {
    this.showInside = false;
    this.gridOptions.api.setQuickFilter(null);
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.contractOutside);
    }
  }

  showInsideResults() {
    this.showInside = true;
    const salesFilterComponent = this.gridOptions.api.getFilterInstance(
      'contractNumber'
    );
    salesFilterComponent.setModel(this.contractInside);
    this.gridOptions.api.onFilterChanged();
  }
  ngOnDestroy(){
    if(this.subscribers.paginationEmitter){
      this.subscribers.paginationEmitter.unsubscribe();
    }
  }

  closeSearch() {
    this.showResults = false;
    const salesFilterComponent = this.gridOptions.api.getFilterInstance(
      'contractNumber'
    );
    salesFilterComponent.setModel(null);
    this.gridOptions.api.onFilterChanged();
    setTimeout(() => {
      // this.utilitiesService.setTableHeight();
    });
  }
}
