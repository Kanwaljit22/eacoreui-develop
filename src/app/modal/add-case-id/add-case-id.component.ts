import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApproverTeamService } from '@app/proposal/edit-proposal/approver-team/approver-team.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Component({
  selector: 'app-add-case-id',
  templateUrl: './add-case-id.component.html',
  styleUrls: ['./add-case-id.component.scss']
})
export class AddCaseIdComponent implements OnInit {

  caseId = '';
  type = '';
  isUpdate = false;
  constructor(public localeService: LocaleService, public appDataService: AppDataService,
    public renderer: Renderer2, public activeModal: NgbActiveModal, public approverTeamService: ApproverTeamService,
    private proposalDataService: ProposalDataService) { }

  ngOnInit() {
    // console.log(this.type);
  }

  // method to validate entered value
  isCaseIdValueChanged($event) {
    if (!this.caseId.trim()) {
      this.isUpdate = false;
      return;
    }
    this.isUpdate = true;
  }

  focusInput(value) { }

  focusDescription() {
    const element = this.renderer.selectRootElement('#caseIdNumber');
    element.focus();
  }

  // This method will be called when close the modal
  close() {
    this.activeModal.close();
  }

  // method to close modal and send entered value
  update() {
    this.activeModal.close({
      caseNumber: this.caseId
    });
  }
}
