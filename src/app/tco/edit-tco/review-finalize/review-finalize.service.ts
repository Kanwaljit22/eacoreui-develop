import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service'

@Injectable()
export class ReviewFinalizeService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }


}
