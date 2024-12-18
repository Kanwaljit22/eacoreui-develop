import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from './price-estimate-store.service';

import { PriceEstimateService } from './price-estimate.service';


class MockProposalRestService {
  getApiCall() {
    return of({
      data: {}
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
}
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

describe('PriceEstimateService', () => {
  let priceEstimateService: PriceEstimateService
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
     
    ])],
    providers: [LocalizationService, ProposalStoreService,UtilitiesService,PriceEstimateStoreService,{provide: ProposalRestService, useClass: MockProposalRestService},VnextService
    ,ConstantsService,{provide: EaRestService, useClass: MockEaRestService},EaService,VnextStoreService,PriceEstimateService,CurrencyPipe,ProjectStoreService]
  }));



  it('should be created', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    expect(service).toBeTruthy();
  });

  it('should call getCopyOfEnrolements', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1}]}
    const enrolmentObject = service.getCopyOfEnrolements(); 
    expect(enrolmentObject).toEqual(service.proposalStoreService.proposalData.enrollments); 
  });

  it('call getExternalConfigData', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    const response = {data:{test :{}}};
    let proposalRestService = new MockProposalRestService();
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    service.getExternalConfigData({id:1});
    //expect(PriceEstimateStoreService['externalConfigReq']).toEqual(response.data);
  });

  it('call prepareGridData', () => {  // with completed proposal -> application 
    const  enrollments:[any] =  
     [ 
      {
        "id": 2,
        "name": "Applications Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "displaySeq": 2,
        "billingTerm": {
          "rsd": "20230829",
          "billingModel": "Prepaid",
          "billingModelName": "Prepaid Term",
          "term": 36,
          "eaEndDateStr": "20260828",
          "eaEndDate": 1787900400000
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 1,
          "pcSuiteCount": 0,
          "fcTcv": 475747.2
        },
        "pools": [
          {
            "name": "Applications",
            "desc": "Full Stack Observability",
            "displaySeq": 1,
            "display": true,
            "suites": [
              {
                "name": "AppDynamics",
                "desc": "AppDynamics",
                "ato": "E3-A-APPD",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 3,
                "discount": {
                  "subsDisc": 20,
                  "servDisc": 20.01,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230829",
                  "billingModel": "Prepaid",
                  "term": 36,
                  "eaEndDateStr": "20260828",
                  "eaEndDate": 1787900400000
                },
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "threshold": 50000,
                  "priceThreshold": {
                    "achieved": 475747.2,
                    "required": 50000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Prod SaaS - Core",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Prod SaaS - Add Ons",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Test/Dev SaaS - Core",
                    "displaySeq": 3
                  },
                  {
                    "id": 4,
                    "name": "Test/Dev SaaS - Add Ons",
                    "displaySeq": 4
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-A-APPD",
                    "desc": "IBL",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-A-APPD-ABL",
                    "desc": "ABL",
                    "cxOptIn": false
                  }
                ],
                "displayGroup": true,
                "lines": [
                  {
                    "id": "APL-APPD-PRD-CIS60D-ADD",
                    "desc": "AppD-Enterprise-60 Day Cloud Index Storage",
                    "displaySeq": 14,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-C",
                    "desc": "AppD Prod - SaaS",
                    "displaySeq": 1,
                    "groupId": 1,
                    "qty": 140,
                    "priceInfo": {
                      "extendedList": 297367.2,
                      "unitNet": 91.76,
                      "totalNet": 237873.6,
                      "totalNetBeforeCredit": 237873.6,
                      "totalSwNet": 237873.6,
                      "totalSwNetBeforeCredit": 237873.6
                    },
                    "ncPriceInfo": {
                      "extendedList": 297367.2,
                      "unitNet": 91.76,
                      "totalNet": 237873.6,
                      "totalNetBeforeCredit": 237873.6
                    },
                    "credit": {}
                  },
                  {
                    "id": "APL-APPD-IBL-RAN90",
                    "desc": "AppD Prod-RUM Analytics-90DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 24,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-IOT-IBL-ADD",
                    "desc": "AppD Peak Edition - IoT (Connected Devices) IBL- SaaS",
                    "displaySeq": 10,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-PK-RUM-ADD",
                    "desc": "AppD Peak Edition - Real User Monitoring - SaaS",
                    "displaySeq": 3,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-IM-ADD",
                    "desc": "AppD Infrastructure Monitoring Edition - SaaS",
                    "displaySeq": 1,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-CIS30D-ADD",
                    "desc": "AppD Enterprise 30-Day Cloud Index Storage",
                    "displaySeq": 13,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-CIS90D-ADD",
                    "desc": "AppD Test & Dev Enterprise 90-Day Cloud Index Storage",
                    "displaySeq": 9,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-BAN30",
                    "desc": "AppD Prod-Browser Analytics-30DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 16,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XBRM60D",
                    "desc": "AppD ExtCloudStg Browser RUM- 60Days 100GB Daily-SaaS IBL",
                    "displaySeq": 30,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-LA-ADD-I",
                    "desc": "AppD Test & Dev Edition - Log Analytics IBL- SaaS",
                    "displaySeq": 6,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-PRD-CIS90D-ADD",
                    "desc": "AppD-Enterprise-90 Day Cloud Index Storage",
                    "displaySeq": 15,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-MAN60",
                    "desc": "AppD Prod-Mobile Analytics-60DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 20,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-RAN60",
                    "desc": "AppD Prod-RUM Analytics-60DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 23,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-CIS30D-ADD",
                    "desc": "AppD Test & Dev Enterprise 30-Day Cloud Index Storage",
                    "displaySeq": 7,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-PRD-BSMPA-ADD-I",
                    "desc": "AppD Pro Browser Synthetic Monitor Private Agent-Per Location SaaS IBL",
                    "displaySeq": 6,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XTA30D",
                    "desc": "AppD ExtCloudStg Trx Analytics- 30Days 100GB Daily-SaaS IBL",
                    "displaySeq": 25,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XBRM8D",
                    "desc": "AppD ExtCloudStg Browser RUM- 8Days 100GB Daily-SaaS IBL",
                    "displaySeq": 31,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-RUM-ADD",
                    "desc": "AppD Test & Dev Edition - Real User Monitoring - SaaS",
                    "displaySeq": 2,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-XMRM90D",
                    "desc": "AppD ExtCloudStg Mobile RUM- 90Days 100GB Daily-SaaS IBL",
                    "displaySeq": 36,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XTA90D",
                    "desc": "AppD ExtCloudStg Trx Analytics- 90Days 100GB Daily-SaaS IBL",
                    "displaySeq": 28,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XMRM8D",
                    "desc": "AppD ExtCloudStg Mobile RUM- 8Days 100GB Daily-SaaS IBL",
                    "displaySeq": 35,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-RUM-ADD-I",
                    "desc": "AppD Peak (Test & Dev) Ed-Real User Monitor-SaaS IBL",
                    "displaySeq": 3,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-XMRM30D",
                    "desc": "AppD ExtCloudStg Mobile RUM- 30Days 100GB Daily-SaaS IBL",
                    "displaySeq": 33,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-RUM30D-ADD",
                    "desc": "AppD Prod-Brwsr/Mob/RUM Analytics 30-Day Cloud Index Stg",
                    "displaySeq": 37,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-CIS60D-ADD",
                    "desc": "AppD Test & Dev Enterprise 60-Day Cloud Index Storage",
                    "displaySeq": 8,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-PRD-PR-BSMPA-ADD",
                    "desc": "AppD Pro Ed - Browser Synthetic User Monitor-Hosted Agent-SaaS",
                    "displaySeq": 4,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-IM-ADD",
                    "desc": "AppD Test & Dev Infrastructure Monitoring Edition",
                    "displaySeq": 1,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-BAN60",
                    "desc": "AppD Prod-Browser Analytics-60DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 17,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-RUM60D-ADD",
                    "desc": "AppD Prod-Brwsr/Mob/RUM Analytics 60-Day Cloud Index Stg",
                    "displaySeq": 38,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-RUM90D-ADD",
                    "desc": "AppD Prod-Brwsr/Mob/RUM Analytics 90-Day Cloud Index Stg",
                    "displaySeq": 39,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-LA-IBL-ADD",
                    "desc": "AppD Pro Edition - Log Analytics IBL- SaaS",
                    "displaySeq": 11,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-MAN90",
                    "desc": "AppD Prod-Mobile Analytics-90DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 21,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XBRM30D",
                    "desc": "AppD ExtCloudStg Browser RUM- 30Days 100GB Daily-SaaS IBL",
                    "displaySeq": 29,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-RAN30",
                    "desc": "AppD Prod-RUM Analytics-30DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 22,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-BAN90",
                    "desc": "AppD Prod-Browser Analytics-90DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 18,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-PKIOT-ADD",
                    "desc": "AppD Peak (Test & Dev Edition)-IoT (Connd Devics) IBL-SaaS",
                    "displaySeq": 5,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-PRD-BSMPA-ADD",
                    "desc": "AppD Pro Browser Synthetic Monitor Private Agent-Per Location SaaS Legacy",
                    "displaySeq": 5,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-RUM60D-ADD",
                    "desc": "AppD Test & Dev Brwsr/Mob/RUM Analytics 60-Day Cloud Index Stg",
                    "displaySeq": 11,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-TD-RUM30D-ADD",
                    "desc": "AppD Test & Dev Brwsr/Mob/RUM Analytics 30-Day Cloud Index Stg",
                    "displaySeq": 10,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-XTA8D",
                    "desc": "AppD ExtCloudStg Trx Analytics- 8Days 100GB Daily-SaaS IBL",
                    "displaySeq": 27,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XBRM90D",
                    "desc": "AppD ExtCloudStg Browser RUM- 90Days 100GB Daily-SaaS IBL",
                    "displaySeq": 32,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-CSA-IBL-ADD",
                    "desc": "AppD with Cisco Secure Application IBL- SaaS",
                    "displaySeq": 9,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-PR-RUM-ADD",
                    "desc": "AppD Pro Edition - Real User Monitoring - SaaS",
                    "displaySeq": 2,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XMRM60D",
                    "desc": "AppD ExtCloudStg Mobile RUM- 60Days 100GB Daily-SaaS IBL",
                    "displaySeq": 34,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-XTA60D",
                    "desc": "AppD ExtCloudStg Trx Analytics- 60Days 100GB Daily-SaaS IBL",
                    "displaySeq": 26,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-RUM90D-ADD",
                    "desc": "AppD Test & Dev Brwsr/Mob/RUM Analytics 90-Day Cloud Index Stg",
                    "displaySeq": 12,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-PRD-LA-CIS30D-ADD",
                    "desc": "AppD Pro/T&D-LogAnlycs-30DayCloudIndexStg Add-on IBL-SaaS",
                    "displaySeq": 12,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-TD-C",
                    "desc": "AppD Test & Dev - SaaS",
                    "displaySeq": 1,
                    "groupId": 3,
                    "qty": 140,
                    "priceInfo": {
                      "extendedList": 297367.2,
                      "unitNet": 91.76,
                      "totalNet": 237873.6,
                      "totalNetBeforeCredit": 237873.6,
                      "totalSwNet": 237873.6,
                      "totalSwNetBeforeCredit": 237873.6
                    },
                    "ncPriceInfo": {
                      "extendedList": 297367.2,
                      "unitNet": 91.76,
                      "totalNet": 237873.6,
                      "totalNetBeforeCredit": 237873.6
                    },
                    "credit": {}
                  },
                  {
                    "id": "APL-APPD-IBL-ENTSAP",
                    "desc": "AppDynamics T&D Ent Edition for SAP Solutions - SaaS IBL",
                    "displaySeq": 4,
                    "groupId": 4
                  },
                  {
                    "id": "APL-APPD-IBL-ENSAP",
                    "desc": "AppDynamics Enterprise Edition for SAP Solutions - SaaS IBL",
                    "displaySeq": 8,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-PRD-BSMPA-ULM-ADD-I",
                    "desc": "AppD Pro Ed-Brwsr Synthic Monitor Prv Agent-Unlmt Loc-SaaS IBL",
                    "displaySeq": 7,
                    "groupId": 2
                  },
                  {
                    "id": "APL-APPD-IBL-MAN30",
                    "desc": "AppD Prod-Mobile Analytics-30DayCldIndStgAdd-on-SaaS IBL",
                    "displaySeq": 19,
                    "groupId": 2
                  }
                ],
                "ibDtls": [
                  {
                    "lineId": "APL-APPD-PRD-C",
                    "pidName": "E3A-APPD-PREM-C",
                    "qty": 0
                  },
                  {
                    "lineId": "APL-APPD-PRD-C",
                    "pidName": "E3A-APPD-EN-C",
                    "qty": 0
                  },
                  {
                    "lineId": "APL-APPD-TD-C",
                    "pidName": "E3A-APPD-T-PREM-C",
                    "qty": 0
                  },
                  {
                    "lineId": "APL-APPD-TD-C",
                    "pidName": "E3A-APPD-T-EN-C",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 594734.4,
                  "unitNet": 0,
                  "totalNet": 475747.2,
                  "totalNetBeforeCredit": 475747.2,
                  "totalSwNet": 475747.2,
                  "totalSwNetBeforeCredit": 475747.2,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
                },
                "ncPriceInfo": {
                  "extendedList": 594734.4,
                  "unitNet": 0,
                  "totalNet": 475747.2,
                  "totalNetBeforeCredit": 475747.2
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "displayDiscount": true,
                "includedInEAID": false,
                "consentRequired": false
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 594734.4,
          "unitNet": 0,
          "totalNet": 475747.2,
          "totalNetBeforeCredit": 475747.2,
          "totalSwNet": 475747.2,
          "totalSwNetBeforeCredit": 475747.2,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
        },
        "ncPriceInfo": {
          "extendedList": 594734.4,
          "unitNet": 0,
          "totalNet": 475747.2,
          "totalNetBeforeCredit": 475747.2
        },
        "disabled": false,
        "includedInEAID": false,
        "active": true,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": true,
        "service": false,
        "disableRsdAndTermUpdate": false
      }]
      
      
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.prepareGridData(enrollments);
    expect(service.showServiceDiscForEnrollment).toBe(false);
  });

  it('call prepareGridData with  Collaboration', () => {  // with Collaboration 
    const  enrollments:[any] =  
    [
      {
        "id": 4,
        "name": "Collaboration",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "displaySeq": 3,
        "billingTerm": {
          "rsd": "20230828",
          "billingModel": "Prepaid",
          "capitalFinancingFrequency": "Annual",
          "billingModelName": "Prepaid Term",
          "term": 36,
          "autoRenewalTerm": 36,
          "capitalFrequencyName": "Annual Billing",
          "eaEndDate": 1787814000000,
          "eaEndDateStr": "20260827"
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 1,
          "pcSuiteCount": 0,
          "fcTcv": 502704
        },
        "pools": [
          {
            "name": "Collaboration",
            "desc": "Webex",
            "displaySeq": 1,
            "display": true,
            "suites": [
              {
                "name": "Cisco Collaboration vNext",
                "desc": "Collaboration",
                "ato": "E3-COLLAB",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 19.42,
                  "servDisc": 19.42,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230828",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "autoRenewalTerm": 36,
                  "eaEndDate": 1787814000000,
                  "eaEndDateStr": "20260827"
                },
                "qtyUnit": "User",
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false
                },
                "displayGroup": false,
                "pids": [
                  {
                    "name": "E3C-TOLLDIALIN",
                    "desc": "Meetings Toll Dial-In Audio (1)",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EVTS-PLF-ENT",
                    "desc": "Webex Events (formerly Socio) Suite EA Provisioning EA 3.0",
                    "displaySeq": 2,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-WEBEX-SUITE",
                    "desc": "EA 3.0 Webex Suite (2)",
                    "displaySeq": 3,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 245916,
                      "unitNet": 18.22,
                      "totalNet": 196776,
                      "totalNetBeforeCredit": 196776
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 300
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-UCXN",
                    "desc": "Unity Connection Smart License (1)",
                    "displaySeq": 4,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 345
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-CL-CA",
                    "desc": "Webex Calling Workspace for Common Area Entitlement",
                    "displaySeq": 5,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 150
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-CA-DEV",
                    "desc": "Webex Calling Workspace for CA Entitlement for Video (2)",
                    "displaySeq": 6,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 345
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EA-BCCB",
                    "desc": "EntW Meetings Bridge Country Call Me / Call Back Audio (1)",
                    "displaySeq": 7,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 114048,
                      "unitNet": 4.22,
                      "totalNet": 91152,
                      "totalNetBeforeCredit": 91152
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "A-EVTS-PLF-EXT-ENT",
                    "desc": "Webex Events (formerly Socio) Suite EA 5X KW External Count",
                    "displaySeq": 8,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 3000
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-CA",
                    "desc": "Common Area Smart License (1)",
                    "displaySeq": 9,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 150
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-EA",
                    "desc": "On-Premises Smart License - EA (1)",
                    "displaySeq": 10,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 345
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-SME-S",
                    "desc": "Session Manager (1)",
                    "displaySeq": 11,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EVENTS-PLF-ENT",
                    "desc": "Webex Events (formerly Socio) Suite EA Entitlement EA 3.0",
                    "displaySeq": 12,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-ACC",
                    "desc": "Access Smart License (1)",
                    "displaySeq": 13,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 60
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-NBR-STG",
                    "desc": "Webex Cloud Recording Storage Entitlement",
                    "displaySeq": 14,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-PROPACK-ENT",
                    "desc": "Pro Pack for Cisco Control Hub Entitlement",
                    "displaySeq": 15,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 690
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EVENTS-ENT",
                    "desc": "Webex Events Entitlement (1)",
                    "displaySeq": 16,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 690
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-ER",
                    "desc": "Emergency Responder Smart License (1)",
                    "displaySeq": 17,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 900
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-WEBEX-P-SUITE",
                    "desc": "Webex Suite EA Cloud Meetings and On Prem Calling",
                    "displaySeq": 18,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 245916,
                      "unitNet": 18.22,
                      "totalNet": 196776,
                      "totalNetBeforeCredit": 196776
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 300
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-P-CALL",
                    "desc": "Prem to Webex Calling - Premises Calling Ent (2)",
                    "displaySeq": 19,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-SW-14-K9",
                    "desc": "On-Premises SW Bundle v14 (1)",
                    "displaySeq": 20,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-MSG-ENT",
                    "desc": "Messaging Entitlement",
                    "displaySeq": 21,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 690
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-C-TA-ITF",
                    "desc": "Committed Global Toll Free (1)",
                    "displaySeq": 22,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EDGEAUD-USER",
                    "desc": "Webex Edge Audio (1)",
                    "displaySeq": 23,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-EXP-RMS",
                    "desc": "Expressway Rich Media Session (1)",
                    "displaySeq": 24,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 60
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-WEBEX-SUPT-BAS",
                    "desc": "Basic Support for Webex Suite",
                    "displaySeq": 25,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-SRST-E",
                    "desc": "SRST Endpoints (1)",
                    "displaySeq": 26,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 600
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-C-TA-BCTF",
                    "desc": "Committed Bridge Country Toll Free (1)",
                    "displaySeq": 27,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-C-PRO",
                    "desc": "Webex Calling Entitlement (2)",
                    "displaySeq": 28,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 345
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-SPCHCON",
                    "desc": "SpeechConnect Smart License (1)",
                    "displaySeq": 29,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 300
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-C-DEV-ENT",
                    "desc": "Cloud Device Registration Entitlement",
                    "displaySeq": 30,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 690
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-FILESTG-ENT",
                    "desc": "File Storage Entitlement",
                    "displaySeq": 31,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 14400
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-VOIP",
                    "desc": "Included VoIP (1)",
                    "displaySeq": 32,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-MSUITE-ENT",
                    "desc": "Cloud Meetings Entitlement",
                    "displaySeq": 33,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 20
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 690
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3C-CS-MNTH",
                    "desc": "Committed Audio Monthly Spend (1)",
                    "displaySeq": 34,
                    "groupId": 1,
                    "discount": {
                      "subsDisc": 0
                    },
                    "priceInfo": {
                      "extendedList": 18000,
                      "unitNet": 1,
                      "totalNet": 18000,
                      "totalNetBeforeCredit": 18000
                    },
                    "credit": {},
                    "dtls": [
                      {
                        "qty": 500
                      }
                    ],
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "priceInfo": {
                  "extendedList": 623880,
                  "unitNet": 0,
                  "totalNet": 502704,
                  "totalNetBeforeCredit": 502704
                },
                "ncPriceInfo": {
                  "extendedList": 623880,
                  "unitNet": 0,
                  "totalNet": 502704,
                  "totalNetBeforeCredit": 502704
                },
                "disabled": false,
                "notAllowedHybridRelated": false,
                "hasBfRelatedMigratedAto": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "type": "COLLAB",
                "displayDiscount": true,
                "changeSubConfig": {
                  "noMidTermPurchaseAllowed": true,
                  "notEligibleForUpgrade": false
                },
                "includedInEAID": false,
                "consentRequired": false
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 623880,
          "unitNet": 0,
          "totalNet": 502704,
          "totalNetBeforeCredit": 502704
        },
        "ncPriceInfo": {
          "extendedList": 623880,
          "unitNet": 0,
          "totalNet": 502704,
          "totalNetBeforeCredit": 502704
        },
        "disabled": false,
        "includedInEAID": false,
        "active": true,
        "externalConfiguration": true,
        "cxOptInAllowed": false,
        "cxAttached": false,
        "service": false,
        "disableRsdAndTermUpdate": false,
        "changeSubConfig": {
          "noMidTermPurchaseAllowed": true,
          "notEligibleForUpgrade": false
        }
      }
    ]
    
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.prepareGridData(enrollments);
    expect(service.showServiceDiscForEnrollment).toBe(false);
  });

  it('call prepareGridData with  security', () => {  // with security 
    const  enrollments:[any] =   [
      {
        "id": 3,
        "name": "Security",
        "primary": false,
        "enrolled": true,
        "displayQnA": true,
        "displaySeq": 4,
        "billingTerm": {
          "rsd": "20230825",
          "billingModel": "Prepaid",
          "capitalFinancingFrequency": "Annual",
          "billingModelName": "Prepaid Term",
          "term": 36,
          "capitalFrequencyName": "Annual Billing",
          "eaEndDate": 1787554800000,
          "eaEndDateStr": "20260824"
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 2,
          "pcSuiteCount": 1,
          "fcTcv": 278340,
          "pcTcv": 1246500
        },
        "pools": [
          {
            "name": "Cloud_and_Network_Security_Solution",
            "desc": "Cloud and Network Security Solution",
            "displaySeq": 2,
            "display": true,
            "suites": [
              {
                "name": "Umbrella",
                "desc": "Umbrella",
                "ato": "E3-SEC-UMBDNSE",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 42,
                  "servDisc": 41.99,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 5,
                    "mpd": 3,
                    "med": 0,
                    "bundleDiscount": 8
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "User",
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 5000,
                    "required": 1000,
                    "calculated": 5000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Umbrella",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Umbrella Investigate API & Console",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Umbrella Multi-Org",
                    "displaySeq": 3
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-SEC-UMBDNSE",
                    "desc": "DNS Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMBDNSA",
                    "desc": "DNS Advantage",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMB-EDU",
                    "desc": "DNS Education",
                    "cxOptIn": false,
                    "educationInstituteOnly": true
                  },
                  {
                    "name": "E3-SEC-UMBSIGE",
                    "desc": "SIG Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMBSIGA",
                    "desc": "SIG Advantage",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-SIG-EDU",
                    "desc": "SIG Education",
                    "cxOptIn": false,
                    "educationInstituteOnly": true
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-UDNSE-MULTIORG",
                    "desc": "Multi-Org Console DNS Ess Add-on",
                    "displaySeq": 1,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UMB-DNSE",
                    "desc": "Umbrella DNS Essentials",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 42,
                      "unitNetDiscount": 42
                    },
                    "priceInfo": {
                      "extendedList": 336150,
                      "unitNet": 13,
                      "totalNet": 195000,
                      "totalNetBeforeCredit": 195000
                    },
                    "ncPriceInfo": {
                      "extendedList": 365400,
                      "unitNet": 14.13,
                      "totalNet": 211950,
                      "totalNetBeforeCredit": 211950
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 5000,
                        "ibQty": 0
                      }
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "commitInfo": {
                      "qtyThreshold": {
                        "achieved": 5000,
                        "required": 0
                      }
                    },
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-S",
                    "desc": "Umbrella Investigate Ess Console & API - S",
                    "displaySeq": 3,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INV-API",
                    "desc": "Umbrella Investigate Integration API and Console",
                    "displaySeq": 2,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-L",
                    "desc": "Umbrella Investigate Ess Console & API - L",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-M",
                    "desc": "Umbrella Investigate Ess Console & API - M",
                    "displaySeq": 4,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVC",
                    "desc": "Umbrella Investigate Console",
                    "displaySeq": 1,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-UMB-DNSE",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 336150,
                  "unitNet": 0,
                  "totalNet": 195000,
                  "totalNetBeforeCredit": 195000,
                  "totalSwNet": 195000,
                  "totalSwNetBeforeCredit": 195000
                },
                "ncPriceInfo": {
                  "extendedList": 365400,
                  "unitNet": 0,
                  "totalNet": 211950,
                  "totalNetBeforeCredit": 211950
                },
                "disabled": false,
                "notAllowedHybridRelated": false,
                "hasBfRelatedMigratedAto": false,
                "active": true,
                "cxOptIn": false,
                "serviceAttachMandatory": true,
                "migration": false,
                "type": "UMBRELLA",
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": true,
                "consentRequired": false
              }
            ]
          },
          {
            "name": "Security_Platform_and_Response_Solution",
            "desc": "Security Platform and Response Solution",
            "displaySeq": 3,
            "display": true,
            "suites": [
              {
                "name": "Secure Email",
                "desc": "Secure Email",
                "ato": "E3-SEC-ES-ADV",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 20,
                  "servDisc": 19.99,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 5,
                    "mpd": 3,
                    "med": 0,
                    "bundleDiscount": 8
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "User",
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 1000,
                    "required": 1000,
                    "calculated": 1000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Secure Email Cloud – Advantage",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Secure Email Gateway – Advantage",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Cloud Mailbox Defense",
                    "displaySeq": 3
                  },
                  {
                    "id": 4,
                    "name": "Support Options",
                    "displaySeq": 4
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-SEC-ES-ESS",
                    "desc": "Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-ES-ADV",
                    "desc": "Advantage",
                    "cxOptIn": false
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-ES-ADV-CES-MFE",
                    "desc": "Security EA 3.0 CES McAfee Anti-Malware License",
                    "displaySeq": 4,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-IA",
                    "desc": "Security EA 3.0 ESA Image Analyzer License",
                    "displaySeq": 6,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-MFE",
                    "desc": "Security EA 3.0 ESA McAfee Anti-Malware License",
                    "displaySeq": 8,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-IMS",
                    "desc": "Security EA 3.0 ESA Intelligent Multi-Scan License",
                    "displaySeq": 7,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CMD",
                    "desc": "Security EA 3.0 Cisco Cloud Mailbox Defense Advantage",
                    "displaySeq": 10,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CES-IA",
                    "desc": "Security EA 3.0 CES Image Analyzer Licence",
                    "displaySeq": 2,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "SVS-E3-EMAIL-B",
                    "desc": "Basic Software Support for Secure Email",
                    "displaySeq": 11,
                    "groupId": 4,
                    "discount": {
                      "servDisc": 0,
                      "unitNetDiscount": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1,
                        "ibQty": 0
                      }
                    ],
                    "type": "BASIC_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3S-ES-ADV-CES-IMS",
                    "desc": "Security EA 3.0 CES Intelligent Multi-Scan License",
                    "displaySeq": 3,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA",
                    "desc": "Security EA 3.0 Cisco Secure Email Advantage",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CES",
                    "desc": "Security EA 3.0 Cisco Secure Email Cloud Advantage",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 20,
                      "unitNetDiscount": 20
                    },
                    "priceInfo": {
                      "extendedList": 104160,
                      "unitNet": 27.78,
                      "totalNet": 83340,
                      "totalNetBeforeCredit": 83340
                    },
                    "ncPriceInfo": {
                      "extendedList": 113220,
                      "unitNet": 30.19,
                      "totalNet": 90570,
                      "totalNetBeforeCredit": 90570
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1000,
                        "ibQty": 0
                      }
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "commitInfo": {
                      "qtyThreshold": {
                        "achieved": 1000,
                        "required": 0
                      }
                    },
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-SMA",
                    "desc": "Security EA 3.0 SMA Centralized Email Management Lic",
                    "displaySeq": 9,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-ES-ADV-CES",
                    "qty": 0
                  },
                  {
                    "pidName": "SVS-E3-EMAIL-B",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 104160,
                  "unitNet": 0,
                  "totalNet": 83340,
                  "totalNetBeforeCredit": 83340,
                  "totalSwNet": 83340,
                  "totalSwNetBeforeCredit": 83340,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
                },
                "ncPriceInfo": {
                  "extendedList": 113220,
                  "unitNet": 0,
                  "totalNet": 90570,
                  "totalNetBeforeCredit": 90570
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "type": "EMAIL",
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": false,
                "consentRequired": false
              }
            ]
          },
          {
            "name": "Add_On_Products",
            "desc": "Add-on Products",
            "displaySeq": 4,
            "display": true,
            "suites": [
              {
                "name": "Cisco Defense Orchestrator (CDO)",
                "desc": "Cisco Defense Orchestrator (CDO)",
                "ato": "E3-SEC-CDO",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 3,
                "discount": {
                  "subsDisc": 42,
                  "servDisc": 42,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "",
                "commitInfo": {
                  "committed": false,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Cisco Defense Orchestrator for ASA",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Cisco Defense Orchestrator for FPR",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Cisco Defense Orchestrator",
                    "displaySeq": 3
                  },
                  {
                    "id": 5,
                    "name": "Cisco Defense Orchestrator Base",
                    "displaySeq": 4
                  },
                  {
                    "id": 4,
                    "name": "Support Options",
                    "displaySeq": 5
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-CDOFPR3110-P",
                    "desc": "Cisco Defense Orchestrator for FPR3110",
                    "displaySeq": 9,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3130-P",
                    "desc": "Cisco Defense Orchestrator for FPR3130",
                    "displaySeq": 11,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1010-P",
                    "desc": "Cisco Defense Orchestrator for FPR1010",
                    "displaySeq": 1,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2120-P",
                    "desc": "Cisco Defense Orchestrator for FPR2120",
                    "displaySeq": 6,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2140-P",
                    "desc": "Cisco Defense Orchestrator for FPR2140",
                    "displaySeq": 8,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO5508P",
                    "desc": "Cisco Defense Orchestrator for ASA5508",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 42,
                      "unitNetDiscount": 42
                    },
                    "priceInfo": {
                      "extendedList": 2149200,
                      "unitNet": 83.1,
                      "totalNet": 1246500,
                      "totalNetBeforeCredit": 1246500
                    },
                    "ncPriceInfo": {
                      "extendedList": 2149200,
                      "unitNet": 83.1,
                      "totalNet": 1246500,
                      "totalNetBeforeCredit": 1246500
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 5000,
                        "ibQty": 0
                      }
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO5516P",
                    "desc": "Cisco Defense Orchestrator for ASA5516",
                    "displaySeq": 3,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4110-P",
                    "desc": "Cisco Defense Orchestrator for FPR4110",
                    "displaySeq": 13,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1150-P",
                    "desc": "Cisco Defense Orchestrator for FPR1150",
                    "displaySeq": 4,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3140-P",
                    "desc": "Cisco Defense Orchestrator for FPR3140",
                    "displaySeq": 12,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4112-P",
                    "desc": "Cisco Defense Orchestrator for FPR4112",
                    "displaySeq": 14,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4115-P",
                    "desc": "Cisco Defense Orchestrator for FPR4115",
                    "displaySeq": 15,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3120-P",
                    "desc": "Cisco Defense Orchestrator for FPR3120",
                    "displaySeq": 10,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO-UMB",
                    "desc": "Cisco Defense Orchestrator for Umbrella",
                    "displaySeq": 1,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-O-CDO-BASE",
                    "desc": "Cisco Defense Orchestrator Base License",
                    "displaySeq": 1,
                    "groupId": 5,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2110-P",
                    "desc": "Cisco Defense Orchestrator for FPR2110",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2130-P",
                    "desc": "Cisco Defense Orchestrator for FPR2130",
                    "displaySeq": 7,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1120-P",
                    "desc": "Cisco Defense Orchestrator for FPR1120",
                    "displaySeq": 2,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4145-P",
                    "desc": "Cisco Defense Orchestrator for FPR4145",
                    "displaySeq": 19,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "SVS-E3S-CDO-B",
                    "desc": "Basic Software Support for CDO",
                    "displaySeq": 1,
                    "groupId": 4,
                    "discount": {
                      "servDisc": 0,
                      "unitNetDiscount": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1,
                        "ibQty": 0
                      }
                    ],
                    "type": "BASIC_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3S-CDOFPR1140-P",
                    "desc": "Cisco Defense Orchestrator for FPR1140",
                    "displaySeq": 3,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4125-P",
                    "desc": "Cisco Defense Orchestrator for FPR4125",
                    "displaySeq": 17,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-CDO5508P",
                    "qty": 0
                  },
                  {
                    "pidName": "SVS-E3S-CDO-B",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 2149200,
                  "unitNet": 0,
                  "totalNet": 1246500,
                  "totalNetBeforeCredit": 1246500,
                  "totalSwNet": 1246500,
                  "totalSwNetBeforeCredit": 1246500,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
                },
                "ncPriceInfo": {
                  "extendedList": 2149200,
                  "unitNet": 0,
                  "totalNet": 1246500,
                  "totalNetBeforeCredit": 1246500
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": false,
                "consentRequired": false
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 2589510,
          "unitNet": 0,
          "totalNet": 1524840,
          "totalNetBeforeCredit": 1524840,
          "totalSwNet": 1524840,
          "totalSwNetBeforeCredit": 1524840,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
        },
        "ncPriceInfo": {
          "extendedList": 2627820,
          "unitNet": 0,
          "totalNet": 1549020,
          "totalNetBeforeCredit": 1549020
        },
        "disabled": false,
        "includedInEAID": false,
        "active": true,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": true,
        "service": false,
        "securityTier": "TIER_3",
        "selectedTierScuRange": {
          "min": 1000,
          "max": 4999
        },
        "disableRsdAndTermUpdate": false
      }
    ]
    
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.prepareGridData(enrollments);
    expect(service.showServiceDiscForEnrollment).toBe(false);
  });
  it('call prepareGridData with  security 1', () => {  // with security 
    const  enrollments:[any] =   [
      {
        "id": 3,
        "name": "Security",
        "primary": false,
        "enrolled": true,
        "displayQnA": true,
        "displaySeq": 4,
        "billingTerm": {
          "rsd": "20230825",
          "billingModel": "Prepaid",
          "capitalFinancingFrequency": "Annual",
          "billingModelName": "Prepaid Term",
          "term": 36,
          "capitalFrequencyName": "Annual Billing",
          "eaEndDate": 1787554800000,
          "eaEndDateStr": "20260824"
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 2,
          "pcSuiteCount": 1,
          "fcTcv": 278340,
          "pcTcv": 1246500
        },
        "pools": [
          {
            "name": "Cloud_and_Network_Security_Solution",
            "desc": "Cloud and Network Security Solution",
            "displaySeq": 2,
            "display": true,
            "suites": [
              {
                "name": "Umbrella",
                "desc": "Umbrella",
                "ato": "E3-SEC-UMBDNSE",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 42,
                  "servDisc": 41.99,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 5,
                    "mpd": 3,
                    "med": 0,
                    "bundleDiscount": 8
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "User",
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 5000,
                    "required": 1000,
                    "calculated": 5000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Umbrella",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Umbrella Investigate API & Console",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Umbrella Multi-Org",
                    "displaySeq": 3
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-SEC-UMBDNSE",
                    "desc": "DNS Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMBDNSA",
                    "desc": "DNS Advantage",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMB-EDU",
                    "desc": "DNS Education",
                    "cxOptIn": false,
                    "educationInstituteOnly": true
                  },
                  {
                    "name": "E3-SEC-UMBSIGE",
                    "desc": "SIG Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-UMBSIGA",
                    "desc": "SIG Advantage",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-SIG-EDU",
                    "desc": "SIG Education",
                    "cxOptIn": false,
                    "educationInstituteOnly": true
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-UDNSE-MULTIORG",
                    "desc": "Multi-Org Console DNS Ess Add-on",
                    "displaySeq": 1,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UMB-DNSE",
                    "desc": "Umbrella DNS Essentials",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 42,
                      "unitNetDiscount": 42
                    },
                    "priceInfo": {
                      "extendedList": 336150,
                      "unitNet": 13,
                      "totalNet": 195000,
                      "totalNetBeforeCredit": 195000
                    },
                    "ncPriceInfo": {
                      "extendedList": 365400,
                      "unitNet": 14.13,
                      "totalNet": 211950,
                      "totalNetBeforeCredit": 211950
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 5000,
                        "ibQty": 0
                      }
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "commitInfo": {
                      "qtyThreshold": {
                        "achieved": 5000,
                        "required": 0
                      }
                    },
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-S",
                    "desc": "Umbrella Investigate Ess Console & API - S",
                    "displaySeq": 3,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INV-API",
                    "desc": "Umbrella Investigate Integration API and Console",
                    "displaySeq": 2,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-L",
                    "desc": "Umbrella Investigate Ess Console & API - L",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVAPI-M",
                    "desc": "Umbrella Investigate Ess Console & API - M",
                    "displaySeq": 4,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-UDNSE-INVC",
                    "desc": "Umbrella Investigate Console",
                    "displaySeq": 1,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-UMB-DNSE",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 336150,
                  "unitNet": 0,
                  "totalNet": 195000,
                  "totalNetBeforeCredit": 195000,
                  "totalSwNet": 195000,
                  "totalSwNetBeforeCredit": 195000
                },
                "ncPriceInfo": {
                  "extendedList": 365400,
                  "unitNet": 0,
                  "totalNet": 211950,
                  "totalNetBeforeCredit": 211950
                },
                "disabled": false,
                "notAllowedHybridRelated": false,
                "hasBfRelatedMigratedAto": false,
                "active": true,
                "cxOptIn": false,
                "serviceAttachMandatory": true,
                "migration": false,
                "type": "UMBRELLA",
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": true,
                "consentRequired": false
              }
            ]
          },
          {
            "name": "Security_Platform_and_Response_Solution",
            "desc": "Security Platform and Response Solution",
            "displaySeq": 3,
            "display": true,
            "suites": [
              {
                "name": "Secure Email",
                "desc": "Secure Email",
                "ato": "E3-SEC-ES-ADV",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 20,
                  "servDisc": 19.99,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 5,
                    "mpd": 3,
                    "med": 0,
                    "bundleDiscount": 8
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "User",
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 1000,
                    "required": 1000,
                    "calculated": 1000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Secure Email Cloud – Advantage",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Secure Email Gateway – Advantage",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Cloud Mailbox Defense",
                    "displaySeq": 3
                  },
                  {
                    "id": 4,
                    "name": "Support Options",
                    "displaySeq": 4
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-SEC-ES-ESS",
                    "desc": "Essentials",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-SEC-ES-ADV",
                    "desc": "Advantage",
                    "cxOptIn": false
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-ES-ADV-CES-MFE",
                    "desc": "Security EA 3.0 CES McAfee Anti-Malware License",
                    "displaySeq": 4,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-IA",
                    "desc": "Security EA 3.0 ESA Image Analyzer License",
                    "displaySeq": 6,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-MFE",
                    "desc": "Security EA 3.0 ESA McAfee Anti-Malware License",
                    "displaySeq": 8,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-IMS",
                    "desc": "Security EA 3.0 ESA Intelligent Multi-Scan License",
                    "displaySeq": 7,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CMD",
                    "desc": "Security EA 3.0 Cisco Cloud Mailbox Defense Advantage",
                    "displaySeq": 10,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CES-IA",
                    "desc": "Security EA 3.0 CES Image Analyzer Licence",
                    "displaySeq": 2,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "SVS-E3-EMAIL-B",
                    "desc": "Basic Software Support for Secure Email",
                    "displaySeq": 11,
                    "groupId": 4,
                    "discount": {
                      "servDisc": 0,
                      "unitNetDiscount": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1,
                        "ibQty": 0
                      }
                    ],
                    "type": "BASIC_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3S-ES-ADV-CES-IMS",
                    "desc": "Security EA 3.0 CES Intelligent Multi-Scan License",
                    "displaySeq": 3,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA",
                    "desc": "Security EA 3.0 Cisco Secure Email Advantage",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-CES",
                    "desc": "Security EA 3.0 Cisco Secure Email Cloud Advantage",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 20,
                      "unitNetDiscount": 20
                    },
                    "priceInfo": {
                      "extendedList": 104160,
                      "unitNet": 27.78,
                      "totalNet": 83340,
                      "totalNetBeforeCredit": 83340
                    },
                    "ncPriceInfo": {
                      "extendedList": 113220,
                      "unitNet": 30.19,
                      "totalNet": 90570,
                      "totalNetBeforeCredit": 90570
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1000,
                        "ibQty": 0
                      }
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "commitInfo": {
                      "qtyThreshold": {
                        "achieved": 1000,
                        "required": 0
                      }
                    },
                    "supportPid": false
                  },
                  {
                    "name": "E3S-ES-ADV-ESA-SMA",
                    "desc": "Security EA 3.0 SMA Centralized Email Management Lic",
                    "displaySeq": 9,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "SUBSCRIPTION",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-ES-ADV-CES",
                    "qty": 0
                  },
                  {
                    "pidName": "SVS-E3-EMAIL-B",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 104160,
                  "unitNet": 0,
                  "totalNet": 83340,
                  "totalNetBeforeCredit": 83340,
                  "totalSwNet": 83340,
                  "totalSwNetBeforeCredit": 83340,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
                },
                "ncPriceInfo": {
                  "extendedList": 113220,
                  "unitNet": 0,
                  "totalNet": 90570,
                  "totalNetBeforeCredit": 90570
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "type": "EMAIL",
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": false,
                "consentRequired": false
              }
            ]
          },
          {
            "name": "Add_On_Products",
            "desc": "Add-on Products",
            "displaySeq": 4,
            "display": true,
            "suites": [
              {
                "name": "Cisco Defense Orchestrator (CDO)",
                "desc": "Cisco Defense Orchestrator (CDO)",
                "ato": "E3-SEC-CDO",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 3,
                "discount": {
                  "subsDisc": 42,
                  "servDisc": 42,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "qtyUnit": "",
                "commitInfo": {
                  "committed": false,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Cisco Defense Orchestrator for ASA",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Cisco Defense Orchestrator for FPR",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Cisco Defense Orchestrator",
                    "displaySeq": 3
                  },
                  {
                    "id": 5,
                    "name": "Cisco Defense Orchestrator Base",
                    "displaySeq": 4
                  },
                  {
                    "id": 4,
                    "name": "Support Options",
                    "displaySeq": 5
                  }
                ],
                "displayGroup": true,
                "pids": [
                  {
                    "name": "E3S-CDOFPR3110-P",
                    "desc": "Cisco Defense Orchestrator for FPR3110",
                    "displaySeq": 9,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3130-P",
                    "desc": "Cisco Defense Orchestrator for FPR3130",
                    "displaySeq": 11,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1010-P",
                    "desc": "Cisco Defense Orchestrator for FPR1010",
                    "displaySeq": 1,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2120-P",
                    "desc": "Cisco Defense Orchestrator for FPR2120",
                    "displaySeq": 6,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2140-P",
                    "desc": "Cisco Defense Orchestrator for FPR2140",
                    "displaySeq": 8,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO5508P",
                    "desc": "Cisco Defense Orchestrator for ASA5508",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 42,
                      "unitNetDiscount": 42
                    },
                    "priceInfo": {
                      "extendedList": 2149200,
                      "unitNet": 83.1,
                      "totalNet": 1246500,
                      "totalNetBeforeCredit": 1246500
                    },
                    "ncPriceInfo": {
                      "extendedList": 2149200,
                      "unitNet": 83.1,
                      "totalNet": 1246500,
                      "totalNetBeforeCredit": 1246500
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 5000,
                        "ibQty": 0
                      }
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO5516P",
                    "desc": "Cisco Defense Orchestrator for ASA5516",
                    "displaySeq": 3,
                    "groupId": 1,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4110-P",
                    "desc": "Cisco Defense Orchestrator for FPR4110",
                    "displaySeq": 13,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1150-P",
                    "desc": "Cisco Defense Orchestrator for FPR1150",
                    "displaySeq": 4,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3140-P",
                    "desc": "Cisco Defense Orchestrator for FPR3140",
                    "displaySeq": 12,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4112-P",
                    "desc": "Cisco Defense Orchestrator for FPR4112",
                    "displaySeq": 14,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4115-P",
                    "desc": "Cisco Defense Orchestrator for FPR4115",
                    "displaySeq": 15,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR3120-P",
                    "desc": "Cisco Defense Orchestrator for FPR3120",
                    "displaySeq": 10,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDO-UMB",
                    "desc": "Cisco Defense Orchestrator for Umbrella",
                    "displaySeq": 1,
                    "groupId": 3,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-O-CDO-BASE",
                    "desc": "Cisco Defense Orchestrator Base License",
                    "displaySeq": 1,
                    "groupId": 5,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2110-P",
                    "desc": "Cisco Defense Orchestrator for FPR2110",
                    "displaySeq": 5,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR2130-P",
                    "desc": "Cisco Defense Orchestrator for FPR2130",
                    "displaySeq": 7,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR1120-P",
                    "desc": "Cisco Defense Orchestrator for FPR1120",
                    "displaySeq": 2,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4145-P",
                    "desc": "Cisco Defense Orchestrator for FPR4145",
                    "displaySeq": 19,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "SVS-E3S-CDO-B",
                    "desc": "Basic Software Support for CDO",
                    "displaySeq": 1,
                    "groupId": 4,
                    "discount": {
                      "servDisc": 0,
                      "unitNetDiscount": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "credit": {
                      "nlCredits": [
                        {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        },
                        {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                        }
                      ]
                    },
                    "dtls": [
                      {
                        "qty": 1,
                        "ibQty": 0
                      }
                    ],
                    "type": "BASIC_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3S-CDOFPR1140-P",
                    "desc": "Cisco Defense Orchestrator for FPR1140",
                    "displaySeq": 3,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  },
                  {
                    "name": "E3S-CDOFPR4125-P",
                    "desc": "Cisco Defense Orchestrator for FPR4125",
                    "displaySeq": 17,
                    "groupId": 2,
                    "dtls": [
                      {}
                    ],
                    "type": "ADD_ON",
                    "discountDirty": false,
                    "supportPid": false
                  }
                ],
                "ibDtls": [
                  {
                    "pidName": "E3S-CDO5508P",
                    "qty": 0
                  },
                  {
                    "pidName": "SVS-E3S-CDO-B",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 2149200,
                  "unitNet": 0,
                  "totalNet": 1246500,
                  "totalNetBeforeCredit": 1246500,
                  "totalSwNet": 1246500,
                  "totalSwNetBeforeCredit": 1246500,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
                },
                "ncPriceInfo": {
                  "extendedList": 2149200,
                  "unitNet": 0,
                  "totalNet": 1246500,
                  "totalNetBeforeCredit": 1246500
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false,
                "displayDiscount": true,
                "includedInEAID": false,
                "qualifiesForHigherScuRange": false,
                "consentRequired": false
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 2589510,
          "unitNet": 0,
          "totalNet": 1524840,
          "totalNetBeforeCredit": 1524840,
          "totalSwNet": 1524840,
          "totalSwNetBeforeCredit": 1524840,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
        },
        "ncPriceInfo": {
          "extendedList": 2627820,
          "unitNet": 0,
          "totalNet": 1549020,
          "totalNetBeforeCredit": 1549020
        },
        "disabled": false,
        "includedInEAID": false,
        "active": true,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": true,
        "service": false,
        "securityTier": "TIER_3",
        "selectedTierScuRange": {
          "min": 1000,
          "max": 4999
        },
        "disableRsdAndTermUpdate": false
      }
    ]
    
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.eaService.features.NPI_AUTOMATION_REL = true
    service.eaService.features.FIRESTORM_REL = true
    service.prepareGridData(enrollments);
    expect(service.showServiceDiscForEnrollment).toBe(false);
  });

  it('call prepareGridData with  service', () => {  // with service 
    const  enrollments:[any] = [
      {
        "id": 5,
        "name": "Services",
        "primary": false,
        "enrolled": true,
        "displayQnA": false,
        "displaySeq": 5,
        "billingTerm": {
          "rsd": "20230825",
          "billingModel": "Prepaid",
          "term": 36,
          "eaEndDate": 1787554800000,
          "eaEndDateStr": "20260824"
        },
        "commitInfo": {
          "committed": false,
          "fcSuiteCount": 2,
          "pcSuiteCount": 0,
          "fcTcv": 50856.12
        },
        "pools": [
          {
            "name": "Cloud_And_Network_Security_Services",
            "desc": "Cloud & Network Security Services",
            "displaySeq": 2,
            "display": true,
            "suites": [
              {
                "name": "Services: Umbrella DNS Essentials",
                "desc": "Services: Umbrella DNS Essentials",
                "ato": "E3-UMBDNSE-SVS1",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 23,
                  "servDisc": 23,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 5000,
                    "required": 1000,
                    "calculated": 5000
                  }
                },
                "groups": [
                  {
                    "id": 1,
                    "name": "Support Options",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Delivery Support Options",
                    "displaySeq": 2
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-UMBDNSE-SVS1",
                    "desc": "Services Tier 1",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-UMBDNSE-SVS2",
                    "desc": "Services Tier 2",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-UMBDNSE-SVS3",
                    "desc": "Services Tier 3",
                    "cxOptIn": false
                  }
                ],
                "displayGroup": false,
                "pids": [
                  {
                    "name": "E3-CX-EAMSP",
                    "desc": "SVCS Portfolio EA Management Service Partner",
                    "displaySeq": 3,
                    "groupId": 2,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_EAMS",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-UMBE-T1SSA",
                    "desc": "SVCS Portfolio T1 Umbrella DNS ESS SW Solution Support - CD",
                    "displaySeq": 1,
                    "groupId": 1,
                    "discount": {
                      "servDisc": 23,
                      "unitNetDiscount": 23
                    },
                    "priceInfo": {
                      "extendedList": 50422.68,
                      "unitNet": 1078.49,
                      "totalNet": 38825.64,
                      "totalNetBeforeCredit": 38825.64
                    },
                    "ncPriceInfo": {
                      "extendedList": 54810,
                      "unitNet": 1172.33,
                      "totalNet": 42203.88,
                      "totalNetBeforeCredit": 42203.88
                    },
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "type": "CX_SOLUTION_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-EAMSC",
                    "desc": "SVCS Portfolio EA Management Service Cisco",
                    "displaySeq": 2,
                    "groupId": 2,
                    "discount": {
                      "servDisc": 23,
                      "unitNetDiscount": 23
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "type": "CX_EAMS",
                    "discountDirty": false,
                    "supportPid": true
                  }
                ],
                "priceInfo": {
                  "extendedList": 50422.68,
                  "unitNet": 0,
                  "totalNet": 38825.64,
                  "totalNetBeforeCredit": 38825.64,
                  "totalSrvcNet": 38825.64,
                  "totalSrvcNetBeforeCredit": 38825.64
                },
                "ncPriceInfo": {
                  "extendedList": 54810,
                  "unitNet": 0,
                  "totalNet": 42203.88,
                  "totalNetBeforeCredit": 42203.88
                },
                "disabled": false,
                "active": true,
                "cxOptIn": true,
                "cxSelectedTier": "E3-UMBDNSE-SVS1",
                "cxHwSupportOptedOut": false,
                "cxTierOptions": [],
                "migration": false,
                "displayDiscount": true,
                "includedInEAID": false,
                "consentRequired": false,
                "cxHwSupportOnlySelected": false,
                "relatedSwAto": "E3-SEC-UMBDNSE",
                "atoTierOptions": [],
                "atoTier": "E3-UMBDNSE-SVS1"
              }
            ]
          },
          {
            "name": "Secure_Platform_And_Response_Services",
            "desc": "Secure Platform & Response Services",
            "displaySeq": 3,
            "display": true,
            "suites": [
              {
                "name": "Services: Secure Email Advantage",
                "desc": "Services: Secure Email Advantage",
                "ato": "E3-ES-ADV-SVS2",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 23,
                  "servDisc": 23,
                  "servPidDisc": 0,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20230825",
                  "billingModel": "Prepaid",
                  "capitalFinancingFrequency": "Annual",
                  "term": 36,
                  "eaEndDate": 1787554800000,
                  "eaEndDateStr": "20260824"
                },
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": false,
                  "overrideEligible": false,
                  "overrideAllowed": false,
                  "qtyThreshold": {
                    "achieved": 1000,
                    "required": 1000,
                    "calculated": 1000
                  }
                },
                "groups": [
                  {
                    "id": 3,
                    "name": "H/w Support Options",
                    "displaySeq": 1
                  },
                  {
                    "id": 2,
                    "name": "Support Options",
                    "displaySeq": 2
                  },
                  {
                    "id": 3,
                    "name": "Delivery Support Options",
                    "displaySeq": 3
                  }
                ],
                "tiers": [
                  {
                    "name": "E3-ES-ADV-SVS1",
                    "desc": "Services Tier 1",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-ES-ADV-SVS2",
                    "desc": "Services Tier 2",
                    "cxOptIn": false
                  },
                  {
                    "name": "E3-ES-ADV-SVS3",
                    "desc": "Services Tier 3",
                    "cxOptIn": false
                  }
                ],
                "displayGroup": false,
                "pids": [
                  {
                    "name": "E3-CX-EAMSP",
                    "desc": "SVCS Portfolio EA Management Service Partner",
                    "displaySeq": 12,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_EAMS",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2NCO",
                    "desc": "SVCS Portfolio T2 8x7xNCD OS ADV Secure Email Support",
                    "displaySeq": 6,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2NC",
                    "desc": "SVCS Portfolio T2 8x7xNCD ADV Secure Email Support",
                    "displaySeq": 2,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2S4P",
                    "desc": "SVCS Portfolio T2 24x7x4 OS ADV Secure Email Support",
                    "displaySeq": 4,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2S2P",
                    "desc": "SVCS Portfolio T2 24x7x2 ADV Secure Email Support",
                    "displaySeq": 7,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2C2P",
                    "desc": "SVCS Portfolio T2 24x7x2 OS ADV Secure Email Support",
                    "displaySeq": 8,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2SWE",
                    "desc": "SVCS Portfolio T2 Secure EML SWSS Enhanced SW Support - OP",
                    "displaySeq": 10,
                    "groupId": 2,
                    "discount": {
                      "servDisc": 0,
                      "unitNetDiscount": 0
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_SOLUTION_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2NP",
                    "desc": "SVCS Portfolio T2 24x7x4 ADV Secure Email Support",
                    "displaySeq": 3,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2SCS",
                    "desc": "SVCS Portfolio T2 8x5xNBD OS ADV Secure Email Support",
                    "displaySeq": 5,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-EAMSC",
                    "desc": "SVCS Portfolio EA Management Service Cisco",
                    "displaySeq": 11,
                    "groupId": 3,
                    "discount": {
                      "servDisc": 23,
                      "unitNetDiscount": 23
                    },
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "type": "CX_EAMS",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2SCE",
                    "desc": "SVCS Portfolio T2 Secure EML SWSS Enhanced SW Support - CLD",
                    "displaySeq": 9,
                    "groupId": 2,
                    "discount": {
                      "servDisc": 23,
                      "unitNetDiscount": 23
                    },
                    "priceInfo": {
                      "extendedList": 15624,
                      "unitNet": 334.18,
                      "totalNet": 12030.48,
                      "totalNetBeforeCredit": 12030.48
                    },
                    "ncPriceInfo": {
                      "extendedList": 16983,
                      "unitNet": 363.25,
                      "totalNet": 13077,
                      "totalNetBeforeCredit": 13077
                    },
                    "dtls": [
                      {
                        "qty": 1
                      }
                    ],
                    "type": "CX_SOLUTION_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  },
                  {
                    "name": "E3-CX-ES-ADV-T2NT",
                    "desc": "SVCS Portfolio T2 8x5xNBD ADV Secure Email Support",
                    "displaySeq": 1,
                    "groupId": 3,
                    "discount": {},
                    "priceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "ncPriceInfo": {
                      "extendedList": 0,
                      "unitNet": 0,
                      "totalNet": 0,
                      "totalNetBeforeCredit": 0
                    },
                    "dtls": [
                      {}
                    ],
                    "type": "CX_HW_SUPPORT",
                    "discountDirty": false,
                    "supportPid": true
                  }
                ],
                "priceInfo": {
                  "extendedList": 15624,
                  "unitNet": 0,
                  "totalNet": 12030.48,
                  "totalNetBeforeCredit": 12030.48,
                  "totalSrvcNet": 12030.48,
                  "totalSrvcNetBeforeCredit": 12030.48
                },
                "ncPriceInfo": {
                  "extendedList": 16983,
                  "unitNet": 0,
                  "totalNet": 13077,
                  "totalNetBeforeCredit": 13077
                },
                "disabled": false,
                "active": true,
                "cxOptIn": true,
                "cxSelectedTier": "E3-ES-ADV-SVS2",
                "cxHwSupportOptedOut": false,
                "cxTierOptions": [],
                "cxAttachRate": 60,
                "migration": false,
                "displayDiscount": true,
                "includedInEAID": false,
                "consentRequired": false,
                "cxHwSupportOnlySelected": false,
                "relatedSwAto": "E3-SEC-ES-ADV",
                "atoTierOptions": [],
                "atoTier": "E3-ES-ADV-SVS2"
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 66046.68,
          "unitNet": 0,
          "totalNet": 50856.12,
          "totalNetBeforeCredit": 50856.12,
          "purchaseAdjustment": 0,
          "totalSrvcNet": 50856.12,
          "totalSrvcNetBeforeCredit": 50856.12
        },
        "ncPriceInfo": {
          "extendedList": 71793,
          "unitNet": 0,
          "totalNet": 55280.88,
          "totalNetBeforeCredit": 55280.88
        },
        "disabled": false,
        "includedInEAID": false,
        "active": true,
        "externalConfiguration": false,
        "cxOptInAllowed": false,
        "cxAttached": true,
        "service": true,
        "eamsDelivery": {
          "partnerDeliverySelected": false
        },
        "awaitingResponse": true,
        "lineInError": true,
        "discountCascadePending": false,
        "hwSupportLinesState": "IN_SYNC",
        "hardwareLinePricesInSync": true,
        "cxSoftwareSupportOnly": false,
        "disableRsdAndTermUpdate": false
      }
    ]
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.prepareGridData(enrollments);
    expect(service.showServiceDiscForEnrollment).toBe(false);
  });

  it('should call prepareServiceSuites', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1}]}
    const enrolmentObject = service.getCopyOfEnrolements(); 


    const upgradeSummaryData = [{eid: 1, suites:[{ato:'test'}]}]
    const serviceSuites = [{eid: 1, suites:[{relatedSwAto:'test'}]}]
    service.prepareServiceSuites(upgradeSummaryData,serviceSuites)
    //expect(enrolmentObject).toEqual(service.proposalStoreService.proposalData.enrollments); 
  });

  it('should call resetErrorIconForPortFolios', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1,hasError:false}]}
    
    service.resetErrorIconForPortFolios()
    expect(service.proposalStoreService.proposalData.enrollments[0].hasError).toBe(false); 
  });

  it('should call converAndCapitalizeFirstLetterOfTier', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1,hasError:false}]}
    const test = 'test_test'
    const value = service.converAndCapitalizeFirstLetterOfTier(test)
    expect(value).toEqual('Test test'); 
  });

  it('should call setErrorIconForPortFolios', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1,hasError:false}], message:{messages:[{severity:'ERROR', groupIdentifier:'1'}]}}

    service.setErrorIconForPortFolios()
    expect(service.proposalStoreService.proposalData.enrollments[0].hasError).toBe(true); 
  });

  it('should call setReqjsonForLovs', () => {
    const requestObj = {
      "data": {
        "enrollments": [{enrollmentId: 1}],
        "buyingProgram": '123'
      }
    }
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {enrollments:[{id: 1,hasError:false}],buyingProgram:'123', message:{messages:[{severity:'ERROR', groupIdentifier:'1'}]}}

    const value = service.setReqjsonForLovs(1,[])
    expect(requestObj).toEqual(value); 
  });
  
  it('call prepareMessageMapForGrid', () => {
    const data = {     
      "messages": [
          {
              "code": "EA066",
              "text": "E3-ISE-SVS3 - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
              "severity": "ERROR",
              "createdAt": 1725969975091,
              "createdBy": "shashwpa",
              "identifier": "E3-ISE-SVS3",
              "level": "ATO",
              "type": "CONFIG",
              "groupIdentifier": "5",
              "key": "EA066"
          },
          {
              "code": "EA066",
              "text": "E3-ISE-SVS3 - Requested Start Date cannot be in past. Please select a new Requested Start Date. New Requested Start Date would impact the subscription price. (CS730)",
              "severity": "ERROR",
              "createdAt": 1725969975091,
              "createdBy": "shashwpa",
              "identifier": "E3-ISE-SVS3",
              "level": "ATO",
              "type": "SERVICE",
              "groupIdentifier": "5",
              "key": "EA066"
          },
       
   
          {
              "code": "EA067",
              "text": "Pricing service error",
              "severity": "ERROR",
              "createdAt": 1725969977347,
              "createdBy": "shashwpa",
              "identifier": "E3-CX-XDRE-T3SC2",
              "parentIdentifier": "E3-XDR-ESS-SVS3",
              "level": "PID",
              "type": "PRICING",
              "groupIdentifier": "5",
              "key": "EA067"
          },
 
     
          {
              "code": "EA037",
              "text": "You need to enter qty for E3-SEC-S-BPE to proceed with proposal submission",
              "severity": "ERROR",
              "createdAt": 1725969977348,
              "createdBy": "shashwpa",
              "identifier": "E3-SEC-S-BPE",
              "level": "ATO",
              "type": "ELIGIBILITY",
              "groupIdentifier": "3",
              "key": "EA037"
          },
          {
              "code": "EA174",
              "text": "E3-ISE-SVS3 - This proposal requires an approval as the minimum ACV of 30000.0 USD requirement is not met for this Service Tier 3 Suite.",
              "severity": "WARN",
              "createdAt": 1725969977496,
              "createdBy": "shashwpa",
              "identifier": "E3-ISE-SVS3",
              "level": "ATO",
              "type": "ELIGIBILITY",
              "groupIdentifier": "66e036342f63367c82c1c73b",
              "key": "EA174"
          },
         
          
      ]
  }
    
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    
    const response = {data:{proposal:{mspInfo:{mspProposal:true}},enrollments :[{cxAttached:true}]}};

    service.prepareMessageMapForGrid(data);
    //expect(PriceEstimateStoreService['externalConfigReq']).toEqual(response.data);
  });

  it('should call checkForMigratedSuites', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    const suite = {migrated:true,migratedFrom:''}
     service.checkForMigratedSuites(suite)
    expect(service.isMigrationSuitesPresentInEnrollment).toBe(true); 
  });

  it('should call setEnrollmentsDiscLovs with data', () => {

    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    const data = {
      "poolSuiteLineName": "Secure Email",
    
      "ato": "E3-SEC-ES-ADV",
      "poolName": "Security Platform and Response",
     
      "inclusion": true,
      "enrollmentId": 3,
      "commitNetPrice": "65,880.00",
      "purchaseAdjustment": "-2,701.80",
      "minDiscount": 0,
      "maxDiscount": 100,
      "weightedDisc": 0,
      "totalConsumedQty": 0,
      "migration": false,
      "type": "",
      "typeDesc": "",
      "lowerTierPidTotalQty": 0,
      "minQty": 0,
      "includedInEAID": false,
      "hideDiscount": false,
      "credit": {
          "perpetual": 2701.8,
          "residual": 2701.8,
          "credits": [
              {
                  "code": "CR-PRIO-200405-10924",
                  "type": "AmortizedMonthly",
                  "name": "Prior Purchase Subscription Residual",
                  "category": "EA_Residual",
                  "totalCredit": 2701.8,
                  "monthlyCredit": 75.05,
                  "nonL2NCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                  "rampName": "EA_Residual",
                  "display": true,
                  "hideDelete": false,
                  "rampCredit": false
              }
          ]
      },
      "disableForRTU": false,
      "listPrice": "102,210.00",
      "tiers": [
          {
              "name": "E3-SEC-ES-ADV",
              "desc": "Advantage",
              "cxOptIn": false,
              "displaySeq": 4910
          },
          {
              "name": "E3-SEC-ES-ESS",
              "desc": "Essentials",
              "cxOptIn": false,
              "displaySeq": 4900
          }
      ],
      "serviceDiscount": 42,
      "subscriptionDiscount": 42,
      "multiProgramDesc": {
          "msd": 10,
          "mpd": 0,
          "med": 0,
          "bundleDiscount": 10,
          "strategicOfferDiscount": 0
      },
      "duration": "36 Months",
      "commitInfo": {
          "committed": true,
          "qtyThreshold": {
              "achieved": 1000,
              "required": 1000,
              "calculated": 1000
          },
          "ibQtyThreshold": null,
          "overrideAllowed": false,
          "overrideEligible": false,
          "overrideRequested": false,
          "overrideReason": "",
          "overrideState": "",
          "achievedInPercent": null
      },
      "childs": [
          {
              "poolSuiteLineName": "Secure Email Cloud – Advantage",
              "poolName": "group"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 Cisco Secure Email Cloud Advantage (E3S-ES-ADV-CES)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-CES",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Cloud – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 CES Image Analyzer Licence (E3S-ES-ADV-CES-IA)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-CES-IA",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Cloud – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 CES Intelligent Multi-Scan License (E3S-ES-ADV-CES-IMS)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-CES-IMS",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Cloud – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 CES McAfee Anti-Malware License (E3S-ES-ADV-CES-MFE)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-CES-MFE",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Cloud – Advantage"
          },
          {
              "poolSuiteLineName": "Secure Email Gateway – Advantage",
              "poolName": "group"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 Cisco Secure Email Advantage (E3S-ES-ADV-ESA)",
              "desiredQty": 1000,
              "totalContractValue": "51,377.88",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "59,730.00",
              "purchaseAdjustment": "-2,382.12",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "credit": {
                  "perpetual": 2382.12,
                  "residual": 2382.12,
                  "credits": [
                      {
                          "code": "CR-PRIO-200405-10924",
                          "type": "AmortizedMonthly",
                          "name": "Prior Purchase Subscription Residual",
                          "category": "EA_Residual",
                          "totalCredit": 2382.12,
                          "monthlyCredit": 66.17,
                          "nonL2NCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "rampName": "EA_Residual",
                          "display": true,
                          "hideDelete": false,
                          "rampCredit": false
                      }
                  ],
                  "nlCredits": [
                      {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": -2381.836721311475,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      }
                  ],
                  "sysPerpetual": 2381.836721311475
              },
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-ESA",
              "ibQty": 1000,
              "listPrice": "92,670.00",
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "commitInfo": {
                  "qtyThreshold": {
                      "achieved": 1000,
                      "required": 0
                  },
                  "ibQtyThreshold": null,
                  "overrideReason": "",
                  "overrideState": "",
                  "achievedInPercent": null
              },
              "groupId": "Secure Email Gateway – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 ESA Image Analyzer License (E3S-ES-ADV-ESA-IA)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-ESA-IA",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Gateway – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 ESA Intelligent Multi-Scan License (E3S-ES-ADV-ESA-IMS)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-ESA-IMS",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Gateway – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 ESA McAfee Anti-Malware License (E3S-ES-ADV-ESA-MFE)",
              "desiredQty": 0,
              "totalContractValue": "--",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-ESA-MFE",
              "ibQty": 0,
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Secure Email Gateway – Advantage"
          },
          {
              "poolSuiteLineName": "Security EA 3.0 SMA Centralized Email Management Lic (E3S-ES-ADV-ESA-SMA)",
              "desiredQty": 1000,
              "totalContractValue": "5,200.32",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "6,150.00",
              "purchaseAdjustment": "-319.68",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "SUBSCRIPTION",
              "typeDesc": "Subscription",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "credit": {
                  "perpetual": 319.68,
                  "residual": 319.68,
                  "credits": [
                      {
                          "code": "CR-PRIO-200405-10924",
                          "type": "AmortizedMonthly",
                          "name": "Prior Purchase Subscription Residual",
                          "category": "EA_Residual",
                          "totalCredit": 319.68,
                          "monthlyCredit": 8.88,
                          "nonL2NCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "rampName": "EA_Residual",
                          "display": true,
                          "hideDelete": false,
                          "rampCredit": false
                      }
                  ],
                  "nlCredits": [
                      {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": -319.549180327868,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      }
                  ],
                  "sysPerpetual": 319.549180327868
              },
              "disableForRTU": false,
              "pidType": "SUBSCRIPTION",
              "supportPid": false,
              "pidName": "E3S-ES-ADV-ESA-SMA",
              "ibQty": 500,
              "listPrice": "9,540.00",
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "commitInfo": {
                  "qtyThreshold": null,
                  "ibQtyThreshold": null,
                  "overrideReason": "",
                  "overrideState": "",
                  "achievedInPercent": null
              },
              "groupId": "Secure Email Gateway – Advantage"
          },
          {
              "poolSuiteLineName": "Support Options",
              "poolName": "group"
          },
          {
              "poolSuiteLineName": "Basic Software Support for Secure Email (SVS-E3-EMAIL-B)",
              "desiredQty": 1,
              "totalContractValue": "0.00",
              "ato": "E3-SEC-ES-ADV",
              "poolName": "Security Platform and Response",
              "id": null,
              "enrollmentId": 3,
              "commitNetPrice": "--",
              "purchaseAdjustment": "--",
              "minDiscount": 0,
              "maxDiscount": 100,
              "weightedDisc": 0,
              "discountDirty": false,
              "totalConsumedQty": 0,
              "migration": false,
              "type": "BASIC_SUPPORT",
              "typeDesc": "BASIC_SUPPORT",
              "lowerTierPidTotalQty": 0,
              "minQty": 0,
              "credit": {
                  "nlCredits": [
                      {
                          "nlCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "PERPETUAL_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      },
                      {
                          "nlCreditType": "SERVICE_RESIDUAL_CREDIT",
                          "totalCredit": 0,
                          "reset": false,
                          "adjusted": false
                      }
                  ]
              },
              "disableForRTU": false,
              "pidType": "BASIC_SUPPORT",
              "supportPid": true,
              "pidName": "SVS-E3-EMAIL-B",
              "ibQty": 0,
              "listPrice": "0.00",
              "serviceDiscount": 42,
              "subscriptionDiscount": 42,
              "groupId": "Support Options"
          }
      ],
      "hasPids": true,
      "total": 0,
      "error": false,
      "arrayOfErrorMessages": [
          "E3-SEC-ES-ADV - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
          "E3-SEC-ES-ADV - Your Requested Start Date (24-Jul-2024) provided is invalid. A valid date range is between  10-Sep-2024 and 08-Dec-2024. Select a new Requested Start Date. (CS639)"
      ],
      "warning": false
  }
  service.priceEstimateStoreService.discountLovs = [
    {
        "id": 3,
        "primary": false,
        "displayQna": false,
        "processingPriority": 0,
        "atos": [
            {
                "name": "E3-SEC-SFW",
                "discount": {
                    "subsDisc": {
                        "min": 0,
                        "max": 100
                    },
                    "servDisc": {
                        "min": 0,
                        "max": 100
                    }
                },
                "eosForNewTransaction": false,
                "defaultSuiteTier": false,
                "commitOverrideEligible": false,
                "displayGroup": false,
                "noMidTermPurchaseAllowed": false,
                "collabAto": false,
                "kennaAto": false
            },
            {
                "name": "E3-SEC-WEB",
                "discount": {
                    "subsDisc": {
                        "min": 0,
                        "max": 100
                    },
                    "servDisc": {
                        "min": 0,
                        "max": 100
                    }
                },
                "eosForNewTransaction": false,
                "defaultSuiteTier": false,
                "commitOverrideEligible": false,
                "displayGroup": false,
                "noMidTermPurchaseAllowed": false,
                "collabAto": false,
                "kennaAto": false
            },
            {
                "name": "E3-SEC-ES-ADV",
                "discount": {
                    "subsDisc": {
                        "min": 0,
                        "max": 100
                    },
                    "servDisc": {
                        "min": 0,
                        "max": 100
                    }
                },
                "eosForNewTransaction": false,
                "defaultSuiteTier": false,
                "commitOverrideEligible": false,
                "displayGroup": false,
                "noMidTermPurchaseAllowed": false,
                "collabAto": false,
                "kennaAto": false
            }
        ],
        "noIbData": false,
        "cxOptInAllowed": false,
        "externalConfiguration": false
    }
]
     service.setEnrollmentsDiscLovs(data)
  //  expect(service.isMigrationSuitesPresentInEnrollment).toBe(true); 
  });

  it('should call setEnrollmentsDiscLovs with data', () => {

    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.selectedAtoArray = [
      {
        "name": "E3-SEC-WEB"
      },
      {
        "name": "E3-SEC-SFW"
      },
      {
        "name": "E3-SEC-ES-ADV"
      }
    ]
    service.priceEstimateStoreService.discountLovs = [
      {
        "id": 3,
        "primary": false,
        "displayQna": false,
        "processingPriority": 0,
        "atos": [
          {
            "name": "E3-SEC-SFW",
            "discount": {
              "subsDisc": {
                "min": 0,
                "max": 100
              },
              "servDisc": {
                "min": 0,
                "max": 100
              }
            },
            "eosForNewTransaction": false,
            "defaultSuiteTier": false,
            "commitOverrideEligible": false,
            "displayGroup": false,
            "noMidTermPurchaseAllowed": false,
            "collabAto": false,
            "kennaAto": false
          },
          {
            "name": "E3-SEC-WEB",
            "discount": {
              "subsDisc": {
                "min": 0,
                "max": 100
              },
              "servDisc": {
                "min": 0,
                "max": 100
              }
            },
            "eosForNewTransaction": false,
            "defaultSuiteTier": false,
            "commitOverrideEligible": false,
            "displayGroup": false,
            "noMidTermPurchaseAllowed": false,
            "collabAto": false,
            "kennaAto": false
          },
          {
            "name": "E3-SEC-ES-ADV",
            "discount": {
              "subsDisc": {
                "min": 0,
                "max": 100
              },
              "servDisc": {
                "min": 0,
                "max": 100
              }
            },
            "eosForNewTransaction": false,
            "defaultSuiteTier": false,
            "commitOverrideEligible": false,
            "displayGroup": false,
            "noMidTermPurchaseAllowed": false,
            "collabAto": false,
            "kennaAto": false
          }
        ],
        "noIbData": false,
        "cxOptInAllowed": false,
        "externalConfiguration": false
      }
    ]
    service.setEnrollmentsDiscLovs()
    //  expect(service.isMigrationSuitesPresentInEnrollment).toBe(true); 
  });

  it('should call prepareDisabledSuite', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    const suite = {desc:'test',eligibleForMigration:true,eligibleForUpgrade:true,upgraded:true};
    const returnValue = service.prepareDisabledSuite(suite)
    expect(returnValue.upgraded).toBe(true); 
  });
  it('should call checkToEnableRecalAll', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.checkToEnableRecalAll()
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(false); 
  });
  it('should call prepareRecalculateAllRequst', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.prepareRecalculateAllRequst(1,'test',true)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(true); 
  });
  it('should call prepareRecalculateAllRequst 1', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.suiteSelectionDelectionRequest = [{atos:[{}]}]
    service.prepareRecalculateAllRequst(1,'test',true)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(true); 
  });
  it('should call prepareRecalculateAllRequst 2', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.suiteSelectionDelectionRequest = [{atos:[{}]}]
    service.suiteSelectionDelectionMap = new Map()
    service.suiteSelectionDelectionMap.set('test',{})
    service.prepareRecalculateAllRequst(1,'test',true)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(true); 
  });
  it('should call updateTireMap', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    const request = {tireToUpdate:{name:'test'},selectedTier:{name:''}}
    service.updateTireMap(request)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(true); 
  });
  it('should call updateTireMap 1', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.updatedTiresMap = new Map()
    service.updatedTiresMap.set('ato',[{name:'test'}])
    service.proposalStoreService.proposalData = {objId:'123'};
    const request = {tireToUpdate:{name:'test'},selectedTier:{name:''},ato:'ato'}
    service.updateTireMap(request)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(false); 
  });
  it('should call updateTireMap 2', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.updatedTiresMap = new Map()
    service.updatedTiresMap.set('ato',[{name:'test1'},{name:''}])
    service.proposalStoreService.proposalData = {objId:'123'};
    const request = {tireToUpdate:{name:'test'},selectedTier:{name:''},ato:'ato'}
    service.updateTireMap(request)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(true); 
  });
  it('should call mergeTireIntoSuiteForRecall', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.updatedTiresMap = new Map()
    service.updatedTiresMap.set('ato',[{name:'test1'},{name:''}])
    service.mergeTireIntoSuiteForRecall(1)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(false); 
  });
  it('should call setReqObjForDisocunts', () => {
    const service: PriceEstimateService = TestBed.get(PriceEstimateService);
    service.proposalStoreService.proposalData = {objId:'123'};
    service.updatedTiresMap = new Map()
    service.selectedAtoArray = [
      {
        "name": "E3-SEC-WEB",
        type: 'KENNA'
      },
      {
        "name": "E3-SEC-SFW"
      },
      {
        "name": "E3-SEC-ES-ADV"
      }
    ]
    service.updatedTiresMap.set('ato',[{name:'test1'},{name:''}])
    service.setReqObjForDisocunts({subsDisc:20},1)
    expect(service.priceEstimateStoreService.enableRecalculateAll).toBe(false); 
  });


  
});
