import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ServicesSuitesCellComponent } from './services-suites-cell.component';
import { PriceEstimateService } from "vnext/proposal/edit-proposal/price-estimation/price-estimate.service";
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { EaService } from 'ea/ea.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { CurrencyPipe } from "@angular/common";
import { EaRestService } from 'ea/ea-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

describe('ServicesSuitesCellComponent', () => {
  let component: ServicesSuitesCellComponent;
  let fixture: ComponentFixture<ServicesSuitesCellComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServicesSuitesCellComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbModalModule, HttpClientModule, RouterTestingModule, CurrencyPipe ],
      providers: [
        PriceEstimateService,
        PriceEstimateStoreService,
        ProposalRestService,
        VnextService,
        ProposalStoreService,
        UtilitiesService,
        EaService,
        VnextStoreService,
        DataIdConstantsService,
        LocalizationService,
        CurrencyPipe,
        EaRestService,
        ConstantsService,
        ProjectStoreService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesSuitesCellComponent);
    component = fixture.componentInstance;
    const paramsMock = {
        data: {
          tiers: [{ name: 'Test Tier', selected: true, hasEmbeddedHwSupport: true, alaCartCoverageFound: true }],
          ato: 'TestATO',
          pidType: 'TestPIDType',
          pidName: 'TestPIDName',
          hasPids: true,
          lowerTierAto: { name: 'LowerATO' }
        },
        node: {
          expanded: true,
          level: 2,
          parent: { data: { cxHwSupportOptedOut: false } }
        },
        showDropdown: false,
        placement: ''
      };
    component.agInit(paramsMock);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize params in agInit', () => {
    expect(component.selectedTier.name).toBe('Test Tier');
  });

  it('should update toast message state when updateCxTier is called', () => {
    const spy = jest.spyOn(component.priceEstimateService.addMoreSuitesFromGrid, 'next');
    component.updateCxTier();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should set placement to bottom when openDrop is called and there is space', () => {
    const event = { clientY: 100 };
    component.openDrop(event, component.params);
    expect(component.params.placement).toBe('bottom');
  });

  it('should set placement to top when openDrop is called and there is no space', () => {
    const event = { clientY: window.innerHeight - 50 };
    component.params.node.expanded = false;
    component.openDrop(event, component.params);
    expect(component.params.placement).toBe('top');
  });
  it('should return true if isMultiSuiteDiscount is called with a valid multiProgramDesc', () => {
    component.params.data.multiProgramDesc = { med: true };
    expect(component.isMultiSuiteDiscout()).toBeTruthy();
  });
  it('should return false if isMultiSuiteDiscount is called with an invalid multiProgramDesc', () => {
    component.params.data.multiProgramDesc = null;
    expect(component.isMultiSuiteDiscout()).toBeFalsy();
  });
});
