import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
// import { DocumentCenterComponent } from "./document-center.component"
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { Subject, of } from "rxjs";
import { LocaleService } from "@app/shared/services/locale.service";
// import { DocumentCenterService } from "./document-center.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { PermissionService } from "@app/permission.service";
import { BreadcrumbsService } from "@app/core/breadcrumbs/breadcrumbs.service";
import { CreateProposalComponent } from "./create-proposal.component";
import { ActivatedRoute, Router } from "@angular/router";
import { CreateProposalService } from "./create-proposal.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { ProposalDataService } from "../proposal.data.service";
import { ListProposalService } from "../list-proposal/list-proposal.service";
import { NgbDropdownModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProposalArchitectureService } from "@app/shared/proposal-architecture/proposal-architecture.service";
import { ProposalSummaryService } from "../edit-proposal/proposal-summary/proposal-summary.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { DatePipe } from "@angular/common";
import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { FormControl, FormGroup } from "@angular/forms";

describe("CreateProposalComponent", () => {
  let component: CreateProposalComponent;
  let fixture: ComponentFixture<CreateProposalComponent>;
  const url = "https://localhost:4200/";

  const mockLocaleServiceValue = {
    getLocalizedMessage: jest.fn().mockReturnValue("test"),
    getLocalizedString: jest
      .fn()
      .mockReturnValue({ key: "jest", value: "test" }),
  };

  class MockQualificationsService {
    prepareSubHeaderObject = jest.fn();
    getQualHeader = jest.fn().mockReturnValue(
      of({
        data: {
          changeSubscriptionDeal: true,
          subscription: { billingModel: "test", endDate: new Date() },
          subRefId: "123",
          partnerDeal: "test",
        },
      })
    );
    qualification = { qualID: "123", name: "test" };
    loaData = { partnerBeGeoId: "123", customerGuId: "123" };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
  }

  class MockProposalDataService {
    checkAndSetPartnerId = jest.fn();
    updateSessionProposal = jest.fn();
    validateBillingModel = jest.fn();
    proposalDataObject = {
      proposalId: "123",
      proposalData: { billingModelID: "123" },
    };
    billingErrorEmitter = new EventEmitter();
  }

  class MockAppDataService {
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
  }

  class MockCreateProposalService {
    getEaStartDate = jest.fn().mockReturnValue(of({
        data: new Date().toDateString()
    }))
    getPriceList= jest.fn().mockReturnValue(of({

        data:[
            {
                description:'',
                name:'test',
                currencyCode:'US',
                priceListId:'123'
            }
        ]
    }));
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
    getCountryOfTransactions = jest.fn().mockReturnValue(of({}));
    maxAndDefaultStartDate = jest.fn().mockReturnValue(of({
        data:[new Date().toDateString(), new Date().toDateString()]
    }));
    getBillingModelDetails = jest.fn().mockReturnValue(of({}));
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

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }

  const mockMessageService = {
    displayUiTechnicalError(error) {},
    displayMessagesFromResponse(res) {},
  };

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

  const MockListProposalService = { prepareSubHeaderObject: jest.fn() };

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

  class MockProposalSummaryService {
    getPurchaseOptionsDataForSelectedPartner = jest.fn();
    getPurchaseOptionsData = jest.fn();
  }
  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }

  class MockEaStoreService {}

  class MockActivatedRoute {}

  class MockEaService {
    features = { PARAMETER_ENCRYPTION: true };
    data ={id:'test'}
    test:any = ''
    tst:any = ''
    updateUserEvent(data, test,tst){}
  }

  class MockNgbModal {}
  class MockRouter {
    url = "proposal/test";
    navigate = jest.fn();
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProposalComponent],
      providers: [
        { provide: LocaleService, useValue: mockLocaleServiceValue },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: CreateProposalService, useClass: MockCreateProposalService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: ListProposalService, useValue: MockListProposalService },
        { provide: NgbModal, useClass: MockNgbModal },
        Renderer2,
        {
          provide: ProposalArchitectureService,
          useClass: MockProposalArchitectureService,
        },
        {
          provide: ProposalSummaryService,
          useClass: MockProposalSummaryService,
        },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: EaStoreService, useClass: MockEaStoreService },
        { provide: EaService, useClass: MockEaService },
        DatePipe,
      ],
      imports: [HttpClientTestingModule, NgbDropdownModule, BsDatepickerModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sliderElement = { update: jest.fn() } as any;
  });

  it("should call ngOnInit", () => {
    const qualService = fixture.debugElement.injector.get(
      QualificationsService
    );
    qualService.qualification.qualID = "";
    component.appDataService.isPatnerLedFlow = true;
    component.appDataService.displayChangeSub = true;
    qualService.qualification.name = "test";
    qualService.subRefID = "test";
    component.partnerLedFlow = false;
    component.pratners = [{ partnerIdSystem: "twst", dealIdSystem: "test" }];
    component.ngOnInit();
    component.proposalDataService.billingErrorEmitter.emit(true);
  });

  it("should call architectureNameChangedHandler", () => {
    component.mspQuestionSelected = false;
    component.selectedBillingModel = "Annual Billing";
    component.sliderElement = { update: jest.fn() } as any;
    component.architectureNameChangedHandler("C1_DNA");
  });

  it("should call architectureNameChangedHandler  b1", () => {
    component.mspQuestionSelected = true;
    component.selectedBillingModel = "Annual Billing";
    component.sliderElement = { update: jest.fn() } as any;
    component.architectureNameChangedHandler("C1_DNA");
  });

  it("should call architectureNameChangedHandler b2", () => {
    component.mspQuestionSelected = false;
    component.selectedBillingModel = "test";
    component.sliderElement = { update: jest.fn() } as any;
    component.architectureNameChangedHandler("C1_DNA");
  });

  it("should call checkIfMSPPartner", () => {
    component.selectedPartner = {
      partnerIdSystem: "test",
      dealIdSystem: "test",
      name: "test",
      partnerId: 123,
    };
    component.checkIfMSPPartner("C1_DNA");
  });

  it("should call checkIfMSPPartner b1", () => {
    const createProp = fixture.debugElement.injector.get(CreateProposalService);
    jest
      .spyOn(component.createProposalService, "checkIfMSPPartner")
      .mockReturnValue(of({ error: false, data: { eligibleArchs: null } }));
    component.selectedPartner = {
      partnerIdSystem: "test",
      dealIdSystem: "test",
      name: "test",
      partnerId: 123,
    };
    component.checkIfMSPPartner("C1_DNA");
  });

  it("should call billingChanged", () => {
    component.mspQuestionSelected = false;
    component.selectedBillingModel = "test";
    component.sliderElement = { update: jest.fn() } as any;
    component.archName = "C1_DNA";
    component.myDropBillingsearch = { close: jest.fn() } as any;
    component.billingChanged({ displayName: "Annual Billing" });
  });

  it("should call billingChanged", () => {
    component.mspQuestionSelected = false;
    component.selectedBillingModel = "test";
    component.sliderElement = { update: jest.fn() } as any;
    component.archName = "C1_DNA";
    component.myDropBillingsearch = { close: jest.fn() } as any;
    component.billingChanged({ displayName: "Annual" });
  });

  it("should call billingChanged", fakeAsync(() => {
    component.mspQuestionSelected = true;
    component.selectedBillingModel = "test";
    component.myDropBillingsearch = { close: jest.fn() } as any;
    component.sliderElement = { update: jest.fn() } as any;
    component.archName = "C1_DNA";
    component.billingChanged({ displayName: "Annual Billing" });
    tick();
  }));

  it("should call resetBilling", () => {
    component.billingModels = [
      {
        identifier: "test",
      },
    ];
    component.resetBilling();
  });

  it("should call resetMSPBilling", () => {
    component.resetMSPBilling();
  });

  it("should call selectedMSP", () => {
    component.selectedMSP(true);
    component.selectedMSP(false);
  });

  it("should call checkDurationsSelected", fakeAsync(() => {
    component.durationTypes.MONTHS60 = 60;
    component.durationTypes.MONTHS36 = 36;
    component.durationTypes.MONTHSCUSTOM = "custom";
    component.durationTypes.MONTHSCOTERM = "coterm";

    component.checkDurationsSelected({ target: { value: 60 } });
    component.checkDurationsSelected({ target: { value: 36 } });
    component.checkDurationsSelected({ target: { value: "custom" } });
    component.checkDurationsSelected({ target: { value: "coterm" } });
    component.checkDurationsSelected({ target: { value: "test" } });

    tick();
  }));

  it("should call validateAllFormFields", () => {
    component.validateAllFormFields({
      controls: { name: "test" },
      get: jest.fn().mockReturnValue(new FormControl()),
    } as any);
    component.validateAllFormFields({
      controls: { name: "test" },
      get: jest.fn().mockReturnValue(new FormGroup({})),
    } as any);
  });

  it("should call getSlider", () => {
    const res = component.getSlider();
    res.onChange({} as any);
    res.onFinish({} as any);
    res.onStart({} as any);
    res.onUpdate({} as any);
  });

  it("should call check84MonthsDurationForDC", () => {
    component.archName = "C1_DC";
    component.check84MonthsDurationForDC(100);
  });

  it("should call onCOTChange", fakeAsync(() => {
    component.myDropCountrysearch = { close: jest.fn() } as any;
    component.onCOTChange({ countryName: "test", isoCountryAlpha2: "test" });
    tick();
  }));

  it("should call check84MonthsDurationForDC", () => {
    component.archName = "C1_DC";
    component.check84MonthsDurationForDC(100);
  });

  it("should call onPriceListChange", fakeAsync(() => {
    component.selectedPriceListName = "C1_DC";
    component.myDropPricesearch = { close: jest.fn() } as any;
    component.onPriceListChange({
      description: "title",
      name: "test",
      priceListId: "123",
      currencyCode: "DS",
    });
    tick();
  }));

  it("should call selectSubscription", () => {
    component.selectSubscription("deselect");
  });

  it("should call roundSliderValueToYear", () => {
    component.roundSliderValueToYear(15);
  });

  it("should call getTitleWithButton", () => {
    component.archName = "SEC";
    const result = component.getTitleWithButton();
    component.selectedBillingModel = "test";
    component.selectedPriceListName = "test";
    component.selectedPrimaryPartnerName = "test";
    component.myForm.get("proposalName").setValue("test");
    component.selectedCountryCode = "BU";
    component.priceListArray = [{ name: "test" }];
    component.proposalDataService.invalidBillingModel = false;
    component.displayEndDateErrorMsg = false;
    component.displayDurationMsg = false;
    component.json = { data: { questionnaire: "", questionnaireUpdate: "" } };
    result.buttons.forEach((element) => {
      element.click();
    });
  });

  it("should call getTitleWithButton b1", () => {
    component.archName = "SEC";
    const result = component.getTitleWithButton();
    component.selectedBillingModel = "";
    component.selectedPriceListName = "";
    component.selectedPrimaryPartnerName = "";
    component.myForm.get("proposalName").setValue("");
    component.selectedCountryCode = "";
    component.priceListArray = [{ name: "test" }];
    component.proposalDataService.invalidBillingModel = false;
    component.displayEndDateErrorMsg = false;
    component.displayDurationMsg = false;
    component.eaTerm.setValue(70);
    component.json = {
      data: { questionnaire: "", questionnaireUpdate: "", mspPartner: "tst" },
    };
    result.buttons.forEach((element) => {
      element.click();
    });
  });

  it("should call reset", () => {
    component.priceListArray = [{ name: "test" }];
    component.pratners = [];
    component.reset();
  });

  it("should call create b1", () => {
    component.archName = "SEC";
    component.priceListArray = [{ name: "test" }];
    component.selectedBillingModel = "test";
    component.selectedPriceListName = "test";
    component.selectedPrimaryPartnerName = "test";
    component.myForm.get("proposalName").setValue("test");
    component.selectedCountryCode = "test";
    component.proposalDataService.proposalDataObject.proposalId = null;
    component.json = {
      data: {
        questionnaire: "",
        questionnaireUpdate: "",
        mspPartner: "tst",
        demoProposal: "test",
      },
    };
    component.create();
  });

  it("should call create", () => {
    component.priceListArray = [{ name: "test" }];
    component.create();
  });

  it("should call addContacts", () => {
    const promise = new Promise((res, rej) => {
      res({ setData: "" });
    });
    component["modalVar"] = {
      open: jest.fn().mockReturnValue({ result: promise }),
    } as any;
    component.addContacts();
  });

  it("should call deleteSelectedPatner", () => {
    component.selectedPartners = [{ cecId: "123" } as any];
    component.deleteSelectedPatner({ cecId: "123" } as any);
  });

  it("should call clearAllSelectedPartner", () => {
    component.clearAllSelectedPartner();
  });

  it("should call deleteUser", () => {
    component.partnerList.setValue([{ cecId: "123" } as any]);
    component.deleteUser({ cecId: "123" } as any);
  });

  it("should call getUserAsObservable", () => {
    component.allUsers = [
      {
        name: "testing",
        email: "test",
        cecId: "123",
      },
    ];
    component.selectedPartners = [{ cecId: "123" } as any];
    component.getUserAsObservable("testing" as any);
  });

  it("should call changeTypeaheadLoading", () => {
    component.changeTypeaheadLoading(false);
  });

  it("should call typeaheadOnSelect", () => {
    component.typeaheadOnSelect({ item: "test" } as any);
  });

  it("should call addPatner", () => {
    component.addPatner({ item: "test" } as any);
  });

  it("should call addPartner", fakeAsync(() => {
    component.myDropsearch = { close: jest.fn() } as any;
    component.addPartner({
      name: "test",
      partnerId: "test",
      dealIdSystem: "123",
      partnerIdSystem: "test",
    } as any);
    tick();
  }));

  it("should call getPriceList", () => {
    component.getPriceList();
  });

  it("should call getEaMaxStartDate", () => {
    component.getEaMaxStartDate();
  });

  it("should call getEaStartDate", () => {
    component.getEaStartDate();
  });

  it("should call billingOpen", () => {
    component.billingModels=[{ identifier:''}]
    component.billingOpen();
  });
});
