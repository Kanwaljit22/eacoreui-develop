import { ProposalArchitectureService } from './../proposal-architecture.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionService } from '@app/permission.service';
import { AppDataService } from '@app/shared/services/app.data.service';

@Component({
  selector: 'app-questionnaires',
  templateUrl: './questionnaires.component.html',
  styleUrls: ['./questionnaires.component.scss']
})
export class QuestionnairesComponent implements OnInit, OnChanges {

  @Input() public parentObject: ProposalArchitectureService;
  @Input() public currentQuestion: any;
  @Input() type: any;
  @Input() isRenewalFlow = false;
  disableSelection = false;
  constructor(public proposalArchitectureService: ProposalArchitectureService, public utilitiesService: UtilitiesService,
    public localeService: LocaleService, public permissionService: PermissionService, public appDataService: AppDataService) { }
  ngOnInit() {
    // check if not has proposal edit permission or roadmappath and show readonly mode
    if ((!this.permissionService.proposalEdit || this.appDataService.roadMapPath)) {
      this.disableSelection = true;
    }
  }
  ngOnChanges(changes) {
    if (changes.currentQuestion && this.currentQuestion && this.currentQuestion.forEach) {
      this.currentQuestion.forEach(q => {
        if (q.type === 'radio') {
          const selected = q.answers.find(x => x.selected);
          q.notSelected = selected == null;
        }
      })
    }
  }
}
