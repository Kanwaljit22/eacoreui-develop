import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PermissionService } from '@app/permission.service';
import { MessageService } from './message.service';
import { AppDataService } from './app.data.service';
import { MessageType } from './message';
import { LocaleService } from './locale.service';


@Injectable()
export class PermissionGuardService implements CanActivate {

  public subscribers: any = {};

  constructor(private permissionService: PermissionService, private messageService: MessageService,
    private appDataService: AppDataService, private router: Router, private localeService: LocaleService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (route.data.managePermission && route.data.readonlyPermission && this.permissionService.permissions) {
      if (this.permissionService.permissions.has(route.data.managePermission) ||
      this.permissionService.permissions.has(route.data.readonlyPermission)) {
        return true;
      } else {
        if (route.data.tab === 'operations') {
          this.router.navigate(['/support/admin/operations']);
          return false;
        } else if (route.data.tab === 'platform') {
          this.router.navigate(['/support/admin/platform']);
          return false;
        } else if (route.data.tab === 'manage_compliance') {
          this.router.navigate(['']);
          return false;
        } else {
          this.router.navigate(['/support/admin']);
          return false;
        }
      }
    }
  }
}
