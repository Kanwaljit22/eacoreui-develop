import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { IBreadcrumb } from './breadcrumbs.shared';

export interface IPostProcessFunc {
  (crumbs: IBreadcrumb[]) : Promise<IBreadcrumb[]> | Observable<IBreadcrumb[]> | IBreadcrumb[];
}

@Injectable()
export class BreadcrumbsConfig {
  postProcess : IPostProcessFunc
}
