import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EaUtilitiesService } from 'ea/commons/ea-utilities.service';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { LocalizationPipe } from 'vnext/commons/shared/pipes/localization.pipe';
import { DashboardPendingApprovalsListComponent } from './dashboard-pending-approvals-list.component';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class MockEaRestService {

    postApiCall() {
      return of({
        data:{
            responseApproverList: [
                {
                    "test": "test"
                }
            ],
            proposals: [{
                "test": "test"
            }],
            page: {
                "test": "test"
            },
            totalRecords: 12
        },
      })
    }
}

describe('DashboardPendingApprovalsListComponent', () => {
    let component: DashboardPendingApprovalsListComponent;
    let fixture: ComponentFixture<DashboardPendingApprovalsListComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
          declarations: [ DashboardPendingApprovalsListComponent,LocalizationPipe ],
          imports: [HttpClientModule, RouterTestingModule],
          schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
          providers: [{provide:EaRestService, useClass: MockEaRestService}, CurrencyPipe, EaUtilitiesService, LocalizationService, DataIdConstantsService, ElementIdConstantsService]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(DashboardPendingApprovalsListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should getProposalListData', () => {
        component.isSearchedData = true;
        component.getProposalListData();
        expect(component.isSearchedData).toBe(false);
    })

    it('should getProposalListData', () => {
        const data = {
            error: true
        } 
        let service = fixture.debugElement.injector.get(EaRestService);
        jest.spyOn(service, 'postApiCall').mockReturnValue(of(data));
        component.getProposalListData();
        expect(component.pendingApprovalsData ).toEqual([]);
    });

    it('should paginationUpdated', () => {
        const event = {
            pageSize: 10,
            currentPage: 1
        }
        component.searchParam = ''
        component.paginationUpdated(event);
        expect(component.searchParam).toEqual('');
    });

    it('should paginationUpdated', () => {
        const event = {
            pageSize: 10,
            currentPage: 1
        }
        component.searchParam = 'test'
        component.isSearchedData = true;
        const spy = jest.spyOn(component, 'searchExceptions');
        component.paginationUpdated(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should goToProposal', () => {
        const proposal = {
            buyingProgram: '3.0'
        }
        window.open = function () { return window; }
        let call = jest.spyOn(window, "open");
        component.goToProposal(proposal);
        expect(call).toHaveBeenCalled();
    });

    it('should goToProposal', () => {
        const proposal = {
        }
        window.open = function () { return window; }
        let call = jest.spyOn(window, "open");
        component.goToProposal(proposal);
        expect(call).toHaveBeenCalled();
    });

    it('should getSubmittedByName', () => {
        const data = {
            proposalExceptionDetails: [ {
                createdBy: 'test'
            }]
        }
        const func =  component.getSubmittedByName(data);
        expect(func).toBe(data.proposalExceptionDetails[0].createdBy)
    });

    it('should getSubmittedByName', () => {
        const data = {
        }
        component.getSubmittedByName(data);
    });

    it('should getExceptionRequestedList', () => {
        const data = {
            proposalExceptionDetails: [ {
                exceptionName: "test"
            }]
        }
        const func = component.getExceptionRequestedList(data);
        expect(func).toBe(data.proposalExceptionDetails[0].exceptionName)
    });

    it('should getExceptionRequestedList', () => {
        const data = {
        }
        component.getExceptionRequestedList(data);
    });

    it('should approverTeamDropOutside', () => {
        const val = {
            showApproverTeamDropdown: true
        }
        const event = {}
        component.approverTeamDropOutside(event, val);
        expect(val.showApproverTeamDropdown).toBe(false);
    });

    it('should displayApproverTeamName', () => {
        const proposal = {
            approverTeamDetails: [{
                approverTeamName: "test",
                exceptionStatus : "Pending"
            }]
        }
       const func = component.displayApproverTeamName(proposal);
       expect(func).toBe(proposal.approverTeamDetails[0].approverTeamName)
    });

    it('should displayApproverTeamName', () => {
        const proposal = {
        }
        component.displayApproverTeamName(proposal);
        const func = component.displayApproverTeamName(proposal);
        expect(func).toBe('')
    });

    it('should displayApproverTeamName', () => {
        const proposal = {
            approverTeamDetails: [{
                approverTeamName: "test",
                exceptionStatus : "Completed"
            }]
        }
        component.displayApproverTeamName(proposal);
    });

    it('should selectedCreatedBy Pending My Approvals', () => {
        const value = 'Pending My Approvals'
        component.selectedCreatedBy(value);
        expect(component.selectedViewKey).toBe('TEAM')
        expect(component.selectedView).toBe(value)
        expect(component.searchParam).toBe('')
    });

    it('should selectedCreatedBy Pending My Teams Approvals', () => {
        const value = "Pending My Team's Approvals"
        component.selectedCreatedBy(value);
        expect(component.selectedViewKey).toBe('TEAM')
        expect(component.selectedView).toBe(value)
        expect(component.searchParam).toBe('')
    });

    it('should searchExceptions', () => {
        component.searchParam = ''
        component.searchExceptions();
    });

    it('should searchExceptions', () => {
        component.searchParam = 'test'
        const data = {
            error: true
        } 
        let service = fixture.debugElement.injector.get(EaRestService);
        jest.spyOn(service, 'postApiCall').mockReturnValue(of(data));
        component.searchExceptions();
        expect(component.pendingApprovalsData).toEqual([])
    });

    it('should searchProposals', () => {
        component.searchParam = 'test'
        component.searchExceptions();
        expect(component.isSearchedData).toBe(true)
    });
      
 });