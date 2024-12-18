import { Component, OnInit, Input } from '@angular/core';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ReuseableFilterService } from './reuseable-filter.service';
import { AppDataService } from '../services/app.data.service';
import { MessageService } from '../services/message.service';
import { CreditOverviewService } from '../credits-overview/credit-overview.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '../services/locale.service';

@Component({
  selector: 'app-reuseable-filter',
  templateUrl: './reuseable-filter.component.html',
  styleUrls: ['./reuseable-filter.component.scss']
})
export class ReuseableFilterComponent implements OnInit {
  @Input() filterData;
  isSubscriptionsSelected = false;
  public subscribers: any = {};
  currentDate = new Date();
  customMinDate = new Date();
  customMaxDate = new Date();
  filterStartDate = new Date();
  filterEndDate = new Date();
  showDateErrorMsg = false;
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  filterAppliedCount = 0;
  eaStartDateObj: any = null;
  enableClearAll = false;
  isUpdatedByUser = false;

  constructor(public priceEstimationService: PriceEstimationService, public creditOverviewService : CreditOverviewService,private modalVar: NgbModal, 
    public reuseableFilterService: ReuseableFilterService, private messageService: MessageService,
    public appDataService: AppDataService, public localeService: LocaleService) { }

  ngOnInit() {
    //console.log(this.filterData);
    this.filterStartDate.setDate(this.filterStartDate.getDate() - 1825); // start date to be 5 yrs less from today
    this.customMinDate.setDate(this.customMinDate.getDate() - 1825); // min date to be 5 yrs less from today
    this.customMaxDate.setDate(this.customMaxDate.getDate() + 1825); // min max to be +5 yrs from today
    this.filterEndDate = this.customMaxDate; // end date to be equals max date

    this.creditOverviewService.resetFilter.subscribe(() => {
      this.resetFilterData();
    });
  }

  // method to make updatedbyuser true if user changes date
  updatedByUser(){
    this.isUpdatedByUser = true;
  }

  customeFilterDate(event, type, filter, selectedValue, selected) {
    if (event !== null) {
      if (type === 'start') {
        this.filterStartDate = event;
      } else {
        this.filterEndDate = event;
      }
      // to update after selection
      this.updateFilters(filter, selectedValue, selected);
    }
  }

