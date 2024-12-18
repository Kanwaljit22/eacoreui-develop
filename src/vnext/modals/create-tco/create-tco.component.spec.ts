import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { CreateTcoComponent } from './create-tco.component';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { of } from 'rxjs';
import { ChangeContext } from '@angular-slider/ngx-slider';

describe('CreateTcoComponent', () => {
  let component: CreateTcoComponent;
  let fixture: ComponentFixture<CreateTcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTcoComponent, LocalizationPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [NgbActiveModal, EaService, EaRestService, VnextService, VnextStoreService, 
        ProjectStoreService ,UtilitiesService, DataIdConstantsService, ElementIdConstantsService, LocalizationService,
         CurrencyPipe,ProposalStoreService],

    })
    .compileComponents();
    fixture = TestBed.createComponent(CreateTcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngoninit', () => {
    const getDefaultValues = jest.spyOn(component, 'getDefaultValues');
    component.ngOnInit();
    expect(getDefaultValues).toHaveBeenCalled();
  });

  it('should call displayPartnerMarkup', () => {
    component.displayPartnerMarkup();
    expect(component.isPartnerMarkup).toBeTruthy();
  });

  it('should call displayGrowthExpenses', () => {
    component.displayGrowthExpenses();
    expect(component.isGrowthExpenses).toBeTruthy();
  });

  it('should call displayTimeValueMoney', () => {
    component.displayTimeValueMoney();
    expect(component.isTimeValueMoney).toBeTruthy();
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });
  
  it('call continue method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.continue();
     expect(closeMethod).toHaveBeenCalled();
  });
  
  it('should call getDefaultValues', () => {
    const response ={data: {tcoConfig:  { defaults: {partnerMarkup: 23, growthParameter: 2, inflation: 4}}}}
    let eRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eRestService, "getApiCall").mockReturnValue(of(response));
    component.getDefaultValues();
    expect(component.partnerMarkupDiscount).toBeTruthy();
  });

  it('should call checkMinValue', () => {
    let event = {target: {value: 2}}
    const data  = {minDiscount: 3, selectedValue: 4}
    component.checkMinValue(event, data);
    expect(event.target.value).toBeTruthy();
  });


  it('should call sliderChange', () => {
    let changeContext: ChangeContext = {highValue: 1, value: 2, pointerType: 0  }
    let data  = {minDiscount: 3, maxDiscount: 4}
    component.sliderChange(changeContext, data);
    expect(changeContext.highValue).toBeTruthy();


    changeContext.highValue = 5;
    component.sliderChange(changeContext, data);
    expect(changeContext.highValue).toBeTruthy();
  });

  it("should set value when changes from input", fakeAsync(() => {
    let event = {preventDefault : ()=>{},target: {value: 2}}
    let data = {minDiscount: 34, maxDiscount: 40, selectedValue: 32}
    component.inputValueChange(event, data);
    tick(1500);
    expect(data.selectedValue).toBeTruthy();
    flush();


    event.target.value = 45
    component.inputValueChange(event, data);
    tick(1200);
    expect(data.selectedValue).toBeTruthy();
    flush();
  }));
});

