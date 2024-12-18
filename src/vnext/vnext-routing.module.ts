import { VNextAuthenicationComponent } from './v-next-authenication/v-next-authenication.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VnextComponent } from './vnext.component';


const routes: Routes = [
  {
    path: '',
    component: VnextComponent,
    children: [
      // {
      //     path: '',
      //     pathMatch: 'full',
      //     redirectTo: 'createproject'
      // },
      {
        path: 'eaid',
        loadChildren: () => import('vnext/eaid/eaid.module').then(m => m.EaidModule) 
      },
      {
        path: '',loadChildren: () => import('vnext/project/project.module').then(m => m.ProjectModule
)
      },
      {
        path: 'vNextAuthenication',
        component: VNextAuthenicationComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VnextRoutingModule { }
