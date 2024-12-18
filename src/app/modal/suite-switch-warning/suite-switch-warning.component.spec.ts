import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuiteSwitchWarningComponent } from './suite-switch-warning.component';
import { LocaleService } from '@app/shared/services/locale.service';

describe('SuiteSwitchWarningComponent', () => {
  let component: SuiteSwitchWarningComponent;
  let fixture: ComponentFixture<SuiteSwitchWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuiteSwitchWarningComponent],
      providers: [NgbActiveModal, LocaleService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuiteSwitchWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SuiteSwitchWarningComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal with continue true', () => {
    const activeModalCloseMock = jest.spyOn(component.activeModal, 'close');
    component.continue();
    expect(activeModalCloseMock).toHaveBeenCalledWith({ continue: true });
  });

  it('should close modal with continue false', () => {
    const activeModalCloseMock = jest.spyOn(component.activeModal, 'close');
    component.cancel();
    expect(activeModalCloseMock).toHaveBeenCalledWith({ continue: false });
  });
});
