import { PermissionEnum } from '@app/permissions';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ConstantsService } from './../../../shared/services/constants.service';
import { element } from 'protractor';
import { ArchitectureMetaDataJson } from './../../../dashboard/product-summary/product-summary.component';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, RouterModule } from '@angular/router';
import { ManageAffiliatesService } from './manage-affiliates.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { GridInitializationService } from '@app/shared/ag-grid/grid-initialization.service';
import { ArchitectureMetaDataFactory } from '@app/dashboard/product-summary/product-summary.component';
import { QualificationsService } from '@app/qualifications/qualifications.service';
// import { ProspectDetailSubsidiaryService } from '@app/prospect-details/prospect-detail-subsidiary/prospect-detail-subsidiary.service';
import { IRoadMap, RoadMapConstants } from '@app/shared';
import { SubHeaderComponent } from '../../../shared/sub-header/sub-header.component';
import { LocaleService } from '@app/shared/services/locale.service';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddAffiliatesNameComponent } from '@app/modal/add-affiliates-name/add-affiliates-name.component';

import { PermissionService } from '@app/permission.service';
import { LookupNewSubsidiariesComponent } from '../../../modal/lookup-new-subsidiaries/lookup-new-subsidiaries.component';
import { NodeColumnComponent } from './node-column/node-column.component';


