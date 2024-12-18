import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from '../project-store.service';

import { ContactDetailsComponent } from './contact-details.component';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';
import { VnextService } from 'vnext/vnext.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { HttpClientModule } from '@angular/common/http';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { of } from 'rxjs';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProjectService } from '../project.service';
import { ProjectRestService } from '../project-rest.service';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailsComponent, LocalizationPipe ],
      providers:[ProjectStoreService, DataIdConstantsService, EaService, EaRestService, SubsidiariesStoreService,VnextService, ConstantsService, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService, ElementIdConstantsService, ProjectService, ProjectRestService],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('call viewAtr', () => {
    let subsidiareService = fixture.debugElement.injector.get(SubsidiariesStoreService);
    subsidiareService.subsidiariesData = [{
      "bus": [],
      "cavId" : 12344,
      "cavName": "test",
      "selected": false
    }]
    const response = {
      "data": "https://ciscoready.cloudapps.cisco.com/#/search"
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    window.open = jest.fn();
   const newTab = jest.spyOn(window,'open') 
    component.viewAtr();
    expect(newTab).toBeCalledWith('https://ciscoready.cloudapps.cisco.com/#/search');
  });
});
