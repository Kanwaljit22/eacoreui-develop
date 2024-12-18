import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, inject, InjectFlags, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { RenewalComponent } from './renewal.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectAQuoteComponent } from 'vnext/modals/select-a-quote/select-a-quote.component';
class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
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
class MockMessageService {
  displayMessagesFromResponse(test) {
    
  }
  clear(){}

  displayUiTechnicalError(){}
}
describe('RenewalComponent', () => {
  let component: RenewalComponent;
  let fixture: ComponentFixture<RenewalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalComponent,LocalizationPipe],
      providers: [ ProjectService,VnextService,ProjectStoreService,ProjectRestService,CreateProposalStoreService,UtilitiesService,CurrencyPipe, { provide: EaRestService, useClass: MockEaRestService },
        BlockUiService,  EaStoreService,  ConstantsService,VnextStoreService,ProposalStoreService,{ provide: MessageService, useClass: MockMessageService }, DataIdConstantsService, ElementIdConstantsService],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
          { path: "ea/project/:projectObjId", redirectTo: "" },
          { path: "ea/project/proposal/createproposal", redirectTo: ""},
          { path: "ea/project/proposal/:proposalObjId", redirectTo: "" },
        ])],
        schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should if project id present in session ', () => {
    const projectId = '123'
    sessionStorage.setItem("projectId", projectId)
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    component.ngOnInit();
    expect(eaStoreService.projectId).toEqual(projectId);
  });

  it('should if project data  present in session ', () => {
    const loadDataFunction = jest.spyOn(component, "loadData");
    const projectData = {objId: '123',changeSubscriptionDeal : true}
    const renewalId = '111'
    const renewalJustification = 'test 123'
    const proposalData = {objId: '123'}
    sessionStorage.setItem("projectData", JSON.stringify(projectData));
    sessionStorage.setItem("renewalId", renewalId);
    sessionStorage.setItem("renewalJustification", renewalJustification);
    sessionStorage.setItem("hybridSelected", 'true');
    sessionStorage.setItem("proposalData", JSON.stringify(proposalData));
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.ngOnInit();
    expect(projectStoreService.projectData).toEqual(projectData);
    expect(loadDataFunction).toHaveBeenCalled();
  });

  it('should if project data  present in session ', () => {
    const projectData = {objId: '123',loccDetail : {loccSigned: false}}
    const renewalId = '111'
    const renewalJustification = 'test 123'
    const proposalData = {objId: '123'};
    const loadDataFunction = jest.spyOn(component, "loadData");
    sessionStorage.setItem("projectData", JSON.stringify(projectData));
    sessionStorage.setItem("renewalId", renewalId);
    sessionStorage.setItem("renewalJustification", renewalJustification);
    sessionStorage.setItem("hybridSelected", 'false');
    sessionStorage.setItem("proposalData", JSON.stringify(proposalData));
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.ngOnInit();
    expect(projectStoreService.projectData).toEqual(projectData);
    expect(loadDataFunction).toHaveBeenCalled();
  });

  it('should call getProjectData ', () => {
    const loadDataFunction = jest.spyOn(component, "loadData");
    const objId = '111'
    const response = {data: {objId: 111, loccDetail:{loccSigned: false},changeSubscriptionDeal: true}}
    component.proposalStoreService.proposalData.objId = '123'
    component.eaStoreService.changeSubFlow
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getProjectData(objId);
    expect(loadDataFunction).toHaveBeenCalled();
  });

  it('should call getProjectData with error', () => {

    const objId = '111'
    const response = {error: true}
    
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')

    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getProjectData(objId);
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });

  it('should call loadData with changeSubFlow as true', () => {
    let val: Promise<true>;
    component.proposalStoreService.proposalData.objId = '123'
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.eaStoreService.changeSubFlow = true;
    component.loadData();
    expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/createproposal']);
  });

  it('should call loadData with changeSubFlow as false', () => {
    const loadRenewalPage = jest.spyOn(component, "loadRenewalPage");
    component.proposalStoreService.proposalData.objId = '123'
    component.loadData();
    expect(component.loadRenewalPage).toHaveBeenCalled();
  });

  it('should call redirectToProject', () => {
    let val: Promise<true>;
    component.projectStoreService.projectData.objId = '123'
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.redirectToProject();
    expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/123']);
  });

  it('should call loadRenewalPage with proposal obj id &  renewal id ', () => {
    component.proposalStoreService.proposalData = {
      status: 'COMPLETE',
      objId: '123',renewalInfo: {id: 123},
      subscriptionInfo: {justification: 'test' }
    }
  
    component.loadRenewalPage();
    expect(component.vnextService.isRoadmapShown).toBe(true);
    expect(component.vnextService.hideProposalDetail).toBe(false);
  });


  it('should call loadRenewalPage proposal obj id &  without renewal id ', () => {
    component.proposalStoreService.proposalData = {
      status: 'COMPLETE',
      objId: '123',renewalInfo: {},
      subscriptionInfo: {justification: 'test' }
    }
  
    component.loadRenewalPage();
    expect(component.vnextService.isRoadmapShown).toBe(true);
    expect(component.vnextService.hideProposalDetail).toBe(false);
    expect(component.isHybridOfferQnaSelected).toBe(true);
  });

  it('should call loadRenewalPage  without propsal obj id  & renewalId', () => {

    component.createProposalStoreService.renewalId = 123;
    const getSubscriptionsList = jest.spyOn(component, "getSubscriptionsList");
    component.loadRenewalPage();
    expect(component.vnextService.isRoadmapShown).toBe(true);
    expect(component.vnextService.hideProposalDetail).toBe(false);
    expect(component.isHybridOfferQnaSelected).toBe(true);
    expect(component.getSubscriptionsList).toHaveBeenCalled();
  });

  it('should call loadRenewalPage -> renewalJustification  without propsal obj id', () => {

    component.createProposalStoreService.renewalJustification = 'test';
    component.eaService.features.SPNA_REL = true 
    component.eaService.isSpnaFlow = true
    const getSubscriptionsList = jest.spyOn(component, "getSubscriptionsList");
    component.loadRenewalPage();
    expect(component.justification).toEqual('test');
    expect(component.existingSubscriptions).toBe(false);
    expect(component.isExistingSubscriptionSelected).toBe(true);
  });

  it('should call getSubscriptionsList with createProposalStoreService.renewalId', () => {

    component.createProposalStoreService.renewalId = 123;
    const response ={
      data: {
        selectedSubRefIds: [1,2,3]
      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getSubscriptionsList();
    expect(component.subscriptionsList).toEqual([]);
    expect(component.selectedSubRefIds).toEqual(response.data.selectedSubRefIds);
  });

  it('should call getSubscriptionsList with error in response', () => {

    component.createProposalStoreService.renewalId = 123;
    component.projectStoreService.projectData ={
      loccDetail: {
        loccSigned: false
      }
    }
    const response ={
      data: { },
      error: true
    }
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getSubscriptionsList();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
    expect(component.showLoccWarning).toBe(true);
    
  });


  it('should call getAndSetSelectedSubscriptions', () => {
    component.selectedSubRefIds = ['1','2','3'];
    component.subscriptionsList = [{subRefId: '1'},{subRefId: '8'}]
    
    const getSearchedSubscription = jest.spyOn(component, 'getSearchedSubscription')
  
    component.getAndSetSelectedSubscriptions({});
    expect(getSearchedSubscription).toHaveBeenCalled();
    
    
  });

  it('should call setSelectedSubscriptions', () => {
    component.selectedSubRefIds = ['1','2'];
    component.subscriptionsList = [{subRefId: '1',selected: false},{subRefId: '8',selected: false}];
    component.setSelectedSubscriptions();
    expect(component.subscriptionsList[0].selected).toBe(true);
    expect(component.subscriptionsList[1].selected).toBe(false);
  });

  it('should call selectSubcription for selection', () => {
    const $event = {target: {checked: true}}
    component.selectedSubRefIds = [];
    const subscription = {subRefId: 123, selected: true,hasCollab: true}
    component.hasCollab = true;
    const checkOnTimeSubEndDate = jest.spyOn(component, 'checkOnTimeSubEndDate')
    component.selectSubcription(subscription, $event);
    expect(checkOnTimeSubEndDate).toHaveBeenCalled();
  });

  it('should call selectSubcription for deselection', () => {
    const $event = {target: {checked: true}}
    component.selectedSubRefIds = [];
    const subscription = {subRefId: 123, selected: true,hasCollab: true}
    component.selectedSubRefIds = [123,324]
    component.hasCollab = true;
    const checkOnTimeSubEndDate = jest.spyOn(component, 'checkOnTimeSubEndDate')
    component.selectSubcription(subscription, $event);
    expect(checkOnTimeSubEndDate).toHaveBeenCalled();
  });
  it('should call updateSession', () => {
    component.proposalStoreService.proposalData.objId = '123';
    component.createProposalStoreService.renewalId = 123;
    component.createProposalStoreService.hybridSelected = true;
    component.createProposalStoreService.renewalJustification = 'test';
    component.projectStoreService.projectData.dealInfo = {}
    const event = new Event('change')
    const sessionStorageMock = (() => {
      let store = {};
    
      return {
        getItem(key) {
          return store[key] || null;
        },
        setItem(key, value) {
          store[key] = value?.toString();
        },
        removeItem(key) {
          delete store[key];
        },
        clear() {
          store = {};
        }
      };
    })();
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock
    });
    
    const setItem = jest.spyOn(window.sessionStorage, 'setItem')
    component.updateSession(event);
    expect(setItem).toHaveBeenCalled();
  });

  it('should call appendQuoteId', () => {
    component.projectStoreService.projectData.selectedQuote = {quoteId: '123'}
    let url = 'test'
    const testUrl = url + '&qid=' + component.projectStoreService.projectData.selectedQuote.quoteId;
    const value = component.appendQuoteId(url);
    expect(value).toEqual(testUrl);
  });
  it('should call cleanUp', () => {
    
    component.cleanUp();
    expect(component.createProposalStoreService.renewalId).toEqual(0);
    expect(component.createProposalStoreService.renewalJustification).toEqual('');
  });

  it('should call resetSubsciptionsList', () => {
    
    component.resetSubsciptionsList();
    expect(component.noSubscriptionFoundMsg).toEqual('');
    expect(component.subscriptionsList).toEqual([]);
    expect(component.selectedSubRefIds).toEqual([]);
    expect(component.collabSelectedList).toEqual([]);
  });

  it('should call goToSubUi with subUiUrl', () => {
    component.subUiUrl = '123'
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToSubUi('123');
    expect(call).toHaveBeenCalled();
  });

  it('should call goToSubUi without subUiUrl', () => {

    const response = {data: 'testUrl'}

    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToSubUi('123');
    expect(call).toHaveBeenCalled();
  });



  it('should call convertNumberToWords', () => {
    const one = 'one'
    const test = component.convertNumberToWords(1);
    expect(one).toEqual(test);
    
  });

  it('should call iscontinue for justification', () => {
    component.justification  = 'one  '
    component.iscontinue();
    expect(component.justification).toEqual('one');
    
  });

  it('should call iscontinue', () => {
    const value = component.iscontinue();
    expect(value).toBeFalsy();
    
  });
  it('should call iscontinue if isExistingSubscriptionSelected', () => {
    component.justification  = 'one  '
    component.isExistingSubscriptionSelected = true;
    component.existingSubscriptions = false;
    component.isHybridOfferQnaSelected = true;
    const value = component.iscontinue();
    expect(value).toBeTruthy(); 
  });

  it('should call selectHybridOffer', () => {
  
    component.noSubscriptionFoundMsg = 'test';
    component.projectStoreService.projectData =  {scopeInfo: {returningCustomer: false}}
    component.hybridOfferSubsciptions = false;
    component.subscriptionsList = []
    const $event = {target: {value: true}}
    const resetSubsciptionsList = jest.spyOn(component, 'resetSubsciptionsList')
    
    component.selectHybridOffer($event);
    expect(component.isExistingSubscriptionSelected).toBeTruthy(); 
    expect(resetSubsciptionsList).toHaveBeenCalled();
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });

  it('should call showHybridOfferQna', () => {
  
    const $event = {target: {value: true}}
    const resetSubsciptionsList = jest.spyOn(component, 'resetSubsciptionsList')
    
    component.showHybridOfferQna($event);
    expect(component.isExistingSubscriptionSelected).toBeTruthy(); 
    expect(resetSubsciptionsList).toHaveBeenCalled();
    expect(component.hybridOfferSubsciptions).toBeFalsy(); 
  });

  it('should call selectExistingSubscription', () => {
    component.noSubscriptionFoundMsg = 'test';
    component.existingSubscriptions = true;
    component.subscriptionsList = []
    const $event = {target: {value: true}}
    const resetSubsciptionsList = jest.spyOn(component, 'resetSubsciptionsList')
    component.projectStoreService.projectData =  {scopeInfo: {returningCustomer: false}}
    component.selectExistingSubscription($event);
    expect(component.isExistingSubscriptionSelected).toBeTruthy(); 
    expect(resetSubsciptionsList).toHaveBeenCalled();
    expect(component.hybridOfferSubsciptions).toBeFalsy(); 
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });

  it('should call searchSubscription', () => {
    component.projectStoreService.projectData =  {scopeInfo: {returningCustomer: false}}
    const $event =  {value: 'test  ', target: {value: 'yes'}}
    component.searchSubscription($event);
    
    expect($event.value).toEqual(undefined)
  });
  it('should call searchSubscription without value', () => {
   
    const $event = undefined
    component.searchSubscription($event);
    
    expect(component.noSubscriptionFoundMsg).toEqual(''); 
    expect(component.searchedSubscription).toEqual(undefined); 
  });

  it('should call checkOnTimeSubEndDate', () => {
   component.subscriptionsList = 
   [{selected: true,typeDesc: 'follow-on',endDateStr: '123'},
   {selected: true,typeDesc: 'follow-on',endDateStr: '123'},
   {selected: true,typeDesc: 'follow-on',endDateStr: '1233'},
   {selected: true,typeDesc: 'Early',endDateStr: '1231'}]
    component.checkOnTimeSubEndDate();
    
    expect(component.displayEndDateMsg).toBeFalsy(); 
    
  });

  it('should call addSubscription 1', () => {
    component.selectedSubRefIds = []
    component.searchedSubscription = {hasCollab: true,subRefId: '231',selected: true,typeDesc: 'follow-on',endDateStr: '123'}
    component.subscriptionsList = 
    [{subRefId: '123',selected: true,typeDesc: 'follow-on',endDateStr: '123'},
    {subRefId: '231',selected: true,typeDesc: 'follow-on',endDateStr: '123'},
    {subRefId: '644',selected: true,typeDesc: 'follow-on',endDateStr: '1233'},
    {subRefId: '876',selected: true,typeDesc: 'Early',endDateStr: '1231'}]
     component.addSubscription();
     
     expect(component.searchedSubscription).toEqual(undefined); 
     
   });

   it('should call addSubscription 2', () => {
    component.selectedSubRefIds = []
    component.searchedSubscription = {hasCollab: true,subRefId: '999',selected: true,typeDesc: 'follow-on',endDateStr: '123'}
    component.subscriptionsList = 
    [{subRefId: '123',selected: true,typeDesc: 'follow-on',endDateStr: '123'},
    {subRefId: '231',selected: true,typeDesc: 'follow-on',endDateStr: '123'},
    {subRefId: '644',selected: true,typeDesc: 'follow-on',endDateStr: '1233'},
    {subRefId: '876',selected: true,typeDesc: 'Early',endDateStr: '1231'}]
     component.addSubscription();
     
     expect(component.searchedSubscription).toEqual(undefined); 
     
   });

   it('should call createSubscription 1', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.justification = 'test';
    component.proposalStoreService.proposalData.objId = '1233'
    
     component.createSubscription();
     
     expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/1233']);
     
   });

   it('should call createSubscription 2', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.justification = 'test';
    component.isHybridOfferQnaSelected = true;
    component.selectedSubRefIds = ['123','234']

    const response ={data:{id:'123'}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
     component.createSubscription();
     
     expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/createproposal']);
     
   });
   it('should call createSubscription 3', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.justification = 'test';
 
    component.isHybridOfferQnaSelected = true;
   
     component.createSubscription();
     
     expect(component["router"].navigate).toHaveBeenCalledWith(['ea/project/proposal/createproposal']);
     
   });

   it('should call getSearchedSubscription 1', () => {

    component.justification = 'test';
    component.isHybridOfferQnaSelected = true;
    component.selectedSubRefIds = ['123','234']
    component.projectStoreService.projectData = {smartAccount: {smrtAccntName: 'name'}}
    const response ={data:{subscriptions:[{smartAccountName: 'test'}] }}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
     component.getSearchedSubscription('123', true);
     
     expect(component.noSubscriptionFoundMsg).toEqual('');
     
   });

   it('should call getSearchedSubscription 2', () => {

    component.justification = 'test';
    component.isHybridOfferQnaSelected = true;
    component.selectedSubRefIds = ['123','234']
    component.projectStoreService.projectData = {smartAccount: {smrtAccntName: 'name'}}
    const response ={data:{ }}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
     component.getSearchedSubscription('123', true);
     
     expect(component.noSubscriptionFoundMsg).toEqual('');
     
   });
   it('should call getSearchedSubscription 3', () => {

    component.justification = 'test';
    component.isHybridOfferQnaSelected = true;
    component.selectedSubRefIds = ['123','234']
    component.hybridOfferSubsciptions = true
    component.eaService.features.RENEWAL_SEPT_REL = true
    component.projectStoreService.projectData = {smartAccount: {smrtAccntName: 'name'}}
    const response ={data:{subscriptions:[{smartAccountName: 'test'}] }}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
     component.getSearchedSubscription('123', true);
     
     expect(component.noSubscriptionFoundMsg).toEqual('');
     
   });

   it('should call handleSubscriptionChecked 2', () => {

    let sub = {
      "selected": true,
        "subRefId": "SR203489",
        "status": "ACTIVE",
        "startDate": 1724742000000,
        "endDate": 1819263600000,
        "startDateStr": "27-Aug-2024",
        "endDateStr": "26-Aug-2027",
        "creditType": "ONE",
        "subscriptionId": "SC111949",
        "masterAgreementId": "EA50062",
        "statusDesc": "Active",
        "offerType": "EA 3.0",
        "partiallyOverlappingSubRefIds":['SR203482'],
        "fullyOverlappingSubRefIds":['SR203482'],
        "type": "EARLY_FOLLOWON",
        "partner": {
            "beGeoName": "CONVERGEONE INC",
            "pgtmvBeGeoId": 272241792
        },
        "suites": [
            "Secure Endpoint"
        ],
        "daysLeft": 1087,
        "buyingProgramTransactionType": "MSEA",
        "ea3Subscription": true,
        "typeDesc": "Early",
        "totalEaDuration": 36,
        "displayStartDate": "2024-08-27",
        "displayEndDate": "2027-08-26",
        "remainingEaDuration": 35.8064516129032
      }
      component.handleSubscriptionChecked(sub);
      expect(component.selectedSubRefIds).toEqual[sub.subRefId]

      sub = {
        "selected": false,
          "subRefId": "SR203489",
          "status": "ACTIVE",
          "startDate": 1724742000000,
          "endDate": 1819263600000,
          "startDateStr": "27-Aug-2024",
          "endDateStr": "26-Aug-2027",
          "creditType": "ONE",
          "subscriptionId": "SC111949",
          "masterAgreementId": "EA50062",
          "statusDesc": "Active",
          "offerType": "EA 3.0",
          "partiallyOverlappingSubRefIds":[],
          "fullyOverlappingSubRefIds":['SR203482'],
          "type": "EARLY_FOLLOWON",
          "partner": {
              "beGeoName": "CONVERGEONE INC",
              "pgtmvBeGeoId": 272241792
          },
          "suites": [
              "Secure Endpoint"
          ],
          "daysLeft": 1087,
          "buyingProgramTransactionType": "MSEA",
          "ea3Subscription": true,
          "typeDesc": "Early",
          "totalEaDuration": 36,
          "displayStartDate": "2024-08-27",
          "displayEndDate": "2027-08-26",
          "remainingEaDuration": 35.8064516129032
        }

      component.handleSubscriptionChecked(sub);
      expect(component.selectedSubRefIds).toEqual([])
   });

   it('should call checkMseaSubscription 2', () => {
    component.renewalSubscriptions = [
      {
        "subRefId": "SR203489",
        "status": "ACTIVE",
        "selected": true,
        "buyingProgramTransactionType": "MSEA"
      }
    ]
    component.checkMseaSubscription();
    expect(component.showMseaWarning).toBe(true);
   })
   describe('addSelectedSubscription', () => {
    let component: RenewalComponent;
  
    beforeEach(() => {
      fixture = TestBed.createComponent(RenewalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should update an existing subscription in renewalSubscriptions', () => {
      component.renewalSubscriptions = [
        { subRefId: 'SR123', selected: false, ea3Subscription: true }
      ];
  
      const subscription = { subRefId: 'SR123', selected: false, ea3Subscription: true };
      const handleSubscriptionCheckedSpy = jest.spyOn(component, 'handleSubscriptionChecked');
  
      component.addSelectedSubscription(subscription);
  
      expect(component.renewalSubscriptions.length).toBe(1);
      expect(component.renewalSubscriptions[0].selected).toBe(true);
      expect(handleSubscriptionCheckedSpy).toHaveBeenCalledWith({ ...subscription, selected: true });
    });
  
    it('should add a new subscription to renewalSubscriptions', () => {
      component.renewalSubscriptions = [];
  
      const subscription = { subRefId: 'SR124', selected: false, ea3Subscription: true };
      const handleSubscriptionCheckedSpy = jest.spyOn(component, 'handleSubscriptionChecked');
  
      component.addSelectedSubscription(subscription);
  
      expect(component.renewalSubscriptions.length).toBe(1);
      expect(component.renewalSubscriptions[0].subRefId).toBe('SR124');
      expect(component.renewalSubscriptions[0].selected).toBe(true);
      expect(handleSubscriptionCheckedSpy).toHaveBeenCalledWith({ ...subscription, selected: true });
    });
  
    it('should update an existing subscription in otherSubscriptions', () => {
      component.otherSubscriptions = [
        { subRefId: 'SR125', selected: false, ea3Subscription: false }
      ];
  
      const subscription = { subRefId: 'SR125', selected: false, ea3Subscription: false };
      const handleSubscriptionCheckedSpy = jest.spyOn(component, 'handleSubscriptionChecked');
  
      component.addSelectedSubscription(subscription);
  
      expect(component.otherSubscriptions.length).toBe(1);
      expect(component.otherSubscriptions[0].selected).toBe(true);
      expect(handleSubscriptionCheckedSpy).toHaveBeenCalledWith({ ...subscription, selected: true });
    });
  
    it('should add a new subscription to otherSubscriptions', () => {
      component.otherSubscriptions = [];
  
      const subscription = { subRefId: 'SR126', selected: false, ea3Subscription: false };
      const handleSubscriptionCheckedSpy = jest.spyOn(component, 'handleSubscriptionChecked');
  
      component.addSelectedSubscription(subscription);
  
      expect(component.otherSubscriptions.length).toBe(1);
      expect(component.otherSubscriptions[0].subRefId).toBe('SR126');
      expect(component.otherSubscriptions[0].selected).toBe(true);
      expect(handleSubscriptionCheckedSpy).toHaveBeenCalledWith({ ...subscription, selected: true });
    });
  });
  it('should call selectHybridOffer 1', () => {
  
    component.noSubscriptionFoundMsg = 'test';
    component.projectStoreService.projectData =  {scopeInfo: {returningCustomer: false}}
    component.hybridOfferSubsciptions = false;
    component.subscriptionsList = []
    const $event = {target: {value: true}}
    const resetSubsciptionsList = jest.spyOn(component, 'resetSubsciptionsList')
    component.eaService.features.RENEWAL_SEPT_REL = true
    component.selectHybridOffer($event);
    expect(component.isExistingSubscriptionSelected).toBeTruthy(); 
    expect(resetSubsciptionsList).toHaveBeenCalled();
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });
  it('should call toggleDisplaySubscriptions', () => {
    const value = 'test'
    component.toggleDisplaySubscriptions(value);

    expect(component.displaySearchedSubscriptions).toEqual(value)
  });
  it('should call openQuoteSelection', () => {
    component.projectStoreService.projectData = {dealInfo:{id:''}}
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(SelectAQuoteComponent,{ windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext',  backdrop : 'static',  keyboard: false  });
    modalRef.result =  new Promise((resolve) => resolve({continue: true,engage: true
    }));

    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.projectStoreService.projectData = {selectedQuote:undefined,referrerQuotes:[]}
    component.openQuoteSelection();
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });
  it('should call checkandSelectSusbscriptions', () => {
    const subscriptions = [{}]
    component.checkandSelectSusbscriptions(subscriptions);
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });
  it('should call checkandSelectSusbscriptions 1', () => {
    const subscriptions = [{masterAgreementId:123}]
    component.checkandSelectSusbscriptions(subscriptions);
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });
  it('should call selectAlreadySelectedSubsc', () => {
    component.renewalSubscriptions = [{subRefId:'test'}]
    component.selectAlreadySelectedSubsc();
    expect(component.noSubscriptionFoundMsg).toEqual('')
  });
});
