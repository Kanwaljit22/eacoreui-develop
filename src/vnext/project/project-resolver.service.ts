import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectStoreService } from './project-store.service';
import { ProjectRestService } from './project-rest.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';


@Injectable({
    providedIn: VnextResolversModule
})
export class ProjectResolverService implements Resolve<any> {

    constructor(private projectRestService: ProjectRestService,
        private projectStoreService: ProjectStoreService) { }



    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['projectObjId'];
            return this.projectRestService.getProjectDetailsById(id).pipe(
                catchError(() => {
                    return of("No User Found");
                })
            ); 
    }
}