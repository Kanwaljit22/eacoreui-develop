import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';

@Component({
  selector: 'app-spna-benefits-wizard',
  templateUrl: './spna-benefits-wizard.component.html',
  styleUrls: ['./spna-benefits-wizard.component.scss']
})
export class SpnaBenefitsWizardComponent implements OnInit, OnDestroy {

  benefitsArr = [];
  networkArr = [];
  securityArr = [];
  enrollmentArr = [ {
    "name": "NETWORKING & CLOUD",
    "active": true
  },
  {
    "name": "SECURITY",
    "active": false
  }]

  constructor(public priceEstimateService: PriceEstimateService, public renderer: Renderer2,public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    this.renderer.addClass(document.body, 'position-fixed');
    this.renderer.addClass(document.body, 'w-100')
    this.networkArr = [ {
      "suites": "Cisco DNA Switching",
      "value": 62,
      "committed": "8,046.2",
      "threshold": "40,000.00"
    },
    {
      "suites": "Cisco DNA Wireless",
      "value": 12,
      "committed": "8,046.2",
      "threshold": "30,000.00"
    },
    {
      "suites": "Cisco DNA Routing",
      "value": 16,
      "committed": "8,046.2",
      "threshold": "20,000.00"
    }];

    this.securityArr = [ {
      "suites": "Cisco DNA Switching",
      "value": 62,
      "committed": "8,046.2",
      "threshold": "40,000.00"
    },
    {
      "suites": "Cisco DNA Wireless",
      "value": 12,
      "committed": "8,046.2",
      "threshold": "30,000.00"
    }];
    this.benefitsArr = this.networkArr;
  }

  selectEnrollment(val) {
    this.enrollmentArr.forEach((item) => {
      item.active = val.name === item.name ? true : false
   });
    if (val.name === 'SECURITY') {
      this.benefitsArr = this.securityArr;
    } else {
      this.benefitsArr = this.networkArr;
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'position-fixed');
    this.renderer.removeClass(document.body, 'w-100')
  }

}
