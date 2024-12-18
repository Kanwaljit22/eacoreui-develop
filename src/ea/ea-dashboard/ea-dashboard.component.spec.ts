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

import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { DashboardDealListComponent } from "./dashboard-deal-list/dashboard-deal-list.component";
import { EaDashboardComponent } from "./ea-dashboard.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

class MockEaRestService {
  postApiCall() {
    return of({
      data: {
        responseApproverList: [
          {
            test: "test",
          },
        ],
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
}

describe("EaDashboardComponent", () => {
  let component: EaDashboardComponent;
  let fixture: ComponentFixture<EaDashboardComponent>;

  beforeEach( async () => {
    TestBed.configureTestingModule({
      declarations: [
        EaDashboardComponent,
        LocalizationPipe,
        DashboardDealListComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],

      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],

      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        EaStoreService,
        EaService,
        LocalizationService,
        DataIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    let eaService = fixture.debugElement.injector.get(EaStoreService);
    const loadData = jest.spyOn(component, "loadData");
    eaService.maintainanceObj.underMaintainance = false;
    component.ngOnInit();
    expect(loadData).toHaveBeenCalled();

    eaService.maintainanceObj.underMaintainance = true;
    component.ngOnInit();
  });

  it("should call loadData", () => {
    let eaService = fixture.debugElement.injector.get(EaService);
    jest.spyOn(eaService, "isPartnerUserLoggedIn").mockReturnValue(true);
    component.loadData();
    expect(component.isPartnerLoggedIn).toBe(true);
  });

  it("should call selectTabToShow", () => {
    let type = "proposal";
    component.selectedTab = "deals";
    component.selectTabToShow(type);
    expect(component.selectedTab).toBe(type);

    type = "proposal";
    component.selectedTab = "proposal";
    component.selectTabToShow(type);
  });

  it("should call selectTabToShow", () => {
    let type = "deals";
    component.selectedTab = "qalification";
    const getCall = jest.spyOn(component, "getFilterMetaData");
    component.selectTabToShow(type);
    expect(component.selectedTab).toBe(type);
    expect(getCall).toHaveBeenCalled();
  });

  it("should call getFilterMetaData", () => {
    const data = {
      error: true,
    };
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCallJson").mockReturnValue(of(data));
    expect(component.getFilterMetaData()).toBeUndefined();
  });

  it("should call getExpetionApprover", () => {
    const data = {
      error: true,
    };
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCallJson").mockReturnValue(of(data));
    expect(component.getExpetionApprover()).toBeUndefined();
  });
});
