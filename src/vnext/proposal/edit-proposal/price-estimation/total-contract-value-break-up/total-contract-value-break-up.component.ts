import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateService } from '../price-estimate.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

@Component({
  selector: 'app-total-contract-value-break-up',
  templateUrl: './total-contract-value-break-up.component.html',
  styleUrls: ['./total-contract-value-break-up.component.scss']
})
export class TotalContractValueBreakUpComponent implements OnInit {
  @Input() selectedEnrollemnt: IEnrollmentsInfo = {};
  showDropMenu = false;
  selectedPoolName = ''
  pruchaseAdjusmentBreakupData: any = {};
  suitesArray = [];
  total: any = {}
  constructor(public priceEstimateService: PriceEstimateService, public renderer: Renderer2, public utilitiesService: UtilitiesService,
    public proposalStoreService: ProposalStoreService,
    public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit(): void {
    this.prepareData();
  }
  prepareData(){
    this.pruchaseAdjusmentBreakupData = this.selectedEnrollemnt.pools
    this.selectedPoolName = this.pruchaseAdjusmentBreakupData[0].desc
    
    this.suitesArray = this.pruchaseAdjusmentBreakupData[0].suites;
    this.suitesArray[0]["expand"] = true;
    this.total = this.selectedEnrollemnt.priceInfo
  }

  selectPool(pool){
    this.selectedPoolName = pool.desc;
    this.showDropMenu = false;
    this.suitesArray = pool.suites;
    this.total = pool.priceInfo
  }
  expand(val) {
    val.expand = !val.expand;
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
