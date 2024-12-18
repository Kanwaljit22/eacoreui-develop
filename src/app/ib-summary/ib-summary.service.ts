import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDataService } from '../shared/services/app.data.service';
import { map } from 'rxjs/operators';

import { GridOptions } from 'ag-grid-community';
import { UtilitiesService } from '../shared/services/utilities.service';
import { MessageService } from '../shared/services/message.service';
import { BlockUiService } from '../shared/services/block.ui.service';
import { ConstantsService } from '../shared/services/constants.service';
import { ArchitectureMetaDataJson, ArchitectureMetaDataFactory } from '@app/all-architecture-view/all-architecture-view.service';
import { AccountHealthInsighService } from '@app/shared/account-health-insight/account.health.insight.service';


@Injectable()
export class IbSummaryService {
  static readonly CONTRACT_NUMBER = 'contractNumber';
  static readonly SALES_ORDER = 'salesOrder';
  static readonly SERIAL_NUMBER = 'serialNumber';
  static readonly INSTALL_SITE = 'installSite';
  static readonly NUMBER_TYPE = 'number_Type';
  static readonly DATE_TYPE = 'date_Type';
  static readonly STRING_TYPE = 'string_Type';
  static readonly SUBSCRIPTION_NUMBER = 'subscription';


  ibSummaryRowData = new Array<{}>();
  ibSummaryDataEmitter = new EventEmitter<Array<{}>>();
  searchAndLocateDataEmitter = new EventEmitter<any>();

  date = new Date();
  columnDefs: any[];
  columnHeaderList: any[];

  coloumnObject = new Map<string, ArchitectureMetaDataJson>();

  public gridOptions: GridOptions;
  sortingObject: any;
  methodNameForSearchAndLocate: string;
  popupTextboxLabel: string;
  searchAndLocate: Array<string | number> = [];
  isSearchAndLocate = false;
  showResults = false;
  sortSearchLocate: boolean = false;
  ASC_ORDER_SORT = 'asc';
  DESC_ORDER_SORT = 'desc';
  locateData = [];
  disableRequestIba = false;

  customerSearchResult = [];
  nonCustomerSearchResult = [];
  notFoundSearchResult = [];

  searchColumnName: string;
  /*showInside flag is use for search and locate
  scenario to display selected customer data or outsite customer data */
  showInside = false;

  ibSummaryRequestObj: {
    archName: string;
    sort: any;
    page: any;
  } = {
      archName: '',
      sort: {},
      page: {}
    };
  public defaultPaginationObject = {
    collectionSize: 500,
    page: 1,
    pageSize: 50
  };
  namePersistanceColumnMap = new Map<string, string>();
  contractNumberData: any;

  constructor(
    private http: HttpClient,
    private appDataService: AppDataService,
    private utilitiesService: UtilitiesService,
    private messageService: MessageService,
    private blockUiService: BlockUiService,
    public constantsService: ConstantsService,
    public accountHealthInsighService: AccountHealthInsighService
  ) { }

  ibSummaryApiCall(methodName: string, ibSummaryReqObj, archName) {


  //Call api for subscription  
  if(methodName === IbSummaryService.SUBSCRIPTION_NUMBER) {
      
    delete ibSummaryReqObj.requestId;
      return this.http.post(this.appDataService.getAppDomain + 'api/prospect/subscription-by-prospect',ibSummaryReqObj).pipe(map(res => res));

  }else {

    let summaryTag = '';
    if (archName === this.constantsService.SECURITY) {
      summaryTag = 'booking-summary';
    } else {
      summaryTag = 'ibSummary';
    }
    return this.http
      .post(
        this.appDataService.getAppDomain + 'api/' + summaryTag + '/' + methodName,
        ibSummaryReqObj
      )
      .pipe(map(res => res));

  }

  }


