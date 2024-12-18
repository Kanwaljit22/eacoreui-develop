import { EaDashboardComponent } from './ea-dashboard/ea-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartAccountComponent } from './smart-account/smart-account.component';
import { ValidateDocObjidComponent } from './validate-doc-objid/validate-doc-objid.component';
import { EaFlowComponent } from './ea-flow/ea-flow.component';
import { UserResolverService } from './user-resolver.service';
import { PeLandingComponent } from './pe-landing/pe-landing.component';
import { CreateLinkedProjectComponent } from './create-linked-project/create-linked-project.component';
import { GuidanceEaActionsComponent } from './guidance-ea-actions/guidance-ea-actions.component';
import { RedirectToEaComponent } from './redirect-to-ea/redirect-to-ea.component';
const routes: Routes = [
  {
    path: '',
    component: EaFlowComponent
    ,
    resolve: {userData: UserResolverService},
    children: [
      {
        path:'eamp',
        component: SmartAccountComponent
      },
      {
        path:'ea/ltlookupdeal',
        component: RedirectToEaComponent
      },
      {
        path:'ea/docs/:docObjid',
        component: ValidateDocObjidComponent
      },
      { 
        path: 'ea/buyingprogram',  //buying program id scope
        loadChildren: () => import('vnext/vnext.module').then(m => m.VnextModule)
      },
       { 
         path: 'ea/project',
         loadChildren: () => import('vnext/vnext.module').then(m => m.VnextModule)
       },
       {
        path: 'ea/home',
        component: EaDashboardComponent
        },
      // {
      //   path: "",
      //   pathMatch: 'full',
      //   redirectTo: 'ea/home'
      // },
      {
        path: "",
        loadChildren: () => import('app/app.module').then(m => m.AppModule)
      },
      {
        path: 'ea/priceestimate/:proposalId',
        component: PeLandingComponent
      },
      {
        path: 'ea/external/landing/sub-ui',
        component: CreateLinkedProjectComponent
        
      },
      {
        path: 'ea/guideActions',
        component: GuidanceEaActionsComponent
        
      }
    ]
  }
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class EaRoutingModule { }
