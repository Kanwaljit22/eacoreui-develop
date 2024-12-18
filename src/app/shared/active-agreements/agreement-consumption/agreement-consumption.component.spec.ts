import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { AllArchitectureViewService } from "@app/all-architecture-view/all-architecture-view.service";
import { AgreementConsumptionComponent } from "./agreement-consumption.component";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { CurrencyPipe } from "@angular/common";
import { ConsumptionCellComponent } from "./consumption-cell/consumption-cell.component";
import { ConsumptionHeaderComponent } from "./consumption-header/consumption-header.component";
import { GridOptions } from "@ag-grid-community/core";

describe("AgreementConsumptionComponent", () => {
  let component: AgreementConsumptionComponent;
  let fixture: ComponentFixture<AgreementConsumptionComponent>;

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  class MockAppDataService {
    validateResponse(res) {
      return res;
    }
    subHeaderData = { favFlag: false, moduleName: "test", subHeaderVal: "" };
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
  }
  class MockAllArchitectureViewService {
    viewTabEmitter = new EventEmitter();
    searchDropDown = false;
    getSmartAccountList() {
      return of({});
    }
    getProposalListbyCustomer() {
      return of({ data: {} });
    }
    getSubHeaderData() {
      return of({ data: {} });
    }
    getAgreementsData(arg) {
      const response = {
        data: { accounts: ["test"] },
        error: false,
      };
      return of(response);
    }
    getConsumptionData(a, b, c) {
      return of({
        data:{suites:[{commerceSku:0}]},
        error:false
      });
    }
    getConsumptionDataTrueFwd(a,b){return of({data:{suiteDetails:[{billingskuDetails:[{skuName:'test',suiteName:'test', test:0}] , }]}})}
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [AgreementConsumptionComponent],
      providers: [
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: AppDataService, useClass: MockAppDataService },
        {
          provide: AllArchitectureViewService,
          useClass: MockAllArchitectureViewService,
        },
        CurrencyPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementConsumptionComponent);
    component = fixture.componentInstance;
    component.gridOptions = {};
    component.gridOptions.headerHeight = 42;
    component.domLayout = "autoHeight";
    component.gridOptions.frameworkComponents = {
      valueCellRenderer: <{ new (): ConsumptionCellComponent }>(
        ConsumptionCellComponent
      ),
    };
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    const getColumns = jest.spyOn(component, "getColumns");
    const getData = jest.spyOn(component, "getData");
    component.ngOnInit();
    expect(getColumns).toBeCalled();
    expect(getData).toBeCalled();
  });

  it("should call ngOnDestroy", () => {
    component.ngOnDestroy();
  });

  it("should call ngOnChanges", () => {
    const chnages = {
      virtualAccountId: { currentValue: "1", previousValue: "" },
    } as any;
    const getColumns = jest.spyOn(component, "getColumns");
    const getData = jest.spyOn(component, "getData");
    component.ngOnChanges(chnages);
    expect(getColumns).toBeCalled();
    expect(getData).toBeCalled();
    expect(component.trueForward).toBeFalsy();
    expect(component.trueForwardSwitch).toBeFalsy();
  });

  it("should call getColumns", () => {
    const columnDefs = [
      {
        headerName: "Suite",
        field: "suiteName",
        cellRenderer: "group",
        pinned: "left",
        width: 275,
        minWidth: 60,
        headerClass: "text-right",
        suppressMenu: true,
      },
      {
        headerName: "Entitlements",
        children: [
          {
            headerName: "EA Purchased Entitlements",
            cellRenderer: "valueCellRenderer",
            cellClass: "entitlementCell dollar-align",
            field: "pucrhasedEntitlements",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Growth Allowance",
            field: "growthAllowance",
            cellClass: "entitlementCell dollar-align",
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Total EA Entitlements",
            field: "totalEntitlements",
            cellClass: "entitlementCell dollar-align",
            headerComponentFramework: <{ new (): ConsumptionHeaderComponent }>(
              ConsumptionHeaderComponent
            ),
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
        ],
      },
      {
        headerName: "Consumption",
        children: [
          {
            headerName: "Pre-EA Consumption",
            field: "preEAConsumption",
            cellClass: "consumptionCell split dollar-align",
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Licenses Generated",
            field: "licenseGenerated",
            cellClass: "consumptionCell dollar-align",
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Licenses Migrated",
            field: "licenseMigrated",
            cellClass: "consumptionCell dollar-align",
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Migrated EA Consumption",
            field: "c1ToDNAMigratedCount",
            cellClass: "consumptionCell dollar-align",
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
          {
            headerName: "Total Consumption",
            field: "totalConsumption",
            cellClass: "consumptionCell dollar-align",
            headerComponentFramework: <{ new (): ConsumptionHeaderComponent }>(
              ConsumptionHeaderComponent
            ),
            cellRenderer: "valueCellRenderer",
            width: 130,
            headerClass: "text-right",
            minWidth: 60,
            suppressMenu: true,
          },
        ],
      },
      {
        headerName: "Remaining Entitlement",
        field: "remainingEntitlements",
        cellRenderer: "valueCellRenderer",
        cellClass: "dollar-align",
        pinned: "right",
        width: 130,
        minWidth: 60,
        headerClass: "text-right",
        suppressMenu: true,
      },
      {
        headerName: "Consumption Method",
        field: "calculationMethod",
        pinned: "right",
        width: 130,
        headerClass: "text-right",
        minWidth: 60,
        suppressMenu: true,
      },
    ];

    component.getColumns();
    expect(component.columnDefs).toEqual(columnDefs);
  });

  it("should call getNodeChildDetails", () => {
    const res = component.getNodeChildDetails({
      commerceSkus: "test",
      group: "test",
    });
    const matcher = {
      group: true,
      children: "test",
      key: "test",
    };
    expect(res).toEqual(matcher);
  });

  it("should call getNodeChildDetails b1", () => {
    const res = component.getNodeChildDetails({
      billingskuDetails: "test",
      group: "test",
    });
    const matcher = {
      group: true,
      children: "test",
      key: "test",
    };
    expect(res).toEqual(matcher);
  });

  it("should call getNodeChildDetails b2", () => {
    const res = component.getNodeChildDetails({
      group: "test",
    });
    expect(res).toBe(null);
  });

  it("should call getData", () => {
    component.gridOptions = { api:{setRowData:(a)=>{}} } as any
    component.getData();
    component.allArchitectureViewService.getConsumptionData('1','2','3').subscribe((res:any) => {
        expect(component.rowData).toEqual([ { suiteName: '--' } ])
    })
  });

  it("should call getData b1", () => {
     const service =  fixture.debugElement.injector.get(AllArchitectureViewService)
    component.gridOptions = { api:{setRowData:(a)=>{}} } as any;
    jest.spyOn(service,'getConsumptionData').mockReturnValue(of({error:true}))
    component.getData();
    component.allArchitectureViewService.getConsumptionData('1','2','3').subscribe((res:any) => {
    })
  });

  it("should call getData b2", () => {
    const service =  fixture.debugElement.injector.get(AllArchitectureViewService);
   component.gridOptions = { api:{setRowData:(a)=>{}} } as any;
   jest.spyOn(service,'getConsumptionData').mockReturnValue(of({}))
   component.getData();
   component.allArchitectureViewService.getConsumptionData('1','2','3').subscribe({error:(err)=>{}})
 });


 it("should call valueCellRenderer", () => {
  const fake = jest.spyOn(component, 'formatWithNoDecimal');
  component['currencyPipe'].transform =( (a,b,c)=>{ return 'test'})as any;
  component.valueCellRenderer({value:'test'});
  expect(fake).toBeCalled()
 });

 it("should call valueCellRenderer", () => {
    // const fake = jest.spyOn(component, 'formatWithNoDecimal');
    component['currencyPipe'].transform =( (a,b,c)=>{ return a})as any;
    const r = component.formatWithNoDecimal('test');
    const r1 = component.formatWithNoDecimal(null);
    const r2 = component.formatWithNoDecimal('--');
    expect(r).toBe('test')
    expect(r1).toBe(null)
    expect(r2).toBe('--')
   });

   it("should call toggleConsumptionView", () => {
    component.trueForward = false;
    jest.spyOn(component,'getTrueFowardColumn')
    jest.spyOn(component,'getTrueForwardData')
    component.toggleConsumptionView('')
    expect(component.getTrueFowardColumn).toBeCalled()
    expect(component.getTrueForwardData).toBeCalled()


   });

   it("should call toggleConsumptionView b1", () => {
    component.trueForward = true;
    jest.spyOn(component,'getData')
    jest.spyOn(component,'getColumns')
    component.toggleConsumptionView('')
    expect(component.getData).toBeCalled()
    expect(component.getColumns).toBeCalled()
   });

   it("should call getTrueFowardColumn", () => {
    const columnDefs = [{
        'headerName': 'Suite',
        'field': 'suiteName',
        'cellRenderer': 'group',
        'pinned': 'left',
        'width': 240,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      }, {
        'headerName': 'EA Duration (Months)',
        'field': 'eaDuration',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'Remaining Duration (Months)',
        'field': 'remainingDuration',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'Entitlements',
        'children': [{
          'headerName': 'EA Purchased Entitlements',
          'cellRenderer': 'valueCellRenderer',
          'cellClass': 'entitlementCell dollar-align',
          'field': 'purchasedEntitlements',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
  
        },
        {
          'headerName': 'Growth Allowance',
          'field': 'growthAllowance',
          'cellClass': 'entitlementCell dollar-align',
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
  
        },
        {
          'headerName': 'Total EA Entitlements',
          'field': 'totalEntitlements',
          'cellClass': 'entitlementCell dollar-align',
          'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
            ConsumptionHeaderComponent),
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
        },
        {
          'headerName': 'Total EA Entitlements',
          'field': 'totalEntitlements',
          'cellClass': 'entitlementCell dollar-align',
          'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
            ConsumptionHeaderComponent),
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'closed'
  
        }]
      },
      {
        'headerName': 'Consumption',
        'children': [{
          'headerName': 'Pre-EA Consumption',
          'field': 'preEAConsumption',
          'cellClass': 'consumptionCell split dollar-align',
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
        },
        {
          'headerName': 'Licenses Generated',
          'field': 'licenseGenerated',
          'cellClass': 'consumptionCell dollar-align',
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
  
        },
        {
          'headerName': 'Licenses Migrated',
          'field': 'licenseMigrated',
          'cellClass': 'consumptionCell dollar-align',
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'minWidth': 60,
          'headerClass': 'text-right',
          'suppressMenu': true,
          'columnGroupShow': 'open'
  
        },
        {
          'headerName': 'Migrated EA Consumption',
          'field': 'c1ToDNAMigratedCount',
          'cellClass': 'consumptionCell dollar-align',
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'headerClass': 'text-right',
          'minWidth': 60,
          'suppressMenu': true,
          'columnGroupShow': 'open'
        },
        {
          'headerName': 'Total Consumption',
          'field': 'totalConsumption',
          'cellClass': 'consumptionCell dollar-align',
          'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
            ConsumptionHeaderComponent),
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'headerClass': 'text-right',
          'minWidth': 60,
          'suppressMenu': true,
          'columnGroupShow': 'open'
        },
        {
          'headerName': 'Total Consumption',
          'field': 'totalConsumption',
          'cellClass': 'consumptionCell dollar-align',
          'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
            ConsumptionHeaderComponent),
          'cellRenderer': 'valueCellRenderer',
          'width': 180,
          'headerClass': 'text-right',
          'minWidth': 60,
          'suppressMenu': true,
          'columnGroupShow': 'closed'
  
        }]
      },
      {
        'headerName': 'Remaining Entitlement',
        'field': 'remainingEntitlements',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      }, {
        'headerName': 'Consumption Test Count',
        'field': 'consumedTestCount',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'List Price',
        'field': 'listPrice',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Discounts (%)',
        'field': 'discount',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Initial net AMT W/O PPA',
        'field': 'initialNetAmt',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      }
        ,
      {
        'headerName': 'True Forward Event Order Qty',
        'field': 'tfOrderQty',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Residual Entitlements Value at True Forward',
        'field': 'tfResidualEntitlementValue',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Consumption Net Value at True Forward',
        'field': 'tfConsumptionNetValue',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'CCW Change Subscription Qty',
        'field': 'ccwSubSkuQty',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'CCW Change Subscription Amt',
        'field': 'ccwSubAmt',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'dollar-align',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'True Forward Required',
        'field': 'tfRequired',
        'cellClass': '',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'Consumption Method',
        'field': 'consumptionMethod',
        'pinned': 'right',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true
      },
      {
        'headerName': 'License Type',
        'field': 'licenseType',
        'pinned': 'right',
        'headerClass': 'text-right',
        'width': 180,
        'minWidth': 60,
        'suppressMenu': true
      }];
      component.gridOptions={api:{setColumnDefs:(params) => {}}} as any;
      component.getTrueFowardColumn();
      expect(component.columnDefs).toEqual(columnDefs)
   });


   it("should call getTrueForwardData", (done) => {
    component.gridOptions={api:{setRowData:(params) => {}}} as any;
    component.getTrueForwardData();
     component['allArchitectureViewService'].getConsumptionDataTrueFwd('1','2').subscribe({
        next: (res:any) => {
            expect(component.rowData).toEqual(res.data.suiteDetails)
            done()
        }
     })
   });

   it("should call getTrueForwardData b1", (done) => {
    // component.gridOptions={api:{setRowData:(params) => {}}} as any;
    const service = fixture.debugElement.injector.get(AllArchitectureViewService)
    jest.spyOn(service, 'getConsumptionDataTrueFwd').mockReturnValue(of({error:true}))
    component.getTrueForwardData();
     component['allArchitectureViewService'].getConsumptionDataTrueFwd('1','2').subscribe({
        next: (res:any) => {
            done()
        }
     })
   });

});
