import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClient } from "@angular/common/http";
import { SalesReadinessService } from "./sales-readiness.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { MessageService } from "@app/shared/services/message.service";
import { of } from "rxjs";

fdescribe("SalesReadinessService", () => {
  let service: SalesReadinessService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";

  class MockAppDataService {
    subHeaderData={favFlag:false,moduleName:'test',subHeaderVal:''}
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    archName = "test";
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };
  }

  class MockProposalDataService {
    proposalDataObject = {
        proposalData:{     
             desc:'',
        name:'',
        eaTermInMonths:'',
        billingModel:'',
        priceList:'',
        eaStartDateStr:'',
        eaStartDateFormed:'',
        status:''},
      proposalId: "123",

    };
  }
  class MockConstantsService {
    SECURITY = "test";
  }

  class MockQualificationsService {}
  class MockMessageService {}
 class MockActivatedRoute{}

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        SalesReadinessService,
        { provide: AppDataService, useClass: MockAppDataService },
        HttpClient,
        Router,
        {provide:ActivatedRoute, useClass:MockActivatedRoute},
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: MessageService, useClass: MockMessageService },
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();


    service = TestBed.inject(SalesReadinessService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('jndj', () => {
    expect(2).toBe(2)
  })

  it("should call getSalesReadinessData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + "api/proposal/" + "123" + "/salesReadiness";
    service.getSalesReadinessData("123").subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);

  });

  it("should call validatePartnerAuthorization", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/' + '123' + '/salesReadiness';
    service.validatePartnerAuthorization({proposalId:'123'}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);

  });

  it("should call getSalesReadinessData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url +  'api/proposal/header';
    service.getProposalHeaderData({proposalId:'123'}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);

  });

  it("should call getComplianceHoldData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url +  'api/proposal/compliance-hold-data?p=123' ;
    service.getComplianceHoldData('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);

  });

 it("should call postComplianceHoldData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url +  'api/proposal/compliance-hold-manual-release' ;
    service.postComplianceHoldData('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);

  });

 it("should call prepareSubHeaderObject", () => {
    const res = {data:{
        name:'test',
        eaStartDateStr:'test',
        eaTermInMonths:'',
        priceList:'',
        billingModel:'',
        status:'',
        desc:'',
    }}
    jest.spyOn(service, 'getProposalHeaderData').mockReturnValue(of(res))
    service.prepareSubHeaderObject('test', true, {})

  });
  it("should call prepareSubHeaderObject b1", () => {
    const res = {data:{
        name:'test',
        eaStartDateStr:'test',
        eaTermInMonths:'',
        priceList:'',
        billingModel:'',
        status:'',
        desc:'',
    }}
    jest.spyOn(service, 'getProposalHeaderData').mockReturnValue(of(res))
    service.prepareSubHeaderObject('test', true, {})

  });




it("should call postComplianceHoldData", () => {
    const res = {data:{
        name:'test',
        eaStartDateStr:'test',
        eaTermInMonths:'',
        priceList:'',
        billingModel:'',
        status:'',
        desc:'',
    }}
    jest.spyOn(service, 'getProposalHeaderData').mockReturnValue(of(res))
    service.prepareSubHeaderObject('test', false, {})

  });




});
