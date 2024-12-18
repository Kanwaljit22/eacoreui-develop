import {
  ChangeContext,
  Options,
} from "@angular-slider/ngx-slider";
import {  CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";

import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { ServicesDiscountComponent } from "./services-discount.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";
import { ConstantsService } from "vnext/commons/services/constants.service";

const cxPeDataMock = {
  ato: "E3-DUO-MFA-SVS3",
  atoTierDesc: "Services Tier 3",
  commitNetPrice: "39,706.20",
  desiredQty: 0,
  discountDirty: undefined,
  duration: "36 Months",
  enrollmentId: 5,
  error: false,
  expand: undefined,
  hasPids: true,
  id: null,
  inclusion: true,
  installBase: undefined,
  listPrice: "21,981.60",
  maxDiscount: 100,
  migration: false,
  minDiscount: 0,
  poolName: "Zero Trust Services",
  poolSuiteLineName: "Services: Secure Access by Duo MFA",
  purchaseAdjustment: "--",
  serviceDiscount: "43.00",
  subscriptionDiscount: 43,
  total: 0,
  totalConsumedQty: 0,
  totalContractValue: "12,529.44",
  warning: false,
  weightedDisc: 0,
  cxTierOptions: [],
  tiers: [{ name: "E3-DUO-MFA-SVS3", desc: "Services Tier 3", cxOptIn: false }],
  multiProgramDesc: { msd: 0, mpd: 0, med: 0, bundleDiscount: 0 },
  commitInfo: {
    qtyThreshold: { achieved: 860, required: 1000, calculated: 1000 },
    committed: true,
    ibQtyThreshold: null,
    overrideAllowed: false,
    overrideEligible: false,
    overrideReason:
      "Requesting to change Suite Commit for a given Secure Access by Duo selected",
    threshold: undefined,
    overrideRequested: true,
    overrideState: "REQUESTED",
  },
  childs: [
    {
      ato: "E3-DUO-MFA-SVS3",
      commitNetPrice: "39,706.20",
      desiredQty: 1,
      discountDirty: false,
      enrollmentId: 5,
      expand: undefined,
      groupId: 1,
      ibQty: 0,
      id: null,
      inclusion: undefined,
      installBase: undefined,
      listPrice: "21,981.60",
      maxDiscount: 100,
      migration: false,
      minDiscount: 0,
      pidName: "E3-CX-MFA-T3SWP",
      pidType: "CX_SOLUTION_SUPPORT",
      poolName: "Zero Trust Services",
      poolSuiteLineName: "SVCS Portfolio T3 Duo MFA Premium SW Support - Cloud",
      purchaseAdjustment: "--",
      serviceDiscount: "43.00",
      supportPid: true,
      totalConsumedQty: 0,
      totalContractValue: "12,529.44",
      weightedDisc: 0,
    },
    {
      ato: "E3-DUO-MFA-SVS3",
      commitNetPrice: "--",
      desiredQty: 1,
      discountDirty: false,
      enrollmentId: 5,
      expand: undefined,
      groupId: 2,
      ibQty: 0,
      id: null,
      inclusion: undefined,
      installBase: undefined,
      listPrice: "0.00",
      maxDiscount: 100,
      migration: false,
      minDiscount: 0,
      pidName: "E3-CX-EAMSC",
      pidType: "CX_EAMS",
      poolName: "Zero Trust Services",
      poolSuiteLineName: "SVCS Portfolio EA Management Service Cisco",
      purchaseAdjustment: "--",
      serviceDiscount: "43.00",
      supportPid: true,
      totalConsumedQty: 0,
      totalContractValue: "0.00",
      weightedDisc: 0,
    },
    {
      ato: "E3-DUO-MFA-SVS3",
      commitNetPrice: "--",
      desiredQty: 0,
      discountDirty: false,
      enrollmentId: 5,
      expand: undefined,
      groupId: 2,
      ibQty: 0,
      id: null,
      inclusion: undefined,
      installBase: undefined,
      listPrice: "0.00",
      maxDiscount: 100,
      migration: false,
      minDiscount: 0,
      pidName: "E3-CX-EAMSP",
      pidType: "CX_EAMS",
      poolName: "Zero Trust Services",
      poolSuiteLineName: "SVCS Portfolio EA Management Service Partner",
      purchaseAdjustment: "--",
      serviceDiscount: 0,
      supportPid: true,
      totalConsumedQty: 0,
      totalContractValue: "0.00",
      weightedDisc: 0,
    },
  ],
};

let options: Options = {
  floor: 0,
  ceil: 100,
  step: 1,
  precisionLimit: 2, // limit to 2 decimal points
  enforceStepsArray: false, // set false to allow float values
  enforceStep: false, // set false to allow float values
  showTicks: true,
  showOuterSelectionBars: true,
  showTicksValues: true,
  ticksArray: [0, 20, 40, 60, 80, 100],
  noSwitching: true,
  onlyBindHandles: true,
};

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
};

