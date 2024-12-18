import { Injectable, EventEmitter } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class RenewalSubscriptionService {

  selectSubsriptionReponse: any; // set to store renewal response data after saving selected subsbs in renewals page
  selectedSubscriptions = []; 
  saveRenewalParametersEmitter = new EventEmitter<any>();

  constructor(private http: HttpClient, public appDataService: AppDataService, public qualService: QualificationsService) { }


 // api to send selected subscription for renewal
 renewalSubscription(reqObj){
  return this.http.post(this.appDataService.getAppDomain + 'api/subscriptions/renewal/parameters', reqObj).pipe(map(res => res));
 //return this.http.get('assets/data/qualification/eaRenewalsData.json').pipe(map(res => res));
}


getQnAForRenewalParameter(renewalId){
 return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/renewal/'+ renewalId+'/qna').pipe(map(res => res));
}

  // api to save renewal parameters
  saveRenewalParameters(reqObj){
    return this.http.post(this.appDataService.getAppDomain + 'api/subscriptions/renewal', reqObj).pipe(map(res => res));
  }


  // api to get proposal list 
  getProposalList(renewalId) {

      return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/renewal/' + renewalId + '/preview-renewals')
  }

  // api to create proposal 
  createProposal(renewalId) {

      return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/renewal/' + renewalId + '/generate-proposals')
  }
    
  // api to fect renewal data 
  fetchRenewals(renewalId){
      return this.http.get(this.appDataService.getAppDomain + 'api/subscriptions/renewal/' + renewalId).pipe(map(res => res));
  }

  resetRenewalData(){
    this.selectSubsriptionReponse = undefined;
    this.selectedSubscriptions = [];
  }

}
