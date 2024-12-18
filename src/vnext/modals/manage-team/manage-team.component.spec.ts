import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { RouterTestingModule } from '@angular/router/testing';
import { VnextService } from 'vnext/vnext.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EaRestService } from 'ea/ea-rest.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ManageTeamComponent } from './manage-team.component';
import { CurrencyPipe } from '@angular/common';
import { of } from 'rxjs';
import * as exp from 'constants';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PartnerTeamComponent } from 'vnext/commons/shared/partner-team/partner-team.component';
import { CiscoTeamComponent } from 'vnext/commons/shared/cisco-team/cisco-team.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';

class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        test: "test"
      },
      error: false
    })
  }
  postApiCall() {
    return of({
      data:{
          responseDataList: [
              {
                  "test": "test"
              }
          ],
          proposals: [{
              "test": "test"
          }],
          page: {
              "test": "test"
          },
          totalRecords: 12,
          approver: true
      },
    })
  }
  getApiCallJson() {
    return of({
      data:[{
        showFilters: false
      }]
    })
}
}

describe('ManageTeamComponent', () => {
  let component: ManageTeamComponent;
  let fixture: ComponentFixture<ManageTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManageTeamComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [NgbActiveModal, {provide: EaRestService, useClass: MockEaRestService}, 
        ProjectStoreService, VnextService, VnextStoreService, UtilitiesService,
         CurrencyPipe,LocalizationPipe,ProposalStoreService, DataIdConstantsService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngOnInit method', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.ngOnInit();
    expect(projectStoreService.lockProject).toBe(false);
    // expect(component.showTeam).toBe(false);
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call ngOnDestroy method', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    component.ngOnDestroy();
    expect(projectStoreService.lockProject).toBe(true);
  });

  it('call getTeamData method', () => {
    let projectStroeService = fixture.debugElement.injector.get(ProjectStoreService);
    component.getTeamData();
    expect(projectStroeService.projectData).toBeTruthy();
    expect(component.showTeam).toBe(true);
  });
  it('call isAddRemove method', () => {
    component.isAddRemove(true);
    expect(component.addRemove ).toBeTruthy();
  });

});
