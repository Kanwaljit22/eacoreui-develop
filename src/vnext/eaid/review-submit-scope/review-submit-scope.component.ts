import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { ScopeChangeReasonComponent } from 'vnext/modals/scope-change-reason/scope-change-reason.component';
import { EaidService } from '../eaid.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaidStoreService } from '../eaid-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { MessageService } from 'vnext/commons/message/message.service';

@Component({
  selector: 'app-review-submit-scope',
  templateUrl: './review-submit-scope.component.html',
  styleUrls: ['./review-submit-scope.component.scss']
})
export class ReviewSubmitScopeComponent implements OnInit,OnDestroy{

  constructor(public eaService: EaService, private modalVar: NgbModal, public eaidService: EaidService, public localizationService: LocalizationService, public eaIdStoreService: EaidStoreService, private messageService:MessageService,  public dataIdConstantsService: DataIdConstantsService) {

  }

  ngOnInit() {
    // if submit scope change button disabled due to error messages in submit scope change api, enable it
    this.eaIdStoreService.confirmationToSubmitScopeChange = false;
    if (!this.eaIdStoreService.allowSubmitScopeChange) {
      this.eaIdStoreService.allowSubmitScopeChange = true;
    }
  }
  ngOnDestroy(): void {
    this.messageService.pessistErrorOnUi = false;
  }

  editReason() {
    const modal =  this.modalVar.open(ScopeChangeReasonComponent, {windowClass: 'scope-reason-modal'});
    modal.result.then((result) => { 
    });
  }

  acceptToSubmitScopeChange(){
    this.eaIdStoreService.confirmationToSubmitScopeChange = !this.eaIdStoreService.confirmationToSubmitScopeChange
  }
}
