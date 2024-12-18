import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { Router } from "@angular/router";
import { EventEmitter } from "@angular/core";
import { Subject, of } from "rxjs";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { PartnerDealCreationComponent } from "./partner-deal-creation.component";
import { LocaleService } from "../services/locale.service";
import { PartnerDealCreationService } from "./partner-deal-creation.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QualificationsService } from "@app/qualifications/qualifications.service";

describe("PartnerDealCreationComponent", () => {
  let component: PartnerDealCreationComponent;
  let fixture: ComponentFixture<PartnerDealCreationComponent>;


  class MockUtilitiesService {
    saveFile= jest.fn();
    changeMessage = jest.fn();
    checkDecimalOrIntegerValue = jest.fn().mockReturnValue(10);
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

  class MockRouter {
    navigate = jest.fn();
  }

  class MockAppDataService {
    redirectForCreateQualification(...a) {
      return of({});
    }
    cleanCoreAuthorizationCheck() {
      return of({data:{eligible:true}});
    }
    
    setSessionObject = jest.fn();
    isTwoTUserUsingDistiDeal = jest.fn();
    createUniqueId = jest.fn();
    engageCPSsubject = new Subject();
    getSessionObject = jest.fn().mockReturnValue({
      qualificationData: { qualID: "123", name: "test" },
      userInfo: { firstName: "test", lastName: "test" },
      tcoDataObj: { id: "123" },
    });
    custNameEmitter = new EventEmitter();
    changeSubPermissionEmitter = new EventEmitter();
    showActivityLogIcon = jest.fn();
    userId = "123";
    customerID = "123";
    customerName = "test";
    isQualOrPropListFrom360Page = true;
    get getAppDomain() {
      return "";
    }
    userInfo = {
      userId: "123",
    };

    subHeaderData = { moduleName: "test" };

    getDetailsMetaData(...args) {
      return {};
    }
  }

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }


  class MockLocaleService {
    getLocalizedString(value) {}
    getLocalizedMessage() {
      return "test";
    }
  }


  class MockPartnerDealCreationService{
    uploadAdditionalDoc(...a){
        return of({
            data:{
                signatureValidDate:true
            }
        })
    }
    initiateDocusign(...a){
        return of({
            data:{}
        })
    }
    downloadUnsignedDoc(url){
      return of({});
    }
    getLOCCData(){
        return of({
            data:{
                redirect:false,
                subRefId:'123',
                redirectUrl:'test',
                partnerDeal:true,
                loaDetail:{deal:{dealId:'123'}},
                dealId:'123',
                document:{status:'sent'}
            }
        })
    }
  }


  class MockQualificationsService {
    partnerDealLookUpEmitter= new EventEmitter();
    prepareSubHeaderObject(...a){

    }
    dealData={dealId:123}
    qualification = { dealId:'123', qualID: '123' };
    loaData={partnerBeGeoId:'123',customerGuId:'123',partnerDeal:true}
    viewQualSummary(data) { }
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() { return of({}) }
    loaCustomerContactUpdateEmitter=new EventEmitter();
}
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PartnerDealCreationComponent],
      providers: [
          { provide: AppDataService, useClass: MockAppDataService },
        { provide: Router, useClass: MockRouter },
        {
          provide: LocaleService,
          useClass: MockLocaleService,
        },
        {
          provide: PartnerDealCreationService,
          useClass: MockPartnerDealCreationService,
        },
        NgbModal,
        { provide: QualificationsService, useClass: MockQualificationsService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: BlockUiService, useClass: MockBlockUiService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerDealCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });


  it("should call ngOnInit", () => {
    jest.spyOn(window,'open')
    component.ngOnInit();
  });

  it("should call ngOnInit b1", () => {
    jest.spyOn(window,'open')
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:{
            redirect:false,
            subRefId:'123',
            redirectUrl:'test',
            partnerDeal:true,
            loaDetail:{deal:{dealId:'123'}, loaCustomerContact:{repEmail:'test', repName:'test', repTitle :'test'}},
            dealId:'123',
            document:{status:'sent'},
        }
    }))
    component.ngOnInit();
  });

  it("should call ngOnInit b2", () => {
    jest.spyOn(window,'open')
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:{
            redirect:true,
            subRefId:'123',
            redirectUrl:'test',
            partnerDeal:true,
            loaDetail:{deal:{dealId:'123'}, loaCustomerContact:{repEmail:'test', repName:'test', repTitle :'test'}},
            dealId:'123',
            document:{status:'sent'},
        }
    }))
    component.ngOnInit();
  });


  it("should call ngOnInit b3", () => {
    jest.spyOn(window,'open')
    const qualService = fixture.debugElement.injector.get(QualificationsService);
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);

    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:{
            redirect:false,
            subRefId:'123',
            redirectUrl:'test',
            partnerDeal:false,
            loaDetail:{deal:{dealId:'123'}, loaCustomerContact:{repEmail:'test', repName:'test', repTitle :'test'}},
            dealId:'123',
            document:{status:'sent'},
        }
    }))
    component.ngOnInit();
  });

  it("should call ngOnInit b5", () => {
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:{
            redirect:false,
            subRefId:'123',
            redirectUrl:'test',
            partnerDeal:true,
            loaDetail:{deal:{dealId:'123'}, loaCustomerContact:{repEmail:'test', repName:'test', repTitle :'test'}},
            dealId:'123',
            document:{status:'pending'},
        }
    }))
    component.ngOnInit();
  });

  it("should call ngOnInit b4", () => {
    jest.spyOn(window,'open')
    const qualService = fixture.debugElement.injector.get(QualificationsService);
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
    component.isGreenfiled =true;
    component.isBrownField=true;
    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:{
            redirect:false,
            subRefId:'123',
            redirectUrl:'test',
            partnerDeal:true,
            loaDetail:{deal:{dealId:'123'}, loaCustomerContact:{repEmail:'test', repName:'test', repTitle :'test'}},
            dealId:'123',
            document:{status:'pending'},
        }
    }))
    component.ngOnInit();
  });




  it("should call ngOnInit b6", () => {
    const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(partnerDealCreationService, 'getLOCCData').mockReturnValue(of({
        data:null,error:true,message:['Test Error']
    }))
    component.ngOnInit();
    component.qualService.loaCustomerContactUpdateEmitter.emit({})
  });

  it("should call selectAuthorization", () => {
    const event = { target:{ value :'defer'}}
    component.selectAuthorization(event);
  });

  it("should call selectAuthorization b1", () => {
    const event = { target:{ value :'signature'}}
    component.initiateStep2 =false;
    component.initiateStep3  =false;
    component.isShowSendAgain  =false;
    component.selectAuthorization(event);
  });

  it("should call selectAuthorization b2", () => {
    const event = { target:{ value :'something'}}
    component.selectAuthorization(event);
  });

  it("should call removeUploadedDocs", () => {
    component.filesUploadedData =['test']
    component.removeUploadedDocs();
  });

  it("should call goToWhoInvolved", () => {
    Object.defineProperties(component['modalVar'],{
        open :{
            value:jest.fn().mockReturnValue({
                componentInstance:{

                }
            })
        }
    })
    component.goToWhoInvolved();
  });

  it("should call continue", () => {
    component.initiateStep1 =true;
    component.initiateStep2 =false;
    component.continue();
  });

  it("should call continue b1", () => {
    component.initiateStep1 =false;
    component.initiateStep2 =true;
    component.continue();
  });

  it("should call isCustomerReady", () => {
    const event = { target:{ value :'yes'}}
    component.isCustomerReady(event);
  });

  it("should call isCustomerReady", () => {
    const event = { target:{ value :'no'}}
    component.isCustomerReady(event);
  });

  it("should call back", () => {
    component.initiateStep3 =true;
    component.initiateStep2 =false;
    component.back();
  });

  it("should call back b1", () => {
    component.initiateStep3 =false;
    component.initiateStep2 =true;
    component.back();
  });

  
  it("should call fileOverBase", () => {
    const event = { target:{ value :'no'}}
    component.fileOverBase(event);
  });

  it("should call dropped", () => {
    const ele = document.createElement('input')
    jest.spyOn(document, 'getElementById').mockReturnValue(ele)
    const event = { target:{ value :'no'}}
    event[0]={name:'file.png'};
    Object.defineProperty(component.uploader , 'queue' , {
        value:['test']
    })
    component.dropped(event);
  });

  it("should call onFileChange", () => {
    const event = { target:{ files:[{name:'file.png'}], value :'no'}}
    component.onFileChange(event);
  });

  it("should call onFileChange b1", () => {
    const event = { srcElement:{value:'test'}, target:{ files:[{name:'file.pdf'}], value :'no'}}
    component.onFileChange(event);
  });

  it("should call downloadAuthorizationLetter", () => {
    component.downloadAuthorizationLetter();
  });

  it("should call downloadAuthorizationLetter b1", () => {
    component.signatureSigned=true;
    const service = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(service, 'downloadUnsignedDoc').mockReturnValue(of({
        data:{},
        error:true,
        message:['test error']
    } as any))
    component.downloadAuthorizationLetter();
  });

  it("should call removeFile", () => {
    component.filesUploadedData = ['test.png']
    component.removeFile('test.png');
  });

  it("should call docusign", () => {
    component.docusign();
  });

  it("should call docusign b1", () => {
    const service = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(service, 'initiateDocusign').mockReturnValue(of({
        data:null ,
        error:true,
        message:['test error']
    }))
    component.docusign();
  });


  it("should call import", () => {
    component.import();
  });

  it("should call import b1", () => {
    const service = fixture.debugElement.injector.get(PartnerDealCreationService);
    jest.spyOn(service, 'uploadAdditionalDoc').mockReturnValue(of({
        data:null ,
        error:true,
        message:['test error']
    }))
    component.import();
  });

  it("should call continueDealLookup", () => {
    component.continueDealLookup();
  });


  it("should call continueDealLookup b1", () => {
    component.signaturePending =false;
    component.continueDealLookup();
  });

  it("should call downloadFile", () => {
    component.downloadFile('');
  });

  it("should call skip", () => {
    const promise  = Promise.resolve({continue:true});
    Object.defineProperties(component['modalVar'],{
        open :{
            value:jest.fn().mockReturnValue({
                result:promise
            })
        }
    });
    component.skip();
  });

  it("should call skip b1", () => {
    const promise  = Promise.reject({continue:false});
    Object.defineProperties(component['modalVar'],{
        open :{
            value:jest.fn().mockReturnValue({
                result:promise
            })
        }
    });
    component.skip();
  });

  it("should call sendAgain", () => {
    const promise  = Promise.resolve({continue:true});
    Object.defineProperties(component['modalVar'],{
        open :{
            value:jest.fn().mockReturnValue({
                result:promise,
                componentInstance:{isLOA :''}
            })
        }
    });
    component.sendAgain();
  });

  it("should call selectValidMonth", () => {
    component.selectValidMonth('');
  });

  it("should call onDateSelection", () => {
    const event = { target:{ files:[{name:'file.png'}], value :'no'}}
    component.onDateSelection(event);
  });

  it("should call processFile", () => {
    const files =[{name:'test.pdf'}];
    component.processFile(files[0], {  srcElement:{value:'test'}} , {files:files});
    expect(component.fileFormatError).toBe(false)
  });

});
