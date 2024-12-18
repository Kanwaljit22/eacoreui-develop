import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '../shared/services/app.data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProposalDataService } from '../proposal/proposal.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';
import { map } from 'rxjs/operators';


@Injectable()
export class SalesReadinessService {
  activityLog: boolean;

  readonly MONTH = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May',
  '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
    private appDataService: AppDataService, public proposalDataService: ProposalDataService,
    public qualService: QualificationsService, public messageService: MessageService) { }
  getSalesReadinessData(proposalId) {
    // return this.http
    //   .get('assets/data/salesReadiness/salesReadiness.json');
    return this.http
      .get(this.appDataService.getAppDomain + 'api/proposal/' + proposalId + '/salesReadiness');
  }

  validatePartnerAuthorization(reqJSON) {
    return this.http
      .post(this.appDataService.getAppDomain + 'api/proposal/' + reqJSON.proposalId + '/salesReadiness', reqJSON);

  }

  getProposalHeaderData(reqJSON) {
    return this.http.post(this.appDataService.getAppDomain + 'api/proposal/header', reqJSON)
      .pipe(map(res => res));
  }

  getComplianceHoldData(proposalId) {
    return this.http
      .get(this.appDataService.getAppDomain + 'api/proposal/compliance-hold-data?p=' + proposalId);
  }

  postComplianceHoldData(reqJSON) {
    return this.http
      .post(this.appDataService.getAppDomain + 'api/proposal/compliance-hold-manual-release', reqJSON);
  }

  prepareSubHeaderObject(screenName, isProposalCreation: boolean, json) {
    this.getProposalHeaderData(json).subscribe((res: any) => {
      this.appDataService.subHeaderData.favFlag = false;
      this.appDataService.subHeaderData.moduleName = screenName;
      console.log(screenName);
      if (isProposalCreation) {
        this.appDataService.subHeaderData.custName = res.data.name;
        const subHeaderAry = new Array<any>();

        let dateToFormat = res.data.eaStartDateStr;
        let year = dateToFormat.substring(0, 4);
        let month = dateToFormat.substring(4, 6);
        let day = dateToFormat.substring(6);
        let dateFormed = this.MONTH[month] + ' ' + day + ', ' + year;

        subHeaderAry.push(dateFormed);
        subHeaderAry.push((res.data.eaTermInMonths + ' Months'));
        subHeaderAry.push(res.data.priceList);
        subHeaderAry.push(res.data.billingModel);
        subHeaderAry.push(res.data.status);
        this.appDataService.subHeaderData.subHeaderVal = subHeaderAry;
        this.proposalDataService.proposalDataObject.proposalData.name = res.data.name;
        this.proposalDataService.proposalDataObject.proposalData.desc = res.data.desc;
        this.proposalDataService.proposalDataObject.proposalData.eaTermInMonths = res.data.eaTermInMonths;
        this.proposalDataService.proposalDataObject.proposalData.billingModel = res.data.billingModel;
        this.proposalDataService.proposalDataObject.proposalData.priceList = res.data.priceList;
        this.proposalDataService.proposalDataObject.proposalData.eaStartDateStr = res.data.eaStartDateStr;
        this.proposalDataService.proposalDataObject.proposalData.eaStartDateFormed = dateFormed;
        this.proposalDataService.proposalDataObject.proposalData.status = res.data.status;
        // this.proposalDataService.proposalDataObject.proposalData.countryOfTransaction = res.data.countryOfTransaction;
        console.log(subHeaderAry);
      } else {
        this.appDataService.subHeaderData.subHeaderVal = null;
      }

    });
  }
}
