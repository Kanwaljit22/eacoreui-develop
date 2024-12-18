import { Component, OnInit, HostListener, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ChangeDealCompletionComponent } from 'vnext/modals/change-deal-completion/change-deal-completion.component';
import { ChangeDealIdComponent } from 'vnext/modals/change-deal-id/change-deal-id.component';
import { ReviewAcceptComponent } from 'vnext/modals/review-accept/review-accept.component';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from '../project-rest.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { CloneProposalComponent } from 'vnext/modals/clone-proposal/clone-proposal.component';
import { EaRestService } from 'ea/ea-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-next-best-action',
  templateUrl: './next-best-action.component.html',
  styleUrls: ['./next-best-action.component.scss']
})
export class NextBestActionComponent implements OnInit, OnDestroy {
  @Input() showActions = false;
  isEnableDone = false;
  public subscribers: any = {};
  isPartnerUserLoggedIn = false;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    windowClass: "lg"
  };


  constructor(private router: Router, private modalVar: NgbModal, public projectStoreService: ProjectStoreService, public projectService: ProjectService, public vnextStoreService: VnextStoreService, private messageService: MessageService,
    public localizationService:LocalizationService, public vnextService: VnextService, public eaService: EaService, public eaStoreService: EaStoreService, public dataIdConstantsService: DataIdConstantsService, private eaRestService: EaRestService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
      if (!this.projectStoreService.projectData.dealInfo.partnerDeal && !this.projectStoreService.projectData.dealInfo.distiDeal) {
        delete this.projectStoreService.nextBestActionsStatusObj.isLoccDone;
        delete this.projectStoreService.nextBestActionsStatusObj.isPartnerAdded;
      }
      if (this.projectStoreService.projectData.dealInfo.partnerDeal || this.projectStoreService.projectData.dealInfo.distiDeal) {
        if (this.projectStoreService.projectData.changeSubscriptionDeal && this.projectStoreService.projectData.dealInfo?.directRTM) {
          delete this.projectStoreService.nextBestActionsStatusObj.isLoccDone;
          delete this.projectStoreService.nextBestActionsStatusObj.isPartnerAdded;
        } else {
          delete this.projectStoreService.nextBestActionsStatusObj.isCiscoTeamMemberAdded;
        }
      }


    

    // subscribe to updateNextBestOptions subject and inside that loop on nextbestactionsoj to enable done
    this.subscribers.updateNextBestOptionsSubject = this.projectService.updateNextBestOptionsSubject.subscribe((updatedObj: any) => {
      this.projectStoreService.nextBestActionsStatusObj[updatedObj.key] = updatedObj.value;
      let enable = true;
      for (let variable in this.projectStoreService.nextBestActionsStatusObj) {
        if (!this.projectStoreService.nextBestActionsStatusObj[variable]) {
          enable = false;
          break;
        }
      }
      this.isEnableDone = enable;
    });

    // subscribe after completing/reopening project to show actions section or not
    this.subscribers.updateProjectstatusSubject = this.projectService.updateProjectstatusSubject.subscribe((action: any) => {
      this.showActions = action;
    })
    if (this.eaService.isPartnerUserLoggedIn()) {
      this.isPartnerUserLoggedIn = true;
    }
  }

  createProposal() {
    if (!this.projectStoreService.projectEditAccess){
      return;
     }
    if(this.eaStoreService.changeSubFlow || this.projectStoreService.projectData.dealInfo?.subscriptionUpgradeDeal){
      this.vnextService.isRoadmapShown = false;
      this.vnextService.hideProposalDetail = true;
      this.vnextService.hideRenewalSubPage = true;
      this.router.navigate(['ea/project/proposal/createproposal']);
    } else {  
      this.vnextService.isRoadmapShown = true;
      this.vnextService.hideProposalDetail = false;
      this.vnextService.hideRenewalSubPage = false;
      this.vnextService.roadmapStep = 1;
      this.router.navigate(['ea/project/renewal']);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 160) {
      let element = document.getElementById('nextBestAction');
      element.classList.add('stickyAction');
    } else {
      let element = document.getElementById('nextBestAction');
      element.classList.remove('stickyAction');
    }
  }

  showNextActions(type) {
    if (!this.projectStoreService.projectEditAccess){
      return;
    }
    // show modal for confirmation and call api to lock project
    const modalRef = this.modalVar.open(ReviewAcceptComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if (result.continue){
        this.projectService.modifyProject(type);
      }
    });
  }

  // View proposal List
  viewProposalList() {

    this.router.navigate(['ea/project/proposal/list']);
  
  }

  // to open change deal modal
  changeDealId() {
    if(!this.projectStoreService.projectEditAccess){
      return;
    }

    const modalRef = this.modalVar.open(ChangeDealIdComponent, { windowClass: 'lg' });
    modalRef.result.then((result) => {
      if (result.continue){
         this.changeDealSuccess(result.data); // to show change deal success modal with new project data
      }
    });
  }

  // to show change deal success modal with new project data
  changeDealSuccess(data){
    const modalRef = this.modalVar.open(ChangeDealCompletionComponent, { windowClass: 'md' });
    modalRef.componentInstance.newProjectData = data;
    modalRef.result.then((result) => {
    });
  }


  // to clone proposal with quote
  cloneProposal() {
    let associatedQuotes = [];
    const url = 'project/' + this.projectStoreService.projectData.objId + '/quoteDetails';
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      if(this.vnextService.isValidResponseWithData(res)){
        if(res.data.length){
          associatedQuotes = res.data;
          this.openClonePropsalModal(associatedQuotes);
        }
      }
    });
  }

  openClonePropsalModal(associatedQuotes){
    const modalRef = this.modalVar.open(CloneProposalComponent, this.ngbModalOptions);
    modalRef.componentInstance.associatedQuotes = associatedQuotes;
    modalRef.componentInstance.dealId = this.projectStoreService.projectData.dealInfo.id;
      modalRef.result.then(result => {
        if(result && result?.proposal && result?.proposal?.objId){
          this.router.navigate(['ea/project/proposal/' + result.proposal.objId]);
        }
      });
  }

  ngOnDestroy() {
    if (this.subscribers.updateNextBestOptionsSubject) {
      this.subscribers.updateNextBestOptionsSubject.unsubscribe();
    }
    if (this.subscribers.updateProjectstatusSubject) {
      this.subscribers.updateProjectstatusSubject.unsubscribe();
    }
  }

}
