import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { EaidStoreService } from 'vnext/eaid/eaid-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { ReviewChangeScopeSummaryComponent } from './review-change-scope-summary.component';
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
describe('ReviewChangeScopeSummaryComponent', () => {
  let component: ReviewChangeScopeSummaryComponent;
  let fixture: ComponentFixture<ReviewChangeScopeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewChangeScopeSummaryComponent,LocalizationPipe ],
      providers:[ MessageService,NgbActiveModal, LocalizationService,ProposalStoreService, ProjectStoreService, DataIdConstantsService,CurrencyPipe,  { provide: EaRestService, useClass: MockEaRestService }, VnextStoreService, VnextService,  EaidStoreService,  UtilitiesService, ConstantsService],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewChangeScopeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const response = {}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    expect(component).toBeTruthy();
  });
  it('should call close', () => {
    component.close();
    expect(component.dataNotPresent).toBe(true)
  });
  it('should call getReviewSummaryDetails', () => {
    const response = {buTrackers:[{}]}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getReviewSummaryDetails();
    expect(component.dataNotPresent).toBe(true)
  });
  
  it('should call getReviewSummaryDetails 1', () => {
    const response = {error:true}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getReviewSummaryDetails();
    expect(component.dataNotPresent).toBe(true)
  });
  it('should call downloadReport', () => {
    component.downloadReport();
    expect(component.dataNotPresent).toBe(true)
  });

});
