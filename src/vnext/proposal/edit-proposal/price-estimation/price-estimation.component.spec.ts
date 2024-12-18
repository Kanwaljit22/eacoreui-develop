import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { of } from 'rxjs';
import { GridOptions } from "ag-grid-community";
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { EamsDeliveryComponent } from 'vnext/modals/eams-delivery/eams-delivery.component';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from './price-estimate-store.service';
import { PriceEstimateService } from './price-estimate.service';
import { PriceEstimationPollerService } from './price-estimation-poller.service';import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimationComponent } from './price-estimation.component';
import { QuestionnaireService } from './questionnaire/questionnaire.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EnagageSupportTeamComponent } from 'vnext/modals/enagage-support-team/enagage-support-team.component';
import { AddSecurityServiceEnrollComponent } from 'vnext/modals/add-security-service-enroll/add-security-service-enroll.component';
import { ManageTeamComponent } from 'vnext/modals/manage-team/manage-team.component';
import { EligibilityStatusComponent } from 'vnext/modals/eligibility-status/eligibility-status.component';
import { RequestDocumentsComponent } from 'vnext/modals/request-documents/request-documents.component';
import { FutureConsumableItemsComponent } from 'vnext/modals/future-consumable-items/future-consumable-items.component';
import { ApplyDiscountComponent } from 'vnext/modals/apply-discount/apply-discount.component';
import { UnenrollConfirmationComponent } from 'vnext/modals/unenroll-confirmation/unenroll-confirmation.component';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';

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

  deleteApiCall(){
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
class MockMessageService {
  displayMessagesFromResponse(test) {
    
  }
  clear(){}

  displayUiTechnicalError(){}
}


 const  proposalData = {
      id: 12345678,
      enrollments: [
        {
          'objId': '123123',
        "id": 1,
        "name": "Networking Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "billingTerm": {
          "rsd": "20220501",
          "billingModel": "Prepaid",
          "billingModelName": "Prepaid Term",
          "term": 36
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 1,
          "pcSuiteCount": 1
        },
        "pools": [],
        "priceInfo": {
          "extendedList": 9064930.32,
          "unitNet": 0,
          "totalNet": 4497410.52,
          "totalNetBeforeCredit": 5257647.36,
          "purchaseAdjustment": 760236.84,
          "totalSwNet": 4497410.52,
          "totalSwNetBeforeCredit": 5257647.36,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0,
          "totalNetForRelatedServiceAtos": 5380398.72
        },
        "disabled": false,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": true,
      },
      {
        "id": 2,
        "name": "Applications Infrastructure",
        "primary": true,
        "enrolled": true,
        "displayQnA": false,
        "billingTerm": {
          "rsd": "20220501",
          "billingModel": "Prepaid",
          "billingModelName": "Prepaid Term",
          "term": 36
        },
        "commitInfo": {
          "committed": true,
          "fcSuiteCount": 1,
          "pcSuiteCount": 1
        },
        "pools": [],
        "priceInfo": {
          "extendedList": 9064930.32,
          "unitNet": 0,
          "totalNet": 4497410.52,
          "totalNetBeforeCredit": 5257647.36,
          "purchaseAdjustment": 760236.84,
          "totalSwNet": 4497410.52,
          "totalSwNetBeforeCredit": 5257647.36,
          "totalSrvcNet": 0,
          "totalSrvcNetBeforeCredit": 0,
          "totalNetForRelatedServiceAtos": 5380398.72
        },
        "disabled": false,
        "externalConfiguration": false,
        "cxOptInAllowed": true,
        "cxAttached": true,
      }
    ]
  };

  let propsoalResponse = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":true,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}



