import { Injectable } from '@angular/core';
import { AppRestService } from './app.rest.service';
import { AppDataService } from './app.data.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { MessageService } from './message.service';
import { LocaleService } from './locale.service';
import { PermissionService } from '@app/permission.service';
import { Observable } from 'rxjs';
import { MessageType } from './message';
import { PermissionEnum } from '@app/permissions';
import { map } from 'rxjs/operators';

@Injectable()
export class ToolAuthService {

  constructor(private appDataService: AppDataService, private router: Router, private messageService: MessageService,
    private localeService: LocaleService, private permissionService: PermissionService, private restService: AppRestService) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {

    let permission = route.data.permission;

    if (this.permissionService.permissions.size === 0) {
      return this.restService.getUserDetails().pipe(map((response: any) => {
        if (response && !response.error && response.data) {
          if (response.data && response.data.permissions.featureAccess && response.data.permissions.featureAccess.length > 0) {
            this.permissionService.permissions = new Map(response.data.permissions.featureAccess.map(i => [i.name, i]));
            if (this.permissionService.permissions.has(permission)) {
              this.appDataService.isReload = true;
              return true;
            }
          }
        }
        this.getMessage(permission);
        this.router.navigate(['']);
        return false;
      }));
    } else {
      if (!this.appDataService.userInfo.isPartner && this.permissionService.permissions.has(permission)) {
        return true;
      } else {
        this.getMessage(permission);
        this.router.navigate(['']);
        return false;
      }
    }
  }

  getMessage(permission) {
    if (permission === PermissionEnum.Compliance_Hold) {
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'complianceHold.ACCESS_MESSAGE'), MessageType.Warning));
    } else if (permission === PermissionEnum.Proposal_Exception_Access) {
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'proposalException.ACCESS_MESSAGE'), MessageType.Warning));
    }
  }
}
