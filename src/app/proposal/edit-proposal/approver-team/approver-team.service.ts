import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators'

@Injectable()
export class ApproverTeamService {

  // modifyPAEmitter = new EventEmitter<any>();
  constructor(private http: HttpClient, private appDataService: AppDataService, private proposalDataService: ProposalDataService) { }

  // to call api for becoming approver
  becomeApprover(requestObj, type) {
    let url = '';
    // check the type of action and set url
    if (type === 'becomeApprover') {
      url = this.appDataService.getAppDomain + 'api/proposal/become-approver';
    } else {
      url = this.appDataService.getAppDomain + 'api/proposal/approval-decision-options';
    }
    return this.http.post(url, requestObj).pipe(map(res => res));
  }

  // to call api for submitting approvers decision
  submitApproverDecision(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/submit-decision', requestObj)
      .pipe(map(res => res));
  }

  // call api for getting become approver decision if approver already becomeApprover
  becomeApproverDecision(proposalId, exceptionType) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    proposalId + '/approver-decision-options/' + exceptionType).pipe(map(res => res));
  }

  requestDocument(proposalId, docId) {
    const file = this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    proposalId + '/purchase-adjustment-document/download?a=' + docId, { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }

  preBecomeApprover(proposalId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/pre-become-approver').pipe(map(res => res));
  }

  submitCaseNumber(proposalId, reqObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/saveCaseNo', reqObj).pipe(map(res => res));
  }

  subscriptionCreditDetails(proposalId){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/renewal/' + proposalId + '/subscription-credit-details');
  }

  downloadSubscriptionDetails(proposalId){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/download-subscription-details',{ observe: 'response', responseType: 'blob' as 'json' });
  }
}
