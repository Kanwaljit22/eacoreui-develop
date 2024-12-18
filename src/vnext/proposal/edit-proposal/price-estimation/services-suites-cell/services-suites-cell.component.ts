import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ServicesDiscountComponent } from 'vnext/modals/services-discount/services-discount.component';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { IAtoTier, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { PriceEstimateStoreService } from '../price-estimate-store.service';
import { PriceEstimateService } from '../price-estimate.service';
import { EaService } from 'ea/ea.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-services-suites-cell',
  templateUrl: './services-suites-cell.component.html',
  styleUrls: ['./services-suites-cell.component.scss']
})
export class ServicesSuitesCellComponent implements ICellRendererAngularComp {
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
  showDnxIcon = false;
  @ViewChild('configForm', { static: false }) private configForm: ElementRef;

  constructor(private modalVar: NgbModal, public priceEstimateService: PriceEstimateService, public priceEstimateStoreService: PriceEstimateStoreService, private proposalRestService: ProposalRestService, private vNextService: VnextService, public proposalStoreService: ProposalStoreService,
    public utilitiesService: UtilitiesService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public constantsService: ConstantsService,
    public localizationService:LocalizationService, public vnextStoreService: VnextStoreService) { }

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

      if (this.eaService.features.FIRESTORM_REL) {
        params.data.tiers.forEach((tier) => {
          if (tier?.hasEmbeddedHwSupport) {
            params.dnxEmbedded = tier?.hasEmbeddedHwSupport;
            if (tier.alaCartCoverageFound) {
              this.showDnxIcon = true;
            } else {
              this.showDnxIcon = false;
            }
          }
         
        })
      }
    }

    if (this.params.data.lowerTierAto) {
      this.lowerTierAto = this.params.data.tiers.find(tier => tier.name === this.params.data.lowerTierAto.name);
    }

    if (params.data.ato) {
      let pidKey = params.data.pidType ? 'PID-' + params.data.pidName: '';
      let atoKey = 'ATO-' + params.data.ato;
      let warnKey = '';
      if (params.node.level === 1 || params.data?.atoTierDesc) {
        warnKey = 'ATO-WARN-' + params.data.ato;
      } else {
        warnKey = params.data.pidType ? 'PID-WARN' + params.data.pidName: 'ATO-WARN-' + params.data.ato;
      }
      this.errorMessages = new Set<string>();
      this.warnMessages = new Set<string>();
       if (this.priceEstimateService.messageMap.has(atoKey)) {
        if (params.data.ato === atoKey.substring(atoKey.indexOf('-') + 1) && params.data.hasPids) {
          params.data.error = true;
          this.errorMessages = this.priceEstimateService.messageMap.get(atoKey);
          params.data.arrayOfErrorMessages = Array.from(this.errorMessages);
          if(params.data.arrayOfErrorMessages.length){
            this.priceEstimateStoreService.errorMessagesPresentForCx = true;
          }
        }
      } 

      if (this.priceEstimateService.messageMap.has(pidKey)) {
        if (params.data.pidName === pidKey.substring(pidKey.indexOf('-') + 1)) {
          params.data.error = true;
          this.errorMessages = this.priceEstimateService.messageMap.get(pidKey);
          params.data.arrayOfErrorMessages = Array.from(this.errorMessages);
          if(params.data.arrayOfErrorMessages.length){
            this.priceEstimateStoreService.errorMessagesPresentForCx = true;
          }
        }
      } 
      if (this.priceEstimateService.messageMap.has(warnKey)) {
        params.data.warning = true;
        this.warnMessages = this.priceEstimateService.messageMap.get(warnKey);
        params.data.arrayOfWarningMessages = Array.from(this.warnMessages);
      }
      else {
        params.data.warning = false;
        params.data.error = false;
      }
     }
     if(!this.eaService.features.IB_OPTIMIZATION){
      if((!params.data?.arrayOfErrorMessages?.length && !this.priceEstimateStoreService.selectedCxEnrollment.awaitingResponse && !this.priceEstimateStoreService.selectedCxEnrollment.lineInError) || (this.priceEstimateStoreService.selectedCxEnrollment?.lineInError && !this.proposalStoreService.isReadOnly && !this.priceEstimateStoreService.viewAllSelected && !this.priceEstimateStoreService.selectedCxEnrollment?.cxSoftwareSupportOnly && !this.priceEstimateStoreService.displayIbPullMsg)) {
        this.vnextStoreService.toastMsgObject.isIbFetchCompleted = true;
      } else {
        this.vnextStoreService.toastMsgObject.isIbFetchCompleted = false;
      }
     } 
  }

  refresh(): boolean {
    return false;
  }

  cxApplyDiscount(data){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      windowClass: 'lg',
      backdropClass: 'modal-backdrop-vNext'
    };
    const modalRef = this.modalVar.open(ServicesDiscountComponent, ngbModalOptions);
    modalRef.result.then((result) => {
      if (result.continue) {
        // call api here 
        this.priceEstimateService.applyDiscountForServicesSuiteSubj.next({ request: result.requestObj, enrollmentId: data.enrollmentId });
      }
    });
    modalRef.componentInstance.cxPeData = data;
  }

  public isMultiSuiteDiscout() {
    if (this.params.data.multiProgramDesc && (this.params.data.multiProgramDesc.med || this.params.data.multiProgramDesc.msd || this.params.data.multiProgramDesc.mpd)) {
      return true;
    }
    return false;

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
    const confData = this.priceEstimateStoreService.externalConfigReq.configure.find(Item => Item.atoName === data.ato);
    this.configReqData = JSON.stringify(confData.configUIRequest);
    setTimeout(() => {
      if(this.configReqData){
        this.configForm.nativeElement.submit();
      }
    }, 150);
  }

  updateCxTier(){
    this.priceEstimateService.addMoreSuitesFromGrid.next(true);
  }

}
