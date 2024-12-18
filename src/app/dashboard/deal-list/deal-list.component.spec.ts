import { ComponentFixture, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { DealListComponent } from "./deal-list.component";
import { EventEmitter, NO_ERRORS_SCHEMA, Renderer2, SimpleChange, SimpleChanges, Type } from "@angular/core";
import { AppDataService } from "@app/shared/services/app.data.service";
import { ConstantsService } from "@app/shared/services/constants.service";
import { LocaleService } from "@app/shared/services/locale.service";
import { DashboardService } from "../dashboard.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { PermissionService } from "@app/permission.service";
import { DealListService } from "./deal-list.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { PartnerDealCreationService } from "@app/shared/partner-deal-creation/partner-deal-creation.service";
import { UtilitiesService } from "@app/shared/services/utilities.service";
import { CurrencyPipe } from "@angular/common";
import { SearchPipe } from "@app/shared/pipes/search.pipe";
import { Subject,of } from "rxjs";
import { CreatedByTeamPipe } from "./created-by-team.pipe";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import {  HttpEventType, HttpHeaders, HttpResponse } from "@angular/common/http";


describe('DealListComponent', () => {
  let component: DealListComponent;
  let fixture: ComponentFixture<DealListComponent>;
  let httpController: HttpTestingController;

  const mockAppDataService = {
    createQualEmitter: new EventEmitter(),
    findUserInfo: () => { },
    isReload: true,
    engageCPSsubject: new Subject(),
    userInfo: { userId: '123', distiUser: true, accessLevel: 0, authorized: false, partnerAuthorized: false }
  }

  const mockLocaleService = {
    getLocalizedString: jest.fn().mockReturnValue({ key: 'jest', value: 'test' })
  }

  class MockQualificationsService { 
    viewQualSummary(data){}
  }

  class MockProposalDataService {
    proposalDataObject = { proposalData: { groupName: "test" } }
  }

  class MockDashboardService {
    getDealData() {
      return of({})
    }
  }

  class MockUtilityService {
    saveFile(res , link){

    }
   }

  class MockPartnerDealCreationService{
    downloadUnsignedDoc(url){
      return of({});
    }
  }

  class MockRenderer{
    selectRootElement(param){

    }
  }
  const mockDealListService = {
    pagination: {
      currentPage: 1,
      noOfRows: 1,
      totalRecords: 1
    },
    getColumnsData: () => {
      return of([])
    },
    getDealData:
      (data) => {
        return of({
        });
      },
    dealSearchEmitter: new EventEmitter(),
    showFullList: true,
    dealListData: { data: [], isCreatedByMe: true },
    isCreatedByMe: true,
    dealSearchChangesEmitter: new EventEmitter()

  }

  const mockMessageService = {
    displayUiTechnicalError(error) { },
    displayMessagesFromResponse(res) { }
  }


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DealListComponent, CreatedByTeamPipe, SearchPipe],
      providers: [
        {
          provide: LocaleService,
          useValue: mockLocaleService
        },
        ConstantsService,
        { provide: DashboardService, useClass: MockDashboardService },
        { provide: MessageService, useValue: mockMessageService },
        NgbModal,
        { provide: QualificationsService, useClass: MockQualificationsService },
        {
          provide: AppDataService,
          useValue: mockAppDataService
        },
        PermissionService,
        { provide: DealListService, useValue: mockDealListService },
        Router,
        { provide: ProposalDataService, useClass: MockProposalDataService },
        {provide :PartnerDealCreationService, useClass:MockPartnerDealCreationService},
        { provide: UtilitiesService, useClass: MockUtilityService },
        BlockUiService,
        {provide:Renderer2, useClass:MockRenderer}

      ],
      imports: [HttpClientTestingModule, CurrencyPipe],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealListComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const appDataSer = fixture.debugElement.injector.get(AppDataService)
    appDataSer.showEngageCPS = false;
    component.userDashboard = false;
    appDataSer.isGroupSelected = true;
    const dealListService = fixture.debugElement.injector.get(DealListService)
    dealListService.isCreatedByMe = false;
    const func = jest.spyOn(component, 'loadDealList');
    const permissionService = fixture.debugElement.injector.get(PermissionService)
    permissionService.permissions = new Map().set('Key', 'Value')
    component.ngOnInit();
    expect(component.dealData).toBeDefined();
    expect(component.displayGridView).toBeTruthy();
    expect(component.globalView).toBeTruthy();
    expect(component.DealViewOptions).toBeTruthy();
    expect(component.selectedDealView).toBeDefined();
    expect(component.loggedInUser).toBe('123');
    expect(func).toBeCalled();
  });

  it('should call ngOnint : when dealSearchEmitter emits ', (done) => {
    const dealListSer = fixture.debugElement.injector.get(DealListService)
    component.ngOnInit();
    const loadDealListSpy = jest.spyOn(component, 'loadDealList')
    dealListSer.dealSearchEmitter.subscribe({
      next: (data) => {
        done();
        expect(component.loggedInUser).toBe('123');
        expect(component.dealSearchObject).toBeNull();
        expect(loadDealListSpy).toBeCalled()
      }
    })
    component.dealListService.dealSearchEmitter.emit(null)
  });

  it('should call ngonInit: when createQualEmitter emits', (done) => {
    const appDataServiceSpy = fixture.debugElement.injector.get(AppDataService)
    component.ngOnInit();
    const loadDealListSpy = jest.spyOn(component, 'loadDealList')
    appDataServiceSpy.createQualEmitter.subscribe({
      next: (data) => {
        done();
        expect(component.loggedInUser).toBe('123');
        expect(loadDealListSpy).toBeCalled()
      }
    })
    component.appDataService.createQualEmitter.emit(null)
  })


  it('should call loadDealList', () => {
    component.dealListService.showFullList = true;
    fixture.detectChanges();
    const func = jest.spyOn(component, 'getDealData')
    component.loadDealList();
    expect(component.showFullList).toBeTruthy();
    expect(func).toHaveBeenCalled();
  });

  it('should call onClickedOutside', () => {
    component.onClickedOutside('');
    expect(component.openDealDrop).toBeFalsy();
  });


  it('should call globalSwitchChange', () => {
    component.userDashboard = false;
    component.globalView = true;
    const funcSpy = jest.spyOn(component, 'getDealData')
    component.globalSwitchChange('');
    expect(component.globalView).toBeFalsy();
    expect(component.dealSearchObject).toBeFalsy();
    expect(component.hideDealGrid).toBeFalsy();
    expect(component.paginationObject.page).toBe(1);
    expect(component.searchDeal).toBe('');
    expect(funcSpy).toBeCalled();
  });

  it('should call onFilterTextBoxChanged', () => {
    component.onFilterTextBoxChanged();
    expect(component.dataNotLoaded).toBeTruthy();
    expect(component.hideDealGrid).not.toBeUndefined();

  });

  it('should call appendId', () => {
    component.rowData = []
    component.appendId();
    expect(component.rowData).toEqual([]);
  })

  it('should call pageChanged', () => {
    const loadDealListSpy = jest.spyOn(component, 'loadDealList')
    component.pageChange();
    expect(loadDealListSpy).toHaveBeenCalled();
  })

  it('should call toggleView', () => {
    component.displayGridView = true;
    component.toggleView();
    expect(component.displayGridView).toBeFalsy();
  })

  it('should call onGridReady', () => {
    const getTableColumnsDataSpy = jest.spyOn(component, 'getTableColumnsData')
    component.onGridReady('');
    expect(getTableColumnsDataSpy).toBeCalled();
  })

  it('should call searchByDeal', () => {
    component.displayGridView = true;
    component.searchDeal = 'test';
    const onFilterTextBoxChangedSpy = jest.spyOn(component, 'onFilterTextBoxChanged');
    component.searchByDeal('test');
    expect(onFilterTextBoxChangedSpy).toBeCalled();
  });

  it('should call ngOnDestroy', () => {
    component.subscribers.dealList = { unsubscribe() { } };
    component.subscribers.dealSearchEmitter = { unsubscribe() { } };
    const subs1 = jest.spyOn(component.subscribers.dealList, 'unsubscribe');
    const subs2 = jest.spyOn(component.subscribers.dealList, 'unsubscribe');
    component.ngOnDestroy();
    expect(subs1).toBeCalled();
    expect(subs2).toBeCalled();
  });

  it('should call getQualListForDeal', () => {
    let val: Promise<true>;

    let url = "qualifications/create-qualifications";
    const navSpy = jest.spyOn(component['router'], 'navigate').mockReturnValue(val);
    component.getQualListForDeal({});
    expect((component['router'].navigate)).toHaveBeenCalledWith([url, { dId: undefined, qId: undefined }]);
  })

  it('should call onPageSizeChanged', () => {
    const loadDealListSpy = jest.spyOn(component, 'loadDealList')
    const messageServiceSpy = fixture.debugElement.injector.get(MessageService)
    jest.spyOn(messageServiceSpy, 'displayUiTechnicalError')
    fixture.detectChanges();

    component.onPageSizeChanged({});
    expect(loadDealListSpy).toHaveBeenCalled();
    expect(component.paginationObject.pageSize).toEqual({});
    expect(component.paginationObject.page).toBe(1);

  });

  it('should call getTableColumnsData',(done) => {
    const dealListServ= fixture.debugElement.injector.get(DealListService);
    component.getDealOwner = ()=>{
      return 'test'
    }
    const dummyDate = '15 Jul 2023';
    const mockArray = [
      {
      field:  'dealName',
      cellRenderer:'dealCell'
    },
  {
    field:'dealExpectedCloseDate',
    cellRenderer: dummyDate
  },
  {
    field:'dealCreator',
    cellRenderer:component.getDealOwner
  }
  
  ]
    jest.spyOn( dealListServ,'getColumnsData').mockReturnValue(of(mockArray));
    jest.spyOn( component,'getDate').mockReturnValue(dummyDate);

    component.getTableColumnsData();
    fixture.detectChanges();
    component.dealListService.getColumnsData().subscribe((data:any) => {
      done();
      const columns =  data
      for (let i = 0; i < columns.length; i++) {
        const column =columns[i];
        if (column['field'] === 'dealName') {
          expect(column.cellRenderer).toBe('dealCell')
        }
        if (column['field'] === 'dealExpectedCloseDate') {
          column.cellRenderer = component.getDate(column.cellRenderer);
          expect(column.cellRenderer).toBe(dummyDate)
        }
        if (column['field'] === 'dealCreator') {
          expect(column.cellRenderer()).toBe('test')

        }
      }
      expect(component.columnDefs).toEqual(data);
    })
  });

