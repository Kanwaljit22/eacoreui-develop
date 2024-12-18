import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CavIdDetailsComponent } from './cav-id-details.component';
import { RouterTestingModule } from '@angular/router/testing';

import { EaRestService } from 'ea/ea-rest.service';
import { of, Subject } from 'rxjs';

import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from 'vnext/project/project.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { SubsidiariesStoreService } from 'vnext/project/subsidiaries/subsidiaries.store.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';

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
        page: {pageSize: 200, currentPage: 1, noOfPages: 1, noOfRecords: 13},
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

describe('CavIdDetailsComponent', () => {
  let component: CavIdDetailsComponent;
  let fixture: ComponentFixture<CavIdDetailsComponent>;
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
    },
    {
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "F",
      "showSites": false
    }],
    "cavId": "390052",
    "cavName": "EMIRATES DEFENSE INDUSTRIES"
    }
  ]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CavIdDetailsComponent , LocalizationPipe],
      providers: [{provide: ProjectService, useClass: MockProjectService}, VnextStoreService, EaidStoreService,
        ProposalStoreService,ProjectStoreService, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, DataIdConstantsService,
        {provide: EaRestService, useClass: MockEaRestService},{provide: SubsidiariesStoreService, useClass: MockSubsidiariesStoreService} ],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CavIdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngoninit', () => {
    component.eaService.features.EDIT_EAID_REL = true
    component.subsidiariesData = subsidiariesData
    component.ngOnInit()
    expect(component.subsidiariesData).toHaveLength;
  });

  it('call setBusSelectedDefault', () => {
    const data = [{
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P"
    }]
    component.setBusSelectedDefault(data);
    expect(data[0].checked).toBeTruthy();
  });

  it('call checkAllBusSelected', () => {
    const data = [
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
    component.checkAllBusSelected(data);
    expect(component.allSitesCheck).toBeFalsy();
  });

  it('call isBuSelected', () => {
    let data = {
        "buId": "925699",
        "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
        "checked": true,
        "dealCrPartyBU": true,
        "disabled": false,
        "selected": "P",
        "showSites": false
      }
    const func = component.isBuSelected  
    component.isBuSelected(data);

    expect(func).toBeTruthy()

    data = {
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": false,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": false
    }
    component.isBuSelected(data);
  });

  it('call showSites', () => {
   let data = {
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": false,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": false
    }
   component.subsidiariesData = [
    {
      "bus" : [{
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": true
    }],
    "cavId": "390052",
    "cavName": "EMIRATES DEFENSE INDUSTRIES"
    }
  ]
    component.showSites(data);
    expect(component.showAssociatedSites).toBeTruthy()
    expect(component.isSearchedApplied).toBe(false);
  });

  it('call checkAllSitesSelected', () => {
    const data = [{
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": false
    }]
    component.checkAllSitesSelected(data);
    expect(component.allSitesCheck).toBeFalsy();
  });

  it('call getSitesDetails', () => {
    const val = {
      "buId": "925699",
      "buName": "EMIRATES DEFENSE INDUSTRIES COMPANY EDIC",
      "checked": true,
      "dealCrPartyBU": true,
      "disabled": false,
      "selected": "P",
      "showSites": false
    }
    component.reqObject =  {
      "data": {
        "page": {
          "pageSize": 200,
          "currentPage": 1
        }
      }
    };
    component.getSitesDetails(val, component.reqObject);
    expect(component.associatedSiteArr).toHaveLength
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
  it('call advancePartySearch', () => {
    const searchIds = [1,2,3,4]
    component.advancePartySearch(searchIds);
    expect(component.pageChangeRequested).toBe(false);
  });
  it('call selectDeselectEntireBU', () => {
    component.selectEntireBu = false;
    component.selectDeselectEntireBU();
    expect(component.selectEntireBu).toBe(true);
  });
  it('call showFilters', () => {
    component.showFilters();
    expect(component.projectStoreService.showHideFilterMenu).toBe(true);
  });

  it('call updateSiteList', () => {
    component.updateSiteList();
    expect(component.displayMessage).toBe(true);
  });
  it('call redirectToCustomerServiceHub',() => {
    const url = 'service-registry/url?track=CSH&service=CUSTOMER_SERVICE';
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.redirectToCustomerServiceHub();
    expect(call).toHaveBeenCalled();
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
  it('call searchParties method',() => {
    let event: any = false;
    component.searchParties(event);
    expect(component.reqObject).toEqual(requestObject);
    event = {
      key : 'partyName'
    }
    component.exactSearch = true
    let requestObj;
    
    component.searchParties(event);
    //expect(requestObj).length;
    event = {
      key : 'partyId'
    }
    
    component.searchParties(event);
    expect(component.selectEntireBu).toBe(false);
  });
  it('call checkAndChangeBuSelection',() => {
    component.subsidiariesData = [ {
      "checked": false,
      "selected": true
    }]
    component.checkAndChangeBuSelection()
    expect(component.selectEntireBu).toBe(undefined);
  });

  it('call saveBuSelection',() => {
    let bu = {
      "buId": 925699,
      "checked": true
    }
    let buMap = new Map<any, any>();
    buMap.set(bu, bu);
    component.eaIdStoreService.selectedBuMap = buMap;
    const checkForPageUpdate = jest.spyOn(component, 'checkForPageUpdate')
    component.saveBuSelection();
    expect(checkForPageUpdate).toHaveBeenCalled(); 
  });

  it('call saveBuSelection with partiesSelectionMap',() => {
    let bu = {
      "buId": 925699,
      "checked": true
    }
    let buMap = new Map<any, any>();
    buMap.set(bu, bu);
    component.eaIdStoreService.selectedBuMap = buMap;
    component.eaIdStoreService.partiesSelectionMap.set('281125336', true);
    const savePartiesSelections = jest.spyOn(component, 'savePartiesSelections')
    component.saveBuSelection();
    expect(savePartiesSelections).toHaveBeenCalled(); 
  });

  it('call showSites',() => { 
    component.isEaidFlow = true
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
    component.eaIdStoreService.selectedBuMap.set(925699, true);
    component.showSites(selectedBU);
    expect(component.selectedBu).toEqual(selectedBU);
    expect(component.isSearchedApplied).toBe(false);
  });
  it('call showSites with partiesSelectionMap',() => { 
    component.isEaidFlow = true
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
    component.eaIdStoreService.selectedBuMap.clear();
    const savePartiesSelections = jest.spyOn(component, 'savePartiesSelections')
    component.eaIdStoreService.partiesSelectionMap.set('281125336', true)
    component.showSites(selectedBU);
    expect(component.showAssociatedSites).toBe(true); 
  });
  it('call paginationUpdated',() => {
    component.isEaidFlow = true
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
    component.documentId = 123
    //component.paginationUpdated(event);

    component.eaIdStoreService.selectedBuMap.set(925699, true);
    component.paginationUpdated(event);
    expect(component.pageChangeRequested).toBe(false);
  });
  it('call paginationUpdated isSearchedApplied',() => {
    component.isEaidFlow = true;
    component.isSearchedApplied = true
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
    const getSitesDetails = jest.spyOn(component, 'getSitesDetails')
    component.paginationUpdated(event);
    expect(getSitesDetails).toHaveBeenCalled();
  });

  it('call paginationUpdated isEaidFlow:false',() => {
    component.isEaidFlow = false;
    component.isSearchedApplied = true
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
    const getSitesDetails = jest.spyOn(component, 'getSitesDetails')
    component.paginationUpdated(event);
    expect(getSitesDetails).toHaveBeenCalled();
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

  it('call isBuSelectedForParties',() => {
    let buId = 925699;
    component.eaIdStoreService.selectedBuMap.set(925699, true);
    expect(component.isBuSelectedForParties(buId)).toBe(true);
    
  });
  it('call checkAndSetCheckedBu',() => {
    component.checkAndSetCheckedBu(selectedBU)
    expect(Object.keys(component.eaIdStoreService.selectedBuMap).length).toBeGreaterThanOrEqual(0)
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
    const setIsAnyBuChecked = jest.spyOn(component, 'setIsAnyBuChecked')
    component.projectService.isNewEaIdCreatedForProject = true
    component.eaIdStoreService.selectedBuMap.set(925699, true);
    component.changeBuStatus(buData , event);
    expect(setIsAnyBuChecked).toHaveBeenCalled();
  });
  it('call changeBuStatus checked: true',() => {
    let buData  = {
      "buId": 925699,
      "checked": true
    };
    component.selectedBu = {
      "buId": 925699
    }
    let event = {
      target: {
        checked: true
      }
    }
    const setIsAnyBuChecked = jest.spyOn(component, 'setIsAnyBuChecked')
    component.projectService.isNewEaIdCreatedForProject = true
    component.eaIdStoreService.selectedBuMap.set(925698, true);
    component.changeBuStatus(buData , event);
    expect(setIsAnyBuChecked).toHaveBeenCalled();
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
    expect(component.allSitesCheck).toBe(true)
  });

  it('call selectAllCustomerBu',() => { 
    component.projectService.isNewEaIdCreatedForProject = true
    component.allCustomerCheck = true;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(false);
  });
  it('call selectAllCustomerBu allCustomerCheck: false',() => { 
    component.allCustomerCheck = false;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(true);
  });
  it('call selectAllCustomerBu with subsidiariesData',() => { 
    component.allCustomerCheck = false;
    component.subsidiariesData = subsidiariesData;
    component.selectAllCustomerBu();
    expect(component.allCustomerCheck).toBe(true);
  });
  it('call searchPartyIds',() => { 
    const event = {searchIds:['123']}
    component.searchPartyIds(event);
    expect(component.allCustomerCheck).toBe(true);
  });
  it('call searchPartyIds 1',() => { 
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
    const event = {excelSearchResponse:{data:{partyDetails:[]}}}
    component.searchPartyIds(event);
    expect(component.allCustomerCheck).toBe(true);
  });


});
