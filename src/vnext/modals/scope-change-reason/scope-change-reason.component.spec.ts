import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeChangeReasonComponent } from './scope-change-reason.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { EaService } from 'ea/ea.service';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

class MockEaRestService {
  getApiCall() {
    return of({
        data: {
            "reasonInfo": [
                {
                    "id": "1",
                    "desc": "An acquisition has occurred, and the customer needs to manage the EAs separately"
                },
                {
                    "id": "2",
                    "desc": "A divestiture has occurred, and the customer needs to remove sites from the existing customer scope"
                },
                {
                    "id": "3",
                    "desc": "Sites were missed during the Initial Customer Scope selection and need to be added"
                },
                {
                    "id": "other",
                    "desc": "Other"
                }
            ]
        }
    });
  }
  postApiCall() {
    return of({
        data: {
            "requestId": "660e6760a2cf5b5c8bd1b7c1",
            "expirationDate": '02-04-2024',
            "status": "In Progress",
            "scopeId": 24109,
            "reasonInfo": {
                "id": "1",
                "desc": 'Other',
                "reasonDetails": 'test'
            }
        }
    });
  }
}

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}


describe('ScopeChangeReasonComponent', () => {
  let component: ScopeChangeReasonComponent;
  let fixture: ComponentFixture<ScopeChangeReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScopeChangeReasonComponent, LocalizationPipe ],
      providers: [
        { provide: NgbActiveModal, useValue: NgbActiveModalMock },LocalizationService,DataIdConstantsService, {provide: EaRestService, useClass: MockEaRestService}, VnextService,MessageService, EaService,EaidStoreService, VnextStoreService, ProjectStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService
      ],
      imports: [HttpClientModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopeChangeReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('call ngOnInIt', () => {
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.eaIdData = {
      scopeChangeDetails: {
        reasonInfo: {
          id: '1',
          desc: 'other',
          reasonDetails: 'test'
        }
      }
    }
    component.ngOnInit()
    expect(component.enterOtherReason).toBeTruthy();
  });

  it('call selectScopeReason', () => {
    const reason = {
      id : '2',
      desc: 'test',
      reasonDetails: ''
    }
    component.selectScopeReason(reason)
    expect(component.selectedReasonId).toEqual(reason.id);
  });

  it('call continueToScopeChange', () => {
    let eaIdStoreService = fixture.debugElement.injector.get(EaidStoreService);
    eaIdStoreService.encryptedEaId = '6ARTEST';
    component.selectedReasonId = "2";
    const continueSpy = jest.spyOn(component, 'continue')
    component.continueToScopeChange();
    expect(continueSpy).toHaveBeenCalled()
  });
});
