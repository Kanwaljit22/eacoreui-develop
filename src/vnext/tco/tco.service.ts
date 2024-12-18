import { Injectable } from '@angular/core';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { TcoStoreService } from './tco-store.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: VnextResolversModule
})
export class TcoService {

  addAdditionalCost : boolean;
  advancedModelling : boolean;
  refreshGraph = new Subject()

  constructor(private tcoStoreService: TcoStoreService, private utilitiesService: UtilitiesService) { }

  mapTcoData(){
    //to create pricing object
    if(this.tcoStoreService.metaData.tcoMetaData.pricing?.childs && (this.tcoStoreService.tcoData.ea.pricing || this.tcoStoreService.tcoData.alc.pricing)){
      let groupData:any = {
        label: this.tcoStoreService.metaData.tcoMetaData.pricing.label,
        advancedModelingAllowed:this.tcoStoreService.metaData.tcoMetaData.pricing.advancedModelingAllowed,
        childs:[],
      }
      let addGroup = false
      this.tcoStoreService.metaData.tcoMetaData.pricing.childs.forEach((child) =>{
        const rowData = child;
        let addRow = false
        if(this.tcoStoreService.tcoData.ea.pricing?.sw[child.referenceId]){
          addRow = true
          rowData.ea.sw['value'] = this.tcoStoreService.tcoData.ea.pricing?.sw[child.referenceId]
        } else if(rowData.ea.sw.editable){
          rowData.ea.sw['value'] = '--'
        }
        if(this.tcoStoreService.tcoData.ea.pricing?.cx[child.referenceId]){
          addRow = true
          rowData.ea.cx['value'] = this.tcoStoreService.tcoData.ea.pricing?.cx[child.referenceId]
        } else if(rowData.ea.cx.editable){
          rowData.ea.cx['value'] = '--'
        }
        if(this.tcoStoreService.tcoData.alc.pricing?.sw[child.referenceId]){
          addRow = true
          rowData.alc.sw['value'] = this.tcoStoreService.tcoData.alc.pricing?.sw[child.referenceId]
        } else if(rowData.alc.sw.editable){
          rowData.alc.sw['value'] = '--'
        }
        if(this.tcoStoreService.tcoData.alc.pricing?.cx[child.referenceId]){
          addRow = true
          rowData.alc.cx['value'] = this.tcoStoreService.tcoData.alc.pricing?.cx[child.referenceId]
        } else if(rowData.alc.cx.editable){
          rowData.alc.cx['value'] = '--'
        }
        if(addRow){
          addGroup = true
          groupData.childs.push(rowData)
        }
      })
      
      if(addGroup){
        this.tcoStoreService.pricing = groupData
        this.utilitiesService.sortArrayByDisplaySeq(this.tcoStoreService.pricing.childs);
        this.tcoStoreService.pricing.saving = this.tcoStoreService.tcoData.savingsInfo.pricing;
      }
    }
    //to create partnerMarkup object
    if(this.tcoStoreService.metaData.tcoMetaData.partnerMarkup && (this.tcoStoreService.tcoData.ea?.partnerMarkup || this.tcoStoreService.tcoData.alc?.partnerMarkup)){
      this.tcoStoreService.partnerMarkup = this.tcoStoreService.metaData.tcoMetaData.partnerMarkup
      this.tcoStoreService.partnerMarkup.enrollments = []
      for(let i = 0; i < this.tcoStoreService.tcoData.ea.partnerMarkup.length; i++){
        const portfolio = this.tcoStoreService.metaData.enrollmentsConfig?.find(portfolio => portfolio.id === this.tcoStoreService.tcoData.ea.partnerMarkup[i].enrollmentId);
        const enrollment = {
          enrollmentId: this.tcoStoreService.tcoData.ea.partnerMarkup[i].enrollmentId,
          name: portfolio?.name,
          displaySeq: portfolio?.displaySeq,

          eaSwPercent:this.tcoStoreService.tcoData.ea.partnerMarkup[i].swPercent,
          eaCxPercent:this.tcoStoreService.tcoData.ea.partnerMarkup[i].hwCxPercent,
          
          alcSwPercent:this.tcoStoreService.tcoData.alc.partnerMarkup[i].swPercent,
          alcCxPercent:this.tcoStoreService.tcoData.alc.partnerMarkup[i].hwCxPercent,
          cxAvailable: (this.tcoStoreService.tcoData.alc.partnerMarkup[i].cxAvailable && this.tcoStoreService.tcoData.ea.partnerMarkup[i].cxAvailable) ? true : false,
          cxOnlyPurchased: (this.tcoStoreService.tcoData.alc.partnerMarkup[i].cxOnlyPurchased && this.tcoStoreService.tcoData.ea.partnerMarkup[i].cxOnlyPurchased) ? true : false
       }
        this.tcoStoreService.partnerMarkup.enrollments.push(enrollment);
      }
      this.utilitiesService.sortArrayByDisplaySeq(this.tcoStoreService.partnerMarkup.enrollments);
      this.tcoStoreService.partnerMarkup.saving = this.tcoStoreService.tcoData.savingsInfo.partnerMarkup;
    }

    //to create Growth expenses object
    if (this.tcoStoreService.metaData.tcoMetaData.growthExpenses && (this.tcoStoreService.tcoData.ea?.growthExpenses || this.tcoStoreService.tcoData.alc?.growthExpenses)) {
      this.tcoStoreService.growthExpenses = this.tcoStoreService.metaData.tcoMetaData.growthExpenses
      this.tcoStoreService.growthExpenses.enrollments = []
      for (let i = 0; i < this.tcoStoreService.tcoData.ea.growthExpenses.length; i++) {
        const portfolio = this.tcoStoreService.metaData.enrollmentsConfig?.find(portfolio => portfolio.id === this.tcoStoreService.tcoData.ea.growthExpenses[i].enrollmentId);
        const enrollment = {
          enrollmentId: this.tcoStoreService.tcoData.ea.growthExpenses[i].enrollmentId,
          name: portfolio?.name,
          displaySeq: portfolio?.displaySeq,

          eaSwPercent: this.tcoStoreService.tcoData.ea.growthExpenses[i].swPercent,
          eaSwCxPercent: this.tcoStoreService.tcoData.ea.growthExpenses[i].swCxPercent,
          eaHwCxPercent: this.tcoStoreService.tcoData.ea.growthExpenses[i].hwCxPercent,

          alcSwPercent: this.tcoStoreService.tcoData.alc.growthExpenses[i].swPercent,
          alcSwCxPercent: this.tcoStoreService.tcoData.alc.growthExpenses[i].swCxPercent,
          alcHwCxPercent: this.tcoStoreService.tcoData.alc.growthExpenses[i].hwCxPercent,
          cxAvailable: (this.tcoStoreService.tcoData.alc.growthExpenses[i].cxAvailable && this.tcoStoreService.tcoData.ea.growthExpenses[i].cxAvailable) ? true : false,
          hwCxAvailable: (this.tcoStoreService.tcoData.alc.growthExpenses[i].hwCxAvailable && this.tcoStoreService.tcoData.ea.growthExpenses[i].hwCxAvailable) ? true : false,
          swCxAvailable: (this.tcoStoreService.tcoData.alc.growthExpenses[i].swCxAvailable && this.tcoStoreService.tcoData.ea.growthExpenses[i].swCxAvailable) ? true : false,
          cxOnlyPurchased: (this.tcoStoreService.tcoData.alc.growthExpenses[i].cxOnlyPurchased && this.tcoStoreService.tcoData.ea.growthExpenses[i].cxOnlyPurchased) ? true : false
        }
        this.tcoStoreService.growthExpenses.enrollments.push(enrollment);
      }
      this.utilitiesService.sortArrayByDisplaySeq(this.tcoStoreService.growthExpenses.enrollments);
      this.tcoStoreService.growthExpenses.saving = this.tcoStoreService.tcoData.savingsInfo.growthExpenses;
    }
    //to create Inflation object
    if (this.tcoStoreService.metaData.tcoMetaData.inflation && (this.tcoStoreService.tcoData.ea?.inflation || this.tcoStoreService.tcoData.alc?.inflation)) {
        const data = {
          eaSwPercent: this.tcoStoreService.tcoData.ea.inflation.swPercent,
          eaSwCxPercent: this.tcoStoreService.tcoData.ea.inflation.swCxPercent,
          eaHwCxPercent: this.tcoStoreService.tcoData.ea.inflation.hwCxPercent,

          alcSwPercent: this.tcoStoreService.tcoData.alc.inflation.swPercent,
          alcSwCxPercent: this.tcoStoreService.tcoData.alc.inflation.swCxPercent,
          alcHwCxPercent: this.tcoStoreService.tcoData.alc.inflation.hwCxPercent,
          cxAvailable: (this.tcoStoreService.tcoData.alc.inflation.cxAvailable && this.tcoStoreService.tcoData.ea.inflation.cxAvailable) ? true : false,
          hwCxAvailable: (this.tcoStoreService.tcoData.alc.inflation.hwCxAvailable && this.tcoStoreService.tcoData.ea.inflation.hwCxAvailable) ? true : false,
          swCxAvailable: (this.tcoStoreService.tcoData.alc.inflation.swCxAvailable && this.tcoStoreService.tcoData.ea.inflation.swCxAvailable) ? true : false,
          cxOnlyPurchased: (this.tcoStoreService.tcoData.alc.inflation.cxOnlyPurchased && this.tcoStoreService.tcoData.ea.inflation.cxOnlyPurchased) ? true : false
        }
        this.tcoStoreService.inflation = { ...this.tcoStoreService.metaData.tcoMetaData.inflation, ...data }
        this.tcoStoreService.inflation['saving'] = this.tcoStoreService.tcoData.savingsInfo.inflation;
    }
    //to create additional cost object
    if (this.tcoStoreService.metaData.tcoMetaData.additionalCosts && (this.tcoStoreService.tcoData.ea?.additionalCosts?.length || this.tcoStoreService.tcoData.alc?.additionalCosts?.length)) {

      this.tcoStoreService.additionalCosts = this.tcoStoreService.metaData.tcoMetaData.additionalCosts;
      this.tcoStoreService.additionalCosts['childs'] = []
      const eaAdditionalId = this.tcoStoreService.tcoData.ea?.additionalCosts?.map(cost => cost.id);
      const alcAdditionalId = this.tcoStoreService.tcoData.alc?.additionalCosts?.map(cost => cost.id);

      const uniqueIds = [...new Set([...(eaAdditionalId|| []), ...(alcAdditionalId|| [])])];
      uniqueIds.forEach((id) => {
        const eaAdditionalCost = this.tcoStoreService.tcoData.ea?.additionalCosts?.find(additionalCost => additionalCost.id === id);
        const alcAdditionalCost = this.tcoStoreService.tcoData.alc?.additionalCosts?.find(additionalCost => additionalCost.id === id);
        this.tcoStoreService.additionalCosts.childs.push({
          ea:eaAdditionalCost,
          alc:alcAdditionalCost,
          'name':(eaAdditionalCost?.name) ? eaAdditionalCost.name : alcAdditionalCost.name ,
          'id':id
        }) 
      })
    } else {
      this.tcoStoreService.additionalCosts['childs'] = [];
    }
    // updating name for  savings and financial summary of SW & CX enrollemnts
    this.updateEnrollmentDetails(this.tcoStoreService.tcoData.savingsInfo?.softwareEnrollments?.enrollments);
    this.updateEnrollmentDetails(this.tcoStoreService.tcoData.savingsInfo?.servicesEnrollments?.enrollments);
    this.updateEnrollmentDetails(this.tcoStoreService.tcoData.ea?.financialSummary?.swFinancialSummary?.enrollments);
    this.updateEnrollmentDetails(this.tcoStoreService.tcoData.ea?.financialSummary?.cxFinancialSummary?.enrollments);

  }

