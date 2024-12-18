import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
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
import { PriceEstimateStoreService } from '../../price-estimate-store.service';
import { PriceEstimateService } from '../../price-estimate.service';

import { MigrateSuitesComponent } from './migrate-suites.component';

describe('MigrateSuitesComponent', () => {
  let component: MigrateSuitesComponent;
  let fixture: ComponentFixture<MigrateSuitesComponent>;
  const data = {
    "id": 3,
    "name": "Security",
    "primary": false,
    "enrolled": false,  
    "pools": [
   
        {
            "name": "Zero Trust",
            "desc": "Zero Trust",
            "displaySeq": 4300,
            "display": true,
            "suites": [
                {
                    "name": "Identity Services Engine (ISE)",
                    "desc": "Identity Services Engine (ISE)",
                    "ato": "E3-SEC-ISE",
                    "autoSelected": false,
                    "displaySeq": 4100,
                    "tiers": [],
                    "displayGroup": true,
                    "disabled": false,
                    "active": true,
                    "cxOptIn": false,
                    "displayDiscount": false,
                    "includedInEAID": false,
                    "consentRequired": false,
                    "inclusion": false
                },
                {
                    "name": "Duo",
                    "desc": "Duo",
                    "ato": "E3-SEC-DUO-FEDMFA",
                    "autoSelected": false,
                    "displaySeq": 4295,
                    "tiers": [
                        {
                            "name": "E3-SEC-DUOFE",
                            "desc": "Federal Ess",
                            "cxOptIn": false,
                            "displaySeq": 3000,
                            "selected": true
                        },
                        {
                            "name": "E3-SEC-DUOFA",
                            "desc": "Federal Adv",
                            "cxOptIn": false,
                            "displaySeq": 3001
                        },
                        {
                            "name": "E3-SEC-DUO-ESS",
                            "desc": "Essentials",
                            "cxOptIn": false,
                            "displaySeq": 4230
                        }
                    ],
                    "displayGroup": true,
                    "disabled": true,
                    "notAllowedHybridRelated": false,
                    "hasBfRelatedMigratedAto": false,
                    "active": true,
                    "cxOptIn": false,
                    "displayDiscount": false,
                    "includedInEAID": true,
                    "includedInSubscription": true,
                    "consentRequired": false,
                    "lowerTierAto": {
                        "name": "E3-SEC-DUO-FEDMFA",
                        "desc": "Federal MFA"
                    },
                    "incompatibleAtos": [
                        "E3-SEC-DUO-EAD-F",
                        "E3-SEC-DUO-EES-FS",
                        "E3-SEC-DUO-FEADHC",
                        "E3-SEC-DUO-FEESF",
                        "E3-SEC-DUO-ACS",
                        "E3-SEC-DUO-EPR-FS",
                        "E3-SEC-DUO-EDUACS",
                        "E3-SEC-DUOFA",
                        "E3-SEC-DUO-MFA",
                        "E3-SEC-DUO-PRE",
                        "E3-SEC-DUO-EDUMFA",
                        "E3-SEC-DUO-FEESHC",
                        "E3-SEC-DUO-EPR-HC",
                        "E3-SEC-DUO-FEADFS",
                        "E3-SEC-DUO-FEESFS",
                        "E3-SEC-DUO-EDUBYD",
                        "E3-SEC-DUO-FEDMFA",
                        "E3-SEC-DUO-EAD-FS",
                        "E3-SEC-DUO-EES-HC",
                        "E3-SEC-DUO-EPR-F",
                        "E3-SEC-DUO-BYD",
                        "E3-SEC-DUOFE",
                        "E3-SEC-DUO-ESS",
                        "E3-SEC-DUO-EES-F",
                        "E3-SEC-DUO-EAD-HC",
                        "E3-SEC-DUO-FEADF"
                    ],
                    "incompatibleSuites": [
                        "User & Breach Protection (Combination)",
                        "User Protection"
                    ],
                    "eligibleForMigration": true,
                    "eligibleForUpgrade": true,
                    "migrateToSuites": [
                        {
                            "name": "User & Breach Protection (Combination)",
                            "desc": "User & Breach Protection (Combination)",
                            "ato": "E3-SEC-S-CBPEUPE",
                            "autoSelected": true,
                            "displaySeq": 4087,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-CBPEUPE",
                                    "desc": "Breach Essentials - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4070
                                },
                                {
                                  "name": "E3-SEC-S-CBPEUPE1",
                                  "desc": "Breach Essentials - User Essentials",
                                  "cxOptIn": false,
                                  "displaySeq": 4071
                              }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "Cisco XDR",
                                "Cisco Email Threat Defense",
                                "Breach Protection",
                                "User Protection",
                                "Cisco Secure Access",
                                "Secure Endpoint",
                                "Duo"
                            ],
                            "mappingType": [
                                "Full"
                            ]
                        },
                        {
                            "name": "User Protection",
                            "desc": "User Protection",
                            "ato": "E3-SEC-S-UPE",
                            "autoSelected": false,
                            "displaySeq": 4015,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-UPA",
                                    "desc": "Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4015
                                },
                                {
                                  "name": "E3-SEC-S-UPA1",
                                  "desc": "Advantage",
                                  "cxOptIn": false,
                                  "displaySeq": 4011
                              }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "User & Breach Protection (Combination)",
                                "Cisco Email Threat Defense",
                                "Breach Protection",
                                "Cisco Secure Access",
                                "Secure Endpoint",
                                "Duo"
                            ],
                            "mappingType": [
                                "Full"
                            ]
                        }
                    ],
                    "pendingMigration": false,
                    "suiteModified": false,
                    "hasSwRelatedCxUpgraded": false,
                    "inclusion": true,
                    "swSelectedTier": {
                        "name": "E3-SEC-DUOFE",
                        "desc": "Federal Ess",
                        "cxOptIn": false,
                        "displaySeq": 3000,
                        "selected": true
                    },
                    "hasEmbeddedHwSupport": false,
                    "cxAttachMandatory": false
                }
              
            ],
            "selectedMerakiSuites": [],
            "selectedBonfireSuites": [],
            "eligibleForMigration": true,
            "displayPoolForTierUpgrade": true
        },
        {
            "name": "Cloud and Network Security",
            "desc": "Cloud and Network Security",
            "displaySeq": 4800,
            "display": true,
            "suites": [
                {
                    "name": "Umbrella",
                    "desc": "Umbrella",
                    "ato": "E3-SEC-UMBDNSE",
                    "autoSelected": true,
                    "displaySeq": 4450,
                    "tiers": [],
                    "displayGroup": true,
                    "disabled": false,
                    "notAllowedHybridRelated": false,
                    "hasBfRelatedMigratedAto": false,
                    "active": true,
                    "cxOptIn": false,
                    "serviceAttachMandatory": true,
                    "displayDiscount": false,
                    "includedInEAID": false,
                    "consentRequired": false,
                    "incompatibleAtos": [
                        "E3-SEC-UMB-EDU",
                        "E3-SEC-UMBDNSA",
                        "E3-SEC-UMBSIGA",
                        "E3-SEC-UMBSIGE",
                        "E3-SEC-SIG-EDU"
                    ],
                    "incompatibleSuites": [
                        "Cisco Secure Connect"
                    ],
                    "inclusion": true
                },
                {
                    "name": "Cisco Secure Access",
                    "desc": "Cisco Secure Access",
                    "ato": "E3-SEC-SECACCESS-E",
                    "autoSelected": false,
                    "displaySeq": 4600,
                    "tiers": [
                        {
                            "name": "E3-SEC-SECACCESS-A",
                            "desc": "Advantage",
                            "cxOptIn": false,
                            "displaySeq": 4600
                        }
                    ],
                    "displayGroup": true,
                    "disabled": true,
                    "notAllowedHybridRelated": false,
                    "hasBfRelatedMigratedAto": false,
                    "active": true,
                    "cxOptIn": false,
                    "serviceAttachMandatory": true,
                    "displayDiscount": false,
                    "includedInEAID": true,
                    "includedInSubscription": true,
                    "consentRequired": false,
                    "lowerTierAto": {
                        "name": "E3-SEC-SECACCESS-E",
                        "desc": "Essentials",
                        "selected": true
                    },
                    "incompatibleAtos": [
                        "E3-SEC-SECACCESS-A"
                    ],
                    "incompatibleSuites": [
                        "User & Breach Protection (Combination)",
                        "User Protection"
                    ],
                    "eligibleForMigration": true,
                    "eligibleForUpgrade": true,
                    "migrateToSuites": [
                        {
                            "name": "User & Breach Protection (Combination)",
                            "desc": "User & Breach Protection (Combination)",
                            "ato": "E3-SEC-S-CBPEUPE",
                            "autoSelected": true,
                            "displaySeq": 4087,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-CBPEUPA",
                                    "desc": "Breach Essentials - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4075
                                },
                                {
                                    "name": "E3-SEC-S-CBPEUPE",
                                    "desc": "Breach Essentials - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4070
                                },
                                {
                                    "name": "E3-SEC-S-CBPAUPA",
                                    "desc": "Breach Advantage - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4085
                                },
                                {
                                    "name": "E3-SEC-S-CBPAUPE",
                                    "desc": "Breach Advantage - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4080
                                },
                                {
                                    "name": "E3-SEC-S-CBPPUPE",
                                    "desc": "Breach Premier - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4086
                                },
                                {
                                    "name": "E3-SEC-S-CBPPUPA",
                                    "desc": "Breach Premier - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4087
                                }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "Cisco XDR",
                                "Cisco Email Threat Defense",
                                "Breach Protection",
                                "User Protection",
                                "Cisco Secure Access",
                                "Secure Endpoint",
                                "Duo"
                            ],
                            "mappingType": [
                                "Full"
                            ]
                        },
                        {
                            "name": "User Protection",
                            "desc": "User Protection",
                            "ato": "E3-SEC-S-UPE",
                            "autoSelected": false,
                            "displaySeq": 4015,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-UPE",
                                    "desc": "Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4010
                                },
                                {
                                    "name": "E3-SEC-S-UPA",
                                    "desc": "Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4015
                                }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "User & Breach Protection (Combination)",
                                "Cisco Email Threat Defense",
                                "Breach Protection",
                                "Cisco Secure Access",
                                "Secure Endpoint",
                                "Duo"
                            ],
                            "mappingType": [
                                "Full"
                            ]
                        }
                    ],
                    "pendingMigration": false,
                    "suiteModified": false,
                    "hasSwRelatedCxUpgraded": false,
                    "inclusion": true,
                    "swSelectedTier": {
                        "name": "E3-SEC-SECACCESS-E",
                        "desc": "Essentials",
                        "selected": true
                    },
                    "hasEmbeddedHwSupport": false,
                    "cxAttachMandatory": false,
                    "isOnlyEduTierPresentForUpgrade": false
                }
            ],
            "selectedMerakiSuites": [],
            "selectedBonfireSuites": [],
            "eligibleForMigration": true,
            "displayPoolForTierUpgrade": true
        },
        {
            "name": "Security Platform and Response",
            "desc": "Security Platform and Response",
            "displaySeq": 8365,
            "display": true,
            "suites": [
              
                {
                    "name": "Secure Endpoint",
                    "desc": "Secure Endpoint",
                    "ato": "E3-SEC-EP-ESS",
                    "autoSelected": false,
                    "displaySeq": 8050,
                    "tiers": [],
                    "displayGroup": true,
                    "disabled": false,
                    "notAllowedHybridRelated": false,
                    "hasBfRelatedMigratedAto": false,
                    "active": true,
                    "cxOptIn": false,
                    "displayDiscount": false,
                    "includedInEAID": false,
                    "consentRequired": false,
                    "incompatibleAtos": [
                        "E3-SEC-EP-ADV",
                        "E3-SEC-EP-ADV-EDU",
                        "E3-SEC-EP-PRM-EDU",
                        "E3-SEC-EP-PRM",
                        "E3-SEC-EP-ESS-EDU"
                    ],
                    "incompatibleSuites": [
                        "User & Breach Protection (Combination)",
                        "Breach Protection",
                        "User Protection"
                    ],
                    "inclusion": false
                },
                {
                    "name": "Cisco XDR",
                    "desc": "Cisco XDR",
                    "ato": "E3-SEC-XDR-E",
                    "autoSelected": false,
                    "displaySeq": 8320,
                    "tiers": [
                        {
                            "name": "E3-SEC-XDR-A",
                            "desc": "Advantage",
                            "cxOptIn": false,
                            "displaySeq": 8210,
                            "selected": true
                        },
                        {
                            "name": "E3-SEC-XDR-P",
                            "desc": "Premier",
                            "cxOptIn": false,
                            "displaySeq": 8320
                        }
                    ],
                    "displayGroup": true,
                    "disabled": true,
                    "active": true,
                    "cxOptIn": false,
                    "displayDiscount": false,
                    "includedInEAID": true,
                    "includedInSubscription": true,
                    "consentRequired": false,
                    "lowerTierAto": {
                        "name": "E3-SEC-XDR-E",
                        "desc": "Essentials"
                    },
                    "incompatibleAtos": [
                        "E3-SEC-XDR-P",
                        "E3-SEC-XDR-A"
                    ],
                    "incompatibleSuites": [
                        "User & Breach Protection (Combination)",
                        "Breach Protection"
                    ],
                    "eligibleForMigration": true,
                    "eligibleForUpgrade": true,
                    "migrateToSuites": [
                        {
                            "name": "User & Breach Protection (Combination)",
                            "desc": "User & Breach Protection (Combination)",
                            "ato": "E3-SEC-S-CBPEUPE",
                            "autoSelected": true,
                            "displaySeq": 4087,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-CBPEUPA",
                                    "desc": "Breach Essentials - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4075
                                },
                                {
                                    "name": "E3-SEC-S-CBPEUPE",
                                    "desc": "Breach Essentials - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4070
                                },
                                {
                                    "name": "E3-SEC-S-CBPAUPA",
                                    "desc": "Breach Advantage - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4085
                                },
                                {
                                    "name": "E3-SEC-S-CBPAUPE",
                                    "desc": "Breach Advantage - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4080
                                },
                                {
                                    "name": "E3-SEC-S-CBPPUPE",
                                    "desc": "Breach Premier - User Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4086
                                },
                                {
                                    "name": "E3-SEC-S-CBPPUPA",
                                    "desc": "Breach Premier - User Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4087
                                }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "Cisco XDR",
                                "Cisco Email Threat Defense",
                                "Breach Protection",
                                "User Protection",
                                "Cisco Secure Access",
                                "Secure Endpoint",
                                "Duo"
                            ],
                            "mappingType": [
                                "Full","Partial"
                            ]
                        },
                        {
                            "name": "Breach Protection",
                            "desc": "Breach Protection",
                            "ato": "E3-SEC-S-BPE",
                            "autoSelected": false,
                            "displaySeq": 4046,
                            "tiers": [
                                {
                                    "name": "E3-SEC-S-BPE",
                                    "desc": "Essentials",
                                    "cxOptIn": false,
                                    "displaySeq": 4040
                                },
                                {
                                    "name": "E3-SEC-S-BPA",
                                    "desc": "Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 4045
                                },
                                {
                                    "name": "E3-SEC-S-BPP",
                                    "desc": "Premier",
                                    "cxOptIn": false,
                                    "displaySeq": 4046
                                }
                            ],
                            "displayGroup": true,
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "displayDiscount": false,
                            "includedInEAID": false,
                            "incompatibleSuites": [
                                "User & Breach Protection (Combination)",
                                "Cisco XDR",
                                "Cisco Email Threat Defense",
                                "User Protection",
                                "Secure Endpoint"
                            ],
                            "mappingType": [
                                "Full"
                            ]
                        }
                    ],
                    "pendingMigration": false,
                    "suiteModified": false,
                    "hasSwRelatedCxUpgraded": false,
                    "inclusion": true,
                    "swSelectedTier": {
                        "name": "E3-SEC-XDR-A",
                        "desc": "Advantage",
                        "cxOptIn": false,
                        "displaySeq": 8210,
                        "selected": true
                    },
                    "hasEmbeddedHwSupport": false,
                    "cxAttachMandatory": false
                },
              
            ],
            "selectedMerakiSuites": [],
            "selectedBonfireSuites": [],
            "eligibleForMigration": true,
            "displayPoolForTierUpgrade": true
        }
    ],
    "disabled": false,
    "includedInEAID": true,
    "active": true,
    "cxOptInAllowed": true,
    "cxAttached": false,
    "disableRsdAndTermUpdate": false,
    "includedInSubscription": true,
    "embeddedHwSupportAttached": false,
    "eligibleForMigration": true,
    "eligibleForUpgrade": false,
    "suitesNotAvailableForMigration": true
}
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigrateSuitesComponent,LocalizationPipe ],
      imports:[HttpClientTestingModule],
      providers: [ PriceEstimateService,ProjectService,VnextService,PriceEstimateStoreService,ProjectStoreService,CreateProposalStoreService,UtilitiesService,CurrencyPipe,EaRestService,
        EaStoreService,ProjectRestService,VnextStoreService,ProposalService,ProposalStoreService, MessageService, DataIdConstantsService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrateSuitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectSwMigrateSuite', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[0];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    expect(component.priceEstimateService.isMigrateSuitedSelected).toBe(true)
  });
  it('should call selectSwMigrateSuite 1', () => {
    data.pools[0].suites[1].migrateToSuites[1].tiers[1]['defaultSel'] = true;
    component.swEnrollmentData = data;
   
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[0];
    const suite = data.pools[0].suites[1];
    
    component.selectSwMigrateSuite(migrateToSuite, suite)
    expect(component.priceEstimateService.isMigrateSuitedSelected).toBe(true)
  });
  it('should call restore', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    component.restoreMigrateSuite(suite)
    expect(component.priceEstimateService.isMigrateSuitedSelected).toBe(false)
  });
  it('should call restore 1', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    suite['migratedTo'] = {}
    suite['suiteModified'] = true
    component.restoreMigrateSuite(suite)
    expect(component.priceEstimateService.isMigrateSuitedSelected).toBe(false)
  });
  it('should call selectMigrateSuiteTier', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    const tier = data.pools[0].suites[1].migrateToSuites[1].tiers[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    component.selectMigrateSuiteTier(tier,suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });
  it('should call updateMigrateType', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    component.updateMigrateType(suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });
  it('should call updateMigrateType 1', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    suite['migratedTo'].mappingType = ['Full','Partial']
    suite['migratedTo'].migrationType = "Partial"
    component.updateMigrateType(suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });
  it('should call restoreSuiteTier', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.selectSwMigrateSuite(migrateToSuite, suite)
    component.restoreSuiteTier(suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });
  it('should call updateSuiteTierArray', () => {
    component.swEnrollmentData = data;
    const migrateToSuite = data.pools[0].suites[1].migrateToSuites[1];
    const suite = data.pools[0].suites[1];
    component.priceEstimateService.upgradedSuitesTier = [{}]
    //component.selectSwMigrateSuite(migrateToSuite, suite)
    component.updateSuiteTierArray(suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });
  it('should call updateSuiteTierArray 1', () => {
    component.swEnrollmentData = data;
    const suite = data.pools[0].suites[1];
    
    component.updateSuiteTierArray(suite)
    expect(component.priceEstimateService.isMigrateSuiteError).toBe(false)
  });

});
