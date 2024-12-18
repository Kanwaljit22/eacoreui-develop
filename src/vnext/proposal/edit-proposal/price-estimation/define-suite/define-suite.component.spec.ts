import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineSuiteComponent } from './define-suite.component';

describe.skip('DefineSuiteComponent', () => {
  let component: DefineSuiteComponent;
  let fixture: ComponentFixture<DefineSuiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefineSuiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
