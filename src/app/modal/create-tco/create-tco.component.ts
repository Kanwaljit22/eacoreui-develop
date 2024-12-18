import { Component, OnInit, Renderer2 } from '@angular/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { MessageService } from '@app/shared/services/message.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { Router } from '@angular/router';
import { ProposalDataService } from '@app/proposal/proposal.data.service';

@Component({
  selector: 'app-create-tco',
  templateUrl: './create-tco.component.html',
  styleUrls: ['./create-tco.component.scss']
})
export class CreateTcoComponent implements OnInit {
  tcoName: string;
  isUpdateTCO = false;
  isCreateTCO = false;
  headerMessage: any;
  isUpdate = false; // this flag is use for enable and disable update button.
  initialName: string;

  constructor(public localeService: LocaleService, private renderer: Renderer2, public activeModal: NgbActiveModal
    , private tcoApiCallService: TcoApiCallService, private messageService: MessageService, private proposalDataService: ProposalDataService,
    private tcoDataService: TcoDataService) { }

  ngOnInit() {
    this.initialName = this.tcoName;
  }

  close() {
    this.activeModal.close();
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  create() {
    this.tcoApiCallService.createTco(this.tcoName, this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        this.tcoDataService.tcoDataObj = res.data;
        this.tcoDataService.tcoId = res.data.id;
        this.activeModal.close({ tcoCreated: true });
        // set the loadreview page to false to load modeling page by default
        this.tcoDataService.loadReviewFinalize = false;
        this.tcoDataService.conponentNumToLoad = 0;  // We need to load modeling page in case of create.
      } else {
        this.activeModal.close({ tcoCreated: false });
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // This method will be used to update TCO name
  update() {
    this.activeModal.close({ tcoUpdate: true, updatedName: this.tcoName });
  }


  // This method is use to check wheather name is changed or not.
  isNameChanged(event) {
    if (this.tcoName.trim() !== '') {
      if (!this.isUpdateTCO) {
        this.isCreateTCO = true;
      } else {
        if (this.tcoName.trim() !== this.initialName) {
          this.isUpdate = true;
        } else {
          this.isUpdate = false;
        }
      }
    } else {
      this.isUpdate = false;
      this.isCreateTCO = false;
    }
  }

}
