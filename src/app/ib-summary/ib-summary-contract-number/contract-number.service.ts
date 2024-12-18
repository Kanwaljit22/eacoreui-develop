import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ContractNumberService {

  constructor(private http: HttpClient) { }

  getContractNumberColumns() {
    return this.http.get('assets/data/Ib-summary/contract-numberColumns.json')
      .pipe(map(res => res));
  }

  getContractNumberData() {
    return this.http.get('assets/data/Ib-summary/contract-numberData.json')
      .pipe(map(res => res));
  }


  getContractOutsideData() {
    return this.http.get('assets/data/Ib-summary/contractNumberOutside.json')
      .pipe(map(res => res));
  }

  getContractNoMatchData() {
    return this.http.get('assets/data/Ib-summary/contractNoMatch.json')
      .pipe(map(res => res));
  }



}
