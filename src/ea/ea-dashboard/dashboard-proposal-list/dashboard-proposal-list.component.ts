import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
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
  selector: 'app-dashboard-proposal-list',
  templateUrl: './dashboard-proposal-list.component.html',
  styleUrls: ['./dashboard-proposal-list.component.scss']
})
export class DashboardProposalListComponent implements OnInit {

  constructor(private eaRestService: EaRestService, private router: Router, public eaStoreService: EaStoreService, public eaUtilitiesService: EaUtilitiesService,
     public localizationService: LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  proposalList = [];
  @Output() hideCreateProposalButton = new EventEmitter();
  @Output() globalDealScope = new EventEmitter();
  paginationObject: PaginationObject;
  request = {
   // "data": {
     // "createdByMe": true,
      // "page": {
      //   "pageSize": this.eaStoreService.selectedDealData.dealID ? 100 : 10,
      //   "currentPage": 0
      // }
   // }
  }
  selectedView = this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME') ;
  viewOptions = [this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME'), this.localizationService.getLocalizedString('ea_dashboard.SHARED_WITH_ME')]; 
  openDrop = false;
  searchParam = '';
  displayGrid = false;
  isSearchedData =  false;
  messagesObj = {
    errors: new Array<Message>(),
    warns: new Array<Message>(),
    info: new Array<Message>() 
  };

  ngOnInit() {
    this.messagesObj.errors = [];
    this.getProposalListData();
  }


  getProposalListData(){
    this.displayGrid = false;
    this.proposalList = [];
    const url ='home/proposallist';
    if (this.isSearchedData){
      this.isSearchedData = false;
   //   this.request.data.page.currentPage = 0;
    //  this.request.data.page.pageSize = 10;
    }
    if (this.eaStoreService.selectedDealData.buyingProgram === '3.0' || this.eaStoreService.selectedDealData.buyingProgram === 'spna'){
      this.request['projectObjectId'] = this.eaStoreService.selectedDealData.projectObjId;
    } else {
      this.request['qualId'] = this.eaStoreService.selectedDealData.projectId;
    }
    this.request['proposalList'] = this.eaStoreService.selectedDealData.proposalList;
    this.eaRestService.postApiCall(url, this.request).subscribe((response: any)=> {
      if (response && !response.error) {
        if (response.data){
          if (response.data.responseDataList){
            this.displayGrid = true;
            this.proposalList =  response.data.responseDataList;
           // this.eaStoreService.projectId = response.data.proposals[0].projectObjId; 
          }else {
            this.proposalList = [];
          }
          if (response.data.page){
            this.paginationObject = response.data.page;
            this.paginationObject.currentPage++ ;
          }

          if (response.data.hideCreateProposalButton){
            this.hideCreateProposalButton.emit(true);
          }
          if (response.data.globalDealScope){
            this.globalDealScope.emit(true);
          }
        }
      //  this.displayGrid = true;
      } else {
        this.proposalList = [];
      }
    });
    
  }

  paginationUpdated(event){
//  this.request.data.page.pageSize = event.pageSize;
 // this.request.data.page.currentPage = event.currentPage - 1;
  if (this.searchParam && this.isSearchedData){
    this.searchProposals();
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

    // if (proposal.buyingProgram === 'EA 3.0'){
    //   //this.router.navigate(['ea/project/proposal/' + proposal.objId])
    //   window.open(url + 'ea/project/proposal/' + proposal.objId);
    // } else {
    //   //this.router.navigate(['qualifications/proposal/' + proposal.id])
    //   window.open(url + 'qualifications/proposal/' + proposal.id);
    // }
    if (proposal.proposalObjectId) {
      this.eaService.updateDetailsForNewTab();
      window.open(url + 'ea/project/proposal/' + proposal.proposalObjectId);
    } else {
      window.open(url + 'qualifications/proposal/' + proposal.proposalId);
    }
  }
  
  selectedCreatedBy(value) {
    if (value === this.localizationService.getLocalizedString('ea_dashboard.CREATED_BY_ME')) {
   //   this.request.data.createdByMe = true;
    } else {
     // this.request.data.createdByMe = false;
    }
    this.selectedView = value;
    this.openDrop = false;
    this.searchParam = '';
    // this.request.data.page.currentPage = 0;
    // this.request.data.page.pageSize = 10;
    this.getProposalListData();
  }

  searchProposals() {
    if (!this.searchParam || !this.searchParam.trim().length){
      return;
    }
    this.searchParam = this.searchParam.trim();
    const reqJson = {
        "type": 'proposal',
     //   "createdByMe" : this.request.data.createdByMe,
        "searchrequest": {
          "name": this.searchParam,
          "id": this.searchParam
        },
        // "page": {
        //   "pageSize": this.request.data.page.pageSize,
        //   "currentPage": this.request.data.page.currentPage
        // }
    }

    const url = 'home/search';
    this.eaRestService.postApiCall(url, reqJson).subscribe((response: any) => {
      this.isSearchedData =  true;
      if (response && response.data && !response.error) {
        // this.isSearchedData =  true;
        this.proposalList = response.data.proposals;
        this.paginationObject = response.data.page;
        this.paginationObject.currentPage++;
      } else {
        this.proposalList = [];
      }
    });
  }

  
  // to open quote url
  openQuoteUrl(proposal) {
    let url = 'proposal/ccw-quote-link?p=' + proposal.proposalObjectId;
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
