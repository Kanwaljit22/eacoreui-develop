import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';

import { AssignSmartAccountComponent } from './assign-smart-account.component';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const projectDataMock = {
  "objId": "64271d3ba52bf01e08b905c3",
  "id": 72403,
  "name": "Tr deal Ea3.0",
  "smartAccount": {
    "smrtAccntId": "106168",
    "smrtAccntName": "BRISTOL-MYERS SQUIBB CO",
    "smrtAccntStatus": "ACTIVE",
    "domain": "bms.com",
    "accountType": "CUSTOMER",
    "virtualAccount": {
      "name": "DEFAULT",
      "id": "107179"
    }
  }
}

const paginationObjectDataMock = {
  "pageSize": 6,
  "currentPage": 1,
  "noOfPages": 2,
  "noOfRecords": 7
}

const testData  = {
  data: {
  test: "test"
  },
  error: false
  }
class MockEaRestService {

  getApiCall(url){
    return of(testData)
  }

  putApiCall(){
    return of(testData)
  }

  getApiCallJson(url){
    return of(testData)
  }

  postApiCall() {
    return of(testData);
  }
}

class MockProjectStoreService {
  projectData = {
    dealInfo:{
      id : 1234444
    },
    objId: 34321233
  }
}

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}


describe('AssignSmartAccountComponent', () => {
  let component: AssignSmartAccountComponent;
  let fixture: ComponentFixture<AssignSmartAccountComponent>;
  let eaRestService = new MockEaRestService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSmartAccountComponent, LocalizationPipe ],
      providers: [LocalizationService, DataIdConstantsService, VnextService, ProjectStoreService, { provide: EaRestService, useValue: eaRestService }, MessageService, EaService, BlockUiService, { provide: NgbActiveModal, useValue: NgbActiveModalMock}, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSmartAccountComponent);
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = projectDataMock;
    component = fixture.componentInstance;
    component.paginationObject = paginationObjectDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should set data on ngoninit', () => {
    component.ngOnInit();
  });

  it('call close', () => {
    component.close();
  });

  it('should call selectDrop', () => {
    let value = 'pri';
    component.paginationObject = paginationObjectDataMock;
    component.getSmartAccountDetail(value)
    expect(component.showSmartAccounts).toBe(false)
    expect(component.smartAccountData).toEqual([]);

    value = 'price';
    component.paginationObject = paginationObjectDataMock;
    component.selectedSearchType.id = 'domain'
    component.searchText = value
    component.getSmartAccountDetail(value)
  });

  it('should call selectOption', () => {
    const option = 'Select an Existing Account'
    component.selectOption(option);
    expect(component.selectedSmartAccOption).toEqual(option)
    expect(component.showOptionDrop).toBe(false)
    expect(component.showSmartAccounts).toBe(false)
    expect(component.smartAccountData).toEqual([])
  });

  it('should call selectType', () => {
    const type = {
      "id": "domain",
      "name": "Domain Identifier"
    };
    component.selectType(type);
    expect(component.selectedSearchType).toEqual(type)
    expect(component.showSearchDrop).toBe(false)
    expect(component.searchText).toEqual('')
  });

  it('should call assign', () => {
    component.selectedSmartAcc = {
      "smrtAccntId": 23123,
       "smrtAccntName": 'test',
       "accountType": 'test',
       "programName": 'test',
       "defaultVAId": 'test',
       "defaultVAName": 'test',
       "domain": 'test',
       "defaultVAStatus": 'test',
       "smrtAccntStatus":  'test'
    }
    const requestJson = {
      "data" : {
       "smrtAccntName": 'Costco'
       }
    }  
    component.assign();
  });

  it('should call clear', () => {
    component.clear();
    expect(component.searchText).toEqual('')
    expect(component.showSmartAccounts).toBe(false)
    expect(component.smartAccountData).toEqual([])
  });

  it('should call selectSmartAccount', () => {
    const smartAcc = {
      smrtAccntName: 'price info'
    }
    component.selectSmartAccount(smartAcc);
    expect(component.selectedSmartAcc).toEqual(smartAcc);
  });

  it('should call requestNewSmartAccount', () => {
    component.requestNewSmartAccount();
  });
});
