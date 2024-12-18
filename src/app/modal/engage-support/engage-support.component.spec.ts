
import {  CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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

import { EngageSupportComponent } from './engage-support.component';

const paReasonsMock = {
    data: {
        paReasons: ['TBD', 'TBDDD']
    }
  };

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  }

describe('EngageSupportComponent', () => {
  let component: EngageSupportComponent;
  let fixture: ComponentFixture<EngageSupportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule, HttpClientTestingModule, RouterTestingModule, BrowserTestingModule
          ],
      declarations: [ EngageSupportComponent ],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [AppDataService, CopyLinkService, PriceEstimationService, MessageService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, ProposalDataService, ConstantsService, LocaleService, AppRestService, BlockUiService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService, CreateProposalService, QualificationsService, DealListService, TcoDataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngageSupportComponent);
    component = fixture.componentInstance;
    component.exceptionDataObj ={ exceptions: [
      {
          "exceptionType": "PURCHASE_ADJUSTMENT_REQUEST",
          "label": "Purchase Adjustment Request",
          "reasons": [
              "My customer is an existing Cisco EA customer (Cisco EA renewal)",
              "Issues with Customer Install Base, including missing Orders",
              "Reduction to the one-time discount",
              "Request for a non-standard one-time discount (subject to MDM approval first)"
          ],
          "selectedReason": "Issues with Customer Install Base, including missing Orders",
          "selectedReasons": [
              "Issues with Customer Install Base, including missing Orders",
              "Reduction to the one-time discount"
          ],
          "reasonSelectionOptional": false,
          "autoApprovalCandidate": false,
          "comment":[]
      }
  ]}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start ngoninit', () => {
    const exceptionSpy = jest.spyOn(component, 'setExceptionsData');
    component.ngOnInit();
    expect(exceptionSpy).toHaveBeenCalled();
  });

  it('should check all the reasons selected', () => {
    component.reasonsSelectedCount = 1;
    component.exceptionsData = component.exceptionDataObj.exceptions;
    component.checkAllReasonsSelected(component.exceptionsData);
    expect(component.isReasonSelected).toBeTruthy();
  });

  it('should check if exceptioncomment changed', () => {
    const checkReasonsSpy = jest.spyOn(component, 'checkAllReasonsSelected')
    component.selectedReasons = ['1']
    component.exceptionComment = 'test';
    component.exceptionsData = component.exceptionDataObj.exceptions;
    component.isExceptionCommentChanged();
    expect(component.isCommentWritten).toBeTruthy();
    expect(checkReasonsSpy).toHaveBeenCalled();
    expect(component.enableSubmit).toBeTruthy();

    component.exceptionComment = ''
    component.isExceptionCommentChanged();
    expect(component.enableSubmit).toBeFalsy();
    expect(component.checkboxValue).toBeFalsy();
  });

  it('should check selectExceptionsReason', () => {
    const checkAllReasonsSelectedSpy = jest.spyOn(component, 'checkAllReasonsSelected');
    // component.defaultedPaReasons = paReasonsMock.data.paReasons;
    component.selectExceptionsReason(component.exceptionsData[0].reasons[0], component.exceptionsData[0].exceptionType, component.exceptionsData[0]);
    expect(component.reasonsSelectedCount).toBeTruthy();
    component.selectExceptionsReason(component.exceptionsData[0].reasons[1], component.exceptionsData[0].exceptionType, component.exceptionsData[0]);
    expect(component.reasonsSelectedCount).toBeTruthy();
    expect(component.selectedReasons.length).toBeTruthy();
    expect(checkAllReasonsSelectedSpy).toHaveBeenCalled();
    expect(component.enableSubmit).toBeFalsy();
    component.isCommentWritten = false;
    component.selectedReasons = [];
    component.reasonsSelectedCount = 0
    component.selectExceptionsReason(component.exceptionsData[0].reasons[1], component.exceptionsData[0].exceptionType, component.exceptionsData[0]);
    expect(component.enableSubmit).toBeFalsy();
  });

  it('should check selectedReasons', () => {
    const reasons = component.exceptionsData[0].reasons;
    component.selectedReasons = [reasons[1]];
    let isSelectedReasonPresent = component.checkSelectedReasons(reasons[1]);
    expect(isSelectedReasonPresent).toBeTruthy();
    isSelectedReasonPresent = component.checkSelectedReasons(reasons[2]);
    expect(isSelectedReasonPresent).toBeFalsy();
  });

});
