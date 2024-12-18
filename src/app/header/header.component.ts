import { Subscription } from 'rxjs';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { NgModule } from '@angular/core';
import { HeaderService } from './header.service';
import { AppDataService } from '../shared/services/app.data.service';
import { DOCUMENT } from '@angular/common';
import { BlockUiService } from '../shared/services/block.ui.service';
import { Router } from '@angular/router';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionObj, PermissionService } from '@app/permission.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProxyUserComponent } from '@app/modal/proxy-user/proxy-user.component';
import { MessageService } from '@app/shared/services/message.service';
import { MessageType } from '@app/shared/services/message';
import { PermissionEnum } from '@app/permissions';
import { UtilitiesService } from '@app/shared/services/utilities.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  userInfo: any;
  favoriteBookmarks: any;
  appDetails: any;
  isProxy = false;
  globalMenuBarResponse = '';
  redirectToDashboard = false;
  subscription: Subscription;
  externalLinks= false;
  arrayExternalLink = [];

  constructor(public localeService: LocaleService, @Inject(DOCUMENT) private document: any, public headerService: HeaderService,
    public appDataService: AppDataService, private blockUiService: BlockUiService, private router: Router, private renderer: Renderer2,
    private modalVar: NgbModal, public messageService: MessageService, public permissionService: PermissionService,
    public utilitiesSerivce: UtilitiesService) { }

  ngOnInit() {
    this.userInfo = this.appDataService.getUserInfo();
    this.appDataService.logoutEmitter.subscribe(() => {
      this.logout();
    });
    this.subscription = this.appDataService.proxyEmitterForHeader.subscribe(() => {
      this.userInfo = this.appDataService.getUserInfo();
    });

    this.headerService.getExternalLink().subscribe((resp:any)=> {

      this.arrayExternalLink =  resp.data; 
    });

  }

  showProxy() {
    if (this.permissionService.permissions.has(PermissionEnum.ProxyUser)) {
      return true;
    } else {
      return false;
    }
  }
  
  
  openExternalLink(url) {    
    window.open(url);
    
  }

  showPropExceptions() {
    if (this.permissionService.permissions.has(PermissionEnum.Proposal_Exception_Access)) {
      return true;
    } else {
      return false;
    }
  }

  showComplianceHold() {
    if (this.permissionService.permissions.has(PermissionEnum.Compliance_Hold)) {
      return true;
    } else {
      return false;
    }
  }

  showManageExcepion() {
    if (this.permissionService.permissions.has(PermissionEnum.OPS_TEAM_MEMBER)) {
      return true;
    } else {
      return false;
    }
  }
  // get favorite bookmarks call here
  getFavoriteBookamrks() {

  }

  // get app details
  getAppDetails() {

  }

  logout(): void {
    // this.blockUiService.spinnerConfig.blockUI();
    // this.delGlobalCookiesAndFwdToLogin();
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }

  logoutCounter: number = 0;
  expirationCounter: number = 0;
  expirationTime: number = 10;
  loopWaitMsec: number = 1000;
  iframeNum: number = 8; // subject to change as other tracks finish integration

  // delGlobalCookies() {

  //   const CONTEXT_PATH = '/';
  //   const CONTEXT_DOMAIN = '.cisco.com';
  //   this.delCookieSSO('ObSSOCookie', 'loggedoutcontinue', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookieSSO('SMSESSION', 'LoggedOff', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('SMIDENTITY', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('LtpaToken', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('LtpaToken2', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('SECQURL', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('CP_GUTC', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('LOGGINGOUTSTRING', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('LOGOUTPAGESTRING', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('cdc.cookie.newUser', CONTEXT_PATH, CONTEXT_DOMAIN);
  //   this.delCookie('routing', CONTEXT_PATH, CONTEXT_DOMAIN);
  // }

  // delCookieSSO(name, value, path, domain) {

  //   const today = new Date();
  //   const deleteDate = new Date(today.getTime() - 48 * 60 * 60 * 1000); // minus 2 days
  //   const cookie = name + '=' + value
  //     + ((path == null) ? '' : '; path=' + path)
  //     + ((domain == null) ? '' : '; domain=' + domain)
  //     + ';';
  //   document.cookie = cookie;

  // }

  // delCookie(name, path, domain) {

  //   const today = new Date();
  //   const deleteDate = new Date(today.getTime() - 48 * 60 * 60 * 1000); // minus 2 days
  //   const cookie = name + '='
  //     + ((path == null) ? '' : '; path=' + path)
  //     + ((domain == null) ? '' : '; domain=' + domain)
  //     + '; expires=' + deleteDate;
  //   document.cookie = cookie;
  // }
  // delGlobalCookiesAndFwdToLogin() {

  //   this.delGlobalCookies();
  //   // var loginUrl = '<%= fwdLoginUrl%>';
  //   // window.top.location=loginUrl;
  //   // console.log(this.document.location);
  //   if (this.appDataService.environmentVar === this.appDataService.envMap.cloudapps) {
  //     window.location.href = 'https://cloudsso.cisco.com/autho/logout.html?redirectTo=' + this.appDataService.appDomain;
  //   } else {
  //     window.location.href = 'https://cloudsso-test.cisco.com/autho/logout.html?redirectTo=' + this.appDataService.appDomain;
  //   }
  // }

  openAnnouncement() {
    this.appDataService.showAnnounceBanneer = true;
    this.renderer.addClass(document.body, 'position-fixed');
  }

  openProxy() {
    const modalRef = this.modalVar.open(ProxyUserComponent, { windowClass: 'searchLocaled-modal' });
    modalRef.result.then(result => {
      this.appDataService.proxyUserId = result;
      sessionStorage.setItem('proxyUserId', result);
      this.appDataService.proxyUser = true;
      this.messageService.displayMessages(this.appDataService.setMessageObject('Switched to Proxy User', MessageType.Info));
      this.router.navigate(['/']);
      this.appDataService.proxyUserEmitter.emit();
    }).catch(error => { });
  }

  exitProxy() {
    sessionStorage.removeItem('proxyUserId');
    this.appDataService.proxyUserId = '';
    this.appDataService.proxyUser = false;
    this.appDataService.proxyEmitterForHeader.emit();
    this.subscription.unsubscribe();
    this.appDataService.proxyUserEmitter.emit();
    this.router.navigate(['/']);
  }

  goToComplianceHold() {
    //this.router.navigate(['/manage-compliance-hold']);
    
    if (this.appDataService.environmentVar === this.appDataService.envMap.local) {
      window.open('https://localhost:4200/#/manage-compliance-hold'); // update port before running on local
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.cstg) {
      window.open('https://eaops-cstg.cisco.com/app/#/manage-compliance-hold');
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.wstg) {
      window.open('https://eaops-wstg.cisco.com/app/#/manage-compliance-hold');
    }else if (this.appDataService.environmentVar === this.appDataService.envMap.stg) {
      window.open('https://eaops-stg.cisco.com/app/#/manage-compliance-hold');
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.cloudapps) {
      window.open('https://eaops.cloudapps.cisco.com/app/#/manage-compliance-hold');
    }
  }
  goToManageException(){
    if (this.appDataService.environmentVar === this.appDataService.envMap.local) {
      window.open('http://localhost:8080'); // update port before running on local
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.cstg) {
      window.open('https://eaops-cstg.cisco.com/app/#/');
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.wstg) {
      window.open('https://eaops-wstg.cisco.com/app/#/');
    }else if (this.appDataService.environmentVar === this.appDataService.envMap.stg) {
      window.open('https://eaops-stg.cisco.com/app/#/');
    } else if (this.appDataService.environmentVar === this.appDataService.envMap.cloudapps) {
      window.open('https://eaops.cloudapps.cisco.com/app/#/');
    }
  }

  
}


export interface UserProfileJson {
  data: UserInfoJson;
  error?: any;

}


export interface UserInfoJson {
  firstName?: string;
  lastName?: string;
  userId?: string;
  accessLevel?: number;
  emailId?: string;
  comments?: string;
  isProxy?: boolean;
  loggedInUser?: string;
  authorized?: boolean;
  partnerAuthorized?: boolean;
  rwSuperUser?: boolean;
  roSuperUser?: boolean;
  adminUser?: boolean;
  thresholdExceptionApprover?: boolean;
  adjustmentApprover?: boolean;
  purchaseAdjustmentUser?: boolean;
  dcThresholdExceptionApprover?: boolean;
  secThresholdExceptionApprover?: boolean;
  dnaDiscountExceptionApprover?: boolean;
  permissions?: Map<string, PermissionObj>;
  active?: boolean;
  createQuoteAndDealEnabled?: boolean;
  ipcAccess?: string;
  isPartner?: boolean;
  userType?: string;
  salesAccountView?: boolean;
  distiUser?: boolean;
}
