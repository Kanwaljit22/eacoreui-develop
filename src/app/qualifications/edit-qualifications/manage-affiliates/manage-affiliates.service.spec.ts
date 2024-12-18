import { TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ManageAffiliatesService } from "./manage-affiliates.service";
import { HttpClient } from "@angular/common/http";
import { Subject, of } from "rxjs";
import { EventEmitter } from "@angular/core";
import { AppDataService } from "@app/shared/services/app.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";

describe("ManageAffiliatesService", () => {
  let service: ManageAffiliatesService;
  let httpTestingController: HttpTestingController;
  let blockUIService: BlockUiService;
  let qualificationsService;
  let messageService;
  const url = "https://localhost:4200/";

  const mockAppDataService = {
    isReload: true,
    engageCPSsubject: new Subject(),
    createQualEmitter: new EventEmitter(),
    userInfoObjectEmitter: new EventEmitter(),
    agreementDataEmitter: new EventEmitter(),
    deleteAgreementDataEmitter: new EventEmitter(),
    reloadSmartAccountEmitter: new EventEmitter(),
    userInfo: {
      userId: "123",
      distiUser: true,
      accessLevel: 0,
      authorized: false,
      partnerAuthorized: false,
    },
    findUserInfo: () => {},
    changeSmartAccountLink: () => of({}),
    get getAppDomain() {
      return url;
    },
  };

  class MockQualificationsService {
    qualification = { qualID: "123" };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
  }

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: () => {},
    };
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ManageAffiliatesService,
        HttpClient,
        { provide: AppDataService, useValue: mockAppDataService },
        { provide: QualificationsService, useValue: MockQualificationsService },
        { provide: MessageService, useValue: MockMessageService },
        { provide: BlockUiService, useValue: MockBlockUiService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(ManageAffiliatesService);
    httpTestingController = TestBed.inject(HttpTestingController);
    blockUIService = TestBed.inject(BlockUiService);
    qualificationsService = TestBed.inject(QualificationsService);
    messageService = TestBed.inject(MessageService);
  }));

  it("should call getSubsidiaryDataList", (done) => {
    const response = {
      status: "Success",
    };
    service.getSubsidiaryDataList({}).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/qualification/listSubsidiaries";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call saveAffilates", (done) => {
    const response = {
      status: "Success",
    };
    service.saveAffilates({}).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/qualification/subsidarySelection";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should call loadSubsidiaryData1", (done) => {
    const response = {
      status: "Success",
    };
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.loadSubsidiaryData1("").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = "/assets/data/subsidiaries/flat-view.json";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call loadSubsidiaryData", () => {
    sessionStorage.setItem("userInfo", JSON.stringify({ userId: "test" }));
    service.getSubsidiaryDataList = jest.fn().mockReturnValue(
      of({
        messages: [],
        error: false,
        data: [
          {
            name: "test",
            exclusion: "test",
            id: "test",
            address1: "test",
            postalCode: "",
            theaterName: "",
            subsidaries: [
              {
                name: "test",
                exclusion: "test",
                id: "test",
                address1: "test",
                postalCode: "",
                theaterName: "",
              },
            ],
          },
        ],
      })
    );
    qualificationsService.qualification = { qualID: "123" };
    service.loadSubsidiaryData("");
  });

  it("should call loadSubsidiaryData b1", () => {
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    messageService.displayMessagesFromResponse = jest.fn();
    service.getSubsidiaryDataList = jest.fn().mockReturnValue(
      of({
        messages: [1],
        error: true,
        data: [
          {
            name: "test",
            exclusion: "test",
            id: "test",
            address1: "test",
            postalCode: "",
            theaterName: "",
            subsidaries: [
              {
                name: "test",
                exclusion: "test",
                id: "test",
                address1: "test",
                postalCode: "",
                theaterName: "",
              },
            ],
          },
        ],
      })
    );
    qualificationsService.qualification = { qualID: "123" };
    service.loadSubsidiaryData("");
  });

  it("should call loadSubsidiaryData b2", () => {
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    messageService.displayMessagesFromResponse = jest.fn();
    service.getSubsidiaryDataList = jest.fn().mockReturnValue(of(null));
    qualificationsService.qualification = { qualID: "123" };
    service.loadSubsidiaryData("");
  });
  it("should call loadSubsidiaryData1", (done) => {
    const response = {
      status: "Success",
    };
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.loadSubsidiaryData1("").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = "/assets/data/subsidiaries/flat-view.json";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call getSubsidiarySummaryData", (done) => {
    const response = {
      status: "Success",
    };
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service
      .getSubsidiarySummaryData(
        { pageSize: "", page: 1 },
        "selectedpartySearch",
        { guId: 123 },
        "searchText",
        true,
        "Selected Subsidiary"
      )
      .subscribe({
        next: (res: any) => {
          done();
          expect(res.status).toBe("Success");
        },
      });
    const url1 =
      url + "api/qualification/subsidiaries/summary-view/" + "123" + "/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getSubsidiarySummaryData", () => {
    service.getSelectedSubsidairyTypeinReqObj("Selected Subsidiary", {});
    service.getSelectedSubsidairyTypeinReqObj("All Subsidiary", {});
  });

  it("should call getCountryListForSelectedRow", (done) => {
    const response = {
      status: "Success",
    };
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service
      .getCountryListForSelectedRow("Within My GU", "123", "test")
      .subscribe({
        next: (res: any) => {
          done();
          expect(res.status).toBe("Success");
        },
      });
    const url1 =
      url + "api/qualification/subsidiaries/countryData/" + "123/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getSubsidiaryDataForFlatView", (done) => {
    const response = {
      status: "Success",
    };
    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service
      .getSubsidiaryDataForFlatView(
        { pageSize: 10, page: 1 },
        { guId: 123 },
        "test",
        "test",
        true,
        "test",
        "test"
      )
      .subscribe({
        next: (res: any) => {
          done();
          expect(res.status).toBe("Success");
        },
      });
    const url1 =
      url +
      "api/qualification/subsidiaries/customer-hierarchy/" +
      "123" +
      "/" +
      "123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call saveSmartSubsidaries", (done) => {
    const response = {
      status: "Success",
    };
    const obj = {
      selectedpartySearchLabel: "test",
      isImplicitSave: "test",
      selectionType: "",
      associatedGUObj: [{ guId: 123 }],
      includedItemMap: new Map(),
      rowData: {
        excludedPartiesMap: new Map(),
        guId: "123",
      },
    } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;

    service.saveSmartSubsidaries(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/qualification/subsidiaries/saveDefineSubsidaries/123/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should call saveSmartSubsidaries b1", (done) => {
    const response = {
      status: "Success",
    };
    const obj = {
      selectedpartySearchLabel: "test",
      isImplicitSave: false,
      selectionType: "whole Customer Hierarchy",
      associatedGUObj: [{ guId: 123 }],
      includedItemMap: new Map(),
      rowData: {
        excludedPartiesMap: new Map(),
        guId: "123",
      },
    } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;

    service.saveSmartSubsidaries(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/qualification/subsidiaries/saveDefineSubsidaries/123/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should call saveSmartSubsidaries b2", (done) => {
    const response = {
      status: "Success",
    };
    service.isAdvanceSearchApplied = false;
    const obj = {
      viewContextForSaveCall: "test",
      searchString: "",
      selectedpartySearchLabel: "test",
      isImplicitSave: false,
      selectionType: "",
      associatedGUObj: [{ guId: 123 }],
      includedItemMap: new Map(),
      rowData: {
        excludedPartiesMap: new Map(),
        guId: "123",
      },
    } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;

    service.saveSmartSubsidaries(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/qualification/subsidiaries/saveDefineSubsidaries/123/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("PUT");
    req.flush(response);
  });

  it("should call prepareImplicitSaveRequest", () => {
    const reqObj = {};
    reqObj["excludedGUs"] = "";
    reqObj["excludedHQs"] = "";
    reqObj["excludedPartys"] = "";
    const excludedPartiesMap = new Map();
    excludedPartiesMap.set("test", "");
    service.prepareImplicitSaveRequest(
      reqObj,
      excludedPartiesMap,
      excludedPartiesMap,
      "NAMED_HIERARCHY_VIEW"
    );
  });

  it("should call prepareImplicitSaveRequest", () => {
    const reqObj = {};
    reqObj["excludedGUs"] = "";
    reqObj["excludedHQs"] = "";
    reqObj["excludedPartys"] = "";
    const excludedPartiesMap = [];
    excludedPartiesMap.push({
      availableCrHqCount: 5,
      availableCrBranchesCount: 5,
      availableCrHQIds: "1,2,3,4,5",
      availableCrBranchIds: "1,2,3,4,5",
    });

    service.prepareListItemsForRequest(excludedPartiesMap, [], [], [], "test");
  });

  it("should call prepareReqForHeaderBoxClicked", () => {
    const reqObj = {};
    reqObj["excludedGUs"] = "";
    reqObj["excludedHQs"] = "";
    reqObj["excludedPartys"] = "";
    const excludedPartiesMap = [];
    excludedPartiesMap.push({ nodeType: "BR" });
    excludedPartiesMap.push({ nodeType: "HQ" });
    excludedPartiesMap.push({ nodeType: "TEST" });
    excludedPartiesMap.push({
      availableCrHqCount: 5,
      availableCrBranchesCount: 5,
      availableCrHQIds: "1,2,3,4,5",
      availableCrBranchIds: "1,2,3,4,5",
    });
    service.prepareReqForHeaderBoxClicked(
      {},
      excludedPartiesMap,
      false,
      "NAMED_HIERARCHY_VIEW"
    );
    service.prepareReqForHeaderBoxClicked(
      {},
      excludedPartiesMap,
      true,
      "NAMED_HIERARCHY_VIEW"
    );
    service.prepareReqForHeaderBoxClicked(
      {},
      excludedPartiesMap,
      false,
      "TEST"
    );
    service.prepareReqForHeaderBoxClicked({}, excludedPartiesMap, true, "TEST");
  });

  it("should call saveRequestForSummaryView", () => {
    service.saveRequestForSummaryView(
      {},
      {
        availableCrHqCount: 5,
        availableCrBranchesCount: 5,
        availableCrHQIds: "1,2,3,4,5",
        availableCrBranchIds: "1,2,3,4,5",
      },
      false
    );

    service.saveRequestForSummaryView(
      {},
      {
        availableCrHqCount: 5,
        availableCrBranchesCount: 5,
        availableCrHQIds: "1,2,3,4,5",
        availableCrBranchIds: "1,2,3,4,5",
      },
      true
    );
  });

  it("should call saveRequestForFlatAndFlyoutView", () => {
    const r1 = {
      nodeType: "GU",
      guId: "123",
      availableCrHqCount: 5,
      availableCrBranchesCount: 5,
      availableCrHQIds: "1,2,3,4,5",
      availableCrBranchIds: "1,2,3,4,5",
    };
    const r2 = {
      nodeType: "HQ",
      guId: "123",
      partyId: "123",
      availableCrHqCount: 5,
      availableCrBranchesCount: 5,
      availableCrHQIds: "1,2,3,4,5",
      availableCrBranchIds: "1,2,3,4,5",
    };

    const r3 = {
      nodeType: "BR",
      guId: "123",
      partyId: "123",
      availableCrHqCount: 5,
      availableCrBranchesCount: 5,
      availableCrHQIds: "1,2,3,4,5",
      availableCrBranchIds: "1,2,3,4,5",
    };

    service.saveRequestForFlatAndFlyoutView({}, r1, false);
    service.saveRequestForFlatAndFlyoutView({}, r2, false);
    service.saveRequestForFlatAndFlyoutView({}, r3, false);
    service.saveRequestForFlatAndFlyoutView({}, r1, true);
    service.saveRequestForFlatAndFlyoutView({}, r2, true);
    service.saveRequestForFlatAndFlyoutView({}, r3, true);
  });

  it("should call saveSmartSubsidaries b1", (done) => {
    const response = {
      status: "Success",
    };
    const obj = {} as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.selectedRow.guId = "123";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = true;
    service.getFlatViewData(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url +
      "api/qualification/subsidiaries/affililates-details/" +
      "123" +
      "/" +
      "123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getFlatViewData", (done) => {
    const response = {
      status: "Success",
    };
    const obj = {} as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.selectedRow.guId = "123";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = false;
    service.getFlatViewData(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url +
      "api/qualification/subsidiaries/customer-hierarchy/" +
      "123" +
      "/" +
      service.selectedGu.guId;
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getFlatViewCountries", (done) => {
    const response = {
      status: "Success",
    };
    const obj = { partyName: "123" } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.selectedRow.guId = "123";
    service.selectedRow.subsidiaryName = "test";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = false;
    service.getFlatViewCountries(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/qualification/subsidiaries/country/" + "123" + "/" + "123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getFlatViewCountries b1", (done) => {
    const response = {
      status: "Success",
    };
    const obj = { partyName: "123" } as any;

    blockUIService.spinnerConfig = {
      startChain: jest.fn(),
      pageContainGrid: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.selectedRow.guId = "123";
    service.selectedRow.subsidiaryName = "test";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = true;
    service.getFlatViewCountries(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/qualification/subsidiaries/country/" + "123" + "/" + "123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getAffiliateDetailList", (done) => {
    const response = {
      status: "Success",
    };
    const obj = { partyId: "123", guId: "123" } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;
    service.selectedRow.guId = "123";
    service.selectedRow.subsidiaryName = "test";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = false;
    service.getAffiliateDetailList(obj).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url +
      "api/qualification/subsidiaries/affililates-under-hq/" +
      "123" +
      "/" +
      "123" +
      "/" +
      "123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call exportAffiliates", (done) => {
    const response = new Blob();
    const obj = { partyId: "123", guId: "123" } as any;

    blockUIService.spinnerConfig = {
      stopChainAfterThisCall: jest.fn(),
      unBlockUI: () => {},
    } as any;

    service.selectedRow.guId = "123";
    service.selectedRow.subsidiaryName = "test";
    service["qualService"].qualification.qualID = "123";
    service.showFlyoutView = false;
    service
      .exportAffiliates("", {}, "", "twat", { guId: "123" }, "test", true, true)
      .subscribe({
        next: (res: any) => {
          done();
          // expect(res.status).toBe("Success");
        },
      });
    const url1 =
      url +
      "api/qualification/subsidiaries/customer-hierarchy-download/" +
      service["qualService"].qualification.qualID +
      "/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });
});
