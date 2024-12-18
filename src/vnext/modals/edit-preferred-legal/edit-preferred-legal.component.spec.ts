import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditPreferredLegalComponent } from './edit-preferred-legal.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { CurrencyPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const NgbActiveModalMock = {
  close: jest.fn().mockReturnValue('close')
}

const testData  = {
  data: {
    dealInfo: {
      id:'11111'
    }
  },
  error: false
  }

class MockEaRestService {

  getApiCall(url){
    return of(testData)
  }

  putApiCall(){
    return of(testData)
  }

  getApiCallJson(url){
    return of(testData)
  }

  postApiCall() {
    return of(testData);
  }
}

const countryData = {
  data: {
    countries: [{
      "countryName": "test",
      "isoCountryAlpha2": "test"
    }]
  }
}

class MockProposalRestService {

  getApiCall(url){
    return of(countryData)
  }

  putApiCall(){
    return of(testData)
  }
}


describe('EditPreferredLegalComponent', () => {
  let component: EditPreferredLegalComponent;
  let fixture: ComponentFixture<EditPreferredLegalComponent>;
  let eaRestService = new MockEaRestService();
  let proposalRestService = new MockProposalRestService();


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPreferredLegalComponent, LocalizationPipe ],
      providers: [LocalizationService, DataIdConstantsService, VnextService, ProjectStoreService, { provide: EaRestService, useValue: eaRestService }, MessageService, EaService, BlockUiService, { provide: NgbActiveModal, useValue: NgbActiveModalMock}, VnextStoreService, UtilitiesService, CurrencyPipe, ProposalStoreService,{ provide: ProposalRestService, useValue: proposalRestService}, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPreferredLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngoninit ', () => {
    let vNextStoreService = fixture.debugElement.injector.get(VnextStoreService);
    vNextStoreService.loccDetail = {
      customerContact : {
        id: '1',
        preferredLegalName : 'test',
        preferredLegalAddress : {
          addressLine1 : 'test',
          country : 'USA',
          state : 'CA',
          city : 'test',
          zip : '1234'
        }
      }
    }
    component.ngOnInit()
    expect(component).toBeTruthy();
  });

  it('call close method', () => {
    let ngbActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    const closeMethod = jest.spyOn(ngbActiveModal, 'close');
    component.close();
     expect(closeMethod).toHaveBeenCalled();
  });

  it('call updateLoccCustomerContact ', () => {
    let vNextStoreService = fixture.debugElement.injector.get(VnextStoreService);
    vNextStoreService.loccDetail = {
      customerContact : {
        repName: "test",
        repTitle: "Mr",
        repFirstName: 'test',
        repLastName: 'test',
        repEmail: "test@yopmail.com",
        phoneCountryCode: '112',
        phoneNumber: '121322',
        dialFlagCode: '2123',
        id: '1',
        preferredLegalName : 'test',
        preferredLegalAddress : {
          addressLine1 : 'test',
          country : 'USA',
          state : 'CA',
          city : 'test',
          zip : '1234'
        }
      }
    }
    component.form.setValue({'custPreferredName':'test',
    addressLine1 : 'test',
    addressLine2: 'test1',
    country : 'USA',
    state : 'CA',
    city : 'test',
    zip : '1234'
  })
  component.page = 'locc';
  let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
  projectStoreService.projectData = {
    buyingProgram: 'EA3.0',
    partnerInfo: {
      beGeoId: 122343
    },
    customerInfo: {
      customerGuId :111
    }
  }
  component.updateLoccCustomerContact()
  });

  it('call getCountriesListData ', () => {
  let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
  projectStoreService.projectData = {
    objId: 'test',
    buyingProgram: 'EA3.0',
    partnerInfo: {
      beGeoId: 122343
    },
    customerInfo: {
      customerGuId :111
    }
  }
  const response = { data: {
    countries: [{
      "countryName": "test",
      "isoCountryAlpha2": "test"
    }]
  }} 
  let proposalRestService = fixture.debugElement.injector.get(ProposalRestService);
  jest.spyOn(proposalRestService, "getApiCall").mockReturnValue(of(response));
  component.getCountriesListData()
  });

  it('call onCountryChange ', () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
      projectStoreService.projectData = {
        objId: 'test',
        buyingProgram: 'EA3.0',
        partnerInfo: {
          beGeoId: 122343
        },
        customerInfo: {
          customerGuId :111
        }
      }
    const country = {
        "countryName": "test",
        "isoCountryAlpha2": "test"
      }
    component.onCountryChange(country)
    });

  it('call onStateChange ', () => {
    let stateObj = {
        "state": "test"
      }
      let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
      projectStoreService.projectData = {
        objId: 'test',
        buyingProgram: 'EA3.0',
        partnerInfo: {
          beGeoId: 122343
        },
        customerInfo: {
          customerGuId :111
        }
      }
    component.onStateChange(stateObj)
    });
});
