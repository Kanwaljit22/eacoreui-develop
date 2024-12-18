import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerOutcomeComponent } from './customer-outcome.component';

xdescribe('CustomerOutcomeComponent', () => {
  let component: CustomerOutcomeComponent;
  let fixture: ComponentFixture<CustomerOutcomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOutcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
