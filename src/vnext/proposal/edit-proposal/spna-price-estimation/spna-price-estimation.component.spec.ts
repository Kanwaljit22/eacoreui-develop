import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
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
import { PriceEstimateStoreService } from '../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../price-estimation/price-estimate.service';
import { PriceEstimationPollerService } from '../price-estimation/price-estimation-poller.service';import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { SpnaPriceEstimationComponent } from './spna-price-estimation.component';
import { QuestionnaireService } from '../price-estimation/questionnaire/questionnaire.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EnagageSupportTeamComponent } from 'vnext/modals/enagage-support-team/enagage-support-team.component';
import { AddSecurityServiceEnrollComponent } from 'vnext/modals/add-security-service-enroll/add-security-service-enroll.component';
import { ManageTeamComponent } from 'vnext/modals/manage-team/manage-team.component';
import { EligibilityStatusComponent } from 'vnext/modals/eligibility-status/eligibility-status.component';
import { PriceEstimationComponent } from '../price-estimation/price-estimation.component';
import { UnenrollConfirmationComponent } from 'vnext/modals/unenroll-confirmation/unenroll-confirmation.component';
import { RequestDocumentsComponent } from 'vnext/modals/request-documents/request-documents.component';
import { FutureConsumableItemsComponent } from 'vnext/modals/future-consumable-items/future-consumable-items.component';
import { ApplyDiscountComponent } from 'vnext/modals/apply-discount/apply-discount.component';

class MockProposalRestService {
  getApiCall() {
    return of({
      data: {}
    });
  }
  deleteApiCall(){
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



describe('SpnaPriceEstimationComponent', () => {
  let component: SpnaPriceEstimationComponent;
  let fixture: ComponentFixture<SpnaPriceEstimationComponent>;

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
          ProposalStoreService, PriceEstimateStoreService, UtilitiesService, 
         VnextService, VnextStoreService, QuestionnaireService, DataIdConstantsService,
        PriceEstimationPollerService,EaStoreService  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaPriceEstimationComponent);
    component = fixture.componentInstance;
    component.proposalStoreService.proposalData = proposalData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit method', () => {
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
  // it('call selectEnrollment method enrolled: true', () => {
  //   const enrolemnt = {enrolled: true, displayQnA: true}
  //   component.selectEnrollment(enrolemnt);
  //   expect(component.priceEstimateStoreService.openAddSuites).toBeTruthy();
  // });

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
    const response = {data:{enrollments: [{priceInfo: {},id:3}]}}
    component.proposalStoreService.proposalData = proposalData
    component.selectedEnrollmentArray = [{id:3}]
    const enrolemnt = {enrolled: false, displayQnA: true,priceInfo:{}}
    component.eaService.isUpgradeFlow = true
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
    component.onEnrollmentSelection(enrolemnt);
    
    expect(component.deeplinkForServices).toBeFalsy();
    expect(component.deeplinkForSw).toBeFalsy();
  });

