import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';
import { QualificationsComponent } from './qualifications.component';
import { CreateQualificationsComponent } from './create-qualification/create-qualifications.component';
import { QualificationListingComponent } from './edit-qualifications/qualification-listing/qualification-listing.component';
import { WhoInvolvedComponent } from './edit-qualifications/who-involved/who-involved.component';
import { ManageGeographyComponent } from './edit-qualifications/manage-geography/manage-geography.component';
import { ManageAffiliatesComponent } from './edit-qualifications/manage-affiliates/manage-affiliates.component';
import { EditQualificationsComponent } from './edit-qualifications/edit-qualifications.component';
import { QualSummaryComponent } from './edit-qualifications/qual-summary/qual-summary.component';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';


const routes: Routes = [
    {
        path: '',
        component: QualificationsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'create-qualifications'
            },
            {
                path: 'create-qualifications',
                component: CreateQualificationsComponent

            },
            {
                path: 'qualifications-listing',
                component: QualificationListingComponent
            },
            {
                path: 'external',
                component: CreateQualificationsComponent
            },
            {
                path: 'proposal',
                // data: {
                //     text: 'PROPOSAL',
                //     nav: true,
                //     breadcrumbs: true
                // },
                loadChildren: () => import('app/proposal/proposal.module').then(m => m.ProposalModule)
            },
            {
                // matcher: (url: UrlSegment[]) => {
                //     console.log(url);
                //     return url.length === 1 && url[0].path.indexOf('partners?') > -1 ? ({ consumed: url }) : null;
                // },

                path: 'external/:variable',
                component: CreateQualificationsComponent
            },
            {
                path: 'external/:variable/:variable',
                component: CreateQualificationsComponent
            },
            {
                path: ':qualId',
                component: EditQualificationsComponent,
                // pathMatch: 'full'
                // data: {
                //     text: 'QUALIFICATIONS',
                //     nav: true,
                //     breadcrumbs: true
                //   }
            },
            {
                path: ':qualId/proposal',
                loadChildren: () => import('app/proposal/proposal.module').then(m => m.ProposalModule)
            },
            {
                path: ':qualId/follow-on',
                loadChildren: () => import('@app/renewal-subscription/renewal-subscription.module').then(m => m.RenewalSubscriptionModule)
            }
            // {
            //     path : ':qualId/manage-affiliates',
            //     component: EditQualificationsComponent
            // }
            // {
            //     path: 'editQual',
            //     component: EditQualificationsComponent
            // },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class QualificationsRoutingModule {
    constructor(public appDataService: AppDataService) {

    }
}
