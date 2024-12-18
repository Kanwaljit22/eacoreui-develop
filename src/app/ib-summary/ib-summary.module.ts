import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
// Modules
import { SharedModule } from '../../app/shared';
import { IbSummaryRoutingModule } from './ib-summary-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ea_2_0_HttpInterceptor } from '../shared/services/ea-2.0-http-interceptor';

/**
 * Qulaification  Root
 */
import { IbSummaryComponent } from './ib-summary.component';
import { IbSummaryService } from './ib-summary.service';

/**
 * Common Components
 */
// import { IbSummarySalesOrderComponent } from './ib-summary-sales-order/ib-summary-sales-order.component';
import { IbSummarySerialNumberComponent } from './ib-summary-serial-number/ib-summary-serial-number.component';
// import { IbSummaryContractNumberComponent } from './ib-summary-contract-number/ib-summary-contract-number.component';
// import { IbSummaryInstallSiteNumberComponent } from './ib-summary-install-site-number/ib-summary-install-site-number.component';

import { SalesOrderService } from './ib-summary-sales-order/sales-order.service';
import { SerialNumberService } from './ib-summary-serial-number/serial-number.service';
import { ContractNumberService } from './ib-summary-contract-number/contract-number.service';
import { InstallSiteNumberService } from './ib-summary-install-site-number/install-site-number.service';

@NgModule({
  imports: [
    SharedModule,
    IbSummaryRoutingModule,
    AgGridModule.withComponents([])
  ],
  declarations: [
    IbSummaryComponent
    // IbSummarySalesOrderComponent,
    // IbSummarySerialNumberComponent,
    // IbSummaryContractNumberComponent,
    // IbSummaryInstallSiteNumberComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
    SalesOrderService,
    SerialNumberService,
    ContractNumberService,
    InstallSiteNumberService,
    IbSummaryService
  ],
  exports: [IbSummaryComponent]
})
export class IbSummaryModule { }
