import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EaRestService } from 'ea/ea-rest.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { TcoStoreService } from '../tco-store.service';
import { TcoService } from '../tco.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RemoveAdditionalCostComponent } from 'vnext/modals/remove-additional-cost/remove-additional-cost.component';
@Component({
  selector: 'app-tco-details',
  templateUrl: './tco-details.component.html',
  styleUrls: ['./tco-details.component.scss']
})
export class TcoDetailsComponent implements OnInit, OnDestroy {
  updatedByUser = false;
  updatedValue = undefined
  timer: any;
  modelType:string;
  editName = false;
  tcoName = '';
  showDiscountsApplied = true;
  expandedSections = {};
  metaDataSections = [];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  isMetadataLoaded = false;
  isTcoDataLoaded = false;
  isBuyingProgramTransactionTypeMsea = false;
  isDoubleClick = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;

  constructor(public tcoService: TcoService, public proposalStoreService: ProposalStoreService, private router: Router, public renderer: Renderer2,
    private activatedRoute: ActivatedRoute, private vnextService: VnextService, private eaRestService: EaRestService,
    public tcoStoreService: TcoStoreService, public utilitiesService: UtilitiesService, public constantsService: ConstantsService,
    public localizationService: LocalizationService, private modalVar: NgbModal, public dataIdConstantsService: DataIdConstantsService, public elementIdConstantsService: ElementIdConstantsService ) {
  }

  ngOnInit() {
    let proposalObjId;
    if (!this.proposalStoreService.proposalData?.objId) {
      this.activatedRoute.params.subscribe(params => {
        proposalObjId = params['proposalId'];
      });
      this.router.navigate(['ea/project/proposal/' + proposalObjId]); // this is the valid code remove comment after API is working.
      // this.proposalStoreService.proposalData.objId = proposalObjId // remove this line once API is working
      // this.fetchTcoData();//remove this method once API is working
      // this.getTcoMetaData();//remove this method once API is working
    } else {
      if(this.proposalStoreService.tcoCreateFlow){
        this.isTcoDataLoaded = true;
        this.proposalStoreService.tcoCreateFlow = false;
      } else {
        this.fetchTcoData();
      }
      
      this.getTcoMetaData();
      if(this.proposalStoreService.proposalData?.buyingProgramTransactionType === this.constantsService.MSEA){
        this.isBuyingProgramTransactionTypeMsea = true;
      } else {
        this.isBuyingProgramTransactionTypeMsea = false;
      }
    }   
  }

