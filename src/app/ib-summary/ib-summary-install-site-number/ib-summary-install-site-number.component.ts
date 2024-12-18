import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { InstallSiteNumberService } from './install-site-number.service';

import {
  NgbPaginationConfig,
  NgbModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { HeaderService } from '../../header/header.service';
import { IbSummaryService } from '../ib-summary.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { SearchLocateService } from '../../modal/search-locate/search-locate.service';
import { SearchLocateComponent } from '../../modal/search-locate/search-locate.component';
import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { ArchitectureMetaDataJson, PaginationObject } from '@app/all-architecture-view/all-architecture-view.service';

@Component({
  selector: 'app-ib-summary-install-site-number',
  templateUrl: './ib-summary-install-site-number.component.html',
  styleUrls: ['./ib-summary-install-site-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IbSummaryInstallSiteNumberComponent implements OnInit {
  readonly INSTALL_SITE = 'INSTALL_SITE';
  public gridOptions: GridOptions;
  public showGrid: boolean;
  isDataLoaded = false;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  viewdata: string;
  public domLayout;
  columnHeaderList: any[];
  paginationObject: PaginationObject;
  dropdownsize = 30;
  page = 1;
  columnDefsData;
  coloumnObject = new Map<string, ArchitectureMetaDataJson>();
  installSiteNumberData: any[];
  isSortingProspectCall = false;
  navigationSubscription;
  subscribers :any ={};
  // tslint:disable-next-line:max-line-length
  constructor(
    public installSiteNumberService: InstallSiteNumberService,
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
    // this.showGrid = true;
    this.gridOptions.headerHeight = 30;
    this.createColumnDefs();
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
          IbSummaryService.INSTALL_SITE
        );
      }
    };
    this.ibSummaryService.initSearchAndLocate();
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.ngOnInit();
    //   }
    // });
    this.domLayout = 'autoHeight';
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
        this.installSiteNumberData,
        sortingType,
        sortingField
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.installSiteNumberData);
    }
    // this.utilitiesService.getSortedData(this.prospectdetailSubsidiaryService.subsidiaryData,sortingType,sortingField);
  }

  getInstallSiteNumberData() {
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.ibSummaryService.ibSummaryDataEmitter.subscribe(data => {
      this.installSiteNumberData = data;
      // hide the grid if no data found
      if (this.installSiteNumberData && this.installSiteNumberData.length > 0) {
        this.showGrid = true;
        // this.ibSummaryService.disableRequestIba = false;
      } else {
        this.showGrid = false;
        // this.ibSummaryService.disableRequestIba = true;
      }
      this.isDataLoaded = true;
      // this.gridOptions.api.setRowData(this.installSiteNumberData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      setTimeout(() => {
        // this.utilitiesService.setTableHeight();
      });
    });

    this.ibSummaryService.searchAndLocateDataEmitter.subscribe(data => {
      this.installSiteNumberData = data;
      // check if length > 0 , then show grid incase of 0 results from search n locate modal within a customer
      if (this.installSiteNumberData.length > 0) {
        this.showGrid = true;
      } else {
        this.showGrid = false;
      }
      // this.installSiteNumberData = data;
      this.isDataLoaded = true;
      // this.gridOptions.api.setRowData(this.installSiteNumberData);
      this.paginationObject.collectionSize = this.ibSummaryService.ibSummaryRequestObj.page.noOfRecords;
      this.paginationObject.page = this.ibSummaryService.ibSummaryRequestObj.page.currentPage;
      this.paginationObject.pageSize = this.ibSummaryService.ibSummaryRequestObj.page.pageSize;
      this.ibSummaryService.searchAndLocate = [];
      this.ibSummaryService.isSearchAndLocate = true;
    });
    setTimeout(() => {
      // this.utilitiesService.setTableHeight();
    });
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.iBSummaryInstallSite;
    this.getInstallSiteNumberData();
    // this.getInstallNoMatchData();
    this.subscribers.paginationEmitter = this.utilitiesService.paginationEmitter.subscribe((pagination: any) => {
      this.paginationObject= pagination;
      this.pageChange();
      });
  }

  private createColumnDefs() {
    const thisInstance = this;
    const data = this.appDataService.getDetailsMetaData(this.INSTALL_SITE);
    this.columnDefsData = data.columns;
    this.ibSummaryService.ibSummaryRequestObj.page = this.appDataService.defaultPageObject;
    this.ibSummaryService.ibSummaryRequestObj.sort = data.sort;
    this.columnHeaderList = [];
    this.columnDefs = this.ibSummaryService.prepareColumnMetaData(data);
    this.columnDefs.forEach(col => {
      if (col.field === 'INSTALL_SITE_NAME') {
        col.width = 285;
      } else if (col.field === 'INSTALLED_QUANTITY') {
        col.width = 78;
      } else if (col.field === 'TOTAL_NET_PRICE') {
        col.width = 114;
      } else if (col.field === 'NET_SERVICE_AMOUNT') {
        col.width = 112;
      } else if (col.field === 'END_CUSTOMER_CR_PARTY_ID') {
        col.width = 109;
      } else if (col.field === 'END_CUSTOMER_CR_PARTY_NAME') {
        col.width = 309;
      } else if (col.field === 'END_CUSTOMER_CR_HQ_ID') {
        col.width = 106;
      } else if (col.field === 'END_CUSTOMER_CR_GU_ID') {
        col.width = 108;
      }/*else if(col.headerName === 'SITE ADDRESS'){
        col.children.forEach(child => {
          if(child.field === 'STATE'){
            child.width = 100;
          }
        });
      }*/

    });
    try {
      this.ibSummaryService.loadIbSummaryData(
        IbSummaryService.INSTALL_SITE,
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
        IbSummaryService.INSTALL_SITE,
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
        IbSummaryService.INSTALL_SITE,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '' + (parseInt($event.rowIndex) + 1);
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
  ngOnDestroy(){
    if(this.subscribers.paginationEmitter){
        this.subscribers.paginationEmitter.unsubscribe();
    }
  }
}
