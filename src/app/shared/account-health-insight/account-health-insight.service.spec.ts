import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { HttpClient } from "@angular/common/http";
import { AccountHealthInsighService } from "./account.health.insight.service";

describe("AccountHealthInsighService", () => {
  let service: AccountHealthInsighService;
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



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountHealthInsighService,
        { provide: AppDataService, useClass: MockAppDataService },
        HttpClient
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();


    service = TestBed.inject(AccountHealthInsighService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));


  it("should call getSalesReadinessData", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/prospect/renewal';
    service.getRenewaldata("ALL",'test').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);

  });



});
