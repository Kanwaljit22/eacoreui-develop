import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { EaService } from 'ea/ea.service';
import { EaPermissionEnum } from 'ea/ea-permissions/ea-permissions';
import { PollerService } from 'ea/poller.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationEnum } from 'ea/commons/enums/localizationEnum';
@Component({
  selector: 'app-ea-flow',
  templateUrl: './ea-flow.component.html',
  styleUrls: ['./ea-flow.component.scss']
})
export class EaFlowComponent implements OnInit {

  readonly localizationKeys = [LocalizationEnum.common, LocalizationEnum.ng_pagination, LocalizationEnum.eaLanding, LocalizationEnum.select_more_bu, LocalizationEnum.financial_summary, LocalizationEnum.initiate_locc, LocalizationEnum.initiate_locc_message, LocalizationEnum.edit_project, LocalizationEnum.ea_dashboard, LocalizationEnum.associated_subscriptions_list,LocalizationEnum.renewal];
  constructor(private activatedRoute: ActivatedRoute, public eaStoreService : EaStoreService,private eaRestService:EaRestService, private renderer: Renderer2,
    private eaPermissionsService: EaPermissionsService, private eaService:EaService, private pollerService: PollerService, public localizationService: LocalizationService) { }
  ngOnInit(): void {
     this.eaService.getLocalizedString(this.localizationKeys, true);
    //this.eaStoreService.localizationApiCallRequired = this.activatedRoute.snapshot.data.localizationResolve.value === 'Y' ? true : false;
    //this.checkForLocalization();
 //   this.eaService.getLocalizedString('common');
    this.eaStoreService.userInfo = this.activatedRoute.snapshot.data.userData.data;
    if ((window.location.href.indexOf('/ea/') < 0)) {
       sessionStorage.setItem('isEa2Session', 'true')
    } else {
      sessionStorage.removeItem('isEa2Session');
    }
    let userInfo : any
    userInfo = this.eaStoreService.userInfo;
    // check if proxied and userInfo not present, reset the proxy params and recall user api
    if (this.eaStoreService.proxyUser && !userInfo) {
      this.eaStoreService.proxyUserId = '';
      sessionStorage.removeItem('proxyUserId');
      sessionStorage.removeItem('eaSessionObject');
      sessionStorage.setItem('exitProxy', 'exit');
      this.eaStoreService.proxyUser = false;
      window.location.reload();
    }
    if( this.activatedRoute.snapshot.data.userData?.maintainace){
      this.eaStoreService.maintainanceObj = this.activatedRoute.snapshot.data.userData.maintainace
    }

    if(userInfo && userInfo.permissions && userInfo.permissions.featureAccess && userInfo.permissions.featureAccess.length){
      this.eaPermissionsService.userPermissionsMap = new Map(userInfo.permissions.featureAccess.map(permission => [permission.name, permission]));
      this.eaService.checkForSuperUser();
      }

    if(sessionStorage.getItem('maintainanceObj')){
      this.eaStoreService.maintainanceObj = JSON.parse(sessionStorage.getItem('maintainanceObj'));
      sessionStorage.removeItem('maintainanceObj')
    }
   
    this.getOauthToken();
    if (!this.eaStoreService.isValidationUI) {
      this.getMenuBarUrl();  
   }
    //this.checkForTrilium();
    sessionStorage.removeItem('eaSessionObject');
  }


  getOauthToken() {
    let url = 'oauth/oktatoken'; 
    this.pollerService.invokeOauthPollerservice(url).subscribe((res: any) => {
    //this.eaRestService.getEampApiCall(url).subscribe((res: any) => {
      if (res && !res.error && res.data && res.data.token) {
        this.eaStoreService.authToken = res.data.token;
        window['WorkspaceCaseInputInfo']["auth"] = this.eaStoreService.authToken;
        window['token'] = this.eaStoreService.authToken;

      }
    });
  }

  getMenuBarUrl(){
    const url =  'resource/GLOBAL_MENU_BAR_URL';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (response && !response.error) {
        this.eaStoreService.menubarUrl = response.value;
      }
    });
  }

}
