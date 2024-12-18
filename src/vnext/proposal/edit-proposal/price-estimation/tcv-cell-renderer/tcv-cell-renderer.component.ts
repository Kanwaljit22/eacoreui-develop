import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';

@Component({
  selector: 'app-tcv-cell-renderer',
  templateUrl: './tcv-cell-renderer.component.html',
  styleUrls: ['./tcv-cell-renderer.component.scss']
})
export class TcvCellRendererComponent implements ICellRendererAngularComp {
  params: any;
  constructor(public eaService: EaService, public utilitiesService: UtilitiesService, public localizationService: LocalizationService, private constantsService: ConstantsService) { }

  agInit(params) {
    this.params = params;

  }

  // check to show charges message for HW pids in upgrade flow
  showChargesReimbusreMsg(params){
    if(params.value && params.value !== '--' && params.value !== '0.00' && params.data?.cxUpgradeType === 'SSPT_TO_SSPT' && ((!this.eaService.features?.SPA_PID_TYPE && params.data?.pidType === 'CX_HW_SUPPORT') || (this.eaService.features?.SPA_PID_TYPE && params.data?.pidType === this.constantsService.HW_PRODUCTS))){
      return true;
    }
    return false;
  }

  refresh(): boolean {
    return false;
  }

}
