import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DashboardService } from "@app/dashboard/dashboard.service";
import { DealListService } from "@app/dashboard/deal-list/deal-list.service";
import { LinkProposalArchitectureService } from "@app/modal/link-proposal-architecture/link-proposal-architecture.service";
import { PermissionService } from "@app/permission.service";
import { CreateProposalService } from "@app/proposal/create-proposal/create-proposal.service";
import { ListProposalService } from "@app/proposal/list-proposal/list-proposal.service";
import { ProposalDataService } from "@app/proposal/proposal.data.service";
import { QualificationsService } from "@app/qualifications/qualifications.service";
import { TcoDataService } from "@app/tco/tco.data.service";
import { of } from "rxjs";
import { CopyLinkService } from "../copy-link/copy-link.service";
import { SearchPipe } from "../pipes/search.pipe";
import { AppDataService } from "../services/app.data.service";
import { AppRestService } from "../services/app.rest.service";
import { BlockUiService } from "../services/block.ui.service";
import { ConstantsService } from "../services/constants.service";
import { LocaleService } from "../services/locale.service";
import { MessageService } from "../services/message.service";
import { ProposalPollerService } from "../services/proposal-poller.service";
import { UtilitiesService } from "../services/utilities.service";
import { ProposalListComponent } from "./proposal-list.component";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { CreateTcoComponent } from "@app/modal/create-tco/create-tco.component";
import { TcoApiCallService } from "@app/tco/tco-api-call.service";
import { ManageTeamMembersComponent } from "@app/modal/manage-team-members/manage-team-members.component";
import { WhoInvolvedService } from "@app/qualifications/edit-qualifications/who-involved/who-involved.service";
import { HttpCancelService } from "../services/http.cancel.service";
import { ManageTeamMembersPipe } from "../pipes/manage-team-members.pipe";
import { EditQualificationComponent } from "@app/modal/edit-qualification/edit-qualification.component";
import { EditQualificationService } from "@app/modal/edit-qualification/edit-qualification.service";
import { LinkProposalArchitectureComponent } from "@app/modal/link-proposal-architecture/link-proposal-architecture.component";
import { SplitProposalComponent } from "@app/modal/split-proposal/split-proposal.component";
import { DeleteProposalComponent } from "@app/modal/delete-proposal/delete-proposal.component";
import { EaService } from "ea/ea.service";
import { EaRestService } from "ea/ea-rest.service";
import { PermissionEnum } from "@app/permissions";
export interface QualProposalListObj {
  data: any;
  isCreatedByMe?: boolean;
  isProposalOnDashboard?: boolean;
  isProposalInsideQualification?: boolean;
  isToggleVisible?: boolean;
  editIcon?: boolean;
}

