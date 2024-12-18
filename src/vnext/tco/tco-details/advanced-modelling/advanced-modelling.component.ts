import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { MessageService } from 'vnext/commons/message/message.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { TcoStoreService } from 'vnext/tco/tco-store.service';

import { TcoService } from 'vnext/tco/tco.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-advanced-modelling',
  templateUrl: './advanced-modelling.component.html',
  styleUrls: ['./advanced-modelling.component.scss']
})
export class AdvancedModellingComponent implements OnInit{

  @Input() modelType;

  maxTermArray: Array<number>;
  advanceModelingData:any;
  openBulkUpdateTip = false;
  bulkOption :string;
  incrementalValue;
  selectedAtos = [];
  allPoolCheck = false;
  allEnrollmentCheck = false;
  allEnrollmentCheckCX = false;
  bulkOptions = [this.constantsService.SAME_TO_ALL, this.constantsService.INCREMENTAL];
  bulkPercentage;
  updatedByUser = false;
  updatedTerm:any;
  isIncremental = false;
  updatedAtos = [];
  isYearly = true;
  quartelyYearArray:Array<number>;
  refreshTcoPage = false
  bulkUpdateError = false;
  @Output() updateTcoPage = new EventEmitter();
  showModelDropdown = false;
  modelTypeArr = [ {
    "name": "Growth Expenses",
    "selected": false,
    "id": "growthExpense"
  },{
    "name": "Time Value of Money",
    "selected": false,
    "id": "inflation"
  }];
  selectedModelType: any;
  isToggleUpdated = false;
  bulkUpdateSuccess = false; // set to show bulk 
  isDoubleClick = false;

  constructor(public tcoService :  TcoService,private eaRestService: EaRestService,private vnextService: VnextService,public tcoStoreService: TcoStoreService, private utilitiesService: UtilitiesService, public constantsService: ConstantsService, private messageService: MessageService, private renderer: Renderer2, public localizationService: LocalizationService){

  }
  
  

  ngOnInit() {
    // let objId;
    // if (!this.proposalStoreService.proposalData?.objId) {
    //   this.activatedRoute.params.subscribe(params => {
    //     objId = params['proposalId'];
    //   });
    //   this.router.navigate(['ea/project/proposal/' + objId]);
    // } else {
    //   this.getTcoMetaData();

    // }
    if (this.tcoStoreService.tcoData.growthModellingInfo?.type === this.constantsService.QUARTERLY && this.modelType === this.constantsService.GROWTH_EXPENSE) {
      this.isYearly = false;
    }
    this.getAdvanceModelingData();
    if (this.modelType) {
      this.selectedModelType = this.modelTypeArr.find(type => type.id === this.modelType);
    } else {
      this.selectedModelType = this.modelTypeArr[1]
    }
  }

  selectType(type) {
    this.selectedModelType = type;
    this.modelType = type.id
    if (this.tcoStoreService.tcoData.growthModellingInfo?.type === this.constantsService.QUARTERLY && this.modelType === this.constantsService.GROWTH_EXPENSE) {
      this.isYearly = false;
    } else {
      this.isYearly = true;
    }
    this.getAdvanceModelingData();
    this.showModelDropdown = false;
  }

