import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { map } from 'rxjs/operators';


@Injectable()
export class LinkSmartAccountService {
  xhttp: XMLHttpRequest;
  accountEmitter = new EventEmitter();
  smartAccountData = [];
  showTable = false;
  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getData() {
    const requestObj = {
      'data': {
        'searchString': this.appDataService.customerName,
        'limit': 100,
        'startIdx': 0,
        'prospectKey': this.appDataService.customerID
      }
    };
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/smart-account-filter', requestObj)
      .pipe(map(res => res));
  }

  addSmartAccount(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/agreement/smartAccountLink', requestObj)
      .pipe(map(res => res));
  }

  lookUpAccount(searchString) {
    if (this.xhttp) {
      this.xhttp.abort();
    }
    const requestObj = {
      'data': {
        'searchString': searchString,
        'limit': 100,
        'startIdx': 0,
        'prospectKey': this.appDataService.customerID
      }
    };
    this.xhttp = new XMLHttpRequest();
    const url = this.appDataService.getAppDomain + 'api/prospect/smart-account-filter';
    this.xhttp.open('POST', url, true);
    this.xhttp.overrideMimeType('application/json');
    this.xhttp.setRequestHeader('content-type', 'application/json');
    this.xhttp.responseType = 'json';
    let response;
    this.xhttp.onreadystatechange = () => {
      if (this.xhttp.readyState === 4 && this.xhttp.status === 200) {
        this.showTable = true;
        this.smartAccountData = this.xhttp.response.data;

      }
    };

    this.xhttp.send(JSON.stringify(requestObj));
    if (response) {
      return response;
    }
  }

}
