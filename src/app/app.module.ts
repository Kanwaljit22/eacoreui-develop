import { ProposalArchitectureService } from '@app/shared/proposal-architecture/proposal-architecture.service';


import { AccountHealthInsighService } from './shared/account-health-insight/account.health.insight.service';
import { QualSummaryService } from '@app/qualifications/edit-qualifications/qual-summary/qual-summary.service';
import { AppDataService, SessionData } from './shared/services/app.data.service';
import { AppRestService } from './shared/services/app.rest.service';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.router';
import { AppConfigModule } from './app-config';
import { CurrencyPipe, CommonModule, DatePipe} from '@angular/common';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ClickOutsideModule } from 'ng4-click-outside';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EditWhoInvolvedComponent } from './modal/edit-who-involved/edit-who-involved.component';
import { } from '@angular/common';
// ag-grid

// application
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DateComponent } from './shared/ag-grid/date-component/date.component';
import { TableHeaderComponent } from './shared/ag-grid/table-header/table-header.component';
import { HeaderGroupComponent } from './shared/ag-grid/header-group-component/header-group.component';

// import { ProspectDetailsComponent } from './prospect-details/prospect-details.component';
import { FiltersComponent } from './dashboard/filters/filters.component';
import { ViewAppliedFiltersComponent } from './modal/view-applied-filters/view-applied-filters.component';

import { FiltersActionsComponent } from './dashboard/filters/filters-actions/filters-actions.component';

// services
import { RestApiService } from './shared/services/restAPI.service';
import { ProspectDetailsService } from './prospect-details/prospect-details.service';
import { UtilitiesService } from './shared/services/utilities.service';
import { HeaderService } from './header/header.service';
import { FiltersService } from './dashboard/filters/filters.service';
import { TableHeightDirective } from './shared/directives/table-height.directive';
import { FooterComponent } from './footer/footer.component';
import { ProductSummaryComponent } from './dashboard/product-summary/product-summary.component';
import { ProductSummaryService } from './dashboard/product-summary/product-summary.service';
import { LoaderComponent } from './loader/loader.component';
import { TcoDataService } from '@app/tco/tco.data.service';
import { LinkedSubscriptionService} from '@app/shared/linked-subscription/linked-subscription.service';
import { IbSummaryService } from './ib-summary/ib-summary.service';
import { SearchLocateComponent } from './modal/search-locate/search-locate.component';
import { SearchLocateService } from './modal/search-locate/search-locate.service';
import { GridInitializationService } from './shared/ag-grid/grid-initialization.service';
import { EditDealIdComponent } from './modal/edit-deal-id/edit-deal-id.component';
import { EditWarningComponent } from './modal/edit-warning/edit-warning.component';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { FileUploadModule } from 'ng2-file-upload';
import { Ea_2_0_HttpInterceptor } from './shared/services/ea-2.0-http-interceptor';
import { MessageService } from './shared/services/message.service';
import { EditQualificationComponent } from './modal/edit-qualification/edit-qualification.component';
import { LoginerrorComponent } from './loginerror/loginerror.component';
import { HttpCancelService } from './shared/services/http.cancel.service';
import { QualificationHeaderComponent } from './qualifications/qualification-header/qualification-header.component';
import { BlockUiService } from './shared/services/block.ui.service';

import { CoreModule, BreadcrumbsConfig } from '../app/core';
import { SharedModule } from '../app/shared';
import { QualificationsService } from './qualifications/qualifications.service';
import { ColorsService } from './shared/services/colors.service';
import { ModalsModule } from '@app/modal/modals.module';
import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AddPartnerService } from './modal/add-partner-contact/add-partner.service';
import { GuideMeService } from './shared/guide-me/guide-me.service';
import { DebugService } from './shared/debug/debug.service';
import { ActivityLogService } from './shared/activity-log/activity-log.service';

