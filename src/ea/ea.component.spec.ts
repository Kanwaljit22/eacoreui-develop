import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EaComponent } from './ea.component';

xdescribe('EaComponent', () => {
  let component: EaComponent;
  let fixture: ComponentFixture<EaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