  loadIbSummaryData(methodName, searchObject) {
    let ibSummaryReqJson: any;
    this.methodNameForSearchAndLocate = methodName;
    ibSummaryReqJson = {
      requestId: this.date.toString(),
      archName: this.appDataService.archName,
      customerName: this.appDataService.customerName,
      sort: this.ibSummaryRequestObj.sort,
      page: this.ibSummaryRequestObj.page
    };

    if (searchObject) {

      ibSummaryReqJson['searchValue'] = searchObject;

      this.sortSearchLocate = true;
      this.nonCustomerSearchResult = [];
      this.notFoundSearchResult = [];
      this.customerSearchResult = [];
    }
    this.ibSummaryRowData = new Array<{}>();
    this.ibSummaryApiCall(methodName, ibSummaryReqJson, this.appDataService.archName).subscribe(
      (response: any) => {
        try {
          const summaryData = response.data;
          if (summaryData && !response.error) {
            if (!searchObject) {
              for (let i = 0; i < summaryData.length; i++) {
                const ibSummaryRow = summaryData[i].column;
                const record = { prospectid: i };
                const sizeOfRow = ibSummaryRow.length;
                for (let j = 0; j < sizeOfRow; j++) {
                  const columns = ibSummaryRow[j];
                  if (columns.name !== 'ARCHITECTURE') {
                    record[columns.name] = columns.value;
                  }
                }
                this.ibSummaryRowData.push(record);
              }
              if (response.page) {
                this.ibSummaryRequestObj.page = response.page;
                this.ibSummaryDataEmitter.emit(this.ibSummaryRowData);
              }
            } else {
              try {
                this.prepareSearchResult(summaryData);
              } catch (error) {
                // console.error(error.ERROR_MESSAGE);
                this.blockUiService.spinnerConfig.unBlockUI();
                this.messageService.displayUiTechnicalError(error);
              }
              this.ibSummaryDataEmitter.emit(this.customerSearchResult);
            }
          } else {
            if (!searchObject) {
              if (response.error) {
                this.accountHealthInsighService.showIbSummaryFlyout = false;
              }
              // this.messageService.displayMessagesFromResponse(response);
              this.ibSummaryRowData = [];
              this.ibSummaryDataEmitter.emit(this.ibSummaryRowData);
            } else {
              this.notFoundSearchResult = this.searchAndLocate.slice(0);
              this.ibSummaryDataEmitter.emit(this.customerSearchResult);
            }
          }
        } catch (error) {
          // console.error(error.ERROR_MESSAGE);
          this.blockUiService.spinnerConfig.unBlockUI();
          this.messageService.displayUiTechnicalError(error);
        }
      }
    );
  }

  prepareSearchResult(summaryData: any) {
    let searchedIdArray = this.searchAndLocate.slice(0);
    if (summaryData && summaryData.length > 0) {
      const noOfRow = summaryData.length;
      for (let i = 0; i < noOfRow; i++) {
        const ibSummaryRow = summaryData[i].column;
        const record = { prospectid: i };
        const sizeOfRow = ibSummaryRow.length;
        let searchId;
        for (let j = 0; j < sizeOfRow; j++) {
          const columns = ibSummaryRow[j];
          if (columns.name !== 'ARCHITECTURE') {
            record[columns.name] = columns.value;
          }
          if (columns.name === this.searchColumnName) {
            searchId = columns.value;
            const index = searchedIdArray.indexOf(searchId);
            if (index > -1) {
              searchedIdArray = this.utilitiesService.removeArrayElement(
                searchedIdArray,
                index
              );
            }
          }
        }
        if (summaryData[i].name === this.appDataService.customerName) {
          this.customerSearchResult.push(record);
          // Once value is found delete it from searched array to display id noyt found on UI
          const idSearched = summaryData[i].column[0].value;
          const index = searchedIdArray.indexOf(idSearched);
          if (index > -1) {
            searchedIdArray.splice(index, 1);
          }
        } else if (ibSummaryRow.name !== this.appDataService.customerName) {
          this.nonCustomerSearchResult.push(record);
        }
      }
      this.notFoundSearchResult = searchedIdArray;
    }
  }

