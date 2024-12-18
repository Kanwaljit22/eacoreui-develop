import { GlobalMenubarService } from './global-menubar.service';
import { EaStoreService, ISessionObject, IUserDetails } from 'ea/ea-store.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2,HostListener } from '@angular/core';
declare function getBanner(langCode: string, authToken: string): any;
let myClass;
import * as $ from 'jquery';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProxyUserComponent } from 'ea/commons/proxy-user/proxy-user.component';
import { Router } from '@angular/router';
import { EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { BroadcastService } from '@app/broadcast.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-global-menubar',
  templateUrl: './global-menubar.component.html',
  styleUrls: ['./global-menubar.component.scss']
})
export class GlobalMenubarComponent implements OnInit, OnDestroy {

  menubarHtml: SafeHtml;
  private scripts: Array<any> = [];
  private menubarSubscription: Subscription;
  private userPref: any;
  @ViewChild('ccwMenuContainer', { read: ElementRef, static: false })
  ccwMenuContainer: ElementRef;
  private userInfoSubscription: Subscription;
  isPartner: boolean;
  domLoaded: boolean = false;


  public subscribers: any = {};
  constructor(public eaStoreService:EaStoreService, private globalMenubarService:GlobalMenubarService, private renderer: Renderer2, private modalVar: NgbModal, private constantsService: ConstantsService,
    private router: Router, private eaService: EaService,protected _sanitizer: DomSanitizer, public localizationService: LocalizationService,private broadcastService: BroadcastService) {

  }

  ngOnInit() {
    myClass = this;
    this.getMenuBar(this.eaStoreService.userInfo);

    this.subscribers.showOpenCaseSubject =  this.eaStoreService.showOpenCaseSubject.subscribe((value: any) => {
      this.displayOpenCase(value);
    });
    this.subscribers.showCaseManagementSubject = this.eaService.showCaseManagementSubject.subscribe((value) => {
      this.displayOpenCaseManagement(value);
    });

    // if(this.eaStoreService.userInfo.userId === 'shashwpa' || this.eaStoreService.userInfo.userId === 'prguntur'){
    //   this.hideMenubar = true;
    // }
  }

 

  displayOpenCase(value) {
    if (this.domLoaded) {
      if (value) {
        // $("#eaOpenCaseMeWidget").parent().show();
        if ($("#eaOpenCaseMeWidget").parent().hasClass('hideCase')) {
          $("#eaOpenCaseMeWidget").parent().removeClass('hideCase');
        }
        // $('.ws-feedback-help-panel > span').text('Help & Support');
      } else {
        // $("#eaOpenCaseMeWidget").parent().hide().addClass('hideCase');
        $("#eaOpenCaseMeWidget").parent().addClass('hideCase');
        // $('.ws-feedback-help-panel > span').text('Help');
      }
      $('.feedback.no-wid-sep.wstooltipSE').parent().hide();
    }
  }

