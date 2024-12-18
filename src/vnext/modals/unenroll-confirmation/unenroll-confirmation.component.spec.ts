import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UnenrollConfirmationComponent } from "./unenroll-confirmation.component";
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

describe("UnenrollConfirmationComponent", () => {
  let component: UnenrollConfirmationComponent;
  let fixture: ComponentFixture<UnenrollConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnenrollConfirmationComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService,
         CurrencyPipe,ProposalStoreService, DataIdConstantsService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnenrollConfirmationComponent);
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
    component.accept();
    expect(closeMethod).toBeTruthy();
  });
})