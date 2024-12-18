import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbsService } from '@app/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
// import { QualificationsService } from '@app/qualifications/view-qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { QualificationsService } from './qualifications.service';
import { PermissionService } from '@app/permission.service';

@Component({
  selector: 'app-qualifications',
  templateUrl: './qualifications.component.html'
})

export class QualificationsComponent implements OnInit, OnDestroy {

  constructor(private breadcrumbsService: BreadcrumbsService,
    // public qualService: QualificationsService,
    private router: Router,
    public appDataService: AppDataService,
    private route: ActivatedRoute,
    private productSummaryService: ProductSummaryService,
    private utilitiesService: UtilitiesService,
    private involvedService: WhoInvolvedService,
    private qualService: QualificationsService,
    public permissionsService: PermissionService) {

    this.breadcrumbsService.showOrHideBreadCrumbs(true);
    this.route.params.forEach((params: Params) => {
      if (Object.keys(params).length !== 0) { // Set parameters only if we have query parameters
        this.appDataService.archName = params['architecture'];
        this.appDataService.customerName = decodeURIComponent(params['customername']);
        this.appDataService.customerID = params['customerId'];
        this.qualService.flowSet = true;
      }
    });

  }

  ngOnInit() {
    this.utilitiesService.adminSection = false;
    const sessionObject: SessionData = this.appDataService.getSessionObject();

    if (this.permissionsService.permissions.size === 0) {
      this.appDataService.isReload = true;
      this.appDataService.findUserInfo();
    }

    if (this.appDataService.isPatnerLedFlow) {
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
      this.breadcrumbsService.breadCrumbStatus.next(true);
      this.appDataService.movebreadcrumbUp.next(true);
    }

    if (this.appDataService.archName) {
      if (!this.appDataService.architectureMetaDataObject) {
        this.appDataService.setMetaData().subscribe((response: any) => {
          if (response.data) {
            sessionObject.architectureMetaDataObject = response.data;
            this.appDataService.architectureMetaDataObject = response.data;
            this.appDataService.setSessionObject(sessionObject);
            this.productSummaryService.prospectInfoObject.architecture = response.data[0].name;
          }

        });
      }
      sessionObject.custInfo.archName = this.appDataService.archName;
      sessionObject.custInfo.custName = this.appDataService.customerName;
      sessionObject.custInfo.custId = this.appDataService.customerID;
      this.appDataService.setSessionObject(sessionObject);
      this.appDataService.getUserDetailsFromSession();
    } else if (sessionObject) {
      this.appDataService.archName = sessionObject.custInfo.archName;
      this.appDataService.customerName = sessionObject.custInfo.custName;
      this.appDataService.customerID = sessionObject.customerId;
      this.appDataService.getUserDetailsFromSession();
      if (!sessionObject.architectureMetaDataObject.length) {
        this.appDataService.setMetaData().subscribe((response: any) => {
          // for (let i = 0; i < response.data.length; i++) {
          if (response.data) {
            this.appDataService.architectureMetaDataObject = response.data;
            sessionObject.architectureMetaDataObject = response.data;
          }

          this.appDataService.setSessionObject(sessionObject);
          // }
        });
      }
    }
  }

  ngOnDestroy() {
    this.appDataService.createQualfrom360 = false;
    this.qualService.buyMethodDisti = false; // reset the flag after leaving qual
    this.qualService.twoTUserUsingDistiDeal = false;
  }

}
