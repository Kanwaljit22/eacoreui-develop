import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TcoRoutingModule } from './tco-routing.module';
import { TcoDetailsComponent } from './tco-details/tco-details.component';
import { AdvancedModellingComponent } from './tco-details/advanced-modelling/advanced-modelling.component';
import { AddAdditionalCostComponent } from './tco-details/add-additional-cost/add-additional-cost.component';
import { SharedModule } from 'vnext/commons/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng4-click-outside';
@NgModule({
  declarations: [
    TcoDetailsComponent,
    AdvancedModellingComponent,
    AddAdditionalCostComponent,
  ],
  imports: [
    CommonModule,
    TcoRoutingModule,
    SharedModule,
    FormsModule,
    NgbTooltipModule,
    NgbModule,
    ClickOutsideModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    NgbModule
]
})
export class TcoModule { }
