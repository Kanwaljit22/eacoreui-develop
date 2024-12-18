import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';

@Injectable()
export class ManageComplianceHoldNewService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getComplianceHoldData() {
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/' + this.appDataService.customerID + '/compliance-hold-data', null);
  }
}
