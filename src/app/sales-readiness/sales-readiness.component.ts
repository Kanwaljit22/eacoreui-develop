//sales-rediness.comp  replease whole file
import { BreadcrumbsService } from './../core/breadcrumbs/breadcrumbs.service';
import { ConstantsService } from './../shared/services/constants.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SalesReadinessService } from './sales-readiness.service';
import { CreateProposalService } from '../proposal/create-proposal/create-proposal.service';
import { SubHeaderComponent } from '../shared/sub-header/sub-header.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualificationsService } from '../qualifications/qualifications.service';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LocaleService } from '@app/shared/services/locale.service';
import { MessageService } from '@app/shared/services/message.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ManualComplianceHoldReleaseComponent } from '@app/modal/manual-compliance-hold-release/manual-compliance-hold-release.component';
import { PermissionService } from '@app/permission.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sales-readiness',
  templateUrl: './sales-readiness.component.html',
  styleUrls: ['./sales-readiness.component.scss']
})
export class SalesReadinessComponent implements OnInit, OnDestroy {
  @ViewChild('myDrop', { static: false }) myDrop;
  data = {
    'editIcon': true,
    'changeTermName': true
  };
  salesReadinessData: any;
  json: any;
  showTimeline = false;
  coloumnTitleHeader: string[] = [];
  doneStatus = 'Done';
  workinonItStatus = 'Working On It';
  notDone = 'NOT DONE';
  COMPLETE_STATUS = 'COMPLETE';
  INPROGRESS_STATUS = 'IN PROGRESS';
  NOT_STARTED_STATUS = 'NOT STARTED';
  NOT_INITIATED_STATUS = 'NOT INITIATED';
  INITIATED_STATUS = 'INITIATED';
  INITIATE_STATUS = 'INITIATE';
  DECLINED_STATUS = 'DECLINED';
  SIGNED_STATUS = 'SIGNED';
  APPROVAL_IN_STATUS = 'APPROVAL IN PROGRESS';
  APPROVED_STATUS = 'APPROVED';
  SUBMITTED_STATUS = 'SUBMITTED';
  BOOKED_STATUS = 'BOOKED';
  ACTIVATION_COMPLETE_STATUS = 'ACTIVATION COMPLETE';
  Not_Released = 'NOT RELEASED';
  Released = 'RELEASED';

  Completed = 'COMPLETED';
  Pending = 'PENDING';
  Not_Uploaded = 'NOT UPLOADED';
  Uploaded = 'UPLOADED';
  Yes = 'YES';
  No = 'NO';
  Active = 'ACTIVE';
  Inactive = 'INACTIVE';
  Sent = 'SENT';
  Not_Sent = 'NOT Sent';
  More_Information_Required = 'MORE INFORMATION REQUIRED';
  Pending_Signature = 'PENDING SIGNATURE';
  Not_Captured = 'NOT CAPTURED';
  Not_Submitted = 'NOT SUBMITTED';
  Not_Applicable = 'NOT APPLICABLE';
  Failure = 'Failure';
  GreenField_Customer = 'Not Required - Green Field';
  BrownField_Customer = 'Not Required -100 % sold by';

  // Approval In Progress



  QUALIFICATION_SUMMARY = 'COMPLETE_QUALIFICATION';
  PROPOSAL_SUMMARY = 'COMPLETE_PROPOSAL';
  INTERNAL_EUIF = 'INTERNAL_EUIF_VALIDATION';
  INTERNAL_PROGRAM = 'INTERNAL_PROGRAM_TERM_VALIDATION';
  PARTNER_AUTHORIZATION = 'PARTNER_AUTHORIZATION_VALIDATION';
  INITIAL_PROPOSAL = 'INITIAL_PROPOSAL_CUSTOMER';
  SOCIALIZE_EUIF = 'SOCIALIZE_EUIF';
  SOCIALIZE_PROGRAM = 'SOCIALIZE_PROGRAM_TERMS';
  PACKAGE_CUSTOMER = 'PRESENTING_PACKAGE_CUSTOMER';
  BEST_PRACTICE_HUIDE = 'SHARE_BEST_PRACTISE_GUIDE';
  LEGAL_SIGN_OFF_DOCUSING = 'LEGAL_SIGN_OFF_DOCUSIGN';

