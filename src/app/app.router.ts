// import modules necessary for routing
import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { LoginerrorComponent } from './loginerror/loginerror.component';
import { ProductSummaryComponent } from './dashboard/product-summary/product-summary.component';
import { TRANSITION_DURATIONS } from 'ngx-bootstrap/modal/modal-options.class';
import { IbSummaryComponent } from './ib-summary/ib-summary.component';
import { IbSummarySalesOrderComponent } from './ib-summary/ib-summary-sales-order/ib-summary-sales-order.component';
import { IbSummarySerialNumberComponent } from './ib-summary/ib-summary-serial-number/ib-summary-serial-number.component';
import { IbSummaryContractNumberComponent } from './ib-summary/ib-summary-contract-number/ib-summary-contract-number.component';
import { IbSummaryInstallSiteNumberComponent } from './ib-summary/ib-summary-install-site-number/ib-summary-install-site-number.component';
import { AuthenticationComponent } from '@app/authentication/authentication.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { DealListComponent } from '@app/dashboard/deal-list/deal-list.component';
import { DashboardNewComponent } from './dashboard-new/dashboard-new.component';
import { PermissionEnum } from './permissions';
import { ToolAuthService } from './shared/services/tool-auth.service';
import { IbSummarySubscriptionNumberComponent } from "@app/ib-summary/ib-summary-subscription-number/ib-summary-subscription-number.component";


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [

      {
        path: '', component: DashboardNewComponent, data: {
          text: '',
          nav: {
            exact: true,
          },
          breadcrumbs: false
        }
      },
      // {
      //   path: "**",redirectTo:''
      // },
      {
        path: 'prospects', component: ProductSummaryComponent, data: {
          text: '',
          nav: {
            exact: true,
          },
          breadcrumbs: false
        }
      }
      ,
      { path: 'loginError', component: LoginerrorComponent },
      {
        path: 'prospect-details',
        loadChildren: () => import('app/prospect-details/prospects.module').then(m => m.ProspectsModule),
        data: {
          text: 'PROSPECT DETAILS',
          nav: true,
          breadcrumbs: true
        }
      },
      {
        path: 'ib-summary',
        loadChildren: () => import('app/ib-summary/ib-summary.module').then(m => m.IbSummaryModule),
        data: {
          text: 'IB SUMMARY',
          nav: true,
          breadcrumbs: true
        }
      },
      {
        path: 'qualifications',
        loadChildren: () => import('app/qualifications/qualifications.module').then(m => m.QualificationsModule),
        // data: {
        //   text: 'QUALIFICATIONS',
        //   nav: true,
        //   breadcrumbs: true
        // }
      },
      {
        path: 'proposal',
        // data: {
        //     text: 'PROPOSAL',
        //     nav: true,
        //     breadcrumbs: true
        // },
        loadChildren: () => import('app/proposal/proposal.module').then(m => m.ProposalModule)
      },
      {
        path: 'qualifications/proposal/editProposal',
        // data: {
        //     text: 'QUALIFICATIONS/PROPOSAL',
        //     nav: true,
        //     breadcrumbs: true
        // },
        loadChildren: () => import('app/proposal/proposal.module').then(m => m.ProposalModule)
      },
      {
        path: 'authenication', component: AuthenticationComponent, data: {
          text: '',
          nav: {
            exact: true,
          },
          breadcrumbs: false
        }
      }
      ,
      {
        path: 'mydeals', component: DealListComponent, data: {
          text: '',
          nav: {
            exact: true,
          },
          breadcrumbs: false
        }
      },
      {
        path: 'dashboardNew', component: DashboardNewComponent
      },
      {
        path: 'allArchitectureView', loadChildren: () => import('app/all-architecture-view/all-architecture-view.module').then(m => m.AllArchitectureViewModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// export const routes: ModuleWithProviders = RouterModule.forRoot(router);
