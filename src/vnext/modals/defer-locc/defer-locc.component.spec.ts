import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DeferLoccComponent } from "./defer-locc.component";
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

describe("DeferLoccComponent", () => {
  let component: DeferLoccComponent;
  let fixture: ComponentFixture<DeferLoccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeferLoccComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService, DataIdConstantsService,
         CurrencyPipe,ProposalStoreService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferLoccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    component.defer();
    expect(closeMethod).toBeTruthy();
  });
})