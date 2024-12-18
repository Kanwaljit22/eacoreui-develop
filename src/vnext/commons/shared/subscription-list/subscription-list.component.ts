import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ISubscription, ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { EaUtilitiesService } from "ea/commons/ea-utilities.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { LookupSubscriptionComponent } from "vnext/modals/lookup-subscription/lookup-subscription.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { EaService } from 'ea/ea.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit, OnDestroy {

  subscriptionList:ISubscription[] = [];
  @Input() selectedSubscription:ISubscription;
  coTerm = false;
  isShowCoTerm = false;
  selectedDuration:number;
  durationInMonths: any;
  displayDurationMsg = false;
  @Input() cotermSelected = false;
  @Output() subscriptionSelected = new EventEmitter();
  @Input() startDate: Date;
  @Input() isChangeSubFlow = false;
  @Input() isEnrollmentSub: boolean;
  @Input() isReadOnly = false;
  public subscribers: any = {};


  constructor(private modalVar: NgbModal,private vnextService: VnextService,private eaRestService: EaRestService,public eaUtilitiesService: EaUtilitiesService, public projectStoreService: ProjectStoreService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public proposalStoreService: ProposalStoreService, public eaService: EaService) { }

  ngOnInit(): void {

    if(!this.isChangeSubFlow){
      this.getSubscriptionList();
    } else {
      // set subscription for change sub flow into the list
      if (this.selectedSubscription) {
        this.subscriptionList = [];
        this.subscriptionList.push(this.selectedSubscription);
   }
    }

    this.subscribers.openLookupSubscriptionSubj = this.proposalStoreService.openLookupSubscriptionSubj.subscribe((data:any) => {
      this.lookupSubscription();
    });
  }

     // method to get susbscription list 
 getSubscriptionList(){

  const url = this.vnextService.getAppDomainWithContext + 'project/' + this.projectStoreService.projectData.objId + '/eaid-subscriptions';
   this.eaRestService.getApiCall(url).subscribe((res: any) => {
    
    if (this.vnextService.isValidResponseWithoutData(res)) {
      if (res.data){
        this.subscriptionList = res.data;
      } else {
        this.subscriptionList = [];
      }
      // Search susbcription if not in subscription list
      if (this.selectedSubscription && !this.subscriptionSelectedFromList()) {
             this.searchSubscription()
        }
    } else {
    }
   });
}


selectSubscription(subscription) {
  if(this.isReadOnly){
    return;
  }

  this.selectedSubscription =  {subscriptionEnd:subscription.subscriptionEnd ,subscriptionStart:subscription.subscriptionStart ,subscriptionId :subscription.subscriptionId , subRefId :subscription.subRefId};
  this.subscriptionSelected.emit(subscription);
}

deselectSubscription() {
  if(this.isReadOnly){
    return;
  }

  this.selectedSubscription =  {};
  this.subscriptionSelected.emit();
}

lookupSubscription() {
  if(this.isReadOnly){
    return;
  }

const modalRef = this.modalVar.open(LookupSubscriptionComponent, { windowClass: 'lg' });
modalRef.componentInstance.eaStartDate =  this.startDate;

modalRef.result.then((result) => {
      if (result.continue === true) {
        this.selectedSubscription =  result.data;

        // If searched subscription already exist , select from existing one 

        if (!this.subscriptionSelectedFromList()) {
               this.subscriptionList = [this.selectedSubscription, ...this.subscriptionList];
        }
        this.subscriptionSelected.emit(this.selectedSubscription);
      }
  });
}


 // This method is used to identify if susbcription selected from the existing list
   subscriptionSelectedFromList() {

    let selectedSubscriptionAlreadyExist =  false;
        if(this.subscriptionList?.length){
          for (let subscription of this.subscriptionList) {
            if (this.selectedSubscription.subRefId === subscription.subRefId) {
              selectedSubscriptionAlreadyExist =  true;
            }
          }
        }
      return selectedSubscriptionAlreadyExist;
   }

  // Search selected subscription
  searchSubscription() {

    const url = this.vnextService.getAppDomainWithContext + 'subscription/search/'+this.selectedSubscription.subRefId+ '?p=' + this.projectStoreService.projectData.objId + '&type=co-term';
    this.eaRestService.getApiCall(url).subscribe((response: any) =>{
      if (this.vnextService.isValidResponseWithData(response, true)){

        this.selectedSubscription = {subscriptionId:response.data.subscriptionId ,subscriptionStart : response.data.subscriptionStartDate,subscriptionEnd : response.data.subscriptionEndDate, statusDesc : response.data.statusDesc, subRefId : response.data.subscriptionRefId}
        this.subscriptionList = [this.selectedSubscription, ...this.subscriptionList];

      } else {
      }
    });
  }
 
  ngOnDestroy() {
    if (this.subscribers.openLookupSubscriptionSubj){
      this.subscribers.openLookupSubscriptionSubj.unsubscribe();
     }
  }
}
