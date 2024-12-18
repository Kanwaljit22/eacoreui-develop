import { Injectable, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { IbSummaryService } from '../../ib-summary/ib-summary.service';
import { BehaviorSubject ,  Subject ,  Observable } from 'rxjs';
import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from './block.ui.service';
import { MessageService } from './message.service';
import { LocaleService } from './locale.service';
import { MessageType } from './message';
import { ConstantsService } from './constants.service';

declare var $: any;

@Injectable()
export class UtilitiesService {

  proposalFlow = false;
  fixRoadMap = false;
  adminSection = false;
  paginationEmitter = new EventEmitter();
  heightChanged: EventEmitter<any> = new EventEmitter<any>();
  constructor(private currencyPipe: CurrencyPipe, private appDataService: AppDataService, public messageService: MessageService,
    public localeService: LocaleService, public constantsService: ConstantsService,
  ) { }

  ASC_ORDER_SORT = 'asc';
  DESC_ORDER_SORT = 'desc';

  columnDataTypeMap = new Map<String, String>();

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  private subject = new Subject<any>();
  private subjectNew = new Subject<any>();

  sendMessage(message: any) {
    this.subject.next(message);
  }

  sendNav(nav) {
    this.subjectNew.next(nav);
  }

  clearMessage() {
    this.subject.next(true);
  }

  moveTo(): Observable<any> {
    return this.subjectNew.asObservable();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  //    checkIfBothArrayEqual(a, b) {

  //     return _.isEmpty(_.xor(a,b))
  // }

  // mehtod to check integer or decimal and format to 2 decimal point
  checkDecimalOrIntegerValue(number) {
    if (number == Math.floor(number)) {
      return number;
    } else {
      return this.formatValue(this.getFloatValue(number));
    }
  }

  formatValue(value) {
    let val = '';
    if (value === 0 || value) {
      val = this.currencyPipe.transform(value, 'USD', 'symbol');
      val = val.replace(/\$/gi, ''); /*Remove $ from formatted text */
      /* if(val.length > 3){
         val  = val.slice(0,val.length-3);
       }*/
      return val;
    }
  }

  pretifyAndFormatNumber(value) {
    const thousand = 1000;
    const million = 1000000;
    const billion = 1000000000;
    const trillion = 1000000000000;
    let sign = 1;
    let val: number;
    if (!value) {
      return 0;
    }
    // to check if value is -ve; convert it to +ve and after calculation add sign
    if (value < 0) {
      value = -1 * value;
      sign = -1;
    }
    if (value < thousand) {
      return this.formatWithNoDecimal(value);
    }

    if (value >= thousand && value <= 1000000) {
      return this.formatWithNoDecimal(value);
    }

    if (value >= million && value <= billion) {
      val = sign * (value / million);
      return this.checkDecimalValue(val) + 'M';
    }

    if (value >= billion && value <= trillion) {
      val = sign * (value / billion);
      return this.checkDecimalValue(val) + 'B';
    } else {
      val = sign * (value / trillion);
      return val + 'T';
    }
  }


  private checkDecimalValue(value) {
    value = value.toFixed(2);
    const decimalValue = value - Math.floor(value);
    if (decimalValue !== 0.00) {
      return value;
    } else {
      return Math.floor(value);
    }
  }


  formatWithNoDecimal(value) {
    let val: any;
    if (value) {
      val = this.currencyPipe.transform(value, 'USD', 'symbol');
      val = val.replace(/\$/gi, '');/*Remove $ from formatted text */
      // Removes decimal values <.10 but issue of appending 4th digitafter comma
      //val = val.replace(/(\.[0-9]*?)0+/g, ""); 
      //Removes .00 in decimal places and keeps <.10 values
      val = val.replace(/\.(.*?[0]{2})/g, "");
      return val;
    }
  }

  formatWithNoDecimalForDashboard(value) {
    let val: any;
    if (value) {
      value = parseInt(value, 10);
      val = this.currencyPipe.transform(value, 'USD', 'symbol');
      val = val.replace(/\$/gi, '');/*Remove $ from formatted text */
      // Removes decimal values <.10 but issue of appending 4th digitafter comma
      //val = val.replace(/(\.[0-9]*?)0+/g, ""); 
      //Removes .00 in decimal places and keeps <.10 values
      val = val.replace(/\.(.*?[0]{2})/g, "");
      if (val === undefined)
        val = 0;
      return val;
    }
    if (value === 0) {
      return 0;
    }
  }

  round(value) {
    if (value && (0 < (+value) || 0 > (+value))) {
      return Math.round(value);
    } else {
      return 0;
    }
  }

  removeDecimal(value) {
    if (value) {
      const valueArr = value.split('.');
      value = valueArr[0];
      value = (value + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return value;
  }

  dollarvalue(value) {
    return this.currencyPipe.transform(value, 'USD', 'symbol');
  }

  setTableHeight() {
    const element = document.getElementById('ag-grid');
    const winHeight = window.innerHeight;
    let header = 0;
    if (this.appDataService.flow !== 'nextgen' && !this.appDataService.isPatnerLedFlow) {
      if (document.getElementById('header')) {
        header = document.getElementById('header').offsetHeight;
      }

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
    const pagination = 54;
    const margin = 2;
    let tableHeight;
    // tslint:disable-next-line:max-line-length
    if (this.appDataService.pageContext === 'ib-summary-flyout') {
      tableHeight = winHeight - (header + subheaderHeight + actionsHeight + pageContentHeight + pageContentFilterHeight + 40 + margin);
    } else {
      tableHeight = winHeight - (header + breadcrumbHeight + subheaderHeight + actionsHeight + pageContentHeight + pageContentFilterHeight + pagination + margin);
    }
    if (element) {
      element.style.height = tableHeight + 'px';
    }
    // console.log(header,breadcrumbHeight,subheaderHeight,actionsHeight,pageContentHeight,pageContentFilterHeight,pagination,margin);
    // console.log('winHeight ' + winHeight);
    // console.log('header ' + header);
    // console.log('breadcrumbHeight ' + breadcrumbHeight);
    // console.log('pageContentHeight ' + pageContentHeight);
    // console.log('pagination ' + pagination);
    // console.log('tableHeight ' + tableHeight);
  }

  creditTableHeight() {
    const element = document.getElementById('ag-grid-credit');
    const winHeight = window.innerHeight;
    let header = 0;
    header = document.getElementById('heading').offsetHeight;
    const subheader = document.getElementById('subHeaderWrap-credit');
    const subheaderHeight = subheader ? subheader.offsetHeight : 0;
    const actions = document.getElementById('actions-container-credit');
    const actionsHeight = actions ? actions.offsetHeight : 0;
    const searchContent = document.getElementById('search-Content');
    const searchContentHeight = searchContent ? searchContent.offsetHeight : 0;
    const pageContentFilter = document.getElementById('filter-area-credit');
    const pageContentFilterHeight = pageContentFilter ? pageContentFilter.offsetHeight : 0;
    const pagination = 40;
    const margin = 20;
    let tableHeight;
    tableHeight = winHeight - (header + subheaderHeight + pageContentFilterHeight + searchContentHeight + actionsHeight + pagination + margin);
    if (element) {
      element.style.height = tableHeight + 'px';
    }
  }

  onCellMouseOver($event, level) {
    const winHeight = window.innerHeight;
    const element = $($event.event.target).closest('.ag-cell');
    const agGrid = $($event.event.target).closest('.ag-fresh');
    const agGridOffset = agGrid.offset();
    const gridHeight = agGrid.outerHeight();
    const elementOffset = element.offset();
    const elementWidth = element.outerWidth();
    const tooltipHeight = element.find('.dropdown-menu').outerHeight();
    const tooltipName = element.find('.tooltiptext').outerHeight();
    const tooltipHeightPrice = element.find('.dropdown-menu-priceestimate').outerHeight();
    let errorTooltipheighht;
    setTimeout(() => {
      errorTooltipheighht = $('.custom--tooltip__block').outerHeight();
    }, 50);
    const tooltipTop = elementOffset.top;
    const tooltipLeft = elementOffset.left;
    const gridTop = agGridOffset.top;
    
    let headerHeight
    if(level === 4) {
      headerHeight = 50;
    } else{
      headerHeight = 45;
    }

    if (tooltipTop + tooltipHeight > (gridTop + gridHeight - 20)) {
      element.find('.dropdown-menu').addClass('drop-up');
    } else if ((gridTop + tooltipName + headerHeight) > tooltipTop) {
      element.find('.tooltiptext').addClass('drop-bottom');
    } else {
      element.find('.tooltiptext').removeClass('drop-bottom');
      element.find('.dropdown-menu').removeClass('drop-up');
    }
  }

  onCellMouseOverPrice($event, level) {
    const winHeight = window.innerHeight;
    const height = $(window).scrollTop();
    const element = $($event.event.target).closest('.ag-cell');
    const agGrid = $($event.event.target).closest('.ag-fresh');
    const agGridOffset = agGrid.offset();
    const gridHeight = agGrid.outerHeight();
    const elementOffset = element.offset();
    const elementWidth = element.outerWidth();
    const tooltipHeight = element.find('.dropdown-menu').outerHeight();
    const suitetooltipHeight = element.find('.suiteTooltip').outerHeight();
    const tooltipName = element.find('.tooltiptext').outerHeight();
    let errorTooltipheighht;
    setTimeout(() => {
      errorTooltipheighht = $('.custom--tooltip__block').outerHeight();
    }, 50);
    const tooltipTop = elementOffset.top;
    const tooltipLeft = elementOffset.left;
    if (tooltipTop + tooltipHeight > (agGridOffset.top + gridHeight - 10)) {
      element.find('.dropdown-menu').addClass('drop-up-price');
    } else if ((tooltipTop + agGridOffset.top + tooltipName) < gridHeight) {
      element.find('.tooltiptext').addClass('drop-bottom');
    } else {
      element.find('.dropdown-menu').removeClass('drop-up-price');
      element.find('.tooltiptext').removeClass('drop-bottom');
    }
    if ($event.colDef.field !== 'parameterIcon' && !(element.find('.legends').length !== 0 && element.find('.legends').is(':hover'))) {
      if (element.hasClass('ag-cell-value') || element.hasClass('suite-level-error')) {
        setTimeout(() => {
          if (tooltipLeft > errorTooltipheighht + agGridOffset.left) {
            $('.custom--tooltip__block').css({
              left: tooltipLeft - 300,
              top: tooltipTop - (errorTooltipheighht + 7),
              display: 'block'
            });
            $('.custom--tooltip__block').removeClass('arrow-position');
          } else {
            $('.custom--tooltip__block').css({
              left: tooltipLeft,
              top: tooltipTop - (errorTooltipheighht + 7),
              display: 'block'
            });
            $('.custom--tooltip__block').addClass('arrow-position');
          }
        }, 100);
      } else {
        $('.custom--tooltip__block').css({
          display: 'none'
        });
      }
    } else {
      $('.custom--tooltip__block').css({
        display: 'none'
      });
    }
    if (element.find('.dropdown-menu-priceestimate').hasClass('drop-up-price')) {
      $('.custom--tooltip__block').css({
        display: 'none'
      });
      $('.dropdown-menu-priceestimate').css({
        top: tooltipTop - (tooltipHeight + height),
        left: tooltipLeft - (agGridOffset.left + 46)
      });
    } else {
      $('.custom--tooltip__block').css({
        display: 'none'
      });
      $('.dropdown-menu-priceestimate').css({
        top: tooltipTop + 25 - height,
        left: tooltipLeft - (agGridOffset.left + 46)
      });
    }

    $('.suiteTooltip').css({
      top: - suitetooltipHeight
    });
  }

  dropPosition($event, val) {
    const modalElement = $($event.target).closest('.req-adjustment');
    const modalElementOffset = modalElement.offset();
    const element = $($event.target).closest('.btn--text');
    const elementOffset = element.offset();
    const tooltipTop = elementOffset.top;
    const tooltipLeft = elementOffset.left;
    let tooltipheight;
    tooltipheight = $('.custom--tooltip__block-reason').outerHeight();
    $('.custom--tooltip__block-reason').css({
      top: modalElementOffset.top,
      left: 0
    });
  }

  getSortedData(data: Array<any>, sortingType: string, sortField: string) {

    let isNumberDataType = true;
    if (isNaN(data[0][sortField])) {
      isNumberDataType = false;
    }
    if (data && data.length > 0) {
      this.sortArrayObject(data, sortingType, sortField, isNumberDataType);
      for (let i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length > 0) {
          const firstLevelChildren = data[i].children;
          this.sortArrayObject(firstLevelChildren, sortingType, sortField, isNumberDataType);
          for (let j = 0; j < firstLevelChildren.length; j++) {
            const secondLevelchild = firstLevelChildren[j].children;
            if (secondLevelchild && secondLevelchild.length > 1) {
              this.sortArrayObject(secondLevelchild, sortingType, sortField, isNumberDataType);
            }
          }
        }
      }
    }
  }


  private sortArrayObject(data: Array<any>, sortingType: string, sortField, isNumberDataType: boolean) {
    const colDataType = this.columnDataTypeMap.get(sortField);
    if (colDataType === 'Date') {
      if (sortingType === this.DESC_ORDER_SORT) {
        data.sort((a, b) => {
          const dateA = new Date(a[sortField]), dateB = new Date(b[sortField]);
          return dateB.getTime() - dateA.getTime();
        });
      } else {
        data.sort((a, b) => {
          const dateA = new Date(a[sortField]), dateB = new Date(b[sortField]);
          return dateA.getTime() - dateB.getTime();
        });
      }

    } else if (isNumberDataType) {
      if (sortingType === this.DESC_ORDER_SORT) {
        data.sort(function (a, b) {

          return b[sortField] - a[sortField];
        });
      } else {
        data.sort(function (a, b) { return a[sortField] - b[sortField]; });
      }
    } else {
      if (sortingType === this.DESC_ORDER_SORT) {
        data.sort((a, b) => (b[sortField] || "").toString().localeCompare((a[sortField] || "").toString()));
      } else {
        data.sort((a, b) => (a[sortField] || "").toString().localeCompare((b[sortField] || "").toString()));
      }
    }
  }

  public removeArrayElement(arr: Array<any>, index: number) {
    const removedElementArray = new Array<any>();
    let isElementFound = false;
    if (arr && arr.length > 0) {
      const sizeOfArray = arr.length;
      for (let i = 0; i < sizeOfArray; i++) {
        if (i !== index) {
          removedElementArray.push(arr[i]);
        }
        if (sizeOfArray === 1) {
          isElementFound = true;
        }
      }
    } else {
      return arr;
    }
    if (removedElementArray.length > 0 || isElementFound) {
      return removedElementArray;
    } else {
      return arr;
    }
  }

  changeMessage(message: boolean) {
    this.messageSource.next(message);
  }


  wrapAxisText(selection, d3) {

    const width = 70;

    selection.each(function () {

      const breakChars = ['/', '&', '-'];
      const text = d3.select(this);
      let textContent = text.text();
      let quarter = false;
      let spanContent;
      let words;
      let ind;
      let count = 0;

      breakChars.forEach(char => {
        // Add a space after each break char for the function to use to determine line breaks
        textContent = textContent.replace(char, char + ' ');
      });

      ind = textContent.indexOf('FY');

      if (ind === -1) {
        ind = textContent.indexOf('yrs');
      }
      if (ind > 0) {
        words = [textContent.substring(0, ind).trim(), textContent.substring(ind, textContent.length).trim()];
        quarter = true;
      } else {
        words = textContent.split(/\s+/);
      }

      words.reverse();

      let word;
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      let x = text.attr('x');
      x = x ? x : 50;
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy') || 0);
      let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' ')).style('font-size', '12px').style('fill', '#333333');
        if (tspan.node().getComputedTextLength() > width || (quarter && count > 0)) {
          line.pop();
          spanContent = line.join(' ');
          breakChars.forEach(char => {
            // Remove spaces trailing breakChars that were added above
            spanContent = spanContent.replace(char + ' ', char);
          });
          tspan.text(spanContent);
          line = [word];
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word).style('font-size', '16px').style('fill', '#14A792');
        }
        count++;
      }
    });
  }

  getUniqueKeys(data) {
    if (data) {
      const keys: Array<any> = [];
      data.forEach(element => {
        element.areas.forEach(element_2 => {
          const object = element_2.freq;
          for (const key in object) {
            if (object.hasOwnProperty(key) && keys.indexOf(key) === -1) {
              keys.push(key);
            }
          }
        });
      });
      keys.sort();
      return keys;
    }
  }


  getFloatValue(val: string) {
    let floatValue = 0.0;
    if (val) {
      try {
        floatValue = parseFloat(val);
      } catch (error) {
        console.log(error);
        floatValue = 0.0;
      }
    }
    return floatValue;
  }


  formatAdditionalCostValue(val) {

    let floatValue = val;
    if (!val) {
      floatValue = "-";
    }
    return floatValue;
  }



  // Show message incase of super user
  showSuperUserMessage(rwSuperUser, roSuperUser, qualOrProposal) {
    if ((rwSuperUser || roSuperUser) && !this.appDataService.isSuperUserMsgDisplayed) {
      if (qualOrProposal === this.constantsService.PROPOSAL) {
        this.appDataService.persistErrorOnUi = true;
      }
      this.appDataService.isSuperUserMsgDisplayed = true;
      // show message respectve to RW/RO Super User
      if (rwSuperUser) {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'authentication.SUPERUSER_MESSAGE'), MessageType.Info));
      } else if (roSuperUser) {
        this.messageService.displayMessages(this.appDataService.setMessageObject(this.localeService.getLocalizedMessage(
          'authentication.RO_SUPERUSER_MESSAGE'), MessageType.Info));
      }
    }
  }

  getValueFromCookie(name) {
    const re = new RegExp(name + '=([^;]+)');
    const value = re.exec(document.cookie);

    return (value != null) ? value[1] : null;
  }

  // allowing only numbers and (.) to be entered for discount
  isNumberKey(evt) {
    let charCode = evt.which ? evt.which : evt.keyCode;
    // allowing only numbers, tab, backspace, right and left keys
    let code = (charCode >= 96 && charCode <= 105) || (charCode >= 48 && charCode <= 57) || (charCode >= 37 && charCode <= 40) ||
      charCode === 8 || charCode === 9 || charCode === 190 || charCode === 110 || charCode === 110;
    if (code) {
      return true;
    } else {
      return false;
    }
  }

  // allow only numbers
  isNumberOnlyKey($event) {
    let code = ($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 ||
      $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 || $event.keyCode === 39 || $event.keyCode === 46);
    if (code) {
      return true;
    } else {
      return false;
    }
  }

  // allow only numbers
  allowNumberWithPlus($event) {
    let code = ($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 ||
      $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 || $event.keyCode === 39 || $event.keyCode === 46 || $event.keyCode === 187 && $event.key === "+");
    if (code) {
      return true;
    } else {
      return false;
    }
  }

  restrictSpecialChar($event) {
    // allow semicolon, comma, dash, apostrophe, ampersand, and period/dot to the afiliate names
    if (($event.keyCode === 188 || $event.keyCode === 186 || $event.keyCode === 190 || $event.keyCode === 189 || $event.keyCode === 222) &&
      !$event.shiftKey) {
    } else {
      // allow left and right keys to edit the values
      if (!($event.keyCode >= 48 && $event.keyCode <= 54 && !$event.shiftKey || $event.keyCode === 55 ||
        ($event.keyCode === 56 || $event.keyCode === 57) && !$event.shiftKey || $event.keyCode >= 65 && $event.keyCode <= 90 ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 32 || $event.keyCode === 37 ||
        $event.keyCode === 39)) {
        event.preventDefault();
      }
    }
  }
  // Allow only alphanumeric values
  allowAphaNumeric($event) {
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.manageUserAdmin) {
      // allow left and right keys to edit the values
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 65 && $event.keyCode <= 90 ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 37 || $event.keyCode === 39)) {
        event.preventDefault();
      }
    } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.manageUserRoles) {
      // allow blank spaces to fill the value
      if (!($event.keyCode >= 65 && $event.keyCode <= 90 || $event.keyCode === 8 || $event.keyCode === 37 ||
        $event.keyCode === 32 || $event.keyCode === 39)) {
        event.preventDefault();
      }
    }
  }

  // to restrict splecial characters and black spaces
  restrictBlankSpces($event) {
    // if page is manage registry allow (-,_) keys also
    if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.manageServiceRegistry) {
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 65 && $event.keyCode <= 90 ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 ||
        $event.keyCode === 39 || $event.keyCode === 189)) {
        event.preventDefault();
      }
    } else {
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 65 && $event.keyCode <= 90 ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 ||
        $event.keyCode === 39 || $event.keyCode === 188)) {
        event.preventDefault();
      }
    }
  }

  // to allow only numbers but not decimals
  numberOnlyKey($event) {
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 ||
      $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 || $event.keyCode === 39)) {
      event.preventDefault();
    }
  }

  allowAlpha($event) {
    if (!($event.keyCode >= 65 && $event.keyCode <= 90 || $event.keyCode === 8 || $event.keyCode === 32 ||
      $event.keyCode >= 96 && $event.keyCode <= 105)) {
      event.preventDefault();
    }
  }

  convertArrayToStringWithSpaces(array) {
    let convertedString = array.join(' | ');
    return convertedString;
  }

  saveFile(res, downloadZipLink) {

    const x = res.headers.get('content-disposition').split('=');
    let filename = x[1]; // res.headers.get("content-disposition").substring(x+1) ;
    filename = filename.replace(/"/g, '');
    // IE & Edge
    const nav = (window.navigator as any);
    if (nav.msSaveOrOpenBlob) {
      // msSaveBlob only available for IE & Edge
      nav.msSaveBlob(res.body, filename);
    } else {
      const url2 = window.URL.createObjectURL(res.body);
      const link = downloadZipLink.nativeElement;
      link.href = url2;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url2);
    }
  }

  removeWhiteSpace(input) {
    input = input.trim();
    return input;

  }

  isFollowonButtonDisplay(){
    if(this.appDataService.displayRenewal && (!this.appDataService.limitedFollowOn || this.appDataService.allowInitiateFollowOn)){
          return true;
    }
    return false;
  }

  // set date to mm/dd/yyyy 
  formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return `${month}/${day}/${year}`;
  }

}
