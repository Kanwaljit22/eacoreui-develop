import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalPollerService } from './../shared/services/proposal-poller.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualProposalListObj, ConstantsService } from '../shared/services/constants.service';
import { GridOptions } from 'ag-grid-community';
import { UtilitiesService } from '@app/shared/services/utilities.service';
import { MessageService } from '@app/shared/services/message.service';
import { EaStoreService } from 'ea/ea-store.service';
import { map } from 'rxjs/operators'
@Injectable()
export class ProposalDataService {
    isProposalHeaderLoaded = false;
    linkedRenewalSubscriptions = [];
    punchoutFromConfig = false;
    qualInProgressMsg = false;
    isLoccRequired = false;
    isBrownfieldPartner = false;
    readOnlyAccessType = false;
    rwSuperUserAccessType = false;
    roSalesteamAccessType = false;
    displayAnnualBillingMsg = false;
    caseCreatedForCxProposal = false;
    pageName = '';
    configPunchoutUrl = '';
    proposalDataObject = {
        proposalId: null,
        proposalData: {
            'name': "", 'desc': "", "defaultPriceList":'' , "priceList": '', "billingModel": "Prepaid Term","billingModelID": "Prepaid", "eaTermInMonths": 0, "eaStartDate": new Date(),"demoProposal":false, "linkId": 0,
            "eaStartDateStr": "", "eaStartDateFormed": "", "countryOfTransaction": "", "netTCV": "", "status": '', "reOpened":false, "currencyCode": "", "priceListId": 0 ,
            "archName":'', "totalNetPrice": 0, "hasLinkedProposal": false, "groupId": 0,"groupName": '', "eaStartDateDdMmmYyyyStr": "","countryOfTransactionName":"",
            "partner": { 'name': "", "partnerId": 0 },"architecture":'',"isStatusInconsistentCrossArch": false,"isStatusIncompleteCrossArch": false,"isOneOfStatusCompleteCrossArch": false, "isCrossArchitecture": false,"mspPartner": false, "linkedProposalsList": Array<LinkedProposalInfo>(),
            "coTerm": {'subscriptionId':  "", 'eaEndDate': "" , 'coTerm': false}, "loaLanguageClarificationIds": [], "loaNonStdModificationIds": [], "dealId": ""
        },
        defineSuites:{},
        priceEstimation: {},
        tcoData: { 'totalPriceGraphTableData': [] },
        newProposalFlag: false,
        userEditAccess: true,
        createdBy:'',
        noOfSuites : 0,
        existingEaDcSuiteCount : 0,
        billToId : ''
    }
    crateProposalFlow = false;
    readOnlyState = false;
    listProposalData:QualProposalListObj = {data:[],isCreatedByMe: true};
    recentlySplitGroupId = -1;
    securityArchCreateFlow = false;
    isSecurityIncludedinCrossArch = false;
    isSecurityInprogressinCrossArch = false;
    showFinancialSummary = false;
    summaryData : any = [];
    pinnedResult = {};
    public gridOptions: GridOptions;
    private gridApi;
    billingModelMetaData: any;
    selectedArchForQna= '';
    invalidBillingModel = false;
    billingErrorEmitter = new EventEmitter<any>();
    // saveSuiteEmitter = new EventEmitter<any>();
    allow84Term = false;
    is2TUsingDistiSharedPrposal = false
    cxEligible = false; // set to check if proposal is CX Eligible or not
    cxProposalFlow = false;
    cxAllowed = false; // set to allow cx in define suites page 
    cxNotAllowedMsg = '';
    cxNotAllowedReasonCode = '';
    relatedSoftwareProposalId : number;
    relatedSoftwareProposalArchName: string; // to set arch name for related software proposal
    relatedCxProposalId : number;
    relatedCXProposalArchName: string = 'CX'; // set archname for cx proposal
    isAnyCxSuiteSelected = false; // set if any of the cx suites are selected
    cxPeRoadMapEmitter = new EventEmitter<any>(); // to call back/continue in cx PE page 
    nonTransactionalRelatedSoftwareProposal = false;
    isCxAttachedToSoftware = false;
    isPollerServiceInvoked = false;
    pollerSubscibers : any;
    displayBellIcon = false;
    disableSuiteHeader = true;
    hasLegacySuites = false;
    legacySuitesObj = {};
    billToNotPresentEmitter = new EventEmitter<boolean>();
    isRedirectDone = false; // set to true if redirection is done
    suitesData: string = ""; // set to show suitesName selected in proposal summary page
    currentDateFromServer : string;
    isProposalReopened = false;



