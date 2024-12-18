import { Injectable } from '@angular/core';
import { AppDataService } from '@app/shared/services/app.data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { MessageService } from '@app/shared/services/message.service';
import { ConstantsService } from '@app/shared/services/constants.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators';


@Injectable()
export class EditQualificationService {
    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
        private appDataService: AppDataService, public proposalDataService: ProposalDataService,
        public qualService: QualificationsService, public messageService: MessageService, public constantsService: ConstantsService) { }

    updateQualOrProposalFromModal(reqJson) {
        let url = '';
        if (this.appDataService.editModal === this.constantsService.QUALIFICATIONS) {
            url = 'api/qualification/' + this.qualService.qualification.qualID;
        } else if (this.appDataService.editModal === this.constantsService.PROPOSALS) {
            url = 'api/proposal/' + this.proposalDataService.proposalDataObject.proposalId;
        }
        return this.http.put(this.appDataService.getAppDomain + url + '/workflow-immutable-parameter', reqJson)
            .pipe(map(res => res));

    }

}