  getAdvanceModelingData(){//remove this method
    //const url =  "assets/data/tco-configuration/growth_expenses_am.json ";//remove this json call with real API
    let url;
    this.bulkUpdateError = false;
    this.bulkUpdateSuccess = false;
    const type = this.isYearly ? this.constantsService.YEARLY : this.constantsService.QUARTERLY
    if (this.modelType === this.constantsService.GROWTH_EXPENSE) {
      url = this.vnextService.getAppDomainWithContext + 'proposal/tco/' + this.tcoStoreService.tcoData.objId +'/advance-expense?m=GROWTH_EXPENSE&t=' + type //add tco objid
    } else {
      url = this.vnextService.getAppDomainWithContext + 'proposal/tco/' + this.tcoStoreService.tcoData.objId +'/advance-expense?m=INFLATION&t=' + type //add tco objid
    }
    this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
       this.setDisplaySeqForData(response.data?.enrollmentConf);
       this.advanceModelingData  = response.data;
       const enrollments = this.advanceModelingData.enrollmentConf;
       if (enrollments) {
         enrollments.forEach(enrollment => enrollment.expand = true)
       }
        if(response.data && response.data.maxTerm){
          this.maxTermArray = new Array(response.data.maxTerm);
          if (!this.isYearly) {
            const yearsCount = ((+response.data.maxTerm%4) > 0) ? 1 : 0;
            const term = Math.floor(+response.data.maxTerm/4) + yearsCount;
            this.quartelyYearArray = new Array(term);
          }
        }
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    });
  }

  // method to set sequence for enrollment,pool and atos
  setDisplaySeqForData(enrollmentData){
    if(enrollmentData){
      this.utilitiesService.sortArrayByDisplaySeq(enrollmentData);
      enrollmentData.forEach(enrollment => {
        this.utilitiesService.sortArrayByDisplaySeq(enrollment.pools);
        enrollment.pools.forEach(pool => {
          if(pool?.atos){
            this.utilitiesService.sortArrayByDisplaySeq(pool.atos);
          }
        });
      });
    }
  }

  applyBulkUpdate() {
    let request;
    const selectedAtosCopy = JSON.parse(JSON.stringify(this.selectedAtos));
    if (this.bulkOption === this.constantsService.INCREMENTAL) {
      
      selectedAtosCopy.forEach((ato, j)=> {
        let value = +this.bulkPercentage;
        ato.termDetails.forEach((term, i)=> {
          const keys = Object.keys(term)
          if (i > 0) {
            value = value + (+this.incrementalValue);
            if(value > 100){
              this.bulkUpdateError = true;
            }
          }
          for (let key of keys) {
            if (key !== 'term') {
              term[key] = value
            }
          }
          if (term.cxPercent) {
            delete term.cxPercent
          }
          term.cxAvailable = undefined;
          term.hwCxAvailable = undefined;
          term.swCxAvailable = undefined;
          term.cxOnlyPurchased = undefined;
        })
      })
      
    } else {
      selectedAtosCopy.forEach((ato)=> {
        ato.termDetails.forEach((term)=> {
          const keys = Object.keys(term)
          for (let key of keys) {
            if (key !== 'term') {
              term[key] = +this.bulkPercentage
            }
          }
          if (term.cxPercent) {
            delete term.cxPercent
          }
          term.cxAvailable = undefined;
          term.cxOnlyPurchased = undefined;
          term.hwCxAvailable = undefined;
          term.swCxAvailable = undefined;
        })
      })
    }
    if(!this.bulkUpdateError){
      request= {
        "data":{
          "type": this.isYearly ? this.constantsService.YEARLY : this.constantsService.QUARTERLY,
          "atos" : selectedAtosCopy
        }
      }
      this.getUpdatedData(request)
    }
    this.openBulkUpdateTip = false;
    this.isIncremental = false;
  }

  recalculate() {
    let request;
    if (this.isToggleUpdated) {
      let atosArr = [];
      const enrollmentData = this.advanceModelingData.enrollmentConf;
      if (enrollmentData.length) {
        enrollmentData.forEach(enrollment => {
          const pools = enrollment.pools;
          if (pools.length) {
            pools.forEach(pool => {
              if (pool.atos.length) {
                pool.atos.forEach(ato => {
                  let atoObj;
                      atoObj = {
                        "name": ato.name,
                        "enrollmentId" : enrollment.id,
                        "termDetails": ato.termDetails
                      }
                      atoObj?.termDetails.forEach(term => {
                        term.cxAvailable = undefined;
                        term.cxOnlyPurchased = undefined;
                        term.swCxAvailable = undefined;
                        term.hwCxAvailable = undefined;
                      });
                      atosArr.push(atoObj)
                });
              }
            });
          }
        });
          
      }
      
      request = {
        "data": {
          "type": this.isYearly ? this.constantsService.YEARLY : this.constantsService.QUARTERLY,
          "atos": (atosArr?.length) ? atosArr : undefined
        }
      }
    } else {
      request = {
        "data": {
          "type": this.isYearly ? this.constantsService.YEARLY : this.constantsService.QUARTERLY,
          "atos": (this.updatedAtos?.length) ? this.updatedAtos : undefined
        }
      }
    }
    
    this.getUpdatedData(request)
  }

  editBulkUpdate() {
    this.openBulkUpdateTip = !this.openBulkUpdateTip;
    this.bulkUpdateError = false;
    this.bulkOption = undefined;
    this.bulkPercentage = undefined;
    this.incrementalValue = undefined;
    this.isIncremental = false;
    this.bulkUpdateSuccess = false;
    this.isDoubleClick = false;
    if(!this.openBulkUpdateTip){
      this.selectedAtos = [];
    }
  }

  selectBulkOption() {
    this.isIncremental = (this.bulkOption === this.constantsService.INCREMENTAL) ? true : false;
  }

  changeAllEnrollmentSelection(enrollment, isCX= false) {
    enrollment.checked = !enrollment.checked
    let pools = enrollment.pools;
    pools.forEach((pool) => {
      pool.checked = enrollment.checked;
      pool.atos.forEach(suite => {
        suite.checked = enrollment.checked;
        this.checkAndSelectAtos(suite, enrollment);
      });
    })
   
  }

  changeAllSuiteSelection(pool, enrollment, isCX= false) {
    console.log(pool, enrollment, isCX)
    pool.checked = !pool.checked;
    pool?.atos.forEach(suite => {
      suite.checked = pool.checked;
      this.checkAndSelectAtos(suite, enrollment);
    });

    enrollment.checked = enrollment?.pools.every(pool => pool.checked ? true : false)
  }

  changeSuiteSelection(suite, pool, enrollment, isCX= false) {
    suite.checked = !suite.checked
   this.checkAndSelectAtos(suite, enrollment);
    

    pool.checked = pool.atos.every(ato => ato.checked ? true : false)
    enrollment.checked = enrollment?.pools.every(pool => pool.checked ? true : false)
    

  }

  checkAndSelectAtos(suite, enrollment) {
    let atoObj;
    atoObj = {
      "name": suite.name,
      "enrollmentId" : enrollment.id,
      "termDetails": suite.termDetails,
    }
    if (suite.checked && !this.selectedAtos.includes(atoObj.name)) {
      this.selectedAtos.push(atoObj)
    } else {
      this.selectedAtos.forEach((ato, i)=> {
        if(ato.name === atoObj.name) {
          this.selectedAtos.splice(i, 1)
        }
      })
    }

  }

  onPercentageChange(event) {
    if (!event.target.value || +event.target.value < 0) {
      event.target.value = 0;
    } else if (+event.target.value > 100) {
      event.target.value = 100;
    }
    event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(+event.target.value))
     setTimeout(() => {
      this.bulkPercentage = event.target.value
     }, 200)
  }

  onIncrementalChange(event) {
    if (!event.target.value || +event.target.value < 0) {
      event.target.value = 0;
    } else if (+event.target.value > 100) {
      event.target.value = 100;
    }
    event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(+event.target.value))
    setTimeout(() => {
    this.incrementalValue = event.target.value
    }, 200)
 }

 keyDown(event, isBulkUpdate?) {// to prevent char and special char 
  if (!this.utilitiesService.isNumberOnlyKey(event) || event.key == 'Tab') {
    event.preventDefault();
  } else {
    let value = ((+event.target.value) + (+event.key))
    const stringValue = (event.target.value) + (event.key)
    if(this.isDoubleClick){
      value = (+event.key)
    }
    if(value > 100 && !isNaN(value)){
      event.preventDefault();
    }else if(stringValue > 100 && !this.isDoubleClick){
      event.preventDefault();
    } else {
      if(!isBulkUpdate){
        this.updatedByUser = true;
      }
      this.isDoubleClick = false;
    }
  }
}
onDoubleClick(){
  this.isDoubleClick = true;
}

