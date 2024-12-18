import { Component, OnInit } from '@angular/core';
import { ListProposalService } from '@app/proposal/list-proposal/list-proposal.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
@Component({
  selector: 'app-proposal-create-tutorial',
  templateUrl: './proposal-create-tutorial.component.html',
  styleUrls: ['./proposal-create-tutorial.component.scss']
})

export class ProposalCreateTutorialComponent implements OnInit {
  constructor(public listProposalService: ListProposalService, private qualService: QualificationsService,
    private appDataService: AppDataService) { }

  ngOnInit() {
    if (!this.qualService.qualification.qualID) {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      this.qualService.qualification = sessionObject.qualificationData;
    }
    // if(this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW){
    //   const qualName = this.qualService.qualification.name.toUpperCase();
    //   this.appDataService.custNameEmitter.emit({'context': AppDataService.PAGE_CONTEXT.userProposals , 'text' : qualName, qualId : this.qualService.qualification.qualID});
    // }
    this.listProposalService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
  }
}
