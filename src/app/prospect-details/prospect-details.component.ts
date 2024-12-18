import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { HeaderGroupComponent } from '../shared/ag-grid/header-group-component/header-group.component';
import { DateComponent } from '../shared/ag-grid/date-component/date.component';
import { ProspectDetailsService } from './prospect-details.service';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { element } from 'protractor';
import { AppDataService, SessionData } from '../shared/services/app.data.service';
import { HeaderService } from '../header/header.service';
import { ProductSummaryService } from '../dashboard/product-summary/product-summary.service';
import { MessageService } from '../shared/services/message.service';
import { BlockUiService } from '../shared/services/block.ui.service';
import { SubHeaderComponent } from '../shared/sub-header/sub-header.component';
import { BreadcrumbsService } from '../../app/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalArchitectureService } from '@app/shared/proposal-architecture/proposal-architecture.service';
import { NgbModalOptions, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';


@Component({
  selector: 'app-prospect-details',
  templateUrl: './prospect-details.component.html',
  styleUrls: ['./prospect-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProspectDetailsComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  public HeaderGroupComponent = HeaderGroupComponent;
  viewdata: string;
  summaryData = [];

  isFavorite: number;
  customerId: number;
  summaryHeader: any = [];
  columnHeaderList: any = [];
  summaryHeaderList: any = new Map<string, string>();
  displayName: string;
  showCleanCoreButton: boolean;
  navigationSubscription;
  readonly toStartQualNew = true;
  architecture: any;
  selectedArchitecture: string;
  @ViewChild('myDropArchitecture', { static: false }) myDropArchitecture;
  showArchDrop = false;

  getHeaderDetails(summaryJSON) {
    this.blockUiService.spinnerConfig.startChain();
    this.appDataService.getHeaderData(summaryJSON);
  }

  constructor(public localeService: LocaleService,
    // @Inject(DOCUMENT) private document: any,
    public prospectDetailsService: ProspectDetailsService,
    public appDataService: AppDataService,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    private router: Router,
    public productSummaryService: ProductSummaryService,
    private messageService: MessageService,
    private blockUiService: BlockUiService,
    private breadcrumbsService: BreadcrumbsService,
    public constantsService: ConstantsService
  ) {
    this.gridOptions = <GridOptions>{};
    this.createColumnDefs();
    this.showGrid = true;
    this.gridOptions.dateComponentFramework = DateComponent;
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.enableColResize = true;
    this.gridOptions.pagination = true;
    this.gridOptions.paginationPageSize = 30;
    // this.gridOptions.groupSelectsChildren = true;
    this.gridOptions.defaultColDef = {
      // headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };
    this.route.params.forEach((params: Params) => {
      const sessionObj: SessionData = this.appDataService.getSessionObject();
      this.appDataService.archName = params['architecture'];
      this.appDataService.customerName = decodeURIComponent(params['customername']);
      if (sessionObj.isFavoriteUpdated) {
        if (+params['favorite'] === 0) {
          this.appDataService.isFavorite = 1;
        } else {
          this.appDataService.isFavorite = 0;
        }
      } else {
        this.appDataService.isFavorite = +params['favorite'];
      }
    });
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.blockUiService.spinnerConfig.unBlockUI();
    //   }
    // });
    this.appDataService.getUserDetailsFromSession();
    // this.gridOptions.enableSorting = true;
    this.gridOptions.sortingOrder = ['desc', 'asc', null];
    this.gridOptions.suppressHorizontalScroll = false;
    this.gridOptions.showToolPanel = false;
    this.gridOptions.toolPanelSuppressRowGroups = true;
    this.gridOptions.toolPanelSuppressValues = true;
    this.gridOptions.enableFilter = true;
    this.gridOptions.localeText = {
      pivotMode: 'Configure Column',
      next: '<span>Next <span class="pageRight"></span></span>',
      last: "<span> >> </span>",
      first: "<span> << </span>",
      previous: '<span> <span class="pageLeft"></span> Previous</span>'
    };
    this.gridOptions.headerHeight = 50;
    // this.gridOptions.getNodeChildDetails;
    this.breadcrumbsService.showOrHideBreadCrumbs(true);
    this.appDataService.headerDataEmitter.subscribe(
      (headerDetailMap: Map<string, any>) => {
        this.summaryData = [];
        headerDetailMap.forEach((value: any, key: string) => {
          // console.log(key, value);
          if (key === 'CUSTOMER_ID') {
            this.customerId = value;
            this.appDataService.customerID = value;
          } else if (key === 'displayName') {
            this.displayName = value;
          } else {
            this.summaryData.push(value);
          }
          // this.appDataService.subHeaderData.custName = this.appDataService.customerName;
          this.appDataService.subHeaderData.favFlag = true;
          this.appDataService.subHeaderData.subHeaderVal = this.summaryData;
          this.appDataService.subHeaderData.moduleName =
            SubHeaderComponent.PROSPECT_DETAILS;
        });
        this.appDataService.subHeaderData.custName = this.appDataService.customerName;
        this.appDataService.subHeaderData.moduleName = SubHeaderComponent.PROSPECT_DETAILS;
      }
    );
  }

  // View dropdown feature in pagination
  onPageSizeChanged($event: any) {
    this.gridOptions.api.paginationSetPageSize(Number(this.viewdata));
  }

  ngOnInit() {

    this.setSubHeaderData();

    // get all acrchitectures for dropdown
    this.getArchitectureList();

    // Get header detail
    this.getHeaderDetail();

    this.prospectDetailsService.displayManageLocation$.subscribe((response: boolean) => {
      this.showCleanCoreButton = response;
    });
  }

  getHeaderDetail() {

    this.setSubHeaderData();

    const summaryJSON = {
      customerName: this.appDataService.customerName,
      archName: this.appDataService.archName
      // user: this.appDataService.userId
    };
    // this.blockUiService.spinnerConfig.startChain();
    this.getHeaderDetails(summaryJSON);
  }

  // get all acrchitectures for dropdown
  getArchitectureList() {

    this.blockUiService.spinnerConfig.startChain();

    this.prospectDetailsService.getProposalArchitectures().subscribe((response) => {
      this.architecture = response;

      // Selected architecture
      this.architecture.answers.forEach(arch => {
        if (arch.name === this.appDataService.archName) {
          this.selectedArchitecture = arch.description;
        }
      });
      if (this.appDataService.archName) {
        this.productSummaryService.prospectInfoObject.architecture = this.appDataService.archName;
      }
    });
  }

  onArchitectureChange(arch) {
    this.appDataService.persistErrorOnUi = false;
    // If selected same arch then return
    if (this.appDataService.archName === arch.name) {

      this.manageArchDropdown();
      return;
    }

    this.selectedArchitecture = arch.description;
    this.appDataService.archName = arch.name;
    this.productSummaryService.prospectInfoObject.architecture = arch.name;
    this.productSummaryService
      .loadArchitecturesData(arch.name)
      .subscribe((response: any) => {
        if (response && !response.error) {
          this.appDataService.architectureMetaDataObject = response.data;
          const sessionObj = this.appDataService.getSessionObject();
          sessionObj.architectureMetaDataObject = response.data;
          this.appDataService.setSessionObject(sessionObj);
          const summaryJSON = {
            customerName: this.appDataService.customerName,
            archName: this.appDataService.archName
            // user: this.appDataService.userId
          };
          this.appDataService.headerDataEmitter.emit(new Map<string, any>());
          this.appDataService.subHeaderData.subHeaderVal = [];
          if (this.appDataService.archName !== this.constantsService.SECURITY) {
            this.getHeaderDetails(summaryJSON);
          }
          this.manageArchDropdown();

          // //Get header detail
          // this.getHeaderDetail();
          this.prospectDetailsService.reloadSuites.emit(
            true
          );
        }
      });
  }

  // Show and hide dropdown
  manageArchDropdown() {

    this.showArchDrop = true;
    setTimeout(() => {
      this.showArchDrop = false;
    }, 100);
  }


  ngOnDestroy() {
    this.headerService.exitFullScreenView();
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.isFavoriteUpdated = false;
    this.appDataService.setSessionObject(sessionObj);
  }

  openProductSummaryPage() {
    this.router.navigate(['dashboard']);
  }

  private createColumnDefs() {
    let columnHeaderList = this.prospectDetailsService.getSummaryHeaderColumns();
    for (let i = 0; i < columnHeaderList.length; i++) {
      if (columnHeaderList[i].persistanceColumn) {
        columnHeaderList[i].persistanceColumn.toUpperCase();
        this.columnHeaderList.push({
          name: columnHeaderList[i].persistanceColumn.toUpperCase(),
          value: columnHeaderList[i].displayName
        });
      }
    }
  }

  addFavorite() {
    this.productSummaryService
      .addFavorite(this.customerId)
      .subscribe((res: any) => {
        if (!res.error) {
          try {
            this.appDataService.isFavorite = 1;
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
  }

  removeFavorite() {
    this.productSummaryService
      .removeFavorite(this.customerId, this.appDataService.archName)
      .subscribe((res: any) => {
        if (!res.error) {
          try {
            this.appDataService.isFavorite = 0;
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
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

  startQualification(toNewQual) {
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.customerId = this.appDataService.customerID;
    this.appDataService.setSessionObject(sessionObj);
    const customerName = encodeURIComponent(this.appDataService.customerName);
    if (toNewQual) {
      this.router.navigate(['/qualifications'
        , {
          architecture: this.productSummaryService.prospectInfoObject.architecture
          , customername: customerName
          , customerId: this.appDataService.customerID
        }
      ]);
    } else {
      this.appDataService
        .redirectForCreateQualification()
        .subscribe((response: any) => {
          const customerStr = ';GUName=' + customerName + ';hierlvl=GU';
          this.productSummaryService.getUrlToNavigate(customerStr);
        });
    }
  }

  goToSummary() {
    this.router.navigate([
      '/ib-summary',
      {
        architecture: this.appDataService.archName,
        customername: encodeURIComponent(this.appDataService.customerName),
        favorite: this.appDataService.isFavorite,
        relativeTo: this.route,
        skipLocationChange: false
      }
    ]);
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

  subsidiaryNav() {

    this.showCleanCoreButton = false;
    this.blockUiService.spinnerConfig.startChain();

    // this.appDataService.cleanCoreAuthorizationCheck().subscribe((resp: any) => {
    //   //console.log(resp);
    //   if (resp && resp.data) {
    //     this.showCleanCoreButton = resp.data.eligible;
    //   }
    // });
  }

  geographyNav() {

  }

  suiteNav() {

  }

  redirectToCleanCore() {

    // Hard coding qual id as 1 in prospect details as per rajeev
    let qualID = 0;
    this.appDataService.cleanCoreRedirect(qualID);
    /*.subscribe((response: any) => {
      if (response) {
        console.log('Redirect [' + response + ']');
        //Getting callbackUrl and ciscoReadyUrl  from two parallel  subscriptons and join them in forkJoin
        //this.document.location.href = response.data.redirectUrl;
        window.location.href = response.data.redirectUrl;
      }
    });*/
  }

  // This method will be called in case of refresh page.
  setSubHeaderData() {
    if (
      this.appDataService.subHeaderData &&
      this.appDataService.subHeaderData.custName === ''
    ) {
      this.appDataService.subHeaderData.custName = this.appDataService.customerName;
      this.appDataService.subHeaderData.favFlag = true;
      this.appDataService.subHeaderData.subHeaderVal = this.summaryData;
      this.appDataService.subHeaderData.moduleName =
        SubHeaderComponent.PROSPECT_DETAILS;
    }
  }
}
