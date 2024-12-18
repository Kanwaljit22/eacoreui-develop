import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { ProspectDetailRegionComponent } from "./prospect-detail-region.component";
import { ProspectDetailRegionService } from "./prospect-detail-region.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HeaderService } from "@app/header/header.service";
import { CurrencyPipe } from "@angular/common";
import { ProspectDetailsService } from "../prospect-details.service";
import { MessageService } from "@app/shared/services/message.service";
import { GridInitializationService } from "@app/shared/ag-grid/grid-initialization.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { of, throwError } from "rxjs";
import { GridApi } from "@ag-grid-community/core";


describe("ProspectDetailRegionComponent", () => {
  let component: ProspectDetailRegionComponent;
  let fixture: ComponentFixture<ProspectDetailRegionComponent>;

  class MockAppDataService {
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    archName = "test";
    get getAppDomain() {
      return "";
    }
    userInfo = {
      userId: "123",
    };
  }

  class MockUtilitiesService {
    getFloatValue(a) {
      return 0.0;
    }
    formatValue(a) {
      return 0;
    }
    isNumberKey(e) {
      return true;
    }
    setTableHeight(a) {}
  }

  class MockProspectDetailRegionService {
    getRegionColumnsData() {
      return {
        columns: [
          {
            hideColumn: "N",
            displayName: "test",
            persistanceColumn: "",
            dataType: "String",
          },
        ],
      };
    }
  }

  class MockActivatedRoute {}

  class MockHeaderService {}

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
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProspectDetailRegionComponent],
      imports: [CurrencyPipe],
      providers: [
        { provide: AppDataService, useClass: MockAppDataService },
        LocaleService,
        ConstantsService,
        MessageService,
        {
          provide: ProspectDetailRegionService,
          useClass: MockProspectDetailRegionService,
        },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        Router,
        { provide: HeaderService, useClass: MockHeaderService },
        GridInitializationService,
        BlockUiService,
        {
          provide: ProspectDetailsService,
          useValue: mockProspectDetailsService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectDetailRegionComponent);
    component = fixture.componentInstance;
    component.gridOptions.defaultColDef = {
      headerComponentParams: {
        menuIcon: "fa-bars",
      },
    };
    component.regionData = [];
    component["gridInitialization"].initGrid({});

    fixture.detectChanges();
  });

  it("Should create component", () => {
    expect(component).toBeTruthy();
  });

  it("Should call ngOnInit", (done) => {
    const getGeographySpy = jest.spyOn(component, "getGeography");
    const createRegionColumnDefsSpy = jest.spyOn(
      component as any,
      "createRegionColumnDefs"
    );

    component.ngOnInit();
    expect(component.theaterNames).toEqual([]);
    expect(getGeographySpy).toBeCalled();

    component.prospectDetailsService.reloadSuites.subscribe((params) => {
      done();
      expect(getGeographySpy).toBeCalled();
      expect(createRegionColumnDefsSpy).toBeCalled();
    });
  });

  it("Should call onPageSizeChanged", () => {
    component.gridOptions.api.paginationSetPageSize = () => {};
    fixture.detectChanges();
    jest.spyOn(component.gridOptions.api as any, "paginationSetPageSize");
    component.onPageSizeChanged(1);
    expect(component.gridOptions.api.paginationSetPageSize).toBeCalled();
  });

  it("Should call getGeography", () => {
    fixture.detectChanges();
    jest.spyOn(component, "getRegionData");
    component.getGeography();
    expect(component.getRegionData).toBeCalled();
  });

  it("Should call getRegionData", (done) => {
    fixture.detectChanges();
    const prospectDetailsServiceFake = fixture.debugElement.injector.get(
      ProspectDetailsService
    );
    jest.spyOn(prospectDetailsServiceFake, "getTabData").mockReturnValue(
      of({
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
        error: false,
      })
    );

    component.gridOptions.api.setRowData = jest.fn();
    jest.spyOn(component, "getRegionData");
    component.getRegionData();
    component.prospectDetailsService
      .getTabData("test")
      .subscribe((response: any) => {
        console.log(response, component.response, component.regionData);
        expect(component.response).toBeTruthy();
        done();
      });
  });

  it("Should call getRegionData response has error", (done) => {
    fixture.detectChanges();
    const prospectDetailsServiceFake = fixture.debugElement.injector.get(
      ProspectDetailsService
    );

    const errorResponse = {
      status: 404,
      statusText: "Not Found",
      error: true,
      messages: [{ text: "test" }],
    };
    jest
      .spyOn(prospectDetailsServiceFake, "getTabData")
      .mockReturnValue(of(errorResponse));
    component.getRegionData();
    component.prospectDetailsService.getTabData("test").subscribe({
      next: (res: any) => {
        expect(component.errorMsg).toBe("test");
        expect(component.isDataLoaded).toBe(true);
        expect(component.showGrid).toBe(false);
        done();
      },
    });
  });

  it("Should call getRegionData response has http error", (done) => {
    fixture.detectChanges();
    const prospectDetailsServiceFake = fixture.debugElement.injector.get(
      ProspectDetailsService
    );

    const errorResponse = {
      status: 404,
      statusText: "Not Found",
      error: true,
    };
    jest.spyOn(prospectDetailsServiceFake, "getTabData").mockReturnValue(
      throwError(() => {
        return errorResponse;
      })
    );
    component.getRegionData();
    component.prospectDetailsService.getTabData("test").subscribe({
      error: (err: any) => {
        expect(err.statusText).toBe("Not Found");
        done();
      },
    });
  });

  it("Should call createRegionColumnDefs", () => {
    fixture.detectChanges();
    component.gridOptions.api.setRowData = jest.fn();
    jest.spyOn(component, "getRegionData");
    component["createRegionColumnDefs"]();
  });

  it("Should call createRegionColumnDefs b1", () => {
    fixture.detectChanges();
    const prospectDetailsRegionServiceFake = fixture.debugElement.injector.get(
      ProspectDetailRegionService
    );

    jest
      .spyOn(prospectDetailsRegionServiceFake, "getRegionColumnsData")
      .mockReturnValue({
        columns: [
          {
            hideColumn: "N",
            displayName: "test",
            persistanceColumn: "",
            dataType: "Number",
          },
        ],
      });

    component.gridOptions.api.setRowData = jest.fn();
    jest.spyOn(component, "getRegionData");
    component["createRegionColumnDefs"]();
  });

  it("Should call createRegionColumnDefs b2", () => {
    fixture.detectChanges();
    const prospectDetailsRegionServiceFake = fixture.debugElement.injector.get(
      ProspectDetailRegionService
    );
    jest
      .spyOn(prospectDetailsRegionServiceFake, "getRegionColumnsData")
      .mockReturnValue({
        columns: [
          {
            hideColumn: "N",
            displayName: "test",
            persistanceColumn: "EA_QTY",
            dataType: "",
          },
        ],
      });
    component.gridOptions.api.setRowData = jest.fn();
    jest.spyOn(component, "getRegionData");
    component["createRegionColumnDefs"]();
  });

  it("Should call nodeRenderer", () => {
    fixture.detectChanges();
    const res = component.nodeRenderer("e");
    expect(res).toBe("");
  });

  it("Should call getNodeChildDetails", () => {
    fixture.detectChanges();
    const res = component.getNodeChildDetails({
      children: "test",
      THEATER: "test",
    });
    expect(res).toBeTruthy();
  });

  it("Should call getNodeChildDetails b1", () => {
    fixture.detectChanges();
    const res = component.getNodeChildDetails({});
    expect(res).toBeFalsy();
  });

  it("Should call currencyFormat", () => {
    fixture.detectChanges();
    const obj = { value: "test" },
      obj1 = {
        utilitiesService: {
          formatWithNoDecimal: (params) => {
            return params;
          },
        },
      };
    const res = component.currencyFormat(obj, obj1);
    expect(res).toBe("test");
  });

  it("Should call gotoSuites", () => {
    fixture.detectChanges();
    const router = fixture.debugElement.injector.get(Router);
    const fakeNav = jest.spyOn(router, "navigate");
    component.gotoSuites();
    expect(fakeNav).toBeCalledWith(["/prospect-details-suites"]);
  });

  it("Should call gotoSubsidiary", () => {
    fixture.detectChanges();
    const router = fixture.debugElement.injector.get(Router);
    const fakeNav = jest.spyOn(router, "navigate");
    component.gotoSubsidiary();
    expect(fakeNav).toBeCalledWith(["/prospect-details-subsidiary"]);
  });

  it("Should call onModelUpdated", () => {
    fixture.detectChanges();
    const calculateRowCountFake = jest.spyOn(
      component as any,
      "calculateRowCount"
    );
    component.onModelUpdated();
    expect(calculateRowCountFake).toBeCalled();
  });

  it("Should call onReady", () => {
    fixture.detectChanges();
    const calculateRowCountFake = jest.spyOn(
      component as any,
      "calculateRowCount"
    );
    component.gridOptions.api.sizeColumnsToFit = jest.fn();
    component.onReady();
    expect(calculateRowCountFake).toBeCalled();
    expect(component.gridOptions.api.sizeColumnsToFit).toBeCalled();
  });

  it("Should call calculateRowCount", () => {
    fixture.detectChanges();
    component.rowData = [1]
    component.gridOptions.api.getModel = jest.fn();
    jest.spyOn(component.gridOptions.api,'getModel').mockReturnValue({getRowCount:()=>{return 10}}as any)
    component['calculateRowCount']();
    expect(component.rowCount).toBeTruthy();
  });

  
  it("Should call onCellValueChanged", () => {
    fixture.detectChanges();
    component.onCellValueChanged("E");

  });

  it("Should call onCellDoubleClicked", () => {
    fixture.detectChanges();
    component.onCellDoubleClicked("E");
  });

  it("Should call onCellContextMenu", () => {
    fixture.detectChanges();
    component.onCellContextMenu("E");
  });

  it("Should call onCellFocused", () => {
    fixture.detectChanges();
    component.onCellFocused("E");
  });

  it("Should call onRowSelected", () => {
    fixture.detectChanges();
    component.onRowSelected("E");
  });

  it("Should call onSelectionChanged", () => {
    fixture.detectChanges();
    component.onSelectionChanged();
  });

  it("Should call onBeforeFilterChanged", () => {
    fixture.detectChanges();
    component.onBeforeFilterChanged();
  });

  it("Should call onAfterFilterChanged", () => {
    fixture.detectChanges();
    component.onAfterFilterChanged();
  });

  it("Should call onFilterModified", () => {
    fixture.detectChanges();
    component.onFilterModified();
  });

  it("Should call onBeforeSortChanged", () => {
    fixture.detectChanges();
    component.onBeforeSortChanged();
  });

  it("Should call onAfterSortChanged", () => {
    fixture.detectChanges();
    component.onAfterSortChanged();
  });

  it("Should call onVirtualRowRemoved", () => {
    fixture.detectChanges();
    component.onVirtualRowRemoved("");
  });

  it("Should call onColumnEvent", () => {
    fixture.detectChanges();
    component.onColumnEvent("");
  });

  it("Should call onRowClicked", () => {
    fixture.detectChanges();
    component.onRowClicked("");
  });

  it("Should call updateRowDataOnSort", () => {
    fixture.detectChanges();
    component.sortingObject =[{sort:'asc', colId:''}];
    component.gridOptions.api.setRowData=jest.fn();
    component.gridOptions.api.forEachNode=jest.fn();
    component.updateRowDataOnSort([]);
  });

  it("Should call updateRowDataOnSort b1", () => {
    fixture.detectChanges();
    component.sortingObject =[{sort:'asc', colId:''}];
    component.gridOptions.api.setRowData=jest.fn();
    component.gridOptions.api.forEachNode=jest.fn();
    component.updateRowDataOnSort([{sort:'asc', colId:''}]);
    expect(component.sortingObject).toEqual([{sort:'asc', colId:''}])
  });

  it("Should call isExpandedRow", () => {
    fixture.detectChanges();
    component.theaterNames = ['test']
    const res  = component['isExpandedRow']('test');
    expect(res).toBeTruthy()
  });

  it("Should call onCellClicked", () => {
    fixture.detectChanges();
    component.theaterNames = ['test'];
    component.theaterNamesSet = new Set();
    component.onCellClicked({data:{THEATER:'test'}, colDef:{ field : 'THEATER'}})
  });

  it("Should call onCellClicked b1 ", () => {
    fixture.detectChanges();
    component.theaterNames = ['test'];
    component.theaterNamesSet = new Set();
    component.theaterNamesSet.add('test')
    component.onCellClicked({data:{THEATER:'test'}, colDef:{ field : 'THEATER'}})
  });

  it("Should call getBooleanValue", () => {
    fixture.detectChanges();
    jest.spyOn(document,'querySelector').mockReturnValue({checked:true} as any)
    expect(component.getBooleanValue('test')).toBeTruthy();
  });

//   it("Should call onQuickFilterChanged", () => {
//     fixture.detectChanges();
//     component.gridOptions.api.setQuickFilter = (a)=>{};
//     component.onQuickFilterChanged({target:{value:'test'}})
//   });


});
