import { ConstantsService } from '@app/shared/services/constants.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppDataService } from '@app/shared/services/app.data.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { map } from 'rxjs/operators';


@Injectable()
export class LinkProposalArchitectureService {
  reqJSON: any = {};
  // selectedProposals: any = new Set();
  selectedProposals = [];
  deLinkGroup = false;

  constructor(private http: HttpClient, public appDataService: AppDataService, public proposalDataService: ProposalDataService,
    private constantsService: ConstantsService) { }

  // Api call to get the matching and non-matching data for linking proposal
  getLinkableProposalData() {
    // if group id is -1 pass propsoal id else pass proposal id as -1
    if (this.proposalDataService.proposalDataObject.proposalData.groupId === -1) {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId + '/proposed-link').pipe(map(res => res));
    } else {
      return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' + -1 + '/proposed-link?groupId=' +
      this.proposalDataService.proposalDataObject.proposalData.groupId).pipe(map(res => res));
    }
  }

  // to call link and delink api's
  linkDelinkProposal(hasLinkedProposal) {
    if (hasLinkedProposal) {
      return this.deLinkProposal();
    } else {
      return this.linkProposal();
    }
  }

  // api call to post the selected proposal id's to link proposals
  linkProposal() {
    if (this.proposalDataService.proposalDataObject.proposalData.groupId === -1) {
      return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' +
      this.proposalDataService.proposalDataObject.proposalId + '/link', this.selectedProposals).pipe(map(res => res));
    } else {
      return this.http.post(this.appDataService.getAppDomain + 'api/proposal/' + -1 + '/link?groupId=' +
      this.proposalDataService.proposalDataObject.proposalData.groupId, this.selectedProposals).pipe(map(res => res));
    }
  }

  // api call to De-link proposals
  deLinkProposal() {
    let groupId;
    if (this.proposalDataService.proposalDataObject.proposalData.architecture === this.constantsService.CISCO_SECURITY_CHOICE) {
      this.proposalDataService.isSecurityIncludedinCrossArch = false;
    }
    if (this.deLinkGroup) {
      groupId = this.proposalDataService.proposalDataObject.proposalData.groupId;
    } else {
      groupId = -1;
    }
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/de-link?groupId=' + groupId).pipe(map(res => res));
  }

  // Api call to get the linked data after linking
  getLinkedProposalData() {
    return this.http.get(this.appDataService.getAppDomain + 'api/proposal/' +
    this.proposalDataService.proposalDataObject.proposalId + '/link?groupId=' +
    this.proposalDataService.proposalDataObject.proposalData.groupId).pipe(map(res => res));
  }

}
