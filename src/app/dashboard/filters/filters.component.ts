import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { FiltersService, SelectedFilterJson } from './filters.service';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProductSummaryService } from '../product-summary/product-summary.service';
import { element } from 'protractor';
import * as _ from 'lodash';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  @ViewChild('filterHead', { static: false }) public valueContainer: ElementRef;
  defaultFilters: any[];
  filters: any[];
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  mySettings: IMultiSelectSettings;
  mySettings_search: IMultiSelectSettings;
  mySettings_singleSelect: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  myTexts_singleSelect: IMultiSelectTexts;
  filterAppliedCount: number;
  activeSelect = false;
  activePanels: string[] = [];
  salesLvlCountMap: any = new Map<number, number>();
  salesLevelMap: any = new Set<string>();
  response: any;
  salesFilterArray: any = [];
  levels_name: any;
  arr: any = [];
  len: any;
  enableClearAll = false;

  constructor(public localeService: LocaleService, public filtersService: FiltersService,
    private productSummaryService: ProductSummaryService, private configService: AppDataService) {
    this.filterAppliedCount = this.filtersService.filterAppliedCount;
  }

  count: any = 0;
  ngOnInit() {

    this.mySettings = {
      showCheckAll: true,
      showUncheckAll: true,
      ignoreLabels: true
    };

    this.mySettings_search = {
      enableSearch: true,
      showCheckAll: true,
      showUncheckAll: true,
      ignoreLabels: true
    };

    this.mySettings_singleSelect = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true,
      buttonClasses: 'dropdown-toggle btn btn-default btn-secondary'
    };

    this.myTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Deselect All',
      checked: 'selected',
      defaultTitle: 'Select'
    };

    this.myTexts_singleSelect = {
      defaultTitle: 'Select status'
    };

    this.defaultFilters = this.filtersService.getDefaultFilters();
    this.filters = this.filtersService.getFilters();
    this.filtersService.activePanelsMap.forEach(element => {
      this.filtersService.activePanels.push(element);
    });
    // console.log(this.activePanels);
  }

  hideFilters() {
    this.filtersService.toggleFiltersState(false);
    this.filtersService.hideFilters();
  }

  toggleSign(sign, c) {
    const ngbStr = 'ngb-panel-' + c.filters[0].panelId;
    if (sign === 'down') {
      c.menuSign = 'up';
      this.filtersService.activePanelsMap.set(ngbStr, ngbStr);
    } else {
      c.menuSign = 'down';
      if (this.filtersService.activePanelsMap.has(ngbStr)) {
        this.filtersService.activePanelsMap.delete(ngbStr);
      }
    }
  }

  onChange(selected, c) {
    this.activeSelect = !this.activeSelect;

  }

  selectStatus(n, o) {
    n.selected = o;
    this.updateSelectedFiltersCount();
  }

  updateSelectedFiltersCount() {
    // this.filterAppliedCount = this.filtersService.getFiltersCount(this.filters);
  }

  applyFilters() {
    this.hideFilters();
    this.productSummaryService.prospectInfoObject.page = this.configService.defaultPageObject;
    this.productSummaryService.isSearchByCustomer = false;
    this.productSummaryService.loadProspectCall();
  }


  prettifyNumber(value) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    if (value.columnUnit === 'K') {
      return value.selectedValue / thousand;
    }

    if (value.columnUnit === 'M') {
      return value.selectedValue / million;
    }
    if (value.columnUnit === 'B') {
      return value.selectedValue / billion;
    }
  }


  prettifyDefaultNumber(value) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    if (value.columnUnit === 'K') {
      return value.defaultValue / thousand;
    }

    if (value.columnUnit === 'M') {
      return value.defaultValue / million;
    }
    if (value.columnUnit === 'B') {
      return value.defaultValue / billion;
    }
  }

  onEATermChange(c, val) {
    if (!this.filtersService.filtersAppliedMap.get(c.filters[0].name)) {
      this.filtersService.filterAppliedCount++;
      this.filterAppliedCount = this.filtersService.filterAppliedCount;
      this.filtersService.filtersAppliedMap.set(c.filters[0].name, true);
    }
    this.filtersService.eaTermValue = val;
    c.filters[0].selectedValue = val; // .toString();
    this.filtersService.updateSelectedFilters(c.filters[0].name, c.filters[0].displayName,
      c.filters[0].selectedValue, c.filters[0].operator, c.filters[0].type, true, c.filters[0].columnUnit);
  }

  clearFilters() {
    this.filterAppliedCount = 0;
    this.filtersService.filterAppliedCount = 0;
    this.filtersService.filtersAppliedMap.clear();
    this.filtersService.selectedFilterMap.forEach((value: SelectedFilterJson, key: string) => {
      if (value.type === 'dropdown') {
        if (key === 'salesLevel') {
          value.selectedValue = [];
          this.filtersService.clearSalesLevelArray();
        }  else {
          value.selectedValue = '';
        }

        value.statusSelection = [];
        value.filterApplied = value.defaultFilterApplied;
      } else if (value.type === 'radio') {
        value.filterApplied = value.defaultFilterApplied;
        value.selectedValue = value.defaultValue;
        this.filtersService.eaTermValue = (value.defaultValue).toString();
      }  else {
        value.selectedValue = value.defaultValue;
        value.filterApplied = value.defaultFilterApplied;
        value.disabled = true;
      }

    });
    this.filtersService.activePanels = [];
    this.productSummaryService.isSearchByCustomer = false;

    this.productSummaryService.loadProspectCall();
    this.filtersService.activePanelsMap.clear();
    this.hideFilters();
  }


  onStatusChange(item: any, selectedCheckboxes: IMultiSelectOption[], c) {
    console.log('item : ' + item);
    let featureArray = item.toString().split(',');
    let statusSelection = ''; let x = '';
    featureArray.forEach(element => {
      x = ((selectedCheckboxes[element] === undefined) ? 'a' : 'b');
      if (x === 'b') {
        statusSelection += selectedCheckboxes[element].name + ',';
      }  else {
        this.filtersService.filtersAppliedMap.set(c.filters[0].name, false);
        if (this.filtersService.filterAppliedCount !== 0) {
          this.filtersService.filterAppliedCount--;
        }
        this.filterAppliedCount = this.filtersService.filterAppliedCount;
      }
    });

    if (!this.filtersService.filtersAppliedMap.get(c.filters[0].name) && x === 'b') {
      this.filtersService.filterAppliedCount++;
      this.filtersService.activePanels.push('ngb-panel-' + c.filters[0].panelId);
      this.filterAppliedCount = this.filtersService.filterAppliedCount;
      this.filtersService.filtersAppliedMap.set(c.filters[0].name, true);
    }
    this.filtersService.updateSelectedFilters(c.filters[0].name, c.filters[0].displayName,
      statusSelection.substring(0, statusSelection.length - 1), c.filters[0].operator, c.filters[0].type, true, c.filters[0].columnUnit);
  }

  sliderOnFinish(e, c, sliderElement) {
    let selValue = sliderElement;
    if (c.groupName) {
      selValue = sliderElement.from;
      this.filtersService.updateSelectedFilters(c.name, c.displayName, selValue, c.operator, c.type, true, c.columnUnit);
      if (!this.filtersService.filtersAppliedMap.get(c.name)) {
        this.filtersService.filterAppliedCount++;
        this.filterAppliedCount = this.filtersService.filterAppliedCount;
        this.filtersService.filtersAppliedMap.set(c.name, true);
      }
    } else {
      this.filtersService.updateSelectedFilters(c.filters[0].name, c.filters[0].displayName, selValue,
        c.filters[0].operator, c.filters[0].type, true, c.filters[0].columnUnit);
      if (!this.filtersService.filtersAppliedMap.get(c.filters[0].name)) {
        this.filtersService.filterAppliedCount++;
        this.filterAppliedCount = this.filtersService.filterAppliedCount;
        this.filtersService.filtersAppliedMap.set(c.filters[0].name, true);
      }
    }
  }

  onSelectingGroupFilters(c, isChecked: boolean) {
    if (isChecked) {
      c.disabled = false;
    } else {
      c.disabled = true;
      c.selectedValue = c.defaultValue;
      if (this.filtersService.filtersAppliedMap.get(c.name)) {
        this.filtersService.filterAppliedCount--;
        this.filterAppliedCount = this.filtersService.filterAppliedCount;
        this.filtersService.filtersAppliedMap.set(c.name, false);
        let currFilter = this.filtersService.selectedFilterMap.get(c.name);
        currFilter.filterApplied = 'N';
      }
    }
  }

  // this fucntion is called when any sales level filter value is selected/de-selected
  getSelected(selected, c, i) {
    const nextItr = i + 1;
    if (c.selected[0].length === 0 && c.selected[1] && c.selected[1].length > 0) {
      this.enableClearAll = true;
    } else {
      this.enableClearAll = false;
    }
    let nodeNames = [];
    let selectedCheckboxes = c.selected[i];
    nodeNames = selectedCheckboxes;

    // check filtersAppliedMap if the label exists, then don't increase filter count since its 
    // just editing the same level of sales filter
    if (!this.filtersService.filtersAppliedMap.get(c.levels_name[i])) {
      this.filtersService.filterAppliedCount++;
      this.filterAppliedCount = this.filtersService.filterAppliedCount;
      this.filtersService.filtersAppliedMap.set(c.levels_name[i], true);
    }

    if (nodeNames.length < this.salesLvlCountMap.get(i)) {
      for (let x = i + 1; x < c.levels_name.length; x++) {
        c.filteredLevels[x] = [];
        c.levels[x] = [];
        c.selected[x] = [];
        // this.salesLvlCountMap.set(x,0);
      }
    }

    this.salesLvlCountMap.set(i, nodeNames.length);

    // if you deselect filters at any level, the levels below it should also get unselected 
    // check length of nodeNames, if its 0 then the sales level filter value applied should be
    // the checkboxes selected of the level before that level which was de-selected

    if (nodeNames.length === 0) {
      this.salesFilterArray = c.selected[i - 1];
      console.log(this.salesFilterArray);

      // to reduce the count of filters in case of subsequent levels getting unselected
      // as parent sales level is de-selected
      let j = i + 1;
      for (let x = j; x <= this.filtersService.filtersAppliedMap.size; x++) {
        if (this.filtersService.filtersAppliedMap.get('Sales Level ' + (x))) {
          this.filtersService.filtersAppliedMap.set('Sales Level ' + (x), false);
          if (this.filtersService.filterAppliedCount > 0) {
            this.filtersService.filterAppliedCount = this.filtersService.filterAppliedCount - 1;
          }
        }
      }
      this.filterAppliedCount = this.filtersService.filterAppliedCount;
      this.filtersService.updateSalesFilter(c.filters[0].name, this.salesFilterArray);
    } else if (nodeNames.length !== 0) {
      // if a new sales level filter is selected, load the next level dropdown by calling below API
      this.productSummaryService.getSalesLevelFilter(nodeNames, nextItr + 1).subscribe((response: any) => {
        this.salesFilterArray = nodeNames;
        this.filtersService.updateSalesFilter(c.filters[0].name, this.salesFilterArray);
        this.response = response;
        // below function is called for forming the JSON for the sales level filter post level 1
        this.formSalesData(selected, c, i, (i + 1));
      });
    }
  }

  formSalesData(selected, c, i, nextItr) {
    let index = 0;
    c.levels[nextItr] = [];
    if (this.response && this.response.data[0].childNodeNames[0] !== null) {
      let x = 'Sales Level ' + (nextItr + 1);
      if (!this.filtersService.filtersAppliedMap.has(x)) {
        this.filtersService.filtersAppliedMap.set('Sales Level ' + (nextItr + 1), false);
        c['levels_name'].push('Sales Level ' + (nextItr + 1));
      }
      this.response.data.forEach(eachNode => {
        // post sales level 1, JSON for next levels should have 'parent' & 'isLabel' attributes
        c.levels[nextItr].push({ id: index += 1, name: eachNode.nodeName, parent: eachNode.nodeName, 'isLabel': true });
        eachNode.childNodeNames.forEach(eachChild => {
          c.levels[nextItr].push({ id: eachChild, name: eachChild, parent: eachNode.nodeName });
        });

        if (nextItr >= c.levels.length) {
          return;
        } else {
          for (let level = nextItr; level < c.levels.length; level++) {
            if (typeof c.levels[level] !== 'undefined') {
              const selectedValueToDelete = [];
              c.filteredLevels[level] = c.levels[level].filter((item) => {
                const value = this.isInSelectedArray(c.selected[level - 1], item.parent);
                if (value === false && !item.isLabel) {
                  selectedValueToDelete.push(item.id);
                }
                return value;
              });
              this.selectionRemoved(c.selected[level], selectedValueToDelete);
            }
          }
        }
      });
    }
  }

  selectionRemoved(selections, value) {
    if (selections === undefined || selections === null || selections.length === 0 || value.length === 0) {
      return false;
    }
    const distinctValue = _.uniqBy(value, function (e) { return e; });
    // console.log(distinctValue);
    distinctValue.forEach((element: string) => {
      const index = _.findIndex(selections, (elem: string) => elem === element);

      if (index >= 0) {
        selections.splice(index, 1);
      }
    });
  }

  isInSelectedArray(selectedArr, value) {
    if (selectedArr === undefined || selectedArr === null || selectedArr.length === 0) {
      return false;
    }
    const filterArray = selectedArr.filter((x) => x === value);
    // console.log(filterArray);
    if (filterArray.length === 1) {
      return true;
    } else {
      return false;
    }
  }

  // is called to check if any given sales level has data to make the dropdown visible in html
  isDropdownVisible(c, i) {
    let show = true;
    if (i > 0 && (!c.selected[i - 1] || !c.selected[i - 1].length)) {
      show = false;
      for (let x = i; x < c.levels_name.length; x++) {
        c.filteredLevels[x] = [];
        c.levels[x] = [];
        c.selected[x] = [];
      }
    }
    return show;
  }

  showTooltip(tooltip) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }
}
