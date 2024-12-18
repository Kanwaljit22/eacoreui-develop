import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TcvCellRendererComponent } from './tcv-cell-renderer.component';

describe.skip('TcvCellRendererComponent', () => {
  let component: TcvCellRendererComponent;
  let fixture: ComponentFixture<TcvCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TcvCellRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TcvCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
