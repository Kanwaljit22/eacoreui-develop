import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService } from '../../shared/services/app.data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RecommendedContentService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }


  getRecommendedContentData(searchquery): Observable<any> {

    return this.http.post(this.appDataService.getAppDomain + 'api/sales-connect/recommended-content-fetch', searchquery)
      .pipe(map((res: any) => res));
  }


}
