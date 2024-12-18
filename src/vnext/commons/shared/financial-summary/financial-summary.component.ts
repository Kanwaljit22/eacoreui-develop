import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { IFinancial, ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';


@Component({
  selector: 'app-financial-summary',
  templateUrl: './financial-summary.component.html',
  styleUrls: ['./financial-summary.component.scss']
})
export class FinancialSummaryComponent implements OnInit, OnDestroy {

  financialSummaryData:IFinancial;
  readonly localizationKey = 'financial-summary';

  constructor(public priceEstimateService: PriceEstimateService, private vnextService: VnextService, public dataIdConstantsService: DataIdConstantsService,
    private proposalRestService: ProposalRestService, public renderer: Renderer2, public proposalStoreService: ProposalStoreService,
    public utilitiesService: UtilitiesService, public localizationService:LocalizationService, private eaRestService: EaRestService, private eaService: EaService) { }

  ngOnInit() {
    // this.eaService.getLocalizedString(this.localizationKey); // set localized string
    this.renderer.addClass(document.body, 'position-fixed');
    this.renderer.addClass(document.body, 'w-100')
    this.getFinancialSummary();
  }


  getFinancialSummary() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '?a=FINANCIAL-SUMMARY';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {

        this.financialSummaryData =  response.data;
      }
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
    this.renderer.removeClass(document.body, 'w-100')
  }

}


