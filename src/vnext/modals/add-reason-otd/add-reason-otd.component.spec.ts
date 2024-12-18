import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReasonOtdComponent } from './add-reason-otd.component';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

describe('AddReasonOtdComponent', () => {
  let component: AddReasonOtdComponent;
  let fixture: ComponentFixture<AddReasonOtdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddReasonOtdComponent, LocalizationPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService,
         CurrencyPipe,ProposalStoreService, DataIdConstantsService, ElementIdConstantsService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReasonOtdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call update', () => {
    component.pidReason = '123454';
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.update();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call focusInput',() =>{
    component.focusInput('test')
  });

  it('call focusDescription', () => {
    component.focusDescription()
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call isReasonChanged', () => {
    let event
    component.pidReason = '1123';
    component.isUpdate = true;
    component.isReasonChanged(event);
    expect(component.isUpdate).toBeFalsy();

    component.pidReason = '';
    component.isUpdate = true;
    component.isReasonChanged(event)
    expect(component.isUpdate).toBeFalsy();
  });

});
