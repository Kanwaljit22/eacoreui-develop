
import { CreateProposalService } from './../../create-proposal/create-proposal.service';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { map } from 'rxjs/operators'


@Injectable()
export class TcoConfigurationService {
  readonly NUMBER_OF_YEARS = 15;
  readonly ALC = 'alc';
  readonly EA = 'ea';
  readonly BAU = 'bau';
  readonly C1 = 'c1';
  readonly CUMULATIVE_GRAPH = 'cumulativeGraph';
  readonly YEARLY_COST_GRAPH = 'yearlyCostGraph';
  YEAR_KEY_MAP = new Map<string, string>();
  suiteDiscounts = [];
  valChanged = new BehaviorSubject<boolean>(false);
  currentval = this.valChanged.asObservable();
  enableRegenerateGraph = false;
  regenerateGraphEmitter = new EventEmitter<string>();
  growthParameterLoaded = false;
  discountsOnSuites = {
    advancedDeployment: '',
    softwareServiceDiscount: '',
    softwareDiscount: '',
    subscriptionDiscount: ''
  };
  hwRefreshRate: any;


  constructor(private http: HttpClient, private appDataService: AppDataService,
    public proposalDataService: ProposalDataService, private utilitiesService: UtilitiesService) {
    this.prepareYearKeyMap();
  }


  /*
  * This method is use to fetch the date from server for Growth Parameter table.
  */
  getGrowthParameter() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tco/growthParameters?u=' + this.appDataService.userId + '&p='
      + this.proposalDataService.proposalDataObject.proposalId)
      .pipe(map(res => res));
  }


  /*
  *  This method will fetch the data from server for total price graph and total price Table.
  */
  getTotalPriceGraphData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tco/chartByTotalPrice/all?u='
      + this.appDataService.userId + '&p=' + this.proposalDataService.proposalDataObject.proposalId)
      .pipe(map(res => res));
  }


  /*
  *  This method will fetch the data from server for price comparison for suite and its Table.
  */
  getPriceComparisonBySuiteData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tco/chartBySuite/all?u='
      + this.appDataService.userId + '&p=' + this.proposalDataService.proposalDataObject.proposalId)
      .pipe(map(res => res));
  }




  /*
  *  This method will fetch the data from server for cumulative const comparison  and its Table.
  */
  getCumulativeCostComparisonData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tco/chartByCumulativeCost?u='
      + this.appDataService.userId + '&p=' + this.proposalDataService.proposalDataObject.proposalId)
      .pipe(map(res => res));
  }



  /*
  *  This method will fetch the data from server for price comparison for suite and its Table.
  */
  getYearlyChartData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tco/chartByYearlyCost?u='
      + this.appDataService.userId + '&p=' + this.proposalDataService.proposalDataObject.proposalId)
      .pipe(map(res => res));
  }


  prepareYearKeyMap() {
    this.YEAR_KEY_MAP.set('DAY1', 'DAY 1');
    for (let i = 1; i <= this.NUMBER_OF_YEARS; i++) {
      this.YEAR_KEY_MAP.set('Y' + i, 'Year ' + i);
    }
  }


  prepareGraghAndTableData(data: any) {
    const graphAreaObject = {
      graphData: [],
      tableData: []
    };
    const graphMap = new Map<string, any>();
    const tableDataMap = new Map<string, any>();
    if (data) {
      const tableDataArray = new Array<any>();
      for (const key in data) {
        if (key) {
          const graphData = {
            'areas': []
          };
          const year = this.YEAR_KEY_MAP.get(key);
          graphData['quarter'] = year;
          const obj = data[key];
          const areaObject = {
            'state': '',
            'freq': {}
          };
          const tableData = {
            'days': year
          };
          let totalValue = 0.0;
          for (const objKey in obj) {
            if (objKey) {
              const priceIndex = objKey.indexOf('Price');
              const suiteName = objKey.substr(0, priceIndex);
              if (suiteName === this.ALC) {
                areaObject.freq['ALC'] = this.utilitiesService.getFloatValue(obj[objKey]);
                tableData['alc'] = this.utilitiesService.formatValue(obj[objKey]);
              } else if (suiteName === this.C1) {
                areaObject.freq['C1'] = this.utilitiesService.getFloatValue(obj[objKey]);
                tableData['c1'] = this.utilitiesService.formatValue(obj[objKey]);
              } else if (suiteName === this.EA) {
                areaObject.freq['EA'] = this.utilitiesService.getFloatValue(obj[objKey]);
                tableData['ea'] = this.utilitiesService.formatValue(obj[objKey]);
              } else if (suiteName === this.BAU) {
                areaObject.freq['BAU'] = this.utilitiesService.getFloatValue(obj[objKey]);
                tableData['bau'] = this.utilitiesService.formatValue(obj[objKey]);
              }
              totalValue += this.utilitiesService.getFloatValue(obj[objKey]);
            }
          }
          tableData['totalValue'] = this.utilitiesService.formatValue(totalValue);
          graphData.areas.push(areaObject);
          graphMap.set(key, graphData);
          tableDataMap.set(key, tableData);
        }
      }
      graphAreaObject.graphData.push(graphMap.get('DAY1'));
      graphAreaObject.tableData.push(tableDataMap.get('DAY1'));
      const key = 'Y';
      for (let i = 1; i < graphMap.size; i++) {
        if (graphMap.get(key + i)) {
          graphAreaObject.graphData.push(graphMap.get(key + i));
          graphAreaObject.tableData.push(tableDataMap.get(key + i));
        }
      }
    }
    return graphAreaObject;
  }


  // This method will be called when there is any changes in suite/lineItems features.
  growthParameterSave(dataArray, suiteLevel) {


    const reqObj = {
      'proposalId': this.proposalDataService.proposalDataObject.proposalId,
      'userId': this.appDataService.userId,
      'hwRefreshRate': this.hwRefreshRate,
    };
    if (dataArray) {
      reqObj['data'] = [dataArray];
    }
    let url = this.appDataService.getAppDomain + 'api/proposal/tco/growthParameters/';
    if (suiteLevel) {
      url += 'suite';
    } else {
      url += 'lineitem';
    }
    return this.http.post(url, reqObj)
      .pipe(map(res => res));
  }

}
