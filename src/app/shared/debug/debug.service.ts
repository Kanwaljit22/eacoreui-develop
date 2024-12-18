import { ConstantsService } from '@app/shared/services/constants.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';

@Injectable()
export class DebugService {

  constructor(private http: HttpClient, private appDataService: AppDataService, private constantsService: ConstantsService) { }


  getUserRoles(userid) {

    return this.http.get(this.appDataService.getAppDomain + 'api/home/' + userid + '/roles');

  }


}
