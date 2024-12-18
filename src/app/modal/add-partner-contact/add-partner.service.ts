import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class AddPartnerService {

  constructor(private http: HttpClient) { }
  getData() {
    return this.http.get('assets/data/proposal/addPartner.json')
      .pipe(map(res => res));
  }
}
