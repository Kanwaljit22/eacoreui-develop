import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class CpsService {

  showCPSContent = false;
  showQuoteLink = false;

  constructor(private http: HttpClient, private appDataService: AppDataService, ) { }

  getCpsData(id, isProposalId, type) {
    let urlParameter = 'q=';
    if (isProposalId) {
      urlParameter = 'p=';
    }
    return this.http.get(this.appDataService.getAppDomain + 'api/cases/context?' + urlParameter + id +
      '&pc=' + this.appDataService.pageContext + '&type=' + type)
      .pipe(map(res => res));
  }


  submitCase(cpsObject) {
    return this.http.post(this.appDataService.getAppDomain + 'api/cases', cpsObject)
      .pipe(map(res => res));
  }


  submitPricingCase(file,cpsObject) {

    const formdata: FormData = new FormData();

    const requestObject = {};
    requestObject['data'] = cpsObject.desc;


    if (file && file.name && file.name.length > 0) {
      formdata.append('file', file);
    }

    var jsonString = JSON.stringify(cpsObject);
    formdata.append('payload', jsonString);

    return this.http.post(this.appDataService.getAppDomain + 'api/cases/create-with-attachment', formdata)
      .pipe(map(res => res));

  }


  getCaseList(qualificationID) {

    return this.http.get(this.appDataService.getAppDomain + 'api/cases/all?q=' + qualificationID  + '&type=pricing')

  }


   getCaseList1(qualificationID) {

        return this.http.get('assets/data/Ib-summary/case-list.json')
  }

  
    getNotesByCase(caseID) {

      return this.http.get(this.appDataService.getAppDomain + 'cases/case-by-id/' + caseID )
  }

}
