import { ProductSummaryService } from './../../dashboard/product-summary/product-summary.service';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { ProspectDetailSubsidiaryService } from './prospect-detail-subsidiary.service';
import { HeaderService } from '../../header/header.service';
import {
  ArchitectureMetaDataFactory,
  ArchitectureMetaDataJson
} from '../../dashboard/product-summary/product-summary.component';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProspectDetailsService } from '../prospect-details.service';
import { GridInitializationService } from '../../shared/ag-grid/grid-initialization.service';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { Subject ,  Subscription } from 'rxjs';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-prospect-detail-subsidiary',
  templateUrl: './prospect-detail-subsidiary.component.html',
  styleUrls: ['./prospect-detail-subsidiary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProspectDetailSubsidiaryComponent implements OnInit {
  @Input() allArchitectureView: boolean;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  viewdata: string;
  subsidiaryData: any[];
  columnHeaderList: any[];
  private components;
  architectureName: string;
  customerName: string;
  clickedCustomerName: string = undefined;
  customerIds: Array<string>;
  customerIdSet: any = new Set();
  sortingObject: any;
  navigationSubscription: any;
  subscription: Subscription;
  public domLayout;

  // tslint:disable-next-line:max-line-length
  constructor(
    public prospectdetailSubsidiaryService: ProspectDetailSubsidiaryService,
    private utilitiesService: UtilitiesService,
    private router: Router,
    public headerService: HeaderService,
    private appDataService: AppDataService,
    public prospectdetailService: ProspectDetailsService,
    private messageService: MessageService,
    private gridInitialization: GridInitializationService,
    private productSummaryService: ProductSummaryService,
    private blockUiService: BlockUiService,
    public constantsService: ConstantsService
  ) {
    this.gridOptions = <GridOptions>{};
    gridInitialization.initGrid(this.gridOptions);

    // if(this.appDataService.archName !== 'SEC')
    //   this.createColumnDefs();

    this.showGrid = true;
    this.gridOptions.headerHeight = 35;
    // this.gridOptions.defaultColDef = {
    //   // headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
    //   headerComponentParams: {
    //     menuIcon: 'fa-bars'
    //   }
    // };
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     this.blockUiService.spinnerConfig.unBlockUI();
    //   }
    // });

    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }
    };
    this.domLayout = 'autoHeight';

    this.components = { innerCellRenderer: this.innerCellRenderer() };
  }

  // View dropdown feature in pagination
  onPageSizeChanged($event: any) {
    this.gridOptions.api.paginationSetPageSize(Number(this.viewdata));
  }

  getSubsidiaryData() {
    try {
      this.prospectdetailSubsidiaryService.loadSubsidiaryData(null);
    } catch (error) {
      // console.log('hereeee')
      // this.messageService.displayUiTechnicalError(error);
    }

    setTimeout(() => {
      // this.utilitiesService.setTableHeight();
    });
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.prospectDetailsBySubsidiary;
    this.customerIds = [];
    if (this.appDataService.archName !== this.constantsService.SECURITY)
      this.createColumnDefs();
    this.getSubsidiaryData();
    this.gridOptions.onSortChanged = () => {
      // console.log(this.gridOptions.api.getSortModel());
      this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
    };
    this.prospectdetailSubsidiaryService.subsidiaryDataEmitter.subscribe(
      (gridData: Array<{}>) => {
        setTimeout(() => {
          //  this.utilitiesService.setTableHeight();
        });

        if (
          this.gridOptions.api === null ||
          this.gridOptions.api === undefined
        ) {
          this.gridOptions = <GridOptions>{
            onGridReady: () => {
              this.gridOptions.rowData = gridData;
              this.gridOptions.headerHeight = 35;
            }
          };
          // this.gridOptions.onGridReady();
        } else {
          this.gridOptions.api.setRowData(gridData);
          setTimeout(() => {
            this.gridOptions.api.sizeColumnsToFit();
          }, 0);
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        }
        if (this.gridOptions.api !== undefined) {
          this.gridOptions.api.forEachNode(rowNode => {
            // console.log(rowNode);
            if (rowNode.level === 0 && this.prospectdetailSubsidiaryService.subsidiaryData.length === 1) {
              rowNode.setExpanded(true);
              this.customerIdSet.add('G' + rowNode.data.END_CUSTOMER_ID);
              this.customerIds.push('G' + rowNode.data.END_CUSTOMER_ID);
            }
          });
        }
      });

    this.appDataService.cleanCoreAuthorizationCheck().subscribe((resp: any) => {
      // console.log(resp);
      if (resp && resp.data) {
        this.prospectdetailService.displayManageLocation$.next(resp.data.eligible);
        // this.showCleanCoreButton = resp.data.eligible;
      }
    });

    // this.subscription  =  this.prospectdetailService.reloadSuites.subscribe((path:any) =>{
    //   if(this.appDataService.archName !== this.constantsService.SECURITY){
    //     this.createColumnDefs();
    //   }
    //   this.getSubsidiaryData();
    // })
  }

  updateRowDataOnSort(sortColObj: any) {
    // console.log(JSON.stringify(sortColObj));
    if (sortColObj && sortColObj.length === 0) {
      sortColObj = this.sortingObject;
      if (sortColObj[0].sort === 'asc') {
        sortColObj[0].sort = 'desc';
      } else {
        sortColObj[0].sort = 'asc';
      }
    } else {
      this.sortingObject = sortColObj;
    }
    const sortingType = this.sortingObject[0].sort;
    const sortingField = this.sortingObject[0].colId;
    try {
      this.utilitiesService.getSortedData(
        this.prospectdetailSubsidiaryService.subsidiaryData,
        sortingType,
        sortingField
      );
    } catch (error) {
      // console.log('hereeee')
      this.messageService.displayUiTechnicalError(error);
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(
        this.prospectdetailSubsidiaryService.subsidiaryData
      );
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 0);
    }

    this.gridOptions.api.forEachNode(node => {
      // for expanding the node level
      let id = '';
      if (node.level === 0) {
        id = 'G' + node.data.END_CUSTOMER_ID;
      } else {
        id = 'H' + node.data.END_CUSTOMER_ID;
      }
      if (this.isExpandedRow(id)) {
        node.setExpanded(true);
      }
    });
  }

  private createColumnDefs() {
    const thisInstance = this;
    const subsidiaryMetaData = this.appDataService.getDetailsMetaData(
      'PROSPECT_SUBSIDARY'
    );
    this.prospectdetailSubsidiaryService.prepareSubsidiaryMetaData(
      subsidiaryMetaData.columns,
      this
    );
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount =
        processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  innerCellRenderer() {
    function innerCellRenderer() { }
    let tempDiv;
    innerCellRenderer.prototype.init = function (params) {
      // tslint:disable-next-line:max-line-length
      if (params.node.level === 1) {
        // tslint:disable-next-line:max-line-length
        tempDiv =
          params.value;
      } else {
        tempDiv = params.value;
      }
      this.eGui = tempDiv;
    };
    innerCellRenderer.prototype.getGui = function () {
      return this.eGui;
    };
    return innerCellRenderer;
  }

  currencyFormat(params, thisInstance) {
    // return thisInstance.utilitiesService.formatValue(params.value);
    return thisInstance.utilitiesService.formatWithNoDecimal(params.value);
  }

  // startQualRenderer(params) {
  //   return '<div class='startQualBtn'> <button type='button' class='btn btn-primary qualification' >Start Qualification</button></div>';
  // }

  gotoSuites() {
    this.router.navigate(['/prospect-details-suites']);
  }

  gotoGeography() {
    this.router.navigate(['/prospect-details-region']);
  }

  public onModelUpdated() {
    // //console.log('onModelUpdated');
    this.calculateRowCount();
  }

  public onReady() {
    // //console.log('onReady');
    this.calculateRowCount();
    // this.gridOptions.api.sizeColumnsToFit();
  }

  ngOnDestroy() {
    this.appDataService.persistErrorOnUi = false;
    // this.subscription.unsubscribe(); 
  }


  public onCellClicked($event) {
    let dropdownClass;
    let isQualification;
    if ($event.event && $event.event.target) {
      dropdownClass = $event.event.target.classList.value;
    }
    if (dropdownClass) {
      isQualification = dropdownClass.search('qualification');
    }
    if (isQualification > -1) {
      this.appDataService
        .redirectForCreateQualification()
        .subscribe((response: any) => {
          // console.log($event);
          // if (response && response.value === 'N') {
          //  this.router.navigate(['/qualifications', {
          //    architecture: this.productSummaryService.prospectInfoObject.architecture
          //  , customername: $event.value
          // , customerId: $event.data.END_CUSTOMER_ID
          // }]);
          // }
          // else {
          const customerName = encodeURIComponent($event.value);
          const customerStr = ';GUName=' + customerName + ';hierlvl=HQ';
          this.productSummaryService.getUrlToNavigate(customerStr);
          // }
        });
    }
    if (this.subsidiaryData && this.subsidiaryData[0].children)
      console.log(
        `total number of rows ${this.subsidiaryData[0].children.length}`
      );

    // console.log($event);

    const children = $event.data.children;
    if (
      $event.data.END_CUSTOMER_ID
    ) {
      console.log(this.customerIdSet);
      let x = '';
      if ($event.node.level === 0) {
        x = 'G' + $event.data.END_CUSTOMER_ID;
      } else {
        x = 'H' + $event.data.END_CUSTOMER_ID;
      }
      if (!this.customerIdSet.has(x)) {
        // set checks if the node was collapsed or expanded
        // this.customerIds.push($event.data.END_CUSTOMER_ID);
        // this.customerIdSet.add($event.data.END_CUSTOMER_ID);
        if ($event.node.level === 0) {
          let guId = 'G' + $event.data.END_CUSTOMER_ID;
          this.customerIds.push(guId);
          this.customerIdSet.add(guId);
          // this.customerGuId = guId;
        } else {
          // if($event.node.level === 1) {
          let hqId = 'H' + $event.data.END_CUSTOMER_ID;
          this.customerIds.push(hqId);
          this.customerIdSet.add(hqId);
        }
      } else {
        this.customerIdSet.delete(x);
        this.customerIds = [];
        this.customerIdSet.forEach(customerId => {
          this.customerIds.push(customerId);
        });
      }
    }
    const selectedRow = this.gridOptions.api.getSelectedRows();

    const endCustomerId = $event.data['END_CUSTOMER_ID'];
    const request = this.prospectdetailSubsidiaryService.loadSubsidiaryRequest;
    request.hqId = endCustomerId;
    // console.log(this.gridOptions.api.onGroupExpandedOrCollapsed());
    let subsidiaryDataForThirdLevel: Array<any> = [];
    // console.log(this.gridOptions.api.getFocusedCell());

    if (
      $event.rowIndex !== 0 &&
      $event.data.children &&
      $event.data.children.length === 0
    ) {
      this.prospectdetailSubsidiaryService
        .getSubsidiaryData(request)
        .subscribe((response: any) => {
          if (response && !response.error) {
            try {
              this.clickedCustomerName = $event.value;
              const subsidiaryData = response.data;
              for (let i = 0; i < subsidiaryData.length; i++) {
                const subsidiaryRow = subsidiaryData[i];
                if (subsidiaryRow.column) {
                  const record = { CUSTOMER_GU_NAME: subsidiaryRow.name };
                  const colData = subsidiaryRow.column;
                  for (let j = 0; j < colData.length; j++) {
                    const subsidiaryColData = colData[j];
                    record[subsidiaryColData.name] = subsidiaryColData.value;
                  }
                  subsidiaryDataForThirdLevel.push(record);
                }
              }
              let currentRowData = this.prospectdetailSubsidiaryService.subsidiaryDataMap.get(
                endCustomerId
              );
              currentRowData.children = subsidiaryDataForThirdLevel;

              if (this.gridOptions.api) {
                this.gridOptions.api.setRowData(
                  this.prospectdetailSubsidiaryService.subsidiaryData
                );
                setTimeout(() => {
                  this.gridOptions.api.sizeColumnsToFit();
                }, 0);
                this.gridOptions.api.forEachNode(node => {
                  let id = '';
                  if (node.level === 0) {
                    id = 'G' + node.data.END_CUSTOMER_ID;
                  } else {
                    id = 'H' + node.data.END_CUSTOMER_ID;
                  }
                  if (this.isExpandedRow(id)) {
                    node.setExpanded(true);
                  }
                });

                this.gridOptions.api.ensureIndexVisible(
                  $event.rowIndex + 5,
                  undefined
                );
              }
            } catch (error) {
              // console.log(error);
              this.messageService.displayUiTechnicalError(error);
            }
          } else {
            // this.messageService.displayMessagesFromResponse(response);
            this.prospectdetailSubsidiaryService.showNoDataMsg = true;
          }
        });
    }
  }

  private isExpandedRow(endCustomerId: string) {
    let expandedRow = false;
    for (let i = 0; i < this.customerIds.length; i++) {
      if (this.customerIds[i] === endCustomerId) {
        expandedRow = true;
        break;
      }
    }
    return expandedRow;
  }

  public onCellValueChanged($event) {
    // //console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  public onCellDoubleClicked($event) {
    // //console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellContextMenu($event) {
    // //console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellFocused($event) {
    // //console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  public onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // //console.log('onRowSelected: ' + $event.node.data.name);
  }

  public onSelectionChanged() {
    // //console.log('selectionChanged');
  }

  public onBeforeFilterChanged() {
    // //console.log('beforeFilterChanged');
  }

  public onAfterFilterChanged() {
    // //console.log('afterFilterChanged');
  }

  public onFilterModified() {
    // //console.log('onFilterModified');
  }

  public onBeforeSortChanged() {
    //  //console.log('onBeforeSortChanged');
  }

  public onAfterSortChanged() {
    // console.log('onAfterSortChanged');
    // console.log(this.prospectdetailSubsidiaryService.subsidiaryData);
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(
        this.prospectdetailSubsidiaryService.subsidiaryData
      );
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 0);
    }
  }

  public onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // //console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  public onRowClicked($event) {
    //  //console.log('onRowClicked: ' + $event.node.data.name);
  }

  onRowGroupOpened($event) {
    if ($event.node.level === 1) {
      this.onCellClicked($event);
    }
  }
  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  public onColumnEvent($event) {
    // //console.log('onColumnEvent: ' + $event);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
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
}
