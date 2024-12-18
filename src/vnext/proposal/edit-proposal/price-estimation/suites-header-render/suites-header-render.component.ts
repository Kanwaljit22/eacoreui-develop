import { LocalizationService } from './../../../../commons/services/localization.service';
import { Component, OnInit } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-suites-header-render',
  templateUrl: './suites-header-render.component.html',
  styleUrls: ['./suites-header-render.component.scss']
})
export class SuitesHeaderRenderComponent implements IHeaderAngularComp {
  params: any;

  constructor(public proposalStoreService: ProposalStoreService, public priceEstimateStoreService: PriceEstimateStoreService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  reProcessIb() {
    this.params.context.parentChildIstance.reProcessIb()
  }

}
