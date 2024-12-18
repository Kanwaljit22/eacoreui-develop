
import {  CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";

import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";

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

import { EditCustomerRepresentativeComponent } from "./edit-customer-representative.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("EditCustomerRepresentativeComponent", () => {
  let component: EditCustomerRepresentativeComponent;
  let fixture: ComponentFixture<EditCustomerRepresentativeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditCustomerRepresentativeComponent,
        LocalizationPipe,
        MessageComponent,
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule,
    
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    //fixture.destroy();
    component=null
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("custRepersentativeName should be blank initially ", () => {
    expect(component.custRepersentativeName).toEqual("");
  });
  it("custRepersentativeEmailId should be blank initially ", () => {
    expect(component.custRepersentativeEmailId).toEqual("");
  });
  it("custRepersentativeTitle should be blank initially ", () => {
    expect(component.custRepersentativeTitle).toEqual("");
  });
  it("invalidDomain should be false initially ", () => {
    expect(component.invalidDomain).toBe(false);
  });
  it("invalidEmail should be false initially ", () => {
    expect(component.invalidEmail).toBe(false);
  });
  it("disableButton should be false initially ", () => {
    expect(component.disableButton).toBe(false);
  });

  it("isEmailEmpty should be true initially ", () => {
    expect(component.isEmailEmpty).toBe(true);
  });
  it("SearchCountryField should be defined initially ", () => {
    let searchField: any = {
      DialCode: "dialCode",
      Iso2: "iso2",
      Name: "name",
      All: "all",
    };
    expect(component.SearchCountryField).toEqual(searchField);
  });
  it("PhoneNumberFormat should be defined initially ", () => {
    let phoneFormat: any = {
      International: "INTERNATIONAL",
      National: "NATIONAL",
    };
    expect(component.PhoneNumberFormat).toEqual(phoneFormat);
  });
  it("preferredCountries should be defined initially ", () => {
    let preferredCountries: any = ["us", "gb"];
    expect(component.preferredCountries).toEqual(preferredCountries);
  });

  it("customerRepDetails should be undefined initially ", () => {
    expect(component.customerRepDetails).toEqual(undefined);
  });
  it("invalidDomainErrorMessage should be blank initially ", () => {
    expect(component.invalidDomainErrorMessage).toEqual("");
  });

  it("page should be locc initially ", () => {
    expect(component.page).toEqual("locc");
  });
  it("type should be update initially ", () => {
    expect(component.type).toEqual("update");
  });
  it("preferredLegalAddress should not be null ", () => {
    expect(component.preferredLegalAddress).not.toBe(null);
  });
  it("CountryISO should not be null ", () => {
    expect(component.CountryISO).not.toBe(null);
  });

  it("setCustRepresentativeData()", () => {
    let customerRepresentativeObject: any = {
      customerContact: {
        repName: "test",
        repTitle: "Mr",
        repEmail: "test@yopmail.com",
        name: "xyz",
        title: "Mr",
        email: "xyz@yopmail.com",
      },
    };
    component.page = "locc";
    component.setCustRepresentativeData(customerRepresentativeObject);
    expect(component.custRepersentativeName).not.toBe(null);
    component.page = "";
    component.setCustRepresentativeData(customerRepresentativeObject);
    expect(component.custRepersentativeName).not.toBe(null);
  });
  it("close ()", () => {
    expect(component.close()).toBeUndefined();
    //expect(component).toBeTruthy();
  });
  it("emailValidation()", () => {
    //component.form.setValue({'custRep.custRepEmailId':'test'})
    component.emailValidation();
    expect(component.invalidEmail).toBe(false);
    // component.emailValidation('test')
    // expect(component.invalidEmail).toBeFalse()
  });

  it("preparePhoneValue()", () => {
    let customerContact: any = {
      phoneNumber: "9973736464",
      phoneCountryCode: "+91",
      dialFlagCode: "0000",
    };
    component.preparePhoneValue(customerContact);
    expect(component.phoneNumber).not.toBe(undefined);
  });
  it("setCustomerRepForDocCenter()", () => {
    let customerContact: any = {
      name: "govind",
      id: 1,
      phoneNumber: "9973736464",
      phoneCountryCode: "+91",
      dialFlagCode: "0000",
    };
    //component.type="add"
    //component.setCustomerRepForDocCenter(customerContact)
    //expect(component.phoneNumber).not.toBe(undefined)
  });
  it("nameValidation()", () => {
    component.nameValidation();
    expect(component.disableButton).toBe(true);
  });
  it("titleValidation()", () => {
    component.titleValidation();
    expect(component.disableButton).toBe(true);
  });
  it("domainValidation()", () => {
    let email = "gnarute@cisco.com";
    component.domainValidation(email);
    expect(component.invalidDomain).toBe(false);
  });
  // it("domainValidation()", () => {
  //   let email = "gnarute@yopmail.com";
  //   component.domainValidation(email);
  //   expect(component.invalidDomain).toBe(true);
  // });

  it("focusInput", () => {
    let value = "customerNAme";
    expect(component.focusInput(value)).toBeUndefined();
    //component.updateLoccCustomerContact()
  });
});
