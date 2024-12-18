import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ISmartAccountInfo, ProjectStoreService } from './../../project/project-store.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewAuthorizationComponent } from 'vnext/modals/view-authorization/view-authorization.component';
import { ProjectService } from 'vnext/project/project.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { EditProjectComponent } from 'vnext/modals/edit-project/edit-project.component';
import { UtilitiesService } from '../services/utilities.service';
import { MessageService } from "vnext/commons/message/message.service";
import { ConstantsService } from '../services/constants.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from "ea/ea.service";
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from '../services/localization.service';
import { DeleteSmartAccountConfirmationComponent } from 'vnext/modals/delete-smart-account-confirmation/delete-smart-account-confirmation.component';
import { AssignSmartAccountComponent } from 'vnext/modals/assign-smart-account/assign-smart-account.component';
import { Router } from '@angular/router';
import { DataIdConstantsService } from '../services/data-id-constants.service';
import { SystemDateComponent } from 'vnext/modals/system-date/system-date.component';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { ElementIdConstantsService } from '../services/element-id-constants.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';


@Component({
  selector: 'app-ng-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  showSmartAccount = false;
  showLoccDrop = false;
  smartAccountData :ISmartAccountInfo[];
  searchText = '';
  searchArray = ['smrtAccntName', 'domain'];
  projectName = '';
  proposalName = '';
  isPartnerLoggedIn = false;

  constructor(public projectStoreService: ProjectStoreService, private modalVar: NgbModal, public vnextService: VnextService, public proposalStoreService: ProposalStoreService, public dataIdConstantsService: DataIdConstantsService, public eaIdStoreService: EaidStoreService, public tcoStoreService: TcoStoreService,
   public vnextStoreService:VnextStoreService, public projectService: ProjectService,public priceEstimateService: PriceEstimateService, public utilitiesService: UtilitiesService,private eaRestService: EaRestService, private messageService: MessageService, public constantsService: ConstantsService, public eaStoreService: EaStoreService, public eaService: EaService,public localizationService:LocalizationService, private router: Router, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    if(this.eaStoreService.isValidationUI)this.getSystemDate();
    if(this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerLoggedIn = true
    }
  }

  onClickedOutside(event) {
    this.showSmartAccount = false;
  } 
  viewAuth() {
    let beGeoId;
    if (this.proposalStoreService.proposalData?.partnerInfo?.beGeoId) {
      beGeoId = this.proposalStoreService.proposalData.partnerInfo.beGeoId;
    } else if (this.projectStoreService.projectData?.selectedQuote?.partnerInfo){
      beGeoId = this.projectStoreService.projectData.selectedQuote?.partnerInfo.beGeoId;
    } else {
      beGeoId = this.projectStoreService.projectData.partnerInfo.beGeoId;
    }

    if(!beGeoId){
      return;
    }
    const url = this.vnextService.getAppDomainWithContext +'partner/' + beGeoId +
    '/purchase-authorization?d=' + this.projectStoreService.projectData.dealInfo.id + '&buyingProgram=' + this.projectStoreService.projectData?.buyingProgram;
    this.eaRestService.getApiCall(url).subscribe((response:any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        const modalRef = this.modalVar.open(ViewAuthorizationComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
        modalRef.componentInstance.authorizationData = response.data.qualifications;
        modalRef.componentInstance.purchaseAuthDataNew = response.data;

      }
    });
  }

  // method to edit project
  editProject() {
    // show modal for confirmation and call api to unlock project
    const modalRef = this.modalVar.open(EditProjectComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if (result.continue){
        this.projectService.modifyProject('IN_PROGRESS');
      }
    });
  }

  // This method is to get the open smart account popover
    openSmartAccount() {

    // this.searchText = '';

    // this.showSmartAccount = !this.showSmartAccount
    // if (this.showSmartAccount) {
    //   this.getSmartAccountDetail();
    // }

    const modal =  this.modalVar.open(AssignSmartAccountComponent, {windowClass: 'assign-smart-account-modal lg'});
    modal.result.then((result) => { 
    });
  }

  // This method is used to get smart account details
   getSmartAccountDetail() { 

    const url = this.vnextService.getAppDomainWithContext + 'project/smart-accounts?d=' + this.projectStoreService.projectData.dealInfo.id;
    // const url =  "assets/vnext/smartaccount.json";
    this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.smartAccountData = response.data.smartAccounts;
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  selectSmartAccount(smartAcc) {
    this.showSmartAccount = false;
    smartAcc.active =  true

   const requestJson = {
   
     "data" : {
      "smrtAccntId":smartAcc.smrtAccntId,
      "smrtAccntName":smartAcc.smrtAccntName,
      "accountType":smartAcc.accountType,
      "programName":smartAcc.programName,
      "defaultVAId":smartAcc.defaultVAId,
      "defaultVAName":smartAcc.defaultVAName,
      "domain":smartAcc.domain,
      "defaultVAStatus":smartAcc.defaultVAStatus,
      "smrtAccntStatus": smartAcc.smrtAccntStatus
   }   
  }
  
  const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/smart-accounts';
    this.eaRestService.putApiCall(url,requestJson).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
            this.projectStoreService.projectData.smartAccount = smartAcc;

      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });



  }

  // check to show edit icon for smartAcc
  isShowEditSmartAcc(){

      return (!this.projectStoreService.lockProject && this.vnextStoreService.currentPageContext === this.vnextStoreService.applicationPageContextObject.PROJECT_CONTEXT);
  }

  // Request New smart account 
  requestNewSmartAccount() {
    this.eaService.redirectToNewSmartAccount();
  }

  // check if smartAccount accessable to user
  allowSmartAccountAccess(){
    // check for proposal and use proposalEditAccess else use projectEditAccess
    if(this.isPartnerLoggedIn && !this.projectStoreService.projectData.dealInfo?.partnerDeal){
      // don't allow smart accout edit for disti login sfdc deal
      // if(this.eaStoreService.userInfo?.distiUser){
      //   return false;
      // }
      return this.projectStoreService.projectSmartAccountEditAccess;
    } else {
      if(this.proposalStoreService.proposalData.id){
        return this.proposalStoreService.proposalEditAccess;
      } else {
        return this.projectStoreService.projectEditAccess;
      }
    }
  }

  // to delete smart account 
  deleteSmartAccount() {
    const url = 'project/' + this.projectStoreService.projectData.objId + '/smartAccount';
    const modalRef = this.modalVar.open(DeleteSmartAccountConfirmationComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if (result.continue) {
        this.eaRestService.deleteApiCall(url).subscribe((response: any) => {
          if (this.vnextService.isValidResponseWithoutData(response)) {
            this.projectStoreService.projectData.smartAccount = undefined;
          }
        });
      }
    });
  }

  showSmartAcc() {
    if(!this.projectStoreService.projectData?.objId){
      return false;
    }
    if (!this.projectStoreService.lockProject && this.vnextStoreService.currentPageContext === this.vnextStoreService.applicationPageContextObject.PROJECT_CONTEXT) {
      return false;
    } else if (!this.projectStoreService.lockProject && this.vnextStoreService.currentPageContext !== this.vnextStoreService.applicationPageContextObject.PROJECT_CONTEXT) {
      return true;
    } else {
      return true;
    }
  }


  shareProposal(value) {
    this.vnextService.withdrawProposalSubject.next(value);
  }

  saveUpdatedName(proposal, name, updatedName) {
    let url = '';
    let requestObj = {};
    if (proposal) {
      url = 'proposal/' + this.proposalStoreService.proposalData.objId + '/name';
      this.proposalName = this.proposalName.trim();
      requestObj = { data: this.proposalName };
    } else {
      url = 'project/' + this.projectStoreService.projectData.objId + '/name';
      this.projectName = this.projectName.trim();
      requestObj = { data: this.projectName };
    }

    updatedName = updatedName.trim();
    if (updatedName !== name) {
      this.eaRestService.putApiCall(url, requestObj).subscribe((response: any) => {
        if (response && !response.error) {
          name = updatedName;
          if(proposal){
            this.proposalStoreService.proposalData.name = this.proposalName;
          } else {
            this.projectStoreService.projectData.name = this.projectName;
          }
          this.eaStoreService.editName = false;
        } else {
          this.messageService.displayMessagesFromResponse(response);
          updatedName = name;
        }
      });
    }
  }

  editProjectName(){
    this.eaStoreService.editName = true;
    if(this.proposalStoreService.proposalData.id){
      this.proposalName = this.proposalStoreService.proposalData.name;
    } else {
      this.projectName = this.projectStoreService.projectData.name;
    }
  }
  cancelNameChange(){
    this.eaStoreService.editName = false;
    this.projectName = '';
    this.proposalName = '';
  }

  viewDocumentCenter(){
    this.router.navigate(['ea/project/proposal/'+ this.proposalStoreService.proposalData.objId  + '/documents']);
    this.proposalStoreService.loadCusConsentPage = true
  }

  // method to get and open quoting url 
  openQuoteUrl() {
    let url = 'proposal/ccw-quote-link?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        window.open(response.data, '_blank'); // open redirect url from response
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  goToQuote() {
    window.open(this.proposalStoreService.proposalData.quoteInfo.redirectUrl, '_self');
  }

  updateSystemDateOpen(){
    const modal =  this.modalVar.open(SystemDateComponent, {windowClass: 'sm'});
    modal.result.then((result) => { 
    });
  }

  getSystemDate(){
    const url = this.eaRestService.getAppDomainWithContext() + 'home/configuration-time-stamp';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (!response.error) {
        if(response.data){
          let date:any = new Date(response.data)
          if(!sessionStorage.getItem('sysDate'))sessionStorage.setItem('sysDate', response.data);
           this.vnextStoreService.systemDate =  this.utilitiesService.formattedDate(date)
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })

  }
}
