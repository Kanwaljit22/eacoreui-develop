import { QnaComponent } from './edit-proposal/qna/qna.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { PriceEstimationComponent } from './edit-proposal/price-estimation/price-estimation.component';
import { ProposalSummaryComponent } from './edit-proposal/proposal-summary/proposal-summary.component';
import { ProposalRoutingModule } from './proposal-routing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';import { ManageCollabPurchaseAdjustmentComponent } from './edit-proposal/price-estimation/manage-collab-purchase-adjustment/manage-collab-purchase-adjustment.component';
import { ClickOutsideModule } from 'ng4-click-outside';
import { AgGridModule } from 'ag-grid-angular';
import { SuitesCellComponent } from './edit-proposal/price-estimation/suites-cell/suites-cell.component';
import { AdjustDesiredQtyComponent } from './edit-proposal/price-estimation/adjust-desired-qty/adjust-desired-qty.component';
import { QuestionnaireComponent } from './edit-proposal/price-estimation/questionnaire/questionnaire.component';
import { BenefitsWizardComponent } from './edit-proposal/price-estimation/benefits-wizard/benefits-wizard.component';
import { PurchaseAdjustmentBreakUpComponent } from './edit-proposal/price-estimation/purchase-adjustment-break-up/purchase-adjustment-break-up.component';
import { PriceEstimateService } from './edit-proposal/price-estimation/price-estimate.service';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { EditEnrollmentComponent } from './edit-proposal/price-estimation/edit-enrollment/edit-enrollment.component';
import { EnrollmentComponent } from './edit-proposal/price-estimation/enrollment/enrollment.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProposalComponent } from './proposal.component';
import { SharedModule } from '../commons/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProposalDashboardComponent } from './proposal-dashboard/proposal-dashboard.component';
import { EditProposalParametersComponent } from './edit-proposal/edit-proposal-parameters/edit-proposal-parameters.component';
import { ManagePurchaseAdjustmentComponent } from './edit-proposal/price-estimation/manage-purchase-adjustment/manage-purchase-adjustment.component';
import { ProjectProposalListComponent } from './project-proposal-list/project-proposal-list.component';
import { ExceptionComponent } from './edit-proposal/proposal-summary/exception/exception.component';
import { UpdatePurchaseAdjustmentComponent } from './edit-proposal/price-estimation/update-purchase-adjustment/update-purchase-adjustment.component';
import { QuantityInstallBaseBreakUpComponent } from "vnext/proposal/edit-proposal/price-estimation/quantity-install-base-break-up/quantity-install-base-break-up.component";
import { ServicePurchaseAdjustmentBreakUpComponent } from './edit-proposal/price-estimation/service-purchase-adjustment-break-up/service-purchase-adjustment-break-up.component';
import { TotalContractValueBreakUpComponent } from './edit-proposal/price-estimation/total-contract-value-break-up/total-contract-value-break-up.component';
import { AddSuitesComponent } from './edit-proposal/price-estimation/add-suites/add-suites.component';
import { AssociatedServicesGridComponent } from './edit-proposal/price-estimation/associated-services-grid/associated-services-grid.component';
import { ServicesSuitesCellComponent } from './edit-proposal/price-estimation/services-suites-cell/services-suites-cell.component';
import { SuitesHeaderRenderComponent } from './edit-proposal/price-estimation/suites-header-render/suites-header-render.component';
import { TcvCellRendererComponent } from './edit-proposal/price-estimation/tcv-cell-renderer/tcv-cell-renderer.component';
import { PeProgressbarComponent } from 'vnext/commons/pe-progressbar/pe-progressbar.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