describe("ProposalListComponent", () => {
  let component: ProposalListComponent;
  let fixture: ComponentFixture<ProposalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalListComponent, SearchPipe,ManageTeamMembersPipe],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: "ea/project/:projectObjId", redirectTo: "" },
        { path: "qualifications/proposal/:proposalId/:screenName", redirectTo: ""},
        { path: "qualifications/proposal/:proposalId/tco/tcoList", redirectTo: "" },
      ])],
      providers: [
        EditQualificationService,
        LocaleService,
        EaService,
        EaRestService,
        HttpCancelService,
        TcoApiCallService,
        WhoInvolvedService,
        ConstantsService,
        PermissionService,
        DashboardService,
        MessageService,
        ListProposalService,
        UtilitiesService,
        AppDataService,
        BlockUiService,
        TcoDataService,
        QualificationsService,
        ProposalDataService,
        ConstantsService,
        CopyLinkService,
        LinkProposalArchitectureService,
        AppRestService,
        CreateProposalService,
        CurrencyPipe,
        ProposalPollerService,
        DealListService,
        SearchPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalListComponent);
    component = fixture.componentInstance;
    component.searchFilter = "";
    component.proposalData = {
      data: "",
      isCreatedByMe: true,
      isProposalOnDashboard: true,
      isProposalInsideQualification: true,
      isToggleVisible: true,
      editIcon: true,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("changedData should be blank initially", () => {
    expect(component.changedData).toEqual([]);
  });
  it("searchProposal should be blank initially", () => {
    expect(component.searchProposal).toEqual("");
  });
  it("proposalListOnQual should be false initially", () => {

    expect(component.proposalListOnQual).toBe(false)
  });

  // it("onGridReady()", () => {
  //   console.log("Running test case: onGridReady()");
  //   component.onGridReady({});
  //   expect(component.dataNotLoaded).toBeTruthy();
  // });

  it("getproposalType()", () => {
    let params = {
      data: {
        hasLinkedProposal: false,
      },
    };
    expect(component.getproposalType(params)).toContain(
      '  <span class="single-arch"><span class="icon-single-arch"></span><span>Single Architecture</span></span>'
    );

    params = {
      data: {
        hasLinkedProposal: true,
      },
    };
    expect(component.getproposalType(params)).toEqual(
      '  <span class="single-arch"><span class="icon-cross-arch"></span> Cross Architecture</span>'
    );
  });

  it("getCountryLongname()", () => {
    let params = { value: "" };
    expect(component.getCountryLongname(params)).toBe(undefined);
    params = { value: "US" };
    expect(component.getCountryLongname(params)).toEqual("United States");
    params = { value: "India" };
    expect(component.getCountryLongname(params)).toEqual("India");
  });

  it("getQuickFilter()", () => {
    expect(component.getQuickFilter()).toEqual("");
  });

  it("getStatusTyle()", () => {
    let params = { value: "Complete" };
    expect(component.getStatusTyle(params)).toEqual(
      `<span style='color:#88cb6c'>${params.value}</span>`
    );

    params = { value: "InComplete" };
    expect(component.getStatusTyle(params)).toEqual(
      `<span style='color:#f49c56'>${params.value}</span>`
    );
  });

  it("proposalName()", () => {
    let params: any = {
      value: "This is test tooltip",
      data: {
        crossProposal: true,
        permissions: {
          featureAccess: [
            { name: "proposal.create" },
            { name: "proposal.edit_name" },
          ],
        },
      },
    };
    component.proposalName(params);
    params = {
      value: "This is test tooltip",
      data: {
        crossProposal: true,
        permissions: {
          featureAccess: [
            { name: "proposal.create" },
            { name: "proposal.duplicate" },
            { name: "proposal.delete" },
            { name: "qualification.manage_team" },
          ],
        },
      },
    };
    component.proposalName(params);

    //expect(component.proposalName(params) ).toEqual('');
  });

  it("disableManageteam()", () => {
    let params: any = { value: "This is test tooltip" };
    expect(component.disableManageteam(params)).toBeTruthy();
  });
  it("disableEditIcon()", () => {
    let params: any = { value: "This is test tooltip" };
    expect(component.disableEditIcon(params)).toBeTruthy();
  });
  it("disableLinkDelink()", () => {
    let params: any = { value: "This is test tooltip" };
    expect(component.disableLinkDelink(params)).toBeTruthy();

    // params={value:'This is test tooltip',data:{permissions:{
    //   featureAccess:[{name:'proposal.create'},{name:'proposal.link_delink'}]}}}

    //  expect(component.disableLinkDelink(params) ).toBeFalsy();
  });

  it("should render `ngOnChanges()`", () => {
    component.proposalData;
    component.columnDefs = [
      { field: "id" },
      { field: "name" },
      { field: "status" },
      { field: "approverTeamDetails" },
      { field: "exceptionRequested" },
      { field: "elapsedTime" },
      { field: "submittedBy" },
    ];
    //directly call ngOnChanges
    component.ngOnChanges({
      changedData: new SimpleChange(null, component.proposalData.data, null),
    });
    expect(component.proposalData.data).toEqual("");
  });

  it("exceptionElapsedTime()", () => {
    let params: any = { value: "This is test tooltip" };
    expect(component.disableEditIcon(params)).toBeTruthy();
  });

  it("should call getCurrencyFormat", () => {
    const params = {
      data: {
        currencyCode: 'USD'
      },
      value: 10
    };
    const returnValue = component.getCurrencyFormat(params)
    expect(returnValue).toEqual('USD 10')
  });

  it("should call getCurrencyFormat no value", () => {
    const params = {
      data: {
        currencyCode: 'USD'
      },
      value: 0
    };
    const returnValue = component.getCurrencyFormat(params)
    expect(returnValue).toEqual('USD 0')
  });

  it("should call getSubmittedByName no param data", () => {
    const params = {
      
    };
    const returnValue = component.getSubmittedByName(params)
    expect(returnValue).toEqual(undefined)
  });
  it("should call getSubmittedByName ", () => {
    const params = {
      data:{
        proposalExceptionDetails: [{createdBy:'testUser'}]
      }
    };
    const returnValue = component.getSubmittedByName(params)
    expect(returnValue).toEqual('testUser')
  });

  it("should call proposalId ", () => {
    const params = {
      value: '123'
    };
    const returnValue = component.proposalId(params)
    expect(returnValue).toEqual('<span class="clickProposal" ><span class="text-link custom-tooltip-wrap ellipsis pr-2">'  + '123'   + '</span> </span>')
  });

  it("should call displayApproverTeamName ", () => {
    const proposal = {
      selectedApproverTeamName: '',
      approverTeamDetails:[{approverTeamName:'testTeam',exceptionStatus:'Pending'},{approverTeamName:'testTeam1',exceptionStatus:'Not Pending'}]
    };
    component.displayApproverTeamName(proposal)
    expect(proposal.selectedApproverTeamName).toEqual(proposal.approverTeamDetails[0].approverTeamName)
  });

  it("should call checkProposalStatus  status :Complete", () => {
    const proposal = {
      status: 'Complete',
      selectedApproverTeamName: '',
      approverTeamDetails:[{approverTeamName:'testTeam',exceptionStatus:'Pending'},{approverTeamName:'testTeam1',exceptionStatus:'Not Pending'}]
    };
    const returnValue = component.checkProposalStatus(proposal)
    expect(returnValue).toBe(false)
  });

  it("should call checkProposalStatus  status : not Complete", () => {
    const proposal = {
      status: 'Pending',
      selectedApproverTeamName: '',
      approverTeamDetails:[{approverTeamName:'testTeam',exceptionStatus:'Pending'},{approverTeamName:'testTeam1',exceptionStatus:'Not Pending'}]
    };
    const returnValue = component.checkProposalStatus(proposal)
    expect(returnValue).toBe(true)
  });

  it("should call approverTeamDropOutside", () => {
    const event = {}
    const val = {showApproverTeamDropdown: true}
    component.approverTeamDropOutside(event,val)
    expect(val.showApproverTeamDropdown).toBe(false)
  });

  it("should call rampDropOutside", () => {
    const event = {}
    const val = {showRampDrop: true}
    component.rampDropOutside(event,val)
    expect(val.showRampDrop).toBe(false)
  });

  it("should call getLinkedProposalData with data", () => {
    const proposal = {id:'123',groupId:'333',clickCross:false}
    const response ={
      data: {
        matching: [{architecture:'DNA'},{architecture:'DC'}]
      }
    }
    let linkProposalArchitectureService = fixture.debugElement.injector.get(LinkProposalArchitectureService);
    jest.spyOn(linkProposalArchitectureService, "getLinkedProposalData").mockReturnValue(of(response));
    component.getLinkedProposalData(proposal)
    expect(proposal.clickCross).toBe(true)
  });

  it("should call getLinkedProposalData with no data", () => {
    const proposal = {id:'123',groupId:'333',clickCross:false}
    const response ={
     
    }
    let linkProposalArchitectureService = fixture.debugElement.injector.get(LinkProposalArchitectureService);
    jest.spyOn(linkProposalArchitectureService, "getLinkedProposalData").mockReturnValue(of(response));
    component.getLinkedProposalData(proposal)
    expect(proposal.clickCross).toBe(true)
  });

  it("should call openLinkProposalModal messages", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(LinkProposalArchitectureComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const response = {messages:[{}]}
    const res = {messages:[{}]}

    let linkProposalArchitectureService = fixture.debugElement.injector.get(LinkProposalArchitectureService);
    jest.spyOn(linkProposalArchitectureService, "linkDelinkProposal").mockReturnValue(of(response));

    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(res));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openLinkProposalModal(proposal, true)

    expect(component.proposalDataService.proposalDataObject.proposalId).toEqual(proposal.id)
  });

  it("should call openLinkProposalModal ", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(LinkProposalArchitectureComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const response = {messages:[{}]}
    const res = {data:[{elapsedTime:'test Hour'}]}

    let linkProposalArchitectureService = fixture.debugElement.injector.get(LinkProposalArchitectureService);
    jest.spyOn(linkProposalArchitectureService, "linkDelinkProposal").mockReturnValue(of(response));

    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(res));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    component.openLinkProposalModal(proposal, true)

    expect(component.proposalDataService.proposalDataObject.proposalId).toEqual(proposal.id)
  });

  it("should call previewQuote", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}

    component.previewQuote(proposal)
    expect(component.proposalDataService.proposalDataObject.proposalData).toEqual(proposal)
  });

  it("should call groupDocumentCenter", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}

    component.groupDocumentCenter(proposal)
    expect(component.proposalDataService.proposalDataObject.proposalData).toEqual(proposal)
  });

  it("should call updateSessionData", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}
    const screenName = ''
  //  component.appDataService.userDashboardFLow = 'test'
    component.updateSessionData(proposal,screenName)
    expect(component.proposalDataService.proposalDataObject.proposalData).toEqual(proposal)
  });
  it("should call updateSessionData with userDashboardFLow", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}
    const screenName = ''
    component.appDataService.userDashboardFLow = 'test'
    component.updateSessionData(proposal,screenName)
    expect(component.proposalDataService.proposalDataObject.proposalData).toEqual(proposal)
  });

  it("should call goToTCOList", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}

    component.goToTCOList(proposal)
    expect(component.proposalDataService.proposalDataObject.proposalData).toEqual(proposal)
  });

  it("should call toggleView", () => {
    component.toggleView()
    expect(component.hideProposalGrid).toBe(true)
  });

  it("should call generateQuote", () => {
    const proposal = {name: test,id:'123',groupId:'333',clickCross:false}
    component.generateQuote(proposal)
    expect(component.appDataService.subHeaderData.moduleName).toBe('')
  });
  it("should call generateQuote with hasLinkedProposal", () => {
    const proposal = {hasLinkedProposal: true,name: test,id:'123',groupId:'333',clickCross:false}
    component.generateQuote(proposal)
    expect(component.appDataService.subHeaderData.moduleName).toBe('')
  });

  it("should call documentCenter hasLinkedProposal:true", () => {
    const proposal = {hasLinkedProposal: true,name: test,id:'123',groupId:'333',clickCross:false}
    component.documentCenter(proposal)
    expect(component.appDataService.subHeaderData.moduleName).toBe('')
  });

  it("should call documentCenter hasLinkedProposal:false", () => {
    const proposal = {hasLinkedProposal: false,name: test,id:'123',groupId:'333',clickCross:false}
    component.documentCenter(proposal)
    expect(component.appDataService.subHeaderData.moduleName).toBe('')
  });
  it("should call salesReadiness", () => {
    const proposal = {hasLinkedProposal: false,name: test,id:'123',groupId:'333',clickCross:false}
    component.salesReadiness(proposal)
    expect(component.appDataService.subHeaderData.moduleName).toBe('')
  });

  // it("should call editProposalName", () => {
  //   const proposal = {hasLinkedProposal: false,name: test,id:'123',groupId:'333',clickCross:false}
  //   const viewAuthorizationComponent = jest.spyOn(component['modalVar'], 'open');
  //   component.editProposalName(proposal)
  //   expect(component.proposalDataService.proposalDataObject.proposalId).toEqual(proposal.id)
  // });

  it("should call onGridReady", () => {
    const proposal = {hasLinkedProposal: false,name: test,id:'123',groupId:'333',clickCross:false}
    component.onGridReady(proposal)
    expect(component.dataNotLoaded).toBe(true)
  });

  it("should call getTableColumnsData", () => {
    const response = [
      {
          "headerName": "Proposals",
          "colId": "name",
          "field": "name",
          "width": 290,
          "minWidth": 60,
          "pinned": "left",
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },      
      {
          "headerName": "Architecture",
          "colId": "architecture",
          "field": "architecture",
          "width": 215,
          "filter" : false,
          "minWidth": 60,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Proposal Id",
          "colId": "id",
          "field": "id",        
          "width": 100,
          "filter" : false,
          "minWidth": 60,
          "suppressMenu": true,
          "suppressSorting": true
      }, 
      {
          "headerName": "Proposal Type",
          "colId": "proposalType",
          "field": "proposalType",
          "width": 180,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Status",
          "colId": "status",
          "field": "status",
          "width": 175,
          "minWidth": 60,
          "filter" : "agSetColumnFilter",
          "suppressMenu": true,
          "suppressSorting": true,
          "cellClass" : "grid-status"
      },
      {
          "headerName": "Submitted By",
          "colId": "submittedBy",
          "field": "submittedBy",
          "width": 120,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true,
          "cellClass" : "custom-appr-cell"
      },
      {
          "headerName": "Reviewer Team(s)",
          "colId": "approverTeamDetails",
          "field": "approverTeamDetails",
          "width": 190,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true,
          "cellClass" : "custom-appr-cell"
      },
      {
          "headerName": "Exception Requested",
          "colId": "exceptionRequested",
          "field": "exceptionRequested",
          "width": 190,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true,
          "cellClass" : "custom-appr-cell"
      },
      {
          "headerName": "Elapsed Time",
          "colId": "elapsedTime",
          "field": "elapsedTime",
          "width": 110,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Customer Name",
          "colId": "customerName",
          "field": "customerName",
          "width": 190,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Deal Id",
          "colId": "dealId",
          "field": "dealId",
          "width": 100,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      }, 
      {
          "headerName": "Qualification Name",
          "colId": "qualificationName",
          "field": "qualificationName",
          "width": 180,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },  
      {
          "headerName": "Suites",
          "colId": "suites",
          "field": "suites",
          "width": 180,
          "filter" : false,
          "minWidth": 60,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Billing Model Term",
          "colId": "billingModel",
          "field": "billingModel",
          "width": 150,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Country/Region of Transaction",
          "colId": "countryOfTransaction",
          "field": "countryOfTransaction",
          "width": 150,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "Requested Start Date",
          "colId": "eaStartDateDdMmmYyyyStr",
          "field": "eaStartDateDdMmmYyyyStr",
          "width": 140,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      },
      {
          "headerName": "EA Total Value",
          "colId": "totalNetPrice",
          "field": "totalNetPrice",
          "width": 150,
          "minWidth": 60,
          "filter" : false,
          "suppressMenu": true,
          "suppressSorting": true
      }
  ]
    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "getColumnsData").mockReturnValue(of(response));
    component.getTableColumnsData()
    expect(component.dataNotLoaded).toBe(false)
  });

  it("should call onCellClicked", () => {
    const documentCenter = jest.spyOn(component, 'documentCenter')  
    const event = {data:{id:''},colDef:{field:''},event: {target:{classList:{value:'documentCenter'}}}}
    component.onCellClicked(event)
    expect(documentCenter).toHaveBeenCalled()
  });

  it("should call initiateTCOModel", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(CreateTcoComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({tcoCreated: true
    }));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    const event = {id:'123',colDef:{field:''},event: {target:{classList:{value:'documentCenter'}}}}
    component.initiateTCOModel(event)
    expect(open).toHaveBeenCalled();
  });

  it("should call editProposalName", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(EditQualificationComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({updatedProposalName: 'est',updatedProposalDesc:'test'
    }));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    const event = {id:'123',colDef:{field:''},event: {target:{classList:{value:'documentCenter'}}}}
    component.editProposalName(event)
    expect(open).toHaveBeenCalled();
  });

  it("should call openSplitModal", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(SplitProposalComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const res = {messages:[{}]}

    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "splitProposal").mockReturnValue(of(res));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    const event = {id:'123',colDef:{field:''},permissions:{featureAccess:[{}]},event: {target:{classList:{value:'documentCenter'}}}}
    component.openSplitModal(event)
    expect(open).toHaveBeenCalled();
  });

  it("should call copyProposal", () => {
    const event = {elapsedTime:'test Hour', id:123,}
    const res = {
      messages: [{}],

    }
    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "copyProposal").mockReturnValue(of(res));

    const response = {
      data:[{elapsedTime:'test Hour'}]
    }
    const open = jest.spyOn(component, "getTableColumnsData")
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(response));
    component.copyProposal(event)
    expect(open).toHaveBeenCalled();
  });

  it("should call deleteProposal", () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(DeleteProposalComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const res = {
      messages: [{}],

    }
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "deleteProposal").mockReturnValue(of(res));

    const response = {
      data:[{elapsedTime:'test Hour'}]
    }
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(response));
    component.deleteProposal('123')
    expect(component.proposalDataService.proposalDataObject.proposalId).toEqual('123');
  });

  it("should call goToProposalSummary", () => {
    const proposalData = {id:'123'}
    component.goToProposalSummary(proposalData)
    expect(component.appDataService.isGroupSelected).toBe(false)
  });
  it("should call openManageModal", () => {
    const proposalData = {id:'123'}
    component.openManageModal(proposalData)
    expect(component.appDataService.isGroupSelected).toBe(false)
  });
  it("should call goToProposalSummary 1", () => {
    const proposalData = {id:'123',hasMultipleOffer:true,permissions:{featureAccess:{some:function(){},name:PermissionEnum.ProposalEditName}}}
    component.goToProposalSummary(proposalData)
    expect(component.appDataService.isGroupSelected).toBe(false)
  });
  it("should call goToProposalSummary 2", () => {
    const proposalData = {id:'123',status:'In Active'}
    component.goToProposalSummary(proposalData)
    expect(component.appDataService.isGroupSelected).toBe(false)
  });
  it("should call getNodeChildDetails", () => {
    const rowItem = {children:'123',status:'In Active'}
    component.getNodeChildDetails(rowItem)
    expect(component.appDataService.isGroupSelected).toBe(false)
  });
  it("should call deleteProposal error true", () => {

    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'infoDealID'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(DeleteProposalComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const res = {
      messages: [{}],

    }
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "deleteProposal").mockReturnValue(of(res));

    const response = {
      error:true
    }
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(response));
    component.deleteProposal('123')
    expect(component.proposalDataService.proposalDataObject.proposalId).toEqual('123');
  });

  

  it("should call openSplitModal", () => {
    let ngbModalOptions: NgbModalOptions = {
      windowClass: 'lg vnext-manage-team'
    };
    const modalService = TestBed.get(NgbModal);
    const modalRef = modalService.open(SplitProposalComponent, ngbModalOptions);
    modalRef.result =  new Promise((resolve) => resolve({continue: true
    }));
    const res = {data:{groupId:'123'}}
    const res1 = {data:{groupId:'123',elapsedTime:'test Hour'}}

    let listProposalService = fixture.debugElement.injector.get(ListProposalService);
    jest.spyOn(listProposalService, "splitProposal").mockReturnValue(of(res));
    jest.spyOn(listProposalService, "getProposalList").mockReturnValue(of(res1));
    
    const open = jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    const event = {id:'123',colDef:{field:''},permissions:{featureAccess:[{}]},event: {target:{classList:{value:'documentCenter'}}}}
    component.openSplitModal(event)
    expect(open).toHaveBeenCalled();
  });

});
