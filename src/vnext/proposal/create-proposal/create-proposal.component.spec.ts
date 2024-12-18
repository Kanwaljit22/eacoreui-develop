import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from '../proposal-store.service';
import { ProposalService } from '../proposal.service';
import { CreateProposalStoreService } from './create-proposal-store.service';

import { CreateProposalComponent } from './create-proposal.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProposalRestService } from '../proposal-rest.service';
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
    console.log(test)
    
  }
  clear(){}

  displayUiTechnicalError(){}
}

describe('CreateProposalComponent', () => {
  let component: CreateProposalComponent;
  let fixture: ComponentFixture<CreateProposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProposalComponent, LocalizationPipe ],
      providers: [ ProjectService,VnextService,ProjectStoreService,CreateProposalStoreService,UtilitiesService,CurrencyPipe, { provide: EaRestService, useClass: MockEaRestService },
          EaStoreService,ProjectRestService,VnextStoreService,ProposalService,ProposalStoreService,{ provide: MessageService, useClass: MockMessageService }, DataIdConstantsService, ElementIdConstantsService],
        imports: [HttpClientTestingModule,BsDatepickerModule.forRoot(), RouterTestingModule.withRoutes([
          { path: "ea/project/:projectObjId", redirectTo: "" },
          { path: "ea/project/proposal/createproposal", redirectTo: ""},
          { path: "ea/project/proposal/:proposalObjId", redirectTo: "" },
        ])],
        schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit  ', () => {
    const projectId = '123'
    sessionStorage.setItem("projectId", projectId)
    sessionStorage.setItem("renewalId", '234');
    sessionStorage.setItem("renewalJustification", 'test');
    sessionStorage.setItem("hybridSelected", 'false');
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    component.ngOnInit();
    expect(eaStoreService.projectId).toEqual(projectId);
  });

  it('ngOnInit  hybridSelected as true', () => {
    const projectId = '123'
    component.projectStoreService.projectData.objId = '123'
    sessionStorage.setItem("projectId", projectId)
    sessionStorage.setItem("renewalId", '234');
    sessionStorage.setItem("renewalJustification", 'test');
    sessionStorage.setItem("hybridSelected", 'true');
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    component.ngOnInit();
    expect(eaStoreService.projectId).toEqual(projectId);
  });

  it('ngOnInit with project data in session', () => {
    const  projectData= {
      objId: '123', changeSubscriptionDeal: true
    }
    const loadData = jest.spyOn(component, "loadData");
    sessionStorage.setItem("projectData", JSON.stringify(projectData));
    component.ngOnInit();
    expect(loadData).toHaveBeenCalled();
  });

  it('should call appendQuoteId', () => {
    component.projectStoreService.projectData.selectedQuote = {quoteId: '123'}
    let url = 'test'
    const testUrl = url + '?qid=' + component.projectStoreService.projectData.selectedQuote.quoteId;
    const value = component.appendQuoteId(url);
    expect(value).toEqual(testUrl);
  });

  it('should call updateSession', () => {
    component.createProposalStoreService.renewalId = 123;
    component.createProposalStoreService.hybridSelected = true;
    component.createProposalStoreService.renewalJustification = 'test';
   
    const event = new Event('change')
    const getItem = jest.spyOn(window.sessionStorage, 'setItem')
    component.updateSession(event);
   // expect(getItem).toHaveBeenCalled();
  });

  it('should call setSelectedPartner', () => {
    const partner  = {};
    component.showPartnerDropdown = true;
    const checkMspAuth = jest.spyOn(component, "checkMspAuth");
    
    component.setSelectedPartner(partner);
    expect(checkMspAuth).toHaveBeenCalled();
    expect(component.showPartnerDropdown).toBeFalsy();
  });

  // it('should call search', () => {

  //   const focusInput = jest.spyOn(component, "focusInput");
    
  //   component.search();
  //   expect(focusInput).toHaveBeenCalled();
  // });

  // it('should call onDateSelection', () => {
  //   component.coTerm = true;
  //   component.selectedSubscription = {}
  //   const getDuration = jest.spyOn(component, "getDuration");
  //   const event = new Event('change')
  //   component.onDateSelection(event);
  //   expect(getDuration).toHaveBeenCalled();
  // });

  it('should call selectCountryOfTransaction', () => {
    
    const countryOfTranscation = {countryName: 'USA'}
   
    component.selectCountryOfTransaction(countryOfTranscation);
    expect(component.countryOfTranscation).toEqual(countryOfTranscation);
    expect(component.showCountryDrop).toBeFalsy();
    expect(component.countrySearch).toEqual(countryOfTranscation.countryName);

  });

  it('should call selectBillingModal', () => {
    
    const billingModel = {id: '1'}
   
    component.selectBillingModal(billingModel);
    expect(component.selectedBillingModel).toEqual(billingModel);
    expect(component.showBillingModalDrop).toBeFalsy();

  });

  it('should call selectPriceList', () => {
    
    const priceList = {name: 'US'}
   
    component.selectPriceList(priceList);
    expect(component.selectedPriceList).toEqual(priceList);
    expect(component.showPriceListDrop).toBeFalsy();

  });

  it('should call sliderChange', () => {   
    const value = 40
    component.sliderChange(value);
    expect(component.selectedDuration).toEqual(value);
  });

  // it('should call selectSubscription', () => {   
  //   const subscription = {masterAgreementId: '123',subRefId: 'as123'}
  //   const getDuration = jest.spyOn(component, "getDuration");
  //   component.selectSubscription(subscription);
  //   expect(component.selectedSubscription).toEqual(subscription);
  //   expect(getDuration).toHaveBeenCalled();
  //   expect(component.subscriptionSelectionMessage).toBeTruthy();
  // });

  it('should call selectSubscription sub as undefined', () => {   
    
    component.selectSubscription(undefined);
    // expect(component.selectedSubscription).toBeFalsy();
    expect(component.subscriptionSelectionMessage).toBeFalsy();
    expect(component.selectedDuration).toBeFalsy();

    component.eaService.features.COTERM_SEPT_REL = true;
    const resetCotermSelection = jest.spyOn(component, "resetCotermSelection");
    component.selectSubscription('');
    expect(resetCotermSelection).toHaveBeenCalled();
    expect(component.selectedDuration).toBeFalsy();

  });

  it('should call loadData', () => {   
    
    component.projectStoreService.projectEditAccess = true
    component.projectStoreService.projectData = {status: "COMPLETE"}
    const loadCreateProposalData = jest.spyOn(component, "loadCreateProposalData");
    component.loadData();
    expect(component.showCreateProposal).toBeTruthy();
    expect(loadCreateProposalData).toHaveBeenCalled();
  });

  it('should call loadCreateProposalData with selectedQuote', () => {  
    component.selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate =new Date()
    //component['eaStoreService'].changeSubFlow = true;
    component.projectStoreService.projectData = {subRefId: '123',status: "COMPLETE",selectedQuote: {quoteId: '123', distiDetail: {sourceProfileId:123}},
    dealInfo: {partnerDeal: false, distiDetail: {name: 'test'}}}
   
    component.loadCreateProposalData();
    
    
  });

  it('should call loadCreateProposalData without selectedQuote', () => {  
    component.selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate =new Date()
    //component['eaStoreService'].changeSubFlow = true;
    component.projectStoreService.projectData = {subRefId: '123',status: "COMPLETE",
    dealInfo: {partnerDeal: false, distiDetail: {name: 'test'}}}
    component.loadCreateProposalData();  
  });

  it('should call checkDurationsSelected MONTHS60', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHS60}}
    component.checkDurationsSelected($event);
    expect(component.subscriptionSelectionMessage).toBeFalsy();
    expect(component.selectedDuration).toEqual(60);
  });
  it('should call checkDurationsSelected MONTHS36', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHS36}}
    component.checkDurationsSelected($event);
    expect(component.subscriptionSelectionMessage).toBeFalsy();
    expect(component.selectedDuration).toEqual(36);
  });

  it('should call checkDurationsSelected MONTHSCUSTOM', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHSCUSTOM}}
    component.checkDurationsSelected($event);
    expect(component.subscriptionSelectionMessage).toBeFalsy();
    expect(component.coTerm).toBeFalsy();
  });

  it('should call checkDurationsSelected MONTHSCOTERM', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHSCOTERM}}
    component.checkDurationsSelected($event);
    expect(component.subscriptionSelectionMessage).toBeFalsy();
    expect(component.customDate).toBeFalsy();
  });

  it('should call checkDurationsSelected MONTHSCOTERM coterm rel', () => {
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    component.eaService.features.COTERM_SEPT_REL = true;
    const $event = {target: {value: component.durationTypes.MONTHSCOTERM}}
    const resetCotermSelection = jest.spyOn(component, "resetCotermSelection");
    component.checkDurationsSelected($event);
    expect(component.selectedDuration).toBeFalsy();
    expect(resetCotermSelection).toHaveBeenCalled();
  });

  it('should call getAndSetChangeSubDetails error in res', () => {
    component['projectStoreService'].projectData = {objId: '123'}
    const subRefId = '123'
    const response = {error: true, data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getAndSetChangeSubDetails(subRefId);
    // expect(displayMessagesFromResponse).toHaveBeenCalled();
    expect(component.subSearchApiCalled).toBeTruthy();
  });

  it('should call checkMspAuth', () => {
    component.projectStoreService.projectData = {dealInfo: {id: '123'}}
    component.selectedPartner = {beGeoId: 123}
    const response = {data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(component.isMspAuth).toBeTruthy();
    
  });
  it('should call checkMspAuth error in res', () => {
    component.projectStoreService.projectData = {dealInfo: {id: '123'}}
    component.selectedPartner = {beGeoId: 123}
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    const response = {error: true, data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
    
  });

  it('should call continueToCreateProposal', () => {
    component.selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.isMspAuth = true;
    component.coTerm = true;
    component.projectStoreService.projectData = {objId: '123'}
    component.proposalName = 'test'
    component.selectedBillingModel = {id: '1'}
    component.countryOfTranscation= {isoCountryAlpha2: "USA"}
    component.eaStartDate = new Date()
    component.selectedPriceList = {priceListId: '1',description: 'test'}
    component.selectedPartner= {beGeoName: 'test', beGeoId: 1}
    component.createProposalStoreService.renewalId = 123
    component.createProposalStoreService.renewalJustification = "test"
    component.projectStoreService.projectData = {subRefId: '123',status: "COMPLETE",selectedQuote: {quoteId: '123', distiDetail: {sourceProfileId:123}}}
    const response = {error: true, data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.continueToCreateProposal();
   
    expect(component.isCustomerScope).toBeFalsy()
  });

  it('should call createProposal with empty proposal name', () => {
    component.proposalName = '   '
    component.createProposal();
    expect(component.proposalName).toEqual('')
  });

  it('should call createProposal with no renewal id', () => {
    component.proposalName = 'test   '
    const continueToCreateProposal = jest.spyOn(component, "continueToCreateProposal");
    component.createProposal();
    expect(continueToCreateProposal).toHaveBeenCalled()
  });

  it('should call checkCountry', () => {
    component.countrySearch = 'USA'
    component.countryOfTranscation = {
      countryName: 'IND'
    }
    component.checkCountry();
    expect(component.showCountryDrop).toBeFalsy()
    
  });

  it('should call getDuration', () => {
    component.selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate = new Date()
    component.projectStoreService.projectData = {objId: '123'}
    const response = {data : 123} 
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getDuration();
    expect(component.durationOriginalValueForCoterm).toEqual(response.data)
    
  });
  it('should call getDuration error in res', () => {
    component.selectedSubscription = {subRefId: '',subscriptionEnd: '123432'} 
    component.eaStartDate = new Date()
    component.projectStoreService.projectData = {objId: '123'}
    const response = {data : 123, error: true} 
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getDuration();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });

  it('should call updateDuration', () => {
    component.selectedDuration = 123
    component.options.maxLimit = 12
    
    component.updateDuration();
    expect(component.selectedDuration).toEqual(12);
  });

  it('should call updateDuration', () => {
    component.selectedDuration = 11
    component.options.maxLimit = 14
    
    component.updateDuration();
    expect(component.selectedDuration).toEqual(12);
  });

  it('should call resetCotermSelection', () => {
    component.resetCotermSelection();
    expect(component.showCotermSelection).toBeFalsy();
    expect(component.isCoOpen).toBeFalsy();
  });

  it('should call allowCotermSelection', () => {   
    
    component.isCoOpen = false;
    component.eaStartDate = new Date();
    component.eaService.features.COTERM_SEPT_REL = true;
    const setCotermMinMaxDates = jest.spyOn(component, "setCotermMinMaxDates");
    component.allowCotermSelection();
    expect(component.isCoOpen).toBeTruthy();
    expect(setCotermMinMaxDates).toHaveBeenCalled();
  });

  it('should call cotermCalendarOpen', () => {
    component.isCoOpen = true;
    component.showCotermSelection = true;
    component.cotermCalendarOpen();
    expect(component.isCoOpen).toBeFalsy();

    component.showCotermSelection = false;
    const allowCotermSelection = jest.spyOn(component, "allowCotermSelection");
    component.cotermCalendarOpen();
    expect(allowCotermSelection).toHaveBeenCalled();
  });

  it('should call setCotermMinMaxDates', () => {
    component.eaStartDate = new Date();
    component.setCotermMinMaxDates(component.eaStartDate);
    expect(component.cotermEndDateMax).toBeTruthy();
  });

  it('should call selectOpted', () => {
    component.selectOpted();
    expect(component.isFreqSelected).toBeFalsy();
    expect(component.frequencyModelDisplayName).toBeFalsy();
  });

  it('should call selectFrequencyModal', () => {
    const capitalFrequencyModel = { id: 'Annual' }
    component.billingData = [{ id: '1' }]
    component.capitalFrequencySelected(capitalFrequencyModel);
    expect(component.frequencyModelDisplayName).toBeTruthy();
    expect(component.isFreqSelected).toBeTruthy();
  });

  it('should call selectFrequencyModal', () => {
    component.capitalFinancingData = [{ id: 'Annual' }]
    component.selectedCapitalFinancing = { id: 'Annual' };
    component.billingData = [{ id: '1' }]
    component.getSelectedFrequencyModal();
    expect(component.frequencyModelDisplayName).toBeTruthy();
    expect(component.isFreqSelected).toBeTruthy();
  });

  it('should call onUserClickEndDateSelection', () => {

    component.onUserClickEndDateSelection();

    expect(component.isUserClickedOnEndDateSelection).toBeTruthy();
  });

  it('should call selectFrequencyModal', () => {
    const option = { id: 'Annual' };
    component.selectCapitalFinance(option);
    expect(component.selectedCapitalFinancing).toBeTruthy();
    expect(component.showCapitalFinancingDrop).toBeFalsy();
  });

  it('should call getDistiName', () => {
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = { data: { distiDetail: { name: 'Ingram Mirco Inc' } } }
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getDistiName();
    expect(component.distiName).toBeTruthy();

  });

  it('should call getDistiName error in res', () => {
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = { error: true,  data: { distiDetail: { name: 'Ingram Mirco Inc' } } }
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getDistiName();
    expect(component.distiName).toBeFalsy();
    expect(component.disableContinueButton).toBeTruthy();

  });


  it('should call getPriceList error in res', () => {
    component.projectStoreService.projectData = {objId: "123456786"}
    const response = {error: true, data: {}}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getPriceList();
    expect(component.disableContinueButton).toBeTruthy();
    
  });

   it('should call getPriceList', () => {
    component.projectStoreService.projectData = {objId: "123456786"}
    const response = { data : [
      {
          "id": "Global Price List - US",
          "name": "Global Price List - US",
          "description": "Global Price List US Availability",
          "currencyCode": "USD",
          "priceListId": "1109",
          "defaultPriceList": true,
          "erpPriceListId": 1109,
          "active": false
      }
  ]}
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getPriceList();
    expect(component.priceListArray).toBeTruthy();
    
  });

  it('should call getPartners error in res', () => {
    component.projectStoreService.projectData = {objId: "123456786"}
    const response = {error: true}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getPartners();
    expect(component.partnerApiCalled).toBeTruthy();
    
  });

  it('should call getPartners data in res', () => {
    component.projectStoreService.projectData = {objId: "123456786"}
    const response = {error: false, data: [
      {
          "beGeoId": 639324,
          "beGeoName": "ConvergeOne, Inc."
      }
  ]}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getPartners();
    expect(component.partnerApiCalled).toBeTruthy();
    expect(component.selectedPartner).toBeTruthy();
  });

  it('should call getBillingModel', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = {"rid":"EAMP1726683605874","user":"prguntur","error":false,"data":{"billingModels":[{"id":"Prepaid","defaultSelection":true,"acsOption":{"mapping":"Prepaid Term"},"l2nOption":{"mapping":"PREPAY"},"uiOption":{"displaySeq":1,"displayName":"Prepaid Term"},"bomOption":{"mapping":"Prepaid Term"},"hanaOption":{"mapping":"Prepaid Term"},"ccwrOption":{"mapping":"Prepaid Term"},"owbOption":{"mapping":"Prepaid Term"}},{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"capitalFinancingFrequency":[{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"term":{"min":12.0,"max":84.0,"defaultTerm":36.0,"maxForEa2Renewal":60.0},"rsd":{"min":0,"max":270,"maxRsdForSubscriptionUpgrade":29,"defaultRsd":90,"maxCCWRsdRange":89,"maxRsdRangeForCxProposalCompletion":89},"coTerm":{"min":12,"max":84}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683605877}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getBillingModel();
    expect(component.billingData.length).toBeTruthy();
    expect(component.capitalFinancingData.length).toBeTruthy();
    expect(component.cotermEndDateRangeObj).toBeTruthy();
  });

  it('should call getBillingModel error in response', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = {"rid":"EAMP1726683605874","user":"prguntur","error": true,"data":{"billingModels":[{"id":"Prepaid","defaultSelection":true,"acsOption":{"mapping":"Prepaid Term"},"l2nOption":{"mapping":"PREPAY"},"uiOption":{"displaySeq":1,"displayName":"Prepaid Term"},"bomOption":{"mapping":"Prepaid Term"},"hanaOption":{"mapping":"Prepaid Term"},"ccwrOption":{"mapping":"Prepaid Term"},"owbOption":{"mapping":"Prepaid Term"}},{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"capitalFinancingFrequency":[{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"term":{"min":12.0,"max":84.0,"defaultTerm":36.0,"maxForEa2Renewal":60.0},"rsd":{"min":0,"max":270,"maxRsdForSubscriptionUpgrade":29,"defaultRsd":90,"maxCCWRsdRange":89,"maxRsdRangeForCxProposalCompletion":89},"coTerm":{"min":12,"max":84}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683605877}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getBillingModel();
    expect(component.disableContinueButton).toBeTruthy();
  });


  it('should call getCountryOfTransaction error in response', () => {
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = {"rid":"EAMP1726683605869","user":"prguntur","error":true,"data":{"countries":[{"countryName":"UNITED STATES","isoCountryAlpha3":"USA","isoCountryAlpha2":"US","eclmCountry":"United States","pdbCountry":"USA","theatre":null,"eclmStateMapping":true,"countryISO2Details":{"name":"UNITED STATES","code":"US","theatre":null}}],"defaultCountry":"US"},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683606028}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getCountryOfTransaction();
    expect(component.disableContinueButton).toBeTruthy();
  });

  it('should call getCountryOfTransaction data in response', () => {
    component.projectStoreService.projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    const response = {"rid":"EAMP1726683605869","user":"prguntur","error":false,"data":{"countries":[{"countryName":"UNITED STATES","isoCountryAlpha3":"USA","isoCountryAlpha2":"US","eclmCountry":"United States","pdbCountry":"USA","theatre":null,"eclmStateMapping":true,"countryISO2Details":{"name":"UNITED STATES","code":"US","theatre":null}}],"defaultCountry":"US"},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683606028}
    let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
    component.getCountryOfTransaction();
    expect(component.countryOfTransactionArray.length).toBeTruthy();
    expect(component.countryOfTranscation).toBeTruthy();
    expect(component.countrySearch).toBeTruthy();
  });
});
