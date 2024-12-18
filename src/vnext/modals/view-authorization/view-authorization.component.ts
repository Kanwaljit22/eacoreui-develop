import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-view-authorization',
  templateUrl: './view-authorization.component.html',
  styleUrls: ['./view-authorization.component.scss']
})
export class ViewAuthorizationComponent implements OnInit {
  authorizationData:any;
  
  purchaseAuthData = [];
  purchaseTempAuthData = [];
  purchaseAuthDataNew: any = {};
  purchaseOptionUrl = 'https://p2p.cloudapps.cisco.com/WWChannels/PPP/home.do?actionType=home'
  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService ) { }

  ngOnInit() {
      if (this.purchaseAuthDataNew){
        if(this.purchaseAuthDataNew?.unauthorizedAtosByEnrollment || this.purchaseAuthDataNew?.authorizedAtosByEnrollment){
          this.prepareDataNew();
        } else {
          if(this.authorizationData){
            this.prepareData()
          }
        }
      }
    
  }

  prepareDataNew(){
    this.eaService.getLocalizedString('view-authorization');
    if(this.purchaseAuthDataNew?.authorizedAtosByEnrollment){
      this.purchaseAuthDataNew.authorizedAtosByEnrollment.forEach(element => {
        element['expanded'] = false;
      });
    }
    if(this.purchaseAuthDataNew?.unauthorizedAtosByEnrollment){
      this.purchaseAuthDataNew.unauthorizedAtosByEnrollment.forEach(element => {
        element['expanded'] = false;
      });
    }
  }

  prepareData(){
    this.eaService.getLocalizedString('view-authorization');
    this.authorizationData.forEach(element => {
      element['expanded'] = false;
      if(element.authorized){
        this.purchaseAuthData.push(element);
      } else {
        this.purchaseTempAuthData.push(element)
      }
    });
  }
  close() {
    this.activeModal.close();
  }
  expand(val) {
    val.expanded = !val.expanded;
  }

  enrollAdditionalAuthorization() {
    const url = this.purchaseOptionUrl;
    window.open(url);
  }
}
