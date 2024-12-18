import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicOfferComponent } from './strategic-offer.component';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { VnextService } from 'vnext/vnext.service';
import { IAtoTier, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { QuestionnaireStoreService } from '../questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { of } from 'rxjs';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const testData  = {
  data: {
    strategicOffers:{
      "offerName": "LPS SO4",
      "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
      "atos": [
          {
              "name": "E3-A-APPD-ONP-ABL",
              "desc": "AppDynamics On-Prem-ABL",
              "selected": false,
              "strategicOfferDiscount": "9",
              "enrollmentId": 2
          }
      ],
      "suites": [
          {
              "name": "AppDynamics OnPrem",
              "desc": "AppDynamics On-Prem",
              "ato": "E3-A-APPD-ONP-IBL",
              "mandatory": true,
              "inclusion": true,
              "active": true,
              "displaySeq": 4,
              "displayGroup": true,
              "tiers": [
                  {
                      "name": "E3-A-APPD-ONP-ABL",
                      "desc": "ABL",
                      "active": true,
                      "defaultTier": false
                  }
              ],
              "commitOverrideEligible": false
          }
      ]
  }
  },
  error: false
  }
class MockProposalRestService {

  getApiCall(url){
    return of(testData)
  }

  postApiCall(){
    return of(testData)
  }
}


