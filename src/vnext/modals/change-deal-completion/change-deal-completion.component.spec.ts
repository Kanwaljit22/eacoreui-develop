import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDealCompletionComponent } from './change-deal-completion.component';

xdescribe('ChangeDealCompletionComponent', () => {
  let component: ChangeDealCompletionComponent;
  let fixture: ComponentFixture<ChangeDealCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDealCompletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDealCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
