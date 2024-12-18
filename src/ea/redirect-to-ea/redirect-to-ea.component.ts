import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaPermissionEnum } from 'ea/ea-permissions/ea-permissions';
import { EaPermissionsService } from 'ea/ea-permissions/ea-permissions.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-redirect-to-ea',
  templateUrl: './redirect-to-ea.component.html',
  styleUrls: ['./redirect-to-ea.component.scss']
})
export class RedirectToEaComponent implements OnInit {
  dealId = '';
  quoteId = '';
  sId = '';

  constructor(public localizationService: LocalizationService, public router: Router, private eaPermissionsService: EaPermissionsService, public dataIdConstantsService: DataIdConstantsService) {
  }

  ngOnInit() {
    // if(!this.eaPermissionsService.userPermissionsMap.has(EaPermissionEnum.LookupDealQuote)) {
    //   this.router.navigate(['ea/home']);
    // }
  }

  redirectTo() {
    const params = this.prepareUrl()
    const url =  'eamp?' + params
    this.router.navigateByUrl(url);
  }

  prepareUrl(){
    let url = '';
    if(this.dealId){

      url = url + 'did=' + btoa(this.dealId) + '&'
    }
    if(this.quoteId){
      url = url + 'qid=' + btoa(this.quoteId) + '&'
    } 
    if(this.sId){
      url = url + 'sid=' + btoa(this.sId) + '&'
    }
    if(url.slice(-1) === '&'){
      url = url.substring(0, url.length - 1);
    }

    return url;
}

}
