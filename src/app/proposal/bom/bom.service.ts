import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProposalDataService } from '../proposal.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class BomService {

  constructor(private http: HttpClient, private appDataService: AppDataService, public proposalDataService: ProposalDataService) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  linkedQuoteId: any;
  getBomGridRowData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/bom?p='
      + this.proposalDataService.proposalDataObject.proposalId, this.httpOptions)   
      .pipe(map(res => res));
  }

  // if goToQuote call deal-quotes else call conversion-deal-quotes api
  getDealQuotes(type) {
    if (type === 'goToQuote') {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/deal-quotes', this.httpOptions)
       .pipe(map(res => {
          return res;
        }));
    } else {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
        this.proposalDataService.proposalDataObject.proposalId + '/conversion-deal-quotes', this.httpOptions)
       .pipe(map(res => {
          return res;
        }));
    }
  }

  generateBomToQuote() {
    let json;
    if (this.linkedQuoteId) {
      json = {
        'proposalId': this.proposalDataService.proposalDataObject.proposalId,
        'quoteId': this.linkedQuoteId
      };
    } else {
      json = { 'proposalId': this.proposalDataService.proposalDataObject.proposalId };
    }

    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/bom-to-quote', json)
      .pipe(map(res => res));
  }

  // generateBomToQuote() {
  //   let json = { 'proposalId': this.proposalDataService.proposalDataObject.proposalId };
  //   return this.http.post(this.appDataService.getAppDomain + 'api/proposal/bom-to-quote', json)
  //     .pipe(map(res => res));
  // }

  downloadBOMPreview() {
    const file = this.http.get(
      this.appDataService.getAppDomain + 'api/proposal/bom/download?p=' + this.proposalDataService.proposalDataObject.proposalId,
      { observe: 'response', responseType: 'blob' as 'json' });
    return file;
  }

  getQuoteUrl(proposalId, quoteId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/goToCCWQuote?p=' + proposalId + '&q=' + quoteId).pipe(map(res => res));
  }

  getMLBData() {
    return this.http.get('assets/data/singleMLBData.json');
  }

  getCxLinkedProposalList(proposalId, linkId){
    return this.http.get(
    this.appDataService.getAppDomain + 'api/proposal/' + proposalId + "/link-proposals?linkId=" + linkId);
    }
}
