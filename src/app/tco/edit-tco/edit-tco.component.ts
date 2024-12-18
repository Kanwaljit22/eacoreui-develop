import { QualificationsService } from './../../qualifications/qualifications.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { IRoadMap, RoadMapGrid } from '@app/shared';
import { TcoModelingComponent } from './tco-modeling/tco-modeling.component';
import { CustomerOutcomeComponent } from './customer-outcome/customer-outcome.component';
import { ReviewFinalizeComponent } from './review-finalize/review-finalize.component';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-edit-tco',
  templateUrl: './edit-tco.component.html',
  styleUrls: ['./edit-tco.component.scss']
})
export class EditTcoComponent implements OnInit, OnDestroy {
  roadMaps: Array<IRoadMap>;
  roadMapGrid: RoadMapGrid;
  currentStep: number;
  componentNumToLoad: number;

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  // if (window.pageYOffset >= 80 && window.pageYOffset <= 185) {
  //   this.renderer.addClass(document.body, 'sticky-header');
  //   this.renderer.removeClass(document.body, 'sticky-header-button');
  // } else if (window.pageYOffset > 185) {
  //   this.renderer.addClass(document.body, 'sticky-header');
  //   this.renderer.addClass(document.body, 'sticky-header-button');
  // } else {
  //   this.renderer.removeClass(document.body, 'sticky-header-button');
  //   this.renderer.removeClass(document.body, 'sticky-header');
  // }
  // }

  constructor(public utilitieService: UtilitiesService, public localeService: LocaleService,
    private appDataService: AppDataService, private qualService: QualificationsService, private renderer: Renderer2,
    private proposalDataService: ProposalDataService, private tcoDataService: TcoDataService
  ) { }

  ngOnInit() {
    this.utilitieService.proposalFlow = true;
    // set the flag to false to load metadata
    this.tcoDataService.isTcoMetadataLoaded = false;
    this.appDataService.isProposalIconEditable = false;

    this.appDataService.tcoReadOnlyUser.subscribe((componentToLoad: any) => {
      this.componentNumToLoad = componentToLoad;
      this.roadMapGrid.loadComponent(this.componentNumToLoad);
      this.tcoDataService.loadReviewFinalize = true;
      // this.loadRoadMap();
      return;
    });
    this.loadRoadMap();
  }

  loadRoadMap() {

    this.roadMaps = [
      {
        name: this.localeService.getLocalizedString('tco.TCO_MODELLING'),
        component: TcoModelingComponent,
        eventWithHandlers: {
          continue: () => {
            this.tcoDataService.loadReviewFinalize = false;
            this.roadMapGrid.loadComponent(1);
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.tco.CUSTOMER_OUTCOME'),
        component: CustomerOutcomeComponent,
        eventWithHandlers: {
          continue: () => {
            this.tcoDataService.loadReviewFinalize = true;
            this.roadMapGrid.loadComponent(2);
          },
          back: () => {
            this.tcoDataService.loadReviewFinalize = false;
            this.roadMapGrid.loadComponent(0);
          }
        }
      },
      {
        name: this.localeService.getLocalizedString('roadmap.tco.REVIEW_FINALIZE'),
        component: TcoModelingComponent,
        eventWithHandlers: {
          continue: () => {
            // console.log(this.roadMaps);
          },
          back: () => {
            this.tcoDataService.loadReviewFinalize = false;
            this.roadMapGrid.loadComponent(2);
          },
          backToOutcome: () => { // for going to outcomr page from review & finalize
            this.roadMapGrid.loadComponent(1);
            this.tcoDataService.loadReviewFinalize = false;
          },
          backToTCO: () => {
            this.tcoDataService.loadReviewFinalize = false;
            this.roadMapGrid.loadComponent(0);
          }
        }
      }
    ];
    this.roadMapGrid = new RoadMapGrid(this.roadMaps);
    this.appDataService.custNameEmitter.emit({ qualName: this.qualService.qualification.name.toUpperCase(),
      qualId: this.qualService.qualification.qualID,
      proposalId: this.proposalDataService.proposalDataObject.proposalId, 'context': 'TCO' });


  }

  ngOnDestroy() {
    this.tcoDataService.isMetaDataLoaded = false;
    this.utilitieService.proposalFlow = false;
  }

}
