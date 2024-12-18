import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionAccessComponent } from './subscription-access.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';

import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';

describe('SubscriptionAccessComponent', () => {
  let component: SubscriptionAccessComponent;
  let fixture: ComponentFixture<SubscriptionAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionAccessComponent],
      providers: [NgbActiveModal, QualificationsService, AppDataService, LocaleService, AppRestService, MessageService, 
        BlockUiService, UtilitiesService,
        ProposalDataService,
        DocumentCenterService,ConstantsService, CopyLinkService,
        PermissionService, CurrencyPipe, ProposalPollerService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SubscriptionAccessComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal with continue false', () => {
    const activeModalCloseMock = jest.spyOn(TestBed.inject(NgbActiveModal), 'close');
    component.cancel();
    expect(activeModalCloseMock).toHaveBeenCalledWith({ continue: false });
  });
});
