import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import {
  ComponentFixture,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { EaNgPaginationComponent } from "ea/ea-ng-pagination/ea-ng-pagination.component";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { DashboardProposalListComponent } from "./dashboard-proposal-list.component";
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
      },
    });
  }

  getApiCallJson(url) {
    return of({})
  }
}

describe("DashboardProposalListComponent", () => {
  let component: DashboardProposalListComponent;
  let fixture: ComponentFixture<DashboardProposalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardProposalListComponent,
        LocalizationPipe,
        EaNgPaginationComponent,
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        NgbPaginationModule,
      ],
      providers: [
        { provide: EaRestService, useClass: MockEaRestService },
        CurrencyPipe,
        EaUtilitiesService,
        LocalizationService,
        DataIdConstantsService,
        ElementIdConstantsService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProposalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }); 
  
  afterEach(() => {
    //fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should getProposalListData", () => {
    component.isSearchedData = true;
    component.getProposalListData();
    expect(component.isSearchedData).toBe(false);

    let storeService = fixture.debugElement.injector.get(EaStoreService);
    storeService.selectedDealData.buyingProgram = "3.0";
    component.getProposalListData();
    expect(component.proposalList).not.toBe("");
  });

  it("should getProposalListData", () => {
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.getProposalListData();
    expect(component.proposalList).toEqual([]);
  });

  it("should getProposalListData", () => {
    const data = {};
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.getProposalListData();
    expect(component.proposalList).toEqual([]);
  });

  it("should getProposalListData", () => {
    const data = {
      data: {},
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.getProposalListData();
    expect(component.proposalList).toEqual([]);
  });

  it("should paginationUpdated", () => {
    const event = {};
    component.searchParam = "";
    component.paginationUpdated(event);
    expect(component.searchParam).toEqual("");
  });

  it("should paginationUpdated", () => {
    const event = {};
    component.searchParam = "test";
    component.isSearchedData = true;
    const spy = jest.spyOn(component, "searchProposals");
    component.paginationUpdated(event);
    expect(spy).toHaveBeenCalled();
  });

  it("should goToProposal", () => {
    const proposal = {
      proposalObjectId: "test",
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToProposal(proposal);
    expect(call).toHaveBeenCalled();
  });

  it("should goToProposal", () => {
    const proposal = {
      proposalId: "test",
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToProposal(proposal);
    expect(call).toHaveBeenCalled();
  });

  it("should selectedCreatedBy", () => {
    const value = "Created By Me";
    component.selectedCreatedBy(value);
    expect(component.selectedView).toEqual(value);
  });

  it("should selectedCreatedBy", () => {
    const value = "Created By Team";
    component.selectedCreatedBy(value);
    expect(component.selectedView).toEqual(value);
  });

  it("should searchProposals", () => {
    component.searchParam = "";
    component.searchProposals();
    expect(component.searchParam).toEqual("");
  });

  it("should searchProposals", () => {
    component.searchParam = "test";
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, "postApiCall").mockReturnValue(of(data));
    component.searchProposals();
    expect(component.proposalList).toEqual([]);
  });

  it("should searchProposals", () => {
    component.searchParam = "test";
    component.searchProposals();
    expect(component.isSearchedData).toBe(true);
  });
});