import { DashboardService } from './dashboard/dashboard.service';
import { ManageAffiliatesService } from '@app/qualifications/edit-qualifications/manage-affiliates/manage-affiliates.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { ConstantsService } from './shared/services/constants.service';
import { PriceEstimateCanDeactivateGuard } from '@app/proposal/edit-proposal/price-estimation/price-estimate-can-deactivate.service';
import { ListProposalService } from './proposal/list-proposal/list-proposal.service';
import { LocaleService } from './shared/services/locale.service';
import { CpsService } from './shared/cps/cps.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { AddSpecialistComponent } from './modal/add-specialist/add-specialist.component';
import { NpsFeedbackService } from '@app/shared/nps-feedback/nps-feedback.service';
import { NewReleaseFeatureService } from '@app/shared/new-release-feature/new-release-feature.service';
import { PermissionService } from './permission.service';
import { MenubarComponent } from './menubar/menubar.component';
import { MenubarService } from './menubar/menubar.service';
import { PermissionGuardService } from './shared/services/permission-guard.service';
import { PurchaseOptionsService } from '@app/modal/purchase-options/purchase-options.service';
import { PartnerDealCreationService } from '@app/shared/partner-deal-creation/partner-deal-creation.service';
import { DealListService } from './dashboard/deal-list/deal-list.service';
import { ReportFiltersService } from '@app/dashboard/report-filters/report-filters.service';
import { DashboardNewComponent } from './dashboard-new/dashboard-new.component';
import { PartnerBookingsService } from './shared/partner-bookings/partner-bookings.service';
import { PercentageCellComponent } from './dashboard/product-summary/percentage-cell/percentage-cell.component';
import { ArchitectureBreakdownService } from './shared/architecture-breakdown/architecture-breakdown.service';
import { CountriesPresentService } from './shared/countries-present/countries-present.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DealCellComponent } from './dashboard/deal-list/deal-cell/deal-cell.component';
import { ToolAuthService } from './shared/services/tool-auth.service';
import { ReuseableFilterService } from './shared/reuseable-filter/reuseable-filter.service';
import { RenewalSubscriptionService } from './renewal-subscription/renewal-subscription.service';
import { HeaderRendererComponent } from './dashboard/product-summary/header-renderer/header-renderer.component';
import { EditPartnerComponent } from "@app/modal/edit-partner/edit-partner.component";
import { AgGridModule } from 'ag-grid-angular';
import { CxPriceEstimationService } from '@app/proposal/edit-proposal/cx-price-estimation/cx-price-estimation.service';
import { ProposalPollerService } from './shared/services/proposal-poller.service';

