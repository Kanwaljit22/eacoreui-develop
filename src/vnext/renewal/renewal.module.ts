import { RenewalRoutingModule } from './renewal-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewalComponent } from './renewal.component';
import { SharedModule } from '../commons/shared/shared.module';
import { FormsModule } from '@angular/forms'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchSubscriptionsComponent } from './search-subscriptions/search-subscriptions.component';
import { ClickOutsideDirective } from './search-subscriptions/click-outside.directive';
import { AvailableSubscriptionsComponent } from './available-subscriptions/available-subscriptions.component'

@NgModule({
  declarations: [
    RenewalComponent,
    SearchSubscriptionsComponent,
    ClickOutsideDirective,
    AvailableSubscriptionsComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    RenewalRoutingModule,
    NgbTooltipModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [FormsModule]
})
export class RenewalModule { }
