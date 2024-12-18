import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { TcoApiCallService } from '@app/tco/tco-api-call.service';
import { TcoDataService } from '@app/tco/tco.data.service';

@Injectable()
export class CustomerOutcomeService {
  totalSelected = 0;
  selectedCatalogues: any;
  constructor(private http: HttpClient, private appDataService: AppDataService, private tcoDataService: TcoDataService,
    private tcoApiCallService: TcoApiCallService) { }

  prepareData(response) {
    this.totalSelected = 0;
    let catalogues = [];
    const headers = Object.keys(response.outcomes);
    for (let j = 0; j < headers.length; j++) {
      let data = { 'name': '', 'outcomes': [], 'active': false, 'displayName': '', 'selectedCount': 0, "class": '' };
      data.name = headers[j];
      if (data.name === 'salesPlays') {
        data.class = 'icon-service-renewals';
      } else if (data.name === 'enrollments') {
        data.class = 'icon-subscription-renewals';
      } else {
        data.class = 'icon-products';
      }
      if (this.tcoDataService.catalogueMetaData.catalogueCategory[headers[j]]) {
        data.displayName = this.tcoDataService.catalogueMetaData.catalogueCategory[headers[j]].label;
      }
      if (j === 0) {
        data.active = true;
      }
      data.outcomes = response.outcomes[data.name];
      for (let i = 0; i < data.outcomes.length; i++) {
        if (this.selectedCatalogues.catalogue.outcomes[data.name]) {
          if (this.selectedCatalogues.catalogue.outcomes[data.name].find(value => value.name === data.outcomes[i].name)) {
            data.outcomes[i]['selected'] = true;
            data.selectedCount++;
            this.totalSelected++;
          } else {
            data.outcomes[i]['selected'] = false;
          }
        } else {
          data.outcomes[i]['selected'] = false;
        }
      }
      catalogues.push(data);
    }
    return catalogues;
  }

}
