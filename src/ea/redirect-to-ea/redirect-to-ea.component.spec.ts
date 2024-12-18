import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

import { RedirectToEaComponent } from './redirect-to-ea.component';

describe('RedirectToEaComponent', () => {
  let component: RedirectToEaComponent;
  let fixture: ComponentFixture<RedirectToEaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectToEaComponent, LocalizationPipe],
      providers: [ EaPermissionsService, DataIdConstantsService],
      imports: [RouterTestingModule.withRoutes([
        { path: "eamp", redirectTo: "" },
      ])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RedirectToEaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call prepareUrl', () => {
    component.dealId = 'abc';
    component.quoteId = 'efg';
    component.sId = 'hig'
    const url = 'did=' + btoa(component.dealId) + '&qid=' + btoa(component.quoteId) + '&sid=' + btoa(component.sId)
    const value = component.prepareUrl()
    expect(value).toEqual(url);
  });

  it('should call redirectTo', () => {
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigateByUrl').mockReturnValue(val);
    component.dealId = 'abc';
    component.quoteId = 'efg';
    component.sId = 'hig'
    const url = 'did=' + btoa(component.dealId) + '&qid=' + btoa(component.quoteId) + '&sid=' + btoa(component.sId)
    component.redirectTo()
    expect(component["router"].navigateByUrl).toHaveBeenCalledWith('eamp?' + url);
  });
});
