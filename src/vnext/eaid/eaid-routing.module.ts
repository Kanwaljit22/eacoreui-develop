import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EaidComponent } from './eaid/eaid.component';

const routes: Routes = [
  {
    path: '', 
    component: EaidComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EaidRoutingModule { }
