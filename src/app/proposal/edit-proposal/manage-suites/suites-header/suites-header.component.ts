import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ManageSuitesService } from '../manage-suites.service';


@Component({
  selector: 'app-suites-header',
  templateUrl: './suites-header.component.html',
  styleUrls: ['./suites-header.component.scss']
})
export class SuitesHeaderComponent implements IHeaderAngularComp, OnDestroy {
  public params: any;
  isChecked = false;
  subscriberObject: any;
  disableCheckBox = false;
  constructor(private appDataService: AppDataService, public proposalDataService: ProposalDataService,
    public constantsService: ConstantsService, public localeService: LocaleService, private manageSuitesService: ManageSuitesService) { }

  agInit(params: any): void {
    this.params = params;
    this.subscriberObject = this.params.context.parentChildIstance.headerCheckBoxHanldeEmitter.subscribe((isToSelect) => {
      this.isChecked = isToSelect;
      if (this.appDataService.roadMapPath || !this.manageSuitesService.suitesData.length || (this.proposalDataService.cxProposalFlow && !this.proposalDataService.nonTransactionalRelatedSoftwareProposal) 
        || (this.proposalDataService.allow84Term && this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths > 60 )  
        || (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.proposalDataService.disableSuiteHeader) {

        this.disableCheckBox = true;
      } else {
        this.disableCheckBox = false;
      }
    });
  }

  checkValue() {
    this.params.context.parentChildIstance.headerCheckBoxAction(this.isChecked);
  }

  ngOnDestroy() {
    this.subscriberObject.unsubscribe();
  }

}
