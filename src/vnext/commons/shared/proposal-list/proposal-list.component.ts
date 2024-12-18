import { Component, OnInit,HostListener, Input, ViewChild, ElementRef } from '@angular/core';
import { IProposalList, ProjectStoreService } from "vnext/project/project-store.service";
import { ManageTeamComponent } from "vnext/modals/manage-team/manage-team.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "vnext/commons/message/message.service";
import { EaService, PaginationObject } from "ea/ea.service";
import { Router } from '@angular/router';
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { ProjectService } from 'vnext/project/project.service';
import { EaStoreService } from 'ea/ea-store.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-ng-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
  providers: [MessageService]
})
export class ProposalListComponent implements OnInit {

  proposalList: any = [];
  paginationObject: PaginationObject;
  showMenuOption =  false;
  selectedProposal:IProposalList;
  isSearchedData =  false;

  request = {
    "data": {
      "createdByMe": true,
      "page": {
        "pageSize": 50,
        "currentPage": 0
      }
    }
  }
  selectedView = 'Created By Me';
  viewOptions = ['Created By Me', 'Shared With Me'];
  openDrop = false;
  searchParam = '';
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  isReadOnlyUser = true; // make it false if user has edit access
  proposalName = '';
  isOrderFulfilled = false; // set if order is fulfilled
  isPartnerAccessingSfdcDeal = false; // set if partner/disti accessing sfdc deal proposal

