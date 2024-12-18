import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AllArchitectureViewService } from '@app/all-architecture-view/all-architecture-view.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConsumptionCellComponent } from './consumption-cell/consumption-cell.component';
import { ConsumptionHeaderComponent } from './consumption-header/consumption-header.component';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-agreement-consumption',
  templateUrl: './agreement-consumption.component.html',
  styleUrls: ['./agreement-consumption.component.scss']
})
export class AgreementConsumptionComponent implements OnInit, OnDestroy, OnChanges {
  public gridOptions: GridOptions;
  public rowData: any;
  public columnDefs: any;
  public trueForward = false;
  public trueForwardSwitch = false;
  @Input() public virtualAccountId: any;
  public domLayout;
  @Input() public subscriptionId: any;

  constructor(public allArchitectureViewService: AllArchitectureViewService,
    public messageService: MessageService,
    public utilitiesService: UtilitiesService,
    private currencyPipe: CurrencyPipe
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 42;
    this.domLayout = 'autoHeight';
    this.gridOptions.frameworkComponents = {
      valueCellRenderer: <{ new(): ConsumptionCellComponent }>(
        ConsumptionCellComponent
      )
    };
  }

  ngOnInit() {
    this.allArchitectureViewService.searchDropDown = false;
    this.getColumns();
    this.getData();
  }

