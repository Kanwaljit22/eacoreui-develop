import { ProposalPollerService } from './../../shared/services/proposal-poller.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { ProposalSummaryService } from './proposal-summary/proposal-summary.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { PriceEstimateCanDeactivateGuard } from '@app/proposal/edit-proposal/price-estimation/price-estimate-can-deactivate.service';
import { Component, OnInit, OnDestroy, ViewChild, ComponentRef, ComponentFactoryResolver, HostListener, Renderer2 } from '@angular/core';

import { ManageSuitesComponent } from './manage-suites/manage-suites.component';
import { PriceEstimationComponent } from './price-estimation/price-estimation.component';
import { ProposalSummaryComponent } from './proposal-summary/proposal-summary.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { PriceEstimationService } from './price-estimation/price-estimation.service';
import { IRoadMap, RoadMapGrid } from '../../../app/shared/road-map/road-map.model';
import { EditProposalHeaderComponent } from '../../../app/modal/edit-proposal-header/edit-proposal-header.component';
import { BreadcrumbsService } from '../../core/breadcrumbs/breadcrumbs.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { SessionData, AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { ProposalArchitectureService } from '@app/shared/proposal-architecture/proposal-architecture.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-edit-proposal',
  templateUrl: './edit-proposal.component.html'
})

