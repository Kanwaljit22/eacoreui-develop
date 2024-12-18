import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable()
export class TcoApiCallService {

  constructor(private http: HttpClient, private appDataService: AppDataService, public proposalDataService: ProposalDataService) { }


  createTco(tcoName, proposalId) {
    const url = this.appDataService.getAppDomain + 'api/tco';
    const requestObj = {
      'proposalId': proposalId,
      'name': tcoName
    };
    return this.http.post(url, requestObj)
      .pipe(map(res => res));
  }

  // api to get tco count
  getTcoCount(proposalId) {
    const url = this.appDataService.getAppDomain + 'api/tco/' + proposalId + '/tcoCount';
    return this.http.get(url).pipe(map(res => res));
  }

  // This method will call API to get Meta Data.
  getMetaData(tcoId) {
    const url = this.appDataService.getAppDomain + 'api/tco/' + tcoId + '/metadata';
    // const url = this.appDataService.getAppDomain + 'api/tco/catalogue?proposalId='+4371;
    return this.http.get(url)
      .pipe(map(res => res));
  }

  // This method will call API to get tco list
  getTcolist(proposalId) {
    // return this.http.get(this.appDataService.getAppDomain + 'api/tco?p='+this.proposalDataService.proposalDataObject.proposalId).pipe(map(res => res));

    // Hard coding proposal id for time being to get value 
    return this.http.get(this.appDataService.getAppDomain + 'api/tco?p=' + proposalId).pipe(map(res => res));
  }

  // This method will call API to get duplicate tco
  duplicateTco(tcoID) {

    return this.http.get(this.appDataService.getAppDomain + 'api/tco/' + tcoID + '/copy').pipe(map(res => res));

  }

  // This method will call API to delete tco
  deleteTco(tcoID) {
    return this.http.delete(this.appDataService.getAppDomain + 'api/tco/' + tcoID).pipe(map(res => res));
  }

  // this method will call API to get modeling data 
  getTcoModeling(tcoId) {
    const url = this.appDataService.getAppDomain + 'api/tco/' + tcoId;
    return this.http.get(url).pipe(map(res => res));
  }
  // this method will call api for finalizing modeling data
  finalizeModeling(tcoId) {
    const url = this.appDataService.getAppDomain + 'api/tco/' + tcoId + '/finalize';
    return this.http.get(url).pipe(map(res => res));
  }

  // This method will update TCO name
  updateTco(tco) {
    return this.http.post(this.appDataService.getAppDomain + 'api/tco/' + tco.id, tco).pipe(map(res => res));
  }

  implicitSave(tcoId, requestObj) {
    const url = this.appDataService.getAppDomain + 'api/tco/' + tcoId;;
    return this.http.post(url, requestObj)
      .pipe(map(res => res));
  }

  // to get catalog list on customer outcome page
  getCoustOutcomesData() {
    return this.http
      .get(this.appDataService.getAppDomain + 'api/tco/catalogue?proposalId=' + this.proposalDataService.proposalDataObject.proposalId).pipe(map(res => res));
    // .get(this.appDataService.getAppDomain + 'api/tco/catalogue?proposalId=4592' ).map(res =>res);
  }

  saveCustOutcomeData(tcoId, json) {
    return this.http.post(this.appDataService.getAppDomain + 'api/tco/' + tcoId + '/catalogue', json)
      .pipe(map(res => res));
  }


  download(tcoID) {
    return this.http.get(this.appDataService.getAppDomain + 'api/tco/' + tcoID + '/generate-tco-document', { observe: 'response', responseType: 'blob' as 'json' });
  }

  restore(tcoID) {
    return this.http.get(this.appDataService.getAppDomain + 'api/tco/' + tcoID + '/restore');
  }

}