  ngOnDestroy() {
    this.allArchitectureViewService.searchDropDown = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['virtualAccountId'] && changes['virtualAccountId'].currentValue !== changes['virtualAccountId'].previousValue) {
      this.trueForward = false;
      this.trueForwardSwitch = false;
      this.getColumns();
      this.getData();
    }
  }

  getColumns() {
    const columnDefs = [{
      'headerName': 'Suite',
      'field': 'suiteName',
      'cellRenderer': 'group',
      'pinned': 'left',
      'width': 275,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Entitlements',
      'children': [{
        'headerName': 'EA Purchased Entitlements',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'entitlementCell dollar-align',
        'field': 'pucrhasedEntitlements',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true

      },
      {
        'headerName': 'Growth Allowance',
        'field': 'growthAllowance',
        'cellClass': 'entitlementCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true

      },
      {
        'headerName': 'Total EA Entitlements',
        'field': 'totalEntitlements',
        'cellClass': 'entitlementCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true

      }]
    },
    {
      'headerName': 'Consumption',
      'children': [{
        'headerName': 'Pre-EA Consumption',
        'field': 'preEAConsumption',
        'cellClass': 'consumptionCell split dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'Licenses Generated',
        'field': 'licenseGenerated',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true

      },
      {
        'headerName': 'Licenses Migrated',
        'field': 'licenseMigrated',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'Migrated EA Consumption',
        'field': 'c1ToDNAMigratedCount',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true
      },
      {
        'headerName': 'Total Consumption',
        'field': 'totalConsumption',
        'cellClass': 'consumptionCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 130,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true

      }]
    },
    {
      'headerName': 'Remaining Entitlement',
      'field': 'remainingEntitlements',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'pinned': 'right',
      'width': 130,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Consumption Method',
      'field': 'calculationMethod',
      'pinned': 'right',
      'width': 130,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    }];

    this.columnDefs = columnDefs;

    // for(let i= 0; i < this.columnDefs.length; i++) {
    //   const column = this.columnDefs[i];
    //   if(column.cellRenderer === 'valueCellRenderer') {
    //     column.cellRenderer = this.valueCellRenderer.bind(this)
    //   }
    //   if (column.children) {
    //     for (let j= 0; j < column.children.length; j++){
    //       const childColumn = column.children[j]
    //       if(childColumn.cellRenderer === 'valueCellRenderer') {
    //         childColumn.cellRenderer = this.valueCellRenderer.bind(this);
    //       }
    //     }
    //   }
    // }


    if (this.gridOptions && this.gridOptions.api) {
      this.gridOptions.api.setColumnDefs(this.columnDefs);
    }


  }

  getNodeChildDetails(rowItem) {
    if (rowItem.commerceSkus) {
      return {
        group: true,
        children: rowItem.commerceSkus,
        key: rowItem.group
      };
    } else if (rowItem.billingskuDetails) {
      return {
        group: true,
        children: rowItem.billingskuDetails,
        key: rowItem.group
      };
    } else {
      return null;
    }
  }

  getData() {

    // this.rowData = this.dummyresponse.data.suites;
    this.allArchitectureViewService.getConsumptionData(this.allArchitectureViewService.smartAccountId, this.virtualAccountId, this.subscriptionId)
      .subscribe((response: any) => {
        try {
          if (response && response.data && !response.error) {
            if (response.data.suites) {
              const jsonstr = JSON.stringify(response.data.suites);
              const jsonstr_new = jsonstr.replace(/"commerceSku"/g, '"suiteName"');
              const suites = JSON.parse(jsonstr_new);
              for (let i = 0; i < suites.length; i++) {
                for (const propt in suites[i]) {
                  if (suites[i][propt] === 0 || suites[i][propt] === '0.0') {
                    suites[i][propt] = '--';
                  }
                }
              }
              this.rowData = suites;
              if (this.gridOptions.api) {
                // this.gridOptions.api.setRowData(this.rowData);
                this.gridOptions.api.setRowData(this.rowData);
              }
            }

          } else {
            this.messageService.displayMessagesFromResponse(response);
            this.rowData = [];
          }
        } catch (error) {
          this.rowData = [];
          this.messageService.displayUiTechnicalError(error);
        }
      });
  }

  valueCellRenderer(params) {
    return this.formatWithNoDecimal(params.value);
  }

  formatWithNoDecimal(value) {
    let val: any;
    if (val === '--') {
      return val;
    }
    if (value !== undefined || value !== null) {
      val = this.currencyPipe.transform(value, 'USD', 'symbol');
      if (val !== null) {
        val = val.replace(/\$/gi, ''); /*Remove $ from formatted text */
        val = val.replace(/(\.[0-9]*?)0+/g, ''); // Removes decimal values
      }
      return val;
    }
  }

  toggleConsumptionView(event?) {
    this.trueForward = !this.trueForward;
    if (this.trueForward) {
      this.getTrueFowardColumn();
      this.getTrueForwardData();
    } else {
      this.getColumns();
      this.getData();
    }
  }

  getTrueFowardColumn() {
    const columnDefs = [{
      'headerName': 'Suite',
      'field': 'suiteName',
      'cellRenderer': 'group',
      'pinned': 'left',
      'width': 240,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    }, {
      'headerName': 'EA Duration (Months)',
      'field': 'eaDuration',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'Remaining Duration (Months)',
      'field': 'remainingDuration',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'Entitlements',
      'children': [{
        'headerName': 'EA Purchased Entitlements',
        'cellRenderer': 'valueCellRenderer',
        'cellClass': 'entitlementCell dollar-align',
        'field': 'purchasedEntitlements',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'

      },
      {
        'headerName': 'Growth Allowance',
        'field': 'growthAllowance',
        'cellClass': 'entitlementCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'

      },
      {
        'headerName': 'Total EA Entitlements',
        'field': 'totalEntitlements',
        'cellClass': 'entitlementCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'
      },
      {
        'headerName': 'Total EA Entitlements',
        'field': 'totalEntitlements',
        'cellClass': 'entitlementCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'closed'

      }]
    },
    {
      'headerName': 'Consumption',
      'children': [{
        'headerName': 'Pre-EA Consumption',
        'field': 'preEAConsumption',
        'cellClass': 'consumptionCell split dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'
      },
      {
        'headerName': 'Licenses Generated',
        'field': 'licenseGenerated',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'

      },
      {
        'headerName': 'Licenses Migrated',
        'field': 'licenseMigrated',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'minWidth': 60,
        'headerClass': 'text-right',
        'suppressMenu': true,
        'columnGroupShow': 'open'

      },
      {
        'headerName': 'Migrated EA Consumption',
        'field': 'c1ToDNAMigratedCount',
        'cellClass': 'consumptionCell dollar-align',
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true,
        'columnGroupShow': 'open'
      },
      {
        'headerName': 'Total Consumption',
        'field': 'totalConsumption',
        'cellClass': 'consumptionCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true,
        'columnGroupShow': 'open'
      },
      {
        'headerName': 'Total Consumption',
        'field': 'totalConsumption',
        'cellClass': 'consumptionCell dollar-align',
        'headerComponentFramework': <{ new(): ConsumptionHeaderComponent }>(
          ConsumptionHeaderComponent),
        'cellRenderer': 'valueCellRenderer',
        'width': 180,
        'headerClass': 'text-right',
        'minWidth': 60,
        'suppressMenu': true,
        'columnGroupShow': 'closed'

      }]
    },
    {
      'headerName': 'Remaining Entitlement',
      'field': 'remainingEntitlements',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    }, {
      'headerName': 'Consumption Test Count',
      'field': 'consumedTestCount',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'List Price',
      'field': 'listPrice',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Discounts (%)',
      'field': 'discount',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Initial net AMT W/O PPA',
      'field': 'initialNetAmt',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    }
      ,
    {
      'headerName': 'True Forward Event Order Qty',
      'field': 'tfOrderQty',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Residual Entitlements Value at True Forward',
      'field': 'tfResidualEntitlementValue',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Consumption Net Value at True Forward',
      'field': 'tfConsumptionNetValue',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'CCW Change Subscription Qty',
      'field': 'ccwSubSkuQty',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'CCW Change Subscription Amt',
      'field': 'ccwSubAmt',
      'cellRenderer': 'valueCellRenderer',
      'cellClass': 'dollar-align',
      'width': 180,
      'headerClass': 'text-right',
      'minWidth': 60,
      'suppressMenu': true
    },
    {
      'headerName': 'True Forward Required',
      'field': 'tfRequired',
      'cellClass': '',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'Consumption Method',
      'field': 'consumptionMethod',
      'pinned': 'right',
      'width': 180,
      'minWidth': 60,
      'headerClass': 'text-right',
      'suppressMenu': true
    },
    {
      'headerName': 'License Type',
      'field': 'licenseType',
      'pinned': 'right',
      'headerClass': 'text-right',
      'width': 180,
      'minWidth': 60,
      'suppressMenu': true
    }];

    this.columnDefs = columnDefs;
    // for(let i= 0; i < this.columnDefs.length; i++) {
    //   const column = this.columnDefs[i];
    //   if(column.cellRenderer === 'valueCellRenderer') {
    //     column.cellRenderer = this.valueCellRenderer.bind(this)
    //   }
    //   if (column.children) {
    //     for (let j= 0; j < column.children.length; j++){
    //       const childColumn = column.children[j]
    //       if(childColumn.cellRenderer === 'valueCellRenderer') {
    //         childColumn.cellRenderer = this.valueCellRenderer.bind(this);
    //       }
    //     }
    //   }
    // }


    if (this.gridOptions && this.gridOptions.api) {
      // this.gridOptions.api.setColumnDefs(this.columnDefs);
      this.gridOptions.api.setColumnDefs(this.columnDefs);
    }

  }

  getTrueForwardData() {
    this.allArchitectureViewService.getConsumptionDataTrueFwd(this.allArchitectureViewService.smartAccountId, this.virtualAccountId)
      .subscribe((response: any) => {
        try {
          if (response && response.data && !response.error) {
            if (response.data.suiteDetails) {
              // const jsonstr = JSON.stringify(response.data.suiteDetails);
              // const jsonstr_new = jsonstr.replace(/"sku"/g, '"suiteName"');
              const suites: any = response.data.suiteDetails;
              for (let i = 0; i < suites.length; i++) {
                if (suites[i].billingskuDetails && suites[i].billingskuDetails.length > 0) {
                  for (let j = 0; j < suites[i].billingskuDetails.length; j++) {
                    suites[i].billingskuDetails[j].suiteName = suites[i].billingskuDetails[j].skuName;
                  }
                }
              }
              for (let i = 0; i < suites.length; i++) {
                for (const propt in suites[i]) {
                  if (suites[i][propt] === 0 || suites[i][propt] === '0.0') {
                    suites[i][propt] = '--';
                  }
                }
              }
              this.rowData = suites;
              if (this.gridOptions.api) {
                this.gridOptions.api.setRowData(this.rowData);
              }
            }

          } else {
            this.messageService.displayMessagesFromResponse(response);
            this.rowData = [];
          }
        } catch (error) {
          this.rowData = [];
          this.messageService.displayUiTechnicalError(error);
        }
      });
  }


}
