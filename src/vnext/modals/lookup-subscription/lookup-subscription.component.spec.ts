import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LookupSubscriptionComponent } from './lookup-subscription.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const mockSubscriptionData = {
    "statusDesc": "ACTIVE",
    "subscriptionEndDate": "05/03/2026",
    "subscriptionRefId": "SR103329",
    "subscriptionId": "SC103339",
    "subscriptionStartDate": "05/04/2023",
    "masterAgreementId": "EA6305",
    "offerType": "EA 3.0",
    "dealId": "67472773",
    "webOrderId": "93593559",
    "priceListInfo": {
      "priceListId": 1109
    },
    "currencyCode": "USD"
  }

class MockEaRestService {
    getApiCall() {
        return of({
            data: {
                "statusDesc": "ACTIVE",
                "subscriptionEndDate": "05/03/2026",
                "subscriptionRefId": "SR103329",
                "subscriptionId": "SC103339",
                "subscriptionStartDate": "05/04/2023",
                "masterAgreementId": "EA6305",
                "offerType": "EA 3.0",
                "dealId": "67472773",
            },
        });
    }
    getApiCallJson() {
      return of({
        data: {
  
        },
      });
    }
    postApiCall() {
        return of({
          data: {
    
          },
        });
      }
}


describe('LookupSubscriptionComponent', () => {
  let component: LookupSubscriptionComponent;
  let fixture: ComponentFixture<LookupSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        declarations: [ LookupSubscriptionComponent, LocalizationPipe ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        providers: [NgbActiveModal, EaService, { provide: EaRestService, useClass: MockEaRestService },
            ProjectStoreService, VnextService, VnextStoreService, UtilitiesService, DataIdConstantsService,
             CurrencyPipe,ProposalStoreService, MessageService, ElementIdConstantsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupSubscriptionComponent);
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

  it('call continue method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.continue();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('should matchDealId', () => {
    component.allowChange = false;
    component.matchDealId();
    expect(component.allowChange).toBeTruthy();
  });

  it('should call getProjectData ', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    const getDurationFunction = jest.spyOn(component, "getDuration");
    const response = {data: mockSubscriptionData}
    projectStoreService.projectData.objId = '123';
    component.newSubscriptionId = 'SR103329'
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.lookUpSubscription();
    expect(component.searchedSubscription).toBeTruthy();
    expect(getDurationFunction).toHaveBeenCalled();
  });


  it('should call getDuration', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    const selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate = new Date()
    projectStoreService.projectData = {objId: '123'}
    const response = {data : 123} 
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getDuration(selectedSubscription);
    expect(component.selectedDuration).toEqual(response.data);
    expect(component.displayDurationMsg).toBeFalsy();
  });
  it('should call getDuration error in res', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    const selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate = new Date()
    projectStoreService.projectData = {objId: '123'}
    const response = {data : 123, error: true} 
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getDuration(selectedSubscription);
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });
});
