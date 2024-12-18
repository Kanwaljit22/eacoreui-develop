
import {  CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';

import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ServicesSuitesCellComponent } from '../../price-estimation/services-suites-cell/services-suites-cell.component';
import { SuitesCellComponent } from '../../price-estimation/suites-cell/suites-cell.component';
import { SuitesHeaderRenderComponent } from '../../price-estimation/suites-header-render/suites-header-render.component';
import { ExceptionComponent } from './exception.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

const exceptionActivitiesMock = {"rid":"EAMP1655929062374","user":"prguntur","error":false,"data":{"proposalExceptionActivities":[{"id":"616de1bdce23d067d5971195","groupId":"EAMP1634591160675","groupSeq":1,"proposalId":20000445,"seq":1,"exceptionType":"BUYING_PROGRAM_REDIRECTION_EXCEPTION_CHECK","exceptionName":"Quality Review","exceptionDescription":"Only selected pre-approved accounts will be allowed to convert their Cisco EA pricing into a quote during the pilot.  Unfortunately, all EA 3.0 pricing will require an important number of manual steps and the team won’t be able to accommodate all accounts. Once the pilot is over, proposal completion and quote conversion will be open to all authorized resellers.","status":"PENDING","requestedBy":"ashdas","requestReasons":["My account is not currently part of the Cisco EA 3.0 pilot and I understand the exception request may not be approved"],"requestComment":"asdf","requestedAt":1634591179297,"teamName":"Quality Review Team","actionedBy":"prguntur","approverName":"Gowthaman Krishnamurthy","approverAssignedAt":1637160101784,"deleted":false,"audit":{"createdBy":"ashdas","createdAt":1634591165399,"updatedBy":"gowtkris","updatedAt":1646923522431},"cycleTime":21337883555,"autoApproved":false,"cause":[{"code":"EA091","text":"Legacy customer exception.","severity":"WARN","createdAt":1634591165288,"createdBy":"ashdas","type":"EXCEPTION","key":"EA091"}],"teamMembers":[{"cecId":"rishiksi","name":"Rishikesh Singh","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"nekedia","name":"Neelima Kedia","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sapol","name":"Sarang Pol","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"trzope","name":"Trupti Zope","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"srikanre","name":"Srikanth Reddy","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ashdas","name":"Ashish Das","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"asapinen","name":"Anil Sapineni","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"suschaud","name":"Sushant Chaudhari","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sangrdas","name":"Sangram Das","primary":true,"regions":["AMERICAS"]},{"cecId":"anagpure","name":"Arun Nagpure","primary":true,"regions":["AMERICAS"]},{"cecId":"kritravi","name":"Krithika Ravi","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"vaising2","name":"Vaishali Singh","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"pvaydand","name":"Priyanka Vaydande","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"abellam","name":"Abhinav Satya Kumar Bellam","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"srchimak","name":"Naga Kishore Chimakurthi","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"sagramai","name":"Sagarika Ramaiahgari","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"vaising2","name":"Vaishali Singh","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"chmeyers","name":"Christophe Meyer","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ssonaman","name":"Srilatha Sonamana","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"ashdas","name":"Ashish Das","primary":true,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"rkedia","name":"Rajeev Kedia","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"gowtkris","name":"Gowthaman Krishnamurthy","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"kdasarah","name":"Kumar Dasarahalli Govindaiah","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"skokkond","name":"Santhosh Kokkonda","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"srirabal","name":"Sriram Balasubramanian","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"khusingh","name":"Khushboo Singh","primary":false},{"cecId":"sakorada","name":"SARATHCHANDRA BOSE KORADA","primary":false,"regions":["AMERICAS","EMEAR","APJC"]},{"cecId":"prguntur","name":"Pradeep Guntur","primary":false,"regions":["AMERICAS","EMEAR","APJC"]}],"allowedToBecomeApprover":true,"notificationSent":false,"caseEmailInitiated":false,"decision":"Pending","cycleTimeStr":"176 days 23 hrs 10 mins ","approved":false,"requested":true,"messages":["Legacy customer exception."],"actioned":false,"additionalApproverAssigned":false,"approverAssigned":true,"label":"Quality Review","rejected":false,"awaitingDecision":true,"awatingSubmissionForApproval":false,"withdrawn":false}],"allowExceptionSubmission":false,"allowExceptionWithdrawl":false},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1655929062859}

