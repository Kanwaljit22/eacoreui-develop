import { EaRestService } from 'ea/ea-rest.service';
import { Injectable } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, share, retry, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollerService {
  private apiCallObservable: Observable<any>;
  private stopPolling = new Subject();
  poller_service_interval = 1800000;
  poller_service_start_time = 0;
  enable_ui_poller_service = true;

  constructor(private http: HttpClient, private eaRestService: EaRestService) { }

  invokeOauthPollerservice(url:string) : Observable<any> {
    
    this.apiCallObservable = timer(this.poller_service_start_time, this.poller_service_interval).pipe(
      switchMap(() => {
        //this.blockUiService.spinnerConfig.noProgressBar();
        return this.http.get<any>(this.eaRestService.getTwoDotZeroAppDomain + url)
      }
      ),
      retry(2),
      share(),
      takeUntil(this.stopPolling)
   );
   return this.apiCallObservable;
  }


  // invokePostPollerservice(url:string, jsonObject: any) : Observable<any> {
  //   this.apiCallObservable = timer(15000, 10000).pipe(
  //     switchMap(() => this.http.post<any>(url, jsonObject)),
  //     retry(),
  //     share(),
  //     takeUntil(this.stopPolling)
  //  );
  //  return this.apiCallObservable;
  // }

  // stopOauthPollerService(){
  //   this.stopPolling.next();
  // }

}
