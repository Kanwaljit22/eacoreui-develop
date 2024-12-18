import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';

import { EaRestService } from 'ea/ea-rest.service';
import { of, Subject } from 'rxjs';

import { NgPaginationComponent } from 'vnext/commons/ng-pagination/ng-pagination.component';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { SearchDropdownComponent } from 'vnext/commons/shared/search-dropdown/search-dropdown.component';

import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from '../project-rest.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';

import { SelectMoreBuComponent } from './select-more-bu.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class MockSubsidiariesStoreService {
  subsidiariesData = [
    {
      "bus" : [{
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": false
    }],
    "cavId": "390052",
    "cavName": "EMIRATES DEFENSE INDUSTRIES"
    }
  ]
}

class MockEaRestService {
  postApiCall() {
    return of({
      data: {
        page: {pageSize: 50, currentPage: 1, noOfPages: 1, noOfRecords: 13},
        partyDetails: [ {
          ADDRESS1: "STREET 1 DELMA",
          ADDRESS2: "ABU DHABI, UAE",
          CAV_BU_ID: "925699",
          CAV_ID: "390052",
          CITY: "ABU DHABI",
          COUNTRY: "AE",
          CR_PARTY_ID: "245491340",
          CR_PARTY_NAME: "EMIRATES DEFENSE INDUSTRIES",
          GU_ID: "245491340",
          HQ_BRANCH_IND: "HQ",
          POSTAL_CODE: "AUH",
          STATE: "ABU DHABI",
          THEATER: "EMEAR"
        }],
        selectedParties: ["245491340"]
      },
      error: false
    })
  }

  putApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  getApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
  getApiCallJson(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}
class MockProjectService {
  checkAndSetSelectedCrPartyFromDeal() {
    return false;
  }

  isReturningCustomer() {
    return false;
  }

  getCompleteAddressforParty() {
   return 'PO BOX 43221, ABU DHABI, AE';
  }

