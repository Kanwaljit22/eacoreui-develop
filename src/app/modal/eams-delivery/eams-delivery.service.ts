import { Injectable } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators';


@Injectable()
export class EamsDeliveryService {
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
        private appDataService: AppDataService, public proposalDataService: ProposalDataService) { }

    saveEAMDelivery(reqJson) {

        let url = 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId;
        return this.http.post(this.appDataService.getAppDomain + url + '/save-eams-delivery-info', reqJson)
            .pipe(map(res => res));
    }

}
