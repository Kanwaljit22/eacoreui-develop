import { Component, Input, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-quantity-install-base-break-up',
  templateUrl: './spna-quantity-install-base-break-up.component.html',
  styleUrls: ['./spna-quantity-install-base-break-up.component.scss']
})
export class SpnaQuantityInstallBaseBreakUpComponent implements OnInit, OnDestroy {
  @Input() column: string;
  heading: string;
  data = [];
  dnaData = [];
  showDropMenu = false;
  selectedPoolName = ''

  quantityInstallBaseBreakupData: any = {};
  suitesArray = [];
  expandedArr = [];
  @Input() selectedEnrollemnt: IEnrollmentsInfo = {};
  initialLoad = true;

  constructor(public priceEstimateService: PriceEstimateService, public renderer: Renderer2, public utilitiesService: UtilitiesService,
    public proposalStoreService: ProposalStoreService, public dataIdConstantsService: DataIdConstantsService,
    public localizationService:LocalizationService) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'position-fixed');
    this.renderer.addClass(document.body, 'w-100')
    this.heading = this.column;
    this.prepareData();
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['selectedEnrollemnt'] && changes['selectedEnrollemnt'].previousValue !== changes['selectedEnrollemnt'].currentValue
      && !changes['selectedEnrollemnt'].isFirstChange()) {
        this.initialLoad = false;
        this.prepareData();
    }
  }

  expand(val) {
    val.expand = !val.expand;
    if (val.expand) {
      this.expandedArr.push(val.desc)
    } else {
      this.initialLoad = false;
      this.expandedArr.splice(val.desc, 1)
    }
  }
  prepareData(){
    //add API call 
    this.quantityInstallBaseBreakupData = this.selectedEnrollemnt.pools
    this.selectedPoolName = this.quantityInstallBaseBreakupData[0].desc
    
    this.suitesArray = this.quantityInstallBaseBreakupData[0].suites;
    if(this.initialLoad) {
      this.expandedArr.push(this.suitesArray[0].desc)
      this.suitesArray[0]["expand"] = true;
    }
    for (let i = 0; i < this.suitesArray.length; i++) {
      if (this.expandedArr.indexOf(this.suitesArray[i].desc) > -1) {
        this.suitesArray[i].expand = true;
      }
    }
  }



  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
    this.renderer.removeClass(document.body, 'w-100');
    this.initialLoad = true;
  }
  selectPool(pool){
    this.selectedPoolName = pool.desc;
    this.showDropMenu = false;
    this.suitesArray = pool.suites;
  }
}