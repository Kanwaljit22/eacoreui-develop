import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ProjectRoutingModule } from './project-routing.module';


import { SubsidiariesComponent } from './subsidiaries/subsidiaries.component';
import { ViewSitesComponent } from './view-sites/view-sites.component';
import { NextBestActionComponent } from './next-best-action/next-best-action.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ProjectComponent } from './project.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedModule } from "vnext/commons/shared/shared.module";
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProjectResolversModule } from './project-resolvers.module';
import { SelectMoreBuComponent } from './select-more-bu/select-more-bu.component';
import { SelectMerakiComponent } from './select-meraki/select-meraki.component';
import { GeographyFilterComponent } from './geography-filter/geography-filter.component';
import { CreateBuyingProgramIdComponent } from './create-buying-program-id/create-buying-program-id.component';
import { BpIdDetailsComponent } from './bp-id-details/bp-id-details.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [SubsidiariesComponent,ViewSitesComponent,NextBestActionComponent
  ,CreateProjectComponent,ContactDetailsComponent,ProjectComponent, SelectMoreBuComponent, SelectMerakiComponent,GeographyFilterComponent, CreateBuyingProgramIdComponent, BpIdDetailsComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
    BsDatepickerModule,
    ProjectResolversModule,
    TooltipModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [FormsModule,ReactiveFormsModule,BsDatepickerModule]
})
export class ProjectModule { }
