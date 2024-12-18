import { Component, OnDestroy, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { IEnrollmentsInfo } from 'vnext/proposal/proposal-store.service';
import { PriceEstimateService } from '../../price-estimate.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ConstantsService } from 'vnext/commons/services/constants.service';

@Component({
  selector: 'app-migrate-suites',
  templateUrl: './migrate-suites.component.html',
  styleUrls: ['./migrate-suites.component.scss']
})
export class MigrateSuitesComponent implements OnInit {

  @Input() swEnrollmentData: IEnrollmentsInfo;
  showMigrateDrop = false;
  showTierDrop = false;
  errorSuiteArray = [];

  constructor(private utilitiesService: UtilitiesService, public priceEstimateService: PriceEstimateService, public localizationService: LocalizationService,
    public dataIdConstantsService: DataIdConstantsService, public constantsService: ConstantsService) {

  }

  ngOnInit(): void {
  }


  selectSwMigrateSuite(migrateToSuite, suite) {
  
    suite.migratedTo = migrateToSuite;
    suite.migrated = true;
    this.priceEstimateService.upgradedSuitesTier.push(suite);
    if(!suite.suiteModified && suite.migratedTo.mappingType?.length > 1){
      suite.migratedTo.migrationType = this.constantsService.FULL
    }
    if(!suite.migratedTo.migrationType || suite.fullMigrationNotEligible || suite.migratedTo.fullMigrationNotEligible || suite.suiteModified){
      suite.migratedTo.migrationType = suite.migratedTo.mappingType[0];
    }
    
    if(suite.pendingMigrationCancelled && suite.suiteModified) {
      suite.pendingMigrationCancelled = false;
    }
    if(migrateToSuite.tiers?.length){
      this.utilitiesService.sortArrayByDisplaySeq(migrateToSuite.tiers);
      let tierSelected = false;
      migrateToSuite.tiers.forEach((tier) =>{
        if(tier.defaultSel){
          tierSelected = true
          suite.migratedTo.selectedTierDesc = tier.desc
          suite.migratedTo.selectedTier = tier.name
        }
      })
      if(!tierSelected){
        suite.migratedTo.selectedTier = migrateToSuite.tiers[0].name
        suite.migratedTo.selectedTierDesc = migrateToSuite.tiers[0].desc
      }
    }
    this.priceEstimateService.isMigrateSuitedSelected = true;
    this.updateOtherIncompatibleSuites(suite.migratedTo)
  }

  updateOtherIncompatibleSuites(migratedTo, restore?){
    let allMigratedToSuitesSet = new Set<string>()
    if(!restore){
      allMigratedToSuitesSet.add(migratedTo.desc);
    }
    this.swEnrollmentData.pools.forEach((pool) =>{
      if(pool.eligibleForMigration){
        pool.suites.forEach((suite) => {
          if(suite.eligibleForMigration && !suite['isSwTierUpgraded'] && !suite.hasSwRelatedCxUpgraded && suite.migrateToSuites?.length){
            const data = suite.migrateToSuites.find(migrateToSuite => migrateToSuite.desc === migratedTo.desc);
            if(data){
              suite['incompatibleMigrationSuite'] = []
              if(restore){//cancel migration
                this.updateSuiteTierArray(suite);
                suite.migratedTo = {};
                suite['differentTierError'] = false
                suite.migrated = false;
                this.priceEstimateService.isMigrateSuiteError = false;
              } else {
                suite.migratedTo = JSON.parse(JSON.stringify(migratedTo));//add error catch
                suite.migrated = true;
                if(!suite.suiteModified && suite.migratedTo.mappingType?.length > 1){
                  suite.migratedTo.migrationType = this.constantsService.FULL
                }
                if(!suite.migratedTo.migrationType || suite.fullMigrationNotEligible || suite.migratedTo.fullMigrationNotEligible || suite.suiteModified){
                  suite.migratedTo.migrationType = suite.migratedTo.mappingType[0];
                }
                this.priceEstimateService.upgradedSuitesTier.push(suite);
              }
            }
            if(suite.migratedTo){
              allMigratedToSuitesSet.add(suite.migratedTo.desc);
            }

            if(suite.migratedTo && suite.migrateToSuites?.length && !suite.migratedTo.incompatibleSuites && !restore){
              const data = suite.migrateToSuites.find(obj => obj.desc === suite.migratedTo.desc);
              if(data){
                suite.migratedTo.incompatibleSuites = data.incompatibleSuites;
              }
            }

          }
        })
      }
    })

    this.priceEstimateService.displayErrorForBlockingRules = false;
    if(allMigratedToSuitesSet.size > 1){
      this.checkBlockingRules(allMigratedToSuitesSet)
    } 
  }

  checkBlockingRules(allMigratedToSuitesSet:Set<string>){
    this.swEnrollmentData.pools.forEach((pool) =>{
      if(pool.eligibleForMigration){
        pool.suites.forEach((suite) => {
          if(suite.migrated && suite.migratedTo?.incompatibleSuites){
            suite['incompatibleMigrationSuite'] = []
            allMigratedToSuitesSet.forEach((element) =>{
              if(suite.migratedTo.incompatibleSuites.includes(element)){
                suite['incompatibleMigrationSuite'].push(element)
                this.priceEstimateService.displayErrorForBlockingRules = true;
              }
            })
          }

        })
      }
    })
  }

  restoreMigrateSuite(suite) {
    if (suite.suiteModified && suite.migratedTo) {
      suite.pendingMigrationCancelled = true;
    }
    this.updateOtherIncompatibleSuites(suite.migratedTo, true)
    suite.migratedTo = {};

    suite.migrated = false;
    
    this.priceEstimateService.isMigrateSuitedSelected = false;
  }

  updateSuiteTierArray(suite){
    let valueFound = false;
    if(this.priceEstimateService.upgradedSuitesTier.length){
      this.priceEstimateService.upgradedSuitesTier.forEach((value) => {

        if(value.name === suite.name && suite.migrated) {
          suite.migrated = false
          this.priceEstimateService.upgradedSuitesTier.splice(suite, 1);
          valueFound = true;
        }
      })
      if(!valueFound){
        this.priceEstimateService.upgradedSuitesTier.push(suite);
        
      }
    } else {
      this.priceEstimateService.upgradedSuitesTier.push(suite);
    }
  }

  restoreSuiteTier(suite) {
    suite['upgradedTier'] = undefined;
    suite.isSwTierUpgraded = false;
  }
  selectMigrateSuiteTier(tier, suite){
    suite.migratedTo.selectedTier = tier.name
    suite.migratedTo.selectedTierDesc = tier.desc;
    this.checkForTierError(tier.desc,suite)
  }
  checkForTierError(tierDesc,updatedSuite){
    const suiteArray = []
    let hasDifferentTierSelection = false
    updatedSuite.differentTierError = false;
    this.priceEstimateService.isMigrateSuiteError = false;
    this.swEnrollmentData.pools.forEach((pool) =>{
      if(pool.eligibleForMigration){
        pool.suites.forEach((suite) => {
          if(suite.eligibleForMigration  && suite.incompatibleSuites){
            if(suite.incompatibleSuites.includes(updatedSuite.migratedTo?.desc)){
              suiteArray.push(suite)
              if(suite.migratedTo?.selectedTierDesc !== tierDesc){
                hasDifferentTierSelection = true
                updatedSuite.differentTierError = true;
                this.priceEstimateService.isMigrateSuiteError = true;
              }
            }
          }
        })
      }
    })
    
    suiteArray.forEach((suite) =>{
      if(hasDifferentTierSelection){
        suite.differentTierError = true;
        this.priceEstimateService.isMigrateSuiteError = true;
        this.errorSuiteArray.push(suite.desc)
      } else {
        suite.differentTierError = false;
        this.priceEstimateService.isMigrateSuiteError = false;
        if (this.errorSuiteArray.indexOf(suite.desc > -1)) {
          this.errorSuiteArray.splice(suite.desc, 1);
        }
      }
    })
   
  }
  updateMigrateType(suite){
    if(suite.migratedTo.migrationType === suite.migratedTo?.mappingType[1]){
      suite.migratedTo.migrationType = suite.migratedTo?.mappingType[0]
    } else {
      suite.migratedTo.migrationType = suite.migratedTo?.mappingType[1]
    }
  }
}
