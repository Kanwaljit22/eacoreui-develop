import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTcoComponent } from './edit-tco.component';

xdescribe('EditTcoComponent', () => {
  let component: EditTcoComponent;
  let fixture: ComponentFixture<EditTcoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTcoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
