import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentCenterRoutingModule } from './document-center-routing.module';
import { DocumentCenterComponent } from './document-center.component';
import { LegalPackageComponent } from './legal-package/legal-package.component';
import { SharedModule } from 'vnext/commons/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MultiPartnerConcentComponent } from './multi-partner-concent/multi-partner-concent.component';
import { ClickOutsideModule } from 'ng4-click-outside';

@NgModule({
  declarations: [
    DocumentCenterComponent,
    LegalPackageComponent,
    MultiPartnerConcentComponent
  ],
  imports: [
    CommonModule,
    DocumentCenterRoutingModule,
    SharedModule,
    NgbTooltipModule,
    ClickOutsideModule
  ]
})
export class DocumentCenterModule { }