  updateFilters(filter, selectedValue, selected) {

    // check if filters is present else add filters with empty array
    if(!this.reuseableFilterService.filterObject.data["filters"]){
      this.reuseableFilterService.filterObject.data["filters"] = [];
    }

    if (filter.inputType === 'checkbox') {
      selectedValue.selected = selected;
      
      const filterMapObject = {
        name: filter.name,
        value: [selectedValue.value],
        operator: filter.operator
      };
      const appliedFilters = this.reuseableFilterService.filterObject.data["filters"];
      if (appliedFilters.length) {

        if (!appliedFilters.some(item => item.name === filter.name)) { //if selected filter is not present in the filter object.
          this.filterAppliedCount++;
          this.reuseableFilterService.appliedFilterCount++;
          appliedFilters.push({ name: filter.name, value: [selectedValue.value], operator: filter.operator });
          filterMapObject['valueInS']= [selectedValue.value];
          this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
        } else {  //if selected filter is present in the filter object.
          for (const data of appliedFilters) {
            if (data.name === filter.name) {
              // if selected value is present in array remove it and if length is zero delete that field from object.
              let item = this.reuseableFilterService.selectedFilterData.get(filter.name);
              data.value = item.valueInS;
              const index = data.value.indexOf(selectedValue.value);
              if (index > -1 ) {
                data.value.splice(index, 1);
                //item.valueInS.splice(item.valueInS.indexOf(selectedValue.value), 1);
                if (data.value.length === 0) {
                  this.filterAppliedCount--;
                  this.reuseableFilterService.appliedFilterCount--;
                  this.reuseableFilterService.selectedFilterData.delete(filter.name);
                  this.reuseableFilterService.filterObject.data["filters"] = appliedFilters.filter(a => a.name !== filter.name);
                  if(this.reuseableFilterService.filterObject.data["filters"].length === 0){
                    delete this.reuseableFilterService.filterObject.data["filters"];
                    this.enableClearAll = true;

                  }
                }
              } else {
                if (data.value.length === 0) {
                  this.filterAppliedCount++;
                  this.reuseableFilterService.appliedFilterCount++;
                }
                data.value.push(selectedValue.value);
                item.value.push(selectedValue.value);
              }
              break;
            }
          }
        }

      } else {
        this.filterAppliedCount++;
        this.reuseableFilterService.appliedFilterCount++;
        appliedFilters.push({ name: filter.name, value: [selectedValue.value], operator: filter.operator });
        filterMapObject['valueInS']= [selectedValue.value];
        this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
      }

    } else if (filter.inputType === 'radio') {
      selectedValue.selected = selected;
      const filterMapObject = {
        name: filter.name,
        value: selectedValue.value,
        operator: filter.operator
      }


      const filters = this.reuseableFilterService.filterObject.data["filters"];
      if (filters.length > 0) {
        if (!filters.some(item => item.name === filter.name)) {
          this.filterAppliedCount++;
          this.reuseableFilterService.appliedFilterCount++;
          filters.push(filterMapObject);
          this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
        } else {
          for (const data of filters) {
            if (data.name === filter.name) {
              data.value = selectedValue.value;
            }
          }
        }

      } else {
        this.filterAppliedCount++;
        this.reuseableFilterService.appliedFilterCount++;
        filters.push(filterMapObject);
        this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
      }

    } else if (filter.inputType === 'date' && this.isUpdatedByUser == true) {
      // selectedValue.selected = selected;
      const filterMapObject = {
        name: filter.name,
        value: [],
        operator: filter.operator
      }

      const filters = this.reuseableFilterService.filterObject.data["filters"];

      if (filters.length > 0) {
        if (!filters.some(item => item.name === filter.name)) {
          this.filterAppliedCount++;
          this.reuseableFilterService.appliedFilterCount++;

          this.setStartDateEndDate(filterMapObject, this.filterStartDate, this.filterEndDate, '');
          //this.eaStartDateObj = { start: selectedValue.start, end: selectedValue.end };
          filters.push(filterMapObject);
          this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
        } else {
          for (const data of filters) {

            //this.eaStartDateObj = { start: selectedValue.start, end: selectedValue.end };
            this.setStartDateEndDate(filterMapObject, this.filterStartDate, this.filterEndDate, data);
            this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);

          }
        }

      } else {

        this.setStartDateEndDate(filterMapObject, this.filterStartDate, this.filterEndDate, '');
        this.filterAppliedCount++;
        this.reuseableFilterService.appliedFilterCount++;
        filters.push(filterMapObject);
        this.reuseableFilterService.selectedFilterData.set(filter.name, filterMapObject);
      }
    }
    if(this.reuseableFilterService.filterObject.data["filters"] && this.reuseableFilterService.filterObject.data["filters"].length){
      this.convertValueToString();
    }
    //console.log(this.reuseableFilterService.filterObject);
  }
  
  convertValueToString(){
    for(const data of this.reuseableFilterService.filterObject.data["filters"]){
      if(typeof(data.value) !== "string"){
          data.value = data.value.join() ;
      }
    }
  }
  // method to set start date and end date in to filter data obj
  setStartDateEndDate(filterMapObject, filterStartDate, filterEndDate, data) {
    let eaStartDate;
    let eaEndDate;

    eaStartDate = filterStartDate;
    eaEndDate = filterEndDate;
    if (eaStartDate > eaEndDate) {
      this.showDateErrorMsg = true;
    } else {
      this.showDateErrorMsg = false;
    }
    // const customStartDate = this.monthNames[filterStartDate.getMonth()] + ' ' + filterStartDate.getDate() + ' ' + this.filterStartDate.getFullYear();
    // const customEndDate = this.monthNames[filterEndDate.getMonth()] + ' ' + filterEndDate.getDate() + ' ' + this.filterEndDate.getFullYear();
    // filterMapObject.value = [customStartDate + ' - ' + customEndDate];



    const startDate = this.formatDate(eaStartDate);
    const endDate = this.formatDate(eaEndDate);

    filterMapObject['termStartDate'] = startDate.replace(/-/g, '');
    filterMapObject['termEndDate'] = endDate.replace(/-/g, '');
    if(data){
      data.termStartDate = startDate;
      data.termEndDate = endDate;
    }
    return;
  }

  formatDate(today) {

    let date = '';
    let month = '';
    let day = '';

    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
      day = '0' + dd;
    } else {
      day = String(dd);
    }

    if (mm < 10) {
      month = '0' + mm;
    } else {
      month = String(mm);
    }
    date = yyyy + '-' + month + '-' + day;

    return date;
  }

  clearFilters() {
    this.resetFilterData();
    this.reuseableFilterService.emitClearFilter.emit();
  }
  
  resetFilterData(){
    //this.reuseableFilterService.filterObject.data.filters = [];
    delete this.reuseableFilterService.filterObject.data["filters"];
    this.reuseableFilterService.eaStartDateObj = null;
    this.filterAppliedCount = 0;
    this.reuseableFilterService.selectedFilterData.clear();
    this.reuseableFilterService.filterOpen = false;
    this.reuseableFilterService.appliedFilterCount = 0;
    this.reuseableFilterService.searchByFieldObj = {};
    //this.filterActivePanels = [];
    this.filterEndDate = new Date();
    this.filterStartDate = new Date();
    this.filterStartDate.setDate(this.filterStartDate.getDate() - 1825);
    this.filterEndDate = this.customMaxDate;
    this.isUpdatedByUser = false;
    this.enableClearAll = false;
  }

  applyFilters() {
    this.reuseableFilterService.activateFilter();
    this.reuseableFilterService.searchByFieldObj = null;
    this.reuseableFilterService.applyFilterEmitter.emit();
  }
}
