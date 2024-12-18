import { QualSummaryService } from '@app/qualifications/edit-qualifications/qual-summary/qual-summary.service';
import { Component, OnInit } from '@angular/core';
import { IRoadMap } from '@app/shared';
import { LocaleService } from '@app/shared/services/locale.service';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { AppRestService } from '@app/shared/services/app.rest.service';
import { MessageService } from '@app/shared/services/message.service';
import { Router } from '@angular/router';
import { RenewalSubscriptionService } from '../renewal-subscription.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { EarlyRenewalApprovalComponent } from '@app/modal/early-renewal-approval/early-renewal-approval.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstantsService } from '@app/shared/services/constants.service';

@Component({
  selector: 'app-select-subscription',
  templateUrl: './select-subscription.component.html',
  styleUrls: ['./select-subscription.component.scss']
})
export class SelectSubscriptionComponent implements OnInit {
  roadMap: IRoadMap;
  subscriptionList = [];
  selectedSubscriptions = []; // set selectedSubscriptions
  subscriptionIdList = []; // set sibscription id's from existed subscriptions List
  isSubscriptionApiCalled = false;
  alreadyHasEarlyRenewal = false;

  constructor(public localeService: LocaleService,  public appDataService: AppDataService, private qualService: QualificationsService, private modalVar: NgbModal,
    private appRestService: AppRestService, public messageService: MessageService, private router: Router, public renewalSubscriptionService: RenewalSubscriptionService, public blockUiService: BlockUiService) { }

  ngOnInit() {
    this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.renewalSelectSubscription;
    this.appDataService.showEngageCPS = true;
    this.appDataService.engageCPSsubject.next(this.appDataService.showEngageCPS);
    this.appDataService.custNameEmitter.emit({ 'text': this.appDataService.customerName,
                            'qualId': this.qualService.qualification.qualID, 'context': this.appDataService.pageContext });
    this.blockUiService.spinnerConfig.startChain();
    const sessionObject: SessionData = this.appDataService.getSessionObject();
    if(sessionObject.renewalId && !this.renewalSubscriptionService.selectSubsriptionReponse){
      this.fetchRenewals(sessionObject.renewalId);
    } else {
      if(this.renewalSubscriptionService.selectSubsriptionReponse && this.renewalSubscriptionService.selectSubsriptionReponse.type === ConstantsService.EARLY_FOLLOWON && this.renewalSubscriptionService.selectSubsriptionReponse.earlyRenewalException){
        this.alreadyHasEarlyRenewal = true;
      }
      this.getSubscriptionList();
    }
  }

