import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RenewalSubscriptionComponent } from './renewal-subscription.component';
import { SelectSubscriptionComponent } from './select-subscription/select-subscription.component';
import { RenewalParameterComponent } from './renewal-parameter/renewal-parameter.component';
import { ReviewRenewalComponent } from './review-renewal/review-renewal.component';


const routes: Routes = [
  {
    path: '',
    component: RenewalSubscriptionComponent,
    children: [
        {
            path: '',
            //pathMatch: 'full',
            redirectTo: 'select-subscription'
        },
        {
            path: 'select-subscription',
            component: SelectSubscriptionComponent

        },
        {
            path: 'renewal-paramter',
            component: RenewalParameterComponent

        },
        {
            path: 'review',
            component: ReviewRenewalComponent

        }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class RenewalSubscriptionRoutingModule { }
