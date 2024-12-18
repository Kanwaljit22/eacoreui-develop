import { BreadcrumbsService } from './../../core/breadcrumbs/breadcrumbs.service';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { QualificationsService } from '../../qualifications/qualifications.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { MessageService } from '../../shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { ListProposalService } from './list-proposal.service';
import { SubHeaderComponent } from '../../shared/sub-header/sub-header.component';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { CreateProposalService } from '../create-proposal/create-proposal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProposalComponent } from '@app/modal/delete-proposal/delete-proposal.component';
import { ConstantsService } from '@app/shared/services/constants.service';
import { QualProposalListObj } from '../../shared/services/constants.service';
import { LocaleService } from '@app/shared/services/locale.service';
const MONTH = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May',
'06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };
@Component({
  selector: 'app-list-proposal',
  templateUrl: './list-proposal.component.html',
})

export class ProposalListComponent implements OnInit, OnDestroy {

  static readonly IN_PROGRESS = 'In Progress';
  static readonly COMPLETE = 'Complete';


  createQualification = true;
  data: any;
  headers: any = [];
  listproposalData: QualProposalListObj;
  proposalCreatedBy = true;
  globalView: any;
  searchProposalBy = '';
  showInfo = true;
  openSharedDrop = false;
  openProposalStatusDrop = false;

  constructor(private router: Router, private route: ActivatedRoute, public listProposalService: ListProposalService, public localeService: LocaleService,
    public qualService: QualificationsService, public appDataService: AppDataService, public messageService: MessageService,
    private utilitiesService: UtilitiesService, public proposalDataService: ProposalDataService, public createProposalService: CreateProposalService, public renderer: Renderer2,
    private modalVar: NgbModal, private breadcrumbsService: BreadcrumbsService, public constantsService: ConstantsService) {

  }

  ngOnInit() {

    if (!this.appDataService.pageContext) {
      this.appDataService.isGroupSelected = true;
      // if(this.proposalDataService.listProposalData.isCreatedByMe)
      //   this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.MY_PROPOSAL');
      // else
      // this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.SHARED_PROPOSAL'); 
    }
    if (this.appDataService.userDashboardFLow === 'userFlow') {
      this.appDataService.showActivityLogIcon(false);
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userProposals;
    } else {
      this.appDataService.showActivityLogIcon(true);
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalList;
    }
    this.listproposalData = { data: [], isProposalOnDashboard: false, isProposalInsideQualification: false, isToggleVisible: true };
    // this.qualService.qualification.qualStatus = null;
    // if(this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW){
    //   const qualName = this.qualService.qualification.name.toUpperCase();
    //   this.appDataService.custNameEmitter.emit({'context': AppDataService.PAGE_CONTEXT.userProposals , 'text' : qualName, qualId : this.qualService.qualification.qualID});
    // }
    // this.listProposalService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
    // if uesr comes form proposal to proposal list page set proposal id as null.
    this.proposalDataService.proposalDataObject.proposalId = null;
    this.getProposalList();
  }

  getHeaders(header) {
    this.headers = [];
    this.headers.push({ 'heading': 'Proposal ID', 'value': header.id });
    this.headers.push({ 'heading': 'Billing Model', 'value': header.billingModel });
    this.headers.push({ 'heading': 'PriceList', 'value': header.priceList });
    this.headers.push({ 'heading': 'Term', 'value': (header.eaTermInMonths + ' Months') });

    let dateToFormat = header.eaStartDateStr;
    let year = dateToFormat.substring(0, 4);
    let month = dateToFormat.substring(4, 6);
    let day = dateToFormat.substring(6);
    let dateFormed = MONTH[month] + ' ' + day + ', ' + year;
    this.headers.push({ 'heading': 'EXPECTED START DATE', 'value': dateFormed });
    /*this.headers.push({ 'heading': 'Partner', 'value': header.primaryPartnerName }); */
    return this.headers;
  }

  getProposalList() {

    if (this.proposalDataService.listProposalData) {
      this.listproposalData = this.proposalDataService.listProposalData;
      this.globalView = !this.proposalDataService.listProposalData.isCreatedByMe;
      this.listproposalData.isProposalOnDashboard = false;
      this.listproposalData.isProposalInsideQualification = false;
    }
  }


