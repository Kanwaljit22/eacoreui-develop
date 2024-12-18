import {
         IbSummaryInstallSiteNumberComponent
        } from './../ib-summary/ib-summary-install-site-number/ib-summary-install-site-number.component';
import { ManageTeamMembersPipe } from './pipes/manage-team-members.pipe';
/* 3rd party libraries */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
/**
 * Custom Component
 */
import { RoadMapComponent } from './road-map/road-map.component';
import { TitleWithButtonsComponent } from './title-with-buttons/title-with-buttons.component';
import { ShowErrorsComponent } from '../../app/shared/show-errors/show-errors.component';
import { SliderWithInputComponent } from './slider-with-input/slider-with-input.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { CopyLinkComponent } from './copy-link/copy-link.component';


import { ProposalParametersComponent } from './proposal-parameters/proposal-parameters.component';
import { DynamicDirective } from './directives/dynamic.directive';
import { ElementFocusDirective } from './directives/element-focus.directive';
import { CopyLinkService } from './copy-link/copy-link.service';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { BarGroupChartComponent } from './charts/bar-group-chart/bar-group-chart.component';
import { GroupedStackedChartComponent } from './charts/grouped-stacked-chart/grouped-stacked-chart.component';
import { GuideMeComponent } from './guide-me/guide-me.component';
import { DebugComponent } from './debug/debug.component';
import { MessageComponent } from './directives/message.component';
import { QualListComponent } from './qual-list/qual-list.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { StringToHtmlPipe } from './pipes/string-to-html.pipe';
import { CpsComponent } from './cps/cps.component';
import { QuantityDetailsComponent } from './quantity-details/quantity-details.component';
import { SearchPipe } from './pipes/search.pipe';
import { FocusDirective } from './directives/focus-input.directive';
import { ProposalSummaryService } from '../proposal/edit-proposal/proposal-summary/proposal-summary.service';
import { SearchGuidePipe } from './pipes/search-guide.pipe';
import { SearchUserPipe } from './pipes/searchUser.pipe';
import { NpsFeedbackComponent } from './nps-feedback/nps-feedback.component';
import { ApptextAreaDirective } from './apptext-area.directive';
import { ReadMoreToggleDirective } from './directives/read-more-toggle.directive';
import { ApproveExceptionService } from '@app/proposal/edit-proposal/price-estimation/approve-exception/approve-exception.service';
import { ProposalArchitectureComponent } from './proposal-architecture/proposal-architecture.component';
import { ProposalArchitectureService } from './proposal-architecture/proposal-architecture.service';
import { ClickOutsideModule } from 'ng4-click-outside';
import { QuestionnairesComponent } from './proposal-architecture/questionnaires/questionnaires.component';
import { FinancialSummaryComponent } from './financial-summary/financial-summary.component';
import { SalesConnectComponent } from './sales-connect/sales-connect.component';
import { SalesConnectService } from './sales-connect/sales-connect.service';
import { BarStackedChartComponent } from './charts/bar-stacked-chart/bar-stacked-chart.component';
import { NewReleaseFeatureComponent } from './new-release-feature/new-release-feature.component';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { FileSizePipe } from '@app/shared/pipes/file-size.pipe';
import { TcoGraphComponent } from './tco-graph/tco-graph.component';
import { PartnerDealCreationComponent } from './partner-deal-creation/partner-deal-creation.component';
import { EaPurchasesComponent } from './ea-purchases/ea-purchases.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { ProspectArchitecturesComponent } from './prospect-architectures/prospect-architectures.component';
import { DealListComponent } from '@app/dashboard/deal-list/deal-list.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LetterOfCcComponent } from './letter-of-cc/letter-of-cc.component';
import { PartnerTeamComponent } from '@app/shared/partner-team/partner-team.component';
import { CreatedByTeamPipe } from '@app/dashboard/deal-list/created-by-team.pipe';
import { AgGridModule } from 'ag-grid-angular';
import { ProspectsListComponent } from './prospects-list/prospects-list.component';
import { ActiveAgreementsComponent } from './active-agreements/active-agreements.component';
import { UpcomingAgreementsComponent } from './upcoming-agreements/upcoming-agreements.component';
import { FilterManageColumnPipe } from './filter-manage-column.pipe';
import { PartnerBookingsComponent } from './partner-bookings/partner-bookings.component';
import { ArchitectureBreakdownComponent } from './architecture-breakdown/architecture-breakdown.component';
import { AgreementConsumptionComponent } from './active-agreements/agreement-consumption/agreement-consumption.component';
import { ActiveAgreementsService } from './active-agreements/active-agreements.service';
import { BulletDirective } from './directives/bullet.directive';
import { AccountHealthInsightComponent } from './account-health-insight/account-health-insight.component';
import { DropdownDataSearchComponent } from './dropdown-data-search/dropdown-data-search.component';
import { ManageColumnsComponent } from './manage-columns/manage-columns.component';
import { VerticalBarChartDirective } from './charts/vertical-bar-chart.directive';
import { DonutChartDirective } from './charts/donut-chart.directive';
import { RectangularProgressBarDirective } from './charts/rectangular-progress-bar.directive';
import { SpeedometerDirective } from './charts/speedometer.directive';
import { IbSummaryFlyoutComponent } from './ib-summary-flyout/ib-summary-flyout.component';
import { SuitesBreakdownComponent } from './suites-breakdown/suites-breakdown.component';
import { SuitesBreakdownService } from './suites-breakdown/suites-breakdown.service';
import { InstallSiteNumberService } from '@app/ib-summary/ib-summary-install-site-number/install-site-number.service';
import { IbSummarySalesOrderComponent } from '@app/ib-summary/ib-summary-sales-order/ib-summary-sales-order.component';
import { SalesOrderService } from '@app/ib-summary/ib-summary-sales-order/sales-order.service';
import { IbSummaryContractNumberComponent } from '@app/ib-summary/ib-summary-contract-number/ib-summary-contract-number.component';
import { IbSummarySerialNumberComponent } from '@app/ib-summary/ib-summary-serial-number/ib-summary-serial-number.component';
import { SerialNumberService } from '@app/ib-summary/ib-summary-serial-number/serial-number.service';
import { ContractNumberService } from '@app/ib-summary/ib-summary-contract-number/contract-number.service';
import { ConsumptionHeaderComponent } from './active-agreements/agreement-consumption/consumption-header/consumption-header.component';
import { ConsumptionCellComponent } from './active-agreements/agreement-consumption/consumption-cell/consumption-cell.component';
import { ProspectDetailRegionComponent } from '@app/prospect-details/prospect-detail-region/prospect-detail-region.component';
import { ProspectDetailRegionService } from '@app/prospect-details/prospect-detail-region/prospect-detail-region.service';
import { ProspectDetailSubsidiaryComponent } from '@app/prospect-details/prospect-detail-subsidiary/prospect-detail-subsidiary.component';
import { ProspectDetailSubsidiaryService } from '@app/prospect-details/prospect-detail-subsidiary/prospect-detail-subsidiary.service';
import { CountriesPresentComponent } from './countries-present/countries-present.component';
import { ManageComplianceHoldNewComponent } from './manage-compliance-hold-new/manage-compliance-hold-new.component';
import { ManageComplianceHoldNewService } from './manage-compliance-hold-new/manage-compliance-hold-new.service';
import { ColumnCellComponent } from './proposal-list/column-cell/column-cell.component';
import { IonRangeSliderComponent } from './ion-range-slider/ion-range-slider.component';
import { LoccFlyoutComponent } from './locc-flyout/locc-flyout.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { PaginationComponent } from './pagination/pagination.component';
import { ColumnGridCellComponent } from './ag-grid/column-grid-cell/column-grid-cell.component';
import { CreditsOverviewComponent } from './credits-overview/credits-overview.component';
import { CreditOverviewService } from './credits-overview/credit-overview.service';
import { ReuseableFilterComponent } from './reuseable-filter/reuseable-filter.component';
import { CotermSubscriptionComponent } from '@app/proposal/coterm-subscription/coterm-subscription.component';
import { AutoHeightDirective } from './directives/auto-height.directive';
import { ToastrComponent } from './toastr/toastr.component';
import { ToastNoAnimationModule } from 'ngx-toastr';
import { CustomerRequestClarificationsComponent } from './customer-request-clarifications/customer-request-clarifications.component';
import { LinkedSubscriptionComponent } from './linked-subscription/linked-subscription.component';
import { IbSummarySubscriptionNumberComponent } from "@app/ib-summary/ib-summary-subscription-number/ib-summary-subscription-number.component";
import { ComplianceHoldListComponent } from './compliance-hold-list/compliance-hold-list.component';
import { DistributorTeamComponent } from "@app/shared/distributor-team/distributor-team.component";
import { CxSpecialistComponent } from './cx-specialist/cx-specialist.component';
import { CxDealAssurerComponent } from './cx-deal-assurer/cx-deal-assurer.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
@NgModule({
  imports: [
    /* angular stuff */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FileUploadModule,
    BsDatepickerModule,
    TypeaheadModule,
    ProgressbarModule,
    ModalModule,
    ClickOutsideModule,
    UiSwitchModule,
    NgxIntlTelInputModule,
    AgGridModule.withComponents([ConsumptionCellComponent, ConsumptionHeaderComponent, ColumnCellComponent,ColumnGridCellComponent]),
    ToastNoAnimationModule.forRoot({
      toastComponent: ToastrComponent,
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      toastClass: 'toast toast-bootstrap-compatibility-fix'
    }),
  ],
  declarations: [
    // custom compnents
    RoadMapComponent,
    TitleWithButtonsComponent,
    ShowErrorsComponent,
    SliderWithInputComponent,
    ProposalParametersComponent,
    DynamicDirective,
    ElementFocusDirective,
    SubHeaderComponent,
    CopyLinkComponent,
    BarChartComponent,
    BarStackedChartComponent,
    LineChartComponent,
    BarGroupChartComponent,
    GroupedStackedChartComponent,
    GuideMeComponent,
    DebugComponent,
    MessageComponent,
    QualListComponent,
    DealListComponent,
    ProposalListComponent,
    StringToHtmlPipe,
    CpsComponent,
    SearchPipe,
    SearchUserPipe,
    QuantityDetailsComponent,
    FocusDirective,
    SearchGuidePipe,
    NpsFeedbackComponent,
    ApptextAreaDirective,
    ReadMoreToggleDirective,
    ManageTeamMembersPipe,
    ProposalArchitectureComponent,
    QuestionnairesComponent,
    FinancialSummaryComponent,
    SalesConnectComponent,
    NewReleaseFeatureComponent,
    ShortNumberPipe,
    FileSizePipe,
    TcoGraphComponent,
    PartnerDealCreationComponent,
    EaPurchasesComponent,
    ActivityLogComponent,
    ProspectArchitecturesComponent,
    LetterOfCcComponent,
    PartnerTeamComponent,
    DistributorTeamComponent,
    CreatedByTeamPipe,
    ProspectsListComponent,
    ActiveAgreementsComponent,
    UpcomingAgreementsComponent,
    FilterManageColumnPipe,
    PartnerBookingsComponent,
    ArchitectureBreakdownComponent,
    AgreementConsumptionComponent,
    ArchitectureBreakdownComponent,
    BulletDirective,
    AccountHealthInsightComponent,
    DropdownDataSearchComponent,
    ManageColumnsComponent,
    VerticalBarChartDirective,
    DonutChartDirective,
    RectangularProgressBarDirective,
    SpeedometerDirective,
    IbSummaryFlyoutComponent,
    SuitesBreakdownComponent,
    IbSummaryInstallSiteNumberComponent,
    IbSummarySalesOrderComponent,
    IbSummaryContractNumberComponent,
    IbSummarySerialNumberComponent,
    ConsumptionHeaderComponent,
    ConsumptionCellComponent,
    ProspectDetailRegionComponent,
    ProspectDetailSubsidiaryComponent,
    CountriesPresentComponent,
    ManageComplianceHoldNewComponent,
    ColumnCellComponent,
    IonRangeSliderComponent,
    LoccFlyoutComponent,
    TooltipDirective,
    PaginationComponent,
    ColumnGridCellComponent,
    CreditsOverviewComponent,
    ReuseableFilterComponent,
    CotermSubscriptionComponent,
    AutoHeightDirective,
    ToastrComponent,
    CustomerRequestClarificationsComponent,
    LinkedSubscriptionComponent,
    IbSummarySubscriptionNumberComponent,
    ComplianceHoldListComponent,
    CxSpecialistComponent,
    CxDealAssurerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    /* angular stuff */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    FileUploadModule,
    BsDatepickerModule,
    TypeaheadModule,
    ProgressbarModule,
    ModalModule,
    NgxIntlTelInputModule,
    // custom compnents
    RoadMapComponent,
    TitleWithButtonsComponent,
    ShowErrorsComponent,
    SliderWithInputComponent,
    ProposalParametersComponent,
    DynamicDirective,
    ElementFocusDirective,
    SubHeaderComponent,
    CopyLinkComponent,
    BarChartComponent,
    BarStackedChartComponent,
    LineChartComponent,
    BarGroupChartComponent,
    GroupedStackedChartComponent,
    GuideMeComponent,
    DebugComponent,
    MessageComponent,
    QualListComponent,
    DealListComponent,
    ProposalListComponent,
    CpsComponent,
    SearchPipe,
    SearchGuidePipe,
    SearchUserPipe,
    QuantityDetailsComponent,
    FocusDirective,
    NpsFeedbackComponent,
    ReadMoreToggleDirective,
    ManageTeamMembersPipe,
    ProposalArchitectureComponent,
    FinancialSummaryComponent,
    SalesConnectComponent,
    NewReleaseFeatureComponent,
    ShortNumberPipe,
    FileSizePipe,
    StringToHtmlPipe,
    TcoGraphComponent,
    PartnerDealCreationComponent,
    EaPurchasesComponent,
    ActivityLogComponent,
    ProspectArchitecturesComponent,
    LetterOfCcComponent,
    PartnerTeamComponent,
    DistributorTeamComponent,
    ProspectsListComponent,
    ActiveAgreementsComponent,
    FilterManageColumnPipe,
    PartnerBookingsComponent,
    ArchitectureBreakdownComponent,
    ActiveAgreementsComponent,
    ArchitectureBreakdownComponent,
    BulletDirective,
    AgreementConsumptionComponent,
    AccountHealthInsightComponent,
    DropdownDataSearchComponent,
    ManageColumnsComponent,
    VerticalBarChartDirective,
    DonutChartDirective,
    RectangularProgressBarDirective,
    SpeedometerDirective,
    IbSummaryFlyoutComponent,
    SuitesBreakdownComponent,
    ManageComplianceHoldNewComponent,
    IonRangeSliderComponent,
    LoccFlyoutComponent,
    TooltipDirective,
    PaginationComponent,
    CreditsOverviewComponent,
    CotermSubscriptionComponent,
    AutoHeightDirective,
    ToastrComponent,
    CustomerRequestClarificationsComponent,
    LinkedSubscriptionComponent,
    ComplianceHoldListComponent,
    CxSpecialistComponent,
    CxDealAssurerComponent
  ],
  providers: [CopyLinkService, ProposalSummaryService, ApproveExceptionService, ProposalArchitectureService,
    SalesConnectService, ShortNumberPipe,ActiveAgreementsService, SuitesBreakdownService,
    InstallSiteNumberService, SalesOrderService, SerialNumberService, ContractNumberService, ProspectDetailRegionService,
    ProspectDetailSubsidiaryService, CreditOverviewService,
    ManageComplianceHoldNewService]
})
export class SharedModule { }