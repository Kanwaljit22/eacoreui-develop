import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { LookupSubscriptionComponent } from './lookup-subscription.component';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { MessageService } from '@app/shared/services/message.service';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { CurrencyPipe } from '@angular/common';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { of } from 'rxjs';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

const fakeActivatedRoute = {
    snapshot: { data: { } }
  } as ActivatedRoute

describe('LookupSubscriptionComponent', () => {
  let component: LookupSubscriptionComponent;
  let fixture: ComponentFixture<LookupSubscriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupSubscriptionComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService, CreateProposalService, MessageService,Renderer2, AppDataService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, AppRestService, BlockUiService, CurrencyPipe, ConstantsService, CopyLinkService, PermissionService, ProposalDataService, UtilitiesService, ProposalPollerService, QualificationsService, TcoDataService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('call selectSubscription', () => {
    let obj = {
        "virtualAccountName": "test",
        "startDate": "08/05/20223",
        "endDate": "30/05/20223",
        "subscriptionId": "1234",
        "status": "InProgress"

    }
    component.selectSubscription(obj)
    expect(component.isSubscriptionSelected).toBe(true);
  });
  
  it('call updateLookUpSubscription', () => {
    let event;
    component.updateLookUpSubscription(event)
    expect(component.isSubscriptionSelected).toBe(false);
  });

  it('call close', () => {
    component.close();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call done', () => {
    component.done();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call subscriptionLookup', () => {
    component.subscriptionId = '1345453';
    let res = {
        data : {
            "virtualAccountName": "test",
            "startDate": "08/05/20223",
            "endDate": "30/05/20223",
            "subscriptionId": "1234",
            "status": "InProgress"
        }
    }
    let restService = fixture.debugElement.injector.get(CreateProposalService);
    jest.spyOn(restService, 'subscriptionLookup').mockReturnValue(of(res))
    component.subscriptionLookup();
    expect(component.isSubscriptionListLoaded).toBe(true);
  });
  
});
