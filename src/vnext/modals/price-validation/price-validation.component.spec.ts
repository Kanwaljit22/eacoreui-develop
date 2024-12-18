import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceValidationComponent } from './price-validation.component';

describe.skip('PriceValidationComponent', () => {
  let component: PriceValidationComponent;
  let fixture: ComponentFixture<PriceValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