it('should call getDealName', () => {
  const param = {value:'test'};
  const dealName = '<span class="text-link">' +param.value + '</span>';
  const downloadIcon = '<a #downloadZipLink [hidden]="true"></a><a href="javascript:" style="position: absolute;right: 0;top: 0px; width: 19px; height: 30px;padding-top: 6px;"><span class="custom-tooltip-locc-wrap"><span class="icon-download-doc" placement="top" container="body"><div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Download Unsigned LoCC</span></div><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span></span></a>';
  const res = component.getDealName(param);
  expect(res).toBe(dealName + downloadIcon);
});

it('should call getDate', () => {
  const date =  { value : '12 Jul 2023' };
  const result = component.getDate(date);
  expect(result).toBe(date.value);
});

it('should call getDealOwner', () => {
  const params =  { value : 'test' , data :{partnerContactFName:"F",partnerContactLName:"L"  }};
  const result = component.getDealOwner(params);
  let tobe = params.data.partnerContactFName + ' ' + params.data.partnerContactLName + ' (' + params.value + ')';
  expect(result).toBe(tobe);
});

it('should call getTableData when searchDeal is set', () => {
  component.searchDeal = "YES";
  const mockCall = jest.spyOn(component , 'onFilterTextBoxChanged')
   component.getTableData();
   expect(mockCall).toBeCalled();
});