describe('PriceEstimationComponent', () => {
  let component: PriceEstimationComponent;
  let fixture: ComponentFixture<PriceEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: "ea/project/:projectObjId", redirectTo: "" },
        { path: "ea/project/proposal/createproposal", redirectTo: ""},
        { path: "ea/project/proposal/:proposalObjId", redirectTo: "" },
        { path: "ea/project/proposal/list", redirectTo: "" },
      ])],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ PriceEstimationComponent,UnenrollConfirmationComponent,LocalizationPipe,RequestDocumentsComponent,FutureConsumableItemsComponent ],
      providers: [CurrencyPipe,ProposalService,ProjectStoreService, NgbActiveModal,ProjectService,  {provide: EaRestService, useClass: MockEaRestService}, PriceEstimateService, 
        ProjectRestService ,{provide: ProposalRestService, useClass: MockProposalRestService},
          ProposalStoreService, PriceEstimateStoreService, UtilitiesService, TcoStoreService,
         VnextService, VnextStoreService, QuestionnaireService, DataIdConstantsService, ElementIdConstantsService,
        PriceEstimationPollerService,EaStoreService  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceEstimationComponent);
    component = fixture.componentInstance;
    component.proposalStoreService.proposalData = proposalData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit method', () => {
    sessionStorage.setItem('redirectOWB','testurl')
    component.eaStoreService.isValidationUI = true
    component.proposalStoreService.proposalData = proposalData
    component.eaStoreService.changeSubFlow = true
    component.proposalStoreService.proposalData.renewalInfo = {
      id: 123
    }
    component.ngOnInit();

    expect(component.eaStoreService.pePunchInLanding).toBeFalsy();
 
  });
  it('call refreshProposalData', () => {
    component.proposalStoreService.proposalData = proposalData
    component.eaStoreService.changeSubFlow = true
    component.proposalStoreService.proposalData.renewalInfo = {
      id: 123
    }
    component.vnextService.refreshProposalData.next({isPermissionRefresh:false});
    expect(component.eaStoreService.pePunchInLanding).toBeFalsy();
 
  });
  it('call updateQtySubject 1', () => {
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateService.updateProposalDataForCx.next({proposalData})
    component.priceEstimateService.updateQtySubject.next(proposalData)
    component.vnextService.roadmapSubject.next({})
    component.vnextService.withdrawProposalSubject.next('withdraw')
    expect(component.eaStoreService.pePunchInLanding).toBeFalsy();
 
  });
  it('call all subjects', () => {
    component.priceEstimateService.showUpdatePA = true
    component.eaService.features.FIRESTORM_REL = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.syncStatus = {}
    component.proposalStoreService.proposalData.status = 'COMPLETE'
    component.priceEstimateService.updateTierForAtoSubject.next({tireToUpdate:{name:''}})
    component.priceEstimateService.updateQtySubject.next(undefined)
    component.priceEstimateService.refreshPeGridData.next({})
    component.priceEstimateService.addSuiteEmitter.next({})
    component.priceEstimateService.delinkHwCxSubject.next({})
    component.priceEstimateService.openDesriredQtySubject.next({})
    component.priceEstimateService.addMoreSuitesFromGrid.next({})
    component.priceEstimateService.updateProposalDataForCx.next({proposalData})
    component.vnextService.roadmapSubject.next({})
    component.vnextService.withdrawProposalSubject.next({})
    expect(component.eaStoreService.pePunchInLanding).toBeFalsy();
 
  });

  it('call selectEnrollment method enrolled: false', () => {
    const enrolemnt = {enrolled: false, displayQnA: true}
    component.selectEnrollment(enrolemnt);
    expect(component.priceEstimateStoreService.openAddSuites).toBeTruthy();
  });
  it('call selectEnrollment method enrolled: true', () => {
    const enrolemnt = {enrolled: true, displayQnA: true}
    const onEnrollmentDeselection = jest.spyOn(component, 'onEnrollmentDeselection')
    component.selectEnrollment(enrolemnt);
    expect(onEnrollmentDeselection).toHaveBeenCalled();
  });

  it('call openQnAFlyout', () => {
    const enrolemnt = {enrolled: false, displayQnA: true}
    component.openQnAFlyout(enrolemnt);
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('call openEAMS', () => {
 
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(EamsDeliveryComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    component.priceEstimateStoreService.displayCxGrid = true
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openEAMS();
    expect(open).toHaveBeenCalled();
  });

  it('call onEnrollmentSelection enrolled: false', () => {
    component.upgradedEnrollmentsArray = [{id:3}]
    component.eaService.isUpgradeFlow = true
    const response = {data:{enrollments: [{priceInfo: {},id:3}]}}
    component.proposalStoreService.proposalData = proposalData
    component.selectedEnrollmentArray = [{id:3}]
    const enrolemnt = {enrolled: false, displayQnA: true,priceInfo:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.onEnrollmentSelection(enrolemnt);
    
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('call onEnrollmentSelection enrolled: true', () => {
    component.selectedEnrollmentArray = []
    const response = propsoalResponse
    component.eaService.isUpgradeFlow = true
    component.proposalStoreService.proposalData = proposalData
    const enrolemnt = {enrolled: true,primary: false, id: 3, displayQnA: true,priceInfo:{}}
    component.priceEstimateStoreService.hybridSuiteUpdated = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.onEnrollmentSelection(enrolemnt);
    
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('call onEnrollmentSelection enrolled: true for hybrid', () => {
    component.selectedEnrollmentArray = []
    const response = propsoalResponse
    component.eaService.isUpgradeFlow = true
    component.proposalStoreService.proposalData = proposalData
    const enrolemnt = {enrolled: false, primary: false, id: 6, displayQnA: true,priceInfo:{}}
    //component.priceEstimateStoreService.hybridSuiteUpdated = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.onEnrollmentSelection(enrolemnt);
    
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('call hideChangeSubMsg', () => {
    component.hideChangeSubMsg();  
    expect(component.showChangeSubMsg).toBeFalsy();  
  });

  it('call getProposalData', () => {
    const setProposalPermissions = jest.spyOn(component.proposalService, 'setProposalPermissions')
    const response = propsoalResponse;
    component.proposalStoreService.proposalData = {objId: '123123'}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getProposalData();  
    expect(setProposalPermissions).toHaveBeenCalled();  
  });

  it('call shareWithDistributor', () => {
    const getEnrollmentData = jest.spyOn(component, 'getEnrollmentData')
    const response = propsoalResponse;
    component.proposalStoreService.proposalData = {objId: '123123'}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.shareWithDistributor();  
    expect(getEnrollmentData).toHaveBeenCalled();  
  });

  it('call displayGridForEnrollment onEnrollmentUpdate: true', () => {

    const response = propsoalResponse;
    component.gridOptions = <GridOptions>{};
    component.gridOptions.context = {
      parentChildIstance: this
    };
    component.gridOptions.rowSelection = 'multiple';
    component.gridOptions.domLayout = 'autoHeight';
    component.proposalStoreService.proposalData = response.data.proposal
    component.proposalStoreService.proposalData.enrollments = response.data.enrollments
    component.proposalStoreService.isProposalCreated =  true;
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.displayGridForEnrollment(1, true);  
    expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
  });
  it('call displayGridForEnrollment onEnrollmentUpdate: true,requestOverride', () => {
    component.eaService.customProgressBarMsg.requestOverride = true
    const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
    component.gridOptions = <GridOptions>{};
    component.proposalStoreService.proposalData = response.data.proposal
    component.proposalStoreService.proposalData.enrollments = response.data.enrollments
    component.proposalStoreService.isProposalCreated =  true;
    component.isCascadeApplied = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.displayGridForEnrollment(2, true);  
    expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
  });
  it('call displayGridForEnrollment onEnrollmentUpdate: true,witdrawReqOverride', () => {
    component.eaService.customProgressBarMsg.witdrawReqOverride = true
    const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
    component.gridOptions = <GridOptions>{};
    component.proposalStoreService.proposalData = response.data.proposal
    component.proposalStoreService.proposalData.enrollments = response.data.enrollments
    component.proposalStoreService.isProposalCreated =  true;
    component.isCascadeApplied = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.displayGridForEnrollment(2, true);  
    expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
  });

  it('call displayGridForEnrollment', () => {
    component.gridOptions = <GridOptions>{};
    const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
    component.proposalStoreService.proposalData = response.data.proposal
    component.proposalStoreService.proposalData.enrollments = response.data.enrollments
    component.proposalStoreService.isProposalCreated =  true;  
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.displayGridForEnrollment(6);  
    expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
  });

    it('call displayGridForAllEnrollment', () => {
      component.priceEstimateStoreService.viewAllSelected = true;
      component.gridOptions = <GridOptions>{};
      const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
      component.proposalStoreService.proposalData = response.data.proposal
      component.proposalStoreService.proposalData.enrollments = response.data.enrollments
 
      let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
      jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
      component.displayGridForAllEnrollment();  
      expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
  });

  it('call onGridReady', () => {
    component.priceEstimateStoreService.viewAllSelected = true;
    component.gridOptions = <GridOptions>{};
    component.onGridReady({});  
    expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
});

it('call onServiceGridReady', () => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  component.onServiceGridReady({});  
  expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
});

it('call openUpdatePurchaseA', () => {
  component.openUpdatePurchaseA();  
  expect(component.priceEstimateService.showUpdatePA).toBe(true);  
});

it('call delinkHwCx', () => {
  const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":false,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
      component.proposalStoreService.proposalData = proposalData
      component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
 
  component.delinkHwCx();  
  expect(component.priceEstimateService.showUpdatePA).toBe(false);  
});

it('call enableEngageSupportTeam', () => {
  component.selectedEnrollmentArray = [{enrolled: true},{enrolled: false}]
 
  const test = component.enableEngageSupportTeam();  
  expect(test).toBe(1);  
});

it('call withdrawFromDistributor', () => {
  const getEnrollmentData = jest.spyOn(component, 'getEnrollmentData').mockImplementationOnce(()=> Promise.resolve(true));
  const response = propsoalResponse;
  component.proposalStoreService.proposalData = {objId: '123123'}
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  component.withdrawFromDistributor();  
  expect(getEnrollmentData).toHaveBeenCalled();  
});



it('call getEnrollmentData', fakeAsync(() => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
  response.data.proposal['mspInfo'] = {}
  //const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":true,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
  component.proposalStoreService.proposalData = response.data.proposal
  //response.data.enrollments = proposalData.enrollments
  component.proposalStoreService.proposalData.enrollments = response.data.enrollments
  component.eaService.features.MSEA_REL = true
  component.eaService.features.SPLUNK_SUITE_REL = true
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.getEnrollmentData(true);  
  tick(500);
  expect(component.proposalStoreService.proposalData.isSplunkSuitesAdded).toBe(false);  
  flush();
}));

it('call checkForDisablingHybrid', () => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":true,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":true,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
  component.proposalStoreService.proposalData = response.data.proposal
  component.proposalStoreService.proposalData.enrollments = response.data.enrollments
  response.data.enrollments[0].pools = [{suites:[{notAllowedHybridRelated: true,hasBfRelatedMigratedAto:true},{notAllowedHybridRelated: true,hasBfRelatedMigratedAto:true}]}]

  let eaRestService = fixture.debugElement.injector.get(EaRestService);
  jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
  component.checkForDisablingHybrid();  
  expect(component.priceEstimateStoreService.isHybridEnrollmentSelected).toBe(true);  
});

it('call checkForDisablingHybrid enrolled false', () => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":true,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[{suites:[{notAllowedHybridRelated: true,hasBfRelatedMigratedAto: true}]}],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
  component.proposalStoreService.proposalData = response.data.proposal
  component.proposalStoreService.proposalData.enrollments = response.data.enrollments

  let eaRestService = fixture.debugElement.injector.get(EaRestService);
  jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
  component.checkForDisablingHybrid();  
  expect(component.priceEstimateStoreService.isHybridEnrollmentSelected).toBe(false);  
});

it('call checkForDisablingHybrid alreadyPurchased true', () => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":true,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"alreadyPurchased": true,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[{suites:[{notAllowedHybridRelated: true,hasBfRelatedMigratedAto: true}]}],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
  component.proposalStoreService.proposalData = response.data.proposal
  component.proposalStoreService.proposalData.enrollments = response.data.enrollments

  let eaRestService = fixture.debugElement.injector.get(EaRestService);
  jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
  component.checkForDisablingHybrid();  
  expect(component.showSelectedEnrollmentsDropDown).toBe(false);  
});

it('call hideBenifitsMsg', () => {
  component.hideBenifitsMsg();  
  expect(component.showBenefitsMsg).toBe(false);  
});

it('call closeAddSuitesEventUpdated', () => {
  component.closeAddSuitesEventUpdated();  
  expect(component.deeplinkForServices).toBe(false);  
});

it('call inItGrid', () => {
  component.inItGrid();  
  expect(component.priceEstimateService.enableSuiteInclusionExclusion).toBe(true);  
});

it('call toggleAllPortfolio', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.togglePortfolio = true
  component.toggleAllPortfolio();  
  expect(component.togglePortfolio).toBe(false);  
});
it('call toggleAllPortfolio false', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.togglePortfolio = false
  component.toggleAllPortfolio();  
  expect(component.togglePortfolio).toBe(true);  
});

it('call viewAndEditHardwareSupport', () => {
  const response = {data: {redirectionUrl: 'test'}}
  window.open = function () { return window; }
  const  call = jest.spyOn(window, "open");
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.viewAndEditHardwareSupport();  
  expect(call).toHaveBeenCalled();  
});

it('call getRenewalSubscriptionDataForSuites', () => {
  const response = {data: {subscriptions: [{subRefId: '123'}]}}

  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.getRenewalSubscriptionDataForSuites();  
  expect(component.priceEstimateStoreService.renewalSubscriptionDataForSuite).toBe(response.data);  
});
it('call reProcessIb', () => {
  const response = {data: {}}
  const  getEnrollmentData = jest.spyOn(component, "getEnrollmentData");
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.reProcessIb();  
  expect(component.getEnrollmentData).toHaveBeenCalled();  
});

it('call setMerakiMsg', () => {
  const test = component.setMerakiMsg();  
  expect(test).toBeDefined();  
});
it('call downloadExcel', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.downloadExcel();  
  expect(component.showMoreActions).toBe(false);  
});

it('call openDesriredQty', () => {
  const event = {data:{ato:{},poolName: 'test'}}
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.openDesriredQty(event);  
  expect(component.priceEstimateService.showDesriredQty).toBe(true);  
});

it('call addMoreSuites', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.priceEstimateStoreService.selectedEnrollment.displayQnA = true
  component.addMoreSuites();  
  expect(component.deeplinkForServices).toBe(false);  
});

it('call addMoreSuites forServices: true', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.priceEstimateStoreService.selectedEnrollment.displayQnA = true
  component.addMoreSuites(true);  
  expect(component.deeplinkForServices).toBe(true);  
});

// it('call cascadeDiscount isCascadeApplied: false', () => {
//   component.proposalStoreService.proposalData = proposalData
//   component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
//   const response = {data: {}}
//   let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
//   jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
//   component.cascadeDiscount();  
//   expect(component.isCascadeApplied).toBe(false);  
// });

