import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProspectDetailsComponent } from './prospect-details.component';
import { ProspectDetailRegionComponent } from './prospect-detail-region/prospect-detail-region.component';
import { ProspectDetailSubsidiaryComponent } from './prospect-detail-subsidiary/prospect-detail-subsidiary.component';
import { ProspectdetailSuitesComponent } from './prospect-detail-suites/prospect-detail-suites.component';



const routes: Routes = [
  {
    path: '',
    component: ProspectDetailsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'prospect-details-region'
      },
      {
        path: 'prospect-details-suites',
        component: ProspectdetailSuitesComponent
      },
      {
        path: 'prospect-details-region',
        component: ProspectDetailRegionComponent
      },
      {
        path: 'prospect-details-subsidiary',
        component: ProspectDetailSubsidiaryComponent
      }
    ],
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProspectsRoutingModule { }
