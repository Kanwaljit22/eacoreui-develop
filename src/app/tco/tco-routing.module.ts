import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TcoComponent } from './tco.component';
import { TcoListComponent } from './tco-list/tco-list.component';
import { EditTcoComponent } from './edit-tco/edit-tco.component';

const routes: Routes = [
    {
        path: '',
        component: TcoComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'tcoList'
            },
            {
                path: 'tcoList',
                component: TcoListComponent
            },
            {
                path: ':tcoId',
                component: EditTcoComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TcoRoutingModule { }
