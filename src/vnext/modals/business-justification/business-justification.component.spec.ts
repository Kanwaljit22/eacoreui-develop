import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

import { BusinessJustificationComponent } from './business-justification.component';
const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
 }
describe('BusinessJustificationComponent', () => {
  let component: BusinessJustificationComponent;
  let fixture: ComponentFixture<BusinessJustificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessJustificationComponent ,LocalizationPipe],
      providers: [{ provide: NgbActiveModal, useValue: NgbActiveModalMock },UtilitiesService,LocalizationService,ProposalStoreService,  DataIdConstantsService,CurrencyPipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessJustificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.proposalStoreService.proposalData.nonStandardTermDetails ={ruleBusinessJustification:10}
    expect(component).toBeTruthy();
  });
  it('should call onPaste', () => {
    const mockClipboardData = {
      getData: (format: string) => 'mocked pasted data'
    };
    
    const mockEvent = {
      clipboardData: mockClipboardData,
      preventDefault: function(){}
    } as ClipboardEvent;
    component.onPaste(mockEvent);
    expect(component.percentage).toBeFalsy()
  })
  it('should call inputValueChange', () => {
    const event = {target:{value :  110}}
    component.inputValueChange(event);
    expect(event.target.value).toEqual(100)
  })
  it('should call close', () => {
    component.close();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  })
  it('should call close', () => {
    component.done();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  })
});
