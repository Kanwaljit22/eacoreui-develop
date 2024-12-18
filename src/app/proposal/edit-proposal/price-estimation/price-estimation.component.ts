import { Component, OnInit, EventEmitter, OnDestroy, ElementRef, ViewChild, ChangeDetectorRef, Renderer2 } from "@angular/core";
import {
  GridOptions,
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  CellDoubleClickedEvent,
  GridReadyEvent
} from "ag-grid-community";
import { CustomPinnedRowRenderer } from "./pinned-row/custom-pined-row.component";
import { GroupColumnComponent } from "./group-cell/group-column.component";
import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ITitleWithButtons } from "../../../../app/shared/title-with-buttons/title-with-buttons.model";
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { IRoadMap } from "../../../../app/shared/road-map/road-map.model";
import { RoadMapConstants } from "../../../../app/shared/road-map/road-map.constants";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { UtilitiesService } from "../../../../app/shared/services/utilities.service";
import { DiscountParameterComponent } from "../../../../app/modal/discount-parameter/discount-parameter.component";
import { PriceEstimationService, RecalculateAllEmitterObj } from "./price-estimation.service";
import { MessageService } from "@app/shared/services/message.service";
import { BlockUiService } from "@app/shared/services/block.ui.service";
import { AppDataService } from "@app/shared/services/app.data.service";
import { TcoWarningComponent } from "@app/modal/tco-warning/tco-warning.component";
import { EditCellComponent } from "@app/proposal/edit-proposal/price-estimation/edit-cell/edit-cell.component";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { QualificationsService } from "../../../qualifications/qualifications.service";
import { SubHeaderComponent } from "../../../shared/sub-header/sub-header.component";
import { ConstantsService } from '../../../shared/services/constants.service';
import { CopyLinkService } from "../../../shared/copy-link/copy-link.service";
import { Observable ,  Subscription } from 'rxjs';
import { LocaleService } from "@app/shared/services/locale.service";
import { HeaderService } from "@app/header/header.service";
import { MessageType } from "../../../shared/services/message";
import { DownloadRequestComponent } from "@app/modal/download-request/download-request.component";
import { ManageSuitesService } from '../manage-suites/manage-suites.service';
import { ApproveExceptionComponent } from "./approve-exception/approve-exception.component";
import { ApproveExceptionService } from "./approve-exception/approve-exception.service";
import { ProposalSummaryService } from "../proposal-summary/proposal-summary.service";
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { GuideMeService } from '../../../shared/guide-me/guide-me.service';
import { PermissionService } from "@app/permission.service";
import { PermissionEnum } from "@app/permissions";
import { UploadFileComponent } from "@app/modal/upload-file/upload-file.component";
import { PartnerDealCreationService } from "@app/shared/partner-deal-creation/partner-deal-creation.service";
import { RestorePaWarningComponent } from '@app/modal/restore-pa-warning/restore-pa-warning.component';
import { OverrideMsdComponent } from '@app/modal/override-msd/override-msd.component';
import { ConfirmReloadEaConsumptionComponent } from "@app/modal/confirm-reload-ea-consumption/confirm-reload-ea-consumption.component";
import { ProposalPollerService } from "@app/shared/services/proposal-poller.service";
import { EaService } from "ea/ea.service";


@Component({
  selector: "app-price-estimation",
  templateUrl: "./price-estimation.component.html",
  styleUrls: ["./price-estimation.component.scss"]
})
export class PriceEstimationComponent implements OnInit, OnDestroy {
  @ViewChild('requestValue', { static: true }) private valueContainer: ElementRef;
  roadMap: IRoadMap;
  private gridApi;
  private gridColumnApi;
  public gridOptions: GridOptions;
  public domLayout;
  private getRowStyle;
  // titleWithButton: ITitleWithButtons = this.getTitleWithButton();
  bsModalRef: BsModalRef;
  page: number;
  dropdownsize: number;
  showMessage = true;
  showAdjMessage = false;
  editValues: boolean;
  eaQtyList = [];
  public rowData: any;
  pinnedResult = {};
  json: any;
  priceEstimateData;
  customerSuccessNote = false;
  customerSuccessMsg: any = '';
  requestIBA = true;
  disableRecalculate = true;
  val: any;
  level: any;
  rampCreditDetails: any;
  refreshGridEmitter = new EventEmitter();
  recalculateAllEmitter = new EventEmitter();
  isErrorAtSuiteLevel = false;
  purchaseAdjustmentException = false;
  dnaMaxSubscriptionDiscountException = false;
  errorMessages: Set<string>;
  suiteLineItemMap = new Map<string, any>();
  arrayOfErrorMessages: Array<string>;
  isErrorPersisted = false;
  public subscribers: any = {};
  subscription: Subscription;
  confirmType = '';
  thresholdException = false;
  aci_cc_suitesPresent = false; // This is added for ACI and CC suites.
  securityArchitecture = false;
  configStatus: string;
  suitesCount: number;
  // isloccRequired = false;
  mandatorySuitesData: any = [];
  lessSuitesCount = false;
  readOnlyMode = false;
  showAllError = false;
  showAllWarning = false;
  showSalesConnect = false;
  allowReopen = false;
  partnerLedFlow = false;
  showAuthMessage = false;
  signatureSigned = true;
  showLOCCConfirmationMessage = false;
  todaysDate: Date;
  isShowRequestDocument = false;
  suiteGroupLineItemMap = new Map<string, any>();
  loccOptional = false;
  requestPa = false; // to set for requesting Purchase adjustment
  showRequestDocuments = false;
  rampDiscount: any;
  isShowDialDownRamp = false; // to show dialDown Ramp button 
  isShowRestorePa = false; // to show restore PA button
  isRequestStartDateDue = false; // Flag to show error and stop user for moving forward to submit proposal if request start date is due.
  showCredits: boolean = false;
  public specialExceptionflyoutOpen = false;
  isShowOverrideMsd = false; // to set manage proposal exception permission and show button
  showOverrideMsdButton = false; // to show Change MSD Suite Count button
  isChangeSubFlow = false;
  showChangeSubscriptionMessage = false;
  isRediectToCCW = false; //This flag is use to display/hide price estimate
  redirectToDefineSuite = false; // This flag is use to redirect to define suite page if billToId is missing in case of software have CX proposal


  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  myForm: FormGroup;
  configUIRequest: FormControl;

  constructor(public localeService: LocaleService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    public utilitiesService: UtilitiesService,
    public priceEstimationService: PriceEstimationService,
    public qualService: QualificationsService,
    public messageService: MessageService,
    public blockUiService: BlockUiService,
    public appDataService: AppDataService,
    private modalVar: NgbModal,
    public proposalDataService: ProposalDataService,
    public createProposalService: CreateProposalService,
    public constantsService: ConstantsService,
    private copyLinkService: CopyLinkService,
    public headerService: HeaderService,
    public manageSuitesService: ManageSuitesService,
    public approveExceptionService: ApproveExceptionService,
    public proposalSummaryService: ProposalSummaryService,
    public guideMeService: GuideMeService,
    public permissionService: PermissionService,
    public partnerDealCreationService: PartnerDealCreationService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private proposalPollerService: ProposalPollerService,
    public eaService: EaService
  ) {
    this.page = 1;
    this.dropdownsize = 30;
    this.configUIRequest = new FormControl('')
    // this.domLayout = 'autoHeight';
    this.myForm = new FormGroup({
      configUIRequest: this.configUIRequest,
    });
    // this.domLayout = 'autoHeight';
    //Below code is use to display custom blocker.
    // this.blockUiService.customBlocker = true;
  }

  ngOnInit() {
    this.isRediectToCCW = true;   
    this.subscribers.billToNotPresentEmitter =  this.proposalDataService.billToNotPresentEmitter.subscribe(()=>{
      if(this.redirectToDefineSuite){
        this.redirectToDefineSuite = false;
        this.back();
      }
    })
    if(this.proposalDataService.isAnyCxSuiteSelected){
        this.checkToBillToInfo();
    }else {
      this.initializedPriceEstimat();
    }
    
  }

checkToBillToInfo(){ 
  this.proposalDataService.checkForRedirection().subscribe((response: any) => {
    if (response && !response.error) {
      if(response.data && response.data.billToRedirectionUrl ){
        window.open(response.data.billToRedirectionUrl, '_self');
      } else {
        this.initializedPriceEstimat();
      }
    } else {
      this.messageService.displayMessagesFromResponse(response);
     
      this.initializedPriceEstimat();
    }
  })
}


  private initializedPriceEstimat(){
    this.isRediectToCCW = false;
    this.appDataService.openCaseManagementSubject.next(true);
    if (!Object.keys(this.appDataService.proposalDataForWorkspace).length){
      this.proposalDataService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalDataService.proposalDataObject, this.qualService.qualification.accountManagerName, this.appDataService.customerName, false);
    }
    if(!this.proposalDataService.cxProposalFlow){
      this.proposalDataService.displayBellIcon = false;
    this.todaysDate = new Date();
    this.todaysDate.setHours(0, 0, 0, 0);
    //When locc signed after import show confirmation message
    this.appDataService.loccImport.subscribe(() => {
      this.blockUiService.spinnerConfig.customBlocker = true;
      this.showLOCCConfirmationMessage = true;
      this.recalculateData();
    });

    if (this.router.url.includes('/priceestimate') && !this.proposalDataService.isRedirectDone) {
      const url = this.router.url.split('/priceestimate');
      this.proposalDataService.isRedirectDone = true;
      this.redirectToDefineSuite = true;
     // history.pushState('', '', '/#' + url[0]);
      history.pushState('', '',url[0]);
      
    }

    this.isShowOverrideMsd = this.permissionService.permissions.has(PermissionEnum.Proposal_Exception_Access);
    // console.log(this.permissionService.proposalReOpen,this.appDataService.userInfo.purchaseAdjustmentUser,this.permissionService.proposalEdit);
    //Show hide SalesConnect user
    // this.manageSalesConnectUI();
    this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
   
    this.showRequestDocuments = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalRequestDocuments);
    // if (this.appDataService.isPatnerLedFlow) {
    //   this.partnerLedFlow = true;
    // } else {
    //   this.partnerLedFlow = false;
    // }
    this.blockUiService.spinnerConfig.customBlocker = true;
    this.appDataService.setActiveClassValue();
    // to hide config link, discount and  recalculate buttonsif proposal is completed or RO Super and not their proposal
    this.getReadOnlyMode();
    //Getting config URL
    this.blockUiService.spinnerConfig.startChain();

    // check and set change sub flow if subscription is present
    if(this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub){
      this.isChangeSubFlow = true;
    } else {
      this.isChangeSubFlow = false;
    }
    /* if (this.proposalDataService.configPunchoutUrl.length === 0 && this.appDataService.archName === this.constantsService.SECURITY) {
       this.proposalDataService.getConfigURL().subscribe((response: any) => {
         if (response.value) {
           this.proposalDataService.configPunchoutUrl = response.value;
         }
       });
       setTimeout(() => {
         this.gridOptions.api.setHeaderHeight(45);
       }, 0);
     }*/

    /*  if (this.proposalDataService.securityArchCreateFlow) {
        this.proposalDataService.securityArchCreateFlow = false;
        this.config();
      } else {*/
    this.priceEstimationService.eaValue = "";

   
    //Don't show warning if user already closed earlier
    var isShowMessage = localStorage.getItem(this.constantsService.KEY_SHOWMESSAGE);
    if (isShowMessage) {
      this.showMessage = isShowMessage == this.constantsService.FALSE ? false : true;
    }

    this.priceEstimationService.isContinue = false;
    //this.recalculateAllEmitter.emit(this.priceEstimationService.isContinue);
    this.messageService.clear();

    // after clearing messages check if suite level error still exists to display it on priority
    if (this.isErrorAtSuiteLevel) {
      this.isErrorPersisted = true;
      // to show this error message only for DNA/DC architectrues and inprogress proposal
      if (this.appDataService.archName !== this.constantsService.SECURITY && !this.readOnlyMode) {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('price.est.HEADER_LVL_MESSAGE'), MessageType.Error), true);
      }
    }
    // check for proposal edit and show edit icon
    // if (this.permissionService.proposalEdit) {
    this.appDataService.isProposalIconEditable = true; // allow edit icon but disable update button in modal
    // } else {
    //   this.appDataService.isProposalIconEditable = false;
    // }
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep;
    this.appDataService.showActivityLogIcon(true);
    this.json = {
      data: {
        id: this.proposalDataService.proposalDataObject.proposalId,
        userId: this.appDataService.userId,
        qualId: this.qualService.qualification.qualID
      }
    };
    //This method will call API for metadata and data.
    this.getPriceAdjustmentPermit();
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      this.securityArchitecture = true;
      setTimeout(() => {
        this.gridOptions.api.setHeaderHeight(45);
      }, 0);
    } else {
      setTimeout(() => {
        this.gridOptions.api.setHeaderHeight(38);
      }, 0);
    }

    this.subscription = this.priceEstimationService.reloadPriceEstimateEmitter.subscribe((path: any) => {
      let priceEstimateResponse;

      this.blockUiService.spinnerConfig.customBlocker = true;
      // to emit value as true for 1st msg on custom loader
      this.appDataService.peRecalculateMsg.isConfigurationDone = true;

      this.priceEstimationService.loadPriceEstimate(path).subscribe((response: any) => {

        // to emit value as true for 2nd msg on custom loader
        this.appDataService.peRecalculateMsg.isValidationDone = true;
        if (response) {
           // Set flag true if request start is due and false if request start date is not due.
           // Stop user to move forward on summary page while loading price page
           // Suite page --> Price estimation --!!> Summary page  
           this.isRequestStartDateDue = response.data.requestStartDateCurrDate;
          if (response.messages && response.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(response);
          }
          if (!response.error) {
            if(!response.data){
              this.appDataService.persistErrorOnUi = true;
              this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Error), true);
              // reset the value of green ticks on custom loader
              this.appDataService.setActiveClassValue();
              return;
            }
            priceEstimateResponse = response;

            if (response.data.rampCreditDetails) {
              this.rampCreditDetails = response.data.rampCreditDetails
            }
            // to emit value as true for 3rd msg on custom loader
            this.appDataService.peRecalculateMsg.isComputingDone = true;

            // getting the method for purchaseAdjustmentException
            this.priceAdjustmentException(response);

            //Set threshold exception approvar flag 
            this.thresholdApprovalException(response);

            //check customer and partner geoid
            this.setCustomerPartnerGEOID(response);

            //check if partner deal
            this.isPartnerDeal(response);
            //Unsigned loCC
            this.loCCSignedCheck(response);

            this.loccOptionalCheck(response);

            this.loccRequiredCheck(response);

            this.checkPremierForWireless(response);

            //Show change subscription message
            this.showChangeSubscription(response);

            this.dnaMaxSubscriptionDiscountApproval(response);

            // method to set and show diaDown ramp button
            this.showDialDownRamp(response);

            // method to set overridemsdcounts
            this.setOverrideMsdCounts(response);

            // method to show restore PA butoon
            this.setRestorePa(response);

            if (this.appDataService.archName === this.constantsService.SECURITY) {
              this.configStatus = response.data.configStatus;
              setTimeout(() => {
                this.gridOptions.api.setHeaderHeight(45);
              }, 0);
            }
            this.priceEstimationService.suitesArray = response.data.suites;

            this.loadDiscounts(priceEstimateResponse);
            if (this.gridOptions.api) {
              this.gridOptions.api.setRowData(
                this.getRowData(response),
              );
            }
            this.setTopPinedData();
            //to disable recalculate all
            this.disableRecalculate = true;
            this.checkIntitatePaRequest();// method to check and set request for PA checkbox
          }
          // reset the value of green ticks on custom loader
          this.appDataService.setActiveClassValue();
        }
      });
    })

    this.subscribers.name = this.priceEstimationService.recalculateAllEmitter.subscribe(
      (recalculateAllEmitter: RecalculateAllEmitterObj) => {
        // this.priceEstimationService.currentval.subscribe(val => this.titleWithButton.buttons[0].attr = false);
        // if(this.priceEstimationService.isEmitterSubscribe){
        this.priceEstimationService.isEmitterSubscribe = false;
        this.priceEstimationService.isContinue = recalculateAllEmitter.recalculateButtonEnable;
        this.disableRecalculate = !recalculateAllEmitter.recalculateButtonEnable;
        // reset the value to the value coming from emitter
        this.requestIBA = !recalculateAllEmitter.recalculateButtonEnable;
        if (recalculateAllEmitter.recalculateAllApiCall) {
          this.appDataService.peRecalculateMsg.isValidationDone = true;
          this.recalculateData(true);
        }
        // if (
        //   this.proposalDataService.proposalDataObject.proposalData.status ===
        //   this.constantsService.QUALIFICATION_COMPLETE
        // ) {
        //   this.createProposalService.updateProposalStatus();
        // }
      }
      //}
    );
    this.priceEstimationService.advancedDeploymentEmitter.subscribe((response: any) => {
      this.updateAdvanced(response.suiteId, response.advancedDeployment);
    });

    this.refreshGridEmitter.subscribe((response: any) => {
      if (this.gridOptions.api) {
        this.gridOptions.api.setRowData(response
        );
      }
      // this.gridOptions.api.forEachNode(node => {
      //   node.setExpanded(true);
      //  });
    });
    //Set header discounts to blank oninit
    this.priceEstimationService.headerDiscounts.forEach(function (suite) {
      suite.value = "";
    });

    this.priceEstimationService.currentval.subscribe(
      // val => (this.titleWithButton.buttons[1].attr = !val)
      val => (this.disableRecalculate = !val)
    );
    this.gridOptions = {
      //columnDefs: this.getColumnDefs(),
      // defaultColDef: this.getDefaultColumnDefs(),
      // defaultColGroupDef: this.getDefaultColGroupDef(),
      // columnTypes: this.getColumnTypes(),
      enableColResize: true,
      // headerHeight: 25,
      frameworkComponents: {
        customPinnedRowRenderer: <{ new(): CustomPinnedRowRenderer }>(
          CustomPinnedRowRenderer
        ),
        groupCellRender: <{ new(): GroupColumnComponent }>(
          GroupColumnComponent
        ),
        editCellRenderer: <{ new(): EditCellComponent }>(
          EditCellComponent
        )
      },
      animateRows: true,
      enableSorting: false,
      // autoGroupColumnDef: this.autoGroupColumnDef(),
      // groupRowAggNodes: sumOfNodes,
      enableFilter: true,

      onGridReady: (params: GridReadyEvent) => {
        //this.blockUiService.spinnerConfig.startChain();
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.setTopPinedData();

      },

      onCellDoubleClicked: (params: CellDoubleClickedEvent) => {
        // this.priceEstimationService.isContinue = true;
        // if (params.node.rowPinned) {
        //   this.gridApi.stopEditing();
        //   params.event.stopPropagation();
        // }
      },
      getRowClass: params => {

        let cssClass = this.manageRowClass(params);
        return cssClass;
      },
      context: {
        parentChildIstance: this
      }
    };


    // this.getData();
    this.gridOptions.getRowNodeId = function (data) {
      return data.id;
    };
    // }

    // if (this.router.url.includes('/priceestimate')) {
    //   const url = this.router.url.split('/priceestimate');
    //   history.pushState('', '', '/#' + url[0]);
    // }

    // call api When priceList is present
    if (this.proposalDataService.proposalDataObject.proposalData.priceListId){
      this.checkPriceList();
    }
    this.proposalSummaryService.getShowCiscoEaAuth();
    }

    // subscribe to emitter to go back to suites or to summary page
    this.subscribers.cxPeRoadMapEmitter = this.proposalDataService.cxPeRoadMapEmitter.subscribe((backToSuites: any) => {
      this.priceEstimationService.isContinue = false;
      if (backToSuites){
        this.back();
      } else {
        this.continue();
      }
    });

    if(this.proposalDataService.relatedCxProposalId){
        this.proposalDataService.getCxProposalDataForBellIcon();
    }

    // subscribe to header api emitter and call pricelist check api after pricelist id present
    this.subscribers.headerLoaded = this.appDataService.headerDataLoaded.subscribe(() => {
      this.checkPriceList();
    })
  }



  peBaseLining(){
    const modalRef = this.modalVar.open(ConfirmReloadEaConsumptionComponent, {
      windowClass: "infoDealID"
    });
    modalRef.result.then(result => {
      if (result.continue === true) {
        this.loadPriceEstimateData(true);
      }
    });
  }

  checkPriceList() {
    let priceListArray = [];
    this.createProposalService.getPriceList(this.qualService.qualification.qualID).subscribe(
      (response: any) => {
        if (response && !response.error) {
          priceListArray = response.data;
          let inPriceList = false;
          const proposalPriceListId = +this.proposalDataService.proposalDataObject.proposalData.priceListId;
          priceListArray.forEach(element => {
            if (element.erpPriceListId === proposalPriceListId) {
              inPriceList = true;
            }
          });
          if(!inPriceList && this.proposalDataService.proposalDataObject.proposalData.status !== this.constantsService.COMPLETE_STATUS) {
            this.priceEstimationService.showPriceListError = true;
          }
        }
      });
  }

  toggleTab(event: any){

    if (event.target.classList.length === 1 && event.target.classList[0] === "flyOut-dropdown") {
      event.target.classList ="flyOut-dropdown open";
    }
    else if (event.target.classList.length > 1){
      event.target.classList="flyOut-dropdown";
    }

  }

  // method to open modal for MSD Suite Count
  changeMsdCount(){
    this.bsModalRef = this.modalService.show(
      OverrideMsdComponent,
      Object.assign({ class: "modal-sm discount-parameter",ignoreBackdropClick: true })
    );
    this.bsModalRef.content.closeBtnName = "Close";
  }
  
  //Manage Row indentation ,errors and editable cell css class
  manageRowClass(params) {

    if (params.node.rowPinned) {
      return "pinnedRow";
    } else if (params.node.level === 0) {
      let cssClass = 'editable-rows'
      let key: any = params.data['suiteId'];
      if (key) {
        key = key + '';
        if (this.priceEstimationService.suiteAndLineMessageMap.has(key)) {
          cssClass = cssClass + ' suite-level-error';
          // params.colDef.myClass = true;
        }
      }
      return cssClass;
    } else if (params.node.level === 1) {
      const suiteId = params.data['suiteId'];
      const lineItemId = params.data['lineItemId'];
      let cssClass = 'editable-rows';
      if (this.priceEstimationService.lineLevelMessageMap.has(suiteId + lineItemId)) {
        cssClass = cssClass + ' suite-level-error';
      }

      if (params.node.data && params.node.data.lineItemType === this.priceEstimationService.LINE_ITEM_TYPE) {
        cssClass = cssClass + ' indent-row font-weight-bold';
      } else if (params.node.data && params.node.data.groupName) {
        cssClass = cssClass + ' indent-row-line-item';
      }
      return cssClass;
    }
  }



  // getPriceEstimate () {

  //       this.priceEstimationService.loadPriceEstimate().subscribe((response: any) => {
  //           if (response) {
  //             if (response.messages && response.messages.length > 0) {
  //               this.messageService.displayMessagesFromResponse(response);
  //             }
  //             if (!response.error) {
  //               this.loadDiscounts(response);
  //               this.gridApi.setRowData(
  //                 this.getRowData(response)
  //               );
  //               this.setTopPinedData();
  //             }
  //           }
  //         });
  // }


  reopenProposal() {
    this.proposalSummaryService.reopenProposal();
    // subscibe to emitter to get value of roadmappath and enable config link 
    this.subscribers.roadMapEmitter = this.proposalSummaryService.roadMapEmitter.subscribe((roadMapPath: any) => {
      this.allowReopen = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalReOpen);
      // if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        // check for proposal edit and show edit icon
        // if (this.permissionService.proposalEdit) {
        this.appDataService.isProposalIconEditable = true; // allow edit icon but disable update button in modal
        // } else {
        //   this.appDataService.isProposalIconEditable = false;
        // }
        // reload the page to enable all the links
        // set the grid after reopened
        if (this.gridOptions.api) {
          this.gridOptions.api.redrawRows();
        }
        this.readOnlyMode = false; // to enable config link after re-opening
        //Get column metadata incase of Security to show config button
        if (this.appDataService.archName === this.constantsService.SECURITY) {
          this.appDataService.peRecalculateMsg.isConfigurationDone = true;
          this.getColumnDefs();
        }
        //this.ngOnInit();
      }
    });
  }

  //Call this service to check if user has permission for price adjustment
  getPriceAdjustmentPermit() {
    //this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.getColumnDefs();
    this.loadPriceEstimateData();
    // this.priceEstimationService.getPurchaseAdjustmentPermit().subscribe((response: any) => {
    //   // to emit value as true for 1st msg on custom loader
    //   this.appDataService.peRecalculateMsg.isConfigurationDone = true;   
    //   if (response && !response.error) {
    //     if (response.permitted) {
    //       this.appDataService.userInfo.purchaseAdjustmentUser = response.permitted;
    //     } else {
    //       this.appDataService.userInfo.purchaseAdjustmentUser = false;
    //     }       
    //   } else {
    //     this.messageService.displayMessagesFromResponse(response);
    //   }
    // });
  }

  //Check if user is allowed for salesconnect view
  manageSalesConnectUI() {

    this.appDataService.getContentTraceID(this.proposalDataService.proposalDataObject.proposalId).subscribe((response: any) => {
      this.showSalesConnect = false;

      if (response && !response.error) {

        if (response.data && response.data["contentTraceIds"]) {
          let contentTraceID = response.data["contentTraceIds"];
          this.appDataService.contentTraceID = contentTraceID;
          if (contentTraceID.length > 0) {
            this.showSalesConnect = true;
          }
        }
      } else {
        this.showSalesConnect = false;
      }
    });
  }


  ngOnDestroy() {
    this.proposalPollerService.stopPollerService(); 
    this.appDataService.showActivityLogIcon(false);
    this.priceEstimationService.eaValue = "";
    this.appDataService.persistErrorOnUi = false;
    this.priceEstimationService.showFinancialSummary = false;
    if (this.subscribers.name) {
      this.subscribers.name.unsubscribe();
    }
    if (this.subscribers.roadMapEmitter) {
      this.subscribers.roadMapEmitter.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscribers.cxPeRoadMapEmitter){
      this.subscribers.cxPeRoadMapEmitter.unsubscribe();
    }

    if(this.proposalDataService.pollerSubscibers){
      this.proposalDataService.pollerSubscibers.unsubscribe();
    }
    if (this.subscribers.headerLoaded){
      this.subscribers.headerLoaded.unsubscribe();
    }
    this.proposalSummaryService.unSubscribe();
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.priceEstimationService.showCredits = false;
    this.blockUiService.spinnerConfig.customBlocker = false;
    this.proposalDataService.isCxAttachedToSoftware = false;
    if(this.subscribers.billToNotPresentEmitter){
      this.subscribers.billToNotPresentEmitter.unsubscribe();
    }
    this.appDataService.openCaseManagementSubject.next(false);
    this.proposalDataService.clearWorkspaceCaseInputInfo();
    this.appDataService.proposalDataForWorkspace = {};
  }

  eAQuantity() {
    this.priceEstimationService.showEAQuantity = true;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.priceEstimateQtyChange;
  }

  // to approve purchase adjustmet
  adjustmentApprove() {
    // assign approvetype to 'pa'
    this.approveExceptionService.approveType = 'pa';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {

    });
  }

  // to approve dc thresold exception
  dcExceptionModal() {

    this.approveExceptionService.approveType = 'dc';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {

      //Reload data on exception approve
      this.ngOnInit();
    });
  }
  // to approve security thresold exception
  secExceptionModal() {
    this.approveExceptionService.approveType = 'sec';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      //Reload data on exception approve
      this.ngOnInit();
    });
  }

  // to approve dna thresold exception
  dnaExceptionModal() {

    this.approveExceptionService.approveType = 'dna';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      //Reload data on exception approve
      this.ngOnInit();
    });
  }

  // to approve dna thresold exception
  dnaDiscountExceptionModal() {

    this.approveExceptionService.approveType = 'dnaDiscount';
    const modalRef = this.modalVar.open(ApproveExceptionComponent, { windowClass: 'searchLocate-modal' });
    modalRef.result.then((result) => {
      //Reload data on exception approve
      this.ngOnInit();
    });
  }

  // checkning readOnly mode
  getReadOnlyMode() {
    // to disable config link if proposal is completed or RO Super and not their proposal
    if ((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath) {
      this.readOnlyMode = true;
    } else {
      this.readOnlyMode = false;
    }
  }


  getColumnDefs() {
    const thisInstance = this;
    this.appDataService.peRecalculateMsg.isConfigurationDone = true;
    this.priceEstimationService.getColumnDefs().subscribe((res: any) => {
      // const data = {
      //   "headerName": "Controller",
      //   "minwidth": 100,
      //   "lockPosition": true,
      //   "width": 100,
      //   "suppressMenu": true,
      //   "field": "controllerEaQty",
      //   "cellRenderer": "editCellRenderer",
      //   "suppressSorting": true
      //   }
     // res.data.columns[5].children[0].children.push(data);
      let columnDefs = res.data.columns;
      // if not renewal flow remove the 2 columns from columnData
      if(!this.appDataService.isRenewal){
        columnDefs = columnDefs.filter(data => (data.field !== 'consumptionTotalQtys') && (data.field !== 'consumptionConsumedQtys'));
      }
      this.appDataService.archName = res.data.archName;
      //this.appDataService.customLoaderEmitter.emit('got response');

      // to emit value as true for 2nd msg on custom loader
      this.appDataService.peRecalculateMsg.isValidationDone = true;

      for (let i = 0; i < columnDefs.length; i++) {
        const column = columnDefs[i];
        if (column['field'] === 'name') {
          if (this.appDataService.archName === this.constantsService.SECURITY) {
            column['width'] = 570;
            column['cellClass'] = 'customer-popup';
          } else {
            column['width'] = 380;
          }
          column['cellRendererParams'] = {
            innerRenderer: 'groupCellRender'
          };
        }
        if (column['field'] === 'parameterIcon') {
          column['cellRendererParams'] = (params) => {
            return {
              innerRenderer: 'groupCellRender',
              suppressDoubleClickExpand: true,
              bsModalRef: this.bsModalRef,
              modalService: this.modalService
            }
          }
          //if (this.appDataService.userInfo.purchaseAdjustmentUser) {
          column['width'] = 70;
          //} else {
          //column['width'] = 110;
          //}
        }
        if (column['field'] === 'eaQuantity') {
          column['cellClass'] = (params) => {
            return this.cellClass(params);
          };
        }
        if(column['field'] === 'extendedListPrice'){
          column['width'] = 140;
        }
       
         if(this.appDataService.isTwoTierUser(this.qualService.buyMethodDisti)){//One Time Discount
          if(column.headerName === 'Total Contract Value (Post-One Time Discount)' || column.headerName === 'Total Contract Value (Pre-One Time Discount)' || column.headerName === 'Discount (%)'){
            for (let m = 0; m < column.children[0].children.length; m++) {
              column.children[0].children[m]['cellRenderer'] = this.valueForTwoTierUser;
           
            }
         }
      }
        if (column.children) {
          let childArr = column.children;
          
          for (let j = 0; j < childArr.length; j++) {
            if (childArr[j]['cellClass'] === "dollar-align") {
              childArr[j]['valueFormatter'] = (params) => {
                return this.currencyFormat(params);
              }
            }
            else if (childArr[j]['cellClass'] === "text-right") {
              childArr[j]['valueFormatter'] = (params) => {
                return this.currencyFormat(params);
              }
            }
            if (childArr[j].children) {
              for (let k = 0; k < childArr[j].children.length; k++) {


                if (childArr[j].children[k]['cellClass'] === "dollar-align" || childArr[j].children[k]['cellClass'] === "text-right") {
                  childArr[j].children[k]['valueFormatter'] = (params) => {
                    return this.currencyFormat(params);
                  }
                }
               

                if (childArr[j].children[k]['field'] === "advancedEaQty") {
                  childArr[j].children[k]['valueFormatter'] = (params) => {
                    return this.currencyFormat(params);
                  }
                  childArr[j].children[k]['cellClass'] = (params) => {
                    return this.cellClass(params);
                  }
                } else if (childArr[j].children[k]['field'] === 'foundationEaQty' || childArr[j].children[k]['field'] === "advantageEaQty" || childArr[j].children[k]['field'] === "essentialsEaQty" || childArr[j].children[k]['field'] === "ecsEaQty" || childArr[j].children[k]['field'] === 'dcSubscriptionEaQty' || childArr[j].children[k]['field'] === "advancedAddonEaQty" || childArr[j].children[k]['field'] === "controllerEaQty") {
                  childArr[j].children[k]['cellClass'] = (params) => {
                    return this.cellClass(params);
                  }
                }
                if (childArr[j].children[k].children) {
                  for (let l = 0; l < childArr[j].children[k].children.length; l++) {
                    if (childArr[j].children[k].children[l]['field'] === 'dnaAdvantageEaQty' || childArr[j].children[k].children[l]['field'] === 'dcAdvantageEaQty') {
                      childArr[j].children[k].children[l]['valueGetter'] = (params) => {
                        return this.advantageValue(params);
                      }
                      childArr[j].children[k].children[l]['cellClass'] = (params) => {
                        return this.dnaCellClass(params);
                      }
                    } else if (childArr[j].children[k].children[l]['field'] === 'advantageGfEaQty' || childArr[j].children[k].children[l]['field'] === "advantageBfC1EaQty" || childArr[j].children[k].children[l]['field'] === 'advantageBfEaQty' || childArr[j].children[k].children[l]['field'] === "advantageBfLbEaQty" || childArr[j].children[k].children[l]['field'] === 'premierBfC1EaQty' || childArr[j].children[k].children[l]['field'] === 'premierBfLbEaQty' || childArr[j].children[k].children[l]['field'] === 'premierBfEaQty' || childArr[j].children[k].children[l]['field'] === 'premierGfEaQty' || childArr[j].children[k].children[l]['field'] === 'advantageBf4Qty' || childArr[j].children[k].children[l]['field'] === 'advantageBf5Qty' || childArr[j].children[k].children[l]['field'] === 'advantageBf6Qty' || childArr[j].children[k].children[l]['field'] === 'premierBf4Qty' || childArr[j].children[k].children[l]['field'] === 'premierBf5Qty' || childArr[j].children[k].children[l]['field'] === 'premierBf6Qty') {
                      childArr[j].children[k].children[l]['cellClass'] = (params) => {
                        return this.cellClass(params);
                      }
                    } else if (childArr[j].children[k].children[l]['field'] === 'dnaPremier' || childArr[j].children[k].children[l]['field'] === 'dcPremier') {
                      childArr[j].children[k].children[l]['cellClass'] = (params) => {
                        return this.dnaCellClass(params);
                      }
                      childArr[j].children[k].children[l]['valueGetter'] = (params) => {
                        return this.premierValue(params);
                      }
                    }
                  }
                }
              }
            }
            // if(column.cellClass === "dollar-align"){
            //   column['valueFormatter'] = (params)=>{
            //     return this.currencyFormat(params);
            //   }
            // }
            // if(column.cellClass === "text-right"){
            //   column['valueFormatter'] = (params)=>{
            //     return this.currencyFormat(params);
            //   }
            // }
          }
        }
        // setting valueformatter for all columns that doesn't have child columns
        if (column.cellClass === "dollar-align") {
          column['valueFormatter'] = (params) => {
            return this.currencyFormat(params);
          }
        }
        if (column.cellClass === "text-right") {
          column['valueFormatter'] = (params) => {
            return this.currencyFormat(params);
          }
        }
        // return columnDefs;    
      }

      //In case of threshold exception grid is not ready
      if (this.gridOptions.api) {
        this.gridOptions.api.setColumnDefs(columnDefs);
      }

      // /return columnDefs;
      if (this.proposalDataService.punchoutFromConfig) {
        // this.blockUiService.spinnerConfig.startChain();
        this.getReadOnlyMode(); // readonly mode if /pe loaded
      }
    });
  }

  loadPriceEstimateData(isBaseLining = false) {

    this.blockUiService.spinnerConfig.customBlocker = true;

    this.priceEstimationService.loadPriceEstimate(null,isBaseLining).subscribe((response: any) => {
      //this.appDataService.customLoaderEmitter.emit('got response');
      // to emit value as true for 3rd msg on custom loader
      this.appDataService.peRecalculateMsg.isComputingDone = true;
      if (response && !response.error) {
        if(!response.data){
          this.appDataService.persistErrorOnUi = true;
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Error), true);
          this.blockUiService.spinnerConfig.unBlockUI();
          this.blockUiService.spinnerConfig.stopChainAfterThisCall(); 
          return;
        }
        // Set flag true if request start is due and false if request start date is not due.
        // Stop user to move forward on summary page
        // Suite page --> Price estimation --!!> Summary page  
        this.isRequestStartDateDue = response.data.requestStartDateCurrDate;
        if (response.messages && response.messages.length > 0) {
          this.appDataService.persistErrorOnUi = true;
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
          let priceEstimateResponse;
          if (response.data.rampCreditDetails) {
            this.rampCreditDetails = response.data.rampCreditDetails
          }
          //this.blockUiService.spinnerConfig.unBlockUI();
          // getting the method for purchaseAdjustmentException
          this.priceAdjustmentException(response);

          //Set threshold exception approvar flag 
          this.thresholdApprovalException(response);

          //check customer and partner geoid
          this.setCustomerPartnerGEOID(response);

          //check if partner deal
          this.isPartnerDeal(response);

          //Unsigned loCC
          this.loCCSignedCheck(response);

          //Show change subscription message
          this.showChangeSubscription(response);

          this.checkPremierForWireless(response);

          this.loccOptionalCheck(response);

          this.loccRequiredCheck(response);
          this.dnaMaxSubscriptionDiscountApproval(response);

          // method to set and show diaDown ramp button
          this.showDialDownRamp(response);

          // method to set overridemsdcounts
          this.setOverrideMsdCounts(response);

          // method to show restore PA butoon
          this.setRestorePa(response);

          if (this.appDataService.archName === this.constantsService.SECURITY) {
            this.configStatus = response.data.configStatus;
            setTimeout(() => {
              this.gridOptions.api.setHeaderHeight(45);
            }, 0);
          }
          priceEstimateResponse = response;
          this.priceEstimationService.suitesArray = response.data.suites;
          this.loadDiscounts(priceEstimateResponse);

          // to call loadGrid method, as there is a delay from response to get the data after back from cofig
          // if (this.gridApi){ // if gridApi is there call setrowdata and setToPinnedData else after 0.5sec call the same 
          //   this.loadGrid(response);
          // } else {
          //   setTimeout(() => {
          //     this.loadGrid(response);
          //   }, 500);
          // }
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(
              this.getRowData(response),
            );
          }
          this.setTopPinedData();
          // reset the value of green ticks on custom loader
          this.appDataService.setActiveClassValue();
          this.checkIntitatePaRequest();// method to check and set request for PA checkbox
        }
      }else {
        // this.blockUiService.spinnerConfig.unBlockUI();
        this.messageService.displayMessagesFromResponse(response);
      }
      this.blockUiService.spinnerConfig.unBlockUI();
      this.blockUiService.spinnerConfig.stopChainAfterThisCall();

    });

  }

  // to setrowdata and settopinneddata 
  loadGrid(response) {
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(
        this.getRowData(response),
      );
    }
    this.setTopPinedData();
  }
  suiteRenderer(params, thisInstance) {
    if (!params.node.rowPinned && params.data.serviceLevel && params.data.serviceLevels) {
      if (params.data.serviceLevel === 'Basic Support') {
        return params.value + '<span class="legends basic--support">' + params.data.serviceLevel + '</span>';
      } else {
        return params.value + '<span class="legends solution--support">' + params.data.serviceLevel + '</span>';
      }
    } else if (!params.node.rowPinned && params.data.configStatus && params.node.level === 0 && params.data.configStatus !== 'undefined') {
      const toolTip = '<div class="suiteTooltip"> <span class="icon-arrow-up"><span class="path1"></span><span class="path2"></span></span>' + params.data.description + '</div>';
      const value = '<span class="suite-name">' + params.value + '</span>';
      return value + toolTip + '<div class="edit-config-row-btn"><span class="config-text">Help</span></div>';

    } else {
      return params.value;
    }
  }

  // numberFormat()

  advantageValue(params) {
    let val;
    if (params.data.dnaAdvantageEaQty || params.data.name.substring('DNA') !== -1) {
      val = params.data.dnaAdvantageEaQty;
      if (val !== 0)
        val = this.utilitiesService.formatWithNoDecimal(val);
      else {
        val = params.data.dnaAdvantageEaQty;
      }
    } else {
      val = ''
    }
    //const val = params.data.abC1 + params.data.abLanBase + params.data.abField + params.data.agField;
    return val;
  }

  premierValue(params) {
    let val;
    if (params.data.dnaPremierEaQty || params.data.dnaPremierEaQty === 0 || params.data.name.substring('DNA') !== -1 || params.data.premierEaQty || params.data.premierEaQty === 0) {
      // val  = params.data.dnaPremierEaQty || params.data.dnaPremierEaQty === 0 ? params.data.dnaPremierEaQty : params.data.premierEaQty;

      // check zero value to display on grid for dnaPremierEaQty or premierEaQty
      if (params.data.dnaPremierEaQty || params.data.dnaPremierEaQty === 0) {
        val = params.data.dnaPremierEaQty;
      } else if (params.data.premierEaQty || params.data.premierEaQty === 0) {
        val = params.data.premierEaQty;
      }
    } else {
      val = ''
    }
    //const val = params.data.pbC1 + params.data.pbLanBase + params.data.pbField + params.data.pgField;
    return val;
  }

  dnaRenderer(params) {
    if (params.value && params.node.rowPinned !== 'top' && params.node.level === 0) {
      return '<span class="text-link">' + params.value + '</span>';
    }
  }

  dnaCellClass(params) {
    if (params.node.rowPinned !== 'top' && params.node.level === 0) {
      return 'text-right text-link';
    } else {
      return 'text-right';
    }
  }

  public onCellClicked($event) {

    const inputValue = $event.event.target.innerText

    if ($event.colDef.field === 'dnaAdvantageEaQty' || $event.colDef.field === 'dcAdvantageEaQty') {
      const dropdownClass = $event.event.target.classList.value;
      const isTextclick = dropdownClass.search('text-link');
      const grpnames = ['ADVANTAGE'];
      if (isTextclick > -1 && inputValue.length > 0) {
        if ($event.node.expanded) {
          $event.node.setExpanded(false);
          grpnames.forEach(function (groupId) {
            $event.columnApi.setColumnGroupOpened(groupId, false);
          });
        } else {
          $event.node.setExpanded(true);
          grpnames.forEach(function (groupId) {
            $event.columnApi.setColumnGroupOpened(groupId, true);
          });
        }
      }
    } else if ($event.colDef.field === 'dnaPremier' || $event.colDef.field === 'dcPremier') {
      const dropdownClass = $event.event.target.classList.value;
      const isTextclick = dropdownClass.search('text-link');
      const grpnames = ['Premier'];

      if (inputValue.length > 0) {
        if ($event.node.expanded) {
          $event.node.setExpanded(false);
          grpnames.forEach(function (groupId) {
            $event.columnApi.setColumnGroupOpened(groupId, false);
          });
        } else {
          $event.node.setExpanded(true);
          grpnames.forEach(function (groupId) {
            $event.columnApi.setColumnGroupOpened(groupId, true);
          });
        }
      }
    } else if ($event.colDef.field === 'name') {
      const configClass = $event.event.target.classList.value;
      const isConfigclick = configClass.search('edit-config-row-btn');
      // const isConfigIconClick = configClass.search('icon-config');
      // const isConfigTextClick = configClass.search('config-text');
      const isQuestionMarkClicked = configClass.search('config-text');

      if (isQuestionMarkClicked > -1) {
        this.displaySuiteInfo($event.data.suite); // for guide me context for respective suite using suite name
      }
    }
  }

  valueForTwoTierUser(params){
    return '--';
  }

  currencyFormat(params) {
    if (params.colDef.field === "ibQuantity") {
      return this.utilitiesService.formatWithNoDecimal(params.value);
    } else if (params.colDef.field === "bookingsQuantity" || params.colDef.field === "eaQuantity" || params.colDef.field === "multiplier" || params.colDef.field === "consumptionTotalQtys" || params.colDef.field === "consumptionConsumedQtys") { // set the value of the quantities comma seperated
      let val;
      if (params.value || params.value === 0) { // if value is present and its 0
        val = params.value;
        if (val !== 0)
          val = this.utilitiesService.formatWithNoDecimal(val); // if value > 0, set it to comma seperated value
        else {
          val = params.value; // if value = 0
        }
      } else {
        val = '' // if no vlaue set to null
      }
      return val;
    }
    else {

      return this.utilitiesService.formatValue(params.value);
    }
  }

  cellClass(params) {
    let fieldName = params.colDef.field;
    let cssClass = ''
    // this.errorMessages = ['Access Wireless (Perpetual) Advanced quantity must be zero or at least 50% of either the Access Wireless (Perpetual) quantity or the Access Wireless (Subscription) Advantage quantity. Please correct the quantity in the highlighted suites to proceed'];
    fieldName = fieldName + 'Editable';
    if (params.data[fieldName] && !this.readOnlyMode) {
      cssClass = 'dollar-align';
    } else {
      cssClass = 'text-right';
    }
    if (params.node.rowPinned !== 'top') {
      let key = params.data['suiteId'];
      if (key) {
        if (params.data['lineItemId']) {
          key = key + this.constantsService.HASH + params.data['lineItemId'] + this.constantsService.HASH + params.colDef['field'];
          if (this.priceEstimationService.suiteAndLineMessageMap.has(key)) {
            cssClass = cssClass + ' error';
            params.colDef.myClass = true;
          }
        } else {
          key = key + '';
          if (this.priceEstimationService.suiteAndLineMessageMap.has(key)) {
            //cssClass = cssClass + ' error';
            params.colDef.myClass = true;
          }
        }
      }
    }
    return cssClass;
  }



  viewAll(val) {
    this.gridOptions.api.forEachNode(node => {
      if (val.data.name === node.data.name) {
        node.setExpanded(true);
      }
    });
  }

  onCellMouseOver(event) {
    this.val = event;
    this.errorMessages = new Set<string>();
    this.arrayOfErrorMessages = new Array<string>();
    this.level = event.node.level;
    if (event.colDef.myClass || this.level === 0 && event.rowPinned !== 'top') {
      let key = event.data['suiteId'];
      if (key) {
        if (event.data['lineItemId']) {
          key = key + this.constantsService.HASH + event.data['lineItemId'] + this.constantsService.HASH + event.colDef['field'];
          if (this.priceEstimationService.suiteAndLineMessageMap.has(key)) {
            this.errorMessages = this.priceEstimationService.suiteAndLineMessageMap.get(key);
            this.arrayOfErrorMessages = Array.from(this.errorMessages);
          }
        } else {
          key = key + '';
          if (this.priceEstimationService.suiteAndLineMessageMap.has(key)) {
            this.errorMessages = this.priceEstimationService.suiteAndLineMessageMap.get(key);
            this.arrayOfErrorMessages = Array.from(this.errorMessages);
          }
        }
        this.cdr.detectChanges();
      } else {
        this.arrayOfErrorMessages = [];
      }
    }
  }

  onCellMouseOut(event) {
    // this.arrayOfErrorMessages = [];
  }

  numberFormat() { }

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

  loadDiscounts(response) {
    try {
      this.priceEstimationService.suiteDiscounts =
        response.data.suiteDiscount;
      // to apply softwareMultisuiteDiscount and totalService for DC suites
      // this.priceEstimationService.suitesArray.forEach(element =>{
      //   response.data.suiteDiscount.forEach(disc => {
      //     if(element.suiteId === disc.suiteId){
      //       element.softwareMultisuiteDiscount = disc.multisuiteDiscount;
      //       element.totalService = disc.totalSubscriptionDiscount;
      //       if(element.lineItems){
      //         element.lineItems.forEach(lineitem => {
      //           lineitem.softwareMultisuiteDiscount = disc.multisuiteDiscount; 
      //           lineitem.totalService = disc.totalSubscriptionDiscount;
      //         });
      //       }
      //     }              
      //   });
      // });  
      // set the header discount from response
      this.priceEstimationService.proposalHeaderDiscounts = response.data.headerDiscount;
    } catch (error) {
      console.error(error);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  // assigning the flag to proposal Exception
  priceAdjustmentException(response) {
    //this.blockUiService.spinnerConfig.unBlockUI();
    if (response.data && response.data.hasPurchaseAdjusmentException) {
      this.purchaseAdjustmentException = response.data.hasPurchaseAdjusmentException;
      this.appDataService.persistErrorOnUi = true;
      // show the message when PA is made
      this.showAdjMessage = true;
    } else {
      this.purchaseAdjustmentException = false;
      // show the message when PA is not  made
      this.showAdjMessage = false;
    }
  }


  // assigning the flag to threshold Exception
  thresholdApprovalException(response) {

    if (response.data && (response.data.hasDnaWarning || response.data.hasDcWarning || response.data.hasSecurityWarning)) {
      this.thresholdException = true;
    } else {
      this.thresholdException = false;
    }
  }

  dnaMaxSubscriptionDiscountApproval(response) {

    if (response.data && response.data.hasDnaMaxSubscriptionDiscountException) {
      this.dnaMaxSubscriptionDiscountException = true;
    } else {
      this.dnaMaxSubscriptionDiscountException = false;
    }
  }


  loCCSignedCheck(response) {

    if (response.data && response.data.loccSigned) {
      this.signatureSigned = true;
    } else {
      this.signatureSigned = false;
      if (response.data.loccInitiated) {
        //Incase locc is pending signature
        this.qualService.loaData.document = {};
        this.qualService.loaData.document.status = ConstantsService.PENDING_STATUS;
      } else {
        this.qualService.loaData.document = {};
      }
    }
    this.qualService.loaData.loaSigned = this.signatureSigned;

  }

  // to check and set loccoptional to hide locc tab 
  loccOptionalCheck(response) {
    if (response.data && response.data.loccOptional) {
      this.loccOptional = true;
    } else {
      this.loccOptional = false;
    }
  }

  loccRequiredCheck(response) {
    if (response.data && !response.data.loccNotRequired) {
      this.proposalDataService.isLoccRequired = true;
    } else {
      this.proposalDataService.isLoccRequired = false;
    }

    if (response.data && response.data.brownfieldPartner) {
      this.proposalDataService.isBrownfieldPartner = true;
    } else {
      this.proposalDataService.isBrownfieldPartner = false;
    }
  }

  showChangeSubscription(response) {

     if (response.data && response.data.allowedDNAC && this.isChangeSubFlow) {        
      this.showChangeSubscriptionMessage = true;
    } else {
      this.showChangeSubscriptionMessage = false;
    }

  }

  // method to set and show diaDown ramp button
  showDialDownRamp(response) {
    if (response.data && response.data.hasRampDiscount) {
      this.isShowDialDownRamp = true;
    } else {
      this.isShowDialDownRamp = false;
    }

    if (response.data && (response.data.percentOfRampDiscountPercent || response.data.percentOfRampDiscountPercent === 0)) {
      this.rampDiscount = response.data.percentOfRampDiscountPercent;
    } else {
      this.rampDiscount = 100;
    }
    if (this.appDataService.archName === this.constantsService.DNA) {
      /*  this.priceEstimationService.dnaRampDiscount = {
          rampPromoMin : 0,
          rampPromoMax: 100,
          rampPromo: this.rampDiscount
        }*/
    }
  }

  checkPremierForWireless(response){
    const suiteIdArr = response.data.suites.map((suite: any) => suite.suiteId); 
    if(suiteIdArr.includes(14)){
      const index = suiteIdArr.indexOf(14);
      if(!response.data.suites[index].premierEaQty){
        this.priceEstimationService.isPremierForWirelessZero = true;
      } else {
        this.priceEstimationService.isPremierForWirelessZero = false;
      }
    }
  }

  // method to check and set MSDSuiteCounts and to show change MSD Suite Count button
  setOverrideMsdCounts(response) {
    if (response.data && response.data.originalMSDSuiteCount) {
      this.appDataService.overrideMsd['originalMSDSuiteCount'] = response.data.originalMSDSuiteCount;
    }
    // check for systematicallyOverridenMSDSuiteCount and show/hide button
    if (response.data && (response.data.systematicallyOverridenMSDSuiteCount || response.data.systematicallyOverridenMSDSuiteCount === 0)) {
      this.appDataService.overrideMsd['systematicallyOverridenMSDSuiteCount'] = response.data.systematicallyOverridenMSDSuiteCount;
      this.showOverrideMsdButton = true;
    } else {
      this.showOverrideMsdButton = false;
    }
    if (response && response.data.manualOverridenMSDSuiteCount) {
      this.appDataService.overrideMsd['manualOverridenMSDSuiteCount'] = response.data.manualOverridenMSDSuiteCount;
    } else {
      this.appDataService.overrideMsd['manualOverridenMSDSuiteCount'] = undefined;
    }
    //console.log(this.appDataService.overrideMsd);
  }

  // method to check and set flag for showing restore PA button
  setRestorePa(response) {
    if (response.data && response.data.hasNegativeTcv) {
      this.isShowRestorePa = true;
    } else {
      this.isShowRestorePa = false;
    }
  }

  setCustomerPartnerGEOID(response) {

    this.qualService.loaData.partnerBeGeoId = response.data.partnerBeGeoId;
    this.qualService.loaData.customerGuId = response.data.customerGuId;
  }

  isPartnerDeal(response) {
    if (response.data && response.data.partnerDeal) {
      this.partnerLedFlow = true;
    } else {
      this.partnerLedFlow = false;
    }
    this.showRequestDocument();
  }

  showRequestDocument() {

    if (this.appDataService.isPatnerLedFlow) {
      this.isShowRequestDocument = false;
    } else {
      this.isShowRequestDocument = true;
    }
  }

  uploadAuthorizationLetter() {
    const modalRef = this.modalVar.open(UploadFileComponent, { windowClass: 'upload-file' });
  }

  // download signed LOA document
  downloadAuthorizationLetter() {

    let url = "";

    if (this.signatureSigned) {
      url = 'api/document/partner/download/docusign/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId +'&dealId=' + this.qualService.qualification.dealId + '&customerGuId=' + this.qualService.loaData.customerGuId + '&f=0&fcg=0';
    } else {
      url = 'api/document/partner/download/partnerLoa?partnerBeGeoId=' + this.qualService.loaData.partnerBeGeoId + '&dealId=' + this.qualService.qualification.dealId +'&customerGuId=' + this.qualService.loaData.customerGuId + "&f=0&fcg=0";
    }

    this.partnerDealCreationService.downloadUnsignedDoc(url).subscribe((response: any) => {

      if (response && !response.error) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // check purchseoptions data with the suites data and show authorization message 
  checkPurchaseAuthorization(data, selectedIds) {
    if (Object.keys(data).length > 0 && data.archs) {
      var purchaseAuthSuites = data.archs.filter(a => a.code === this.appDataService.archName);
      let AuthSuitesIds = [];
      //if (purchaseAuthSuites.length > 0) {
      for (const d of purchaseAuthSuites) {
        for (const s of d.suites) {
          AuthSuitesIds.push(s.suiteId);
        }
      }
      for (const id of selectedIds) {
        if (!AuthSuitesIds.includes(id)) {
          this.showAuthMessage = true;
          if(this.partnerLedFlow) {
            this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
          } else if(this.proposalDataService.proposalDataObject.proposalData.partner.partnerId) {
            this.appDataService.persistErrorOnUi = true;  
            this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.CISCO_LEAD_PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
          }
          return;
        }
      }
      //}
    } else {
      this.showAuthMessage = true;
      if(this.partnerLedFlow) {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
      } else if(this.proposalDataService.proposalDataObject.proposalData.partner.partnerId) {
        this.appDataService.persistErrorOnUi = true;  
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedString('proposal.CISCO_LEAD_PARTNER_NOT_AUTHORIZED_SUITES'), MessageType.Warning), true);
      } 
    }
  }

  getRowData(response) {

    try {
      if (response.data.message) {
        this.isErrorAtSuiteLevel = this.priceEstimationService.prepareMessageMapForGrid(response.data.message);
        if (this.isErrorAtSuiteLevel || (response.data.message.messages && response.data.message.messages.length > 0)) {
          this.appDataService.persistErrorOnUi = true;
        } else {
          this.appDataService.persistErrorOnUi = false;
          this.isErrorPersisted = false;
        }
        if (this.isErrorAtSuiteLevel) {
          this.isErrorPersisted = true;
          // to show this error message only for DNA/DC architectrues and inprogress proposal
          if (this.appDataService.archName !== this.constantsService.SECURITY && !this.readOnlyMode) { // don't show message for read only mode and for security architecture
            this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('price.est.HEADER_LVL_MESSAGE'), MessageType.Error), true);
          }
        } else {
          //reset perpetual suite discounts if no error
          this.priceEstimationService.perpetualSuiteDiscounts = [];
        }
      }

      // checking the confirm type and errorAtSuiteLevel to continue the function
      if (this.confirmType === 'CONTINUE' && !this.isErrorAtSuiteLevel) {
        this.roadMap.eventWithHandlers.continue();
      }
      else if (this.confirmType === 'BACK' && !this.isErrorAtSuiteLevel) {
        this.roadMap.eventWithHandlers.back();
      } else {
        this.confirmType = '';
      }
      // load purchase options if partnerflow and purchse options api not loaded
      if (this.partnerLedFlow && !this.appDataService.isPurchaseOptionsLoaded && !this.proposalDataService.cxProposalFlow) {
        this.proposalSummaryService.getPurchaseOptionsData();
      }
      // get the suites count from response and compare with no of required suites form header service
      this.suitesCount = response.data.suites.length;
      // filter the mandatory suites from the response 
      this.mandatorySuitesData = response.data.suites.filter(isMandatory);
      // console.log('test', this.mandatorySuitesData, this.mandatorySuitesData.length);
      if (this.securityArchitecture && !this.appDataService.roadMapPath && this.appDataService.noOfMandatorySuitesrequired > 0) {
        const suiteIdArr = response.data.suites.map((suite: any) => suite.suiteId); // holds the suite ids
        let message = '';
        // check if noOfMandatorySuitesrequired is fulfilled
        if (this.mandatorySuitesData.length < this.appDataService.noOfMandatorySuitesrequired) {
          // further check if number of exception suites reqd > 0, then either noOfMandatorySuitesrequired satisfies or just 1 tetration suite can be selected
          if (this.appDataService.noOfExceptionSuitesRequired > 0 && suiteIdArr.includes(38)) {
            this.lessSuitesCount = false; // no error msg to be displayed
          } else if (!suiteIdArr.includes(38) && this.appDataService.noOfExceptionSuitesRequired > 0) {
            // check in case tetration msg needs to be appended to the min suites count msg                  
            this.lessSuitesCount = true;
            message = message = this.localeService.getLocalizedString('proposal.managesuites.SUITES_MANDATORY') + this.appDataService.noOfMandatorySuitesrequired + this.localeService.getLocalizedString('proposal.managesuites.SUITES_SELECTION') + ' ' + this.localeService.getLocalizedString('proposal.managesuites.SELECT_TETRATION');
          } else {
            // if less than required disable continue and display error message with min required suites
            this.lessSuitesCount = true;
            message = this.localeService.getLocalizedString('proposal.managesuites.SUITES_MANDATORY') + this.appDataService.noOfMandatorySuitesrequired + this.localeService.getLocalizedString('proposal.managesuites.SUITES_SELECTION');
          }
        } else {
          this.lessSuitesCount = false;
        }

        // display custom error msg in msg object
        if (this.lessSuitesCount) {
          if (!this.appDataService.persistErrorOnUi) {
            this.appDataService.persistErrorOnUi = true;
          }
          this.messageService.displayMessages(this.appDataService.setMessageObject(message, MessageType.Error), true)
        }
      }

      //this.priceEstimationService.setMessages(response.data.messages);
      const priceEstimateRes = response.data;
      const suiteIds = [];
      if (response.data.suites) {
        if (this.appDataService.archName === this.constantsService.SECURITY) {
          this.configStatus = response.data.configStatus;
          setTimeout(() => {
            this.gridOptions.api.setHeaderHeight(45);
          }, 0);
        }
        let nonOrderableMessagesMap = new Map();
        if(priceEstimateRes.nonOrderableMessages && priceEstimateRes.nonOrderableMessages.length){
          nonOrderableMessagesMap =  new Map(priceEstimateRes.nonOrderableMessages.map(i => [i.suiteId, i]));
        }
        const suites = priceEstimateRes.suites;
        if (this.appDataService.archName !== this.constantsService.SECURITY) {
          const suitesLength = suites.length;
          for (let i = 0; i < suitesLength; i++) {
            const suiteObj = suites[i];
            suiteIds.push(suiteObj.suiteId);
            if (suiteObj.enableGroupHeader){ // check groupheader and set grouping for DC Suites
              this.priceEstimationService.prepareGroupsForSecurity(suites, this.suiteLineItemMap,
                suiteIds, this.suiteGroupLineItemMap);
            } else {
            if (suiteObj.lineItems) {
              const children = [];
              const lineItems = suiteObj.lineItems;
              const lineItemsLength = lineItems.length;
              for (let j = 0; j < lineItemsLength; j++) {
                children.push(lineItems[j]);
                this.suiteLineItemMap.set(lineItems[j].suiteId + lineItems[j].lineItemId, lineItems[j]);
              }
              delete suiteObj.lineItems;
              suiteObj.children = children;
            }
          }
          }
          if(suiteIds.includes(51) && !this.appDataService.roadMapPath){
            this.appDataService.persistErrorOnUi = true;
            this.messageService.displayMessages(this.appDataService.setMessageObject(
              this.localeService.getLocalizedMessage('proposal.managesuites.DC_APPD_SELECTED'), MessageType.Info), true);
          }
          if(suiteIds.includes(52) && !this.appDataService.roadMapPath){
            this.appDataService.persistErrorOnUi = true;
            this.messageService.displayMessages(this.appDataService.setMessageObject(
              this.localeService.getLocalizedMessage('proposal.managesuites.DC_THOUSANDEYE_SELECTED'), MessageType.Info), true);
          }
        } else {
          this.suiteGroupLineItemMap.clear();
          this.priceEstimationService.selectedSuiteGroupLineItemMap.clear();
          // Below condition is added for grouping in case of security.
          this.priceEstimationService.prepareGroupsForSecurity(suites, this.suiteLineItemMap,
            suiteIds, this.suiteGroupLineItemMap);
        }
        this.rowData = suites;
        if (this.appDataService.archName === this.constantsService.SECURITY) {
          for (let i = 0; i < this.rowData.length; i++) {
            if(nonOrderableMessagesMap){
              this.rowData[i]["nonOrderableMessages"] = nonOrderableMessagesMap.get(this.rowData[i]["suiteId"])
            }
            this.rowData[i]["id"] = i.toString();
            if (this.rowData[i]["children"]) {
              for (let j = 0; j < this.rowData[i]["children"].length; j++) {
                const v = (this.rowData[i]["children"][j].id =
                  i.toString() + "." + j.toString());
                this.rowData[i]['children'][j]['advancedEaQtyManuallyUpdated'] = 0;
              }
            }
          }
        } else {
          this.priceEstimationService.dnaRampDiscount = [];
          const suiteLevelRampDiscount = response.data.suiteLevelRampDiscount;
          for (let i = 0; i < this.rowData.length; i++) {
            if(nonOrderableMessagesMap){
              this.rowData[i]["nonOrderableMessages"] = nonOrderableMessagesMap.get(this.rowData[i]["suiteId"])
            }
            this.rowData[i]["id"] = i.toString();
            let selectedValue = 100;
            if (suiteLevelRampDiscount && (suiteLevelRampDiscount[this.rowData[i]['suiteId']] || suiteLevelRampDiscount[this.rowData[i]['suiteId']] === 0)) {
              selectedValue = suiteLevelRampDiscount[this.rowData[i]['suiteId']];
            }
            const suiteDialDownRampObj = {
              'rampPromoMin:': 0,
              'rampPromoMax:': 100,
              'selectedValue': selectedValue,
              'suiteId': this.rowData[i]['suiteId'],
              'suiteName': this.rowData[i]['suiteName']
            };
            this.priceEstimationService.dnaRampDiscount.push(suiteDialDownRampObj);
            if (this.rowData[i]["children"]) {
              for (let j = 0; j < this.rowData[i]["children"].length; j++) {
                const v = (this.rowData[i]["children"][j].id =
                  i.toString() + "." + j.toString());
                this.rowData[i]['children'][j]['advancedEaQtyManuallyUpdated'] = 0;
              }
            }
          }
          // check and filter rampDiscount to show only DCN suite if DC arch
          if(this.appDataService.archName === this.constantsService.DC){
            this.priceEstimationService.dnaRampDiscount = this.priceEstimationService.dnaRampDiscount.filter(data => data.suiteId === 17)
          }
        }

        if (suiteIds.includes(this.constantsService.ACI_SUITE_ID) || suiteIds.includes(this.constantsService.CC_SUITE_ID)) {
          this.aci_cc_suitesPresent = true;
        } else {
          this.aci_cc_suitesPresent = false;
        }
        if (this.partnerLedFlow && !this.appDataService.roadMapPath && !this.proposalDataService.cxProposalFlow) {
          this.checkPurchaseAuthorization(this.appDataService.purchaseOptiponsData, suiteIds);
        }
      }
      this.priceEstimateData = this.rowData;
      if (this.gridOptions.api) {
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.redrawRows();
      }

      delete priceEstimateRes.suites;
      this.pinnedResult = priceEstimateRes;
      if (priceEstimateRes && priceEstimateRes.postPurchaseAdjustmentNetTotalAmount && this.appDataService.archName !== this.constantsService.SECURITY) {
        //For other than Security architecture
        this.priceEstimationService.eaValue = priceEstimateRes.postPurchaseAdjustmentNetTotalAmount;
      } else if (priceEstimateRes && priceEstimateRes.netTcvPostAdjustment && this.appDataService.archName === this.constantsService.SECURITY) {
        //For security architecture
        this.priceEstimationService.eaValue = priceEstimateRes.netTcvPostAdjustment;
        setTimeout(() => {
          this.gridOptions.api.setHeaderHeight(45);
        }, 0);
      }
      else {
        this.priceEstimationService.eaValue = "";
      }

      this.setTopPinedData();
      if (this.proposalDataService.punchoutFromConfig) {
        this.getReadOnlyMode(); // get read only mode
        if (!this.readOnlyMode) { // if not read only mode expand grid
          setTimeout(() => {
            this.gridApi.forEachNode(node => {
              if (node.level === 0) { // expand root only level === 0 
                node.setExpanded(true);
              }
            });
          }, 200);
        }
      }
      return this.rowData;
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }

    // check the suites from response are mandatory
    function isMandatory(element) {
      return (element.qualified === true);
    }

  }


  // getRowData2(){ 
  //   this.priceEstimationService.getRowData2().subscribe((response:any) =>{
  //     if(response){
  //       if(response.messages && response.messages.length > 0){
  //         this.messageService.displayMessagesFromResponse(response);
  //       }

  //       if (!response.error) {
  //         try {
  //           this.rowData = response;
  //           for (let i = 0; i < this.rowData.length; i++) {
  //             this.rowData[i]['id'] = i.toString();
  //             if (this.rowData[i]['children']) {
  //               for (let j = 0; j < this.rowData[i]['children'].length; j++) {
  //                 const v = this.rowData[i]['children'][j].id = i.toString() + '.' + j.toString();
  //               }
  //             }
  //           }
  //           this.gridOptions.api.setRowData(this.rowData);
  //           setTimeout(() => {
  //             this.utilitiesService.setTableHeight();
  //           });

  //         } catch (error) {
  //           console.error(error.ERROR_MESSAGE);
  //           this.messageService.displayUiTechnicalError(error);
  //         }
  //       }
  //       else {
  //         this.messageService.displayMessagesFromResponse(response);
  //       }
  //   }
  //   });
  // }

  // getDefaultColumnDefs(): ColDef {
  //   return {
  //     width: 150,
  //     editable: true, // feild is editable
  //     suppressMenu: true, // No pinned menu will be shown
  //     enableRowGroup: true
  //   };
  // }

  // getDefaultColGroupDef(): ColGroupDef {
  //   return {
  //     children: []
  //   };
  // }
  //  numberValueParser(params) {
  //   return Number(params.newValue);
  // }

  //  formatNumber(number) {
  //   const tmpNumber = Math.floor(number);
  //   return !isNaN(tmpNumber) ? tmpNumber.toString()
  //     .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : 0;
  // }
  // getColumnTypes() {
  //   return {
  //     'nonEditableColumn': { editable: false },
  //     'numberParse': {
  //       valueParser: this.numberValueParser,
  //       valueFormatter: (params: any) => {
  //         return '' + this.formatNumber(params.value);
  //       }
  //     }
  //   };
  // }

  setTopPinedData() {
    const result = {
      name: "Grand Total",
      foundationEaQty: 0,
      advancedEaQty: 0,
      subscription: 0,
      postPurchaseAdjustmentNetSoftwarePrice: 0,
      postPurchaseAdjustmentNetServicePrice: 0,
      softwarePurchaseAdjustments: 0,
      ibQuantity: 0,
      advantageEaQty: 0,
      ecsEaQty: 0,
      essentialsEaQty: 0,
      postPurchaseAdjustmentNetTotalAmount: 0,
      softwareDiscount: 0,
      subscriptionDiscount: 0,
      swssDiscount: 0,
      purchaseAdjustmentNetSoftwarePrice: 0,
      purchaseAdjustmentNetTotalAmount: 0,
      purchaseAdjustmentNetServicePrice: 0,
      dcSubscriptionEaQty: 0,
      purchaseAdjustment: 0
    };
    //   this.gridApi.forEachNode((node) => {
    //     const data = node.data;
    //      if (typeof data.foundationEaQty === 'number') {
    //       result.foundationEaQty += data.foundationEaQty;
    //     }
    //     if (typeof data.advancedEaQty === 'number') {
    //       result.advancedEaQty += data.advancedEaQty;
    //     }
    //     if (typeof data.subscription === 'number') {
    //       result.subscription += data.subscription;
    //     }
    //     if (typeof data.postPurchaseAdjustmentNetSoftwarePrice === 'number') {
    //       result.postPurchaseAdjustmentNetSoftwarePrice += data.postPurchaseAdjustmentNetSoftwarePrice;
    //     }
    //     if (typeof data.postPurchaseAdjustmentNetServicePrice === 'number') {
    //       result.postPurchaseAdjustmentNetServicePrice += data.postPurchaseAdjustmentNetServicePrice;
    //     }
    //     if (typeof data.ibQuantity === 'number') {
    //       result.ibQuantity += data.ibQuantity;
    //     }
    //     if (typeof data.advantageEaQty === 'number') {
    //       result.advantageEaQty += data.advantageEaQty;
    //     }
    //     if (typeof data.ecsEaQty === 'number') {
    //       result.ecsEaQty += data.ecsEaQty;
    //     }
    //     if (typeof data.essentialsEaQty === 'number') {
    //       result.essentialsEaQty += data.essentialsEaQty;
    //     }
    //     if (typeof data.swssDiscount === 'number') {
    //       result.swssDiscount += data.swssDiscount;
    //     }
    //     if (typeof data.softwareDiscount === 'number') {
    //       result.softwareDiscount += data.softwareDiscount;
    //     }
    //     if (typeof data.subscriptionDiscount === 'number') {
    //       result.subscriptionDiscount += data.subscriptionDiscount;
    //     }
    //     if (typeof data.postPurchaseAdjustmentNetTotalAmount === 'number') {
    //       result.postPurchaseAdjustmentNetTotalAmount += data.postPurchaseAdjustmentNetTotalAmount;
    //     }
    //     if (typeof data.purchaseAdjustmentNetServicePrice === 'number') {
    //       result.purchaseAdjustmentNetServicePrice += data.purchaseAdjustmentNetServicePrice;
    //     }
    //     if (typeof data.purchaseAdjustmentNetSoftwarePrice === 'number') {
    //       result.purchaseAdjustmentNetSoftwarePrice += data.purchaseAdjustmentNetSoftwarePrice;
    //     }
    //     if (typeof data.purchaseAdjustmentNetTotalAmount === 'number') {
    //       result.purchaseAdjustmentNetTotalAmount += data.purchaseAdjustmentNetTotalAmount;
    //     }
    // });
    if (Object.keys(this.pinnedResult).length > 0) {
      this.pinnedResult["name"] = "Grand Total";
      this.gridApi.setPinnedTopRowData([this.pinnedResult]);
    } else {
      this.gridApi.setPinnedTopRowData([result]);
    }
  }

  updateAdvanced(suiteId, advancedDeployment) {
    for (let i = 0; i < this.rowData.length; i++) {
      if (this.rowData[i]["suiteId"] === suiteId) {
        const childrenAry = this.rowData[i].children;
        for (let j = 0; j < childrenAry.length; j++) {
          childrenAry[j]["advancedEaQtyManuallyUpdated"] = advancedDeployment;
          if (childrenAry[j]["advancedEaQtyEditable"] && childrenAry[j]["advancedEaQtyManuallyUpdated"] !== -1) {
            let x = (advancedDeployment / 100) * childrenAry[j]['foundationEaQty'];
            childrenAry[j]['advancedEaQty'] = Math.ceil(x);
            childrenAry[j].lineItemUpdated = true;
            //  childrenAry[j].eaAdvancedManuallyUpdated = false;        
          }
        }
      }
    }
    //  this.refreshGridEmitter.emit(this.rowData);    
  }


  // autoGroupColumnDef() {
  //   return {
  //     headerName: 'Suites',
  //     field: 'lineItemId',
  //     width: 350,
  //     suppressMenu: true,
  //     cellRenderer: 'agGroupCellRenderer',
  //     cellRendererParams: {
  //       innerRenderer: 'groupCellRender',
  //       suppressDoubleClickExpand: true,
  //       bsModalRef: this.bsModalRef,
  //       modalService: this.modalService
  //     }
  //   };
  // }



  // getTitleWithButton(): ITitleWithButtons {
  //   return {
  //     title: '',
  //     baseClass: "",
  //     parentClass: "col-xs-12 col-md-4 paddingL0 create",
  //     rootClass: "flexible-div topActionsBar",
  //     buttonParentClass: "qualify-btn float-right",
  //     buttonDivisionClass: "col-xs-12 col-md-8 paddingL0 pr-0",
  //     buttons: [
  //       {
  //         name: "Apply Discount",
  //         attr: false,
  //         buttonClass: "btn btn-secondary",
  //         parentClass: "viewProspect",
  //         click: () => {
  //           this.openDiscountModal();
  //         }
  //       },
  //       {
  //         name: "Recalculate All",
  //         attr: true,
  //         buttonClass: "btn btn-secondary",
  //         parentClass: "viewProspect",
  //         click: () => {
  //           this.recalculateData();
  //         }
  //       },
  //       {
  //         name: "Proposal List",
  //         attr: false,
  //         buttonClass: "btn btn-secondary",
  //         parentClass: "viewProspect mr-0",
  //         click: () => {
  //           this.openProposalList();
  //         }
  //       },
  //       {
  //         name: "Back",
  //         attr: false,
  //         buttonClass: "btn btn-secondary btn-back",
  //         parentClass: "viewProspect btn-sep",
  //         click: () => {
  //           if (this.priceEstimationService.isContinue) {
  //             const modalRef = this.modalVar.open(TcoWarningComponent, {
  //               windowClass: "infoDealID"
  //             });
  //             modalRef.result.then(result => {
  //               if (result.continue === true) {
  //                 this.priceEstimationService.recalculatePrice(this.roadMap.eventWithHandlers.back);
  //               } else {
  //                 this.priceEstimationService.isContinue = false;
  //                 this.roadMap.eventWithHandlers.back();
  //               }
  //             });
  //           } else {
  //             this.roadMap.eventWithHandlers.back();
  //           }
  //         }
  //       },
  //       {
  //         name: "Continue",
  //         attr: false,
  //         buttonClass: "btn btn-primary btn-continue",
  //         parentClass: "viewProspect",
  //         click: () => {
  //           if (this.priceEstimationService.isContinue) {
  //             const modalRef = this.modalVar.open(TcoWarningComponent, {
  //               windowClass: "infoDealID"
  //             });
  //             modalRef.result.then(result => {
  //               if (result.continue === true) {
  //                 this.priceEstimationService.recalculatePrice(this.roadMap.eventWithHandlers.continue);
  //               } else {
  //                 this.priceEstimationService.isContinue = false;
  //                 this.roadMap.eventWithHandlers.continue();
  //               }
  //             });
  //           } else {
  //             this.roadMap.eventWithHandlers.continue();
  //           }
  //         }
  //       }
  //     ]
  //   };
  // }

  back() {
    if (this.priceEstimationService.isContinue) {
      const modalRef = this.modalVar.open(TcoWarningComponent, {
        windowClass: "infoDealID"
      });
      modalRef.result.then(result => {
        if (result.continue === true) {
          // passing confirm Type 'back' and api call to recalculate
          this.confirmType = 'BACK';
          this.recalculateData();
        } else {
          this.priceEstimationService.isContinue = false;
          this.roadMap.eventWithHandlers.back();
        }
      });
    } else {
      this.roadMap.eventWithHandlers.back();
      this.headerService.exitFullScreenView();
      this.utilitiesService.sendMessage(true);
    }
  }

  continue() {
    // enable continue if Ro super user and no read-write access to propsoal of DC architecture & in readonly view 

    // if (this.appDataService.archName === 'C1_DC' && !this.appDataService.roadMapPath && this.appDataService.isReadWriteAccess && (!this.appDataService.userInfo.roSuperUser || this.appDataService.userInfo.roSuperUser))
    // //Becuase for DNA there should  no be any condition for number of suites selected
    // {
    //   if (this.proposalDataService.proposalDataObject.noOfSuites < 2 && this.proposalDataService.proposalDataObject.existingEaDcSuiteCount === 0) {
    //     this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('proposal.managesuites.MIN_DC_SUITES_ERROR'), MessageType.Error));
    //     return;
    //   }
    // } 

    // if user is RO Super User and not part of cisco team allow to continue if qual in progress
    if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
      this.roadMap.eventWithHandlers.continue();
      return;
    }
    // if values are changed/added in cells, while continue open modal and recalculate
    if (this.priceEstimationService.isContinue) {
      const modalRef = this.modalVar.open(TcoWarningComponent, {
        windowClass: "infoDealID"
      });
      modalRef.result.then(result => {
        if (result.continue === true) {
          // passing confirm Type 'continue' and api call to recalculate
          this.confirmType = 'CONTINUE';
          this.recalculateData();
        } else {
          this.priceEstimationService.isContinue = false;
          this.roadMap.eventWithHandlers.continue();
        }
      });
    } else {
      this.roadMap.eventWithHandlers.continue();
      this.headerService.exitFullScreenView();
      this.utilitiesService.sendMessage(true);
    }
    // if(!this.isErrorAtSuiteLevel){
    //    if (this.priceEstimationService.isContinue) {
    //      const modalRef = this.modalVar.open(TcoWarningComponent, {
    //        windowClass: "infoDealID"
    //      });
    //     modalRef.result.then(result => {
    //        if (result.continue === true) {
    //          // passing confirm Type 'continue' and api call to recalculate
    //         this.confirmType = 'CONTINUE';
    //         this.recalculateData();
    //        } else {
    //          this.priceEstimationService.isContinue = false;
    //          this.roadMap.eventWithHandlers.continue();
    //        }
    //      });
    //    } else {
    //     this.roadMap.eventWithHandlers.continue();
    //     this.headerService.exitFullScreenView();
    //     this.utilitiesService.sendMessage(true);
    //   }
    // } // allow if error is present and value is changed
    // else if (this.isErrorAtSuiteLevel && this.isChange) {
    //   const modalRef = this.modalVar.open(TcoWarningComponent, {
    //     windowClass: "infoDealID"
    //   });
    //   modalRef.result.then(result => {
    //     if (result.continue === true) {
    //       // passing confirm Type 'continue' and api call to recalculate
    //       this.confirmType = 'CONTINUE';
    //       this.recalculateData();
    //     } else {
    //       this.priceEstimationService.isContinue = false;
    //       this.roadMap.eventWithHandlers.continue();
    //     }
    //   });
    // } else if(this.isErrorAtSuiteLevel && (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess)){
    //   this.priceEstimationService.isContinue = false;
    //   this.roadMap.eventWithHandlers.continue();
    // }
  }

  close() {

    this.showMessage = false;
    //Saving show message in local storage 
    localStorage.setItem(this.constantsService.KEY_SHOWMESSAGE, this.constantsService.FALSE);
    // setTimeout(() => {
    //   this.utilitiesService.setTableHeight();
    // });
  }

  openDiscountModal(value) {
    // tslint:disable-next-line:max-line-length
    let initialState;
    let classModal;
    if (value === 'rewamp') {
      initialState = { message: value, title: 'Dial down RAMP', rampCreditDetails: this.rampCreditDetails };
      classModal = 'rewamp-modal';
    } else {
      initialState = { message: value, title: 'Discount Parameters' };
      classModal = 'modal-sm discount-parameter'
    }
    this.bsModalRef = this.modalService.show(
      DiscountParameterComponent,
      Object.assign({ class: classModal, ignoreBackdropClick: true, initialState })
    );
    this.bsModalRef.content.closeBtnName = "Close";
  }

  updateEQtyList(event, value, isAdvancedChanged) {

    // this.priceEstimationService.createEaQtyList();


    // for (let i = 0; i < this.titleWithButton.buttons.length; i++) {
    //   this.titleWithButton.buttons[1].attr = false;
    // }
  }

  // updatehw(index, value, field, event, isAdvancedChanged, suiteId, lineItemId) {
  //   console.log(event.data);
  //   value = +value;
  //   for (let i = 0; i < this.titleWithButton.buttons.length; i++) {
  //     this.titleWithButton.buttons[2].attr = true;
  //   }
  //   this.messageService.clear();
  //   //this.priceEstimationService.suiteDiscounts.forEach(suiteDisc => {
  //     let arr = [];
  //     let arrFoundationDisc = [];
  //     this.priceEstimationService.suiteDiscounts.forEach(suiteDisc => {
  //       arr.push(suiteDisc.suiteId);
  //       arrFoundationDisc.push(suiteDisc.advancedDeployment);
  //     });
  //     if(arr.includes(event.data.suiteId)){
  //       let i = arr.indexOf(event.data.suiteId);
  //       if ((event.data.suiteId === 1 || event.data.suiteId === 3 || event.data.suiteId === 5) && field === 'advancedEaQty') {
  //         if (value >= ((arrFoundationDisc[i] / 100) * event.data.foundationEaQty) &&
  //               value <=event.data.foundationEaQty) {           
  //           for (let i = 0; i < this.rowData.length; i++) {
  //             if (this.rowData[i]["suiteId"] === suiteId) {
  //               let childrenAry = this.rowData[i].children;
  //               for (let j = 0; j < childrenAry.length; j++) {
  //                 if (childrenAry[j]["lineItemId"] == lineItemId) {
  //                   childrenAry[j][field] = value;
  //                 }
  //               }
  //             }
  //           }
  //           // this.gridApi.setRowData(this.priceEstimateData);
  //           this.updateEQtyList(event, value, isAdvancedChanged);
  //         }
  //         else{
  //           this.messageService.displayUiTechnicalError(true);
  //         }
  //       } else { //} if(suiteDisc.suiteName === event.data.suiteName && field === 'foundationEaQty'){
  //         for (let i = 0; i < this.rowData.length; i++) {
  //           if (this.rowData[i]["suiteId"] === suiteId) {
  //             let childrenAry = this.rowData[i].children;
  //             for (let j = 0; j < childrenAry.length; j++) {
  //               if (childrenAry[j]["lineItemId"] == lineItemId) {
  //                 childrenAry[j][field] = value;
  //               }
  //             }
  //           }
  //         }
  //         // this.gridApi.setRowData(this.priceEstimateData);
  //         this.updateEQtyList(event, value, isAdvancedChanged);        
  //       }
  //     }

  //  // });



  // }



  updatehw(index, value, field, event, isAdvancedChanged, suiteId, lineItemId) {
    /* for (let i = 0; i < this.rowData.length; i++) {
       if (this.rowData[i]["suiteId"] === suiteId) {
         const childrenAry = this.rowData[i].children;
         for (let j = 0; j < childrenAry.length; j++) {
           if (childrenAry[j]["lineItemId"] == lineItemId) {
             childrenAry[j][field] = value;
             childrenAry[j].lineItemUpdated = true;
             this.priceEstimationService.isContinue = true;
             this.disableRecalculate = false;
             this.requestIBA = false;
           }
         }
       }*/
    const lineItem = this.suiteLineItemMap.get(suiteId + lineItemId);
    if (lineItem) {
      lineItem[field] = value;
      lineItem.lineItemUpdated = true;
      this.priceEstimationService.isContinue = true;
      //this.recalculateAllEmitter.emit(this.priceEstimationService.isContinue);
      //this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('price.est.RECALCULATE_ALL'), MessageType.Error),true);
      this.disableRecalculate = false;
      // assigning ischange to true if any value is changed in grid
      this.requestIBA = false;

      // if roSuperUser = true, disable Recalculate All, stop modal for continue button  
      if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
        this.disableRecalculate = true;
        this.priceEstimationService.isContinue = false;
        this.requestIBA = true;
      } else if (this.appDataService.roadMapPath) {
        this.disableRecalculate = true;
        this.priceEstimationService.isContinue = false;
        this.requestIBA = true;
      }
    }
    this.gridOptions.api.redrawRows();
    //this.updateEQtyList(event, value, isAdvancedChanged);
  }


  updateExpansionQty(lineItemId, productTypeId, groupName, suiteId, selectedCount, multipleSelection) {
    const key = groupName + '-' + productTypeId + '-' + suiteId;
    const lineItemArray = this.suiteGroupLineItemMap.get(key);
    if (lineItemArray) {
      if (multipleSelection) {
        for (let i = 0; i < lineItemArray.length; i++) {
          const lineItem = lineItemArray[i];
          if (lineItem['lineItemId'] === lineItemId) {
            lineItem['eaQuantity'] = 0;
            lineItem.lineItemUpdated = true;
            break;
          }
        }
        this.priceEstimationService.selectedSuiteGroupLineItemMap.set(key, (selectedCount - 1));
      } else {
        for (let i = 0; i < lineItemArray.length; i++) {
          const lineItem = lineItemArray[i];
          lineItem.lineItemUpdated = true;
          if (lineItem['lineItemId'] === lineItemId) {
            lineItem['eaQuantity'] = 1;
          } else {
            lineItem['eaQuantity'] = 0;
          }
        }
      }
      this.priceEstimationService.isContinue = true;
      this.disableRecalculate = false;
      // assigning ischange to true if any value is changed in grid
      this.requestIBA = false;

      // if roSuperUser = true, disable Recalculate All, stop modal for continue button  
      if (this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) {
        this.disableRecalculate = true;
        this.priceEstimationService.isContinue = false;
        this.requestIBA = true;
      } else if (this.appDataService.roadMapPath) {
        this.disableRecalculate = true;
        this.priceEstimationService.isContinue = false;
        this.requestIBA = true;
      }
    }
    this.gridOptions.api.redrawRows();
  }


  recalculateData(forcedReprice = false) {
    this.blockUiService.spinnerConfig.customBlocker = true;
    // this.appDataService.setActiveClassValue();
    const expanndedArr = [];

    // to emit value as true for 1st msg on custom loader
    this.appDataService.peRecalculateMsg.isConfigurationDone = true;

    this.gridApi.forEachNode(node => {
      if (node.expanded) {
        expanndedArr.push(node);
      }
    });
    this.appDataService.persistErrorOnUi = false;
    this.messageService.clear();

    this.priceEstimationService.createEaQtyList(this.rowData)

    // to emit value as true for 2nd msg on custom loader
    this.appDataService.peRecalculateMsg.isValidationDone = true;

    this.priceEstimationService.recalculateAll(forcedReprice).subscribe((response: any) => {
      if (response) {
      
        this.priceEstimationService.eaQtyList = []; //Set ea Quantity array to blank before recalculate
        // to emit value as true for 3rd msg on custom loader
        this.appDataService.peRecalculateMsg.isComputingDone = true;

        if (response.messages && response.messages.length > 0) {
          this.appDataService.persistErrorOnUi = true;
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
         //If user edit proposal date, update request date's due error accord to user selection
         if (response.data.requestStartDateCurrDate) {
         this.isRequestStartDateDue = response.data.requestStartDateCurrDate;
        } else {
          this.isRequestStartDateDue = false;
        }
          // getting the method for purchaseAdjustmentException
          this.priceAdjustmentException(response);  

          //update rampCreditDetails after recal.
          if (response.data.rampCreditDetails) {
            this.rampCreditDetails = response.data.rampCreditDetails;
          }


          //Set threshold exception approvar flag 
          this.thresholdApprovalException(response);
          //check customer and partner geoid
          this.setCustomerPartnerGEOID(response);

          //check if partner deal
          this.isPartnerDeal(response);
          //Unsigned loCC
          this.loCCSignedCheck(response);

          this.loccOptionalCheck(response);

          this.checkPremierForWireless(response);

          this.loccRequiredCheck(response);
          
          //Show change subscription message
          this.showChangeSubscription(response);


          this.dnaMaxSubscriptionDiscountApproval(response);

          // method to set and show diaDown ramp button
          this.showDialDownRamp(response);

          // method to set overridemsdcounts
          this.setOverrideMsdCounts(response);

          // method to show restore PA butoon
          this.setRestorePa(response);

          this.getRowData(response);
          //this.gridApi.setRowData();
          this.gridOptions.getRowClass = params => {

            let cssClass = this.manageRowClass(params);
            return cssClass;

          };
          this.setTopPinedData();
          this.priceEstimationService.isContinue = false;
          setTimeout(() => {
            this.gridApi.forEachNode(node => {
              for (let i = 0; i < expanndedArr.length; i++) {
                if (node.data.name === expanndedArr[i].data.name) {
                  node.setExpanded(true);
                }
              }
            });
          }, 100);
          this.checkIntitatePaRequest();// method to check and set request for PA checkbox
        }
        // reset the value of green ticks on custom loader
        this.appDataService.setActiveClassValue();
      }
    });

    this.disableRecalculate = true;
  }


  //copy of recal. data for config
  config(suiteId = null) {
    this.appDataService.persistErrorOnUi = false;
    this.messageService.clear();
    const contextPath = window.location.origin + '/app/#/';

    this.priceEstimationService.config(suiteId, contextPath).subscribe((response: any) => {
      if (response) {
        if (response.messages && response.messages.length > 0) {
          this.appDataService.persistErrorOnUi = true;
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
          let configUIRequest = `{"payloadId": "${response.payloadId}", "responseFormat": "XML"}`;
          this.configUIRequest.setValue(configUIRequest);//this.payloadId.setValue(response.data.payloadId);
          //this.responseFormat.setValue('XML');//this.requestFormat.setValue(response.data.responseFormat);
          //to submit form
          // this.blockUiService.spinnerConfig.blockUI();
          if (!this.proposalDataService.configPunchoutUrl) {
            this.proposalDataService.getConfigURL().subscribe((res: any) => {
              if (res.value) {
                this.proposalDataService.configPunchoutUrl = res.value;
                document.forms[0].method = 'post';
                document.forms[0].action = this.proposalDataService.configPunchoutUrl;
                document.forms[0].submit();
              }
            });
          } else {
            document.forms[0].method = 'post';
            document.forms[0].action = this.proposalDataService.configPunchoutUrl;
            document.forms[0].submit();
          }


        }
      }
    });

    this.disableRecalculate = true;
    // this.isChange = false;
  }

  openProposalList() {
    if (this.priceEstimationService.isContinue) {
      const modalRef = this.modalVar.open(TcoWarningComponent, {
        windowClass: "infoDealID"
      });
      modalRef.result.then(result => {
        if (result.continue === true) {
          this.priceEstimationService.recalculateAll(true)
            .subscribe((response: any) => {
              if (response) {
                if (response.messages && response.messages.length > 0) {
                  this.appDataService.persistErrorOnUi = true;
                  this.priceEstimationService.messageService.displayMessagesFromResponse(
                    response
                  );
                }
                if (!response.error) {
                  this.priceEstimationService.recalculateAllEmitter.emit(
                    true
                  );
                  if (
                    this.priceEstimationService.proposalDataService.proposalDataObject
                      .proposalData.status ===
                    this.priceEstimationService.constantsService.QUALIFICATION_COMPLETE
                  ) {
                    this.priceEstimationService.createProposalService.updateProposalStatus();
                  }
                  this.priceEstimationService.isContinue = false;
                  this.router.navigate(["qualifications/proposal"]);
                }
              }
            });
        } else {
          this.priceEstimationService.isContinue = false;
          this.router.navigate(["qualifications/proposal"]);
        }
      });
      if (this.appDataService.userDashboardFLow === 'userFlow') {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userProposals;
      } else {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalList;
      }
    }
    else {
      if (this.appDataService.userDashboardFLow === 'userFlow') {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userProposals;
      } else {
        this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalList;
      }
      this.router.navigate(["qualifications/proposal"]);
    }

  }

  sendIbaReport() {
    let reqJSON = {
      //"userId": this.appDataService.userId,
      "archName": this.appDataService.archName,
      "proposalId": this.proposalDataService.proposalDataObject.proposalId,
      "customerGuName": this.appDataService.customerName
    };

    this.priceEstimationService.sendIbaReport(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.copyLinkService.showMessage(this.constantsService.IB_ASSESSMENT_PROPOSAL);
          // this.customerSuccessMsg = this.constantsService.IB_ASSESSMENT_MESSAGE;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  sendTcvReport() {
    let reqJSON = {
      //"userId": this.appDataService.userId,
      "archName": this.appDataService.archName,
      "proposalId": this.proposalDataService.proposalDataObject.proposalId,
      "customerGuName": this.appDataService.customerName
    };
    this.priceEstimationService.sendTcvReport(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('docusign.TCO_COMPARISON_REPORT'));
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  hideCustomerMsg() {
    this.customerSuccessNote = false;
  }

  showFullScreen(val) {
    if (val) {
      this.utilitiesService.sendMessage(false);
    } else {
      this.utilitiesService.sendMessage(true);
    }
  }

  openDownloadModal() {
    const modalRef = this.modalVar.open(DownloadRequestComponent, {
      windowClass: "download-request"
    });
  }

  mouseleave(event) {
    this.arrayOfErrorMessages = [];
  }


  exportProposal() {
    this.priceEstimationService.exportProposal().subscribe((response: any) => {
      this.generateFileName(response);
    });
  }


  generateFileName(res) {
    let x = res.headers.get("content-disposition").split('=');
    let filename = x[1];//res.headers.get("content-disposition").substring(x+1) ;   
    filename = filename.replace(/"/g, '')
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) //IE & Edge
    {
      //msSaveBlob only available for IE & Edge        
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = this.downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }

  //This method is use display suite info in guide me section
  displaySuiteInfo(suiteId) {
    if (!this.guideMeService.guideMeText) {
      this.guideMeService.getGuideMeData(suiteId).subscribe((res: any) => {
        this.guideMeService.guideMeText = true;
        if (res && !res.error) {
          try {
            // this.label = res.data.contextHeader.label;
            //this.features = res.data.features;
            //this.guideMeService.guideMeText = true;
            this.guideMeService.displaySuiteInfoEmitter.emit(res.data);
          } catch (error) {
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      this.guideMeService.guideMeText = false;
    }

  }

  mouseEnter(event, val) {
    if (val === 'error') {
      this.showAllError = true;
    } else {
      this.showAllWarning = true;
    }

  }

  mouseLeave(event) {
    this.showAllError = false;
    this.showAllWarning = false;
  }

  // to check if requet for PA has made and make the checkbox to checked
  checkIntitatePaRequest() {
    this.priceEstimationService.paInitStatus().subscribe((res: any) => {
      if (res && !res.error) {
        this.requestPa = res.data;// data may be true or false
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  // method to set and call request for purchse adj
  initiateReqPurchaseAdj(event) {
    let type = 'INITIATE';
    this.requestPa = !this.requestPa;
    if (!this.requestPa) { // in checked set type to inititate else to cancel
      type = 'CANCEL';
    }

    this.priceEstimationService.requestForPa(type).subscribe((res: any) => {
      if (res && !res.error) {
        // check for response and set respective toast messages
        if (this.requestPa) {
          this.copyLinkService.showMessage('You have successfully initiated the request for purchase adjustment');
        } else {
          this.copyLinkService.showMessage('You have successfully cancelled the request for purchase adjustment');
        }

      } else {
        // if api fails or error present, make to defualt value
        this.requestPa = !this.requestPa;
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method for restore PA Api call and on success call PE api to load data again
  restorePA() {
    const modalRef = this.modalVar.open(RestorePaWarningComponent, {
      windowClass: "infoDealID"
    });
    modalRef.result.then(result => {
      if (result.continue === true) {
        // console.log('test');
        this.priceEstimationService.restorePA().subscribe((res: any) => {
          if (res && !res.error) {
            this.loadPriceEstimateData(); // call PE api on success
          } else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });
  }

  showTooltip(tooltip) {
    const e = this.valueContainer.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }

  showAllCredits() {
    this.blockUiService.spinnerConfig.customBlocker = false;
    window.scrollTo(0,0);
    this.priceEstimationService.showCredits=true;
    
    this.renderer.addClass(document.body, 'scroll-y-none');
  }

   // Switch to service proposal
  openServiceProposal() {
    const index =  window.location.href.lastIndexOf('/')
    const url  = window.location.href.substring(0, index+1)
    window.open(url + this.proposalDataService.relatedCxProposalId + '/priceestimate','_self');
    window.location.reload()
  }

}

