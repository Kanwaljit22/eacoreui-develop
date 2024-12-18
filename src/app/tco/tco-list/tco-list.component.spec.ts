import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TcoListComponent } from './tco-list.component';

import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';

import { PermissionService } from '@app/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { CurrencyPipe } from '@angular/common';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { SearchPipe } from '@app/shared/pipes/search.pipe';
import { TcoApiCallService } from '../tco-api-call.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TcoListService } from './tco-list.service';
import { DeleteProposalComponent } from '@app/modal/delete-proposal/delete-proposal.component';
import { CreateTcoComponent } from '@app/modal/create-tco/create-tco.component';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute

class TcoMockService{

  getTcolist() {
    return of({
      res: [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }],
    });
  }


  deleteTco() {
    return of({
      res: [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }],
    });
  }

 

  duplicateTco() {
    return of({
      res: [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      },
      {
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }],
    });
  }

  updateTco() {
    return of({
      res: [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      },
      {
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }],
    });
  }

  restore() {
    return of({
      res: [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }]
    });
  }

  download() {
    return of({
      error: true
     } );
  }
  
}

describe('TcoListComponent', () => {
  let component: TcoListComponent;
  let fixture: ComponentFixture<TcoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TcoListComponent ],
      providers: [ MessageService, AppDataService, PriceEstimationService, PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, LocaleService, ConstantsService, CreateProposalService,NgbModal, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, QualificationsService,TcoDataService, {provide: TcoApiCallService, useClass: TcoMockService}, TcoListService],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([
        { path: "../", redirectTo: "" }, 
        {path: "qualifications/proposal/", redirectTo: ""}])],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcoListComponent);
    component = fixture.componentInstance;
    window.scroll = function () { return window; }
    let scroll = jest.spyOn(window, "scroll");
    let proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    proposalDataService.proposalDataObject.proposalId = "123"
    let qualService = fixture.debugElement.injector.get(QualificationsService);
    qualService.qualification.qualID = '321'
    let tcoDataService = fixture.debugElement.injector.get(TcoDataService);
    tcoDataService.isHeaderLoaded = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit', () => {
    let res = {
      "data": [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }]
    }
    let appDataService = fixture.debugElement.injector.get(AppDataService);
    appDataService.userInfo.roSuperUser = true;
    appDataService.isReadWriteAccess = false;

    let tcoDataService = fixture.debugElement.injector.get(TcoDataService);
    tcoDataService.isHeaderLoaded = true;
    tcoDataService.tcoCreateAccess = true;

    let proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    proposalDataService.proposalDataObject.proposalId = "test123"

    let qualService = fixture.debugElement.injector.get(QualificationsService);
    qualService.qualification.name = "test",
    qualService.qualification.qualID = "123"

    component.ngOnInit()
    expect(scroll).toHaveBeenCalled();
    expect(component.showCreateMessage).toBe(false);

    appDataService.isReadWriteAccess = true;
    tcoDataService.tcoCreateAccess = false;
    appDataService.roSalesTeam = false;
    component.ngOnInit()
    expect(scroll).toHaveBeenCalled();
    expect(component.disableMode).toBe(false);

    appDataService.isReadWriteAccess = true;
    tcoDataService.tcoCreateAccess = false;
    appDataService.roSalesTeam = true;
    component.ngOnInit()
    expect(scroll).toHaveBeenCalled();
    expect(component.showRoAccessMessage).toBe(true);

  });

  it('call showDisableCreate', () => {
    let appDataService = fixture.debugElement.injector.get(AppDataService);
    component.disableCreate = true;
    appDataService.roSalesTeam = false;
    appDataService.isReadWriteAccess = true;
    component.showDisableCreate();
    expect(component.showCreateMessage).toBe(true);

    appDataService.isReadWriteAccess = true;
    component.disableCreate = true;
    appDataService.roSalesTeam = true;
    component.showDisableCreate();
    expect(component.showRoAccessMessage).toBe(true);

    appDataService.isReadWriteAccess = false;
    component.disableCreate = false;
    component.showDisableCreate();
    expect(component.showCreateMessage).toBe(false);
  })

  it('call getTCOListData', () => {
    let response = {
        "error": false,
        "data" : []
    }
    let proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    proposalDataService.proposalDataObject.proposalId = "test"
    component.getTCOListData();
  })

  it('call duplicate', () => {
    let tcoId = '123';
    let tcoName = "test";
    let response = {
        "error": false,
        "data" : {

        }
    }
    let res = {
      "data": [{
        "archName": "C1_DNA",
        "name": "test",
        "id": "123",
        "currencyCode": "US Dollar"
      }]
    }
    let proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    proposalDataService.proposalDataObject.proposalId = "test1"
    component.duplicate(tcoId, tcoName);
    expect(component.tcoToCopy).toEqual('test');
  })

  it('call c', () => {
    component.closeDuplicate();
    expect(component.copyCreated).toBe(false);
  })

  it('call closeGenerate', () => {
    component.closeGenerate();
    expect(component.tcoGenerated).toBe(false);
  })

   it('call openTCOModelling', () => {
    let tco = {
      "id": "123",
      "name": "test"
    }
    let tcoDataService = fixture.debugElement.injector.get(TcoDataService)
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.openTCOModelling(tco);
    expect(tcoDataService.tcoDataObj).toEqual(tco)
  })
  

  it('call delete', () => {
    let tcoID = '123';
    let response = {
        "error": false,
        "data" : [{
          "archName": "C1_DNA",
          "name": "test",
          "id": "123",
          "currencyCode": "US Dollar"
        }]
    }
    let  modalService = TestBed.get(NgbModal);
    let modalRef = modalService.open(DeleteProposalComponent);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
      }));
    const spy = jest.spyOn(component, 'getTCOListData')  
    component.delete(tcoID);
    expect(spy).toBeTruthy();
  })

  it('call edit', () => {
    let tco = {
      "id": "123",
      "name": "test"
    }
    let  modalService = TestBed.get(NgbModal);
    let modalRef = modalService.open(CreateTcoComponent);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve) => resolve({tcoUpdate: true, updatedName: 'test1'
      }));
    component.edit(tco);
  })

  it('call createTco', () => {
    let  modalService = TestBed.get(NgbModal);
    let modalRef = modalService.open(CreateTcoComponent);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve) => resolve({tcoCreated: true
      }));
    let tcoDataService = fixture.debugElement.injector.get(TcoDataService)  
    tcoDataService.tcoId = 12334;
    let val: Promise<true>;
    const spy = jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.createTco();
    expect(spy).toBeTruthy()
  })

  
  it('call generateTCO', () => {
    let tcoId = '123';
    let tcoName = "test";
    component.generateTCO(tcoId,tcoName);
    expect(component.showGeneratePopUp).toBe(true)
  })

  it('call goToProposalList', () => {
    let val: Promise<true>;
    const spy = jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToProposalList();
    expect(spy).toHaveBeenCalled();
  })

  it('call goToBom', () => {
    let val: Promise<true>;
    const spy = jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToBom();
    expect(spy).toHaveBeenCalled();
  })

  it('call goToDocCenter', () => {
    let val: Promise<true>;
    const spy = jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToDocCenter();
    expect(spy).toHaveBeenCalled();
  })

  it('call restoreDefault', () => {
    let tcoId = '123';
   const spy = jest.spyOn(component, 'getTCOListData')
    component.restoreDefault(tcoId);
    expect(spy).toHaveBeenCalled()
  })

  
  it('call disableEdit', () => {
    const tco = {
      permissions: {
        featureAccess: []
      }
    }
    let functionDisable =  component.disableEdit(tco);
    component.disableEdit(tco);
    expect(functionDisable).toBe(true)

   const tcoObj = {
      permissions: {
        featureAccess: [{
          name: 'proposal.tco.edit'
        }]
      }
    }
   let functionDisable1 =  component.disableEdit(tcoObj);
    component.disableEdit(tcoObj);
    expect(functionDisable1).toBe(false)
  })

  it('call disableDelete', () => {
    const tco = {
      permissions: {
        featureAccess: []
      }
    }
    let functionDisable =  component.disableDelete(tco);
    component.disableDelete(tco);
    expect(functionDisable).toBe(true)

   const tcoObj = {
      permissions: {
        featureAccess: [{
          name: 'proposal.tco.delete'
        }]
      }
    }
   let functionDisable1 =  component.disableDelete(tcoObj);
    component.disableDelete(tcoObj);
    expect(functionDisable1).toBe(false)
  })

  it('call disableDuplicate', () => {
    const tco = {
      permissions: {
        featureAccess: []
      }
    }
    let functionDisable =  component.disableDuplicate(tco);
    component.disableDuplicate(tco);
    expect(functionDisable).toBe(true)

   const tcoObj = {
      permissions: {
        featureAccess: [{
          name: 'proposal.tco.duplicate'
        }]
      }
    }
   let functionDisable1 =  component.disableDuplicate(tcoObj);
    component.disableDuplicate(tcoObj);
    expect(functionDisable1).toBe(false)
  })

});
