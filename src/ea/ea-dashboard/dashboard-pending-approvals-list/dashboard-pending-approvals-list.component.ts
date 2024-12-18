import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService, PaginationObject } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-dashboard-pending-approvals-list',
  templateUrl: './dashboard-pending-approvals-list.component.html',
  styleUrls: ['./dashboard-pending-approvals-list.component.scss']
})
export class DashboardPendingApprovalsListComponent implements OnInit, OnDestroy {

  constructor(private eaRestService: EaRestService, private router: Router, public eaStoreService: EaStoreService, public eaUtilitiesService: EaUtilitiesService, public localizationService: LocalizationService, public constantsService: ConstantsService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  pendingApprovalsData = [];
  paginationObject: PaginationObject;
  request = {
  //  "data": {
    //  "pendingMyApproval": false,
      // "page": {
      //   "pageSize": 10,
      //   "currentPage": 0
      // }
   // },
    "searchCriteriaList": [{"searchKey" : "APPROVALS","searchValue":"TEAM"},{"searchKey": "BUYINGPROGRAM","searchValue": "3.0, 2.0, spna"}],
    "numberOfRowsPerPage": 100,
    "currentPageNumber": 1,
    "sortOrder" :"ASC",
    "sortColumn":"requestedAt"
  }
  selectedView = this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_TEAM_APPROVALS');
  viewOptions = [this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_APPROVALS'), this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_TEAM_APPROVALS')]; //, 'Where I am a reviewer'
  openDrop = false;
  searchParam = '';
  displayGrid = false;
  isSearchedData =  false;
  selectedViewKey = 'TEAM';
  pageType = 'pendingApprovals';
  public subscribers: any = {};
  @Output() selectedListView = new EventEmitter();
  buyingProgramValue = '';
  ngOnInit() {
    this.selectedListView.emit(false);
    this.viewOptions = [this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_APPROVALS'), this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_TEAM_APPROVALS'), this.localizationService.getLocalizedString('ea_dashboard.MY_PROPOSAL_PENDING_FOR_APPROVAL')];

    this.paginationObject = { noOfRecords: 50, currentPage: 1, pageSize: 50, noOfPages: 1 };
    this.getProposalListData();
    this.subscribers.onFilterSelection = this.eaService.onFilterSelection.subscribe((data: any) => {
      const approvarReqObj = [{"searchKey" : "APPROVALS","searchValue":this.selectedViewKey}]
      const reqObj = data.concat(approvarReqObj)
      this.request["searchCriteriaList"] = reqObj;
      this.getProposalListData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscribers.onFilterSelection) {
      this.subscribers.onFilterSelection.unsubscribe();
    }
  }


  getProposalListData(){
    this.isSearchedData = false;
    const url ='home/exceptionspendingapprovals';
    if (this.isSearchedData){
      this.isSearchedData = false;
      this.request.currentPageNumber = 1;
      this.request.numberOfRowsPerPage = 100;
    }
    this.eaRestService.postApiCall(url,this.request).subscribe((response: any)=> {
      if (response && response.data && !response.error) {
        this.displayGrid = true;
        this.pendingApprovalsData =  response.data.responseApproverList;
        this.paginationObject.noOfRecords = response.data.totalRecords ? +response.data.totalRecords : null;
        this.paginationObject.currentPage = response.data.currentPage;
        this.paginationObject.pageSize = response.data.noOfRows;
        this.paginationObject.noOfPages = response.data.totalPages;
      } else {
        this.pendingApprovalsData = [];
      }
    })
  }

  paginationUpdated(event){
  this.request.numberOfRowsPerPage = event.pageSize;
  this.request.currentPageNumber = event.currentPage;
  if (this.searchParam && this.isSearchedData){
    this.searchExceptions();
  } else {
    this.searchParam = '';
    this.getProposalListData();
  }
 }

  goToProposal(proposal){
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    if (proposal.buyingProgram === '3.0' || proposal.buyingProgram === 'spna'){
      this.eaService.updateDetailsForNewTab();
      //this.router.navigate(['ea/project/proposal/' + proposal.objId])
      window.open(url + 'ea/priceestimate/' + proposal.proposalId);
    } else {
      //this.router.navigate(['qualifications/proposal/' + proposal.id])
      window.open(url + 'qualifications/proposal/' + proposal.proposalId);
    }
  }
  

