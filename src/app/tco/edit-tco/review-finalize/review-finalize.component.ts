import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ReviewFinalizeService } from './review-finalize.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { Router } from '@angular/router';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { BreadcrumbsService } from '@app/core';
import { LocaleService } from '@app/shared/services/locale.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { IRoadMap } from '@app/shared';
import { MessageService } from '@app/shared/services/message.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-review-finalize',
  templateUrl: './review-finalize.component.html',
  styleUrls: ['./review-finalize.component.scss']
})
export class ReviewFinalizeComponent implements OnInit, OnDestroy {

  @ViewChild('value', { static: true }) private valueContainer: ElementRef;
  state: string;
  roadMap: IRoadMap;
  stackedBarData: any; // for bar graph data
  tcoModelingData: any; // for modeling data
  tcoSummaryData = []; // fro tcosummary data to outcomes
  tcoDataObject: any; // for setting tcoObj from tcoDataSerice
  catalogue: any; // to set the catalogue data from metadata api
  showInfo = true;

  constructor(private reviewFinalizeService: ReviewFinalizeService, private proposalDataService: ProposalDataService,
    public appDataService: AppDataService, public localeService: LocaleService, public utilitiesService: UtilitiesService,
    private router: Router, private tcoDataService: TcoDataService, private messageService: MessageService,
    private tcoAPICallService: TcoApiCallService, private constantsService: ConstantsService, ) { }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.tcoReview;
    this.appDataService.showActivityLogIcon(true);
    // Get tco data object from session incase of refresh screen
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    // check for dataobj, set to session data if there else get from session data
    if (this.tcoDataService.tcoDataObj) {
      sessionObj.tcoDataObj = this.tcoDataService.tcoDataObj;
    } else {
      this.tcoDataService.tcoDataObj = sessionObj.tcoDataObj;
    }
    this.tcoDataObject = this.tcoDataService.tcoDataObj;
    this.tcoDataService.tcoId = this.tcoDataObject.id;
    if (this.tcoDataService.catalogueMetaData) {
      this.catalogue = this.tcoDataService.catalogueMetaData;
      this.getTcoModelingData();
    } else {
      this.getMetaData();
    }
    // this.getMetaData();
    this.state = 'Review-Finalize';
  }

  // method to call modeling data api and set data to display on UI
  getTcoModelingData() {
    this.tcoSummaryData = [];
    this.tcoDataService.tcoSummaryData = [];
    this.tcoAPICallService.getTcoModeling(this.tcoDataService.tcoId).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        // storing modeling data from response
        this.tcoModelingData = res.data;
        // storing modeling data into data obj from response
        this.tcoDataService.tcoDataObj = this.tcoModelingData;
        this.stackedBarData = this.tcoDataService.prepareGraph1(this.tcoDataObject);
        console.log(this.stackedBarData);
        // console.log(this.tcoDataService.tcoBarData);
        // to set selected outcome data
        this.tcoDataService.getTcoSummaryData(res.data.catalogue.outcomes, this.catalogue);
        this.tcoSummaryData = this.tcoDataService.tcoSummaryData;
        // console.log(this.tcoDataService.tcoSummaryData);
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to call meta data api and set the data
  getMetaData() {
    this.tcoAPICallService.getMetaData(this.tcoDataService.tcoId).subscribe((res: any) => {
      if (res && !res.error && res.data) {
        // get and set the metadata and catalogue data from response
        this.tcoDataService.tcoMetaData = res.data.metadata;
        this.catalogue = res.data.catalogue;
        this.tcoDataService.catalogueMetaData = this.catalogue;
        this.getTcoModelingData();
        // console.log(this.tcoDataService.catalogue, this.tcoDataService.catalogue['catalogueCategory']);
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // to call save and confirm api and go to list page
  saveModeling() {
    this.tcoAPICallService.finalizeModeling(this.tcoDataService.tcoId).subscribe((res: any) => {
      if (res && !res.error) {
        this.gotToListPage();
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  closeInfo() {
    this.showInfo = false;
  }


  // call this method to go to TCO List Page
  gotToListPage() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco']);
  }

  // method to go back to TCO outcomes page
  backToOutcome() {
    this.roadMap.eventWithHandlers.backToOutcome();
  }

  goToDocCenter() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/document']);
  }

  goToBom() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  open(tooltip, val) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
  }
}
