import { AppDataService } from './app.data.service';
import { Injectable, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Injectable()

export class AppRestService {
  constructor(private http: HttpClient) {
  }

  getUserDetails() {
    return this.http.get('../api/home/user')
      .pipe(map(res => res));
  }


  getHeaderDetails(summaryJSON, appDomain) {
    return this.http.post(appDomain + '/api/prospect/prospectheader', summaryJSON)
      .pipe(map(res => res));
  }

  getOauthToken(appDomain) {
    const url = appDomain + 'api/oauth/token';
    return this.http.get(url)
      .pipe(map(res => res));
  }


  getGlobalMenuBarURL(appDomain) {
    const url = appDomain + 'api/resource/GLOBAL_MENU_BAR_URL';
    return this.http.get(url)
      .pipe(map(res => res));
  }

  // api to check and show/hide change sub
  showOrHideChangeSubscription(appDomain){
    return this.http.get(appDomain + 'api/resource/SHOW_CHANGE_SUBSCRIPTION').pipe(map(res => res));
  }

  // api to check limitedModeForSmartSubs
  enableLimitedModeSmartSubs(appDomain){
    return this.http.get(appDomain + 'api/resource/ENABLE_LIMITED_MODE_SMART_SUBSIDIARY').pipe(map(res => res));
  }

  // api to check change sub limited mode
  checkLimitedModeForChangeSubscription(appDomain){
    return this.http.get(appDomain + 'api/resource/ENABLE_LIMITED_MODE_CHANGE_SUBSCRIPTION').pipe(map(res => res));
  }

  displayRenewal(appDomain){
    return this.http.get(appDomain + 'api/resource/SHOW_RENEWAL_OPTION').pipe(map(res => res));
  }

  limitedModeFollowOn(appDomain){
    return this.http.get(appDomain + 'api/resource/ENABLE_LIMITED_MODE_FOLLOWON').pipe(map(res => res));
  }

  getSubscriptionList(appDomain, cid,isRenewal=false,qualId=null){ 
    let uri = 'api/subscriptions?cid='+ cid;
    if(isRenewal){
      uri = uri + '&type=RENEWAL&qid='+qualId;
    } 
    return this.http.get(appDomain + uri).pipe(map(res => res));
  }

  displayMenuBar(appDomain) {
    const url = appDomain + 'api/resource/SHOW_GLOBAL_MENU_BAR';
    return this.http.get(url)
      .pipe(map(res => res));
  }

  getUserRoleDetails() {
    return this.http.get('../api/home/userRoles')
      .pipe(map(res => res));
  }
  applyUserRole(userId, userRole) {
    const reqObj = {};
    return this.http.put('../api/home/assignRole?userId=' + userId + '&userRole=' + userRole, reqObj)
      .pipe(map(res => res));
  }

  executeWalkMe() {
    return this.http.get('../api/resource/EXECUTE_WALK_ME_SCRIPT')
      .pipe(map(res => res));
  }


  getSalesAccountCount(appDomain) {
    return this.http.get(appDomain + 'api/prospect/sales-accounts')
      .pipe(map(res => res));
  }

  getResourceForPollerService(appDomain,resourceName) {
    const url = appDomain + 'api/resource/'+resourceName;
    return this.http.get(url)
      .pipe(map(res => res));
  }
}



