import { CreateProposalService } from './../../create-proposal/create-proposal.service';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { Router } from '@angular/router';
import { Message } from '../../../shared/services/message';
import { LocaleService } from '@app/shared/services/locale.service';
import { map } from 'rxjs/operators'
import { EaService } from 'ea/ea.service';

@Injectable()
export class PriceEstimationService {
  isContinue = false;
  suiteDiscounts = [];
  perpetualSuiteDiscounts = [];
  proposalHeaderDiscounts = {};
  dnaRampDiscount = [];
  headerDiscountApplied = false;
  valChanged = new BehaviorSubject<boolean>(false);
  currentval = this.valChanged.asObservable();
  discountsOnSuites = {
    advancedDeployment: '',
    softwareServiceDiscount: '',
    softwareDiscount: '',
    subscriptionDiscount: '',
    advancedDeploymentSelected: false,
    multisuiteDiscount: '',
    totalSubscriptionDiscount: '',
    serviceLevel: '',
    subscriptionServiceDiscount: '',
  };
  dialDownRampChangeMap = new Map<Number, any>(); // This obj is use to hold change values from dial down ramp modal
  recalculateAllEmitter = new EventEmitter();
  advancedDeploymentEmitter = new EventEmitter();
  reloadPriceEstimateEmitter = new EventEmitter();
  eaQtyList = [];
  suiteAndLineMessageMap = new Map<string, Set<string>>();
  lineLevelMessageMap = new Map<string, Set<string>>();
  suiteLineMapForTab = new Map<string, string[]>();
  selectedSuiteGroupLineItemMap = new Map<string, number>();
  eaValue: any;
  headerDiscounts = [
    {
      name: this.localeService.getLocalizedString('price.est.SOFTWARE_DISCOUNT'),
      value: ''
    },
    {
      name: this.localeService.getLocalizedString('price.est.SOFTWARE_SERVICE_DISCOUNT'),
      value: ''
    },
    {
      name: this.localeService.getLocalizedString('price.est.SUBSCRIPTION_DISCOUNT'),
      value: ''
    }
  ];

  showMessage = true;
  requestIBA = true;
  showEAQuantity = false;
  isEmitterSubscribe = false;
  // for request adjustment
  suitesArray = [];
  showFinancialSummary = false;
  LINE_ITEM_TYPE = 'Group';
  showCredits = false;
  creditOverviewSearchEmitter = new EventEmitter();
  showPriceListError = false;
  totalAddonForWireless = 0;
  isPremierForWirelessZero = false;

  constructor(
    private http: HttpClient,
    private appDataService: AppDataService,
    public proposalDataService: ProposalDataService,
    public messageService: MessageService,
    public createProposalService: CreateProposalService,
    public constantsService: ConstantsService,
    public localeService: LocaleService,
    public router: Router,
    public eaService: EaService
  ) { }

  changeVal(val: boolean) {
    this.valChanged.next(val);
  }

