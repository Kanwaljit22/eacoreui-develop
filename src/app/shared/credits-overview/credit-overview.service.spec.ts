import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClient } from "@angular/common/http";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { CreditOverviewService } from "./credit-overview.service";

describe("CreditOverviewService", () => {
  let service: CreditOverviewService;
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        CreditOverviewService,
        { provide: AppDataService, useClass: MockAppDataService },
         {provide:ProposalDataService,useClass:MockProposalDataService},
        HttpClient
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();


    service = TestBed.inject(CreditOverviewService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should call getData', (done) => {
    const response = {
      status: "success",
    };
 
    service.getData().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  "assets/data/creditOverview.json";
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  })

  it('should call getMetaData', (done) => {
    const response = {
      status: "success",
    };
 
    service.getMetaData('test').subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url + 'api/proposal/' +'123' +  '/credit-overview/meta-data/'+'test'+ '_'+ 'test';
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  })

  
  it('should call getCreditData', (done) => {
    const response = {
      status: "success",
    };
 
    service.getCreditData('test').subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url +  'api/proposal/'+ '123' +'/credit-overview';
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  });

  it('should call initiateExceptionRequest', (done) => {
    const response = {
      status: "success",
    };
 
    service.initiateExceptionRequest().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url +  "api/proposal/" + '123' + "/initiate-exception-request?exceptionType=PURCHASE_ADJUSTMENT_REQUEST";
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  })

  it('should call submitEngagement', (done) => {
    const response = {
      status: "success",
    };
 
    service.submitEngagement({}).subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url +   'api/proposal/'+ '123' +'/initiate-pa-request'
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("POST");
  })

  it('should call showPAEngageSupport', (done) => {
    const response = {
      status: "success",
    };
 
    service.showPAEngageSupport().subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url +   'api/proposal/pa-init-status?proposalId=123';
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  });

  it('should call removePAEngageSupport', (done) => {
    const response = {
      status: "success",
    };
 
    service.removePAEngageSupport('test').subscribe((res: any) => {
      done();
      expect(res.status).toBe("success");
    });
    const url1 =  url +   'api/proposal/123/pa-request/' + 'test';
    const req = httpTestingController.expectOne(url1);
    req.flush(response);
    expect(req.request.method).toBe("GET");
  })
});
