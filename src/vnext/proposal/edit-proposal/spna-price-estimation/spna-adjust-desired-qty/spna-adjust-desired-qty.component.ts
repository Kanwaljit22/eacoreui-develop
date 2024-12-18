import { MessageService, MessageType } from 'vnext/commons/message/message.service';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';

import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { IPoolForGrid, PriceEstimateStoreService } from '../../price-estimation/price-estimate-store.service';
import { AdjustDesiredQtyService, IPids } from '../../price-estimation/adjust-desired-qty/adjust-desired-qty.service';
import { PriceEstimateService } from '../../price-estimation/price-estimate.service';
@Component({
  selector: 'app-spna-adjust-desired-qty',
  templateUrl: './spna-adjust-desired-qty.component.html',
  styleUrls: ['./spna-adjust-desired-qty.component.scss'],
  providers:[MessageService]
})
export class SpnaAdjustDesiredQtyComponent implements OnInit {
  @Input() poolArray: Array<IPoolForGrid> = [];
  @Input() selectedAto = '';
  @Input() selectedPool = '';
  @Output() onClose = new EventEmitter();
  @ViewChild('overRidepopover', { static: false }) overRidepopover: NgbPopover;
  selectedSuite:any = {};
  selectedPoolObj: IPoolForGrid = {}
  displayGrid = false;
  showPoolDropdown = false;
  showSuiteDropdown = false
  isValuesUpdated = false;
  updatedPidsArray: IPids[] = []
  enableDoneButton = false;
  updatedPidValue = 0;
  currencyCode:string;
  isSecurity = false; // set if secuirty portfolio
  isSecurityTier0Selected = false; // set if security tier0 was selected
  isFireWallSuite = false; // set if firewallSuite
  showQtyForFollowOn = false; // set to show totalConsumedQty for followON
  showReasonDrop = false;
  selectedCommitReason = 'Select Reason';
  reasonsArr = [];
  requestComment = '';
  tooltipText = 'Override Requested'
  showModifyReq = false;
  overRideExceptionInfo: any = {};
  commitValueStyle = {
    'width': '0%'
  }

  constructor(public priceEstimateService: PriceEstimateService, private proposalRestService: ProposalRestService,
      private vnextService: VnextService, public adjustDesiredQtyService: AdjustDesiredQtyService, public dataIdConstantsService: DataIdConstantsService,
      public proposalStoreService:  ProposalStoreService,private messageService: MessageService, public utilitiesService : UtilitiesService, private blockUiService: BlockUiService,public localizationService:LocalizationService, public priceEstimateStoreService: PriceEstimateStoreService,
      public constantsService: ConstantsService, public vnextStoreService: VnextStoreService, public eaService: EaService
    ) { }