  checkIfDomLoaded() {
    this.isPartner = this.eaStoreService.userInfo.partner;
    const guideMeStr = this.localizationService.getLocalizedString('common.guide-me.GUIDE_ME');
    const proxyStr = this.localizationService.getLocalizedString('common.PROXY');
    const openACaseStr = this.localizationService.getLocalizedString('common.open-case.OPEN_A_CASE');
    const exitProxyStr = this.localizationService.getLocalizedString('common.EXIT_PROXY');
    const interval = setInterval(() => {
      
      const parentUL = $('.support-widget-list')[0];
      if (parentUL) {
        this.domLoaded = true; 
        
        this.displayOpenCase(this.eaStoreService.showOpenCase); 
        this.displayOpenCaseManagement(this.eaService.showCaseManagementSubject.value);
        

        // adding guide me in help & support
        const guideMeLi = `<li style='bottom: -22px;'> <a href='javascript:void(0)' id='guideMeWidget' class='wstooltipSE side-guide-mee' > <i class='icon-guide-me'> </i> <span> ${guideMeStr} </span>  </a> </li>`;
        $('.support-widget-list').append(guideMeLi);
        $("#guideMeWidget").on('click', (event) => {
          window.open('https://salesconnect.cisco.com/softwarebuyingprograms/s/enterprise-agreement-30');
       
         
          (<any>$('.ws-feedback-help-panel')).removeClass('active');
          this.displayOpenCase(this.eaStoreService.showOpenCase);
        });

        // changes for  open a case
        // $('.opean-case.wstooltipSE').parent().remove();
        const eampOpenCase = `<li class='hideCase' style='bottom: -22px;'> <a href='javascript:void(0)' id='eaOpenCaseMeWidget' class='wstooltipSE side-open-case' > <i> </i> <span> ${openACaseStr} </span>  </a> </li>`;
        $('.support-widget-list').append(eampOpenCase);
        $("#eaOpenCaseMeWidget").on('click', (event) => {
          this.eaStoreService.showOpenCase = !this.eaStoreService.showOpenCase;
          (<any>$('.ws-feedback-help-panel')).removeClass('active');
        });

        this.displayOpenCase(this.eaStoreService.showOpenCase);

        clearInterval(interval);
        setTimeout(() => {
          this.checkForAdrumLatest();
        }, 2000); 
        
      }

      $(".commonUserArea .commonSubNav .commonFirstMenu ul").addClass('userDropdown');
      $(".commonFirstMenu .userDropdown li:contains('Manage Proxy')").remove();
      $(".commonFirstMenu .userDropdown li:contains('Logout')").addClass('logoutApp');
      if (this.eaService.showProxy()){
        if (!this.eaStoreService.proxyUser){
          $(".userDropdown").prepend(`<li class="proxyUser"><a href='javascript:void(0);'> ${proxyStr}</a></li>`);
        } else {
          $(".commonName").append('<sup> Proxy</sup>')
          $(".userDropdown").prepend(`<li class='exitProxyUser'><a href='javascript:void(0);'> ${exitProxyStr}</a></li>`);
        }
      } else {
        if (this.eaStoreService.proxyUser){
          $(".commonName").append('<sup> Proxy</sup>')
          $(".userDropdown").prepend(`<li class='exitProxyUser'><a href='javascript:void(0);'> ${exitProxyStr}</a></li>`);
        }
      }
      
      $(".proxyUser").on('click', (event) => {
        const modalRef = this.modalVar.open(ProxyUserComponent, { windowClass: 'searchLocaled-modal' });
            modalRef.result.then(result => {
              if(result) {
                $(".userDropdown").prepend(`<li class='exitProxyUser'><a href='javascript:void(0);'> ${exitProxyStr}</a></li>`);
                $(".userDropdown").find('.proxyUser').remove();
                this.eaStoreService.proxyUserId = result;
                sessionStorage.setItem('proxyUserId', result);
                sessionStorage.removeItem('eaSessionObject');
                this.eaStoreService.proxyUser = true;
               // this.router.navigate(['ea/home']);
                window.location.href = window.location.origin + '/ea/home';
                
                //  window.location.reload();
              //  this.eaStoreService.proxyUserEmitter.emit();
              }
           
        })
      });

      $(".exitProxyUser").on('click', (event) => {
        this.eaService.validateUserProxyAccess()
        this.eaService.updateProxySubject.subscribe((response) =>{
          if (this.eaService.isValidResponseWithoutData(response)){
            $(".userDropdown").prepend(`<li class='proxyUser'><a href='javascript:void(0);'>${proxyStr}</a></li>`);
            $(".userDropdown").find('.exitProxyUser').remove();
            this.eaStoreService.proxyUserId = '';
            sessionStorage.removeItem('proxyUserId');
            sessionStorage.removeItem('eaSessionObject');
            sessionStorage.setItem('exitProxy', 'exit');
            this.eaStoreService.proxyUser = false;
            //window.location.href = window.location.origin + '/#/ea/home';
            window.location.href = window.location.origin + '/ea/home';
            
          }
        })    
      });

      $(".logoutApp").on('click', (event) => {
        console.log('global menubar logout clicked');
        this.broadcastService.sendMessage({ text: this.constantsService.LOGOUT_CLICKED });
        sessionStorage.clear();
        localStorage.clear();
      });

      $('.support-widget-list-outr .menu li a.no-bdr').text('Help & Support');
      $('.support-widget-list-outr .menu li a.no-bdr').prepend('<i class="icon-help"></i>');

      $(document).on('click', (event) => {
        let target = $(event.target);
        if(!target.closest('.support-widget').length) {
          if ($('.ws-feedback-help-panel').hasClass('active')) {
            $('.ws-feedback-help-panel').removeClass('active');
          } else if ($('.support-widget').hasClass('active')) {
            $('.support-widget').removeClass('active').addClass('inactive');
          }
        }
      });

      $('.wsfancyBox-overlay-fixed').addClass('sticky-height');
        $('.commSupportIssue > a').addClass('disabled');
      
     

    }, 1000);
  }