  deleteProposal(innerData) {
    const modalRef = this.modalVar.open(DeleteProposalComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.message = this.localeService.getLocalizedMessage('modal.DELETE_PROPOSAL_MESSAGE');

    modalRef.result.then((result) => {
      if (result.continue === true) {
        let proposalId: any;
        innerData.forEach(element => {
          if (element.heading === 'Proposal ID') {
            proposalId = element.value;
          }
        });
        this.listProposalService.deleteProposal(proposalId).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              //  console.log(res);
              this.getProposalList();
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          }
        });
      }
    });
  }

  copyProposal(innerData) {
    let proposalId: any;
    innerData.forEach(element => {
      if (element.heading === 'Proposal ID') {
        proposalId = element.value;
      }
    });
    this.listProposalService.copyProposal(proposalId).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.getProposalList();
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      }
    });
  }

  deepLinktoQualification() {

    this.router.navigate(['./qualifications/' + this.qualService.qualification.qualID]);
  }

  globalSwitchChange(event) {
    this.proposalDataService.listProposalData.isCreatedByMe = !event;
    this.searchProposalBy = '';
    // this.listproposalData.isCreatedByMe = !event;
    this.listProposalService.getProposalList().subscribe((res: any) => {
      if (res && !res.error && res.data && res.data.length > 0) {
        if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
          this.qualService.qualification.qualID = res.data[0].qualId;
        }
        this.listproposalData.data = res.data;
        // this.rowData = res.data;
        // this.gridOptions.api.setRowData(this.rowData);
        // this.gridOptions.api.refreshView();
        // Update proposal data to manage proposal grouping
        this.listProposalService.manageCrossProposalGrouping(this.listproposalData.data);
      }
    });
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }

  closeInfo() {
    this.showInfo = false;
  }

  // Dropdown selected 
  dropdownSelected(selectedFilter) {
    this.resetApprovalTeamFlags();
    this.proposalDataService.listProposalData.isCreatedByMe = !event;
    if (selectedFilter.id === 'created-by-me') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.MY_PROPOSAL');
    } else if (selectedFilter.id === 'shared-with-me') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.SHARED_PROPOSAL');
    } else if (selectedFilter.id === 'pending-my-approval') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.PENDING_MY_APPROVAL');
      this.appDataService.pendingForMyApproval = true;
    } else if (selectedFilter.id === 'pending-my-team-approval') {
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.PENDING_TEAM_APPROVAL');
      this.appDataService.pendingForTeamApproval = true;
    } else if (selectedFilter.id === 'my-team-approval') {
      this.appDataService.whereIAmApprover = true;
      this.proposalDataService.proposalDataObject.proposalData.groupName = this.localeService.getLocalizedString('dashboard.proposal.I_AM_APPROVER')
    }
    this.searchProposalBy = '';
    this.listProposalService.selectedDropdown = selectedFilter;
    this.openSharedDrop = false;
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.pendingForMyApproval = this.appDataService.pendingForMyApproval;
    sessionObject.pendingForTeamApproval = this.appDataService.pendingForTeamApproval;
    sessionObject.whereIAmApprover = this.appDataService.whereIAmApprover;
    this.appDataService.setSessionObject(sessionObject);
    this.listProposalService.getProposalList().subscribe((res: any) => {

      if (res && !res.error && res.data && res.data.length > 0) {
        if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
          this.qualService.qualification.qualID = res.data[0].qualId;
        }
        this.listproposalData.data = res.data;
        // Update proposal data to manage proposal grouping 
        this.listProposalService.manageCrossProposalGrouping(this.listproposalData.data);
      } else {
        this.listproposalData.data = [];
      }
    });
  }

  // Dropdown click
  dropdownClick() {
    this.openSharedDrop = !this.openSharedDrop;
  }

  onClickedOutside(event) {
    this.openSharedDrop = false;
  }
  ngOnDestroy() {
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.proposalDataObject.proposalData.groupName = '';
    this.appDataService.showActivityLogIcon(false);
  }

  // method to set both approval flags
  resetApprovalTeamFlags(){
    this.appDataService.pendingForTeamApproval = false;
    this.appDataService.pendingForMyApproval = false;
    this.appDataService.whereIAmApprover = false;
  }
  
  onViewDrop(event) {
    this.openSharedDrop = false;
  }

}

