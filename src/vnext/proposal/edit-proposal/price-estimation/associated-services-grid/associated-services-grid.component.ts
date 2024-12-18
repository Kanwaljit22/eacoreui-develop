import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DelinkConfirmationComponent } from 'vnext/modals/delink-confirmation/delink-confirmation.component';
import { EamsDeliveryComponent } from 'vnext/modals/eams-delivery/eams-delivery.component';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { PriceEstimateService } from '../price-estimate.service';
import { PriceEstimationPollerService } from '../price-estimation-poller.service';
import { ServicesSuitesCellComponent } from '../services-suites-cell/services-suites-cell.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { TcvCellRendererComponent } from '../tcv-cell-renderer/tcv-cell-renderer.component';
import { ConstantsService } from 'vnext/commons/services/constants.service';
@Component({
  selector: 'app-associated-services-grid',
  templateUrl: './associated-services-grid.component.html',
  styleUrls: ['./associated-services-grid.component.scss']
})
export class AssociatedServicesGridComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  enrollmentData: IEnrollmentsInfo = {};
  isDiscountApplied = false;
  isCascadeApplied = false;
  readonly CONST_SERVICE_ENROLLMENT =  5;
  showServiceSuccessMessage = false;
  pollerSubscibers : any;
  showMoreActions = false;
  public subscribers: any = {};
  showEAMS =  true; 
  isPollerServicesTriggered = false;
  expandedArr = [];
  ibQuantityPopup = false;
  ibPullLimitReached = false; //This flag will set when we'll get a response of api for ib pull.
  systematicIbRepullRequired = false;
  diffInDaysForSystematicIbRepull = 0;
  nextIbPullTimeStamp = new Array();
  showIbPullMsg = true; // set to show ibpull msg
  showIbFetchSuccess = true;
  showDnxOptionalMsg = false;
  l0CXnotFoundSucessForDnx = false;
  showUnxOptionalMsg = false;
  l0CXnotFoundSucessForUnx = false;
  isEnrollmentLocked = false
  lastIbassessmentaction =  ''; // set lastibassessmentstate
  openUpdateIbDrop = false; // set to open update ib dropdown
  @Output() invokePollerServiceForSwOnly = new EventEmitter();
  constructor(public priceEstimateService: PriceEstimateService, private eaRestService: EaRestService, private vnextService: VnextService, public priceEstimateStoreService:PriceEstimateStoreService, public proposalStoreService: ProposalStoreService, 
    private priceEstimationPollerService: PriceEstimationPollerService, 
    private blockUiService: BlockUiService, private modalVar: NgbModal, public dataIdConstantsService: DataIdConstantsService, public constantsService: ConstantsService,
    public localizationService:LocalizationService,public eaService: EaService,public eastoreService:EaStoreService, public vnextStoreService: VnextStoreService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 60;
    this.gridOptions.frameworkComponents = {
      suitesRender: <{ new(): ServicesSuitesCellComponent }>(
        ServicesSuitesCellComponent
      ),
      tcvRender: <{ new(): TcvCellRendererComponent }>(
        TcvCellRendererComponent
      ),
    };
    this.gridOptions.context = {
      parentChildIstance: this
    };
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.domLayout = 'autoHeight';
  }

  ngOnInit(): void {
    if(this.eaService.features?.RENEWAL_SEPT_REL && this.proposalStoreService.proposalData?.renewalInfo?.id){
      this.proposalStoreService.proposalData?.enrollments?.forEach((enrollment) => {
        if(enrollment.enrolled && enrollment.locked){
          this.isEnrollmentLocked = true
        }
      })
    }
    if (this.priceEstimateStoreService.selectedEnrollment.id){
      this.loadData();
      this.eaService.visibleManualIbPull();
    }

    this.subscribers.refreshCxGrid = this.priceEstimateService.refreshCxGrid.subscribe(() => {
      this.isCascadeApplied = false;
      this.loadData();
    });
    this.subscribers.applyDiscountForServicesSuiteSubj = this.priceEstimateService.applyDiscountForServicesSuiteSubj.subscribe((data: any) => {
      this.applyDiscountApiCall(data.request, data.enrollmentId);
    });

    this.subscribers.updateProposalSubject = this.priceEstimateService.updateProposalSubject.subscribe(value => {
      if (value) {
        this.onGridReady('');
      }
    });

    this.subscribers.updateCxGridforIbRepullSubject = this.priceEstimateService.updateCxGridforIbRepullSubject.subscribe((data: any) => {
      // check and set syncStatus
      if(data.proposal && data.proposal?.syncStatus){
        this.proposalStoreService.proposalData.syncStatus = data.proposal.syncStatus;
      }
      this.setGridData(data)
    })
  }

  loadData(){
    if (this.priceEstimateStoreService.viewAllSelected){
      this.setCxEnrollmentDataForAll();
    } else {
      this.setEnrollmentData();
    }
  }

  ibPopup(){
    this.ibQuantityPopup = true; 
  }
  closePopup(){
    this.ibQuantityPopup = false; 
  }


  onGridReady(event) {
    this.columnDefs = [
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.SOLUTIONS_SUITES_LABEL'),
        "field": "poolSuiteLineName",
        "cellRenderer": "agGroupCellRenderer",
        "width": 680,
        "cellRendererParams": {
          innerRenderer: 'suitesRender'
        },
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.quantity-install-base-break-up.QUANTITY_FOUND_IN_INSTALL_BASE_2'),
        "field": "total",
        "width": 115,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow" action-id="servicesGrid.icon.breakUp"><span class="path1"></span><span class="path2"></span><span class="path3 serviceInstallBase"></span><span class="installBase"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.BILLING_SKU_QTY_LABEL'),
        "field": "desiredQty",
        "width": 95,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true,
        "cellRenderer": 'suitesRender'
      },
      { 
        "headerName": this.localizationService.getLocalizedString('common.TOTAL_LIST_PRICE') + " (" + this.getCurrencyCode() + ")",
        "field": "listPrice",
        "headerClass": "text-right",
        "width": 120,
        "cellClass": "num-value",
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('price-estimation.SERVICE_DISCOUNT_LABEL'),
        "field": "serviceDiscount",
        "width": 110,
        "cellClass": "num-value no-edit",
        "cellRenderer": this.serviceRender,
        "lockPosition": true,
        "headerClass": "text-right",
        "minWidth": 60,
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('common.OTD') + " (" + this.getCurrencyCode() + ")",
        "field": "purchaseAdjustment",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow" action-id="servicesGrid.icon.breakUp"><span class="path1"></span><span class="path2"></span><span class="path3 servicePaBreakup"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
              '  </div>' +
              '</div>'
        },
        "width": 125,
        "lockPosition": true,
        "minWidth": 60,
        "cellClass": "num-value",
        "suppressMenu": true
      },
      {
        "headerName": this.localizationService.getLocalizedString('common.TOTAL_CONTRACT_VALUE') + " (" + this.getCurrencyCode() + ")",
        "field": "totalContractValue",
        "headerClass": "text-right",
        "width": 140,
        "cellClass": "num-value",
        "cellRenderer": 'tcvRender',
        "lockPosition": true,
        "minWidth": 60,
        "suppressMenu": true
      }
    ];
    for (let i = 0; i < this.columnDefs.length; i++) {
      const column = this.columnDefs[i];
    
      if (column['field'] === 'suites') {
        column['cellClass'] = (params) => {
          return this.suiteCell(params);
        }
      } else if (column['field'] === 'desiredQty') {
        column['cellRenderer'] = (params) => {
          return this.desiredQtyRender(params);
        },
        column['cellClass'] = (params) => {
          return this.desiredCellClass(params);
        }
      } 
      // else if (column['field'] === 'serviceDiscount'){
      //   column['cellRenderer'] = (params) => {
      //     return this.discountRenderer(params);
      //   }
      // }

      if (this.priceEstimateStoreService.viewAllSelected  && (column['field'] === 'purchaseAdjustment' || column['field'] === 'total') && column["headerComponentParams"]){
        delete column["headerComponentParams"]
      }

    }
    if(this.gridOptions.api) {
      this.gridOptions.api.setColumnDefs(this.columnDefs);
      this.gridOptions.api.sizeColumnsToFit();
   }
    //this.gridOptions.api.setRowData(this.rowData); 
  }
  onResize(event) {
    if(this.gridOptions && this.gridOptions.api){
    this.gridOptions.api.sizeColumnsToFit();
    }
  }
  suiteCell(params) { 
    if(params.node.level === 0) {
      return 'hideExpand'
    }
  }

  serviceRender(params) {
    if (params.data.discountDirty) {
      return '<span class="warning-cell d-flex justify-content-between warning-cell-inner"><span class="icon-warning1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>' + params.value + '</span>';
    } else if(params.value === 0) {
      return '--';
    } else {
      return params.value;
    }
  }

  desiredCellClass(params) {
    if (params.node.level > 1 && !this.priceEstimateStoreService.viewAllSelected && !this.proposalStoreService.isReadOnly && !this.priceEstimateStoreService.enableRecalculateAll && (!params.data.supportPid || params.data.enrollmentId === 5)) {
      if (params.value || params.value === 0)
        return 'num-value';
    } else {
      return 'num-value no-edit';
    }
  }

  desiredQtyRender(params) {
   if (params.node.level > 1 && !this.priceEstimateStoreService.viewAllSelected && !this.priceEstimateStoreService.enableRecalculateAll && !this.proposalStoreService.isReadOnly && !this.priceEstimateStoreService.displayExternalConfiguration) {
      if (params.value || params.value === 0)
        return (params.data.enrollmentId !==5 ? '<span class="i-vNext-edit-filled showDesiredQty"></span>' : '<span></span>') + '<span class="value">' + params.value + '</span>'
    } else {
      if(params.data.disabled){
        return '--';
      }
      const value = (params.value === undefined) ? '' : params.value;
      
      return params.node.level === 1 ? '1' : value;
    }
  }


  getNodeChildDetails(rowItem) {
    if (rowItem.childs && rowItem.childs.length) {
      return {
        group: true,
        children: rowItem.childs,
        key: rowItem.group,
        expanded: rowItem.expand
      };
    } else {
      return null;
    }
  }
  onCellClicked($event) {
    // console.log($event)
    // this.gridOptions.api.forEachNode(node => {
    //   if (node.expanded) {
    //     this.expandedArr.push(node)
    //   }
    // });
  }
  onRowSelected($event) {
  }
  onHeaderClick($event) {
    if (!this.vnextStoreService.toastMsgObject.isIbFetchCompleted) {
      this.showIbFetchSuccess = false;
    }
    const headerClass = $event.target.classList.value;
    const isServiceInstallBase = headerClass.search('serviceInstallBase');
    const isServicePurchaseIcon = headerClass.search('servicePaBreakup');
    if (isServiceInstallBase  > -1) {
      this.priceEstimateService.showQuantityInstallBaseBreakUp = true;
   }
    else if (isServicePurchaseIcon > -1) {
      this.priceEstimateService.showServicePurchaseAdjustmentBaseBreakUp = true;
   }

   this.gridOptions.api.forEachNode(node => {
    if (node.expanded) {
      this.priceEstimateService.expandedSuiteArr.push(node.data.poolSuiteLineName);
    } else {
      for (let i = 0; i < this.priceEstimateService.expandedSuiteArr.length; i++) {
        if (node.data.poolSuiteLineName === this.priceEstimateService.expandedSuiteArr[i]) {
          this.priceEstimateService.expandedSuiteArr.splice(node.data.poolSuiteLineName)
        }
      }
    }
  });

  }
  getCurrencyCode() {
    if (this.proposalStoreService.proposalData && this.proposalStoreService.proposalData.currencyCode) {
      return this.proposalStoreService.proposalData.currencyCode;
    } else {
      return 'USD';
    }
  }
  ngOnDestroy() {
    this.isCascadeApplied = false;
    this.isDiscountApplied = false;
    this.priceEstimateStoreService.showServiceHardwareWarning = false;
    this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
    this.priceEstimateStoreService.selectedCxEnrollment = {};
    this.priceEstimationPollerService.stopPollerService();
    if (this.subscribers.applyDiscountForServicesSuiteSubj){
      this.subscribers.applyDiscountForServicesSuiteSubj.unsubscribe();
    }
    if (this.subscribers.updateCxGridforIbRepullSubject){
      this.subscribers.updateCxGridforIbRepullSubject.unsubscribe();
    }
    if (this.subscribers.refreshCxGrid){
      this.subscribers.refreshCxGrid.unsubscribe();
    }
    this.priceEstimateStoreService.errorMessagesPresentForCx = false;
    this.priceEstimateStoreService.displayIbPullMsg = false;
    if (this.subscribers.updateProposalSubject) {
      this.subscribers.updateProposalSubject.unsubscribe();
    }
    this.vnextStoreService.toastMsgObject.isIbFetchCompleted = false;
  }

  setEnrollmentData(){
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.priceEstimateStoreService.selectedEnrollment.id + '&a=GET-CX-ENROLLMENT';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
       // response.data.enrollments[0].hwSupportReqFailedReason = 'INVALID_DISTI_RESELLER_BILL_TO_ID'
       // check and set syncStatus
       if(response.data.proposal && response.data.proposal?.syncStatus){
        this.proposalStoreService.proposalData.syncStatus = response.data.proposal.syncStatus;
        }
        this.enrollmentData = response.data.enrollments[0];
        this.priceEstimateStoreService.selectedCxEnrollment = response.data.enrollments[0];
        if (this.priceEstimateStoreService.selectedEnrollment.cxAttached) {
          this.setGridData(response.data);
          this.setTotalNetToDisplay(this.enrollmentData);// set totalNetToDisplay for services and software
          if (this.eaService.customProgressBarMsg.requestOverride) {
            this.eaService.customProgressBarMsg.requestOverride = false;
          } else if (this.eaService.customProgressBarMsg.witdrawReqOverride) {
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          } else {
            this.eaService.customProgressBarMsg.requestOverride = false;
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          }
        } else if(this.priceEstimateStoreService.selectedEnrollment?.embeddedHwSupportAttached){
          const enrollmentData = response.data.enrollments[0];
          if (!(enrollmentData?.hardwareLinePricesInSync || enrollmentData?.discountCascadePending) || (this.eaService.isUpgradeFlow && !enrollmentData?.ibAssementRequiredForCxUpgradeType)) {
            this.priceEstimateStoreService.displayReprocessIB = true;
          } else {
            this.priceEstimateStoreService.displayReprocessIB = false;
          }
          if(enrollmentData?.systematicIbRepullRequired){
            this.priceEstimateStoreService.diffInDaysForSystematicIbRepull = enrollmentData.diffInDaysForSystematicIbRepull;
          }
          this.priceEstimateStoreService.displayIbPullMsg = (response.data.enrollments[0]?.systematicIbRepullRequired &&  this.priceEstimateStoreService.diffInDaysForSystematicIbRepull >= 10 && !this.proposalStoreService.isReadOnly) ? true : false;
          if (((this.priceEstimateStoreService.selectedCxEnrollment?.awaitingResponse && !this.eaService.features.IB_OPTIMIZATION) || (this.eaService.features.IB_OPTIMIZATION && this.proposalStoreService.proposalData?.syncStatus?.cxCcwrRipFlag)) && !this.priceEstimateStoreService.viewAllSelected) {
            this.invokePollerServiceForSwOnly.emit(true);
          }
        }
      }
    });
  }

  setCxEnrollmentDataForAll(){
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?a=GET-CX-ENROLLMENT';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) { 
        // check and set syncStatus  
        if(response.data.proposal && response.data.proposal?.syncStatus){
          this.proposalStoreService.proposalData.syncStatus = response.data.proposal.syncStatus;
        }  
        this.setGridData(response.data)
      }
    });
  }

  setGridData(data){
    this.showDnxOptionalMsg = false;
    this.showUnxOptionalMsg = false;
    this.l0CXnotFoundSucessForDnx = false;
    this.l0CXnotFoundSucessForUnx = false;
    this.priceEstimateStoreService.errorMessagesPresentForCx = false;
    this.priceEstimationPollerService.stopPollerService();
    const gridRowData = this.priceEstimateService.prepareGridData(data.enrollments);
    this.rowData = this.setCxPidGrouping(gridRowData);
    if(data.enrollments[0]?.systematicIbRepullRequired){
      this.diffInDaysForSystematicIbRepull = data.enrollments[0].diffInDaysForSystematicIbRepull;
      this.priceEstimateStoreService.diffInDaysForSystematicIbRepull = data.enrollments[0].diffInDaysForSystematicIbRepull;
    }
    this.priceEstimateStoreService.displayIbPullMsg = (data.enrollments[0]?.systematicIbRepullRequired && this.diffInDaysForSystematicIbRepull >= 10 && !this.proposalStoreService.isReadOnly) ? true : false;
    // this.rowData = this.priceEstimateService.prepareGridData(data.enrollments);
    this.priceEstimateStoreService.eamsDeliveryObj = data.enrollments[0].eamsDelivery ? data.enrollments[0].eamsDelivery : {};
   // this.onGridReady('');
   if (this.eaService.features.FIRESTORM_REL) {
    const enrollmentData = data.enrollments[0];
      if (!(enrollmentData?.hardwareLinePricesInSync || enrollmentData?.discountCascadePending) || (this.eaService.isUpgradeFlow && !enrollmentData?.ibAssementRequiredForCxUpgradeType)) {
        this.priceEstimateStoreService.displayReprocessIB = true;
      } else {
        this.priceEstimateStoreService.displayReprocessIB = false;
      }
      if (enrollmentData?.hwSupportLinesState !== 'QUOTE_CREATION_FAILED' && !enrollmentData.lineInError && !this.priceEstimateStoreService.viewAllSelected) {
        if (((enrollmentData?.awaitingResponse && !this.eaService.features.IB_OPTIMIZATION) || (this.eaService.features.IB_OPTIMIZATION && this.proposalStoreService.proposalData?.syncStatus?.cxCcwrRipFlag))) {
          //this.priceEstimateStoreService.hardwareIbInprogressWarning = true;
          this.priceEstimateStoreService.hardwareIbSuccess = false;
        } else {
          //this.priceEstimateStoreService.hardwareIbInprogressWarning = false;
          if(this.eaService.features.IB_OPTIMIZATION){
            if(this.proposalStoreService.proposalData?.syncStatus?.cxEditFlag){
              this.priceEstimateStoreService.hardwareIbSuccess = false;
            } else {
              this.priceEstimateStoreService.hardwareIbSuccess = true;
            }
          } else {
            this.priceEstimateStoreService.hardwareIbSuccess = true;
          }
        }
      }
      const poolData = enrollmentData.pools[0];
      poolData.suites.forEach((suite) => {
        if (suite.cxAlacarteCoverageFound !== undefined) {
          // changes for unx suite
          if(this.eaService.features?.WIFI7_REL && suite?.eaSuiteType === this.constantsService.CISCO_NETWORKING_SOLUTION){
            if (!suite.cxAlacarteCoverageFound) {
              this.showUnxOptionalMsg = true;
              this.l0CXnotFoundSucessForUnx = false;
            } else {
              this.showUnxOptionalMsg = false;
              this.l0CXnotFoundSucessForUnx = true;
            }
          } else {
            if (!suite.cxAlacarteCoverageFound) {
              this.showDnxOptionalMsg = true;
              this.l0CXnotFoundSucessForDnx = false;
            } else {
              this.showDnxOptionalMsg = false;
              this.l0CXnotFoundSucessForDnx = true;
            }
          }
        }
      })
    }
    if(this.eaService.features.IB_OPTIMIZATION){
      if((this.proposalStoreService.proposalData?.syncStatus?.cxCcwrRipFlag) && !this.priceEstimateStoreService.viewAllSelected){
        this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
        this.priceEstimateStoreService.showServiceHardwareWarning =  true;
        this.invokePollerService();
      } else {
        this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
        this.priceEstimateStoreService.showServiceHardwareWarning =  false;
      }
    } else {
      if (data.enrollments[0]?.awaitingResponse && !this.priceEstimateStoreService.viewAllSelected) {
        this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
        this.priceEstimateStoreService.showServiceHardwareWarning =  true;
        this.invokePollerService();
      } else {
        this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
        this.priceEstimateStoreService.showServiceHardwareWarning =  false;
      }
    }
    if (this.isDiscountApplied && this.isCascadeApplied){
      this.isDiscountApplied = false;
    }
    // setTimeout(() => {
    //   this.gridOptions.api.forEachNode(node => {

    //     if (node.level !== 1) {
    //       node.setExpanded(true);
    //     }
    //     for (let i = 0; i < this.expandedArr.length; i++) {
    //       if (node.data.poolSuiteLineName === this.expandedArr[i].data.poolSuiteLineName) {
    //         node.setExpanded(true);
    //       }
    //     }
    //   });
    // }, 200);
    this.gridOptions.suppressContextMenu = true;
    if(this.gridOptions && this.gridOptions.api){
      this.gridOptions.api.sizeColumnsToFit();
      }
    this.gridOptions.getRowClass = (params) => {
      if(params.node.level !== 0) {
        let key = params.data.pidType ? 'PID-' + params.data.pidName: 'ATO-' +params.data.ato;
        if (this.priceEstimateService.messageMap.has(key)) {
          return 'suite-level-error';
        }
      }
    }
    this.gridOptions.api.redrawRows();
  }

  // set cx pid grouping
  setCxPidGrouping(data){
    for (let pool of data){
      // remove already purchased suites
      pool.childs = pool.childs.filter(suite => !suite.disabled);
      for (let suite of pool.childs){
        let hwPids = []; // to set HW supprot lines
        let solutionPids = []; // to set solution support lines
        let eamsPids = []; // to set EAMS lines
        for (let pids of suite.childs){
          if ((!this.eaService.features?.SPA_PID_TYPE && pids.pidType === 'CX_HW_SUPPORT' || (this.eaService.features?.SPA_PID_TYPE && data?.pidType === this.constantsService.HW_PRODUCTS))){
            hwPids.push(pids);
          } else if ((!this.eaService.features?.SPA_PID_TYPE && pids.pidType === 'CX_SOLUTION_SUPPORT') || (this.eaService.features?.SPA_PID_TYPE && data?.pidType === this.constantsService.SW_PRODUCTS)){
            solutionPids.push(pids);
          } else {
            eamsPids.push(pids);
          }
        }
        // push all the sorted pids
        suite.childs = [...hwPids, ...solutionPids, ...eamsPids];
      }
    }
    return data;
  }

  cascadeDiscount(){
    if(this.proposalStoreService.isPartnerAccessingSfdcDeal && !this.vnextStoreService.loccDetail?.loccSigned){
      return;
    }
    // const ngbModalOptionsLocal = this.ngbModalOptions;
    // ngbModalOptionsLocal.windowClass = 'md';
    // ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';
    // const modalRef = this.modalVar.open(ServicesCascadeDiscountConfirmationComponent, ngbModalOptionsLocal);
    // modalRef.result.then((result) => {
    //   if (result.continue) {
    //    // call api for cascade discount
        
    //   }
    // });
    this.priceEstimationPollerService.stopPollerService();
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=CASCADE-DISCOUNT';
    this.eaRestService.postApiCall(url, {}).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // call recalculate here
        if (response.data.enrollments) {
        const enrollment = response.data.enrollments.filter(enrollment => enrollment.id === 5);
        const data = {'enrollments': enrollment}
        this.isCascadeApplied = true;
        // this.setErrorMessage(response.data.proposal);
        // this.setTotalValues(response.data.proposal);
        this.enrollmentData = enrollment[0];
        this.priceEstimateStoreService.selectedCxEnrollment = enrollment[0];
        this.setGridData(data)
        } else {
          this.isCascadeApplied = false;
        }
      }
    });
  }

  viewAndEditHardwareSupport() {
    if(this.proposalStoreService.isPartnerAccessingSfdcDeal && !this.vnextStoreService.loccDetail?.loccSigned){
      return;
    }
    let enrollMentId = this.priceEstimateStoreService.selectedEnrollment.id.toString();
    sessionStorage.setItem('enrollmentId', enrollMentId);
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=VIEW-HARDWARE-ITEMS'
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response) && response.data.redirectionUrl) {
        window.open(response.data.redirectionUrl, '_self');
      }
    });
  }

  applyDiscountApiCall(requestObj, enrollmentId) {
    // call api to send applied discounts obj
    this.isDiscountApplied =  false;
    this.priceEstimationPollerService.stopPollerService();
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=UPDATE_DISC'//'proposal/' + this.proposalStoreService.proposalData.objId + '?e=' + this.priceEstimateStoreService.selectedEnrollment.id + '&a=UPDATE_DISC'
    this.eaRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // call recalculate here
        // check and set syncStatus
        if(response.data.proposal && response.data.proposal?.syncStatus){
          this.proposalStoreService.proposalData.syncStatus = response.data.proposal.syncStatus;
        }
        if (response.data.enrollments) {
          const enrollment = response.data.enrollments.filter(enrollment => enrollment.id === enrollmentId);
          const data = { 'enrollments': enrollment }
          this.isDiscountApplied = true;
          this.isCascadeApplied = false;
          // this.priceEstimationPollerService.stopPollerService();
          this.enrollmentData = enrollment[0];
          this.priceEstimateStoreService.selectedCxEnrollment = enrollment[0];
          this.setGridData(data)
        }
      }
    });
  }

  invokePollerService(){
    this.pollerSubscibers = this.priceEstimationPollerService.invokeGetPollerservice(this.getPollerServiceUrl()).subscribe((res: any) => {
      // check and set syncStatus
      if(res.data.proposal && res.data.proposal?.syncStatus){
        this.proposalStoreService.proposalData.syncStatus = res.data.proposal.syncStatus;
      }
      if(this.eaService.features.FIRESTORM_REL){
        let cxEnrollment;
        let swEnrollment;
        if (res.data && res.data.enrollments && res.data.enrollments.length) {
          if (!this.vnextStoreService.toastMsgObject.isIbFetchCompleted) {
            this.showIbFetchSuccess = false;
          }
          res.data.enrollments.forEach((enrollment) => {
            if (enrollment.id === 5) {
              cxEnrollment = enrollment;
            } else if (enrollment.id === this.priceEstimateStoreService.selectedEnrollment.id) {
              swEnrollment = enrollment;
            }
          })
          if(cxEnrollment){
            if(this.eaService.features.IB_OPTIMIZATION){
              if(res.data.proposal?.syncStatus?.cxCcwrRipFlag){ 
                this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
                this.priceEstimateStoreService.showServiceHardwareWarning =  true;
              } else {
                this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
                this.priceEstimateStoreService.showServiceHardwareWarning =  false;
                this.priceEstimationPollerService.stopPollerService();
              }
            } else {
              if (!cxEnrollment?.awaitingResponse ){
                this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
                this.priceEstimateStoreService.showServiceHardwareWarning =  false;
                this.priceEstimationPollerService.stopPollerService();
      
              } else {
                this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
                this.priceEstimateStoreService.showServiceHardwareWarning =  true;
              }
            }
            this.enrollmentData = cxEnrollment;
            this.priceEstimateStoreService.selectedCxEnrollment = cxEnrollment;
            const data = {enrollments: [cxEnrollment]}
            this.setGridData(data);
            const proposalData = {proposalData: res.data.proposal,swEnrollmentData : (swEnrollment) ? {enrollments: [swEnrollment]}: undefined }
            this.priceEstimateService.updateProposalDataForCx.next(proposalData);
            this.setTotalNetToDisplay(this.enrollmentData); // set totalNetToDisplay for services and software
          }
        }
      } else {
        if (res.data && res.data.enrollments && res.data.enrollments[0]) {
          if (!this.vnextStoreService.toastMsgObject.isIbFetchCompleted) {
            this.showIbFetchSuccess = false;
          }

          if(this.eaService.features.IB_OPTIMIZATION){
            if(res.data.proposal?.syncStatus?.cxCcwrRipFlag){ 
              this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
              this.priceEstimateStoreService.showServiceHardwareWarning =  true;
            } else {
              this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
              this.priceEstimateStoreService.showServiceHardwareWarning =  false;
              this.priceEstimationPollerService.stopPollerService();
            }
          } else {
            if (!res.data.enrollments[0]?.awaitingResponse){
              this.priceEstimateStoreService.displaySuccessMsgForPrices = true;
              this.priceEstimateStoreService.showServiceHardwareWarning =  false;
              this.priceEstimationPollerService.stopPollerService();
    
            } else {
              this.priceEstimateStoreService.displaySuccessMsgForPrices = false;
              this.priceEstimateStoreService.showServiceHardwareWarning =  true;
            }
          }
  
          this.enrollmentData = res.data.enrollments[0];
          this.priceEstimateStoreService.selectedCxEnrollment = res.data.enrollments[0];
          this.setGridData(res.data);
          this.priceEstimateService.updateProposalDataForCx.next(res.data.proposal);
          this.setTotalNetToDisplay(this.enrollmentData); // set totalNetToDisplay for services and software
        }
      }
    });
  }

  getPollerServiceUrl(){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/enrollment?e=' + this.priceEstimateStoreService.selectedEnrollment.id + '&a=SYNC-PRICES';
    return url;
  }

  openEAMS(enrollment) {

    const modal = this.modalVar.open(EamsDeliveryComponent, { windowClass: 'md', backdropClass: 'modal-backdrop-vNext' });
    modal.componentInstance.eamsPartnerInfo = enrollment.eamsDelivery;

    modal.result.then((result) => {
      if (result.continue === true) {
        this.showEAMS = false;
        this.setEnrollmentData();
      }
    });

  }

  // check and set totalNetToDisplay for services and software (software toalNet + services totalNet )
  setTotalNetToDisplay(enrollmentData){
    for (let i = 0; i < this.proposalStoreService.proposalData.enrollments?.length; i++) {
      if (this.proposalStoreService.proposalData.enrollments[i].id === this.priceEstimateStoreService.selectedEnrollment.id) {
        const totalNet = this.proposalStoreService.proposalData.enrollments[i].priceInfo.totalNet ? this.proposalStoreService.proposalData.enrollments[i].priceInfo.totalNet :  0;
        const totalNetForCx = this.checkAndSetTotalNetForCX(enrollmentData);
        this.proposalStoreService.proposalData.enrollments[i].priceInfo.totalNetToDisplay = totalNet + totalNetForCx;
        break;
      }
    }
  }

  // check and add totalNet from each suites and set to totalNetForCx
  checkAndSetTotalNetForCX(enrollmentData){
    let totalNet = 0;
    if(enrollmentData.pools && enrollmentData.pools.length){
      enrollmentData.pools.forEach(pool => {
        if(pool.suites){
          for (let suite of pool.suites){
            if (suite.priceInfo && suite.priceInfo.totalNet){
              totalNet = totalNet + suite.priceInfo.totalNet;
            }
          };
        }
      });
    }
    return totalNet;
  }

  onDemandIbRepull(){
    if(this.proposalStoreService.isPartnerAccessingSfdcDeal && !this.vnextStoreService.loccDetail?.loccSigned){
      return;
    }
    if(this.eaService.features.IB_OPTIMIZATION){
      this.callIbReprocessOptimization(true, 'repullIb');
    } else {
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e='+ this.priceEstimateStoreService.selectedEnrollment.id  +'&a=CX-IB-PULL';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
        // check and set syncStatus
        if(response.data.proposal && response.data.proposal?.syncStatus){
          this.proposalStoreService.proposalData.syncStatus = response.data.proposal.syncStatus;
        }
       if(response.data.ibPullLimitReached){
          this.ibQuantityPopup = true;
          this.nextIbPullTimeStamp = response.data.nextIbPullTimeStampInDdHhMm.split(" ",2)
       } else{
        if(this.eaService.features.FIRESTORM_REL){
          let cxEnrollment;
          let swEnrollment;
          response.data.enrollments.forEach((enrollment) => {
            if (enrollment.id === 5) {
              cxEnrollment = enrollment;
            } else if (enrollment.id === this.priceEstimateStoreService.selectedEnrollment.id) {
              swEnrollment = enrollment;
            }
          })
          if(cxEnrollment){
            const data = {enrollments: [cxEnrollment]}
            this.setGridData(data);
          }
          if(swEnrollment && swEnrollment.embeddedHwSupportAttached){
            const data = {swEnrollmentData : {enrollments: [swEnrollment]} }
            this.priceEstimateService.updateProposalDataForCx.next(data);
          }
        } else {
          this.setGridData(response.data);
        }
        
        //this.setTotalNetToDisplay(this.enrollmentData);// set totalNetToDisplay for services and software
       }
      }
    });
  }
  }

  closeIbPullMsg(){
    this.showIbPullMsg = false;
  }

  goToTroubleShooting() {
   const url = this.priceEstimateStoreService.troubleshootingUrl;
   window.open(url);
  }

  delinkHwCx() {
    if(this.proposalStoreService.isPartnerAccessingSfdcDeal && !this.vnextStoreService.loccDetail?.loccSigned){
      return;
    }
    const modal = this.modalVar.open(DelinkConfirmationComponent, { windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext', backdrop: 'static', keyboard: false });
    modal.result.then((result) => {
    });

  }

  // to call initiate IB/ reprocess IB/ Update IB assessment 
  callIbReprocessOptimization(reprocessIb, lastIbAssessmentAction?){
    if((this.proposalStoreService.isPartnerAccessingSfdcDeal && !this.vnextStoreService.loccDetail?.loccSigned) || (lastIbAssessmentAction && this.proposalStoreService.proposalData?.syncStatus.cxCcwrRipFlag) || (reprocessIb && !this.checkIfLastRepullPassed24Hrs()) ){
      return;
    }

    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/ib-assessment';
    let reqObj = {
      "data":{
      "enrollmentId": this.priceEstimateStoreService.selectedEnrollment.id,
      "repull" : reprocessIb,
      "ibAssessmentLastState": lastIbAssessmentAction
      }
    }
    // this.proposalStoreService.proposalData.syncStatus.cxEditFlag = false;
    // this.proposalStoreService.proposalData.syncStatus.cxCcwrRipFlag = true;
    this.eaRestService.postApiCall(url, reqObj).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response)){
        this.enrollmentData = response.data.enrollments[0];
        if(this.priceEstimateStoreService.selectedEnrollment.discountCascadePending && !response.data?.enrollments[0].discountCascadePending){
          this.isCascadeApplied = true;
        }
        this.priceEstimateStoreService.selectedCxEnrollment = response.data.enrollments[0];
        // check and set syncStatus
        if(response.data.proposal && response.data.proposal?.syncStatus){
          this.proposalStoreService.proposalData.syncStatus = response.data.proposal.syncStatus;
        } 
        if (this.priceEstimateStoreService.selectedEnrollment.cxAttached) {
          this.setGridData(response.data);
          this.setTotalNetToDisplay(this.enrollmentData);// set totalNetToDisplay for services and software
          if (this.eaService.customProgressBarMsg.requestOverride) {
            this.eaService.customProgressBarMsg.requestOverride = false;
          } else if (this.eaService.customProgressBarMsg.witdrawReqOverride) {
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          } else {
            this.eaService.customProgressBarMsg.requestOverride = false;
            this.eaService.customProgressBarMsg.witdrawReqOverride = false;
          }
        } else if(this.priceEstimateStoreService.selectedEnrollment?.embeddedHwSupportAttached){
          const enrollmentData = response.data.enrollments[0];
          if (!(enrollmentData?.hardwareLinePricesInSync || enrollmentData?.discountCascadePending) || (this.eaService.isUpgradeFlow && !enrollmentData?.ibAssementRequiredForCxUpgradeType)) {
            this.priceEstimateStoreService.displayReprocessIB = true;
          } else {
            this.priceEstimateStoreService.displayReprocessIB = false;
          }
          if(enrollmentData?.systematicIbRepullRequired){
            this.priceEstimateStoreService.diffInDaysForSystematicIbRepull = enrollmentData.diffInDaysForSystematicIbRepull;
          }
          this.priceEstimateStoreService.displayIbPullMsg = (response.data.enrollments[0]?.systematicIbRepullRequired &&  this.priceEstimateStoreService.diffInDaysForSystematicIbRepull >= 10 && !this.proposalStoreService.isReadOnly) ? true : false;
          if (((this.priceEstimateStoreService.selectedCxEnrollment?.awaitingResponse && !this.eaService.features.IB_OPTIMIZATION) || (this.eaService.features.IB_OPTIMIZATION && this.proposalStoreService.proposalData?.syncStatus?.cxCcwrRipFlag)) && !this.priceEstimateStoreService.viewAllSelected) {
            this.invokePollerServiceForSwOnly.emit(true);
          }
        }
      }
    })
  }

  // method to check and allow reporcess ib if hwLastIbPulledAtDate passed 24hrs
  checkIfLastRepullPassed24Hrs(){
    const lastRepullDate = this.enrollmentData.hwLastIbPulledAtDate;
    const currentDate = new Date().getTime();
    const oneDay = 24*60*60*1000;
    if((currentDate - lastRepullDate) >= oneDay){
      return true;
    }
    return false;
  }

  // method show update ib reprocess dropdown
  openUpdateIbDropDown(){
  this.openUpdateIbDrop = !this.openUpdateIbDrop;
  }

  // method hide update ib reprocess dropdown
  closeUpdateIbDropDown(){
  this.openUpdateIbDrop = false;
  }

}
