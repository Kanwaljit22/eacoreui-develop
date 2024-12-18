import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProjectInfo, ProjectStoreService } from 'vnext/project/project-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-change-deal-completion',
  templateUrl: './change-deal-completion.component.html',
  styleUrls: ['./change-deal-completion.component.scss']
})
export class ChangeDealCompletionComponent implements OnInit {

  newProjectData: IProjectInfo = {};
  constructor(public ngbActiveModal: NgbActiveModal, private router: Router, private projectStoreService: ProjectStoreService, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService ) { }

  ngOnInit() {
    this.eaService.getLocalizedString('change-deal-completion');
  }

  close() {
    this.ngbActiveModal.close();
  }

  goToNewProject(){
    this.projectStoreService.projectData = this.newProjectData;
    const index = window.location.href.lastIndexOf('/')
    const url = window.location.href.substring(0, index + 1)
    window.location.href = url + this.newProjectData.objId;
    window.location.reload();
  }
}
