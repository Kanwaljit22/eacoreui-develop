import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadDocumentConfirmationComponent } from './upload-document-confirmation.component';
import { QualListingService } from '@app/qualifications/edit-qualifications/qualification-listing/qual-listing.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';

describe('UploadDocumentConfirmationComponent', () => {
  let component: UploadDocumentConfirmationComponent;
  let fixture: ComponentFixture<UploadDocumentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadDocumentConfirmationComponent],
      providers: [NgbActiveModal, QualListingService, QualificationsService,
        LocaleService, AppDataService, MessageService, UtilitiesService,
        PartnerDealCreationService, BlockUiService, ProposalDataService,
        DocumentCenterService, AppRestService, ConstantsService, CopyLinkService,
        PermissionService, CurrencyPipe, ProposalPollerService
      ],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDocumentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the UploadDocumentConfirmationComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should disable checkbox when both signedDateStr and loaSignedDateStr are not set', () => {
    expect(component.disableCheckBox).toBeTruthy();
  });

  it('should disable checkbox when both signedDateStr and loaSignedDateStr are set', () => {
    component.signedDateStr = '20230101';
    component.loaSignedDateStr = '20230115';
    fixture.detectChanges();
    expect(component.disableCheckBox).toBe(true);
  });




  it('should call activeModal.close with continue true and correct date strings when confirm() is called', () => {
    const activeModalCloseSpy = jest.spyOn(TestBed.inject(NgbActiveModal), 'close');
    component.signedDateStr = '20230101';
    component.loaSignedDateStr = '20230115';
    component.loaSignedDate = new Date('2023-01-15T00:00:00');
    fixture.detectChanges();
    component.confirm();
    expect(activeModalCloseSpy).toHaveBeenCalledWith({
      continue: true,
      signedDateStr: '20230101',
      loaSignedDateStr: '20230115',
      loaSignedDate: new Date('2023-01-15T00:00:00')
    });
  });


  it('should call activeModal.close with continue false when close() is called', () => {
    const activeModalCloseSpy = jest.spyOn(TestBed.inject(NgbActiveModal), 'close');
    component.close();
    expect(activeModalCloseSpy).toHaveBeenCalledWith({ continue: false });
  });


});
