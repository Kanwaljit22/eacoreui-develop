import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-request-documents',
  templateUrl: './request-documents.component.html',
  styleUrls: ['./request-documents.component.scss']
})
export class RequestDocumentsComponent implements OnInit {

  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  constructor(public activeModal: NgbActiveModal, public vnextService: VnextService, private proposalStoreService: ProposalStoreService, private eaRestService: EaRestService, public vnextStoreService: VnextStoreService, public utilitiesService: UtilitiesService, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public eaService: EaService) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close({
      continue: false
    });
  }

  // to downlaod locc file
  downloadLoccFile() {
    this.vnextService.downloadLocc(this.downloadZipLink);
  }

  // method to request IB report
  requestIb() {
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '/report/PROPOSAL_INSTALL_BASE_REPORT';
    this.eaRestService.postApiCall(url, {}).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.close();
        // logic to show success popover for requesting IB
        if(this.vnextStoreService.toastMsgObject){
          this.vnextStoreService.toastMsgObject.ibReportReequested = true; // set to show success message
        } // set to show success message
        this.close();
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject(); // after 5 sec clear the message
        }, 2000);
      }
    });
  }

  // method to download proposal summary document
  downloadSummaryDoc() {
    const url = 'document/download/PROPOSAL_SUMMARY?p=' + this.proposalStoreService.proposalData.objId;
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      }
    });
  }

}