describe('StrategicOfferComponent', () => {
  let component: StrategicOfferComponent;
  let fixture: ComponentFixture<StrategicOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategicOfferComponent, LocalizationPipe ],
      providers: [ PriceEstimateStoreService,  LocalizationService, DataIdConstantsService, VnextService, ProposalStoreService, QuestionnaireStoreService, QuestionnaireService, ConstantsService, EaService, MessageService, VnextStoreService, ProjectStoreService, UtilitiesService,CurrencyPipe,EaRestService,  ProposalRestService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrategicOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('call getOffers', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData = {
      objId : 'test12'
    }
    let res = {
      data: {
        strategicOffers:[
          {
            "offerName": "HYBRID WORK OFFICE 2",
            "qualificationName": "Identity Services Engine (ISE) AND Duo-Access AND Umbrella-DNS Advantage AND Cisco Collaboration vNext",
            "atos": [
                {
                    "name": "E3-SEC-UMBDNSA",
                    "desc": "Umbrella-DNS Advantage",
                    "selected": false,
                    "strategicOfferDiscount": "5",
                    "enrollmentId": 3
                },
                {
                    "name": "E3-SEC-DUO-ACS",
                    "desc": "Duo-Access",
                    "selected": false,
                    "strategicOfferDiscount": "5",
                    "enrollmentId": 3
                },
                {
                    "name": "E3-SEC-ISE",
                    "desc": "Identity Services Engine (ISE)",
                    "selected": false,
                    "strategicOfferDiscount": "0",
                    "enrollmentId": 3
                },
                {
                    "name": "E3-COLLAB",
                    "desc": "Collaboration",
                    "selected": false,
                    "strategicOfferDiscount": "5",
                    "enrollmentId": 4
                }
            ],
            "suites": [
                {
                    "name": "Duo",
                    "desc": "Duo",
                    "ato": "E3-SEC-DUO-ADV",
                    "mandatory": true,
                    "inclusion": true,
                    "active": true,
                    "displaySeq": 2,
                    "displayGroup": true,
                    "tiers": [
                        {
                            "name": "E3-SEC-DUO-ACS",
                            "desc": "Access",
                            "active": true,
                            "defaultTier": false
                        }
                    ],
                    "commitOverrideEligible": false
                },
                {
                    "name": "Identity Services Engine (ISE)",
                    "desc": "Identity Services Engine (ISE)",
                    "ato": "E3-SEC-ISE",
                    "mandatory": true,
                    "inclusion": true,
                    "active": true,
                    "displaySeq": 1,
                    "displayGroup": true,
                    "commitOverrideEligible": false
                },
                {
                    "name": "Cisco Collaboration vNext",
                    "desc": "Collaboration",
                    "ato": "E3-COLLAB",
                    "mandatory": true,
                    "inclusion": true,
                    "active": true,
                    "displaySeq": 1,
                    "displayGroup": false,
                    "commitOverrideEligible": false,
                    "changeSubConfig": {
                        "noMidTermPurchaseAllowed": true,
                        "notEligibleForUpgrade": false
                    }
                },
                {
                    "name": "Umbrella",
                    "desc": "Umbrella",
                    "ato": "E3-SEC-UMBDNSE",
                    "mandatory": true,
                    "inclusion": true,
                    "active": true,
                    "displaySeq": 1,
                    "displayGroup": true,
                    "serviceAttachMandatory": true,
                    "tiers": [
                        {
                            "name": "E3-SEC-UMBDNSA",
                            "desc": "DNS Advantage",
                            "active": true,
                            "defaultTier": false
                        }
                    ],
                    "commitOverrideEligible": false
                }
            ]
        },
          
          {
          "offerName": "LPS SO4",
          "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
          "atos": [
              {
                  "name": "E3-A-APPD-ONP-ABL",
                  "desc": "AppDynamics On-Prem-ABL",
                  "selected": false,
                  "strategicOfferDiscount": "9",
                  "enrollmentId": 2
              }
          ],
          "suites": [
              {
                  "name": "AppDynamics OnPrem",
                  "desc": "AppDynamics On-Prem",
                  "ato": "E3-A-APPD-ONP-IBL",
                  "mandatory": true,
                  "inclusion": true,
                  "active": true,
                  "displaySeq": 4,
                  "displayGroup": true,
                  "tiers": [
                      {
                          "name": "E3-A-APPD-ONP-ABL",
                          "desc": "ABL",
                          "active": true,
                          "defaultTier": false
                      }
                  ],
                  "commitOverrideEligible": false
              }
          ]
      }]
      },
      error: false
      }
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(res));
    component.getOffers();
    expect(component.strategicOffers).toHaveLength;

   let responseError = {
      error: true 
    }
    let msgService = fixture.debugElement.injector.get(MessageService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(responseError));
    component.getOffers();
    expect(msgService.disaplyModalMsg).toBeTruthy
  });

  it('call close', () => {
    let service = fixture.debugElement.injector.get(PriceEstimateStoreService);
    component.close();
    expect(service.showStrategicOffers).toBeFalsy;
  });

  it('call closeModal', () => {
    let service = fixture.debugElement.injector.get(PriceEstimateStoreService);
    component.closeModal();
    expect(service.showStrategicOffers).toBeFalsy;
  });

  it('call moveRight', () => {
    component.start = 1
    component.moveRight();
    expect(component.start).toBe(2);
  });

  it('call moveLeft', () => {
    component.start = 2
    component.moveLeft();
    expect(component.start).toBe(1);
  });

  it('call setPosition', () => {
    component.strategicOffers = [
      {
        "offerName": "HYBRID WORK OFFICE 2",
        "qualificationName": "Identity Services Engine (ISE) AND Duo-Access AND Umbrella-DNS Advantage AND Cisco Collaboration vNext",
        "atos": [
            {
                "name": "E3-SEC-UMBDNSA",
                "desc": "Umbrella-DNS Advantage",
                "selected": false,
                "strategicOfferDiscount": "5",
                "enrollmentId": 3
            },
            {
                "name": "E3-SEC-DUO-ACS",
                "desc": "Duo-Access",
                "selected": false,
                "strategicOfferDiscount": "5",
                "enrollmentId": 3
            },
            {
                "name": "E3-SEC-ISE",
                "desc": "Identity Services Engine (ISE)",
                "selected": false,
                "strategicOfferDiscount": "0",
                "enrollmentId": 3
            },
            {
                "name": "E3-COLLAB",
                "desc": "Collaboration",
                "selected": false,
                "strategicOfferDiscount": "5",
                "enrollmentId": 4
            }
        ],
        "suites": [
            {
                "name": "Duo",
                "desc": "Duo",
                "ato": "E3-SEC-DUO-ADV",
                "mandatory": true,
                "inclusion": true,
                "active": true,
                "displaySeq": 2,
                "displayGroup": true,
                "tiers": [
                    {
                        "name": "E3-SEC-DUO-ACS",
                        "desc": "Access",
                        "active": true,
                        "defaultTier": false
                    }
                ],
                "commitOverrideEligible": false
            },
            {
                "name": "Identity Services Engine (ISE)",
                "desc": "Identity Services Engine (ISE)",
                "ato": "E3-SEC-ISE",
                "mandatory": true,
                "inclusion": true,
                "active": true,
                "displaySeq": 1,
                "displayGroup": true,
                "commitOverrideEligible": false
            },
            {
                "name": "Cisco Collaboration vNext",
                "desc": "Collaboration",
                "ato": "E3-COLLAB",
                "mandatory": true,
                "inclusion": true,
                "active": true,
                "displaySeq": 1,
                "displayGroup": false,
                "commitOverrideEligible": false,
                "changeSubConfig": {
                    "noMidTermPurchaseAllowed": true,
                    "notEligibleForUpgrade": false
                }
            },
            {
                "name": "Umbrella",
                "desc": "Umbrella",
                "ato": "E3-SEC-UMBDNSE",
                "mandatory": true,
                "inclusion": true,
                "active": true,
                "displaySeq": 1,
                "displayGroup": true,
                "serviceAttachMandatory": true,
                "tiers": [
                    {
                        "name": "E3-SEC-UMBDNSA",
                        "desc": "DNS Advantage",
                        "active": true,
                        "defaultTier": false
                    }
                ],
                "commitOverrideEligible": false
            }
        ]
    },
      
      {
      "offerName": "LPS SO4",
      "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
      "atos": [
          {
              "name": "E3-A-APPD-ONP-ABL",
              "desc": "AppDynamics On-Prem-ABL",
              "selected": false,
              "strategicOfferDiscount": "9",
              "enrollmentId": 2
          }
      ],
      "suites": [
          {
              "name": "AppDynamics OnPrem",
              "desc": "AppDynamics On-Prem",
              "ato": "E3-A-APPD-ONP-IBL",
              "mandatory": true,
              "inclusion": true,
              "active": true,
              "displaySeq": 4,
              "displayGroup": true,
              "tiers": [
                  {
                      "name": "E3-A-APPD-ONP-ABL",
                      "desc": "ABL",
                      "active": true,
                      "defaultTier": false
                  }
              ],
              "commitOverrideEligible": false
          }
      ]
  }
    ]
    component.start = 2
    component.setPosition();
  });  

  it('call selectOffer', () => {
    let event = {
      target : {
        checked : true
      }
    }
    let offer = {
            "offerName": "LPS SO4",
            "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
            "atos": [
                {
                    "name": "E3-A-APPD-ONP-ABL",
                    "desc": "AppDynamics On-Prem-ABL",
                    "selected": false,
                    "strategicOfferDiscount": "9",
                    "enrollmentId": 3
                }
            ],
            "suites": [
                {
                    "name": "AppDynamics OnPrem",
                    "desc": "AppDynamics On-Prem",
                    "ato": "E3-A-APPD-ONP-IBL",
                    "mandatory": true,
                    "inclusion": true,
                    "active": true,
                    "displaySeq": 4,
                    "displayGroup": true,
                    "tiers": [
                        {
                            "name": "E3-A-APPD-ONP-ABL",
                            "desc": "ABL",
                            "active": true,
                            "defaultTier": false
                        }
                    ],
                    "commitOverrideEligible": false
                }
            ]
        }

     component.selectOffer(event, offer);
     expect(component.selectedOffer).toHaveLength;   

     event = {
      target : {
        checked : false
      }
    }

    offer = {
          "offerName": "LPS SO4",
          "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
          "atos": [
              {
                  "name": "E3-A-APPD-ONP-ABL",
                  "desc": "AppDynamics On-Prem-ABL",
                  "selected": false,
                  "strategicOfferDiscount": "9",
                  "enrollmentId": 2
              }
          ],
          "suites": [
              {
                  "name": "AppDynamics OnPrem",
                  "desc": "AppDynamics On-Prem",
                  "ato": "E3-A-APPD-ONP-IBL",
                  "mandatory": true,
                  "inclusion": true,
                  "active": true,
                  "displaySeq": 4,
                  "displayGroup": true,
                  "tiers": [
                      {
                          "name": "E3-A-APPD-ONP-ABL",
                          "desc": "ABL",
                          "active": true,
                          "defaultTier": false
                      }
                  ],
                  "commitOverrideEligible": false
              }
          ]
      }

    component.selectOffer(event, offer);
     expect(component.isSecuritySuiteAdded).toBeFalsy;   
  });

  it('call getOffers', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData = {
      objId : 'test12'
    }
    let res = {
      data: [
        {
            "id": "tier",
            "desc": "Select one of the Tiers",
            "displayType": "radio",
            "mandatory": true,
            "answers": [
                {
                    "id": "tier_qna_tier0",
                    "value": "TIER_0",
                    "desc": "Access Only"
                },
                {
                    "id": "tier_qna_tier1",
                    "value": "TIER_1",
                    "desc": "Tier 1"
                },
                {
                    "id": "tier_qna_tier2",
                    "value": "TIER_2",
                    "desc": "Tier 2"
                },
                {
                    "id": "tier_qna_tier3",
                    "value": "TIER_3",
                    "desc": "Tier 3",
                    "defaultSel": true,
                    "recommended": true
                },
                {
                    "id": "tier_qna_tier4",
                    "value": "TIER_4",
                    "desc": "Tier 4"
                },
                {
                    "id": "tier_qna_tier5",
                    "value": "TIER_5",
                    "desc": "Tier 5"
                },
                {
                    "id": "tier_qna_tier6",
                    "value": "TIER_6",
                    "desc": "Tier 6"
                }
            ],
            "additionalInfo": {
                "scuCountRange": {
                    "TIER_1": {
                        "min": 100,
                        "max": 499
                    },
                    "TIER_2": {
                        "min": 500,
                        "max": 999
                    },
                    "TIER_3": {
                        "min": 1000,
                        "max": 4999
                    },
                    "TIER_4": {
                        "min": 5000,
                        "max": 9999
                    },
                    "TIER_5": {
                        "min": 10000,
                        "max": 24999
                    },
                    "TIER_6": {
                        "min": 25000,
                        "max": 999999999
                    }
                },
                "threshold": [
                    {
                        "name": "E3-SEC-DUO-MFA",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-ACS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-BYD",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-FEDMFA",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-FEDACS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EDUMFA",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EDUACS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EDUBYD",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-ESS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-ADV",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-PRE",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EES-F",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EES-FS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EES-HC",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EAD-F",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EAD-FS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EAD-HC",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EPR-F",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EPR-FS",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-DUO-EPR-HC",
                        "desc": "Duo",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-KENNA",
                        "desc": "Cisco Vulnerability Management",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-KENNA-PRE",
                        "desc": "Cisco Vulnerability Management",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-ISE",
                        "desc": "Identity Services Engine (ISE)",
                        "qtyUnit": "Sessions",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-WKLD",
                        "desc": "Secure Workload",
                        "qtyUnit": "Workloads",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 100,
                            "TIER_3": 100,
                            "TIER_4": 500,
                            "TIER_5": 1000,
                            "TIER_6": 2500
                        }
                    },
                    {
                        "name": "E3-SEC-UMBDNSE",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-UMBDNSA",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-UMBSIGE",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-UMBSIGA",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-UMB-EDU",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-WEB",
                        "desc": "Secure Web",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-SFW",
                        "desc": "Secure Firewall",
                        "qtyUnit": "commit value ($$UI-CurrencyCode$$)",
                        "tiersPriceThreshold": {
                            "TIER_1": 7500,
                            "TIER_2": 15000,
                            "TIER_3": 30000,
                            "TIER_4": 112500,
                            "TIER_5": 225000,
                            "TIER_6": 450000
                        }
                    },
                    {
                        "name": "E3-SEC-ES-ESS",
                        "desc": "Secure Email",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-ES-ADV",
                        "desc": "Secure Email",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-ESS",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-ADV",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-PRM",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-ESS-EDU",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-ADV-EDU",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-EP-PRM-EDU",
                        "desc": "Secure Endpoint",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-SIG-EDU",
                        "desc": "Umbrella",
                        "qtyUnit": "User",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    },
                    {
                        "name": "E3-SEC-NWCLDA",
                        "desc": "Secure Network & Cloud Analytics",
                        "qtyUnit": "Flows",
                        "tiersQtyThreshold": {
                            "TIER_1": 100,
                            "TIER_2": 500,
                            "TIER_3": 1000,
                            "TIER_4": 5000,
                            "TIER_5": 10000,
                            "TIER_6": 25000
                        }
                    }
                ]
            }
        },
        {
            "id": "edu_institute",
            "desc": "Is this an Educational Institution?",
            "displayType": "radio",
            "mandatory": true,
            "answers": [
                {
                    "id": "edu_institute_qna_y",
                    "value": "true",
                    "desc": "Yes",
                    "selected": true
                },
                {
                    "id": "edu_institute_qna_n",
                    "value": "false",
                    "desc": "No",
                    "defaultSel": true
                }
            ]
        },
        {
            "id": "edu_lvl",
            "desc": "Select the education level",
            "displayType": "radio",
            "mandatory": true,
            "answers": [
                {
                    "id": "edu_lvl_qna_k12",
                    "value": "K-12",
                    "desc": "K-12"
                },
                {
                    "id": "edu_lvl_qna_high_edu",
                    "value": "Higher Education",
                    "desc": "Higher Education"
                }
            ],
            "parentQId": "edu_institute",
            "parentAId": "edu_institute_qna_y"
        },
        {
            "id": "student_count",
            "desc": "What is the total number of students?",
            "displayType": "number",
            "mandatory": true,
            "answers": [
                {
                    "id": "student_count_qna_value",
                    "value": "",
                    "desc": ""
                }
            ],
            "parentQId": "edu_institute",
            "parentAId": "edu_institute_qna_y"
        },
        {
            "id": "scu_count",
            "desc": "How many Security Content Users(SCU) does this customer have?",
            "displayType": "number",
            "mandatory": true,
            "answers": [
                {
                    "id": "scu_count_qna_value",
                    "value": "",
                    "desc": ""
                }
            ],
            "parentQId": "tier"
        }
    ],
      error: false
      }
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(res));
    component.getQna();
    expect(component.questionsArray).toHaveLength;
  }); 
  it('call next with STO_ENH', ()=> {
    component.selectedOffer = [ {
          "offerName": "LPS SO4",
          "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
          "atos": [
              {
                  "name": "E3-A-APPD-ONP-ABL",
                  "desc": "AppDynamics On-Prem-ABL",
                  "selected": false,
                  "strategicOfferDiscount": "9",
                  "enrollmentId": 2
              }
          ],
          "suites": [
              {
                  "name": "AppDynamics OnPrem",
                  "desc": "AppDynamics On-Prem",
                  "ato": "E3-A-APPD-ONP-IBL",
                  "mandatory": true,
                  "inclusion": true,
                  "active": true,
                  "displaySeq": 4,
                  'enrollmentName': 'Security',
                  'poolDesc': 'Test',
                  "displayGroup": true,
                  "tiers": [
                      {
                          "name": "E3-A-APPD-ONP-ABL",
                          "desc": "ABL",
                          "active": true,
                          "defaultTier": false
                      }
                  ],
                  "commitOverrideEligible": false
              },
              {
                "name": "AppDynamics OnPrem",
                "desc": "AppDynamics On-Prem",
                "ato": "E3-A-APPD-ONP-IBL",
                "mandatory": true,
                "inclusion": true,
                "active": true,
                "displaySeq": 4,
                'enrollmentName': 'Security',
                'poolDesc': 'Test',
                "displayGroup": true,
                "tiers": [
                    {
                        "name": "E3-A-APPD-ONP-ABL",
                        "desc": "ABL",
                        "active": true,
                        "defaultTier": false
                    }
                ],
                "commitOverrideEligible": false
            }
          ]
      }]

    let current = 0;
    component.next(current);
    expect(component.start).toBe(0)  
  })

  it('call next', ()=> {
    component.selectedOffer = [ {
          "offerName": "LPS SO4",
          "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
          "atos": [
              {
                  "name": "E3-A-APPD-ONP-ABL",
                  "desc": "AppDynamics On-Prem-ABL",
                  "selected": false,
                  "strategicOfferDiscount": "9",
                  "enrollmentId": 2
              }
          ],
          "suites": [
              {
                  "name": "AppDynamics OnPrem",
                  "desc": "AppDynamics On-Prem",
                  "ato": "E3-A-APPD-ONP-IBL",
                  "mandatory": true,
                  "inclusion": true,
                  "active": true,
                  "displaySeq": 4,
                  "displayGroup": true,
                  "tiers": [
                      {
                          "name": "E3-A-APPD-ONP-ABL",
                          "desc": "ABL",
                          "active": true,
                          "defaultTier": false
                      }
                  ],
                  "commitOverrideEligible": false
              }
          ]
      }]

    let current = 0;
    component.next(current);
    expect(component.start).toBe(0)  
  })

  it('call goToStep', ()=> {
   component.currentStep = 1
    let index = 0;
    component.goToStep(index);
    expect(component.currentStep).toBe(0)  
  })
  it('call goToStep index === currentStep', ()=> {
   component.currentStep = 1
    let index = 1;
    component.goToStep(index);
    expect(component.currentStep).toBe(1)  
  })

  it('call suiteAtoSelection', ()=> {
    let offerName = 'test'
    let suite = {
      "name": "AppDynamics OnPrem",
      "desc": "AppDynamics On-Prem",
      "ato": "E3-A-APPD-ONP-IBL",
      "mandatory": true,
      "inclusion": true,
      "active": true,
      "displaySeq": 4,
      "displayGroup": true,
      "tiers": [
          {
              "name": "E3-A-APPD-ONP-ABL",
              "desc": "ABL",
              "active": true,
              "defaultTier": false
          }
      ],
      "commitOverrideEligible": false
    }
    let tierObj =
      {
          "name": "E3-A-APPD-ONP-ABL",
          "desc": "ABL",
          "active": true,
          "defaultTier": false
      }
     component.suiteAtoSelection(tierObj, suite, offerName);
     expect(component.isAllTierSelected).toHaveLength 
   }) 

   it('call applyOffer', () => {
    component.selectedOffer = [ {
      "offerName": "LPS SO4",
      "qualificationName": "AppDynamics OnPrem-ABL OR AppDynamics OnPrem-ABL",
      "atos": [
          {
              "name": "E3-A-APPD-ONP-ABL",
              "desc": "AppDynamics On-Prem-ABL",
              "selected": false,
              "strategicOfferDiscount": "9",
              "enrollmentId": 2
          }
      ],
      "suites": [
          {
              "name": "AppDynamics OnPrem",
              "desc": "AppDynamics On-Prem",
              "ato": "E3-A-APPD-ONP-IBL",
              "mandatory": true,
              "inclusion": true,
              "active": true,
              "displaySeq": 4,
              "displayGroup": true,
              "tiers": [
                  {
                      "name": "E3-A-APPD-ONP-ABL",
                      "desc": "ABL",
                      "active": true,
                      "defaultTier": false
                  }
              ],
              "commitOverrideEligible": false
          }
      ]
    }]
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData = {
      objId : 'test12'
    }
    let res = {
      data: {

      }
    }
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(res));
    component.applyOffer();
   })

   it('call isSelectedTierValid', ()=> {
    let suite =  {
      "name": "AppDynamics OnPrem",
      "desc": "AppDynamics On-Prem",
      "ato": "E3-A-APPD-ONP-IBL",
      "mandatory": true,
      "inclusion": true,
      "active": true,
      "swSelectedTier" : {
        "educationInstituteOnly" : true
      },
      "displaySeq": 4,
      "displayGroup": true,
      "tiers": [
          {
              "name": "E3-A-APPD-ONP-ABL",
              "desc": "ABL",
              "active": true,
              "defaultTier": false,
              "educationInstituteOnly": true
          }
      ],
      "commitOverrideEligible": false
    }
    let queService = fixture.debugElement.injector.get(QuestionnaireStoreService);
    queService.questionsArray = [
      {
          "id": "tier",
          "desc": "Select one of the Tiers",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "tier_qna_tier0",
                  "value": "TIER_0",
                  "desc": "Access Only"
              },
              {
                  "id": "tier_qna_tier1",
                  "value": "TIER_1",
                  "desc": "Tier 1"
              },
              {
                  "id": "tier_qna_tier2",
                  "value": "TIER_2",
                  "desc": "Tier 2"
              },
              {
                  "id": "tier_qna_tier3",
                  "value": "TIER_3",
                  "desc": "Tier 3",
                  "defaultSel": true,
                  "recommended": true
              },
              {
                  "id": "tier_qna_tier4",
                  "value": "TIER_4",
                  "desc": "Tier 4"
              },
              {
                  "id": "tier_qna_tier5",
                  "value": "TIER_5",
                  "desc": "Tier 5"
              },
              {
                  "id": "tier_qna_tier6",
                  "value": "TIER_6",
                  "desc": "Tier 6"
              }
          ],
          "additionalInfo": {
              "scuCountRange": {
                  "TIER_1": {
                      "min": 100,
                      "max": 499
                  },
                  "TIER_2": {
                      "min": 500,
                      "max": 999
                  },
                  "TIER_3": {
                      "min": 1000,
                      "max": 4999
                  },
                  "TIER_4": {
                      "min": 5000,
                      "max": 9999
                  },
                  "TIER_5": {
                      "min": 10000,
                      "max": 24999
                  },
                  "TIER_6": {
                      "min": 25000,
                      "max": 999999999
                  }
              },
              "threshold": [
                  {
                      "name": "E3-SEC-DUO-MFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-BYD",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-FEDMFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-FEDACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUMFA",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUACS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EDUBYD",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ESS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-ADV",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-PRE",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EES-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EAD-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-F",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-FS",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-DUO-EPR-HC",
                      "desc": "Duo",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-KENNA",
                      "desc": "Cisco Vulnerability Management",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-KENNA-PRE",
                      "desc": "Cisco Vulnerability Management",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-ISE",
                      "desc": "Identity Services Engine (ISE)",
                      "qtyUnit": "Sessions",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-WKLD",
                      "desc": "Secure Workload",
                      "qtyUnit": "Workloads",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 100,
                          "TIER_3": 100,
                          "TIER_4": 500,
                          "TIER_5": 1000,
                          "TIER_6": 2500
                      }
                  },
                  {
                      "name": "E3-SEC-UMBDNSE",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBDNSA",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBSIGE",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMBSIGA",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-UMB-EDU",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-WEB",
                      "desc": "Secure Web",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-SFW",
                      "desc": "Secure Firewall",
                      "qtyUnit": "commit value ($$UI-CurrencyCode$$)",
                      "tiersPriceThreshold": {
                          "TIER_1": 7500,
                          "TIER_2": 15000,
                          "TIER_3": 30000,
                          "TIER_4": 112500,
                          "TIER_5": 225000,
                          "TIER_6": 450000
                      }
                  },
                  {
                      "name": "E3-SEC-ES-ESS",
                      "desc": "Secure Email",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-ES-ADV",
                      "desc": "Secure Email",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ESS",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ADV",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-PRM",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ESS-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-ADV-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-EP-PRM-EDU",
                      "desc": "Secure Endpoint",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-SIG-EDU",
                      "desc": "Umbrella",
                      "qtyUnit": "User",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  },
                  {
                      "name": "E3-SEC-NWCLDA",
                      "desc": "Secure Network & Cloud Analytics",
                      "qtyUnit": "Flows",
                      "tiersQtyThreshold": {
                          "TIER_1": 100,
                          "TIER_2": 500,
                          "TIER_3": 1000,
                          "TIER_4": 5000,
                          "TIER_5": 10000,
                          "TIER_6": 25000
                      }
                  }
              ]
          }
      },
      {
          "id": "edu_institute",
          "desc": "Is this an Educational Institution?",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "edu_institute_qna_n",
                  "value": "false",
                  "desc": "No",
                  "selected": true,
                  "defaultSel": true
              },
              {
                "id": "edu_institute_qna_y",
                "value": "true",
                "desc": "Yes",
                "selected": false
            }
          ]
      },
      {
          "id": "edu_lvl",
          "desc": "Select the education level",
          "displayType": "radio",
          "mandatory": true,
          "answers": [
              {
                  "id": "edu_lvl_qna_k12",
                  "value": "K-12",
                  "desc": "K-12"
              },
              {
                  "id": "edu_lvl_qna_high_edu",
                  "value": "Higher Education",
                  "desc": "Higher Education"
              }
          ],
          "parentQId": "edu_institute",
          "parentAId": "edu_institute_qna_y"
      },
      {
          "id": "student_count",
          "desc": "What is the total number of students?",
          "displayType": "number",
          "mandatory": true,
          "answers": [
              {
                  "id": "student_count_qna_value",
                  "value": "",
                  "desc": ""
              }
          ],
          "parentQId": "edu_institute",
          "parentAId": "edu_institute_qna_y"
      },
      {
          "id": "scu_count",
          "desc": "How many Security Content Users(SCU) does this customer have?",
          "displayType": "number",
          "mandatory": true,
          "answers": [
              {
                  "id": "scu_count_qna_value",
                  "value": "",
                  "desc": ""
              }
          ],
          "parentQId": "tier"
      }
    ]

     component.isSelectedTierValid(suite);
   })
   it('call expandEnrollment', ()=> {
     const enrollment =  {hide: false};
     component.expandEnrollment(enrollment);
     expect(enrollment.hide).toBe(true)  
   })
   it('call expandPool', ()=> {
    const pool =  {hide: false};
    component.expandPool(pool);
    expect(pool.hide).toBe(true)  
  })
     it('should call isSelectedTierValid 1', () => {
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute',answers:[{selected:true}]}]
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.isSelectedTierValid(suite);
     expect(returnVAlue).toBe(true);
   });
   it('should call isEducationInstitueSelected 1', () => {
    const tier:IAtoTier ={
      educationInstituteOnly: true,

    }
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute',answers:[{selected:true}]}]
    component.questionnaireService.selectedAnswerMap.set('test',{answers:[{value: 'false'}]})

    const returnValue =   component.isEducationInstitueSelected(tier);
    expect(component.start_max).toBe(0);
   });
   it('should call isEducationInstitueSelected 1', () => {
    const tier:IAtoTier ={
      educationInstituteOnly: true,
    }
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute',answers:[{selected:true}]}]
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'false'}]})
    const returnValue =   component.isEducationInstitueSelected(tier);
    expect(component.start_max).toBe(0);
   });
   it('call saveOffers', ()=> {
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    const response = {data: 'testUrl'}
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'false'}]})
    component.summrayView = [{pools:[{suites:[{enrollmentId:3}]}]}]
    component.saveOffers();
    expect(component.start_max).toBe(0);
  })
  it('call saveOffers 1', ()=> {
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    const response = {error: 'testUrl'}
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'false'}]})
    component.summrayView = [{pools:[{suites:[{enrollmentId:3}]}]}]
    component.saveOffers();
    expect(component.start_max).toBe(0);
  })
});
