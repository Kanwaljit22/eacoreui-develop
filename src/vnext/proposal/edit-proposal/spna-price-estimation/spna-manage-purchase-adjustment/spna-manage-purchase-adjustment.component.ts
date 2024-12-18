import { Component, OnInit, Input, SimpleChanges, OnDestroy, Renderer2 } from '@angular/core';

import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';

import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { Options } from '@angular-slider/ngx-slider';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { IPoolForGrid } from '../../price-estimation/price-estimate-store.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-manage-purchase-adjustment',
  templateUrl: './spna-manage-purchase-adjustment.component.html',
  styleUrls: ['./spna-manage-purchase-adjustment.component.scss']
})
export class SpnaManagePurchaseAdjustmentComponent implements OnInit, OnDestroy {
  showSuites = false;
  showCredits = false;
  showDurations = false;
  rampEligibilityData = []
  creditCategoryMap = new Map<string, any>();
  durationArray = [];
  displayDurationDropdown = false;
  displayAddCredit = false;
  gridData = [];
  updatedAtoArray = [];
  selectedSuite: any = {}
  enrollmentId = 0;
  selectedDuration: any
  selectedCreditCategory: any = {}
  startingFrom: any
  discountToUpdate = 0
  @Input() poolArray: Array<IPoolForGrid> = [];
  options: Options = {
    floor: 40,
    ceil: 100,
    maxLimit: 100,
    showTicksValues: true,
    step: 10,
    precisionLimit: 2, // limit to 2 decimal points
    enforceStepsArray: false, // set false to allow float values
    enforceStep: false, // set false to allow float values
    showTicks: true,
    noSwitching: true
  };
  isMerakiSuite = false;
  isEa2Suite = false; //This flag is use to check for suite type.
  constructor(public priceEstimateService: PriceEstimateService, public proposalStoreService: ProposalStoreService,
    private vnextService: VnextService, private proposalRestService: ProposalRestService, public utilitiesService: UtilitiesService,
    private eaRestService: EaRestService, public dataIdConstantsService: DataIdConstantsService,
    public localizationService: LocalizationService, private eaService: EaService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.enrollmentId = this.poolArray[0].enrollmentId;
    this.getData();
    this.startingFrom = new Date(this.utilitiesService.formateDate(this.proposalStoreService.proposalData.billingTerm.rsd));
    this.startingFrom = this.startingFrom.toString().slice(0, 15)
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['poolArray'] && changes['poolArray'].previousValue !== changes['poolArray'].currentValue
      && !changes['poolArray'].isFirstChange()) {
      this.getData();
    }
  }



  getData() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/ato-ramp-eligibility?e=' + this.enrollmentId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.rampEligibilityData = response.data.lines;
        this.mapSuiteName()
      } else {
        //code to display error msg
      }
    });
  }

  mapSuiteName() {
    this.gridData = []

    this.poolArray.forEach(pool => {
      pool.childs.forEach(suiteName => {
        let suiteAddedinGrid = false;
        // if(suiteName['credit']){
        //   suiteName['credit']['credits']= [
        //     {
        //     "rampCredit" : true,
        //     "name" : "",
        //     "category" : "",
        //     "totalCredit" : "",
        //     "monthlyCredit" : "",
        //     "yearlyCredit" : ""
        //     }
        //     ]
        // }
        if (suiteName.credit && suiteName.credit.credits && suiteName.credit.credits.length) {
          for (let i = suiteName.credit.credits.length - 1; i >= 0; i--) {
            if (suiteName.credit.credits[i].rampCredit) {
              suiteAddedinGrid = true;
            } else {
              suiteName.credit.credits.splice(i, 1);
            }
          }

          if (suiteAddedinGrid) {
            this.gridData.push(suiteName);
          }
        }
        const suite = this.rampEligibilityData.find(suite => suiteName.ato === suite.sku)
        if (suite) {
          suite['name'] = suiteName.poolSuiteLineName;
          if (suiteAddedinGrid) {
            suite['selected'] = true;
          } else {
            suite['selected'] = false;
          }
        }
       // this.enrollmentId = suiteName.enrollmentId
      });
    });

  }

  perpareCreditCategory(suite) {
    this.isEa2Suite = false;
    if (!suite.ea2Suite) {
      if (this.selectedSuite.selected) {
        this.selectedSuite.selected = false;
      }
      this.selectedDuration = '';
      this.creditCategoryMap.clear();
      this.selectedCreditCategory = {}

      this.durationArray = []
      this.displayAddCredit = false;
      this.displayDurationDropdown = false;
      this.showSuites = false;
      suite.selected = true;
      this.selectedSuite = suite;
      suite.rampDetails.forEach(rampDetail => {
        const categoryObj = { 'rampType': rampDetail.rampType, 'rampName': rampDetail.rampName, 'duration': rampDetail.rampTerms, 'rampDiscount': rampDetail.rampDiscount, 'discountDetails': rampDetail.discountDetails }
        if (rampDetail.rampTerms) {
          this.durationArray.push(...rampDetail.rampTerms)

        }
        this.creditCategoryMap.set(rampDetail.name, categoryObj);
      })

      if (suite.skuDesc.indexOf('Meraki') > -1) {
        this.isMerakiSuite = true;
      } else {
        this.isMerakiSuite = false;
      }
      this.showSuites = false;
    } else {
      if (this.selectedSuite.selected) {
        this.selectedSuite.selected = false;
      }
      suite.selected = true;
      this.selectedSuite = suite;
      this.isEa2Suite = true;
    }
  }

  creditCategorySelected(creditCategory) {
    this.displayDurationDropdown = false;
    this.selectedDuration = '';
    if (creditCategory.duration) {
      this.displayAddCredit = false;
      this.displayDurationDropdown = true;
      this.durationArray = [...new Set(creditCategory.duration)];
      this.durationArray.sort(function (a, b) {
        return a - b;
      });
    } else {
      this.displayAddCredit = true;
    }
    this.selectedCreditCategory = creditCategory;
    this.showCredits = false;
  }

  selectDuration(term) {
    this.selectedDuration = term
    this.showDurations = false;
    this.displayAddCredit = true;
  }

  addCredit() {//this is only to add new credit using dropdowns 

    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=ATO-RAMP-UPDATE';
    const params = {
      type: this.selectedCreditCategory.rampType,
      name: this.selectedCreditCategory.rampName
    }
    if (this.selectedCreditCategory.discountDetails) {
      params['discountDetails'] = this.selectedCreditCategory.discountDetails;
    }
    if (this.selectedDuration) {
      params['term'] = this.selectedDuration;
    }
    if (this.selectedCreditCategory.rampDiscount) {
      params['discount'] = this.selectedCreditCategory.rampDiscount;
    }
    const reqOj = {
      data: {
        enrollments: [{
          enrollmentId: this.enrollmentId,
          atos: [{
            name: this.selectedSuite.sku,
            lnCredits: [{
              lnCreditType: "RAMP_CREDIT",
              params: params
            }]
          }
          ]
        }]
      }
    }
    this.eaRestService.postApiCall(url, reqOj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.resetValues();
        this.priceEstimateService.refreshPeGridData.next(true);
      }
    });
  }

  deleteCredit(suite, index) {
    let obj = this.updatedAtoArray.find(ato => ato.name === suite.ato);
    if (obj) {
      obj = { name: suite.ato }
    } else {
      this.updatedAtoArray.push({ name: suite.ato })
    }

    this.gridData.splice(index, 1)
    this.updateCredits();
  }

  updateDiscount(suite) {
    suite.credit.rampDetail.overrideDiscountPercent = this.discountToUpdate;
    suite.displayApply = false;
    let obj = this.updatedAtoArray.find(ato => ato.name === suite.ato);
    if (obj) {
      obj = {
        name: suite.ato,
        lnCredits: [{
          lnCreditType: "RAMP_CREDIT",
          params: {
            type: suite.credit.rampDetail.type,
            dialDownPercent: this.discountToUpdate,
            //term : ""//-- During Programatic Ramp
          }
        }]
      }
    } else {
      this.updatedAtoArray.push({
        name: suite.ato,
        lnCredits: [{
          lnCreditType: "RAMP_CREDIT",
          params: {
            type: suite.credit.rampDetail.type,
            dialDownPercent: this.discountToUpdate,
            //term : ""//-- During Programatic Ramp
          }
        }]
      })
    }
    this.updateCredits();
  }
  showApplyDiscount(suite) {

    suite['displayApply'] = true
    if (suite.credit.rampDetail.overrideDiscountPercent) {
      this.discountToUpdate = suite.credit.rampDetail.overrideDiscountPercent
    }

  }

  sliderChange(data) {
    if (+data.value !== this.discountToUpdate) {
      this.discountToUpdate = +data.value;
    }
  }

  updateCredits(close?) {
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=ATO-RAMP-UPDATE';
    const reqOj = {
      data: {
        enrollments: [{
          enrollmentId: this.enrollmentId,
          atos: this.updatedAtoArray
        }]
      }
    }
    this.eaRestService.postApiCall(url, reqOj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.resetValues();
        this.priceEstimateService.refreshPeGridData.next(true);
        if (close) {
          this.priceEstimateService.showPurchaseAdj = false;
        }
      }
    });

  }

  resetValues() {
    this.updatedAtoArray = [];
    this.selectedCreditCategory = {}
    this.selectedSuite = {};
    this.durationArray = [];
    this.displayAddCredit = false;
    this.selectedDuration = ''
    this.displayDurationDropdown = false;
    this.creditCategoryMap.clear();
  }

  goToSmartSheet() {
    window.open('https://app.smartsheet.com/b/form/82ac06a109be4254bee4af8c2fd07622');
  }

}