  it('call onEnrollmentSelection enrolled: true', () => {
    component.selectedEnrollmentArray = []
    const response = propsoalResponse
    component.proposalStoreService.proposalData = proposalData
    component.eaService.isUpgradeFlow = true
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
    component.proposalStoreService.proposalData = proposalData
    component.eaService.isUpgradeFlow = true
    component.upgradedEnrollmentsArray = [{id:1}]
    response.data.enrollments[0].id = 1
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

// it('call setGridData', () => {
//   component.setGridData();  
//   expect(component.priceEstimateService.showUpdatePA).toBe(true);  
// });

it('call getEnrollmentData', fakeAsync(() => {
  component.priceEstimateStoreService.viewAllSelected = true;
  component.gridOptions = <GridOptions>{};
  const response = {"rid":"EAMP1685453878232","user":"mariar","error":false,"data":{"proposal":{"objId":"6475b0bf9950585529e419fb","id":8987760,"projectObjId":"6475ae81a9a798004c7acac8","projectId":74074,"name":"E2E_C_ACAT_Req_18","billingTerm":{"rsd":"20230530","billingModel":"Prepaid","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"countryOfTransaction":"US","priceList":{"id":"1109","name":"Global Price List - US"},"currencyCode":"USD","partnerInfo":{"beGeoId":639324,"beGeoName":"ConvergeOne, Inc.","pgtmvBeGeoId":272241792},"customer":{"accountName":"AVANGRID","customerGuId":"2152229","customerGuName":"IBERDROLA SOCIEDAD ANONIMA","preferredLegalName":"AVANGRID","preferredLegalAddress":{"addressLine1":"400 WEST AVE","city":"ROCHESTER","state":"NY","zip":"14611","country":"UNITED STATES"},"customerReps":[{"id":0,"title":"IT","firstName":"Sai","lastName":"Dharm","name":"Sai Dharm","email":"test123@cisco.com"}],"federalCustomer":false,"countryCode":"UNITED STATES","duoCustomerType":{"federalCustomer":true,"legacyCustomer":false,"subscriptionLines":false,"hwTokenLines":false},"legacyCustomer":false},"dealInfo":{"id":"67909281","statusDesc":"Qualified","optyOwner":"mariar","buyMethodDisti":false,"type":"PARTNER","dealScope":3,"dealSource":0,"dealType":3,"crPartyId":"302010983","distiDeal":false,"partnerDeal":true,"changeSusbcriptionDeal":false},"buyingProgram":"BUYING_PGRM_3","locked":true,"status":"IN_PROGRESS","initiatedBy":{"type":"ONE_T","distiInitiated":false,"resellerInitiated":false,"ciscoInitiated":false},"audit":{"createdBy":"mariar","createdAt":1685434559929,"updatedBy":"system","updatedAt":1685446498844},"priceInfo":{"extendedList":7218887.76,"unitNet":0,"originalExtendedList":0,"originalUnitList":0,"totalNet":4039373.88,"totalNetBeforeCredit":5054802.12,"totalNetAfterIBCredit":0,"unitListMRC":0,"unitNetMRC":0,"proposalPurchaseAdjustment":162705.6},"commitInfo":{"committed":true,"threshold":100000.0,"fullCommitTcv":243604.8,"partialCommitTcv":3795769.08},"forceAllowCompletion":false,"programEligibility":{"eligible":true,"nonEligiblePrimaryEnrollments":[],"nonEligibleSecondaryEnrollments":[],"eligiblePrimaryEnrollments":[],"eligibleSecondaryEnrollments":[]},"syncStatus":{"cxCcwrPriceDirty":true,"cxEditFlag":false,"cxCcwrRipFlag":false,"showIbAssessmentButton":false},"deleted":false,"scopeInfo":{"scopeId":6218,"masterAgreementId":"EA6645","returningCustomer":false},"mspInfo":{"mspAuthorizedQualcodes":["EA3MSEAPE"],"mspProposal":false,"mspPartner":true},"sharedWithDistributor":false,"summaryViewAllowed":false,"changeSubDeal":true,"statusDesc":"In Progress","allowCompletion":false},"enrollments":[{"id":1,"name":"Networking Infrastructure","primary":true,"enrolled":true,"displayQnA":false,"displaySeq":1,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":true,"fcSuiteCount":1,"pcSuiteCount":2,"fcTcv":243604.8,"pcTcv":183576.96},"pools":[],"priceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":427181.76,"totalNetBeforeCredit":589887.36,"purchaseAdjustment":162705.6,"totalSwNet":427181.76,"totalSwNetBeforeCredit":589887.36,"totalSrvcNet":0,"totalSrvcNetBeforeCredit":0,"totalSwAndRelatedSrvcNet":4039373.88,"totalNetForRelatedServiceAtos":3612192.12},"ncPriceInfo":{"extendedList":1017029.88,"unitNet":0,"totalNet":589887.36,"totalNetBeforeCredit":589887.36},"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":2,"name":"Applications Infrastructure","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":2,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":3,"name":"Security","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":4,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false},{"id":4,"name":"Collaboration","primary":true,"enrolled":false,"displayQnA":false,"displaySeq":3,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":true,"cxOptInAllowed":false,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}},{"id":6,"name":"Hybrid Work","primary":false,"enrolled":false,"displayQnA":true,"displaySeq":6,"billingTerm":{"rsd":"20230530","billingModel":"Prepaid","billingModelName":"Prepaid Term","term":36,"eaEndDateStr":"20260529","eaEndDate":1780038000000},"commitInfo":{"committed":false,"fcSuiteCount":0,"pcSuiteCount":0},"pools":[],"disabled":false,"includedInEAID":false,"active":true,"externalConfiguration":false,"cxOptInAllowed":true,"cxAttached":false,"service":false,"disableRsdAndTermUpdate":false,"changeSubConfig":{"noMidTermPurchaseAllowed":true}}]},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1685453878472}
  component.proposalStoreService.proposalData = response.data.proposal
  component.proposalStoreService.proposalData.enrollments = response.data.enrollments
  component
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.getEnrollmentData(true);  
  expect(component.proposalStoreService.mspInfo).toBe(response.data.proposal.mspInfo);  
  flush()
}));


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