//SPNA imports
import { SpnaAddSuitesComponent } from './edit-proposal/spna-price-estimation/spna-add-suites/spna-add-suites.component';
import { SpnaAdjustDesiredQtyComponent } from './edit-proposal/spna-price-estimation/spna-adjust-desired-qty/spna-adjust-desired-qty.component';
import { SpnaAssociatedServicesGridComponent } from './edit-proposal/spna-price-estimation/spna-associated-services-grid/spna-associated-services-grid.component';
import { SpnaBenefitsWizardComponent } from './edit-proposal/spna-price-estimation/spna-benefits-wizard/spna-benefits-wizard.component';
import { SpnaEditEnrollmentComponent } from './edit-proposal/spna-price-estimation/spna-edit-enrollment/spna-edit-enrollment.component';
import { SpnaEnrollmentComponent } from './edit-proposal/spna-price-estimation/spna-enrollment/spna-enrollment.component';
import { SpnaManagePurchaseAdjustmentComponent } from './edit-proposal/spna-price-estimation/spna-manage-purchase-adjustment/spna-manage-purchase-adjustment.component';
import { SpnaPurchaseAdjustmentBreakUpComponent } from './edit-proposal/spna-price-estimation/spna-purchase-adjustment-break-up/spna-purchase-adjustment-break-up.component';
import { SpnaQuantityInstallBaseBreakUpComponent } from './edit-proposal/spna-price-estimation/spna-quantity-install-base-break-up/spna-quantity-install-base-break-up.component';
import { SpnaQuestionnaireComponent } from './edit-proposal/spna-price-estimation/spna-questionnaire/spna-questionnaire.component';
import { SpnaServicePurchaseAdjustmentBreakUpComponent } from './edit-proposal/spna-price-estimation/spna-service-purchase-adjustment-break-up/spna-service-purchase-adjustment-break-up.component';
import { SpnaServicesSuitesCellComponent } from './edit-proposal/spna-price-estimation/spna-services-suites-cell/spna-services-suites-cell.component';
import { SpnaSuitesCellComponent } from './edit-proposal/spna-price-estimation/spna-suites-cell/spna-suites-cell.component';
import { SpnaSuitesHeaderRenderComponent } from './edit-proposal/spna-price-estimation/spna-suites-header-render/spna-suites-header-render.component';
import { SpnaTcvCellRendererComponent } from './edit-proposal/spna-price-estimation/spna-tcv-cell-renderer/spna-tcv-cell-renderer.component';
import { SpnaTotalContractValueBreakUpComponent } from './edit-proposal/spna-price-estimation/spna-total-contract-value-break-up/spna-total-contract-value-break-up.component';
import { SpnaUpdatePurchaseAdjustmentComponent } from './edit-proposal/spna-price-estimation/spna-update-purchase-adjustment/spna-update-purchase-adjustment.component';
import { SpnaPriceEstimationComponent } from './edit-proposal/spna-price-estimation/spna-price-estimation.component';
import { StrategicOfferComponent } from './edit-proposal/price-estimation/strategic-offer/strategic-offer.component';
import { MigrateSuitesComponent } from './edit-proposal/price-estimation/add-suites/migrate-suites/migrate-suites.component';
import { MigrateServiceTierComponent } from './edit-proposal/price-estimation/add-suites/migrate-service-tier/migrate-service-tier.component';
import { DefineSuiteComponent } from './edit-proposal/price-estimation/define-suite/define-suite.component';

@NgModule({
  declarations: [CreateProposalComponent, EditProposalComponent, PriceEstimationComponent, ProposalSummaryComponent, SuitesCellComponent, AdjustDesiredQtyComponent,ManageCollabPurchaseAdjustmentComponent, QuestionnaireComponent, BenefitsWizardComponent, PurchaseAdjustmentBreakUpComponent, EditEnrollmentComponent,EnrollmentComponent,ProposalComponent, TotalContractValueBreakUpComponent,
    ExceptionComponent, UpdatePurchaseAdjustmentComponent , ProposalDashboardComponent,QnaComponent, EditProposalParametersComponent, ManagePurchaseAdjustmentComponent, ProjectProposalListComponent,QuantityInstallBaseBreakUpComponent,ServicePurchaseAdjustmentBreakUpComponent, AddSuitesComponent, AssociatedServicesGridComponent, ServicesSuitesCellComponent, SuitesHeaderRenderComponent,PeProgressbarComponent, TcvCellRendererComponent,

    //SPNA Components
    SpnaAddSuitesComponent,
    SpnaAdjustDesiredQtyComponent,
    SpnaAssociatedServicesGridComponent,
    SpnaBenefitsWizardComponent,
    SpnaEditEnrollmentComponent,
    SpnaEnrollmentComponent,
    SpnaManagePurchaseAdjustmentComponent,
    SpnaPurchaseAdjustmentBreakUpComponent,
    SpnaQuantityInstallBaseBreakUpComponent,
    SpnaQuestionnaireComponent,
    SpnaServicePurchaseAdjustmentBreakUpComponent,
    SpnaServicesSuitesCellComponent,
    SpnaSuitesCellComponent,
    SpnaSuitesHeaderRenderComponent,
    SpnaTcvCellRendererComponent,
    SpnaTotalContractValueBreakUpComponent,
    SpnaUpdatePurchaseAdjustmentComponent,
    SpnaPriceEstimationComponent,
    StrategicOfferComponent,
    MigrateSuitesComponent,
    MigrateServiceTierComponent,
    DefineSuiteComponent
    
    ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ProposalRoutingModule,
    NgxSliderModule,
    ClickOutsideModule,
    AgGridModule.withComponents([SuitesCellComponent,SpnaSuitesCellComponent, SuitesHeaderRenderComponent, SpnaSuitesHeaderRenderComponent]),
    AgGridModule.withComponents([ServicesSuitesCellComponent]),
    AgGridModule.withComponents([SpnaServicesSuitesCellComponent]),
    PopoverModule.forRoot(),
    NgbModule,
    NgbTooltipModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [PriceEstimateService],
  exports: [BsDatepickerModule,CommonModule,FormsModule,ReactiveFormsModule]

})
export class ProposalModule { }
