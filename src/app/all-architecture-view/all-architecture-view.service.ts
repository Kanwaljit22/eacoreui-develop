import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { map } from 'rxjs/operators'

@Injectable()
export class AllArchitectureViewService {

  constructor(private http: HttpClient, private appDataService: AppDataService) { }
  viewTabEmitter = new EventEmitter();
  activeAgreementData: any;
  searchDropDown = true;
  smartAccountId: any;
  public currentPage = 'agreements';
  viewConsumption = false;
  selectedVirtualAccount: any;

  getColDataConsumption() {
    return this.http.get('assets/data/agreements/consumptionMetaData.json');
  }

  getColDataAgreements() {
    return this.http.get('assets/data/agreements/agreementsMetaData.json');
  }

  getSmartAccountList() {
    const prospectkey = this.appDataService.customerID;
    return this.http.get(this.appDataService.getAppDomain +
      `api/prospect/agreement/smartAccount?prospectKey=${prospectkey}`)
      .pipe(map(res => res));

  }

  getAgreementsData(smartAccountId) {
    return this.http.get(this.appDataService.getAppDomain +
      `api/prospect/agreement/accounts?type=virtual&x-csw-smart-account-id=${smartAccountId}`)
      .pipe(map(res => res));
  }


  // getConsumptionData(){
  //   return this.http.get('assets/data/agreements/agreementsMetaData.json');
  // }


  getProposalListbyCustomer() {
    let reqObj = {};
    // if called from account health 360 page set limit to 3
    if (this.appDataService.isQualOrPropListFrom360Page) {
      reqObj = {
        data: {
          prospectKey: this.appDataService.customerID,
          limit: 3
        }
      };
    } else {
      reqObj = {
      data: {
        prospectKey: this.appDataService.customerID
      }
    };
  }

    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/list', reqObj)
      .pipe(map(res => res));

  }

  getSubHeaderData() {
    const reqObj = {
      data: {
        customerName: this.appDataService.customerName,
        prospectKey: this.appDataService.customerID
      }
    };

    return this.http.post(this.appDataService.getAppDomain + 'api/prospect/prospect-details-header', reqObj)
      .pipe(map(res => res));
  }

  getConsumptionData(smartAccountID, virtualAccountID, subscriptionID) {
    return this.http.get(this.appDataService.getAppDomain +
      `api/prospect/agreement/consumption?smartAccountID=${smartAccountID}&virtualAccountID=${virtualAccountID}&subscriptionID=${subscriptionID}`)
      .pipe(map(res => res));
  }

  getConsumptionDataTrueFwd(smartAccountID, virtualAccountID) {
    return this.http.get(this.appDataService.getAppDomain +
      `api/prospect/agreement/true-forward?smartAccountID=${smartAccountID}&virtualAccountID=${virtualAccountID}`)
      .pipe(map(res => res));
  }


}
export interface ArchitectureMetaDataJson {
  headerName: string;
  field?: string;
  filter?: string;
  width?: number;
  minWidth?: number;
  cellClass?: any;
  cellRenderer?: any;
  suppressMenu?: boolean;
  suppressSorting?: boolean;
  suppressSizeToFit?: boolean;
  pinned?: boolean;
  suppressToolPanel?: boolean;
  suppressMovable?: boolean;
  suppressResize?: boolean;
  getQuickFilterText?: any;
  filterParams?: any;
  sort?: string;
  hide?: boolean;
  headerClass?: string;
  children?: Array<any>;
  columnGroupShow?: any;
  lockPosition?: boolean;
  showRowGroup?: boolean;
  cellRendererParams?: any;
  valueFormatter?: any;
  checkboxSelection?: any;
  headerCheckboxSelectionFilteredOnly?: boolean;
  decimalExpr?: number;
  suppressFilter?: boolean;
}
export class ArchitectureMetaDataFactory {
  static readonly MIN_WIDTH = { SMALL_MIN_WIDTH: 30, BIG_MIN_WIDTH: 60 };
  // static readyOnly WIDTHS = {'EMPTY_COLOUMN_WIDTH':30};

  static getFirstColoumn(): ArchitectureMetaDataJson {
    const firstColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      suppressSorting: true,
      field: 'prospectid',
      suppressMenu: true,
      pinned: true,
      suppressToolPanel: true,
      suppressMovable: true,
      suppressResize: true,
      width: 50,
      minWidth: 30,
      cellRenderer: 'nodeRenderer',
      headerCheckboxSelectionFilteredOnly: true,
      lockPosition: true,
      getQuickFilterText: 'filterText',
      checkboxSelection: true
    };
    return firstColoumn;
  }

  static getEmptyColoumn(): ArchitectureMetaDataJson {
    const emptyColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      field: 'actionIcon',
      suppressSorting: true,
      suppressMenu: true,
      pinned: true,
      filterParams: {
        cellHeight: 20
      },
      suppressToolPanel: true,
      suppressMovable: true,
      suppressResize: true,
      width: 30,
      minWidth: 30,
      lockPosition: true,
      cellRenderer: 'actionCellRenderer',
      cellClass: 'more-dropdown',
      getQuickFilterText: 'filterText',
      suppressSizeToFit: true
    };
    return emptyColoumn;
  }

  static getDataColoumn(): ArchitectureMetaDataJson {
    const dataColoumn: ArchitectureMetaDataJson = {
      headerName: '',
      field: 'actionIcon',
      suppressMenu: true,
      lockPosition: true,
      width: 140,
      minWidth: 60,
      checkboxSelection: false
    };
    return dataColoumn;
  }
}
export interface PaginationObject {
  collectionSize?: number;
  page: number;
  pageSize: number;
}
