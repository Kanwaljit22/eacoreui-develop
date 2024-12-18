import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProposalToQuoteComponent } from './proposal-to-quote.component';
import { LocaleService } from '@app/shared/services/locale.service';

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}

describe('ProposalToQuoteComponent', () => {
  let component: ProposalToQuoteComponent;
  let fixture: ComponentFixture<ProposalToQuoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalToQuoteComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalToQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.quoteData = {
        "proposalName": "test",
        "archName": "CiscoDna",
        "partner": "test"
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('call getSelecteditem', () => {
    component.radioSelected = '123';
    component.quotesList = [{
        "quoteId": '123'
    }]
    component.getSelecteditem();
    expect(component.radioSel).toEqual(component.quotesList[0]);
  });
  
  it('call onItemChange', () => {
    let evt;
    let call = jest.spyOn(component, 'getSelecteditem')
    component.onItemChange(evt);
    expect(call).toHaveBeenCalled();
  });

  it('call createNewQuote', () => {
    component.createNewQuote();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call updateQuote', () => {
    component.updateQuote();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  
});