  fetchTcoData(isRefresh?){
    this.isTcoDataLoaded = false
    let tcoId;
    this.activatedRoute.params.subscribe(params => {
      tcoId = params['tcoId'];
    });
    const id = (this.tcoStoreService.tcoData?.objId) ? this.tcoStoreService.tcoData?.objId : tcoId
    let url = this.vnextService.getAppDomainWithContext + 'proposal/tco/' + id;
    if(isRefresh){
      this.tcoService.refreshGraph.next(true);
      url = url + '/refresh';
    }
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.tcoStoreService.tcoData = response.data;
        this.isTcoDataLoaded = true;
        if(this.isMetadataLoaded){
          this.tcoService.mapTcoData();
        }
      }
    })
  }
 
  toggleSection(sectionName: string) {
    this.expandedSections[sectionName] = !this.expandedSections[sectionName];
  }
  
  // getTestData(){//remove this method
  //   this.isTcoDataLoaded = false;
  //   const url =  "assets/data/tco-configuration/tcodata.json";//remove this json call with real API
  //   this.eaRestService.getApiCallJson(url).subscribe((response: any) => {

  //     if (this.vnextService.isValidResponseWithData(response)) {
  //       this.tcoStoreService.tcoData = response.data;
  //       this.isTcoDataLoaded = true;
  //       if(this.isMetadataLoaded){
  //         this.tcoService.mapTcoData();
  //       }
  //     }

  //   });
  // }

  getTcoMetaData() {
    this.isMetadataLoaded = false;
    let url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId +'/tco/meta-data';

    this.eaRestService.getApiCall(url).subscribe((response: any) => {
    // const url =  "assets/data/tco-configuration/tcoMetadata.json";//remove this json call with real API
    //this.eaRestService.getApiCallJson(url).subscribe((response: any) => {

      if (this.vnextService.isValidResponseWithData(response)) {
        this.tcoStoreService.metaData = response.data;
        this.expandedSections = {
          [response.data.tcoMetaData?.pricing?.label]: true,
          [response.data.tcoMetaData?.partnerMarkup?.label]: true,
          [response.data.tcoMetaData?.growthExpenses?.label]: true,
          [response.data.tcoMetaData?.inflation?.label]: true,
          [response.data.tcoMetaData?.additionalCosts?.label]: true,
        };
        this.isMetadataLoaded = true;
        if(this.isTcoDataLoaded){
          this.tcoService.mapTcoData();
        }
      }

    });
  }

  openAdvancedModelling(modeltype) {
    this.modelType = modeltype;
    this.tcoService.advancedModelling = true;
    this.renderer.addClass(document.body, 'position-fixed');
  }

  backToProposal() {
    this.router.navigate(['ea/project/proposal/' + this.proposalStoreService.proposalData.objId]);
  }

  openAdditionalCost() {
    this.tcoService.addAdditionalCost = true;
  }

  keyDown(event, isPercentageValue = true) {// to prevent char and special char 
    // use utilitiesService.isNumberKey if decimal required
    if (!this.utilitiesService.isNumberOnlyKey(event) || event.key == 'Tab') {
      event.preventDefault();
    } else if(isPercentageValue){
      let value = ((+event.target.value) + (+event.key))
      const stringValue = (event.target.value) + (event.key) 
      if(this.isDoubleClick){
        value = (+event.key)
      }
      if(value > 100 && !isNaN(value)){
        event.preventDefault();
      }
       else if(stringValue > 100 && !this.isDoubleClick){
        event.preventDefault();
      } 
      else {
        this.updatedByUser = true;
      }
    } else {
      this.updatedByUser = true;
    }
    if(this.updatedByUser){
      this.isDoubleClick = false
    }
  }

  onDoubleClick(){
    this.isDoubleClick = true;
  }
  
  keyUp(event, isPercentageValue = true, isNegativeValue?) {//update this to have different check for % or number value...
    clearTimeout(this.timer); // clear the settimeout
    if(!event.target.value){
      this.timer = setTimeout(() => {
        this.keyUpEvent(event, isPercentageValue, isNegativeValue)
      }, 1000);
    } else {
        this.keyUpEvent(event, isPercentageValue, isNegativeValue)
    }
  }

  keyUpEvent(event, isPercentageValue = true, isNegativeValue?){
    if(isPercentageValue){
      if (!event.target.value || +event.target.value < 0) {
        event.target.value = 0;
      } else if (+event.target.value > 100) {
        event.target.value = 100;
      }
    } else if(isNegativeValue){
      if (!event.target.value) {
        event.target.value = 0;
      } else if (+event.target.value > 0) {
        event.target.value = +event.target.value * -1;
      }
    }
    event.target.value = +(this.utilitiesService.checkDecimalOrIntegerValue(event.target.value))
    this.updatedValue = event.target.value;
  }

  updateValue(group, type, field, subType = null, enrollment = null, id = null) {
    this.isDoubleClick = false;
    let request;
    if (this.updatedByUser) {
      let payload = {}
      if (enrollment) {// for partner markup/ growth exp
        payload = {
          [group]: [
            {
              'enrollmentId': enrollment.enrollmentId,
              [field]: this.updatedValue
            }
          ]
        }
      } else if (subType) { // for pricing
        payload = {

          [group]: {
            [subType]: { [field]: this.updatedValue }
          }

        };
      } else if(id){//additional cost
        payload = {
          [group]: 
            [{ [field]: this.updatedValue, 'id': id}]
        };
      } else {// inflation 
        payload = {
          [group]: {
            [field]: this.updatedValue
          }
        };
      }

      request = {
        data: {
          [type]: payload
        }
      }
      console.log(request);
      let url = this.vnextService.getAppDomainWithContext + 'proposal/tco/'+ this.tcoStoreService.tcoData.objId;
      this.eaRestService.putApiCall(url,request).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithData(response)) {
          this.tcoStoreService.tcoData = response.data 
          this.tcoService.mapTcoData();
          this.tcoService.refreshGraph.next(true);
        }
  
      });
    }
    this.updatedByUser = false;
    this.updatedValue = undefined;
  }

  editTcoName(){
    this.editName = true;
    this.tcoName = this.tcoStoreService.tcoData.name;
  }

  focusInput(val) {
    const element = this.renderer.selectRootElement('#' + val);
    element.focus();
  }
  cancelNameChange() {
    this.editName = false;
    this.tcoName = ''
  }

  saveUpdatedName() {
    if(!this.tcoName || !this.tcoName.trim().length){
      return;
    }
    let oldName = this.tcoStoreService.tcoData.name;
    let url = 'proposal/tco/' + this.tcoStoreService.tcoData.objId + '/update-name';
    let requestObj = {};
    this.tcoName = this.tcoName.trim();
    requestObj = { data: { name: this.tcoName} };
    if (this.tcoName !== oldName) {
      this.eaRestService.putApiCall(url, requestObj).subscribe((response: any) => {
        if (this.vnextService.isValidResponseWithoutData(response)) {
          oldName = this.tcoName;
          this.tcoStoreService.tcoData.name = this.tcoName;
          this.editName = false;
        } else {
          // future use
          // this.messageService.displayMessagesFromResponse(response);
          this.tcoName = oldName;
        }
      });
    }
  }

  showHideAppliedDiscounts() {
    this.showDiscountsApplied = !this.showDiscountsApplied;
  }

  fetchPPT() {
    let url = 'document/tco/' + this.tcoStoreService.tcoData.objId + '/generate-tco-document?';

    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink); 
      }
    });
  }

  deleteAdditionalCost(additionalCost) {
    const payload: any = {};
    payload.name = additionalCost.name;
    payload.id = additionalCost.id;
    const ngbModalOptionsLocal = this.ngbModalOptions;
    const modalRef = this.modalVar.open(RemoveAdditionalCostComponent, ngbModalOptionsLocal);
    modalRef.componentInstance.additionalCost = payload;
  }

  ngOnDestroy() {
    this.tcoStoreService.tcoData = {};
    this.tcoStoreService.additionalCosts = {};
    this.tcoStoreService.pricing = {};
    this.tcoStoreService.partnerMarkup = {};
    this.tcoStoreService.growthExpenses = {};
    this.tcoStoreService.inflation = {};
    this.tcoStoreService.metaData = {};
  }
}