import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { FileUploadModule } from 'ng2-file-upload';
import { ClickOutsideModule } from 'ng4-click-outside';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ApplyDiscountComponent } from './apply-discount.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const discountArrMock =
    [
        {
            key: "subsDisc",
            max: 100,
            min: 42,
            name: "Subscription Discount",
            oldValue: 43.11,
            value: 43.11
        }, 
        {
            key: "servDisc",
            max: 100,
            min: 42,
            name: "Service Discount",
            oldValue: 58.36,
            value: 58.36
        }
    ]


let options: Options = {
    floor: 40,
    ceil: 100,
    maxLimit: 100,
    showTicksValues: true,
    step: 1,
    precisionLimit: 2, // limit to 2 decimal points
    enforceStepsArray: false, // set false to allow float values
    enforceStep: false, // set false to allow float values
    showTicks: true,
    noSwitching: true
  };

describe('ApplyDiscountComponent', () => {
  let component: ApplyDiscountComponent;
  let fixture: ComponentFixture<ApplyDiscountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, BrowserTestingModule, CommonModule,
            FormsModule,
            ReactiveFormsModule,
            BsDatepickerModule.forRoot(),
            FileUploadModule,
            NgxSliderModule,
            NgbTooltipModule],
      declarations: [ ApplyDiscountComponent ],
      providers : [NgbActiveModal, UtilitiesService, LocalizationService, ProposalStoreService, PriceEstimateStoreService, VnextService, VnextStoreService, EaRestService, EaStoreService, CurrencyPipe, DataIdConstantsService, ElementIdConstantsService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate after ngoninit', () => {
      component.allowApply = false;
      component.isFromHeaderLevel = false;
      component.discountArr = discountArrMock;
      const changeOptionsSpy = jest.spyOn(component, 'changeOptions');
      //const checkDiscountsForSuiteSpy = spyOn(component, 'checkDiscountsForSuite');
    component.ngOnInit();
    expect(changeOptionsSpy).toHaveBeenCalled();
   // expect(checkDiscountsForSuiteSpy).toHaveBeenCalled();
  });

  it('should check if discount not present and less than min -- set to old and value', () => {
    let data = discountArrMock[0];
    component.checkDiscountsForSuite(data);
    expect(component.allowApply).toBeFalsy();

    data.oldValue = undefined;
    component.checkDiscountsForSuite(data);
    expect(data.oldValue).toEqual(data.min);
    expect(component.allowApply).toBeTruthy();
  });

  it('should set options for slider, min and max value', () => {
    let data = discountArrMock[0];
    component.options = options;
    const checkAndSetTicksArraySpy = jest.spyOn(component, 'checkAndSetTicksArray');
    component.changeOptions(data);
    expect(checkAndSetTicksArraySpy).toHaveBeenCalled();
    expect(data['options']).toBeTruthy();
  });
  it('should inputValueChange', () => {
    let data = discountArrMock[0];
    const event = {preventDefault : ()=>{},target:{value: 43.11}}
    component.options = options;
    const checkAndSetTicksArraySpy = jest.spyOn(component, 'checkAndSetTicksArray');
    component.inputValueChange(event,data);
    //expect(checkAndSetTicksArraySpy).toHaveBeenCalled();
   // expect(data['options']).toBeTruthy();
  });

  it('should check min, max values and set ticksArray ', () => {
    let data = discountArrMock[0];
    let newOptions = {
        ceil: 100,
enforceStep: false,
enforceStepsArray: false,
floor: 42,
maxLimit: 100,
minLimit: 42,
noSwitching: true,
precisionLimit: 2,
showTicks: true,
showTicksValues: true,
step: 1
    }
    component.checkAndSetTicksArray(newOptions);
    expect(newOptions['ticksArray']).toBeTruthy();
  });

  it('should update when slider changes', () => {
    let data = discountArrMock[0];
    data['options'] = {
        ceil: 100,
enforceStep: false,
enforceStepsArray: false,
floor: 42,
maxLimit: 100,
minLimit: 42,
noSwitching: true,
precisionLimit: 2,
showTicks: true,
showTicksValues: true,
step: 1,
ticksArray: [42, 52, 62, 72, 82, 92, 100]
    }
    const isValueUpdatedSpy = jest.spyOn(component, 'isValueUpdated');
    component.sliderChange(45, data);
    expect(isValueUpdatedSpy).toHaveBeenCalled();
  });

  it('should update when slider changes', () => {
    let data = discountArrMock[0];
    data['options'] = {
        ceil: 100,
enforceStep: false,
enforceStepsArray: false,
floor: 42,
maxLimit: 100,
minLimit: 42,
noSwitching: true,
precisionLimit: 2,
showTicks: true,
showTicksValues: true,
step: 1,
ticksArray: [42, 52, 62, 72, 82, 92, 100]
    }
    data.value = 45
    component.isValueUpdated(data);
    expect(component.numberOfValueUpdated).toBeTruthy();

    // data.value = 43.11
    component.isValueUpdated(data);
    expect(component.numberOfValueUpdated).toBeTruthy();
  });

  it('call ngOnChanges on no Identifier', fakeAsync(() => {
    let utilitiesService = fixture.debugElement.injector.get(UtilitiesService);
    const mockEevent: Event = <Event><any>{
        target: {
            value: '45'   
        }
      };
    tick(1200); // causing issue due to timer in queue so added flush
    fixture.detectChanges();
    // on false identifier
    flush(); // in order to clear the timer 
  }));

  it('should set updated discount', () => {
      const mockEevent: Event = <Event><any>{
          target: {
              value: '45'
          }
      };
      let data = discountArrMock[0];
    data['options'] = {
        ceil: 100,
enforceStep: false,
enforceStepsArray: false,
floor: 42,
maxLimit: 100,
minLimit: 42,
noSwitching: true,
precisionLimit: 2,
showTicks: true,
showTicksValues: true,
step: 1,
ticksArray: [42, 52, 62, 72, 82, 92, 100]
    }
    const isValueUpdatedSpy = jest.spyOn(component, 'isValueUpdated');
    component.updateDiscount(mockEevent, data);
    expect(isValueUpdatedSpy).toHaveBeenCalled();
  });
  
  it('should set updated discount', () => {
    let dataArr = discountArrMock;
  options = {
      ceil: 100,
enforceStep: false,
enforceStepsArray: false,
floor: 42,
maxLimit: 100,
minLimit: 42,
noSwitching: true,
precisionLimit: 2,
showTicks: true,
showTicksValues: true,
step: 1,
ticksArray: [42, 52, 62, 72, 82, 92, 100]
  }
  dataArr[0]['options'] = options;
  dataArr[1]['options'] = options;
  component.discountArr = dataArr;
  component.applyDiscount();
  expect(component.allowApply).toBeFalsy();
});

});