  selectedAction = 'Please validate';
  allProposalData = [{ 'architectureName': 'Cisco DNA', 'status': 'Complete' },
  { 'architectureName': 'Cisco Data Center', 'status': 'Not Started' },
  { 'architectureName': 'Cisco Security Choice', 'status': 'Complete' }];
  public userInfo: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  subscription: Subscription;

  constructor(public localeService: LocaleService, public salesReadinessContainer: SalesReadinessService,
    private createProposalService: CreateProposalService, private router: Router, public messageService: MessageService,
    public permissionService: PermissionService, public proposalDataService: ProposalDataService, public appDataService: AppDataService,
    public qualService: QualificationsService, public constantsService: ConstantsService, private route: ActivatedRoute,
    private breadcrumbsService: BreadcrumbsService, private modalVar: NgbModal, public blockUiService: BlockUiService) { }

  ngOnInit() {
    this.userInfo = this.appDataService.getUserInfo();
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.salesReadiness;
    this.appDataService.showActivityLogIcon(true);
    this.coloumnTitleHeader = ['Stage', 'Status', 'Completed By', 'Completed On', 'Actions'];
    this.appDataService.isProposalIconEditable = false;

    if (!this.proposalDataService.proposalDataObject.proposalId) {

      // Get proposal id from request parameter
      this.route.paramMap.subscribe(params => {
        if (params.keys.length > 0) {
          let proposalId = params.get('proposalId');
          if (proposalId !== undefined && proposalId.length > 0) {
            this.proposalDataService.proposalDataObject.proposalId = parseInt(proposalId);
          }
        }
      });

      const sessionObject: SessionData = this.appDataService.getSessionObject();
      if (sessionObject) {
        this.appDataService.isPatnerLedFlow = sessionObject.isPatnerLedFlow;

        // check if subrefId is empty and subscription data is present in session -- set the data and changeSubFlow
        if (!this.qualService.subRefID && sessionObject.qualificationData && sessionObject.qualificationData.subscription && sessionObject.qualificationData.subscription.subRefId) {
          this.qualService.qualification.subscription = sessionObject.qualificationData.subscription;
          this.qualService.subRefID = sessionObject.qualificationData.subscription.subRefId;
        }
      }
      if (!sessionObject || this.proposalDataService.proposalDataObject.proposalId !== sessionObject.proposalDataObj.proposalId) {
        // Redirect to proposal summary incase of new tab or proposal id updated in the url
        this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
        return; // Return so that next code will not be executed incase of navigate
      }

      // this.qualService.qualification = sessionObject.qualificationData;
      this.qualService.qualification.qualID = sessionObject.qualificationData.id;
      this.qualService.qualification.name = sessionObject.qualificationData.qualName;
      this.qualService.qualification.status = sessionObject.qualificationData.status;

      this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;
      this.appDataService.userInfo.roSuperUser = sessionObject.userInfo.roSuperUser;
      this.appDataService.userInfo.rwSuperUser = sessionObject.userInfo.rwSuperUser;
      this.breadcrumbsService.showOrHideBreadCrumbs(true);
    }


    if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.IN_PROGRESS_STATUS) {
      this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId]);
      return;
    }
    this.json = {
      'data': {
        'id': this.proposalDataService.proposalDataObject.proposalId,
        // 'userId': this.appDataService.userId,
        'qualId': this.qualService.qualification.qualID
      }
    };
    // for breadcrumb
    this.appDataService.custNameEmitter.emit({
      'text': this.proposalDataService.proposalDataObject.proposalData.name,
      qualName: this.qualService.qualification.name.toUpperCase(), qualId: this.qualService.qualification.qualID,
      proposalId: this.proposalDataService.proposalDataObject.proposalId, 'context': AppDataService.PAGE_CONTEXT.salesReadiness
    });
    this.blockUiService.spinnerConfig.startChain();
    this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
    // if (!this.appDataService.isGroupSelected) { // call summary api to get financial sumamry data for single archs only
    //   this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
    // }
    this.getReadinessData();
    // call this after header loaded
    this.subscription = this.appDataService.headerDataLoaded.subscribe(() => {
      // console.log(this.permissionService.allowComplianceHold, this.salesReadinessData);
      // check if salesreadiness data loaded and not having compliance hold permission and remove the action label
      if (this.salesReadinessData && !this.permissionService.allowComplianceHold) {
        this.salesReadinessData.forEach((element, index) => {
          element.open = true;
          if (element['activityLines']) {
            element['activityLines'].filter(obj => {
              if (obj.identifier === 'COMPLIANCE_HOLD_RELEASE') {
                obj.actionLabel = '';
              }
            });
          }
        });
      }
      // if cx proposal call to set and show financial summary page
      if (this.proposalDataService.cxProposalFlow){
        this.proposalDataService.getCxFinancialSummaryData();
      } else if (!this.appDataService.isGroupSelected) { //  call summary api to get financial sumamry data for single archs only
        this.proposalDataService.getFinancialSummaryData(this.proposalDataService.proposalDataObject.proposalId);
      }
    });
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    this.proposalDataService.showFinancialSummary = false;
    this.subscription.unsubscribe();
  }

  getReadinessData() {
    this.salesReadinessContainer.getSalesReadinessData(this.proposalDataService.proposalDataObject.proposalId)
      .subscribe((responseData: any) => {

        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        if (responseData && !responseData.error) {
          if (responseData['data']) {
            this.salesReadinessData = responseData.data;
            this.salesReadinessData.forEach((element, index) => {
              element.open = true;
            });
            // this.salesReadinessData[2]['activityLines'][2] = {displayName: 'Compliance Hold', status: 'Not Released',
            // actionLabel: 'Manually Release', identifier: 'manual_release'};
          }
        } else {
          this.messageService.displayMessagesFromResponse(responseData)
        }
      });
  }

  getApplicableStatusClass(statusString) {

    let _statusStr = '';

    if (statusString === undefined) {
      return _statusStr;
    }
    if (statusString.toUpperCase() === this.doneStatus.toUpperCase()) {
      _statusStr = 'icon-sale-done';
    } else if (statusString.toUpperCase() === this.workinonItStatus.toUpperCase()) {
      _statusStr = 'icon-working-on-it';
    } else if (statusString.toUpperCase() === this.notDone.toUpperCase()) {
      _statusStr = 'icon-not-done';
    } else if (statusString.toUpperCase() === this.COMPLETE_STATUS.toUpperCase() ||
      statusString.toUpperCase() === this.Completed.toUpperCase()
      || statusString.toUpperCase() === this.Uploaded.toUpperCase() || statusString.toUpperCase() === this.Active.toUpperCase()
      || statusString.toUpperCase()  === this.Yes.toUpperCase() || statusString.toUpperCase() === this.GreenField_Customer.toUpperCase()
      || statusString.toUpperCase().search(this.BrownField_Customer.toUpperCase()) > -1 )  {
      _statusStr = 'icon-sale-completed';
    } else if (statusString.toUpperCase() === this.INPROGRESS_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-in-progress';
    } else if (statusString.toUpperCase() === this.NOT_STARTED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-not-started';
    } else if (statusString.toUpperCase() === this.NOT_INITIATED_STATUS.toUpperCase()) {
      _statusStr = ' icon-sale-not-initiated';
    } else if (statusString.toUpperCase() === this.INITIATED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-initiated';
    } else if (statusString.toUpperCase() === this.DECLINED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-not-started';
    } else if (statusString.toUpperCase() === this.SIGNED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-signed';
    } else if (statusString.toUpperCase() === this.APPROVAL_IN_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-in-progress';
    } else if (statusString.toUpperCase() === this.APPROVED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-approved';
    } else if (statusString.toUpperCase() === this.SUBMITTED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-submitted';
    } else if (statusString.toUpperCase() === this.BOOKED_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-booked';
    } else if (statusString.toUpperCase() === this.ACTIVATION_COMPLETE_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-activation-complete';
    } else if (statusString.toUpperCase() === this.INITIATE_STATUS.toUpperCase()) {
      _statusStr = 'icon-sale-initiated';
    } else if (statusString.toUpperCase() === this.Not_Released || statusString.toUpperCase() === this.Pending.toUpperCase()
      || statusString.toUpperCase() === this.No.toUpperCase()
      || statusString.toUpperCase() === this.Not_Uploaded.toUpperCase() || statusString.toUpperCase() === this.Not_Sent.toUpperCase()
      || statusString.toUpperCase() === this.More_Information_Required.toUpperCase()
      || statusString.toUpperCase() === this.Inactive.toUpperCase()
      || statusString.toUpperCase() === this.Pending_Signature.toUpperCase()
      || statusString.toUpperCase() === this.Not_Captured.toUpperCase()
      || statusString.toUpperCase() === this.Not_Submitted.toUpperCase()
      || statusString.toUpperCase() === this.Not_Applicable.toUpperCase() || statusString.toUpperCase() === this.Failure.toUpperCase()) {
      _statusStr = 'icon-sale-not-started';
    } else if (statusString.toUpperCase() === this.Released) {
      _statusStr = 'icon-sale-completed';
    }
    return _statusStr;
  }

  getSalesClass(statusString) {

    let _statusStr = '';

    if (statusString === undefined) {
      return _statusStr;
    }
    if (statusString.toUpperCase() === this.doneStatus.toUpperCase()) {
      _statusStr = 'status status-done';
    } else if (statusString.toUpperCase() === this.workinonItStatus.toUpperCase()) {
      _statusStr = 'status status-working';
    } else if (statusString.toUpperCase() === this.notDone.toUpperCase()) {
      _statusStr = 'status status-not-done';
    } else if (statusString.toUpperCase() === this.COMPLETE_STATUS.toUpperCase()
      || statusString.toUpperCase() === this.Completed.toUpperCase()
      || statusString.toUpperCase() === this.Uploaded.toUpperCase() || statusString.toUpperCase() === this.Active.toUpperCase()
      || statusString.toUpperCase()  === this.Yes.toUpperCase() || statusString.toUpperCase() === this.GreenField_Customer.toUpperCase()
      || statusString.toUpperCase().search(this.BrownField_Customer.toUpperCase()) > -1)  {
      _statusStr = 'status sale-completed';
    } else if (statusString.toUpperCase() === this.INPROGRESS_STATUS.toUpperCase()) {
      _statusStr = 'status sale-in-progress';
    } else if (statusString.toUpperCase() === this.NOT_STARTED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-not-started';
    } else if (statusString.toUpperCase() === this.NOT_INITIATED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-not-initiated';
    } else if (statusString.toUpperCase() === this.INITIATED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-initiated';
    } else if (statusString.toUpperCase() === this.DECLINED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-not-started';
    } else if (statusString.toUpperCase() === this.SIGNED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-signed';
    } else if (statusString.toUpperCase() === this.INPROGRESS_STATUS.toUpperCase()) {
      _statusStr = 'status sale-in-progress';
    } else if (statusString.toUpperCase() === this.APPROVED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-approved';
    } else if (statusString.toUpperCase() === this.SUBMITTED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-submitted';
    } else if (statusString.toUpperCase() === this.BOOKED_STATUS.toUpperCase()) {
      _statusStr = 'status sale-booked';
    } else if (statusString.toUpperCase() === this.ACTIVATION_COMPLETE_STATUS.toUpperCase()) {
      _statusStr = 'status sale-activation-complete';
    } else if (statusString.toUpperCase() === this.INITIATE_STATUS.toUpperCase()) {
      _statusStr = 'status sale-initiated';
    } else if (statusString.toUpperCase() === this.APPROVAL_IN_STATUS.toUpperCase()) {
      _statusStr = 'status sale-in-progress';
    } else if (statusString.toUpperCase() === this.Not_Released || statusString.toUpperCase() === this.Pending.toUpperCase()
      || statusString.toUpperCase() === this.No.toUpperCase()
      || statusString.toUpperCase() === this.Not_Uploaded.toUpperCase() || statusString.toUpperCase() === this.Not_Sent.toUpperCase()
      || statusString.toUpperCase() === this.More_Information_Required.toUpperCase()
      || statusString.toUpperCase() === this.Inactive.toUpperCase()
      || statusString.toUpperCase() === this.Pending_Signature.toUpperCase()
      || statusString.toUpperCase() === this.Not_Captured.toUpperCase()
      || statusString.toUpperCase() === this.Not_Submitted.toUpperCase()
      || statusString.toUpperCase() === this.Not_Applicable.toUpperCase() || statusString.toUpperCase() === this.Failure.toUpperCase()) {
      _statusStr = 'status sale-not-started';
    } else if (statusString.toUpperCase() === this.Released) {
      _statusStr = 'status sale-completed';
    }
    return _statusStr;
  }

  getLogoClass(identifierStr: String) {


    let _statusStr = '';
    if (identifierStr === undefined) {
      return _statusStr;
    }

    if (identifierStr.toUpperCase() === this.QUALIFICATION_SUMMARY) {
      _statusStr = 'icon-qual-summary';
    } else if (identifierStr.toUpperCase() === this.PROPOSAL_SUMMARY) {
      _statusStr = 'icon-qual-summary';
    } else if (identifierStr.toUpperCase() === this.INTERNAL_EUIF
    || identifierStr.toUpperCase() === this.INTERNAL_PROGRAM
    || identifierStr.toUpperCase() === this.INITIAL_PROPOSAL
    || identifierStr.toUpperCase() === this.SOCIALIZE_EUIF
    || identifierStr.toUpperCase() === this.SOCIALIZE_PROGRAM
    || identifierStr.toUpperCase() === this.LEGAL_SIGN_OFF_DOCUSING
    || identifierStr.toUpperCase() === this.BEST_PRACTICE_HUIDE
    || identifierStr.toUpperCase() === this.PACKAGE_CUSTOMER || identifierStr.toUpperCase() === 'TCO_DOWNLOAD') {
      _statusStr = 'icon-document-center';
    }
    return _statusStr;
  }
  /* left panel toggle code starts */
  toggleSalesContainer(object, index) {
    object.expanded = !object.expanded;
  }
  /* left panel toggle code ends */




  /* click on link navigate to pages code starts*/
  salesReadinessNavigation(navigationPage) {
    let showSummary;

    if (navigationPage.actionUrl && navigationPage.actionUrl.length > 0) {
      window.open(navigationPage.actionUrl, '_self');
    } else if (navigationPage['identifier'] === 'COMPLIANCE_HOLD_RELEASE' && navigationPage['status'].toUpperCase() === this.Not_Released) {
      this.salesReadinessContainer.getComplianceHoldData(this.proposalDataService.proposalDataObject.proposalId)
        .subscribe((responseData: any) => {
          if (responseData && !responseData.error) {
            const ngbModalOptionsLocal = this.ngbModalOptions;
            const modalRef = this.modalVar.open(ManualComplianceHoldReleaseComponent, { windowClass: 'add-specialist' });
            modalRef.componentInstance.complianceFieldReleaseData = responseData['data'];
            modalRef.result.then((result) => {
              if (result) {
                this.salesReadinessContainer.postComplianceHoldData(result).subscribe((responseData: any) => {
                  this.getReadinessData();
                });
              }
              //  this.salesReadinessData[2]['activityLines'][2] = {displayName: 'Compliance Hold', status: 'Released',
              //      actionLabel: 'Coming Soon', completedBy: 'Mariar Roark',
              //      completedOn: 'Friday 25-Oct-19 20:05:05-0400', identifier: 'coming_soon'};
            });
          } else {
            this.messageService.displayMessagesFromResponse(responseData);
          }
        });
    }
  }

  goToProposalList() {
    this.router.navigate(['qualifications/proposal']);
  }

  goToPreviewQuotePage() {

    // if (this.appDataService.isGroupSelected === true) {
    //   this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalData.groupId + '/bom' + '/group']);
    // } else {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/bom']);
    // }
  }

  goToDocumentCenter() {
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/document']);
  }

  /* click on link navigate to pages code ends*/

  expandCollapse(val) {
    val.open = !val.open;
  }

  openTimeline() {
    this.showTimeline = true;
  }

  closeTimeline() {
    this.showTimeline = false;
  }

  changeValidation(rowObject, selectedDropdownValue) {
    setTimeout(() => {
      this.myDrop.close();
    });

    this.json = {
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
      'userId': this.appDataService.userId,
      'identifier': rowObject.identifier,
      'action': selectedDropdownValue
    };

    this.salesReadinessContainer.validatePartnerAuthorization(this.json).subscribe((responseData: any) => {
      if (!responseData.error) {
        this.selectedAction = selectedDropdownValue;
        this.getReadinessData();
      }
    });

  }

  open(tooltip, val) {
    console.log(val, val.length);
    if (val.length > 62) {
      tooltip.open();
    }
  }

}

