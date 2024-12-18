
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, takeUntil, tap} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { AppDataService } from "./app.data.service";

import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from "@angular/common/http";
import { MessageService } from "./message.service";
import { HttpCancelService } from "./http.cancel.service";
import { BlockUiService } from "./block.ui.service";
import { GuideMeService } from '@app/shared/guide-me/guide-me.service';
import { CpsService } from '@app/shared/cps/cps.service';
import { ConstantsService } from "./constants.service";

@Injectable()
export class Ea_2_0_HttpInterceptor implements HttpInterceptor {
  constructor(
    private appDataService: AppDataService,
    private messageService: MessageService,
    private httpCancelService: HttpCancelService,
    private blockUiService: BlockUiService,
    public guideMeService: GuideMeService,
    public cpsService:CpsService,
    private constantsService: ConstantsService
  ) {}

  preRequest(request): HttpRequest<any> {

    // make custom loader = false during guide-me/req doc and few other api calls
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep) {
      this.appDataService.avoidCustomBlocker.forEach(element => {
        if (request.url.includes(element) && this.blockUiService.spinnerConfig.customBlocker) {
          this.blockUiService.spinnerConfig.customBlocker = false;
        }
      });
    }
    if (this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.userDashboard) {
      this.blockUiService.spinnerConfig.blockUI();
    }
    if (!this.appDataService.persistErrorOnUi) {
      this.messageService.clear();
      this.messageService.modalMessageClear();
    }
    return request;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
  //  request = this.setUserIdForLocal(request);   // This line needs to uncomment to run application locally.
    if(this.appDataService.proxyUser) {
      if(sessionStorage.getItem('proxyUserId')) {
        if(!this.appDataService.proxyUser) {
          this.appDataService.proxyUser = true;
          this.appDataService.proxyUserId = sessionStorage.getItem('proxyUserId');
        }
        if(this.appDataService.userInfo?.userId){
          request = request.clone({
            headers: new HttpHeaders({
              'X-P-User': this.appDataService.proxyUserId,
           //   'AUTH_USER': this.appDataService.userInfo.userId
            })
          });
        } else {
          request = request.clone({
            headers: new HttpHeaders({
              'X-P-User': this.appDataService.proxyUserId
            })
          });
        }
      }
    } 
    // else if(!request.url.includes('wshandler/getMenuHTML') && this.appDataService.userInfo?.userId){
    //   request = request.clone({ 
    //     headers: new HttpHeaders({
    //       'AUTH_USER': this.appDataService.userInfo.userId
    //     })
    //   });
    // }

    return next
      .handle(this.preRequest(request)).pipe(
      tap((ev: HttpEvent<any>) => {
       
        if (ev instanceof HttpResponse) {      

          // set custom loader to true if user is still on PE page
          if(this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep){
            this.blockUiService.spinnerConfig.customBlocker = true;
          }      
          if (!this.blockUiService.spinnerConfig.chain) {
            //unblock UI as there are no more chain
            if(this.guideMeService.guideMeText && this.guideMeService.retainGuideMeOnPageChange){
              this.guideMeService.guideMeText = true;
            } else if (this.guideMeService.guideMeText){
              this.guideMeService.guideMeText = false;
              this.cpsService.showCPSContent = false;
            }
              this.blockUiService.spinnerConfig.unBlockUI();
          }   
          
        }
        
      }),
      takeUntil(this.httpCancelService.onCancelPendingRequests()),
      catchError(response => {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        if(this.guideMeService.guideMeText && this.guideMeService.retainGuideMeOnPageChange){
          this.guideMeService.guideMeText = true;
        } else if (this.guideMeService.guideMeText){
          this.guideMeService.guideMeText = false;
          this.cpsService.showCPSContent = false;
        }           
          this.blockUiService.spinnerConfig.unBlockUI();
        if (response instanceof HttpErrorResponse) {
          if (response && response.error) {
            this.messageService.displayMessagesFromResponse(response);
          } else {
            this.messageService.displayConnectivityError();
          }
        }       
        return observableThrowError(response);
      }),);
  }


  setUserIdForLocal(request){
    if(this.appDataService.environmentVar === this.appDataService.envMap.local){    
      if(!this.appDataService.proxyUser) {
        //if not a proxy user add local-user in the request header
        request = request.clone({
          headers: new HttpHeaders({
            'local-user': this.constantsService.USER_ID
          })
        });
      }
    }
    return request;
  }
}
