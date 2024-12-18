import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TcoListService {

  constructor(private http: HttpClient) { }


  getTcolistData() {
    return this.http.get('assets/data/tcomodelling.json');
  }



}
