import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ManageGeographyService {

  constructor(private http: HttpClient, private appDataService: AppDataService, public qualService: QualificationsService) { }

  saveGeographySelection(theatresArr) {
    let requestObj = {};
    requestObj['userId'] = this.appDataService.userId;
    requestObj['archName'] = this.appDataService.archName;
    requestObj['qualId'] = this.qualService.qualification.qualID;
    requestObj['includedTheatres'] = theatresArr;  // Converting set to array as set is not supported in json

    return this.http.put(this.appDataService.getAppDomain + 'api/qualification/geoselection', requestObj)
      .pipe(map(res => res));
  }

}
