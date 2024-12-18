import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';


@Injectable({
  providedIn: VnextResolversModule
})
export class HttpCancelService {

  constructor() { }

  private cancelPendingRequests$ = new Subject<void>();


  /** Cancels all pending Http requests. */
  public cancelPendingRequests() {
    this.cancelPendingRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.cancelPendingRequests$.asObservable();
  }
}