  // changes to check and set enrollment details for SW and CX enrollments
  updateEnrollmentDetails(enrollments){
    if(enrollments?.length){
      enrollments.forEach((enrollment) =>{
        const portfolio = this.tcoStoreService.metaData.enrollmentsConfig?.find(portfolio => portfolio.id === enrollment.id);
        if(portfolio){
          enrollment.name = portfolio.name,
          enrollment.displaySeq = portfolio.displaySeq
        }
      });
      this.utilitiesService.sortArrayByDisplaySeq(enrollments);
    }
  }
}

export interface ITcoData {
  objId?: string;
  name?: string;
  proposalPriceDirty?: boolean;
  alc?: IAlcEA;
  ea?: IAlcEA;
  savingsInfo?: ISavingsInfo;
  growthModellingInfo?: any;
}

export interface ISavingsInfo extends IPercentAmount {
  pricing?: IPercentAmount;
  partnerMarkup?: IPercentAmount;
  growthExpenses?: IPercentAmount;
  inflation?: IPercentAmount;
  softwareEnrollments?: IEnrollmentsData;
  servicesEnrollments?: IEnrollmentsData;
}

export interface IPercentAmount {
  percent?: number;
  amount?: string;
}

export interface IEnrollmentsData extends IPercentAmount {
  amount?: string;
  enrollments?: Array<IEnrollmentData>;
}

