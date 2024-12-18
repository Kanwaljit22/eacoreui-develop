import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import {
  Router,
  RouterModule,
  ActivatedRoute,
  Params,
  NavigationEnd
} from '@angular/router';
import { IbSummaryService } from './ib-summary.service';

import {
  NgbPaginationConfig,
  NgbModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../shared/services/utilities.service';
import { HeaderService } from '../header/header.service';
import { AppDataService, SessionData } from '../shared/services/app.data.service';
import { ProspectDetailsService } from '../prospect-details/prospect-details.service';
import { ProductSummaryService } from '../dashboard/product-summary/product-summary.service';
import { SearchLocateService } from '../modal/search-locate/search-locate.service';
import { SearchLocateComponent } from '../modal/search-locate/search-locate.component';
import { MessageService } from '../shared/services/message.service';
import {
  SubHeaderData,
  SubHeaderComponent
} from '../shared/sub-header/sub-header.component';
import { BreadcrumbsService } from '../../app/core';
import { CopyLinkService } from '../shared/copy-link/copy-link.service';
import { LocaleService } from '@app/shared/services/locale.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';

@Component({
  selector: 'app-ib-summary',
  templateUrl: './ib-summary.component.html',
  styleUrls: ['./ib-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IbSummaryComponent implements OnInit, OnDestroy {
  archName: string;
  customername: string;
  summaryData = [];
  customerId: number;
  summaryHeader: any = [];
  columnHeaderList: any = [];
  summaryHeaderList = new Map<string, string>();
  displayName: string;
  summaryJSON;

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  contractInside = [];
  resultFoundInside: number;
  contractOutside = [];

  noMatch = [];
  showResults = false;
  subHeaderData: SubHeaderData;
  navigationSubscription;
  readonly toStartQualNew = true;

  // tslint:disable-next-line:max-line-length
  constructor(public localeService: LocaleService,
    public ibSummaryService: IbSummaryService,
    private utilitiesService: UtilitiesService,
    private _router: Router,
    public headerService: HeaderService,
    private route: ActivatedRoute,
    public appDataService: AppDataService,
    private prospectDetailsService: ProspectDetailsService,
    public productSummaryService: ProductSummaryService,
    private messageService: MessageService,
    private modalVar: NgbModal,
    public searchLocateService: SearchLocateService,
    private breadcrumbsService: BreadcrumbsService,
    private copyLinkService: CopyLinkService,
    public constantsService: ConstantsService,
    public blockUiService: BlockUiService
  ) {
    this._router.onSameUrlNavigation = 'reload';
    this.route.params.forEach((params: Params) => {
      const sessionObj: SessionData = this.appDataService.getSessionObject();
      // on page refresh, set the customer id from session obj
      if (!this.appDataService.customerID) {
        this.appDataService.customerID = sessionObj.customerId;
      }
      this.appDataService.archName = params['architecture'];
      this.appDataService.customerName = decodeURIComponent(params['customername']);
      if (sessionObj.isFavoriteUpdated) {
        if (+params['favorite'] === 0) {
          this.appDataService.isFavorite = 1;
        } else {
          this.appDataService.isFavorite = 0;
        }
      } else {
        this.appDataService.isFavorite = +params['favorite'];
      }
    });
    this.summaryJSON = {
      customerName: this.appDataService.customerName,
      archName: this.appDataService.archName
      // user: this.appDataService.userId
    };

    this.appDataService.headerDataEmitter.subscribe(
      (headerDetailMap: Map<string, any>) => {
        headerDetailMap.forEach((value: any, key: string) => {
          // console.log(key, value);
          if (key === 'CUSTOMER_ID') {
            this.customerId = value;
            this.appDataService.customerID = value;
          } else if (key === 'displayName') {
            this.displayName = value;
          } else {
            this.summaryData.push(value);
          }
        });
        this.appDataService.subHeaderData.custName = this.appDataService.customerName;
        this.appDataService.subHeaderData.favFlag = true;
        this.appDataService.subHeaderData.subHeaderVal = this.summaryData;
        this.appDataService.subHeaderData.moduleName =
          SubHeaderComponent.IB_SUMMARY;
      }
    );
    this.breadcrumbsService.showOrHideBreadCrumbs(true);

    // this.navigationSubscription = this._router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     // this.ngOnInit();
    //   }
    // });
  }

  ngOnInit() {
    // this.productSummaryService.prospectInfoObject.architecture = this.constantsService.SECURITY;
    if (this.appDataService.archName) {
      this.productSummaryService.prospectInfoObject.architecture = this.appDataService.archName;
    }

    if (this.appDataService.archName === this.constantsService.SECURITY) {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.bookingSummarySalesOrder;
    } else {
      this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.iBSummarySalesOrder;
    }
    if (!this.appDataService.userInfo.firstName) {
      this.appDataService.getUserDetailsFromSession();
    }
    this.getHeaderDetails(this.summaryJSON);
    this.ibSummaryService.ibSummaryDataEmitter.subscribe(
      data => {
        if (this.ibSummaryService.searchAndLocate.length > 0) {
          this.ibSummaryService.showInside = true;
          this.resultFoundInside = data.length;
          this.ibSummaryService.searchAndLocateDataEmitter.emit(data);
        }
        // this.ibSummaryService.blockUI = false;
        // this.blockUiService.spinnerConfig.unBlockUI();
        // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      },
      error => {
        console.error(error.ERROR_MESSAGE);
        this.messageService.displayUiTechnicalError(error);
      }
    );
  }

  ngOnDestroy() {
    this.headerService.exitFullScreenView();
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.isFavoriteUpdated = false;
    this.appDataService.setSessionObject(sessionObj);
  }

  getHeaderDetails(summaryJSON) {
    this.blockUiService.spinnerConfig.startChain();
    this.blockUiService.spinnerConfig.blockUI();
    this.appDataService.getHeaderData(summaryJSON);
  }

  getSummaryViewData(summaryJSON) {
    this.prospectDetailsService
      .getSummaryViewData(summaryJSON)
      .subscribe((data: any) => {
        this.summaryData = data.data[0].column;
        for (let i = 0; i < this.summaryData.length; i++) {
          if (this.summaryData[i].name) {
            this.summaryHeaderList.set(
              this.summaryData[i].name,
              this.summaryData[i].value
            );
          }
          if (this.summaryData[i].name === 'CUSTOMER_ID') {
            this.customerId = this.summaryData[i].value;
          }
        }
        this.columnHeaderList.forEach(element => {
          if (
            this.summaryHeaderList.has(element.name) &&
            element.name !== 'CUSTOMER_ID'
          ) {
            this.summaryHeader.push({
              name: element.value,
              value: this.summaryHeaderList.get(element.name)
            });
          }
        });
      });
  }

  openProductSummaryPage() {
    this._router.navigate(['dashboard']);
  }

  openSearchLocate() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    const methodName = this.ibSummaryService.methodNameForSearchAndLocate;
    ngbModalOptionsLocal.windowClass = 'searchLocate-modal';
    this.searchLocateService.searchSalesOrder = false;
    this.searchLocateService.searchContract = true;
    this.searchLocateService.searchInstall = false;
    this.searchLocateService.searchSerial = false;
    if (methodName === IbSummaryService.SALES_ORDER) {
      this.ibSummaryService.popupTextboxLabel = 'SALES ORDER NUMBER';
      this.ibSummaryService.searchColumnName = 'SALES_ORDER_NUMBER';
    } else if (methodName === IbSummaryService.CONTRACT_NUMBER) {
      this.ibSummaryService.popupTextboxLabel = 'CONTRACT NUMBER';
      this.ibSummaryService.searchColumnName = 'CONTRACT_NUMBER';
    } else if (methodName === IbSummaryService.INSTALL_SITE) {
      this.ibSummaryService.popupTextboxLabel = 'INSTALL SITE';
      this.ibSummaryService.searchColumnName = 'INSTALL_SITE';
    } else if (methodName === IbSummaryService.SERIAL_NUMBER) {
      this.ibSummaryService.popupTextboxLabel = 'SERIAL NUMBER';
      this.ibSummaryService.searchColumnName = 'SERIAL_NUMBER';
    }
    else if (methodName === IbSummaryService.SUBSCRIPTION_NUMBER) {
      this.ibSummaryService.popupTextboxLabel = 'SUBSCRIPTION REFERENCE ID';
      this.ibSummaryService.searchColumnName = 'SUBSCRIPTION_NUMBER';
    }

    const modalRef = this.modalVar.open(
      SearchLocateComponent,
      ngbModalOptionsLocal
    );
    modalRef.componentInstance.modelArr = this.ibSummaryService.locateData;
    modalRef.result.then(result => {
      /*Delete duplicate values entered by the user */
      const uniqueItems = Array.from(new Set(result.locateData));
      this.ibSummaryService.locateData = uniqueItems;
      this.ibSummaryService.searchAndLocate = result.locateData;
      try {
        this.ibSummaryService.loadIbSummaryData(
          methodName,
          this.ibSummaryService.locateData
        );
      } catch (error) {
        console.error(error.ERROR_MESSAGE);
        this.messageService.displayUiTechnicalError(error);
      }
    });
  }

  showOutsideResults() {
    this.ibSummaryService.showInside = false;
    this.ibSummaryService.searchAndLocateDataEmitter.emit(
      this.ibSummaryService.nonCustomerSearchResult
    );
  }

  showInsideResults() {
    this.ibSummaryService.showInside = true;
    this.ibSummaryService.searchAndLocateDataEmitter.emit(
      this.ibSummaryService.customerSearchResult
    );
  }

  closeSearch() {
    this.showResults = false;
    this.ibSummaryService.isSearchAndLocate = false;
    this.ibSummaryService.locateData = [];
    try {
      this.ibSummaryService.loadIbSummaryData(
        this.ibSummaryService.methodNameForSearchAndLocate,
        null
      );
    } catch (error) {
      console.error(error.ERROR_MESSAGE);
      this.messageService.displayUiTechnicalError(error);
    }
  }

  startQualification(toNewQual) {
    const sessionObj: SessionData = this.appDataService.getSessionObject();
    sessionObj.customerId = this.appDataService.customerID;
    this.appDataService.setSessionObject(sessionObj);
    const customerName = encodeURIComponent(this.appDataService.customerName);
    if (toNewQual) {
      this._router.navigate(['/qualifications'
        , {
          architecture: this.productSummaryService.prospectInfoObject.architecture
          , customername: customerName
          , customerId: this.appDataService.customerID
        }
      ]);
    } else {
      this.appDataService
        .redirectForCreateQualification()
        .subscribe((response: any) => {
          const customerStr = ';GUName=' + customerName + ';hierlvl=GU';
          this.productSummaryService.getUrlToNavigate(customerStr);
        });
    }
  }

  goToProspect() {
    this._router.navigate([
      '/prospect-details',
      {
        architecture: this.appDataService.archName,
        customername: encodeURIComponent(this.appDataService.customerName),
        favorite: this.appDataService.isFavorite
      }
    ]);
  }
  // --------- The below method is optimized for validating response from  API call ---------
  // requestIba() {
  //   const recepientsCecId = this.appDataService.userId + '@cisco.com';
  //   const customerName = encodeURIComponent(this.appDataService.customerName);
  //   const ibaRquestObj = {
  //    // userId: this.appDataService.userId,
  //     recepientsCecId: recepientsCecId,
  //     archName: this.appDataService.archName,
  //     customerId: this.appDataService.customerID,
  //     customerGuName: this.appDataService.customerName
  //   };

  //   this.ibSummaryService
  //     .sendIbaReport(ibaRquestObj)
  //     .subscribe((response: any) => {
  //       if (response && !response.error) {
  //         try {
  //           this.googleAnalyticsEventsService.emitEvent('IbSummary',
  //              'Request IBA icon clicked', 'IBA document for the particular customer is requested', 10);
  //           if(this.appDataService.archName === this.constantsService.SECURITY){
  //             this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('bookingsummary.REQUEST_IBA'));
  //           } else {
  //             this.copyLinkService.showMessage(this.constantsService.IB_SUMM_ASSESSMENT_REPORT);
  //           }
  //         } catch (error) {
  //           console.error(error.ERROR_MESSAGE);
  //           this.messageService.displayUiTechnicalError(error);
  //         }
  //       } else {
  //         this.messageService.displayMessagesFromResponse(response);
  //       }
  //     });
  // }
  requestIba() {
    const recepientsCecId = this.appDataService.userId + '@cisco.com';
    const customerName = encodeURIComponent(this.appDataService.customerName);
    const ibaRquestObj = {
      // userId: this.appDataService.userId,
      recepientsCecId: recepientsCecId,
      archName: this.appDataService.archName,
      customerId: this.appDataService.customerID,
      customerGuName: this.appDataService.customerName
    };

    this.ibSummaryService
      .sendIbaReport(ibaRquestObj)
      .subscribe((response: any) => {
        const responseObject = this.appDataService.validateResponse(response);
        if (this.appDataService.archName === this.constantsService.SECURITY) {
          this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('bookingsummary.REQUEST_IBA'));
        } else {
          this.copyLinkService.showMessage(this.constantsService.IB_SUMM_ASSESSMENT_REPORT);
        }


      });
  }
  tableheight() {
    setTimeout(() => {
      this.utilitiesService.setTableHeight();
    }, 0);
  }
}
