import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClient } from "@angular/common/http";
import { LocaleService } from "./locale.service";
import { AppRestService } from "./app.rest.service";
import { MessageService } from "./message.service";
import { Router } from "@angular/router";
import { CopyLinkService } from "../copy-link/copy-link.service";
import { ConstantsService } from "./constants.service";
import { PermissionService } from "@app/permission.service";
import { of } from "rxjs";

describe("AppDataService", () => {
  let service: AppDataService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  class MockConstantsService {
    SECURITY = "test";
    QUALIFICATION = "qualification";
    PROPOSAL = "proposal";
    REQUEST_ACCESS: "req";
  }

  class MockAppRestService {
    getHeaderDetails = jest
      .fn()
      .mockReturnValue(
        of({ data: [{ column: [{ name: "CUSTOMER_ID", value: 10 }] }] })
      );
    getUserRoleDetails = jest.fn().mockReturnValue(of({ data: { roles: [] } }));
    getUserDetails = jest.fn().mockReturnValue(
      of({
        releaseNoteData: { hideReleaseNote: true },
        data: {
          partnerAuthorized: true,
          firstName: "test",
          lastName: "test",
          userId: "123",
          emailId: "test",
          authorized: "123",
          accessLevel: 1,
          partner: "test",
          userType: "test",
          distiUser: "test",
        },
      })
    );
  }
  const mockLocaleServiceValue = {
    getLocalizedString: jest
      .fn()
      .mockReturnValue({ key: "jest", value: "test" }),
    getLocalizedMessage: jest.fn().mockReturnValue("Test Error"),
  };

  const mockMessageService = {
    displayUiTechnicalError(error) {},
    displayMessagesFromResponse(res) {},
  };

  class MockCopyLinkService {
    showMessage = jest.fn();
  }

  class MockPermissionService {
    permissions = new Map();
    qualPermissions = new Map();
    isProposalPermissionPage = jest.fn();
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AppDataService,
        { provide: LocaleService, useValue: mockLocaleServiceValue },
        { provide: MessageService, useValue: mockMessageService },
        { provide: AppRestService, useClass: MockAppRestService },
        { provide: CopyLinkService, useClass: MockCopyLinkService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: PermissionService, useClass: MockPermissionService },
        Router,
        HttpClient,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(AppDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call appDomainName", () => {
    service.appDomainName;
  });

  it("should call getAppDomain", () => {
    service.getAppDomain;
  });

  it("should call findUserInfo", () => {
    jest.spyOn(service, "isAutorizedUser").mockReturnValue(true);
    const mckCall = jest.spyOn(service, "setUserInfoPermissions");
    jest.spyOn(window.sessionStorage, "setItem");
    service.findUserInfo();
    expect(mckCall).toBeCalled();
  });

  it("should call ngOnInit", () => {
    service.ngOnInit();
  });

  it("should call setMessageObject", () => {
    service.setMessageObject("test", "test");
    service.messageArray = [{ text: "test" }];
    service.setMessageObject("test", "test");
  });

  it("should call getProposalStartDateTimeLimit", () => {
    jest
      .spyOn(service, "getProposalStartDateTime")
      .mockReturnValue(of({ value: "test" }));
    service.getProposalStartDateTimeLimit();
  });

  it("should call getProposalStartDateTime", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain +
      "api/resource/ALLOWED_CCW_REQUESTED_START_DATE_RANGE";
    service.getProposalStartDateTime().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getInvalidEmail", () => {
    jest
      .spyOn(service, "getInvalidEmailDomain")
      .mockReturnValue(of({ value: "test" }));
    service.getInvalidEmail();
    service.invalidDomains = [1];
    service.getInvalidEmail();
  });

  it("should call getInvalidEmailDomain", (done) => {
    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/resource/INVALID_EMAIL_DOMAINS";
    service.getInvalidEmailDomain().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getInvalidEmailDomain", (done) => {
    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/resource/INVALID_EMAIL_DOMAINS";
    service.getInvalidEmailDomain().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getContentTraceID", (done) => {
    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/sales-connect/setup/123";
    service.getContentTraceID("123").subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call redirectForCreateQualification", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain + "api/resource/" + service.REDIRECT_FOR_CREATE_QUAL;
    service.redirectForCreateQualification().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call cleanCoreAuthorizationCheck", (done) => {
    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/prospect/clean-core/eligible-check";
    service.cleanCoreAuthorizationCheck().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call cleanCoreRedirect", () => {
    const http = TestBed.inject(HttpClient);
    jest
      .spyOn(http, "get")
      .mockReturnValue(
        of({
          redirectUrl: "yesy",
          data: { punhoutUrl: "test", cleanCoreReques: "test" },
        })
      );
    service.cleanCoreRedirect("123");
    expect(http.get).toBeCalled();
  });

  it("should call getSFDCUrl", (done) => {
    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/resource/SFDC_URL";
    service.getSFDCUrl().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getSFDCUrl", () => {
    const userData = {
      partnerAuthorized: true,
      firstName: "test",
      lastName: "test",
      userId: "123",
      emailId: "test",
      authorized: "123",
      accessLevel: 1,
      partner: "test",
      userType: "test",
      distiUser: "test",
    };
    service.setUserInfoPermissions(userData);
  });

  it("should call getUserInfo", () => {
    service.getUserInfo();
  });

  it("should call userId", () => {
    service.userId;
  });

  it("should call checkDecimalValue", () => {
    service["checkDecimalValue"](10);
  });

  it("should call prettifyNumber", () => {
    service.prettifyNumber(-1);
    service.prettifyNumber(10);
    service.prettifyNumber(10000);
    service.prettifyNumber(1000000 + 1);
    service.prettifyNumber(1000000000 + 1);
    service.prettifyNumber(1000000000000 + 1);
  });

  it("should call removeSpecialCharacters", () => {
    service.removeSpecialCharacters("test");
  });

  it("should call showActivityLogIcon", () => {
    service.showActivityLogIcon(false);
    service.activityLogPermission = true;
    service.showActivityLogIcon(true);
  });

  it("should call getDetailsMetaData", () => {
    const res = {
      data: [{ name: "ALL", modules: [{ name: "test" }, { name: "ALL" }] }],
    };
    jest.spyOn(service, "setMetaData").mockReturnValue(of(res));
    service.getDetailsMetaData("test");
    service.getDetailsMetaData("ALL");
  });

  it("should call getHeaderData", () => {
    jest
      .spyOn(service, "getDetailsMetaData")
      .mockReturnValue({ displayName: "test", columns: [{ hideColumn: "Y" }] });
    service.getHeaderData({});
  });

  it("should call isPageConextCorrect", () => {
    service.pageContext = "test";
    service.isPageConextCorrect("test");
  });

  it("should call assignColumnWidth", () => {
    service.assignColumnWidth("XS");
    service.assignColumnWidth("S");
    service.assignColumnWidth("M");
    service.assignColumnWidth("L");
    service.assignColumnWidth("XL");
  });

  it("should call getUserDetailsFromSession", () => {
    service.getUserDetailsFromSession();
  });

  it("should call setMetaData", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain + "api/dashboard/getArchitecture?archName=ALL";
    service.setMetaData().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call requestAccessForProposalOrQual", () => {
    const response = {
      status: "Success",
    };
    service.userInfo = { userId: "123" };
    const uri =
      service.getAppDomain +
      "api/" +
      "qualification" +
      "/authorization/read-write?q=" +
      "123" +
      "&u=" +
      "123";
    service.requestAccessForProposalOrQual("qualification", "123");
    console.log(uri);
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call setMetaData", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain + "api/dashboard/getArchitecture?archName=ALL";
    service.setMetaData().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call requestAccessForProposalOrQual b1", () => {
    const response = {
      status: "Success",
    };
    service.userInfo = { userId: "123" };
    const uri =
      service.getAppDomain +
      "api/" +
      "proposal" +
      "/authorization/read-write?p=" +
      "123" +
      "&u=" +
      "123";
    service.requestAccessForProposalOrQual("proposal", "123");
    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call requestUserAccess", () => {
    const http = TestBed.inject(HttpClient);
    jest.spyOn(http, "get").mockReturnValue(of({ error: false }));
    service.userInfo = { userId: "123" };
    const uri = service.getAppDomain + "api/home/users/authorization?u=123";
    service.requestUserAccess();
  });

  it("should call getSessionDataForSummaryPage", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain + "api/session/info?" + "test" + "=" + "123";
    service
      .getSessionDataForSummaryPage("test", "123")
      .subscribe((response: any) => {
        expect(response.status).toBe("Success");
        done();
      });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call isAutorizedUser", () => {
    const userData = {
      partnerAuthorized: false,
      authorized: false,
      firstName: "test",
      lastName: "test",
      userId: "123",
      emailId: "test",
      accessLevel: 1,
      partner: "test",
      userType: "test",
      distiUser: "test",
    };
    service.isAutorizedUser(userData);
  });

  it("should call getTeamMembers", (done) => {
    service.ciscoTeamMembers = true;
    service.getTeamMembers().subscribe((params) => {
      expect(params).toBe(true);
      done();
    });
  });

  it("should call getTeamMembers b1", (done) => {
    service.ciscoTeamMembers = false;

    const response = {
      status: "Success",
    };

    const uri = service.getAppDomain + "api/lookup/contacts?t=123";
    service.getTeamMembers("123").subscribe((params) => {
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call createUniqueId", () => {
    service.ciscoTeamMembers = true;
    service.createUniqueId(123, "test");
    service.createUniqueId("test", "");
  });

  it("should call updateCrossArchitectureProposalStatusforHeader", () => {
    service.subHeaderData.subHeaderVal = [].fill(1,0,10);
    service.subHeaderData.subHeaderVal[6]={test:'test'}
    service.subHeaderData.subHeaderVal[8]=[{status:'test',architecture_code:'test'}]
    service.archName='test';
    service.updateCrossArchitectureProposalStatusforHeader("test");
  });

  it("should call setActiveClassValue", () => {
    service.setActiveClassValue();
  });


  
  it("should call validateResponse", () => {
    const response = {
      error:false,
      data:{ test:'test'}
    }
    service.validateResponse(response);
    response.error=true;
    service.validateResponse(response);
  });

  it("should call getShowOrHideChangeSubscription", () => {
    jest.spyOn(service,'showOrHideChangeSubscription').mockReturnValue(of({value:'Y'}))
    service.getShowOrHideChangeSubscription();
  });

  it("should call getShowOrHideChangeSubscription b1", () => {
    jest.spyOn(service,'showOrHideChangeSubscription').mockReturnValue(of({error:true,value:'Y'}))
    service.getShowOrHideChangeSubscription();
  });

  it("should call showOrHideChangeSubscription", (done) => {
    const response = {
      status: "Success",
    };

    const uri =
      service.getAppDomain + 'api/resource/SHOW_CHANGE_SUBSCRIPTION';
    service
      .showOrHideChangeSubscription()
      .subscribe((response: any) => {
        expect(response.status).toBe("Success");
        done();
      });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call isTwoTierUser", () => {
    service.userInfo.accessLevel =3;
    service.isTwoTierUser(true);
    service.isTwoTierUser(false);
  });

  it("should call isTwoTUserUsingDistiDeal", () => {
    service.isTwoTUserUsingDistiDeal(true,true);
    service.isTwoTUserUsingDistiDeal(false,false);
  });

  it("should call isDistiNotIntiated", () => {
    service.userInfo.distiUser=true
    service.isDistiNotIntiated()
    service.isDistiNotIntiated(true)
  });

  it("should call isDistiWithTransfferedControl", () => {
    service.userInfo.distiUser=true
    service.isDistiWithTransfferedControl(true)
    service.isDistiWithTransfferedControl(false)
  });

  it("should call changeSmartAccountLink", (done) => {
    const response = {
      status: "Success",
    };
    const uri =
      service.getAppDomain +`api/prospect/agreement/smartAccountActive`;
    service
      .changeSmartAccountLink({smartAccountId:'2',active:'true' })
      .subscribe((response: any) => {
        expect(response.status).toBe("Success");
        done();
      });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });
});
