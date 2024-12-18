import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonRangeSliderCallback, IonRangeSliderComponent } from '@app/shared/ion-range-slider/ion-range-slider.component';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cx-discount-parameters',
  templateUrl: './cx-discount-parameters.component.html',
  styleUrls: ['./cx-discount-parameters.component.scss']
})
export class CxDiscountParametersComponent implements OnInit {
  @ViewChild('sliderElement', { static: true }) sliderElement: IonRangeSliderComponent;
  @ViewChild('inputSelected', { static: false }) inputSelected: ElementRef;
  simpleSlider: any;
  cxPeData : any;
  cxSuiteDiscounts: any = []; // to set cxSuite Discounts(HW/SW)
  numberOfValueUpdated = 0;
  oldValue: any = '';
  lineLevelDiscountUpdated = false;
  displayHWSupportOption = false;
  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    precisionLimit: 2, // limit to 2 decimal points
    enforceStepsArray: false, // set false to allow float values
    enforceStep: false, // set false to allow float values
    showTicks: true,
    showOuterSelectionBars: true,
    showTicksValues: true,
    ticksArray: [0, 20, 40, 60, 80, 100],
    noSwitching: true,
    onlyBindHandles: true
  }

  constructor(public activeModal: NgbActiveModal, public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.cxSuiteDiscounts = this.setCxDiscounts(this.cxPeData);
    if (this.cxSuiteDiscounts) {
      
      const newOptions: Options = Object.assign({}, this.options);
      
      this.cxSuiteDiscounts.forEach(item => {
        // Major Line
        newOptions.minLimit = item.minDiscount;

        // Minor Line
        if(item.minorRow && item.minorRow.length){
          item.minorRow.forEach(minorItem=>{
            newOptions.minLimit = minorItem.minDiscount;
            minorItem['options'] = newOptions;
          })
        }

        // Creating dynamic Options for ngx-slider
        item['options'] = newOptions;
      })
    }
    
    
    this.simpleSlider = {
      type: "double",
      min: 0,
      max: 100,
      grid: true,
      grid_num: 5, from_fixed: true
    }
  }

  close() {
    this.activeModal.close({
      data : ''
    });
  }

  //  method to set cxDiscounts for suite
  setCxDiscounts(data) {
    let cxMajorLineDisocunts = [];
    let minorRow = [];
    let majorLineMinDiscount = 0;
    let minorLineMaxHwDiscount = 0; // to set major line hw support discount 
    let majorLineSwDiscount = 0; // to set major line sw support discount
    let swSupportCount = 0; // to set number of solution/SW support lines present
    if (data.children) {
      const children = data.children;
      for (const childData of children) {
        if (childData.productType === "CX_HW_SUPPORT" && childData.qty) { // if hW support type push the data to minor row
          minorRow.push({ "name": childData.description, 'id': childData.name, "type": "minor", "minDiscount": childData.minDiscount, "discountPerFrom": childData.minDiscount,"intialDiscount":childData.discount ? childData.discount : childData.minDiscount, "discountPerTo": childData.discount ? childData.discount : childData.minDiscount, "selectedValue": childData.discount ? childData.discount : childData.minDiscount, "maxDiscount": childData.maxDiscount,'updatedValue':false });
          this.displayHWSupportOption = true;

          // // if weightedAvgDiscount present set it to Major line HW support discount 
          if (!majorLineMinDiscount && childData.weightedAvgDiscount){
            majorLineMinDiscount = childData.weightedAvgDiscount;
            minorLineMaxHwDiscount = childData.weightedAvgDiscount;
          }

          // // check for discount value fo minor lines and set the max value to major line HWDiscount
          // if (majorLineMinDiscount < childData.minDiscount) {
          //   majorLineMinDiscount = childData.minDiscount;
          // }

          // // check for discount value fo minor lines and set the max value to major line HWDiscount
          // if (minorLineMaxHwDiscount < (childData.discount ? childData.discount : childData.minDiscount)) {
          //   minorLineMaxHwDiscount = (childData.discount ? childData.discount : childData.minDiscount);
          // }
        } else if (childData.productType === "CX_SOLUTION_SUPPORT" && childData.qty){ // check for sw support lines and get discount for software support major lone
          swSupportCount++; // increase count if present
          if (majorLineSwDiscount < (childData.discount ? childData.discount : childData.minDiscount)) {
            majorLineSwDiscount = (childData.discount ? childData.discount : childData.minDiscount);
          }
        }
      }
    }
    cxMajorLineDisocunts.push({ 'name': 'Hardware Support', 'suitId': data.suiteId, 'type': 'major', 'minDiscount': majorLineMinDiscount, 'discountPerFrom': minorLineMaxHwDiscount, 'intialDiscount':majorLineMinDiscount,'discountPerTo': majorLineMinDiscount, 'selectedValue': majorLineMinDiscount, 'maxDiscount': data.maxDiscount, 'minorRow': minorRow,'updatedValue':false });
    // check and set SW support in apply discount if Solution support lines are present
    if (swSupportCount > 0){
      cxMajorLineDisocunts.push({ 'name': 'Software Support', 'suitId': data.suiteId, 'type': 'major', 'minDiscount': data.minDiscount, 'discountPerFrom': data.minDiscount, 'intialDiscount':majorLineSwDiscount,'discountPerTo': majorLineSwDiscount, 'selectedValue': majorLineSwDiscount, 'maxDiscount': data.maxDiscount,'updatedValue':false });
    }
    return cxMajorLineDisocunts;
  }

  // method to set value when slider changes 
  sliderChange(changeContext: ChangeContext, data) {
    this.oldValue = data.discountPerTo;
    // check and set the selected value not greater than maxDiscount & less than minDiscount
    if (changeContext.highValue < data.minDiscount){
      changeContext.highValue = data.minDiscount;
    } else if (changeContext.highValue > data.maxDiscount){
      changeContext.highValue = data.maxDiscount;
    }
    this.setDiscountApplied(data, changeContext.highValue); // method to set selected discount   
  }

  // method to set value when changes from input
  inputValueChange(event: any, data) {
    this.oldValue = data.discountPerTo;
    
    setTimeout(() => {
      if (!this.utilitiesService.isNumberKey(event)) {
        event.target.value = "";
      }
      if (event.target.value) {
        if ( +event.target.value > data.maxDiscount) {
          event.target.value = data.maxDiscount;
        } 
      }      
      if(+event.target.value >= data.minDiscount){
        this.setDiscountApplied(data, +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value)));// method to set selected discount
      }
    }, 1500);
  }

  checkMinValue(event: any, data){
    if (!event.target.value || +event.target.value < data.minDiscount) {
      event.target.value = data.selectedValue; 
    }
   
  }
  // method to set selected discount
  setDiscountApplied(data, value) {
    
    data.discountPerTo = data.selectedValue = value;
    if ((this.oldValue !== data.selectedValue) && data.minorRow) {
      for (const line of data.minorRow) {
        this.isValueUpdated(data.minorRow,value);
        line.discountPerTo = line.selectedValue = data.selectedValue;
      }
      this.lineLevelDiscountUpdated = true;
    }
    if (data.type === 'minor') {
      this.lineLevelDiscountUpdated = true;
    }
    this.isValueUpdated(data,value);
    // if (this.oldValue !== data.selectedValue) {
    //   this.disableSave = false;
    // }
    
  }


  isValueUpdated(data,newValue){
    if(+data.intialDiscount !== newValue && !data.updatedValue){
      this.numberOfValueUpdated++;
      data.updatedValue = true;
    }   
    if(this.numberOfValueUpdated && +data.intialDiscount === newValue && data.updatedValue ){
      this.numberOfValueUpdated--;
      data.updatedValue = false;
    }
  }

  applyDiscount(){
    const requestObj = {}
    const linesDiscount = [];
    for(let i = 0; i < this.cxSuiteDiscounts.length; i++){
      const majorLine = this.cxSuiteDiscounts[i]
      if(majorLine.name === 'Hardware Support'){
        if(majorLine.minorRow){
          
          for(let j = 0; j < majorLine.minorRow.length; j++){
            const minorRow = majorLine.minorRow[j];
            linesDiscount.push({'subscriptionServiceDiscount': minorRow.selectedValue, 'productName': minorRow.id})
          }
        }
      } else {
        requestObj['subscriptionServiceDiscount']  = majorLine.selectedValue;
      }
      requestObj['suiteId']  = majorLine.suitId;
    }
    requestObj['linesDiscount'] = linesDiscount;
    requestObj['lineLevelDiscountUpdated']  = this.lineLevelDiscountUpdated;
    this.activeModal.close({
      data: requestObj
    });
  }
}
