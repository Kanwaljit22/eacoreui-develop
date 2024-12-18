import { DealListService } from './../../dashboard/deal-list/deal-list.service';
import { Component, OnInit, Renderer2, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AppDataService } from '../services/app.data.service';
import { UtilitiesService } from '../services/utilities.service';
import { LocaleService } from '../services/locale.service';
// import { ExceptionApprovalService } from '@app/support/admin/exception-approval/exception-approval.service';
// import { ManageComplianceHoldService } from '@app/support/admin/manage-compliance-hold/manage-compliance-hold.service';
import { Subscription } from 'rxjs';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ReuseableFilterService } from '../reuseable-filter/reuseable-filter.service';
import { ManageAffiliatesService } from '@app/qualifications/edit-qualifications/manage-affiliates/manage-affiliates.service';

@Component({
  selector: 'app-dropdown-data-search',
  templateUrl: './dropdown-data-search.component.html',
  styleUrls: ['./dropdown-data-search.component.scss']
})
export class DropdownDataSearchComponent implements OnInit, OnDestroy, OnChanges {

  @Input() public searchDropdown: any = [];
  @Input() public placeholder;
  @Input() public pipeSearch = false;
  @Output() public onSearch = new EventEmitter<string>();
  @Output() updateDropdownField = new EventEmitter();
  @Input() public fromPage : any;

  showDropDown = false;
  searchInput = '';
  searchInputResult = false;
  hideFilter = false;
  activeLabel = false;

  json: any;
  selectedSearchParam: any;
  reportSub: Subscription;
  reportSubClear: Subscription;
  getDefaultSub: Subscription;
  clearTextBox: Subscription;
  public subscribers: any = {};

  constructor(public appDataService: AppDataService, public utilitiesService: UtilitiesService,
    public renderer: Renderer2, public localeService: LocaleService,private reuseableFilterService: ReuseableFilterService,
    private dealListService: DealListService, private priceEstimationService: PriceEstimationService, private affiliatesService: ManageAffiliatesService) { }

  ngOnInit() {
    if (this.searchDropdown.length > 0) {
      this.selectedSearchParam = this.searchDropdown[0];
    }
    this.json = {
      'orderBy': 1,
      'page': {
        'pageSize': 50,
        'currentPage': 1,
      }
    };

  //  this.reportSubClear = this.reportcenterService.emitClearFilter.subscribe(() => {
  //     this.searchInput = '';
  //   });

  //   this.getDefaultSub = this.reportcenterService.getDefaultSearchEmitter.subscribe((searchvalue) => {
  //     this.searchInput = searchvalue;
  //   }); 

    this.clearTextBox = this.dealListService.dealSearchChangesEmitter.subscribe(() => {
      this.searchInput = '';
    });

    this.subscribers.smartViewClearSearchEmitter = this.affiliatesService.smartViewClearSearchEmitter.subscribe(() => {
      this.searchInput = '';
    });


  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchDropdown']) {
      if (!changes['searchDropdown'].isFirstChange()) {
        this.searchInput = '';
        this.selectedSearchParam = this.searchDropdown[0];
      }
    }

  }
    
  showDropDownWindow() {
    this.showDropDown = !this.showDropDown;
  }

  onKeypress() {
    if(this.pipeSearch){
      this.onSearch.emit(this.searchInput);
    }
  }

  public onQuickFilterChanged() {

    if (this.pipeSearch) {
      // proposal/qualification list filter is a pipe filter, on enter key ,do nothing and exit
      return;
    }

    if (this.searchInput && this.searchInput !== '') {
      this.hideFilter = true;

      let dataObj = {
        'searchId': this.selectedSearchParam.id,
        'searchInput': this.searchInput
      };

      if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.myDeal) {
        this.dealListService.dealSearchEmitter.emit(dataObj);
      } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep) {
        dataObj['searchName'] = this.selectedSearchParam.name; 
        if(this.selectedSearchParam.partialSearch){
          dataObj['partialSearch'] = this.selectedSearchParam.partialSearch; 
        }
        this.priceEstimationService.creditOverviewSearchEmitter.emit(dataObj);
      } else if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep){
        if(this.searchInput.length > 2){
          this.onSearch.emit(this.searchInput);
        }
        if(!this.searchInput){
          this.selectedSearchParam = this.searchDropdown[0];
        }
      }

    } else {
      // clear input if value is empty
      this.clearInput();

    }

  }

  clearInput() {

    this.searchInput = '';
    if (this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.myDeal) {
      this.onSearch.emit('');
    }
    if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep){
      this.selectedSearchParam = this.searchDropdown[0];
    }

    if (this.pipeSearch) {
      // proposal/qualification list filter is a pipe filter, on clear ,do nothing and exit
      return;
    }

    this.hideFilter = false;
    this.searchInputResult = false;

    let dataObj = {
      'searchId': '',
      'searchInput': this.searchInput
    };
    if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep){
      this.priceEstimationService.creditOverviewSearchEmitter.emit({'searchId': this.selectedSearchParam.id,'searchInput': this.searchInput,'searchName': this.selectedSearchParam.name});
    } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.myDeal) {
      this.dealListService.dealSearchEmitter.emit(null);
    }

  }

  resetJson() {
    this.json = {
      'orderBy': 1,
      'page': {
        'pageSize': 50,
        'currentPage': 1,
      }
    };
  }

  focusSearchInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  updateSearch(item) {
    this.resetSearch();
    this.resetJson();
    if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep){
      this.priceEstimationService.creditOverviewSearchEmitter.emit({'searchId': this.selectedSearchParam.id,'searchInput': this.searchInput,'searchName': this.selectedSearchParam.name});
    } else if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep){
      this.updateDropdownField.emit(item);
    }
    this.selectedSearchParam = item;
  }

  resetSearch() {
    this.hideFilter = false;
    this.searchInput = '';
    this.searchInputResult = false;
    this.showDropDown = false;


  }

  ngOnDestroy() {
    if (this.reportSub) {
      this.reportSub.unsubscribe();
    }
    if (this.reportSubClear) {
      this.reportSubClear.unsubscribe();
    }
    if (this.getDefaultSub) {
      this.getDefaultSub.unsubscribe();
    }
    if (this.clearTextBox) {
      this.clearTextBox.unsubscribe();
    }

    if(this.subscribers.smartViewClearSearchEmitter){
      this.subscribers.smartViewClearSearchEmitter.unsubscribe();
    }
  }

}
