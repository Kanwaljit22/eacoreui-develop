import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuitesHeaderRenderComponent } from './suites-header-render.component';

xdescribe('SuitesHeaderRenderComponent', () => {
  let component: SuitesHeaderRenderComponent;
  let fixture: ComponentFixture<SuitesHeaderRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuitesHeaderRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuitesHeaderRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
