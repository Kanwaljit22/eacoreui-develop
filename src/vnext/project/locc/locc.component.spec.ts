import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { LoccComponent } from "./locc.component";
import { BehaviorSubject, Subject, of } from "rxjs";
import { ProjectService } from "../project.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProjectStoreService } from "../project-store.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { MessageService } from "vnext/commons/message/message.service";
import { VnextService } from "vnext/vnext.service";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { EaRestService } from "ea/ea-rest.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { EaService } from "ea/ea.service";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("LoccComponent", () => {
  let component: LoccComponent;
  let fixture: ComponentFixture<LoccComponent>;

  class MockProjectStoreService {
    projectData = {
      objId: 1234566,
      partnerInfo:{beGeoId:'123'},
      dealInfo:{id:'123'},
      customerInfo:{customerGuId:'123'}
    };
    nextBestActionsStatusObj = { isLoccDone: true };
  }

  class MockProjectService {
    closeLoccModalSubject = new Subject();
    updateNextBestOptionsSubject = new Subject();
    checkAndSetSelectedCrPartyFromDeal() {
      return false;
    }

    isReturningCustomer() {
      return false;
    }

    getCompleteAddressforParty() {
      return "PO BOX 43221, ABU DHABI, AE";
    }

    clearSearchInput = new Subject();

    showLocc = false;
  }

  class MockNgbModal {}

  class MockUtilitiesService {
    saveFile=jest.fn()
  }

  class MockMessageService {
    displayMessagesFromResponse(test) {}
    clear() {}

    displayUiTechnicalError() {}
  }

  class MockVnextService {
    isValidResponseWithoutData(...args) {
      return true;
    }

    isValidResponseWithData(...args){
      return true
    }
  }

  class MockDataIdConstantsService {}

  class MockProposalStoreService {
    proposalData = {
      id: 12345678,
      objId:'123'
    };
  }

  class MockVnextStoreService {


   toastMsgObject={loccSuccess :true}
    loccDetail = {
      loccInitiated:true,
      customerContact: {
        preferredLegalAddress: { state: "test" },
      },
    };
  }

  class MockEaRestService {
    downloadDocApiCall(a){
      return of({
        data: {
          smartAccounts: [
            {
              smartAccName: "test",
            },
          ],
          hasEa2Entity: false,
        },
      });
    }
    getApiCall() {
      return of({
        data: {
          smartAccounts: [
            {
              smartAccName: "test",
            },
          ],
          hasEa2Entity: false,
        },
      });
    }
    postApiCall() {
      return of({
        data: {},
      });
    }
    getApiCallJson() {
      return of({
        data: {},
      });
    }
    getEampApiCall() {
      return of({
        data: {},
      });
    }

    putApiCall() {
      return of({
        data: {},
      });
    }
  }

  class MockLocalizationService {
    getLocalizedString = jest.fn().mockImplementation((params) => {
      return params;
    });
    // localizationMapUpdated=of({})
  }

  class MockEaService {
    features = { PARAMETER_ENCRYPTION: true, SPNA_FRENCH_DOCUMENT_REL: false };
    localizationMapUpdated = new BehaviorSubject("common");
    validateStateForLanguage = jest.fn().mockReturnValue(true);
    isPartnerUserLoggedIn(){}
  }
  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
    FR_LANG_CODE: "fr_CA";
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoccComponent, LocalizationPipe],
      providers: [
        {
          provide: ProjectService,
          useClass: MockProjectService,
        },
        {
          provide: NgbModal,
          useClass: MockNgbModal,
        },
        {
          provide: ProjectStoreService,
          useClass: MockProjectStoreService,
        },
        {
          provide: UtilitiesService,
          useClass: MockUtilitiesService,
        },
        {
          provide: MessageService,
          useClass: MockMessageService,
        },
        {
          provide: VnextService,
          useClass: MockVnextService,
        },
        {
          provide: DataIdConstantsService,
          useClass: MockDataIdConstantsService,
        },
        {
          provide: ProposalStoreService,
          useClass: MockProposalStoreService,
        },
        {
          provide: VnextStoreService,
          useClass: MockVnextStoreService,
        },
        {
          provide: EaRestService,
          useClass: MockEaRestService,
        },
        {
          provide: LocalizationService,
          useClass: MockLocalizationService,
        },
        {
          provide: EaService,
          useClass: MockEaService,
        },
        {
          provide: ConstantsService,
          useClass: MockConstantsService,
        },
        ElementIdConstantsService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoccComponent);
    component = fixture.componentInstance;
    component.fileDetail = { name: "test" };
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should setSupportedLanguageForDoc", () => {
    component["eaService"].isSpnaFlow = true;
    component.setSupportedLanguageForDoc();
  });

  it("should setSupportedLanguageForDoc", () => {
    component["eaService"].isSpnaFlow = false;
    component.setSupportedLanguageForDoc();
    component["eaService"].validateStateForLanguage = jest
      .fn()
      .mockReturnValue(false);
    component.setSupportedLanguageForDoc();
    component.vnextStoreService.loccDetail.customerContact.preferredLegalAddress.state =
      undefined;
    component.setSupportedLanguageForDoc();
  });

  it("should call selectLanguage", () => {
    component.selectLanguage("test");
  });

  it("should call sendLangcodeInUrl", () => {
    component.selectedDocLanguage["localeCode"] = "fr_CA";
    component.sendLangcodeInUrl();
  });

  it("should call editInfo", () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.editInfo();
  });

  it("should call chooseCusConsent", () => {
    component.chooseCusConsent({ target: { id: "common.locc.LOCC1" } });
  });

  it("should call chooseCusConsent b1", () => {
    component.chooseCusConsent({ target: { id: "common.locc.LOCC2" } });
  });

  it("should call chooseCusConsent b1", () => {
    // component.localizationService.getLocalizedString = jest.fn().mockReturnValue('123')
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.chooseCusConsent({ target: { id: "test" } });
  });

  it("should call fileOverBase b1", () => {
    component.fileOverBase({ target: { id: "" } });
  });

  it("should call dropped", () => {
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue({ value: "" } as any);
    const arr = [{ name: "test" }];
    arr["target"] = { id: "" };
    component["uploader"].queue.length =1;
    component.dropped(arr);
  });

  it("should call onFileChange", () => {
    const files =[{name:'test'}];
    component.onFileChange({ target: { id: "" , files:files } as any });
  });


  it("should call editPreferred", () => {

    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.editPreferred();
  });

  it("should call selectValid", () => {
    component.selectValid('');
  });

  it("should call removeUploadedDocs", () => {
    component.filesUploadedData =['test']
    component.removeUploadedDocs();
  });

  it("should call continue", () => {
    component.customerReadyStep=true;
    component.continue();
    component.customerReadyStep=false;
    component.customerRepInfoStep=true;
    component.continue();
  });

  it("should call isCustomerReady", () => {
    component.isCustomerReady({target:{value:'yes'}});
    component.isCustomerReady({target:{value:'no'}});
  });

  it("should call back", () => {
    component.customerRepInfoStep=true;
    component.back();
    component.customerRepInfoStep=false;
    component.reviewLoccStep=true;
    component.back();
  });

  it("should call downloadLoccFile", () => {
    component.downloadLoccFile();
  });

  it("should call initiate", () => {
    component.initiate();
  });


  it("should call sendAgain", () => {

    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.sendAgain();
  });


  it("should call importLocc", () => {
    component.importLocc();
  });


  it("should call onDateSelection", () => {
    component.onDateSelection({target:{value:'no'}});
  });


  it("should call processFile", () => {
    const files =[{name:'test.pdf'}];
    component.processFile(files[0], {  srcElement:{value:'test'}} , {files:files});
  });

  it("should call removeFile", () => {
    component.filesUploadedData =['test.pdf']
    component.removeFile('test.pdf');
  });


});
