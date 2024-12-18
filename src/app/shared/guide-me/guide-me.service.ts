import { ConstantsService } from '@app/shared/services/constants.service';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../services/app.data.service';
import { map } from 'rxjs/operators';

@Injectable()
export class GuideMeService {

  guideMeText = false;
  retainGuideMeOnPageChange = false;
  displaySuiteInfoEmitter = new EventEmitter<any>();
  constructor(private http: HttpClient, private appDataService: AppDataService, private constantsService: ConstantsService) { }


  getGuideMeData(suiteId = null) {
    if (!this.appDataService.pageContext) {
      this.appDataService.pageContext = 'GuideMe';
    }
    // need one more check, if user moves out of the proposal then too appDataService.archName will remain DC
    // or add condition in all the required pages.
    // or empty the archName if user moves out of proposal
    let context = this.appDataService.pageContext;

    if (this.appDataService.archName !== AppDataService.ARCH_NAME) {

      // for all this pages we need to pass archName with the pageContext to get guide me data acc. to arch.
      if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalDefineSuiteStep ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalPriceEstimateStep ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSummaryStep ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalValidateAcceptStep ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.proposalSuccess ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.priceEstimateQtyChange
      ) {
        context = this.appDataService.pageContext + '_' + this.appDataService.archName;
      } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.accountHealth) {
        context = this.appDataService.pageContext + '_' + this.appDataService.archName;
      } else if (this.appDataService.archName === this.constantsService.SECURITY && (
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.prospectDetailsByGeography ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.prospectDetailsBySubsidiary ||
        this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.prospectDetailsBySuite
      )) {
        context = this.appDataService.pageContext + '_' + this.appDataService.archName;
      }
      if (suiteId !== null) {
        context = context + '_' + suiteId;
      }
    } else if (this.appDataService.pageContext === AppDataService.PAGE_CONTEXT.accountHealth &&
      this.appDataService.archName === AppDataService.ARCH_NAME) {
      context = this.appDataService.pageContext + '_' + this.appDataService.archName;
    }
    // remove this after we start getting data in response
    // this.appDataService.pageContext = AppDataService.PAGE_CONTEXT.userDashboard;
    return this.http.get(this.appDataService.getAppDomain + 'api/guide/list?p='
      + context)
      .pipe(map(res => res));
  }
}
