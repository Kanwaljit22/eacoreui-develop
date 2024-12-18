import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { map } from 'rxjs/operators'

@Injectable()
export class CxPriceEstimationService {

  constructor(private http: HttpClient, private constantsService: ConstantsService, private appDataService: AppDataService, public proposalDataService: ProposalDataService) { }

  getColumnDefs() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/price-estimate-metadata?archName='+ this.appDataService.archName);
    // return this.http.get('assets/data/cxPriceEstimateColumns.json');
  }

  saveDiscount(data) {
    const requestObject = {
      data: [data]
    };
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    return this.http
      .post(
        this.appDataService.getAppDomain +
        'api/proposal/tcv/suites/discount?p=' +
        proposalId,
        requestObject
      )
      .pipe(map(res => res));
  }

  getData() {
    // return this.http.get('assets/data/proposal/cxPriceEstimateMockData.json').pipe(map(res => res));
     // this.http.get('assets/data/cxPriceEstimateData.json');
 
     return this.http.get('/api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/price-estimate/cx?c=' + this.constantsService.CURRENCY).pipe(map(res => res));
     
   }

  // api to call cascade discount
  getCascadeDiscount(){
    return this.http.get(this.appDataService.getAppDomain +'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/cascade-discounts').pipe(map(res => res));
  }

  viewAndEditHardwareSupport() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+this.proposalDataService.proposalDataObject.proposalId+'/view-hardware-items')
    .pipe(map(res => res));
  }

  openSmartsheet(){
    return this.http.get(this.appDataService.getAppDomain + 'api/qualification/deal-assurers-smartsheet-redirect-url')
    .pipe(map(res => res));
  }

  getPollerServiceUrl(){
    let proposalId = this.proposalDataService.proposalDataObject.proposalId;
    if(this.proposalDataService.relatedCxProposalId){
      proposalId = this.proposalDataService.relatedCxProposalId;
    }
    const url  = this.appDataService.getAppDomain + 'api/proposal/'+proposalId+'/sync-prices';
    return url;
  }
  
  // api to check delisted/threshold error
  getDelistedFlag(){
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+ this.proposalDataService.proposalDataObject.proposalId +'/cx-de-listed-pricing-details').pipe(map(res => res));
  }
}
