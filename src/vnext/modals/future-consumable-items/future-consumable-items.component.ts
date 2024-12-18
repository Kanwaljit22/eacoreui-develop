import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateService } from 'vnext/proposal/edit-proposal/price-estimation/price-estimate.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-future-consumable-items',
  templateUrl: './future-consumable-items.component.html',
  styleUrls: ['./future-consumable-items.component.scss']
})
export class FutureConsumableItemsComponent implements OnInit {
  enrollmentData = [];

  constructor(public ngbActiveModal: NgbActiveModal,public priceEstimateService: PriceEstimateService, private vnextService: VnextService, public dataIdConstantsService: DataIdConstantsService,
    public proposalStoreService: ProposalStoreService, private proposalRestService: ProposalRestService, public localizationService:LocalizationService, private eaService: EaService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('future-consumable-items');
  }

  close() {
    this.ngbActiveModal.close({
      continue: false
    });
  }

  continue() {
    this.ngbActiveModal.close({
      continue: true
    });
  }

  expand(pool) {
    pool.hideSuites = !pool.hideSuites;
  }

  toggleSelection(suites, license) {
    if(license){
      suites.optIn.fulfillmentType = license;
      suites.partner = (license === 'CISCO') ? false : true;
    } else {
      suites.partner = !suites.partner
      if (suites.partner){
        suites.optIn.fulfillmentType = 'PARTNER';
      } else {
        suites.optIn.fulfillmentType = 'CISCO';
      }
    }
    
  }

  updateFulFillmentType() {

    const reqJson = {
      "data": {
        "enrollments":[]
      }
    }
    this.setRequestForUpdate(reqJson)
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +'?a=ATO-OPTIN-FLMTTYPE-UPDATE';

    this.proposalRestService.postApiCall(url, reqJson).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)){
        this.continue();
      }
    });
  }

  setRequestForUpdate(reqJson){
    for (let enrollment of this.enrollmentData){
      const atos = [];
      for (let pool of enrollment.pools){
        for (let suiteData of pool.suites){
          if (suiteData.optIn){
            atos.push({
              name: suiteData.ato,
              "optIn": {
                "fulfillmentType": suiteData.optIn.fulfillmentType
              }
            });
          }
        }
      }
      reqJson.data.enrollments.push({enrollmentId: enrollment.id, atos: atos})
    }
  }
  
}