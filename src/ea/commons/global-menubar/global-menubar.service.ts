import { IUserDetails } from './../../ea-store.service';
import { EaStoreService } from 'ea/ea-store.service';
import { Observable } from 'rxjs';
import { Injectable, SecurityContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GlobalMenubarService {

  private userPref: any;

 currentMenuHtml:SafeHtml;

  
  constructor(private http: HttpClient, protected _sanitizer: DomSanitizer, private eaStoreService: EaStoreService) { }

  getMenubarHtml(body: any, options: any): Observable<SafeHtml> {
 
    // const response =  this.http.post(this.eaStoreService.menubarUrl, body, { 'headers': { 'Content-Type': 'text/plain' }, responseType: 'text' })
    // console.log('this is API response')
    // console.log(response)

    // this.eaStoreService.menubarHtml = response;
    // console.log('this is eaStoreService.menubarHtml')
    // console.log(this.eaStoreService.menubarHtml)

    //  return response.pipe(map((html: any) => this._sanitizer.bypassSecurityTrustHtml(html)))
 // } else {
    return this.http.post(this.eaStoreService.menubarUrl, body, { 'headers': { 'Content-Type': 'text/plain' }, responseType: 'text' }).
    pipe(map((html: any) => this._sanitizer.bypassSecurityTrustHtml(html))
      );
 // }
  }


  public getMenubarServiceParams(userInfo: IUserDetails, auth_Id): any {

    let billToAndPriceListStatus = 'N'; // possible values are Y and N
    let userType = 'INTERNAL'; // possible values are INTERNAL or EXTERNAL
    let ipcAcess = 'Yes';

    if (userInfo && userInfo.userType) {
      userType = userInfo.userType;
    } else if (userInfo.partner) {
      userType = 'EXTERNAL';
    } else {
      userType = 'INTERNAL';
    }
    if (userInfo.createQuoteAndDealEnabled) {
      billToAndPriceListStatus = 'Y';
    }
    if (userInfo.ipcAccess) {
      ipcAcess = userInfo.ipcAccess;
    }

    const menuBody = {
      auth: auth_Id,
      userId: userInfo.userId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      accessLevel: userInfo.accessLevel,
      appTitle: 'EA Proposals',
      application: 'EAPROPOSAL',
      priceListStatus: billToAndPriceListStatus,
      billToStatus: billToAndPriceListStatus,
      userType: userType,
      email: userInfo.emailId,
      showHeader: 'N',
      showFooter: 'N',
      showNextMenubar: 'Y',
      bootstrapFlag: 'N',
      locale: 'en_US',
      showGuidedHelp: 'N',
      ipcAccess: ipcAcess,
      contextualCaseAppCode:'EAMP' 
    };

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
      responseType: 'text' as 'json',
      withCredentials: true
    };

    return { body: menuBody, options: httpOptions };
  }

}
