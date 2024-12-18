import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../shared/services/app.data.service';
import { BreadcrumbsService } from '../core/breadcrumbs/breadcrumbs.service';
import { LocaleService } from '../shared/services/locale.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { NgbPaginationConfig, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddSpecialistComponent } from '@app/modal/add-specialist/add-specialist.component';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { BlockUiService } from '../shared/services/block.ui.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  authMessage: any;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(public localeService: LocaleService, public appDataService: AppDataService,
    private breadcrumbsService: BreadcrumbsService, private router: Router, private modalVar: NgbModal,
    public qualService: QualificationsService, private involvedService: WhoInvolvedService, public blockUiService: BlockUiService) { }

  ngOnInit() {
    if (this.appDataService.userInfo.accessLevel === 0) {
      this.appDataService.findUserInfo();
    } else if (this.appDataService.userInfo.authorized && this.appDataService.userInfo.partnerAuthorized && !this.appDataService.proxyUser) {
      this.router.navigate(['']);
    }
    this.appDataService.userInfoObjectEmitter.subscribe((userInfo: any) => {
      if (userInfo.authorized && userInfo.partnerAuthorized) {
        this.router.navigate(['']);
      }
    });
    this.breadcrumbsService.showOrHideBreadCrumbs(false);
    this.authMessage = this.appDataService.authMessage.text;

  }

  openSpecialist() {

    this.blockUiService.spinnerConfig.blockUI();

    const ngbModalOptionsLocal = this.ngbModalOptions;
    const modalRef = this.modalVar.open(AddSpecialistComponent, { windowClass: 'add-specialist' });

    modalRef.result.then((result) => {

    });
  }

}