const exceptionDecisionDataMock = {"rid":"EAMP1656338355326","user":"prguntur","error":false,"data":{"approverDecisionOptions":[{"proposal":{"objId":"62a02e37b911d972e5851ae0","id":20011916,"projectObjId":"629fec2295a8a61891da40dc","projectId":2004629,"name":"VS Downsell 8 June","billingTerm":{"rsd":"20220608","billingModel":"Prepaid","term":36,"eaEndDateStr":"20250607","eaEndDate":1749279600000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beId":586064,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792,"countryCode":"US"},"customer":{"accountName":"PUMA","customerGuId":"4247758","customerGuName":"PUMA SE","preferredLegalName":"PUMA","preferredLegalAddress":{"addressLine1":"6800 N 95TH AVE","city":"GLENDALE","state":"AZ","zip":"85305","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"VP","firstName":"Test","lastName":"Test","name":"Test Test","email":"vp.15nov@gmail.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":true},"dealInfo":{"id":"76394273","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"220525603","partnerDeal":true,"distiDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":false,"status":"PENDING_APPROVAL","initiatedBy":{"type":"CISCO","ciscoInitiated":true,"distiInitiated":false},"audit":{"createdBy":"trzope","createdAt":1654664759347,"updatedBy":"ashdas","updatedAt":1654665331026},"priceInfo":{"extendedList":617784.84,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":311563.08,"totalNetBeforeCredit":364557.6,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0},"message":{"hasError":false,"messages":[{"code":"EA096","text":"Engage your AppD team to confirm this opportunity is eligible: Net New AppD Customer, AVP Expand or Q4 AppD Renewal. Offer only available in United States & Canada. Questions? Contact accelerate@appdynamics.com","severity":"WARN","createdAt":1654665123204,"createdBy":"trzope","key":"EA096"},{"code":"EA122","text":"Early renewal exception","severity":"WARN","createdAt":1654665123725,"createdBy":"trzope","type":"EXCEPTION","exceptionCause":{"proposalId":20011916,"expected":" "},"key":"EA122"}]},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":311563.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":3202,"masterAgreementId":"EA2934","returningCustomer":false},"exception":{"pendingApproval":true,"allowSubmission":false,"allowWithdrawl":false},"statusDesc":"Pending Approval","allowCompletion":true,"summaryViewAllowed":true},"exceptionId":"EARLY_RENEWAL_CHECK","exceptionName":"Early Renewal","exceptionDescription":"Exception for when an existing suite is not selected for renewal","label":"Early Renewal","messages":["Early renewal exception"],"decisions":[{"decisionType":"APPROVED","reasons":["Approved by finance"]},{"decisionType":"REJECTED","reasons":["Rejected by one or more finance BUs"]}]}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656338355929}

const subscriptionCreditDetailsMock = {"rid":"EAMP1656356023959","user":"prguntur","error":false,"data":{"tcvOfEarlyFollowOn":311563.08,"existingSubscriptionARR":1149639.12,"earlyFollowOnARR":103854.36},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1656356024965}
class MockProposalRestService {
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


  downloadDocApiCall(){
    return of({
      data: {

      },
    });
  }

  deleteApiCall() {
    return of({
      data: {
    
      },
    });
  }

  putApiCall() {
    return of({
      data: {
    
      },
    });
  }
}

class UtilitiesServiceMock {
  saveFile(res: any, downloadZipLink: any) {
      return of(true);
  }
}

class VnextServiceMock {
  isValidResponseWithData(res: any) {
      return of(true);
  }

  isValidResponseWithoutData(res: any) {
      return of(true);
  }
}


describe('ExceptionComponent', () => {
  let component: ExceptionComponent;
  let fixture: ComponentFixture<ExceptionComponent>;
  let vnextService = new VnextServiceMock();
  let utilitiesService = new UtilitiesServiceMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, BrowserTestingModule,
            
          ],
      declarations: [ ExceptionComponent,LocalizationPipe ],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [ProposalStoreService, VnextStoreService, LocalizationService, {provide: UtilitiesService, useValue: utilitiesService}, EaStoreService, MessageService, NgbModal, {provide: VnextService, useValue: vnextService}, {provide: ProposalRestService, useClass: MockProposalRestService}, ConstantsService, CurrencyPipe, ProjectStoreService, EaRestService, DataIdConstantsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionComponent);
    component = fixture.componentInstance;
    component.isApprovalFlow = false;
    component.exceptionActivities = exceptionActivitiesMock.data.proposalExceptionActivities;
    component.groupExceptionApproverHistory = [];
    component.displayApprovalHistory = false;
    component.isExceptionStatusNew = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngoninit', () => {
    component.ngOnInit();
    expect(component.isApprovalFlow).toBeFalsy();
    const dataSpy = jest.spyOn(component, 'prepareExceptionData');
    component.isApprovalFlow = true;
    component.ngOnInit();
    expect(dataSpy).toHaveBeenCalled();
  });

  it('should convertRegionToString ', () => {
    const regions = exceptionActivitiesMock.data.proposalExceptionActivities[0].teamMembers[0].regions
    const result = component.convertRegionToString(regions)
    expect(result).toBeTruthy();
  });

  it('should setApprovalFlow ', () => {
    component.setApprovalFlow(component.exceptionActivities);
    expect(component.isApprovalFlow).toBeTruthy();
  });

  it('should setSelectedExceptions ', () => {
    component.setSelectedExceptions(component.exceptionActivities[0]);
    expect(component.approverReqObj).toBeTruthy();
    expect(component.approverReqObj.data.exceptionId.length).toBeGreaterThan(0);
  });

  it('should set decisions data and show dropdown ', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions
    component.dropDecision(exceptinDecisionData[0]);
    expect(component.approvalDecision.length).toBeTruthy();
    expect(component.showSubmitDecision).toBeTruthy();
  });

  it('should select decisions for selected exception', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    const approvalDecision = [{
      "decisionType": "APPROVED",
      "reasons": [
        "Approved by finance"
      ]
    },
    {
      "decisionType": "REJECTED",
      "reasons": [
        "Rejected by one or more finance BUs"
      ]
    }]
    component.selectDecision(approvalDecision[0], exceptinDecisionData[0]);
    expect(component.isDecisionSelected).toBeTruthy();
    expect(component.justificationMandatory).toBeFalsy();
    expect(exceptinDecisionData[0]['selectedDecision']).toBeTruthy();

    component.selectDecision(approvalDecision[0], exceptinDecisionData[0]);
    expect(component.isEnableSubmit).toBeFalsy();


    component.selectDecision(approvalDecision[1], exceptinDecisionData[0]);
    expect(component.isReasonSelected).toBeFalsy();
    expect(component.isEnableSubmit).toBeFalsy();

  });


  it('should set decisions data and show dropdown ', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "APPROVED"
    };
    component.dropDecision(exceptinDecisionData[0]);
    expect(component.giveReason.length).toBeFalsy();
  });

  it('should select reasons for selected exception', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "APPROVED"
    };
    component.exceptionDecisionData = exceptinDecisionData;
    component.selectReason("Approved by finance", exceptinDecisionData[0]);
    // expect(component.reasonsSelectedCount).toEqual(0);
    expect(component.isReasonSelected).not.toBeUndefined();
  });

  it('should set checkRequestPurchaseAdjustment', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "APPROVED"
    };
    exceptinDecisionData[0].exceptionId = 'PURCHASE_ADJUSTMENT_REQUEST';
    component.checkRequestPurchaseAdjustment(exceptinDecisionData[0]);
    expect(component.isEnableSubmit).toBeTruthy();

    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "REJECTED"
    };
    exceptinDecisionData[0]['comment']='test';
    exceptinDecisionData[0].exceptionId = 'PURCHASE_ADJUSTMENT_REQUEST';
    component.checkRequestPurchaseAdjustment(exceptinDecisionData[0]);
    // expect(component.isEnableSubmit).toBeTruthy();
  });

  it('should store comment added', () => {
    const mockEvent: Event = <Event><any>{
      target: {
          value: 'test'   
      }
    };
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "APPROVED"
    };
    exceptinDecisionData[0]['selectedReason'] = {
      decisionType: "Approved by finance"
    };
    component.approverCommentAdded(mockEvent, exceptinDecisionData[0]);
    expect(component.isEnableSubmit).toBeFalsy();

    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "REJECTED"
    };
    exceptinDecisionData[0].exceptionId = 'PURCHASE_ADJUSTMENT_REQUEST';
    component.approverCommentAdded(mockEvent, exceptinDecisionData[0]);
    expect(component.isEnableSubmit).toBe(true);

    const mockEevent: Event = <Event><any>{
      target: {
          value: ''   
      }
    };
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "REJECTED"
    };
    exceptinDecisionData[0].exceptionId = 'PURCHASE_ADJUSTMENT_REQUEST';
    component.approverCommentAdded(mockEvent, exceptinDecisionData[0]);
    expect(component.isEnableSubmit).toBe(true);
  });

  it('show check approver decision', () => {
    let exceptinDecisionData = exceptionDecisionDataMock.data.approverDecisionOptions;
    exceptinDecisionData[0]['selectedDecision'] = {
      decisionType: "REJECTED"
    };
    exceptinDecisionData[0]['decision'] = 'Rejected';
    exceptinDecisionData[0]['status'] = 'Rejected';
    let vnextStoreService = fixture.debugElement.injector.get(VnextStoreService);
    component.checkApproverDecisionType(exceptinDecisionData);
    expect(vnextStoreService.toastMsgObject.isExceptionRejected).toBeTruthy();
    expect(component.isDecisionSelected).toBeFalsy();
  });

  it('should set case number in data after api success', () => {
    let exceptionActivities = exceptionActivitiesMock.data.proposalExceptionActivities;
    exceptionActivities[0].exceptionType = 'PURCHASE_ADJUSTMENT_REQUEST';
    component.setCaseNumber('12345');
    expect(exceptionActivities[0]['sourceRefId']).toBeTruthy();
  });

  // it('should download pa document', () => {
  //   let exceptionActivities = exceptionActivitiesMock.data.proposalExceptionActivities;
  //   const downloadSpy = jest.spyOn(proposalRestService, 'downloadDocApiCall');
  //   const validResponseSpy = jest.spyOn(vnextService, 'isValidResponseWithoutData');
  //   const saveFileSpy = jest.spyOn(utilitiesService, 'saveFile');
  //   component.downloadPADocument(exceptionActivities[0]);
  //   expect(downloadSpy).toHaveBeenCalled();
  //   expect(validResponseSpy).toBeTruthy();
  // });

  it('should download pa document', () => {
   // const downloadSpy = jest.spyOn(ProposalRestService, 'downloadDocApiCall');
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "downloadDocApiCall").mockReturnValue(of());
    const validResponseSpy = jest.spyOn(vnextService, 'isValidResponseWithoutData');
    const saveFileSpy = jest.spyOn(utilitiesService, 'saveFile');
    component.downloadSubscriptionDocument();
   // expect(downloadSpy).toHaveBeenCalled();
    expect(validResponseSpy).toBeTruthy();
  });

  it('should create and set data for early follw on', () => {
    component.createSubscriptionCreditDetailsData(subscriptionCreditDetailsMock, exceptionDecisionDataMock.data.approverDecisionOptions[0])
  expect(component.showSYD).toBeTruthy();
  });

  it('shouldswitch status of requested exceptions and approval history', () => {
    component.switchShowStatus(false)
  expect(component.displayApprovalHistory).toBeFalsy();
  });

  it('should go back to PE page', () => {
    let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
    component.backToPe();
    expect(proposalStoreService.showProposalSummary).toBeFalsy();
    expect(proposalStoreService.showPriceEstimate).toBeTruthy();
    expect(proposalStoreService.isPaApproverComingFromSummary).toBeTruthy();
  });

  it('show prepare excptions data', () => {
    component.exceptionActivities = exceptionActivitiesMock.data.proposalExceptionActivities;
    const setSelectedExceptionsSpy = jest.spyOn(component, 'setSelectedExceptions');
    const callBecomeApproverDefaultSpy = jest.spyOn(component, 'callBecomeApproverDefault');
    component.prepareExceptionData();
    // expect(component.isRequestPaPresent).toBe(false);
    expect(setSelectedExceptionsSpy).toHaveBeenCalled();
    expect(component.callBecomeApprover).toBeFalsy();
    expect(callBecomeApproverDefaultSpy).toHaveBeenCalled();
  });

  it('show call become approver', () => {
    component.type = 'becomeApprover';
    const prepareExceptionDataSpy = jest.spyOn(component, 'prepareExceptionData');
    const becomereviewSpy = jest.spyOn(component, 'becomeReviewer');
    window.scrollTo = function () { return window; }
    let call = jest.spyOn(window, "scrollTo");
    component.becomeApprover();
    expect(prepareExceptionDataSpy).toHaveBeenCalled(); 
    expect(becomereviewSpy).toHaveBeenCalled();
  });

  it('show call become approver and get decisions data', () => {
    component.type = 'becomeApprover';
    const response = {data:{ approverDecisionOptions: []}}
    const checkBecomeApproverApiResponseSpy = jest.spyOn(component, 'checkBecomeApproverApiResponse');
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.becomeReviewer('test');
    //expect(apiSpy).toHaveBeenCalled();
    expect(checkBecomeApproverApiResponseSpy).toHaveBeenCalled();
    expect(component.showSubmitDecision).toBeTruthy();
  });


  it('show call become approver and get decisions data', () => {
    component.type = 'becomeApprover';
    const subscriptionCreditDetailsSpy = jest.spyOn(component, 'subscriptionCreditDetails');
    const setApproverCecSpy = jest.spyOn(component, 'setApproverCec');
    component.checkBecomeApproverApiResponse(exceptionDecisionDataMock, component.type);
    expect(subscriptionCreditDetailsSpy).toHaveBeenCalled();
    expect(component.exceptionDecisionData).toBeTruthy();
    expect(setApproverCecSpy).toHaveBeenCalled();
    expect(component.showSubmitDecision).toBeTruthy();
  });

  it('should set approver cec', () => {
    component.approverReqObj = {
      data:{
      exceptionId: ['EARLY_RENEWAL_CHECK']
    }}
    let vnextStoreService = fixture.debugElement.injector.get(VnextStoreService);
    component.setApproverCec(component.approverReqObj.data.exceptionId, exceptionActivitiesMock.data.proposalExceptionActivities)
    expect(vnextStoreService.toastMsgObject.isBecameReviewer).toBeTruthy();
  });

  it('should submitDecision', () => {
    const response = {data: {proposalExceptionActivities: []}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    const validResponseSpy = jest.spyOn(vnextService, 'isValidResponseWithData');
    let vnextStoreService = fixture.debugElement.injector.get(VnextStoreService);
    const exceptionApprovalSuccessSpy = jest.spyOn(component, 'exceptionApprovalSuccess');
    component.submitDecision();
   // expect(apiSpy).toHaveBeenCalled();
    expect(validResponseSpy).toHaveBeenCalled();
    expect(component.isApproverDecisionSubmitted).toBeFalsy();
  });

});