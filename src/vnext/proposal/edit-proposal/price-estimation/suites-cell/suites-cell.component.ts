import { EaService } from 'ea/ea.service';
import { FormGroup } from '@angular/forms';
import { IAtoTier } from './../../../proposal-store.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ApplyDiscountComponent } from 'vnext/modals/apply-discount/apply-discount.component';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { PriceEstimateService } from '../price-estimate.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ServicesDiscountComponent } from 'vnext/modals/services-discount/services-discount.component';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-suites-cell',
  templateUrl: './suites-cell.component.html',
  styleUrls: ['./suites-cell.component.scss']
})
export class SuitesCellComponent implements ICellRendererAngularComp {
  params: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  selectedTier:IAtoTier = {};
  lowerTierAto:IAtoTier = {};
  showDropdown = false;
  placement = '';
  configReqData: any ;
  configFormGrp: FormGroup = new FormGroup({});
  errorMessages: Set<string>;
  warnMessages: Set<string>;
  @ViewChild('configForm', { static: false }) private configForm: ElementRef;

  constructor(private el: ElementRef, private modalVar: NgbModal, public priceEstimateService: PriceEstimateService, public priceEstimateStoreService: PriceEstimateStoreService, private proposalRestService: ProposalRestService, private vNextService: VnextService, public proposalStoreService: ProposalStoreService,
              public utilitiesService: UtilitiesService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService,
              public localizationService:LocalizationService, public constantsService: ConstantsService) { }

  agInit(params) {
    this.params = params;
    if (this.params.data.tiers) {
      let tier: IAtoTier;
      if (this.priceEstimateService.updatedTiresMap.size) {
        tier = this.params.data.tiers.find(tier => tier.selected);
      }

      if(!tier){
        tier = this.params.data.tiers.find(tier => tier.name === this.params.data.ato);
        if (!tier) {
          tier = this.params.data.tiers[0];
        }
      }

      this.selectedTier = tier;

    }
    
    if (this.params.data.lowerTierAto) {
      this.lowerTierAto = this.params.data.tiers.find(tier => tier.name === this.params.data.lowerTierAto.name);
    }

   // params.data.childs.ato
   if (params.data.ato) {
    let key = 'ATO-' + params.data.ato;
    let warnKey = 'ATO-WARN-' + params.data.ato;
    this.errorMessages = new Set<string>();
    this.warnMessages = new Set<string>();
    if (this.priceEstimateService.messageMap.has(key)) {
      params.data.error = true;
      this.errorMessages = this.priceEstimateService.messageMap.get(key);
      params.data.arrayOfErrorMessages = Array.from(this.errorMessages);
    } 
    if (this.priceEstimateService.messageMap.has(warnKey)) {
      params.data.warning = true;
      this.warnMessages = this.priceEstimateService.messageMap.get(warnKey);
      params.data.arrayOfWarningMessages = Array.from(this.warnMessages);
    } else {
      params.data.warning = false;
      params.data.error = false;
    }
   }

   // check and set to show subscription data for suite
   if (this.params.data.renewalInfo && this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.size){
     if (!this.params.data.renewalInfo.subscriptions){
      this.params.data.renewalInfo.subscriptions = [];
     }
     if (this.params.data.renewalInfo.subRefIds){
      for (let subRefId of this.params.data.renewalInfo.subRefIds){
        if (this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.has(subRefId) && !this.params.data.renewalInfo.subscriptions.find(data => data.subRefId === subRefId)){
          this.params.data.renewalInfo.subscriptions.push(this.priceEstimateStoreService.renewalSubscriptionDataForSuiteMap.get(subRefId));
        }
      }
     }
   }
  }

  refresh(): boolean {
    return false;
  }

