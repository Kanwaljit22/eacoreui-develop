import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RenewalSubscriptionRoutingModule } from './renewal-subscription-routing.module';
import { SelectSubscriptionComponent } from './select-subscription/select-subscription.component';
import { RenewalSubscriptionComponent } from './renewal-subscription.component';
import { RenewalParameterComponent } from './renewal-parameter/renewal-parameter.component';
import { ReviewRenewalComponent } from './review-renewal/review-renewal.component';
import { SharedModule } from '@app/shared';


@NgModule({
  declarations: [SelectSubscriptionComponent, RenewalSubscriptionComponent, RenewalParameterComponent, ReviewRenewalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RenewalSubscriptionRoutingModule
  ]
})
export class RenewalSubscriptionModule { }
