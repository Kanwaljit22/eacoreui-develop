import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { of } from "rxjs";

import { CreateLinkedProjectComponent } from "./create-linked-project.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("CreateLinkedProjectComponent", () => {
  let component: CreateLinkedProjectComponent;
  let fixture: ComponentFixture<CreateLinkedProjectComponent>;
  let route: ActivatedRoute;
  class MockEaRestService {
    getApiCall() {
      return of({
        data: {
          smartAccounts: [
            {
              smartAccName: "test",
            },
          ],
          hasEa2Entity: false,
        },
      });
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLinkedProjectComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: "qualifications/external/landing/sub-ui", redirectTo: "" },
        ]),
      ],
      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        EaStoreService,
        DataIdConstantsService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (param) => {
                  if (param === "did") {
                    return "123";
                  } else {
                    return "999";
                  }
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLinkedProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    const func = jest.spyOn(component, "getParamDetails");
    const func1 = jest.spyOn(component, "getChangeSubscriptionDetails");

    component.ngOnInit();
    expect(func).toHaveBeenCalled();
    expect(func1).toHaveBeenCalled();
  });

  it("should call getParamDetails", () => {
    component.getParamDetails();
    expect(component.dealId).toBe("123");
    expect(component.sid).toBe("999");
  });

  it("should call getChangeSubscriptionDetails error is true", () => {
    // error is true
    const errorText = "errorMessage";
    let response = {
      error: true,
      messages: [{ text: errorText }],
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(component.displayPage).toBe(true);
    expect(component.errorMessage).toBe(errorText);
  });

  it("should call getChangeSubscriptionDetails no data and error is false", () => {
    //no data and error is false
    let response = {
      error: false,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    const methodSpy = jest.spyOn(component, "prepareRedirectUrl");
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(methodSpy).toHaveBeenCalled();
  });
  it("should call getChangeSubscriptionDetails when have data but no ea3Entity", () => {
    //when have data but no ea3Entity
    let response = {
      error: false,
      data: {},
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    const methodSpy = jest.spyOn(component, "prepareRedirectUrl");
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(methodSpy).toHaveBeenCalled();
  });

  it("should call getChangeSubscriptionDetails when have data & ea3Entity but no proposalId/projectId", () => {
    //when have data & ea3Entity but no proposalId/projectId
    const dealInfo = { dealName: "Deal Name" };
    const subscriptionInfo = "Sub Id";
    let response = {
      error: false,
      data: {
        ea3Entity: true,
        dealInfo: dealInfo,
        subscriptionInfo: subscriptionInfo,
      },
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(component.projectName).toBe(dealInfo.dealName);
    expect(component.dealSubDetails).toBe(dealInfo);
    expect(component.subscriptionInfo).toBe(subscriptionInfo);
    expect(component.displayPage).toBe(true);
  });

  it("should call getChangeSubscriptionDetails when have data & ea3Entity,proposalId", () => {
    //when have data & ea3Entity, proposalId
    const dealInfo = { dealName: "Deal Name" };
    const subscriptionInfo = "Sub Id";
    let response = {
      error: false,
      data: {
        ea3Entity: true,
        dealInfo: dealInfo,
        subscriptionInfo: subscriptionInfo,
        proposalId: "123",
      },
    };
    const methodSpy = jest.spyOn(component, "routeToPage");
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(methodSpy).toHaveBeenCalled;
  });

  it("should call getChangeSubscriptionDetails when have data & ea3Entity,projectId", () => {
    //when have data & ea3Entity, projectId
    const dealInfo = { dealName: "Deal Name" };
    const subscriptionInfo = "Sub Id";
    let response = {
      error: false,
      data: {
        ea3Entity: true,
        dealInfo: dealInfo,
        subscriptionInfo: subscriptionInfo,
        projectId: "123",
      },
    };
    const methodSpy = jest.spyOn(component, "routeToPage");
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "getApiCall").mockReturnValue(of(response));
    component.getChangeSubscriptionDetails();
    expect(methodSpy).toHaveBeenCalled;
  });

  it("should call createProject", () => {
    const methodSpy = jest.spyOn(component, "routeToPage");
    component.createProject();
    expect(methodSpy).toHaveBeenCalled;
  });
});
