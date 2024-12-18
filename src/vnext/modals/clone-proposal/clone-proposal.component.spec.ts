import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloneProposalComponent } from './clone-proposal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { EaService } from 'ea/ea.service';
import { VnextService } from 'vnext/vnext.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';

const postApiDataMock = [{proposalId: 1, proposalObjId: '13eqeee'}]

class EaRestServiceMock {
  getApiCall(url) {
    return of();
  }
  postApiCall(url) {
    return of(postApiDataMock);
  }
}

describe('CloneProposalComponent', () => {
  let component: CloneProposalComponent;
  let fixture: ComponentFixture<CloneProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloneProposalComponent, LocalizationPipe ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserTestingModule
      ],
      providers: [ NgbActiveModal, UtilitiesService, CurrencyPipe, LocalizationService, DataIdConstantsService, ElementIdConstantsService, ProposalStoreService, ProjectStoreService, { provide: EaRestService, useClass: EaRestServiceMock }, ConstantsService, MessageService, EaService, VnextService, VnextStoreService],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloneProposalComponent);
    component = fixture.componentInstance;
    component.associatedQuotes = [{quoteId: '1'}]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have associated quotes data', () => {
    component.ngOnInit();
    expect(component.associatedQuotes.length).toBeGreaterThanOrEqual(0);
  });

  it('call proposalList data', () => {
    const response = {data: {proposals:[{}]}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "postApiCall").mockReturnValue(of(response));
    component.getProposalListData();
    expect(component.proposalListData.length).toBeGreaterThanOrEqual(0);
  });

  it('should move to proposalist', () => {
    component.quoteSelection = true;
    component.goToProposalList(true);
    expect(component.quoteSelection).toBeFalsy();
  });

  it('should move back to quote list', () => {
    component.quoteSelection = false;
    component.goToProposalList(false);
    expect(component.quoteSelection).toBeTruthy();
  });

  it('should call updateQuoteDetail', () => {
    const quoteDetails = {
      distiDetail: {quoteId: '123'},
      quoteId: '123',
      partnerInfo: {beGeoName: 'test'}
    }
    component.updateQuoteDetail(quoteDetails);
    expect(component.selectedQuote).toEqual(quoteDetails);
  });

  it('should call close', () => {
    const close = jest.spyOn(component['ngbActiveModal'], 'close')
    component.close();
    expect(close).toHaveBeenCalled();
  });

  it('should call select proposal', () => {
    const proposal = {id: 1, objId: '1234'}
    component.selectProposalForClone(proposal);
    expect(component.selectedProposal).toEqual(proposal);
  });

  it('call goToProposal', () => {
    const proposal = {
        buyingProgram: "EA 3.0",
        ciscoLed: false,
        crAt: "2022-04-02T19:30:57.065+0000",
        crBy: "test",
        currencyCode: "USD",
        dealId: "12345",
        showDropdown: true, 
        id: 123456,
        proposalList: [{ proposalObjId: "66a7c79eeced8d7422c2fb0d", proposalId: 12345}]
    };
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToProposal(proposal);
    expect(call).toHaveBeenCalled();
  });

  it("clone()", () => {
    const response = {data: {proposal:{}}}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.selectedProposal = {objId: '12344'};
    component.selectedQuote = {quoteId: '122'}
    component.clone();
    expect(component.searchValue).toEqual('');
  });
  it("clone() 1", () => {
    const response = {error: true}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.selectedProposal = {objId: '12344'};
    component.selectedQuote = {quoteId: '122'}
    component.clone();
    expect(component.searchValue).toEqual('');
  });

  it('call searchQuote', () => {
    const event = {value:123}
    component.searchQuote(event);
    expect(component.searchValue).toEqual(event.value);
  });
  it('call searchQuote 1', () => {
    const event = {value:123}
    component.quoteSelection = false
    component.proposalListData = [{id:123}]
    component.searchQuote(event);
    expect(component.searchValue).toEqual(event.value);
  });
  it('call searchQuote 2', () => {
    const event = {}
    component.quoteSelection = false
    component.searchQuote(event);
    expect(component.searchValue).toEqual('');
  });
  it('call searchQuote 3', () => {
    const event = {}
    component.searchQuote(event);
    expect(component.searchValue).toEqual('');
  });

});
