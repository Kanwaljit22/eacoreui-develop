import { EaStoreService } from 'ea/ea-store.service';

import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Pipe({
  name: 'localizationPipe'
})
export class LocalizationPipe implements PipeTransform {

  constructor(private localizationService: LocalizationService, private eaStoreService: EaStoreService) { }

    transform(key: any,size, dynamicInput?) {
        let message = this.localizationService.localizedString.get(key);
        if (message) {
            if(dynamicInput){//dynamicInput is dynamic value
              Object.keys(dynamicInput).forEach(key => {
                const dynamicKey = `{${key}}`; // this is convert key from the obj to sting with {}  
                if(dynamicKey && message.includes(dynamicKey)){
                  message = message.replace(dynamicKey, dynamicInput[key]);
                }
              });
            }  
            return message;
        } 
        else {
            //return key;
            return this.eaStoreService.emptyString;
        }
    }

}