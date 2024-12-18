import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { MessageService, MessageType } from 'vnext/commons/message/message.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { CancelScopeChangeComponent } from 'vnext/modals/cancel-scope-change/cancel-scope-change.component';

import { ScopeChangeReasonComponent } from 'vnext/modals/scope-change-reason/scope-change-reason.component';

import { SubsidiariesStoreService } from 'vnext/project/subsidiaries/subsidiaries.store.service';
import { EaidStoreService } from '../eaid-store.service';
import { VnextService } from 'vnext/vnext.service';
import { EaidService } from '../eaid.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';


@Component({
  selector: 'app-eaid',
  templateUrl: './eaid.component.html',
  styleUrls: ['./eaid.component.scss'],
})
export class EaidComponent implements OnInit, OnDestroy {
  cavDetails = [];
  roadmapSteps = [];
  currentStep: number;
  showSubsidiaries = true;
  isRequestChangeScope = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private subsidiariesStoreService: SubsidiariesStoreService, public eaIdStoreService: EaidStoreService, 
    private eaRestService: EaRestService, private vNextService: VnextService, private eaidService: EaidService, private utilitiesService: UtilitiesService, public dataIdConstantsService: DataIdConstantsService,
    private messageService: MessageService, public localizationService: LocalizationService, private modalVar: NgbModal, public eaService: EaService, public elementIdConstantsService: ElementIdConstantsService) {
  }

  ngOnInit(): void {
    this.getEaid();
    this.eaService.isManageBpScope = true;
    this.eaIdStoreService.subscriptionsNotPresent = false;
    this.roadmapSteps = [
      {
        "id": "1",
        "name": "Customer Scope Details",
        "active": false
      },
      {
        "id": "2",
        "name": "Subscriptions",
        "active": false
      },
      {
        "id": "3",
        "name": "Review & Submit",
        "active": false
      }
    ]

  }

  getEaid() {
    if(!this.eaService.features?.EDIT_EAID_REL){
      this.messageService.displayUiTechnicalError()
      return
    }
    const internalEaid = this.activatedRoute.snapshot.queryParamMap.get('internaleaid');// this is for internal testing.
    const eaidSystem = this.activatedRoute.snapshot.queryParamMap.get('token');
    const sessionEaid = sessionStorage.getItem('encryptedEaId')
    if(sessionEaid && !internalEaid && !eaidSystem){
      this.eaIdStoreService.encryptedEaId = sessionEaid
      this.updateEaidUrl()
    } else if (internalEaid) {// this is for internal testing.
      const url = this.vNextService.getAppDomainWithContext + 'project/eaid/get-token?eaid=' + internalEaid
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
        if (this.vNextService.isValidResponseWithData(response)) {
          this.eaIdStoreService.encryptedEaId = response.data;
          this.updateEaidUrl()
        } else {
          this.messageService.displayMessagesFromResponse(response);
        }
      })
    } else if (eaidSystem) {
      this.eaIdStoreService.encryptedEaId = eaidSystem;
      this.updateEaidUrl()
    } else {
      const msgObj = {
        text: this.localizationService.getLocalizedString('common.EAID_DIRECT_ACCESS'),
        severity: MessageType.Error,
        code: ''
      }
      this.messageService.pessistErrorOnUi = true
      this.messageService.displayMessages([msgObj], false);
    }
  }
  ngOnDestroy(): void {
    this.messageService.pessistErrorOnUi = false
    this.eaService.isManageBpScope = false;
    this.subsidiariesStoreService.subsidiariesData = undefined;
    this.eaIdStoreService.viewOnlyScopeMode = false;
    this.eaIdStoreService.isAnyBuSelected = false;
    this.eaIdStoreService.isShowBuOverlapMessage = false;
    this.eaIdStoreService.disableContinue = false;
  }

  getCavDetails(moveToSubsidiariesPage?) {
    this.messageService.pessistErrorOnUi = false;
    this.eaIdStoreService.disableContinue = false;
    let url = this.vNextService.getAppDomainWithContext + 'project/cav?eaid=' + this.eaIdStoreService.encryptedEaId;
    if(moveToSubsidiariesPage){
      url = url + '&review=true'; // for review page need to pass review=true
    } else {
      this.cavDetails = []
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response)) {
        this.eaIdStoreService.eaIdData = response.data;
        this.cavDetails = response.data.cavs; // if required then only add in store service eaid data
        this.subsidiariesStoreService.subsidiariesData = response.data.cavs;
        if(response.data?.overlapBuData?.overlapBu){
          this.eaIdStoreService.isShowBuOverlapMessage = true;
          this.eaIdStoreService.disableContinue = true;
        }

        if (response.data.message && response.data.message?.messages?.length) {
          if(response.data.message.hasError){
            if(this.currentStep === 0 && !moveToSubsidiariesPage){
              this.eaIdStoreService.viewOnlyScopeMode = true;
            }
            if(moveToSubsidiariesPage){
              this.eaIdStoreService.disableContinue = true;
            }
            
          }
          this.messageService.pessistErrorOnUi = true;
          this.messageService.displayMessages(response.data.message?.messages);
        } 
        
        if(moveToSubsidiariesPage && this.currentStep === 0 && !response.data?.overlapBuData?.overlapBu && !response.data?.message?.hasError){
          this.messageService.pessistErrorOnUi = false;
          this.currentStep = this.currentStep + 1;
        }
      }
      //  else {
      //   this.messageService.displayMessagesFromResponse(response);
      // }
    })
  }

  downloadOverLapBu() {
    const url = this.vNextService.getAppDomainWithContext + 'project/download-overlap?eaid=' + this.eaIdStoreService.encryptedEaId;
    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithoutData(response, true)) { 
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      } 
    })
  }

  goToStep(index) {
    if(this.eaIdStoreService.viewOnlyScopeMode){
      return;
    }
    // reset flag when going back from step 2 using roadmap
    if(this.currentStep === 2 && this.eaIdStoreService.isShowBuOverlapMessage){
      this.eaIdStoreService.isShowBuOverlapMessage = false;
    }
    this.currentStep = index;
  }

  reqScopeChange() {
    const modal =  this.modalVar.open(ScopeChangeReasonComponent, {windowClass: 'scope-reason-modal'});
    modal.result.then((result) => { 
      if (result.continue) {
        this.showSubsidiaries = true;
        if(this.eaIdStoreService.scopeChangeComplete){
          this.eaIdStoreService.scopeChangeComplete = false;
        }
        if(this.eaIdStoreService.eaIdData?.overlapBuData?.overlapBus){
          this.eaidService.scopeChangeRequest.next(false);
        }
      }
    });
  }

  openCancelScopeChange() {
    const modal = this.modalVar.open(CancelScopeChangeComponent, { windowClass: 'cancel-reason-modal' });
    modal.componentInstance.isCancelScope = true;
    modal.result.then((result) => {
      if (result.continue) {
        this.cancelScopeChange();

      }
    });
  }


  back() {
    // reset flag when going back from step 2
    if(this.currentStep === 2 && this.eaIdStoreService.isShowBuOverlapMessage){
      this.eaIdStoreService.isShowBuOverlapMessage = false;
    }
    this.currentStep = this.currentStep - 1;
  }

  continue() {
    if(this.currentStep === 0){
      this.showSubsidiaries = true;
      if(this.eaIdStoreService.selectedBuMap?.size || this.eaIdStoreService.partiesSelectionMap?.size){
        this.eaidService.saveEaidDetails.next(true);
      } else {
        this.getCavDetails(true);
      }
    } else if(this.currentStep === 1){
      this.moveToNextStep()
    }
    //this.currentStep = this.currentStep + 1;
  }

  // goToSubmitScopePage(){
  //   this.currentStep = this.currentStep + 1;
  // }

  submitScopeChange() {

    this.messageService.pessistErrorOnUi = false;
    const url = this.vNextService.getAppDomainWithContext + 'project/submit-scope?eaid=' + this.eaIdStoreService.encryptedEaId;

    //let reqObj = { "data": { "eaid": this.eaIdStoreService.encryptedEaId } }

    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithData(response, true)) {

        if((response.data.message && response.data.message?.hasError) || response.data?.overlapBuData?.overlapBu){
            this.eaIdStoreService.allowSubmitScopeChange = false;
            this.messageService.pessistErrorOnUi = true;
          if (response.data.message?.hasError && response.data.message?.messages?.length) {
            this.messageService.displayMessages(response.data.message?.messages);
          }
          if(response.data?.overlapBuData?.overlapBu){
            this.eaIdStoreService.isShowBuOverlapMessage = true;
          } 
        } else {
          this.eaIdStoreService.scopeChangeComplete = true; // need to show RO mode again like before scope change request
          this.eaIdStoreService.confirmationToSubmitScopeChange = false;
          this.eaIdStoreService.eaIdData.scopeChangeDetails = undefined; // will change it further
          if (!this.eaIdStoreService.allowSubmitScopeChange) {
            this.eaIdStoreService.allowSubmitScopeChange = true;
          }
          this.messageService.pessistErrorOnUi = false;
          this.currentStep = 0;
        }
      } else {
        this.eaIdStoreService.allowSubmitScopeChange = false;
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  cancelOrgIdEdit() {
    this.showSubsidiaries = true;
  }
  @HostListener("window:beforeunload", ["$event"]) updateSession(event: Event) {
    if (this.eaIdStoreService.encryptedEaId) {
      sessionStorage.setItem(
        'encryptedEaId',
        this.eaIdStoreService.encryptedEaId);
    }
  }
  cancelScopeChange() {
    const url = 'project/cancel-scope-change';
    const reqObj = {
      "data" : { "eaid" : this.eaIdStoreService.encryptedEaId}
    }
      this.eaRestService.putApiCall(url, reqObj).subscribe((response: any) => {
      if (this.vNextService.isValidResponseWithoutData(response)) {
        this.currentStep = 0;
        this.showSubsidiaries = true;
        this.resetFlags(); // reset all the flags set in eaidstoreserivce
        this.getCavDetails();
      }
      else {
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // reset all the flags set in eaidstoreserivce
  resetFlags() {
    this.eaIdStoreService.isShowBuOverlapMessage = false;
    this.eaIdStoreService.subscriptionsNotPresent = false;
    this.eaIdStoreService.confirmationToSubmitScopeChange = false;
    if (!this.eaIdStoreService.allowSubmitScopeChange) {
      this.eaIdStoreService.allowSubmitScopeChange = true;
    }
    this.eaIdStoreService.disableContinue = false;
  }

  updateEaidUrl(){
    sessionStorage.removeItem('encryptedEaId');
    const updatedUrl = this.router.url.split('?');
    window.history.replaceState({}, document.title, updatedUrl[0]);
    if (this.eaIdStoreService.encryptedEaId) {
      this.currentStep = 0;
      this.eaIdStoreService.confirmationToSubmitScopeChange = false;
      this.getCavDetails();
    }
  }
  save(){
    this.eaidService.saveEaidDetails.next(false);
  }
  moveToNextStep(){
    this.currentStep = this.currentStep + 1;
  }
  toggleHeader(value){
    this.eaIdStoreService.selectedBuMap.clear()
    this.eaIdStoreService.partiesSelectionMap.clear();
    this.showSubsidiaries = value
  }
}
