import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivityLogDetailsComponent } from './activity-log-details.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
}

describe('ActivityLogDetailsComponent', () => {
  let component: ActivityLogDetailsComponent;
  let fixture: ComponentFixture<ActivityLogDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLogDetailsComponent ],
      providers: [LocaleService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }],
      imports: [],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call close', () => {
    component.close()
  });
  
});