    constructor(private http: HttpClient, private appDataService: AppDataService,private utilitiesService: UtilitiesService, public messageService: MessageService, private constantsService: ConstantsService,
      private proposalPollerService:ProposalPollerService,
      private blockUiService : BlockUiService, public eaStoreService: EaStoreService) { }

    updateSessionProposal() {
        const sessionObject: SessionData = this.appDataService.getSessionObject();
        sessionObject.proposalDataObj = this.proposalDataObject;
        sessionObject.currency = this.proposalDataObject.proposalData.currencyCode; 
        this.appDataService.setSessionObject(sessionObject);
    }

    validateBillingModel(){

    if (this.proposalDataObject.proposalData.billingModelID !== '') {

      if(this.selectedArchForQna){
        if(this.billingModelMetaData.architectures && this.billingModelMetaData.architectures[this.selectedArchForQna]){
          if(this.billingModelMetaData.architectures[this.selectedArchForQna].includes(this.proposalDataObject.proposalData.billingModelID)){
            this.invalidBillingModel = false;
          } else {
            this.invalidBillingModel = true;
          }
        } else {
          this.invalidBillingModel = false;
        }
      }
      this.billingErrorEmitter.emit(this.invalidBillingModel)
    }
    }

    getConfigURL(){
        return this.http.get(this.appDataService.getAppDomain + 'api/resource/CONFIG_PUCH_OUT_URL'
        );
    }
    getFinancialSummary(proposalId) { // financial sumary api to get financial summary data
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+ proposalId +'/financial-summary').pipe(map(res => res));
    }


    getCxProposalSummary(){
      let proposalId = this.proposalDataObject.proposalId;
      if(this.relatedCxProposalId){
        proposalId = this.relatedCxProposalId;
      }
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId  + '/proposal-item')
      .pipe(map(res => res));
    }

    isAnnualBillingMsgRequired(){
      if(this.proposalDataObject.proposalData.billingModel === 'Annual Billing' && this.appDataService.archName === this.constantsService.DNA){
        this.displayAnnualBillingMsg = true;
      } else {
        this.displayAnnualBillingMsg = false;
      }
    }
    // get and set financial summary data
    getFinancialSummaryData(proposalId) {
      if (this.cxProposalFlow) {
        return ;
      }
        this.getFinancialSummary(proposalId).subscribe((res: any) => {
          if (res && !res.error) {
            try {
              if (res.data) {
                this.summaryData = [];
                if(res.data.loccNotRequired){
                  this.isLoccRequired = false;
                } else {
                  this.isLoccRequired = true;
                }
                if (res.data.brownfieldPartner) {
                  this.isBrownfieldPartner = true;
                } else {
                  this.isBrownfieldPartner = false;
                }
                res.data.tcvSummaries.forEach(element => {
                  element.netTcvBeforeAdjustment = (element.netTcvBeforeAdjustment === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netTcvBeforeAdjustment));
                  element.postPurchaseAdjustmentNetTotalPrice = (element.postPurchaseAdjustmentNetTotalPrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetTotalPrice));
                  element.postPurchaseAdjustmentNetSoftwarePrice = (element.postPurchaseAdjustmentNetSoftwarePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetSoftwarePrice));
                  element.postPurchaseAdjustmentNetServicePrice = (element.postPurchaseAdjustmentNetServicePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.postPurchaseAdjustmentNetServicePrice));
                  element.purchaseAdjustmentNetSoftwarePrice = (element.purchaseAdjustmentNetSoftwarePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetSoftwarePrice));
                  element.purchaseAdjustmentNetTotalAmount = (element.purchaseAdjustmentNetTotalAmount === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetTotalAmount));
                  element.purchaseAdjustmentNetServicePrice = (element.purchaseAdjustmentNetServicePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustmentNetServicePrice));
                  element.rampPurchaseAdjustment = (element.rampPurchaseAdjustment === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.rampPurchaseAdjustment));
                  element.netSoftwarePrice = (element.netSoftwarePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netSoftwarePrice));
                  element.netServicePrice = (element.netServicePrice === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.netServicePrice));
                  // if security arch , check, format the PA value and assign it to Purchase adjustment to show the value of UI
                  if (element.purchaseAdjustment) {
                    element.purchaseAdjustment = (element.purchaseAdjustment === 0) ? "0.00" : this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(element.purchaseAdjustment));
                  } else {
                    element.purchaseAdjustment = "0.00"; // assign to "0.00" if other than security arch
                  }
                  // set the summary data to show in financial summary page 
                  this.summaryData.push({
                    'name': element.name, 'postPurchaseAdjustmentNetTotalPrice': element.postPurchaseAdjustmentNetTotalPrice, 'postPurchaseAdjustmentNetSoftwarePrice': element.postPurchaseAdjustmentNetSoftwarePrice, 'purchaseAdjustment': element.purchaseAdjustment, 'netTcvBeforeAdjustment': element.netTcvBeforeAdjustment,
                    'postPurchaseAdjustmentNetServicePrice': element.postPurchaseAdjustmentNetServicePrice, 'purchaseAdjustmentNetSoftwarePrice': element.purchaseAdjustmentNetSoftwarePrice, 'purchaseAdjustmentNetTotalAmount': element.purchaseAdjustmentNetTotalAmount, 'purchaseAdjustmentNetServicePrice': element.purchaseAdjustmentNetServicePrice,
                    'rampPurchaseAdjustment' : element.rampPurchaseAdjustment
                  });
                });
                var removedData = this.summaryData.shift(); // to remove first element of array i.e, grandTotal
                if (this.gridOptions && this.gridOptions.api) {
                  this.gridOptions.api.setRowData(this.summaryData);
                  setTimeout(() => {
                    this.gridApi.sizeColumnsToFit();
                  }, 200);
                }
                this.pinnedResult = removedData; // set the pinnedresult to removeddata 
              }
    
              // this.blockUiService.spinnerConfig.stopChainAfterThisCall();
            } catch (error) {
              console.error(error);
              this.messageService.displayUiTechnicalError(error);
            }
          }
          else {
            this.messageService.displayMessagesFromResponse(res);
          }
        });
      }

      invokePollerServiceForBellIcon(url,proposalCxParams, proposalCxPriceInfo){        
        this.pollerSubscibers = this.proposalPollerService.invokeGetPollerservice(url).subscribe((res: any) => {
          this.blockUiService.isPollerServiceCall = false;
          this.isPollerServiceInvoked = true;
          if (res.data && res.data.cxParam) {
            if (!res.data.cxParam.awaitingResponse){
              this.proposalPollerService.stopPollerService(); 
              this.displayBellIcon = true;
            }
            if(this.checkForCxGridRefresh(res.data,proposalCxParams,proposalCxPriceInfo)){
              this.displayBellIcon = true; 
           }          
          }
        });
    }


    getCxProposalDataForBellIcon(){
      this.getCxProposalSummary().subscribe((res: any) => {
        if (res && res.data && !res.error){
          if (res.data.cxParam){  
            if(!res.data.cxParam.billTo){
                this.billToNotPresentEmitter.emit();
            }         
            if (res.data.cxParam.awaitingResponse) {              
                  this.invokePollerServiceForBellIcon(this.appDataService.getAppDomain + 'api/proposal/'+this.relatedCxProposalId+'/sync-prices',res.data.cxParam,res.data.priceInfo);       
            }             
          }         
        } else {
          this.messageService.displayMessagesFromResponse(res);
        }
      });
    }

    // method to check and refresh cx grid data 
    checkForCxGridRefresh(data, proposalCxParams, proposalCxPriceInfo){
      if ((data.cxParam.valid !== proposalCxParams.valid) || (data.cxParam.lineInError !== proposalCxParams.lineInError) || (data.priceInfo.netPricePostPA !== proposalCxPriceInfo.netPricePostPA)){
        return true;
      }
      return false;
    }

    checkForRedirection(){   
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+this.proposalDataObject.proposalId+'/bill-to-punchout-details')
          .pipe(map(res => res));   
  }

  // method to get data for services proposal summary
  getCxFinancialSummaryData() {
    let cxPricingData = []
    this.getCxProposalSummary().subscribe((res: any) => {
      if (res && res.data && !res.error) {
        // set to show data on financial summary page
        this.setCxFinancialSummaryData(res.data, [], cxPricingData);
      } else {
        this.messageService.displayMessagesFromResponse(res);
      }
    });
  }

  // method to set services proposal financial summary data 
  setCxFinancialSummaryData(data, suitesArray, cxPricingData) {
    this.suitesData = ''
    const majorLineData = data.majorLines;
    let grandTotal = {
      'name': 'Grand Total',
      'totalPA': '0',
      'suiteUncoveredAssetCredit': '0',
      'suiteResidualCredit': '0',
      'hwServiceAmount': '0',
      'swServiceAmount': '0',
      'netTotalServiceAmount': '0',
      'hwServiceAmountPrePA': '0',
      'swServiceAmountPrePA': '0',
      'swSolutionPA': '0',
      'hwSolutionPA': '0'
    };
    for (const suiteData of majorLineData) {
      let hwServiceAmount = 0;
      let swServiceAmount = 0;
      let netTotalServiceAmount = 0;
      let suiteResidualCredit = 0;
      let suiteUncoveredAssetCredit = 0;
      let hwSolutionPA = 0;
      let hwServiceAmountPrePA = 0;
      let swSolutionPA = 0;
      let swServiceAmountPrePA = 0;
      let totalPA = 0;
      const minorLines = suiteData.minorLines;
      for (const minorLineData of minorLines) {
        // calculate HW/ SW service amount for respective prodcut types of minor lines
        if (minorLineData.productType === 'CX_HW_SUPPORT') {
          hwServiceAmount = hwServiceAmount + ((minorLineData.priceInfo && minorLineData.priceInfo.netPricePostPA) ? minorLineData.priceInfo.netPricePostPA : 0);

          hwSolutionPA = hwSolutionPA + ((minorLineData.priceInfo && minorLineData.priceInfo.cumulativeCredit) ? minorLineData.priceInfo.cumulativeCredit : 0); // calculate hwService PA for hw support lines on Suite

        } else if (minorLineData.productType === "CX_SOLUTION_SUPPORT") {
          swServiceAmount = swServiceAmount + ((minorLineData.priceInfo && minorLineData.priceInfo.netPricePostPA) ? minorLineData.priceInfo.netPricePostPA : 0);

          swSolutionPA = swSolutionPA + ((minorLineData.priceInfo && minorLineData.priceInfo.cumulativeCredit) ? minorLineData.priceInfo.cumulativeCredit : 0); // calculate swService PA for sw support lines on Suite
        }
        //  calculate residual and uncovered asset credits of all minor lines
        suiteResidualCredit = suiteResidualCredit + ((minorLineData.priceInfo && minorLineData.priceInfo.credits && minorLineData.priceInfo.credits.RESIDUAL) ? minorLineData.priceInfo.credits.RESIDUAL : 0);
        suiteUncoveredAssetCredit = suiteUncoveredAssetCredit + ((minorLineData.priceInfo && minorLineData.priceInfo.credits && minorLineData.priceInfo.credits.UNCOVERED) ? minorLineData.priceInfo.credits.UNCOVERED : 0);
        totalPA = totalPA + ((minorLineData.priceInfo && minorLineData.priceInfo.cumulativeCredit) ? minorLineData.priceInfo.cumulativeCredit : 0); // calculate total PA for suite
      }

      netTotalServiceAmount = hwServiceAmount + swServiceAmount; // calculate net total amount for suite
      swServiceAmountPrePA = swServiceAmount - swSolutionPA; // claculate pre PA for SW
      hwServiceAmountPrePA = hwServiceAmount - hwSolutionPA; // calculate pre PA for HW
      // set total of each variables to suites
      suiteData['suiteResidualCredit'] = suiteResidualCredit;
      suiteData['suiteUncoveredAssetCredit'] = suiteUncoveredAssetCredit;
      suiteData['totalPA'] = totalPA;
      suiteData['hwServiceAmount'] = hwServiceAmount;
      suiteData['swServiceAmount'] = swServiceAmount;
      suiteData['netTotalServiceAmount'] = netTotalServiceAmount;

      suiteData['swServiceAmountPrePA'] = swServiceAmountPrePA;
      suiteData['swSolutionPA'] = swSolutionPA;
      suiteData['hwSolutionPA'] = hwSolutionPA;
      suiteData['hwServiceAmountPrePA'] = hwServiceAmountPrePA;


      // add grand total of all suites for each amounts
      grandTotal.suiteResidualCredit = +(grandTotal.suiteResidualCredit) + suiteData['suiteResidualCredit']
      grandTotal.suiteUncoveredAssetCredit = +(grandTotal.suiteUncoveredAssetCredit) + suiteData['suiteUncoveredAssetCredit']
      grandTotal.totalPA = +(grandTotal.totalPA) + suiteData['totalPA']
      grandTotal.hwServiceAmount = +(grandTotal.hwServiceAmount) + suiteData['hwServiceAmount']
      grandTotal.swServiceAmount = +(grandTotal.swServiceAmount) + suiteData['swServiceAmount']
      grandTotal.netTotalServiceAmount = +(grandTotal.netTotalServiceAmount) + suiteData['netTotalServiceAmount']

      grandTotal.swServiceAmountPrePA = +(grandTotal.swServiceAmountPrePA) + suiteData['swServiceAmountPrePA']
      grandTotal.swSolutionPA = +(grandTotal.swSolutionPA) + suiteData['swSolutionPA']
      grandTotal.hwSolutionPA = +(grandTotal.hwSolutionPA) + suiteData['hwSolutionPA']
      grandTotal.hwServiceAmountPrePA = +(grandTotal.hwServiceAmountPrePA) + suiteData['hwServiceAmountPrePA']
    }
    // push grand total
    cxPricingData.push({
      'name': grandTotal.name,
      'totalPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.totalPA)),
      'suiteUncoveredAssetCredit': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.suiteUncoveredAssetCredit)),
      'suiteResidualCredit': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.suiteResidualCredit)),
      'hwServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.hwServiceAmount)),
      'swServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.swServiceAmount)),
      'netTotalServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.netTotalServiceAmount)),
      'hwServiceAmountPrePA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.hwServiceAmountPrePA)),
      'swServiceAmountPrePA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.swServiceAmountPrePA)),
      'hwSolutionPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.hwSolutionPA)),
      'swSolutionPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(grandTotal.swSolutionPA))
    });
    this.pinnedResult = cxPricingData[0]; // set pinnedresult to show grand total for financial summary and summary page
    // add remaining cx suites selected 
    for (const suiteData of majorLineData) {
      suitesArray.push(suiteData.suiteName); // push suite name
      this.suitesData += suiteData.suiteName + ', '; // add suites name with comma seperated
      cxPricingData.push({
        'name': suiteData.suiteName,
        'totalPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['totalPA'])),
        'suiteUncoveredAssetCredit': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['suiteUncoveredAssetCredit'])),
        'suiteResidualCredit': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['suiteResidualCredit'])),
        'hwServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['hwServiceAmount'])),
        'swServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['swServiceAmount'])),
        'hwSolutionPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['hwSolutionPA'])),
        'swSolutionPA': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['swSolutionPA'])),
        'netTotalServiceAmount': this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suiteData['netTotalServiceAmount'])),
      });
    }
    this.summaryData = cxPricingData.filter(a => a.name !== 'Grand Total'); // filter to show suites for financial summary and summary page 
    return;
  }

  // check and set partnerBeGeoId to filter partner in manage teams
  checkAndSetPartnerId(partnerData){
    if (partnerData && partnerData.partnerId) {
      this.proposalDataObject.proposalData.partner.partnerId = partnerData.partnerId;
    } else {
      this.proposalDataObject.proposalData.partner.partnerId = 0;
    }
  }

  setProposalParamsForWorkspaceCaseInputInfo(proposal, accontManager, endCustomerName, fromSummary?){
    let proposalData = proposal;
    let proposalId;
    if (!fromSummary){
      proposalData = proposal.proposalData;
      // check for relatedSfpropsoalId/cx present and set proposal id to it else send loaded proposalID
      proposalId = (this.relatedSoftwareProposalId && !this.nonTransactionalRelatedSoftwareProposal) ? this.relatedSoftwareProposalId : proposal.proposalId;
    } else {
      proposalId = (proposal.relatedSoftwareProposalId && !proposal.nonTransactionalRelatedSoftwareProposal) ? proposal.relatedSoftwareProposalId : proposal.id;
    }
      window['WorkspaceCaseInputInfo']['userId'] = this.appDataService.userInfo.userId;
      //window['WorkspaceCaseInputInfo']["auth"]= this.appDataService.auth_Id;
      window['WorkspaceCaseInputInfo']["proposalID"] = proposalId;
      window['WorkspaceCaseInputInfo']["transactionalID"] = proposalId;
      window['WorkspaceCaseInputInfo']["proposalURL"] = window.location.href;
      window['WorkspaceCaseInputInfo']["startDate"] = this.utilitiesService.formattedDate(new Date(proposalData.eaStartDate));
      if (accontManager){
        window['WorkspaceCaseInputInfo']["accountManager"] = accontManager;
      } else {
        window['WorkspaceCaseInputInfo']["accountManager"] = 'NA'
      }
      window['WorkspaceCaseInputInfo']["endCustomer"] = endCustomerName;
      window['WorkspaceCaseInputInfo']["dealID"] = proposalData.dealId;
      if (proposalData.partner && proposalData.partner.name){
        window['WorkspaceCaseInputInfo']["partnerName"] = proposalData.partner.name;
      } else {
        window['WorkspaceCaseInputInfo']["partnerName"] = "NA"
      }

      if (!window['WorkspaceCaseInputInfo']["auth"] && this.eaStoreService.authToken){
        window['WorkspaceCaseInputInfo']["auth"] =  this.eaStoreService.authToken;
      }

      this.appDataService.proposalDataForWorkspace = window['WorkspaceCaseInputInfo'];
  }

  clearWorkspaceCaseInputInfo() {
    window['WorkspaceCaseInputInfo'] = {
      appName: "EAMP",
      applicationName: "EAMP"
    }
  }

}
export interface PartnerInfo {
    name: string;
    partnerId: number;
    dealIdSystem?: string;
    partnerIdSystem?: any;
  }

export interface LinkedProposalInfo{
    id?: string,
    name?: string,
    architecture?: string,
    currencyCode?: string
    totalNetPrice?: number,
    status?: string
    architecture_code?:string,
    ea_offer_id?:number,
    proposal_group_id?:number,
    proposal_group_name?:string,
  }