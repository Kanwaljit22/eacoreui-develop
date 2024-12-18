import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from "@app/proposal/proposal.data.service";


@Component({
  selector: 'app-re-open',
  templateUrl: './re-open.component.html',
  styleUrls: ['./re-open.component.scss']
})
export class ReOpenComponent implements OnInit {

  warningMessage_one: string;
  warningMessage_two: string;
  warningMessage_three = '';
  warningMessage_four = '';
  warningMessage_reopen = '';
  reOpenQualProposalCheck = true;

  header: string;
  isProposalReopen = false;
  
  constructor(public activeModal: NgbActiveModal, public localeService: LocaleService, public appDataService: AppDataService,public proposalDataService: ProposalDataService ) { }

  ngOnInit() {

    this.isProposalReopen = false;

    if ((this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineGeographyStep) ||
    (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationSummaryStep) ||
    (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep) ||
    (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep)) {
      this.header = this.localeService.getLocalizedString('common.QUALIFICATION');
      this.warningMessage_reopen = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_QUAL_CONDITION');
      this.warningMessage_one = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_QUAL_PART_ONE');
      this.warningMessage_two = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_QUAL_PART_TWO');
      this.warningMessage_three = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_QUAL_PART_THREE');
      this.warningMessage_four = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_QUAL_PART_FOUR');
    } else if ((this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep) ||
    (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep) ||
    (this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep)) {

      this.isProposalReopen = true;

      this.header = this.localeService.getLocalizedString('common.PROPOSAL');
      this.warningMessage_one = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_PROPOSAL_PART_ONE');
      this.warningMessage_two = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_PROPOSAL_PART_TWO');
      this.warningMessage_reopen = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_PROPOSAL_CONDITION');
      this.warningMessage_three = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_PROPOSAL_PART_THREE');
      this.warningMessage_four = this.localeService.getLocalizedMessage('common.REOPEN_WARNING_PROPOSAL_PART_FOUR');
      // checking the pagecontext to respective page and show message in the re-open modal window

    }
  }

  continue() {
    this.activeModal.close({
      continue: true
    });
  }

  close() {
    this.activeModal.close({
    });
  }

  confirmReOpen(){
    this.reOpenQualProposalCheck = !this.reOpenQualProposalCheck; 
  }

}
