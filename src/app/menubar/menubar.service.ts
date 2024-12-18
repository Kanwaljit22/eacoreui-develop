import { AppDataService } from '@app/shared/services/app.data.service';
import { UserInfoJson } from './../header/header.component';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class MenubarService {

  private userPref: any;

  constructor(private http: HttpClient, protected _sanitizer: DomSanitizer, private appDataService: AppDataService) { }

  getMenubarHtml(body: any, options: any): Observable<SafeHtml> {
    return this.http.post(this.appDataService.menubarUrl, body, { 'headers': { 'Content-Type': 'text/plain' }, responseType: 'text' }).
      pipe(map((html: any) => this._sanitizer.bypassSecurityTrustHtml(html)
      ));
  }


  public getMenubarServiceParams(userInfo: UserInfoJson, auth_Id): any {

    let billToAndPriceListStatus = 'N'; // possible values are Y and N
    let userType = 'INTERNAL'; // possible values are INTERNAL or EXTERNAL
    let ipcAcess = 'Yes';

    if (userInfo.userType) {
      userType = userInfo.userType;
    } else if (userInfo.isPartner) {
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
      appTitle: 'EA Prospecting and Proposals',
      application: 'DEALSANDQUOTES',
      priceListStatus: billToAndPriceListStatus,
      billToStatus: billToAndPriceListStatus,
      userType: userType,
      email: userInfo.emailId,
      showHeader: 'N',
      showFooter: 'N',
      fullMenubar: 'Y',
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
