import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ChangeDealIdComponent } from 'vnext/modals/change-deal-id/change-deal-id.component';
import { CloneProposalComponent } from 'vnext/modals/clone-proposal/clone-proposal.component';
import { ReviewAcceptComponent } from 'vnext/modals/review-accept/review-accept.component';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from '../project-rest.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';

import { NextBestActionComponent } from './next-best-action.component';
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

describe('NextBestActionComponent', () => {
  let component: NextBestActionComponent;
  let fixture: ComponentFixture<NextBestActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NextBestActionComponent,LocalizationPipe ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [ProjectService, VnextStoreService, 
        ProjectStoreService, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, DataIdConstantsService,
        {provide: EaRestService, useClass: MockEaRestService}, ElementIdConstantsService,ProposalStoreService ],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextBestActionComponent);
    component = fixture.componentInstance;
    component.projectStoreService.projectData = projectData.data
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('if partner deal is true', () => {
    component.projectStoreService.projectData.dealInfo.partnerDeal = true
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('if changeSubscriptionDeal is true', () => {
    component.projectStoreService.projectData.changeSubscriptionDeal = true
    component.eaStoreService.userInfo = {accessLevel: 3}
    component.projectStoreService.projectData.dealInfo.directRTM = true 
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('should call createProposal', () => {
    component.createProposal();
    expect(component.vnextService.hideProposalDetail).toBeTruthy();
  });
  it('should call createProposal 1', () => {
    component.projectStoreService.projectData.dealInfo.subscriptionUpgradeDeal = false
    component.createProposal();
    expect(component.vnextService.isRoadmapShown).toBeTruthy();
  });
  it('should call createProposal 2', () => {
    component.projectStoreService.projectEditAccess = false
    const returnValue = component.createProposal();
    expect(component.vnextService.isRoadmapShown).toBe(false);
  });
  it('should call changeDealId', () => {
    component.projectStoreService.projectEditAccess = false
    const returnValue = component.changeDealId();
    expect(component.vnextService.isRoadmapShown).toBe(false);
  });
  it('should call showNextActions', () => {
    component.projectStoreService.projectEditAccess = false
    const returnValue = component.showNextActions({});
    expect(component.vnextService.isRoadmapShown).toBe(false);
  });

  it('should call showNextActions 1', () => {
    const modalService = TestBed.get(NgbModal);
  
    const modalRef = modalService.open(ReviewAcceptComponent);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.showNextActions({});
    expect(open).toHaveBeenCalled()
  });
  // it('should call changeDealId 1', () => {
  //   const modalService = TestBed.get(NgbModal);
  
  //   const modalRef = modalService.open(ChangeDealIdComponent);
  //   modalRef.result =  new Promise((resolve) => resolve({continue: true
  //   }));

  //   const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
  //   component.changeDealId();
  //   expect(open).toHaveBeenCalled()
  // });

});
