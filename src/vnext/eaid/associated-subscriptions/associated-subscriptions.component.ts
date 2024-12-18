import { Component, OnInit } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService, PaginationObject } from 'ea/ea.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextService } from 'vnext/vnext.service';
import { EaidStoreService } from '../eaid-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-associated-subscriptions',
  templateUrl: './associated-subscriptions.component.html',
  styleUrls: ['./associated-subscriptions.component.scss']
})
export class AssociatedSubscriptionsComponent implements OnInit {

  reqObj = {"data":{"page":{"pageSize":50,"currentPage":1}}};
  subscriptionData = [];
  paginationObject: PaginationObject;
  subscriptionsDataNotPresent = false;

  constructor(private eaService: EaService,private eaRestService: EaRestService, private vnextService: VnextService, public localizationService: LocalizationService, public eaIdStoreService: EaidStoreService, public dataIdConstantsService: DataIdConstantsService, private messageService: MessageService, public constantsService: ConstantsService) {

  }

  ngOnInit() {
    this.eaIdStoreService.subscriptionsNotPresent = false;
    this.messageService.pessistErrorOnUi = false;
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.subscriptionData = [];
    const url = this.vnextService.getAppDomainWithContext + 'project/eaid-subscriptions';
    this.reqObj.data['eaid'] = this.eaIdStoreService.encryptedEaId;
    this.eaRestService.postApiCall(url, this.reqObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        if(response.data?.subscriptionDetails) {
          this.subscriptionData = response.data.subscriptionDetails;
        }
        this.paginationObject = response.data.page;
      } else {
        if(response.error){
          this.messageService.displayMessagesFromResponse(response, false)
        } else if (!response.data) {
          this.paginationObject = {}
          this.subscriptionsDataNotPresent =  true;
        }
        this.eaIdStoreService.subscriptionsNotPresent = true;
      }
    });
  }

  paginationUpdated(event) {
    let reqObj;
    reqObj = {
      "data": {
        "page": {
          "pageSize": event.pageSize,
          "currentPage": event.currentPage
        }
      }
    };
    this.reqObj = reqObj;
    this.getSubscriptions();
  }
}
