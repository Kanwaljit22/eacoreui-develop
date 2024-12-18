import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from "@app/shared/services/locale.service";
import { ApproveExceptionService } from "./approve-exception.service";
import { MessageService } from "@app/shared/services/message.service";
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { Router, RouterModule } from '@angular/router';
import { AppDataService } from '@app/shared/services/app.data.service';


@Component({
  selector: 'app-approve-exception',
  templateUrl: './approve-exception.component.html',
  styleUrls: ['./approve-exception.component.scss']
})
export class ApproveExceptionComponent implements OnInit {

  exceptionJustification = ''
  isUpdate =  false

  constructor(public constantsService: ConstantsService,public localeService:LocaleService, public activeModal: NgbActiveModal,public approveExceptionService: ApproveExceptionService, public messageService: MessageService, public renderer: Renderer2,private copyLinkService:CopyLinkService, private router: Router,public appDataService: AppDataService) { }

  ngOnInit() {

  }

    isProposalValueChanged(event) {
    if (!this.exceptionJustification.trim()) {
      this.isUpdate = false;
      return;
    }
      this.isUpdate = true;
  }

    focusDescription() {
    const element = this.renderer.selectRootElement('#exceptionJustification');
      element.focus();
  }


  approve() {

    let reqJSON = {
         "overrideThresholdExceptionMessage":this.exceptionJustification,
  }

     this.approveExceptionService.approveException(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
            this.copyLinkService.showMessage('Your exception approval justification has been saved.');
            this.activeModal.close({
            });

        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

}