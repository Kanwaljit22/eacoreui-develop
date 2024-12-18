import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpnaTcvCellRendererComponent } from './spna-tcv-cell-renderer.component';

describe.skip('SpnaTcvCellRendererComponent', () => {
  let component: SpnaTcvCellRendererComponent;
  let fixture: ComponentFixture<SpnaTcvCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpnaTcvCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpnaTcvCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
