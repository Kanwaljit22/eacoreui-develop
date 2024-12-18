import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { SubsidiariesStoreService } from 'vnext/project/subsidiaries/subsidiaries.store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaidStoreService } from '../eaid-store.service';

import { EaidComponent } from './eaid.component';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { of } from 'rxjs';

class MockEaRestService {

  downloadDocApiCall(a){
    return of({
    });
  }
  getApiCall() {
    return of({
      data: {
      },
    });
  }
  postApiCall() {
    return of({
      data: {},
    });
  }
  getApiCallJson() {
    return of({
      data: {},
    });
  }
  getEampApiCall() {
    return of({
      data: {},
    });
  }

  putApiCall() {
    return of({
      data: {},
    });
  }
}


describe('EaidComponent', () => {
  let component: EaidComponent;
  let fixture: ComponentFixture<EaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaidComponent,LocalizationPipe ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
       
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers:[EaidStoreService,NgbActiveModal,VnextStoreService,MessageService,VnextService,ProjectStoreService,{ provide:EaRestService, useClass : MockEaRestService}, 
         EaService, LocalizationService,SubsidiariesStoreService,UtilitiesService,CurrencyPipe,ProposalStoreService,ElementIdConstantsService,{
          provide: ActivatedRoute,
          useValue: 
          {
            snapshot: {
              queryParamMap: {
                get: (internaleaid) => {
                  return  '1234'
                },
              }
            },
          },
        }
        
         
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call moveToNextStep', () => {
    component.currentStep = 0
    component.moveToNextStep()
    expect(component.currentStep).toEqual(1);
  });
  it('should call toggleHeader', () => {
    component.toggleHeader(true)
    expect(component.showSubsidiaries).toEqual(true);
  });
  it('should call resetFlags', () => {
    component.eaIdStoreService.allowSubmitScopeChange = false
    component.resetFlags()
    expect(component.showSubsidiaries).toEqual(true);
  });
  it('should call back', () => {
    component.currentStep = 2
    component.eaIdStoreService.isShowBuOverlapMessage = true
    component.back()
    expect(component.currentStep).toEqual(1);
  });
  it('should call save', () => {
    component.currentStep = 1
    component.save()
    expect(component.currentStep).toEqual(1);
  });
  it('should call updateEaidUrl', () => {
    component.eaIdStoreService.encryptedEaId = '123'
    component.currentStep = 1
    component.updateEaidUrl()
    expect(component.currentStep).toEqual(0);
  });
  it('should call getEaid', () => {
    component.currentStep = 0
    component.eaService.features.EDIT_EAID_REL = true
    component.getEaid()
    expect(component.currentStep).toEqual(0);
  });

  it('should call getEaid with session id', () => {
    component.eaService.features.EDIT_EAID_REL = true
    const response ={data:'test123'}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getEaid();
  });

  it('should call downloadOverLapBu', () => {
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.encryptedEaId = 'test123'
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "downloadDocApiCall").mockReturnValue(of());
    component.downloadOverLapBu();
  });

  it('should call goToStep', () => {
    let index = 0
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.viewOnlyScopeMode = true;
    component.goToStep(index);

    index = 2;
    eaIdStoreService.viewOnlyScopeMode = false;
    eaIdStoreService.isShowBuOverlapMessage = true;
    component.goToStep(index);
    expect(eaIdStoreService.isShowBuOverlapMessage).toBe(true)

    index = 1;
    eaIdStoreService.viewOnlyScopeMode = false;
    eaIdStoreService.isShowBuOverlapMessage = false;
    component.goToStep(index);
    expect(component.currentStep).toEqual(1);
  });

  it('call reqScopeChange', () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });

    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.scopeChangeComplete = true;

    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise } as any) },
    });
    component.reqScopeChange();
    expect(eaIdStoreService.scopeChangeComplete).toBe(true)
  });

  it('call openCancelScopeChange', () => {
    const promise = new Promise((resolve, reject) => {
      resolve({ continue: true });
    });
    Object.defineProperty(component, "modalVar", {
      value: { open: jest.fn().mockReturnValue({ result: promise, componentInstance: {isCancelScope : true} } as any) },
    });
    component.openCancelScopeChange();
  });

  it('call continue', () => {
   component.currentStep = 0
    component.continue();
    expect(component.showSubsidiaries).toBe(true);
  });

  it('call submitScopeChange', () => {
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.encryptedEaId = 'test123'
    const response = {
      data: {
        overlapBuData: {
          overlapBu: true
        }
      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
     component.submitScopeChange();

    const res = {
      data: {
        
      }
    }
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(res));
    component.submitScopeChange();
    expect(eaIdStoreService.scopeChangeComplete).toBe(true);

   });

   it('call cancelOrgIdEdit', () => {
   component.cancelOrgIdEdit();
   expect(component.showSubsidiaries).toBe(true);

   });

});
