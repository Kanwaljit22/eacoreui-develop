import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDataService } from '../../shared/services/app.data.service';

@Injectable()
export class ProspectdetailSuitesService {

  constructor(private http: HttpClient, private appDataService: AppDataService) {

  }

  getSuitesColumnsData() {
    return this.appDataService.getDetailsMetaData('PROSPECT_SUITE');
  }

}
