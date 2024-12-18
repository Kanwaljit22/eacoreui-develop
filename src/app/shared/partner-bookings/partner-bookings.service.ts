import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PartnerBookingsService {
  showPartnerBooking = false;
  partnerCount = 0;
  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getPartnerDetailsByCust(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/details-by-partner', requestObj)
      .pipe(map(res => res));
  }
}
