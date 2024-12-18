import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocaleService } from "@app/shared/services/locale.service";
import { TcoWarningComponent } from './tco-warning.component';


//test-covered
describe('TcoWarningComponent', () => {
  let component: TcoWarningComponent;
  let fixture: ComponentFixture<TcoWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TcoWarningComponent],
      providers: [NgbActiveModal, LocaleService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TcoWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the TcoWarningComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal with continue true', () => {
    const activeModalCloseMock = jest.spyOn(TestBed.inject(NgbActiveModal), 'close');
    component.continue();
    expect(activeModalCloseMock).toHaveBeenCalledWith({ continue: true });
  });

  it('should close modal with continue false', () => {
    const activeModalCloseMock = jest.spyOn(TestBed.inject(NgbActiveModal), 'close');
    component.cancel();
    expect(activeModalCloseMock).toHaveBeenCalledWith({ continue: false });
  });
});