  applyDiscount(data, params) {
    if (data.enrollmentId === 5){
      this.cxApplyDiscount(data);
    } else {
      const requestObj = {
        "data": {
          "enrollments": [
            {
              "enrollmentId": data.enrollmentId
            }
          ],
          "buyingProgram": this.proposalStoreService.proposalData.buyingProgram
        }
      }
      // check for discount lov's present and call api
      if(this.eaService.features.NPI_AUTOMATION_REL){
        const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/discount-lovs';
        this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
          if (this.vNextService.isValidResponseWithData(response)) {
            this.priceEstimateStoreService.discountLovs = response.data;
            this.openApplyDiscountModal(data, params); // open apply discount modal if data present and set
          }
        });
      } else {
        if (!this.priceEstimateStoreService.discountLovs.length) {
          const url = this.vNextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + '/discount-lovs';
          this.proposalRestService.postApiCall(url, requestObj).subscribe((response: any) => {
            if (this.vNextService.isValidResponseWithData(response)) {
              this.priceEstimateStoreService.discountLovs = response.data;
              this.openApplyDiscountModal(data, params); // open apply discount modal if data present and set
            }
          });
        } else {
          this.openApplyDiscountModal(data,params); // open apply discount modal if data present and set
        }
      }
    }
  }

  openApplyDiscountModal(data, params) {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'md';
    ngbModalOptionsLocal.backdropClass = 'modal-backdrop-vNext';
    const modal = this.modalVar.open(ApplyDiscountComponent, ngbModalOptionsLocal);
    
    modal.result.then((result) => {
      if (result.continue) {
        var requestObj;
        if((data.enrollmentId === 4 || (data.enrollmentId === 6 && params.node?.parent?.data?.pidType === "COLLAB"))&& !data.hasPids) {
          // this implies this is collab minor line
          console.log(data.pidName)
          requestObj = {
            "data": {
              "enrollments": [
                {
                  "enrollmentId": data.enrollmentId,
                  "atos": [
                    {
                      "name": data.ato,
                      "discount":{
                        "subsDisc" : data.subscriptionDiscount,
                      } ,
                      "pids" : [
                        {
                          "name": data.pidName,
                          "discount":{
                            "unitNetDiscount" : result.discount.subsDisc,
                          } ,
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        } else {

          requestObj = {
            "data": {
              "enrollments": [
                {
                  "enrollmentId": data.enrollmentId,
                  "atos": [
                    {
                      "name": data.ato,
                      "discount": result.discount
                    }
                  ]
                }
              ]
            }
          }
        }
        // call api here
        this.priceEstimateService.applyDiscountForSuiteSubj.next({ request: requestObj, enrollmentId: data.enrollmentId });
      }
    });
    modal.componentInstance.discountArr = this.priceEstimateService.setEnrollmentsDiscLovs(data);
  }

  cxApplyDiscount(data){
    const modalRef = this.modalVar.open(ServicesDiscountComponent, { windowClass: 'lg', backdropClass: 'modal-backdrop-vNext' });
    modalRef.result.then((result) => {
      if (result.continue) {
        // call api here
        this.priceEstimateService.applyDiscountForSuiteSubj.next({ request: result.requestObj, enrollmentId: data.enrollmentId });
      }
    });
    modalRef.componentInstance.cxPeData = data;
  }

  public isMultiSuiteDiscout() {
    if(this.eaService.features.STO_REL){
      if (this.params.data.multiProgramDesc && (this.params.data.multiProgramDesc.med || this.params.data.multiProgramDesc.msd || this.params.data.multiProgramDesc.mpd || ( this.params.data.multiProgramDesc?.strategicOfferDiscount && this.params.data.multiProgramDesc?.strategicOfferDetails && this.params.data.multiProgramDesc?.strategicOfferDetails?.length))) {
        return true;
      }
    } else {
      if (this.params.data.multiProgramDesc && (this.params.data.multiProgramDesc.med || this.params.data.multiProgramDesc.msd || this.params.data.multiProgramDesc.mpd)) {
        return true;
      }
    }
    return false;

  }
  public changeAtoSelection(tierObj: IAtoTier) {
    if (this.selectedTier.name !== tierObj.name) {//remvoe desc and use name

      const request = {
        selectedTier: this.selectedTier,
        tireToUpdate: tierObj,
        ato: this.params.data.ato
      }
      tierObj.selected = true;
      this.selectedTier.selected = false;
      this.priceEstimateService.updateTierForAtoSubject.next(request);

    }
  }

  openDrop(event, params) {
    params.showDropdown = true;
    if (params.node.expanded || event.clientY + 200 <  window.innerHeight) {
      params.placement = 'bottom';
    } else {
      params.placement = 'top';
    }
  }

  configure(data){
    //this.configReqData = this.priceEstimateStoreService.externalConfigReq.configure.find(Item => Item.atoName === data.ato);
    //this.priceEstimateStoreService.externalConfigReq.url = "https://ccw-wstg.cisco.com/cfgcor/public/config/ConfigUIInterface/storage/process/xaas/partner"
    // this.configReqData = JSON.stringify({
    //   "payloadId": "613acb9de30e812e803d366d",
    //   "configUIRequest": {"payloadId":"613acb9de30e812e803d366d","responseFormat":"XML"},
    //   "atoName": "A-FLEX"
    //   })
    const confData = this.priceEstimateStoreService.externalConfigReq.configure.find(Item => Item.atoName === data.ato);//"https://ccw-cstg.cisco.com/cfgcor/public/config/ConfigUIInterface/storagebyid/process/xaas"
    this.configReqData = confData.configUIRequest.payloadId;
    setTimeout(() => {
      if(this.configReqData){
        this.configForm.nativeElement.submit();
      }
    }, 150);
  }

  updateTier(upgradeType?){
    // check for swtierupgrade only and set showUpgradeSwSuitesTabSection
    if(this.eaService.features.CROSS_SUITE_MIGRATION_REL && this.proposalStoreService.proposalData?.dealInfo?.subscriptionUpgradeDeal && upgradeType){
      this.priceEstimateStoreService.showUpgradeSwSuitesTabSection = true
    }
    this.priceEstimateService.addMoreSuitesFromGrid.next(false);
  }

  showTooltip(tooltip) {
    const e = tooltip._elementRef.nativeElement;
    if (e.offsetWidth < e.scrollWidth) {
      tooltip.open();
    }
  }
  hideTooltip(tooltip) {
    tooltip.close();
  }
  
  openDesriredQtyPopup(params){
    if(params.data.enrollmentId === 6 && params.data.pidType === 'COLLAB'){
      this.configure(params.data);
    } else {
      this.priceEstimateService.openDesriredQtySubject.next(params);
    }
    
  }
}
