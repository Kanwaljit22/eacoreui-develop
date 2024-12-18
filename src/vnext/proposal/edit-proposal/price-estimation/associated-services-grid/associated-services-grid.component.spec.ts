import { of, Subject } from 'rxjs';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import { AssociatedServicesGridComponent } from './associated-services-grid.component';
import { PriceEstimationPollerService } from '../price-estimation-poller.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { GridOptions } from "ag-grid-community";
import { EaService } from 'ea/ea.service';
import { EamsDeliveryComponent } from 'vnext/modals/eams-delivery/eams-delivery.component';
import { DelinkConfirmationComponent } from 'vnext/modals/delink-confirmation/delink-confirmation.component';

let response = {
  data: {
    "ibPullLimitReached": true,
    "nextIbPullTimeStampInDdHhMm": '12902328',
    "proposal": {
        "objId": "6525237bb590991a01a5cb39",
        "id": 9045940,
        "projectObjId": "652522c6b590991a01a5ca1b",
        "projectId": 99553,
        "name": "Test_Migration_Fun",
        "billingTerm": {
            "rsd": "20231010",
            "billingModel": "Prepaid",
            "term": 36,
            "eaEndDate": 1791529200000,
            "eaEndDateStr": "20261009"
        },
        "countryOfTransaction": "US",
        "priceList": {
            "id": "1109",
            "name": "Global Price List - US"
        },
        "currencyCode": "USD",
        "partnerInfo": {
            "beGeoId": 639324,
            "beGeoName": "ConvergeOne, Inc.",
            "pgtmvBeGeoId": 272241792
        },
        "customer": {
            "accountName": "ATLANTICARE REGIONAL MEDICAL CENTER INC",
            "customerGuId": "32495",
            "customerGuName": "ATLANTICARE REGIONAL MEDICAL CENTER INC",
            "preferredLegalName": "ATLANTICARE REGIONAL MEDICAL CENTER INC",
            "preferredLegalAddress": {
                "addressLine1": "1406 DOUGHTY RD",
                "city": "EGG HARBOR TOWNSHIP",
                "state": "NJ",
                "zip": "08234",
                "country": "US"
            },
            "customerReps": [
                {
                    "id": 0,
                    "title": "Mr",
                    "firstName": "ram",
                    "lastName": "s",
                    "name": "ram s",
                    "email": "thuls@cisco.com"
                }
            ],
            "federalCustomer": false,
            "countryCode": "US",
            "duoCustomerType": {
                "federalCustomer": true,
                "legacyCustomer": false,
                "subscriptionLines": false,
                "hwTokenLines": false
            },
            "legacyCustomer": true
        },
        "dealInfo": {
            "id": "69835780",
            "statusDesc": "Qualified",
            "optyOwner": "mariar",
            "buyMethodDisti": false,
            "type": "PARTNER",
            "directRTM": false,
            "dealScope": 3,
            "dealSource": 0,
            "dealType": 3,
            "crPartyId": "779040",
            "partnerDeal": true,
            "distiDeal": false,
            "changeSusbcriptionDeal": false
        },
        "buyingProgram": "BUYING_PGRM_3",
        "locked": false,
        "status": "IN_PROGRESS",
        "initiatedBy": {
            "type": "ONE_T",
            "distiInitiated": false,
            "resellerInitiated": false,
            "ciscoInitiated": false
        },
        "audit": {
            "createdBy": "mariar",
            "createdAt": 1696932730975,
            "updatedBy": "system",
            "updatedAt": 1701243324276
        },
        "priceInfo": {
            "extendedList": 2066872.68,
            "unitNet": 0,
            "originalExtendedList": 0,
            "originalUnitList": 0,
            "totalNet": 1095585.48,
            "totalNetBeforeCredit": 1095585.48,
            "totalNetAfterIBCredit": 0,
            "unitListMRC": 0,
            "unitNetMRC": 0,
            "listPrice": 0
        },
        "message": {
            "hasError": true,
            "messages": [
                {
                    "code": "EA066",
                    "text": "EA3-M - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "EA3-M",
                    "level": "BUNDLE",
                    "type": "CONFIG",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "EA3-M - Your Requested Start Date (10-Oct-2023) provided is invalid. A valid date range is between  28-Nov-2023 and 25-Feb-2024. Select a new Requested Start Date. (CS639)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "EA3-M",
                    "level": "BUNDLE",
                    "type": "CONFIG",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-AS - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-AS",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-AS - Your Requested Start Date (10-Oct-2023) provided is invalid. A valid date range is between  28-Nov-2023 and 25-Feb-2024. Select a new Requested Start Date. (CS639)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-AS",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-ENTWAN - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-ENTWAN",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-ENTWAN - Your Requested Start Date (10-Oct-2023) provided is invalid. A valid date range is between  28-Nov-2023 and 25-Feb-2024. Select a new Requested Start Date. (CS639)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-ENTWAN",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-AIR - The configuration of this item is not valid. Click on the \"Edit Options\" link to configure the item. (CS470)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-AIR",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA066",
                    "text": "E3-N-AIR - Your Requested Start Date (10-Oct-2023) provided is invalid. A valid date range is between  28-Nov-2023 and 25-Feb-2024. Select a new Requested Start Date. (CS639)",
                    "severity": "ERROR",
                    "createdAt": 1701243319275,
                    "identifier": "E3-N-AIR",
                    "level": "ATO",
                    "type": "CONFIG",
                    "groupIdentifier": "1",
                    "key": "EA066"
                },
                {
                    "code": "EA068",
                    "text": "One or more errors exist or configuration is invalid in the proposal. Please fix errors to address the issue and re-price the proposal",
                    "severity": "ERROR",
                    "createdAt": 1701243319276,
                    "key": "EA068"
                },
                {
                    "code": "EA122",
                    "text": "Early renewal exception",
                    "severity": "WARN",
                    "createdAt": 1701243323866,
                    "type": "EXCEPTION",
                    "exceptionCause": {
                        "proposalId": 9045940,
                        "expected": " "
                    },
                    "key": "EA122"
                }
            ]
        },
        "commitInfo": {
            "committed": true,
            "threshold": 100000,
            "fullCommitTcv": 1095585.48
        },
        "forceAllowCompletion": false,
        "quoteInfo": {
            "payloadId": "ZYQXEOFINW",
            "quoteId": "4743979133",
            "redirectUrl": "https://ccw-cstg.cisco.com/ICW/PDR/rest/lineimport/savelines?did=Njk4MzU3ODA=&qid=NDc0Mzk3OTEzMw==&pid="
        },
        "programEligibility": {
            "eligible": true,
            "nonEligiblePrimaryEnrollments": [],
            "nonEligibleSecondaryEnrollments": [],
            "eligiblePrimaryEnrollments": [],
            "eligibleSecondaryEnrollments": []
        },
        "syncStatus": {"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},
        "deleted": false,
        "scopeInfo": {
            "scopeId": 11870,
            "masterAgreementId": "EA11441",
            "returningCustomer": false,
            "activeSecurityEducationInstitute": true
        },
        "exception": {
            "pendingApproval": false,
            "allowSubmission": false,
            "allowWithdrawl": false
        },
        "completionAudit": {
            "createdBy": "artrived",
            "createdAt": 1696933178656,
            "updatedBy": "artrived",
            "updatedAt": 1696933178656
        },
        "reopenAudit": {
            "createdBy": "mariar",
            "createdAt": 1697125781608,
            "updatedBy": "mariar",
            "updatedAt": 1697125781608
        },
        "subscriptionInfo": {
            "existingCustomer": false
        },
        "renewalInfo": {
            "subRefIds": [
                "Sub1091610"
            ],
            "id": 3101,
            "type": "EARLY_FOLLOWON",
            "initialBaselineCompleted": true,
            "allowSevenYrTerm": true,
            "atosInConsumptions": [
                "E3-N-AS",
                "E3-N-ENTWAN"
            ],
            "hybrid": false,
            "typeDesc": "Early"
        },
        "mspInfo": {
            "mspAuthorizedQualcodes": [
                "EA3MSEAPE"
            ],
            "mspProposal": false,
            "mspPartner": true
        },
        "sharedWithDistributor": false,
        "summaryViewAllowed": false,
        "changeSubBuyMoreSuiteDeal": false,
        "changeSubDeal": false,
        "allowCompletion": false,
        "statusDesc": "In Progress"
    },
    "enrollments": [
        {
          "awaitingResponse": false,
            "id": 1,
            "name": "Networking Infrastructure",
            "primary": true,
            "enrolled": true,
            "displayQnA": false,
            "displaySeq": 1,
            "billingTerm": {
                "rsd": "20231010",
                "billingModel": "Prepaid",
                "billingModelName": "Prepaid Term",
                "term": 36,
                "eaEndDate": 1791529200000,
                "eaEndDateStr": "20261009"
            },
            "commitInfo": {
                "committed": true,
                "fcSuiteCount": 3,
                "pcSuiteCount": 0,
                "fcTcv": 1095585.48
            },
            "pools": [
                {
                    "name": "Networking",
                    "desc": "Cisco DNA Software",
                    "displaySeq": 1,
                    "display": true,
                    "suites": [
                        {
                            "name": "Cisco DNA Switching",
                            "desc": "Cisco DNA Switching",
                            "ato": "E3-N-AS",
                            "inclusion": true,
                            "autoSelected": true,
                            "displaySeq": 1,
                            "discount": {
                                "subsDisc": 47,
                                "servDisc": 47,
                                "servPidDisc": 0,
                                "multiProgramDesc": {
                                    "msd": 10,
                                    "mpd": 0,
                                    "med": 0,
                                    "bundleDiscount": 28,
                                    "strategicOfferDiscount": 18,
                                    "strategicOfferDetails": [
                                        {
                                            "strategicOfferName": "LPS S06",
                                            "strategicOfferVersion": "32",
                                            "strategicOfferDiscountPercentage": 18
                                        }
                                    ]
                                }
                            },
                            "billingTerm": {
                                "rsd": "20231010",
                                "billingModel": "Prepaid",
                                "term": 36,
                                "eaEndDate": 1791529200000,
                                "eaEndDateStr": "20261009"
                            },
                            "commitInfo": {
                                "committed": true,
                                "fcSuiteCount": 0,
                                "pcSuiteCount": 0,
                                "threshold": 50000,
                                "overrideRequested": false,
                                "overrideEligible": true,
                                "overrideAllowed": true,
                                "ibQtyThreshold": {
                                    "achieved": 393,
                                    "required": 157
                                },
                                "priceThreshold": {
                                    "achieved": 1111252.32,
                                    "required": 50000
                                }
                            },
                            "displayGroup": false,
                            "lines": [
                                {
                                    "id": "NTWK-DNA-S-C3850-24",
                                    "desc": "DNA Switching Cat 3850 24 Port",
                                    "displaySeq": 57
                                }
                            ],
                            "ibDtls": [
                                {
                                    "pidName": "E3N-C6807-A",
                                    "qty": 0
                                }
                            ],
                            "priceInfo": {
                                "extendedList": 1509630.84,
                                "unitNet": 0,
                                "totalNet": 800135.28,
                                "totalNetBeforeCredit": 800135.28,
                                "totalSwNet": 800135.28,
                                "totalSwNetBeforeCredit": 800135.28,
                                "totalSrvcNet": 0,
                                "totalSrvcNetBeforeCredit": 0
                            },
                            "ncPriceInfo": {
                                "extendedList": 2096702.28,
                                "unitNet": 0,
                                "totalNet": 1111252.32,
                                "totalNetBeforeCredit": 1111252.32
                            },
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "migration": true,
                            "renewalInfo": {
                                "subRefIds": [
                                    "Sub1091610"
                                ]
                            },
                            "displayDiscount": true,
                            "includedInEAID": false,
                            "consentRequired": false
                        },
                        {
                            "name": "Cisco DNA Wireless",
                            "desc": "Cisco DNA Wireless",
                            "ato": "E3-N-AIR",
                            "inclusion": true,
                            "autoSelected": true,
                            "displaySeq": 2,
                            "discount": {
                                "subsDisc": 47,
                                "servDisc": 46.97,
                                "multiProgramDesc": {
                                    "msd": 10,
                                    "mpd": 0,
                                    "med": 0,
                                    "bundleDiscount": 30,
                                    "strategicOfferDiscount": 20,
                                    "strategicOfferDetails": [
                                        {
                                            "strategicOfferName": "LPS S06",
                                            "strategicOfferVersion": "32",
                                            "strategicOfferDiscountPercentage": 20
                                        }
                                    ]
                                }
                            },
                            "billingTerm": {
                                "rsd": "20231010",
                                "billingModel": "Prepaid",
                                "term": 36,
                                "eaEndDate": 1791529200000,
                                "eaEndDateStr": "20261009"
                            },
                            "commitInfo": {
                                "committed": true,
                                "fcSuiteCount": 0,
                                "pcSuiteCount": 0,
                                "threshold": 50000,
                                "overrideRequested": false,
                                "overrideEligible": true,
                                "overrideAllowed": true,
                                "ibQtyThreshold": {
                                    "achieved": 844,
                                    "required": 0
                                },
                                "priceThreshold": {
                                    "achieved": 292294.08,
                                    "required": 50000
                                }
                            },
                            "displayGroup": false,
                            "lines": [
                                {
                                    "id": "NTWK-DNA-W-DNAENDP-ADD",
                                    "desc": "Cisco DNA Wireless Device Endpoint",
                                    "displaySeq": 2
                                }
                            ],
                            "ibDtls": [
                                {
                                    "pidName": "E3N-AIRWLAN-A",
                                    "qty": 0
                                }
                            ],
                            "priceInfo": {
                                "extendedList": 386180.64,
                                "unitNet": 0,
                                "totalNet": 204788.16,
                                "totalNetBeforeCredit": 204788.16,
                                "totalSwNet": 204788.16,
                                "totalSwNetBeforeCredit": 204788.16,
                                "totalSrvcNet": 0,
                                "totalSrvcNetBeforeCredit": 0
                            },
                            "ncPriceInfo": {
                                "extendedList": 551469.6,
                                "unitNet": 0,
                                "totalNet": 292294.08,
                                "totalNetBeforeCredit": 292294.08
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
                "extendedList": 2066872.68,
                "unitNet": 0,
                "totalNet": 1095585.48,
                "totalNetBeforeCredit": 1095585.48,
                "totalSwNet": 1095585.48,
                "totalSwNetBeforeCredit": 1095585.48,
                "totalSrvcNet": 0,
                "totalSrvcNetBeforeCredit": 0
            },
            "disabled": false,
            "includedInEAID": false,
            "active": true,
            "externalConfiguration": false,
            "cxOptInAllowed": true,
            "cxAttached": false,
            "service": false,
            "migration": true,
            "disableRsdAndTermUpdate": false
        }
    ]
}
}

const obj = {redrawRows :function(){}, sizeColumnsToFit:function(){}}

describe('AssociatedServicesGridComponent', () => {
  let component: AssociatedServicesGridComponent;
  let fixture: ComponentFixture<AssociatedServicesGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgbTooltip],
      declarations: [ AssociatedServicesGridComponent, LocalizationPipe, DelinkConfirmationComponent ],
      providers: [PriceEstimateService, PriceEstimateStoreService,ProposalStoreService, ProposalService, UtilitiesService, CurrencyPipe, ProposalRestService,
        PriceEstimationPollerService,          VnextService, VnextStoreService, ProjectStoreService, EaRestService, DataIdConstantsService],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedServicesGridComponent);
    component = fixture.componentInstance;
    
    component.gridOptions = <GridOptions>{api: obj};
    fixture.detectChanges();
  });


  it('call serviceRender', () => {
      let params = {
        value: 22,
          data : {
            discountDirty : true
          }
      }

      component.serviceRender(params);

     params = {
         value : 0,
         data : {
           discountDirty : false
        }   
    }
    component.serviceRender(params);

    params = {
        value : 32,
        data : {
          discountDirty : false
       }   
    }
   component.serviceRender(params);
   expect(component.serviceRender(params)).toBe(32);
  }) 

  it('call desiredCellClass', () => {
    let params = {
      node: {
        level: 2
      },
      value: 22,
        data : {
          discountDirty : true,
          enrollmentId: 5
        }
    }
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.isReadOnly = false;
    let priceEstimateStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceEstimateStoreService.viewAllSelected = false;
    priceEstimateStoreService.enableRecalculateAll = false;

    component.desiredCellClass(params);
  })

  it('call desiredQtyRender', () => {
    let params = {
      node: {
        level: 2
      },
      value: 22,
        data : {
          discountDirty : true,
          enrollmentId: 5
        }
    }
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.isReadOnly = false;
    let priceEstimateStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceEstimateStoreService.viewAllSelected = false;
    priceEstimateStoreService.enableRecalculateAll = false;
    priceEstimateStoreService.displayExternalConfiguration = false;

    component.desiredQtyRender(params);
  })

  it('call getNodeChildDetails', () => {
    let rowItem = {
      expand: true,
      group: true,
      childs: [
        {
         "test": "testdata"
        }
      ]
    }

    component.getNodeChildDetails(rowItem);
  })

  it('call getCurrencyCode', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      currencyCode: 'USD'
    };

    component.getCurrencyCode();

    proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
    };
    component.getCurrencyCode();
  })

  it('call setEnrollmentData', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    };
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 1    };
    let eaService = fixture.debugElement.injector.get(EaService);
    eaService.customProgressBarMsg  = {
      requestOverride : true,
      witdrawReqOverride: false
    };
    const obj = {redrawRows :function(){}, sizeColumnsToFit:function(){}}
    component.gridOptions = <GridOptions>{api: obj};
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));

    component.setEnrollmentData();
  })

  it('call setCxEnrollmentDataForAll', () => {
   
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    };
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.setCxEnrollmentDataForAll();
  })


 
   it('call cascadeDiscount', () => {
    let res = {
      data: {
        "enrollments": [
          {
              "id": 5,
              "name": "Networking Infrastructure",
              "primary": true,
              "enrolled": true,
              "displayQnA": false,
              "displaySeq": 1,
              "billingTerm": {
                  "rsd": "20231010",
                  "billingModel": "Prepaid",
                  "billingModelName": "Prepaid Term",
                  "term": 36,
                  "eaEndDate": 1791529200000,
                  "eaEndDateStr": "20261009"
              },
              "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 3,
                  "pcSuiteCount": 0,
                  "fcTcv": 1095585.48
              },
              "pools": [
                  {
                      "name": "Networking",
                      "desc": "Cisco DNA Software",
                      "displaySeq": 1,
                      "display": true,
                      "suites": [
                          {
                              "name": "Cisco DNA Switching",
                              "desc": "Cisco DNA Switching",
                              "ato": "E3-N-AS",
                              "inclusion": true,
                              "autoSelected": true,
                              "displaySeq": 1,
                              "discount": {
                                  "subsDisc": 47,
                                  "servDisc": 47,
                                  "servPidDisc": 0,
                                  "multiProgramDesc": {
                                      "msd": 10,
                                      "mpd": 0,
                                      "med": 0,
                                      "bundleDiscount": 28,
                                      "strategicOfferDiscount": 18,
                                      "strategicOfferDetails": [
                                          {
                                              "strategicOfferName": "LPS S06",
                                              "strategicOfferVersion": "32",
                                              "strategicOfferDiscountPercentage": 18
                                          }
                                      ]
                                  }
                              },
                              "billingTerm": {
                                  "rsd": "20231010",
                                  "billingModel": "Prepaid",
                                  "term": 36,
                                  "eaEndDate": 1791529200000,
                                  "eaEndDateStr": "20261009"
                              },
                              "commitInfo": {
                                  "committed": true,
                                  "fcSuiteCount": 0,
                                  "pcSuiteCount": 0,
                                  "threshold": 50000,
                                  "overrideRequested": false,
                                  "overrideEligible": true,
                                  "overrideAllowed": true,
                                  "ibQtyThreshold": {
                                      "achieved": 393,
                                      "required": 157
                                  },
                                  "priceThreshold": {
                                      "achieved": 1111252.32,
                                      "required": 50000
                                  }
                              },
                              "displayGroup": false,
                              "lines": [
                                  {
                                      "id": "NTWK-DNA-S-C3850-24",
                                      "desc": "DNA Switching Cat 3850 24 Port",
                                      "displaySeq": 57
                                  }
                              ],
                              "ibDtls": [
                                  {
                                      "pidName": "E3N-C6807-A",
                                      "qty": 0
                                  }
                              ],
                              "priceInfo": {
                                  "extendedList": 1509630.84,
                                  "unitNet": 0,
                                  "totalNet": 800135.28,
                                  "totalNetBeforeCredit": 800135.28,
                                  "totalSwNet": 800135.28,
                                  "totalSwNetBeforeCredit": 800135.28,
                                  "totalSrvcNet": 0,
                                  "totalSrvcNetBeforeCredit": 0
                              },
                              "ncPriceInfo": {
                                  "extendedList": 2096702.28,
                                  "unitNet": 0,
                                  "totalNet": 1111252.32,
                                  "totalNetBeforeCredit": 1111252.32
                              },
                              "disabled": false,
                              "active": true,
                              "cxOptIn": false,
                              "migration": true,
                              "renewalInfo": {
                                  "subRefIds": [
                                      "Sub1091610"
                                  ]
                              },
                              "displayDiscount": true,
                              "includedInEAID": false,
                              "consentRequired": false
                          },
                          {
                              "name": "Cisco DNA Wireless",
                              "desc": "Cisco DNA Wireless",
                              "ato": "E3-N-AIR",
                              "inclusion": true,
                              "autoSelected": true,
                              "displaySeq": 2,
                              "discount": {
                                  "subsDisc": 47,
                                  "servDisc": 46.97,
                                  "multiProgramDesc": {
                                      "msd": 10,
                                      "mpd": 0,
                                      "med": 0,
                                      "bundleDiscount": 30,
                                      "strategicOfferDiscount": 20,
                                      "strategicOfferDetails": [
                                          {
                                              "strategicOfferName": "LPS S06",
                                              "strategicOfferVersion": "32",
                                              "strategicOfferDiscountPercentage": 20
                                          }
                                      ]
                                  }
                              },
                              "billingTerm": {
                                  "rsd": "20231010",
                                  "billingModel": "Prepaid",
                                  "term": 36,
                                  "eaEndDate": 1791529200000,
                                  "eaEndDateStr": "20261009"
                              },
                              "commitInfo": {
                                  "committed": true,
                                  "fcSuiteCount": 0,
                                  "pcSuiteCount": 0,
                                  "threshold": 50000,
                                  "overrideRequested": false,
                                  "overrideEligible": true,
                                  "overrideAllowed": true,
                                  "ibQtyThreshold": {
                                      "achieved": 844,
                                      "required": 0
                                  },
                                  "priceThreshold": {
                                      "achieved": 292294.08,
                                      "required": 50000
                                  }
                              },
                              "displayGroup": false,
                              "lines": [
                                  {
                                      "id": "NTWK-DNA-W-DNAENDP-ADD",
                                      "desc": "Cisco DNA Wireless Device Endpoint",
                                      "displaySeq": 2
                                  }
                              ],
                              "ibDtls": [
                                  {
                                      "pidName": "E3N-AIRWLAN-A",
                                      "qty": 0
                                  }
                              ],
                              "priceInfo": {
                                  "extendedList": 386180.64,
                                  "unitNet": 0,
                                  "totalNet": 204788.16,
                                  "totalNetBeforeCredit": 204788.16,
                                  "totalSwNet": 204788.16,
                                  "totalSwNetBeforeCredit": 204788.16,
                                  "totalSrvcNet": 0,
                                  "totalSrvcNetBeforeCredit": 0
                              },
                              "ncPriceInfo": {
                                  "extendedList": 551469.6,
                                  "unitNet": 0,
                                  "totalNet": 292294.08,
                                  "totalNetBeforeCredit": 292294.08
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
                  "extendedList": 2066872.68,
                  "unitNet": 0,
                  "totalNet": 1095585.48,
                  "totalNetBeforeCredit": 1095585.48,
                  "totalSwNet": 1095585.48,
                  "totalSwNetBeforeCredit": 1095585.48,
                  "totalSrvcNet": 0,
                  "totalSrvcNetBeforeCredit": 0
              },
              "disabled": false,
              "includedInEAID": false,
              "active": true,
              "externalConfiguration": false,
              "cxOptInAllowed": true,
              "cxAttached": false,
              "service": false,
              "migration": true,
              "disableRsdAndTermUpdate": false
          }
      ]
      }
    }
   
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    };
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 1    };
    const obj = {redrawRows :function(){}, sizeColumnsToFit:function(){}}
    component.gridOptions = <GridOptions>{api: obj};
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(res));
    component.cascadeDiscount();
  })

  it('call viewAndEditHardwareSupport', () => {
    let res = {
      data: {
        redirectionUrl: 'testUrl'
      }
    }
   
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    };
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id :1    };
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(res));
    component.viewAndEditHardwareSupport();
  })

  it('call applyDiscountApiCall', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    };
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 1   };
    let enrollmentId = 1;
    const request = {
      "data": {
        "enrollments": [
          {
            "enrollmentId":1,
            "id":1,
            "atos": [
              {
                "name": 'test',
                "pids": []
              }
            ]
          }
        ]
      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.applyDiscountApiCall(request, enrollmentId);
  })

  it('call openEAMS', () => {
      const modalService = TestBed.get(NgbModal);

      const modalRef = modalService.open(EamsDeliveryComponent,{ windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
      modalRef.result =  new Promise((resolve) => resolve({continue: true
      }));
    
      const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
      let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
      proposalStoreService.proposalData  = {
        objId : 'test12',
        enrollments: [{
          "id": 1,
          "name": "Networking Infrastructure",
          "primary": true,
          "enrolled": true,
          "displayQnA": false,
          "priceInfo": {
            "extendedList": 2066872.68,
            "unitNet": 0,
            "totalNet": 1095585.48,
            "totalNetBeforeCredit": 1095585.48,
            "totalSwNet": 1095585.48,
            "totalSwNetBeforeCredit": 1095585.48,
            "totalSrvcNet": 0,
            "totalSrvcNetBeforeCredit": 0
        }
        }]};
      let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
      priceStoreService.selectedEnrollment  = {
        id : 1   };
      let eaService = fixture.debugElement.injector.get(EaService);
      eaService.customProgressBarMsg  = {
        requestOverride : true,
        witdrawReqOverride: false
      };
     
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
      component.openEAMS(response.data.enrollments[0]);
      expect(open).toHaveBeenCalled()
  })


 
  it('call onDemandIbRepull', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    }
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 2    };
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.onDemandIbRepull();
  })

  it('call onDemandIbRepull 1', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "embeddedHwSupportAttached" : true,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0,
          
      }
      }]
    }
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 1    };
      response.data.ibPullLimitReached = false;
      response.data.enrollments[0]['embeddedHwSupportAttached'] = true;
      component.eaService.features.FIRESTORM_REL = true
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.onDemandIbRepull();
    expect(component.ibQuantityPopup).toBe(false);
  })
  it('call onDemandIbRepull 2', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 5,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "embeddedHwSupportAttached" : true,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0,
          
      }
      }]
    }
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 1    };
      response.data.ibPullLimitReached = false;
      response.data.enrollments[0].id = 5;
      component.eaService.features.FIRESTORM_REL = true
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
      component.onDemandIbRepull();
      expect(component.ibQuantityPopup).toBe(false);
  })

  it('call closeIbPullMsg', () => {
    component.closeIbPullMsg();
    expect(component.showIbPullMsg).toBeFalsy();
  })


  it('call goToTroubleShooting', () => {
    component.priceEstimateStoreService.troubleshootingUrl = 'https://salesconnect.cisco.com/#/content-detail/7baa3606-6d22-453f-bbaf-a8a5dab84666';
    window.open = jest.fn();
    jest.spyOn(window,'open') 
    component.goToTroubleShooting();
  })

  it('call delinkHwCx', () => {
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(DelinkConfirmationComponent,{ windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext', backdrop: 'static', keyboard: false });
    modalRef.result =  new Promise((resolve) => resolve({
    }));
  
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.delinkHwCx();
    expect(open).toHaveBeenCalled()
  })

  it('call setCxPidGrouping', () => {
   
    let data = [{
      childs: [{
        disabled: false,
        childs: [
          { 
            pidType: 'CX_HW_SUPPORT'
          }
          ]
        }]
      }]
    component.setCxPidGrouping(data);

    data = [{
      childs: [{
        disabled: false,
        childs: [
          { 
            pidType: 'CX_SOLUTION_SUPPORT'
          }
          ]
        }]
      }]
      component.setCxPidGrouping(data);
  })

  it('call onHeaderClick', () => {
    let event = {
      target: {
        classList: {
          value: 'serviceInstallBase'
        }
      }
    }
    let node = {
      expanded: true,
      data: {
        poolSuiteLineName: 'test'
      }
    }
    component.gridOptions.api.forEachNode=jest.fn();
    component.onHeaderClick(event);
  }) 

  it('call suiteCell', () => {
    let params = {
      node: {
        level:0
      }
    }
    component.suiteCell(params);
  })

  it('call onResize', () => {
    let event = {
    }
    component.onResize(event);
  }) 

  it('call onGridReady', () => {
    let event = {
    }
    component.gridOptions.api.setColumnDefs = jest.fn();
    component.onGridReady(event);
  })

  it('call loadData', () => {
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.viewAllSelected  = true
    component.loadData();

    priceStoreService.viewAllSelected  = false
    component.loadData();
  })

  it('call ibPopup', () => {
    component.ibPopup();
    expect(component.ibQuantityPopup).toBeTruthy()
  })

  it('call closePopup', () => {
    component.closePopup();
    expect(component.ibQuantityPopup).toBeFalsy()
  })
  it('call openUpdateIbDropDown', () => {
    component.openUpdateIbDropDown();
    expect(component.openUpdateIbDrop).toBe(true);
  })
  it('call closeUpdateIbDropDown', () => {
    component.closeUpdateIbDropDown();
    expect(component.openUpdateIbDrop).toBe(false);
  })
  it('call checkIfLastRepullPassed24Hrs', () => {
    component.checkIfLastRepullPassed24Hrs();
    expect(component.openUpdateIbDrop).toBe(false);
  })

  it('call callIbReprocessOptimization', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    }
    component.callIbReprocessOptimization(true);
    expect(component.openUpdateIbDrop).toBe(false);
  })

  it('call callIbReprocessOptimization 1', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    }
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 2 ,cxAttached:true   };
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
  })
  it('call callIbReprocessOptimization 1', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData  = {
      objId : 'test12',
      enrollments: [{
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "priceInfo": {
          "extendedList": 2066872.68,
          "unitNet": 0,
          "totalNet": 1095585.48,
          "totalNetBeforeCredit": 1095585.48,
          "totalSwNet": 1095585.48,
          "totalSwNetBeforeCredit": 1095585.48,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0
      }
      }]
    }
    let priceStoreService = fixture.debugElement.injector.get(PriceEstimateStoreService);
    priceStoreService.selectedEnrollment  = {
      id : 2 ,cxAttached:false,embeddedHwSupportAttached:true   };
      let eaRestService = fixture.debugElement.injector.get(EaRestService);
      jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
  })
  it('call checkAndSetTotalNetForCX', () => {
    const data = response.data.enrollments[0]
    const revturnValue = component.checkAndSetTotalNetForCX(data);
    expect(revturnValue).toBeGreaterThanOrEqual(0);
  })
  it('call invokePollerService', () => {
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
    expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })

  it('call invokePollerService IB_OPTIMIZATION & FIRESTORM_REL', () => {
    component.eaService.features.IB_OPTIMIZATION = true
    component.eaService.features.FIRESTORM_REL = true
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
    expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })

  it('call invokePollerService FIRESTORM_REL', () => {
    //component.eaService.features.IB_OPTIMIZATION = true
    component.eaService.features.FIRESTORM_REL = true
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
    expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })
  it('call invokePollerService IB_OPTIMIZATION', () => {
    component.eaService.features.IB_OPTIMIZATION = true
    //component.eaService.features.FIRESTORM_REL = true
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
    expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })
  it('call setEnrollmentData ', () => {
    component.priceEstimateStoreService.selectedEnrollment.cxAttached = true
    component.eaService.customProgressBarMsg.requestOverride = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.setEnrollmentData();
    expect(component.eaService.customProgressBarMsg.requestOverride).toBe(false);
  })
  it('call setEnrollmentData ', () => {
    component.priceEstimateStoreService.selectedEnrollment.embeddedHwSupportAttached = true
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    response.data.enrollments[0]['systematicIbRepullRequired'] = true
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.setEnrollmentData();
    expect(component.eaService.customProgressBarMsg.requestOverride).toBe(false);
  })
});
