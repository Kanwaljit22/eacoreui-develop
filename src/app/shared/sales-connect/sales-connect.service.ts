import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class SalesConnectService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getSalesData() {
    return this.http.get('assets/data/salesConnect.json');
  }

  getSalesConnectResponseData() {
    return this.http.get('assets/data/salesConnectResponse.json');
  }

  getSalesConnectSearchData(searchRequestDataJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/sales-connect/recommended-content', searchRequestDataJSON)
      .pipe(map(res => res));
  }

  getRatingComment() {
    return this.http.get('assets/data/ratingResponse.json');
  }

  downloadDocument(api) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Credentials': 'true'
      })
    };
    // const file =  this.http.get(
    //   api,
    //   { withCredentials: true });

    const file = this.http.get(
      api, httpOptions);

    return file;
  }


}
