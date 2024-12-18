import { ConstantsService } from '@app/shared/services/constants.service';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { DebugService } from './debug.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { Subscription } from 'rxjs';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit, OnDestroy {

  show = false;
  label = '';
  permissionObject?: Array<any>;
  localPermissionObject?: Array<any>;
  isGlobalSelected = true;
  isLocalSelected = false;
  userRoles = '';
  name = '';
  id = '';
  status = '';
  isProposalPermission = false;
  isQualificationPermission = false;
  isProposalList = false;
  isQualList = false;
  data = {};

  constructor(public localeService: LocaleService, public debugService: DebugService, public renderer: Renderer2,
    private messageService: MessageService, public appDataService: AppDataService, public constantsService: ConstantsService,
    private permissionService: PermissionService, private utilitiesService: UtilitiesService,
    public proposalDataService: ProposalDataService, public qualService: QualificationsService) { }

  ngOnInit() {

  }


  manageContextView() {

    this.isProposalPermission = false;
    this.isQualificationPermission = false;

    if (this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalSummaryStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalValidateAcceptStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalSuccess) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.priceEstimateQtyChange)) {
      this.isProposalPermission = true;
      this.isQualificationPermission = false;

    } else if (this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualList) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationCreate) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationDefineGeographyStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationSummaryStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualificationValidateAcceptStep) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.QualificationSuccess)) {
      this.isQualificationPermission = true;
      this.isProposalPermission = false;
    }

    this.isProposalList = false;
    this.isQualList = false;


    if (this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.proposalList) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.userProposals)) {
      this.isProposalList = true;
    } else if (this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.qualList) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.userQualifications) ||
      this.appDataService.isPageConextCorrect(AppDataService.PAGE_CONTEXT.prospectQualificaitons)) {
      this.isQualList = true;
    }

    if (this.isProposalList) {

      if (this.proposalDataService.listProposalData && this.proposalDataService.listProposalData.data) {
        this.data = this.proposalDataService.listProposalData.data;
      }
    } else {
      if (this.qualService.qualListData && this.qualService.qualListData.data) {
        this.data = this.qualService.qualListData.data;
      }
    }
  }


  manage() {

    this.manageContextView();

    if (this.isProposalPermission) {
      this.name = this.proposalDataService.proposalDataObject.proposalData.name;
      this.id = this.proposalDataService.proposalDataObject.proposalId;
      this.status = this.proposalDataService.proposalDataObject.proposalData.status;
    } else {
      this.name = this.qualService.qualification.name;
      this.id = this.qualService.qualification.qualID;
      this.status = this.qualService.qualification.qualStatus;
    }
  }

  openDebugger() {

    this.show = !this.show;

    this.debugService.getUserRoles(this.appDataService.userInfo.userId).subscribe((response: any) => {

      if (response.data && response.data.roles) {
        this.userRoles = this.utilitiesService.convertArrayToStringWithSpaces(response.data.roles);
      }
    });

    this.manage();
    this.showGlobalPermission();
    if (this.show) {
      this.renderer.addClass(document.body, 'position-fixed');
    } else {
      this.renderer.removeClass(document.body, 'position-fixed');
    }
  }

  showGlobalPermission() {

    this.isGlobalSelected = true;
    this.isLocalSelected = false;
    this.permissionObject = Array.from(this.permissionService.permissions.values());
    this.permissionObject.sort((permission1, permission2) => (permission1.name > permission2.name) ? 1 : -1);
  }

  showLocalPermission() {

    this.isGlobalSelected = false;
    this.isLocalSelected = true;
    this.permissionObject = Array.from(this.permissionService.localPermissions.values());
    this.permissionObject.sort((permission1, permission2) => (permission1.name > permission2.name) ? 1 : -1);

  }

  expandCollapse(proposalData) {
    proposalData.expand = !proposalData.expand;
  }

  closeDebugger() {

    this.show = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  ngOnDestroy() {
  }
}
