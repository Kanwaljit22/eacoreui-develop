import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EarlyRenewalApprovalComponent } from './early-renewal-approval.component';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('EarlyRenewalApprovalComponent', () => {
  let component: EarlyRenewalApprovalComponent;
  let fixture: ComponentFixture<EarlyRenewalApprovalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EarlyRenewalApprovalComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyRenewalApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call continue', () => {
    component.continue()
  });

  it('call close', () => {
    component.close()
  });
  
});
