import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { PriceEstimateService } from '../price-estimate.service';
import { VnextService } from 'vnext/vnext.service';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IPoolForGrid } from '../price-estimate-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { Options } from '@angular-slider/ngx-slider';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-manage-collab-purchase-adjustment',
  templateUrl: './manage-collab-purchase-adjustment.component.html',
  styleUrls: ['./manage-collab-purchase-adjustment.component.scss']
})
export class ManageCollabPurchaseAdjustmentComponent implements OnInit, OnDestroy {


  showSuites = false;
  showCredits = false;
  showDurations = false;
  rampEligibilityData = []
  creditCategoryMap = new Map<string, any>();
  durationArray = [];
  displayDurationDropdown = false;
  displayAddCredit = false;
  rowData = [];
  gridDataMap = new Map<string, any>();
  suiteName;
  updatedAtoArray = [];
  selectedSuite: any = {}
  enrollmentId = 0;
  selectedDuration: any;
  selectedCreditCategory: any = {}
  startingFrom: any
  discountToUpdate = 0
  displayContractNo = false;
  contractNumbers = ''
  isPartnerLoggedIn = false;
  disqualifiedLegend = false;
  showWarningForNoCredits = false;

  @Input() poolArray: Array<IPoolForGrid> = [];
  options: Options = {
    floor: 40,
    ceil: 100,
    maxLimit: 100,
    showTicksValues: true,
    step: 10,
    precisionLimit: 2, // limit to 2 decimal points
    enforceStepsArray: false, // set false to allow float values
    enforceStep: false, // set false to allow float values
    showTicks: true,
    noSwitching: true
  };
  incompatibleFeatures = [];
  @Input() selectedEnrollemnt: IEnrollmentsInfo = {};
  duration: number;
  qty: number;
  durationLimit: number;
  maxQtyLimit: number;
  isLtoSelected = false;
  durationMsg = false;
  qtyMsg = false;
  ltoCreditMethod = '';
  ltoCreditCategory: any = {};
  constructor(public priceEstimateService: PriceEstimateService, public proposalStoreService: ProposalStoreService, public dataIdConstantsService: DataIdConstantsService,
              private vnextService: VnextService, private proposalRestService: ProposalRestService, public utilitiesService: UtilitiesService, public constantsService: ConstantsService,
              private eaService: EaService,private eaRestService: EaRestService, public localizationService:LocalizationService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.enrollmentId = this.poolArray[0].enrollmentId;
    this.getData();
    this.suiteName = this.poolArray[0].childs[0].poolSuiteLineName
    if (this.eaService.isPartnerUserLoggedIn()){
      this.isPartnerLoggedIn = true;
    }
  }
  ngOnDestroy() {
    this.priceEstimateService.refreshPeGridData.next(true);
    this.renderer.removeClass(document.body, 'position-fixed');
  }



