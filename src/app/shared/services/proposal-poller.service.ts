import { BlockUiService } from '@app/shared/services/block.ui.service';
import { Injectable } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, share, retry, takeUntil } from 'rxjs/operators';

@Injectable()
export class ProposalPollerService {


  private apiCallObservable: Observable<any>;
  private stopPolling = new Subject();

  poller_service_interval = 15000;
  poller_service_start_time = 15000
  enable_ui_poller_service = true;



  constructor(private http: HttpClient, private blockUiService: BlockUiService) { }


  invokeGetPollerservice(url:string) : Observable<any> {
    
    this.apiCallObservable = timer(this.poller_service_start_time, this.poller_service_interval).pipe(
      switchMap(() => {
        this.blockUiService.isPollerServiceCall = true;
        return this.http.get<any>(url)
      }
      ),
      retry(),
      share(),
      takeUntil(this.stopPolling)
   );
   return this.apiCallObservable;
  }


  invokePostPollerservice(url:string, jsonObject: any) : Observable<any> {
    this.apiCallObservable = timer(15000, 10000).pipe(
      switchMap(() => this.http.post<any>(url, jsonObject)),
      retry(),
      share(),
      takeUntil(this.stopPolling)
   );
   return this.apiCallObservable;
  }

  stopPollerService(){
    this.blockUiService.isPollerServiceCall = false;
    this.stopPolling.next(true);
  }

 

}
