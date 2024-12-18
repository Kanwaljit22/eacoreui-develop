import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";

import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";

import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";

import { VnextStoreService } from "vnext/commons/services/vnext-store.service";


import { ReviewAcceptComponent } from "./review-accept.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("ReviewAcceptComponent", () => {
  let component: ReviewAcceptComponent;
  let fixture: ComponentFixture<ReviewAcceptComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ReviewAcceptComponent],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      providers: [
        CurrencyPipe,
        NgbActiveModal,
        EaRestService,
        EaService,
        MessageService,
        LocalizationService,
        VnextStoreService,
        DataIdConstantsService, ElementIdConstantsService
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  afterEach(() => {
   // fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should close()", () => {
    expect(component.close()).toBeUndefined();
  });
  it("should accept()", () => {
    expect(component.accept()).toBeUndefined();
  });

  it("should reviewAccept()", () => {
    component.reviewAccept();
    expect(component.disableButton).toBeTruthy();
  });
});
