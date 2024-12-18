import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrateServiceTierComponent } from './migrate-service-tier.component';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateStoreService } from '../../price-estimate-store.service';
import { CurrencyPipe } from '@angular/common';
import { PriceEstimateService } from '../../price-estimate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MigrateServiceTierComponent', () => {
  let component: MigrateServiceTierComponent;
  let fixture: ComponentFixture<MigrateServiceTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrateServiceTierComponent, LocalizationPipe ],
      imports:[HttpClientTestingModule],
      providers: [ PriceEstimateService,ProjectService,VnextService,PriceEstimateStoreService,ProjectStoreService,CreateProposalStoreService,UtilitiesService,CurrencyPipe,EaRestService,
        EaStoreService,ProjectRestService,VnextStoreService,ProposalService,ProposalStoreService, MessageService, DataIdConstantsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrateServiceTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call prepareMigrateCxData', () => {
    component.cxEnrollmentData = {
      "id": 2,
      "name": "Applications Infrastructure",
      "primary": true,
      "enrolled": false,
      "displayQnA": false,
      "billingTerm": {
          "rsd": "20240601",
          "billingModel": "Prepaid",
          "billingModelName": "Prepaid Term",
          "term": 35.9354838709677,
          "coterm": {
              "endDate": "20270529",
              "subRefId": "SR202045",
              "billDayInMonth": -1
          },
      },
      "commitInfo": {
          "committed": false,
          "fcSuiteCount": 0,
          "pcSuiteCount": 0
      },
      "pools": [
          {
              "name": "Full Stack Observability",
              "desc": "Full Stack Observability",
              "display": true,
              "suites": [
                  {
                      "name": "Intersight",
                      "desc": "Intersight",
                      "ato": "E3-A-INTERSIGHT",
                      "inclusion": false,
                      "disabled": true,
                      "cxOptIn": true,
                      "cxHwSupportAvailable": true,
                      "cxHwSupportOptional": true,
                      "cxTierOptions": [],
                      "displayDiscount": true,
                      "includedInEAID": false,
                      "consentRequired": false,
                      "alreadyPurchasedInDiffEaId": true,
                      "migrated": false
                  },
                  {
                      "name": "AppDynamics",
                      "desc": "AppDynamics",
                      "ato": "E3-A-APPD",
                      "inclusion": true,
                      "tiers": [],
                      "disabled": false,
                      "cxOptIn": true,
                      "cxHwSupportAvailable": false,
                      "displayDiscount": true,
                      "includedInEAID": false,
                      "consentRequired": false,
                      "migrated": true,
                      "migratedTo": {
                          "name": "AppDynamics FSO",
                          "desc": "AppDynamics FSO",
                          "ato": "E3-A-FSO-ABL",
                          "mappingType": [
                              "Partial",
                              "Full"
                          ],
                          "migrationType": "Partial",
                          "selectedTier": "E3-A-FSO-IBL",
                          "selectedTierDesc": "FSO IBL"
                      }
                  },
                  {
                      "name": "AppDynamics FSO",
                      "desc": "AppDynamics FSO",
                      "ato": "E3-A-FSO-ABL",
                      "inclusion": true,
                      "autoSelected": true,
                      "tiers": [
                        {
                          "name": "E3-A-FSO-IBL",
                          "desc": "FSO IBL",
                          "cxOptIn": false,
                          "cxTierOptions":[{
                            "name": "E3-A-FSO-IBL",
                            "desc": "FSO IBL",
                            "cxOptIn": false,
                          }]
                        }
                      ],
                      "disabled": false,
                      "cxOptIn": true,
                      "cxHwSupportAvailable": false,
                      "displayDiscount": true,
                      "includedInEAID": false,
                      "consentRequired": false,
                      "migrated": true,
                      "migratedTo": {
                          "name": "AppDynamics FSO",
                          "desc": "AppDynamics FSO",
                          "ato": "E3-A-FSO-ABL",
                          "mappingType": [
                              "Partial",
                              "Full"
                          ],
                          "migrationType": "Partial",
                          "selectedTier": "E3-A-FSO-IBL",
                          "selectedTierDesc": "FSO IBL"
                      }
                  }
              ],
              "cxSuitesIncludedInPool": false,
          }
      ],
      "disabled": false,
      "includedInEAID": true,
      "externalConfiguration": false,
      "cxOptInAllowed": true,
      "cxAttached": false,
      "eamsDelivery": {
          "partnerDeliverySelected": false
      },
      "disableRsdAndTermUpdate": false,
      "includedInSubscription": true,
      "embeddedHwSupportAttached": false,
      "eligibleForMigration": true,
      "eligibleForUpgrade": false
    }
    const valueObj = {
      "name": "AppDynamics FSO",
      "desc": "AppDynamics FSO",
      "ato": "E3-A-FSO-ABL",
      "autoSelected": true,
      "displaySeq": 2500,
      "tiers": [
          {
              "name": "E3-A-FSO-IBL",
              "desc": "FSO IBL",
              "cxOptIn": false,
              "displaySeq": 2400
          }
      ],
      "displayGroup": true,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "displayDiscount": false,
      "includedInEAID": false,
      "mappingType": [
          "Partial",
          "Full"
      ],
      "migrationType": "Partial",
      "selectedTier": "E3-A-FSO-IBL",
      "selectedTierDesc": "FSO IBL",
      "migrationSourceAtos": [
          {
              "atoName": "E3-A-APPD",
              "migrationType": "Partial",
              "targetAto": "E3-A-FSO-IBL"
          },
          {
              "atoName": "E3-A-APPD-ONP-IBL",
              "migrationType": "Partial",
              "targetAto": "E3-A-FSO-IBL"
          }
      ]
   }
   let priceEstimateService = fixture.debugElement.injector.get(PriceEstimateService);
   const key = "AppDynamics FSO";
   priceEstimateService.suitesMigratedToMap.set(key, valueObj);
   component.prepareMigrateCxData();
   expect(priceEstimateService.migratedSuites).toHaveLength;

  })

  it('call optionalcxHwSelected', () => {
    const suite = {
      cxHwSupportOptedOut : false
    }
    component.optionalcxHwSelected(suite)
    expect(suite.cxHwSupportOptedOut).toBeTruthy();
  });

  it('call openDropdown', () => {
    const suite = {
      showDropdown : false
    }
    const event = {}
    component.openDropdown(event,suite)
    expect(suite.showDropdown).toBeTruthy();
  });

  it('call updateCxInclusion', () => {
    const suite = {
      cxOptIn : true
    }
    const event = {}
    component.updateCxInclusion(suite)
    expect(suite.cxOptIn).toBeFalsy();
  });

  it('call checkAllAttachRate', () => {
    const suite = {
      cxAttachRate : 0
    }
    let event = {
      "target" : {
        "value":"101"
      }
    }
    component.checkAllAttachRate(suite, event)
    expect(suite.cxAttachRate).toBe(100);

    event = {
      "target" : {
        "value":"0"
      }
    }
    component.checkAllAttachRate(suite, event)
    expect(suite.cxAttachRate).toBe(0.00);
  });

  it('call checkValue', () => {
    let event = {
      target : {
        value:10
      }
    }
    const value = 10
    component.checkValue(event,value)
  });

  it('call changeCxTierSelection', () => {
    let tierObj = {
     name: 'Tier 1',
     desc: 'Tier'
    }
    let suite = {
      cxTierDropdown:[{
        name: 'Tier 2',
        desc: 'Tier',
        selected: false
      }],
      cxUpdatedTier: {
        name: 'Tier 2',
        desc: 'Tier'
      }
    }
    const value = 10
    component.changeCxTierSelection(tierObj,suite)
  });

});
