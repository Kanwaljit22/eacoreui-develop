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
import { SpnaServicesSuitesCellComponent } from '../spna-services-suites-cell/spna-services-suites-cell.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { SpnaTcvCellRendererComponent } from '../spna-tcv-cell-renderer/spna-tcv-cell-renderer.component';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
import { PriceEstimationPollerService } from '../../price-estimation/price-estimation-poller.service';
import { PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
@Component({
  selector: 'app-spna-associated-services-grid',
  templateUrl: './spna-associated-services-grid.component.html',
  styleUrls: ['./spna-associated-services-grid.component.scss']
})
export class SpnaAssociatedServicesGridComponent implements OnInit, OnDestroy {
  public gridOptions: GridOptions;
  public gridApi;
  public columnDefs: any;
  public rowData: any;
  enrollmentData: IEnrollmentsInfo = {};
  isDiscountApplied = false;
  isCascadeApplied = false;
  readonly CONST_SERVICE_ENROLLMENT =  5;
  showServiceHardwareWarning = false;
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
  displaySuccessMsgForPrices = false; // set to show success message after ccwr pricing received
  diffInDaysForSystematicIbRepull = 0;
  nextIbPullTimeStamp = new Array();
  showIbPullMsg = true; // set to show ibpull msg
  troubleshootingUrl = 'https://salesconnect.cisco.com/#/content-detail/7baa3606-6d22-453f-bbaf-a8a5dab84666';
  showIbFetchSuccess = true;
  constructor(public priceEstimateService: PriceEstimateService, private eaRestService: EaRestService, private vnextService: VnextService, public priceEstimateStoreService:PriceEstimateStoreService, public proposalStoreService: ProposalStoreService, 
    private priceEstimationPollerService: PriceEstimationPollerService, 
    private blockUiService: BlockUiService, private modalVar: NgbModal, public dataIdConstantsService: DataIdConstantsService,
    public localizationService:LocalizationService,public eaService: EaService,public eastoreService:EaStoreService, public vnextStoreService: VnextStoreService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 60;
    this.gridOptions.frameworkComponents = {
      suitesRender: <{ new(): SpnaServicesSuitesCellComponent }>(
        SpnaServicesSuitesCellComponent
      ),
      tcvRender: <{ new(): SpnaTcvCellRendererComponent }>(
        SpnaTcvCellRendererComponent
      ),
    };
    this.gridOptions.context = {
      parentChildIstance: this
    };
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.domLayout = 'autoHeight';
  }

  ngOnInit(): void {
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
        "headerName": this.localizationService.getLocalizedString('price-estimation.quantity-install-base-break-up.QUANTITY_FOUND_IN_INSTALL_BASE'),
        "field": "total",
        "width": 115,
        "cellClass": "num-value",
        "headerClass": "text-right",
        "headerComponentParams": {
          template:
              '<div class="ag-cell-label-container" role="presentation">' +
              '  <span class="i-vNext-square-arrow"><span class="path1"></span><span class="path2"></span><span class="path3 serviceInstallBase"></span><span class="installBase"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
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
              '  <span class="i-vNext-square-arrow"><span class="path1"></span><span class="path2"></span><span class="path3 servicePaBreakup"></span></span> <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
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
        "width": 120,
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

  // discountRenderer(params) {
  //   if (params.node.level > 1 && params.data.pidType === "CX_HW_SUPPORT" && params.data.discountDirty && params.value !== undefined) {
  //     const val = '<span class="warning-cell d-flex justify-content-between warning-cell-inner"><span class="icon-warning1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></span>' + params.value + '</span>';
  //     return val;
  //   }
  //   return  params.value
  // }

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
    this.displaySuccessMsgForPrices = false;
    this.priceEstimateStoreService.selectedCxEnrollment = {};
    this.priceEstimationPollerService.stopPollerService();
    if (this.subscribers.applyDiscountForServicesSuiteSubj){
      this.subscribers.applyDiscountForServicesSuiteSubj.unsubscribe();
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
        this.enrollmentData = response.data.enrollments[0];
        this.priceEstimateStoreService.selectedCxEnrollment = response.data.enrollments[0];
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
      }
    });
  }

  setCxEnrollmentDataForAll(){
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?a=GET-CX-ENROLLMENT';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {       
        this.setGridData(response.data)
      }
    });
  }

  setGridData(data){
    this.priceEstimateStoreService.errorMessagesPresentForCx = false;
    this.priceEstimationPollerService.stopPollerService();
    const gridRowData = this.priceEstimateService.prepareGridData(data.enrollments);
    this.rowData = this.setCxPidGrouping(gridRowData);
    if(data.enrollments[0].systematicIbRepullRequired){
      this.diffInDaysForSystematicIbRepull = data.enrollments[0].diffInDaysForSystematicIbRepull;
    }
    this.priceEstimateStoreService.displayIbPullMsg = (data.enrollments[0].systematicIbRepullRequired && this.diffInDaysForSystematicIbRepull >= 10 && !this.proposalStoreService.isReadOnly) ? true : false;
    // this.rowData = this.priceEstimateService.prepareGridData(data.enrollments);
    this.priceEstimateStoreService.eamsDeliveryObj = data.enrollments[0].eamsDelivery ? data.enrollments[0].eamsDelivery : {};
   // this.onGridReady('');
    if (data.enrollments[0].awaitingResponse && !this.priceEstimateStoreService.viewAllSelected) {
      this.displaySuccessMsgForPrices = false;
      this.showServiceHardwareWarning =  true;
      this.invokePollerService();
    } else {
      this.displaySuccessMsgForPrices = true;
      this.showServiceHardwareWarning =  false;
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
          if (pids.pidType === 'CX_HW_SUPPORT'){
            hwPids.push(pids);
          } else if (pids.pidType === 'CX_SOLUTION_SUPPORT'){
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
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=UPDATE_DISC'
    this.eaRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        // call recalculate here
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
   // this.blockUiService.spinnerConfig.noProgressBar();
    this.pollerSubscibers = this.priceEstimationPollerService.invokeGetPollerservice(this.getPollerServiceUrl()).subscribe((res: any) => {
      if (res.data && res.data.enrollments && res.data.enrollments[0]) {
        if (!this.vnextStoreService.toastMsgObject.isIbFetchCompleted) {
          this.showIbFetchSuccess = false;
        }
        if (!res.data.enrollments[0].awaitingResponse){
          this.displaySuccessMsgForPrices = true;
          this.showServiceHardwareWarning =  false;
          this.priceEstimationPollerService.stopPollerService();
          // setTimeout(() => {
          //   this.displaySuccessMsgForPrices = false;
          // }, 5000);
        } else {
          this.displaySuccessMsgForPrices = false;
          this.showServiceHardwareWarning =  true;
        }
        // this.setErrorMessage(res.data.proposal);
        // this.setTotalValues(res.data.proposal);
        this.enrollmentData = res.data.enrollments[0];
        this.priceEstimateStoreService.selectedCxEnrollment = res.data.enrollments[0];
        this.setGridData(res.data);
        this.priceEstimateService.updateProposalDataForCx.next(res.data.proposal);
        this.setTotalNetToDisplay(this.enrollmentData); // set totalNetToDisplay for services and software
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
    for (let i = 0; i < this.proposalStoreService.proposalData.enrollments.length; i++) {
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
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e='+ this.priceEstimateStoreService.selectedEnrollment.id  +'&a=CX-IB-PULL';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
       if(response.data.ibPullLimitReached){
          this.ibQuantityPopup = true;
          this.nextIbPullTimeStamp = response.data.nextIbPullTimeStampInDdHhMm.split(" ",2)
       } else{
        this.setGridData(response.data);
        //this.setTotalNetToDisplay(this.enrollmentData);// set totalNetToDisplay for services and software
       }
      }
    });
  }

  closeIbPullMsg(){
    this.showIbPullMsg = false;
  }

  goToTroubleShooting() {
   const url = this.troubleshootingUrl;
   window.open(url);
  }

  delinkHwCx() {
    const modal = this.modalVar.open(DelinkConfirmationComponent, { windowClass: 'md eng-support', backdropClass: 'modal-backdrop-vNext', backdrop: 'static', keyboard: false });
    modal.result.then((result) => {
    });

  }
}
