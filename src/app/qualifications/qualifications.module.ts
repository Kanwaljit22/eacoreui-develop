import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
// Modules
import { SharedModule } from '../../app/shared';
import { QualificationsRoutingModule } from './qualifications-routing.module';

/**
 * Qulaification  Root
 */
import { QualificationsComponent } from './qualifications.component';


import { CreateQualificationsComponent } from './create-qualification/create-qualifications.component';
import { QualificationListingComponent } from './edit-qualifications/qualification-listing/qualification-listing.component';
import { WhoInvolvedComponent } from './edit-qualifications/who-involved/who-involved.component';
import { ManageGeographyComponent } from './edit-qualifications/manage-geography/manage-geography.component';
import { ManageAffiliatesComponent } from './edit-qualifications/manage-affiliates/manage-affiliates.component';
import { QualSummaryComponent } from './edit-qualifications/qual-summary/qual-summary.component';
import { EditQualificationsComponent } from './edit-qualifications/edit-qualifications.component';
/**
 * Common Components
 */

import { ManageGeographyService } from './edit-qualifications/manage-geography/manage-geography.service';
import { ManageAffiliatesService } from './edit-qualifications/manage-affiliates/manage-affiliates.service';
import { WhoInvolvedService } from './edit-qualifications/who-involved/who-involved.service';
import { QualListingService } from './edit-qualifications/qualification-listing/qual-listing.service';
import { QualSummaryService } from '@app/qualifications/edit-qualifications/qual-summary/qual-summary.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ea_2_0_HttpInterceptor } from '../shared/services/ea-2.0-http-interceptor';
// import { ProposalModule } from '@app/proposal/proposal.module';
import { ListProposalService } from '../proposal/list-proposal/list-proposal.service';
import { DocumentCenterService } from '../document-center/document-center.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import { QualificationsService } from './qualifications.service';
import { ClickOutsideModule } from 'ng4-click-outside';
import { NodeColumnComponent } from './edit-qualifications/manage-affiliates/node-column/node-column.component';
import { SubsidiaryListComponent } from './edit-qualifications/manage-affiliates/subsidiary-list/subsidiary-list.component';
import { SmartSubsidiariesComponent } from './edit-qualifications/manage-affiliates/smart-subsidiaries/smart-subsidiaries.component';
import { SubsidarySummaryListComponent
       } from './edit-qualifications/manage-affiliates/subsidary-summary-list/subsidary-summary-list.component';
import { ConfirmationComponent } from './edit-qualifications/manage-affiliates/confirmation/confirmation.component';
import { SubsidiaryNameHeaderComponent } from './edit-qualifications/manage-affiliates/subsidiary-name-header/subsidiary-name-header.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@NgModule({
    imports: [
        SharedModule,
        QualificationsRoutingModule,
        AgGridModule.withComponents([NodeColumnComponent,  SubsidiaryListComponent, SubsidiaryNameHeaderComponent]),
        UiSwitchModule,
        ClickOutsideModule,
        ToastrModule.forRoot()
        // ProposalModule
    ],
    declarations: [
        QualificationsComponent,
        CreateQualificationsComponent,
        EditQualificationsComponent,
        QualificationListingComponent,
        WhoInvolvedComponent,
        ManageGeographyComponent,
        ManageAffiliatesComponent,
        QualSummaryComponent,
        NodeColumnComponent,
        SubsidiaryListComponent,
        SmartSubsidiariesComponent,
        SubsidarySummaryListComponent,
        ConfirmationComponent,
        SubsidiaryNameHeaderComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
        ManageGeographyService, ManageAffiliatesService, WhoInvolvedService,
        QualListingService, QualSummaryService, ListProposalService, DocumentCenterService, ToastrService],
    exports: [
        QualificationsComponent
    ]
})

export class QualificationsModule { }
