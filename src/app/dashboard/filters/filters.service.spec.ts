import {  TestBed, waitForAsync } from "@angular/core/testing";
import { LocaleService } from "@app/shared/services/locale.service";
import { FiltersService } from "./filters.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { AppDataService } from "@app/shared/services/app.data.service";


describe('FiltersService', () => {
  let service: FiltersService;
  let httpTestingController: HttpTestingController;

  const mockLocaleServiceValue = {
    getLocalizedString: jest.fn().mockReturnValue({ key: 'jest', value: 'test' })
  }

  const mockAppDataService = {
    createQualEmitter: new EventEmitter(),
    findUserInfo: () => { },
    isReload: true,
    engageCPSsubject: new Subject(),
    userInfo: { userId: '123', distiUser: true, accessLevel: 0, authorized: false, partnerAuthorized: false }
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocaleService, useValue: mockLocaleServiceValue },
        FiltersService,
        { provide: AppDataService, useValue: mockAppDataService }
      ],
      imports: [HttpClientTestingModule],

    })
      .compileComponents();
    service = TestBed.inject(FiltersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should call applyFilters', () => {
    let filter = {}
    service.applyFilters(filter);
    expect(service.appliedFilters).toEqual(filter);
  });


  it('should call getDefaultFilters', () => {
    service.defaultFilters = {};
    expect(service.getDefaultFilters()).toEqual({});
  });

  it('should call getFilters', () => {
    service.filters = [];
    expect(service.getFilters()).toEqual([]);
  });

  it('should call getAppliedFilters', () => {
    service.updatedFilters = [];
    expect(service.getAppliedFilters()).toEqual([]);
  });

  it('should call getFiltersState', () => {
    service.showFilters = true;
    expect(service.getFiltersState()).toBe(true);
  });

  it('should call toggleFiltersState', () => {
    service.showFilters = true;
    service.activePanels = [];
    const mockPush = jest.spyOn(service.activePanels, 'push');
    service.toggleFiltersState('test');
    expect(service.showFilters).toBe('test');
    expect(service.activePanels).toEqual([]);
    service.activePanelsMap.forEach((e) => {
      expect(mockPush).toBeCalledWith(e);
    })
  });

  it('should call getFiltersCount', () => {
    service.count = 0;
    service.updatedFilterMap = [1, 2, 3, 4, 5];
    service.getFiltersCount();

    expect(service.count).toBe(5);
  });

  it('should call setSelectedFilter', () => {
    const columnData = { name: 'salesLevel', columnUnit: null, selectedValue: null };
    const salesLvlFilterData = {};
    const mockCall = jest.spyOn(service, 'salesLevelFilter');
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(mockCall).toBeCalledWith(columnData, salesLvlFilterData)
  });

  it('should call setSelectedFilter branch 1', () => {
    const columnData = { name: 'test', columnUnit: null, selectedValue: null, defaultValue: null };
    const salesLvlFilterData = {};
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(columnData.columnUnit).toBe('K')
    expect(columnData.defaultValue).toBe('')
  });

  it('should call setSelectedFilter branch 2', () => {
    const columnData = { name: 'test', columnUnit: null, selectedValue: null, defaultValue: '' };
    const salesLvlFilterData = {};
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(columnData.selectedValue).toBe(columnData.defaultValue)
  });

  it('should call setSelectedFilter branch 3', () => {
    const columnData = {
      name: 'test',
      columnUnit: '',
      selectedValue: null,
      defaultValue: '',
      groupName: 'test',
      excludeFilter: 'N',
      maxValue: 1,
      minValue: 1,
      type: '',
      displayName: 'test',
      operator: '',
      persistanceColumn: '',
      statusSelection: '',
      filterApplied: true,

    };
    const salesLvlFilterData = {};
    service.groupObjMap = new Map<string, any>();
    service.panelId = 0;
    service.defaultFilters = [];
    columnData.columnUnit = null;
    jest.spyOn(service.groupObjMap, 'set');
    jest.spyOn(service.defaultFilters, 'push')
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(service.defaultFilters.push).toHaveBeenCalled();
    expect(service.groupObjMap.set).toHaveBeenCalled()
  });

  it('should call setSelectedFilter branch 4', () => {
    const columnData = {
      name: 'test',
      columnUnit: '',
      selectedValue: null,
      defaultValue: '',
      groupName: 'test',
      excludeFilter: 'N',
      maxValue: 1,
      minValue: 1,
      type: '',
      displayName: 'test',
      operator: '',
      persistanceColumn: '',
      statusSelection: '',
      filterApplied: true,

    };
    const salesLvlFilterData = {};
    service.groupObjMap = new Map<string, any>();

    service.panelId = 0;

    let filterObj = {
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
      columnUnit: null,
      statusSelection: columnData.statusSelection,
      filterApplied: columnData.filterApplied,
      defaultFilterApplied: columnData.filterApplied,
      disabled: true,
      panelId: 0
    };
    let groupObj = {
      type: 'group',
      name: columnData.groupName,
      filters: [filterObj],
      menuSign: 'down'
    };
    service.groupObjMap.set('test', groupObj);
    service.defaultFilters = [];
    columnData.columnUnit = null;
    jest.spyOn(service.groupObjMap, 'get');
    jest.spyOn(service.groupObjMap.get(columnData.groupName).filters, 'push');
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(typeof service.groupObjMap.get(columnData.groupName)).toEqual('object');
    expect(service.groupObjMap.get(columnData.groupName).filters.push).toHaveBeenCalled();
  });

  it('should call setSelectedFilter branch 5 columnData.type === dropdown ', () => {
    const columnData = {
      name: 'test',
      columnUnit: '',
      selectedValue: null,
      defaultValue: '',
      groupName: 'test',
      excludeFilter: 'N',
      maxValue: 1,
      minValue: 1,
      type: 'dropdown',
      displayName: 'test',
      operator: '',
      persistanceColumn: '',
      statusSelection: '',
      filterApplied: true,
      domainValues: 'a,b,c'
    };
    const salesLvlFilterData = {};
    jest.spyOn(service.optionsDomain, 'push');
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(service.options).toEqual(['a', 'b', 'c']);
    service.options.forEach((item, index) => {
      expect(service.optionsDomain.push).toBeCalledWith({ id: index, name: item });
    })
  });

  it('should call setSelectedFilter branch 6 columnData.type === radio ', () => {
    const columnData = {
      name: 'test',
      columnUnit: '',
      selectedValue: null,
      defaultValue: '',
      groupName: 'test',
      excludeFilter: 'N',
      maxValue: 1,
      minValue: 1,
      type: 'radio',
      displayName: 'test',
      operator: '',
      persistanceColumn: '',
      statusSelection: '',
      filterApplied: true,
      domainValues: 'a,b,c'
    };
    const salesLvlFilterData = {};
    jest.spyOn(service.optionsDomain, 'push');
    service.setSelectedFilter(columnData, salesLvlFilterData);
    expect(service.options).toEqual(['a', 'b', 'c']);
    expect(service.optionsDomain).toEqual(['a', 'b', 'c']);
    expect(service.eaTermValue).toEqual((columnData.selectedValue).toString());
    expect(service.selectedFilterMap).toBeTruthy();

  });


  it('should call updateSalesFilter', () => {
    service.selectedFilterMap = new Map();
    service.selectedFilterMap.set('name', {});
    jest.spyOn(service.selectedFilterMap, 'get');
    service.updateSalesFilter('name', 'selectedValue');
    expect(service.selectedFilterMap.get).toBeCalled();
  });


  it('should call salesLevelFilter', () => {
    const columnData = {
      name: 'test',
      columnUnit: '',
      selectedValue: null,
      defaultValue: '',
      groupName: 'test',
      excludeFilter: 'N',
      maxValue: 1,
      minValue: 1,
      type: 'radio',
      displayName: 'test',
      operator: '',
      persistanceColumn: '',
      statusSelection: '',
      filterApplied: true,
      domainValues: 'a,b,c'
    };
    const salesLvlFilterData = {
      data: [{
        childNodeNames: [1]
      }]
    };
    const salesChildArray = [];
    jest.spyOn(salesChildArray, 'push');
    jest.spyOn(service.filtersAppliedMap, 'set');
    service.salesLevelFilter(columnData, salesLvlFilterData);
    expect(service.filtersAppliedMap.set).toBeCalled()
  });


  it('should call updateSelectedFilters', () => {
    service.selectedFilterMap = new Map();
    service.updatedFilterMap = [];
    service.selectedFilterMap.set('name', {});
    jest.spyOn(service.selectedFilterMap, 'get');
    jest.spyOn(service.updatedFilterMap, 'push');
    service.updateSelectedFilters('name', 'test', '1', '', '', '', '');
    expect(service.selectedFilterMap.get).toBeCalled();
    expect(service.updatedFilterMap.push).toBeCalled();
  });

  it('should call getActualValue', () => {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    expect(service.getActualValue(null, '')).toBeNull();
    expect(service.getActualValue(1, 'K')).toBe(thousand);
    expect(service.getActualValue(1, 'M')).toBe(million);
    expect(service.getActualValue(1, 'B')).toBe(billion);
    expect(service.getActualValue(1, '%')).toBe(1);
  });

  it('should call clearSalesLevelArray', () => {
    service.defaultFilters = [
      {
        levels_name: [1],
        filteredLevels: {},
        selected: {},
        filters: [
          {
            name: 'salesLevel'
          }
        ]
      }
    ];
    jest.spyOn(service.defaultFilters, 'forEach')
    service.clearSalesLevelArray();
    expect(service.defaultFilters.forEach).toBeCalled()
  })

  it('should call hideFilters', () => {
    service.activePanelsMap = [];
    jest.spyOn(service.activePanels , 'push');
    jest.spyOn(service.activePanelsMap , 'forEach');
    service.hideFilters();
    expect(service.activePanels).toEqual([]);
    expect( service.activePanelsMap.forEach).toBeCalled();
  });

  it('should call getSalesLevelFilter', () => {
    service.getSalesLevelFilter('',1);
    service.getSalesLevelFilter('',2);
  });


});