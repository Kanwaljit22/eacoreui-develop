import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { EaRestService } from "ea/ea-rest.service";
import { EaStoreService } from "ea/ea-store.service";
import { EaService } from "ea/ea.service";
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
import { LoccStatusComponent } from "./locc-status.component";
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

describe("LoccStatusComponent", () => {
  let component: LoccStatusComponent;
  let fixture: ComponentFixture<LoccStatusComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoccStatusComponent, LocalizationPipe],
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
        EaRestService,
        ProposalStoreService,
        EaService,
        EaStoreService,
        DataIdConstantsService
      ],
      imports: [HttpClientModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoccStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call method to showLocc", () => {
    let service = fixture.debugElement.injector.get(ProposalStoreService);

    service.proposalData = {
      objId: "test",
    };
    const func = jest.spyOn(component, "openLoccModal");
    component.showLocc();
    expect(func).toHaveBeenCalled();
  });

  it("should call method to show dropdown", () => {
    let service = fixture.debugElement.injector.get(VnextStoreService);

    service.loccDetail = {
      loccSigned: false,
    };
    const func = jest.spyOn(component, "showLocc");
    component.showDropDown();
    expect(func).toHaveBeenCalled();
  });

  it("should call method to show dropdown", () => {
    let service = fixture.debugElement.injector.get(VnextStoreService);

    service.loccDetail = {
      loccSigned: true,
    };
    component.showLoccDrop = false;
    component.showDropDown();
    expect(component.showLoccDrop).toBeTruthy();
  });

  it("should open locc modal", () => {
    component.openLoccModal();
  });
});
