import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddCaseIdPaComponent } from "./add-case-id-pa.component";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

describe("AddCaseIdPaComponent", () => {
  let component: AddCaseIdPaComponent;
  let fixture: ComponentFixture<AddCaseIdPaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCaseIdPaComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, VnextService, VnextStoreService, EaService, EaStoreService, ProposalService, ProposalStoreService, LocalizationService, UtilitiesService, 
        ProjectService, ProjectStoreService, CurrencyPipe, Renderer2, EaRestService, DataIdConstantsService, ElementIdConstantsService
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCaseIdPaComponent);
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

  it('call update method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.update();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call isCaseIdValueChanged method', () => {
    const mockEevent: Event = <Event><any>{
      target: {
          value: 'Test'   
      }
    };
    component.isCaseIdValueChanged(mockEevent);
    expect(component.isUpdate).toBeFalsy();
  });

  it('call isCaseIdValueChanged method', () => {
    const mockEevent: Event = <Event><any>{
      target: {
          value: 'Test'   
      }
    };
    component.caseId ='1234';
    component.isCaseIdValueChanged(mockEevent);
    expect(component.isUpdate).toBeTruthy();
  });

  it('call focusDescription', () => {
    component.focusDescription();
    expect(component.type).toBeFalsy();
  });
})