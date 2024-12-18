import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ManageAffiliatesService } from '../manage-affiliates.service';

@Component({
  selector: 'app-subsidiary-name-header',
  templateUrl: './subsidiary-name-header.component.html',
  styleUrls: ['./subsidiary-name-header.component.scss']
})
export class SubsidiaryNameHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  isChecked = false;
  disableCheckBox = false;
  subscriberObject: any;

  constructor(private appDataService: AppDataService, private affiliatesService: ManageAffiliatesService) { }

  agInit(params: any) {
    this.params = params;
    if(this.affiliatesService.readOnlyMode){
      this.disableCheckBox = true;
    }
    this.subscriberObject = this.params.context.parentChildIstance.headerCheckBoxHanldeEmitter.subscribe((isToSelect) => {
      this.isChecked = isToSelect;
    });
  }

  checkValue(event) {
    event.stopPropagation();
  //  this.params.context.parentChildIstance.headerCheckBoxAction(this.isChecked);
  }

  ngOnDestroy() {
    if(this.subscriberObject){
      this.subscriberObject.unsubscribe();
    }
  }



}
