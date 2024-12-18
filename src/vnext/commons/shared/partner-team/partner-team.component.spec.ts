import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { EaRestService } from "ea/ea-rest.service";
import { of } from "rxjs";
import { MessageService } from "vnext/commons/message/message.service";
import { BlockUiService } from "vnext/commons/services/block-ui.service";
import { LocalizationService } from "vnext/commons/services/localization.service";
import { UtilitiesService } from "vnext/commons/services/utilities.service";
import { VnextStoreService } from "vnext/commons/services/vnext-store.service";
import { ProjectRestService } from "vnext/project/project-rest.service";
import { ProjectStoreService } from "vnext/project/project-store.service";
import { ProjectService } from "vnext/project/project.service";
import { ProposalStoreService } from "vnext/proposal/proposal-store.service";
import { VnextService } from "vnext/vnext.service";
import { CiscoTeamService } from "../cisco-team/cisco-team.service";
import { LocalizationPipe } from "../pipes/localization.pipe";

import { DisplayTeamComponent } from "./display-team/display-team.component";

import { PartnerTeamComponent } from "./partner-team.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";
import { EaService } from "ea/ea.service";
import { EaStoreService } from "ea/ea-store.service";
import { ElementIdConstantsService } from "vnext/commons/services/element-id-constants.service";

class mockProjectService {
  projectData = {
    objId: "63d2f4288e00c93ef8c5210e",
    dealInfo: {
      id: "66239781",
      partnerDeal: false,
    },
    partnerInfo: {
      beGeoId: 639324,
      beGeoName: "ConvergeOne, Inc.",
    },
    partnerTeam: {
      partnerContacts: [
        {
          firstName: "Maria",
          lastName: "Roark",
          name: "Maria Roark",
          email: "maria.roark@aos5.com",
          userId: "mariar",
          notification: true,
          webexNotification: true,
          notifyByWelcomeKit: true,
          src: "AUTO",
          ccoId: "mariar",
        },
      ],
      distiContacts:[{
        beId: 'test',
        beName: 'test',
        name: 'test'
      }]
    }
  };
}

class MockEaRestService {
  getApiCall() {
    return of({
      data: {
        smartAccounts: [
          {
            smartAccName: "test",
          },
        ],
        hasEa2Entity: false,
      },
    });
  }
  postApiCall() {
    return of({
      data: {

      },
    });
  }
  getApiCallJson(){
    return of({
      data: {

      },
    });
  }
}

let data1 = {
  data: [{
    fullName: 'test'
  }]
}

let data2 = {
  data: [{
    firstName: 'test'
  }]
}
class mockProjectRestService {
 
  searchMember = jest.fn().mockReturnValue(of(data1))
  updateTeamMember =  jest.fn().mockReturnValue(of(data1))
  deleteTeamMember =  jest.fn().mockReturnValue(of(data1))
  addTeamMember =  jest.fn().mockReturnValue(of(data1))
  getProjectDetailsById = jest.fn().mockReturnValue(of(data2))
}


