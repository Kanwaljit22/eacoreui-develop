import { Router } from '@angular/router';
import { ProjectService } from './../project/project.service';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { EaRestService } from 'ea/ea-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { EaService } from 'ea/ea.service';
import { ProposalStoreService, IRenewalSubscription } from 'vnext/proposal/proposal-store.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { VnextService } from 'vnext/vnext.service';
import { CreateProposalStoreService } from 'vnext/proposal/create-proposal/create-proposal-store.service';
import { EaStoreService } from 'ea/ea-store.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SelectAQuoteComponent } from 'vnext/modals/select-a-quote/select-a-quote.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import cloneDeep from 'lodash/cloneDeep';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-renewal',
  templateUrl: './renewal.component.html',
  styleUrls: ['./renewal.component.scss']
})
export class RenewalComponent implements OnInit, OnDestroy {
  otherSubscriptions = [];
  renewalSubscriptions = [];
  isLoccDone = false;
  subscriptionsList: IRenewalSubscription[] = [];
  selectedSubRefIds = [];
  existingSubscriptions = false;
  justification = '';
  hasCollab = false;
  showLoccWarning = false;
  enableContinue = false;
  displayEndDateMsg = false;
  isExistingSubscriptionSelected = false;
  searchedSubscription: IRenewalSubscription = undefined;
  searchedSubscriptions = [];
  public subscribers: any = {};
  redactedSmartAccount = false;
  searchDropdownArray = [
    {
      "id": "SubscriptionId",
      "name": "Subscription ID"
    }
  ];
  searchPlaceHolder = this.localizationService.getLocalizedString('common.SUBSCRIPTION_ID');
  noSubscriptionFoundMsg = '';
  subUiUrl = '';
  isHybridOfferQnaSelected = false; // set if any of the answers selected for 2nd qna
  hybridOfferSubsciptions = false; // set if hybrid option selected or not
  collabSelectedList = []; // to store the selected collab subscriptions
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    windowClass: "selectQuote"
  };
  selectedOverlapSubscriptions = [];
  fullOverlapIds = false;
  showMseaWarning = false;
  displaySearchedSubscriptions = false;
  selectedSubsPartnerDifferentThanDeal = []; // set subs which are selected and has PartnerDifferentThanDeal: true

  constructor(public projectStoreService: ProjectStoreService, private projectService: ProjectService,  private eaRestService: EaRestService,
    private messageService: MessageService, public eaService: EaService, public proposalStoreService: ProposalStoreService, public elementIdConstantsService: ElementIdConstantsService,
    public localizationService: LocalizationService, public vnextService: VnextService, private router: Router, public createProposalStoreService: CreateProposalStoreService, 
    public eaStoreService: EaStoreService,private modalVar: NgbModal, private vnextStoreService: VnextStoreService, public dataIdConstantsService: DataIdConstantsService, private constantsService: ConstantsService) { }

  ngOnInit(): void {

   
    this.eaStoreService.pageContext = this.eaStoreService.pageContextObj.RENEWAL_SUBSCRIPTION_PAGE;
    this.eaStoreService.editName = false;
    // check for projectId in session and load project data 
    if(sessionStorage.getItem('projectId')){
      this.eaStoreService.projectId = sessionStorage.getItem('projectId');
      sessionStorage.removeItem('projectId');
      this.getProjectData(this.eaStoreService.projectId);
    } else {
      if (!this.projectStoreService.projectData.objId) {

        const projectData = JSON.parse(sessionStorage.getItem('projectData'));
        if (projectData) {
          this.projectStoreService.projectData = projectData;
          //if (this.eaService.features.CHANGE_SUB_FLOW){
            this.eaStoreService.changeSubFlow = projectData?.changeSubscriptionDeal ? true : false;
          //}
          this.projectService.setProjectPermissions(projectData.permissions);
          sessionStorage.removeItem('projectData');
        }
        if (!this.proposalStoreService.proposalData.objId && sessionStorage.getItem('proposalData')) {
          this.proposalStoreService.proposalData = JSON.parse(sessionStorage.getItem('proposalData'));
          sessionStorage.removeItem('proposalData');
        }
        if(sessionStorage.getItem('renewalId')){
          this.createProposalStoreService.renewalId = JSON.parse(sessionStorage.getItem('renewalId'));
        }
        if(sessionStorage.getItem('renewalJustification')){
          this.createProposalStoreService.renewalJustification = sessionStorage.getItem('renewalJustification');
        }
        if(sessionStorage.getItem('hybridSelected')) {
          const hybridSelected = sessionStorage.getItem('hybridSelected');
          this.createProposalStoreService.hybridSelected = (hybridSelected && hybridSelected === 'true') ? true : false;
          sessionStorage.removeItem('hybridSelected');
        }
      }
      this.openQuoteSelection();
      this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
      this.loadData();
    } 

    this.isLoccDone = this.projectStoreService.projectData.loccDetail?.loccSigned
  }

  getAvailableSubscriptionsList(){
    let url = 'subscription?a=CAV-SUBSCRIPTIONS&p=' + this.projectStoreService.projectData.objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => { 
      if (this.eaService.isValidResponseWithoutData(response)){
        this.renewalSubscriptions = response.data || [];
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }


  // get projectData if coming from dashboard
  getProjectData(objId) {
    const url  =  'project/' + objId;
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.projectStoreService.projectData = response.data;
        this.openQuoteSelection();
        if (this.projectStoreService.projectData.loccDetail) {
          this.vnextStoreService.loccDetail = this.projectStoreService.projectData.loccDetail
        }
        this.projectService.setProjectPermissions(response.data.permissions);
        this.eaService.getFlowDetails(this.eaStoreService.userInfo,this.projectStoreService.projectData.dealInfo);
        //if (this.eaService.features.CHANGE_SUB_FLOW){
          this.eaStoreService.changeSubFlow = this.projectStoreService.projectData?.changeSubscriptionDeal ? true : false;
       // }
        this.loadData();
      } else {
        // to show error messages if any
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // to load data
  loadData(){
    this.eaService.isSpnaFlow = (this.projectStoreService.projectData?.buyingProgram === 'BUYING_PGRM_SPNA' && this.eaService.features.SPNA_REL) ? true : false;
    // check if either proposal data present or user has edit access and project is completed -- load renewal page else route to project page
    if (this.proposalStoreService.proposalData.objId || ( ((!this.eaService.features?.PARTNER_SUPER_USER_REL && this.projectStoreService.projectEditAccess) || (this.eaService.features?.PARTNER_SUPER_USER_REL && this.projectStoreService.proposalCreateAccess)) && this.projectStoreService.projectData.status === 'COMPLETE' && !((this.eaService.isDistiOpty && this.eaService.isResellerLoggedIn) || (this.eaService.isDistiLoggedIn && this.eaService.isResellerOpty)))) {
      if (this.eaStoreService.changeSubFlow){
        this.router.navigate(['ea/project/proposal/createproposal']);
      } else {
        this.loadRenewalPage();
      }
    } else {
      this.redirectToProject();
    }
  }

  // to redirect to project page if access not presenet or project is not completed
  redirectToProject(){
    this.router.navigate(['ea/project/' + this.projectStoreService.projectData.objId]);
  }

  loadRenewalPage(){
    this.vnextService.isRoadmapShown = true;
    this.vnextService.hideProposalDetail = false;
    this.vnextService.roadmapStep = 1; 
    this.subscribers.roadmapSubject = this.vnextService.roadmapSubject.subscribe((value:any) => {
      if (this.proposalStoreService.proposalData.status === 'COMPLETE' || (this.proposalStoreService.proposalData.objId && value.id === 3)) {
        this.cleanUp();
        this.vnextService.redirectTo(value, 'renewal');
      } else if (value.id === 0) {
        this.cleanUp();
        this.vnextService.redirectTo(value);
      }
    })
   
    //if (this.eaService.isFeatureEnbled){
      if(this.proposalStoreService.proposalData.objId){
        if(this.proposalStoreService.proposalData.renewalInfo?.id){
          this.existingSubscriptions = true;
          // check and set isHybridOfferSubsciptionsSelected and hybridOfferSubsciptions
          this.isHybridOfferQnaSelected = true;
          this.hybridOfferSubsciptions = this.proposalStoreService.proposalData.renewalInfo.hybrid ? true : false;
          this.getSubscriptionsList();
          this.justification = this.proposalStoreService.proposalData.subscriptionInfo.justification
        } else if(this.proposalStoreService.proposalData.subscriptionInfo?.justification){
          this.existingSubscriptions = true;
          // check and set isHybridOfferSubsciptionsSelected and hybridOfferSubsciptions
          this.isHybridOfferQnaSelected = true;
          this.hybridOfferSubsciptions = this.proposalStoreService.proposalData.renewalInfo?.hybrid ? true : false;
          this.justification = this.proposalStoreService.proposalData.subscriptionInfo.justification
        }
      } else if(this.createProposalStoreService.renewalId){
        this.existingSubscriptions = true;
        this.isExistingSubscriptionSelected = true;
        // check and set isHybridOfferSubsciptionsSelected and hybridOfferSubsciptions
        this.isHybridOfferQnaSelected = true;
        this.hybridOfferSubsciptions = this.createProposalStoreService.hybridSelected;
        this.justification = this.createProposalStoreService.renewalJustification;
        this.getSubscriptionsList();
        if(this.eaService.features.RENEWAL_SEPT_REL){ this.getAvailableSubscriptionsList(); }
      } else if(this.createProposalStoreService.renewalJustification){
        this.justification = this.createProposalStoreService.renewalJustification;
        this.existingSubscriptions = true;
        this.isExistingSubscriptionSelected = true;
        // check and set isHybridOfferSubsciptionsSelected and hybridOfferSubsciptions
        this.isHybridOfferQnaSelected = true;
        this.hybridOfferSubsciptions = this.createProposalStoreService.hybridSelected ? true : false;
      }
    
    // if spna flow disable renewal selection
    if(this.eaService.isSpnaFlow && this.eaService.features.SPNA_REL){
      this.existingSubscriptions = false;
      this.isExistingSubscriptionSelected = true;
      this.hybridOfferSubsciptions = false;
      this.isHybridOfferQnaSelected = false;
      this.resetSubsciptionsList();
    } 
  }

  ngOnDestroy() {
    if(this.subscribers.roadmapSubject){
      this.subscribers.roadmapSubject.unsubscribe();
    }
    this.eaStoreService.pageContext = '';
    this.eaStoreService.editName = false;
    // this.eaStoreService.projectId = '';
  }
  getSubscriptionsList(){
    let url = 'subscription?a=ALL-SUBSCRIPTION&p=' + this.projectStoreService.projectData.objId + '&type=bf-migration';
    if(this.proposalStoreService.proposalData.renewalInfo?.id){
      url = url + '&renewalId=' + this.proposalStoreService.proposalData.renewalInfo.id + '&proposalObjId=' + this.proposalStoreService.proposalData.objId
    } else if(this.createProposalStoreService.renewalId){
      url = url + '&renewalId=' + this.createProposalStoreService.renewalId;
    }
    url = this.appendQuoteId(url);
   
    //const url = 'assets/vnext/subscriptions.json';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.eaService.isValidResponseWithData(response)){
        //if (this.eaService.isFeatureEnbled){
        if (!this.proposalStoreService.proposalData.renewalInfo?.id) {
          this.subscriptionsList = (response.data.subscriptions && !this.hybridOfferSubsciptions) ? response.data.subscriptions : [];
          this.otherSubscriptions = (response.data.subscriptions && !this.hybridOfferSubsciptions) ? response.data.subscriptions : [];
        } else {
            this.checkandSelectSusbscriptions(response.data?.subscriptions);
        }
        // } 
        // else {
        //   this.subscriptionsList = response.data.subscriptions ? response.data.subscriptions : [];
        // }
        if(response.data.selectedSubRefIds){
          this.selectedSubRefIds = response.data.selectedSubRefIds;
          if (this.createProposalStoreService?.renewalId) {
            this.selectAlreadySelectedSubsc()
          }
        }
        // if(this.selectedSubRefIds.length && this.proposalStoreService.proposalData.objId){
        //   this.existingSubscriptions = true;
        // }
        // if renewalid present with no subs from list, search and set selected subs into the list
        if((this.createProposalStoreService.renewalId || this.proposalStoreService.proposalData.renewalInfo?.id) && !this.eaService.features.RENEWAL_SEPT_REL) {
          this.getAndSetSelectedSubscriptions(this.selectedSubRefIds);
        }
      } else {
        this.messageService.displayMessagesFromResponse(response);
      }
      this.setSelectedSubscriptions();
      if (this.projectStoreService.projectData.loccDetail && !this.projectStoreService.projectData.loccDetail.loccSigned) {
        this.showLoccWarning = true;
      } else {
        this.showLoccWarning = false;
      }
    });
  }

  selectAlreadySelectedSubsc() {
    if (this.renewalSubscriptions.length) {
      this.renewalSubscriptions.forEach((sub) => {
        sub.selected = (this.selectedSubRefIds.includes(sub.subRefId)) ? true : false;
      })
    }
  }

  checkandSelectSusbscriptions(subscriptions) {
    if (subscriptions && subscriptions.length) {
      subscriptions.forEach(sub => {
        sub.selected = true;
        if (sub.masterAgreementId) {
          this.renewalSubscriptions.push(sub)
        } else {
          this.otherSubscriptions.push(sub)
        }
      });
    }
  }

  // method to get and set searched subscription that are already selected into list
  getAndSetSelectedSubscriptions(selectedSubRefIds) {
    if(!this.subscriptionsList.length){
      for(let subId of selectedSubRefIds){
        this.getSearchedSubscription(subId, true);
      }
    } else {
      for (let subId of this.selectedSubRefIds) {
        if(!this.subscriptionsList.find(sub => sub.subRefId === subId)) {
          this.getSearchedSubscription(subId, true);
        }
      }
    }
  }

  setSelectedSubscriptions(){
    if(this.selectedSubRefIds.length){
      for(const subscription of this.subscriptionsList){
        if(this.selectedSubRefIds.includes(subscription.subRefId)){
          subscription.selected = true;
        }
      }
    }
  }

  selectSubcription(subscription, $event){
    // if(subscription.hasCollab){
      
    //   if(this.hasCollab){
    //     if($event.target.checked){
    //       $event.target.checked = false;
    //       return;
    //     }
    //   } else {
    //     this.hasCollab = true;
    //   }
    // }
    subscription.selected = $event.target.checked;
    const index = this.selectedSubRefIds.indexOf(subscription.subRefId);
    if(index > -1){
      this.selectedSubRefIds.splice(index, 1);
      if(this.hasCollab){
        this.hasCollab = false;
      }
    } else {
      this.selectedSubRefIds.push(subscription.subRefId);
    }

    // if collab sub, check and set/remove selected sub
    if (subscription.hasCollab) {
      this.checkForCollabSelection(subscription);
    }
    this.checkOnTimeSubEndDate();
    if(!this.selectedSubRefIds.length){
      this.collabSelectedList = [];
    }
  }

  // check fif collab sub selected
  checkForCollabSelection(subscription) {
    const index = this.collabSelectedList.indexOf(subscription.subRefId);
    if (index > -1) {
      this.collabSelectedList.splice(index, 1);
    } else {
      this.collabSelectedList.push(subscription.subRefId);
    }
  }
  
  handleSubscriptionChecked(subscription) {
    this.fullOverlapIds = false;
      this.isExistingSubscriptionSelected = true;
      if(subscription.selected){
        if( !this.selectedSubRefIds.includes(subscription.subRefId)){
          this.selectedSubRefIds.push(subscription.subRefId);
        }
        if ((subscription.partiallyOverlappingSubRefIds && subscription.partiallyOverlappingSubRefIds.length) || (subscription.fullyOverlappingSubRefIds && subscription.fullyOverlappingSubRefIds.length)) {
          const value = this.selectedOverlapSubscriptions.find(sub => sub.subRefId === subscription.subRefId)
          if(!value){
            this.selectedOverlapSubscriptions.push(subscription);
          }
        }
        if (subscription?.partnerDifferentThanDeal) {
          const value = this.selectedSubsPartnerDifferentThanDeal.find(sub => sub.subRefId === subscription.subRefId)
          if(!value){
            this.selectedSubsPartnerDifferentThanDeal.push(subscription);
          }
        }
      } else {
        this.selectedSubRefIds = this.selectedSubRefIds.filter(item => item !== subscription.subRefId);
        this.selectedOverlapSubscriptions = this.selectedOverlapSubscriptions.filter(subsc =>  subsc.subRefId !== subscription.subRefId);
        this.selectedSubsPartnerDifferentThanDeal = this.selectedSubsPartnerDifferentThanDeal.filter(subsc =>  subsc.subRefId !== subscription.subRefId);
      }
      
      if (this.selectedOverlapSubscriptions.length) {
        this.selectedOverlapSubscriptions.forEach((sub) => {
          if(sub.partiallyOverlappingSubRefIds?.length){
            let allPartialOverLapIdSeleted = true;
            sub['showPartialOverLapMsg'] = false
            sub.partiallyOverlappingSubRefIds.forEach((id) => {
              const subId = this.selectedSubRefIds.find(subRefId => subRefId === id);
              if(!subId){
                allPartialOverLapIdSeleted = false
              }
            })
            if(!allPartialOverLapIdSeleted){
              sub['showPartialOverLapMsg'] = true
            }
          }
          if (sub.fullyOverlappingSubRefIds && sub.fullyOverlappingSubRefIds.length) {
            let allFullOverLapIdSeleted = true;
            sub['showFullOverlappingMsg'] = false
            sub.fullyOverlappingSubRefIds.forEach((id) => {
              const subId = this.selectedSubRefIds.find(subRefId => subRefId === id);
              if(!subId){
                allFullOverLapIdSeleted = false
              }
            })
            if(!allFullOverLapIdSeleted){
              sub['showFullOverlappingMsg'] = true
              this.fullOverlapIds = true;
            }else {
              this.fullOverlapIds = false;
            }
            
          }
        })
      }
      this.checkMseaSubscription();
  }

  checkMseaSubscription() { 
    this.showMseaWarning = false;
    this.renewalSubscriptions.forEach((sub) => {
      if (sub.selected && sub.buyingProgramTransactionType === this.constantsService.MSEA) {
        this.showMseaWarning = true;
      }
    })
  }

  @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {
    sessionStorage.setItem(
      'projectData',
      JSON.stringify(this.projectStoreService.projectData));
      if(this.proposalStoreService.proposalData.objId) {
        sessionStorage.setItem('proposalData', JSON.stringify(this.proposalStoreService.proposalData));
      }
      if(this.createProposalStoreService.renewalId){
        sessionStorage.setItem('renewalId', JSON.stringify(this.createProposalStoreService.renewalId));
      }
      if(this.createProposalStoreService.hybridSelected){
        sessionStorage.setItem('hybridSelected', JSON.stringify(this.createProposalStoreService.hybridSelected));
      }
      if(this.createProposalStoreService.renewalJustification){
        sessionStorage.setItem('renewalJustification', this.createProposalStoreService.renewalJustification);
      }
      if(this.projectStoreService.projectData.dealInfo){
        sessionStorage.setItem('dealId', this.projectStoreService.projectData.dealInfo.id);
      }
  }

  createSubscription() {
    this.cleanUp();
    if (this.justification){
      this.justification = this.justification.trim();
    }
    //if(this.eaService.isFeatureEnbled){
      if (this.proposalStoreService.proposalData.objId){
        this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
      } else if (this.isHybridOfferQnaSelected && this.selectedSubRefIds.length) {  
        if(this.justification){
          this.createProposalStoreService.renewalJustification = this.justification;
        }    
        let reqObj = {
          data: {
            projectObjId: this.projectStoreService.projectData.objId,
            subscriptionInfo: {
              existingCustomer: this.justification ? true : false,
              justification: this.justification ? this.justification : null
            }
          }
        };
        
        if (this.selectedSubRefIds.length) {
          reqObj.data['subRefIds'] = this.selectedSubRefIds;
        }
        // set hybrid flag in the request
        reqObj.data['hybrid'] = this.hybridOfferSubsciptions;
        const url = 'subscription?a=SAVE-RENEWAL&type=bf-migration'; 
        this.eaRestService.postApiCall(url, reqObj).subscribe((response: any) => {
          if (this.eaService.isValidResponseWithData(response)) {
            this.createProposalStoreService.renewalId = response.data.id;
            this.createProposalStoreService.hybridSelected = this.hybridOfferSubsciptions;
            this.router.navigate(['ea/project/proposal/createproposal']);
          } else {
            this.messageService.displayMessagesFromResponse(response);
          }
        });
      } else {
        if (this.justification && this.isHybridOfferQnaSelected) {
          this.createProposalStoreService.renewalJustification = this.justification;
          this.createProposalStoreService.hybridSelected = this.hybridOfferSubsciptions;
        }
        this.router.navigate(['ea/project/proposal/createproposal']);
      }

    
  }

  checkOnTimeSubEndDate() {
    let endDateStr;
    let isEarly = false;
    for (let sub of this.subscriptionsList) {
      if (sub.selected) {
        if (sub.typeDesc === 'Early') {
          isEarly = true;
          break;
        }
        if (endDateStr && endDateStr !== sub.endDateStr) {
          this.displayEndDateMsg = true;
        } else {
          this.displayEndDateMsg = false;
        }
        endDateStr = sub.endDateStr;
      }
    }
    if(isEarly) {
      this.displayEndDateMsg =false;
    }
  }

  searchSubscription(event) {
    if (event && event.value) {
      let val = event.value.trim();
      if (!this.eaService.features.RENEWAL_SEPT_REL) {
        val = val.substr(3);
        val = 'Sub' + val;
      }
      this.getSearchedSubscription(val);
     event.value = undefined;
    } else {
      this.noSubscriptionFoundMsg = '';
      this.searchedSubscription = undefined;
      this.messageService.clear();
    }
  }


  getSearchedSubscription(subId, searchAndAddSub?){
    this.redactedSmartAccount = false;
    this.noSubscriptionFoundMsg = '';
    this.searchedSubscription = undefined;
    let url;
    if (this.hybridOfferSubsciptions) {
      url = 'subscription/search/'+subId+'?p='+this.projectStoreService.projectData.objId+'&type=bf-migration' + '&hybrid='+ this.hybridOfferSubsciptions;
    } else {
      url = 'subscription/search/'+subId+'?p='+this.projectStoreService.projectData.objId+'&type=bf-migration'
    }
    url = this.appendQuoteId(url);
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
        this.displaySearchedSubscriptions = true;
        if (this.vnextService.isValidResponseWithData(response)) {
          if (response.data.subscriptions) {
            if(this.eaService.features.RENEWAL_SEPT_REL){
            this.searchedSubscriptions = response.data.subscriptions;
            } else {
              this.searchedSubscription = response.data.subscriptions[0];
            }
            // this.renewalSubscriptions = response.data.subscriptions;
            if(!this.eaService.features.RENEWAL_SEPT_REL && this.projectStoreService.projectData.smartAccount?.smrtAccntName 
              && this.projectStoreService.projectData.smartAccount.smrtAccntName !== this.searchedSubscription.smartAccountName){
                this.redactedSmartAccount = true;
            }
            
            this.noSubscriptionFoundMsg = '';
            // check and get searched sub if selected already and renwal id present
            if(searchAndAddSub){
              this.addSubscription();
            }
          } else {
            this.noSubscriptionFoundMsg = this.localizationService.getLocalizedString('renewal.NO_SEARCHED_SUBSCRIPTIONS_FOUND_MSG');
          }
        } else {
          this.messageService.displayMessagesFromResponse(response);
          // window.scrollTo(0, 0);
        }
      });
  } 

  addSubscription(){
    let subcriptionPresent = false;
    for(let i=0;i<this.subscriptionsList.length;i++){
        if(this.subscriptionsList[i].subRefId === this.searchedSubscription.subRefId){
          subcriptionPresent = true;
          this.subscriptionsList[i].selected = true;
          if (!this.selectedSubRefIds.includes(this.searchedSubscription.subRefId)){
            this.selectedSubRefIds.push(this.searchedSubscription.subRefId);
            if(this.searchedSubscription.hasCollab){
              this.checkForCollabSelection(this.searchedSubscription);
            }
          }
          break;
        }
    }
    if(!subcriptionPresent){
      this.searchedSubscription.selected = true;
      this.subscriptionsList.push(this.searchedSubscription);
      if (!this.selectedSubRefIds.includes(this.searchedSubscription.subRefId)){
        this.selectedSubRefIds.push(this.searchedSubscription.subRefId);
      }
      if(this.searchedSubscription.hasCollab){
        this.checkForCollabSelection(this.searchedSubscription);
      }
    }
    this.searchedSubscription = undefined;
    this.projectService.clearSearchInput.next(true);
    this.checkOnTimeSubEndDate();
  }

  toggleDisplaySubscriptions(value){
    this.displaySearchedSubscriptions = value;
  }

  addSelectedSubscription(subscription) {
    if (subscription.ea3Subscription) {
      this.renewalSubscriptions = this.renewalSubscriptions || [];

      const existingSubscriptionIndex = this.renewalSubscriptions.findIndex(sub => sub.subRefId === subscription.subRefId);
      if (existingSubscriptionIndex !== -1) {
        let updatedSubscription = cloneDeep(this.renewalSubscriptions[existingSubscriptionIndex]);
  
        updatedSubscription.selected = true;
  
        this.renewalSubscriptions = [
          ...this.renewalSubscriptions.slice(0, existingSubscriptionIndex),
          updatedSubscription,
          ...this.renewalSubscriptions.slice(existingSubscriptionIndex + 1),
        ];
  
        this.handleSubscriptionChecked(updatedSubscription);
      } else {
        let updatedSubscription = cloneDeep(subscription);
        updatedSubscription.selected = true;
        this.renewalSubscriptions = [...this.renewalSubscriptions, updatedSubscription]; 
        this.handleSubscriptionChecked(updatedSubscription);
      }
    } else {
      this.otherSubscriptions = this.otherSubscriptions || [];

      const existingSubscriptionIndex = this.otherSubscriptions.findIndex(sub => sub.subRefId === subscription.subRefId);
      if (existingSubscriptionIndex !== -1) {
        let updatedSubscription = cloneDeep(this.otherSubscriptions[existingSubscriptionIndex]);
  
        updatedSubscription.selected = true;
  
        this.otherSubscriptions = [
          ...this.otherSubscriptions.slice(0, existingSubscriptionIndex),
          updatedSubscription,
          ...this.otherSubscriptions.slice(existingSubscriptionIndex + 1),
        ];
  
        this.handleSubscriptionChecked(updatedSubscription);
      } else {
        let updatedSubscription = cloneDeep(subscription);
        updatedSubscription.selected = true;
        this.otherSubscriptions = [...this.otherSubscriptions, updatedSubscription]; 
        this.handleSubscriptionChecked(updatedSubscription);
      }
    }
    this.displaySearchedSubscriptions = false;
  }

  selectExistingSubscription(event) {
    this.searchPlaceHolder = this.localizationService.getLocalizedString('common.SUBSCRIPTION_ID');
    this.isExistingSubscriptionSelected = true;
    this.existingSubscriptions = event.target.value === 'yes' ? true : false;
    this.resetSubsciptionsList();
    if ((!this.projectStoreService.projectData.scopeInfo.returningCustomer || (this.projectStoreService.projectData.scopeInfo?.returningCustomer && this.projectStoreService.projectData.scopeInfo?.newEaidCreated)) && this.existingSubscriptions && !this.subscriptionsList.length) {
      this.getSubscriptionsList();
      if(this.eaService.features.RENEWAL_SEPT_REL){ this.getAvailableSubscriptionsList(); }
    }
    this.projectService.clearSearchInput.next(true);
    if (this.noSubscriptionFoundMsg) {
      this.noSubscriptionFoundMsg = '';
    }
  }

  // method to show hybrid qna 
  showHybridOfferQna(event) {
    this.searchPlaceHolder = this.localizationService.getLocalizedString('common.SUBSCRIPTION_ID');
    this.isExistingSubscriptionSelected = true;
    this.existingSubscriptions = event.target.value === 'yes' ? true : false;
    this.hybridOfferSubsciptions = false;
    this.isHybridOfferQnaSelected = false;
    this.resetSubsciptionsList();
    if(this.existingSubscriptions){
      this.selectHybridOffer();
    }
  }

  // method to select hybrid offer qna 
  selectHybridOffer(event?){
    this.isExistingSubscriptionSelected = true;
    this.hybridOfferSubsciptions = event?.target?.value === 'yes' ? true : false;
    this.isHybridOfferQnaSelected = true;
    this.resetSubsciptionsList();
    if(this.eaService.features?.RENEWAL_SEPT_REL){
      if (!this.hybridOfferSubsciptions && !this.subscriptionsList.length) {
        this.getSubscriptionsList();
        this.getAvailableSubscriptionsList();
      }
    } else {
      if ((!this.projectStoreService.projectData.scopeInfo.returningCustomer || (this.projectStoreService.projectData.scopeInfo?.newEaidCreated && this.projectStoreService.projectData.scopeInfo.returningCustomer)) && !this.hybridOfferSubsciptions && !this.subscriptionsList.length) {
        this.getSubscriptionsList();
        if(this.eaService.features.RENEWAL_SEPT_REL){ this.getAvailableSubscriptionsList(); }
      }
    }
    this.projectService.clearSearchInput.next(true);
    if (this.noSubscriptionFoundMsg) {
      this.noSubscriptionFoundMsg = '';
    }
  }

  // to reset subscriptons data 
  resetSubsciptionsList(){
    this.noSubscriptionFoundMsg = '';
    this.subscriptionsList = [];
    this.selectedSubRefIds = [];
    this.collabSelectedList = [];
    this.searchedSubscription = undefined;
    this.showLoccWarning = false;
    this.messageService.clear();
  }

  convertNumberToWords(number){
    var numberToWords = require('number-to-words');
    return numberToWords.toWords(number);
  }
  iscontinue() {
    if (this.justification){
      this.justification = this.justification.trim();
    }
    //if(this.eaService.isFeatureEnbled){
      if (this.isExistingSubscriptionSelected) {
        if (!this.existingSubscriptions || ((this.selectedSubRefIds.length > 0 || this.justification) && this.isHybridOfferQnaSelected)) {
          return true;
        }
      } else {
        return false;
      }
   // } 
    // else {
    //   if (this.isExistingSubscriptionSelected) {
    //     if (!this.existingSubscriptions || (this.selectedSubRefIds.length > 0 || this.justification)) {
    //       return true;
    //     }
    //   } else {
    //     return false;
    //   }
    // }
  }

  // to goto subui with selected subref
  goToSubUi(subRefId){
    const url = 'proposal/sub-ui-url';
    if (!this.subUiUrl){
      this.eaRestService.getEampApiCall(url).subscribe((res: any) => {
        if(this.vnextService.isValidResponseWithData(res)){
          try{
           this.subUiUrl = res.data;
            window.open(this.subUiUrl +subRefId,'_blank');
          }
         catch(error){
           this.messageService.displayUiTechnicalError(error);
         }
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    } else {
      window.open(this.subUiUrl +subRefId,'_blank');
    }
  }

  cleanUp(){
    this.createProposalStoreService.renewalId = 0;
    this.createProposalStoreService.renewalJustification = '';
  }

  openQuoteSelection(){
   /* if(sessionStorage.getItem('projectData')){
      this.projectStoreService.projectData = JSON.parse(sessionStorage.getItem('projectData'));
      sessionStorage.removeItem('projectData');
  }*/
  if(!this.projectStoreService.projectData.selectedQuote && this.projectStoreService.projectData.referrerQuotes && !this.proposalStoreService.proposalData.id){
  const modalRef = this.modalVar.open(SelectAQuoteComponent, this.ngbModalOptions);
  if(this.projectStoreService.projectData.dealInfo){
    modalRef.componentInstance.dealId = this.projectStoreService.projectData.dealInfo.id;
  } 
  modalRef.componentInstance.associatedQuotes = this.projectStoreService.projectData.referrerQuotes;
  modalRef.result.then(result => {
    this.projectStoreService.projectData.selectedQuote = result.selectedQuote;
  });
  }
}


appendQuoteId(url:string){
  if(this.projectStoreService.projectData.selectedQuote){
    url = url + '&qid=' + this.projectStoreService.projectData.selectedQuote.quoteId;
  }
  return url;
}

}
