import { EventEmitter, ViewChild  } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef, CellValueChangedEvent, CellDoubleClickedEvent, GridReadyEvent } from 'ag-grid-community';
import { IRoadMap } from '../../../../app/shared/road-map/road-map.model';
// import { ITitleWithButtons, ICustomButtons } from '';
import { ITitleWithButtons } from '../../../../app/shared/title-with-buttons/title-with-buttons.model';
import { ManageSuitesGroupCell } from './group-cell/group-cell.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilitiesService } from '../../../../app/shared/services/utilities.service'
import { AppDataService, SessionData } from '../../../shared/services/app.data.service';
import { CreateProposalService } from '../../create-proposal/create-proposal.service';
import { ManageSuitesService } from '../manage-suites/manage-suites.service';
import { QualificationsService } from '../../../qualifications/qualifications.service';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { MessageService } from '../../../shared/services/message.service';
import { ProposalDataService } from '../../proposal.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from '../../../shared/services/constants.service';
import { NgbModal,NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ExpiredSuiteWarningComponent } from '@app/modal/expired-suite-warning/expired-suite-warning.component';
import { MessageType } from '../../../shared/services/message';
import { LocaleService } from '@app/shared/services/locale.service';
import { SuitesHeaderComponent } from './suites-header/suites-header.component';
import { ProposalSummaryService } from '../proposal-summary/proposal-summary.service';
import { PermissionEnum } from '@app/permissions';
import { PermissionService } from '@app/permission.service';
import { SuitesExistingSubscriptionHeaderComponent } from "@app/proposal/edit-proposal/manage-suites/suitesexistingsubscription-header/suitesexistingsubscription-header.component";
import { SuitesRenewalApprovalComponent } from "@app/modal/suites-renewal-approval/suites-renewal-approval.component";
import { CxConfirmationComponent } from '../../../modal/cx-confirmation/cx-confirmation.component';
import { ColumnGridCellComponent } from '@app/shared/ag-grid/column-grid-cell/column-grid-cell.component';
import { PartnerDealCreationService } from "@app/shared/partner-deal-creation/partner-deal-creation.service";


@Component({
  selector: 'app-manage-suites',
  templateUrl: './manage-suites.component.html',
  styleUrls: ['./manage-suites.component.scss']
})

export class ManageSuitesComponent implements OnInit, OnDestroy {

  roadMap: IRoadMap;
  titleWithButton: ITitleWithButtons = this.getTitleWithButton();
  page: number;
  dropdownsize: number;
  gridOptions: GridOptions;
  gridOptionsForExistingSub: GridOptions;
  reqJSON: any = {};
  suitesData = [];
  showGrid: boolean;
  suitesColumnDefs: any = [];
  json: any = {};
  private gridApi;
  private gridColumnApi;
  public domLayout;
  noOfChanges = 0;
  totalRowsSelected = 0;
  disableContinue = false;
  suiteConfig = [];
  initiallySelectedSuitesId = [];
  //  isUpdatedByUser = false;
  headerCheckBoxHanldeEmitter = new EventEmitter<boolean>();
  disableReOpen = false;
  enableMinSuitesMsg = false;
  public subscribers: any = {};
  selectedMandatorySuites: any = [];
  securityArchitecture = false;
  exceptionSuitesMessage = '';
  selectedSuiteId: any = [];
  allowReopen = false;
  partnerLedFlow = false;
  showAuthMessage = false;
  isAtoSelectionRequired = false;
  disabledSuitesCount = 0;
  isRequestStartDateDue = false;  // Flag to show error and stop user for moving forward to submit proposal if request start date is due.
  existingSuitesInSubscription = [];
  isChangeSubFlow = false;
  showSubscriptionServiceColumn =false;
  suitesOfExistingSubscription = [];
  colData = [];
  isShowInfoOpen = false;
  isHeaderCalled = false;
  cxSuitesData = []; // to set cxSuites data from suites data
  cxSuitesDataAlreadyPurchased = []; // to set already purchased cxsuites
  noRowsTemplate = 'No rows to show'
  includedCXSuites = []
  showLOCCConfirmationMessage = false;
  todaysDate: Date;
  isShowInfoMsgForAppD = false; // set to show info message if AppD suite selected
  isShowInfoMsgForThousandEye = false;

  //exitingMandatorySuitesCount = 0; 

  constructor(private router: Router, private route: ActivatedRoute, public blockUiService: BlockUiService,
    public manageSuitesService: ManageSuitesService, public qualService: QualificationsService, public permissionService: PermissionService,
    public messageService: MessageService, public proposalDataService: ProposalDataService, public proposalSummaryService: ProposalSummaryService,
    public appDataService: AppDataService, private utilitiesService: UtilitiesService, public localeService: LocaleService,
    public createProposalService: CreateProposalService, public constantsService: ConstantsService, private modalVar: NgbModal,public partnerDealCreationService: PartnerDealCreationService) {
    this.domLayout = 'autoHeight';
  }

  ngOnInit() {
    //  console.log(this.appDataService.roadMapPath, this.permissionService.proposalEdit, this.appDataService.roadMapPath);

    // Hide open a case incase of define suites in cx proposal
    if (this.proposalDataService.cxProposalFlow) {
        this.appDataService.showEngageCPS = false; 
        this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    }
    
    this.messageService.clear();
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep;
    this.appDataService.showActivityLogIcon(true);
    this.partnerLedFlow = this.createProposalService.isPartnerDeal;
    //  show edit header icon if propsoal edit is there
    //  if (this.permissionService.proposalEdit) {
    this.appDataService.isProposalIconEditable = true; //  allow edit icon but disable update button in modal
    //  } else {
    //    this.appDataService.isProposalIconEditable = false;
    //  }
    //  set to proposal reopen permission for showing reopen button
    this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);

