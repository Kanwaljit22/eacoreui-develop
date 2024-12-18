import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { ProposalComponent } from './proposal.component';
import { ProposalDashboardComponent } from './proposal-dashboard/proposal-dashboard.component';
import { ProjectProposalListComponent } from './project-proposal-list/project-proposal-list.component';

 
const routes: Routes = [
  {
    path: '',
    component: ProposalComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'createproposal'
      },
      {
      path: 'createproposal',
      component: CreateProposalComponent,
      },
      {
        path: 'list',
        component: ProjectProposalListComponent
      },
      {
        path: 'vui',
        component: EditProposalComponent,
      },
      {
        path: ':proposalId',
        component: EditProposalComponent,
      }
      ,
      {
        path: 'proposaldashboard',
        component: ProposalDashboardComponent,
      } 
    ]
    
  },
  {
    path: ':proposalId/documents',loadChildren: () => import('vnext/document-center/document-center.module').then(m => m.DocumentCenterModule)
  },
  {
    path: ':proposalId/tcodetails/:tcoId',
    loadChildren: () => import('vnext/tco/tco.module').then(m=>m.TcoModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
