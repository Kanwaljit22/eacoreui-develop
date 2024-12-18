import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDateComponent } from './system-date.component';

describe.skip('SystemDateComponent', () => {
  let component: SystemDateComponent;
  let fixture: ComponentFixture<SystemDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
