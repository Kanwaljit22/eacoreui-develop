import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmReloadEaConsumptionComponent } from './confirm-reload-ea-consumption.component';
import { LocaleService } from '../../shared/services/locale.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
   
}

describe('ConfirmReloadEaConsumptionComponent', () => {
  let component: ConfirmReloadEaConsumptionComponent;
  let fixture: ComponentFixture<ConfirmReloadEaConsumptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmReloadEaConsumptionComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReloadEaConsumptionComponent);
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
