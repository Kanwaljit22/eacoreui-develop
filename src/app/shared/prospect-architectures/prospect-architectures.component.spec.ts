import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProspectArchitecturesComponent } from './prospect-architectures.component';
import { AppDataService } from '../services/app.data.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { CurrencyPipe } from '@angular/common';
import { BlockUiService } from '../services/block.ui.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '../services/proposal-poller.service';
import { SearchPipe } from '../pipes/search.pipe';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { of } from 'rxjs';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { AppRestService } from '../services/app.rest.service';
import { UtilitiesService } from '../services/utilities.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { PermissionService } from '@app/permission.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from '../services/message.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FiltersService } from '@app/dashboard/filters/filters.service';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute

describe('ProspectArchitecturesComponent', () => {
  let component: ProspectArchitecturesComponent;
  let fixture: ComponentFixture<ProspectArchitecturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectArchitecturesComponent ],
      providers: [LocaleService,
         UtilitiesService,
         ConstantsService,
       AppDataService,
        ProductSummaryService,
       QualificationsService,  PriceEstimationService, PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, LocaleService, ConstantsService, CreateProposalService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, QualificationsService,TcoDataService, MessageService,FiltersService],
       imports: [HttpClientModule,  RouterTestingModule.withRoutes([
        { path: "prospect-details", redirectTo: "" }, { path: "../allArchitectureView", redirectTo: "" }])],
       schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectArchitecturesComponent);
    component = fixture.componentInstance;
    component.prospectDetailsData = {
      "prospectName" : "test",
      "archCount": 1,
      "archs": "Cisco DNA",
      "archsDetail": [
        {
            "archId": "C1_DNA",
            "name": "Cisco DNA"
        }
      ]
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call goToProspectDetailsSuite ', () => {
    let prospectObj = {
        "prospectName" : "test",
        "archCount": 1,
        "archs": "Cisco DNA",
        "archsDetail": [
          {
              "archId": "C1_DNA",
              "name": "Cisco DNA"
          }
        ]
    }
    let appDataService =  fixture.debugElement.injector.get(AppDataService);
    appDataService.isFavorite = false;
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToProspectDetailsSuite(prospectObj);
  });

  it('call switchCustomer ', () => {
    component.prospectDetailsData = {
        "prospectName" : "test",
        "archCount": 1,
        "prospectKey": "test",
        "archs": "Cisco DNA",
        "archsDetail": [
          {
              "archId": "C1_DNA",
              "name": "Cisco DNA"
          }
        ]
    }
    component.switchCustomer();
    expect(component.isSwitched).toBe(true)
  });

  it('call goToAllArchView ', () => {
    component.prospectDetailsData = {
        "prospectName" : "test",
        "archCount": 1,
        "prospectKey": "test",
        "archs": "Cisco DNA",
        "archsDetail": [
          {
              "archId": "C1_DNA",
              "name": "Cisco DNA"
          }
        ]
    }
    let appDataService =  fixture.debugElement.injector.get(AppDataService);
    appDataService.isFavorite = false;
    let productSummaryService =  fixture.debugElement.injector.get(ProductSummaryService);
    productSummaryService.prospectInfoObject = {
      architecture: 'C1_DNA', sort: {}, filter: {}, page: {}
    }
    let val: Promise<true>;
    jest.spyOn(component["router"], 'navigate').mockReturnValue(val);
    component.goToAllArchView();
    expect(appDataService.customerName).toEqual('test')
  });
});
