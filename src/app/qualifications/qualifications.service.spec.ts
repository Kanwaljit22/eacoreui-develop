import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { MessageService } from "@app/shared/services/message.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { ConstantsService } from "@app/shared/services/constants.service";
import { PermissionService } from "@app/permission.service";

describe("QualificationsService", () => {
  let service: QualificationsService;
  let httpTestingController: HttpTestingController;
  let appDataService;
  const url = "https://localhost:4200/";

  class MockQualificationsService {
    qualification = { qualID: "123" };
    loaData = { partnerBeGeoId: "123", customerGuId: "123" };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
  }

  class MockProposalDataService {
    proposalDataObject = { proposalId: "123" };
  }

  class MockAppDataService {
    setSessionObject = jest.fn();
    displayChangeSub = true;
    getSessionObject = jest
      .fn()
      .mockReturnValue({ custInfo: { custName: "test" } } as any);
    qualListForDeal = false;
    getDetailsMetaData = jest.fn().mockReturnValue({ displayName: "test" });
    subHeaderData = { subHeaderVal: [1, 2], custName: "test" };
    userId = "123";
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
      firstName: "test",
      lastName: "test",
    };
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }

  const mockMessageService = {
    displayUiTechnicalError(error) {},
    displayMessagesFromResponse(res) {},
  };

  class MockUtilitiesService {
    formatWithNoDecimalForDashboard = jest.fn().mockReturnValue(0);
    changeMessage = jest.fn();
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

  class MockConstantsService {
    SECURITY = "test";
  }

  class MockPermissionService {
    qualPermissions = new Map();
    isProposalPermissionPage = jest.fn();
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        QualificationsService,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        NgbModal,
        Router,
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: ConstantsService, useClass: MockConstantsService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    service = TestBed.inject(QualificationsService);
    appDataService = TestBed.inject(AppDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call getdealIdData", (done) => {
    const response = {
      status: "success",
    };
    let documentId = { dealId: "123" };
    service.getdealIdData(documentId).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const url1 = url + "api/lookup/deal?d=123";
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call loccLandingApiCall", (done) => {
    const response = {
      status: "success",
    };
    let documentId = { dealId: "123" };
    service.loccLandingApiCall("123", "123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const url1 =
      url + "api/partner/locc-landing?did=" + "123" + "&qid=" + "123";
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call loccDetailApi", (done) => {
    const response = {
      status: "success",
    };

    service.loccDetailApi("123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const url1 = url + "api/partner/locc-detail?did=123";
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call loccDetailApi", () => {
    service.subscribers = { roadMapEmitter: { unsubscribe: jest.fn() } } as any;
    service.unSubscribe();
  });

  it("should call reopenQual", () => {
    const promise = new Promise((resolve, rej) => {
      const res = { continue: true };
      resolve(res);
    });

    jest
      .spyOn(service, "updateQualStatus")
      .mockReturnValue(of({ permissions: { featureAccess: [] } }));
    service["modalVar"] = {
      open: jest.fn().mockReturnValue({ result: promise }),
    } as any;
    service.reopenQual();
  });

  it("should call setRoSalesTeamAndQualPermissions", () => {
    const data = {
      salesTeamList: ["testn test"],
      permissions: { featureAccess: [{ name: "test" }] },
    };
    service.setRoSalesTeamAndQualPermissions(data);
  });

  it("should call validateQualName", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/validateName";
    service.validateQualName().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call createQual", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/create";
    service.createQual().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call deleteQual", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification?u=123" + "&q=123";
    service.deleteQual(123).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("DELETE");
  });

  it("should call updateQual", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/update";
    service.updateQual({ test: "123" }).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call getQualGeographyColumn", () => {
    service.getQualGeographyColumn();
  });

  it("should call listQualification", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/list";
    service.listQualification().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call listGeography", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/listGeography";
    service.listGeography().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call prepareSubHeaderObject", () => {
    service.prepareSubHeaderObject("test", true);
  });

  it("should call prepareSubHeaderObject b1", () => {
    appDataService.qualListForDeal = true;
    service.prepareSubHeaderObject("test", true);
  });

  it("should call prepareSubHeaderObject b2", () => {
    service.dealData.dealName = "test";
    service.prepareSubHeaderObject("test", false);
  });

  it("should call updateQualStatus", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/reopen";
    service.updateQualStatus({}).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call updateQualStatus", () => {
    const response = {
      data: {
        loaSigned: "",
        qualStatus: "",
        partnerDeal: "",
        qualificationCreatedByName: "",
        prevChangeSubQualId: "",
        qualName: "",
        federalCustomer: "Y",
        customerContact: {
          affiliateNames: "",
          preferredLegalAddress: "test",
          preferredLegalName: "",
          repName: "",
          repEmail: "",
          repTitle: "",
          phoneCountryCode: "",
          phoneNumber: "",
          dialFlagCode: "",
          scope: "NONE",
          fileName: "",
        },
        customerId: "124",
        deal: { quotes: [1], dealId: "123", dealStatusDesc: "", optyName: "" },
        partnerTeams: [{ beGeoId: "123" }],
        saleSpecialist: "tets",
        extendedSalesTeam: [1],
        cxTeams: "test",
        assurersTeams: "test",
        distiTeams: "test",
        distiInitiated: "test",
        cam: "test",
        changeSubscriptionDeal: "test",
        subscription: "test",
      },
    };
    jest.spyOn(service, "getCustomerInfo").mockReturnValue(of(response));
    service.updateSessionQualData("test", "123");
  });

  it("should call goToQualification", () => {
    service.appDataService.isPatnerLedFlow = false;
    service.goToQualification();
  });

  it("should call goToQualification", () => {
    service.appDataService.isPatnerLedFlow = true;
    service.goToQualification();
  });

  it("should call getQualListForDashboard", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/users/created-by-me";
    service.getQualListForDashboard().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });

    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call qualsSharedWithMe", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/users/shared-with-me";
    service.qualsSharedWithMe().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call viewQualSummary", () => {
    service.viewQualSummary({
      id: "123",
      qualName: "test",
      status: "123",
      customerName: "qwerty",
      permissions: {
        featureAccess: [
          { name: "qualification.edit.name" },
          { name: "proposal.edit_name" },
        ],
      },
    });
    service.viewQualSummary({
      id: "123",
      qualName: "test",
      status: "123",
      customerName: "qwerty",
      permissions: null,
    });
    service.viewQualSummary({
      id: "123",
      qualName: "test",
      status: "123",
      customerName: "qwerty",
      permissions: { featureAccess: [] },
    });
  });

  it("should call showLookup", () => {
    const res = {
      data: {
        dealId: "123",
        accountAddress: "test",
        accountName: "test",
        primaryPartnerName: "",
        accountAddressDetail: "",
        accountManager: {
          firstName: "test",
          lastName: "test",
          emailId: "test",
        },
      },
    };
    jest.spyOn(service, "getdealIdData").mockReturnValue(of(res));
    service.showLookup({
      dealId: "123",
      qualName: "test",
      customerName: "test",
      prospectKey: "test",
      permissions: {
        featureAccess: [
          { name: "qualification.edit.name" },
          { name: "proposal.edit_name" },
        ],
      },
    });
    service.toProposalSummary = true;
    service.showLookup({
      dealId: "123",
      qualName: "test",
      customerName: "test",
      prospectKey: "test",
      permissions: null,
    });
  });

  it("should call goToProposalSummary", () => {
    service.goToProposalSummary({
      id: "123",
      qualName: "test",
      status: "123",
      customerName: "qwerty",
      permissions: { featureAccess: [] },
      dealId: "123",
      prospectKey: "test",
      qualificationName: "",
      userAccessType: "",
    });
  });

  it("should call updateQualFromModal", (done) => {
    const response = {
      status: "success",
    };
    service.qualification.qualID = "123";
    const url1 =
      url + "api/qualification/" + "123" + "/workflow-immutable-parameter";
    service.updateQualFromModal({}).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("PUT");
  });

  it("should call getColumnsData", (done) => {
    const response = {
      status: "success",
    };
    const url1 = "assets/data/qualifications-list-columns.json";
    service.getColumnsData().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call getData", (done) => {
    const response = {
      status: "success",
    };
    const url1 = "assets/data/qual-list-data.json";
    service.getData().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call loccSignaturePending", () => {
    service.loaData = { document: { status: "sent" } } as any;

    service.loccSignaturePending();
  });

  it("should call uploadFile", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/proposal/" + "123" + "/upload/doc/pa-exception";
    service.uploadFile({ name: "test" }, "123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call getQualHeader", () => {
    service.loaData = { document: { status: "sent" } } as any;

    service.getQualHeader();
  });

  it("should call qualClone", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/clone-with-new-deal";
    service.qualClone(true, "123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call qualClone", (done) => {
    const response = {
      status: "success",
    };
    const url1 = url + "api/qualification/clone";
    service.qualClone(false, "123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call getSubscriptions", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 = url + "api/subscriptions/?cid=" + "123";
    service.getSubscriptions().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call goToCcwWithSubId", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 = url + "api/subscriptions/sub-ui-redirect-url/" + "123";
    service.goToCcwWithSubId("123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call SubUiExternalAPiCall", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 = url + "api/external/landing" + "123";
    service.SubUiExternalAPiCall("123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call subscriptionLookup", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 = url + "api/subscriptions/search/" + "123";
    service.subscriptionLookup("123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it("should call subscriptionLookup", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 = url + "api/subscriptions/renewal/parameters";
    service.renewalSubscription("123").subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it("should call validateChangeSubAccess", () => {
    service.appDataService.isPatnerLedFlow = true;
    service.validateChangeSubAccess();
  });

  it("should call validateChangeSubAccess", () => {
    service.appDataService.isPatnerLedFlow = false;
    jest
      .spyOn(service, "changeSubscriptionAccess")
      .mockReturnValue(
        of({ error: false, data: { changeSubscriptionAccess: true } })
      );
    service.validateChangeSubAccess();
  });

  it("should call validateChangeSubAccess", () => {
    service.appDataService.isPatnerLedFlow = false;
    jest
      .spyOn(service, "changeSubscriptionAccess")
      .mockReturnValue(of({ error: false, data: { message: "test" } }));
    service.validateChangeSubAccess();
  });

  it("should call validateChangeSubAccess", () => {
    service.appDataService.isPatnerLedFlow = false;
    jest
      .spyOn(service, "changeSubscriptionAccess")
      .mockReturnValue(of({ error: true, data: {} }));
    service.validateChangeSubAccess();
  });

  it("should call changeSubscriptionAccess", (done) => {
    const response = {
      status: "success",
    };
    service.appDataService.customerID = "123";
    const url1 =
      url + "api/subscriptions/user-role-permission?type=change_subscription";
    service.changeSubscriptionAccess().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });
});
