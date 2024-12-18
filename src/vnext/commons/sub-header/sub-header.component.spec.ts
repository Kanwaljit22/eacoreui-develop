import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProjectRestService } from "vnext/project/project-rest.service";
import { ProjectService } from "vnext/project/project.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { EaRestService } from "ea/ea-rest.service";
import { VnextService } from "vnext/vnext.service";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { UtilitiesService } from "../services/utilities.service";
import { SubHeaderComponent } from "./sub-header.component";
import { VnextStoreService } from "../services/vnext-store.service";
import { CurrencyPipe } from "@angular/common";
import { SearchPipe } from "../shared/pipes/search.pipe";
import { of } from "rxjs";
import { LocalizationPipe } from "../shared/pipes/localization.pipe";
import { AssignSmartAccountComponent } from "vnext/modals/assign-smart-account/assign-smart-account.component";
import { DocumentCenterComponent } from "vnext/document-center/document-center.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { DashboardDealListComponent } from "ea/ea-dashboard/dashboard-deal-list/dashboard-deal-list.component";
import { Router } from "@angular/router";
import { DataIdConstantsService } from "../services/data-id-constants.service";
import { EaidStoreService } from "vnext/eaid/eaid-store.service";
import { ElementIdConstantsService } from "../services/element-id-constants.service";
import { TcoStoreService } from "vnext/tco/tco-store.service";

class MockSubHeaderRestService {
  getAuthDetails() {
    return of({
      data: {
        qualifications: {},
      },
      error: false,
    });
  }
}

class MockProjectStoreService {
  projectData = {
    objId: "string",
    status: "String",
    deleted: true,
    locked: true,
    ordered: true,
    deferLocc: true,
    ciscoTeam: {},
    customerInfo: {},
    dealInfo: {
      id: "1234",
    },
    loccDetail: {},
    partnerInfo: {},
    partnerTeam: {},
    initiatedBy: {},
    scopeInfo: {},
    smartAccount: {},
  };
}

class MockEaRestService {
  getApiCallJson() {
    return of({
      data: {
        smartAccounts: {},
      },
      error: false,
    });
  }

  putApiCall() {
    return of({
      data: {},
      error: false,
    });
  }
  postApiCall() {
    return of({
      data: {},
      error: false,
    });
  }

  getApiCall() {
    return of({
      data: {},
      error: false,
    });
  }
}
describe("SubHeaderComponent", () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgbTooltipModule,
        RouterTestingModule.withRoutes([
          {
            path: "ea/project/proposal/:proposalId/documents",
            component: DocumentCenterComponent,
          },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        SubHeaderComponent,
        SearchPipe,
        LocalizationPipe,
        AssignSmartAccountComponent,
        DashboardDealListComponent,
      ],
      providers: [
        { provide: ProjectStoreService, useClass: MockProjectStoreService },
        VnextService,
        VnextStoreService,
        UtilitiesService,
        CurrencyPipe,
        { provide: EaRestService, useClass: MockEaRestService },
        ProposalStoreService,
        ProjectService,
        ProjectRestService,
        PriceEstimateService,
        PriceEstimateStoreService,
        ProposalRestService,
        DataIdConstantsService,
        EaidStoreService,
        ElementIdConstantsService,
        TcoStoreService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    //fixture.destroy();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("call onClickedOutside method", () => {
    component.onClickedOutside([]);
    expect(component.showSmartAccount).toBe(false);
  });

  // it("call viewAuth method", () => {
  //   expect(component.viewAuth()).toBeUndefined();
  //   // const viewAuthorizationComponent = jest.spyOn(component['modalVar'], 'open');
  //   // expect(component['modalVar'].open).toHaveBeenCalledWith(ViewAuthorizationComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
  // });

  it("call editProject method", () => {
    expect(component.editProject()).toBeUndefined();
  });

  it("call openSmartAccount", () => {
    component.showSmartAccount = true;
    component.openSmartAccount();
    expect(component.searchText).toEqual("");
    expect(component.showSmartAccount).toBeTruthy();
    component.showSmartAccount = false;
    component.openSmartAccount();
    expect(component.showSmartAccount).toBeFalsy();
  });

  it("call getSmartAccountDetail", () => {
    component.getSmartAccountDetail();
    expect(component.smartAccountData).toBeTruthy();
  });

  it("call selectSmartAccount", () => {
    component.selectSmartAccount({});
    expect(component.showSmartAccount).toBe(false);
  });

  it("call isShowEditSmartAcc", () => {
    expect(component.isShowEditSmartAcc()).toBe(false);
  });

  it("call requestNewSmartAccount", () => {
    expect(component.requestNewSmartAccount()).toBeUndefined();
  });

  it("call deleteSmartAccount", () => {
    expect(component.deleteSmartAccount()).toBeUndefined();
  });
  it("call cancelNameChange", () => {
    component.cancelNameChange();
    expect(component.projectName).toEqual("");
  });
  it("call viewDocumentCenter", () => {
    component.viewDocumentCenter();
    expect(component.proposalStoreService.loadCusConsentPage).toBeTruthy();
  });
  it("call editProjectName", () => {
    component.editProjectName();
    let obj = {
      id: 123,
      name: "cisco-project",
    };
    expect(component.eaStoreService.editName).toBeTruthy();
    component.proposalStoreService.proposalData = obj;
    component.editProjectName();
    expect(component.proposalName).not.toBe(undefined);
  });

  it("call shareProposal", () => {
    expect(component.shareProposal("test")).toBeUndefined();
  });

  it("call showSmartAcc", () => {
    expect(component.showSmartAcc()).toBeTruthy();

    component.projectStoreService.lockProject = false;
    component.vnextStoreService.currentPageContext = "projectContext";
    expect(component.showSmartAcc()).toBeFalsy();

    component.vnextStoreService.currentPageContext = "proposalContext";
    expect(component.showSmartAcc()).toBeTruthy();

    component.projectStoreService.lockProject = true;
    expect(component.showSmartAcc()).toBeTruthy();

    component.projectStoreService.projectData = null;
    expect(component.showSmartAcc()).toBeFalsy();
  });

  it("call allowSmartAccountAccess", () => {
    let obj = {
      id: 123,
      name: "cisco-project",
    };
    component.proposalStoreService.proposalData = obj;
    expect(component.allowSmartAccountAccess()).toBeTruthy();
  });


});
