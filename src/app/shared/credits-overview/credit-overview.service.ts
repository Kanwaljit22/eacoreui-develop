import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '../services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreditOverviewService {

  filterAppliedCount: number = 0;
  manageColumnEmitter = new EventEmitter();
  resetFilter = new EventEmitter();
  constructor(private http: HttpClient, private proposalDataService: ProposalDataService,
    private appDataService: AppDataService ) { }

  getData() {
    return this.http.get('assets/data/creditOverview.json');
  }

  


    getMetaData(type){

       return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +this.proposalDataService.proposalDataObject.proposalId +  '/credit-overview/meta-data/'+ this.appDataService.archName+ '_'+ type);
       //return this.http.get(this.appDataService.getAppDomain + 'api/proposal/credit-overview/meta-data/'+ this.appDataService.archName+ '_'+ type);

  }


  

    getCreditData(reqObj){
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/credit-overview', reqObj)
            .pipe(map(res => res));
  }


    initiateExceptionRequest() {
    let url = this.appDataService.getAppDomain + 'api/proposal/';
    url += this.proposalDataService.proposalDataObject.proposalId + '/initiate-exception-request';
    return this.http.get(this.appDataService.getAppDomain + "api/proposal/" + this.proposalDataService.proposalDataObject.proposalId + "/initiate-exception-request?exceptionType=PURCHASE_ADJUSTMENT_REQUEST")
      .pipe(map(res => res));
  }


submitEngagement(reqObj){
  
  return this.http.post(this.appDataService.getAppDomain + 'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/initiate-pa-request', reqObj)
            .pipe(map(res => res));
  }

    // api to check show engage support or not for purchase adjustment 
  showPAEngageSupport() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/pa-init-status?proposalId=' + this.proposalDataService.proposalDataObject.proposalId);
  }

  // api to remove engage support for purchase adjustment 
  removePAEngageSupport(type) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/pa-request/' + type);
  }



}
