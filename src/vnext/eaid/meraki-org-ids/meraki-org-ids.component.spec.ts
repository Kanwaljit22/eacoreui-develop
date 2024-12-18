import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerakiOrgIdsComponent } from './meraki-org-ids.component';
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

describe('MerakiOrgIdsComponent', () => {
  let component: MerakiOrgIdsComponent;
  let fixture: ComponentFixture<MerakiOrgIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerakiOrgIdsComponent, LocalizationPipe ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
       
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers:[EaidStoreService,NgbActiveModal,VnextStoreService,MessageService,VnextService,ProjectStoreService,{ provide:EaRestService, useClass : MockEaRestService}, 
         EaService, LocalizationService,SubsidiariesStoreService,UtilitiesService,CurrencyPipe,ProposalStoreService,ElementIdConstantsService  
        ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerakiOrgIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call getOrdIdsManageBp', () => {
    const response ={data: {
      orgIds: ['1232132', '123213']
    }}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));

    component.getOrdIdsManageBp()
    expect(component.orgIdsArr).toEqual(['1232132', '123213']);
  });

  it('call getOrdIdsManageBp', () => {
    const event = {
      keyCode:50
    }

    component.isNumberEvent(event)
  });

  it('call checkorgIds', () => {
   component.orgIds = '122332342313'

    component.checkorgIds()
  });

  it('call remove', () => {
    component.orgIds = '122332342313'
     component.remove();
    expect(component.orgIdsArr).toEqual([]);
   });

  it('call save', () => {
    component.orgIds = '122332342313'

    const response ={}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));

    component.save();
    expect(component.disableSave).toBe(true)
  });

  it('should call downoloadOrgId', () => {
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.encryptedEaId = 'test123'
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "downloadDocApiCall").mockReturnValue(of());
    component.downoloadOrgId();
  });

  it('call cancel', () => {
     component.cancel();
    expect(component.orgIdsArr).toEqual([]);
   });

});
