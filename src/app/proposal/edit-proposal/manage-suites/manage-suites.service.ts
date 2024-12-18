import { Injectable, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppDataService } from '../../../shared/services/app.data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConstantsService } from '@app/shared/services/constants.service';
import { map } from 'rxjs/operators'

@Injectable()
export class ManageSuitesService {

    proposalId: any;
    excludedSuites: any = [];
    cxSuites = [];
    excludedSuitesSet: any = new Set();
    reqJSON: any = {};
    suitesData: any = [];
    // suitSaved = new EventEmitter<any>();
    // getPriceEstimate = false
    noOfSuitesCount = new EventEmitter<any>();
    selectedAtoEmitter = new EventEmitter();
    cxSuiteSelectionEmitter = new EventEmitter<any>(); // call to check cxrate


    constructor(private http: HttpClient, private appDataService: AppDataService, public constantsService: ConstantsService) { }

    saveSuites() {
        this.reqJSON['suites'] = this.excludedSuites;
        this.reqJSON['cxSuites'] = this.cxSuites;
        // this.reqJSON['userId'] = this.appDataService.userId;
        this.reqJSON['proposalId'] = this.proposalId;
        this.reqJSON['archName'] = this.appDataService.archName;
        // send no of mandatory suites selected in the request only for security architecture
        if (this.appDataService.archName === this.constantsService.SECURITY) {
            this.reqJSON['noOfMandatorySuiteSelected'] = this.appDataService.noOfMandatorySuiteSelected;
        }
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/suiteSelection', this.reqJSON)
            .pipe(map(res => res));
    }

    checkForRedirection(){
        //end point not provided by MW; using placeholder, should be removed once have real end point
       /* return this.http.get('assets/data/billingInfoRedirectionData.json')
            .pipe(map(res => res));*/
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+this.proposalId+'/bill-to-punchout-details')
            .pipe(map(res => res));   
    }
    getSuites(reqJSON){
        return  this.http.post(this.appDataService.getAppDomain + 'api/proposal/suites', reqJSON)
        .pipe(map(res => res));
       }
    // getSuitesDetails(){
    //     return this.http.get(this.appDataService.getAppDomain + 'api/proposal/suite-config')
    //     .pipe(map(res => res));
    // }

    saveConfigPayload(proposalId){
        const reqJson = {"contextPath":"A-FLEX"}
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/configPunchOut/'+proposalId,reqJson)
         .pipe(map(res => res));
    }

    ibPull(proposalId){
        return this.http.get(this.appDataService.getAppDomain + 'api/proposal/'+proposalId+'/cx-ib-pull')
         .pipe(map(res => res));
    }
       
}
