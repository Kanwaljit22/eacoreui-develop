import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DealListService } from '@app/dashboard/deal-list/deal-list.service';
import { PermissionService } from '@app/permission.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { SharedModule } from '@app/shared';
import { CopyLinkService } from '@app/shared/copy-link/copy-link.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageService } from '@app/shared/services/message.service';
import { ProposalPollerService } from '@app/shared/services/proposal-poller.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { SliderWithInputComponent } from '@app/shared/slider-with-input/slider-with-input.component';
import { TcoDataService } from '@app/tco/tco.data.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ClickOutsideModule } from 'ng4-click-outside';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DiscountsModalComponent } from './discounts.component';
import { IonRangeSliderComponent } from '@app/shared/ion-range-slider/ion-range-slider.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const NgbActiveModalMock = {
   close: jest.fn().mockReturnValue('close')
  }

describe.skip('DiscountsModalComponent', () => {
  let component: DiscountsModalComponent;
  let fixture: ComponentFixture<DiscountsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
            HttpClientModule, HttpClientTestingModule, RouterTestingModule, BrowserTestingModule, CommonModule,FormsModule, MultiselectDropdownModule, AgGridModule, ClickOutsideModule, NgxSliderModule
          ],
      declarations: [ DiscountsModalComponent,SliderWithInputComponent, IonRangeSliderComponent ],
      providers: [AppDataService, CopyLinkService, PriceEstimationService, MessageService, { provide: NgbActiveModal, useValue: NgbActiveModalMock }, NgbModal, ProposalDataService, ConstantsService, LocaleService, AppRestService, BlockUiService, PermissionService, UtilitiesService, CurrencyPipe, ProposalPollerService, CreateProposalService, QualificationsService, DealListService, TcoDataService, BsModalRef ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsModalComponent);
    component = fixture.componentInstance;
    component.clickedSuiteId=1
    component.suiteId=1
    component.priceEstimationService.suiteDiscounts=[{suiteId:1,suiteName:"Networking"}]
    component.discountParams=component.priceEstimationService.suiteDiscounts[0]
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set data on ngonInit', () => {
    component.ngOnInit();``
    expect(component.sliders.length).toBeTruthy();
  });

  it('should set data on ngonInit', () => {
    let priceEstimationService = fixture.debugElement.injector.get(PriceEstimationService);
    priceEstimationService.discountsOnSuites.subscriptionDiscount = '45'
    component.onValueChanged();
    expect(component.isDisableApply).toBeFalsy();
  });

  // it('should confirm changes', () => {
  //   let priceEstimationService = fixture.debugElement.injector.get(PriceEstimationService);
  //   component.confirm();
  //   expect(priceEstimationService.isContinue).toBeFalsy();
  // });
});