@Component({
  selector: 'app-manage-affiliates',
  templateUrl: './manage-affiliates.component.html',
  styleUrls: ['./manage-affiliates.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManageAffiliatesComponent implements OnInit, OnDestroy {
  roadMap: IRoadMap;
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  public columnDefs: any[];
  public rowCount: string;
  viewdata: string;
  affiliatesData: any[];
  columnHeaderList: any[];
  private components;
  subsidiaryData: any[];
  customerIdSet: any = new Set();
  clickedCustomerName: string = undefined;
  excludedHQs = [];
  excludedGUs = [];
  excludedAffiliatesSet: any = new Set();
  excludedAffiliatesSetHQ: any = new Set();
  previouslyExcludedGQ: any = new Set();
  previouslyExcludedHQ: any = new Set();
  updatedvalues: any = new Set();
  sortingObject: any;
  customerGuId;
  childrenCount: any;
  noOfChange = 0;
  showCleanCoreButton: boolean;
  public subscribers: any = {};
  isUpdatedByUser = false;
  isListUpdated = false;
  includedCountriesSet = new Set();  // Added set to  disable continue button if no subsidiaries selected
  disableAffiliates = false;
  isDefaultView = true;



  constructor(public localeService: LocaleService, public affiliatesService: ManageAffiliatesService,
    private utilitiesService: UtilitiesService, private router: Router, private messageService: MessageService
    , public appDataService: AppDataService, private modalVar: NgbModal, 
    private gridInitialization: GridInitializationService, public qualService: QualificationsService,
    public permissionService: PermissionService, public constantsService: ConstantsService, public blockUiService: BlockUiService,
    private configngb: NgbDropdownConfig
  ) {
    this.init();
  }
  init() {
    this.configngb.placement = 'bottom-right';
    // configngb.autoClose = false;
    this.gridOptions = <GridOptions>{};
    this.gridOptions = <GridOptions>{};
    this.gridInitialization.initGrid(this.gridOptions);
    this.createColumnDefs();
    this.showGrid = true;
    this.qualService.prepareSubHeaderObject(SubHeaderComponent.EDIT_QUALIFICATION, true);
    this.gridOptions.getRowClass = function (params) {
      if (!params.data.children && params.node.lastChild === true) {
        return 'lastChild';
      }

    };
    this.gridOptions.frameworkComponents = {
      nodeTypeCell: <{ new(): NodeColumnComponent }>(
        NodeColumnComponent
      )
    };
  }


  // View dropdown feature in pagination
  onPageSizeChanged($event: any) {
    this.gridOptions.api.paginationSetPageSize(Number(this.viewdata));
  }

  getSubsidiaryData() {
    if (!this.permissionService.qualEdit) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
      this.disableAffiliates = true;
      this.affiliatesService.readOnlyMode = true;
    }

    if (this.appDataService.roadMapPath || this.appDataService.roSalesTeam || this.qualService.qualification.prevChangeSubQualId) {
      this.gridOptions.rowClassRules = {
        'checkboxDisable': function (params) {
          return true;
        }
      };
      this.disableAffiliates = true;
      this.affiliatesService.readOnlyMode = true;
    }

    try {
      this.affiliatesService.loadSubsidiaryData(null);
    } catch (error) {
      this.messageService.displayUiTechnicalError(error);
    }
    /*
        setTimeout(() => {
          this.utilitiesService.setTableHeight();
        });
      */
  }


  // Saving affiliates in all scenario icluding back,continue etc
  public ngOnDestroy() {
    this.appDataService.showActivityLogIcon(false);
    // unsubscribe to roadmap emitter after reopening
    this.qualService.unSubscribe();
  }

  // Update qualification status to in progress incase of any changes
  updateQualificationStatus() {

    //  if(this.qualService.qualification.status === this.constantsService.COMPLETE_STATUS) {

    //     this.qualService.updateQualStatus()
    //   }
  }


  ngOnInit() {
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.affiliatesService.readOnlyMode = false;
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.qualificationDefineSubsidiaryStep;
    this.appDataService.showActivityLogIcon(true);
    // this.appDataService.isProposalIconEditable = true;
    // enable edit icon only if qual edit is present
    if (this.permissionService.qualEdit) {
      this.appDataService.isProposalIconEditable = true;
    } else {
      this.appDataService.isProposalIconEditable = false;
    }
    this.createColumnDefs();
    this.noOfChange = 0;
    this.getSubsidiaryData();
    this.gridOptions.onSortChanged = () => {
      // console.log(this.gridOptions.api.getSortModel());
      this.updateRowDataOnSort(this.gridOptions.api.getSortModel());
    };


    this.affiliatesService.subsidiaryDataEmitter.subscribe(
      (gridData: Array<{}>) => {


        if (
          this.gridOptions.api === null ||
          this.gridOptions.api === undefined
        ) {
          this.gridOptions = <GridOptions>{
            onGridReady: () => {
              this.gridOptions.rowData = gridData;
            }
          };
          // this.gridOptions.onGridReady();
        } else {
          if (this.gridOptions.api) {
            this.gridOptions.api.setRowData(gridData);
          }
          this.setCheckboxValue(gridData);
        }
      }
    );
    // reinitialize this 4 service variables so that they dont values of priviously visitated qualification.
    this.affiliatesService.excludedAffiliatesSet = new Set();
    this.affiliatesService.excludedAffiliatesSetHQ = new Set();
    this.affiliatesService.excludedGUs = [];
    this.affiliatesService.excludedHQs = [];
    this.cleanCoreEligibleCheck();
  }

  public prepareSubsidiaryMetaData(subsidiaryMetaData: any, compInstance) {
    compInstance.columnDefs = [];
    const headerGroupMap = new Map<string, ArchitectureMetaDataJson>();

    compInstance.columnHeaderList = [];
    const thisInstance = compInstance;
    for (let i = 0; i < subsidiaryMetaData.length; i++) {
      const coloumnData = subsidiaryMetaData[i];
      // this.productSummaryService.namePersistanceColumnMap.set(coloumnData.persistanceColumn,coloumnData.name);
      const coloumnDef = ArchitectureMetaDataFactory.getDataColoumn();
      if (coloumnData.columnSize) {
        /* Get column width from meta data and assign it to respective column */
        coloumnDef.width = this.appDataService.assignColumnWidth(
          coloumnData.columnSize
        );
      }
      if (coloumnData.name) {
        coloumnDef.headerName = coloumnData.displayName;
        coloumnDef.field = coloumnData.name;
        coloumnDef.filterParams = { cellHeight: 20 };
        if (coloumnData.name === 'customerGuName') {
          coloumnDef.width = 550;
          coloumnDef.pinned = true;
          coloumnDef.cellClass = 'expandable-header';
          coloumnDef.cellRenderer = 'agGroupCellRenderer';
          coloumnDef.checkboxSelection = true;
          // coloumnDef.cellRenderer ='agGroupCellRenderer',

          compInstance.columnDefs.push(coloumnDef);
        } else if (coloumnData.hideColumn !== 'Y') {
          coloumnDef.width = 180;
          coloumnDef.minWidth = 60;
          if (coloumnData.dataType === 'Number') {
            coloumnDef.cellRenderer = 'currencyFormat';
            coloumnDef.cellClass = 'dollar-align';
            if (coloumnDef.cellRenderer === 'currencyFormat') {
              coloumnDef.cellRenderer = function (params) {
                return thisInstance.currencyFormat(params, thisInstance);
              };
            }
          }
          coloumnDef.field = coloumnData.name;
          if (coloumnData.groupName) {
            // this condition is for column grouping.
            coloumnDef.headerClass = 'child-header';
            compInstance.gridOptions.headerHeight = 30;
            if (
              coloumnData.name !== 'address1' &&
              coloumnData.name.substring(0, coloumnData.name.length - 1) ===
              'address'
            ) {
              coloumnDef.columnGroupShow = 'open';
            }
            // console.log(coloumnData);
            // if (coloumnData.name === 'type') {
            //   coloumnDef.cellRenderer = 'nodeTypeCell';
            // }
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
              // coloumnDef.cellRendererParams = {
              //   checkbox: false
              // };
              headerObject.children.push(coloumnDef);
              compInstance.columnDefs.push(headerObject);
            }
          } else {
            if (coloumnData.name === 'address1') {
              coloumnDef.width = 256;
            }
            if (coloumnData.name === 'theater') {
              coloumnDef.width = 238;
            }
            compInstance.columnDefs.push(coloumnDef);
          }
        }
      }
    }
  }

  private createColumnDefs() {
    this.blockUiService.spinnerConfig.startChain();

    const thisInstance = this;
    const subsidiaryMetaData = this.appDataService.getDetailsMetaData(
      'QUAL_SUBSIDARY'
    );
    this.prepareSubsidiaryMetaData(subsidiaryMetaData.columns, this);
  }

  updateRowDataOnSort(sortColObj: any) {
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
        this.affiliatesService.subsidiaryData,
        sortingType,
        sortingField
      );
    } catch (error) {
      console.error(error);
      this.messageService.displayUiTechnicalError(error);
    }

    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(
        this.affiliatesService.subsidiaryData
      );
    }

    this.setCheckboxValue(this.affiliatesService.subsidiaryData);
    this.gridOptions.api.forEachNode(node => {
      let customerId;
      if (node.level === 0) {
        customerId = this.constantsService.GU + node.data.END_CUSTOMER_ID;
      } else if (node.level === 1) {
        customerId = this.constantsService.HQ + node.data.END_CUSTOMER_ID;
      }
      if (this.isExpandedRow(customerId)) {
        node.setExpanded(true);
      }
    });
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  getNodeChildDetails(rowItem) {
    if(rowItem.expandableYOrN){
    const returnObj = { 
      group: false,
      children: rowItem.children,
      key: rowItem.group
      };
    if (rowItem.expandableYOrN === 'Y') {
      returnObj.group = true;
    }
    return returnObj;
  } else {
    return null;
  }
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  public onModelUpdated() {
    this.calculateRowCount();
  }

  public onReady() {
    this.calculateRowCount();
  }

  // To show change or add affiliates
  showChangeAffiliates() {

    if ((this.qualService.qualification.customerInfo.affiliateNames &&
      this.qualService.qualification.customerInfo.affiliateNames.length > 0) ||
      this.qualService.qualification.customerInfo.filename.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onRowGroupOpened($event) {
    if ($event.node.level === 1) {
      this.onCellClicked($event, true);
    }
  }

  public onCellClicked($event, iconClick?: boolean) {
    // changing isUpdatedByUser to false else in onRowSelected method it will change updatedvalues set for expantion also.
    this.isUpdatedByUser = false;
    const children = $event.data.children;

    if ((iconClick || $event.colDef.field === 'customerGuName') && children && $event.data.END_CUSTOMER_ID) {
      let customerID = '';
      if ($event.node.level === 0) {
        customerID = this.constantsService.GU + $event.data.END_CUSTOMER_ID;
      } else if ($event.node.level === 1) {
        customerID = this.constantsService.HQ + $event.data.END_CUSTOMER_ID;
      }

      if (!this.customerIdSet.has(customerID)) {
        // set checks if the node was collapsed or expanded
        if ($event.node.level === 0) {
          this.customerIdSet.add(customerID);
          this.customerGuId = customerID;
        } else if ($event.node.level === 1) {
          this.customerIdSet.add(customerID);
        }

      } else {
        this.customerIdSet.delete(customerID);
      }
    }

    const selectedRow = this.gridOptions.api.getSelectedRows();

    const endCustomerId = $event.data['END_CUSTOMER_ID'];
    const request = this.affiliatesService.loadSubsidiaryRequest;
    request.hqId = endCustomerId;
    request.guId = $event.data['parentId'];
    // console.log(this.gridOptions.api.onGroupExpandedOrCollapsed());
    const subsidiaryDataForThirdLevel: Array<any> = [];
    // console.log(this.gridOptions.api.getFocusedCell());

    if (
      $event.rowIndex !== 0 &&
      $event.data.children &&
      $event.data.children.length === 1 && !$event.data.party && $event.data.expandableYOrN === 'Y' &&
      Object.entries($event.data.children[0]).length === 0
    ) {
      this.affiliatesService
        .getSubsidiaryDataList(request)
        .subscribe((response: any) => {
          if (response) {
            if (response.messages && response.messages.length > 0) {
              this.messageService.displayMessagesFromResponse(response);
            }
            if (!response.error && response.data) {
              try {
                this.clickedCustomerName = $event.value;
                const subsidiaryData = response.data;
                for (let i = 0; i < subsidiaryData.length; i++) {
                  const subsidiaryRow = subsidiaryData[i];
                  if (subsidiaryRow) {
                    const record = subsidiaryRow;
                    record['customerGuName'] = subsidiaryRow.name;
                    record['address'] = subsidiaryRow.address1;
                    record['selected'] = subsidiaryRow.exclusion;
                    // const record = { customerGuName: subsidiaryRow.name };
                    // const colData = subsidiaryRow;
                    // for (let j = 0; j < colData.length; j++) {
                    //   const subsidiaryColData = colData[j];
                    //   record[subsidiaryColData.name] = subsidiaryColData.value;
                    // }
                    subsidiaryDataForThirdLevel.push(record);
                  }
                }
                const currentRowData = this.affiliatesService.subsidiaryDataMap.get(
                  endCustomerId
                );
                currentRowData.children = subsidiaryDataForThirdLevel;
                if (this.gridOptions.api) {
                  this.gridOptions.api.setRowData(
                    this.affiliatesService.subsidiaryData
                  );
                }

                // to check/uncheck checkboxes in Subsidiary according to exclusion flag
                this.setCheckboxValue(this.affiliatesService.subsidiaryData);
                this.noOfChange = 0;

                this.gridOptions.api.forEachNode(node => {
                  let customerId;
                  if (node.level === 0) {
                    customerId = this.constantsService.GU + node.data.END_CUSTOMER_ID;
                  } else if (node.level === 1) {
                    customerId = this.constantsService.HQ + node.data.END_CUSTOMER_ID;
                  }
                 
                  if (this.isExpandedRow(customerId)) {
                    node.parent.setExpanded(true);
                    node.setExpanded(true);
                  }
                });
                this.gridOptions.api.ensureIndexVisible(
                  $event.rowIndex + 5,
                  undefined
                );
              } catch (error) {
                this.messageService.displayUiTechnicalError(error);
              }
            } else {
              this.messageService.displayMessagesFromResponse(response);
            }
          }
        });
    }
  }

  setCheckboxValue(qualGeoData) {

    // Set updated by user flag false on sorting
    this.isUpdatedByUser = false;

    const thisInstance = this;
    // goes through each node data & sets checkbox default value as received from backend api
    try {
      this.gridOptions.api.forEachNode(function (rowNode) {
        // console.log(rowNode);
        if (qualGeoData.length === 1 && rowNode.level === 0) {
          rowNode.setExpanded(true);
        }
        qualGeoData.forEach(ele => {

          if (ele.customerGuName === rowNode.data.customerGuName && ele.id === rowNode.data.id) {
            if (thisInstance.previouslyExcludedGQ.has(ele.id) && thisInstance.updatedvalues.has('G' + ele.id)) {
              // if previously excluded values are selected

              rowNode.setSelected(ele.exclusion);
            } else if (thisInstance.excludedGUs.includes(ele.id)) {
              rowNode.setSelected(!ele.exclusion);
            } else {
              rowNode.setSelected(!ele.exclusion);
            }
            // to expand the row which has any(1 or more) children as unchecked
            // rowNode.setExpanded(ele.selected);
          }
          if (ele.children) {
            for (let i = 0; i < ele.children.length; i++) {
              if (ele.children[i].customerGuName === rowNode.data.customerGuName && ele.children[i].id === rowNode.data.id) {
                if (thisInstance.previouslyExcludedHQ.has(ele.children[i].id) &&
                  thisInstance.updatedvalues.has('H' + ele.children[i].id) ||
                  thisInstance.updatedvalues.has('H' + ele.children[i].id)) {
                  // if previously excluded values are selected
                  rowNode.setSelected(ele.children[i].selected);
                } else if (thisInstance.excludedHQs.includes(ele.children[i].id)) {
                  rowNode.setSelected(!ele.children[i].selected);
                } else {
                  rowNode.setSelected(!ele.children[i].selected);
                }
              }
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
      this.messageService.displayUiTechnicalError(error);
    }
  }


  saveAffiliates() {
    const requestGUArray = []
    this.affiliatesService.subsidiaryData.forEach(x => {
      this.affiliatesService.excludedHQs = [];
    this.affiliatesService.excludedGUs = [];
    this.affiliatesService.excludedPartys = [];
    this.affiliatesService.exclusions.forEach((value, key) => {
      
        if (x.END_CUSTOMER_ID === key && (value.size < x.children.length)) {
          value.forEach(ele => {
            // check for id and party true or not then push to respected
            for (const d of x.children) {
              if (d.id === ele && d.party) {
                this.affiliatesService.excludedPartys.push(ele);
              } else if (d.id === ele && !d.party) {
                this.affiliatesService.excludedHQs.push(ele);
              }
            }
          });
        } else if (x.END_CUSTOMER_ID === key && (value.size === x.children.length)) {
          this.affiliatesService.excludedGUs.push(key);
        }


        

      });
      const guObject = {
        'id': x.END_CUSTOMER_ID,
        'excludedHQs': this.affiliatesService.excludedHQs,
        'excludedPartys': this.affiliatesService.excludedPartys,
        'exclusion': (this.affiliatesService.excludedGUs.length) ? true: false
      }

      requestGUArray.push(guObject);
      
    });

    const reqObject = {
      // userId: this.appDataService.userId,
      qualId: this.qualService.qualification.qualID,
      gus: requestGUArray
    };
    this.affiliatesService.saveAffilates(reqObject)
      .subscribe((res: any) => {
        if (res) {
          this.roadMap.eventWithHandlers.continue();
          if (res.messages && res.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(res);
          }
          if (!res.error) {
            this.isListUpdated = true;

          }
        }
      });
  }

  // To show expand and collapse row
  private isExpandedRow(endCustomerId: string) {

    let expandedRow = false;
    const arrayCustomer = Array.from(this.customerIdSet.values());

    for (let i = 0; i < arrayCustomer.length; i++) {

      if (arrayCustomer[i] === endCustomerId) {

        expandedRow = true;
        break;
      }
    }
    return expandedRow;
  }

  public onCellValueChanged($event) {
    // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  public onCellDoubleClicked($event) {
    // console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellContextMenu($event) {
    // console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  public onCellFocused($event) {
    // console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  public onRowSelected($event) {

    if ($event.node.level === 0 && $event.node.selected !== undefined) {
      if (!($event.node.selected)) {
        if ($event.data.children && $event.data.children.length === 0) { // check if standalone Gus
          this.affiliatesService.exclusions.set($event.data.END_CUSTOMER_ID, new Set());
        } else {
          this.affiliatesService.exclusions.set($event.data.END_CUSTOMER_ID, new Set());
        }
        this.affiliatesService.excludedAffiliatesSet.add($event.data.END_CUSTOMER_ID);
        if (this.isUpdatedByUser) {
          // to keep trak of GUs excluded by user
          this.excludedGUs.push($event.data.END_CUSTOMER_ID);
          // excludedAffiliatesSet<> keeps track of unique country codes
          this.excludedAffiliatesSet.add($event.data.END_CUSTOMER_ID);
        }

        // remove unselected gu subsidiaries
        const customerId = this.constantsService.GU + $event.data.END_CUSTOMER_ID;
        this.includedCountriesSet.delete(customerId);

      } else {
        if (this.isUpdatedByUser) {
          this.excludedAffiliatesSet.delete($event.data.END_CUSTOMER_ID);
          this.excludedGUs = [];
          // excludedCountries[] array if formed by iterating through the set
          this.excludedAffiliatesSet.forEach(code => {
            this.excludedGUs.push(code);
          });
        }
        if (this.affiliatesService.exclusions.has($event.data.END_CUSTOMER_ID)) {
          this.affiliatesService.excludedAffiliatesSet.delete($event.data.END_CUSTOMER_ID);
          this.affiliatesService.exclusions.delete($event.data.END_CUSTOMER_ID);
        }
        // add selected gu subsidiaries
        const customerId = this.constantsService.GU + $event.data.END_CUSTOMER_ID;
        this.includedCountriesSet.add(customerId);
      }
    } else if ($event.node.level === 1 && $event.node.selected !== undefined) {
      const hqExcluded = new Set();
      if (!($event.node.selected)) {
        if (this.isUpdatedByUser) {
          this.excludedHQs.push($event.data.END_CUSTOMER_ID);
          // excludedAffiliatesSet<> keeps track of unique country codes
          this.excludedAffiliatesSetHQ.add($event.data.END_CUSTOMER_ID);
        }
        hqExcluded.add($event.data.END_CUSTOMER_ID);
        if (!this.affiliatesService.exclusions.has($event.data.parentId)) {
          this.affiliatesService.exclusions.set($event.data.parentId, hqExcluded);
        } else {
          const x = this.affiliatesService.exclusions.get($event.data.parentId);
          x.add($event.data.END_CUSTOMER_ID);
          this.affiliatesService.exclusions.set($event.data.parentId, x);
        }
        this.affiliatesService.excludedAffiliatesSetHQ.add($event.data.END_CUSTOMER_ID);

        // remove unselected hq countries
        const customerId = this.constantsService.HQ + $event.data.END_CUSTOMER_ID;
        this.includedCountriesSet.delete(customerId);

      } else {
        if (this.isUpdatedByUser) {
          this.excludedAffiliatesSetHQ.delete($event.data.END_CUSTOMER_ID);
          this.excludedHQs = [];
          // excludedCountries[] array if formed by iterating through the set
          this.excludedAffiliatesSetHQ.forEach(code => {
            this.excludedHQs.push(code);
          });
        }
        if (this.affiliatesService.exclusions.has($event.data.parentId)) {
          const x = this.affiliatesService.exclusions.get($event.data.parentId);
          x.delete($event.data.END_CUSTOMER_ID);
          this.affiliatesService.exclusions.set($event.data.parentId, x);
          this.affiliatesService.excludedAffiliatesSetHQ.delete($event.data.END_CUSTOMER_ID);
        }

        // add selected hq subsidiaries
        const customerId = this.constantsService.HQ + $event.data.END_CUSTOMER_ID;
        this.includedCountriesSet.add(customerId);

      }
    }
    if (!this.isUpdatedByUser) {
      // to get the excluded HQ and GU which are already saved.
      this.affiliatesService.excludedAffiliatesSetHQ.forEach(id => {
        this.previouslyExcludedHQ.add(id);
      });
      this.affiliatesService.excludedAffiliatesSet.forEach(id => {
        this.previouslyExcludedGQ.add(id);
      });
    } else {

      // to get the values user is  selecting or excluding
      let updatedCustomerID = '';
      // Set gu id
      if ($event.node.level === 0) {
        updatedCustomerID = this.constantsService.GU + $event.data.END_CUSTOMER_ID;
      } else if ($event.node.level === 1) {  // Set hq id
        updatedCustomerID = this.constantsService.HQ + $event.data.END_CUSTOMER_ID;
      }

      if (this.updatedvalues.has(updatedCustomerID)) {
        this.updatedvalues.delete(updatedCustomerID);
      } else {
        this.updatedvalues.add(updatedCustomerID);
      }
    }
  }


  // public onSelectionChanged() {
  //   this.noOfChange++
  //   if (this.noOfChange > 1 && this.qualService.qualification.qualStatus === this.constantsService.QUALIFICATION_COMPLETE &&
  //      this.isUpdatedByUser) {
  //     this.qualService.updateQualStatus();
  //   }
  // }

  public onBeforeFilterChanged() {
    // console.log('beforeFilterChanged');
  }

  public onAfterFilterChanged() {
    // console.log('afterFilterChanged');
  }

  public onFilterModified() {
    // console.log('onFilterModified');
  }

  public onBeforeSortChanged() {
    //  console.log('onBeforeSortChanged');
  }

  public onAfterSortChanged() {
    // console.log('onAfterSortChanged');
  }

  public onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  public onRowClicked($event) {
    //  console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  public onColumnEvent($event) {
    // console.log('onColumnEvent: ' + $event);
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  continueToQualSummary() {
    // Set get subsdiary flag when save affiliates emitter  is called
    if (this.updatedvalues.size > 0 && this.isDefaultView) {
      this.saveAffiliates();
    } else {
      this.roadMap.eventWithHandlers.continue();
    }
  }

  openAddModal() {
    const modalRef = this.modalVar.open(AddAffiliatesNameComponent, { windowClass: 'add-affiliates' });
    modalRef.componentInstance.showChangeAffiliateOnUI = this.showChangeAffiliates();
  }


  backToGeography() {
    this.roadMap.eventWithHandlers.back();
  }

  viewQualification() {
    this.qualService.goToQualification();
  }

  cleanCoreEligibleCheck() {
    this.showCleanCoreButton = false;
    this.appDataService.cleanCoreAuthorizationCheck().subscribe((resp: any) => {

      if (resp && resp.data) {
        this.showCleanCoreButton = resp.data.eligible;

      }
      // if (resp && resp.value) {
      //   console.log('users ['+resp.value+']');
      //   let accessibleUsers: string = <string>resp.value;
      //   let users: string[] = accessibleUsers.split(',');
      //   if (users.includes(this.appDataService.userInfo.userId)) {
      //     this.showCleanCoreButton = true;
      //   } else {
      //     this.showCleanCoreButton = false;
      //   }
      // }
    });

  }

  redirectToCleanCore() {

    this.appDataService.cleanCoreRedirect(this.qualService.qualification.qualID);
    // .subscribe((response: any) => {
    //   if (response) {
    //     console.log('Redirect [' + response + ']');
    //     /* Getting callbackUrl and ciscoReadyUrl  from two parallel  subscriptons and join them in forkJoin */
    //     //this.document.location.href = response.data.redirectUrl;
    //     window.location.href = response.data.redirectUrl;
    //   }
    // });
  }

  // this mathod will be called only when user will click inside the grid.
  updatedByUser() {
    this.isUpdatedByUser = true;
  }


  // reopen qual at page level
  reopenQual() {
    this.qualService.reopenQual();
    // subscibe to emitter to get value of roadmappath
    this.subscribers.roadMapEmitter = this.qualService.roadMapEmitter.subscribe((roadMapPath: any) => {
      // enable edit icon only if qual edit is present
      if (this.permissionService.qualEdit) {
        this.appDataService.isProposalIconEditable = true;
      } else {
        this.appDataService.isProposalIconEditable = false;
      }
      // if roadmappath is false reopen, reopen the page
      if (!roadMapPath) {
        this.gridOptions.rowClassRules = {
          'checkboxDisable': function (params) {
            return false;
          }
        };
        // set the grid after reopened
        if (this.gridOptions.api) {
          this.gridOptions.api.redrawRows();
        }
        this.disableAffiliates = false;
        this.affiliatesService.readOnlyMode = false;

      }
    });
  }

  openlookupSubsidiaries() {
    const modalRef = this.modalVar.open(LookupNewSubsidiariesComponent, { windowClass: 'lookup-subsidiaries' });
  }

  swithToggle() {
    this.affiliatesService.smartViewSearchString = '';
    this.affiliatesService.isAdvanceSearchApplied = false;
    this.isDefaultView = !this.isDefaultView;
    if (this.isDefaultView) {
      this.init();
      this.ngOnInit();
    } else {
      this.ngOnDestroy();
    }

  }

}
