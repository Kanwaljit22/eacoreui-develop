import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EaidService {
  saveEaidDetails = new Subject();
  scopeChangeRequest = new Subject();

  constructor() { }
}
