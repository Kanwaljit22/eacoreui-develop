import { EaService } from 'ea/ea.service';


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EaRestService } from './ea-rest.service';
import { EaStoreService, ISessionObject } from './ea-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
;

@Injectable({
  providedIn: 'root'
})
export class UserResolverService {


  constructor(private eaRestService: EaRestService, private eaStoreService: EaStoreService, private eaService: EaService, private localizationService: LocalizationService) { }



  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.eaService.checkFeature();
    const sessionobject: ISessionObject = this.getSessionObject();
    const storageObj = this.getLocalStorageObject();
    const proxyId = sessionStorage.getItem('proxyUserId');
    this.eaService.getActiveFeature();
    if (proxyId) {
      this.eaStoreService.proxyUser = true;
      this.eaStoreService.proxyUserId = proxyId;
    }
    const exitProxy = sessionStorage.getItem('exitProxy');
    if (exitProxy){
      sessionStorage.removeItem('exitProxy');
    }
    const ea2Session = sessionStorage.getItem('isEa2Session')
    const ea3flow = (window.location.href.indexOf('/ea/') > -1)  
    if (ea2Session && ea3flow) { // user is coming from 2.0 to 3.0
      sessionStorage.removeItem('ea2Session')
      const url = 'home/user';
      return this.eaRestService.getApiCall(url).pipe(
        catchError(() => {
          return of("No User Found");
        })
      );
      } else {
        if (sessionobject && sessionobject.userInfo && !proxyId && !exitProxy) {
          // sessionStorage.removeItem('sessionObject');
          console.log('through session storage');
          return { data: sessionobject.userInfo };
        } else if(storageObj && storageObj.userInfo && !proxyId && !exitProxy){
          console.log('through local storage');
          return { data: storageObj.userInfo };
        } else {
          const url = 'home/user';
          return this.eaRestService.getApiCall(url).pipe(
            catchError(() => {
              return of("No User Found");
            })
          );
      }
    
    }
  }

  private getSessionObject() {

    const sessionObj = sessionStorage.getItem('eaSessionObject');
    if (sessionObj) {
      return JSON.parse(
        sessionObj
      );
    }
    return null;
  }

  getLocalStorageObject(){
    const storageObj = localStorage.getItem('eaStorageObject');
    if (storageObj) {
      const data = JSON.parse(
        storageObj
      );
      if(data.maintainanceObj){
        this.eaStoreService.maintainanceObj = data.maintainanceObj
      }
      if(data.features){
        this.eaService.features = data.features
      }
      if(data.localizationString){
        this.localizationService.localizedString = new Map(Object.entries(data.localizationString) );
        this.localizationService.localizedkeySet =new Set(data.localizedkeySet);
      }
      localStorage.removeItem('eaStorageObject');
      return data;
    }
  }
}
