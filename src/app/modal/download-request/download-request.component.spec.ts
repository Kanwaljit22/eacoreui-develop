
import {  CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { PermissionService } from '@app/permission.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { of } from 'rxjs';
import { DownloadRequestComponent } from './download-request.component';
import 'jest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class PriceEstimationServiceMock {
    sendTcvReport(reqJSON) {
        return of({error: false});
    }
    sendIbaReport(reqJSON) {
        return of({error: false});
    }
    getCustomerIBReport(reqJSON) {
        return of({error: false});
    }
}

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  }

describe('DownloadRequestComponent', () => {
  let component: DownloadRequestComponent;
  let fixture: ComponentFixture<DownloadRequestComponent>;
  let priceEstimationService = new PriceEstimationServiceMock();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
          ],
      declarations: [ DownloadRequestComponent ],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [AppDataService, CopyLinkService, {provide: PriceEstimationService, useValue: priceEstimationService}, MessageService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, ProposalDataService, ConstantsService, LocaleService, AppRestService, BlockUiService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService, CreateProposalService, QualificationsService, DealListService, TcoDataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sendTcvReport', () => {
    const apiSpy = jest.spyOn(priceEstimationService, 'sendTcvReport');
    component.sendTcvReport();
    expect(apiSpy).toHaveBeenCalled();
  });

  it('should sendIbaReport', () => {
    const apiSpy = jest.spyOn(priceEstimationService, 'sendIbaReport');
    component.sendIbaReport();
    expect(apiSpy).toHaveBeenCalled();
  });

  it('should sendCustomerIbReport', () => {
    const apiSpy = jest.spyOn(priceEstimationService, 'getCustomerIBReport');
    component.sendCustomerIbReport();
    expect(apiSpy).toHaveBeenCalled();
  });

});
