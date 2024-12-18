
import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SearchLocateService } from './search-locate.service';
import { Observable } from 'rxjs';


import { IbSummaryService } from '../../ib-summary/ib-summary.service';
import { LocaleService } from '@app/shared/services/locale.service';

@Component({
  selector: 'app-search-locate',
  templateUrl: './search-locate.component.html',
  styleUrls: ['./search-locate.component.scss']
})
export class SearchLocateComponent implements OnInit {

  modelArr = [];
  searchData = [];
  installSite: any;
  contractNumber: any;
  salesOrder: any;
  serialNumber: any;
  searchSalesOrder: boolean;
  searchContract: boolean;
  searchInstall: boolean;
  searchSerial: boolean;
  searchSubscription: boolean;
  clearAllVar = false;
  validateTextRegEx = new RegExp('^\d+(\,\<\d+)*$');

  constructor(public localeService: LocaleService, private searchService: SearchLocateService,
    public activeModal: NgbActiveModal, private renderer: Renderer2,
    public ibSummaryService: IbSummaryService) { }

  ngOnInit() {
    this.salesOrder = '';
    this.installSite = '';
    console.log('sales order ngoninit :::  ' + this.salesOrder);
    this.searchSalesOrder = this.searchService.searchSalesOrder;
    this.searchContract = this.searchService.searchContract;
    this.searchInstall = this.searchService.searchInstall;
    this.searchSerial = this.searchService.searchSerial;
    this.searchSubscription = this.searchService.searchSubscription;

    // if (this.searchSalesOrder) {
    //   this.searchService.getSearchData().subscribe(data => {
    //     this.searchData = data;
    //   });
    // } else if (this.searchContract) {
    //   this.searchService.getSearchContractData().subscribe(data => {
    //     this.searchData = data;
    //   });
    // } else if (this.searchInstall) {
    //   this.searchService.getSearchInstallData().subscribe(data => {
    //     this.searchData = data;
    //   });
    // } else if (this.searchSerial) {
    //   this.searchService.getSearchSerialData().subscribe(data => {
    //     this.searchData = data;
    //   });
    // }
  }

  // search = (text$: Observable<string>) =>
  //   text$
  //     .debounceTime(200)
  //     .map(term => term === '' ? []
  //       : this.searchData.filter(v => v.value.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  // formatter = (x: { value: string }) => x.value;

  // selectedItem(c) {
  //   setTimeout(() => {
  //     this.installSite = '';
  //     this.contractNumber = '';
  //     this.salesOrder = '';
  //     this.serialNumber = '';
  //   });
  //   if (this.modelArr.length > 0) {
  //     let flag = false;
  //     for (let j = 0; j < this.modelArr.length; j++) {
  //       if (this.modelArr[j] === c.item.value) {
  //         flag = true;
  //       }
  //     }
  //     if (!flag) {
  //       this.modelArr.push(c.item.value);
  //     }
  //   } else {
  //     this.modelArr.push(c.item.value);
  //   }
  // }

  locate() {
    this.activeModal.close({
      locateData: this.modelArr
    });
  }

  clearAll() {
    this.modelArr = [];
    this.ibSummaryService.locateData = [];
    // this.clearAllVar = true;
  }

  cancel() {
    this.modelArr = [];
    // this.ibSummaryService.locateData = [];
    // if(this.clearAllVar){
    //   this.ibSummaryService.locateData = [];
    //   this.ibSummaryService.clearSearchAndLoadDefault();
    // }
    this.activeModal.dismiss('Cross click');
  }

  removeSelected(c) {
    for (let i = 0; i < this.modelArr.length; i++) {
      if (this.modelArr[i] === c) {
        this.modelArr.splice(i, 1);
      }
    }
  }

  // onKey(eve) {
  //   if (eve.keyCode === 188 || eve.keyCode >= 48 && eve.keyCode <= 57) {
  //     if (eve.key === ',') {
  //       if (this.salesOrder) {
  //         const arr = this.salesOrder.split(',');
  //         this.modelArr.push(arr[0]);
  //       } else if (this.installSite) {
  //         const arr = this.installSite.split(',');
  //         this.modelArr.push(arr[0]);
  //       } else if (this.contractNumber) {
  //         const arr = this.contractNumber.split(',');
  //         this.modelArr.push(arr[0]);
  //       } else if (this.serialNumber) {
  //         const arr = this.serialNumber.split(',');
  //         this.modelArr.push(arr[0]);
  //       }
  //       setTimeout(() => {
  //         this.installSite = '';
  //         this.contractNumber = '';
  //         this.salesOrder = '';
  //         this.serialNumber = '';
  //       });
  //     }
  //   } else {
  //     eve.preventDefault();
  //   }
  // }