export class EditProposalComponent implements OnInit, OnDestroy {
  roadMaps: Array<IRoadMap>;
  roadMapGrid: RoadMapGrid;
  currentStep: number;
  editArr = [];
  editValues = false;
  componentNumToLoad: number;

  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService, private router: Router, private route: ActivatedRoute, private modalVar: NgbModal, public proposalArchitectureService: ProposalArchitectureService,
    private priceEstimationServcie: PriceEstimationService, private breadcrumbsService: BreadcrumbsService, private proposalSummaryService: ProposalSummaryService, public eaService: EaService,
    public proposalDataService: ProposalDataService, private appDataService: AppDataService, public utilitieService: UtilitiesService,
    public permissionService: PermissionService, public renderer: Renderer2,private appRestService :AppRestService,private proposalPollerService : ProposalPollerService, private eastoreService: EaStoreService
  ) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset >= 67 && window.pageYOffset <= 122) {
      this.renderer.addClass(document.body, 'sticky-header');
      this.renderer.removeClass(document.body, 'sticky-header-button');
    } else if (window.pageYOffset > 133) {
      this.renderer.addClass(document.body, 'sticky-header');
      this.renderer.addClass(document.body, 'sticky-header-button');
    } else if (window.pageYOffset < 62) {
      this.renderer.removeClass(document.body, 'sticky-header-button');
      this.renderer.removeClass(document.body, 'sticky-header');
    }
  }

  ngOnInit() {
    if(this.eastoreService.isValidationUI){
      this.eaService.navigateToVui();
    }
    this.utilitieService.proposalFlow = true;
    this.appDataService.enableQualFlag = false;
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.proposalDataService.isProposalHeaderLoaded = false;
    this.proposalSummaryService.showCiscoEaAuth = false;
    this.appDataService.isPurchaseOptionsLoaded = false;
    this.proposalArchitectureService.isMspSelectionChanged = false;
    this.getPollerServiceInterval();
    this.getPollerServiceStartTime();
    this.getEnablePollerService();
    // // Fetch page name from query parameter
    // this.route.queryParamMap.subscribe(qParams => {
    //   if (qParams.keys.length > 0) {
    //     this.proposalDataService.pageName = qParams.get('p');
    //   }
    // });

    this.route.paramMap.subscribe(params => {
      if (params.keys.length > 0) {
        let proposalId = params.get('proposalId');
        if (proposalId !== undefined && proposalId.length > 0) {
          if (this.proposalDataService.crateProposalFlow) {
            this.componentNumToLoad = 0;
            // this.proposalDataService.crateProposalFlow = false;
          } else {
            this.componentNumToLoad = 2;
          }
          this.proposalDataService.proposalDataObject.proposalId = parseInt(proposalId);
        }
      }
    });
    //const sessionObject: SessionData = this.appDataService.getSessionObject();
    /* if(sessionObject && sessionObject.isUserReadWriteAccess){
       this.appDataService.showEngageCPS = true;
     } else {
       this.appDataService.showEngageCPS = false;
     }*/
     let roadMapName =this.localeService.getLocalizedString('roadmap.proposal.SUITES');
    //  if(this.appDataService.archName === 'C1_DNA'){
    //   roadMapName = 'Configure Flex';
    //  }

    this.roadMaps = [
      {
        name: roadMapName,
        component: ManageSuitesComponent,
        eventWithHandlers: {
          continue: () => {
            this.roadMapGrid.loadComponent(1);
          },
          back: () => {
            this.router.navigate(['../'], { relativeTo: this.route });
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.proposal.PRICE_EST'),
        component: PriceEstimationComponent,
        canDeactivate: [PriceEstimateCanDeactivateGuard],
        eventWithHandlers: {
          continue: () => {
            // to check and remove priceestimate from the url else it will again redirect to PE page.
            if (this.router.url.indexOf("priceestimate") >= 0) {
              this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
            } else {
              this.roadMapGrid.loadComponent(2);
            }
          },
          back: () => {
            this.roadMapGrid.loadComponent(0);
          }
        }
      },
      // {
      //   name: this.localeService.getLocalizedString('roadmap.proposal.TCO'),
      //   component: TcoConfigurationComponent,
      //   eventWithHandlers: {
      //     continue: () => {
      //       this.roadMapGrid.loadComponent(3);
      //     },
      //     back: () => {
      //       this.roadMapGrid.loadComponent(1);
      //     }
      //   }
      // },
      {
        name: this.localeService.getLocalizedString('roadmap.proposal.SUMMARY'),
        component: ProposalSummaryComponent,
        eventWithHandlers: {
          continue: () => {
            // console.log(this.roadMaps);
          },
          back: () => {
            this.roadMapGrid.loadComponent(2);
          },
          backToManageSuites: () => {
            this.roadMapGrid.loadComponent(0);
          },
          backToPriceEstimate: () => {
            this.roadMapGrid.loadComponent(1);
          }
          // },
          // backToTCO: () => {
          //   this.roadMapGrid.loadComponent(2);
          // }
        }
      }
    ];
    this.roadMapGrid = new RoadMapGrid(this.roadMaps);
    this.breadcrumbsService.showOrHideBreadCrumbs(true);
  }

  ngOnDestroy() {
    this.proposalDataService.nonTransactionalRelatedSoftwareProposal = false;
    this.proposalDataService.cxProposalFlow = false;
    this.proposalDataService.displayAnnualBillingMsg = false;
    this.permissionService.proposalPermissions.clear();
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.utilitieService.proposalFlow = false;
    this.appDataService.roadMapPath = false;
    this.appDataService.roSalesTeam = false;
    this.proposalDataService.punchoutFromConfig = false;
    this.renderer.removeClass(document.body, 'sticky-header-button');
    this.renderer.removeClass(document.body, 'sticky-header');
    // this.proposalDataService.proposalDataObject.proposalId = null;
    if (this.permissionService.permissions.has(PermissionEnum.RoMessage)) {
      this.appDataService.userInfo.roSuperUser = true;
    } else {
      this.appDataService.userInfo.roSuperUser = false;
    }
    this.proposalDataService.allow84Term = false;
    this.proposalDataService.cxEligible = false; // reset the flag
    this.proposalDataService.isCxAttachedToSoftware = false;
    this.proposalDataService.isRedirectDone = false; // reset the flag
    this.proposalSummaryService.showCiscoEaAuth = false;
    this.appDataService.isPurchaseOptionsLoaded = false;
    this.proposalArchitectureService.isMspSelectionChanged = false;
    this.proposalDataService.isProposalReopened = false;
    this.eastoreService.changeSubFlow = false;
  }

  editProposal() {
    const modalRef = this.modalVar.open(EditProposalHeaderComponent, { windowClass: 'edit-proposal-header' });
    modalRef.result.then((result) => {
      this.editArr = result.updateData.value;
      this.editValues = true;
      if (result.updateData.value) {
        this.priceEstimationServcie.changeVal(true);

      }
    });
  }

  private getPollerServiceInterval(){
    this.appRestService.getResourceForPollerService(this.appDataService.getAppDomain,'UI_POLLER_SERVICE_INTERVAL').subscribe((res: any) => {
      if (res && !res.error) {    
        try{
          this.proposalPollerService.poller_service_interval = parseInt(res.value);       
        } catch(error){
              console.log(error);
        }
      }
    });
  }

  private getPollerServiceStartTime(){
    this.appRestService.getResourceForPollerService(this.appDataService.getAppDomain,'UI_POLLER_SERVICE_START_TIME').subscribe((res: any) => {
      if (res && !res.error) { 
        try{
          this.proposalPollerService.poller_service_start_time = parseInt(res.value);       
        } catch(error){
          console.log(error);
        }
      }
    });
  }


  private getEnablePollerService(){
    this.appRestService.getResourceForPollerService(this.appDataService.getAppDomain,'ENABLE_UI_POLLER_SERVICE').subscribe((res: any) => {
      if (res && !res.error) {       
          this.proposalPollerService.enable_ui_poller_service = res.value;       
      }
    });
  }
}
