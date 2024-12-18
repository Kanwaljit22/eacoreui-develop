import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';

import { GuidanceEaActionsComponent } from './guidance-ea-actions.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

class MockEaRestService {

  getApiCall() {
    return of({
      data: {
        smartAccounts: [{
          smartAccName: 'test'
        }],
        hasEa2Entity: false
      }
    })
  }
}

describe('GuidanceEaActionsComponent', () => {
  let component: GuidanceEaActionsComponent;
  let fixture: ComponentFixture<GuidanceEaActionsComponent>;
  let eaRestService = new MockEaRestService();

  const routerSpy =  {'Router': jest.fn().mockReturnValue('navigateByUrl')};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuidanceEaActionsComponent, LocalizationPipe ],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([{
        path: "ea/home", redirectTo: ""}
      ])],
          providers: [{provide:EaRestService, useVale: eaRestService}, EaStoreService, LocalizationService, EaService, ProposalStoreService, DataIdConstantsService],
          schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidanceEaActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should got to ea home', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToEaHome();
    expect(component["router"].navigate).toHaveBeenCalledWith(['ea/home']);
  });

  it('should download playbook', () => {
    let res = {
      error: false,
      data: true
    }
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, 'getApiCall').mockReturnValue(of(res));
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    // const validateSpy = spyOn(vnextService, 'isValidResponseWithData').and.returnValue(of(true));
    component.goToDownloadPlayBook();
    expect(call).toHaveBeenCalled();
    // expect(validateSpy).toHaveBeenCalled();
    // expect(component.isConvertToQuoteClicked).toBeTruthy();
    expect(component.isPartnerLoggedIn).toBe(false);
  });

  it('should download playbook', () => {
    let res = {
      error: false,
      data: true
    }
    let service = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(service, 'getApiCall').mockReturnValue(of(res));
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.routeToUrl(false, true);
    expect(component.isPartnerLoggedIn).toBe(false);
  });
});
