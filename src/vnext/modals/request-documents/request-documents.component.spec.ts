
import {  CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";

import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { RequestDocumentsComponent } from "./request-documents.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

class EaRestServiceMock {
  postApiCall(url, req: any) {
    return of(true);
  }
  downloadDocApiCall(url) {
    return of(true);
  }
}

class ProposalRestServiceMock {
  getApiCall(url) {
    return of(true);
  }
}

class VnextServiceMock {
  isValidResponseWithData(res: any) {
    return of(true);
  }

  isValidResponseWithoutData(res: any) {
    return of(true);
  }

  downloadLocc(res: any) {
    return of(true);
  }
}

class VnextStoreServiceMock {
  cleanToastMsgObject() {
    return of(true);
  }
}

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
};

class UtilitiesServiceMock {
  saveFile(res: any, downloadZipLink: any) {
    return of(true);
  }
}
describe("RequestDocumentsComponent", () => {
  let component: RequestDocumentsComponent;
  let fixture: ComponentFixture<RequestDocumentsComponent>;
  let proposalRestService = new ProposalRestServiceMock();
  let vnextService = new VnextServiceMock();
  let vnextStoreService = new VnextStoreServiceMock();
  let eaRestService = new EaRestServiceMock();
  let utilitiesService = new UtilitiesServiceMock();
  let activeModal: NgbActiveModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
     
      ],
      declarations: [RequestDocumentsComponent, LocalizationPipe],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        PriceEstimateService,
        { provide: VnextService, useValue: vnextService },
        ProposalStoreService,
        { provide: ProposalRestService, useValue: proposalRestService },
        { provide: UtilitiesService, useValue: utilitiesService },
        LocalizationService,
        LocalizationPipe,
        CurrencyPipe,
        PriceEstimateStoreService,
        { provide: VnextStoreService, useValue: vnextStoreService },
        { provide: EaRestService, useValue: eaRestService },
        DataIdConstantsService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should download locc file", () => {
    const downloadSpy = jest.spyOn(vnextService, "downloadLocc");
    component.downloadLoccFile();
    expect(downloadSpy).toHaveBeenCalled();
  });

  it("should request for IB", () => {
    const ibRequestSpy = jest.spyOn(eaRestService, "postApiCall");
    const validResponseSpy = jest.spyOn(vnextService, "isValidResponseWithoutData");
    const closeSpy = jest.spyOn(component, "close");
    component.requestIb();
    expect(ibRequestSpy).toHaveBeenCalled();
    expect(validResponseSpy).toBeTruthy();
  });

  // it('call download excel', fakeAsync(() => {
  //   let vnextStoreServ = TestBed.get(VnextStoreService) as VnextStoreService;
  //   const ibRequestSpy = jest.spyOn(eaRestService, 'postApiCall');
  //   tick(2000);
  //   component.requestIb();
  //   expect(ibRequestSpy).toHaveBeenCalled();
  //    expect(vnextStoreServ.toastMsgObject.ibReportReequested).toBe(true);
  //   flush();
  // }));

  it("should download summary doc", () => {
    const downloadSpy = jest.spyOn(
      eaRestService,
      "downloadDocApiCall"
    );
    const validResponseSpy = jest.spyOn(vnextService, "isValidResponseWithoutData");
    const saveFileSpy = jest.spyOn(utilitiesService, "saveFile");
    component.downloadSummaryDoc();
    expect(downloadSpy).toHaveBeenCalled();
    expect(validResponseSpy).toBeTruthy();
    expect(saveFileSpy).toBeTruthy();
  });

  it("close()", () => {
    expect(component.close()).not.toBe(null);
  });
});
