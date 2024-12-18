import { Component, OnInit, Input, Output, EventEmitter, Renderer2  } from '@angular/core';
import { LookupSubscriptionComponent } from '@app/modal/lookup-subscription/lookup-subscription.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap' ;
import { ProposalDataService } from '../proposal.data.service';
import { CreateProposalService } from '../create-proposal/create-proposal.service';
import { MessageService } from '@app/shared/services/message.service';
import { AppDataService } from '@app/shared/services/app.data.service';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { LocaleService } from '@app/shared/services/locale.service';
@Component({
  selector: 'app-coterm-subscription',
  templateUrl: './coterm-subscription.component.html',
  styleUrls: ['./coterm-subscription.component.scss']
})
export class CotermSubscriptionComponent implements OnInit {

  @Input() subscriptionList = [];
  @Input() createProposalPage = false;
  @Input() createQualPage = false; // to check if its from qualification level
  @Input() initiateRenewalPage = false;
  @Output() selectedSub = new EventEmitter();
  @Output() continueWithSlectedSubId = new EventEmitter();
  @Output() selectedSubForRenewal = new EventEmitter();
  @Output() selectedSubForRenewaFromLookUp = new EventEmitter();
  selectedSubId = '';
  subscriptionId = '';
  subscriptionObj: any;
  subscriptionData: any = [];
  isSubscriptionSelected = false;
  isSubscriptionListLoaded = false;
  selectedSubscription = {};
  noDataFound = false;
  displayLookupModal = false;
  @Input() readOnlyMode = false;
  isSubCustmerMacthing = false; // to set in customer is matching 
  subscriptionsDataObj: any; // to store response from lookup subscription
  selectedSubscriptionsForRenewal = []; // to store selected subs for renewal flow
  @Input() subscriptionIdList = []; // set priceList Id of existed subscriptions list
  lookedUpSubscriptionData: any = {};
  @Input() isRenewalParamFlow = false; // set if coterm used for renewal param flow
  isSubAlreadyPresent = false; // set if lookup with subId in existing list
  constructor(public appDataService: AppDataService, public renderer: Renderer2 ,private modalVar: NgbModal, public proposalDataService: ProposalDataService,  private createProposalService: CreateProposalService, private messageService: MessageService, public utilitiesService: UtilitiesService, private qualService: QualificationsService, public localeService: LocaleService) { }

  ngOnInit() {
    if(!this.createProposalPage && this.proposalDataService.proposalDataObject.proposalData.coTerm.coTerm){
      this.selectedSubId = this.proposalDataService.proposalDataObject.proposalData.coTerm.subscriptionId;
    }
  }

  lookupSubscriptionModal() {
    this.displayLookupModal = true;
    this.subscriptionId = '';
    this.selectedSubId = '';
    this.isSubCustmerMacthing = false;
    this.subscriptionData = [];
    this.isSubscriptionListLoaded = false;
    this.noDataFound = false;
    this.lookedUpSubscriptionData = {};
    this.selectedSub.emit('deselect');
    // const modalRef = this.modalVar.open(LookupSubscriptionComponent, { windowClass: 'lookup-subscription' });
    // modalRef.result.then((result) => {
    //   if (result.continue === true) {
        //this.selectSubscription();
    //     this.selectedSub.emit(result.dataObj);
    //   }
    // });
  }

  selectSubscription(SubList, sub, input){
    this.selectedSubId = sub.subscriptionId;
    if(this.initiateRenewalPage){ // if renewals set the selected sub to true
      sub.selected = true;
      this.selectedSubForRenewal.emit(SubList);
      this.hideLookup();
    } else if (input === "list" || (input ==='lookUp' && !this.createQualPage)) {
      this.selectedSub.emit(sub);
      this.hideLookup();
    }
  }

  // method to select/deselect subscriptions from Lookup
  subscriptionsSelectForRenewalFromLookUp(SubList,sub, input, type){
    if(type === 'deselect'){
      this.selectedSubId = '';
      sub.selected = false;
      if(this.subscriptionList.length > 0){
        this.checkDeselectionForRenewalLookUp(SubList,sub, input, type);
      }
    } else {
      this.selectedSubId = sub.subscriptionId;
      sub.selected = true;
      if(this.subscriptionList.length > 0) {
        this.checkSelectionForRenewalLookUp(SubList,sub, input, type);
      } else { // check for existing Sub Id and push if not present
        this.subscriptionIdList.push(sub.subscriptionId);
        this.subscriptionList.push(sub);
      }
    }
    this.selectedSubForRenewal.emit(this.subscriptionList);
  }

  deselectSubscription(SubList, sub, input) {
    this.selectedSubId = '';
    if(this.initiateRenewalPage && sub.selected){ // if deselected, make deslected sub to false
      sub.selected = false;
      this.selectedSubForRenewal.emit(SubList);
    } else if (input === "list" || (input ==='lookUp' && !this.createQualPage)){
      this.subscriptionId = '';
      this.selectedSub.emit('deselect');
    }
  }

