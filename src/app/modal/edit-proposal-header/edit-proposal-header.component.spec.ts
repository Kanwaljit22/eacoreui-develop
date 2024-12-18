import { CurrencyPipe, DatePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { PermissionService } from "@app/permission.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { ManageSuitesService } from "@app/proposal/edit-proposal/manage-suites/manage-suites.service";
import { PriceEstimationService } from "@app/proposal/edit-proposal/price-estimation/price-estimation.service";
import { ProposalSummaryService } from "@app/proposal/edit-proposal/proposal-summary/proposal-summary.service";
import { ListProposalService } from "@app/proposal/list-proposal/list-proposal.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { CopyLinkService } from "@app/shared/copy-link/copy-link.service";
import { ProposalArchitectureService } from "@app/shared/proposal-architecture/proposal-architecture.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { AppRestService } from "@app/shared/services/app.rest.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { MessageService } from "@app/shared/services/message.service";
import { ProposalPollerService } from "@app/shared/services/proposal-poller.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaService } from "ea/ea.service";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { IonRangeSliderComponent, IonRangeSliderCallback } from '@app/shared/ion-range-slider/ion-range-slider.component';

import { EditProposalHeaderComponent } from "./edit-proposal-header.component";
import { of } from "rxjs";

class MockProposalDataService {
    proposalDataObject: {proposalData: {
        'desc':'',
        "name": "Service - TR-prop for DNA",
        "defaultPriceList": "",
        "priceList": "Global Price List - US",
        "billingModel": "Prepaid Term",
        "billingModelID": "Prepaid",
        "eaTermInMonths": 36,
        "eaStartDate": '',
        "demoProposal": true,
        "linkId": 9052159,
        "eaStartDateStr": "20231114",
        "eaStartDateFormed": "14-Nov-2023",
        "countryOfTransaction": "US",
        "netTCV": "",
        "status": "In Progress",
        "reOpened": false,
        "currencyCode": "USD",
        "priceListId": 1109,
        "archName": "CX",
        "totalNetPrice": 0,
        "hasLinkedProposal": false,
        "groupId": 0,
        "groupName": "",
        "eaStartDateDdMmmYyyyStr": "",
        "countryOfTransactionName": "",
        "partner": {
          "partnerId": 0,
          "id": 0,
          name:''
        },
        "architecture": "Cisco Services Support",
        "isStatusInconsistentCrossArch": false,
        "isStatusIncompleteCrossArch": false,
        "isOneOfStatusCompleteCrossArch": false,
        "isCrossArchitecture": false,
        "mspPartner": false,
        "linkedProposalsList": [],
        "coTerm": {
          "subscriptionId": "",
          "eaEndDate": "",
          "coTerm": false
        },
        "loaLanguageClarificationIds": [],
        "loaNonStdModificationIds": [],
        "dealId": '61154896'
      }}
  }

describe('EditProposalHeaderComponent', () => {
  let component: EditProposalHeaderComponent;
  let fixture: ComponentFixture<EditProposalHeaderComponent>;
  let mockservice:ProposalDataService
    const testProposalData = {
        'desc':'',
        "name": "Service - TR-prop for DNA",
        "defaultPriceList": "",
        "priceList": "Global Price List - US",
        "billingModel": "Prepaid Term",
        "billingModelID": "Prepaid",
        "eaTermInMonths": 36,
        "eaStartDate": new Date(),
        "demoProposal": true,
        "linkId": 9052159,
        "eaStartDateStr": "20231114",
        "eaStartDateFormed": "14-Nov-2023",
        "countryOfTransaction": "US",
        "netTCV": "",
        "status": "In Progress",
        "reOpened": false,
        "currencyCode": "USD",
        "priceListId": 1109,
        "archName": "CX",
        "totalNetPrice": 0,
        "hasLinkedProposal": false,
        "groupId": 0,
        "groupName": "",
        "eaStartDateDdMmmYyyyStr": "",
        "countryOfTransactionName": "",
        "partner": {
          "partnerId": 0,
          "id": 0,
          name:''
        },
        "architecture": "Cisco Services Support",
        "isStatusInconsistentCrossArch": false,
        "isStatusIncompleteCrossArch": false,
        "isOneOfStatusCompleteCrossArch": false,
        "isCrossArchitecture": false,
        "mspPartner": false,
        "linkedProposalsList": [],
        "coTerm": {
          "subscriptionId": "",
          "eaEndDate": "",
          "coTerm": false
        },
        "loaLanguageClarificationIds": [],
        "loaNonStdModificationIds": [],
        "dealId": '61154896'
      }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,BsDatepickerModule.forRoot(), RouterTestingModule.withRoutes([

      ])],
      schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ EditProposalHeaderComponent ],
      providers: [
       // {provide : ProposalDataService, useClass: MockProposalDataService},
        ProposalDataService,LocaleService,  NgbActiveModal,TcoDataService, CreateProposalService, EaService, EaRestService,PriceEstimationService, PermissionService,
          UtilitiesService,ProposalPollerService,CurrencyPipe, MessageService,QualificationsService, ManageSuitesService, DatePipe,
        AppDataService,AppRestService,BlockUiService,CopyLinkService,ListProposalService,  Router, ConstantsService, Renderer2,  ProposalArchitectureService, ProposalSummaryService ]
    })

    mockservice = TestBed.inject(ProposalDataService) 
    mockservice.proposalDataObject.proposalData = testProposalData
  });

  
  beforeEach(() => {
    fixture = TestBed.createComponent(EditProposalHeaderComponent);
    component = fixture.componentInstance;
    //component.sliderElement:IonRangeSliderComponent 
   // component.proposalDataService.proposalDataObject.proposalData = testProposalData;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.proposalDataService.proposalDataObject.proposalData = testProposalData;
    expect(component).toBeTruthy();
  });

  it('should onPriceListChange', () => {
    const val = {name:'test',desc:'test',priceListId:'234'}
    component.onPriceListChange(val);
    expect(component.showPriceListError).toBe(false);
  });

  it('should proposalParameter', () => {
    
    component.proposalParameter();
    expect(component.showProposalParameter).toBe(true);
  });

  it('should userclicked', () => {
    component.userclicked();
    expect(component.isUserClickedRsd).toBe(true);
  });

  it('should getCountryOfTransactions', () => {
    const response ={
      countries:[{isoCountryAlpha2:'US',countryName:'US'}]
    }
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getCountryOfTransactions").mockReturnValue(of(response));

    component.getCountryOfTransactions()
    expect(component.selectedCountryTranscation).toBe(response.countries[0].countryName)
  });

  it('should getPriceList', () => {
    const response ={
      data:[{erpPriceListId:11,countryName:'US'}]
    }
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getPriceList").mockReturnValue(of(response));

    component.getPriceList()
    expect(component.showPriceListError).toBe(true)
  });

  it('should getPriceList erpPriceListId', () => {
    const response ={
      data:[{erpPriceListId:1109,description:'US'}]
    }
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getPriceList").mockReturnValue(of(response));

    component.getPriceList()
    expect(component.selectedPriceList).toBe(response.data[0].description)
  });

  it('should getPriceList partnerLedFlow: true', () => {
    component.partnerLedFlow= true
    const response ={
      data:[{erpPriceListId:1109,description:'US'}]
    }
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getPriceList").mockReturnValue(of(response));

    component.getPriceList()
    expect(component.selectedPriceList).toBe(response.data[0].description)
  });

  it('should selectedMSP', () => {
    component.selectedBillingModel = ''
    component.selectedMSP(false);
    expect(component.selectedMSPAnswer).toBe(false);
  });

  it('should selectSubscription', () => {
    component.selectSubscription('deselect');
    expect(component.referenceSubscriptionId).toEqual('');
  });

  it('should selectSubscription with sub', () => {
    const sub = {
      subscriptionId: '123',
      endDate: new Date()
    }
    component.selectSubscription(sub);
    expect(component.isSubscriptionUpdated).toBe(true);
  });

  it('should setSubscriptionListForRenewal', () => {
    const subsList = [{
      subscriptionId: '123',
      endDate: new Date()
    }]
    const renwalSubIds = ['123','432']
    component.setSubscriptionListForRenewal(subsList,renwalSubIds);
    expect(component.subscriptionList).toEqual([]);
  });

  it('should partnerSelectDrop', () => {
    const event = {
      subscriptionId: '123',
      endDate: new Date(),
      stopPropagation: (()=>{})
    }
    const stopPropagation = jest.spyOn(event, 'stopPropagation')
    component.myDropsearch = {open:(()=>{})}
    component.readOnlyMode = false
    const renwalSubIds = ['123','432']
    component.partnerSelectDrop(event);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should countryOfTransactionDrop', () => {
    const event = {
      stopPropagation: (()=>{})
    }
    const stopPropagation = jest.spyOn(event, 'stopPropagation')
    component.myDropCountrysearch = {open:(()=>{})}
    component.myDropBillingsearch = {close:(()=>{})}
    component.myDropPricesearch = {close:(()=>{})}
    component.readOnlyMode = false
    component.countryOfTransactionDrop(event);
    expect(stopPropagation).toHaveBeenCalled();
  });
  it('should priceListDrop', () => {
    const event = {
      stopPropagation: (()=>{})
    }
    const stopPropagation = jest.spyOn(event, 'stopPropagation')
    component.myDropPricesearch = {open:(()=>{})}
    component.myDropBillingsearch = {close:(()=>{})}
    component.myDropCountrysearch = {close:(()=>{})}
    component.readOnlyMode = false
    
    component.priceListDrop(event);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should billingDrop', () => {
    const event = {
      stopPropagation: (()=>{})
    }
    component.billingModels = [{identifier:ConstantsService.QUARTERLY},{identifier:''}]
    const stopPropagation = jest.spyOn(event, 'stopPropagation')
    component.myDropBillingsearch = {open:(()=>{})}
    component.myDropCountrysearch = {close:(()=>{})}
    component.myDropPricesearch = {close:(()=>{})}
    component.readOnlyMode = false
    
    component.billingDrop(event);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('should updateBillingModel displayName: Annual Billing', () => {
    const event = {
      displayName: 'Annual Billing',
      identifier:ConstantsService.QUARTERLY
    }
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','','','']
    component.billingModels = [{identifier:ConstantsService.QUARTERLY},{identifier:''}]
    
    component.myDropBillingsearch = {open:(()=>{})}
    component.myDropCountrysearch = {close:(()=>{})}
    component.myDropPricesearch = {close:(()=>{})}
    component.readOnlyMode = false
    
    component.updateBillingModel(event);
    expect(component.showMSPBillingError).toBe(false);
  });
  it('should updateBillingModel ', () => {
    const event = {
      displayName: '',
      identifier:ConstantsService.QUARTERLY
    }
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','','','']
    component.billingModels = [{identifier:ConstantsService.QUARTERLY},{identifier:''}]
    
    component.myDropBillingsearch = {open:(()=>{})}
    component.myDropCountrysearch = {close:(()=>{})}
    component.myDropPricesearch = {close:(()=>{})}
    component.readOnlyMode = false
    
    component.updateBillingModel(event);
    expect(component.showMSPBillingError).toBe(false);
  });

  it('should updateBillingModel displayName: Annual Billing, arch : DNA', () => {
    const event = {
      displayName: 'Annual Billing',
      identifier:ConstantsService.QUARTERLY
    }
    component.archName = 'Cisco DNA'
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','','','']
    component.billingModels = [{identifier:ConstantsService.QUARTERLY},{identifier:''}]
    
    component.myDropBillingsearch = {open:(()=>{})}
    component.myDropCountrysearch = {close:(()=>{})}
    component.myDropPricesearch = {close:(()=>{})}
    component.readOnlyMode = false
    
    component.updateBillingModel(event);
    expect(component.showMSPBillingError).toBe(false);
  });

  it('should updateCot', () => {
    const event = {
      countryName: 'Annual Billing',
      isoCountryAlpha2:ConstantsService.QUARTERLY
    }
   
    
    component.updateCot(event);
    expect(component.selectedCountryTranscation).toEqual(event.countryName);
  });
  it('should billingOpen', () => {
    component.selectedMSPAnswer = true
    component.proposalDataService.billingModelMetaData = {billingModellov: [{}]}
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','C1_DNA','','']
    component.createProposalService.mspPartner = true
    component.billingOpen();
    expect(component.billingModels.length).toEqual(component.proposalDataService.billingModelMetaData.billingModellov.length);
  });

  it('should isProposalUpdated', () => {
    component.selectedCountryTranscation = 'US'
    component.showBillingError = true
    component.proposalDataService.billingModelMetaData = {billingModellov: [{}]}
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','C1_DNA','','']
    component.createProposalService.mspPartner = true
    component.isProposalUpdated();
    expect(component.disableUpdate).toBe(true);
  });
  it('should isProposalUpdated initialProposalName', () => {
    component.initialProposalName = ''
    component.showBillingError = true
    component.proposalDataService.billingModelMetaData = {billingModellov: [{}]}
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','','','C1_DNA','','']
    component.createProposalService.mspPartner = true
    component.isProposalUpdated();
    expect(component.disableUpdate).toBe(true);
  });

  it('should checkIfMSPPartner', () => {
    const response ={
      data:[{erpPriceListId:1109,description:'US'}]
    }
    const isDifferentPartnerSelected = true
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "checkIfMSPPartner").mockReturnValue(of(response));

    component.checkIfMSPPartner(isDifferentPartnerSelected)
    expect(component.createProposalService.mspPartner).toBe(false)
  });
  it('should checkIfMSPPartner eligibleArchs', () => {
    const response ={
      data:{eligibleArchs:[]}
    }
    const isDifferentPartnerSelected = true
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "checkIfMSPPartner").mockReturnValue(of(response));

    component.checkIfMSPPartner(isDifferentPartnerSelected)
    expect(component.createProposalService.eligibleArchs).toEqual(response.data.eligibleArchs)
  });
  it('should checkIfMSPPartner eligibleArchs relatedSoftwareProposalArchName', () => {
    const response ={
      data:{eligibleArchs:[]}
    }
    component.proposalDataService.relatedSoftwareProposalArchName = 'test'
    const isDifferentPartnerSelected = true
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "checkIfMSPPartner").mockReturnValue(of(response));

    component.checkIfMSPPartner(isDifferentPartnerSelected)
    expect(component.createProposalService.eligibleArchs).toEqual(response.data.eligibleArchs)
  });
  it('should viewArchitecture', () => {
  
    component.viewArchitecture()
    expect(component.architectureInfo).toBe(true)
  });
  it('should addPartner', () => {
    const val = {name:'test',partnerId:123}
    component.addPartner(val)
    expect(component.selectedPartnerName).toEqual(val.name)
  });

  it('should viewPartnerInfo', () => {
    const response = {data:{}}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "partnerAPI").mockReturnValue(of(response));
    component.viewPartnerInfo()
    expect(component.isPartnerDataLoaded).toBe(true)
  });
  it('should viewPartnerInfo error : true ', () => {
    const response = {error:true}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "partnerAPI").mockReturnValue(of(response));
    component.viewPartnerInfo()
    expect(component.isPartnerDataLoaded).toBe(true)
  });

  it('should getSubscriptionsList error : true', () => {
    const response = {error:true}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getSubscriptionList").mockReturnValue(of(response));
    component.getSubscriptionsList()
    expect(component.isPartnerDataLoaded).toBe(false)
  });
  it('should getSubscriptionsList ', () => {
    component.appDataService.isRenewal = true
    component.linkedSubIds = ['']
    const response = {data:[{subscriptionId:'123'}]}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getSubscriptionList").mockReturnValue(of(response));
    component.getSubscriptionsList()
    expect(component.isPartnerDataLoaded).toBe(false)
  });
  // it('should getSubscriptionsList isSubscriptionListLoaded', () => {
  //   component.isSubscriptionListLoaded = true
  //   component.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm=true
  //   component.linkedSubIds = ['']
  //   component.eaEndDateInString = '20231114'
  //   const response = {data:[{subscriptionId:'123'}]}
  //   let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
  //   jest.spyOn(createProposalService, "getSubscriptionList").mockReturnValue(of(response));
  //   component.getSubscriptionsList()
  //   expect(component.isPartnerDataLoaded).toBe(false)
  // });

  it('should resetSubData ', () => {
    component.resetSubData()
    expect(component.showEndDate).toBe(false)
  });
  it('should checkDurationsSelected ', () => {
    const event ={target:{value:component.durationTypes.MONTHSCUSTOM}}
    component.checkDurationsSelected(event)
    expect(component.displayCustomDurationWarning).toBe(false)
  });

  it('should getBillingModelDetails ', () => {
    component.appDataService.isRenewal = true
    component.linkedSubIds = ['']
    const response = {data:{billingModellov:['23']}}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getBillingModelDetails").mockReturnValue(of(response));
    component.getBillingModelDetails()
    expect(component.proposalDataService.billingModelMetaData).toEqual(response.data)
  });
  it('should getBillingModelDetails error', () => {
    component.appDataService.isRenewal = true
    component.linkedSubIds = ['']
    const response = {error:true,data:{billingModellov:['23']}}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getBillingModelDetails").mockReturnValue(of(response));
    component.getBillingModelDetails()
    expect(component.proposalDataService.billingModelMetaData).toEqual(undefined)
  });

  it('should roundSliderValueToYear', () => {
    const setValue = jest.spyOn(component.eaTerm, 'setValue')
    component.roundSliderValueToYear(30)
    expect(setValue).toHaveBeenCalled()
  });

  it('should updateStatus', () => {
    component.updateStatus()
    expect(component.oldValues.description).toBe('')
  });
  it('should getPurchaseAdjustmentChangeStatus ', () => {
    const response = {data:{}}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "isPurchaseAdjustmentChanged").mockReturnValue(of(response));
    component.getPurchaseAdjustmentChangeStatus()
    expect(component.isPurchaseAdjustmentChanged).toBe(true)
  });
  it('should getPurchaseAdjustmentChangeStatus no data', () => {
    const response = {}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "isPurchaseAdjustmentChanged").mockReturnValue(of(response));
    component.getPurchaseAdjustmentChangeStatus()
    expect(component.isPurchaseAdjustmentChanged).toBe(false)
  });

  it('should checkCotermAllowedOrNot ', () => {
    const response = {data:{}}
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getCotermAllowed").mockReturnValue(of(response));
    component.checkCotermAllowedOrNot()
    expect(component.isShowCoTerm).toEqual(response.data)
  });
  it('should checkCotermAllowedOrNot error: true', () => {
    const response = {error:true}
    const displayMessagesFromResponse = jest.spyOn(component.messageService, 'displayMessagesFromResponse')
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "getCotermAllowed").mockReturnValue(of(response));
    component.checkCotermAllowedOrNot()
    expect(displayMessagesFromResponse).toHaveBeenCalled()
  });

  it('should getEaMaxStartDate', () => {
    component.proposalDataService.relatedCxProposalId = 123
    const response =
    {
      "rid": "c051f270-4ce7-410a-84b9-a2c02a350c71",
      "user": "rbinwani",
      "error": false,
      "data": [
          "August 23, 2024 13:38:20",
          "May 25, 2024 13:38:20",
          "November 27, 2023 13:38:20"
      ],
      "currentDate": 1701207500815
  }
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "maxAndDefaultStartDate").mockReturnValue(of(response));
    component.getEaMaxStartDate()
    expect(component.expectedEAStartDate).toEqual(new Date(response.data[0]))
  });

  it('should getEaMaxStartDate error true' , () => {
    const response =
    {
      "rid": "c051f270-4ce7-410a-84b9-a2c02a350c71",
      "user": "rbinwani",
      "error": true,
      "data": [
          "August 23, 2024 13:38:20",
          "May 25, 2024 13:38:20",
          "November 27, 2023 13:38:20"
      ],
      "currentDate": 1701207500815
  }
  
    const displayMessagesFromResponse = jest.spyOn(component.messageService, 'displayMessagesFromResponse')
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "maxAndDefaultStartDate").mockReturnValue(of(response));
    component.getEaMaxStartDate()
    expect(displayMessagesFromResponse).toHaveBeenCalled()
  });

  it('should updateProposal error true', () => {
    const response =
    { error : true,
      messages:[{code:component.constantsService.DATA_CENTER_MINIMUM_SUIT_ERROR_CODE}]
    }
    component.proposalArchitectureService.questions = []
    component.createProposalService.mspPartner = true
    const displayMessagesFromResponse = jest.spyOn(component.messageService, 'displayMessagesFromResponse')
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "createProposal").mockReturnValue(of(response));
    component.updateProposal()
    expect(component.isToShowMinimumTwoSuitesError).toBe(true)
  });

  it('should updateProposal ', () => {
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','',[{id:1}],[{id:1}],[{id:1}],[{id:1}]]
    const response =
    { error : false,
      data:{partner:{},id: 1,noOfMandatorySuitesRequired:3,noOfExceptionSuitesRequired:4,cxEligible:true,cxNotAllowedReasonCode:'test'}
    }
    component.enableRecalculate = true
    component.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep
    component.proposalArchitectureService.questions = []
    component.createProposalService.mspPartner = true
    const displayMessagesFromResponse = jest.spyOn(component.messageService, 'displayMessagesFromResponse')
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "createProposal").mockReturnValue(of(response));
    component.updateProposal()
    expect(component.isToShowMinimumTwoSuitesError).toBe(false)
  });

  it('should updateProposal page proposalDefineSuiteStep', () => {
    component.appDataService.subHeaderData.subHeaderVal = ['','','','','','',[{id:1}],[{id:1}],[{id:1}],[{id:1}]]
    const response =
    { error : false,
      data:{partner:{},id: 1,noOfMandatorySuitesRequired:3,noOfExceptionSuitesRequired:4,cxEligible:true,cxNotAllowedReasonCode:'test'}
    }
    component.enableRecalculate = true
    component.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep
    component.proposalArchitectureService.questions = []
    component.createProposalService.mspPartner = true
    const displayMessagesFromResponse = jest.spyOn(component.messageService, 'displayMessagesFromResponse')
    let createProposalService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(createProposalService, "createProposal").mockReturnValue(of(response));

    const res = {
      messages:[{}]
    }
    let priceEstimationService = fixture.debugElement.injector.get(PriceEstimationService);
    jest.spyOn(priceEstimationService, "recalculateAll").mockReturnValue(of(res));
    component.updateProposal()
    expect(displayMessagesFromResponse).toHaveBeenCalled()
  });
 
});