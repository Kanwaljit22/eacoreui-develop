import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EaStoreService } from 'ea/ea-store.service';
import { PaginationObject } from 'vnext/vnext.service';
import { LocalizationService } from '../services/localization.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-ng-pagination',
  templateUrl: './ng-pagination.component.html',
  styleUrls: ['./ng-pagination.component.scss']
})
export class NgPaginationComponent implements OnInit {
  @Input() public paginationObject: PaginationObject;
  @Output() updatedPaginationObject = new EventEmitter();
  @Input() showPaginationResults = false;
  @Input() isSelectMoreBu = false;

  constructor(private eaService: EaService ,public eaStoreService: EaStoreService,public localizationService:LocalizationService) { }

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
