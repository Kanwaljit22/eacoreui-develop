import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-scope-change-reason',
  templateUrl: './scope-change-reason.component.html',
  styleUrls: ['./scope-change-reason.component.scss']
})
export class ScopeChangeReasonComponent implements OnInit {

  showReasons = false;
  reasonsList = [];
  selectedReasonId = '';
  selectedReasonDesc = '';
  reasonDetail = '';
  enterOtherReason = false;

  constructor(public ngbActiveModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, private eaRestService: EaRestService, private vnextService: VnextService, private messageService: MessageService, public eaService: EaService, public eaIdStoreService: EaidStoreService, public elementIdConstantsService: ElementIdConstantsService) {

  }

  ngOnInit(): void {
    this.getReasonCodes();
    if(this.eaIdStoreService.eaIdData?.scopeChangeDetails?.reasonInfo){
      this.selectedReasonId = this.eaIdStoreService.eaIdData.scopeChangeDetails.reasonInfo.id;
      this.selectedReasonDesc = this.eaIdStoreService.eaIdData.scopeChangeDetails.reasonInfo.desc;
      if(this.eaIdStoreService.eaIdData.scopeChangeDetails?.reasonInfo?.reasonDetails){
        this.reasonDetail = this.eaIdStoreService.eaIdData.scopeChangeDetails.reasonInfo.reasonDetails;
        this.enterOtherReason = true;
      }
    }
  }

  close() {
    this.ngbActiveModal.close({
    });
  }

  getReasonCodes(){
    const url = this.vnextService.getAppDomainWithContext +  'project/fetch-scope-change-reason-codes';
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      this.messageService.modalMessageClear();
      if(this.vnextService.isValidResponseWithData(res, true)){
        if(res.data.reasonInfo){
          this.reasonsList = res.data.reasonInfo;
          this.reasonsList.forEach(reason => {
            reason.selected = false;
          });
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  selectScopeReason(reason) {
    this.reasonsList.forEach(element => {
      element.selected = false;
    });
    this.selectedReasonId = reason.id;
    this.selectedReasonDesc = reason.desc;
    reason.selected = true;
    if (reason.id === 'other') {
      this.enterOtherReason = true;
    } else{
      this.enterOtherReason = false;
    }
    this.showReasons = false;
  }

  continue() {
    this.ngbActiveModal.close({
      continue: true
    });
  }

  continueToScopeChange() {
    if (!this.selectedReasonId || (this.selectedReasonId && this.enterOtherReason && !this.reasonDetail.trim())) {
      return;
    }
    const url = this.vnextService.getAppDomainWithContext + 'project/scope-change';
    let request = {
      data: { "eaid": this.eaIdStoreService.encryptedEaId, "reasonCode": this.selectedReasonId }
    }

    if (this.enterOtherReason && this.reasonDetail.trim()) {
      request.data['reasonDetails'] = this.reasonDetail.trim();
    }
    
    this.eaRestService.postApiCall(url, request).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.eaIdStoreService.eaIdData.scopeChangeDetails = response.data.scopeChangeDetails;
        if(response.data.overlapBuData){
          this.eaIdStoreService.eaIdData.overlapBuData = response.data.overlapBuData;
          if(response.data.overlapBuData?.overlapBu){
            this.eaIdStoreService.isShowBuOverlapMessage = true;
            this.eaIdStoreService.disableContinue = true;
          }
        }
        if (response.data?.complexMessage && response.data.complexMessage?.messages?.length) {
          this.messageService.disaplyModalMsg = false;
          this.messageService.pessistErrorOnUi = true;
          this.messageService.displayMessages(response.data.complexMessage?.messages);
        } 
        this.continue();
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

}
