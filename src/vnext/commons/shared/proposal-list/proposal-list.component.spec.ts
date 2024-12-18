import { ProposalRestService } from './../../../proposal/proposal-rest.service';
import { of } from 'rxjs';
import { ProposalStoreService } from './../../../proposal/proposal-store.service';
import { ProposalService } from './../../../proposal/proposal.service';
import { UtilitiesService } from './../../services/utilities.service';
import { VnextStoreService } from './../../services/vnext-store.service';
import { VnextService } from './../../../vnext.service';
import { ProjectStoreService } from './../../../project/project-store.service';
import { ProjectService } from './../../../project/project.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EaRestService } from './../../../../ea/ea-rest.service';
import { EaService } from './../../../../ea/ea.service';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ProposalListComponent } from "./proposal-list.component"
import { CurrencyPipe } from '@angular/common';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

const proposalDataMock = {
    "objId": "6451ec80ceb65341e97808bd",
    "id": 8986099,
    "name": "Tr proposal Test pending proposal 5/2- New test data",
    "dealId": "61020307",
    "ciscoLed": true,
    "buyMethodDisti": false,
    "projectObjId": "64271d3ba52bf01e08b905c3",
    "enrollments": [
      "Security",
      "Services"
    ],
    "buyingProgram": "EA 3.0",
    "status": "In Progress",
    "currencyCode": "USD",
    "totalNet": 1292085.72,
    "crAt": 1683090560403,
    "crBy": "trzope",
    "upAt": 1683090670828,
    "upBy": "trzope"
  }
class MockProposalStoreService {
    proposalData = {
        id: 12345678,
    };

}

class MockProjectStoreService {
    projectData = {
        objId: 1234566,
    }
}

class MockEaRestService {
    getApiCall() {
        return of({
            data: {
                proposal: {
                    buyingProgram: "EA 3.0",
                    ciscoLed: false,
                    crAt: "2022-04-02T19:30:57.065+0000",
                    crBy: "test",
                    currencyCode: "USD",
                    dealId: "12345",
                    showDropdown: true
                }
            },
            error: false
        })
    }

    postApiCall() {
        return of({
            data: {
                page: {
                    currentPage: 0,
                    noOfPages: 1,
                    noOfRecords: 1,
                    pageSize: 50
                }
            },
            error: false
        })
    }

    deleteApiCall() {
        return of({
            data: {
                proposal: {
                    buyingProgram: "EA 3.0",
                    ciscoLed: false,
                    crAt: "2022-04-02T19:30:57.065+0000",
                    crBy: "test",
                    currencyCode: "USD",
                    dealId: "12345",
                    showDropdown: true
                }
            },
            error: false
        })
    }

    putApiCall(){
        return of({
          data: {
          test: "test"
          },
          error: false
          })
      }
    downloadDocApiCall(url) {
        return of(true);
    }
}