describe("PartnerTeamComponent", () => {
  let component: PartnerTeamComponent;
  let fixture: ComponentFixture<PartnerTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PartnerTeamComponent,
        LocalizationPipe,
        DisplayTeamComponent,
      ],
      providers: [
        { provide: ProjectStoreService, useClass: mockProjectService },
        CiscoTeamService,
        {provide:ProjectRestService, useClass:mockProjectRestService},
        MessageService,
        VnextService,
        BlockUiService,
        ProjectService,
        LocalizationService,
        VnextStoreService,
        UtilitiesService,
        CurrencyPipe,
        { provide: EaRestService, useClass: MockEaRestService },
        ProposalStoreService,
        DataIdConstantsService,
        ElementIdConstantsService
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it("call setMultiplePartnerContactMap", () => {
    component.partnerArr = [{
      firstName: 'test',
      userId: 'test',
      beGeoName: 'test'
    }];
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      objId: 'test',
      dealInfo: {
        partnerDeal: false
      },
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "mariar",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    }
    let eaService = fixture.debugElement.injector.get(EaService);
    eaService.isDistiOpty = false;
    eaService.isResellerOpty = false;
    component.setMultiplePartnerContactMap();
    expect(component.multiplePartnerContactsMap).toHaveLength
  });

  it("call checkAndSetDistiNameFromDetail", () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      referrerQuotes:[{
        distiDetail:{
          beId: '1'
        }
      }],
      partnerTeam: {
        distiContacts:[{
          beId: '1'
        }]
      }
    }
    component.checkAndSetDistiNameFromDetail();
  });

  it("call setMultipleDistiContactMap", () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      referrerQuotes:[{
        distiDetail:{
          beId: '1'
        }
      }],
      partnerTeam: {
        distiContacts:[{
          beId: '1'
        }]
      }
    }
    component.partnerArr = [{
      firstName: 'test',
      userId: 'test',
      beGeoName: 'test'
    }];
    component.distiDetaiForCiscoDealPresent = true;
    const spy = jest.spyOn(component, "checkAndSetDistiNameFromDetail");
    component.setMultipleDistiContactMap();
    expect(spy).toHaveBeenCalled();
  });

  it("call getPartners", () => {
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      objId: 'test',
    }
    let res = {
     data : [{
      firstName: "Maria",
      lastName: "Roark",
      name: "Maria Roark",
      email: "maria.roark@aos5.com",
      userId: "mariar",
      notification: true,
      webexNotification: true,
      notifyByWelcomeKit: true,
      type: 'Partner',
      beGeoId: 'test'
     }]
    }
    component.distiDetaiForCiscoDealPresent = false;
    let restService = fixture.debugElement.injector.get(EaRestService);
    jest.spyOn(restService, 'getApiCall').mockReturnValue(of(res));
    component.getPartners();
    expect(component.partnerArr).toHaveLength;
  }); 

  it("call setDitiDataObj", () => {
    let data = {
      name: 'test',
      beId:123
    }
    component.partnerArr = [{
      firstName: 'test',
      userId: 'test',
      beGeoName: 'test'
    }];
    component.distiDetaiForCiscoDealPresent = false;
    component.setDitiDataObj(data);
  }); 

  it("call resetSearchField", () => { 
    component.selectedPartner = {
      type: 'Partner'
    }
    component.resetSearchField();
    expect(component.searchTeam.userId).toBe('');
  });

  it("call manageSelectAllHeaderCheckbox", () => { 
    component.selectedPartner = {
      type: 'Partner'
    }
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      objId: 'test',
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "mariar",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    }
    component.manageSelectAllHeaderCheckbox();
    expect(component.allWelcomeKitCheck).toBeTruthy();
  });

  it("call expandAll", () => { 
    component.expandAll();
    expect(component.showExpandAll).toBeFalsy();
  });

  it("call collapseAll", () => { 
    component.collapseAll();
    expect(component.showExpandAll).toBeTruthy();
  });

  it("call selectAllCheckbox", () => { 
    const notify = 'webexNotification';
    const selection = 'allWebexCheck';
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "mariar",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    } 
    const spy = jest.spyOn(component, "updateAll");
    component.selectAllCheckbox(notify, selection);
    expect(spy).toHaveBeenCalled();
  });

  it("call updateTeamCheckbox", () => { 
    const teamObj = {
      updatedTeam : {
        userId: 'test',
        notificationType: true
      },
      notificationType: 'webexNotification'
    };
   
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      objId: 'test',
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "mariar",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    }
    let res = {
      data: [{
        beId: 'test',
        beName: 'test',
        name: 'test',
        webexNotification: true,
        notifyByWelcomeKit: true
      }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(res));
    const spy = jest.spyOn(component, "checkIsAddedRemove");
    component.updateTeamCheckbox(teamObj);
    expect(spy).toHaveBeenCalled();
  });

  it("call addTeamMember", () => { 
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      
      objId: '63d2f4288e00c93ef8c5210e',
      partnerTeam: {
        partnerContacts:[{
          beGeoId: 1,
          firstName: 'test',
          userId: 'test',
          beGeoName: 'test'
        }]
      }
      
    }
    component.selectedPartner = {
      beGeoId: 1,
      firstName: 'test',
      userId: 'test',
      beGeoName: 'test',
      type: 'Partner',
      beId: 2
      
    }
    component.searchTeam = {
      userId:'test',webexNotification:true,notifyByWelcomeKit:true, beGeoId : 1
    }
    component.teamMemberFilter = ['Partner'];
   
    const data = {
      data: [ {
       firstName: 'test'
      }]
     }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'addTeamMember').mockReturnValue(of(data));
    const spy = jest.spyOn(component, "setMultiplePartnerContactMap");
    component.addTeamMember()
    expect(spy).toHaveBeenCalled();
  });

  it("call deleteTeamMember", () => { 
    const teamObj = {
      type: 'PARTNER_TEAM',
      teamData : {
        firstName: "Maria",
        lastName: "Roark",
        name: "Maria Roark",
        email: "maria.roark@aos5.com",
        userId: "mariar",
        notification: true,
        webexNotification: true,
        notifyByWelcomeKit: true
      }
    }
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      dealInfo: {
        partnerDeal : true
      },
      objId: 'test',
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "test",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    }
    let res = {
      data: [
        {
          firstName: "Maria",
          lastName: "Roark",
          name: "Maria Roark",
          email: "maria.roark@aos5.com",
          userId: "mariar",
          notification: true,
          webexNotification: true,
          notifyByWelcomeKit: true
        }
      ]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'deleteTeamMember').mockReturnValue(of(res));
    const spy = jest.spyOn(component, "setMultiplePartnerContactMap");
    component.deleteTeamMember(teamObj)
    expect(spy).toHaveBeenCalled();
  });

  it("call selectTeam", () => { 
    let team =  {
        firstName: "Maria",
        lastName: "Roark",
        name: "Maria Roark",
        email: "maria.roark@aos5.com",
        userId: "mariar",
        notification: true,
        webexNotification: true,
        notifyByWelcomeKit: true,
        type: 'Partner',
        beGeoId: 'test'
    }
    component.selectTeam(team)
    expect(component.selectedPartner).toEqual(team)

    team =  {
      firstName: "Maria",
      lastName: "Roark",
      name: "Maria Roark",
      email: "maria.roark@aos5.com",
      userId: "mariar",
      notification: true,
      webexNotification: true,
      notifyByWelcomeKit: true,
      type: 'Distributor',
      beGeoId: 'test'
    }
    component.selectTeam(team)
    expect(component.selectedPartner).toEqual(team)

    let eaService = fixture.debugElement.injector.get(EaService);
    eaService.isDistiOpty = true;
    team =  {
      firstName: "Maria",
      lastName: "Roark",
      name: "Maria Roark",
      email: "maria.roark@aos5.com",
      userId: "mariar",
      notification: true,
      webexNotification: true,
      notifyByWelcomeKit: true,
      type: 'Partner',
      beGeoId: 'test'
    }
    component.selectTeam(team)
    expect(component.selectedPartner).toEqual(team)
  });

  it("call selectType", () => { 
    const type =  {
      "id": 1,
      "name": 'test'
    }
    component.selectedPartner = {
     type: 'Partner'
   }
   component.selectType(type);
   expect(component.showSearchDrop).toBeFalsy()
  })

  it("call checkAndSetPartnerforSfdcLogin", () => { 
    let eaStoreService = fixture.debugElement.injector.get(EaStoreService);
    eaStoreService.userInfo =  {
      userId: 'test'
    };
    let projectStoreService = fixture.debugElement.injector.get(ProjectStoreService);
    projectStoreService.projectData = {
      dealInfo: {
        partnerDeal : true
      },
      objId: 'test',
      partnerTeam: {
        partnerContacts: [
          {
            firstName: "Maria",
            lastName: "Roark",
            name: "Maria Roark",
            email: "maria.roark@aos5.com",
            userId: "test",
            notification: true,
            webexNotification: true,
            notifyByWelcomeKit: true,
            beGeoId : 1
          },
        ],
        distiContacts:[{
          beId: 'test',
          beName: 'test',
          name: 'test',
          webexNotification: true,
          notifyByWelcomeKit: true
        }]
      }
    }
    component.partnerArr = [ 
      {
        firstName: "Maria",
      lastName: "Roark",
      name: "Maria Roark",
      email: "maria.roark@aos5.com",
      userId: "mariar",
      notification: true,
      webexNotification: true,
      notifyByWelcomeKit: true,
      type: 'Partner',
      beGeoId: 1
      }
    ]
   component.checkAndSetPartnerforSfdcLogin();
   expect(component.searchTeam.webexNotification).toBeFalsy()
  })
});
