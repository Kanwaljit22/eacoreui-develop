import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalComponent } from './proposal.component';
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { ProposalListComponent } from './list-proposal/list-proposal.component';
import { ProposalSummaryComponent } from './edit-proposal/proposal-summary/proposal-summary.component';
import { BomComponent } from '@app/proposal/bom/bom.component';
import { PriceEstimateCanDeactivateGuard } from '@app/proposal/edit-proposal/price-estimation/price-estimate-can-deactivate.service';

const routes: Routes = [
    {
        path: '',
        component: ProposalComponent,

    },
    {
        path: 'createProposal',
        component: CreateProposalComponent,
        data: { title: 'Create Proposal' }
    },
    {
        path: ':proposalId',
        component: EditProposalComponent,
        data: { title: 'Edit Proposal' },
        canDeactivate: [PriceEstimateCanDeactivateGuard]
    },
    {
        path: ':proposalId/priceestimate/:billToId',
        component: EditProposalComponent,
        data: { title: 'Edit Proposal' },
        canDeactivate: [PriceEstimateCanDeactivateGuard]
    },
    {
        path: ':proposalId/priceestimate',
        component: EditProposalComponent,
        data: { title: 'Edit Proposal' },
        canDeactivate: [PriceEstimateCanDeactivateGuard]
    },
    // {
    //     path: 'editProposal',
    //     component: EditProposalComponent,
    //     data: { title: 'Edit Proposal' },
    //     canDeactivate:[PriceEstimateCanDeactivateGuard]

    // },
    {
        path: 'listProposal',
        component: ProposalListComponent,
        data: { title: 'List Proposal' }
    },
    {
        path: 'summaryProposal',
        component: ProposalSummaryComponent,
        data: { title: 'Proposal Summary' }
    },
    {
        path: ':proposalId/document',
        data: {
            text: 'DOCUMENT CENTER',
            nav: true,
            breadcrumbs: true
        },
        loadChildren: () => import('app/document-center/document-center.module').then(m => m.DocumentCenterModule)
    },
    {
        path: ':proposalId/bom',
        component: BomComponent,
        data: { title: 'BOM' }
    }
    ,
    {
        path: ':proposalId/bom/group',
        component: BomComponent,
        data: { title: 'BOM' }
    },
    {
        path: ':proposalId/salesReadiness',
        data: {
            text: 'SALES READINESS',
            nav: true,
            breadcrumbs: true
        },
        loadChildren: () => import('app/sales-readiness/sales-readiness.module').then(m => m.SalesReadinessModule)
    },
    {
        path: ':proposalId/tco',
        data: {
            text: 'TCO',
            nav: true,
            breadcrumbs: true
        },
        loadChildren: () => import('app/tco/tco.module').then(m => m.TcoModule)
    }, {
        path: ':proposalId/tco/:tcoId',
        data: {
            text: 'TCO',
            nav: true,
            breadcrumbs: true
        },
        loadChildren: () => import('app/tco/tco.module').then(m => m.TcoModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProposalRoutingModule { }
