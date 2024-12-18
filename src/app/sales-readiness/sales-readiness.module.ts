import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProposalModule } from '@app/proposal/proposal.module';
import { SalesRoutingModule } from '@app/sales-readiness/sales-readiness-routing.module';
import { SalesReadinessComponent } from '@app/sales-readiness/sales-readiness.component';
import { SalesReadinessService } from '@app/sales-readiness/sales-readiness.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SalesRoutingModule,
        ProposalModule,
        NgbModule,
        SharedModule
    ],
    declarations: [
        SalesReadinessComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SalesReadinessService],
    exports: [
        NgbModule,
        SalesReadinessComponent
    ]
})
export class SalesReadinessModule {

}
