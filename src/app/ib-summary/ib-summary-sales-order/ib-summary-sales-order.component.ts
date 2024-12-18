import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SalesOrderService } from './sales-order.service';
import {
  NgbPaginationConfig,
  NgbModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HeaderService } from '../../header/header.service';
import { IbSummaryService } from '../ib-summary.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { PaginationObject } from '../../dashboard/product-summary/product-summary.component';
import { SearchLocateService } from '../../modal/search-locate/search-locate.service';
import { SearchLocateComponent } from '../../modal/search-locate/search-locate.component';
import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { MessageType } from '@app/shared/services/message';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-ib-summary-sales-order',
  templateUrl: './ib-summary-sales-order.component.html',
  styleUrls: ['./ib-summary-sales-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IbSummarySalesOrderComponent implements OnInit {
  readonly SALES_ORDER = 'SALES_ORDER';
  public gridOptions: GridOptions;
  public showGrid: boolean;
  isDataLoaded = false;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  viewdata: string;
  salesOrderData: any[];
  columnHeaderList: any[];
  paginationObject: PaginationObject;
  dropdownsize = 30;
  page = 1;
  columnDefsData;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  locateData = [];
  resultFoundInside: number;
  salesOrderOutside: any;
  showInside = false;
  salesOrderInside = [];
  noMatch: any;
  showResults = false;
  sortSearchLocate: boolean = false;
  navigationSubscription;
  public domLayout;
  subscribers : any ={};

  // tslint:disable-next-line:max-line-length
  constructor(
    public salesOrderService: SalesOrderService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    public headerService: HeaderService,
    public ibSummaryService: IbSummaryService,
    private appDataService: AppDataService,
    private messageService: MessageService,
    private modalVar: NgbModal,
    public searchLocateService: SearchLocateService,
    private gridInitialization: GridInitializationService,
    private blockUiService: BlockUiService,
    public constantsService: ConstantsService,
    public localeService: LocaleService
  ) {
    this.router.onSameUrlNavigation = 'reload';
    this.gridOptions = <GridOptions>{};
    /*Initialize the grid*/
    this.gridInitialization.initGrid(this.gridOptions);
    // this.showGrid = true;
    try {
      this.createColumnDefs();
      this.paginationObject = this.ibSummaryService.defaultPaginationObject;
      this.ibSummaryService.initSearchAndLocate();
    } catch (err) {
      this.messageService.displayUiTechnicalError(err);
    }
    this.domLayout = 'autoHeight';
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     // this.ngOnInit();
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
      if (this.salesOrderData.length > 0) {
        // sort only if data exist in table
        this.utilitiesService.getSortedData(
          this.salesOrderData,
          sortingType,
          sortingField
        );
      }
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.salesOrderData);
    }
    // this.utilitiesService.getSortedData(this.prospectdetailSubsidiaryService.subsidiaryData,sortingType,sortingField);
  }

  getSalesOrderData() {
    this.blockUiService.spinnerConfig.startChain();
    this.blockUiService.spinnerConfig.blockUI();
    this.ibSummaryService.ibSummaryDataEmitter.subscribe(data => {
      this.salesOrderData = data;
      // hide the grid if no data found
      if (this.salesOrderData && this.salesOrderData.length > 0) {
        this.showGrid = true;
        // this.ibSummaryService.disableRequestIba = false;
      } else {
        this.showGrid = false;
        // this.ibSummaryService.disableRequestIba = true;
      }
      this.isDataLoaded = true;
      // this.gridOptions.api.setRowData(this.salesOrderData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      setTimeout(() => {
        //  this.utilitiesService.setTableHeight();
      });
      this.blockUiService.spinnerConfig.unBlockUI();
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    });
    setTimeout(() => {
      // this.utilitiesService.setTableHeight();
    });

    this.ibSummaryService.searchAndLocateDataEmitter.subscribe(data => {
      this.salesOrderData = data;

      // check if length > 0 , then show grid incase of 0 results from search n locate modal within a customer
      if (this.salesOrderData.length > 0) {
        this.showGrid = true;
      } else {
        this.showGrid = false;
      }
      this.isDataLoaded = true;
      // this.gridOptions.api.setRowData(this.salesOrderData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      this.ibSummaryService.searchAndLocate = [];
      this.ibSummaryService.isSearchAndLocate = true;
      setTimeout(() => {
        //  this.utilitiesService.setTableHeight();
      });
    });

  }

  ngOnInit() {
    // if(this.appDataService.archName === this.constantsService.SECURITY){
    //   this.showGrid = false;
    //   this.isDataLoaded = true;
    // }
    // let text = this.productSummaryService.prospectInfoObject.architecture ===
    //   this.constantsService.SECURITY ? 'BOOKING SUMMARY' : 'IB SUMMARY';
    // this.appDataService.custNameEmitter.emit({'text': text,'context':AppDataService.PAGE_CONTEXT.iBSummarySalesOrder});
    try {
      this.getSalesOrderData();
      // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      // this.ibSummaryService.loadIbSummaryData(IbSummaryService.SALES_ORDER,null);
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
            IbSummaryService.SALES_ORDER
          );
        }
      };
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
    this.subscribers.paginationEmitter=this.utilitiesService.paginationEmitter.subscribe((pagination : any)=>{
      this.paginationObject = pagination;
      this.pageChange();
      });
  }

  getSalesOrderOutsideData() {
    this.salesOrderService.getSalesOrderData().subscribe(data => {
      this.salesOrderOutside = data;
    });
  }

  getSalesNoMatchData() {
    this.salesOrderService.getSalesNoMatchData().subscribe(data => {
      this.noMatch = data;
    });
  }

  private createColumnDefs() {
    // this.appDataService.getDetailsMetaData(this.SALES_ORDER).subscribe();
    // const data = this.appDataService.getDetailsMetaData(this.SALES_ORDER);
    let data;
    if (this.appDataService.archName !== this.constantsService.SECURITY) {
      data = this.appDataService.getDetailsMetaData(this.SALES_ORDER);
    } else {
      data = this.appDataService.getDetailsMetaData(this.SALES_ORDER + '_SEC');
    }
    this.columnDefsData = data.columns;
    this.ibSummaryService.ibSummaryRequestObj.page = this.appDataService.defaultPageObject;
    this.ibSummaryService.ibSummaryRequestObj.sort = data.sort;
    this.columnHeaderList = [];
    this.columnDefs = this.ibSummaryService.prepareColumnMetaData(data);
    this.columnDefs.forEach(col => {
      if (col.field === 'ORDER_NAME') {
        col.width = 200;
      } else if (col.field === 'PARTNER_NAME') {
        col.width = 306;
      } else if (col.field === 'END_CUSTOMER_CR_PARTY_NAME') {
        col.width = 309;
      } else if (col.field === 'BILL_TO') {
        col.width = 106;
      } else if (col.field === 'END_CUSTOMER_CR_HQ_ID') {
        col.width = 106;
      } else if (col.field === 'END_CUSTOMER_CR_HQ_NAME') {
        col.width = 140;
      } else if (col.field === 'END_CUSTOMER_CR_GU_ID') {
        col.width = 108;
      }
    });
    try {
      this.ibSummaryService.loadIbSummaryData(
        IbSummaryService.SALES_ORDER,
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
        IbSummaryService.SALES_ORDER,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  // // View dropdown feature in pagination
  // onPageSizeChanged(newPageSize) {
  //   // this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
  //   this.ibSummaryService.ibSummaryRequestObj.page.pageSize = newPageSize;
  //   this.ibSummaryService.ibSummaryRequestObj.page.currentPage = 1;
  //   try {
  //     this.ibSummaryService.loadIbSummaryData(
  //       IbSummaryService.SALES_ORDER,
  //       null
  //     );
  //   } catch (error) {
  //     console.error(error.ERROR_MESSAGE);
  //     this.messageService.displayUiTechnicalError(error);
  //   }
  // }
  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '' + (parseInt($event.rowIndex) + 1);
  }

  currencyFormat(params, thisInstance) {
    // return thisInstance.utilitiesService.dollarvalue(params.value);
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
    this.searchLocateService.searchSalesOrder = true;
    this.searchLocateService.searchContract = false;
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
        'salesOrderNo'
      );
      this.salesOrderInside = this.locateData;
      salesFilterComponent.setModel(this.salesOrderInside);
      this.gridOptions.api.onFilterChanged();
      this.showInside = true;
      this.resultFoundInside = this.gridOptions.api.getDisplayedRowCount();
      this.getSalesOrderOutsideData();
      setTimeout(() => {
        //  this.utilitiesService.setTableHeight();
      });
    });
  }

  showOutsideResults() {
    this.showInside = false;
    this.gridOptions.api.setQuickFilter(null);
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.salesOrderOutside);
    }
  }

  showInsideResults() {
    this.showInside = true;
    const salesFilterComponent = this.gridOptions.api.getFilterInstance(
      'salesOrderNo'
    );
    salesFilterComponent.setModel(this.salesOrderInside);
    this.gridOptions.api.onFilterChanged();
  }
  ngOnDestroy(){
    if(this.subscribers.paginationEmitter){
      this.subscribers.paginationEmitter.unsubscribe();
    }
  }
  closeSearch() {
    this.showResults = false;
    this.locateData = [];
    const salesFilterComponent = this.gridOptions.api.getFilterInstance(
      'salesOrderNo'
    );
    salesFilterComponent.setModel(null);
    this.gridOptions.api.onFilterChanged();
    setTimeout(() => {
      //  this.utilitiesService.setTableHeight();
    });
  }
}
