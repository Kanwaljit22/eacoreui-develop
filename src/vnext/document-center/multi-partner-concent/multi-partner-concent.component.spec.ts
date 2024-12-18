import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MultiPartnerConcentComponent } from "./multi-partner-concent.component";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, of } from "rxjs";
import { EaRestService } from "ea/ea-rest.service";
import { VnextService } from "vnext/vnext.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
import { ConstantsService } from "vnext/commons/services/constants.service";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("MultiPartnerConcentComponent", () => {
  let component: MultiPartnerConcentComponent;
  let fixture: ComponentFixture<MultiPartnerConcentComponent>;

  class MockProposalStoreService {
    proposalData = {
      id: 12345678,
      objId: "123",
      customer: { preferredLegalAddress: { address: "test" } },
    };
  }

  class MockNgbModal {}

  class MockEaRestService {
    downloadDocApiCall(...a) {
      return of({
        data: {},
      });
    }
    getApiCall() {
      return of({
        data: {
          documents: [
            {
              type: "CUSTOMER_CONSENT",
              statusUpdatedAt: "tet",
              status: "completed",
              manualLegalPackageSignedDate: { id: "" },
            },
          ],
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

    putApiCall(...a) {
      return of({
        data: [
          {
            id: 123,
          },
        ],
      });
    }

    deleteApiCall(...a) {
      return of({
        data: {},
      });
    }
  }

  class MockVnextService {
    isValidResponseWithoutData(...args) {
      return true;
    }

    isValidResponseWithData(...args) {
      return true;
    }
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

  class MockLocalizationService {
    getLocalizedString = jest.fn().mockImplementation((params) => {
      return params;
    });
    // localizationMapUpdated=of({})
  }

  class MockVnextStoreService {}
  class MockEaStoreService {}
  class MockEaService {
    features = { PARAMETER_ENCRYPTION: true, SPNA_FRENCH_DOCUMENT_REL: false };
    localizationMapUpdated = new BehaviorSubject("common");
    validateStateForLanguage = jest.fn().mockReturnValue(true);
    getLocalizedString(...a) {
      return "test";
    }
  }

  class MockConstantsService {
    SECURITY = "test";
    PREPAID_TERM = "Prepaid";
  }

  class MockDataIdConstantsService {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiPartnerConcentComponent, LocalizationPipe],
      providers: [
        { provide: ProposalStoreService, useClass: MockProposalStoreService },
        { provide: NgbModal, useClass: MockNgbModal },
        { provide: EaRestService, useClass: MockEaRestService },
        { provide: VnextService, useClass: MockVnextService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: VnextStoreService, useClass: MockVnextStoreService },
        { provide: LocalizationService, useClass: MockLocalizationService },
        { provide: EaStoreService, useClass: MockEaStoreService },
        { provide: EaService, useClass: MockEaService },
        { provide: ConstantsService, useClass: MockConstantsService },
        {
          provide: DataIdConstantsService,
          useClass: MockDataIdConstantsService,
        },
        ElementIdConstantsService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiPartnerConcentComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    component.ngOnInit();
  });

  it("should call selectCustomerConsent", () => {
    component.selectCustomerConsent({ target: { id: "locc1" } });
    component.selectCustomerConsent({ target: { id: "locc2" } });
  });

  it("should call editCustomerRep", () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true, reqJson: { name: "test" } });
    });
    component["modalVar"] = {
      open: jest
        .fn()
        .mockReturnValue({
          result: promise,
          componentInstance: { type: "test", page: "test", message: "" },
        }),
    } as any;
    component.editCustomerRep("test", { id: "123" } as any);
  });

  it("should call saveCustomerRepData", () => {
    const json = {
      data: [
        {
          id: "test",
        },
      ],
    };
    component.multiPartnerCustRep = [
      {
        id: 123,
      },
    ];
    component.saveCustomerRepData(json, { id: 123 });
  });

  it("should call saveCustomerRepData b1", () => {
    const json = {
      data: [
        {
          id: "test",
        },
      ],
    };
    component.multiPartnerCustRep = [
      {
        id: 123,
      },
    ];
    component.saveCustomerRepData(json, null);
  });

  it("should call editCustomerRep", () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true, reqJson: { name: "test" } });
    });
    component["modalVar"] = {
      open: jest
        .fn()
        .mockReturnValue({
          result: promise,
          componentInstance: { type: "test", page: "test", message: "" },
        }),
    } as any;
    component.editPreferredLegal();
  });

  it("should call deleteCustomerRep", () => {
    component.deleteCustomerRep("test");
  });

  it("should call moveToNextStep", () => {
    component.moveToNextStep();
  });

  it("should call moveToPreviousStep", () => {
    component.moveToPreviousStep();
  });

  it("should call downloadDoc", () => {
    const fn = jest.spyOn(component, "signedCustomerConsent");
    component.eDocSigned = true;
    component.downloadDoc();
    expect(fn).toBeCalled();
  });

  it("should call downloadDoc", () => {
    const fn = jest.spyOn(component, "unsignedCustomerConsent");
    component.eDocSigned = false;
    component.downloadDoc();
    expect(fn).toBeCalled();
  });

  it("should call initiateESignature", () => {
    component.initiateESignature();
    expect(component.eSignInitiated).toBeTruthy();
  });

  it("should call restart", () => {
    component.restart();
    expect(component.eSignInitiated).toBeFalsy();
  });

  it("should call showAddCustomerRep", () => {
    component.multiPartnerCustRep = [{ name: "test" }] as any;
    expect(component.showAddCustomerRep()).toBeTruthy();
  });

  it("should call showAddCustomerRep", () => {
    component.multiPartnerCustRep = [
      { name: "test" },
      { name: "test" },
      { name: "test" },
      { name: "test" },
    ] as any;
    expect(component.showAddCustomerRep()).toBeFalsy();
  });

  it("should call checkProposalDocs", () => {
    const fn = jest.spyOn(component, "setCustConsentDoc");
    component.checkProposalDocs();
    expect(fn).toBeCalled();
  });

  it("should call setCustConsentDoc", () => {
    const document = {
      manuallySigned: true,
      type: "CUSTOMER_CONSENT",
      statusUpdatedAt: "tet",
      status: "sent",
      manualLegalPackageSignedDate: { id: "" },
    };
    component.setCustConsentDoc(document);
    expect(component.isCustConsentUploaded).toBeTruthy();
    expect(component.eDocSigned).toBeTruthy();
    expect(component.eSignInitiated).toBeTruthy();
  });

  it("should call checkProposalDocs", () => {
    component.removeUploadedDocs();
    expect(component.filesUploadedData).toEqual([]);
  });

  it("should call checkUploadeDocFormat", () => {
    const event = { target: { value: "no" } };
    event[0] = { name: "file.png" };
    const fn = jest.spyOn(component, "allowOnlyPDF");
    component.checkUploadeDocFormat(event, true);
    expect(fn).toBeCalled();
  });

  it("should call checkUploadeDocFormat", () => {
    const event = { target: { value: "no" } };
    event[0] = { name: "file.png" };
    const fn = jest.spyOn(component, "allowOnlyPDF");
    component.checkUploadeDocFormat(event, false);
    expect(fn).toBeCalled();
  });

  it("should call processFile", () => {
    const event = { target: { value: "no" } };
    event[0] = { name: "file.png" };
    component.processFile(event[0], event, event.target, true);
  });

  it("should call processFile", () => {
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue(document.createElement("div"));
    const event = {
      srcElement: { value: "test" },
      target: { value: "no", files: [{ name: "file.png" }] },
    };
    event[0] = { name: "file.pdf" };
    component.processFile(event[0], event, event.target, true);
  });

  it("should call processFile", () => {
    const event = { target: { value: "no" } };
    event[0] = { name: "file.png" };
    component.processFile({ name: "file.png" }, event, event.target, false);
  });

  it("should call processFile", () => {
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue(document.createElement("div"));
    const event = {
      srcElement: { value: "test" },
      target: { value: "no", files: [{ name: "file.png" }] },
    };

    component.processFile({ name: "file.png" }, event, event.target, false);
  });

  it("should call removeFile", () => {
    component.removeFile("file1.png", ["file1.png"]);
  });

  it("should call fileOverBase", () => {
    component.fileOverBase("");
  });

  it("should call dropped", () => {
    const event = {
      srcElement: { value: "test" },
      target: { value: "no", files: [{ name: "file1.png" }] },
    };
    event[0] = { name: "file1.pdf" };
    jest
      .spyOn(document, "getElementById")
      .mockReturnValue(document.createElement("div"));
    component.uploader.queue.length = 1;
    component.dropped(event, false);
  });

  it("should call uploadDocs", () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true, reqJson: { name: "test" } });
    });
    component["modalVar"] = {
      open: jest
        .fn()
        .mockReturnValue({
          result: promise,
          componentInstance: {
            docData: {},
            type: "test",
            page: "test",
            message: "",
          },
        }),
    } as any;
    component.uploadDocs();
  });

  it("should call restartUpload", () => {
    component.restartUpload();
  });
  it("should call hideLanguages", () => {
    component.hideLanguages();
  });
  it("should call fileOverBase", () => {
    component.updateLanguage("");
  });
});
