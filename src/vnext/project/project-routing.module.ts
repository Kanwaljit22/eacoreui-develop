import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from "vnext/project/project.component";
import { CreateProjectComponent } from "vnext/project/create-project/create-project.component";
import { ProjectResolverService } from './project-resolver.service';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'createproject'
  },
  {
    path: 'createproject',
    component: ProjectComponent,
  },
  {
    path: 'create',
    component: ProjectComponent,
  },
  {
    path: 'renewal',
    loadChildren: () => import('vnext/renewal/renewal.module').then(m => m.RenewalModule)
  },
  {
    path: ':projectObjId',
    resolve: { projectData: ProjectResolverService },
    pathMatch: 'full',
    component: CreateProjectComponent,
  },
  {
    path: 'proposal',
    loadChildren: () => import('vnext/proposal/proposal.module').then(m => m.ProposalModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
