import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpcomingAgreementsComponent } from './upcoming-agreements.component';

xdescribe('UpcomingAgreementsComponent', () => {
  let component: UpcomingAgreementsComponent;
  let fixture: ComponentFixture<UpcomingAgreementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingAgreementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
