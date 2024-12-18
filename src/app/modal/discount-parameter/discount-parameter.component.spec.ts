
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
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { DiscountParameterComponent } from './discount-parameter.component';


const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  }

describe('DiscountParameterComponent', () => {
  let component: DiscountParameterComponent;
  let fixture: ComponentFixture<DiscountParameterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule, HttpClientTestingModule, RouterTestingModule, BrowserTestingModule
          ],
      declarations: [ DiscountParameterComponent ],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [AppDataService, CopyLinkService, PriceEstimationService,EaService,EaRestService, MessageService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, ProposalDataService, ConstantsService, LocaleService, AppRestService, BlockUiService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService, CreateProposalService, QualificationsService, DealListService, TcoDataService, BsModalRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on ngonInit', () => {
    component.ngOnInit();
    expect(component.priceEstimationService.discountsOnSuites.softwareServiceDiscount).toEqual("");
  });

  it('should set convert obj to slider data ', () => {
    let obj = {
        subscriptionDiscountMax: 100,
        subscriptionDiscountMin: 42
    }
    let result = component.convertToSliderObj(obj);
    expect(result).toBeTruthy();
  });

  it('should check inputvalue changed', () => {
    const mockEevent: Event = <Event><any>{
        target: {
            value: '55'
        }
    };
    const name = 'subscription Discount';
    const onValueChangedSpy = jest.spyOn(component, 'onValueChanged');
    component.inputValueChange(mockEevent, name);
    expect(onValueChangedSpy).toHaveBeenCalled();
  });

  it('should confirm changes', () => {
    component.confirm();
    expect(component.dataList.length).toBeFalsy();
  });
});
