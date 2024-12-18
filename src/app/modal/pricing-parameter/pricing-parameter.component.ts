
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IonRangeSliderComponent, IonRangeSliderCallback } from '@app/shared/ion-range-slider/ion-range-slider.component';
import { PriceEstimationService, RecalculateAllEmitterObj } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';

@Component({
  selector: 'app-pricing-parameter',
  templateUrl: './pricing-parameter.component.html',
  styleUrls: ['./pricing-parameter.component.scss']
})
export class PricingParameterComponent implements OnInit {
  suiteId: number;
  showSlider = false;
  isDisableApply = true;
  public sliders = [];
  discountParams;
  clickedSuiteId;
  suiteName;
  advancedDeploymentMin = 0;
  suiteData: any;
  selectedServiceLevelId: any;

  constructor(public localeService: LocaleService, public bsModalRef: BsModalRef, public priceEstimationService: PriceEstimationService,
    public appDataService: AppDataService
  ) { }
  ngOnInit() {
    let id = this.suiteId;
    this.clickedSuiteId = Math.abs(id); // convert negative id number to positive, 
    let discountAry = this.priceEstimationService.suiteDiscounts;
    // Filter the Suite information  that was clicked ,from discount response
    let clickedId = this.clickedSuiteId;
    let discountParamsAry = discountAry.filter(function (suite) {
      return suite.suiteId === clickedId;
    });
    this.discountParams = discountParamsAry[0];
    this.suiteName = this.discountParams.suiteName;
    // Set applied discounts in price estimate service 
    this.priceEstimationService.discountsOnSuites.softwareDiscount = this.discountParams.softwareDiscount;
    this.priceEstimationService.discountsOnSuites.softwareServiceDiscount = this.discountParams.softwareServiceDiscount;
    this.priceEstimationService.discountsOnSuites.advancedDeployment = this.discountParams.advancedDeployment;
    this.priceEstimationService.discountsOnSuites.advancedDeploymentSelected = this.discountParams.advancedDeploymentSelected;
    console.log(this.discountParams);
    let deployementObj = {};
    let softwareObj = {};
    let serviceObj = {};

    for (let prop in this.discountParams) {
      if (prop.indexOf('softwareDiscount') > -1) {
        softwareObj[prop] = this.discountParams[prop]; // push object to softwareObj
      } else if (prop.indexOf('softwareServiceDiscount') > -1) {
        serviceObj[prop] = this.discountParams[prop]; // push object to serviceObj
      } else if (prop.indexOf('advancedDeployment') > -1) {
        deployementObj[prop] = this.discountParams[prop]; // push object to deployementObject
        this.advancedDeploymentMin = this.discountParams.advancedDeploymentMin;
      }
    }

    this.sliders.push(this.priceEstimationService.convertToSliderObj(softwareObj));
    this.sliders.push(this.priceEstimationService.convertToSliderObj(serviceObj));
    this.sliders.push(this.priceEstimationService.convertToSliderObj(deployementObj));


    console.log(this.sliders);
    this.showSlider = true;
  }

