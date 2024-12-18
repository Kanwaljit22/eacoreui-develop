import { Component, OnInit } from '@angular/core';
import { IRoadMap } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from "@app/shared/services/constants.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { RenewalSubscriptionService } from "@app/renewal-subscription/renewal-subscription.service";
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GenerateRenewalProposalComponent } from "@app/modal/generate-renewal-proposal/generate-renewal-proposal.component";
import { MessageService } from "@app/shared/services/message.service";
import { Router, RouterModule, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-review-renewal',
  templateUrl: './review-renewal.component.html',
  styleUrls: ['./review-renewal.component.scss']
})
export class ReviewRenewalComponent implements OnInit {
  roadMap: IRoadMap;
  proposalList =[];

  constructor(public localeService: LocaleService,  public appDataService: AppDataService ,public constantsService :ConstantsService, public utilitiesService :UtilitiesService , public renewalSubscriptionService: RenewalSubscriptionService ,private modalVar: NgbModal,public messageService: MessageService,private router: Router) { }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.renewalReviewConfirm;
    // Get proposal list 
    this.renewalSubscriptionService.getProposalList(this.renewalSubscriptionService.selectSubsriptionReponse.renewalId).subscribe((res: any) => {

      if (res && !res.error)  {

            this.proposalList = res.data;
      }else {
            this.messageService.displayMessagesFromResponse(res);
      }
    })
  }


  //Generate proposal 
  generateProposal() {

    const modalRef = this.modalVar.open(GenerateRenewalProposalComponent, { windowClass: 're-open' });

    modalRef.result.then((result) => {
  
      if (result.continue === true) {

        this.continueGenerateProposal();
      }
    });

  }
 
  continueGenerateProposal() {

    this.renewalSubscriptionService.createProposal(this.renewalSubscriptionService.selectSubsriptionReponse.renewalId).subscribe((res: any) => {

      if (res && !res.error)  {
        //Navidate to proposal list page
        this.router.navigate(['qualifications/proposal']);
      }else {
            this.messageService.displayMessagesFromResponse(res);
      }
    })
  }

  backToParameter() {
    this.roadMap.eventWithHandlers.back();
  }
}
