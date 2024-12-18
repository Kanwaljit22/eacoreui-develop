import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { LocaleService } from '@app/shared/services/locale.service';


@Component({
  selector: 'app-existingsuites-header',
  templateUrl: './suitesexistingsubscription-header.component.html',
  styleUrls: ['./suitesexistingsubscription-header.component.scss']
})
export class SuitesExistingSubscriptionHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  isChecked = true;
  // subscriberObject: any;
  disableCheckBox = false;
  constructor(private appDataService: AppDataService, public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService, public localeService: LocaleService) { }

  agInit(params: any): void {

    this.params = params;
    
    
  }

  checkValue() {
    this.params.context.parentChildIstance.headerCheckBoxAction(this.isChecked);
  }

  ngOnDestroy() {
    // this.subscriberObject.unsubscribe();
  }

}
