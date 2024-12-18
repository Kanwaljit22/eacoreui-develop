
import { PartnerInfo } from './../../proposal/proposal.data.service';
import { PermissionEnum } from '@app/permissions';
import { PermissionService } from '@app/permission.service';
import { AppDataService } from '@app/shared/services/app.data.service';

import { Component, OnInit, Input, OnChanges, SimpleChanges, Renderer2 } from '@angular/core';
import { ConstantsService } from '@app/shared/services/constants.service';
import { MessageService } from '@app/shared/services/message.service';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { QualProposalListObj } from '../services/constants.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { SessionData } from '../services/app.data.service';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { LocaleService } from '@app/shared/services/locale.service';
import { DeleteQualificationComponent } from '@app/modal/delete-qualification/delete-qualification.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditQualificationComponent } from '@app/modal/edit-qualification/edit-qualification.component';
import { ManageTeamMembersComponent } from '@app/modal/manage-team-members/manage-team-members.component';
import { EditDealIdComponent } from '@app/modal/edit-deal-id/edit-deal-id.component';
import { ChangeDealIdComponent } from '@app/modal/change-deal-id/change-deal-id.component';
import { ColumnGridCellComponent } from '../ag-grid/column-grid-cell/column-grid-cell.component';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-qual-list',
  templateUrl: './qual-list.component.html',
  styleUrls: ['./qual-list.component.scss']
})
export class QualListComponent implements OnInit, OnChanges {
  @Input() public qualData: QualProposalListObj;
  @Input() public searchQual = '';
  @Input() public qualListOnDashboard = true;
  @Input() public changedData = [];
  toProposalSummary = false;
  searchArray = ['qualName', 'dealId', 'qualId', 'customerName'];
  partnerFlow = false;

  // Variables for grid view
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData = [];
  displayGridView = false;
  
