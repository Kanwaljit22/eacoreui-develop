import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerLegalWarningComponent } from './customer-legal-warning.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { MessageService } from '@app/shared/services/message.service';
import { HttpClientModule } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('CustomerLegalWarningComponent', () => {
  let component: CustomerLegalWarningComponent;
  let fixture: ComponentFixture<CustomerLegalWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLegalWarningComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService, ProposalDataService, MessageService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, CurrencyPipe, AppDataService, AppRestService, ProposalPollerService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLegalWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call close', () => {
    component.close()
  });
  
});
