import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBuyingProgramIdComponent } from './create-buying-program-id.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from '../project-store.service';

import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';
import { VnextService } from 'vnext/vnext.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { HttpClientModule } from '@angular/common/http';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { of } from 'rxjs';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProjectService } from '../project.service';
import { ProjectRestService } from '../project-rest.service';

class MockEaRestService {
  postApiCall() { 
    return of({
      data: {
      },
      error: false
    })
  }

  getApiCall(){
    return of({
      data: {
      },
      error: false
      })
  }
}

describe('CreateBuyingProgramIdComponent', () => {
  let component: CreateBuyingProgramIdComponent;
  let fixture: ComponentFixture<CreateBuyingProgramIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBuyingProgramIdComponent, LocalizationPipe ],
      providers:[ProjectStoreService, DataIdConstantsService, EaService, {provide: EaRestService, useClass: MockEaRestService}, SubsidiariesStoreService,VnextService, ConstantsService, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, ElementIdConstantsService, ProjectService, ProjectRestService],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBuyingProgramIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call getBpIds', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      "objId": "66d181aeaa51ec4e1eafc8f3"
    }
    const res = {
      data: [{
        "eaId":"EA1322432",
        "enrollmentCount":2,
        "suiteCount":3
      }]
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, 'getApiCall').mockReturnValue(of(res));
    component.getBpIds()
    expect(component.allBpIDs).toEqual(res.data);
  });

  it('call getReasonCodes', () => {
    const res = {
      data: {
        reasonInfo: [{
          "id":1,
          "desc":"Reason"
        }]
      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, 'getApiCall').mockReturnValue(of(res));
    component.getReasonCodes()
    expect(component.reasonsList).toEqual(res.data.reasonInfo);
  });

  it('call createNewBpId', () => {
    component.selectedReasons = ["Reason"];
    const res = {
      "data":{

      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, 'postApiCall').mockReturnValue(of(res));
    component.createNewBpId()
  });

  it('call selectReason', () => {
    component.selectedReasons = [{"id":"other",
          "desc":"Reason"}];
    let reason = {
      "id":"2",
      "desc":"Reason1"
      
    }
    component.selectReason(reason)
    expect(component.enterOtherReason).toBe(false);

    reason = {
      "id":"other",
      "desc":"Reason1"
      
    }
    component.selectReason(reason)
    expect(component.enterOtherReason).toBe(true);
  });

  it('call changeBpIDQues', () => {
    let event = {
      target:{
        id: "yes"
      }
    }
    component.selectReason(event)

    event = {
      target:{
        id: "no"
      }
    }
    component.changeBpIDQues(event)
  });

  it('call selectedId', () => {
    let event = {
      eaId:"EA123",
      selected: true
    }
    component.allBpIDs = [
      {
        eaId :"EA123"
      }
    ]
    component.selectedId(event)
    expect(component.isExistingIdSelected ).toBe(true);
  });
});
