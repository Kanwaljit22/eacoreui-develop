import { PartnerInfo } from './../../proposal/proposal.data.service';
import { OnDestroy, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { ConstantsService } from '@app/shared/services/constants.service';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { MessageService } from '@app/shared/services/message.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QualProposalListObj } from '../services/constants.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProposalComponent } from '@app/modal/delete-proposal/delete-proposal.component';
import { ListProposalService } from '../../proposal/list-proposal/list-proposal.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { LocaleService } from "@app/shared/services/locale.service"; 
import { EditQualificationComponent } from '@app/modal/edit-qualification/edit-qualification.component';
import { ManageTeamMembersComponent } from '@app/modal/manage-team-members/manage-team-members.component';
import { LinkProposalArchitectureComponent } from '@app/modal/link-proposal-architecture/link-proposal-architecture.component';
import { SplitProposalComponent } from '@app/modal/split-proposal/split-proposal.component';
import { LinkProposalArchitectureService } from '@app/modal/link-proposal-architecture/link-proposal-architecture.service';
import { MessageType } from '../services/message';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { CreateTcoComponent } from '@app/modal/create-tco/create-tco.component';
import { TcoDataService } from '@app/tco/tco.data.service';
import { PermissionService, PermissionObj } from '@app/permission.service';
import { PermissionEnum } from "@app/permissions";
import { GridOptions } from 'ag-grid-community';
import { ColumnCellComponent } from './column-cell/column-cell.component';
import { ColumnGridCellComponent } from '../ag-grid/column-grid-cell/column-grid-cell.component';
import { EaService } from 'ea/ea.service';
@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public proposalData: QualProposalListObj;
  @Input() public changedData = [];
  @Input() public searchProposal = '';
  @Input() public proposalListOnQual = false;
  toProposalSummary = false;
  months: String;
  proposalDeleted = false;
  linkedProposalData: any[];
  searchArray = ['name', 'id', 'customerName', 'dealId'];
  matchingArchName: any;
  matchingArchName1: any;
  clickCross = false;
  recentlySplitGroupId = -1;
  showSuccessLink = false;
  showSuccessDeLink = false;
  proposalPermissions = new Map<string, PermissionObj>();
  partnerFlow = false;
  // Variables for grid view
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  displayGridView = false;
  openSharedDrop = false;
  openProposalStatusDrop = false;
  public domLayout;
  hideProposalGrid = true;
  dataNotLoaded = true;
  @Input() searchFilter: any = {}; // obj to set searched filter id and value
  isProposalPendingStatus = false; // to set true if proposal is in pending my teams/ pending my approvals
  constructor(public localeService: LocaleService, private router: Router, public constantsService: ConstantsService,
    public permissionService: PermissionService, public renderer: Renderer2,
    private dashboardService: DashboardService, private messageService: MessageService, public listProposalService: ListProposalService,
    private utilitiesService: UtilitiesService, public appDataService: AppDataService, private modalVar: NgbModal,
    public blockUiService: BlockUiService, private tcoDataService: TcoDataService,
    private qualService: QualificationsService, public proposalDataService: ProposalDataService,
    private route: ActivatedRoute, public constants: ConstantsService, private copyLinkService: CopyLinkService,
    public linkProposalArchitectureService: LinkProposalArchitectureService, public eaService: EaService) {
    this.months = this.constantsService.MONTHS;
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 21;
    this.gridOptions.frameworkComponents = {
      columnCell: <{ new(): ColumnCellComponent }>(
        ColumnCellComponent
        ),
        columnGridCell:<{ new(): ColumnGridCellComponent }>(
          ColumnGridCellComponent
        )
    };
    this.gridOptions.floatingFilter = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changedData'] && changes['changedData'].previousValue !== changes['changedData'].currentValue) {
      // this.proposalData.data = this.changedData;
      // this.setElapsedTimeColumn(); // method to check proposalPending status and show/hide elapsed time
      this.setElapsedTime(this.proposalData.data); // method to check and set elapsed time for proposal data in grid view
      this.getTableData();
    }

    if (changes['searchProposal'] && changes['searchProposal'].previousValue !== changes['searchProposal'].currentValue) {
      this.onFilterTextBoxChanged();
    }
  }

  onGridReady(event) {
    this.dataNotLoaded = true;
    this.getTableColumnsData();
  }

  getTableColumnsData() {
    this.listProposalService.getColumnsData().subscribe((response) => {
      if (response) {
        this.columnDefs = response;
        for (let i = 0; i < this.columnDefs.length; i++) {
          const column = this.columnDefs[i];
          if (column['field'] === 'name') {
            column.cellRenderer = this.proposalName.bind(this);
            column.cellClass = 'more-dropdown customer-popup';
          }
          if (column['field'] === 'id') {
            column.cellRenderer = this.proposalId.bind(this);           
          }
          if (column['field'] === 'architecture') {
            column.cellRenderer = this.archStyle;
          }
          if (column['field'] === 'status') {
            column.cellRenderer = this.getStatusTyle;
          }
          if (column['field'] === 'countryOfTransaction') {
            column.cellRenderer = this.getCountryLongname;
          }
          if (column['field'] === 'totalNetPrice') {
            column.cellRenderer = this.getCurrencyFormat.bind(this);
          }
          if (column['field'] === 'proposalType') {
            column.cellRenderer = this.getproposalType;
          }
          if (column['field'] === 'approverTeamDetails') {
            column.cellRenderer = 'columnCell';
          }
          if (column['field'] === 'elapsedTime') { // if field is elapsedTime set the cell renderer to show value and set styling required
            // if(!this.isProposalPendingStatus){
            //   column.hide = true;
            // } else {
            //   column.hide = false;
            // }
            column.cellRenderer = this.exceptionElapsedTime;
          }
          // if(column['field']!=='name' || column['field']!=='customerName' || column['field']!=='dealID' ){
          //   column.getQuickFilterText = this.getQuickFilter;
          // }
          if(column['field'] === 'suites'){
            column.cellRenderer = 'columnGridCell';
          }
          if(column['field'] === 'submittedBy'){
            column.cellRenderer = 'columnGridCell';
          }
          if(column['field'] === 'exceptionRequested'){
            column.cellRenderer = this.getExceptionRequestedList.bind(this);
          }

          
        }

        this.getTableData();
      }
    });
  }

  getQuickFilter() {
    return '';
  }


  onFilterTextBoxChanged() {
    // console.log(this.searchProposalBy)
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(this.searchProposal);
      // check for filtered row count and show no data found
      const count = this.gridOptions.api.getRenderedNodes().length;
      if (count === 0) {
        this.hideProposalGrid = true;
      } else {
        this.hideProposalGrid = false;
      }
      this.dataNotLoaded = false;
    }
  }

  // method for column cellRenderer of elapsedTime filed to set value and stlying required
  exceptionElapsedTime(params) {  
    if (params.data.elapsedTime) {    
      if ((params.data.elapsedTimeInStr >= 12 && params.data.elapsedTimeInStr <= 24) && params.data.elapsedTimeInHours) {
        return '<span class="bold-txt warning-txt"> ' + params.data.elapsedTime + '</span>';
      } else if (params.data.elapsedTimeInStr > 24 && params.data.elapsedTimeInHours) {
        return '<span class="bold-txt danger-txt"> ' + params.data.elapsedTime + '</span>';
      } else {
        return '<span class="bold-txt"> ' + params.data.elapsedTime + '</span>';
      }
    }
  }

  getproposalType(params) {
    if (!params.data.hasLinkedProposal) {
      return '  <span class="single-arch"><span class="icon-single-arch"></span><span>Single Architecture</span></span>';
    }
    if (params.data.hasLinkedProposal) {
      return '  <span class="single-arch"><span class="icon-cross-arch"></span> Cross Architecture</span>';
    }
  }

  getCurrencyFormat(params) {
    if (params.value && params.data.currencyCode) {
      return params.data.currencyCode + ' ' + this.utilitiesService.formatWithNoDecimal(params.value);
    } else if (params.value === 0 && params.data.currencyCode) {
      return params.data.currencyCode + ' 0';
    }
  }

  getCountryLongname(params) {
    if (!params.value) {
      return;
    }
    if (params.value.trim() === 'US') {
      return 'United States';
    } else {
      return params.value;
    }
  }

  getStatusTyle(params) {
    if (params.value) {
      if (params.value.trim() === 'Complete') {
        return "<span style='color:#88cb6c'>" + params.value + "</span>"
      } else {
        return "<span style='color:#f49c56'>" + params.value + "</span>"
      }
    }
  }


  getSubmittedByName(params) {

    if(params.data && params.data.proposalExceptionDetails){
        const submittedByName = params.data.proposalExceptionDetails[0].createdBy;
        return submittedByName;
    }
  }

  getExceptionRequestedList(params) {
    let exceptionNames = '';
    if(params.data && params.data.proposalExceptionDetails){
        const proposalExceptionsArray = params.data.proposalExceptionDetails;
      for(let i = 0; i < proposalExceptionsArray.length; i++) {
        exceptionNames = exceptionNames + proposalExceptionsArray[i].exceptionName;
      }
      const tooltip = `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${exceptionNames}</span></div>`;
      return '<span class="ellipsis custom-tooltip-wrap"><span class="clickProposal">' + exceptionNames + tooltip +'<\span><\span>';
    }
  }

  proposalName(params) {
    const tooltip = `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${params.value}</span></div>`;
    let actionDrop = "<div class='shareDiv'><span class='icon-more-link'></span><div class='dropdown-menu' aria-labelledby='mainDropdown'>";
    if (this.disableEditIcon(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Edit Proposal Name</a></li><li class='list-break'></li>";
    } else if (!this.disableEditIcon(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item editProposalName' href='javascript:void(0)'>Edit Proposal Name</a></li><li class='list-break'></li>";
    }
    if (this.disableClone(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Clone</a></li><li class='list-break'></li>";
    } else if (!this.disableClone(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item cloneProposal' href='javascript:void(0)'>Clone</a></li><li class='list-break'></li>";
    }
    if (this.disableDelete(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Delete</a></li><li class='list-break'></li>";
    } else if (!this.disableDelete(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item deleteProposal' href='javascript:void(0)'>Delete</a></li><li class='list-break'></li>";
    }
    if (this.disableManageteam(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Manage Team</a></li><li class='list-break'></li>";
    } else if (!this.disableManageteam(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item manageTeamQual' href='javascript:void(0)'>Manage Team</a></li><li class='list-break'></li>";
    }
    if (this.disableEditIcon(params.data) && params.data.crossProposal) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Link New Architecture</a></li><li class='list-break'></li>";
    } else if (!this.disableEditIcon(params.data) && params.data.crossProposal) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item linkNewArch' href='javascript:void(0)'>Link New Architecture</a></li><li class='list-break'></li>";
    }
    if (this.disableLinkDelink(params.data)) {
      if (!params.data.hasLinkedProposal) {
        actionDrop = actionDrop +
          "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Link Proposal for Cross Architecture</a></li><li class='list-break'></li>";
      } else {
        actionDrop = actionDrop +
          "<li><a class='dropdown-item disabled' href='javascript:void(0)'>De-Link Proposal for Cross Architecture</a></li><li class='list-break'></li>";
      }
    } else if (!this.disableLinkDelink(params.data)) {
      if (!params.data.hasLinkedProposal) {
        actionDrop = actionDrop +
          "<li><a class='dropdown-item linkProposal' href='javascript:void(0)'>Link Proposal for Cross Architecture</a></li><li class='list-break'></li>";
      } else {
        if (params.data.relatedCxProposalId){
          actionDrop = actionDrop +
          "<li><a class='dropdown-item disabled' href='javascript:void(0)'>De-Link Proposal for Cross Architecture</a></li><li class='list-break'></li>";
        } else {
          actionDrop = actionDrop +
          "<li><a class='dropdown-item delinkProp' href='javascript:void(0)'>De-Link Proposal for Cross Architecture</a></li><li class='list-break'></li>";
        }
      }
    }
    if (this.disableToTco(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>View TCO Proposal</a></li><li class='list-break'></li>";
    } else if (!this.disableToTco(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item viewTCO' href='javascript:void(0)'>View TCO Proposal</a></li><li class='list-break'></li>";
    }
    if (this.disableSalesReadiness(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Sales Readiness Checklist</a></li><li class='list-break'></li>";
    } else if (!this.disableSalesReadiness(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item salesReadiness' href='javascript:void(0)'>Sales Readiness Checklist</a></li><li class='list-break'></li>";
    }
    if (this.disableDocCenter(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Document Center</a></li><li class='list-break'></li>";
    } else if (!this.disableDocCenter(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item documentCenter' href='javascript:void(0)'>Document Center</a></li><li class='list-break'></li>";
    }
    if (this.disablePreviewQuote(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Preview Quote</a></li>";
    } else if (!this.disablePreviewQuote(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item previewQuote' href='javascript:void(0)'>Preview Quote</a></li>";
    }
    actionDrop = actionDrop + "</ul></div></div>";
    let clickSpan = '';
    if (params.data.isChild) {
      clickSpan = '<span class="clickProposal" style="padding-left:15px" >';
    } else {
      clickSpan = '<span class="clickProposal" >';
    }
    return '<span class="text-link custom-tooltip-wrap ellipsis pr-2">' + clickSpan + params.value  + tooltip + ' </span>' + actionDrop + '</span>';
  }



  proposalId(params) {
    return '<span class="clickProposal" ><span class="text-link custom-tooltip-wrap ellipsis pr-2">'  + params.value   + '</span> </span>';
  }

  onCellClicked($event) {
    const dropdownClass = $event.event.target.classList.value;
    // Navigate to proposal summary
    if ($event.colDef.field === 'name') {
      // check if clicked on link text
      if ($event.event.target.className === 'clickProposal') {
        this.goToProposalSummary($event.data);
        return;
      }
    }
    if($event.colDef.field === 'id'){
      this.goToProposalSummary($event.data);
      return;
    }
    if ($event.colDef.field === 'qualificationName') {
      let url = window.location.href.split("#", 2);
      window.open(url[0] + '#/qualifications/' + $event.data.qualId);
    }

    if (dropdownClass.search('arch-count') > -1) {
      if ($event.node.expanded) {
        $event.event.target.classList.remove('isOpen')
        $event.node.setExpanded(false);
      } else {
        $event.event.target.classList.add('isOpen')
        $event.node.setExpanded(true);
      }
      return;
    }

    const iseditProposalName = dropdownClass.search("editProposalName");
    const isCloneProposal = dropdownClass.search("cloneProposal");
    const isDeleteProposal = dropdownClass.search("deleteProposal");
    const isManageTeam = dropdownClass.search("manageTeamQual");
    const isLinkProposal = dropdownClass.search("linkProposal");
    const isdeLinkProposal = dropdownClass.search("delinkProp");
    const isViewtco = dropdownClass.search("viewTCO");
    const isSalesReadiness = dropdownClass.search("salesReadiness");
    const isDocumentCenter = dropdownClass.search("documentCenter");
    const isPreviewQuote = dropdownClass.search("previewQuote");
    const isLinkNewArch = dropdownClass.search("linkNewArch");

    if (iseditProposalName > -1 || isDeleteProposal > -1 || isManageTeam > -1 || isCloneProposal > -1 || isLinkProposal > -1
      || isLinkNewArch > -1 || isViewtco > -1 || isSalesReadiness > -1 || isDocumentCenter > -1 || isPreviewQuote > -1 || isdeLinkProposal > -1
    ) {
      if (iseditProposalName > -1) {
        this.editProposalName($event.data);
      }
      if (isDeleteProposal > -1) {
        this.deleteProposal($event.data.id,$event.data);
      }
      if (isManageTeam > -1) {
        this.openManageModal($event.data);
      }
      if (isCloneProposal > -1) {
        this.copyProposal($event.data.id);
      }
      if (isLinkProposal > -1) {
        this.openLinkProposalModal($event.data, false);
      }
      if (isLinkNewArch > -1) {
        this.openLinkProposalModal($event.data, false);
      }
      if (isdeLinkProposal > -1) {
        this.openLinkProposalModal($event.data, true);
      }
      if (isViewtco > -1) {
        this.goToTCOList($event.data);
      }
      if (isSalesReadiness > -1) {
        this.salesReadiness($event.data);
      }
      if (isDocumentCenter > -1) {
        this.documentCenter($event.data);
      }
      if (isPreviewQuote > -1) {
          // if($event.data.groupId){
          //   this.previewQuote($event.data);
          // } else {
            this.generateQuote($event.data);
            // }
      }
      if(this.gridOptions.api){
        this.gridOptions.api.redrawRows();
      }
    } else if ($event.colDef.field === 'name') {
      // this.viewQualSummary($event.data);           
    }
  }

  archStyle(params) {
    // count span - <span class="text-link arch-count">+1</span>
    let html = '';
    if (!params.value) {
      return "<div style='text-align:center'> -- </div>";
    }

    if (params.value.trim() === 'Cisco DNA') {
      html = ' <span class="icon-dna-indigo pos-rel--top-2" style="font-size:20px;" ><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></span> <span class="pos-rel--top-7" > ' + params.value + '</span>';
    } else if (params.value.trim() === 'Cisco Data Center') {
      html = ' <span class="icon-data-center-indigo pos-rel--top-2" style="font-size:20px;" > <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span></span> <span class="pos-rel--top-7">' + params.value + '</span>';
    } else if (params.value.trim() === 'Cisco Security Choice') {
      html = '<span  class="icon-security pos-rel--top-2" style="font-size:20px;" > <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span></span> <span class="pos-rel--top-7">' + params.value + '</span>';
    } else if (params.value.trim() === 'Cisco Services Support') {
      html = '<span class="icon-cx-logo-circle" style="font-size:16px;"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></span><span style="position:relative;top:-2px;">' + params.value + '</span>';
    } else {
      html = params.value;
    }

    if (params.data.archCount && params.data.archCount > 0) {
      html = html + `<span class="text-link arch-count">+${params.data.archCount}</span>`;
    }
    return html;
  }


  // method to check searched proposal id and set pending status to show/hide elapsed time column
  setElapsedTimeColumn() {
    if (this.searchFilter && Object.keys(this.searchFilter).length > 0 && (this.searchFilter.id === 'pending-my-approval' ||
    this.searchFilter.id === 'pending-my-team-approval')) {
      this.isProposalPendingStatus = true;
    } else {
      this.isProposalPendingStatus = false;
    }
    if (this.columnDefs && this.gridOptions.columnApi) {
      for (let i = 0; i < this.columnDefs.length; i++) {
        const column = this.columnDefs[i]
        if (column['field'] === 'elapsedTime') {
          // show/hide this column if field is elapsedTime and depening on proposalPending status
          this.gridOptions.columnApi.setColumnVisible(column.colId, this.isProposalPendingStatus);
        }
      }
    }
  }

  getTableData() {
    if (this.proposalData.data && this.proposalData.data.length !== 0) {
      const tempRowData = [...this.proposalData.data];
      const removePropIndex = [];
      for (let i = 0; i < tempRowData.length; i++) {
        if (tempRowData[i].hasLinkedProposal && !tempRowData[i].isChild) {
          tempRowData[i].children = [];
          tempRowData[i].archCount = 0;
          for (let j = i + 1; j < tempRowData.length; j++) {
            const groupId = tempRowData[i].groupId || tempRowData[i].parentGroupId;
            const childGroupId = tempRowData[j].groupId || tempRowData[j].parentGroupId;
            if (groupId && groupId !== childGroupId) {
              break;
            } else if(tempRowData[i].linkId && tempRowData[i].linkId !== tempRowData[j].linkId && !tempRowData[i].groupId && !tempRowData[j].groupId){
             break;
            } else {
              tempRowData[i].children.push(tempRowData[j]);
              tempRowData[j].isChild = true;
              removePropIndex.push(j);
            }
          }
          tempRowData[i].archCount = tempRowData[i].children.length;
        }
        if (tempRowData[i].nonTransactionalProposal){ 
          removePropIndex.push(i);
        }
      }

      for (let k = removePropIndex.length - 1; k >= 0; k--) {
        tempRowData.splice(removePropIndex[k], 1);
      }

      this.rowData = tempRowData;
      if (!this.searchProposal) {
        this.hideProposalGrid = false;
        this.dataNotLoaded = false;
      }
    } else {
      this.rowData = [];
      this.hideProposalGrid = true;
      this.dataNotLoaded = false;
    }

    // check and set hide value if user selects pendingMyTeam & pendingMy Apporvals 
    if (this.appDataService.userDashboardFLow === 'userFlow'){ 
      const exceptionFlow = (this.appDataService.pendingForMyApproval || this.appDataService.pendingForTeamApproval || this.appDataService.whereIAmApprover);

      for(const data of this.columnDefs){
        if(data.field === 'status' || data.field === 'qualificationName'){
          data.hide = exceptionFlow;
        } else if(data.field === 'submittedBy' || data.field === 'approverTeamDetails' || 
            data.field === 'exceptionRequested' || data.field === 'elapsedTime'){
              data.hide = !exceptionFlow;
        }
      }
    } else{
      for(const data of this.columnDefs){
        if(data.field === 'qualificationName'){
          data.hide = true;
        } 
        // else if(data.field === 'submittedBy' || data.field === 'approverTeamDetails' || 
        //     data.field === 'exceptionRequested' || data.field === 'elapsedTime'){
        //       data.hide = true;
        // }
      }
    }

    this.updateColumnMetaData(this.columnDefs);
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      // this.gridOptions.api.sizeColumnsToFit();
      if (this.searchProposal) {
        setTimeout(() => {
          this.onFilterTextBoxChanged()
        }, 500);
      }
    }
  }

  // method to hide columns
  updateColumnMetaData(columnList){
    for (let i = 0; i < columnList.length; i++) {
      const colObj = columnList[i];
      if (this.gridOptions.columnApi) {
        this.gridOptions.columnApi.setColumnVisible(colObj.colId, !colObj.hide);
      }
    }
  }

  getNodeChildDetails(rowItem) {
    if (rowItem.children) {
      return {
        group: true,
        children: rowItem.children,
        key: rowItem.group
      };
    } else {
      return null;
    }
  }


  toggleView() {
    this.hideProposalGrid = true;
    this.dataNotLoaded = true;
    this.listProposalService.displayGridView = !this.listProposalService.displayGridView;
  }
  ngOnInit() {
    this.domLayout = 'autoHeight';
    if (!this.proposalListOnQual && !this.appDataService.insideAllArchView &&
      this.appDataService.pageContext !== AppDataService.PAGE_CONTEXT.userDashboard) {
      this.proposalData.isToggleVisible = true;
      if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userProposals;
        if (this.proposalData.isToggleVisible) {
          this.listProposalService.displayGridView = true;
        }
      } else {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalList;
      }
    }

    // if we are displaying toggle then grid view should be the default view.
    // remove this condition if it is breaking in any case

    this.partnerFlow = this.appDataService.isPatnerLedFlow;

    // check and set isProposalPendingStatus based on searched filter id
    // if(this.searchFilter && Object.keys(this.searchFilter).length > 0 && (this.searchFilter.id === 'pending-my-approval' || this.searchFilter.id === 'pending-my-team-approval')){
    //   this.isProposalPendingStatus = true;
    // } else {
    //   this.isProposalPendingStatus = false;
    // }
    // Update proposal data to manage proposal grouping 
    this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
    this.setElapsedTime(this.proposalData.data);// method to check and set elapsed time styling
    if (this.proposalDataService.recentlySplitGroupId > -1) {
      // proposalDataService.recentlySplitGroupId > -1 shows that user tried to access multi offer proposal using deeplink. 
      this.recentlySplitGroupId = this.proposalDataService.recentlySplitGroupId;
      // to hideRecently split tag.
      setTimeout(() => {
        this.recentlySplitGroupId = -1;
      }, 6000);
    }
    if (this.appDataService.proposalIdToClone) {
      this.copyProposal(this.appDataService.proposalIdToClone);
    }
    this.appDataService.isProposalIconEditable = false;
    if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW && !this.proposalListOnQual) {
      this.appDataService.custNameEmitter.emit({ 'text': this.constantsService.PROPOSALS, 'context': AppDataService.USER_DASHBOARD_FLOW });
    }

  }

  ngOnDestroy() {
    this.messageService.pessistErrorOnUi = false;
    this.appDataService.proposalIdToClone = "";
    this.proposalDataService.recentlySplitGroupId = -1;
    this.qualService.buyMethodDisti = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }


  goToProposalSummary(proposalObj) {
    this.proposalDataService.proposalDataObject.proposalId = proposalObj.id;
    this.appDataService.isGroupSelected = false;
    // if multi arch. then split proposal else nevigate to prposal summary
    if (proposalObj.hasMultipleOffer) {
      this.openSplitModal(proposalObj);
    } else {
      // check proposal status and show proposal in active message if "In Active" status
      if (proposalObj.status === 'In Active') { // This Proposal is inactive as it was deleted on "Date" by "user"
        this.messageService.displayMessages(this.appDataService.setMessageObject('This Proposal is inactive as it was deleted by ' + proposalObj.userId, MessageType.Error), true);
      } else {
        this.qualService.goToProposalSummary(proposalObj);
      }
    }
  }
    
  // method to check if permissions are present in the proposal or not 
  // checkProposalPermissions(proposalObj) {
  //   if(!proposalObj.permissions || !proposalObj.permissions.featureAccess){
  //     //if qual does not have permissions array, return ture to disable link/button.
  //     return true;
  //   }
  // }

  // method to check for proposal clone permission
  disableClone(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess ||  this.qualService.twoTUserUsingDistiDeal || this.qualService.isDistiWithTC || proposalObj.type === ConstantsService.TYPE_CX) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalClone)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for proposal delete permission
  disableDelete(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess ||  this.qualService.twoTUserUsingDistiDeal 
      || this.qualService.isDistiWithTC || proposalObj.relatedCxProposalId) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalDelete)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for proposal manageteam permission
  disableManageteam(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.QualManageTeam)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for proposal edit name permission
  disableEditIcon(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalEditName)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for link/delink permission
  disableLinkDelink(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess || (proposalObj.type === ConstantsService.TYPE_CX)) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalLinkDelink)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for doc center permission
  disableDocCenter(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.DocCenter)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for sales readiness permission
  disableSalesReadiness(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.SalesReadiness)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for preview quote permission
  disablePreviewQuote(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalQuote)) {
      return false;
    } else {
      return true;
    }
  }

  // method to check for proposal edit permission
  disableToTco(proposalObj) {
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.Tco)) {
      return false;
    } else {
      return true;
    }
  }


  copyProposal(proposalId) {

    this.blockUiService.spinnerConfig.startChain();
    this.messageService.pessistErrorOnUi = false;
    this.proposalDataService.proposalDataObject.proposalId = proposalId;
    this.listProposalService.copyProposal(proposalId).subscribe((res: any) => {
      if (res && !res.error) {

        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        if (res.messages && res.messages.length > 0) {
          this.messageService.pessistErrorOnUi = true;
          this.messageService.displayMessages(res.messages);
          window.scrollTo(0, 0);
        }
        try {
          this.listProposalService.getProposalList().subscribe((res: any) => {
            this.proposalData.data = res.data;
            // Update proposal data to manage proposal grouping 
            this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
            this.setElapsedTime(this.proposalData.data);// method to check and set elapsed time styling
            this.getTableColumnsData(); // load grid after api call
            // this.router.navigate(['proposal']);
          });
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  deleteProposal(proposalId, proposalData?) {
    this.proposalDataService.proposalDataObject.proposalId = proposalId;
    const modalRef = this.modalVar.open(DeleteProposalComponent, { windowClass: 'infoDealID' });
    modalRef.componentInstance.message = this.localeService.getLocalizedMessage('modal.DELETE_PROPOSAL_MESSAGE');

    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.messageService.pessistErrorOnUi = false;
        this.listProposalService.deleteProposal(proposalId).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              this.listProposalService.getProposalList().subscribe((res: any) => {

                // Set proposal list empty when all proposal deleted
                if (res.data) {
                  if(proposalData){
                    this.eaService.updateUserEvent(proposalData, this.constantsService.PROPOSAL_FS, this.constantsService.ACTION_DELETE);
                  }
                  this.proposalData.data = res.data;
                  // const rowData = this.proposalData.data.filter((item)=>{
                  //   return (item.trim()==='Cisco DNA' || item.trim()==='Cisco Data Center' || item.trim()==='Cisco Security Choice')
                  // });
                  // this.rowData = rowData;
                  this.rowData = res.data;
                  if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.rowData);
                    // this.gridOptions.api.refreshView();
                  }
                  // Update proposal data to manage proposal grouping 
                  this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
                  this.setElapsedTime(this.proposalData.data);// method to check and set elapsed time styling
                } else {
                  this.proposalData.data = [];
                  this.rowData = [];
                  if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(this.rowData);
                    // this.gridOptions.api.refreshView();
                  }
                }
                this.proposalDeleted = true;
                // this.router.navigate(['proposal']);
              });
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });

  }



  generateQuote(proposal) {
    this.appDataService.subHeaderData.moduleName = '';
    if(proposal.hasLinkedProposal && proposal.groupId){ // check if proposal is cross arch/linked and load group level
      this.previewQuote(proposal);
    } else {
      this.updateSessionData(proposal, this.constantsService.BOM);
    }
  }

  documentCenter(proposal) {
    this.appDataService.subHeaderData.moduleName = '';
    if(proposal.hasLinkedProposal && proposal.groupId){ // check if proposal is cross arch/linked and load group level
      this.groupDocumentCenter(proposal);
    } else {
      this.updateSessionData(proposal, this.constantsService.DOC_CENTER);
    }
  }

  salesReadiness(proposal) {
    this.appDataService.subHeaderData.moduleName = '';
    this.updateSessionData(proposal, this.constantsService.SALES_READINESS);
  }

  // tcoModelling(proposal){
  //   this.updateSessionData(proposal, 'tco/editTco');
  //   //code for tco name
  //   //this.router.navigate(['qualifications/proposal/' + proposal.id + '/tco/editTco']);
  // }

  // get and set the proposal permissions 
  setProposalPermissions(proposal) {
    this.proposalPermissions.clear();
    if (proposal.permissions && proposal.permissions.featureAccess && proposal.permissions.featureAccess.length > 0) {
      this.proposalPermissions = new Map(proposal.permissions.featureAccess.map(i => [i.name, i]));
    } else {
      this.proposalPermissions.clear();
    }
  }
  goToTCOList(proposal) {

    // get and set the proposal permissions 
    this.setProposalPermissions(proposal);
    // Set local permission for debugger
    this.permissionService.isProposalPermissionPage(true);
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    // this.proposalDataService.proposalDataObject.proposalId = proposal.id; // to fix proposal id issue after going to doc center from quote page
    this.proposalDataService.proposalDataObject.proposalData = proposal; // To fix doc center first time navigation issue
    this.qualService.qualification.qualID = proposal.qualId;
    this.qualService.qualification.name = proposal.qualificationName;
    this.appDataService.customerName = proposal.customerName;
    // this.qualService.updateSessionQualData(); // to avoid duplicate call for doc center only 
    this.proposalDataService.updateSessionProposal();
    this.appDataService.userDashboardFLow = "";
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.custInfo.custName = this.appDataService.customerName;
    sessionObject.userDashboardFlow = '';
    if (this.qualService.qualification) {
      sessionObject.qualificationData = this.qualService.qualification;
    }
    this.tcoDataService.isHeaderLoaded = false;
    // set userreadwrite access and create access to session 
    sessionObject.isUserReadWriteAccess = (this.proposalPermissions.has(PermissionEnum.ProposalEditName) || this.proposalPermissions.has(PermissionEnum.ProposalViewOnly));
    sessionObject.createAccess = this.proposalPermissions.has(PermissionEnum.ProposalCreate);
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.archName = proposal.archName; // to set arch name
    this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco/tcoList']);
  }


  initiateTCOModel(proposal) {
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    const modalRef = this.modalVar.open(CreateTcoComponent, { windowClass: 'create-tco' });
    modalRef.componentInstance.headerMessage = this.localeService.getLocalizedString('tco.list.edit.CREATE_NEW_TCO');
    modalRef.result.then((result) => {
      if (result && result.tcoCreated === true) {
        // to load header on tco modeling page.
        this.tcoDataService.isHeaderLoaded = false;
        this.updateSessionData(proposal, '/tco/' + this.tcoDataService.tcoId);
      } else {

      }
    });
    // this.router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/tco/editTco']);
  }

  updateSessionData(proposal, screenName) {
    // get and set the proposal permissions
    this.setProposalPermissions(proposal);
    this.appDataService.isGroupSelected = false;
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    this.proposalDataService.proposalDataObject.proposalData = proposal; // To fix doc center first time navigation issue

    this.qualService.qualification.qualID = proposal.qualId;
    this.qualService.qualification.name = proposal.qualificationName;
    this.appDataService.customerName = proposal.customerName;
    if (screenName !== this.constantsService.DOC_CENTER) { // to avoid duplicate call for doc center only
      this.qualService.updateSessionQualData();
    }
    this.proposalDataService.updateSessionProposal();
    if (this.appDataService.userDashboardFLow) {
      this.appDataService.userDashboardFLow = "";
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      sessionObject.custInfo.custName = this.appDataService.customerName;
      sessionObject.userDashboardFlow = '';
      if (this.qualService.qualification) {
        sessionObject.qualificationData = this.qualService.qualification;
      }
      // set userreadwrite access and create access to session
      sessionObject.isUserReadWriteAccess = (this.proposalPermissions.has(PermissionEnum.ProposalEditName) || this.proposalPermissions.has(PermissionEnum.ProposalViewOnly));
      sessionObject.createAccess = this.proposalPermissions.has(PermissionEnum.ProposalCreate);
      this.appDataService.setSessionObject(sessionObject);
      this.router.navigate(['qualifications/proposal/' + proposal.id + '/' + screenName]);
    } else {
      this.router.navigate([proposal.id + '/' + screenName], { relativeTo: this.route });
    }
  }

  groupDocumentCenter(proposal) {
    // get and set the proposal permissions 
    this.setProposalPermissions(proposal);
    this.proposalDataService.proposalDataObject.proposalId = proposal.groupId;
    //this.proposalDataService.proposalDataObject.proposalId = proposal.id; // to fix proposal id issue after going to doc center from quote page
    this.proposalDataService.proposalDataObject.proposalData = proposal; // To fix doc center first time navigation issue
    this.qualService.qualification.qualID = proposal.qualId;
    this.qualService.qualification.name = proposal.qualificationName;
    this.appDataService.customerName = proposal.customerName;
    // this.qualService.updateSessionQualData(); // to avoid duplicate call for doc center only
    this.proposalDataService.updateSessionProposal();
    this.appDataService.userDashboardFLow = "";
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.custInfo.custName = this.appDataService.customerName;
    sessionObject.userDashboardFlow = '';
    if (this.qualService.qualification) {
      sessionObject.qualificationData = this.qualService.qualification;
    }
    // set userreadwrite access and create access to session
    sessionObject.isUserReadWriteAccess = (this.proposalPermissions.has(PermissionEnum.ProposalEditName) || this.proposalPermissions.has(PermissionEnum.ProposalViewOnly) );
    sessionObject.createAccess = this.proposalPermissions.has(PermissionEnum.ProposalCreate);
    this.appDataService.setSessionObject(sessionObject);

    this.appDataService._router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalData.groupId + '/' + this.constantsService.DOC_CENTER + '/' + 'group']);
  }

  previewQuote(proposal) {
    // get and set the proposal permissions
    this.setProposalPermissions(proposal);
    this.proposalDataService.proposalDataObject.proposalId = proposal.groupId;
    //this.proposalDataService.proposalDataObject.proposalId = proposal.id; // to fix proposal id issue after going to doc center from quote page
    this.proposalDataService.proposalDataObject.proposalData = proposal; // To fix doc center first time navigation issue
    this.qualService.qualification.qualID = proposal.qualId;
    this.qualService.qualification.name = proposal.qualificationName;
    this.appDataService.customerName = proposal.customerName;
    this.qualService.updateSessionQualData();
    this.proposalDataService.updateSessionProposal();
    this.appDataService.userDashboardFLow = "";
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    sessionObject.custInfo.custName = this.appDataService.customerName;
    sessionObject.userDashboardFlow = '';
    // set userreadwrite access and create access to session
    sessionObject.isUserReadWriteAccess = (this.proposalPermissions.has(PermissionEnum.ProposalEditName) || this.proposalPermissions.has(PermissionEnum.ProposalViewOnly));
    sessionObject.createAccess = this.proposalPermissions.has(PermissionEnum.ProposalCreate);
    this.appDataService.setSessionObject(sessionObject);
    this.appDataService.isGroupSelected = true;
    this.appDataService._router.navigate(['qualifications/proposal/' + this.proposalDataService.proposalDataObject.proposalData.groupId + '/' + this.constantsService.BOM + '/' + 'group']);

  }

  editProposalName(proposal) {
    this.proposalDataService.proposalDataObject.proposalData.name = proposal.name;
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    this.proposalDataService.proposalDataObject.proposalData.desc = proposal.desc;
    this.appDataService.editModal = this.constantsService.PROPOSALS;

    const modalRef = this.modalVar.open(EditQualificationComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      if (this.rowData) {
        const index = this.rowData.find(item => item.id === proposal.id);
      }
      if (result.updatedProposalName) {
        proposal.name = result.updatedProposalName;
        this.proposalDataService.proposalDataObject.proposalData.name = result.updatedProposalName;
        if (this.gridOptions.api) {
          // this.gridApi.setRowData(this.rowData);
          this.gridOptions.api.setRowData(this.rowData);
          // this.gridOptions.api.refreshView();
        }
        // this.proposalDataService.updateSessionProposal();
      }
      if (result.updatedProposalDesc !== undefined) {
        proposal.desc = result.updatedProposalDesc;
        this.proposalDataService.proposalDataObject.proposalData.desc = result.updatedProposalDesc;
        // this.proposalDataService.updateSessionProposal();
      }
    });
  }

  openManageModal(proposalData) {
    this.qualService.getCustomerInfo(proposalData.qualId).subscribe((res: any) => {
      if (res) {
        if (res.messages && res.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(res);
        }
        if (!res.error) {
          try {
            if (res.data) {
              const data = res.data;
              this.qualService.qualification.name = data.qualName;
              this.qualService.qualification.qualID = data.id;
              this.qualService.qualification.createdBy = data.createdBy;
              this.qualService.qualification.extendedsalesTeam = res.data.extendedSalesTeam;
              this.qualService.qualification.cxTeams = res.data.cxTeams;
              this.qualService.qualification.cxDealAssurerTeams = (res.data.assurersTeams) ? res.data.assurersTeams : [];
              this.qualService.qualification.softwareSalesSpecialist = res.data.saleSpecialist;
              this.qualService.qualification.partnerTeam = res.data.partnerTeams;
              this.qualService.qualification.partnerDeal = res.data.partnerDeal;
              this.qualService.qualification.dealId = res.data.dealId;
              if (data.deal.accountManager) {
                this.qualService.qualification.accountManager.firstName = data.deal.accountManager.firstName;
                this.qualService.qualification.accountManager.lastName = data.deal.accountManager.lastName;
                this.qualService.qualification.accountManager.emailId = data.deal.accountManager.emailId;
                // added for getting userId of account Manager
                this.qualService.qualification.accountManager.userId = data.deal.accountManager.userId;
                this.qualService.qualification.accountManagerName = data.am;
              }
              this.qualService.buyMethodDisti = data.buyMethodDisti ? true : false; // set buyMethodDisti flag
              if (data.cam) {
                this.qualService.qualification.cam = data.cam;
              }
              const modalRef = this.modalVar.open(ManageTeamMembersComponent, { windowClass: 'manage-team' });
              // modalRef.componentInstance.extentedSalesTeam = res.data.extendedSalesTeam;
              if(!data.partnerDeal){
                modalRef.componentInstance.filterPartnersTeam = true;
              }
              modalRef.componentInstance.partnerId = (proposalData.partner && proposalData.partner.partnerId)  ? proposalData.partner.partnerId : 0; // check  partnerId to filter partner teams
              modalRef.componentInstance.proposalId = proposalData.id ? proposalData.id : 0; // check and partnerBeGeoId to filter partner teams
            }
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        }
      }
    });
  }

  openLinkProposalModal(proposal, openDeLinkModel) {
    this.blockUiService.spinnerConfig.blockUI();
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    this.proposalDataService.proposalDataObject.proposalData.name = proposal.name;
    this.proposalDataService.proposalDataObject.proposalData.status = proposal.status;
    this.proposalDataService.proposalDataObject.proposalData.currencyCode = proposal.currencyCode;
    this.proposalDataService.proposalDataObject.proposalData.archName = proposal.archName;
    this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = proposal.eaTermInMonths;
    this.proposalDataService.proposalDataObject.proposalData.billingModel = proposal.billingModel;
    this.proposalDataService.proposalDataObject.proposalData.countryOfTransactionName = proposal.countryOfTransactionName
    this.proposalDataService.proposalDataObject.proposalData.eaStartDateDdMmmYyyyStr = proposal.eaStartDateDdMmmYyyyStr;
    this.proposalDataService.proposalDataObject.proposalData.priceList = proposal.priceList;
    this.appDataService.archName = proposal.archName;
    this.proposalDataService.proposalDataObject.proposalData.totalNetPrice = proposal.totalNetPrice;
    this.proposalDataService.proposalDataObject.proposalData.hasLinkedProposal = proposal.hasLinkedProposal;
    this.proposalDataService.proposalDataObject.proposalData.architecture = proposal.architecture;
    this.proposalDataService.proposalDataObject.proposalData.mspPartner = proposal.mspPartner;
    // getting and storing groupId
    if (proposal.groupId) {
      this.proposalDataService.proposalDataObject.proposalData.groupId = proposal.groupId;
      if (!openDeLinkModel) {
        // to display group name if opening model for linking new proposal in existing group. 
        this.proposalDataService.proposalDataObject.proposalData.name = proposal.groupName;
        // to get all arch Names in group in case of cross-arch.
        this.proposalDataService.proposalDataObject.proposalData.architecture = proposal.groupName.substring(
          proposal.groupName.indexOf("-") + 1, proposal.groupName.lastIndexOf("-"));
      }
    } else {
      this.proposalDataService.proposalDataObject.proposalData.groupId = -1;
    }
    const modalRef = this.modalVar.open(LinkProposalArchitectureComponent, { windowClass: 'link-architecture' });
    modalRef.componentInstance.deLinkProposal = openDeLinkModel;
    modalRef.result.then((result) => {
      if (result.continue) {
        // idepeding on hasLinked call link or delink api 
        this.linkProposalArchitectureService.linkDelinkProposal(openDeLinkModel).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              // reload proposal list if success and no error
              this.listProposalService.getProposalList().subscribe((response: any) => {
                if (response) {
                  if (response.messages && response.messages.length > 0) {
                    this.messageService.displayMessagesFromResponse(res);
                  } else if (response.data) {
                    // show success message depending on hasLinkedProposal flag
                    if (openDeLinkModel) {
                      // msg for de-link.
                      this.copyLinkService.showMessage(this.localeService.getLocalizedString('proposal.list.DE_LINK_SUCCESS'));
                    } else {
                      // msg for link.
                      this.copyLinkService.showMessage(this.localeService.getLocalizedString('proposal.list.LINK_SUCCESS'));
                    }

                    // Update proposal data to manage proposal grouping 
                    this.proposalData.data = response.data;
                    this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
                    this.setElapsedTime(this.proposalData.data);// method to check and set elapsed time styling
                    this.getTableColumnsData(); // load grid after api call

                  }
                }
              });
            } catch (error) {
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }

  // get the linked data after linking proposals from the api to display in the pop of cross architecture in the proposal list
  getLinkedProposalData(proposal) {
    this.proposalDataService.proposalDataObject.proposalId = proposal.id;
    // getting and storing groupId
    if (proposal.groupId) {
      this.proposalDataService.proposalDataObject.proposalData.groupId = proposal.groupId;
    }
    // to allow pop up for cross architecture in the proposal list to show linked data
    proposal.clickCross = true;
    // get the linked proposal data after linked
    this.linkProposalArchitectureService.getLinkedProposalData().subscribe((response: any) => {
      if (response && response.data) {
        if (response.data) {
          // assign the matched/linked data for displaying in pop up
          this.linkedProposalData = response.data.matching;
          // assign the architecture name of linked proposal in the pop up
          this.matchingArchName = this.linkedProposalData[0].architecture;
          this.matchingArchName1 = this.linkedProposalData[1].architecture;
        } else {
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
            'admin.NO_DATA_FOUND'), MessageType.Warning));
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
    // disable the pop up for cross architecture in the proposal list after some time 
    setTimeout(() => {
      proposal.clickCross = false;
    }, 5000);
  }

  openSplitModal(proposalObj) {
    // check for permission edit name and allow user to split the proposal 
    if (!proposalObj.permissions || !proposalObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      this.permissionService.proposalSplit = false;
    }
    if (proposalObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.ProposalEditName)) {
      this.permissionService.proposalSplit = true;
    } else {
      this.permissionService.proposalSplit = false;
    }

    const modalRef = this.modalVar.open(SplitProposalComponent, { windowClass: 'split-proposal' });
    modalRef.result.then((result) => {
      if (result.continue) {
        this.listProposalService.splitProposal(proposalObj.id).subscribe((res: any) => {
          if (res) {
            if (res.messages && res.messages.length > 0) {
              window.scrollTo(0, 0);
              this.messageService.displayMessagesFromResponse(res);
            } else if (res.data && res.data.groupId) {
              this.recentlySplitGroupId = res.data.groupId;
              window.scrollTo(0, 0);
              // reload proposal list page after split.
              try {
                this.listProposalService.getProposalList().subscribe((response: any) => {
                  if (response) {
                    if (response.messages && response.messages.length > 0) {
                      this.messageService.displayMessagesFromResponse(res);
                    } else if (response.data) {
                      this.proposalData.data = response.data;

                      // Update proposal data to manage proposal grouping 
                      this.listProposalService.manageCrossProposalGrouping(this.proposalData.data);
                      this.setElapsedTime(this.proposalData.data);
                      this.getTableColumnsData(); // load grid after api call
                      // to hideRecently split tag.
                      setTimeout(() => {
                        this.recentlySplitGroupId = -1;
                      }, 6000);
                    }
                  }
                });
              } catch (error) {
                this.messageService.displayUiTechnicalError(error);
              }
            }
          }
        });
      }
    });
  }

  rampDropOutside(event, val) {
    val.showRampDrop = false;
  }

  approverTeamDropOutside(event, val) {
    val.showApproverTeamDropdown = false;
  }
  // Approval team name should not show for completed or in progress status
  checkProposalStatus(proposal) {
    this.displayApproverTeamName(proposal);
    if (proposal.status === this.constantsService.QUALIFICATION_COMPLETE || proposal.status === this.constantsService.IN_PROGRESS_STATUS) {
      return false;
    } else {
      return true;
    }
  }
  // display pending status team name as selected 
  displayApproverTeamName(proposal) {
    proposal.selectedApproverTeamName = proposal.approverTeamDetails[0].approverTeamName;
    proposal.approverTeamDetails.forEach(approverTeam => {
      if (approverTeam.exceptionStatus === 'Pending') {
        proposal.selectedApproverTeamName = approverTeam.approverTeamName;
      }
    });
  }

  // method to check and set elapsed time styling
  setElapsedTime(dataObj) {
    for (let d of dataObj) {
      if (d.elapsedTime) {
        if (d.elapsedTime.includes('Hour')) {
          d['elapsedTimeInHours'] = true;
        } else {
          d['elapsedTimeInHours'] = false;
        }
        // method to remove string from elapsed time and set number
        this.checkAndSetElapsedTime(d, d.elapsedTime);
      } else {
        d['elapsedTimeInHours'] = false;
      }
    }
  }

  // method to remove hour/minute and set the elapsedtime str to set styling
  checkAndSetElapsedTime(data, time) {
    data['elapsedTimeInStr'] = time.replace(/[^0-9\.]+/g, "");
  }

}