@NgModule({
    imports: [
        NgbModule,
        BsDatepickerModule.forRoot(),
        TypeaheadModule.forRoot(),
        ProgressbarModule.forRoot(),
        ModalModule.forRoot(),
        FormsModule,
       // NgIdleKeepaliveModule.forRoot(),
        UiSwitchModule,
        HttpClientModule,
        MultiselectDropdownModule,
        FileUploadModule,
        AgGridModule,
        AppConfigModule,
        AppRoutingModule,
        ClickOutsideModule,
        ModalsModule,
        CoreModule,
        /*ProspectsModule,
        IbSummaryModule,*/
        // ProposalModule,
        // QualificationsModule,
        SharedModule,
        CommonModule
        // UserIdleModule.forRoot({idle:60,timeout:30,ping:6})
    ],
    declarations: [
        AppComponent,
        DateComponent,
        AddSpecialistComponent,
        TableHeaderComponent,
        HeaderComponent,
        HeaderGroupComponent,
        ProductSummaryComponent,
        FiltersComponent,
        FiltersActionsComponent,
        ViewAppliedFiltersComponent,
        TableHeightDirective,
        FooterComponent,
        LoaderComponent,
        // ProspectdetailSuitesComponent,
        // ProspectDetailRegionComponent,
        // ProspectDetailSubsidiaryComponent,
        // ProspectDetailsComponent,
        // IbSummarySalesOrderComponent,
        // IbSummarySerialNumberComponent,
        // IbSummaryContractNumberComponent,
        // IbSummaryInstallSiteNumberComponent,
        // IbSummaryComponent,
        // ViewQualificationsComponent,
        SearchLocateComponent,
        // WhoInvolvedComponent,
        // ManageGeographyComponent,
        // ManageAffiliatesComponent,
        EditDealIdComponent,
        // QualificationListingComponent,
        EditWarningComponent,
        EditQualificationComponent,
        LoginerrorComponent,
        // QualSummaryComponent,
        QualificationHeaderComponent,
        EditWhoInvolvedComponent,
        EditPartnerComponent,
        AuthenticationComponent,
        MenubarComponent,
        DashboardNewComponent,
        PercentageCellComponent,
        DealCellComponent,
        HeaderRendererComponent

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: Ea_2_0_HttpInterceptor, multi: true },
        CurrencyPipe,
        DatePipe,
        ProductSummaryService,
        HeaderService,
        UtilitiesService,
        DealListService,
        RestApiService,
        //  MockBackend,
        ProspectDetailsService,
        FiltersService,
        AppRestService,
        AppDataService,
        PermissionService,
        PriceEstimationService,
        LinkedSubscriptionService,
        // ProspectdetailSuitesService,ProspectDetailRegionService,ProspectDetailSubsidiaryService,
        // ContractNumberService, SerialNumberService, SalesOrderService, InstallSiteNumberService,
        LocaleService,
        IbSummaryService,
        MessageService,
        SearchLocateService,
        GridInitializationService,
        // ManageGeographyService, ManageAffiliatesService,
        ManageAffiliatesService,
        WhoInvolvedService,
        HttpCancelService,
        QualSummaryService,
        BlockUiService,
        QualificationsService,
        ColorsService,
        CreateProposalService,
        ListProposalService,
        ReuseableFilterService,
        ProposalDataService,
        AddPartnerService,
        GuideMeService,
        DebugService,
        ActivityLogService,
        DashboardService,
        ConstantsService,
        PriceEstimateCanDeactivateGuard,
        CpsService,
        AuthGuardService,
        NpsFeedbackService,
        TcoDataService,
        NewReleaseFeatureService,
        MenubarService,
        PermissionGuardService,
        PurchaseOptionsService,
        PartnerDealCreationService,
        ReportFiltersService,
        PartnerBookingsService,
        CountriesPresentService,
        ArchitectureBreakdownService,
        AccountHealthInsighService,
        ToolAuthService,
        RenewalSubscriptionService,
        ProposalArchitectureService,
        CxPriceEstimationService,
        ProposalPollerService
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(breadcrumbsConfig: BreadcrumbsConfig, public appDataService: AppDataService) {
        breadcrumbsConfig.postProcess = (x) => {
            // Ensure the first breadcrumb points to home
            let y = x;
            const sessionObject: SessionData = this.appDataService.getSessionObject();
            if (sessionObject && sessionObject.userDashboardFlow) {
                this.appDataService.userDashboardFLow = sessionObject.userDashboardFlow;
            }
            if (x.length && x[0].text !== 'Home' && this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
                if (!this.appDataService.customerName && sessionObject && sessionObject.custInfo) {
                    this.appDataService.customerName = sessionObject.custInfo.custName;
                }
                if (x.length > 0 && x[0].text === 'PROPOSAL') {
                    // when user goes from my proposal list to  proposal summary we need to add qualification in breadcrumb
                    y = [
                        {
                            text: '',
                            path: ''
                        },
                        {
                            text: 'PROSPECTS',
                            path: 'prospects'
                        }, {
                            text: appDataService.customerName,
                            path: 'qualifications/create-qualifications'
                        },
                        {
                            text: 'QUALIFICATIONS',
                            path: 'qualifications'
                        }
                    ].concat(x);
                } else if (x.length > 0 && (x[0].text === 'PROSPECT DETAILS' || x[0].text === 'IB SUMMARY')) {
                    y = [
                        {
                            text: '',
                            path: ''
                        },
                        {
                            text: 'PROSPECTS',
                            path: 'prospects'
                        }].concat(x);
                } else if (x.length > 0 && x[0].text === 'Admin') {
                    y = [
                        {
                            text: '',
                            path: ''
                        }
                    ].concat(x);
                } else {
                    y = [
                        {
                            text: '',
                            path: ''
                        },
                        {
                            text: ' PROSPECTS',
                            path: 'prospects'
                        },
                        {
                            text: appDataService.customerName,
                            path: 'qualifications/create-qualifications'
                        },
                    ].concat(x);
                }
            } else if (x.length === 0) {
                y = [
                    {
                        text: '',
                        path: ''
                    }
                ].concat({
                    text: ' PROSPECTS',
                    path: 'prospects'
                });
            } else {
                y = [
                    {
                        text: '',
                        path: ''
                    },
                    {
                        text: ' PROSPECTS',
                        path: 'prospects'
                    },
                ].concat(x);
            }
            return y;
        };
    }
}
