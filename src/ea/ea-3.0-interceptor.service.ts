import { EaStoreService } from 'ea/ea-store.service';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, takeUntil, tap, finalize } from 'rxjs/operators';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { MessageService } from 'vnext/commons/message/message.service';




@Injectable()
export class Ea_3_0_HttpInterceptorService implements HttpInterceptor {
  activeApiCallCount = 0;
  constructor(public eaStoreService: EaStoreService, private constantsService: ConstantsService, private blockUiService: BlockUiService, private messageService: MessageService) { }

  preRequest(request): HttpRequest<any> {
    if (!request.url.includes(this.constantsService.SYNC_PRICES) && !this.eaStoreService.isPePageLoad) {
      this.activeApiCallCount++;
      this.blockUiService.spinnerConfig.blockUI();
    }
    if (this.eaStoreService.isPePageLoad) {
      this.activeApiCallCount = 0;
      this.blockUiService.spinnerConfig.unBlockUI();
    }

    if (!request.url.includes(this.constantsService.GLOBAL_MENU_BAR_URL) &&
      !request.url.includes(this.constantsService.GET_MENU_HTML)) {
      this.messageService.clear();
      this.messageService.modalMessageClear();
    }

    return request;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = this.setUserIdForLocal(request);   // This line needs to uncomment to run application locally.
    //this.eaStoreService.displayProgressBar = true; 
    if (this.eaStoreService.proxyUserId && !request.url.includes('oauth/token') && !request.url.includes('home/user-proxy') && !request.url.includes('wshandler/getMenuHTML')) {
      if (this.eaStoreService.userInfo?.userId) {
        request = request.clone({
          headers: new HttpHeaders({
            'X-P-User': this.eaStoreService.proxyUserId,
            //  'AUTH_USER': this.eaStoreService.userInfo.userId
          })
        });
      } else {
        request = request.clone({
          headers: new HttpHeaders({
            'X-P-User': this.eaStoreService.proxyUserId
          })
        });
      }
    }
    // else if(!request.url.includes('wshandler/getMenuHTML') && this.eaStoreService.userInfo?.userId) {
    //   request = request.clone({
    //     headers: new HttpHeaders({
    //       'AUTH_USER': this.eaStoreService.userInfo.userId
    //     })
    //   });
    // }

    return next
      .handle(this.preRequest(request))

      .pipe(
        tap((ev: HttpEvent<any>) => {

          if (ev instanceof HttpResponse) {
            //this.eaStoreService.displayProgressBar = false; 
            this.blockUiService.spinnerConfig.displayProgressBar(); //This method will reactive to display progressbar                                                     
          }

        }),
        //takeUntil(this.httpCancelService.onCancelPendingRequests()),
        catchError(response => {
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          // this.eaStoreService.displayProgressBar = false;
          this.blockUiService.spinnerConfig.displayProgressBar(); //This method will reactive to display progressbar
          if (response instanceof HttpErrorResponse) {
            if (response && response.error) {
              this.messageService.displayMessagesFromResponse(response);
            } else {
              this.messageService.displayConnectivityError();
            }
          }
          return observableThrowError(response);
        }),
        finalize(() => {
          if (!request.url.includes(this.constantsService.SYNC_PRICES) && !this.eaStoreService.isPePageLoad) {

            if (this.activeApiCallCount > 0) {
              this.activeApiCallCount--;
            }
            if (!this.activeApiCallCount) {
              this.blockUiService.spinnerConfig.unBlockUI();
            }
          }
        }));
  }

  setUserIdForLocal(request) {
    request = request.clone({
      headers: new HttpHeaders({
        'local-user': 'rbinwani'
      })
    });
    return request;
  }

}