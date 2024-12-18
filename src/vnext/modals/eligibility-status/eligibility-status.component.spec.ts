
import {  CurrencyPipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BrowserTestingModule } from "@angular/platform-browser/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";

import { of } from "rxjs";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { LocalizationPipe } from "vnext/commons/shared/pipes/localization.pipe";
import { PriceEstimateStoreService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service";
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { ProposalRestService } from "vnext/proposal/proposal-rest.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { EligibilityStatusComponent } from "./eligibility-status.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { EaStoreService } from "ea/ea-store.service";

const mockData = {
  rid: "EAMP1655425824803",
  user: "rbinwani",
  error: false,
  data: {
    proposal: {
      objId: "619e038055522961f1bd1b79",
      id: 20003228,
      projectObjId: "6182736a56785f0b23dad280",
      projectId: 2000772,
      name: "Testing",
      billingTerm: {
        rsd: "20211124",
        billingModel: "Prepaid",
        term: 48,
        eaEndDateStr: "20251123",
        eaEndDate: 1763884800000,
      },
      countryOfTransaction: "US",
      priceList: {
        id: "1109",
        name: "Global Price List - US",
      },
      currencyCode: "USD",
      partnerInfo: {
        beGeoId: 639324,
        beId: 586064,
        beGeoName: "ConvergeOne, Inc.",
        pgtmvBeGeoId: 272241792,
        countryCode: "US",
      },
      customer: {
        accountName: "FACEBOOK",
        customerGuId: "38939101",
        preferredLegalName: "FACEBOOK",
        preferredLegalAddress: {
          addressLine1: "408 SOCIAL CIR",
          city: "FOREST CITY",
          state: "NC",
          zip: "28043",
          country: "UNITED STATES",
        },
        customerReps: [
          {
            id: 0,
            title: "BA",
            firstName: "Test",
            lastName: "test1",
            name: "Test test1",
            email: "test@cisco.com",
          },
        ],
        federalCustomer: false,
        countryCode: "UNITED STATES",
        duoCustomerType: {
          federalCustomer: true,
          legacyCustomer: false,
          subscriptionLines: false,
          hwTokenLines: false,
        },
        legacyCustomer: true,
      },
      dealInfo: {
        id: "52518774",
        statusDesc: "Qualification in Progress",
        optyOwner: "mariar",
        buyMethodDisti: false,
        type: "PARTNER",
        dealScope: 3,
        dealSource: 0,
        dealType: 3,
        crPartyId: "195804147",
        distiDeal: false,
        partnerDeal: true,
      },
      buyingProgram: "BUYING_PGRM_3",
      locked: false,
      status: "IN_PROGRESS",
      initiatedBy: {
        type: "CISCO",
        ciscoInitiated: true,
        distiInitiated: false,
      },
      audit: {
        createdBy: "rbinwani",
        createdAt: 1637745536160,
        updatedBy: "rbinwani",
        updatedAt: 1655425777535,
      },
      priceInfo: {
        extendedList: 654000,
        unitNet: 0,
        originalExtendedList: 0,
        originalUnitList: 0,
        totalNet: 351902.4,
        totalNetBeforeCredit: 351902.4,
        totalNetAfterIBCredit: 0,
        unitListMRC: 0,
        unitNetMRC: 0,
        proposalPurchaseAdjustment: 0,
      },
      message: {
        hasError: true,
        messages: [
          {
            code: "EA066",
            text: 'EA3-M - The configuration of this item is not valid. Click on the "Edit Options" link to configure the item. (CS470)',
            severity: "ERROR",
            createdAt: 1655425771349,
            createdBy: "rbinwani",
            identifier: "EA3-M",
            level: "BUNDLE",
            type: "CONFIG",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "EA3-M - Your Requested Start Date (24-May-2022) provided is invalid. A valid date range is between  16-Jun-2022 and 13-Sep-2022. Select a new Requested Start Date. (CS639)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "EA3-M",
            level: "BUNDLE",
            type: "CONFIG",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "EA3-M - Requested Start Date cannot be modified as service suite is present in the EA Configuration.  (CS840)",
            severity: "INFO",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "EA3-M",
            level: "BUNDLE",
            type: "CONFIG",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "EA3-M - One or more configurations in this bundle are not verified or invalid. Review and correct the configurations. (CS200)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "EA3-M",
            level: "BUNDLE",
            type: "CONFIG",
            key: "EA066",
          },
          {
            code: "EA066",
            text: 'E3-A-HXDP - The configuration of this item is not valid. Click on the "Edit Options" link to configure the item. (CS470)',
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-A-HXDP",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "2",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "E3-A-HXDP - Your Requested Start Date (24-May-2022) provided is invalid. A valid date range is between  16-Jun-2022 and 13-Sep-2022. Select a new Requested Start Date. (CS639)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-A-HXDP",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "2",
            key: "EA066",
          },
          {
            code: "EA066",
            text: 'E3-SEC-WKLD - The configuration of this item is not valid. Click on the "Edit Options" link to configure the item. (CS470)',
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-SEC-WKLD",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "3",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "E3-SEC-WKLD - Your Requested Start Date (24-May-2022) provided is invalid. A valid date range is between  16-Jun-2022 and 13-Sep-2022. Select a new Requested Start Date. (CS639)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-SEC-WKLD",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "3",
            key: "EA066",
          },
          {
            code: "EA066",
            text: 'E3-HXDP-SVS1 - The configuration of this item is not valid. Click on the "Edit Options" link to configure the item. (CS470)',
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-HXDP-SVS1",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "5",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "E3-HXDP-SVS1 - Your Requested Start Date (24-May-2022) provided is invalid. A valid date range is between  16-Jun-2022 and 13-Sep-2022. Select a new Requested Start Date. (CS639)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-HXDP-SVS1",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "5",
            key: "EA066",
          },
          {
            code: "EA066",
            text: 'E3-INT-SVS1 - The configuration of this item is not valid. Click on the "Edit Options" link to configure the item. (CS470)',
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-INT-SVS1",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "5",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "E3-INT-SVS1 - Your Requested Start Date (24-May-2022) provided is invalid. A valid date range is between  16-Jun-2022 and 13-Sep-2022. Select a new Requested Start Date. (CS639)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-INT-SVS1",
            level: "ATO",
            type: "CONFIG",
            groupIdentifier: "5",
            key: "EA066",
          },
          {
            code: "EA066",
            text: "E3-CX-INT-T1SWP - Required pricing attributes are not defined in the system for this item (D1012)",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            identifier: "E3-CX-INT-T1SWP",
            parentIdentifier: "E3-INT-SVS1",
            level: "PID",
            type: "CONFIG",
            groupIdentifier: "5",
            key: "EA066",
          },
          {
            code: "EA068",
            text: "One or more errors exist or configuration is invalid in the proposal. Please fix errors to address the issue and re-price the proposal",
            severity: "ERROR",
            createdAt: 1655425771350,
            createdBy: "rbinwani",
            key: "EA068",
          },
          {
            code: "EA067",
            text: "Pricing service error",
            severity: "ERROR",
            createdAt: 1655425777007,
            createdBy: "rbinwani",
            identifier: "E3-CX-INT-T1SWP",
            parentIdentifier: "E3-INT-SVS1",
            level: "PID",
            type: "PRICING",
            groupIdentifier: "5",
            key: "EA067",
          },
          {
            code: "EA037",
            text: "You need to enter qty for E3-A-TE to proceed with proposal submission",
            severity: "ERROR",
            createdAt: 1655425777009,
            createdBy: "rbinwani",
            identifier: "E3-A-TE",
            level: "ATO",
            type: "ELIGIBILITY",
            groupIdentifier: "2",
            key: "EA037",
          },
          {
            code: "EA037",
            text: "You need to enter qty for E3-A-APPD to proceed with proposal submission",
            severity: "ERROR",
            createdAt: 1655425777009,
            createdBy: "rbinwani",
            identifier: "E3-A-APPD",
            level: "ATO",
            type: "ELIGIBILITY",
            groupIdentifier: "2",
            key: "EA037",
          },
          {
            code: "EA037",
            text: "You need to enter qty for E3-A-INTERSIGHT to proceed with proposal submission",
            severity: "ERROR",
            createdAt: 1655425777009,
            createdBy: "rbinwani",
            identifier: "E3-A-INTERSIGHT",
            level: "ATO",
            type: "ELIGIBILITY",
            groupIdentifier: "2",
            key: "EA037",
          },
          {
            code: "EA096",
            text: "Engage your AppD team to confirm this opportunity is eligible: Net New AppD Customer, AVP Expand or Q4 AppD Renewal. Offer only available in United States & Canada. Questions? Contact accelerate@appdynamics.com",
            severity: "WARN",
            createdAt: 1655425777010,
            createdBy: "rbinwani",
            key: "EA096",
          },
        ],
      },
      commitInfo: {
        committed: true,
        threshold: 100000,
        fullCommitTcv: 351902.4,
        partialCommitTcv: 0,
      },
      forceAllowCompletion: false,
      programEligibility: {
        eligible: true,
        nonEligiblePrimaryEnrollments: [],
        nonEligibleSecondaryEnrollments: [],
        eligiblePrimaryEnrollments: [],
        eligibleSecondaryEnrollments: [],
      },
      syncStatus: {
        cxCcwrPriceDirty:true,
        cxEditFlag:false,
        cxCcwrRipFlag:false,
        showIbAssessmentButton:false
      },
      deleted: false,
      scopeInfo: {
        scopeId: 1602,
        masterAgreementId: "EA1443",
        returningCustomer: true,
        activeSecurityTier: "TIER_1",
        enrollmentsEamsDeliveryByBeGeoId: {},
        partnerActiveEnrollments: {
          "90664158": [
            {
              pgtmvBegeoId: "90664158",
              subscriptionRefId: "SRTS1100250",
              subscriptionId: "SCTS1100252",
              subscriptionStartDate: "11/10/2021",
              subscriptionEndDate: "11/09/2024",
              enrollmentAtos: {
                "1": ["E3-N-MRNI", "E3-N-AS"],
              },
              atoPids: {
                "E3-N-MRNI": ["E3N-MS120-24", "E3N-MX60W-ENT"],
                "E3-N-AS": [
                  "E3N-C93002-A",
                  "E3N-C9300L2-A",
                  "E3N-C95006-A",
                  "E3N-C9300L1-A",
                  "E3N-C95004-A",
                  "E3N-C3560CX2-A",
                  "E3N-AS-S",
                  "E3N-C95005-A",
                  "E3N-C95001-A",
                  "E3N-C9400-A",
                  "E3N-C93001-A",
                ],
              },
            },
          ],
          "166777862": [
            {
              pgtmvBegeoId: "166777862",
              subscriptionRefId: "SRTS1100247",
              subscriptionId: "SCTS1100249",
              subscriptionStartDate: "11/19/2021",
              subscriptionEndDate: "11/18/2024",
              enrollmentAtos: {
                "4": ["E3-COLLAB"],
              },
              atoPids: {
                "E3-COLLAB": [
                  "E3C-MSUITE-ENT",
                  "E3C-CS-MNTH",
                  "E3C-TOLLDIALIN",
                  "E3C-WEBEX-SUITE",
                  "E3C-MSG-ENT",
                  "E3C-C-TA-ITF",
                  "E3C-CL-CA",
                  "E3C-EDGEAUD-USER",
                  "E3C-CA-DEV",
                  "E3C-C-PRO",
                  "E3C-P-CALL",
                  "E3C-C-TA-BCTF",
                  "E3C-C-PREMTOLL",
                  "E3C-C-TA-BCCB",
                  "E3C-C-DEV-ENT",
                  "E3C-NBR-STG",
                  "E3C-VOIP",
                  "E3C-FILESTG-ENT",
                  "E3C-PROPACK-ENT",
                ],
              },
            },
            {
              pgtmvBegeoId: "166777862",
              subscriptionRefId: "SRTS1100292",
              subscriptionId: "SCTS1100296",
              subscriptionStartDate: "11/17/2021",
              subscriptionEndDate: "11/16/2024",
              enrollmentAtos: {
                "4": ["E3-COLLAB"],
              },
              atoPids: {
                "E3-COLLAB": [
                  "E3C-PROPACK-ENT",
                  "E3C-TOLLDIALIN",
                  "E3C-MSUITE-ENT",
                  "E3C-CS-MNTH",
                  "E3C-WEBEX-SUITE",
                  "E3C-EDGEAUD-USER",
                  "E3C-MSG-ENT",
                  "E3C-C-TA-ITF",
                  "E3C-CL-CA",
                  "E3C-CA-DEV",
                  "E3C-WEBEX-SUPT-BAS",
                  "E3C-C-PRO",
                  "E3C-P-CALL",
                  "E3C-C-TA-ICB",
                  "E3C-C-TA-BCTF",
                  "E3C-C-PREMTOLL",
                  "E3C-C-TA-BCCB",
                  "E3C-NBR-STG",
                  "E3C-C-DEV-ENT",
                  "E3C-VOIP",
                  "E3C-FILESTG-ENT",
                ],
              },
            },
          ],
          "272241792": [
            {
              pgtmvBegeoId: "272241792",
              subscriptionRefId: "INTSRTS3503",
              subscriptionId: "SCTS1100012",
              subscriptionStartDate: "10/22/2021",
              subscriptionEndDate: "10/21/2024",
              enrollmentAtos: {
                "3": ["E3-SEC-CLDLK", "E3-SEC-UMBDNSE", "E3-SEC-ISE"],
              },
              atoPids: {
                "E3-SEC-CLDLK": ["E3S-CL-PLT2"],
                "E3-SEC-ISE": ["E3S-ISE-ESS", "SVS-E3S-ISE-B"],
                "E3-SEC-UMBDNSE": ["E3S-UMB-DNSE"],
              },
            },
            {
              pgtmvBegeoId: "272241792",
              subscriptionRefId: "SUBUI123456796",
              subscriptionId: "SCTS1100012",
              subscriptionStartDate: "10/22/2021",
              subscriptionEndDate: "10/21/2024",
              enrollmentAtos: {
                "3": ["E3-SEC-CLDLK", "E3-SEC-UMBDNSE", "E3-SEC-ISE"],
              },
              atoPids: {
                "E3-SEC-CLDLK": ["E3S-CL-PLT2"],
                "E3-SEC-ISE": ["E3S-ISE-ESS", "SVS-E3S-ISE-B"],
                "E3-SEC-UMBDNSE": ["E3S-UMB-DNSE"],
              },
            },
            {
              pgtmvBegeoId: "272241792",
              subscriptionRefId: "SRTS1100099",
              subscriptionId: "SCTS1100101",
              subscriptionStartDate: "11/08/2021",
              subscriptionEndDate: "11/07/2024",
              enrollmentAtos: {
                "1": ["E3-N-DNAS-M", "E3-N-DCN"],
                "5": ["E3-DCN-SVS1"],
              },
              atoPids: {
                "E3-DCN-SVS1": [
                  "E3-CX-DCN-T1NT",
                  "E3-CX-DCN-T1S4P",
                  "E3-CX-EAMSC",
                ],
                "E3-N-DCN": [
                  "E3N-N9300-XF-A",
                  "E3N-N3K-XF-A",
                  "E3N-N9500-M816-A",
                  "E3N-N9300-XF2-A",
                  "E3N-DCN-S",
                  "E3N-CAPIC-A",
                ],
                "E3-N-DNAS-M": [
                  "E3N-DNAS-ACT-M",
                  "E3N-DNAS-EXT-M",
                  "E3N-DNAS-SEE-M",
                  "E3N-DNAS-M-S",
                ],
              },
            },
            {
              pgtmvBegeoId: "272241792",
              subscriptionRefId: "SRTS1100010",
              subscriptionId: "SCTS1100012",
              subscriptionStartDate: "10/22/2021",
              subscriptionEndDate: "10/21/2024",
              enrollmentAtos: {
                "3": ["E3-SEC-CLDLK", "E3-SEC-UMBDNSE", "E3-SEC-ISE"],
              },
              atoPids: {
                "E3-SEC-CLDLK": ["E3S-CL-PLT2"],
                "E3-SEC-ISE": ["E3S-ISE-ESS", "SVS-E3S-ISE-B"],
                "E3-SEC-UMBDNSE": ["E3S-UMB-DNSE"],
              },
            },
          ],
        },
      },
      reopenAudit: {
        createdBy: "rbinwani",
        createdAt: 1652856183568,
        updatedBy: "rbinwani",
        updatedAt: 1652856183568,
      },
      subscriptionInfo: {
        existingCustomer: true,
        justification: "123123",
      },
      summaryViewAllowed: false,
      statusDesc: "In Progress",
      allowCompletion: false,
    },
    enrollments: [
      {
        id: 5,
        name: "Services",
        primary: false,
        enrolled: true,
        displayQnA: false,
        displaySeq: 5,
        billingTerm: {
          rsd: "20220607",
          billingModel: "Prepaid",
          term: 48,
          eaEndDateStr: "20260606",
          eaEndDate: 1780729200000,
        },
        commitInfo: {
          committed: false,
          fcSuiteCount: 1,
          pcSuiteCount: 1,
          fcTcv: 0,
          pcTcv: 0,
        },
        pools: [
          {
            name: "Networking_Services",
            desc: "Networking Support & Lifecycle Services",
            displaySeq: 1,
            display: true,
            suites: [
              {
                name: "Services: DC Networking",
                desc: "Services: DC Networking",
                ato: "E3-DCN-SVS1",
                autoSelected: true,
                displaySeq: 1,
                tiers: [
                  {
                    name: "E3-DCN-SVS1",
                    desc: "Services Tier 1",
                    cxOptIn: false,
                  },
                ],
                displayGroup: false,
                disabled: true,
                active: true,
                cxOptIn: false,
              },
            ],
          },
          {
            name: "Applications_Services",
            desc: "Applications Services",
            displaySeq: 2,
            display: true,
            suites: [
              {
                name: "Services: Hyperflex",
                desc: "Services: Hyperflex",
                ato: "E3-HXDP-SVS1",
                inclusion: true,
                autoSelected: true,
                displaySeq: 1,
                discount: {
                  subsDisc: 43,
                  servDisc: 0,
                  multiProgramDesc: {
                    msd: 0,
                    mpd: 0,
                    med: 0,
                    bundleDiscount: 0,
                  },
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: true,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                },
                groups: [
                  {
                    id: 1,
                    name: "H/w Support Options",
                    displaySeq: 1,
                  },
                  {
                    id: 2,
                    name: "Delivery Support Options",
                    displaySeq: 2,
                  },
                ],
                tiers: [
                  {
                    name: "E3-HXDP-SVS1",
                    desc: "Services Tier 1",
                    cxOptIn: false,
                  },
                ],
                displayGroup: false,
                credit: {},
                pids: [
                  {
                    name: "E3-CX-EAMSP",
                    desc: "SVCS Portfolio EA Management Service Partner",
                    displaySeq: 10,
                    groupId: 3,
                    discount: {},
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [{}],
                    type: "CX_EAMS",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1NCO",
                    desc: "SVCS Portfolio T1 8x7xNCD OS Hyperflex Support",
                    displaySeq: 6,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1NP",
                    desc: "SVCS Portfolio T1 24x7x4 Hyperflex Support",
                    displaySeq: 3,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1NC",
                    desc: "SVCS Portfolio T1 8x7xNCD Hyperflex Support",
                    displaySeq: 2,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1S2P",
                    desc: "SVCS Portfolio T1 24x7x2 Hyperflex Support",
                    displaySeq: 7,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1NT",
                    desc: "SVCS Portfolio T1 8x5xNBD Hyperflex Support",
                    displaySeq: 1,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1SCS",
                    desc: "SVCS Portfolio T1 8x5xNBD OS Hyperflex Support",
                    displaySeq: 5,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-EAMSC",
                    desc: "SVCS Portfolio EA Management Service Cisco",
                    displaySeq: 9,
                    groupId: 2,
                    discount: {
                      servDisc: 43,
                    },
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [
                      {
                        qty: 1,
                      },
                    ],
                    type: "CX_EAMS",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1S4P",
                    desc: "SVCS Portfolio T1 24x7x4 OS Hyperflex Support",
                    displaySeq: 4,
                    groupId: 1,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-HXDP-T1C2P",
                    desc: "SVCS Portfolio T1 24x7x2 OS Hyperflex Support",
                    displaySeq: 8,
                    groupId: 2,
                    discount: {},
                    priceInfo: {},
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {},
                    dtls: [{}],
                    type: "CX_HW_SUPPORT",
                    cxIbQty: {},
                    discountDirty: false,
                    supportPid: true,
                  },
                ],
                priceInfo: {
                  extendedList: 0,
                  unitNet: 0,
                  totalNet: 0,
                  totalNetBeforeCredit: 0,
                  totalSrvcNet: 0,
                  totalSrvcNetBeforeCredit: 0,
                },
                ncPriceInfo: {
                  extendedList: 0,
                  unitNet: 0,
                  totalNet: 0,
                  totalNetBeforeCredit: 0,
                },
                disabled: false,
                active: true,
                cxOptIn: true,
                cxSelectedTier: "E3-HXDP-SVS1",
                cxTierOptions: [],
                cxAttachRate: 10,
                migration: false,
                atoTier: "E3-HXDP-SVS1",
                atoTierOptions: [],
              },
              {
                name: "Services: Intersight",
                desc: "Services: Intersight",
                ato: "E3-INT-SVS1",
                inclusion: true,
                autoSelected: true,
                displaySeq: 1,
                discount: {
                  subsDisc: 43,
                  servDisc: 0,
                  multiProgramDesc: {
                    msd: 0,
                    mpd: 0,
                    med: 0,
                    bundleDiscount: 0,
                  },
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: false,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                },
                groups: [
                  {
                    id: 1,
                    name: "Support Options",
                    displaySeq: 1,
                  },
                  {
                    id: 2,
                    name: "Delivery Support Options",
                    displaySeq: 2,
                  },
                ],
                tiers: [
                  {
                    name: "E3-INT-SVS1",
                    desc: "Services Tier 1",
                    cxOptIn: false,
                  },
                ],
                displayGroup: false,
                pids: [
                  {
                    name: "E3-CX-INT-T1SWC",
                    desc: "SVCS Portfolio T1 Intersight Cloud SW Support",
                    displaySeq: 1,
                    groupId: 1,
                    discount: {},
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [{}],
                    type: "CX_SOLUTION_SUPPORT",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-EAMSP",
                    desc: "SVCS Portfolio EA Management Service Partner",
                    displaySeq: 4,
                    groupId: 2,
                    discount: {},
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [{}],
                    type: "CX_EAMS",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-INT-T1SWP",
                    desc: "SVCS Portfolio T1 Intersight On-Prem SW Support",
                    displaySeq: 2,
                    groupId: 1,
                    discount: {
                      servDisc: 0,
                    },
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [
                      {
                        qty: 1,
                      },
                    ],
                    type: "CX_SOLUTION_SUPPORT",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3-CX-EAMSC",
                    desc: "SVCS Portfolio EA Management Service Cisco",
                    displaySeq: 3,
                    groupId: 2,
                    discount: {
                      servDisc: 43,
                    },
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    dtls: [
                      {
                        qty: 1,
                      },
                    ],
                    type: "CX_EAMS",
                    discountDirty: false,
                    supportPid: true,
                  },
                ],
                priceInfo: {
                  extendedList: 0,
                  unitNet: 0,
                  totalNet: 0,
                  totalNetBeforeCredit: 0,
                  totalSrvcNet: 0,
                  totalSrvcNetBeforeCredit: 0,
                },
                ncPriceInfo: {
                  extendedList: 0,
                  unitNet: 0,
                  totalNet: 0,
                  totalNetBeforeCredit: 0,
                },
                disabled: false,
                active: true,
                cxOptIn: true,
                cxSelectedTier: "E3-INT-SVS1",
                cxTierOptions: [],
                cxAttachRate: 10,
                migration: false,
                atoTier: "E3-INT-SVS1",
                atoTierOptions: [],
              },
            ],
          },
        ],
        priceInfo: {
          extendedList: 0,
          unitNet: 0,
          totalNet: 0,
          totalNetBeforeCredit: 0,
          purchaseAdjustment: 0,
          totalSrvcNet: 0,
          totalSrvcNetBeforeCredit: 0,
        },
        ncPriceInfo: {
          extendedList: 0,
          unitNet: 0,
          totalNet: 0,
          totalNetBeforeCredit: 0,
        },
        disabled: false,
        active: true,
        externalConfiguration: false,
        cxOptInAllowed: false,
        cxAttached: true,
        service: true,
        eamsDelivery: {
          partnerDeliverySelected: false,
        },
        awaitingResponse: true,
        lineInError: false,
        discountCascadePending: false,
        hwSupportLinesState: "SYNC_REQUEST_PENDING",
        hardwareLinePricesInSync: false,
        cxSoftwareSupportOnly: false,
        disableRsdAndTermUpdate: false,
      },
      {
        id: 2,
        name: "Applications Infrastructure",
        primary: true,
        enrolled: true,
        displayQnA: false,
        displaySeq: 2,
        billingTerm: {
          rsd: "20220524",
          billingModel: "Prepaid",
          billingModelName: "Prepaid Term",
          term: 48,
          eaEndDateStr: "20260523",
          eaEndDate: 1779519600000,
        },
        commitInfo: {
          committed: true,
          fcSuiteCount: 1,
          pcSuiteCount: 3,
          fcTcv: 128702.4,
        },
        pools: [
          {
            name: "Applications",
            desc: "Full Stack Observability",
            displaySeq: 1,
            display: true,
            suites: [
              {
                name: "Hyperflex",
                desc: "HyperFlex",
                ato: "E3-A-HXDP",
                inclusion: true,
                autoSelected: true,
                displaySeq: 1,
                discount: {
                  subsDisc: 61,
                  servDisc: 61,
                  multiProgramDesc: {
                    msd: 0,
                    mpd: 0,
                    med: 0,
                    bundleDiscount: 0,
                  },
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: true,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                  threshold: 50000,
                  ibQtyThreshold: {
                    achieved: 10,
                    required: 0,
                  },
                  priceThreshold: {
                    achieved: 128702.4,
                    required: 50000,
                  },
                },
                groups: [
                  {
                    id: 1,
                    name: "Hyperflex Data Center",
                    displaySeq: 1,
                  },
                  {
                    id: 2,
                    name: "Hyperflex Edge Platform",
                    displaySeq: 2,
                  },
                ],
                displayGroup: true,
                lines: [
                  {
                    id: "APL-HX-E",
                    desc: "HyperFlex Data Platform M5 Edge",
                    displaySeq: 1,
                    groupId: 2,
                  },
                  {
                    id: "APL-HX-M6-DC-SLR",
                    desc: "HyperFlex SLR Data Platform M6 Data Center",
                    displaySeq: 4,
                    groupId: 1,
                  },
                  {
                    id: "APL-HX-M6-DC",
                    desc: "HyperFlex Data Platform M6 Data Center",
                    displaySeq: 3,
                    groupId: 1,
                  },
                  {
                    id: "APL-HX-E-SLR",
                    desc: "HyperFlex SLR Data Platform M5 Edge",
                    displaySeq: 2,
                    groupId: 2,
                  },
                  {
                    id: "APL-HX-DC-SLR",
                    desc: "HyperFlex SLR Data Platform M5 Data Center",
                    displaySeq: 2,
                    groupId: 1,
                  },
                  {
                    id: "APL-HX-DC",
                    desc: "HyperFlex Data Platform M5 Data Center",
                    displaySeq: 1,
                    groupId: 1,
                    qty: 10,
                    priceInfo: {
                      extendedList: 330000,
                      unitNet: 268.13,
                      totalNet: 128702.4,
                      totalNetBeforeCredit: 128702.4,
                      totalSwNet: 128702.4,
                      totalSwNetBeforeCredit: 128702.4,
                    },
                    ncPriceInfo: {
                      extendedList: 330000,
                      unitNet: 268.13,
                      totalNet: 128702.4,
                      totalNetBeforeCredit: 128702.4,
                    },
                    credit: {},
                  },
                  {
                    id: "APL-HX-M6-E",
                    desc: "HyperFlex Data Platform M6 Edge",
                    displaySeq: 3,
                    groupId: 2,
                  },
                  {
                    id: "APL-HX-M6-E-SLR",
                    desc: "HyperFlex SLR Data Platform M6 Edge",
                    displaySeq: 4,
                    groupId: 2,
                  },
                ],
                ibDtls: [
                  {
                    lineId: "APL-HX-DC",
                    pidName: "E3A-HXDP-DC-A",
                    qty: 0,
                  },
                  {
                    lineId: "N/D",
                    pidName: "E3A-HXDP-S",
                    qty: 0,
                  },
                ],
                priceInfo: {
                  extendedList: 330000,
                  unitNet: 0,
                  totalNet: 128702.4,
                  totalNetBeforeCredit: 128702.4,
                  totalSwNet: 128702.4,
                  totalSwNetBeforeCredit: 128702.4,
                  totalSrvcNet: 0,
                  totalSrvcNetBeforeCredit: 0,
                },
                ncPriceInfo: {
                  extendedList: 330000,
                  unitNet: 0,
                  totalNet: 128702.4,
                  totalNetBeforeCredit: 128702.4,
                },
                disabled: false,
                active: true,
                cxOptIn: false,
                migration: false,
              },
              {
                name: "Intersight",
                desc: "Intersight",
                ato: "E3-A-INTERSIGHT",
                inclusion: true,
                autoSelected: true,
                displaySeq: 2,
                discount: {
                  subsDisc: 20,
                  servDisc: 0,
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: false,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                  threshold: 50000,
                  ibQtyThreshold: {
                    achieved: 0,
                    required: 0,
                  },
                  priceThreshold: {
                    achieved: 0,
                    required: 50000,
                  },
                },
                displayGroup: false,
                lines: [
                  {
                    id: "APL-IS-WOSAAS",
                    desc: "Intersight Workload Optimizer SaaS",
                    displaySeq: 3,
                  },
                  {
                    id: "APL-IS-SAAS",
                    desc: "Intersight SaaS ",
                    displaySeq: 1,
                  },
                  {
                    id: "APL-IS-CVAP",
                    desc: "Intersight - Virtual Appliance",
                    displaySeq: 6,
                  },
                  {
                    id: "APL-IS-WODVID",
                    desc: "Intersight Workload Optimizer VDI SaaS",
                    displaySeq: 4,
                  },
                  {
                    id: "APL-IS-PVAP",
                    desc: "Intersight Private Virtual Appliance",
                    displaySeq: 2,
                  },
                  {
                    id: "APL-IKSA-SAAS-ADD",
                    desc: "Intersight Kubernetes Service",
                    displaySeq: 5,
                  },
                ],
                disabled: false,
                active: true,
                cxOptIn: false,
                migration: false,
              },
              {
                name: "AppDynamics",
                desc: "AppDynamics",
                ato: "E3-A-APPD",
                inclusion: true,
                autoSelected: true,
                displaySeq: 3,
                discount: {
                  subsDisc: 20,
                  servDisc: 0,
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: false,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                  threshold: 50000,
                  ibQtyThreshold: {
                    achieved: 0,
                    required: 0,
                  },
                  priceThreshold: {
                    achieved: 0,
                    required: 50000,
                  },
                },
                groups: [
                  {
                    id: 1,
                    name: "Prod SaaS - Core",
                    displaySeq: 1,
                  },
                  {
                    id: 2,
                    name: "Prod SaaS - Add Ons",
                    displaySeq: 2,
                  },
                  {
                    id: 3,
                    name: "Test/Dev SaaS - Core",
                    displaySeq: 3,
                  },
                  {
                    id: 4,
                    name: "Test/Dev SaaS - Add Ons",
                    displaySeq: 4,
                  },
                ],
                tiers: [
                  {
                    name: "E3-A-APPD",
                    desc: "IBL",
                    cxOptIn: false,
                  },
                  {
                    name: "E3-A-APPD-ABL",
                    desc: "ABL",
                    cxOptIn: false,
                  },
                ],
                displayGroup: true,
                lines: [
                  {
                    id: "APL-APPD-PRD-LA-IBL-ADD",
                    desc: "AppD Pro Edition - Log Analytics IBL- SaaS",
                    displaySeq: 11,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-CIS60D-ADD",
                    desc: "AppD-Enterprise-60 Day Cloud Index Storage",
                    displaySeq: 14,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-C",
                    desc: "AppD Prod - SaaS",
                    displaySeq: 1,
                    groupId: 1,
                  },
                  {
                    id: "APL-APPD-PRD-IOT-IBL-ADD",
                    desc: "AppD Peak Edition - IoT (Connected Devices) IBL- SaaS",
                    displaySeq: 10,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-PKRUM-ADD",
                    desc: "AppD Peak (Test & Dev) Ed-Real User Monitor-SaaS Legacy",
                    displaySeq: 4,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-PK-RUM-ADD",
                    desc: "AppD Peak Edition - Real User Monitoring - SaaS",
                    displaySeq: 3,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-IM-ADD",
                    desc: "AppD Infrastructure Monitoring Edition - SaaS",
                    displaySeq: 1,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-CIS30D-ADD",
                    desc: "AppD Enterprise 30-Day Cloud Index Storage",
                    displaySeq: 13,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-CIS90D-ADD",
                    desc: "AppD Test & Dev Enterprise 90-Day Cloud Index Storage",
                    displaySeq: 9,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-TD-PKIOT-ADD",
                    desc: "AppD Peak (Test & Dev Edition)-IoT (Connd Devics) IBL-SaaS",
                    displaySeq: 5,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-BSMPA-ADD",
                    desc: "AppD Pro Browser Synthetic Monitor Private Agent-Per Location SaaS Legacy",
                    displaySeq: 5,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-RUM60D-ADD",
                    desc: "AppD Test & Dev Brwsr/Mob/RUM Analytics 60-Day Cloud Index Stg",
                    displaySeq: 11,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-TD-RUM30D-ADD",
                    desc: "AppD Test & Dev Brwsr/Mob/RUM Analytics 30-Day Cloud Index Stg",
                    displaySeq: 10,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-TD-LA-ADD-I",
                    desc: "AppD Test & Dev Edition - Log Analytics IBL- SaaS",
                    displaySeq: 6,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-CIS90D-ADD",
                    desc: "AppD-Enterprise-90 Day Cloud Index Storage",
                    displaySeq: 15,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-CSA-IBL-ADD",
                    desc: "AppD with Cisco Secure Application IBL- SaaS",
                    displaySeq: 9,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-PR-RUM-ADD",
                    desc: "AppD Pro Edition - Real User Monitoring - SaaS",
                    displaySeq: 2,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-CIS30D-ADD",
                    desc: "AppD Test & Dev Enterprise 30-Day Cloud Index Storage",
                    displaySeq: 7,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-BSMPA-ADD-I",
                    desc: "AppD Pro Browser Synthetic Monitor Private Agent-Per Location SaaS IBL",
                    displaySeq: 6,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-RUM-ADD",
                    desc: "AppD Test & Dev Edition - Real User Monitoring - SaaS",
                    displaySeq: 2,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-TD-RUM-ADD-I",
                    desc: "AppD Peak (Test & Dev) Ed-Real User Monitor-SaaS IBL",
                    displaySeq: 3,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-BSMPA-ULM-ADD",
                    desc: "AppD Pro Ed-Brwsr Synthic Monitor Prv Agent-Unlmt Loc-SaaS Legacy",
                    displaySeq: 7,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-RUM30D-ADD",
                    desc: "AppD Prod-Brwsr/Mob/RUM Analytics 30-Day Cloud Index Stg",
                    displaySeq: 16,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-RUM90D-ADD",
                    desc: "AppD Test & Dev Brwsr/Mob/RUM Analytics 90-Day Cloud Index Stg",
                    displaySeq: 12,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-LA-CIS30D-ADD",
                    desc: "AppD Pro/T&D-LogAnlycs-30DayCloudIndexStg Add-on IBL-SaaS",
                    displaySeq: 12,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-C",
                    desc: "AppD Test & Dev - SaaS",
                    displaySeq: 1,
                    groupId: 3,
                  },
                  {
                    id: "APL-APPD-TD-CIS60D-ADD",
                    desc: "AppD Test & Dev Enterprise 60-Day Cloud Index Storage",
                    displaySeq: 8,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-PR-BSMPA-ADD",
                    desc: "AppD Pro Ed - Browser Synthetic User Monitor-Hosted Agent-SaaS",
                    displaySeq: 4,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-TD-IM-ADD",
                    desc: "AppD Test & Dev Infrastructure Monitoring Edition",
                    displaySeq: 1,
                    groupId: 4,
                  },
                  {
                    id: "APL-APPD-PRD-RUM60D-ADD",
                    desc: "AppD Prod-Brwsr/Mob/RUM Analytics 60-Day Cloud Index Stg",
                    displaySeq: 17,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-BSMPA-ULM-ADD-I",
                    desc: "AppD Pro Ed-Brwsr Synthic Monitor Prv Agent-Unlmt Loc-SaaS IBL",
                    displaySeq: 8,
                    groupId: 2,
                  },
                  {
                    id: "APL-APPD-PRD-RUM90D-ADD",
                    desc: "AppD Prod-Brwsr/Mob/RUM Analytics 90-Day Cloud Index Stg",
                    displaySeq: 18,
                    groupId: 2,
                  },
                ],
                disabled: false,
                active: true,
                cxOptIn: false,
                migration: false,
              },
              {
                name: "ThousandEyes",
                desc: "Thousand Eyes",
                ato: "E3-A-TE",
                inclusion: true,
                autoSelected: true,
                displaySeq: 4,
                discount: {
                  subsDisc: 20,
                  servDisc: 0,
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                commitInfo: {
                  committed: false,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                  threshold: 50000,
                  ibQtyThreshold: {
                    achieved: 0,
                    required: 0,
                  },
                  priceThreshold: {
                    achieved: 0,
                    required: 50000,
                  },
                },
                displayGroup: false,
                lines: [
                  {
                    id: "APL-TE-UNITS",
                    desc: "ThousandEyes - Cloud and Enterprise Agents (per unit)",
                    displaySeq: 2,
                  },
                  {
                    id: "APL-TE-USERS",
                    desc: "ThousandEyes - End User Monitoring (per user)",
                    displaySeq: 1,
                  },
                  {
                    id: "APL-TE-INSIGHTS-ADD",
                    desc: "ThousandEyes - Internet Insights (per package)",
                    displaySeq: 3,
                  },
                ],
                disabled: false,
                active: true,
                cxOptIn: false,
                migration: false,
              },
            ],
          },
        ],
        priceInfo: {
          extendedList: 330000,
          unitNet: 0,
          totalNet: 128702.4,
          totalNetBeforeCredit: 128702.4,
          totalSwNet: 128702.4,
          totalSwNetBeforeCredit: 128702.4,
          totalSrvcNet: 0,
          totalSrvcNetBeforeCredit: 0,
        },
        ncPriceInfo: {
          extendedList: 330000,
          unitNet: 0,
          totalNet: 128702.4,
          totalNetBeforeCredit: 128702.4,
        },
        disabled: false,
        active: true,
        externalConfiguration: false,
        cxOptInAllowed: true,
        cxAttached: true,
        service: false,
        disableRsdAndTermUpdate: false,
      },
      {
        id: 3,
        name: "Security",
        primary: false,
        enrolled: true,
        displayQnA: true,
        displaySeq: 4,
        billingTerm: {
          rsd: "20220524",
          billingModel: "Prepaid",
          billingModelName: "Prepaid Term",
          term: 48,
          eaEndDateStr: "20260523",
          eaEndDate: 1779519600000,
        },
        commitInfo: {
          committed: true,
          fcSuiteCount: 1,
          pcSuiteCount: 0,
          fcTcv: 223200,
        },
        pools: [
          {
            name: "Zero_Trust_Solution",
            desc: "Zero Trust Solution",
            displaySeq: 1,
            display: true,
            suites: [
              {
                name: "Identity Services Engine (ISE)",
                desc: "Identity Services Engine (ISE)",
                ato: "E3-SEC-ISE",
                autoSelected: true,
                displaySeq: 1,
                displayGroup: true,
                disabled: true,
                active: true,
                cxOptIn: false,
              },
              {
                name: "Secure Workload",
                desc: "Secure Workload",
                ato: "E3-SEC-WKLD",
                inclusion: true,
                autoSelected: true,
                displaySeq: 3,
                discount: {
                  subsDisc: 31.11,
                  servDisc: 31.11,
                  multiProgramDesc: {
                    msd: 0,
                    mpd: 0,
                    med: 0,
                    bundleDiscount: 0,
                  },
                },
                billingTerm: {
                  rsd: "20220524",
                  billingModel: "Prepaid",
                  term: 48,
                  eaEndDateStr: "20260523",
                  eaEndDate: 1779519600000,
                },
                qtyUnit: "Workloads",
                commitInfo: {
                  committed: true,
                  fcSuiteCount: 0,
                  pcSuiteCount: 0,
                  qtyThreshold: {
                    achieved: 200,
                    required: 100,
                    calculated: 200,
                  },
                },
                groups: [
                  {
                    id: 1,
                    name: "Secure Workload Cloud",
                    displaySeq: 1,
                  },
                  {
                    id: 2,
                    name: "Secure Workload On-Prem",
                    displaySeq: 2,
                  },
                  {
                    id: 3,
                    name: "Support Options",
                    displaySeq: 3,
                  },
                ],
                displayGroup: true,
                pids: [
                  {
                    name: "E3S-WKLD-CLDENDPT",
                    desc: "Secure Workload SaaS Endpoint visibility License (E3S-WKLD-CLDENDPT)",
                    displaySeq: 2,
                    groupId: 1,
                    dtls: [{}],
                    type: "SUBSCRIPTION",
                    discountDirty: false,
                    supportPid: false,
                  },
                  {
                    name: "E3S-WKLD-PREMENDPT",
                    desc: "Secure Workload Endpoint Visibility License (E3S-WKLD-PREMENDPT)",
                    displaySeq: 2,
                    groupId: 2,
                    dtls: [{}],
                    type: "SUBSCRIPTION",
                    discountDirty: false,
                    supportPid: false,
                  },
                  {
                    name: "E3S-WKLD-CLDCWP",
                    desc: "Secure Workload SaaS Workload Protection License (E3S-WKLD-CLDCWP)",
                    displaySeq: 1,
                    groupId: 1,
                    discount: {
                      servDisc: 31.11,
                    },
                    priceInfo: {
                      extendedList: 324000,
                      unitNet: 23.25,
                      totalNet: 223200,
                      totalNetBeforeCredit: 223200,
                    },
                    ncPriceInfo: {
                      extendedList: 324000,
                      unitNet: 23.25,
                      totalNet: 223200,
                      totalNetBeforeCredit: 223200,
                    },
                    credit: {
                      nlCredits: [
                        {
                          nlCreditType: "SUBSCRIPTION_RESISDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                        {
                          nlCreditType: "PERPETUAL_RESIDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                        {
                          nlCreditType: "SERVICE_RESIDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                      ],
                    },
                    dtls: [
                      {
                        qty: 200,
                        ibQty: 0,
                      },
                    ],
                    type: "SUBSCRIPTION",
                    discountDirty: false,
                    commitInfo: {
                      qtyThreshold: {
                        achieved: 200,
                        required: 0,
                      },
                    },
                    supportPid: false,
                  },
                  {
                    name: "SVS-E3S-WKLD-B",
                    desc: "Basic Software Support for Secure Workload (SVS-E3S-WKLD-B)",
                    displaySeq: 1,
                    groupId: 3,
                    discount: {
                      servDisc: 43,
                    },
                    priceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    ncPriceInfo: {
                      extendedList: 0,
                      unitNet: 0,
                      totalNet: 0,
                      totalNetBeforeCredit: 0,
                    },
                    credit: {
                      nlCredits: [
                        {
                          nlCreditType: "SUBSCRIPTION_RESISDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                        {
                          nlCreditType: "PERPETUAL_RESIDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                        {
                          nlCreditType: "SERVICE_RESIDUAL_CREDIT",
                          totalCredit: 0,
                          reset: false,
                          adjusted: false,
                        },
                      ],
                    },
                    dtls: [
                      {
                        qty: 1,
                        ibQty: 0,
                      },
                    ],
                    type: "BASIC_SUPPORT",
                    discountDirty: false,
                    supportPid: true,
                  },
                  {
                    name: "E3S-WKLD-PREMCWP",
                    desc: "Secure Workload CWP License - Per Workload (E3S-WKLD-PREMCWP)",
                    displaySeq: 1,
                    groupId: 2,
                    dtls: [{}],
                    type: "SUBSCRIPTION",
                    discountDirty: false,
                    supportPid: false,
                  },
                ],
                ibDtls: [
                  {
                    pidName: "E3S-WKLD-CLDCWP",
                    qty: 0,
                  },
                  {
                    pidName: "SVS-E3S-WKLD-B",
                    qty: 0,
                  },
                ],
                priceInfo: {
                  extendedList: 324000,
                  unitNet: 0,
                  totalNet: 223200,
                  totalNetBeforeCredit: 223200,
                  totalSwNet: 223200,
                  totalSwNetBeforeCredit: 223200,
                  totalSrvcNet: 0,
                  totalSrvcNetBeforeCredit: 0,
                },
                ncPriceInfo: {
                  extendedList: 324000,
                  unitNet: 0,
                  totalNet: 223200,
                  totalNetBeforeCredit: 223200,
                },
                disabled: false,
                active: true,
                cxOptIn: false,
                migration: false,
              },
            ],
          },
          {
            name: "Cloud_and_Network_Security_Solution",
            desc: "Cloud and Network Security Solution",
            displaySeq: 2,
            display: true,
            suites: [
              {
                name: "Umbrella",
                desc: "Umbrella",
                ato: "E3-SEC-UMBDNSA",
                autoSelected: true,
                displaySeq: 1,
                tiers: [
                  {
                    name: "E3-SEC-UMBDNSE",
                    desc: "DNS Essentials",
                    cxOptIn: false,
                  },
                  {
                    name: "E3-SEC-UMBDNSA",
                    desc: "DNS Advantage",
                    cxOptIn: false,
                  },
                  {
                    name: "E3-SEC-UMBSIGE",
                    desc: "SIG Essentials",
                    cxOptIn: false,
                  },
                  {
                    name: "E3-SEC-UMBSIGA",
                    desc: "SIG Advantage",
                    cxOptIn: false,
                  },
                  {
                    name: "E3-SEC-UMB-EDU",
                    desc: "Education",
                    cxOptIn: false,
                    educationInstituteOnly: true,
                  },
                ],
                displayGroup: true,
                disabled: true,
                active: true,
                cxOptIn: false,
                serviceAttachMandatory: true,
              },
            ],
          },
          {
            name: "Add_On_Products",
            desc: "Add-On Products",
            displaySeq: 4,
            display: true,
            suites: [
              {
                name: "Cloudlock",
                desc: "Cloudlock",
                ato: "E3-SEC-CLDLK",
                autoSelected: true,
                displaySeq: 4,
                displayGroup: true,
                disabled: true,
                active: true,
                cxOptIn: false,
                serviceAttachMandatory: true,
              },
            ],
          },
        ],
        priceInfo: {
          extendedList: 324000,
          unitNet: 0,
          totalNet: 223200,
          totalNetBeforeCredit: 223200,
          totalSwNet: 223200,
          totalSwNetBeforeCredit: 223200,
          totalSrvcNet: 0,
          totalSrvcNetBeforeCredit: 0,
        },
        ncPriceInfo: {
          extendedList: 324000,
          unitNet: 0,
          totalNet: 223200,
          totalNetBeforeCredit: 223200,
        },
        disabled: false,
        active: true,
        externalConfiguration: false,
        cxOptInAllowed: true,
        cxAttached: false,
        service: false,
        securityTier: "TIER_1",
        disableRsdAndTermUpdate: false,
      },
    ],
  },
};

class ProposalRestServiceMock {
  getApiCall(url) {
    return of(mockData);
  }
}

class VnextServiceMock {
  isValidResponseWithData(res: any) {
    return of(true);
  }
}

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
};

describe("EligibilityStatusComponent", () => {
  let component: EligibilityStatusComponent;
  let fixture: ComponentFixture<EligibilityStatusComponent>;
  let proposalRestService = new ProposalRestServiceMock();
  let vnextService = new VnextServiceMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      declarations: [EligibilityStatusComponent],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },
        PriceEstimateService,
        { provide: VnextService, useValue: vnextService },
        ProposalStoreService,
        { provide: ProposalRestService, useValue: proposalRestService },
        UtilitiesService,
        LocalizationService,
        CurrencyPipe,
        LocalizationPipe,
        PriceEstimateStoreService,
        EaRestService,
        DataIdConstantsService,
        EaStoreService
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInt", () => {
    const programEligibilityDataSpy = jest.spyOn(
      component,
      "getProgramEligibilityData"
    );
    const validResponseSpy = jest.spyOn(vnextService, "isValidResponseWithData");
    component.ngOnInit();
    expect(programEligibilityDataSpy).toHaveBeenCalled();
  });

  // it('should call to get programEligibilityData', () => {
  //   const securityPresentSpy = jest.spyOn(component, 'checkSecurityPresent');
  //   const calcuclatePercentageSpy = jest.spyOn(component, 'calcuclatePercentage');
  //   const getTotalSuiteCountSpy = jest.spyOn(component, 'getTotalSuiteCount');
  //   const checkToShowEligibleSpy = jest.spyOn(component, 'checkToShowEligible');
  //   const validResponseSpy = jest.spyOn(vnextService, 'isValidResponseWithData');
  //   const programEligibilityDataSpy = jest.spyOn(proposalRestService, 'getApiCall');
  //   component.getProgramEligibilityData();
  //   expect(programEligibilityDataSpy).toHaveBeenCalled();
  //   expect(validResponseSpy).toBeTruthy();
  //   expect(component.programEligibilityData).toBeTruthy();
  //   // expect(securityPresentSpy).toHaveBeenCalled();
  //   expect(calcuclatePercentageSpy).toHaveBeenCalled();
  //   expect(getTotalSuiteCountSpy).toHaveBeenCalled();
  //   expect(checkToShowEligibleSpy).toHaveBeenCalled();
  //   });

  it("should call checkSecurityPresent", () => {
    // component.programEligibilityData.proposal = mockData.data.proposal;
    // component.programEligibilityData.enrollments = mockData.data.enrollments;
    component.programEligibilityData = mockData.data;
    component.checkSecurityPresent();
    expect(component.isOnlySecurityPresent).toBeFalsy();
  });

  it("should call calcuclatePercentage", () => {
    component.programEligibilityData = mockData.data;
    component.calcuclatePercentage();
    expect(component.primaryEnrollmentsPresent).toBeTruthy();
    expect(component.totalFcCount).toBeTruthy();
    expect(component.pcPrimaryEnrollments).toBeTruthy();
  });

  it("should call getTotalSuiteCount", () => {
    component.programEligibilityData = mockData.data;
    component.getTotalSuiteCount();
    expect(component.percentage).toBeTruthy();
  });

  it("should call checkToShowEligible", () => {
    component.percentage = 100;
    component.isOnlySecurityPresent = false;
    component.pcPrimaryEnrollments = [];
    component.checkToShowEligible();
    expect(component.showEligibleMsg).toBeTruthy();
  });

  it("should call showWarnStatus", () => {
    const enrollment = mockData.data.enrollments[1];
    const warn = component.showWarnStatus(enrollment);
    expect(warn).toBeFalsy();
  });

  it("should call setDangerStatus", () => {
    const enrollment = mockData.data.enrollments[1];
    const dangerSpy = component.setDangerStatus(enrollment);
    expect(dangerSpy).toBeFalsy();
  });

  it("should call setDangerStatus", () => {
    const enrollment = mockData.data.enrollments[1];
    const dangerSpy = component.setDangerStatus(enrollment);
    expect(dangerSpy).toBeFalsy();
  });

  it("should call setEnrollmentNamesString", () => {
    const enrollment = mockData.data.enrollments[1];
    const name = component.setEnrollmentNamesString([enrollment.name]);
    expect(name).toBeTruthy();
  });

  it("close()", () => {
    // const close = jest.spyOn(component, 'close');
    expect(component.close()).toBeUndefined();
  });
  it("continue()", () => {
    // const close = jest.spyOn(component, 'close');
    expect(component.continue()).toBeUndefined();
  });
  it("setDangerStatus()", () => {
    let enrollment = { primary: true };
    component.isOnlySecurityPresent = false;
    // const close = jest.spyOn(component, 'close');
    expect(component.setDangerStatus(enrollment)).toBeTruthy();
  });
  it("checkSecurityPresent()", () => {
    // const close = jest.spyOn(component, 'close');
    component.checkSecurityPresent();
    let data = {
      enrollments: [
        {
          id: 3,
          primary: false,
        },
      ],
    };
    component.programEligibilityData = data;
    component.checkSecurityPresent();
    expect(component.isOnlySecurityPresent).toBeTruthy();
  });
});
