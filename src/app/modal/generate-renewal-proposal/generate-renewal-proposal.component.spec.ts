import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GenerateRenewalProposalComponent } from './generate-renewal-proposal.component';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('GenerateRenewalProposalComponent', () => {
  let component: GenerateRenewalProposalComponent;
  let fixture: ComponentFixture<GenerateRenewalProposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateRenewalProposalComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateRenewalProposalComponent);
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
