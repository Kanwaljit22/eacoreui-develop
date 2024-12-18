import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PriceEstimationService, RecalculateAllEmitterObj } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';


@Component({
  selector: 'app-discount',
  templateUrl: './discounts.component.html',
  styleUrls: ['../modal-common.scss', './discounts.component.scss']
})
export class DiscountsModalComponent implements OnInit {
  suiteId: number;
  showSlider = false;
  isDisableApply = true;
  public sliders = [];
  discountParams;
  clickedSuiteId;
  suiteName;
  suiteData: any;
  selectedServiceLevelId: any;
  // sliders = [
  //   {
  //     slider: {
  //       name: 'Subscription Discount',
  //       min: 0,
  //       max: 100,
  //       grid: true,
  //       grid_num: 10
  //     }
  //   }
  // ];

  constructor(public localeService: LocaleService, public appDataService: AppDataService,
    public bsModalRef: BsModalRef, public priceEstimationService: PriceEstimationService) { }
  ngOnInit() {
    const id = this.suiteId;
    this.clickedSuiteId = Math.abs(id); // convert negative id number to positive,
    const discountAry = this.priceEstimationService.suiteDiscounts;
    // Filter the Suite information  that was clicked ,from discount response
    const clickedId = this.clickedSuiteId;
    const discountParamsAry = discountAry.filter(function (suite) {
      return suite.suiteId === clickedId;
    });
    this.discountParams = discountParamsAry[0];
    this.suiteName = this.discountParams.suiteName;
    // Ser applied discounts in price estimate service
    this.priceEstimationService.discountsOnSuites.subscriptionDiscount = this.discountParams.subscriptionDiscount;
    this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount = this.discountParams.subscriptionServiceDiscount ?
    this.discountParams.subscriptionServiceDiscount : '';
    const subscriptionObj = {};
    const subscriptionServiceObj = {};
    for (const prop in this.discountParams) {
      if (prop.indexOf('subscriptionDiscount') > -1) {
        subscriptionObj[prop] = this.discountParams[prop]; // push object to subscriptionObj
      } else if (prop.indexOf('subscriptionServiceDiscount') > -1) {
        subscriptionServiceObj[prop] = this.discountParams[prop]; // push object to subscriptionObj
      }
    }
    this.sliders.push(this.priceEstimationService.convertToSliderObj(subscriptionObj));
    // if subscription service discount is not empty send to slider for min and max slider
    if (this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount !== '') {
      this.sliders.push(this.priceEstimationService.convertToSliderObj(subscriptionServiceObj));
    }
    this.showSlider = true;
  }

  // Enable / Disable Apply Discount button on value change
  onValueChanged() {
    if (String(this.discountParams.subscriptionDiscount) === String(this.priceEstimationService.discountsOnSuites.subscriptionDiscount)
      && String(this.discountParams.subscriptionServiceDiscount) === String(this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount)) {
      this.isDisableApply = true;
    } else {
      this.isDisableApply = false;
    }

    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isDisableApply = this.appDataService.userInfo.roSuperUser;
    } else if (this.appDataService.roadMapPath) {
      this.isDisableApply = this.appDataService.roadMapPath;
    }

  }


  confirm(): void {
    // to get the id of selected service level.
    if (this.suiteData.serviceLevel && this.suiteData.serviceLevels) {
      for (let i = 0; i < this.suiteData.serviceLevels.length; i++) {
        if (this.suiteData.serviceLevel.toLowerCase() === this.suiteData.serviceLevels[i].serviceLevel.toLowerCase()) {
          this.selectedServiceLevelId = this.suiteData.serviceLevels[i].id;
        }
      }
    }
    const data = [{
      'softwareDiscount': '',
      'softwareServiceDiscount': '',
      'advancedDeployment': '',
      'subscriptionDiscount': this.priceEstimationService.discountsOnSuites.subscriptionDiscount,
      'subscriptionServiceDiscount': this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount,
      'suiteId': Math.abs(this.suiteId),
      'multisuiteDiscount': (this.suiteData.multisuiteDiscount) ? this.suiteData.multisuiteDiscount : '',
      'totalSubscriptionDiscount': (this.suiteData.totalSubscriptionDiscount) ? this.suiteData.totalSubscriptionDiscount : '',
      'serviceLevel': this.selectedServiceLevelId
    }];
    this.suiteId = Math.abs(this.suiteId);
    this.appDataService.peRecalculateMsg.isConfigurationDone = true;
    this.priceEstimationService.saveDiscount(data).subscribe((res: any) => {
      // console.log('Before For each>>>>');
      // console.log(this.priceEstimationService.suiteDiscounts);
      const recalculateAllEmitterObj: RecalculateAllEmitterObj = {
        recalculateButtonEnable: true,
        recalculateAllApiCall: true
      };
      this.priceEstimationService.isEmitterSubscribe = true;
      this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllEmitterObj);
      const clickedId = this.clickedSuiteId;
      const that = this;
      this.priceEstimationService.suiteDiscounts.forEach(function (suite) {
        if (suite.suiteId === clickedId) {
          suite.subscriptionDiscount = that.priceEstimationService.discountsOnSuites.subscriptionDiscount;
          suite.subscriptionServiceDiscount = that.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount;
        }
      });
      this.priceEstimationService.isContinue = true;
      // console.log('After For each>>>>');
      // console.log(this.priceEstimationService.suiteDiscounts);
    });
    this.bsModalRef.hide();
  }

  decline(): void {
    this.bsModalRef.hide();
  }
}