  getSubscriptionList(){//update code to handle error msg*****
    this.selectedSubscriptions = this.renewalSubscriptionService.selectedSubscriptions;
    this.appRestService.getSubscriptionList(this.appDataService.getAppDomain, this.appDataService.customerID,true,this.qualService.qualification.qualID).subscribe((response: any) => {
      this.isSubscriptionApiCalled = true;
      this.blockUiService.spinnerConfig.unBlockUI();
        this.blockUiService.spinnerConfig.stopChainAfterThisCall();
      if (response && !response.error && response.data) {
        this.subscriptionList = response.data;
        this.subscriptionIdList = this.subscriptionList.map(a => a.subscriptionId); // set subscription Id's form list
        if(this.renewalSubscriptionService.selectSubsriptionReponse && this.renewalSubscriptionService.selectSubsriptionReponse.subscriptionMap){
          this.checkAndSetSelectedSubs(this.subscriptionIdList, this.renewalSubscriptionService.selectedSubscriptions, this.renewalSubscriptionService.selectSubsriptionReponse.subscriptionMap);
        }
        if(this.subscriptionList.length > 0 && this.renewalSubscriptionService.selectedSubscriptions.length > 0){
          this.setSelectedSubscriptions(this.subscriptionList,this.renewalSubscriptionService.selectedSubscriptions);
        }
        //this.isSubscriptionListLoaded = true;
      } else {
        if(!response.error && !response.data){
          if(this.renewalSubscriptionService.selectSubsriptionReponse && this.renewalSubscriptionService.selectSubsriptionReponse.subscriptionMap){
            this.checkAndSetSelectedSubs(this.subscriptionIdList, this.renewalSubscriptionService.selectedSubscriptions, this.renewalSubscriptionService.selectSubsriptionReponse.subscriptionMap);
          }
        }
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // method to set selected subscriptions from existed subscriptions list
  selectSubscription(subs){
    this.selectedSubscriptions = [];
    if(subs.length > 0){
      for(const data of subs){ // check and set the selected subs from the list
        if(data.selected){
          this.selectedSubscriptions.push(data.subscriptionId);
        } else {

        }
      }
    }
    // console.log(this.selectedSubscriptions);
  }

  // check and set selected subs from renewal response and show in list
  checkAndSetSelectedSubs(subsIds, selectedSubIds, selectedSubscriptionList){
    this.renewalSubscriptionService.selectedSubscriptions = this.renewalSubscriptionService.selectSubsriptionReponse.subscriptionRefIds;
    if(subsIds.length > 0){
      for(const data of selectedSubIds){
        if(!subsIds.includes(data)){
          // for(const sub of selectedSubscriptionList){
          //   if(sub.subRefId === data){
          //     sub.selected = true;
          //     this.subscriptionList.push(sub);
          //   }
          // }
          if(selectedSubscriptionList[data]){
            this.subscriptionList.push(selectedSubscriptionList[data][0]);
          }
        }
      }
    } else { // if no subs present push the selected subs into existing list
      for(const data of selectedSubIds){
        this.subscriptionList.push(selectedSubscriptionList[data][0]);
      }
      this.setSelectedSubscriptions(this.subscriptionList,this.renewalSubscriptionService.selectedSubscriptions);
      // this.subscriptionList = selectedSubscriptionList;
    }
    return;
  }


  // method to continue to next page
  continueToParameter() {
    const reqObj = {'dealId' : this.qualService.qualification.dealId+'',
                    'qualId': this.qualService.qualification.qualID}
    reqObj['subscriptionRefIds'] = this.selectedSubscriptions;


    this.renewalSubscriptionService.renewalSubscription(reqObj).subscribe((res: any) => {
      if(res && !res.error && res.data){ // check if no error and data present then continue to next page
        this.renewalSubscriptionService.selectSubsriptionReponse = res.data;
        //set renewal ID in session object.   
        const sessionObject: SessionData = this.appDataService.getSessionObject();
        sessionObject.renewalId = res.data.renewalId;
        this.appDataService.setSessionObject(sessionObject);
        this.renewalSubscriptionService.selectedSubscriptions = this.selectedSubscriptions;
        if(this.renewalSubscriptionService.selectSubsriptionReponse.type ===  ConstantsService.EARLY_FOLLOWON && res.data.earlyRenewalException && !this.alreadyHasEarlyRenewal){
          const modalRef = this.modalVar.open(EarlyRenewalApprovalComponent, { windowClass: 'early-renewal-modal' }); //replace class re-open with early-renewal-modal
          modalRef.componentInstance.message = this.localeService.getLocalizedMessage('renewal.APPROVAL.TWELVE_MONTHS')
          modalRef.result.then((result) => {
            if(result && result.continue){
              this.roadMap.eventWithHandlers.continue();
            }
          });
        } else {
          this.roadMap.eventWithHandlers.continue();
        }
      } else {
        this.renewalSubscriptionService.selectSubsriptionReponse = {};
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // this.roadMap.eventWithHandlers.continue();
  }

  // method to set selected subscriptions in existing list
  setSelectedSubscriptions(subscriptionList, selectedSubscriptions){
    for(const data of subscriptionList){
      if(selectedSubscriptions.includes(data.subscriptionId)){
        data.selected = true;
      }
    }
  }

  // method to go to qualification
  goToQual(){
    this.router.navigate(['qualifications/' + this.qualService.qualification.qualID]);
  }

  fetchRenewals(renewalId) {
    this.renewalSubscriptionService.fetchRenewals(renewalId).subscribe((res: any) => {
      if (res && !res.error && res.data) { // check if no error and data present then continue to next page
        this.renewalSubscriptionService.selectSubsriptionReponse = res.data;
        this.renewalSubscriptionService.selectedSubscriptions = res.data.subscriptionRefIds;
        this.alreadyHasEarlyRenewal = this.renewalSubscriptionService.selectSubsriptionReponse.type === ConstantsService.EARLY_FOLLOWON ?  true: false;  
        this.getSubscriptionList();
      } else {
        // this.renewalSubscriptionService.selectSubsriptionReponse = {};
        this.messageService.displayMessagesFromResponse(res);
      }
    });
    // this.roadMap.eventWithHandlers.back();
  }
}
