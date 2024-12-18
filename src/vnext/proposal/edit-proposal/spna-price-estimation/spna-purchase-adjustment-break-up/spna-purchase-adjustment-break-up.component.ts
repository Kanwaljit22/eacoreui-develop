import { Component, Input, OnDestroy, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-purchase-adjustment-break-up',
  templateUrl: './spna-purchase-adjustment-break-up.component.html',
  styleUrls: ['./spna-purchase-adjustment-break-up.component.scss']
})
export class SpnaPurchaseAdjustmentBreakUpComponent implements OnInit, OnDestroy {
  @Input() column: string;
  heading: string;
  allExpanded = true;
  data = [];
  merakiData = [];
  dcnData = [];
  dnaData = [];
  showDropMenu = false;
  selectedPoolName = ''


  pruchaseAdjusmentBreakupData: any = {};
  suitesArray = [];
  @Input() selectedEnrollemnt: IEnrollmentsInfo = {};
  constructor(public priceEstimateService: PriceEstimateService, public renderer: Renderer2, public utilitiesService: UtilitiesService,
    public proposalStoreService: ProposalStoreService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService,
    public localizationService:LocalizationService, public constantService: ConstantsService) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'position-fixed');
    this.renderer.addClass(document.body, 'w-100')
    this.heading = this.column;
    this.prepareData();
  }


  expand(val) {
    val.expand = !val.expand;
  }
  prepareData() {
    //add API call 
    this.pruchaseAdjusmentBreakupData = this.selectedEnrollemnt.pools
    this.selectedPoolName = this.pruchaseAdjusmentBreakupData[0].desc

    this.suitesArray = this.pruchaseAdjusmentBreakupData[0].suites;
    this.suitesArray[0]["expand"] = true;
  }



  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
    this.renderer.removeClass(document.body, 'w-100')
  }
  selectPool(pool) {
    this.selectedPoolName = pool.desc;
    this.showDropMenu = false;
    this.suitesArray = pool.suites;
  }
  expandPool(val) {
    val.hide = !val.hide;
  }
  showTooltip(tooltip) {
    const e = tooltip._elementRef.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }
  hideTooltip(tooltip) {
    tooltip.close();
  }
}