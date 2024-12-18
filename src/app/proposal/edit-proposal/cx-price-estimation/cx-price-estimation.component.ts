import { RecalculateAllEmitterObj } from './../price-estimation/price-estimation.service';
import { ProposalPollerService } from './../../../shared/services/proposal-poller.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DownloadRequestComponent } from '@app/modal/download-request/download-request.component';
import { ManageServiceSpecialistComponent } from '@app/modal/manage-service-specialist/manage-service-specialist.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions, GridReadyEvent } from "ag-grid-community";
import { CxPriceEstimationService } from './cx-price-estimation.service';
import { QualSummaryService } from "@app/qualifications/edit-qualifications/qual-summary/qual-summary.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { MessageService } from "@app/shared/services/message.service";
import { ManageTeamMembersComponent } from "@app/modal/manage-team-members/manage-team-members.component";
import { EamsDeliveryComponent } from '@app/modal/eams-delivery/eams-delivery.component';
import { CxDiscountParametersComponent } from '@app/modal/cx-discount-parameters/cx-discount-parameters.component';
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { IRoadMap } from '@app/shared/road-map/road-map.model';
import { CascadeDiscountConfirmationComponent } from '@app/modal/cascade-discount-confirmation/cascade-discount-confirmation.component';
import { ConstantsService } from '@app/shared/services/constants.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { MessageType } from "@app/shared/services/message";
import { ColumnGridCellComponent } from '@app/shared/ag-grid/column-grid-cell/column-grid-cell.component';
import { PriceEstimationService } from '../price-estimation/price-estimation.service';
import { HeaderGroupComponent } from '@app/shared/ag-grid/header-group-component/header-group.component';
import { PermissionService } from '@app/permission.service';
import { PermissionEnum } from '@app/permissions';
import { ManageSuitesService } from '../manage-suites/manage-suites.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';


