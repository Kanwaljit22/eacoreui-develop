import { Subscription ,  Observable } from 'rxjs';
import { AppDataService, SessionData } from './shared/services/app.data.service';
import { Component, Inject, Injectable, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FiltersService } from './dashboard/filters/filters.service';
import { AppRestService } from './shared/services/app.rest.service';
import { Route, Router, NavigationEnd } from '@angular/router';
import { BreadcrumbsService } from '@app/core';
import { BlockUiService } from './shared/services/block.ui.service';
import { UtilitiesService } from './shared/services/utilities.service';
import { ConstantsService } from './shared/services/constants.service';
import { EventTargetInterruptSource, Idle } from '@ng-idle/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionTimeoutComponent } from '@app/modal/session-timeout/session-timeout.component';
import { HeaderService } from './header/header.service';
import { ChangeRoleComponent } from './modal/change-role/change-role.component';
import { ReportFiltersService } from '../app/dashboard/report-filters/report-filters.service';
import { EaService } from 'ea/ea.service';
import { EaStoreService } from 'ea/ea-store.service';
import { LocaleService } from './shared/services/locale.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  isBreadCrumShown: Observable<boolean>;
  navLinks: INavLink[] = new Array<INavLink>();
  idleState = 'NOT_STARTED';
  timedOut = false;
  sessionTimeoutComponent: NgbModalRef;
  changeRoleComponent: NgbModalRef;
  private userInfoSubscription: Subscription;
  displayMenuBar = false;
  userInfoLoaded = false;
  public subscribers: any = {};
  isAuthUser = false;
  isPartner = false;
  isChangeRoleCompLoaded = false;

  constructor(@Inject(DOCUMENT) private document: any, private appRestService: AppRestService, private eaService: EaService, 
    public appDataService: AppDataService, public filtersService: FiltersService,public reportFiltersService: ReportFiltersService,
    public blockUiService: BlockUiService, private router: Router, private breadcrumbsService: BreadcrumbsService,
    public headerService: HeaderService, public renderer: Renderer2, private utilitiesService: UtilitiesService,
    private constantsService: ConstantsService, private idle: Idle, private element: ElementRef, private ngbModal: NgbModal, private eaStoreService: EaStoreService,
    public localizationService : LocaleService) {

    // // sets an idle timeout of 25 minutes.
    // idle.setIdle(1500);
    // // idle.setIdle(15);
    // // sets a timeout period of 5 minutes.
    // idle.setTimeout(300);
    // // idle.setTimeout(3);
    // // sets the interrupts like Keydown, scroll, mouse wheel, mouse down, and etc
    // idle.setInterrupts([
    //   new EventTargetInterruptSource(
    //     this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')
    // ]);

    // // when user click on continue from the popup; reset will be called;
    // idle.onIdleEnd.subscribe(() => {
    //   this.idleState = 'NO_LONGER_IDLE';
    //   this.sessionTimeoutComponent.close();
    // });

    // // when user is timed out
    // idle.onTimeout.subscribe(() => {
    //   this.idleState = 'TIMED_OUT';
    //   this.timedOut = true;
    //   this.logout();
    // });

    // // to open the popup and display warning
    // idle.onIdleStart.subscribe(() => {
    //   this.idleState = 'IDLE_START', this.openProgressForm(1);
    // });

    // // for displaying time in the popup
    // idle.onTimeoutWarning.subscribe((countdown: any) => {
    //   this.idleState = 'IDLE_TIME_IN_PROGRESS';
    //   this.sessionTimeoutComponent.componentInstance.count = (Math.floor((countdown - 1) / 60) + 1);
    //   this.sessionTimeoutComponent.componentInstance.progressCount = this.reverseNumber(countdown);
    //   this.sessionTimeoutComponent.componentInstance.countMinutes = (Math.floor(countdown / 60));
    //   this.sessionTimeoutComponent.componentInstance.countSeconds = countdown % 60;
    // });

    // this.reset(); 

    this.getNavLinks(router.config);
    this.isBreadCrumShown = breadcrumbsService.isBreadCrumShown();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // (<any>window).ga('set', 'page', this.appDataService.pageContext);
        // console.log(`current page context ${this.appDataService.pageContext}`);
        // (<any>window).ga('send', 'pageview');

        if ((this.isPartner || this.appDataService.userInfo.isPartner) && (event.url.indexOf('/prospects') > -1
          || event.url.indexOf('/ib-summary') > -1
          || event.url.indexOf('/prospect-details') > -1)
        ) {

          this.router.navigate(['']);
        }

      }
    });

  }

  ngOnInit() {
    this.eaStoreService.isEa2 = true;
    
      if (document.location.href.search(ConstantsService.EXTERNAL) > 0) {
        const sessionObj: SessionData = this.appDataService.getSessionObject();
        if(this.document.location.href.includes('sub-ui')){
          this.appDataService.isSubUiFlow = true;
          this.appDataService.subUiUrl = this.getAnchorValue()//this.document.location.hash;
          sessionObj['subUiUrl'] = this.appDataService.subUiUrl 
        } else {
          this.appDataService.isSubUiFlow = false;
          this.appDataService.partnerUrl = this.getAnchorValue()//document.location.hash;
          sessionObj['partnerUrl'] = this.appDataService.partnerUrl
        }
  
            this.appDataService.setSessionObject(sessionObj);
      }
    
    this.userInfoSubscription = this.appDataService.menubarUserInfoEmitter.subscribe((userInfo) => {
      console.log('Global menu bar called');
      this.displayMenuBar = true;
      this.isAuthUser = this.appDataService.userInfo.partnerAuthorized && this.appDataService.userInfo.authorized;

      this.isPartner = userInfo.isPartner;

      if ((this.isPartner || this.appDataService.userInfo.isPartner) && (this.router.url.indexOf('/prospects') > -1
        || this.router.url.indexOf('/ib-summary') > -1
        || this.router.url.indexOf('/prospect-details') > -1)
      ) {

        this.router.navigate(['']);
      }

    });
    // const env = this.router.url + 'wdv';
    let keys = Object.keys(this.appDataService.envMap);
    let url = window.location.href;
    for (const key of keys) {
      if (url.includes(key)) {
        this.appDataService.environmentVar = this.appDataService.envMap[key];
        break;
      }
     
    }
    //this.getOauthToken();
    //this.isDisplayMenuBar();
    this.getGlobalMenuBarURL();
    this.getShowOrHideChangeSubscription();
    this.getEnableLimitedModeSmartSubs();
    this.isChangeSubscriptionInLimitedMode();
    //this.displayRenewal();
    this.limitedModeFollowOn();
    console.log(this.appDataService.environmentVar);

    this.appDataService.appDomainName = this.document.location.origin;
    if (navigator.userAgent.indexOf('Mac') > 0) {
      this.renderer.addClass(document.body, 'mac-os');
    }


    
   
    if (!this.eaService.alreadyLoggedIn) {
      this.appDataService.showAnnounceBanneer = true;
    } else {
      this.appDataService.isSuperUserMsgDisplayed = true;
      this.appDataService.showAnnounceBanneer = false;
      this.appDataService.isUserDataLoaded = true;
    }
    
   
    if (!this.eaService.alreadyLoggedIn) {
    
        this.eaService.anchorValue = this.getAnchorValue()
      
        if (this.eaService.anchorValue.search(ConstantsService.EXTERNAL) > 0) {
          const sessionObj: SessionData = this.appDataService.getSessionObject();
         
            if(this.document.location.href.includes('sub-ui')){
              this.appDataService.isSubUiFlow = true;
              this.appDataService.subUiUrl = this.eaService.anchorValue;
              sessionObj['subUiUrl'] = this.eaService.anchorValue
            } else {
              this.appDataService.isSubUiFlow = false;
              this.appDataService.partnerUrl = this.eaService.anchorValue;
              sessionObj['partnerUrl'] = this.eaService.anchorValue
            }
          
          // this.appDataService.partnerUrl = anchorValue;
          // const sessionObj: SessionData = this.appDataService.getSessionObject();
          // sessionObj.partnerUrl = anchorValue;
          // sessionObj['partnerUrl'] = anchorValue;
          this.appDataService.setSessionObject(sessionObj);
        }
        let url = document.location.href.split('qualifications');
        const partsOfUrl = url;
        if (partsOfUrl && partsOfUrl.length > 1) {
          const subsetOfUrl = partsOfUrl[1].substring(1, partsOfUrl[1].length);
          if (subsetOfUrl === this.eaService.anchorValue) {
            this.router.navigate([this.eaService.anchorValue]);
          }
        } else {
          this.router.navigate([this.eaService.anchorValue]);
        }
      
    }

    this.eaService.loadAdrumScript();
    if(this.eaStoreService.isValidationUI){
      this.eaService.navigateToVui();
    }
  }


  getCookie(name) {
    const re = new RegExp(name + '=([^;]+)');
    const value = re.exec(document.cookie);
    console.log(document.cookie);
    console.log('anchorValue = ' + value);
    return (value != null) ? value[1] : null;
  }
  getNavLinks(routes: Route[]) {

    this.navLinks.push(...
      routes.filter((x) => x.data && x.data.nav).map((x) => ({
        text: x.data.nav.text || x.data.text,
        path: x.data.nav.path || x.path,
        exact: x.data.nav.exact
      })));

    routes.forEach((x) => {
      if (x.children) {
        this.getNavLinks(x.children);
      }
    });
  }

  onActivate(event) {
    window.scroll(0, 0);
  }
  ngOnDestroy() {
    //this.resetTimeOut();
  }

  reverseNumber(countdown: number) {
    return (3 - (countdown - 1));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  // openProgressForm(count: number) {
  //   this.sessionTimeoutComponent = this.ngbModal.open(SessionTimeoutComponent, {
  //     backdrop: 'static',
  //     keyboard: false,
  //     windowClass: 'session-timeout',
  //     backdropClass: 'session-backdrop'
  //   });
  //   this.sessionTimeoutComponent.componentInstance.count = count;
  //   this.sessionTimeoutComponent.result.then((result: any) => {
  //     if (result !== '' && result === 'logout') {
  //       this.logout();
  //     } else {
  //       this.reset();
  //     }
  //   });
  // }
  // logout user and redirect to sso page.
  // logout() {
  //   this.sessionTimeoutComponent.close();
  //   this.resetTimeOut();
  //   this.appDataService.logoutEmitter.emit();
  // }

  // resetTimeOut() {
  //   this.idle.stop();
  //   this.idle.onIdleStart.unsubscribe();
  //   this.idle.onTimeoutWarning.unsubscribe();
  //   this.idle.onIdleEnd.unsubscribe();
  //   this.idle.onIdleEnd.unsubscribe();
  // }

  // getOauthToken() {
  //   this.appRestService.getOauthToken(this.appDataService.getAppDomain).subscribe((res: any) => {
  //     if (res && !res.error && res.data && res.data.token) {
  //       //this.appDataService.auth_Id = res.data.token;
  //       this.eaStoreService.authToken = res.data.token
  //       window['WorkspaceCaseInputInfo']["auth"] = this.eaStoreService.authToken;
  //     }
  //   });
  // }



  getGlobalMenuBarURL() {
    this.appRestService.getGlobalMenuBarURL(this.appDataService.getAppDomain).subscribe((res: any) => {
      if (res && !res.error && res) {
        this.appDataService.menubarUrl = res.value;
      }
    });
  }

  // method to call api to check and show/hide change sub
  getShowOrHideChangeSubscription(){
    this.appDataService.displayChangeSub = true;
    // this.appRestService.showOrHideChangeSubscription(this.appDataService.getAppDomain).subscribe((res: any) => {
    //   if(res && res.value && !res.error){
    //     this.appDataService.displayChangeSub = (res.value === 'Y') ? true : false;
    //   }
    // });
  }
  // displayRenewal(){
  //   this.appRestService.displayRenewal(this.appDataService.getAppDomain).subscribe((res: any) => {
  //     if (res && res.value && !res.error) {
  //       this.appDataService.displayRenewal = (res.value === 'Y') ? true : false;
  //     }
  //   });
  // }

  limitedModeFollowOn(){
    this.appRestService.limitedModeFollowOn(this.appDataService.getAppDomain).subscribe((res: any) => {
      if (res && res.value && !res.error) {
        this.appDataService.limitedFollowOn = (res.value === 'Y') ? true : false;
      }
    });
  }
  //enable change sub in limited mode
  isChangeSubscriptionInLimitedMode() {
    this.appRestService.checkLimitedModeForChangeSubscription(this.appDataService.getAppDomain).subscribe((res: any) => {
      if (res && res.value && !res.error) {
        this.appDataService.changeSubInLimitedMode = (res.value === 'Y') ? true : false;
      }
    });
  }
    
  //to check and set limitedModeForSmartSubs
  getEnableLimitedModeSmartSubs(){
    this.appRestService.enableLimitedModeSmartSubs(this.appDataService.getAppDomain).subscribe((res: any) => {
      if(res && res.value && !res.error){
        this.appDataService.limitedModeForSmartSubs = (res.value === 'Y') ? true : false;
      }
    });
  }

  getAnchorValue(){
    const url = document.location.href
    const origin = document.location.origin
    return url.substring(origin.length+1);
        
  }

  getEaHeader() {
    this.subscribers.userInfo = this.appDataService.userInfoObjectEmitter.subscribe(() => {
      this.userInfoLoaded = true;
      this.displayMenuBar = true;
      if (this.appDataService.showUserRolePopup) {
        if (!this.isChangeRoleCompLoaded) {
          this.isChangeRoleCompLoaded = true;
          this.changeRoleComponent = this.ngbModal.open(ChangeRoleComponent, {
            backdrop: 'static',
            keyboard: false
          });
        }
      }
      this.isAuthUser = this.appDataService.userInfo.partnerAuthorized && this.appDataService.userInfo.authorized;
    });
    if (this.userInfoLoaded) {
      if (!this.appDataService.isPatnerLedFlow) {
        return true;
      } else if (this.appDataService.isPatnerLedFlow && !this.appDataService.displayMenuBarToPartner) {
        return true;
      } else {
        return false;
      }
    }
  }
  // isDisplayMenuBar() {
  //   this.appRestService.displayMenuBar(this.appDataService.getAppDomain).subscribe((res: any) => {
  //     if (res && !res.error) {
  //       if (res.value === 'Y') {
  //         this.appDataService.displayMenuBarToPartner = true;
  //       } else {
  //         this.appDataService.displayMenuBarToPartner = false;
  //       }
  //     }
  //   });
  // }
}

export interface INavLink {
  text: string;
  path: string;
  exact: boolean;
}
