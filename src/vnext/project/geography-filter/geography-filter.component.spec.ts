import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from '../project-rest.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';

import { GeographyFilterComponent } from './geography-filter.component';
class MockEaRestService {
  postApiCall() {
    return of({
      data: {

      },
      error: false
    })
  }

  putApiCall(){
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
  getApiCallJson(){
    return of({
      data: {
      },
      error: false
      })
  }
}
const projectData = {
  "rid": "EAMP1727965597929",
  "user": "shashwpa",
  "error": false,
  "data": {
      "objId": "66c62ff702efe50b2a28f3b7",
      "id": 211097,
      "name": "Modify SR202362 - 21-Aug-2024",

      "dealInfo": {
          "id": "98741774",
          "statusDesc": "Not Submitted",
          "optyOwner": "mariar",
          "buyMethodDisti": false,
          "type": "CHANGE_SUBSCRIPTION",
          "directRTM": false,
          "dealScope": 3,
          "dealSource": 5,
          "dealType": '3',
          "eaid": "EA51635",
          "prevProposalId": 20003272,
          "subscriptionUpgradeDeal": true,
          "distiDeal": false,
          "partnerDeal": false,
          "salesLedDeal": false,
          "changeSusbcriptionDeal": true
      },
      "partnerInfo": {
          "beGeoId": 639324,
          "beGeoName": "ConvergeOne, Inc."
      },
      "status": "COMPLETE",
      "locked": false,
      "partnerTeam": {
          "partnerContacts": [
              {
                  "firstName": "Maria",
                  "lastName": "Roark",
                  "name": "Maria Roark",
                  "email": "maria.roark@aos5.com",
                  "userId": "mariar",
                  "userIdSystem": "eyJhbGciOiJIUzUxMiJ9.eyJWQUxVRSI6Im1hcmlhciIsIkxPR0dFRF9JTl9VU0VSIjoic2hhc2h3cGEiLCJpc3MiOiJjY3ctZWFtcCIsInN1YiI6InAtdG9rZW4iLCJpYXQiOjE3Mjc5NjU1OTgsImV4cCI6MTcyODAwMTU5OH0.cJn6yIbFAX0vNplTxyAA_sBqdvsRi5b7AQUqIGx14A_Y4ooMnoHiiYsdFJjEyy1KBseod-dKkQl2AiCBsMtQqg",
                  "notification": true,
                  "webexNotification": true,
                  "notifyByWelcomeKit": true,
                  "src": "AUTO",
                  "ccoId": "mariar"
              },
              {
                  "firstName": "Eric",
                  "lastName": "Eliason",
                  "name": "Eric Eliason",
                  "email": "EEliason@convergeone.com",
                  "userId": "eeliason@convergeone.com",
                  "userIdSystem": "eyJhbGciOiJIUzUxMiJ9.eyJWQUxVRSI6ImVlbGlhc29uQGNvbnZlcmdlb25lLmNvbSIsIkxPR0dFRF9JTl9VU0VSIjoic2hhc2h3cGEiLCJpc3MiOiJjY3ctZWFtcCIsInN1YiI6InAtdG9rZW4iLCJpYXQiOjE3Mjc5NjU1OTgsImV4cCI6MTcyODAwMTU5OH0.0TloXGPASc0y5d8UI9VcF5qsc_rxkFFxhoNfRJc_Sdzzuf-lGGRfrra26U1CZOdxAYIz8h9_iVlkbegSDGvmVw",
                  "notification": true,
                  "webexNotification": true,
                  "notifyByWelcomeKit": true,
                  "beGeoId": 639324,
                  "src": "AUTO",
                  "ccoId": "eeliason@convergeone.com"
              },
              {
                  "firstName": "nancy",
                  "lastName": "lindsay",
                  "name": "nancy lindsay",
                  "email": "nlindsay@convergeone.com",
                  "userId": "00u43oziqa7zypre25d7",
                  "userIdSystem": "eyJhbGciOiJIUzUxMiJ9.eyJWQUxVRSI6IjAwdTQzb3ppcWE3enlwcmUyNWQ3IiwiTE9HR0VEX0lOX1VTRVIiOiJzaGFzaHdwYSIsImlzcyI6ImNjdy1lYW1wIiwic3ViIjoicC10b2tlbiIsImlhdCI6MTcyNzk2NTU5OCwiZXhwIjoxNzI4MDAxNTk4fQ.OUkypkGkPZswyJh_U4mhn2UshYtH6MOtE0w2s0dcCzQp81Z1lm7wFJEUTVRbmMeuRi-67Y2RpJkVt30GhiWeOw",
                  "notification": true,
                  "webexNotification": true,
                  "notifyByWelcomeKit": true,
                  "beGeoId": 639324,
                  "src": "AUTO",
                  "ccoId": "00u43oziqa7zypre25d7"
              }
          ]
      },
      "ciscoTeam": {},
      "deleted": false,
      "audit": {
          "createdBy": "mariar",
          "createdAt": 1724264439230,
          "updatedBy": "mariar",
          "updatedAt": 1724264441329
      },
      "loccDetail": {
          "loccSigned": true,
          "loccInitiated": true,
          "loccOptional": false,
          "loccNotRequired": false,
          "loccExpiredDate": "15-Oct-2024",
          "deferred": false,
 
      },
      "deferLocc": false,
      "ordered": false,
      "initiatedBy": {
          "type": "ONE_T",
          "ciscoInitiated": false,
          "distiInitiated": false,
          "resellerInitiated": false
      },
      "transactionDtl": {
          "cavTransactionId": "EAMP1724264428079"
      },
      "smartAccount": {
          "smrtAccntId": "154939",
          "smrtAccntName": "UNITED WAY OF DUBUQUE AREA TRI-STATES",
          "domain": "dbqunitedway.org",
          "accountType": "customer",
          "virtualAccount": {
              "name": "Services (EA51635)",
              "id": "768041"
          }
      },
      "scopeInfo": {
          "scopeId": 52068,
          "masterAgreementId": "EA51635",
          "returningCustomer": true,
          "orgInfoAvailableForRc": false,
          "eaidSelectionComplete": false,
          "newEaidCreated": false,
          "eaidSelectionLocked": false
      },
      "subRefId": "SR202362",
      "permissions": {
          "featureAccess": [
              {
                  "name": "project.create",
                  "description": "project.create permission",
                  "disabled": false,
                  "defaulted": false
              }
          ]
      },
      "buyingProgram": "BUYING_PGRM_3",
      "scopeChangeInProgress": false,
      "cloneProposalEligible": false,
      "changeSubscriptionDeal": true
  },
  "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE",
  "currentDate": 1727965598119
}
describe('GeographyFilterComponent', () => {
  let component: GeographyFilterComponent;
  let fixture: ComponentFixture<GeographyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographyFilterComponent,LocalizationPipe ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [ProjectService, VnextStoreService, 
        ProjectStoreService, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, DataIdConstantsService,
        {provide: EaRestService, useClass: MockEaRestService}, ElementIdConstantsService,ProposalStoreService ],
      imports: [HttpClientModule, RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call close', () => {
    component.close()
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call deSelectAll', () => {
    component.dealCountry = 'USA'
    const data = {selected:true,countries:[{code:'CA'}]}
    component.deSelectAll(data)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call deSelectAll 1', () => {
    component.dealCountry = 'USA'
    const data = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    component.deSelectAll(data)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call selectAll', () => {
    const data = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    component.selectAll(data)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call selectDeselectAll', () => {
    const data = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    const event ={target:{checked:true}}
    component.selectDeselectAll(event ,data)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call selectDeselectAll 1', () => {
    const data = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    const event ={target:{checked:false}}
    component.selectDeselectAll(event ,data)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call getCountriesList', () => {
    const response = {data: {dealCountry:'USA',list:['USA'],selected:['India','Canada']}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getCountriesList();
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call getCountriesList 1', () => {
    const response = {data: {dealCountry:'USA',list:['USA']}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getCountriesList();
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call changeCountryStatus', () => {
    const theater = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    const event ={target:{checked:false}}
    const countryObj = {code:"USA",name:"USA",theatre:"ACJP",selected:true}
    component.changeCountryStatus(event,countryObj ,theater)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call changeCountryStatus', () => {
    const theater = {selected:true,defaultCountryPresent:true,countries:[{code:'CA'}]}
    const event ={target:{checked:true}}
    const countryObj = {code:"USA",name:"USA",theatre:"ACJP",selected:true}
    component.changeCountryStatus(event,countryObj ,theater)
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call saveSelectedCountries', () => {
    const response = {data: {dealCountry:'USA',list:['USA'],selected:['India','Canada']}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.saveSelectedCountries();
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
  it('should call saveSelectedCountries 1', () => {
    const response = {data: {dealCountry:'USA',list:['USA'],selected:['India','Canada']}}
    component.theatreList = [{totalCountriesCount: 2,selectedCountriesCount:3}]
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.saveSelectedCountries();
    expect(component.projectStoreService.showHideFilterMenu).toBe(false);
  });
});
