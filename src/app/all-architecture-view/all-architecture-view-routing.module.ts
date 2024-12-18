import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllArchitectureViewComponent } from './all-architecture-view.component';

const routes: Routes = [{
  path: '',
  component: AllArchitectureViewComponent,

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllArchitectureViewRoutingModule { }
