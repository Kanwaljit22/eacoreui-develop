import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators'

@Injectable()
export class RequestExceptionStatusService {

  constructor(private http: HttpClient, private appDataService: AppDataService, private proposalDataService: ProposalDataService) { }


  approverHistory() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/approverHistory').pipe(map(res => res));
  }

  requestDocument(proposalId, docId) {
    const file = this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/purchase-adjustment-document/download?a=' + docId, { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }
}
