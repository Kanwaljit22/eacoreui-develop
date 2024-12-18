import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { ServiceChangesConfirmationComponent } from '../service-changes-confirmation/service-changes-confirmation.component';
import { AppDataService } from '@app/shared/services/app.data.service';

@Component({
  selector: 'app-manage-service-specialist',
  templateUrl: './manage-service-specialist.component.html',
  styleUrls: ['./manage-service-specialist.component.scss']
})
export class ManageServiceSpecialistComponent implements OnInit {

  cxTeamData= [];

  constructor(public activeModal: NgbActiveModal, public qualService: QualificationsService, public modalVar: NgbModal, public appDataService: AppDataService) { }

  ngOnInit() {

      // set cx teams data from api
    if (!this.qualService.qualification.cxTeams) {
      this.qualService.qualification.cxTeams = [];
      this.cxTeamData = [];
    } else {
      this.cxTeamData = this.qualService.qualification.cxTeams;
    }
  }

  close() {
    this.activeModal.close();
  }

  continue() {
    this.activeModal.close();
    // const modalRef = this.modalVar.open(ServiceChangesConfirmationComponent, {
    //   windowClass: "service-confirmation"
    // });
    // modalRef.componentInstance.mangeServiceConfirmation = true;
    // modalRef.componentInstance.isFromSummaryPage = (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep);
  }

}
