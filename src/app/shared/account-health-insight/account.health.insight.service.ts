import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AccountHealthInsighService {

  showIbSummaryFlyout = false;
  showSuitesFlyout = false;
  activeAgreementData: any;
  reloadPartnerEmitter = new EventEmitter();
  loadRenewalData = new EventEmitter();
  hasComplianceHoldData = false;
  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getAccountHealthData(archName: string) {
    const requestObj = {
      'data': {
        'customerName': ''
      }
    };
    if (archName !== null && archName !== 'All Architectures') {
      requestObj['data']['archName'] = archName;
    }
    requestObj['data']['customerName'] = this.appDataService.customerName;

    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/accounts-health-insights', requestObj)
      .pipe(map(res => res));
  }

  getRenewaldata(archName, viewType) {
    if (archName === 'ALL ' || archName === 'All Architectures') {
      archName = undefined;
    }
    const requestObj = {
      'data': {
        'customerName': this.appDataService.customerName, 'archName': archName,
        'viewType': viewType
      }
    };
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/renewal', requestObj)
      .pipe(map(res => res));
  }

}
