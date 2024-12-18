import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeSummaryComponent } from './upgrade-summary.component';

describe.skip('UpgradeSummaryComponent', () => {
  let component: UpgradeSummaryComponent;
  let fixture: ComponentFixture<UpgradeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
