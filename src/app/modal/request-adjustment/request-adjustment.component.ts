import { PriceEstimationService } from '@app/proposal/edit-proposal/price-estimation/price-estimation.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MessageType } from '@app/shared/services/message';
import { GridOptions } from 'ag-grid-community';
import { RequestAdjustmentService, ColoumnDef } from './request-adjustment.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { IMultiSelectSettings, IMultiSelectOption, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { FileUploader } from 'ng2-file-upload';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { MessageService } from '@app/shared/services/message.service';
import { ReasonCellComponent } from './reason-cell/reason-cell.component';
import { CommentCellComponent } from './comment-cell/comment-cell.component';
import { EditCellValueComponent } from './edit-cell-value/edit-cell-value.component';
import { ActionCellComponent } from './action-cell/action-cell.component';
import { SuiteSwitchWarningComponent } from '@app/modal/suite-switch-warning/suite-switch-warning.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-request-adjustment',
  templateUrl: './request-adjustment.component.html',
  styleUrls: ['./request-adjustment.component.scss']
})
export class RequestAdjustmentComponent implements OnInit {
  @ViewChild('myDropsearch', { static: true }) myDropsearch;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  suiteId: number;
  proposalId: any;
  suiteData: any;
  public gridOptions: GridOptions;
  public rowData: any = [];
  public columnDefs: any;
  public domLayout;
  private gridApi;
  private gridColumnApi;
  selectedSuiteId: number;
  selectedSuiteName: string;
  selectedOptions = [];
  selectedValue: string;
  hasBaseDropZoneOver = false;
  uploader: FileUploader = new FileUploader({ url: URL, allowedFileType: ['xlsx'] });
  favProspects: boolean;
  favCredit: string;
  suites = [];
  reasons = [];
  dropValue: any;
  coloumnDef: PaMetaData[];
  childColoumnDef: ColoumnDef;
  childColoumnDefArray: ColoumnDef[];
  allColoumnDefs: PaMetaData[];
  adjustedColDef: PaMetaData[];
  computedColDef: PaMetaData[];
  proposalLevelComments = '';
  adjustedRowData = [];
  computedRowData = [];
  editedNodeId = [];
  showGrid = true;
  successMsgOnSave = true;
  rowTotalAdjusment: any;
  readOnlyView = false;
  securityArchitecture = false;
  // static updated = false;

  readonly creditHeaderArray = {
    PER_FOUNDATION: 'FOUNDATION', PER_ADVANCED: 'ADVANCED', SUB_ESSENTIALS: 'ESSENTIALS',
    SUB_ADVANTAGE: 'ADVANTAGE', DNA_ADVANTAGE: 'ADVANTAGE', DNA_PREMIER: 'PREMIER', DNA_ADDON: 'ADDON',
    DC_ADVANTAGE: 'ADVANTAGE', DC_PREMIER: 'PREMIER', DC_ADDON: 'ADDON', DC_SUBSCRIPTION: 'SUBSCRIPTION',
    SEC_SUBSCRIPTION: ''
  };

  readonly creditHeaderOrder = ['DNA_ADVANTAGE', 'DNA_PREMIER', 'DNA_ADDON', 'PER_FOUNDATION',
    'PER_ADVANCED', 'SUB_ADVANTAGE', 'SUB_ESSENTIALS', 'DC_ADVANTAGE', 'DC_PREMIER', 'DC_ADDON', 'DC_SUBSCRIPTION', 'SEC_SUBSCRIPTION'];

  constructor(public requestAdjustmentService: RequestAdjustmentService, public bsModalRef: BsModalRef, public localeService: LocaleService,
    public appDataService: AppDataService, public qualService: QualificationsService, public involvedService: WhoInvolvedService,
    public messageService: MessageService, public priceEstimationService: PriceEstimationService, public utilitiesService: UtilitiesService,
    private modalVar: NgbModal, public constantsService: ConstantsService) {
    this.gridOptions = <GridOptions>{};
    // this.gridOptions.getRowClass = params => {
    //   if (!params.node.rowPinned) {
    //     return 'editable-rows';
    //   }
    // };
    this.gridOptions.frameworkComponents = {
      reasonCellRenderer: <{ new(): ReasonCellComponent }>(
        ReasonCellComponent
      ),
      commentsCellRenderer: <{ new(): CommentCellComponent }>(
        CommentCellComponent
      ),
      editCellRenderer: <{ new(): EditCellValueComponent }>(
        EditCellValueComponent
      ),
      actionCellRenderer: <{ new(): ActionCellComponent }>(
        ActionCellComponent
      )
    };
    this.gridOptions.context = {
      parentChildIstance: this
    };
  }

