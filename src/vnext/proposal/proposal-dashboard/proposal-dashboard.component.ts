import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { ReopenProposalComponent } from 'vnext/modals/reopen-proposal/reopen-proposal.component';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from '../proposal-rest.service';
import { IProposalInfo, ProposalStoreService } from '../proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { Router } from '@angular/router';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ConvertQuoteComponent } from 'vnext/modals/convert-quote/convert-quote.component';
import { ProposalService } from '../proposal.service';
import { EaStoreService } from 'ea/ea-store.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaPermissionEnum } from 'ea/ea-permissions/ea-permissions';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';

@Component({
  selector: 'app-proposal-dashboard',
  templateUrl: './proposal-dashboard.component.html',
  styleUrls: ['./proposal-dashboard.component.scss'],
  providers: [MessageService]
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  priceInfo: any = {};
  copiedProposalData: IProposalInfo = {}; // store copied proposal data 
  lifeCycleData = [];
  linkedQuoteId: any;
  displayException = false;
  exceptionApprovalHistory: any = []; // to store approval history
  displayApprovalHistory = false; // to show approval history for seller
  public subscribers: any = {};
  allowedAciSolnStarter =  false
  allowedDNAC = false;
  isQuotePresent = false; // set if quote id present
  isConvertToQuoteClicked = false;
  isPartnerUserLoggedIn = false;
  hasConvertToQuotePermission = false;
  showSplunkMessage = true;
  displayCopyError = false

  constructor(private proposalRestService: ProposalRestService, private vNextService: VnextService, public eaPermissionsService: EaPermissionsService, public projectStoreService: ProjectStoreService,
    public proposalStoreService: ProposalStoreService, private modalVar: NgbModal, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService,
    public utilitiesService: UtilitiesService, private router: Router, public vnextStoreService: VnextStoreService, private messageService: MessageService, private vnextService: VnextService, 
    private propsoalService: ProposalService, public eaStoreService: EaStoreService, private blockUiService: BlockUiService,public localizationService:LocalizationService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.PROPOSAL_DASHBOARD;
    this.eaStoreService.editName = false;
    this.checkQuotePresent(); // check if already converted to quote
    this.loadProposalDashboard();
    this.getLifeCycleData();
    this.proposalStoreService.proposalData.exception = { exceptionActivities: [] };
    this.propsoalService.getExceptionSummaryData(this.displayException, this.exceptionApprovalHistory, this.displayApprovalHistory);
    this.checkToShowPromoMessages();
    this.vnextService.roadmapStep = 3;
    
    // subscribe to subject for getting exceptions data to set on UI
    this.subscribers.exceptionsSubj = this.proposalStoreService.exceptionsSubj.subscribe((data: any) => {
      this.displayException = data.displayException;
      this.proposalStoreService.proposalData.exception.exceptionActivities = data.exceptionActivities;
      this.exceptionApprovalHistory = data.exceptionApprovalHistory;
      this.displayApprovalHistory = data.displayApprovalHistory;
    });

    this.vnextService.isRoadmapShown = false;
    this.propsoalService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalStoreService.proposalData);
    if (this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerUserLoggedIn = true;
    }
  }

  getLifeCycleData(){
    const url = this.vNextService.getAppDomainWithContext + 'proposal/lifecycle/' + this.proposalStoreService.proposalData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response, true)) {
        this.lifeCycleData = response.data.lifecycles;
      }
    });
  }

  loadProposalDashboard() {
    //const url =  "assets/vnext/dashboard.json";
    const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=DASHBOARD';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response, true)) {
        this.priceInfo = response.data.priceInfo;
        this.hasConvertToQuotePermission = this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ConvertToQuote);
      }
    });
  }

  // method to reopen proposal
  reopenProposal() {
    if(this.proposalStoreService.isPartnerAccessingSfdcDeal && this.eaStoreService.userInfo?.distiUser && !this.eaService.features?.PARTNER_SUPER_USER_REL){
      return;
    }
    const requestObj = {
      "data": {
        "status": "IN_PROGRESS"
      }
    }
    const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/status';
    const modal = this.modalVar.open(ReopenProposalComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modal.result.then((result) => {
      if (result.continue) {
        this.proposalRestService.putApiCall(url, requestObj).subscribe((response: any) => {
          if (this.vNextService.isValidResponseWithData(response)) {
            this.proposalStoreService.proposalData = response.data;
            this.proposalStoreService.isReadOnly = false;
            this.vNextService.refreshProposalData.next({isPermissionRefresh: true});
            this.backToPe();
          }
        });
      }
    });
  }

  backToPe() {
    this.proposalStoreService.showProposalDashboard = false;
    this.proposalStoreService.showPriceEstimate = true;
  }

    // cpnvert to quote
  convertToQuote() {
  if((this.isConvertToQuoteClicked) || (this.eaService.features.PARTNER_SUPER_USER_REL && !this.proposalStoreService.proposalConverToQuoteAccess)){
    return;
  }
  const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId  + '/deal-quotes';
    this.proposalRestService.getApiCall(url).subscribe((res: any) => {
      if (this.vNextService.isValidResponseWithData(res)){
        this.linkedQuoteId = res['data']['linkedQuoteId'];
        
          if (res['data'] && !res['data']['linkedQuote'] && res['data']['eligibleQuotes'] && !(!this.proposalStoreService.proposalData.dealInfo?.partnerDeal && this.eaService.isPartnerUserLoggedIn())) {
            this.openQuoteModal(res['data']);
          } else {
            this.openQuoteUrl();
          }
        
      }
    });
  }

   openQuoteModal(data) { 
    const modalRef = this.modalVar.open(ConvertQuoteComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modalRef.componentInstance.quoteData = data;
    modalRef.componentInstance.quotesList = data['eligibleQuotes'];
    modalRef.result.then(res => {

      if (res) {
          this.linkedQuoteId = res;
        } else {
          this.linkedQuoteId = null;
        }
        this.openQuoteUrl();
    });
  } 

  openQuoteUrl() {
    let url = '';
    if (this.linkedQuoteId) {
      url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/bom-to-quote' + '?q=' + this.linkedQuoteId;
    } else {
      url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/bom-to-quote';
    }
    this.isConvertToQuoteClicked = true
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response)) {
        this.blockUiService.spinnerConfig.blockUI();
        window.open(response.data, '_self'); // open redirect url from response
      }
    });
  }

  // method to copy proposal
  copyProposal() {
    if((this.proposalStoreService.isPartnerAccessingSfdcDeal) || (this.eaService.features.PARTNER_SUPER_USER_REL && !this.proposalStoreService.proposalCloneAccess)){
      return;
    } else if(this.projectStoreService.projectData.dealInfo?.globalDealScope){
      this.displayCopyError = true;
      return;
    }
    const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=COPY';
    this.proposalRestService.postApiCall(url, {}).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response)) {
        //changes for proposal
        this.copiedProposalData = response.data.proposal;
        this.vnextStoreService.toastMsgObject.copyProposal = true; // to show toast message
        this.vnextStoreService.toastMsgCopiedProposalData = this.copiedProposalData; // for routing to copiedproposal
        // this.vnextStoreService.toastMsgValueObject.push(this.copiedProposalData.name);
        setTimeout(() => { // show message for 5 sec and clear it
          this.vnextStoreService.cleanToastMsgObject();
        }, 5000);
      }
    });
  }

  // go to copied proposal
  goToCopiedProposal() {
    this.proposalStoreService.proposalData = this.copiedProposalData; // set copied proposal data to proposal
    if (this.copiedProposalData.permissions) {
      this.propsoalService.setProposalPermissions(this.copiedProposalData.permissions);

    }
    this.router.navigate(['ea/project/proposal/' + this.copiedProposalData.objId]);
    this.proposalStoreService.isReadOnly = false;
    this.backToPe();
    // this.propsoalService.goToCopiedPorposal(this.copiedProposalData);
  }

  gotoDocument(loadLegalPackage) {
    this.router.navigate(['ea/project/proposal/'+ this.proposalStoreService.proposalData.objId  + '/documents']);
    this.proposalStoreService.loadLegalPackage = loadLegalPackage
  }

  //View proposal List
  viewProposalList() {

    this.router.navigate(['ea/project/proposal/list']);
    this.proposalStoreService.proposalData = {};
  
  }


  ngOnDestroy(){
    if (this.subscribers.exceptionsSubj){
      this.subscribers.exceptionsSubj.unsubscribe();
    }
    this.eaStoreService.pageContext = '';
    this.eaStoreService.editName = false;
  }

  // to call api and show DNAC / solution starter messages
  checkToShowPromoMessages(){
    const url = this.vNextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId +'?a=PROMOTION-ELIGIBILITY-CHECK';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response)){
        let eligiblePromotions = [];
        if (response.data.proposal && response.data.proposal.eligiblePromotions){
          eligiblePromotions = response.data.proposal.eligiblePromotions;
        }
        if (eligiblePromotions.length){
          this.setToShowPromoMsgFlags(eligiblePromotions);
        }
      }
    });
  }

  // method to check and set DNAC and solution starter messages
  setToShowPromoMsgFlags(eligiblePromotions){
    for (let data of eligiblePromotions){
      if (data.name === 'EA-DNAC-OFFER'){
        this.allowedDNAC = true;
      }

      if (data.name === 'ACI-SOLN-STARTER'){
        this.allowedAciSolnStarter = true;
      }
    }
  }

  // check if already converted to quote
  checkQuotePresent() {
    this.isQuotePresent = false;
    if (this.proposalStoreService.proposalData.quoteInfo && this.proposalStoreService.proposalData.quoteInfo.quoteId){
      this.isQuotePresent =  true;
    }
  }

  goToQuote() {
    this.blockUiService.spinnerConfig.blockUI();
    window.open(this.proposalStoreService.proposalData.quoteInfo.redirectUrl, '_self'); // open redirect url
    // if (this.proposalStoreService.proposalData.quoteInfo.redirectUrl){
    //   window.open(this.proposalStoreService.proposalData.quoteInfo.redirectUrl, '_self'); // open redirect url
    // } else {
    //   this.linkedQuoteId = this.proposalStoreService.proposalData.quoteInfo.quoteId;
    //   this.openQuoteUrl();
    //   this.linkedQuoteId = null;
    // }
  }
}
