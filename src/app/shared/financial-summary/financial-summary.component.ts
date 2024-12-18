import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';

import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';

@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit, OnDestroy {

  @Input() public financialSummaryData: any;
  @Input() public financialSummaryTotalData: any;


  constructor(public priceEstimateService: PriceEstimationService, public utilitiesService: UtilitiesService,
    public localeService: LocaleService, public constantsService: ConstantsService, public appDataService: AppDataService,
    public proposalSummaryService: ProposalSummaryService, public proposalDataService: ProposalDataService) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.priceEstimateService.showFinancialSummary = false;
    this.proposalSummaryService.showFinancialSummary = false;
    this.proposalDataService.showFinancialSummary = false;
  }

  closeSummary() {
    this.priceEstimateService.showFinancialSummary = false;
    this.proposalSummaryService.showFinancialSummary = false;
    this.proposalDataService.showFinancialSummary = false;
  }

}
