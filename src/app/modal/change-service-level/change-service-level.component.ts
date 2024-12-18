import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PriceEstimationService, RecalculateAllEmitterObj } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-change-service-level',
  templateUrl: './change-service-level.component.html',
  styleUrls: ['./change-service-level.component.scss']
})
export class ChangeServiceLevelComponent implements OnInit {

  @ViewChild('myDropSupport', { static: false }) myDropSupport;
  disableUpdate = true;
  selectedServiceLevel: string;
  selectedServiceLevelId: number;
  serviceLevels: any;
  currentServiceSupport = 'Basic Support';
  suiteData: any;

  selectedSupport = 'Change Service Level To';


  constructor(public bsModalRef: BsModalRef, public priceEstimationService: PriceEstimationService,
    public localeService: LocaleService, public appDataService: AppDataService) { }

  ngOnInit() {
  }

  close() {
    this.bsModalRef.hide();
  }

  update() {
    const data = [{
      'softwareDiscount': (this.suiteData.softwareDiscount) ? this.suiteData.softwareDiscount : '',
      'softwareServiceDiscount': (this.suiteData.softwareServiceDiscount) ? this.suiteData.softwareServiceDiscount : '',
      'advancedDeployment': (this.suiteData.advancedDeployment) ? this.suiteData.advancedDeployment : '',
      'subscriptionDiscount': (this.suiteData.subscriptionDiscount) ? this.suiteData.subscriptionDiscount : '',
      'advancedDeploymentSelected': (this.suiteData.advancedDeploymentSelected) ? this.suiteData.advancedDeploymentSelected : '',
      'suiteId': this.suiteData.suiteId,
      'multisuiteDiscount': (this.suiteData.multisuiteDiscount) ? this.suiteData.multisuiteDiscount : '',
      'totalSubscriptionDiscount': (this.suiteData.totalSubscriptionDiscount) ? this.suiteData.totalSubscriptionDiscount : '',
      'serviceLevel': this.selectedServiceLevelId
    }];

    this.appDataService.peRecalculateMsg.isConfigurationDone = true;
    this.priceEstimationService.saveDiscount(data).subscribe((res: any) => {
      if (res && !res.error) {
        const recalculateAllEmitterObj: RecalculateAllEmitterObj = {
          recalculateButtonEnable: true,
          recalculateAllApiCall: true
        }
        this.priceEstimationService.isEmitterSubscribe = true;
        this.priceEstimationService.recalculateAllEmitter.emit(recalculateAllEmitterObj);
        this.priceEstimationService.isContinue = true;
      } else {
        // error msg;
      }
    });
    this.bsModalRef.hide();
  }

  changeSupport(obj) {
    if (this.selectedServiceLevel.toLowerCase() !== obj.serviceLevel.toLowerCase()) {
      this.disableUpdate = false;
      this.selectedServiceLevelId = obj.id;
      this.selectedSupport = obj.serviceLevel;
    } else {
      this.disableUpdate = true;
      this.selectedSupport = obj.serviceLevel;
    }
    //if user is ro super user but does not have rw access or for a complete proposal he is using road map then dont enable update button.
    if ((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath) {
      this.disableUpdate = true;
    }
    setTimeout(() => {
      this.myDropSupport.close();
    });
  }

}
