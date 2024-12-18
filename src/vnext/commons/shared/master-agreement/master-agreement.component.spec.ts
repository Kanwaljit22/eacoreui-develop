import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAgreementComponent } from './master-agreement.component';

describe.skip('MasterAgreementComponent', () => {
  let component: MasterAgreementComponent;
  let fixture: ComponentFixture<MasterAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAgreementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
