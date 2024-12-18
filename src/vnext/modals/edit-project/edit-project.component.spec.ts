import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EditProjectComponent } from "./edit-project.component";
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

describe("EditProjectComponent", () => {
  let component: EditProjectComponent;
  let fixture: ComponentFixture<EditProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProjectComponent, LocalizationPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [NgbActiveModal, EaService, EaRestService,
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService,
         CurrencyPipe,ProposalStoreService, DataIdConstantsService, ElementIdConstantsService],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProjectComponent);
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
    component.edit();
    expect(closeMethod).toBeTruthy();
  });

  it('should call acceptEdit', () => {
    component.disableButton = true;
    component.acceptEdit();
     expect(component.disableButton).toBeFalsy();
  });
})