import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SerialNumberService {

  constructor(private http: HttpClient) { }

  getSerialNumberColumnsData() {
    return this.http.get('assets/data/Ib-summary/serialNumberColumns.json')
      .pipe(map(res => res));
  }

  getSerialNumberData() {
    return this.http.get('assets/data/Ib-summary/serialNumberData.json')
      .pipe(map(res => res));
  }

  getSerialNumberOutsideData() {
    return this.http.get('assets/data/Ib-summary/serialNumberOutside.json')
      .pipe(map(res => res));
  }

  getSerialNoMatchData() {
    return this.http.get('assets/data/Ib-summary/serialNoMatch.json')
      .pipe(map(res => res));
  }


}
