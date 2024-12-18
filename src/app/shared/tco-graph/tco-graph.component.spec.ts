import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TcoGraphComponent } from './tco-graph.component';

xdescribe('TcoGraphComponent', () => {
  let component: TcoGraphComponent;
  let fixture: ComponentFixture<TcoGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TcoGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcoGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
