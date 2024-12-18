import { Injectable } from '@angular/core';
import { AppDataService } from '../services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable()
export class SuitesBreakdownService {
  reqJSON = {};
  namePersistanceColumnMap = new Map<string, string>();

  constructor(private http: HttpClient, private appDataService: AppDataService, ) { }

  getSuitesData(arch) {
    this.reqJSON['archName'] = arch;
    this.reqJSON['customerName'] = this.appDataService.customerName;
    this.reqJSON['sort'] = {};
    this.reqJSON['page'] = {};

    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/suites', this.reqJSON)
      .pipe(map(res => res));
  }

}
