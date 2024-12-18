import { AppDataService } from './../../shared/services/app.data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QualProposalListObj } from '@app/shared/services/constants.service';
import { map } from 'rxjs/operators'

@Injectable()
export class DealListService {

  showFullList = false;
  dealListData: QualProposalListObj = { data: [], isCreatedByMe: true };
  isCreatedByMe = true;
  isCreatedbyQualView = true;
  dealData: any;
  dealSearchEmitter = new EventEmitter();
  dealSearchChangesEmitter = new EventEmitter();

  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  listQualification(dealData) {
    const requestObj = {};
    requestObj['customerId'] = null;
    requestObj['dealId'] = dealData.dealID;
    return this.http.post(this.appDataService.getAppDomain + 'api/qualification/list', requestObj)
      .pipe(map(res => res));
  }

  getColumnsData() {
    return this.http.get('assets/data/deal-list-columns.json');
  }

}
