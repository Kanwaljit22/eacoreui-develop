import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';

@Injectable()
export class PurchaseOptionsService {

  constructor(private http: HttpClient, private appDataService: AppDataService, public qualService: QualificationsService) { }

  getPurchaseOptionsData1() {
    return this.http.get('assets/data/purchaseoptions.json');
  }

  getPurchaseOptionsData(dealId: any) {
    // return this.http.get('assets/data/purchaseoptions.json');
    return this.http.get(this.appDataService.getAppDomain + 'api/partner/purchase-authorization?d=' + dealId);

  }

  getPurchaseOptionURL() {
    const url = this.appDataService.getAppDomain + 'api/resource/PURCHASE_OPTION';

    return this.http.get(url);
  }



}