  inputFocus() {
    if (this.searchSalesOrder) {
      const element = this.renderer.selectRootElement('#salesOrder');
      element.focus();
    } else if (this.searchInstall) {
      const element = this.renderer.selectRootElement('#installSite');
      element.focus();
    } else if (this.searchContract) {
      const element = this.renderer.selectRootElement('#contractNumber');
      element.focus();
    } else if (this.searchSerial) {
      const element = this.renderer.selectRootElement('#serialNumber');
      element.focus();
    }
    else if (this.searchSubscription) {
      const element = this.renderer.selectRootElement('#subscriptionNumber');
      element.focus();
    }
  }

  /* keyUp(c, v) {
   // if(this.ibSummaryService.searchColumnName === 'SALES_ORDER_NUMBER' || this.ibSummaryService.searchColumnName === 'CONTRACT_NUMBER')
    //{
      //  this.keyDown(c);
    //}
    const charCode = String.fromCharCode(c.which).toLowerCase();
    if (c.keyCode === 188 || c.keyCode >= 48 && c.keyCode <= 57 || c.key === 'Enter') {
      if (c.key === ','  || c.key === 'Enter') {
        if (v.length > 1 && v.charAt(0) !== ',') {
        const arr = v.split(',');
        this.modelArr.push(arr[0]);
        // this.modelArr = this.modelArr.concat(arr);
        setTimeout(() => {
          this.installSite = '';
          this.contractNumber = '';
          this.salesOrder = '';
          this.serialNumber = '';
        });
      } else {
        setTimeout(() => {
          this.installSite = '';
          this.contractNumber = '';
          this.salesOrder = '';
          this.serialNumber = '';
        });
      }
      }
    } else if (c.ctrlKey && charCode === 'v') {
      v = v.replace(/,\s*$/, '');
      const arr = v.split(',');
      if (arr.length > 1) {
        this.modelArr = this.modelArr.concat(arr);
        setTimeout(() => {
          this.installSite = '';
          this.contractNumber = '';
          this.salesOrder = '';
          this.serialNumber = '';
        });
      }
    }
  }*/


  keyUp(c, v) {
    const charCode = String.fromCharCode(c.which).toLowerCase();
    if (c.keyCode === 188 || c.keyCode >= 48 && c.keyCode <= 57 || c.keyCode >= 96 && c.keyCode <= 105 || c.key === 'Enter') {
      if (c.keyCode === 188 || c.key === 'Enter') {
        if (v.length > 0 && v.charAt(0) !== ',') {
          const arr = v.split(',');
          if (this.modelArr.length < 250) {
            this.modelArr.push(arr[0]);
            // this.modelArr = this.modelArr.concat(arr);
            setTimeout(() => {
              this.installSite = '';
              this.contractNumber = '';
              this.salesOrder = '';
              this.serialNumber = '';
            });
          } else {
            return;
          }
        } else {
          setTimeout(() => {
            this.installSite = '';
            this.contractNumber = '';
            this.salesOrder = '';
            this.serialNumber = '';
          });
        }

      }
    } else if (c.ctrlKey && charCode === 'v') {
      if (this.validateTextRegEx.test(v) === false) {
        v = '';
      }
      v = v.replace(/,\s*$/, '');
      const arr = v.split(',');
      if (arr.length > 1) {
        const defArr = this.modelArr.concat(arr);
        if (defArr.length >= 5) {
          this.modelArr = defArr.slice(0, 250);

        } else {
          this.modelArr = this.modelArr.concat(arr);
        }
        setTimeout(() => {
          this.installSite = '';
          this.contractNumber = '';
          this.salesOrder = '';
          this.serialNumber = '';
        });
      }
    }
  }

  /*keyDown(event) {
 // tslint:disable-next-line:max-line-length
   if (!(event.keyCode === 188 || event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode === 17 || event.keyCode === 86  || event.keyCode === 8 || event.keyCode === 13)) {
      event.preventDefault();
  }
}*/

  keyDown($event) {
    if (this.ibSummaryService.searchColumnName === 'SALES_ORDER_NUMBER' || this.ibSummaryService.searchColumnName === 'CONTRACT_NUMBER' ||
    this.ibSummaryService.searchColumnName === 'INSTALL_SITE') {
      if (!($event.keyCode === 188 || $event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.ctrlKey && $event.keyCode === 86 ||
        $event.keyCode === 8 || $event.keyCode === 13)) {
        event.preventDefault();
      }
    }
  }
}
