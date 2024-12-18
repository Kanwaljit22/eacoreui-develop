import { ConstantsService } from '@app/shared/services/constants.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';

@Injectable()
export class ActivityLogService {

  constructor(private http: HttpClient, private appDataService: AppDataService, private constantsService: ConstantsService) { }


  getActivityLogData(id, activityType, dateRange) {
    return this.http
    .get(this.appDataService.getAppDomain + 'api/activitylog/downloadLogs?id=' + id + '&type=' + activityType + '&dateFilter=' + dateRange);
    /*return this.http
       .get("assets/data/salesReadiness/activityLog.json");*/
  }
}