describe("ServicesDiscountComponent", () => {
  let component: ServicesDiscountComponent;
  let fixture: ComponentFixture<ServicesDiscountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      declarations: [ServicesDiscountComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        UtilitiesService,
        LocalizationService,
        ProposalStoreService,
        PriceEstimateStoreService,
        VnextService,
        VnextStoreService,
        EaRestService,
        EaStoreService,
        CurrencyPipe,
        ConstantsService,
        DataIdConstantsService, ElementIdConstantsService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesDiscountComponent);
    component = fixture.componentInstance;
    component.cxPeData = cxPeDataMock;
    fixture.detectChanges();
  });
  afterEach(() => {
    //fixture.destroy();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set cx discounts on ngonint", () => {
    component.ngOnInit();
    expect(component.cxSuiteDiscounts.length).toBeTruthy();
  });

  it("should set cx discounts data", () => {
    let result = component.setCxDiscounts(component.cxPeData);
    expect(result.length).toBeTruthy();
    expect(result[0].minorRow.length).toBeFalsy();
    expect(result[1].discountPerTo).toBeTruthy();
  });

  it("should update slider value changed", () => {
    let changeContext: ChangeContext;
    changeContext = {
      highValue: 52,
      pointerType: 1,
      value: 0,
    };
    const setDiscountAppliedSpy = jest.spyOn(component, "setDiscountApplied");
    component.sliderChange(changeContext, component.cxSuiteDiscounts[1]);
    // expect(component.oldValue).toBeGreaterThanOrEqual(
    //   component.cxSuiteDiscounts[1].discountPerTo
    // );
    expect(setDiscountAppliedSpy).toHaveBeenCalled();
  });

  it("should set value when changes from input", fakeAsync(() => {
    const mockEevent: Event = <Event>(<any>{
      target: {
        value: "55",
      },
    });
    const setDiscountAppliedSpy = jest.spyOn(component, "setDiscountApplied");
    component.inputValueChange(mockEevent, component.cxSuiteDiscounts[1]);
    tick(1500);
    // expect(component.oldValue).toBeGreaterThanOrEqual(
    //   component.cxSuiteDiscounts[1].discountPerTo
    // );
    expect(setDiscountAppliedSpy).toHaveBeenCalled();
    flush();
  }));

  it("should checkMinValue", () => {
    let mockEevent: Event = <Event>(<any>{
      target: {
        value: "",
      },
    });
    component.checkMinValue(mockEevent, component.cxSuiteDiscounts[1]);
    expect(mockEevent.target["value"]).toBeTruthy();
  });

  it("should set selected discount", () => {
    const isValueUpdatedSpy = jest.spyOn(component, "isValueUpdated");
    component.setDiscountApplied(component.cxSuiteDiscounts[1], 55);
    expect(component.lineLevelDiscountUpdated).toBeFalsy();
    expect(isValueUpdatedSpy).toHaveBeenCalled();
  });

  it("should set selected discount", () => {
    component.isValueUpdated(component.cxSuiteDiscounts[1], 55);
    expect(component.numberOfValueUpdated).toBeTruthy();
  });

  it("should call applydiscount ", () => {
    const setReqForDiscountSpy = jest.spyOn(component, "setReqForDiscount");
    component.applyDiscount();
    expect(setReqForDiscountSpy).toHaveBeenCalled();
  });

  it("should call applydiscount ", () => {
    const request = {
      data: {
        enrollments: [
          {
            enrollmentId: component.cxPeData.enrollmentId,
            atos: [
              {
                name: component.cxPeData.ato,
                pids: [],
              },
            ],
          },
        ],
      },
    };
    component.setReqForDiscount(request);
    expect(request.data.enrollments[0].atos[0]["pids"].length).toBeFalsy();
    expect(
      request.data.enrollments[0].atos[0]["lineLevelDiscountUpdated"]
    ).toBeFalsy();
  });

  it("should close()", () => {
    expect(component.close()).toBeUndefined();
  });
  it("should sliderChange()", () => {
    let changeContext: any = { highValue: 1000, value: 300 };
    let data = { minDiscount: 2000 };
    expect(component.sliderChange(changeContext, data)).toBeUndefined();
  });

  it("should checkMinValue()", () => {
    let event = { target: { value: 20 } };
    let data = { minDiscont: 18 };
    expect(component.checkMinValue(event, data)).toBeUndefined();
  });
});
