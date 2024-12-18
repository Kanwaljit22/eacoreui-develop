import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { ManualComplianceHoldReleaseComponent } from './manual-compliance-hold-release.component';
import { SalesReadinessService } from '@app/sales-readiness/sales-readiness.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { CurrencyPipe } from '@angular/common';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}


const fakeActivatedRoute = {
    snapshot: { data: { } }
  } as ActivatedRoute

describe('ManualComplianceHoldReleaseComponent', () => {
  let component: ManualComplianceHoldReleaseComponent;
  let fixture: ComponentFixture<ManualComplianceHoldReleaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualComplianceHoldReleaseComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService, SalesReadinessService, ProposalDataService, BlockUiService, CurrencyPipe, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, ProposalPollerService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, AppDataService, AppRestService, MessageService, QualificationsService, DealListService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualComplianceHoldReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit', () => {
    component.complianceFieldReleaseData = {
   'euifSigned' : 'Signed',
   'purchaseAuthorized': 'Yes',
   'smartAccountActive': 'Active'
    }
    component.ngOnInit();
    expect(component.stageList[0].status).toEqual('Signed');
  });

  it('call submit', () => {
    component.complianceFieldReleaseData = {
   'overridingComment' : ''

    }
    component.justificationContent = 'test'
    component.submit();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call cancelOrder', () => {
    component.cancelOrder();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });
  
});
