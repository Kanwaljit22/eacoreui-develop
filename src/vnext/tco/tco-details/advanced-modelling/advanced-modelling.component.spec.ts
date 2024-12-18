import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedModellingComponent } from './advanced-modelling.component';

describe.skip('AdvancedModellingComponent', () => {
  let component: AdvancedModellingComponent;
  let fixture: ComponentFixture<AdvancedModellingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedModellingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedModellingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
