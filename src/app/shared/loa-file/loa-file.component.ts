import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from './../../shared/copy-link/copy-link.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PriceEstimationService } from './../../proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';

@Component({
  selector: 'app-loa-file',
  templateUrl: './loa-file.component.html',
  styleUrls: ['./loa-file.component.scss']
})
export class LOAFileComponent implements OnInit {

  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;


  constructor(public appDataService: AppDataService, private proposalDataService: ProposalDataService,
    public constantsService: ConstantsService, public localeService: LocaleService,
    public messageService: MessageService, public activeModal: NgbActiveModal,
    public documentCenter: DocumentCenterService, public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  downloadLOADoc(documentID) {

    let url = 'api/document/partner/download?proposalId=' + this.proposalDataService.proposalDataObject.proposalId + '&documentId=' + documentID;

    this.documentCenter.downloadDoc(url).subscribe((res: any) => {
      this.utilitiesService.saveFile(res, this.downloadZipLink);
    });
  }


  deleteDoc(documentID) {

    this.documentCenter.deleteLOA(documentID).subscribe((res: any) => {

      this.documentCenter.getLOAData().subscribe((response: any) => {
        this.documentCenter.isLOAUploaded = false;
        this.documentCenter.loaData = [];

        if (response.data && !response.error) {
          response.data.loaDocuments.forEach(element => {

            if (!element.deleted) {
              // Set LOA document parameter
              this.documentCenter.setLOAParam(element);
            }
          });

          if (this.documentCenter.loaData.length === 0) {
            this.activeModal.dismiss('Cross click');
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
    });
  }

}
