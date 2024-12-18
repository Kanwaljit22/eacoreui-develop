import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService, ISessionObject } from './ea-store.service';
import { EaService } from './ea.service';
import { Idle, EventTargetInterruptSource } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SessionTimeoutComponent } from './commons/session-timeout/session-timeout.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { BroadcastService } from '@app/broadcast.service';

@Component({
  selector: 'app-ea',
  templateUrl: './ea.component.html',
  styleUrls: ['./ea.component.scss']
})
export class EaComponent implements OnInit {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  sessionTimeoutComponent: NgbModalRef;

  constructor(private router: Router, private eaService: EaService, public eaStoreService: EaStoreService, public dataIdConstantsService: DataIdConstantsService,
    public blockUiService: BlockUiService, public localizationService: LocalizationService,private idle: Idle, private broadcastService: BroadcastService,
    private keepalive: Keepalive, private ngbModal: NgbModal, private element: ElementRef, private constantService:ConstantsService) { 
    // sets an idle timeout of 10 hours -> 36000 seconds.
    idle.setIdle(36000);
    // idle.setIdle(15);
    // sets a timeout period of 5 minutes.
    idle.setTimeout(300);
    // idle.setTimeout(3);
    // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    idle.setInterrupts([
      new EventTargetInterruptSource(// DOMMouseScroll mousewheel mousedown touchstart touchmove scroll
        this.element.nativeElement, 'keydown')
    ]);

    // when user click on continue from the popup; reset will be called;
    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'NO_LONGER_IDLE';
      this.sessionTimeoutComponent.close();
    });

    // when user is timed out
    idle.onTimeout.subscribe(() => {
      this.idleState = 'TIMED_OUT';
      this.timedOut = true;
      this.logout();
    });

    // to open the popup and display warning
    idle.onIdleStart.subscribe(() => {
      this.idleState = 'IDLE_START', this.openProgressForm(1);
    });

    // for displaying time in the popup
    idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'IDLE_TIME_IN_PROGRESS';
      this.sessionTimeoutComponent.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
      this.sessionTimeoutComponent.componentInstance.progressCount = this.reverseNumber(countdown);
      this.sessionTimeoutComponent.componentInstance.countMinutes = (Math.floor(countdown / 60));
      this.sessionTimeoutComponent.componentInstance.countSeconds = countdown % 60;
    });

    this.reset(); 
  }

  ngOnInit() {
    this.broadcastService.listen((message) => {
      console.log('logout clicked from other tab')
      
      if(message.text === this.constantService.LOGOUT_CLICKED){
        setTimeout(() => {
          window.location.reload();
        }, 5000); 
      }
      
    });
    const alreadyLoggedIn = sessionStorage.getItem('alreadySSOLogin');
    if (!alreadyLoggedIn) {
      sessionStorage.setItem('alreadySSOLogin', 'Yes');
      this.eaService.alreadyLoggedIn = true;
    } 

    if (alreadyLoggedIn === null || alreadyLoggedIn === undefined) {
      this.eaService.anchorValue = this.getValueFromCookie('anchorvalue');
      if (this.eaService.anchorValue && this.eaService.anchorValue.indexOf('#/') >= 0) {
        this.eaService.anchorValue = this.eaService.anchorValue.substring(2, this.eaService.anchorValue.length);
        
        const partsOfUrl = document.location.href.split('#');
        if (partsOfUrl && partsOfUrl.length > 1) {
          const subsetOfUrl = partsOfUrl[1].substring(1, partsOfUrl[1].length);
          if (subsetOfUrl === this.eaService.anchorValue) {
            console.log('check anchorValue')
            console.log(this.eaService.anchorValue)
            //  if(this.eaService.anchorValue.includes('eamp?')){
            //    this.router.navigate(['eamp']);
            //  } else {
              this.router.navigateByUrl(this.eaService.anchorValue);
           // }
            
          }
        } else {
          console.log('check anchorValue')
          console.log(this.eaService.anchorValue)
          //  if(this.eaService.anchorValue.includes('eamp?')){
          //    this.router.navigate(['eamp']);
          //  } else {
            this.router.navigateByUrl(this.eaService.anchorValue);
         // }
        }
      }
    }

    if(window.location.hostname.includes('vui')){
      this.eaStoreService.isValidationUI=true;
    }

  }

  getValueFromCookie(name) {
    const re = new RegExp(name + '=([^;]+)');
    const value = re.exec(document.cookie);

    return (value != null) ? value[1] : null;
  }

  @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {
    if(this.eaStoreService.isLogoutClicked){
      return;
    }    
    if(this.eaStoreService.userInfo.userId){
      const eaSessionObject:ISessionObject = {
        userInfo: this.eaStoreService.userInfo
        //localizationApiCallRequired: this.eaStoreService.localizationApiCallRequired
     };
     if(this.eaStoreService.maintainanceObj?.underMaintainance || this.eaStoreService.maintainanceObj?.maintainanceAnnoucement){
      sessionStorage.setItem(
        'maintainanceObj',
         JSON.stringify(this.eaStoreService.maintainanceObj));
     }
     sessionStorage.setItem(
     'eaSessionObject',
      JSON.stringify(eaSessionObject)); 

      sessionStorage.setItem(
        'feature',
        JSON.stringify({ featureEnbled: this.eaService.isFeatureEnbled }));

        sessionStorage.setItem(
          'featuresArray',
          JSON.stringify({ featureEnbled: this.eaService.features }));
          
            // sessionStorage.setItem(
            //   'menubarhtml',
            //   JSON.stringify(this.eaStoreService.menubarHtml));
          
    }   
    
   
   }

  

   openProgressForm(count: number) {
    this.sessionTimeoutComponent = this.ngbModal.open(SessionTimeoutComponent, {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'session-timeout',
      backdropClass: 'session-backdrop'
    });
   this.sessionTimeoutComponent.componentInstance.count = count;
    this.sessionTimeoutComponent.result.then((result: any) => {
      if (result !== '' && result === 'logout') {
        this.logout();
      } else {
        this.reset();
      }
    });
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  logout() {
    this.sessionTimeoutComponent.close();
    this.resetTimeOut();
    this.blockUiService.spinnerConfig.blockUI();
    this.delGlobalCookiesAndFwdToLogin();

  }

  resetTimeOut() {
    this.idle.stop();
    this.idle.onIdleStart.unsubscribe();
    this.idle.onTimeoutWarning.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
    this.idle.onIdleEnd.unsubscribe();
  }

  reverseNumber(countdown: number) {
    return (3 - (countdown - 1));
  }


  delGlobalCookies() {

    const CONTEXT_PATH = '/';
    const CONTEXT_DOMAIN = '.cisco.com';
    this.delCookieSSO('ObSSOCookie', 'loggedoutcontinue', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookieSSO('SMSESSION', 'LoggedOff', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('SMIDENTITY', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('LtpaToken', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('LtpaToken2', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('SECQURL', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('CP_GUTC', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('LOGGINGOUTSTRING', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('LOGOUTPAGESTRING', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('cdc.cookie.newUser', CONTEXT_PATH, CONTEXT_DOMAIN);
    this.delCookie('routing', CONTEXT_PATH, CONTEXT_DOMAIN);
  }

  delCookieSSO(name, value, path, domain) {

    const today = new Date();
    const deleteDate = new Date(today.getTime() - 48 * 60 * 60 * 1000); // minus 2 days
    const cookie = name + '=' + value
      + ((path == null) ? '' : '; path=' + path)
      + ((domain == null) ? '' : '; domain=' + domain)
      + ';';
    document.cookie = cookie;

  }

  delCookie(name, path, domain) {

    const today = new Date();
    const deleteDate = new Date(today.getTime() - 48 * 60 * 60 * 1000); // minus 2 days
    const cookie = name + '='
      + ((path == null) ? '' : '; path=' + path)
      + ((domain == null) ? '' : '; domain=' + domain)
      + '; expires=' + deleteDate;
    document.cookie = cookie;
  }

  delGlobalCookiesAndFwdToLogin() {

    this.delGlobalCookies();
    if (window.location.href.includes('cloudapps')) {
      window.location.href = 'https://apps.cisco.com/Commerce/logout';
    } else if(window.location.href.includes('wstg')){
      window.location.href = 'https://ccw-wstg.cisco.com/Commerce/logout';
    } else {
      window.location.href = 'https://ccw-cstg.cisco.com/Commerce/logout';
    }
  }

  navigateTo(target){
    switch(target){
      case 'common.TRADEMARKS':
        window.open( this.constantService.TRADEMARK_PAGE_URL , '_blank');
        break;
      case 'common.COOKIE_POLICY':
        window.open(this.constantService.COOKIES_PAGE_URL , '_blank');
        break;
      case 'common.PRIVACY_STATEMENT':
        window.open(this.constantService.PRIVACY_PAGE_URL , '_blank');
        break;
      case 'common.TERMS_CONDITIONS' :
        window.open(this.constantService.TERMS_CONDITIONS_PAGE_URL , '_blank');
        break;
      default:
        console.log("target not matched");
    }
  }

}