  getPurchaseAdjustmentPermit() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/pa-permitted');
  }

  getRowData() {
    let proposalId = this.proposalDataService.proposalDataObject.proposalId;
    let userId = this.appDataService.userId;
    return (
      this.http
        .get(
          this.appDataService.getAppDomain +
          'api/proposal/priceEstimate?p=' +
          proposalId +
          '&u=' +
          userId
        )
        // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/priceEstimate?p=62&u='+userId)
        .pipe(map(res => res))
    );
  }

  getRowData2() {
    return this.http.get('assets/data/proposal/priceEstimation.json');
  }

  getDiscounts() {
    let proposalId = this.proposalDataService.proposalDataObject.proposalId;
    let userId = this.appDataService.userId;
    return (
      this.http
        .get(
          this.appDataService.getAppDomain +
          'api/proposal/discounts?p=' +
          proposalId +
          '&u=' +
          userId
        )
        // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/discounts?p=62&u='+userId)
        .pipe(map(res => res))
    );
  }

  calculateTcv() {
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    const userId = this.appDataService.userId;
    return (
      this.http
        .get(
          this.appDataService.getAppDomain +
          'api/proposal/tcv/calculate?p=' +
          proposalId +
          '&u=' +
          userId
        )
        // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tcv/calculate?p=62&u='+userId)
        .pipe(map(res => res))
    );
  }

  loadPriceEstimate(path?,isBaseLining=false) {
    if (path) {
      return (
        this.http
          .get(
            this.appDataService.getAppDomain +
            'api/proposal/price-estimate/' +
            this.proposalDataService.proposalDataObject.proposalId + '?c=' + this.constantsService.CURRENCY + path
          )
          // return this.http.get(this.appDataService.getAppDomain + 'api/proposal/tcv/calculate?p=62&u='+userId)
          .pipe(map(res => res))
      );
    } else {
      let uri = 'api/proposal/price-estimate/' + this.proposalDataService.proposalDataObject.proposalId + '?c=' + this.constantsService.CURRENCY;
      if(isBaseLining){
        uri = uri + '&fqb=true';
      }
      return (
        this.http
          .get(
            this.appDataService.getAppDomain +uri).pipe(map(res => res))
      );
    }

  }

  calculateTco() {
    const tcoRequestObject = {
      data: {
        userId: this.appDataService.userId,
        id: this.proposalDataService.proposalDataObject.proposalId
      }
    };
    return this.http
      .post(
        this.appDataService.getAppDomain + 'api/proposal/tco/calculate',
        tcoRequestObject
      )
      .pipe(map(res => res));
  }

  saveDiscount(data) {
    const requestObject = {
      // userId: this.appDataService.userId,
      data: data
    };
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    return this.http
      .post(
        this.appDataService.getAppDomain +
        'api/proposal/tcv/suites/discount?p=' +
        proposalId,
        requestObject
      )
      .pipe(map(res => res));
  }

  sendIbaReport(ibaRquestObj) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/proposal-ib',
      ibaRquestObj)
      .pipe(map(res => res));
  }
  sendTcvReport(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/report/tco-comparison', reqJSON).pipe(map(res => res));
  }
  getCustomerIBReport(reqJSON) {
    if (this.appDataService.archName === this.constantsService.SECURITY) {
      return this.http.post(this.appDataService.getAppDomain + 'api/report/booking-report', reqJSON);
    } else {
      return this.http.post(this.appDataService.getAppDomain + 'api/report/ib-summary', reqJSON);
    }

  }

  convertToSliderObj(obj) {
    let newObj = sliderObjFactory.getSliderObj();

    for (let prop in obj) {
      if (prop.indexOf('Min') > -1) {
        // property contains min value, assign its value to min property of sliderObj
        newObj.min = obj[prop];
      } else if (prop.indexOf('Max') > -1) {
        // property contains mxn value, assign its value to man property of sliderObj
        newObj.max = obj[prop];
      } else if (prop.indexOf('Selected') > -1) {
        // property contains mxn value, assign its value to man property of sliderObj
        newObj.selected = obj[prop];
      } else {
        let splitStr = prop.replace(/([a-z](?=[A-Z]))/g, '$1 '); // split prop name to get Discout category
        newObj.name = splitStr;
        newObj.from = obj[prop]; // Applied discount from server
      }
    }
    let slider = newObj;
    if (slider.name.indexOf('advance') > -1) {
      // if(newObj.selected === false){

      // }
      newObj.tab = true;
    }
    return { slider };
  }

  postEaQty(requestObject) {
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    const userId = this.appDataService.userId;
    return this.http
      .post(
        this.appDataService.getAppDomain +
        'api/proposal/qty?p=' +
        proposalId +
        '&u=' +
        userId,
        requestObject
      )
      .pipe(map(res => res));
  }

  createEaQtyList(gridData) {
    this.eaQtyList = [];
    /*
     eaQty.suiteId = event.data.suiteId;
     eaQty.lineItemId = event.data.lineItemId;
     eaQty.advancedQtyChanged = isAdvancedChanged;
     eaQty.perpetualAdvancedQty = event.data.advancedEaQty;
     eaQty.perpetualFoundationQty = event.data.foundationEaQty;
     eaQty.subscriptionAdvantageQty = event.data.advantageEaQty;
     eaQty.subscriptionEcsQty = event.data.ecsEaQty;
     eaQty.subscriptionEssentialsQty = event.data.essentialsEaQty;

     if (columName.includes('advantageEaQty')) {
       eaQty.subscriptionAdvantageQty = changedvalue;
     } else if (columName.includes('advancedEaQty')) {
       eaQty.perpetualAdvancedQty = changedvalue;
     } else if (columName.includes('foundationEaQty')) {
       eaQty.perpetualFoundationQty = changedvalue;
     } else if (columName.includes('essentialsEaQty')) {
       eaQty.subscriptionEssentialsQty = changedvalue;
     } else if (columName.includes('ecsEaQty')) {
       eaQty.subscriptionEcsQty = changedvalue;
     }*/
    if (this.appDataService.archName !== this.constantsService.SECURITY) {
      for (let i = 0; i < gridData.length; i++) {
        const childrenAry = gridData[i].children;
        for (let j = 0; j < childrenAry.length; j++) {
          if (childrenAry[j].lineItemType !== this.LINE_ITEM_TYPE) { // push if lineitemtype is not equal to group
            this.eaQtyList.push(this.prepareLineItemForRecalculateCall(childrenAry[j]));
          }
        }
      }

      if(this.isPremierForWirelessZero && this.totalAddonForWireless){
        const index = this.eaQtyList.map((lineItem: any) => lineItem.lineItemId).indexOf('DNA-W-DNAEP-ADD-T');
        if(this.eaQtyList[index]){
          this.eaQtyList[index].advancedAddonEaQty = this.totalAddonForWireless;
        }
      }
    } else {
      for (let i = 0; i < gridData.length; i++) {
        const childrenAry = gridData[i].children;
        for (let j = 0; j < childrenAry.length; j++) {
          if (childrenAry[j].lineItemType !== this.LINE_ITEM_TYPE) {
            this.eaQtyList.push(this.prepareLineItemForRecalculateCall(childrenAry[j]));
          }
        }
      }
    }
    this.totalAddonForWireless = 0;
  }


  prepareLineItemForRecalculateCall(lineItem) {
    const eaQty = EaQtyFactory.getEaQty();
    eaQty.suiteId = lineItem.suiteId;
    eaQty.lineItemId = lineItem.lineItemId;
    eaQty.lineItemUpdated = lineItem.lineItemUpdated;
    if (lineItem.lineItemDescription !== undefined) {
      eaQty.lineItemDescription = lineItem.lineItemDescription;
    }
    if (lineItem.eaQuantity !== undefined) {
      eaQty.eaQuantity = lineItem.eaQuantity;
    }
    if (lineItem.ibAdvantageBf4Qty !== undefined) {
      eaQty.ibAdvantageBf4Qty = lineItem.ibAdvantageBf4Qty;
    }
    if (lineItem.ibAdvantageBf5Qty !== undefined) {
      eaQty.ibAdvantageBf5Qty = lineItem.ibAdvantageBf5Qty;
    }
    if (lineItem.ibAdvantageBf6Qty !== undefined) {
      eaQty.ibAdvantageBf6Qty = lineItem.ibAdvantageBf6Qty;
    }
    if (lineItem.ibAdvantageBfC1EaQty !== undefined) {
      eaQty.ibAdvantageBfC1EaQty = lineItem.ibAdvantageBfC1EaQty;
    }
    if (lineItem.ibAdvantageBfEaQty !== undefined) {
      eaQty.ibAdvantageBfEaQty = lineItem.ibAdvantageBfEaQty;
    }
    if (lineItem.ibAdvantageBfLbEaQty !== undefined) {
      eaQty.ibAdvantageBfLbEaQty = lineItem.ibAdvantageBfLbEaQty;
    }
    if (lineItem.ibAdvantageGfEaQty !== undefined) {
      eaQty.ibAdvantageGfEaQty = lineItem.ibAdvantageGfEaQty;
    }
    if (lineItem.advancedEaQty !== undefined) {
      eaQty.advancedEaQty = lineItem.advancedEaQty;
    }
    if (lineItem.foundationEaQty !== undefined) {
      eaQty.foundationEaQty = lineItem.foundationEaQty;
    }
    if (lineItem.advantageEaQty !== undefined) {
      eaQty.advantageEaQty = lineItem.advantageEaQty;
    }
    if (lineItem.ecsEaQty !== undefined) {
      eaQty.ecsEaQty = lineItem.ecsEaQty;
    }
    if (lineItem.essentialsEaQty !== undefined) {
      eaQty.essentialsEaQty = lineItem.essentialsEaQty;
    }
    if (lineItem.dnaAdvantageEaQty !== undefined) {
      eaQty.dnaAdvantageEaQty = lineItem.dnaAdvantageEaQty;
    }
    if (lineItem.advantageBfC1EaQty !== undefined) {
      eaQty.advantageBfC1EaQty = lineItem.advantageBfC1EaQty;
    }
    if (lineItem.advantageBfLbEaQty !== undefined) {
      eaQty.advantageBfLbEaQty = lineItem.advantageBfLbEaQty;
    }
    if (lineItem.advantageBfEaQty !== undefined) {
      eaQty.advantageBfEaQty = lineItem.advantageBfEaQty;
    }
    if (lineItem.advantageGfEaQty !== undefined) {
      eaQty.advantageGfEaQty = lineItem.advantageGfEaQty;
    }
    if (lineItem.dnaPremierEaQty !== undefined) {
      eaQty.dnaPremierEaQty = lineItem.dnaPremierEaQty;
    }
    if (lineItem.premierBfC1EaQty !== undefined) {
      eaQty.premierBfC1EaQty = lineItem.premierBfC1EaQty;
      if(lineItem.suiteId === 14){
        this.totalAddonForWireless = this.totalAddonForWireless + (+lineItem.premierBfC1EaQty)
      }
    }
    if (lineItem.premierBfLbEaQty !== undefined) {
      eaQty.premierBfLbEaQty = lineItem.premierBfLbEaQty;
      if(lineItem.suiteId === 14){
      this.totalAddonForWireless = this.totalAddonForWireless + (+lineItem.premierBfLbEaQty)
      }
    }
    if (lineItem.premierBfEaQty) {
      eaQty.premierBfEaQty = lineItem.premierBfEaQty;
      if(lineItem.suiteId === 14){
      this.totalAddonForWireless = this.totalAddonForWireless + (+lineItem.premierBfEaQty)
      }
    }
    if (lineItem.premierGfEaQty !== undefined) {
      eaQty.premierGfEaQty = lineItem.premierGfEaQty;
      if(lineItem.suiteId === 14){
      this.totalAddonForWireless = this.totalAddonForWireless +  (+lineItem.premierGfEaQty)
      }
    }
    if (lineItem.advancedAddonEaQty !== undefined) {
      eaQty.advancedAddonEaQty = lineItem.advancedAddonEaQty;
    }

    if (lineItem.controllerEaQty !== undefined) {
      eaQty.controllerEaQty = lineItem.controllerEaQty;
    }

    if (lineItem.dcSubscriptionEaQty !== undefined) {
      eaQty.dcSubscriptionEaQty = lineItem.dcSubscriptionEaQty;
    }
    if (lineItem.advantageBf4Qty !== undefined) {
      eaQty.advantageBf4Qty = lineItem.advantageBf4Qty;
    }
    if (lineItem.advantageBf5Qty !== undefined) {
      eaQty.advantageBf5Qty = lineItem.advantageBf5Qty;
    }
    if (lineItem.advantageBf6Qty !== undefined) {
      eaQty.advantageBf6Qty = lineItem.advantageBf6Qty;
    }
    if (lineItem.premierBf4Qty !== undefined) {
      eaQty.premierBf4Qty = lineItem.premierBf4Qty;
    }
    if (lineItem.premierBf5Qty !== undefined) {
      eaQty.premierBf5Qty = lineItem.premierBf5Qty;
    }
    if (lineItem.premierBf6Qty !== undefined) {
      eaQty.premierBf6Qty = lineItem.premierBf6Qty;
    }
    return eaQty;
  }

  saveEaQuantity(event) {
    //  let eaQty = EaQtyFactory.getEaQty();

    // eaQty.suiteId = event.data.suiteId;
    // eaQty.lineItemId = event.data.lineItemId;

    console.log('value changed');
    console.log(event);
    let columName = event.column.getColId();
    let changedvalue = event.value;

    /* if (columName.includes('advantageEaQty')) {
       eaQty.subscriptionAdvantageQty = changedvalue;
     } else if (columName.includes('advancedEaQty')) {
       eaQty.perpetualAdvancedQty = changedvalue;
     } else if (columName.includes('foundationEaQty')) {
       eaQty.perpetualFoundationQty = changedvalue;
     } else if (columName.includes('essentialsEaQty')) {
       eaQty.subscriptionEssentialsQty = changedvalue;
     } else if (columName.includes('ecsEaQty')) {
       eaQty.subscriptionEcsQty = changedvalue;
     }*/

    const requestObj = {
      userId: this.appDataService.userId
      // data: [eaQty]
    };

    this.postEaQty(requestObj).subscribe((response: any) => {
      if (response) {
        if (response.messages && response.messages.length > 0) {
          this.messageService.displayMessagesFromResponse(response);
        }
        if (!response.error) {
          const recalculateAllEmitterObj: RecalculateAllEmitterObj = {
            recalculateButtonEnable: true,
            recalculateAllApiCall: true
          }
          this.recalculateAllEmitter.emit(recalculateAllEmitterObj);
        }
      }
    });
  }

  recalculateAll(forcedReprice) {
    const requestObject = {
      //userId: userId,
      data: this.eaQtyList,
      discounts: this.perpetualSuiteDiscounts
    };
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    let url = this.appDataService.getAppDomain + 'api/proposal/tcv/re-calculation/' + proposalId + '?c=' + this.constantsService.CURRENCY;
    if (forcedReprice) {
      url += '&frp=' + true;
    }
    return this.http
      .post(
        url,
        requestObject
      )
      .pipe(map(res => res));
  }
  // config
  config(suiteId, contextPath) {
    const requestObject = {
      contextPath: contextPath
    };
    if (suiteId) {
      requestObject['suiteId'] = suiteId;
    }
    const proposalId = this.proposalDataService.proposalDataObject.proposalId;
    const url = this.appDataService.getAppDomain + 'api/proposal/configPunchOut/' + proposalId;
    return this.http
      .post(
        url, requestObject
      )
      .pipe(map(res => res));
  }

  recalculatePrice(callback) {
    this.recalculateAll(false)
      .subscribe((response: any) => {
        if (response) {
          if (response.messages && response.messages.length > 0) {
            this.messageService.displayMessagesFromResponse(
              response
            );
          }
          if (!response.error) {
            this.recalculateAllEmitter.emit(
              true
            );
            // if (
            //   this.proposalDataService.proposalDataObject
            //     .proposalData.status ===
            //   this.constantsService.QUALIFICATION_COMPLETE
            // ) {
            //   this.createProposalService.updateProposalStatus();
            // }
            this.isContinue = false;
            return callback(); // execute the callback passed i.e to navigate
          }
        }
      });
  }

  // api call to restore purchase adjustment 
  restorePA() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/restore-negative-tcv-pa').pipe(map(res => res));
  }

  prepareMessageMapForGrid(messageObj: any): boolean {
    let isErrorPresent = false;
    this.suiteAndLineMessageMap.clear();
    this.lineLevelMessageMap.clear();
    if (messageObj.messages) {
      this.messageService.displayMessages(messageObj.messages);
    }
    if (messageObj.hasError) {
      isErrorPresent = true;
    }
    if (messageObj.childs) {
      for (const key in messageObj.childs) {
        const child = messageObj.childs[key];
        if (!isErrorPresent && child.hasError) {
          isErrorPresent = true;
        }
        if (child.messages) {
          for (let i = 0; i < child.messages.length; i++) {
            const msg = child.messages[i];
            //Below if condition is for line level error msgs
            if (msg.lineLevel && msg.severity === 'ERROR') {
              this.lineLevelMessageMap.set(msg.suiteId + msg.productIdentifier, msg);
            }
            if (this.suiteAndLineMessageMap.has(key)) {
              const messageArray = this.suiteAndLineMessageMap.get(key);
              messageArray.add(msg.text);
            } else {
              const messageArray = new Set<string>();
              messageArray.add(msg.text);
              this.suiteAndLineMessageMap.set(key, messageArray);
            }
          }

        }
        if (child.childs) {
          for (const childKey in child.childs) {
            const lineLevelError = child.childs[childKey];
            if (!isErrorPresent && lineLevelError.hasError) {
              isErrorPresent = true;
            }
            for (let i = 0; i < lineLevelError.messages.length; i++) {
              const msg = lineLevelError.messages[i];
              if (msg.token) {
                this.prepareTokenMap(key + this.constantsService.HASH + childKey, msg.token, msg.text);
              }
              //this.prepareTokenMap(key,msg.token,msg.text);
              if (this.suiteAndLineMessageMap.has(key)) {
                const messageArray = this.suiteAndLineMessageMap.get(key);
                messageArray.add(msg.text);
              } else {
                const messageArray = new Set<string>();
                messageArray.add(msg.text);
                this.suiteAndLineMessageMap.set(key, messageArray);
              }
            }
          }
        }
      }

    }
    return isErrorPresent;
  }


  prepareTokenMap(key, tokenArray, textMessage) {
    for (let i = 0; i < tokenArray.length; i++) {
      const token = tokenArray[i];
      const tokenValue = this.constantsService.TOKEY_COLOUMN_MAPPING[token.name];
      if (this.suiteAndLineMessageMap.has(key + this.constantsService.HASH + tokenValue)) {
        const messageArray = this.suiteAndLineMessageMap.get(key + this.constantsService.HASH + tokenValue);
        messageArray.add(textMessage);
      } else {
        const messageArray = new Set<string>();
        messageArray.add(textMessage);
        this.suiteAndLineMessageMap.set(key + this.constantsService.HASH + tokenValue, messageArray);
      }
    }
  }


  prepareArrayObjectForTab(lineItem, lineAndCellFieldArray: Array<string>) {
    if (lineItem['advantageBfC1EaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advantageBfC1EaQty');
    }
    if (lineItem['advantageBfLbEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advantageBfLbEaQty');
    }
    if (lineItem['advantageBfEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advantageBfEaQty');
    }
    if (lineItem['advantageGfEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advantageGfEaQty');
    }
    if (lineItem['premierBfC1EaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#premierBfC1EaQty');
    }
    if (lineItem['premierBfLbEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#premierBfLbEaQty');
    }
    if (lineItem['premierBfEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#premierBfEaQty');
    }
    if (lineItem['premierGfEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#premierGfEaQty');
    }
    if (lineItem['advancedAddonEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advancedAddonEaQty');
    }

    if (lineItem['controllerEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#controllerEaQty');
    }

    if (lineItem['foundationEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#foundationEaQty');
    }
    if (lineItem['advantageEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#advantageEaQty');
    }
    if (lineItem['essentialsEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#essentialsEaQty');
    }
    if (lineItem['ecsEaQtyEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#ecsEaQty');
    }
    if (lineItem['eaQuantityEditable']) {
      lineAndCellFieldArray.push(lineItem.lineItemId + '#eaQuantity');
    }
  }


  getColumnDefs() {
    // if(this.appDataService.isRenewal){
    //   return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/price-estimate-metadata?archName=' + this.appDataService.archName + '&id=' + this.appDataService.archName+ '_RENEWAL'  );
    // }
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/price-estimate-metadata?archName=' + this.appDataService.archName);
  }

  exportProposal() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/price-estimate/export', { observe: 'response', responseType: 'blob' as 'json' });
  }

  // api to check request for pa checked or not
  paInitStatus() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/pa-init-status?proposalId=' + this.proposalDataService.proposalDataObject.proposalId);
  }

  // api to request for Purchase adjustment
  requestForPa(type) {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/pa-request/' + type);
  }

  // api to send override msd suite count
  msdSuiteCountSubmit(selection, value) {
    if (selection) {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/override/msd-suite-count?o=true&ov=' + value).pipe(map(res => res));
    } else {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/override/msd-suite-count?o=false').pipe(map(res => res));
    }
  }

  rampDiscount(dialDownRampMap: Map<Number, any>) {
    const reqObj = { 'data': {} };
    for (let i = 0; i < this.dnaRampDiscount.length; i++) {
      const obj = this.dnaRampDiscount[i];
      reqObj['data'][obj['suiteId']] = obj['selectedValue'];
      if (this.dialDownRampChangeMap.has(obj['suiteId'])) {
        const mapObj = this.dialDownRampChangeMap.get(obj['suiteId'])
        reqObj['data'][obj['suiteId']] = mapObj['changeValue'];
      }

    }
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/rampCreditChange', reqObj).pipe(map(res => res));
  }

  // This method is use to create groups for sececurity.
  prepareGroupsForSecurity(suites, suiteLineItemMap, suiteIds, suiteGroupLineItemMap) {
    const suiteGroupMap = new Map<string, any>();
    const suitesLength = suites.length;
    for (let i = 0; i < suitesLength; i++) {
      const suiteObj = suites[i];
      suiteIds.push(suiteObj.suiteId);
      if (suiteObj.lineItems) {
        let children = [];
        suiteGroupMap.clear();
        const lineItems = suiteObj.lineItems;
        const lineItemsLength = lineItems.length;
        for (let j = 0; j < lineItemsLength; j++) {
          suiteLineItemMap.set(lineItems[j].suiteId + lineItems[j].lineItemId, lineItems[j]);
          if (lineItems[j].groupName) {
            if (suiteGroupMap.has(lineItems[j].groupName)) {
              children = suiteGroupMap.get(lineItems[j].groupName);
              children.push(lineItems[j]);
            } else {
              children = [];
              children.push(lineItems[j]);
              suiteGroupMap.set(lineItems[j].groupName, children);
            }
            if (lineItems[j].productTypeId === 2) {
              const key = lineItems[j].groupName + '-' + lineItems[j].productTypeId + '-' + lineItems[j].suiteId;
              if (suiteGroupLineItemMap.has(key)) {
                children = suiteGroupLineItemMap.get(key);
                if (lineItems[j]['eaQuantity'] === 1) {
                  if (this.selectedSuiteGroupLineItemMap.get(key)) {
                    let selectedCount = this.selectedSuiteGroupLineItemMap.get(key);
                    this.selectedSuiteGroupLineItemMap.set(key, ++selectedCount);
                  } else {
                    this.selectedSuiteGroupLineItemMap.set(key, 1);
                  }
                }
                children.push(lineItems[j]);
              } else {
                children = [];
                children.push(lineItems[j]);
                suiteGroupLineItemMap.set(key, children);
                if (lineItems[j]['eaQuantity'] === 1) {
                  this.selectedSuiteGroupLineItemMap.set(key, 1);
                }
              }
            }
          }
          if (this.appDataService.archName === this.constantsService.SECURITY){ // set only for security architecture
            lineItems[j]['name'] = lineItems[j].lineItemDescription + ' (' + lineItems[j].name + ')';
          }
        }
        const childrenWithGroup = [];
        for (const key of Array.from(suiteGroupMap.keys())) {
          const groupChild = this.prepareGroupLineItem(key);
          childrenWithGroup.push(groupChild);
          const groupLineItems = suiteGroupMap.get(key);
          childrenWithGroup.push(...groupLineItems);
        }
        delete suiteObj.lineItems;
        suiteObj.children = childrenWithGroup;
      }
    }
  }


  private prepareGroupLineItem(key) {
    const lineItem = {
      'suiteName': 'EMAIL SECURITY',
      'suiteDescription': 'Cisco EA 2.0 Choice - Security Suites - Email',
      'groupName': 'Others',
      'lineItemType': '',
      'productName': '',
      'productDescription': '',
      'bookingsQuantity': '',
      'eaQuantity': '',
      'productTypeId': 1,
      'name': 'E2SF-E-CES-10',
      'lineItemId': '',
      'lineItemDescription': '',
      'netTcvBeforeAdjustment': '',
      'netTcvPostAdjustment': '',
      'unitListPrice': '',
      'extendedListPrice': '',
      'purchaseAdjustment': '',
      'qualifiedSuite': 'Y',
      'eaQuantityEditable': false,
      'foundationEaQtyEditable': false,
      'advancedEaQtyEditable': false,
      'advantageEaQtyEditable': false,
      'essentialsEaQtyEditable': false,
      'ecsEaQtyEditable': false,
      'advantageBfC1EaQtyEditable': false,
      'advantageBfLbEaQtyEditable': false,
      'advantageBfEaQtyEditable': false,
      'advantageGfEaQtyEditable': false,
      'premierBfC1EaQtyEditable': false,
      'premierBfLbEaQtyEditable': false,
      'premierBfEaQtyEditable': false,
      'premierGfEaQtyEditable': false,
      'advancedAddonEaQtyEditable': false,
      'controllerEaQtyEditable': false,
      'subscriptionDiscount': '',
      'subscriptionServiceDiscount': '',
      'subscriptionFlag': false,
      'advancedDeploymentFlag': false,
      'lineItemUpdated': false,
      'advantageBf4QtyEditable': false,
      'advantageBf5QtyEditable': false,
      'advantageBf6QtyEditable': false,
      'premierBf4QtyEditable': false,
      'premierBf5QtyEditable': false,
      'premierBf6QtyEditable': false,
      'onlyBooleanAllowed': false,
      'dnaAdvantageEaQtyEditable': false,
      'dnaPremierEaQtyEditable': false,
      'displayName': ''
    };
    lineItem.name = key;
    lineItem.lineItemType = this.LINE_ITEM_TYPE;
    return lineItem;

  }
}

