import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpnaQuestionnaireComponent } from './spna-questionnaire.component';

xdescribe('SpnaQuestionnaireComponent', () => {
  let component: SpnaQuestionnaireComponent;
  let fixture: ComponentFixture<SpnaQuestionnaireComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpnaQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
