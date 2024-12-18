import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ea_2_0_HttpInterceptor } from '../shared/services/ea-2.0-http-interceptor';
// Modules
import { SharedModule } from '../../app/shared';
import { ProspectsRoutingModule } from './prospects-routing.module';

/**
 * Qulaification  Root
 */
import { ProspectDetailsComponent } from './prospect-details.component';


/**
 * Common Components
 */
// import { ProspectDetailRegionComponent } from './prospect-detail-region/prospect-detail-region.component';
// import { ProspectDetailSubsidiaryComponent } from './prospect-detail-subsidiary/prospect-detail-subsidiary.component';
import { ProspectdetailSuitesComponent } from './prospect-detail-suites/prospect-detail-suites.component';

import { ProspectDetailRegionService } from './prospect-detail-region/prospect-detail-region.service';
import { ProspectDetailSubsidiaryService } from './prospect-detail-subsidiary/prospect-detail-subsidiary.service';
import { ProspectdetailSuitesService } from './prospect-detail-suites/prospect-detail-suites.service';


@NgModule({
    imports: [
        SharedModule,
        ProspectsRoutingModule,
        AgGridModule.withComponents([]),
    ],
    declarations: [
        ProspectDetailsComponent,
        ProspectdetailSuitesComponent
        // ProspectDetailSubsidiaryComponent,
        // ProspectDetailRegionComponent
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
        ProspectdetailSuitesService, ProspectDetailSubsidiaryService, ProspectDetailRegionService],
    exports: [
        ProspectDetailsComponent
    ]
})

export class ProspectsModule { }
