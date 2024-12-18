import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LegalPackageComponent } from "./legal-package.component";
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

describe("MultiPartnerConcentComponent", () => {
  let component: LegalPackageComponent;
  let fixture: ComponentFixture<LegalPackageComponent>;

  class MockProposalStoreService {
    proposalData = {
      id: 12345678,
      objId: "123",
      customer: { preferredLegalAddress: { address: "test" } },
    };
  }

  class MockNgbModal {}

  class MockEaRestService {
    downloadDocApiCall() {
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
      declarations: [LegalPackageComponent, LocalizationPipe],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalPackageComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call ngOnInit", () => {
    component.eaStoreService.userInfo = {firstName:'Mariar',lastName:'Partner',emailId: 'mariar@cisco.com' }
    component.ngOnInit();
  });

  it("should call hideLanguages", () => {
    component.hideLanguages();
    expect(component.displayLanguages).toBe(false);
  });
  it("should call updateLanguage", () => {
    component.updateLanguage('English');
    expect(component.selectedLanguage).toBe('English');
    expect(component.displayLanguages).toBe(false);
  });
  it("should call processFile", () => {
    const files =[{name:'test.pdf'}];
    component.processFile(files[0], {  srcElement:{value:'test'}} , {files:files}, false);
    expect(component.fileFormatError).toBe(false)
  });
  it("should call processFile loa", () => {
    const files =[{name:'test.pdf'}];
    component.processFile(files[0], {  srcElement:{value:'test'}} , {files:files}, true);
    expect(component.fileFormatError).toBe(false)
  });

  it("should call removeFile", () => {
    const data = ['test.pdf']
    component.filesUploadedData =['test.pdf']
    component.removeFile('test.pdf',data);
    expect(data.length).toBe(0)
  });

  it("should call fileOverBase", () => {
    const event = { target:{ value :'no'}}
    component.fileOverBase(event);
    expect(component.hasBaseDropZoneOver).toEqual(event)
  });

  it("should call dropped", () => {
    const ele = document.createElement('input')
    jest.spyOn(document, 'getElementById').mockReturnValue(ele)
    const event = { target:{ value :'no'}}
    event[0]={name:'file.png'};
    Object.defineProperty(component.uploader , 'queue' , {
        value:['test']
    })
    component.dropped(event, false);
    expect(component.fileFormatError).toBe(false)
  });
  it("should call dropped loa", () => {
    const ele = document.createElement('input')
    jest.spyOn(document, 'getElementById').mockReturnValue(ele)
    const event = { target:{ value :'no'}}
    event[0]={name:'file.png'};
    Object.defineProperty(component.uploader , 'queue' , {
        value:['test']
    })
    component.dropped(event, true);
    expect(component.fileFormatError).toBe(false)
  });

  it("should call onFileChange", () => {
    const event = { target:{ files:[{name:'file.png'}], value :'no'}}
    component.onFileChange(event,false);
  });
  it("should call onFileChange loa", () => {
    const event = { target:{ files:[{name:'file.png'}], value :'no'}}
    component.onFileChange(event,true);
    expect(component.fileFormatError).toBe(true)
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
    component.filesUploadedData = [{}]
    component.eaStoreService.userInfo = {userId:'test'}
    component.uploadDocs();
    expect(component.fileFormatError).toBe(false)
  });
  it("should call restart", () => {
    component.eaService.features.IRONCLAD_C2A = true
    component.restart();
    expect(component.step).toEqual(1);
  });
  it("should call moveToPreviousStep", () => {
    component.step = 2
    component.moveToPreviousStep();
    expect(component.step).toEqual(1);
  });
  it("should call moveToNextStep", () => {
    component.step = 2
    component.moveToNextStep();
    expect(component.step).toEqual(3);
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
    expect(component.fileFormatError).toBe(false)
  });

  it("should call editPreferredLegal", () => {
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
    expect(component.fileFormatError).toBe(false)
  });

  it("should call initiateESignature", () => {
    component.initiateESignature();
    expect(component.eSignInitiated).toBeTruthy();
  });
  it('should call downloadBlankCopy', () => {
     let eaRestService = fixture.debugElement.injector.get(EaRestService);
     let vnextService = fixture.debugElement.injector.get(VnextService);
     jest.spyOn(eaRestService, "downloadDocApiCall").mockReturnValue(of());
     const validResponseSpy = jest.spyOn(vnextService, 'isValidResponseWithoutData');
     component.downloadBlankCopy();
     expect(validResponseSpy).toBeTruthy();
   });

   it("should setSupportedLanguageForDoc", () => {
    component["eaService"].isSpnaFlow = true;
    component.setSupportedLanguageForDoc();
    expect(component.fileFormatError).toBe(false)
  });

  it("should setSupportedLanguageForDoc 1", () => {
    component["eaService"].isSpnaFlow = false;
    component.setSupportedLanguageForDoc();
    expect(component.fileFormatError).toBe(false)
  
  });
  it("should setSupportedLanguageForDoc 2", () => {
    component["eaService"].isSpnaFlow = false;
    component["eaService"].validateStateForLanguage = jest
      .fn()
      .mockReturnValue(false);
    component.setSupportedLanguageForDoc();
    expect(component.fileFormatError).toBe(false)
  });
  it("should setSupportedLanguageForDoc 3", () => {
    component["eaService"].isSpnaFlow = false;
      component.proposalStoreService.proposalData.customer = undefined
    component.setSupportedLanguageForDoc();
    expect(component.fileFormatError).toBe(false)
  });
  it("should validateCustomerRepData", () => {
      component.proposalStoreService.proposalData.customer = {customerReps:[{}]}
    component.validateCustomerRepData();
    expect(component.invalidCustomerRepData).toBe(true)
  });
  it("should validateCustomerRepData 1", () => {
    component.proposalStoreService.proposalData.customer = {customerReps:[{title:'test',name:'test',email:'test'}]}
    component.validateCustomerRepData();
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should setRadioValue 1", () => {
    const event ={target:{value:'no'}}
    component.loaFilesUploadedData = [{}]
    component.setRadioValue(event);
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should removeDocsUploaded 1", () => {
    const event ={target:{value:'no'}}
    component.loaFilesUploadedData = [{}]
    component.removeDocsUploaded(event);
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should removeDocsUploaded", () => {
    const event =undefined
    component.loaFilesUploadedData = [{}]
    component.removeDocsUploaded(event);
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should downloadDoc", () => {

    component.loaFilesUploadedData = [{}]
    component.downloadDoc();
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should downloadDoc 1", () => {
    component.eDocSigned = true
    component.downloadDoc();
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should deleteCustomerRep", () => {
    component.proposalStoreService.proposalData.customer = {customerReps:[{},{}]}
    component.deleteCustomerRep('test');
    expect(component.invalidCustomerRepData).toBe(true)
  });
  it("should downloadLoaDoc", () => {
    component.proposalStoreService.proposalData.customer = {customerReps:[{},{}]}
    component.downloadLoaDoc({documentId:'test'});
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should selectCustomerConsent", () => {
    const event ={target:{id:'locc1'}}
    component.selectCustomerConsent(event);
    expect(component.selectedConsent).toEqual('intitateSig')
  });
  it("should selectCustomerConsent 1", () => {
    const event ={target:{id:'locc2'}}
    component.selectCustomerConsent(event);
    expect(component.selectedConsent).toEqual('uploadDoc')
  });
  it("should removeFiles", () => {
    component.eaService.features.IRONCLAD_C2A = true
    component.eaStoreService.userInfo = {userId:'test'}
    component.removeFiles({documentId:'test'});
    expect(component.invalidCustomerRepData).toBe(false)
  });
  it("should removeFilesb 1", () => {
    component.eaService.features.IRONCLAD_C2A = true
    component.eaStoreService.userInfo = {userId:'test'}
    component.removeFiles({documentId:'test'},true);
    expect(component.invalidCustomerRepData).toBe(false)
  });

  it("should call uploadDocs 1", () => {
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
    component.loaFilesUploadedData = [{}]
    component.eaStoreService.userInfo = {userId:'test'}
    component.uploadDocs();
    expect(component.fileFormatError).toBe(false)
  });
  it("should showAddCustomerRep", () => {
    const event ={target:{id:'locc2'}}
    component.showAddCustomerRep();
    expect(component.fileFormatError).toBe(false)
  });
  it("should setProgramTermsDoc", () => {
    component.eaService.features.IRONCLAD_C2A = true
    const document ={manualLegalPackageSignedDate:'test',status:'Accepted',statusUpdatedAt:'monday',signers:[{name:'test',email:'test@gmail'}]}
    component.setProgramTermsDoc(document);
    expect(component.fileFormatError).toBe(false)
  });
  it("should setProgramTermsDoc 1", () => {
    component.eaService.features.IRONCLAD_C2A = true
    const document ={manualLegalPackageSignedDate:'test',status:'Sign',statusUpdatedAt:'monday',signers:[{name:'test',email:'test@gmail'}]}
    component.setProgramTermsDoc(document);
    expect(component.fileFormatError).toBe(false)
  });
  it("should setProgramTermsDoc 2", () => {
    component.eaService.features.IRONCLAD_C2A = true
    const document ={uploads: {SIGNED_CUSTOMER_PACKAGE:[{}]},manualLegalPackageSignedDate:'test',status:'Rejected',statusUpdatedAt:'monday',signers:[{name:'test',email:'test@gmail'}]}
    component.setProgramTermsDoc(document);
    expect(component.fileFormatError).toBe(false)
  });
  it("should getLOAData", () => {
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    const response = {data:{loaDocuments:[{}]}}
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.eaService.features.IRONCLAD_C2A = true
    component.getLOAData();
    expect(component.fileFormatError).toBe(false)
  });
  it("should setCustomerRepData", () => {
    component.signerName = 'test'
    component.signerEmail = 'test'

    component.setCustomerRepData();
    expect(component.fileFormatError).toBe(false)
  });
  it("should setCustomerRepData 1", () => {
    component.proposalStoreService.proposalData.customer = {customerReps:[{}]}
    component.setCustomerRepData();
    expect(component.fileFormatError).toBe(false)
  });
});
