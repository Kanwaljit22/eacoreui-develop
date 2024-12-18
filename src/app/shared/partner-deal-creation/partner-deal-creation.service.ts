import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { map } from 'rxjs/operators';


@Injectable()
export class PartnerDealCreationService {

  showLoccFlyout = false; // to show LoCC initiation flyout
  constructor(private http: HttpClient, public appDataService: AppDataService, public qualService: QualificationsService) { }


  getLOCCData() {

    if (this.appDataService.myDealQualCreateFlow) {
      return this.loccLandingApiCall(this.appDataService.dealID, this.appDataService.quoteIdForDeal);
    } else {
      return this.getLOA(this.appDataService.partnerParam)

    }
  }

  getLOA(hashValue) {
    if(this.appDataService.isSubUiFlow){
      return this.http.get(this.appDataService.getAppDomain + 'api/external/landing' + hashValue).pipe(map(res => res));
    } else {
      return this.http.get(this.appDataService.getAppDomain + 'api/external' + hashValue);
    }
  }


  loccLandingApiCall(dealId, quoteId) {
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/locc-landing?did=' + dealId + '&qid=' + quoteId)
      .pipe(map(res => res));
  }

  unsignedLOA(hashValue) {

    return this.http.get(this.appDataService.getAppDomain + 'api/partner/loa-unsign/' + hashValue);
  }

  getLOAData(hashValue) {
    return this.http.get('assets/data/loa.json');
  }


  uploadAdditionalDoc(file, url) {
    const formdata: FormData = new FormData();
    formdata.append('file', file);

    return this.http.post(this.appDataService.getAppDomain + url, formdata);
  }

  downloadUnsignedDoc(api) {

    const file = this.http.get(
      this.appDataService.getAppDomain + api,
      { observe: 'response', responseType: 'blob' as 'json' });

    return file;
  }

  initiateDocusign(docuSignUrl) {

    return this.http.get(this.appDataService.getAppDomain + docuSignUrl);
  }
}
