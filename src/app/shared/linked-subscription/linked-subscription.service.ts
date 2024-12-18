import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LinkedSubscriptionService {

  constructor(  private http: HttpClient,private appDataService :AppDataService) { }
  getSubRefDetails(){
    return this.http.get(this.appDataService.getAppDomain+'api/proposal/sub-ui-url').pipe(map(res =>res));
  }
 
}
