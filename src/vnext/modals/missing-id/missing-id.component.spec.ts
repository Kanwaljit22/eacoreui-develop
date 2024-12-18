import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

import { MissingIdComponent } from './missing-id.component';

describe('MissingIdComponent', () => {
  let component: MissingIdComponent;
  let fixture: ComponentFixture<MissingIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissingIdComponent,LocalizationPipe],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
       
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      providers:[NgbActiveModal, LocalizationService]//UtilitiesService,CurrencyPipe,,VnextStoreService,  EaService,EaRestService,
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
