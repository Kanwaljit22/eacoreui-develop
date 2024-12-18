import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSmartAccountComponent } from './delete-smart-account.component';
import { LocaleService } from '@app/shared/services/locale.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('DeleteSmartAccountComponent', () => {
  let component: DeleteSmartAccountComponent;
  let fixture: ComponentFixture<DeleteSmartAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteSmartAccountComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock },LocaleService],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSmartAccountComponent);
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
