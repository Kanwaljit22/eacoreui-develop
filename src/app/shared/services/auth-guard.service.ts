import { Injectable } from '@angular/core';
import { LocaleService } from './locale.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppDataService } from './app.data.service';
import { MessageService } from './message.service';
import { MessageType } from './message';

import { ConstantsService } from '../../shared/services/constants.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private localeService: LocaleService, public appDataService: AppDataService, private router: Router,
    public messageService: MessageService, public constantsService: ConstantsService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let isAdminUser = false;
    // to is isAdminUser or not from UserInfo
    let isTempAdmin = localStorage.getItem('isAdmin');
    if (isTempAdmin) {
      isAdminUser = isTempAdmin === this.constantsService.FALSE ? false : true;
    }
    // console.log(this.appDataService.userInfo.adminUser);
    // If user has admin access
    if ((this.appDataService.userInfo.adminUser || isAdminUser) && !this.appDataService.proxyUser) {
      return true;
    } else {
      if (this.appDataService.proxyUser) {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'admin.PROXY_MESSAGE'), MessageType.Warning));
      } else {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'admin.MESSAGE'), MessageType.Warning));
      }
      this.router.navigate(['']);
      return true;
    }

  }

}
