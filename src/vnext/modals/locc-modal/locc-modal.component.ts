import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'vnext/project/project.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-locc-modal',
  templateUrl: './locc-modal.component.html',
  styleUrls: ['./locc-modal.component.scss']
})
export class LoccModalComponent implements OnInit, OnDestroy {

  public subscribers: any = {};

  constructor(public activeModal: NgbActiveModal, public projectService: ProjectService, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    // subscribe for closing locc modal when initiated or uploaded locc from modal
    this.subscribers.closeLoccModalSubject = this.projectService.closeLoccModalSubject.subscribe(() => {
      this.close();
    })
  }

  close() {
    this.activeModal.close({
      continue : false
    });
  }

  ngOnDestroy(){
    if(this.subscribers.closeLoccModalSubject){
      this.subscribers.closeLoccModalSubject.unsubscribe();
    }
  }
}
