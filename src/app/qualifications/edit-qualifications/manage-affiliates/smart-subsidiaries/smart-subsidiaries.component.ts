import { PaginationObject } from '@app/all-architecture-view/all-architecture-view.service';

import { PermissionEnum } from '@app/permissions';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { element } from 'protractor';
import { Component, OnInit, ViewEncapsulation, ElementRef, Input, OnChanges, HostListener, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule } from '@angular/router';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { GridInitializationService } from '@app/shared/ag-grid/grid-initialization.service';
import { ArchitectureMetaDataFactory, ArchitectureMetaDataJson } from '@app/dashboard/product-summary/product-summary.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
// import { ProspectDetailSubsidiaryService } from '@app/prospect-details/prospect-detail-subsidiary/prospect-detail-subsidiary.service';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddAffiliatesNameComponent } from '@app/modal/add-affiliates-name/add-affiliates-name.component';
import { PermissionService } from '@app/permission.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ManageAffiliatesService,SaveSmartSubsidiaryObj } from '../manage-affiliates.service';
import { SubHeaderComponent } from '@app/shared/sub-header/sub-header.component';
import { LookupNewSubsidiariesComponent } from '@app/modal/lookup-new-subsidiaries/lookup-new-subsidiaries.component';
import { NodeColumnComponent } from '../node-column/node-column.component';
import { ColumnGridCellComponent } from '@app/shared/ag-grid/column-grid-cell/column-grid-cell.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SubsidiaryNameHeaderComponent } from '../subsidiary-name-header/subsidiary-name-header.component';

@Component({
  selector: 'app-smart-subsidiaries',
  templateUrl: './smart-subsidiaries.component.html',
  styleUrls: ['./smart-subsidiaries.component.scss']
})

