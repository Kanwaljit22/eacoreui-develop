import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { ElementRef, EventEmitter, Renderer2 } from "@angular/core";
import { of } from "rxjs";
import { AllArchitectureViewService } from "@app/all-architecture-view/all-architecture-view.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { MessageService } from "@app/shared/services/message.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ManageTeamMembersComponent } from "./manage-team-members.component";
import { LocaleService } from "@app/shared/services/locale.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpCancelService } from "@app/shared/services/http.cancel.service";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { ManageTeamMembersPipe } from "@app/shared/pipes/manage-team-members.pipe";

describe("ManageTeamMembersComponent", () => {
  let component: ManageTeamMembersComponent;
  let fixture: ComponentFixture<ManageTeamMembersComponent>;

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  class MockAppDataService {
    isPatnerLedFlow = true;
    getTeamMembers = jest.fn().mockReturnValue(of({}));
    validateResponse(res) {
      return res;
    }
    custNameEmitter = new EventEmitter();
    prettifyNumber = jest.fn().mockReturnValue(120);
    // getAccountHealthData
    getDetailsMetaData = jest.fn();
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
  class MockQualificationsService {
    updateSessionQualData=jest.fn();
    qualification = {
      cam: { firstName: "ts" },
      qualID: "123",
      extendedsalesTeam: "",
      softwareSalesSpecialist: [{ name: "test" }],
      partnerTeam: "",
    };
    loaData = { partnerBeGeoId: "123", customerGuId: "123" };
    viewQualSummary(data) {}
    loadUpdatedQualListEmitter = new EventEmitter();
    reloadSmartAccountEmitter = new EventEmitter();
    listQualification() {
      return of({ messages: [1, 2], data: [1, 2, 3], error: false });
    }
  }

  class MockWhoInvolvedService {
    lookUpUser=jest.fn().mockReturnValue(of({}))
    contactAPICall = jest.fn().mockReturnValue(of({data:[],messages :['test']}));
    getCamLocatorUrl = jest.fn().mockReturnValue(of({}));
    prepareRequestData = jest.fn().mockReturnValue((['test']));
    getCamData = jest.fn().mockReturnValue(of({ data: "test", error: false }));
  }

  class MockHttpCancelService{
    cancelPendingRequests=jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      teardown: { destroyAfterEach: false },
      imports: [],
      declarations: [ManageTeamMembersComponent, ManageTeamMembersPipe],
      providers: [
        { provide: QualificationsService, useClass: MockQualificationsService },
        LocaleService,
        { provide: AppDataService, useClass: MockAppDataService },
        { provide: MessageService, useClass: MockMessageService },
        {provide:HttpCancelService, useClass: MockHttpCancelService },
        { provide: WhoInvolvedService, useClass: MockWhoInvolvedService },
        Renderer2,
        NgbActiveModal,
        ConstantsService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamMembersComponent);
    component = fixture.componentInstance;
    component.extentedSalesTeam =component.dedicatedSalesTeam = [];
    component.ngOnInit();
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    component.isPartnerDeal = true;
    component.extentedSalesTeam =component.dedicatedSalesTeam = [];
    component.ngOnInit();
  });

  it("should call onCamChange", () => {
    const camObj = {
      fullName: "test",
      firstName: "test",
      lastName: "tets",
      email: "test",
      ccoId: "test",
      cam: true,
    };
    component.onCamChange(camObj);
  });

  it("should call onCamChange", () => {
    jest.spyOn(window, "open");
    component.openCAMLocator();
  });

  it("should call addSelected", () => {
    component.activeModal = { close: jest.fn() } as any;
    component.addSelected();
  });

  it("call focusInput", () => {
    const renderer = fixture.debugElement.injector.get(Renderer2);
    jest
      .spyOn(renderer, "selectRootElement")
      .mockReturnValue({ focus: jest.fn() });
    component.focusInput("test");
  });

  it("call onSuggestedSpecialistClick", () => {
    const val = "createTco";
    component.onSuggestedSpecialistClick(val);
  });

  it("call removeSelectedSpecialist", () => {
    component.selectedSpecialist = ["test"];
    component.removeSelectedSpecialist("test");
  });

  it("call checkNotifySwss", () => {
    component.checkNotifySwss("swssEmail");
    component.checkNotifySwss("swssWebex");
    component.checkNotifySwss("swssWalkme");
  });

  it("call checkNotifyEst", () => {
    component.checkNotifyEst("estEmail");
    component.checkNotifyEst("estWebex");
    component.checkNotifyEst("estWalkme");
  });

  it("call addSpecialist", () => {
    component.selectedSpecialist = [{}];
    component.extentedSalesTeam =component.dedicatedSalesTeam = [];
    component.selectedSpecialist[0].access = "test";
    component.selectedSpecialist[0].notification = "test";
    component.selectedSpecialist[0].webexNotification = "test";
    component.selectedSpecialist[0].notifyByWelcomeKit = "test";
    component.selectedSpecialist[0].name = "test";
    component.addSpecialist();
  });

  it("call addSpecialist", () => {
    component.selectedSpecialist = [{}];
    component.selectedSpecialist[0].access = "test";
    component.selectedSpecialist[0].notification = "test";
    component.selectedSpecialist[0].webexNotification = "test";
    component.selectedSpecialist[0].notifyByWelcomeKit = "test";
    component.selectedSpecialist[0].name = "test1";
    component.addSpecialist();
  });

  it("call updateEstRow", () => {
    const obj1 ={notification:'Yes',webexNotification:'Y'}
    component.updateEstRow(obj1,'notification');
  });

  it("call updateEstRowObject", () => {
    const obj1 ={notification:'Yes',webexNotification:'Y',access:'ro'}
    const obj2 ={notification:'Yes',webexNotification:'N',access:'ro'}

    component['updateEstRowObject'](obj1,'accessType');
    component['updateEstRowObject'](obj2,'accessType');

  });

  it("call updateEstRowObject", () => {
    const obj1 ={notification:'Yes',webexNotification:'Y',access:'ro'}
    component['updateEstRowObject'](obj1,'webexTeam');
  });

  it("call updateEstRowObject", () => {
    const obj1 ={notification:'Yes',webexNotification:'Y',access:'ro'}
    component['updateEstRowObject'](obj1,'webexTeam');
  });
  
  it("call updateEstRowObject", () => {
    const obj1 ={notification:'Yes',notifyByWelcomeKit:'Y',access:'ro'}
    component['updateEstRowObject'](obj1,'walkmeTeam');
  });

  it("call SspEditAccess", () => {
    const obj1 ={target:{value:'rw'}}
    component.SspEditAccess(obj1,{access:''});
  });

  it("call SspEditAccess", () => {
    const obj1 ={target:{value:'ro'}}
    component.SspEditAccess(obj1,{access:''});
  });

  it("call SspEditCheckbox", () => {
    const obj1 ={notification:'Yes',notifyByWelcomeKit:'Y',access:'ro'}
    component.SspEditCheckbox(false, obj1,'email');
    component.SspEditCheckbox(false, obj1,'webexTeam');
    component.SspEditCheckbox(false, obj1,'walkmeTeam');
    component.SspEditCheckbox(false, obj1,'');
  });

  it("call onChangeSalesInputValue", () => {
   
    component.onChangeSalesInputValue(false);
  });

  it("call showList", () => {
   
    component.showList();
  });

  it("call hideList", fakeAsync(() => {
    component.hideList();
    tick(500)
  }));

  it("call onChangeInputValue", (() => {
    const obj ={}
    component.onChangeInputValue('T');
    component.onChangeInputValue('TEST');
  }));

  it("call onSuggestedItemsClick", (() => {
    const obj ={fullName:'t'}
    component.selectedSales=[{fullName:'t'}]
    component.onSuggestedItemsClick(obj);
  }));

  it("call onSuggestedItemsClick", fakeAsync(() => {
    const obj ={fullName:'t'}
    component.selectedSales=[]
    component.onSuggestedItemsClick(obj);
    tick(501)
  }));

  it("call addMembers", (() => {
    const obj =null;
    component.qualService.qualification.extendedsalesTeam =[{test:'test'}];
    component.selectedSales = [1]
    // component.selectedSales=[{fullName:'t'}]
    component.addMembers(obj);
  }));
  
  it("call addMembers", (() => {
    const camObj = {
        fullName: "test",
        firstName: "test",
        lastName: "tets",
        email: "test",
        ccoId: "test",
        cam: true,
      };
    component.qualService.qualification.extendedsalesTeam =[{test:'test'}];
    component.selectedSales = [1]
    component.addMembers(camObj);
  }));
  
  it("call removeMembers", (() => {
    const camObj = {
        fullName: "test",
        firstName: "test",
        lastName: "tets",
        email: "test",
        ccoId: "test",
        cam: true,
      };
    component.qualService.qualification.extendedsalesTeam =['test'];
    component.removeMembers('test');
  }));

  it("call removeSpecialist", (() => {
    component.qualService.qualification.extendedsalesTeam =['test'];
    component.removeSpecialist( {specialist : 'test'} , '');
  }));

  it("call removeSelected", (() => {

    component.selectedSales = ['test']
    component.removeSelected( 'test' );
  }));

  it("call onClickedOutside", (() => {
    component.onClickedOutside( 'test' as any);
  }));

  it("call searchUser", (() => {
    component.searchSalesTeam = [1,2,3,4] as any
    component.searchUser();
  }));

  it("call selectedItem", fakeAsync(() => {
    component.selectedSales = [] as any
    component.selectedItem('test');
    tick(100)
  }));

  it("call close", (() => {
    component.activeModal = { close: jest.fn()} as any
    component.dedicatedSalesTeam =component.extentedSalesTeam= [{name:''}] as any
    component.close();
  }));

  it("call updateNotifyAllSWSS", (() => {
    component.dedicatedSalesTeam =component.extentedSalesTeam= [{name:''}] as any
    component.updateNotifyAllSWSS('email');
    component.updateNotifyAllSWSS('webex');
    component.updateNotifyAllSWSS('walkme');
  }));

  it("call updateNotifyAllSWSS", (() => {
    component.dedicatedSalesTeam =component.extentedSalesTeam= [{name:''}] as any
    component.updateNotifyAllEst('email');
    component.updateNotifyAllEst('webex');
    component.updateNotifyAllEst('walkme');
  }));

  it("call showExtendedTeamList", (() => {
    component.showExtendedTeamList();
  }));

  it("call hideExtendedTeamList", fakeAsync(() => {
    component.hideExtendedTeamList();
    tick(500)
  }));


  it("call checkboxSelectors", (() => {
    component.dedicatedSalesTeam =component.extentedSalesTeam= [{name:''}] as any
    component.checkboxSelectors();
  }));
});
