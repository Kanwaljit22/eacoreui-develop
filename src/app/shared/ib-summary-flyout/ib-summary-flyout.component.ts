import { AppDataService } from '@app/shared/services/app.data.service';
import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { AccountHealthInsighService } from '../account-health-insight/account.health.insight.service';
import { IbSummaryService } from '@app/ib-summary/ib-summary.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { MessageService } from '../services/message.service';
import { SearchLocateComponent } from '@app/modal/search-locate/search-locate.component';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchLocateService } from '@app/modal/search-locate/search-locate.service';

@Component({
  selector: 'app-ib-summary-flyout',
  templateUrl: './ib-summary-flyout.component.html',
  styleUrls: ['./ib-summary-flyout.component.scss']
})
export class IbSummaryFlyoutComponent implements OnInit, OnDestroy {

  @Input() ibSummaryView: boolean;
  @Input() selectedNav: string;

  title: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  shownoresult = false;
  constructor(public accountHealthInsightService: AccountHealthInsighService, public renderer: Renderer2,
    public appDataService: AppDataService, private ibSummaryService: IbSummaryService,
     private copyLinkService: CopyLinkService,
    public localeService: LocaleService, public constantsService: ConstantsService, private messageService: MessageService,
    public searchLocateService: SearchLocateService, private modalVar: NgbModal) { }

  ngOnInit() {
    this.getTitle();
    // subscribe emitter for search and locate
    this.ibSummaryService.ibSummaryDataEmitter.subscribe(
      data => {
        if (this.ibSummaryService.searchAndLocate.length > 0) {
          this.ibSummaryService.showInside = true;
          // this.resultFoundInside = data.length;
          this.ibSummaryService.searchAndLocateDataEmitter.emit(data);
        }
      },
      error => {
        console.error(error.ERROR_MESSAGE);
        this.messageService.displayUiTechnicalError(error);
      }
    );
    this.appDataService.pageContext = 'ib-summary-flyout';
  }

  ngOnDestroy() {
    this.accountHealthInsightService.showIbSummaryFlyout = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }

  getTitle() {
    if (this.selectedNav === 'salesOrders') {
      this.title = 'by Sales Orders';
    } else if (this.selectedNav === 'contractNumbers') {
      this.title = 'by Contracts';
    } else if (this.selectedNav === 'installSites') {
      this.title = 'by Location';
    } else if (this.selectedNav === 'serialNumber') {
      this.title = '';
    }
    else if (this.selectedNav === 'subscription') {
      this.title = '';
    }
  }

  // method to call request IBA
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
        if (response && !response.error) {
          try {
            if (this.appDataService.archName === this.constantsService.SECURITY) {
              this.copyLinkService.showMessage(this.localeService.getLocalizedMessage('bookingsummary.REQUEST_IBA'));
            } else {
              this.copyLinkService.showMessage(this.constantsService.IB_SUMM_ASSESSMENT_REPORT);
            }
          } catch (error) {
            console.error(error.ERROR_MESSAGE);
            this.messageService.displayUiTechnicalError(error);
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      });
  }

  // method to open search data
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
      let uniqueItems = Array.from(new Set(result.locateData));
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
    // this.showResults = false;
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

  changeNavSelection(nav) {
    this.selectedNav = nav;
    this.getTitle();
  }

  changeProspectSelection(val) {
    this.selectedNav = val;
  }

  close() {
    this.accountHealthInsightService.showIbSummaryFlyout = false;
  }

}
