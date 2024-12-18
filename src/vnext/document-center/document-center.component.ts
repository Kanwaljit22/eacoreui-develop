import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { EaStoreService } from 'ea/ea-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-document-center',
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.scss']
})
export class DocumentCenterComponent implements OnInit, OnDestroy {
  
  editLegalPackage = true;
  hideDataForSubscriber = false;
  rwAccess = false;
  partnerUser = false;
  displayLegalPackage = false;
  displayDocCenterPage = false;
  displayCreditMemoTile = false;
  creditMemoDownload = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  displayMultiPartner = false;//to open and show contents of cust. consent tab.
  enableMultiPartnerTab = false;// to identify if cust consent tab should be displayed on page 
  partnerLoggedIn: boolean;

  constructor(public vnextService: VnextService, public proposalStoreService: ProposalStoreService, private activatedRoute: ActivatedRoute, private projectService: ProjectService
    ,private utilitiesService: UtilitiesService, private eaRestService: EaRestService,private router: Router, public vnextStoreService: VnextStoreService, public eaService: EaService, public elementIdConstantsService: ElementIdConstantsService,
    public eaStoreService: EaStoreService, private projectStoreService: ProjectStoreService, private proposalService: ProposalService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public contantsService: ConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString([LocalizationEnum.legal_package], true)
    if(this.proposalStoreService.loadCusConsentPage){//if comminf from in progress proposal only
      this.displayMultiPartner = true;
      this.enableMultiPartnerTab = true;
      this.proposalStoreService.loadCusConsentPage = false;
      this.displayDocCenterPage = false;
    }
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.DOCUMENT_CENTER_PAGE;
    this.checkProposalData();
    this.getCreditMemo();
    this.partnerLoggedIn = (this.eaService.isPartnerUserLoggedIn()) ? true : false;
  }
  ngOnDestroy() {
    this.eaStoreService.docObjData = {};
    this.eaStoreService.pageContext = '';
    this.proposalStoreService.inflightDocusign = false;
  }

  getCreditMemo(){
    const proposalObjId =this.activatedRoute.snapshot.params["proposalId"];
    const url = 'proposal/renewal/' + proposalObjId + '/credit-details-status';

    this.eaRestService.getApiCall(url).subscribe((response: any) => { 
      if (this.eaService.isValidResponseWithData(response)){
        this.displayCreditMemoTile = response.data.creditEligible;
        this.creditMemoDownload = response.data.creditFileReady;
      } 
    })
  }

  checkProposalData() {
    if (this.proposalStoreService.proposalData && this.proposalStoreService.proposalData.objId) {
      if(this.proposalStoreService.proposalData?.permissions){
        this.proposalService.setProposalPermissions(this.proposalStoreService.proposalData.permissions);
      }
      this.prepareData();
    } else {
      const proposalObjId =this.activatedRoute.snapshot.params["proposalId"];
      const url = this.vnextService.getAppDomainWithContext + 'proposal/' + proposalObjId;
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.proposalStoreService.proposalData = response.data;
          this.vnextService.setDealDetailsFromProposalData(response.data); // to set dealinfo, customerInfo, partnerInfo and loccDetail from proposal data
          this.projectService.checkLoccCustomerRepInfo(); // to check locc customer rep details if any of the fields are empty
          if(response.data.permissions){
            this.proposalService.setProposalPermissions(response.data.permissions);
          }
          this.prepareData();
        }

      });
    }
  }

  prepareData(){
    this.eaService.isSpnaFlow = (this.proposalStoreService.proposalData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
    if (this.proposalStoreService.proposalData.status !== 'COMPLETE' && !this.displayMultiPartner ) {
      this.backToDashboard();
    } else if(this.proposalStoreService.proposalData.status === 'COMPLETE' ){
       this.proposalService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalStoreService.proposalData); 
       if(this.eaStoreService.docObjData.proposalObjectId){
        this.hideDataForSubscriber = true;
        this.partnerUser = (this.eaStoreService.docObjData.accessType === "Partner") ? true : false;
        this.rwAccess = (this.eaStoreService.docObjData.accessType === "RW") ? true : false;
        if(this.rwAccess){
          this.rwUser();
        } else {
          this.roUser();
        }
    
        this.displayDocCenterPage = true;
        // Get selected smart account 
        this.checkSmartAccount();
      } else {
        this.displayDocCenterPage = true;
        // Get selected smart account 
        this.checkSmartAccount();
      } 

      this.checkForCustConsent();
    }
    if(this.proposalStoreService.loadLegalPackage){
      this.displayLegalPackage = true;
      this.proposalStoreService.loadLegalPackage = false;
    }
  }

  checkForCustConsent(){
    //api call
    const url = this.vnextService.getAppDomainWithContext + 'document/proposal-documents-data?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      // check for arleady signed/ intitated legal package 
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.documents && response.data.documents.length){
          for (const document of response.data.documents){
            //if (document.type === 'PROGRAM_TERMS'){
         if (document.type === 'CUSTOMER_CONSENT'){  
              this.enableMultiPartnerTab = true;
            }
            if (document.type === 'PROGRAM_TERMS'){
              this.proposalStoreService.inflightDocusign = document.inflightDocusign
            }
          }
        }
      }
      
    })
  }

  rwUser(){
    if(this.eaStoreService.docObjData.orderStatus === 'Booked'){
      this.editLegalPackage = false;
    }
    else {
      this.editLegalPackage = true;
    }
  }


  roUser(){
    this.editLegalPackage = false;
  }

  // check and Get selected smart account 
  checkSmartAccount(){
    if(!this.projectStoreService.projectData.smartAccount) {
      this.proposalService.getSmartAccount();
    }
  }


  // method to request IB report
  requestIb() {
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId +'/report/PROPOSAL_INSTALL_BASE_REPORT';
    this.eaRestService.postApiCall(url, {}).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)){
        // logic to show success popover for requesting IB
        this.vnextStoreService.toastMsgObject.ibReportReequested = true; // set to show success message
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject(); // after 5 sec clear the message
        }, 5000);
      }
    });
  }

  // method to download proposal summary document
  downloadSummaryDoc(){
    const url ='document/download/PROPOSAL_SUMMARY?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  showLegalPackage(){
    this.displayLegalPackage = true;
    this.displayMultiPartner = false;
  }

  showDocuments(){
    this.displayLegalPackage = false;
    this.displayMultiPartner = false;
  }

  backToDashboard(){
    this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
  }

  // to downlaod locc file
  downloadLoccFile(){
    this.vnextService.downloadLocc(this.downloadZipLink);
  }

  showMultiPartnerConsent(){
    this.displayMultiPartner = true;
    this.displayLegalPackage = false;
  }

  downloadCreditMemo() {
    const url = this.vnextService.getAppDomainWithContext + this.contantsService.URL_PROPOSAL_RENEWAL + this.proposalStoreService.proposalData.objId + this.contantsService.URL_DOWNLOAD_SUBSCRIPTION_CREDIT;
    this.eaRestService.downloadDocApiCall(url).subscribe((response:any) => {
      if(this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      }
    });
  }

}
