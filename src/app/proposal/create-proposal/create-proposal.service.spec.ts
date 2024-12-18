import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClient } from "@angular/common/http";
import { CreateProposalService } from "./create-proposal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalDataService } from "../proposal.data.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { MessageService } from "@app/shared/services/message.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { PermissionService } from "@app/permission.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";

describe("CreateProposalService", () => {
  let service: CreateProposalService;
  let httpTestingController: HttpTestingController;
  const url = "https://localhost:4200/";
  class MockAppDataService {
    tcoData= new EventEmitter();
    headerDataLoaded= new EventEmitter();
    includedPartialIbEmitter = new EventEmitter()
    followonType ;
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
    subHeaderData={favFlag:'test', moduleName :'test',subHeaderVal:[]} 
  }

  class MockProposalDataService {
    checkAndSetPartnerId=jest.fn()
    proposalDataObject = {
      proposalId: "123",
      proposalData:{
        mspPartner:true
      }
    };
  }
  class MockConstantsService {
    SECURITY = "test";
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }

  class MockQualificationsService {
    qualification = { qualID: '123' };
    loaData={partnerBeGeoId:'123',customerGuId:'123' }
    viewQualSummary(data) { }
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() { return of({}) }
}

class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  class MockTcoDataService {
    getTcoSummaryData=jest.fn()
    tcoId = "123";
    catalogueMetaData;
    tcoMetaData = {};
    prepareGraph1 = jest.fn();
    tcoDataObj = {
      catalogue:{outcomes:''},
      name: { name: "" },
      prices: { name: { name: "test" } },
      id: "321",
      businessAsUsual: {bauValue:'test',  'netPrice':0,id: 'netPrice',markupMargin: { type: "MARGIN" } },
      enterpriseAgreement: {id:'netPrice', 'netPrice':0, markupMargin: { type: "MARGIN" } },
    } as any;
  }

  class MockPermissionService {
    qualPermissions = new Map();
    isProposalPermissionPage = jest.fn();
    permissions = new Map();
  }

  class MockUtilitiesService {
    changeMessage = jest.fn();
    checkDecimalOrIntegerValue = jest.fn().mockReturnValue(10);
    formatWithNoDecimalForDashboard = jest.fn().mockReturnValue(0);
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

  class MockActivatedRoute{

  }


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateProposalService,
        { provide: AppDataService, useClass: MockAppDataService },
        HttpClient,
        Router,
        {provide:ActivatedRoute, useClass:MockActivatedRoute},
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: TcoDataService, useClass: MockTcoDataService },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: UtilitiesService, useClass: MockUtilitiesService }
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    service = TestBed.inject(CreateProposalService);
    //   appDataService = TestBed.inject(AppDataService)
    httpTestingController = TestBed.inject(HttpTestingController);
    service.proposalId = "123";
  }));

  it("should call getPriceList", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/priceList?qualId=123';
    service.getPriceList('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getEaStartDate", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url +  'api/proposal/max-allowed-start-date';
    service.getEaStartDate().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call isPurchaseAdjustmentChanged", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url +  'api/proposal/' +'123' + '/adjusted';
    service.isPurchaseAdjustmentChanged('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getBillingModelDetails", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/billingmodel-metadata?p=123';
    service.getBillingModelDetails('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getBillingModelDetails b1", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/billingmodel-metadata';
    service.getBillingModelDetails().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getCountryOfTransactions", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/countries?qualId=123';
    service.getCountryOfTransactions('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getCotermAllowed", (done) => {
    const response = {
      status: "Success",
    };

    const uri = url + 'api/proposal/co-term-allowed';
    service.getCotermAllowed().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getSubscriptionList", (done) => {
    const response = {
      status: "Success",
    };
    service.qualService.qualification.qualID='123'
    const uri = url + 'api/subscriptions?qid='+service.qualService.qualification.qualID+ '&type=co-term';
    service.getSubscriptionList().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call subscriptionLookup", (done) => {
    const response = {
      status: "Success",
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url + 'api/subscriptions/search/'+ '123' + '?cid=' + service['appDataService'].customerID + '&qid=' + service.qualService.qualification.qualID + '&type=RENEWAL';
    service.subscriptionLookup('123', false,true).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call subscriptionLookup b1", (done) => {
    const response = {
      status: "Success",
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url + 'api/subscriptions/search/'+ '123' +'?cid=' + service['appDataService'].customerID + '&type=change-sub';
    service.subscriptionLookup('123', { name :'test' },true).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call subscriptionLookup b2", (done) => {
    const response = {
      status: "Success",
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url + 'api/subscriptions/search/'+ '123' + '?cid=' + service['appDataService'].customerID + '&qid=' + service.qualService.qualification.qualID + '&type=co-term'
    service.subscriptionLookup('123', false , false).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call durationMonths", (done) => {
    const response = {
      status: "Success",
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url + 'api/proposal/duration?q='+ service.qualService.qualification.qualID + '&s=' + '123' + '&e=' + '123';
    service.durationMonths('123', '123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });


  it("should call checkIfMSPPartner", (done) => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url + 'api/partner/msp?dealId=' +'123' + '&partnerId=' + '123';
    service.checkIfMSPPartner('123', '123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call createProposal", (done) => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url +  'api/proposal/save';
    service.createProposal({test:'test'}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });

  it("should call createProposal", (done) => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url +  'api/proposal/save';
    service.createProposal({}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });

  it("should call getProposalHeaderData", (done) => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    const uri = url +  'api/proposal/header';
    service.getProposalHeaderData({}).subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("POST");
    req.flush(response);
  });

  it("should call prepareSubHeaderObject", () => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    service['appDataService'].tcoFlow=true;
    jest.spyOn(service, 'getProposalHeaderData').mockReturnValue(of({
        data:{
            partnerPurchaseAuthorized:true,
            nonTransactionalRelatedSoftwareProposal:true,
            noOfMandatorySuitesRequired:0,
            hasLegacySuites:true,
            noOfExceptionSuitesRequired:0,
            partnerDeal:true,
            permissions:{featureAccess:[{name:'test'}]},
            buyMethodDisti:true,
            currencyCode:'US',
            prospectKey:'test',
            includedPartialIB:'',
            renewal:true,
            followonType:'test',
            demoProposal:'',
            mspPartner:true,
            hasLinkedProposal :true,
            linkedProposals:[{
                status :'complete',
                architecture_code :'test'

            }]

        }
    }))
    service.prepareSubHeaderObject('test', true, {});
  });

  it("should call prepareSubHeaderObject", () => {
    const response = {
      status: "Success"
    };
    service.qualService.qualification.qualID='123';
    service['appDataService'].customerID = '123';
    service['appDataService'].tcoFlow=true;
    jest.spyOn(service,'getProposalHeaderData').mockReturnValue(of({
        data:{
            eaStartDate:'test',
            eaStartDateDdMmmYyyyStr:''

        }
    }))

    service.updateHeaderStartDate();
  });

  
  it("should call allow84MonthTerm", () => {
    service.allow84MonthTerm([22]);
    service.allow84MonthTerm([17]);
  });

  it("should call loCCSignedCheck", () => {
    service.loCCSignedCheck({data:{loccSigned:true,loccInitiated:false}});
    service.loCCSignedCheck({data:{loccSigned:false, loccInitiated:false}});
    service.loCCSignedCheck({data:{loccSigned:false, loccInitiated:true}});
  });

  it("should call updateProposalStatus", () => {
    jest.spyOn(service,'createProposal').mockReturnValue(of({
        data:{test:''}
    }))
    service.updateProposalStatus();
  });

  it("should call partnerAPI", (done) => {
    const response = {
      status: "Success"
    };
    const uri = url +  'api/proposal/partners?q=123';
    service.partnerAPI('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

  it("should call getPartnerForProposal", (done) => {
    const response = {
      status: "Success"
    };
    const uri = url + 'api/proposal/partner?p=123';
    service.getPartnerForProposal('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });


  it("should call checkCxReasonCode", () => {
    service.checkCxReasonCode('test');
  });

  it("should call checkCustomDurationWarning", () => {
    service.checkCustomDurationWarning('test');
    service.checkCustomDurationWarning(33);
  });

  it("should call checkCustomDurationForGreaterThan60", () => {
    service.checkCustomDurationForGreaterThan60('test');
    service.checkCustomDurationForGreaterThan60(101);
  });


  it("should call getPartnerForProposal", (done) => {
    const response = {
      status: "Success"
    };
    service.proposalDataService.proposalDataObject.proposalId='123';
    const uri = url + 'api/proposal/'+ service.proposalDataService.proposalDataObject.proposalId +'/workflow-immutable-parameter';
    service.updateProposalFromModal('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("PUT");
    req.flush(response);
  });


  it("should call maxAndDefaultStartDate", (done) => {
    const response = {
      status: "Success"
    };
    service.proposalDataService.proposalDataObject.proposalId='123';
    const uri = url + 'api/proposal/max-and-default-start-date?p='+ '123';
    service.maxAndDefaultStartDate('123').subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });


  it("should call maxAndDefaultStartDate", (done) => {
    const response = {
      status: "Success"
    };
    service.proposalDataService.proposalDataObject.proposalId='123';
    const uri = url + 'api/proposal/max-and-default-start-date';
    service.maxAndDefaultStartDate().subscribe((response: any) => {
      expect(response.status).toBe("Success");
      done();
    });

    const req = httpTestingController.expectOne(uri);
    expect(req.request.method).toEqual("GET");
    req.flush(response);
  });

});
