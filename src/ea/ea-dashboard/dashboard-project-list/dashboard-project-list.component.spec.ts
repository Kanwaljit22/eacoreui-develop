import { CurrencyPipe } from "@angular/common";
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

import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { EaNgPaginationComponent } from "ea/ea-ng-pagination/ea-ng-pagination.component";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { DashboardProjectListComponent } from "./dashboard-project-list.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

class MockEaRestService {
  postApiCall() {
    return of({
      data: {
        projects: [
          {
            test: "test",
          },
        ],
        page: {
          test: "test",
        },
        approver: true,
      },
    });
  }

  getApiCallJson(url) {
    return of({})
  }
}

describe("DashboardProjectListComponent", () => {
  let component: DashboardProjectListComponent;
  let fixture: ComponentFixture<DashboardProjectListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardProjectListComponent,
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
        CurrencyPipe,
        EaUtilitiesService,
        LocalizationService,
        DataIdConstantsService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    let eaService = fixture.debugElement.injector.get(EaService);
    jest.spyOn(eaService, "isPartnerUserLoggedIn").mockReturnValue(true);
    component.ngOnInit();
    expect(component.isPartnerLoggedIn).toBeTruthy();
  });

  it("should call getProjectListData", () => {
    const data = {
      error: true,
    };
    const service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.getProjectListData();
    expect(component.projectsListData).toEqual([]);
  });

  // it('should call goToProject', () => {
  //     const data = {
  //         buyingProgram: 'EA 3.0',
  //         projectObjId: 'test'
  //     }
  //     component.goToProject(data);
  // });

  // it('should call goToProject', () => {
  //     const data = {
  //         projectId: 'test'
  //     }
  //     component.goToProject(data);
  // });

  it("should call paginationUpdated", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.isSearchedData = true;
    component.searchParam = "test";
    const func = jest.spyOn(component, "searchProjects");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should call paginationUpdated", () => {
    const event = {
      currentPage: 1,
      pageSize: 10,
    };
    component.searchParam = "";
    const func = jest.spyOn(component, "getProjectListData");
    component.paginationUpdated(event);
    expect(func).toHaveBeenCalled();
  });

  it("should call selectedCreatedBy", () => {
    const value = "Created By Me";
    const func = jest.spyOn(component, "getProjectListData");
    component.selectedCreatedBy(value);
    expect(component.searchParam).toEqual("");
    expect(component.openDrop).toBeFalsy();
    expect(func).toHaveBeenCalled();
  });

  it("should call selectedCreatedBy", () => {
    const value = "Created By Team";
    const func = jest.spyOn(component, "getProjectListData");
    component.selectedCreatedBy(value);
    expect(component.searchParam).toEqual("");
    expect(component.openDrop).toBeFalsy();
    expect(func).toHaveBeenCalled();
  });

  it("should call searchProjects", () => {
    component.searchParam = "";

    expect(component.searchProjects()).toBeUndefined();
  });

  it("should call searchProjects with test", () => {
    component.searchParam = "test";
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.searchProjects();
    expect(component.projectsListData).toEqual([]);
  });

  it("should call searchProjects 1", () => {
    component.searchParam = "test";
    const data = {
      data: {
        projects: [
          {
            test: "test",
          },
        ],
        page: {
          test: "test",
        },
      },
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.searchProjects();
    expect(component.projectsListData).not.toBe(undefined);
  });
});
