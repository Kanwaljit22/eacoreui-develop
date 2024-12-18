import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-review-change-scope-summary',
  templateUrl: './review-change-scope-summary.component.html',
  styleUrls: ['./review-change-scope-summary.component.scss']
})
export class ReviewChangeScopeSummaryComponent implements OnInit {

  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  reviewSummaryData = [];
  dataNotPresent = false;

  constructor(public messageService: MessageService,public ngbActiveModal: NgbActiveModal, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, private eaRestService: EaRestService, private vnextService: VnextService, public eaIdStoreService: EaidStoreService, public utilitiesService: UtilitiesService, public constantsService: ConstantsService ) {
  }

  ngOnInit(): void {
    this.getReviewSummaryDetails();
  }

  getReviewSummaryDetails() {
   const url = 'project/eaid/review-scope-changes?eaid='  + this.eaIdStoreService.encryptedEaId;
     this.eaRestService.getApiCall(url).subscribe((response: any) => {
       if (this.vnextService.isValidResponseWithData(response, true)) {
        if(response.data?.buTrackers?.length){
          this.reviewSummaryData = response.data.buTrackers;
        } else {
          this.dataNotPresent = true;
        }
       } else {
        if(response.error){
          this.messageService.disaplyModalMsg = true;
          this.messageService.displayMessagesFromResponse(response);
        } else if(!response.data) {
          this.dataNotPresent = true;
        }
       }
     })
  }

  close() {
    this.messageService.disaplyModalMsg = false;
    this.ngbActiveModal.close({
    });
  }

  downloadReport() {
    this.messageService.disaplyModalMsg = false;
    this.ngbActiveModal.close({
      continue: true
    });
  }

}
