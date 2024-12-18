import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TcoModelingComponent } from "./tco-modeling.component";
import { TcoModelingService } from "./tco-modeling.service";
import { EventEmitter } from "@angular/core";
import { of } from "rxjs";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { PermissionService } from "@app/permission.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { TcoApiCallService } from "@app/tco/tco-api-call.service";
import { MessageService } from "@app/shared/services/message.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { ShortNumberPipe } from "@app/shared/pipes/short-number.pipe";

describe("TcoModelingComponent", () => {
  let component: TcoModelingComponent;
  let fixture: ComponentFixture<TcoModelingComponent>;
  const url = "https://localhost:4200/";
  class MockTcoModelingService {
    checkValueChanged=jest.fn().mockReturnValue(true)
    getGraphData=jest.fn().mockReturnValue(of({data:{}}))
    getPricingObject() {
      const pricingObj = {
        bauDiscount: 0,
        bauPrice: "",
        eaPrice: "",
        eaDiscount: "",
        eaBenefitValue: "",
        eabenefitPerc: "",
      };
      return pricingObj;
    }
    getModelingData = jest
      .fn()
      .mockReturnValue(of({ priceComparison: "test", distribution: "test" }));
    prepareModelingData = jest.fn();
  }
  class MockNgbModal {}
  class MockRouter {
    url = "proposal/test/1123";
    navigate= jest.fn();
    paramMap = of({
       params:jest.fn().mockReturnValue({
        get:jest.fn().mockReturnValue('123'),
        keys:['test']
       })
    })
  }
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TcoModelingComponent, ShortNumberPipe],
      providers: [
        { provide: TcoModelingService, useClass: MockTcoModelingService },
        { provide: Router, useClass: MockRouter },
        { provide: NgbModal, useClass: MockNgbModal },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: MessageService, useClass: MockMessageService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: TcoDataService, useClass: MockTcoDataService },
        { provide: ProposalDataService, useClass: MockProposalDataService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: LocaleService, useClass: MockLocaleService },
        { provide: PermissionService, useClass: MockPermissionService },
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: CreateProposalService, useClass: MockCreateProposalService },
        { provide: TcoApiCallService, useClass: MockTcoApiCallService },
        { provide: QualificationsService, useClass: MockQualificationsService },
      ],
      imports: [NgbModule],
      teardown: { destroyAfterEach: false },
    }).compileComponents();
  }));

  class MockCreateProposalService {
    prepareSubHeaderObject = jest.fn().mockReturnValue(of({}));
    getProposalHeaderData = jest.fn().mockReturnValue(of({}));
  }

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
    clear = jest.fn();
  }
  class MockConstantsService {
    SECURITY = "test";
    TCO_METADATA_IDS = {
      serviceListPrice:1, 
       rampPurchaseAdjustment:2,
       netPriceWithPA:1,  
       markupMargin: "markupMargin" as string, 
       productListPrice:1, 
       netPrice:'netPrice',
       netPriceWithoutPA:1,
       purchaseAdjustment:'purchaseAdjustment',
       averageDiscount:'averageDiscount',
       growth: 'growth',
       alaCarte1yrSku:'alaCarte1yrSku',
       timeValueMoney:'timeValueMoney'
      } as any;
    TCO_MARGIN = "test";
  }
  class MockTcoDataService {
    getTcoSummaryData=jest.fn()
    tcoId = "123";
    catalogueMetaData;
    tcoMetaData = {};
    prepareGraph1 = jest.fn();
    tcoDataObj = {
      catalogue:{outcomes:''},
      name: { name: "" },
      prices: { businessAsUsual : {id:'test'}, name: { name: "test" } },
      id: "321",
      businessAsUsual: { 
      flexCosts:[{value:10, name:'test'}],
      bauValue:'test', 
      'netPrice':'netPrice',
      id: 'netPrice',
      markupMargin: { type: "MARGIN" },
      purchaseAdjustment:'purchaseAdjustment',
      averageDiscount:'averageDiscount',
      growth:{value:'growth'}
    },
      enterpriseAgreement: {
        purchaseAdjustment:'purchaseAdjustment',
        'netPrice':'netPrice',
        id:'netPrice', 
         markupMargin: { type: "MARGIN" } },
    } as any;
  }
  class MockTcoApiCallService {
    // tcoMetaData

    finalizeModeling=jest.fn().mockReturnValue(of({
      data:{}
    }))
    restore(...ags){
      return of({
        data:{
          catalogue:{outcomes:''},
          name: { name: "" },
          prices: { businessAsUsual : { id:'test'},name: { name: "test" } },
          id: "321",
          businessAsUsual: {growth:{value:''}  ,flexCosts:[{value:10, name:'test'}],bauValue:'test',  'netPrice':1,id: 'netPrice',markupMargin: { type: "MARGIN" } },
          enterpriseAgreement: {id:'netPrice', 'netPrice':0, markupMargin: { type: "MARGIN" } },
        }
      })
    }
    implicitSave = jest.fn().mockReturnValue(of({data:{
      catalogue:{outcomes:''},
      name: { name: "" },
      prices: { businessAsUsual : {id:'test'},name: { name: "test" } },
      id: "321",
      businessAsUsual: {growth:{value:''}  ,flexCosts:[{value:10,name:'test'}], bauValue:'test',  'netPrice':1,id: 'netPrice',markupMargin: { type: "MARGIN" } },
      enterpriseAgreement: {id:'netPrice', 'netPrice':0, markupMargin: { type: "MARGIN" } },
    }}));
    getMetaData = jest.fn().mockReturnValue(of({
      data:{
        archName:'test',
        catalogue:'test',
        metadata:'test'
      }
    }));
    getTcoModeling = jest.fn().mockReturnValue(of({ data: {
      catalogue:{outcomes:''},
      name: { name: "" },
      prices: { businessAsUsual : {id:'test'},name: { name: "test" } },
      id: "321",
      businessAsUsual: { 
        flexCosts:[{value:10, name:'test'}],
        bauValue:'test', 
        'netPrice':'netPrice',
        id: 'netPrice',
        markupMargin: { type: "MARGIN" },
        purchaseAdjustment:'purchaseAdjustment',
        averageDiscount:'averageDiscount',
        growth:{value:'growth'}
      },
      enterpriseAgreement: {id:'netPrice', 'netPrice':0, markupMargin: { type: "MARGIN" } },
    } as any}));
  }
  class MockAppDataService {
    loadGraphDataEmitter = new EventEmitter();
    subHeaderData = { subHeaderVal: [1, 2, 3, 4, 5, 6, 7] };
    isAutorizedUser = (a) => a;
    custNameEmitter = new EventEmitter();
    isReadWriteAccess = true;
    getSessionDataForSummaryPage = jest.fn().mockReturnValue(
      of({
        data: {
          qualification: {},
          propsoal: {
            id: "123",
            qualificationName: "test",
            qualId: "test",
            customerName: "test",
            permissions: { featureAccess: [{ name: "test" }] },
          },
          user: { permissions: { featureAccess: [{ name: "test" }] } },
        },
      })
    );
    showActivityLogIcon = jest.fn();
    includedPartialIbEmitter = new EventEmitter();
    getSessionObject = jest.fn().mockReturnValue({
      userInfo: { firstName: "test", lastName: "test" },
      tcoDataObj: {
        catalogue:{outcomes:''},
        name: { name: "" },
        prices: { businessAsUsual : {id:'test'},name: { name: "test" } },
        id: "321",
        businessAsUsual: { 
          flexCosts:[{value:10, name:'test'}],
          bauValue:'test', 
          'netPrice':'netPrice',
          id: 'netPrice',
          markupMargin: { type: "MARGIN" },
          purchaseAdjustment:'purchaseAdjustment',
          averageDiscount:'averageDiscount',
          growth:{value:'growth'}
        },
        enterpriseAgreement: {id:'netPrice', 'netPrice':0, markupMargin: { type: "MARGIN" } },
      } ,
    });
    setSessionObject = jest.fn();
    tcoReadOnlyUser = new EventEmitter();
    tcoData = new EventEmitter<any>();
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return url;
    }
    userInfo = {
      userId: "123",
      distiUser: true,
      emailId: "abc",
      adminUser: true,
    };
  }

  class MockPermissionService {
    isProposalPermissionPage = jest.fn();
  }

  class MockLocaleService {
    getLocalizedString() { return 'test'}
  }
  class MockUtilitiesService {
    formatWithNoDecimalForDashboard = jest.fn().mockReturnValue(0);
    getFloatValue(a) {
      return 0.0;
    }
    formatValue(a) {
      return 0;
    }
    isNumberKey(e) {
      return true;
    }
  }
  class MockActivatedRoute {
    paramMap = of({
      params: {
        get: jest.fn().mockReturnValue("123"),
        keys: [1, 2],
        variable: "landing",
        selected: "qualifications",
      } as any,
    });
    params = [
      {
        get: jest.fn().mockReturnValue("123"),
        keys: [1, 2],
        variable: "landing",
        selected: "qualifications",
      },
    ];
    //paramMap=jest.fn().mockReturnValue(of({params:[{ get:jest.fn().mockReturnValue('123'), keys:[1,2], variable: "landing", selected: "qualifications" }]}))
  }
  class MockProposalDataService {
    proposalDataObject = { proposalId: "123" };

  }
  class MockQualificationsService {
    setRoSalesTeamAndQualPermissions = jest.fn();
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({});
    }
    buyMethodDisti = true;
    qualification = { qualID: "123" };
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(TcoModelingComponent);
    component = fixture.componentInstance;
    component.subscribers = { tcoData: { unsubscribe: jest.fn() } } as any;
    component.includedPartialIbSubscription = { unsubscribe: jest.fn() } as any;

    fixture.detectChanges();
  });

  // afterEach(() => {
  //   fixture.destroy();
  // });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    fixture.detectChanges();
    Object.defineProperty(component['route'], 'paramMap',{
      value:of({
        params: {
          get: jest.fn().mockReturnValue("123"),
          keys: [1, 2],
          variable: "landing",
          selected: "qualifications",
        } as any,
      })
    })
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit b1", () => {
    component["tcoDataService"].tcoDataObj = null;
    component['qualService'].buyMethodDisti=true;
    component.appDataService.userInfo.distiUser=true;
    component.appDataService.isReadWriteAccess=false;
    Object.defineProperty(component['route'], 'paramMap',{
      value:of({
        params: {
          get: jest.fn().mockReturnValue("123"),
          keys: [1, 2],
          variable: "landing",
          selected: "qualifications",
        } as any,
      })
    })
    fixture.detectChanges();
    component.ngOnInit();
    expect(component).toBeTruthy();
  });



  it("should call restoreValue", () => {
    component.restoreValue({ id: "name" }, "name");
  });
  it("should call setSessionValue", () => {
    component.setSessionValue();
  });

  it("should call averageDiscountKey", () => {
    component.averageDiscountKey({id:'averageDiscount'},{target:{value:''}});
  });

  it("should call isNumberOnlyKey", () => {
    jest.spyOn(component.utilitiesService,'isNumberKey' ).mockReturnValue(false)
    component.isNumberOnlyKey({target:{value:''}});
  });

  it("should call isNumberOnlyKey b1", () => {
    jest.spyOn(component.utilitiesService,'isNumberKey' ).mockReturnValue(true)
    component.isNumberOnlyKey({target:{value:101}});
  });

  it("should call isNumberOnlyKey b2", () => {
    jest.spyOn(component.utilitiesService,'isNumberKey' ).mockReturnValue(true)
    component.isNumberOnlyKey({target:{value:0}});
  });

  it("should call scrollBottom", () => {
    window.pageYOffset=10;
    component.scrollBottom();
  });

  it("should call showOutcomeData", () => {;
    component.showOutcomeData();
  });

  it("should call gotToListPage", () => {
    fixture.detectChanges();
    component.gotToListPage();
  });

  it("should call goToDocCenter", () => {
    fixture.detectChanges();
    component.goToDocCenter();
  });

  it("should call goToBom", () => {
    fixture.detectChanges();
    component.goToBom();
  });

  it("should call goToProposalList", () => {
    fixture.detectChanges();
    component.goToProposalList();
  });

  it("should call formatAdditionalCost", () => {
    component.arrAdditionalCost = [{name:'test', value:'test'}]
    fixture.detectChanges();
    component.formatAdditionalCost();
  });

  it("should call open", () => {
  component['valueContainer']={nativeElement:{scrollWidth:10, offsetWidth:1}} as any;
  const tool = { open : () => { }}
    component.open(tool,'');
  });

  it("should call loadUserInfo", () => {
    component["permissionService"].proposalPermissions = new Map();
    const obj = { name: "string", description: "string", disabled: false };
    component["permissionService"].proposalPermissions.set(
      "proposal.edit_name",
      obj
    );
    component["permissionService"].proposalPermissions.set(
      "proposal.delete",
      obj
    );
    component["permissionService"].proposalPermissions.set(
      "proposal.initiate_followon",
      obj
    );
    fixture.detectChanges();
    component.loadUserInfo("123");
    expect(component).toBeTruthy();
  });

  it("should call implicitSave", () => {
    component['allowImplicitSave']=true;
    fixture.detectChanges()
   component.implicitSave({bauValue:'test',bauPercentage:'', id:'netPrice',eavalue:'test',eaPercentage:'test'},'','',{target:{value:''}},'bauPercentage');
   component.implicitSave({bauValue:10,
    bauPercentage:'', 
    id:'purchaseAdjustment',
    eavalue:'test',
   },'','',{target:{value:''}},'bauValue');

    component.implicitSave({
      bauValue:10,
      bauPercentage:'', 
      id:'averageDiscount',
      eavalue:1,
    },'','',{target:{value:''}},'eavalue');

    component.implicitSave({
      bauValue:'test,test',
      bauPercentage:'', 
      id:'growth',
      eavalue:1,
    },'','',{target:{value:''}},'eavalue');
 
 
 
  });

    it("should call deleteRow", () => {
      const promise = new Promise((resolve, reject) => {
        resolve({continue:true})
      })
      component.modalVar = { open: jest.fn().mockReturnValue({result:promise,componentInstance:{message:''}})} as any;
    fixture.detectChanges()
   component.deleteRow(0);
  });




  it("should call ngOnInit b2", () => {
    Object.defineProperty(component['route'], 'paramMap',{
      value:of({
        params: {
          get: jest.fn().mockReturnValue("test"),
          keys: [1, 2],
          variable: "landing",
          selected: "qualifications",
        } as any,
      })
    })

    fixture.detectChanges();
    component.ngOnInit();
    component.appDataService.includedPartialIbEmitter.emit('123')
  });

 


  it("should call setMarkUpMargin", () => {
    component.tcoDataObject.enterpriseAgreement.markupMargin = { type: "test" };
    fixture.detectChanges();
    component.setMarkUpMargin();
  });

  it("should call getTcoModelingData", () => {
    fixture.detectChanges();
    component.getTcoModelingData();
  });

  it("should call cancel", () => {
    fixture.detectChanges();
    component.cancel();
  });

  it("should call showStackedGrph", () => {
    fixture.detectChanges();
    component.showStackedGrph();
  });

  it("should call showBarGrph", () => {
    fixture.detectChanges();
    component.showBarGrph();
  });

  it("should call implicitSaveAdditionalCost", () => {
    fixture.detectChanges();
    const obj   ={name:'test', value:'test'}
    component.implicitSaveAdditionalCost(obj);
  })

  it("should call restoreDefault", () => {
    fixture.detectChanges();
    component.restoreDefault('123');
  })

  it("should call setFlexCost", () => {
    fixture.detectChanges();
    component.setFlexCost();
  })

  it("should call getModelingdata", () => {
    fixture.detectChanges();
    component.getModelingdata();
  })

  it("should call getGraphData", () => {
    fixture.detectChanges();
    component.getGraphData();
  })

  it("should call continue", () => {
    fixture.detectChanges();
    component.roadMap ={
      eventWithHandlers:{ continue :jest.fn()},
      component:component,
      canDeactivate :jest.fn(),
      name:'test'
    }
      component.continue();
      component.loadReviewFinalize = true;
      component.continue();

  })

  it("should call backToOutcome", () => {
    fixture.detectChanges();
    component.roadMap ={
      eventWithHandlers:{ continue :jest.fn() , backToOutcome:jest.fn()},
      component:component,
      canDeactivate :jest.fn(),
      name:'test'
    }
      component.backToOutcome();
  })

  it("should call addMore", () => {
    fixture.detectChanges();
    component.arrAdditionalCost.push({ 'name': 'test', 'value': '10' });
    component.addMore();
  })

  it("should call numberOnlyKey", () => {
    fixture.detectChanges();
    event = {preventDefault: jest.fn() } as any
    component.arrAdditionalCost.push({ 'name': 'test', 'value': '10' });
    component.numberOnlyKey({bauValue:''}, { target:{value:''}, keyCode:200, shiftKey:true}, 'averageDiscount');
    component.numberOnlyKey({bauValue:''}, { target:{value:''}, keyCode:200, shiftKey:true});
  })


  it("should call selectOption", () => {
    fixture.detectChanges();
    component.selectOption('MARKUP','ea');
    component.selectOption('MARKUP','ea1');
  })

  it("should call hasChangedFromInitialValue", () => {
    fixture.detectChanges();
    component.hasChangedFromInitialValue({ id : 'test' , bauEditable:false},'businessAsUsual');
  })



  it("should call setTCOModellingData", () => {
    let service = fixture.debugElement.injector.get(AppDataService);
    // fixture.detectChanges();
    component['tcoDataService'].loadReviewFinalize=false;
    component['tcoDataService'].isHeaderLoaded=false;
    
    // component.proposalDataService.proposalDataObject.proposalId='';
    component.setTCOModellingData();
    component.appDataService.tcoData.emit({disableMode :true})
    
    component['tcoDataService'].loadReviewFinalize=true;
    component['tcoDataService'].catalogueMetaData={id:'123'};
    component.setTCOModellingData();

  });


});


