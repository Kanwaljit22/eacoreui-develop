import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit, OnDestroy {

@Input() filterMetaData: any = [];
selectedFilters = [];
isClearFilterApplied = false;
@Input() isPartnerLoggedIn = false;
public subscribers: any = {};
  constructor(public eaStoreService: EaStoreService, private eaRestService: EaRestService, private eaService: EaService,public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
  }


  selectFilter(filterData, filterSelected, type?) {
    this.isClearFilterApplied = false;
    if (type && type === 'radio'){
      filterData.filters.forEach(filter => {
        filter.selected = false;
      });
    } 
    filterSelected.selected = !filterSelected.selected;
  }

  apply() {
    this.selectedFilters = [];
    const dealFilters = [];
    if (!this.isClearFilterApplied){
      for (let i = 0; i < this.filterMetaData.length; i++) {
        const filters = [];
        this.filterMetaData[i].filters.forEach(filter => {
          if(filter.selected) {
            if (this.filterMetaData[i].type !== 'DEALSTATUS') {
              filters.push(filter.id);
            } else {
              dealFilters.push(filter.id);
            }
          }
        });
        if (this.filterMetaData[i].type !== 'DEALSTATUS' && !(this.filterMetaData[i].type === 'LOCCSIGNED' && filters.length === 2)) {
          const keys = {searchKey: this.filterMetaData[i].type, searchValue: filters.toString()};
          if (keys.searchValue) {
           this.selectedFilters.push(keys);
          }
          if(keys.searchKey === 'DISPLAYFILTER' && keys.searchValue === 'ALLRECORDS_SUPERUSER') {
            this.eaStoreService.isAllRecordsSelected = true;
          } else {
            this.eaStoreService.isAllRecordsSelected = false;
          }
        }
     } 
     if (dealFilters.length) {
       this.selectedFilters.push({searchKey: 'DEALSTATUS', searchValue: dealFilters.toString()})
     }
    }
    this.eaService.onFilterSelection.next(this.selectedFilters); // emit selected filters to call api
     this.eaStoreService.showHideFilterMenu = false;
   }

   // clear all filters, set created by me default
   clearAll() {
    this.selectedFilters = [];
    this.eaStoreService.isAllRecordsSelected = false;
    for (let i = 0; i < this.filterMetaData.length; i++) {
      if (this.filterMetaData[i].name === 'Creator'){
        this.filterMetaData[i].filters.forEach(filter => {
          if (filter.id === 'createdByMe'){
            filter.selected = true;
          } else {
            filter.selected = false;
          }
        });
      } else {
        this.filterMetaData[i].filters.forEach(filter => {
          filter.selected = true;
        });
      }
    }
    this.isClearFilterApplied = true;
  }

  ngOnDestroy(): void {
  }
}
