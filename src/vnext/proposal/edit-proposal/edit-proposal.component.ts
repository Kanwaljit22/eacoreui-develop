import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProposalStoreService } from '../proposal-store.service';
import { ProposalRestService } from '../proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectService } from 'vnext/project/project.service';
import { MessageService } from "vnext/commons/message/message.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalService } from '../proposal.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-edit-proposal',
  templateUrl: './edit-proposal.component.html',
  styleUrls: ['./edit-proposal.component.scss']
})
export class EditProposalComponent implements OnInit, OnDestroy {
  
  // showPriceEstimate = false;
  // showProposalSummary = false;

  constructor(private router: Router,private activatedRoute: ActivatedRoute, private constantsService: ConstantsService,
    public proposalStoreService: ProposalStoreService, private proposalRestService: ProposalRestService, private projectService: ProjectService,
    public vnextService: VnextService,private messageService:MessageService,private projectStoreService:ProjectStoreService, private proposalService: ProposalService,
    public localizationService:LocalizationService,public eaStoreService:EaStoreService,public eaService:EaService) { }

  ngOnInit() {
    if(this.eaStoreService.isValidationUI && !window.location.pathname.includes('vui')){
      this.eaService.navigateToVui()
    }
    this.getProposalData(); 
    // this.vnextService.isRoadmapShown = true;
    this.vnextService.hideProposalDetail = true;
    this.vnextService.refreshProposalData.subscribe((data?:any) => {
      this.getProposalData(); 
      this.vnextService.hideProposalDetail = true;
    })
  }

  ngOnDestroy() {
    this.proposalStoreService.isReadOnly = false;
    this.proposalStoreService.showProposalDashboard = false;
    this.proposalStoreService.showProposalSummary = false;
    this.proposalStoreService.showPriceEstimate = false;
    this.proposalStoreService.showFinancialSummary = false;
    this.proposalStoreService.rsdDueCurrDate = false;
    this.proposalStoreService.proposalEditAccess = true;
    this.proposalStoreService.proposalReopenAccess = false;
    this.proposalStoreService.allowProposalEditName = false;
    this.proposalStoreService.projectStatus = ''
    this.vnextService.isRoadmapShown = false;
    this.proposalStoreService.allowUpdatePA = false;
    this.eaService.isUpgradeFlow = false;
    this.proposalStoreService.masterAgreementInfo = {};
    this.proposalStoreService.isPartnerAccessingSfdcDeal = false;
  }

  goToSummary() {
    this.vnextService.isRoadmapShown = true;
    if (this.proposalStoreService.proposalData.status !== 'COMPLETE' && this.proposalStoreService.proposalData.status !== 'IN_PROGRESS'){
      this.proposalStoreService.showProposalSummary = true;
      this.proposalStoreService.showPriceEstimate = false;
    } else if (this.proposalStoreService.isReadOnly && this.proposalStoreService.proposalData.status === 'COMPLETE') {
      this.proposalStoreService.showProposalDashboard = true;
      this.proposalStoreService.showPriceEstimate = false;
    }
  }

  getProposalData(){
     let proposalObjId = this.activatedRoute.snapshot.params["proposalId"];
     let url = this.vnextService.getAppDomainWithContext + 'proposal/' + proposalObjId;

    if(this.eaStoreService.isValidationUI){
      // proposalObjId ="65002b4fe7226173c51cd9d0";
      // url  = `assets/data/validationui/proposalData.json`
      const buyingProgram =  this.activatedRoute.snapshot.queryParams.bp;
      url = this.vnextService.getAppDomainWithContext +'validation/projectProposalTemplate?bp='+ buyingProgram;
    }

    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if(this.eaStoreService.isValidationUI){
        const { data , ...other} = response;
        // check for project status from project data in VUI
        if(response.data?.project?.status){
          this.proposalStoreService.projectStatus = response.data.project.status;
        }
        response = { ...other, data : data.proposal };
      }
      if (this.vnextService.isValidResponseWithData(response, false, true)) {
        this.proposalStoreService.proposalData = response.data;
        this.eaService.updateUserEvent(this.proposalStoreService.proposalData, this.constantsService.PROPOSAL, this.constantsService.ACTION_UPSERT);
        //if(!this.eaStoreService.isValidationUI){
          this.eaService.isSpnaFlow = (this.proposalStoreService.proposalData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
        //}
        if(this.proposalStoreService.proposalData.dealInfo?.subscriptionUpgradeDeal){
          this.eaService.isUpgradeFlow = true;
        } else {
          this.eaService.isUpgradeFlow = false;
        }
        // check for project status from proposal data
        if(response.data.projectStatus){
          this.proposalStoreService.projectStatus = response.data.projectStatus
        }
        this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.proposalStoreService.proposalData.dealInfo);
        this.proposalService.isReadOnlyProposal(this.proposalStoreService.proposalData.sharedWithDistributor);
        if(this.proposalStoreService.proposalData.status === 'COMPLETE'){
          if (this.vnextService.isRouteAllow) {
            this.proposalStoreService.showPriceEstimate = true;
          } else {
            this.proposalStoreService.showProposalDashboard = true;
            this.vnextService.isRoadmapShown = true;
          }

          this.proposalStoreService.isReadOnly = true;
        } else if(this.proposalStoreService.proposalData.status === 'IN_PROGRESS') {
          // this.vnextService.isRoadmapShown = false;
          // this.eaStoreService.isPePageLoad = true;
          // this.blockUiService.spinnerConfig.noProgressBar();
          this.proposalService.customPEProgressBar();
          this.proposalStoreService.showPriceEstimate = true;
        } else {
          this.vnextService.isRoadmapShown = true;
          this.proposalStoreService.isReadOnly = true;
          this.proposalStoreService.showProposalSummary = true;
        }
        //if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = this.proposalStoreService.proposalData?.changeSubDeal ? true : false;
        //}
        this.proposalService.setProposalPermissions(response.data.permissions);
        this.vnextService.setDealDetailsFromProposalData(response.data); // to set dealinfo, customerInfo, partnerInfo and loccDetail from proposal data
        this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
        this.proposalService.checkToShowEditNameIcon(response.data); // check and set to show editicon for proposal name change

        // check if reseller accesing disti opty and set flag to disable proposal actions
        if(this.eaService.isDistiOpty && this.eaService.isResellerLoggedIn && this.proposalStoreService.proposalEditAccess && this.proposalStoreService.proposalData.status !== 'COMPLETE') {
          this.proposalStoreService.isReadOnly = true;
        }
        // Get selected smart account 
        if(!this.projectStoreService.projectData.smartAccount) {
          this.proposalService.getSmartAccount();
        }
        // set if partner/disti accessing sfdc deal proposal
        this.proposalStoreService.isPartnerAccessingSfdcDeal = this.proposalService.checkPartnerLogInSfdcDeal();
      }
      
    });
  }
  

  redirectoProject(){
    this.router.navigate(['ea/project/' + this.proposalStoreService.proposalData.projectObjId]);
  }
}
