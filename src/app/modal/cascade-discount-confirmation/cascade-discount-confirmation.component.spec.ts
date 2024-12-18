import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CascadeDiscountConfirmationComponent } from './cascade-discount-confirmation.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { HttpClientModule } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
}

describe('CascadeDiscountConfirmationComponent', () => {
  let component: CascadeDiscountConfirmationComponent;
  let fixture: ComponentFixture<CascadeDiscountConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CascadeDiscountConfirmationComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, ProposalDataService, AppDataService, LocaleService, AppRestService, MessageService, BlockUiService, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CascadeDiscountConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call close', () => {
    component.close()
  });

  it('call ngOnDestroy', () => {
    const proposalDataService = fixture.debugElement.injector.get(ProposalDataService);
    component.ngOnDestroy();
    expect(proposalDataService.caseCreatedForCxProposal).toBe(false);
  });

  it('call continue', () => {
    component.continue();
  });
  
});
