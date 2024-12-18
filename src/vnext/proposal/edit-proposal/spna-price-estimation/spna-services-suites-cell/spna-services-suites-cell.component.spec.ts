import { ComponentFixture, TestBed } from '@angular/core/testing';



import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { EaService } from 'ea/ea.service';
import { MessageService } from 'vnext/commons/message/message.service';

import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { EaRestService } from 'ea/ea-rest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { SpnaServicesSuitesCellComponent } from './spna-services-suites-cell.component';
import { PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
import { QuestionnaireStoreService } from '../../price-estimation/questionnaire/questionnaire-store.service';
import { QuestionnaireService } from '../../price-estimation/questionnaire/questionnaire.service';


describe('SpnaServicesSuitesCellComponent', () => {
  let component: SpnaServicesSuitesCellComponent;
  let fixture: ComponentFixture<SpnaServicesSuitesCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpnaServicesSuitesCellComponent, LocalizationPipe ],
      providers: [ PriceEstimateStoreService,PriceEstimateService,  LocalizationService, DataIdConstantsService, VnextService, ProposalStoreService, QuestionnaireStoreService, QuestionnaireService, ConstantsService, EaService, MessageService, VnextStoreService, ProjectStoreService, UtilitiesService,CurrencyPipe,EaRestService,  ProposalRestService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpnaServicesSuitesCellComponent);
    component = fixture.componentInstance;
    component.params = {data:{},node:{}}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call agInit', () => {
    component.priceEstimateService.updatedTiresMap = new Map()
    component.priceEstimateService.messageMap = new Map()
    component.priceEstimateService.messageMap.set('ATO-test',new Set('test is a test message'))
    component.priceEstimateService.updatedTiresMap.set('',[])
    const params = {data: {lowerTierAto:'test',ato:'test',tiers:[{hasEmbeddedHwSupport:true}]}}
    component.eaService.features.FIRESTORM_REL = true
    component.agInit(params)
    expect(component.selectedTier).toBeTruthy();
  });
  it('should call updateCxTier', () => {
    component.updateCxTier()
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call configure', () => {
    const data = {}
    component.priceEstimateStoreService.externalConfigReq = {configure:[{ato:''}]}
    component.configure(data)
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call openDrop', () => {
    const params = {node:{},data: {lowerTierAto:'test',ato:'test',tiers:[{hasEmbeddedHwSupport:true}]}}
    const event = {clientY:10}
    component.priceEstimateStoreService.externalConfigReq = {configure:[{ato:''}]}
    component.openDrop(event,params)
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call isMultiSuiteDiscout', () => {
    component.isMultiSuiteDiscout()
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call isMultiSuiteDiscout 1', () => {
    component.params = {node:{},data: {multiProgramDesc:{mpd:20},lowerTierAto:'test',ato:'test',tiers:[{hasEmbeddedHwSupport:true}]}}

    component.isMultiSuiteDiscout()
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call refresh', () => {
    component.refresh()
    expect(component.showDropdown).toBeFalsy();
  });
  it('should call cxApplyDiscount', () => {
    const data ={}
    component.cxApplyDiscount(data)
    expect(component.showDropdown).toBeFalsy();
  });
});
