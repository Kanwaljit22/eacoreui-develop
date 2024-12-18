import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProposalComponent } from './delete-proposal.component';
import { LocaleService } from '@app/shared/services/locale.service';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('DeleteProposalComponent', () => {
  let component: DeleteProposalComponent;
  let fixture: ComponentFixture<DeleteProposalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProposalComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, LocaleService],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProposalComponent);
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
