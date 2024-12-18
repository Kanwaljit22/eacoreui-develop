import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppDataService } from '@app/shared/services/app.data.service';
import { BlockUiService } from '@app/shared/services/block.ui.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators'


@Injectable()
export class ApproveExceptionService {

  reqJSON: any = {};
  approveType = '';
  constructor(private http: HttpClient, private configService: AppDataService, private blockUiService: BlockUiService,
    private proposalDataService: ProposalDataService
  ) { }



  approveException(reqJSON) {
    // added approvetype to know if its type is DNA / PA
    return this.http.post(this.configService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/override-threshold-exception?type=' + this.approveType, reqJSON)
      .pipe(map(res => res));
  }

}
