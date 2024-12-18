import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class SalesOrderService {

  constructor(private http: HttpClient) { }

  getSalesOrderColumnsData() {
    return this.http.get('assets/data/Ib-summary/Ib-summary-salesOrderColumns.json')
      .pipe(map(res => res));
  }

  getSalesOrderData() {
    return this.http.get('assets/data/Ib-summary/Ib-summary-salesOrderData.json')
      .pipe(map(res => res));
  }

  getSalesOrderOutsideData() {
    return this.http.get('assets/data/Ib-summary/salesOrderOutside.json')
      .pipe(map(res => res));
  }

  getSalesNoMatchData() {
    return this.http.get('assets/data/Ib-summary/salesNoMatch.json')
      .pipe(map(res => res));
  }

}
