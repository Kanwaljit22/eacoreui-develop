import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PriceEstimationService, RecalculateAllEmitterObj } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';

@Component({
  selector: 'app-discount-parameter',
  templateUrl: './discount-parameter.component.html',
  styleUrls: ['./discount-parameter.component.scss']
})
export class DiscountParameterComponent implements OnInit {
  @Input() message: string;
  @Input() title: string;
  @Input() rampCreditDetails;
  suiteId: number;
  // showSlider:boolean = false;
  discountParams;
  isDisableApply = true;
  public sliders = [];
  clickedSuiteId;
  headerDiscounts;
  dataList = [];
  // sliders = [
  //   {
  //     slider: {
  //       name: 'software Discount',
  //       min: 0,
  //       max: 100,
  //       grid: true,
  //       grid_num: 10,
  //       from:0
  //     }
  //   },
  //   {
  //     slider: {
  //       name: 'software Service Discount',
  //       min: 0,
  //       max: 100,
  //       grid: true,
  //       grid_num: 10,
  //       from:0
  //     }
  //   },
  //   {
  //     slider: {
  //       name: 'subscription Discount',
  //       min: 0,
  //       max: 100,
  //       grid: true,
  //       grid_num: 10,
  //       from:0
  //     }
  //   }
  // ];

