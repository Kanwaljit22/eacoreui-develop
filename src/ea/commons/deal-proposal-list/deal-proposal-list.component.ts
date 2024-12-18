import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-deal-proposal-list',
  templateUrl: './deal-proposal-list.component.html',
  styleUrls: ['./deal-proposal-list.component.scss']
})
export class DealProposalListComponent implements OnInit, OnDestroy {

  hideCreateProposalButton = false;
  globalDealScope = false;
  constructor(public eaStoreService: EaStoreService, public localizationService: LocalizationService, private router: Router, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, private constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    // hide create proposal for disti user accessing sfdc deal
    if( this.eaService.isPartnerUserLoggedIn() && (this.eaStoreService.selectedDealData.buyingProgram === '3.0' && this.eaStoreService.selectedDealData?.dealTyp === 'CISCO') || ((this.eaStoreService.dashboardCreatorFilter?.searchValue === this.constantsService.SHARED_BY_CISCO) && this.eaService.features.PARTNER_SUPER_USER_REL) ){
      this.hideCreateProposalButton = true; 
    }
  }
  
  ngOnDestroy() {
    sessionStorage.removeItem('projectId')
    sessionStorage.removeItem('loadCreateProposal');
  }


  closeFlyout() {
    this.eaStoreService.showProposalsFromDeal =  false;
    this.eaStoreService.projectId = '';
  }

  createProposal() {
    let index;
    let routeUrl;
    index = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, index)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    if (this.eaStoreService.selectedDealData.projectObjId){
      this.eaService.updateDetailsForNewTab();
      sessionStorage.setItem('projectId', this.eaStoreService.selectedDealData.projectObjId);
      window.open(url + 'ea/project/renewal');
      // this.router.navigate(['ea/project/proposal/createproposal']);
    } else { 
      sessionStorage.setItem('loadCreateProposal', 'true');
      window.open(url + 'qualifications/' + this.eaStoreService.selectedDealData.projectId);
    }
  }

  goToProject() {
    this.eaService.updateDetailsForNewTab();
    let idx;
    let routeUrl;

    idx = window.location.href.lastIndexOf(this.constantsService.EA);
    routeUrl = window.location.href.substring(0, idx)
    
   // const index =  window.location.href.lastIndexOf(this.constantsService.EA)
    const url  = routeUrl
    window.open(url + 'ea/project/' + this.eaStoreService.selectedDealData.projectObjId);
  }

  hideCreateProposal($event){
    this.hideCreateProposalButton = $event;
  }
  checkGlobalDealScope(event){
    this.globalDealScope = event;
  }
}
