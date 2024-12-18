import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { MessageService } from "../services/message.service";
import { AppDataService } from "../services/app.data.service";
import { EventEmitter, Renderer2 } from "@angular/core";
import { of } from "rxjs";
import { ActiveAgreementsComponent } from "./active-agreements.component";
import { AllArchitectureViewService } from "@app/all-architecture-view/all-architecture-view.service";

describe("ActiveAgreementsComponent", () => {
  let component: ActiveAgreementsComponent;
  let fixture: ComponentFixture<ActiveAgreementsComponent>;


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

    agreementDataEmitter = new EventEmitter();
  }

  class MockAllArchitectureViewService {
    viewTabEmitter = new EventEmitter();
    getColDataAgreements() {
      return of({ data: [{ field: "name" }] });
    }
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
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ActiveAgreementsComponent],
      providers: [
        { provide: MessageService, useClass: MockMessageService },
        { provide: AppDataService, useClass: MockAppDataService },
        {
          provide: AllArchitectureViewService,
          useClass: MockAllArchitectureViewService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAgreementsComponent);
    component = fixture.componentInstance;
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngoninit", () => {
    component.allArchitectureViewService.viewConsumption = true;
    component.allArchitectureViewService.selectedVirtualAccount = {
      id: "123",
      subscriptionID: "123",
    };
    component.ngOnInit();
    component.appDataService.agreementDataEmitter.subscribe((res: any) => {
      expect(component.currentPage).toBe("agreements");
    });
    expect(component.currentPage).toBe("consumption");
    expect(component.selecteVirtualAccount).toEqual({
      id: "123",
      subscriptionID: "123",
    });
    expect(component.virtualAccountId).toBe("123");
    expect(component.subscriptionId).toBe("123");
    component.appDataService.agreementDataEmitter.emit("test");
    expect(component).toBeTruthy();
  });

  it("should call toggleView", () => {
    component.displayGridView = false;
    component.toggleView();
    expect(component.displayGridView).toBeTruthy();
  });

  it("should call ngOnChanges", () => {
    const change = { fromPage: { currentValue: "accountHealth" } } as any;
    component.ngOnChanges(change);
    expect(component.displayGridView).toBeFalsy();
    expect(component.currentPage).toBe("agreements");
  });

  it("should call ngOnChanges b1", () => {
    const change = { fromPage: { currentValue: "agreementTab" } } as any;
    component.ngOnChanges(change);
    expect(component.displayGridView).toBeFalsy();
  });

  it("should call gotoConsumption", () => {
    component.fromPage = "accountHealth";
    component.gotoConsumption({ subscriptionID: "123", id: "123" });
    expect(component.virtualAccountId).toBe("123");
    expect(component.subscriptionId).toBe("123");
    expect(component.selecteVirtualAccount).toEqual({
      subscriptionID: "123",
      id: "123",
    });
    expect(component.currentPage).toBe("consumption");
    expect(component.displayGridView).toBeFalsy();
  });

  it("should call onCellClicked", () => {
    component.onCellClicked({
      data: "test",
      colDef: { field: "architecture" },
    });
    expect(component.selecteVirtualAccount).toBe("test");
    expect(component.currentPage).toBe("consumption");
  });

  it("should call backtoAgreements", () => {
    component.backtoAgreements();
    expect(component.displayGridView).toBe(false);
    expect(component.currentPage).toBe("agreements");
  });

  it("should call onFilterTextBoxChanged", () => {
    component.gridOptions={api:{setQuickFilter:(params) => {}}} as any;
    component.onFilterTextBoxChanged();
  });

  it("should call getTableData", () => {
    component.activeAgreementData = { data: { accounts: "test" } };
    component.gridOptions = {
      api: { sizeColumnsToFit: () => {}, setRowData: (a) => {} },
    } as any;
    component.getTableData();
    expect(component.rowData).toBe("test");
  });

  it("should call onGridReady", () => {
    const fake = jest.spyOn(component, "getAgreementColumnsData");
    component.onGridReady("");
    expect(fake).toBeCalled();
  });

  it("should call getAgreementColumnsData", () => {

    component.getAgreementColumnsData();

    component.allArchitectureViewService
      .getColDataAgreements()
      .subscribe((res: any) => {
        expect(component.columnDefs[0].field).toBe(res.data[0].field);
   
  
      });
  });

  it("should call getArchName", () => {
   
    const r1 = component.getArchName({value:'test',data:{architecture:''}});
    const r2 = component.getArchName({value:'test',data:{architecture:'dna'}});
    const r3 = component.getArchName({value:'test',data:{architecture:'data'}});
    const r4 = component.getArchName({value:'test',data:{architecture:'security'}});
    const r5 = component.getArchName({value:'test',data:{architecture:'cross'}});
    expect(r1).toBeTruthy();
    expect(r2).toBeTruthy();
    expect(r3).toBeTruthy();
    expect(r4).toBeTruthy();
    expect(r5).toBeTruthy();
  });

  it("should call getDotsTimeline", () => {
    const r1 = component.getDotsTimeline('1 2 3','4 5 6','7 8 9');
    expect(r1).toBeTruthy();
  });

  it("should call gotoConsumptionfromAccountHealth", () => {
    component.gotoConsumptionfromAccountHealth({subscriptionID:'123', id:'123'});
    expect(component.subscriptionId).toBe('123');
  });



});
