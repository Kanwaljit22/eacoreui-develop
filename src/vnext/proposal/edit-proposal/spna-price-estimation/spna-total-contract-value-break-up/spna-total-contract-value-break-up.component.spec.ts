import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

import { SpnaTotalContractValueBreakUpComponent } from './spna-total-contract-value-break-up.component';

describe('SpnaTotalContractValueBreakUpComponent', () => {
  let component: SpnaTotalContractValueBreakUpComponent;
  let fixture: ComponentFixture<SpnaTotalContractValueBreakUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpnaTotalContractValueBreakUpComponent,LocalizationPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]),NgbTooltip],
      providers: [PriceEstimateService,PriceEstimateStoreService,VnextService,EaRestService 
        ,VnextStoreService,ProjectStoreService,  LocalizationService, DataIdConstantsService,CurrencyPipe,
        UtilitiesService,ProposalStoreService],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaTotalContractValueBreakUpComponent);
    component = fixture.componentInstance;
    component.selectedEnrollemnt = {priceInfo:{},pools: [{desc:'test', suites:[{}]}]}
    fixture.detectChanges();
  });

  it('should create', () => {
    //component.selectedEnrollemnt = {priceInfo:{},pools: [{desc:'test', suites:[{}]}]}
    expect(component).toBeTruthy();
  });

  it('should call expand', () => {
    let data = {expand:true};
    component.expand(data);
    expect(data.expand).toBe(false);
  });

  it('should call expandPool', () => {
    let data = {hide:true};
    component.expandPool(data);
    expect(data.hide).toBe(false);
  });

  it('should call selectPool', () => {
    let pool = {desc:'test', suites:[],priceInfo:{test: '123'}};
    component.selectPool(pool);
    expect(component.showDropMenu).toBe(false);
    expect(component.total).toEqual(pool.priceInfo);
  });
});
