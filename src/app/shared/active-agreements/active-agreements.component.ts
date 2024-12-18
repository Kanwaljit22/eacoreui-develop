import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AllArchitectureViewService } from '@app/all-architecture-view/all-architecture-view.service';
import { MessageService } from '../services/message.service';
import { AppDataService } from '../services/app.data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-agreements',
  templateUrl: './active-agreements.component.html',
  styleUrls: ['./active-agreements.component.scss']
})
export class ActiveAgreementsComponent implements OnInit, OnChanges {
  public gridOptions: GridOptions;
  public showGrid: boolean;
  public gridApi;
  public columnDefs: any;
  rowData: any;
  @Input() activeAgreementData: any;
  @Input() public fromPage: any = 'agreementTab';
  @Input() public searchAgreement = '';
  displayGridView = false;
  virtualAccountId: any;
  selecteVirtualAccount: any;
  currentPage = 'agreements';
  agreementEmitter: Subscription;
  subscriptionId:any;

  constructor(public allArchitectureViewService: AllArchitectureViewService,
    public messageService: MessageService,
    public appDataService: AppDataService) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.headerHeight = 30;
  }

  ngOnInit() {

    this.agreementEmitter = this.appDataService.agreementDataEmitter.subscribe((smartAccountobj) => {
      this.currentPage = 'agreements';
    });

    if (this.allArchitectureViewService.viewConsumption) {
      if (this.allArchitectureViewService.selectedVirtualAccount !== undefined) {
        this.currentPage = 'consumption';
        this.selecteVirtualAccount = this.allArchitectureViewService.selectedVirtualAccount;
        this.virtualAccountId = this.allArchitectureViewService.selectedVirtualAccount.id;
        this.subscriptionId = this.allArchitectureViewService.selectedVirtualAccount.subscriptionID;
        this.allArchitectureViewService.viewConsumption = false;
      }
    }

  }

  toggleView() {
    this.displayGridView = !this.displayGridView;
  }

  ngOnChanges(changes: SimpleChanges) {
    // if(  changes['activeAgreementData'] && changes['activeAgreementData'].previousValue !== changes['activeAgreementData'].currentValue && this.activeAgreementData.data.accounts ){
    //   this.getTableData();
    // }

    // if(  changes['searchAgreement'] && changes['searchAgreement'].previousValue !== changes['searchAgreement'].currentValue){
    //   this.onFilterTextBoxChanged();
    // }

    if (changes['fromPage'] && changes['fromPage'].currentValue === 'accountHealth') {
      this.displayGridView = false;
      this.currentPage = 'agreements';
    }

    if (changes['fromPage'] && changes['fromPage'].currentValue === 'agreementTab') {
      this.displayGridView = false;
    }

  }

  gotoConsumption(item: any) {
    this.virtualAccountId = item.id;
    this.subscriptionId = item.subscriptionID;
    this.selecteVirtualAccount = item;
    this.currentPage = 'consumption';
    if (this.fromPage === 'accountHealth') {
      this.allArchitectureViewService.viewTabEmitter.emit('agreements');
      this.currentPage = 'consumption';
      this.displayGridView = false;
    }
  }

  onCellClicked($event) {
    if ($event.colDef.field === 'architecture') {
      this.selecteVirtualAccount = $event.data;
      this.currentPage = 'consumption';
    }
  }

  backtoAgreements() {
    this.currentPage = 'agreements';
    this.displayGridView = false;
  }

  onFilterTextBoxChanged() {
    // console.log(this.searchProposalBy)
    if (this.gridOptions.api) {
      this.gridOptions.api.setQuickFilter(this.searchAgreement);
    }
  }

  getTableData() {
    if (this.activeAgreementData.data && this.activeAgreementData.data.accounts) {
      this.rowData = this.activeAgreementData.data.accounts;
    }
    if (this.gridOptions.api && this.rowData) {
      this.gridOptions.api.setRowData(this.rowData);
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  onGridReady(event) {
    this.getAgreementColumnsData();
  }

  getAgreementColumnsData() {
    this.allArchitectureViewService.getColDataAgreements().subscribe((res: any) => {
      if (res.data) {
        this.columnDefs = res.data;
        for (let i = 0; i < this.columnDefs.length; i++) {
          const column = this.columnDefs[i];
          if (column['field'] === 'name') {
            column.cellRenderer = this.getArchName.bind(this);
          }
        }
      }
    });
  }

  getArchName(params) {

    let icon = `<span class="icon-DNA-new architecture--icon" ><span class="path1"></span><span class="path2"></span><span
    class="path3"></span><span class="path4"></span><span class="path5"></span><span
    class="path6"></span><span class="path7"></span></span>`;

    if (params.data.architecture.toLowerCase().search('dna') > -1) {
      icon = ` <span class="icon-DNA-new architecture--icon" ><span class="path1"></span><span class="path2"></span><span
      class="path3"></span><span class="path4"></span><span class="path5"></span><span
      class="path6"></span><span class="path7"></span></span>` ;
    } else if (params.data.architecture.toLowerCase().search('data') > -1) {
      icon = `  <span class="icon-data-center-new architecture--icon"  ><span class="path1"></span><span
      class="path2"></span><span class="path3"></span><span class="path4"></span><span
      class="path5"></span><span class="path6"></span><span class="path7"></span><span
      class="path8"></span></span>` ;
    } else if (params.data.architecture.toLowerCase().search('security') > -1) {
      icon = `<span class="icon-security-new architecture--icon" ><span class="path1"></span><span class="path2"></span><span
      class="path3"></span></span>` ;
    } else if (params.data.architecture.toLowerCase().search('cross') > -1) {
      icon = `<span class="icon-white-cross-arch architecture--icon"  >
              <span class="path1"></span><span class="path2"></span><span class="path3"></span></span>` ;
    } else {
      icon = `<span class="icon-white-cross-arch architecture--icon" >
              <span class="path1"></span><span class="path2"></span><span class="path3"></span></span>`;
    }

    const linkHTML = `<span class="text-link" style='text-transform:Capitalize'> ${params.value} </span>`;
    return icon + linkHTML;
  }

  getDotsTimeline(start: any, end: any, nextM: any) {

    const numberOfDots = parseInt(end.split(' ')[2]) - parseInt(start.split(' ')[2]);
    const darkdots = parseInt(nextM.split(' ')[2]) - parseInt(start.split(' ')[2]) - 1;
    const lightdots = numberOfDots - darkdots;
    let html = '';

    if (darkdots > 0) {
      for (let i = 1; i <= darkdots; i++) {
        html = html + '<span class="dots dark-grey"></span>';
      }
    }

    if (lightdots > 0) {
      for (let i = 1; i <= lightdots; i++) {
        html = html + '<span class="dots light-grey"></span>';
      }
    }
    return html;
  }

  gotoConsumptionfromAccountHealth(item) {
    this.allArchitectureViewService.viewConsumption = true;
    this.allArchitectureViewService.selectedVirtualAccount = item;
    this.subscriptionId = item.subscriptionID;
    this.allArchitectureViewService.viewTabEmitter.emit('agreements');
  }


}