it('call cascadeDiscount isCascadeApplied: false', () => {
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  const response = {data: {}}
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  component.cascadeDiscount();  
  expect(component.isCascadeApplied).toBe(false);  
});

it('call cascadeDiscount isCascadeApplied: true', () => {
  const setErrorMessage = jest.spyOn(component, 'setErrorMessage').mockImplementationOnce(()=> {});
  const setTotalValues = jest.spyOn(component, 'setTotalValues').mockImplementationOnce(()=> {});
  const setGridData = jest.spyOn(component, 'setGridData').mockImplementationOnce(()=> {});
  component.proposalStoreService.proposalData = proposalData
  component.proposalStoreService.proposalData.enrollments = proposalData.enrollments
  component.priceEstimateStoreService.selectedEnrollment = proposalData.enrollments[0]
  const response = {data: {enrollments:[{id: 1}] }, proposal: component.proposalStoreService.proposalData}
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  component.cascadeDiscount();  
  expect(component.isCascadeApplied).toBe(true);  
});

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

  it('should call requestEngageSupport',  fakeAsync(() => {
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
 
  it('should call navigateToOWB', () => {
    window.open = function () { return window; }
    const  call = jest.spyOn(window, "open");
    component.navigateToOWB();
    expect(call).toHaveBeenCalled(); 
  });  

  // it('should call openOfferModal', () => {
  //   component.proposalStoreService.projectStatus = 'COMPLETE'
  //   component.openOfferModal();
  //   expect(component.priceEstimateStoreService.showStrategicOffers).toBe(true); 
  // });  

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

  // it('should call closeStrategicOffer', () => {
  //   component.priceEstimateStoreService.displayCxGrid = true
  //   component.proposalStoreService.proposalData = proposalData
  //   component.closeStrategicOffer('');
  //   expect(component.priceEstimateStoreService.showStrategicOffers).toBe(false);  
  // });

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

  // it('should call checkForSto', () => {
  //   component.proposalStoreService.proposalData = proposalData
  //   const response = {data:{strategicOffers:[{}],proposal:proposalData,enrollments:proposalData.enrollments}}
  //   let eaRestService = fixture.debugElement.injector.get(EaRestService);
  //   jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
  //   component.checkForSto();
  //   expect(component.priceEstimateService.showEnrollments).toBe(false); 
  // });  

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

  it("should call onCellMouseOver", () => {
    const event = {
      node:{level:1,allLeafChildren:[{}]},
      event:{target:{classList:{value:'configure-link'}}}
    }

    component.onCellMouseOver(event);
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false); 
  });
  it("should call onCellMouseOut", () => {
    const event = {
      node:{level:1,allLeafChildren:[{}]},
      event:{target:{classList:{value:'configure-link'}}}
    }

    component.onCellMouseOut(event);
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false); 
  });
  it("should call disableLastSelectedSuite", () => {
    component.numberofSelectedSuite = 1
    component.disableLastSelectedSuite();
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false); 
  });
  it("should call onRowSelected", () => {
    component.priceEstimateService.enableSuiteInclusionExclusion = true
    const event = {
      node:{level:1},
      data:{enrollmentId:1,ato:'test',selected:true}
    }
    component.onRowSelected(event);
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false); 
  });
  it("should call onRowSelected 1", () => {
    component.priceEstimateService.enableSuiteInclusionExclusion = true
    const event = {
      node:{level:1,selected:true},
      data:{enrollmentId:1,ato:'test',selected:true}
    }
    component.onRowSelected(event);
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false);
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
    const param = {node:{level:2},data:{supportPid:true,enrollmentId:5,desiredQty:3,node:{level:1}}}
    const returnValue = component.desiredQtyRender(param);
    expect(returnValue).toEqual(undefined);  
  });  
  it('should call desiredQtyRender 3', () => {
    const param = {node:{level:1},data:{supportPid:true,enrollmentId:5,desiredQty:3,node:{level:1}}}
    const returnValue = component.desiredQtyRender(param);
    expect(returnValue).toEqual('');  
    
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
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false);
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
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false);
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
    expect(component.priceEstimateService.showTcvBreakUp).toBe(false);
  })

});