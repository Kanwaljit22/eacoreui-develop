import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions } from 'ag-grid-community';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { TcoConfigurationService } from './tco-configuration.service';
import { MessageService } from '../../../shared/services/message.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { ProposalDataService } from '../../proposal.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../shared/services/constants.service';
import { LocaleService } from "@app/shared/services/locale.service";

@Component({
  selector: 'app-tco-configuartion',
  templateUrl: './tco-configuration.component.html',
  styleUrls: ['./tco-configuration.component.scss']
})

export class TcoConfigurationComponent implements OnInit {
  roadMap: IRoadMap;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any;
  public rowDataPrice: any;
  public columnDefs: any;
  chartData: any;
  stackedData: any[];
  barGroupData: any;
  groupStackedBar: any;
  stackedDataSh = false;
  showBar = true;
  showBarstack = false;
  showLine = false;
  barGroup = false;
  groupStacked = false;
  showLineCumulative = false;
  active: Array<any> = [];
  columnHeaderList = [];
  showParam = false;
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  myTextsHw: IMultiSelectTexts;
  selectedOptions: IMultiSelectOption[];
  hardwareRefresh: IMultiSelectOption[];
  viewValue = [];
  toggleStacked = false;
  showBreakdown = false;
  selectedGraphId = 1;
  totalPriceGraphCalled = false;

  constructor(public localeService:LocaleService,private http: HttpClient, public tcoConfigurationService: TcoConfigurationService, public constantsService: ConstantsService,
    private messageService: MessageService, private utilitiesService: UtilitiesService, public appDataService: AppDataService,
    private proposalDataService: ProposalDataService, private blockUiService: BlockUiService, private router: Router) {
    this.gridOptions = <GridOptions>{};
    this.createColumnDefs();
    this.gridOptions.headerHeight = 21;
  }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalTCOComparisonStep;
    this.appDataService.isProposalIconEditable = false;
    this.tcoConfigurationService.regenerateGraphEmitter.subscribe(
      (graphType: string) => {
        if (graphType === 'totalPriceDataCalculation' && !this.totalPriceGraphCalled) {
          // this.tcoConfigurationService.regenerateGraphEmitter.;
          this.getTotalPriceGraphData();
          this.totalPriceGraphCalled = true;
        }
      });

