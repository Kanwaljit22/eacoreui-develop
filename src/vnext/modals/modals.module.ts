import { NgModule } from '@angular/core';
import { EamsDeliveryComponent } from './eams-delivery/eams-delivery.component';
import { CommonModule } from '@angular/common';
import { LookupDealidComponent } from './lookup-dealid/lookup-dealid.component';
import { EditCustomerRepresentativeComponent } from './edit-customer-representative/edit-customer-representative.component';
import { ViewAuthorizationComponent } from './view-authorization/view-authorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'vnext/commons/shared/shared.module';
import { DeferLoccComponent } from './defer-locc/defer-locc.component';
import { EditPreferredLegalComponent } from './edit-preferred-legal/edit-preferred-legal.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ClickOutsideModule } from 'ng4-click-outside';
import { ReviewAcceptComponent } from './review-accept/review-accept.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { DocusignInitiationWarningComponent } from './docusign-initiation-warning/docusign-initiation-warning.component';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ApplyDiscountComponent } from './apply-discount/apply-discount.component';
import { EligibilityStatusComponent } from './eligibility-status/eligibility-status.component';
//import { EnableSecurityEnrollComponent } from './enable-security-enroll/enable-security-enroll.component';
import { ReopenProposalComponent } from './reopen-proposal/reopen-proposal.component';
import { LoccModalComponent } from './locc-modal/locc-modal.component';
import { UnenrollConfirmationComponent } from './unenroll-confirmation/unenroll-confirmation.component';
import { FutureConsumableItemsComponent } from './future-consumable-items/future-consumable-items.component';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { ServicesDiscountComponent } from './services-discount/services-discount.component';
import { AddSecurityServiceEnrollComponent } from './add-security-service-enroll/add-security-service-enroll.component';
import { SubmitForApprovalComponent } from './submit-for-approval/submit-for-approval.component';
import { WithdrawExceptionComponent } from './withdraw-exception/withdraw-exception.component';
import { ConvertQuoteComponent } from './convert-quote/convert-quote.component';
import { EnagageSupportTeamComponent } from './enagage-support-team/enagage-support-team.component';
import { AddCaseIdPaComponent } from './add-case-id-pa/add-case-id-pa.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { ChangeDealIdComponent } from './change-deal-id/change-deal-id.component';
import { ChangeDealCompletionComponent } from './change-deal-completion/change-deal-completion.component';
 import { LookupSubscriptionComponent } from './lookup-subscription/lookup-subscription.component';
import { RequestDocumentsComponent } from './request-documents/request-documents.component';
import { ExceptionApprovalSuccessComponent } from './exception-approval-success/exception-approval-success.component';
import { ServicesCascadeDiscountConfirmationComponent } from './services-cascade-discount-confirmation/services-cascade-discount-confirmation.component';
import { NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DeleteSmartAccountConfirmationComponent } from './delete-smart-account-confirmation/delete-smart-account-confirmation.component';
import { AssignSmartAccountComponent } from './assign-smart-account/assign-smart-account.component';
import { SubscriptionRenewalSelectionConfirmationComponent } from './subscription-renewal-selection-confirmation/subscription-renewal-selection-confirmation.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DelinkConfirmationComponent } from './delink-confirmation/delink-confirmation.component';
import { SelectAQuoteComponent } from './select-a-quote/select-a-quote.component';
import { AdvancePartySearchComponent } from './advance-party-search/advance-party-search.component';
import { MissingIdComponent } from './missing-id/missing-id.component';
import { UpgradeSummaryComponent } from './upgrade-summary/upgrade-summary.component';
import { SystemDateComponent } from './system-date/system-date.component';
import { ScopeChangeReasonComponent } from './scope-change-reason/scope-change-reason.component';
import { CancelScopeChangeComponent } from './cancel-scope-change/cancel-scope-change.component';
import { DownloadCustomerScopeComponent } from './download-customer-scope/download-customer-scope.component';
import { ReviewChangeScopeSummaryComponent } from './review-change-scope-summary/review-change-scope-summary.component';
import { MigrateEligibleReasonsComponent } from './migrate-eligible-reasons/migrate-eligible-reasons.component';
import { CloneProposalComponent } from './clone-proposal/clone-proposal.component';
import { BusinessJustificationComponent } from './business-justification/business-justification.component';
import { CreateTcoComponent } from './create-tco/create-tco.component';
import { AddReasonOtdComponent } from './add-reason-otd/add-reason-otd.component';
import { PriceValidationComponent } from './price-validation/price-validation.component';
import { RemoveAdditionalCostComponent } from './remove-additional-cost/remove-additional-cost.component';
import { DownloadPricingDetailsComponent } from './download-pricing-details/download-pricing-details.component';

@NgModule({
  declarations: [LookupDealidComponent,SubmitForApprovalComponent, EditCustomerRepresentativeComponent, ViewAuthorizationComponent, DeferLoccComponent, EditPreferredLegalComponent, ReviewAcceptComponent, EditProjectComponent,EamsDeliveryComponent,ServicesDiscountComponent,
     DocusignInitiationWarningComponent, ApplyDiscountComponent, EligibilityStatusComponent, ReopenProposalComponent, LoccModalComponent, UnenrollConfirmationComponent,FutureConsumableItemsComponent, ManageTeamComponent, AddSecurityServiceEnrollComponent, WithdrawExceptionComponent, ConvertQuoteComponent, EnagageSupportTeamComponent, AddCaseIdPaComponent, UploadDocumentComponent, ChangeDealIdComponent, ChangeDealCompletionComponent,LookupSubscriptionComponent, RequestDocumentsComponent, ExceptionApprovalSuccessComponent, ServicesCascadeDiscountConfirmationComponent, DeleteSmartAccountConfirmationComponent, AssignSmartAccountComponent, SubscriptionRenewalSelectionConfirmationComponent,DelinkConfirmationComponent,SelectAQuoteComponent, AdvancePartySearchComponent, MissingIdComponent,UpgradeSummaryComponent, SystemDateComponent, ScopeChangeReasonComponent, CancelScopeChangeComponent, DownloadCustomerScopeComponent, ReviewChangeScopeSummaryComponent, MigrateEligibleReasonsComponent, CloneProposalComponent, BusinessJustificationComponent, CreateTcoComponent, AddReasonOtdComponent, PriceValidationComponent, RemoveAdditionalCostComponent, DownloadPricingDetailsComponent],

  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    FileUploadModule,
    ClickOutsideModule,
    NgxSliderModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgxIntlTelInputModule
  ],
  exports: [FileUploadModule,BsDatepickerModule, NgxIntlTelInputModule]
})
export class ModalsModule { }
