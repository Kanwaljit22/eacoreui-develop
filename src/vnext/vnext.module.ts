
import { ClickOutsideModule } from 'ng4-click-outside';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { VnextRoutingModule } from './vnext-routing.module';
import { VnextComponent } from './vnext.component';
import { HeaderComponent } from './commons/header/header.component';
import { ProgressbarComponent } from './commons/progressbar/progressbar.component';
import { SubHeaderComponent } from './commons/sub-header/sub-header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalsModule } from './modals/modals.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './commons/shared/shared.module';
import { VnextResolversModule } from './vnext-resolvers.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { VNextAuthenicationComponent } from './v-next-authenication/v-next-authenication.component';
import { Ea_3_0_HttpInterceptorService } from 'ea/ea-3.0-interceptor.service';



@NgModule({
  declarations: [VnextComponent, SubHeaderComponent, HeaderComponent, ProgressbarComponent, VNextAuthenicationComponent],
  imports: [
    CommonModule,
    VnextRoutingModule,
    VnextResolversModule,
    NgbModule,
    ModalsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    FileUploadModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    BsDatepickerModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: Ea_3_0_HttpInterceptorService, multi: true },
    CurrencyPipe
  ],
  exports: [BsDatepickerModule]
})

export class VnextModule { }
