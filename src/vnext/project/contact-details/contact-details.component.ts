import { Component, OnInit } from '@angular/core';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ProjectStoreService } from '../project-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { SubsidiariesStoreService } from '../subsidiaries/subsidiaries.store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { EaService } from 'ea/ea.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  partnerLoggedIn : boolean;
  isShowAtrLink: boolean = false;

  constructor(public projectStoreService: ProjectStoreService, public eaService: EaService,
    public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService, public subsidiariesStoreService: SubsidiariesStoreService, private vnextService: VnextService, private eaRestService: EaRestService,
    private constantsService: ConstantsService, public elementIdConstantsService: ElementIdConstantsService, private projectService: ProjectService
    ){ }

  ngOnInit() {
    if (this.eaService.isPartnerUserLoggedIn()) {
      this.partnerLoggedIn = true;
    } else {
      this.partnerLoggedIn = false;
    }
  }

  viewAtr() {
    const url  = this.vnextService.getAppDomainWithContext + this.constantsService.ATR_URL + this.subsidiariesStoreService.subsidiariesData[0].cavId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if(this.vnextService.isValidResponseWithData(response, true)) {
        if (response.data) {
          window.open(response.data);
        }
      }
    })
  }

  modifyBpid() {
    this.projectService.isModifyScopeSelection.next(true);
  }

}
