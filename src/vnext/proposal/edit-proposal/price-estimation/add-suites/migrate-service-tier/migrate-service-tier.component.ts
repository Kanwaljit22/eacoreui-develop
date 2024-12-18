import { Component, Input, OnInit } from '@angular/core';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { IAtoTier, IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateService } from '../../price-estimate.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-migrate-service-tier',
  templateUrl: './migrate-service-tier.component.html',
  styleUrls: ['./migrate-service-tier.component.scss']
})
export class MigrateServiceTierComponent implements OnInit {
  @Input() cxEnrollmentData: IEnrollmentsInfo;


  constructor(private utilitiesService: UtilitiesService, public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService, public proposalStoreService: ProposalStoreService, public vnextStoreService: VnextStoreService, public eaService: EaService, private priceEstimateService: PriceEstimateService, private constantService: ConstantsService) {

  }

  displayCxSuiteTable = false;

  ngOnInit(): void {
    this.prepareMigrateCxData();
    
  }
  prepareMigrateCxData(){
    if(this.priceEstimateService.suitesMigratedToMap && this.cxEnrollmentData){
      this.cxEnrollmentData.pools.forEach((pool) =>{
          pool.suites.forEach((cxSuite) =>{
            cxSuite.migrationSourceAtos = undefined
            if(cxSuite.migrated && cxSuite.migratedTo){ 
              const value = this.priceEstimateService.suitesMigratedToMap.get(cxSuite.migratedTo.desc);
              const data = {atoName: cxSuite.ato, migrationType: cxSuite.migratedTo.migrationType, targetAto: cxSuite.migratedTo.selectedTier}
              if(value.migrationSourceAtos){
                value.migrationSourceAtos.push(data)
              } else {
                value.migrationSourceAtos = [data]
              }
            } 
          })
      })
      this.updateMigrationSourceAtos()
    }
  }
  updateMigrationSourceAtos() {
    this.priceEstimateService.migratedSuites = [];
    this.displayCxSuiteTable = false
    this.cxEnrollmentData.pools.forEach((pool) => {
      let displayPoolForCxMigration = false;
      pool.suites.forEach((cxSuite) => {
        const migratedToSuite = this.priceEstimateService.suitesMigratedToMap.get(cxSuite.desc)
        if (migratedToSuite) {
          displayPoolForCxMigration = true
          cxSuite.migrationSourceAtos = migratedToSuite.migrationSourceAtos
          cxSuite.inclusion = true;
          this.priceEstimateService.migratedSuites.push(cxSuite)
          if(cxSuite.tiers && cxSuite.tiers.length){
            for (let tier of cxSuite.tiers) {
              const migratedToSuiteTier = (migratedToSuite.selectedTier) ? migratedToSuite.selectedTier : migratedToSuite.ato
              if(tier.name === migratedToSuiteTier){
                if (tier[this.constantService.CX_TIER_OPTIONS]?.length) {  
                  let searchedTier = tier[this.constantService.CX_TIER_OPTIONS].find(cxTier => (cxTier.name === cxSuite.cxSelectedTier) || (cxTier.name === tier.cxSelectedTier)); 
                  if (!searchedTier) {//if no cxSelectedTier in suite from API then search for default tier
                    searchedTier = tier[this.constantService.CX_TIER_OPTIONS].find(cxTier => (cxTier.cxUpgradeDefaultTier));
                  }
                  if (searchedTier) {
                    cxSuite[this.constantService.CX_UPDATED_TIER] = searchedTier;
                    cxSuite[this.constantService.CX_TIER_DROPDOWN] = this.utilitiesService.cloneObj(tier[this.constantService.CX_TIER_OPTIONS])
                  } else {
                    cxSuite[this.constantService.CX_TIER_DROPDOWN] = []
                  }
                }
              }
            }
          }
        }
      })
      if(displayPoolForCxMigration){
        this.displayCxSuiteTable = true;
        pool['displayPoolForMigration'] = true;
      } else {
        pool['displayPoolForMigration'] = false
      }
    })
  }

  optionalcxHwSelected(suite){
    suite.cxHwSupportOptedOut = !suite.cxHwSupportOptedOut;
    if(suite.cxHwSupportOptedOut){
      suite.cxAttachRate = 0;
    }
  }

  openDropdown(event,suite){
    suite.showDropdown =  !suite.showDropdown;
  }

  updateCxInclusion(suite){
    suite.cxOptIn = !suite.cxOptIn;
    if(!suite.cxOptIn){
      suite.cxAttachRate = 0;
    }
  }

  checkAllAttachRate(suit,event) {
    if(+event.target.value > 100){
      suit.cxAttachRate = 100;
    } else {
      suit.cxAttachRate = (+event.target.value === 0) ? 0.00 : +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)))
    }
  }

  changeCxTierSelection(tierObj: IAtoTier, suite) {
    suite.cxTierDropdown.forEach(tier =>
      tier.selected = false
    );
    if (suite.cxUpdatedTier.name !== tierObj.name) {//remvoe desc and use name
      tierObj.selected = true;
      suite.cxUpdatedTier = tierObj;
      suite.cxSelectedTier = tierObj.name;
    }
  }

  
  checkValue(event,value){
    // method to check key event and set cx rate
    
      if (!this.utilitiesService.isNumberKey(event)) {
          event.target.value = '';
      }
      if (event.target.value) {
          if (event.target.value > 100) {
              event.target.value = 100.00;
              value = 100.00;
          } else if (event.target.value < 0) {
              event.target.value = 0.00;
              value = 0.00;
          } else {
             value = +(this.utilitiesService.formatValue(this.utilitiesService.getFloatValue(event.target.value)));
          }
      }
  
  }

}
