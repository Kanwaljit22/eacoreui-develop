import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";

import { ProposalParametersComponent } from "./proposal-parameters.component";
import { LocaleService } from "../services/locale.service";
import { AppDataService } from "../services/app.data.service";
import { RenewalSubscriptionService } from "@app/renewal-subscription/renewal-subscription.service";
import { MessageService } from "../services/message.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ConstantsService } from "../services/constants.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { Subject, of } from "rxjs";
import { EventEmitter, Renderer2 } from "@angular/core";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { PermissionService } from "@app/permission.service";
import { BlockUiService } from "../services/block.ui.service";
import { ProposalSummaryService } from "@app/proposal/edit-proposal/proposal-summary/proposal-summary.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UtilitiesService } from "../services/utilities.service";
import { ProposalArchitectureService } from "../proposal-architecture/proposal-architecture.service";
import { ListProposalService } from "@app/proposal/list-proposal/list-proposal.service";
import { AppRestService } from "../services/app.rest.service";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormControl, FormGroup } from "@angular/forms";

describe("ProposalParametersComponent", () => {
  let component: ProposalParametersComponent;
  let fixture: ComponentFixture<ProposalParametersComponent>;

  class MockLocaleService {
    getLocalizedString(value) {}
    getLocalizedMessage() {
      return "test";
    }
  }

  class MockAppDataService {
    displayChangeSub = true;
    createUniqueId = jest.fn();
    changeSubPermissionEmitter = new EventEmitter();
    engageCPSsubject = new Subject();
    subHeaderData = { moduleName: "test" };
    getSessionObject = jest
      .fn()
      .mockReturnValue({
        isPatnerLedFlow: true,
        partnerDeal: { test: "" },
        qualificationData: { qualID: "", name: "test" },
      });
    showActivityLogIcon = jest.fn();
    custNameEmitter = new EventEmitter();
    userId = "123";
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return "";
    }
    userInfo = {
      userId: "123",
    };
  }

  class MockRenewalSubscriptionService {
    saveRenewalParametersEmitter = new EventEmitter();
    selectSubsriptionReponse = {
      type: "",
      requestedStartDate: "01/01/2023",
      subscriptionRefIds: ["123"],
    };
  }
  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockProposalDataService {
    proposalDataObject = { proposalData: { groupName: "test" } };
    billingErrorEmitter = new EventEmitter();
    validateBillingModel = jest.fn();
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
    ON_TIME_FOLLOWON = "ON_TIME_FOLLOWON";
  }

  class MockQualificationsService {
    prepareSubHeaderObject = jest.fn();
    qualification = { qualID: "", name: "test" };
    getQualHeader = jest.fn().mockReturnValue(
      of({
        data: {
          changeSubscriptionDeal: true,
          subscription: { subId: "123", billingModel: "Annaul Billing" },
          subRefId: "123",
        },
      })
    );
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
  }

  class MockCreateProposalService {
    proposalArchQnaEmitter = new EventEmitter();
    callCreateOrResetProposalParamsEmitter = new EventEmitter();
    getEaStartDate = jest.fn().mockReturnValue(
      of({
        data: new Date().toDateString(),
      })
    );
    getPriceList = jest.fn().mockReturnValue(
      of({
        data: [
          {
            defaultPriceList: true,
            description: "",
            name: "test",
            currencyCode: "US",
            priceListId: "123",
          },
        ],
      })
    );
    checkCxReasonCode = jest.fn();
    mspPartner = true;
    isMSPSelected = true;
    createProposal = jest.fn().mockReturnValue(
      of({
        data: {
          id: "123",
          archName: "test",
          partnerDeal: "test",
          permissions: {
            featureAccess: [{ name: "test" }],
            cxEligible: "test",
          },
        },
      })
    );
    getSubscriptionList = jest.fn().mockReturnValue(of({}));
    durationMonths = jest.fn().mockReturnValue(of({}));
    checkCustomDurationWarning = jest.fn().mockReturnValue(of({}));
    getCotermAllowed = jest.fn().mockReturnValue(of({}));
    checkIfMSPPartner = jest.fn().mockReturnValue(
      of({
        data: {
          eligibleArchs: "test",
        },
      })
    );
    getCountryOfTransactions = jest.fn().mockReturnValue(
      of({
        countries: [
          {
            isoCountryAlpha2: "US",
            countryName: "USA",
          },
        ],
        defaultCountry: "US",
      })
    );
    maxAndDefaultStartDate = jest.fn().mockReturnValue(
      of({
        data: [new Date().toDateString()],
      })
    );
    getBillingModelDetails = jest.fn().mockReturnValue(
      of({
        data: { billingModellov: [] },
      })
    );
    partnerAPI = jest.fn().mockReturnValue(
      of({
        data: [
          {
            name: "test",
            partnerId: "123",
            partnerIdSystem: "twst",
            dealIdSystem: "test",
            subRefID: "123",
            changeSubscriptionDeal: true,
            subscription: { billingModel: "test", endDate: new Date() },
          },
        ],
      })
    );
  }

  class MockPermissionService {
    qualPermissions = new Map();
    isProposalPermissionPage = jest.fn();
    permissions = new Map();
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }

  class MockProposalSummaryService {
    getPurchaseOptionsDataForSelectedPartner = jest.fn();
    getPurchaseOptionsData = jest.fn();
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

  class MockProposalArchitectureService {
    _finalQuestionnaireRequest = {};
    setFinalQuestionnaireRequest = jest.fn();
    checkIsAllMandatoryQuestionnaireAreAnsweredForCreate = jest
      .fn()
      .mockReturnValue(true);
    getQuestionnaireForProposalId = jest
      .fn()
      .mockReturnValue(of({ error: false, data: { test: "" } }));
    createPageResetEmitter = new EventEmitter();
    makeFinalObjectForEditQuestionnaire = jest.fn();
    architectureListObject = {
      isParentQuestion: false,
      answers: [
        {
          defaultSelected: true,
          parentId: "test",
          name: "SEC",
          selected: "",
          questionnaire: {},
        },
      ],
    };
    getProposalArchitectures = jest
      .fn()
      .mockReturnValue(of(this.architectureListObject));
    questions = [
      { answers: [{ id: "test", selected: "", description: "test" }] },
    ];
    getArchitectureDataNew = jest
      .fn()
      .mockReturnValue(of({ error: false, data: { test: "" } }));
    getArchitectureData = jest
      .fn()
      .mockReturnValue(of({ error: false, data: { test: "" } }));
    isToEnableUpdateButton = jest
      .fn()
      .mockReturnValue(of({ error: false, data: { test: "" } }));
    getArchQuestionsforParentIds = jest
      .fn()
      .mockReturnValue(of(this.questions));
  }

  class MockAppRestService {
    getSubscriptionList = jest.fn().mockReturnValue(
      of({
        data: [
          {
            subscriptionId: "123",
          },
        ],
      })
    );
  }
  class MockActivatedRoute {}

  class MockNgbModal {}

  class MockListProposalService {
    prepareSubHeaderObject = jest.fn();
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalParametersComponent],
      providers: [
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: AppDataService, useClass: MockAppDataService },
        {
          provide: RenewalSubscriptionService,
          useClass: MockRenewalSubscriptionService,
        },
        { provide: MessageService, useClass: MockMessageService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: CreateProposalService, useClass: MockCreateProposalService },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: BlockUiService, useClass: MockBlockUiService },
        {
          provide: ProposalSummaryService,
          useClass: MockProposalSummaryService,
        },
        Router,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        DatePipe,
        { provide: NgbModal, useClass: MockNgbModal },
        Renderer2,
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        {
          provide: ProposalArchitectureService,
          useClass: MockProposalArchitectureService,
        },
        { provide: ListProposalService, useClass: MockListProposalService },
        { provide: AppRestService, useClass: MockAppRestService },
      ],
      imports: [BsDatepickerModule, NgbModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalParametersComponent);
    component = fixture.componentInstance;
    component.sliderElement = {
      update: jest.fn(),
      min: 12,
      max: 60,
      grid: true,
      grid_num: 4,
      step: 1,
    } as any;
    jest
      .spyOn(component["datepipe"], "transform")
      .mockReturnValue(Date.toString());
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit b1", () => {
    component.flow = "renewal";
    component.isRenewalFlow = true;
    component.ngOnInit();
    expect(component).toBeTruthy();
    component.createProposalService.proposalArchQnaEmitter.emit({
      nonMSPBillingError: true,
      isArchNameSelected: true,
      selectedMSPAnswer: true,
    });
    component.renewalSubscriptionService.saveRenewalParametersEmitter.emit();
    component.createProposalService.callCreateOrResetProposalParamsEmitter.emit(
      { checkedDemoProposal: true }
    );
    component.createProposalService.callCreateOrResetProposalParamsEmitter.emit(
      { checkedDemoProposal: false, create: true }
    );
    component.createProposalService.callCreateOrResetProposalParamsEmitter.emit(
      { checkedDemoProposal: false, create: false, reset: true }
    );
  });

  it("should call architectureNameChangedHandler", () => {
    component.mspQuestionSelected = false;
    component.selectedBillingModel = "Annual Billing";
    component.architectureNameChangedHandler("C1_DNA");
    component.architectureNameChangedHandler("C1_DNA1");
    expect(component).toBeTruthy();
  });

  it("should call resetBilling", () => {
    component.billingModels = [{ identifier: "test" }];
    component.resetBilling();
    expect(component).toBeTruthy();
  });

  it("should call getEaMaxStartDate", () => {
    jest
      .spyOn(component.createProposalService, "maxAndDefaultStartDate")
      .mockReturnValue(of({ data: {} }));
    component.getEaMaxStartDate();
    expect(component).toBeTruthy();
  });

  it("should call getEaMaxStartDate", () => {
    jest
      .spyOn(component.createProposalService, "maxAndDefaultStartDate")
      .mockReturnValue(of({ data: {} }));
    component.getEaMaxStartDate();
    expect(component).toBeTruthy();
  });

  it("should call getBillingModelDetails", () => {
    component.getBillingModelDetails();
    expect(component).toBeTruthy();
  });

  it("should call getBillingModelDetails", () => {
    component.partnerLedFlow = false;
    component.priceList = [
      {
        defaultPriceList: true,
        currencyCode: "US",
        name: "test",
        priceListId: "123",
      },
    ] as any;
    component.getCountryOfTransactions();
    expect(component).toBeTruthy();
  });

  it("should call getBillingModelDetails", () => {
    const service = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(service, "checkIfMSPPartner").mockReturnValue(
      of({
        data: {
          eligibleArchs: false,
        },
      })
    );
    component.checkIfMSPPartner(true);
    expect(component).toBeTruthy();
  });

  it("should call resetMSPBilling", () => {
    component.resetMSPBilling();
    expect(component.showMSPBillingError).toBeTruthy();
  });

  it("should call selectSubscription", () => {
    jest
      .spyOn(component["datepipe"], "transform")
      .mockReturnValue(Date.toString());
    component.selectSubscription("deselect");
    component.selectSubscription("select");
    expect(component.displayEndDateErrorMsg).toBeFalsy();
  });

  it("should call getUserAsObservable", (done) => {
    const observable = component.getUserAsObservable("test");
    observable.subscribe((res: any) => {
      done();
    });
  });

  it("should call getSlider", () => {
    component.allowSevenYrTerm = true;
    const res = component.getSlider();
    res.onUpdate({ from: "test" } as any);
    res.onStart({ from: "test" } as any);
    res.onChange({ from: "test" } as any);
    res.onFinish({ from: "test" } as any);
  });

  it("should call onDateSelection", () => {
    component.referenceSubscriptionId = "123";
    component.showEndDate = true;
    const date = new Date();
    component.onDateSelection(date);
    component.onDateSelection(date.getTime() - 1000 * 60 * 60 * 24 /*1 Day*/);
    component.todaysDate = date;
    component.onDateSelection(date.getTime());
    component.eaStartDate.setErrors({ incorrect: true });
    component.onDateSelection("test");
  });

  it("should call billingChanged", fakeAsync(() => {
    Object.defineProperty(component, "myDropBillingsearch", {
      value: { close: jest.fn() },
    });
    component.billingChanged({ displayName: "Annual Billing" });
    component.billingChanged({ displayName: "Annual" });
    component.renewalFlowHasDNA = true;
    component.billingChanged({ displayName: "Annual Billing" });
    tick();
  }));

  it("should call onCOTChange", fakeAsync(() => {
    Object.defineProperty(component, "myDropCountrysearch", {
      value: { close: jest.fn() },
    });
    component.onCOTChange({ countryName: "test", isoCountryAlpha2: "test" });
    tick();
  }));

  it("should call onPriceListChange", fakeAsync(() => {
    Object.defineProperty(component, "myDropPricesearch", {
      value: { close: jest.fn() },
    });
    component.onPriceListChange({ description: "test", name: "test" });
    tick();
  }));

  it("should call billingOpen", () => {
    component.createProposalService.selectedArchitecture = "C1_DNA";
    component.createProposalService.mspPartner = true;
    component.createProposalService.isMSPSelected = true;
    component.billingModels = [
      {
        identifier: "Test",
      },
    ];
    component.billingOpen();
  });

  it("should call setDefaultValuesForRenewals", () => {
    component.pratners = [];
    component.selectedBillingModel = "Annual Billing";
    component.renewalFlowHasDNA = true;
    component.renewalSubscriptionService.selectSubsriptionReponse.eaTermInMonths =
      "YES";
    component.renewalSubscriptionService.selectSubsriptionReponse.billingModel =
      "Annual Billing";
    component.setDefaultValuesForRenewals({
      partner: { partnerId: "123", name: "test" },
      priceList: {
        description: "test",
        name: "test",
        priceListId: "123",
        currencyCode: "test",
      },
    });
  });

  it("should call validateAllFormFields", () => {
    const formGrp = new FormGroup({
      name: new FormControl(""),
      address: new FormGroup({
        street: new FormControl(""),
      }),
    });
    component.validateAllFormFields(formGrp);
    expect(component).toBeTruthy();
  });

  it("should call getQualHeaderData", () => {
    jest
      .spyOn(component["datepipe"], "transform")
      .mockReturnValue(Date.toString());
    component.appDataService.displayChangeSub = true;
    component.getQualHeaderData();
    expect(component).toBeTruthy();
  });

  it("should call getQualHeaderData", () => {
    jest
      .spyOn(component["datepipe"], "transform")
      .mockReturnValue(Date.toString());
    component.appDataService.displayChangeSub = false;
    jest.spyOn(component.qualService, "getQualHeader").mockReturnValue(
      of({
        data: { changeSubscriptionDeal: false, subscription: {} },
      })
    );
    component.getQualHeaderData();
    expect(component).toBeTruthy();
  });

  it("should call getQualHeaderData", fakeAsync(() => {
    component.checkDurationsSelected({ target: { value: "MONTHS36" } });
    component.checkDurationsSelected({ target: { value: "MONTHS60" } });
    component.checkDurationsSelected({ target: { value: "MONTHSCUSTOM" } });
    component.checkDurationsSelected({ target: { value: "MONTHSCOTERM" } });
    tick();
    expect(component).toBeTruthy();
  }));

  it("should call getSubscriptionsList", () => {
    component.getSubscriptionsList();
    component.isRenewalFlow = true;
    component.getSubscriptionsList();
    expect(component).toBeTruthy();
  });

  it("should call setSubscriptionListForRenewal", () => {
    component.setSubscriptionListForRenewal(
      [{ subscriptionId: "123" }],
      ["123"]
    );
    expect(component).toBeTruthy();
  });

  it("should call keyUp", () => {
    Object.defineProperty(component, "myDropCountrysearch", {
      value: { close: jest.fn() },
    });
    component.keyUp({ keyCode: 13, stopPropagation: jest.fn() });
    expect(component).toBeTruthy();
  });

  it("should call keyDown", () => {
    event = { preventDefault: jest.fn() } as any;
    Object.defineProperty(component, "myDropCountrysearch", {
      value: { close: jest.fn() },
    });
    jest.spyOn(component.eaTerm.valueChanges, "pipe").mockReturnValue(of(12));

    component.keyDown({
      keyCode: 16,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(component).toBeTruthy();
  });

  it("should call keyDown", () => {
    jest
      .spyOn(component["renderer"], "selectRootElement")
      .mockReturnValue({ focus: jest.fn() });
    component.focusProposalInput("test");
    expect(component).toBeTruthy();
  });

  it("should call keyDown", () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.lookupSubscriptionModal();
  });

  it("should call onPriceListChange", fakeAsync(() => {
    Object.defineProperty(component, "myDropsearch", {
      value: { close: jest.fn() },
    });
    component.addPartner({ partnerId: "123", name: "test" });
    tick();
  }));

  it("should call keyDown", () => {
    component.isChangeSubFlow = false;
    component.reset();
  });
});
