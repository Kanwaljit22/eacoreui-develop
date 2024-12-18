import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { TcoModelingService } from "./tco-modeling.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { HttpClient } from "@angular/common/http";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { TcoDataService } from "@app/tco/tco.data.service";

describe("TcoModelingService", () => {
  let service: TcoModelingService;
  let httpTestingController: HttpTestingController;

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
    TCO_METADATA_IDS = {
      Pricing: "Pricing",
      avgMultiSuiteDiscount: "avgMultiSuiteDiscount",
      productListPrice: "productListPrice",
      serviceListPrice: "serviceListPrice",
      averageDiscount: "averageDiscount",
      rampPurchaseAdjustment: "rampPurchaseAdjustment",
      purchaseAdjustment: "purchaseAdjustment",
      // 'markupMargin' : 'markupMargin',
      netPrice: "netPrice",
      netPriceWithPA: "netPriceWithPA",
      netPriceWithoutPA: "netPriceWithoutPA",

      partnerMarkupMargin: "partnerMarkupMargin",
      markupMargin: "markupMargin",

      trueForwardBenefits: "trueForwardBenefits",
      trueFroward: "trueFroward",

      GrowthBenefits: "GrowthBenefits",
      growth: "growth",
      timeValueMoney: "timeValueMoney",
      alaCarte1yrSku: "alaCarte1yrSku",

      operationalEfficiency: "operationalEfficiency",
      operationalEffieciency: "operationalEffieciency",
      roperationalEffieciencyName: "roperationalEffieciencyName",
      rOperations: "rOperations",
      FLEX_COST: "FLEX_COST",
      flexCost: "flexCost",

      PromotionCost: "PromotionCost",
      promotionCost: "promotionCost",
      ramp: "ramp",
      dnac: "dnac",
      dcnFreeAppliance: "dcnFreeAppliance",
      starterKit: "starterKit",
    };
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

  class MockTcoDataService {
    idNameMap = new Map();
    tcoDataObj = {
      catalogue: { outcomes: "" },
      name: { name: "" },
      prices: { businessAsUsual: { id: "test" }, name: { name: "test" } },
      id: "321",
      businessAsUsual: {
        promotionCost: { ramp: "t" },
        operationalEffieciency: 0,
        alaCarte1yrSku: { value: "" },
        trueFroward: 0,
        flexCosts: [{ value: 10, name: "test" }],
        bauValue: "test",
        netPrice: "netPrice",
        id: "netPrice",
        timeValueMoney: { percent: 10 },
        markupMargin: { type: "markupMargin", value: "markupMargin" },
        purchaseAdjustment: "purchaseAdjustment",
        averageDiscount: "averageDiscount",
        growth: { value: "growth" },
      },
      enterpriseAgreement: {
        purchaseAdjustment: "purchaseAdjustment",
        netPrice: "netPrice",
        id: "netPrice",
        markupMargin: { type: "markupMargin", value: "markupMargin" },
      },
    } as any;
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        TcoModelingService,
        HttpClient,
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: TcoDataService, useClass: MockTcoDataService },
        { provide: ConstantsService, useClass: MockConstantsService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    service = TestBed.inject(TcoModelingService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it("should call getGraphData", () => {
    service.getGraphData();
  });

  it("should call getModelingData", () => {
    service.getModelingData();
  });

  it("should call prepareModelingData", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "Pricing",
            list: [{ visible: {}, id: "avgMultiSuiteDiscount" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b1", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "productListPrice" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b1", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "serviceListPrice" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b2", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "averageDiscount" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b3", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "purchaseAdjustment" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b4", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "Pricing",
            list: [{ visible: {}, id: "rampPurchaseAdjustment" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b5", () => {
    service.prepareModelingData(
      {},
      {},
      { metadata: [{ id: "Pricing", list: [{ visible: {}, id: "netPrice" }] }] }
    );
  });

  it("should call prepareModelingData b7", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "netPriceWithPA" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b8", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          { id: "Pricing", list: [{ visible: {}, id: "netPriceWithoutPA" }] },
        ],
      }
    );
  });

  it("should call prepareModelingData b9", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "partnerMarkupMargin",
            list: [{ visible: {}, id: "markupMargin" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b10", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "trueForwardBenefits",
            list: [{ name: "test", visible: {}, id: "trueFroward" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b11", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "GrowthBenefits",
            list: [{ name: "test", visible: {}, id: "growth" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b12", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "GrowthBenefits",
            list: [{ name: "test", visible: {}, id: "timeValueMoney" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b13", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "GrowthBenefits",
            list: [{ name: "test", visible: {}, id: "alaCarte1yrSku" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b14", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "GrowthBenefits",
            list: [{ name: "test", visible: {}, id: "alaCarte1yrSku" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b15", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "operationalEfficiency",
            list: [{ name: "test", visible: {}, id: "operationalEffieciency" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b16", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "PromotionCost",
            list: [{ name: "test", visible: {}, id: "ramp" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b17", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "PromotionCost",
            list: [{ name: "test", visible: {}, id: "dnac" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b18", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "PromotionCost",
            list: [{ name: "test", visible: {}, id: "starterKit" }],
          },
        ],
      }
    );
  });

  it("should call prepareModelingData b19", () => {
    service.prepareModelingData(
      {},
      {},
      {
        metadata: [
          {
            id: "PromotionCost",
            list: [{ name: "test", visible: {}, id: "dcnFreeAppliance" }],
          },
        ],
      }
    );
  });

  it("should call getPricingObject", () => {
    service.getPricingObject()
  });

  it("should call checkValueChanged", () => {
    service.checkValueChanged({name:'test'}, 'name')
  });

  it("should call setSolutionStarter", () => {
    const tcoDataObj = {
      catalogue: { outcomes: "" },
      name: { name: "" },
      prices: { businessAsUsual: { id: "test" }, name: { name: "test" } },
      id: "321",
      businessAsUsual: {
        promotionCost: { ramp: "t" },
        operationalEffieciency: 0,
        alaCarte1yrSku: { value: "" },
        trueFroward: 0,
        flexCosts: [{ value: 10, name: "test" }],
        bauValue: "test",
        netPrice: "netPrice",
        id: "netPrice",
        timeValueMoney: { percent: 10 },
        markupMargin: { type: "markupMargin", value: "markupMargin" },
        purchaseAdjustment: "purchaseAdjustment",
        averageDiscount: "averageDiscount",
        growth: { value: "growth" },
      },
      enterpriseAgreement: {
        purchaseAdjustment: "purchaseAdjustment",
        netPrice: "netPrice",
        id: "netPrice",
        markupMargin: { type: "markupMargin", value: "markupMargin" },
      },
    } as any;

    const meta ={
      archName:'test',
      catalogue:'test',
      metadata:'test',
      list:[{id:'starterKit'}]
    }
    service.setSolutionStarter(tcoDataObj, meta)
  });

});
