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
import { LocaleService } from "../services/locale.service";
import { PartnerBookingsService } from "../partner-bookings/partner-bookings.service";
import { BlockUiService } from "../services/block.ui.service";
import { Router } from "@angular/router";
import { CountriesPresentService } from "../countries-present/countries-present.service";
import { HttpClient } from "@angular/common/http";
import { CreditsOverviewComponent } from "./credits-overview.component";
import { PriceEstimationService } from "@app/proposal/edit-proposal/price-estimation/price-estimation.service";
import { CreditOverviewService } from "./credit-overview.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ReuseableFilterService } from "../reuseable-filter/reuseable-filter.service";
import { ConstantsService } from "../services/constants.service";
import { CopyLinkService } from "../copy-link/copy-link.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";

describe("CreditsOverviewComponent", () => {
  let component: CreditsOverviewComponent;
  let fixture: ComponentFixture<CreditsOverviewComponent>;

  class MockMessageService {
    displayUiTechnicalError(err) {}
    displayMessagesFromResponse(err) {}
  }
  class MockAppDataService {
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
  class MockUtilitiesService {
    creditTableHeight=jest.fn()
    getFloatValue(a) {
      return 0.0;
    }
    formatValue(a) {
      return 0;
    }
    isNumberKey(e) {
      return true;
    }
    pretifyAndFormatNumber = jest.fn();
  }

  class MockBlockUiService {
    spinnerConfig = {
      blockUI: jest.fn(),
      startChain: jest.fn(),
      unBlockUI: jest.fn(),
      stopChainAfterThisCall: jest.fn(),
    };
  }
  class MockPriceEstimationService {
    creditOverviewSearchEmitter = new EventEmitter();
  }
  class MockCreditOverviewService {
    submitEngagement=jest.fn().mockReturnValue(of({data:{test:''}}));
    initiateExceptionRequest= jest.fn().mockReturnValue(of({data:{test:''}}));
    resetFilter = new EventEmitter();
    showPAEngageSupport = jest.fn().mockReturnValue(of({}));
    getCreditData = jest.fn().mockReturnValue(of({data:{page:{noOfRecords:12, currentPage:1, pageSize:10}, creditOverviews:[{test:''}]}}));
    getMetaData = jest.fn().mockReturnValue(of({  data :{columnData: [{children:[{headerClass:'',cellClass :'',  cellRenderer:'t', field:'t',suppressMovable :''}], cellRenderer:'t', field:'t'}], leftSideFilters:'', topSideFilters:'', identifierData:''}}));
    manageColumnEmitter = new EventEmitter();
    removePAEngageSupport = jest.fn().mockReturnValue(of({}));
  }
  class MockReuseableFilterService {
    filterObject = { data: { test: "123", type: "test" } };
    selectedFilterData = { clear: jest.fn() };
    emitClearFilter = of({});
    applyFilterEmitter = new EventEmitter();
  }
  class MockConstantsService {
    SECURITY = "test";
  }
  class MockCopyLinkService {
    showMessage=jest.fn()
  }
  class MockProposalDataService {
    proposalDataObject = { proposalData: { groupName: "test" , linkedProposalsList:[{architecture_code:'test'}] }, status:'test' }
  }
  
class MockQualificationsService{}
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [CreditsOverviewComponent],
      providers: [
        {
          provide: PriceEstimationService,
          useClass: MockPriceEstimationService,
        },
        { provide: UtilitiesService, useClass: MockUtilitiesService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: AppDataService, useClass: MockAppDataService },
        {
          provide: CreditOverviewService,
          useClass: MockCreditOverviewService,
        },
        Renderer2,
        LocaleService,
        NgbModal,
        {
          provide: ReuseableFilterService,
          useClass: MockReuseableFilterService,
        },
        { provide: BlockUiService, useClass: MockBlockUiService },
        { provide: ConstantsService, useClass: MockConstantsService },
        { provide: CopyLinkService, useClass: MockCopyLinkService },
        {provide:ProposalDataService, useClass:MockProposalDataService},
        {provide:QualificationsService, useClass:MockQualificationsService}
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsOverviewComponent);
    component = fixture.componentInstance;
 
  });

  it("should create component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    component.gridOptions = {
      columnApi: { setColumnVisible: jest.fn() },
    } as any;
    component.columnDefs = [{cellRenderer:'t', field:'t'}]
    component.ngOnInit();
    expect(component).toBeTruthy();
    const emitRes = { searchInput: "", searchId: "test" };
    component.priceEstimationService.creditOverviewSearchEmitter.emit(emitRes);
    emitRes.searchInput = "test";
    component.priceEstimationService.creditOverviewSearchEmitter.emit(emitRes);
    component.reuseableFilterService.applyFilterEmitter.emit();
    component.creditOverviewService.manageColumnEmitter.emit([
      { field: "test", checked: "test" },
    ]);
  });

  it("should call removeEngageSupport", () => {
    component.gridOptions = {
      columnApi: { setColumnVisible: jest.fn() },
    } as any;
    component.columnDefs = [{cellRenderer:'t', field:'t'}]
    component.removeEngageSupport();
  });

  it("should call setTopFilterData", () => {
    const arr = [
      { name: "IDENTIFIERS" },
      { name: "partnerIdentifiers" },
      { name: "creditApplied" },
      { name: "creditEligibility" },
    ];
    component.setTopFilterData(arr);
  });


  it("should call close", () => {
    component.close();
  });

  it("should call onColumnEvent", () => {
    const e  = {columnGroup:{groupId:'',expanded:true}, columnApi:{setColumnGroupOpened:jest.fn()}}
    component.onColumnEvent(e);
  });

  it("should call getCreditsData", fakeAsync(() => {

    component.gridApi= {setRowData:jest.fn()}as any
    // const e  = {columnGroup:{groupId:'',expanded:true}, columnApi:{setColumnGroupOpened:jest.fn()}}
    component.getCreditsData();
    tick(2500)
  }));

  it("should call openDownloadModal", () => {
    component.openDownloadModal();
  });

  it("should call onGridReady",fakeAsync( () => {
   
    component.onGridReady({api:{setHeaderHeight:jest.fn()}, columnApi:{}});
    tick(500)
  }));


  it("should call creditColumnClass", () => {
    const e  = {value :'Y', colDef:{isQuantity:true}}
    component.creditColumnClass(e);
    component.creditColumnClass({value :'N', colDef:{isQuantity:true}});
    component.creditColumnClass({value :'', colDef:{isQuantity:true}});
  });

  it("should call columnIdClass", () => {
    const e  = {data:{outsideProposalScopeYorn:'Y'}}
    component.columnIdClass(e);
    component.columnIdClass({data:{withinProposalScopeYorn :'Y'}});
    component.columnIdClass({data:{outsideGUScopeYorn :'Y'}});
  });

  it("should call ChangeSearchLabel", () => {
    component.ChangeSearchLabel('test');
  });

  it("should call ChangeviewLabel", () => {
    component.ChangeviewLabel({value:'allidentifiers'}, 'test');
  });

  it("should call ChangeviewLabel", () => {
    component.identifierData = [{category:'test',columnData:[{children:[{headerClass:'',cellClass :'',  cellRenderer:'t', field:'t',suppressMovable :''}], cellRenderer:'t', field:'t'}]}]
    component.ChangeviewLabel({value:'test'}, 'test');
  });

  it("should call ChangecreditLabel", () => {
    component.identifierData = [{category:'test',columnData:[{children:[{headerClass:'',cellClass :'',  cellRenderer:'t', field:'t',suppressMovable :''}], cellRenderer:'t', field:'t'}]}]
    component.ChangecreditLabel({value:'All', name:'test'}, {name:'test'});
  });

  it("should call ChangeeligibilityLabel", () => {
    component.ChangeeligibilityLabel({value:'All', name:'test'}, {name:'test'});
  });

  it("should call changeView",fakeAsync( () => {
    component.gridApi= {setHeaderHeight:jest.fn()}
    component.changeView('test');
    tick(500)
  }));

  it("should call changeView",fakeAsync( () => {
    component.gridApi= {setHeaderHeight:jest.fn()}
    component.changeView('IB');
    tick(500)
  }));

  it("should call getSearchText", () => {
    component.getSearchText('');
  });

  it("should call getSearchText", () => {
    component.onPageSizeChanged('');
  });

  it("should call pageChange", () => {
    component.pageChange();
  });

  it("should call engageSupport", () => {
    component.engageSupport();
  });

  it("should call openSupportModel", () => {
    const promise  = new Promise((resolve, reject)=>{
        resolve({continue:true})
    })
    component['modalVar'] = {open:jest.fn().mockReturnValue({componentInstance:{exceptionDataObj:''},result:promise})} as any;
    component.openSupportModel({});
  });

  it("should call submitException", () => {
    const data = {comment:'tet',exceptions:[{selectedReasons:'test'}]}
    component.submitException(data);
  });

  it("should call updateSearch", () => {
    
    component.updateSearch('test',{target:{checked:true}});
    component.updateSearch('test',{target:{checked:false}});

  });

  
});
