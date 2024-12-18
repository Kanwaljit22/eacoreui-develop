import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { EaService } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';

@Component({
  selector: 'app-spna-tcv-cell-renderer',
  templateUrl: './spna-tcv-cell-renderer.component.html',
  styleUrls: ['./spna-tcv-cell-renderer.component.scss']
})
export class SpnaTcvCellRendererComponent implements ICellRendererAngularComp {
  params: any;
  constructor(public eaService: EaService, public utilitiesService: UtilitiesService, public localizationService: LocalizationService) { }

  agInit(params) {
    this.params = params;

  }

  // check to show charges message for HW pids in upgrade flow
  showChargesReimbusreMsg(params){
    if(params.value && params.value !== '--' && params.value !== '0.00' && params.data?.cxUpgradeType === 'SSPT_TO_SSPT' && params.data?.pidType === 'CX_HW_SUPPORT'){
      return true;
    }
    return false;
  }

  refresh(): boolean {
    return false;
  }

}