  ngOnInit() {
    // isAdjustmentUpdated should be false while opening PA modal
    this.requestAdjustmentService.isAdjustmentUpdated = false;
    // to clear msg if any on price estiamtion page.
    this.messageService.clear();
    // if user is ro super user but does not have rw access or for a complete proposal he is using road map then dont enable update button.
    // if((this.appDataService.userInfo.roSuperUser && !this.appDataService.isReadWriteAccess) || this.appDataService.roadMapPath){
    //   this.readOnlyView = true;
    // }

    // to checkin if security architecture 
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      this.securityArchitecture = true;
    }
    this.requestAdjustmentService.reasonCounter = 0;
    this.favProspects = false;
    this.favCredit = 'AdjustedCredit';
    this.proposalId = this.priceEstimationService.proposalDataService.proposalDataObject.proposalId;
    this.suites = this.priceEstimationService.suitesArray;
    this.selectedSuiteId = this.suiteId;
    this.childColoumnDef = {
      headerName: '',
      field: '',
      cellClass: '',
      editable: '',
      suppressMenu: '',
      width: '',
      cellRenderer: ''
    };
    this.childColoumnDefArray = [];

    this.allColoumnDefs = [];
    this.suites.forEach(element => {
      if (element.suiteId === this.suiteId) {
        this.selectedSuiteName = element.name;
      }
    });
    // Fetch request adjustment for modal
    this.getPurchaseAdjustmentData(this.proposalId, this.suiteId);
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.rowTotalAdjusment) {
      this.gridApi.setPinnedTopRowData([this.rowTotalAdjusment]);
    }
  }

  // Fetches request adjustment data for modal
  getPurchaseAdjustmentData(proposalId, suiteId) {
    this.requestAdjustmentService.getPurchaseAdjustment(proposalId, suiteId).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        this.showGrid = true;
        this.suiteData = response.data;
        this.reasons = response.data.reasons;
        this.requestAdjustmentService.reasonsArray = response.data.reasons;
        // this.columnDefs = this.getColumnDefs();
        // this.getData();
        if (response.data.comment) {
          this.proposalLevelComments = response.data.comment;
        }
        this.columnDefs = this.getMetaDataAndData();
        if (this.gridOptions.api) {
          this.gridOptions.api.setRowData(this.rowData);
          setTimeout(() => {
            this.gridOptions.api.sizeColumnsToFit();
          }, 0);
        }
      } else {
        this.showGrid = false;
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'admin.NO_DATA_FOUND'), MessageType.Warning));
      }
    },
      (error: any) => {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'purchaseadjustment.GET_REQ_ADJUSTMENT_FAILED'), MessageType.Error));
      });
  }

  getMetaDataAndData() {
    if (this.favCredit === 'ComputedCredit' && this.computedRowData.length > 0 && this.adjustedRowData.length > 0) {
      // to avoid complex for loop and maintaining cope of rowData as all updated values in rowData array.
      this.adjustedRowData = this.rowData;
      this.rowData = this.computedRowData;
      this.adjustedColDef = this.allColoumnDefs;
      this.allColoumnDefs = this.computedColDef;
    } else if (this.favCredit === 'AdjustedCredit' && this.computedRowData.length > 0 && this.adjustedRowData.length > 0) {
      this.computedRowData = this.rowData;
      this.rowData = this.adjustedRowData;
      this.computedColDef = this.allColoumnDefs;
      this.allColoumnDefs = this.adjustedColDef;
    }
    this.allColoumnDefs = [];
    if (this.computedRowData.length === 0 || this.adjustedRowData.length === 0) {
      this.rowData = [];
    }
    const metaDataMap = new Map<string, PaMetaData>();
    // check if suite data available
    if (this.suiteData && this.suiteData.suites) {
      let adjustedCredit = false;
      this.rowTotalAdjusment = {};
      const rowTotalAdjusmentMap = new Map<string, number>();
      this.rowTotalAdjusment['lineItemId'] = 'Grand Total';
      // this.rowData.push(rowTotalAdjusment);
      this.gridApi.setPinnedTopRowData([this.rowTotalAdjusment]);
      if (this.favCredit === 'AdjustedCredit') {
        adjustedCredit = true;
      }
      // Add a static header - first column 'Line Item' into headers array
      this.allColoumnDefs.push({
        headerName: 'Item', field: 'lineItemId', cellRenderer: this.lineItemRenderer,
        suppressMenu: true, pinned: 'left', width: 200, cellClass: 'lineItem-popup'
      });
      this.suiteData.suites[this.selectedSuiteId]['lineItems'].forEach((item) => {
        const rowDef = new Object();
        let orginalTotalAdjustment = 0;
        // let credits = [];
        rowDef['lineItemId'] = item.lineItemDescription;
        rowDef['lineItemName'] = item.lineItemId;
        if (!this.securityArchitecture) {
          rowDef['totalAdjustment'] = this.utilitiesService.formatValue(item.totalAdjustment);
        }
        // rowDef['totalAdjustment'] = this.utilitiesService.formatValue(item.totalAdjustment);
        // if ComputedCredit then reasonCode and comment should be empty.
        rowDef['reasonCode'] = adjustedCredit ? item.reasonCode : '';
        rowDef['comment'] = adjustedCredit ? item.comment : '';
        rowDef['lineUpdated'] = item.lineUpdated;
        rowDef['suiteId'] = item.suiteId;
        // Iterate list of bundle types in the line item
        for (let bundle in item['bundles']) {
          // if credit type is available in the bundle type
          const credits = item['bundles'][bundle]['credits'];
          rowDef['lineBundle'] = item['bundles'];
          if (!metaDataMap.has(bundle)) {
            let headerCol: PaMetaData = {};
            headerCol.headerName = this.creditHeaderArray[bundle];
            metaDataMap.set(bundle, headerCol);
          }
          for (let key in credits) {
            const credit = credits[key];
            if (adjustedCredit) {
              rowDef[bundle + '_' + key] = credit.adjustedValue;
              rowDef['restore'] = credit.restore;
              if (!rowDef['adjusted']) {
                rowDef['adjusted'] = credit.adjusted;
              }
              if (credit.adjustedValue !== undefined && credit.adjustedValue !== null) {
                if (rowTotalAdjusmentMap.has(bundle + '_' + key)) {
                  let totalAdjustedValue = rowTotalAdjusmentMap.get(bundle + '_' + key);
                  rowTotalAdjusmentMap.set(bundle + '_' + key, totalAdjustedValue + credit.adjustedValue);
                } else {
                  rowTotalAdjusmentMap.set(bundle + '_' + key, credit.adjustedValue);
                }
              }
            } else {
              rowDef[bundle + '_' + key] = credit.computedValue;
              rowDef['restore'] = '';
              rowDef['adjusted'] = '';
              if (credit.computedValue !== undefined && credit.computedValue !== null) {
                orginalTotalAdjustment += credit.computedValue;
                if (rowTotalAdjusmentMap.has(bundle + '_' + key)) {
                  let totalOriginalValue = rowTotalAdjusmentMap.get(bundle + '_' + key);
                  rowTotalAdjusmentMap.set(bundle + '_' + key, totalOriginalValue + credit.computedValue);
                } else {
                  rowTotalAdjusmentMap.set(bundle + '_' + key, credit.computedValue);
                }
              }
            }
            rowDef[bundle + '_' + key + '_computedValue'] = credit.computedValue;
            const headerCol = metaDataMap.get(bundle);
            const children = headerCol.children;
            if (children) {
              let creditExist = false;
              for (const k in children) {
                const child = children[k];
                if (child.headerName === key) {
                  creditExist = true;
                  break;
                }
              }
              if (!creditExist) {
                const child = this.getChildColumn(key, bundle + '_' + key, 90, 'editCellRenderer');
                headerCol.children.push(child);
              }
            } else {
              headerCol.children = new Array<PaMetaData>();
              const child = this.getChildColumn(key, bundle + '_' + key, 90, 'editCellRenderer');
              headerCol.children.push(child);
            }
          }
          if (!adjustedCredit && !this.securityArchitecture) {
            rowDef['totalAdjustment'] = this.utilitiesService.formatValue(orginalTotalAdjustment);
          }
        }
        if (this.computedRowData.length === 0 || this.adjustedRowData.length === 0) {
          this.rowData.push(rowDef);
        }
      });
      for (let i = 0; i < this.creditHeaderOrder.length; i++) {
        const creditName = this.creditHeaderOrder[i];
        const colHeader = metaDataMap.get(creditName);
        if (colHeader) {
          this.allColoumnDefs.push(colHeader);
        }
      }
      // const totalAdjustcol = this.getChildColumn('Total Adjustment', 'totalAdjustment', 110, '');
      // totalAdjustcol.cellClass = 'text-right';
      // totalAdjustcol.pinned = 'right';
      const commentCol = this.getChildColumn('Comments', 'comment', 260, 'commentsCellRenderer');
      commentCol.cellClass = '';
      this.allColoumnDefs.push(commentCol);
      // totalAdjustcol.valueFormatter = this.currencyFormat;
      // this.allColoumnDefs.push(totalAdjustcol);
      if (!this.securityArchitecture) {
        const totalAdjustcol = this.getChildColumn('Total Adjustment', 'totalAdjustment', 110, '');
        totalAdjustcol.cellClass = 'text-right';
        totalAdjustcol.pinned = 'right';
        this.allColoumnDefs.push(totalAdjustcol);
      }
      const reasonCol = this.getChildColumn('Reason', 'reasonCode', 200, 'reasonCellRenderer');
      reasonCol.cellClass = 'reason-cell';
      reasonCol.pinned = 'right';
      this.allColoumnDefs.push(reasonCol);

      const actionCol = this.getChildColumn('Action', 'action', 80, 'actionCellRenderer');
      actionCol.pinned = 'right';
      actionCol.cellClass = '';
      this.allColoumnDefs.push(actionCol);
      let grandTotal = 0;
      rowTotalAdjusmentMap.forEach((value: number, key: string) => {
        this.rowTotalAdjusment[key] = rowTotalAdjusmentMap.get(key);
        grandTotal += rowTotalAdjusmentMap.get(key);
      });
      this.rowTotalAdjusment['totalAdjustment'] = this.utilitiesService.formatValue(grandTotal);
    }
    if (this.favCredit === 'ComputedCredit') {
      this.computedRowData = this.rowData;
      this.computedColDef = this.allColoumnDefs;
    } else {
      this.adjustedRowData = this.rowData;
      this.adjustedColDef = this.allColoumnDefs;
    }
    this.columnDefs = this.allColoumnDefs;
    return this.allColoumnDefs;

  }

  getChildColumn(headerName, fieldName, width, cellRenderer): PaMetaData {
    const ChildColumn: PaMetaData = {};
    ChildColumn.headerName = headerName;
    ChildColumn.field = fieldName;
    if (this.favCredit === 'AdjustedCredit') {
      ChildColumn.cellRenderer = cellRenderer;
      ChildColumn.cellClass = this.cellClassValue;
    } else {
      if (ChildColumn.headerName === 'Total Adjustment' || ChildColumn.headerName === 'Comments' || ChildColumn.headerName === 'Reason' ||
        ChildColumn.headerName === 'Action') {
        ChildColumn.cellRenderer = '';
      } else {
        ChildColumn.cellRenderer = (params) => {
          if (params.value) {
            return this.utilitiesService.formatValue(params.value);
          } else if (params.value === 0) {
            return '0';
          } else {
            return '';
          }
          // return params.value ? this.utilitiesService.formatValue(params.value) : ''
        };
      }
      ChildColumn.cellClass = '';
    }
    ChildColumn.suppressMenu = true;
    return ChildColumn;
  }

  lineItemRenderer(params) {
    const flag = '<span class="cu-name">' + params.value + '</span>'
      + `<div class="tooltip-custom"><span class="tooltiptext tooltip-right"><span class="arrow-right"></span> ${params.value}</span>
  </div>`;
  if (!params.node.rowPinned) {
    return flag;
  }
    else {
      return params.value;
    }
  }

  // for re-printing the grid on UI
  rePrintGrid() {
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      });
    }
  }
  currencyFormat(params) {
    return this.utilitiesService.formatValue(params.value);
  }



  // to set data in the grid
  getData() {
    if (this.favCredit === 'ComputedCredit' && this.computedRowData.length > 0 && this.adjustedRowData.length > 0) {
      // to avoid complex for loop and maintaining cope of rowData as all updated values in rowData array.
      this.adjustedRowData = this.rowData;
      this.rowData = this.computedRowData;
    } else if (this.favCredit === 'AdjustedCredit' && this.computedRowData.length > 0 && this.adjustedRowData.length > 0) {
      this.computedRowData = this.rowData;
      this.rowData = this.adjustedRowData;
    } else {
      this.rowData = [];
      // Iterate list of LineItems in the suite
      this.suiteData.suites[this.selectedSuiteId]['lineItems'].forEach((lineItem) => {
        let RowDef = new Object();
        let credits = [];
        RowDef['lineItemId'] = lineItem.lineItemDescription;
        if (this.appDataService.archName !== this.constantsService.SECURITY) {
          RowDef['totalAdjustment'] = this.utilitiesService.formatValue(lineItem.totalAdjustment);
        }

        // RowDef['totalAdjustment'] = this.utilitiesService.formatValue(lineItem.totalAdjustment);
        // if ComputedCredit then reasonCode and comment should be empty.
        RowDef['reasonCode'] = (this.favCredit === 'AdjustedCredit') ? lineItem.reasonCode : '';
        RowDef['comment'] = (this.favCredit === 'AdjustedCredit') ? lineItem.comment : '';
        RowDef['lineUpdated'] = lineItem.lineUpdated;
        RowDef['suiteId'] = lineItem.suiteId;

        for (let bundleType in lineItem['bundles']) {
          // if credit type is available in the bundle type
          if (lineItem['bundles'][bundleType].credits) {
            // Iterate list of credit types in the bundle type
            for (let creditType in lineItem['bundles'][bundleType].credits) {
              let creditTypeValue;
              let credit = lineItem['bundles'][bundleType]['credits'][creditType];
              if (this.favCredit === 'ComputedCredit') {
                creditTypeValue = credit.computedValue;
              } else {
                if (credit.adjusted) {
                  creditTypeValue = credit.adjustedValue;
                } else {
                  creditTypeValue = credit.computedValue;
                }
              }
              RowDef[bundleType + '_' + creditType] = creditTypeValue;
              // Construct an object for each credit data (cell level) in the bundle
              let creditObj = new Object();
              creditObj[bundleType] = bundleType;
              creditObj[creditType] = creditType;
              creditObj[bundleType + '_' + creditType] = bundleType + '_' + creditType;
              creditObj['fieldName'] = bundleType + '_' + creditType;
              creditObj['adjusted'] = credit.adjusted;
              creditObj['adjustedValue'] = credit.adjustedValue;
              creditObj['computedValue'] = credit.computedValue;
              creditObj['restore'] = credit.restore;
              creditObj['lineUpdated'] = false;
              credits.push(creditObj);

              // set cell class to 'restoreValue' if its adjusted flag is true
              if (this.allColoumnDefs.length > 0) {
                for (let i = 0; i < this.allColoumnDefs.length; i++) {
                  if (this.allColoumnDefs[i].headerName === this.creditHeaderArray[bundleType]) {
                    if (this.allColoumnDefs[i].children && this.allColoumnDefs[i].children.length > 0) {
                      for (let j = 0; j < this.allColoumnDefs[i].children.length; j++) {
                        // RequestAdjustmentComponent.updated = false;
                        if (this.allColoumnDefs[i].children[j].headerName === creditType) {
                          if (credit.adjusted && this.favCredit === 'AdjustedCredit') {
                            // RequestAdjustmentComponent.updated = true;
                            this.allColoumnDefs[i].children[j].cellClass = this.cellClassValue;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          RowDef['credits'] = credits;
        }
        this.rowData.push(RowDef);
        // creating a copy of ComputedCredit and AdjustedCredit data.
        if (this.favCredit === 'ComputedCredit') {
          this.computedRowData = this.rowData;
        } else {
          this.adjustedRowData = this.rowData;
        }
      });
    }
  }

  onCellClicked($event) {
    if ($event.colDef.field === 'action') {
      const dropdownClass = $event.event.target.classList.value;
      const isRestore = dropdownClass.search('text-link');
      if (isRestore > -1) {
      }
    }
  }

  // cellClassValue(params) {
  //   if (!params.node.rowPinned && params.value !== undefined) {
  //     // params.data.credits.forEach(element => {
  //     //   if(element.adjusted){
  //     //     return 'restoreValue';
  //     //   }
  //     // });
  //     if(params.value < 0){
  //      return 'restoreValue';
  //     }
  //   }
  // }

  cellClassValue(params) {
    if (!params.node.rowPinned && params.value !== undefined) {
      const fieldName = params.colDef.field;
      const computedField = fieldName + '_computedValue';
      // if(this.favCredit === 'AdjustedCredit'){
      if (params.data[fieldName] !== params.data[computedField]) {
        return 'restoreValue editableCell text-right';
      } else {
        return 'editableCell text-right';
      }
      // }
    } else if (params.node.rowPinned) {
      return 'text-right';
    }
  }

  rowClass(param, data) {
    const rownode = this.gridOptions.api.getRowNode(param.node.id);
    const cssClass = 'editable-rows';
    this.gridOptions.getRowClass = params => {
      if (this.editedNodeId.includes(params.node.id) && params.node.id !== param.node.id) {
        return cssClass;
      }
      if (params.node.id === param.node.id && param.data.adjusted) {
        // for (let i = 0; i < param.data.credits.length; i++) {
        // if (param.data.credits[i].adjustedValue !== param.data.credits[i].computedValue) {
        this.editedNodeId.push(param.node.id);
        return cssClass;
        // }
        // }
      }
    };
    rownode.setDataValue(param.colDef.field, data);
    // this.editedNodeId.push(param.node.id);
    this.gridOptions.api.redrawRows(param.node);
  }

  totalValue(params) {
    const val = params.data.c1Advanced + params.data.c1Foundation + params.data.alcAdvanced + params.data.alcFoundation;
    return val;
  }

  // updateRowData(){
  //   console.log(params);
  // }

  close() {
    // Clears the status messages if any
    this.messageService.clear();
    this.bsModalRef.hide();
    // for readonly view stop loading PE page again after closing modal
    if (!this.readOnlyView) {
      // should be called before closing model to show price estimate related errors(if any) on PE page.
      this.priceEstimationService.reloadPriceEstimateEmitter.emit('&path=pa');
    }
  }

  // Saves data and close the popup(done)
  saveAndClose() {
    // Clears the status messages if any
    this.messageService.clear();
    // dont show success msg in case of done as it will be displayed on price estimation page.
    this.successMsgOnSave = false;
    // isAdjustmentUpdated will be true if user has modified something in grid.
    if (this.showGrid && this.requestAdjustmentService.isAdjustmentUpdated) {
      this.save();
    } else {
      this.priceEstimationService.reloadPriceEstimateEmitter.emit('&path=pa');
      this.bsModalRef.hide();
    }
  }

  // Saves data but don't close the popup(save Adjustment)
  save() {
    let iterationCount = 0;
    // Set hasErrors flag to false
    this.suiteData.hasErrors = false;
    const lineItemMap = new Map<string, Object>();
    // Romesh changes
    const totalNumberOfRow = this.rowData.length;
    for (let i = 0; i < totalNumberOfRow; i++) {
      const lineItem = this.rowData[i];
      if (lineItem.lineUpdated || lineItem.restore) {
        for (let bundle in lineItem['lineBundle']) {
          // if credit type is available in the bundle type
          const credits = lineItem['lineBundle'][bundle]['credits'];
          lineItemMap.set(lineItem['lineItemName'], lineItem['lineBundle']);
          for (let key in credits) {
            const credit = credits[key];
            //If cell value updated
            if (lineItem.lineUpdated && (lineItem[bundle + '_' + key] !== lineItem[bundle + '_' + key + '_computedValue'])) {
              let value = lineItem[bundle + '_' + key];
              if (isNaN(value)) {
                // remove all comma separators from the string value (Ex: -1,222,222.00)
                value = parseFloat((lineItem[bundle + '_' + key]).replace(/,/g, ''));
              }
              credit.adjustedValue = value;
              credit.adjusted = true;
            } //If row or cell value restored
            else if (lineItem.restore || (lineItem.lineUpdated && (lineItem[bundle + '_' + key] === lineItem[bundle + '_' + key + '_computedValue']))) {
              let value = lineItem[bundle + '_' + key + '_computedValue'];
              if (isNaN(value)) {
                // remove all comma separators from the string value (Ex: -1,222,222.00)
                value = parseFloat((lineItem[bundle + '_' + key]).replace(/,/g, ''));
              }
              credit.adjustedValue = value;
              credit.adjusted = false;
              credit.computedValue = value;
              credit.restore = true;
              lineItem.lineUpdated = true;
            }
          }
        }
      }
    }
    const lineItemsForRequest = [];
    // Iterate list of LineItems in the suite
    this.suiteData.suites[this.selectedSuiteId]['lineItems'].forEach((lineItem) => {
      // Set values from rowData(latest data) to suiteData(original data)
      // lineItem.lineItemId = this.rowData[iterationCount]['lineItemId'];
      if (lineItemMap.has(lineItem.lineItemId)) {
        //      lineItem.totalAdjustment = this.rowData[iterationCount]['totalAdjustment'];
        delete lineItem.totalAdjustment;
        lineItem.reasonCode = this.rowData[iterationCount]['reasonCode'];
        lineItem.comment = this.rowData[iterationCount]['comment'];
        lineItem.lineUpdated = true;
        lineItem.suiteId = this.rowData[iterationCount]['suiteId'];
        lineItem['bundles'] = lineItemMap.get(lineItem.lineItemId);
        lineItemsForRequest.push(lineItem);
      }
      iterationCount++;
    });

    // Create request obj
    const requestObject = {};
    this.suiteData.suites[this.selectedSuiteId]['lineItems'] = lineItemsForRequest;
    // Set data in the request object
    requestObject['data'] = this.suiteData;
    requestObject['data']['comment'] = this.proposalLevelComments;


    this.requestAdjustmentService.savePurchaseAdjustment(requestObject).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        this.suiteData = response.data;
        this.reasons = response.data.reasons;
        this.requestAdjustmentService.reasonsArray = response.data.reasons;
        this.columnDefs = this.getMetaDataAndData();
        this.adjustedRowData = [];
        this.computedRowData = [];
        this.editedNodeId = [];
        if (this.gridOptions.api) {
          this.gridOptions.api.setRowData(this.rowData);
          setTimeout(() => {
            this.gridOptions.api.sizeColumnsToFit();
          }, 0);
        }
        // Iterate list of LineItems in the suite
        this.suiteData.suites[this.selectedSuiteId]['lineItems'].forEach((lineItem) => {
          for (let bundleType in lineItem['bundles']) {
            // if message object is available in the bundle type
            if (lineItem['bundles'][bundleType].message && lineItem['bundles'][bundleType].message.hasError == true) {
              lineItem['bundles'][bundleType].message.messages.forEach((element) => {
                this.messageService.displayMessages(this.appDataService.setMessageObject(lineItem.lineItemDescription + ' : ' +
                  this.creditHeaderArray[bundleType] + ' : ' + element.text, MessageType.Error), true);
              });
            }
          }
        });

      } else if (response && response.error) {
        this.messageService.displayMessagesFromResponse(response);
        this.successMsgOnSave = true;
      } else {
        // isAdjustmentUpdated should be false as we have no new changes after save.
        this.requestAdjustmentService.isAdjustmentUpdated = false;
        this.adjustedRowData = [];
        this.computedRowData = [];
        this.editedNodeId = [];
        this.getPurchaseAdjustmentData(this.proposalId, this.selectedSuiteId);
        this.gridOptions.getRowClass = params => {
          return '';
        };
        if (this.successMsgOnSave) {
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
            'purchaseadjustment.SAVE_SUCCESS'), MessageType.Success));
        } else {
          this.priceEstimationService.reloadPriceEstimateEmitter.emit();
          this.bsModalRef.hide();
        }
      }
    }, (error: any) => {
      this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
        'purchaseadjustment.SAVE_FAILED'), MessageType.Error));
    });
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  dropped(evt: any) {
    this.processFile(evt[0]);
    console.log(evt);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    console.log(target);
    this.processFile(target.files[0]);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  processFile(file) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    this.qualService.fileFormatError = false;
    if (['xlsx'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.qualService.fileFormatError = true;
      this.qualService.qualification.customerInfo.filename = file.name;
    } else {
      const formData = new FormData();
      formData.append(fileName, file);
      this.requestAdjustmentService.uploadPdfFile(file, this.proposalId).subscribe((response: any) => {
        if (!response.error && !response.messages) {
          this.qualService.qualification.customerInfo.filename = fileName;
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
            'purchaseadjustment.UPLOAD_SUCCESS'), MessageType.Success));
        } else {
          this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
            'purchaseadjustment.UPLOAD_FAILED'), MessageType.Error));
        }
      });
    }
  }

  removeItem() {
    this.requestAdjustmentService.removeFile(this.proposalId).subscribe((res: any) => {
      if (!res.error) {
        this.uploader.queue.length = 0;
        this.qualService.fileFormatError = false;
        this.qualService.qualification.customerInfo.filename = '';
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  globalSwitchChangeFavProspects(event) {
    // Clears the status messages if any
    // this.messageService.clear();
    this.favCredit = (event) ? 'ComputedCredit' : 'AdjustedCredit';
    this.favProspects = event;
    // If switch changes, updates the grid data
    this.getMetaDataAndData();
    if (this.favCredit === 'AdjustedCredit') {
      if (this.gridOptions.api) {
        this.gridOptions.api.setRowData(this.rowData);
      }
    }
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 0);
  }

  changeSuite(value) {
    setTimeout(() => {
      this.myDropsearch.close();
    });
    // stop opening the modal window for changing the suites in the dropdown for read only view
    if (!this.readOnlyView) {
      const modalRef = this.modalVar.open(SuiteSwitchWarningComponent, { windowClass: 'infoDealID' });
      modalRef.componentInstance.showSuiteChangeWarning = true;
      modalRef.result.then((result) => {
        if (result.continue) {
          this.changeSuitesForAdjustment(value);
        }
      });
    } else {
      this.changeSuitesForAdjustment(value);
    }
  }

  // method for changing the suites in the dropdown and resetting the changes if not saved
  changeSuitesForAdjustment(value) {
    // Clears the status messages if any
    this.messageService.clear();
    this.requestAdjustmentService.reasonCounter = 0;
    // isAdjustmentUpdated should be false as after changing suite we have no updated values in the grid.
    this.requestAdjustmentService.isAdjustmentUpdated = false;
    this.adjustedRowData = [];
    this.computedRowData = [];
    this.editedNodeId = [];
    this.favProspects = false;
    this.favCredit = 'AdjustedCredit';
    this.selectedSuiteName = value.name;
    this.selectedSuiteId = value.suiteId;
    this.getPurchaseAdjustmentData(this.proposalId, this.selectedSuiteId);
    this.gridOptions.getRowClass = params => {
      return '';
    };
  }

  setTopPinedData() {
    const result = {
      lineItem: 'Grand Total',
      c1Foundation: 0,
      alcFoundation: 0,
      swssFoundation: 0,
      c1Advanced: 0,
      alcAdvanced: 0,
      swssAdvanced: 0
    };
    this.gridApi.setPinnedTopRowData([result]);
  }

  public onCellValueChanged($event) { }

  downloadTemplate() {
    this.requestAdjustmentService.downloadTemplate().subscribe((response: any) => {
      this.generateFileName(response);
    });
  }

  generateFileName(res) {
    let x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; // res.headers.get("content-disposition").substring(x+1) ;
    filename = filename.replace(/"/g, '');
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) { // IE & Edge
      // msSaveBlob only available for IE & Edge
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

}


interface PaMetaData {
  field?: string;
  headerName?: string;
  cellClass?: any;
  suppressMenu?: boolean;
  width?: number;
  pinned?: string;
  children?: PaMetaData[];
  cellRenderer?: any;
  valueFormatter?: any;
}
