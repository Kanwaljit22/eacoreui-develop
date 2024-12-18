import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedSubscriptionsComponent } from './associated-subscriptions.component';

describe.skip('AssociatedSubscriptionsComponent', () => {
  let component: AssociatedSubscriptionsComponent;
  let fixture: ComponentFixture<AssociatedSubscriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociatedSubscriptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociatedSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
