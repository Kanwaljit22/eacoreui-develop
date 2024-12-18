import { BreadcrumbsService } from '@app/core/breadcrumbs/breadcrumbs.service';
import { LocaleService } from './../shared/services/locale.service';

import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { PermissionService } from '@app/permission.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { PermissionEnum } from '@app/permissions';

@Component({
  selector: 'app-tco',
  templateUrl: './tco.component.html'
})

export class TcoComponent implements OnInit, OnDestroy {

  constructor(
    private appDataService: AppDataService, private qualService: QualificationsService, private proposalDataService: ProposalDataService,
    private constantsService: ConstantsService, private breadcrumbsService: BreadcrumbsService, private utilitiesService: UtilitiesService,
    private permissionService: PermissionService
  ) { }
  ngOnInit() {
    this.utilitiesService.adminSection = false;
    this.appDataService.tcoFlow = true;
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    if (sessionObj) {
      if (sessionObj.userInfo) {
        this.appDataService.userInfo.firstName = sessionObj.userInfo.firstName;
        this.appDataService.userInfo.lastName = sessionObj.userInfo.lastName;
        this.appDataService.userInfo.roSuperUser = sessionObj.userInfo.roSuperUser;
        this.appDataService.userInfo.rwSuperUser = sessionObj.userInfo.rwSuperUser;
      }
      if (!this.proposalDataService.proposalDataObject.proposalId || !this.qualService.qualification.qualID) {
        this.qualService.qualification.qualID = sessionObj.qualificationData.qualID ?
        sessionObj.qualificationData.qualID : sessionObj.qualificationData.id;
        this.qualService.qualification.name = sessionObj.qualificationData.name ?
        sessionObj.qualificationData.name : sessionObj.qualificationData.qualName;
        this.proposalDataService.proposalDataObject.proposalId = sessionObj.proposalDataObj.proposalId;
      }
      if (sessionObj.qualificationData) {
        if (sessionObj.qualificationData.permissions && sessionObj.qualificationData.permissions.featureAccess &&
          sessionObj.qualificationData.permissions.featureAccess.length > 0) {
          this.permissionService.qualPermissions = new Map(sessionObj.qualificationData.permissions.featureAccess.map(i => [i.name, i]));
        } else {
          this.permissionService.qualPermissions.clear();
        }

        this.qualService.setQualPermissions();

        // to check if part of sales team but with read-only access
        if (!this.permissionService.qualPermissions.has(PermissionEnum.QualDelete)) {
          if (sessionObj.qualificationData.extendedsalesTeam && sessionObj.qualificationData.extendedsalesTeam.length > 0) {
            for (let i = 0; i < sessionObj.qualificationData.extendedsalesTeam.length; i++) {
              if (sessionObj.qualificationData.extendedsalesTeam[i].ccoId === this.appDataService.userInfo.userId) {
                this.appDataService.roSalesTeam = true;
                break;
              } else {
                this.appDataService.roSalesTeam = false;
              }
            }
          } else if (sessionObj.qualificationData.salesTeamList && sessionObj.qualificationData.salesTeamList !== undefined &&
            Object.keys(sessionObj.qualificationData.salesTeamList).length > 0) {
            const salesTeam = sessionObj.qualificationData.salesTeamList.map(item => item.trim());
            for (let i = 0; i < salesTeam.length; i++) {
              if (salesTeam[i] === (this.appDataService.userInfo.firstName + ' ' + this.appDataService.userInfo.lastName)) {
                this.appDataService.roSalesTeam = true;
                break;
              } else {
                this.appDataService.roSalesTeam = false;
              }
            }
          }
        } else {
          this.appDataService.roSalesTeam = false;
        }

      }
    }
    this.appDataService.isProposalIconEditable = false;
  }

  ngOnDestroy() {
    this.breadcrumbsService.showFullBreadcrumb = false;
    this.appDataService.tcoFlow = false;
    this.permissionService.proposalPermissions.clear();
  }
}
