import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { EaService } from 'ea/ea.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';


@Component({
  selector: 'app-upgrade-summary',
  templateUrl: './upgrade-summary.component.html',
  styleUrls: ['./upgrade-summary.component.scss']
})

export class UpgradeSummaryComponent implements OnInit {

  viewUpgradeSummaryData:any;
  tableData: any;
  downsellCount: boolean = false;
  @ViewChild('downloadZipLink', { static: false }) private downloadZipLink: ElementRef;

  constructor(public activeModal: NgbActiveModal, public localizationService:LocalizationService, public eaService: EaService, public dataIdConstantsService: DataIdConstantsService, public utilitiesService: UtilitiesService,public proposalStoreService: ProposalStoreService, private eaRestService: EaRestService, private vnextService: VnextService) { }

  ngOnInit(): void {
    this.eaService.getLocalizedString('view-upgradeSummary');
    if(this.viewUpgradeSummaryData){
      this.tableData = this.viewUpgradeSummaryData;
      this.downsellCount = false;
      for (let data of this.tableData) {
        data.expanded = true;
          //for (let suite of data.suites) {
          for (let i =0; i < data.suites.length; i++ ) {
            if(!data.suites[i]?.upSell && data.suites[i]?.netChange){
              if(this.eaService.features.CROSS_SUITE_MIGRATION_REL){
                if(data.suites[i].upgraded){
                  this.downsellCount = true;
                } else if(data.suites[i].migrated && data.suites[i].upgradeType === 'Software'){
                  const cxSuite = data.suites[i + 1];
                  if(cxSuite && cxSuite.relatedSwAto === data.suites[i].ato){
                    const total = cxSuite.netChange + data.suites[i].netChange
                    if(total && total < 0){
                      this.downsellCount = true;
                    }
                  } else {
                    this.downsellCount = true;
                  }
                } else if(data.suites[i].migrated && data.suites[i].upgradeType !== 'Software'){
                  const swSuite = data.suites[i - 1];
                  if(data.suites[i] && data.suites[i].relatedSwAto === swSuite.ato){
                    const total = data.suites[i].netChange + swSuite.netChange
                    if(total && total < 0){
                      this.downsellCount = true;
                    }
                  }
                }
              } else {
                this.downsellCount = true;
              }
            }
        }
      }

    }
  }

  close() {
    this.activeModal.close({
      continue: false
    });
  }

  expand(val) {
    val.expanded = !val.expanded;
  }

  // to download Migration/Upgrade summary excel
  downloadUpgradeMigrationSummary() {
    const url = 'proposal/'+ this.proposalStoreService.proposalData.objId +'/enrollment/download';

    this.eaRestService.downloadDocApiCall(url).subscribe((response: any) => {
      if (this.vnextService.isValidResponseWithoutData(response, true)) {
        this.utilitiesService.saveFile(response, this.downloadZipLink);
      }
    });
  }
}

