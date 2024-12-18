import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
@Injectable({
  providedIn: VnextResolversModule
})
export class UtilitiesService {
  MONTH = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': "May", '06': 'June', '07': 'July', '08': "August", '09': "September", '10': "October", '11': "November", '12': "December" };
  constructor(private currencyPipe: CurrencyPipe) { } 
  
  public cloneObj(object) {
    if(object){
      let  clonedObject;
      try{
         clonedObject =  JSON.parse(JSON.stringify(object));
      } catch(error){
          return error;
      }
          return clonedObject;
    } 
      return null;
  }

  // method to save the downloaded file from api
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

  allowOnlyNumber($event){  
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode == 8)) {
      event.preventDefault();
      }
  }
  allowNumberAndComma($event){ 
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode == 8 ||$event.keyCode ==  188)) {
      event.preventDefault();
      }
  }

  // method to validate if whitespaces present 
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = control.value && !control.value.trim().length;
    return isWhitespace ? { 'whitespace': true } : null;
  }

  // mehtod to check integer or decimal and format to 2 decimal point
  checkDecimalOrIntegerValue(number) {
    number = +number;
    if (number == Math.floor(number)) {
      return number;
    } else {
      return this.formatValue(this.getFloatValue(number));
    }
  }

  // method to format value
  formatValue(value) {
    let val = '';
    if (value === 0 || value) {
      val = this.currencyPipe.transform(value, 'USD', 'symbol');
      val = val.replace(/\$/gi, ''); /*Remove $ from formatted text */
      return val;
    }
  }

  // method to get float value
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

  public sortArrayByDisplaySeq(arrayOfObj:Array<any>){
    if(arrayOfObj){
      arrayOfObj.sort(this.compare_displaySeq);
    }
  }

  public compare_displaySeq(obj1, obj2){
    // obj1 should come before obj2 in the sorted order
    if(obj1.displaySeq < obj2.displaySeq){
            return -1;
    // obj1 should come after obj2 in the sorted order
    }else if(obj1.displaySeq > obj2.displaySeq){
            return 1;
    // obj1 and obj2 are the same
    }else{
            return 0;
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

  numberKeyForSearch($event) {//only nunmber, enter, left, rigth, up, down, copy/paste 
    let code = (($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey) || $event.keyCode >= 96 && $event.keyCode <= 105 ||
      $event.keyCode === 8 || $event.keyCode === 9 || $event.keyCode === 37 || $event.keyCode === 39|| $event.keyCode === 38|| $event.keyCode === 40 || $event.keyCode === 46 || $event.keyCode === 13
      ||(($event.ctrlKey || $event.metaKey) && ($event.keyCode === 67 || $event.keyCode === 65 || $event.keyCode === 86)));
    if (code) {
      return true;
    } else {
      return false;
    }
  }

  formateDate(dateStr: string) {
    if(dateStr){
      let dateToFormat = dateStr;
      const year = dateToFormat.substring(0, 4);
      const month = dateToFormat.substring(4, 6);
      const day = dateToFormat.substring(6);
      return day + " " + this.MONTH[month].substring(0, 3) + " " + year;
    }
  }

  // method to format date into string
  formartDateIntoString(date: Date){
    const x = date;
    const a = (x.toString().substring(4, 7));
    const date_ea: string = x.toString().substring(11, 15) + MONTHS[a] + x.toString().substring(8, 10);
    return date_ea;
  }
  
  convertFloatValueByDecimalCount(value,decimalCount) {

    return Number(value?.toFixed(decimalCount))
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

  // Allow only alphanumeric values
  allowAphaNumeric($event) {
    
      // allow left and right keys to edit the values
      if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey || $event.keyCode >= 65 && $event.keyCode <= 90 ||
        $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 37 || $event.keyCode === 39)) {
        event.preventDefault();
      }
  }

  // Method to replace spaces with __ 
  replaceSpacesWithUnderscores(type: string) {
    let returnvalue = type;
    if (type?.includes(' ')) {
      returnvalue = type.replace(/ /g, '__');
    }
    return returnvalue
  }
  // Method to replace __ with spaces 
  replaceUnderscoresWithSpaces(type: string) {
    let returnvalue = type;
    if (type?.includes('__')) {
      returnvalue = type.replace(/__/g, ' ');
    }
    return returnvalue
  }

}

