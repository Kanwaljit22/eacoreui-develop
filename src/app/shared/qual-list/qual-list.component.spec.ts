import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QualListComponent } from './qual-list.component';
import { LocaleService } from '../services/locale.service';
import { ConstantsService } from '../services/constants.service';
import { DashboardService } from '@app/dashboard/dashboard.service';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { MessageService } from '../services/message.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { QualificationsService } from '@app/qualifications/qualifications.service';
import { AppDataService } from '../services/app.data.service';
import { PermissionService } from '@app/permission.service';
import { UtilitiesService } from '../services/utilities.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRestService } from '../services/app.rest.service';
import { CurrencyPipe } from '@angular/common';
import { BlockUiService } from '../services/block.ui.service';
import { CopyLinkService } from '../copy-link/copy-link.service';
import { ProposalDataService } from '@app/proposal/proposal.data.service';
import { ProposalPollerService } from '../services/proposal-poller.service';
import { SearchPipe } from '../pipes/search.pipe';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteQualificationComponent } from '@app/modal/delete-qualification/delete-qualification.component';
import { EditQualificationComponent } from '@app/modal/edit-qualification/edit-qualification.component';
import { EditQualificationService } from '@app/modal/edit-qualification/edit-qualification.service';
import { CreateProposalService } from '@app/proposal/create-proposal/create-proposal.service';
import { TcoDataService } from '@app/tco/tco.data.service';
import { ManageTeamMembersComponent } from '@app/modal/manage-team-members/manage-team-members.component';
import { WhoInvolvedService } from '@app/qualifications/edit-qualifications/who-involved/who-involved.service';
import { HttpCancelService } from '../services/http.cancel.service';
import { ManageTeamMembersPipe } from '../pipes/manage-team-members.pipe';
import { ChangeDealIdComponent } from '@app/modal/change-deal-id/change-deal-id.component';
import { ProductSummaryService } from '@app/dashboard/product-summary/product-summary.service';
import { FiltersService } from '@app/dashboard/filters/filters.service';
import { GridOptions } from '@ag-grid-community/core';
import { EaService } from 'ea/ea.service';
import { EaRestService } from 'ea/ea-rest.service';

