import { CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { MigrateEligibleReasonsComponent } from './migrate-eligible-reasons.component';
class MockEaRestService {

  postApiCall() {
    return of({
      data: {      
           } 
      })
    }

  getApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  putApiCall(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }

  getApiCallJson(){
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}

describe('MigrateEligibleReasonsComponent', () => {
  let component: MigrateEligibleReasonsComponent;
  let fixture: ComponentFixture<MigrateEligibleReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
        declarations: [ MigrateEligibleReasonsComponent, LocalizationPipe ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        providers: [NgbActiveModal, EaService,
             VnextService, VnextStoreService, UtilitiesService, DataIdConstantsService,
             CurrencyPipe,ProposalStoreService, MessageService, LocalizationService, DataIdConstantsService,
               VnextService, EaService, UtilitiesService,  ProposalStoreService,ProjectStoreService,{provide : EaRestService, useClass: MockEaRestService}],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigrateEligibleReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getEnrollData ', () => {
    const response = {data: {enrollments: [{eligibleForMigration: true,pools:[{suites:[{notEligibleForMigrationReasons:[''],migrateToSuites:[{notEligibleForMigrationReasons:['']}]}]}]}]}}
    component.proposalStoreService.proposalData = {objId: '123'}
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, "getApiCall").mockReturnValue(of(response));
    component.getEnrollData();
  });
  it("should call close()", () => {
    const func = jest.spyOn(component.activeModal, "close");
    component.close();
    expect(func).toHaveBeenCalled();
  });
});
