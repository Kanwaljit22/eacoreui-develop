
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

import { MessageService } from "vnext/commons/message/message.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";

import { DocusignInitiationWarningComponent } from "./docusign-initiation-warning.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

describe("DocusignInitiationWarningComponent", () => {
  let component: DocusignInitiationWarningComponent;
  let fixture: ComponentFixture<DocusignInitiationWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DocusignInitiationWarningComponent, LocalizationPipe],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocusignInitiationWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("continue ()", () => {
    component.continue();
    //expect(component).toBeTruthy();
  });
  it("cancel ()", () => {
    component.cancel();
    //expect(component).toBeTruthy();
  });
});
