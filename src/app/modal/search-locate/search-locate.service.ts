import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class SearchLocateService {

  searchSalesOrder: boolean;
  searchContract: boolean;
  searchInstall: boolean;
  searchSerial: boolean;
  searchSubscription: boolean;

  constructor(private http: HttpClient) { }

  getSearchData() {
    return this.http.get('assets/data/searchLocate.json')
      .pipe(map(res => res));
  }

  getSearchContractData() {
    return this.http.get('assets/data/Ib-summary/searchContract.json')
      .pipe(map(res => res));
  }

  getSearchSerialData() {
    return this.http.get('assets/data/Ib-summary/searchSerial.json')
      .pipe(map(res => res));
  }

  getSearchInstallData() {
    return this.http.get('assets/data/Ib-summary/searchInstall.json')
      .pipe(map(res => res));
  }

}