// it('call cascadeDiscount isCascadeApplied: true', () => {
//   const setErrorMessage = jest.spyOn(component, 'setErrorMessage').mockImplementationOnce(()=> {});
//   const setTotalValues = jest.spyOn(component, 'setTotalValues').mockImplementationOnce(()=> {});
//   const setGridData = jest.spyOn(component, 'setGridData').mockImplementationOnce(()=> {});
//   component.proposalStoreService.proposalData = proposalData
//   component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
//   component.priceEstimateStoreService.selectedEnrollment = proposalData.enrollments[0]
//   const response = {data: {enrollments:[{id: 1}] }, proposal: component.proposalStoreService.proposalData}
//   let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
//   jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
//   component.cascadeDiscount();  
//   expect(component.isCascadeApplied).toBe(true);  
// });

  it('should call openOriginalProposal', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.proposalStoreService.proposalData = { originalProposalObjId: '1233' }
    component.openOriginalProposal();
    expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/1233']);
  });

  it('should call withdrawSupport', fakeAsync(() => {
    component.proposalStoreService.proposalData = proposalData
    component.requestPa = false;
    const response = {data:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.withdrawSupport();
    expect(component.requestPa).toBe(true);
    flush()
  }));

  it('should call requestEngageSupport', fakeAsync(() => {
    component.requestPa = false
    const data = {exceptions: [{selectedReasons: ''}],comment: 'test'}
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.requestEngageSupport(data);
    expect(component.requestPa).toBe(true);
    flush()
  }));

  it('should call updateEngageSupport', fakeAsync(() => {
    component.requestPa = false
    const data = {exceptions: [{selectedReasons: ''}],comment: 'test123'}
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{justification: 'test123'}}
    component.proposalStoreService.proposalData = {subscriptionInfo: {justification: 'test'}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.updateEngageSupport(data);
    expect(component.proposalStoreService.proposalData.subscriptionInfo.justification).toBe('test123');
    flush()
  }));

  it('should call getEngageSupportTeamReasons', () => {
    const openSupportModel = jest.spyOn(component, 'openSupportModel') 
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{requestExceptionOption: {exceptions: {}}}}
    component.proposalStoreService.proposalData = {subscriptionInfo: {justification: 'test'}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getEngageSupportTeamReasons();
    expect(openSupportModel).toHaveBeenCalled();  
  });

  it('should call openSupportModel', () => {
    // let ngbModalOptions: NgbModalOptions = {
    //   backdrop: 'static',
    //   keyboard: false,
    //   windowClass: 'lg vnext-manage-team',
    //   backdropClass: 'modal-backdrop-vNext'
    // };

    component.requestPa = true
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(EnagageSupportTeamComponent,{ windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modalRef.result =  new Promise((resolve) => resolve({continue: true,engage: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openSupportModel({});
    expect(open).toHaveBeenCalled();
  });

  it('should call openSupportModel requestPa: false', () => {
    component.requestPa = false
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(EnagageSupportTeamComponent,{ windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modalRef.result =  new Promise((resolve) => resolve({continue: true,engage: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openSupportModel({});
    expect(open).toHaveBeenCalled();
  });

  it('should call openSupportModel engage: false', () => {
    component.requestPa = false
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(EnagageSupportTeamComponent,{ windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modalRef.result =  new Promise((resolve) => resolve({continue: true,engage: false
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openSupportModel({});
    expect(open).toHaveBeenCalled();
  });
  
  it('should call checkPaInitStatus ', () => {
    const getEngageSupportTeamReasons = jest.spyOn(component, 'getEngageSupportTeamReasons') 
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{requestExceptionOption: {exceptions: {}}}}
    component.proposalStoreService.proposalData = {subscriptionInfo: {justification: 'test'}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));

    component.checkPaInitStatus({});
    expect(getEngageSupportTeamReasons).toHaveBeenCalled();
  });

  it('should call engageSupportTeam', () => {
    component.requestPa = false
    component.proposalStoreService.proposalData = proposalData;
    component.proposalStoreService.proposalData.subscriptionInfo = {existingCustomer: true}
    const checkPaInitStatus = jest.spyOn(component, 'checkPaInitStatus') 
    component.engageSupportTeam();
    expect(checkPaInitStatus).toHaveBeenCalled();
  });
  it('should call engageSupportTeam requestPa: true', () => {
    component.requestPa = true
    component.proposalStoreService.proposalData = proposalData;
    component.proposalStoreService.proposalData.subscriptionInfo = {existingCustomer: true}
    const getEngageSupportTeamReasons = jest.spyOn(component, 'getEngageSupportTeamReasons') 
    component.engageSupportTeam();
    expect(getEngageSupportTeamReasons).toHaveBeenCalled();
  });

  it('should call viewProposalList', () => {
    component.proposalStoreService.proposalData = proposalData
    component.viewProposalList();
    expect(component.proposalStoreService.proposalData).toStrictEqual({});
  });

  it('should call showAutoSuggestSecondaryEnrollment', () => {
    component.displayAutoSuggestionPopForSecurity = true
    const modalService = TestBed.get(NgbModal);
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'md',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modalRef = modalService.open(AddSecurityServiceEnrollComponent,ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.showAutoSuggestSecondaryEnrollment();
    expect(open).toHaveBeenCalled()
  });

  it('should call openManageTeam', () => {
    component.displayAutoSuggestionPopForSecurity = true
    const modalService = TestBed.get(NgbModal);
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    component.proposalStoreService.proposalEditAccess = true
    component.projectStoreService.projectEditAccess = true
    const modalRef = modalService.open(ManageTeamComponent,ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openManageTeam();
    expect(open).toHaveBeenCalled()
  });
  it('should call openManageTeam proposalEditAccess = false', () => {
    component.displayAutoSuggestionPopForSecurity = true
    const modalService = TestBed.get(NgbModal);
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    component.proposalStoreService.proposalEditAccess = false
    component.projectStoreService.projectEditAccess = false
    const modalRef = modalService.open(ManageTeamComponent,ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));

    const val = component.openManageTeam();
    expect(val).toBe(undefined)
    
  });

  it('should call closeEditProposalParam event = false', () => {
    const event = false
    component.closeEditProposalParam(event);
    expect(component.proposalStoreService.editProposalParamter).toBe(false)
  });

  it('should call closeEditProposalParam event = true', () => {
    const event = true
    component.priceEstimateStoreService.displayCxGrid = true
    component.proposalStoreService.proposalData = proposalData
    const getEnrollmentData = jest.spyOn(component, 'getEnrollmentData') 
    component.closeEditProposalParam(event);
    expect(getEnrollmentData).toHaveBeenCalled();
  });

  it('should call openPurchaseAdj', () => {
    component.rowData = {}
    component.proposalStoreService.proposalData = proposalData
    component.openPurchaseAdj();
    expect(component.priceEstimateService.paForCollab).toBe(false)
  });

  it('should call openPurchaseAdj priceEstimateStoreService.displayExternalConfiguration: true', () => {
    component.rowData = {}
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateStoreService.displayExternalConfiguration = true
    component.openPurchaseAdj();
    expect(component.priceEstimateService.paForCollab).toBe(true)
  });

  it('should call getCurrencyCode', () => {
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.currencyCode = 'test' 
    const val = component.getCurrencyCode();
    expect(val).toBe('test')
  });

  it('should call onResize', () => {
    const obj = {sizeColumnsToFit :function(){}}
    component.gridOptions = <GridOptions>{api: obj};
    component.gridOptions.context = {
      parentChildIstance: this
    };
    const event = {}
    component.gridOptions.rowSelection = 'multiple';
    component.onResize(event);
    expect(component.priceEstimateService.paForCollab).toBe(false)
  });

  // it('should call displayConsumablePopup', () => {
  //   const modalService = TestBed.get(NgbModal);

  //   const modalRef = modalService.open(FutureConsumableItemsComponent,{ windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
  //   modalRef.result =  new Promise((resolve) => resolve({continue: true
  //   }));

  //   const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
  //   component.displayConsumablePopup({});
  //   expect(open).toHaveBeenCalled()
  // });

  it('should call setOptInForPools partnerInfo: false', () => {
   // proposalData.enrollments[0]['optIn'] = true
    proposalData.enrollments[0].pools = [{optIn: false, suites: [{optIn: {optIn: false}}]}]
    component.proposalStoreService.proposalData = proposalData
    
    component.setOptInForPools(proposalData.enrollments);
    expect(component.proposalStoreService.showProposalSummary).toBe(true)
  });

  it('should call setOptInForPools partnerInfo: true', () => {
    // proposalData.enrollments[0]['optIn'] = true
     proposalData.enrollments[0].pools = [{optIn: false, suites: [{optIn: {optIn: false}}]}]
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.partnerInfo = {}
     component.setOptInForPools(proposalData.enrollments);
     expect(component.proposalStoreService.showProposalSummary).toBe(true)
   });

   it('should call checkForFutureConsumableItems ', () => {
    const setOptInForPools = jest.spyOn(component, 'setOptInForPools') 
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{enrollments: []}}
    //component.proposalStoreService.proposalData = {subscriptionInfo: {justification: 'test'}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));

    component.checkForFutureConsumableItems();
    expect(setOptInForPools).toHaveBeenCalled();
  });

  it('should call continue', () => {
    component.proposalStoreService.isReadOnly = true
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.status = 'COMPLETE'
     component.continue();
     expect(component.proposalStoreService.showPriceEstimate).toBe(false)
   });

   it('should call continue status: IN_PROGRESS', () => {
    component.proposalStoreService.isReadOnly = true
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.status = 'IN_PROGRESS'
     component.continue();
     expect(component.proposalStoreService.showProposalSummary).toBe(true)
   });


  it('should call viewEligibilityDetails', () => {
    const modalService = TestBed.get(NgbModal);

    const modalRef = modalService.open(EligibilityStatusComponent,{ windowClass: 'lg cust-elig' });
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    component.selectedEnrollmentArray = [{enrolled: true}]
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.viewEligibilityDetails();
    expect(open).toHaveBeenCalled()
  });

  it('should call enrollmentDetailsUpdated', () => {
    const displayGridForAllEnrollment = jest.spyOn(component, 'displayGridForAllEnrollment') 
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.status = 'IN_PROGRESS'
     component.priceEstimateStoreService.viewAllSelected = true
     const event = [{id: 1}]
     component.enrollmentDetailsUpdated(event);
     expect(displayGridForAllEnrollment).toHaveBeenCalled();
   });

   it('should call enrollmentDetailsUpdated viewAllSelected: false', () => {
    const displayGridForEnrollment = jest.spyOn(component, 'displayGridForEnrollment') 
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.status = 'IN_PROGRESS'
     component.priceEstimateStoreService.viewAllSelected = false
     const event = [{id: 1}]
     component.priceEstimateStoreService.selectedEnrollment = {id: 1}
     component.enrollmentDetailsUpdated(event);
     expect(displayGridForEnrollment).toHaveBeenCalled();
   });

   it('should call updateSuitesCount', () => {
     const enrollmentId = 1
     component.proposalStoreService.proposalData = proposalData
     component.proposalStoreService.proposalData.enrollments[0].commitInfo = {fcSuiteCount: 5, pcSuiteCount: 4}
     component.priceEstimateStoreService.viewAllSelected = false
     component.updateSuitesCount(enrollmentId);
     expect(component.proposalStoreService.proposalData.enrollments[0].commitInfo.fcSuiteCount).toBe(4);
   });

   it('should call closeDesiredQtyPopup', () => {
    const event = 1
    component.displayAutoSuggestionPopForSecurity = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.scopeInfo = {returningCustomer: false}
    component.proposalStoreService.proposalData.enrollments[0].commitInfo = {fcSuiteCount: 5, pcSuiteCount: 4}
    component.priceEstimateStoreService.viewAllSelected = false
    component.closeDesiredQtyPopup(event);
    expect(component.priceEstimateService.showDesriredQty).toBe(false);
  });

  it('should call openEditEnrollment', () => {
    component.proposalStoreService.proposalData = proposalData
    const enrollment = {id: 1}
    component.openEditEnrollment(enrollment);
    expect(component.priceEstimateService.showEnrollments).toBe(true);
  });
  //start with onRowSelected

  it('should call navigateToOWB', () => {
    window.open = function () { return window; }
    const  call = jest.spyOn(window, "open");
    component.navigateToOWB();
    expect(call).toHaveBeenCalled(); 
  });  

  it('should call openOfferModal', () => {
    component.proposalStoreService.projectStatus = 'COMPLETE'
    component.openOfferModal();
    expect(component.priceEstimateStoreService.showStrategicOffers).toBe(true); 
  });  

  it('should call howItWorks', () => {
    const response = {data: {redirectionUrl: 'test'}}
    window.open = function () { return window; }
    const  call = jest.spyOn(window, "open");
    //const response = {data:'',error:false}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.howItWorks();
    expect(call).toHaveBeenCalled();  
  });  

  it('should call routeToUrl', () => {
    const response = {data: {redirectionUrl: 'test'}}
    window.open = function () { return window; }
    const  call = jest.spyOn(window, "open");
    //const response = {data:'',error:false}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getEampApiCall").mockReturnValue(of(response));
    component.routeToUrl('123');
    expect(call).toHaveBeenCalled();  
  }); 
  
  it('should call showUpgradeSummary', () => {
    component.upgradedEnrollmentsArray = [{enrolled: true},{cxAttached: true}]
    const returnValue = component.showUpgradeSummary();
    expect(returnValue).toEqual(2);  
  });  

  it('should call openUpgradeSummary', () => {
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{enrollments:[{}]}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.openUpgradeSummary();
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  
  it('should call openUpgradeSummary upgrade/migrate', () => {
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.proposalStoreService.proposalData = proposalData
    const response = {    "data": {
  
      "enrollments": [
        {
            "id": 5,
            "name": "Services",
            "primary": false,
            "enrolled": true,
          
            "pools": [
                {
                    "name": "Security Platform & Response Services",
                    "desc": "Security Platform & Response Services",
                    "displaySeq": 7210,
                    "display": true,
                    "suites": [
                        {
                            "name": "Services: Cisco XDR - Essentials",
                            "desc": "Services: Cisco XDR - Essentials",
                            "ato": "E3-XDR-ESS-SVS3",
                            "autoSelected": false,
                            "displaySeq": 7100,
                            "tiers": [],
                            "displayGroup": false,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-XDR-ESS-SVS3",
                                "desc": "Services Tier 3"
                            },
                            "eligibleForUpgrade": true,
                            "migrated": true,
                            "migratedTo": {
                                "name": "Services: Security EA3.0 Breach Protection Essentials",
                                "desc": "Services: Security EA3.0 Breach Protection Essentials",
                                "ato": "E3-STE-BPE-SVS2",
                                "selectedTierDesc": "Services Tier 2",
                                "migrationType": "Full",
                                "tiers": [
                                    {
                                        "name": "E3-STE-BPE-SVS2",
                                        "desc": "Services Tier 2",
                                        "cxOptIn": false,
                                        "displaySeq": 6176
                                    },
                                    {
                                        "name": "E3-STE-BPE-SVS3",
                                        "desc": "Services Tier 3",
                                        "cxOptIn": false,
                                        "displaySeq": 6177
                                    }
                                ]
                            }
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Applications Services",
                    "desc": "Applications Services",
                    "displaySeq": 6150,
                    "display": true,
                    "suites": [
                        {
                            "name": "Services: AppDynamics IBL OnPrem",
                            "desc": "Services: AppDynamics IBL OnPrem",
                            "ato": "E3-APPD-IBLOP-SVS1",
                            "autoSelected": false,
                            "displaySeq": 6150,
                            "tiers": [],
                            "displayGroup": false,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-APPD-IBLOP-SVS1",
                                "desc": "Services Tier 1"
                            }
                        },
                        {
                            "name": "Services: AppDynamics IBL",
                            "desc": "Services: AppDynamics IBL",
                            "ato": "E3-APPD-IBL-SVS1",
                            "autoSelected": false,
                            "displaySeq": 6130,
                            "tiers": [],
                            "displayGroup": false,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-APPD-IBL-SVS1",
                                "desc": "Services Tier 1"
                            }
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Protection Solution Services",
                    "desc": "Protection Solution Services",
                    "displaySeq": 6204,
                    "display": true,
                    "suites": [
                        {
                            "name": "Services: Security EA3.0 Breach Protection Essentials",
                            "desc": "Services: Security EA3.0 Breach Protection Essentials",
                            "ato": "E3-STE-BPE-SVS2",
                            "inclusion": true,
                            "autoSelected": false,
                            "displaySeq": 6177,
                            "discount": {
                                "subsDisc": 0
                            },
                            "billingTerm": {
                                "rsd": "20240910",
                                "billingModel": "Prepaid",
                                "term": 35.6666666666667,
                                "coterm": {
                                    "endDate": "20270609",
                                    "subRefId": "SR202269",
                                    "billDayInMonth": -1
                                },
                                "eaEndDateStr": "20270809"
                            },
                            "commitInfo": {
                                "committed": false,
                                "fcSuiteCount": 0,
                                "pcSuiteCount": 0,
                                "overrideRequested": false,
                                "overrideEligible": false,
                                "overrideAllowed": false
                            },
                            "tiers": [
                                {
                                    "name": "E3-STE-BPE-SVS2",
                                    "desc": "Services Tier 2",
                                    "cxOptIn": false,
                                    "displaySeq": 6176
                                },
                                {
                                    "name": "E3-STE-BPE-SVS3",
                                    "desc": "Services Tier 3",
                                    "cxOptIn": false,
                                    "displaySeq": 6177
                                }
                            ],
                            "displayGroup": false,
                            "pids": [
                                {
                                    "name": "E3-CX-BPE-T2SC1",
                                    "desc": "SVCS Portfolio T2 Breach Ess SW Enhanced Service",
                                    "displaySeq": 1,
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
                                    "type": "CX_SOLUTION_SUPPORT",
                                    "typeDesc": "CX_SOLUTION_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-EAMSC",
                                    "desc": "SVCS Portfolio EA Management Service Cisco",
                                    "displaySeq": 2,
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
                                        {
                                            "qty": 1
                                        }
                                    ],
                                    "type": "CX_EAMS",
                                    "typeDesc": "CX_EAMS",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                }
                            ],
                            "priceInfo": {
                                "extendedList": 0,
                                "unitNet": 0,
                                "totalNet": 0,
                                "totalNetBeforeCredit": 0,
                                "totalSrvcNet": 0,
                                "totalSrvcNetBeforeCredit": 0
                            },
                            "ncPriceInfo": {
                                "extendedList": 0,
                                "unitNet": 0,
                                "totalNet": 0,
                                "totalNetBeforeCredit": 0
                            },
                            "disabled": false,
                            "active": true,
                            "cxOptIn": true,
                            "cxSelectedTier": "E3-STE-BPE-SVS2",
                            "cxHwSupportOptedOut": false,
                            "cxTierOptions": [],
                            "migration": false,
                            "displayDiscount": true,
                            "includedInEAID": false,
                            "consentRequired": false,
                            "cxHwSupportOnlySelected": false,
                            "netChangeInTotalNet": 0,
                            "upsell": true,
                            "relatedSwAto": "E3-SEC-S-BPE",
                            "migrated": true,
                            "migratedFrom": [
                                {
                                    "name": "E3-XDR-ESS-SVS3",
                                    "desc": "Services: Cisco XDR - Essentials",
                                    "ato": "E3-XDR-ESS-SVS3",
                                    "selectedTierDesc": "TIER 3",
                                    "migrationType": "Full"
                                }
                            ],
                            "subscriptionSourceAtoTcv": 0,
                            "atoTierOptions": [],
                            "atoTier": "E3-STE-BPE-SVS2"
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Cloud and Network Security Services",
                    "desc": "Cloud and Network Security Services",
                    "displaySeq": 6720,
                    "display": true,
                    "suites": [
                        {
                            "name": "Services: Cisco Secure Access Essential",
                            "desc": "Services: Cisco Secure Access Essential",
                            "ato": "E3-SECA-E-SVS2",
                            "autoSelected": false,
                            "displaySeq": 6652,
                            "tiers": [
                                {
                                    "name": "E3-SECA-E-SVS3",
                                    "desc": "Services Tier 3",
                                    "cxOptIn": false,
                                    "displaySeq": 6652
                                }
                            ],
                            "displayGroup": false,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-SECA-E-SVS2",
                                "desc": "Services Tier 2"
                            },
                            "eligibleForUpgrade": true
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Zero Trust Services",
                    "desc": "Zero Trust Services",
                    "displaySeq": 6550,
                    "display": true,
                    "suites": [
                        {
                            "name": "Services: Duo Advantage",
                            "desc": "Services: Duo Advantage",
                            "ato": "E3-DUO-ADV-SVS2",
                            "autoSelected": false,
                            "displaySeq": 6425,
                            "tiers": [
                                {
                                    "name": "E3-DUO-ADV-SVS3",
                                    "desc": "Services Tier 3",
                                    "cxOptIn": false,
                                    "displaySeq": 6425
                                }
                            ],
                            "displayGroup": false,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-DUO-ADV-SVS2",
                                "desc": "Services Tier 2"
                            },
                            "eligibleForUpgrade": true
                        },
                        {
                            "name": "Services: Identity Services Engine (ISE)",
                            "desc": "Services: Identity Services Engine (ISE)",
                            "ato": "E3-ISE-SVS3",
                            "inclusion": true,
                            "autoSelected": false,
                            "displaySeq": 6220,
                            "discount": {
                                "subsDisc": 30,
                                "servDisc": 30.00
                            },
                            "billingTerm": {
                                "rsd": "20240620",
                                "billingModel": "Prepaid",
                                "term": 35.6666666666667,
                                "coterm": {
                                    "endDate": "20270609",
                                    "subRefId": "SR202269",
                                    "billDayInMonth": -1
                                },
                                "eaEndDateStr": "20270519"
                            },
                            "commitInfo": {
                                "committed": false,
                                "fcSuiteCount": 0,
                                "pcSuiteCount": 0,
                                "overrideRequested": false,
                                "overrideEligible": false,
                                "overrideAllowed": false
                            },
                            "tiers": [
                                {
                                    "name": "E3-ISE-SVS3",
                                    "desc": "Services Tier 3",
                                    "cxOptIn": false,
                                    "displaySeq": 6220
                                }
                            ],
                            "displayGroup": false,
                            "pids": [
                                {
                                    "name": "E3-CX-ISE-T3S4P",
                                    "desc": "SVCS Portfolio T3 24x7x4 OS ISE Support",
                                    "displaySeq": 4,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3S2P",
                                    "desc": "SVCS Portfolio T3 24x7x2 ISE Support",
                                    "displaySeq": 7,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3C2P",
                                    "desc": "SVCS Portfolio T3 24x7x2 OS ISE Support",
                                    "displaySeq": 8,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3NCO",
                                    "desc": "SVCS Portfolio T3 8x7xNCD OS ISE Support",
                                    "displaySeq": 6,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3SWP",
                                    "desc": "SVCS Portfolio T3 ISE SWSS Premium SW Support – OnPrem",
                                    "displaySeq": 9,
                                    "discount": {
                                        "servDisc": 30,
                                        "unitNetDiscount": 30
                                    },
                                    "priceInfo": {
                                        "extendedList": 28533.33,
                                        "unitNet": 560,
                                        "totalNet": 19973.33,
                                        "totalNetBeforeCredit": 19973.33333333352
                                    },
                                    "ncPriceInfo": {
                                        "extendedList": 28533.33,
                                        "unitNet": 560,
                                        "totalNet": 19973.33,
                                        "totalNetBeforeCredit": 19973.33333333352
                                    },
                                    "dtls": [
                                        {
                                            "qty": 1
                                        }
                                    ],
                                    "type": "CX_SOLUTION_SUPPORT",
                                    "typeDesc": "CX_SOLUTION_SUPPORT",
                                    "discountDirty": false,
                                    "commitInfo": {
                                        "committed": false
                                    },
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3NT",
                                    "desc": "SVCS Portfolio T3 8x5xNBD ISE Support",
                                    "displaySeq": 1,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3NC",
                                    "desc": "SVCS Portfolio T3 8x7xNCD ISE Support",
                                    "displaySeq": 2,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3NP",
                                    "desc": "SVCS Portfolio T3 24x7x4 ISE Support",
                                    "displaySeq": 3,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-ISE-T3SCS",
                                    "desc": "SVCS Portfolio T3 8x5xNBD OS ISE Support",
                                    "displaySeq": 5,
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
                                    "typeDesc": "CX_HW_SUPPORT",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                },
                                {
                                    "name": "E3-CX-EAMSC",
                                    "desc": "SVCS Portfolio EA Management Service Cisco",
                                    "displaySeq": 10,
                                    "discount": {
                                        "servDisc": 30,
                                        "unitNetDiscount": 30
                                    },
                                    "priceInfo": {
                                        "extendedList": 0.00,
                                        "unitNet": 0,
                                        "totalNet": 0,
                                        "totalNetBeforeCredit": 0
                                    },
                                    "ncPriceInfo": {
                                        "extendedList": 0.00,
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
                                    "typeDesc": "CX_EAMS",
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": true
                                }
                            ],
                            "priceInfo": {
                                "extendedList": 28533.33,
                                "unitNet": 0,
                                "totalNet": 19973.33,
                                "totalNetBeforeCredit": 19973.33,
                                "totalSrvcNet": 19973.33,
                                "totalSrvcNetBeforeCredit": 19973.33333333352
                            },
                            "ncPriceInfo": {
                                "extendedList": 28533.33,
                                "unitNet": 0,
                                "totalNet": 19973.33,
                                "totalNetBeforeCredit": 19973.33
                            },
                            "disabled": false,
                            "active": true,
                            "cxOptIn": true,
                            "cxSelectedTier": "E3-ISE-SVS3",
                            "cxHwSupportOptedOut": true,
                            "cxTierOptions": [],
                            "migration": false,
                            "type": "CX_SOLUTION_SUPPORT",
                            "displayDiscount": true,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "cxHwSupportOnlySelected": false,
                            "lowerTierAto": {
                                "name": "E3-ISE-SVS2",
                                "desc": "Services Tier 2",
                                "priceInfo": {
                                    "extendedList": 17120,
                                    "unitNet": 0,
                                    "originalExtendedList": 0,
                                    "originalUnitList": 0,
                                    "totalNet": 11984,
                                    "totalNetBeforeCredit": 11984,
                                    "totalNetAfterIBCredit": 0,
                                    "unitListMRC": 0,
                                    "unitNetMRC": 0,
                                    "listPrice": 0
                                }
                            },
                            "netChangeInTotalNet": 7989.33,
                            "upsell": true,
                            "relatedSwAto": "E3-SEC-ISE",
                            "cxUpgradeType": "SSPT_TO_SSPT",
                            "eligibleForUpgrade": true,
                            "upgraded": true,
                            "atoTierOptions": [],
                            "atoTier": "E3-ISE-SVS3"
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                }
            ],
            "priceInfo": {
                "extendedList": 28533.33,
                "unitNet": 0,
                "totalNet": 19973.33,
                "totalNetBeforeCredit": 19973.33,
                "purchaseAdjustment": 0,
                "totalSrvcNet": 19973.33,
                "totalSrvcNetBeforeCredit": 19973.33333333352
            },
            "ncPriceInfo": {
                "extendedList": 28533.33,
                "unitNet": 0,
                "totalNet": 19973.33,
                "totalNetBeforeCredit": 19973.33
            },
            "disabled": false,
            "includedInEAID": true,
            "active": true,
            "externalConfiguration": false,
            "cxOptInAllowed": false,
            "cxAttached": true,
            "service": true,
            "eamsDelivery": {
                "partnerDeliverySelected": false
            },
            "awaitingResponse": false,
            "lineInError": false,
            "discountCascadePending": false,
            "hwSupportLinesState": "IN_SYNC",
            "hardwareLinePricesInSync": true,
            "cxSoftwareSupportOnly": true,
            "disableRsdAndTermUpdate": false,
            "includedInSubscription": true,
            "ibAssementRequiredForCxUpgradeType": false,
            "embeddedHwSupportAttached": false,
            "eligibleForMigration": true,
            "eligibleForUpgrade": false
        },
        {
            "id": 3,
            "name": "Security",
            "primary": false,
            "enrolled": true,
            "displayQnA": true,
            "displaySeq": 4,
            "noRenewalBillToOrAttachRate": false,
          
            "pools": [
                {
                    "name": "Security Platform and Response",
                    "desc": "Security Platform and Response",
                    "displaySeq": 8365,
                    "display": true,
                    "suites": [
                        {
                            "name": "Cisco XDR",
                            "desc": "Cisco XDR",
                            "ato": "E3-SEC-XDR-E",
                            "autoSelected": false,
                            "displaySeq": 8320,
                            "tiers": [
                                {
                                    "name": "E3-SEC-XDR-P",
                                    "desc": "Premier",
                                    "cxOptIn": false,
                                    "displaySeq": 8320
                                },
                                {
                                    "name": "E3-SEC-XDR-A",
                                    "desc": "Advantage",
                                    "cxOptIn": false,
                                    "displaySeq": 8210
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
                            "migrated": true,
                            "migratedTo": {
                                "name": "Breach Protection",
                                "desc": "Breach Protection",
                                "ato": "E3-SEC-S-BPE",
                                "selectedTierDesc": "Essentials",
                                "migrationType": "Full",
                                "mappingType": [
                                    "Full"
                                ],
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
                                "incompatibleSuites": [
                                    "User & Breach Protection (Combination)",
                                    "Cisco XDR",
                                    "Cisco Email Threat Defense",
                                    "User Protection",
                                    "Secure Endpoint"
                                ]
                            },
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
                            "hasSwRelatedCxUpgraded": false
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Zero Trust",
                    "desc": "Zero Trust",
                    "displaySeq": 4300,
                    "display": true,
                    "suites": [
                        {
                            "name": "Duo",
                            "desc": "Duo",
                            "ato": "E3-SEC-DUOFA",
                            "inclusion": true,
                            "autoSelected": false,
                            "displaySeq": 4295,
                            "discount": {
                                "subsDisc": 20,
                                "servDisc": 20.00,
                                "multiProgramDesc": {
                                    "msd": 10.0,
                                    "mpd": 0.0,
                                    "med": 0.0,
                                    "bundleDiscount": 10,
                                    "strategicOfferDiscount": 0.0
                                }
                            },
                            "billingTerm": {
                                "rsd": "20240910",
                                "billingModel": "Prepaid",
                                "term": 35.6666666666667,
                                "coterm": {
                                    "endDate": "20270609",
                                    "subRefId": "SR202269",
                                    "billDayInMonth": -1
                                },
                                "eaEndDateStr": "20270809"
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
                            "groups": [
                                {
                                    "id": "Others",
                                    "name": "Others",
                                    "displaySeq": 2147483647
                                },
                                {
                                    "id": "Duo Subaccount",
                                    "name": "Duo Subaccount",
                                    "displaySeq": 2
                                },
                                {
                                    "id": "Duo Federal",
                                    "name": "Duo Federal",
                                    "displaySeq": 1
                                },
                                {
                                    "id": "Support Options",
                                    "name": "Support Options",
                                    "displaySeq": 3
                                }
                            ],
                            "tiers": [
                                {
                                    "name": "E3-SEC-DUO-PRE",
                                    "desc": "Premier",
                                    "cxOptIn": false,
                                    "displaySeq": 4240
                                },
                                {
                                    "name": "E3-SEC-DUOFA",
                                    "desc": "Federal Adv",
                                    "cxOptIn": false,
                                    "displaySeq": 3001
                                }
                            ],
                            "displayGroup": true,
                            "credit": {
                                "perpetual": 10.7,
                                "residual": 10.7,
                                "credits": [
                                    {
                                        "code": "CR-PRIO-200405-10924",
                                        "type": "AmortizedMonthly",
                                        "name": "Prior Purchase Subscription Residual",
                                        "category": "EA_Residual",
                                        "totalCredit": 10.7,
                                        "monthlyCredit": 0.3,
                                        "nonL2NCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                                        "rampName": "EA_Residual",
                                        "display": true,
                                        "hideDelete": false,
                                        "rampCredit": false
                                    }
                                ]
                            },
                            "pids": [
                                {
                                    "name": "E3S-DUO-F-AD",
                                    "desc": "Duo Fed Advantage",
                                    "displaySeq": 1,
                                    "groupId": "Duo Federal",
                                    "discount": {
                                        "servDisc": 20,
                                        "unitNetDiscount": 20
                                    },
                                    "priceInfo": {
                                        "extendedList": 182018.89,
                                        "unitNet": 48.99,
                                        "totalNet": 145598.47,
                                        "totalNetBeforeCredit": 145609.16666665578,
                                        "purchaseAdjustment": 10.7
                                    },
                                    "ncPriceInfo": {
                                        "extendedList": 202230.00,
                                        "unitNet": 54.43,
                                        "totalNet": 161778.06,
                                        "totalNetBeforeCredit": 161778.05555554346,
                                        "purchaseAdjustment": 10.7
                                    },
                                    "credit": {
                                        "perpetual": 10.7,
                                        "residual": 10.7,
                                        "credits": [
                                            {
                                                "code": "CR-PRIO-200405-10924",
                                                "type": "AmortizedMonthly",
                                                "name": "Prior Purchase Subscription Residual",
                                                "category": "EA_Residual",
                                                "totalCredit": 10.7,
                                                "monthlyCredit": 0.3,
                                                "nonL2NCreditType": "SUBSCRIPTION_RESISDUAL_CREDIT",
                                                "rampName": "EA_Residual",
                                                "display": true,
                                                "hideDelete": false,
                                                "rampCredit": false
                                            }
                                        ]
                                    },
                                    "dtls": [
                                        {
                                            "qty": 1000,
                                            "totalConsumedQty": 1000,
                                            "lowerTierPidTotalQty": 1000,
                                            "minQty": 1000
                                        }
                                    ],
                                    "type": "SUBSCRIPTION",
                                    "typeDesc": "Subscription",
                                    "typeDisplaySeq": 12,
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": false
                                },
                                {
                                    "name": "E3S-DUO-FA-SACC",
                                    "desc": "Duo Fed Advantage Subaccount",
                                    "displaySeq": 1,
                                    "groupId": "Duo Subaccount",
                                    "discount": {
                                        "servDisc": 20,
                                        "unitNetDiscount": 20
                                    },
                                    "priceInfo": {
                                        "extendedList": 0.00,
                                        "unitNet": 0,
                                        "totalNet": 0,
                                        "totalNetBeforeCredit": 0
                                    },
                                    "ncPriceInfo": {
                                        "extendedList": 0.00,
                                        "unitNet": 0,
                                        "totalNet": 0,
                                        "totalNetBeforeCredit": 0
                                    },
                                    "dtls": [
                                        {
                                            "qty": 1,
                                            "totalConsumedQty": 1,
                                            "lowerTierPidTotalQty": 1,
                                            "minQty": 1
                                        }
                                    ],
                                    "type": "SUBSCRIPTION",
                                    "typeDesc": "Subscription",
                                    "typeDisplaySeq": 12,
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": false
                                },
                                {
                                    "name": "SVS-E3-DUOF-B",
                                    "desc": "Basic Software Support for Duo",
                                    "displaySeq": 1,
                                    "groupId": "Support Options",
                                    "dtls": [
                                        {}
                                    ],
                                    "type": "SERVICE",
                                    "typeDesc": "Service",
                                    "typeDisplaySeq": 13,
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": false
                                }
                            ],
                            "priceInfo": {
                                "extendedList": 182018.89,
                                "unitNet": 0,
                                "totalNet": 145598.47,
                                "totalNetBeforeCredit": 145609.17,
                                "purchaseAdjustment": 10.7,
                                "totalSwNet": 145598.47,
                                "totalSwNetBeforeCredit": 145609.16666665578
                            },
                            "ncPriceInfo": {
                                "extendedList": 202230,
                                "unitNet": 0,
                                "totalNet": 161778.06,
                                "totalNetBeforeCredit": 161778.06,
                                "purchaseAdjustment": 10.7
                            },
                            "disabled": false,
                            "notAllowedHybridRelated": false,
                            "hasBfRelatedMigratedAto": false,
                            "active": true,
                            "cxOptIn": false,
                            "migration": false,
                            "displayDiscount": true,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "qualifiesForHigherScuRange": false,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-SEC-DUO-ADV",
                                "desc": "Advantage",
                                "priceInfo": {
                                    "extendedList": 182018.89,
                                    "unitNet": 0,
                                    "originalExtendedList": 0,
                                    "originalUnitList": 0,
                                    "totalNet": 145609.17,
                                    "totalNetBeforeCredit": 145609.17,
                                    "totalNetAfterIBCredit": 0,
                                    "unitListMRC": 0,
                                    "unitNetMRC": 0,
                                    "listPrice": 0
                                }
                            },
                            "netChangeInTotalNet": -10.70,
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
                            "upgraded": true,
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
                            "hasSwRelatedCxUpgraded": false
                        },
                        {
                            "name": "Identity Services Engine (ISE)",
                            "desc": "Identity Services Engine (ISE)",
                            "ato": "E3-SEC-ISE",
                            "autoSelected": false,
                            "displaySeq": 4100,
                            "displayGroup": true,
                            "disabled": true,
                            "active": true,
                            "cxOptIn": false,
                            "displayDiscount": false,
                            "includedInEAID": true,
                            "includedInSubscription": true,
                            "consentRequired": false,
                            "lowerTierAto": {
                                "name": "E3-SEC-ISE"
                            },
                            "hasSwRelatedCxUpgraded": true
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Protection",
                    "desc": "Protection",
                    "displaySeq": 4087,
                    "display": true,
                    "suites": [
                        {
                            "name": "Breach Protection",
                            "desc": "Breach Protection",
                            "ato": "E3-SEC-S-BPE",
                            "inclusion": true,
                            "autoSelected": false,
                            "displaySeq": 4046,
                            "discount": {},
                            "billingTerm": {
                                "rsd": "20240910",
                                "billingModel": "Prepaid",
                                "term": 35.6666666666667,
                                "coterm": {
                                    "endDate": "20270609",
                                    "subRefId": "SR202269",
                                    "billDayInMonth": -1
                                },
                                "eaEndDateStr": "20270809"
                            },
                            "qtyUnit": "User",
                            "commitInfo": {
                                "committed": false,
                                "fcSuiteCount": 0,
                                "pcSuiteCount": 0,
                                "overrideRequested": false,
                                "overrideEligible": false,
                                "overrideAllowed": false,
                                "qtyThreshold": {
                                    "required": 1000
                                }
                            },
                            "groups": [
                                {
                                    "id": "Breach Protection Essentials",
                                    "name": "Breach Protection Essentials",
                                    "displaySeq": 1
                                }
                            ],
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
                            "pids": [
                                {
                                    "name": "E3S-SS-BPE",
                                    "desc": "Security Breach Protection Essentials",
                                    "displaySeq": 1,
                                    "groupId": "Breach Protection Essentials",
                                    "dtls": [
                                        {}
                                    ],
                                    "type": "SUBSCRIPTION",
                                    "typeDesc": "Subscription",
                                    "typeDisplaySeq": 12,
                                    "discountDirty": false,
                                    "disableForRTU": false,
                                    "supportPid": false
                                }
                            ],
                            "disabled": false,
                            "active": true,
                            "cxOptIn": false,
                            "serviceAttachMandatory": true,
                            "migration": false,
                            "displayDiscount": true,
                            "includedInEAID": false,
                            "qualifiesForHigherScuRange": false,
                            "consentRequired": false,
                            "incompatibleAtos": [
                                "E3-SEC-S-BPP",
                                "E3-SEC-S-BPEUPE",
                                "E3-SEC-S-BPA",
                                "E3-SEC-S-BPAUPE",
                                "E3-SEC-S-BPEUPA",
                                "E3-SEC-S-BPAUPA"
                            ],
                            "incompatibleSuites": [
                                "User & Breach Protection (Combination)",
                                "Cisco XDR",
                                "Cisco Email Threat Defense",
                                "User Protection",
                                "Secure Endpoint"
                            ],
                            "alreadySelectedIncompatibleSuites": [
                                "Cisco XDR"
                            ],
                            "migrated": true,
                            "migratedFrom": [
                                {
                                    "name": "E3-SEC-XDR-E",
                                    "desc": "Cisco XDR",
                                    "ato": "E3-SEC-XDR-E",
                                    "migrationType": "Full"
                                }
                            ],
                            "subscriptionSourceAtoTcv": 144539.17
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                },
                {
                    "name": "Cloud and Network Security",
                    "desc": "Cloud and Network Security",
                    "displaySeq": 4800,
                    "display": true,
                    "suites": [
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
                                "desc": "Essentials"
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
                            "hasSwRelatedCxUpgraded": false
                        }
                    ],
                    "selectedMerakiSuites": [],
                    "selectedBonfireSuites": []
                }
            ],
            "priceInfo": {
                "extendedList": 182018.89,
                "unitNet": 0,
                "totalNet": 145598.47,
                "totalNetBeforeCredit": 145609.17,
                "purchaseAdjustment": 10.7,
                "totalSwNet": 145598.47,
                "totalSwNetBeforeCredit": 145609.16666665578
            },
            "ncPriceInfo": {
                "extendedList": 202230,
                "unitNet": 0,
                "totalNet": 161778.06,
                "totalNetBeforeCredit": 161778.06
            },
            "disabled": false,
            "includedInEAID": true,
            "active": true,
            "externalConfiguration": false,
            "cxOptInAllowed": true,
            "cxAttached": true,
            "service": false,
            "securityTier": "TIER_3",
            "disableRsdAndTermUpdate": false,
            "includedInSubscription": true,
            "embeddedHwSupportAttached": false,
            "eligibleForMigration": true,
            "eligibleForUpgrade": false
        }
    ]
  }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.openUpgradeSummary();
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  

  it('should call requestDocuments', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(RequestDocumentsComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.requestDocuments();
    expect(open).toHaveBeenCalled();  
  }); 

  it('should call closeStrategicOffer', () => {
    component.priceEstimateStoreService.displayCxGrid = true
    component.proposalStoreService.proposalData = proposalData
    component.closeStrategicOffer('');
    expect(component.priceEstimateStoreService.showStrategicOffers).toBe(false);  
  });

  it('should call displayConsumablePopup', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(FutureConsumableItemsComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.displayConsumablePopup([]);
    expect(open).toHaveBeenCalled();  
  }); 

  it('should call openApplyDiscountModal', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(ApplyDiscountComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openApplyDiscountModal();
    expect(open).toHaveBeenCalled();  
  }); 
  it('should call applyDiscountApiCall', () => {

    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.applyDiscountApiCall({},5);
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  

  it('should call applyDiscount', () => {

    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.applyDiscount();
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  
  it('should call applyDiscount NPI_AUTOMATION_REL', () => {
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.applyDiscount();
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  

  it('should call suiteCell', () => {
    const param = {node:  {level: 0}}
    const returnValue = component.suiteCell(param);
    expect(returnValue).toEqual('hideExpand'); 
  });  
  it('should call displaySuiteCheckbox', () => {
    const param = {node:  {level: 1}}
    const returnValue = component.displaySuiteCheckbox(param);
    expect(returnValue).toBe(true); 
  });  

  it('should call desiredCellClass', () => {
    const param = {data:{},value:0,node:  {level: 2,}}
    const returnValue = component.desiredCellClass(param);
    expect(returnValue).toEqual('num-value'); 
  });  
  it('should call desiredCellClass', () => {
    const param = {data:{},value:0,node:  {level: 1,}}
    const returnValue = component.desiredCellClass(param);
    expect(returnValue).toEqual('num-value no-edit'); 
  });  
  it('should call onHeaderClick verage-discount', () => {
    const event = {target:{classList:{value:'average-discount softwarePaBreakup tcvBreakup'}},value:0,node:  {level: 1,}}
    component.onHeaderClick(event);
    expect(component.priceEstimateService.showPurchaseAdjustmentBreakUp).toBe(true); 
  });
  
  it('should call onHeaderClick softwarePaBreakup', () => {
    const event = {target:{classList:{value:'softwarePaBreakup tcvBreakup'}},value:0,node:  {level: 1,}}
    component.onHeaderClick(event);
    expect(component.priceEstimateService.showPurchaseAdjustmentBreakUp).toBe(true); 
  });
  it('should call onHeaderClick tcvBreakup', () => {
    const event = {target:{classList:{value:' tcvBreakup'}},value:0,node:  {level: 1,}}
    component.onHeaderClick(event);
    expect(component.priceEstimateService.showTcvBreakUp).toBe(true); 
  });

  it('should call getNodeChildDetails', () => {
    const event = {childs:[{}]}
    const returnValue = component.getNodeChildDetails(event);
    expect(returnValue.group).toBe(true); 
  });

  it('should call getNodeChildDetails', () => {
    const event = {childs:[]}
    const returnValue = component.getNodeChildDetails(event);
    expect(returnValue).toBe(null); 
  });

  it('should call checkForSto', () => {
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkForSto();
    expect(component.priceEstimateService.showEnrollments).toBe(false); 
  });  

  it('should call onEnrollmentDeselection', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));

    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(UnenrollConfirmationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.onEnrollmentDeselection(proposalData.enrollments[0]);
    expect(open).toHaveBeenCalled();  
  }); 


  it('should call onEnrollmentDeselection e= 6', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    proposalData.enrollments[0].id=6
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData}}

    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));

    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(UnenrollConfirmationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.onEnrollmentDeselection(proposalData.enrollments[0]);
    expect(open).toHaveBeenCalled();  
  }); 

  it('should call closeUpdateIbDropDown', () => {
    component.closeUpdateIbDropDown();
    expect(component.openUpdateIbDrop).toBe(false);  
  }); 
  it('should call openUpdateIbDropDown', () => {
    component.openUpdateIbDropDown();
    expect(component.openUpdateIbDrop).toBe(true);  
  }); 
  it('should call checkIfLastRepullPassed24Hrs', () => {
    const returnValue =  component.checkIfLastRepullPassed24Hrs();
    expect(returnValue).toBe(false);  
  }); 
  it('should call closeIbPullMsg', () => {
    component.closeIbPullMsg();
    expect(component.showIbPullMsg).toBe(false);  
  }); 
  it('should call callIbReprocessOptimization reprocessIb: true', () => {
    component.callIbReprocessOptimization(true);
   // expect(component.showIbPullMsg).toBe(false);  
  });
  it('should call callIbReprocessOptimization reprocessIb: false e=5', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.priceEstimateStoreService.selectedEnrollment = {id: 5,cxAttached: true}
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.enrollments[0].id = 5
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
    expect(component.priceEstimateStoreService.displayReprocessIB).toBe(false);  
  }); 
  it('should call callIbReprocessOptimization ibPullLimitReached: true ', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.priceEstimateStoreService.selectedEnrollment = {id: 5,cxAttached: true}
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.enrollments[0].id = 5
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],ibPullLimitReached: true,proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
    expect(component.ibQuantityPopup).toBe(true);  
  }); 

  it('should call callIbReprocessOptimization reprocessIb: false e=5cxAttached false', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.priceEstimateStoreService.selectedEnrollment = {id: 5,cxAttached: false}
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.enrollments[0].id = 5
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
    expect(component.priceEstimateStoreService.displayReprocessIB).toBe(true);
  }); 
  it('should call callIbReprocessOptimization reprocessIb: false e=1', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.priceEstimateStoreService.selectedEnrollment = {id: 1,cxAttached:true}
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.enrollments[0].id = 1
    component.proposalStoreService.proposalData.enrollments[0].embeddedHwSupportAttached = true
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
    expect(component.priceEstimateStoreService.displayReprocessIB).toBe(false);
  }); 
  it('should call callIbReprocessOptimization reprocessIb: false e=1 flag false', () => {
    
    component.priceEstimateStoreService.selectedEnrollment = {id: 1,cxAttached:true}
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.enrollments[0].id = 1
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.callIbReprocessOptimization(false);
    expect(component.priceEstimateStoreService.displayReprocessIB).toBe(false); 
  }); 

  it('should call reProcessIbPull', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    response.data.enrollments[0].id = 1
    response.data.enrollments[1].id = 5
    component.priceEstimateStoreService.selectedEnrollment = {id:1,cxAttached:true}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.reProcessIbPull();
    expect(component.showIbPullMsg).toBe(true);  
  });
  it('should call reProcessIbPull 1', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{ibPullLimitReached:true,proposal:{syncStatus:true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.reProcessIbPull();
    expect(component.showIbPullMsg).toBe(true);  
  }); 
  it('should call reProcessIbPull 2', () => {
    component.eaService.features.IB_OPTIMIZATION = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.syncStatus = {}
    const response = {data:{ibPullLimitReached:true,proposal:{syncStatus:true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.reProcessIbPull();
    expect(component.showIbPullMsg).toBe(true);  
  });
  it('should call reProcessIbPull 3', () => {
    component.proposalStoreService.isPartnerAccessingSfdcDeal = true

    component.reProcessIbPull();
    expect(component.showIbPullMsg).toBe(true);  
  }); 
  it('should call reProcessIbPull 4', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.syncStatus = {}
    
    const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
    response.data.enrollments[0].id = 1
    response.data.enrollments[1].id = 5
    component.priceEstimateStoreService.selectedEnrollment = {id:1,cxAttached:false}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.reProcessIbPull();
    expect(component.showIbPullMsg).toBe(true);  
  });
    it('call onEnrollmentSelection enrolled: true for hybrid', () => {
    component.selectedEnrollmentArray = []
    const response = propsoalResponse
    component.eaService.isUpgradeFlow = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.upgradedEnrollmentsArray = [{id:'1'}]
    component.proposalStoreService.proposalData = proposalData
    const enrolemnt = {enrolled: false, primary: false, id: 2, displayQnA: true,priceInfo:{}}
    //component.priceEstimateStoreService.hybridSuiteUpdated = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.onEnrollmentSelection(enrolemnt);
    
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('should call onEnrollmentDeselection 1', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    proposalData.enrollments[0].id=3
    proposalData.enrollments[0].primary=false
    component.priceEstimateStoreService.viewAllSelected = true
    component.proposalStoreService.proposalData = proposalData
    const response = {data:{proposal:proposalData}}
    component.selectedEnrollmentArray = [{},{}]
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));

    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(UnenrollConfirmationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.onEnrollmentDeselection(proposalData.enrollments[0]);
    expect(open).toHaveBeenCalled();  
  });
  it('should call onEnrollmentDeselection 2', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    proposalData.enrollments[0].id=2
    proposalData.enrollments[0].primary=false
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.priceEstimateStoreService.selectedEnrollment.id = 2
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.isSplunkSuitesAdded = true
    const response = {data:{proposal:proposalData}}
    component.selectedEnrollmentArray = [{},{}]
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));

    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(UnenrollConfirmationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.onEnrollmentDeselection(proposalData.enrollments[0]);
    expect(open).toHaveBeenCalled();  
  }); 
  it('should call onEnrollmentDeselection 3', () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    proposalData.enrollments[0].id=3
    proposalData.enrollments[0].primary=false
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.priceEstimateStoreService.selectedEnrollment.id = 2
    component.proposalStoreService.proposalData = proposalData
    component.proposalStoreService.proposalData.isSplunkSuitesAdded = true
    const response = {data:{proposal:proposalData}}
    component.selectedEnrollmentArray = [{},{}]
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));

    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(UnenrollConfirmationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.onEnrollmentDeselection(proposalData.enrollments[0]);
    expect(open).toHaveBeenCalled();  
  }); 

  it('call setGridData 1',  fakeAsync(() => {
    component.priceEstimateStoreService.selectedEnrollment.id = 3
    component.priceEstimateStoreService.selectedEnrollment.securityTier = 'TIER_0'
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateService.showPurchaseAdj = true
    component.priceEstimateService.isMerakiSuitesPresent = true
    component.proposalStoreService.isPaApproverComingFromSummary = true
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    response.data.enrollments[0].pools[0].suites[0].ato = 'E3-N-MRNI'
    component.setGridData(response.data);  
    tick(350);
    expect(component.isDnxSuiteAdded).toBe(false);
    flush();  
  }));
  it('call setEnrollmentData 1',() => {
    proposalData['changeSubDeal'] = true
    component.proposalStoreService.proposalData = proposalData
    proposalData.enrollments[0]['suitesNotAvailableForMigration'] = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.COTERM_SEPT_REL = true
    component.eaService.isUpgradeFlow = true
    component.proposalStoreService.proposalData.dealInfo = {subscriptionUpgradeDeal: true}
    component.priceEstimateService.isMerakiSuitesPresent = true
    component.proposalStoreService.isPaApproverComingFromSummary = true
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    component.setEnrollmentData(response, true);  
    expect(component.displayMigrationReasonMsg).toBe(true);
  });
  it('call setSelectedEnrollmentData 1',() => {
    proposalData.enrollments[0]['porConsentNeeded'] = true
    proposalData.enrollments[0]['locked'] = true
    proposalData.enrollments[0]['primary'] = false
    proposalData.enrollments[0]['disabled'] = false
    proposalData.enrollments[0]['enrolled'] = true
    proposalData.enrollments[0].id = 6
    component.punchInEnrollmentId = 6
    component.proposalStoreService.proposalData = proposalData
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.priceEstimateStoreService.viewAllSelected = false
    component.proposalStoreService.editProposalParamter = true
    component.eaService.features.COTERM_SEPT_REL = true
    component.selectedEnrollmentArray = [{}]
    component.setSelectedEnrollmentData();  
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it('call setSelectedEnrollmentData 3',() => {
    proposalData.enrollments[0]['porConsentNeeded'] = true
    proposalData.enrollments[0]['locked'] = true
    proposalData.enrollments[0]['primary'] = false
    proposalData.enrollments[0]['disabled'] = false
    proposalData.enrollments[0]['enrolled'] = true
    proposalData.enrollments[0].id = 6
    component.punchInEnrollmentId = 6
    component.proposalStoreService.proposalData = proposalData
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.priceEstimateStoreService.viewAllSelected = true
    component.proposalStoreService.editProposalParamter = true
    component.eaService.features.COTERM_SEPT_REL = true
    component.selectedEnrollmentArray = [{}]
    component.setSelectedEnrollmentData();  
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it('call setSelectedEnrollmentData 2',() => {
    proposalData.enrollments[0]['porConsentNeeded'] = true
    proposalData.enrollments[0]['locked'] = true
    proposalData.enrollments[0]['primary'] = false
    proposalData.enrollments[0]['disabled'] = false
    proposalData.enrollments[0]['enrolled'] = true
    proposalData.enrollments[0].id = 3
    component.priceEstimateStoreService.viewAllSelected = true
    component.punchInEnrollmentId = 6
    component.proposalStoreService.proposalData = proposalData
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.COTERM_SEPT_REL = true
    component.selectedEnrollmentArray = [{}]
    component.proposalStoreService.editProposalParamter = false
    component.setSelectedEnrollmentData();  
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it('call invokePollerService 1', () => {
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateStoreService.selectedEnrollment = {id: 3} 
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    response.data.enrollments[0].id = 5
    response.data.proposal['syncStatus'] = {cxCcwrRipFlag: true}
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
   // expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })


  it('call invokePollerService IB_OPTIMIZATION & FIRESTORM_REL', () => {
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateStoreService.selectedEnrollment = {id: 1} 
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    
    component.eaService.features.IB_OPTIMIZATION = true
    component.eaService.features.FIRESTORM_REL = true
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
   // expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })

  it('call invokePollerService FIRESTORM_REL', () => {
    component.proposalStoreService.proposalData = proposalData
    component.priceEstimateStoreService.selectedEnrollment = {id: 1} 
    const response = {data:{proposal:proposalData,enrollments:proposalData.enrollments}}
    //component.eaService.features.IB_OPTIMIZATION = true
    component.eaService.features.FIRESTORM_REL = true
    let priceEstimationPollerService = fixture.debugElement.injector.get(PriceEstimationPollerService);
    jest.spyOn(priceEstimationPollerService, "invokeGetPollerservice").mockReturnValue(of(response));
    component.invokePollerService();
    //expect(component.priceEstimateStoreService.selectedCxEnrollment).toBe(response.data.enrollments[0]);
  })
  it('should call goToTroubleShooting', () => {
    window.open = function () { return window; }
    const  call = jest.spyOn(window, "open");
    component.goToTroubleShooting();
    expect(call).toHaveBeenCalled();  
  });  
  it('should call invokePollerServiceForSwOnly', () => {
    const  call = jest.spyOn(component, "invokePollerServiceForSwOnly");
    component.invokePollerServiceForSwOnly({});
    expect(call).toHaveBeenCalled();  
  }); 
  it('should call desiredQtyRender', () => {
    const param = {data:{supportPid:true,enrollmentId:2,}}
    const returnValue = component.desiredQtyRender(param);
    expect(returnValue).toEqual('');  
  }); 
  it('should call desiredQtyRender 1', () => {
    const param = {data:{supportPid:true,enrollmentId:2,desiredQty:3}}
    const returnValue = component.desiredQtyRender(param);
    expect(returnValue).toEqual('<span class="selected-cell-with-tick"><span class="icon-tick-01 mr-2"></span><span>Selected</span></span>');  
  });  
  it('should call desiredQtyRender 2', () => {
    const param = {data:{supportPid:true,enrollmentId:5,desiredQty:3,node:{level:1}}}
    const returnValue = component.desiredQtyRender(param);
    expect(returnValue).toEqual('');  
  });  
  it("should call onCellMouseOver", () => {
    const event = {
      node:{level:1,allLeafChildren:[{}]},
      event:{target:{classList:{value:'configure-link'}}}
    }

    component.onCellMouseOver(event);
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it("should call onCellMouseOut", () => {
    const event = {
      node:{level:1,allLeafChildren:[{}]},
      event:{target:{classList:{value:'configure-link'}}}
    }

    component.onCellMouseOut(event);
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it("should call disableLastSelectedSuite", () => {
    component.numberofSelectedSuite = 1
    component.disableLastSelectedSuite();
    expect(component.displayMigrationReasonMsg).toBe(false);
  });

  it("should call onRowSelected", () => {
    component.priceEstimateService.enableSuiteInclusionExclusion = true
    const event = {
      node:{level:1},
      data:{enrollmentId:1,ato:'test',selected:true}
    }
    component.onRowSelected(event);
    expect(component.displayMigrationReasonMsg).toBe(false);
  });
  it("should call onRowSelected 1", () => {
    component.priceEstimateService.enableSuiteInclusionExclusion = true
    const event = {
      node:{level:1,selected:true},
      data:{enrollmentId:1,ato:'test',selected:true}
    }
    component.onRowSelected(event);
    expect(component.displayMigrationReasonMsg).toBe(false);
  });

});