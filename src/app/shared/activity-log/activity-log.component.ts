import { BlockUiService } from './../services/block.ui.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ActivityLogService } from './activity-log.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityLogDetailsComponent } from '@app/modal/activity-log-details/activity-log-details.component';

export interface Date {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  activityLogData = [];
  activityData = [];
  isQualificationContext = false;
  isProposalContext = false;
  activityDataLoaded = false;
  requestJSON = {};

  isAllSelected = true;
  isQualificatiosSelected = false;
  isProposalSelected = false;
  isTcoSelected = false;
  isDocusignSelected = false;
  isQuoteSelected = false;
  isOrderSelected = false;
  selectedType = 'ALL';

  dates: Date[] = [
    { value: 'ALL', viewValue: 'ALL' },
    { value: '0', viewValue: 'Todays' },
    { value: '-7', viewValue: 'Last Week' },
    { value: '-30', viewValue: 'Last Month' }
  ];
  selectedDate = 'ALL';
  selectedDateValue = 'ALL';

  constructor(public localeService: LocaleService, private messageService: MessageService, public blockUiService: BlockUiService,
    public appDataService: AppDataService, public constantsService: ConstantsService, private modalVar: NgbModal,
    private permissionService: PermissionService, private utilitiesService: UtilitiesService,
    public proposalDataService: ProposalDataService, public qualService: QualificationsService,
    public activityLogService: ActivityLogService, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationCreate ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineGeographyStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationSummaryStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationValidateAcceptStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.qualificationWhosInvolvedStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.QualificationSuccess ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.CreateProposal ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalList) {
      this.isQualificationContext = true;
    }
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalTCOComparisonStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoListing ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoModeling ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoReview ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.tcoOutcomes ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.documentCenter ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.salesReadiness ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalValidateAcceptStep ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSuccess ||
      this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.previewQuote) {
      this.isProposalContext = true;
    }
    this.selectedType = 'ALL';
    this.showActivityLog(this.selectedType);
  }

  closeActivityLog() {
    this.appDataService.openActivityLog = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }
  onDateChange(event) {
    this.selectedDate = event.viewValue;
    this.selectedDateValue = event.value;
    this.showActivityLog(this.selectedType);
  }
  openValueModal(updatedValue, typeOfObj) {
    const modalRef = this.modalVar.open(ActivityLogDetailsComponent, { windowClass: 'activity-log-detail' });
    modalRef.componentInstance.jsonObj = updatedValue;
  }
  showActivityLog(type) {
    this.blockUiService.spinnerConfig.customBlocker = false;
    this.activityDataLoaded = true;
    if (type === 'ALL') {
      this.isAllSelected = true;
      this.isQualificatiosSelected = false;
      this.isProposalSelected = false;
      this.isTcoSelected = false;
      this.isDocusignSelected = false;
      this.isQuoteSelected = false;
      this.isOrderSelected = false;
      this.selectedType = 'ALL';
      this.activityData = [];
      if (this.isQualificationContext) {
        type = 'QUALIFICATION_ALL';
      } else if (this.isProposalContext) {
        type = 'PROPOSAL_ALL';
      }
    } else if (type === 'QUALIFICATION') {
      this.isQualificatiosSelected = true;
      this.isAllSelected = false;
      this.isProposalSelected = false;
      this.isTcoSelected = false;
      this.isDocusignSelected = false;
      this.isQuoteSelected = false;
      this.isOrderSelected = false;
      this.selectedType = 'QUALIFICATION';
      this.activityData = [];
    } else if (type === 'PROPOSAL') {
      this.isProposalSelected = true;
      this.isAllSelected = false;
      this.isQualificatiosSelected = false;
      this.isTcoSelected = false;
      this.isDocusignSelected = false;
      this.isQuoteSelected = false;
      this.isOrderSelected = false;
      this.activityData = [];
      this.selectedType = 'PROPOSAL';
    } else if (type === 'TCO') {
      this.isTcoSelected = true;
      this.isAllSelected = false;
      this.isProposalSelected = false;
      this.isQualificatiosSelected = false;
      this.isDocusignSelected = false;
      this.isQuoteSelected = false;
      this.isOrderSelected = false;
      this.activityData = [];
      this.selectedType = 'TCO';
    } else if (type === 'DOCUSIGN') {
      this.isDocusignSelected = true;
      this.isAllSelected = false;
      this.isTcoSelected = false;
      this.isProposalSelected = false;
      this.isQualificatiosSelected = false;
      this.isQuoteSelected = false;
      this.isOrderSelected = false;
      this.activityData = [];
      this.selectedType = 'DOCUSIGN';
    } else if (type === 'QUOTE') {
      this.isQuoteSelected = true;
      this.isAllSelected = false;
      this.isDocusignSelected = false;
      this.isTcoSelected = false;
      this.isProposalSelected = false;
      this.isQualificatiosSelected = false;
      this.isOrderSelected = false;
      this.activityData = [];
      this.selectedType = 'QUOTE';
    } else if (type === 'ORDER') {
      this.isOrderSelected = true;
      this.isAllSelected = false;
      this.isDocusignSelected = false;
      this.isTcoSelected = false;
      this.isProposalSelected = false;
      this.isQualificatiosSelected = false;
      this.isQuoteSelected = false;
      this.activityData = [];
      this.selectedType = 'ORDER';
    }

    let id;
    if (this.isQualificationContext) {
      id = this.qualService.qualification.qualID;
    } else if (type === 'QUALIFICATION' && this.isProposalContext) {
      id = this.qualService.qualification.qualID;
    } else if (type !== 'QUALIFICATION' && this.isProposalContext) {
      id = this.proposalDataService.proposalDataObject.proposalId;
    }

    this.activityLogService.getActivityLogData(id, type, this.selectedDateValue).subscribe((response: any) => {
      if (!response.error && response.activityLogs) {
        this.activityLogData = response.activityLogs;
        // let inputMap = {};
        this.activityLogData.forEach(element => {
          let oldNewObj = {};
          if (element.differentials && Object.keys(element.differentials).length > 0) {
            oldNewObj = element.differentials[(Object.keys(element.differentials)[0]).toString()];
            element.change = (Object.keys(element.differentials)[0]).toString();
            if (Object.keys(oldNewObj).length > 0) {
              element.oldChangedValue = oldNewObj['OLD_VALUE'];
              element.newChangedValue = oldNewObj['NEW_VALUE'];
            }
            if (Object.keys(element.differentials).length > 1) {
              element.viewMoreObj = element.differentials;

              let combinedDesc, oldChangedValue, newChangedValue;
              if (element.description == null) {
                Object.keys(element.differentials).forEach(ele => {
                  if (element.differentials[ele].description) {
                    if (combinedDesc) {
                      combinedDesc = combinedDesc + '\n' + element.differentials[ele].description;
                    } else {
                      combinedDesc = element.differentials[ele].description;
                    }
                  }
                  oldNewObj = element.differentials[ele];
                  if (Object.keys(oldNewObj).length > 0) {
                    if (oldChangedValue && oldNewObj['OLD_VALUE']) {
                      oldChangedValue = oldChangedValue + '\n' + oldNewObj['OLD_VALUE'];
                    } else if (oldNewObj['OLD_VALUE']) {
                      oldChangedValue = oldNewObj['OLD_VALUE'];
                    }
                    if (newChangedValue && oldNewObj['NEW_VALUE']) {
                      newChangedValue = newChangedValue + '\n' + oldNewObj['NEW_VALUE'];
                    } else if (oldNewObj['NEW_VALUE']) {
                      newChangedValue = oldNewObj['NEW_VALUE'];
                    }
                  }
                });
                element.description = combinedDesc;
                element.oldChangedValue = oldChangedValue;
                element.newChangedValue = newChangedValue;
              } else if (element.description) {
                Object.keys(element.differentials).forEach(ele => {
                  oldNewObj = element.differentials[ele];
                  if (Object.keys(oldNewObj).length > 0) {
                    if (oldChangedValue && oldNewObj['OLD_VALUE']) {
                      oldChangedValue = oldChangedValue + '\n' + oldNewObj['OLD_VALUE'];
                    } else if (oldNewObj['OLD_VALUE']) {
                      oldChangedValue = oldNewObj['OLD_VALUE'];
                    }

                    if (newChangedValue && oldNewObj['NEW_VALUE']) {
                      newChangedValue = newChangedValue + '\n' + oldNewObj['NEW_VALUE'];
                    } else if (oldNewObj['NEW_VALUE']) {
                      newChangedValue = oldNewObj['NEW_VALUE'];
                    }
                  }
                });
                element.oldChangedValue = oldChangedValue;
                element.newChangedValue = newChangedValue;
              }
            }
          }
          this.activityLogData[this.activityLogData.indexOf(element).toString()] = element;
        });
        this.activityData = this.activityLogData;
      }
      this.activityDataLoaded = false;
    });
  }
}
