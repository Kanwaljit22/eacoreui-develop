import { Component, OnInit, Renderer2, Input, ElementRef, ViewChild } from '@angular/core';
import { SalesConnectService } from './sales-connect.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { FileSizePipe } from '@app/shared/pipes/file-size.pipe';
import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';



@Component({
  selector: 'app-sales-connect',
  templateUrl: './sales-connect.component.html',
  styleUrls: ['./sales-connect.component.scss']
})
export class SalesConnectComponent implements OnInit {

  recommendContent = false;
  salesData: any;
  ratingData: any;
  showProposalDetail: boolean;
  filterOptions = [{ 'val': 'Suite', 'selected': false }, { 'val': 'UCSME-4308-RF', 'selected': false },
  { 'val': 'UCS-SPM-MINI-RF', 'selected': false }, { 'val': 'C9300-24-E-A', 'selected': false }];
  filterSelected = [];
  allChecked = false;
  selectedDocument: any;
  showCopy = false;

  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;
  @ViewChild('userinput', { static: false }) private userinput: ElementRef;

  constructor(private salesService: SalesConnectService, private renderer: Renderer2, public constantsService: ConstantsService,
    public config: NgbRatingConfig, public appDataService: AppDataService, public blockUiService: BlockUiService) { }

  ngOnInit() {

    // customize default values of ratings used by this component tree
    this.config.max = 5;
    this.config.readonly = true;
    this.config.readonly = true;

    // this.rating.rate = 3.5;
    // this.rating.max = 5;
    // this.rating.readonly = true;
    // this.getData();

    let redirectUri = window.location.origin + '/index.html';

  }

  shareDocuments() {

    this.showCopy = !this.showCopy;
  }

  getData() {
    this.salesService.getSalesData().subscribe((response: any) => {
      this.salesData = response;
    });
  }

  showRecommends() {
    this.recommendContent = true;
    this.blockUiService.spinnerConfig.customBlocker = false;

    //  this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.salesConnect;
    this.renderer.addClass(document.body, 'sales-overlay');
    this.getSalesConnectData();
  }

  closeRecommends() {

    this.blockUiService.spinnerConfig.customBlocker = true;

    // this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep;
    this.recommendContent = false;
    this.renderer.removeClass(document.body, 'sales-overlay');
  }


  getSalesConnectData() {

    const data = {
      'suiteIds': [],
      'certified': [],
      'accessLevel': [],
      'contentSubCategory': [],
      'contentTraceIds': this.appDataService.contentTraceID
    };
    const searchRequestJson = {
      'source': 'EAMP',
      'data': data
    };

    this.salesService.getSalesConnectSearchData(searchRequestJson).subscribe((response: any) => {
      this.salesData = response.data;
    });
  }


  selectedFilter(event, value) {
    if (value.selected) {
      this.filterSelected.push(value);
    } else {
      for (let i = 0; i < this.filterSelected.length; i++) {
        if (value.val === this.filterSelected[i].val) {
          this.filterSelected.splice(i, 1);
        }
      }
    }
    this.allChecked = this.filterOptions.every(function (item: any) {
      return item.selected === true;
    });
  }

  deleteSelection(a) {
    for (let i = 0; i < this.filterSelected.length; i++) {
      if (a.val === this.filterSelected[i].val) {
        this.filterSelected.splice(i, 1);
      }
    }
    for (let j = 0; j < this.filterOptions.length; j++) {
      if (this.filterOptions[j].val === a.val) {
        this.filterOptions[j].selected = false;
      }
    }
    this.allChecked = this.filterOptions.every(function (item: any) {
      return item.selected === true;
    });
  }

  clearSelection() {
    this.filterSelected = [];
    this.allChecked = false;
    for (let j = 0; j < this.filterOptions.length; j++) {
      this.filterOptions[j].selected = false;
    }
  }

  selectAll(event) {
    for (let j = 0; j < this.filterOptions.length; j++) {
      if (event.target.checked) {
        this.filterOptions[j].selected = true;
        this.filterSelected = this.filterOptions.filter(
          filterData => filterData.selected === true);
      } else {
        this.filterOptions[j].selected = false;
        this.filterSelected = [];
      }
    }
  }

  showDocumentDetail(document) {

    this.salesService.getRatingComment().subscribe((response: any) => {
      this.ratingData = response;
    });
    this.showProposalDetail = true;
    this.selectedDocument = document;

  }

  showSaleshubDetail(url) {
    window.open(url);
  }

  getFileTypeClass(fileType) {

    let fileClass = '';

    if (fileType === ConstantsService.PPT) {
      fileClass = ConstantsService.ICON_PPT;
    } else if (fileType === ConstantsService.PDF) {
      fileClass = ConstantsService.ICON_PDF;
    } else if (fileType === ConstantsService.DOC) {
      fileClass = ConstantsService.ICON_DOC;
    } else if (fileType === ConstantsService.XLS) {
      fileClass = ConstantsService.ICON_XLS;
    }
    return fileClass;
  }

  copy(inputElement) {

    this.userinput.nativeElement.select();
    document.execCommand('copy');
    this.userinput.nativeElement.setSelectionRange(0, 0);
    this.showCopy = false;
  }

  accessLevel(arrAccessLevel) {

    arrAccessLevel = arrAccessLevel.fil(access => !access.includes('Partner'));

    arrAccessLevel.push
    //  for (var access of arrAccessLevel) {

    //   if (access.includes('Partner')) {


    //   }

    //  }
  }

  downloadDocuments(url) {
    window.open(url);
  }

  close(event) {
    this.showCopy = false;
  }

}
