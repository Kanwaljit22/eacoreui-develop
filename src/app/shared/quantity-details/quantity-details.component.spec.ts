import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuantityDetailsComponent } from './quantity-details.component';
import { GuideMeService } from '../guide-me/guide-me.service';
import { MessageService } from '../services/message.service';
import { AppDataService } from '../services/app.data.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';

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
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { of } from 'rxjs';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { StringToHtmlPipe } from '../pipes/string-to-html.pipe';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute

class PriceEstimationServiceMock {
  sendTcvReport(reqJSON) {
      return of({error: false});
  }
  sendIbaReport(reqJSON) {
      return of({error: false});
  }
  getCustomerIBReport(reqJSON) {
      return of({error: false});
  }
}

class GuideMeServiceMock{
  getGuideMeData(){
    return of({
      data: {}
    });
  }
}

describe('QuantityDetailsComponent', () => {
  let component: QuantityDetailsComponent;
  let fixture: ComponentFixture<QuantityDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityDetailsComponent , StringToHtmlPipe],
      providers: [{provide :GuideMeService, useClass:GuideMeServiceMock}, MessageService, AppDataService,EaService,EaRestService,{provide: PriceEstimationService, useValue: PriceEstimationServiceMock} , PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, LocaleService, ConstantsService, CreateProposalService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, QualificationsService,TcoDataService, StringToHtmlPipe ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('call ngOnInit', () => {
  //   let res = {
  //     "data" : {
  //         "features" : [{
  //           "description": 'test'
  //         }
  //         ]
  //     }
  //   }
  //   let guideMeService = fixture.debugElement.injector.get(GuideMeService);
  //   jest.spyOn(guideMeService, 'getGuideMeData').mockReturnValue(of(res))
  //   component.ngOnInit();
  //   expect(component).toBeTruthy();
  // });


  it('call hideDetails', () => {
    let priceService = fixture.debugElement.injector.get(PriceEstimationService);
   component.hideDetails();
   expect(priceService.showEAQuantity).toBe(false);
  })

  // it('call hideEAQuantity', () => {
  //   let priceService = fixture.debugElement.injector.get(PriceEstimationService);
  //  component.hideEAQuantity();
  //  expect(priceService.showEAQuantity).toBe(false);
  // })
});
