import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesReadinessComponent } from '@app/sales-readiness/sales-readiness.component';

const routes: Routes = [
  {
    path: '',
    component: SalesReadinessComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SalesRoutingModule { }
