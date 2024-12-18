import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpnaSuitesHeaderRenderComponent } from './spna-suites-header-render.component';

xdescribe('SpnaSuitesHeaderRenderComponent', () => {
  let component: SpnaSuitesHeaderRenderComponent;
  let fixture: ComponentFixture<SpnaSuitesHeaderRenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpnaSuitesHeaderRenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaSuitesHeaderRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
