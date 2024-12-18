import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReuseableFilterComponent } from './reuseable-filter.component';
import { CreditOverviewService } from '../credits-overview/credit-overview.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ReuseableFilterService } from './reuseable-filter.service';

import { AppDataService } from '../services/app.data.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '../services/utilities.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRestService } from '../services/app.rest.service';
import { CurrencyPipe } from '@angular/common';
import { BlockUiService } from '../services/block.ui.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '../services/proposal-poller.service';
import { SearchPipe } from '../pipes/search.pipe';
import { of } from 'rxjs';
import { TcoDataService } from '@app/tco/tco.data.service';
import { MessageService } from '../services/message.service';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute

// const fakeReusableService = {
//   "filterObject" : {data: {type:'', filters: [{
//     value: ["1","2"]
//   }]}}
// }


describe('ReuseableFilterComponent', () => {
  let component: ReuseableFilterComponent;
  let fixture: ComponentFixture<ReuseableFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReuseableFilterComponent ],
      providers: [CreditOverviewService,PriceEstimationService,EaService,EaRestService, ReuseableFilterService , AppDataService, PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, TcoDataService, MessageService, LocaleService, ConstantsService, CreateProposalService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, QualificationsService],
      imports: [HttpClientModule, NgbAccordionModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuseableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call updatedByUser  ', () => {
    component.updatedByUser()
    expect(component.isUpdatedByUser).toBe(true);
  });

  it('call updateFilters for checkbox ', () => {
   let filtersData = {
      "displayName": "test",
      "inputType": "checkbox",
      "name":"test1",
      "operator": "In",
      "filters": [{
        "name": "test",
        "selected": false,
        "value": "12"
      }],
    };
    let item = {
      "name": "test",
      "selected": false,
      "value": "1"
    }
    let service = fixture.debugElement.injector.get(ReuseableFilterService)
    service.filterObject.data["filters"] = [{
      "name": "test",
      "value": ["1", "2"],

    }]
    let filter = new Map<string, any>()
    filter.set('test', {"value": "test", "valueInS": '1'})
    service.selectedFilterData = filter;
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);

    filtersData = {
      "displayName": "test",
      "inputType": "checkbox",
      "name": "test",
      "operator": "In",
      "filters": [{
        "name": "test",
        "selected": false,
        "value": "1"
      }],
    };
    item = {
      "name": "test",
      "selected": false,
      "value": "1"
    }
    service.filterObject.data["filters"] = [{
      "name": "test",
      "value": ["1", "2"],

    }]
    filter.set('test', {"value": ["1"], "valueInS": ['1']})
    service.selectedFilterData = filter;
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);

    filtersData = {
      "displayName": "test",
      "inputType": "checkbox",
      "name": "test",
      "operator": "In",
      "filters": [{
        "name": "test",
        "selected": false,
        "value": "1"
      }],
    };
    item = {
      "name": "test",
      "selected": false,
      "value": "2"
    }
    service.filterObject.data["filters"] = [{
      "name": "test",
      "value": ["1", "2"],

    }]
    filter.set('test', {"value": ["1"], "valueInS": ['1']})
    service.selectedFilterData = filter;
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);

    filtersData = {
      "displayName": "test",
      "inputType": "checkbox",
      "name": "test",
      "operator": "In",
      "filters": [{
        "name": "test",
        "selected": false,
        "value": "1"
      }],
    };
    item = {
      "name": "test",
      "selected": false,
      "value": "2"
    }
    service.filterObject.data["filters"] = [{
      "name": "test",
      "value": ["1", "2"],

    }]
    filter.set('test', {"value": ["1"], "valueInS": []})
    service.selectedFilterData = filter;
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);
  });


  it('call updateFilters for radio ', () => {
    let filtersData = {
       "displayName": "test",
       "inputType": "radio",
       "name":"test1",
       "operator": "In",
       "filters": [{
         "name": "test",
         "selected": false,
         "value": "12"
       }],
     };
     let item = {
       "name": "test",
       "selected": false,
       "value": "1"
     }
     let service = fixture.debugElement.injector.get(ReuseableFilterService)
     service.filterObject.data["filters"] = [{
       "name": "test",
       "value": ["1", "2"],
 
     }]
     let filter = new Map<string, any>()
     filter.set('test', {"value": "test", "valueInS": '1'})
     service.selectedFilterData = filter;
     component.updateFilters(filtersData,item, true)
     expect(item.selected).toEqual(true);

     service.filterObject.data["filters"] = [{
      "name": "test1",
      "value": ["1", "2"]
    }]
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);

    service.filterObject.data["filters"] = []
    component.updateFilters(filtersData,item, true)
    expect(item.selected).toEqual(true);
   });

   it('call updateFilters for date ', () => {
    component.isUpdatedByUser = true;
    const date = new Date()
    component.filterStartDate = date;
    component.filterEndDate = date;
    let filtersData = {
       "displayName": "test",
       "inputType": "date",
       "name":"test1",
       "operator": "In",
       "filters": [{
         "name": "test",
         "selected": false,
         "value": "12"
       }],
     };
     let item = {
       "name": "test",
       "selected": false,
       "value": "1"
     }
     let service = fixture.debugElement.injector.get(ReuseableFilterService)
     service.filterObject.data["filters"] = [{
       "name": "test",
       "value": ["1", "2"],
 
     }]
     component.updateFilters(filtersData,item, true)

    service.filterObject.data["filters"] = [{
      "name": "test1",
      "value": ["1", "2"],

    }]
    component.updateFilters(filtersData,item, true)

    service.filterObject.data["filters"] = []
    component.updateFilters(filtersData,item, true)

   });


   it('call convertValueToString', () => {
    let service = fixture.debugElement.injector.get(ReuseableFilterService)
    service.filterObject.data["filters"] = [{
      "value": ["1", "2"]
    }]
    component.convertValueToString();
  })

  it('call resetFilterData  ', () => {
    component.resetFilterData();
    expect(component.isUpdatedByUser).toBe(false)
  })

  it('call customeFilterDate  ', () => {
    const date = new Date()
    let filtersData = {
      "displayName": "test",
      "inputType": "date",
      "name":"test1",
      "operator": "In",
      "filters": [{
        "name": "test",
        "selected": false,
        "value": "12"
      }],
    };
    let item = {
      "name": "test",
      "selected": false,
      "value": "1"
    }
    let type = "start"
    component.customeFilterDate(date, type, filtersData, item, true);
    expect(component.filterStartDate).toEqual(date)

    type = "end";
    component.customeFilterDate(date, type, filtersData, item, true);
    expect(component.filterEndDate).toEqual(date)
  })
});
