
import { HttpClientModule } from "@angular/common/http";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { EaNgPaginationComponent } from "ea/ea-ng-pagination/ea-ng-pagination.component";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
import { of } from "rxjs";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { DashboardDealListComponent } from "./dashboard-deal-list.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

class MockEaRestService {
  postApiCall() {
    return of({
      data: {
        responseDataList: [
          {
            test: "test",
          },
        ],
        proposals: [
          {
            test: "test",
          },
        ],
        page: {
          test: "test",
        },
        totalRecords: 12,
        approver: true,
      },
    });
  }

  getApiCallJson() {
    return of({
      data: [
        {
          showFilters: false,
        },
      ],
    });
  }

  getApiCall(url) {
    return of();
  }
}

describe("DashboardDealListComponent", () => {
  let component: DashboardDealListComponent;
  let fixture: ComponentFixture<DashboardDealListComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardDealListComponent,
        LocalizationPipe,
        EaNgPaginationComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],

      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        EaStoreService,
        LocalizationService,
        EaService,
        ConstantsService,
        DataIdConstantsService,
        ElementIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDealListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    //fixture.destroy();
  });


  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    eaStoreService.userInfo = {
      firstName: "test",
    };
    component.searchDropdown = [
      { id: "PROPOSALLIST.PROPOSALID", name: "Proposal ID" },
    ];

    component.ngOnInit();
    expect(component.isPartnerLoggedIn).toBe(false);
  });

  it("should call ngOnInit 2", () => {
    let eaService = fixture.debugElement.injector.get(EaService);
    jest.spyOn(eaService, "isPartnerUserLoggedIn").mockReturnValue(true);
    component.ngOnInit();
    expect(component.isPartnerLoggedIn).toBe(true);
  });

  it("should call ngOnInit 3", () => {
    const data = [
      {
        searchKey: "DISPLAYFILTER",
        searchValue: "test",
      },
    ];
    let eaService = fixture.debugElement.injector.get(EaService);
    eaService.onFilterSelection.next(data);
    const func = jest.spyOn(component, "filerSelection");
    expect(component.ngOnInit()).toBeUndefined();
  });

  it("should call ngOnInit 4", () => {
    const data = [
      {
        searchKey: "test",
        searchValue: "test",
      },
    ];
    let eaService = fixture.debugElement.injector.get(EaService);
    eaService.onFilterSelection.next(data);
    const func = jest.spyOn(component, "filerSelection");
    expect(component.ngOnInit()).toBeUndefined();
  });

  it("should call getDealListData", () => {
    component.searchParam = "test";
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.getDealListData();
    expect(component.dealListData).toEqual([]);
  });

  it("should call getDealListData 2", () => {
    component.searchParam = "test";
    component.request = {
      currentPageNumber: 1,
      sortColumn: "projectUpOn",
      numberOfRowsPerPage: 10,
      searchCriteriaList: [],
      allOrder: "N",
    };
    component.isFilterApplied = true;
    component.getDealListData();
    expect(component.displayGrid).toBe(true);
  });

  it("should paginationUpdated", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.isSearchedData = true;
    component.searchParam = "test";
    component.selectedDropValue = {
      id: "test",
    };
    component.creatorFilter = {
      searchKey: "test",
    };
    const func = jest.spyOn(component, "getDealListData");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should paginationUpdated 2", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.isFilterApplied = true;
    component.searchParam = "test";
    component.selectedFilters = [
      {
        id: "test",
      },
    ];
    const func = jest.spyOn(component, "getDealListData");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should paginationUpdated 3", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.isSearchedData = true;
    component.searchParam = "test";
    component.selectedDropValue = {
      id: "test",
    };
    const func = jest.spyOn(component, "getDealListData");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should paginationUpdated 4", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.isSearchedData = false;
    component.isFilterApplied = false;
    const func = jest.spyOn(component, "getDealListData");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should openPropsalList", () => {
    const data = {
      projectObjId: "test",
    };
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    component.openPropsalList(data);
    expect(eaStoreService.projectId).toEqual(data.projectObjId);
    expect(eaStoreService.selectedDealData).toEqual(data);
  });

  it("should openPropsalList 2", () => {
    const data = {
      projectObjId: "test",
    };
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    component.openPropsalList(data, true);
    expect(eaStoreService.projectId).toEqual(data.projectObjId);
  });

  it("should selectedCreatedBy", () => {
    const value = "Created By Me";
    const func = jest.spyOn(component, "resetPagination");
    component.selectedCreatedBy(value);
    expect(component.searchParam).toEqual("");
    expect(component.openDrop).toBeFalsy();
    expect(func).toHaveBeenCalled();
  });

  it("should updateSearch", () => {
    const value = { id: "PROPOSALLIST.PROPOSALID", name: "Proposal ID" };
    component.updateSearch(value);
    expect(component.selectedDropValue).toEqual(value);
    expect(component.showSearchDrop).toBeFalsy();
  });

  it("should getDealData", () => {
    component.searchParam = "";
    component.getDealData();
    expect(component.isFilterApplied).toBeFalsy();
    expect(component.selectedFilters).toEqual([]);
  });

  it("should getDealData 2", () => {
    component.searchParam = "test";
    component.selectedDropValue = [
      { id: "PROPOSALLIST.PROPOSALID", name: "Proposal ID" },
    ];
    component.getDealData();
    expect(component.isFilterApplied).toBeFalsy();
    expect(component.selectedFilters).toEqual([]);
  });

  it("should getDealData", () => {
    component.searchParam = "test";
    component.creatorFilter = {
      searchKey: "test",
    };
    component.request = {
      currentPageNumber: 1,
      sortColumn: "projectUpOn",
      numberOfRowsPerPage: 10,
      searchCriteriaList: [],
      allOrder: "N",
    };
    component.getDealData();
    expect(component.isFilterApplied).toBeFalsy();
  });

  it("should getDealData 2", () => {
    component.searchParam = "test";
    component.selectedDropValue = {};
    component.getDealData();
    expect(component.isFilterApplied).toBeFalsy();
  });

  it("should goToProject", () => {
    const data = {
      buyingProgram: "3.0",
      projectObjId: "test",
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    expect(component.goToProject(data)).toBeUndefined();
    expect(call).toHaveBeenCalled();
  });

  it("should goToProject 2", () => {
    const data = {
      projectId: "test",
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    expect(component.goToProject(data)).toBeUndefined();
    expect(call).toHaveBeenCalled();
  });

  it("should filerSelection", () => {
    const event = {};
    component.selectedFilters = [
      {
        id: "test",
      },
    ];
    component.isSearchedData = true;
    component.filerSelection(event);
    expect(component.selectedFilters).toEqual([]);
  });

  it("should filerSelection 2", () => {
    component.subscribers.onFilterSelection = false;
    expect(component.ngOnDestroy()).toBeUndefined();
  });

  it("should clearSearchInput", () => {
    component.clearSearchInput();
    expect(component.isSearchedData).toBeFalsy();
    expect(component.isFilterApplied).toBeFalsy();
    expect(component.selectedFilters).toEqual([]);
  });

  it("should getFilterMetaData", () => {
    const data = [
      {
        showFilters: true,
      },
    ];
    component.getFilterMetaData();
    expect(component.filterMetaData).toEqual(data);
  });

  it("should getFilterMetaData", () => {
    const data = {
      error: true,
    };
    const service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCallJson").mockReturnValue(of(data));
    expect(component.getFilterMetaData()).toBeUndefined();
  });

  it("should setCreaterFilter", () => {
    component.creatorFilter = {
      searchKey: "test",
    };
    component.setCreaterFilter();
    expect(component.request).not.toBe(undefined);
  });

  it("openQuoteUrl()", () => {
    const proposal = {
      proposalObjId: "66a7c79eeced8d7422c2fb0d", proposalId: 12345
    };
    console.log("Running test case for: openQuoteUrl()");
    expect(component.openQuoteUrl(proposal)).toBeUndefined();
  });

  it('call goToProposal', () => {
    const proposal = {
        buyingProgram: "EA 3.0",
        ciscoLed: false,
        crAt: "2022-04-02T19:30:57.065+0000",
        crBy: "test",
        currencyCode: "USD",
        dealId: "12345",
        showDropdown: true, 
        id: 123456,
        proposalList: [{ proposalObjId: "66a7c79eeced8d7422c2fb0d", proposalId: 12345}]
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToProposal(proposal);
    expect(call).toHaveBeenCalled();
  });
});
