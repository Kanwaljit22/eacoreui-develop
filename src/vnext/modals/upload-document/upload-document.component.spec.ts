import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UploadDocumentComponent } from "./upload-document.component";
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { EaService } from 'ea/ea.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

describe("UploadDocumentComponent", () => {
  let component: UploadDocumentComponent;
  let fixture: ComponentFixture<UploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService,
         CurrencyPipe,ProposalStoreService, DataIdConstantsService, ElementIdConstantsService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('should accept', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.confirmUpload();
    expect(closeMethod).toBeTruthy();
  });

  it('should set confirm button', () => {
    component.disableConfirm = false;
    component.review();
    expect(component.disableConfirm).toBeTruthy();
  });

  it('should have custconsent', () => {
    const event = new Event('change')
    component.custConsentDateSelection(event);
    expect(component.disableCheckBox).toBeFalsy();
  });

  it('should call onDateSelection 1', () => {
    const event = new Event('change')
    component.onDateSelection(event);
    expect(component.disableCheckBox).toBeTruthy();
  });

  it('should call onDateSelection 2', () => {
    component.docData = {isProgramtermsPresent: true}
    const event = new Event('change')
    component.onDateSelection(event);
    expect(component.disableCheckBox).toBeFalsy();
    expect(component.signedDateStr).toBeTruthy();
  });

  it('should call onDateSelectionForLoa 1', () => {
    const event = new Event('change')
    component.onDateSelectionForLoa(event);
    expect(component.disableCheckBox).toBeTruthy();
  });

  it('should call onDateSelectionForLoa 2', () => {
    component.signedDateStr = 'Test';
    component.docData = {isPrgrmTermLoaPresent: true}
    const event = new Event('change')
    component.onDateSelectionForLoa(event);
    expect(component.disableCheckBox).toBeFalsy();
  });
})