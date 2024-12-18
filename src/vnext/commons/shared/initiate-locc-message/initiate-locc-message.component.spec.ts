import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
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

import { InitiateLoccMessageComponent } from "./initiate-locc-message.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

class mockProjectService {
  projectData = {
    ciscoTeam: {
      contacts: [
        {
          firstName: "test",
          lastName: "test",
        },
      ],
    },
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

describe("InitiateLoccMessageComponent", () => {
  let component: InitiateLoccMessageComponent;
  let fixture: ComponentFixture<InitiateLoccMessageComponent>;
  let modalService: NgbModal;
  let modalRef: NgbModalRef;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InitiateLoccMessageComponent, LocalizationPipe],
      providers: [
        { provide: ProjectStoreService, useClass: mockProjectService },
        CiscoTeamService,
        ProjectRestService,
        MessageService,
        VnextService,
        BlockUiService,
        ProjectService,
        LocalizationService,
        VnextStoreService,
        UtilitiesService,
        CurrencyPipe,
        ProposalStoreService,
        DataIdConstantsService,
        { provide: EaRestService, useClass: MockEaRestService },
      ],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateLoccMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show message", () => {
    component.showMessage();
    expect(component.showLoccMessage).toBe(false);
  });

  it("should initiate LOCC", () => {
    component.initiateLocc();
    expect(component.projectService.showLocc).toBe(true);
  });
});
