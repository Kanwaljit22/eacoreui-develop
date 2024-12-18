import { TestBed, waitForAsync } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AppDataService } from "@app/shared/services/app.data.service";
import { PriceEstimationService } from "./price-estimation.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { EaService } from "ea/ea.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

describe("PriceEstimationService", () => {
  let service: PriceEstimationService;
  let httpTestingController: HttpTestingController;
  let appDataService;
  const url = "https://localhost:4200/";

  class MockAppDataService {
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };
  }
  class MockProposalDataService {
    proposalDataObject = {
      proposalData: {
        proposalId: "123",
        groupName: "test",
        linkedProposalsList: [{ architecture_code: "test" }],
      },
      status: "test",
    };
  }
  class MockCreateProposalService {
    mspPartner = true;
    eligibleArchs = [];
    prepareSubHeaderObject = jest.fn().mockReturnValue(of({}));
    getProposalHeaderData = jest.fn().mockReturnValue(of({}));
    proposalArchQnaEmitter = new EventEmitter();
  }
  class MockConstantsService {
    TOKEY_COLOUMN_MAPPING=new Map()
    CURRENCY = "test";
    DNA = "test";
    SECURITY = "test";
    TCO_METADATA_IDS = { markupMargin: "markupMargin" as string } as any;
    TCO_MARGIN = "test";
  }
  class MockLocaleService {
    getLocalizedString() {
      return "test";
    }
  }
  class MockEaService {}
  const mockMessageService = {
    displayMessages(e) {},
    displayUiTechnicalError(error) {},
    displayMessagesFromResponse(res) {},
  };
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        PriceEstimationService,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: CreateProposalService, useClass: MockCreateProposalService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: EaService, useClass: MockEaService },
        Router,
        HttpClient,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
    service = TestBed.inject(PriceEstimationService);
    appDataService = TestBed.inject(AppDataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call getPurchaseAdjustmentPermit", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    service.getPurchaseAdjustmentPermit().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/123/pa-permitted";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call getRowData", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.getRowData().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/priceEstimate?p=123" + "&u=123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call getRowData2", (done) => {
    const response = {
      status: "Success",
    };
    service.getRowData2().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = "assets/data/proposal/priceEstimation.json";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call getDiscounts", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.getDiscounts().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/discounts?p=123" + "&u=123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call calculateTcv", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.calculateTcv().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/tcv/calculate?p=123" + "&u=123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call loadPriceEstimate", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.loadPriceEstimate("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/price-estimate/" + "123?c=testtest";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call loadPriceEstimate b1", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.loadPriceEstimate(false, true).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url + "api/proposal/price-estimate/" + "123" + "?c=test" + "&fqb=true";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call calculateTco", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.calculateTco().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/tco/calculate";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call saveDiscount", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.saveDiscount("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/tcv/suites/discount?p=123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call sendIbaReport", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.sendIbaReport("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/report/proposal-ib";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call sendTcvReport", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    service.sendTcvReport("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/report/tco-comparison";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getCustomerIBReport", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.getCustomerIBReport("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/report/booking-report";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call getCustomerIBReport b1", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.getCustomerIBReport("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/report/ib-summary";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call convertToSliderObj", () => {
    service.convertToSliderObj({
      Min: "",
      Max: "",
      Selected: "",
      test: "",
    });
  });

  it("should call postEaQty", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.postEaQty("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/qty?p=123" + "&u=123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call convertToSliderObj", () => {
    const arr = [
      {
        children: [
          {
            lineItemType: "",
          },
        ],
      },
    ];
    service.totalAddonForWireless = 123;
    service.isPremierForWirelessZero = true;
    service.createEaQtyList(arr);
  });

  it("should call convertToSliderObj b1", () => {
    const arr = [
      {
        children: [
          {
            lineItemType: "",
          },
        ],
      },
    ];
    appDataService.archName = "test";
    service.totalAddonForWireless = 123;
    service.isPremierForWirelessZero = true;
    service.createEaQtyList(arr);
  });

  it("should call prepareLineItemForRecalculateCall", () => {
    const obj = {
      ibAdvantageBfLbEaQty: "t",
      lineItemDescription: "t",
      advantageGfEaQty: "test",
      suiteId: 14,
      lineItemId: "124",
      lineItemUpdated: "123",
      eaQuantity: "123",
      ibAdvantageBf4Qty: "test",
      ibAdvantageBf5Qty: "test",
      ibAdvantageBf6Qty: "test",
      ibAdvantageBfC1EaQty: "test",
      ibAdvantageBfEaQty: "test",
      ibAdvantageGfEaQty: "test",
      advancedEaQty: "test",
      foundationEaQty: "test",
      advantageEaQty: "test",
      ecsEaQty: "test",
      essentialsEaQty: "test",
      dnaAdvantageEaQty: "test",
      advantageBfC1EaQty: "test",
      advantageBfLbEaQty: "test",
      advantageBfEaQty: "test",
      dnaPremierEaQty: "test",
      premierBfC1EaQty: "test",
      premierBfLbEaQty: "test",
      premierBfEaQty: "test",
      premierGfEaQty: "test",
      advancedAddonEaQty: "test",
      controllerEaQty: "test",
      dcSubscriptionEaQty: "test",
      advantageBf4Qty: "test",
      advantageBf5Qty: "test",
      advantageBf6Qty: "test",
      premierBf4Qty: "test",
      premierBf5Qty: "test",
      premierBf6Qty: "test",
    };
    service.prepareLineItemForRecalculateCall(obj);
  });

  it("should call saveEaQuantity", () => {
    jest
      .spyOn(service, "postEaQty")
      .mockReturnValue(of({ messages: [1], error: false }));
    service.saveEaQuantity({ value: "test", column: { getColId: () => {} } });
  });

  it("should call recalculateAll", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.recalculateAll("test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 =
      url +
      "api/proposal/tcv/re-calculation/" +
      "123" +
      "?c=" +
      "test" +
      "&frp=true";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call config", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.config("test", "test").subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/configPunchOut/123";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call recalculatePrice", () => {
    jest
      .spyOn(service, "recalculateAll")
      .mockReturnValue(of({ messages: [1], error: false }));
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.recalculatePrice(() => {});
  });

  it("should call restorePA", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test1";
    service.restorePA().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + "api/proposal/" + "123" + "/restore-negative-tcv-pa";
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call prepareMessageMapForGrid", () => {
    const param = {
      messages: [],
      hasError: "tt",
      childs: {
        test: {
          childs: [
            {
              messages: [{ lineLevel: "test", severity: "ERROR" }],
              hasError: "",
            },
          ],
          hasError: "",
          messages: [{ lineLevel: "test", severity: "ERROR" }],
        },
      },
    };
    service.prepareMessageMapForGrid(param);
  });

  it("should call prepareTokenMap", () => {
    service.prepareTokenMap('test', [{name:'test'}] ,'test');
  });

  it("should call prepareArrayObjectForTab", () => {
    const lineItem = {
        advantageBfC1EaQtyEditable:'test',
        advantageBfLbEaQtyEditable:'test',
        advantageBfEaQtyEditable:'test',
        advantageGfEaQtyEditable:'test',
        premierBfC1EaQtyEditable:'test',
        premierBfLbEaQtyEditable:'test',
        premierBfEaQtyEditable:'test',
        premierGfEaQtyEditable:'test',
        advancedAddonEaQtyEditable:'test',
        controllerEaQtyEditable:'test',
        foundationEaQtyEditable:'test',
        advantageEaQtyEditable:'test',
        essentialsEaQtyEditable:'test',
        ecsEaQtyEditable:'test',
        eaQuantityEditable:'test'
    }
    service.prepareArrayObjectForTab(lineItem,[]);
  });

  it("should call getColumnDefs", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.getColumnDefs().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + 'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/price-estimate-metadata?archName=' +appDataService.archName;
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call exportProposal", (done) => {
    let response = new Blob();
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.exportProposal().subscribe({
      next: (res: any) => {
        done();
        // expect(res.status).toBe("Success");
      },
    });
    const url1 = url + 'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/price-estimate/export'
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call paInitStatus", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.paInitStatus().subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url +'api/proposal/pa-init-status?proposalId=' + service.proposalDataService.proposalDataObject.proposalId
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });


  it("should call requestForPa", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.requestForPa('test').subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url +'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/pa-request/' + 'test'
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call msdSuiteCountSubmit", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.msdSuiteCountSubmit(true, 'test').subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url +'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/override/msd-suite-count?o=true&ov=' + 'test';
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });

  it("should call msdSuiteCountSubmit b1", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.msdSuiteCountSubmit(false, 'test').subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url + 'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/override/msd-suite-count?o=false'
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("GET");
    req.flush(response);
  });


  it("should call rampDiscount", (done) => {
    const response = {
      status: "Success",
    };
    service.proposalDataService.proposalDataObject.proposalId = "123";
    appDataService.userId = "123";
    appDataService.archName = "test";
    service.rampDiscount({} as any).subscribe({
      next: (res: any) => {
        done();
        expect(res.status).toBe("Success");
      },
    });
    const url1 = url  + 'api/proposal/' + service.proposalDataService.proposalDataObject.proposalId + '/rampCreditChange'
    const req = httpTestingController.expectOne(url1);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it("should call prepareGroupsForSecurity", () => {
    const suites = [{suiteId:'123',lineItems:[{suiteId:'123',lineItemId:'test',productTypeId:2, groupName:'test', eaQuantity:1, }]}]
    const map = new Map();
    map.set('test-2-123',[])
    service.prepareGroupsForSecurity(suites,map ,[], map);
  });

});
