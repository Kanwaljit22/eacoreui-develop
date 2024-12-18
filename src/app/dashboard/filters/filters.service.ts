import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { element } from 'protractor';
import { AppDataService } from '../../shared/services/app.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable()
export class FiltersService {

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

  // getFiltersCount(f) {
  //   const filters = f ? f : this.appliedFilters;
  //   let count = 0;
  //   filters.forEach(function (a) {
  //     if (a.type === 'status') {
  //       count += 2;
  //     } else if (a.type === 'dropdown') {
  //       a.selected.forEach(function (b) {
  //         if (b && b.length) {
  //           count += 1;
  //         }
  //       });
  //     }
  //   });
  //   return count;
  // }

  setSelectedFilter(columnData, salesLvlFilterData) {
    if (columnData.name === 'salesLevel') {
      // this function is called to form the sales level filter array
      this.salesLevelFilter(columnData, salesLvlFilterData);
    } else {
      // this part handles the filters other than sales level filter
      if (columnData.columnUnit == null) {
        columnData.columnUnit = 'K';
      }
      if (columnData.selectedValue === null || columnData.selectedValue === undefined) {
        if (columnData.defaultValue === undefined || columnData.defaultValue === null) {
          columnData.defaultValue = '';
        }  else {
          columnData.selectedValue = columnData.defaultValue;
        }
      }

      let filterObj: SelectedFilterJson = {
        defaultValue: columnData.defaultValue,
        maxValue: columnData.maxValue,
        minValue: columnData.minValue,
        type: columnData.type,
        displayName: columnData.displayName,
        optionsDomain: [],
        operator: columnData.operator,
        persistanceColumn: columnData.persistanceColumn,
        name: columnData.name,
        selectedValue: columnData.selectedValue ? columnData.selectedValue : columnData.defaultValue,
        groupName: columnData.groupName,
        columnUnit: columnData.columnUnit,
        statusSelection: columnData.statusSelection,
        filterApplied: columnData.filterApplied,
        defaultFilterApplied: columnData.filterApplied,
        disabled: true,
        panelId: this.panelId++
      };

      if (columnData.groupName) {
        // add filter in group only if its not excluded
        if (columnData.excludeFilter !== 'Y') {
          let groupObj: GroupObj;
          if (!this.groupObjMap.has(columnData.groupName)) {
            groupObj = {
              type: 'group',
              name: columnData.groupName,
              filters: [filterObj],
              menuSign: 'down'
            };
            this.groupObjMap.set(columnData.groupName, groupObj);
            this.defaultFilters.push(groupObj);
          } else {
            this.groupObjMap.get(columnData.groupName).filters.push(filterObj);
          }
        }
      } else {
        let groupObj = {
          type: 'filter',
          name: name,
          filters: [filterObj],
          menuSign: 'down',
          levels_name: [{ 'name': 'Stage' }]
        };
        this.defaultFilters.push(groupObj);
      }
      if (columnData.type === 'dropdown') {
        this.options = columnData.domainValues.split(',');
        this.options.forEach((item, index) => {
          this.optionsDomain.push({ id: index, name: item });
        });
        filterObj['optionsDomain'] = this.optionsDomain;
      } else if (columnData.type === 'radio') {
        this.optionsDomain = [];
        this.options = columnData.domainValues.split(',');
        this.options.forEach((item) => {
          this.optionsDomain.push(item);
        });
        filterObj['optionsDomain'] = this.optionsDomain;
        this.eaTermValue = (columnData.selectedValue).toString();
      }
      this.selectedFilterMap.set(columnData.name, filterObj);
    }
  }

  salesLevelFilter(columnData, salesFilterData) {
    let filterObj: SelectedFilterJson = {
      defaultValue: columnData.defaultValue,
      type: columnData.type,
      displayName: columnData.displayName,
      persistanceColumn: columnData.persistanceColumn,
      name: columnData.name,
      selectedValue: columnData.selectedValue,
      filterApplied: columnData.filterApplied,
      defaultFilterApplied: columnData.filterApplied,
      disabled: true,
      panelId: this.panelId++
    };
    filterObj['type'] = 'dropdown';
    filterObj['selectedValue'] = [];
    let salesChildArray: any = [];

    // the below properties are used to form sales lvl filter according to the JSON from mockup
    let salesFilter = {
      type: 'dropdown',
      name: columnData.displayName,
      menuSign: 'down',
      levels: [],
      levels_name: [],
      selected: [],
      filteredLevels: [],
      filters: [filterObj]
    };

    // create the JSON for sales level filter with parent, child nodes and labels
    if (salesFilterData && salesFilterData.data) {
      salesFilterData.data.forEach((item, index) => {
        salesChildArray.push({ id: item.childNodeNames[0], name: item.childNodeNames[0] });
      });
      salesFilter.levels.push(salesChildArray);

      // [levels_name] array is used to create labels for the multiple dropdowns
      // in sales lvl filter array. By default we insert 1st level as Sales Level 1
      salesFilter['levels_name'].push('Sales Level 1');

      // filtersAppliedMap is a map to keep a check of the labels with value true/false
      // Once data for a particular level loads we mark that label 'Sales Level {x}' as true in map
      this.filtersAppliedMap.set('Sales Level 1', false);

    }
    // defaultFilters array[] has all the filters to be displayed on the UI
    this.defaultFilters.push(salesFilter);
    this.selectedFilterMap.set(columnData.name, filterObj);
  }

  updateSalesFilter(name, selectedValue) {
    let currFilter = this.selectedFilterMap.get(name);
    currFilter.filterApplied = 'Y';
    currFilter.selectedValue = selectedValue;
  }

  updateSelectedFilters(name, displayName, selectedValue, operator, type, selected, columnUnit) {
    let currentFilter = this.selectedFilterMap.get(name);
    currentFilter.selectedValue = selectedValue;
    if (currentFilter.type === 'radio') {
      currentFilter.selectedValue = (+selectedValue);
    }
    if (currentFilter.selectedValue !== currentFilter.defaultValue) {
      currentFilter.filterApplied = 'Y';
    }  else {
      currentFilter.filterApplied = currentFilter.defaultFilterApplied; // 'N';
    }
    this.updatedFilterMap.push(currentFilter);
  }

  getActualValue(value, columnUnit) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    if (value === null || value === undefined) {
      return value;
    }

    if (columnUnit === 'K') {
      return value * thousand;
    }

    if (columnUnit === 'M') {
      return value * million;
    }

    if (columnUnit === 'B') {
      return value * billion;
    }
    if (columnUnit === '%') {
      return value;
    }
  }

  clearSalesLevelArray() {
    // clears all the selected[] array
    this.defaultFilters.forEach(element => {
      if (element.filters[0].name === 'salesLevel') {
        for (let x = 0; x < element.levels_name.length; x++) {
          element.filteredLevels[x] = [];
          element.selected[x] = [];
        }
      }
    });
  }

  hideFilters() {
    this.activePanels = [];
    this.activePanelsMap.forEach(element => {
      this.activePanels.push(element);
    });
    // console.log(this.activePanels);
  }

  getSalesLevelFilter(nodeNames, level) {
    let reqObj = {};
    if (level === 1) {
      reqObj['level'] = level;
      // reqObj['user'] = this.configService.userId;
    } else {
      reqObj['level'] = level;
      // reqObj['user'] = this.configService.userId;
      reqObj['nodeNames'] = nodeNames;
    }

    return this.http.post(this.configService.getAppDomain + 'api/dashboard/salesLevelFilter', reqObj).pipe(map(res => res));
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
