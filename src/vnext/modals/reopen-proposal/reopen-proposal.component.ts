import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-reopen-proposal',
  templateUrl: './reopen-proposal.component.html',
  styleUrls: ['./reopen-proposal.component.scss']
})
export class ReopenProposalComponent implements OnInit {

  acceptReopen = true;
  constructor(public ngbActiveModal: NgbActiveModal, public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('reopen-proposal');
  }

  close() {
    this.ngbActiveModal.close({
      continue: false
    });
  }

  // change checkbox selection
  accept(){
    this.acceptReopen = !this.acceptReopen
  }

  // accept reopen proposal 
  reopen(){
    this.ngbActiveModal.close({
      continue: true
    });
  }

}
