import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivityLogComponent } from "./activity-log.component";
import { of } from "rxjs";
import { LocaleService } from "../services/locale.service";
import { AppDataService } from "../services/app.data.service";
import { BlockUiService } from "../services/block.ui.service";
import { MessageService } from "../services/message.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConstantsService } from "../services/constants.service";
import { PermissionService } from "@app/permission.service";
import { UtilitiesService } from "../services/utilities.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { ActivityLogService } from "./activity-log.service";
import { EventEmitter, Renderer2 } from "@angular/core";
import { ActivityLogDetailsComponent } from "@app/modal/activity-log-details/activity-log-details.component";

describe("ActivityLogComponent", () => {
  let component: ActivityLogComponent;
  let fixture: ComponentFixture<ActivityLogComponent>;

  class MockAppDataService {
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    archName = "test";
    get getAppDomain() {
      return "";
    }
    openActivityLog = false;
    userInfo = {
      userId: "123",
    };

    pageContext = "proposalPriceEstimateStep";
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
  class MockProposalDataService {
    proposalDataObject = { proposalId: "123" };
  }
  class MockQualificationsService {
    qualification = { qualID: "123" };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
  }
  class MockActivityLogService {
    getActivityLogData(a, b, c) {
      return of({
        error: false,
        activityLogs: [
          {
            differentials:[ {
                test: "test",
                oldChangedValue: "test",
                change: "test",
                newChangedValue: "test",
                description:'test'
              },
              {
                test: "test",
                oldChangedValue: "test",
                change: "test",
                newChangedValue: "test",
                description:'test',
                OLD_VALUE:'test',NEW_VALUE:'test'
              }],
          },
        ],
      });
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityLogComponent, ActivityLogDetailsComponent],
      imports: [],
      providers: [
        { provide: AppDataService, useClass: MockAppDataService },
        LocaleService,
        ConstantsService,
        MessageService,
        NgbModal,
        PermissionService,
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: ActivityLogService, useClass: MockActivityLogService },
        Renderer2,
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        BlockUiService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Should create component", () => {
    expect(component).toBeTruthy();
  });

  it("Should call ngOnInit", () => {
    const appDataService = fixture.debugElement.injector.get(AppDataService);
    appDataService.pageContext = "ProposalPriceEstimateStep";
    component.ngOnInit();
    console.log(AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep);
    expect(component.isProposalContext).toBeTruthy();
  });

  it("Should call ngOnInit b1", () => {
    const appDataService = fixture.debugElement.injector.get(AppDataService);
    appDataService.pageContext = "QualificationCreate";
    component.ngOnInit();
    console.log(AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep);
    expect(component.isQualificationContext).toBeTruthy();
  });

  it("Should call closeActivityLog", () => {
    const renderer = fixture.debugElement.injector.get(Renderer2);
    const mckRemoveClass = jest.spyOn(renderer, "removeClass");
    component.closeActivityLog();
    expect(mckRemoveClass).toBeCalled();
  });

  it("Should call onDateChange", () => {
    const renderer = fixture.debugElement.injector.get(Renderer2);
    const mckshowActivityLog = jest.spyOn(component, "showActivityLog");
    component.onDateChange({ value: "test", viewValue: "test" });
    expect(mckshowActivityLog).toBeCalled();
    expect(component.selectedDate).toBe("test");
    expect(component.selectedDate).toBe("test");
  });

  it("Should call openValueModal", () => {
    const modal = fixture.debugElement.injector.get(NgbModal);
    const mckopen = jest.spyOn(modal, "open");
    component.openValueModal("test", "");
    expect(mckopen).toBeCalled();
  });

  it("Should call showActivityLog", () => {
    const type = "ALL";
    component.showActivityLog(type);

    expect(component.isAllSelected).toBeTruthy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("ALL");
    // expect( component.activityData).toEqual( [])
  });

  it("Should call showActivityLog b1", () => {
    const type = "QUALIFICATION";
    component.isQualificationContext = false;
    component.isProposalContext = true;
    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeTruthy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("QUALIFICATION");
    // expect( component.activityData).toEqual( [])
  });

  it("Should call showActivityLog b2", () => {
    const type = "PROPOSAL";
    component.isProposalContext = true;
    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeTruthy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("PROPOSAL");
    // expect( component.activityData).toEqual( [])
  });

  it("Should call showActivityLog b2", () => {
    const type = "TCO";
    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeTruthy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("TCO");
    // expect( component.activityData).toEqual( [])
  });

  it("Should call showActivityLog b3", () => {
    const type = "DOCUSIGN";
    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeTruthy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("DOCUSIGN");
    // expect( component.activityData).toEqual( [])
  });

  it("Should call showActivityLog b4", () => {
    const type = "QUOTE";
    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeTruthy();
    expect(component.isOrderSelected).toBeFalsy();
    expect(component.selectedType).toBe("QUOTE");
    // expect( component.activityData).toBeTruthy()
  });

  it("Should call showActivityLog b5", () => {
    const type = "ORDER";

    component.showActivityLog(type);
    expect(component.isQualificatiosSelected).toBeFalsy();
    expect(component.isAllSelected).toBeFalsy();
    expect(component.isProposalSelected).toBeFalsy();
    expect(component.isTcoSelected).toBeFalsy();
    expect(component.isDocusignSelected).toBeFalsy();
    expect(component.isQuoteSelected).toBeFalsy();
    expect(component.isOrderSelected).toBeTruthy();
    expect(component.selectedType).toBe("ORDER");
    // expect( component.activityData).toBeTruthy()
  });

  it("Should call showActivityLog b6", (done) => {
    const type = "ORDER";
    const service = fixture.debugElement.injector.get(ActivityLogService);
    const response = {
      error: false,
      activityLogs: [
        {
          differentials:[ {
            test: "test",
            oldChangedValue: "test",
            change: "test",
            newChangedValue: "test",
            description:'test'
          },
          {
            test: "test",
            oldChangedValue: "test",
            change: "test",
            newChangedValue: "test",
            description:'test',OLD_VALUE:'test',NEW_VALUE:'test'
          }],
        },
      ],
    };
    jest.spyOn(service, "getActivityLogData").mockReturnValue(of(response));
    component.showActivityLog(type);
    component.activityLogService
      .getActivityLogData("1", "2", "3")
      .subscribe((res: any) => {
        expect(component.activityLogData[0].differentials[0].test).toBe('test')
        done()
      });
  });
});
