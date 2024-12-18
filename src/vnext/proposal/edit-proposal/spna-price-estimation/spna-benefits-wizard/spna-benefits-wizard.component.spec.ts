import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpnaBenefitsWizardComponent } from './spna-benefits-wizard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalService } from 'vnext/proposal/proposal.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { CurrencyPipe } from '@angular/common';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
import { PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';

describe('SpnaBenefitsWizardComponent', () => {
  let component: SpnaBenefitsWizardComponent;
  let fixture: ComponentFixture<SpnaBenefitsWizardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [ SpnaBenefitsWizardComponent, LocalizationPipe ],
      providers: [PriceEstimateService, PriceEstimateStoreService, ProposalStoreService, ProposalService, UtilitiesService, CurrencyPipe, ProposalRestService,
        VnextService, VnextStoreService, ProjectStoreService, Renderer2, EaRestService, DataIdConstantsService],
        schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpnaBenefitsWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on ngoninit', () => {
    component.ngOnInit();
    expect(component.benefitsArr.length).toBeGreaterThan(0);
  });

  it('should selectenrollment', () => {
    const value = {
      "name": "SECURITY",
      "active": false
    }
    component.selectEnrollment(value);
    expect(component.benefitsArr.length).toBeGreaterThan(0);
  });
});
