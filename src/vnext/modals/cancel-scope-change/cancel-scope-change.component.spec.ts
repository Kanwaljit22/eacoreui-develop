import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelScopeChangeComponent } from './cancel-scope-change.component';

describe.skip('CancelScopeChangeComponent', () => {
  let component: CancelScopeChangeComponent;
  let fixture: ComponentFixture<CancelScopeChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelScopeChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelScopeChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
