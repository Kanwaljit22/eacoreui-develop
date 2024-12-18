import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-create-tco',
  templateUrl: './create-tco.component.html',
  styleUrls: ['./create-tco.component.scss']
})
export class CreateTcoComponent implements OnInit{

  isPartnerMarkup = true;
  isGrowthExpenses = false;
  isDoubleClick = false;
  isTimeValueMoney = false;
  timer: any;
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
  partnerMarkupDiscount = { minDiscount: 0, selectedValue: 15, maxDiscount: 100 }
  growthExpDiscount = { minDiscount: 0, selectedValue: 2, maxDiscount: 100 }
  timeValueMoneyDiscount = { minDiscount: 0, selectedValue: 7, maxDiscount: 100 }

  constructor(private activeModal: NgbActiveModal, public dataIdConstantsService: DataIdConstantsService, public utilitiesService: UtilitiesService, private vnextService: VnextService,
    private eaRestService: EaRestService, public elementIdConstantsService: ElementIdConstantsService, public localizationService: LocalizationService) {

  }

  ngOnInit() {
    this.getDefaultValues()
  }

  displayPartnerMarkup() {
    this.isPartnerMarkup = true;
    this.isGrowthExpenses = false;
    this.isTimeValueMoney = false;
  }

  getDefaultValues(){//to set default values
    let url = this.vnextService.getAppDomainWithContext + 'proposal/tco/defaults';

   this.eaRestService.getApiCall(url).subscribe((response: any) => {

     if (this.vnextService.isValidResponseWithData(response)) {
      this.partnerMarkupDiscount.selectedValue = response.data.tcoMetaData?.defaults?.partnerMarkup;
      this.growthExpDiscount.selectedValue = response.data.tcoMetaData?.defaults?.growthParameter;
      this.timeValueMoneyDiscount.selectedValue = response.data.tcoMetaData?.defaults?.inflation;
     }
     
   });
 }


  displayGrowthExpenses() {
    this.isPartnerMarkup = false;
    this.isGrowthExpenses = true;
    this.isTimeValueMoney = false;
  }


  displayTimeValueMoney() {
    this.isPartnerMarkup = false;
    this.isGrowthExpenses = false;
    this.isTimeValueMoney = true;
  }

  continue() {
    this.activeModal.close({
      data: {
        partnerMarkup: +this.partnerMarkupDiscount.selectedValue,
        growthParameter: +this.growthExpDiscount.selectedValue,
        inflation: +this.timeValueMoneyDiscount.selectedValue
      }
    });
  }

  close(){
    this.activeModal.close();
  }





  sliderChange(changeContext: ChangeContext, data) {
    // check and set the selected value not greater than maxDiscount & less than minDiscount
    if (changeContext.highValue < data.minDiscount) {
      changeContext.highValue = data.minDiscount;
    } else if (changeContext.highValue > data.maxDiscount) {
      changeContext.highValue = data.maxDiscount;
    }
  }

  checkMinValue(event: any, data) {
    this.isDoubleClick = false
    if (!event.target.value || +event.target.value < data.minDiscount) {
      event.target.value = data.selectedValue;
    }

  }
  inputValueChange(event: any, data) {
    clearTimeout(this.timer); // clear the settimeout

    if (!this.utilitiesService.isNumberOnlyKey(event)) {//allow decimal also...
      event.preventDefault();
      event.target.value = data.selectedValue;
      return;
    }
    if(!event.target.value || +event.target.value < data.minDiscount || +event.target.value > data.maxDiscount){
      this.timer = setTimeout(() => {
        if (!event.target.value || +event.target.value < data.minDiscount) {
          event.target.value = data.minDiscount;
        } else if (+event.target.value > data.maxDiscount) {
          event.target.value = data.maxDiscount;
        }
        event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value))
        data.selectedValue = event.target.value;
      }, 800);
    } else {
      event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value))
      data.selectedValue = event.target.value;
    }
  }
  keyDown(event) {// to prevent char and special char 
    // use utilitiesService.isNumberKey if decimal required
    if (!this.utilitiesService.isNumberOnlyKey(event) || event.key == 'Tab') {
      event.preventDefault();
    } else{
      let value = ((+event.target.value) + (+event.key))
      const stringValue = (event.target.value) + (event.key)
      if(this.isDoubleClick){
        value = (+event.key)
      }
      if(value > 100 && !isNaN(value)){
        event.preventDefault();
      }
       else if(stringValue > 100 && !this.isDoubleClick){
        event.preventDefault();
      } else {
        this.isDoubleClick = false
      }
    }
  }

  onDoubleClick(){
    this.isDoubleClick = true;
  }

}