  prepareColumnMetaData(metaData: any) {
    this.columnDefs = [];
    const architectureMetaData = metaData.columns;
    const isDisplayOrderPresent = (<Array<any>>architectureMetaData).every(item => item.hasOwnProperty('displayOrder'));
    if (isDisplayOrderPresent) {
      architectureMetaData.sort((a, b) => {
        return a.displayOrder - b.displayOrder;
      });
    }

    const sortObj = metaData.sort;
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.cellRenderer = this.nodeRenderer;
    firstColumn.getQuickFilterText = function (params) {
      return null;
    };
    this.utilitiesService.columnDataTypeMap.clear();
    // this.columnDefs.push(firstColumn); this is commented as we don't need empty row in the grid.
    this.columnHeaderList = [];
    const thisInstance = this;

    for (let i = 0; i < architectureMetaData.length; i++) {
      const coloumnData = architectureMetaData[i];
      this.namePersistanceColumnMap.set(
        coloumnData.persistanceColumn,
        coloumnData.name
      );
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.name) {
        // console.log(coloumnData.name);
        coloumnDef.headerName = coloumnData.displayName;
        if ('serialNumber' === coloumnData.name) {
          coloumnDef.pinned = true;
        }
        coloumnDef.filterParams = { cellHeight: 20 };
        coloumnDef.field = coloumnData.persistanceColumn;
        this.coloumnObject.set(coloumnData.name, coloumnDef);
        this.utilitiesService.columnDataTypeMap.set(
          coloumnData.persistanceColumn,
          coloumnData.dataType
        );
        this.columnHeaderList.push(coloumnDef.headerName);
        if (coloumnData.dataType === 'Number') {
          coloumnDef.cellRenderer = 'currencyFormat';
          coloumnDef.cellClass = 'dollar-align';
        } else if (coloumnData.dataType === 'String') {
          coloumnDef.filterParams = { cellHeight: 20 };
        }

        if (coloumnData.hideColumn !== 'Y') {
          // coloumnDef.cellClass = 'text-link';
          coloumnDef.field = coloumnData.persistanceColumn;
          if (coloumnDef.cellRenderer === 'currencyFormat') {
            coloumnDef.cellRenderer = function (params) {
              return thisInstance.currencyFormat(params, thisInstance);
            };
          }
          if (sortObj && sortObj.name === coloumnData.name) {
            coloumnDef.sort = sortObj.type;
          }
          if (coloumnData.name === 'instanceNumber') {
            coloumnDef.cellRenderer = function (params) {
              return thisInstance.numberRenderer(params);
            };
          }
          if (coloumnData.groupName) {
            // this condition is for column grouping.
            // this.gridOptions.headerHeight = 21;
            if (headerGroupMap.has(coloumnData.groupName)) {
              const headerGroupObject = headerGroupMap.get(
                coloumnData.groupName
              );
              coloumnDef.headerClass = 'child-header';
              headerGroupObject.children.push(coloumnDef);
            } else {
              const headerObject: ArchitectureMetaDataJson = {
                headerName: coloumnData.groupName
              };
              coloumnDef.headerClass = 'child-header';
              headerObject.children = new Array<any>();
              headerGroupMap.set(coloumnData.groupName, headerObject);
              headerObject.children.push(coloumnDef);
              this.columnDefs.push(headerObject);
            }
          } else {
            this.columnDefs.push(coloumnDef);
          }
        }
      }
      if (coloumnDef.getQuickFilterText === 'filterText') {
        coloumnDef.getQuickFilterText = function (params) {
          return null;
        };
      }
    }
    return this.columnDefs;
  }

  nodeRenderer($event) {
    // tslint:disable-next-line:radix
    return '' + (parseInt($event.rowIndex) + 1);
  }

  numberRenderer(params) {
    const val = params.value.slice(0, 4);
    const value = params.value.slice(4, params.value.length);
    return '<div class="inline-block">' + val + '</div>' + '<div class="inline-block">' + value + '</div>';
  }

  currencyFormat(params, thisInstance) {
    // return thisInstance.utilitiesService.formatWithNoDecimal(params.value);
    return thisInstance.utilitiesService.removeDecimal(params.value);
  }

  /*
     *  This method will be called on click of sorting in any  column.
    */
  updateRowDataOnSort(sortColObj: any, methodName: string) {
    this.setSortObject(sortColObj);
    const sortingType = this.sortingObject[0].sort;
    const sortingField = this.sortingObject[0].colId;
    const persistanceColumnName = sortColObj[0].colId;
    const columnName = this.namePersistanceColumnMap.get(
      persistanceColumnName
    );
    const sortObject = {
      name: columnName,
      persistanceColumn: persistanceColumnName,
      type: sortColObj[0].sort
    };
    this.ibSummaryRequestObj.sort = sortObject;
    try {
      this.loadIbSummaryData(methodName, null);
    } catch (error) {
      this.blockUiService.spinnerConfig.unBlockUI();
      this.messageService.displayUiTechnicalError(error);
    }
  }

  initSearchAndLocate() {
    this.searchAndLocate = [];
    this.isSearchAndLocate = false;
    this.locateData = [];
  }

  setSortObject(sortColObj: any) {
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
  }

  sendIbaReport(ibaRquestObj) {
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      return this.http.post(this.appDataService.getAppDomain + 'api/report/booking-report', ibaRquestObj)
        .pipe(map(res => res));
    } else {
      return this.http.post(this.appDataService.getAppDomain + 'api/report/ib-summary', ibaRquestObj)
        .pipe(map(res => res));
    }
  }


  // loadSubscriptionData() {

  //   let ibSummaryReqJson: any;
  // //  this.methodNameForSearchAndLocate = methodName;
  //   ibSummaryReqJson = {
  //     archName: this.appDataService.archName,
  //     customerName: this.appDataService.customerName,
  //   };


  //   this.ibSummaryRowData = new Array<{}>();

  //     this.getSubscriptionData(ibSummaryReqJson).subscribe(
  //     (response: any) => {
  //       try {
  //         const summaryData = response.data;

  //           if (summaryData && !response.error) {




  //           }
  //       }
  //         catch (error) {
  //         // console.error(error.ERROR_MESSAGE);
  //         this.blockUiService.spinnerConfig.unBlockUI();
  //         this.messageService.displayUiTechnicalError(error);
  //       }

  //     });

  // }


}