export interface IEnrollmentData {
  name?: string;
  amount?: string;
  id?: number;
  displaySeq?:number;
  cxAvailable?: boolean;
  cxOnlyPurchased?:boolean;
}

export interface IAlcEA {
  partnerNetPrice?: string;
  customerTCO?: string;
  pricing?: any;
  partnerMarkup?: any;
  growthExpenses?: any;
  inflation?: any;
  additionalCosts?: Array<any>;
  financialSummary?: IFinancialSummary;
}

export interface IFinancialSummary {
  totalAmount?: string;
  swFinancialSummary?: IEnrollmentsData;
  cxFinancialSummary?: IEnrollmentsData;
}

export interface ITcoMetaData {
 enrollmentsConfig?:Array<enrollmentConfigMeta>;
 tcoMetaData?:ITcoConfigMeta;
}
export interface enrollmentConfigMeta {
  id?:number;
  name?:string;
  displaySeq?:number;
 }

export interface ITcoConfigMeta {
  pricing?: ITcoPricingMeta;
  partnerMarkup?: IMetaLabel;
  growthExpenses?: IMetaLabel;
  inflation?: IMetaLabel;
  additionalCosts?: IMetaLabel;
 }
export interface ITcoPricingMeta extends IMetaLabel{
  childs?: Array<IPricingChildMeta>
 }
 export interface IPricingChildMeta extends IMetaLabel{
  name?: string;
  referenceId?: string;
  isPercentageValue?: boolean;
  displaySeq?: number;
  alc?:any;
  ea?:any;
  info?:string;
  isNegativeValue?:boolean;
 }

