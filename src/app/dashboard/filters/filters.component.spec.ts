import { ComponentFixture, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { FiltersComponent } from "./filters.component";
import { LocaleService } from "@app/shared/services/locale.service";
import { FiltersService } from "./filters.service";
import { ProductSummaryService } from "../product-summary/product-summary.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ElementRef, EventEmitter, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { Subject, of } from "rxjs";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { IMultiSelectOption } from "angular-2-dropdown-multiselect";

describe('FiltersComponent', () => {
    let component: FiltersComponent;
    let fixture: ComponentFixture<FiltersComponent>;


    class MockProductSummaryService {
        sortColumnname = "test";
        sortOrder = "dummy";
        prospectInfoObject = {
            page: 1
        }
        loadProspectCall() { }
        getSalesLevelFilter() { return of({ data: [{ childNodeNames: [] }] }) }
    }
    const mockAppDataService = {
        createQualEmitter: new EventEmitter(),
        findUserInfo: () => { },
        isReload: true,
        engageCPSsubject: new Subject(),
        defaultPageObject: { pageSize: 1, currentPage: 1 },
        userInfo: { userId: '123', distiUser: true, accessLevel: 0, authorized: false, partnerAuthorized: false }
    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FiltersComponent],
            providers: [
                LocaleService,
                FiltersService,
                { provide: ProductSummaryService, useClass: MockProductSummaryService },
                { provide: AppDataService, useValue: mockAppDataService }
            ],
            imports: [HttpClientTestingModule, NgbAccordionModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));


    beforeEach(() => {
        fixture = TestBed.createComponent(FiltersComponent);
        component = fixture.componentInstance;
        component.filterAppliedCount = component.filtersService.filterAppliedCount;
        component.valueContainer = new ElementRef({ offsetWidth: 1, scrollWidth: 2 });
        component.valueContainer.nativeElement.value = { offsetWidth: 1, scrollWidth: 2 }
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should call ngOninit', () => {
        const mySettings = {
            showCheckAll: true,
            showUncheckAll: true,
            ignoreLabels: true
        };

        const mySettings_search = {
            enableSearch: true,
            showCheckAll: true,
            showUncheckAll: true,
            ignoreLabels: true
        };

        const mySettings_singleSelect = {
            selectionLimit: 1,
            autoUnselect: true,
            closeOnSelect: true,
            buttonClasses: 'dropdown-toggle btn btn-default btn-secondary'
        };

        const myTexts = {
            checkAll: 'Select all',
            uncheckAll: 'Deselect All',
            checked: 'selected',
            defaultTitle: 'Select'
        };

        const myTexts_singleSelect = {
            defaultTitle: 'Select status'
        };

        const filterServ = fixture.debugElement.injector.get(FiltersService);
        component.filtersService.activePanels = [];
        component.filtersService.activePanelsMap = new Map();
        component.filtersService.activePanelsMap.set('test', '');
        jest.spyOn(filterServ, 'getDefaultFilters').mockReturnValue('test');
        jest.spyOn(filterServ, 'getFilters').mockReturnValue([]);
        jest.spyOn(component.filtersService.activePanels, 'push');
        component.ngOnInit();

        //Cases
        expect(component.mySettings).toEqual(mySettings);
        expect(component.mySettings_search).toEqual(mySettings_search);
        expect(component.mySettings_singleSelect).toEqual(mySettings_singleSelect);
        expect(component.myTexts).toEqual(myTexts);
        expect(component.myTexts_singleSelect).toEqual(myTexts_singleSelect);
        expect(component.defaultFilters).toBe('test');
        expect(component.filters).toEqual([]);

        component.filtersService.activePanelsMap.forEach(element => {
            expect(component.filtersService.activePanels.push).toBeCalled()
        });
    })

    it('should call hideFilters', () => {
        const filterServ = fixture.debugElement.injector.get(FiltersService);
        const mockToggleFunc = jest.spyOn(filterServ, 'toggleFiltersState');
        const mockHideFunc = jest.spyOn(filterServ, 'hideFilters');
        component.hideFilters();
        expect(mockToggleFunc).toBeCalledWith(false);
        expect(mockHideFunc).toBeCalled();
    });

    it('should call toggleSign', () => {
        const sign = 'down', c = {
            menuSign: '',
            filters: [{ panelId: '' }]
        };
        jest.spyOn(component.filtersService.activePanelsMap, 'set');
        component.toggleSign(sign, c);
        expect(component.filtersService.activePanelsMap.set).toBeCalled();
    });

    it('should call toggleSign branch 1', () => {
        const sign = 'up', c = {
            menuSign: '',
            filters: [{ panelId: 'test' }]
        };
        const ngbStr = 'ngb-panel-' + 'test';
        component.filtersService.activePanelsMap.set(ngbStr, {});
        jest.spyOn(component.filtersService.activePanelsMap, 'has');
        jest.spyOn(component.filtersService.activePanelsMap, 'delete');
        component.toggleSign(sign, c);
        fixture.detectChanges();
        expect(component.filtersService.activePanelsMap.has).toBeCalled();
        expect(component.filtersService.activePanelsMap.delete).toBeCalled();
    })

    it('should call onChange', () => {
        component.activeSelect = true;
        component.onChange('', '');
        fixture.detectChanges();
        expect(component.activeSelect).toBeFalsy();
    });

    it('should call selectStatus', () => {
        jest.spyOn(component, 'updateSelectedFiltersCount');
        component.selectStatus({}, '123');
        fixture.detectChanges();
        expect(component.updateSelectedFiltersCount).toBeCalled();
    });


    it('should call updateSelectedFiltersCount', () => {
        component.updateSelectedFiltersCount();
    });

    it('should call applyFilters', () => {
        const appData = fixture.debugElement.injector.get(AppDataService);
        const productService = fixture.debugElement.injector.get(ProductSummaryService);
        appData.defaultPageObject = { pageSize: 1, currentPage: 1 };
        jest.spyOn(component, 'hideFilters');
        const mockCall = jest.spyOn(productService, 'loadProspectCall');
        component.applyFilters();
        fixture.detectChanges();
        expect(component.hideFilters).toBeCalled();
        expect(component['productSummaryService'].prospectInfoObject.page).toEqual({ pageSize: 1, currentPage: 1 });
        expect(component['productSummaryService'].isSearchByCustomer).toBeFalsy();
        expect(mockCall).toBeCalled();
    });

    it('should call prettifyNumber', () => {
        const thousand = 1 / 1000;
        const million = 1 / 1000000;
        const billion = 1 / 1000000000;
        expect(component.prettifyNumber({ columnUnit: 'K', selectedValue: 1 })).toBe(thousand);
        expect(component.prettifyNumber({ columnUnit: 'M', selectedValue: 1 })).toBe(million);
        expect(component.prettifyNumber({ columnUnit: 'B', selectedValue: 1 })).toBe(billion);
    });

    it('should call prettifyDefaultNumber', () => {
        const thousand = 1 / 1000;
        const million = 1 / 1000000;
        const billion = 1 / 1000000000;
        expect(component.prettifyDefaultNumber({ columnUnit: 'K', defaultValue: 1 })).toBe(thousand);
        expect(component.prettifyDefaultNumber({ columnUnit: 'M', defaultValue: 1 })).toBe(million);
        expect(component.prettifyDefaultNumber({ columnUnit: 'B', defaultValue: 1 })).toBe(billion);
    });

    it('should call onEATermChange', () => {
        const c = {
            filters: [
                {
                    name: 'test',
                    displayName: '',
                    selectedValue: 1,
                    operator: '',
                    type: '',
                    columnUnit: 'K'
                }
            ]
        };
        const val = 'test';
        const filterService = fixture.debugElement.injector.get(FiltersService);

        filterService.selectedFilterMap.set('test', {});
        filterService.filterAppliedCount = 0;
        filterService.filtersAppliedMap = new Map();
        filterService.filtersAppliedMap.set('test', false);

        jest.spyOn(filterService.filtersAppliedMap, 'get');
        jest.spyOn(filterService.filtersAppliedMap, 'set');
        jest.spyOn(filterService, 'updateSelectedFilters');

        component.onEATermChange(c, val);
        fixture.detectChanges();
        expect(component.filterAppliedCount).toBe(1);
        expect(component['filtersService'].filtersAppliedMap.get).toBeCalled();
        expect(component['filtersService'].filtersAppliedMap.set).toBeCalledWith(c.filters[0].name, true);
        expect(component['filtersService'].eaTermValue).toBe(val);
        expect(component['filtersService'].updateSelectedFilters).toBeCalledWith(
            c.filters[0].name, c.filters[0].displayName,
            c.filters[0].selectedValue, c.filters[0].operator,
            c.filters[0].type, true, c.filters[0].columnUnit
        );
    });


    it('should call clearFilters', () => {
        const filterService = fixture.debugElement.injector.get(FiltersService);

        filterService.selectedFilterMap.set('salesLevel', { type: 'dropdown' });

        jest.spyOn(filterService.filtersAppliedMap, 'clear');
        jest.spyOn(filterService, 'clearSalesLevelArray');
        jest.spyOn(component, 'hideFilters');

        component.clearFilters();
        fixture.detectChanges();
        expect(component.filterAppliedCount).toBe(0);
        expect(component['filtersService'].filterAppliedCount).toBe(0);
        expect(component['filtersService'].filtersAppliedMap.clear).toBeCalled();
        expect(component['filtersService'].clearSalesLevelArray).toBeCalled();
        expect(component.hideFilters).toBeCalled();

    });

    it('should call clearFilters branch 1', () => {
        const filterService = fixture.debugElement.injector.get(FiltersService);
        filterService.selectedFilterMap.set('salesLevel', { type: 'radio', defaultValue: 1 });
        filterService.selectedFilterMap.set('test', { type: 'test', defaultValue: 1 });
        component.clearFilters();
        fixture.detectChanges();
        expect(component['filtersService'].eaTermValue).toBe('1');

    });

    it('should call onSelectingGroupFilters', () => {
        const c = { name: 'test' }
        const filtersService = fixture.debugElement.injector.get(FiltersService);
        filtersService.filtersAppliedMap.set('test', true);
        filtersService.selectedFilterMap.set('test', {});
        filtersService.filterAppliedCount = 1;
        jest.spyOn(filtersService.filtersAppliedMap, 'set');
        jest.spyOn(filtersService.selectedFilterMap, 'get')
        component.onSelectingGroupFilters(c, false);
        expect(component.filterAppliedCount).toBe(0);
        expect(filtersService.filtersAppliedMap.set).toBeCalled();
        expect(filtersService.selectedFilterMap.get).toBeCalled();
        //Branch
        component.onSelectingGroupFilters(c, true);
    });



    it('should call getSelected', () => {
        const selected = {};
        const c = {
            levels: {},
            filters: [{ name: 'dummy' }],
            levels_name: [],
            selected: [
                ['Test'],
                'TEST',
                'TEST'
            ]
        };
        let i = 0;
        const filtersService = fixture.debugElement.injector.get(FiltersService);
        const productSummaryService = fixture.debugElement.injector.get(ProductSummaryService)
        filtersService.filtersAppliedMap.set('test', true);
        filtersService.selectedFilterMap.set('dummy', {})
        component.salesLvlCountMap.set(i, 2)
        jest.spyOn(productSummaryService, 'getSalesLevelFilter').mockReturnValue(of({ data: [{ childNodeNames: [] }] }))
        jest.spyOn(component, 'formSalesData');
        jest.spyOn(filtersService, 'updateSalesFilter');
        jest.spyOn(component.salesLvlCountMap, 'set')
        jest.spyOn(component.salesLvlCountMap, 'get')

        component.getSelected(selected, c, i);
        fixture.detectChanges();
        expect(component.enableClearAll).toBeFalsy();
        expect(component.salesLvlCountMap.get).toHaveBeenCalled();
        expect(component.salesLvlCountMap.set).toHaveBeenCalled();
        expect(component.filterAppliedCount).toBe(1)
        expect(component.formSalesData).toBeCalled();
        expect(component.response).toEqual({ data: [{ childNodeNames: [] }] });
        expect(component.filtersService.updateSalesFilter).toBeCalled();
        expect(component.salesFilterArray).toEqual(['Test']);
    });


    it('should call getSelected branch 1', () => {
        const selected = {};
        const c = {
            levels: {},
            filters: [{ name: 'dummy' }],
            levels_name: [],
            selected: [
                '',
                '',
                'TEST'
            ]
        };
        let i = 0;
        const filtersService = fixture.debugElement.injector.get(FiltersService);
        const productSummaryService = fixture.debugElement.injector.get(ProductSummaryService)
        filtersService.filtersAppliedMap.set('test', true);
        filtersService.selectedFilterMap.set('dummy', {})
        component.salesLvlCountMap.set(i, 2)
        jest.spyOn(productSummaryService, 'getSalesLevelFilter').mockReturnValue(of({ data: [{ childNodeNames: [] }] }))
        jest.spyOn(component, 'formSalesData');
        jest.spyOn(filtersService, 'updateSalesFilter');
        jest.spyOn(component.salesLvlCountMap, 'set')
        jest.spyOn(component.salesLvlCountMap, 'get')
        component.getSelected(selected, c, i);
        fixture.detectChanges();
    });

    it('should call selectionRemoved', () => {
        component.selectionRemoved([], 'Test')
        expect(component.selectionRemoved('', '')).toBeFalsy()
    });

    it('should call isInSelectedArray', () => {
        expect(component.isInSelectedArray([1], 1)).toBeTruthy();
        expect(component.isInSelectedArray([1], 2)).toBeFalsy();
        expect(component.isInSelectedArray(undefined, undefined)).toBeFalsy()
    });


    it('should call isDropdownVisible', () => {
        const c = {
            levels: {},
            filters: [{ name: 'dummy' }],
            levels_name: [],
            selected: [
            ],
            filteredLevels: {}
        };

        const c1 = {
            levels: {},
            filters: [{ name: 'dummy' }],
            levels_name: [1],
            selected: ['Test'
            ]
        };
        expect(component.isDropdownVisible(c, 1)).toBeFalsy()
        expect(component.isDropdownVisible(c1, 1)).toBeTruthy()

    });

    it('should call onStatusChange', () => {
        const item = '0,1,2';
        const selectedCheckboxes: IMultiSelectOption[] = [{
            id: '1',
            name: 'string',
            disabled: false,
            isLabel: false,
            parentId: '1',
            params: '1',
            classes: '1',
            image: ''
        }
        ];
        const c = {
            levels: {},
            filters: [{
                name: 'test',
                displayName: '',
                selectedValue: 1,
                operator: '',
                type: '',
                columnUnit: 'K'
            }],
            levels_name: [],
            selected: [
            ],
            filteredLevels: {}
        };
        const filterService = fixture.debugElement.injector.get(FiltersService);
        filterService.selectedFilterMap.set('test', {});
        filterService.filterAppliedCount = 1;
        component.onStatusChange(item, selectedCheckboxes, c);
        expect(component.filterAppliedCount).toBe(0);
    });

    it('should call sliderOnFinish', () => {
        const c =
        {
            groupName:'',
            name: 'dummy',
            displayName: '',
            selectedValue: 1,
            operator: '',
            type: '',
            columnUnit: 'K',
            filters: [{
                name: 'test',
                displayName: '',
                selectedValue: 1,
                operator: '',
                type: '',
                columnUnit: 'K'
            }],
        }
        const filterService = fixture.debugElement.injector.get(FiltersService);
        filterService.filterAppliedCount=0;
        filterService.selectedFilterMap.set('test', {});
        component.sliderOnFinish('', c, { from: 'test' })
        expect(component.filterAppliedCount).toBe(1)
    });

    it('should call sliderOnFinish branch 1', () => {
        const c =
        {
            groupName:'test',
            name: 'dummy',
            displayName: '',
            selectedValue: 1,
            operator: '',
            type: '',
            columnUnit: 'K',
            filters: [{
                name: 'test',
                displayName: '',
                selectedValue: 1,
                operator: '',
                type: '',
                columnUnit: 'K'
            }],
        }
        const filterService = fixture.debugElement.injector.get(FiltersService);
        filterService.filterAppliedCount=0;
        filterService.selectedFilterMap.set('test', {});
        filterService.selectedFilterMap.set('dummy', {});
        component.sliderOnFinish('', c, { from: 'test' });
        expect(component.filterAppliedCount).toBe(1)
    });

    it('should call formSalesData',()=>{
        component.response ={ data: [{ childNodeNames: [
            {nodeName:'test'}
        ] }] };
        const c = {
            levels: [1],
            filters: [{
                name: 'test',
                displayName: '',
                selectedValue: 1,
                operator: '',
                type: '',
                columnUnit: 'K'
            }],
            levels_name: [],
            selected: [
            ],
            filteredLevels: {}
        };
        jest.spyOn(component,'isInSelectedArray')
        jest.spyOn(component,'selectionRemoved')
        component.formSalesData('',c, 0 , 0);
        expect(component.isInSelectedArray).toBeCalled();
        expect(component.selectionRemoved).toBeCalled();
    });
});