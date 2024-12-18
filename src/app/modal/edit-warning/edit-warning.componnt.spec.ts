import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditWarningComponent } from './edit-warning.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { AppDataService } from '@app/shared/services/app.data.service';import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { Renderer2 } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { FiltersService } from '@app/dashboard/filters/filters.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('EditWarningComponent', () => {
  let component: EditWarningComponent;
  let fixture: ComponentFixture<EditWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWarningComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, LocaleService, QualificationsService, WhoInvolvedService, ProductSummaryService,  Renderer2, BlockUiService, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, CurrencyPipe, AppDataService, AppRestService, ProposalPollerService,MessageService,ProposalDataService, FiltersService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('call continueEdit', () => {
    component.continueEdit()
  });
  
});
