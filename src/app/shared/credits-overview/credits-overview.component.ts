import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { GridOptions } from 'ag-grid-community';
import { CreditOverviewService } from './credit-overview.service';
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ReuseableFilterService } from '../reuseable-filter/reuseable-filter.service';
import { MessageService } from '../services/message.service';
import { DownloadRequestComponent } from '@app/modal/download-request/download-request.component';
import { BlockUiService } from '../services/block.ui.service';
import { ColumnGridCellComponent } from '../ag-grid/column-grid-cell/column-grid-cell.component';
import { EngageSupportComponent } from "@app/modal/engage-support/engage-support.component";
import { UtilitiesService } from '../services/utilities.service';
import { Subscription } from 'rxjs';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { CopyLinkService } from "@app/shared/copy-link/copy-link.service";


@Component({
  selector: 'app-credits-overview',
  templateUrl: './credits-overview.component.html',
  styleUrls: ['./credits-overview.component.scss']
})
export class CreditsOverviewComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public rowData: any;
  public columnDefs: any;
  public domLayout;
  public defaultColDef;
  public sideBar;
  show: boolean = true;
  public gridApi;
  public gridColumnApi;
  errorInResponse = false;
  SearchLabel: string[] = ["All", "Install site ID", "Install Site Name", "Contract ID", "Product SO ID", "Service SO ID"];
  viewLabel: string[] = ["All Identifiers", "Product SO IDs", "Install Site", "Contract IDs", "Subscription IDs"];
  eligibilityLabel: string[] = ["Eligible", "Ineligible", "Eligible/Ineligible"];
  creditLabel: string[] = ["Got Credit", "Not Got Credit", "Got Credit/Not Got Credit"];
  identifierDropDown: any = [];
  eligibilityDropDown: any = [];
  creditStatusDropDown: any = [];
  paginationObject: PaginationObject;
  selectedSearchLabel: string = "All";
  selectedViewLabel = "All Identifiers";
  selectedEligibilityLabel = "Eligible/Not Eligible";
  selectedCreditLabel = "Credit Applied/Credit Not Applied";
  leftFilterData = [];
  topFilterData = [];
  identifierData = [];
  type = '';
  placeholder = 'Search By '
  searchDropdown  = []
  isSubscriptionsSelected = false;
  emitClearFilter: Subscription;
  applyFilterEmitter: Subscription;
  manageColumnEmitter: Subscription;
  creditOverviewSearchEmitter: Subscription;
  requestPa = false;
  showSupportButton  = false;
  readOnlyMode = false;

  showDateErrorMsg = false;
  isFilterDataLoaded = false;
  partnerLedFlow = false;
  isDataPresent: boolean;  
  isDataLoaded = false;
  isSearchApplied = false;
  searchObj: any;
  fromPage = 'creditOverviewPage';
  isWithinProposal = true;
  isWithinGu = true;
  isOutsideGu = true;
  defaultView = [];
  constructor(public priceEstimationService: PriceEstimationService, public creditOverviewService: CreditOverviewService, private modalVar: NgbModal, private renderer: Renderer2,
    public reuseableFilterService: ReuseableFilterService, private messageService: MessageService, private blockUiService: BlockUiService, public utilitiesService: UtilitiesService,
    public appDataService: AppDataService, public localeService: LocaleService, public constantsService: ConstantsService,private copyLinkService: CopyLinkService
) {
    this.gridOptions = <GridOptions>{};
    this.defaultColDef = {
      flex: 1,
      minWidth: 100,
      filter: true,
      sortable: true,
      resizable: true
    };
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: false,
            suppressPivotMode: false,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: false,
            suppressColumnExpandAll: false,
          },
        },
      ],
      defaultToolPanel: 'columns',
    };
    this.gridOptions.toolPanelSuppressRowGroups = true;
    this.paginationObject = { collectionSize: 50, page: 1, pageSize: 50 };

    this.gridOptions.frameworkComponents = {
      gridCell: <{ new(): ColumnGridCellComponent }>(
        ColumnGridCellComponent
      )
    };
    this.gridOptions.suppressContextMenu = true;
    this.gridOptions.enableColResize = true;
    //  this.domLayout = 'autoHeight';
  }

  ngOnInit() {
    this.readOnlyMode = this.appDataService.roadMapPath || (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess);

    //Method to check if need to show engage support or not for purchase adjustment 
    this.checkIntitiatePaRequest();

    this.blockUiService.spinnerConfig.customBlocker = false;
    this.reuseableFilterService.filterOpen = false;
    this.partnerLedFlow = this.appDataService.isPatnerLedFlow;
    this.blockUiService.spinnerConfig.startChain();
    if (this.appDataService.archName === 'SEC') {
      this.type = 'BOOKINGS'
    } else {
      this.type = 'IB'
    }
    this.setSearchDropdowns(this.type);
    this.reuseableFilterService.filterObject.data.type = this.type;
    this.getMetaData();
    this.getCreditsData();

    this.creditOverviewSearchEmitter = this.priceEstimationService.creditOverviewSearchEmitter.subscribe((dataObj: any) => {
      this.searchObj = dataObj;
      // console.log('test');
      // check if searchiput is empty and delete the variable from filter req data else add the variable with value
      if (dataObj.searchInput.trim().length === 0) {
        if(this.reuseableFilterService.filterObject.data[dataObj.searchId]){
          delete this.reuseableFilterService.filterObject.data[dataObj.searchId];
          delete this.reuseableFilterService.filterObject.data['withinProposalScope'];
          delete this.reuseableFilterService.filterObject.data['outsideProposalScope'];
          delete this.reuseableFilterService.filterObject.data['outsideGUScope'];
          this.isSearchApplied = false
          this.blockUiService.spinnerConfig.startChain();
          this.getCreditsData();
        }
      } else {
        this.reuseableFilterService.filterObject.data[dataObj.searchId] = dataObj.searchInput;
        this.reuseableFilterService.filterObject.data['withinProposalScope'] = 'Y';
        if(dataObj.partialSearch){
          this.isSearchApplied = false;
        } else {
          this.reuseableFilterService.filterObject.data['outsideProposalScope'] = 'Y';
          this.reuseableFilterService.filterObject.data['outsideGUScope'] = 'Y';
          this.isSearchApplied = true;
        }
        this.blockUiService.spinnerConfig.startChain();
        this.getCreditsData();
        this.prepareColData();
      }
      // this.getCreditsData();
    });

    this.emitClearFilter = this.reuseableFilterService.emitClearFilter.subscribe(() => {
      this.resetPageObj(); // reset pagination after clearing filter
      this.getMetaData();
      this.getCreditsData();
    });

    this.applyFilterEmitter = this.reuseableFilterService.applyFilterEmitter.subscribe(() => {
      this.resetPageObj(); // reset pagination after applying filter
      this.getCreditsData();
    });
    this.manageColumnEmitter = this.creditOverviewService.manageColumnEmitter.subscribe((colList) => {
      for (let i = 0; i < colList.length; i++) {
        const colObj = colList[i];
        if (this.gridOptions.columnApi) {
          this.gridOptions.columnApi.setColumnVisible(colObj.field, colObj.checked);
        }
      }
    });
  }

 // to check if engage support is already submitted
  checkIntitiatePaRequest() {

    this.blockUiService.spinnerConfig.customBlocker = false;

    this.creditOverviewService.showPAEngageSupport().subscribe((res: any) => {
        
     //Once data is loaded then show support button 
      this.showSupportButton = true;

      if (res && !res.error) {
        this.requestPa = res.data;
      } else {
        //this.messageService.displayMessagesFromResponse(res);
        this.errorInResponse = true;
      }
    });
  }

  removeEngageSupport() {
    
    
    this.blockUiService.spinnerConfig.customBlocker = false;

    let type = 'CANCEL';
    this.creditOverviewService.removePAEngageSupport(type).subscribe((res: any) => {
      if (res && !res.error) {
 
          this.requestPa = !this.requestPa;
          this.copyLinkService.showMessage('You have successfully cancelled the request for purchase adjustment');
      } else {
        // if api fails or error present, make to defualt value
       // this.messageService.displayMessagesFromResponse(res);
       this.errorInResponse = true;
      }
    });
  }

  ngOnDestroy() {
    if(this.manageColumnEmitter){
      this.manageColumnEmitter.unsubscribe();
    }
    if(this.emitClearFilter){
      this.emitClearFilter.unsubscribe();
    }
    if(this.applyFilterEmitter){
      this.applyFilterEmitter.unsubscribe();
    }
    if(this.creditOverviewSearchEmitter){
      this.creditOverviewSearchEmitter.unsubscribe();
    }
  }

  // method to set dummy top level filter data 
  setTopFilterData(topFilterData) {
    for (const filter of topFilterData) {
      if (filter.name === "IDENTIFIERS" && !this.appDataService.isPatnerLedFlow) {
        this.identifierDropDown = filter;
      } else if(filter.name === "partnerIdentifiers" && this.appDataService.isPatnerLedFlow){
        this.identifierDropDown = filter;
      } else if (filter.name === "creditApplied") {
        this.creditStatusDropDown = filter;
      } else if (filter.name === "creditEligibility") {
        this.eligibilityDropDown = filter;
      }
    }
    // console.log(this.identifierDropDown, this.creditStatusDropDown, this.eligibilityDropDown);
  }

  close() {
    this.blockUiService.spinnerConfig.customBlocker = true;
    this.priceEstimationService.showCredits = false;
    this.reuseableFilterService.appliedFilterCount = 0;
    this.reuseableFilterService.filterObject = { data: { type: '' } };
    this.reuseableFilterService.selectedFilterData.clear();
    this.renderer.removeClass(document.body, 'scroll-y-none');
  }

  onColumnEvent(event) {
    const groupIds = ['0', '1', '2', '3'];
    groupIds.forEach(function (id) {
      if (event.columnGroup.groupId !== id && event.columnGroup.expanded) {
        event.columnApi.setColumnGroupOpened(id, false);
      }
    })
  }

  getMetaData() {
    this.errorInResponse = false;
    this.blockUiService.spinnerConfig.customBlocker = false;
    // this.reuseableFilterService.filterObject.data.filters = [];
    this.columnDefs = [];
    this.reuseableFilterService.selectedFilterData.clear();
    this.setSearchDropdowns(this.type);
    this.creditOverviewService.getMetaData(this.type).subscribe((response: any) => {
      // this.blockUiService.spinnerConfig.unBlockUI();
      // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if (response && !response.error && response.data) {
        try {
          // this.columnDefs = response.data.columnData;
          if(this.partnerLedFlow ){
            this.leftFilterData = response.data.partnerLeftFilter;
          }
          else{
            this.leftFilterData = response.data.leftSideFilters;
          }
          this.topFilterData = response.data.topSideFilters;
          this.identifierData = response.data.identifierData;
          this.isFilterDataLoaded = true;
          this.setTopFilterData(this.topFilterData);

          this.columnDefs = response.data.columnData;
          this.defaultView = response.data.columnData;
          this.prepareColData();
          
          //this.getCreditsData();

        } catch{
          this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          //this.messageService.displayUiTechnicalError();
          this.errorInResponse = true;
        }
      } else if (response.error) {
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
       // this.messageService.displayMessagesFromResponse(response);
       this.errorInResponse = true;
      } else {
        //this.messageService.displayUiTechnicalError();
        this.errorInResponse = true;
      }
    });
  }

  prepareColData(){
    for (let i = 0; i < this.columnDefs.length; i++) {
      const column = this.columnDefs[i];
      column.cellRenderer = 'gridCell';
      if (i === 0) {
        column.cellClass = this.columnIdClass;
      } else {
      column.cellClass = this.creditColumnClass;
      }
      column.suppressMovable = true;
      if (column.children) {
        let childArr = column.children;
        for (let j = 0; j < childArr.length; j++) {
          childArr[j].headerClass = 'child-header';
          childArr[j].cellClass = this.creditColumnClass;
          childArr[j].cellRenderer = 'gridCell';
          childArr[j].suppressMovable = true;
        }
      }
    }
    this.blockUiService.spinnerConfig.customBlocker = false;
    if (this.gridOptions) {
      this.gridOptions.columnDefs = this.columnDefs;
    }
  }
  // method to reset pagination object
  resetPageObj() {
    this.paginationObject.page = 1;
    this.paginationObject.pageSize = 50;
  }

  getCreditsData() {
    // this.blockUiService.spinnerConfig.customBlocker = false;
    //create the request obj and add type in it.
    this.errorInResponse = false;
    this.isDataLoaded = false;
    this.isDataPresent = false;
    const reqJson = this.reuseableFilterService.filterObject;
    reqJson.data['page'] = {
      'currentPage': this.paginationObject.page,
      'noOfPages': 0,
      'noOfRecords': 0,
      'pageSize': this.paginationObject.pageSize,
    };
    this.blockUiService.spinnerConfig.customBlocker = false;
    this.creditOverviewService.getCreditData(reqJson).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        try {
          this.blockUiService.spinnerConfig.customBlocker = false;
          this.isDataLoaded = true;
          // check for creditoverviews present in data and set rowdata and isDataLoaded & isDataPresent flags to show/hide message and grid
          if (response.data.creditOverviews) {
            this.rowData = response.data.creditOverviews;
            if (this.rowData !== undefined && this.rowData.length > 0) {
              this.isDataPresent = true;
              
            } else {
              this.isDataPresent = false;
              //this.isDataLoaded = false;
            }
          } else {
            this.isDataPresent = false;
            this.rowData = [];
          }

          this.paginationObject.collectionSize = response.data.page.noOfRecords;
          this.paginationObject.page = response.data.page.currentPage;
          this.paginationObject.pageSize = response.data.page.pageSize;

          if (this.gridApi) {
            this.gridApi.setRowData(this.rowData);
          }

          setTimeout(() => {
            this.blockUiService.spinnerConfig.unBlockUI();
            this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          }, 2500);
        } catch{
          this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          //this.messageService.displayUiTechnicalError();
          this.errorInResponse = true;
        }
      } else if (response.error) {
        this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        //this.messageService.displayMessagesFromResponse(response);
        this.errorInResponse = true;
      } else {
        //this.messageService.displayUiTechnicalError();
        this.errorInResponse = true;
      }

      
      setTimeout(() => {
        this.utilitiesService.creditTableHeight();
      }, 500);
    });
  }

  openDownloadModal() {
    const modalRef = this.modalVar.open(DownloadRequestComponent, {
      windowClass: "download-request"
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    setTimeout(() => {
      this.utilitiesService.creditTableHeight();
    }, 200);
    if (this.type !== 'IB') {
      setTimeout(() => {
        this.gridApi.setHeaderHeight(60);
      }, 200);
    } else {
      setTimeout(() => {
        this.gridApi.setHeaderHeight(45);
      }, 200);
    }
    // const columnToolPanel = this.gridApi.getToolPanelInstance('columns');
    // columnToolPanel.setPivotSectionVisible(true);
  }

  creditColumnClass(params) {
    if (params.value === 'N') {
      return 'rejected-cell'
    } else if (params.value === 'Y') {
      return 'approved-cell'
    } else if(params.colDef.isQuantity){
      return 'text-right'
    } else {
      return '';
    }
  }

  columnIdClass(params) {
    if(params.data.outsideProposalScopeYorn === 'Y') {
      return 'approved-cell-matched';
    } else if(params.data.outsideGUScopeYorn=== 'Y') {
      return 'rejected-cell-matched';
    } else if(params.data.withinProposalScopeYorn === 'Y') {
      return 'approved-cell-grey';
    } 
  //   else {
  //     return 'approved-cell-matched';
  //  }
  }

  ChangeSearchLabel(SearchLabel: string) {
    this.selectedSearchLabel = SearchLabel;
  }

  ChangeviewLabel(viewLabelObj, dropdownObj) {
    if(viewLabelObj.value === 'allidentifiers'){
      this.columnDefs = this.defaultView;
    } else {
      for(let i = 0; i < this.identifierData.length; i++){
        if(viewLabelObj.value === this.identifierData[i].category){
          this.columnDefs = this.identifierData[i].columnData;
          break;
        }
      }
    }
    this.prepareColData();
    this.selectedViewLabel = viewLabelObj.name;

  }

  ChangecreditLabel(creditLabelObj, dropdownObj) {
    let fieldName = '';
    fieldName = dropdownObj.name;
    this.selectedCreditLabel = creditLabelObj.name;

    if (creditLabelObj.value === "All" && this.reuseableFilterService.filterObject.data[fieldName]) {
      delete this.reuseableFilterService.filterObject.data[fieldName];
    } else {
      this.reuseableFilterService.filterObject.data[fieldName] = creditLabelObj.value;
    }
    this.getCreditsData();
  }

  ChangeeligibilityLabel(eligibilityLabelObj, dropdownObj) {
    let fieldName = '';
    fieldName = dropdownObj.name;
    this.selectedEligibilityLabel = eligibilityLabelObj.name;

    if (eligibilityLabelObj.value === "All" && this.reuseableFilterService.filterObject.data[fieldName]) {
      delete this.reuseableFilterService.filterObject.data[fieldName];
    } else {
      this.reuseableFilterService.filterObject.data[fieldName] = eligibilityLabelObj.value;
    }
    this.getCreditsData();
  }

  // method to set searchdropdown
  setSearchDropdowns(type) {
    if (type === 'IB') {
      this.searchDropdown = [
        // { id: 'searchAll', name: 'All' },
        { id: 'installSiteId', name: 'Install Site ID' },
        { id: 'installSiteName', name: 'Install Site Name', partialSearch: true },
        { id: 'contractId', name: 'Contract ID' },
        { id: 'productSoId', name: 'Product SO ID' },
        { id: 'serviceSoId', name: 'Service SO ID' },
        { id: 'productId', name: 'Product ID', partialSearch: true }
      ];
    } else if (type === 'SBP') {
      this.searchDropdown = [
        // { id: 'searchAll', name: 'All' },
        { id: 'installSiteId', name: 'Install Site ID' },
        { id: 'installSiteName', name: 'Install Site Name' , partialSearch: true},
        // { id: 'contractId', name: 'Contract ID' },
        { id: 'webOrderId', name: 'Web Order ID' },
        { id: 'subscriptionReferenceId', name: 'Subscription Reference ID' },
        { id: 'productId', name: 'Product ID',partialSearch: true }
      ];
    } else if(type === 'BOOKINGS' && this.partnerLedFlow ){
      this.searchDropdown = [
        // { id: 'searchAll', name: 'All' },
        { id: 'salesOrderNumber', name: 'Sales Order Number' },
        { id: 'endCustomerName', name: 'Customer Name' , partialSearch: true },
       // { id: 'productSoId', name: 'Product SO ID' },
        { id: 'productId', name: 'Product ID', partialSearch: true }
      ]
  }
     else {
      this.searchDropdown = [
        // { id: 'searchAll', name: 'All' },
        { id: 'salesOrderNumber', name: 'Sales Order Number' },
        { id: 'endCustomerName', name: 'Customer Name' , partialSearch: true },
       // { id: 'productSoId', name: 'Product SO ID' },
        { id: 'productId', name: 'Product ID', partialSearch: true },
        { id: 'webOrderId', name: 'Web Order ID' }
      ];
    }
  }


  getSearchText(event) { }

  changeView(type) {
    this.blockUiService.spinnerConfig.startChain();
    this.isSearchApplied = false;
    if (type === 'SBP') {
      this.isSubscriptionsSelected = true;
    } else {
      this.isSubscriptionsSelected = false;
    }
    this.type = type;

    this.reuseableFilterService.filterObject = { data: { type: this.type } };
    this.setSearchDropdowns(type);
    this.creditOverviewService.resetFilter.emit();
    this.resetPageObj(); // reset pagination after changing the view  
    this.getMetaData();
    this.getCreditsData();
    this.selectedViewLabel = "All Identifiers";
    this.selectedEligibilityLabel = "Eligible/Not Eligible";
    this.selectedCreditLabel = "Credit Applied/Credit Not Applied";
    if (type !== 'IB') {
      setTimeout(() => {
        this.gridApi.setHeaderHeight(60);
      }, 500);
    } else {
      setTimeout(() => {
        this.gridApi.setHeaderHeight(45);
      }, 500);
      
    }
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.paginationObject.pageSize = newPageSize;
    this.paginationObject.page = 0;
    //try {
      this.getCreditsData();
    // } catch (error) {
      // console.error(error.ERROR_MESSAGE)
    //  this.messageService.displayUiTechnicalError(error);
   // }
  }


  pageChange() {
    //   this.paginationObject.page  = this.paginationObject.page
   // try {
      this.getCreditsData();
    // } catch (error) {
    //   // console.error(error.ERROR_MESSAGE)
    //   this.messageService.displayUiTechnicalError(error);
    // }
  }


  engageSupport() {

    this.blockUiService.spinnerConfig.customBlocker = false;
    // method to get reason code for exception
    this.creditOverviewService.initiateExceptionRequest().subscribe((res: any) => {
      if (res && res.data && !res.error) {
        this.openSupportModel(res.data); // set exception data from api to modal
      } else {
        //this.messageService.displayMessagesFromResponse(res);
        this.errorInResponse = true;
      }
    });
  }

  openSupportModel(data) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'engage-modal-wrapper'
    };

    const modalRef = this.modalVar.open(EngageSupportComponent, ngbModalOptions);
    modalRef.componentInstance.exceptionDataObj = data;
  
    modalRef.result.then((result) => {
      //console.log(result)
      // after result set the request obj
      const requestObj = { data: {} };
      if (result.continue === true) {
        // if submit , set the request obj to local obj and show submit for approval button
        // this.isExceptionSubmitted = false;
        //     this.isExceptionWithdrawn = false;
        this.submitException(result.requestData);
        if(result.goTopriceEst){
          this.close();
        }
      }
      
    });
  }

  submitException(data) {

    this.blockUiService.spinnerConfig.customBlocker = false;

    const requestObj = {};
    requestObj["data"] = {
      'reasons': data.exceptions[0].selectedReasons,
      'justification': data.comment,
    }

    this.creditOverviewService.submitEngagement(requestObj).subscribe((res: any) => {
      if (res && !res.error) {
          this.requestPa = !this.requestPa;

      } else {
       // this.messageService.displayMessagesFromResponse(res);
       this.errorInResponse = true;
      }
    });
  }

  updateSearch(item, event){
    if(event.target.checked){
      this.reuseableFilterService.filterObject.data[item] = 'Y';
    } else {
      this.reuseableFilterService.filterObject.data[item] = 'N';
    }
    this.getCreditsData();
  }

}
export interface PaginationObject {
  collectionSize?: number;
  page: number;
  pageSize: number;
}

