import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ProjectRestService } from '../project-rest.service';
import { ProjectStoreService } from '../project-store.service';
import { ProjectService } from '../project.service';

import { SubsidiariesComponent } from './subsidiaries.component';
import { SubsidiariesStoreService } from './subsidiaries.store.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
  getEampApiCall(){
    return of({
      data: {

      },
    });
  }
}

describe('SubsidiariesComponent', () => {
  let component: SubsidiariesComponent;
  let fixture: ComponentFixture<SubsidiariesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiariesComponent,LocalizationPipe],
      providers: [ ProjectService, VnextService, SubsidiariesStoreService, MessageService, ProjectStoreService, { provide: EaRestService, useClass: MockEaRestService },
        LocalizationService, DataIdConstantsService,VnextStoreService,ProjectRestService,CurrencyPipe,UtilitiesService,ProposalStoreService, ElementIdConstantsService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
          
        ])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call getCavDetails', () => {

  //   component.createProposalStoreService.renewalId = 123;
  //   component.projectStoreService.projectData ={
  //     loccDetail: {
  //       loccSigned: false
  //     }
  //   }
  //   const response ={
  //     data: { },
  //     error: true
  //   }
  //   const displayMessagesFromResponse = jest.spyOn(component['messageService'], 'displayMessagesFromResponse')
  //   let eaRestService = fixture.debugElement.injector.get(EaRestService);
  //   jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
  //   component.getCavDetails();
  //   expect(displayMessagesFromResponse).toHaveBeenCalled();
  //   expect(component.showLoccWarning).toBe(true);
    
  // });

   it('should call expandAll', () => {
    //jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.subsidiariesArr = [{expand: false}]
    component.expandAll();
    expect(component.showExpandAll).toBe(false);
  });

  it('should call collapseAll', () => {
    component.subsidiariesArr = [{expand: false}]
    component.collapseAll();
    expect(component.showExpandAll).toBe(true);
  });

  it('should call expandBu', () => {
    component.subsidiariesArr = [{expand: false}]
    component.expandBu({expand: true});
    expect(component.showExpandAll).toBe(true);
  });

  it('should call selectAllCustomerNames', () => {
    component.selectAllCustomerName = true;
    component.subsidiariesArr = [{expand: false}]
    component.selectAllCustomerNames();
    expect(component.selectAllCustomerName).toBe(false);
  });

  it('should call selectAllCustomerBus', () => {
    component.selectAllCustomerBu = true;
    component.subsidiariesArr = [{expand: false,checked: false, customerBuChecked: true,buArr:[{checked: false}]}]
    component.selectAllCustomerBus();
    expect(component.selectAllCustomerBu).toBe(false);
  });

  it('should call selectCustomer', () => {
    component.subsidiariesArr = [{customerNameChecked: true}]
    component.selectCustomer({customerNameChecked: false});
    expect(component.selectAllCustomerName).toEqual(true);
  });

  it('should call showAllSites', () => {
    component.subsidiariesArr = [{customerNameChecked: true}]
    component.showAllSites({buId: '123'});
    expect(component.projectService.showSitesAssociated).toEqual(true);
  });

  it('should call selectMoreBu', () => {
    component.subsidiariesArr = [{customerNameChecked: true}]
    component.selectMoreBu(true);
    expect(component.projectService.enableSubsidiariesMeraki).toEqual(true);
    expect(component.projectService.selectMoreBuId).toEqual(true);
  });

  it('should call setBusSelectedDefault', () => {
    const data = [{
      selected: 'P'
    }]
    component.selectedBuCount = 0
    component.setBusSelectedDefault(data);
    expect(component.selectedBuCount).toEqual(1);
    
  });

  it('should call setBusSelectedDefault selected: F', () => {
    const data = [{
      selected: 'F'
    }]
    component.selectedBuCount = 0
    component.setBusSelectedDefault(data);
    expect(component.selectedBuCount).toEqual(1);
    
  });

  it('should call setBusSelectedDefault dealCrPartyBU', () => {
    const data = [{
      dealCrPartyBU: true
    }]
    component.selectedBuCount = 0
    component.setBusSelectedDefault(data);
    expect(component.selectedBuCount).toEqual(1);
    
  });

  it('should call showSubsidiaries', () => {
    component.projectStoreService.projectData = {
      status : 'COMPLETE'
    }
    component.showSubsidiaries();
    expect(component.projectStoreService.blurSubsidiaries).toBe(false);
  });

  it('should call getDealCrPartyBU', () => {
    component.cavDetails = [{cavId: 1, cavName: 'test', bus:[{dealCrPartyBU: true}]}]
    component.getDealCrPartyBU();
    expect(component.firstLevelCavDetails.cavName).toEqual('test');
  });

  it('should call getDealCrPartyBU dealCrPartyBU: false', () => {
    component.cavDetails = [{cavId: 1, cavName: 'test', bus:[{dealCrPartyBU: false}]}]
    component.getDealCrPartyBU();
    expect(component.firstLevelCavDetails.cavName).toEqual('test');
  });

  it('should call selectBu', () => {
    const val = {checked: true, customerBuChecked: true}
    const customer = 'bu'
    component.subsidiariesArr = [{customerBuChecked:true, buArr:[{checked: true}]}]
    component.cavDetails = [{cavId: 1, cavName: 'test', bus:[{dealCrPartyBU: false}]}]
    component.selectBu(val,customer);
    expect(component.selectAllCustomerBu).toBe(true);
  });

  it('should call getMasterAggreementDetails', () => {
    component.projectStoreService.projectData = {objId: '12321'}

    const response ={data:{ }}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getMasterAggreementDetails();
    expect(component.projectStoreService.lockProject).toBe(true);
  });

  it('should call getMasterAggreementDetails res error', () => {
    component.projectStoreService.projectData = {objId: '12321'}

    const response ={error: true}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getMasterAggreementDetails();
    expect(component.projectStoreService.lockProject).toBe(false);
  });
  
  it('should call ggoBackToSubsidiaries', () => {
    component.goBackToSubsidiaries();
    expect(component.isExistingIdSelected).toBe(false);
  });
  it('should call openBpIdDetails', () => {
    component.openBpIdDetails('test');
    expect(component.projectStoreService.currentBpId).toEqual('test');
  });
  it('should call continuetoChangeEaidForProject', () => {
    component.continuetoChangeEaidForProject();
    expect(component.isExistingIdSelected).toBe(false);
  });
  it('should call continuetoChangeEaidForProject 1', () => {
    component.selectedBpID ={eaId:'123'}
    component.continuetoChangeEaidForProject();
    expect(component.isExistingIdSelected).toBe(false);
  });
  it('should call continuetoChangeEaidForProject 2', () => {
    component.selectedBpID ={eaId:'123'}
    component.isAllowCreateBpId = true
    component.continuetoChangeEaidForProject();
    expect(component.isExistingIdSelected).toBe(false);
  });
  it('should call goToSalesConnect', () => {
    component.goToSalesConnect();
    expect(component.isExistingIdSelected).toBe(false);
  });
  it('should call getDealCrPartyBU 1', () => {
    component.eaService.features.EAID_REL = true
    component.projectService.isNewEaIdCreatedForProject = true
    component.cavDetails = [{cavId: 1, cavName: 'test', bus:[{dealCrPartyBU: false}]}]
    component.getDealCrPartyBU();
    expect(component.firstLevelCavDetails.cavName).toEqual('test');
  });
  it('should call getBpIds', () => {
    component.eaService.features.EAID_REL = true
    component.projectService.isNewEaIdCreatedForProject = true
    component.cavDetails = [{cavId: 1, cavName: 'test', bus:[{dealCrPartyBU: false}]}]
    component.getBpIds();
    expect(component.start_max).toEqual(0);
  });
  it('should call moveLeft', () => {
    component.start = 5
    component.moveLeft();
    expect(component.start_max).toEqual(0);
  });
  it('should call moveLeft 1', () => {
    component.start = 0
    component.moveLeft();
    expect(component.start_max).toEqual(0);
  });
  it('should call moveRight', () => {
    component.start = 5
    component.moveRight();
    expect(component.start_max).toEqual(0);
  });
  it('should call moveRight 1', () => {
    component.start = 0
    component.moveRight();
    expect(component.start_max).toEqual(0);
  });
  it('should call selectedId', () => {
    const event = {eaId:{}}
    component.selectedId(event);
    expect(component.start_max).toEqual(0);
  });
  it('should call selectedId 1', () => {
    const event = {}
    component.selectedId(event);
    expect(component.start_max).toEqual(0);
  });
});