  constructor(public localeService: LocaleService,
    public bsModalRef: BsModalRef,
    public priceEstimationService: PriceEstimationService,
    public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService,
    public appDataService: AppDataService,
    public utilitiesService: UtilitiesService,
    public messageService: MessageService
  ) { }
  ngOnInit() {
    // if proposal is completed, set the roadMapPath to true
    if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE) {
      this.appDataService.roadMapPath = true;
    }
    // Set applied discounts in price estimate service
    this.priceEstimationService.discountsOnSuites.softwareServiceDiscount = '';
    this.priceEstimationService.discountsOnSuites.softwareDiscount = '';
    this.priceEstimationService.discountsOnSuites.subscriptionDiscount = '';
    this.priceEstimationService.discountsOnSuites.advancedDeployment = '';
    this.priceEstimationService.discountsOnSuites.softwareServiceDiscount = '';
    this.priceEstimationService.dialDownRampChangeMap.clear();
    this.priceEstimationService.discountsOnSuites.advancedDeploymentSelected = false;
    // this.headerDiscounts = this.priceEstimationService.headerDiscounts;
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      this.headerDiscounts = [
        {
          name: this.localeService.getLocalizedString('price.est.SUBSCRIPTION_DISCOUNT'),
          value: ''
        },
        {
          name: this.localeService.getLocalizedString('price.est.SERVICE_SUBSCRIPTION_DISCOUNT'),
          value: ''
        }
      ];
    } else {
      this.headerDiscounts = [
        {
          name: this.localeService.getLocalizedString('price.est.SOFTWARE_DISCOUNT'),
          value: ''
        },
        {
          name: this.localeService.getLocalizedString('price.est.SOFTWARE_SERVICE_DISCOUNT'),
          value: ''
        },
        {
          name: this.localeService.getLocalizedString('price.est.SUBSCRIPTION_DISCOUNT'),
          value: ''
        },
        {
          name: 'Ramp Promo',
          value: ''
        }
      ];
    }
    if (this.message === 'applyDiscount') {
      const discountAry = this.priceEstimationService.proposalHeaderDiscounts;
      const subscriptionObj = {};
      const subscriptionServiceObj = {};
      for (const prop in discountAry) {
        if (prop.indexOf('subscriptionDiscount') > -1) {
          subscriptionObj[prop] = discountAry[prop]; // push object to subscriptionObj
        } else if (prop.indexOf('subscriptionServiceDiscount') > -1) {
          subscriptionServiceObj[prop] = discountAry[prop]; // push object to subscriptionObj
        }
      }
      this.sliders.push(this.convertToSliderObj(subscriptionObj));
      if (this.appDataService.archName === this.constantsService.SECURITY) {
        this.sliders.push(this.convertToSliderObj(subscriptionServiceObj));
      }
    } else {
      this.sliders = [];
      for (let i = 0; i < this.priceEstimationService.dnaRampDiscount.length; i++) {
        this.sliders.push(this.convertToSliderObj(this.priceEstimationService.dnaRampDiscount[i]));
      }

    }
  }

  // get and set the discount obj for slider
  convertToSliderObj(obj) {
    const newObj = headerSliderObjFactory.getHeaderSliderObj();
    if (this.message === 'applyDiscount') {
      for (const prop in obj) {
        if (prop.indexOf('Min') > -1) {
          // property contains min value, assign its value to min property of sliderObj
          newObj.min = obj[prop];
          const name = prop.replace(/([a-z](?=[A-Z]))/g, '$1 ').slice(0, -4); // split the name and slice the last 4 letters
          newObj.name = name;
          if (this.message === 'applyDiscount') {
            newObj.from = obj[prop]; // to display value in the input box
          }
        } else if (prop.indexOf('Max') > -1) {
          // property contains mxn value, assign its value to man property of sliderObj
          newObj.max = obj[prop];
        } else if (prop.indexOf('Selected') > -1) {
          // property contains mxn value, assign its value to man property of sliderObj
          newObj.selected = obj[prop];
        }/* else if (this.message !== 'applyDiscount') {
        newObj.from = obj[prop]; //Applied discount from server
      }*/
      }
    } else { // This code will execute in case of dial down ramp.
      for (const prop in obj) {
        if (prop.indexOf('Min') > -1) {
          // property contains min value, assign its value to min property of sliderObj
          newObj.min = obj[prop];
          newObj.from = obj[prop]; // to display value in the input box
        } else if (prop.indexOf('Max') > -1) {
          // property contains mxn value, assign its value to man property of sliderObj
          newObj.max = obj[prop];
        } else if (prop.indexOf('selected') > -1) {
          // property contains mxn value, assign its value to man property of sliderObj
          newObj.selected = obj[prop];
          newObj.from = obj[prop];
        } else if (prop === 'suiteName') {
          newObj.name = obj[prop];
        } else if (prop === 'suiteId') {
          newObj.id = obj[prop];
        }
      }

    }
    const slider = newObj;
    return { slider };
  }
  inputValueChange(event: any, name) {

    if (!this.utilitiesService.isNumberKey(event)) {
      event.target.value = '';
    }
    name = name.split(' ').join(''); // Join the name to store it in object
    this.priceEstimationService.discountsOnSuites[name] = event.target.value; // softwareServiceDiscount
    if (event.target.value) {
      if (event.target.value > 100) {
        this.priceEstimationService.discountsOnSuites[name] = 100;
        event.target.value = 100;
      } else if (event.target.value < 0) {
        this.priceEstimationService.discountsOnSuites[name] = 0;
        event.target.value = 0;
      }
    }
    this.onValueChanged();
  }

  // Enable / Disable Apply Discount button on value change
  onValueChanged() {

    if (this.message !== 'applyDiscount') {
      if (this.priceEstimationService.dialDownRampChangeMap.size > 0) {
        for (let i = 0; i < this.priceEstimationService.dnaRampDiscount.length; i++) {
          const obj = this.priceEstimationService.dnaRampDiscount[i];
          if (this.priceEstimationService.dialDownRampChangeMap.has(obj['suiteId'])) {
            const changeValueObj = this.priceEstimationService.dialDownRampChangeMap.get(obj['suiteId']);
            if (changeValueObj['changeValue'] !== obj['selectedValue']) {
              this.isDisableApply = false;
              break;
            } else {
              this.isDisableApply = true;
            }
          }
        }
      } else {
        this.isDisableApply = false;
      }
    } else {
      if (this.priceEstimationService.discountsOnSuites.softwareDiscount === '' &&
      this.priceEstimationService.discountsOnSuites.softwareServiceDiscount === '' &&
      this.priceEstimationService.discountsOnSuites.subscriptionDiscount === '' &&
      this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount === '') {
        this.isDisableApply = true;
      } else {
        this.isDisableApply = false;
      }
    }
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.isDisableApply = this.appDataService.userInfo.roSuperUser;
    } else if (this.appDataService.roadMapPath) {
      this.isDisableApply = this.appDataService.roadMapPath;
    }
  }



  confirm(): void {
    let that = this;
    this.priceEstimationService.suiteDiscounts.forEach(function (suite) {
      //  if(x.includes('Perpetual')){
      if (
        that.priceEstimationService.discountsOnSuites.softwareDiscount !== ''
      ) {
        suite.softwareDiscount =
          that.priceEstimationService.discountsOnSuites.softwareDiscount;
      }
      if (
        that.priceEstimationService.discountsOnSuites
          .softwareServiceDiscount !== ''
      ) {
        suite.softwareServiceDiscount =
          that.priceEstimationService.discountsOnSuites.softwareServiceDiscount;
      }
      // } else {
      if (
        that.priceEstimationService.discountsOnSuites.subscriptionDiscount !==
        ''
      ) {
        suite.subscriptionDiscount =
          that.priceEstimationService.discountsOnSuites.subscriptionDiscount;
      }

      if (that.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount !== '') {
        // check fo security tetration and set the subscription service discount to 0
        if (suite.suiteId === 38 || suite.suiteName === that.constantsService.SECURITY_TETRATION) {
          suite.subscriptionServiceDiscount = 0;
        } else {
          suite.subscriptionServiceDiscount = that.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount;
        }
      }
      // }

      const x = suite.suiteName;
      let data = {};
      if (x.includes('Perpetual')) {
        data = {
          softwareDiscount: suite.softwareDiscount,
          softwareServiceDiscount: suite.softwareServiceDiscount,
          advancedDeployment: '',
          subscriptionDiscount: '',
          suiteId: Math.abs(suite.suiteId)
        };
      } else if (that.appDataService.archName === that.constantsService.SECURITY) {
        data = {
          softwareDiscount: '',
          softwareServiceDiscount: '',
          advancedDeployment: '',
          subscriptionDiscount: suite.subscriptionDiscount,
          subscriptionServiceDiscount: suite.subscriptionServiceDiscount,
          suiteId: Math.abs(suite.suiteId)
        };
      } else {
        data = {
          softwareDiscount: '',
          softwareServiceDiscount: '',
          advancedDeployment: '',
          subscriptionDiscount: suite.subscriptionDiscount,
          suiteId: Math.abs(suite.suiteId)
        };
      }


      // push the data to datalist to send it to server later
      that.dataList.push(data);
    });

    this.appDataService.peRecalculateMsg.isConfigurationDone = true;

    this.priceEstimationService
      .saveDiscount(this.dataList)
      .subscribe((res: any) => {
        const recalculateAllObject: RecalculateAllEmitterObj = {
          recalculateButtonEnable: true,
          recalculateAllApiCall: true
        };
        this.priceEstimationService.isEmitterSubscribe = true;
        this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllObject);
        // Set applied discount to object to display if user reopens the pop up
        if (this.appDataService.archName !== this.constantsService.SECURITY) {
          this.priceEstimationService.headerDiscounts[0].value = this.priceEstimationService.discountsOnSuites.softwareDiscount;
          this.priceEstimationService.headerDiscounts[1].value = this.priceEstimationService.discountsOnSuites.softwareServiceDiscount;
          this.priceEstimationService.headerDiscounts[2].value = this.priceEstimationService.discountsOnSuites.subscriptionDiscount;
        } else {
          this.priceEstimationService.headerDiscounts = this.headerDiscounts;
          this.priceEstimationService.headerDiscounts[0].value = this.priceEstimationService.discountsOnSuites.subscriptionDiscount;
          this.priceEstimationService.headerDiscounts[1].value = this.priceEstimationService.discountsOnSuites.subscriptionServiceDiscount;
        }
        this.priceEstimationService.isContinue = true;
      });

    this.priceEstimationService.headerDiscountApplied = true;
    this.bsModalRef.hide();
  }

  // method to call ramp discount api call and recalculate api after success
  confirmRamp(): void {
    this.priceEstimationService.rampDiscount(this.priceEstimationService.dialDownRampChangeMap).subscribe((res: any) => {
      if (res && !res.error) {
        const recalculateAllObject: RecalculateAllEmitterObj = {
          recalculateButtonEnable: true,
          recalculateAllApiCall: true
        };
        this.priceEstimationService.isEmitterSubscribe = true;
        this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllObject);
        this.priceEstimationService.isContinue = true;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }
}
export class headerSliderObjFactory {
  static getHeaderSliderObj() {
    return {
      id: 0,
      name: '',
      min: 0,
      max: 100,
      from: 0,
      grid: true,
      grid_num: 10,
      tab: false,
      selected: false
    };
  }
}