export class sliderObjFactory {
  static getSliderObj() {
    return {
      name: '',
      min: 0,
      max: 100,
      from: 0,
      grid: true,
      grid_num: 10,
      tab: false,
      selected: false
    };
  }
}

export class EaQtyFactory {
  static readonly MIN_WIDTH = { SMALL_MIN_WIDTH: 30, BIG_MIN_WIDTH: 60 };
  // static readyOnly WIDTHS = {'EMPTY_COLOUMN_WIDTH':30};

  static getEaQty() {
    const eaQty: RecalculateAllRequestObj = {
      suiteId: '',
      lineItemId: '',
      lineItemDescription: '',
      lineItemUpdated: false,
      ibAdvantageBfC1EaQty: '',
      ibAdvantageBfEaQty: '',
      ibAdvantageBfLbEaQty: '',
      ibAdvantageGfEaQty: '',
      ibAdvantageBf6Qty: '',
      eaQuantity: '',
      controllerEaQty:''
    };
    return eaQty;
  }
}


export interface RecalculateAllRequestObj {
  suiteId: string;
  lineItemId: string;
  lineItemDescription?: string;
  foundationEaQty?: string;
  lineItemType?: string;
  advancedEaQty?: string;
  advantageEaQty?: string;
  essentialsEaQty?: string;
  ecsEaQty?: string;
  dnaAdvantageEaQty?: string;
  advantageBfC1EaQty?: string;
  advantageBfLbEaQty?: string;
  advantageBfEaQty?: string;
  advantageGfEaQty?: string;
  dnaPremierEaQty?: string;
  premierBfC1EaQty?: string;
  premierBfLbEaQty?: string;
  premierBfEaQty?: string;
  premierGfEaQty?: string;
  advancedAddonEaQty?: string;
  controllerEaQty?: string;
  dcSubscriptionEaQty?: string;
  lineItemUpdated: boolean;
  advantageBf4Qty?: string;
  advantageBf5Qty?: string;
  advantageBf6Qty?: string;
  premierBf4Qty?: string;
  premierBf5Qty?: string;
  premierBf6Qty?: string;
  ibAdvantageBf4Qty?: string;
  ibAdvantageBf5Qty?: string;
  ibAdvantageBfC1EaQty?: string;
  ibAdvantageBfEaQty?: string;
  ibAdvantageBfLbEaQty?: string;
  ibAdvantageGfEaQty?: string;
  ibAdvantageBf6Qty?: string;
  eaQuantity?: string;
  displayName?: string;
}


export interface RecalculateAllEmitterObj {
  recalculateButtonEnable: boolean;
  recalculateAllApiCall: boolean;
}
