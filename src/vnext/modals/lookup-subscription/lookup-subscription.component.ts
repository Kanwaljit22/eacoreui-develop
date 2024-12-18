import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'vnext/commons/message/message.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { VnextService } from 'vnext/vnext.service';
import { ISubscription } from "vnext/proposal/proposal-store.service";
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

@Component({
  selector: 'app-lookup-subscription',
  templateUrl: './lookup-subscription.component.html',
  styleUrls: ['./lookup-subscription.component.scss'],
  providers: [MessageService]
})
export class LookupSubscriptionComponent implements OnInit, OnDestroy {

  newSubscriptionId = ''; 
  allowChange = false; 
  isSearchDataAvailable = false; 
  searchedSubscription:ISubscription;
  showErrorMessage =  false;
  selectedDuration:number;
  displayDurationMsg = false;
  eaStartDate: Date;

  constructor(public activeModal: NgbActiveModal, private vnextService: VnextService, private projectStoreService: ProjectStoreService, private messageService: MessageService , private eaUtilitiesService: EaUtilitiesService , public localizationService:LocalizationService,private eaRestService: EaRestService, private eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService) { }

  ngOnInit() {
    this.eaService.getLocalizedString('lookup-subscription');
  }

  // to lookup new deal entered
  lookUpSubscription(){
    this.isSearchDataAvailable = false;
    this.showErrorMessage = false;
    
    // if no deal present or dealId empty don't call api
    if (!this.newSubscriptionId || !this.newSubscriptionId.trim().length){
      return;
    }
    this.newSubscriptionId = this.newSubscriptionId.trim(); // to remove spaces if entered

    const url = this.vnextService.getAppDomainWithContext + 'subscription/search/'+this.newSubscriptionId+ '?p=' + this.projectStoreService.projectData.objId + '&type=co-term';

    this.eaRestService.getApiCall(url).subscribe((response: any) =>{
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)){
         this.isSearchDataAvailable = true;
        this.searchedSubscription = {subscriptionId:response.data.subscriptionId ,subscriptionStart : response.data.subscriptionStartDate,subscriptionEnd : response.data.subscriptionEndDate, statusDesc : response.data.statusDesc, subRefId : response.data.subscriptionRefId}
        this.getDuration(this.searchedSubscription)
      } else {
        this.showErrorMessage = true;
      }
    });
  }


  getDuration(selectedSubscription) {

  this.displayDurationMsg = false;

  const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.eaUtilitiesService.formatDateWithMonthToString(this.eaStartDate)  + '/' + this.eaUtilitiesService.formartDateToStr(selectedSubscription.subscriptionEnd) + '/duration';

   this.eaRestService.getApiCall(url).subscribe((res: any) => {
    
    if (this.vnextService.isValidResponseWithData(res)) {

      this.selectedDuration = res.data;

      if(this.selectedDuration < 12){
          this.displayDurationMsg = true;
        } else {
          this.displayDurationMsg = false;
        }

    } else {
      this.messageService.displayMessagesFromResponse(res);
    }
   });
}


  close(){
    this.activeModal.close({
      continue: false
    });
  }

  // set checkbox selection
  matchDealId(){
    this.allowChange = !this.allowChange;
  }

  // set checkbox selection of including items
  selectItems(item){
    item.selected = !item.selected;
  }


  continue() {
    this.activeModal.close({
          continue: true,
          data: this.searchedSubscription
    });
  }

  ngOnDestroy(){
    this.messageService.disaplyModalMsg = false;
  }
}
