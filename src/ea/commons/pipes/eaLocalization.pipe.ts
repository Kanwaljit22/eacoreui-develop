import { EaStoreService } from 'ea/ea-store.service';
import { LocalizationService } from './../../../vnext/commons/services/localization.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localizationPipe'
})
export class EaLocalizationPipe implements PipeTransform {

  constructor(private localizationService: LocalizationService, private eaStoreService:EaStoreService ) { }
    transform(key: any, size) {
        const value = this.localizationService.localizedString.get(key);
        if (value) {
            return value;
        } else {
            //return key;
            return this.eaStoreService.emptyString;
        }
    }

}