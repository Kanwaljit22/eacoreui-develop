
import {  CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { EaRestService } from 'ea/ea-rest.service';

import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';

import { SpnaEditEnrollmentComponent } from './spna-edit-enrollment.component';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
import { PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

const billingDataMock = {"rid":"EAMP1657635248342","user":"prguntur","error":false,"data":{"billingModels":[{"id":"Prepaid","defaultSelection":true,"uiOption":{"displaySeq":1,"displayName":"Prepaid Term"}},{"id":"Annual","uiOption":{"displaySeq":2,"displayName":"Annual Billing"}}],"term":{"min":12.0,"max":84.0,"defaultTerm":36.0,"maxForEa2Renewal":60.0},"rsd":{"min":0,"max":270,"defaultRsd":90}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1657635248541}
const maxDefaultDateMock = {"rid":"EAMP1657635248342","user":"prguntur","error":false,"data":{"defaultStartDate":1665411248501,"maxStartDate":1680963248501,"minStartDate":1657635248501},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1657635248501}
const selectedEnrollemntDataMock = {
  "id": 1,
  "name": "Networking Infrastructure",
  "primary": true,
  "enrolled": false,
  "displayQnA": false,
  "displaySeq": 1,
  "billingTerm": {
    "rsd": "20230304",
    "billingModel": "Prepaid",
    "billingModelName": "Prepaid Term",
    "term": 35.935483870968,
    "coterm": {
      "endDate": "20260301",
      "subRefId": "SR101753",
      "billDayInMonth": -1
    },
    "eaEndDateStr": "20260203",
    "eaEndDate": 1770105600000
  },
  "commitInfo": {
    "committed": false,
    "fcSuiteCount": 0,
    "pcSuiteCount": 0
  },
  "disabled": false,
  "includedInEAID": true,
  "active": true,
  "externalConfiguration": false,
  "cxOptInAllowed": true,
  "cxAttached": false,
  "service": false,
  "disableRsdAndTermUpdate": false,
  "includedInSubscription": true
}
const proposalDataMock = {
  "objId": "64356c6aa9fd751bf060065f",
  "id": 8984767,
  "projectObjId": "6402cac30f637d55e4b5c46f",
  "projectId": 71767,
  "name": "Copy of prop 4/3 1007",
  "billingTerm": {
    "rsd": "20230304",
    "billingModel": "Prepaid",
    "term": 35.935483870968,
    "coterm": {
      "endDate": "20260301",
      "subRefId": "SR101753",
      "billDayInMonth": -1
    },
    "eaEndDateStr": "20260203",
    "eaEndDate": 1770105600000
  },
  "countryOfTransaction": "US",
  "priceList": {
    "id": "1109",
    "name": "Global Price List - US"
  },
  "currencyCode": "USD",
  "partnerInfo": {
    "beGeoId": 639324,
    "beId": 586064,
    "beGeoName": "ConvergeOne, Inc.",
    "pgtmvBeGeoId": 272241792,
    "countryCode": "US"
  },
  "customer": {
    "accountName": "CHILDREN'S MEDICAL CENTER OF DALLAS",
    "customerGuId": "38284",
    "preferredLegalName": "CHILDREN'S MEDICAL CENTER OF DALLAS",
    "preferredLegalAddress": {
      "addressLine1": "1935 MEDICAL DISTRICT DR",
      "city": "DALLAS",
      "state": "TX",
      "zip": "75235",
      "country": "USA"
    },
    "federalCustomer": false,
    "countryCode": "USA",
    "duoCustomerType": {
      "federalCustomer": true,
      "legacyCustomer": false,
      "subscriptionLines": false,
      "hwTokenLines": false
    },
    "legacyCustomer": false
  },
  "dealInfo": {
    "id": "66495281",
    "statusDesc": "Not Submitted",
    "optyOwner": "mariar",
    "buyMethodDisti": false,
    "type": "CHANGE_SUBSCRIPTION",
    "dealScope": 3,
    "dealSource": 5,
    "dealType": 3,
    "crPartyId": "38284",
    "eaid": "EA5493",
    "prevProposalId": 8983082,
    "changeSusbcriptionDeal": true,
    "partnerDeal": true,
    "distiDeal": false
  },
  "buyingProgram": "BUYING_PGRM_3",
  "locked": false,
  "status": "IN_PROGRESS",
  "initiatedBy": {
    "type": "CISCO",
    "distiInitiated": false,
    "resellerInitiated": false,
    "ciscoInitiated": true
  },
  "audit": {
    "createdBy": "prguntur",
    "createdAt": 1681222762192,
    "updatedBy": "prguntur",
    "updatedAt": 1683130046139
  },
  "priceInfo": {
    "extendedList": 0,
    "unitNet": 0,
    "originalExtendedList": 0,
    "originalUnitList": 0,
    "totalNet": 0,
    "totalNetBeforeCredit": 0,
    "totalNetAfterIBCredit": 0,
    "unitListMRC": 0,
    "unitNetMRC": 0
  },
  "commitInfo": {
    "committed": false,
    "threshold": 100000.0
  },
  "forceAllowCompletion": false,
  "quoteInfo": {},
  "originalProposalId": 8983169,
  "originalProposalObjId": "6402cb0143a4bf57e6699e1b",
  "programEligibility": {
    "eligible": false
  },
  "syncStatus": {"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},
  "deleted": false,
  "scopeInfo": {
    "scopeId": 4880,
    "masterAgreementId": "EA5493",
    "returningCustomer": true,
    "orgInfoAvailableForRc": false,
    "enrollmentsEamsDeliveryByBeGeoId": {
      "272241792": {
        "1": "CISCO"
      }
    },
    "partnerActiveEnrollments": {
      "272241792": [
        {
          "pgtmvBegeoId": "272241792",
          "beGeoName": "ALEXANDER OPEN SYSTEMS",
          "subscriptionRefId": "SR101753",
          "subscriptionId": "SC101759",
          "subscriptionStartDate": "03/02/2023",
          "subscriptionEndDate": "03/01/2026",
          "enrollmentAtos": {
            "1": [
              "E3-N-ENTWAN",
              "E3-N-AIR"
            ],
            "2": [
              "E3-A-HXDP"
            ]
          },
          "atoPids": {
            "E3-N-ENTWAN": [
              "E3N-ENTWAN-P-T1-A",
              "E3N-ENTWAN-P-T3-A",
              "E3N-ENTWAN-P-T2-A",
              "E3N-OP-ENTWAN-S"
            ],
            "E3-N-AIR": [
              "E3N-AIRWLAN-A",
              "E3N-AIR-S"
            ],
            "E3-A-HXDP": [
              "E3A-HXDP-DC-A",
              "E3A-HXDP-S"
            ]
          }
        },
        {
          "pgtmvBegeoId": "272241792",
          "beGeoName": "ALEXANDER OPEN SYSTEMS",
          "subscriptionRefId": "SR101688",
          "subscriptionId": "SC101694",
          "subscriptionStartDate": "03/02/2023",
          "subscriptionEndDate": "03/01/2028",
          "enrollmentAtos": {
            "1": [
              "E3-N-AS"
            ],
            "5": [
              "E3-AS-SVS1"
            ]
          },
          "atoPids": {
            "E3-N-AS": [
              "E3N-IE4000L-A",
              "E3N-C93001-A",
              "E3N-C9400-A",
              "E3N-C93002-A",
              "E3N-C9300S1-A",
              "E3N-IE4010H-A",
              "E3N-AS-S"
            ],
            "E3-AS-SVS1": [
              "E3-CX-S-T1SWP",
              "E3-CX-EAMSC",
              "E3-CX-S-T1NT",
              "E3-CX-S-T1C2P"
            ]
          }
        }
      ]
    },
    "primaryPorDetailsByEnrollment": {
      "1": {
        "enrollmentId": 1,
        "partnerBegeoId": 639324,
        "partnerPgtmvBegeoId": 272241792,
        "partnerBeGeoName": "ConvergeOne, Inc."
      },
      "2": {
        "enrollmentId": 2,
        "partnerBegeoId": 529867,
        "partnerPgtmvBegeoId": 179645785,
        "partnerBeGeoName": "EOS IT Management Solutions Inc"
      }
    }
  },
  "mspInfo": {
    "mspAuthorizedQualcodes": [
      "EA3MSEAPE"
    ],
    "mspProposal": false,
    "mspPartner": true
  },
  "sharedWithDistributor": false,
  "subRefId": "SR101753",
  "statusDesc": "In Progress",
  "allowCompletion": false,
  "summaryViewAllowed": false,
  "changeSubDeal": true
}

class ProposalRestServiceMock {
    getApiCall(url) {
        return of();
    }
  
    postApiCall(url, req) {
        return of()
    }
  
    putApiCall(url, req) {
      return of()
   }
  }

describe('SpnaEditEnrollmentComponent', () => {
  let component: SpnaEditEnrollmentComponent;
  let fixture: ComponentFixture<SpnaEditEnrollmentComponent>;
  let proposalRestService = new ProposalRestServiceMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
            HttpClientTestingModule,
            RouterTestingModule,
            BsDatepickerModule.forRoot(),
            BrowserTestingModule],
      declarations: [ SpnaEditEnrollmentComponent, LocalizationPipe ],
      providers: [ { provide: ProposalRestService, useValue: proposalRestService }, VnextService, UtilitiesService, PriceEstimateService, ProposalStoreService, MessageService, EaRestService, VnextStoreService, ProposalService, EaUtilitiesService, LocalizationService, PriceEstimateStoreService, ProjectStoreService, CurrencyPipe, ProjectService, ProjectRestService, DataIdConstantsService],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaEditEnrollmentComponent);
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData = proposalDataMock;
    component = fixture.componentInstance;
    component.selectedEnrollemnt = selectedEnrollemntDataMock
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on ngoninit', () => {
    const billingModalSpy = jest.spyOn(component, 'getBillingModel');
    component.ngOnInit();
    expect(billingModalSpy).toHaveBeenCalled();
    expect(component.selectedBillingModel).toBeTruthy();
  });

  it('should checkForOverdue', () => {
    component.checkForOverdue();
    expect(component.isOverdue).toBeFalsy();
  });

  it('should checkRsdForServices', () => {
    component.checkRsdForServices();
    expect(component.isRsdMax90Days).toBeFalsy();
    expect(component.datesDisabled.length).toBeFalsy();
  });

  it('should checkRsdForServices', () => {
    const sliderChangeSpy = jest.spyOn(component, 'sliderChange');
    component.sliderChange(45);
    expect(component.selectedDuration).toBeTruthy();
    expect(sliderChangeSpy).toHaveBeenCalled();
  });

  it('should updateDuration', () => {
    const isUpdateEnableSpy = jest.spyOn(component, 'isUpdateEnable');
    component.updateDuration();
    expect(component.selectedDuration).toBeTruthy();
    expect(component.coTerm).toBeTruthy();
    expect(isUpdateEnableSpy).toHaveBeenCalled();
  });

  it('should checkDurationsSelected', () => {
    const isUpdateEnableSpy = jest.spyOn(component, 'isUpdateEnable');
    const sliderChangeSpy = jest.spyOn(component, 'sliderChange');
    const mockEvent: Event = <Event><any>{
        target: {
            value: '45'   
        }
      };
    component.checkDurationsSelected(mockEvent);
    expect(component.selectedDuration).toBeTruthy();
    expect(component.coTerm).toBeTruthy();
    expect(isUpdateEnableSpy).toHaveBeenCalled();
  });

  it('should billingSelected', () => {
    const isUpdateEnableSpy = jest.spyOn(component, 'isUpdateEnable');
    const mockEvent: Event = <Event><any>{
        target: {
            value: "Annual"  
        }
      };
    component.billingSelected(mockEvent);
    expect(component.selectedBillingModel).toBeTruthy();
    expect(isUpdateEnableSpy).toHaveBeenCalled();
  });

  it('should isUpdateEnable', () => {
    component.isUpdateEnable();
    expect(component.disableButton).toBe(false)

    component.selectedEnrollemnt.billingTerm.term = 36;
    component.selectedDuration = 60;
    component.isUpdateEnable();
    expect(component.disableButton).toBe(false)
  });

  it('should getDuration', () => {
    const data = {
        error: false,
        data: 45.45
      }
    let restService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(data))
    component.getDuration();
    expect(component.selectedDuration).toBeTruthy();
  });
  it('should selectOpted', () => {
    component.isChangeSubFlow = true
    component.selectOpted();
    expect(component.showFrequencyDrop).toBe(false);
  });
  it('should selectOpted 1', () => {
    component.isChangeSubFlow = false
    component.selectOpted();
    expect(component.showFrequencyDrop).toBe(false);
  });
  it('should call checkDurationsSelected MONTHS60', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHS60}}
    component.checkDurationsSelected($event);
    expect(component.coTerm).toBeFalsy();
  });
  it('should call checkDurationsSelected MONTHS36', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHS36}}
    component.checkDurationsSelected($event);
    expect(component.coTerm).toBeFalsy();
  });

  it('should call checkDurationsSelected MONTHSCUSTOM', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHSCUSTOM}}
    component.checkDurationsSelected($event);
    expect(component.coTerm).toBeFalsy();
  });

 

  it('should getDuration', () => {
    const data  = billingDataMock
    data.data['capitalFinancingFrequency'] = []
    let restService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(data))
    component.getBillingModel();
    expect(component.billingData).toBeTruthy();
  });
  it('should call setNewCeil', () => {
    component.setNewCeil(84);
    expect(component.showFrequencyDrop).toBe(false);
  });
  it('should call setNewCeil 1', () => {
    component.setNewCeil(60);
    expect(component.showFrequencyDrop).toBe(false);
  });
  it('should call Update', () => {
    const response = {
      error: false,
      data: {enrollments:[{billingTerm:{}}]}
    }
  let restService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(restService, 'postApiCall').mockReturnValue(of(response))
    component.Update();
    expect(component.isUserClickedOnDateSelection).toBe(false);
  });
  it('should call onUserClickDateSelection 1', () => {
    component.onUserClickDateSelection();
    expect(component.isUserClickedOnDateSelection).toBe(true);
  });
  it('should call onDateSelection', () => {
    component.coTerm = true
    component.selectedEnrollemnt.billingTerm = {term: 2}
    component.proposalStoreService.proposalData.billingTerm.rsd = '1111111111111'   
    const event = new Event('change')
    component.isUserClickedOnDateSelection = true
    component.onDateSelection(event);
  });
  // it('should getSelectedFrequencyModal', () => {
  //   component.selectedEnrollemnt.billingTerm.capitalFinancingFrequency = 'test'
  //   component.capitalFinancingData = [{uiOption:{displayName:'test'},id:'1'}]
  //   component.selectedBillingModel = 'abc'
  //   component.selectedEnrollemnt.billingTerm = {term: 2}
  //   component.getSelectedFrequencyModal();
  //   expect(component.showFrequencyDrop).toBe(false);
  // });
  
});