describe('ProposalListComponent', () => {
    let component: ProposalListComponent;
    let fixture: ComponentFixture<ProposalListComponent>;
    let eaRestService = new MockEaRestService();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule],
            declarations: [ProposalListComponent],
            providers: [{ provide: EaRestService, useValue: eaRestService }, EaService, UtilitiesService, CurrencyPipe, ProjectService, ProjectStoreService, VnextService, VnextStoreService,
                ProposalService, ProposalStoreService, ProposalRestService, ProjectRestService, DataIdConstantsService, ElementIdConstantsService],
                schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProposalListComponent);
        // let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
        // proposalStoreService.proposalData = {
        //     id: 12345678,
        // };
        component = fixture.componentInstance;
        component.paginationObject = {
            "noOfRecords": 50,
            "currentPage": 1,
            "pageSize": 50,
            "noOfPages": 1
        };
        component.request = {
            "data": {
                "createdByMe": true,
                "page": {
                    "pageSize": 50,
                    "currentPage": 0
                }
            }
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('call ngOnInit', () => {
        let proposalStoreService = fixture.debugElement.injector.get(ProposalStoreService);
        const projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
        projectStoreService.projectData = {};
        component.ngOnInit();
        expect(proposalStoreService.proposalData).toEqual({});
    });

    it('call getProjectData', () => {
        const projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
        component.getProjectData();
        expect(Object.keys(projectStoreService.projectData).length).toBeGreaterThanOrEqual(0);
    });

    it('call openManageTeam', () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456
        }
        component.openManageTeam(proposal);
        expect(proposal.showDropdown).toBe(false)
    });

    it('call openDropdown', () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456
        }
        component.openDropdown(proposal);
        expect(proposal.showDropdown).toBe(false)
    });

    it('call copy', fakeAsync(() => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456
        }
        const getProposalListData = jest.spyOn(component, 'getProposalListData');
        component.copy(proposal);
        expect(proposal.showDropdown).toBe(false)
        tick(1000);
        expect(getProposalListData).toHaveBeenCalled();
        flush();
    }));

    it('call delete', fakeAsync(()=> {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456
        }
        const getProposalListData = jest.spyOn(component, 'getProposalListData');
        component.delete(proposal);
        expect(proposal.showDropdown).toBe(false)
        tick(1000);
        expect(getProposalListData).toHaveBeenCalled();
        flush();
    }));

    it('call getProposalListData', () => {
        component.isSearchedData = true;
        component.getProposalListData();
        expect(component.isSearchedData).toBe(false)
        expect(component.request.data.page.currentPage).toEqual(0);
        expect(component.request.data.page.pageSize).toEqual(10);
    });

    it('call paginationUpdated', () => {
        const event = {
            pageSize: 50,
            currentPage : 1
        }
        component.isSearchedData = true;
        component.searchParam = 'hello';
        component.paginationUpdated(event);
        expect(component.request.data.page.pageSize).toEqual(event.pageSize);
        expect(component.request.data.page.currentPage).toEqual(event.currentPage - 1);
        component.isSearchedData = false;
        component.paginationUpdated(event);
        expect(component.searchParam).toEqual('');
    });

    it('call goToProposal', () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456
        };
        window.open = function () { return window; }
        let call = jest.spyOn(window, "open");
        component.goToProposal(proposal);
        expect(call).toHaveBeenCalled();
        // proposal.buyingProgram = '';
        // component.goToProposal(proposal);
    });

    it('call selectedCreatedBy', () => {
        let value = 'Created By Me';
        component.selectedCreatedBy(value);
        expect(component.request.data.createdByMe).toBe(true)
        value = 'test';
        component.selectedCreatedBy(value);
        expect(component.request.data.createdByMe).toBe(false)
        expect(component.selectedView).toEqual(value);
        expect(component.openDrop).toBe(false)
        expect(component.searchParam).toEqual('');
        expect(component.request.data.page.pageSize).toEqual(10);
        expect(component.request.data.page.currentPage).toEqual(0);
    });

    it('call searchProposals', () => {
        component.searchProposals();
        component.searchParam = 'testing searchProposals ';
        component.searchProposals();
        expect(component.searchParam).toEqual(component.searchParam.trim());
    });

    // it('call downloadExcel', () => {
    //     const proposal = {
    //         buyingProgram: "EA 3.0",
    //         ciscoLed: false,
    //         crAt: "2022-04-02T19:30:57.065+0000",
    //         crBy: "test",
    //         currencyCode: "USD",
    //         dealId: "12345",
    //         showDropdown: true, 
    //         id: 123456
    //     };
    //     component.downloadExcel(proposal);
    //     expect(proposal.showDropdown).toBeFalsy();
    // });

    it('call editProposalName', () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456,
            name: 'Test',
            editName: false
        };
        component.editProposalName(proposal);
        expect(component.proposalName).toEqual(proposal.name);
        expect(proposal.showDropdown).toBeFalsy();
        expect(proposal.editName).toBeTruthy();
    });

    it('call cancelNameChange', () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456,
            editName: true
        };
        component.cancelNameChange(proposal);
        expect(proposal.editName).toBeFalsy();
        expect(component.proposalName).toEqual('');
    });

    it("openQuoteUrl()", () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456,
            editName: true
        };
        console.log("Running test case: openQuoteUrl()");
        expect(component.openQuoteUrl(proposal)).toBeUndefined();
      });

      it("call saveupdated name with data", () => {
        const proposal = {
            buyingProgram: "EA 3.0",
            ciscoLed: false,
            crAt: "2022-04-02T19:30:57.065+0000",
            crBy: "test",
            currencyCode: "USD",
            dealId: "12345",
            showDropdown: true, 
            id: 123456,
            editName: true,
            name: ''
        };
        const apiSpy = jest.spyOn(eaRestService, 'putApiCall');
        component.proposalName = '';
        component.saveUpdatedName(proposal);
        expect(proposal.editName).toBeTruthy();

        component.proposalName = 'Test';
        component.saveUpdatedName(proposal);
        expect(apiSpy).toHaveBeenCalled();
        expect(proposal.name).toEqual(component.proposalName);
        expect(proposal.editName).toBeFalsy();
      });
})