  getMenuBar(userInfo) {
   
    // const menuBarRequest = {'auth':'MxywDt5Y4f1rXBi3W3vUlyINHxWA','userId':'rbinwani','firstName':'Romesh','lastName':'Binwani','accessLevel':'4','appTitle':'Enterprise Agreement','application':'eaprospect','priceListStatus':'N','billToStatus':'N','userType':'INTERNAL','email':'rbinwani@cisco.com','showHeader':'N','showFooter':'N','fullMenubar':'N','bootstrapFlag':'N','locale':'en_US','showGuidedHelp':'Y'};    
  //   const data = this.getSessionObject();
  //  // const localStorage = this.getLocalStorageObject();
  //   if (data) {
  //     console.log('after refresh')
  //     console.log(data)
  //     this.menubarHtml = data//this.globalMenubarService.getMenubarHtmlSession(data);
  //     //this.eaStoreService.menubarHtml = this.menubarHtml;
  //     console.log('after refresh before load')
  //     console.log(this.menubarHtml)
  //     setTimeout(() => { // wait for DOM rendering
  //       this.scripts = this.ccwMenuContainer.nativeElement.getElementsByTagName('script');
  //       this.loadScripts(); 
  //     });
      
      
  //   }else {
      const params = this.globalMenubarService.getMenubarServiceParams(userInfo, this.eaStoreService.authToken);
      this.menubarSubscription = this.globalMenubarService.getMenubarHtml(params.body, params.options).subscribe((_html) => {
        this.menubarHtml = _html;
        //this.eaStoreService.menubarHtml = _html;
        console.log('before refresh')
        console.log(this.menubarHtml)
        setTimeout(() => { // wait for DOM rendering
          this.scripts = this.ccwMenuContainer.nativeElement.getElementsByTagName('script');
          this.loadScripts(); 
        });
      });
  //  }
  }

  private loadScripts() {
    const _script = this.scripts[0];
    this.scripts[0].remove();

    const elmScript = document.createElement('script');

    if (_script.src) {
      elmScript.src = _script.src;
      elmScript.onload = function (script) { myClass.scripts.length ? myClass.loadScripts() : ''; };
    } else {
      elmScript.appendChild(document.createTextNode(_script.text));
      myClass.scripts.length ? myClass.loadScripts() : '';
    }

    document.getElementsByTagName("head")[0].appendChild(elmScript);

    if (myClass.scripts.length === 0) {
      this.checkIfDomLoaded();
    }
  }

  checkForAdrumLatest(){
    const scriptArr = document.getElementsByTagName('script');
    let adrumScript = false;
    for(let i = 0; i < scriptArr.length; i++){
      if(scriptArr[i].src.includes('adrum-latest.js')){
        adrumScript = true;
        break;
      }
    }

    if (!adrumScript) {
      this.eaService.loadAdrumScript();
    }
  }

  ngOnDestroy() {
    if(this.menubarSubscription){
    this.menubarSubscription.unsubscribe();
    }
    if(this.userInfoSubscription){
    this.userInfoSubscription.unsubscribe();
    }
    if(this.subscribers.showCaseManagementSubject) {
      this.subscribers.showCaseManagementSubject.unsubscribe();
    }
  }
  
  displayMenuBar(){
    let display = true;
    return display;
  }
  hideHelpAndSupport(value){
    if (this.domLoaded) {
      if (value) {
        $('.help-feedback-box').parent().hide();
      } else {
        $('.help-feedback-box').parent().show();
      }
    }
  }

  displayOpenCaseManagement(value) {
    if (this.domLoaded) {
      if (value) {
        $('.opean-case.wstooltipSE').parent().show();
      } else {
        $('.opean-case.wstooltipSE').parent().hide();
      }
    }
  }


   private getSessionObject() {

    const sessionObj = sessionStorage.getItem('menubarhtml');
    if (sessionObj) {
      console.log('session value')
      console.log(sessionObj);

      const  data =  JSON.parse(sessionObj);
      console.log('after session  parse')
      console.log(data);
      this.eaStoreService.menubarHtml = data;

      const safeData = this._sanitizer.bypassSecurityTrustHtml(data)
      console.log('safe data')
      console.log(safeData);
      sessionStorage.removeItem('menubarhtml');
      return safeData;
    }
    return null;
  }

  getLocalStorageObject(){
    const storageObj = localStorage.getItem('eaStorageObject');
    let data;
    if (storageObj) {
      data  = JSON.parse(
        storageObj
      );
    return data;
  }
}
}
