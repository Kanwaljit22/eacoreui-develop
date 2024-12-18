import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuitesRenewalApprovalComponent } from './suites-renewal-approval.component';



//test-covered
describe('SuitesRenewalApprovalComponent', () => {
  let component: SuitesRenewalApprovalComponent;
  let fixture: ComponentFixture<SuitesRenewalApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuitesRenewalApprovalComponent],
      providers: [NgbActiveModal]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitesRenewalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SuitesRenewalApprovalComponent', () => {
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
