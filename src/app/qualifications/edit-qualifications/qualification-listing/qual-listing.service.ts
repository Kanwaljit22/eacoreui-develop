import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable()
export class QualListingService {

  archName: any;
  customerName: any;
  customerId: any;
  request: any;
  constructor(private http: HttpClient, public configService: AppDataService) { }

  getQualListing() {

    this.request = { 'archName': this.archName, 'customerId': this.customerId };

    return this.http.post(this.configService.getAppDomain + 'api/qualification/list', this.request)
      .pipe(map(res => res));
  }


  getQualListingData() {
    return this.http.get('assets/data/qualification/qual-listingData.json')
      .pipe(map(res => res));
  }

  getQualListingColumnsData() {
    return this.http.get('assets/data/qualification/qual-listingColumns.json')
      .pipe(map(res => res));
  }

  getQualListingSubColumnsData() {
    return this.http.get('assets/data/qualification/qualListingSubColumns.json')
      .pipe(map(res => res));
  }

}
