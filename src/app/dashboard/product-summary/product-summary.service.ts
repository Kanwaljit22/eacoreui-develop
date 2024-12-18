import { Injectable, EventEmitter, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppDataService } from '../../shared/services/app.data.service';
import { FiltersService, SelectedFilterJson } from '../filters/filters.service';
import { UserInfoJson } from '../../header/header.component';
import { forkJoin } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MessageService } from '../../shared/services/message.service';
import { BlockUiService } from '../../shared/services/block.ui.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ProductSummaryService {
  checkCisco: boolean;
  checkSecurity: boolean;
  checkCollaboration: boolean;
  prospectRowData = new Array<{}>();
  loadProspectEmitter = new EventEmitter<Array<{}>>();
  selectedNoOfCustomer: number | string;
  selectedTcvAmount: number | string;
  prospectInfoObject: {
    architecture: string;
    sort: any;
    filter: {};
    page: any;
  } = { architecture: '', sort: {}, filter: {}, page: {} };
  namePersistanceColumnMap = new Map<string, string>();
  salesLevelFilterArray: any = [];

  //  Below properties are use for search by customer funationality
  isSearchByCustomer = false;
  searchInput: string;
  viewType: string;
  customerSearchObject: any;
  prospectData = false;
  onProductSummary = false;
  viewFavorites = false;
  globalView = false;

  //  Count of green field(new) customers
  greenFieldCustomersCount = 0;

  /*
  *  This property is use to check wheather status column is present or not.
  */

  isStatusColumnPresent = false;

  showPartnerBooking = false;
  architectureBreakdown = false;
  sortColumnname = '';
  sortOrder = '';

  constructor(
    @Inject(DOCUMENT) private document: any,
    private http: HttpClient,
    private configService: AppDataService,
    private filtersService: FiltersService,
    private messageService: MessageService,
    private blockUiService: BlockUiService
  ) {
    this.prospectRowData.push({ colName: 'customerName' });
    this.prospectRowData.push({ status: 'prospectIdentify' });
  }

  getEaData() {
    return this.http
      .get(
        this.configService.getAppDomain + '/app/assets/data/ea-prospects.json'
      )
      .pipe(map(res => res));
  }

  //  method to call prospect deal look up data api
  showProspectDealLookUp(dealLookUpRequest: any) {
    return this.http.get(this.configService.getAppDomain + 'api/dashboard/searchByDealId?d=' + dealLookUpRequest.dealId +'&p=' + dealLookUpRequest.customerId).pipe(map(res => res));
  }

  loadArchitecturesData(architectureName?) {
    if (sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)) {
      const userInfoJson = JSON.parse(
        sessionStorage.getItem(AppDataService.USERINFO_SESSION_STORAGE)
      );
      this.configService.userInfo.userId = userInfoJson.userId;
    }
    return this.http
      .get(
        this.configService.getAppDomain +
        'api/dashboard/getArchitecture?archName=ALL'
      )
      .pipe(map(res => res));
  }

  getAllArchData(request) {
    if (!this.configService.userInfo.salesAccountView) {
      delete request.prospectInfo.viewType;
    }
    return this.http.post(this.configService.getAppDomain + 'api/prospect/summary', request)
      .pipe(map(res => res));
  }

  getArchitectureData(architectureName: string) {
    return this.http
      .get(
        this.configService.getAppDomain +
        'api/dashboard/architectureMetaInfo/' +
        architectureName
      )
      .pipe(map(res => res));
  }

  getColumnsDefinition() {
    return this.http
      .get(this.configService.getAppDomain + '/app/assets/data/ea-columns.json')
      .pipe(map(res => res));
  }

  loadProspect(loadPropectObj) {
    // loadPropectObj['userId'] = this.configService.userId;
    return this.http
      .post(
        this.configService.getAppDomain + 'api/dashboard/architectureSummary',
        loadPropectObj
      )
      .pipe(map(res => res));
  }

  loadProspectCall(viewType = 'Global') {
    this.viewFavorites = false;
    let loadProdpectJson: any;
    if (!this.isSearchByCustomer) {
      const filterData: Map<string, SelectedFilterJson> = this.filtersService
        .selectedFilterMap;
      const filters = new Array<{}>();

      //  console.log(filterData);
      filterData.forEach((value: SelectedFilterJson, key: string) => {
        if (value.selectedValue === null || value.selectedValue === undefined) {
          value.selectedValue = value.defaultValue;
        }
        const filterObj = {
          name: key,
          selectedValue: value.selectedValue,
          operator: value.operator,
          type: value.type,
          persistanceColumn: value.persistanceColumn
        };
        if (value.filterApplied === 'Y' && value.name !== 'salesLevel') {
          filters.push(filterObj);
        }
        if (value.name === 'salesLevel') {
          this.salesLevelFilterArray = value.selectedValue;
          // console.log(this.salesLevelFilterArray);
        }
      });

      loadProdpectJson = {
        prospectInfo: {
          architecture: this.prospectInfoObject.architecture,
          sort: this.prospectInfoObject.sort,
          filter: filters,
          page: this.prospectInfoObject.page,
          salesLevelFilter: this.salesLevelFilterArray
        }
      };
      if (viewType !== 'Global') {
        loadProdpectJson['prospectInfo']['viewType'] = 'Sales_account_view';
      }

      this.prospectInfoObject.filter = filters;
    } else {
      loadProdpectJson = {
        prospectInfo: {
          customerName: this.searchInput,
          architecture: this.prospectInfoObject.architecture,
          sort: this.prospectInfoObject.sort,
          page: this.prospectInfoObject.page,
          customerSearch: {
            view: this.viewType
          }
        }
      };
    }
    this.sortColumnname = this.prospectInfoObject.sort.persistanceColumn;
    this.sortOrder =  this.prospectInfoObject.sort.type; 
    this.prospectRowData = new Array<{}>();
    this.getAllArchData(loadProdpectJson).subscribe((response: any) => {
      if (response && !response.error) {
        // Reset the count
        this.greenFieldCustomersCount = 0;
        try {
          const prospectData = response.prospectInfo.data;
          if (prospectData !== undefined) {
            this.prospectData = true;
          } else {
            this.prospectData = false;
          }

          if (response.prospectInfo.page) {
            this.prospectInfoObject.page = response.prospectInfo.page;
          }
          if (response.prospectInfo.customerSearch) {
            this.customerSearchObject = response.prospectInfo.customerSearch;
          }

          if (prospectData) {
            for (let i = 0; i < prospectData.length; i++) {
              const prospect = prospectData[i];
              const columns = prospect.column;
              const record = {
                prospectid: i,
                customerName: prospect.customerName
              };
              if (this.isStatusColumnPresent) {
                record['status'] = prospect.status;
              }
              if (prospect.favorite) {
                record['flagged'] = 1;
              }
              for (let j = 0; j < columns.length; j++) {
                const column = columns[j];
                if (
                  column &&
                  (column.name !== 'customerName' && column.name !== 'status')
                ) {
                  record[column.name] = column.value;
                  // Check if its green field(new) customer
                  if (column.name === 'GREENFIELD_YORN' && column.value === 'Y') {
                    this.greenFieldCustomersCount++;
                  }
                }
              }
              record['customerId'] = prospectData[i].customerId;
              this.prospectRowData.push(record);
            }
          }
          setTimeout(() => {
            this.blockUiService.spinnerConfig.stopChainAfterThisCall();
            this.blockUiService.spinnerConfig.unBlockUI();
          }, 1000);
          this.loadProspectEmitter.emit(this.prospectRowData);
        } catch (error) {
          this.blockUiService.spinnerConfig.stopChainAfterThisCall();
          this.blockUiService.spinnerConfig.unBlockUI();
          // console.error(error.ERROR_MESSAGE);
          this.messageService.displayUiTechnicalError(error);
        }
      } else {
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
        this.blockUiService.spinnerConfig.unBlockUI();
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  searchByCustomer(searchInput, viewType) {
    let searchByCustomerObj = {
      prospectInfo: {
        customerName: searchInput,
        architecture: this.prospectInfoObject.architecture,
        sort: this.prospectInfoObject.sort,
        customerSearch: {
          view: viewType
        }
      }
    };
    return this.http
      .post(
        this.configService.getAppDomain + 'api/dashboard/architectureSummary',
        searchByCustomerObj
      )
      .pipe(map(res => res));
  }

  addFavorite(customerId) {
    let favoriteObj = {
      customerId: customerId
    };
    return this.http.put(this.configService.getAppDomain + 'api/favorite/add', favoriteObj)
      .pipe(map(res => res));
  }

  removeFavorite(customerId, archName) {
    let favoriteObj = {
      customerId: customerId,
      user: this.configService.userId
    };
    return this.http.request(
      'delete',
      this.configService.getAppDomain + 'api/favorite/remove',
      { body: favoriteObj }
    )
      .pipe(map(res => res));
  }

  getFavorite() {
    return this.http.get(this.configService.getAppDomain + 'api/favorite/show')
      .pipe(map(res => res));
    // return this.http.get('assets/data/fav.json');
  }



  saveGreenfieldProspect(customerName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    //  added encodeURI component for sending customerName to get the prospectKey from service
    return this.http
      .post(this.configService.getAppDomain + 'api/prospect/greenfield?cn=' + encodeURIComponent(customerName.trim()), null, httpOptions)
      .pipe(map(res => res));
  }

  getFavoriteCount() {
    let d = new Date();
    let requestId = d.toString();
    let favoriteObj = {
      requestId: requestId,
      user: this.configService.userId
    };
    return this.http
      .post(this.configService.getAppDomain + 'api/favorite/count', favoriteObj)
      .pipe(map(res => res));
  }

  getCiscoReadyUrl() {
    return this.http
      .get(
        this.configService.getAppDomain +
        'api/resource/' +
        this.configService.CISCO_READYEA_URL
      )
      .pipe(map(res => res));
  }

  getEaCallbackUrl() {
    return this.http
      .get(
        this.configService.getAppDomain +
        'api/resource/' +
        this.configService.EA_CALLBACK_URL
      )
      .pipe(map(res => res));
  }

  deleteSmartAccount(prospectKey, smartAccountId) {
    return this.http.delete(this.configService.getAppDomain + 'api/prospect/delete-smart-account/' + prospectKey + '/' + smartAccountId);
  }

  getSalesLevelFilter(nodeNames, level) {
    let reqObj = {};
    if (level === 1) {
      reqObj['level'] = level;
      // reqObj['user'] = this.configService.userId;
    } else {
      reqObj['level'] = level;
      // reqObj['user'] = this.configService.userId;
      reqObj['nodeNames'] = nodeNames;
    }

    return this.http
      .post(
        this.configService.getAppDomain + 'api/dashboard/salesLevelFilter',
        reqObj
      )
      .pipe(map(res => res));
  }

  getUrlToNavigate(customerStr) {
    /* Getting callbackUrl and ciscoReadyUrl  from two parallel  subscriptons and join them in forkJoin */
    let callbackUrl = this.getEaCallbackUrl();
    let ciscoReadyUrl = this.getCiscoReadyUrl();

    forkJoin([callbackUrl, ciscoReadyUrl]).subscribe((results: any) => {
      let callbackUrl = results[0].value;
      let ciscoReadyEaUrl = results[1].value;
      let callback = encodeURIComponent(callbackUrl);
      //  let customerName = encodeURIComponent(customer) ;
      /*generating url to navigate to  */
      let url = ciscoReadyEaUrl + customerStr;
      console.log('URL ::::   ' + url);
      this.document.location.href = url + ';callback=' + callback;
    });
  }
}
