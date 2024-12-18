import { TestBed } from '@angular/core/testing';
import { ColumnCellComponent } from './column-cell.component';
import { ConstantsService } from '@app/shared/services/constants.service';

// Mock ConstantsService
const mockConstantsService = {
    QUALIFICATION_COMPLETE: 'Qualification Complete',
    IN_PROGRESS_STATUS: 'In Progress',
};

describe('ColumnCellComponent', () => {
    let component: ColumnCellComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ColumnCellComponent],
            providers: [
                { provide: ConstantsService, useValue: mockConstantsService }
            ]
        });

        const fixture = TestBed.createComponent(ColumnCellComponent);
        component = fixture.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('agInit', () => {
        it('should initialize proposal data and approverTeamDetails', () => {
            const mockParams = {
                data: {
                    approverTeamDetails: [{ approverTeamName: 'Team A' }],
                    status: 'Draft'
                }
            };

            component.agInit(mockParams);

            expect(component.proposalData).toEqual(mockParams.data);
            expect(component.approverTeamDetails).toEqual(mockParams.data.approverTeamDetails);
            expect(component.selectedApproverTeamName).toEqual('Team A');
        });

        it('should not set selectedApproverTeamName if approverTeamDetails is empty', () => {
            const mockParams = {
                data: {
                    approverTeamDetails: [],
                    status: 'Draft'
                }
            };

            component.agInit(mockParams);

            expect(component.selectedApproverTeamName).toBe('');
        });
    });

    describe('displayApproverTeamName', () => {
        it('should set selectedApproverTeamName if exceptionStatus is "Pending"', () => {
            const approverTeam = {
                approverTeamName: 'Team B',
                exceptionStatus: 'Pending'
            };

            const result = component.displayApproverTeamName(approverTeam);

            expect(component.selectedApproverTeamName).toBe('Team B');
            expect(result).toBe('Team B');
        });

        it('should not set selectedApproverTeamName if exceptionStatus is not "Pending"', () => {
            const approverTeam = {
                approverTeamName: 'Team C',
                exceptionStatus: 'Approved'
            };

            const result = component.displayApproverTeamName(approverTeam);

            expect(component.selectedApproverTeamName).not.toBe('Team C');
            expect(result).toBe('Team C');
        });
    });

    describe('checkProposalStatus', () => {
        it('should return false if status is QUALIFICATION_COMPLETE', () => {
            component.proposalData = { status: mockConstantsService.QUALIFICATION_COMPLETE };

            const result = component.checkProposalStatus();

            expect(result).toBe(false);
        });

        it('should return false if status is IN_PROGRESS_STATUS', () => {
            component.proposalData = { status: mockConstantsService.IN_PROGRESS_STATUS };

            const result = component.checkProposalStatus();

            expect(result).toBe(false);
        });

        it('should return true if status is neither QUALIFICATION_COMPLETE nor IN_PROGRESS_STATUS', () => {
            component.proposalData = { status: 'Other' };

            const result = component.checkProposalStatus();

            expect(result).toBe(true);
        });
    });

    it('should return false in refresh method', () => {
        expect(component.refresh()).toBe(false);
    });
});
