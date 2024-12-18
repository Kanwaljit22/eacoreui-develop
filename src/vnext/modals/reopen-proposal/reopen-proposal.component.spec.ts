import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenProposalComponent } from './reopen-proposal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { CurrencyPipe } from '@angular/common';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

describe('ReopenProposalComponent', () => {
  let component: ReopenProposalComponent;
  let fixture: ComponentFixture<ReopenProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ReopenProposalComponent, LocalizationPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService, DataIdConstantsService,
         CurrencyPipe,ProposalStoreService, ElementIdConstantsService]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept', () => {
    component.acceptReopen = false;
    component.accept();
    expect(component.acceptReopen).toBeTruthy();
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call reopen method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.reopen();
     expect(closeMethod).toHaveBeenCalled();
  });
});
