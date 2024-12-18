import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { EaPermissionEnum } from './ea-permissions/ea-permissions';
import { EaPermissionsService, PermissionObj } from './ea-permissions/ea-permissions.service';
import { EaRestService } from './ea-rest.service';
import { EaStoreService } from './ea-store.service';
import { EaService } from './ea.service';

class MockEaRestService {
  getApiCall() {
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
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
  getEampApiCall(){
    return of({
      data: {

      },
    });
  }
  downloadDocApiCall(){
    return of({
      data: {

      },
    });
  }
}

class MockEaPermissionsService {
  userPermissionsMap = new Map<string, PermissionObj>();
  proposalPermissionsMap = new Map<string, PermissionObj>();
  projectPermissionsMap = new Map<string, PermissionObj>();
}

describe('EaService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
     
    ])],
    providers: [UtilitiesService, EaStoreService
    ,ConstantsService,{provide: EaRestService, useClass: MockEaRestService},EaService, {provide: EaPermissionsService, useClass: MockEaPermissionsService}]
  }));

  it('should be created', () => {
    const service: EaService = TestBed.get(EaService);
    expect(service).toBeTruthy();
  });

  it('should redirect', () => {
    const service: EaService = TestBed.get(EaService);
    const url = 'test'
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    service.redirect(url);
    expect(call).toHaveBeenCalled();
  });
  it('should checkForSuperUser', () => {
    const service: EaService = TestBed.get(EaService);
    let eaPermissionsService = new EaPermissionsService();
    let eaStoreService = new EaStoreService();
    eaPermissionsService.userPermissionsMap.set(EaPermissionEnum.RwMessage, {})
    service.checkForSuperUser();
    expect(eaStoreService.isUserRwSuperUser).toBe(false)
  });
  it('should isPartnerUserLoggedIn', () => {
    const service: EaService = TestBed.get(EaService);
    let eaStoreService = new EaStoreService();
    eaStoreService.userInfo =   {accessLevel: 1}
    const returnValue = service.isPartnerUserLoggedIn();
    expect(returnValue).toBe(false)
  });
  it('should showProxy', () => {
    const service: EaService = TestBed.get(EaService);
    const returnValue =  service.showProxy();
    expect(returnValue).toBe(false)
  });

  it('should updateUserEvent', () => {
    const service: EaService = TestBed.get(EaService);
    const data = {}
    const type = 'PROPOSAL'
    const action = ''
    const value = service.updateUserEvent(data,type,action)
    expect(value).toBe(undefined)
  });

  it('should updateUserEvent ACTION_UPSERT', () => {
    const service: EaService = TestBed.get(EaService);
    const data = {}
    const type = 'PROPOSAL'
    const action = 'UPSERT'
    const value = service.updateUserEvent(data,type,action)
    expect(value).toBe(undefined)
  });

  it('should updateUserEvent PROJECT', () => {
    const service: EaService = TestBed.get(EaService);
    const data = {}
    const type = 'PROJECT'
    const action = 'UPSERT'
    const value = service.updateUserEvent(data,type,action)
    expect(value).toBe(undefined)
  });
  it('should updateUserEvent QUALIFICATION', () => {
    const service: EaService = TestBed.get(EaService);
    const data = {}
    const type = 'QUALIFICATION'
    const action = 'UPSERT'
    const value = service.updateUserEvent(data,type,action)
    expect(value).toBe(undefined)
  });
  it('should updateUserEvent QUALIFICATION DELETE', () => {
    const service: EaService = TestBed.get(EaService);
    const data = {}
    const type = 'QUALIFICATION'
    const action = 'DELETE'
    const value = service.updateUserEvent(data,type,action)
    expect(value).toBe(undefined)
  });

  it('should call validateStateForLanguage', () => {
    const service: EaService = TestBed.get(EaService);
    const data = 'ON'
    const value = service.validateStateForLanguage(data)
    expect(value).toBe(false)
  });
  it('should call validateStateForLanguage QC', () => {
    const service: EaService = TestBed.get(EaService);
    const data = 'QC'
    const value = service.validateStateForLanguage(data)
    expect(value).toBe(true)
  });
  it('should call getFlowDetails', () => {
    const service: EaService = TestBed.get(EaService);
    const userInfo = {distiUser: false,partner: true}
    const distiInfoObj = {distiDeal: true,distiDetail: {distiOpportunityOwner: true}}
    const value = service.getFlowDetails(userInfo,distiInfoObj)
    expect(service.isDistiOpty).toBe(true)
  });
  it('should call getFlowDetails isResellerOpty', () => {
    const service: EaService = TestBed.get(EaService);
    const userInfo = {distiUser: true,partner: true}
    const distiInfoObj = {distiDeal: true,distiDetail: {distiOpportunityOwner: false}}
    const value = service.getFlowDetails(userInfo,distiInfoObj)
    expect(service.isResellerOpty).toBe(true)
  });

  it('should call isValidResponseWithData', () => {
    const service: EaService = TestBed.get(EaService);
    const response = {data: true}
    const displayMsgForSection = false
    const value = service.isValidResponseWithData(response,displayMsgForSection)
    expect(value).toBe(true)
  });
  it('should call isValidResponseWithData error', () => {
    const service: EaService = TestBed.get(EaService);
    const response = {data: false}
    const displayMsgForSection = false
    const value = service.isValidResponseWithData(response,displayMsgForSection)
    expect(value).toBe(false)
  });
  it('should call isValidResponseWithoutData error', () => {
    const service: EaService = TestBed.get(EaService);
    const response = {error: true}
    const displayMsgForSection = false
    const value = service.isValidResponseWithoutData(response,displayMsgForSection)
    expect(value).toBe(false)
  });
  it('should call check', () => {
    const service: EaService = TestBed.get(EaService);
    const value = service.check()
    expect(value).toBe(undefined)
  });
  
  it('should call getActiveFeature', () => {
    const service: EaService = TestBed.get(EaService);
    const value = service.getActiveFeature()
    expect(value).toBe(undefined)
  });
  it('should call updateDetailsForNewTab', () => {
    const service: EaService = TestBed.get(EaService);
    const value = service.updateDetailsForNewTab()
    expect(value).toBe(undefined)
  });
  it('should call getLocalizedString', () => {
    const localizationKey = 'common'
    const service: EaService = TestBed.get(EaService);
    const response = {data: {localizedList: [{contentKey:'',contentValue:''}]}}
    let eaRestService = TestBed.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    const value = service.getLocalizedString(localizationKey)
    expect(value).toBe(undefined)
  });
  it('should call getLocalizedString no data', () => {
    const localizationKey = 'common'
    const service: EaService = TestBed.get(EaService);
    
    const value = service.getLocalizedString(localizationKey)
    expect(value).toBe(undefined)
  });
  it('should call getCachedLocalizedString ', () => {
    const localizationKey = 'common'
    const service: EaService = TestBed.get(EaService);
    const response = {result:  [{contentKey:'',contentValue:''}]}
    let eaRestService = TestBed.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCallJson").mockReturnValue(of(response));
    const value = service.getCachedLocalizedString()
    expect(value).toBe(undefined)
  });
  it('should call getCachedLocalizedString localizationKey', () => {
    const localizationKey = 'common'
    const service: EaService = TestBed.get(EaService);
    const response = {result:  [{key:'common',contentKey:'common',contentValue:'common'}]}
    let eaRestService = TestBed.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCallJson").mockReturnValue(of(response));
    const value = service.getCachedLocalizedString(localizationKey)
    expect(value).toBe(undefined)
  });

  it('should call redirectToNewSmartAccount ', () => {
    const service: EaService = TestBed.get(EaService);
    const value = service.redirectToNewSmartAccount()
    expect(value).toBe(undefined)
  });

  it('should call visibleManualIbPull ', () => {
    const response = {value:  'Y'}
    let eaRestService = TestBed.get(EaRestService);
    jest.spyOn(eaRestService, "getEampApiCall").mockReturnValue(of(response));
    const service: EaService = TestBed.get(EaService);
    const value = service.visibleManualIbPull()
    expect(value).toBe(undefined)
  });
  it('should call visibleManualIbPull value: N ', () => {
    const response = {value:  'N'}
    let eaRestService = TestBed.get(EaRestService);
    jest.spyOn(eaRestService, "getEampApiCall").mockReturnValue(of(response));
    const service: EaService = TestBed.get(EaService);
    const value = service.visibleManualIbPull()
    expect(value).toBe(undefined)
  });
  



});
