import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalModule } from '../proposal/proposal.module';
import { QualificationsModule } from '../qualifications/qualifications.module';
import { AllArchitectureViewRoutingModule } from './all-architecture-view-routing.module';
import { AllArchitectureViewComponent } from './all-architecture-view.component';
import { SharedModule } from '../shared';
import { Ea_2_0_HttpInterceptor } from '../shared/services/ea-2.0-http-interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AllArchitectureViewService } from './all-architecture-view.service';

@NgModule({
  imports: [
    CommonModule,
    AllArchitectureViewRoutingModule,
    ProposalModule,
    QualificationsModule,
    SharedModule,
    AllArchitectureViewRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
    AllArchitectureViewService
  ],
  declarations: [AllArchitectureViewComponent]
})
export class AllArchitectureViewModule { }
