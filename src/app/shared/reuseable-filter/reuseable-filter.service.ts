import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReuseableFilterService {

  appliedFilterCount = 0;
  filterOpen = false;
  filterObject = {data: {type:''}};
  eaStartDateObj: any = null;
  selectedFilterData = new Map<string, any>();
  emitClearFilter = new EventEmitter();
  applyFilterEmitter = new EventEmitter();
  searchByFieldObj = {};
  constructor() { }


  activateFilter(){
    if (this.filterOpen){
      this.filterOpen = false;
    }
    else {
      this.filterOpen =true;
    }
  }
}
