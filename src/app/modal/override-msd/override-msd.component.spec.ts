import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { OverrideMsdComponent } from './override-msd.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { CurrencyPipe } from '@angular/common';
import { ConstantsService } from '@app/shared/services/constants.service';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { ActivatedRoute } from '@angular/router';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalSummaryService } from '@app/proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocaleService } from '@app/shared/services/locale.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { ListProposalService } from '@app/proposal/list-proposal/list-proposal.service';
import { of } from 'rxjs';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
declare let jQuery: any;

const BSmodalrefMock = {
  hide: jest.fn().mockReturnValue('hide')
}

const fakeActivatedRoute = {
    snapshot: { data: { } }
} 

describe('OverrideMsdComponent', () => {
  let component: OverrideMsdComponent;
  let fixture: ComponentFixture<OverrideMsdComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OverrideMsdComponent ],
      providers: [ { provide: BsModalRef, useValue: BSmodalrefMock },LocaleService, ProposalDataService, BlockUiService, CurrencyPipe, ConstantsService, CopyLinkService, PermissionService, UtilitiesService, ProposalPollerService, {provide: ActivatedRoute, useValue: fakeActivatedRoute}, AppDataService, AppRestService, MessageService, ProposalSummaryService, PriceEstimationService,
        CreateProposalService, QualificationsService,EaService,EaRestService, DealListService, TcoDataService, ListProposalService],
      imports: [HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverrideMsdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call decline', () => {
    component.decline();
    expect(BSmodalrefMock.hide).toHaveBeenCalled();
  });
  
  it('call globalSwitchChange', () => {
    let event;
    component.globalSwitchChange(event);
    expect(component.isDisableSlider).toBe(true);

    event = {
        data: {

        }
    }
    component.globalSwitchChange(event);
    expect(component.isDisableSlider).toBe(false);
  });
  
  it('call ngOnInit', () => {
    let appDataservice = fixture.debugElement.injector.get(AppDataService);
    appDataservice.overrideMsd = {
        "manualOverridenMSDSuiteCount": 1
    }
    component.ngOnInit();
    expect(component.manualOverrideMsd).toEqual(1);
  });
  
  it('call sliderChange', () => {
    let event = {
        min: 0,
        max: 100,
        from: 20,
        from_percent: 10,
        from_value:0,
        to:40,
        to_percent:100,
        to_value: 100  
    }
    const name = 'test';
    const id = '123'
    component.sliderChange(event, name, id);
    expect(component.inputSelected.nativeElement.value).toEqual('20');
  });
  
  it('call onValueChanged', () => {
    component.manualOverrideMsd = 0
    component.onValueChanged();
    expect(component.isDisableApply).toBe(true);
  });
  
  it('call setReadOnlyMode', () => {
    let appDataservice = fixture.debugElement.injector.get(AppDataService);
    appDataservice.roadMapPath = true;
    component.setReadOnlyMode();
    expect(component.isDisableApply).toBe(true);

    appDataservice.isReadWriteAccess = false;
    appDataservice.userInfo.roSuperUser = false;
    component.setReadOnlyMode();
    expect(component.isDisableApply).toBe(true);
  });

  it('call confirm', () => {
    let priceService = fixture.debugElement.injector.get(PriceEstimationService);
    component.globalView = true;
    component.manualOverrideMsd = true;
    let res = {
        data: {
        }
    }
    jest.spyOn(priceService, 'msdSuiteCountSubmit').mockReturnValue(of(res))
    component.confirm();
    expect(priceService.isEmitterSubscribe).toBe(true);
  });

  it('call inputValueChange',() => {
    let evnt = {
        target : {
            value: 100
        }
    }
    let name = 'test';
    let id ='123';
    component.simpleSlider = {
        min: 0,
        max: 100,
        from: 20,
        from_percent: 10,
        from_value:0,
        to:40,
        to_percent:100,
        to_value: 100  
    }
    component.inputValueChange(evnt, name, id);
  });

  
});