  onClickOutside(){
    if(!this.createQualPage && !this.initiateRenewalPage){
      this.hideLookup();
    }
  }

  hideLookup(){
    this.subscriptionId = '';
    this.displayLookupModal = false;
    this.subscriptionData = [];
    this.noDataFound = false;
    this.lookedUpSubscriptionData = {};
    this.isSubscriptionListLoaded = false;
    this.isSubAlreadyPresent = false
  }
  subscriptionLookup(){
    if(this.subscriptionId.trim().length === 0){
      return;
    }
    //this.subscriptionObj = {};
    this.subscriptionData = [];
    this.lookedUpSubscriptionData = {};
    this.subscriptionId = this.utilitiesService.removeWhiteSpace(this.subscriptionId);
    if(this.subscriptionIdList.length > 0 && (this.isRenewalParamFlow || this.appDataService.isRenewal)){
      this.checkSubFromLookUpForRenewal(this.subscriptionId, this.subscriptionIdList); // check if renewal param flow and SubIdList is not empty and set isSubAlreadyPresent
    } else {
      this.isSubAlreadyPresent = false;
    }
    if(!this.isSubAlreadyPresent){ // call the api only id lookedup sub is not present in the existing subsList
      this.createProposalService.subscriptionLookup(this.subscriptionId , this.createQualPage , this.initiateRenewalPage).subscribe((res: any) => {
        if (res && !res.error && res.data) {
          this.subscriptionsDataObj = res.data;
          //this.subscriptionObj = res.data;
          this.checkSubscriptionValidity(res.data);
          if(res.data.subscriptions){
            this.subscriptionData = res.data.subscriptions;
            this.lookedUpSubscriptionData = this.subscriptionData[0];
          } else {
            this.subscriptionData = [];
          }
          this.isSubscriptionListLoaded = true;
          this.noDataFound = false
        } else {
          if((!res.error && !res.data) || this.createQualPage){
            this.noDataFound = true;
          }
          this.subscriptionData = [];
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    }
    
  }

  // method to check lookedUp Sub with the existing subList and set isSubAlreadyPresent
  checkSubFromLookUpForRenewal(subId, subIdList){
    if(subIdList.includes(subId)){
      this.isSubAlreadyPresent = true;
    } else {
      this.isSubAlreadyPresent = false;
    }
    return;
  }

  focusSubIdInput(val) {
    const element = this.renderer.selectRootElement('#'+ val);
    element.focus();
  }

  updateLookUpSubscription(event){
    // this.subscriptionData = []
    // this.subscriptionObj = this.selectedSubscription = {};
    // this.isSubscriptionSelected = false;
    // this.isSubscriptionListLoaded = false;
    // this.noDataFound = false;
    this.selectedSubId = '';
    this.isSubCustmerMacthing = false;
    this.subscriptionData = [];
    this.isSubscriptionListLoaded = false;
    this.noDataFound = false;
    this.lookedUpSubscriptionData = {};
    this.isSubAlreadyPresent = false
  }

  // method to check if lookedup subId macthes or not
  checkSubscriptionValidity(dataObj) {
    if (dataObj.customerMatched) {
      this.isSubCustmerMacthing = true;
    } else {
      this.isSubCustmerMacthing = false;
    }
    // this.isSubCustmerMacthing = true;
  }

  // afte selecting subId from list emit to call api and continue to SubUi page
  continueWithSubId() {
    this.continueWithSlectedSubId.emit(this.selectedSubId);
  }

  // method to check and set selected sub in the existing list
  checkSelectionForRenewalLookUp(SubList, sub, input, type){
    for(const data of this.subscriptionList){
      if(data.subscriptionId === sub.subscriptionId){
        data.selected = true;
        return;
      } else if(!this.subscriptionIdList.includes(sub.subscriptionId)) {
        sub.selected = true;
        this.subscriptionIdList.push(sub.subscriptionId);
        this.subscriptionList.push(sub);
        return;
      }
    }
  }

   // method to check and deselect sub from lookup
  checkDeselectionForRenewalLookUp(SubList, sub, input, type){
    for(const data of this.subscriptionList){
      if(data.subscriptionId === sub.subscriptionId){
        data.selected = false;
        return;
      } // code to remove deselected one from list
    }
  }
  
  continueWithSelectedSubFromLookUp(){
    if(this.initiateRenewalPage && this.isSubCustmerMacthing){
      if(this.subscriptionList.length > 0) {
        this.checkSelectionForRenewalLookUp(this.subscriptionData,this.lookedUpSubscriptionData, 'lookup', 'select');
      } else { // check for existing Sub Id and push if not present
        this.lookedUpSubscriptionData.selected = true;
        this.subscriptionIdList.push(this.lookedUpSubscriptionData.subscriptionId);
        this.subscriptionList.push(this.lookedUpSubscriptionData);
      }
      this.selectedSubForRenewal.emit(this.subscriptionList);
    }
    this.displayLookupModal = false;
  }
}
