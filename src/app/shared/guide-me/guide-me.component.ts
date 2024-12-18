import { CreditOverviewService } from './../credits-overview/credit-overview.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';
import { Component, OnInit, OnDestroy, Renderer2,ViewChild } from '@angular/core';
import { GuideMeService } from './guide-me.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from "@app/shared/services/locale.service";
import { CpsService } from '../cps/cps.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { Subscription } from 'rxjs';
import { CpsComponent } from "@app/shared/cps/cps.component";

@Component({
  selector: 'app-guide-me',
  templateUrl: './guide-me.component.html',
  styleUrls: ['./guide-me.component.scss']
})
export class GuideMeComponent implements OnInit, OnDestroy {

  label: string;
  features: any;
  displaySuiteDetails = false;
  subscription: Subscription;
  displayCPS = false;
  caseForCx = false;
  private openGuideMeSubscription: Subscription;
  @ViewChild('cpsComponent', { static: false }) cpsComponent:CpsComponent;


  constructor(public localeService: LocaleService, public guideMeService: GuideMeService, public proposalDataService: ProposalDataService,
    public qualService: QualificationsService, private messageService: MessageService, public appDataService: AppDataService,
    public cpsService: CpsService, public constantsService: ConstantsService, public renderer: Renderer2) { }

  ngOnInit() {


    this.guideMeService.displaySuiteInfoEmitter.subscribe(data => {

      if (data) {
        try {
          this.label = data.contextHeader.label;
          this.features = data.features;
          // this.appDataService.showEngageCPS = false;
          this.guideMeService.guideMeText = true;
          this.renderer.addClass(document.body, 'position-fixed');
          this.displaySuiteDetails = true;
        } catch (error) {
          // this.messageService.displayUiTechnicalError(error);
        }
      }
    });

    this.openGuideMeSubscription = this.appDataService.showGuideMeEmitter.subscribe((value) => {
      this.caseForCx = false;
      if (value === 'guideMe') {
        this.displayCPS = false;
        this.openGuideMe();
      } else if (value === 'openCase' ) {
        if(this.proposalDataService.cxProposalFlow){
          this.caseForCx = true;
        }
        this.displayCPS = true;
        this.openGuideMe();
      } 
      // else if(value === 'openCase' && this.proposalDataService.cxProposalFlow){
      //    this.engageSupport();
      // }
     
    });
  }


  // --------- The below method is optimized for validating response from  API call ---------
  //   openGuideMe(){
  //     //to display link for creating quote related case. quote link should be displayed only if proposal status is complete (for cross arch both proposal should be complete). 
  //     //quote link should not be displayed in qual and proposal list.
  //     if(!this.appDataService.enableQualFlag && this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.COMPLETE_STATUS && this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.userProposals && !this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch){
  //       this.cpsService.showQuoteLink = true;
  //     } else {
  //       this.cpsService.showQuoteLink = false;
  //     }

  //     if(!this.guideMeService.guideMeText){
  //     this.subscription = this.guideMeService.getGuideMeData().subscribe((res : any) => {
  //       if(res && !res.error){
  //           try{
  //             this.label = res.data.contextHeader.label;
  //             this.features = res.data.features;
  //             this.guideMeService.guideMeText = true;
  //           } catch (error) {
  //               this.messageService.displayUiTechnicalError(error);
  //             }
  //           } else {
  //             this.messageService.displayMessagesFromResponse(res);
  //           }
  //       });
  //   } else {
  //   this.guideMeService.guideMeText = false;
  // }
  // }
  openGuideMe() {
    //to display link for creating quote related case. quote link should be displayed only if proposal status is complete (for cross arch both proposal should be complete). 
    // quote link should not be displayed in qual and proposal list.
    if (!this.appDataService.enableQualFlag && this.proposalDataService.proposalDataObject.proposalData.status ===
      this.constantsService.COMPLETE_STATUS && this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.userProposals &&
      !this.proposalDataService.proposalDataObject.proposalData.isStatusIncompleteCrossArch) {
      this.cpsService.showQuoteLink = true;
    } else {
      this.cpsService.showQuoteLink = false;
    }

    if (!this.guideMeService.guideMeText) {
      this.subscription = this.guideMeService.getGuideMeData().subscribe((res: any) => {
        const responseObject = this.appDataService.validateResponse(res);

        if (responseObject) {
          this.label = responseObject.contextHeader.label;
          this.features = responseObject.features;
          this.guideMeService.guideMeText = true;
        }

        // Reset CPS view if open again
         if (this.displayCPS && this.appDataService.showEngageCPS && !this.displaySuiteDetails) {
     //         this.appDataService.openCaseViewVisible.emit();
              this.cpsComponent.showContent('pricing');
         }

      });
    } else {
      this.guideMeService.guideMeText = false;
    }
  }
  closeGuideMe() {
    this.guideMeService.guideMeText = false;
    this.cpsService.showCPSContent = false;
    this.displaySuiteDetails = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    this.renderer.removeClass(document.body, 'position-fixed');
  }
}
