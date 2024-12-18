import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardProposalListComponent } from 'ea/ea-dashboard/dashboard-proposal-list/dashboard-proposal-list.component';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { DealProposalListComponent } from './deal-proposal-list.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { of } from 'rxjs';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
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
  getEampApiCall(){
    return of({
      data: {

      },
    });
  }
}
describe('DealProposalListComponent', () => {
  let component: DealProposalListComponent;
  let fixture: ComponentFixture<DealProposalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealProposalListComponent, LocalizationPipe,DashboardProposalListComponent],
      imports: [HttpClientModule, RouterTestingModule,NgbTooltipModule],
      providers: [EaStoreService,LocalizationService,{provide: EaRestService, useClass: MockEaRestService}, PriceEstimateService, ProposalStoreService, UtilitiesService, CurrencyPipe,VnextStoreService,ProjectStoreService
        , ProposalRestService, VnextService,EaService, PriceEstimateStoreService, DataIdConstantsService, ElementIdConstantsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealProposalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeFlyout', () => {
    let service = fixture.debugElement.injector.get(EaStoreService);
    component.closeFlyout();
    expect(service.showProposalsFromDeal).toBeFalsy();
    expect(service.projectId).toEqual('');
  });

  it('should call createProposal', () => {
    let service = fixture.debugElement.injector.get(EaStoreService)
    service.selectedDealData.projectObjId = '123';
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.createProposal();
    expect(call).toHaveBeenCalled();
    // expect((sessionStorage)).toHaveSize(1)
    expect(service.selectedDealData.projectObjId).toBeTruthy();
  });

  // it('should call createProposal', () => {
  //   let service = fixture.debugElement.injector.get(EaStoreService)
  //   service.selectedDealData.projectObjId = '';
  //   component.createProposal();
  //   expect(sessionStorage).toHaveSize(1)
  // });

  it('should call goToProject', () => {
    let service = fixture.debugElement.injector.get(EaStoreService)
    service.selectedDealData.projectObjId = 'test';
    window.open = function () { return window; }
    let call = jest.spyOn(window, "open");
    component.goToProject();
    expect(call).toHaveBeenCalled();
    expect(service.selectedDealData.projectObjId).toBeTruthy();
  });
});
