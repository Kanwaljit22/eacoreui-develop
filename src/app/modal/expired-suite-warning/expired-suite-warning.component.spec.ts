import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpiredSuiteWarningComponent } from './expired-suite-warning.component';
import { LocaleService } from '@app/shared/services/locale.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('ExpiredSuiteWarningComponent', () => {
  let component: ExpiredSuiteWarningComponent;
  let fixture: ComponentFixture<ExpiredSuiteWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredSuiteWarningComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredSuiteWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call continue', () => {
    component.continue()
  });

  it('call cancel', () => {
    component.cancel()
  });
  
});
