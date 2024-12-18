import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-guidance-ea-actions',
  templateUrl: './guidance-ea-actions.component.html',
  styleUrls: ['./guidance-ea-actions.component.scss']
})
export class GuidanceEaActionsComponent implements OnInit {
  isPartnerLoggedIn = false;

  constructor(private eaRestService: EaRestService, public eaService: EaService, private router: Router, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    } else {
      this.isPartnerLoggedIn = false;
    }
  }

  routeToUrl(dealNew, buyMore){
    let url = 'ea/deal-new';
    if (dealNew){
      url = 'ea/deal-new';
    } else if(buyMore){
      url = 'ea/subscription-buy-more-suite';
    } else {
      url = 'ea/subscription-modify';
    }
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      if(res && !res.error && res.data){
        if(res.data){
          window.open(res.data);
        }
      }
    });
  }

  goToEaHome(){
    this.router.navigate(['ea/home']);
  }

  goToDownloadPlayBook(){
    let url = 'service-registry/url?track=SALES_CONNECT&service=CHANGE_SUB_PLAYBOOK';
    this.eaRestService.getApiCall(url).subscribe((res: any) => {
      if(res && !res.error && res.data){
        if(res.data){
          window.open(res.data, '_blank');
        }
      }
    });
  }
}