  // Enable / Disable Apply Discount button on value change
  onValueChanged() {
    // console.log('here');
    if (+(this.priceEstimationService.discountsOnSuites.advancedDeployment) < (+this.advancedDeploymentMin)) {
      this.priceEstimationService.discountsOnSuites.advancedDeployment = '' + this.advancedDeploymentMin;
    }

    if (String(this.discountParams.softwareDiscount) === String(this.priceEstimationService.discountsOnSuites.softwareDiscount) &&
      String(this.discountParams.softwareServiceDiscount) === String(
        this.priceEstimationService.discountsOnSuites.softwareServiceDiscount) &&
      String(this.discountParams.advancedDeployment) === String(this.priceEstimationService.discountsOnSuites.advancedDeployment) &&
      (this.discountParams.advancedDeploymentSelected === this.priceEstimationService.discountsOnSuites.advancedDeploymentSelected)
    ) {
      this.isDisableApply = true;
    } else {
      this.isDisableApply = false;
    }

    // disable apply button in Read only mode
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isDisableApply = this.appDataService.userInfo.roSuperUser;
    } else if (this.appDataService.roadMapPath) {
      this.isDisableApply = this.appDataService.roadMapPath;
    }

  }

  confirm(): void {
    this.appDataService.peRecalculateMsg.isConfigurationDone = true;
    // to get the id of selected service level.
    if (this.suiteData.serviceLevel && this.suiteData.serviceLevels) {
      for (let i = 0; i < this.suiteData.serviceLevels.length; i++) {
        if (this.suiteData.serviceLevel.toLowerCase() === this.suiteData.serviceLevels[i].serviceLevel.toLowerCase()) {
          this.selectedServiceLevelId = this.suiteData.serviceLevels[i].id;
        }
      }
    }
    if (!this.priceEstimationService.discountsOnSuites.advancedDeploymentSelected) {
      this.priceEstimationService.discountsOnSuites.advancedDeployment = '';
    }
    const data = [{
      'softwareDiscount': this.priceEstimationService.discountsOnSuites.softwareDiscount,
      'softwareServiceDiscount': this.priceEstimationService.discountsOnSuites.softwareServiceDiscount,
      'advancedDeployment': this.priceEstimationService.discountsOnSuites.advancedDeployment,
      'subscriptionDiscount': '',
      'advancedDeploymentSelected': this.priceEstimationService.discountsOnSuites.advancedDeploymentSelected,
      'suiteId': Math.abs(this.suiteId),
      'multisuiteDiscount': (this.suiteData.multisuiteDiscount) ? this.suiteData.multisuiteDiscount : '',
      'totalSubscriptionDiscount': (this.suiteData.totalSubscriptionDiscount) ? this.suiteData.totalSubscriptionDiscount : '',
      'serviceLevel': this.selectedServiceLevelId
    }];
    this.suiteId = Math.abs(this.suiteId);
    this.priceEstimationService.saveDiscount(data).subscribe((res: any) => {
      this.bsModalRef.hide();
      // console.log('Before For each>>>>');
      // console.log(this.priceEstimationService.suiteDiscounts);
      // Save the changed data in respective discount so that user is able to see applied discount when he reopens discount pop up
      let clickedId = this.clickedSuiteId;
      let that = this;
      this.priceEstimationService.suiteDiscounts.forEach(function (suite) {
        if (suite.suiteId === clickedId) {
          suite.softwareDiscount = that.priceEstimationService.discountsOnSuites.softwareDiscount;
          suite.softwareServiceDiscount = that.priceEstimationService.discountsOnSuites.softwareServiceDiscount;
          suite.advancedDeployment = that.priceEstimationService.discountsOnSuites.advancedDeployment;
          suite.subscriptionDiscount = that.priceEstimationService.discountsOnSuites.subscriptionDiscount;
          suite.advancedDeploymentSelected = that.priceEstimationService.discountsOnSuites.advancedDeploymentSelected;
        }
      });
      let obj = { suiteId: clickedId, advancedDeployment: this.priceEstimationService.discountsOnSuites.advancedDeployment };
      // Saving perpetual suite discount
      that.savePerpetualSuiteDiscount(data);
      if (obj && obj.advancedDeployment) {
        this.priceEstimationService.advancedDeploymentEmitter.emit(obj);
      }
      // this.priceEstimationService.recalculateAllEmitter.emit(false);
      const recalculateAllEmitterObj: RecalculateAllEmitterObj = {
        recalculateButtonEnable: true,
        recalculateAllApiCall: true
      };
      this.priceEstimationService.isEmitterSubscribe = true;
      this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllEmitterObj);
      this.priceEstimationService.isContinue = true;


      // console.log('After For each>>>>');
      // console.log(this.priceEstimationService.suiteDiscounts);
    });


  }

  // Saving perpetual suite discount
  savePerpetualSuiteDiscount(data) {

    let isAlreadyAddedDiscount = false;

    let that = this;

    if (data && data.length > 0) {

      this.priceEstimationService.perpetualSuiteDiscounts.forEach(function (discount, i) {

        if (discount.suiteId === data[0]['suiteId']) {
          that.priceEstimationService.perpetualSuiteDiscounts[i] = data[0];
          isAlreadyAddedDiscount = true;
        }
      });

      if (!isAlreadyAddedDiscount) {
        this.priceEstimationService.perpetualSuiteDiscounts.push(data[0]);
      }
    }
  }

  decline(): void {
    this.bsModalRef.hide();
  }
}


// onStart: (event: IonRangeSliderCallback) => {
//   // console.log(event)
// },
// onChange: (event: IonRangeSliderCallback) => {
//   // console.log(event)
// },
// onUpdate: (event: IonRangeSliderCallback) => {
//   // console.log(event)
// },
// onFinish: (event: IonRangeSliderCallback) => {
//   // console.log(event)
// }

