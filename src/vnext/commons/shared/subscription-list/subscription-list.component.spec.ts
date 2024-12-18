import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { EaRestService } from "ea/ea-rest.service";
import { of } from "rxjs";
import { MessageComponent } from "vnext/commons/message/message.component";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LookupSubscriptionComponent } from "vnext/modals/lookup-subscription/lookup-subscription.component";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { LocalizationPipe } from "../pipes/localization.pipe";

import { SubscriptionListComponent } from "./subscription-list.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { EaService } from "ea/ea.service";
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
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}

describe("SubscriptionListComponent", () => {
  let component: SubscriptionListComponent;
  let fixture: ComponentFixture<SubscriptionListComponent>;
  let modalService: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SubscriptionListComponent,
        LocalizationPipe,
        LookupSubscriptionComponent,
        MessageComponent,
      ],
      providers: [
        VnextService,
        { provide: EaRestService, useClass: MockEaRestService },
        EaUtilitiesService,
        ProjectStoreService,
        LocalizationService,
        VnextStoreService,
        UtilitiesService,
        CurrencyPipe,
        ProposalStoreService,
        LocalizationPipe,
        DataIdConstantsService,
        ProposalStoreService,
        EaService
      ],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionListComponent);
    component = fixture.componentInstance;
    component.selectedSubscription = {
      masterAgreementId: "test",
      statusDesc: "test",
      subscriptionStart: "test",
      subscriptionEnd: "test",
      subscriptionId: "test",
      subRefId: "test",
      subscriptionName: "test",
      smartAccount: "test",
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    component.projectStoreService.projectData.objId = '123'
    expect(component).toBeTruthy();
  });

  it("should call getSubscriptionList 1", () => {
    component.selectedSubscription = undefined
    const data = {
      data: [
        {
          subRefId: "test",
        }
      ],
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    let projectService = fixture.debugElement.injector.get(ProjectStoreService);
    projectService.projectData.objId = "test123";
    component.projectStoreService.projectData.objId = "test123";
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getSubscriptionList();
    expect(component.subscriptionList).toEqual(data.data);
  });

  it("should call getSubscriptionList 2", () => {
    const data = {
      data: [],
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    let projectService = fixture.debugElement.injector.get(ProjectStoreService);
    projectService.projectData.objId = "test123";
    component.projectStoreService.projectData.objId = "test123";
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getSubscriptionList();
    expect(component.subscriptionList).not.toBe(undefined);
  });

  it("should call getSubscriptionList 3", () => {
    const data = {};
    let service = fixture.debugElement.injector.get(EaRestService);
    let projectService = fixture.debugElement.injector.get(ProjectStoreService);
    projectService.projectData.objId = "test123";
    component.projectStoreService.projectData.objId = "test123";
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getSubscriptionList();
    expect(component.subscriptionList).toEqual([]);
  });

  it("should call getSubscriptionList 4", () => {
    const data = {
      error: true,
    };
    let service = fixture.debugElement.injector.get(EaRestService);
    let projectService = fixture.debugElement.injector.get(ProjectStoreService);
    projectService.projectData.objId = "test123";
    component.projectStoreService.projectData.objId = "test123";
    jest.spyOn(service, "getApiCall").mockReturnValue(of(data));
    component.getSubscriptionList();
    expect(component.subscriptionList).not.toBe(null);
  });

  it("should call selectSubscription", () => {
    const data = {
      subscriptionEnd: "test",
      subscriptionStart: "test",
      subscriptionId: "test",
      subRefId: "test",
    };
    component.selectSubscription(data);
    expect(component.selectedSubscription).toEqual(data);
  });

  it("should call deselectSubscription", () => {
    component.deselectSubscription();
    expect(component.selectedSubscription).toEqual({});
  });

  // it('should call lookupSubscription', () => {
  //   const date = new Date();
  //   component.startDate = date;
  //   modalService = TestBed.get(NgbModal);
  //   modalRef = modalService.open(LookupSubscriptionComponent);
  //   jest.spyOn(modalService, "open").mockReturnValue(modalRef);
  //   modalRef.result =  new Promise((resolve, reject) => resolve({continue: true, data:
  //       [{ subscriptionEnd: 'test',
  //           subscriptionStart: 'test',
  //           subscriptionId: 'test',
  //           subRefId: 'test'}]
  //       }));
  //   jest.spyOn(component, 'subscriptionSelectedFromList').mockReturnValue(false);
  //   component.subscriptionList =[
  //       {
  //           subRefId: 'test'
  //       }
  //   ]
  //   //component.lookupSubscription();
  // });

  // it('should call lookupSubscription', () => {
  //   const date = new Date();
  //   component.startDate = date;
  //   modalService = TestBed.get(NgbModal);
  //   modalRef = modalService.open(LookupSubscriptionComponent);
  //   jest.spyOn(modalService, "open").mockReturnValue(modalRef);
  //   modalRef.result =  new Promise((resolve, reject) => resolve({continue: false
  //       }));
  //   //component.lookupSubscription();
  // });
});
