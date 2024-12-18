import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentCenterComponent } from '@app/document-center/document-center.component';

const routes: Routes = [
    {
        path: '',
        component: DocumentCenterComponent,
    },
    {
        path: ':groupID',
        component: DocumentCenterComponent,
        data: {
            breadcrumbs: false
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DocumentRoutingModule { }
