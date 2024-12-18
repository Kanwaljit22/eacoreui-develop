import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewSitesComponent } from './view-sites.component';

xdescribe('ViewSitesComponent', () => {
  let component: ViewSitesComponent;
  let fixture: ComponentFixture<ViewSitesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
