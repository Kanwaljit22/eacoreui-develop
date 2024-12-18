import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CpsComponent } from "./cps.component";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { LocaleService } from "../services/locale.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { GuideMeService } from "../guide-me/guide-me.service";
import { MessageService } from "../services/message.service";
import { EventEmitter, Renderer2 } from "@angular/core";
import { of } from "rxjs";
import { AppDataService } from "../services/app.data.service";
import { ConstantsService } from "../services/constants.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CreditOverviewService } from "../credits-overview/credit-overview.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CpsService } from "./cps.service";
import { EngageSupportComponent } from "@app/modal/engage-support/engage-support.component";
import { BlockUiService } from "../services/block.ui.service";

describe("CpsComponent", () => {
  let component: CpsComponent;
  let fixture: ComponentFixture<CpsComponent>;
  const url = "https://localhost:4200/";

  class MockQualificationsService {
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }

    qualification={qualID:'123'};
  }
  const mockLocaleServiceValue = {
    getLocalizedString: jest
      .fn()
      .mockReturnValue({ key: "jest", value: "test" }),
  };
  class MockProposalDataService {
    proposalDataObject = {
      proposalData: {
        groupName: "test",
        linkedProposalsList: [{ architecture_code: "test" }],
      },
      status: "test",
    };
  }

  class MockGuideMeService {}

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockAppDataService {
    readonly emailValidationRegx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,20})+$/;
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
    };

    pageContext = 'QualificationDefineSubsidiaryStep';
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }

  class MockCreditOverviewService {
    submitEngagement = jest.fn().mockReturnValue(of({ data: { test: "" } }));
    initiateExceptionRequest = jest
      .fn()
      .mockReturnValue(of({ data: { test: "" } }));
    resetFilter = new EventEmitter();
    showPAEngageSupport = jest.fn().mockReturnValue(of({}));
    getCreditData = jest
      .fn()
      .mockReturnValue(
        of({
          data: {
            page: { noOfRecords: 12, currentPage: 1, pageSize: 10 },
            creditOverviews: [{ test: "" }],
          },
        })
      );
    getMetaData = jest
      .fn()
      .mockReturnValue(
        of({
          data: {
            columnData: [
              {
                children: [
                  {
                    headerClass: "",
                    cellClass: "",
                    cellRenderer: "t",
                    field: "t",
                    suppressMovable: "",
                  },
                ],
                cellRenderer: "t",
                field: "t",
              },
            ],
            leftSideFilters: "",
            topSideFilters: "",
            identifierData: "",
          },
        })
      );
    manageColumnEmitter = new EventEmitter();
    removePAEngageSupport = jest.fn().mockReturnValue(of({}));
  }

  class MockCpsService{
    getCaseList =jest.fn().mockReturnValue(of({
      data:[]
    }))
    submitPricingCase = jest.fn().mockReturnValue(of({
      subject:'test'
    }))
    submitCase =jest.fn().mockReturnValue(of({
      subject:'test'
    }))
    getCpsData = jest.fn().mockReturnValue(of({
        caseClosed:true,
        id:'123',
        subject:'test',
        pegaRequestId:0
    }))
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CpsComponent,EngageSupportComponent],
      providers: [
        { provide: CpsService, useClass: MockCpsService },
        { provide: LocaleService, useValue: mockLocaleServiceValue },
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: GuideMeService, useClass: MockGuideMeService },
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: CreditOverviewService, useClass: MockCreditOverviewService },
        NgbModal,
        Renderer2,
        { provide: MessageService, useClass: MockMessageService },
        BlockUiService
      ],
      imports: [HttpClientTestingModule],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy()
  });

  it('should call ngOnInit', () => {
    component.ngOnInit();
  });

  it('should call resetValue', () => {
    component.resetValue();
  });



  it('should call showContent', () => {
    component.oldUCRMCase=true;

    const cpsService = fixture.debugElement.injector.get(CpsService)
    cpsService.getCpsData = jest.fn().mockReturnValue(of({
        caseClosed:true,
        id:0,
        subject:'test',
        pegaRequestId:0
    }))
    component.showContent('quote');
  });


  it('should call showContent', () => {
    component.showContent('');
  });

  it('should call hideContent', () => {
    component.hideContent();
  });

  it('should call onChange', () => {
    component.onChange('test, test');
  });
  it('should call emailValidation', () => {
    component.emailValidation(undefined);
    component.emailValidation('test@cisco.com');
  });

  it('should call domainValidation', () => {
    component.domainValidation('test@gmail.com');
    component.domainValidation('test@cisco.com');

  });

  it('should call fileOverBase', () => {
    component.fileOverBase('test');
  });

  it('should call dropped', () => {
    jest.spyOn(document,'getElementById').mockReturnValue({value :''} as any);
    const e =  [{name:'test.png'}]
    component.dropped(e);
  });

  it('should call onFileChange', () => {
    jest.spyOn(document,'getElementById').mockReturnValue({value :''} as any);
    const e = {target : {files: [{name:'test.png'}]}}
    component.onFileChange(e);
  });

  it('should call validateFile', () => {
    component.validateFile('png');
    component.validateFile('test');
  });

  it('should call validateFileSize', () => {
    component.fileDetail = { size :10000000 +1}
    component.validateFileSize();
  });

  it('should call submitQuoteCase', () => {
    component.cpsData = {
      fields : {}
    }
    component.submitQuoteCase();
  });

  it('should call submitPricingCase', () => {
    component.cpsData = {
      fields : {}
    }
    component.submitPricingCase();
  });

  it('should call getAllCaseList', () => {
    component.getAllCaseList();
  });

  it('should call checkIfAllCaseClosed', () => {
    const arr  =[
      {caseClosed:false,pegaCaseDetails:{CaseNumber:'123' }}
    ]
    component.checkIfAllCaseClosed(arr);
  });

  it('should call openCasePortal', () => {
    component.openCasePortal('test');
  });

  it('should call createNewCase', () => {
    component.createNewCase();
  });

  it('should call cancelEngage', () => {
    component.cancelEngage();
    component.isCreateNew=true;
    component.cancelEngage();
  });

  it('should call focusDescription', () => {
    const renderer = fixture.debugElement.injector.get(Renderer2)
    jest.spyOn( renderer, 'selectRootElement').mockReturnValue({focus:jest.fn() })
    component.focusDescription();
  });

  it('should call autosize', () => {
    const renderer = fixture.debugElement.injector.get(Renderer2)
    jest.spyOn( renderer, 'selectRootElement').mockReturnValue({focus:jest.fn(), style:{scssText:'',scrollHeight:'', } })
    component.autosize('');
    component.autosize('test');
  });

  it('should call engageSupport', () => {
    component.engageSupport();
  });

  it('should call openSupportModel', () => {
    component.openSupportModel({});
  });


});