  constructor(private modalVar: NgbModal, public eaService : EaService, private eaRestService : EaRestService, private messageService : MessageService, private router: Router, public eaUtilitiesService: EaUtilitiesService, public projectStoreService : ProjectStoreService, private vnextService: VnextService,public localizationService:LocalizationService, private proposalStoreService: ProposalStoreService, private proposalService: ProposalService, private projectService: ProjectService, private eaStoreService: EaStoreService, private blockUiService: BlockUiService, public constantsService: ConstantsService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {

    // if proposal data persent remove for projects proposal list
    if (this.proposalStoreService.proposalData.id){
      this.proposalStoreService.proposalData = {};
    }
    // Get project data 
    if (this.projectStoreService.projectData.objId) {
      if (!this.projectStoreService.projectData.name){
        this.getProjectData();
      }
      this.getProposalListData();
    } else {
      const projectData = JSON.parse(sessionStorage.getItem('projectData'));
      if (projectData) {
        this.projectStoreService.projectData = projectData;
        // check and set project permissions after getting project data from session
        this.projectService.setProjectPermissions(projectData.permissions);
        //if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = projectData?.changeSubscriptionDeal ? true : false;
        //}
        this.checkIfOrderFulfilled();// to check if order is fulfilled
        // check and set isRoUser
        this.setRoUser();
        this.eaService.getFlowDetails(this.eaStoreService.userInfo, this.projectStoreService.projectData.dealInfo);

        this.getProposalListData();
        sessionStorage.removeItem('projectData');
      }
    }
    this.isPartnerAccessingSfdcDeal = this.projectService.checkPartnerLogInSfdcDeal();
  }

  // to check if order is fulfilled
  checkIfOrderFulfilled(){
    this.isOrderFulfilled = false;
    if(this.projectStoreService.projectData.status === this.constantsService.PROJECT_COMPLETE && !this.projectStoreService.projectReopenAccess){
      this.isOrderFulfilled = true;
    }
  }

  // set if partner/disti accessing sfdc deal proposal
  checkPartnerLogInSfdcDeal() {
    if (!this.projectStoreService.projectData.dealInfo?.partnerDeal && this.eaService.isPartnerUserLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

 // Get project data 
  getProjectData() {

    const url  =  'project/' + this.projectStoreService.projectData.objId
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response, true)) {
        this.projectStoreService.projectData = response.data;
        this.projectService.setProjectPermissions(response.data.permissions);
        //if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
        //}
        this.checkIfOrderFulfilled(); // to check if order is fulfilled
        // check and set isRoUser
        this.setRoUser();
        this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }


  // Open manage team modal
  openManageTeam(proposal) {
    proposal.showDropdown =  false
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modal = this.modalVar.open(ManageTeamComponent, ngbModalOptions);
  }


  openDropdown(proposal){
    proposal.showDropdown =  !proposal.showDropdown;
  }


  // To copy proposal
  copy(proposal) {

    proposal.showDropdown =  false
    const url = this.eaService.getAppDomainWithContext + 'proposal/copy?p=' + proposal.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response, true)) {
        if (response.data.proposal){
          setTimeout(() => {
            this.getProposalListData();
          }, 1000);
        }
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    }, (error) => {  
      this.messageService.displayMessagesFromResponse(error);
    });
  }


  // To delete proposal
  delete(proposal) {

  proposal.showDropdown =  false
  const url = this.eaService.getAppDomainWithContext + 'proposal/delete?p=' + proposal.objId;
    this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response, true)) {
        this.eaService.updateUserEvent(proposal, this.constantsService.PROPOSAL, this.constantsService.ACTION_DELETE);
        if (response.data.proposal){
          setTimeout(() => {
            this.getProposalListData();
          }, 1000);
        }
      }else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    }, (error) => {  
      this.messageService.displayMessagesFromResponse(error);
    }
  ); 
  }



 // To get proposal list data  
  getProposalListData(){
    this.eaService.isSpnaFlow = (this.projectStoreService.projectData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
    const url ='proposal/list';
    this.request.data['projectObjId'] = this.projectStoreService.projectData.objId;
    if (this.isSearchedData){
      this.isSearchedData = false;
      this.request.data.page.currentPage = 0;
      this.request.data.page.pageSize = 10;
    }
    this.eaRestService.postApiCall(url, this.request).subscribe((response: any)=> {
      if (response && response.data && !response.error) {
        this.proposalList =  response.data.proposals;
        this.paginationObject = response.data.page;
        this.paginationObject.currentPage++ ;
      } else {
        this.proposalList = [];
      }
    })
  }

  paginationUpdated(event){
  this.request.data.page.pageSize = event.pageSize;
  this.request.data.page.currentPage = event.currentPage - 1;
  if (this.searchParam && this.isSearchedData){
    this.searchProposals();
  } else {
    this.searchParam = '';
    this.getProposalListData();
  }
 }

  goToProposal(proposal){
    if (proposal.buyingProgram === 'EA 3.0') {
      this.eaService.updateDetailsForNewTab();
      let index;
      let routeUrl;
      index = window.location.href.lastIndexOf(this.constantsService.EA);
      routeUrl = window.location.href.substring(0, index)
      
     // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
      const url  = routeUrl;
      window.open(url + 'ea/project/proposal/' + proposal.objId);
    } else {
      this.router.navigate(['qualifications/proposal/' + proposal.id])
    }
  }
  
  // to set createdByMe/ sharedWithMe proposals
  selectedCreatedBy(value) {
    if (value === 'Created By Me') {
      this.request.data.createdByMe = true;
    } else {
      this.request.data.createdByMe = false;
    }
    this.selectedView = value;
    this.openDrop = false;
    this.searchParam = '';
    this.request.data.page.currentPage = 0;
    this.request.data.page.pageSize = 10;
    this.getProposalListData();
  }

   @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {
    sessionStorage.setItem(
    'projectData',
    JSON.stringify(this.projectStoreService.projectData));
    }

  searchProposals() {
    if (!this.searchParam || !this.searchParam.trim().length) {
      return;
    }
    this.searchParam = this.searchParam.trim();
    const reqJson = {
        "type": 'proposal',
         "objId" : this.projectStoreService.projectData.objId,
        "searchrequest": {
          "name": this.searchParam,
          "id": this.searchParam
        },
        "page": {
          "pageSize": this.request.data.page.pageSize,
          "currentPage": this.request.data.page.currentPage
        }
      }

    const url = 'home/search';
    this.eaRestService.postApiCall(url, reqJson).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.isSearchedData =  true;
        this.proposalList = response.data.proposals;
        this.paginationObject = response.data.page;
        this.paginationObject.currentPage++;
      } else {
        this.proposalList = [];
      }
    });
  }

  // to download excel
  downloadExcel(proposal) {
    proposal.showDropdown = false;
    this.proposalService.downloadProposalSummaryExcel(this.downloadZipLink, proposal.objId);
  }

  // check and set if user isRoUser or not
  setRoUser(){
    this.isReadOnlyUser = true
    if(this.projectStoreService.projectEditAccess){
      this.isReadOnlyUser = false;
    }
  }
  editProposalName(proposal) {
    this.proposalName = proposal.name;
    proposal.showDropdown = false;
    proposal.editName = true;
  }
  saveUpdatedName(proposal){
    this.proposalName = this.proposalName.trim();
    if(!this.proposalName){
      return;
    }
    let requestObj = {
      "data": this.proposalName
    }
    const url = 'proposal/' + proposal.objId + '/name';
    if(this.proposalName !== proposal.name){
      this.eaRestService.putApiCall(url, requestObj).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          proposal.editName = false;
          proposal.name = this.proposalName
        } else {
          this.messageService.displayMessagesFromResponse(response);
          this.cancelNameChange(proposal);
        }
      });
    }
  }
  cancelNameChange(proposal){
    proposal.editName = false;
    this.proposalName = '';
  }

  // to open quote url
  openQuoteUrl(proposal) {
    let url = 'proposal/ccw-quote-link?p=' + proposal.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.blockUiService.spinnerConfig.blockUI();
        window.open(response.data, '_blank'); // open redirect url from response
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

}