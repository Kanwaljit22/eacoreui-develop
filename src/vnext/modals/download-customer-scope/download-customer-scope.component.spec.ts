import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadCustomerScopeComponent } from './download-customer-scope.component';

describe.skip('DownloadCustomerScopeComponent', () => {
  let component: DownloadCustomerScopeComponent;
  let fixture: ComponentFixture<DownloadCustomerScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadCustomerScopeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadCustomerScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
