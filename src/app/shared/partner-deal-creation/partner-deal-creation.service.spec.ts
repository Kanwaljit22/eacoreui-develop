import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClient } from "@angular/common/http";
import { Subject, of } from "rxjs";
import { PartnerDealCreationService } from "./partner-deal-creation.service";
import { EventEmitter } from "@angular/core";
import { QualificationsService } from "@app/qualifications/qualifications.service";

describe("PartnerDealCreationService", () => {
  let service: PartnerDealCreationService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  class MockAppDataService {
    redirectForCreateQualification(...a) {
      return of({});
    }
    cleanCoreAuthorizationCheck() {
      return of({ data: { eligible: true } });
    }

    setSessionObject = jest.fn();
    isTwoTUserUsingDistiDeal = jest.fn();
    createUniqueId = jest.fn();
    engageCPSsubject = new Subject();
    getSessionObject = jest.fn().mockReturnValue({
      qualificationData: { qualID: "123", name: "test" },
      userInfo: { firstName: "test", lastName: "test" },
      tcoDataObj: { id: "123" },
    });
    custNameEmitter = new EventEmitter();
    changeSubPermissionEmitter = new EventEmitter();
    showActivityLogIcon = jest.fn();
    userId = "123";
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };

    subHeaderData = { moduleName: "test" };

    getDetailsMetaData(...args) {
      return {};
    }
  }

  class MockQualificationsService {
    partnerDealLookUpEmitter = new EventEmitter();
    prepareSubHeaderObject(...a) {}
    dealData = { dealId: 123 };
    qualification = { dealId: "123", qualID: "123" };
    loaData = { partnerBeGeoId: "123", customerGuId: "123", partnerDeal: true };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
    loaCustomerContactUpdateEmitter = new EventEmitter();
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        PartnerDealCreationService,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        HttpClient,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(PartnerDealCreationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call getLOCCData", () => {
    service.getLOCCData();
  });

  it("should call getLOCCData b1", () => {
    service.appDataService.myDealQualCreateFlow = true;
    service.getLOCCData();
  });

  it("should call getLOA", () => {
    service.getLOA("test");
  });

  it("should call getLOA", () => {
    const response = {
        status: "Success",
      };
  
    service.appDataService.isSubUiFlow = true;
    service.getLOA("test").subscribe((res:any) => {
        expect(res.status).toBe("Success")
    });

    const uri = service.appDataService.getAppDomain + 'api/external/landing' + 'test';
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call loccLandingApiCall", () => {
    const response = {
      status: "Success",
    };

    service.loccLandingApiCall("123", "123").subscribe((res:any) => {
        expect(res.status).toBe("Success")
    });
    const uri = service.appDataService.getAppDomain + 'api/partner/locc-landing?did=' + '123' + '&qid=' + '123'
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call unsignedLOA", () => {
    service.unsignedLOA("test");
  });

  it("should call getLOAData", () => {
    service.getLOAData("test");
  });

  it("should call uploadAdditionalDoc", () => {
    service.uploadAdditionalDoc("test","test");
  });

  it("should call downloadUnsignedDoc", () => {
    service.downloadUnsignedDoc("test");
  });

  it("should call initiateDocusign", () => {
    service.initiateDocusign("test");
  });

  //   it("should call getProposalStartDateTime", (done) => {
  //     const response = {
  //       status: "Success",
  //     };

  //     const uri =
  //       service.getAppDomain +
  //       "api/resource/ALLOWED_CCW_REQUESTED_START_DATE_RANGE";
  //     service.getProposalStartDateTime().subscribe((response: any) => {
  //       expect(response.status).toBe("Success");
  //       done();
  //     });

  //     const req = httpTestingController.expectOne(uri);
  //     expect(req.request.method).toEqual("GET");
  //     req.flush(response);
  //   });
});
