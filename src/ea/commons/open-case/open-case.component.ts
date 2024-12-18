import { Component, OnInit } from '@angular/core';
import { EaRestService } from 'ea/ea-rest.service';
import { EaStoreService } from 'ea/ea-store.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';

@Component({
  selector: 'app-open-case',
  templateUrl: './open-case.component.html',
  styleUrls: ['./open-case.component.scss']
})
export class OpenCaseComponent implements OnInit {

  showDetails = false;
  allCaseClosed = false;
  caseId = ''
  successMessage= false;
  caseList = [];
  constructor(public eaStoreService: EaStoreService, private eaRestService: EaRestService,public localizationService: LocalizationService, public dataIdConstantsService: DataIdConstantsService) { }

  ngOnInit() {
    // this.getCaseListData();
  }

  getCaseListData() {
   
    const url = 'case?p={proposalObjId}&type=pricing';
    this.eaRestService.getApiCall(url).subscribe((response: any) => {
      if (response && !response.error) {
        try {
          this.caseList = response.data;
          this.showDetails = true;
          this.checkIfAllCaseClosed(this.caseList);
          if (this.caseList.length === 0) {
            this.successMessage = true;
            this.showDetails = false;
          }
        } catch (error) {
          // this.messageService.displayUiTechnicalError(error);
        }
      }
    });
  }

  openCasePortal(url) {
    window.open(url, '_blank');
  }

  checkIfAllCaseClosed(caseList) {
    if (caseList) {
      let arrOpenCase = caseList.filter(h => h.caseClosed === false);
      if (arrOpenCase.length > 0) {
        this.allCaseClosed = false;
        if (arrOpenCase[0].pegaCaseDetails) {
          this.caseId = arrOpenCase[0].pegaCaseDetails.CaseNumber;
        }
      } else {
        this.allCaseClosed = true;
      }
    }
  }
}