  constructor(public localeService: LocaleService, public constantsService: ConstantsService,
    private dashboardService: DashboardService, public renderer: Renderer2, private eaService: EaService,
    private messageService: MessageService, private modalVar: NgbModal, private qualService: QualificationsService,
    public appDataService: AppDataService, public permissionService: PermissionService, public utilitiesService: UtilitiesService
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 30;
    this.gridOptions. frameworkComponents = {
      columnGridCell:<{ new(): ColumnGridCellComponent }>(
        ColumnGridCellComponent
      )
    };
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['changedData'] && changes['changedData'].previousValue !== changes['changedData'].currentValue) {
      this.getTableData();
    }
    if (changes['searchQual'] && changes['searchQual'].previousValue !== changes['searchQual'].currentValue) {
      this.onFilterTextBoxChanged();
    }
  }

  ngOnInit() {
    // this.rowData = this.qualData.data;
    this.appDataService.showEngageCPS = false;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);

    if (this.appDataService.userDashboardFLow === AppDataService.USER_DASHBOARD_FLOW) {
      this.appDataService.custNameEmitter.emit({ 'text': this.constantsService.QUALIFICATIONS,
      'context': AppDataService.USER_DASHBOARD_FLOW });
    }
    // getting the superuser info from session and assigning to appDataService
    if (!(this.appDataService.userInfo.rwSuperUser || this.appDataService.userInfo.roSuperUser)) {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      this.appDataService.userInfo.rwSuperUser = sessionObject.userInfo.rwSuperUser;
      this.appDataService.userInfo.roSuperUser = sessionObject.userInfo.roSuperUser;
      if (sessionObject.userInfo.permissionService) {
        this.permissionService.permissions = sessionObject.userInfo.permissionService.permissions;
      }
    }
    this.partnerFlow = this.appDataService.isPatnerLedFlow;
    if (this.qualData.isToggleVisible && this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.userQualifications) {
      this.displayGridView = true;
    }
  }

  viewProposal(val, i) {
    val.showProposal = !val.showProposal;
    if (val.showProposal) {
      this.renderer.addClass(document.body, 'position-fixed');
      this.dashboardService.qualificationLoader = true;
      this.dashboardService.getViewProposalForQual(val).subscribe((res: any) => {
        if (!res.error) {
          try {
            val['proposalVisible'] = true;
            if (res.data) {
              const proposalData: QualProposalListObj = {
                data: res.data, isCreatedByMe: true,
                isProposalInsideQualification: true, isProposalOnDashboard: true
              };
              val['proposal'] = proposalData;
            }
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {

          this.messageService.displayMessagesFromResponse(res);
        }
        this.dashboardService.qualificationLoader = false;
      });
    } else {
      this.renderer.removeClass(document.body, 'position-fixed');
    }
  }

  viewQualSummary(qualObject) {
    this.qualService.toProposalSummary = false;
    this.qualService.viewQualSummary(qualObject);
  }
  disableDelete(qualObj) {
    if (!qualObj.permissions || !qualObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (qualObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.QualDelete)) {
      return false;
    } else {
      return true;
    }
  }

  disableClone() {
    if (this.qualService.twoTUserUsingDistiDeal || this.qualService.isDistiWithTC) {
      return true;
    } 
  }

  disableChangeDeal(qualObj) {
    if (qualObj.changeSubscriptionDeal || this.qualService.twoTUserUsingDistiDeal || this.qualService.isDistiWithTC ) {
      return true;
    }    
  }

  disableManageTeam(qualObj) {
    if (!qualObj.permissions || !qualObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (qualObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.QualManageTeam)) {
      return false;
    } else {
      return true;
    }
  }

  disableEditIcon(qualObj) {
    if (!qualObj.permissions || !qualObj.permissions.featureAccess) {
      // if qual does not have permissions array, return ture to disable link/button.
      return true;
    }
    if (qualObj.permissions.featureAccess.some(permission => permission.name === PermissionEnum.QualEditName)) {
      return false;
    } else {
      return true;
    }
  }

  deleteQual(qualData, index: number) {
    const modalRef = this.modalVar.open(DeleteQualificationComponent, { windowClass: 'infoDealID' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.qualService.deleteQual(qualData.qualId).subscribe((res: any) => {
          if (res && !res.error) {
           // this.eaService.updateUserEvent(qualData, this.constantsService.QUALIFICATION_FS, this.constantsService.ACTION_DELETE);
            // method to call list api and store data
            this.getList(this.qualData.isCreatedByMe);
            // (<Array<any>>this.rowData).splice(index, 1);
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }

  // method to call created-by-me or shared-with-me api's and store data
  getList(event) {
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
      // get qual list for customer
      this.qualService.listQualification().subscribe((response: any) => {
        if (!response.error) {
          if (response.data) {
            this.qualData.data = response.data;
            this.rowData = response.data;
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.rowData);
              this.gridOptions.api.redrawRows();
            }
          } else {
            this.qualData.data = [];
            this.rowData = [];
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(this.rowData);
              this.gridOptions.api.redrawRows();
            }
            this.qualService.emptyListEmitter.emit();
          }
          this.qualService.qualListData = response;
          // this.qualData.isCreatedByMe = false;
          // this.qualService.isCreatedByMe = false;
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      })
    } else {
      if (!event) {
        // get qual list shared with the user
        this.qualService.qualsSharedWithMe().subscribe((response: any) => {
          if (!response.error && response.data) {
            this.qualData.data = response.data;
            this.qualService.qualListData = response;
            this.qualData.isCreatedByMe = false;
            this.qualService.isCreatedByMe = false;
            this.qualService.twoTUserUsingDistiDeal = this.appDataService.isTwoTUserUsingDistiDeal(this.appDataService.isTwoTierUser(response.data.buyMethodDisti) , response.data.distiDeal)//(this.is2tPartner && data.distiDeal) ? true : true;
            this.qualService.isDistiWithTC = this.appDataService.isDistiWithTransfferedControl(response.data.buyMethodDisti,response.data.distiInitiated);
         
          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        });
      } else {
        // get qual list created by user
        this.qualService.getQualListForDashboard().subscribe((res: any) => {
          this.qualData.data = res.data;
          this.qualService.qualListData = res;
          this.qualData.isCreatedByMe = true;
          this.qualService.isCreatedByMe = true;
        });
      }
    }
  }

  editQualName(qualObj, index) {
    if (this.disableEditIcon(qualObj)) {
      // if user done not have permission to edit qual then reture without any changes;
      return;
    } else {
      this.qualService.qualification.name = qualObj.name;
      this.qualService.qualification.eaQualDescription = qualObj.description ? qualObj.description : '';
      this.qualService.qualification.qualID = qualObj.id;
      this.appDataService.editModal = this.constantsService.QUALIFICATIONS;

      const modalRef = this.modalVar.open(EditQualificationComponent, { windowClass: 'searchLocate-modal' });
      modalRef.result.then((result) => {
        if (result.updatedQualName) {
          qualObj.name = result.updatedQualName;
          qualObj.qualName = result.updatedQualName;
          this.qualService.qualification.name = result.updatedQualName;
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.rowData);
            this.gridOptions.api.refreshView();
          }
          // this.qualService.updateSessionQualData();
        }
        if (result.updatedQualDesc !== undefined) {
          qualObj.description = result.updatedQualDesc;
          this.qualService.qualification.eaQualDescription = result.updatedQualDesc;
          // this.qualService.updateSessionQualData();
        }
        // this.rowData[index] = qualObj; 

      });
    }
  }

  openManageModal(qualObj) {
    this.qualService.getCustomerInfo(qualObj.qualId).subscribe((res: any) => {
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
              this.qualService.qualification.extendedsalesTeam = res.data.extendedSalesTeam;
              this.qualService.qualification.cxTeams = res.data.cxTeams;
              this.qualService.qualification.cxDealAssurerTeams = res.data.assurersTeams;
              this.qualService.qualification.distributorTeam = res.data.distiTeams;
              this.qualService.qualification.softwareSalesSpecialist = res.data.saleSpecialist;
              this.qualService.qualification.partnerTeam = res.data.partnerTeams;
              this.qualService.qualification.createdBy = res.data.createdBy;
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
              // modalRef.componentInstance.dedicatedSalesTeam = res.data.saleSpecialist;
              modalRef.result.then((result) => {
                qualObj.salesTeam = result.ciscoTeam.join(', ');
                qualObj.salesTeamList = result.ciscoTeam;
              });
            }
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        }
      }
    });
  }
  toggleView() {
    this.displayGridView = !this.displayGridView;
  }

  onGridReady(event) {
    this.getTableColumnsData();
  }
  getTableColumnsData() {
    this.qualService.getColumnsData().subscribe((response) => {
      if (response) {
        this.columnDefs = response;
        for (let i = 0; i < this.columnDefs.length; i++) {
          const column = this.columnDefs[i];
          if (column['field'] === 'qualName') {
            column.cellRenderer = this.getQualName.bind(this);
            column.cellClass = 'more-dropdown customer-popup';
          }
          if (column['field'] === 'status') {
            column.cellRenderer = this.getStatusStyle;
          }
          if (column['field'] === 'partnerDeal') {
            if (this.partnerFlow) {
              this.columnDefs.splice(i, 1);
            } else {
              column.cellRenderer = this.getDealType;
            }
          }
          if (column['field'] === 'customerName') {
            column.cellRenderer = this.getCustName;
          }
          if(column['field']==='partnerTeam' || column['field']==='salesTeam'){
            column.cellRenderer = 'columnGridCell';
          }
        }
        this.getTableData();
      }
    });
  }
  getDealType(params) {
    return (params.value ? 'Partner Led' : 'Cisco Led')
  }

  getQualName(params) {
    const tooltip = `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${params.value}</span></div>`;
    let actionDrop = "<div class='shareDiv'><span class='icon-more-link'></span><div class='dropdown-menu' aria-labelledby='mainDropdown'><ul>";

    if (this.disableDelete(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Delete Qualification</a></li><li class='list-break'></li>";
    } else if (!this.disableDelete(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item deleteQualification' href='javascript:void(0)'>Delete Qualification</a></li><li class='list-break'></li>";
    }
    if (this.disableEditIcon(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Rename Qualification</a></li><li class='list-break'></li>";
    } else if (!this.disableEditIcon(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item editQualName' href='javascript:void(0)'>Rename Qualification</a></li><li class='list-break'></li>";
    }
    if (this.disableClone()) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Clone</a></li>";
    } else {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item clone' href='javascript:void(0)'>Clone</a></li>";
    }

    if (this.disableChangeDeal(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Change Deal ID</a></li>";
    } else {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item dealIdChange' href='javascript:void(0)'>Change Deal ID</a></li>";
    }

    if (this.disableManageTeam(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item disabled' href='javascript:void(0)'>Manage Team</a></li>";
    } else if (!this.disableManageTeam(params.data)) {
      actionDrop = actionDrop +
        "<li><a class='dropdown-item manageTeamQual' href='javascript:void(0)'>Manage Team</a></li>";
    }
    actionDrop = actionDrop + "</ul></div></div>";
    /* if(this.disableDelete(params.data) && this.disableEditIcon(params.data) && this.disableManageTeam(params.data))  {
       actionDrop = "";
     }*/
    return '<span class="text-link custom-tooltip-wrap ellipsis"><span class="clickProposal" >' + params.value + '(' + params.data.qualId + ')' + tooltip + '</span>' + actionDrop + '</span>';
  }
  onCellClicked($event) {
    const dropdownClass = $event.event.target.classList.value;
    // const isDeleteQual = dropdownClass.search("deleteQualification");
    // const isManageTeam = dropdownClass.search("manageTeamQual");
    // const isEditQualName = dropdownClass.search("editQualName");

    // if(isDeleteQual > -1 || isManageTeam > -1 || isEditQualName > -1){
    //   if (isDeleteQual > -1) {
    //     this.deleteQual($event.data, $event.rowIndex);
    //   }
    //   if (isManageTeam > -1) {
    //     this.openManageModal($event.data);
    //   }
    //   if(isEditQualName > -1){
    //     this.editQualName($event.data, $event.rowIndex);
    //   }
    //   if(this.gridOptions.api){
    //     this.gridOptions.api.redrawRows();
    //   }
    // }else if($event.colDef.field === 'qualName') {
    //     this.viewQualSummary($event.data);
    // }

    // method optimization
    let redrawGrid = true;
    if (dropdownClass.search('deleteQualification') > -1) {
      this.deleteQual($event.data, $event.rowIndex);
    } else if (dropdownClass.search('manageTeamQual') > -1) {
      this.openManageModal($event.data);
    } else if (dropdownClass.search('editQualName') > -1) {
      this.editQualName($event.data, $event.rowIndex);
    } else if (dropdownClass.search('clone') > -1) {
      this.cloneQualOrChangeDealId(false, $event.data);
    } else if (dropdownClass.search('dealIdChange') > -1) {
      this.cloneQualOrChangeDealId(true, $event.data);
    } else if ($event.colDef.field === 'qualName' && dropdownClass.search('disabled') === -1) {
      redrawGrid = false;
      this.viewQualSummary($event.data);
    }

    if (this.gridOptions.api && redrawGrid) {
      this.gridOptions.api.redrawRows();
    }

  }

  getStatusStyle(params) {
    if (params.value.trim() === 'In Progress'.trim()) {
      return '<span style="color:#f49138">' + params.value + '</span>';
    } else {
      return '<span style="color:#6cc04a">' + params.value + '</span>';
    }
  }

  getCustName(params) {
    return '<span style="color:black">' + params.value + '</span>';
  }
  getTableData() {
    this.rowData = this.qualData.data;
    //  this.appendId();
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      // this.gridOptions.api.sizeColumnsToFit();
      setTimeout(() => {
        if (this.searchQual) {
          this.onFilterTextBoxChanged();
        }
      }, 500);
    }

  }

  appendId() {
    for (let i = 0; i < this.rowData.length; i++) {
      this.rowData[i].qualName = this.rowData[i].qualName + ' - (' + this.rowData[i].qualId + ')';
    }
  }
  onFilterTextBoxChanged() {
    // console.log(this.searchProposalBy)
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(this.searchQual);
    } else {
      this.gridOptions = <GridOptions>{
        onGridReady: () => {
          this.gridOptions.quickFilterText = this.searchQual;
        }
      };
    }
  }

  // Method to open modal and set changeDeal/cloneQual(true/false)
  cloneQualOrChangeDealId(event, qual) {
    this.messageService.hideParentErrorMsg = true;
    const modalRef = this.modalVar.open(ChangeDealIdComponent, { windowClass: 'editDeal' });
    modalRef.componentInstance.qualEAQualificationName = 'Copy of ' + qual.qualName;
    modalRef.componentInstance.eaQualDescription = qual.description;
    modalRef.componentInstance.qualId = qual.id;
    modalRef.componentInstance.isFromQualList = true;
    modalRef.componentInstance.changeDealid = event;
  }
}
