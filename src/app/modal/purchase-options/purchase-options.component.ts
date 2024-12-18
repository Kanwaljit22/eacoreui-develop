import { Component, OnInit } from '@angular/core';
import { PurchaseOptionsService } from './purchase-options.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-purchase-options',
  templateUrl: './purchase-options.component.html',
  styleUrls: ['./purchase-options.component.scss']
})
export class PurchaseOptionsComponent implements OnInit {
  purchaseOptionUrl: string;
  purchaseAuthData = [];
  purchaseTempAuthData = [];

  constructor(public purchaseOptionsService: PurchaseOptionsService, public activeModal: NgbActiveModal,
    public appDataService: AppDataService, public qualService: QualificationsService,
    public localeService: LocaleService) { }

  ngOnInit() {
    // console.log(this.qualService.qualification.dealId)
    this.getPurchaseOptionUrl(); // This method will get url for purchase options.
    if (this.appDataService.isPurchaseOptionsLoaded && Object.keys(this.appDataService.purchaseOptiponsData).length > 0) {
      this.prepareData();
    } else {
      this.purchaseOptionsService.getPurchaseOptionsData(this.qualService.qualification.dealId).subscribe(
        (response: any) => {
          if (response && response.data) {
            this.appDataService.isPurchaseOptionsLoaded = true;
            this.appDataService.purchaseOptiponsData = response.data;
            this.prepareData();
          } else {
            this.appDataService.purchaseOptiponsData = {};
            this.appDataService.isPurchaseOptionsLoaded = false;
          }
        });
    }
  }

  prepareData(){
    this.appDataService.purchaseOptiponsData.archs.forEach(element => {
      if(element.authorized){
        this.purchaseAuthData.push(element);
      } else {
        this.purchaseTempAuthData.push(element)
      }
    });
  }

  expand(val) {
    val.expanded = !val.expanded;
  }

  getPurchaseOptionUrl() {
    this.purchaseOptionsService.getPurchaseOptionURL().subscribe(
      (response: any) => {
        if (response) {
          this.purchaseOptionUrl = response.value;
        }
      });
  }

  enrollAdditionalAuthorization() {
    const url = this.purchaseOptionUrl;
    window.open(url);
  }

  close() {
    this.activeModal.close();
  }
}
