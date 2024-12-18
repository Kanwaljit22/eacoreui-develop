import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-services-discount',
  templateUrl: './services-discount.component.html',
  styleUrls: ['./services-discount.component.scss']
})
export class ServicesDiscountComponent implements OnInit {

  simpleSlider: any;
  cxPeData: any;
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
  timer: any;

  constructor(public activeModal: NgbActiveModal, public proposalStoreService: ProposalStoreService, public utilitiesService: UtilitiesService ,public localizationService:LocalizationService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService,
    private constantsService: ConstantsService
) { }

  ngOnInit(): void {
    // this.eaService.getLocalizedString(LocalizationEnum.services_discount);
    this.eaService.localizationMapUpdated.subscribe((key: any) => {
      if (key === LocalizationEnum.services_discount|| key === LocalizationEnum.all){
        this.checkAndSetCxDiscounts();
      }
    });
    
    this.checkAndSetCxDiscounts();

    this.simpleSlider = {
      type: "double",
      min: 0,
      max: 100,
      grid: true,
      grid_num: 5, from_fixed: true
    }
  }

  checkAndSetCxDiscounts(){
    this.cxSuiteDiscounts = this.setCxDiscounts(this.cxPeData);
    if (this.cxSuiteDiscounts) {

      const newOptions: Options = Object.assign({}, this.options);

      this.cxSuiteDiscounts.forEach(item => {
        // Major Line
        newOptions.minLimit = item.minDiscount;

        // Minor Line
        if (item.minorRow && item.minorRow.length) {
          item.minorRow.forEach(minorItem => {
            newOptions.minLimit = minorItem.minDiscount;
            minorItem['options'] = newOptions;
          })
        }

        // Creating dynamic Options for ngx-slider
        item['options'] = newOptions;
      })
    }
  }
  close() {
    this.activeModal.close({ continue: false, data: '' });
  }

  // method to set value when slider changes 
  sliderChange(changeContext: ChangeContext, data) {
    this.oldValue = data.discountPerTo;
    // check and set the selected value not greater than maxDiscount & less than minDiscount
    if (changeContext.highValue < data.minDiscount) {
      changeContext.highValue = data.minDiscount;
    } else if (changeContext.highValue > data.maxDiscount) {
      changeContext.highValue = data.maxDiscount;
    }
    this.setDiscountApplied(data, changeContext.highValue); // method to set selected discount   
  }

  //  method to set cxDiscounts for suite
  setCxDiscounts(data) {
    let cxMajorLineDisocunts = [];
    let minorRow = [];
    let majorLineMinDiscount = 0;
    let minorLineMaxHwDiscount = 0; // to set major line hw support discount 
    let majorLineSwDiscount = 0; // to set major line sw support discount
    let swSupportCount = 0; // to set number of solution/SW support lines present
    if (data.childs) {
      const children = data.childs;
      for (const childData of children) {
        if (((!this.eaService.features?.SPA_PID_TYPE && childData.pidType === "CX_HW_SUPPORT") || (this.eaService.features?.SPA_PID_TYPE && childData.pidType === this.constantsService.HW_PRODUCTS)) && (childData.listPrice && childData.listPrice !== '0.00')) { // if hW support type push the data to minor row
          minorRow.push({ "name": childData.poolSuiteLineName, 'id': childData.pidName, "type": "minor", "minDiscount": childData.minDiscount, "discountPerFrom": childData.minDiscount, "intialDiscount": childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount, "discountPerTo": childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount, "selectedValue": childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount, "maxDiscount": childData.maxDiscount, 'updatedValue': false });
          this.displayHWSupportOption = true;

          // // if weightedDiscount present set it to ato level HW support discount
          if (!majorLineMinDiscount && childData.weightedDisc){
            majorLineMinDiscount = childData.weightedDisc;
            minorLineMaxHwDiscount = childData.weightedDisc;
          }
          // check for discount value fo minor lines and set the max value to major line HWDiscount
          // if (majorLineMinDiscount < childData.minDiscount) {
          //   majorLineMinDiscount = childData.minDiscount;
          // }

          // // check for discount value fo minor lines and set the max value to major line HWDiscount
          // if (minorLineMaxHwDiscount < (childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount)) {
          //   minorLineMaxHwDiscount = (childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount);
          // }
        } else if (((!this.eaService.features?.SPA_PID_TYPE && childData.pidType === "CX_SOLUTION_SUPPORT") || (this.eaService.features?.SPA_PID_TYPE && childData.pidType === this.constantsService.SW_PRODUCTS)) && childData.desiredQty) { // check for sw support lines and get discount for software support major lone
          swSupportCount++; // increase count if present
          if (majorLineSwDiscount < (childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount)) {
            majorLineSwDiscount = (childData.serviceDiscount ? childData.serviceDiscount : childData.minDiscount);
          }
        }
      }
    }
    cxMajorLineDisocunts.push({ 'name': this.localizationService.getLocalizedString('services-discount.HARDWARE_SUPPORT'), 'suitId': data.suiteId, 'type': 'major', 'minDiscount': majorLineMinDiscount, 'discountPerFrom': minorLineMaxHwDiscount, 'intialDiscount': majorLineMinDiscount, 'discountPerTo': majorLineMinDiscount, 'selectedValue': majorLineMinDiscount, 'maxDiscount': data.maxDiscount, 'minorRow': minorRow, 'updatedValue': false });
    // check and set SW support in apply discount if Solution support lines are present
    if (swSupportCount > 0) {
      cxMajorLineDisocunts.push({ 'name': this.localizationService.getLocalizedString('services-discount.SOFTWARE_SUPPORT'), 'suitId': data.suiteId, 'type': 'major', 'minDiscount': data.minDiscount, 'discountPerFrom': data.minDiscount, 'intialDiscount': majorLineSwDiscount, 'discountPerTo': majorLineSwDiscount, 'selectedValue': majorLineSwDiscount, 'maxDiscount': data.maxDiscount, 'updatedValue': false });
    }
    return cxMajorLineDisocunts;
  }

