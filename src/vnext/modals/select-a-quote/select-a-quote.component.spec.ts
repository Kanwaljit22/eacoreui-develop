import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAQuoteComponent } from './select-a-quote.component';
import {  NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SelectAQuoteComponent', () => {
  let component: SelectAQuoteComponent;
  let fixture: ComponentFixture<SelectAQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAQuoteComponent ],
      imports: [
        HttpClientModule, HttpClientTestingModule],
      providers: [ NgbActiveModal,LocalizationService, DataIdConstantsService, EaService, EaRestService, HttpClientModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateQuoteDetail', () => {
    const quoteDetails = {
      distiDetail: {id: '123'},
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
});
