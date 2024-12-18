import { UserInfoJson } from './../../header/header.component';
import { ProposalDataService } from './../../proposal/proposal.data.service';
import { PurchaseOptionsComponent } from '@app/modal/purchase-options/purchase-options.component';
import { PermissionEnum } from '@app/permissions';
import { PermissionService } from '@app/permission.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Renderer2,
         OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { ConstantsService, QualProposalListObj } from '@app/shared/services/constants.service';
import { MessageService } from '@app/shared/services/message.service';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { Router } from '@angular/router';
import { LocaleService } from '@app/shared/services/locale.service';
import { DeleteQualificationComponent } from '@app/modal/delete-qualification/delete-qualification.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditQualificationComponent } from '@app/modal/edit-qualification/edit-qualification.component';
import { DealListService } from './deal-list.service';
import { GridOptions } from 'ag-grid-community';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { DealCellComponent } from './deal-cell/deal-cell.component';

@Component({
  selector: 'app-deal-list',
  templateUrl: './deal-list.component.html',
  styleUrls: ['./deal-list.component.scss']
})
export class DealListComponent implements OnInit, OnDestroy, OnChanges {
  dealData: QualProposalListObj;
  @Input() public searchDeal = '';
  toProposalSummary = false;
  searchArray = ['dealID', 'dealName', 'endCustomerName', 'quoteID'];
  @Output() dealDataRecieved = new EventEmitter();
  searchQual = true;
  globalView = false;
  searchDealBy: string;
  showFullList = false;
  public subscribers: any = {};
  loggedInUser: any;
  @Input() dealCreatedByTeam;
  @Input() userDashboard;

  DealViewOptions = ['Created by Me', 'Created by my Team'];
  openDealDrop = false;
  selectedDealView = 'Created by Me';
  paginationObject: PaginationObject;

  // Variables for grid view
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  displayGridView = false;
  hideDealGrid = false;
  dataNotLoaded = true;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  searchDropdown = [
    { id: 'DEALID', name: 'Deal ID' },
    { id: 'DEALNAME', name: 'Deal Name' },
    { id: 'ENDCUSTOMERNAME', name: 'Customer Name' }
  ];
  dealSearchObject = null;

  constructor(public localeService: LocaleService, public constantsService: ConstantsService, private dashboardService: DashboardService,
    private messageService: MessageService, private modalVar: NgbModal, private qualService: QualificationsService,
    public appDataService: AppDataService, public permissionService: PermissionService, public dealListService: DealListService,
    private renderer: Renderer2, private router: Router, private proposalDataService: ProposalDataService,
    public partnerDealCreationService: PartnerDealCreationService, public utilitiesService: UtilitiesService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 21;
    this.paginationObject = { collectionSize: 50, page: 1, pageSize: 50 };
    this.gridOptions.frameworkComponents = {
      dealCell: <{ new(): DealCellComponent }>(
        DealCellComponent
      )
    };
    this.gridOptions.context = {
      parentChildIstance: this,
    };
  }