    if (!this.proposalDataService.proposalDataObject.proposalId) {
      const sessionObject: SessionData = this.appDataService.getSessionObject();
      this.qualService.qualification = sessionObject.qualificationData;
      this.proposalDataService.proposalDataObject = sessionObject.proposalDataObj;

      this.constantsService.CURRENCY = sessionObject.currency;
    }
    //  to check if security architecture
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      this.securityArchitecture = true;
    }
    //  Below code for security architecture create flow.
    if (this.proposalDataService.crateProposalFlow && this.securityArchitecture) {
      this.proposalDataService.securityArchCreateFlow = true;
    } else {
      this.proposalDataService.securityArchCreateFlow = false;
    }

    //  to check the count with the selected after updating questionnaire and show min suites mwessage
    //  if (this.securityArchitecture) {
    this.subscribers.noOfSuitesCount = this.manageSuitesService.noOfSuitesCount.subscribe((count: any) => {
      //  to check the total selected suites count
      // if (this.securityArchitecture) {
      //   this.getRowData();
      // }
      this.getRowData();
      const selectedSuites = this.gridApi.getSelectedRows();
      //  check for exception and show exception message if mandatory suites required greater than 1
      if (count.exception > 0 && count.mandatory > 1) {
        this.exceptionSuitesMessage = this.localeService.getLocalizedString('proposal.managesuites.SELECT_TETRATION');
      } else {
        this.exceptionSuitesMessage = '';
      }
      //  check in mandatory is greater than and allow to check for security tetration and mandatory suites count
      if (count.mandatory > 0) {
        //  check for exception and suiteid's has security tetration ID and show info message
        if (count.exception > 0 && this.selectedSuiteId.includes(38)) {
          this.enableMinSuitesMsg = false;
          this.titleWithButton.buttons[1].attr = false;
          this.appDataService.persistErrorOnUi = false;
          this.messageService.clear();
        } else {
          //  else check for noOfMandatorySuites with selected and show the info message
          if (count.mandatory <= this.selectedMandatorySuites.length) { //  slected suites are greather or equal to required 
            this.messageService.clear();
            this.titleWithButton.buttons[1].attr = false;
            this.enableMinSuitesMsg = false;
          } else {
            this.enableMinSuitesMsg = true;
            this.titleWithButton.buttons[1].attr = true;
          }
        }
      } else { //  if the mandatory suites required count is 0 , hide the qualified suites message 
        this.enableMinSuitesMsg = false;
        //  check for the total selected suites length and disable continue button if needed
        if (selectedSuites.length < 1) {
          this.titleWithButton.buttons[1].attr = true;
        } else {
          this.titleWithButton.buttons[1].attr = false;
        }
      }
    });
    //  }


    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    //When locc signed after import show confirmation message
    this.appDataService.loccImport.subscribe(() => {
      this.showLOCCConfirmationMessage = true;
      this.proposalDataService.cxNotAllowedMsg = '';
      this.proposalDataService.cxNotAllowedReasonCode = '';
    });

    //  hide reopen button if proposal reopen is not present or status is in pending approval state
    if (!this.appDataService.roadMapPath || this.appDataService.isProposalPending || this.appDataService.isPendingAdjustmentStatus || this.permissionService.proposalPermissions.has(PermissionEnum.ProposalViewOnly)) {
      this.titleWithButton.buttons.pop();
    }

    //  for breadcrumb
    if (this.appDataService.userDashboardFLow !== AppDataService.USER_DASHBOARD_FLOW) {
      const qualName = this.qualService.qualification.name.toUpperCase();
      this.appDataService.custNameEmitter.emit({ 'context': AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep,
      qualId: this.qualService.qualification.qualID,
      proposalId: this.proposalDataService.proposalDataObject.proposalId, 'text': qualName });
    }

    try {

      this.json = {
        'data': {
          'id': this.proposalDataService.proposalDataObject.proposalId,
          'qualId': this.qualService.qualification.qualID
        }
      };

      if (!this.proposalDataService.isProposalHeaderLoaded) {
        this.createProposalService.prepareSubHeaderObject(SubHeaderComponent.PROPOSAL_CREATION, true, this.json);
        this.proposalDataService.isProposalHeaderLoaded = true;
      }


          this.gridOptionsForExistingSub = {
        //  columnDefs: this.getColumnDefs(),
        // defaultColDef: this.getDefaultColumnDefs(),
        // defaultColGroupDef: this.getDefaultColGroupDef(),
        columnTypes: this.getColumnTypes(),
        enableColResize: true,
        rowSelection: 'multiple',
        // groupSelectsChildren: true,
        headerHeight: 40,
        suppressRowClickSelection: true,
        enableFilter: true,
        animateRows: true,
        enableSorting: false,
        //  isRowSelectable: function(rowNode) {
        //    if(rowNode.data.id !== 26){
        //      return true;
        //    } else {;
        //      return false;
        //    }
        //  },
        // autoGroupColumnDef: this.autoGroupColumnDef(),
        frameworkComponents: {
          groupCellRender: <{ new(): ManageSuitesGroupCell }>(
            ManageSuitesGroupCell
          )
        },
        onGridReady: (params: GridReadyEvent) => {
          // this.gridApi = params.api;
          // this.gridColumnApi = params.columnApi;
          this.hideCxForExistingSub();
        },
													 
									   
												   
		  
			 
        context: {
          parentChildIstance: this
        }
        // getRowClass: params => {
        //   if (!params.data.mandatory) {
        //     return 'optional-suite';
        //   }
        // }
      };


      this.gridOptions = {
        //  columnDefs: this.getColumnDefs(),
        // defaultColDef: this.getDefaultColumnDefs(),
        // defaultColGroupDef: this.getDefaultColGroupDef(),
        columnTypes: this.getColumnTypes(),
        enableColResize: true,
        rowSelection: 'multiple',
        // groupSelectsChildren: true,
        headerHeight: 40,
        suppressRowClickSelection: true,
        enableFilter: true,
        animateRows: true,
        enableSorting: false,
        //  isRowSelectable: function(rowNode) {
        //    if(rowNode.data.id !== 26){
        //      return true;
        //    } else {;
        //      return false;
        //    }
        //  },
        // autoGroupColumnDef: this.autoGroupColumnDef(),
        frameworkComponents: {
          groupCellRender: <{ new(): ManageSuitesGroupCell }>(
            ManageSuitesGroupCell
          ),
          columnCellRender: <{ new(): ColumnGridCellComponent }>(
            ColumnGridCellComponent
          )
        },
        onGridReady: (params: GridReadyEvent) => {
          this.gridApi = params.api;
          this.gridColumnApi = params.columnApi;
          this.getColumnDefs();
          this.getRowData();
          //  setTimeout(() => {
          //    params.api.sizeColumnsToFit();
          //  }, 500);
        },
        context: {
          parentChildIstance: this
        },
        getRowClass: params => {
          if (!params.data.mandatory) {
            return 'optional-suite';
          }
        }
      };
      // this.getRowData();
    } catch (error) {
      console.log(error);
    }
    this.noOfChanges = 0;
    this.subscribers.selectedAtoEmitter = this.manageSuitesService.selectedAtoEmitter.subscribe(() => {
      if (this.isAtoSelectionRequired) {
        this.titleWithButton.buttons[1].attr = false;
        this.isAtoSelectionRequired = false;
      }
      setTimeout(() => {
        if (this.gridOptions.api) {
          this.gridOptions.api.redrawRows();
          this.onSelectionChanged();
        }
      }, 200);

    });

    // call respective method to check seleced cx Suite and attach rate
    this.subscribers.cxSuiteSelectionEmitter =  this.manageSuitesService.cxSuiteSelectionEmitter.subscribe((data:any) => {
      if(data.selection) {
        this.selectCxSuite(data);
      } else {
        this.updateCxSuiteDataObj(data);
        this.checkCxAttachRateForSuites();
      }
    });

    this.proposalSummaryService.getShowCiscoEaAuth();
    this.proposalDataService.isAnnualBillingMsgRequired();

    this.gridOptions.suppressContextMenu = true;
    this.gridOptionsForExistingSub.suppressContextMenu = true;
  }

  ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    this.appDataService.persistErrorOnUi = false;
    this.proposalSummaryService.unSubscribe();
    this.proposalDataService.crateProposalFlow = false;

    //  to unsubscribe the suites count emitter
    if (this.subscribers.noOfSuitesCount) {
      this.subscribers.noOfSuitesCount.unsubscribe();
    }
    if (this.subscribers.selectedAtoEmitter) {
      this.subscribers.selectedAtoEmitter.unsubscribe();
    }
    if (this.subscribers.cxSuiteSelectionEmitter){
      this.subscribers.cxSuiteSelectionEmitter.unsubscribe();
    }

    this.createProposalService.checkToAllow84MonthsTerm(this.selectedSuiteId);
  }

  getColumnDefs() {
    const columns = [{
      headerName: 'suite',
      field: 'suite',
      suppressMenu: true,
      minWidth: 250,
      headerComponentFramework: <{ new(): SuitesHeaderComponent }>(
        SuitesHeaderComponent),
      width: 300,
      cellClass: 'expandable-header',
      cellRenderer: 'agGroupCellRenderer',
      checkboxSelection: true,
      lockPosition: true,
      cellRendererParams: {
        innerRenderer: 'groupCellRender',
        suppressDoubleClickExpand: true,
      }
    },
    {
      headerName: 'DESCRIPTION',
      field: 'description',
      suppressMenu: true,
      lockPosition: true,
      minWidth: 600,
      width: 600,
      cellClass: 'expandable-header',
      cellRenderer: 'columnCellRender',
      sortable: false
    },
    {
      headerName: 'SERVICES SUITE ELIGIBLE',
      field: 'cxSuitesEligible',
      cellRenderer: 'groupCellRender',
      suppressMenu: true,
      lockPosition: true,
      minWidth: 200,
      width:400,
      sortable: false
    },
    {
      headerName: 'SERVICES ATTACH RATE (%)',
      field: 'cxAttachRate',
      cellRenderer: 'groupCellRender',
      suppressMenu: true,
      headerComponentFramework: <{ new(): SuitesHeaderComponent }>(
        SuitesHeaderComponent),
      lockPosition: true,
      
      minWidth: 150,
      width: 150,
      sortable: false
    }

    ];

    const columnsExistingSuites = [{
      headerName: 'suite',
      field: 'suite',
      suppressMenu: true,
      minWidth: 250,
      headerComponentFramework: <{ new(): SuitesExistingSubscriptionHeaderComponent }>(
        SuitesExistingSubscriptionHeaderComponent),
      width: 300,
      cellClass: 'expandable-header',
      cellRenderer: 'agGroupCellRenderer',
      checkboxSelection: true,
      lockPosition: true,
      cellRendererParams: { 
        innerRenderer: 'groupCellRender',
        suppressDoubleClickExpand: true,
      }
    },
    {
      headerName: 'DESCRIPTION',
      field: 'description',
      suppressMenu: true,
      lockPosition: true,
      minWidth: 600,
      width: 600,
      cellClass: 'expandable-header',
      sortable: false
    },
    {
      headerName: 'SERVICES SUITE ELIGIBLE',
      field: 'cxSuitesEligible',
      cellRenderer: 'groupCellRender',
      suppressMenu: true,
      lockPosition: true,
      minWidth: 200,
      width:400,
      sortable: false
    },
    {
      headerName: 'SERVICES ATTACH RATE (%)',
      field: 'cxAttachRate',
      cellRenderer: 'groupCellRender',
      suppressMenu: true,
      headerComponentFramework: <{ new(): SuitesHeaderComponent }>(
        SuitesHeaderComponent),
      lockPosition: true,
      minWidth: 150,
      width: 150,
      sortable: false
    }

    ];
    this.gridOptions.api.setColumnDefs(columns);
    this.colData = columnsExistingSuites;

    if(!this.proposalDataService.cxEligible && !this.proposalDataService.cxProposalFlow){
      //columns.splice(2,3);
      this.gridOptions.columnApi.setColumnsVisible(['cxSuitesEligible', 'cxAttachRate'], false)
										
													 
																												
	   
      columns[0].width = 441;
      columns[1].width = 1224;
										   
											
    }
										
												   
																												
	   
										   
											
	   
	
																																														

  }

  autoGroupColumnDef() {
    return {
      headerName: 'suite',
      field: 'suite',
      suppressMenu: true,
      minWidth: 60,
      width: 1400,
      cellClass: 'expandable-header',
      cellRenderer: 'agGroupCellRenderer',
      checkboxSelection: true
      //  cellRendererParams: {
      //    innerRenderer: 'groupCellRender',
      //    suppressDoubleClickExpand: true,
      //  }
    };
  }
  openModal() {
    const modalRef = this.modalVar.open(CxConfirmationComponent, {
      windowClass: "cx-modal"
    });
    modalRef.result.then((result) => {
      if (result.continue === true) {
         this.saveSuitesData();
      }
    });
  }
  suiteCellRenderer(params) {
    if (params.data.architecture === 'security') {
      let legend;
      if (params.data.mandatory) {
        legend = `<span class="legends solution--support">Qualified</span>`;
      } else {
        legend = `<span class="legends basic--support">Optional</span>`;
      }
      return params.value + legend;
    } else {
      return params.value;
    }
  }

  //
  getRowData() {
    this.disabledSuitesCount = 0;
    if (!this.allowReopen) {
      this.disableReOpen = true;
    }
    //  roSuperuser code
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.disableReOpen = true;
      //  if proposal is completed state disable re-open button for RO super User and no read write access
      if (this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE) {
        this.titleWithButton.buttons[2].attr = true;
      }
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
    }
  

    //  if viewing from Road map - read only view available
    if (this.appDataService.roadMapPath || (this.proposalDataService.cxProposalFlow && !this.proposalDataService.nonTransactionalRelatedSoftwareProposal)) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
    } else if ((this.securityArchitecture || this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.DC) && this.appDataService.isReadWriteAccess) {
      // to disable checkbox if enable property in security or DC Architecture suite is false;
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          if (params.data.enable) {
            return false;
          }
          return true;
        }
      };
    }
    this.partnerLedFlow = this.createProposalService.isPartnerDeal;
    //  if(this.partnerLedFlow && !this.appDataService.roadMapPath) {
    //    this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED'), MessageType.Warning), true);
    //  }

    this.manageSuitesService.suitesData = [];
    this.cxSuitesData = [];
    this.cxSuitesDataAlreadyPurchased = [];
    this.manageSuitesService.proposalId = this.proposalDataService.proposalDataObject.proposalId;
    // this.reqJSON['userId'] = this.appDataService.userId;
    this.reqJSON['proposalId'] = this.proposalDataService.proposalDataObject.proposalId;
    this.reqJSON['archName'] = this.appDataService.archName;
    this.manageSuitesService.getSuites(this.reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
          // Set flag true if request start is due and false if request start date is not due.
        // Stop user to move forward on price page
        // Suite page !!--> Price estimation --> Summary page 
        this.isRequestStartDateDue = res.requestStartDateCurrDate;
        this.titleWithButton.buttons[1].attr = res.requestStartDateCurrDate;
        try {
          if (this.partnerLedFlow && !this.appDataService.isPurchaseOptionsLoaded && !this.proposalDataService.cxProposalFlow) {
            this.proposalSummaryService.getPurchaseOptionsData();
          }

          // check and set change sub flow, existing suites in Subscription
          if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
     //       this.setSuitesForSubscription(); //uncomment the code after html changes are ready
            this.isChangeSubFlow = true;
          } else {
            this.isChangeSubFlow = false;
          }
      //    res.archs = res.archs;

      
          let tempDisableSuiteHeader  = true;
          this.showSubscriptionServiceColumn  = false;
          let showSuitesServiceColumn  = false;
          this.proposalDataService.currentDateFromServer = res.currentDate;

          res.archs.forEach(lineItem => {
            lineItem.suites.forEach(element => {

              // push cxsuites data if present which are avalible for purchase
              if(element.cxSuites && element.cxSuites[0].inclusion){
                this.cxSuitesData.push(element.cxSuites[0]);
                // set cxSuitesDataAlreadyPurchased
                if (element.cxSuites[0].partOfExistingSubscription){
                  this.cxSuitesDataAlreadyPurchased.push(element.cxSuites[0]);
                }
              }

      //Show already selected  suites for changesubsidary and renewal flow
            if ((this.isChangeSubFlow  || this.appDataService.isRenewal) && element.partOfExistingSubscription ) {

                if (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.SECURITY) {
                  this.suitesOfExistingSubscription.push({
                    'suite': element.name, 'inclusion': true, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'id': element.id, 'description': element.description, 'architecture': 'security',
                    'atos': element.atos ? element.atos : '', 'enable': element.enable, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false, 'checked': true, 'disabled': true });
                } else {
                  this.suitesOfExistingSubscription.push({
                    'suite': element.name, 'inclusion': true, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'id': element.id, 'description': element.description, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false, 'enable': element.enable,'checked': true});
                }
  
                if(element.cxSuites){
                  this.showSubscriptionServiceColumn =  true;
                 }

              } else {

                if (!this.appDataService.isRenewal) { 

                if (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.SECURITY) {
                  this.manageSuitesService.suitesData.push({
                    'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '',
                    'id': element.id, 'description': element.description, 'architecture': 'security', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'atos': element.atos ? element.atos : '', 'enable': element.enable, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
                } else {
                  this.manageSuitesService.suitesData.push({
                    'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'id': element.id,'enable': element.enable, 'description': element.description, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
                }

                  // disable suit header incase all subset suites are disabled
                   if (element.enable) {
                    tempDisableSuiteHeader = false;
                }
                  // Show CX column if value is present
                  if(element.cxSuites){
                  showSuitesServiceColumn =  true;
                 }

                 }
              }

              if (this.appDataService.isRenewal) {

                if (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.SECURITY) {
                  this.manageSuitesService.suitesData.push({
                    'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'id': element.id, 'description': element.description, 'architecture': 'security',
                    'atos': element.atos ? element.atos : '', 'enable': element.enable, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
                } else {
                  this.manageSuitesService.suitesData.push({
                    'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,'nonOrderableMessages': element.nonOrderableMessages ?  element.nonOrderableMessages[0] : '', 'cxSuites': element.cxSuites ? element.cxSuites : '',
                    'id': element.id,'enable': element.enable,'description': element.description, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
                }

                // disable suit header incase all subset suites are disabled
                if (element.enable) {
                    tempDisableSuiteHeader = false;
                }
                
                // Show CX column if value is present
                if(element.cxSuites){
                  showSuitesServiceColumn =  true;
                }

              }



              // //  added Optional text to the suites name if mandatory = false
              // if (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.SECURITY) {
              //   this.manageSuitesService.suitesData.push({
              //     'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,
              //     'id': element.id, 'description': element.description, 'architecture': 'security',
              //     'atos': element.atos ? element.atos : '', 'enable': element.enable, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
              // } else {
              //   this.manageSuitesService.suitesData.push({
              //     'suite': element.name, 'inclusion': element.inclusion, 'mandatory': element.mandatory,
              //     'id': element.id, 'description': element.description, 'partOfExistingSubscription': element.partOfExistingSubscription ? element.partOfExistingSubscription : false });
              // }
              if (element.inclusion) {
                // this.initiallySelectedSuitesId.push(lineItem.id);
                this.totalRowsSelected++;
              }
            });
          });


        // Disable suit header
        this.proposalDataService.disableSuiteHeader = tempDisableSuiteHeader;

        //Hide column for CX proposal if no value available 
        if (this.gridOptions.columnApi) {
          this.gridOptions.columnApi.setColumnsVisible(['cxSuitesEligible', 'cxAttachRate'], showSuitesServiceColumn)
          if(!showSuitesServiceColumn) {
             this.gridOptions.columnApi.setColumnWidth('suite', 441) 
             this.gridOptions.columnApi.setColumnWidth('description', 1224)
          }

        }
        //  if (this.gridOptionsForExistingSub.columnApi) {
        //   this.gridOptionsForExistingSub.columnApi.setColumnsVisible(['cxSuitesEligible', 'cxAttachRate'], showSubscriptionServiceColumn) 
        //   if(!showSubscriptionServiceColumn) {
        //      this.gridOptions.columnApi.setColumnWidth('suite', 441) 
        //      this.gridOptions.columnApi.setColumnWidth('description', 1224)
        //   }
        // }

          //Manage existing chnage subscription suites

          // this.exitingMandatorySuitesCount  =  0;

          // if (this.suitesOfExistingSubscription && this.suitesOfExistingSubscription.length >0) {

          //  var arrMandatoryInExistingSubscription  =  this.suitesOfExistingSubscription.filter(a => a.mandatory === true);

          //  if (arrMandatoryInExistingSubscription && arrMandatoryInExistingSubscription.length >0) {
          //       this.exitingMandatorySuitesCount = arrMandatoryInExistingSubscription.length;

          //  }
          // }

          // for change sub flow if suites purchased has cx attach rate present set them selected
          if (this.isChangeSubFlow && this.suitesOfExistingSubscription.length && !this.proposalDataService.cxNotAllowedMsg){
            for (const data of this.suitesOfExistingSubscription){
              if (data.cxSuites && data.cxSuites[0].attachRate && !data.cxSuites[0].partOfExistingSubscription){
                data.cxSuites[0].inclusion = true;
                this.proposalDataService.isAnyCxSuiteSelected = true;
              }
            }
          }

          // // check and set change sub flow, existing suites in Subscription
          // if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
          //   //this.setSuitesForSubscription(); //uncomment the code after html changes are ready
          //   this.isChangeSubFlow = true;
													   
          // } else {
          //   this.isChangeSubFlow = false;
          // }

																		   
																															   
																								
										
				  
										 
		   

          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(this.manageSuitesService.suitesData);
          }

          this.gridOptionsForExistingSub.rowClassRules = {
            'checkboxDisable': function (params) {
              params.node.setSelected(true);
              return true;

            }
          };

          //If all suites are selected in change sub then disable continue
          if (this.isChangeSubFlow && !this.proposalDataService.isAnyCxSuiteSelected &&this.manageSuitesService.suitesData.length === 0) {
                  this.titleWithButton.buttons[1].attr = true;
          }

          //  this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          this.setCheckboxValue(this.manageSuitesService.suitesData);
          setTimeout(() => {
            //   this.utilitiesService.setTableHeight();
          });

          //  check the mandatory suites from response and set it to appdataservice
          if (this.securityArchitecture) {
            if (res.noOfMandatorySuitesRequired !== undefined && res.noOfMandatorySuitesRequired > -1) {

         //     res.noOfMandatorySuitesRequired =  res.noOfMandatorySuitesRequired - this.exitingMandatorySuitesCount;
              this.appDataService.noOfMandatorySuitesrequired = res.noOfMandatorySuitesRequired;
            }
            if (res.noOfExceptionSuitesRequired) {
              this.appDataService.noOfExceptionSuitesRequired = res.noOfExceptionSuitesRequired;
              //  set the exception message if exception suites req greater than 0 and mandatory suites required greater than 1
              if (this.appDataService.noOfExceptionSuitesRequired > 0 && this.appDataService.noOfMandatorySuitesrequired > 1) {
                this.exceptionSuitesMessage = this.localeService.getLocalizedString('proposal.managesuites.SELECT_TETRATION');
              }
              //  console.log(this.appDataService.noOfExceptionSuitesRequired,this.exceptionSuitesMessage);
            }
            // this.setMinimumSuitesCount(res);
          }
          
          this.hideCxForExistingSub();
          // else {
          //   if (this.appDataService.noOfMandatorySuitesrequired !== undefined && this.appDataService.noOfMandatorySuitesrequired > -1) {

          //         this.appDataService.noOfMandatorySuitesrequired  = this.appDataService.noOfMandatorySuitesrequired  - this.exitingMandatorySuitesCount;
          //   }
          // }
        } catch (error) {
          console.log(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // // method to set existing suites in subscription from suites 
  // setSuitesForSubscription(){
  //   this.existingSuitesInSubscription =  this.manageSuitesService.suitesData.filter(a => a.partOfExistingSubscription === true);
  //   // this.manageSuitesService.suitesData = this.manageSuitesService.suitesData.filter(a => a.partOfExistingSubscription === false);
  //   //console.log(this.existingSuitesInSubscription);
  // }
  setCheckboxValue(suitesData) {
    try {

      //  to check from the api if the particular node was checked/un-checked by user
      this.gridApi.forEachNode(node => {
        if (!node.data.enable && this.securityArchitecture) {
          this.disabledSuitesCount++;
        }
        suitesData.forEach(element => {
          if (node.data.suite === element.suite) {
            node.setSelected(element.inclusion);
            // On time of creating proposal deselect Tetration-as-a-Service
            if (this.proposalDataService.crateProposalFlow) {
              if (node.data.id === 21) {
                node.setSelected(false);
              }
            }
            //  for security architecture, deselect suites if its optional or enable property is false after creation of proposal
            if (this.proposalDataService.securityArchCreateFlow  || (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.DC && this.proposalDataService.crateProposalFlow)) {
              if (!node.data.mandatory || !node.data.enable) {
                node.setSelected(false);
              }
            }

          }
        });
      });

      setTimeout(() => {
        this.handleHeaderCheckboxSelection();
      }, 1000);
    } catch (error) {
      console.error(error);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  hideCxForExistingSub() {
    if ((!this.proposalDataService.cxEligible && !this.proposalDataService.cxProposalFlow) || this.appDataService.isRenewal || !this.showSubscriptionServiceColumn) {
      if (this.gridOptionsForExistingSub.columnApi) {
        this.gridOptionsForExistingSub.columnApi.setColumnsVisible(['cxSuitesEligible', 'cxAttachRate'], false);
        this.gridOptionsForExistingSub.columnApi.setColumnWidth('suite', 441); 
        this.gridOptionsForExistingSub.columnApi.setColumnWidth('description', 1224);
      }
    }
  }

  getDefaultColumnDefs(): ColDef {
    return {
      width: 150,
      editable: true, //  feild is editable
      suppressMenu: true, //  No pinned menu will be shown
      // enableRowGroup: true
    };
  }

  getDefaultColGroupDef(): ColGroupDef {
    return {
      children: []
    };
  }

  getColumnTypes() {
    return {
      'nonEditableColumn': { editable: false },
      'numberParse': {
        valueParser: numberValueParser,
        valueFormatter: (params: any) => {
          return '' + formatNumber(params.value);
        }
      }
    };
  }

  getTitleWithButton(): ITitleWithButtons {
    return {
      title: '',
      baseClass: '',
      parentClass: 'col-md-5',
      rootClass: 'row',
      buttonParentClass: 'qualify-btn',
      buttonDivisionClass: 'col-md-7',
      buttons: [
        {
          name: 'Proposal List',
          buttonClass: 'btn btn-secondary',
          attr: false,
          parentClass: 'viewProspect sr-1',
          click: () => {
            this.router.navigate(['qualifications/proposal']);
          }
        },
        {
          name: 'Continue',
          buttonClass: 'btn btn-primary btn-continue',
          attr: false,
          parentClass: 'viewProspect btn-sep',
          click: () => {
            if (!this.disableContinue) {
              this.onRowSelected();
            }
          }
        },
        {
          name: this.localeService.getLocalizedString('common.REOPEN_PROPOSAL'),
          buttonClass: 'btn btn-primary',
          attr: false,
          parentClass: 'viewProspect',
          click: () => {
            if (this.appDataService.roadMapPath && !this.disableReOpen) {
              this.reopenProposal();
            }
          }
        }
      ]
    };
  }
  //  for reopening manage suites page
  reopenProposal() {
    this.proposalSummaryService.reopenProposal();
    this.subscribers.roadMapEmitter = this.proposalSummaryService.roadMapEmitter.subscribe((roadMapPath: any) => {
      this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
      //  if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        //  if proposal edit present after reopening , allow edit icon
        //  if (this.permissionService.proposalEdit) {
        this.appDataService.isProposalIconEditable = true; //  allow edit icon but disable update button in modal
        //  } else {
        //    this.appDataService.isProposalIconEditable = false;
        //  }
        this.gridOptions.rowClassRules = {
          'checkboxDisable': function (params) {
            return false;
          }
        };
        //  set the grid after reopened
        if (this.gridOptions.api) {
          this.gridOptions.api.redrawRows();
        }
        this.handleHeaderCheckboxSelection();
        this.getRowData(); // call suites API after reopening proposal here
        // this.getColumnDefs();
        // this.ngOnInit();
        //  after reopenig hide the reopen button
        // if (!(this.proposalDataService.proposalDataObject.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE)) {
        this.titleWithButton.buttons.pop();
        // }
      }
    });
  }


  //  to form array of suites selected
  onRowSelected() {
    let suiteData = this.gridApi.getSelectedRows();
    this.manageSuitesService.cxSuites = [];
    this.proposalDataService.isAnyCxSuiteSelected = false;
    this.proposalDataService.proposalDataObject.noOfSuites = suiteData.length;

    for (let suite of this.suitesOfExistingSubscription) {
      if (suite.cxSuites && suite.cxSuites.length) {
        for(let cxSuite of suite.cxSuites){
          if(cxSuite.inclusion && cxSuite.attachRate > 0 && !cxSuite.partOfExistingSubscription){ // add services Id and attach for suites available for purchase
            this.manageSuitesService.cxSuites.push({
              'id': cxSuite.id,
                'attachRate': cxSuite.attachRate,
                'partOfExistingSubscription': cxSuite.partOfExistingSubscription
              });
            this.proposalDataService.isAnyCxSuiteSelected = true;
          }
        }
      }
    }

    if (suiteData.length < 1  && !this.manageSuitesService.cxSuites.length) {
      // this.messageService.displayCustomUIMessage(MessageService.SUITE_SELECTION_ERROR, MessageService.UI_ERROR_CODE);
      this.messageService.displayMessages(this.appDataService.setMessageObject(
        this.localeService.getLocalizedMessage('proposal.managesuites.SUITE_SELECTION_ERROR'), MessageType.Error));
      this.titleWithButton.buttons[1].attr = true;
      this.appDataService.persistErrorOnUi = true;
    } else {
      this.appDataService.persistErrorOnUi = false;
      this.manageSuitesService.excludedSuites = [];
      const selectedRowArray = this.gridApi.getSelectedRows();
      const arr = [];
      //  check for Suits with ATO's and ATO's are not selected then show error message
      for (let d of selectedRowArray) {
        if (d.atos && !d.selectedAto) {
          this.messageService.displayMessages(this.appDataService.setMessageObject((
            'One or more Suite(s) selected is missing Tier. Select the Tier to continue.'), MessageType.Error));
            this.titleWithButton.buttons[1].attr = true;
            this.appDataService.persistErrorOnUi = true;
            this.isAtoSelectionRequired = true;
            break;
        }
      }     
      this.proposalDataService.hasLegacySuites = false;
      for (let i = 0; i < selectedRowArray.length; i++) {
        if (selectedRowArray[i].atos) {
          if (selectedRowArray[i].selectedAto) {
            this.manageSuitesService.excludedSuites.push({ 'id': selectedRowArray[i].id,
            'atos': [{ 'category': selectedRowArray[i].selectedAto.category }] });            
          }
        } else {
          //Below code will check for CX suite added in save selection request.
          if (selectedRowArray[i].cxSuites && selectedRowArray[i].cxSuites[0].inclusion) {

            this.manageSuitesService.cxSuites.push({
              'id': selectedRowArray[i].cxSuites[0].id,
              'attachRate': selectedRowArray[i].cxSuites[0].attachRate,
              'partOfExistingSubscription': selectedRowArray[i].cxSuites[0].partOfExistingSubscription
            });
            this.proposalDataService.isAnyCxSuiteSelected = true;
          } 
          this.manageSuitesService.excludedSuites.push({ 'id': selectedRowArray[i].id });
          
        }
        if(this.proposalDataService.legacySuitesObj && this.proposalDataService.legacySuitesObj[selectedRowArray[i].id]){
          this.proposalDataService.hasLegacySuites = true;
        }
      }

      // if cx suites present check the cx attach rate before suites saving
      if(this.cxSuitesData.length && this.proposalDataService.cxAllowed){
        this.checkCxAttachRateForSuites();
        if(this.titleWithButton.buttons[1].attr){
          return
        }
      }

      if (this.appDataService.persistErrorOnUi && !this.isShowInfoMsgForAppD && !this.isShowInfoMsgForThousandEye) {
        this.manageSuitesService.excludedSuites = [];
        this.manageSuitesService.cxSuites = [];
        return;
      }
      if (this.proposalDataService.isAnyCxSuiteSelected && !this.proposalDataService.cxProposalFlow && !this.proposalDataService.relatedCxProposalId && !(this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) && !this.appDataService.roadMapPath) {
        this.openModal();
      } else {
        this.saveSuitesData();
      }
    }
  }

  saveSuitesData(){
    this.manageSuitesService.saveSuites().subscribe((res: any) => {
      if (res && !res.error) {
        this.appDataService.persistErrorOnUi = false;
        // if(this.proposalDataService.isAnyCxSuiteSelected && !(this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) && !this.appDataService.roadMapPath){ //to check if any of the cx suites are selected
        //   this.manageSuitesService.checkForRedirection().subscribe((response: any) => {
        //     if (response && !response.error) {
        //       if(response.data && response.data.billToRedirectionUrl ){
        //         window.open(response.data.billToRedirectionUrl, '_self');
        //       } else {
        //         this.roadMap.eventWithHandlers.continue();
        //       }
        //     } else {
        //       this.messageService.displayMessagesFromResponse(res);
        //     }
        //   })
        // } else {
          this.roadMap.eventWithHandlers.continue();
       // } 
      } else {
        //  disable continue if any error on UI from service
        this.titleWithButton.buttons[1].attr = true;
        this.messageService.displayMessagesFromResponse(res);
        this.appDataService.persistErrorOnUi = true;
      }
    });

  }

  rowSelected(event) {
    if (!event.node.selected && event.data.selectedAto) {
      for (let i = 0; i < event.data.atos.length; i++) {
        event.data.atos[i].selected = false;
      }
      delete event.data.selectedAto;
      if (this.gridOptions.api) {
        this.gridOptions.api.redrawRows();
      }
    }

    // Manage renewal scenario
    if (this.appDataService.isRenewal && this.appDataService.followonType === ConstantsService.EARLY_FOLLOWON && !event.node.selected) {
      if(!this.isShowInfoOpen)
      this.showInfoModal(event);
    }
  }


  // check and uncheck selected suite id
  setSuites(isSelect,suiteID) {

    this.gridApi.forEachNode(node => {
         if (node.data.id === suiteID) {
            node.setSelected(isSelect);
         }   
      });
  }
  
//Info model if existing selected suites are unchecked incase of renewal
showInfoModal(event) {

  let showInfoModel = false;

  for (let suite of this.suitesOfExistingSubscription) { 

    if (event.data.id === suite.id) {
      showInfoModel =  true;
      break;
    }
  }
  
  if (showInfoModel) {
    this.isShowInfoOpen = true;
    const modalRef = this.modalVar.open(SuitesRenewalApprovalComponent, { 
      windowClass : 're-open' ,
      backdrop : 'static',
      keyboard : false
    });

    modalRef.result.then((result) => {
      const selectedSuites = this.gridApi.getSelectedRows();
      if(result.continue){
        this.isHeaderCalled =false
      }
     else {
        if(selectedSuites.length){
        this.setSuites(true,event.data.id)
        }
        else{
          //  if header checkbox is unchecked and selected cancel
          if(this.isHeaderCalled){
            for(let suite of this.suitesOfExistingSubscription) {
             this.setSuites(true,suite.id)
             }
            } 
          //  if header checkbox is unchecked and selected continue and then selected existing subs suite and the deselected it and select cancel 
          else{
          this.setSuites(true,event.data.id)
          }
        }
       
     }
      this.isShowInfoOpen = false;
    });
  }

}


  public onSelectionChanged() {
     // this.titleWithButton.buttons[1] is Continue button
    // if isRequestStartDateDue true then disable Continue button 
    if(this.isRequestStartDateDue){   
      this.titleWithButton.buttons[1].attr = true;
    }else{
      this.titleWithButton.buttons[1].attr = false;
    }
   
    this.noOfChanges++;
    this.selectionRuleValidation();
    
  }
  //  check purchseoptions data with the suites data and show authorization message 
  checkPurchaseAuthorization(data, suites) {
    if (data && Object.keys(data).length > 0 && data.archs) {
      let selectedIds = suites.map(a => a.id);
      let purchaseAuthSuites = data.archs.filter(a => a.code === this.appDataService.archName);
      let AuthSuitesIds = [];
      // if (purchaseAuthSuites.length > 0) {
      for (const d of purchaseAuthSuites) {
        for (const s of d.suites) {
          AuthSuitesIds.push(s.suiteId);
        }
      }
      //  removing duplicates
      //  AuthSuitesIds = AuthSuitesIds.filter((value, index, array) => array.indexOf(value) !== index);
      // console.log(AuthSuitesIds, purchaseAuthSuites);
      for (const id of selectedIds) {
        if (!AuthSuitesIds.includes(id)) {
          this.showAuthMessage = true;
          return;
        }
      }
      // }
    } else {
      this.showAuthMessage = true;
    }
  }
  selectionRuleValidation() {
    if (this.securityArchitecture) {
      this.gridApi.forEachNode(node => {
         // for security arch we will get enable flag in API acc to which we have to show the checkbox enable/disabled
        if (!node.data.enable) {
          node.setSelected(false);
        }
      });
    }
    const selsectedSuites = this.gridApi.getSelectedRows();
    this.handleHeaderCheckboxSelection();
    //if(this.proposalDataService.cxAllowed){
    this.setCXSuiteSelection(selsectedSuites) // to set cxSuites based on parent suite selection
    //}
    this.showAuthMessage = false; //  set auth message to false and check in the method to set to true
    this.isShowInfoMsgForAppD = false;
    this.isShowInfoMsgForThousandEye = false;
    //  if deselected header level check disable continue
    if (selsectedSuites.length < 1) {
      if(!this.includedCXSuites.length){
        this.titleWithButton.buttons[1].attr = true;
      }
      
      //  if not slected none, make the selectedMandatorySuites to empty array
      this.selectedMandatorySuites = [];
      this.selectedSuiteId = [];
      //  if security architecture, show message for minimum mandatory suites count to be selected
      if (this.securityArchitecture && this.appDataService.noOfMandatorySuitesrequired > 0) {
        this.enableMinSuitesMsg = true;
        //  this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.managesuites.SUITES_MANDATORY') + this.appDataService.noOfMandatorySuitesrequired + this.localeService.getLocalizedString('proposal.managesuites.SUITES_SELECTION'), MessageType.Info))
      } else {
        this.enableMinSuitesMsg = false;
        this.messageService.clear();
      }
    } else {
      //  check the condition only when proposal is inprogress and partner flow
      if (this.partnerLedFlow && !this.appDataService.roadMapPath && !this.proposalDataService.cxProposalFlow) {
        this.checkPurchaseAuthorization(this.appDataService.purchaseOptiponsData, selsectedSuites);
      }
      //  assign the filtered mandatory suites to selectedMandatorySuites
      this.selectedMandatorySuites = selsectedSuites.filter(isMandatory);
      this.selectedSuiteId = this.selectedMandatorySuites.map(a => a.id);
      this.appDataService.noOfMandatorySuiteSelected = this.selectedMandatorySuites.length;
      //  check these conditions only if security arch and mandatoryreqsuites count is more than 1
      if (this.securityArchitecture && this.appDataService.noOfMandatorySuitesrequired > 0) {
        //check for legacy Umbrella suite and show error message if it's selected
        // if (this.selectedSuiteId.includes(33)){
        //   this.proposalDataService.hasLegacySuites = true;
        //   this.titleWithButton.buttons[1].attr = true;
        // } else{
        //   this.proposalDataService.hasLegacySuites = false;
        //   this.titleWithButton.buttons[1].attr = false;
        // }
        //  //  assign the filtered mandatory suites to selectedMandatorySuites
        //  this.selectedMandatorySuites = selsectedSuites.filter(isMandatory);
        //  this.selectedSuiteId = this.selectedMandatorySuites.map(a => a.id);
        //  this.appDataService.noOfMandatorySuiteSelected = this.selectedMandatorySuites.length;
        //  check the selcted count with the required count from service
        if (this.appDataService.noOfExceptionSuitesRequired > 0 && this.selectedSuiteId.includes(38)) {
          this.enableMinSuitesMsg = false;
          this.appDataService.persistErrorOnUi = false;
          this.messageService.clear();
        } else {
          if (this.selectedMandatorySuites.length < this.appDataService.noOfMandatorySuitesrequired) {
            //  if selected is less than the count disable continue and show the message for the mandatory suites count
            this.titleWithButton.buttons[1].attr = true;
            this.appDataService.persistErrorOnUi = true;
            this.enableMinSuitesMsg = true;
            //  this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.managesuites.SUITES_MANDATORY') + this.appDataService.noOfMandatorySuitesrequired + this.localeService.getLocalizedString('proposal.managesuites.SUITES_SELECTION'), MessageType.Info))
          } else {
            this.enableMinSuitesMsg = false;
            this.appDataService.persistErrorOnUi = false;
            this.messageService.clear();
          }
        }
      } else {
        const selsectedSuitesID = selsectedSuites.map(a => a.id);

        if (selsectedSuitesID.includes(13) && (selsectedSuitesID.includes(1) || selsectedSuitesID.includes(2)) ||
          selsectedSuitesID.includes(14) && (selsectedSuitesID.includes(3) || selsectedSuitesID.includes(4)) ||
          selsectedSuitesID.includes(16) && (selsectedSuitesID.includes(12) || selsectedSuitesID.includes(10)) ||
          selsectedSuitesID.includes(17) && (selsectedSuitesID.includes(5) || selsectedSuitesID.includes(11)) ||
          selsectedSuitesID.includes(18) && (selsectedSuitesID.includes(6) || selsectedSuitesID.includes(25)) ||
          selsectedSuitesID.includes(19) && selsectedSuitesID.includes(7) ||
          selsectedSuitesID.includes(20) && selsectedSuitesID.includes(9) ||
          selsectedSuitesID.includes(21) && selsectedSuitesID.includes(15)
        ) {
          // this.messageService.displayUiTechnicalError('SUITE_SELECTION_RULE');
          // error msg should be displayed acc. to arch type

          if (this.proposalDataService.proposalDataObject.proposalData.archName === this.constantsService.DC) {
            this.messageService.displayMessages(this.appDataService.setMessageObject(
              this.localeService.getLocalizedMessage('proposal.managesuites.DC_SUITE_SELECTION_RULE'), MessageType.Error));
          } else {
            this.messageService.displayMessages(this.appDataService.setMessageObject(
              this.localeService.getLocalizedMessage('proposal.managesuites.SUITE_SELECTION_RULE'), MessageType.Error));
          }
          this.disableContinue = true;
          this.appDataService.persistErrorOnUi = true;
          this.titleWithButton.buttons[1].attr = true;
        } else if (selsectedSuitesID.includes(21) && selsectedSuitesID.includes(20)) {
          //  for DC suites selection 
          this.messageService.displayMessages(this.appDataService.setMessageObject(
            this.localeService.getLocalizedMessage('proposal.managesuites.DC_TETRATION_SELECTION_RULE'), MessageType.Error));
          this.disableContinue = true;
          this.appDataService.persistErrorOnUi = true;
          this.titleWithButton.buttons[1].attr = true;
        }else {
          this.appDataService.persistErrorOnUi = false;
          this.disableContinue = false;
          this.messageService.clear();
        }
        if (selsectedSuitesID.includes(51) && !this.appDataService.roadMapPath) { // check for AppD Suite and show info message
          this.messageService.displayMessages(this.appDataService.setMessageObject(
            this.localeService.getLocalizedMessage('proposal.managesuites.DC_APPD_SELECTED'), MessageType.Info), true);
          this.isShowInfoMsgForAppD = true;
          this.appDataService.persistErrorOnUi = true;
        }
        if (selsectedSuitesID.includes(52) && !this.appDataService.roadMapPath) { // check for AppD Suite and show info message
          this.messageService.displayMessages(this.appDataService.setMessageObject(
            this.localeService.getLocalizedMessage('proposal.managesuites.DC_THOUSANDEYE_SELECTED'), MessageType.Info), true);
            this.isShowInfoMsgForThousandEye = true;
          this.appDataService.persistErrorOnUi = true;
        } 
        this.createProposalService.checkToAllow84MonthsTerm(selsectedSuitesID); // check selected suiteId's and set duration
      }
    }

    //  check the selected are mandatory
    function isMandatory(element) {
      return (element.mandatory === true);
    }
  }

  headerCheckBoxAction(isCheckBoxSelected: boolean) {
    if (isCheckBoxSelected) {
      // If selected
      this.gridApi.selectAll();
    } else {
      // If not selected
      this.isHeaderCalled=true;
      this.gridApi.deselectAll();
      
      for (const suites of this.manageSuitesService.suitesData) {
        if(suites.cxSuites && suites.cxSuites[0].inclusion){
          this.cxSuitesData = this.cxSuitesData.filter(item => item.id !== suites.cxSuites[0].id);
        }
      }
    }
  }

  handleHeaderCheckboxSelection() {
    //this method is to manage suites header check box.
    const selsectedSuites = this.gridApi.getSelectedRows();
    if (selsectedSuites.length === this.manageSuitesService.suitesData.length - this.disabledSuitesCount) {
      // All suites are selected
      // Make header check box selected
      this.headerCheckBoxHanldeEmitter.emit(true);
    } else {
      // Make header check box deSelected
      this.headerCheckBoxHanldeEmitter.emit(false);
    }
  }

  // method to check or uncheck cx Suites if parent suites are checked/unchecked
  setCXSuiteSelection(suitesData) {
    let suiteIdArray = [];
    suiteIdArray = suitesData.map(a => a.id);
    // make changes to set cxSuites selection based on suites selection
    for (const suites of this.manageSuitesService.suitesData) {
      if (suites.cxSuites && !suiteIdArray.includes(suites.id)) {
        suites.cxSuites[0].inclusion = false;
        suites.cxSuites[0].attachRate = 0;
        this.updateCxSuiteDataObj(suites.cxSuites[0]); // remove services suites if SW suites are deselected
      }
    }
    this.checkCxAttachRateForSuites();
  }

  // method when cx suite is selected 
  selectCxSuite(params) {
    this.updateCxSuiteDataObj(params);
    this.checkCxAttachRateForSuites(); // check cx attach rate after selection or deselection of each CX suite
  }

  updateCxSuiteDataObj(params){
    if(params && params.inclusion){
      this.cxSuitesData.push(params); 
    } else {     
      this.cxSuitesData = this.cxSuitesData.filter(item => item.id !== params.id);      
    }
  }

  // method to check totalcxrate of selected cx Suites when changed the value for each suite
  checkCxAttachRateForSuites(){
    const selsectedSuites = this.gridApi.getSelectedRows();
    this.includedCXSuites = []; // to save selected CX Suites
    let ifCxAttachRateSatisfied = true; // set to disable continue if attach rate conditions are not met
    for (const data of this.cxSuitesData){
      if(data.inclusion){
        if (!data.partOfExistingSubscription){
          this.includedCXSuites.push(data); // push selected cx Suites
        }
        if(!data.attachRate){ // in Cx suite included and attach rate is not present disable continue button
          ifCxAttachRateSatisfied = false;
        }
      } else {
        data.attachRate  = 0;
      }
    }
    if(!ifCxAttachRateSatisfied 
      || (!this.proposalDataService.cxProposalFlow && !selsectedSuites.length && !this.includedCXSuites.length)
      || (this.proposalDataService.cxProposalFlow && !this.includedCXSuites.length)){
      this.titleWithButton.buttons[1].attr = true;//disable continue button if any selected cx suite does not have attach 
    } else {
      this.titleWithButton.buttons[1].attr = false;
    }
  }
}

function numberValueParser(params) {
  return Number(params.newValue);
}

function formatNumber(number) {
  const tmpNumber = Math.floor(number);
  return !isNaN(tmpNumber) ? tmpNumber.toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0;
}
