import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProspectDetailsService } from '../prospect-details.service';

@Injectable()
export class ProspectDetailRegionService {

  constructor(private http: HttpClient,private configService:AppDataService, public prospectDetailsService : ProspectDetailsService) { }

  getRegionColumnsData() {
    let data = this.configService.getDetailsMetaData('PROSPECT_GEOGRAPHY');
    return data;
  }
}
