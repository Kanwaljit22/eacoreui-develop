import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { ManageServiceSpecialistComponent } from './manage-service-specialist.component';
import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { CurrencyPipe } from '@angular/common';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MessageService } from '@app/shared/services/message.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('ManageServiceSpecialistComponent', () => {
  let component: ManageServiceSpecialistComponent;
  let fixture: ComponentFixture<ManageServiceSpecialistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageServiceSpecialistComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService, QualificationsService, AppDataService,  AppRestService, BlockUiService, CurrencyPipe, ConstantsService, CopyLinkService, PermissionService, ProposalDataService, UtilitiesService, ProposalPollerService, MessageService], 
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageServiceSpecialistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call continue', () => {
    component.continue()
  });

  it('call close', () => {
    component.close()
  });
  
});
