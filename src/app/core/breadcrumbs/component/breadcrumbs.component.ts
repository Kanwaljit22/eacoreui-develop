import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbsService } from '../breadcrumbs.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { IBreadcrumb } from '../breadcrumbs.shared';
import { Subscription } from 'rxjs';
import { HeaderService } from '@app/header/header.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';

@Component({
  selector: 'app-breadcrumbs',
  template: `<div [hidden]="crumbs.length === 0" class="breadcrumbWrapper" [ngClass]="{'admin-section': utilitesService.adminSection,'no-breadcrumb': hideBreadcrumbText || appDataService.isPatnerLedFlow}">
  <div class="container-fluid">
      <div class="row align-items-center" [ngClass]="{'d-none': headerService.fullScreen}">
          <div class="col-lg-12">
              <ul class="breadcrumb">
                  <li class="breadcrumb-item" [ngClass]="{ 'active': last }" *ngFor="let crumb of crumbs; let first=first; let last = last;">
                      <a *ngIf="first" [routerLink]="crumb.path">Home</a><a *ngIf="!last && !first" (click)='redirect(crumb.path)'>{{crumb.text}}</a>
                      <span *ngIf="last">{{crumb.text}}</span>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</div>`,
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  constructor(public service: BreadcrumbsService, public headerService: HeaderService,
    public constantsService: ConstantsService, public appDataService: AppDataService,
    public productSummaryService: ProductSummaryService, public utilitesService: UtilitiesService,
    private router: Router) { }

  crumbs: IBreadcrumb[];

  subscriptions = new Array<Subscription>();
  public hideBreadcrumbText = false;

  public ngOnInit(): void {
    const s = this.service.crumbs$.subscribe((x) => {
      this.crumbs = x;
    });
    // This is to hide breadcrumb text only. It is done for future purpose.
    this.service.currentBreadCrumbStatus.subscribe(data => this.hideBreadcrumbText = data);
    this.appDataService.custNameEmitter.subscribe((custName: any) => {

      if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.iBSummarySalesOrder ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.iBSummaryContractNumber ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.iBSummaryInstallSite ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.iBSummarySerialNumber ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.bookingSummarySalesOrder) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ 'text': custName.text, 'path': '' });
      } else if (custName.context === AppDataService.USER_DASHBOARD_FLOW && custName.text === this.constantsService.QUALIFICATIONS) {
        this.crumbs = [{ text: '', path: '' }];
        this.crumbs.push({ 'text': 'MY ' + custName.text, 'path': 'qualifications/create-qualifications' });
      } else if (custName.context === AppDataService.USER_DASHBOARD_FLOW && custName.text === this.constantsService.PROPOSALS) {
        this.crumbs = [{ text: '', path: '' }];
        this.crumbs.push({ 'text': 'MY ' + custName.text, 'path': 'qualifications/proposal' });
      } else if (custName.context === AppDataService.USER_DASHBOARD_FLOW && custName.text === this.constantsService.MY_DEAL) {
        this.crumbs = [{ text: '', path: '' }];
        this.crumbs.push({ 'text': 'MY ' + custName.text, 'path': 'qualifications/create-qualifications' });
      } else if (custName.context === AppDataService.PAGE_CONTEXT.userProposals &&
        this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.text, 'path': 'qualifications/proposal' });
      } else if (custName.context === AppDataService.PAGE_CONTEXT.accountHealth) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ 'text': custName.text, 'path': 'allArchitectureView' });
      } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.prospectQualificaitons ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationCreate) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ 'text': custName, 'path': 'qualifications/create-qualifications' });
      } else if (custName.context === AppDataService.PAGE_CONTEXT.qualificationSummaryStep ||
        custName.context === AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: custName.text, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
      }  else if (custName.context ===  AppDataService.PAGE_CONTEXT.renewalSelectSubscription) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: custName.text, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ text: 'FOLLOW-ON', path: '' });
      }
       else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW &&
        (custName.context === AppDataService.PAGE_CONTEXT.proposalSummaryStep ||
          custName.context === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep)) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.text, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW &&
        custName.context === AppDataService.PAGE_CONTEXT.previewQuote) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.qualName, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
        this.crumbs.push({ 'text': 'BOM', 'path': 'qualifications/proposal/bom' });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW &&
        custName.context === AppDataService.PAGE_CONTEXT.documentCenter) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.qualName, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
        this.crumbs.push({ 'text': 'DOCUMENT CENTER', 'path': 'qualifications/proposal/document' });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW &&
        custName.context === AppDataService.PAGE_CONTEXT.salesReadiness) {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.qualName, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
        this.crumbs.push({ 'text': 'SALES READINESS', 'path': 'qualifications/proposal/salesReadiness' });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW && custName.context === 'TCO') {
        // for tco pages
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.qualName, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
        if (this.service.showFullBreadcrumb) {
          this.crumbs.push({ 'text': 'DOCUMENT CENTER', 'path': 'qualifications/proposal/' + custName.proposalId + '/document' });
        }
        this.crumbs.push({ 'text': 'TCO', 'path': 'qualifications/proposal/document/tco/editTco' });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW && custName.context === 'TCO LIST') {
        // for tco pages
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        this.crumbs.push({ text: this.appDataService.customerName, path: 'allArchitectureView' });
        this.crumbs.push({ text: 'QUALIFICATIONS', path: 'qualifications/' + custName.qualId });
        this.crumbs.push({ 'text': custName.qualName, 'path': 'qualifications/proposal' });
        this.crumbs.push({ 'text': this.constantsService.PROPOSALS, 'path': 'qualifications/proposal/' + custName.proposalId });
        if (this.service.showFullBreadcrumb) {
          this.crumbs.push({ 'text': 'DOCUMENT CENTER', 'path': 'qualifications/proposal/' + custName.proposalId + '/document' });
        }
        this.crumbs.push({ 'text': 'TCO LIST', 'path': 'qualifications/proposal/document/tco' });
      } else if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW && custName.context === 'Admin') {
        if (this.crumbs.length > 2) {
          this.crumbs.splice(2);
        }
        if (custName.text === 'Application Operations') {
          this.crumbs.push({ text: custName.text, path: 'operations' });
        } else if (custName.text === 'Platform Management') {
          this.crumbs.push({ text: custName.text, path: 'platform' });
        } else {
          if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.adminOperations) {
            this.crumbs.push({ text: 'Application Operations', path: 'support/admin/operations' });
          }
          if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.adminPlatform) {
            this.crumbs.push({ text: 'Platform Management', path: 'support/admin/platform' });
          }
          this.crumbs.push({ text: custName.text, path: '' });
        }
        // Removing first element of crumbs
        this.crumbs = this.crumbs.filter(obj => obj.text !== '');
      }

    });
  }

  redirect(path){
    this.router.navigate([path]);
    }

  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => x.unsubscribe());
  }
}
