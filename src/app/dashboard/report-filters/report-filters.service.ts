import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { element } from 'protractor';

import { AppDataService } from '../../shared/services/app.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ReportFiltersService {

  filtersAppliedMap: Map<string, boolean> = new Map<string, boolean>();
  filters: any[]
  appliedFilters: any[];
  showFilters: true;
  defaultFilters: any = [];
  optionsDomain: any = [];
  options: any;
  updatedFilters: any = [];
  filterAppliedCount: number = 0;
  count: number = 0;
  panelId: number = 0;
  selectedFilterMap: Map<string, SelectedFilterJson> = new Map<string, SelectedFilterJson>();
  updatedFilterMap: any = [];
  groupObjMap: Map<string, GroupObj> = new Map<string, GroupObj>();
  activePanels: string[] = [];
  activePanelsMap: any = new Map<string, string>();
  level = 0;
  levels_name: any;
  salesLevelMap: any = new Set<string>();
  eaTermValue: any;
  showHideFilters: boolean = false;

  constructor(private http: HttpClient, private configService: AppDataService) {
    this.filters = JSON.parse(JSON.stringify(this.defaultFilters));
    this.appliedFilters = JSON.parse(JSON.stringify(this.defaultFilters))
  }

  getDefaultFilters() {
    return this.defaultFilters;
  }

  getFilters() {
    return this.filters;
  }

  getAppliedFilters() {
    return this.updatedFilters;
  }

  applyFilters(filters) {
    this.appliedFilters = JSON.parse(JSON.stringify(filters));
  }

  getFiltersState() {
    // console.log(this.showFilters);
    return this.showFilters;
  }

  toggleFiltersState(value) {
    const newVal = value === '' ? !this.showFilters : value;
    this.showFilters = newVal;
    this.activePanels = [];
    this.activePanelsMap.forEach(element => {
      this.activePanels.push(element);
    });

  }

  getFiltersCount() {
    this.count = 0;
    this.updatedFilterMap.forEach(element => {
      this.count += 1;
    });
    return this.count;
  }



  clearSalesLevelArray() {
    // clears all the selected[] array
    this.defaultFilters.forEach(element => {
      if (element.filters[0].name === "salesLevel") {
        for (let x = 0; x < element.levels_name.length; x++) {
          element.filteredLevels[x] = [];
          element.selected[x] = [];
        }
      }
    });
  }
  toggleFilters() {
    this.showHideFilters = !this.showHideFilters;
  }

  hideFilters() {
    this.activePanels = [];
    this.activePanelsMap.forEach(element => {
      this.activePanels.push(element);
    });
    // console.log(this.activePanels);
  }
}

export interface SelectedFilterJson {
  defaultValue?: number;
  maxValue?: number;
  minValue?: number;
  type?: string;
  selectedValue?: any;
  displayName?: string;
  optionsDomain?: any;
  operator?: any;
  persistanceColumn?: string;
  name?: any;
  groupName?: any;
  columnUnit?: any;
  statusSelection?: any;
  filterApplied?: string;
  defaultFilterApplied?: string;
  disabled?: boolean;
  panelId?: number;
}

export interface GroupObj {
  type: any;
  name: any;
  filters: any[];
  menuSign: string;
  levels_name?: any;
}
