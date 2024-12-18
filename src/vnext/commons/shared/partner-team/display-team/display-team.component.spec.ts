import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
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
import { CiscoTeamService } from "../../cisco-team/cisco-team.service";
import { LocalizationPipe } from "../../pipes/localization.pipe";

import { DisplayTeamComponent } from "./display-team.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("DisplayTeamComponent", () => {
  let component: DisplayTeamComponent;
  let fixture: ComponentFixture<DisplayTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayTeamComponent, LocalizationPipe],
      providers: [
        ProjectStoreService,
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTeamComponent);
    component = fixture.componentInstance;
    console.log("Running test suite: DisplayTeamComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create");
    expect(component).toBeTruthy();
  });

  it("should expand all", () => {
    console.log("Running test case: hould expand all");
    component.isExpand = false;
    component.expand();
    expect(component.isExpand).toBeTruthy();
  });

  it("should expand all", () => {
    console.log("Running test case: should expand all");
    component.isExpand = false;
    component.expandAll();
    expect(component.showExpandAll).toBeFalsy();
    expect(component.isExpand).toBeTruthy();
  });

  // it('call checkboxSelection should emit data',
  //   inject([component.checkboxSelection], (component) => {
  //     component.teamType = ''
  //     const obj ={updatedTeam:[],type:'partner',notificationType:'select'}

  //     component.checkboxSelection.subscribe((message) => {
  //       expect(Object.keys(message)).toBeTruthy();
  //     })
  //     component.selectTeamCheckbox([], 'select');
  // }));

  // it('call deleteTeam should emit data',
  //   inject([component.deleteTeam], (component) => {
  //     component.teamType = ''
  //     const obj ={userID:'mariar',type:'partner'}

  //     component.deleteTeam.subscribe((message) => {
  //       expect(Object.keys(message)).toBeTruthy();
  //     })
  //     component.deleteTeamMember({userId: 'mariar'});
  // }));
});
