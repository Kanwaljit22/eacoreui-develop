import { ProposalDataService } from './../proposal/proposal.data.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { HeaderService } from '@app/header/header.service';
import { MenubarService } from './menubar.service';
import { Subscription } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';
import { UserInfoJson } from '@app/header/header.component';
declare function getBanner(langCode: string, authToken: string): any;
let myClass;
import * as $ from 'jquery';
import { ConstantsService } from '@app/shared/services/constants.service';
import { EaStoreService } from 'ea/ea-store.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit, OnDestroy {

  menubarHtml: SafeHtml;
  private scripts: Array<any> = [];
  private menubarSubscription: Subscription;
  private userPref: any;
  @ViewChild('ccwMenuContainer', { read: ElementRef, static: false })
  ccwMenuContainer: ElementRef;
  private userInfoSubscription: Subscription;
  isPartner: boolean;
  domLoaded: boolean = false;
  constructor(public appDataService: AppDataService, private menubarService: MenubarService, private renderer: Renderer2, public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService, private eaStoreService: EaStoreService) {

  }

  ngOnInit() {
    myClass = this;
    this.getMenuBar(this.appDataService.userInfo);

    this.appDataService.engageCPSsubject.subscribe((value) => {
      this.toggleOpenCase(value);
    });
    this.appDataService.hideHelpAndSupportSuject.subscribe((value) => {
      this.hideHelpAndSupport(value);
    });
    this.appDataService.openCaseManagementSubject.subscribe((value) => {
      this.displayOpenCaseManagement(value);
    });
  }

  /* getOauthToken(){
     this.headerService.getOauthToken().subscribe((res: any) => {
        if (res && !res.error && res.data) {
         console.log(res.data.token);
          const menuBarRequest = {'auth':'MxywDt5Y4f1rXBi3W3vUlyINHxWA',
          'userId':'rbinwani','firstName':'Romesh','lastName':'Binwani',
          'accessLevel':'4','appTitle':'Enterprise Agreement','application':'eaprospect','priceListStatus':'N',
          'billToStatus':'N','userType':'INTERNAL','email':'rbinwani@cisco.com','showHeader':'N','showFooter':'N',
          'fullMenubar':'N','bootstrapFlag':'N','locale':'en_US','showGuidedHelp':'Y'};
         menuBarRequest['auth'] = res.data.token;
         const params: any = this.menubarService.getMenubarServiceParams();
       this.menubarSubscription = this.menubarService.getMenubarHtml(menuBarRequest, params.options).subscribe((_html) => {
         this.menubarHtml = _html;
         setTimeout(() => { //wait for DOM rendering
           this.scripts = this.ccwMenuContainer.nativeElement.getElementsByTagName('script');
           this.loadScripts();
           //getBanner(this.userPref['DEFAULT_ISO_LANGUAGE_CODE'], this.userPref['ACCESSTOKEN']);
         });
       });
        }
   });
  }*/

  toggleOpenCase(value) {
    if (this.domLoaded) {
      if (value) {
        $("#eaOpenCaseMeWidget").parent().show();
        if ($("#eaOpenCaseMeWidget").parent().hasClass('hideCase')) {
          $("#eaOpenCaseMeWidget").parent().removeClass('hideCase');
        }
        $('.help-feedback-box > span').text('Help & Support');
      } else {
        $("#eaOpenCaseMeWidget").parent().hide().addClass('hideCase');
        $('.help-feedback-box > span').text('Help');
      }
      $('.feedback.no-wid-sep.wstooltipSE').parent().hide();
    }
  }

  checkIfDomLoaded() {
    this.isPartner = this.appDataService.userInfo.isPartner;
    const interval = setInterval(() => {
      // const parentUL = document.getElementsByClassName('support-widget-list')[0];

      $('.help-feedback-box').on('click', (event) => {
        if ($('.help-feedback-box').hasClass('clicked')) {
          $('.support-widget').removeClass('active').addClass('inactive');
        } else {
          $('.support-widget').removeClass('inactive').addClass('active');
        }
      });
      
      const parentUL = $('.support-widget-list')[0];
      if (parentUL) {
        this.domLoaded = true;
        this.toggleOpenCase(this.appDataService.showEngageCPS);
        this.displayOpenCaseManagement(this.appDataService.openCaseManagementSubject.value);
        // to hide feedback
        $('.feedback-case.feedback').remove();
        // Adding annoucnement in help & support  feedback no-wid-sep wstooltipSE
        const announceElement = "<li> <a href='javascript:void(0)' id='announcementWidget' class='wstooltipSE side-announcement' > <i class='icon-announcement'> </i> <span> Announcements </span>  </a> </li>";
        $('.support-widget-list').append(announceElement);
        $("#announcementWidget").on('click', (event) => {
          this.appDataService.showAnnounceBanneer = true;
          this.renderer.addClass(document.body, 'position-fixed');
        });

        // adding guide me in help & support
        const guideMeLi = "<li> <a href='javascript:void(0)' id='guideMeWidget' class='wstooltipSE side-guide-mee' > <i class='icon-guide-me'> </i> <span> Guide Me </span>  </a> </li>";
        $('.support-widget-list').append(guideMeLi);
        $("#guideMeWidget").on('click', (event) => {
          this.appDataService.showGuideMeEmitter.emit('guideMe');
          (<any>$('.help-feedback-box')[0]).click();
          this.toggleOpenCase(this.appDataService.showEngageCPS);
        });

        // changes for  open a case
        // $('.opean-case.wstooltipSE').parent().remove();
        const eampOpenCase = "<li class='hideCase'> <a href='javascript:void(0)' id='eaOpenCaseMeWidget' class='wstooltipSE side-open-case' > <i> </i> <span> Open a Case </span>  </a> </li>";
        $('.support-widget-list').prepend(eampOpenCase);
        $("#eaOpenCaseMeWidget").on('click', (event) => {
          this.appDataService.showGuideMeEmitter.emit('openCase');
          (<any>$('.help-feedback-box')[0]).click();
        });

        this.toggleOpenCase(this.appDataService.showEngageCPS);

        // $('.opean-case.wstooltipSE').removeAttr('href');
        // $('.opean-case.wstooltipSE').removeAttr('actionurl');
        // $('.opean-case.wstooltipSE').on('click',(event) => {
        //   this.appDataService.showGuideMeEmitter.emit('openCase');
        //   (<any>$('.help-feedback-box')[0]).click();
        //   $('.feedback.no-wid-sep.wstooltipSE').parent().hide();
        // });

        $(document).on('click', (event) => {
          let target = $(event.target);
          if(!target.closest('.support-widget').length) {
            if ($('.support-widget').hasClass('active')) {
              $('.support-widget').removeClass('active').addClass('inactive');
            }
          }
        });

        $('.feedback.no-wid-sep.wstooltipSE').parent().attr('id', 'fedback_case');
        // if user is cisco led
        if (!this.isPartner) {
          //remove header from menubar dom
          $("#wsMenubarTemplDiv").find('.ccw-header').remove();
        }
        clearInterval(interval);
      }
    }, 1000);
  }

  getMenuBar(userInfo: UserInfoJson) {
    // const menuBarRequest = {'auth':'MxywDt5Y4f1rXBi3W3vUlyINHxWA','userId':'rbinwani','firstName':'Romesh','lastName':'Binwani','accessLevel':'4','appTitle':'Enterprise Agreement','application':'eaprospect','priceListStatus':'N','billToStatus':'N','userType':'INTERNAL','email':'rbinwani@cisco.com','showHeader':'N','showFooter':'N','fullMenubar':'N','bootstrapFlag':'N','locale':'en_US','showGuidedHelp':'Y'};        
    if (this.menubarHtml === undefined) {
      const params = this.menubarService.getMenubarServiceParams(userInfo, this.eaStoreService.authToken);
      this.menubarSubscription = this.menubarService.getMenubarHtml(params.body, params.options).subscribe((_html) => {
        this.menubarHtml = _html;
        console.log(_html);
        setTimeout(() => { // wait for DOM rendering
          this.scripts = this.ccwMenuContainer.nativeElement.getElementsByTagName('script');
          this.loadScripts(); 
          // getBanner(this.userPref['DEFAULT_ISO_LANGUAGE_CODE'], this.userPref['ACCESSTOKEN']);
        });
      });
    }
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

  ngOnDestroy() {
    if(this.menubarSubscription){
    this.menubarSubscription.unsubscribe();
    }
    if(this.userInfoSubscription){
    this.userInfoSubscription.unsubscribe();
    }
  }
  
  displayMenuBar(){
    let display = true;
    if(this.appDataService.pageContext === this.constantsService.PRICE_ESTIMATION_CX_STEP ||
      (this.appDataService.pageContext === this.constantsService.PROPOSAL_SUMMARY_STEP && this.proposalDataService.cxProposalFlow)
      ){
      display = false;
    } 
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

}
