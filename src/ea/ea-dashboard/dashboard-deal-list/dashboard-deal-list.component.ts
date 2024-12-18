import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService, PaginationObject } from 'ea/ea.service';
import { userInfo } from 'os';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-dashboard-deal-list',
  templateUrl: './dashboard-deal-list.component.html',
  styleUrls: ['./dashboard-deal-list.component.scss']
})
export class DashboardDealListComponent implements OnInit, OnDestroy {

  constructor(private eaRestService: EaRestService, public eaStoreService: EaStoreService, public localizationService: LocalizationService, public eaService: EaService, public constantsService: ConstantsService, public router: Router, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }
  dealListData: any = [];
  displayGrid = false;
  request = {
  //  "createdByMe": true,
   // "userId": "mariar",
    "currentPageNumber": 1,
    "sortColumn": "projectUpOn",
    "numberOfRowsPerPage": 10,
    "searchCriteriaList": [
      {
        'searchKey': 'DISPLAYFILTER', 'searchValue': 'createdByMe'
      }
    ],
    "allOrder":"N"
  }
  userInfoData: any;
  paginationObject: PaginationObject;
  selectedView = this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME');
  viewOptions = [this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME'), this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_TEAM')];
  openDrop = false;
  showSearchDrop = false;
  selectedDropValue : any = {};
  searchDropdown = [
    { id: 'PROPOSALLIST.PROPOSALID', name: 'Proposal ID' },
    { id: 'DEALID', name: 'Deal ID' },
    { id: 'DEALNAME', name: 'Deal Name' },
    { id: 'CUSTOMERNAME', name: 'Customer Name' },
    { id: 'PROJECTNAME', name: 'Project/Qualification Name' }
  ];
  searchParam = '';
  isSearchedData =  false;
  isPartnerLoggedIn = false;
  searchInputValue = '';
  isFilterApplied = false;
  filterMetaData: any = [];
  selectedFilters: any = []; // set selected filters from filters
  creatorFilter: any; // set slected creator filter from filters
  public subscribers: any = {};
  messagesObj = {
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    info: new Array<Message>() 
  };
  sharedByCiscoDataView = false; // set to show  sharedby cisco filter data
  ngOnInit() {
    this.userInfoData = this.eaStoreService.userInfo;
   // this.request.userId = this.userInfoData.data.userId;
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    } else {
      this.isPartnerLoggedIn = false;
    }
    this.paginationObject = { noOfRecords: 50, currentPage: 1, pageSize: 50, noOfPages: 1 };
    this.selectedDropValue = this.searchDropdown[0];
    this.getDealListData();
    // this.getFilterMetaData(); // get filters metadata
    // when applied filter call filter selection 
    this.subscribers.onFilterSelection = this.eaService.onFilterSelection.subscribe((data: any) => {
      this.filerSelection(data);
    });
  }

  getDealListData() {
    if (!this.searchParam && this.request['searchCriteriaList'] && !this.isFilterApplied){
      this.setCreaterFilter();
    }
    // this.request.createdByMe = this.selectedView === 'Created By Me' ? true : false;
    this.displayGrid = false;
    const url = 'home/projectlist';
    this.eaRestService.postApiCall(url, this.request).subscribe((response: any) => {
    // const url = 'assets/vnext/ea_dashboard_list.json';
    // this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if (response && response.data && !response.error){
        this.displayGrid = true;
        this.eaStoreService.isUserApprover = response.data.approver ? true : false;
        this.paginationObject.noOfRecords = response.data.totalRecords ? +response.data.totalRecords : null;
        this.paginationObject.currentPage = response.data.currentPage;
        this.paginationObject.pageSize = response.data.noOfRows;
        this.paginationObject.noOfPages = response.data.totalPages;
        this.isSearchedData = this.searchParam ? true : false;
        if(this.creatorFilter?.searchValue === 'sharedByCisco' && response.data.responseDataList?.length){
          for(let dealData of response.data.responseDataList){
            if(dealData?.proposalList?.length){
              dealData.proposalList = dealData.proposalList.filter(proposal => proposal?.quoteID);
            }
          }
        }
        this.dealListData = response.data.responseDataList;
      } else {
        this.dealListData = [];
      }
    });
  }

  paginationUpdated(event){
    this.request = {
    //  "createdByMe": true,
     //  "userId": this.userInfoData.data.userId,
      "currentPageNumber": event.currentPage,
      "sortColumn": "projectUpOn",
      "numberOfRowsPerPage": event.pageSize,
      "searchCriteriaList": [
        {
          'searchKey': 'DISPLAYFILTER', 'searchValue': 'createdByMe'
        }
      ],
      "allOrder":"N"
   };
   if (this.isSearchedData){
    this.request['searchCriteriaList'] = [{ 'searchKey': this.selectedDropValue.id, 'searchValue': this.searchParam }];
     if (this.creatorFilter) {
       this.request['searchCriteriaList'].push(this.creatorFilter);
     }
   } else if (this.isFilterApplied && this.selectedFilters.length) {
    this.request['searchCriteriaList'] = this.selectedFilters;
   }
   this.request.allOrder = this.eaStoreService.isAllRecordsSelected ? 'Y' : 'N';
  this.getDealListData();
 }

  selectedCreatedBy(value) {
    this.selectedView = value;
    const searchValue = value === 'Created By Me' ? 'createdByMe' : 'createdByTeam'
    this.request.searchCriteriaList = [{
      searchKey: "DISPLAYFILTER",
      searchValue: searchValue
    }]
    this.resetPagination();
    this.request.sortColumn= "projectUpOn";
    this.openDrop = false;
    this.searchParam = '';
    this.getDealListData();
  }

  openPropsalList(data, noProposal=false) {
    // if(data.dealType !== '3' && data.dealType !== '5'){
    //   return;
    // }
    
    this.eaStoreService.projectId = data.projectObjId;
    this.eaStoreService.selectedDealData = {};
    this.eaStoreService.selectedDealData = data;
    this.eaStoreService.showProposalsFromDeal = true;
    if(noProposal) {
      this.eaStoreService.selectedDealData['noProposal'] = true;
    }
  }

  updateSearch(value) {
    this.selectedDropValue = value;
    this.showSearchDrop = false;
  }

  ngOnDestroy(){
    this.eaStoreService.showHideFilterMenu = false;
    this.eaStoreService.selectedDealData = {};
    if (this.subscribers.onFilterSelection){
      this.subscribers.onFilterSelection.unsubscribe();
    }
  }

  getDealData() {
    if (!this.searchParam || !this.searchParam.trim().length) {
      return;
    }
    this.isFilterApplied = false;
    this.selectedFilters = [];
    this.searchParam = this.searchParam.trim();
    this.searchInputValue = this.searchParam;
    if (Object.keys(this.selectedDropValue).length) {
      this.request.currentPageNumber = 1;
      this.request.sortColumn= "projectUpOn",
      this.request['searchCriteriaList'] = [{ 'searchKey': this.selectedDropValue.id, 'searchValue': this.searchParam }];
    }
    if(this.creatorFilter && this.request['searchCriteriaList']){
      this.request['searchCriteriaList'].push(this.creatorFilter);
    }
    this.getDealListData();
  }

  goToProject(data) {
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    if (data.buyingProgram === '3.0' || data.buyingProgram === 'spna'){
     this.eaService.updateDetailsForNewTab();
     window.open(url + 'ea/project/' + data.projectObjId);
    } else {
      window.open(url + 'qualifications/' + data.projectId);
    }
  }

  //to set selected filter of created by 
  filerSelection($event) {
    const searchData = this.isSearchedData ? this.request.searchCriteriaList : [];
    // this.isSearchedData =  false;
    this.isFilterApplied = true;
    // this.searchParam = '';
    this.selectedFilters = [];
    // call list data with selectedFilters
    if ($event.length){
      this.request.searchCriteriaList = searchData.concat($event);
      this.selectedFilters = $event;
      for (let filterData of this.selectedFilters) {
        if(filterData.searchKey === "DISPLAYFILTER"){
          this.creatorFilter = filterData;
          this.eaStoreService.dashboardCreatorFilter = filterData;
        }
      }
    } else {
      this.request['searchCriteriaList'] = [
        {
          'searchKey': 'DISPLAYFILTER', 'searchValue': 'createdByMe'
        }
      ];
    }
    this.resetPagination();
    this.request.sortColumn= "projectUpOn";
    this.request.allOrder = this.eaStoreService.isAllRecordsSelected ? 'Y' : 'N';
    this.getDealListData();
  }

  clearSearchInput(){
    this.isSearchedData =  false;
    this.isFilterApplied = false;
    this.searchParam = '';
    this.selectedFilters = [];
    this.resetPagination();
    this.setCreaterFilter();
    this.getDealListData();
  }

  // to get filters metadata for dashboard
  getFilterMetaData(){
    const url = 'assets/vnext/ea_dashboard_filter.json';
    this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if (response && !response.error){
        this.filterMetaData = response.data;
        this.filterMetaData.forEach(element => {
          element.showFilters = true;
        });
      }
    }); 
  }

  // reset pagination to defaults , current page:1 , numberOfRowsPerPage: 10
  resetPagination() {
    this.request.currentPageNumber = 1;
    this.request.numberOfRowsPerPage = 10;
  }


  // check and set creater filter
  setCreaterFilter(){
    if (this.creatorFilter) {
      this.request['searchCriteriaList'] = [
        this.creatorFilter
      ];
    } else {
      this.request['searchCriteriaList'] = [
        {
          'searchKey': 'DISPLAYFILTER', 'searchValue': 'createdByMe'
        }
      ];
    }
  }

  gotoSalesActions() {
    this.router.navigate(['ea/guideActions'])
  }
  
  // route to proposal page
  goToProposal(data) {
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    if (data.buyingProgram === '3.0' || data.buyingProgram === 'spna'){
     this.eaService.updateDetailsForNewTab();
     window.open(url + 'ea/project/proposal/' + data.proposalList[0].proposalObjId);
    } else {
      window.open(url + 'qualifications/proposal/' + data.proposalList[0].proposalId);
    }
  }

  // to open quote url
  openQuoteUrl(proposal) {
    let url = 'proposal/ccw-quote-link?p=' + proposal.proposalObjId;
    this.messagesObj.errors = [];
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (response && response.data && !response.error) {
        window.open(response.data, '_blank'); // open redirect url from response
      } else {
        if (response.messages && response.messages.length) {
          this.checkAndSetErrorMessages(response.messages);
        }
      }
      
    });
  }

  // check and set error messages for quote API
  checkAndSetErrorMessages(messages){
    for (let i = 0; i < messages.length; i++) {
      const errorMsg = messages[i];

      const message: Message = {
        text: errorMsg.text,
        type: errorMsg.severity,
        code: errorMsg.code
      };
      if (errorMsg.severity === MessageType.Error) {
        message.type = MessageType.Error;
        this.messagesObj.errors.push(message);
      }
    }
  }

}

export interface Message {
  type: MessageType;
  text: string;
  code?: string;
}

export enum MessageType {
  Success = 'SUCCESS ',
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING',
  Warn = 'WARN'
}