    //this.ciscoOneData();
    //this.getbarStackedData();
    // this.getgroupBarData();
    //this.getGroupStackedData();
    //this.priceData();
    this.selectedOptions = [{
      'id': 1,
      'name': 'Total Price Comparison'
    },
    {
      'id': 2,
      'name': ' Price Comparison By Suite'
    },
    {
      'id': 3,
      'name': 'Cumulative Cost Comparison'
    },
    {
      'id': 4,
      'name': ' Yearly Cost Comparison'
    }
    ];
    this.hardwareRefresh = [{
      'id': '1',
      'name': '1 Year'
    },
    {
      'id': '2',
      'name': '2 Years'
    },
    {
      'id': '3',
      'name': '3 Years'
    },
    {
      'id': '4',
      'name': '4 Years'
    },
    {
      'id': '5',
      'name': '5 Years'
    },
    {
      'id': '6',
      'name': '6 Years'
    },
    {
      'id': '7',
      'name': '7 Years'
    },
    {
      'id': '8 ',
      'name': '8 Years'
    },
    {
      'id': '9',
      'name': '9 Years'
    },
    {
      'id': '10',
      'name': '10 Years'
    }
    ];
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true,
      showCheckAll: false
    };
    this.myTexts = {
      defaultTitle: 'Total Price Comparison'
    };
    this.myTextsHw = {
      defaultTitle: '5 Years'
    };

  }

  private createColumnDefs() {
    const thisInstance = this;
    this.http.get('assets/data/tco-configuration/cisco-one/table.json').subscribe((res) => {
      this.columnDefs = res;
      this.columnHeaderList = [];
      for (let i = 0; i < this.columnDefs.length; i++) {
        if (this.columnDefs[i].children) {
          for (let j = 0; j < this.columnDefs[i].children.length; j++) {
            this.columnDefs[i].children[j].headerClass = 'child-header';
            if (this.columnDefs[i].children[j].headerName) {
              this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
            }
            if (this.columnDefs[i].children[j].valueGetter === 'totalValue') {
              this.columnDefs[i].children[j].valueGetter = function aPlusBValueGetter(params) {
                const val = params.data.hw + params.data.sw + params.data.hwService + params.data.swService;

                return val;
              };
            }
          }
        } else {
          if (this.columnDefs[i].headerName) {
            this.columnHeaderList.push(this.columnDefs[i].headerName);
          }
        }
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

  getbarData() {
    this.http.get('assets/data/tco-configuration/cisco-one/barChart.json').subscribe((res) => {
      this.chartData = res;
    });
  }


  getTotalPriceGraphData() {
    this.rowData = new Array<any>();
    this.blockUiService.spinnerConfig.stopChainAfterThisCall();
    this.tcoConfigurationService.getTotalPriceGraphData().subscribe((res: any) => {
      if (res && !res.error) {
        console.log(res);
        try {
          this.chartData = this.prepareTotalPriceGraphData(res.data);
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  prepareTotalPriceGraphData(data: any) {
    const totalPriceGrapaArray = new Array<any>();
    this.stackedData = new Array<any>();
    if (data && data.length > 0) {
      const size = data.length;
      for (let i = 0; i < size; i++) {
        const totalPriceData = data[i];
        if (totalPriceData.prices) {
          const pricesObj = totalPriceData.prices;
          /*
          *   This object is for display below table
          */
          const totalPriceTableData = {
            'buyingModel': totalPriceData.description,
            'hw': this.utilitiesService.formatValue(pricesObj.hardwarePrice),
            'hwService': this.utilitiesService.formatValue(pricesObj.hardwareServicePrice),
            'sw': this.utilitiesService.formatValue(pricesObj.softwarePrice),
            'swService': this.utilitiesService.formatValue(pricesObj.softwareServicePrice),
            'totalValue': this.utilitiesService.formatValue(pricesObj.totalPrice)
          };
          this.rowData.push(totalPriceTableData);
          /*
           *   This object is for display total price comparison graph.
          */
          const totalPriceGraphData = {
            'quarter': totalPriceData.description,
            'areas': [{
              'freq': {
                'Attach': this.utilitiesService.getFloatValue(pricesObj.totalPrice),
              }
            }]
          };
          totalPriceGrapaArray.push(totalPriceGraphData);
          /*
           *   This object is for display Total price breakdown graph.
          */
          const totalPriceBreakdownGraphData = {
            'quarter': totalPriceData.description,
            'areas': [{
              'freq': {
                'hw': this.utilitiesService.getFloatValue(pricesObj.hardwarePrice),
                'hw Services': this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice),
                'sw': this.utilitiesService.getFloatValue(pricesObj.softwarePrice),
                'sw Services': this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice)
              }
            }]
          };
          this.stackedData.push(totalPriceBreakdownGraphData);
        }
      }
    }
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
    }
    setTimeout(() => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    }, 200);
    this.proposalDataService.proposalDataObject.tcoData.totalPriceGraphTableData = this.rowData;
    return totalPriceGrapaArray;
  }


  /*
  * This method is use to get price comparison by suite data and prepare
  * data for graphs and table.
  */
  getPriceComparisonBySuiteData() {
    this.rowData = new Array<any>();
    this.tcoConfigurationService.getPriceComparisonBySuiteData().subscribe((res: any) => {
      if (res && !res.error) {
        try {
          this.preparePriceComparisonBySuiteData(res.data);
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }


  preparePriceComparisonBySuiteData(data: any) {
    this.barGroupData = new Array<any>();
    const tableData = new Array<any>();
    this.groupStackedBar = new Array<any>();
    let alcPrice;
    let bauPrice;
    let c1Price;
    let eaPrice;
    let state;
    let hwTotal;
    let hwServiceTotal;
    let swTotal;
    let swServiceTotal;
    if (data && data.length > 0) {
      const size = data.length;
      for (let i = 0; i < size; i++) {
        const suiteData = data[i];
        hwTotal = 0.0;
        hwServiceTotal = 0.0;
        swTotal = 0.0;
        swServiceTotal = 0.0;
        const priceComparison = {
          'quarter': suiteData.name,
          'areas': []
        };
        const priceComparisonTableData = {
          'buyingModel': suiteData.name,
          'children': []
        }
        const breakdownPriceComparison = {
          'PerformanceBand': suiteData.name
        }
        if (suiteData) {
          const models = suiteData.models;
          if (models) {
            for (let j = 0; j < models.length; j++) {
              const model = models[j];
              const pricesObj = model.prices;
              hwTotal += this.utilitiesService.getFloatValue(pricesObj.hardwarePrice);
              hwServiceTotal += this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice);
              swTotal += this.utilitiesService.getFloatValue(pricesObj.softwarePrice);
              swServiceTotal += this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice);
              const priceComparisonChildData = {
                'buyingModel': model.description,
                'hw': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(pricesObj.hardwarePrice)),
                'hwService': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice)),
                'sw': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(pricesObj.softwarePrice)),
                'swService': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice)),
                'totalValue': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(pricesObj.totalPrice))
              }
              priceComparisonTableData.children.push(priceComparisonChildData);
              if (model.name === 'ALC') {
                alcPrice = this.utilitiesService.getFloatValue(pricesObj.totalPrice);
                state = model.description;
                breakdownPriceComparison['HW'] = this.utilitiesService.getFloatValue(pricesObj.hardwarePrice);
                breakdownPriceComparison['HW Service'] = this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice);
                breakdownPriceComparison['SW'] = this.utilitiesService.getFloatValue(pricesObj.softwarePrice);
                breakdownPriceComparison['SW Service'] = this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice);
              } else if (model.name === 'BAU') {
                bauPrice = this.utilitiesService.getFloatValue(pricesObj.totalPrice);
                state = model.description;
                breakdownPriceComparison['HW4'] = this.utilitiesService.getFloatValue(pricesObj.hardwarePrice);
                breakdownPriceComparison['HW Service4'] = this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice);
                breakdownPriceComparison['SW4'] = this.utilitiesService.getFloatValue(pricesObj.softwarePrice);
                breakdownPriceComparison['SW Service4'] = this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice);
              } else if (model.name === 'C1') {
                c1Price = this.utilitiesService.getFloatValue(pricesObj.totalPrice);
                state = model.description;
                breakdownPriceComparison['HW3'] = this.utilitiesService.getFloatValue(pricesObj.hardwarePrice);
                breakdownPriceComparison['HW Service3'] = this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice);
                breakdownPriceComparison['SW3'] = this.utilitiesService.getFloatValue(pricesObj.softwarePrice);
                breakdownPriceComparison['SW Service3'] = this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice);
              } else if (model.name === 'EA') {
                eaPrice = this.utilitiesService.getFloatValue(pricesObj.totalPrice);
                state = model.description;
                breakdownPriceComparison['HW2'] = this.utilitiesService.getFloatValue(pricesObj.hardwarePrice);
                breakdownPriceComparison['HW Service2'] = this.utilitiesService.getFloatValue(pricesObj.hardwareServicePrice);
                breakdownPriceComparison['SW2'] = this.utilitiesService.getFloatValue(pricesObj.softwarePrice);
                breakdownPriceComparison['SW Service2'] = this.utilitiesService.getFloatValue(pricesObj.softwareServicePrice);
              }
            }
            priceComparisonTableData['hw'] = this.utilitiesService.formatValue(hwTotal);
            priceComparisonTableData['hwService'] = this.utilitiesService.formatValue(hwServiceTotal);
            priceComparisonTableData['sw'] = this.utilitiesService.formatValue(swTotal);
            priceComparisonTableData['swService'] = this.utilitiesService.formatValue(swServiceTotal);
            priceComparisonTableData['totalValue'] = this.utilitiesService.formatValue
              (swServiceTotal + swTotal + hwServiceTotal + hwTotal);
            tableData.push(priceComparisonTableData);
            if (this.groupStackedBar.length < 4) {
              this.groupStackedBar.push(breakdownPriceComparison);
            }
            const area = {
              'state': state,
              'freq': {
                'ALC': alcPrice,
                'BAU': bauPrice,
                'C1': c1Price,
                'EA': eaPrice
              }
            };
            priceComparison.areas.push(area);
          }
        }
        this.barGroupData.push(priceComparison);
      }
    }
    if(this.gridOptions.api) {
    this.gridOptions.api.setRowData(tableData);
    setTimeout(() => {
      this.gridOptions.api.sizeColumnsToFit();
    }, 200);
  }
    // console.log(this.barGroupData);
    // console.log('breakdown Data');
    // console.log(this.groupStackedBar);
  }

  getbarStackedData() {
    /* this.http.get('assets/data/tco-configuration/cisco-one/tpcBreakdown.json').subscribe((res) => {
       this.stackedData = res;
     });*/
  }

  getgroupBarData() {
    this.http.get('assets/data/tco-configuration/cisco-one/priceComparison.json').subscribe((res) => {
      this.barGroupData = res;
    });
  }

  getGroupStackedData() {
    this.http.get('assets/data/tco-configuration/cisco-one/groupStacked.json').subscribe((res) => {
      this.groupStackedBar = res;
    });
  }

  ciscoOneData() {
    this.http.get('assets/data/tco-configuration/cisco-one/tableData.json').subscribe((res) => {
      this.rowData = res;
      if(this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 200);
    }
    });
  }

  priceData() {
    this.http.get('assets/data/tco-configuration/cisco-one/priceTableData.json').subscribe((res) => {
      this.rowDataPrice = res;
    });
  }

  updateActive(active: Array<any>): void {
    this.active = active.slice();
  }

  show() {
    this.showParam = true;
    this.tcoConfigurationService.growthParameterLoaded = true;
  }

  hide() {
    this.showParam = false;
  }

  globalSwitchChange(check, b) {
    if (!this.viewValue.length) {
      this.stackedDataSh = check;
      this.showBar = !check;
    } else if (b[0] === 1) {
      this.toggleStacked = false;
      this.stackedDataSh = check;
      this.showBar = !check;
    } else if (b[0] === 2) {
      this.toggleStacked = true;
      this.stackedDataSh = false;
      this.barGroup = !check;
      this.showBarstack = check;
    } else {
      this.toggleStacked = false;
      this.stackedDataSh = check;
      this.showBar = !check;
    }
  }

  selectedValue(c, a) {
    this.showBreakdown = false;
    this.selectedGraphId = c[0];
    if (c[0] === 4) {
      this.barGroup = false;
      this.showLine = true;
      this.stackedDataSh = false;
      this.showBar = false;
      this.groupStacked = false;
      this.showBarstack = false;
      this.showLineCumulative = false;
    } else if (c[0] === 1) {
      this.barGroup = false;
      this.showLine = false;
      this.stackedDataSh = false;
      this.groupStacked = false;
      this.showBar = true;
      this.showBarstack = false;
      this.showLineCumulative = false;
      // this.gridOptions.api.setRowData(this.proposalDataService.proposalDataObject.tcoData.totalPriceGraphTableData);
      this.getTotalPriceGraphData();
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 50);
    } else if (c[0] === 2) {
      this.getPriceComparisonBySuiteData();
      this.barGroup = true;
      this.showLine = false;
      this.showLineCumulative = false;
      this.stackedDataSh = false;
      this.groupStacked = false;
      this.showBar = false;
      this.showBarstack = false;
      setTimeout(() => {
        this.gridOptions.api.sizeColumnsToFit();
      }, 50);
    } else if (c[0] === 3) {
      this.barGroup = false;
      this.showLine = false;
      this.stackedDataSh = false;
      this.showBar = false;
      this.showLineCumulative = true;
      this.showBarstack = false;
      this.showLine = false;
    }
  }

  changeHWRefresh($event, ) {
    console.log($event);
    this.tcoConfigurationService.hwRefreshRate = $event[0];
    this.tcoConfigurationService.growthParameterSave(null, true).subscribe((res: any) => {
      if (res && !res.error) {
        try {
          const data = res.data;
          this.tcoConfigurationService.enableRegenerateGraph = true;
        } catch (error) {
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  continue() {
    this.roadMap.eventWithHandlers.continue();
  }

  back() {
    this.roadMap.eventWithHandlers.back();
  }

  regenerateGraph() {
    if (this.showBar || this.stackedDataSh) {
      this.getTotalPriceGraphData();
    } else if (this.barGroup || this.showBarstack) {
      this.getPriceComparisonBySuiteData();
    } else if (this.showLineCumulative) {
      this.tcoConfigurationService.regenerateGraphEmitter.emit('showLineCumulative');
    } else if (this.showLine) {
      this.tcoConfigurationService.regenerateGraphEmitter.emit('showLine');
    }
    this.tcoConfigurationService.enableRegenerateGraph = false;

  }

  viewProposal() {
    this.router.navigate(['qualifications/proposal']);
  }

}
