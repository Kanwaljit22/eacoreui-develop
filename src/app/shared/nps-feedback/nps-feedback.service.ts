import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators';


@Injectable()
export class NpsFeedbackService {


    constructor(private http: HttpClient, public appDataService: AppDataService, public proposalDataService: ProposalDataService) { }

    submitFeedback(reqestObj) {
        return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId + '/user-feedback', reqestObj)
            .pipe(map(res => res));
    }
}