import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewAuthorizationComponent } from './view-authorization.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RouterTestingModule } from '@angular/router/testing';
import {  CurrencyPipe } from '@angular/common';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

const authorizationDataMock = {
  "qualifications": [
    {
      "code": "EA3VWEBEX",
      "desc": "Collaboration",
      "temporary": false,
      "atos": [{
          "name": "E3-COLLAB",
          "desc": "Collaboration"
        },
        {
          "name": "E3-SEC-ISE",
          "desc": "Identity Services Engine (ISE)"
        },
        {
          "name": "E3-SEC-DUO-MFA",
          "desc": "Secure Access by Duo"
        }
      ],
      "active": true,
      "type": "ATO",
      "authorized": true,
      "distributor": false
    },
    {
      "code": "EA3DAASN",
      "desc": "Networking Infrastructure",
      "temporary": false,
      "atos": [{
          "name": "E3-N-AS",
          "desc": "Cisco DNA Switching"
        },
        {
          "name": "E3-N-AIR",
          "desc": "Cisco DNA Wireless"
        }
      ],
      "active": true,
      "type": "ATO",
      "authorized": false,
      "distributor": false
    }
  ],
  "mspInfo": {
    "mspAuthorizedQualcodes": [
      "EA3MSEAPE"
    ],
    "mspProposal": false,
    "mspPartner": true
  }
}


describe('ViewAuthorizationComponent', () => {
  let component: ViewAuthorizationComponent;
  let fixture: ComponentFixture<ViewAuthorizationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, 
        RouterTestingModule],
      declarations: [ ViewAuthorizationComponent ,LocalizationPipe],
      schemas:[NO_ERRORS_SCHEMA],
      providers : [ NgbActiveModal, 
        UtilitiesService, LocalizationService, ProposalStoreService, PriceEstimateStoreService, VnextService, VnextStoreService, EaRestService, EaStoreService, CurrencyPipe, DataIdConstantsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start ngOnInit', () => {
    component.authorizationData = authorizationDataMock.qualifications;
    const prepareDataSpy = jest.spyOn(component, 'prepareData');
    component.ngOnInit();
    expect(prepareDataSpy).toHaveBeenCalled();
  });

  it('should expand', () => {
    component.authorizationData = authorizationDataMock.qualifications;
    component.authorizationData[0].expanded = false;
    component.expand(component.authorizationData[0]);
    expect(component.authorizationData[0]).toBeTruthy();
  });

  it('call close', () => {
    let modal = jest.spyOn(component.activeModal,'close')
    component.close();
    expect(modal).toHaveBeenCalled();
  });

  it('should call enrollAdditionalAuthorization', () => {
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.enrollAdditionalAuthorization();
    expect(call).toHaveBeenCalled();
  })


  it('call prepareData', () => {
    component.authorizationData = authorizationDataMock.qualifications;
    component.prepareData();
    expect(component.purchaseAuthData).toBeTruthy();
    expect(component.purchaseTempAuthData).toBeTruthy();
  });
});
