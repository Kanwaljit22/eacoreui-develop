import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CxConfirmationComponent } from './cx-confirmation.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

const NgbActiveModalMock = {
 close: jest.fn().mockReturnValue('close')
}

describe('CxConfirmationComponent', () => {
  let component: CxConfirmationComponent;
  let fixture: ComponentFixture<CxConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CxConfirmationComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }, Router],
      imports: [ RouterTestingModule.withRoutes([
        { path: "qualifications/proposal", redirectTo: "" }])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CxConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('call checkboxSelection', () => {
    component.isCheckboxSelected = false;
    component.checkboxSelection();
    expect(component.isCheckboxSelected).toBe(true);

    component.isCheckboxSelected = true;
    component.checkboxSelection();
    expect(component.isCheckboxSelected).toBe(false);;
  });

  it('call close', () => {
    component.close()
  });

  it('call continue', () => {
    component.continue()
  });

  
  it('call openProposalList', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.openProposalList()
    expect(component["router"].navigate).toHaveBeenCalledWith(['qualifications/proposal']);
  });
  
});
