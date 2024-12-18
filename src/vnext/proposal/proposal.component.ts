import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { Component, OnInit } from '@angular/core';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ActivatedRoute } from '@angular/router';
import { EaService } from 'ea/ea.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html'
})
export class ProposalComponent implements OnInit {

  localizationKeys = [LocalizationEnum.create_proposal,LocalizationEnum.edit_proposal_parameters,LocalizationEnum.price_estimation,LocalizationEnum.add_suites,LocalizationEnum.adjust_desired_quantity,LocalizationEnum.manage_collab_purchase_adjustment,LocalizationEnum.manage_purchase_adjustment,LocalizationEnum.purchase_adjustment_break_up,LocalizationEnum.service_purchase_adjustment_break_up,LocalizationEnum.update_purchase_adjustment,LocalizationEnum.proposalSummary,LocalizationEnum.exception,LocalizationEnum.project_proposal_list,LocalizationEnum.proposal_dashboard,LocalizationEnum.renewal, LocalizationEnum.services_discount ]

  constructor(private vnextStoreService:VnextStoreService, private activatedRoute: ActivatedRoute, private eaService: EaService) { }

  ngOnInit() {
    this.eaService.getLocalizedString(this.localizationKeys, true);
    //this.projectStoreService.projectData = this.activatedRoute.snapshot.data.projectData.data
    this.vnextStoreService.currentPageContext = this.vnextStoreService.applicationPageContextObject.PROPPSAL_CONTEXT; //This context we need for subheader
  }

}
