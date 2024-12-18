import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProjectService } from 'vnext/project/project.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-ng-project-proposal-list',
  templateUrl: './project-proposal-list.component.html',
  styleUrls: ['./project-proposal-list.component.scss']
})
export class ProjectProposalListComponent implements OnInit, OnDestroy {
  isPartnerLoggedIn = false;

  constructor(private router: Router, public projectStoreService: ProjectStoreService,public localizationService:LocalizationService, public vnextService: VnextService, public eaService: EaService, public projectService: ProjectService, private eaStoreService: EaStoreService, private vnextStoreService: VnextStoreService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }


  ngOnInit() {
    this.vnextStoreService.currentPageContext = this.vnextStoreService.applicationPageContextObject.PROPOSAL_LIST_CONTEXT; //This context we need for subheader
    this.eaStoreService.editName = false;
    if(this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerLoggedIn = true
    }
  }

  goToProject() {
    this.router.navigate(['ea/project/' + this.projectStoreService.projectData.objId]);
  }

   createNew() {
    if(this.eaStoreService.changeSubFlow){
      this.vnextService.isRoadmapShown = false;
      this.vnextService.hideProposalDetail = true;
      this.vnextService.hideRenewalSubPage = true;
      this.router.navigate(['ea/project/proposal/createproposal']);
    } else {  
      this.vnextService.isRoadmapShown = true;
      this.vnextService.hideProposalDetail = false;
      this.vnextService.roadmapStep = 1;
      this.router.navigate(['ea/project/renewal']);
    }
  }

  isAuth() {
    if (this.eaService.isDistiLoggedIn && this.eaService.isResellerOpty) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy() {
    this.vnextStoreService.currentPageContext = '';
    this.eaStoreService.editName = false;
  }
}