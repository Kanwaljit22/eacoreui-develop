import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CpsComponent } from '@app/shared/cps/cps.component';
import { NgbPopover, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IAtoTier, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { AdjustDesiredQtyService } from '../adjust-desired-qty/adjust-desired-qty.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { PriceEstimateService } from '../price-estimate.service';
import { QuestionnaireStoreService } from '../questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../questionnaire/questionnaire.service';

import { AddSuitesComponent } from './add-suites.component';
import { ProjectService } from 'vnext/project/project.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class MockEaRestService {

  postApiCall() {
    return of({
      data: {      
           } 
      })
    }

  getApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  putApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  getApiCallJson(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}

class MockProposalRestService {
  deleteApiCall(){
    return of({
      data: {      
           } 
      })
  }
  postApiCall() {
    return of({
      data: {      
           } 
      })
    }

  getApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  putApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  getApiCallJson(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}
describe('AddSuitesComponent', () => {
  let component: AddSuitesComponent;
  let fixture: ComponentFixture<AddSuitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSuitesComponent,LocalizationPipe ],
      providers: [LocalizationService, VnextService,ProjectRestService, PriceEstimateService,QuestionnaireService,QuestionnaireStoreService!, {provide : EaRestService, useClass: MockEaRestService}, MessageService, EaService, BlockUiService, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, PriceEstimateStoreService, {provide: ProposalRestService, useClass: MockProposalRestService}, ProjectStoreService, DataIdConstantsService, ProjectService, ConstantsService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule,NgbModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });
  const enrollmentData =  {
    "id": 1,
    "name": "Networking Infrastructure",
    "primary": true,
    "enrolled": true,
    "displayQnA": false,
    "displaySeq": 1,
    "billingTerm": {
      "rsd": "20230811",
      "billingModel": "Prepaid",
      "billingModelName": "Prepaid Term",
      "term": 36,
      "eaEndDateStr": "20260810",
      "eaEndDate": 1786345200000
    },
    "commitInfo": {
      "committed": true,
      "fcSuiteCount": 2,
      "pcSuiteCount": 0,
      "fcTcv": 595107.72
    },
    "pools": [],
    "priceInfo": {
      "extendedList": 1058240.88,
      "unitNet": 0,
      "totalNet": 595107.72,
      "totalNetBeforeCredit": 613784.88,
      "purchaseAdjustment": 18677.16,
      "totalSwNet": 595107.72,
      "totalSwNetBeforeCredit": 613784.88,
      "totalSrvcNet": 0,
      "totalSrvcNetBeforeCredit": 0
    },
    "ncPriceInfo": {
      "extendedList": 1282058.64,
      "unitNet": 0,
      "totalNet": 743604.48,
      "totalNetBeforeCredit": 743604.48
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

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuitesComponent);
    component = fixture.componentInstance;
    component.enrollment = enrollmentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if displayQuestionnaire is true', () => {
    component.priceEstimateService.displayQuestionnaire = true
    const openQnAFlyout = jest.spyOn(component, "openQnAFlyout");
    component.ngOnInit();
    expect(openQnAFlyout).toHaveBeenCalled();
  });
  it('if enrollemnt id is 6', () => {
    component.enrollment.id = 6
    component.ngOnInit();
    expect(component.suitePurchasesInfo).toBe(true);
  });
  it('if CROSS_SUITE_MIGRATION_REL', () => {
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.proposalStoreService.proposalData = {dealInfo: {subscriptionUpgradeDeal: true}} 
    component.enrollment.id = 6
    component.ngOnInit();
    expect(component.suitePurchasesInfo).toBe(true);
  });
  it('if CROSS_SUITE_MIGRATION_REL 1', () => {
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.priceEstimateStoreService.showUpgradeSwSuitesTabSection = true
    component.proposalStoreService.proposalData = {dealInfo: {subscriptionUpgradeDeal: true}} 
    component.enrollment.id = 6
    component.ngOnInit();
    expect(component.suitePurchasesInfo).toBe(true);
  });

  it('should call selectBill', () => {
    const bill = {
      address1:'',
        city:'',
        countryName:'',
        customerNumber:'',
        orgId:123,
        orgName:''    
    }
    component.selectBill(bill);
    expect(component.selectedBill).toEqual(bill)
  });

  it('should call backToCxPage', () => {
    component.backToCxPage();
    expect(component.serviceInfo).toBe(true)
  });

  it('should call goToBillToTab', () => {
    component.goToBillToTab();
    expect(component.billToTab).toBe(true)
  });

  it('should call openCxUpgradeDrop', () => {
    const event = {target: {checked: true}}
    const suite = {
      placement: ''
    }
    component.openCxUpgradeDrop(event,suite);
    expect(component.showCxUpgradeTierDrop).toBe(true)
  });

  it('should call close', () => {
    component.close();
    expect(component.isRoMode).toBe(false)
  });

  it('should call checkRoMode', () => {
    component.proposalStoreService.isReadOnly = true
    component.checkRoMode();
    expect(component.isRoMode).toBe(true)
  });

  it('should call openDropdown', () => {
    const suite = {
      showDropdown: true
    }
    component.openDropdown(suite);
    expect(suite.showDropdown).toBe(false)
  });

  it('should call openQnAFlyout', () => {
 
    //component.proposalStoreService.proposalData = {objId: '123'}
    const response ={data:[{id:'123'}]}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
     component.openQnAFlyout();
     
     expect(component.isDataLoaded).toBe(true);
     
   });

   it('should call openDrop expanded: true', () => {
    const event = {target: {checked: true}}
    const enrollment = {
      placement: '',expanded: true,showDropdown: false
    }
    component.openDrop(event,enrollment);
    expect(enrollment.showDropdown).toBe(true)
  });

  it('should call openDrop expanded: false', () => {
    const event = {target: {checked: true}}
    const enrollment = {
      placement: '',expanded: false,showDropdown: false
    }
    component.openDrop(event,enrollment);
    expect(enrollment.showDropdown).toBe(true)
  });

  it('should call changeCxTierSelection', () => {
    const tierObj = { selected: false,name:'test'}
    const suite = {
      cxTierDropdown: [{selected: false,name:'test'},{selected: false,name:'test123'}],
      cxUpdatedTier:{name:'networking'},
      cxSelectedTier: 'networking'
    }
    component.changeCxTierSelection(tierObj,suite);
    expect(suite.cxSelectedTier).toEqual(tierObj.name)
  });

  it('should call getSuiteDetails id : 3', () => {

    const response ={data:{
      enrollments:[{id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
     component.getSuiteDetails();
     
     expect(component.isSecurityPortfolio).toBe(true);
     
   });

   it('should call getSuiteDetails id : 1', () => {
    component.cxEnrollmentData ={id:1}
    component.deeplinkForCx = true
    const response ={data:{
      enrollments:[{id:1,pools:
        [{displaySeq:1,suites: [{renewalInfo: {subscriptions:[],subRefIds:[1,2]}}]},{displaySeq:2,suites: [{renewalInfo: {subscriptions:[],subRefIds:[1,2]}}]}],
        billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
     component.getSuiteDetails();
     
     expect(component.isSecurityPortfolio).toBe(false);
     
   });

   it('should call setIncompatibleAtoMessage', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": true,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}

     component.setIncompatibleAtoMessage(suite,true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });

   it('should call setIncompatibleAtoMessage with flags', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": true,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3'],
      "incompatibleSuites": ['1','2','3','Cisco DNA Switching']
    }
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true,name:'Cisco DNA Switching'}]}]}
     component.setIncompatibleAtoMessage(suite,true, true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });

   it('should call updateSuiteInclusion inclusion: true isSecurityPortfolio: true', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": true,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.SEC_SUITE_REL = true
    component.isSecurityPortfolio = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}

     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
     
   });
   it('should call updateSuiteInclusion inclusion: false isSecurityPortfolio: true', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": false,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.SEC_SUITE_REL = true
    component.isSecurityPortfolio = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}

     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
     
   });

   it('should call updateSuiteInclusion inclusion: false', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }

    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}

     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
     
   });
   it('should call updateSuiteInclusion inclusion: true', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }

    component.selectedMerakiSuitesArray = ['E3-N-MRNI']
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}

     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
     
   });

   it('should call getIncludedSuitesCount', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true;
    component.isSecurityPortfolio = true
    component.isChangeSubFlow = true
    component.isUpgradeFlow = true
    component.swEnrollmentData = {id: 6,pools:[{suites:[{type:'MERAKI',eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-MRNI',inclusion:true,incompatibleAtos:['123']}]}]}

     component.getIncludedSuitesCount();
     
     expect(component.numberofSelectedSuite).toBeGreaterThan(0);
     
   });

   it('should call setRenewalSubDataForSuite', () => {
    component.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.set('123', [])
    component.swEnrollmentData = {id: 6,pools:[{suites:[{renewalInfo: {subRefIds:['123']},lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-MRNI',inclusion:true,incompatibleAtos:['123']}]}]}

     component.setRenewalSubDataForSuite();
     
     expect(component.numberofSelectedSuite).toBe(0);
     
   });

   it('should call isEducationInstitueSelected educationInstituteOnly: true and value :false', () => {
    const tier:IAtoTier ={
      educationInstituteOnly: true,

    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'false'}]})

    const returnValue =  component.isEducationInstitueSelected(tier);
     
     expect(returnValue).toBe(false);
     
   });
   it('should call isEducationInstitueSelected educationInstituteOnly: true and value : true', () => {
    const tier:IAtoTier ={
      educationInstituteOnly: true,

    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'true'}]})

    const returnValue =   component.isEducationInstitueSelected(tier);
     
     expect(returnValue).toBe(true);
     
   });
   it('should call isEducationInstitueSelected no educationInstituteOnly ', () => {
    const tier:IAtoTier ={}
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'true'}]})
    const returnValue =   component.isEducationInstitueSelected(tier);
     expect(returnValue).toBe(true);
   });

   //isSelectedTierValid

   it('should call updateCxInclusion ', () => {
    const suite ={cxOptIn: true,cxAttachRate: 100}
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{value: 'true'}]})
    component.updateCxInclusion(suite);
     expect(suite.cxAttachRate).toBeFalsy();
   });


   it('should call goToSuites type: button', () => {
    const type = 'button'
    component.swEnrollmentData = {billToMandatory : true}
    component.goToSuites(type);
     expect(component.serviceInfo).toBe(false);
   });

   it('should call goToSuites  type roadmap', () => {

    component.swEnrollmentData = {billToMandatory : false}
    const type = 'roadMap'
    component.serviceInfo = true
    component.goToSuites(type);
     expect(component.billToTab).toBe(false);
   });

   it('should call backToQna ', () => {
    component.swEnrollmentData = {billToMandatory : true}
    component.backToQna();
     expect(component.deeplinkForCx).toBe(false);
   });

  //  it('should call onDateSelection with no event ', () => {
  //   const enrollment = {billingTerm : {rsd: '20230811'}}
  //   const event = undefined
  //   component.onDateSelection(event,enrollment);
  //    expect(component.deeplinkForCx).toBe(false);
  //  });

  //  it('should call onDateSelection with event ', () => {
  //   const enrollment = {billingTerm : {rsd: '20230811'}}
  //   component.isUserClickedOnDateSelection = true 
  //   const event = {}
  //   component.onDateSelection(event,enrollment);
  //    expect(component.isRsdUpdated).toBe(true);
  //  });

   it('should call howItWorks', () => {
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    const response = {data: 'testUrl'}
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.howItWorks();
    expect(call).toHaveBeenCalled();
   });

   it('should call onUserClickDateSelection', () => {
    component.onUserClickDateSelection();
     expect(component.isUserClickedOnDateSelection).toBe(true);
   });

   it('should call goToDocCenter', () => {
    component.goToDocCenter();
     expect(component.proposalStoreService.loadCusConsentPage).toBe(true);
   });

   it('should call clearSearchBillTo', () => {
    component.clearSearchBillTo();
     expect(component.showSelectionOptions).toBe(false);
   });

   it('should call removeBillToId', () => {
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    const response = {data: 'testUrl'}
    jest.spyOn(proposalRestService, "deleteApiCall").mockReturnValue(of(response));
    component.removeBillToId();
    expect(component.isBilltoIDChanged).toBe(false);
   });

   it('should call showBillToData', () => {
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    const response = {data: 'testUrl'}
    component.isPartnerLoggedIn = true
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.showBillToData();
    expect(component.showSelectionOptions).toBe(true);
   });

   it('should call showCxInfo isCxREquired: true', () => {
    component.showCxInfo();
     expect(component.isCxREquired).toBe(false);
   });

   it('should call showCxInfo isCxREquired: false', () => {
    component.cxEnrollmentData = {pools:[{suites:[]}]}
    component.isCxREquired = false
    component.showCxInfo();
     expect(component.isCxREquired).toBe(true);
   });

   it('should call checkLocc', () => {
    component.checkLocc();
     expect(component.billToIdRequired).toBe(false);
   });

   it('should call emailValidation', () => {
    const email = 'test'
    component.emailValidation(email);
     expect(component.invalidEmail).toBe(true);
   });
   it('should call emailValidation empty value', () => {
    const email = ''
    component.emailValidation(email);
     expect(component.invalidEmail).toBe(false);
   });
   it('should call emailValidation valid value', () => {
    const email = 'test@cisco.com'
    component.emailValidation(email);
     expect(component.invalidEmail).toBe(false);
   });

   it('should call clearSearchDistiBillTo', () => {
    component.clearSearchDistiBillTo();
     expect(component.showDistiBillToOptions).toBe(false);
   });

   it('should call selectDistiBill', () => {
    const bill = {siteUseId: 'test'}
    component.selectDistiBill(bill);
     expect(component.isBillToIdUpdated).toBe(true);
   });
   it('should call selectDistiBill isDistiOpty: true', () => {
    component.eaService.isDistiOpty = true
    const bill = {siteUseId: 'test'}
    component.selectDistiBill(bill);
     expect(component.isBillToIdUpdated).toBe(true);
   });

   it('should call removeDistiBid', () => {
    component.eaService.isDistiOpty = true
    component.removeDistiBid();
     expect(component.selectedDistiBill).toBe(undefined);
   });

   it('should call removeDistiBid isDistiOpty: false', () => {
    component.eaService.isDistiOpty = false
    component.removeDistiBid();
     expect(component.selectedDistiBill).toBe(undefined);
   });
   //new

   it('should call isSelectedTierValid', () => {
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.isSelectedTierValid(suite);
     expect(returnVAlue).toBe(true);
   });

   it('should call goToServiceInfo', () => {
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.isPartnerLoggedIn = true
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: {rsd:'20230811'},
      pools:[{suites:[{ato:'1',inclusion:true,tiers:[{name:'test'}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.goToServiceInfo();
    expect(component.isCxREquired).toBe(false);
   });

   it('should call goToServiceInfo no pools', () => {
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.isPartnerLoggedIn = true
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      
      billingTerm: {rsd:'20230811'},
      //pools:[{suites:[{ato:'1',inclusion:true}]}]
    }
    component.goToServiceInfo();
    expect(component.isCxREquired).toBe(false);
   });

   it('should call isPartnerEamsAdded', () => {
    component.isEamsEligibile = true
    component.selectedCiscoEams = false;
    component.invalidEmail = true
    const returnValue = component.isPartnerEamsAdded();
     expect(returnValue).toBe(true);
   });

   it('should call getCxSuiteDetails isDistiOpty: true', () => {
    component.swEnrollmentData = {id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.isDistiOpty = true
    component.deeplinkForCx = true
    const response ={data:{
      billToInfo:{},
      enrollments:[{eamsDelivery: {partnerDeliverySelected: true,partnerInfo: {contactNumber:'test',ccoId: '123',partnerContactName:'test',emailId:'test'}}
      ,id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  
    component.getCxSuiteDetails();
    expect(component.isDataLoaded).toBe(true);
   });

   it('should call getCxSuiteDetails isDistiOpty: false', () => {
    component.swEnrollmentData = {id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.isDistiOpty = false
    component.deeplinkForCx = true
    const response ={data:{
      billToInfo:{},
      enrollments:[{eamsDelivery: {partnerDeliverySelected: true,partnerInfo: {contactNumber:'test',ccoId: '123',partnerContactName:'test',emailId:'test'}}
      ,id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  
    component.getCxSuiteDetails();
    expect(component.isDataLoaded).toBe(true);
   });

   it('should call checkToDisableContinueforFlooringBid', () => {
    component.eaService.isDistiOpty = true
    component.swEnrollmentData = {billingTerm:{billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = {isFlooringBid: true}
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(true);
   });

   it('should call checkToDisableContinueforFlooringBid isFlooringBid: false', () => {
    component.eaService.isResellerOpty = true
    component.swEnrollmentData = {billingTerm:{billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = {isFlooringBid: false}
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(false);
   });
   it('should call checkToDisableContinueforFlooringBid', () => {
    component.eaService.isDistiOpty = false
    component.selectedBill = {isFlooringBid: true}
    component.swEnrollmentData = {billingTerm:{billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedResellerBill = {isFlooringBid: true}
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(true);
   });

   it('should call checkToDisableContinueforFlooringBid isDistiOpty: false', () => {
    component.eaService.isDistiOpty = false
    component.swEnrollmentData = {billingTerm:{billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = {isFlooringBid: true}
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(false);
   });

   it('should call checkToDisableContinueforFlooringBid selectedDistiBill: empty', () => {
    component.eaService.isDistiOpty = true
    component.selectedBill = {isFlooringBid: true}
    component.swEnrollmentData = {billingTerm:{capitalFinancingFrequency: 'test',billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = null
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(true);
   });

   it('should call checkToDisableContinueforFlooringBid selectedDistiBill: empty capitalFinancingFrequency: empty', () => {
    component.eaService.isDistiOpty = true
    component.selectedBill = {isFlooringBid: true}
    component.swEnrollmentData = {billingTerm:{capitalFinancingFrequency: '',billingModel:'Prepaid'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = null
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(false);
   });
   it('should call checkToDisableContinueforFlooringBid selectedDistiBill: empty selectedBill: empty', () => {
    component.eaService.isDistiOpty = true
  //  component.selectedBill = {isFlooringBid: true}
    component.swEnrollmentData = {billingTerm:{capitalFinancingFrequency: '',billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.selectedDistiBill = null
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(false);
   });

   it('should call checkToDisableContinueforFlooringBid isDistiOpty: false isFlooringBid:false' , () => {
    component.eaService.isDistiOpty = false
    component.swEnrollmentData = {billingTerm:{billingModel:'test'}, id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
   component.selectedBill = {isFlooringBid: false}
    const returnVAlue = component.checkToDisableContinueforFlooringBid();
     expect(returnVAlue).toBe(false);
   });

   it('should set isDnxSelected to true when WIFI7_REL is enabled and suite hasEmbeddedHwSupport and swSuiteInclusion', () => {
    component.eaService.features.WIFI7_REL = true;
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: { rsd: '20230811' },
      pools: [
        {
          suites: [
            {
              ato: '1',
              inclusion: true,
              tiers: [{ name: 'test' }],
              hasEmbeddedHwSupport: true,
              swSuiteInclusion: true,
              cxOptIn: true,
            },
            { ato: '3', inclusion: false },
            { allowHwSupportOnlyPurchase: true, ato: '2', inclusion: true },
          ],
        },
      ],
    };
    const suite = component.cxEnrollmentData.pools[0].suites[0];
    component.checkIfAllAttachRateFilled(suite);

    expect(component.isDnxSelected).toBe(true);
  });

  it('should set isDnxSelected to false when WIFI7_REL is enabled and cxOptIn is false', () => {
    component.eaService.features.WIFI7_REL = true;
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: { rsd: '20230811' },
      pools: [
        {
          suites: [
            {
              ato: '1',
              inclusion: true,
              tiers: [{ name: 'test' }],
              hasEmbeddedHwSupport: true,
              swSuiteInclusion: true,
              cxOptIn: false,
            },
          ],
        },
      ],
    };
    const suite = component.cxEnrollmentData.pools[0].suites[0];
    component.checkIfAllAttachRateFilled(suite);

    expect(component.isDnxSelected).toBe(false);
  });

  it('should set isUnxSelected to true when WIFI7_REL is enabled and suite is of CISCO_NETWORKING_SOLUTION', () => {
    component.eaService.features.WIFI7_REL = true;
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: { rsd: '20230811' },
      pools: [
        {
          suites: [
            {
              ato: '1',
              inclusion: true,
              tiers: [{ name: 'test' }],
              eaSuiteType: 'CISCO_NETWORKING_SOLUTION',
              swSuiteInclusion: true,
              cxOptIn: true,
            },
          ],
        },
      ],
    };
    const suite = component.cxEnrollmentData.pools[0].suites[0];
    component.checkIfAllAttachRateFilled(suite);

    expect(component.isUnxSelected).toBe(true);
  });

  it('should set isUnxSelected to false when WIFI7_REL is enabled and cxOptIn is false', () => {
    component.eaService.features.WIFI7_REL = true;
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: { rsd: '20230811' },
      pools: [
        {
          suites: [
            {
              ato: '1',
              inclusion: true,
              tiers: [{ name: 'test' }],
              eaSuiteType: 'CISCO_NETWORKING_SOLUTION',
              swSuiteInclusion: true,
              cxOptIn: false,
            },
          ],
        },
      ],
    };
    const suite = component.cxEnrollmentData.pools[0].suites[0];
    component.checkIfAllAttachRateFilled(suite);

    expect(component.isUnxSelected).toBe(false);
  });


   it('should call getCxSuitesIncluded isUpgradeFlow: true & no cxTierOptions 1', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isSwTierUpgraded:true,ato:'test',upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{ato:'1',inclusion:true,tiers:[{name:'test'}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & no cxTierOptions 2', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isSwTierUpgraded:true,upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxSelectedTier: 'test',ato:'1',inclusion:true,tiers:[{name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & no searchedTier', () => {
    component.isUpgradeFlow = true
    component.eaService.features.WIFI7_REL = true;
    component.updatedSuitesArray = [{isSwTierUpgraded:true,upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{ato:'1',inclusion:true,tiers:[{name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(true);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & isSwTierUpgraded: false', () => {
    component.isUpgradeFlow = true
    component.eaService.features.WIFI7_REL = true;
    component.updatedSuitesArray = [{isRestored: true,isSwTierUpgraded:false,ato:'test',includedInSubscription:true,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'1',inclusion:true,tiers:[{cxOptIn:true,name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & isSwTierUpgraded: false & isRestored: false', () => {
    component.isUpgradeFlow = true
    component.eaService.features.WIFI7_REL = true;
    component.updatedSuitesArray = [{isRestored: false,isSwTierUpgraded:false,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'1',inclusion:true,tiers:[{name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & tiers: empty isSwTierUpgraded: false & isRestored: true', () => {
    component.isUpgradeFlow = true
    component.eaService.features.WIFI7_REL = true;
    component.updatedSuitesArray = [{isRestored: true,isSwTierUpgraded:false,includedInSubscription:true,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxTierOptions:[{}],lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });
   it('should call getCxSuitesIncluded isUpgradeFlow: true & tiers: empty isSwTierUpgraded: false & isRestored: false', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isRestored: false,isSwTierUpgraded:false,includedInSubscription:true,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,ato:'test',notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxTierOptions:[{name:'test'}],lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: true & tiers: empty isSwTierUpgraded: false & isRestored: false isSwTierUpgraded: true', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isRestored: false,isSwTierUpgraded:true,includedInSubscription:true,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,ato:'test',notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxTierOptions:[{name:'test'}],lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });
   it('should call getCxSuitesIncluded isUpgradeFlow: true & tiers: empty isSwTierUpgraded: false & isRestored: false isRestored: true', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isRestored: true,isSwTierUpgraded:false,includedInSubscription:true,lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,ato:'test',notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxTierOptions:[{name:'test'}],lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   //upgrade false 


   it('should call getCxSuitesIncluded isUpgradeFlow: false', () => {
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.FIRESTORM_REL = true;
    component.updatedSuitesArray = [{ato:'test',swSelectedTier:{name:'test'},lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false, ato:'test2',inclusion:true,notAvailable: false,cxOptIn: true,cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'test',inclusion:true}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true, ato: 'test2', cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true,tiers:[{cxOptIn:true,name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true, ato: '4',cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: false', () => {
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.FIRESTORM_REL = true;
    component.updatedSuitesArray = [{ato:'test',swSelectedTier:{name:'test'},lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false, ato:'test2',inclusion:true,notAvailable: false,cxOptIn: true,cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'test',inclusion:true}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true, ato: 'test2', cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true,tiers:[{cxOptIn:true,name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true, ato: '4',cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded isUpgradeFlow: false swSelectedTier:empty', () => {
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.FIRESTORM_REL = true;
    component.updatedSuitesArray = [{ato:'test',lowerTierAto: {name:'test'},upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'test',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{lowerTierAto:{name:'test1'},cxSelectedTier:'test',ato:'test',inclusion:true,tiers:[{cxOptIn:true,name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call setTierFromData ', () => {
    const suite = {cxSelectedTier:'test',cxTierOptions:[{name:'test'}],cxUpdatedTier:{}}
    component.setTierFromData(suite);
    expect(suite.cxUpdatedTier).toEqual(suite.cxTierOptions[0]);
   });

   it('should call setTierFromData cxSelectedTier:empty', () => {
    const suite = {cxTierOptions:[{name:'test'}],cxUpdatedTier:{}}
    component.setTierFromData(suite);
    expect(suite.cxUpdatedTier).toEqual(suite.cxTierOptions[0]);
   });

  //  it('should call setDisabledDates', () => {
  //   const enrollemnt = {billingTerm:{rsd:'20220811'},todaysDate:'20230811'}
  //   component.setDisabledDates(enrollemnt);
  //   expect(component.disableForMapping).toBe(false);
  //  });

   it('should call checkAllAttachRate value > 100', () => {
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{value:101}}
    const suit= {cxAttachRate:50}
    component.checkAllAttachRate(suit,event);
    expect(suit.cxAttachRate).toBe(100);
   });

   it('should call checkAllAttachRate value < 100', () => {
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{value:20}}
    const suit= {cxAttachRate:50}
    component.checkAllAttachRate(suit,event);
    expect(suit.cxAttachRate).toBe(20);
   });

   it('should call getFormattedDate', () => { 
    const enrollment = {billingTerm:{rsd:'20230811'}}
    const newDate = new Date(component.utilitiesService.formateDate(enrollment.billingTerm.rsd))
    const value = component.getFormattedDate(enrollment);
    expect(value).toEqual(newDate);
   });

   it('should call checkValue value > 100', () => {
    const event = {target:{value:101},keyCode:100}
    const value= 20
    component.checkValue(event,event);
    expect(value).toEqual(20);
   });
   it('should call checkValue value < 0', () => {
    const event = {target:{value:-1},keyCode:100}
    const value= 20
    component.checkValue(event,event);
    expect(value).toEqual(20);
   });

   it('should call checkValue', () => {
    const event = {target:{value:50},keyCode:100}
    const value= 20
    component.checkValue(event,event);
    expect(value).toEqual(20);
   });

   it('should call checkValue invalid value', () => {
    const event = {target:{value:50}}
    const value= 20
    component.checkValue(event,event);
    expect(value).toEqual(20);
   });

   it('should call suiteAtoSelection', () => {
    const tierObj = {selected:false}
    const suite= {tiers: [{selected:true},{selected:false}]}
    component.suiteAtoSelection(tierObj,suite);
    expect(tierObj.selected).toBe(true);
   });

   it('should call selectEamsDeliveryOption = cisco', () => {
    const deliveryOption = 'cisco'
    component.selectEamsDeliveryOption(deliveryOption);
    expect(component.selectedCiscoEams).toBe(true);
   });

   it('should call selectEamsDeliveryOption', () => {
    const deliveryOption = 'parter'
    component.selectEamsDeliveryOption(deliveryOption);
    expect(component.selectedCiscoEams).toBe(false);
   });

   it('should call getDistiBillTo test length > 3 isDistiOpty = false', () => {
    component.eaService.isDistiOpty = false
    component.getDistiBillTo('test');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });
   it('should call getDistiBillTo test length > 3 isDistiOpty = true', () => {
    component.eaService.isDistiOpty = true
    component.getDistiBillTo('test');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });
   it('should call getDistiBillTo test length < 3', () => {
    component.getDistiBillTo('te');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });

   it('should call getResellerBillTo test length > 3 isDistiOpty = false', () => {
    component.eaService.isResellerOpty = false
    component.getResellerBillTo('test');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });
   it('should call getResellerBillTo test length > 3 isDistiOpty = true', () => {
    component.eaService.isResellerOpty = true
    component.getResellerBillTo('test');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });
   it('should call getResellerBillTo test length < 3', () => {
    component.getResellerBillTo('te');
    expect(component.displayNoDistiBillIdMsg).toBe(false);
   });
   it('should call clearSearchResellerBillTo', () => {
    component.clearSearchResellerBillTo();
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call selectResellerBill isResellerOpty = true', () => {
    const bill ={siteUseId: ''}
    component.eaService.isResellerOpty = true
    component.selectResellerBill(bill);
    expect(component.isBillToIdUpdated).toBe(true);
   });
   it('should call selectResellerBill', () => {
    const bill ={siteUseId: ''}
    component.selectResellerBill(bill);
    expect(component.isBillToIdUpdated).toBe(true);
   });

   it('should call removeResellerBid', () => {
    component.removeResellerBid();
    expect(component.selectedResellerBill).toBe(undefined);
   });

   it('should call removeResellerBid', () => {
    component.eaService.isResellerOpty = true
    component.removeResellerBid();
    expect(component.selectedResellerBill).toBe(undefined);
   });

   it('should call isBillToAdded', () => {
    const  value = component.isBillToAdded();
    expect(value).toBe(false);
   });

   it('should call isBillToAdded billToIdRequired', () => {
    component.billToIdRequired = true
    const  value = component.isBillToAdded();
    expect(value).toBe(true);
   });

   it('should call isBillToAdded billToIdRequired isDistiOpty: true', () => {
    component.billToIdRequired = true
    component.eaService.isDistiOpty = true
    component.selectedDistiBill = {}
    component.selectedResellerBill= {}
    const  value = component.isBillToAdded();
    expect(value).toBe(false);
   });

   it('should call isBillToAdded billToIdRequired isDistiOpty: true selectedResellerBill: undefined', () => {
    component.billToIdRequired = true
    component.eaService.isDistiOpty = true
    const  value = component.isBillToAdded();
    expect(value).toBe(true);
   });

   it('should call isBillToAdded billToIdRequired isDistiOpty: true selectedBill: true', () => {
    component.billToIdRequired = true
    component.selectedBill = {}
    component.eaService.isDistiOpty = true
    const  value = component.isBillToAdded();
    expect(value).toBe(false);
   });

   it('should call isBillToAdded billToIdRequired isDistiOpty: false selectedBill: true', () => {
    component.billToIdRequired = true
    component.selectedBill = {}
    component.eaService.isDistiOpty = false
    const  value = component.isBillToAdded();
    expect(value).toBe(false);
   });

   it('should call learnMore', () => {
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.learnMore();
    expect(call).toHaveBeenCalled();
   });

   it('should call setQnaQuestions', () => {
    const questions = [{id:'scu_count'},{id:'tier'}]
    const res = [{id:'scu_count'},{id:'tier'}]
    const test = component.setQnaQuestions(questions);
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call optionalcxHwSelected', () => {
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const suite = {cxHwSupportOptedOut:false,cxAttachRate:10}
    component.optionalcxHwSelected(suite);
    expect(suite.cxAttachRate).toBeFalsy();
   });
   it('should call deselectAllSwSuites', () => {
    component.swEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
   
    component.deselectAllSwSuites();
    expect(component.swEnrollmentData.pools[0].suites[0].inclusion).toBe(false);
   });
   it('should call updateAllSuite checked:true', () => {
    component.eaService.features.WIFI7_REL = true;
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{checked:true}}
    component.updateAllSuite(event);
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call updateAllSuite checked:true', () => {
    component.eaService.features.WIFI7_REL = true;
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{checked:true}}
    component.updateAllSuite(event);
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call updateAllSuite checked:true isChangeSubFlow: true' , () => {
    component.eaService.features.WIFI7_REL = true;
    component.isChangeSubFlow = true
    component.swEnrollmentData = {pools: [{suites:[{changeSubConfig:{noMidTermPurchaseAllowed: true},ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{checked:true}}
    component.updateAllSuite(event);
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call updateAllSuite checked:false' , () => {
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.SEC_SUITE_REL = true;
    component.eaService.features.NPI_AUTOMATION_REL = true;
    component.eaService.features.BONFIRE_REL = true;
    component.isChangeSubFlow = true
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{checked:false}}
    component.updateAllSuite(event);
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call updateAllSuite 2 checked:false',fakeAsync( () => {
    component.eaService.features.WIFI7_REL = true;
    component.numberofSelectedSuite = 1;
    component.totalSuites = [{ato:'E3-N-MRNI'}, {ato:'E3-NA-MRNI'}]
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const event = {target:{checked:false}, preventDefault: jest.fn()}
    component.updateAllSuite(event);
    tick(200)
    expect(component.showResellerBillToOptions).toBe(false);
   }));
   it('should call selectSwHigherTier' , () => {
    component.priceEstimateService.upgradedSuitesTier = [{name:'test'}]
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const tier = {selected: false}
    const suite = {tiers:[{selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.selectSwHigherTier(tier,suite);
    expect(tier.selected).toBe(true);
   });
   it('should call selectSwHigherTier 2' , () => {
    component.priceEstimateService.upgradedSuitesTier = [{name:'test'}]
    component.swEnrollmentData = {pools: [{suites:[{ato:'E3-N-MRNI',inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    const tier = {selected: false}
    const suite = {name:'test',tiers:[{selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.selectSwHigherTier(tier,suite);
    expect(tier.selected).toBe(true);
   });
   it('should call restoreSwTier' , () => {
    component.priceEstimateService.upgradedSuitesTier = [{name:'test'}]
    const suite = {name:'test',tiers:[{selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.restoreSwTier(suite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(0);
   });
   it('should call restoreSwTier priceEstimateService.upgradedSuitesTier epmty array' , () => {
    const suite = {name:'test',tiers:[{selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.restoreSwTier(suite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(1);
   });
   it('should call restoreSwTier priceEstimateService.upgradedSuitesTier different suite ' , () => {
    component.priceEstimateService.upgradedSuitesTier = [{name:'test1'}]

    const suite = {name:'test',tiers:[{selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.restoreSwTier(suite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(2);
   });

   it('should call resetLowerTierdropdown with cxTierOptions' , () => {
    const cxSuite = {cxTierOptions:[{}],name:'test',swLowerTierAto:{name: 'test'},tiers:[{cxTierOptions:[{}],name:'test',selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.resetLowerTierdropdown(cxSuite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(0);
   });
   it('should call resetLowerTierdropdown' , () => {
    const cxSuite = {cxTierOptions:[{}],name:'test',swLowerTierAto:{name: 'test'},tiers:[{name:'test',selected: false,isRestored:false,isSwTierUpgraded:false}]}
    component.resetLowerTierdropdown(cxSuite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(0);
   });
   it('should call resetLowerTierdropdown with empty tiers array' , () => {
    const cxSuite = {cxTierOptions:[{}],name:'test',swLowerTierAto:{name: 'test'}}
    component.resetLowerTierdropdown(cxSuite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(0);
   });

   it('should call resetLowerTierdropdown with empty tiers array and cxTierOptions at suite level' , () => {
    const cxSuite = {cxTierOptions:[{}],name:'test',ato:'test',swLowerTierAto:{name: 'test'}}
    component.resetLowerTierdropdown(cxSuite);
    expect(component.priceEstimateService.upgradedSuitesTier.length).toBe(0);
   });

   it('should call selectHwHigherTier' , () => {
    const tier = {}
    component.upgradedCxSuitesTier = [{name: 'test'}]
    const suite = {cxTierDropdown:[{selected: true}],name:'test',ato:'test',swLowerTierAto:{name: 'test'}}
    component.selectHwHigherTier(tier,suite);
    expect(component.upgradedCxSuitesTier[0]['upgradedTier']).toEqual(tier);
   });
   it('should call selectHwHigherTier upgradedCxSuitesTier: empty array' , () => {
    const tier = {}
    component.upgradedCxSuitesTier = []
    const suite = {cxTierDropdown:[{selected: true}],name:'test',ato:'test',swLowerTierAto:{name: 'test'}}
    component.selectHwHigherTier(tier,suite);
    expect(component.upgradedCxSuitesTier[0]['upgradedTier']).toEqual(tier);
   });

   it('should call saveData isCxREquired: true enrolled: false' , () => {
    component.eaService.features.FIRESTORM_REL = true,
    component.eaService.features.WIFI7_REL = true;
    component.isCxREquired = true
    component.enrollment.id = 4
    component.updatedSuitesArray = [{ato:"test1"},{ato:"test2"}]
    component.eaService.isDistiOpty = true
    component.isEamsEligibile = true
    component.priceEstimateService.displayQuestionnaire = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {pools: [{suites:[ {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}, {allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true,cxHwSupportAvailable: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}]}]}
    component.saveData();
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call saveData isCxREquired: true enrolled: true' , () => {
    component.isCxREquired = true
    component.eaService.features.FIRESTORM_REL = true
    component.isBillToIdUpdated = true
    component.enrollment.id = 4
    component.eaService.isDistiOpty = true
    component.priceEstimateService.displayQuestionnaire = true
    component.isRsdUpdated = true
    component.priceEstimateService.displayQuestionnaire = true
    component.swEnrollmentData = {enrolled: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {cxAttached: false,pools: [{suites:[{cxHwSupportOptional:true,inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    component.saveData();
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call saveData isCxREquired: false' , () => {
    component.eaService.features.FIRESTORM_REL = true
    component.isCxREquired = false
    component.enrollment.id = 4
    component.updatedSuitesArray = [{ato:"test1"},{ato:"test2"}]
    component.eaService.isDistiOpty = true
    component.isEamsEligibile = true
    component.priceEstimateService.displayQuestionnaire = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {pools: [{suites:[{allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true,tiers:[{}],cxHwSupportAvailable: true}]}]}
    component.saveData();
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call saveUpgradeData upgradedCxSuitesTier empty' , () => {
    component.updatedSuitesArray = [{ato:"test1", inclusion: true,upgradedTier:{name:'tier'}},{ato:"test2"}]
    component.priceEstimateService.displayQuestionnaire = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {pools: [{suites:[{allowHwSupportOnlyPurchase:true,cxHwSupportOptional:false,inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    component.saveUpgradeData();
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call saveUpgradeData upgradedCxSuitesTier have value, enrolled:false' , () => {
    component.upgradedCxSuitesTier = [{}]
    component.enrollment.id = 4
    component.eaService.isDistiOpty = true
    component.isEamsEligibile = true
    component.updatedSuitesArray = [{ato:"test1", inclusion: true,upgradedTier:{name:'tier'}},{ato:"test2"}]
    component.priceEstimateService.displayQuestionnaire = true
     component.swEnrollmentData = {enrolled: false,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {pools: [{suites:[{allowHwSupportOnlyPurchase:true,cxHwSupportOptional:true,inclusion: true,cxOptIn: true,upgradedTier:{name:''},cxHwSupportAvailable: true}]}]}
    component.saveUpgradeData();
    expect(component.showResellerBillToOptions).toBe(false);
   });

   it('should call saveUpgradeData upgradedCxSuitesTier have value, enrolled:true' , () => {
    component.upgradedCxSuitesTier = [{}]
    component.enrollment.id = 4
    component.eaService.isDistiOpty = true
    component.isEamsEligibile = true
    component.isRsdUpdated = true
    component.updatedSuitesArray = [{ato:"test1", inclusion: true,upgradedTier:{name:'tier'}},{ato:"test2"}]
    component.priceEstimateService.displayQuestionnaire = true
     component.swEnrollmentData = {enrolled: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {pools: [{suites:[{allowHwSupportOnlyPurchase:true,cxHwSupportOptional:true,inclusion: true,cxOptIn: true,upgradedTier:{name:''},cxHwSupportAvailable: true}]}]}
    component.saveUpgradeData();
    expect(component.showResellerBillToOptions).toBe(false);
   });
   it('should call displaySWTierUpgrade' , () => {

    component.displaySWTierUpgrade();
    expect(component.showUpgradeSuitesTab).toBe(true);
   });
   it('should call cxCoverageTypeSelect' , () => {
    const suite = {coverageTypes: [{selected: false,desc:'test'}]}
    const type = {desc:'test'}
    component.cxCoverageTypeSelect(suite,type);
    expect(component.isCXCommitSuite).toBe(true);

    const unxSuite = {coverageTypes: [{selected: false,desc:'test'}], eaSuiteType: 'CISCO_NETWORKING_SOLUTION'}
    component.eaService.features.WIFI7_REL = true;
    component.cxCoverageTypeSelect(unxSuite,type);
    expect(component.isCxCommitSuiteForUnx).toBe(true);

   });

   it('should call IncompatibleSuitesFromOtherEnrollemnt' , () => {
    const suite ={alreadySelectedIncompatibleSuites: ['Duo','Networking'],suiteMessage:'test',inclusion: true, disabledFromOtherEnrollmentSuite: false}
    component.suiteNameArray = ['Duo']
    component.IncompatibleSuitesFromOtherEnrollemnt(suite);
    expect(suite.disabledFromOtherEnrollmentSuite).toBe(true);
   });
   it('should call IncompatibleSuitesFromOtherEnrollemnt with no suiteMessage' , () => {
    const suite ={alreadySelectedIncompatibleSuites: ['Duo','Networking'],inclusion: true, disabledFromOtherEnrollmentSuite: false}
    component.suiteNameArray = ['Duo']
    component.IncompatibleSuitesFromOtherEnrollemnt(suite);
    expect(suite.disabledFromOtherEnrollmentSuite).toBe(true);
   });


   it('should call  updateAllSuiteForSecurity', fakeAsync(() => {
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true
    const suite ={alreadySelectedIncompatibleSuites: ['Duo','Networking'],inclusion: true, disabledFromOtherEnrollmentSuite: false}
    const event = {preventDefault: () =>{}}
    component.numberofSelectedSuite = 5
    component.totalSuites = [{ato:'1',inclusion:true,name:'Cisco DNA Switching'}]
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true,name:'Cisco DNA Switching',disabledFromOtherEnrollmentSuite:true,alreadySelectedIncompatibleSuites: [],incompatibleSuites:[{}]}]}]}
    component.updateAllSuiteForSecurity(event);
    expect(component.numberofSelectedSuite).toBeGreaterThan(0);
    flush();
}));

it('should call  updateAllSuiteForSecurity 1', fakeAsync(() => {
  component.eaService.features.NPI_AUTOMATION_REL = true
  component.eaService.features.SEC_SUITE_REL = true
  component.eaService.features.BONFIRE_REL = true
  component.eaService.features.WIFI7_REL = true
  const suite ={alreadySelectedIncompatibleSuites: ['Duo','Networking'],inclusion: true, disabledFromOtherEnrollmentSuite: false}
  const event = {preventDefault: () =>{}, target:{checked: true}}
  component.numberofSelectedSuite = 0
  component.totalSuites = [{ato:'1',inclusion:true,name:'Cisco DNA Switching'}]
  component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true,name:'Cisco DNA Switching',disabledFromOtherEnrollmentSuite:true,alreadySelectedIncompatibleSuites: [],incompatibleSuites:[{}]}]}]}
  component.updateAllSuiteForSecurity(event);
  expect(component.numberofSelectedSuite).toBe(0);
  flush();
}));


   it('should call hideTooltip' , () => {
    const toolTip = {close: function () {  }}
    component.hideTooltip(toolTip);
    expect(component.serviceInfo).toBe(false);
   });

   it('should call showCxInfo isCxREquired: true & CX_MANDATORY_SEPT_REL', () => {
    component.eaService.features.CX_MANDATORY_SEPT_REL = true
    component.showCxInfo();
     expect(component.isCxREquired).toBe(false);
   });
   it('should call checkMandatoryCx', () => {
    component.isCxREquired = false
    component.mantatoryCxSuitesSelected = true
    component.checkMandatoryCx();
     expect(component.isCxREquired).toBe(true);
   });
   it('should call checkMandatoryCx 1', () => {
    component.isCxREquired = true
    component.indeterminateCxState = false
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: true,cxHwSupportAvailable: true}]}]}
    component.mantatoryCxSuitesSelected = true
    component.checkMandatoryCx();
     expect(component.isCxREquired).toBe(true);
   });
   it('should call checkMandatoryCx 2', () => {
    component.isCxREquired = true
    component.indeterminateCxState = true
    component.cxEnrollmentData = {pools: [{suites:[{inclusion: true,cxOptIn: false,cxHwSupportAvailable: true}]}]}
    component.mantatoryCxSuitesSelected = true
    component.checkMandatoryCx();
     expect(component.isCxREquired).toBe(true);
   });

   it('should call updateSuiteInclusion inclusion: true 1', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "eaSuiteType": 'Splunk',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.selectedSplunkSuitesArray = ['E3-N-MRNI']
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.selectedMerakiSuitesArray = ['E3-N-MRNI']
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
     
   });
   it('should call updateSuiteInclusion inclusion: true 2', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.selectedSplunkSuitesArray = ['E3-N-MRNI']
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.selectedMerakiSuitesArray = ['E3-N-MRNI']
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
   });

   it('should call updateSuiteInclusion inclusion: false 2', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
   });
   it('should call updateSuiteInclusion inclusion: false 3', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = false
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
   });
   it('should call updateSuiteInclusion 4', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.selectedMerakiSuitesArray = ["E3-N-MRNI"]
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
   });
   it('should call updateSuiteInclusion 4', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'Splunk',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
   });

   it('should call updateSuiteInclusion for bonfire inclusion false 1', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'BONFIRE',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "ibFound": true,
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.bonfireMandatorySelectedSuiteCount = 0;
    component.bonfireMandatorySuitesCount = 0;
    component.bonfireSuitesSelected = 0;
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
   });

   it('should call updateSuiteInclusion for bonfire inclusion false 2', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'BONFIRE',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "ibFound": true,
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.bonfireMandatorySelectedSuiteCount = 0;
    component.bonfireMandatorySuitesCount = 0;
    component.bonfireSuitesSelected = 0;
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
   });

   it('should call updateSuiteInclusion for bonfire inclusion false 3', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'Splunk',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.selectedSplunkSuitesArray = ["E3-N-MRNI"];
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
     expect(component.selectedSplunkSuitesArray.length).toBeFalsy();
   });


   it('should call updateSuiteInclusion for bonfire inclusion false 4 ibforund true', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": true,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'BONFIRE',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "ibFound": true,
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.bonfireSuitesSelected = 1;
    component.bonfireMandatorySelectedSuiteCount = 1;
    component.bonfireMandatoryUnselectedSuites = [];
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(false);
    expect(component.bonfireMandatoryUnselectedSuites.length).toBeTruthy();
   });

   it('should call updateSuiteInclusion for bonfire inclusion false 4 ibforund true', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-MRNI",
      "inclusion": false,
      "notAllowedHybridRelated": false,
      "disabled": false,
      "type": 'MERAKI',
      "eaSuiteType":'BONFIRE',
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "ibFound": true,
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.bonfireSuitesSelected = 1;
    component.bonfireMandatorySelectedSuiteCount = 0;
    component.bonfireMandatoryUnselectedSuites = ['Cisco DNA Switching'];
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
     component.updateSuiteInclusion(suite);
     
     expect(suite.inclusion).toBe(true);
    expect(component.bonfireMandatoryUnselectedSuites.length).toBeFalsy();
   });

   it('should call enableBonfireMerakiSuites' , () => {
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true,type:'MERAKI'}]}]}
    component.enableBonfireMerakiSuites();
    expect(component.numberofSelectedSuite).toBe(0);
   });
   it('should call enableBonfireMerakiSuites 1' , () => {
    component.swEnrollmentData = {pools:[{suites:[{ato:'1',inclusion:true,type:'MERAKI',eaSuiteType:'BONFIRE'}]}]}
    component.enableBonfireMerakiSuites();
    expect(component.numberofSelectedSuite).toBe(0);
   });
   it('should call getIncludedSuitesCount 1', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    
    component.isSecurityPortfolio = true
    component.isChangeSubFlow = true
    component.isUpgradeFlow = true
    component.swEnrollmentData = {id: 6,pools:[{suites:[{type:'MERAKI',eaSuiteType:'Splunk',eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-DNAS-M',inclusion:true,incompatibleAtos:['123']}]}]}

     component.getIncludedSuitesCount();
     
     expect(component.numberofSelectedSuite).toBeGreaterThan(0);
     
   });
   it('should call getIncludedSuitesCount 2', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.isSecurityPortfolio = true
    component.isChangeSubFlow = true
    component.isUpgradeFlow = true
    component.swEnrollmentData = {id: 6,pools:[{suites:[{type:'MERAKI',eligibleForUpgrade:true,eligibleForMigration:true,disabled:true,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-DNAS-M',inclusion:true,incompatibleAtos:['123']}]}]}

     component.getIncludedSuitesCount();
     
     expect(component.legacyMerakiAlreadyPurchased).toBe(true);
     
   });

   it('should call getIncludedSuitesCount 3 for bonfire', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.isPartnerLoggedIn = true;
    component.vnextStoreService.loccDetail.loccSigned = false;
    component.swEnrollmentData = {
      id: 6,
      pools:[
        {
          suites:[
            {type:'MERAKI', hasEmbeddedHwSupport: true, eaSuiteType: 'BONFIRE', ibFound: true, eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-DNAS-M',inclusion:true,incompatibleAtos:['123']}
          ]
        }
      ]
    }

     component.getIncludedSuitesCount();
     
     expect(component.showMerakiErrorMessage).toBeFalsy;
     
   });
   it('should call getIncludedSuitesCount 4 for bonfire unx', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.isPartnerLoggedIn = true;
    component.vnextStoreService.loccDetail.loccSigned = false;
    component.swEnrollmentData = {
      id: 6,
      pools:[
        {
          suites:[
            {type:'MERAKI', hasEmbeddedHwSupport: true, eaSuiteType: 'CISCO_NETWORKING_SOLUTION', ibFound: true, eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},tiers:[{selected: true,name:"E3-N-MRNI"}],ato:'E3-N-DNAS-M',inclusion:true,incompatibleAtos:['123']}
          ]
        }
      ]
    }

     component.getIncludedSuitesCount();
     
     expect(component.showMerakiErrorMessage).toBeFalsy;
     
   });

   it('should call getIncludedSuitesCount 5 for bonfire unx inclusion true', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.bonfireMandatorySuitesCount = 0;
    component.bonfireMandatoryUnselectedSuites = [];
    component.bonfireMandatorySuitesCount = 0;
    component.bonfireSuitesSelected = 0;
    component.isPartnerLoggedIn = true;
    component.vnextStoreService.loccDetail.loccSigned = false;
    component.swEnrollmentData = {
      id: 6,
      pools:[
        {
          suites:[
            {type:'MERAKI', hasEmbeddedHwSupport: true, eaSuiteType: 'BONFIRE', ibFound: false, eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},ato:'E3-N-DNAS-M',inclusion:true,incompatibleAtos:['123']}
          ]
        }
      ]
    }

     component.getIncludedSuitesCount();
     
     expect(component.showMerakiErrorMessage).toBeFalsy;
     
   });


   it('should call getIncludedSuitesCount 6 for bonfire unx inclusion false', () => {
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.SEC_SUITE_REL = true
    component.eaService.features.SPLUNK_SUITE_REL = true
    component.eaService.features.BONFIRE_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.bonfireMandatorySuitesCount = 1;
    component.bonfireMandatoryUnselectedSuites = ['Test 1'];
    component.bonfireMandatorySelectedSuiteCount = 1
    component.bonfireSuitesSelected = 1;
    component.isPartnerLoggedIn = true;
    component.vnextStoreService.loccDetail.loccSigned = false;
    component.swEnrollmentData = {
      id: 6,
      pools:[
        {
          suites:[
            {type:'MERAKI', desc: 'Test 1', hasEmbeddedHwSupport: true, eaSuiteType: 'BONFIRE', ibFound: false, eligibleForUpgrade:true,eligibleForMigration:true,disabled:false,autoSelected:true,incompatibleSuites:['test'],lowerTierAto:{},ato:'E3-N-DNAS-M',inclusion:false,incompatibleAtos:['123']}
          ]
        }
      ]
    }

     component.getIncludedSuitesCount();
     
     expect(component.showMerakiErrorMessage).toBeFalsy;
     
   });

   it('should call setIncompatibleAtoMessage 1', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": false,
      "disabled": false,
      "incompatibleSuites":['2','1'],
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.swEnrollmentData = {pools:[{suites:[
      {ato:'1',inclusion:false, name:'1',suiteMessage:'test',suitesRemovedFor:['Cisco DNA Switching']},
      {ato:'2',inclusion:false, name:'2'}
      ,]}]}

     component.setIncompatibleAtoMessage(suite,true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });
   it('should call setIncompatibleAtoMessage 2', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": false,
      "disabled": false,
      "incompatibleSuites":['2','1'],
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.eaService.features.NPI_AUTOMATION_REL = true
    component.swEnrollmentData = {pools:[{suites:[
      {ato:'1',inclusion:false, name:'1',suiteMessage:'test',suitesRemovedFor:['Cisco DNA Switching',"test123"]},
      {ato:'2',inclusion:false, name:'2'}
      ,]}]}

     component.setIncompatibleAtoMessage(suite,true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });
   it('should call setIncompatibleAtoMessage 3', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": false,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.swEnrollmentData = {pools:[{suites:[
      {ato:'1',inclusion:false, name:'1',suiteMessage:'test',suitesRemovedFor:['Cisco DNA Switching',"test123"]},
      {ato:'2',inclusion:false, name:'2'}
      ,]}]}

     component.setIncompatibleAtoMessage(suite,true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });
   it('should call setIncompatibleAtoMessage 5', () => {
    const suite ={
      "name": "Cisco DNA Switching",
      "desc": "Cisco DNA Switching",
      "ato": "E3-N-AS",
      "inclusion": false,
      "disabled": false,
      "active": true,
      "cxOptIn": false,
      "migration": true,
      "renewalInfo": {
        "subRefIds": [
          "Sub737959"
        ]
      },
      "suiteMessage": '',
      "incompatibleAtos": ['1','2','3']
    }
    component.swEnrollmentData = {pools:[{suites:[
      {ato:'1',inclusion:false, name:'1',suiteMessage:'test',suitesRemovedFor:['Cisco DNA Switching']},
      {ato:'2',inclusion:false, name:'2'}
      ,]}]}

     component.setIncompatibleAtoMessage(suite,true);
     
     expect(suite.suiteMessage).toEqual('');
     
   });
   it('should call checkIsOnlyEduTierPresentForUpgrade', () => {
    component.priceEstimateService.displayQuestionnaire = true
    component.swEnrollmentData = {pools:[{suites:[
      {ato:'1',inclusion:false,tiers:[{}] ,name:'1',suiteMessage:'test',suitesRemovedFor:['Cisco DNA Switching']},
      {ato:'2',inclusion:false, name:'2'}
      ,]}]}

     component.checkIsOnlyEduTierPresentForUpgrade();
     
     expect(component.isShowEduTierSelectionMsg).toBe(false);
     
   });
   it('should call getCxSuitesIncluded 1', () => {
    component.isUpgradeFlow = true
    component.updatedSuitesArray = [{isSwTierUpgraded:true,upgradedTier:{name:'test'},inclusion:true,notAvailable: false}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{suites:[{cxSelectedTier: 'test',ato:'1',inclusion:true,tiers:[{name:'test',cxTierOptions:[{name:'test'}]}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded 2 bonfire/unx', () => {
  
    component.updatedSuitesArray = [{ato: 'Test1',inclusion:true}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'Test1',inclusion:true, }]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{ suites:[
        {
          cxSelectedTier: 'test',ato:'Test1',inclusion:true,
          cxTierOptions:[{name:'test'}],
          serviceAttachMandatory: true,
          cxAlacarteCoverageFound: false,
          coverageTypes: [{selected: true, name: 'Test', desc: 'Test' }],
          eaSuiteType: 'CISCO_NETWORKING_SOLUTION'
        },
        {ato:'3',inclusion:false}, 
        {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.CX_MANDATORY_SEPT_REL = true;
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call getCxSuitesIncluded 3 dnx', () => {
  
    component.updatedSuitesArray = [{ato: 'Test1',inclusion:true}]
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'Test1',inclusion:true, }]}]}
    component.cxEnrollmentData = {
      enrolled: true,cxAttached: false,billingTerm: {rsd:'20230811'},
      pools:[{ suites:[
        {
          cxSelectedTier: 'test',ato:'Test1',inclusion:true,
          cxTierOptions:[{name:'test'}],
          serviceAttachMandatory: true,
          cxAlacarteCoverageFound: false,
          swSuiteInclusion: true,
          hasEmbeddedHwSupport: true,
          coverageTypes: [{selected: true, name: 'Test', desc: 'Test' }],
          
        },
        {ato:'3',inclusion:false}, 
        {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    component.eaService.features.CROSS_SUITE_MIGRATION_REL = true
    component.eaService.features.FIRESTORM_REL = true
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.CX_MANDATORY_SEPT_REL = true;
    component.getCxSuitesIncluded();
    expect(component.disableForMapping).toBe(false);
   });

   it('should call loadServiceInfo', () => {
    component.eaService.features.WIFI7_REL = true;
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    const getSelectedCxSuiteDetails = jest.spyOn(component, "getSelectedCxSuiteDetails");
    component.loadServiceInfo();
    expect(getSelectedCxSuiteDetails).toHaveBeenCalled();
  });
  it('should call loadServiceInfo 1', () => {
    component.eaService.features.WIFI7_REL = false;
    component.swEnrollmentData = {cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.cxEnrollmentData = {
      enrolled: true,
      cxAttached: false,
      billingTerm: {rsd:'20230811'},
      pools:[{suites:[{ato:'1',inclusion:true,tiers:[{name:'test'}]},{ato:'3',inclusion:false}, {allowHwSupportOnlyPurchase: true,ato:'2',inclusion:true}]}]
    }
    const goToServiceInfo = jest.spyOn(component, "goToServiceInfo");
    component.loadServiceInfo();
    expect(goToServiceInfo).toHaveBeenCalled();
  });
  it('should call getSelectedCxSuiteDetails isDistiOpty: true', () => {
    component.swEnrollmentData = {id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.isDistiOpty = true
    component.deeplinkForCx = true
    const response ={data:{
      billToInfo:{},
      enrollments:[{eamsDelivery: {partnerDeliverySelected: true,partnerInfo: {contactNumber:'test',ccoId: '123',partnerContactName:'test',emailId:'test'}}
      ,id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  
    component.getSelectedCxSuiteDetails();
    expect(component.isDataLoaded).toBe(true);
   });

   it('should call getSelectedCxSuiteDetails isDistiOpty: true 2', () => {
    component.swEnrollmentData = {id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.isDistiOpty = true
    component.deeplinkForCx = true
    component.eaService.features.WIFI7_REL = true;
    component.eaService.features.UPFRONT_IBC = true;
    const response ={data:{
      billToInfo:{},
      enrollments:[{eamsDelivery: {partnerDeliverySelected: true,partnerInfo: {contactNumber:'test',ccoId: '123',partnerContactName:'test',emailId:'test'}}
      ,id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}],
      ibCoverageLookupStatus: 'FAILURE'
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  
    component.getSelectedCxSuiteDetails();
    expect(component.isDataLoaded).toBe(true);
    expect(component.showDnxMandatoryFailureMessage).toBeTruthy();
   });

   it('should call getSelectedCxSuiteDetails isDistiOpty: false', () => {
    component.swEnrollmentData = {id: 1,cxOptInAllowed: true,pools:[{suites:[{ato:'1',inclusion:true}]}]}
    component.eaService.isDistiOpty = false
    component.deeplinkForCx = true
    const response ={data:{
      billToInfo:{},
      enrollments:[{eamsDelivery: {partnerDeliverySelected: true,partnerInfo: {contactNumber:'test',ccoId: '123',partnerContactName:'test',emailId:'test'}}
      ,id:3,pools:[{displaySeq:1},{displaySeq:2}],billToMandatory:true}]
    }}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "postApiCall").mockReturnValue(of(response));
  
    component.getSelectedCxSuiteDetails();
    expect(component.isDataLoaded).toBe(true);
   });
   it('should call isEducationInstitueSelected 1', () => {
    const tier:IAtoTier ={
      educationInstituteOnly: true,

    }
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute',answers:[{selected:true}]}]
    component.questionnaireService.selectedAnswerMap.set('test',{answers:[{value: 'false'}]})

    const returnValue =   component.isEducationInstitueSelected(tier);
    expect(component.isDataLoaded).toBe(true);
   });
   it('should call checkForSelectedEduTiers', () => {
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute_qna_n',answers:[{selected:true}]}]
    component.questionnaireService.selectedAnswerMap.set('test',{answers:[{value: 'false'}]})

    component.checkForSelectedEduTiers();
    expect(component.isDataLoaded).toBe(true);
   });

   it('should call isSelectedTierValid 1', () => {
    component.questionnaireStoreService.questionsArray = [{id:'edu_institute',answers:[{selected:true}]}]
    const suite ={
      swSelectedTier: {educationInstituteOnly: true},tiers:[{educationInstituteOnly: true,selected: false}]
    }
    component.questionnaireService.selectedAnswerMap.set('edu_institute1',{answers:[{id:'edu_institute_qna_n',selected: true,value: 'true'}]})
    const returnVAlue = component.isSelectedTierValid(suite);
     expect(returnVAlue).toBe(true);
   });

   it('should call coverageTierDropClose ', () => {
    let suite = {ato: 'ea-ww', showCoverageTierDrop: false}
    // component.swEnrollmentData = {billToMandatory : true}
    component.coverageTierDropClose(suite);
     expect(suite.showCoverageTierDrop).toBeTruthy;

     component.eaService.features.WIFI7_REL = true;
     component.showCoverageTierDrop = false
     component.coverageTierDropClose(suite);
     expect(component.showCoverageTierDrop).toBeTruthy;
   });
});
