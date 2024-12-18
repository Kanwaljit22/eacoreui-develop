
import {  CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";

import { MessageComponent } from "vnext/commons/message/message.component";
import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { LookupDealidComponent } from "./lookup-dealid.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("LookupDealidComponent", () => {
  let component: LookupDealidComponent;
  let fixture: ComponentFixture<LookupDealidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LookupDealidComponent, MessageComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      providers: [
        LocalizationService,
        NgbActiveModal,
        VnextService,
        MessageService,
        ProjectStoreService,
        EaRestService,
        VnextStoreService,
        UtilitiesService,
        CurrencyPipe,
        ProposalStoreService,
        Router,
        DataIdConstantsService
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupDealidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it('should call lookUpDeal method when close button is clicked', () => {
  //   const modalRef = TestBed.get(NgbActiveModal);
  //   jest.spyOn(modalRef, 'close');
  //   component.dealId="123w"
  //  // component.lookUpDeal();
  //   expect(modalRef.close).toHaveBeenCalled();
  // });
});
