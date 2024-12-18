import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IbSummaryComponent } from './ib-summary.component';
import { IbSummarySalesOrderComponent } from './ib-summary-sales-order/ib-summary-sales-order.component';
import { IbSummarySerialNumberComponent } from './ib-summary-serial-number/ib-summary-serial-number.component';
import { IbSummaryContractNumberComponent } from './ib-summary-contract-number/ib-summary-contract-number.component';
import { IbSummaryInstallSiteNumberComponent } from './ib-summary-install-site-number/ib-summary-install-site-number.component';
import { IbSummarySubscriptionNumberComponent } from "./ib-summary-subscription-number/ib-summary-subscription-number.component";


const routes: Routes = [
  {
    path: '',
    component: IbSummaryComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ib-summary-sales-order'
      },
      {
        path: 'ib-summary-sales-order',
        component: IbSummarySalesOrderComponent
      },
      {
        path: 'ib-summary-serial-number',
        component: IbSummarySerialNumberComponent
      },
      {
        path: 'ib-summary-contract-number',
        component: IbSummaryContractNumberComponent
      },
      {
        path: 'ib-summary-install-site-number',
        component: IbSummaryInstallSiteNumberComponent
      }
      ,
      {
        path: 'ib-summary-subscription-number',
        component: IbSummarySubscriptionNumberComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IbSummaryRoutingModule { }
