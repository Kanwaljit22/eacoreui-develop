import { Component, OnInit, Input } from '@angular/core';
import {UtilitiesService} from '../../shared/services/utilities.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() public paginationObject: any;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }

  pageChange(value){
    if(value === 'pageSize'){
      this.paginationObject.page =1;
      this.utilitiesService.paginationEmitter.emit(this.paginationObject)
    }
    else{
      this.utilitiesService.paginationEmitter.emit(this.paginationObject)
    }
    
  }

}
