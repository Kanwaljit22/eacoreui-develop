import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentCenterComponent } from './document-center.component';

const routes: Routes = [
  {
      path: '',
      component: DocumentCenterComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentCenterRoutingModule { }
