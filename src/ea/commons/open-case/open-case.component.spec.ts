import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { OpenCaseComponent } from "./open-case.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("OpenCaseComponent", () => {
  let component: OpenCaseComponent;
  let fixture: ComponentFixture<OpenCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenCaseComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [EaStoreService, EaRestService, LocalizationService, DataIdConstantsService],
    }).compileComponents();
  });

  beforeEach(() => {
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(OpenCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call getCaseListData", () => {
    const data = {
      data: [
        {
          caseClosed: false,
          pegaCaseDetails: {
            CaseNumber: "test",
          },
        },
      ],
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getCaseListData();
    expect(component.caseList).toEqual(data.data);
  });

  it("should call getCaseListData", () => {
    const data = {
      data: [],
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getCaseListData();
    expect(component.successMessage).toBeTruthy();
  });

  it("should call getCaseListData", () => {
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getCaseListData();
  });

  it("should call openCasePortal", () => {
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    const url = "test";
    component.openCasePortal(url);
    expect(call).toHaveBeenCalled();
  });

  it("should call checkIfAllCaseClosed", () => {
    const data = [
      {
        caseClosed: false,
      },
    ];
    component.checkIfAllCaseClosed(data);
  });

  it("should call checkIfAllCaseClosed", () => {
    const data = "";
    component.checkIfAllCaseClosed(data);
  });
});
