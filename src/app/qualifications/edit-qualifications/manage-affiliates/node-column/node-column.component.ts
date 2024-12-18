import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-node-column',
  templateUrl: './node-column.component.html',
  styleUrls: ['./node-column.component.scss']
})


export class NodeColumnComponent implements ICellRendererAngularComp {
  public params: any;
  placement: String = 'right';
  listOfSubsidaries: any[] = [];

  constructor() {

  }

  agInit(params) {
    this.params = params;

    this.listOfSubsidaries = params.data.listOfSubsidaries || [];
  }

  refresh(): boolean {
    return false;
  }



  setPlacement($event) {

    this.placement = (($event.clientY + 180) > window.innerHeight) ? 'top' : 'right';

  }


  isPartialSelection(params){
    if(params.currentSelectedSubsidiaryCount){
        if((params.selectedCrBranchesCount>0 || params.availableCrHqCount)&& (params.availableCrBranchesCount !==  params.selectedCrBranchesCount || params.availableCrHqCount !== params.selectedCrHqCount)){
            return true;
        }
    }
      return false;
  }

}
