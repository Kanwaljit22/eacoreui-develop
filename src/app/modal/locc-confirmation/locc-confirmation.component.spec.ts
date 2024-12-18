import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from '@app/shared/services/locale.service';
import { LoccConfirmationComponent } from './locc-confirmation.component';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('LoccConfirmationComponent', () => {
  let component: LoccConfirmationComponent;
  let fixture: ComponentFixture<LoccConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoccConfirmationComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoccConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call continue', () => {
    component.continue();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call close', () => {
    component.close();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  it('call cancel', () => {
    component.cancel();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });
  
});
