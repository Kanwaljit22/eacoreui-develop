import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { ElementRef, EventEmitter, Renderer2 } from "@angular/core";
import { of } from "rxjs";
import { AllArchitectureViewService } from "@app/all-architecture-view/all-architecture-view.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { AccountHealthInsightComponent } from "./account-health-insight.component";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { LocaleService } from "../services/locale.service";
import { AccountHealthInsighService } from "./account.health.insight.service";
import { PartnerBookingsService } from "../partner-bookings/partner-bookings.service";
import { BlockUiService } from "../services/block.ui.service";
import { Router } from "@angular/router";
import { CountriesPresentService } from "../countries-present/countries-present.service";
import { HttpClient } from "@angular/common/http";

describe("AccountHealthInsightComponent", () => {
  let component: AccountHealthInsightComponent;
  let fixture: ComponentFixture<AccountHealthInsightComponent>;

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  class MockAppDataService {
    validateResponse(res) {
      return res;
    }
    custNameEmitter=new EventEmitter();
    prettifyNumber=jest.fn().mockReturnValue(120)
    // getAccountHealthData
    getDetailsMetaData=jest.fn();
    subHeaderData = { favFlag: false, moduleName: "test", subHeaderVal: "" };
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    archName = "test";
    get getAppDomain() {
      return "";
    }
    userInfo = {
      userId: "123",
    };
  }
  class MockUtilitiesService {
    getFloatValue(a) {
      return 0.0;
    }
    formatValue(a) {
      return 0;
    }
    isNumberKey(e) {
      return true;
    }
    pretifyAndFormatNumber=jest.fn()
  }
  class MockAllArchitectureViewService {
    viewTabEmitter = new EventEmitter();
    searchDropDown = false;
    getSmartAccountList() {
      return of({});
    }
    getProposalListbyCustomer() {
      return of({ data: {} });
    }
    getSubHeaderData() {
      return of({ data: {} });
    }
    getAgreementsData(arg) {
      const response = {
        data: { accounts: ["test"] },
        error: false,
      };
      return of(response);
    }
    getConsumptionData(a, b, c) {
      return of({
        data:{suites:[{commerceSku:0}]},
        error:false
      });
    }
    getConsumptionDataTrueFwd(a,b){return of({data:{suiteDetails:[{billingskuDetails:[{skuName:'test',suiteName:'test', test:0}] , }]}})}
  }

  class MockQualificationsService {
    qualification = { qualID: '123' };
    loaData={partnerBeGeoId:'123',customerGuId:'123' }
    viewQualSummary(data) { }
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() { return of({messages:[1,2], data:[1,2,3], error:false}) }
}

class MockBlockUiService {
    spinnerConfig = {
        blockUI: jest.fn(),
        startChain:jest.fn(),
        unBlockUI:jest.fn(),
        stopChainAfterThisCall:jest.fn()
    }
}

class MockElementRef{}
class MockAccountHealthInsighService{
    getAccountHealthData = jest.fn().mockReturnValue(of({}));
    getRenewaldata=jest.fn().mockReturnValue(of([{
        quarterName:'',renewalAmount:123,currentQuarter:{}
    }]));
    
    loadRenewalData=new EventEmitter()
    reloadPartnerEmitter=new EventEmitter()
}
class MockPartnerBookingsService{}
class MockCountriesPresentService{}
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [AccountHealthInsightComponent],
      providers: [
        {provide:QualificationsService, useClass:MockQualificationsService},
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: AppDataService, useClass: MockAppDataService },
        {
          provide: AllArchitectureViewService,
          useClass: MockAllArchitectureViewService,
        },
        LocaleService,
        {provide:AccountHealthInsighService, useClass:MockAccountHealthInsighService},
        {provide:PartnerBookingsService, useClass:MockPartnerBookingsService},
        {provide:BlockUiService, useClass:MockBlockUiService},
        Router,
        Renderer2,
        {provide:ElementRef, useClass:MockElementRef},
        {provide:CountriesPresentService, useClass:MockCountriesPresentService},
        HttpClient
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHealthInsightComponent);
    component = fixture.componentInstance;
    component.currentQuarter={renewalAmount:123}
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', fakeAsync(() => {
    component.proposalData = {data:[]};
    component.currentQuarter={renewalAmount:123} as any
   const getQualList= jest.spyOn(component, 'getQualList')
   const getProposalListbyCustomer= jest.spyOn(component, 'getProposalListbyCustomer')
   const getAccountHealthData= jest.spyOn(component, 'getAccountHealthData')
   const getRenewaldata= jest.spyOn(component, 'getRenewaldata')
   const emit = jest.spyOn(component['appDataService'].custNameEmitter,'emit')
    component.ngOnInit();
    expect(getQualList).toBeCalled();
    expect(getProposalListbyCustomer).toBeCalled();
    expect(getAccountHealthData).toBeCalled();
    expect(getRenewaldata).toBeCalled();
    tick(100)
    expect(emit).toBeCalled();
  }));

  it('should call ngOnDestroy', () => {
    component.ngOnDestroy()
  })


  it('should call ngOnDestroy', () => {
    component.ngOnDestroy()
  })

  it('should call openIbSummaryFlyout', () => {
    component.openIbSummaryFlyout( 'Total Assets');
    component.openIbSummaryFlyout('Install Sites');
    component.openIbSummaryFlyout('Contracts');
    component.openIbSummaryFlyout('Sales Orders');
  });

  it('should call toggleView', () => {
    component.toggleView()
  });

  it('should call getRenewaldata', () => {
    component.renewalEaView=true;
    component.getRenewaldata()
  });

  it('should call getQualList', () => {
    component.getQualList()
  });

  it('should call goToProposalList', () => {
    component.goToProposalList()
  });

  it('should call goToOrder', () => {
    component.goToOrder()
  });

  it('should call goToQualification', () => {
    component.goToQualification()
  });

  it('should call goToAgreementList', () => {
    component.goToAgreementList()
  });

  it('should call selectInsightView', () => {
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.selectInsightView({displayName:'test', viewBy:'All Architectures'})
  });

  it('should call getTooltip', () => {
    component.appDataService.archName = 'ALL';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'ldosCoverage'}]};
    component.getTooltip({displayName:'test', viewBy:'All Architectures'})
  });

  it('should call getTooltip b1', () => {
    component.appDataService.archName = 'ALL';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'serviceCoverage'}]};
    component.getTooltip({displayName:'test', viewBy:'All Architectures'})
  });

  it('should call getTooltip b1', () => {
    component.appDataService.archName = 'ALL';
    component .appDataService.ldosCoverageTooltip = 'test';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'test',value:'test'}]};
    component.getTooltip('test')
  });

  it('should call getTooltip b2', () => {
    component.appDataService.archName = 'C1_DNA';
    component .appDataService.ldosCoverageTooltip = 'test';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'test',value:'test'}]};
    component.getTooltip('test')
  });

  it('should call getTooltip b3', () => {
    component.appDataService.archName = 'C1_DC';
    component .appDataService.ldosCoverageTooltip = 'test';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'test',value:'test'}]};
    component.getTooltip('test')
  });

  it('should call getTooltip b4', () => {
    component.appDataService.archName = 'SEC';
    component .appDataService.ldosCoverageTooltip = 'test';
    component.accountInsighrArr = [{displayName:'test', viewBy:'All Architectures', active:true}]
    component.accHealthData={toolTipMsg:[{name:'test',value:'test'}]};
    component.getTooltip('test')
  });

  it('should call getSuite', () => {
    component.getSuite('test')
  });

  it('should call prepareArchitectureData', () => {
    component.accHealthData={tcvAccessSwitchingDna:0}
    component['prepareArchitectureData']('C1_DNA')
  });

  it('should call prepareArchitectureData', () => {
    component.accHealthData={tcvAccessSwitchingDna:0}
    component['prepareArchitectureData']('C1_DC')
  });

  it('should call prepareArchitectureData', () => {
    component.accHealthData={tcvAccessSwitchingDna:0}
    component['prepareArchitectureData']('SEC')
  });

  it('should call createNewQualification', () => {
    component.createNewQualification();
  });

  it('should call viewTileDetails', () => {
    component.selectedArchiteture = 'All Architectures';
    component.viewTileDetails('Total Assets');
  });

  it('should call viewTileDetails b1', () => {
    component.selectedArchiteture = 'test';
    component.viewTileDetails('Subsidiaries');
    component.viewTileDetails('Contracts');
    component.viewTileDetails('Geography (Theaters)');
    component.viewTileDetails('Sales Orders');
    component.viewTileDetails('Install Sites');
    component.viewTileDetails('Country/Region Present');
    component.viewTileDetails('Partners');
    component.viewTileDetails('Subscriptions');
  });

  it('should call displaySuitesDetails', () => {
    component.displaySuitesDetails();
  });

  it('should call getSuitesByArchitecture', () => {
    component.selectedArchiteture ='C1_DNA'
    component['getSuitesByArchitecture']();
  });

  it('should call getSuitesByArchitecture', () => {
    component.selectedArchiteture ='C1_DC'
    component['getSuitesByArchitecture']();
  });

  it('should call getSuitesByArchitecture', () => {
    component.selectedArchiteture ='SEC'
    component['getSuitesByArchitecture']();
  });

  it('should call moveRight', () => {
    component.start=0;
    component.renderer.setStyle=jest.fn() as any;
    component.moveRight();
  });

  it('should call moveRight', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=1;
    component.moveRight();
  });

  it('should call moveRight', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=2;
    component.moveRight();
  });

  it('should call moveLeft', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=4;
    component.moveLeft();
  });

  it('should call moveLeft', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=3;
    component.moveLeft();
  });
  it('should call moveLeft', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=2;
    component.moveLeft();
  });

  it('should call moveLeft', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=1;
    component.moveLeft();
  });

  it('should call globalSwitchChange', () => {
    component.renderer.setStyle=jest.fn() as any;
    component.start=1;
    component.globalSwitchChange(true);
  });






});
