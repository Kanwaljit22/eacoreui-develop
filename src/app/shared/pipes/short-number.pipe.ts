import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  transform(number: number, args?: any): any {
    if (isNaN(number)) { // will only work value is a number
      return null;
    }
    if (number === null) {
      return null;
    }
    if (number === 0 || number === 0.00) {
      return 0.00;
    }
    let abs = Math.abs(number);
    const rounder = Math.pow(10, 2);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    // set the array of objects of keys and values to check & set the keys
    const powers = [
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    // check each element of array to set the vlaue and key
    for (let i = 0; i < powers.length; i++) {
      // check the value with each value of array
      let reduced = abs / powers[i].value;
      //
      reduced = Math.round(reduced * rounder) / rounder;
      // check if the value is greater than 1 and set that particular key with the respective value
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }
    return (isNegative ? '-' : '') + abs + key;
  }

}
