import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';

const MONTH = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

@Injectable({
  providedIn: 'root'
})
export class EaUtilitiesService {

  constructor(private currencyPipe: CurrencyPipe) { }

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

// to formart date into 8 digit
   formartDateToStr(date){
  
  if (date && date.includes('/')) {
      let date_ea: string = (date.toString().substring(6, 10)) +  (date.toString().substring(0, 2)) + (date.toString().substring(3, 5)) 
      return date_ea;
    }else {
      return date;
    }
  }

  // Format date with month having as string
   formatDateWithMonthToString(eaStartDate) {
    if(eaStartDate){
      const x = eaStartDate;
      const a = (x.toString().substring(4, 7));
      const startDate: string = x.toString().substring(11, 15) + MONTH[a] + x.toString().substring(8, 10);
      return startDate
    }
    return undefined;
    
  }

  convertFloatValueByDecimalCount(value,decimalCount) {

    return Number(value.toFixed(decimalCount))
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

  // add months to selcted dates
  addMonthsToDate(defaultDate, months){
    let cotermDate = new Date(defaultDate);
    let dateToChange = new Date(cotermDate.setMonth(defaultDate.getMonth() + months));
    return new Date(dateToChange.setDate(dateToChange.getDate() - 1)); // to attain 12/84 months proper
  }
}
