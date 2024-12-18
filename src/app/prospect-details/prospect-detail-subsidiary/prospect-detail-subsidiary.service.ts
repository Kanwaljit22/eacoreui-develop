import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppDataService } from '../../shared/services/app.data.service';
import { ProspectDetailsService } from '../prospect-details.service';
import { MessageService } from '../../shared/services/message.service';

import { BlockUiService } from '@app/shared/services/block.ui.service';
import { MessageType } from '@app/shared/services/message';
import { LocaleService } from '@app/shared/services/locale.service';
import { ArchitectureMetaDataJson, ArchitectureMetaDataFactory } from '@app/all-architecture-view/all-architecture-view.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ProspectDetailSubsidiaryService {
  subsidiaryData: Array<any>;
  subsidiaryDataMap = new Map<String, any>();
  subsidiaryDataEmitter = new EventEmitter<Array<any>>();
  architectureName: string;
  customerName: string;
  loadSubsidiaryRequest;
  showNoDataMsg = false;
  errorMsg = 'No data found for Subsidiaries';

  constructor(
    private http: HttpClient,
    public appDataService: AppDataService,
    private prospectDetailsService: ProspectDetailsService,
    private messageService: MessageService,
    public blockUiService: BlockUiService,
    public localeService: LocaleService

  ) { }

  getSubsidiaryColumnsData() {
    return this.http
      .get('assets/data/prospect-detail-subsidiaryColumns.json')
      .pipe(map(res => res));
  }

  getSubsidiaryData(loadSubsidiaryDataJSON) {
    return this.http
      .post(
        this.appDataService.getAppDomain + 'api/prospect/subsidiary',
        loadSubsidiaryDataJSON
      )
      .pipe(map(res => res));
  }

  loadSubsidiaryData(guId: string) {
    // this.blockUI = true;
    if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
      const userInfoJson = JSON.parse(
        sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)
      );
      this.appDataService.userInfo.userId = userInfoJson.userId;
    }
    this.subsidiaryData = new Array<any>();
    this.architectureName = this.appDataService.archName;
    this.customerName = this.appDataService.customerName;
    const loadSubsidiaryJson = {
      archName: this.appDataService.archName,
      customerName: this.appDataService.customerName,
      // user: this.appDataService.userInfo.userId,
      guId: guId,
      hqId: null
    };
    this.loadSubsidiaryRequest = loadSubsidiaryJson;

    this.getSubsidiaryData(loadSubsidiaryJson).subscribe((response: any) => {
      if (response && !response.error && response.data) {
        try {
          this.showNoDataMsg = false;
          const subsidiaryData = response.data;
          let start_time;
          for (let i = 0; i < subsidiaryData.length; i++) {
            const subsidiaryRow = subsidiaryData[i];
            const record = {
              CUSTOMER_GU_NAME: subsidiaryRow.name,
              children: []
            };
            const colData = subsidiaryRow.column;
            for (let j = 0; j < colData.length; j++) {
              const subsidiaryColData = colData[j];
              record[subsidiaryColData.name] = subsidiaryColData.value;
            }
            this.subsidiaryData.push(record);
            loadSubsidiaryJson.guId = record['END_CUSTOMER_ID'];
            this.subsidiaryDataMap.set(record['END_CUSTOMER_ID'], record);
            // Ajax call for childs.
            start_time = new Date().getTime();
            this.getSubsidiaryData(loadSubsidiaryJson).subscribe(
              (childReponse: any) => {
                if (!childReponse.error) {
                  try {
                    const subsidiaryChildData = childReponse.data;
                    if (subsidiaryChildData) {
                      record.children = new Array<any>();
                    }
                    for (let i = 0; i < subsidiaryChildData.length; i++) {
                      const subsidiarychildRow = subsidiaryChildData[i];
                      const childRecord = {
                        CUSTOMER_GU_NAME: subsidiarychildRow.name,
                        children: []
                      };
                      const childColData = subsidiarychildRow.column;
                      for (let j = 0; j < childColData.length; j++) {
                        const subsidiaryChildColData = childColData[j];
                        childRecord[subsidiaryChildColData.name] =
                          subsidiaryChildColData.value;
                      }
                      this.subsidiaryDataMap.set(
                        childRecord['END_CUSTOMER_ID'],
                        childRecord
                      );
                      record.children.push(childRecord);
                    }
                    this.subsidiaryDataEmitter.emit(this.subsidiaryData);
                  } catch (error) {
                    // console.error(error);
                    // this.messageService.displayUiTechnicalError(error);
                  }
                } else {
                  this.appDataService.persistErrorOnUi = true;
                  this.messageService.displayMessagesFromResponse(childReponse);
                }
              }
            );
          }
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          const request_time = new Date().getTime() - start_time;
          // console.log('Total time taken for this ajax call is');
          // console.log(request_time);
        } catch (error) {
          // console.error(error.ERROR_MESSAGE);
          // this.messageService.displayUiTechnicalError(error);
        }
      } else {
        // to unblock UI and show no data found if there's no data coming from service
        this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.showNoDataMsg = true;
        if (response.error && response.messages) {
          this.errorMsg = response.messages[0].text;
        }
        this.subsidiaryData = [];

        //this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage('admin.NO_DATA_FOUND'), MessageType.Info));
      }
    });
  }

  public prepareSubsidiaryMetaData(subsidiaryMetaData: any, compInstance) {
    compInstance.columnDefs = [];
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();
    const firstColumn = ArchitectureMetaDataFactory.getFirstColoumn();
    firstColumn.field = null;
    firstColumn.cellRenderer = null;
    firstColumn.getQuickFilterText = function (params) {
      return null;
    };
    // this.columnDefs.push(firstColumn); this is commented as we don't need empty row in the grid.
    compInstance.columnHeaderList = [];
    const thisInstance = compInstance;
    for (let i = 0; i < subsidiaryMetaData.length; i++) {
      const coloumnData = subsidiaryMetaData[i];
      // this.productSummaryService.namePersistanceColumnMap.set(coloumnData.persistanceColumn,coloumnData.name);
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.columnSize) {
        /*Get column width from meta data and assign it to respective column*/
        coloumnDef.width = this.appDataService.assignColumnWidth(
          coloumnData.columnSize
        );
      }
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.persistanceColumn;
        coloumnDef.filterParams = { cellHeight: 20 };
        if (coloumnData.name === 'customerGuName') {
          coloumnDef.width = 1000;
          coloumnDef.minWidth = 400;
          coloumnDef.cellClass = 'expandable-header';
          coloumnDef.pinned = true;
          coloumnDef.cellRenderer = 'group';
          coloumnDef.suppressMenu = true;
          coloumnDef.showRowGroup = true;
          coloumnDef.filter = 'agTextColumnFilter';
          coloumnDef.cellRendererParams = {
            checkbox: false,
            suppressCount: true,
            innerRenderer: 'innerCellRenderer'
          };
          compInstance.columnDefs.push(coloumnDef);
          /* const blankColumn = ArchitectureMetaDataFactory.getEmptyColoumn();
          blankColumn.field = 'startQual';
          blankColumn.pinned = true;
          blankColumn.width = 150;
          blankColumn.minWidth = 60;
          blankColumn.cellRenderer = this.startQualRenderer;
          blankColumn.filterParams = { 'cellHeight': 20 };
          this.columnDefs.push(blankColumn);*/
        } else if (coloumnData.hideColumn !== 'Y') {
          coloumnDef.width = 180;
          coloumnDef.minWidth = 120;
          if (coloumnData.dataType === 'Number') {
            coloumnDef.cellRenderer = 'currencyFormat';
            coloumnDef.cellClass = 'dollar-align';
            if (coloumnDef.cellRenderer === 'currencyFormat') {
              coloumnDef.cellRenderer = function (params) {
                return thisInstance.currencyFormat(params, thisInstance);
              };
            }
          }
          coloumnDef.field = coloumnData.persistanceColumn;
          if (coloumnData.groupName) {
            // this condition is for column grouping.
            coloumnDef.headerClass = 'child-header';
            compInstance.gridOptions.headerHeight = 35;
            if (
              coloumnData.name !== 'address1' &&
              coloumnData.name.substring(0, coloumnData.name.length - 1) ===
              'address'
            ) {
              coloumnDef.columnGroupShow = 'open';
            }
            if (headerGroupMap.has(coloumnData.groupName)) {
              const headerGroupObject = headerGroupMap.get(
                coloumnData.groupName
              );
              headerGroupObject.children.push(coloumnDef);
            } else {
              const headerObject: ArchitectureMetaDataJson = {
                headerName: coloumnData.groupName
              };
              headerObject.children = new Array<any>();
              headerGroupMap.set(coloumnData.groupName, headerObject);
              coloumnDef.suppressSorting = true;
              headerObject.children.push(coloumnDef);
              compInstance.columnDefs.push(headerObject);
            }
          } else {
            compInstance.columnDefs.push(coloumnDef);
          }
        }
        if (coloumnData.name === 'eaQty') {
          coloumnDef.width = 200;
          coloumnDef.minWidth = 180;
          // compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.name === 'id') {
          coloumnDef.width = 108;
          coloumnDef.minWidth = 108;
          // compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.name === 'address') {
          coloumnDef.width = 308;
          coloumnDef.minWidth = 308;
          // compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.name === 'state') {
          coloumnDef.width = 124;
          coloumnDef.minWidth = 124;
          // compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.name === 'zip') {
          coloumnDef.width = 110;
          coloumnDef.minWidth = 110;
          // compInstance.columnDefs.push(coloumnDef);
        }
        if (coloumnData.name !== 'customerGuName') {
          coloumnDef.suppressFilter = true;
        }
      }
    }
  }
}
