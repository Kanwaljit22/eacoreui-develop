import { Component, OnInit } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'ng-guide-me',
  templateUrl: './guide-me.component.html',
  styleUrls: ['./guide-me.component.scss']
})
export class GuideMeComponent implements OnInit {

  label: string;
  features: any;
  constructor(public eaStoreService: EaStoreService, private eaRestService: EaRestService, private eaService: EaService,public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    this.openGuideMe();
  }

  openGuideMe(){
    // const url = 'guide/list?p=QualificationWhosInvolvedStep';
    if (!this.eaStoreService.pageContext) {
      this.eaStoreService.pageContext = 'ngGuideMe';
    }
    const url = 'guide/list?p='+ this.eaStoreService.pageContext;
    this.eaRestService.getEampApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response)){
        this.label = response.data.contextHeader.label;
        this.features = response.data.features;
      } else {
        this.label = '';
      }
    });
  }
}
