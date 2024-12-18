import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { EaRoutingModule } from './ea-routing.module';
import { EaComponent } from './ea.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { SmartAccountComponent } from './smart-account/smart-account.component';
import { Ea_3_0_HttpInterceptorService } from './ea-3.0-interceptor.service';
import { EaRestService } from './ea-rest.service';
import { EaProgressbarComponent } from './commons/progressbar/progressbar.component';
import { GlobalMenubarComponent } from './commons/global-menubar/global-menubar.component';
import { ValidateDocObjidComponent } from './validate-doc-objid/validate-doc-objid.component';
import { EaFlowComponent } from './ea-flow/ea-flow.component';
import { EaDashboardComponent } from './ea-dashboard/ea-dashboard.component';
import { DashboardDealListComponent } from './ea-dashboard/dashboard-deal-list/dashboard-deal-list.component';
import { DashboardProjectListComponent } from './ea-dashboard/dashboard-project-list/dashboard-project-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ClickOutsideModule } from 'ng4-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { EaUtilitiesService } from './commons/ea-utilities.service';
import { EaNgPaginationComponent } from './ea-ng-pagination/ea-ng-pagination.component';
import { DashboardPendingApprovalsListComponent } from './ea-dashboard/dashboard-pending-approvals-list/dashboard-pending-approvals-list.component';
import { DashboardProposalListComponent } from './ea-dashboard/dashboard-proposal-list/dashboard-proposal-list.component';
import { DealProposalListComponent } from './commons/deal-proposal-list/deal-proposal-list.component';
import { EaStringToHtmlPipe } from './commons/pipes/ea-string-to-html.pipe';
import { GuideMeComponent } from './commons/guide-me/guide-me.component';
import { OpenCaseComponent } from './commons/open-case/open-case.component';
import { PeLandingComponent } from './pe-landing/pe-landing.component';
import { ProxyUserComponent } from './commons/proxy-user/proxy-user.component';
import { FilterMenuComponent } from './commons/filter-menu/filter-menu.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; 
import { SessionTimeoutComponent } from './commons/session-timeout/session-timeout.component';
import { EaLocalizationPipe } from './commons/pipes/eaLocalization.pipe';
import { CreateLinkedProjectComponent } from './create-linked-project/create-linked-project.component';
import { GuidanceEaActionsComponent } from './guidance-ea-actions/guidance-ea-actions.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { RedirectToEaComponent } from './redirect-to-ea/redirect-to-ea.component';

@NgModule({
  declarations: [EaComponent, SmartAccountComponent,EaProgressbarComponent, GlobalMenubarComponent,ValidateDocObjidComponent,EaFlowComponent, EaDashboardComponent, DashboardDealListComponent, DashboardProjectListComponent, EaNgPaginationComponent, DashboardPendingApprovalsListComponent, DashboardProposalListComponent, DealProposalListComponent, GuideMeComponent, EaStringToHtmlPipe,OpenCaseComponent, PeLandingComponent, ProxyUserComponent, FilterMenuComponent,SessionTimeoutComponent, EaLocalizationPipe, CreateLinkedProjectComponent, GuidanceEaActionsComponent, RedirectToEaComponent],
  imports: [
    CommonModule,
    EaRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    RouterModule.forRoot([], { }),
    BsDatepickerModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    FileUploadModule,
    ClickOutsideModule,
    NgxIntlTelInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [EaComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Ea_3_0_HttpInterceptorService, multi: true },
  { provide: LocationStrategy, useClass: PathLocationStrategy },
  EaRestService,
  BlockUiService,
  CurrencyPipe,
  EaUtilitiesService
  ],
  exports: [EaNgPaginationComponent, GuideMeComponent, EaStringToHtmlPipe, EaLocalizationPipe]
})
export class EaModule { }