describe('QualListComponent', () => {
  let component: QualListComponent;
  let fixture: ComponentFixture<QualListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QualListComponent , SearchPipe, ManageTeamMembersPipe, ManageTeamMembersComponent],
      providers: [LocaleService,ConstantsService,EaService,EaRestService,
        DashboardService, Renderer2,MessageService,NgbModal,QualificationsService, AppDataService, PermissionService, UtilitiesService, AppRestService, CurrencyPipe, BlockUiService, CopyLinkService, ProposalDataService, ProposalPollerService, SearchPipe, EditQualificationService, CreateProposalService, TcoDataService, WhoInvolvedService , HttpCancelService, ManageTeamMembersPipe, ProductSummaryService, FiltersService],
      imports: [HttpClientModule,  RouterTestingModule.withRoutes([
        { path: "qualifications", redirectTo: "" }])],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualListComponent);
    component = fixture.componentInstance;
    component.qualData = {
      data: [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }, {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }],
      isCreatedByMe: true,
      isProposalOnDashboard: false,
      isProposalInsideQualification: false,
      isToggleVisible:false,
      editIcon:false
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call ngoninit', () => {
    component.qualData = {
      data: [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }, {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }],
      isCreatedByMe: true,
      isProposalOnDashboard: false,
      isProposalInsideQualification: false,
      isToggleVisible:true,
      editIcon:false
    }
    let appdataService = fixture.debugElement.injector.get(AppDataService);
    appdataService.isPatnerLedFlow = false;
    appdataService.pageContext = 'UserQualifications'
    appdataService.userInfo = {
      firstName: 'test',
      lastName: 'test',
      roSuperUser: false
    }
    
    appdataService.userDashboardFLow = 'userFlow'
    component.ngOnInit()
    expect(appdataService.showEngageCPS).toBe(false);
  });

  it('call viewProposal', () => { 
    let val = {
      showProposal: false,
      qualName:'test',
      id: '123324'
    }
    let i = 1;
    let data = {
      "data": [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }

      ]
    }
    let dashboardService = fixture.debugElement.injector.get(DashboardService);
    jest.spyOn(dashboardService, 'getViewProposalForQual').mockReturnValue(of(data))
    component.viewProposal(val,i)
    expect(val.showProposal).toBe(true)

    val = {
      showProposal: true,
      qualName:'test',
      id: '123324'
    }
     i = 1;
     component.viewProposal(val,i)
     expect(val.showProposal).toBe(false)
  });

  
  it('call viewQualSummary', () => { 
    let qualObject = {
      qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
    }
    let val: Promise<true>;
    let qualService = fixture.debugElement.injector.get(QualificationsService);
    jest.spyOn(qualService["router"], 'navigate').mockReturnValue(val);
   component.viewQualSummary(qualObject);
   expect(qualService.toProposalSummary).toBe(false)
  })

  it('call disableDelete', () => { 
    let qualObject = {
      qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
    }
   const value =  component.disableDelete(qualObject);
   component.disableDelete(qualObject);
   expect(value).toBe(true)
   
  let qual = {
    qualName:'test',
      qualId: '123324',
      am: 'test',
      status: 'Inprogress',
      customerName: 'Google',
      dealId:'123',
      salesTeam: 'mariar',
      partnerTeam: 'mariar',
      partnerDeal: false,
      permissions: {
      featureAccess: [{
        name: 'qualification.edit.name'
      }]
    }
  }
  const val =  component.disableDelete(qual);
  component.disableDelete(qualObject);
  expect(val).toBe(true)
  })

  it('call disableClone', () => { 
    let qualService = fixture.debugElement.injector.get(QualificationsService);
    qualService.twoTUserUsingDistiDeal = true;
    const value =  component.disableClone();
   component.disableClone();
   expect(value).toBe(true)
   
  })

  it('call disableChangeDeal', () => { 
    let qualObject = {
      qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true
    }
    const value =  component.disableChangeDeal(qualObject);
    component.disableChangeDeal(qualObject);
   expect(value).toBe(true)
   
  })

  it('call disableManageTeam', () => { 
    let qualObject = {
      qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true
    }
    const value =  component.disableManageTeam(qualObject);
    component.disableManageTeam(qualObject);
   expect(value).toBe(true)
   
   let qual = {
    qualName:'test',
      qualId: '123324',
      am: 'test',
      status: 'Inprogress',
      customerName: 'Google',
      dealId:'123',
      salesTeam: 'mariar',
      partnerTeam: 'mariar',
      partnerDeal: false,
      permissions: {
      featureAccess: [{
        name: 'qualification.edit.name'
      }]
    }
  }
  const val =  component.disableDelete(qual);
  component.disableManageTeam(qualObject);
  expect(val).toBe(true)
  })

  it('call disableEditIcon', () => { 
    let qualObject = {
      qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true
    }
    const value =  component.disableEditIcon(qualObject);
    component.disableEditIcon(qualObject);
   expect(value).toBe(true)
   
  })
  
  xit('call deleteQual', () => { 
    let qualObject = {
      qualName:'test',
      qualId: '123324',
      am: 'test',
      status: 'Inprogress',
      customerName: 'Google',
      dealId:'123',
      salesTeam: 'mariar',
      partnerTeam: 'mariar',
      partnerDeal: false
    }
    let index = 1
  let  modalService = TestBed.get(NgbModal);
  let modalRef = modalService.open(DeleteQualificationComponent);
  jest.spyOn(modalService, "open").mockReturnValue(modalRef);
  modalRef.result =  new Promise((resolve) => resolve({continue: true
      }));
  let res = {
  }
  let qualService = fixture.debugElement.injector.get(QualificationsService);
  jest.spyOn(qualService, 'deleteQual').mockReturnValue(of(res))
  component.deleteQual(qualObject, index);
   
  })

  it('call getList', () => { 
    let event: {

    }
    let res = {
      "data": [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true
       }
      ],
      "error": false,
      "isCreatedByMe": true,
      "isProposalOnDashboard": false,
      "isProposalInsideQualification": false,
      "isToggleVisible":false,
      "editIcon":false
    }
    let appdataService = fixture.debugElement.injector.get(AppDataService);
    appdataService.userDashboardFLow = 'user'
    let qualService = fixture.debugElement.injector.get(QualificationsService);
   const spyList = jest.spyOn(qualService, 'listQualification').mockReturnValue(of(res))
    component.getList(event);
    expect(spyList).toHaveBeenCalled()

    appdataService.userDashboardFLow = 'userFlow'
    jest.spyOn(qualService, 'qualsSharedWithMe').mockReturnValue(of(res))
    component.getList(event);
    expect(component.qualData.isCreatedByMe).toBe(false)

    event = {
      "value":"test"
    }
    res = {
      "data": [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true
       }
      ],
      "error": false,
      "isCreatedByMe": true,
      "isProposalOnDashboard": false,
      "isProposalInsideQualification": false,
      "isToggleVisible":false,
      "editIcon":false
    }
    appdataService.userDashboardFLow = 'userFlow'
    jest.spyOn(qualService, 'getQualListForDashboard').mockReturnValue(of(res))
    component.getList(event);
    expect(component.qualData.isCreatedByMe).toBe(true)
  })

  it('call getList', () => { 
    let response = {
          "error": false,
          "isCreatedByMe": true,
          "isProposalOnDashboard": false,
          "isProposalInsideQualification": false,
          "isToggleVisible":false,
          "editIcon":false
        }
       component.rowData =  [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true
       }
      ]
      let event = {
      }
      let appdataService = fixture.debugElement.injector.get(AppDataService);
        appdataService.userDashboardFLow = 'user'
      let qualService = fixture.debugElement.injector.get(QualificationsService);
      const spy =  jest.spyOn(qualService, 'listQualification').mockReturnValue(of(response))
        component.getList(event);
        expect(spy).toHaveBeenCalled()
    })
    
    it('call editQualName', () => { 
      let qualObj = {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        name: "test1",
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true,
        permissions: {
          featureAccess: [{
            name: 'qualification.edit.name'
          }]
        }
       }
       let index = 1;
       let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        windowClass: 'lg vnext-manage-team',
        backdropClass: 'modal-backdrop-vNext'
      };
      component.rowData =  [{
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true
       }
      ]
    let  modalService = TestBed.get(NgbModal);
    let modalRef = modalService.open(EditQualificationComponent, ngbModalOptions);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve, reject) => resolve({updatedQualName: 'test', updatedQualDesc: "description"
        }));
    let qualService = fixture.debugElement.injector.get(QualificationsService);   
    component.editQualName(qualObj, index)
    expect(qualService.qualification.name).toBe('test1')

    })
    
    it('call openManageModal', () => { 
      let qualObj = {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        name: "test1",
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false,
        changeSubscriptionDeal: true,
        isCreatedByMe: true
       }
      let  modalService = TestBed.get(NgbModal);
      let modalRef = modalService.open(ManageTeamMembersComponent);
      jest.spyOn(modalService, "open").mockReturnValue(modalRef);
      modalRef.result =  new Promise((resolve, reject) => resolve({ciscoTeam: ['test', 'test1']
          })); 
      let res = {
        data : {
          qualName: 'test',
          name: 'test',
          id: '123',
          extendedSalesTeam: ['test'],
          cxTeams: ['test'],
          cxDealAssurerTeams : ['test'],
          distributorTeam: ['test'],
         softwareSalesSpecialist: ['test'],
         partnerTeam: ['test'],
         createdBy: 'user',
         partnerDeal: false,
         dealId : '1234',
         buyMethodDisti: false,
         deal: {
          accountManager: { 'firstName': 'test', 'lastName': 'test', 'emailId': 'test@test.com', 'userId': 'test' }
         },        
         cam: { 'firstName': 'test', 'lastName': 'test',
         'camEmail': 'test@test.com',
         'beGeoId': 0,
         'cecId': 'test',
         'role': 'test'}
        }
      }    
      let qualService = fixture.debugElement.injector.get(QualificationsService); 
      jest.spyOn(qualService, 'getCustomerInfo').mockReturnValue(of(res))
      component.openManageModal(qualObj)
      expect(qualService.qualification.name).toEqual('test')
    })

  it('call toggleView', () => { 
    component.displayGridView = false;
    component.toggleView();
    expect(component.displayGridView).toBe(true)
  })

  it('call getTableColumnsData', () => { 
    let res = 
      [
        {
            "headerName": "Qualifications",
            "field": "qualName",
            "width": 350,
            "minWidth": 60,
            "pinned": true,
            "suppressMenu": true,
            "suppressSorting": true
        },  
        {
            "headerName": "Qualfication Id",
            "field": "qualId",
            "hide":true,
            "width": 220,
            "minWidth": 60,
            "pinned": true,
            "suppressMenu": true,
            "suppressSorting": true
        },  
        {
            "headerName": "Account Manager",
            "field": "am",
            "width": 150,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        },
        {
            "headerName": "Status",
            "field": "status",
            "width": 100,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true,
            "cellClass" : "grid-status"
        },
        {
            "headerName": "Customer Name",
            "field": "customerName",
            "width": 200,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        },
        {
            "headerName": "Deal ID",
            "field": "dealId",
            "width": 100,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        },
        {
            "headerName": "Cisco Team",
            "field": "salesTeam",
            "width": 400,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        },
        {
            "headerName": "Partner Team",
            "field": "partnerTeam",
            "width": 400,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        },
        {
            "headerName": "Deal Type",
            "field": "partnerDeal",
            "width": 100,
            "minWidth": 60,
            "suppressMenu": true,
            "suppressSorting": true
        }
    ]
    let qualService = fixture.debugElement.injector.get(QualificationsService); 
    jest.spyOn(qualService, 'getColumnsData').mockReturnValue(of(res))
    component.getTableColumnsData();
    expect(component.columnDefs).toEqual(res)
  })
  
  it('call getDealType', () => { 
    let params = {
      value: 'test'
    };
    let val = component.getDealType(params);
    component.getDealType(params);
    expect(val).toBe('Partner Led')
  })

   
  it('call getQualName', () => { 
    let params = {
      data: {
        qualName:'test',
          qualId: '123324',
          am: 'test',
          status: 'Inprogress',
          customerName: 'Google',
          dealId:'123',
          salesTeam: 'mariar',
          partnerTeam: 'mariar',
          partnerDeal: false,
          permissions: {
          featureAccess: [{
            name: 'qualification.edit.name'
          }]
        }
      }
    };
    component.getQualName(params)

  let params1 = {
      data: {
        qualName:'test',
          qualId: '123324',
          am: 'test',
          status: 'Inprogress',
          customerName: 'Google',
          dealId:'123',
          salesTeam: 'mariar',
          partnerTeam: 'mariar',
          partnerDeal: false
      }
    }
    component.getQualName(params1)
  })

  it('call onCellClicked', () => { 
    let evnt = {
      event: {
        target: {
          classList:{
            value: 'deleteQualification'
          }
        }
      },
      data: {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      },
      rowIndex: 2
    }
   const spydeleteQual =  jest.spyOn(component, 'deleteQual')
    component.onCellClicked(evnt);
   expect(spydeleteQual).toHaveBeenCalled();

    evnt = {
      event: {
        target: {
          classList:{
            value: 'manageTeamQual'
          }
        }
      },
      data: {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      },
      rowIndex: 2
    }
    let res = {}
    let qualService = fixture.debugElement.injector.get(QualificationsService); 
    jest.spyOn(qualService, 'getCustomerInfo').mockReturnValue(of(res))
    component.onCellClicked(evnt);
  })

  it('call getStatusStyle', () => { 
    let params = {
      value: 'In Progress'
    };
    const val = component.getStatusStyle(params);
    component.getStatusStyle(params);
    expect(val).toBe('<span style="color:#f49138">In Progress</span>')

    params = {
      value: 'Complete'
    };
    const val1 = component.getStatusStyle(params);
    component.getStatusStyle(params);
    expect(val1).toBe('<span style="color:#6cc04a">Complete</span>')
  })

  it('call getCustName', () => { 
    let params = {
      value: 'test'
    };
    const val = component.getCustName(params);
    component.getCustName(params);
    expect(val).toBe('<span style="color:black">test</span>')
  })

  it('call appendId', () => { 
    component.rowData = [
      {
        qualName:'test',
        qualId: '123324',
        am: 'test',
        status: 'Inprogress',
        customerName: 'Google',
        dealId:'123',
        salesTeam: 'mariar',
        partnerTeam: 'mariar',
        partnerDeal: false
      }
    ]
    component.appendId();
  })
  
  it('call cloneQualOrChangeDealId', () => { 
    let evt = '1233';
    let qual = {
      qualName:'test',
      qualId: '123324',
      description: 'test',
      am: 'test',
      status: 'Inprogress',
      customerName: 'Google',
      dealId:'123',
      salesTeam: 'mariar',
      partnerTeam: 'mariar',
      partnerDeal: false
    }
    let  modalService = TestBed.get(NgbModal);
    let modalRef = modalService.open(ChangeDealIdComponent);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve, reject) => resolve({ciscoTeam: ['test', 'test1']
        }));
    component.cloneQualOrChangeDealId(evt, qual);
  })
  
  it('call onFilterTextBoxChanged', () => { 
    component.searchQual = 'test'
    component.onFilterTextBoxChanged();
  })
  
  

});
