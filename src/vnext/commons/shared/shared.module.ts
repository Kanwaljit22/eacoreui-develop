import { CUSTOM_ELEMENTS_SCHEMA,NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoccStatusComponent } from './locc-status/locc-status.component';
import { LoccComponent } from 'vnext/project/locc/locc.component';
import { InitiateLoccMessageComponent } from './initiate-locc-message/initiate-locc-message.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileUploadModule } from 'ng2-file-upload';
import { SearchPipe } from './pipes/search.pipe';
import { CiscoTeamComponent } from './cisco-team/cisco-team.component';
import { PartnerTeamComponent } from './partner-team/partner-team.component';
import { DisplayTeamComponent } from './partner-team/display-team/display-team.component';
import { ProposalListComponent } from './proposal-list/proposal-list.component';
import { MultiErrorComponent } from './multi-error/multi-error.component';
import { NgPaginationComponent } from '../ng-pagination/ng-pagination.component';
import { ClickOutsideModule } from 'ng4-click-outside';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { VnextStringToHtmlPipe } from './pipes/vnext-string-to-html.pipe';
import { FinancialSummaryComponent } from './financial-summary/financial-summary.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { RoadMapComponent } from './road-map/road-map.component';
import { LocalizationPipe } from './pipes/localization.pipe';
import { ManagedServiceProviderComponent } from './managed-service-provider/managed-service-provider.component';
import { SuccessPopoverComponent } from '../success-popover/success-popover.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MasterAgreementComponent } from './master-agreement/master-agreement.component';
import { CavIdDetailsComponent } from './cav-id-details/cav-id-details.component';
import { StoTextFormatPipe } from './pipes/sto-text-format.pipe';
import { AdvanceSearchPartiersComponent } from './advance-search-parties/advance-search-parties.component';
import { BpidsListComponent } from './bpids-list/bpids-list.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TcoBarChartComponent } from './tco-bar-chart/tco-bar-chart.component';



@NgModule({
  declarations: [MessageComponent, LoccStatusComponent, LoccComponent, InitiateLoccMessageComponent,SearchPipe,LocalizationPipe, PartnerTeamComponent,CiscoTeamComponent, DisplayTeamComponent, ProposalListComponent, MultiErrorComponent,NgPaginationComponent,SubscriptionListComponent, VnextStringToHtmlPipe,StoTextFormatPipe, FinancialSummaryComponent, SearchDropdownComponent, RoadMapComponent, ManagedServiceProviderComponent, SuccessPopoverComponent, MasterAgreementComponent, CavIdDetailsComponent, AdvanceSearchPartiersComponent, BpidsListComponent, TcoBarChartComponent],
  imports: [
    CommonModule,FormsModule, NgbModule,
    BsDatepickerModule.forRoot(),
    FileUploadModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    PopoverModule.forRoot(),
    NgxIntlTelInputModule,
    TooltipModule
  ],
  providers: [SubscriptionListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [MessageComponent,LocalizationPipe, LoccStatusComponent, LoccComponent, InitiateLoccMessageComponent,BsDatepickerModule, FileUploadModule,SearchPipe,PartnerTeamComponent,CiscoTeamComponent, DisplayTeamComponent, ProposalListComponent, MultiErrorComponent, NgPaginationComponent,SubscriptionListComponent, VnextStringToHtmlPipe,StoTextFormatPipe, FinancialSummaryComponent, SearchDropdownComponent, RoadMapComponent, ManagedServiceProviderComponent, SuccessPopoverComponent, NgxIntlTelInputModule, MasterAgreementComponent, CavIdDetailsComponent, AdvanceSearchPartiersComponent,BpidsListComponent,TcoBarChartComponent]
})
export class SharedModule { }
