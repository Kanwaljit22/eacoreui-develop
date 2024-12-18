
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

import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { EamsDeliveryComponent } from "./eams-delivery.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("EamsDeliveryComponent", () => {
  let component: EamsDeliveryComponent;
  let fixture: ComponentFixture<EamsDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EamsDeliveryComponent, LocalizationPipe],
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
        UtilitiesService,
        EaRestService,
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
    fixture = TestBed.createComponent(EamsDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    // fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("partnerContactName should be blank", () => {
    expect(component.partnerContactName).toEqual("");
  });
  it("partnerEmail should be blank", () => {
    expect(component.partnerEmail).toEqual("");
  });
  it("primaryPartner should be blank", () => {
    expect(component.primaryPartner).toEqual("");
  });
  it("partnerCcoId should be blank", () => {
    expect(component.partnerCcoId).toEqual("");
  });
  it("phoneNumber should be blank", () => {
    expect(component.phoneNumber).toEqual("");
  });
  it("selectedCiscoEams should be true", () => {
    expect(component.selectedCiscoEams).toBe(true);
  });
  it("invalidEmail should be false", () => {
    expect(component.invalidEmail).toBe(false);
  });
  it("isChangeSubFlow should be true", () => {
    expect(component.isChangeSubFlow).toBe(false);
  });
  it("eamsPartnerInfo should not be null", () => {
    expect(component.eamsPartnerInfo).not.toBe(null);
  });
  it("proposalCxParams should be defined", () => {
    expect(component.proposalCxParams).not.toBe(null);
  });

  it("selectCisco()", () => {
    component.selectCisco();
    expect(component.selectedCiscoEams).toBe(true);
  });
  it("selectEams()", () => {
    component.selectEams();
    expect(component.selectedCiscoEams).toBe(false);
  });

  it("emailValidation()", () => {
    component.emailValidation("");
    expect(component.invalidEmail).toBe(false);
    // component.emailValidation('test')
    // expect(component.invalidEmail).toBeFalse()
  });

  it("emailValidation()", () => {
    component.emailValidation("test@yopmail.com");
    expect(component.invalidEmail).toBe(false);
  });
  it("emailValidation()", () => {
    component.emailValidation("test");
    expect(component.invalidEmail).toBe(true);
  });
  it("isNumberOnlyKey()", () => {
    expect(component.isNumberOnlyKey({})).toBe(false);
  });
  it("allowNumberWithPlus()", () => {
    expect(component.allowNumberWithPlus({})).toBe(false);
  });

  it("close()", () => {
    expect(component.close()).toBeUndefined();
  });
  it("checkPhoneNumbers()", () => {
    component.phoneNumberField = { nativeElement: { value: "+91 9960029742" } };
    expect(
      component.checkPhoneNumbers({ target: { value: "+91 9960029742" } })
    ).toBeUndefined();
  });
  it("ngOnInit()", () => {
    component.eamsPartnerInfo = {
      partnerInfo: {
        partnerContactName: "",
        emailId: "",
        ccoId: "",
        contactNumber: "",
      },
    };
    component.ngOnInit();
    expect(component.partnerContactName).toEqual("");
  });
  it("savePartnerEMS()", () => {
    expect(component.savePartnerEMS()).toBeUndefined();
  });
});
