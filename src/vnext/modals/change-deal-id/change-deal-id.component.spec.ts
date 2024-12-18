import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDealIdComponent } from './change-deal-id.component';
import { HttpClientModule } from '@angular/common/http';
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
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}

const testData  = {
  data: {
    dealInfo: {
      id:'11111'
    }
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

describe('ChangeDealIdComponent', () => {
  let component: ChangeDealIdComponent;
  let fixture: ComponentFixture<ChangeDealIdComponent>;
  let eaRestService = new MockEaRestService();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDealIdComponent ],
      providers: [LocalizationService, DataIdConstantsService, VnextService, ProjectStoreService, { provide: EaRestService, useValue: eaRestService }, MessageService, EaService, BlockUiService, { provide: NgbActiveModal, useValue: NgbActiveModalMock}, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDealIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call lookUpDeal', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      dealInfo : {
        id: '123344'
      }
    }
    component.newDealId = '1222'
    component.lookUpDeal()

    const response = { error: true} 
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.lookUpDeal()
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call matchDealId method', () => {
    component.allowChange = false;
    component.matchDealId();
     expect(component.allowChange).toBeTruthy();
  });

  it('call selectItems method', () => {
    component.selectedProposalIds = ['122', '111']
    const proposal = {
      selected: false,
      objId: '123'
    }
    component.proposalListData = [
      {
        name:'test1',
        selected: false
      },
      {
        name:'test',
        selected: false
      }
    ]
    component.includingItemsData = [
      {
        name:'test',
        selected: true,
        id: 'copyAllMyProposals'
      }
    ]
    const item = {
      name: 'test',
      selected: false,
      id: 'copyAllMyProposals'
    }
    component.selectItems(item);
     expect(item.selected).toBeTruthy();
  });

  it('call changeDealId method', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      objId:'2we32rer',
      dealInfo : {
        id: '123344'
      }
    }
    component.newDealId = '1222'
    
    const response = { data: {
      project: {
        objId:'2we32rer',
        dealInfo : {
          id: '123344'
        }
      }
    }} 
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.changeDealId();
  });

  it('call pageChange method', () => {
    const event = 4;
    component.request = {
      data: {
        createdByMe: false,
        page: {
          currentPage : 2,
          pageSize:10
        }
      }
    }
    component.pageChange(event);
  });

  it('call selectProposal method', () => {
    const proposal = {
      selected: false,
      objId: '123'
    }
    component.includingItemsData = [
      {
        name:'test',
        selected: false,
        id: 'copyAllMyProposals'
      }
    ]
    component.proposalListData = [
      {
        name:'test1',
        selected: false
      },
      {
        name:'test',
        selected: false
      }
    ]
    component.selectProposal(proposal);
    expect(proposal.selected).toBeTruthy();
  });

  it('call selectAllProposal method', () => {
    component.selectedProposalIds = ['122', '111']
    const proposal = {
      selected: false,
      objId: '123'
    }
    component.proposalListData = [
      {
        name:'test1',
        selected: false
      },
      {
        name:'test',
        selected: false
      }
    ]
    component.includingItemsData = [
      {
        name:'test',
        selected: true,
        id: 'copyAllMyProposals'
      }
    ]
    component.proposalListData = [
      {
        name:'test1',
        selected: false
      },
      {
        name:'test',
        selected: false
      }
    ]
    component.selectAllProposal();
  });
});
