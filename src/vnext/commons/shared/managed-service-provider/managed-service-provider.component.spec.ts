import { CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
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
import { CiscoTeamService } from "../cisco-team/cisco-team.service";
import { LocalizationPipe } from "../pipes/localization.pipe";

import { ManagedServiceProviderComponent } from "./managed-service-provider.component";
import { DataIdConstantsService } from "vnext/commons/services/data-id-constants.service";

describe("ManagedServiceProviderComponent", () => {
  let component: ManagedServiceProviderComponent;
  let fixture: ComponentFixture<ManagedServiceProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagedServiceProviderComponent, LocalizationPipe],
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
    fixture = TestBed.createComponent(ManagedServiceProviderComponent);
    component = fixture.componentInstance;
    console.log("Running test suite: ManagedServiceProviderComponent");
    fixture.detectChanges();
  });

  it("should create", () => {
    console.log("Running test case: should create ManagedServiceProviderComponent");
    expect(component).toBeTruthy();
  });

  it("should call method to show dropdown", () => {
    console.log("Running test case: should call method to show dropdown 2");
    let service = fixture.debugElement.injector.get(VnextStoreService);
    component.isEditProposal = true;
    service.loccDetail = {
      loccSigned: false,
    };
    const mockEevent: Event = <Event>(<any>{
      target: {
        id: "no",
      },
    });
    component.changeMsp(mockEevent);
    expect(component.showMspInfo).toBeFalsy();
    mockEevent.target["id"] = "yes";
    component.changeMsp(mockEevent);
    expect(component.showMspInfo).toBeTruthy();
  });

  it("should call method to show dropdown", () => {
    console.log("Running test case: should call method to show dropdown 3");
    let service = fixture.debugElement.injector.get(VnextStoreService);
    component.isEditProposal = true;
    service.loccDetail = {
      loccSigned: false,
    };
    const mockEevent: Event = <Event>(<any>{
      target: {
        id: "yes",
      },
    });
    component.changeMsp(mockEevent);
    expect(component.showMspInfo).toBeTruthy();
  });
});
