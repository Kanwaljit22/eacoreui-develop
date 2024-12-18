import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TcoDetailsComponent } from './tco-details/tco-details.component';

const routes: Routes = [
  {path: '',
  component: TcoDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TcoRoutingModule {
  
 }
