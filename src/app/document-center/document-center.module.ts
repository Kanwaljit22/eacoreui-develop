import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DocumentCenterComponent } from './document-center.component';
import { DocumentRoutingModule } from './document-routing.module';
import { ProposalModule } from '@app/proposal/proposal.module';
import { FileUploadModule } from 'ng2-file-upload';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { DocumentCenterService } from './document-center.service';
import { CopyLinkService } from '../shared/copy-link/copy-link.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    DocumentCenterRecommendedContentComponent
} from './document-center-recommended-content/document-center-recommended-content.component';
import {
    DocumentCenterProposalDocumentsComponent
} from './document-center-proposal-documents/document-center-proposal-documents.component';
import { RecommendedContentService } from './document-center-recommended-content/recommended-content.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        NgbModule,
        DocumentRoutingModule,
        ProposalModule,
        FileUploadModule,
        MultiselectDropdownModule
    ],
    declarations: [
        DocumentCenterComponent,
        DocumentCenterRecommendedContentComponent,
        DocumentCenterProposalDocumentsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [DocumentCenterService, CopyLinkService, RecommendedContentService],
    exports: [
        NgbModule,
        DocumentCenterComponent
    ]
})
export class DocumentCenterModule {

}

