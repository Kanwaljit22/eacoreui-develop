import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
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
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from '../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../price-estimation/price-estimate.service';
import { EditProposalParametersComponent } from './edit-proposal-parameters.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class MockProposalRestService{
  getApiCall() {
    return of({
      data: {
        proposal:{}
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
        subscriptionEndDate: '123123123123',
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

describe('EditProposalParametersComponent', () => {
  let component: EditProposalParametersComponent;
  let fixture: ComponentFixture<EditProposalParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProposalParametersComponent , LocalizationPipe],
      imports: [HttpClientTestingModule,BsDatepickerModule.forRoot(), RouterTestingModule.withRoutes([
        { path: "ea/project/:projectObjId", redirectTo: "" },
        { path: "ea/project/proposal/createproposal", redirectTo: ""},
        { path: "ea/project/proposal/:proposalObjId", redirectTo: "" },
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers: [ PriceEstimateService,ProjectService,VnextService,PriceEstimateStoreService,ProjectStoreService,CreateProposalStoreService,UtilitiesService,CurrencyPipe, { provide: EaRestService, useClass: MockEaRestService },
        EaStoreService,ProjectRestService,VnextStoreService,ProposalService,ProposalStoreService,{ provide: MessageService, useClass: MockMessageService }, {provide: ProposalRestService, useClass:MockProposalRestService}, DataIdConstantsService, ElementIdConstantsService],
    
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProposalParametersComponent);
    component = fixture.componentInstance;
    component.proposalStoreService.proposalData = {subRefId: 'sub123',
      dealInfo:{distiDetail:{name:'disti'}},
      billingTerm: {billingModel: 'test',term:36,rsd: '123312332121',coterm: {billDayInMonth:123,endDate:'123321',subRefId:'sub123'}},
    name: 'proposal test', subscriptionInfo: {existingCustomer: true,justification: 'test'}}
    fixture.detectChanges();
  });

  it('should create', () => {
    component.selectedSubscription = {subscriptionEnd: '123123123123'}
    expect(component).toBeTruthy();
  });

  it('should call oninit', () => {
    component.selectedSubscription = {subscriptionEnd: '123123123123'}
    const getPartners = jest.spyOn(component, "getPartners");
    component.ngOnInit()
    expect(getPartners).toHaveBeenCalled();
    expect(component.selectedProposalParamsObj.proposalName).toEqual(component.proposalStoreService.proposalData.name)
  });
  it('should call oninit with chng sub flow', () => {
    component.proposalStoreService.mspInfo ={ mspPartner: true};
    component.proposalStoreService.proposalData.buyingProgramTransactionType = undefined
    component.proposalStoreService.proposalData.dealInfo.distiDetail = undefined;
    component['projectStoreService'].projectData = { dealInfo :  {distiDetail: {}}}
    component.selectedSubscription = {subscriptionEnd: '123123123123'}
    const getPartners = jest.spyOn(component, "getPartners");
    component.ngOnInit()
    expect(getPartners).toHaveBeenCalled();
    expect(component.selectedProposalParamsObj.proposalName).toEqual(component.proposalStoreService.proposalData.name)
  });


  it('should call oninit with coterm flow', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component.proposalStoreService.mspInfo ={ mspPartner: true}
    component.proposalStoreService.proposalData.dealInfo.distiDetail = undefined;
    component['projectStoreService'].projectData = { dealInfo :  {distiDetail: {}}}
    component.proposalStoreService.proposalData.billingTerm = {
      "rsd": "20250605",
      "billingModel": "Prepaid",
      "term": 3.1666666666667,
      "coterm": {
          "endDate": "20250909",
          "billDayInMonth": -1
      }
  }
  component.isChangeSubFlow = false;
  component.selectedSubscription = undefined
    const checkForCotermEndDatesDisabled = jest.spyOn(component, "checkForCotermEndDatesDisabled");
    component.ngOnInit()
    expect(checkForCotermEndDatesDisabled).toHaveBeenCalled();
    expect(component.cotermEndDate).toBeTruthy();
    expect(component.showCotermSelection).toBeTruthy();
    expect(component.isCotermAdded).toBeTruthy();
  });

  it('should call oninit with coterm flow with subscription', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component.proposalStoreService.mspInfo ={ mspPartner: true}
    component.proposalStoreService.proposalData.dealInfo.distiDetail = undefined;
    component['projectStoreService'].projectData = { dealInfo :  {distiDetail: {}}}
    component.proposalStoreService.proposalData.billingTerm = {
      "rsd": "20250605",
      "billingModel": "Prepaid",
      "term": 3.1666666666667,
      "coterm": {
          "endDate": "20250909",
          "billDayInMonth": -1,
          "subRefId": "SR12345"
      }
  }
  component.isChangeSubFlow = false;
    const checkForCotermEndDatesDisabled = jest.spyOn(component, "checkForCotermEndDatesDisabled");
    component.ngOnInit()
    expect(checkForCotermEndDatesDisabled).toHaveBeenCalled();
    expect(component.cotermEndDate).toBeTruthy();
    expect(component.showCotermSelection).toBeTruthy();
    expect(component.selectedSubscription).toBeTruthy();
  });

  it('should call updateProposalName with empty string', () => {
    const $event = {target: {value: '     '}}

    component.updateProposalName($event);
    expect(component.selectedProposalParamsObj.proposalName).toEqual('');
  });

  it('should call updateProposalName', () => {
    const $event = {target: {value: 'test   '}}
    component.selectedProposalParamsObj.proposalName = 'qwe'
    component.updateProposalName($event);
    expect(component.selectedProposalParamsObj.proposalName).toEqual('test');
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
    expect(component.coTerm).toBeFalsy();
    expect(component.selectedProposalParamsObj.selectedDuration).toEqual(60);
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
    expect(component.coTerm).toBeFalsy();
    expect(component.selectedProposalParamsObj.selectedDuration).toEqual(36);
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
    
    expect(component.customDate).toBeFalsy();
  });

  it('should call checkDurationsSelected MONTHSCOTERM', () => {
    component.eaService.features.COTERM_SEPT_REL = true
    component.durationTypes = {
      MONTHS36: 'MONTHS36',
      MONTHS60: 'MONTHS60',
      MONTHSCUSTOM: 'MONTHSCUSTOM',
      MONTHSCOTERM: 'MONTHSCOTERM'
    };
    const $event = {target: {value: component.durationTypes.MONTHSCOTERM}}
    const resetCotermSelection = jest.spyOn(component, "resetCotermSelection");
    component.selectedSubscription = undefined;
    component.checkDurationsSelected($event);
    expect(component.customDate).toBeFalsy();
    expect(component.selectedProposalParamsObj.selectedDuration).toBeFalsy();
    expect(resetCotermSelection).toHaveBeenCalled();

    component.selectedSubscription = {subRefId: "SR2345", subscriptionEnd: "20250908"};
    const getDuration = jest.spyOn(component, "getDuration");
    component.checkDurationsSelected($event);
    expect(component.showCotermSelection).toBeTruthy();
    expect(component.cotermEndDatesDisabled.length).toBeFalsy();
    expect(getDuration).toHaveBeenCalled();
  });


  it('should call selectCountryOfTransaction', () => {
   const country = {isoCountryAlpha2: 'US'}
   component.selectedProposalParamsObj = {countryOfTransaction: {isoCountryAlpha2: 'USA'}}
   
    component.selectCountryOfTransaction(country);
    
    expect(component.showModalDropObj.showCountryDrop).toBeFalsy();
  });

  it('should call selectPriceList', () => {
    const priceList = {priceListId: 'test'}
    component.selectedProposalParamsObj = {selectedPriceList: {priceListId: 'qwe',description: 'DESC'}}
    component.proposalStoreService.proposalData.priceList = { id: 'test1'}
     component.selectPriceList(priceList);
     
     expect(component.showModalDropObj.showPriceListDrop).toBeFalsy();
   });

   it('should call selectBillingModal', () => {
    const billingModel = {id: 'test'}
    component.selectedProposalParamsObj = {selectedBillingModel: ''}
    component.proposalStoreService.proposalData.billingTerm = { billingModel: 'test1'}
     component.selectBillingModal(billingModel);
     
     expect(component.showModalDropObj.showBillingModalDrop).toBeFalsy();
   });

   it('should call onUserClickDateSelection', () => {
   
    component.onUserClickDateSelection();
     
     expect(component.isUserClickedOnDateSelection).toBeTruthy();
   });

   it('should call updateDuration', () => {
    component.simpleSlider.value = 12
    component.selectedProposalParamsObj.selectedDuration = 123
    const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
    component.options.maxLimit = 36
    component.updateDuration();
    
    expect(isproposalParamsUpdated).toHaveBeenCalled();
  });

  it('should call updateDuration', () => {
    component.selectedDuration = 11
    component.options.maxLimit = 15
    const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
    component.selectedProposalParamsObj.selectedDuration = 10
    component.updateDuration();
   
    expect(isproposalParamsUpdated).toHaveBeenCalled();
  });

  it('should call checkMspAuth', () => {
    component.selectedProposalParamsObj.selectedPartner = {beGeoId:  123}
    component['projectStoreService'].projectData = {dealInfo: {id: '123'}}
   
    const response = {data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(component.showMspQues).toBeTruthy();
    
  });

  it('should call checkMspAuthQuoteID', () => {
    component.selectedProposalParamsObj.selectedPartner = {beGeoId:  123}
    component['projectStoreService'].projectData = {dealInfo: {id: '123'}}
   
    const response = {data: {mspInfo: {mspPartner: true}}}
    component['proposalStoreService'].proposalData = {
      dealInfo: {
        referrerQuoteId: "123457"
      }
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(component.showMspQues).toBeTruthy();
    
  });
  
  it('should call checkMspAuth no msp partner', () => {
    component.selectedProposalParamsObj.selectedPartner = {beGeoId:  123}
    component['projectStoreService'].projectData = {dealInfo: {id: '123'}}
   
    const response = {data: {mspInfo: {mspPartner: false}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(component.showMspQues).toBeFalsy();
    
  });
  it('should call checkMspAuth error in res', () => {
    component['projectStoreService'].projectData = {dealInfo: {id: '123'}}
    component.selectedProposalParamsObj.selectedPartner = {beGeoId:  123}
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    const response = {error: true, data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.checkMspAuth();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
    
  });

  it('should call selectSubscription', () => {
    
    component.selectedProposalParamsObj = {rsd: new Date()}

    component.selectSubscription('');
    expect(component.subscriptionSelectionMessage).toBe(false);
    expect(component.selectedDuration).toBeFalsy();

    component.selectedProposalParamsObj = {rsd: new Date()}
    component.selectSubscription({"subRefId": "SR202885", "subscriptionEnd": "07/26/2027"});
    expect(component.subscriptionSelectionMessage).toBe(true);
    expect(component.showCotermSelection).toBeFalsy();
    expect(component.cotermEndDatesDisabled.length).toBeFalsy();
  });

  it('should call selectSubscription coterm', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component.selectedProposalParamsObj = {rsd: new Date()}

    const resetCotermSelection = jest.spyOn(component, "resetCotermSelection");
    component.selectSubscription('');
    expect(component.selectedProposalParamsObj.selectedDuration).toBeFalsy();
    expect(resetCotermSelection).toHaveBeenCalled();

    component.selectedProposalParamsObj = {rsd: new Date()}
    component.selectSubscription({"subRefId": "SR202885", "subscriptionEnd": "07/26/2027"});
    expect(component.cotermEndDate).toBeTruthy();
    expect(component.showCotermSelection).toBeTruthy();
    expect(component.cotermEndDatesDisabled.length).toBeFalsy();
  });

  it('should call updateMspSelection', () => {
    const event = {target: {value: '     '}}
    component['priceEstimateService'].mspSelectedValue = true
    component.proposalStoreService.mspInfo.mspProposal = false;
    component.updateMspSelection(event);
    expect(component.updateMsp).toBeTruthy();
    
  });

  it('should call updateMspSelection', () => {
    const event = {target: {value: '     '}}
    component['priceEstimateService'].mspSelectedValue = false
    component.proposalStoreService.mspInfo.mspProposal = false;
    component.updateMspSelection(event);
    expect(component.updateMsp).toBe(false);
    
  });

  it('should call updateJustification', () => {
    const event = ' test    '
   
    component.updateJustification(event);
    expect(component.selectedProposalParamsObj.subscriptionInfo.justification).toEqual('test');
    
  });

  // it('should call search', () => {
  //   const focusInput = jest.spyOn(component, "focusInput");
  //   component.search();
  //   expect(focusInput).toHaveBeenCalled();
    
  // });

  it('should call getAndSetChangeSubDetails error in res', () => {
    component['projectStoreService'].projectData = {objId: '123'}
    const subRefId = '123'
    component.selectedProposalParamsObj.selectedPartner = {beGeoId:  123}
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    const response = {error: true, data: {mspInfo: {mspPartner: true}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getAndSetChangeSubDetails(subRefId);
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });



  it('should call onDateSelection', () => {
    component.coTerm = false;
    component.proposalStoreService.proposalData.billingTerm.rsd = '1111111111111'   
    const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
    const event = new Event('change')
    component.isUserClickedOnDateSelection = true
    component.onDateSelection(event);
    expect(isproposalParamsUpdated).toHaveBeenCalled();
  });


  it('should call updateProposal', () => {
    const response = {
      data : {
        proposal: {
          name: 'test',
          mspInfo:{

          },
          currencyCode: 'USD',
          partnerInfo:{

          }
        }
      }
    }
    component.proposalStoreService.rsdDueCurrDate = true;
    let proposaRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposaRestService, "postApiCall").mockReturnValue(of(response));
    component.updateMsp = true;
    component.proposalStoreService.mspInfo ={ mspAuthorizedQualcodes: '',mspProposal: true}
    component.updatedProposalparamsMap = new Map([["name","TR pro1"],["billingModel","Annual"],["rsd","20230517"],["term",'38'],["justification","test"]])
    component.updateProposal();
    expect(component.proposalStoreService.rsdDueCurrDate).toBeFalsy();
  });

  it('should call updateProposal without rsd', () => {
    const response = {
      data : {
        proposal: {
          name: 'test',
          mspInfo:{

          },
          currencyCode: 'USD',
          partnerInfo:{

          }
        }
      }
    }
    component.proposalStoreService.rsdDueCurrDate = true;
    let proposaRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposaRestService, "postApiCall").mockReturnValue(of(response));
    component.updateMsp = true;
    component.proposalStoreService.mspInfo ={ mspAuthorizedQualcodes: '',mspProposal: true}
    component.updatedProposalparamsMap = new Map([["name","TR pro1"],["billingModel","Annual"],["term",'38'],["justification","test"]])
    component.updateProposal();
    expect(component.proposalStoreService.rsdDueCurrDate).toBeTruthy();
  });


  it('should call updateProposal error', () => {
    const response = {
      data : {}
      ,error : true
    }
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    component.proposalStoreService.rsdDueCurrDate = true;
    let proposaRestService = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(proposaRestService, "postApiCall").mockReturnValue(of(response));
    component.updateMsp = true;
    component.proposalStoreService.mspInfo ={ mspAuthorizedQualcodes: '',mspProposal: true}
    component.updatedProposalparamsMap = new Map([["name","TR pro1"],["billingModel","Annual"],["rsd","20230517"],["term",'38'],["justification","test"]])
    component.updateProposal();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });

  it('should call resetCotermSelection', () => {
    component.resetCotermSelection();
    expect(component.showCotermSelection).toBeFalsy();
    expect(component.isCoOpen).toBeFalsy();
  });

  it('should call allowCotermSelection', () => {   
    
    component.isCoOpen = false;
    component.eaService.features.COTERM_SEPT_REL = true;
    component.selectedProposalParamsObj.rsd = new Date();
    component.allowCotermSelection();
    expect(component.cotermEndDateMax).toBeTruthy();
    expect(component.cotermEndDateMin).toBeTruthy();
    expect(component.isCoOpen).toBeTruthy();
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

  it('should call onUserClickEndDateSelection', () => {
   
    component.onUserClickEndDateSelection();
     
     expect(component.isUserClickedOnEndDateSelection).toBeTruthy();
   });

   it('should call onDateSelection', () => {
    const getDuration = jest.spyOn(component, "getDuration");
    const event = new Event('change')
    component.isUserClickedOnEndDateSelection = true;
    component.selectedSubscription = {};
    component.onEndDateSelection(event);
    expect(component.isCotermAdded).toBeFalsy();
    // expect(getDuration).toHaveBeenCalled();
  });

  it('should call selectOpted', () => {
    const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
    component.selectOpted();
    expect(component.isFreqSelected).toBeFalsy();
    expect(component.selectedProposalParamsObj.selectedCapitalFrequencyModel).toBeFalsy();
    expect(isproposalParamsUpdated).toHaveBeenCalled();
  });

  it('should call selectFrequencyModal', () => {
   let capitalFrequencyModel = {id: 'Annual'}
   component.selectedProposalParamsObj.selectedCapitalFrequencyModel = undefined;
   const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
   const getSelectedCapitalFrequencyModal = jest.spyOn(component, "getSelectedCapitalFrequencyModal");
    component.selectFrequencyModal(capitalFrequencyModel);
    expect(component.frequencyModelDisplayName).toBeTruthy();
    expect(component.selectedProposalParamsObj.selectedCapitalFrequencyModel).toBeTruthy();
    expect(isproposalParamsUpdated).toHaveBeenCalled();
    expect(component.isFreqSelected).toBeTruthy();
    expect(getSelectedCapitalFrequencyModal).toHaveBeenCalled();
   });

   it('should call sliderChange', () => {
    component.selectedProposalParamsObj.selectedDuration = 36;
    const isproposalParamsUpdated = jest.spyOn(component, "isproposalParamsUpdated");
    component.sliderChange(37, "slider");
    expect(component.selectedProposalParamsObj.selectedDuration).toEqual(37);
    expect(isproposalParamsUpdated).toHaveBeenCalled();

    component.selectedProposalParamsObj.selectedDuration = 38;
    component.sliderChange(38, "test");
    expect(component.selectedProposalParamsObj.selectedDuration).toEqual(38);
  });

  it('should call checkCountry', () => {   
    
    component.countrySearch = 'UNITED STATES';
    component.selectedProposalParamsObj = {countryOfTransaction: {isoCountryAlpha2: 'USA', countryName: 'UNITED STATES'}}
    component.checkCountry();
    expect(component.showModalDropObj.showCountryDrop).toBeFalsy();
  });

  it('should call checkCountry', fakeAsync(() => {
    component.countrySearch = 'UNITED STATES';
    component.selectedProposalParamsObj = {countryOfTransaction: {isoCountryAlpha2: 'IN', countryName: 'INDIA'}}
    component.checkCountry();
    tick(200);
    expect(component.countrySearch).toEqual('INDIA');
    expect(component.showModalDropObj.showCountryDrop).toBeFalsy();
    flush();
  }));

  it('should call getSelectedCapitalFrequencyModal', () => {
    component.getSelectedCapitalFrequencyModal();
    expect(component.isBillingTermUpdatedForCapital).toBeFalsy();
  });


  it('should call getDuration', () => {
    component.cotermEndDate = new Date('07/26/2027');
    component.selectedProposalParamsObj.rsd = new Date();
    component.selectedProposalParamsObj.selectedDuration = 11.99
    component.getDuration();
    expect(component.displayDurationMsg).toBeFalsy();
    expect(component.selectedProposalParamsObj.selectedDuration).toEqual(11.99);
  });

  it('should call updateMsaSelection', () => {
    let contractNumberUpdated = true
    component.proposalStoreService.proposalData.agreementContractNumber = '';
    component.updateMsaSelection(contractNumberUpdated);
    expect(component.msaQnaUpdated).toBeFalsy();

    component.proposalStoreService.proposalData.agreementContractNumber = '1355';
    component.updateMsaSelection(contractNumberUpdated);
    expect(component.disabledForMsa).toBeTruthy();

    component.proposalStoreService.proposalData.agreementContractNumber = '1355';
    contractNumberUpdated = false
    component.updateMsaSelection(contractNumberUpdated);
    expect(component.msaQnaUpdated).toBeTruthy();
  });

  it('should call getPriceList error in res', () => {
    component['projectStoreService'].projectData = {objId: "123456786"}
    const response = {error: true, data: {}}
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getPriceList();
    expect(component.priceListArray.length).toBeFalsy();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
    
  });

  it('should call getPriceList no data in res', () => {
    component['projectStoreService'].projectData = {objId: "123456786"}
    const response = {error: false}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getPriceList();
    expect(component.priceListArray.length).toBeFalsy();
    
  });

   it('should call getPriceList', () => {
    component['projectStoreService'].projectData = {objId: "123456786"}
    component.proposalStoreService.proposalData = {objId: "123456786", dealInfo: {referrerQuoteId: '12344'}, priceList: {id: "1109"}}
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
  let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getPriceList();
    expect(component.priceListArray.length).toBeTruthy();
    expect(component.selectedProposalParamsObj.selectedPriceList).toBeTruthy();
    
  });

  it('should call getBillingModel data in response', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component['projectStoreService'].projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    component.proposalStoreService.proposalData = {objId: "123456786", id: 12233, buyingProgram: 'EA 3.0', dealInfo: {referrerQuoteId: '12344'}, priceList: {id: "1109"}}
    const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
    const response = {"rid":"EAMP1726683605874","user":"prguntur","error": true,"data":{"billingModels":[{"id":"Prepaid","defaultSelection":true,"acsOption":{"mapping":"Prepaid Term"},"l2nOption":{"mapping":"PREPAY"},"uiOption":{"displaySeq":1,"displayName":"Prepaid Term"},"bomOption":{"mapping":"Prepaid Term"},"hanaOption":{"mapping":"Prepaid Term"},"ccwrOption":{"mapping":"Prepaid Term"},"owbOption":{"mapping":"Prepaid Term"}},{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"capitalFinancingFrequency":[{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"term":{"min":12.0,"max":84.0,"defaultTerm":36.0,"maxForEa2Renewal":60.0},"rsd":{"min":0,"max":270,"maxRsdForSubscriptionUpgrade":29,"defaultRsd":90,"maxCCWRsdRange":89,"maxRsdRangeForCxProposalCompletion":89},"coTerm":{"min":12,"max":84}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683605877}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getBillingModel();
    expect(displayMessagesFromResponse).toHaveBeenCalled();
  });

  it('should call getBillingModel data in response', () => {
    component.eaService.features.COTERM_SEPT_REL = true;
    component['projectStoreService'].projectData = { objId: "123456786", selectedQuote: { quoteId: '125678', distiDetail: { sourceProfileId: 1}} }
    component.cotermEndDate = new Date();
    component.proposalStoreService.proposalData = {objId: "123456786", id: 12233, buyingProgram: 'EA 3.0', dealInfo: {referrerQuoteId: '12344'}, priceList: {id: "1109"}, billingTerm: {rsd: '20250308', }}
    const response = {"rid":"EAMP1726683605874","user":"prguntur","error": false,"data":{"billingModels":[{"id":"Prepaid","defaultSelection":true,"acsOption":{"mapping":"Prepaid Term"},"l2nOption":{"mapping":"PREPAY"},"uiOption":{"displaySeq":1,"displayName":"Prepaid Term"},"bomOption":{"mapping":"Prepaid Term"},"hanaOption":{"mapping":"Prepaid Term"},"ccwrOption":{"mapping":"Prepaid Term"},"owbOption":{"mapping":"Prepaid Term"}},{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"capitalFinancingFrequency":[{"id":"Annual","defaultSelection":false,"acsOption":{"mapping":"Annual Billing"},"l2nOption":{"mapping":"ANNUAL"},"uiOption":{"displaySeq":2,"displayName":"Annual Billing"},"bomOption":{"mapping":"Annual Billing"},"hanaOption":{"mapping":"Annual Term"},"ccwrOption":{"mapping":"Annual Billing"},"owbOption":{"mapping":"Annual Billing"}},{"id":"Monthly","defaultSelection":false,"acsOption":{"mapping":"Monthly Billing"},"l2nOption":{"mapping":"MONTHLY"},"uiOption":{"displaySeq":3,"displayName":"Monthly Billing"},"bomOption":{"mapping":"Monthly Billing"},"hanaOption":{"mapping":"Monthly Term"},"ccwrOption":{"mapping":"Monthly Billing"},"owbOption":{"mapping":"Monthly Billing"}}],"term":{"min":12.0,"max":84.0,"defaultTerm":36.0,"maxForEa2Renewal":60.0},"rsd":{"min":0,"max":270,"maxRsdForSubscriptionUpgrade":29,"defaultRsd":90,"maxCCWRsdRange":89,"maxRsdRangeForCxProposalCompletion":89},"coTerm":{"min":12,"max":84}},"buildVersion":"NOV 11-14-2021 09:53 EST RELEASE","currentDate":1726683605877}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getBillingModel();
    expect(component.billingData.length).toBeTruthy();
    expect(component.options).toBeTruthy();
    // expect(component.cotermEndDateRangeObj).toBeTruthy();
    expect(component.cotermEndDateMin).toBeTruthy();
  });

});
