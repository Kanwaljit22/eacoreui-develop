import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpIdDetailsComponent } from './bp-id-details.component';
import { RouterTestingModule } from '@angular/router/testing';

import { EaRestService } from 'ea/ea-rest.service';
import { of, Subject } from 'rxjs';

import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';

import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from 'vnext/project/project.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { SubsidiariesStoreService } from 'vnext/project/subsidiaries/subsidiaries.store.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
class MockEaRestService {
  postApiCall() { 
    return of({
      data: {
        page: {pageSize: 50, currentPage: 1, noOfPages: 1, noOfRecords: 13},
        partyDetails: [ {
          ADDRESS1: "STREET 1 DELMA",
          ADDRESS2: "ABU DHABI, UAE",
          CAV_BU_ID: "925699",
          CAV_ID: "390052",
          CITY: "ABU DHABI",
          COUNTRY: "AE",
          CR_PARTY_ID: "245491340",
          CR_PARTY_NAME: "EMIRATES DEFENSE INDUSTRIES",
          GU_ID: "245491340",
          HQ_BRANCH_IND: "HQ",
          POSTAL_CODE: "AUH",
          STATE: "ABU DHABI",
          THEATER: "EMEAR"
        }],
        selectedParties: ["245491340"]
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

  getApiCall(){
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

  downloadDocApiCall() {
    return of({
      data: {
      test: "test"
      },
      error: false
      })
  }
}

class MockProjectStoreService {
  projectData = {
    objId: "test",
  status: "test",
  deleted: false,
  locked: false,
  ordered: false,
  // deferLocc: false,
  // ciscoTeam?: ICiscoTeam;
  // customerInfo?: ICustomerInfo;
  // dealInfo?: IDealInfo;
  // loccDetail?: ILoccDetail;
  // partnerInfo?: IPartnerInfo;
  // partnerTeam?: IPartnerTeam;
  // initiatedBy?: IInitiatedBy;
  // scopeInfo?: IScopeInfo; 
  // smartAccount?: ISmartAccountInfo;
  subRefId: "test",
  changeSubscriptionDeal: false,
  // referrerQuotes?: Array<IReferrerQuotes>;
  // selectedQuote?:IReferrerQuotes;
  buyingProgram: "test",
  }

  currentBpId = {
    eaId: "test",
    eaIdSystem: "test",
    enrollmentCount: 1,
    suiteCount: 2
  }
}

describe('BpIdDetailsComponent', () => {
  let component: BpIdDetailsComponent;
  let fixture: ComponentFixture<BpIdDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpIdDetailsComponent, LocalizationPipe ],
      providers: [ProjectService, VnextStoreService, 
        ProposalStoreService,{provide:ProjectStoreService, useClass: MockProjectStoreService}, ProjectRestService, VnextService, UtilitiesService, CurrencyPipe, DataIdConstantsService,
        {provide: EaRestService, useClass: MockEaRestService},SubsidiariesStoreService , EaService,ConstantsService],
      imports: [HttpClientModule, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpIdDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngoninit', () => {
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('call close', () => {
    let projectService = fixture.debugElement.injector.get(ProjectService);
    component.close()
    expect(projectService.showBpIdDetails).toBeFalsy();
  });

  it('call downloadExcel', () => {
    let utilityService = fixture.debugElement.injector.get(UtilitiesService);
    const func = jest.spyOn(utilityService, 'saveFile')
    component.downloadExcel()
    expect(func).toHaveBeenCalled();
  });
 
  it('call getCavDetails', () => {
    const data = {
      error: true
    }
    let eaRestService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(eaRestService, 'getApiCall').mockReturnValue(of(data));
    let messageService = fixture.debugElement.injector.get(MessageService);
    component.getCavDetails()
    expect(messageService.disaplyModalMsg ).toBeTruthy();
  });
});
