import { HttpClient } from '@angular/common/http';
import { AppDataService } from './../services/app.data.service';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class CountriesPresentService {
  showCountriesPresent = false;
  constructor(private http: HttpClient, private appDataService: AppDataService) { }

  getCountryDetailsByCust(requestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/country', requestObj)
      .pipe(map(res => res));
  }

}
