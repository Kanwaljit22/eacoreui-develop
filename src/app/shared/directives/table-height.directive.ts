import { Directive, ElementRef, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';

@Directive({
  selector: '[appTableHeight]'
})
export class TableHeightDirective implements OnInit, OnChanges {

  @Input() fullScreen: string;

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit() {
    this.setTableHeight();
  }

  ngOnChanges() {
    const thisInstance = this;
    setTimeout(function () {
      thisInstance.setTableHeight();
    });
  }

  setTableHeight() {
    const element = document.getElementById('ag-grid');
    const winHeight = window.innerHeight;
    let header = 0;
    if (this.appDataService.flow !== 'nextgen' && !this.appDataService.isPatnerLedFlow && document.getElementById('header')) {
      header = document.getElementById('header').offsetHeight;
    }
    const breadcrumb = document.getElementById('breadcrumbWrapper');
    const breadcrumbHeight = breadcrumb ? breadcrumb.offsetHeight : 0;
    const subheader = document.getElementById('subHeaderWrap');
    const subheaderHeight = subheader ? subheader.offsetHeight : 0;
    const actions = document.getElementById('actions-container');
    const actionsHeight = actions ? actions.offsetHeight : 0;
    const pageContent = document.getElementById('page-header');
    const pageContentHeight = pageContent ? pageContent.offsetHeight : 0;
    const pageContentFilter = document.getElementById('filter-area');
    const pageContentFilterHeight = pageContentFilter ? pageContentFilter.offsetHeight : 0;
    const pagination = 40;
    const margin = 2;
    // tslint:disable-next-line:max-line-length
    const tableHeight = winHeight - (header + breadcrumbHeight + subheaderHeight + actionsHeight + pageContentHeight + pageContentFilterHeight + pagination + margin);
    element.style.height = tableHeight + 'px';

    // console.log(header,breadcrumbHeight,subheaderHeight,actionsHeight,pageContentHeight,pageContentFilterHeight,pagination,margin);
    // console.log('winHeight ' + winHeight);
    // console.log('header ' + header);
    // console.log('breadcrumbHeight ' + breadcrumbHeight);
    // console.log('pageContentHeight ' + pageContentHeight);
    // console.log('pagination ' + pagination);
    // console.log('tableHeight ' + tableHeight);
  }

}