keyUp(event, suite, data, type?) {
  if (!event.target.value || +event.target.value < 0) {
      event.target.value = 0;
    } else if (+event.target.value > 100) {
      event.target.value = 100;
    }
  event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(+event.target.value))
  if (data.swPercent) {
    data.swPercent = +data.swPercent
  }
  this.updatedTerm = {swPercent: (data.swPercent) ? +data.swPercent : undefined, term: data.term};
    if(type){
    data[type] = +event.target.value
    this.updatedTerm[type] = +event.target.value
  }
}

  updateValue(event, suite, enrollment, type) {
    this.isDoubleClick = false;
    if(this.updatedTerm){
      let atoObj;
    atoObj = {
      "name": suite.name,
      "enrollmentId": enrollment.id,
      "termDetails": [this.updatedTerm],
    }
    if (this.updatedAtos.length) {
      let alreadyAdded = false;
      this.updatedAtos.forEach((ato) => {
        if (ato.name === atoObj.name) {
          alreadyAdded = true;
          const updateTerm = ato.termDetails.find((terms) => terms.term === this.updatedTerm.term)
          if (updateTerm) {
            updateTerm[type] = this.updatedTerm[type]
          } else {
            ato.termDetails.push(this.updatedTerm);
          }
        }
      });
      if (!alreadyAdded) {
        this.updatedAtos.push(atoObj);
      }
    }
    else {
      this.updatedAtos.push(atoObj);
    }
    }
    this.updatedTerm = undefined;
  }

  getUpdatedData(req) {
    this.bulkUpdateError = false;
    this.bulkUpdateSuccess = false;
    let url;
    if (this.modelType === this.constantsService.GROWTH_EXPENSE) {
      url = this.vnextService.getAppDomainWithContext + 'proposal/tco/' + this.tcoStoreService.tcoData.objId +'/advance-expense?m=GROWTH_EXPENSE' //add tco objid
    } else {
      url = this.vnextService.getAppDomainWithContext + 'proposal/tco/' + this.tcoStoreService.tcoData.objId +'/advance-expense?m=INFLATION' //add tco objid
    }
    this.eaRestService.postApiCall(url, req).subscribe((response: any) => {
      this.messageService.modalMessageClear();
      if (this.vnextService.isValidResponseWithData(response, true)) {
        this.setDisplaySeqForData(response.data?.enrollmentConf);
        this.advanceModelingData = response.data;
        const enrollments = this.advanceModelingData.enrollmentConf;
        if (enrollments) {
          enrollments.forEach(enrollment => enrollment.expand = true)
        }
        this.updatedByUser = false;
        this.updatedTerm = undefined;
        this.refreshTcoPage = true;
        this.openBulkUpdateTip = false;
        this.isToggleUpdated = false;
        this.updatedAtos = []
        this.selectedAtos = [];
        if (response.data && response.data.maxTerm) {
          if (!this.isYearly) {
            const term = Math.floor(+response.data.maxTerm/4) + (+response.data.maxTerm%4);
            this.quartelyYearArray = new Array(term);
          }
          this.maxTermArray = new Array(response.data.maxTerm);
        }
        if(!this.bulkPercentage){
          this.close();
        } else {
          this.bulkUpdateSuccess = true;
        }
        this.bulkPercentage = undefined;
      } else {
        this.messageService.disaplyModalMsg = true;
        this.messageService.displayMessagesFromResponse(response);
      }
    })
  }

  changeViewType() {
    this.isYearly = !this.isYearly;
    this.allEnrollmentCheckCX = false;
    this.allEnrollmentCheck = false;
    this.selectedAtos = [];
    this.isToggleUpdated = true;
    this.getAdvanceModelingData()
  }
  close(){
    if(this.refreshTcoPage){
      this.updateTcoPage.emit()
      this.tcoService.refreshGraph.next(true);
    } 
    this.tcoService.advancedModelling = false;
    this.renderer.removeClass(document.body, 'position-fixed');
  }


}