it('should call getTableData when searchDeal is unset', () => {
   component.searchDeal = "";
   component.getTableData();
   expect(component.hideDealGrid).toBeFalsy();
});

it('should call selectDeal', () => {
  const value ='Created by Me';
  component.selectedDealView='';
  const mockCall = jest.spyOn(component , 'globalSwitchChange');
  component.selectDeal(value);
  fixture.detectChanges();
  expect(mockCall).toBeCalled();
  expect(component.openDealDrop).toBeFalsy();
  expect(component.selectedDealView).toBe(value);
});

it('should call downloadLoccDoc', () => {
  const dataObj = {};
  const mockUrl = 'test';
  const view = 'grid';
  const partnerDealCreationService = fixture.debugElement.injector.get(PartnerDealCreationService);
  const utilityService =  fixture.debugElement.injector.get(UtilitiesService)
  const httpResponse :HttpResponse<any>= {
    body: { data : { test : 1}},
    type: HttpEventType.Response,
    clone: function (): HttpResponse<any> {
      throw new Error("Function not implemented.");
    },
    headers: new HttpHeaders,
    status: 0,
    statusText: "",
    url: "",
    ok: false
  }
  const mockCall = jest.spyOn(utilityService, 'saveFile')
  jest.spyOn(partnerDealCreationService, 'downloadUnsignedDoc').mockReturnValue(of(httpResponse))
 component.downloadLoccDoc(dataObj,mockUrl,view );
 fixture.detectChanges();
 expect(mockCall).toBeCalled();
});

