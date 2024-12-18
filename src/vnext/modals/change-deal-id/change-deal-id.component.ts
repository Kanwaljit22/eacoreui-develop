import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-change-deal-id',
  templateUrl: './change-deal-id.component.html',
  styleUrls: ['./change-deal-id.component.scss'],
  providers: [MessageService]
})
export class ChangeDealIdComponent implements OnInit, OnDestroy {

  newDealData: any = {}; // to store data from lookup api
  newDealId = ''; // set entered deal
  allowChange = false; // set if selected checkbox after lookup
  isDealDataPresent = false; // set if dealInfo present from api
  isDealValid = false; // set if new dealId is valid
  isApiCalled = false; // set if lookup api called
  errorPresent = false; // set if error present from api
  isUserEnteredSameDeal = false; // set if entered deal is same as existing deal
  includingItemsData = [{
    'name': this.localizationService.getLocalizedString('common.SUBSIDIARY'),
    'selected': false,
    'id': 'copySubsidiaries'
  },
  {
    'name': this.localizationService.getLocalizedString('common.CISCO_TEAM_MEMBERS'),
    'selected': false,
    'id': 'copyCiscoTeam'
  },
  {
    'name': this.localizationService.getLocalizedString('common.PARTNER_TEAM_MEMBERS'),
    'selected': false,
    'id': 'copyPartnerTeam'
  },
  {
    'name': this.localizationService.getLocalizedString('common.ALL_MY_PROPOSALS'),
    'selected': false,
    'id': 'copyAllMyProposals'
  }
]
  paginationObject: any;
  proposalListData: any;
  selectedProposals = [];
  selectedProposalIds = []; // to store selected proposalObjids
  request = {
    "data": {
      "createdByMe": true,
      "page": {
        "pageSize": 10,
        "currentPage": 0
      }
    }
  }
  currentPage = 1;
  constructor(public activeModal: NgbActiveModal, private vnextService: VnextService, private projectStoreService: ProjectStoreService, private messageService: MessageService, public localizationService:LocalizationService,private eaRestService: EaRestService, public eaService: EaService, public constantService: ConstantsService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('change-deal-id');
    this.paginationObject = {
      "currentPage": 0,
      "pageSize": 10,
      "noOfPages": 1,
      "noOfRecords": 30
    }
  }

  // to lookup new deal entered
  lookUpDeal(){
    this.isDealDataPresent = false;
    this.isApiCalled = false;
    this.errorPresent = false;
    this.isUserEnteredSameDeal = false;
    this.selectedProposalIds = [];

    //check if entered deal is same as project deal
    if (this.projectStoreService.projectData.dealInfo.id === this.newDealId){
      this.isUserEnteredSameDeal = true;
      return;
    }
    // if no deal present or dealId empty don't call api
    if (!this.newDealId || !this.newDealId.trim().length){
      return;
    }
    this.newDealId = this.newDealId.trim(); // to remove spaces if entered
    const reqJson = {
      "data": {
        "existingDealId": this.projectStoreService.projectData.dealInfo.id,
        "changeDealId": this.newDealId
      }
    }
    const url = 'deal/change';
    this.eaRestService.postApiCall(url, reqJson).subscribe((response: any) =>{
      this.messageService.modalMessageClear();
      this.isApiCalled = true;
      if (this.vnextService.isValidResponseWithData(response, true)){
        if (response.data.dealInfo){ // if dealInfo present set newDealData
          this.isDealDataPresent = true;
          this.newDealData = response.data
          this.getProposalData();
        }
        this.isDealValid = response.data.validDeal ? true : false; // check and set if deal is valid
      } else {
        this.errorPresent = true;
        this.newDealData.validDeal = false;
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  close(){
    this.activeModal.close({
      continue: false
    });
  }

  // set checkbox selection
  matchDealId(){
    this.allowChange = !this.allowChange;
  }

  // set checkbox selection of including items
  selectItems(item){
    item.selected = !item.selected;
    if (item.id === this.constantService.COPY_ALL_MY_PROPOSAL) {
      this.selectAllProposal(true);
    }
  }

  // method to change dealId with new dealId and selected items
  changeDealId() {
    let req
      // this.selectedProposals = this.proposalListData.filter(proposal => proposal.selected)
      // const proposalIds = [];
      // this.selectedProposals.forEach((element)=> {
      //   proposalIds.push(element.objId)
      // })
      req = {
        "data": {
          "projectObjId": this.projectStoreService.projectData.objId,
          "dealId": this.projectStoreService.projectData.dealInfo.id,
          "changeToDealId": this.newDealId,
          "copySubsidiaries": false,
          "copyCiscoTeam": false,
          "copyPartnerTeam": false,
          "copyAllMyProposals": false
        }
      }
      if (this.selectedProposalIds.length) {
        req.data['proposalObjIds'] = this.selectedProposalIds;
      }
    

    this.setSelectedItems(req.data); // to check and set slected items in req
    const url = 'project/copy';
    this.eaRestService.postApiCall(url, req).subscribe((response: any) =>{
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)){
        this.activeModal.close({
          continue: true,
          data: response.data.project
        });
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // to check and set slected items in req
  setSelectedItems(data) {
    this.includingItemsData.forEach(item => {
      if (item.selected){
        data[item.id] = item.selected;
      }
    });
  }

  ngOnDestroy(){
    this.messageService.disaplyModalMsg = false;
  }

  getProposalData(){
    const url ='proposal/list';
    this.request.data["projectObjId"] = this.projectStoreService.projectData.objId,
    this.eaRestService.postApiCall(url, this.request).subscribe((response: any)=> {
      if (response && response.data && !response.error) {
        this.proposalListData =  response.data.proposals;
        this.paginationObject = response.data.page;
        this.selectAllProposal();
      } else {
        this.proposalListData = [];
        this.paginationObject = {
          "currentPage": 0,
          "pageSize": 10
        }
      }
    })
  }

  pageChange(event) {
    if(this.request.data.page.currentPage !== event - 1) {
      this.request.data.page.currentPage = event - 1;
      this.getProposalData();
    }
  }

  selectProposal(proposal) {
    proposal.selected = !proposal.selected;
    if (proposal.selected && !this.selectedProposalIds.includes(proposal.objId)) {
      this.selectedProposalIds.push(proposal.objId);
    } else if (this.selectedProposalIds.includes(proposal.objId)) {
      const index = this.selectedProposalIds.indexOf(proposal.objId);
      if (index > -1) {
        this.selectedProposalIds.splice(index, 1);
      }
    }

    this.includingItemsData.forEach((item) => {
      if (item.id === this.constantService.COPY_ALL_MY_PROPOSAL) {
        item.selected = this.proposalListData.every(element => {
          return element.selected ? true : false 
        })
      }
    })
  }

  selectAllProposal(changeAll = false) {
    let selectedProposalIdsCopy = this.selectedProposalIds;
    this.includingItemsData.forEach((item) => {
      if (item.id === this.constantService.COPY_ALL_MY_PROPOSAL) {
        this.proposalListData.forEach(element => {
          element.selected = item.selected ? true : false;
          if(element.selected && !selectedProposalIdsCopy.includes(element.objId)){
            selectedProposalIdsCopy.push(element.objId);
          }

          if(!item.selected && selectedProposalIdsCopy.includes(element.objId)){
            element.selected = true;
          }
        });

        if(!item.selected && changeAll){
          selectedProposalIdsCopy = [];
          this.proposalListData.forEach(element => {
            element.selected = false;
          })
        }
        this.selectedProposalIds = selectedProposalIdsCopy;
      }
    });
    
  }
}
