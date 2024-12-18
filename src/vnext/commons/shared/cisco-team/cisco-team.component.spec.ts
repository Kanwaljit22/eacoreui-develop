import { CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EaRestService } from 'ea/ea-rest.service';
import { of } from 'rxjs';
import { MessageService } from 'vnext/commons/message/message.service';
import { BlockUiService } from 'vnext/commons/services/block-ui.service';
import { LocalizationService } from 'vnext/commons/services/localization.service';
import { UtilitiesService } from 'vnext/commons/services/utilities.service';
import { VnextStoreService } from 'vnext/commons/services/vnext-store.service';
import { ManageTeamComponent } from 'vnext/modals/manage-team/manage-team.component';
import { ProjectRestService } from 'vnext/project/project-rest.service';
import { ProjectStoreService } from 'vnext/project/project-store.service';
import { ProjectService } from 'vnext/project/project.service';
import { ProposalStoreService } from 'vnext/proposal/proposal-store.service';
import { VnextService } from 'vnext/vnext.service';
import { LocalizationPipe } from '../pipes/localization.pipe';

import { CiscoTeamComponent } from './cisco-team.component';
import { CiscoTeamService } from './cisco-team.service';
import { DataIdConstantsService } from 'vnext/commons/services/data-id-constants.service';
import { ElementIdConstantsService } from 'vnext/commons/services/element-id-constants.service';

class mockProjectService {
  projectData = {
    ciscoTeam: {
      contacts : [{
        firstName: 'test',
        lastName: 'test'
      }]
    }
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

describe('CiscoTeamComponent', () => {
  let component: CiscoTeamComponent;
  let fixture: ComponentFixture<CiscoTeamComponent>;
  let modalService: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CiscoTeamComponent,LocalizationPipe ],
      providers: [{provide:ProjectStoreService, useClass: mockProjectService}, CiscoTeamService, {provide:ProjectRestService, useClass:mockProjectRestService}, MessageService, VnextService, BlockUiService, ProjectService, LocalizationService, VnextStoreService, UtilitiesService, CurrencyPipe, EaRestService, ProposalStoreService, DataIdConstantsService, ElementIdConstantsService],
      imports: [HttpClientModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiscoTeamComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInIt', () => {
    const spy = jest.spyOn(component, 'getInitData')
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call ngOnInIt', () => {
    const data = {
      data: [{
        fullName: 'test'
      }]
    }
    component.searchMember.setValue('test')
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'searchMember').mockReturnValue(of(data))
    component.ngOnInit();
  });

  it('should call ngOnInIt', () => {
    component.searchMember.setValue('')
    component.ngOnInit();
  });

  it('should call expandCiscoTeams', () => {
    component.expandCiscoTeam = false;
    component.expandCiscoTeams();
    expect(component.expandCiscoTeam).toBe(true);
  });

  it('should call expandCiscoTeams', () => {
    component.expandCiscoTeam = true;
    component.expandCiscoTeams();
    expect(component.expandCiscoTeam).toBeFalsy();
  });

