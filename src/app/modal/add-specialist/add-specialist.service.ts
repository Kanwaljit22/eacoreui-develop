import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class AddSpecialistService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get('assets/data/qualification/specialist.json')
      .pipe(map(res => res));
  }

}