  clearSearchInput = new Subject();
 
}


describe('SelectMoreBuComponent', () => {
  let component: SelectMoreBuComponent;
  let fixture: ComponentFixture<SelectMoreBuComponent>;
  const requestObject = {
    "data": {
      "page": {
        "pageSize": 200,
        "currentPage": 1
      }
    }
  };
  const selectedBU = {
    "buId": 925699,
    "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
    "checked": true,
    "dealCrPartyBU": true,
    "disabled": false,
    "selected": "P",
    "showSites": false
  }
  const partyDetail =  [ {
    "ADDRESS1": "STREET 1 DELMA",
    "ADDRESS2": "ABU DHABI, UAE",
    "CAV_BU_ID": "925699",
    "CAV_ID": "390052",
    "CITY": "ABU DHABI",
    "COUNTRY": "AE",
    "CR_PARTY_ID": "245491340",
    "CR_PARTY_NAME": "EMIRATES DEFENSE INDUSTRIES",
    "GU_ID": "245491340",
    "HQ_BRANCH_IND": "HQ",
    "POSTAL_CODE": "AUH",
    "STATE": "ABU DHABI",
    "THEATER": "EMEAR",
    "selected": true
  }];
  const subsidiariesData = [
    {
      "bus" : [{
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": false
    }],
    "cavId": "390052",
    "cavName": "EMIRATES DEFENSE INDUSTRIES"
    }
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectMoreBuComponent,LocalizationPipe,SearchDropdownComponent,NgPaginationComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      providers: [{provide: ProjectService, useClass: MockProjectService}, VnextStoreService, 
        ProposalStoreService,ProjectStoreService, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, DataIdConstantsService,
        {provide: EaRestService, useClass: MockEaRestService},{provide: SubsidiariesStoreService, useClass: MockSubsidiariesStoreService}, ElementIdConstantsService ],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMoreBuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit method enableSubsidiariesMeraki scenario',() => {
    let projectService = fixture.debugElement.injector.get(ProjectService);
    projectService.enableSubsidiariesMeraki = 'meraki'
    component.ngOnInit();
    expect(component.toggle).toBe(true);

    projectService.enableSubsidiariesMeraki = 'subsidairy'
    component.ngOnInit();
    expect(component.toggle).toBe(true);
  });

  it('call searchParties method',() => {
    let event: any = false;
    component.searchParties(event);
    expect(component.reqObject).toEqual(requestObject);
    event = {
      key : 'partyName'
    }
    let requestObj;
    component.searchParties(event);
    //expect(requestObj).length;
    event = {
      key : 'partyId'
    }
    component.searchParties(event);
    //expect(requestObj).length;
  });

  it('call showSites',() => { 
    component.selectedBuMap.set(925699, true);
    component.showSites(selectedBU);
    expect(component.selectedBu).toEqual(selectedBU);
    
    component.selectedBuMap.clear();
    component.partiesSelectionMap.set('281125336', true)
    component.showSites(selectedBU);

    
  });

  it('call selectAllCustomerBu',() => { 
    component.projectService.isNewEaIdCreatedForProject = true
    component.allCustomerCheck = true;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(false);

    component.allCustomerCheck = false;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(true);

    component.subsidiariesData = subsidiariesData;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(false);
  });

  
  it('call selectAllSites',() => { 

    component.associatedSiteArr = [ {
      ADDRESS1: "STREET 1 DELMA",
          ADDRESS2: "ABU DHABI, UAE",
          CAV_BU_ID: "925699",
          CAV_ID: "390052",
          CITY: "ABU DHABI",
          COUNTRY: "AE",
          CR_PARTY_ID: 245491340,
          CR_PARTY_NAME: "EMIRATES DEFENSE INDUSTRIES",
          GU_ID: "245491340",
          HQ_BRANCH_IND: "HQ",
          POSTAL_CODE: "AUH",
          STATE: "ABU DHABI",
          THEATER: "EMEAR"
    }]
   
    component.selectAllSites();

  });

  it('call setSiteSelction',() => {
    let subsidiary = {"selected": "F"};
    let sitesData = [{
      "selectedParties": ["245491340"]
    }]
    component.setSiteSelction(subsidiary, partyDetail, sitesData);

   subsidiary = {"selected": "P"};
    sitesData = []
    component.setSiteSelction(subsidiary, partyDetail, sitesData);

    subsidiary = {"selected": "P"};
    sitesData = [{
      "selectedParties": ["245491341"]
    }]
    component.setSiteSelction(subsidiary, partyDetail, sitesData);
  });

  it('call checkAllBusSelected',() => {
    component.checkAllBusSelected(subsidiariesData);
    expect(component.allCustomerCheck).toBe(true);
  });

  it('call checkAllSitesSelected',() => {
    const detail =  [ {
      "selected": false
    }]
    component.checkAllSitesSelected(detail);
    expect(component.allSitesCheck).toBe(false);
  });

  it('call isBuSelected',() => {
    let subsidary = {"checked": false}
    component.isBuSelected(subsidary);
    expect(component.allCustomerCheck).toBe(false);

    subsidary = {"checked": true}
    component.isBuSelected(subsidary);
  });

  it('call changePartyStatus',() => {
    component.changePartyStatus(partyDetail, true);
    
    const detail = [{"selected" : false}]
    component.changePartyStatus(detail, false);
  });

  it('call changeBuStatus',() => {
    let buData = {
      "buId": 925699,
      "checked": false
    };
    component.selectedBu = {
      "buId": 925699
    }
    let event = {
      target: {
        checked: false
      }
    }
    component.selectedBuMap.set(925699, true);
    component.changeBuStatus(buData , event);

    buData = {
      "buId": 925699,
      "checked": true
    };
    event = {
      target: {
        checked: true
      }
    }
    component.selectedBuMap.set(925698, true);
    component.changeBuStatus(buData , event);
  });
  
  it('call paginationUpdated',() => {
    const event = {
      "pageSize": 50,
      "currentPage": 1
    }
    component.reqObject = {
      "data": {
        "page": {
          "pageSize": event.pageSize,
          "currentPage": event.currentPage
        }
      }
    }
    component.paginationUpdated(event);

    component.selectedBuMap.set(925699, true);
    component.paginationUpdated(event);
    expect(component.pageChangeRequested).toBe(false);
  });

  it('call checkAndSetCheckedBu',() => {
    component.checkAndSetCheckedBu(selectedBU)
    expect(Object.keys(component.selectedBuMap).length).toBeGreaterThanOrEqual(0)
  });

  it('call save',() => {
    component.selectedBuMap.set(925699, true);
    component.save();

    component.partiesSelectionMap.set('281125336', true);
    component.selectedBuMap.clear();
    component.save();
  });

  it('call saveBuSelection',() => {
    let bu = {
      "buId": 925699,
      "checked": true
    }
    let buMap = new Map<any, any>();
    buMap.set(bu, bu);
    component.selectedBuMap = buMap;
    component.saveBuSelection();

    component.partiesSelectionMap.set('281125336', true);
    component.saveBuSelection();
  });

  it('call savePartiesSelections',() => {
    let party = {
      "buId": 925699,
      "checked": true
    }
    let partyMap = new Map<any, any>();
    partyMap.set(party, party);
    component.partiesSelectionMap = partyMap;
    component.savePartiesSelections(true);
    expect(component.displayMessage).toBeTruthy();
  });

  it('call isBuSelectedForParties',() => {
    let buId = 925699;
    component.selectedBuMap.set(925699, true);
    expect(component.isBuSelectedForParties(buId)).toBe(true);
    
    buId = 925611;
    let buMap = new Map<any, any>();
    buMap.set(925612, true);
    buMap.set(925688, true);
    component.selectedBuMap = buMap;
    expect(component.isBuSelectedForParties(925611)).toBe(true);
  });

  it('call checkAndChangeBuSelection',() => {
    component.subsidiariesData = [ {
      "checked": false,
      "selected": true
    }]
    component.checkAndChangeBuSelection()
  });

  it('call checkAndSetSelectedCrPartyFromDeal',() => {
    const deal = {
      buyMethodDisti: false,
      crPartyId: 245491340,
      dealScope: 3,
      dealSource: 0,
      dealType: "1",
      distiDeal: false,
      expectedBookDate: "13-Apr-2021",
      id: "20546052",
      optyOwner: "kikamara",
      partnerDeal: false,
      sfdcOptyId: "0062T00001FLrqBQAT",
      statusDesc: "Not Submitted"
    }
    let bu = {
      "dealCrPartyBU" : 245491340
    }
    let party = {
      "CR_PARTY_ID": 245491340
    }
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData.dealInfo = deal;
    expect(component.checkAndSetSelectedCrPartyFromDeal(bu, party)).toBe(true);

    bu = {
      "dealCrPartyBU" : null
    }
    party = {
      "CR_PARTY_ID": 245491341
    }
    expect(component.checkAndSetSelectedCrPartyFromDeal(bu, party)).toBe(false);
  });

  it('call redirectToCustomerServiceHub',() => {
    const url = 'service-registry/url?track=CSH&service=CUSTOMER_SERVICE';
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.redirectToCustomerServiceHub();
    expect(call).toHaveBeenCalled();
  });

  it('call selectDeselectEntireBU', () => {
    component.selectEntireBu = false;
    component.selectDeselectEntireBU();
    expect(component.selectEntireBu).toBe(true);
  });

  it('call selectOnlyThese', () => {
    component.documentId = 123
    component.selectOnlyThese();
    expect(component.isSelectOnlyThese).toBe(true);
  });
  it('call selectOnlyThese with advancePartySearchIds', () => {
    component.advancePartySearchIds = [123]
    component.associatedSiteArr = [ {
      ADDRESS1: "STREET 1 DELMA",
          ADDRESS2: "ABU DHABI, UAE",
          CAV_BU_ID: "925699",
          CAV_ID: "390052",
          CITY: "ABU DHABI",
          COUNTRY: "AE",
          CR_PARTY_ID: 245491340,
          CR_PARTY_NAME: "EMIRATES DEFENSE INDUSTRIES",
          GU_ID: "245491340",
          HQ_BRANCH_IND: "HQ",
          POSTAL_CODE: "AUH",
          STATE: "ABU DHABI",
          THEATER: "EMEAR"
    }]
    component.selectOnlyThese();
    expect(component.isSelectOnlyThese).toBe(true);
  });
  it('call clearAdvanceSearch', () => {
    component.reqObject.data['searchCriteria'] = {partyIds :[123]}
    component.reqObject.data['documentId'] = 123
    component.clearAdvanceSearch();
    expect(component.advanceSearchApplied).toBe(false);
  });
  it('call advanceSearchWithExcel', () => {
    const res = {data: {partyDetails: [], page:{}, documentId: 123, totalRecordsInExcel:124}}
    component.advanceSearchWithExcel(res);
    expect(component.documentId).toEqual(res.data.documentId);
  });

  it('call updatePartyFilter', () => {
    component.isSearchedApplied = true
    component.updatePartyFilter('test');
    expect(component.partyFilter).toEqual('test');
  });

  it('call updatePartyFilter isSearchedApplied: false', () => {
    component.isSearchedApplied = false
    component.updatePartyFilter('test');
    expect(component.partyFilter).toEqual('test');
  });

  it('call setIsAnyBuChecked', () => {
    component.subsidiariesData = [
      {
        "bus" : [{
        "buId": "925699",
        "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
        "checked": true,
        "dealCrPartyBU": true,
        "disabled": false,
        "selected": "P",
        "showSites": false
      }],
      "cavId": "390052",
      "cavName": "EMIRATES DEFENSE INDUSTRIES"
      }
    ]
    component.setIsAnyBuChecked();
    expect(component.isAnyBuSelected).toBe(false);
  });

  it('call showFilters', () => {
    component.showFilters();
    expect(component.projectStoreService.showHideFilterMenu).toBe(true);
  });

  it('call updateSiteList', () => {
    component.updateSiteList();
    expect(component.displayMessage).toBe(true);
  });

  it('call advancePartySearch', () => {
    const searchIds = [1,2,3,4]
    component.advancePartySearch(searchIds);
    expect(component.pageChangeRequested).toBe(false);
  });

  it('call useExactSearch', () => {
    component.exactSearch = true
    component.searchDropdownArray.length = 1
    component.useExactSearch();
    expect(component.exactSearch).toBe(false);
  });

  it('call useExactSearch exactSearch = false', () => {
    component.exactSearch = false
    component.useExactSearch();
    expect(component.exactSearch).toBe(true);
  });
  // it('call download excel', fakeAsync(() => {
  //   let vnextStoreService = TestBed.get(VnextStoreService) as VnextStoreService;
  //   vnextStoreService.toastMsgObject.isBuExcelRequested = false;
  //   tick(10000);
  //   component.downloadExcel();
  //   expect(vnextStoreService.toastMsgObject.isBuExcelRequested).toBe(true);
  //   flush();
  // }));
});