  getSubmittedByName(data) {

    if(data && data.proposalExceptionDetails){
        const submittedByName = data.proposalExceptionDetails[0].createdBy;
        return submittedByName;
    }
  }

  getExceptionRequestedList(data) {
    let exceptionNames = '';
    if(data && data.proposalExceptionDetails){
        const proposalExceptionsArray = data.proposalExceptionDetails;
      for(let i = 0; i < proposalExceptionsArray.length; i++) {
        exceptionNames = exceptionNames + proposalExceptionsArray[i].exceptionName;
      }
      // const tooltip = `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${exceptionNames}</span></div>`;
      // return '<span class="ellipsis custom-tooltip-wrap"><span class="clickProposal">' + exceptionNames + tooltip +'<\span><\span>';
      return exceptionNames;
    }
  }

  approverTeamDropOutside(event, val) {
    val.showApproverTeamDropdown = false;
  }
  // display pending status team name as selected 
  displayApproverTeamName(proposal) {
    if (proposal.approverTeamDetails) {
      proposal.selectedApproverTeamName = proposal.approverTeamDetails[0].approverTeamName;
      proposal.approverTeamDetails.forEach(approverTeam => {
        if (approverTeam.exceptionStatus === 'Pending') {
          proposal.selectedApproverTeamName = approverTeam.approverTeamName;
        }
      });
      return proposal.selectedApproverTeamName;
    }
    return '';
  }

  selectedCreatedBy(value) {
    if (value === this.localizationService.getLocalizedString('ea_dashboard.MY_PROPOSAL_PENDING_FOR_APPROVAL')) {
      this.selectedViewKey = 'PROPOSAL_PENDING_APPROVALS'
      this.selectedListView.emit(true)
    } else if (value === this.localizationService.getLocalizedString('ea_dashboard.PENDING_MY_APPROVALS')) {
      this.selectedViewKey = 'MY';
      this.selectedListView.emit(false)
    } else {
      this.selectedViewKey = 'TEAM';
      this.selectedListView.emit(false)
    }
    this.request["searchCriteriaList"] = [{"searchKey" : "APPROVALS","searchValue": this.selectedViewKey},{"searchKey": "BUYINGPROGRAM","searchValue": "3.0,2.0,spna"}]
    this.selectedView = value;
    this.openDrop = false;
    this.searchParam = '';
    this.request.currentPageNumber = 1;
    this.request.numberOfRowsPerPage = 100;
    this.getProposalListData();
  }

   searchExceptions() {
    if (!this.searchParam || !this.searchParam.trim().length){
      return;
    }
    this.searchParam = this.searchParam.trim();
    let searchCriteriaObj;
    const searchReq = [{"searchKey" : "All","searchValue": this.searchParam}];
    searchCriteriaObj = this.request.searchCriteriaList.concat(searchReq)
    const reqJson = {
     // "createdByMe" : this.request.data.pendingMyApproval,
      //  "type": 'exception',
        // "searchrequest": {
        //   "name": this.searchParam,
        //   "id": this.searchParam,
        //   "customerName": this.searchParam
        // },
        // "page": {
        //   "pageSize": this.request.numberOfRowsPerPage,
        //   "currentPage": this.request.currentPageNumber
        // },
        "searchCriteriaList": searchCriteriaObj,
        "numberOfRowsPerPage": this.request.numberOfRowsPerPage,
        "currentPageNumber": this.request.currentPageNumber,
        "sortOrder":"ASC",
        "sortColumn":"requestedAt"
    }
    const url = 'home/exceptionspendingapprovals';
    this.eaRestService.postApiCall(url, reqJson).subscribe((response: any) => {
      this.isSearchedData =  true;
      if (response && response.data && !response.error) {
        // this.isSearchedData =  true;
        this.pendingApprovalsData = response.data.responseApproverList;
        this.paginationObject.noOfRecords = response.data.totalRecords ? +response.data.totalRecords : null;
        this.paginationObject.currentPage = response.data.currentPage;
        this.paginationObject.pageSize = response.data.noOfRows;
        this.paginationObject.noOfPages = response.data.totalPages;
      } else {
        this.pendingApprovalsData = [];
      }
    });
  }

}