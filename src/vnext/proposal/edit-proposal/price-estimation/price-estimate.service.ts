import { EaService } from 'ea/ea.service';
import { IPoolForGrid, ISuiteAndLineInfoForGrid, PriceEstimateStoreService, IATOsApiRequest, ISuiteRecalculateAllReq, IEnrollmentApiRequest, IUpgradeSummary, IUpgradeSuites } from './price-estimate-store.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService, IPoolInfo, IEnrollmentsInfo, ISuites, IAtoTier } from './../../proposal-store.service';
import { VnextResolversModule } from 'vnext/vnext-resolvers.module';
import { Injectable } from '@angular/core';
import { ProposalRestService } from 'vnext/proposal/proposal-rest.service';
import { VnextService } from 'vnext/vnext.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConstantsService } from 'vnext/commons/services/constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { EaStoreService } from 'ea/ea-store.service';

@Injectable({
  providedIn: VnextResolversModule
})
export class PriceEstimateService {
  showBenefits = false; paForCollab = false;
  showDesriredQty = false;
  showPurchaseAdjustmentBreakUp = false;
  displayQuestionnaire = false;
  showEnrollments = false;
  suiteSelectionDelectionMap = new Map<string,IATOsApiRequest>();
  suiteSelectionDelectionRequest = new Array<IEnrollmentApiRequest>();
  enableSuiteInclusionExclusion = false;
  selectedAtoArray = [];
  selectedCxAtoArray = [];
  showTcvBreakUp = false;
  showServiceDiscForEnrollment = false;
  applyDiscountForSuiteSubj = new Subject(); // to call if applies discount from suite level
  updateQtySubject = new Subject(); // to call if recal is done from update qty popup
  updateTierForAtoSubject = new Subject(); // to call if tire is updated for suite -> to updated grid... 
  showProposalSummary = false;
  showCreditOverview =  false;
  totalSuiteQty = 0;
  updatedTiresMap = new Map<string,Array<IATOsApiRequest>>();
  selectedTierName = '';
  showPurchaseAdj = false
  refreshPeGridData = new Subject();
  addSuiteEmitter = new Subject();
  showUpdatePA = false;
  showQuantityInstallBaseBreakUp  = false;
  showServicePurchaseAdjustmentBaseBreakUp  = false;
  addMoreSuitesFromGrid = new Subject(); // to call add suites pop for suite selection or services
  applyDiscountForServicesSuiteSubj = new Subject(); // to call if applies discount from cx suite level
  updateProposalDataForCx = new Subject();
  invokePollerServiceForSwOnly = new Subject();
  refreshCxGrid = new Subject(); // to refresh cx grid on sw enrollment load
  expandedSuiteArr = []
  swExpandedSuiteArr = []
  enrollArr = [];
  messageMap = new Map<string, Set<string>>();
  isMerakiSuitesPresent = false;// set if user has selected meraki suites
  openDesriredQtySubject = new Subject(); // to open AdjDesriredQtyPopup pop
  updateProposalSubject = new BehaviorSubject(false); //to update service grid on proposal update
  mspSelectedValue: boolean;
  delinkHwCxSubject = new Subject();
  updateCxGridforIbRepullSubject = new Subject();
  suitesMigratedToMap = new Map<string, any>()
  isMigrateSuiteError = false;
  // isPendingMigration = false;
  isMigrateSuitedSelected = false;
  isMigrationSuitesPresentInEnrollment = false;// set if selected enrollment has migrated suites present
  migratedSuites = [];
  displayErrorForBlockingRules = false
  upgradedSuitesTier = [];
  enrollmentUpdateSubject = new Subject(); // set when enrollment gets updated from proposal edit

  constructor(public proposalStoreService:ProposalStoreService,private utilitiesService:UtilitiesService, public priceEstimateStoreService: PriceEstimateStoreService, private proposalRestService: ProposalRestService, private vnextService: VnextService, private constantsService: ConstantsService, 
    private localizationService: LocalizationService, public eaService: EaService,private eaStoreService: EaStoreService) { }


  public getCopyOfEnrolements(){
    const enrolmentObject = this.utilitiesService.cloneObj(this.proposalStoreService.proposalData.enrollments);
        return enrolmentObject;
  } 