@Component({
  selector: 'app-cx-price-estimation',
  templateUrl: './cx-price-estimation.component.html',
  styleUrls: ['./cx-price-estimation.component.scss']
})
export class CxPriceEstimationComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  private gridApi;
  rowData: any;
  roadMap: IRoadMap;
  disableRecalculate = true;
  readonlyMode = false;
  showServiceSpecialistMessage = false;  
  public subscribers: any = {};
  pollerSubscibers : any;
  proposalCxParams: any = {}; // to set proposalcxParam
  proposalCxPriceInfo: any = {}; // to set proposalcxPriceInfo
  isCascadeApplied = false; // set if cascade discount clicked
  isDiscountDirty = false; // set if discount applied and dirty flag in response
  isLineInError = false;
  isDiscountApplied = false; // to set when discount applied
  showRequestDocuments = false;
  isChangeSubFlow = false; // to check and set change sub flow
  isShowDelistedThresholdLimitMsg = false; // set to show message if delisted IB and threshold error present
  isErrorPresent = false;
  ibPopups = false;
  nextIbPullTimeStamp = ''
  systematicIbRepullRequired = false;
  diffInDaysForSystematicIbRepull;

  constructor(public cxPriceEstimationService: CxPriceEstimationService, private route: ActivatedRoute, 
    public localeService: LocaleService, private router: Router,  private modalVar: NgbModal,
    public qualSummaryService: QualSummaryService,public qualService: QualificationsService, 
    public messageService: MessageService, public proposalDataService: ProposalDataService,
    public permissionService: PermissionService, public manageSuitesService: ManageSuitesService, public createProposalService: CreateProposalService,
    public constantsService: ConstantsService, public utiliteService: UtilitiesService, private priceEstimationService: PriceEstimationService,
    public appDataService: AppDataService, public blockUiService: BlockUiService, private proposalPollerService : ProposalPollerService,
    public eaStoreService: EaStoreService, public eaService: EaService) {
    this.gridOptions = {
      frameworkComponents: {
        columnCell: <{ new(): ColumnGridCellComponent }>(
          ColumnGridCellComponent
        ),
        headerComp: <{ new(): HeaderGroupComponent }>(
          HeaderGroupComponent)
      },
      animateRows: true,
      enableSorting: false,
      headerHeight: 45,
      onGridReady: (params: GridReadyEvent) => {
        this.gridApi = params.api;
        // this.setTopPinedData();

      },
      context: {
        parentChildIstance: this
      }
    };

   }

  ngOnInit() {

      this.proposalDataService.displayBellIcon = false; // No need to display bell Icon
    // To show service specialist message
    //this.checkIfServiceSpecialistExist();
    this.appDataService.isProposalIconEditable = true; // allow edit icon
    this.getColumnDefs();
    this.getData();
    if (this.router.url.includes('/priceestimate')) {
      const url = this.router.url.split('/priceestimate');
      history.pushState('', '',url[0]);
     
    }
    this.subscribers.headerDataLoaded = this.appDataService.headerDataLoaded.subscribe(() => {
      if (!this.proposalDataService.allow84Term && this.router.url.includes('/priceestimate')){
        this.getSuitesData(); // to get suites data, check and set allow84term
      }
    });

    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalCXPriceEstimateStep;
    this.gridOptions.suppressContextMenu = true;
   this.appDataService.hideHelpAndSupportSuject.next(false);
    this.appDataService.openCaseManagementSubject.next(true);
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);

    // Emitter subscribe when we'll changes any proposal parameter in edit proposal.
    this.subscribers.editProposalEmitter = this.priceEstimationService.recalculateAllEmitter.subscribe(
      (recalculateAllEmitter: RecalculateAllEmitterObj) => {
        this.proposalPollerService.stopPollerService();
        this.getData(true);
      });
      this.showRequestDocuments = this.permissionService.proposalPermissions.has(PermissionEnum.ProposalRequestDocuments);

      // if proposal complete or roSuperUser = true and no RW acess to pop, disable links and hide buttons  
      if ((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath) {
        this.readonlyMode = true;
      }     

    // check and set change sub flow if subscription is present
    if (this.qualService.qualification.subscription && this.qualService.subRefID && this.appDataService.displayChangeSub) {
      this.isChangeSubFlow = true;
    } else {
      this.isChangeSubFlow = false;
    }
    if (!this.proposalDataService.allow84Term && !this.router.url.includes('/priceestimate')){
      this.getSuitesData(); // to get suites data, check and set allow84term
    }
    if (!Object.keys(this.appDataService.proposalDataForWorkspace).length){
      this.proposalDataService.setProposalParamsForWorkspaceCaseInputInfo(this.proposalDataService.proposalDataObject, this.qualService.qualification.accountManagerName, this.appDataService.customerName, false);
    }
  }


  
  // To show service specialist message
  // checkIfServiceSpecialistExist() {

  //     if (this.qualService.qualification.cxTeams.length > 0) {
  //           this.showServiceSpecialistMessage =  false;
  //   }else {
  //       this.getServiceSpecialist();
  //   }
  // }
  

  // To show service specialist message
  // getServiceSpecialist() {

  //   this.qualSummaryService.getCustomerInfo().subscribe((res: any) => {
  //     if (res) {

  //       if (res.messages && res.messages.length > 0) {
  //         this.messageService.displayMessagesFromResponse(res);
  //       }
  //       if (!res.error) {
  //         try {
  //           if (res.data) {
  //             const data = res.data;
  //             if (data.cxTeams) {
  //               this.showServiceSpecialistMessage = false;
  //             } else {
  //               this.showServiceSpecialistMessage = true;
  //             }
  //           }
  //         } catch (error) {
  //           console.error(error);
  //           this.messageService.displayUiTechnicalError(error);
  //         }
  //       }
  //     }
  //   });
  // }


  getColumnDefs() {
    this.cxPriceEstimationService.getColumnDefs().subscribe((res: any) => {
      let columnDefs = res.data.columns;
      for (let i = 0; i < columnDefs.length; i++) {
        const column = columnDefs[i];
        if (column['field'] === 'parameterIcon') {
          column.cellRenderer = this.parameterRenderer.bind(this);
        } else if (column['field'] === 'description') {
          column.cellRenderer = this.supportRenderer.bind(this);
        } else if (column['field'] === 'eaDiscount' || column['field'] === 'netPricePostPA') {
          column.cellRenderer = this.discountRenderer.bind(this);
          //column.cellClass = 'warning-cell';
        }else if (column['field'] === 'suiteName') {
          column['cellRendererParams'] = {
            innerRenderer: 'columnCell'
          };
        } else if (column['headerName'] === 'One Time Discount') {//One Time Discount
          column['headerGroupComponent'] = 'headerComp';
        } 
      }
      if (this.gridOptions.api) {
        this.gridOptions.api.setColumnDefs(columnDefs);
      }
    });
  }


  checkToBillToInfo(){ 
    this.proposalDataService.checkForRedirection().subscribe((response: any) => {
      if (response && !response.error) {
        if(response.data && response.data.billToRedirectionUrl ){
          window.open(response.data.billToRedirectionUrl, '_self');
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);               
      }
    })
  }

  private prepareGridData(data,editproposalFlow=false){
    if(data.cxParam){
      this.proposalCxParams = data.cxParam; // set proposalcxParam
      this.isDiscountDirty = data.cxParam.discountDirty ? true : false;
      this.isLineInError = data.cxParam.lineInError ? true : false;
      this.systematicIbRepullRequired = data.cxParam.systematicIbRepullRequired;
      this.diffInDaysForSystematicIbRepull = data.cxParam.diffInDaysForSystematicIbRepull;
      
      if(editproposalFlow && !data.cxParam.billTo){
          this.checkToBillToInfo();
      }
    }
    this.proposalCxPriceInfo = data.priceInfo;
    this.setCxPeLineItems(data);// method to CX Minor line items in order based on product types
    this.setCxPriceEstData(data);
    this.setTopPinedData(data);
    if(this.proposalDataService.proposalDataObject.proposalData.status !== this.constantsService.COMPLETE_STATUS){
      this.getDelistedDetails(); // to check and show delisted message
    }
    this.proposalDataService.setCxFinancialSummaryData(data, [],[]); // call method to set and show financial summary 
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      if (this.isDiscountApplied && this.isCascadeApplied){
        this.isDiscountApplied = false;
      }  
      setTimeout(() => {
        this.gridOptions.api.forEachNode(node => {
          if(node.level === 0) {
            node.setExpanded(true);
          }
        })
      },500);
    }
  } 


  getData(editproposalFlow=false) {
    this.blockUiService.spinnerConfig.startChain();
    this.appDataService.persistErrorOnUi = false;
    this.messageService.clear();
    this.cxPriceEstimationService.getData().subscribe((res: any) => {
      // this.rowData = res.data;
      if(res && res.data && !res.data.error){
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
        if(res.data.message){
         this.appDataService.persistErrorOnUi = true;
          this.isErrorPresent = this.priceEstimationService.prepareMessageMapForGrid(res.data.message);
        } else {
          this.appDataService.persistErrorOnUi = false;
          this.isErrorPresent = false;
        }
        this.prepareGridData(res.data,editproposalFlow);   
        if (this.proposalCxParams.awaitingResponse) {
          this.invokePollerService();
        }     
      } else {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
        this.messageService.displayMessagesFromResponse(res.data)
      }
    });
  }


  invokePollerService(){
    this.pollerSubscibers = this.proposalPollerService.invokeGetPollerservice(this.cxPriceEstimationService.getPollerServiceUrl()).subscribe((res: any) => {
      this.blockUiService.isPollerServiceCall = false;
      if (res.data && res.data.cxParam) {
        if (!res.data.cxParam.awaitingResponse){
          this.proposalPollerService.stopPollerService();
          this.prepareGridData(res.data);
        } else if (this.proposalDataService.checkForCxGridRefresh(res.data, this.proposalCxParams, this.proposalCxPriceInfo)){
          this.prepareGridData(res.data); // call the method when data present 
        }
      }
      if(res.data && res.data.eaStartDateUpdated){
        this.createProposalService.updateHeaderStartDate();
      }
    });
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

   ngOnDestroy() {
    this.isCascadeApplied = false;
    this.isDiscountApplied = false;
    this.isDiscountDirty = false;
    this.blockUiService.isPollerServiceCall = false;
    this.appDataService.persistErrorOnUi = false;
     if( this.subscribers.editProposalEmitter){
      this.subscribers.editProposalEmitter.unsubscribe();
     }     
     this.proposalPollerService.stopPollerService();
     if(this.pollerSubscibers && this.pollerSubscibers.serviceEmitter){
      this.subscribers.serviceEmitter.unsubscribe();

     }
     if(this.subscribers.headerDataLoaded){
      this.subscribers.headerDataLoaded.unsubscribe();
     }
     this.proposalDataService.caseCreatedForCxProposal = false;
     this.proposalDataService.isProposalReopened = false;
     this.appDataService.openCaseManagementSubject.next(false);
     this.proposalDataService.clearWorkspaceCaseInputInfo();
    this.appDataService.proposalDataForWorkspace = {};
   }


  // Switch to software proposal
   openSoftwareProposal() {
    const index =  window.location.href.lastIndexOf('/')
    const url  = window.location.href.substring(0, index+1)
    // this.appDataService.archName = this.proposalDataService.relatedSoftwareProposalArchName;
    // this.proposalDataService.cxProposalFlow = false;
    window.open(url + this.proposalDataService.relatedSoftwareProposalId + '/priceestimate','_self');
    window.location.reload()
   }

  openProposalList() {
    this.router.navigate(["qualifications/proposal"]);
  }

  back(){
    this.proposalDataService.cxPeRoadMapEmitter.emit(true);
  }

  continue(){
    this.proposalDataService.cxPeRoadMapEmitter.emit(false);
  }

  onCellMouseOut(event) {
  }

  onCellMouseOver(event) {
  }

  openDownloadModal() {
    const modalRef = this.modalVar.open(DownloadRequestComponent, {
      windowClass: "download-request"
    });
  }

  openManageServiceModal() {
    const modalRef = this.modalVar.open(ManageServiceSpecialistComponent, {
      windowClass: "manage-service-specialist"
    });
  }


  // Show service specialist or manage team window
  showServiceModal() {

    // if (this.showServiceSpecialistMessage) {
    //      this.manageServiceSpecialist();
    // }else {
    this.openManageModal(this.qualService.qualification.qualID);
    //}
  }


  manageServiceSpecialist() {

   const modalRef = this.modalVar.open(ManageServiceSpecialistComponent, {
      windowClass: "manage-service-specialist"
    });
  }


  openManageModal(qualId) {//check and move in service...

    this.qualService.getCustomerInfo(qualId).subscribe((res: any) => {
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
              this.qualService.qualification.cxDealAssurerTeams = res.data.assurersTeams ? res.data.assurersTeams : [];
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
              // modalRef.componentInstance.dedicatedSalesTeam = res.data.saleSpecialist;
              if(!data.partnerDeal){
                modalRef.componentInstance.filterPartnersTeam = true;
              }
              modalRef.componentInstance.partnerId = this.proposalDataService.proposalDataObject.proposalData.partner.partnerId;
              modalRef.componentInstance.proposalId = this.proposalDataService.proposalDataObject.proposalId;
            }
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        }
      }
    });
  }

  supportRenderer(params) {
    if (params.node.rowPinned !== 'top' && params.node.level > 0) {
      const reloadIcon = '<span class="icon-reload"></span>';
      const errorIcon = '<span class="icon-error-icon"></span>';
      if(params.node.level > 0 && params.node.rowPinned !== 'top' && params.data.productType === "CX_HW_SUPPORT"){
        if (this.isLineInError) {  
          return '<div class="d-flex justify-content-between"><span class="text-link custom-tooltip-wrap ellipsis"><span class="clickProposal darkgrey-text">' +  params.value + '<div class="tooltip-custom"><span class="tooltiptext tooltip-right drop-up"><span class="arrow-right"></span>' + params.value + '</span></div></span></span>' + errorIcon + '</div>';
        } else if (this.proposalCxParams.awaitingResponse){
          return '<div class="d-flex justify-content-between"><span class="text-link custom-tooltip-wrap ellipsis"><span class="clickProposal darkgrey-text">' +  params.value + '<div class="tooltip-custom"><span class="tooltiptext tooltip-right drop-up"><span class="arrow-right"></span>' + params.value + '</span></div></span></span>' + reloadIcon + '</div>';
        }
      }
      //return params.value;
      return '<div class="d-flex justify-content-between"><span class="text-link custom-tooltip-wrap ellipsis"><span class="clickProposal darkgrey-text">' +  params.value + '<div class="tooltip-custom"><span class="tooltiptext tooltip-right drop-up"><span class="arrow-right"></span>' + params.value + '</span></div></span></span></div>';
    }
  }
  parameterRenderer(params) {
    if (params.node.level === 0) {
      const li = ((!( this.proposalCxParams.hardwareLinePricesInSync || this.proposalCxParams.discountCascadePending ) || this.appDataService.roadMapPath ) ? '<span class="text-link disabled">' : '<span class="text-link">') + "Apply Discount" + '</span>';
      return li;
    }
  }

  discountRenderer(params) {
    if (params.node.level > 0 && params.node.rowPinned !== 'top' && params.data.productType === "CX_HW_SUPPORT" && params.data.discountDirty && params.value !== undefined) {
      const val = '<span class="warning-cell d-flex justify-content-between warning-cell-inner"><span class="icon-warning1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>' + params.value + '</span>';
      return val;
    }
    return  params.value
  }

  cascadeDiscount() {
    const modalRef = this.modalVar.open(CascadeDiscountConfirmationComponent, { windowClass: 'infoDealID cascadeDiscount' });
    modalRef.result.then((result) => {
      if (result.continue === true) {
        this.cxPriceEstimationService.getCascadeDiscount().subscribe((res: any) => {
          if (res && res.data && !res.error) {
            this.isCascadeApplied = true;
            this.prepareGridData(res.data);
            this.proposalPollerService.stopPollerService();
            this.invokePollerService();
          } else {
            this.isCascadeApplied = false;
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }
    });

  }

  onCellClicked($event) {
    if ($event.colDef.field === 'parameterIcon') {
      const dropdownClass = $event.event.target.classList.value;
      const isTextclick = dropdownClass.search('text-link');
      if (isTextclick > -1) {
        const modalRef = this.modalVar.open(CxDiscountParametersComponent, {
          windowClass: "cx-discount-parameter"
        });
        modalRef.componentInstance.cxPeData = $event.data
        modalRef.result.then((result) => {
          if (result.data) {

            this.cxPriceEstimationService.saveDiscount(result.data).subscribe((res: any) => {
              if (res && !res.error) {
                this.isDiscountApplied = true; // set after discount applied
                this.isCascadeApplied = false;
                this.proposalPollerService.stopPollerService();
                // this.isDiscountDirty = true;
                this.getData();
              } else {
                this.isDiscountApplied = false;
                this.messageService.displayMessagesFromResponse(res);
              }
            });
          }
        });
      }
    }
  }

  openEamsDelivery() {
    const modalRef = this.modalVar.open(EamsDeliveryComponent, {
      windowClass: "eams-delivery"
    });
      modalRef.result.then((result) => {
      if (result.continue === true) {
        this.proposalCxParams.partnerEamsDeliveryEligible =  false;
        this.getData();
      }
    });

    modalRef.componentInstance.proposalCxParams = this.proposalCxParams;
    modalRef.componentInstance.eamsPartnerInfo =   this.proposalCxParams.eamsPartnerInfo;
    modalRef.componentInstance.selectedCiscoEams = !this.proposalCxParams.partnerEamsDelivery;
    modalRef.componentInstance.isChangeSubFlow = this.isChangeSubFlow;
  }

  setTopPinedData(pinnedResult) {
    const cxParam = pinnedResult.cxParam;
    const result = {
      suiteName: "Grand Total",
      // qty: pinnedResult.qty,
      covered: (cxParam.ibQty && cxParam.ibQty.covered) ? cxParam.ibQty.covered : '-',
      takeover: (cxParam.ibQty && cxParam.ibQty.takeover) ? cxParam.ibQty.takeover : '-',
      total: (cxParam.ibQty && cxParam.ibQty.total) ? cxParam.ibQty.total : '-',
      uncovered: (cxParam.ibQty && cxParam.ibQty.uncovered) ? cxParam.ibQty.uncovered : '-',
      productFamilyCount: cxParam.productFamilyCount ? cxParam.productFamilyCount : '-',
      extendedListPrice: (pinnedResult && pinnedResult.priceInfo) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(pinnedResult.priceInfo.extendedListPrice))) : '0.00',
      netPricePostPA: (pinnedResult && pinnedResult.priceInfo) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(pinnedResult.priceInfo.netPricePostPA))) : '0.00',
      residualCredit: (pinnedResult && pinnedResult.priceInfo) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(pinnedResult.priceInfo.residualCredit))) : '0.00',
      uncoveredCredit: (pinnedResult && pinnedResult.priceInfo) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(pinnedResult.priceInfo.uncoveredCredit))) : '0.00',
    };
    this.gridApi.setPinnedTopRowData([result]);
  }


  setCxPriceEstData(data) {
    const cxSuitesData = [];
    if (data.majorLines && data.majorLines.length) {
      const suites = data.majorLines;
      for (const suitesData of suites) {
        const record = {}
        record['atoName'] = suitesData.atoName;
        record['suiteName'] = suitesData.suiteName;
        record['configStatus'] = suitesData.configStatus;
        record['invalidConfig'] = suitesData.invalidConfig;
        // record['qty'] = suitesData.qty;
        record['qualified'] = suitesData.qualified;
        record['suiteId'] = suitesData.suiteId;
        if (suitesData.cxParam) {
          const cxParam = suitesData.cxParam;
          const priceInfo = suitesData.priceInfo;
          record['discountDirty'] = cxParam.discountDirty;
          record['productFamilyCount'] = cxParam.productFamilyCount ? cxParam.productFamilyCount : '-';
          record['uncovered'] = (cxParam.ibQty && cxParam.ibQty.uncovered) ? cxParam.ibQty.uncovered : '-';
          record['covered'] = (cxParam.ibQty && cxParam.ibQty.covered) ? cxParam.ibQty.covered : '-';
          record['takeover'] = (cxParam.ibQty && cxParam.ibQty.takeover) ? cxParam.ibQty.takeover : '-';
          record['total'] = (cxParam.ibQty && cxParam.ibQty.total) ? cxParam.ibQty.total : '-';

          record['minDiscount'] = cxParam.minDiscount ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(cxParam.minDiscount))) : 0;
          record['maxDiscount'] = cxParam.maxDiscount ? cxParam.maxDiscount : 100;
          record['discount'] = (priceInfo && priceInfo.discount) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfo.discount))) : record['minDiscount'];

          record['netPricePostPA'] = (priceInfo && priceInfo.netPricePostPA) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfo.netPricePostPA))) : '0.00';
          record['extendedListPrice'] = (priceInfo && priceInfo.extendedListPrice) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfo.extendedListPrice))) : '0.00';
          record['residualCredit'] = (priceInfo && priceInfo.residualCredit) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfo.residualCredit))) : '0.00';
          record['uncoveredCredit'] = (priceInfo && priceInfo.uncoveredCredit) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfo.uncoveredCredit))) : '0.00';
        }
        record['children'] = new Array<any>();
        if (suitesData.minorLines) {
          for (const childData of suitesData.minorLines) {
            const childRecord1 = {};
            const priceInfoChild = childData.priceInfo;
            childRecord1['description'] = childData.description;
            childRecord1['name'] = childData.name;
            childRecord1['bookingsQuantity'] = childData.bookingsQuantity;
            childRecord1['creditType'] = childData.creditType;
            childRecord1['eaExceptionFlag'] = childData.eaExceptionFlag;
            childRecord1['configStatus'] = childData.configStatus;
            childRecord1['invalidConfig'] = childData.invalidConfig;
            childRecord1['qty'] = childData.qty;
            childRecord1['qualified'] = childData.qualified;
            childRecord1['suiteId'] = childData.suiteId;

            childRecord1['extendedListPrice'] = (priceInfoChild && priceInfoChild.extendedListPrice) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.extendedListPrice))) : '0.00';
            childRecord1['eaDiscount'] = (priceInfoChild && priceInfoChild.discount) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.discount))) : 0;
            childRecord1['netPricePostPA'] = (priceInfoChild && priceInfoChild.netPricePostPA) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.netPricePostPA))) : '0.00';
            childRecord1['residualCredit'] = (priceInfoChild && priceInfoChild.residualCredit) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.residualCredit))) : '0.00';
            childRecord1['uncoveredCredit'] = (priceInfoChild && priceInfoChild.uncoveredCredit) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.uncoveredCredit))) : '0.00';

            if (childData.cxParam) {
              const cxParam = childData.cxParam
              childRecord1['discountDirty'] = cxParam.discountDirty;
              childRecord1['lineInError'] = cxParam.lineInError;
              childRecord1['productFamilyCount'] = cxParam.productFamilyCount ? cxParam.productFamilyCount : '-';
              childRecord1['uncovered'] = (cxParam.ibQty && cxParam.ibQty.uncovered) ? cxParam.ibQty.uncovered : '-';
              childRecord1['covered'] = (cxParam.ibQty && cxParam.ibQty.covered) ? cxParam.ibQty.covered : '-';
              childRecord1['takeover'] = (cxParam.ibQty && cxParam.ibQty.takeover) ? cxParam.ibQty.takeover : '-';
              childRecord1['total'] = (cxParam.ibQty && cxParam.ibQty.total) ? cxParam.ibQty.total : '-';
              childRecord1['minDiscount'] = cxParam.minDiscount ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(cxParam.minDiscount))) : 0;
              childRecord1['maxDiscount'] = cxParam.maxDiscount ? cxParam.maxDiscount : 100;
              childRecord1['weightedAvgDiscount'] = (cxParam.pricingInfo && cxParam.pricingInfo.discounts && cxParam.pricingInfo.discounts.weightedAvgDiscount) ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(cxParam.pricingInfo.discounts.weightedAvgDiscount))) : 0;
              childRecord1['discount'] = priceInfoChild.discount ? (this.utiliteService.formatValue(this.utiliteService.getFloatValue(priceInfoChild.discount))) : childRecord1['minDiscount'];

            }
            childRecord1['productType'] = childData.productType;
            record['children'].push(childRecord1);
          }
        }
        cxSuitesData.push(record);
      }
    }
    // console.log(cxSuitesData)
    this.rowData = cxSuitesData;
  }

  // method to CX Minor line items in order based on product types
  setCxPeLineItems(data) {
    if (data.majorLines && data.majorLines.length){
      const suites = data.majorLines;
      for (const data of suites){
        const hwMinorLines = []; // to set HW supprot lines
        const solutionMinorLines = []; // to set solution support lines
        const eamsMinorLines = []; // to set EAMS lines
        if (data.minorLines) {
          for (const childData of data.minorLines){
            if (childData.productType === 'CX_HW_SUPPORT'){
              hwMinorLines.push(childData);
            } else if (childData.productType === 'CX_SOLUTION_SUPPORT'){
              solutionMinorLines.push(childData);
            } else {
              eamsMinorLines.push(childData);
            }
          }
        }
        // push all the minor lines in order and update the existing minor lines array
        data.minorLines = [...hwMinorLines, ...solutionMinorLines, ...eamsMinorLines];
      }
    }

  }

  viewAndEditHardwareSupport(){
    this.cxPriceEstimationService.viewAndEditHardwareSupport().subscribe((response:any) => {
        if(response && response.data && response.data.itemRedirectionUrl){
          window.open(response.data.itemRedirectionUrl, '_self');
        } else {
          this.messageService.displayUiTechnicalError();
        }
    });
  }
  openSmartsheet() {
    this.cxPriceEstimationService.openSmartsheet().subscribe((response: any) => {
      if (response && response.data) {
        window.open(response.data);
      } else {
        this.messageService.displayUiTechnicalError();
      }
    });
  }
  // method to check and show delisted message
  getDelistedDetails(){
    this.cxPriceEstimationService.getDelistedFlag().subscribe((res: any) => {
      if (res && !res.error){
        this.isShowDelistedThresholdLimitMsg = res.data && res.data.hasThresholdError;
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to call suites api, check and set allow84term
  getSuitesData() {
    let suitesData: any = [];
    let selecteSuitesData: any = [];
    let reqJSON: any = {};
    reqJSON['proposalId'] = this.proposalDataService.proposalDataObject.proposalId;
    reqJSON['archName'] = this.appDataService.archName;
    this.manageSuitesService.getSuites(reqJSON).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          res.archs.forEach(lineItem => {
            lineItem.suites.forEach(element => {
              suitesData.push(element);
            });
          });
          selecteSuitesData = suitesData.filter(data => data.inclusion === true); // filter with the suites included/selected
          let selectedSuiteIds = selecteSuitesData.map(a => a.id); // map with the selected suiteId's
          this.createProposalService.checkToAllow84MonthsTerm(selectedSuiteIds); // method to check allow84term
        } catch (error) {
          console.log(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }
  ibPull(){
    if (this.readonlyMode) {
      return;
    }
    this.manageSuitesService.ibPull(this.proposalDataService.proposalDataObject.proposalId).subscribe((res: any) => {
      if (res && res.data && !res.error) {
        try {
          if(res.data.ibPullLimitReached){
            this.ibPopups = true;
            this.nextIbPullTimeStamp = res.data.nextIbPullTimeStampInDdHhMm;
          } else {
            if (!this.proposalCxParams.awaitingResponse && res.data.proposalItem.cxParam.awaitingResponse) {
              this.invokePollerService();
            } 
            this.prepareGridData(res.data.proposalItem);
          }
          
        } catch (error) {
          console.log(error);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
     
  }
  closePopup(){
    this.ibPopups = false; 
  }
}
