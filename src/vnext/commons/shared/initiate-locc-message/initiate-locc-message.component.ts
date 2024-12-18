import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LoccModalComponent } from 'vnext/modals/locc-modal/locc-modal.component';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';

@Component({
  selector: 'app-initiate-locc-message',
  templateUrl: './initiate-locc-message.component.html',
  styleUrls: ['./initiate-locc-message.component.scss']
})
export class InitiateLoccMessageComponent implements OnInit {

  showLoccMessage = true;

  constructor(public projectStoreService: ProjectStoreService, public projectService: ProjectService, private modalVar: NgbModal, public vnextStoreService: VnextStoreService, public localizationService: LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
  }

  // method to show message 
  showMessage() {
    this.showLoccMessage = false;
    this.projectService.showLocc = false;
  }

  // method to open locc modal
  initiateLocc() {
    this.projectService.showLocc = true;
    const modalRef = this.modalVar.open(LoccModalComponent, { windowClass: 'lg' });
    modalRef.result.then((result) => {
    });
  }

}
