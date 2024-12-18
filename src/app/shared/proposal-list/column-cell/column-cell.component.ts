import { ConstantsService } from '@app/shared/services/constants.service';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'column-cell',
    templateUrl: './column-cell.component.html'
})
export class ColumnCellComponent implements ICellRendererAngularComp {
    public params: any;
    approverTeamDetails: any[];
    selectedApproverTeamName = '';
    proposalData: any;

    constructor(private constantsService: ConstantsService) { }

    agInit(params) {
        this.proposalData = params.data;
        this.approverTeamDetails = params.data.approverTeamDetails;
        if (this.approverTeamDetails && this.approverTeamDetails.length > 0) {
            this.selectedApproverTeamName = this.approverTeamDetails[0].approverTeamName;
        }
    }

    displayApproverTeamName(approverTeam) {
        if (approverTeam.exceptionStatus === 'Pending') {
            this.selectedApproverTeamName = approverTeam.approverTeamName;
        }
        return approverTeam.approverTeamName;
    }

    refresh(): boolean {
        return false;
    }

    checkProposalStatus() {
        if (this.proposalData.status === this.constantsService.QUALIFICATION_COMPLETE ||
            this.proposalData.status === this.constantsService.IN_PROGRESS_STATUS) {
            return false;
        } else {
            return true;
        }
    }
}
