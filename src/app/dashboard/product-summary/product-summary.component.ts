import { AppRestService } from '@app/shared/services/app.rest.service';
import { Component, OnInit, ViewEncapsulation, Inject, OnDestroy, Renderer2 } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule, Params, ActivatedRoute } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';

import { DateComponent } from '../../shared/ag-grid/date-component/date.component';
import { ProductSummaryService } from './product-summary.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { FiltersService, SelectedFilterJson, GroupObj } from '../filters/filters.service';
import {
  AppDataService,
  SessionData
} from '../../shared/services/app.data.service';
import { ViewAppliedFiltersComponent } from '../../modal/view-applied-filters/view-applied-filters.component';
import { DOCUMENT } from '@angular/common';

import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { BreadcrumbsService } from '../../../app/core';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionEnum } from '@app/permissions';
import { PermissionService } from '@app/permission.service';
import { DealIdLookupComponent } from '@app/modal/deal-id-lookup/deal-id-lookup.component';
import { PercentageCellComponent } from './percentage-cell/percentage-cell.component';
import { PartnerBookingsService } from '@app/shared/partner-bookings/partner-bookings.service';
import { HeaderRendererComponent } from './header-renderer/header-renderer.component';
import { EaService } from 'ea/ea.service';
declare function escape(s?: string): string;

