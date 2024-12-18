import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class InstallSiteNumberService {

  constructor(private http: HttpClient) { }

  getInstallSiteNumberColumns() {
    return this.http.get('assets/data/Ib-summary/install-site-numberColumns.json')
      .pipe(map(res => res));
  }

  getInstallSiteNumberData() {
    return this.http.get('assets/data/Ib-summary/install-site-numberData.json')
      .pipe(map(res => res));
  }

  getInstallOutsideData() {
    return this.http.get('assets/data/Ib-summary/installOutside.json')
      .pipe(map(res => res));
  }

  getInstallNoMatchData() {
    return this.http.get('assets/data/Ib-summary/installNoMatch.json')
      .pipe(map(res => res));
  }

}