  ngOnInit() {
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.dealData = { data: '' };
   
    if (this.userDashboard) {
      this.displayGridView = false;
    } else {
      this.displayGridView = true;
    }
    this.appDataService.isGroupSelected = true;
    this.globalView = !this.dealListService.isCreatedByMe;
    if(this.appDataService.userInfo.distiUser){
        this.DealViewOptions[1] = 'Created by Partner';
    }

    if (!this.globalView) {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.MY_DEAL');
      this.selectedDealView = this.DealViewOptions[0];
    } else {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.TEAM_DEAL');
      this.selectedDealView = this.DealViewOptions[1];
     
    }
    if (this.permissionService.permissions.size === 0) {
      if (!this.qualService.flowSet) {
        this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
      }
      this.appDataService.isReload = true;
      this.appDataService.findUserInfo();
    } else {
      this.loadDealList();
    }
    this.subscribers.dealList = this.appDataService.createQualEmitter.subscribe(() => {
      this.dealListService.showFullList = true;
      this.loadDealList();
      this.loggedInUser = this.appDataService.userInfo.userId;
    });

    this.subscribers.dealSearchEmitter = this.dealListService.dealSearchEmitter.subscribe((dealObj) => {
      this.dealListService.showFullList = true;
      this.dealSearchObject = dealObj;
      this.loadDealList();
      this.loggedInUser = this.appDataService.userInfo.userId;
    });

    this.loggedInUser = this.appDataService.userInfo.userId;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['dealCreatedByTeam'].previousValue !== changes['dealCreatedByTeam'].currentValue
      && !changes['dealCreatedByTeam'].isFirstChange()) {
      this.globalView = this.dealCreatedByTeam;
      if (this.dealCreatedByTeam) {
        this.dealListService.showFullList = true;
      } else {
        this.dealListService.showFullList = false;
      }
      this.getDealData(!this.dealCreatedByTeam);
    }
  }

  // search deal event only grid view
  searchByDeal(event) {
    if (this.displayGridView && this.searchDeal.trim() !== '') {
      this.onFilterTextBoxChanged(); // call this method only if seach is not empty
    }
  }
  loadDealList() {
    if (this.dealListService.showFullList) {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.myDeal;
      this.showFullList = true;
    }
    this.getDealData(!this.globalView);
  }

  ngOnDestroy() {
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.proposalDataObject.proposalData.groupName = '';
    if (this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.userDashboard) {
      this.dealListService.showFullList = false;
    }
    if (this.subscribers.dealList) {
      this.subscribers.dealList.unsubscribe();
    }
    if (this.subscribers.dealSearchEmitter) {
      this.subscribers.dealSearchEmitter.unsubscribe();
    }
    this.appDataService.isReload = false;
  }
  onClickedOutside(event) {
    this.openDealDrop = false;
  }
  // method to switch for further use
  globalSwitchChange(event) {
    if (!this.userDashboard) {
      this.dealListService.dealSearchChangesEmitter.emit();
      this.dealSearchObject = null;
    }
    this.globalView = !this.globalView;
    this.paginationObject.page = 1;
    this.hideDealGrid = false;
    this.searchDeal = '';
    this.getDealData(!this.globalView);
    // if(this.gridOptions.api){
    //   if (this.globalView) {
    //     this.rowData = this.dealData.data.filter(item => item.dealCreator !== this.loggedInUser);
    //   }
    //   this.gridOptions.api.setRowData(this.rowData);
    //   this.gridOptions.api.refreshCells();
    // }
  }

  onFilterTextBoxChanged() {
    // console.log(this.searchProposalBy)
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(this.searchDeal);
      // take the length of data fount after filter
      const count = this.gridOptions.api.getRenderedNodes().length;
      // check and show grid if data present
      if (count === 0) {
        this.hideDealGrid = true;
      } else {
        this.hideDealGrid = false;
      }
      this.dataNotLoaded = false;
    }
  }

  getDealData(createdByMe) {
    this.dashboardService.dealLoader = true;
    this.dashboardService.fullLoader = false;
    this.dashboardService.getDealData(this.dealListService.showFullList, createdByMe, this.paginationObject.pageSize,
      this.paginationObject.page, this.dealSearchObject).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        try {
          if (response.data.responseDataList && response.data.responseDataList.length > 0) {
            this.dealData.data = response.data.responseDataList;
            this.rowData = this.dealData.data;
            this.paginationObject.collectionSize = response.data.totalRecords;
            this.paginationObject.page = response.data.currentPage;
            this.paginationObject.pageSize = response.data.noOfRows;
            this.appendId();
          } else {
            this.dealData.data = [];
            this.rowData = [];
          }
          if (this.gridOptions.api) {
            if (this.globalView) {
              this.rowData = this.dealData.data.filter(item => item.dealCreator !== this.loggedInUser);
            }
            this.gridOptions.api.setRowData(this.rowData);
            this.gridOptions.api.refreshCells();
          }
          this.dealListService.dealListData = response;
          this.dealData.isCreatedByMe = true;
          this.dealListService.isCreatedByMe = createdByMe;
          if (!this.dealListService.showFullList) {
            this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
            this.dealDataRecieved.emit(this.dealData.data);
          }
          // code changes for... if created by team switch is ON at dashboard page
          if (this.dealListService.showFullList && this.userDashboard && this.globalView) {
            this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
            this.dealDataRecieved.emit(this.dealData.data);
            this.dashboardService.dealLoader = false;
          }

        } catch (error) {
          this.dashboardService.dealLoader = false;
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.dashboardService.dealLoader = false;
        this.messageService.displayMessagesFromResponse(response);
      }
      setTimeout(() => {
        if (!this.dealListService.showFullList) {
          this.dashboardService.dealLoader = false;
          // adding pageContext here as it is getting updated while loading my proposal section.
          this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
        }
      }, 2000);
    });
  }


  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.paginationObject.pageSize = newPageSize;
    this.paginationObject.page = 1;
    try {
      this.loadDealList();
    } catch (error) {
      // console.error(error.ERROR_MESSAGE)
      this.messageService.displayUiTechnicalError(error);
    }
  }

  pageChange() {
    //   this.paginationObject.page  = this.paginationObject.page
    try {
      this.loadDealList();
    } catch (error) {
      // console.error(error.ERROR_MESSAGE)
      this.messageService.displayUiTechnicalError(error);
    }
  }




  getQualListForDeal(dealData) {
    const customerId = null;
    const dealId = dealData.dealID;
    // const dealId = 40480809;
    // assigning deal data so that we can use it for header; not getting deal related data on the qual list page
    this.qualService.dealData = dealData;
    this.qualService.dealData.dealId = dealId;
    this.appDataService.quoteIdForDeal = dealData.quoteID;
    // this flag is to manage header if partner is landing on qual lsit page for a deal.
    this.appDataService.qualListForDeal = true;
    this.router.navigate([
      'qualifications/create-qualifications',
      {
        dId: dealId,
        qId: this.appDataService.quoteIdForDeal
      }
    ]);
  }


  viewQualSummary(qualObject) {
    this.qualService.toProposalSummary = false;
    this.qualService.viewQualSummary(qualObject);
  }


  focusDealIdInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  toggleView() {
    this.displayGridView = !this.displayGridView;
  }

  onGridReady(event) {
    this.getTableColumnsData();
    // this.getTableData();
  }

  getTableColumnsData() {
    this.dealListService.getColumnsData().subscribe((response) => {
      if (response) {
        this.columnDefs = response;
        for (let i = 0; i < this.columnDefs.length; i++) {
          const column = this.columnDefs[i];
          if (column['field'] === 'dealName') {
            column.cellRenderer = 'dealCell';
          }
          if (column['field'] === 'dealExpectedCloseDate') {
            column.cellRenderer = this.getDate;
          }
          if (column['field'] === 'dealCreator') {
            column.cellRenderer = this.getDealOwner;
          }
        }

        // this.getTableData();
      }
    });
  }

  // method to set deal name and download icon with tooltip
  getDealName(params) {
    const tooltip = `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> Download LoCC</span></div>`;
    const dealName = '<span class="text-link">' + params.value + '</span>';
    const downloadIcon = '<a #downloadZipLink [hidden]="true"></a><a href="javascript:" style="position: absolute;right: 0;top: 0px; width: 19px; height: 30px;padding-top: 6px;"><span class="custom-tooltip-locc-wrap"><span class="icon-download-doc" placement="top" container="body"><div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Download Unsigned LoCC</span></div><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span></span></a>';
    return dealName + downloadIcon;
  }

  getDate(params) {
    // check if value is present and not undefined
    if (params.value && params.value !== undefined) {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let newDate = new Date(params.value);
      let day = '' + newDate.getDate();
      if (newDate.getDate() <= 9) {
        day = '0' + day;
      }
      return day + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear();
    } else {
      return ' ';
    }
  }

  getDealOwner(params) {
    return params.data.partnerContactFName + ' ' + params.data.partnerContactLName + ' (' + params.value + ')';
  }


  onCellClicked($event) {
    // const dropdownClass = $event.event.target.classList.value;
    // if(dropdownClass.search('path5') > -1){ // check for path5 and call method to download LoCC doc
    //   this.downloadLoccDoc($event.data, this.downloadZipLink, 'grid');
    // }else if($event.colDef.field === 'dealName') {
    //   this.getQualListForDeal($event.data);
    // }
  }

  getTableData() {
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      this.gridOptions.api.sizeColumnsToFit();
    }
    if (this.searchDeal) { // if search deal is present call this method to filter the data
      this.onFilterTextBoxChanged();
    } else {
      this.hideDealGrid = false;
    }
  }

  appendId() {
    for (let i = 0; i < this.rowData.length; i++) {
      this.rowData[i].dealName = this.rowData[i].dealName + ' (' + this.rowData[i].dealID + ')';
    }
  }
  selectDeal(value) {
    if (this.selectedDealView !== value) {
      this.dealCreatedByTeam = !this.dealCreatedByTeam;
      this.globalSwitchChange(this.dealCreatedByTeam);
    }
    this.selectedDealView = value;
    this.openDealDrop = false;
    if (this.selectedDealView === 'Created by Me') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.MY_DEAL');
    } else if (this.selectedDealView === 'Created by my Team') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.TEAM_DEAL');
    }
  }

  // method to download LoCC document
  downloadLoccDoc(dataObj, downloadLink, view) {
    let url = '';
    url = 'api/document/partner/download/partnerLoa?partnerBeGeoId=' + dataObj.partnerBeGeoId + '&dealId=' + dataObj.dealID + '&f=0&fcg=0';
    // console.log(url);
    this.partnerDealCreationService.downloadUnsignedDoc(url).subscribe((response: any) => {
      if (response && !response.error) {
        if (view !== 'grid') {
          this.utilitiesService.saveFile(response, this.downloadZipLink);
        } else {
          this.utilitiesService.saveFile(response, downloadLink);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

}
export interface PaginationObject {
  collectionSize?: number;
  page: number;
  pageSize: number;
}
