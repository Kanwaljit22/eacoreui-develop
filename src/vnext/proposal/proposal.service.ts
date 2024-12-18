import { Options } from '@angular-slider/ngx-slider';
import { EaRestService } from './../../ea/ea-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaPermissionEnum } from 'ea/ea-permissions/ea-permissions';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaStoreService } from 'ea/ea-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from './proposal-rest.service';
import { ProposalStoreService } from './proposal-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { EaService } from 'ea/ea.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
@Injectable({
  providedIn: VnextResolversModule
})
export class ProposalService {

  constructor(private proposalStoreService: ProposalStoreService, private proposalRestService: ProposalRestService, private vnextService: VnextService,
     private projectStoreService: ProjectStoreService, private eaPermissionsService: EaPermissionsService, private eaStoreService: EaStoreService, private router: Router,
      private utilitiesService: UtilitiesService, private eaRestService: EaRestService, private projectService: ProjectService,private eaService: EaService, private blockUiService: BlockUiService, private activatedRoute:ActivatedRoute ) { }


  // to exceptions data for proposal
  getExceptionSummaryData(displayException, exceptionApprovalHistory, displayApprovalHistory, allowExceptionSubmission = false) {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/exception-summary?p=' + this.proposalStoreService.proposalData.objId;
    // const url = 'assets/vnext/exceptionActivities.json' // remove it after realTime api and call getApiCall
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // response.data.proposalExceptionActivities = undefined
        if (response.data.proposalExceptionActivities) {
          this.proposalStoreService.proposalData.exception = { exceptionActivities: response.data.proposalExceptionActivities }
          displayException = true;
        } else {
          this.proposalStoreService.proposalData.exception = { exceptionActivities: [] }
        }
        if (this.proposalStoreService.proposalData.exception){
          this.proposalStoreService.proposalData.exception['allowWithdrawl'] = response.data.allowExceptionWithdrawl;
        }
        // to show submit approval button for seller flow
        if(response.data.allowExceptionSubmission){
          allowExceptionSubmission = true;
        } else {
          allowExceptionSubmission = false;
        }
        this.getApproveHistory(displayException, exceptionApprovalHistory, displayApprovalHistory, allowExceptionSubmission);
      }
    });
  }

  // method to get and set approver history data 
  getApproveHistory(displayException, exceptionApprovalHistory, displayApprovalHistory, allowExceptionSubmission) {
    // const url = 'assets/vnext/approvalHistory.json'
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/approver-history';
    this.proposalRestService.getApiCall(url).subscribe((res: any) => {
      if (res && !res.error) {
        // res.data.groupExceptions = []
        if (res.data) {
          exceptionApprovalHistory = res.data.groupExceptions;
          this.showOrHideApprovalHistory(this.proposalStoreService.proposalData?.exception?.exceptionActivities, exceptionApprovalHistory, displayApprovalHistory, displayException, allowExceptionSubmission);
        } else {
          exceptionApprovalHistory = [];
          displayApprovalHistory = false;
        }
      } else {
        exceptionApprovalHistory = []
        displayApprovalHistory = false;
        // show error message
      }
    });
  }

  // check and show exceptions tab, approval history tab
  showOrHideApprovalHistory(exceptions, approvalHistory, displayApprovalHistory, displayException, allowExceptionSubmission) {
    displayException = (exceptions?.length || approvalHistory?.length) ? true : false;
    if (exceptions.length) {
      displayApprovalHistory = false;
    } else {
      displayApprovalHistory = approvalHistory?.length ? true : false
    }
    // emit updated data to get and set on summary and dashboard pages
    this.proposalStoreService.exceptionsSubj.next({ displayException: displayException, exceptionApprovalHistory: approvalHistory, displayApprovalHistory: displayApprovalHistory, exceptionActivities: this.proposalStoreService.proposalData.exception.exceptionActivities, allowExceptionSubmission: allowExceptionSubmission });
  }

  // Get selected smart account 
  getSmartAccount() {
    const url = this.vnextService.getAppDomainWithContext + 'project/' + this.proposalStoreService.proposalData.projectObjId + '/smart-accounts';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        if (response.data.smartAccounts) {
          this.projectStoreService.projectData.smartAccount = response.data.smartAccounts[0];
        }
      }
    });
  }

  setProposalPermissions(permissions){ 
    // this.proposalStoreService.isReadOnly = false;
    this.proposalStoreService.proposalEditAccess = true;
    this.eaPermissionsService.proposalPermissionsMap.clear();
    if(permissions && permissions.featureAccess){
      this.eaPermissionsService.proposalPermissionsMap = new Map(permissions.featureAccess.map(permission => [permission.name, permission]));
      if(this.proposalStoreService.projectStatus !== 'COMPLETE' || (!this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProposalEdit) && !this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProposalReOpen) && !this.eaStoreService.isUserRwSuperUser)){
        this.proposalStoreService.isReadOnly = true;
        this.proposalStoreService.proposalEditAccess = false;
      }
    } 
    this.setProposalViewAccess(); // check for proposal view permission for back to prop button
    this.setProposalReopenAccess(); // check for proposal reopen permission for proposalDashboard
    this.setProjectManageTeamAccess(); // check for project manage team permission
    this.setProjectSmartAccountEditAccess(); // check for project smartacount edit permission
    this.setSellerUpdateOtdAcess();
    this.setProposalCloneAccess();  // check for proposal clone permission for proposalDashboard
    this.setProposalConvertToQuoteAccess(); // check for proposal convert to quote permission for proposalDashboard
  }

  // method to check RSD due 

  checkisRsdDue(page?){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId+'/rsd-past-date';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)){
        this.proposalStoreService.rsdDueCurrDate = false;
        if (page){ // if pe Page and no error show summary page
          this.proposalStoreService.showProposalSummary = true;
          this.proposalStoreService.showPriceEstimate = false;
        }
      } else {
        this.proposalStoreService.rsdDueCurrDate = true;
      }
    });
  }

  // Navigate to original proposal
  openOriginalProposal() {
    const index = window.location.href.lastIndexOf('/')
    const url = window.location.href.substring(0, index + 1)
    window.open(url + this.proposalStoreService.proposalData.originalProposalObjId, '_self');
  }

  // check for proposal view permission for back to prop button
  setProposalViewAccess(){
    this.proposalStoreService.proposalViewAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProposalView)){
      this.proposalStoreService.proposalViewAccess = true;
    }
  }

  // check for proposal reopen permission for proposalDashboard
  setProposalReopenAccess(){
    this.proposalStoreService.proposalReopenAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProposalReOpen)){
      this.proposalStoreService.proposalReopenAccess = true;
    }
  }

  // check for proposal reopen permission for proposalDashboard
  setProposalCloneAccess(){
    this.proposalStoreService.proposalCloneAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProposalClone)){
      this.proposalStoreService.proposalCloneAccess = true;
    }
  }

  // check for proposal reopen permission for proposalDashboard
  setProposalConvertToQuoteAccess(){
    this.proposalStoreService.proposalConverToQuoteAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ConvertToQuote)){
      this.proposalStoreService.proposalConverToQuoteAccess = true;
    }
  }

  // check for project manage team permission
  setProjectManageTeamAccess(){
    this.projectStoreService.projectManageTeamAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProjectManageTeam)){
      this.projectStoreService.projectManageTeamAccess = true;
    }
  }

  // check for project manage team permission
  setProjectSmartAccountEditAccess(){
    this.projectStoreService.projectSmartAccountEditAccess = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.ProjectSmartAccountEditAccess)){
      this.projectStoreService.projectSmartAccountEditAccess = true;
    }
  }

  setSellerUpdateOtdAcess() {
    this.proposalStoreService.isSellerAllowUpdateOTA = false;
    if (this.eaPermissionsService.proposalPermissionsMap.has(EaPermissionEnum.SELLER_UPDATE_OTD) && this.proposalStoreService.proposalData.status === 'IN_PROGRESS'){
      this.proposalStoreService.isSellerAllowUpdateOTA = true;
    }
  }

  // check and set to show editicon for proposal name change
  checkToShowEditNameIcon(proposalData){
    this.proposalStoreService.allowProposalEditName = false;
    if((proposalData.status === 'COMPLETE' && this.proposalStoreService.proposalReopenAccess) || (proposalData.statusDesc !== 'In Progress' && proposalData.status !== 'COMPLETE') && this.proposalStoreService.proposalEditAccess){
      this.proposalStoreService.allowProposalEditName = true;
    }
  }
  
  setProposalParamsForWorkspaceCaseInputInfo(proposalData) {
    // let WorkspaceCaseInputInfo = {}
    if (!this.projectStoreService.projectData.ciscoTeam) {
      let url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId
     
      if(this.eaStoreService.isValidationUI){ 
        // url = 'assets/data/validationui/projectData.json';
         const buyingProgram =  this.activatedRoute.snapshot.queryParams.bp;
         url = this.vnextService.getAppDomainWithContext +'validation/projectProposalTemplate?bp='+buyingProgram;
      }

        this.proposalRestService.getApiCall(url).subscribe((response: any) => {
          if(this.eaStoreService.isValidationUI){
            response = { error:false, data:response.data.project }
          }
          if (this.vnextService.isValidResponseWithData(response, true)) {
            this.projectStoreService.projectData = response.data; 
            this.projectService.setProjectPermissions(response.data.permissions);
            this.setWorkspaceCaseInputInfoDetails(proposalData);
          }
        });
    } else {
      this.setWorkspaceCaseInputInfoDetails(proposalData);
    }
  }

  clearWorkspaceCaseInputInfo() {
    window['WorkspaceCaseInputInfo'] = {
      appName: "EAMP",
      applicationName: "EAMP"
    }
  }

  setWorkspaceCaseInputInfoDetails(proposalData) {
   
    window['WorkspaceCaseInputInfo']['userId'] = this.eaStoreService.userInfo?.userId;
    window['WorkspaceCaseInputInfo']["auth"] = this.eaStoreService.authToken;
    window['WorkspaceCaseInputInfo']["proposalID"] = proposalData.id;
    window['WorkspaceCaseInputInfo']["transactionalID"] = proposalData.id;
    window['WorkspaceCaseInputInfo']["proposalURL"] = window.location.href;
    window['WorkspaceCaseInputInfo']["startDate"] = this.utilitiesService.formattedDate(new Date(this.utilitiesService.formateDate(proposalData.billingTerm?.rsd)));
    
    window['WorkspaceCaseInputInfo']["endCustomer"] = this.projectStoreService.projectData.customerInfo?.customerGuName;
    window['WorkspaceCaseInputInfo']["dealID"] = proposalData.dealInfo?.id;
    if (proposalData.partnerInfo && proposalData.partnerInfo.beGeoName) {
      window['WorkspaceCaseInputInfo']["partnerName"] = proposalData.partnerInfo.beGeoName;
    } else {
      window['WorkspaceCaseInputInfo']["partnerName"] = 'NA'
    }
    if (this.projectStoreService.projectData.ciscoTeam && this.projectStoreService.projectData.ciscoTeam.contacts) {
      this.projectStoreService.projectData.ciscoTeam.contacts.forEach(contact => {
        if (contact ?.role === 'AM') {
          window['WorkspaceCaseInputInfo']["accountManager"]  = contact.name;
        }
      });
    }
  if(!window['WorkspaceCaseInputInfo']["accountManager"]){
    window['WorkspaceCaseInputInfo']["accountManager"] = 'NA'
  }
    
  }

 // method to download proposal summary doc from proposal list and PE pages
  downloadProposalSummaryExcel(downloadZipLink, proposalObjId) {
    const url = 'proposal/'+ proposalObjId +'/summary-excel-download';

    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.utilitiesService.saveFile(response, downloadZipLink);
      }
    });
  }

  changeOptions(data, options) {
    const newOptions: Options = Object.assign({}, options);
    if (data && data.min && data.max && data.minLimit && data.maxLimit) {
      let ticksArray = [];
      newOptions.minLimit = data.min;
      newOptions.floor = data.min;
      newOptions.maxLimit = data.max;
      newOptions.ceil = data.max;
      for (let i = newOptions.minLimit; i < newOptions.maxLimit; i = i+12){
        ticksArray.push(i)
      }
      if (ticksArray[ticksArray.length - 1] !== newOptions.maxLimit){
        ticksArray.push(newOptions.maxLimit)
      }
      newOptions.ticksArray = ticksArray;
    } else {
      newOptions.floor = options.floor;
      newOptions.ceil = options.ceil;
    }
    
    return newOptions;
  }

  isReadOnlyProposal(sharedWithDisti){
    if(this.proposalStoreService.isReadOnly){
        return true;
    }
    if(!this.proposalStoreService.proposalData?.dealInfo?.partnerDeal && this.eaStoreService.userInfo?.distiUser && !this.eaService.features?.PARTNER_SUPER_USER_REL){
      this.proposalStoreService.isReadOnly = true;
      return;
    }
    if(this.eaService.isResellerOpty ){
      // don't give disti user RO if accessing seller deals
      if(!this.proposalStoreService.proposalData?.dealInfo?.partnerDeal && this.eaStoreService.userInfo?.distiUser && this.eaService.features?.PARTNER_SUPER_USER_REL){
        this.proposalStoreService.isReadOnly = false;
      } else {
        if((this.eaService.isResellerLoggedIn && sharedWithDisti) || (this.eaService.isDistiLoggedIn && !sharedWithDisti)){
          this.proposalStoreService.isReadOnly = true;
        } else {
          this.proposalStoreService.isReadOnly = false;
        }   
      }
    } else if(this.eaService.isResellerLoggedIn){
          this.proposalStoreService.isReadOnly = true;
    }
  }

  customPEProgressBar(){
    this.vnextService.isRoadmapShown = false;
    this.eaStoreService.isPePageLoad = true;
    this.blockUiService.spinnerConfig.noProgressBar();
  }

  // set if partner/disti accessing sfdc deal proposal
  checkPartnerLogInSfdcDeal() {
    if (!this.proposalStoreService.proposalData.dealInfo?.partnerDeal && this.eaService.isPartnerUserLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }

  // method to get copied proposal data,set permissions/accesses and route to that proposal
  goToCopiedPorposal(copiedProposalData){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + copiedProposalData.objId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.proposalStoreService.proposalData = response.data; // set copied proposal data to proposal
        this.proposalStoreService.isReadOnly = false;
        this.setProposalPermissions(response.data.permissions);
        this.vnextService.setDealDetailsFromProposalData(response.data); // to set dealinfo, customerInfo, partnerInfo and loccDetail from proposal data
        this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
        this.checkToShowEditNameIcon(response.data); // check and set to show editicon for proposal name change
        this.router.navigate(['ea/project/proposal/' + copiedProposalData.objId]);
        this.proposalStoreService.showProposalDashboard = false;
        this.proposalStoreService.showPriceEstimate = true;
      }
    });
  }
}
