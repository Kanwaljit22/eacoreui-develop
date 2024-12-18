import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { IEnrollmentsInfo, ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';

@Component({
  selector: 'app-migrate-eligible-reasons',
  templateUrl: './migrate-eligible-reasons.component.html',
  styleUrls: ['./migrate-eligible-reasons.component.scss']
})
export class MigrateEligibleReasonsComponent {

  showUpgradeSuitesTab = false;
  enrollmentData:[IEnrollmentsInfo];
  displayData = false
  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, public dataIdConstantsService: DataIdConstantsService,
    public eaRestService: EaRestService, private vnextService: VnextService, private eaService: EaService, private utilitiesService: UtilitiesService, public proposalStoreService: ProposalStoreService) { }

  ngOnInit(): void {
    this.getEnrollData();
    
  }

  getEnrollData() {
    let displayData = false
    //const url = "assets/vnext/cross-suite-eligible.json";//remove this json call with real API 
   // this.eaRestService.getApiCallJson(url).subscribe((response: any) => {
      const url = this.vnextService.getAppDomainWithContext + 'proposal/'+ this.proposalStoreService.proposalData.objId + '/enrollment';
      this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithData(response)) {
        this.enrollmentData = response.data.enrollments;
        this.utilitiesService.sortArrayByDisplaySeq(this.enrollmentData);
        this.enrollmentData.forEach((enrollment) =>{
          let displayEnrollment = false
          this.utilitiesService.sortArrayByDisplaySeq(enrollment.pools);
          if(enrollment.eligibleForMigration && enrollment.id !== 5){
            enrollment.pools.forEach((pool) => {
              let displayPool = false
              this.utilitiesService.sortArrayByDisplaySeq(pool.suites);
              //let   count = 0
              pool.suites.forEach((suite) => {
                let displaySuiteforTarget = false
                //suite.migrateToSuites = [{desc: 'target' + count++ ,notEligibleForMigrationReasons:[{text:'123'},{text:'abc'},{text:'xyz'}] },{desc: 'target' + count++ ,notEligibleForMigrationReasons:[{text:'123'},{text:'abc'},{text:'xyz'}] }]
                //suite.notEligibleForMigrationReasons = [{text:'suite rearon 1'},{text:'suite rearon 1'}]
                if(suite.migrateToSuites?.length){
                  for(let i = 0; i < suite.migrateToSuites.length; i++){
                    if(suite.migrateToSuites[i].notEligibleForMigrationReasons && suite.migrateToSuites[i].notEligibleForMigrationReasons.length){
                      displaySuiteforTarget = true
                    }
                  }
                }
                if((!suite.eligibleForMigration && !suite.migrated && suite.migrateToSuites?.length) || displaySuiteforTarget){
                  displayData = true
                  displayPool = true;
                  displayEnrollment = true;
                  suite['displaySuiteforTarget'] = displaySuiteforTarget
                  // const targetSuites = []
                  // if(suite.migrateToSuites?.length){
                  //   suite.migrateToSuites.forEach((migrateToSuite) => {
                  //     targetSuites.push(migrateToSuite.desc)
                  //   })
                  // }
                  // suite['targetSuitesDesc'] = targetSuites
                  if(suite.notEligibleForMigrationReasons?.length){
                    suite.migrateToSuites.forEach((migrateToSuite) => {
                      if (migrateToSuite.notEligibleForMigrationReasons?.length) {
                        migrateToSuite.notEligibleForMigrationReasons = migrateToSuite.notEligibleForMigrationReasons.concat(suite.notEligibleForMigrationReasons)
                      } else {
                        migrateToSuite.notEligibleForMigrationReasons = [...suite.notEligibleForMigrationReasons]
                      }
                    })
                  }
                }
              })
              pool['displayPool'] = displayPool
            })

          }
          enrollment['displayEnrollment'] = displayEnrollment
          
        })
        if(displayData){
          this.displayData = true
        }
      }

    })
  }

  close() {
    this.activeModal.close({
      continue: false
    });
  }

}
