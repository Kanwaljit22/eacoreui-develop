import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NewLaunchedExpComponent } from './new-launched-exp.component';

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}


describe('NewLaunchedExpComponent', () => {
  let component: NewLaunchedExpComponent;
  let fixture: ComponentFixture<NewLaunchedExpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLaunchedExpComponent ],
      providers: [ { provide: NgbActiveModal, useValue: NgbActiveModalMock }],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLaunchedExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call continue', () => {
    component.continue();
    expect(NgbActiveModalMock.close).toHaveBeenCalled();
  });

  
});
