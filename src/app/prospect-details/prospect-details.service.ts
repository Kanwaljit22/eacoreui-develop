import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppDataService } from '../shared/services/app.data.service';
import { BlockUiService } from '../shared/services/block.ui.service';
import { map } from 'rxjs/operators'
import { Subject } from 'rxjs';

@Injectable()
export class ProspectDetailsService {

  architectureName: string;
  customerName: string;
  reqJSON: any = {};
  columnHeaderList: any[];
  displayManageLocation$: Subject<boolean> = new Subject<boolean>();
  reloadSuites = new EventEmitter();


  constructor(private http: HttpClient, private configService: AppDataService, private blockUiService: BlockUiService) { }

  ASC_ORDER_SORT = 'asc';
  DESC_ORDER_SORT = 'desc';

  getSummaryViewData(summaryJSON) {
    this.blockUiService.spinnerConfig.startChain();
    return this.http.post(this.configService.getAppDomain + 'api/prospect/prospectheader', summaryJSON)
      .pipe(map(res => res));
  }

  getSummaryHeaderColumns() {
    if (!this.columnHeaderList) {
      this.configService.architectureMetaDataObject = this.configService.getSessionObject().architectureMetaDataObject;
      const architectureObjData = this.configService.architectureMetaDataObject;
      for (let i = 0; i < architectureObjData.length; i++) {
        if (architectureObjData[i].selected) {
          this.columnHeaderList =
            architectureObjData[i].modules[0].columns;
          break;
        }
      }
    }
    return this.columnHeaderList;
  }

  getTabData(tabName) {
    // his.reqJSON['user'] = this.configService.userId;
    this.reqJSON['archName'] = this.configService.archName;
    this.reqJSON['customerName'] = this.configService.customerName;
    this.reqJSON['sort'] = {};
    this.reqJSON['page'] = {};

    return this.http.post(this.configService.getAppDomain + 'api/prospect/' + tabName, this.reqJSON)
      .pipe(map(res => res));
  }

  updateRowData(columnData: Array<any>, object: any) {

    for (let j = 0; j < columnData.length; j++) {
      const regionColData = columnData[j];
      object[regionColData.name] = regionColData.value;
    }
  }
  getProposalArchitectures() {
    return this.http.get(this.configService.getAppDomain + 'api/proposal/architectures')
      .pipe(map(res => res));
  }

}
