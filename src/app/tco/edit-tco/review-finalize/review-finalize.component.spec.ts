import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewFinalizeComponent } from './review-finalize.component';

xdescribe('ReviewFinalizeComponent', () => {
  let component: ReviewFinalizeComponent;
  let fixture: ComponentFixture<ReviewFinalizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewFinalizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewFinalizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