  // method to set value when changes from input
  inputValueChange(event: any, data) {
    clearTimeout(this.timer); // clear the settimeout
    this.oldValue = data.discountPerTo;

    this.timer = setTimeout(() => {
      if (!this.utilitiesService.isNumberKey(event)) {
        event.target.value = "";
      }
      if (event.target.value) {
        if (+event.target.value > data.maxDiscount) {
          event.target.value = data.maxDiscount;
        }
      }
      if (+event.target.value >= data.minDiscount) {
        this.setDiscountApplied(data, +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value)));// method to set selected discount
      }
    }, 1500);
  }

  checkMinValue(event: any, data) {
    if (!event.target.value || +event.target.value < data.minDiscount) {
      event.target.value = data.selectedValue;
    }

  }

  // method to set selected discount
  setDiscountApplied(data, value) {

    data.discountPerTo = data.selectedValue = value;
    if ((this.oldValue !== data.selectedValue) && data.minorRow) {
      for (const line of data.minorRow) {
        this.isValueUpdated(data.minorRow, value);
        line.discountPerTo = line.selectedValue = data.selectedValue;
      }
      this.lineLevelDiscountUpdated = true;
    }
    if (data.type === 'minor') {
      this.lineLevelDiscountUpdated = true;
    }
    this.isValueUpdated(data, value);
    // if (this.oldValue !== data.selectedValue) {
    //   this.disableSave = false;
    // }

  }


  isValueUpdated(data, newValue) {
    if (+data.intialDiscount !== newValue && !data.updatedValue) {
      this.numberOfValueUpdated++;
      data.updatedValue = true;
    }
    if (this.numberOfValueUpdated && +data.intialDiscount === newValue && data.updatedValue) {
      this.numberOfValueUpdated--;
      data.updatedValue = false;
    }
  }

  applyDiscount() {
    const request = {
      "data": {
        "enrollments": [
          {
            "enrollmentId": this.cxPeData.enrollmentId,
            "atos": [
              {
                "name": this.cxPeData.ato,
                "pids": []
              }
            ]
          }
        ]
      }
    }
    this.setReqForDiscount(request);
    this.activeModal.close({
      continue : true,
      requestObj : request
    });
  }

  setReqForDiscount(request){
    const linesDiscount = [];
    for(let i = 0; i < this.cxSuiteDiscounts.length; i++){
      const majorLine = this.cxSuiteDiscounts[i]
      if(majorLine.name === 'Hardware Support'){
        if(majorLine.minorRow){
          
          for(let j = 0; j < majorLine.minorRow.length; j++){
            const minorRow = majorLine.minorRow[j];
            linesDiscount.push({
              'name': minorRow.id,
              "type": (this.eaService.features?.SPA_PID_TYPE) ? this.constantsService.HW_PRODUCTS : "CX_HW_SUPPORT", 
              "discount": {
                "unitNetDiscount": minorRow.selectedValue
              }
            })
          }
        }
      } else {
        request.data.enrollments[0].atos[0]['discount'] = {
          "servDisc": majorLine.selectedValue
        }
      }
    }
    request.data.enrollments[0].atos[0]['pids'] = linesDiscount;
    request.data.enrollments[0].atos[0]['lineLevelDiscountUpdated']  = this.lineLevelDiscountUpdated;

    console.log(request)
  }
}