export class SmartSubsidiariesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isSummaryList = false;
  @Input() dynamicId: string = null;
  @Input() selectedView = 'flat';
  @Output() continue = new EventEmitter();
  @Output() back = new EventEmitter();
  @ViewChild('advSearch', { static: true }) advSearch;

  showSummary = false;
  isSerachscenario = false;
  selectAll = false;
  roadMap: IRoadMap;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  totalNumberOfSubsidiary = 0;
  selectedNumberOfSubsidiary = 0;
  isContinueEnabled = true;
  viewContextForSaveCall = 'NAMED_SUMMARY_VIEW';
  noResultFound = false;
  mode = 0;
  opened = false;
  filter: any = {
    guId: '',
    partyId: '',
    parentId: '',
    guName: '',
    partyName: '',
    parentName: '',
    partyType: '',
    country: '',
    address1: '',
    city: '',
    country1: '',
    state: '',
    postalCode: '',
    excludeIds: '',
    excludePartyIds: '',
    excludeParentIds: '',
    excludeParentNames: ''
  };
  dataObject: any = {};
  viewdata: string;
  affiliatesData: any[];
  columnHeaderList: any[];
  components;
  subsidiaryData: any[];
  customerIdSet: any = new Set();
  clickedCustomerName: string = undefined;
  excludedHQs = [];
  excludedGUs = [];
  excludedAffiliatesSet: any = new Set();
  excludedAffiliatesSetHQ: any = new Set();
  previouslyExcludedGQ: any = new Set();
  previouslyExcludedHQ: any = new Set();
  updatedvalues: any = new Set();
  sortingObject: any;
  customerGuId;
  childrenCount: any;
  noOfChange = 0;
  public subscribers: any = {};
  isUpdatedByUser = false;
  isListUpdated = false;
  includedCountriesSet = new Set();   // Added set to  disable continue button if no subsidiaries selected
  disableAffiliates = false;
  subList = false;
  countryDetails = false;
  selectedRow = { 'countries': [] };
  popStyle = {};
  showOnTop = false;
  paginationObject: PaginationObject;
  arrowStyles: any = {};
  isAllSelectionSubsidiaryClicked = false;
  selectionOfAllSubsidiary = false;
  allColumns = [
    {
      headerName: 'Party Name',
      field: 'partyName',
      headerComponentFramework: <{ new(): SubsidiaryNameHeaderComponent }>(
        SubsidiaryNameHeaderComponent),

      suppressMenu: true,
      width: 176,
      'pinned': true,
      cellRenderer: 'gridCell',
    },
    {
      headerName: 'Node Type',
      field: 'nodeType',
      suppressMenu: true,
      width: 106,
      iconClass: 'icon-cross-arch',
      cellRenderer: 'nodeTypeCell',
      'pinned': true
    },
    {
      headerName: 'Party ID',
      field: 'partyId',
      suppressMenu: true,
      width: 136,
      'pinned': true
    },
    {
      headerName: 'Parent Name',
      field: 'parentPartyName',
      suppressMenu: true,
      cellRenderer: 'gridCell',
      width: 176,
      'pinned': true
    },
    {
      headerName: 'Parent Party ID',
      field: 'parentPartyId',
      suppressMenu: true,
      width: 136,
      'pinned': true
    },
    {
      headerName: 'Subsidiary Count',
      field: 'subsidiariesCount',
      suppressMenu: true,
      width: 100,
      'pinned': true
    },
    {
      headerName: 'Address',
      'children': [
        {
          headerName: 'Street Name',
          field: 'streetName',
          //   cellClass: 'dollar-align',
          suppressMenu: true,
          cellRenderer: 'gridCell',
          width: 169
        },
        {
          headerName: 'City',
          field: 'city',
          cellRenderer: 'gridCell',
          //  cellClass: 'dollar-align',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'Postal Code',
          field: 'postalCode',
          cellRenderer: 'gridCell',
          //  cellClass: 'dollar-align',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: 'State',
          field: 'state',
          cellRenderer: 'gridCell',
          //  cellClass: 'dollar-align',
          suppressMenu: true,
          width: 120
        },
        {
          headerName: this.localeService.getLocalizedString('common.COUNTRY'),
          field: 'country',
          cellRenderer: 'gridCell',
          //  cellClass: 'dollar-align',
          suppressMenu: true,
          width: 129
        },
      ]
    },
    {
      headerName: 'GU ID',
      field: 'guId',
      cellRenderer: 'gridCell',
      // cellClass: 'dollar-align',
      suppressMenu: true,
      width: 129
    },
    {
      headerName: 'GU Name',
      field: 'guName',
      cellRenderer: 'gridCell',
      // cellClass: 'dollar-align',
      suppressMenu: true,
      width: 129
    },
    {

      headerName: 'Vertical Market Top',
      field: 'topVerticalMarketName',
      cellRenderer: 'gridCell',
      //   cellClass: 'dollar-align',
      suppressMenu: true,
      width: 194
    },
    {
      headerName: 'Vertical Martket Sub',
      field: 'subVerticalMarketName',
      cellRenderer: 'gridCell',
      //  cellClass: 'dollar-align',
      suppressMenu: true,
      width: 188
    },
    {
      headerName: 'Vertical Market Details',
      field: 'detailVerticalMarketName',
      cellRenderer: 'gridCell',
      //  cellClass: 'dollar-align',
      suppressMenu: true,
      width: 185
    }
  ];

  summaryColumns = [
    {
      headerName: 'Subsidiary Name',
      field: 'subsidiaryName',
      suppressMenu: true,
      width: 880,
      resizable: true,
      headerComponentFramework: <{ new(): SubsidiaryNameHeaderComponent }>(
        SubsidiaryNameHeaderComponent),
      cellRenderer: 'nodeTypeCell',

    },
    {
      headerName: this.localeService.getLocalizedString('common.COUNTRY'),
      field: 'countriesCount',
      suppressMenu: true,
      cellRenderer: 'nodeTypeCell',
      width: 128,
      resizable: true
    },
    {
      headerName: 'Headquarters',
      'children': [
        {
          headerName: 'Available',
          field: 'availableCrHqCount',
          //   cellClass: 'dollar-align',
          suppressMenu: true,
          width: 109,
          resizable: true
        },
        {
          headerName: 'Selected',
          field: 'selectedCrHqCount',
          //   cellClass: 'dollar-align',
          suppressMenu: true,
          width: 109,
          resizable: true
        }
      ]
    },
    {
      headerName: 'Branches',
      'children': [
        {
          headerName: 'Available',
          field: 'availableCrBranchesCount',
          //   cellClass: 'dollar-align',
          suppressMenu: true,
          width: 109,
          resizable: true
        },
        {
          headerName: 'Selected',
          field: 'selectedCrBranchesCount',
          //  cellClass: 'dollar-align',
          suppressMenu: true,
          width: 109,
          resizable: true
        }
      ]
    }
  ];

  subsidiaryDropDown = ['All Subsidiaries', 'Global Ultimate', 'Headquarters', 'Branches'];
  partyType = [{ id: '', value: 'Party Type' }, { id: 'GU', value: 'GU' }, { id: 'HQ', value: 'HQ' }, { id: 'BR', value: 'BR' }]
  selectedPartyType = '';
  selectedSubsidary = 'All Subsidiaries';
  selectedGu: any = {};
  countryDropDown = [];
  selectedCountry = 'All Countries';
  summaryPartySearchLabel = ['Party Name', 'Party Id', 'Parent Name', 'Parent Id'];
  selectedSummarySearch = 'Party Name';
  defaultColDef;
  totalRows = 0;
  selectedRows: any[] = [];
  searchDropdown = [{ id: 'insideGU', name: 'Within My GU' }, { id: 'outsideGU', name: 'Outside My GU' }]
  placeholder = 'Search Party';
  selectedpartySearchLabel = 'Within My GU';
  subsidiaryListSearch = '';
  affiliateDetailList = [];
  selectedSubsidiaryType = 'All Subsidiary';
  searchSubsidiaryName = '';
  selectedOutsideGUCount = 0;
  partyTypes = ['Outside My GU', 'Inside My GU'];
  headerCheckBoxHanldeEmitter = new EventEmitter<boolean>();
  gridRowData = [];
  nodeSelectTooltip = false;
  isAppliedAdvancesSearchReset = false; // set if advancedSearch is reset
  excludedPartiesMap = new Map(); //
  includedPartiesMap = new Map();
  isSelectionChanged = false
  @Input() public showCleanCoreButton = false;


  @ViewChild('downloadZipLink', {static: false}) private downloadZipLink: ElementRef;
  flatViewReqPayload: any; // to set flat view advanced search req payload
 // @Input() readonlyMode = false;
  @HostListener('window:scroll', ['$event'])
  OnScroll() {
    this.hide();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.selectedView === 'summary' && this.gridOptions && this.gridOptions.api && !this.isSummaryList ) {
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  constructor(public localeService: LocaleService, public affiliatesService: ManageAffiliatesService,
    private utilitiesService: UtilitiesService, private router: Router, private messageService: MessageService
    , public appDataService: AppDataService, private modalVar: NgbModal,
    private gridInitialization: GridInitializationService, public qualService: QualificationsService,
    public permissionService: PermissionService, public constantsService: ConstantsService, public blockUiService: BlockUiService,
    configngb: NgbDropdownConfig, private elementRef: ElementRef, private toastr: ToastrService
  ) {

    const isFirstColumn = (params) => {
      return params.columnApi.getAllDisplayedColumns()[0] === params.column;
    };

    this.defaultColDef = {

      // headerCheckboxSelection: isFirstColumn,
      checkboxSelection: isFirstColumn,
    };
    configngb.placement = 'bottom-right';
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);

    this.paginationObject = { collectionSize: 50, page: 1, pageSize: 50 };

    // this.createColumnDefs();

    

    this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);

    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }

    };
    this.gridOptions.frameworkComponents = {
      nodeTypeCell: <{ new(): NodeColumnComponent }>(
        NodeColumnComponent
      ),
      gridCell: <{ new(): ColumnGridCellComponent }>(
        ColumnGridCellComponent
      )
      // countryDetailCell: <{new(): CountryDetailsComponent}>(CountryDetailsComponent),
      // subsidiaryListCell: <{new(): SubsidiaryListComponent}>(SubsidiaryListComponent),
    };
    this.gridOptions.headerHeight = 30;
    this.gridOptions.suppressContextMenu = true;
    this.gridOptions.context = {
      parentChildIstance: this
    };
  }


  changePartySearchLabel(partySearchLabel) {
    this.selectedpartySearchLabel = partySearchLabel.name;
    this.affiliatesService.searchlabel = partySearchLabel.name;
  }

  ngOnChanges(changes) {

  }

  // method to call export affiliates 
  exportDocs() {
    let advancedSearch = false;
    let reqObject = {}
    // for flat view, check if req hsa advancesearchpayload and set advanced search to true to send 
    if(this.selectedView === 'flat' && this.flatViewReqPayload && this.flatViewReqPayload.advanceSearchPayload){
      advancedSearch = true;
      // reqObject['page'] = this.flatViewReqPayload.page;
      reqObject['advanceSearchPayload'] = this.flatViewReqPayload.advanceSearchPayload;
    }
    this.affiliatesService.exportAffiliates(this.selectedView, reqObject, this.paginationObject, this.selectedpartySearchLabel, this.selectedGu,
      this.searchSubsidiaryName, this.isSerachscenario, advancedSearch).subscribe((response: any) => {
      if(response && !response.error) {
        this.generateFileName(response);
        return;
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  generateFileName(res) {
    const x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; // res.headers.get('content-disposition').substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) {
      // IE & Edge
      // msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }




  switchToggle() {
    this.columnDefs = [];
    //this.isSerachscenario = false;
    this.selectedSubsidiaryType = 'All Subsidiary';
    this.resetAdvancedSearch();
    this.resetPaginationObject();
    this.flatViewReqPayload = {}; // empty the req payload if switched
    this.isAppliedAdvancesSearchReset = false;      
    setTimeout(() => {
      if (this.selectedView === 'flat') {
        this.selectedView = 'summary';
        this.columnDefs = this.summaryColumns;       
        if(this.isSelectionChanged){
            this.saveSmartSubsidaries(null,null,true);
        } else {
            this.loadSubsidiarySummaryData();            
        }
        this.viewContextForSaveCall = 'NAMED_SUMMARY_VIEW';
      } else if (this.selectedView === 'summary') {
        this.selectedView = 'flat';
        this.columnDefs = this.allColumns;
        if (this.affiliatesService.showFlyoutView) {
          if (this.dataObject.flyoutFlatViewData) {
            this.setGridData(this.dataObject.flyoutFlatViewData);
          } else {
            this.loadFlyoutFlatViewCountries();
            this.loadFlatViewData();
          }
        } else {
          if(this.isSelectionChanged){
            this.saveSmartSubsidaries(null,null,true);
          }else {
              this.loadSubsidiaryDataForFlatView(); 
          } 
          this.viewContextForSaveCall = 'FLAT_VIEW';
        }
      }
    }, 100);
  }

  setGridData(data) {
    this.gridOptions.api.setRowData(data || []);
    // this.calcTotal();
  }

  // View dropdown feature in pagination
  onPageSizeChanged($event: any) {
    this.gridOptions.api.paginationSetPageSize(Number(this.viewdata));
  }

  getSubsidiaryData() {

    if (!this.permissionService.qualEdit) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return false; // TODO: set to true after integration
        }
      };
      this.disableAffiliates = true;
    }

    if (this.appDataService.roadMapPath || this.appDataService.roSalesTeam) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return false; // TODO: set to true after integration
        }
      };
      this.disableAffiliates = true;
    }

    try {
      this.affiliatesService.loadSubsidiaryData1(null);
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
    /*
        setTimeout(() => {
          //      this.utilitiesService.setTableHeight();
          const ele: any = this.elementRef.nativeElement.querySelector('ag-grid-angular');
          if (ele != null) {
            const pos = ele.getBoundingClientRect();
            ele.style.height = (window.innerHeight - pos.top + 20) + 'px';
          }
        }, 250);
        */
  }


  // Saving affiliates in all scenario icluding back,continue etc
  public ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    // Only call service when data is updated
    if (this.isSelectionChanged) {
     // this.saveAffiliates();
     this.saveSmartSubsidariesOnDestroy(null,null,true);
    }
    // unsubscribe to roadmap emitter after reopening
    this.qualService.unSubscribe();
    if (this.subscribers.paginationEmitter) {
      this.subscribers.paginationEmitter.unsubscribe();
    }
  }

  // Update qualification status to in progress incase of any changes
  updateQualificationStatus() {

    //  if(this.qualService.qualification.status === this.constantsService.COMPLETE_STATUS) {

    //     this.qualService.updateQualStatus()
    //   }
  }


  ngOnInit() {

    if(this.affiliatesService.searchlabel && this.affiliatesService.showFlyoutView){
      this.selectedpartySearchLabel = this.affiliatesService.searchlabel;
    }
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep;
    this.appDataService.showActivityLogIcon(true);
    // this.appDataService.isProposalIconEditable = true;
    // enable edit icon only if qual edit is present
    if (this.permissionService.qualEdit) {
      this.appDataService.isProposalIconEditable = true;
    } else {
      this.appDataService.isProposalIconEditable = false;
    }
    // this.createColumnDefs();
    this.switchToggle();
    this.noOfChange = 0;
    this.getSubsidiaryData();
    this.gridOptions.onSortChanged = () => {
      // console.log(this.gridOptions.api.getSortModel());
      this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
    };

    if(this.affiliatesService.readOnlyMode){
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
    }
    // reinitialize this 4 service variables so that they dont values of priviously visitated qualification.
    this.affiliatesService.excludedAffiliatesSet = new Set();
    this.affiliatesService.excludedAffiliatesSetHQ = new Set();
    this.affiliatesService.excludedGUs = [];
    this.affiliatesService.excludedHQs = [];

    this.subscribers.paginationEmitter = this.utilitiesService.paginationEmitter.subscribe((pagination: any) => {
      this.paginationObject = pagination;
      this.renderGridData();
      // if (this.selectedView === 'flat') {
      //   // check if the req payload id not empty call flatview with advanced search
      //   if(this.flatViewReqPayload && Object.keys(this.flatViewReqPayload).length > 0){
      //     this.loadFlatViewData();
      //   } else {
      //     this.loadSubsidiaryDataForFlatView();
      //   }
      // } else {
      //   this.loadSubsidiarySummaryData();
      // }

    });
  }

  // method to apply advancedSearch
  applyAdvancedSearch() {
    // if reset, set the page when applied
    // if(this.isAppliedAdvancesSearchReset){
    //   this.paginationObject.page = 1;
    // }
    this.affiliatesService.isAdvanceSearchApplied = true;
    if(this.excludedPartiesMap.size > 0 || this.includedPartiesMap.size > 0 ){
      this.saveSmartSubsidaries(null,null,true);
    } else{
    this.loadFlatViewData();
    }
    this.advSearch.close();
  }

  getAffiliateDetailList($event, selectedRowData) {

    this.affiliatesService.getAffiliateDetailList(selectedRowData).subscribe(
      (response: any) => {
        if (response && !response.error && response.data.affiliateDetailList) {
          try {
            this.affiliateDetailList = response.data.affiliateDetailList;
            this.openSubList($event);
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  public loadSubsidiarySummaryData() {
    // this.showGrid = false;
    this.noResultFound = false;
    this.affiliatesService.getSubsidiarySummaryData(this.paginationObject, this.selectedpartySearchLabel, this.selectedGu,this.searchSubsidiaryName, this.isSerachscenario, this.selectedSubsidiaryType).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          try {
            this.clearExcludedPartyMap();
            if (response.data.summaryList) {
              this.showGrid = true;
              const data = response.data;
              if(response.data.page){
                this.updatePageObject(response.data.page);
              }
              this.dataObject.summaryList = data.summaryList;
              this.totalRows = data.summaryList.length;
              this.updateGrid(data);
            } else {
              this.totalRows = 0;
              this.dataObject.summaryList = [];
              this.gridOptions.rowData = [];
              if(response.data.topHeader && response.data.topHeader.allSubsidaryCount) {
                this.totalNumberOfSubsidiary = response.data.topHeader.allSubsidaryCount;
                this.selectedNumberOfSubsidiary = response.data.topHeader.selectedSubsidaryCount;
                this.continueEnableAndDisable();
              }
              this.setGridData([]);
              this.noResultFound = true;
              this.selectAll = false;
              // if(this.selectedpartySearchLabel === 'Outside My GU'){
              //   this.totalNumberOfSubsidiary = 0;
              //   this.selectedNumberOfSubsidiary = 0;               
              // }
              //this.messageService.displayMessages(this.appDataService.setMessageObject('No Data found', MessageType.Info), false);
            }
            
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.showGrid = false;
          this.messageService.displayMessagesFromResponse(response);
        }

      });
  }

  updatePageObject(pageObj) {
    this.paginationObject.collectionSize = pageObj.noOfRecords;
    this.paginationObject.page = pageObj.currentPage;
    if(pageObj.pageSize){
      this.paginationObject.pageSize = pageObj.pageSize;
    }
  }

  loadSubsidiaryDataForFlatView() {

    const guId = (this.filter.guId === '') ? 0 : Number(this.filter.guId);
    const partyId = (this.filter.partyId === '') ? 0 : Number(this.filter.partyId);
    const parentId = (this.filter.parentId === '') ? 0 : Number(this.filter.parentId);
    const excludeIds = (this.filter.excludeIds === '') ? 0 : Number(this.filter.excludeIds);
    const excludePartyIds = (this.filter.excludePartyIds === '') ? 0 : Number(this.filter.excludePartyIds);
    const excludeParentIds = (this.filter.excludeParentIds === '') ? 0 : Number(this.filter.excludeParentIds);

    const advanceSearchPayload = {
      'includedGuId': guId,
      'includedPartyId': partyId,
      'includedParentId': parentId,
      'includedGuName': this.filter.guName,
      'includedPartyName': this.filter.partyName,
      'includedParentName': this.filter.parentName,
      'includedPartyType': this.selectedPartyType,
      'includedCountry': this.filter.country,
      'includedAddressLine': this.filter.address1,
      'includedCity': this.filter.city,
      'includedState': this.filter.state,
      'includedPostalCode': this.filter.postalCode,
      'excludedGuId': excludeIds,
      'excludedPartyId': excludePartyIds,
      'excludedParentId': excludeParentIds,
      'excludedParentName': this.filter.excludeParentNames
    };


    // this.showGrid = false;
    this.noResultFound = false;
    this.affiliatesService.getSubsidiaryDataForFlatView(this.paginationObject, this.selectedGu, this.selectedpartySearchLabel,
      this.searchSubsidiaryName, this.isSerachscenario, this.selectedSubsidiaryType, advanceSearchPayload).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          try {
            this.clearExcludedPartyMap();
            if(response.data.affiliateDetailList) {
              this.showGrid = true;
              this.dataObject.affiliateDetailList = response.data.affiliateDetailList;
              this.totalRows = response.data.affiliateDetailList.length;
              if(response.data.page){
                this.updatePageObject(response.data.page);
              }
              this.updateGrid(response.data);
            } else {
              this.dataObject.affiliateDetailList = [];
              this.totalRows = 0;
              this.gridOptions.rowData = []
              this.setGridData([]);
              this.resetPaginationObject();
              if(response.data.topHeader && response.data.topHeader.allSubsidaryCount) {
                this.totalNumberOfSubsidiary = response.data.topHeader.allSubsidaryCount;
                this.selectedNumberOfSubsidiary = response.data.topHeader.selectedSubsidaryCount;
                this.continueEnableAndDisable();
              }
              //this.messageService.displayMessages(this.appDataService.setMessageObject('No Data found', MessageType.Info), false);
              this.noResultFound = true;
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.showGrid = false;
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }


  public loadFlyoutFlatViewCountries() {
    let countryReqPayload: any = {};
    countryReqPayload.withinGU = 'Y';

    this.affiliatesService.getFlatViewCountries(countryReqPayload).subscribe(
      (countriesData: any) => {
        this.countryDropDown.push({ 'countries': "All Countries" });
        if(countriesData && countriesData.data){
        countriesData.data.forEach(element => {
          this.countryDropDown.push({ 'countries': element.countries });
        });
      }
      }
    );
  }

  public loadFlatViewData() {
    this.isAppliedAdvancesSearchReset = false;
    // this.showGrid = false;
    this.noResultFound = false;
    const flyoutView = this.affiliatesService.showFlyoutView;
    let selCountry;
    let selectedNode;
    const requestPayload: any = {};
    if (flyoutView) {

      if (this.selectedCountry === 'All Countries') {
        selCountry = '';
      } else {
        selCountry = this.selectedCountry;
      }

      if (this.selectedSubsidary === 'All Subsidiaries') {
        selectedNode = '';
      } else if (this.selectedSubsidary === 'Global Ultimate') {
        selectedNode = 'GU';
      } else if (this.selectedSubsidary === 'Headquarters') {
        selectedNode = 'HQ';
      } else if (this.selectedSubsidary === 'Branches') {
        selectedNode = 'BR';
      }
      requestPayload.nodeType = selectedNode;
      requestPayload.withinCountry = selCountry;
      requestPayload.partyName = this.affiliatesService.selectedRow.subsidiaryName;
    }
    const guId = (this.filter.guId === '') ? 0 : Number(this.filter.guId);
    const partyId = (this.filter.partyId === '') ? 0 : Number(this.filter.partyId);
    const parentId = (this.filter.parentId === '') ? 0 : Number(this.filter.parentId);
    const excludeIds = (this.filter.excludeIds === '') ? 0 : Number(this.filter.excludeIds);
    const excludePartyIds = (this.filter.excludePartyIds === '') ? 0 : Number(this.filter.excludePartyIds);
    const excludeParentIds = (this.filter.excludeParentIds === '') ? 0 : Number(this.filter.excludeParentIds);

    // if(Object.keys(this.filter).length || this.selectedPartyType){
    //   this.affiliatesService.isAdvanceSearchApplied = true;
    // } else {
    //   this.affiliatesService.isAdvanceSearchApplied = false;
    // }
    if(!this.searchSubsidiaryName && !this.affiliatesService.showFlyoutView && !this.affiliatesService.isAdvanceSearchApplied){
      requestPayload.page = {
        'pageSize': this.paginationObject.pageSize,
        'currentPage': this.paginationObject.page
      };
    }
    requestPayload.advanceSearchPayload = {
      'includedGuId': guId,
      'includedPartyId': partyId,
      'includedParentId': parentId,
      'includedGuName': this.filter.guName,
      'includedPartyName': this.filter.partyName,
      'includedParentName': this.filter.parentName,
      'includedPartyType': this.selectedPartyType,
      'includedCountry': this.filter.country,
      'includedAddressLine': this.filter.address1,
      'includedCity': this.filter.city,
      'includedState': this.filter.state,
      'includedPostalCode': this.filter.postalCode,
      'excludedGuId': excludeIds,
      'excludedPartyId': excludePartyIds,
      'excludedParentId': excludeParentIds,
      'excludedParentName': this.filter.excludeParentNames
    };

    this.flatViewReqPayload = requestPayload; // set the req payload for export feature
    this.affiliatesService.getFlatViewData(requestPayload).subscribe(
      (responseObj: any) => {
        if (responseObj && !responseObj.error && responseObj.data) {
          try {
            if (responseObj.data && responseObj.data.affiliateDetailList) {
              this.showGrid = true;
              if (flyoutView) {
                this.dataObject.flyoutFlatViewData = responseObj.data.affiliateDetailList;
              } else {
                this.dataObject.affiliateDetailList = responseObj.data.affiliateDetailList;
              }
              this.totalRows = responseObj.data.affiliateDetailList.length;
              this.updateGrid(responseObj);
              if(responseObj.data.page){
                this.updatePageObject(responseObj.data.page);
              }
            } else {
              this.noResultFound = true;
              this.totalRows = 0;
              this.dataObject.flyoutFlatViewData = [];
              this.dataObject.affiliateDetailList = [];
              this.gridOptions.rowData = []
              this.setGridData([]);
              this.resetPaginationObject();
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.showGrid = false;
          this.messageService.displayMessagesFromResponse(responseObj);
        }
      });
  }

  public updateGrid(response) {
    // this.calcTotal();
    if(this.selectedpartySearchLabel !== 'Outside My GU'){
    if (response.topHeader && response.topHeader.allSubsidaryCount) {
      this.totalNumberOfSubsidiary = response.topHeader.allSubsidaryCount;
      this.selectedNumberOfSubsidiary = response.topHeader.selectedSubsidaryCount;
      if(this.totalNumberOfSubsidiary !== this.selectedNumberOfSubsidiary){
        this.selectAll = false;
      }
      this.continueEnableAndDisable();
    }
   } 
   
    if (response.headerList && !this.selectedGu.guId) {
      this.dataObject.associatedGU = response.headerList;
      this.selectedGu = this.affiliatesService.selectedGu = response.headerList[0];
      response.headerList.forEach(associateGU => {
        if ((this.selectedGu.hqCount + this.selectedGu.branchesCount) < (associateGU.hqCount + associateGU.branchesCount)) {
          this.selectedGu = this.affiliatesService.selectedGu = associateGU;
        }
      });
    }
    /*
    setTimeout(() => {
      this.utilitiesService.setTableHeight();
    });
    */
    if (this.selectedView === 'summary') {
      this.gridRowData = this.dataObject.summaryList;
    } else {
      if (this.affiliatesService.showFlyoutView) {
        this.gridRowData = this.dataObject.flyoutFlatViewData;
      } else {
        this.gridRowData = this.dataObject.affiliateDetailList;
      }
    }

    if (this.gridOptions.api === null || this.gridOptions.api === undefined) {
      this.gridOptions = <GridOptions>{
        onGridReady: () => {
          this.gridOptions.rowData = this.gridRowData;
          
        }
      };
    } else {
      if (this.gridOptions.api) {
        this.setGridData(this.gridRowData);
      }
      if (response.summaryList) {
        this.setCheckboxValue(response.summaryList);
      } else {
        this.setCheckboxValue(response.affiliateDetailList);
      }

    }
    this.handleHeaderCheckboxSelection();
  }

  public prepareSubsidiaryMetaData(subsidiaryMetaData: any, compInstance) {
    compInstance.columnDefs = [];
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();

    compInstance.columnHeaderList = [];
    const thisInstance = compInstance;
    for (let i = 0; i < subsidiaryMetaData.length; i++) {
      const coloumnData = subsidiaryMetaData[i];
      // this.productSummaryService.namePersistanceColumnMap.set(coloumnData.persistanceColumn,coloumnData.name);
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.columnSize) {
        /* Get column width from meta data and assign it to respective column */
        coloumnDef.width = this.appDataService.assignColumnWidth(
          coloumnData.columnSize
        );
      }
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.name;
        coloumnDef.filterParams = { cellHeight: 20 };
        if (coloumnData.name === 'customerGuName') {
          coloumnDef.width = 550;
          coloumnDef.pinned = true;
          coloumnDef.cellClass = 'expandable-header';
          coloumnDef.cellRenderer = 'agGroupCellRenderer';
          coloumnDef.checkboxSelection = true;
          // coloumnDef.cellRenderer ='agGroupCellRenderer',

          compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.hideColumn !== 'Y') {
          coloumnDef.width = 180;
          coloumnDef.minWidth = 60;
          if (coloumnData.dataType === 'Number') {
            coloumnDef.cellRenderer = 'currencyFormat';
            coloumnDef.cellClass = 'dollar-align';
            if (coloumnDef.cellRenderer === 'currencyFormat') {
              coloumnDef.cellRenderer = function (params) {
                return thisInstance.currencyFormat(params, thisInstance);
              };
            }
          }
          coloumnDef.field = coloumnData.name;
          if (coloumnData.groupName) {
            // this condition is for column grouping.
            coloumnDef.headerClass = 'child-header';
            compInstance.gridOptions.headerHeight = 30;
            if (
              coloumnData.name !== 'address1' &&
              coloumnData.name.substring(0, coloumnData.name.length - 1) ===
              'address'
            ) {
              coloumnDef.columnGroupShow = 'open';
            }
            // console.log(coloumnData);

            if (coloumnData.field === 'type') {
              coloumnDef.cellRenderer = 'nodeTypeCell';
            }
            if (headerGroupMap.has(coloumnData.groupName)) {
              const headerGroupObject = headerGroupMap.get(
                coloumnData.groupName
              );
              headerGroupObject.children.push(coloumnDef);
            } else {
              const headerObject: ArchitectureMetaDataJson = {
                headerName: coloumnData.groupName
              };
              headerObject.children = new Array<any>();
              headerGroupMap.set(coloumnData.groupName, headerObject);
              coloumnDef.suppressSorting = true;
              // coloumnDef.cellRendererParams = {
              //   checkbox: false
              // };
              headerObject.children.push(coloumnDef);
              compInstance.columnDefs.push(headerObject);
            }
          } else {
            if (coloumnData.name === 'address1') {
              coloumnDef.width = 256;
            }
            if (coloumnData.name === 'theater') {
              coloumnDef.width = 238;
            }
            compInstance.columnDefs.push(coloumnDef);
          }
        }
      }
    }
  }

  private createColumnDefs() {
    this.blockUiService.spinnerConfig.startChain();

    const thisInstance = this;
    const subsidiaryMetaData = this.appDataService.getDetailsMetaData(
      'QUAL_SUBSIDARY'
    );
    this.columnDefs = this.summaryColumns;
    // this.prepareSubsidiaryMetaData(subsidiaryMetaData.columns, this);
  }

  updateRowDataOnSort(sortColObj: any) {
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  getNodeChildDetails(rowItem) {
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  public onModelUpdated() {
    // this.calculateRowCount();
    if (this.selectedView === 'summary' && !this.isSummaryList ) {
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  public onReady() {
    this.calculateRowCount();
  }

  // To show change or add affiliates
  showChangeAffiliates() {

    if ((this.qualService.qualification.customerInfo.affiliateNames &&
      this.qualService.qualification.customerInfo.affiliateNames.length > 0) ||
      this.qualService.qualification.customerInfo.filename.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onRowGroupOpened($event) {
    if ($event.node.level === 1) {
      this.onCellClicked($event, true);
    }
  }

  openSubList($event) {

    if (this.opened) {
      return;
    }
    this.mode = 1;
    this.setPosition($event.event);


  }
  openCountryDetails($event) {
    if (this.opened) {
      return;
    }
    this.mode = 2;
    this.setPosition($event.event);
  }

  openAssosiatedGus($event) {
    if (this.opened) {
      return;
    }
    this.mode = 3;
    this.setPosition($event);
  }
  setPosition(event) {
    this.showOnTop = false;
    setTimeout(() => {
      setTimeout(() => { this.opened = true; }, 300);
      const ele = this.elementRef.nativeElement.querySelector('.ag-cell');
      const pop = this.elementRef.nativeElement.querySelector('.new-pop');
      if (ele === null) {
        return;
      }
      const offset: any = ele.getBoundingClientRect();
      const popoffset: any = pop.getBoundingClientRect();
      
      let left = event.x - 40;
      this.arrowStyles = { top: '-13px', left: '22px' };
      if (window.innerWidth < popoffset.width + event.x) {
        left -= offset.width - 80;
        this.arrowStyles.left = 'auto';
        this.arrowStyles.right = '22px';
      }
      let top = event.y + 4;
      let diff = window.innerHeight - (popoffset.height + event.y);
      if (window.innerHeight < offset.height + event.y) {
        this.showOnTop = true;
        this.arrowStyles.top = 'auto';
        this.arrowStyles.bottom = '-13px';
      }
      if (left < 0) {
        left = event.clientX - (offset.width / 2);
        left = left < 5 ? 5 : left - 5;
        this.arrowStyles.right = undefined;
        this.arrowStyles.left = (offset.width / 2) + 'px';
      }
      if (this.mode === 3) {
       // left = 230
        this.popStyle = { opacity: 1, left: `${left}px`, top: '38px'};
      } else if (this.mode === 2 || this.mode === 1) { 
        left = offset.right;
        if (diff < 0) {
          top = event.y + window.scrollY - (popoffset.height + 8);
        } else {
          top = event.y + 8 + window.scrollY;
        }
      this.popStyle = { opacity: 1, left: `${left}px`, top: `${top}px`};
      }
    }, 100);
  }

  hide() {
    if (this.opened) {
      this.mode = 0;
      this.popStyle = {};
      this.opened = false;
    }
  }


  getCountryListForSelectedGu($event) {
    this.affiliatesService.getCountryListForSelectedRow(this.selectedpartySearchLabel, $event.data.guId,
      $event.data.subsidiaryName).subscribe((response: any) => {
        if (response && !response.error && response.data) {
          try {
            if (response.data) {
              this.selectedRow.countries = response.data;
              this.openCountryDetails($event);
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }

      });


  }

  public onCellClicked($event, iconClick?: boolean) {
    this.selectedRow = $event.data;
    if ($event.event.target.classList.length > 0 && !$event.event.target.classList.contains('node-icon')
      && !$event.event.target.classList.contains('ag-cell-value')
      && !$event.event.target.classList.contains('ellipsis') && $event.column.colId !== 'subsidiaryName') {
      return;
    }

    if ($event.column.colId === 'nodeType') {
      if ($event.value !== 'BR' && this.selectedRow['subsidiariesCount']) {
        this.getAffiliateDetailList($event, this.selectedRow);
      }
      return;
    }
    if ($event.column.colId === 'countriesCount') {
      this.getCountryListForSelectedGu($event);
      return;
    }
    if (this.selectedView !== 'flat' || $event.column.colId === 'subsidiaryName') {
      this.showSummary = true;
      this.affiliatesService.showFlyoutView = true;
      this.affiliatesService.selectedRow.subsidiaryName = $event.data.subsidiaryName;
      this.affiliatesService.clickedSubsidiaryObj = $event.data;      
      return;
    }
    return;
    
  }

  setCheckboxValue(qualGeoData) {
    // Set updated by user flag false on sorting
    this.isUpdatedByUser = false;

    const thisInstance = this;     
    // goes through each node data & sets checkbox default value as received from backend api
    try {
      this.gridOptions.api.forEachNode(function (rowNode) {
        if (rowNode.data.exclusionYorN) {
          if (rowNode.data.exclusionYorN === 'Y') {
            rowNode.setSelected(false);
            // if(!thisInstance.excludedPartiesMap.has(rowNode.data.partyName)){
            //   thisInstance.excludedPartiesMap.set(rowNode.data.partyName, rowNode.data);
            // }
          } else {
            rowNode.setSelected(true);
          }
        } else {
          if (rowNode.data.currentSelectedSubsidiaryCount > 0) {
            rowNode.setSelected(true);
          } else {
            // if(!thisInstance.excludedPartiesMap.has(rowNode.data.subsidiaryName)){
            //   thisInstance.excludedPartiesMap.set(rowNode.data.subsidiaryName, rowNode.data);              
            // }
            rowNode.setSelected(false);
          }
        }
      });
    } catch (error) {
      console.log(error);
      this.messageService.displayUiTechnicalError(error);
    }
  }


  saveAffiliates() {
    this.affiliatesService.excludedHQs = [];
    this.affiliatesService.excludedGUs = [];
    this.affiliatesService.excludedPartys = [];

    this.affiliatesService.exclusions.forEach((value, key) => {
      this.affiliatesService.subsidiaryData.forEach(x => {
        if (x.END_CUSTOMER_ID === key && (value.size < x.children.length)) {
          value.forEach(ele => {
            // check for id and party true or not then push to respected
            for (const d of x.children) {
              if (d.id === ele && d.party) {
                this.affiliatesService.excludedPartys.push(ele);
              } else if (d.id === ele && !d.party) {
                this.affiliatesService.excludedHQs.push(ele);
              }
            }
          });
        } else if (x.END_CUSTOMER_ID === key && (value.size === x.children.length)) {
          this.affiliatesService.excludedGUs.push(key);
        }
      });
    });

    const reqObject = {
      // userId: this.appDataService.userId,
      qualId: this.qualService.qualification.qualID,
      excludedGUs: this.affiliatesService.excludedGUs,
      excludedHQs: this.affiliatesService.excludedHQs,
      excludedPartys: this.affiliatesService.excludedPartys
    };
    this.affiliatesService.saveAffilates(reqObject)
      .subscribe((res: any) => {
        if (res) {

          this.affiliatesService.affiliatesSaved.emit(true);
          if (res.messages && res.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(res);
          }
          if (!res.error) {
            this.isListUpdated = true;

          }
        }
      });
  }

  // To show expand and collapse row
  private isExpandedRow(endCustomerId: string) {

    let expandedRow = false;
    const arrayCustomer = Array.from(this.customerIdSet.values());

    for (let i = 0; i < arrayCustomer.length; i++) {

      if (arrayCustomer[i] === endCustomerId) {

        expandedRow = true;
        break;
      }
    }
    return expandedRow;
  }


  public onSelectionChanged() {
    this.noOfChange++
    if (this.noOfChange > 1 && this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE &&
    this.isUpdatedByUser) {
      //this.qualService.updateQualStatus();
    }
  }


  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  continueToQualSummary() {
    if(this.selectedpartySearchLabel === 'Outside My GU' && this.selectedOutsideGUCount){
      const modalRef = this.modalVar.open(ConfirmationComponent, { windowClass: 're-open' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.continue.emit(); 
      }
    });
    } else {
      this.continue.emit(); 
    }
  }

  openAddModal() {
    const modalRef = this.modalVar.open(AddAffiliatesNameComponent, { windowClass: 'add-affiliates' });
    modalRef.componentInstance.showChangeAffiliateOnUI = this.showChangeAffiliates();
  }


  backToGeography() {
    this.back.emit();
  }

  viewQualification() {
    this.qualService.goToQualification();
  }



  redirectToCleanCore() {

    this.appDataService.cleanCoreRedirect(this.qualService.qualification.qualID);
    // .subscribe((response: any) => {
    //   if (response) {
    //     console.log('Redirect [' + response + ']');
    //     /* Getting callbackUrl and ciscoReadyUrl  from two parallel  subscriptons and join them in forkJoin */
    //     //this.document.location.href = response.data.redirectUrl;
    //     window.location.href = response.data.redirectUrl;
    //   }
    // });
  }

  // this mathod will be called only when user will click inside the grid.
  updatedByUser(event) {
    if (this.selectedpartySearchLabel !== 'Outside My GU') {
      const checkboxClass = event.target.classList.value;
      const isUnChecked = checkboxClass.search('form-check-input');
      if(!this.isAllSelectionSubsidiaryClicked && !this.affiliatesService.readOnlyMode && isUnChecked > -1) {
        if (event.target.checked) {
          this.isAllSelectionSubsidiaryClicked = true;
          this.selectionOfAllSubsidiary = true;         
        } else{
          this.isAllSelectionSubsidiaryClicked = true;
          this.selectionOfAllSubsidiary = false;         
        }
        this.clearExcludedPartyMap();     
        if(this.affiliatesService.showFlyoutView){         
          if(this.dataObject.flyoutFlatViewData && this.dataObject.flyoutFlatViewData.length > 0){
            const rowData = this.dataObject.flyoutFlatViewData;
            this.viewContextForSaveCall = 'NAMED_HIERARCHY_VIEW';
            rowData['guId'] =  this.dataObject.flyoutFlatViewData[0].guId;
            this.saveSmartSubsidaries(rowData, this.selectionOfAllSubsidiary,false,'all Subsidiary Selection');
          }
        } else {
          this.saveSmartSubsidaries(null, this.selectionOfAllSubsidiary,false,'all Subsidiary Selection');
        }
       } else {
        this.isUpdatedByUser = true;
      }
      } 
  }
    


  // reopen qual at page level
  reopenQual() {
    this.qualService.reopenQual();
    // subscibe to emitter to get value of roadmappath
    this.subscribers.roadMapEmitter = this.qualService.roadMapEmitter.subscribe((roadMapPath: any) => {
      // enable edit icon only if qual edit is present
      if (this.permissionService.qualEdit) {
        this.appDataService.isProposalIconEditable = true;
      } else {
        this.appDataService.isProposalIconEditable = false;
      }
      // if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        this.gridOptions.rowClassRules = {
          'checkboxDisable': function (params) {
            return false;
          }
        };
        // set the grid after reopened
        if (this.gridOptions.api) {
          this.gridOptions.api.redrawRows();
        }
        this.disableAffiliates = false;

      }
    });
  }

  openlookupSubsidiaries() {
    const modalRef = this.modalVar.open(LookupNewSubsidiariesComponent, { windowClass: 'lookup-subsidiaries' });
  }

  onRowSelected($event) {
    if(this.selectedpartySearchLabel === 'Outside My GU'){
      if(this.selectedView !== 'flat'){
        if($event.node.selected){
          this.selectedOutsideGUCount = this.selectedOutsideGUCount + ($event.data.availableCrBranchesCount + $event.data.availableCrHqCount); 
      } else {
        this.selectedOutsideGUCount = this.selectedOutsideGUCount - ($event.data.availableCrBranchesCount + $event.data.availableCrHqCount); 
      }
      } else {
        if($event.node.selected){
        this.selectedOutsideGUCount++;
      } else {
        this.selectedOutsideGUCount--;
      }
      }
      if(this.selectedOutsideGUCount < 0){
        this.selectedOutsideGUCount = 0;
      }
      return;
    }
    if (this.isUpdatedByUser) {
      if($event.node && !$event.node.selected){
          this.selectAll = false;
      }
      this.viewContextForSaveCall = 'NAMED_HIERARCHY_VIEW';
      if (this.selectedView === 'flat') {
          this.viewContextForSaveCall = 'FLAT_VIEW';
          this.isSelectionChanged = true;
          if($event.node.selected){
            this.excludedPartiesMap.delete($event.data.partyId);
            this.includedPartiesMap.set($event.data.partyId,$event.data);
          } else {
            this.excludedPartiesMap.set($event.data.partyId,$event.data);
            this.includedPartiesMap.delete($event.data.partyId);
        }
      } else {
        if (this.affiliatesService.showFlyoutView) {
          this.viewContextForSaveCall = 'NAMED_HIERARCHY_VIEW';
        } else {
          this.viewContextForSaveCall = 'NAMED_SUMMARY_VIEW';
          this.isSelectionChanged = true;
          if($event.node.selected){
              this.excludedPartiesMap.delete($event.data.subsidiaryName);  
              this.includedPartiesMap.set($event.data.subsidiaryName,$event.data);            
          } else {             
              this.excludedPartiesMap.set($event.data.subsidiaryName,$event.data);
              this.includedPartiesMap.delete($event.data.subsidiaryName); 
          }
        }
      }
    //  this.saveSmartSubsidaries($event.data, $event.node.selected);
      //this.selectedTooltipShow($event.node.selected);
    } else if(this.isAllSelectionSubsidiaryClicked){
      this.isAllSelectionSubsidiaryClicked = false;
       this.saveSmartSubsidaries(null, this.selectionOfAllSubsidiary,false,'all Subsidiary Selection');       
    } 
    this.handleHeaderCheckboxSelection();
  }

  saveSmartSubsidaries(rowData, isSelected,isImplicitSaveCall = false,selectionType=null) {
   const saveSubObj:SaveSmartSubsidiaryObj =  this.prepareSaveRequestObject(rowData, isSelected,isImplicitSaveCall,selectionType);
    this.affiliatesService.saveSmartSubsidaries(saveSubObj).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        try {
          this.selectedRows = this.gridOptions.api.getSelectedRows();         
          if (this.selectedView === 'flat') {
            if (this.affiliatesService.showFlyoutView) {
              this.loadFlatViewData();
            } else {
              this.loadSubsidiaryDataForFlatView();
            }
          } else {
            if (this.affiliatesService.showFlyoutView) {
              this.loadFlatViewData();
            } else {
              this.loadSubsidiarySummaryData();
            }
          }
          if (this.isSummaryList && isSelected) {
            if(rowData.nodeType === 'HQ'){
              this.toastr.success(`You have selected ${rowData.partyName} ${rowData.nodeType}, so associated Branches automated selected`);
            }  
          }
          this.isAllSelectionSubsidiaryClicked = false;
          //this.gridOptions.api.redrawRows();
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }


  saveSmartSubsidariesOnDestroy(rowData, isSelected,isImplicitSaveCall) {
    const saveSubObj:SaveSmartSubsidiaryObj =  this.prepareSaveRequestObject(rowData, isSelected,isImplicitSaveCall);
     this.affiliatesService.saveSmartSubsidaries(saveSubObj).subscribe((response: any) => {
       if (response && !response.error && response.data) {
         try {
            console.log('subsidiary Saved.');
         } catch (error) {
           this.messageService.displayUiTechnicalError(error);
         }
       } else {
         this.messageService.displayMessagesFromResponse(response);
       }
     });
   }
 


  prepareSaveRequestObject(rowData, isSelected,isImplicitSaveCall = false,selectionType=null){
    const saveSubObj:SaveSmartSubsidiaryObj = {
      rowData: rowData,
      isSelected: isSelected,
      selectedpartySearchLabel: this.selectedpartySearchLabel,
      viewContextForSaveCall: this.viewContextForSaveCall,
      selectionType: selectionType,
      associatedGUObj : this.dataObject.associatedGU,
      guId: this.selectedGu.guId,
      searchString: this.searchSubsidiaryName,
      isImplicitSave:false
    };    
    if((this.searchSubsidiaryName || this.affiliatesService.isAdvanceSearchApplied) && !rowData){
        if(this.viewContextForSaveCall === 'FLAT_VIEW'){
          saveSubObj.rowData = this.dataObject.affiliateDetailList;
        }else if(this.viewContextForSaveCall === 'NAMED_SUMMARY_VIEW'){
          saveSubObj.rowData = this.dataObject.summaryList;
        }
    }
    if(isImplicitSaveCall){
      saveSubObj.rowData = this.excludedPartiesMap;
      saveSubObj.includedItemMap = this.includedPartiesMap;
      saveSubObj.isImplicitSave = true;
      if(this.selectedGu.guId){
        saveSubObj.guId = this.selectedGu.guId;
      } else if(this.affiliatesService.clickedSubsidiaryObj.guId){
        saveSubObj.guId = this.affiliatesService.clickedSubsidiaryObj.guId;
      }      
    }
    return saveSubObj;
  }

  // method to restet advanced search filter and party type
  resetAdvancedSearch(){
    this.affiliatesService.isAdvanceSearchApplied = false;
    this.filter = {};
    this.selectedPartyType = '';
    // this.flatViewReqPayload = {};// set to empty
    this.isAppliedAdvancesSearchReset = true; // set to true if reset clicked    
  }

  onGuChange(gu) {
    if(gu.guId !== this.selectedGu.guId){
    this.resetPaginationObject();
    this.selectedGu = this.affiliatesService.selectedGu = gu;
    this.isSerachscenario = false;
    this.hide();
    if (this.selectedView === 'summary') {
      this.loadSubsidiarySummaryData();
    } else {
      this.loadSubsidiaryDataForFlatView();
    }
  }
  }

  selectAllRows(mode) {
    let isSelected = false;
    if (mode) {
      this.gridOptions.api.selectAll();
      isSelected = true;
     } else {
      this.gridOptions.api.deselectAll();
    }
    if (this.selectedpartySearchLabel !== 'Outside My GU') {
      this.saveSmartSubsidaries(null, isSelected, false,'whole Customer Hierarchy');
    }
  }

  changeSeletedSubsidiary(newSelectedSubsidiary) {
    if (newSelectedSubsidiary !== this.selectedSubsidiaryType) {
      this.selectedSubsidiaryType = newSelectedSubsidiary;
      this.renderGridData();
    }
  }


  renderGridData(){
    if(this.isSelectionChanged){
      this.saveSmartSubsidaries(null,null,true);
    }else{
    if (this.selectedView === 'flat') {
      this.loadSubsidiaryDataForFlatView();
    } else {
      this.loadSubsidiarySummaryData()
    }
  }
  }


  searchSubsidiaryByName(event) {
    this.searchSubsidiaryName = event;
    this.affiliatesService.smartViewSearchString = event;
    this.isSerachscenario = true;
    this.resetPaginationObject();
    this.resetAdvancedSearch();   
    if (!this.searchSubsidiaryName) {
      this.searchSubsidiaryName = null;
      this.selectedpartySearchLabel = this.searchDropdown[0].name;
      this.affiliatesService.searchlabel = this.searchDropdown[0].name;
      this.isSerachscenario = false;
      this.affiliatesService.smartViewSearchString = ''   
    }
    this.renderGridData();
  }

  resetPaginationObject() {//set current page as 1 if user is not on page 1;
    this.paginationObject.page = 1;
  }

  // this method is to calling numbers and decimal points
  isNumberOnlyKey(event: any) {
    let value = event.target.value;
    let numbers = value.replace(/[^0-9]/g, "");
    event.target.value = numbers;
    // if (!this.utilitiesService.isNumberKey(event)) {
    //   event.target.value = '';
    // }
  }


  closeFlyoutView() {

    this.showSummary = false;
    this.affiliatesService.showFlyoutView = false;
    if(this.excludedPartiesMap.size > 0 || this.includedPartiesMap.size > 0 ){
      this.saveSmartSubsidaries(null,null,true);
    } else{
      this.loadSubsidiarySummaryData();
    }
  }
  ChangepartyType(type) {
    setTimeout(() => {
      this.advSearch.open();
    });
    this.selectedPartyType = type;
  }

  continueEnableAndDisable(){
    if(this.selectedNumberOfSubsidiary > 0){
      this.isContinueEnabled = true;
    } else {
      this.isContinueEnabled = false;
    }
}

handleHeaderCheckboxSelection() {
  //this method is to manage suites header check box.
  if(this.selectedpartySearchLabel !== 'Outside My GU'){
    if (!this.affiliatesService.showFlyoutView && !(this.searchSubsidiaryName || this.affiliatesService.isAdvanceSearchApplied) ) {
      if (this.totalNumberOfSubsidiary === this.selectedNumberOfSubsidiary && this.excludedPartiesMap.size === 0) {
        this.headerCheckBoxHanldeEmitter.emit(true);
      } else {
        this.headerCheckBoxHanldeEmitter.emit(false);
      }
    } else {
      const selsectedSuites = this.gridOptions.api.getSelectedRows();
       if (selsectedSuites.length === this.gridRowData.length) {
        this.headerCheckBoxHanldeEmitter.emit(true);
      } else {
        this.headerCheckBoxHanldeEmitter.emit(false);
      }
    }
  } else {
    this.headerCheckBoxHanldeEmitter.emit(false);
  }
 }

 selectedTooltipShow(selected) {
   if (selected) {
    this.nodeSelectTooltip = true;  
    setTimeout(() => {
     this.nodeSelectTooltip = false; 
    }, 6000);
   }
 }

 clearExcludedPartyMap(){
   this.excludedPartiesMap.clear();
   this.includedPartiesMap.clear();  
   this.isSelectionChanged = false;

 }
}