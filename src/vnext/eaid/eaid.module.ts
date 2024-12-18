import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EaidRoutingModule } from './eaid-routing.module';


import { ClickOutsideModule } from 'ng4-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule } from '@angular/common/http';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalsModule } from 'vnext/modals/modals.module';
import { SharedModule } from 'vnext/commons/shared/shared.module';
import { EaidComponent } from './eaid/eaid.component';
import { MerakiOrgIdsComponent } from './meraki-org-ids/meraki-org-ids.component';
import { AssociatedSubscriptionsComponent } from './associated-subscriptions/associated-subscriptions.component';
import { ReviewSubmitScopeComponent } from './review-submit-scope/review-submit-scope.component';


@NgModule({
  declarations: [
    EaidComponent,
    MerakiOrgIdsComponent,
    AssociatedSubscriptionsComponent,
    ReviewSubmitScopeComponent
  ],
  imports: [
    ReactiveFormsModule,
    ClickOutsideModule,
    BsDatepickerModule,
    CommonModule,
    EaidRoutingModule,
    NgbModule,
    ModalsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    FileUploadModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [FormsModule,ReactiveFormsModule,BsDatepickerModule]
})
export class EaidModule { }
