import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TcoComponent } from './tco.component';
import { TcoRoutingModule } from './tco-routing.module';
import { TcoListComponent } from './tco-list/tco-list.component';
import { EditTcoComponent } from './edit-tco/edit-tco.component';
import { SharedModule } from '@app/shared';
import { TcoListService } from './tco-list/tco-list.service';
import { TcoModelingComponent } from './edit-tco/tco-modeling/tco-modeling.component';
import { CustomerOutcomeComponent } from './edit-tco/customer-outcome/customer-outcome.component';
import { ReviewFinalizeComponent } from './edit-tco/review-finalize/review-finalize.component';
import { TcoModelingService } from './edit-tco/tco-modeling/tco-modeling.service';
import { CustomerOutcomeService } from './edit-tco/customer-outcome/customer-outcome.service';
import { ReviewFinalizeService } from './edit-tco/review-finalize/review-finalize.service';
import { TcoApiCallService } from './tco-api-call.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ea_2_0_HttpInterceptor } from '@app/shared/services/ea-2.0-http-interceptor';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TcoRoutingModule
  ],
  declarations: [
    TcoComponent,
    TcoListComponent,
    EditTcoComponent,
    TcoModelingComponent,
    CustomerOutcomeComponent,
    ReviewFinalizeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    TcoComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
    TcoListService, TcoModelingService, CustomerOutcomeService, ReviewFinalizeService, TcoApiCallService]
})
export class TcoModule { }
