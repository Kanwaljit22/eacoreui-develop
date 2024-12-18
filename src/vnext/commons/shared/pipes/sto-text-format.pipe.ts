import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'stoTextFormat'
})
export class StoTextFormatPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }

  transform(value: any, atos: any, atoMap: any): SafeHtml {
    if(atos?.length){
      atos.forEach(ato => {
       // atoMap = {[ato.name] : 'Premier'}//remove
        if(value.includes(ato.name)){
          const suffix = (atoMap) ? atoMap[ato.name] : undefined
          const displayValue = (suffix) ? (ato.desc + ' ' + suffix) : ato.desc
         if(ato.selected){
          value = value.replace(ato.name, '<span style=" color:#538b01; font-weight:bold; ">'+ displayValue + '</span>')
         } else {
          value = value.replace(ato.name,displayValue)
         }
        }
      });
    }
    console.log(value);
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
