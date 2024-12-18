import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { ProspectDetailSubsidiaryComponent } from "./prospect-detail-subsidiary.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProspectDetailSubsidiaryService } from "./prospect-detail-subsidiary.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { Router } from "@angular/router";
import { HeaderService } from "@app/header/header.service";
import { EventEmitter } from "@angular/core";
import { Subject, of } from "rxjs";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { GridInitializationService } from "@app/shared/ag-grid/grid-initialization.service";
import { ProductSummaryService } from "@app/dashboard/product-summary/product-summary.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { ProspectDetailsService } from "../prospect-details.service";

describe("ProspectDetailSubsidiaryComponent", () => {
  let component: ProspectDetailSubsidiaryComponent;
  let fixture: ComponentFixture<ProspectDetailSubsidiaryComponent>;

  class MockProspectDetailSubsidiaryService {
    prepareSubsidiaryMetaData(...args) {}
    subsidiaryDataEmitter = new EventEmitter();
    subsidiaryData = [{}];
    loadSubsidiaryRequest = { hqId: "test" };
    subsidiaryDataMap = new Map();
    getSubsidiaryData(a) {
      return of({
        data: [
          {
            column: "test",
            name: "test",
          },
        ],
      });
    }
  }
  class MockUtilitiesService {
    changeMessage = jest.fn();
    checkDecimalOrIntegerValue = jest.fn().mockReturnValue(10);
    formatWithNoDecimalForDashboard = jest.fn().mockReturnValue(0);
    getFloatValue(a) {
      return 0.0;
    }
    formatValue(a) {
      return 0;
    }
    isNumberKey(e) {
      return true;
    }
  }

  class MockRouter {
    navigate = jest.fn();
  }

  class MockHeaderService {}

  class MockAppDataService {
    redirectForCreateQualification(...a) {
      return of({});
    }
    cleanCoreAuthorizationCheck() {
      return of({data:{eligible:true}});
    }
    
    setSessionObject = jest.fn();
    isTwoTUserUsingDistiDeal = jest.fn();
    createUniqueId = jest.fn();
    engageCPSsubject = new Subject();
    getSessionObject = jest.fn().mockReturnValue({
      qualificationData: { qualID: "123", name: "test" },
      userInfo: { firstName: "test", lastName: "test" },
      tcoDataObj: { id: "123" },
    });
    custNameEmitter = new EventEmitter();
    changeSubPermissionEmitter = new EventEmitter();
    showActivityLogIcon = jest.fn();
    userId = "123";
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return "";
    }
    userInfo = {
      userId: "123",
    };

    subHeaderData = { moduleName: "test" };

    getDetailsMetaData(...args) {
      return {};
    }
  }

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockProductSummaryService {
    getUrlToNavigate=jest.fn()
    sortColumnname = "test";
    sortOrder = "dummy";
    prospectInfoObject = {
      page: 1,
    };
    loadProspectCall() {}
    getSalesLevelFilter() {
      return of({ data: [{ childNodeNames: [] }] });
    }
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }

  const mockProspectDetailsService = {
    getTabData: (a) => {
      return of({
        data: [
          {
            column: "test",
            name: "test",
            data: [
              {
                column: "test",
                name: "test",
              },
            ],
          },
        ],
      });
    },
    reloadSuites: of({}),
    updateRowData: (a, b) => {},
    displayManageLocation$:new Subject()
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectDetailSubsidiaryComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ProspectDetailSubsidiaryService,
          useClass: MockProspectDetailSubsidiaryService,
        },
        {
          provide: ProspectDetailsService,
          useValue: mockProspectDetailsService,
        },
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: HeaderService, useClass: MockHeaderService },
        { provide: AppDataService, useClass: MockAppDataService },
        GridInitializationService,
        { provide: ProductSummaryService, useValue: MockProductSummaryService },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: ConstantsService, useClass: MockConstantsService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectDetailSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component.sliderElement = { update: jest.fn() } as any;
    component.prospectdetailSubsidiaryService.subsidiaryDataMap.set(
      String("test"),
      { children: [] }
    );
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    Object.defineProperties(component.gridOptions.api, {
      sizeColumnsToFit: {
        value: jest.fn(),
      },
      getSortModel: {
        value: jest.fn().mockReturnValue([{sort:'asc'}]),
      },
      setRowData: {
        value: jest.fn().mockReturnValue([]),
      },
      forEachNode: {
        value: (fn) => {
          fn({
            level: 0,
            setExpanded: jest.fn(),
            data: {
              END_CUSTOMER_ID: "134",
            },
          });
        },
      },
    });
 
    component.ngOnInit();
    component.prospectdetailSubsidiaryService.subsidiaryDataEmitter.emit([]);
    component.gridOptions.onSortChanged({} as any);
    component.gridOptions.getRowClass({node:{lastChild:true}, data:{children:null} });
    // component.gridOptions.onGridReady({} as any)
  });

  it("should call ngOnInit b1", () => {
    Object.defineProperty(component.gridOptions, "api", {
      value: null,
    });
    component.sortingObject = [
      {
        sort: "asc",
      },
    ];
    component.ngOnInit();
    component.prospectdetailSubsidiaryService.subsidiaryDataEmitter.emit([]);
  });

  it("should call onPageSizeChanged", () => {
    Object.defineProperty(component.gridOptions, "api", {
      value: {
        paginationSetPageSize: jest.fn(),
      },
    });
    component.onPageSizeChanged({});
  });

  it("should create onPageSizeChanged", () => {
    Object.defineProperty(component.gridOptions, "api", {
      value: {
        paginationSetPageSize: jest.fn(),
        getModel: () => {
          return {
            getRowCount: () => {
              return "test";
            },
          };
        },
      },
    });
    component.rowData = [];
    component["calculateRowCount"]();
  });

  it("should call innerCellRenderer", () => {
    component.innerCellRenderer();
  });

  it("should call currencyFormat", () => {
    const obj = {
      utilitiesService: { formatWithNoDecimal: jest.fn() },
    };
    component.currencyFormat({ value: "" }, obj);
  });

  it("should call gotoSuites", () => {
    component.gotoSuites();
  });

  it("should call gotoGeography", () => {
    component.gotoGeography();
  });

  it("should call onModelUpdated", () => {
    component.onModelUpdated();
  });

  it("should call onReady", () => {
    component.onReady();
  });

  it("should call onCellClicked", () => {
    const e = {
      node: { level: 0 },
      data: { END_CUSTOMER_ID: "test", children: [] },
      event: {
        target: { classList: { value: { search: () => 1 } } },
      },
    };

    Object.defineProperty(component.gridOptions, "api", {
      value: {
        paginationSetPageSize: jest.fn(),
        getSelectedRows: () => {
          return [];
        },
      },
    });

    component['productSummaryService'].getUrlToNavigate=jest.fn()

    component.customerIdSet = new Set();
    component.onCellClicked(e);
  });

  it("should call onCellValueChanged", () => {
    component.onCellValueChanged({});
  });

  it("should call onCellDoubleClicked", () => {
    component.onCellDoubleClicked({});
  });

  it("should call onCellContextMenu", () => {
    component.onCellContextMenu({});
  });

  it("should call onCellFocused", () => {
    component.onCellFocused({});
  });

  it("should call onRowSelected", () => {
    component.onRowSelected({});
  });

  it("should call onSelectionChanged", () => {
    component.onSelectionChanged();
  });

  it("should call onBeforeFilterChanged", () => {
    component.onBeforeFilterChanged();
  });
  it("should call onAfterFilterChanged", () => {
    component.onAfterFilterChanged();
  });
  it("should call onFilterModified", () => {
    component.onFilterModified();
  });
  it("should call onBeforeSortChanged", () => {
    component.onBeforeSortChanged();
  });
  it("should call onAfterSortChanged", fakeAsync(() => {
    Object.defineProperty(component.gridOptions, "api", {
      value: {
        setRowData: jest.fn(),
        sizeColumnsToFit: jest.fn(),
        getSelectedRows: () => {
          return [];
        },
      },
    });
    component.onAfterSortChanged();
    tick()
  }));


  it("should call onVirtualRowRemoved", () => {
    component.onVirtualRowRemoved({});
  });

  it("should call onRowClicked", () => {
    component.onRowClicked({});
  });

  it("should call onRowGroupOpened", () => {
    Object.defineProperty(component.gridOptions, "api", {
      value: {
        paginationSetPageSize: jest.fn(),
        getSelectedRows: () => {
          return [];
        },
      },
    });
    const e = {
      node: { level: 1 },
      data: { ND_CUSTOMER_ID: "test", children: [] },
      event: {
        target: { classList: { value: { search: () => 1 } } },
      },
    };
    component.onRowGroupOpened(e);
  });

  it("should call onQuickFilterChanged", () => {
    Object.defineProperty(component.gridOptions, "api", {
      value: {
        setQuickFilter:jest.fn()
      },
    });

    
    component.onQuickFilterChanged({target:{value:1}});
  });

  it("should call onColumnEvent", () => {
    component.onColumnEvent({});
  });

  it("should call getBooleanValue", () => {
    // jest.spyOn( document , 'querySelector').mockReturnValue({checked:true} as any)
   
    // component.getBooleanValue({});
  });

  it("should call updateRowDataOnSort", () => {
    Object.defineProperties(component.gridOptions.api, {
      sizeColumnsToFit: {
        value: jest.fn(),
      },
      getSortModel: {
        value: jest.fn().mockReturnValue([]),
      },
      setRowData: {
        value: jest.fn().mockReturnValue([]),
      },
      forEachNode: {
        value: (fn) => {
          fn({
            level: 0,
            setExpanded: jest.fn(),
            data: {
              END_CUSTOMER_ID: "134",
            },
          });
        },
      },
    });
 
    component.sortingObject = [
      {
        sort: "desc",
      },
    ];
    component.updateRowDataOnSort([]);


    component.sortingObject = [
    ];
    component.updateRowDataOnSort([    {
      sort: "desc",
    }]);

  });

  it("should call innerCellRenderer", () => {
  
   
    const child  = component.innerCellRenderer();
     child()
    component.innerCellRenderer();
  });




});
