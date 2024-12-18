
import {  CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';

import { of, Subject } from 'rxjs';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';

import { ProposalSummaryComponent } from './proposal-summary.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const propsoalDataResponseMock = {"rid":"EAMP1656596389000","user":"prguntur","error":false,"data":{"objId":"6262b97b84b4cf6f4ffaecf9","id":20009453,"projectObjId":"614c9231e5c642705a44e295","projectId":2000013,"name":"Test Prop 4/22","billingTerm":{"rsd":"20220705","billingModel":"Prepaid","term":36,"eaEndDateStr":"20250704","eaEndDate":1751612400000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beId":586064,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792,"countryCode":"US"},"customer":{"accountName":"THE WALT DISNEY STUDIOS","customerGuId":"213433","customerGuName":"THE WALT DISNEY COMPANY","preferredLegalName":"THE WALT DISNEY STUDIOS","preferredLegalAddress":{"addressLine1":"500 SOUTH BUENA VISTA STREET","city":"BURBANK","state":"CA","zip":"91521","country":"US"},"customerReps":[{"id":0,"title":"Dev","firstName":"Pradeep","lastName":"G","name":"Pradeep G","email":"prguntur@cisco.com"}],"federalCustomer":false,"countryCode":"US","duoCustomerType":{"federalCustomer":true,"legacyCustomer":true,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":true},"dealInfo":{"id":"52547273","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"235436613","partnerDeal":true,"distiDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":false,"status":"PENDING_APPROVAL","initiatedBy":{"type":"CISCO","ciscoInitiated":true,"distiInitiated":false},"audit":{"createdBy":"prguntur","createdAt":1650637179962,"updatedBy":"prguntur","updatedAt":1656596366661},"priceInfo":{"extendedList":406648.8,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":154841.76,"totalNetBeforeCredit":231940.8,"totalNetAfterIBCredit":154841.76,"unitListMRC":0,"unitNetMRC":0},"message":{"hasError":false,"messages":[{"code":"EA124","text":"Meraki - Network Infrastructure ATO Commit Override Requested","severity":"WARN","createdAt":1656595348202,"createdBy":"prguntur","type":"EXCEPTION","key":"EA124"}]},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":154841.76},"loccDetail":{"loccSigned":true,"loccInitiated":true,"loccOptional":false,"loccNotRequired":false,"loccExpiredDate":"25-Aug-2022","deferred":false,"customerContact":{"id":"0","preferredLegalName":"DISNEY ENTERPRISES, INC.","repName":"RS Singh","repFirstName":"RS","repLastName":"Singh","repTitle":"Dev","repEmail":"rishiksi@cisco.com","preferredLegalAddress":{"city":"KISSIMMEE","state":"FL","zip":"34747","country":"US"}}},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":1429,"masterAgreementId":"EA2584","returningCustomer":false},"permissions":{"featureAccess":[{"name":"proposal.create","description":"Proposal Create","disabled":false,"defaulted":true},{"name":"proposal.view","description":"Proposal View","disabled":false,"defaulted":true},{"name":"project.manage_team","description":"Project Manage Team","disabled":false,"defaulted":false},{"name":"proposal.duplicate","description":"Proposal Duplicate","disabled":false,"defaulted":false},{"name":"proposal.request.documents","description":"Permission to access price Estimate Request Documents","disabled":false,"defaulted":false},{"name":"proposal.edit_name","description":"Proposal Edit Name","disabled":false,"defaulted":false},{"name":"proposal.delete","description":"Proposal Delete","disabled":false,"defaulted":true},{"name":"proposal.edit","description":"Proposal Edit","disabled":false,"defaulted":true}]},"exception":{"pendingApproval":true,"allowSubmission":false,"allowWithdrawl":false},"projectStatus":"COMPLETE","subscriptionInfo":{"existingCustomer":false},"statusDesc":"Pending Approval","allowCompletion":true,"summaryViewAllowed":true},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656596391451};

const enrollmentResponseMock = {
  "rid": "EAMP1656596392790",
  "user": "prguntur",
  "error": false,
  "data": {
    "proposal": {
      "objId": "6262b97b84b4cf6f4ffaecf9",
      "id": 20009453,
      "projectObjId": "614c9231e5c642705a44e295",
      "projectId": 2000013,
      "name": "Test Prop 4/22",
      "billingTerm": {
        "rsd": "20220705",
        "billingModel": "Prepaid",
        "term": 36,
        "eaEndDateStr": "20250704",
        "eaEndDate": 1751612400000
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
        "accountName": "THE WALT DISNEY STUDIOS",
        "customerGuId": "213433",
        "customerGuName": "THE WALT DISNEY COMPANY",
        "preferredLegalName": "THE WALT DISNEY STUDIOS",
        "preferredLegalAddress": {
          "addressLine1": "500 SOUTH BUENA VISTA STREET",
          "city": "BURBANK",
          "state": "CA",
          "zip": "91521",
          "country": "US"
        },
        "customerReps": [
          {
            "id": 0,
            "title": "Dev",
            "firstName": "Pradeep",
            "lastName": "G",
            "name": "Pradeep G",
            "email": "prguntur@cisco.com"
          }
        ],
        "federalCustomer": false,
        "countryCode": "US",
        "duoCustomerType": {
          "federalCustomer": true,
          "legacyCustomer": true,
          "subscriptionLines": false,
          "hwTokenLines": false
        },
        "legacyCustomer": true
      },
      "dealInfo": {
        "id": "52547273",
        "statusDesc": "Qualified",
        "optyOwner": "mariar",
        "buyMethodDisti": false,
        "type": "PARTNER",
        "dealScope": 3,
        "dealSource": 0,
        "dealType": 3,
        "crPartyId": "235436613",
        "partnerDeal": true,
        "distiDeal": false
      },
      "buyingProgram": "BUYING_PGRM_3",
      "locked": false,
      "status": "PENDING_APPROVAL",
      "initiatedBy": {
        "type": "CISCO",
        "ciscoInitiated": true,
        "distiInitiated": false
      },
      "audit": {
        "createdBy": "prguntur",
        "createdAt": 1650637179962,
        "updatedBy": "prguntur",
        "updatedAt": 1656596366661
      },
      "priceInfo": {
        "extendedList": 406648.8,
        "unitNet": 0,
        "originalExtendedList": 0,
        "originalUnitList": 0,
        "totalNet": 154841.76,
        "totalNetBeforeCredit": 231940.8,
        "totalNetAfterIBCredit": 0,
        "unitListMRC": 0,
        "unitNetMRC": 0,
        "proposalPurchaseAdjustment": 77099.04
      },
      "message": {
        "hasError": false,
        "messages": [
          {
            "code": "EA124",
            "text": "Meraki - Network Infrastructure ATO Commit Override Requested",
            "severity": "WARN",
            "createdAt": 1656595348202,
            "createdBy": "prguntur",
            "type": "EXCEPTION",
            "key": "EA124"
          }
        ]
      },
      "commitInfo": {
        "committed": true,
        "threshold": 100000,
        "fullCommitTcv": 154841.76
      },
      "forceAllowCompletion": false,
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
        "scopeId": 1429,
        "masterAgreementId": "EA2584",
        "returningCustomer": false
      },
      "exception": {
        "pendingApproval": true,
        "allowSubmission": false,
        "allowWithdrawl": false
      },
      "subscriptionInfo": {
        "existingCustomer": false
      },
      "statusDesc": "Pending Approval",
      "allowCompletion": true,
      "summaryViewAllowed": true
    },
    "enrollments": [
      {
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "displaySeq": 1,
        "billingTerm": {
          "rsd": "20220705",
          "billingModel": "Prepaid",
          "billingModelName": "Prepaid Term",
          "term": 36,
          "eaEndDateStr": "20250704",
          "eaEndDate": 1751612400000
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 1,
          "pcSuiteCount": 0,
          "fcTcv": 6825.6
        },
        "pools": [
          {
            "name": "Networking",
            "desc": "Meraki",
            "displaySeq": 3,
            "display": true,
            "suites": [
              {
                "name": "Meraki - Network Infrastructure",
                "desc": "Meraki - Network Infrastructure",
                "ato": "E3-N-MRNI",
                "inclusion": true,
                "autoSelected": true,
                "displaySeq": 1,
                "discount": {
                  "subsDisc": 43.11,
                  "servDisc": 43.13,
                  "multiProgramDesc": {
                    "msd": 0,
                    "mpd": 0,
                    "med": 0,
                    "bundleDiscount": 0
                  }
                },
                "billingTerm": {
                  "rsd": "20220705",
                  "billingModel": "Prepaid",
                  "term": 36,
                  "eaEndDateStr": "20250704",
                  "eaEndDate": 1751612400000
                },
                "commitInfo": {
                  "committed": true,
                  "fcSuiteCount": 0,
                  "pcSuiteCount": 0,
                  "overrideRequested": true,
                  "overrideReason": "Requesting to change Suite Commit for a given Meraki - Network Infrastructure selected",
                  "overrideState": "REQUESTED",
                  "overrideEligible": true,
                  "overrideAllowed": true,
                  "threshold": 50000,
                  "ibQtyThreshold": {
                    "achieved": 20,
                    "required": 0
                  },
                  "priceThreshold": {
                    "achieved": 6825.6,
                    "required": 50000
                  }
                },
                "groups": [
                  {
                    "id": 3,
                    "name": "MR",
                    "displaySeq": 1
                  },
                  {
                    "id": 4,
                    "name": "MS100s",
                    "displaySeq": 2
                  },
                  {
                    "id": 5,
                    "name": "MS200s",
                    "displaySeq": 3
                  },
                  {
                    "id": 6,
                    "name": "MS300s",
                    "displaySeq": 4
                  },
                  {
                    "id": 7,
                    "name": "MS400s",
                    "displaySeq": 5
                  },
                  {
                    "id": 11,
                    "name": "MX - Small Branch",
                    "displaySeq": 6
                  },
                  {
                    "id": 9,
                    "name": "MX - Medium Branch",
                    "displaySeq": 7
                  },
                  {
                    "id": 10,
                    "name": "MX - Large Branch",
                    "displaySeq": 8
                  },
                  {
                    "id": 13,
                    "name": "Z Series",
                    "displaySeq": 9
                  },
                  {
                    "id": 2,
                    "name": "MI",
                    "displaySeq": 10
                  },
                  {
                    "id": 12,
                    "name": "VMX",
                    "displaySeq": 11
                  },
                  {
                    "id": 1,
                    "name": "MG",
                    "displaySeq": 12
                  },
                  {
                    "id": 8,
                    "name": "MT",
                    "displaySeq": 13
                  }
                ],
                "displayGroup": true,
                "lines": [
                  {
                    "id": "NTWK-MRK-MS120-24",
                    "desc": "Meraki MS120-24 Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS350-48LP",
                    "desc": "Meraki MS350-48LP Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX60W-ENT",
                    "desc": "Meraki MX60W ENT Enterprise Agreement",
                    "displaySeq": 36,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS225-48",
                    "desc": "Meraki MS225-48 Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX64W-SDW",
                    "desc": "Meraki MX64W SDW Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX65W-SEC",
                    "desc": "Meraki MX65W SEC Enterprise Agreement",
                    "displaySeq": 11,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS250-48LP",
                    "desc": "Meraki MS250-48LP Enterprise Agreement",
                    "displaySeq": 13,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX84-SEC",
                    "desc": "Meraki MX84 SEC Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX64W-SEC",
                    "desc": "Meraki MX64W SEC Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX65W-SDW",
                    "desc": "Meraki MX65W SDW Enterprise Agreement",
                    "displaySeq": 12,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-Z3C-ENT",
                    "desc": "Meraki Z3C Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 13
                  },
                  {
                    "id": "NTWK-MRK-MS220-48LP",
                    "desc": "Meraki MS220-48LP Enterprise Agreement",
                    "displaySeq": 20,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS120-48LP",
                    "desc": "Meraki MS120-48LP Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS320-48LP",
                    "desc": "Meraki MS320-48LP Enterprise Agreement",
                    "displaySeq": 15,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX68-SEC",
                    "desc": "Meraki MX68 SEC Enterprise Agreement",
                    "displaySeq": 23,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX105-ENT",
                    "desc": "Meraki MX105 ENT Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX64-SDW",
                    "desc": "Meraki MX64 SDW Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX68-SDW",
                    "desc": "Meraki MX68 SDW Enterprise Agreement",
                    "displaySeq": 24,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS125-48",
                    "desc": "Meraki MS125-48 Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MT",
                    "desc": "Meraki MT Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 8
                  },
                  {
                    "id": "NTWK-MRK-MS220-24",
                    "desc": "Meraki MS220-24 Enterprise Agreement",
                    "displaySeq": 21,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX90-SEC",
                    "desc": "Meraki MX90 SEC Enterprise Agreement",
                    "displaySeq": 16,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX67-ENT",
                    "desc": "Meraki MX67 ENT Enterprise Agreement",
                    "displaySeq": 13,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX67C-SEC",
                    "desc": "Meraki MX67C SEC Enterprise Agreement",
                    "displaySeq": 17,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS410-16",
                    "desc": "Meraki MS410-16 Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MS120-8FP",
                    "desc": "Meraki MS120-8FP Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX250-SEC",
                    "desc": "Meraki MX250 SEC Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX60-ENT",
                    "desc": "Meraki MX60 ENT Enterprise Agreement",
                    "displaySeq": 34,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS355-24X2",
                    "desc": "Meraki MS355-24X2 Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX600-SEC",
                    "desc": "Meraki MX600 SEC Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-Z1-ENT",
                    "desc": "Meraki Z1 Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 13
                  },
                  {
                    "id": "NTWK-MRK-MX85-ENT",
                    "desc": "Meraki MX85 ENT Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX250-SDW",
                    "desc": "Meraki MX250 SDW Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MS225-48FP",
                    "desc": "Meraki MS225-48FP Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS420-48",
                    "desc": "Meraki MS420-48 Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MS22P",
                    "desc": "Meraki MS22P Enterprise Agreement",
                    "displaySeq": 14,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS225-24",
                    "desc": "Meraki MS225-24 Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS250-24",
                    "desc": "Meraki MS250-24 Enterprise Agreement",
                    "displaySeq": 14,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS220-8P",
                    "desc": "Meraki MS220-8P Enterprise Agreement",
                    "displaySeq": 17,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-Z3-ENT",
                    "desc": "Meraki Z3 Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 13
                  },
                  {
                    "id": "NTWK-MRK-MX64-ENT",
                    "desc": "Meraki MX64 ENT Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS210-48",
                    "desc": "Meraki MS210-48 Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS350-48FP",
                    "desc": "Meraki MS350-48FP Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MR-ENT",
                    "desc": "Meraki MR Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 3
                  },
                  {
                    "id": "NTWK-MRK-MX95-SDW",
                    "desc": "Meraki MX95 SDW Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS250-48FP",
                    "desc": "Meraki MS250-48FP Enterprise Agreement",
                    "displaySeq": 12,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MI-S",
                    "desc": "Meraki MI-S Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 2
                  },
                  {
                    "id": "NTWK-MRK-MS320-24P",
                    "desc": "Meraki MS320-24P Enterprise Agreement",
                    "displaySeq": 17,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX80-SEC",
                    "desc": "Meraki MX80 SEC Enterprise Agreement",
                    "displaySeq": 14,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX68CW-SEC",
                    "desc": "Meraki MX68CW SEC Enterprise Agreement",
                    "displaySeq": 26,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MI-L",
                    "desc": "Meraki MI-L Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 2
                  },
                  {
                    "id": "NTWK-MRK-MS125-24",
                    "desc": "Meraki MS125-24 Enterprise Agreement",
                    "displaySeq": 12,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX250-ENT",
                    "desc": "Meraki MX250 ENT Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX100-ENT",
                    "desc": "Meraki MX100 ENT Enterprise Agreement",
                    "displaySeq": 17,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MI-M",
                    "desc": "Meraki MI-M Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 2
                  },
                  {
                    "id": "NTWK-MRK-MX67C-SDW",
                    "desc": "Meraki MX67C SDW Enterprise Agreement",
                    "displaySeq": 18,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS120-48FP",
                    "desc": "Meraki MS120-48FP Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX68CW-SDW",
                    "desc": "Meraki MX68CW SDW Enterprise Agreement",
                    "displaySeq": 27,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-VMX-S",
                    "desc": "Meraki VMX S Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 12
                  },
                  {
                    "id": "NTWK-MRK-MX75-ENT",
                    "desc": "Meraki MX75 ENT Enterprise Agreement",
                    "displaySeq": 31,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS390-48A",
                    "desc": "Meraki MS390-48 ADV Enterprise Agreement",
                    "displaySeq": 11,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX67W-ENT",
                    "desc": "Meraki MX67W ENT Enterprise Agreement",
                    "displaySeq": 19,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX60W-SEC",
                    "desc": "Meraki MX60W SEC Enterprise Agreement",
                    "displaySeq": 37,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-VMX-M",
                    "desc": "Meraki VMX M Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 12
                  },
                  {
                    "id": "NTWK-MRK-MS320-48",
                    "desc": "Meraki MS320-48 Enterprise Agreement",
                    "displaySeq": 13,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-VMX-L",
                    "desc": "Meraki VMX L Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 12
                  },
                  {
                    "id": "NTWK-MRK-MS22",
                    "desc": "Meraki MS22 Enterprise Agreement",
                    "displaySeq": 15,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS390-24A",
                    "desc": "Meraki MS390-24 ADV Enterprise Agreement",
                    "displaySeq": 12,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS120-8",
                    "desc": "Meraki MS120-8 Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX400-SEC",
                    "desc": "Meraki MX400 SEC Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX67-SDW",
                    "desc": "Meraki MX67 SDW Enterprise Agreement",
                    "displaySeq": 15,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX84-SDW",
                    "desc": "Meraki MX84 SDW Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX95-SEC",
                    "desc": "Meraki MX95 SEC Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS425-32",
                    "desc": "Meraki MS425-32 Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MS225-48LP",
                    "desc": "Meraki MS225-48LP Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX64W-ENT",
                    "desc": "Meraki MX64W ENT Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX65-SEC",
                    "desc": "Meraki MX65 SEC Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS420-24",
                    "desc": "Meraki MS420-24 Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MX600-ENT",
                    "desc": "Meraki MX600 ENT Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX75-SEC",
                    "desc": "Meraki MX75 SEC Enterprise Agreement",
                    "displaySeq": 32,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS250-48",
                    "desc": "Meraki MS250-48 Enterprise Agreement",
                    "displaySeq": 11,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX67-SEC",
                    "desc": "Meraki MX67 SEC Enterprise Agreement",
                    "displaySeq": 14,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MG41-ENT",
                    "desc": "Meraki MG41 ENT Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 1
                  },
                  {
                    "id": "NTWK-MRK-MS120-8LP",
                    "desc": "Meraki MS120-8LP Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS220-24P",
                    "desc": "Meraki MS220-24P Enterprise Agreement",
                    "displaySeq": 22,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX65-SDW",
                    "desc": "Meraki MX65 SDW Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX84-ENT",
                    "desc": "Meraki MX84 ENT Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS42",
                    "desc": "Meraki MS42 Enterprise Agreement",
                    "displaySeq": 17,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS350-48",
                    "desc": "Meraki MS350-48 Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS210-24P",
                    "desc": "Meraki MS210-24P Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX85-SEC",
                    "desc": "Meraki MX85 SEC Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX105-SEC",
                    "desc": "Meraki MX105 SEC Enterprise Agreement",
                    "displaySeq": 11,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX450-ENT",
                    "desc": "Meraki MX450 ENT Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MI-XL",
                    "desc": "Meraki MI-XL Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 2
                  },
                  {
                    "id": "NTWK-MRK-MS350-24X",
                    "desc": "Meraki MS350-24X Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX65W-ENT",
                    "desc": "Meraki MX65W ENT Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS125-24P",
                    "desc": "Meraki MS125-24P Enterprise Agreement",
                    "displaySeq": 13,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS210-48LP",
                    "desc": "Meraki MS210-48LP Enterprise Agreement",
                    "displaySeq": 3,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX60-SEC",
                    "desc": "Meraki MX60 SEC Enterprise Agreement",
                    "displaySeq": 35,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS350-24P",
                    "desc": "Meraki MS350-24P Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX90-ENT",
                    "desc": "Meraki MX90 ENT Enterprise Agreement",
                    "displaySeq": 15,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MR-ADV",
                    "desc": "Meraki MR ADV Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 3,
                    "qty": 20,
                    "priceInfo": {
                      "extendedList": 12002.4,
                      "unitNet": 9.48,
                      "totalNet": 6825.6,
                      "totalNetBeforeCredit": 6825.6,
                      "totalSwNet": 6825.6,
                      "totalSwNetBeforeCredit": 6825.6
                    },
                    "ncPriceInfo": {
                      "extendedList": 12002.4,
                      "unitNet": 9.48,
                      "totalNet": 6825.6,
                      "totalNetBeforeCredit": 6825.6
                    },
                    "credit": {}
                  },
                  {
                    "id": "NTWK-MRK-MX68W-ENT",
                    "desc": "Meraki MX68W ENT Enterprise Agreement",
                    "displaySeq": 28,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX68CW-ENT",
                    "desc": "Meraki MX68CW ENT Enterprise Agreement",
                    "displaySeq": 25,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS210-24",
                    "desc": "Meraki MS210-24 Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX67C-ENT",
                    "desc": "Meraki MX67C ENT Enterprise Agreement",
                    "displaySeq": 16,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS125-48LP",
                    "desc": "Meraki MS125-48LP Enterprise Agreement",
                    "displaySeq": 11,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS425-16",
                    "desc": "Meraki MS425-16 Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MX68-ENT",
                    "desc": "Meraki MX68 ENT Enterprise Agreement",
                    "displaySeq": 22,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX75-SDW",
                    "desc": "Meraki MX75 SDW Enterprise Agreement",
                    "displaySeq": 33,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX105-SDW",
                    "desc": "Meraki MX105 SDW Enterprise Agreement",
                    "displaySeq": 12,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MI-XS",
                    "desc": "Meraki MI-XS Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 2
                  },
                  {
                    "id": "NTWK-MRK-MS42P",
                    "desc": "Meraki MS42P Enterprise Agreement",
                    "displaySeq": 16,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MS120-48",
                    "desc": "Meraki MS120-48 Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX450-SEC",
                    "desc": "Meraki MX450 SEC Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX450-SDW",
                    "desc": "Meraki MX450 SDW Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX68W-SEC",
                    "desc": "Meraki MX68W SEC Enterprise Agreement",
                    "displaySeq": 29,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MG21-ENT",
                    "desc": "Meraki MG21 Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 1
                  },
                  {
                    "id": "NTWK-MRK-MX67W-SDW",
                    "desc": "Meraki MX67W SDW Enterprise Agreement",
                    "displaySeq": 21,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX80-ENT",
                    "desc": "Meraki MX80 ENT Enterprise Agreement",
                    "displaySeq": 13,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MX400-ENT",
                    "desc": "Meraki MX400 ENT Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 10
                  },
                  {
                    "id": "NTWK-MRK-MX65-ENT",
                    "desc": "Meraki MX65 ENT Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MX67W-SEC",
                    "desc": "Meraki MX67W SEC Enterprise Agreement",
                    "displaySeq": 20,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS350-24",
                    "desc": "Meraki MS350-24 Enterprise Agreement",
                    "displaySeq": 4,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS320-24",
                    "desc": "Meraki MS320-24 Enterprise Agreement",
                    "displaySeq": 16,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX68W-SDW",
                    "desc": "Meraki MX68W SDW Enterprise Agreement",
                    "displaySeq": 30,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS250-24P",
                    "desc": "Meraki MS250-24P Enterprise Agreement",
                    "displaySeq": 15,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS220-48",
                    "desc": "Meraki MS220-48 Enterprise Agreement",
                    "displaySeq": 18,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS320-48FP",
                    "desc": "Meraki MS320-48FP Enterprise Agreement",
                    "displaySeq": 14,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS355-24X",
                    "desc": "Meraki MS355-24X Enterprise Agreement",
                    "displaySeq": 9,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS220-48FP",
                    "desc": "Meraki MS220-48FP Enterprise Agreement",
                    "displaySeq": 19,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS355-48X",
                    "desc": "Meraki MS355-48X Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MX100-SEC",
                    "desc": "Meraki MX100 SEC Enterprise Agreement",
                    "displaySeq": 18,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS210-48FP",
                    "desc": "Meraki MS210-48FP Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS220-8",
                    "desc": "Meraki MS220-8 Enterprise Agreement",
                    "displaySeq": 16,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MX64-SEC",
                    "desc": "Meraki MX64 SEC Enterprise Agreement",
                    "displaySeq": 2,
                    "groupId": 11
                  },
                  {
                    "id": "NTWK-MRK-MS120-24P",
                    "desc": "Meraki MS120-24P Enterprise Agreement",
                    "displaySeq": 5,
                    "groupId": 4
                  },
                  {
                    "id": "NTWK-MRK-MX85-SDW",
                    "desc": "Meraki MX85 SDW Enterprise Agreement",
                    "displaySeq": 6,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS410-32",
                    "desc": "Meraki MS410-32 Enterprise Agreement",
                    "displaySeq": 1,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MX95-ENT",
                    "desc": "Meraki MX95 ENT Enterprise Agreement",
                    "displaySeq": 7,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS355-48X2",
                    "desc": "Meraki MS355-48X2 Enterprise Agreement",
                    "displaySeq": 8,
                    "groupId": 6
                  },
                  {
                    "id": "NTWK-MRK-MS450-12",
                    "desc": "Meraki MS450-12 Enterprise Agreement,",
                    "displaySeq": 5,
                    "groupId": 7
                  },
                  {
                    "id": "NTWK-MRK-MX100-SDW",
                    "desc": "Meraki MX100 SDW Enterprise Agreement",
                    "displaySeq": 19,
                    "groupId": 9
                  },
                  {
                    "id": "NTWK-MRK-MS225-24P",
                    "desc": "Meraki MS225-24P Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 5
                  },
                  {
                    "id": "NTWK-MRK-MS125-48FP",
                    "desc": "Meraki MS125-48FP Enterprise Agreement",
                    "displaySeq": 10,
                    "groupId": 4
                  }
                ],
                "ibDtls": [
                  {
                    "lineId": "NTWK-MRK-MR-ADV",
                    "pidName": "E3N-MR-ADV",
                    "qty": 0
                  }
                ],
                "priceInfo": {
                  "extendedList": 12002.4,
                  "unitNet": 0,
                  "totalNet": 6825.6,
                  "totalNetBeforeCredit": 6825.6,
                  "totalSwNet": 6825.6,
                  "totalSwNetBeforeCredit": 6825.6
                },
                "ncPriceInfo": {
                  "extendedList": 12002.4,
                  "unitNet": 0,
                  "totalNet": 6825.6,
                  "totalNetBeforeCredit": 6825.6
                },
                "disabled": false,
                "active": true,
                "cxOptIn": false,
                "migration": false
              }
            ]
          }
        ],
        "priceInfo": {
          "extendedList": 12002.4,
          "unitNet": 0,
          "totalNet": 6825.6,
          "totalNetBeforeCredit": 6825.6,
          "totalSwNet": 6825.6,
          "totalSwNetBeforeCredit": 6825.6
        },
        "ncPriceInfo": {
          "extendedList": 12002.4,
          "unitNet": 0,
          "totalNet": 6825.6,
          "totalNetBeforeCredit": 6825.6
        },
        "disabled": false,
        "active": true,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": false,
        "service": false,
        "disableRsdAndTermUpdate": false
      }
    ]
  },
  "buildVersion": "NOV 11-14-2021 09:53 EST RELEASE",
  "currentDate": 1656596393188
}