  getData() {
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/ato-ramp-eligibility?e=' + this.enrollmentId;
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.rampEligibilityData = response.data.lines;
        this.rowData = response.data.proposalLine.atos;
        this.startingFrom = new Date(this.utilitiesService.formateDate(response.data.proposalLine.atos[0].billingTerm.rsd));
        this.startingFrom = this.startingFrom.toString().slice(0, 15)

        this.prepareData();

      } else {
        //code to display error msg 
      }
    });
    //   this.rampEligibilityData = this.lines //response.data.lines;
    //   this.rowData = this.proposalLine.atos;
    //   this.prepareData();
  }

  prepareData() {
    if(this.rampEligibilityData && this.rampEligibilityData.length === 1){
      this.selectedSuite = this.rampEligibilityData[0];
      this.perpareCreditCategory(this.selectedSuite)
    }
    this.prepareGridMap();

  }

  prepareGridMap(){
    if(this.rowData && this.rowData.length && this.rowData[0].credits){
      this.rowData[0].credits.forEach(element => {
        if (this.eaService.features.STO_REL) {
          if (element.display) {
            const row = this.gridDataMap.get(element.rampName)
            if (row) {
              row.push(element)
            } else {
              this.gridDataMap.set(element.rampName, [element])
            }
          }
        } else {
          const row = this.gridDataMap.get(element.rampName)
          if(row){
            row.push(element)
          } else {
            this.gridDataMap.set(element.rampName, [element])
          }
        }
      });
    }
  }
  perpareCreditCategory(suite) {
    if (this.selectedSuite.selected) {
      this.selectedSuite.selected = false;
    }
    this.selectedDuration = '';
    this.creditCategoryMap.clear();
    this.selectedCreditCategory = {}
    this.incompatibleFeatures = [];
    this.durationArray = []
    this.displayAddCredit = false;
    this.displayDurationDropdown = false;
    this.showSuites = false;
    suite.selected = true;
    this.selectedSuite = suite;
    this.selectedSuite.rampDetails.forEach(rampDetail => {
      rampDetail['addedInGrid'] = false;

      if(this.rowData && this.rowData.length && this.rowData[0].credits){
        if(this.rowData[0].credits.find(item => item.rampName === rampDetail.rampName)){
          rampDetail['addedInGrid'] = true;
          if (rampDetail.incompatibleFeatures && rampDetail.incompatibleFeatures.length) {
            rampDetail.incompatibleFeatures.forEach(element => {
              this.incompatibleFeatures.push(element);
            });
          }
        }

      }
    })
    this.selectedSuite.rampDetails.forEach(rampDetail => {
      if (!rampDetail['addedInGrid'] && !this.incompatibleFeatures.includes(rampDetail.rampName)) {
        const data = this.creditCategoryMap.get(rampDetail.type)
        if (data) {
          data.rampDetails.push(rampDetail);
        } else {
          this.creditCategoryMap.set(rampDetail.type, { 'group': rampDetail.type, 'rampDetails': [rampDetail] });
        }
      }
    })
    this.showSuites = false;
  }

  creditCategorySelected(creditCategory) {
    this.displayDurationDropdown = false;
    this.displayContractNo = false;
    this.selectedDuration = '';
    this.resetLtoValues();
    if(creditCategory.type === "Residual"){
      this.displayContractNo = true;

    } else if(creditCategory.discountDetails){

      this.displayDurationDropdown = true;
      if (creditCategory.discountDetails && creditCategory.discountDetails.length) {
        this.durationArray = creditCategory.discountDetails;
      }

      if(creditCategory.type === "Limited Time Offers" ){
        this.displayDurationDropdown = false;
        this.isLtoSelected = true;
        this.ltoCreditCategory = creditCategory;
        this.checkForDurationLimit(creditCategory);
        if(creditCategory?.maxQty){
          this.maxQtyLimit = creditCategory.maxQty;
        }
        if(creditCategory?.creditMethod){
          this.ltoCreditMethod = creditCategory.creditMethod
        }
      }
    }

    this.selectedCreditCategory = creditCategory;
    this.showCredits = false;
    this.displayAddCredit = false;
    this.contractNumbers = '';
  }

  // to set LTO duration limit
  checkForDurationLimit(creditCategory) {
    let duration = creditCategory.term;
    let enrollmentTerm = this.selectedEnrollemnt.billingTerm.term;
    if(enrollmentTerm < duration){
      this.durationLimit = enrollmentTerm
    } else if(enrollmentTerm > duration){
      this.durationLimit = duration;
    } else {
      if(duration){
        this.durationLimit = duration
      } else {
        this.durationLimit = enrollmentTerm;
      }
    }
    
  }

  selectDuration(term) {
    this.selectedDuration = term
    this.showDurations = false;
    this.displayAddCredit = true;
  }

  addCredit() {//this is only to add new credit using dropdowns 

    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=ATO-RAMP-UPDATE';
    let reqOj;
    const params = {
      name: this.selectedCreditCategory.rampName
    }

    if (this.selectedDuration) {
      params['term'] = this.selectedDuration.term;
      reqOj = {
        data: {
          proposalObjectId: this.proposalStoreService.proposalData.objId,
          enrollments: [
            {
              enrollmentId: this.enrollmentId,
              atos: [{
                name: this.selectedSuite.sku,
                lnCredits: [{
                  lnCreditType: this.selectedCreditCategory.creditType,
                  creditDetails: this.selectedDuration.creditDetails,
                  userType :  this.selectedCreditCategory.userType,
                  params: params
                }]
              }
              ]
            }
          ]
        }
      }
    } else if(this.contractNumbers){
      reqOj = {
        data: {
          proposalObjectId: this.proposalStoreService.proposalData.objId,
          enrollments: [
            {
              enrollmentId: this.enrollmentId,
              atos: [{
                name: this.selectedSuite.sku,
                nlCredits: [{
                  nlCreditType: this.selectedCreditCategory.creditType,
                  creditDetails: this.selectedCreditCategory.discountDetails[0].creditDetails,
                  params: params,
                  contractNumbers: this.contractNumbers,
                  userType :  this.selectedCreditCategory.userType
                }]
              }
              ]
            }
          ]
        }
      }
    } else if(this.isLtoSelected){
      params['term'] = this.duration;
      if(this.ltoCreditMethod === 'QUANTITY' && this.qty){
        params['migrationQuantity'] = this.qty;
      }
      this.selectedDuration = this.ltoCreditCategory.discountDetails[0];
      reqOj = {
        data: {
          proposalObjectId: this.proposalStoreService.proposalData.objId,
          enrollments: [
            {
              enrollmentId: this.enrollmentId,
              atos: [{
                name: this.selectedSuite.sku,
                lnCredits: [{
                  lnCreditType: this.selectedCreditCategory.creditType,
                  creditDetails: this.selectedDuration.creditDetails,
                  userType :  this.selectedCreditCategory.userType,
                  params: params
                }]
              }
              ]
            }
          ]
        }
      }
    }
    this.eaRestService.postApiCall(url, reqOj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {

        if (response.data === undefined) {
          this.showWarningForNoCredits = true;
        } else {
          this.rowData = response.data.proposalLine.atos;
          this.showWarningForNoCredits = false;

          this.resetValues();
          this.prepareData()//pass proposalLinese
        }
      }
    });
  }


  updateCredits(close?) {
    const url = 'proposal/' + this.proposalStoreService.proposalData.objId + '?a=ATO-RAMP-DELETE';
    const reqOj = {
      data: {
        enrollments: [{
          enrollmentId: this.enrollmentId,
          atos:this.updatedAtoArray
        }]
      }
    }
    this.eaRestService.postApiCall(url, reqOj).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {

        if (close) {
          this.priceEstimateService.showPurchaseAdj = false;
        } else{
          this.rowData = response.data.proposalLine.atos;
          this.resetValues();
          this.prepareData()//pass proposalLinese 
        }
      }
    });

  }

  resetValues() {
    this.updatedAtoArray = [];
    this.selectedCreditCategory = {}
    this.durationArray = [];
    this.displayAddCredit = false;
    this.selectedDuration = ''
    this.displayDurationDropdown = false;
    this.creditCategoryMap.clear();
    this.displayContractNo = false;
    this.contractNumbers = '';
    this.gridDataMap.clear()
    this.incompatibleFeatures = [];
    this.resetLtoValues();
  }

  // to reset lto values
  resetLtoValues(){
    this.isLtoSelected = false;
    this.duration = undefined;
    this.qty = undefined;
    this.durationLimit = undefined;
    this.maxQtyLimit = undefined;
    this.ltoCreditMethod = '';
    this.ltoCreditCategory = {};
    this.durationMsg = false;
    this.qtyMsg = false;
  }
  deleteCredit(credit){

    const skuName  = this.selectedSuite.sku ? this.selectedSuite.sku : this.rowData[0].name;
    let request:any = {name: skuName};
    if(credit.l2nCreditType){
      request['lnCredits'] = [{
        params: {
          name: credit.rampName
        }
      }]
    } else {
      request['nlCredits'] = [{
        params: {
          name: credit.rampName
        }
      }]
    }
    this.updatedAtoArray.push(
        request
    )
    this.updateCredits();
  }

  // event to check and allow numbers, comma, backspace, copy & paste actions
  isNumberEvent($event) {
    if (!($event.keyCode >= 48 && $event.keyCode <= 57 && !$event.shiftKey ||
      $event.keyCode >= 96 && $event.keyCode <= 105 || $event.keyCode === 8 || $event.keyCode === 37 ||
      $event.keyCode === 39 || $event.keyCode === 188 || ($event.ctrlKey && ($event.keyCode === 67 || $event.keyCode === 65 || $event.keyCode === 86)))) {
      $event.preventDefault();
    }
  }

  // to remove any spaces / alphabtets addedin the text
  checkContractNumber() {
    let text = this.contractNumbers;
    text = text.replace(/[^0-9,]/g, '');
    this.contractNumbers = text.trim();
  }

  //duration validation
  checkDuration(){
    if(this.duration > this.durationLimit || this.duration < 1){
      this.durationMsg = true;
    } else {
      this.durationMsg = false;
    }
  }

  // check for qty validation
  checkQty(){
    if(this.qty > this.maxQtyLimit || this.qty < 1){
      this.qtyMsg = true;
    } else {
      this.qtyMsg = false;
    }
  }

  // check for duration and qty based on credit method
  checkForDurationQty(){
    if(this.ltoCreditMethod === "AMOUNT"){
      if (this.duration && this.duration > 0){
        return true;
      }
      return false;
    } else{
      if(this.duration && this.duration > 0 && this.qty && this.qty > 0 ){
        return true;
      }
      return false;  
    }      
  } 

  showLegend() {
    this.disqualifiedLegend = true;
  }
}