export interface IMetaLabel {
  label?: string;
  info?: string;
  advancedModelingAllowed?: boolean;
 }//meta data interface end

 export interface IPartnerMarkup extends IMetaLabel{
  enrollments?: Array<ITcoEnrollment>;
  saving?:any
 }
 export interface IGrowthExpence extends IMetaLabel{
  enrollments?: Array<ITcoEnrollment>;
  saving?:any
 }
 export interface ITcoEnrollment {
  alcCxPercent?:number;
  alcSwPercent?:number;
  displaySeq?:number;
  eaCxPercent?:number;
  eaSwPercent?:number;
  enrollmentId?:number;
  alcSwCxPercent?:number;
  alcHwCxPercent?:number;
  eaSwCxPercent?:number;
  eaHwCxPercent?:number;
  name?:string;
  cxAvailable?:boolean;
  cxOnlyPurchased?: boolean;
 }
 export interface IInflation  extends IMetaLabel{
  alcHwCxPercent?:number;
  alcSwCxPercent?:number;
  alcSwPercent?:number;
  cxAvailable?:boolean;
  cxOnlyPurchased?: boolean;
  eaHwCxPercent?:number;
  eaSwCxPercent?:number;
  eaSwPercent?:number;
  saving?:any;
 }

 export interface IAdditionalCost extends IMetaLabel{
  childs?: Array<IAdditionalCostChild>;
 }

 export interface IAdditionalCostChild{
  id?:any;
  name?: string;
  ea?: IAdditionalCostEaAlc;
  alc?: IAdditionalCostEaAlc;
 }

 export interface IAdditionalCostEaAlc{
  cxAvailable?: boolean;
  cxOnlyPurchased?: boolean;
  hwCxPercent?: boolean;
  cxPercent?:number;
  swPercent?:number
}