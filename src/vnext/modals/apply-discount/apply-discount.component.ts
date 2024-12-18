import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { PriceEstimateStoreService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-apply-discount',
  templateUrl: './apply-discount.component.html',
  styleUrls: ['./apply-discount.component.scss']
})
export class ApplyDiscountComponent implements OnInit {
  discountArr = []; // set discounts array to show on modal
  options: Options = {
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
  numberOfValueUpdated = 0; // set number of discounts present when changed values
  isFromHeaderLevel = false; // set if modal called from header level(PE page)
  allowApply = false; // set if discount is not present for suite level initially
  timer: any;
  isCollabSuite = false;
  constructor(public activeModal: NgbActiveModal, public proposalStoreService: ProposalStoreService, public utilitiesService: UtilitiesService, public localizationService:LocalizationService, private eaService: EaService, public priceEstimateStoreService: PriceEstimateStoreService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService ) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('apply-discount');
    if(this.priceEstimateStoreService.selectedEnrollment.id === 4 && !this.isFromHeaderLevel){
      this.isCollabSuite = true;
    } else {
      this.isCollabSuite= false;
    }
    this.allowApply = false;
    for (const data of this.discountArr) {
      this.changeOptions(data);
      if (!data.options) {
        data['options'] = this.options;
      }
      // check discount for suit level
      if (!this.isFromHeaderLevel && !this.allowApply){
        this.checkDiscountsForSuite(data);
      }
    }
  }

  // check if discount not present and less than min -- set to old and value
  checkDiscountsForSuite(data){
    if (data.oldValue === undefined || data.oldValue < data.min){
      data.oldValue = data.min;
      data.value = data.min;
      if (data.min){ // if min present allow apply
        this.allowApply = true;
      }
    }
  }

  // method to set options for slider, min and max value
  changeOptions(data) {
    const newOptions: Options = Object.assign({}, this.options);
    newOptions.minLimit = data.min;
    newOptions.floor = data.min;
    newOptions.maxLimit = data.max;
    newOptions.ceil = data.max;
    this.checkAndSetTicksArray(newOptions); // set ticksValue array
    data['options'] = newOptions;
  }

  // check min, max values and set ticksArray 
  checkAndSetTicksArray(newOptions) {
    let ticksArray = [];
    // check and set values in array by increasing 10 
    for (let i = newOptions.minLimit; i < newOptions.maxLimit; i = i+10){
      ticksArray.push(i)
    }
    // check last element of array and set maxlimit
    if (ticksArray[ticksArray.length - 1] !== newOptions.maxLimit){
      ticksArray.push(newOptions.maxLimit)
    }
    newOptions.ticksArray = ticksArray;
  }

  close() {
    this.activeModal.close({continue : false});
  }

  // method for when slider changes 
  sliderChange(value, data) {
    this.isValueUpdated(data);
  }


  // set updated discount
  updateDiscount(event, data) {
    if (!event.target.value || +event.target.value < data.options.minLimit) {
      event.target.value = data.options.minLimit; 
    } else if (+event.target.value > data.options.maxLimit){
      event.target.value = data.options.maxLimit; 
    }
    event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value))
    data.value = event.target.value;
    this.isValueUpdated(data);
  }

  // method to apply discount
  applyDiscount() {

    const discountReq = {
    }

    // check for discounts and send in while modal close
    for (const data of this.discountArr) {
      discountReq[data.key] = data.value;
    }
    this.allowApply = false;
    // {subscriptionDiscount: 60,
    this.activeModal.close({
    //   serviceDiscount: 50}
      continue : true,
      discount : discountReq
    });
  }

  // check and set apply button disable if value changes
  isValueUpdated(data) {
    if (+data.value !== data.oldValue && !data.updatedValue) {
      this.numberOfValueUpdated++;
      data.updatedValue = true;
    }
    if (this.numberOfValueUpdated && +data.value === data.oldValue && data.updatedValue) {
      this.numberOfValueUpdated--;
      data.updatedValue = false;
    }
  }

  // method to set value when changes from input
  inputValueChange(event: any, data) {
    clearTimeout(this.timer); // clear the settimeout

    if (!this.utilitiesService.isNumberKey(event)) {//allow decimal also...
      event.preventDefault();
      event.target.value = data.value;
      return;
    }
    this.timer = setTimeout(() => {
      this.updateDiscount(event, data);
    }, 1200);
  }

  }