@Component({
  moduleId: module.id,
  selector: 'app-product-summary',
  templateUrl: './product-summary.component.html',
  styleUrls: ['./product-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductSummaryComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: ArchitectureMetaDataJson[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  subscribers: any = {};
  // public HeaderGroupComponent = HeaderGroupComponent;
  // public TableHeaderComponent = TableHeaderComponent;
  public fullScreen = false;
  public flagCount: number;
  public flagged = false;
  public bounced = false;
  public favoriteGridOptions: GridOptions;
  page;
  EaData: any[];
  architectData: Array<ArchitectureInfoJson[]>;
  taskList = [];
  checkCisco: boolean;
  checkSecurity: boolean;
  checkCollaboration: boolean;
  public valuee22 = false;
  viewdata: string;
  showArchitecture: boolean;
  totalCustomer: number;
  totalAmount: number;
  dropdownsize = 30;
  searchInput: string;
  activeLabel = false;
  globalView = true;
  columnHeaderList: any[];
  coloumnObject = new Map<string, ArchitectureMetaDataJson>();
  prospectRowData: Array<{}>;
  showFavoriteGrid = false;
  favoriteRowData: Array<{}>;
  public favoriteColumnDefs: ArchitectureMetaDataJson[];
  favoriteDefaultDef;
  private sortedRowArray = new Array<any>();
  noFavorites = false;
  ciscoReadyEaUrl;
  callbackUrl;
  selectedNoOfCustomer: number | string;
  selectedTcvAmount: number | string;
  paginationObject: PaginationObject;
  architectureName: string;
  favoriteCount: number;
  isSortingProspectCall = false;
  sortingObject: any;
  searchInputResult = false;
  greenFieldCustomersCount: number;
  guCount = 0;
  hqCount = 0;
  viewType: string; // This flag is use for search customer type possible values is GU or HQ
  salesLvlFilterData: any;
  favProspects: any;
  searchCustomerFromURL;
  displayFavToggle = false;
  selectedCustomerDetails = { customerName: '', customerId: '' };
  selectedPartnerDetails = { partnerName: '', partnerId: '' };
  viewAccountDrop = false;
  selectedAccountView = 'Global';
  accountDropOption = ['Global', 'Sales Account'];
  sortColumn = 'TCV_EA';


  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService,
    @Inject(DOCUMENT) private document: any,
    private modalVar: NgbModal,
    private router: Router,
    public productSummaryService: ProductSummaryService,
    private utilitiesService: UtilitiesService,
    public filtersService: FiltersService,
    config: NgbCarouselConfig,
    public configService: AppDataService,
    private messageService: MessageService,
    private gridInitialization: GridInitializationService,
    private blockUiService: BlockUiService,
    private breadcrumbsService: BreadcrumbsService,
    public constantsService: ConstantsService,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    public partnerBookingService: PartnerBookingsService,
    private appRestService: AppRestService,
    private eaService: EaService
  ) {
    // Setting for gridoptions for show favorites
    this.favoriteGridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.favoriteGridOptions);

    // Grid options for dsahboard page
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);
    this.page = 4;
    this.paginationObject = { collectionSize: 500, page: 1, pageSize: 50 };
    this.showGrid = true;
    config.interval = 0;
    config.wrap = false;
    this.greenFieldCustomersCount = 0;

    this.productSummaryService.loadProspectEmitter.subscribe(
      (gridData: Array<{}>) => {
        this.prospectRowData = gridData;
        this.greenFieldCustomersCount = this.productSummaryService.greenFieldCustomersCount;
        this.utilitiesService.setTableHeight();
        if (this.productSummaryService.isSearchByCustomer) {
          if (this.productSummaryService.customerSearchObject) {
            this.hqCount = this.productSummaryService.customerSearchObject.hqCount;
            this.guCount = this.productSummaryService.customerSearchObject.guCount;
            this.viewType = this.productSummaryService.customerSearchObject.view;
          }
          this.showFavoriteGrid = false;
          this.searchInputResult = true;
          this.activeLabel = this.searchInput ? true : false;
        }
        if (
          this.gridOptions.api === null ||
          this.gridOptions.api === undefined
        ) {
          this.gridOptions = <GridOptions>{
            onGridReady: () => {
              if (!this.showFavoriteGrid) {
                this.gridOptions.rowData = this.prospectRowData;
              }
            }
          };
        } else {
          setTimeout(() => {
            if (!this.showFavoriteGrid && this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.prospectRowData);
              this.gridOptions.api.sizeColumnsToFit();
            }
          }, 1000);
        }
        if (this.productSummaryService.selectedNoOfCustomer && this.productSummaryService.selectedTcvAmount) {
          this.selectedNoOfCustomer = this.productSummaryService.selectedNoOfCustomer;
          this.selectedTcvAmount = this.productSummaryService.selectedTcvAmount;
        }
        // this.selectedNoOfCustomer = this.productSummaryService.selectedNoOfCustomer;
        // this.selectedTcvAmount = this.productSummaryService.selectedTcvAmount;
        this.paginationObject.collectionSize = this.productSummaryService.prospectInfoObject.page.noOfRecords;
        this.paginationObject.page = this.productSummaryService.prospectInfoObject.page.currentPage;
        this.paginationObject.pageSize = this.productSummaryService.prospectInfoObject.page.pageSize;
        if (this.isSortingProspectCall) {
          const size = this.columnDefs.length;
          for (let i = 0; i < size; i++) {
            const columnDef = this.columnDefs[i];
            if (
              columnDef.field ===
              this.productSummaryService.prospectInfoObject.sort
                .persistanceColumn
            ) {
              columnDef.sort = this.productSummaryService.prospectInfoObject.sort.type;
            } else {
              columnDef.sort = undefined;
            }
            if (columnDef.children && columnDef.children.length > 0) {
              const noOfChildren = columnDef.children.length;
              for (let j = 0; j < noOfChildren; j++) {
                const childColumnDef = columnDef.children[j];
                if (
                  childColumnDef.field ===
                  this.productSummaryService.prospectInfoObject.sort
                    .persistanceColumn
                ) {
                  childColumnDef.sort = this.productSummaryService.prospectInfoObject.sort.type;
                } else {
                  childColumnDef.sort = undefined;
                }
              }
            }
          }
          this.gridOptions.api.setColumnDefs(this.columnDefs);
          this.isSortingProspectCall = false;
        }
      }
    );
    this.gridOptions.frameworkComponents = {
      percentageCellRenderer: <{ new(): PercentageCellComponent }>(
        PercentageCellComponent
      )
    };
    this.gridOptions.frameworkComponents = {
      percentageCellRenderer: <{ new(): PercentageCellComponent }>(
        PercentageCellComponent
      )
    };
    this.gridOptions.headerHeight = 50;
    this.gridOptions.context = {
      parentChildIstance: this
    };
  }

  ngOnInit() {
    // this page does not have any specific arch type
    this.configService.archName = undefined;
    this.globalView = this.productSummaryService.globalView;
    this.configService.subHeaderData.moduleName = '';
    if (this.productSummaryService.viewFavorites) {
      this.configService.subHeaderData.custName = 'My Favorite Prospects';
    } else {
      this.configService.subHeaderData.custName = 'My Prospects';
    }
    this.productSummaryService.onProductSummary = true;
    this.configService.showEngageCPS = false;
    this.configService.engageCPSsubject.next(this.configService.showEngageCPS);
    this.configService.userDashboardFLow = '';
    this.configService.pageContext = AppDataService.PAGE_CONTEXT.prospectDashboard;
    this.displayFavToggle = this.permissionService.permissions.has(PermissionEnum.Favorite);
    this.breadcrumbsService.showOrHideBreadCrumbs(true);
    try {
      /*
            * Below code will check whether userInfo object is present or not in session storage.
            * If it is not present then it will call find user info method to get the user information
            * from server and then call getArchitectData.
            */
      if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
        const userInfo = JSON.parse(
          sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)
        );
        this.configService.userInfo.firstName = userInfo.firstName;
        this.configService.userInfo.lastName = userInfo.lastName;
        this.configService.userInfo.userId = userInfo.userId;
        // to laod the default 1st level sales level filter data
        this.filtersService
          .getSalesLevelFilter([], 1)
          .subscribe((response: any) => {
            this.salesLvlFilterData = response;
          });
        this.checkParam();

      } else {
        this.configService.findUserInfo();

        this.configService.userInfoObjectEmitter.subscribe((userInfo: any) => {
          // to laod the default 1st level sales level filter data
          this.filtersService
            .getSalesLevelFilter([], 1)
            .subscribe((response: any) => {
              this.salesLvlFilterData = response;
            });
          this.checkParam();
        });
      }

      this.gridOptions.onSortChanged = () => {
        this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
      };
    } catch (err) {
      // console.error(err.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(err);
    }
    this.favProspects = this.productSummaryService.viewFavorites;
    if (this.productSummaryService.viewFavorites) {
      this.showFavorite(true);
    }
    this.subscribers.paginationEmitter = this.utilitiesService.paginationEmitter.subscribe((pagination: any) => {
      this.paginationObject= pagination;
      this.pageChange();
      });

      this.checkForSfdcPunchIn();
  }

  // to check query param and load arch and customer acc.
  checkParam() {
    let loadArch;
    this.route.params.forEach((params: Params) => {
      loadArch = params['arch'];
      this.searchCustomerFromURL = params['custName'];
    });
    
    history.pushState('', '', '/prospects');
    
    this.getArchitectData(loadArch);
  }

  checkForSfdcPunchIn(){
    if(sessionStorage.getItem('sfdcPunchInDeal')){
      this.openDealLookUp();
    }
  }

  ngOnDestroy() {
    this.productSummaryService.onProductSummary = false;
    this.productSummaryService.viewFavorites = false;
     // this.utilitiesService.paginationEmitter.unsubscribe();
     if( this.subscribers.paginationEmitter){
      this.subscribers.paginationEmitter.unsubscribe();
    }
  }

  /*
     *  This method will be called on click of sorting in any  column.
    */ 
  updateRowDataOnSort(sortColObj: any) {
    const columnName = this.productSummaryService.namePersistanceColumnMap.get(
      sortColObj.colId
    );
    
    const sortObject = {
      name: columnName,
      persistanceColumn: sortColObj.colId,
      type: sortColObj.sortType
    };
    this.productSummaryService.prospectInfoObject.sort = sortObject;
    this.isSortingProspectCall = true;
    try {
      this.productSummaryService.loadProspectCall();
    } catch (error) {
      // //console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
    this.sortColumn = sortColObj.colId;
    this.productSummaryService.sortColumnname = sortColObj.colId;
    this.productSummaryService.sortOrder = sortColObj.sortType; 
  }

  getEaData() {
    this.productSummaryService.getEaData().subscribe((response: any) => {
      if (response && !response.error) {
        try {
          this.EaData = response;
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.EaData);
            this.gridOptions.api.sizeColumnsToFit();
          }
        } catch (error) {
          // console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  getArchitectData(architectureName?, path?, active?) {
    this.configService.pageContext = AppDataService.PAGE_CONTEXT.prospectDashboard;
    if (active !== undefined && active === false) {
      return;
    }
    this.searchInput = '';
    this.searchInputResult = false;
    this.blockUiService.spinnerConfig.startChain();
    this.productSummaryService
      .loadArchitecturesData()
      .subscribe((response: any) => {
        if (response && !response.error) {
          try {
            this.architectData = new Array<ArchitectureInfoJson[]>();
            let architectureArray: ArchitectureInfoJson[];
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].name === 'ALL') {
                this.architectureName = response.data[i].name;
                this.configService.architectureMetaDataObject = response.data;
                const sessionObject: SessionData = this.configService.getSessionObject();
                sessionObject.architectureMetaDataObject = response.data;
                this.configService.setSessionObject(sessionObject);
                this.selectedNoOfCustomer = response.data[i].customerCount;
                this.selectedTcvAmount = this.configService.prettifyNumber(
                  response.data[i].tcv
                );
              }
              const architecture = response.data[i];
              const architect: ArchitectureInfoJson = <ArchitectureInfoJson>{};
              architect.architectureName = architecture.name;
              architect.displayName = architecture.displayName;
              architect.noOfCustomer = architecture.customerCount;
              architect.selected = architecture.selected;
              architect.tcvAmount = architecture.tcv;
              architect.active = architecture.active;
              if (architecture.name === 'ALL') {
                this.productSummaryService.prospectInfoObject.architecture =
                  this.architectureName;
                const archMetaData = this.configService.getDetailsMetaData('DASHBOARD');
                this.prepareArchitectureMetaData(archMetaData.columns, archMetaData.sort);
                this.productSummaryService.prospectInfoObject.sort = archMetaData.sort;
                this.productSummaryService.prospectInfoObject.page = this.configService.defaultPageObject;
                const sessionProspectInfoObject = {
                  architecture: architecture.name,
                  sort: archMetaData.sort,
                  page: this.configService.defaultPageObject
                };
                sessionStorage.setItem(
                  AppDataService.PROSPECT_INFO_OBJECT,
                  JSON.stringify(sessionProspectInfoObject)
                );
                this.productSummaryService.isSearchByCustomer = false;
                if (this.searchCustomerFromURL) {
                  this.searchInput = this.searchCustomerFromURL;
                  this.onQuickFilterChanged('GU');
                } else {
                  if (!this.globalView) {
                    this.productSummaryService.loadProspectCall('Sales_account_view');
                  } else {
                    this.productSummaryService.loadProspectCall();
                  }
                }
              }
              if (!AppDataService.architecture_IMAGE_MAP[architecture.name]) {
                architect.customClass = AppDataService.DEFAULT_IMAGE;
              } else {
                architect.customClass =
                  AppDataService.architecture_IMAGE_MAP[architecture.name];
              }
              architect.id = i + 1;
              if (i % AppDataService.CASOUSEL_SLIDE_SIZE === 0) {
                architectureArray = [];
                this.architectData.push(architectureArray);
              }
              architectureArray.push(architect);
            }
            if (this.showFavoriteGrid) {
              this.showFavoriteAPICall();
            }
            setTimeout(() => {
              this.utilitiesService.setTableHeight();
            });
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.productSummaryService.prospectInfoObject.page.pageSize = newPageSize;
    this.productSummaryService.prospectInfoObject.page.currentPage = 1;
    try {
      this.productSummaryService.loadProspectCall();
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  pageChange() {
    this.productSummaryService.prospectInfoObject.page.currentPage = this.paginationObject.page;
    this.productSummaryService.prospectInfoObject.page.pageSize = this.paginationObject.pageSize;
    try {
      this.productSummaryService.loadProspectCall();
    } catch (error) {
      // console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  onResize(event) {
    this.utilitiesService.setTableHeight();
  }

  prepareArchitectureMetaData(architectureMetaData: any, sortObj: any) {
    this.columnDefs = [];
    // empty filter map and array in case of different tile data load
    this.filtersService.selectedFilterMap = new Map<string, SelectedFilterJson>();
    this.filtersService.groupObjMap = new Map<string, GroupObj>();
    this.filtersService.defaultFilters = [];
    this.filtersService.filterAppliedCount = 0;
    this.filtersService.filtersAppliedMap.clear();
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;
    firstColumn.getQuickFilterText = function (params) {
      return null;
    };
    // this.columnDefs.push(firstColumn);   this is commented as we don't need empty row in the grid.

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
        /*Meta data contains column size, get column width from meta data and assign it to respective column*/
        coloumnDef.width = this.configService.assignColumnWidth(
          coloumnData.columnSize
        );
      }
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.name;
        this.coloumnObject.set(coloumnData.name, coloumnDef);
        this.columnHeaderList.push(coloumnDef.headerName);
        coloumnDef.headerClass = this.headerClassRender.bind(this);
        coloumnDef.headerComponentFramework = <{ new(): HeaderRendererComponent }>(
          HeaderRendererComponent),
        coloumnDef.unSortIcon = true;

        if (coloumnData.name === 'customerName') {
          coloumnDef.width = 216;
          coloumnDef.pinned = true;
          coloumnDef.cellClass = this.customerCellClassRender.bind(this);
          coloumnDef.cellRenderer = this.customRenderer;
          coloumnDef.field = coloumnData.persistanceColumn;
          this.columnDefs.push(coloumnDef);
          const blankColumn = ArchitectureMetaDataFactory.getEmptyColoumn();
          blankColumn.field = 'flagged';
          blankColumn.filter = 'number';
          blankColumn.getQuickFilterText = function (params) {
            return null;
          };
          blankColumn.cellRenderer = this.customerCellRendererFlag;
          blankColumn.headerClass = this.flagClassRender.bind(this);
          blankColumn.cellClass = this.flagClassRender.bind(this);
          this.columnDefs.push(blankColumn);
          // const blankColumn1 = ArchitectureMetaDataFactory.getEmptyColoumn();
          // blankColumn1.field = 'actionIcon';
          // blankColumn1.getQuickFilterText = function(params) {
          //   return null;
          // };
          // if(this.productSummaryService.prospectInfoObject.architecture === this.constantsService.SECURITY){
          //   blankColumn1.cellRenderer = this.actionCellRendererSec;
          // } else {
          //   blankColumn1.cellRenderer = this.actionCellRenderer;
          // }
          // this.columnDefs.push(blankColumn1);
          coloumnDef.suppressMenu = true;
          coloumnDef.suppressSorting = true;
          if (sortObj.name === 'customerName') {
            coloumnDef.sort = sortObj.type;
          }
        } else if (coloumnData.name === 'customerId') {
          coloumnDef.field = coloumnData.persistanceColumn;
          this.columnDefs.push(coloumnDef);
          coloumnDef.hide = true;
        } else if (coloumnData.hideColumn !== 'Y') {
          // if (coloumnData.name === 'topPartnerName') {
          //   coloumnDef.cellClass = 'text-link';
          //   coloumnDef.width = 345;
          // } else if (coloumnData.name === 'partnerInfo') {
          //   coloumnDef.cellClass = 'text-link';
          //   coloumnDef.width = 68;
          // } else 
          if (coloumnData.persistanceColumn === 'TCV_EA') {
            coloumnDef.width = 92;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else if (coloumnData.persistanceColumn === 'TCV_DNA') {
            coloumnDef.width = 107;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else if (coloumnData.persistanceColumn === 'TCV_DC') {
            coloumnDef.width = 122;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else if (coloumnData.persistanceColumn === 'TCV_SEC') {
            coloumnDef.width = 135;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else if (coloumnData.persistanceColumn === 'SWSS_RENEWAL_OPTY') {
            coloumnDef.width = 100;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else if (coloumnData.persistanceColumn === 'SNTC_RENEWAL_OPTY') {
            coloumnDef.width = 104;
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          }else if (coloumnData.persistanceColumn === 'TCV_EA') {
            coloumnDef.cellClass = this.cellClassRender.bind(this);
          } else {
            coloumnDef.cellClass = 'dollar-align';
          }
          if (coloumnDef.field !== 'topPartnerName') {
            coloumnDef.cellRenderer = 'noDecimalNumberFormat';
          }


          if (coloumnData.columnUnit === '%' && coloumnData.cellRenderer !== 'percentageCellRenderer') {
            coloumnDef.cellRenderer = 'currencyFormat';
          } else if (coloumnData.columnUnit === '%' && coloumnData.cellRenderer === 'percentageCellRenderer') {
            coloumnDef.cellRenderer = coloumnData.cellRenderer;
          }

          coloumnDef.getQuickFilterText = 'filterText';
          coloumnDef.field = coloumnData.persistanceColumn;
          if (coloumnDef.field === 'LDOS_PERCENTAGE' || coloumnDef.field === 'SERVICE_COVERAGE_PERCENTAGE') {
            coloumnDef.width = 200;
            coloumnDef.cellRenderer = 'percentageCellRenderer';
          }
          this.columnDefs.push(coloumnDef);
        }
        // if (sortObj.name === coloumnData.name) {
        // coloumnDef.sort = sortObj.type;
        // }
        if (coloumnData.excludeFilter === 'N') {
          if (!this.filtersService.selectedFilterMap.has(coloumnData.name)) {
            this.filtersService.setSelectedFilter(
              coloumnData,
              this.salesLvlFilterData
            );
          }
        }
      }
      if (coloumnDef.cellRenderer === 'architectureCellRenderer') {
        coloumnDef.cellRenderer = function (params) {
          return thisInstance.architectureCellRenderer(params, thisInstance);
        };
      } else if (coloumnDef.cellRenderer === 'customerCellRendererFlag') {
        coloumnDef.cellRenderer = this.customerCellRendererFlag;
      } else if (coloumnDef.cellRenderer === 'actionCellRenderer') {
        coloumnDef.cellRenderer = this.actionCellRenderer;
      } else if (coloumnDef.cellRenderer === 'actionCellRendererSec') {
        coloumnDef.cellRenderer = this.actionCellRendererSec;
      } else if (coloumnDef.cellRenderer === 'nodeRenderer') {
        coloumnDef.cellRenderer = this.nodeRenderer;
      } else if (coloumnDef.cellRenderer === 'currencyFormat') {
        coloumnDef.cellRenderer = function (params) {
          return thisInstance.currencyFormat(params, thisInstance);
        };
      } else if (coloumnDef.cellRenderer === 'noDecimalNumberFormat') {
        coloumnDef.cellRenderer = function (params) {
          return thisInstance.noDecimalNumberFormat(params, thisInstance);
        };
      }
      if (coloumnDef.cellClass === 'statusRenderer') {
        coloumnDef.cellClass = this.statusRenderer;
      }
      if (coloumnDef.getQuickFilterText === 'filterText') {
        coloumnDef.getQuickFilterText = function (params) {
          return null;
        };
      }
    }
  }

  onSort(event){
    const sortState = this.gridOptions.api.getSortModel();
    this.sortColumn = sortState[0].colId;
    this.headerClassRender(event);
  }


  headerClassRender(params) {
    if (params.colDef && params.colDef.field === this.sortColumn) {
      return 'sorted-cell';
    }
  }

  flagClassRender(params) {
    if (this.sortColumn === 'END_CUSTOMER_CR_GU_NAME') {
      return 'sorted-cell';
    }
  } 

  cellClassRender(params) {
    if (params.colDef && params.colDef.field === this.sortColumn) {
      return 'sorted-cell dollar-align';
    } else {
      return 'dollar-align';
    }
  }

  customerCellClassRender(params) {
    if (params.colDef && params.colDef.field === this.sortColumn) {
      return 'sorted-cell customer-popup';
    } else {
      return 'customer-popup';
    }
  }

  prepareFavoriteMetaData(architectureMetaData: any) {
    this.favoriteColumnDefs = [];
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;
    firstColumn.getQuickFilterText = function (params) {
      return null;
    };
    // this.favoriteColumnDefs.push(firstColumn); this is commented as we don't need empty row in the grid
    this.columnHeaderList = [];
    const thisInstance = this;
    for (let i = 0; i < architectureMetaData.length; i++) {
      const coloumnData = architectureMetaData[i];
      this.productSummaryService.namePersistanceColumnMap.set(
        coloumnData.persistanceColumn,
        coloumnData.name
      );
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.name;
        this.coloumnObject.set(coloumnData.name, coloumnDef);
        this.columnHeaderList.push(coloumnDef.headerName);
        if (coloumnData.name === 'customerName') {
          coloumnDef.width = 400;
          coloumnDef.pinned = true;
          coloumnDef.field = coloumnData.persistanceColumn;
          this.favoriteColumnDefs.push(coloumnDef);
          const blankColumn = ArchitectureMetaDataFactory.getEmptyColoumn();
          blankColumn.field = 'flagged';
          blankColumn.filter = 'number';
          blankColumn.getQuickFilterText = function (params) {
            return null;
          };
          blankColumn.cellRenderer = this.customerCellRendererFlag;
          this.favoriteColumnDefs.push(blankColumn);
          const blankColumnActionIcon = ArchitectureMetaDataFactory.getEmptyColoumn();
          blankColumnActionIcon.field = 'actionIcon';
          blankColumnActionIcon.getQuickFilterText = function (params) {
            return null;
          };
          if (this.productSummaryService.prospectInfoObject.architecture === this.constantsService.SECURITY) {
            blankColumnActionIcon.cellRenderer = this.actionCellRendererSec;
          } else {
            blankColumnActionIcon.cellRenderer = this.actionCellRenderer;
          }
          this.favoriteColumnDefs.push(blankColumnActionIcon);
        } else if (coloumnData.name === 'customerId') {
          coloumnDef.field = coloumnData.persistanceColumn;
          this.favoriteColumnDefs.push(coloumnDef);
          coloumnDef.hide = true;
        } else if (coloumnData.name === 'status') {
          coloumnDef.width = 200;
          coloumnDef.cellClass = 'statusRenderer';
          coloumnDef.getQuickFilterText = 'filterText';
          coloumnDef.pinned = true;
        }
      }
    }
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

  globalSwitchChange(checked) {
    this.globalView = checked;
    if (checked) {
      this.productSummaryService.loadProspectCall();
    } else {
      this.productSummaryService.loadProspectCall('Sales_account_view');
    }
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  noDecimalNumberFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatWithNoDecimal(params.value);
  }

  statusRenderer(params) {
    if (params.value === 'Qualified' || params.value === 'Agreement Signed') {
      return 'status-qualified';
    } else if (params.value === 'Prospect Identified') {
      return 'status-prospect-identied';
    } else {
      return 'status-prospect-identied';
    }
  }

  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '' + (parseInt($event.rowIndex) + 1);
  }

  customerCellRendererFlag(params) {
    const flagged = params.data && params.data.flagged ? 'selected' : '';
    const flaggedCheck = params.data && params.data.flagged ? '-checked' : '';
    let flag =
      `
        <div class="tooltip-custom">
        <span class='iconFlagWrap ` +
      flagged +
      `'><i class='icon-flag` +
      flaggedCheck +
      `'></i>
        `;
    if (flagged) {
      flag += `
        <span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Remove Prospects from favorites.</span>
        `;
    } else {
      flag += `
            <span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Add Prospects to favorites.</span>
            `;
    }

    flag += `
        </span></div>
        `;
    return flag;
  }

  public onModelUpdated() {
    // console.log('onModelUpdated');
    this.calculateRowCount();
  }

  public onReady() {
    // console.log('onReady');
    this.calculateRowCount();
  }

  public onFavoriteReady() {
    // this.calculateRowCount();
    this.favoriteGridOptions.api.sizeColumnsToFit();
  }

  actionCellRenderer(params) {
    // tslint:disable-next-line:max-line-length
    const actionDrop =
      "<div class='shareDiv'><span class='icon-more-link'></span><div class='dropdown-menu' aria-labelledby='mainDropdown'><ul><li><a class='dropdown-item summaryView' href='javascript:void(0)'>View Prospect Details</a></li><li><a class='dropdown-item MVP2qualification' href='javascript:void(0)'>Start Qualification</a></li><li><a class='dropdown-item ib-summary' href='javascript:void(0)'>View IB summary</a></li></ul></div></div>";
    return '<span class="text-link">' + actionDrop + '</span>';
  }

  actionCellRendererSec(params) {
    const actionDrop =
      "<div class='shareDiv'><span class='icon-more-link'></span><div class='dropdown-menu' aria-labelledby='mainDropdown'><ul><li><a class='dropdown-item summaryView' href='javascript:void(0)'>View Prospect Details</a></li><li><a class='dropdown-item MVP2qualification' href='javascript:void(0)'>Start Qualification</a></li><li><a class='dropdown-item ib-summary' href='javascript:void(0)'>View Booking Summary</a></li></ul></div></div>";
    return actionDrop;
  }

  architectureCellRenderer(params, thisInstance) {
    let art = `<div class=\'shareDiv tree-flyout\'><span class='icon-tree'>
                <span class='path1'></span><span class='path2'></span>
                </span></div>`;

    if (this.checkSecurity) {
      // tslint:disable-next-line:max-line-length
      art = `<div class=\'shareDiv tree-flyout\'><span class='icon-tree'><span class='path1'></span><span class='path2'></span><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li class=\'text\'><p class=\'dropdown-item summaryView\'>2 other Architecture found for this prospect.</p></li><li><a class=\'dropdown-item summaryView\' href=\'javascript:void(0)\'><span class="icon-security"></span>Cisco One</a></li><li><a class=\'dropdown-item pricing\' href=\'javascript:void(0)\'><span class="icon-collaboration"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>
                  </span>Collaboration</a></li></ul></div>
                </span></div>`;
    } else if (this.checkCisco) {
      // tslint:disable-next-line:max-line-length
      art = `<div class=\'shareDiv tree-flyout\'><span class='icon-tree'><span class='path1'></span><span class='path2'></span><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li class=\'text\'><p class=\'dropdown-item summaryView\'>2 other Architecture found for this prospect.</p></li><li><a class=\'dropdown-item summaryView\' href=\'javascript:void(0)\'><span class="icon-security"></span>Security</a></li><li><a class=\'dropdown-item pricing\' href=\'javascript:void(0)\'><span class="icon-collaboration"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>
               </span>Collaboration</a></li></ul></div>
             </span></div>`;
    } else if (this.checkCollaboration) {
      // tslint:disable-next-line:max-line-length
      art = `<div class=\'shareDiv tree-flyout\'><span class='icon-tree'><span class='path1'></span><span class='path2'></span><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li class=\'text\'><p class=\'dropdown-item summaryView\'>2 other Architecture found for this prospect.</p></li><li><a class=\'dropdown-item summaryView\' href=\'javascript:void(0)\'><span class="icon-security"></span>Cisco One</a></li><li><a class=\'dropdown-item pricing\' href=\'javascript:void(0)\'><span class="icon-collaboration"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span>
              </span>Security</a></li></ul></div>
            </span></div>`;
    }
    return art;
  }


  public onFavoriteCellClicked($event) {
    // console.log('onCellClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
    this.configService.customerID = $event.data.CUSTOMER_ID;
    if ($event.colDef.field === 'actionIcon') {
      const dropdownClass = $event.event.target.classList.value;
      const isSummaryView = dropdownClass.search('summaryView');
      if (isSummaryView > -1) {
        if ($event.data.flagged == null) {
          $event.data.flagged = 0;
        }
        this.router.navigate([
          '/prospect-details',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
            favorite: $event.data.flagged
          }
        ]);
      }

      const isIbsummaryView = dropdownClass.search('ib-summary');
      if (isIbsummaryView > -1) {
        if ($event.data.flagged == null) {
          $event.data.flagged = 0;
        }
        this.router.navigate([
          '/ib-summary',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
            favorite: $event.data.flagged
          }
        ]);
      }
      const isQualification = dropdownClass.search('MVP2qualification');
      if (isQualification > -1) {
        //  this.configService.redirectForCreateQualification().subscribe((response: any) => {
        // console.log(response);
        //  if (response && response.value === 'N') {
        this.router.navigate([
          '../qualifications',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: $event.data.END_CUSTOMER_CR_GU_NAME,
            customerId: $event.data.CUSTOMER_ID
          }
        ]);
      }

      const qualificationMVP1 = dropdownClass.search('MVP1qualification');
      if (qualificationMVP1 > -1) {
        this.configService
          .redirectForCreateQualification()
          .subscribe((response: any) => {


            let customerName = encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME);
            customerName = customerName.replace(/['()]/g, escape);
            const customerStr = ';GUName=' + customerName + ';hierlvl=GU';
            this.productSummaryService.getUrlToNavigate(customerStr);
            //  }
          });
      }
    } else if ($event.colDef.field === 'flagged') {
      $event.data.flagged = $event.data.flagged ? 0 : 1;
      // this.gridOptions.api.redrawRows({ rowNodes: [$event.node] });
      this.favoriteGridOptions.api.redrawRows({ rowNodes: [$event.node] });
      let customerId = $event.data.CUSTOMER_ID;
      if ($event.data.flagged) {
        this.productSummaryService
          .addFavorite(customerId)
          .subscribe((res: any) => {
            if (!res.error) {
              // this.favoriteCount += 1;
            } else {  // increase favorite count by 1
              this.messageService.displayMessagesFromResponse(res);
            }
          });
      } else {
        this.productSummaryService
          .removeFavorite(customerId, this.architectureName)
          .subscribe((res: any) => {
            if (!res.error) {
              // this.favoriteCount -= 1; // decrease favorite count by 1
              this.showFavoriteGrid = !this.showFavoriteGrid; // Toggle flag as we will be on same page
              this.showFavorite(false); // This method is callled as we need to refresh favorite grid data.
            } else {
              this.messageService.displayMessagesFromResponse(res);
            }
          });
      }
    } else if ($event.colDef.field === 'END_CUSTOMER_CR_GU_NAME') {
      // console.log($event);
      this.configService.isFavorite = $event.data.flagged === 1 ? 1 : 0;
      this.router.navigate([
        '../qualifications',
        {
          architecture: this.productSummaryService.prospectInfoObject
            .architecture,
          customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
          customerId: $event.data.CUSTOMER_ID
        }
      ]);
    }
  }

  customRenderer(params) {
    let flag = '';
    // Check if the customer is a green field customer or not
    if (params && params.data && params.data.GREENFIELD_YORN && params.data.GREENFIELD_YORN === 'Y') {
      // if customer is a green field customer show 'NEW' flag on ui grid
      flag = '<span class="cu-name text-link cu-width-160">' + params.value + '</span><span class="green-field">New</span>'
        + `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${params.value}</span>
      </div>`;
    } else {
      // if customer is not a green field customer don't show "NEW" flag on ui grid
      flag = '<span class="cu-name text-link">' + params.value + '</span>'
        + `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${params.value}</span>
      </div>`;
    }

    return flag;
  }

  public onCellClicked($event) {
    // if ($event.colDef.field === 'NUMBER_OF_PARTNERS') {
    //   if (!$event.data.CUSTOMER_ID || !$event.data.CUSTOMER_NAME || !(+$event.data.NUMBER_OF_PARTNERS)) {
    //     return;
    //   } else {
    //     this.selectedCustomerDetails.customerId = $event.data.CUSTOMER_ID;
    //     this.selectedCustomerDetails.customerName = $event.data.CUSTOMER_NAME;
    //   }
    //   this.partnerBookingService.showPartnerBooking = true;
    // } else if ($event.colDef.field === 'TOP_PARTNER_NAME') {
    //   if (!$event.data.CUSTOMER_ID || !$event.data.CUSTOMER_NAME || !$event.data.TOP_PARTNER_KEY) {
    //     return;
    //   } else {
    //     this.selectedCustomerDetails.customerId = $event.data.CUSTOMER_ID;
    //     this.selectedCustomerDetails.customerName = $event.data.CUSTOMER_NAME;
    //     this.selectedPartnerDetails.partnerId = $event.data.TOP_PARTNER_KEY;
    //     this.selectedPartnerDetails.partnerName = $event.data.TOP_PARTNER_NAME;
    //   }
    //   this.productSummaryService.architectureBreakdown = true;
    // } 
    
      // Check if the customer is greenfield(new) customer
      if (($event.data && !$event.data.CUSTOMER_ID) || ($event.data && $event.data.CUSTOMER_ID && $event.data.CUSTOMER_ID <= 0)) {
        // Call saveGreenfieldProspect service to store the new customer into EA registry from CR registry
        this.productSummaryService.saveGreenfieldProspect($event.data.END_CUSTOMER_CR_GU_NAME).subscribe((response: any) => {
          if (response && !response.error) {
            if (response.prospectKey && response.prospectKey > 0) {
              // Set customerId for the new customers
              $event.data.customerId = response.prospectKey;
              $event.data.CUSTOMER_ID = response.prospectKey;
              // Call executeEvent to run specific event
              this.executeEvent($event);
            }
          }  else {
            this.messageService.displayMessagesFromResponse(response);
          }
        });
      } else { // if existing customer
        // Call executeEvent to run specific event
        this.executeEvent($event);
      }
  }

  // Executes the specific event
  executeEvent($event) {
    this.configService.customerID = $event.data.CUSTOMER_ID;
    if ($event.colDef.field === 'actionIcon') {
      const dropdownClass = $event.event.target.classList.value;
      const isSummaryView = dropdownClass.search('summaryView');
      if (isSummaryView > -1) {
        if ($event.data.flagged == null) {
          $event.data.flagged = 0;
        }
        this.router.navigate([
          '../prospect-details',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
            favorite: $event.data.flagged
          }
        ]);
      }
      let isIbsummaryView = dropdownClass.search('ib-summary');
      if (isIbsummaryView > -1) {
        if ($event.data.flagged == null) {
          $event.data.flagged = 0;
        }
        this.router.navigate([
          '../ib-summary',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
            favorite: $event.data.flagged
          }
        ]);
      }
      const isQualification = dropdownClass.search('MVP2qualification');
      if (isQualification > -1) {

        //  this.configService.redirectForCreateQualification().subscribe((response: any) => {
        // console.log(response);
        //  if (response && response.value === 'N') {
        this.router.navigate([
          '../qualifications',
          {
            architecture: this.productSummaryService.prospectInfoObject
              .architecture,
            customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
            customerId: $event.data.CUSTOMER_ID
          }
        ]);

      }

      const qualificationMVP1 = dropdownClass.search('MVP1qualification');
      if (qualificationMVP1 > -1) {
        this.configService
          .redirectForCreateQualification()
          .subscribe((response: any) => {
            console.log(response);
            // if (response && response.value === 'N') {
            //     this.router.navigate(['../qualifications'
            //     , {
            //         architecture: this.productSummaryService.prospectInfoObject.architecture
            //         , customername: $event.data.customerName
            //         , customerId: $event.data.customerId
            //     }
            // ]);
            // }
            // else {
            let customerName = encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME);
            customerName = customerName.replace(/['()]/g, escape);
            const customerStr = ';GUName=' + customerName + ';hierlvl=GU';
            this.productSummaryService.getUrlToNavigate(customerStr);
            //  }
          });
      }
    } else if ($event.colDef.field === 'flagged') {
      this.bounced = true;
      setTimeout(() => {
        this.bounced = false;
      }, 2000);
      $event.data.flagged = $event.data.flagged ? 0 : 1;
      this.gridOptions.api.redrawRows({ rowNodes: [$event.node] });
      if ($event.data.flagged) {
        this.productSummaryService
          .addFavorite($event.data.CUSTOMER_ID)
          .subscribe((res: any) => {
            if (!res.error) {
              // this.favoriteCount += 1;
            } else { // increase favorite count by 1
              this.messageService.displayMessagesFromResponse(res);
            }
          });
      } else {
        this.productSummaryService
          .removeFavorite($event.data.CUSTOMER_ID, this.architectureName)
          .subscribe((res: any) => {
            if (!res.error) {
              // this.favoriteCount -= 1;
            }   else { // decrease favorite count by 1
              this.messageService.displayMessagesFromResponse(res);
            }
          });
      }
    } else if ($event.colDef.field === 'END_CUSTOMER_CR_GU_NAME') {
      this.configService.isFavorite = $event.data.flagged === 1 ? 1 : 0;
      // console.log(this.configService.isFavorite);
      
      this.configService.customerName = $event.data.END_CUSTOMER_CR_GU_NAME;
      this.router.navigate([
        '../allArchitectureView',
        {
          architecture: encodeURIComponent(this.productSummaryService.prospectInfoObject
            .architecture),
          customername: encodeURIComponent($event.data.END_CUSTOMER_CR_GU_NAME),
          customerId: encodeURIComponent($event.data.CUSTOMER_ID)
        }
      ]);
    }
  }

  updateFavoriteFlagCount() {
    this.flagCount = 0;
    const thisInstance = this;
    if (!this.gridOptions.api) {
      return;
    }
    this.favoriteGridOptions.api.forEachNode(function (rowNode) {
      if (rowNode.data && rowNode.data.flagged) {
        thisInstance.flagCount++;
        thisInstance.taskList = rowNode.data;
      }
    });
  }

  toggleFlaggedRows(flagVal) {
    this.bounced = true;
    setTimeout(() => {
      this.bounced = false;
    }, 2000);
    this.flagged = flagVal;
    if (this.flagged) {
      const countryFilterComponent = this.gridOptions.api.getFilterInstance(
        'flagged'
      );
      countryFilterComponent.setModel({
        type: 'equals',
        filter: 1,
        filterTo: null
      });
      this.gridOptions.api.onFilterChanged();
    } else {
      this.gridOptions.api.destroyFilter('flagged');
    }
  }

  downloadTask() {
    const params = {
      fileName: 'ea-prospect',
      columnSeparator: ';'
    };

    this.gridOptions.api.exportDataAsCsv(params);
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
    console.log('onBeforeSortChanged');
  }

  public onAfterSortChanged() {
    console.log('onAfterSortChanged');
  }

  public onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  public onRowClicked($event) {
    // console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged(viewType) {
    this.searchCustomerFromURL = '';
    if (this.searchInput && this.searchInput !== '') {
      if (!viewType) {
        viewType = 'GU';
      }
      this.productSummaryService.isSearchByCustomer = true;
      this.productSummaryService.prospectInfoObject.page = this.configService.defaultPageObject;
      this.productSummaryService.viewType = viewType;
      this.productSummaryService.searchInput = this.searchInput;
      
      this.productSummaryService.loadProspectCall();
    } else {
      this.clearInput();
    }

    // this.gridOptions.api.setQuickFilter(this.searchInput);
  }

  clearInput() {
    this.searchInput = '';
    this.productSummaryService.prospectInfoObject.page = this.configService.defaultPageObject;
    this.searchInputResult = false;
    this.productSummaryService.isSearchByCustomer = false;
    
    this.productSummaryService.loadProspectCall();
  }

  openViewAppliedFiltersModal() {
    const modalRef = this.modalVar.open(ViewAppliedFiltersComponent, {
      windowClass: 'applied-filters-modal'
    });
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  public onColumnEvent($event) {
    // console.log('onColumnEvent: ' + $event);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  prettifyNumber(value: number) {
    if (value || value === 0) {
      return this.configService.prettifyNumber(value);
    } else {
      return '';
    }
  }

  showFavorite(displayFavoriteGrid: boolean) {
    this.showGrid = true;
    if (displayFavoriteGrid) {
      this.configService.pageContext = AppDataService.PAGE_CONTEXT.userFavorites;
      this.sortColumn = '';
      this.gridOptions.api.setColumnDefs(this.columnDefs);
    } else {
      this.configService.pageContext = AppDataService.PAGE_CONTEXT.prospectDashboard;
    }
    this.searchInputResult = false;
    this.searchInput = '';
    this.showFavoriteGrid = !this.showFavoriteGrid;


    if (!this.showFavoriteGrid) {
      this.configService.subHeaderData.custName = 'My Prospects';
      this.sortColumn = this.productSummaryService.prospectInfoObject.sort.persistanceColumn;
      this.gridOptions.api.setColumnDefs(this.columnDefs);
      if (!this.globalView) {
        this.productSummaryService.loadProspectCall('Sales_account_view');
      } else {
        this.productSummaryService.loadProspectCall();
      }
      return;
    }

    /*Check if favorite count is zero */
    // if (this.favoriteCount === 0) {
    //   return;
    // }
    this.configService.subHeaderData.custName = 'My Favorite Prospects';
    this.showFavoriteAPICall();
  }

  private prepareFavRow(favRow, prosCount) {
    const rowData = {
      'prospectid': prosCount,
      'customerName': undefined,
      'flagged': 1,
      'CUSTOMER_ID': favRow.customerId,
      'END_CUSTOMER_CR_GU_NAME': favRow.customerName,
      'TCV_EA': favRow.tcvAmount,
      'TCV_DC': favRow.tcvDcAmount,
      'TCV_DNA': favRow.tcvDnaAmount,
      'TCV_SEC': favRow.tcvSecAmount,
      'SNTC_RENEWAL_OPTY': favRow.sntcRenewalOpty,
      'SWSS_RENEWAL_OPTY': favRow.swssRenewalOpty,
      'NUMBER_OF_PARTNERS': favRow.numberOfPartners,
      'TOP_PARTNER_KEY': favRow.topPartnerKey,
      'TOP_PARTNER_NAME': favRow.topPartnerName,
      'LDOS_PERCENTAGE': favRow.ldosPercentage,
      'SERVICE_COVERAGE_PERCENTAGE': favRow.serviceCoveragePercentage,
      'GREENFIELD_YORN': favRow.greenfieldYorn,
      'customerId': undefined
    };


    return rowData;
  }




  showFavoriteAPICall() {
    this.productSummaryService.getFavorite().subscribe((res: any) => {
      this.favoriteRowData = [];
      this.productSummaryService.viewFavorites = true;
      // this.sortColumn = '';
      // this.productSummaryService.sortColumnname = '';
      // this.productSummaryService.sortOrder = ''; 
      if (!res.data) {
        this.favoriteCount = 0;
      } else {
        this.favoriteCount = res.data.length;
      }
      if (res && !res.error && res.data) {
        try {
          const data = res.data;
          const favData = new Array();

          for (let i = 0; i < data.length; i++) {
            const favRow = data[i];
            favData.push(this.prepareFavRow(favRow, i));
          }
          this.rowData = favData;
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(favData);
            this.gridOptions.api.sizeColumnsToFit();
          }
        } catch (error) {
          // console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.showGrid = false;
        this.messageService.displayMessagesFromResponse(res);
      }
      setTimeout(() => {
        this.utilitiesService.setTableHeight();
      });
    });
  }


  focusSearchInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }
  openDealLookUp() {
    const modalRef = this.modalVar.open(DealIdLookupComponent, {
      windowClass: 'lookup-deal',backdrop : 'static',  keyboard: false
    });
  }

  selectView(val) {
    if (this.selectedAccountView !== val) {
      this.productSummaryService.loadProspectCall(val);
    }
    this.selectedAccountView = val;
    this.viewAccountDrop = false;

  }

  onClickedOutside(event) {
    this.viewAccountDrop = false;
  }


  getLabelForFavoriteGrid() {
    if (this.globalView) {
      return 'Show My Prospects';
    } else {
      return 'Sales Account View';
    }
  }


}

// Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
  let asString = num + '';
  while (asString.length < totalStringSize) {
    asString = '0' + asString;
  }
  return asString;
}

export interface ArchitectureInfoJson {
  architectureName: string;
  displayName: string;
  selected: boolean;
  noOfCustomer: number;
  tcvAmount: number;
  customClass: string;
  id: number;
  active: boolean;
}

export interface ArchitectureMetaDataJson {
  headerName: string;
  field?: string;
  filter?: string;
  width?: number;
  minWidth?: number;
  cellClass?: any;
  cellRenderer?: any;
  suppressMenu?: boolean;
  suppressSorting?: boolean;
  suppressSizeToFit?: boolean;
  pinned?: boolean;
  unSortIcon?: boolean;
  suppressToolPanel?: boolean;
  suppressMovable?: boolean;
  suppressResize?: boolean;
  getQuickFilterText?: any;
  filterParams?: any;
  sort?: string;
  hide?: boolean;
  headerClass?: string;
  children?: Array<any>;
  columnGroupShow?: any;
  lockPosition?: boolean;
  showRowGroup?: boolean;
  cellRendererParams?: any;
  valueFormatter?: any;
  checkboxSelection?: any;
  headerCheckboxSelectionFilteredOnly?: boolean;
  decimalExpr?: number;
  suppressFilter?: boolean;
  headerComponentFramework?: any;
}

export interface PaginationObject {
  collectionSize?: number;
  page: number;
  pageSize: number;
}

export class ArchitectureMetaDataFactory {
  static readonly MIN_WIDTH = { SMALL_MIN_WIDTH: 30, BIG_MIN_WIDTH: 60 };
  // static readyOnly WIDTHS = {'EMPTY_COLOUMN_WIDTH':30};

  static getFirstColoumn(): ArchitectureMetaDataJson {
    const firstColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      suppressSorting: true,
      field: 'prospectid',
      suppressMenu: true,
      pinned: true,
      suppressToolPanel: true,
      suppressMovable: true,
      suppressResize: true,
      width: 50,
      minWidth: 30,
      cellRenderer: 'nodeRenderer',
      headerCheckboxSelectionFilteredOnly: true,
      lockPosition: true,
      getQuickFilterText: 'filterText',
      checkboxSelection: true
    };
    return firstColoumn;
  }

  static getEmptyColoumn(): ArchitectureMetaDataJson {
    const emptyColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      field: 'actionIcon',
      suppressSorting: true,
      suppressMenu: true,
      pinned: true,
      filterParams: {
        cellHeight: 20
      },
      suppressToolPanel: true,
      suppressMovable: true,
      suppressResize: true,
      width: 30,
      minWidth: 30,
      lockPosition: true,
      cellRenderer: 'actionCellRenderer',
      cellClass: 'more-dropdown',
      getQuickFilterText: 'filterText',
      suppressSizeToFit: true
    };
    return emptyColoumn;
  }

  static getDataColoumn(): ArchitectureMetaDataJson {
    const dataColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      field: 'actionIcon',
      suppressMenu: true,
      lockPosition: true,
      width: 140,
      minWidth: 60,
      checkboxSelection: false

    };
    return dataColoumn;
  }
}
