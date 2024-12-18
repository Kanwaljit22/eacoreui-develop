import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EaStoreService } from 'ea/ea-store.service';
import { PaginationObject, EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-ea-ng-pagination',
  templateUrl: './ea-ng-pagination.component.html',
  styleUrls: ['./ea-ng-pagination.component.scss']
})
export class EaNgPaginationComponent implements OnInit {
  @Input() public paginationObject: PaginationObject;
  @Output() updatedPaginationObject = new EventEmitter();
  @Input() pageType = '';

  constructor(private eaService: EaService ,public eaStoreService: EaStoreService, public localizationService: LocalizationService) { }

  ngOnInit() {
  }

  

  pageChange(value){
    if(value === 'pageSize'){
      this.paginationObject.currentPage = 1;
    }
    this.updatedPaginationObject.emit(this.paginationObject)    
  }

  getResultEnd() {
    const count = this.paginationObject.pageSize * this.paginationObject.currentPage;
    if (count > this.paginationObject.noOfRecords) {
      return this.paginationObject.noOfRecords;
    } else {
     return this.paginationObject.pageSize * this.paginationObject.currentPage;
    }
  }

  getResultInitial() {
    return (this.paginationObject.pageSize * this.paginationObject.currentPage) - (this.paginationObject?.pageSize - 1);
  }
}
