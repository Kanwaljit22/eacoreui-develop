import { ExpiredSuiteWarningComponent } from '@app/modal/expired-suite-warning/expired-suite-warning.component';
/* 3rd party libraries */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscountsModalComponent } from './discounts/discounts.component';
import { PricingParameterComponent } from './pricing-parameter/pricing-parameter.component';
// import { EditQualificationComponent } from './edit-qualification/edit-qualification.component';
// import { EditProposalHeaderComponent } from './edit-proposal-header/edit-proposal-header.component';
import { DiscountParameterComponent } from './discount-parameter/discount-parameter.component';
import { ReviewAcceptComponent } from './review-accept/review-accept.component';
import { ParameterFeatureComponent } from '@app/modal/parameter-features/parameter-features.component';
import { SharedModule } from '@app/shared/shared.module';
import { TcoWarningComponent } from './tco-warning/tco-warning.component';
import { AddPartnerContactComponent } from './add-partner-contact/add-partner-contact.component';
import { DeleteQualificationComponent } from './delete-qualification/delete-qualification.component';
import { DeleteProposalComponent } from './delete-proposal/delete-proposal.component';
import { InitiateDocusignWarningComponent } from './initiate-docusign-warning/initiate-docusign-warning.component';
import { DownloadRequestComponent } from './download-request/download-request.component';
import { ReOpenComponent } from './re-open/re-open.component';
import { ManageTeamMembersComponent } from './manage-team-members/manage-team-members.component';
import { EditQualificationService} from '@app/modal/edit-qualification/edit-qualification.service';
import { RequestAdjustmentComponent } from './request-adjustment/request-adjustment.component';
import { RequestAdjustmentService } from './request-adjustment/request-adjustment.service';
import { AgGridModule } from 'ag-grid-angular';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ReasonCellComponent } from './request-adjustment/reason-cell/reason-cell.component';
import { CommentCellComponent } from './request-adjustment/comment-cell/comment-cell.component';
import { ClickOutsideModule } from 'ng4-click-outside';
import { EditCellValueComponent } from './request-adjustment/edit-cell-value/edit-cell-value.component';
import { ActionCellComponent } from './request-adjustment/action-cell/action-cell.component';
import { SuiteSwitchWarningComponent } from './suite-switch-warning/suite-switch-warning.component';
import { LinkProposalArchitectureComponent } from './link-proposal-architecture/link-proposal-architecture.component';
import { SplitProposalComponent } from './split-proposal/split-proposal.component';
import { ChangeServiceLevelComponent } from './change-service-level/change-service-level.component';
import { LinkProposalArchitectureService } from './link-proposal-architecture/link-proposal-architecture.service';
import { CustomerLegalWarningComponent } from './customer-legal-warning/customer-legal-warning.component';
import { AddAffiliatesNameComponent } from './add-affiliates-name/add-affiliates-name.component';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { CreateTcoComponent } from './create-tco/create-tco.component';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { TcoModelingService } from '@app/tco/edit-tco/tco-modeling/tco-modeling.service';
import { MessageService } from '@app/shared/services/message.service';
import { PurchaseOptionsComponent } from './purchase-options/purchase-options.component';
import { ProposalToQuoteComponent } from './proposal-to-quote/proposal-to-quote.component';
import { DealIdLookupComponent } from './deal-id-lookup/deal-id-lookup.component';
import { DocumentCenterService } from '@app/document-center/document-center.service';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ManualComplianceHoldReleaseComponent } from '@app/modal/manual-compliance-hold-release/manual-compliance-hold-release.component';
import { LOAFileComponent } from "@app/shared/loa-file/loa-file.component";
import { ChangeRoleComponent } from './change-role/change-role.component';
import { ProxyUserComponent } from './proxy-user/proxy-user.component';
import { SelectExceptionComponent } from './select-exception/select-exception.component';
import { ActivityLogDetailsComponent } from './activity-log-details/activity-log-details.component';
import { LoccConfirmationComponent } from "@app/modal/locc-confirmation/locc-confirmation.component";
import { LinkSmartAccountComponent } from './link-smart-account/link-smart-account.component';
import { WithdrawExceptionRequestComponent } from './withdraw-exception-request/withdraw-exception-request.component';
import { LinkSmartAccountService } from './link-smart-account/link-smart-account.service';
import { NewLaunchedExpComponent } from './new-launched-exp/new-launched-exp.component';
import { DeleteSmartAccountComponent } from "@app/modal/delete-smart-account/delete-smart-account.component";
import { ChangeDealIdComponent } from './change-deal-id/change-deal-id.component';
import { LookupNewSubsidiariesComponent } from './lookup-new-subsidiaries/lookup-new-subsidiaries.component';
import { AddCaseIdComponent } from './add-case-id/add-case-id.component';
import { RestorePaWarningComponent } from './restore-pa-warning/restore-pa-warning.component';
import { LookupSubscriptionComponent } from './lookup-subscription/lookup-subscription.component';
import { OverrideMsdComponent } from './override-msd/override-msd.component';
import { EngageSupportComponent } from './engage-support/engage-support.component';
import { RenewalProposalOptionComponent } from './renewal-proposal-option/renewal-proposal-option.component';
import { EarlyRenewalApprovalComponent } from './early-renewal-approval/early-renewal-approval.component';
import { GenerateRenewalProposalComponent } from './generate-renewal-proposal/generate-renewal-proposal.component';
import { SubscriptionAccessComponent } from './subscription-access/subscription-access.component';
import { SuitesRenewalApprovalComponent } from './suites-renewal-approval/suites-renewal-approval.component';
import { ConfirmReloadEaConsumptionComponent } from './confirm-reload-ea-consumption/confirm-reload-ea-consumption.component';
import { UploadDocumentConfirmationComponent } from './upload-document-confirmation/upload-document-confirmation.component';
import { CxConfirmationComponent } from './cx-confirmation/cx-confirmation.component';
import { ManageServiceSpecialistComponent } from './manage-service-specialist/manage-service-specialist.component';
import { EamsDeliveryComponent } from './eams-delivery/eams-delivery.component';
import { CxDiscountParametersComponent } from './cx-discount-parameters/cx-discount-parameters.component';
import { ServiceChangesConfirmationComponent } from './service-changes-confirmation/service-changes-confirmation.component';
import { EamsDeliveryService } from "@app/modal/eams-delivery/eams-delivery.service";
import { CascadeDiscountConfirmationComponent } from './cascade-discount-confirmation/cascade-discount-confirmation.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [
    /* angular stuff */
    CommonModule,
    SharedModule,
    UiSwitchModule,
    MultiselectDropdownModule,
    AgGridModule.withComponents([ReasonCellComponent, CommentCellComponent, EditCellValueComponent, ActionCellComponent]),
    ClickOutsideModule,
    NgxSliderModule
  ],
  declarations: [
    DiscountsModalComponent,
    PricingParameterComponent,
    // EditQualificationComponent,
    // EditProposalHeaderComponent,
    DiscountParameterComponent,
    ReviewAcceptComponent,
    ParameterFeatureComponent,
    TcoWarningComponent,
    AddPartnerContactComponent,
    DeleteQualificationComponent,
    DeleteProposalComponent,
    InitiateDocusignWarningComponent,
    ExpiredSuiteWarningComponent,
    DownloadRequestComponent,
    LOAFileComponent,
    ReOpenComponent,
    ManageTeamMembersComponent,
    DeleteSmartAccountComponent,
    RequestAdjustmentComponent,
    ReasonCellComponent,
    CommentCellComponent,
    EditCellValueComponent,
    ActionCellComponent,
    SuiteSwitchWarningComponent,
    LinkProposalArchitectureComponent,
    SplitProposalComponent,
    ChangeServiceLevelComponent,
    CustomerLegalWarningComponent,
    AddAffiliatesNameComponent,
    UploadFileComponent,
    SessionTimeoutComponent,
    CreateTcoComponent,
    PurchaseOptionsComponent,
    ProposalToQuoteComponent,
    DealIdLookupComponent,
    ManualComplianceHoldReleaseComponent,
    ChangeRoleComponent,
    SelectExceptionComponent,
    ProxyUserComponent,
    ActivityLogDetailsComponent,
    LoccConfirmationComponent,
    LinkSmartAccountComponent,
    WithdrawExceptionRequestComponent,
    NewLaunchedExpComponent,
    ChangeDealIdComponent,
    LookupNewSubsidiariesComponent,
    AddCaseIdComponent,
    RestorePaWarningComponent,
    LookupSubscriptionComponent,
    OverrideMsdComponent,
    EngageSupportComponent,
    RenewalProposalOptionComponent,
    EarlyRenewalApprovalComponent,
    GenerateRenewalProposalComponent,
    SubscriptionAccessComponent,
    SuitesRenewalApprovalComponent,
    ConfirmReloadEaConsumptionComponent,
    UploadDocumentConfirmationComponent,
    CxConfirmationComponent,
    ManageServiceSpecialistComponent,
    EamsDeliveryComponent,
    CxDiscountParametersComponent,
    ServiceChangesConfirmationComponent,
    CascadeDiscountConfirmationComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [ParameterFeatureComponent,EditQualificationService, RequestAdjustmentService, LinkProposalArchitectureService,
              TcoApiCallService , TcoModelingService, MessageService,TcoModelingService, DocumentCenterService, LinkSmartAccountService,EamsDeliveryService],
  exports: [
  ]
})
export class ModalsModule { }