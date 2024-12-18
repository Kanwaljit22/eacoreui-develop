import { VnextStoreService } from './../services/vnext-store.service';
import { Component, OnInit } from '@angular/core';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { Router } from '@angular/router';
import { LocalizationService } from '../services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from '../services/data-id-constants.service';
import { ProposalService } from 'vnext/proposal/proposal.service';

@Component({
  selector: 'app-success-popover',
  templateUrl: './success-popover.component.html',
  styleUrls: ['./success-popover.component.scss']
})
export class SuccessPopoverComponent implements OnInit {

  constructor(public projectService: ProjectService, public projectStoreService: ProjectStoreService, private proposalService: ProposalService,
    public vnextStoreService:VnextStoreService, private proposalStoreService: ProposalStoreService, private router: Router, public localizationService: LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
  }

  // go to copied proposal
  goToCopiedProposal(copiedProposalData) {
    this.proposalStoreService.proposalData = copiedProposalData; // set copied proposal data to proposal
    if (copiedProposalData.permissions) {
      this.proposalService.setProposalPermissions(copiedProposalData.permissions);
    }
    this.router.navigate(['ea/project/proposal/' + copiedProposalData.objId]);
    this.vnextStoreService.cleanToastMsgObject();
    this.proposalStoreService.isReadOnly = false;
    this.proposalStoreService.showProposalDashboard = false;
    this.proposalStoreService.showPriceEstimate = true; 
    // this.vnextStoreService.cleanToastMsgObject();
    // this.proposalService.goToCopiedPorposal(copiedProposalData)
  }
}
