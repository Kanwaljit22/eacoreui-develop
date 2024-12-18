import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPricingDetailsComponent } from './download-pricing-details.component';

describe.skip('DownloadPricingDetailsComponent', () => {
  let component: DownloadPricingDetailsComponent;
  let fixture: ComponentFixture<DownloadPricingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadPricingDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPricingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