  ngOnInit() {
    this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
    this.currencyCode = this.proposalStoreService.proposalData.currencyCode;
    this.getSelectedSuiteDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['poolArray'] && changes['poolArray'].previousValue !== changes['poolArray'].currentValue
      && !changes['poolArray'].isFirstChange()) {
        this.getSelectedSuiteDetails();
    }
  }

  showConfigError(){
    const msgObj = {
      text: this.localizationService.getLocalizedString('price-estimation.ADJUSTED_QTY_ONE_OR_MORE_SUITE_INVALID_MSG'),
      severity: MessageType.Error,
      code: ''
    }
    this.messageService.displayMessages([msgObj], false);
  }


  getSelectedSuiteDetails(){
    this.resetColumnsValue();
    this.selectedPoolObj = this.poolArray.find(pool => pool.poolSuiteLineName === this.selectedPool);
    if(this.selectedPoolObj.enrollmentId === 6){
      this.removeWebexSuite();
    }
    this.selectedSuite = this.selectedPoolObj.childs.find(suite => suite.ato === this.selectedAto);
    // check if security portfolio
    this.isSecurity = (this.selectedSuite.enrollmentId === this.constantsService.SECURITY_PORTFOLIO_ID) ? true : false;
    // check and set if firewallsuite
    this.isFireWallSuite = (this.selectedAto === this.constantsService.SECURE_FIREWALL) ? true : false;
    // check for security portfolio and security Tier present in selected enrollment 
    if (this.isSecurity && this.priceEstimateStoreService.selectedEnrollment.securityTier){
      this.checkForSecurityTier(this.priceEstimateStoreService.selectedEnrollment.securityTier);
    }
    if (this.selectedSuite.commitInfo.achievedInPercent) {
      this.commitValueStyle.width = this.selectedSuite.commitInfo.achievedInPercent + '%';
    }
    if(this.selectedSuite.hasPids){
      this.getSelectedSupportPid();
      this.displayGrid = true;
    } else {
      this.getPidData();
    }
  }

  getPidData() {
    this.blockUiService.spinnerConfig.displayProgressBar();
    this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+this.proposalStoreService.proposalData.objId+'/enrollment/' + this.selectedSuite.enrollmentId + '?a=FETCH-PIDS';
    const requestObj = {
      "data": {
        "enrollments": [
          {
            "atos": [
              {
                "name": this.selectedSuite.ato
              }
            ]
          }
        ]
      }
    }
    this.proposalRestService.postApiCall(url,requestObj).subscribe((response: any) => {
      this.messageService.clear();
      this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.mapValuesForLine(response.data.enrollments[0].pools[0].suites[0].pids)
        this.showCommitMessage()
      } else {
        
        this.messageService.displayMessagesFromResponse(response);
      }
    });

  }

  mapValuesForLine(pids){
    this.adjustDesiredQtyService.mapValuesForLine(pids,this.selectedSuite);
    this.displayGrid = true;
    let errorMessages = new Set<string>();
    this.selectedSuite.childs?.forEach((element) => {
       
      const advKey = element.pidNameADVANTAGE ? 'PID-' + element.pidNameADVANTAGE : '';
      const essentialKey = element.pidNameESSENTIAL ? 'PID-' + element.pidNameESSENTIAL : '';
      const premiumKey = element.pidNamePREMIUM ? 'PID-' + element.pidNamePREMIUM : '';
      const controllerKey = element.pidNameCONTROLLER ? 'PID-' + element.pidNameCONTROLLER : '';
      const routingHybridWorkerKey = element.pidNameROUTING_HYBRID_WORKER ? 'PID-' + element.pidNameROUTING_HYBRID_WORKER : '';
      const enterpriseKey = element.pidNameENTERPRISE ? 'PID-' + element.pidNameENTERPRISE : '';
      const premierKey = element.pidNamePREMIER ? 'PID-' + element.pidNamePREMIER : '';
      const d2OpsKey = element.pidNameD2OPS ? 'PID-' + element.pidNameD2OPS : '';
      const addOnKey = element.pidNameADD_ON ? 'PID-' + element.pidNameADD_ON : '';
      const generalKey = element.pidNameGENERAL? 'PID-' + element.pidNameGENERAL: '';
      const atoKey = 'ATO-' + element.ato;
      if (this.priceEstimateService.messageMap.has(atoKey)) {
        this.showConfigError();
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
      } else {
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
      }
      if (this.priceEstimateService.messageMap.has(advKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(advKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(premiumKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(premiumKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(controllerKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(controllerKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      }   
      if (this.priceEstimateService.messageMap.has(routingHybridWorkerKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(routingHybridWorkerKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(enterpriseKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(enterpriseKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(premierKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(premierKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(d2OpsKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(d2OpsKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(addOnKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(addOnKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(essentialKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(essentialKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      if (this.priceEstimateService.messageMap.has(generalKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(generalKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } 
      //else {
       // element.error = false;
      //}
    });
  }

  changePool(pool) {
    if (this.selectedPool !== pool.poolSuiteLineName) {
      this.selectedPoolObj = pool;
      this.selectedPool = pool.poolSuiteLineName;
      this.selectedSuite = {}
      this.displayGrid = false;
      this.showPoolDropdown = false;
    }
  }

  changeSuite(suite) {
    if ( this.selectedSuite.poolSuiteLineName !== suite.poolSuiteLineName) {
      this.resetColumnsValue();
      this.selectedSuite = suite
      this.showSuiteDropdown = false;
      this.selectedAto = suite.ato;
      // check and set if firewallsuite
      this.isFireWallSuite = (this.selectedAto === this.constantsService.SECURE_FIREWALL) ? true : false;
      if(this.selectedSuite.hasPids){
        this.getSelectedSupportPid();
        this.displayGrid = true;
      } else {
        this.getPidData();
      }
    }
  }

  close(){
    this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
    this.onClose.emit()
    this.vnextStoreService.toastMsgObject.isCommitOverrideRequested = false;
    this.vnextStoreService.toastMsgObject.isCommitOverrideRequestWithdrawn = false;
  }

  done(){
    if(this.updatedPidsArray.length){
      this.recalculatePidData(true)
    } else {
      this.close();
    }

  }

  updateQty(lineItem, type) {
    if (this.isValuesUpdated) {
      this.adjustDesiredQtyService.updateQty(lineItem, type, this.updatedPidsArray, this.updatedPidValue);
      this.isValuesUpdated = false;
      this.updatedPidValue = 0;
    }
  }

  updateQtyForPid(pid, type, isDesiredQtyUpgrade?) {
    if (this.isValuesUpdated) {
      if (isDesiredQtyUpgrade) {
        if (this.updatedPidValue < pid.minQty) {
          pid.error = true;
        } else {
          pid.error = false;
        }
      }
      this.adjustDesiredQtyService.updateQtyForPid(pid,type, this.updatedPidsArray, this.updatedPidValue);
      this.isValuesUpdated = false;
      this.updatedPidValue = 0;
    }
  }

  selectSupport(pidItem){
    if(this.adjustDesiredQtyService.selectedSupportPid.pidName !== pidItem.pidName){
      this.adjustDesiredQtyService.selectSupport(pidItem,this.updatedPidsArray);
    }
  }

  recalculatePidData(closeAfterRecal = false){
    this.blockUiService.spinnerConfig.displayProgressBar();
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+this.proposalStoreService.proposalData.objId+'/enrollment/' + this.selectedSuite.enrollmentId + '?a=ATO-QTY-UPDATE';
    const requestObj = {
      "data": {
        "enrollments":[
           {
            "enrollmentId":this.selectedSuite.enrollmentId,
            "atos": [
              {
                "name": this.selectedSuite.ato,
                "pids": this.updatedPidsArray
              }
            ]
           }
        ]
            
          }
    }
    this.proposalRestService.postApiCall(url,requestObj).subscribe((response: any) => {
      this.messageService.clear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.updatedPidsArray = [];
        this.enableDoneButton = true;

        for (let i = 0; i < this.proposalStoreService.proposalData.enrollments?.length; i++) {
          if (this.proposalStoreService.proposalData.enrollments[i].id === response.data.enrollments[0].id) {
             this.proposalStoreService.proposalData.enrollments[i].priceInfo = response.data.enrollments[0].priceInfo;
          }
        }

        // Setting error message
        this.proposalStoreService.isSyncPrice = false;
        this.proposalStoreService.proposalData.message = response.data.proposal.message;   
        
        if (response.data.proposal.message && response.data.proposal.message.hasError) {  
         // this.showConfigError();
          this.priceEstimateService.prepareMessageMapForGrid(response.data.proposal.message);
        } 
        this.priceEstimateService.updateQtySubject.next(response);
        if (closeAfterRecal) {
          this.close();
        }
      } else {
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
    
  }

  onChange(event){
    this.updatedPidValue = event
  }

  //check updated quantity, should be number only
  checkUpdatedQty(event){
    if (this.utilitiesService.isNumberOnlyKey(event) ) {
      if(event.key !== 'Tab'){//this will allow Tab to work and will not change any value.
        this.isValuesUpdated = true;
      }
    } else {
      event.preventDefault();
    }
  }
  resetColumnsValue(){
    this.adjustDesiredQtyService.display_ADVANTAGE = false;
    this.adjustDesiredQtyService.display_PREMIER = false;
    this.adjustDesiredQtyService.display_ADD_ON = false;
    this.adjustDesiredQtyService.display_D2OPS = false;
    this.adjustDesiredQtyService.display_PREMIUM = false;
    this.adjustDesiredQtyService.display_CONTROLLER = false;
    this.adjustDesiredQtyService.display_ROUTING_HYBRID_WORKER = false;
    this.adjustDesiredQtyService.display_ENTERPRISE = false;
    this.adjustDesiredQtyService.display_GENERAL = false;
    this.adjustDesiredQtyService.display_PRO = false;
    this.adjustDesiredQtyService.display_ADVANCED = false;
    this.adjustDesiredQtyService.display_PEAK = false;
    this.adjustDesiredQtyService.display_ESSENTIAL = false;
    this.adjustDesiredQtyService.ADVANTAGE = 0
    this.adjustDesiredQtyService.PREMIER = 0
    this.adjustDesiredQtyService.ADD_ON = 0
    this.adjustDesiredQtyService.D2OPS = 0;
    this.adjustDesiredQtyService.PREMIUM = 0;
    this.adjustDesiredQtyService.CONTROLLER = 0;
    this.adjustDesiredQtyService.ROUTING_HYBRID_WORKER = 0;
    this.adjustDesiredQtyService.ENTERPRISE = 0;
    this.adjustDesiredQtyService.GENERAL = 0
    this.adjustDesiredQtyService.PRO = 0;
    this.adjustDesiredQtyService.ADVANCED = 0;
    this.adjustDesiredQtyService.PEAK = 0;
    this.adjustDesiredQtyService.qtyCount = 0;
    this.adjustDesiredQtyService.totalIbQty = 0;
    this.adjustDesiredQtyService.totalQty = 0;
    this.adjustDesiredQtyService.ESSENTIAL = 0;
  }

  showCommitMessage(){
    const msgObj = {
      text: '',
      severity: '',
      code: ''
    }
    if(this.selectedSuite.commitInfo && this.selectedSuite.commitInfo.committed){
      msgObj.text = this.localizationService.getLocalizedString('price-estimation.ADJUSTED_QTY_FULLY_COMMITTED_MSG');
      msgObj.severity = MessageType.Success
    } else if(this.priceEstimateStoreService.selectedEnrollment.id !== 6){
      msgObj.text = this.localizationService.getLocalizedString('price-estimation.ADJUSTED_QTY_FULLY_COMMIT_REQUIREMENT_MSG');

      msgObj.severity = MessageType.Info;
    }

    if (msgObj.text && !this.adjustDesiredQtyService.displayMsgForAdjDesiredQty){
      this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
    }
    if(msgObj.text){
      this.messageService.displayMessages([msgObj], false);
    }
    if (msgObj.severity === MessageType.Success) {
      setTimeout(() => {
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
        this.messageService.clear();
      }, 5000);
    }
  }

  getSelectedSupportPid(){
    this.adjustDesiredQtyService.getSelectedSupportPid(this.selectedSuite.childs);
    let errorMessages = new Set<string>();
    this.selectedSuite.childs.forEach(element => {
      const errorKey = 'PID-' + element.pidName;
      const atoKey = 'ATO-' + element.ato;
      if (this.priceEstimateService.messageMap.has(atoKey)) {
        this.showConfigError();
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = true;
      } else {
        this.adjustDesiredQtyService.displayMsgForAdjDesiredQty = false;
      }
      if (this.priceEstimateService.messageMap.has(errorKey))  {
        element.error = true;
        errorMessages = this.priceEstimateService.messageMap.get(errorKey);
        element.arrayOfErrorMessages = Array.from(errorMessages);
      } else {
        element.error = false;
      }
    });
  }

  // check and set if security tier 0 is selected
  checkForSecurityTier(securityTier){
    this.isSecurityTier0Selected = false;
    if (securityTier === 'Tier 0'){
      this.isSecurityTier0Selected = true;
    }
    return;
  }

  // Redirect to Commit rules page
  redirectToCommitRulesPage() {
    const url = this.vnextService.getAppDomainWithContext + 'service-registry/url?track=SALES_CONNECT&service=SPNA_COMMIT_RULE';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        window.open(response.data); 
      }
    })
  }

  showOrHideTotalConsumedQty() {
    this.showQtyForFollowOn = !this.showQtyForFollowOn;
  }

  selectReason(reason) {
    this.selectedCommitReason = reason;
    this.showReasonDrop = false;
  }

  showPopover() {
    this.overRideExceptionInfo = {};
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/atos-commit-override-reason?a=' + this.selectedAto;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
     if (this.vnextService.isValidResponseWithData(response)) {
       this.overRidepopover?.open();
       this.reasonsArr = response.data.reasons;
       this.overRideExceptionInfo = response.data;
       if (this.selectedSuite.commitInfo.overrideReason){
        this.selectedCommitReason = this.selectedSuite.commitInfo.overrideReason;
       }
      }
    })
  }

  reqOverrideCommit() {
    // const requestObj = {
    //   "data" : {
    //     "ato" : this.selectedAto,
    //     "exceptionInfo" : { 
    //       "exceptionType": this.selectedAto + "_SUITE_COMMIT_OVERRIDE",
    //       "label": "Suite Commit Override",
    //       "reasons": this.reasonsArr,
    //       "reasonSelectionOptional": false,
    //       "autoApprovalCandidate": true,
    //       "selectedReasons": []     
    //     }
    //   }
    // }
    let overRideExceptionReq = this.overRideExceptionInfo;
    overRideExceptionReq['selectedReasons'] = [];
    const requestObj = {
      "data" : {
        "ato" : this.selectedAto,
        "exceptionInfo" : overRideExceptionReq
      }
    }
    requestObj.data.exceptionInfo.selectedReasons.push(this.selectedCommitReason);
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/atos-commit-override-request';
    this.eaService.customProgressBarMsg.requestOverride = true;
    this.proposalRestService.postApiCall(url,requestObj).subscribe((response: any) => { 
    if (this.vnextService.isValidResponseWithoutData(response, true)) {
     // this.showModifyReq = true;
     this.vnextStoreService.toastMsgObject.isCommitOverrideRequested = true;
      this.priceEstimateService.updateQtySubject.next(true);
      setTimeout(() => {
        this.vnextStoreService.cleanToastMsgObject(); // after 5 sec clear the message
      }, 5000);
    }
    });
    this.overRidepopover?.close();
  }

  // to call withdraw override support and close the popup
  withdrawRequest() {
    const requestObj = {
      "data": {
        "ato": this.selectedAto
      }
    }
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/atos-commit-override-withdraw';
    this.eaService.customProgressBarMsg.witdrawReqOverride = true;
    this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.showModifyReq = false;
        this.vnextStoreService.toastMsgObject.isCommitOverrideRequestWithdrawn = true;
        this.priceEstimateService.updateQtySubject.next(true);
        setTimeout(() => {
          this.vnextStoreService.cleanToastMsgObject(); // after 5 sec clear the message
        }, 5000);
      }
    })
    this.overRidepopover?.close();
  }

  removeWebexSuite(){
    this.selectedPoolObj.childs =  this.selectedPoolObj.childs.filter(suite => suite.pidType !== "COLLAB");
  }
  onPaste(event:ClipboardEvent){
    event.preventDefault();
}


}


