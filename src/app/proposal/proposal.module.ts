import { HwgroupComponent } from './edit-proposal/tco-configuration/paramter-table/hwgroup/hwgroup.component';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ea_2_0_HttpInterceptor } from '../shared/services/ea-2.0-http-interceptor';
// Modules
import { SharedModule } from '../../app/shared/shared.module';
import { ProposalRoutingModule } from './proposal-routing.module';

/**
 * Proposal Root
 */
import { ProposalComponent } from './proposal.component';

/**
 * Common Components
 */
import { ProposalHeaderComponent } from './proposal-header/proposal-header.component';
import { ProposalCreateTutorialComponent } from './proposal-create-tutorial/proposal-create-tutorial.component';
import { CustomPinnedRowRenderer } from './edit-proposal/price-estimation/pinned-row/custom-pined-row.component';
import { GroupColumnComponent } from './edit-proposal/price-estimation/group-cell/group-column.component';
import { ManageSuitesGroupCell } from './edit-proposal/manage-suites/group-cell/group-cell.component';
/**
 * List Proposal
 */
import { ProposalListComponent } from './list-proposal/list-proposal.component';

/**
 * Create proposal
 */

import { CreateProposalComponent } from './create-proposal/create-proposal.component';
/**
 * Edit proposal
 */
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { ManageSuitesComponent } from './edit-proposal/manage-suites/manage-suites.component';
import { ManageSuitesService } from './edit-proposal/manage-suites/manage-suites.service';
import { PriceEstimationComponent } from './edit-proposal/price-estimation/price-estimation.component';
import { ProposalSummaryComponent } from './edit-proposal/proposal-summary/proposal-summary.component';
import { TcoConfigurationComponent } from './edit-proposal/tco-configuration/tco-configuration.component';

import { UiSwitchModule } from 'ngx-ui-switch';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ParameterComponent } from './edit-proposal/tco-configuration/paramter-table/parameter-table.component';
import { FeatureGroupComponent } from '@app/proposal/edit-proposal/tco-configuration/paramter-table/group-cell/feature-group.component';
import { CumulativeCostComponent } from './edit-proposal/tco-configuration/cumulative-cost/cumulative-cost.component';
import { YearlyCostComponent } from './edit-proposal/tco-configuration/yearly-cost/yearly-cost.component';
//import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { EditProposalHeaderComponent } from '../modal/edit-proposal-header/edit-proposal-header.component';
import { TcoConfigurationService } from '@app/proposal/edit-proposal/tco-configuration/tco-configuration.service';
import { ListProposalService } from './list-proposal/list-proposal.service';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ProposalSummaryService } from './edit-proposal/proposal-summary/proposal-summary.service';
import { BomComponent } from './bom/bom.component';
import { BomService } from './bom/bom.service';
import { EditCellComponent } from '@app/proposal/edit-proposal/price-estimation/edit-cell/edit-cell.component';
import { PriceEstimateCanDeactivateGuard } from '@app/proposal/edit-proposal/price-estimation/price-estimate-can-deactivate.service';
import { WhoInvolvedService } from '../qualifications/edit-qualifications/who-involved/who-involved.service';
import { ApproveExceptionComponent } from '@app/proposal/edit-proposal/price-estimation/approve-exception/approve-exception.component';
import { ApproveExceptionService } from "@app/proposal/edit-proposal/price-estimation/approve-exception/approve-exception.service";
import { SuitesHeaderComponent } from './edit-proposal/manage-suites/suites-header/suites-header.component';
import { ApproverTeamComponent } from './edit-proposal/approver-team/approver-team.component';
import { ApproverTeamService } from './edit-proposal/approver-team/approver-team.service';
import { RequestExceptionStatusComponent } from './edit-proposal/request-exception-status/request-exception-status.component';
import { RequestExceptionStatusService } from './edit-proposal/request-exception-status/request-exception-status.service';
import { SuitesExistingSubscriptionHeaderComponent } from "@app/proposal/edit-proposal/manage-suites/suitesexistingsubscription-header/suitesexistingsubscription-header.component";
import { CxPriceEstimationComponent } from './edit-proposal/cx-price-estimation/cx-price-estimation.component';
import { CreateProposalService } from './create-proposal/create-proposal.service';
// import { CotermSubscriptionComponent } from './coterm-subscription/coterm-subscription.component';



@NgModule({
    imports: [
        AgGridModule.withComponents([CustomPinnedRowRenderer, GroupColumnComponent, ManageSuitesGroupCell, FeatureGroupComponent, HwgroupComponent, SuitesHeaderComponent,SuitesExistingSubscriptionHeaderComponent]),
        SharedModule,
        ProposalRoutingModule,
        UiSwitchModule,
        MultiselectDropdownModule,
        ClickOutsideModule
    ],
    declarations: [
        ProposalComponent,
        ProposalHeaderComponent,
        ProposalCreateTutorialComponent,
        ProposalListComponent,
        CreateProposalComponent,
        EditProposalComponent,
        ManageSuitesComponent,
        PriceEstimationComponent,
        ProposalSummaryComponent,
        TcoConfigurationComponent,
        CustomPinnedRowRenderer,
        GroupColumnComponent,
        ManageSuitesGroupCell,
        ParameterComponent,
        FeatureGroupComponent,
        CumulativeCostComponent,
        YearlyCostComponent,
        EditProposalHeaderComponent,
        HwgroupComponent,
        BomComponent,
        EditCellComponent,
        ApproveExceptionComponent,
        SuitesHeaderComponent,
        SuitesExistingSubscriptionHeaderComponent,
        ApproverTeamComponent,
        RequestExceptionStatusComponent,
        CxPriceEstimationComponent
        // CotermSubscriptionComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true }, ManageSuitesService, 
        TcoConfigurationService, ListProposalService, ProposalSummaryService, BomService,PriceEstimateCanDeactivateGuard,WhoInvolvedService,ApproveExceptionService,
        ApproverTeamService, RequestExceptionStatusService, CreateProposalService],
    exports: [
        ProposalComponent
    ]
})
export class ProposalModule {

}
