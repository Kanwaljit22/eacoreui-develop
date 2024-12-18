import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ActiveAgreementsService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getColDataConsumption() {
    return this.http.get('assets/data/agreements/consumptionMetaData.json');
  }

  getColDataAgreements() {
    return this.http.get('assets/data/agreements/agreementsMetaData.json');
  }

  getAgreementsData() {
    const prospectkey = this.appDataService.customerID;
    // return this.http.get(this.appDataService.getAppDomain + `api/prospect/agreement/sma-va?prospectKey=${prospectkey}` )
    // .pipe(map(res => res));

    const response = {
      'rid': '4dfe844b-1adb-4807-8cb7-8adebe3c1294',
      'user': 'bhikumar',
      'error': false,
      'data': {
        'id': 109100,
        'name': 'AUTOLIV',
        'status': 'ACTIVE',
        'domain': 'autoliv.com',
        'type': 'CUSTOMER',
        'accounts': [{
          'id': 264484,
          'name': 'CiscoELA-CiscoONE',
          'status': 'ACTIVE',
          'domain': null,
          'type': null,
          'startDate': '23 Apr 2019',
          'endDate': '22 Apr 2022',
          'duration': 3,
          'remainingDuration': 3,
          'subscriptionID': 'Sub255892',
          'numberOfSuites': 2,
          'totalEntitlements': 4008,
          'totalConsumption': 2904,
          'remainingEntitlements': 1104,
          'nextTrueForward': '17 Sep 2020',
          'architecture': 'cross_arch'
        },
        {
          'id': 266044,
          'name': 'Security EA 2.0 Choice',
          'status': 'ACTIVE',
          'domain': null,
          'type': null,
          'startDate': '15 May 2019',
          'endDate': '14 May 2022',
          'duration': 3,
          'remainingDuration': 3,
          'subscriptionID': 'Sub259157',
          'numberOfSuites': 5,
          'totalEntitlements': 182578,
          'totalConsumption': 64405,
          'remainingEntitlements': 118173,
          'nextTrueForward': '14 May 2020',
          'architecture': 'cisco_security_choice'
        }
        ],
        'page': {
          'totalRows': 2,
          'pageSize': 100,
          'startIdx': 0
        }
      }
    };

    return of(response).pipe(map(res => res));

  }

  getConsumptionData() {
    return this.http.get('assets/data/agreements/agreementsMetaData.json');
  }

}