it('should call viewQualSummary', () => {
  const qualService =  fixture.debugElement.injector.get(QualificationsService);
  const obj ={ data : 'test'};
  const mockViewQual = jest.spyOn(component['qualService'], 'viewQualSummary')
  component.viewQualSummary(obj);
  expect(component['qualService'].toProposalSummary).toBeFalsy();
  expect(mockViewQual).toBeCalledWith(obj);
})

it('should call ngOnChanges', () => {
  component.dealCreatedByTeam = true;
  const dealListService =  fixture.debugElement.injector.get(DealListService);
  const dummyChanges = {
    dealCreatedByTeam:{
      previousValue:'test',
      currentValue:'test1',
      firstChange:false,
      isFirstChange: ()=> false
    }
  };
  const mockCall = jest.spyOn(component, 'getDealData')
  component.ngOnChanges(dummyChanges);
  expect(component.globalView).toBeTruthy();
  expect(mockCall).toBeCalled();
  expect( component.dealListService.showFullList ).toBeTruthy();
})

it('should call ngOnChanges if dealCreatedByTeam false', () => {
  component.dealCreatedByTeam = false;
  const dummyChanges = {
    dealCreatedByTeam:{
      previousValue:'test',
      currentValue:'test1',
      firstChange:false,
      isFirstChange: ()=> false
    }
  };
  component.ngOnChanges(dummyChanges);
  expect( component.dealListService.showFullList ).toBeFalsy();
})

  it('should call getDealData', (done) => {
    const dashboardServiceMock = fixture.debugElement.injector.get(DashboardService);
    let showFullList = true;
    let createdByMe = true;
    let pageSize = 1;
    let page = 1;
    let dealSearchObject = null;
    component.userDashboard =true;
    component.globalView=true;
    const dummyResponse = {
      data: { responseDataList: [{ data: 'test1' }], totalRecords: 1, currentPage: 1, noOfRows: 1 }
    };
    const appendIdSpy = jest.spyOn(component, 'appendId');
    jest.spyOn(dashboardServiceMock, 'getDealData').mockReturnValue(of(dummyResponse));
    let dealDataRecieved = jest.spyOn(component['dealDataRecieved'], 'emit')
    const timer = jest.spyOn(global, 'setTimeout');
    const subs = dashboardServiceMock.getDealData(
      showFullList,
      createdByMe,
      pageSize,
      page,
      dealSearchObject
    ).subscribe({
      next: (response: any) => {
        done();
        expect(appendIdSpy).toHaveBeenCalled();
        expect(component.rowData.data).toEqual(dummyResponse.data);
        expect(component.dealData.data).toEqual(dummyResponse.data.responseDataList);
        expect(component.paginationObject.collectionSize).toBe(dummyResponse.data.totalRecords);
        expect(component.paginationObject.page).toBe(dummyResponse.data.currentPage);
        expect(component.paginationObject.pageSize).toBe(dummyResponse.data.noOfRows)
        expect(component.dealListService.dealListData).toEqual(dummyResponse)
        expect(component.dealData.isCreatedByMe).toBe(true);
        expect(component.dealListService.isCreatedByMe).toBe(createdByMe);
        expect(dealDataRecieved).toHaveBeenCalled();
        expect(timer).toBeCalled();
        tick(2000);
        expect(component['dashboardService'].dealLoader).toBeFalsy();
        expect(component['appDataService'].pageContext).toBeTruthy();

      }
    });

    component.getDealData(createdByMe);
    fixture.detectChanges();
  });

})