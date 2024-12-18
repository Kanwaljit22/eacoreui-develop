import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpService } from './_services/http.service';

import { BreadcrumbsService } from './breadcrumbs/breadcrumbs.service';
import { BreadcrumbsComponent } from './breadcrumbs/component/breadcrumbs.component';
import { BreadcrumbsConfig } from './breadcrumbs/breadcrumbs.config';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    BreadcrumbsComponent
  ],
  exports: [
    BreadcrumbsComponent
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpService,
        multi: true
    },
    BreadcrumbsService,
    BreadcrumbsConfig
  ]
})
export class CoreModule {
  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor (
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