  getExternalConfigData(enrollment){
    const url = this.vnextService.getAppDomainWithContext + 'proposal/' + this.proposalStoreService.proposalData.objId + 
      '/configure?e=' + enrollment.id
    
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.priceEstimateStoreService.externalConfigReq = response.data;
      }
    });
  }

  //This method is used for preparing grid data  
  public prepareGridData(enrollments:[IEnrollmentsInfo], changeSubFlow?){
    this.priceEstimateStoreService.displayCxGrid = false;
    if (enrollments[0].id === 5){
      this.selectedCxAtoArray = [];
    } else {
      this.selectedAtoArray = [];
    }
    this.showServiceDiscForEnrollment = false;

    const poolArrayForGrid = new Array<IPoolForGrid>();     
    for (let enrollment of enrollments) {
      // check and set included in change sub if already purchased and change sub flow
      if(changeSubFlow && enrollment?.includedInEAID && !enrollment.disabled && !(enrollment.id === 4 || enrollment.id === 6)){
        enrollment.includedInChangeSub = true;
      }
      if((enrollment.externalConfiguration || enrollment.id === 6) && !this.priceEstimateStoreService.viewAllSelected){
        if(enrollment.externalConfiguration){
          this.priceEstimateStoreService.displayExternalConfiguration = true;
        }
        this.getExternalConfigData(enrollment);
      }
      const enrollmentPools:Array<IPoolInfo> = enrollment.pools;    
      this.utilitiesService.sortArrayByDisplaySeq(enrollmentPools);      
      for(let pool of enrollmentPools ){
          this.preparePoolForGrid(pool,poolArrayForGrid,enrollment.id);
      }
      if (enrollment.cxAttached || enrollment.embeddedHwSupportAttached){
        this.priceEstimateStoreService.displayCxGrid = true;
      } 
    }   
    //this.priceEstimateStoreService.displayExternalConfiguration = true;
    return poolArrayForGrid;
  }

  private preparePoolForGrid(pool,poolArrayForGrid:Array<IPoolForGrid>,enrollmentId){

        let poolDataForGrid:IPoolForGrid;
        if(pool.display){
          poolDataForGrid = {
          poolSuiteLineName:pool.desc,
          enrollmentId: enrollmentId,
          expand: true
        }
      } else{
        poolDataForGrid = {
          poolSuiteLineName:" ",
          enrollmentId: enrollmentId
        }
      }      
      poolArrayForGrid.push(poolDataForGrid);
      if(pool.suites){
        this.utilitiesService.sortArrayByDisplaySeq(pool.suites);
       // pool.suites[0].type = 'KENNA'
        poolDataForGrid.childs = new Array<ISuiteAndLineInfoForGrid>();
          //pool.suites[0]['disabled'] = true;
          for(let suite of pool.suites){ 
             this.totalSuiteQty = 0;              
              this.prepareSuiteAndLineForGrid(suite,poolDataForGrid.childs,poolDataForGrid.poolSuiteLineName,enrollmentId, null);
              if(poolDataForGrid.childs.length){
                poolDataForGrid.childs[poolDataForGrid.childs.length-1].desiredQty = this.totalSuiteQty; 
                if(this.totalSuiteQty){
                  this.priceEstimateStoreService.totalDesiredQtyForEnrollment = this.priceEstimateStoreService.totalDesiredQtyForEnrollment + this.totalSuiteQty;
                }
              } 

              if(suite.displayGroup && suite.groups){
                this.utilitiesService.sortArrayByDisplaySeq(suite.groups);
                const groupLineMap = new Map<number,Array<ISuiteAndLineInfoForGrid>>();
                for(const group of suite.groups){
                    groupLineMap.set(group.id,[]);  
                } 
                const suiteForGrid =  poolDataForGrid.childs[poolDataForGrid.childs.length -1];
                if(suiteForGrid.childs){
                  for(const line of suiteForGrid.childs){  
                    if(groupLineMap.has(line.groupId)){
                      groupLineMap.get(line.groupId).push(line);
                    }                  
                    
                  } 
                }
                suiteForGrid.childs = new Array<ISuiteAndLineInfoForGrid>();
                for(const group of suite.groups){
                  const groupLineForGrid:ISuiteAndLineInfoForGrid = {
                    poolSuiteLineName: group.name,
                    poolName:'group'

                  }
                  if(this.eaService.features.NPI_AUTOMATION_REL || this.eaStoreService.isValidationUI){
                    const groupLineArray =  groupLineMap.get(group.id)
                    if(groupLineArray?.length > 0){
                      suiteForGrid.childs.push(groupLineForGrid); 
                      suiteForGrid.childs = suiteForGrid.childs.concat(groupLineMap.get(group.id));
                    }
                  } else {
                    suiteForGrid.childs.push(groupLineForGrid); 
                    suiteForGrid.childs = suiteForGrid.childs.concat(groupLineMap.get(group.id));
                  }
                }                          
              }
              if(this.eaService.features.CROSS_SUITE_MIGRATION_REL && this.eaService.isUpgradeFlow && !this.priceEstimateStoreService.viewAllSelected){
                this.checkForMigratedSuites(suite);
              }
          }
      }        
  }




  private prepareSuiteAndLineForGrid(suite,suiteArray:Array<ISuiteAndLineInfoForGrid>, poolName,enrollmentId,parentObj){
    if(suite.disabled){
      this.priceEstimateStoreService.returnCustomerMsg = true;
      const suiteForGrid:ISuiteAndLineInfoForGrid = this.prepareDisabledSuite(suite);
      suiteArray.push(suiteForGrid);
      return ;
    }
    this.expandedSuiteArr.forEach(value=>{
      if (value === suite.desc) {
        suite.expand = true;
      }
       
    })

    if(this.eaService.features.FIRESTORM_REL){
      this.swExpandedSuiteArr.forEach(value=>{
        if (value === suite.desc) {
          suite.expand = true;
        }
      })
    }
    
    const suiteForGrid:ISuiteAndLineInfoForGrid = {
        poolSuiteLineName: suite.desc,
        installBase : suite.qty,  
        desiredQty: suite.qty?suite.qty:0,            
        totalContractValue : "--",       
        ato: suite.ato ? suite.ato : parentObj?.ato,
        poolName: poolName,
        id: (suite.id ? suite.id : null),
        inclusion: suite.inclusion,
        enrollmentId:enrollmentId,
        commitNetPrice: '--',
        purchaseAdjustment: '--',
        minDiscount: 0,
        maxDiscount: 100,
        weightedDisc: 0,
        discountDirty: suite.discountDirty,
        expand: suite.expand,
        totalConsumedQty: 0,
        migration: false,
        type: suite?.type ? suite.type :'' ,//add parentObj check in future
        typeDesc: suite?.typeDesc ? suite.typeDesc :'' ,
        cxHwSupportOptedOut : suite?.cxHwSupportOptedOut,
        lowerTierPidTotalQty: suite.lowerTierPidTotalQty ? suite.lowerTierPidTotalQty : 0,
        minQty: suite.minQty ? suite.minQty : 0,
        includedInEAID: suite.includedInEAID,
        cxAlacarteCoverageFound: suite?.cxAlacarteCoverageFound,
        eligibleForMigration: suite?.eligibleForMigration,
        eligibleForUpgrade: suite?.eligibleForUpgrade,
        upgraded: suite?.upgraded,
        migrated: suite?.migrated,
        migratedFrom: suite?.migratedFrom,
        subscriptionSourceAtoTcv: suite?.subscriptionSourceAtoTcv,
        drpFlag: suite?.drpFlag
    };  

    if((enrollmentId === 3 || enrollmentId === 7) && parentObj && suite.name ){//for security or DCN on pid update desc and add name to display on UI
      suiteForGrid.poolSuiteLineName = suiteForGrid.poolSuiteLineName + ' (' + suite.name+ ')'
    }
    if(enrollmentId === 7 && !parentObj){
      suiteForGrid.hideDiscount = true;
    } else if(!parentObj){
      suiteForGrid.hideDiscount = (suite?.displayDiscount) ? false : true
    }
    if (suite.renewalInfo) {
      suiteForGrid.renewalInfo = suite.renewalInfo;
    }

    if (suite.qualifiesForHigherScuRange){
      suiteForGrid.qualifiesForHigherScuRange = suite.qualifiesForHigherScuRange;
    }
    
    if(suite.changeSubConfig){
      suiteForGrid.changeSubConfig = suite.changeSubConfig
    }
    if (suite.migration){
      suiteForGrid.migration = suite.migration;
    }

    if(this.eaService.features?.WIFI7_REL && suite?.eaSuiteType){
     suiteForGrid.eaSuiteType = suite.eaSuiteType;
    }

    // check for meraki suites and set isMerakiSuitesPresent
    if(this.eaService.features?.BONFIRE_REL){
      if ((((suite?.type === this.constantsService.MERAKI && !this.eaService.features?.WIFI7_REL) || (suite?.type === this.constantsService.MERAKI && suite?.eaSuiteType !== this.constantsService.CISCO_NETWORKING_SOLUTION && this.eaService.features?.WIFI7_REL)) || suite.ato === this.constantsService.MERAKI_HYBRID) && !this.eaService.isSpnaFlow){
        this.isMerakiSuitesPresent = true;
      }
    } else {
      if ((suite.ato === this.constantsService.MERAKI_1 || suite.ato === this.constantsService.MERAKI_2 || suite.ato === this.constantsService.MERAKI_3 || suite.ato === this.constantsService.MERAKI_HYBRID) && !this.eaService.isSpnaFlow){
        this.isMerakiSuitesPresent = true;
      }
    }

    if(suite.credit){
      suiteForGrid.credit = suite.credit;
    }

    if (suite.cxIbQty) {
        suiteForGrid.cxIbQty = suite.cxIbQty;
        suiteForGrid.total = suite.cxIbQty.total;
    }

    this.totalSuiteQty += suiteForGrid.desiredQty;

    if(suite.hybridParam){
      suiteForGrid.hybridParam = suite.hybridParam;
    }

    // to disable RTU pids for SPNA MSA question
    suiteForGrid.disableForRTU = suite?.disableForRTU ? suite.disableForRTU : false;
    if(enrollmentId === 4 || (enrollmentId === 6 && parentObj && parentObj.type ==='COLLAB')){
      this.totalSuiteQty = 1;
      suiteForGrid.pidName = suite.name;
      if(suite.dtls){
        suiteForGrid.desiredQty = suite.dtls[0].qty ? suite.dtls[0].qty : 0;
        suiteForGrid.totalConsumedQty = suite.dtls[0].totalConsumedQty ? suite.dtls[0].totalConsumedQty : 0;
      } else {
        suiteForGrid.desiredQty = 1;
      }
    } else if (suite.type){//if pids are present add type and supportPid and ibQty;

      suiteForGrid.pidType = suite.type;
      suiteForGrid.supportPid = suite.supportPid;
      suiteForGrid.pidName = suite.name;
      if(suite.dtls){
        suiteForGrid.desiredQty = suite.dtls[0].qty ? suite.dtls[0].qty : 0;
        if (this.proposalStoreService.proposalData?.dealInfo?.subscriptionUpgradeDeal) {
          suiteForGrid.lowerTierPidTotalQty =  suite.dtls[0].lowerTierPidTotalQty ? suite.dtls[0].lowerTierPidTotalQty : 0
          suiteForGrid.minQty = suite.dtls[0].minQty ? suite.dtls[0].minQty : 0
        }
        suiteForGrid.ibQty = suite.dtls[0].ibQty ? suite.dtls[0].ibQty : 0;
        suiteForGrid.totalConsumedQty = suite.dtls[0].totalConsumedQty ? suite.dtls[0].totalConsumedQty : 0;
        if(!suite.supportPid){
          this.totalSuiteQty += suiteForGrid.desiredQty;
        }
        
      } else {

        suiteForGrid.desiredQty = 0;
        suiteForGrid.ibQty = 0;
      }
      if(suite?.typeDesc){
        suiteForGrid.typeDesc = suite.typeDesc;
      }
    }
    if(suite.priceInfo){
      suiteForGrid.purchaseAdjustment = suite.priceInfo.purchaseAdjustment ? '-' +this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.priceInfo.purchaseAdjustment)) : '--';
      suiteForGrid.listPrice = suite.priceInfo.extendedList? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.priceInfo.extendedList)) : '0.00';
      suiteForGrid.totalContractValue = suite.priceInfo.totalNet? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.priceInfo.totalNet)) : '0.00';
    }
    if(suite.lowerTierAto){
      suiteForGrid.lowerTierAto = suite.lowerTierAto;
    }
    if(this.eaService.isUpgradeFlow){
      suiteForGrid.netChangeInTotalNet = suite.netChangeInTotalNet ? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.netChangeInTotalNet)) : '0.00';
    }
    if(suite.upsell){
      suiteForGrid.upsell = suite.upsell;
    }
    if(suite.tiers){
      suiteForGrid.tiers =  suite.tiers;
    }

    if(suite.includedInEAID) {
      suiteForGrid.includedInEAID = suite.includedInEAID;
    }

    if(this.eaService.features.CROSS_SUITE_MIGRATION_REL){
      if(suite.eligibleForMigration) {
        suiteForGrid.eligibleForMigration = suite.eligibleForMigration;
      }
      if(suite.eligibleForUpgrade) {
        suiteForGrid.eligibleForUpgrade = suite.eligibleForUpgrade;
      }
  
      if(suite.upgraded) {
        suiteForGrid.upgraded = suite.upgraded;
      } else if(suite.migrated) {
        suiteForGrid.migrated = suite.migrated;
      }
    }

    // Search ato tier from the options and fetch the description
    if (suite.atoTier) {
      let atoTier: IAtoTier;
        suiteForGrid.cxTierOptions =  suite.cxTierOptions;
        if (suite.cxTierOptions && suite.atoTierOptions.length){
          atoTier = suite.atoTierOptions.find(tier => tier.name === suite.atoTier);
        } else if (suite.tiers) {
          atoTier = suite.tiers.find(tier => tier.name === suite.ato);
        } else {
          atoTier = suite.tiers[0]
        }
        suiteForGrid.atoTierDesc =  atoTier.desc;
    }

    // for showing in adjusted desired qty
    if(suite.ncPriceInfo){
      suiteForGrid.commitNetPrice = suite.ncPriceInfo.totalNet? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.ncPriceInfo.totalNet)) : '--';
    }

    if (suite.ato && suite.inclusion) {
      if (enrollmentId === 5){
        this.selectedCxAtoArray.push(suite.ato);
      } else {
        this.selectedAtoArray.push({name: suite.ato, type: suite.type});
      }
      if (suite.serviceDiscount) {
        this.showServiceDiscForEnrollment = true;
      }
      // if(suite.hasOwnProperty(suite.notAllowedHybridRelated)){
      //     this.priceEstimateStoreService.hybridAssociatedSuiteCount++;
      // }
    }
    if(suite.discount){
      if((suite.type ==='KENNA' || enrollmentId === 7) && suite.discount.servPidDisc){
        suiteForGrid.serviceDiscount = suite.discount.servPidDisc;
      }
      else if(suite.discount.servDisc ){
        suiteForGrid.serviceDiscount = suite.discount.servDisc;
      }
       if(suite.discount.subsDisc){
        suiteForGrid.subscriptionDiscount = suite.discount.subsDisc;
      }
      if(suite.discount.multiProgramDesc){
        suiteForGrid.multiProgramDesc = suite.discount.multiProgramDesc;
      }
      if(suite.discount.minDiscount){
        suiteForGrid.minDiscount = +this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.discount.minDiscount));
      } else {
        suiteForGrid.minDiscount = 0;
      }
      
      if(suite.discount.maxDiscount){
        suiteForGrid.maxDiscount = suite.discount.maxDiscount;
      } else {
        suiteForGrid.maxDiscount = 100;
      }
    } 
    if (enrollmentId === 5){
      suiteForGrid.serviceDiscount = (suite.discount && suite.discount.servDisc) ? this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.discount.servDisc)) : suiteForGrid.minDiscount;
      suiteForGrid.weightedDisc = (suite.discount && suite.discount.weightedDisc) ? +this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(suite.discount.weightedDisc)) : 0;
      // suiteForGrid.desiredQty = 1;
    }

    if (enrollmentId === 4 && parentObj || (enrollmentId === 6 && parentObj && parentObj.type ==='COLLAB')){
      suiteForGrid.subscriptionDiscount = 
      (suite.discount && suite.discount.subsDisc !== undefined && suite.discount.subsDisc !== null)
        ? suite.discount.subsDisc 
        : parentObj.discount.subsDisc;
      } else {
      if (parentObj && enrollmentId !== 5) {
        if((parentObj && parentObj.type ==='KENNA') || enrollmentId === 7){
          suiteForGrid.serviceDiscount = parentObj.discount?.servPidDisc;
        }
         else if (parentObj.discount?.servDisc){
          suiteForGrid.serviceDiscount = parentObj.discount.servDisc;
         }
          
        if(((parentObj && parentObj.type ==='KENNA') || enrollmentId ===7) && suite.type ==='SERVICE'){
          if(suite.discount?.unitNetDiscount){
            suiteForGrid.subscriptionDiscount = suite.discount.unitNetDiscount;
          } else if (parentObj.discount?.servPidDisc) {
            suiteForGrid.subscriptionDiscount = parentObj.discount.servPidDisc;
          }
        }
        else if (parentObj.discount.subsDisc){
          suiteForGrid.subscriptionDiscount = parentObj.discount.subsDisc;
        }
      }
    }
  if(suite.billingTerm && suite.billingTerm.term){
    suiteForGrid.duration = suite.billingTerm.term + ' Months';
  }
  if(suite.commitInfo){
    suiteForGrid.commitInfo = {
      committed :suite.commitInfo.committed,
      threshold :suite.commitInfo.threshold,
      qtyThreshold : (suite.commitInfo.qtyThreshold) ? suite.commitInfo.qtyThreshold : null,
      ibQtyThreshold : (suite.commitInfo.ibQtyThreshold) ? suite.commitInfo.ibQtyThreshold : null,
      overrideAllowed : suite.commitInfo.overrideAllowed,
      overrideEligible : suite.commitInfo.overrideEligible,
      overrideRequested : suite.commitInfo.overrideRequested,
      overrideReason : suite.commitInfo.overrideReason ? suite.commitInfo.overrideReason : '',
      overrideState : suite.commitInfo.overrideState ? suite.commitInfo.overrideState : '',
      achievedInPercent : suite.commitInfo?.priceThreshold?.achievedInPercent ? suite.commitInfo?.priceThreshold?.achievedInPercent : null
    } 
  }
  if(suite.groupId){
    suiteForGrid.groupId = suite.groupId;
  }
  
  // mask prices for parnter login sfdc deals
  if(this.proposalStoreService.proposalData?.hideCollabPartnerNetPriceInfo){
    suiteForGrid.totalContractValue = '--';
    suiteForGrid.subscriptionDiscount = '--';
    suiteForGrid.serviceDiscount = '--';
  }
  //<!--Start Disti flow for sept release-->
  if(this.eaService.isResellerLoggedIn){
    suiteForGrid.totalContractValue = '--';
    suiteForGrid.subscriptionDiscount = '--';
    suiteForGrid.serviceDiscount = '--';
    suiteForGrid.commitNetPrice = '--'
  }
  //<!--End Disti flow for sept release-->
  if(enrollmentId === 5){
    if(suite.cxUpgradeType){
      suiteForGrid.cxUpgradeType = suite.cxUpgradeType;
    }
    if(parentObj && parentObj.cxUpgradeType){
      suiteForGrid.cxUpgradeType = parentObj.cxUpgradeType;
    }
  }

  suiteArray.push(suiteForGrid);
    if(suite.lines){
      this.utilitiesService.sortArrayByDisplaySeq(suite.lines);  
      suiteForGrid.childs = new Array<ISuiteAndLineInfoForGrid>()      
        for(let line of suite.lines){
          this.prepareSuiteAndLineForGrid(line,suiteForGrid.childs,suiteForGrid.poolName,enrollmentId,suite);
        }
    } else if(suite.pids){
      this.utilitiesService.sortArrayByDisplaySeq(suite.pids);
      suiteForGrid.childs = new Array<ISuiteAndLineInfoForGrid>()
      suiteForGrid.hasPids = true;
      let suitTotal = 0;
      let suiteProductFamilyCount = 0;
      let suiteOwned = 0
      let suiteUncovered = 0;
      let suiteTakeover = 0
      for(let pids of suite.pids){
        this.prepareSuiteAndLineForGrid(pids,suiteForGrid.childs,suiteForGrid.poolName,enrollmentId,suite);
        if (pids.cxIbQty && pids.cxIbQty.productFamilyCount) {
          suiteProductFamilyCount = suiteProductFamilyCount + pids.cxIbQty.productFamilyCount;  // We need to make suit level total by adding pid level
        }
        if (pids.cxIbQty && pids.cxIbQty.owned) {
          suiteOwned = suiteOwned + pids.cxIbQty.owned;  // We need to make suit level total by adding pid level
        }
        if (pids.cxIbQty && pids.cxIbQty.uncovered) {
          suiteUncovered = suiteUncovered + pids.cxIbQty.uncovered;  // We need to make suit level total by adding pid level
        }
        if (pids.cxIbQty && pids.cxIbQty.takeover) {
          suiteTakeover = suiteTakeover + pids.cxIbQty.takeover;  // We need to make suit level total by adding pid level
        }
        if (pids.cxIbQty && pids.cxIbQty.total) {
          suitTotal = suitTotal + pids.cxIbQty.total;  // We need to make suit level total by adding pid level
        }
      }
      // set cxIbQty for services
    suite.cxIbQty = {
      productFamilyCount: suiteProductFamilyCount,
      total: suitTotal,
      owned: suiteOwned,
      uncovered: suiteUncovered,
      takeover: suiteTakeover,
    }
      suiteForGrid.total = suitTotal;
  }
  }


  //This method is use to prepare suite object for returning customer (disabled Suite.)

   prepareDisabledSuite(suite):ISuiteAndLineInfoForGrid{
    const suiteForGrid:ISuiteAndLineInfoForGrid = {
      poolSuiteLineName: suite.desc, 
      installBase :'--',              
      totalContractValue : "--",       
      ato: '--',
      poolName: '--',     
      inclusion: true,     
      commitNetPrice: '--',
      purchaseAdjustment: '--',
      disabled : true,
      eligibleForMigration: suite?.eligibleForMigration,
      eligibleForUpgrade: suite?.eligibleForUpgrade,
      upgraded: suite?.upgraded,
      migrated: suite?.migrated,
      migratedTo: suite?.migratedTo,
      hasSwRelatedCxUpgraded: (suite.hasSwRelatedCxUpgraded) ? true : false,
      drpFlag: suite.drpFlag
  };

  if(this.eaService.features.CROSS_SUITE_MIGRATION_REL){
    if(suite.eligibleForMigration) {
      suiteForGrid.eligibleForMigration = suite.eligibleForMigration;
    }
  
    if(suite.eligibleForUpgrade) {
      suiteForGrid.eligibleForUpgrade = suite.eligibleForUpgrade;
    }
  
    if(suite.upgraded) {
      suiteForGrid.upgraded = suite.upgraded;
    } else if(suite.migrated) {
      suiteForGrid.migrated = suite.migrated;
    }
  }
  return suiteForGrid;
  }
  
  // method to set discountObj for entrollment to show on apply discount modal
  setEnrollmentsDiscLovs(suiteData?) {
    const subscriptionDisc = {
      'name': this.localizationService.getLocalizedString('common.SUBSCRIPTION_DISCOUNT'),
      'key': 'subsDisc',
      'oldValue': 0,
      'value': 0,
      'min': 0,
      'max': 100
    };
    const serviceDisc = {
      'name': this.localizationService.getLocalizedString('common.SERVICES_DISCOUNT'),
      'key': 'servDisc',
      'oldValue': 0,
      'value': 0,
      'min': 0,
      'max': 100
    }
    if(this.priceEstimateStoreService.selectedEnrollment.id === 4)
    {
      subscriptionDisc.name = this.localizationService.getLocalizedString('common.DISCOUNT')
    }
    let isServiceDiscPresentForSuite = false; // set if any of the atos have service discount
    // check suitedata
    if (suiteData) {
      const atoDiscountLovObj = this.priceEstimateStoreService.discountLovs[0].atos.find(data => data.name === suiteData.ato);
      // const subsDicLov = atoDiscountLovObj.discount.subsDisc
      // subscriptionDisc.min = subsDicLov.min
      // subscriptionDisc.max = subsDicLov.max
      if (atoDiscountLovObj?.discount?.subsDisc) {
        const subsDicLov = atoDiscountLovObj.discount.subsDisc
        subscriptionDisc.min = subsDicLov.min
        subscriptionDisc.max = subsDicLov.max
      }
      subscriptionDisc.value = suiteData.subscriptionDiscount,
        subscriptionDisc.oldValue = suiteData.subscriptionDiscount
        if ((suiteData.type ==='KENNA' || this.priceEstimateStoreService.selectedEnrollment.id === 7) && atoDiscountLovObj.discount.servPidDisc && suiteData.serviceDiscount) {
          isServiceDiscPresentForSuite = true;
          if(atoDiscountLovObj?.discount?.servPidDisc){
            const servPidDisc = atoDiscountLovObj.discount.servPidDisc
            serviceDisc.min = servPidDisc.min
            serviceDisc.max = servPidDisc.max
          }
          serviceDisc.value = suiteData.serviceDiscount
            serviceDisc.oldValue = suiteData.serviceDiscount
            serviceDisc.key = 'servPidDisc'
            serviceDisc.name = this.localizationService.getLocalizedString('common.SUBSCRIPTION_SERVICE_DISCOUNT')
        }
     else if (atoDiscountLovObj.discount.servDisc && suiteData.serviceDiscount) {
        isServiceDiscPresentForSuite = true;
        // const servDicLov = atoDiscountLovObj.discount.servDisc
        // serviceDisc.min = servDicLov.min
        // serviceDisc.max = servDicLov.max

          if (atoDiscountLovObj?.discount?.servDisc) {
            const servDicLov = atoDiscountLovObj.discount.servDisc
            serviceDisc.min = servDicLov.min
            serviceDisc.max = servDicLov.max
          }
        serviceDisc.value = suiteData.serviceDiscount,
          serviceDisc.oldValue = suiteData.serviceDiscount
      }
    } else {

      for (const discountLov of this.priceEstimateStoreService.discountLovs) {
        for (const ato of discountLov.atos) {
         const selectedAto =  this.selectedAtoArray.find(suite => suite.name === ato.name);
          if (selectedAto) {
            const subsDisc = ato.discount.subsDisc;
            if (!this.eaService.features.NPI_AUTOMATION_REL) {
              if (subscriptionDisc.value < subsDisc.defaultDisc) { // max value of all the defaultdisc in the enrollment
                subscriptionDisc.value = subsDisc.defaultDisc;
                subscriptionDisc.oldValue = subsDisc.defaultDisc;
              }
            }
            if (subscriptionDisc.min < subsDisc.min) {// max value of all the minDisc in the enrollment
              subscriptionDisc.min = subsDisc.min;
              if (this.eaService.features.NPI_AUTOMATION_REL) {
                subscriptionDisc.value = subsDisc.min;
                subscriptionDisc.oldValue = subsDisc.min;
              }
            }
            if (subscriptionDisc.max > subsDisc.max) { // min value of all the maxDisc in the enrollment
              subscriptionDisc.max = subsDisc.max;
            }
            if (this.showServiceDiscForEnrollment && ato.discount.servDisc) {
              const servDisc = ato.discount.servDisc;
              if (!this.eaService.features.NPI_AUTOMATION_REL) {
                if (serviceDisc.value < servDisc.defaultDisc) { // max value of all the defaultdisc in the enrollment
                  serviceDisc.value = servDisc.defaultDisc;
                  serviceDisc.oldValue = servDisc.defaultDisc;
                }
              }
              if (serviceDisc.min < servDisc.min) {// max value of all the minDisc in the enrollment
                serviceDisc.min = servDisc.min;
                if (this.eaService.features.NPI_AUTOMATION_REL) {
                  serviceDisc.value = servDisc.min;
                  serviceDisc.oldValue = servDisc.min;
                }
              }
              if (serviceDisc.max > servDisc.max) { // min value of all the maxDisc in the enrollment
                serviceDisc.max = servDisc.max;
              }
            }
          }
        }
      }
    }
    const discountsArr = [subscriptionDisc];
    if ((this.showServiceDiscForEnrollment && !suiteData) || isServiceDiscPresentForSuite) {
      discountsArr.push(serviceDisc);
    }
    return discountsArr;
  }


  public prepareRecalculateAllRequst(enrollmentId: number, atoName: string, inclusion: boolean) {
    let atoObject: IATOsApiRequest = {
      name: atoName,
      inclusion: inclusion
    };
    if (!this.suiteSelectionDelectionRequest.length) {
      const enrollmentObj: IEnrollmentApiRequest = {
        enrollmentId: enrollmentId,
        atos: [atoObject]
      };
      this.suiteSelectionDelectionMap.set(atoName, atoObject);
      this.suiteSelectionDelectionRequest.push(enrollmentObj);
    } else if (this.suiteSelectionDelectionMap.has(atoName)) {
      this.suiteSelectionDelectionMap.delete(atoName);
      this.suiteSelectionDelectionRequest[0].atos = this.suiteSelectionDelectionRequest[0].atos.filter(ato => ato.name !== atoName);
    } else {
      this.suiteSelectionDelectionMap.set(atoName, atoObject);
      this.suiteSelectionDelectionRequest[0].atos.push(atoObject);
    }
    this.checkToEnableRecalAll();
  }
  
  updateTireMap(request){
    let tierArray:IATOsApiRequest[] = this.updatedTiresMap.get(request.ato)
    if(tierArray){
      if (request.tireToUpdate.name === tierArray[0].name){
        this.updatedTiresMap.delete(request.ato)
      } else {
        tierArray[1].name = request.tireToUpdate.name;
      }
    } else {
      tierArray = [{name: request.selectedTier.name,inclusion : false},{name: request.tireToUpdate.name,inclusion : true}]
      this.updatedTiresMap.set(request.ato,tierArray)
    }
    this.checkToEnableRecalAll()
  }

  checkToEnableRecalAll(){
    if(this.updatedTiresMap.size || (this.suiteSelectionDelectionRequest.length && this.suiteSelectionDelectionRequest[0].atos.length)){
      this.priceEstimateStoreService.enableRecalculateAll = true;
    } else {
      this.priceEstimateStoreService.enableRecalculateAll = false;
    }
  }

  mergeTireIntoSuiteForRecall(enrollmentId){
    if (!this.suiteSelectionDelectionRequest.length) {
      const enrollmentObj: IEnrollmentApiRequest = {
        enrollmentId: enrollmentId,
        atos: []
      };
      this.suiteSelectionDelectionRequest.push(enrollmentObj);
    }
    this.updatedTiresMap.forEach((value, key) => {
      const ato = this.suiteSelectionDelectionMap.get(key);
      if(!ato || ato.inclusion){
        this.suiteSelectionDelectionRequest[0].atos.push(...value);
      }
  });
  }

  //to set req for getting discountLovs
  setReqjsonForLovs(enrollmentId, selectedEnrollmentArray){
    const requestObj = {
      "data": {
        "enrollments": [
        ],
        "buyingProgram": this.proposalStoreService.proposalData.buyingProgram
      }
    }
    if(enrollmentId){
      requestObj.data.enrollments.push({enrollmentId : enrollmentId});
    } else {
      // code to set request obj if user selects all
      for (const enrollment of selectedEnrollmentArray){
        requestObj.data.enrollments.push({enrollmentId : enrollment.id});
      }
    }
    return requestObj;
  }

  // to set reqObj for applying discount
  setReqObjForDisocunts(discount, enrollmentId){
    const requsestObj =   {
      "data": {
        "enrollments": [
        ]
      }
    }
    const atos = []; // to set atos data 
    if (enrollmentId){
      for (const selectedAto of this.selectedAtoArray){
        if((selectedAto.type ==='KENNA' || enrollmentId === 7) && discount['subsDisc']){
          const disc = {
            'subsDisc' : discount['subsDisc'],
            'servPidDisc': discount['subsDisc']
          }
          atos.push({name: selectedAto.name, discount : disc})
        } else {
          atos.push({name: selectedAto.name, discount : discount})
        }
      }
      requsestObj.data.enrollments.push({enrollmentId : enrollmentId, atos: atos});
    } else { // if selected all 
      // code to set request obj if user selects all
    }
    return requsestObj;
  }

  prepareMessageMapForGrid(messageObj: any) {
    this.priceEstimateStoreService.hasRSDError = false;
    this.priceEstimateStoreService.rsdErrorMsg = '';
    this.messageMap.clear();
    let levelMap = new Map<string, string>();
    if (messageObj.messages) {
      for (let i = 0; i < messageObj.messages.length; i++) {
        if(messageObj.messages[i].level) {
          let key;
          if(messageObj.messages[i].level) {
            if(messageObj.messages[i].severity === 'ERROR') {
              key = messageObj.messages[i].level + '-' + messageObj.messages[i].identifier;
            } else {
              if(messageObj.messages[i].level === 'ATO'){
                key = messageObj.messages[i].level + '-' +  messageObj.messages[i].severity + '-' + messageObj.messages[i].identifier;
              }
             
            }
          }
          let level = messageObj.messages[i].level
          levelMap.set(messageObj.messages[i].level, level)
           if (levelMap.has(level)) {
            if (this.messageMap.has(key)) {
            const messageArray = this.messageMap.get(key);
            messageArray.add(messageObj.messages[i].text);
            this.messageMap.set(key, messageArray);
            } else {
              const messageArray = new Set<string>();
              messageArray.add(messageObj.messages[i].text);
              this.messageMap.set(key, messageArray);
            }
          }
        }
        if (messageObj.messages[i].type === 'SERVICE') {
          this.priceEstimateStoreService.hasRSDError = true;
          this.priceEstimateStoreService.rsdErrorMsg = messageObj.messages[i].text
        }
      }
    }
  }

  // to get ordIds from api
  getOrdIds(){
    this.priceEstimateStoreService.orgIdsArr = [];
    const url = this.vnextService.getAppDomainWithContext + 'project/'+ this.proposalStoreService.proposalData.projectObjId + '/org-ids';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)){
        if (response.data.orgIds){
          this.priceEstimateStoreService.orgIdsArr = response.data.orgIds;
        } else {
          this.priceEstimateStoreService.orgIdsArr = [];
        }
      }
    });
  }

  // checkIfCxpreset and set eamsDeliveryObj from data
  checkCxPresent() {
    this.priceEstimateStoreService.isCxPresent = false;
    const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment?e=5';
    this.proposalRestService.getApiCall(url).subscribe((response: any) => {
      if (response && response.data && !response.error) {
        if (response.data.enrollments && response.data.enrollments.length) {
          this.priceEstimateStoreService.isCxPresent = response.data.enrollments[0].cxAttached ? true : false;
          this.priceEstimateStoreService.eamsDeliveryObj = response.data.enrollments[0].eamsDelivery ? response.data.enrollments[0].eamsDelivery : {};
        } else {
          this.priceEstimateStoreService.eamsDeliveryObj = {};
          this.priceEstimateStoreService.isCxPresent = false;
        }
        if(response.data.proposal?.mspInfo) {
          this.proposalStoreService.mspInfo = response.data.proposal?.mspInfo
          this.mspSelectedValue = response.data.proposal?.mspInfo?.mspProposal
          if (this.eaService.features.MSEA_REL) {
            this.proposalStoreService.mspInfo.managedServicesEaPartner = (response.data.proposal?.buyingProgramTransactionType == this.constantsService.MSEA) ? true : false;
          }
        }
      }
    });
  }

  // method to check and set error for each portfolio
  setErrorIconForPortFolios() {
    const messages = this.proposalStoreService.proposalData.message.messages;
    if(messages){
    for (let enrollment of this.proposalStoreService.proposalData.enrollments) {
      enrollment.hasError = false;
      const enrollmentMessages = messages.filter(message => (message.severity === 'ERROR' && message.groupIdentifier == enrollment.id))
      if (enrollmentMessages && enrollmentMessages.length) {
        enrollment.hasError = true;
      }
    }
  }
  }

  resetErrorIconForPortFolios() {
    for (let enrollment of this.proposalStoreService.proposalData.enrollments) {
      enrollment.hasError = false;
    }
  }

  // check and convertTier string 
  converAndCapitalizeFirstLetterOfTier(string) {
    string = string.replace('_', ' ').toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  prepareUpgradeSummaryData (data) {
    let upgradeSummaryData = new Array<IUpgradeSummary>();
    let summaryObj:IUpgradeSummary;
    let serviceSuites = [];
    for (let enrollment of data.enrollments) {
      if (enrollment.name !== 'Services') {
        let suiteArr = [];
        let suiteObj:IUpgradeSuites;
        for (let pool of enrollment.pools) {
          for (let suites of pool.suites) {
            if (!suites.disabled) {
              suiteObj = {
                name: suites.name,
                ato: suites.ato,
                disabled: false,
                commitStatus :suites.commitInfo?.committed ? 'Full' : 'Partial',
                upgradeType :'Software',
                existingTcv : suites?.lowerTierAto?.priceInfo?.totalNet ? suites?.lowerTierAto?.priceInfo?.totalNet : 0,
                upgradeTcv: suites?.priceInfo?.totalNet ? suites?.priceInfo?.totalNet : 0,
                netChange: suites?.netChangeInTotalNet ? suites?.netChangeInTotalNet : 0,
                upSell: suites?.upsell ? suites?.upsell : null
              }
            } else {
              suiteObj = {
                name: suites.name,
                ato: suites.ato,
                disabled: true
              }
            }
            suiteArr.push(suiteObj);
          } 
          summaryObj = {
            enrollmentName : enrollment.name,
            cxAttached: enrollment?.cxAttached ? true : false,
            enrolled: enrollment?.enrolled ? true : false,
            suites: suiteArr
          }
        }
        upgradeSummaryData.push(summaryObj);
      } else {
        for (let servicePool of  enrollment.pools) {
          for (let serviceSuite of servicePool.suites) {
            serviceSuites.push(serviceSuite);
          }
        }
      }
    }
    this.prepareServiceSuites(upgradeSummaryData, serviceSuites);
    return upgradeSummaryData;
  }

  prepareServiceSuites(upgradeSummaryData, serviceSuites) {
    console.log(serviceSuites)
    for (let enrollment of upgradeSummaryData) {
      let suites = enrollment.suites;
      for (let i = 0; i < suites.length; i++) {
        for (let suite of serviceSuites) {
            if (suite.relatedSwAto === suites[i].ato) {
              const obj = {
                name: !suites[i].disabled ? "" :  suites[i].name,
                ato: suite.ato,
                commitStatus :suite.commitInfo.committed ? 'Full' : 'Partial',
                upgradeType :'Service',
                existingTcv : suite?.lowerTierAto?.priceInfo?.totalNet ? suite?.lowerTierAto?.priceInfo?.totalNet : 0,
                upgradeTcv: suite?.priceInfo?.totalNet ? suite?.priceInfo?.totalNet : 0,
                netChange: suite?.netChangeInTotalNet ? suite?.netChangeInTotalNet : 0,
                upSell: suite?.upsell ? suite?.upsell : null
              }
              enrollment.suites.splice(i+1, 0, obj)
            }
        }
      }
    }
  }

  //  method to check if migrated suites are present in data
  checkForMigratedSuites(suite){
    if(suite?.migrated || suite?.migratedFrom || suite?.migratedTo){
      this.isMigrationSuitesPresentInEnrollment = true;
    }
  }

  setNameForUgradedSuite(suite, lowerTierAto, tiers, from?,serviceSuitesArray?){
    let suiteName = '';
    let upgradedTier = tiers.find(tier => ((suite.ato === tier.name) && !from) || ((lowerTierAto.name === tier.name) && from) )
    console.log(upgradedTier)
    if(upgradedTier){
      suiteName = suite.desc + ' ' +  upgradedTier.desc;
      return suiteName
    } else {
      //suiteName = lowerTierAto.desc + ' ' +  lowerTierAto.name;
      const cxLowerTierDetails = serviceSuitesArray?.find(cxsuite => cxsuite.ato === lowerTierAto.name);
      if(from && suite.relatedSwAto && this.eaService.features.CROSS_SUITE_MIGRATION_REL){
        suiteName =   lowerTierAto.desc;
        if(cxLowerTierDetails){
          suiteName =   suiteName + ' '+ cxLowerTierDetails.lowerTierAto.desc;
        } else {
          suiteName =   suite.desc + ' ' + suiteName 
        }
      } else {
        suiteName = suite.desc + ' ' +  lowerTierAto.desc;
      }
      
      return suiteName
    }
    // for (let tier of tiers) {
    //   if(from){
    //     if (suite.ato === tier.name) {
    //       suiteName = suite.desc + ' ' +  tier.desc;
    //       return suiteName
    //     }
    //   } else {
    //     if (lowerTierAto.name === tier.name) {
    //       suiteName = lowerTierAto.desc + ' ' +  tier.desc;
    //       return suiteName
    //     }
    //   }
    // }

  }


  prepareMigrationUpgradeSummarydata(data){
    let upgradeSummaryData = new Array<IUpgradeSummary>();
    let summaryObj:IUpgradeSummary;
    let serviceSuites = [];
    for (let enrollment of data.enrollments) {
      if (enrollment.name !== 'Services') {
        let suiteArr = [];
        let suiteObj:IUpgradeSuites;
        for (let pool of enrollment.pools) {
          for (let suites of pool.suites) {
            if (!suites.disabled) {
              if(suites.lowerTierAto || suites?.upgraded){
                suiteObj = {
                  name: suites.lowerTierAto ? this.setNameForUgradedSuite(suites, suites.lowerTierAto, suites.tiers) : suites.name,
                  upgradedFrom : suites.lowerTierAto ? this.setNameForUgradedSuite(suites, suites.lowerTierAto, suites.tiers, true) : suites.name,
                  ato: suites.ato,
                  disabled: false,
                  commitStatus :suites.commitInfo?.committed ? 'Full' : 'Partial',
                  upgradeType :'Software',
                  existingTcv : suites?.lowerTierAto?.priceInfo?.totalNet ? suites?.lowerTierAto?.priceInfo?.totalNet : 0,
                  upgradeTcv: suites?.priceInfo?.totalNet ? suites?.priceInfo?.totalNet : 0,
                  netChange: suites?.netChangeInTotalNet ? suites?.netChangeInTotalNet : 0,
                  upSell: suites?.upsell ? suites?.upsell : null,
                  upgraded: suites.lowerTierAto ? true : false,
                  migrated: false,
                  migrationUpgradeType: suites.lowerTierAto ? 'Upgrade' : suites?.migrated ? 'Migration' : null
                }
              } else if (suites?.migrated) {
                suiteObj = {
                  name: this.prepareMigratedSuite(suites, undefined),
                  ato: suites.ato,
                  disabled: false,
                  commitStatus :suites.commitInfo?.committed ? 'Full' : 'Partial',
                  upgradeType :'Software',
                  existingTcv : suites?.subscriptionSourceAtoTcv ? suites?.subscriptionSourceAtoTcv : 0,
                  upgradeTcv: suites?.priceInfo?.totalNet ? suites?.priceInfo?.totalNet : 0,
                  netChange: suites?.netChangeInTotalNet ? suites?.netChangeInTotalNet : 0,
                  upSell: suites?.upsell ? suites?.upsell : null,
                  upgraded: false,
                  migrationUpgradeType: suites.lowerTierAto ? 'Upgrade' : suites?.migrated ? 'Migration' : null,
                  migrated: suites?.migrated ? true : false,
                  migratedFrom: suites?.migrated ?  this.prepareMigratedSuite(suites, suites.migratedFrom) : null  
                }
              }
            } else {
              suiteObj = {
                name: suites.name,
                ato: suites.ato,
                disabled: true
              }
            }
            suiteArr.push(suiteObj);
          } 
          summaryObj = {
            enrollmentName : enrollment.name,
            cxAttached: enrollment?.cxAttached ? true : false,
            enrolled: enrollment?.enrolled ? true : false,
            suites: suiteArr
          }
        }
        upgradeSummaryData.push(summaryObj);
      } else {
        for (let servicePool of  enrollment.pools) {
          for (let serviceSuite of servicePool.suites) {
            serviceSuites.push(serviceSuite);
          }
        }
      }
    }
    this.prepareServiceSuitesForUpgradeMigration(upgradeSummaryData, serviceSuites);
    return upgradeSummaryData;
  }

  prepareServiceSuitesForUpgradeMigration(upgradeSummaryData, serviceSuites) {
    console.log(serviceSuites)
    for (let enrollment of upgradeSummaryData) {
      let suitesArray = enrollment.suites;
      for (let i = 0; i < suitesArray.length; i++) {
        for (let suiteObj of serviceSuites) {
            if (suitesArray[i] && (suiteObj.relatedSwAto === suitesArray[i].ato)) {
              let obj:IUpgradeSuites;
              if(suiteObj?.migrated){

                obj = {
                  name: this.prepareMigratedSuite(suiteObj, undefined),
                  migratedFrom: suiteObj?.migrated ?  this.prepareMigratedSuite(suiteObj, suiteObj.migratedFrom, true) : null,
                  ato: suiteObj.ato,
                  commitStatus :suiteObj.commitInfo.committed ? 'Full' : 'Partial',
                  upgradeType :'Service',
                  relatedSwAto: suiteObj.relatedSwAto,
                  existingTcv : suiteObj?.subscriptionSourceAtoTcv ? suiteObj?.subscriptionSourceAtoTcv : 0,
                  upgradeTcv: suiteObj?.priceInfo?.totalNet ? suiteObj?.priceInfo?.totalNet : 0,
                  netChange: suiteObj?.netChangeInTotalNet ? suiteObj?.netChangeInTotalNet : 0,
                  upSell: suiteObj?.upsell ? suiteObj?.upsell : null,
                  upgraded: false,
                  migrated: suiteObj?.migrated ? true : false,
                  migrationUpgradeType: suiteObj.lowerTierAto ? 'Upgrade' : suiteObj?.migrated ? 'Migration' : null,
                }
              } else if(suiteObj?.upgraded || suiteObj?.lowerTierAto) {
                 obj = {
                  name: suiteObj.lowerTierAto ? this.setNameForUgradedSuite(suiteObj, suiteObj.lowerTierAto, suiteObj.tiers) : suiteObj.name,
                  upgradedFrom : suiteObj.lowerTierAto ? this.setNameForUgradedSuite(suiteObj, suiteObj.lowerTierAto, suiteObj.tiers, true,serviceSuites) : suiteObj.name,
                  ato: suiteObj.ato,
                  commitStatus :suiteObj.commitInfo.committed ? 'Full' : 'Partial',
                  upgradeType :'Service',
                  existingTcv : suiteObj?.lowerTierAto?.priceInfo?.totalNet ? suiteObj?.lowerTierAto?.priceInfo?.totalNet : 0,
                  upgradeTcv: suiteObj?.priceInfo?.totalNet ? suiteObj?.priceInfo?.totalNet : 0,
                  netChange: suiteObj?.netChangeInTotalNet ? suiteObj?.netChangeInTotalNet : 0,
                  upSell: suiteObj?.upsell ? suiteObj?.upsell : null,
                  upgraded: suiteObj.lowerTierAto ? true : false,
                  migrated: false,
                  migrationUpgradeType: suiteObj.lowerTierAto ? 'Upgrade' : suiteObj?.migrated ? 'Migration' : null,
                }
              }
              enrollment.suites.splice(i+1, 0, obj)
            }
        }
      }
    }
  }

  prepareMigratedSuite(suiteObj, migratedFrom, forServiceRow?) {
    if(migratedFrom && migratedFrom?.length){
        for(let migratedSuite of migratedFrom){
          if(forServiceRow){//for service row data
            // migratedSuite['migratedFromDesc'] = suiteObj.desc + ' ' + migratedSuite.desc + ' ';
            migratedSuite['migratedFromDesc'] = migratedSuite.desc + ' ';
          } else {// for sw row data
            const tierDesc = (migratedSuite?.selectedTierDesc) ? migratedSuite.selectedTierDesc : ''

            migratedSuite['migratedFromDesc'] = migratedSuite.desc + ' ' + tierDesc + ' ';
          }
          
        }
        return migratedFrom.map(suite => suite['migratedFromDesc']).toString();
    } else {
      for(let tier of suiteObj.tiers){
        if(suiteObj.ato === tier.name ){
          return suiteObj.name + ' ' + tier.desc;
        }
      }
    }
  }

}
