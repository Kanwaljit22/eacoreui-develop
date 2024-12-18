
import {  CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";

import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";

import { of } from "rxjs";
import { MessageComponent } from "vnext/commons/message/message.component";
import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";

import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { ConvertQuoteComponent } from "./convert-quote.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

const paReasonsMock = {
  data: {
    paReasons: ["TBD", "TBDDD"],
  },
};
class EaRestServiceMock {
  getApiCall(url) {
    return of(paReasonsMock);
  }
  getApiCallJson(url) {
    return of(paReasonsMock);
  }
  postApiCall() {
    return of({
      data: {
        responseApproverList: [
          {
            test: "test",
          },
        ],
      },
    });
  }
}
describe("ConvertQuoteComponent", () => {
  let component: ConvertQuoteComponent;
  let fixture: ComponentFixture<ConvertQuoteComponent>;
  let eaRestService = new EaRestServiceMock();
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConvertQuoteComponent, LocalizationPipe, MessageComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      providers: [
        CurrencyPipe,
        NgbActiveModal,
        ProjectStoreService,
        EaRestService,
        UtilitiesService,
        EaService,
        MessageService,
        LocalizationService,
        VnextService,
        VnextStoreService,
        ProposalStoreService,
        ProposalRestService,
        DataIdConstantsService, ElementIdConstantsService
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("close()", () => {
    expect(component.close()).toBeUndefined();
  });
  it("getSelecteditem()", () => {
    component.quotesList = [
      {
        quoteId: 1,
      },
    ];
    component.radioSelected = 1;
    component.getSelecteditem();
    expect(component.radioSel.length).not.toBe(null);
  });

  it("onItemChange()", () => {
    expect(component.onItemChange(null)).toBeUndefined();
  });
  it("createNewQuote()", () => {
    expect(component.createNewQuote()).toBeUndefined();
  });
  it("onItemChange()", () => {
    expect(component.updateQuote()).toBeUndefined();
  });
  it("openQuoteUrl()", () => {
    expect(component.openQuoteUrl(123)).toBeUndefined();
  });
});
