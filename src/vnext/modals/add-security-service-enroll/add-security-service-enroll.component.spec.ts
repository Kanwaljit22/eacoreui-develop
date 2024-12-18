import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddSecurityServiceEnrollComponent } from "./add-security-service-enroll.component";
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectService } from 'vnext/project/project.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

describe("AddSecurityServiceEnrollComponent", () => {
  let component: AddSecurityServiceEnrollComponent;
  let fixture: ComponentFixture<AddSecurityServiceEnrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSecurityServiceEnrollComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, VnextService, VnextStoreService, EaService, 
        EaStoreService, ProposalService, ProposalStoreService, LocalizationService, UtilitiesService, 
        ProjectService, ProjectStoreService, CurrencyPipe, Renderer2, EaRestService, DataIdConstantsService
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecurityServiceEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call update method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    const enrollment = {'id': 1, "name": "Network"}
    component.addEnrollment(enrollment);
     expect(closeMethod).toHaveBeenCalled();
  });
})