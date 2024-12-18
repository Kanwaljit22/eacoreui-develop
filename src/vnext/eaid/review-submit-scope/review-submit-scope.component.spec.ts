import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubmitScopeComponent } from './review-submit-scope.component';

describe.skip('ReviewSubmitScopeComponent', () => {
  let component: ReviewSubmitScopeComponent;
  let fixture: ComponentFixture<ReviewSubmitScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSubmitScopeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSubmitScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
