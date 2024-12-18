import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { IRoadMap } from '@app/shared';
import { CustomerOutcomeService } from './customer-outcome.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customer-outcome',
  templateUrl: './customer-outcome.component.html',
  styleUrls: ['./customer-outcome.component.scss']
})
export class CustomerOutcomeComponent implements OnInit, OnDestroy {
  @ViewChild('value', { static: true }) private valueContainer: ElementRef;
  roadMap: IRoadMap;
  catalogues = [];
  disableContinue = false;
  tcoName = '';
  catalogList = { 'name': '', 'outcomes': [], 'active': false, 'displayName': '', 'selectedCount': 0, 'class': '' };

  constructor(public outcomeService: CustomerOutcomeService,
    public localeService: LocaleService,
    public proposalDataService: ProposalDataService,
    public messageService: MessageService,
    private appDataService: AppDataService,
    public constantsService: ConstantsService,
    private tcoApiCallService: TcoApiCallService,
    private tcoDataService: TcoDataService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.tcoOutcomes;
    this.appDataService.showActivityLogIcon(true);
    this.tcoName = this.tcoDataService.tcoDataObj.name;
    if (!this.tcoDataService.tcoDataObj.catalogue || !this.tcoDataService.tcoDataObj.catalogue.outcomes) {
      this.tcoDataService.tcoDataObj['catalogue'] = { 'outcomes': {} };
    }
    this.outcomeService.selectedCatalogues = {};
    this.outcomeService.selectedCatalogues['catalogue'] = JSON.parse(JSON.stringify(this.tcoDataService.tcoDataObj.catalogue));
    this.tcoApiCallService.getCoustOutcomesData().subscribe((res: any) => {
      if (res && !res.error) {
        // to prepare data to display on UI.
        this.catalogues = this.outcomeService.prepareData(res);
        this.catalogList = this.catalogues[0];
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  continue() {
    this.tcoApiCallService.saveCustOutcomeData(this.tcoDataService.tcoId, this.outcomeService.selectedCatalogues).subscribe((res: any) => {
      if (res && !res.error) {
        // this.tcoDataService.tcoDataObj = res.data;
        this.tcoDataService.tcoId = res.data.id;
        this.tcoDataService.tcoDataObj = res.data;
        this.roadMap.eventWithHandlers.continue();
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  back() {
    this.roadMap.eventWithHandlers.back();
  }

  changeTab(selectedTab) {
    for (let catalogue of this.catalogues) {
      if (catalogue.name === selectedTab.name) {
        catalogue.active = true;
        this.catalogList = catalogue;
      } else {
        catalogue.active = false;
      }
    }
  }

  onSelectionChange(selected, val, catalogList) {
    if (selected) {
      catalogList.selectedCount++;
      this.outcomeService.totalSelected++;
      if (this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name]) {
        this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name].push({ name: val.name, desc: val.desc, shortDesc: val.shortDesc });
      } else {
        this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name] = [{ name: val.name, desc: val.desc, shortDesc: val.shortDesc }];
      }
    } else {
      catalogList.selectedCount--;
      this.outcomeService.totalSelected--;
      for (let i = 0; i < this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name].length; i++) {
        if (this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name][i].name === val.name) {
          this.outcomeService.selectedCatalogues.catalogue.outcomes[catalogList.name].splice(i, 1);
          break;
        }
      }
    }
    if (this.outcomeService.totalSelected > this.tcoDataService.catalogueMetaData.maxNoOfCatalogueSelected) {
      this.disableContinue = true;
    } else {
      this.disableContinue = false;
    }
  }
  // call this method to go to TCO List Page
  gotToListPage() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco']);
  }

  openSalesConnect(link) {
    window.open(link);
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