const projectResponseMock = {"rid":"EAMP1656596393085","user":"prguntur","error":false,"data":{"objId":"614c9231e5c642705a44e295","id":2000013,"name":"Test Deal PG 09/23","customerInfo":{"accountName":"THE WALT DISNEY STUDIOS","customerGuId":"213433","customerGuName":"THE WALT DISNEY COMPANY","preferredLegalName":"THE WALT DISNEY STUDIOS","preferredLegalAddress":{"addressLine1":"500 SOUTH BUENA VISTA STREET","city":"BURBANK","state":"CA","zip":"91521","country":"US"},"customerReps":[{"id":0,"title":"Dev","firstName":"Pradeep","lastName":"G","name":"Pradeep G","email":"prguntur@cisco.com"}],"federalCustomer":false,"countryCode":"US","duoCustomerType":{"federalCustomer":true,"legacyCustomer":true,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":true},"dealInfo":{"id":"52547273","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"235436613","partnerDeal":true,"distiDeal":false},"partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc."},"status":"COMPLETE","locked":false,"partnerTeam":{"partnerContacts":[{"firstName":"Maria","lastName":"Roark","name":"Maria Roark","email":"maria.roark@aos5.com","userId":"mariar","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"src":"AUTO","ccoId":"mariar"},{"firstName":"Robert","lastName":"Harpst","name":"Robert Harpst","userId":"robertharpst4187","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"robertharpst4187"},{"firstName":"AOS","lastName":"PURCHASING","name":"AOS PURCHASING","userId":"aospurchasing","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"aospurchasing"},{"firstName":"Glenda","lastName":"Broughton","name":"Glenda Broughton","email":"Glenda.Broughton@aos5.com","userId":"broughton8","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"broughton8"},{"firstName":"Debra","lastName":"Kennedy","name":"Debra Kennedy","userId":"debrak1209","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"debrak1209"},{"firstName":"Gwen","lastName":"Adelmann","name":"Gwen Adelmann","userId":"gadelmann","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"gadelmann"},{"firstName":"Nicole","lastName":"Radke","name":"Nicole Radke","email":"nicole.radke@aos5.com","userId":"nicole.radke@aos5.com","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"nicole.radke@aos5.com"},{"firstName":"Carla","lastName":"Bono","name":"Carla Bono","userId":"carla.bono","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"carla.bono"}]},"ciscoTeam":{"contacts":[{"firstName":"Corey","lastName":"Freeze","name":"Corey Freeze","email":"cfreeze@cisco.com","userId":"cfreeze","role":"CAM","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"beGeoId":639324,"src":"AUTO","ccoId":"cfreeze"},{"firstName":"Pradeep","lastName":"Guntur","name":"Pradeep Guntur","email":"prguntur@cisco.com","userId":"prguntur","role":"Other","notification":true,"webexNotification":false,"notifyByWelcomeKit":false,"src":"AUTO","ccoId":"prguntur"}]},"deleted":false,"audit":{"createdBy":"prguntur","createdAt":1632408112952,"updatedBy":"prguntur","updatedAt":1650637153247},"loccDetail":{"loccSigned":true,"loccInitiated":true,"loccOptional":false,"loccNotRequired":false,"loccExpiredDate":"25-Aug-2022","deferred":false,"customerContact":{"id":"0","preferredLegalName":"DISNEY ENTERPRISES, INC.","repName":"RS Singh","repFirstName":"RS","repLastName":"Singh","repTitle":"Dev","repEmail":"rishiksi@cisco.com","preferredLegalAddress":{"city":"KISSIMMEE","state":"FL","zip":"34747","country":"US"}}},"deferLocc":false,"ordered":false,"initiatedBy":{"type":"CISCO","ciscoInitiated":true,"distiInitiated":false},"transactionDtl":{"cavTransactionId":"EAMP1650637149260"},"smartAccount":{"smrtAccntId":"209099","smrtAccntName":"Disney Motion Picture Production","smrtAccntStatus":"ACTIVE","domain":"disneympp.com","accountType":"CUSTOMER","virtualAccount":{"name":"DEFAULT","id":"200100"}},"scopeInfo":{"scopeId":1429,"masterAgreementId":"EA2584","returningCustomer":false,"orgInfo":{}},"permissions":{"featureAccess":[{"name":"proposal.create","description":"Proposal Create","disabled":false,"defaulted":true},{"name":"project.manage_team","description":"Project Manage Team","disabled":false,"defaulted":false},{"name":"project.create","description":"project.create permission","disabled":false,"defaulted":false},{"name":"project.change_deal_id","description":"Project Change Deal ID","disabled":false,"defaulted":false},{"name":"project.reopen","description":"Project Reopen","disabled":false,"defaulted":false},{"name":"project.view","description":"Project View","disabled":false,"defaulted":false},{"name":"project.edit","description":"Project Edit","disabled":false,"defaulted":false}]}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656596394509};

const exceptionSummaryResponseMock = {"rid":"EAMP1656596395004","user":"prguntur","error":false,"data":{"proposalExceptionActivities":[{"id":"62bb2bd2814011028e97e68e","groupId":"EAMP1656433618370","groupSeq":1,"proposalId":20009453,"seq":3,"exceptionType":"PURCHASE_ADJUSTMENT_REQUEST","exceptionName":"Purchase Adjustment Request","exceptionDescription":"Engage the ops support team to address a pricing/IB discrepancy","status":"PENDING","requestedBy":"prguntur","requestReason":"Issues with Customer Install Base, including missing Orders","requestReasons":["Issues with Customer Install Base, including missing Orders","Reduction to the one-time discount"],"requestComment":"Test","requestedAt":1656596365846,"teamName":"Request PA","deleted":false,"audit":{"createdBy":"prguntur","createdAt":1656433618900,"updatedBy":"prguntur","updatedAt":1656596365846},"cycleTime":29753,"autoApproved":false,"teamMembers":[{"cecId":"aktamhan","name":"Akshay Tamhane","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"anallaba","name":"Amarnath Reddy Nallaballe","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"annagori","name":"Anup Nagori","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"bdasine","name":"Bala Dasine","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"djangity","name":"Deepa Jangity","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"dmurkute","name":"Devyani Murkute","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"dthawari","name":"Devyani Thawari","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"dvedpath","name":"Dinesh Vedpathak","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"gupailwa","name":"Gulamsadik Pailwan","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"jparkern","name":"Jeri Parker-Newman","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"khusingh","name":"Khushboo Singh","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"kwaikar","name":"Kaveri Waikar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"maldhar","name":"Mallika Dhar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"mtijare","name":"Manisha Tijare","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"neenbhat","name":"Neena Bhatt","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pajaisin","name":"Payal Jaisinghani","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pbanerje","name":"Papiya Banerjee","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pranacha","name":"Praneeth Acharya","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pratjha","name":"Pratyush Jha","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ranyadav","name":"Rangoli Yadav","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"riyaverm","name":"Riya Verma","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sangrdas","name":"Sangram Das","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ssamdani","name":"Shraddha Samdani","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"swalzade","name":"Sagar Walzade","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"tayyshai","name":"Tayyab Shaikh","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"trsaxena","name":"Tribhuvan Saxena","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"tsingha","name":"Thangjam Vikash Singha","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ukathar","name":"Umesh Kathar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"davchin","name":"David Chin","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"brtanaka","name":"Brent Tanaka","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"vimerugu","name":"Vijay Kumar Merugu","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"abayas","name":"Akshay Bayas","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"mmarkad","name":"Madhuri Markad","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"nkolan","name":"Nikhila Kolan","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"kputtawa","name":"Kohinoor Puttawar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"dmurkute","name":"Devyani Murkute","primary":true,"regions":["EMEAR","APJC","AMERICAS"]},{"cecId":"anarlawa","name":"Atharva Narlawar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"rbalseka","name":"Raj Balsekar","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"viditsha","name":"Vidit Sharma","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ysatwani","name":"Yogita Satwani","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"rkedia","name":"Rajeev Basantkumar Kedia","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"trzope","name":"Trupti Zope","primary":true,"regions":["AMERICAS"]},{"cecId":"rajkusum","name":"Rajkiran Kusuma","primary":true,"regions":["EMEAR","APJC"]},{"cecId":"ashdas","name":"Ashish Das","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"kritravi","name":"Krithika Ravi","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sakorada","name":"SARATHCHANDRA BOSE KORADA","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pvaydand","name":"Priyanka Vaydande","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sapol","name":"Sarang Pol","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"rishiksi","name":"Rishikesh Singh","primary":true,"regions":["EMEAR","AMERICAS"]},{"cecId":"mguedet","name":"Marc Guedet","primary":false},{"cecId":"pribirla","name":"Priya Birla","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"hpawanka","name":"Harshad Pawankar","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pdengale","name":"Pranali Dengale","primary":false,"regions":["AMERICAS","APJC","EMEAR"]},{"cecId":"bisingha","name":"Thangjam Binoy Kumar Singha","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"prvangan","name":"Priti Vangani","primary":false,"regions":["EMEAR","APJC"]},{"cecId":"suschaud","name":"Sushant Chaudhari","primary":false,"regions":["EMEAR","APJC"]},{"cecId":"srirabal","name":"Sriram Balasubramanian","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"skhante","name":"Sonam Khante","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sailmang","name":"Sailakshmi Mangalapurapu","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"khusingh","name":"Khushboo Singh","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"srirabal","name":"Sriram Balasubramanian","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pvaydand","name":"Priyanka Vaydande","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"kiskunal","name":"Kishore Kunal","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sagramai","name":"Sagarika Ramaiahgari","primary":false,"regions":["AMERICAS","EMEAR","APJC"]}],"allowedToBecomeApprover":false,"notificationSent":false,"caseEmailInitiated":false,"actioned":false,"rejected":false,"approved":false,"additionalApproverAssigned":false,"awatingSubmissionForApproval":false,"awaitingDecision":true,"withdrawn":false,"requested":true,"approverAssigned":false,"decision":"Pending","cycleTimeStr":"0 sec","label":"Purchase Adjustment Request"}],"allowExceptionSubmission":false,"allowExceptionWithdrawl":true},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656596395600};

const approverHistoryRespMock = {"rid":"EAMP1656596397161","user":"prguntur","error":false,"data":{"groupExceptions":[]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656596397822};

class VnextServiceMock {
  isValidResponseWithData(res) {
      return of(true);
  }

  isValidResponseWithoutData(res) {
      return of(true);
  }
 roadmapSubject = new Subject();
 refreshProposalData = new Subject();
}

class EaRestServiceMock {
  getApiCall(url) {
    return of();
  }
  postApiCall(url, req) {
    return of()
}
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

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

const RouterSpy = {'Router': jest.fn().mockReturnValue('navigate')}

describe('ProposalSummaryComponent', () => {
  let component: ProposalSummaryComponent;
  let fixture: ComponentFixture<ProposalSummaryComponent>;
  let proposalRestService = new ProposalRestServiceMock();
  let vnextService = new VnextServiceMock();
  let eaRestService = new EaRestServiceMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule],
      declarations: [ ProposalSummaryComponent,LocalizationPipe ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ NgbActiveModal, UtilitiesService, LocalizationService, CurrencyPipe, ProposalStoreService, { provide: ProposalRestService, useClass: ProposalRestServiceMock }, { provide: VnextService, useClass: VnextServiceMock }, NgbModal, ProposalService,  EaStoreService, VnextStoreService, BlockUiService, ProjectStoreService, {provide: EaRestService, useClass: EaRestServiceMock}, ProjectService, ProjectRestService, DataIdConstantsService, ElementIdConstantsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getproposalsummary', () => {
    const data = enrollmentResponseMock
    const getExceptionsDataSpy = jest.spyOn(component, 'getExceptionsData');
    const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData');
    let restService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(data))
    component.getProposalSummary();
    
    expect(component.proposalSummaryData).toBeTruthy();

  });

  it('should get getDefaultedReasonForPA', () => {
    const  res = {
      data: {
        paReasons: [{id:1}]
      }, 
      error: false
    }
    let restService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(res))
   
    //const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData');
    component.getDefaultedReasonForPA();
    //expect(apiSpy).toHaveBeenCalled();
    //expect(validateSpy).toHaveBeenCalled();
    expect(component.defaultedPaReasons).toBeTruthy();
  });

  it('should check if only PA exception present', () => {
    const exceptionActivities = [{exceptionType: 'PURCHASE_ADJUSTMENT_REQUEST'}];
    component.checkOnlyPaExceptionPresent(exceptionActivities);
    expect(component.isOnlyPaExceptionPresent).toBeTruthy();
    component.isOnlyPaExceptionPresent = false;
  });

  it('should check and show submit for approval button', () => {
    component.displayException = true;
    component.isApproverFlow = false;
    component.allowExceptionSubmission = true;
    let result = component.showSubmitForApproval();
    expect(result).toBeTruthy();

    component.allowExceptionSubmission = false;
    result = component.showSubmitForApproval();
    expect(result).toBeFalsy();
  });

  it('should check and show submit button for proposal submission', () => {
    component.displayException = true;
    component.isApproverFlow = false;
    component.allowExceptionSubmission = false;
    let result = component.showSubmitButton();
    expect(result).toBeTruthy();

    component.allowExceptionSubmission = true;
    result = component.showSubmitForApproval();
    expect(result).toBeTruthy();
  });

  it('should go back to PE page ', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService)
    component.backToPe();
    expect(proposalStoreService.showProposalSummary).toBeFalsy();
    expect(proposalStoreService.showPriceEstimate).toBeTruthy();
    expect(proposalStoreService.isPaApproverComingFromSummary).toBeTruthy();
  })

  it('should set become approver', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService)
    let event = {
      isSelectedPaRequestException: true,
    }
    component.becomeApprover(event);
    expect(component.isSelectedPaRequestException).toBeTruthy();
    expect(proposalStoreService.allowUpdatePA).toBeTruthy();
  })

  it('should set getTCVPostPurchaseAdjustment', () => {
    const obj = {
      priceInfo: {
        totalNet: 154841.76
      }
    }
    const result = component.getTCVPostPurchaseAdjustment(obj);;
    expect(result).toEqual('154,841.76');
  })

  it('should set TCV', () => {
    const obj = {
      priceInfo: {
        "proposalPurchaseAdjustment": 77099.04,
        "purchaseAdjustment": 12345.55
      }
    }
    let result = component.getTCV(obj, true);;
    expect(result).toEqual('-77,099.04');

    result = component.getTCV(obj, false);;
    expect(result).toEqual('-12,345.55');
  })

  it('should set getTCVPrePurchaseAdjustment', () => {
    const obj = {
      priceInfo: {
       "totalNetBeforeCredit":231940.8
      }
    }
    const result = component.getTCVPrePurchaseAdjustment(obj);;
    expect(result).toEqual('231,940.80');
  })

  it('should call updateProposalStatus', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService)
    let restService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(restService, 'putApiCall').mockReturnValue(of(propsoalDataResponseMock))
    component.updateProposalStatus();
    expect(proposalStoreService.proposalData).toBeTruthy();
    expect(proposalStoreService.showProposalDashboard).toBeTruthy();
    expect(proposalStoreService.isReadOnly).toBeTruthy();
  })

  it('should check for pilot partner exception', () => {
    let exception = {
      exceptionType: 'BUYING_PROGRAM_REDIRECTION_EXCEPTION_CHECK'
    }
   component.checkPilotPartneException(exception);
   expect(component.isPilotPartnerExceptionPresent).toBeTruthy();
   component.isPilotPartnerExceptionPresent = false;
  });

  it('should check and set apprver flow', () => {
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService)
    let exception = [
      {
        status: 'New',
        allowedToBecomeApprover: false
      }
    ];
    component.setApprovalFlow(exception);
    expect(component.isApproverFlow).toBeFalsy();

    exception[0].allowedToBecomeApprover = true;
    component.setApprovalFlow(exception);
    expect(component.isApproverFlow).toBeTruthy();
    expect(eaStoreService.isUserApprover).toBeTruthy();
    component.isApproverFlow = false;
  });

  it('should check exception and show messages', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData.exception = propsoalDataResponseMock.data.exception;
    proposalStoreService.proposalData.exception['exceptionActivities'] = exceptionSummaryResponseMock.data.proposalExceptionActivities;
    component.checkExceptionToShowMessages();
    expect(component.isMerakiPaExceptionPresent).toBeFalsy();
    expect(component.delistingCxException).toBeFalsy();

    proposalStoreService.proposalData.exception['exceptionActivities'][0].status = 'NEW';
    proposalStoreService.proposalData.exception['exceptionActivities'][0].exceptionType = 'BU_PM_EXCEPTIONS';
    component.checkExceptionToShowMessages();
    expect(component.isMerakiPaExceptionPresent).toBeFalsy();
    expect(component.delistingCxException).toBeTruthy();
    component.delistingCxException = false;

    proposalStoreService.proposalData.exception['exceptionActivities'][0].status = 'NEW';
    proposalStoreService.proposalData.exception['exceptionActivities'][0].exceptionType = "MERAKI_CAMERA_SYSTEM_PA";
    component.checkExceptionToShowMessages();
    expect(component.isMerakiPaExceptionPresent).toBeTruthy();
    expect(component.delistingCxException).toBeFalsy();
    component.isMerakiPaExceptionPresent = false;

  });

  it('should call and reload exceptions after submit/withdraw', () => {
    // const getproposalsummarySpy = jest.spyOn(component, 'getProposalSummary');
    const validateSpy = jest.spyOn(vnextService, 'isValidResponseWithData');
    let restService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(propsoalDataResponseMock))
    
    const mockEevent: Event = <Event><any>{
      target: {
          value: ''
      }
    };
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    
    let proposalDataMock = propsoalDataResponseMock;
    proposalDataMock.data.status = 'COMPLETE';
  //  const apiSpy = jest.spyOn(proposalRestService, 'getApiCall').mockReturnValue(of(proposalDataMock));
    component.reloadSummaryForExceptions(mockEevent);
   // expect(apiSpy).toHaveBeenCalled();
   
    expect(component.isApproverFlow).toBeFalsy();
    expect(proposalStoreService.proposalData.objId).toBeTruthy();
    expect(proposalStoreService.showProposalSummary).toBeFalsy();
    expect(proposalStoreService.showProposalDashboard).toBeTruthy();
    expect(proposalStoreService.isReadOnly).toBeTruthy();
  });

  it('should set exceptions data ', () => {
    const setApprovalFlowSpy = jest.spyOn(component, 'setApprovalFlow');
    const checkPilotPartneExceptionSpy = jest.spyOn(component, 'checkPilotPartneException');
    const checkExceptionToShowMessagesSpy = jest.spyOn(component, 'checkExceptionToShowMessages');
    const checkOnlyPaExceptionPresentSpy = jest.spyOn(component, 'checkOnlyPaExceptionPresent');
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    proposalStoreService.proposalData.exception = propsoalDataResponseMock.data.exception;
    proposalStoreService.proposalData.exception['exceptionActivities'] = exceptionSummaryResponseMock.data.proposalExceptionActivities;
    // proposalStoreService.proposalData.exception['exceptionActivities'][0].status = 'NEW';

    component.setExceptionsData();
    expect(setApprovalFlowSpy).toHaveBeenCalled();
    expect(checkExceptionToShowMessagesSpy).toHaveBeenCalled();
    expect(checkOnlyPaExceptionPresentSpy).toHaveBeenCalled();
    // expect(component.isExceptionStatusNew).toBeFalsy();


    proposalStoreService.proposalData.exception['exceptionActivities'][0].status = 'NEW';
    component.setExceptionsData();
    expect(checkPilotPartneExceptionSpy).toHaveBeenCalled();
    expect(component.isExceptionStatusNew).toBeTruthy();


    proposalStoreService.proposalData.exception.allowSubmission = false;
    proposalStoreService.proposalData.exception.allowWithdrawl = true;
    component.setExceptionsData();
    expect(proposalStoreService.isReadOnly).toBeTruthy();
  });

  it('should call getExceptionsData', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    component.getExceptionsData({status: 'COMPLETE'});
    expect(proposalStoreService.showProposalSummary).toBeFalsy();
    expect(proposalStoreService.showProposalDashboard).toBeTruthy();
    expect(proposalStoreService.isReadOnly).toBeTruthy();
  });

  it('should call submitExceptionForApproval', fakeAsync(() => {
   let restService = fixture.debugElement.injector.get(ProposalRestService);
   jest.spyOn(restService, 'postApiCall').mockReturnValue(of(exceptionSummaryResponseMock))
    const getproposalsummarySpy = jest.spyOn(component, 'getProposalSummary');
    component.submitExceptionForApproval({status: 'COMPLETE'});
    tick(3000);
    expect(component.proposalStoreService.isReadOnly).toBeTruthy();
    flush();
  }));

});