  it('should call updateAllTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'webexNotification';
    const event = true;
    component.type = 'CISCO';
    const data = {
      error: true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data))
    component.updateAllTeamMember(notiication, event);
  });

  it('should call updateAllTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'email';
    const event = true;
    component.type = 'CISCO';
    const data = {
      error: true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data))
    component.updateAllTeamMember(notiication, event);
  });

  it('should call updateAllTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'email';
    const event = true;
    component.type = 'CISCO';
    const data = {
      data: [{
        firstName: 'test'
      }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.updateAllTeamMember(notiication, event);
  });

  it('should call updateTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'webexNotification';
    const member = {
      webexNotification: true
    };
    component.type = 'CISCO';
    const data = {
      data: [{
        firstName: 'test'
      }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.updateTeamMember(member, notiication);
  });

  it('should call updateTeamMember2', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'notifyByWelcomeKit';
    const member = {
      firstName: 'test',
      notifyByWelcomeKit: false
    };
    component.type = 'CISCO';
    const data = {
      data: [{
        firstName: 'test'
      }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data));
    component.updateTeamMember(member, notiication);
  });

  it('should call updateTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'webexNotification';
    const member = {
      firstName: 'test',
      webexNotification: false
    };
    component.type = 'CISCO';
    const data = {
     error: true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.updateTeamMember(member, notiication);
  });

  it('should call updateTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const notiication = 'notifyByWelcomeKit';
    const member = {
      firstName: 'test',
      notifyByWelcomeKit: false
    };
    component.type = 'CISCO';
    const data = {
     error: true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'updateTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.updateTeamMember(member, notiication);
  });

  it('should call deleteTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const index = 3;
    const member = {
      userId: 'test',
      notifyByWelcomeKit: false
    };
    component.type = 'CISCO';
    const data = {
     data: [ {
      firstName: 'test'
     }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'deleteTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.deleteTeamMember(member, index);
  });

  it('should call deleteTeamMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    const index = 3;
    const member = {
      userId: 'test',
      notifyByWelcomeKit: false
    };
    component.type = 'CISCO';
    const data = {
     error : true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'deleteTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.deleteTeamMember(member, index);
  });

  it('should call addMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    component.selectedMembers = [{
      ccoId: 'test',
      firstName: 'test'
    }];
    component.webexAddCheck = true;
    component.welcomeAddCheck = true;
    const data = {
     data: [ {
      firstName: 'test'
     }]
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'addTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.addMember();
    expect(component.allWebexCheck).toBe(false);
  });

  it('should call addMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test'
    }];
    component.selectedMembers = [{
      ccoId: 'test',
      firstName: 'test'
    }];
    component.webexAddCheck = true;
    component.welcomeAddCheck = true;
    const data = {
     error: true
    }
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'addTeamMember').mockReturnValue(of(data));
    component.enableManageTeamEdit = false;
    component.addMember();
    expect(component.selectedMembers).toEqual([]);
  });

  it('should call selectMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test',
      userId: 'test'
    }];
    component.selectedMembers = [{
      ccoId: 'test',
      firstName: 'test'
    }];
    const suggestion = {
      ccoId: 'test'
    }
    component.selectMember(suggestion);
  });

  it('should call selectMember', () => {
    component.ciscoTeamArray = [{
      firstName: 'test',
      userId: 'test'
    }];
    component.selectedMembers = [{
      ccoId: 'test',
      firstName: 'test'
    }];
    const suggestion = {
    }
    component.selectMember(suggestion);
  });

  it('should call removeSelectedMember', () => {
    component.selectedMembers = [{
      ccoId: 'test',
      firstName: 'test'
    }];
    const index = 2;
    component.removeSelectedMember(index);
  });

  it('should call hideDropdown', fakeAsync(() => {
    component.hideDropdown();
    tick(500);
    flush();
  }));

  it('should call openManageTeam', () => {
    let service = fixture.debugElement.injector.get(ProjectStoreService);
    service.projectEditAccess = true;
    service.projectData = {
      objId: 'test',
      ciscoTeam:{
        contacts:[{
          "firstName": 'test'
        }]
      }
    }
    const data = {
      data: [{
        firstName: 'test'
      }]
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    modalService = TestBed.get(NgbModal);
    modalRef = modalService.open(ManageTeamComponent, ngbModalOptions);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve, reject) => resolve({continue: true, addRemove: true
        }));
    let restService = fixture.debugElement.injector.get(ProjectRestService);
    jest.spyOn(restService, 'getProjectDetailsById').mockReturnValue(of(data));
    let projectService = fixture.debugElement.injector.get(ProjectService);
    projectService.manageTeams.next(true)
    component.openManageTeam();
  });

  it('should call openManageTeam', () => {
    let service = fixture.debugElement.injector.get(ProjectStoreService);
    service.projectEditAccess = true;
    service.projectData = {
      objId: 'test',
      ciscoTeam:{
        contacts:[{
          "firstName": 'test'
        }]
      }
    }
    const data = {
      data: [{
        firstName: 'test'
      }]
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'lg vnext-manage-team',
      backdropClass: 'modal-backdrop-vNext'
    };
    modalService = TestBed.get(NgbModal);
    modalRef = modalService.open(ManageTeamComponent, ngbModalOptions);
    jest.spyOn(modalService, "open").mockReturnValue(modalRef);
    modalRef.result =  new Promise((resolve, reject) => resolve({continue: false}));
    component.openManageTeam();
  });

  it('should call openManageTeam',() => {
    let service = fixture.debugElement.injector.get(ProjectStoreService);
    service.projectEditAccess = false;
    service.projectData = {
      ciscoTeam:{
        contacts:[{
          "firstName": 'test'
        }]
      }
    };
    component.openManageTeam();
  });

  it('should call getInitData', () => {
    let service = fixture.debugElement.injector.get(ProjectStoreService);
    service.projectData = {
      ciscoTeam:{
        contacts:[{
          "firstName": 'test'
        }]
      }
    };
    component.ciscoTeamArray = [
      {
        "firstName": 'test'
      }
    ]
    component.getInitData();
  });

});
