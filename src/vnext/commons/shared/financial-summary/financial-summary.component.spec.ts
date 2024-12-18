import { ComponentFixture, TestBed,fakeAsync } from '@angular/core/testing';

import { FinancialSummaryComponent } from './financial-summary.component';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import {  IFinancial, ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { of } from 'rxjs';
import { LocalizationPipe } from '../pipes/localization.pipe';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}

class MockProposalRestService {
  getApiCall() {
    return of({
      data: {
    
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}

describe('FinancialSummaryComponent', () => {
  let component: FinancialSummaryComponent;
  let fixture: ComponentFixture<FinancialSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialSummaryComponent ,LocalizationPipe],

      imports: [HttpClientModule,RouterTestingModule],
      providers: [ PriceEstimateService, ProposalStoreService, UtilitiesService, CurrencyPipe,VnextStoreService,ProjectStoreService, DataIdConstantsService
       ,  { provide: ProposalRestService, useClass: MockProposalRestService }, VnextService, { provide: EaRestService, useClass: MockEaRestService }, LocalizationService,EaService, PriceEstimateStoreService,LocalizationPipe]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    
    const getFinancialSummary = jest.spyOn(component, 'getFinancialSummary')
    
    component.ngOnInit();
    expect(getFinancialSummary).toHaveBeenCalled();
});

it('should call getFinancialSummary', () => {
  const data = {'data': {

  }};
    const mockData = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(mockData, 'getApiCall').mockReturnValue(of(data))
    component.getFinancialSummary();
    expect(component.financialSummaryData).toBe(data.data);
});
it('should call getFinancialSummary error', () => {
  const data = {'error': true};
  let result  : IFinancial = {};
    const mockData = fixture.debugElement.injector.get(ProposalRestService);
    jest.spyOn(mockData, 'getApiCall').mockReturnValue(of(data))
    component.getFinancialSummary();
    //expect(component.financialSummaryData).toBe(result);
    expect(component.localizationKey).toBe('financial-summary');
});
});
