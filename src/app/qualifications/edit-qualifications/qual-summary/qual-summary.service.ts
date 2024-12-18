import { ManageAffiliatesService } from './../manage-affiliates/manage-affiliates.service';
import { Router } from '@angular/router';
// import { AppDataService } from './../../shared/services/app.data.service';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppDataService, SessionData } from '@app/shared/services/app.data.service';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { map } from 'rxjs/operators';

@Injectable()
export class QualSummaryService {
    architectureName: string;
    customerName: string;
    subsidiaryDataEmitter = new EventEmitter<Array<any>>();

    constructor(private http: HttpClient, private appDataService: AppDataService, private qualService: QualificationsService
        , private messageService: MessageService, private router: Router, private affiliatesService: ManageAffiliatesService,
        private constantsService: ConstantsService) { }

    goToQualification() {

        if (!this.appDataService.customerID || !this.appDataService.archName) {
            const sessionObject: SessionData = this.appDataService.getSessionObject();
            this.appDataService.archName = sessionObject.custInfo.archName;
            this.appDataService.customerID = sessionObject.customerId;
        }
        if (!this.appDataService.isPatnerLedFlow) {
            // this.router.navigate(['/qualifications', {
            // architecture: this.appDataService.archName
            // , customername: this.appDataService.customerName
            //  , customerId: this.appDataService.customerID
            // }]);
            this.router.navigate([
                '/allArchitectureView',
                {
                    architecture: encodeURIComponent(this.appDataService.archName),
                    customername: encodeURIComponent(this.appDataService.customerName),
                    customerId: encodeURIComponent(this.appDataService.customerID),
                    selected: encodeURIComponent(this.constantsService.QUALIFICATION),
                }
            ]);
        } else {
            //     this.appDataService.userDashboardFLow = AppDataService.USER_DASHBOARD_FLOW;
            // const sessionObject: SessionData = this.appDataService.getSessionObject();
            // sessionObject.userDashboardFlow = this.appDataService.userDashboardFLow;
            // //this.qualService.isCreatedbyQualView = 'My Qual';
            // this.appDataService.setSessionObject(sessionObject);
            // this.appDataService.showEngageCPS = false;
            // this.router.navigate(['/qualifications']);

            const customerId = null;
            const dealId = this.qualService.qualification.dealId;
            // assigning deal data so that we can use it for header; not getting deal related data on the qual list page
            // this.qualService.dealData = dealData;
            // this flag is to manage header if partner is landing on qual lsit page for a deal.
            this.appDataService.qualListForDeal = true;
            this.router.navigate([
                'qualifications/create-qualifications',
                {
                    custId: customerId,
                    dId: dealId,
                    qId: this.appDataService.quoteIdForDeal
                }
            ]);

        }
    }

    getCustomerInfo() {
        return this.http.get(this.appDataService.getAppDomain + 'api/qualification/get?q=' + this.qualService.qualification.qualID)
            .pipe(map(res => res));
    }

    getGeographySummary() {
        let requestObj = {
            userId: this.appDataService.userId,
            qualId: this.qualService.qualification.qualID
        }

        return this.http.post(this.appDataService.getAppDomain + 'geographySummary', requestObj)
            .pipe(map(res => res));
    }

    loadSubsidiaryData() {
        let requestObj = {
            // userId: this.appDataService.userId,
            qualId: this.qualService.qualification.qualID
        }

        this.affiliatesService.getSubsidiaryDataList(requestObj).subscribe((res: any) => {
            if (res) {
                if (res.messages && res.messages.length > 0) {
                    this.messageService.displayMessagesFromResponse(res);
                }
                if (!res.error) {
                    try {
                        this.subsidiaryDataEmitter.emit(res);
                    } catch (error) {
                        console.error(error.ERROR_MESSAGE);
                        this.messageService.displayUiTechnicalError(error);
                    }
                }
            }
        });

    }

    loadGuAndHqDetails() {        
      return this.http.get(this.appDataService.getAppDomain + 'api/qualification/subsidiaries/selected-hq-hierarchy/'+this.qualService.qualification.qualID)
      .pipe(map(res => res));
    }


    getBranches(hqObj) {
        const requestObj = {
            'qualId': this.qualService.qualification.qualID,
            'guId': hqObj.guId,
            'hqId' : hqObj.selectedHQ
        }

        return this.http.post(this.appDataService.getAppDomain + 'api/qualification/subsidiaries/selected-hq-br-hierarchy', requestObj)
            .pipe(map(res => res));
      }

}
