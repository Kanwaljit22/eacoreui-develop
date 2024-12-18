import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestAdjustmentService {
  reasonsArray = [];
  reasonCounter = 0;
  isAdjustmentUpdated = false;

  constructor(private http: HttpClient, public appDataService: AppDataService, private proposalDataService: ProposalDataService) { }

  getRowData() {
    return this.http.get('assets/data/proposal/requestAdjustment.json');
  }

  getPurchaseAdjustment(proposalId, suiteID) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/purchase-adjustment?s=' + suiteID)
      .pipe(map(res => res));
  }

  savePurchaseAdjustment(requestObject) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/purchase-adjustment', requestObject)
      .pipe(map(res => res));
  }

  uploadPdfFile(file, proposalId) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/purchase-adjustment/upload', formdata)
      .pipe(map(res => res));
  }

  downloadTemplate() {
    const file = this.http.get(this.appDataService.getAppDomain + 'api/proposal/purchase-adjustment/template/download',
    { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }

  removeFile(id) {
    let proposalId = +id;
    return this.http.delete(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/purchase-adjustment-attachment')
      .pipe(map(res => res));
  }

}

export interface ColoumnDef {
  children?: ColoumnDef[];
  headerName: any;
  field?: any;
  cellClass?: any;
  editable?: any;
  suppressMenu?: any;
  width?: any;
  pinned?: any;
  valueGetter?: any;
  cellRenderer?: any;
  cellEditor?: any;
  valueFormatter?: any;
}

